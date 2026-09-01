"use client";

import { useSyncExternalStore } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartLine = {
  productId: string;
  variantId: string | null;
  slug: string;
  name: string;
  image: string;
  price: number;
  size?: string;
  color?: string;
  quantity: number;
};

type CartState = {
  lines: CartLine[];
  isOpen: boolean;
  open: () => void;
  close: () => void;
  addLine: (line: Omit<CartLine, "quantity">, quantity?: number) => void;
  removeLine: (productId: string, variantId: string | null) => void;
  updateQuantity: (productId: string, variantId: string | null, quantity: number) => void;
  clear: () => void;
};

export const MAX_LINE_QUANTITY = 10;

const lineKey = (productId: string, variantId: string | null) => `${productId}::${variantId ?? "default"}`;

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      lines: [],
      isOpen: false,
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
      addLine: (line, quantity = 1) =>
        set((state) => {
          const key = lineKey(line.productId, line.variantId);
          const existing = state.lines.find((l) => lineKey(l.productId, l.variantId) === key);

          if (existing) {
            return {
              lines: state.lines.map((l) =>
                lineKey(l.productId, l.variantId) === key
                  ? { ...l, quantity: Math.min(MAX_LINE_QUANTITY, l.quantity + quantity) }
                  : l,
              ),
              isOpen: true,
            };
          }

          return { lines: [...state.lines, { ...line, quantity }], isOpen: true };
        }),
      removeLine: (productId, variantId) =>
        set((state) => ({
          lines: state.lines.filter((l) => lineKey(l.productId, l.variantId) !== lineKey(productId, variantId)),
        })),
      updateQuantity: (productId, variantId, quantity) =>
        set((state) => ({
          lines: state.lines
            .map((l) =>
              lineKey(l.productId, l.variantId) === lineKey(productId, variantId)
                ? { ...l, quantity: Math.min(MAX_LINE_QUANTITY, quantity) }
                : l,
            )
            .filter((l) => l.quantity > 0),
        })),
      clear: () => set({ lines: [] }),
    }),
    {
      name: "fauve-cart",
      partialize: (state) => ({ lines: state.lines }),
      // Rehydrated after mount so server and first client render match.
      skipHydration: true,
    },
  ),
);

export function useCartCount() {
  return useCartStore((state) => state.lines.reduce((sum, line) => sum + line.quantity, 0));
}

export function useCartSubtotal() {
  return useCartStore((state) => state.lines.reduce((sum, line) => sum + line.price * line.quantity, 0));
}

const noopSubscribe = () => () => {};

/** False during SSR and the hydration pass, true afterwards. */
export function useHydrated() {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}

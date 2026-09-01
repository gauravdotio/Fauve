"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type WishlistItem = {
  productId: string;
  slug: string;
  name: string;
  image: string;
  price: number;
};

type WishlistState = {
  items: WishlistItem[];
  toggle: (item: WishlistItem) => void;
  remove: (productId: string) => void;
};

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set) => ({
      items: [],
      toggle: (item) =>
        set((state) => ({
          items: state.items.some((i) => i.productId === item.productId)
            ? state.items.filter((i) => i.productId !== item.productId)
            : [...state.items, item],
        })),
      remove: (productId) => set((state) => ({ items: state.items.filter((i) => i.productId !== productId) })),
    }),
    { name: "fauve-wishlist", skipHydration: true },
  ),
);

export function useIsWishlisted(productId: string) {
  return useWishlistStore((state) => state.items.some((i) => i.productId === productId));
}

export function useWishlistCount() {
  return useWishlistStore((state) => state.items.length);
}

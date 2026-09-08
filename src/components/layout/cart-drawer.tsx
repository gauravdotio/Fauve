"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, ShoppingBag, Minus, Plus, Trash2 } from "lucide-react";
import { useCartStore, useCartSubtotal } from "@/store/cart-store";
import { buttonVariants } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { EmptyState } from "@/components/ui/empty-state";

export function CartDrawer() {
  const isOpen = useCartStore((s) => s.isOpen);
  const close = useCartStore((s) => s.close);
  const lines = useCartStore((s) => s.lines);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeLine = useCartStore((s) => s.removeLine);
  const subtotal = useCartSubtotal();

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, close]);

  return (
    <div
      className={`fixed inset-0 z-[70] transition-opacity duration-300 ${
        isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
      }`}
      inert={!isOpen}
    >
      <div className="absolute inset-0 bg-ink/40" onClick={close} />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-surface shadow-2xl transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-border px-6 py-5">
          <h2 className="font-serif text-xl text-ink">
            Your Bag {lines.length > 0 && <span className="text-sm text-ink-soft">({lines.length})</span>}
          </h2>
          <button
            type="button"
            aria-label="Close cart"
            onClick={close}
            className="flex h-8 w-8 items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-surface-alt hover:text-ink"
          >
            <X size={18} />
          </button>
        </div>

        {lines.length === 0 ? (
          <div className="flex flex-1 items-center justify-center px-6">
            <EmptyState
              icon={ShoppingBag}
              title="Your bag is empty"
              description="Explore the collection and find something to add."
              actionLabel="Continue shopping"
              actionHref="/shop"
              onAction={close}
            />
          </div>
        ) : (
          <>
            <ul className="flex-1 overflow-y-auto px-6 py-4">
              {lines.map((line) => (
                <li key={`${line.productId}-${line.variantId}`} className="flex gap-4 border-b border-border py-5 first:pt-0">
                  <div className="relative h-24 w-20 shrink-0 overflow-hidden bg-surface-alt">
                    <Image src={line.image} alt={line.name} fill sizes="80px" className="object-cover" />
                  </div>
                  <div className="flex flex-1 flex-col gap-1.5">
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        href={`/product/${line.slug}`}
                        onClick={close}
                        className="text-sm font-medium text-ink hover:text-accent"
                      >
                        {line.name}
                      </Link>
                      <button
                        type="button"
                        aria-label={`Remove ${line.name} from bag`}
                        onClick={() => removeLine(line.productId, line.variantId)}
                        className="text-ink-faint transition-colors hover:text-error"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                    {(line.size || line.color) && (
                      <p className="text-xs text-ink-soft">
                        {[line.color, line.size].filter(Boolean).join(" / ")}
                      </p>
                    )}
                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex h-8 items-center border border-border-strong">
                        <button
                          type="button"
                          aria-label="Decrease quantity"
                          onClick={() => updateQuantity(line.productId, line.variantId, line.quantity - 1)}
                          className="flex h-full w-7 items-center justify-center text-ink-soft hover:text-ink"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="flex h-full w-7 items-center justify-center text-xs tabular-nums">
                          {line.quantity}
                        </span>
                        <button
                          type="button"
                          aria-label="Increase quantity"
                          onClick={() => updateQuantity(line.productId, line.variantId, line.quantity + 1)}
                          className="flex h-full w-7 items-center justify-center text-ink-soft hover:text-ink"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                      <span className="text-sm font-medium tabular-nums text-ink">
                        {formatPrice(line.price * line.quantity)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="border-t border-border px-6 py-5">
              <div className="mb-4 flex items-center justify-between text-sm">
                <span className="text-ink-soft">Subtotal</span>
                <span className="font-medium tabular-nums text-ink">{formatPrice(subtotal)}</span>
              </div>
              <p className="mb-4 text-xs text-ink-faint">Shipping and taxes calculated at checkout.</p>
              <Link
                href="/cart"
                onClick={close}
                className={buttonVariants({ size: "lg", className: "w-full" })}
              >
                View Bag &amp; Checkout
              </Link>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Lock, ShoppingBag } from "lucide-react";
import { MAX_LINE_QUANTITY, useCartStore, useCartSubtotal, useHydrated } from "@/store/cart-store";
import { QuantitySelector } from "@/components/ui/quantity-selector";
import { EmptyState } from "@/components/ui/empty-state";
import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatPrice } from "@/lib/utils";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/commerce-config";

export function CartView() {
  const hydrated = useHydrated();
  const lines = useCartStore((s) => s.lines);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeLine = useCartStore((s) => s.removeLine);
  const subtotal = useCartSubtotal();

  if (!hydrated) {
    return (
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12" role="status" aria-label="Loading your bag">
        <div className="flex flex-col gap-6 lg:col-span-8">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex gap-5">
              <Skeleton className="aspect-[4/5] w-24 sm:w-28" />
              <div className="flex flex-1 flex-col gap-3">
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-3 w-1/4" />
              </div>
            </div>
          ))}
        </div>
        <Skeleton className="h-64 lg:col-span-4" />
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <EmptyState
        icon={ShoppingBag}
        title="Your bag is empty"
        description="Nothing here yet. Explore the collection and add a few pieces you'll keep for years."
        actionLabel="Start shopping"
        actionHref="/shop"
      />
    );
  }

  const remaining = FREE_SHIPPING_THRESHOLD - subtotal;
  const progress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);
  const itemCount = lines.reduce((sum, line) => sum + line.quantity, 0);

  return (
    <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
      <div className="lg:col-span-8">
        <ul className="divide-y divide-border border-y border-border">
          {lines.map((line) => (
            <li key={`${line.productId}-${line.variantId}`} className="flex gap-5 py-6">
              <Link
                href={`/product/${line.slug}`}
                className="relative aspect-[4/5] w-24 shrink-0 overflow-hidden bg-surface-alt sm:w-28"
              >
                {line.image && <Image src={line.image} alt={line.name} fill sizes="112px" className="object-cover" />}
              </Link>
              <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <Link href={`/product/${line.slug}`} className="text-sm font-medium text-ink hover:text-accent sm:text-base">
                      {line.name}
                    </Link>
                    {(line.color || line.size) && (
                      <p className="mt-1 text-sm text-ink-soft">{[line.color, line.size].filter(Boolean).join(" / ")}</p>
                    )}
                    <p className="mt-1 text-sm tabular-nums text-ink-soft">{formatPrice(line.price)}</p>
                  </div>
                  <p className="shrink-0 text-sm font-medium tabular-nums text-ink sm:text-base">
                    {formatPrice(line.price * line.quantity)}
                  </p>
                </div>
                <div className="mt-auto flex items-center justify-between gap-4 pt-4">
                  <QuantitySelector
                    value={line.quantity}
                    min={1}
                    max={MAX_LINE_QUANTITY}
                    onChange={(q) => updateQuantity(line.productId, line.variantId, q)}
                    className="h-10"
                  />
                  <button
                    type="button"
                    onClick={() => removeLine(line.productId, line.variantId)}
                    className="text-xs text-ink-soft underline decoration-border-strong underline-offset-4 hover:text-error hover:decoration-error"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <Link href="/shop" className="mt-6 inline-flex items-center gap-2 text-sm text-ink-soft hover:text-ink">
          <ArrowLeft size={15} /> Continue shopping
        </Link>
      </div>

      <aside className="lg:col-span-4">
        <div className="border border-border bg-surface p-6 lg:sticky lg:top-28">
          <h2 className="font-serif text-xl text-ink">Order Summary</h2>

          <div className="mt-5">
            <div className="h-1 w-full overflow-hidden rounded-full bg-surface-alt">
              <div className="h-full rounded-full bg-success transition-all duration-500" style={{ width: `${progress}%` }} />
            </div>
            <p className="mt-2 text-xs text-ink-soft">
              {remaining > 0 ? (
                <>
                  You&apos;re <span className="font-medium text-ink">{formatPrice(remaining)}</span> away from free shipping.
                </>
              ) : (
                "You've unlocked free standard shipping."
              )}
            </p>
          </div>

          <dl className="mt-6 flex flex-col gap-3 border-t border-border pt-5 text-sm">
            <div className="flex justify-between">
              <dt className="text-ink-soft">Subtotal ({itemCount} {itemCount === 1 ? "item" : "items"})</dt>
              <dd className="tabular-nums text-ink">{formatPrice(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink-soft">Shipping</dt>
              <dd className="text-ink">{remaining <= 0 ? "Free" : "Calculated at checkout"}</dd>
            </div>
            <div className="flex justify-between border-t border-border pt-4 text-base">
              <dt className="font-medium text-ink">Estimated total</dt>
              <dd className="font-medium tabular-nums text-ink">{formatPrice(subtotal)}</dd>
            </div>
          </dl>

          <Link href="/checkout" className={buttonVariants({ size: "lg", className: "mt-6 w-full" })}>
            <Lock size={15} /> Checkout
          </Link>
          <p className="mt-4 text-center text-xs text-ink-faint">Pay by cash or card on delivery · Free returns within 30 days</p>
        </div>
      </aside>
    </div>
  );
}

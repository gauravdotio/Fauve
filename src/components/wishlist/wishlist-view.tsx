"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, X } from "lucide-react";
import { useWishlistStore } from "@/store/wishlist-store";
import { useHydrated } from "@/store/cart-store";
import { EmptyState } from "@/components/ui/empty-state";
import { ProductGridSkeleton } from "@/components/ui/skeleton";
import { buttonVariants } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";

export function WishlistView() {
  const hydrated = useHydrated();
  const items = useWishlistStore((s) => s.items);
  const remove = useWishlistStore((s) => s.remove);

  if (!hydrated) return <ProductGridSkeleton count={4} />;

  if (items.length === 0) {
    return (
      <EmptyState
        icon={Heart}
        title="Your wishlist is empty"
        description="Tap the heart on any product to save it here for later."
        actionLabel="Discover products"
        actionHref="/shop"
      />
    );
  }

  return (
    <>
      <p className="mb-8 text-sm text-ink-soft">
        {items.length} saved {items.length === 1 ? "piece" : "pieces"}
      </p>
      <ul className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 sm:gap-x-5 lg:grid-cols-4 lg:gap-x-6">
        {items.map((item) => (
          <li key={item.productId} className="group flex flex-col gap-3">
            <div className="relative aspect-[4/5] overflow-hidden bg-surface-alt">
              <Link href={`/product/${item.slug}`} className="absolute inset-0" tabIndex={-1} aria-hidden>
                {item.image && (
                  <Image
                    src={item.image}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  />
                )}
              </Link>
              <button
                type="button"
                onClick={() => remove(item.productId)}
                aria-label={`Remove ${item.name} from wishlist`}
                className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-surface/90 text-ink shadow-sm backdrop-blur transition-colors hover:bg-surface hover:text-error"
              >
                <X size={16} />
              </button>
            </div>
            <div className="flex flex-col gap-1">
              <Link href={`/product/${item.slug}`} className="text-sm font-medium text-ink hover:text-accent">
                {item.name}
              </Link>
              <span className="text-sm tabular-nums text-ink">{formatPrice(item.price)}</span>
            </div>
            <Link
              href={`/product/${item.slug}`}
              className={buttonVariants({ variant: "secondary", size: "sm", className: "w-full" })}
            >
              View Product
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}

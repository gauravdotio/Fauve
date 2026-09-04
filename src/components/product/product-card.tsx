"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ShoppingBag, Check } from "lucide-react";
import { Price } from "@/components/ui/price";
import { Rating } from "@/components/ui/rating";
import { ProductBadges } from "@/components/product/product-badges";
import { WishlistButton } from "@/components/product/wishlist-button";
import { useCartStore } from "@/store/cart-store";
import type { ProductCard as ProductCardType } from "@/lib/data";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: ProductCardType;
  priority?: boolean;
  sizes?: string;
}

const QUICK_ADD_CLASSES =
  "flex h-10 w-full items-center justify-center gap-2 bg-ink text-xs font-medium uppercase tracking-wide text-paper transition-colors hover:bg-accent-dark";

export function ProductCard({
  product,
  priority,
  sizes = "(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw",
}: ProductCardProps) {
  const [justAdded, setJustAdded] = useState(false);
  const addLine = useCartStore((s) => s.addLine);

  const href = `/product/${product.slug}`;
  const primaryImage = product.images[0];
  const secondaryImage = product.images[1];
  const isOutOfStock = product.stock <= 0;

  const optionSizes = new Set(product.variants.map((v) => v.size).filter(Boolean));
  const optionColors = new Set(product.variants.map((v) => v.color).filter(Boolean));
  const hasOptions = optionSizes.size > 1 || optionColors.size > 1;

  const handleQuickAdd = () => {
    const variant = product.variants.find((v) => v.stock > 0);
    if (!variant) return;

    addLine({
      productId: product.id,
      variantId: variant.id,
      slug: product.slug,
      name: product.name,
      image: primaryImage?.url ?? "",
      price: product.price,
      size: variant.size ?? undefined,
      color: variant.color ?? undefined,
    });

    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1800);
  };

  return (
    <article className="group relative flex flex-col gap-3">
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-surface-alt">
        <Link href={href} tabIndex={-1} aria-hidden className="absolute inset-0">
          {primaryImage ? (
            <Image
              src={primaryImage.url}
              alt={primaryImage.alt}
              fill
              priority={priority}
              sizes={sizes}
              className={cn(
                "object-cover transition-all duration-700 ease-out",
                secondaryImage ? "lg:group-hover:opacity-0" : "lg:group-hover:scale-[1.03]",
                isOutOfStock && "opacity-70 grayscale-[0.4]",
              )}
            />
          ) : (
            <span className="flex h-full w-full items-center justify-center text-xs text-ink-faint">
              Image coming soon
            </span>
          )}
          {secondaryImage && (
            <Image
              src={secondaryImage.url}
              alt=""
              fill
              sizes={sizes}
              className="hidden scale-105 object-cover opacity-0 transition-all duration-700 ease-out lg:block lg:group-hover:scale-100 lg:group-hover:opacity-100"
            />
          )}
        </Link>

        <div className="pointer-events-none absolute left-3 top-3">
          <ProductBadges
            price={product.price}
            compareAtPrice={product.compareAtPrice}
            stock={product.stock}
            isNew={product.isNew}
          />
        </div>

        <WishlistButton
          productId={product.id}
          slug={product.slug}
          name={product.name}
          image={primaryImage?.url ?? ""}
          price={product.price}
          className="absolute right-3 top-3 lg:opacity-0 lg:transition-opacity lg:group-hover:opacity-100 lg:focus-visible:opacity-100"
        />

        <div className="absolute inset-x-3 bottom-3 hidden translate-y-2 opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100 focus-within:translate-y-0 focus-within:opacity-100 lg:block">
          {isOutOfStock ? (
            <span className={cn(QUICK_ADD_CLASSES, "cursor-not-allowed bg-ink-faint hover:bg-ink-faint")}>
              Sold Out
            </span>
          ) : hasOptions ? (
            <Link href={href} className={QUICK_ADD_CLASSES}>
              Choose Options
            </Link>
          ) : (
            <button type="button" onClick={handleQuickAdd} className={QUICK_ADD_CLASSES}>
              {justAdded ? (
                <>
                  <Check size={14} /> Added
                </>
              ) : (
                <>
                  <ShoppingBag size={14} /> Quick Add
                </>
              )}
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <span className="text-[11px] uppercase tracking-[0.12em] text-ink-faint">{product.category.name}</span>
        <h3 className="text-sm font-medium leading-snug text-ink">
          <Link href={href} className="transition-colors hover:text-accent">
            {product.name}
          </Link>
        </h3>
        <Rating value={product.rating} count={product.reviewCount} />
        <Price price={product.price} compareAtPrice={product.compareAtPrice} className="mt-0.5" />
      </div>
    </article>
  );
}

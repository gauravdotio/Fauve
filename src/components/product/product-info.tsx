"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, RefreshCcw, ShieldCheck, Truck } from "lucide-react";
import { Price } from "@/components/ui/price";
import { Rating } from "@/components/ui/rating";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { QuantitySelector } from "@/components/ui/quantity-selector";
import { WishlistButton } from "@/components/product/wishlist-button";
import { MAX_LINE_QUANTITY, useCartStore } from "@/store/cart-store";
import { calculateDiscountPercent, cn } from "@/lib/utils";

export type PurchaseVariant = {
  id: string;
  size: string | null;
  color: string | null;
  colorHex: string | null;
  stock: number;
  priceOffset: number;
};

interface ProductInfoProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    compareAtPrice: number | null;
    rating: number;
    reviewCount: number;
    shortDescription: string;
    image: string;
    categoryName: string;
    categorySlug: string;
  };
  variants: PurchaseVariant[];
  sizes: string[];
  colors: { name: string; hex: string }[];
}

const LOW_STOCK_THRESHOLD = 5;

export function ProductInfo({ product, variants, sizes, colors }: ProductInfoProps) {
  const router = useRouter();
  const addLine = useCartStore((s) => s.addLine);
  const closeCart = useCartStore((s) => s.close);

  const needsColor = colors.length > 0;
  const needsSize = sizes.length > 0;

  const [color, setColor] = useState<string | null>(() =>
    needsColor ? (variants.find((v) => v.stock > 0 && v.color)?.color ?? colors[0].name) : null,
  );
  const [size, setSize] = useState<string | null>(sizes.length === 1 ? sizes[0] : null);
  const [quantity, setQuantity] = useState(1);
  const [sizeError, setSizeError] = useState(false);
  const [added, setAdded] = useState(false);

  const matches = (v: PurchaseVariant, c: string | null, s: string | null) =>
    (!needsColor || v.color === c) && (!needsSize || v.size === s);
  const stockFor = (c: string | null, s: string | null) => variants.find((v) => matches(v, c, s))?.stock ?? 0;
  const colorStock = (c: string) => variants.filter((v) => v.color === c).reduce((sum, v) => sum + v.stock, 0);
  const totalStock = variants.reduce((sum, v) => sum + v.stock, 0);

  const selected = !needsSize || size ? (variants.find((v) => matches(v, color, size)) ?? null) : null;
  const soldOut = totalStock === 0;
  const selectionUnavailable = (!needsSize || size !== null) && (!selected || selected.stock === 0);
  const available = selected ? selected.stock : needsColor && color ? colorStock(color) : totalStock;
  const price = product.price + (selected?.priceOffset ?? 0);
  const maxQuantity = Math.max(1, Math.min(MAX_LINE_QUANTITY, selected?.stock || MAX_LINE_QUANTITY));
  const effectiveQuantity = Math.min(quantity, maxQuantity);
  const onSale = Boolean(product.compareAtPrice && product.compareAtPrice > product.price);

  const chooseColor = (next: string) => {
    setColor(next);
    setAdded(false);
    if (size && stockFor(next, size) === 0) setSize(null);
  };

  const chooseSize = (next: string) => {
    setSize(next);
    setSizeError(false);
    setAdded(false);
  };

  const addToBag = (buyNow: boolean) => {
    if (needsSize && !size) {
      setSizeError(true);
      document.getElementById("size-options")?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    if (!selected || selected.stock === 0) return;

    addLine(
      {
        productId: product.id,
        variantId: selected.id,
        slug: product.slug,
        name: product.name,
        image: product.image,
        price,
        size: selected.size ?? undefined,
        color: selected.color ?? undefined,
      },
      effectiveQuantity,
    );

    if (buyNow) {
      closeCart();
      router.push("/cart");
      return;
    }

    setAdded(true);
    setTimeout(() => setAdded(false), 2400);
  };

  let primaryLabel: React.ReactNode = "Add to Bag";
  if (soldOut) primaryLabel = "Sold Out";
  else if (needsSize && !size) primaryLabel = "Select a Size";
  else if (selectionUnavailable) primaryLabel = "Sold Out in This Option";
  else if (added)
    primaryLabel = (
      <>
        <Check size={16} /> Added to Bag
      </>
    );

  const availability = soldOut
    ? { dot: "bg-ink-faint", text: "Sold out — restocking soon" }
    : selectionUnavailable
      ? { dot: "bg-error", text: "This option is sold out" }
      : available <= LOW_STOCK_THRESHOLD
        ? { dot: "bg-warning", text: `Only ${available} left${!selected && needsSize ? " in this color" : ""}` }
        : { dot: "bg-success", text: "In stock — ships in 1–2 business days" };

  return (
    <div className="flex flex-col">
      <Link
        href={`/category/${product.categorySlug}`}
        className="w-fit text-xs font-medium uppercase tracking-[0.14em] text-accent hover:text-accent-dark"
      >
        {product.categoryName}
      </Link>
      <h1 className="mt-3 text-balance font-serif text-3xl leading-[1.1] text-ink sm:text-4xl">{product.name}</h1>

      <a href="#reviews" className="mt-3 flex w-fit items-center gap-2 text-sm text-ink-soft hover:text-ink">
        <Rating value={product.rating} size="md" />
        <span className="tabular-nums">{product.rating.toFixed(1)}</span>
        <span className="text-ink-faint">·</span>
        <span className="underline decoration-border-strong underline-offset-4">
          {product.reviewCount.toLocaleString()} reviews
        </span>
      </a>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Price price={price} compareAtPrice={product.compareAtPrice} size="lg" />
        {onSale && <Badge variant="sale">Save {calculateDiscountPercent(product.price, product.compareAtPrice!)}%</Badge>}
      </div>
      <p className="mt-1.5 text-xs text-ink-faint">Taxes calculated at checkout.</p>

      <p className="mt-6 text-sm leading-relaxed text-ink-soft sm:text-base">{product.shortDescription}</p>

      <div className="mt-8 flex flex-col gap-7 border-t border-border pt-8">
        {needsColor && (
          <fieldset>
            <legend className="mb-3 text-sm text-ink-soft">
              Color: <span className="font-medium text-ink">{color}</span>
            </legend>
            <div className="flex flex-wrap gap-2.5">
              {colors.map((option) => {
                const isSelected = option.name === color;
                const isSoldOut = colorStock(option.name) === 0;
                return (
                  <button
                    key={option.name}
                    type="button"
                    onClick={() => chooseColor(option.name)}
                    aria-pressed={isSelected}
                    aria-label={`${option.name}${isSoldOut ? " (sold out)" : ""}`}
                    title={option.name}
                    className={cn(
                      "relative flex h-10 w-10 items-center justify-center rounded-full border p-1 transition-colors",
                      isSelected ? "border-ink" : "border-transparent hover:border-border-strong",
                    )}
                  >
                    <span
                      className={cn("h-full w-full rounded-full border border-black/10", isSoldOut && "opacity-40")}
                      style={{ backgroundColor: option.hex }}
                    />
                    {isSoldOut && (
                      <span className="absolute h-px w-8 rotate-45 bg-ink/60" aria-hidden />
                    )}
                  </button>
                );
              })}
            </div>
          </fieldset>
        )}

        {needsSize && (
          <fieldset id="size-options" aria-describedby={sizeError ? "size-error" : undefined}>
            <legend className="mb-3 flex w-full items-center justify-between text-sm text-ink-soft">
              <span>
                Size{size && <>: <span className="font-medium text-ink">{size}</span></>}
              </span>
            </legend>
            <div className="grid grid-cols-4 gap-2 sm:grid-cols-5">
              {sizes.map((option) => {
                const isSelected = option === size;
                const isUnavailable = stockFor(color, option) === 0;
                return (
                  <button
                    key={option}
                    type="button"
                    disabled={isUnavailable}
                    onClick={() => chooseSize(option)}
                    aria-pressed={isSelected}
                    aria-label={`Size ${option}${isUnavailable ? " (sold out)" : ""}`}
                    className={cn(
                      "flex h-11 items-center justify-center border text-sm transition-colors",
                      isSelected && "border-ink bg-ink text-paper",
                      !isSelected && !isUnavailable && "border-border-strong bg-surface text-ink hover:border-ink",
                      isUnavailable && "cursor-not-allowed border-border bg-surface-alt/60 text-ink-faint line-through",
                      sizeError && !isSelected && !isUnavailable && "border-error/60",
                    )}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
            {sizeError && (
              <p id="size-error" role="alert" className="mt-2.5 text-xs text-error">
                Please select a size to continue.
              </p>
            )}
          </fieldset>
        )}

        <p className="flex items-center gap-2 text-sm text-ink-soft">
          <span className={cn("h-2 w-2 rounded-full", availability.dot)} aria-hidden />
          {availability.text}
        </p>

        <div className="flex flex-col gap-3">
          <div className="flex gap-3">
            <QuantitySelector
              value={effectiveQuantity}
              onChange={setQuantity}
              max={maxQuantity}
              className="h-12 shrink-0"
            />
            <Button
              size="lg"
              className="flex-1"
              disabled={soldOut || selectionUnavailable}
              onClick={() => addToBag(false)}
            >
              {primaryLabel}
            </Button>
          </div>
          <Button
            size="lg"
            variant="secondary"
            className="w-full"
            disabled={soldOut || selectionUnavailable}
            onClick={() => addToBag(true)}
          >
            Buy Now
          </Button>
          <WishlistButton
            variant="inline"
            productId={product.id}
            slug={product.slug}
            name={product.name}
            image={product.image}
            price={product.price}
            className="self-center"
          />
        </div>
      </div>

      <ul className="mt-6 flex flex-col gap-3.5 border-t border-border pt-6 text-sm text-ink-soft">
        <li className="flex items-center gap-3">
          <Truck size={17} strokeWidth={1.5} className="shrink-0 text-ink" />
          Free standard shipping on orders over $100
        </li>
        <li className="flex items-center gap-3">
          <RefreshCcw size={17} strokeWidth={1.5} className="shrink-0 text-ink" />
          Free returns and exchanges within 30 days
        </li>
        <li className="flex items-center gap-3">
          <ShieldCheck size={17} strokeWidth={1.5} className="shrink-0 text-ink" />
          Secure, encrypted checkout
        </li>
      </ul>
    </div>
  );
}

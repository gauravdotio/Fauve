"use client";

import { Heart } from "lucide-react";
import { useIsWishlisted, useWishlistStore } from "@/store/wishlist-store";
import { cn } from "@/lib/utils";

interface WishlistButtonProps {
  productId: string;
  slug: string;
  name: string;
  image: string;
  price: number;
  className?: string;
  variant?: "floating" | "inline";
}

export function WishlistButton({ productId, slug, name, image, price, className, variant = "floating" }: WishlistButtonProps) {
  const isWishlisted = useIsWishlisted(productId);
  const toggle = useWishlistStore((s) => s.toggle);

  const handleClick = () => toggle({ productId, slug, name, image, price });

  if (variant === "inline") {
    return (
      <button
        type="button"
        onClick={handleClick}
        aria-pressed={isWishlisted}
        className={cn(
          "inline-flex h-11 items-center justify-center gap-2 text-sm font-medium text-ink-soft transition-colors hover:text-ink",
          className,
        )}
      >
        <Heart
          size={17}
          className={cn("transition-transform duration-300", isWishlisted && "scale-110 fill-accent text-accent")}
        />
        {isWishlisted ? "Saved to Wishlist" : "Add to Wishlist"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={isWishlisted}
      aria-label={isWishlisted ? `Remove ${name} from wishlist` : `Add ${name} to wishlist`}
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-full bg-surface/90 text-ink shadow-sm backdrop-blur transition-all hover:scale-105 hover:bg-surface",
        className,
      )}
    >
      <Heart
        size={16}
        className={cn("transition-transform duration-300", isWishlisted && "scale-110 fill-accent text-accent")}
      />
    </button>
  );
}

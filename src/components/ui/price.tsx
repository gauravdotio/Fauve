import { cn, formatPrice } from "@/lib/utils";

interface PriceProps {
  price: number;
  compareAtPrice?: number | null;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-2xl",
};

export function Price({ price, compareAtPrice, size = "md", className }: PriceProps) {
  const onSale = Boolean(compareAtPrice && compareAtPrice > price);

  return (
    <span className={cn("inline-flex items-baseline gap-2", className)}>
      <span className={cn("font-medium tabular-nums text-ink", sizeClasses[size])}>{formatPrice(price)}</span>
      {onSale && (
        <span className="text-sm tabular-nums text-ink-faint line-through">{formatPrice(compareAtPrice!)}</span>
      )}
    </span>
  );
}

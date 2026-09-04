import { Badge } from "@/components/ui/badge";
import { calculateDiscountPercent } from "@/lib/utils";

interface ProductBadgesProps {
  price: number;
  compareAtPrice?: number | null;
  stock: number;
  isNew: boolean;
}

const LOW_STOCK_THRESHOLD = 5;

export function ProductBadges({ price, compareAtPrice, stock, isNew }: ProductBadgesProps) {
  const isOutOfStock = stock <= 0;
  const isSale = !isOutOfStock && Boolean(compareAtPrice && compareAtPrice > price);
  const isLowStock = !isOutOfStock && stock <= LOW_STOCK_THRESHOLD;
  const showNew = isNew && !isOutOfStock;

  if (!isOutOfStock && !isSale && !showNew && !isLowStock) return null;

  return (
    <div className="flex flex-wrap gap-1.5">
      {isOutOfStock && <Badge variant="neutral">Sold Out</Badge>}
      {isSale && <Badge variant="sale">−{calculateDiscountPercent(price, compareAtPrice!)}%</Badge>}
      {showNew && <Badge variant="new">New</Badge>}
      {isLowStock && <Badge variant="warning">Only {stock} left</Badge>}
    </div>
  );
}

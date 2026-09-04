import { ProductCard } from "@/components/product/product-card";
import { EmptyState } from "@/components/ui/empty-state";
import type { ProductCard as ProductCardType } from "@/lib/data";
import { cn } from "@/lib/utils";

interface ProductGridProps {
  products: ProductCardType[];
  columns?: 3 | 4;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyActionLabel?: string;
  emptyActionHref?: string;
  priorityCount?: number;
}

export function ProductGrid({
  products,
  columns = 4,
  emptyTitle = "No products found",
  emptyDescription = "Try adjusting your filters or check back soon for new arrivals.",
  emptyActionLabel = "Browse all products",
  emptyActionHref = "/shop",
  priorityCount = 0,
}: ProductGridProps) {
  if (products.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        actionLabel={emptyActionLabel}
        actionHref={emptyActionHref}
      />
    );
  }

  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 sm:gap-x-5",
        columns === 4 ? "lg:grid-cols-4 lg:gap-x-6" : "lg:gap-x-6",
      )}
    >
      {products.map((product, index) => (
        <ProductCard
          key={product.id}
          product={product}
          priority={index < priorityCount}
          sizes={
            columns === 4
              ? "(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
              : "(min-width: 1024px) 28vw, (min-width: 640px) 33vw, 50vw"
          }
        />
      ))}
    </div>
  );
}

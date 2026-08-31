import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={cn("relative overflow-hidden bg-surface-alt", className)} aria-hidden>
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/50 to-transparent" />
    </div>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      <Skeleton className="aspect-[4/5] w-full" />
      <div className="flex flex-col gap-2">
        <Skeleton className="h-2.5 w-1/4" />
        <Skeleton className="h-3.5 w-2/3" />
        <Skeleton className="h-3.5 w-1/3" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8, columns = 4 }: { count?: number; columns?: 3 | 4 }) {
  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 sm:gap-x-5 lg:gap-x-6",
        columns === 4 && "lg:grid-cols-4",
      )}
    >
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function CatalogSkeleton({ withBanner = false }: { withBanner?: boolean }) {
  return (
    <div role="status" aria-label="Loading products">
      <div className="container-page pt-6">
        <Skeleton className="h-3 w-32" />
        {withBanner ? (
          <Skeleton className="mt-6 h-[420px] w-full md:h-[340px]" />
        ) : (
          <div className="mt-12 flex flex-col gap-3 pb-10">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-12 w-72" />
            <Skeleton className="h-4 w-full max-w-md" />
          </div>
        )}
      </div>
      <div className="container-page mt-8 pb-24">
        <div className="mb-8 flex justify-between">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-10 w-44" />
        </div>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[220px_minmax(0,1fr)] xl:gap-16">
          <div className="hidden flex-col gap-4 lg:flex">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
          </div>
          <ProductGridSkeleton count={6} columns={3} />
        </div>
      </div>
    </div>
  );
}

export function ProductDetailSkeleton() {
  return (
    <div className="container-page pb-24 pt-6" role="status" aria-label="Loading product">
      <Skeleton className="h-3 w-48" />
      <div className="mt-6 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12 xl:gap-16">
        <div className="flex flex-col-reverse gap-3 lg:col-span-7 lg:flex-row lg:gap-4">
          <div className="flex gap-3 lg:w-20 lg:flex-col">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="aspect-[4/5] w-16 shrink-0 lg:w-full" />
            ))}
          </div>
          <Skeleton className="aspect-[4/5] w-full lg:flex-1" />
        </div>
        <div className="flex flex-col gap-5 lg:col-span-5">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-7 w-28" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-10 w-2/3" />
          <Skeleton className="h-11 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    </div>
  );
}

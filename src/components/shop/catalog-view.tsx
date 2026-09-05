import { FilterPanel } from "@/components/shop/filter-panel";
import { MobileFilters } from "@/components/shop/mobile-filters";
import { SortSelect } from "@/components/shop/sort-select";
import { ActiveFilters } from "@/components/shop/active-filters";
import { Pagination } from "@/components/shop/pagination";
import { ProductGrid } from "@/components/product/product-grid";
import { buildCatalogHref, countActiveFilters, type CatalogState } from "@/lib/catalog-params";
import type { ProductCard } from "@/lib/data";
import type { CategoryWithCount, PaginatedResult } from "@/lib/types";

interface CatalogViewProps {
  basePath: string;
  state: CatalogState;
  result: PaginatedResult<ProductCard>;
  facets: { sizes: string[]; colors: { name: string; hex: string }[] };
  categories?: CategoryWithCount[];
}

export function CatalogView({ basePath, state, result, facets, categories }: CatalogViewProps) {
  const panelProps = {
    basePath,
    state,
    facets,
    categories: categories?.map(({ slug, name, productCount }) => ({ slug, name, productCount })),
  };

  const { items, total, page, perPage, totalPages } = result;
  const from = total === 0 ? 0 : (page - 1) * perPage + 1;
  const to = Math.min(total, page * perPage);
  const hasFilters = countActiveFilters(state) > 0 || Boolean(state.search);
  const categoryName = categories?.find((c) => c.slug === state.category)?.name;

  return (
    <div className="container-page pb-24">
      <div className="sticky top-[72px] z-30 -mx-5 mb-8 flex items-center justify-between gap-3 border-y border-border bg-paper/95 px-5 py-3 backdrop-blur md:-mx-10 md:px-10 lg:static lg:mx-0 lg:border-x-0 lg:border-t-0 lg:bg-transparent lg:px-0 lg:pb-5 lg:pt-0 lg:backdrop-blur-none">
        <p className="whitespace-nowrap text-sm text-ink-soft" aria-live="polite">
          {total === 0 ? (
            "No products"
          ) : (
            <>
              <span className="lg:hidden">
                {total} {total === 1 ? "product" : "products"}
              </span>
              <span className="hidden lg:inline">
                Showing {from}–{to} of {total} {total === 1 ? "product" : "products"}
              </span>
            </>
          )}
        </p>
        <div className="flex items-center gap-2">
          <div className="lg:hidden">
            <MobileFilters {...panelProps} total={total} />
          </div>
          <SortSelect basePath={basePath} state={state} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[220px_minmax(0,1fr)] xl:gap-16">
        <aside className="hidden lg:block" aria-label="Product filters">
          <div className="sticky top-28">
            <FilterPanel {...panelProps} />
          </div>
        </aside>

        <div className="min-w-0">
          <ActiveFilters basePath={basePath} state={state} categoryName={categoryName} />
          <ProductGrid
            products={items}
            columns={3}
            priorityCount={3}
            emptyTitle={hasFilters ? "Nothing matches those filters" : "No products here yet"}
            emptyDescription={
              hasFilters
                ? "Try removing a filter or two — or browse the full collection."
                : "We're restocking this collection. Check back soon."
            }
            emptyActionLabel={hasFilters ? "Clear all filters" : "Browse all products"}
            emptyActionHref={
              hasFilters
                ? buildCatalogHref(basePath, state, {
                    search: undefined,
                    category: undefined,
                    sizes: [],
                    colors: [],
                    price: undefined,
                  })
                : "/shop"
            }
          />
          <Pagination basePath={basePath} state={state} totalPages={totalPages} />
        </div>
      </div>
    </div>
  );
}

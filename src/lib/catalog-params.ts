import type { ProductFilters, SortOption } from "@/lib/types";

export const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
];

export const PRICE_BUCKETS = [
  { value: "0-50", label: "Under $50", min: 0, max: 4999 },
  { value: "50-100", label: "$50 – $100", min: 5000, max: 9999 },
  { value: "100-200", label: "$100 – $200", min: 10000, max: 19999 },
  { value: "200-plus", label: "$200 & above", min: 20000, max: undefined },
] as const;

export const CATALOG_PAGE_SIZE = 12;

export type CatalogState = {
  category?: string;
  search?: string;
  sizes: string[];
  colors: string[];
  price?: string;
  sort: SortOption;
  page: number;
};

type RawParams = Record<string, string | string[] | undefined>;

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function list(value: string | string[] | undefined) {
  const raw = first(value);
  return raw ? raw.split(",").map((v) => v.trim()).filter(Boolean) : [];
}

export function parseCatalogParams(params: RawParams): CatalogState {
  const sortRaw = first(params.sort);
  const sort = SORT_OPTIONS.some((o) => o.value === sortRaw) ? (sortRaw as SortOption) : "featured";
  const priceRaw = first(params.price);
  const pageRaw = Number.parseInt(first(params.page) ?? "1", 10);

  return {
    category: first(params.category) || undefined,
    search: first(params.search)?.trim() || undefined,
    sizes: list(params.sizes),
    colors: list(params.colors),
    price: PRICE_BUCKETS.some((b) => b.value === priceRaw) ? priceRaw : undefined,
    sort,
    page: Number.isFinite(pageRaw) && pageRaw > 0 ? pageRaw : 1,
  };
}

export function toProductFilters(state: CatalogState, categorySlug?: string): ProductFilters {
  const bucket = PRICE_BUCKETS.find((b) => b.value === state.price);
  return {
    categorySlug: categorySlug ?? state.category,
    search: state.search,
    sizes: state.sizes,
    colors: state.colors,
    minPrice: bucket?.min,
    maxPrice: bucket?.max,
    sort: state.sort,
    page: state.page,
    perPage: CATALOG_PAGE_SIZE,
  };
}

/** Builds a catalog URL from the current state plus a patch. Any filter change resets pagination. */
export function buildCatalogHref(basePath: string, state: CatalogState, patch: Partial<CatalogState>) {
  const next: CatalogState = { ...state, ...patch };
  if (!("page" in patch)) next.page = 1;

  const params = new URLSearchParams();
  if (next.category) params.set("category", next.category);
  if (next.search) params.set("search", next.search);
  if (next.sizes.length) params.set("sizes", next.sizes.join(","));
  if (next.colors.length) params.set("colors", next.colors.join(","));
  if (next.price) params.set("price", next.price);
  if (next.sort !== "featured") params.set("sort", next.sort);
  if (next.page > 1) params.set("page", String(next.page));

  const query = params.toString();
  return query ? `${basePath}?${query}` : basePath;
}

export function countActiveFilters(state: CatalogState) {
  return (state.category ? 1 : 0) + state.sizes.length + state.colors.length + (state.price ? 1 : 0);
}

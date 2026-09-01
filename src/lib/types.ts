import type { Category, Product, ProductImage, ProductVariant } from "@prisma/client";

export type ProductWithDetails = Product & {
  images: ProductImage[];
  variants: ProductVariant[];
  category: Category;
};

export type CategoryWithCount = Category & {
  productCount: number;
};

export type SortOption =
  | "featured"
  | "newest"
  | "price-asc"
  | "price-desc"
  | "rating";

export type ProductFilters = {
  categorySlug?: string;
  search?: string;
  sizes?: string[];
  colors?: string[];
  minPrice?: number;
  maxPrice?: number;
  sort?: SortOption;
  page?: number;
  perPage?: number;
};

export type PaginatedResult<T> = {
  items: T[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
};

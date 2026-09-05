import "server-only";
import { cache } from "react";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";
import type { CategoryWithCount, PaginatedResult, ProductFilters, ProductWithDetails } from "@/lib/types";
import {
  getFallbackCategories,
  getFallbackCategoryBySlug,
  getFallbackProductBySlug,
  getFallbackFeaturedProducts,
  getFallbackNewArrivals,
  getFallbackBestRated,
  getFallbackRelatedProducts,
  getFallbackProducts,
  getFallbackFacets,
  getFallbackProductReviews,
} from "@/lib/fallback-data";

const productCardSelect = {
  id: true,
  name: true,
  slug: true,
  price: true,
  compareAtPrice: true,
  rating: true,
  reviewCount: true,
  stock: true,
  status: true,
  createdAt: true,
  images: { select: { url: true, alt: true }, orderBy: { position: "asc" as const }, take: 2 },
  category: { select: { name: true, slug: true } },
  variants: { select: { id: true, size: true, color: true, stock: true } },
} satisfies Prisma.ProductSelect;

type ProductCardRow = Prisma.ProductGetPayload<{ select: typeof productCardSelect }>;

export type ProductCard = ProductCardRow & { isNew: boolean };

const NEW_WINDOW_MS = 21 * 24 * 60 * 60 * 1000;

function toCards(rows: ProductCardRow[]): ProductCard[] {
  const cutoff = Date.now() - NEW_WINDOW_MS;
  return rows.map((row) => ({ ...row, isNew: row.createdAt.getTime() > cutoff }));
}

const SIZE_ORDER = ["XS", "S", "M", "L", "XL", "XXL"];

export function compareSizes(a: string, b: string) {
  const ai = SIZE_ORDER.indexOf(a);
  const bi = SIZE_ORDER.indexOf(b);
  if (ai === -1 && bi === -1) return a.localeCompare(b, undefined, { numeric: true });
  if (ai === -1) return 1;
  if (bi === -1) return -1;
  return ai - bi;
}

export const getCategories = cache(async (): Promise<CategoryWithCount[]> => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { position: "asc" },
      include: { _count: { select: { products: { where: { status: "ACTIVE" } } } } },
    });

    if (!categories || categories.length === 0) {
      return getFallbackCategories();
    }

    return categories.map(({ _count, ...category }) => ({
      ...category,
      productCount: _count.products,
    }));
  } catch (error) {
    console.warn("⚠️ Database unreachable in getCategories, serving fallback catalog.");
    return getFallbackCategories();
  }
});

export const getCategoryBySlug = cache(async (slug: string): Promise<CategoryWithCount | null> => {
  try {
    const category = await prisma.category.findUnique({
      where: { slug },
      include: { _count: { select: { products: { where: { status: "ACTIVE" } } } } },
    });

    if (!category) return getFallbackCategoryBySlug(slug);

    const { _count, ...rest } = category;
    return { ...rest, productCount: _count.products };
  } catch (error) {
    console.warn(`⚠️ Database unreachable in getCategoryBySlug(${slug}), serving fallback.`);
    return getFallbackCategoryBySlug(slug);
  }
});

function buildOrderBy(sort: ProductFilters["sort"]): Prisma.ProductOrderByWithRelationInput[] {
  switch (sort) {
    case "price-asc":
      return [{ price: "asc" }, { name: "asc" }];
    case "price-desc":
      return [{ price: "desc" }, { name: "asc" }];
    case "rating":
      return [{ rating: "desc" }, { reviewCount: "desc" }];
    case "newest":
      return [{ createdAt: "desc" }];
    case "featured":
    default:
      return [{ featured: "desc" }, { rating: "desc" }];
  }
}

export async function getProducts(filters: ProductFilters = {}): Promise<PaginatedResult<ProductCard>> {
  try {
    const { categorySlug, search, sizes, colors, minPrice, maxPrice, sort = "featured", perPage = 12 } = filters;
    const page = Math.max(1, filters.page ?? 1);

    const variantMatch: Prisma.ProductVariantWhereInput = {
      ...(sizes?.length ? { size: { in: sizes } } : {}),
      ...(colors?.length ? { color: { in: colors } } : {}),
    };

    const where: Prisma.ProductWhereInput = {
      status: "ACTIVE",
      ...(categorySlug ? { category: { slug: categorySlug } } : {}),
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { shortDescription: { contains: search, mode: "insensitive" } },
              { category: { name: { contains: search, mode: "insensitive" } } },
            ],
          }
        : {}),
      ...(minPrice !== undefined || maxPrice !== undefined
        ? {
            price: {
              ...(minPrice !== undefined ? { gte: minPrice } : {}),
              ...(maxPrice !== undefined ? { lte: maxPrice } : {}),
            },
          }
        : {}),
      ...(Object.keys(variantMatch).length ? { variants: { some: variantMatch } } : {}),
    };

    const [items, total] = await Promise.all([
      prisma.product.findMany({
        where,
        select: productCardSelect,
        orderBy: buildOrderBy(sort),
        skip: (page - 1) * perPage,
        take: perPage,
      }),
      prisma.product.count({ where }),
    ]);

    if (items.length === 0 && !categorySlug && !search && !sizes?.length && !colors?.length) {
      return getFallbackProducts(filters);
    }

    return {
      items: toCards(items),
      total,
      page,
      perPage,
      totalPages: Math.max(1, Math.ceil(total / perPage)),
    };
  } catch (error) {
    console.warn("⚠️ Database unreachable in getProducts, serving fallback catalog.");
    return getFallbackProducts(filters);
  }
}

export const getProductBySlug = cache(async (slug: string): Promise<ProductWithDetails | null> => {
  try {
    const product = await prisma.product.findFirst({
      where: { slug, status: "ACTIVE" },
      include: {
        images: { orderBy: { position: "asc" } },
        variants: true,
        category: true,
      },
    });

    if (!product) {
      return getFallbackProductBySlug(slug);
    }

    return product;
  } catch (error) {
    console.warn(`⚠️ Database unreachable in getProductBySlug(${slug}), serving fallback.`);
    return getFallbackProductBySlug(slug);
  }
});

export async function getFeaturedProducts(limit = 8) {
  try {
    const rows = await prisma.product.findMany({
      where: { status: "ACTIVE", featured: true },
      select: productCardSelect,
      orderBy: [{ rating: "desc" }],
      take: limit,
    });
    if (!rows || rows.length === 0) {
      return getFallbackFeaturedProducts(limit);
    }
    return toCards(rows);
  } catch (error) {
    console.warn("⚠️ Database unreachable in getFeaturedProducts, serving fallback.");
    return getFallbackFeaturedProducts(limit);
  }
}

export async function getNewArrivals(limit = 8) {
  try {
    const rows = await prisma.product.findMany({
      where: { status: "ACTIVE" },
      select: productCardSelect,
      orderBy: { createdAt: "desc" },
      take: limit,
    });
    if (!rows || rows.length === 0) {
      return getFallbackNewArrivals(limit);
    }
    return toCards(rows);
  } catch (error) {
    console.warn("⚠️ Database unreachable in getNewArrivals, serving fallback.");
    return getFallbackNewArrivals(limit);
  }
}

export async function getBestRated(limit = 8) {
  try {
    const rows = await prisma.product.findMany({
      where: { status: "ACTIVE" },
      select: productCardSelect,
      orderBy: [{ rating: "desc" }, { reviewCount: "desc" }],
      take: limit,
    });
    if (!rows || rows.length === 0) {
      return getFallbackBestRated(limit);
    }
    return toCards(rows);
  } catch (error) {
    console.warn("⚠️ Database unreachable in getBestRated, serving fallback.");
    return getFallbackBestRated(limit);
  }
}

export async function getRelatedProducts(categoryId: string, excludeProductId: string, limit = 4) {
  try {
    const sameCategory = await prisma.product.findMany({
      where: { categoryId, status: "ACTIVE", id: { not: excludeProductId } },
      select: productCardSelect,
      orderBy: { rating: "desc" },
      take: limit,
    });

    if (sameCategory.length >= limit) return toCards(sameCategory);

    const fillers = await prisma.product.findMany({
      where: {
        status: "ACTIVE",
        id: { notIn: [excludeProductId, ...sameCategory.map((p) => p.id)] },
        featured: true,
      },
      select: productCardSelect,
      orderBy: { rating: "desc" },
      take: limit - sameCategory.length,
    });

    const combined = [...sameCategory, ...fillers];
    if (combined.length === 0) {
      return getFallbackRelatedProducts(categoryId, excludeProductId, limit);
    }

    return toCards(combined);
  } catch (error) {
    console.warn("⚠️ Database unreachable in getRelatedProducts, serving fallback.");
    return getFallbackRelatedProducts(categoryId, excludeProductId, limit);
  }
}

export async function getProductReviews(productId: string, limit = 20) {
  try {
    const reviews = await prisma.review.findMany({
      where: { productId },
      include: { user: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
    if (!reviews || reviews.length === 0) {
      return getFallbackProductReviews(productId);
    }
    return reviews;
  } catch (error) {
    return getFallbackProductReviews(productId);
  }
}

export async function getFacets(categorySlug?: string) {
  try {
    const variants = await prisma.productVariant.findMany({
      where: {
        product: { status: "ACTIVE", ...(categorySlug ? { category: { slug: categorySlug } } : {}) },
      },
      select: { size: true, color: true, colorHex: true },
    });

    if (!variants || variants.length === 0) {
      return getFallbackFacets(categorySlug);
    }

    const sizes = Array.from(new Set(variants.map((v) => v.size).filter((v): v is string => Boolean(v)))).sort(
      compareSizes,
    );

    const colorMap = new Map<string, string>();
    for (const v of variants) {
      if (v.color && !colorMap.has(v.color)) colorMap.set(v.color, v.colorHex ?? "#cccccc");
    }

    return {
      sizes,
      colors: Array.from(colorMap.entries())
        .map(([name, hex]) => ({ name, hex }))
        .sort((a, b) => a.name.localeCompare(b.name)),
    };
  } catch (error) {
    console.warn("⚠️ Database unreachable in getFacets, serving fallback.");
    return getFallbackFacets(categorySlug);
  }
}

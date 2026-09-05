import type { Metadata } from "next";
import { CatalogHeader } from "@/components/shop/catalog-header";
import { CatalogView } from "@/components/shop/catalog-view";
import { CategoryPills } from "@/components/shop/category-pills";
import { getCategories, getFacets, getProducts } from "@/lib/data";
import { parseCatalogParams, toProductFilters } from "@/lib/catalog-params";

export const metadata: Metadata = {
  title: "Shop All",
  description:
    "Shop the full Fauve collection — outerwear, knitwear, footwear, bags, and objects for the home, made to be kept.",
};

export default async function ShopPage({ searchParams }: PageProps<"/shop">) {
  const state = parseCatalogParams(await searchParams);

  const [result, categories, facets] = await Promise.all([
    getProducts(toProductFilters(state)),
    getCategories(),
    getFacets(state.category),
  ]);

  const activeCategory = categories.find((c) => c.slug === state.category);
  const title = state.search ? `Results for “${state.search}”` : (activeCategory?.name ?? "Shop All");
  const description = state.search
    ? `${result.total} ${result.total === 1 ? "piece matches" : "pieces match"} your search.`
    : (activeCategory?.description ??
      "The full collection — outerwear, knitwear, footwear, and objects for the home. Cut from natural materials and built to outlast a season.");

  return (
    <>
      <CatalogHeader
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Shop" }]}
        eyebrow={state.search ? "Search" : "The Collection"}
        title={title}
        description={description}
      />
      <CategoryPills categories={categories} activeSlug={state.category} />
      <CatalogView basePath="/shop" state={state} result={result} facets={facets} categories={categories} />
    </>
  );
}

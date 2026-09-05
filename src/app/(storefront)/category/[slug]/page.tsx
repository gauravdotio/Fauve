import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CatalogHeader } from "@/components/shop/catalog-header";
import { CatalogView } from "@/components/shop/catalog-view";
import { CategoryPills } from "@/components/shop/category-pills";
import { getCategories, getCategoryBySlug, getFacets, getProducts } from "@/lib/data";
import { parseCatalogParams, toProductFilters } from "@/lib/catalog-params";

export async function generateMetadata({ params }: PageProps<"/category/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return { title: "Category not found" };

  return {
    title: category.name,
    description: category.description,
    openGraph: { title: `${category.name} — Fauve`, description: category.description, images: [category.image] },
  };
}

export default async function CategoryPage({ params, searchParams }: PageProps<"/category/[slug]">) {
  const [{ slug }, rawParams] = await Promise.all([params, searchParams]);
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const state = { ...parseCatalogParams(rawParams), category: undefined };

  const [result, facets, categories] = await Promise.all([
    getProducts(toProductFilters(state, slug)),
    getFacets(slug),
    getCategories(),
  ]);

  return (
    <>
      <CatalogHeader
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Shop", href: "/shop" }, { label: category.name }]}
        eyebrow="Category"
        title={category.name}
        description={category.description}
        image={category.image}
        count={category.productCount}
      />
      <div className="pt-8">
        <CategoryPills categories={categories} activeSlug={slug} />
      </div>
      <CatalogView basePath={`/category/${slug}`} state={state} result={result} facets={facets} />
    </>
  );
}

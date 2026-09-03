import type { Metadata } from "next";
import { Hero } from "@/components/home/hero";
import { CategoryGrid } from "@/components/home/category-grid";
import { FeaturedProducts } from "@/components/home/featured-products";
import { Editorial } from "@/components/home/editorial";
import { ProductTabs } from "@/components/home/product-tabs";
import { TrustSection } from "@/components/home/trust-section";
import { NewsletterSection } from "@/components/home/newsletter-section";
import { getCategories, getFeaturedProducts, getNewArrivals, getBestRated } from "@/lib/data";

export const revalidate = 300;

export const metadata: Metadata = {
  title: { absolute: "Fauve — Considered essentials" },
  description:
    "Shop considered clothing, footwear, and objects for the everyday. Natural materials, quiet detailing, built to last.",
};

export default async function HomePage() {
  const [categories, featuredProducts, newArrivals, bestRated] = await Promise.all([
    getCategories(),
    getFeaturedProducts(8),
    getNewArrivals(8),
    getBestRated(8),
  ]);

  return (
    <>
      <Hero />
      <CategoryGrid categories={categories} />
      <FeaturedProducts products={featuredProducts} />
      <Editorial />
      <ProductTabs newArrivals={newArrivals} bestRated={bestRated} />
      <TrustSection />
      <NewsletterSection />
    </>
  );
}

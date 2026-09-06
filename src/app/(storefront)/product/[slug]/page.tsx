import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { SectionHeader } from "@/components/ui/section-header";
import { ProductGallery } from "@/components/product/product-gallery";
import { ProductInfo } from "@/components/product/product-info";
import { ProductDetails } from "@/components/product/product-details";
import { ProductGrid } from "@/components/product/product-grid";
import { ReviewsSection } from "@/components/product/reviews-section";
import { compareSizes, getProductBySlug, getProductReviews, getRelatedProducts } from "@/lib/data";
import { auth } from "@/auth";

export async function generateMetadata({ params }: PageProps<"/product/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product not found" };

  return {
    title: product.name,
    description: product.shortDescription,
    openGraph: {
      title: `${product.name} — Fauve`,
      description: product.shortDescription,
      images: product.images.slice(0, 1).map((image) => ({ url: image.url, alt: image.alt })),
    },
  };
}

export default async function ProductPage({ params }: PageProps<"/product/[slug]">) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const [related, reviews, session] = await Promise.all([
    getRelatedProducts(product.categoryId, product.id, 4),
    getProductReviews(product.id),
    auth(),
  ]);

  const sizes = Array.from(new Set(product.variants.map((v) => v.size).filter((s): s is string => Boolean(s)))).sort(
    compareSizes,
  );
  const colorMap = new Map<string, string>();
  for (const variant of product.variants) {
    if (variant.color && !colorMap.has(variant.color)) colorMap.set(variant.color, variant.colorHex ?? "#cccccc");
  }
  const colors = Array.from(colorMap, ([name, hex]) => ({ name, hex }));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.shortDescription,
    sku: product.sku,
    brand: { "@type": "Brand", name: product.brand },
    image: product.images.map((image) => image.url),
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: product.reviewCount,
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      price: (product.price / 100).toFixed(2),
      availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
  };

  return (
    <>
      <div className="container-page pb-20 pt-6 lg:pb-24">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Shop", href: "/shop" },
            { label: product.category.name, href: `/category/${product.category.slug}` },
            { label: product.name },
          ]}
        />

        <div className="mt-6 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12 xl:gap-16">
          <div className="-mx-5 md:mx-0 lg:col-span-7">
            <ProductGallery images={product.images.map(({ url, alt }) => ({ url, alt }))} name={product.name} />
          </div>
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <ProductInfo
                product={{
                  id: product.id,
                  name: product.name,
                  slug: product.slug,
                  price: product.price,
                  compareAtPrice: product.compareAtPrice,
                  rating: product.rating,
                  reviewCount: product.reviewCount,
                  shortDescription: product.shortDescription,
                  image: product.images[0]?.url ?? "",
                  categoryName: product.category.name,
                  categorySlug: product.category.slug,
                }}
                variants={product.variants.map(({ id, size, color, colorHex, stock, priceOffset }) => ({
                  id,
                  size,
                  color,
                  colorHex,
                  stock,
                  priceOffset,
                }))}
                sizes={sizes}
                colors={colors}
              />
            </div>
          </div>
        </div>
      </div>

      <ProductDetails product={product} sizes={sizes} colors={colors} />

      <ReviewsSection
        productSlug={product.slug}
        rating={product.rating}
        reviewCount={product.reviewCount}
        reviews={reviews}
        isLoggedIn={Boolean(session?.user)}
      />

      {related.length > 0 && (
        <section className="border-t border-border">
          <div className="container-page py-20 sm:py-24">
            <SectionHeader
              eyebrow="You May Also Like"
              title="Pairs well with"
              className="mb-12"
              action={
                <Link
                  href={`/category/${product.category.slug}`}
                  className="group hidden items-center gap-1.5 text-sm font-medium text-ink transition-colors hover:text-accent sm:inline-flex"
                >
                  Shop {product.category.name}
                  <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
                </Link>
              }
            />
            <ProductGrid products={related} />
          </div>
        </section>
      )}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
    </>
  );
}

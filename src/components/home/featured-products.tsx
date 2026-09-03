import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeader } from "@/components/ui/section-header";
import { ProductGrid } from "@/components/product/product-grid";
import type { ProductCard } from "@/lib/data";

export function FeaturedProducts({ products }: { products: ProductCard[] }) {
  return (
    <section className="container-page py-20 sm:py-28">
      <SectionHeader
        eyebrow="Featured"
        title="This season's edit"
        description="A small selection of pieces we're wearing on repeat right now."
        action={
          <Link
            href="/shop?sort=featured"
            className="group hidden items-center gap-1.5 text-sm font-medium text-ink transition-colors hover:text-accent sm:inline-flex"
          >
            View all
            <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
          </Link>
        }
        className="mb-12"
      />
      <ProductGrid products={products} priorityCount={4} />
    </section>
  );
}

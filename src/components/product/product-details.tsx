import Link from "next/link";
import type { ProductWithDetails } from "@/lib/types";

interface ProductDetailsProps {
  product: ProductWithDetails;
  sizes: string[];
  colors: { name: string; hex: string }[];
}

export function ProductDetails({ product, sizes, colors }: ProductDetailsProps) {
  const specs: { label: string; value: React.ReactNode }[] = [
    { label: "Brand", value: product.brand },
    {
      label: "Category",
      value: (
        <Link href={`/category/${product.category.slug}`} className="underline decoration-border-strong underline-offset-4 hover:decoration-ink">
          {product.category.name}
        </Link>
      ),
    },
    ...(product.material ? [{ label: "Material", value: product.material }] : []),
    ...(product.careInstructions ? [{ label: "Care", value: product.careInstructions }] : []),
    ...(colors.length ? [{ label: "Colors", value: colors.map((c) => c.name).join(", ") }] : []),
    ...(sizes.length ? [{ label: "Sizes", value: sizes.join(", ") }] : []),
    { label: "SKU", value: <span className="tabular-nums">{product.sku}</span> },
  ];

  return (
    <section id="details" className="scroll-mt-24 border-t border-border bg-surface">
      <div className="container-page grid grid-cols-1 gap-14 py-16 sm:py-20 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-6">
          <span className="text-xs font-medium uppercase tracking-[0.14em] text-accent">The Details</span>
          <h2 className="mt-3 text-balance font-serif text-3xl leading-[1.15] text-ink sm:text-4xl">
            About the {product.name}
          </h2>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-ink-soft">{product.description}</p>
        </div>

        <div className="flex flex-col gap-10 lg:col-span-5 lg:col-start-8">
          <div>
            <h3 className="text-xs font-medium uppercase tracking-[0.14em] text-ink">Specifications</h3>
            <dl className="mt-4 divide-y divide-border border-y border-border">
              {specs.map((spec) => (
                <div key={spec.label} className="grid grid-cols-[110px_minmax(0,1fr)] gap-4 py-3.5 text-sm">
                  <dt className="text-ink-soft">{spec.label}</dt>
                  <dd className="text-ink">{spec.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div>
            <h3 className="text-xs font-medium uppercase tracking-[0.14em] text-ink">Shipping &amp; Returns</h3>
            <p className="mt-4 text-sm leading-relaxed text-ink-soft">
              Orders ship within 1–2 business days. Standard shipping is free on orders over $100, and express
              delivery is available at checkout. Returns and exchanges are free within 30 days of delivery.{" "}
              <Link href="/support/returns" className="text-ink underline decoration-border-strong underline-offset-4 hover:decoration-ink">
                Read our returns policy
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useState } from "react";
import { ProductGrid } from "@/components/product/product-grid";
import { SectionHeader } from "@/components/ui/section-header";
import { cn } from "@/lib/utils";
import type { ProductCard } from "@/lib/data";

interface ProductTabsProps {
  newArrivals: ProductCard[];
  bestRated: ProductCard[];
}

const TABS = [
  { key: "new", label: "New Arrivals" },
  { key: "popular", label: "Most Loved" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

export function ProductTabs({ newArrivals, bestRated }: ProductTabsProps) {
  const [active, setActive] = useState<TabKey>("new");
  const products = active === "new" ? newArrivals : bestRated;

  return (
    <section className="border-t border-border bg-surface-alt">
      <div className="container-page py-20 sm:py-28">
        <SectionHeader
          eyebrow="Discover"
          title="What's moving right now"
          className="mb-8"
          action={
            <div className="flex gap-1 rounded-full border border-border-strong bg-surface p-1" role="tablist">
              {TABS.map((tab) => (
                <button
                  key={tab.key}
                  role="tab"
                  aria-selected={active === tab.key}
                  onClick={() => setActive(tab.key)}
                  className={cn(
                    "rounded-full px-4 py-2 text-xs font-medium uppercase tracking-wide transition-colors",
                    active === tab.key ? "bg-ink text-paper" : "text-ink-soft hover:text-ink",
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          }
        />
        <div className="mt-4">
          <ProductGrid products={products} />
        </div>
      </div>
    </section>
  );
}

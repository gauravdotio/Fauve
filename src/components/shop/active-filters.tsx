import Link from "next/link";
import { X } from "lucide-react";
import { buildCatalogHref, countActiveFilters, PRICE_BUCKETS, type CatalogState } from "@/lib/catalog-params";

interface ActiveFiltersProps {
  basePath: string;
  state: CatalogState;
  categoryName?: string;
}

export function ActiveFilters({ basePath, state, categoryName }: ActiveFiltersProps) {
  const chips: { label: string; href: string }[] = [];

  if (state.search) {
    chips.push({ label: `“${state.search}”`, href: buildCatalogHref(basePath, state, { search: undefined }) });
  }
  if (state.category && categoryName) {
    chips.push({ label: categoryName, href: buildCatalogHref(basePath, state, { category: undefined }) });
  }
  const bucket = PRICE_BUCKETS.find((b) => b.value === state.price);
  if (bucket) {
    chips.push({ label: bucket.label, href: buildCatalogHref(basePath, state, { price: undefined }) });
  }
  for (const size of state.sizes) {
    chips.push({
      label: `Size ${size}`,
      href: buildCatalogHref(basePath, state, { sizes: state.sizes.filter((s) => s !== size) }),
    });
  }
  for (const color of state.colors) {
    chips.push({
      label: color,
      href: buildCatalogHref(basePath, state, { colors: state.colors.filter((c) => c !== color) }),
    });
  }

  if (chips.length === 0) return null;

  return (
    <div className="mb-8 flex flex-wrap items-center gap-2">
      {chips.map((chip) => (
        <Link
          key={chip.label}
          href={chip.href}
          scroll={false}
          aria-label={`Remove filter ${chip.label}`}
          className="group inline-flex h-8 items-center gap-1.5 rounded-full border border-border-strong bg-surface pl-3.5 pr-2.5 text-xs text-ink transition-colors hover:border-ink"
        >
          {chip.label}
          <X size={12} className="text-ink-faint transition-colors group-hover:text-ink" />
        </Link>
      ))}
      {(countActiveFilters(state) > 1 || (state.search && chips.length > 1)) && (
        <Link
          href={buildCatalogHref(basePath, state, {
            search: undefined,
            category: undefined,
            sizes: [],
            colors: [],
            price: undefined,
          })}
          scroll={false}
          className="ml-1 text-xs text-ink-soft underline decoration-border-strong underline-offset-4 hover:text-ink"
        >
          Clear all
        </Link>
      )}
    </div>
  );
}

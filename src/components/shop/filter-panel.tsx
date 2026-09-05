"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { buildCatalogHref, countActiveFilters, PRICE_BUCKETS, type CatalogState } from "@/lib/catalog-params";
import { cn } from "@/lib/utils";

export interface FilterPanelProps {
  basePath: string;
  state: CatalogState;
  facets: { sizes: string[]; colors: { name: string; hex: string }[] };
  categories?: { slug: string; name: string; productCount: number }[];
}

function toggle(list: string[], value: string) {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

function FilterGroup({ legend, children }: { legend: string; children: React.ReactNode }) {
  return (
    <fieldset className="flex flex-col gap-3 border-t border-border pt-6">
      <legend className="mb-3 text-xs font-medium uppercase tracking-[0.14em] text-ink">{legend}</legend>
      {children}
    </fieldset>
  );
}

function OptionRow({
  selected,
  label,
  count,
  onClick,
}: {
  selected: boolean;
  label: string;
  count?: number;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className="group flex w-full items-center justify-between gap-3 py-1.5 text-left text-sm"
    >
      <span className="flex items-center gap-3">
        <span
          className={cn(
            "flex h-4 w-4 shrink-0 items-center justify-center border transition-colors",
            selected ? "border-ink bg-ink text-paper" : "border-border-strong group-hover:border-ink",
          )}
        >
          {selected && <Check size={11} strokeWidth={3} />}
        </span>
        <span className={cn("transition-colors", selected ? "text-ink" : "text-ink-soft group-hover:text-ink")}>
          {label}
        </span>
      </span>
      {typeof count === "number" && <span className="text-xs tabular-nums text-ink-faint">{count}</span>}
    </button>
  );
}

export function FilterPanel({ basePath, state, facets, categories }: FilterPanelProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const activeCount = countActiveFilters(state);

  const apply = (patch: Partial<CatalogState>) =>
    startTransition(() => router.push(buildCatalogHref(basePath, state, patch), { scroll: false }));

  return (
    <div className={cn("flex flex-col gap-6 transition-opacity", isPending && "opacity-60")} aria-busy={isPending}>
      <div className="flex h-6 items-center justify-between">
        <h2 className="text-sm font-medium text-ink">
          Filters {activeCount > 0 && <span className="text-ink-faint">({activeCount})</span>}
        </h2>
        {activeCount > 0 && (
          <button
            type="button"
            onClick={() => apply({ category: undefined, sizes: [], colors: [], price: undefined })}
            className="text-xs text-ink-soft underline decoration-border-strong underline-offset-4 hover:text-ink hover:decoration-ink"
          >
            Clear all
          </button>
        )}
      </div>

      {categories && categories.length > 0 && (
        <FilterGroup legend="Category">
          <div className="flex flex-col">
            {categories.map((category) => (
              <OptionRow
                key={category.slug}
                label={category.name}
                count={category.productCount}
                selected={state.category === category.slug}
                onClick={() => apply({ category: state.category === category.slug ? undefined : category.slug })}
              />
            ))}
          </div>
        </FilterGroup>
      )}

      <FilterGroup legend="Price">
        <div className="flex flex-col">
          {PRICE_BUCKETS.map((bucket) => (
            <OptionRow
              key={bucket.value}
              label={bucket.label}
              selected={state.price === bucket.value}
              onClick={() => apply({ price: state.price === bucket.value ? undefined : bucket.value })}
            />
          ))}
        </div>
      </FilterGroup>

      {facets.sizes.length > 0 && (
        <FilterGroup legend="Size">
          <div className="grid grid-cols-4 gap-2">
            {facets.sizes.map((size) => {
              const selected = state.sizes.includes(size);
              return (
                <button
                  key={size}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => apply({ sizes: toggle(state.sizes, size) })}
                  className={cn(
                    "flex h-10 items-center justify-center border text-xs font-medium transition-colors",
                    selected
                      ? "border-ink bg-ink text-paper"
                      : "border-border-strong bg-surface text-ink-soft hover:border-ink hover:text-ink",
                  )}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </FilterGroup>
      )}

      {facets.colors.length > 0 && (
        <FilterGroup legend="Color">
          <div className="grid grid-cols-2 gap-x-3 gap-y-1">
            {facets.colors.map((color) => {
              const selected = state.colors.includes(color.name);
              return (
                <button
                  key={color.name}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => apply({ colors: toggle(state.colors, color.name) })}
                  className="group flex items-center gap-2.5 py-1.5 text-left text-sm"
                >
                  <span
                    className={cn(
                      "h-5 w-5 shrink-0 rounded-full border border-black/10 ring-offset-2 ring-offset-paper transition-shadow",
                      selected ? "ring-1 ring-ink" : "group-hover:ring-1 group-hover:ring-border-strong",
                    )}
                    style={{ backgroundColor: color.hex }}
                  />
                  <span className={cn("truncate", selected ? "text-ink" : "text-ink-soft group-hover:text-ink")}>
                    {color.name}
                  </span>
                </button>
              );
            })}
          </div>
        </FilterGroup>
      )}
    </div>
  );
}

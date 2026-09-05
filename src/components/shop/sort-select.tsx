"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { buildCatalogHref, SORT_OPTIONS, type CatalogState } from "@/lib/catalog-params";
import type { SortOption } from "@/lib/types";
import { cn } from "@/lib/utils";

export function SortSelect({ basePath, state }: { basePath: string; state: CatalogState }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <label className={cn("relative flex items-center gap-3 text-sm transition-opacity", isPending && "opacity-60")}>
      <span className="hidden text-ink-soft sm:inline">Sort by</span>
      <select
        value={state.sort}
        aria-label="Sort products"
        onChange={(e) =>
          startTransition(() =>
            router.push(buildCatalogHref(basePath, state, { sort: e.target.value as SortOption }), { scroll: false }),
          )
        }
        className="h-10 max-w-[10.5rem] cursor-pointer appearance-none truncate border border-border-strong bg-surface pl-3.5 pr-9 text-sm text-ink transition-colors hover:border-ink sm:max-w-none"
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown size={14} className="pointer-events-none absolute right-3 text-ink-soft" aria-hidden />
    </label>
  );
}

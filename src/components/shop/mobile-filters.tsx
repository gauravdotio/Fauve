"use client";

import { useEffect, useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { FilterPanel, type FilterPanelProps } from "@/components/shop/filter-panel";
import { Button } from "@/components/ui/button";
import { countActiveFilters } from "@/lib/catalog-params";
import { cn } from "@/lib/utils";

export function MobileFilters({ total, ...panelProps }: FilterPanelProps & { total: number }) {
  const [open, setOpen] = useState(false);
  const activeCount = countActiveFilters(panelProps.state);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        className="flex h-10 items-center gap-2 border border-border-strong bg-surface px-3.5 text-sm text-ink transition-colors hover:border-ink"
      >
        <SlidersHorizontal size={15} />
        Filters
        {activeCount > 0 && (
          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-ink px-1.5 text-[11px] text-paper">
            {activeCount}
          </span>
        )}
      </button>

      <div className={cn("fixed inset-0 z-[80] lg:hidden", !open && "pointer-events-none")} inert={!open}>
        <div
          className={cn("absolute inset-0 bg-ink/40 transition-opacity duration-300", open ? "opacity-100" : "opacity-0")}
          onClick={() => setOpen(false)}
        />
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Filter products"
          className={cn(
            "absolute inset-x-0 bottom-0 flex max-h-[88vh] flex-col rounded-t-2xl bg-surface transition-transform duration-300 ease-out",
            open ? "translate-y-0" : "translate-y-full",
          )}
        >
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <span className="font-serif text-xl text-ink">Refine</span>
            <button
              type="button"
              aria-label="Close filters"
              onClick={() => setOpen(false)}
              className="flex h-9 w-9 items-center justify-center rounded-full text-ink-soft hover:bg-surface-alt hover:text-ink"
            >
              <X size={18} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-5 py-5">
            <FilterPanel {...panelProps} />
          </div>
          <div className="border-t border-border px-5 py-4">
            <Button size="lg" className="w-full" onClick={() => setOpen(false)}>
              Show {total} {total === 1 ? "result" : "results"}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

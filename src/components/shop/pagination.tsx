import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { buildCatalogHref, type CatalogState } from "@/lib/catalog-params";
import { cn } from "@/lib/utils";

function pageList(current: number, total: number): (number | "gap")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages = new Set([1, total, current - 1, current, current + 1]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
  const result: (number | "gap")[] = [];
  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i - 1] > 1) result.push("gap");
    result.push(p);
  });
  return result;
}

const CELL = "flex h-10 min-w-10 items-center justify-center px-3 text-sm transition-colors";

export function Pagination({ basePath, state, totalPages }: { basePath: string; state: CatalogState; totalPages: number }) {
  if (totalPages <= 1) return null;
  const current = Math.min(state.page, totalPages);

  return (
    <nav aria-label="Pagination" className="mt-16 flex items-center justify-center gap-1">
      {current > 1 ? (
        <Link
          href={buildCatalogHref(basePath, state, { page: current - 1 })}
          aria-label="Previous page"
          className={cn(CELL, "text-ink-soft hover:text-ink")}
        >
          <ChevronLeft size={16} />
        </Link>
      ) : (
        <span className={cn(CELL, "text-ink-faint/50")} aria-hidden>
          <ChevronLeft size={16} />
        </span>
      )}

      {pageList(current, totalPages).map((page, i) =>
        page === "gap" ? (
          <span key={`gap-${i}`} className={cn(CELL, "text-ink-faint")}>
            …
          </span>
        ) : (
          <Link
            key={page}
            href={buildCatalogHref(basePath, state, { page })}
            aria-current={page === current ? "page" : undefined}
            className={cn(
              CELL,
              "tabular-nums",
              page === current ? "bg-ink text-paper" : "text-ink-soft hover:bg-surface-alt hover:text-ink",
            )}
          >
            {page}
          </Link>
        ),
      )}

      {current < totalPages ? (
        <Link
          href={buildCatalogHref(basePath, state, { page: current + 1 })}
          aria-label="Next page"
          className={cn(CELL, "text-ink-soft hover:text-ink")}
        >
          <ChevronRight size={16} />
        </Link>
      ) : (
        <span className={cn(CELL, "text-ink-faint/50")} aria-hidden>
          <ChevronRight size={16} />
        </span>
      )}
    </nav>
  );
}

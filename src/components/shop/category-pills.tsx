import Link from "next/link";
import type { CategoryWithCount } from "@/lib/types";
import { cn } from "@/lib/utils";

const PILL = "inline-flex h-9 shrink-0 items-center rounded-full border px-4 text-sm whitespace-nowrap transition-colors";

export function CategoryPills({ categories, activeSlug }: { categories: CategoryWithCount[]; activeSlug?: string }) {
  return (
    <nav aria-label="Browse categories" className="container-page mb-8">
      <ul className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 md:mx-0 md:flex-wrap md:px-0">
        <li>
          <Link
            href="/shop"
            aria-current={!activeSlug ? "page" : undefined}
            className={cn(
              PILL,
              !activeSlug ? "border-ink bg-ink text-paper" : "border-border-strong text-ink-soft hover:border-ink hover:text-ink",
            )}
          >
            All
          </Link>
        </li>
        {categories.map((category) => {
          const active = category.slug === activeSlug;
          return (
            <li key={category.id}>
              <Link
                href={`/category/${category.slug}`}
                aria-current={active ? "page" : undefined}
                className={cn(
                  PILL,
                  active ? "border-ink bg-ink text-paper" : "border-border-strong text-ink-soft hover:border-ink hover:text-ink",
                )}
              >
                {category.name}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

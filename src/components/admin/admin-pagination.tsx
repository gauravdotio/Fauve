import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function AdminPagination({ basePath, page, totalPages }: { basePath: string; page: number; totalPages: number }) {
  if (totalPages <= 1) return null;

  const href = (p: number) => `${basePath}?page=${p}`;

  return (
    <div className="flex items-center justify-between text-sm text-ink-soft">
      <span>
        Page {page} of {totalPages}
      </span>
      <div className="flex gap-2">
        <Link
          href={href(Math.max(1, page - 1))}
          aria-disabled={page <= 1}
          className={cn("flex h-9 w-9 items-center justify-center border border-border-strong", page <= 1 && "pointer-events-none opacity-40")}
        >
          <ChevronLeft size={15} />
        </Link>
        <Link
          href={href(Math.min(totalPages, page + 1))}
          aria-disabled={page >= totalPages}
          className={cn("flex h-9 w-9 items-center justify-center border border-border-strong", page >= totalPages && "pointer-events-none opacity-40")}
        >
          <ChevronRight size={15} />
        </Link>
      </div>
    </div>
  );
}

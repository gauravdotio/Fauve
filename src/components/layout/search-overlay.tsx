"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, X, ArrowRight, Loader2 } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import type { ProductCard } from "@/lib/data";

const SUGGESTIONS = ["Wool coat", "Merino", "Sneaker", "Leather", "Candle"];

export function SearchOverlay({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ProductCard[]>([]);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const requestIdRef = useRef(0);
  const router = useRouter();

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [onClose]);

  const runSearch = (value: string) => {
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);

    const trimmed = value.trim();
    if (!trimmed) {
      requestIdRef.current += 1;
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    debounceRef.current = setTimeout(async () => {
      const requestId = ++requestIdRef.current;
      try {
        const res = await fetch(`/api/products?search=${encodeURIComponent(trimmed)}&perPage=5`);
        const data = res.ok ? await res.json() : { items: [] };
        if (requestId === requestIdRef.current) setResults(data.items ?? []);
      } catch {
        if (requestId === requestIdRef.current) setResults([]);
      } finally {
        if (requestId === requestIdRef.current) setLoading(false);
      }
    }, 250);
  };

  const viewAll = () => {
    if (!query.trim()) return;
    router.push(`/shop?search=${encodeURIComponent(query.trim())}`);
    onClose();
  };

  const hasQuery = query.trim().length > 0;

  return (
    <div className="fixed inset-0 z-[80] flex items-start justify-center px-4 pt-20 sm:pt-28">
      <div className="absolute inset-0 animate-fade-in bg-ink/40" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search products"
        className="relative w-full max-w-xl animate-fade-up bg-surface shadow-2xl"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            viewAll();
          }}
          className="flex items-center gap-3 border-b border-border px-5 py-4"
        >
          <Search size={18} className="shrink-0 text-ink-soft" />
          <input
            autoFocus
            type="search"
            value={query}
            onChange={(e) => runSearch(e.target.value)}
            placeholder="Search products…"
            className="w-full bg-transparent text-base text-ink placeholder:text-ink-faint focus:outline-none [&::-webkit-search-cancel-button]:hidden"
            aria-label="Search products"
          />
          {loading && <Loader2 size={16} className="shrink-0 animate-spin text-ink-faint" aria-label="Searching" />}
          <button
            type="button"
            aria-label="Close search"
            onClick={onClose}
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-ink-soft hover:bg-surface-alt hover:text-ink"
          >
            <X size={16} />
          </button>
        </form>

        {!hasQuery && (
          <div className="px-5 py-5">
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.12em] text-ink-faint">Popular searches</p>
            <div className="flex flex-wrap gap-2">
              {SUGGESTIONS.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => runSearch(suggestion)}
                  className="rounded-full border border-border-strong px-3.5 py-1.5 text-sm text-ink-soft transition-colors hover:border-ink hover:text-ink"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {hasQuery && (
          <div className="max-h-[60vh] overflow-y-auto p-2" aria-live="polite">
            {results.length === 0 && !loading && (
              <p className="px-4 py-8 text-center text-sm text-ink-soft">No products found for &ldquo;{query}&rdquo;</p>
            )}
            {results.map((product) => (
              <Link
                key={product.id}
                href={`/product/${product.slug}`}
                onClick={onClose}
                className="flex items-center gap-4 rounded-md p-3 transition-colors hover:bg-surface-alt"
              >
                <div className="relative h-14 w-12 shrink-0 overflow-hidden bg-surface-alt">
                  {product.images[0] && (
                    <Image src={product.images[0].url} alt="" fill sizes="48px" className="object-cover" />
                  )}
                </div>
                <div className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate text-sm font-medium text-ink">{product.name}</span>
                  <span className="text-xs text-ink-soft">{product.category.name}</span>
                </div>
                <span className="text-sm tabular-nums text-ink-soft">{formatPrice(product.price)}</span>
              </Link>
            ))}
            {results.length > 0 && (
              <button
                type="button"
                onClick={viewAll}
                className="mt-1 flex w-full items-center justify-center gap-1.5 rounded-md py-3 text-xs font-medium uppercase tracking-wide text-accent hover:bg-surface-alt"
              >
                View all results
                <ArrowRight size={13} />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

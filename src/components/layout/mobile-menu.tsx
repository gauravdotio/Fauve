"use client";

import { useEffect } from "react";
import Link from "next/link";
import { X, User, Heart, Package, LogOut } from "lucide-react";
import type { Session } from "next-auth";
import type { CategoryWithCount } from "@/lib/types";
import { logoutAction } from "@/lib/actions/auth-actions";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  categories: CategoryWithCount[];
  session: Session | null;
}

export function MobileMenu({ open, onClose, categories, session }: MobileMenuProps) {
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div
      className={`fixed inset-0 z-[75] lg:hidden ${open ? "pointer-events-auto" : "pointer-events-none"}`}
      inert={!open}
    >
      <div
        className={`absolute inset-0 bg-ink/40 transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`}
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        className={`absolute left-0 top-0 flex h-full w-full max-w-sm flex-col bg-surface transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-border px-6 py-5">
          <span className="font-serif text-xl text-ink">Menu</span>
          <button
            type="button"
            aria-label="Close menu"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-ink-soft hover:bg-surface-alt hover:text-ink"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-6 py-6">
          <ul className="flex flex-col gap-1">
            <li>
              <Link
                href="/shop"
                onClick={onClose}
                className="block py-3 font-serif text-2xl text-ink transition-colors hover:text-accent"
              >
                Shop All
              </Link>
            </li>
            <li>
              <Link
                href="/shop?sort=newest"
                onClick={onClose}
                className="block py-3 font-serif text-2xl text-ink transition-colors hover:text-accent"
              >
                New Arrivals
              </Link>
            </li>
          </ul>

          <p className="mb-2 mt-6 text-xs font-medium uppercase tracking-wide text-ink-faint">Categories</p>
          <ul className="flex flex-col gap-1">
            {categories.map((category) => (
              <li key={category.id}>
                <Link
                  href={`/category/${category.slug}`}
                  onClick={onClose}
                  className="flex items-center justify-between py-2.5 text-sm text-ink-soft transition-colors hover:text-ink"
                >
                  {category.name}
                  <span className="text-xs text-ink-faint">{category.productCount}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex flex-col gap-4 border-t border-border px-6 py-5">
          <div className="flex items-center gap-5">
            <Link href="/account" onClick={onClose} className="flex items-center gap-2 text-sm text-ink-soft hover:text-ink">
              <User size={16} /> {session ? "Account" : "Sign In"}
            </Link>
            <Link href="/wishlist" onClick={onClose} className="flex items-center gap-2 text-sm text-ink-soft hover:text-ink">
              <Heart size={16} /> Wishlist
            </Link>
            {session && (
              <Link href="/account/orders" onClick={onClose} className="flex items-center gap-2 text-sm text-ink-soft hover:text-ink">
                <Package size={16} /> Orders
              </Link>
            )}
          </div>
          {session && (
            <form action={logoutAction}>
              <button type="submit" className="flex items-center gap-2 text-sm text-ink-soft hover:text-error">
                <LogOut size={16} /> Sign Out
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

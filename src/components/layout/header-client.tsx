"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Search, Heart, ShoppingBag } from "lucide-react";
import type { Session } from "next-auth";
import { Logo } from "@/components/layout/logo";
import { MobileMenu } from "@/components/layout/mobile-menu";
import { SearchOverlay } from "@/components/layout/search-overlay";
import { CartDrawer } from "@/components/layout/cart-drawer";
import { AccountMenu } from "@/components/layout/account-menu";
import { useCartCount, useCartStore } from "@/store/cart-store";
import { useWishlistCount, useWishlistStore } from "@/store/wishlist-store";
import { cn } from "@/lib/utils";
import type { CategoryWithCount } from "@/lib/types";

const NAV_LINK = "relative py-2 text-sm font-medium text-ink-soft transition-colors hover:text-ink";

export function HeaderClient({ categories, session }: { categories: CategoryWithCount[]; session: Session | null }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  const cartCount = useCartCount();
  const wishlistCount = useWishlistCount();
  const openCart = useCartStore((s) => s.open);

  useEffect(() => {
    useCartStore.persist.rehydrate();
    useWishlistStore.persist.rehydrate();
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) => pathname === href;
  const closeSearch = useCallback(() => setSearchOpen(false), []);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 border-b bg-paper/95 backdrop-blur transition-shadow duration-200",
          scrolled
            ? "border-border shadow-[0_8px_24px_-16px_rgba(24,20,15,0.25)]"
            : "border-transparent",
        )}
      >
        <div className="container-page flex h-[72px] items-center justify-between gap-4">
          <div className="flex w-20 items-center lg:hidden">
            <button
              type="button"
              aria-label="Open menu"
              aria-expanded={mobileMenuOpen}
              onClick={() => setMobileMenuOpen(true)}
              className="-ml-2 flex h-10 w-10 items-center justify-center text-ink"
            >
              <Menu size={22} />
            </button>
          </div>

          <div className="flex flex-1 justify-center lg:flex-none lg:justify-start">
            <Logo />
          </div>

          <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary">
            <Link href="/shop" className={cn(NAV_LINK, isActive("/shop") && "text-ink")}>
              Shop All
            </Link>
            {categories.slice(0, 5).map((category, index) => {
              const href = `/category/${category.slug}`;
              return (
                <Link
                  key={category.id}
                  href={href}
                  aria-current={isActive(href) ? "page" : undefined}
                  className={cn(NAV_LINK, index >= 3 && "hidden xl:block", isActive(href) && "text-ink")}
                >
                  {category.name}
                </Link>
              );
            })}
            <Link href="/shop?sort=newest" className={NAV_LINK}>
              New Arrivals
            </Link>
          </nav>

          <div className="flex w-20 items-center justify-end gap-0.5 sm:w-auto sm:gap-1">
            <button
              type="button"
              aria-label="Search products"
              onClick={() => setSearchOpen(true)}
              className="flex h-10 w-10 items-center justify-center text-ink-soft transition-colors hover:text-ink"
            >
              <Search size={19} />
            </button>
            <AccountMenu session={session} />
            <Link
              href="/wishlist"
              aria-label={`Wishlist${wishlistCount > 0 ? `, ${wishlistCount} items` : ""}`}
              className="relative hidden h-10 w-10 items-center justify-center text-ink-soft transition-colors hover:text-ink sm:flex"
            >
              <Heart size={19} />
              {wishlistCount > 0 && (
                <span className="absolute right-0.5 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-medium text-paper">
                  {wishlistCount}
                </span>
              )}
            </Link>
            <button
              type="button"
              aria-label={`Shopping bag${cartCount > 0 ? `, ${cartCount} items` : ""}`}
              onClick={openCart}
              className="relative -mr-2 flex h-10 w-10 items-center justify-center text-ink-soft transition-colors hover:text-ink sm:mr-0"
            >
              <ShoppingBag size={19} />
              {cartCount > 0 && (
                <span className="absolute right-0.5 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-medium text-paper">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <MobileMenu open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} categories={categories} session={session} />
      {searchOpen && <SearchOverlay onClose={closeSearch} />}
      <CartDrawer />
    </>
  );
}

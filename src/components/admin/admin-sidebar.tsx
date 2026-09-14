"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, FolderTree, ShoppingCart, Users, Tag, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/categories", label: "Categories", icon: FolderTree },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/coupons", label: "Coupons", icon: Tag },
];

export function AdminSidebar({ orientation = "vertical" }: { orientation?: "vertical" | "horizontal" }) {
  const pathname = usePathname();
  const horizontal = orientation === "horizontal";

  return (
    <nav aria-label="Admin" className={cn("flex gap-1", horizontal ? "w-max flex-row" : "flex-col")}>
      {LINKS.map(({ href, label, icon: Icon }) => {
        const active = href === "/admin" ? pathname === href : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex items-center gap-2.5 whitespace-nowrap rounded-sm px-3 py-2.5 text-sm transition-colors",
              active ? "bg-ink text-paper" : "text-ink-soft hover:bg-surface-alt hover:text-ink",
            )}
          >
            <Icon size={16} /> {label}
          </Link>
        );
      })}
      <Link
        href="/"
        target="_blank"
        className={cn(
          "flex items-center gap-2.5 whitespace-nowrap rounded-sm px-3 py-2.5 text-sm text-ink-soft transition-colors hover:bg-surface-alt hover:text-ink",
          !horizontal && "mt-4",
        )}
      >
        <ExternalLink size={16} /> View Storefront
      </Link>
    </nav>
  );
}

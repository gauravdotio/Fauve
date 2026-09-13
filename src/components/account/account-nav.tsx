"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, Package, MapPin, LogOut } from "lucide-react";
import { logoutAction } from "@/lib/actions/auth-actions";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/account", label: "Overview", icon: User },
  { href: "/account/orders", label: "Order History", icon: Package },
  { href: "/account/addresses", label: "Addresses", icon: MapPin },
];

export function AccountNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Account" className="flex flex-col gap-1">
      {LINKS.map(({ href, label, icon: Icon }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex items-center gap-2.5 px-3 py-2.5 text-sm transition-colors",
              active ? "bg-surface-alt font-medium text-ink" : "text-ink-soft hover:bg-surface-alt hover:text-ink",
            )}
          >
            <Icon size={16} /> {label}
          </Link>
        );
      })}
      <form action={logoutAction}>
        <button type="submit" className="flex w-full items-center gap-2.5 px-3 py-2.5 text-left text-sm text-ink-soft transition-colors hover:bg-surface-alt hover:text-error">
          <LogOut size={16} /> Sign Out
        </button>
      </form>
    </nav>
  );
}

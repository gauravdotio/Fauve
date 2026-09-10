"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { User, Package, MapPin, LogOut, ShieldCheck } from "lucide-react";
import type { Session } from "next-auth";
import { logoutAction } from "@/lib/actions/auth-actions";

export function AccountMenu({ session }: { session: Session | null }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!session) {
    return (
      <Link
        href="/login"
        aria-label="Sign in"
        className="hidden h-10 w-10 items-center justify-center text-ink-soft transition-colors hover:text-ink sm:flex"
      >
        <User size={19} />
      </Link>
    );
  }

  return (
    <div ref={ref} className="relative hidden sm:block">
      <button
        type="button"
        aria-label="Account menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex h-10 w-10 items-center justify-center text-ink-soft transition-colors hover:text-ink"
      >
        <User size={19} />
      </button>
      {open && (
        <div
          role="menu"
          className="absolute right-0 top-12 w-56 border border-border bg-surface py-2 shadow-lg"
        >
          <div className="border-b border-border px-4 pb-2.5 pt-1">
            <p className="truncate text-sm font-medium text-ink">{session.user.name}</p>
            <p className="truncate text-xs text-ink-faint">{session.user.email}</p>
          </div>
          <Link
            href="/account"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-ink-soft hover:bg-surface-alt hover:text-ink"
          >
            <User size={15} /> Account Overview
          </Link>
          <Link
            href="/account/orders"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-ink-soft hover:bg-surface-alt hover:text-ink"
          >
            <Package size={15} /> Order History
          </Link>
          <Link
            href="/account/addresses"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-ink-soft hover:bg-surface-alt hover:text-ink"
          >
            <MapPin size={15} /> Addresses
          </Link>
          {session.user.role === "ADMIN" && (
            <Link
              href="/admin"
              role="menuitem"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-ink-soft hover:bg-surface-alt hover:text-ink"
            >
              <ShieldCheck size={15} /> Admin Dashboard
            </Link>
          )}
          <form action={logoutAction} className="border-t border-border pt-1">
            <button
              type="submit"
              role="menuitem"
              className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm text-ink-soft hover:bg-surface-alt hover:text-error"
            >
              <LogOut size={15} /> Sign Out
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

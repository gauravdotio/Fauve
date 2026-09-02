import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="Fauve home"
      className={cn(
        "font-serif text-2xl font-medium tracking-tight text-ink transition-opacity hover:opacity-70",
        className,
      )}
    >
      Fauve
    </Link>
  );
}

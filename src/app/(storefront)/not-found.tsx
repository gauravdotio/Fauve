import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center gap-6 py-24 text-center">
      <span className="text-xs font-medium uppercase tracking-[0.14em] text-accent">Error 404</span>
      <h1 className="max-w-lg text-balance font-serif text-4xl leading-[1.1] text-ink sm:text-5xl">
        This page has wandered off
      </h1>
      <p className="max-w-sm text-base leading-relaxed text-ink-soft">
        The link may be broken, or the product may no longer be available.
      </p>
      <div className="flex flex-wrap justify-center gap-3 pt-2">
        <Link href="/shop" className={buttonVariants({ size: "lg" })}>
          Shop the Collection
        </Link>
        <Link href="/" className={buttonVariants({ variant: "secondary", size: "lg" })}>
          Back to Home
        </Link>
      </div>
    </div>
  );
}

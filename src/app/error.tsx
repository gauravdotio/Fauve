"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center gap-6 py-24 text-center">
      <span className="text-xs font-medium uppercase tracking-[0.14em] text-accent">Something went wrong</span>
      <h1 className="max-w-lg text-balance font-serif text-4xl leading-[1.1] text-ink sm:text-5xl">
        We couldn&apos;t load this page
      </h1>
      <p className="max-w-sm text-base leading-relaxed text-ink-soft">
        This is on our end, not yours. Please try again in a moment.
      </p>
      <div className="flex flex-wrap justify-center gap-3 pt-2">
        <Button size="lg" onClick={reset}>
          Try Again
        </Button>
        <Link href="/" className={buttonVariants({ variant: "secondary", size: "lg" })}>
          Back to Home
        </Link>
      </div>
    </div>
  );
}

import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export function Editorial() {
  return (
    <section className="bg-surface-alt">
      <div className="container-page grid grid-cols-1 items-center gap-0 lg:grid-cols-2">
        <div className="relative aspect-[4/5] w-full lg:aspect-auto lg:h-[640px]">
          <Image
            src="https://images.unsplash.com/photo-1610973310510-82f514ea1986"
            alt="Stacked knitwear in natural wool, showing the texture of the knit"
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
        <div className="flex flex-col gap-6 px-6 py-16 sm:px-10 lg:px-16 lg:py-0">
          <span className="text-xs font-medium uppercase tracking-[0.14em] text-accent">The Fauve Journal</span>
          <h2 className="max-w-md text-balance font-serif text-3xl leading-[1.15] text-ink sm:text-4xl">
            Fabric first. Everything else follows.
          </h2>
          <p className="max-w-md text-sm leading-relaxed text-ink-soft sm:text-base">
            We start every piece with the material — sourcing long-staple cottons, responsibly tanned
            leathers, and natural fiber knits before a single pattern is cut. It&apos;s a slower way to
            design, but it&apos;s the only way we know how to build something worth keeping.
          </p>
          <Link href="/about" className={buttonVariants({ variant: "outline", size: "lg", className: "w-fit" })}>
            Our Approach
          </Link>
        </div>
      </div>
    </section>
  );
}

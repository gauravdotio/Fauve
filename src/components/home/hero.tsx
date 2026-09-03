import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative flex min-h-[86vh] items-end overflow-hidden bg-ink sm:min-h-[92vh]">
      <Image
        src="https://images.unsplash.com/photo-1647957866343-87662a2daaad"
        alt="Model in a camel wool coat standing in an open mountain landscape"
        fill
        priority
        sizes="100vw"
        className="object-cover opacity-90"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/10 to-ink/20" />

      <div className="container-page relative flex flex-col gap-6 pb-16 pt-32 text-paper sm:pb-24">
        <span className="animate-fade-up text-xs font-medium uppercase tracking-[0.2em] text-paper/80">
          Autumn Collection — 01
        </span>
        <h1 className="animate-fade-up max-w-2xl text-balance font-serif text-5xl leading-[1.05] sm:text-6xl lg:text-7xl" style={{ animationDelay: "80ms" }}>
          Considered essentials for the everyday
        </h1>
        <p className="animate-fade-up max-w-md text-balance text-base leading-relaxed text-paper/85 sm:text-lg" style={{ animationDelay: "160ms" }}>
          Natural materials, quiet detailing, and construction built to outlast a season — not just survive it.
        </p>
        <div className="animate-fade-up flex flex-wrap items-center gap-4 pt-2" style={{ animationDelay: "240ms" }}>
          <Link href="/shop" className={buttonVariants({ variant: "primary", size: "lg", className: "bg-paper text-ink hover:bg-paper/90" })}>
            Shop the Collection
          </Link>
          <Link
            href="/category/outerwear"
            className="group inline-flex items-center gap-2 text-sm font-medium text-paper transition-colors hover:text-paper/80"
          >
            Explore Outerwear
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}

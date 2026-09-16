import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { buttonVariants } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "About",
  description: "Fauve makes fewer, better things — clothing and objects cut from natural materials and built to last.",
};

const PRINCIPLES = [
  {
    id: "materials",
    number: "01",
    title: "Materials first",
    body: "Every piece starts with the fabric: long-staple cottons, responsibly sourced wool, and vegetable-tanned leather chosen for how they wear over years, not weeks.",
  },
  {
    id: "making",
    number: "02",
    title: "Made with partners, not factories",
    body: "We work with a small group of family-run workshops in Portugal, Italy, and Japan. Long relationships mean better craft, fair pay, and fewer shortcuts.",
  },
  {
    id: "sustainability",
    number: "03",
    title: "Built to be kept",
    body: "The most sustainable garment is the one you don't replace. We design in small, considered runs, repair what we can, and ship in plastic-free packaging.",
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="container-page pb-16 pt-6 sm:pb-24">
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "About" }]} />
        <div className="mt-12 grid grid-cols-1 gap-8 sm:mt-20 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <span className="text-xs font-medium uppercase tracking-[0.14em] text-accent">About Fauve</span>
            <h1 className="mt-4 text-balance font-serif text-5xl leading-[1.02] text-ink sm:text-6xl lg:text-7xl">
              Fewer, better things.
            </h1>
          </div>
          <p className="self-end text-lg leading-relaxed text-ink-soft lg:col-span-5">
            Fauve began with a simple frustration: clothes that looked good for a season and then didn&apos;t. We
            set out to make the opposite — quiet, well-made pieces that get better the longer you own them.
          </p>
        </div>
      </section>

      <div className="container-page">
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-surface-alt sm:aspect-[21/9]">
          <Image
            src="https://images.unsplash.com/photo-1626576352171-211d1cc5ec73"
            alt="A man in a dark wool overcoat standing in an open field"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
      </div>

      <section className="container-page py-20 sm:py-28">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-10">
          {PRINCIPLES.map((principle) => (
            <div key={principle.id} id={principle.id} className="scroll-mt-28 border-t border-ink pt-6">
              <span className="font-serif text-sm text-accent">{principle.number}</span>
              <h2 className="mt-3 font-serif text-2xl text-ink">{principle.title}</h2>
              <p className="mt-4 text-sm leading-relaxed text-ink-soft sm:text-base">{principle.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-surface-alt">
        <div className="container-page flex flex-col items-center gap-6 py-20 text-center sm:py-24">
          <h2 className="max-w-xl text-balance font-serif text-3xl leading-[1.15] text-ink sm:text-4xl">
            See what we&apos;ve been making
          </h2>
          <Link href="/shop" className={buttonVariants({ size: "lg" })}>
            Shop the Collection
          </Link>
        </div>
      </section>
    </>
  );
}

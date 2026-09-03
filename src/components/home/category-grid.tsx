import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SectionHeader } from "@/components/ui/section-header";
import type { CategoryWithCount } from "@/lib/types";

export function CategoryGrid({ categories }: { categories: CategoryWithCount[] }) {
  const featured = categories.slice(0, 6);

  return (
    <section className="container-page py-20 sm:py-28">
      <SectionHeader
        eyebrow="Shop by Category"
        title="Find your next favorite"
        description="From outerwear built for the season ahead to small objects for the home — browse the full range."
        className="mb-12"
      />

      <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3">
        {featured.map((category, index) => (
          <Link
            key={category.id}
            href={`/category/${category.slug}`}
            className={`group relative overflow-hidden bg-surface-alt ${
              index === 0 ? "col-span-2 aspect-[16/10] lg:aspect-[16/9]" : "aspect-[4/5]"
            }`}
          >
            <Image
              src={category.image}
              alt={category.name}
              fill
              sizes={index === 0 ? "100vw" : "(min-width: 1024px) 33vw, 50vw"}
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/0 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5 sm:p-6">
              <div className="flex flex-col gap-1">
                <h3 className="font-serif text-xl text-paper sm:text-2xl">{category.name}</h3>
                <p className="hidden text-sm text-paper/80 sm:block">{category.productCount} products</p>
              </div>
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-paper/90 text-ink transition-transform duration-300 group-hover:rotate-45">
                <ArrowUpRight size={16} />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

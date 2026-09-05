import Image from "next/image";
import { Breadcrumb, type BreadcrumbItem } from "@/components/ui/breadcrumb";

interface CatalogHeaderProps {
  breadcrumb: BreadcrumbItem[];
  eyebrow?: string;
  title: string;
  description?: string;
  image?: string;
  count?: number;
}

export function CatalogHeader({ breadcrumb, eyebrow, title, description, image, count }: CatalogHeaderProps) {
  if (image) {
    return (
      <section className="container-page pt-6">
        <Breadcrumb items={breadcrumb} />
        <div className="mt-6 grid grid-cols-1 overflow-hidden bg-surface-alt md:grid-cols-2">
          <div className="order-2 flex flex-col justify-end gap-4 p-6 sm:p-10 md:order-1 lg:p-14">
            {eyebrow && (
              <span className="text-xs font-medium uppercase tracking-[0.14em] text-accent">{eyebrow}</span>
            )}
            <h1 className="text-balance font-serif text-4xl leading-[1.05] text-ink lg:text-5xl">{title}</h1>
            {description && (
              <p className="max-w-md text-sm leading-relaxed text-ink-soft sm:text-base">{description}</p>
            )}
            {typeof count === "number" && (
              <p className="pt-2 text-xs uppercase tracking-[0.12em] text-ink-faint">
                {count} {count === 1 ? "piece" : "pieces"}
              </p>
            )}
          </div>
          <div className="relative order-1 aspect-[16/10] md:order-2 md:aspect-auto md:min-h-[340px]">
            <Image src={image} alt="" fill priority sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="container-page pb-8 pt-6 sm:pb-10">
      <Breadcrumb items={breadcrumb} />
      <div className="mt-8 flex flex-col gap-3 sm:mt-12">
        {eyebrow && <span className="text-xs font-medium uppercase tracking-[0.14em] text-accent">{eyebrow}</span>}
        <h1 className="text-balance font-serif text-4xl leading-[1.05] text-ink sm:text-5xl">{title}</h1>
        {description && (
          <p className="max-w-xl text-sm leading-relaxed text-ink-soft sm:text-base">{description}</p>
        )}
      </div>
    </section>
  );
}

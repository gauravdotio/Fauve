import Link from "next/link";
import { Plus } from "lucide-react";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import type { InfoPage } from "@/content/info-pages";
import { cn } from "@/lib/utils";

interface InfoPageViewProps {
  page: InfoPage;
  nav: { href: string; label: string }[];
  activeHref: string;
}

export function InfoPageView({ page, nav, activeHref }: InfoPageViewProps) {
  return (
    <div className="container-page pb-24 pt-6">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: page.eyebrow }, { label: page.title }]} />

      <div className="mt-10 grid grid-cols-1 gap-12 sm:mt-14 lg:grid-cols-12 lg:gap-16">
        <aside className="lg:col-span-3">
          <nav aria-label={`${page.eyebrow} pages`} className="lg:sticky lg:top-28">
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.14em] text-ink-faint">{page.eyebrow}</p>
            <ul className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 lg:mx-0 lg:flex-col lg:gap-0 lg:px-0">
              {nav.map((item) => {
                const active = item.href === activeHref;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "inline-flex whitespace-nowrap rounded-full border px-4 py-2 text-sm transition-colors lg:flex lg:rounded-none lg:border-0 lg:border-l lg:px-4 lg:py-2",
                        active
                          ? "border-ink bg-ink text-paper lg:bg-transparent lg:font-medium lg:text-ink"
                          : "border-border-strong text-ink-soft hover:text-ink lg:border-border",
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>

        <article className="max-w-2xl lg:col-span-8">
          <span className="text-xs font-medium uppercase tracking-[0.14em] text-accent">{page.eyebrow}</span>
          <h1 className="mt-3 text-balance font-serif text-4xl leading-[1.1] text-ink sm:text-5xl">{page.title}</h1>
          <p className="mt-5 text-lg leading-relaxed text-ink-soft">{page.intro}</p>
          {page.updated && <p className="mt-3 text-xs text-ink-faint">Last updated {page.updated}</p>}

          {page.format === "faq" ? (
            <div className="mt-12 divide-y divide-border border-y border-border">
              {page.sections.map((section) => (
                <details key={section.heading} className="group">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-base font-medium text-ink [&::-webkit-details-marker]:hidden">
                    {section.heading}
                    <Plus size={18} className="shrink-0 text-ink-soft transition-transform duration-200 group-open:rotate-45" />
                  </summary>
                  <div className="pb-6">
                    {section.body.map((paragraph) => (
                      <p key={paragraph} className="text-sm leading-relaxed text-ink-soft">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </details>
              ))}
            </div>
          ) : (
            <div className="mt-12 flex flex-col gap-10">
              {page.sections.map((section) => (
                <section key={section.heading}>
                  <h2 className="text-lg font-medium text-ink">{section.heading}</h2>
                  <div className="mt-3 flex flex-col gap-3">
                    {section.body.map((paragraph) => (
                      <p key={paragraph} className="text-base leading-relaxed text-ink-soft">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}
        </article>
      </div>
    </div>
  );
}

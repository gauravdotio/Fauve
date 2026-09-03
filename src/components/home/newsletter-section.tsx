import { Newsletter } from "@/components/layout/newsletter";

export function NewsletterSection() {
  return (
    <section className="container-page py-20 sm:py-28">
      <div className="flex flex-col items-center gap-6 text-center">
        <span className="text-xs font-medium uppercase tracking-[0.14em] text-accent">Stay Considered</span>
        <h2 className="max-w-lg text-balance font-serif text-3xl leading-[1.15] text-ink sm:text-4xl">
          10% off your first order, plus early access to new arrivals
        </h2>
        <p className="max-w-sm text-sm leading-relaxed text-ink-soft">
          Join our list for restock alerts, new collection previews, and considered notes from the studio.
        </p>
        <div className="mt-2 flex justify-center">
          <Newsletter variant="section" />
        </div>
      </div>
    </section>
  );
}

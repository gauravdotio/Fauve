import { ShieldCheck, Truck, RefreshCcw, Leaf } from "lucide-react";

const VALUES = [
  {
    icon: Truck,
    title: "Fast, tracked shipping",
    description: "Every order ships within 48 hours with real-time tracking included.",
  },
  {
    icon: RefreshCcw,
    title: "30-day easy returns",
    description: "Not the right fit? Send it back within 30 days for a full refund.",
  },
  {
    icon: ShieldCheck,
    title: "Secure checkout",
    description: "Encrypted payments processed through industry-standard providers.",
  },
  {
    icon: Leaf,
    title: "Responsibly made",
    description: "Natural materials, low-impact dyes, and durable construction throughout.",
  },
];

export function TrustSection() {
  return (
    <section className="border-y border-border bg-ink text-paper">
      <div className="container-page grid grid-cols-1 gap-10 py-16 sm:grid-cols-2 sm:gap-8 lg:grid-cols-4 lg:py-20">
        {VALUES.map(({ icon: Icon, title, description }) => (
          <div key={title} className="flex flex-col gap-4">
            <Icon size={22} strokeWidth={1.5} className="text-paper/70" />
            <div className="flex flex-col gap-1.5">
              <h3 className="text-sm font-medium text-paper">{title}</h3>
              <p className="text-sm leading-relaxed text-paper/65">{description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

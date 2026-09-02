import Link from "next/link";
import { getCategories } from "@/lib/data";
import { Newsletter } from "@/components/layout/newsletter";

export async function Footer() {
  const categories = await getCategories();

  return (
    <footer className="border-t border-border bg-surface-alt">
      <div className="container-page py-16">
        <div className="grid grid-cols-2 gap-x-8 gap-y-12 sm:grid-cols-3 lg:grid-cols-6">
          <div className="col-span-2 flex flex-col gap-4 sm:col-span-3 lg:col-span-2">
            <span className="font-serif text-2xl text-ink">Fauve</span>
            <p className="max-w-xs text-sm leading-relaxed text-ink-soft">
              Considered clothing, footwear, and objects for the everyday — cut from natural materials and
              built to outlast a season.
            </p>
            <div className="mt-2 flex flex-col gap-3">
              <p className="text-xs font-medium uppercase tracking-wide text-ink-faint">
                Join the list for early access
              </p>
              <Newsletter variant="footer" />
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <p className="text-xs font-medium uppercase tracking-wide text-ink-faint">Shop</p>
            <Link href="/shop" className="text-sm text-ink-soft hover:text-ink">
              All Products
            </Link>
            <Link href="/shop?sort=newest" className="text-sm text-ink-soft hover:text-ink">
              New Arrivals
            </Link>
            <Link href="/shop?sort=featured" className="text-sm text-ink-soft hover:text-ink">
              Featured
            </Link>
            <Link href="/wishlist" className="text-sm text-ink-soft hover:text-ink">
              Wishlist
            </Link>
          </div>

          <div className="flex flex-col gap-3">
            <p className="text-xs font-medium uppercase tracking-wide text-ink-faint">Categories</p>
            {categories.slice(0, 5).map((category) => (
              <Link
                key={category.id}
                href={`/category/${category.slug}`}
                className="text-sm text-ink-soft hover:text-ink"
              >
                {category.name}
              </Link>
            ))}
          </div>

          <div className="flex flex-col gap-3">
            <p className="text-xs font-medium uppercase tracking-wide text-ink-faint">Company</p>
            <Link href="/about" className="text-sm text-ink-soft hover:text-ink">
              About Fauve
            </Link>
            <Link href="/about#sustainability" className="text-sm text-ink-soft hover:text-ink">
              Sustainability
            </Link>
            <Link href="/about#materials" className="text-sm text-ink-soft hover:text-ink">
              Our Materials
            </Link>
          </div>

          <div className="flex flex-col gap-3">
            <p className="text-xs font-medium uppercase tracking-wide text-ink-faint">Support</p>
            <Link href="/support/shipping" className="text-sm text-ink-soft hover:text-ink">
              Shipping
            </Link>
            <Link href="/support/returns" className="text-sm text-ink-soft hover:text-ink">
              Returns &amp; Exchanges
            </Link>
            <Link href="/support/contact" className="text-sm text-ink-soft hover:text-ink">
              Contact Us
            </Link>
            <Link href="/support/faq" className="text-sm text-ink-soft hover:text-ink">
              FAQ
            </Link>
          </div>
        </div>

        <div className="mt-14 flex flex-col-reverse items-center justify-between gap-6 border-t border-border pt-8 sm:flex-row">
          <p className="text-xs text-ink-faint">© {new Date().getFullYear()} Fauve. All rights reserved.</p>
          <div className="flex items-center gap-5">
            <Link href="/legal/privacy" className="text-xs text-ink-faint hover:text-ink">
              Privacy Policy
            </Link>
            <Link href="/legal/terms" className="text-xs text-ink-faint hover:text-ink">
              Terms of Service
            </Link>
            <div className="flex items-center gap-4 pl-3">
              {[
                { label: "Instagram", href: "https://www.instagram.com" },
                { label: "Pinterest", href: "https://www.pinterest.com" },
                { label: "X", href: "https://x.com" },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-ink-faint hover:text-ink"
                >
                  {social.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

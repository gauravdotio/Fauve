import type { Metadata } from "next";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { WishlistView } from "@/components/wishlist/wishlist-view";

export const metadata: Metadata = {
  title: "Wishlist",
  robots: { index: false },
};

export default function WishlistPage() {
  return (
    <div className="container-page pb-24 pt-6">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Wishlist" }]} />
      <h1 className="mb-4 mt-8 font-serif text-4xl text-ink sm:mt-12 sm:text-5xl">Wishlist</h1>
      <WishlistView />
    </div>
  );
}

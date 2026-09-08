import type { Metadata } from "next";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { CartView } from "@/components/cart/cart-view";

export const metadata: Metadata = {
  title: "Your Bag",
  robots: { index: false },
};

export default function CartPage() {
  return (
    <div className="container-page pb-24 pt-6">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Bag" }]} />
      <h1 className="mb-10 mt-8 font-serif text-4xl text-ink sm:mt-12 sm:text-5xl">Your Bag</h1>
      <CartView />
    </div>
  );
}

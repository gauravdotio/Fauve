import type { Metadata } from "next";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { CheckoutForm } from "@/components/checkout/checkout-form";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "Checkout", robots: { index: false } };

export default async function CheckoutPage() {
  const session = await auth();

  const savedAddresses = session?.user
    ? await prisma.address.findMany({
        where: { userId: session.user.id },
        orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
      })
    : [];

  return (
    <div className="container-page pb-24 pt-6">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Bag", href: "/cart" }, { label: "Checkout" }]} />
      <h1 className="mb-10 mt-8 font-serif text-4xl text-ink sm:mt-12 sm:text-5xl">Checkout</h1>
      <CheckoutForm session={session} savedAddresses={savedAddresses} />
    </div>
  );
}

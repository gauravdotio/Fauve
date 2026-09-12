import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { getOrderByNumber } from "@/lib/orders";
import { OrderDetail } from "@/components/order/order-detail";
import { buttonVariants } from "@/components/ui/button";

export const metadata: Metadata = { title: "Order Confirmed", robots: { index: false } };

export default async function OrderConfirmationPage({ params }: PageProps<"/order-confirmation/[orderNumber]">) {
  const { orderNumber } = await params;
  const order = await getOrderByNumber(orderNumber);
  if (!order) notFound();

  return (
    <div className="container-page pb-24 pt-6">
      <div className="mx-auto max-w-3xl">
        <div className="flex flex-col items-center gap-4 py-10 text-center">
          <CheckCircle2 size={40} strokeWidth={1.5} className="text-success" />
          <span className="text-xs font-medium uppercase tracking-[0.14em] text-accent">Order Confirmed</span>
          <h1 className="text-balance font-serif text-4xl leading-[1.1] text-ink sm:text-5xl">Thank you{order.user?.name ? `, ${order.user.name.split(" ")[0]}` : ""}.</h1>
          <p className="max-w-md text-base leading-relaxed text-ink-soft">
            Your order <span className="font-medium text-ink">{order.orderNumber}</span> has been placed. We&apos;ll
            send updates to{" "}
            <span className="font-medium text-ink">{order.user?.email ?? order.guestEmail}</span> as it ships.
          </p>
          <div className="flex gap-3 pt-2">
            <Link href="/shop" className={buttonVariants({ size: "lg" })}>
              Continue Shopping
            </Link>
          </div>
        </div>

        <div className="border-t border-border pt-10">
          <OrderDetail order={order} />
        </div>
      </div>
    </div>
  );
}

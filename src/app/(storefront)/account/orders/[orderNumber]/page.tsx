import type { Metadata } from "next";
import { redirect, notFound } from "next/navigation";
import { auth } from "@/auth";
import { getOrderForUser } from "@/lib/orders";
import { OrderDetail } from "@/components/order/order-detail";
import { OrderStatusBadge } from "@/components/order/order-status-badge";

export const metadata: Metadata = { title: "Order Details", robots: { index: false } };

export default async function AccountOrderDetailPage({ params }: PageProps<"/account/orders/[orderNumber]">) {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/account/orders");

  const { orderNumber } = await params;
  const order = await getOrderForUser(orderNumber, session.user.id);
  if (!order) notFound();

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-3xl text-ink">{order.orderNumber}</h1>
          <p className="mt-1 text-sm text-ink-soft">
            Placed {order.createdAt.toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" })}
          </p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>
      <OrderDetail order={order} />
    </div>
  );
}

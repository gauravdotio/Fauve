import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Package } from "lucide-react";
import { auth } from "@/auth";
import { getUserOrders } from "@/lib/orders";
import { OrderStatusBadge } from "@/components/order/order-status-badge";
import { EmptyState } from "@/components/ui/empty-state";
import { formatPrice } from "@/lib/utils";

export const metadata: Metadata = { title: "Order History", robots: { index: false } };

export default async function OrderHistoryPage() {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/account/orders");

  const orders = await getUserOrders(session.user.id);

  return (
    <div>
      <h1 className="mb-8 font-serif text-3xl text-ink">Order History</h1>

      {orders.length === 0 ? (
        <EmptyState icon={Package} title="No orders yet" description="Your placed orders will show up here." actionLabel="Start shopping" actionHref="/shop" />
      ) : (
        <ul className="flex flex-col divide-y divide-border border-y border-border">
          {orders.map((order) => (
            <li key={order.id}>
              <Link href={`/account/orders/${order.orderNumber}`} className="flex flex-col gap-3 py-5 sm:flex-row sm:items-center sm:justify-between hover:bg-surface-alt/50">
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-medium text-ink">{order.orderNumber}</p>
                  <p className="text-xs text-ink-soft">
                    Placed {order.createdAt.toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" })}
                  </p>
                  <p className="text-xs text-ink-faint">
                    {order.items.slice(0, 3).map((i) => i.name).join(", ")}
                    {order.items.length > 3 ? `, +${order.items.length - 3} more` : ""}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <OrderStatusBadge status={order.status} />
                  <span className="text-sm font-medium tabular-nums text-ink">{formatPrice(order.total)}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

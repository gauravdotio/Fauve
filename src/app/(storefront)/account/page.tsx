import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Package, MapPin, ArrowRight } from "lucide-react";
import { auth } from "@/auth";
import { getUserOrders } from "@/lib/orders";
import { prisma } from "@/lib/prisma";
import { mockStore } from "@/lib/mock-store";
import { OrderStatusBadge } from "@/components/order/order-status-badge";
import { formatPrice } from "@/lib/utils";

export const metadata: Metadata = { title: "My Account", robots: { index: false } };

export default async function AccountPage() {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/account");

  let addressCount = 1;
  try {
    addressCount = await prisma.address.count({ where: { userId: session.user.id } });
  } catch {
    addressCount = mockStore.getAddresses(session.user.id).length;
  }

  const orders = await getUserOrders(session.user.id);
  const recentOrders = orders.slice(0, 3);

  return (
    <div className="flex flex-col gap-10">
      <div>
        <h1 className="font-serif text-3xl text-ink">Welcome back, {session.user.name?.split(" ")[0]}</h1>
        <p className="mt-2 text-sm text-ink-soft">{session.user.email}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Link href="/account/orders" className="flex items-center justify-between border border-border p-5 transition-colors hover:border-ink">
          <div className="flex items-center gap-3.5">
            <Package size={20} strokeWidth={1.5} className="text-ink" />
            <div>
              <p className="text-sm font-medium text-ink">{orders.length} {orders.length === 1 ? "Order" : "Orders"}</p>
              <p className="text-xs text-ink-soft">View order history</p>
            </div>
          </div>
          <ArrowRight size={16} className="text-ink-faint" />
        </Link>
        <Link href="/account/addresses" className="flex items-center justify-between border border-border p-5 transition-colors hover:border-ink">
          <div className="flex items-center gap-3.5">
            <MapPin size={20} strokeWidth={1.5} className="text-ink" />
            <div>
              <p className="text-sm font-medium text-ink">{addressCount} Saved {addressCount === 1 ? "Address" : "Addresses"}</p>
              <p className="text-xs text-ink-soft">Manage shipping addresses</p>
            </div>
          </div>
          <ArrowRight size={16} className="text-ink-faint" />
        </Link>
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-medium uppercase tracking-wide text-ink">Recent Orders</h2>
          {orders.length > 0 && (
            <Link href="/account/orders" className="text-sm text-ink-soft hover:text-ink">
              View all
            </Link>
          )}
        </div>

        {recentOrders.length === 0 ? (
          <div className="border border-dashed border-border-strong px-6 py-12 text-center">
            <p className="text-sm text-ink-soft">You haven&apos;t placed any orders yet.</p>
            <Link href="/shop" className="mt-3 inline-block text-sm font-medium text-accent hover:text-accent-dark">
              Start shopping
            </Link>
          </div>
        ) : (
          <ul className="divide-y divide-border border-y border-border">
            {recentOrders.map((order) => (
              <li key={order.id}>
                <Link href={`/account/orders/${order.orderNumber}`} className="flex items-center justify-between gap-4 py-4 hover:bg-surface-alt/50">
                  <div>
                    <p className="text-sm font-medium text-ink">{order.orderNumber}</p>
                    <p className="text-xs text-ink-soft">
                      {order.createdAt.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })} ·{" "}
                      {order.items.length} {order.items.length === 1 ? "item" : "items"}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <OrderStatusBadge status={order.status} />
                    <span className="text-sm tabular-nums text-ink">{formatPrice(order.total)}</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

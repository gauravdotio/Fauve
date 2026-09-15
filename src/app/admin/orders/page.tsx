import type { Metadata } from "next";
import Link from "next/link";
import { Search } from "lucide-react";
import { getAdminOrders } from "@/lib/admin-data";
import { OrderStatusBadge } from "@/components/order/order-status-badge";
import { AdminPagination } from "@/components/admin/admin-pagination";
import { formatPrice, cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Orders", robots: { index: false } };

const STATUSES = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];

export default async function AdminOrdersPage({ searchParams }: PageProps<"/admin/orders">) {
  const params = await searchParams;
  const search = typeof params.search === "string" ? params.search : undefined;
  const status = typeof params.status === "string" ? params.status : undefined;
  const page = Number(params.page) || 1;

  const { items, total, totalPages } = await getAdminOrders({ search, status, page });

  const buildHref = (patch: { status?: string; search?: string }) => {
    const next = new URLSearchParams();
    const nextStatus = "status" in patch ? patch.status : status;
    const nextSearch = "search" in patch ? patch.search : search;
    if (nextStatus) next.set("status", nextStatus);
    if (nextSearch) next.set("search", nextSearch);
    const qs = next.toString();
    return qs ? `/admin/orders?${qs}` : "/admin/orders";
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-serif text-3xl text-ink">Orders</h1>
        <p className="mt-1 text-sm text-ink-soft">{total} total</p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <form className="relative max-w-sm flex-1">
          <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" />
          <input
            type="search"
            name="search"
            defaultValue={search}
            placeholder="Search order #, name, email…"
            className="h-10 w-full border border-border-strong bg-surface pl-9 pr-3 text-sm text-ink placeholder:text-ink-faint focus:border-ink focus:outline-none"
          />
          {status && <input type="hidden" name="status" value={status} />}
        </form>

        <div className="no-scrollbar flex gap-2 overflow-x-auto">
          <Link
            href={buildHref({ status: undefined })}
            className={cn("shrink-0 rounded-full border px-3.5 py-1.5 text-xs", !status ? "border-ink bg-ink text-paper" : "border-border-strong text-ink-soft hover:border-ink")}
          >
            All
          </Link>
          {STATUSES.map((s) => (
            <Link
              key={s}
              href={buildHref({ status: s })}
              className={cn("shrink-0 rounded-full border px-3.5 py-1.5 text-xs", status === s ? "border-ink bg-ink text-paper" : "border-border-strong text-ink-soft hover:border-ink")}
            >
              {s}
            </Link>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto border border-border">
        <table className="w-full min-w-[720px] text-sm">
          <thead>
            <tr className="border-b border-border bg-surface-alt text-left text-xs uppercase tracking-wide text-ink-faint">
              <th className="px-4 py-3 font-medium">Order</th>
              <th className="px-4 py-3 font-medium">Customer</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Total</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {items.map((order) => (
              <tr key={order.id} className="bg-surface">
                <td className="px-4 py-3">
                  <Link href={`/admin/orders/${order.id}`} className="font-medium text-ink hover:text-accent">
                    {order.orderNumber}
                  </Link>
                </td>
                <td className="px-4 py-3 text-ink-soft">{order.user?.name ?? order.shippingName}</td>
                <td className="px-4 py-3 text-ink-soft">{order.createdAt.toLocaleDateString()}</td>
                <td className="px-4 py-3 tabular-nums text-ink">{formatPrice(order.total)}</td>
                <td className="px-4 py-3">
                  <OrderStatusBadge status={order.status} />
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-sm text-ink-soft">
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <AdminPagination basePath="/admin/orders" page={page} totalPages={totalPages} />
    </div>
  );
}

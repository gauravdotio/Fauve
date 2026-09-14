import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { DollarSign, ShoppingCart, Package, Users, AlertTriangle, Clock } from "lucide-react";
import { getDashboardStats, getTopProducts } from "@/lib/admin-data";
import { StatCard } from "@/components/admin/stat-card";
import { RevenueChart } from "@/components/admin/revenue-chart";
import { OrderStatusBadge } from "@/components/order/order-status-badge";
import { formatPrice } from "@/lib/utils";

export const metadata: Metadata = { title: "Admin Dashboard", robots: { index: false } };

export default async function AdminDashboardPage() {
  const [stats, topProducts] = await Promise.all([getDashboardStats(), getTopProducts(5)]);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-serif text-3xl text-ink">Dashboard</h1>
        <p className="mt-1 text-sm text-ink-soft">An overview of your store&apos;s performance.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total Revenue" value={formatPrice(stats.totalRevenue)} icon={DollarSign} />
        <StatCard label="Orders" value={stats.orderCount.toLocaleString()} icon={ShoppingCart} />
        <StatCard label="Active Products" value={stats.productCount.toLocaleString()} icon={Package} />
        <StatCard label="Customers" value={stats.customerCount.toLocaleString()} icon={Users} />
      </div>

      {(stats.pendingOrders > 0 || stats.lowStockCount > 0) && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {stats.pendingOrders > 0 && (
            <Link href="/admin/orders?status=PENDING" className="flex items-center gap-3 border border-warning/40 bg-warning-soft px-4 py-3.5 text-sm text-ink transition-colors hover:border-warning">
              <Clock size={17} className="text-warning" />
              <span>
                <span className="font-medium">{stats.pendingOrders}</span> order{stats.pendingOrders === 1 ? "" : "s"} awaiting confirmation
              </span>
            </Link>
          )}
          {stats.lowStockCount > 0 && (
            <Link href="/admin/products" className="flex items-center gap-3 border border-warning/40 bg-warning-soft px-4 py-3.5 text-sm text-ink transition-colors hover:border-warning">
              <AlertTriangle size={17} className="text-warning" />
              <span>
                <span className="font-medium">{stats.lowStockCount}</span> product{stats.lowStockCount === 1 ? "" : "s"} running low on stock
              </span>
            </Link>
          )}
        </div>
      )}

      <RevenueChart data={stats.revenueSeries} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-xs font-medium uppercase tracking-wide text-ink">Recent Orders</h2>
            <Link href="/admin/orders" className="text-xs text-ink-soft hover:text-ink">
              View all
            </Link>
          </div>
          {stats.recentOrders.length === 0 ? (
            <p className="border border-dashed border-border-strong px-4 py-8 text-center text-sm text-ink-soft">No orders yet.</p>
          ) : (
            <ul className="divide-y divide-border border-y border-border">
              {stats.recentOrders.map((order) => (
                <li key={order.id}>
                  <Link href={`/admin/orders/${order.id}`} className="flex items-center justify-between gap-3 py-3.5 text-sm hover:bg-surface-alt/60">
                    <div>
                      <p className="font-medium text-ink">{order.orderNumber}</p>
                      <p className="text-xs text-ink-faint">{order.items.length} items</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <OrderStatusBadge status={order.status} />
                      <span className="tabular-nums text-ink">{formatPrice(order.total)}</span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <h2 className="mb-3 text-xs font-medium uppercase tracking-wide text-ink">Top Products</h2>
          {topProducts.length === 0 ? (
            <p className="border border-dashed border-border-strong px-4 py-8 text-center text-sm text-ink-soft">No sales yet.</p>
          ) : (
            <ul className="divide-y divide-border border-y border-border">
              {topProducts.map(({ product, unitsSold }) => (
                <li key={product.id} className="flex items-center gap-3 py-3.5">
                  <div className="relative h-12 w-10 shrink-0 overflow-hidden bg-surface-alt">
                    {product.images[0] && <Image src={product.images[0].url} alt="" fill sizes="40px" className="object-cover" />}
                  </div>
                  <div className="flex flex-1 flex-col text-sm">
                    <span className="font-medium text-ink">{product.name}</span>
                    <span className="text-xs text-ink-faint">{unitsSold} sold</span>
                  </div>
                  <span className="text-sm tabular-nums text-ink">{formatPrice(product.price)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

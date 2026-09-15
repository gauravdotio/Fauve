import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAdminOrderById } from "@/lib/admin-data";
import { OrderDetail } from "@/components/order/order-detail";
import { OrderStatusForm } from "@/components/admin/order-status-form";

export const metadata: Metadata = { title: "Order Details", robots: { index: false } };

export default async function AdminOrderDetailPage({ params }: PageProps<"/admin/orders/[id]">) {
  const { id } = await params;
  const order = await getAdminOrderById(id);
  if (!order) notFound();

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-serif text-3xl text-ink">{order.orderNumber}</h1>
        <p className="mt-1 text-sm text-ink-soft">
          Placed {order.createdAt.toLocaleString()} by {order.user?.name ?? order.shippingName}
          {order.user?.email ? ` (${order.user.email})` : order.guestEmail ? ` (${order.guestEmail})` : ""}
        </p>
        {order.note && <p className="mt-2 text-sm text-ink-soft">Note: {order.note}</p>}
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <OrderDetail order={order} />
        </div>
        <div className="lg:col-span-4">
          <OrderStatusForm orderId={order.id} status={order.status} paymentStatus={order.paymentStatus} />
        </div>
      </div>
    </div>
  );
}

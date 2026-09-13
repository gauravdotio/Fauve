import Image from "next/image";
import type { Order, OrderItem } from "@prisma/client";
import { OrderStatusBadge } from "@/components/order/order-status-badge";
import { formatPrice } from "@/lib/utils";

export function OrderDetail({ order }: { order: Order & { items: OrderItem[] } }) {
  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-[3fr_2fr] lg:gap-12">
      <div>
        <ul className="divide-y divide-border border-y border-border">
          {order.items.map((item) => (
            <li key={item.id} className="flex gap-4 py-5">
              <div className="relative h-20 w-16 shrink-0 overflow-hidden bg-surface-alt">
                {item.image && <Image src={item.image} alt={item.name} fill sizes="64px" className="object-cover" />}
              </div>
              <div className="flex flex-1 flex-col text-sm">
                <span className="font-medium text-ink">{item.name}</span>
                {(item.color || item.size) && (
                  <span className="mt-0.5 text-ink-soft">{[item.color, item.size].filter(Boolean).join(" / ")}</span>
                )}
                <span className="mt-1 text-ink-soft">Qty {item.quantity}</span>
              </div>
              <span className="shrink-0 text-sm tabular-nums text-ink">{formatPrice(item.price * item.quantity)}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col gap-8">
        <div>
          <h2 className="mb-3 text-xs font-medium uppercase tracking-[0.14em] text-ink-faint">Order Summary</h2>
          <dl className="flex flex-col gap-2.5 text-sm">
            <div className="flex justify-between">
              <dt className="text-ink-soft">Subtotal</dt>
              <dd className="tabular-nums text-ink">{formatPrice(order.subtotal)}</dd>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-success">
                <dt>Discount {order.couponCode ? `(${order.couponCode})` : ""}</dt>
                <dd className="tabular-nums">−{formatPrice(order.discount)}</dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt className="text-ink-soft">Shipping</dt>
              <dd className="tabular-nums text-ink">{order.shipping === 0 ? "Free" : formatPrice(order.shipping)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink-soft">Tax</dt>
              <dd className="tabular-nums text-ink">{formatPrice(order.tax)}</dd>
            </div>
            <div className="flex justify-between border-t border-border pt-3 text-base">
              <dt className="font-medium text-ink">Total</dt>
              <dd className="font-medium tabular-nums text-ink">{formatPrice(order.total)}</dd>
            </div>
          </dl>
        </div>

        <div>
          <h2 className="mb-3 text-xs font-medium uppercase tracking-[0.14em] text-ink-faint">Shipping Address</h2>
          <p className="text-sm leading-relaxed text-ink-soft">
            {order.shippingName}
            <br />
            {order.shippingLine1}
            {order.shippingLine2 ? `, ${order.shippingLine2}` : ""}
            <br />
            {order.shippingCity}, {order.shippingState} {order.shippingPostalCode}
            <br />
            {order.shippingCountry}
            <br />
            {order.shippingPhone}
          </p>
        </div>

        <div>
          <h2 className="mb-3 text-xs font-medium uppercase tracking-[0.14em] text-ink-faint">Payment</h2>
          <p className="text-sm text-ink-soft">Cash / card on delivery</p>
        </div>

        <div>
          <h2 className="mb-3 text-xs font-medium uppercase tracking-[0.14em] text-ink-faint">Status</h2>
          <div className="flex items-center gap-2">
            <OrderStatusBadge status={order.status} />
            <span className="text-xs text-ink-faint">Updated {order.updatedAt.toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

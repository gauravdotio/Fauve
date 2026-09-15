"use client";

import { useState, useTransition } from "react";
import { Loader2, Check } from "lucide-react";
import { updateOrderStatusAction } from "@/lib/actions/admin/order-admin-actions";

const STATUSES = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];
const PAYMENT_STATUSES = ["PENDING", "PAID", "REFUNDED"];

export function OrderStatusForm({ orderId, status, paymentStatus }: { orderId: string; status: string; paymentStatus: string }) {
  const [localStatus, setLocalStatus] = useState(status);
  const [localPayment, setLocalPayment] = useState(paymentStatus);
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const save = () => {
    setError(null);
    setSaved(false);
    startTransition(async () => {
      const result = await updateOrderStatusAction(orderId, { status: localStatus, paymentStatus: localPayment });
      if (result?.error) {
        setError(result.error);
        return;
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    });
  };

  return (
    <div className="flex flex-col gap-4 border border-border p-5">
      <h2 className="text-xs font-medium uppercase tracking-wide text-ink-faint">Update Order</h2>
      <div className="flex flex-col gap-1.5">
        <label className="text-xs text-ink-soft">Fulfillment status</label>
        <select value={localStatus} onChange={(e) => setLocalStatus(e.target.value)} className="h-10 border border-border-strong bg-surface px-3 text-sm text-ink focus:border-ink focus:outline-none">
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-xs text-ink-soft">Payment status</label>
        <select value={localPayment} onChange={(e) => setLocalPayment(e.target.value)} className="h-10 border border-border-strong bg-surface px-3 text-sm text-ink focus:border-ink focus:outline-none">
          {PAYMENT_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>
      {localStatus === "CANCELLED" && status !== "CANCELLED" && (
        <p className="text-xs text-warning">Cancelling restocks all items in this order.</p>
      )}
      {error && <p className="text-sm text-error">{error}</p>}
      <button
        type="button"
        onClick={save}
        disabled={isPending}
        className="flex h-10 items-center justify-center gap-2 bg-ink text-sm font-medium text-paper transition-colors hover:bg-accent-dark disabled:opacity-60"
      >
        {isPending ? <Loader2 size={14} className="animate-spin" /> : saved ? <Check size={14} /> : null}
        {saved ? "Saved" : "Save Changes"}
      </button>
    </div>
  );
}

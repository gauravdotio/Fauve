"use client";

import { useState, useTransition } from "react";
import { Loader2, Plus, X } from "lucide-react";
import { createCouponAction, toggleCouponAction, deleteCouponAction } from "@/lib/actions/admin/coupon-actions";
import type { CouponInput } from "@/lib/validations";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";

interface CouponRecord {
  id: string;
  code: string;
  type: "PERCENT" | "FIXED";
  value: number;
  minSubtotal: number;
  usageLimit: number | null;
  usedCount: number;
  active: boolean;
  expiresAt: Date | null;
}

const INPUT = "h-10 w-full border border-border-strong bg-surface px-3 text-sm text-ink placeholder:text-ink-faint focus:border-ink focus:outline-none";
const LABEL = "text-xs font-medium uppercase tracking-wide text-ink-soft";

const EMPTY: CouponInput = { code: "", type: "PERCENT", value: 10, minSubtotal: 0, usageLimit: undefined, expiresAt: "", active: true };

export function CouponManager({ coupons }: { coupons: CouponRecord[] }) {
  const [showForm, setShowForm] = useState(false);
  const [values, setValues] = useState<CouponInput>(EMPTY);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await createCouponAction(values);
      if (result?.error) {
        setError(result.error);
        return;
      }
      setShowForm(false);
      setValues(EMPTY);
      window.location.reload();
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-3xl text-ink">Coupons</h1>
        {!showForm && (
          <Button size="sm" onClick={() => setShowForm(true)}>
            <Plus size={14} /> Add Coupon
          </Button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 border border-border p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium text-ink">New Coupon</h2>
            <button type="button" onClick={() => setShowForm(false)} className="text-ink-faint hover:text-ink">
              <X size={16} />
            </button>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="flex flex-col gap-1.5">
              <label className={LABEL}>Code</label>
              <input required value={values.code} onChange={(e) => setValues((v) => ({ ...v, code: e.target.value.toUpperCase() }))} className={INPUT} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className={LABEL}>Type</label>
              <select value={values.type} onChange={(e) => setValues((v) => ({ ...v, type: e.target.value as CouponInput["type"] }))} className={INPUT}>
                <option value="PERCENT">Percent off</option>
                <option value="FIXED">Fixed amount off</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className={LABEL}>{values.type === "PERCENT" ? "Percent (%)" : "Amount ($)"}</label>
              <input
                required
                type="number"
                min={1}
                value={values.type === "PERCENT" ? values.value : values.value / 100}
                onChange={(e) => setValues((v) => ({ ...v, value: v.type === "PERCENT" ? Number(e.target.value) : Math.round(Number(e.target.value) * 100) }))}
                className={INPUT}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className={LABEL}>Minimum subtotal ($)</label>
              <input
                type="number"
                min={0}
                value={values.minSubtotal / 100}
                onChange={(e) => setValues((v) => ({ ...v, minSubtotal: Math.round(Number(e.target.value) * 100) }))}
                className={INPUT}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className={LABEL}>Usage limit (optional)</label>
              <input
                type="number"
                min={1}
                value={values.usageLimit ?? ""}
                onChange={(e) => setValues((v) => ({ ...v, usageLimit: e.target.value ? Number(e.target.value) : undefined }))}
                className={INPUT}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className={LABEL}>Expires (optional)</label>
              <input type="date" value={values.expiresAt} onChange={(e) => setValues((v) => ({ ...v, expiresAt: e.target.value }))} className={INPUT} />
            </div>
          </div>
          {error && <p className="bg-error-soft px-3.5 py-2.5 text-sm text-error">{error}</p>}
          <div>
            <Button type="submit" size="sm" disabled={isPending}>
              {isPending && <Loader2 size={14} className="animate-spin" />}
              Create Coupon
            </Button>
          </div>
        </form>
      )}

      <div className="overflow-x-auto border border-border">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b border-border bg-surface-alt text-left text-xs uppercase tracking-wide text-ink-faint">
              <th className="px-4 py-3 font-medium">Code</th>
              <th className="px-4 py-3 font-medium">Discount</th>
              <th className="px-4 py-3 font-medium">Min. Subtotal</th>
              <th className="px-4 py-3 font-medium">Used</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {coupons.map((coupon) => (
              <tr key={coupon.id} className="bg-surface">
                <td className="px-4 py-3 font-medium tabular-nums text-ink">{coupon.code}</td>
                <td className="px-4 py-3 text-ink-soft">{coupon.type === "PERCENT" ? `${coupon.value}%` : formatPrice(coupon.value)}</td>
                <td className="px-4 py-3 tabular-nums text-ink-soft">{coupon.minSubtotal > 0 ? formatPrice(coupon.minSubtotal) : "—"}</td>
                <td className="px-4 py-3 tabular-nums text-ink-soft">
                  {coupon.usedCount}
                  {coupon.usageLimit ? ` / ${coupon.usageLimit}` : ""}
                </td>
                <td className="px-4 py-3">
                  <Badge variant={coupon.active ? "success" : "neutral"}>{coupon.active ? "Active" : "Inactive"}</Badge>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-3 text-xs">
                    <button
                      type="button"
                      onClick={() => startTransition(() => toggleCouponAction(coupon.id, !coupon.active).then(() => window.location.reload()))}
                      className="text-ink-soft underline decoration-border-strong underline-offset-4 hover:text-ink hover:decoration-ink"
                    >
                      {coupon.active ? "Deactivate" : "Activate"}
                    </button>
                    <button
                      type="button"
                      onClick={() => startTransition(() => deleteCouponAction(coupon.id).then(() => window.location.reload()))}
                      className="text-ink-soft underline decoration-border-strong underline-offset-4 hover:text-error hover:decoration-error"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {coupons.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-sm text-ink-soft">
                  No coupons yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

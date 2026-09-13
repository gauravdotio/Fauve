"use client";

import { useState, useTransition } from "react";
import { Loader2, MapPin, Plus, Trash2 } from "lucide-react";
import { saveAddressAction, deleteAddressAction } from "@/lib/actions/order-actions";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";

interface AddressRecord {
  id: string;
  fullName: string;
  line1: string;
  line2: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  isDefault: boolean;
}

const INPUT = "h-11 w-full border border-border-strong bg-surface px-3.5 text-sm text-ink placeholder:text-ink-faint transition-colors focus:border-ink focus:outline-none";
const LABEL = "text-xs font-medium uppercase tracking-wide text-ink-soft";

const EMPTY_FORM = { fullName: "", line1: "", line2: "", city: "", state: "", postalCode: "", country: "United States", phone: "" };

export function AddressBook({ initialAddresses }: { initialAddresses: AddressRecord[] }) {
  const [addresses, setAddresses] = useState(initialAddresses);
  const [showForm, setShowForm] = useState(initialAddresses.length === 0);
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await saveAddressAction(form);
      if (result?.error) {
        setError(result.error);
        return;
      }
      setForm(EMPTY_FORM);
      setShowForm(false);
      window.location.reload();
    });
  };

  const handleDelete = (id: string) => {
    setDeletingId(id);
    startTransition(async () => {
      await deleteAddressAction(id);
      setAddresses((prev) => prev.filter((a) => a.id !== id));
      setDeletingId(null);
    });
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-3xl text-ink">Addresses</h1>
        {!showForm && (
          <Button variant="secondary" size="sm" onClick={() => setShowForm(true)}>
            <Plus size={14} /> Add Address
          </Button>
        )}
      </div>

      {addresses.length === 0 && !showForm && (
        <EmptyState icon={MapPin} title="No saved addresses" description="Add an address to speed up checkout next time." />
      )}

      {addresses.length > 0 && (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {addresses.map((address) => (
            <li key={address.id} className="flex flex-col gap-2 border border-border p-5">
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm font-medium text-ink">{address.fullName}</p>
                {address.isDefault && <span className="shrink-0 text-[11px] uppercase tracking-wide text-accent">Default</span>}
              </div>
              <p className="text-sm leading-relaxed text-ink-soft">
                {address.line1}
                {address.line2 ? `, ${address.line2}` : ""}
                <br />
                {address.city}, {address.state} {address.postalCode}
                <br />
                {address.country}
              </p>
              <p className="text-sm text-ink-soft">{address.phone}</p>
              <button
                type="button"
                onClick={() => handleDelete(address.id)}
                disabled={isPending && deletingId === address.id}
                className="mt-2 inline-flex w-fit items-center gap-1.5 text-xs text-ink-soft underline decoration-border-strong underline-offset-4 hover:text-error hover:decoration-error"
              >
                {isPending && deletingId === address.id ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 border border-border p-5">
          <h2 className="text-sm font-medium text-ink">New Address</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <label className={LABEL}>Full name</label>
              <input required value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} className={INPUT} />
            </div>
            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <label className={LABEL}>Address</label>
              <input required value={form.line1} onChange={(e) => setForm({ ...form, line1: e.target.value })} className={INPUT} />
            </div>
            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <label className={LABEL}>Apartment, suite, etc. (optional)</label>
              <input value={form.line2} onChange={(e) => setForm({ ...form, line2: e.target.value })} className={INPUT} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className={LABEL}>City</label>
              <input required value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className={INPUT} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className={LABEL}>State</label>
              <input required value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} className={INPUT} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className={LABEL}>Postal code</label>
              <input required value={form.postalCode} onChange={(e) => setForm({ ...form, postalCode: e.target.value })} className={INPUT} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className={LABEL}>Country</label>
              <input required value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} className={INPUT} />
            </div>
            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <label className={LABEL}>Phone</label>
              <input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={INPUT} />
            </div>
          </div>

          {error && <p className="bg-error-soft px-3.5 py-2.5 text-sm text-error">{error}</p>}

          <div className="flex gap-3">
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 size={14} className="animate-spin" />}
              Save Address
            </Button>
            {addresses.length > 0 && (
              <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      )}
    </div>
  );
}

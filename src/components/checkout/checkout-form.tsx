"use client";

import { useMemo, useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Session } from "next-auth";
import { Loader2, Lock, Tag, X } from "lucide-react";
import { useCartStore, useCartSubtotal, useHydrated } from "@/store/cart-store";
import { checkoutAction } from "@/lib/actions/order-actions";
import { FREE_SHIPPING_THRESHOLD, SHIPPING_FLAT_RATE, TAX_RATE } from "@/lib/commerce-config";
import { formatPrice, cn } from "@/lib/utils";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { ShoppingBag } from "lucide-react";

const INPUT = "h-11 w-full border border-border-strong bg-surface px-3.5 text-sm text-ink placeholder:text-ink-faint transition-colors focus:border-ink focus:outline-none";
const LABEL = "text-xs font-medium uppercase tracking-wide text-ink-soft";

interface SavedAddress {
  id: string;
  fullName: string;
  line1: string;
  line2: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
}

export function CheckoutForm({ session, savedAddresses }: { session: Session | null; savedAddresses: SavedAddress[] }) {
  const hydrated = useHydrated();
  const lines = useCartStore((s) => s.lines);
  const clearCart = useCartStore((s) => s.clear);
  const subtotal = useCartSubtotal();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [selectedAddressId, setSelectedAddressId] = useState<string>(savedAddresses[0]?.id ?? "new");
  const [address, setAddress] = useState({
    fullName: savedAddresses[0]?.fullName ?? session?.user?.name ?? "",
    line1: savedAddresses[0]?.line1 ?? "",
    line2: savedAddresses[0]?.line2 ?? "",
    city: savedAddresses[0]?.city ?? "",
    state: savedAddresses[0]?.state ?? "",
    postalCode: savedAddresses[0]?.postalCode ?? "",
    country: savedAddresses[0]?.country ?? "United States",
    phone: savedAddresses[0]?.phone ?? "",
  });
  const [email, setEmail] = useState(session?.user?.email ?? "");
  const [note, setNote] = useState("");
  const [saveAddress, setSaveAddress] = useState(Boolean(session && savedAddresses.length === 0));

  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponPending, startCouponTransition] = useTransition();

  const discountedSubtotal = Math.max(0, subtotal - (appliedCoupon?.discount ?? 0));
  const shipping = lines.length === 0 || discountedSubtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FLAT_RATE;
  const tax = Math.round(discountedSubtotal * TAX_RATE);
  const total = discountedSubtotal + shipping + tax;

  const applyCoupon = () => {
    setCouponError(null);
    const code = couponInput.trim();
    if (!code) return;

    startCouponTransition(async () => {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, subtotal }),
      });
      const data = await res.json();
      if (!res.ok) {
        setCouponError(data.error ?? "That coupon isn't valid.");
        return;
      }
      setAppliedCoupon({ code: data.code, discount: data.discount });
      setCouponInput("");
    });
  };

  const selectSavedAddress = (id: string) => {
    setSelectedAddressId(id);
    if (id === "new") return;
    const found = savedAddresses.find((a) => a.id === id);
    if (found) {
      setAddress({
        fullName: found.fullName,
        line1: found.line1,
        line2: found.line2 ?? "",
        city: found.city,
        state: found.state,
        postalCode: found.postalCode,
        country: found.country,
        phone: found.phone,
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      const result = await checkoutAction({
        email,
        address,
        note,
        couponCode: appliedCoupon?.code,
        saveAddress: selectedAddressId === "new" && saveAddress,
        items: lines.map((l) => ({ productId: l.productId, variantId: l.variantId, quantity: l.quantity })),
      });

      if ("error" in result) {
        setError(result.error);
        return;
      }

      clearCart();
      router.push(`/order-confirmation/${result.orderNumber}`);
    });
  };

  const itemCount = useMemo(() => lines.reduce((sum, l) => sum + l.quantity, 0), [lines]);

  if (!hydrated) {
    return (
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
        <Skeleton className="h-96 lg:col-span-7" />
        <Skeleton className="h-72 lg:col-span-5" />
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <EmptyState
        icon={ShoppingBag}
        title="Your bag is empty"
        description="Add something to your bag before checking out."
        actionLabel="Start shopping"
        actionHref="/shop"
      />
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
      <div className="flex flex-col gap-10 lg:col-span-7">
        <section>
          <h2 className="mb-4 font-serif text-xl text-ink">Contact</h2>
          {session ? (
            <p className="text-sm text-ink-soft">
              Ordering as <span className="font-medium text-ink">{session.user.email}</span>
            </p>
          ) : (
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className={LABEL}>
                Email address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className={INPUT}
              />
              <p className="mt-1 text-xs text-ink-faint">
                <Link href={`/login?callbackUrl=/checkout`} className="underline decoration-border-strong underline-offset-4 hover:decoration-ink">
                  Sign in
                </Link>{" "}
                for faster checkout, or continue as a guest.
              </p>
            </div>
          )}
        </section>

        <section>
          <h2 className="mb-4 font-serif text-xl text-ink">Shipping Address</h2>

          {savedAddresses.length > 0 && (
            <div className="mb-5 flex flex-col gap-2">
              {savedAddresses.map((saved) => (
                <label
                  key={saved.id}
                  className={cn(
                    "flex cursor-pointer items-start gap-3 border p-3.5 text-sm transition-colors",
                    selectedAddressId === saved.id ? "border-ink" : "border-border-strong hover:border-ink",
                  )}
                >
                  <input
                    type="radio"
                    name="savedAddress"
                    className="mt-1"
                    checked={selectedAddressId === saved.id}
                    onChange={() => selectSavedAddress(saved.id)}
                  />
                  <span>
                    <span className="block font-medium text-ink">{saved.fullName}</span>
                    <span className="block text-ink-soft">
                      {saved.line1}
                      {saved.line2 ? `, ${saved.line2}` : ""}, {saved.city}, {saved.state} {saved.postalCode}
                    </span>
                  </span>
                </label>
              ))}
              <label
                className={cn(
                  "flex cursor-pointer items-center gap-3 border p-3.5 text-sm transition-colors",
                  selectedAddressId === "new" ? "border-ink" : "border-border-strong hover:border-ink",
                )}
              >
                <input type="radio" name="savedAddress" checked={selectedAddressId === "new"} onChange={() => selectSavedAddress("new")} />
                <span className="font-medium text-ink">Use a new address</span>
              </label>
            </div>
          )}

          {selectedAddressId === "new" && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label htmlFor="fullName" className={LABEL}>
                  Full name
                </label>
                <input
                  id="fullName"
                  required
                  value={address.fullName}
                  onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                  className={INPUT}
                />
              </div>
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label htmlFor="line1" className={LABEL}>
                  Address
                </label>
                <input
                  id="line1"
                  required
                  value={address.line1}
                  onChange={(e) => setAddress({ ...address, line1: e.target.value })}
                  className={INPUT}
                />
              </div>
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label htmlFor="line2" className={LABEL}>
                  Apartment, suite, etc. (optional)
                </label>
                <input
                  id="line2"
                  value={address.line2}
                  onChange={(e) => setAddress({ ...address, line2: e.target.value })}
                  className={INPUT}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="city" className={LABEL}>
                  City
                </label>
                <input id="city" required value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} className={INPUT} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="state" className={LABEL}>
                  State
                </label>
                <input id="state" required value={address.state} onChange={(e) => setAddress({ ...address, state: e.target.value })} className={INPUT} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="postalCode" className={LABEL}>
                  Postal code
                </label>
                <input
                  id="postalCode"
                  required
                  value={address.postalCode}
                  onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
                  className={INPUT}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="country" className={LABEL}>
                  Country
                </label>
                <input
                  id="country"
                  required
                  value={address.country}
                  onChange={(e) => setAddress({ ...address, country: e.target.value })}
                  className={INPUT}
                />
              </div>
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label htmlFor="phone" className={LABEL}>
                  Phone
                </label>
                <input id="phone" required value={address.phone} onChange={(e) => setAddress({ ...address, phone: e.target.value })} className={INPUT} />
              </div>
              {session && (
                <label className="flex items-center gap-2 text-sm text-ink-soft sm:col-span-2">
                  <input type="checkbox" checked={saveAddress} onChange={(e) => setSaveAddress(e.target.checked)} />
                  Save this address for next time
                </label>
              )}
            </div>
          )}
        </section>

        <section>
          <h2 className="mb-4 font-serif text-xl text-ink">Payment</h2>
          <div className="flex items-start gap-3 border border-border-strong bg-surface-alt p-4 text-sm text-ink-soft">
            <Lock size={16} className="mt-0.5 shrink-0 text-ink" />
            <p>
              <span className="font-medium text-ink">Cash or card on delivery.</span> Pay when your order arrives — no
              payment details needed now.
            </p>
          </div>
        </section>

        <section>
          <label htmlFor="note" className={LABEL}>
            Order note (optional)
          </label>
          <textarea
            id="note"
            rows={3}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Delivery instructions, gift note, etc."
            className="mt-1.5 w-full resize-none border border-border-strong bg-surface px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-faint focus:border-ink focus:outline-none"
          />
        </section>
      </div>

      <aside className="lg:col-span-5">
        <div className="border border-border bg-surface p-6 lg:sticky lg:top-28">
          <h2 className="font-serif text-xl text-ink">Order Summary</h2>

          <ul className="mt-5 flex max-h-64 flex-col gap-4 overflow-y-auto border-b border-border pb-5">
            {lines.map((line) => (
              <li key={`${line.productId}-${line.variantId}`} className="flex gap-3">
                <div className="relative h-16 w-14 shrink-0 overflow-hidden bg-surface-alt">
                  {line.image && <Image src={line.image} alt={line.name} fill sizes="56px" className="object-cover" />}
                  <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-ink text-[10px] text-paper">
                    {line.quantity}
                  </span>
                </div>
                <div className="flex flex-1 flex-col text-sm">
                  <span className="font-medium text-ink">{line.name}</span>
                  {(line.color || line.size) && <span className="text-xs text-ink-faint">{[line.color, line.size].filter(Boolean).join(" / ")}</span>}
                </div>
                <span className="shrink-0 tabular-nums text-ink">{formatPrice(line.price * line.quantity)}</span>
              </li>
            ))}
          </ul>

          <div className="mt-5 flex gap-2">
            <div className="relative flex-1">
              <Tag size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" />
              <input
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
                placeholder="Coupon code"
                disabled={Boolean(appliedCoupon)}
                className="h-10 w-full border border-border-strong bg-surface pl-8 pr-3 text-sm uppercase text-ink placeholder:text-ink-faint placeholder:normal-case focus:border-ink focus:outline-none disabled:bg-surface-alt"
              />
            </div>
            {appliedCoupon ? (
              <button
                type="button"
                onClick={() => setAppliedCoupon(null)}
                className="flex h-10 items-center gap-1.5 border border-border-strong px-3 text-xs text-ink-soft hover:border-error hover:text-error"
              >
                <X size={13} /> Remove
              </button>
            ) : (
              <button
                type="button"
                onClick={applyCoupon}
                disabled={couponPending || !couponInput.trim()}
                className="h-10 border border-ink px-4 text-xs font-medium uppercase tracking-wide text-ink transition-colors hover:bg-ink hover:text-paper disabled:opacity-40"
              >
                {couponPending ? <Loader2 size={14} className="animate-spin" /> : "Apply"}
              </button>
            )}
          </div>
          {couponError && <p className="mt-2 text-xs text-error">{couponError}</p>}
          {appliedCoupon && <p className="mt-2 text-xs text-success">Coupon {appliedCoupon.code} applied.</p>}

          <dl className="mt-5 flex flex-col gap-2.5 border-t border-border pt-5 text-sm">
            <div className="flex justify-between">
              <dt className="text-ink-soft">Subtotal ({itemCount} {itemCount === 1 ? "item" : "items"})</dt>
              <dd className="tabular-nums text-ink">{formatPrice(subtotal)}</dd>
            </div>
            {appliedCoupon && (
              <div className="flex justify-between text-success">
                <dt>Discount</dt>
                <dd className="tabular-nums">−{formatPrice(appliedCoupon.discount)}</dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt className="text-ink-soft">Shipping</dt>
              <dd className="text-ink">{shipping === 0 ? "Free" : formatPrice(shipping)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink-soft">Tax</dt>
              <dd className="tabular-nums text-ink">{formatPrice(tax)}</dd>
            </div>
            <div className="flex justify-between border-t border-border pt-3 text-base">
              <dt className="font-medium text-ink">Total</dt>
              <dd className="font-medium tabular-nums text-ink">{formatPrice(total)}</dd>
            </div>
          </dl>

          {error && (
            <p role="alert" className="mt-4 bg-error-soft px-3.5 py-2.5 text-sm text-error">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="mt-6 flex h-12 w-full items-center justify-center gap-2 bg-ink text-sm font-medium text-paper transition-colors hover:bg-accent-dark disabled:opacity-60"
          >
            {isPending ? <Loader2 size={16} className="animate-spin" /> : <Lock size={15} />}
            Place Order
          </button>
          <p className="mt-3 text-center text-xs text-ink-faint">By placing your order you agree to our Terms of Service.</p>
        </div>
      </aside>
    </form>
  );
}

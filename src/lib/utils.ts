import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

/** Formats an integer amount in cents as a display currency string, e.g. 12900 -> "$129.00" */
export function formatPrice(cents: number) {
  return currencyFormatter.format(cents / 100);
}

export function calculateDiscountPercent(price: number, compareAtPrice: number) {
  return Math.round(((compareAtPrice - price) / compareAtPrice) * 100);
}

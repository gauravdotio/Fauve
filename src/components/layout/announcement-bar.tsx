"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useHydrated } from "@/store/cart-store";

const MESSAGES = [
  "Free shipping on orders over $100",
  "Free 30-day returns and exchanges",
  "New arrivals restocked every week",
];

const DISMISS_KEY = "fauve-announcement-dismissed";

function readDismissed() {
  try {
    return sessionStorage.getItem(DISMISS_KEY) === "1";
  } catch {
    return false;
  }
}

export function AnnouncementBar() {
  const hydrated = useHydrated();
  const [dismissedNow, setDismissedNow] = useState(false);
  const [index, setIndex] = useState(0);

  const dismissed = dismissedNow || (hydrated && readDismissed());

  useEffect(() => {
    if (dismissed) return;
    const interval = setInterval(() => setIndex((i) => (i + 1) % MESSAGES.length), 4500);
    return () => clearInterval(interval);
  }, [dismissed]);

  if (dismissed) return null;

  return (
    <div className="relative flex h-10 items-center justify-center bg-ink px-12 text-paper">
      <p key={index} className="animate-fade-in truncate text-center text-xs font-medium tracking-wide" aria-live="polite">
        {MESSAGES[index]}
      </p>
      <button
        type="button"
        aria-label="Dismiss announcement"
        onClick={() => {
          try {
            sessionStorage.setItem(DISMISS_KEY, "1");
          } catch {}
          setDismissedNow(true);
        }}
        className="absolute right-3 flex h-7 w-7 items-center justify-center rounded-full text-paper/70 transition-colors hover:bg-white/10 hover:text-paper sm:right-6"
      >
        <X size={14} />
      </button>
    </div>
  );
}

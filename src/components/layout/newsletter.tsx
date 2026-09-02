"use client";

import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function Newsletter({ variant = "section" }: { variant?: "section" | "footer" }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitted">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("submitted");
  };

  if (status === "submitted") {
    return (
      <div className={cn("flex items-center gap-2 text-sm", variant === "footer" ? "text-ink" : "text-ink")}>
        <Check size={16} className="text-success" />
        You&apos;re on the list — thanks for signing up.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-sm items-center gap-0 border-b border-ink pb-2">
      <label htmlFor={`newsletter-email-${variant}`} className="sr-only">
        Email address
      </label>
      <input
        id={`newsletter-email-${variant}`}
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        className="w-full bg-transparent text-sm text-ink placeholder:text-ink-faint focus:outline-none"
      />
      <button
        type="submit"
        aria-label="Subscribe"
        className="flex h-7 w-7 shrink-0 items-center justify-center text-ink transition-transform hover:translate-x-0.5"
      >
        <ArrowRight size={18} />
      </button>
    </form>
  );
}

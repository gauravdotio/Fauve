"use client";

import { useState, useTransition } from "react";
import { Loader2 } from "lucide-react";
import { deleteProductAction } from "@/lib/actions/admin/product-actions";

export function DeleteProductButton({ productId, productName }: { productId: string; productName: string }) {
  const [confirming, setConfirming] = useState(false);
  const [isPending, startTransition] = useTransition();

  if (confirming) {
    return (
      <span className="flex items-center gap-2 text-xs">
        <span className="text-ink-soft">Delete?</span>
        <button
          type="button"
          disabled={isPending}
          onClick={() => startTransition(() => deleteProductAction(productId))}
          className="font-medium text-error underline underline-offset-4"
        >
          {isPending ? <Loader2 size={12} className="animate-spin" /> : "Yes"}
        </button>
        <button type="button" onClick={() => setConfirming(false)} className="text-ink-soft underline underline-offset-4">
          No
        </button>
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setConfirming(true)}
      aria-label={`Delete ${productName}`}
      className="text-xs text-ink-soft underline decoration-border-strong underline-offset-4 hover:text-error hover:decoration-error"
    >
      Delete
    </button>
  );
}

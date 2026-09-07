"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { Star, Loader2, Check } from "lucide-react";
import { submitReviewAction, type ReviewActionState } from "@/lib/actions/review-actions";
import { cn } from "@/lib/utils";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="flex h-11 items-center justify-center gap-2 bg-ink px-6 text-sm font-medium text-paper transition-colors hover:bg-accent-dark disabled:opacity-60"
    >
      {pending && <Loader2 size={14} className="animate-spin" />}
      Submit Review
    </button>
  );
}

export function ReviewForm({ productSlug, isLoggedIn }: { productSlug: string; isLoggedIn: boolean }) {
  const action = submitReviewAction.bind(null, productSlug);
  const [state, formAction] = useActionState<ReviewActionState, FormData>(action, undefined);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  if (!isLoggedIn) {
    return (
      <p className="border border-dashed border-border-strong px-5 py-6 text-center text-sm text-ink-soft">
        <a href="/login" className="font-medium text-ink underline decoration-border-strong underline-offset-4 hover:decoration-ink">
          Sign in
        </a>{" "}
        to leave a review.
      </p>
    );
  }

  if (state?.success) {
    return (
      <p className="flex items-center gap-2 border border-success-soft bg-success-soft px-5 py-4 text-sm text-success">
        <Check size={16} /> Thanks — your review has been posted.
      </p>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-4 border border-border p-5">
      <div>
        <p className="mb-2 text-sm font-medium text-ink">Your rating</p>
        <div className="flex gap-1" onMouseLeave={() => setHoverRating(0)}>
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              aria-label={`${value} star${value > 1 ? "s" : ""}`}
              onMouseEnter={() => setHoverRating(value)}
              onClick={() => setRating(value)}
              className="p-0.5"
            >
              <Star
                size={22}
                className={cn(
                  (hoverRating || rating) >= value ? "fill-accent text-accent" : "fill-transparent text-border-strong",
                )}
              />
            </button>
          ))}
        </div>
        <input type="hidden" name="rating" value={rating} />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="title" className="text-xs font-medium uppercase tracking-wide text-ink-soft">
          Title
        </label>
        <input
          id="title"
          name="title"
          required
          maxLength={80}
          placeholder="Sum it up in a few words"
          className="h-11 border border-border-strong bg-surface px-3.5 text-sm text-ink placeholder:text-ink-faint focus:border-ink focus:outline-none"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="body" className="text-xs font-medium uppercase tracking-wide text-ink-soft">
          Review
        </label>
        <textarea
          id="body"
          name="body"
          required
          rows={4}
          maxLength={1000}
          placeholder="What did you like or dislike?"
          className="resize-none border border-border-strong bg-surface px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-faint focus:border-ink focus:outline-none"
        />
      </div>

      {state?.error && (
        <p role="alert" className="bg-error-soft px-3.5 py-2.5 text-sm text-error">
          {state.error}
        </p>
      )}

      <SubmitButton />
    </form>
  );
}

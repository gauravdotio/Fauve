"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { FormState } from "@/lib/actions/auth-actions";

interface AuthFormProps {
  mode: "login" | "signup";
  action: (state: FormState, formData: FormData) => Promise<FormState>;
  callbackUrl?: string;
}

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" className="w-full" disabled={pending}>
      {pending && <Loader2 size={16} className="animate-spin" />}
      {label}
    </Button>
  );
}

const INPUT_CLASSES =
  "h-12 w-full border border-border-strong bg-surface px-3.5 text-sm text-ink placeholder:text-ink-faint transition-colors focus:border-ink focus:outline-none";

export function AuthForm({ mode, action, callbackUrl }: AuthFormProps) {
  const [state, formAction] = useActionState(action, undefined);
  const isSignup = mode === "signup";

  return (
    <form action={formAction} className="flex flex-col gap-5">
      {callbackUrl && <input type="hidden" name="callbackUrl" value={callbackUrl} />}

      {isSignup && (
        <div className="flex flex-col gap-1.5">
          <label htmlFor="name" className="text-sm text-ink-soft">
            Full name
          </label>
          <input id="name" name="name" type="text" required autoComplete="name" className={INPUT_CLASSES} />
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-sm text-ink-soft">
          Email
        </label>
        <input id="email" name="email" type="email" required autoComplete="email" className={INPUT_CLASSES} />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className="text-sm text-ink-soft">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={isSignup ? 8 : undefined}
          autoComplete={isSignup ? "new-password" : "current-password"}
          className={INPUT_CLASSES}
        />
        {isSignup && <p className="text-xs text-ink-faint">At least 8 characters.</p>}
      </div>

      {state?.error && (
        <p role="alert" className="bg-error-soft px-3.5 py-2.5 text-sm text-error">
          {state.error}
        </p>
      )}

      <SubmitButton label={isSignup ? "Create Account" : "Sign In"} />

      <p className="text-center text-sm text-ink-soft">
        {isSignup ? (
          <>
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-ink underline decoration-border-strong underline-offset-4 hover:decoration-ink">
              Sign in
            </Link>
          </>
        ) : (
          <>
            New to Fauve?{" "}
            <Link href="/signup" className="font-medium text-ink underline decoration-border-strong underline-offset-4 hover:decoration-ink">
              Create an account
            </Link>
          </>
        )}
      </p>
    </form>
  );
}

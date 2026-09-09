import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AuthForm } from "@/components/auth/auth-form";
import { signupAction } from "@/lib/actions/auth-actions";

export const metadata: Metadata = { title: "Create Account", robots: { index: false } };

export default async function SignupPage({ searchParams }: PageProps<"/signup">) {
  const session = await auth();
  if (session) redirect("/account");

  const { callbackUrl } = await searchParams;

  return (
    <div className="container-page flex justify-center py-20 sm:py-28">
      <div className="w-full max-w-sm">
        <h1 className="mb-2 text-center font-serif text-3xl text-ink">Create Account</h1>
        <p className="mb-8 text-center text-sm text-ink-soft">Track orders and check out faster next time.</p>
        <AuthForm mode="signup" action={signupAction} callbackUrl={typeof callbackUrl === "string" ? callbackUrl : undefined} />
      </div>
    </div>
  );
}

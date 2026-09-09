import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AuthForm } from "@/components/auth/auth-form";
import { loginAction } from "@/lib/actions/auth-actions";

export const metadata: Metadata = { title: "Sign In", robots: { index: false } };

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const session = await auth();
  if (session) redirect("/account");

  const { callbackUrl } = await searchParams;

  return (
    <div className="container-page flex justify-center py-20 sm:py-28">
      <div className="w-full max-w-sm">
        <h1 className="mb-2 text-center font-serif text-3xl text-ink">Welcome Back</h1>
        <p className="mb-8 text-center text-sm text-ink-soft">Sign in to view your orders and saved details.</p>
        <AuthForm mode="login" action={loginAction} callbackUrl={typeof callbackUrl === "string" ? callbackUrl : undefined} />
      </div>
    </div>
  );
}

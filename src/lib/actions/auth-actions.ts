"use server";

import { AuthError } from "next-auth";
import { signIn, signOut } from "@/auth";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/passwords";
import { signupSchema } from "@/lib/validations";
import { mockStore } from "@/lib/mock-store";

export type FormState = { error?: string } | undefined;

export async function loginAction(_prevState: FormState, formData: FormData): Promise<FormState> {
  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: (formData.get("callbackUrl") as string) || "/account",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: error.type === "CredentialsSignin" ? "Incorrect email or password." : "Something went wrong. Please try again." };
    }
    throw error;
  }
}

export async function signupAction(_prevState: FormState, formData: FormData): Promise<FormState> {
  const parsed = signupSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please check your details and try again." };
  }

  const passwordHash = await hashPassword(parsed.data.password);
  
  mockStore.addUser({
    id: `usr_${Date.now()}`,
    name: parsed.data.name,
    email: parsed.data.email,
    passwordHash,
    role: "CUSTOMER",
    createdAt: new Date(),
  });

  try {
    const existing = await prisma.user.findUnique({ where: { email: parsed.data.email } });
    if (existing) {
      return { error: "An account with this email already exists." };
    }
    await prisma.user.create({
      data: { name: parsed.data.name, email: parsed.data.email, passwordHash },
    });
  } catch {
    // Database offline, mockStore has user registered
  }

  try {
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirectTo: (formData.get("callbackUrl") as string) || "/account",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Account created — please sign in." };
    }
    throw error;
  }
}

export async function logoutAction() {
  await signOut({ redirectTo: "/" });
}

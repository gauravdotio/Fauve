import "server-only";
import { auth } from "@/auth";

/** Defense in depth — proxy.ts already blocks non-admins from /admin routes and actions. */
export async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Forbidden: admin access required.");
  }
  return session;
}

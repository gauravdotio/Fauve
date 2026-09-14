import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { Logo } from "@/components/layout/logo";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/admin");
  if (session.user.role !== "ADMIN") redirect("/");

  return (
    <div className="flex min-h-screen bg-paper">
      <div className="hidden w-64 shrink-0 border-r border-border bg-surface lg:block">
        <div className="flex h-16 items-center border-b border-border px-6">
          <Logo />
          <span className="ml-2 text-xs font-medium uppercase tracking-wide text-ink-faint">Admin</span>
        </div>
        <div className="p-4">
          <AdminSidebar />
        </div>
      </div>

      <div className="min-w-0 flex-1">
        <div className="border-b border-border bg-surface px-4 py-4 lg:hidden">
          <div className="flex items-center gap-2">
            <Logo />
            <span className="text-xs font-medium uppercase tracking-wide text-ink-faint">Admin</span>
          </div>
          <div className="no-scrollbar mt-4 overflow-x-auto">
            <AdminSidebar orientation="horizontal" />
          </div>
        </div>
        <main className="px-5 py-8 sm:px-8 lg:px-10">{children}</main>
      </div>
    </div>
  );
}

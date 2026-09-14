import type { Metadata } from "next";
import { Search } from "lucide-react";
import { getAdminCustomers } from "@/lib/admin-data";
import { AdminPagination } from "@/components/admin/admin-pagination";
import { formatPrice } from "@/lib/utils";

export const metadata: Metadata = { title: "Customers", robots: { index: false } };

export default async function AdminCustomersPage({ searchParams }: PageProps<"/admin/customers">) {
  const params = await searchParams;
  const search = typeof params.search === "string" ? params.search : undefined;
  const page = Number(params.page) || 1;

  const { items, total, totalPages } = await getAdminCustomers({ search, page });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-serif text-3xl text-ink">Customers</h1>
        <p className="mt-1 text-sm text-ink-soft">{total} total</p>
      </div>

      <form className="relative max-w-sm">
        <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" />
        <input
          type="search"
          name="search"
          defaultValue={search}
          placeholder="Search name or email…"
          className="h-10 w-full border border-border-strong bg-surface pl-9 pr-3 text-sm text-ink placeholder:text-ink-faint focus:border-ink focus:outline-none"
        />
      </form>

      <div className="overflow-x-auto border border-border">
        <table className="w-full min-w-[560px] text-sm">
          <thead>
            <tr className="border-b border-border bg-surface-alt text-left text-xs uppercase tracking-wide text-ink-faint">
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Orders</th>
              <th className="px-4 py-3 font-medium">Total Spent</th>
              <th className="px-4 py-3 font-medium">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {items.map((customer) => (
              <tr key={customer.id} className="bg-surface">
                <td className="px-4 py-3 font-medium text-ink">{customer.name}</td>
                <td className="px-4 py-3 text-ink-soft">{customer.email}</td>
                <td className="px-4 py-3 tabular-nums text-ink">{customer.orderCount}</td>
                <td className="px-4 py-3 tabular-nums text-ink">{formatPrice(customer.totalSpent)}</td>
                <td className="px-4 py-3 text-ink-soft">{customer.createdAt.toLocaleDateString()}</td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-sm text-ink-soft">
                  No customers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <AdminPagination basePath="/admin/customers" page={page} totalPages={totalPages} />
    </div>
  );
}

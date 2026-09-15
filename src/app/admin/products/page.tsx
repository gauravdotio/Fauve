import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Plus, Search } from "lucide-react";
import { getAdminProducts } from "@/lib/admin-data";
import { getCategories } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { AdminPagination } from "@/components/admin/admin-pagination";
import { DeleteProductButton } from "@/components/admin/delete-product-button";
import { formatPrice } from "@/lib/utils";

export const metadata: Metadata = { title: "Products", robots: { index: false } };

export default async function AdminProductsPage({ searchParams }: PageProps<"/admin/products">) {
  const params = await searchParams;
  const search = typeof params.search === "string" ? params.search : undefined;
  const page = Number(params.page) || 1;

  const [{ items, total, totalPages }, categories] = await Promise.all([
    getAdminProducts({ search, page }),
    getCategories(),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl text-ink">Products</h1>
          <p className="mt-1 text-sm text-ink-soft">{total} total</p>
        </div>
        <Link href="/admin/products/new" className={buttonVariants({ size: "sm" })}>
          <Plus size={15} /> Add Product
        </Link>
      </div>

      <form className="relative max-w-sm">
        <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" />
        <input
          type="search"
          name="search"
          defaultValue={search}
          placeholder="Search products…"
          className="h-10 w-full border border-border-strong bg-surface pl-9 pr-3 text-sm text-ink placeholder:text-ink-faint focus:border-ink focus:outline-none"
        />
      </form>

      <div className="overflow-x-auto border border-border">
        <table className="w-full min-w-[720px] text-sm">
          <thead>
            <tr className="border-b border-border bg-surface-alt text-left text-xs uppercase tracking-wide text-ink-faint">
              <th className="px-4 py-3 font-medium">Product</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium">Stock</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {items.map((product) => (
              <tr key={product.id} className="bg-surface">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-10 shrink-0 overflow-hidden bg-surface-alt">
                      {product.images[0] && <Image src={product.images[0].url} alt="" fill sizes="40px" className="object-cover" />}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-medium text-ink">{product.name}</p>
                      <p className="text-xs text-ink-faint">{product.sku}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-ink-soft">{product.category.name}</td>
                <td className="px-4 py-3 tabular-nums text-ink">{formatPrice(product.price)}</td>
                <td className="px-4 py-3 tabular-nums">
                  <span className={product.stock <= 5 ? "text-warning" : "text-ink"}>{product.stock}</span>
                </td>
                <td className="px-4 py-3">
                  <Badge variant={product.status === "ACTIVE" ? "success" : "neutral"}>{product.status}</Badge>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-3">
                    <Link href={`/admin/products/${product.id}/edit`} className="text-xs text-ink-soft underline decoration-border-strong underline-offset-4 hover:text-ink hover:decoration-ink">
                      Edit
                    </Link>
                    <DeleteProductButton productId={product.id} productName={product.name} />
                  </div>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-sm text-ink-soft">
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <AdminPagination basePath="/admin/products" page={page} totalPages={totalPages} />

      {categories.length === 0 && <p className="text-sm text-ink-faint">Create a category before adding products.</p>}
    </div>
  );
}

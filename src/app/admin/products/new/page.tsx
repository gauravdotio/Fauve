import type { Metadata } from "next";
import { ProductForm } from "@/components/admin/product-form";
import { getCategories } from "@/lib/data";

export const metadata: Metadata = { title: "New Product", robots: { index: false } };

export default async function NewProductPage() {
  const categories = await getCategories();

  return (
    <div className="max-w-3xl">
      <h1 className="mb-8 font-serif text-3xl text-ink">Add Product</h1>
      <ProductForm categories={categories} />
    </div>
  );
}

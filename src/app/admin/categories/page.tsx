import type { Metadata } from "next";
import { getCategories } from "@/lib/data";
import { CategoryManager } from "@/components/admin/category-manager";

export const metadata: Metadata = { title: "Categories", robots: { index: false } };

export default async function AdminCategoriesPage() {
  const categories = await getCategories();
  return <CategoryManager categories={categories} />;
}

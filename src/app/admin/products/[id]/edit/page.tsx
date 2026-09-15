import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductForm } from "@/components/admin/product-form";
import { getAdminProductById } from "@/lib/admin-data";
import { getCategories } from "@/lib/data";
import type { ProductInput } from "@/lib/validations";

export const metadata: Metadata = { title: "Edit Product", robots: { index: false } };

export default async function EditProductPage({ params }: PageProps<"/admin/products/[id]/edit">) {
  const { id } = await params;
  const [product, categories] = await Promise.all([getAdminProductById(id), getCategories()]);
  if (!product) notFound();

  const initialValues: ProductInput = {
    name: product.name,
    slug: product.slug,
    sku: product.sku,
    categoryId: product.categoryId,
    brand: product.brand,
    shortDescription: product.shortDescription,
    description: product.description,
    price: product.price,
    compareAtPrice: product.compareAtPrice ?? undefined,
    material: product.material ?? "",
    careInstructions: product.careInstructions ?? "",
    featured: product.featured,
    status: product.status,
    images: product.images.map((img) => ({ id: img.id, url: img.url, alt: img.alt })),
    variants: product.variants.map((v) => ({
      id: v.id,
      size: v.size ?? "",
      color: v.color ?? "",
      colorHex: v.colorHex ?? "",
      stock: v.stock,
    })),
  };

  return (
    <div className="max-w-3xl">
      <h1 className="mb-8 font-serif text-3xl text-ink">Edit Product</h1>
      <ProductForm categories={categories} productId={product.id} initialValues={initialValues} />
    </div>
  );
}

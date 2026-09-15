"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { createProductAction, updateProductAction } from "@/lib/actions/admin/product-actions";
import type { ProductInput } from "@/lib/validations";
import { Button } from "@/components/ui/button";

const INPUT = "h-11 w-full border border-border-strong bg-surface px-3.5 text-sm text-ink placeholder:text-ink-faint transition-colors focus:border-ink focus:outline-none";
const LABEL = "text-xs font-medium uppercase tracking-wide text-ink-soft";
const TEXTAREA = "w-full resize-none border border-border-strong bg-surface px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-faint focus:border-ink focus:outline-none";

interface ProductFormProps {
  categories: { id: string; name: string }[];
  productId?: string;
  initialValues?: ProductInput;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const EMPTY: ProductInput = {
  name: "",
  slug: "",
  sku: "",
  categoryId: "",
  brand: "Fauve",
  shortDescription: "",
  description: "",
  price: 0,
  compareAtPrice: undefined,
  material: "",
  careInstructions: "",
  featured: false,
  status: "ACTIVE",
  images: [{ url: "", alt: "" }],
  variants: [],
};

export function ProductForm({ categories, productId, initialValues }: ProductFormProps) {
  const router = useRouter();
  const [values, setValues] = useState<ProductInput>(initialValues ?? { ...EMPTY, categoryId: categories[0]?.id ?? "" });
  const [slugTouched, setSlugTouched] = useState(Boolean(initialValues));
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const set = <K extends keyof ProductInput>(key: K, value: ProductInput[K]) => setValues((v) => ({ ...v, [key]: value }));

  const handleNameChange = (name: string) => {
    set("name", name);
    if (!slugTouched) set("slug", slugify(name));
  };

  const updateImage = (index: number, patch: Partial<ProductInput["images"][number]>) => {
    set("images", values.images.map((img, i) => (i === index ? { ...img, ...patch } : img)));
  };
  const addImage = () => set("images", [...values.images, { url: "", alt: "" }]);
  const removeImage = (index: number) => set("images", values.images.filter((_, i) => i !== index));

  const updateVariant = (index: number, patch: Partial<ProductInput["variants"][number]>) => {
    set("variants", values.variants.map((v, i) => (i === index ? { ...v, ...patch } : v)));
  };
  const addVariant = () => set("variants", [...values.variants, { size: "", color: "", colorHex: "", stock: 0 }]);
  const removeVariant = (index: number) => set("variants", values.variants.filter((_, i) => i !== index));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const payload: ProductInput = {
      ...values,
      images: values.images.filter((img) => img.url.trim()),
      variants: values.variants.filter((v) => v.size || v.color),
    };

    startTransition(async () => {
      const result = productId ? await updateProductAction(productId, payload) : await createProductAction(payload);
      if (result?.error) {
        setError(result.error);
        return;
      }
      router.push("/admin/products");
      router.refresh();
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <label className={LABEL}>Product name</label>
          <input required value={values.name} onChange={(e) => handleNameChange(e.target.value)} className={INPUT} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className={LABEL}>Slug</label>
          <input
            required
            value={values.slug}
            onChange={(e) => {
              setSlugTouched(true);
              set("slug", slugify(e.target.value));
            }}
            className={INPUT}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className={LABEL}>SKU</label>
          <input required value={values.sku} onChange={(e) => set("sku", e.target.value)} className={INPUT} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className={LABEL}>Category</label>
          <select required value={values.categoryId} onChange={(e) => set("categoryId", e.target.value)} className={INPUT}>
            <option value="" disabled>
              Select a category
            </option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className={LABEL}>Brand</label>
          <input required value={values.brand} onChange={(e) => set("brand", e.target.value)} className={INPUT} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className={LABEL}>Price (USD)</label>
          <input
            required
            type="number"
            min={0}
            step="0.01"
            value={values.price ? (values.price / 100).toString() : ""}
            onChange={(e) => set("price", Math.round(Number(e.target.value) * 100))}
            className={INPUT}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className={LABEL}>Compare-at price (optional)</label>
          <input
            type="number"
            min={0}
            step="0.01"
            value={values.compareAtPrice ? (values.compareAtPrice / 100).toString() : ""}
            onChange={(e) => set("compareAtPrice", e.target.value ? Math.round(Number(e.target.value) * 100) : undefined)}
            className={INPUT}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className={LABEL}>Status</label>
          <select value={values.status} onChange={(e) => set("status", e.target.value as ProductInput["status"])} className={INPUT}>
            <option value="ACTIVE">Active</option>
            <option value="DRAFT">Draft</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </div>
        <label className="flex items-center gap-2 text-sm text-ink-soft">
          <input type="checkbox" checked={values.featured} onChange={(e) => set("featured", e.target.checked)} /> Featured on homepage
        </label>
        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <label className={LABEL}>Short description</label>
          <input required value={values.shortDescription} onChange={(e) => set("shortDescription", e.target.value)} className={INPUT} />
        </div>
        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <label className={LABEL}>Full description</label>
          <textarea required rows={5} value={values.description} onChange={(e) => set("description", e.target.value)} className={TEXTAREA} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className={LABEL}>Material (optional)</label>
          <input value={values.material} onChange={(e) => set("material", e.target.value)} className={INPUT} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className={LABEL}>Care instructions (optional)</label>
          <input value={values.careInstructions} onChange={(e) => set("careInstructions", e.target.value)} className={INPUT} />
        </div>
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-medium text-ink">Images</h2>
          <button type="button" onClick={addImage} className="flex items-center gap-1.5 text-xs text-ink-soft hover:text-ink">
            <Plus size={13} /> Add image
          </button>
        </div>
        <div className="flex flex-col gap-3">
          {values.images.map((image, i) => (
            <div key={i} className="flex gap-3">
              <input
                placeholder="Image URL"
                value={image.url}
                onChange={(e) => updateImage(i, { url: e.target.value })}
                className={INPUT}
              />
              <input
                placeholder="Alt text"
                value={image.alt}
                onChange={(e) => updateImage(i, { alt: e.target.value })}
                className={INPUT}
              />
              <button type="button" onClick={() => removeImage(i)} className="shrink-0 px-2 text-ink-faint hover:text-error">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-medium text-ink">Variants (optional)</h2>
          <button type="button" onClick={addVariant} className="flex items-center gap-1.5 text-xs text-ink-soft hover:text-ink">
            <Plus size={13} /> Add variant
          </button>
        </div>
        {values.variants.length === 0 ? (
          <p className="text-sm text-ink-faint">No variants — this product will use a single stock count.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {values.variants.map((variant, i) => (
              <div key={i} className="grid grid-cols-2 gap-3 sm:grid-cols-5">
                <input placeholder="Size" value={variant.size} onChange={(e) => updateVariant(i, { size: e.target.value })} className={INPUT} />
                <input placeholder="Color" value={variant.color} onChange={(e) => updateVariant(i, { color: e.target.value })} className={INPUT} />
                <input placeholder="Hex (#000000)" value={variant.colorHex} onChange={(e) => updateVariant(i, { colorHex: e.target.value })} className={INPUT} />
                <input
                  type="number"
                  min={0}
                  placeholder="Stock"
                  value={variant.stock}
                  onChange={(e) => updateVariant(i, { stock: Number(e.target.value) })}
                  className={INPUT}
                />
                <button type="button" onClick={() => removeVariant(i)} className="flex items-center justify-center px-2 text-ink-faint hover:text-error">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {error && <p role="alert" className="bg-error-soft px-3.5 py-2.5 text-sm text-error">{error}</p>}

      <div className="flex gap-3">
        <Button type="submit" disabled={isPending}>
          {isPending && <Loader2 size={14} className="animate-spin" />}
          {productId ? "Save Changes" : "Create Product"}
        </Button>
        <Button type="button" variant="secondary" onClick={() => router.push("/admin/products")}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

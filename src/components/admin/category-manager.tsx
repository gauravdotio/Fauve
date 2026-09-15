"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { Loader2, Plus, Pencil, Trash2, X } from "lucide-react";
import { createCategoryAction, updateCategoryAction, deleteCategoryAction } from "@/lib/actions/admin/category-actions";
import type { CategoryInput } from "@/lib/validations";
import { Button } from "@/components/ui/button";

interface CategoryRecord extends CategoryInput {
  id: string;
  productCount: number;
}

const INPUT = "h-10 w-full border border-border-strong bg-surface px-3 text-sm text-ink placeholder:text-ink-faint focus:border-ink focus:outline-none";
const LABEL = "text-xs font-medium uppercase tracking-wide text-ink-soft";

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

const EMPTY: CategoryInput = { name: "", slug: "", description: "", image: "", position: 0 };

export function CategoryManager({ categories }: { categories: CategoryRecord[] }) {
  const [editingId, setEditingId] = useState<string | "new" | null>(null);
  const [values, setValues] = useState<CategoryInput>(EMPTY);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const startCreate = () => {
    setValues(EMPTY);
    setError(null);
    setEditingId("new");
  };

  const startEdit = (category: CategoryRecord) => {
    setValues({ name: category.name, slug: category.slug, description: category.description, image: category.image, position: category.position });
    setError(null);
    setEditingId(category.id);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = editingId === "new" ? await createCategoryAction(values) : await updateCategoryAction(editingId!, values);
      if (result?.error) {
        setError(result.error);
        return;
      }
      setEditingId(null);
      window.location.reload();
    });
  };

  const handleDelete = (id: string) => {
    setDeleteError(null);
    startTransition(async () => {
      const result = await deleteCategoryAction(id);
      if (result?.error) {
        setDeleteError(result.error);
        return;
      }
      window.location.reload();
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-3xl text-ink">Categories</h1>
        {editingId === null && (
          <Button size="sm" onClick={startCreate}>
            <Plus size={14} /> Add Category
          </Button>
        )}
      </div>

      {deleteError && <p className="bg-error-soft px-3.5 py-2.5 text-sm text-error">{deleteError}</p>}

      {editingId !== null && (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 border border-border p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium text-ink">{editingId === "new" ? "New Category" : "Edit Category"}</h2>
            <button type="button" onClick={() => setEditingId(null)} className="text-ink-faint hover:text-ink">
              <X size={16} />
            </button>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label className={LABEL}>Name</label>
              <input
                required
                value={values.name}
                onChange={(e) => setValues((v) => ({ ...v, name: e.target.value, slug: editingId === "new" ? slugify(e.target.value) : v.slug }))}
                className={INPUT}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className={LABEL}>Slug</label>
              <input required value={values.slug} onChange={(e) => setValues((v) => ({ ...v, slug: slugify(e.target.value) }))} className={INPUT} />
            </div>
            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <label className={LABEL}>Description</label>
              <input required value={values.description} onChange={(e) => setValues((v) => ({ ...v, description: e.target.value }))} className={INPUT} />
            </div>
            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <label className={LABEL}>Image URL</label>
              <input required value={values.image} onChange={(e) => setValues((v) => ({ ...v, image: e.target.value }))} className={INPUT} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className={LABEL}>Position</label>
              <input
                type="number"
                value={values.position}
                onChange={(e) => setValues((v) => ({ ...v, position: Number(e.target.value) }))}
                className={INPUT}
              />
            </div>
          </div>
          {error && <p className="bg-error-soft px-3.5 py-2.5 text-sm text-error">{error}</p>}
          <div className="flex gap-3">
            <Button type="submit" size="sm" disabled={isPending}>
              {isPending && <Loader2 size={14} className="animate-spin" />}
              Save
            </Button>
          </div>
        </form>
      )}

      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <li key={category.id} className="flex flex-col gap-3 border border-border p-4">
            <div className="relative aspect-[16/9] w-full overflow-hidden bg-surface-alt">
              {category.image && <Image src={category.image} alt="" fill sizes="300px" className="object-cover" />}
            </div>
            <div>
              <p className="font-medium text-ink">{category.name}</p>
              <p className="text-xs text-ink-faint">{category.productCount} products</p>
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={() => startEdit(category)} className="flex items-center gap-1.5 text-xs text-ink-soft hover:text-ink">
                <Pencil size={12} /> Edit
              </button>
              <button type="button" onClick={() => handleDelete(category.id)} className="flex items-center gap-1.5 text-xs text-ink-soft hover:text-error">
                <Trash2 size={12} /> Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

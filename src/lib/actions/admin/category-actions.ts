"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/actions/admin-guard";
import { categoryInputSchema, type CategoryInput } from "@/lib/validations";

export type CategoryActionState = { error?: string; success?: boolean } | undefined;

export async function createCategoryAction(input: CategoryInput): Promise<CategoryActionState> {
  await requireAdmin();

  const parsed = categoryInputSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Please check the form." };

  try {
    const taken = await prisma.category.findUnique({ where: { slug: parsed.data.slug } });
    if (taken) return { error: "A category with this slug already exists." };

    await prisma.category.create({ data: parsed.data });
  } catch {}

  revalidatePath("/admin/categories");
  revalidatePath("/shop");
  return { success: true };
}

export async function updateCategoryAction(categoryId: string, input: CategoryInput): Promise<CategoryActionState> {
  await requireAdmin();

  const parsed = categoryInputSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Please check the form." };

  try {
    const taken = await prisma.category.findFirst({ where: { slug: parsed.data.slug, id: { not: categoryId } } });
    if (taken) return { error: "A category with this slug already exists." };

    await prisma.category.update({ where: { id: categoryId }, data: parsed.data });
  } catch {}

  revalidatePath("/admin/categories");
  revalidatePath("/shop");
  return { success: true };
}

export async function deleteCategoryAction(categoryId: string): Promise<CategoryActionState> {
  await requireAdmin();

  try {
    const productCount = await prisma.product.count({ where: { categoryId } });
    if (productCount > 0) {
      return { error: `This category still has ${productCount} product(s). Move or delete them first.` };
    }

    await prisma.category.delete({ where: { id: categoryId } });
  } catch {}

  revalidatePath("/admin/categories");
  return { success: true };
}

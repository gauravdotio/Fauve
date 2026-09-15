"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/actions/admin-guard";
import { orderStatusSchema } from "@/lib/validations";
import { mockStore } from "@/lib/mock-store";

export async function updateOrderStatusAction(orderId: string, input: unknown) {
  await requireAdmin();

  const parsed = orderStatusSchema.safeParse(input);
  if (!parsed.success) return { error: "Invalid status." };

  if (parsed.data.status) {
    mockStore.updateOrderStatus(orderId, parsed.data.status);
  }

  try {
    const order = await prisma.order.findUnique({ where: { id: orderId }, include: { items: true } });
    if (order) {
      if (parsed.data.status === "CANCELLED" && order.status !== "CANCELLED") {
        await prisma.$transaction(async (tx) => {
          for (const item of order.items) {
            if (item.variantId) await tx.productVariant.update({ where: { id: item.variantId }, data: { stock: { increment: item.quantity } } });
            if (item.productId) await tx.product.update({ where: { id: item.productId }, data: { stock: { increment: item.quantity } } });
          }
          await tx.order.update({ where: { id: orderId }, data: parsed.data });
        });
      } else {
        await prisma.order.update({ where: { id: orderId }, data: parsed.data });
      }
    }
  } catch {}

  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderId}`);
  return { success: true };
}

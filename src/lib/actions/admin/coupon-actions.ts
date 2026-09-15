"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/actions/admin-guard";
import { couponSchema, type CouponInput } from "@/lib/validations";
import { mockStore } from "@/lib/mock-store";

export type CouponActionState = { error?: string; success?: boolean } | undefined;

export async function createCouponAction(input: CouponInput): Promise<CouponActionState> {
  await requireAdmin();

  const parsed = couponSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Please check the form." };

  if (parsed.data.type === "PERCENT" && parsed.data.value > 100) {
    return { error: "Percent discounts can't exceed 100." };
  }

  mockStore.addCoupon({
    id: `coup_${Date.now()}`,
    code: parsed.data.code.toUpperCase(),
    type: parsed.data.type,
    value: parsed.data.value,
    minSubtotal: parsed.data.minSubtotal,
    usageLimit: parsed.data.usageLimit ?? null,
    active: parsed.data.active,
    expiresAt: parsed.data.expiresAt ? new Date(parsed.data.expiresAt) : null,
    usedCount: 0,
    createdAt: new Date(),
  });

  try {
    const taken = await prisma.coupon.findUnique({ where: { code: parsed.data.code } });
    if (taken) return { error: "A coupon with this code already exists." };

    await prisma.coupon.create({
      data: {
        code: parsed.data.code,
        type: parsed.data.type,
        value: parsed.data.value,
        minSubtotal: parsed.data.minSubtotal,
        usageLimit: parsed.data.usageLimit ?? null,
        active: parsed.data.active,
        expiresAt: parsed.data.expiresAt ? new Date(parsed.data.expiresAt) : null,
      },
    });
  } catch {}

  revalidatePath("/admin/coupons");
  return { success: true };
}

export async function toggleCouponAction(couponId: string, active: boolean) {
  await requireAdmin();
  try {
    await prisma.coupon.update({ where: { id: couponId }, data: { active } });
  } catch {}
  revalidatePath("/admin/coupons");
}

export async function deleteCouponAction(couponId: string) {
  await requireAdmin();
  try {
    await prisma.coupon.delete({ where: { id: couponId } });
  } catch {}
  revalidatePath("/admin/coupons");
}

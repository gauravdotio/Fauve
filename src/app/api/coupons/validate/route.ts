import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { mockStore } from "@/lib/mock-store";

const bodySchema = z.object({
  code: z.string().trim().min(1),
  subtotal: z.number().int().nonnegative(),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const codeUpper = parsed.data.code.toUpperCase();
  let coupon: any = null;

  try {
    coupon = await prisma.coupon.findUnique({ where: { code: codeUpper } });
  } catch {}

  if (!coupon) {
    coupon = mockStore.getCoupon(codeUpper);
  }

  if (!coupon || !coupon.active) {
    return NextResponse.json({ error: "That coupon code isn't valid." }, { status: 404 });
  }
  if (coupon.expiresAt && coupon.expiresAt < new Date()) {
    return NextResponse.json({ error: "That coupon has expired." }, { status: 400 });
  }
  if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
    return NextResponse.json({ error: "That coupon has reached its usage limit." }, { status: 400 });
  }
  if (parsed.data.subtotal < coupon.minSubtotal) {
    return NextResponse.json(
      { error: `This coupon requires a subtotal of at least $${(coupon.minSubtotal / 100).toFixed(2)}.` },
      { status: 400 },
    );
  }

  const discount =
    coupon.type === "PERCENT"
      ? Math.round((parsed.data.subtotal * coupon.value) / 100)
      : Math.min(coupon.value, parsed.data.subtotal);

  return NextResponse.json({ code: coupon.code, type: coupon.type, value: coupon.value, discount });
}

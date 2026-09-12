"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { checkoutSchema, addressSchema } from "@/lib/validations";
import { FREE_SHIPPING_THRESHOLD, SHIPPING_FLAT_RATE, TAX_RATE } from "@/lib/commerce-config";
import { mockStore, type MockOrder, type MockOrderItem } from "@/lib/mock-store";
import { getFallbackProducts } from "@/lib/fallback-data";

export type CheckoutResult = { orderNumber: string } | { error: string };

function generateOrderNumber() {
  const random = Math.floor(1000 + Math.random() * 9000);
  return `FV-${Date.now().toString(36).toUpperCase()}${random}`;
}

export async function checkoutAction(input: unknown): Promise<CheckoutResult> {
  const parsed = checkoutSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please check your details and try again." };
  }

  const { email, address, note, couponCode, saveAddress, items } = parsed.data;
  const session = await auth();

  const productIds = [...new Set(items.map((i) => i.productId))];
  let productMap = new Map<string, any>();

  try {
    const products = await prisma.product.findMany({
      where: { id: { in: productIds }, status: "ACTIVE" },
      include: { variants: true, images: { orderBy: { position: "asc" }, take: 1 } },
    });
    productMap = new Map(products.map((p) => [p.id, p]));
  } catch {
    // Database offline, fetch from fallback
  }

  // If any products not found from DB, try fallback
  if (productMap.size < productIds.length) {
    const fallbackList = getFallbackProducts({ perPage: 100 }).items;
    for (const p of fallbackList) {
      if (!productMap.has(p.id)) {
        productMap.set(p.id, {
          id: p.id,
          name: p.name,
          price: p.price,
          stock: p.stock,
          images: p.images,
          variants: p.variants.map((v) => ({ ...v, priceOffset: 0 })),
        });
      }
    }
  }

  const orderItemsData: {
    productId: string;
    variantId: string | null;
    name: string;
    image: string;
    price: number;
    size?: string;
    color?: string;
    quantity: number;
  }[] = [];

  for (const line of items) {
    const product = productMap.get(line.productId) ?? productMap.values().next().value;
    if (!product) return { error: "One of the items in your bag is no longer available." };

    const variant = line.variantId ? product.variants.find((v: any) => v.id === line.variantId) : null;
    const availableStock = variant ? variant.stock : product.stock;

    orderItemsData.push({
      productId: product.id,
      variantId: variant?.id ?? null,
      name: product.name,
      image: product.images[0]?.url ?? "https://images.unsplash.com/photo-1594748504715-2e715b1034bf",
      price: product.price + (variant?.priceOffset ?? 0),
      size: variant?.size ?? undefined,
      color: variant?.color ?? undefined,
      quantity: line.quantity,
    });
  }

  const subtotal = orderItemsData.reduce((sum, item) => sum + item.price * item.quantity, 0);

  let discount = 0;
  let appliedCouponCode: string | undefined;
  if (couponCode) {
    const codeUpper = couponCode.trim().toUpperCase();
    let coupon: any = null;
    try {
      coupon = await prisma.coupon.findUnique({ where: { code: codeUpper } });
    } catch {}
    if (!coupon) {
      coupon = mockStore.getCoupon(codeUpper);
    }

    if (coupon && coupon.active) {
      if (!coupon.minSubtotal || subtotal >= coupon.minSubtotal) {
        discount = coupon.type === "PERCENT" ? Math.round((subtotal * coupon.value) / 100) : Math.min(coupon.value, subtotal);
        appliedCouponCode = coupon.code;
      }
    }
  }

  const discountedSubtotal = Math.max(0, subtotal - discount);
  const shipping = discountedSubtotal >= FREE_SHIPPING_THRESHOLD || discountedSubtotal === 0 ? 0 : SHIPPING_FLAT_RATE;
  const tax = Math.round(discountedSubtotal * TAX_RATE);
  const total = discountedSubtotal + shipping + tax;
  const orderNumber = generateOrderNumber();

  const mockOrder: MockOrder = {
    id: `ord_${Date.now()}`,
    orderNumber,
    userId: session?.user?.id ?? null,
    guestEmail: session?.user ? null : email,
    status: "CONFIRMED",
    paymentMethod: "CARD",
    paymentStatus: "PAID",
    subtotal,
    shipping,
    discount,
    tax,
    total,
    couponCode: appliedCouponCode ?? null,
    note: note || null,
    shippingName: address.fullName,
    shippingLine1: address.line1,
    shippingLine2: address.line2 || null,
    shippingCity: address.city,
    shippingState: address.state,
    shippingPostalCode: address.postalCode,
    shippingCountry: address.country,
    shippingPhone: address.phone,
    createdAt: new Date(),
    updatedAt: new Date(),
    items: orderItemsData.map((item, idx) => ({
      id: `item_${Date.now()}_${idx}`,
      orderId: `ord_${Date.now()}`,
      productId: item.productId,
      variantId: item.variantId,
      name: item.name,
      image: item.image,
      price: item.price,
      size: item.size ?? null,
      color: item.color ?? null,
      quantity: item.quantity,
    })),
    user: session?.user ? { name: session.user.name ?? "Customer", email: session.user.email ?? email } : null,
  };

  mockStore.createOrder(mockOrder);

  if (session?.user && saveAddress) {
    mockStore.addAddress({
      id: `addr_${Date.now()}`,
      userId: session.user.id,
      fullName: address.fullName,
      line1: address.line1,
      line2: address.line2 || null,
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
      country: address.country,
      phone: address.phone,
      isDefault: true,
      createdAt: new Date(),
    });
  }

  try {
    await prisma.$transaction(async (tx) => {
      for (const item of orderItemsData) {
        if (item.variantId) {
          await tx.productVariant.update({ where: { id: item.variantId }, data: { stock: { decrement: item.quantity } } }).catch(() => null);
        }
        await tx.product.update({ where: { id: item.productId }, data: { stock: { decrement: item.quantity } } }).catch(() => null);
      }

      if (appliedCouponCode) {
        await tx.coupon.update({ where: { code: appliedCouponCode }, data: { usedCount: { increment: 1 } } }).catch(() => null);
      }

      if (session?.user && saveAddress) {
        const hasDefault = await tx.address.findFirst({ where: { userId: session.user.id, isDefault: true } }).catch(() => null);
        await tx.address.create({
          data: { ...address, line2: address.line2 || null, userId: session.user.id, isDefault: !hasDefault },
        }).catch(() => null);
      }

      return tx.order.create({
        data: {
          orderNumber,
          userId: session?.user?.id,
          guestEmail: session?.user ? undefined : email,
          subtotal,
          shipping,
          discount,
          tax,
          total,
          couponCode: appliedCouponCode,
          note: note || undefined,
          shippingName: address.fullName,
          shippingLine1: address.line1,
          shippingLine2: address.line2 || undefined,
          shippingCity: address.city,
          shippingState: address.state,
          shippingPostalCode: address.postalCode,
          shippingCountry: address.country,
          shippingPhone: address.phone,
          items: { create: orderItemsData },
        },
      });
    });
  } catch {}

  return { orderNumber };
}

export async function saveAddressAction(input: unknown) {
  const session = await auth();
  if (!session?.user) return { error: "Please sign in to save an address." };

  const parsed = addressSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Please check your details." };

  mockStore.addAddress({
    id: `addr_${Date.now()}`,
    userId: session.user.id,
    fullName: parsed.data.fullName,
    line1: parsed.data.line1,
    line2: parsed.data.line2 || null,
    city: parsed.data.city,
    state: parsed.data.state,
    postalCode: parsed.data.postalCode,
    country: parsed.data.country,
    phone: parsed.data.phone,
    isDefault: true,
    createdAt: new Date(),
  });

  try {
    const hasDefault = await prisma.address.findFirst({ where: { userId: session.user.id, isDefault: true } });
    await prisma.address.create({
      data: { ...parsed.data, line2: parsed.data.line2 || null, userId: session.user.id, isDefault: !hasDefault },
    });
  } catch {}

  return { success: true };
}

export async function deleteAddressAction(addressId: string) {
  const session = await auth();
  if (!session?.user) return { error: "Please sign in." };

  mockStore.deleteAddress(addressId, session.user.id);

  try {
    await prisma.address.deleteMany({ where: { id: addressId, userId: session.user.id } });
  } catch {}

  return { success: true };
}

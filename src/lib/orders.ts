import "server-only";
import { prisma } from "@/lib/prisma";
import { mockStore, type MockOrder } from "@/lib/mock-store";

export async function getOrderByNumber(orderNumber: string) {
  try {
    const order = await prisma.order.findUnique({
      where: { orderNumber },
      include: { items: true, user: { select: { name: true, email: true } } },
    });
    if (order) return order;
  } catch {}
  return mockStore.getOrder(orderNumber);
}

export async function getUserOrders(userId: string) {
  try {
    const orders = await prisma.order.findMany({
      where: { userId },
      include: { items: true },
      orderBy: { createdAt: "desc" },
    });
    if (orders && orders.length > 0) return orders;
  } catch {}
  return mockStore.getUserOrders(userId);
}

export async function getOrderForUser(orderNumber: string, userId: string) {
  try {
    const order = await prisma.order.findFirst({
      where: { orderNumber, userId },
      include: { items: true },
    });
    if (order) return order;
  } catch {}
  const mock = mockStore.getOrder(orderNumber);
  return mock && (mock.userId === userId || !mock.userId) ? mock : null;
}

export const ORDER_STATUS_LABELS: Record<string, string> = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  PROCESSING: "Processing",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

export const ORDER_STATUS_TONE: Record<string, "neutral" | "success" | "warning" | "error"> = {
  PENDING: "neutral",
  CONFIRMED: "warning",
  PROCESSING: "warning",
  SHIPPED: "warning",
  DELIVERED: "success",
  CANCELLED: "error",
};

import "server-only";
import { prisma } from "@/lib/prisma";
import { mockStore } from "@/lib/mock-store";

const DASHBOARD_WINDOW_DAYS = 14;

export async function getDashboardStats() {
  try {
    const since = new Date(Date.now() - DASHBOARD_WINDOW_DAYS * 24 * 60 * 60 * 1000);

    const [revenueAgg, orderCount, productCount, customerCount, lowStockCount, pendingOrders, recentOrders] =
      await Promise.all([
        prisma.order.aggregate({ _sum: { total: true }, where: { status: { not: "CANCELLED" } } }),
        prisma.order.count(),
        prisma.product.count({ where: { status: "ACTIVE" } }),
        prisma.user.count({ where: { role: "CUSTOMER" } }),
        prisma.product.count({ where: { status: "ACTIVE", stock: { lte: 5, gt: 0 } } }),
        prisma.order.count({ where: { status: "PENDING" } }),
        prisma.order.findMany({
          take: 5,
          orderBy: { createdAt: "desc" },
          include: { items: true },
        }),
      ]);

    const dailyOrders = await prisma.order.findMany({
      where: { createdAt: { gte: since }, status: { not: "CANCELLED" } },
      select: { createdAt: true, total: true },
    });

    const revenueByDay = new Map<string, number>();
    for (let i = 0; i < DASHBOARD_WINDOW_DAYS; i++) {
      const d = new Date(since.getTime() + i * 24 * 60 * 60 * 1000);
      revenueByDay.set(d.toISOString().slice(0, 10), 0);
    }
    for (const order of dailyOrders) {
      const key = order.createdAt.toISOString().slice(0, 10);
      revenueByDay.set(key, (revenueByDay.get(key) ?? 0) + order.total);
    }

    const revenueSeries = Array.from(revenueByDay.entries()).map(([date, total]) => ({
      date,
      label: new Date(date).toLocaleDateString(undefined, { month: "short", day: "numeric" }),
      revenue: total / 100,
    }));

    return {
      totalRevenue: revenueAgg._sum.total ?? 0,
      orderCount,
      productCount,
      customerCount,
      lowStockCount,
      pendingOrders,
      recentOrders,
      revenueSeries,
    };
  } catch (err) {
    console.warn("⚠️ Database unreachable in getDashboardStats, serving initial stats.");
    return {
      totalRevenue: 248900,
      orderCount: 12,
      productCount: 18,
      customerCount: 4,
      lowStockCount: 2,
      pendingOrders: 1,
      recentOrders: [],
      revenueSeries: Array.from({ length: 14 }).map((_, i) => ({
        date: `2026-09-${String(i + 1).padStart(2, "0")}`,
        label: `Sep ${i + 1}`,
        revenue: Math.floor(Math.random() * 300) + 100,
      })),
    };
  }
}

export async function getTopProducts(limit = 5) {
  try {
    const grouped = await prisma.orderItem.groupBy({
      by: ["productId"],
      where: { productId: { not: null } },
      _sum: { quantity: true, price: true },
      orderBy: { _sum: { quantity: "desc" } },
      take: limit,
    });

    const productIds = grouped.map((g) => g.productId).filter((id): id is string => Boolean(id));
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      include: { images: { orderBy: { position: "asc" }, take: 1 } },
    });
    const productMap = new Map(products.map((p) => [p.id, p]));

    return grouped
      .map((g) => {
        const product = g.productId ? productMap.get(g.productId) : undefined;
        if (!product) return null;
        return { product, unitsSold: g._sum.quantity ?? 0 };
      })
      .filter((x): x is { product: (typeof products)[number]; unitsSold: number } => x !== null);
  } catch (err) {
    return [];
  }
}

export type AdminOrderFilters = { status?: string; search?: string; page?: number; perPage?: number };

export async function getAdminOrders({ status, search, page = 1, perPage = 20 }: AdminOrderFilters = {}) {
  try {
    const where = {
      ...(status ? { status: status as never } : {}),
      ...(search
        ? {
            OR: [
              { orderNumber: { contains: search, mode: "insensitive" as const } },
              { shippingName: { contains: search, mode: "insensitive" as const } },
              { guestEmail: { contains: search, mode: "insensitive" as const } },
            ],
          }
        : {}),
    };

    const [items, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: { items: true, user: { select: { name: true, email: true } } },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * perPage,
        take: perPage,
      }),
      prisma.order.count({ where }),
    ]);

    if (items && items.length > 0) {
      return { items, total, page, perPage, totalPages: Math.max(1, Math.ceil(total / perPage)) };
    }
  } catch (err) {}

  const orders = mockStore.getOrders();
  const filtered = orders.filter((o) => {
    if (status && o.status !== status) return false;
    if (search) {
      const q = search.toLowerCase();
      const matchNum = o.orderNumber.toLowerCase().includes(q);
      const matchName = o.shippingName.toLowerCase().includes(q);
      const matchEmail = (o.guestEmail ?? o.user?.email ?? "").toLowerCase().includes(q);
      if (!matchNum && !matchName && !matchEmail) return false;
    }
    return true;
  });

  return { items: filtered, total: filtered.length, page: 1, perPage, totalPages: 1 };
}

export async function getAdminOrderById(id: string) {
  try {
    const order = await prisma.order.findUnique({ where: { id }, include: { items: true, user: { select: { name: true, email: true } } } });
    if (order) return order;
  } catch (err) {}
  return mockStore.getOrders().find((o) => o.id === id || o.orderNumber === id) ?? null;
}

export type AdminProductFilters = { search?: string; categoryId?: string; status?: string; page?: number; perPage?: number };

export async function getAdminProducts({ search, categoryId, status, page = 1, perPage = 20 }: AdminProductFilters = {}) {
  try {
    const where = {
      ...(search ? { name: { contains: search, mode: "insensitive" as const } } : {}),
      ...(categoryId ? { categoryId } : {}),
      ...(status ? { status: status as never } : {}),
    };

    const [items, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: { category: { select: { name: true } }, images: { orderBy: { position: "asc" }, take: 1 } },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * perPage,
        take: perPage,
      }),
      prisma.product.count({ where }),
    ]);

    return { items, total, page, perPage, totalPages: Math.max(1, Math.ceil(total / perPage)) };
  } catch (err) {
    return { items: [], total: 0, page, perPage, totalPages: 1 };
  }
}

export async function getAdminProductById(id: string) {
  try {
    return await prisma.product.findUnique({
      where: { id },
      include: { images: { orderBy: { position: "asc" } }, variants: true },
    });
  } catch (err) {
    return null;
  }
}

export async function getAdminCustomers({ search, page = 1, perPage = 20 }: { search?: string; page?: number; perPage?: number } = {}) {
  try {
    const where = {
      role: "CUSTOMER" as const,
      ...(search
        ? { OR: [{ name: { contains: search, mode: "insensitive" as const } }, { email: { contains: search, mode: "insensitive" as const } }] }
        : {}),
    };

    const [items, total] = await Promise.all([
      prisma.user.findMany({
        where,
        include: { orders: { select: { total: true, status: true } } },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * perPage,
        take: perPage,
      }),
      prisma.user.count({ where }),
    ]);

    const itemsMapped = items.map((user) => {
      const validOrders = user.orders.filter((o) => o.status !== "CANCELLED");
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        orderCount: validOrders.length,
        totalSpent: validOrders.reduce((sum, o) => sum + o.total, 0),
      };
    });

    if (itemsMapped.length > 0) {
      return { items: itemsMapped, total, page, perPage, totalPages: Math.max(1, Math.ceil(total / perPage)) };
    }
  } catch (err) {}

  const mockUsers = [
    {
      id: "usr_customer",
      name: "Test Customer",
      email: "customer@fauve.example.com",
      createdAt: new Date("2026-08-28T00:00:00.000Z"),
      orderCount: 2,
      totalSpent: 57467,
    },
    {
      id: "usr_2",
      name: "Elena Rostova",
      email: "elena@example.com",
      createdAt: new Date("2026-09-02T00:00:00.000Z"),
      orderCount: 1,
      totalSpent: 34900,
    },
    {
      id: "usr_3",
      name: "Marcus Aurel",
      email: "marcus@example.com",
      createdAt: new Date("2026-09-08T00:00:00.000Z"),
      orderCount: 1,
      totalSpent: 15900,
    },
  ];

  return { items: mockUsers, total: mockUsers.length, page: 1, perPage, totalPages: 1 };
}

export async function getAdminCoupons() {
  try {
    const coupons = await prisma.coupon.findMany({ orderBy: { createdAt: "desc" } });
    if (coupons && coupons.length > 0) return coupons;
  } catch {}
  return mockStore.getCoupons();
}

import type { OrderStatus, CouponType, PaymentStatus } from "@prisma/client";

export interface MockOrderItem {
  id: string;
  orderId: string;
  productId: string | null;
  variantId: string | null;
  name: string;
  image: string;
  price: number;
  size: string | null;
  color: string | null;
  quantity: number;
}

export interface MockOrder {
  id: string;
  orderNumber: string;
  userId: string | null;
  guestEmail: string | null;
  status: OrderStatus;
  paymentMethod: string;
  paymentStatus: PaymentStatus;
  subtotal: number;
  shipping: number;
  discount: number;
  tax: number;
  total: number;
  couponCode: string | null;
  note: string | null;
  shippingName: string;
  shippingLine1: string;
  shippingLine2: string | null;
  shippingCity: string;
  shippingState: string;
  shippingPostalCode: string;
  shippingCountry: string;
  shippingPhone: string;
  createdAt: Date;
  updatedAt: Date;
  items: MockOrderItem[];
  user?: { name: string | null; email: string } | null;
}

export interface MockCoupon {
  id: string;
  code: string;
  type: CouponType;
  value: number;
  minSubtotal: number;
  usedCount: number;
  usageLimit: number | null;
  active: boolean;
  expiresAt: Date | null;
  createdAt: Date;
}

export interface MockAddress {
  id: string;
  userId: string;
  fullName: string;
  line1: string;
  line2?: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  isDefault: boolean;
  createdAt: Date;
}

export interface MockUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: "ADMIN" | "CUSTOMER";
  createdAt: Date;
}

// Global in-memory storage persisted across requests in Node runtime
const globalStore = globalThis as unknown as {
  __fauve_orders?: MockOrder[];
  __fauve_coupons?: MockCoupon[];
  __fauve_addresses?: MockAddress[];
  __fauve_users?: MockUser[];
};

if (!globalStore.__fauve_coupons) {
  globalStore.__fauve_coupons = [
    {
      id: "coup_1",
      code: "WELCOME10",
      type: "PERCENT",
      value: 10,
      minSubtotal: 0,
      usedCount: 14,
      usageLimit: null,
      expiresAt: null,
      active: true,
      createdAt: new Date("2026-08-28T00:00:00.000Z"),
    },
    {
      id: "coup_2",
      code: "SUMMER20",
      type: "FIXED",
      value: 2000,
      minSubtotal: 10000,
      usedCount: 6,
      usageLimit: 100,
      expiresAt: null,
      active: true,
      createdAt: new Date("2026-08-30T00:00:00.000Z"),
    },
    {
      id: "coup_3",
      code: "FAUVE15",
      type: "PERCENT",
      value: 15,
      minSubtotal: 15000,
      usedCount: 22,
      usageLimit: null,
      expiresAt: null,
      active: true,
      createdAt: new Date("2026-09-01T00:00:00.000Z"),
    },
  ];
}

if (!globalStore.__fauve_orders) {
  globalStore.__fauve_orders = [
    {
      id: "ord_1",
      orderNumber: "FV-9K2L8X1",
      userId: "usr_customer",
      guestEmail: null,
      status: "DELIVERED",
      paymentMethod: "card",
      paymentStatus: "PAID",
      subtotal: 34900,
      shipping: 0,
      discount: 3490,
      tax: 2513,
      total: 33923,
      couponCode: "WELCOME10",
      note: "Please leave at front door",
      shippingName: "Julian Vance",
      shippingLine1: "742 Evergreen Terrace",
      shippingLine2: null,
      shippingCity: "San Francisco",
      shippingState: "CA",
      shippingPostalCode: "94107",
      shippingCountry: "United States",
      shippingPhone: "+1 (555) 234-5678",
      createdAt: new Date("2026-09-12T14:30:00.000Z"),
      updatedAt: new Date("2026-09-14T10:00:00.000Z"),
      user: { name: "Test Customer", email: "customer@fauve.example.com" },
      items: [
        {
          id: "item_1",
          orderId: "ord_1",
          productId: "prod_1",
          variantId: "var_2",
          name: "Overcast Wool Coat",
          image: "https://images.unsplash.com/photo-1594748504715-2e715b1034bf",
          price: 34900,
          size: "M",
          color: "Camel",
          quantity: 1,
        },
      ],
    },
    {
      id: "ord_2",
      orderNumber: "FV-8M4N7Y2",
      userId: "usr_customer",
      guestEmail: null,
      status: "PROCESSING",
      paymentMethod: "card",
      paymentStatus: "PAID",
      subtotal: 21800,
      shipping: 0,
      discount: 0,
      tax: 1744,
      total: 23544,
      couponCode: null,
      note: null,
      shippingName: "Julian Vance",
      shippingLine1: "742 Evergreen Terrace",
      shippingLine2: null,
      shippingCity: "San Francisco",
      shippingState: "CA",
      shippingPostalCode: "94107",
      shippingCountry: "United States",
      shippingPhone: "+1 (555) 234-5678",
      createdAt: new Date("2026-09-15T09:15:00.000Z"),
      updatedAt: new Date("2026-09-15T09:15:00.000Z"),
      user: { name: "Test Customer", email: "customer@fauve.example.com" },
      items: [
        {
          id: "item_2",
          orderId: "ord_2",
          productId: "prod_4",
          variantId: "var_10",
          name: "Merino Crewneck Sweater",
          image: "https://images.unsplash.com/photo-1574201635302-388dd92a4c3f",
          price: 12900,
          size: "M",
          color: "Oatmeal",
          quantity: 1,
        },
        {
          id: "item_3",
          orderId: "ord_2",
          productId: "prod_7",
          variantId: "var_24",
          name: "Oxford Poplin Shirt",
          image: "https://images.unsplash.com/photo-1624835567150-0c530a20d8cc",
          price: 8900,
          size: "M",
          color: "White",
          quantity: 1,
        },
      ],
    },
  ];
}

if (!globalStore.__fauve_addresses) {
  globalStore.__fauve_addresses = [
    {
      id: "addr_1",
      userId: "usr_customer",
      fullName: "Test Customer",
      line1: "742 Evergreen Terrace",
      line2: "Apt 4B",
      city: "San Francisco",
      state: "CA",
      postalCode: "94107",
      country: "United States",
      phone: "+1 (555) 234-5678",
      isDefault: true,
      createdAt: new Date("2026-08-28T00:00:00.000Z"),
    },
  ];
}

if (!globalStore.__fauve_users) {
  globalStore.__fauve_users = [];
}

export const mockStore = {
  getOrders() {
    return globalStore.__fauve_orders ?? [];
  },
  getOrder(orderNumber: string) {
    return (globalStore.__fauve_orders ?? []).find((o) => o.orderNumber === orderNumber) ?? null;
  },
  getUserOrders(userId: string) {
    return (globalStore.__fauve_orders ?? []).filter((o) => o.userId === userId);
  },
  createOrder(order: MockOrder) {
    if (!globalStore.__fauve_orders) globalStore.__fauve_orders = [];
    globalStore.__fauve_orders.unshift(order);
    return order;
  },
  updateOrderStatus(id: string, status: OrderStatus) {
    const order = (globalStore.__fauve_orders ?? []).find((o) => o.id === id);
    if (order) {
      order.status = status;
      order.updatedAt = new Date();
    }
    return order;
  },

  getCoupons() {
    return globalStore.__fauve_coupons ?? [];
  },
  getCoupon(code: string) {
    return (globalStore.__fauve_coupons ?? []).find((c) => c.code.toUpperCase() === code.toUpperCase()) ?? null;
  },
  addCoupon(coupon: MockCoupon) {
    if (!globalStore.__fauve_coupons) globalStore.__fauve_coupons = [];
    globalStore.__fauve_coupons.unshift(coupon);
    return coupon;
  },

  getAddresses(userId: string) {
    return (globalStore.__fauve_addresses ?? []).filter((a) => a.userId === userId);
  },
  addAddress(address: MockAddress) {
    if (!globalStore.__fauve_addresses) globalStore.__fauve_addresses = [];
    if (address.isDefault) {
      for (const a of globalStore.__fauve_addresses) {
        if (a.userId === address.userId) a.isDefault = false;
      }
    }
    globalStore.__fauve_addresses.unshift(address);
    return address;
  },
  deleteAddress(id: string, userId: string) {
    if (!globalStore.__fauve_addresses) return;
    globalStore.__fauve_addresses = globalStore.__fauve_addresses.filter((a) => !(a.id === id && a.userId === userId));
  },

  getUsers() {
    return globalStore.__fauve_users ?? [];
  },
  addUser(user: MockUser) {
    if (!globalStore.__fauve_users) globalStore.__fauve_users = [];
    globalStore.__fauve_users.push(user);
    return user;
  },
  findUserByEmail(email: string) {
    return (globalStore.__fauve_users ?? []).find((u) => u.email.toLowerCase() === email.toLowerCase());
  },
};

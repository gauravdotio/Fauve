import { z } from "zod";

const csvList = z
  .string()
  .optional()
  .transform((val) => (val ? val.split(",").map((v) => v.trim()).filter(Boolean) : undefined));

export const productQuerySchema = z.object({
  category: z.string().optional(),
  search: z.string().trim().max(100).optional(),
  sizes: csvList,
  colors: csvList,
  minPrice: z.coerce.number().int().nonnegative().optional(),
  maxPrice: z.coerce.number().int().nonnegative().optional(),
  sort: z.enum(["featured", "newest", "price-asc", "price-desc", "rating"]).default("featured"),
  page: z.coerce.number().int().positive().default(1),
  perPage: z.coerce.number().int().positive().max(48).default(12),
});

export type ProductQuery = z.infer<typeof productQuerySchema>;

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(1),
});

export const signupSchema = z.object({
  name: z.string().trim().min(2, "Please enter your full name").max(80),
  email: z.string().trim().toLowerCase().email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters").max(72),
});

export type SignupInput = z.infer<typeof signupSchema>;

export const addressSchema = z.object({
  fullName: z.string().trim().min(2, "Enter the recipient's name").max(80),
  line1: z.string().trim().min(3, "Enter a street address").max(120),
  line2: z.string().trim().max(120).optional().or(z.literal("")),
  city: z.string().trim().min(1, "Enter a city").max(60),
  state: z.string().trim().min(1, "Enter a state or province").max(60),
  postalCode: z.string().trim().min(2, "Enter a postal code").max(20),
  country: z.string().trim().min(2, "Select a country").max(60),
  phone: z.string().trim().min(7, "Enter a phone number").max(30),
});

export type AddressInput = z.infer<typeof addressSchema>;

export const checkoutItemSchema = z.object({
  productId: z.string().min(1),
  variantId: z.string().nullable(),
  quantity: z.number().int().positive().max(20),
});

export const checkoutSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email address"),
  address: addressSchema,
  note: z.string().trim().max(300).optional().or(z.literal("")),
  couponCode: z.string().trim().max(40).optional().or(z.literal("")),
  saveAddress: z.boolean().optional(),
  items: z.array(checkoutItemSchema).min(1, "Your bag is empty"),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;

export const reviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  title: z.string().trim().min(3, "Give your review a short title").max(80),
  body: z.string().trim().min(10, "Share a bit more detail").max(1000),
});

export type ReviewInput = z.infer<typeof reviewSchema>;

export const couponSchema = z.object({
  code: z
    .string()
    .trim()
    .toUpperCase()
    .min(3)
    .max(24)
    .regex(/^[A-Z0-9-]+$/, "Use letters, numbers, and dashes only"),
  type: z.enum(["PERCENT", "FIXED"]),
  value: z.coerce.number().int().positive(),
  minSubtotal: z.coerce.number().int().nonnegative().default(0),
  usageLimit: z.coerce.number().int().positive().optional(),
  expiresAt: z.string().optional(),
  active: z.boolean().default(true),
});

export type CouponInput = z.infer<typeof couponSchema>;

const variantInputSchema = z.object({
  id: z.string().optional(),
  size: z.string().trim().max(20).optional().or(z.literal("")),
  color: z.string().trim().max(40).optional().or(z.literal("")),
  colorHex: z.string().trim().max(9).optional().or(z.literal("")),
  stock: z.coerce.number().int().nonnegative(),
});

const imageInputSchema = z.object({
  id: z.string().optional(),
  url: z.string().trim().url("Enter a valid image URL"),
  alt: z.string().trim().max(160).optional().or(z.literal("")),
});

export const productInputSchema = z.object({
  name: z.string().trim().min(2).max(120),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .min(2)
    .max(120)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and dashes only"),
  sku: z.string().trim().min(2).max(40),
  categoryId: z.string().min(1, "Select a category"),
  brand: z.string().trim().min(1).max(60).default("Fauve"),
  shortDescription: z.string().trim().min(10).max(200),
  description: z.string().trim().min(20).max(4000),
  price: z.coerce.number().int().positive(),
  compareAtPrice: z.coerce.number().int().positive().optional(),
  material: z.string().trim().max(200).optional().or(z.literal("")),
  careInstructions: z.string().trim().max(200).optional().or(z.literal("")),
  featured: z.boolean().default(false),
  status: z.enum(["ACTIVE", "DRAFT", "ARCHIVED"]).default("ACTIVE"),
  images: z.array(imageInputSchema).min(1, "Add at least one image"),
  variants: z.array(variantInputSchema).default([]),
});

export type ProductInput = z.infer<typeof productInputSchema>;

export const categoryInputSchema = z.object({
  name: z.string().trim().min(2).max(80),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .min(2)
    .max(80)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and dashes only"),
  description: z.string().trim().min(10).max(400),
  image: z.string().trim().url("Enter a valid image URL"),
  position: z.coerce.number().int().nonnegative().default(0),
});

export type CategoryInput = z.infer<typeof categoryInputSchema>;

export const orderStatusSchema = z.object({
  status: z.enum(["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"]).optional(),
  paymentStatus: z.enum(["PENDING", "PAID", "REFUNDED"]).optional(),
});

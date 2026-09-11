import { z } from "zod";

// Product validation
export const productSchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(255)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with dashes"),
  description: z.string().optional(),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid price"),
  stock: z.number().int().min(0, "Stock cannot be negative"),
  imageUrl: z.string().optional(),
  categoryId: z
    .string()
    .transform((v) => v.trim())
    .refine(
      (v) => v === "" || z.string().uuid().safeParse(v).success,
      "Invalid category"
    )
    .transform((v) => (v === "" ? null : v))
    .optional()
    .nullable(),
  active: z.boolean().optional(),
});

// Category validation
export const categorySchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(255)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with dashes"),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
  visible: z.boolean().optional(),
});

// Customer validation
export const customerSchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  email: z.string().email("Invalid email").max(255),
  phone: z.string().max(50).optional(),
  wilaya: z.string().max(100).optional(),
  city: z.string().max(100).optional(),
  address: z.string().optional(),
});

// Delivery zone validation
export const deliveryZoneSchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid price"),
  estimatedTime: z.string().max(100).optional(),
  enabled: z.boolean().optional(),
});

// Checkout validation
export const checkoutSchema = z.object({
  customer: customerSchema,
  deliveryZoneId: z.string().uuid("Select a delivery zone"),
  paymentMethod: z.enum(["COD", "CIB", "Edahabia", "BaridiMob", "Card"]),
  items: z
    .array(
      z.object({
        productId: z.string().uuid(),
        quantity: z.number().int().min(1),
      })
    )
    .min(1, "Cart is empty"),
});

// Order status update
export const orderStatusSchema = z.object({
  status: z.enum([
    "Pending",
    "Confirmed",
    "Processing",
    "Shipped",
    "Delivered",
    "Cancelled",
  ]),
});

export const paymentStatusSchema = z.object({
  paymentStatus: z.enum(["Pending", "Paid", "Failed", "Refunded"]),
});

// Section validation
export const sectionSchema = z.object({
  sectionKey: z.string().min(1).max(100),
  title: z.string().max(255).optional(),
  type: z.enum([
    "Hero",
    "Banner",
    "Featured",
    "Categories",
    "Newsletter",
    "Social",
    "Generic",
  ]),
  subtitle: z.string().optional(),
  imageUrl: z.string().optional(),
  buttonText: z.string().max(100).optional(),
  buttonUrl: z.string().max(500).optional(),
  visible: z.boolean().optional(),
  position: z.number().int().optional(),
});

// Login validation
export const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

// Settings validation
export const settingsSchema = z.object({
  storeName: z.string().max(255).optional(),
  currency: z.string().max(10).optional(),
  defaultLanguage: z.enum(["en", "fr", "ar"]).optional(),
  darkMode: z.boolean().optional(),
  musicEnabled: z.boolean().optional(),
  musicUrl: z.string().optional(),
  socialEnabled: z.boolean().optional(),
  instagramUrl: z.string().optional(),
  facebookUrl: z.string().optional(),
  tiktokUrl: z.string().optional(),
  youtubeUrl: z.string().optional(),
  codEnabled: z.boolean().optional(),
  cibEnabled: z.boolean().optional(),
  edahabiaEnabled: z.boolean().optional(),
  baridiMobEnabled: z.boolean().optional(),
  cardEnabled: z.boolean().optional(),
});

// Media validation
const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
  "video/mp4",
  "video/webm",
  "audio/mpeg",
  "audio/ogg",
  "audio/wav",
  "application/pdf",
];

const MAX_SIZE = 20 * 1024 * 1024;

export function validateMediaType(contentType: string): boolean {
  return ALLOWED_TYPES.includes(contentType);
}

export function validateMediaSize(size: number): boolean {
  return size <= MAX_SIZE;
}

export function getMediaTypeGroup(contentType: string): string {
  if (contentType.startsWith("image/")) return "image";
  if (contentType.startsWith("video/")) return "video";
  if (contentType.startsWith("audio/")) return "audio";
  if (contentType === "application/pdf") return "pdf";
  return "other";
}

export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `RYV-${timestamp}-${random}`;
}

export function formatPrice(
  price: string | number,
  currency: string = "DZD"
): string {
  const num = typeof price === "string" ? parseFloat(price) : price;

  return (
    new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num) +
    " " +
    currency
  );
}

export const paymentMethodLabels: Record<string, string> = {
  COD: "Cash on Delivery",
  CIB: "CIB",
  Edahabia: "Edahabia",
  BaridiMob: "BaridiMob",
  Card: "Card",
};

export const orderStatuses = [
  "Pending",
  "Confirmed",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
] as const;

export const paymentStatuses = [
  "Pending",
  "Paid",
  "Failed",
  "Refunded",
] as const;

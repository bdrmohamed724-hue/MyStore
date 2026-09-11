import {
  integer,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
  boolean,
  index,
} from "drizzle-orm/pg-core";

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  tagline: text("tagline").notNull().default(""),
  description: text("description").notNull().default(""),
  price: integer("price").notNull(),
  compareAtPrice: integer("compare_at_price"),
  category: text("category").notNull(),
  collection: text("collection").notNull().default(""),
  images: jsonb("images").$type<string[]>().notNull().default([]),
  sizes: jsonb("sizes").$type<string[]>().notNull().default([]),
  colors: jsonb("colors").$type<string[]>().notNull().default([]),
  details: jsonb("details").$type<string[]>().notNull().default([]),
  featured: boolean("featured").notNull().default(false),
  isNew: boolean("is_new").notNull().default(false),
  bestSeller: boolean("best_seller").notNull().default(false),
  stock: integer("stock").notNull().default(50),
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (table) => [
  index("products_category_idx").on(table.category),
  index("products_collection_idx").on(table.collection),
  index("products_slug_idx").on(table.slug),
  index("products_featured_idx").on(table.featured),
  index("products_isNew_idx").on(table.isNew),
  index("products_bestSeller_idx").on(table.bestSeller),
]);

export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  productId: integer("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  author: text("author").notNull(),
  rating: integer("rating").notNull(),
  title: text("title").notNull().default(""),
  body: text("body").notNull().default(""),
  verified: boolean("verified").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (table) => [
  index("reviews_productId_idx").on(table.productId),
  index("reviews_rating_idx").on(table.rating),
]);

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  orderNumber: text("order_number").notNull().unique(),
  email: text("email").notNull(),
  fullName: text("full_name").notNull(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  postalCode: text("postal_code").notNull(),
  country: text("country").notNull(),
  subtotal: integer("subtotal").notNull(),
  shipping: integer("shipping").notNull().default(0),
  total: integer("total").notNull(),
  items: jsonb("items").$type<OrderItem[]>().notNull().default([]),
  status: text("status").notNull().default("confirmed"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (table) => [
  index("orders_email_idx").on(table.email),
  index("orders_status_idx").on(table.status),
  index("orders_createdAt_idx").on(table.createdAt),
]);

export type OrderItem = {
  productId: number;
  slug: string;
  name: string;
  price: number;
  quantity: number;
  size: string;
  color: string;
  image: string;
};

export type Product = typeof products.$inferSelect;
export type Review = typeof reviews.$inferSelect;
export type Order = typeof orders.$inferSelect;

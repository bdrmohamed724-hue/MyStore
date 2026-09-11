import {
  pgTable,
  uuid,
  text,
  integer,
  boolean,
  timestamp,
  varchar,
  numeric,
  index,
  uniqueIndex,
  jsonb,
} from "drizzle-orm/pg-core";

// ─── Admin Users ───
export const adminUsers = pgTable("admin_users", {
  id: uuid("id").defaultRandom().primaryKey(),
  username: varchar("username", { length: 100 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─── Categories ───
export const categories = pgTable("categories", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  imageUrl: text("image_url"),
  visible: boolean("visible").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─── Products ───
export const products = pgTable("products", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  stock: integer("stock").default(0).notNull(),
  imageUrl: text("image_url"),
  categoryId: uuid("category_id"),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => [
  index("products_category_idx").on(table.categoryId),
]);

// ─── Customers ───
export const customers = pgTable("customers", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 50 }),
  wilaya: varchar("wilaya", { length: 100 }),
  city: varchar("city", { length: 100 }),
  address: text("address"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("customers_email_idx").on(table.email),
]);

// ─── Orders ───
export const orders = pgTable("orders", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderNumber: varchar("order_number", { length: 50 }).notNull().unique(),
  customerId: uuid("customer_id").notNull(),
  status: varchar("status", { length: 20 }).default("Pending").notNull(),
  paymentMethod: varchar("payment_method", { length: 30 }).notNull(),
  paymentStatus: varchar("payment_status", { length: 20 }).default("Pending").notNull(),
  subtotal: numeric("subtotal", { precision: 10, scale: 2 }).notNull(),
  deliveryFee: numeric("delivery_fee", { precision: 10, scale: 2 }).notNull(),
  total: numeric("total", { precision: 10, scale: 2 }).notNull(),
  deliveryZoneId: uuid("delivery_zone_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => [
  index("orders_customer_idx").on(table.customerId),
  index("orders_status_idx").on(table.status),
]);

// ─── Order Items ───
export const orderItems = pgTable("order_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderId: uuid("order_id").notNull(),
  productId: uuid("product_id").notNull(),
  productName: varchar("product_name", { length: 255 }).notNull(),
  quantity: integer("quantity").notNull(),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
}, (table) => [
  index("order_items_order_idx").on(table.orderId),
]);

// ─── Delivery Zones / Wilayas ───
export const deliveryZones = pgTable("delivery_zones", {
  id: uuid("id").defaultRandom().primaryKey(),

  // Internal name
  name: varchar("name", { length: 255 }).notNull(),

  // Delivery price
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),

  // Estimated delivery time
  estimatedTime: varchar("estimated_time", { length: 100 }),

  // Whether this Wilaya is active
  enabled: boolean("enabled").default(true).notNull(),

  // Algeria Wilaya code
  wilayaCode: integer("wilaya_code"),

  // Wilaya name
  wilayaName: varchar("wilaya_name", { length: 255 }),

  // Available communes
  communes: jsonb("communes").$type<string[]>().notNull().default([]),
});

// ─── Media ───
export const media = pgTable("media", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  type: varchar("type", { length: 50 }).notNull(),
  url: text("url").notNull(),
  size: integer("size").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─── Store Settings ───
export const storeSettings = pgTable("store_settings", {
  id: uuid("id").defaultRandom().primaryKey(),
  storeName: varchar("store_name", { length: 255 }).default("RYVEN DEPT.").notNull(),
  currency: varchar("currency", { length: 10 }).default("DZD").notNull(),
  defaultLanguage: varchar("default_language", { length: 5 }).default("en").notNull(),
  darkMode: boolean("dark_mode").default(true).notNull(),
  musicEnabled: boolean("music_enabled").default(false).notNull(),
  musicUrl: text("music_url"),
  socialEnabled: boolean("social_enabled").default(true).notNull(),
  instagramUrl: text("instagram_url"),
  facebookUrl: text("facebook_url"),
  tiktokUrl: text("tiktok_url"),
  youtubeUrl: text("youtube_url"),
  codEnabled: boolean("cod_enabled").default(true).notNull(),
  cibEnabled: boolean("cib_enabled").default(true).notNull(),
  edahabiaEnabled: boolean("edahabia_enabled").default(true).notNull(),
  baridiMobEnabled: boolean("baridi_mob_enabled").default(true).notNull(),
  cardEnabled: boolean("card_enabled").default(true).notNull(),
});

// ─── Store Sections (Homepage Builder) ───
export const storeSections = pgTable("store_sections", {
  id: uuid("id").defaultRandom().primaryKey(),
  sectionKey: varchar("section_key", { length: 100 }).notNull(),
  title: varchar("title", { length: 255 }),
  type: varchar("type", { length: 30 }).notNull(),
  subtitle: text("subtitle"),
  imageUrl: text("image_url"),
  buttonText: varchar("button_text", { length: 100 }),
  buttonUrl: varchar("button_url", { length: 500 }),
  visible: boolean("visible").default(true).notNull(),
  position: integer("position").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

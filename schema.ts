import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const categories = mysqlTable("categories", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 96 }).notNull().unique(),
  name: varchar("name", { length: 128 }).notNull(),
  sortOrder: int("sortOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const products = mysqlTable("products", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 128 }).notNull().unique(),
  name: varchar("name", { length: 180 }).notNull(),
  description: text("description").notNull(),
  categoryId: int("categoryId"),
  kind: mysqlEnum("kind", ["physical", "digital"]).notNull(),
  price: int("price").notNull(),
  compareAt: int("compareAt"),
  rating: int("rating").default(0).notNull(),
  reviewCount: int("reviewCount").default(0).notNull(),
  published: int("published").default(1).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const productMedia = mysqlTable("productMedia", {
  id: int("id").autoincrement().primaryKey(),
  productId: int("productId").notNull(),
  url: text("url").notNull(),
  alt: varchar("alt", { length: 255 }).notNull(),
  sortOrder: int("sortOrder").default(0).notNull(),
});

export const inventory = mysqlTable("inventory", {
  id: int("id").autoincrement().primaryKey(),
  productId: int("productId").notNull().unique(),
  available: int("available").default(0).notNull(),
  lowStockAt: int("lowStockAt").default(5).notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const campaigns = mysqlTable("campaigns", {
  id: int("id").autoincrement().primaryKey(),
  code: varchar("code", { length: 64 }).notNull().unique(),
  title: varchar("title", { length: 180 }).notNull(),
  copy: text("copy").notNull(),
  discountPercent: int("discountPercent").default(0).notNull(),
  status: mysqlEnum("status", ["draft", "scheduled", "live", "ended"]).default("draft").notNull(),
  startsAt: timestamp("startsAt"),
  endsAt: timestamp("endsAt"),
});

export const coupons = mysqlTable("coupons", {
  id: int("id").autoincrement().primaryKey(),
  code: varchar("code", { length: 64 }).notNull().unique(),
  discountPercent: int("discountPercent").default(0).notNull(),
  maxUses: int("maxUses"),
  usedCount: int("usedCount").default(0).notNull(),
  active: int("active").default(1).notNull(),
});

export const carts = mysqlTable("carts", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId"),
  sessionKey: varchar("sessionKey", { length: 128 }),
  couponCode: varchar("couponCode", { length: 64 }),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const cartItems = mysqlTable("cartItems", {
  id: int("id").autoincrement().primaryKey(),
  cartId: int("cartId").notNull(),
  productId: int("productId").notNull(),
  quantity: int("quantity").default(1).notNull(),
});

export const wishlists = mysqlTable("wishlists", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  productId: int("productId").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const comparisons = mysqlTable("comparisons", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  productId: int("productId").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const addresses = mysqlTable("addresses", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  label: varchar("label", { length: 64 }).default("Home").notNull(),
  recipient: varchar("recipient", { length: 180 }).notNull(),
  phone: varchar("phone", { length: 32 }).notNull(),
  area: varchar("area", { length: 96 }).notNull(),
  addressLine: text("addressLine").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const orders = mysqlTable("orders", {
  id: int("id").autoincrement().primaryKey(),
  orderCode: varchar("orderCode", { length: 32 }).notNull().unique(),
  userId: int("userId"),
  status: mysqlEnum("status", ["review", "approved", "dispatch", "delivered", "returned", "refunded"]).default("review").notNull(),
  subtotal: int("subtotal").notNull(),
  discount: int("discount").default(0).notNull(),
  delivery: int("delivery").default(0).notNull(),
  total: int("total").notNull(),
  customerName: varchar("customerName", { length: 180 }).notNull(),
  customerPhone: varchar("customerPhone", { length: 32 }).notNull(),
  addressLine: text("addressLine").notNull(),
  area: varchar("area", { length: 96 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const orderItems = mysqlTable("orderItems", {
  id: int("id").autoincrement().primaryKey(),
  orderId: int("orderId").notNull(),
  productId: int("productId").notNull(),
  productName: varchar("productName", { length: 180 }).notNull(),
  kind: mysqlEnum("kind", ["physical", "digital"]).notNull(),
  price: int("price").notNull(),
  quantity: int("quantity").default(1).notNull(),
  downloadUrl: text("downloadUrl"),
});

export const reviews = mysqlTable("reviews", {
  id: int("id").autoincrement().primaryKey(),
  productId: int("productId").notNull(),
  userId: int("userId").notNull(),
  rating: int("rating").notNull(),
  body: text("body").notNull(),
  verified: int("verified").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const notifications = mysqlTable("notifications", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  title: varchar("title", { length: 180 }).notNull(),
  body: text("body").notNull(),
  readAt: timestamp("readAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Product = typeof products.$inferSelect;
export type InsertProduct = typeof products.$inferInsert;

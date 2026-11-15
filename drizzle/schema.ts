import { boolean, int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

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
  role: mysqlEnum("role", ["user", "coordinator", "admin"]).default("user").notNull(),
  partnerVerified: boolean("partnerVerified").default(false).notNull(),
  partnerRegions: varchar("partnerRegions", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const liveEnquiries = mysqlTable("liveEnquiries", {
  id: int("id").autoincrement().primaryKey(),
  requesterName: varchar("requesterName", { length: 160 }).notNull(),
  locality: varchar("locality", { length: 160 }).notNull(),
  phone: varchar("phone", { length: 40 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  urgency: varchar("urgency", { length: 80 }).notNull(),
  preferred: mysqlEnum("preferred", ["Phone", "Email", "Either"]).default("Either").notNull(),
  context: text("context").notNull(),
  region: mysqlEnum("region", ["Mumbai", "Thane"]).notNull(),
  status: mysqlEnum("status", ["new", "reviewing", "referred", "closed"]).default("new").notNull(),
  assignedTo: int("assignedTo"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type LiveEnquiry = typeof liveEnquiries.$inferSelect;
export type InsertLiveEnquiry = typeof liveEnquiries.$inferInsert;

import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  date,
  integer,
  decimal,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 255 }).unique().notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  password: varchar("password", { length: 255 }).notNull(),
  role: varchar("role", { length: 50 }).notNull().default("member"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const customers = pgTable("customers", {
  id: uuid("id").primaryKey().defaultRandom(),
  lineUserId: varchar("line_user_id", { length: 255 }).notNull(),
  lineName: varchar("line_name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }),
  segment: varchar("segment", { length: 50 }).notNull().default("new"),
  registeredAt: timestamp("registered_at").defaultNow().notNull(),
  lastActiveAt: timestamp("last_active_at").defaultNow().notNull(),
});

export const activityLogs = pgTable("activity_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  type: varchar("type", { length: 50 }).notNull(),
  message: varchar("message", { length: 500 }).notNull(),
  customerId: uuid("customer_id").references(() => customers.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const dashboardStats = pgTable("dashboard_stats", {
  id: uuid("id").primaryKey().defaultRandom(),
  date: date("date").notNull(),
  lineFriends: integer("line_friends").notNull().default(0),
  openRate: decimal("open_rate", { precision: 5, scale: 2 })
    .notNull()
    .default("0"),
  vocCount: integer("voc_count").notNull().default(0),
  campaignsSent: integer("campaigns_sent").notNull().default(0),
});

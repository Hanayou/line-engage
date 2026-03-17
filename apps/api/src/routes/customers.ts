import { Hono } from "hono";
import { db } from "../db/client";
import { customers } from "../db/schema";
import { desc, ilike, or, sql, eq, count } from "drizzle-orm";
import { DEFAULT_PAGE_SIZE } from "@line-engage/shared";

export const customerRoutes = new Hono();

// Paginated list with search
customerRoutes.get("/", async (c) => {
  const page = Math.max(1, Number(c.req.query("page") || 1));
  const limit = Math.min(100, Math.max(1, Number(c.req.query("limit") || DEFAULT_PAGE_SIZE)));
  const search = c.req.query("search") || "";
  const offset = (page - 1) * limit;

  const whereClause = search
    ? or(
        ilike(customers.lineName, `%${search}%`),
        ilike(customers.email, `%${search}%`)
      )
    : undefined;

  const [totalResult] = await db
    .select({ count: count() })
    .from(customers)
    .where(whereClause);

  const total = totalResult.count;

  const rows = await db
    .select()
    .from(customers)
    .where(whereClause)
    .orderBy(desc(customers.lastActiveAt))
    .limit(limit)
    .offset(offset);

  const data = rows.map((row) => ({
    id: row.id,
    lineUserId: row.lineUserId,
    lineName: row.lineName,
    email: row.email,
    segment: row.segment,
    registeredAt: row.registeredAt.toISOString(),
    lastActiveAt: row.lastActiveAt.toISOString(),
  }));

  return c.json({
    data,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  });
});

// Single customer
customerRoutes.get("/:id", async (c) => {
  const id = c.req.param("id");

  const [customer] = await db
    .select()
    .from(customers)
    .where(eq(customers.id, id))
    .limit(1);

  if (!customer) {
    return c.json({ error: "Customer not found" }, 404);
  }

  return c.json({
    ...customer,
    registeredAt: customer.registeredAt.toISOString(),
    lastActiveAt: customer.lastActiveAt.toISOString(),
  });
});

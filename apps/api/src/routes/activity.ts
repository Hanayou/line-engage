import { Hono } from "hono";
import { db } from "../db/client";
import { activityLogs } from "../db/schema";
import { desc } from "drizzle-orm";

export const activityRoutes = new Hono();

activityRoutes.get("/", async (c) => {
  const limit = Math.min(50, Math.max(1, Number(c.req.query("limit") || 10)));

  const rows = await db
    .select()
    .from(activityLogs)
    .orderBy(desc(activityLogs.createdAt))
    .limit(limit);

  const data = rows.map((row) => ({
    id: row.id,
    type: row.type,
    message: row.message,
    customerId: row.customerId,
    createdAt: row.createdAt.toISOString(),
  }));

  return c.json(data);
});

import { Hono } from "hono";
import { db } from "../db/client";
import { dashboardStats } from "../db/schema";
import { desc, sql } from "drizzle-orm";

export const dashboardRoutes = new Hono();

// Latest aggregate stats
dashboardRoutes.get("/stats", async (c) => {
  // Get the most recent day's stats
  const [latest] = await db
    .select()
    .from(dashboardStats)
    .orderBy(desc(dashboardStats.date))
    .limit(1);

  // Get stats from 7 days ago for delta calculation
  const [weekAgo] = await db
    .select()
    .from(dashboardStats)
    .orderBy(desc(dashboardStats.date))
    .offset(7)
    .limit(1);

  if (!latest) {
    return c.json({ error: "No stats available" }, 404);
  }

  const friendsDelta = weekAgo
    ? latest.lineFriends - weekAgo.lineFriends
    : 0;
  const openRateDelta = weekAgo
    ? Number(latest.openRate) - Number(weekAgo.openRate)
    : 0;

  return c.json({
    lineFriends: latest.lineFriends,
    openRate: Number(latest.openRate),
    vocCount: latest.vocCount,
    campaignsSent: latest.campaignsSent,
    lineFriendsDelta: friendsDelta,
    openRateDelta: Math.round(openRateDelta * 100) / 100,
  });
});

// Weekly trend (last 7 days)
dashboardRoutes.get("/trend", async (c) => {
  const rows = await db
    .select({
      date: dashboardStats.date,
      friends: dashboardStats.lineFriends,
      interactions: sql<number>`${dashboardStats.vocCount} + ${dashboardStats.campaignsSent}`,
    })
    .from(dashboardStats)
    .orderBy(desc(dashboardStats.date))
    .limit(7);

  return c.json(rows.reverse());
});

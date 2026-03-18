import { Hono } from "hono";
import { db } from "../db/client";
import { activityLogs } from "../db/schema";

export const feedbackRoutes = new Hono();

feedbackRoutes.post("/", async (c) => {
  const body = await c.req.json();
  const { lineUserId, rating, comment } = body;

  // Validate required fields
  if (!lineUserId || typeof lineUserId !== "string") {
    return c.json({ message: "lineUserId is required" }, 400);
  }

  if (typeof rating !== "number" || rating < 1 || rating > 5) {
    return c.json({ message: "rating must be a number between 1 and 5" }, 400);
  }

  if (comment !== undefined && (typeof comment !== "string" || comment.length > 500)) {
    return c.json({ message: "comment must be a string with max 500 characters" }, 400);
  }

  const message = `Feedback from ${lineUserId.slice(0, 8)}...: ${rating}/5${comment ? ` — "${comment.slice(0, 100)}"` : ""}`;

  const [row] = await db
    .insert(activityLogs)
    .values({
      type: "feedback",
      message,
    })
    .returning({ id: activityLogs.id });

  return c.json({ success: true, id: row.id });
});

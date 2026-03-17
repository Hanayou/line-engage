import { Hono } from "hono";
import { db } from "../db/client";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";
import { compareSync } from "bcryptjs";

export const authRoutes = new Hono();

authRoutes.post("/verify", async (c) => {
  const { email, password } = await c.req.json<{
    email: string;
    password: string;
  }>();

  if (!email || !password) {
    return c.json({ error: "Email and password are required" }, 400);
  }

  const [user] = await db
    .select({
      id: users.id,
      email: users.email,
      name: users.name,
      role: users.role,
    })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (!user) {
    return c.json({ error: "Invalid credentials" }, 401);
  }

  // Fetch password separately for comparison
  const [userWithPassword] = await db
    .select({ password: users.password })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (!compareSync(password, userWithPassword.password)) {
    return c.json({ error: "Invalid credentials" }, 401);
  }

  return c.json({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  });
});

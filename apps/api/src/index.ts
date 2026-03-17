import "dotenv/config";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { APP_NAME, APP_VERSION } from "@line-engage/shared";
import { requestId } from "./middleware/request-id";
import { requestLogger } from "./middleware/logger";
import { errorHandler } from "./middleware/error-handler";
import { authRoutes } from "./routes/auth";
import { dashboardRoutes } from "./routes/dashboard";
import { customerRoutes } from "./routes/customers";
import { activityRoutes } from "./routes/activity";
import { logger } from "./lib/logger";

const app = new Hono();

// ── Global middleware ─────────────────────────────────
app.use("*", cors({
  origin: process.env.CORS_ORIGIN || "http://localhost:3000",
  credentials: true,
}));
app.use("*", requestId);
app.use("*", requestLogger);
app.onError(errorHandler);

// ── Health check ──────────────────────────────────────
app.get("/health", (c) =>
  c.json({
    status: "ok",
    service: APP_NAME,
    version: APP_VERSION,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  })
);

// ── API routes ────────────────────────────────────────
const api = new Hono();
api.route("/auth", authRoutes);
api.route("/dashboard", dashboardRoutes);
api.route("/customers", customerRoutes);
api.route("/activity", activityRoutes);

app.route("/api/v1", api);

// ── Start server ──────────────────────────────────────
const port = Number(process.env.PORT || 8787);

serve({ fetch: app.fetch, port }, () => {
  logger.info("server_started", { port, version: APP_VERSION });
});

export default app;

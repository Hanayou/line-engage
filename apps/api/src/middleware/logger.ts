import { createMiddleware } from "hono/factory";
import { logger } from "../lib/logger";

export const requestLogger = createMiddleware(async (c, next) => {
  const start = Date.now();
  const method = c.req.method;
  const path = c.req.path;

  await next();

  const duration = Date.now() - start;
  const status = c.res.status;
  const requestId = c.get("requestId") as string | undefined;

  logger.info("request", {
    method,
    path,
    status,
    duration_ms: duration,
    request_id: requestId,
  });
});

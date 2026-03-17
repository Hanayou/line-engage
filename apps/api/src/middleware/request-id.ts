import { createMiddleware } from "hono/factory";
import { v4 as uuid } from "uuid";

export const requestId = createMiddleware(async (c, next) => {
  const id = c.req.header("x-request-id") || uuid();
  c.set("requestId", id);
  c.header("X-Request-Id", id);
  await next();
});

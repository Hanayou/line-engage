import { ErrorHandler } from "hono";
import { logger } from "../lib/logger";

export const errorHandler: ErrorHandler = (err, c) => {
  const requestId = c.get("requestId") as string | undefined;
  const status = "status" in err && typeof err.status === "number" ? err.status : 500;

  logger.error("unhandled_error", {
    error: err.message,
    stack: err.stack,
    request_id: requestId,
    path: c.req.path,
  });

  return c.json(
    {
      error: status >= 500 ? "Internal Server Error" : err.message,
      message: status >= 500 ? "An unexpected error occurred" : err.message,
      requestId,
    },
    status as any
  );
};

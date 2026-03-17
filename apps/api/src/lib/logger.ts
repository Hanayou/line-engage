type LogLevel = "info" | "warn" | "error" | "debug";

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  [key: string]: unknown;
}

function formatEntry(level: LogLevel, message: string, meta?: Record<string, unknown>): string {
  const entry: LogEntry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...meta,
  };
  return JSON.stringify(entry);
}

export const logger = {
  info: (message: string, meta?: Record<string, unknown>) =>
    console.log(formatEntry("info", message, meta)),
  warn: (message: string, meta?: Record<string, unknown>) =>
    console.warn(formatEntry("warn", message, meta)),
  error: (message: string, meta?: Record<string, unknown>) =>
    console.error(formatEntry("error", message, meta)),
  debug: (message: string, meta?: Record<string, unknown>) =>
    console.debug(formatEntry("debug", message, meta)),
};

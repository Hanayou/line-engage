import { z } from "zod";

// ─── Customer ────────────────────────────────────────────
export const CustomerSegment = z.enum(["vip", "regular", "new"]);
export type CustomerSegment = z.infer<typeof CustomerSegment>;

export const CustomerSchema = z.object({
  id: z.string().uuid(),
  lineUserId: z.string(),
  lineName: z.string(),
  email: z.string().email().nullable(),
  segment: CustomerSegment,
  registeredAt: z.string().datetime(),
  lastActiveAt: z.string().datetime(),
});
export type Customer = z.infer<typeof CustomerSchema>;

// ─── Dashboard Stats ─────────────────────────────────────
export const DashboardStatsSchema = z.object({
  lineFriends: z.number(),
  openRate: z.number(),
  vocCount: z.number(),
  campaignsSent: z.number(),
  lineFriendsDelta: z.number(),
  openRateDelta: z.number(),
});
export type DashboardStats = z.infer<typeof DashboardStatsSchema>;

// ─── Activity Log ────────────────────────────────────────
export const ActivityTypeSchema = z.enum([
  "feedback",
  "campaign",
  "registration",
]);
export type ActivityType = z.infer<typeof ActivityTypeSchema>;

export const ActivityLogSchema = z.object({
  id: z.string().uuid(),
  type: ActivityTypeSchema,
  message: z.string(),
  customerId: z.string().uuid().nullable(),
  createdAt: z.string().datetime(),
});
export type ActivityLog = z.infer<typeof ActivityLogSchema>;

// ─── API Responses ───────────────────────────────────────
export const PaginatedResponseSchema = <T extends z.ZodType>(itemSchema: T) =>
  z.object({
    data: z.array(itemSchema),
    total: z.number(),
    page: z.number(),
    limit: z.number(),
    totalPages: z.number(),
  });

export type PaginatedResponse<T> = {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export const ApiErrorSchema = z.object({
  error: z.string(),
  message: z.string(),
  requestId: z.string().optional(),
});
export type ApiError = z.infer<typeof ApiErrorSchema>;

// ─── Weekly Trend ────────────────────────────────────────
export const WeeklyTrendPointSchema = z.object({
  date: z.string(),
  friends: z.number(),
  interactions: z.number(),
});
export type WeeklyTrendPoint = z.infer<typeof WeeklyTrendPointSchema>;

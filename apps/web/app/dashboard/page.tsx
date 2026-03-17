import {
  Users,
  Mail,
  MessageSquare,
  Send,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { apiFetch } from "@/lib/api";
import type { DashboardStats, ActivityLog, WeeklyTrendPoint } from "@line-engage/shared";

async function getStats(): Promise<DashboardStats> {
  try {
    return await apiFetch("/api/v1/dashboard/stats");
  } catch {
    return {
      lineFriends: 2847,
      openRate: 67.3,
      vocCount: 8,
      campaignsSent: 2,
      lineFriendsDelta: 42,
      openRateDelta: 2.1,
    };
  }
}

async function getTrend(): Promise<WeeklyTrendPoint[]> {
  try {
    return await apiFetch("/api/v1/dashboard/trend");
  } catch {
    return [];
  }
}

async function getActivity(): Promise<ActivityLog[]> {
  try {
    return await apiFetch("/api/v1/activity?limit=8");
  } catch {
    return [];
  }
}

function StatCard({
  label,
  value,
  delta,
  deltaLabel,
  icon: Icon,
  color,
}: {
  label: string;
  value: string;
  delta?: number;
  deltaLabel?: string;
  icon: any;
  color: string;
}) {
  const isPositive = (delta ?? 0) >= 0;
  return (
    <div className="stat-card">
      <div className="flex items-start justify-between mb-3">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${color}15` }}
        >
          <Icon size={20} style={{ color }} />
        </div>
        {delta !== undefined && (
          <div
            className={`flex items-center gap-1 text-xs font-medium ${isPositive ? "text-emerald-600" : "text-red-500"}`}
          >
            {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            {isPositive ? "+" : ""}
            {delta}
            {deltaLabel}
          </div>
        )}
      </div>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
      <div className="text-sm text-gray-500 mt-0.5">{label}</div>
    </div>
  );
}

function TrendBar({ point, maxInteractions }: { point: WeeklyTrendPoint; maxInteractions: number }) {
  const height = maxInteractions > 0 ? (point.interactions / maxInteractions) * 100 : 0;
  const dayLabel = new Date(point.date).toLocaleDateString("en", { weekday: "short" });
  return (
    <div className="flex flex-col items-center gap-2 flex-1">
      <div className="w-full h-28 flex items-end justify-center">
        <div
          className="w-8 rounded-t-md bg-line-green/80 hover:bg-line-green transition-colors"
          style={{ height: `${Math.max(height, 4)}%` }}
          title={`${point.interactions} interactions`}
        />
      </div>
      <span className="text-xs text-gray-400">{dayLabel}</span>
    </div>
  );
}

function ActivityItem({ log }: { log: ActivityLog }) {
  const typeColors: Record<string, string> = {
    feedback: "bg-blue-500",
    campaign: "bg-amber-500",
    registration: "bg-emerald-500",
  };
  const timeAgo = getTimeAgo(log.createdAt);

  return (
    <div className="flex items-start gap-3 py-3">
      <div
        className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${typeColors[log.type] || "bg-gray-400"}`}
      />
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-700 leading-relaxed">{log.message}</p>
        <p className="text-xs text-gray-400 mt-0.5">{timeAgo}</p>
      </div>
    </div>
  );
}

function getTimeAgo(isoDate: string): string {
  const diff = Date.now() - new Date(isoDate).getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default async function DashboardPage() {
  const [stats, trend, activity] = await Promise.all([
    getStats(),
    getTrend(),
    getActivity(),
  ]);

  const maxInteractions = Math.max(...trend.map((t) => t.interactions), 1);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">
          Overview of your LINE engagement metrics
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="LINE Friends"
          value={stats.lineFriends.toLocaleString()}
          delta={stats.lineFriendsDelta}
          deltaLabel=" this week"
          icon={Users}
          color="#06C755"
        />
        <StatCard
          label="Message Open Rate"
          value={`${stats.openRate.toFixed(1)}%`}
          delta={stats.openRateDelta}
          deltaLabel="%"
          icon={Mail}
          color="#3b82f6"
        />
        <StatCard
          label="VoC Submissions"
          value={stats.vocCount.toString()}
          icon={MessageSquare}
          color="#8b5cf6"
        />
        <StatCard
          label="Campaigns Sent"
          value={stats.campaignsSent.toString()}
          icon={Send}
          color="#f59e0b"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly trend */}
        <div className="lg:col-span-2 rounded-xl bg-white p-5 shadow-sm border border-gray-100">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">
            Weekly Engagement
          </h2>
          {trend.length > 0 ? (
            <div className="flex gap-1">
              {trend.map((point) => (
                <TrendBar
                  key={point.date}
                  point={point}
                  maxInteractions={maxInteractions}
                />
              ))}
            </div>
          ) : (
            <div className="h-28 flex items-center justify-center text-sm text-gray-400">
              No trend data available — start the API to see live data
            </div>
          )}
        </div>

        {/* Activity feed */}
        <div className="rounded-xl bg-white p-5 shadow-sm border border-gray-100">
          <h2 className="text-sm font-semibold text-gray-900 mb-2">
            Recent Activity
          </h2>
          {activity.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {activity.slice(0, 8).map((log) => (
                <ActivityItem key={log.id} log={log} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400 py-8 text-center">
              No activity yet
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

import {
  ExternalLink,
  Globe,
  MessageSquare,
  Users,
  Clock,
  BarChart3,
} from "lucide-react";
import { apiFetch } from "../../../lib/api";

type ActivityLog = {
  id: string;
  type: string;
  message: string;
  createdAt: string;
};

async function getRecentFeedback(): Promise<ActivityLog[]> {
  try {
    const logs = await apiFetch<ActivityLog[]>("/api/v1/activity?limit=20");
    return logs.filter((log) => log.type === "feedback").slice(0, 5);
  } catch {
    return [];
  }
}

export default async function LinePage() {
  const feedback = await getRecentFeedback();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          LINE Channel Management
        </h1>
        <p className="text-gray-500 mt-1">
          Manage your LINE Mini App channel configuration and monitor usage
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Channel Overview */}
        <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
          <h2 className="text-base font-semibold text-gray-900 mb-5">
            Channel Overview
          </h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <span className="text-sm text-gray-600">Channel Type</span>
              <span className="text-sm font-medium text-gray-900">
                LINE Mini App
              </span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <span className="text-sm text-gray-600">Status</span>
              <span className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-600">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Active
              </span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <span className="text-sm text-gray-600">LIFF ID</span>
              <code className="text-sm font-mono text-gray-700 bg-gray-100 px-2 py-0.5 rounded">
                1234567890-abcdefgh
              </code>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <span className="text-sm text-gray-600">LIFF URL</span>
              <code className="text-xs font-mono text-gray-500">
                https://liff.line.me/1234567890-abcdefgh
              </code>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <span className="text-sm text-gray-600">Endpoint URL</span>
              <code className="text-xs font-mono text-gray-500">
                https://liff.line-engage.dev
              </code>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <span className="text-sm text-gray-600">Webhook URL</span>
              <code className="text-xs font-mono text-gray-500">
                https://api.line-engage.dev/webhook
              </code>
            </div>
            <div className="flex items-center justify-between py-3">
              <span className="text-sm text-gray-600">Verification</span>
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700">
                Unverified
              </span>
            </div>
          </div>
        </div>

        {/* Mini App Analytics */}
        <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
          <h2 className="text-base font-semibold text-gray-900 mb-5">
            Mini App Analytics
          </h2>
          <p className="text-xs text-gray-400 -mt-4 mb-5">This week</p>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg bg-gray-50 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Globe size={16} className="text-gray-400" />
                <span className="text-xs text-gray-500">Total Opens</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">1,247</p>
            </div>
            <div className="rounded-lg bg-gray-50 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Users size={16} className="text-gray-400" />
                <span className="text-xs text-gray-500">Unique Users</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">892</p>
            </div>
            <div className="rounded-lg bg-gray-50 p-4">
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare size={16} className="text-gray-400" />
                <span className="text-xs text-gray-500">Feedback</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">34</p>
            </div>
            <div className="rounded-lg bg-gray-50 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock size={16} className="text-gray-400" />
                <span className="text-xs text-gray-500">Avg Session</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">2m 15s</p>
            </div>
          </div>
        </div>

        {/* Recent Feedback */}
        <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-5">
            <BarChart3 size={18} className="text-gray-400" />
            <h2 className="text-base font-semibold text-gray-900">
              Recent Feedback
            </h2>
          </div>

          {feedback.length === 0 ? (
            <p className="text-sm text-gray-400 py-4 text-center">
              No feedback submissions yet
            </p>
          ) : (
            <div className="space-y-3">
              {feedback.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start gap-3 rounded-lg bg-gray-50 p-3"
                >
                  <MessageSquare
                    size={14}
                    className="mt-0.5 shrink-0 text-gray-400"
                  />
                  <div className="min-w-0">
                    <p className="text-sm text-gray-700 break-words">
                      {item.message}
                    </p>
                    <p className="mt-1 text-xs text-gray-400">
                      {new Date(item.createdAt).toLocaleString("ja-JP")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Links */}
        <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
          <h2 className="text-base font-semibold text-gray-900 mb-5">
            Quick Links
          </h2>

          <div className="space-y-3">
            <a
              href="http://localhost:3001"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between rounded-lg border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Open Mini App (Dev)
              <ExternalLink size={14} className="text-gray-400" />
            </a>
            <a
              href="https://developers.line.biz/console/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between rounded-lg border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              LINE Developers Console
              <ExternalLink size={14} className="text-gray-400" />
            </a>
            <a
              href="https://developers.line.biz/en/docs/liff/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between rounded-lg border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              View Integration Docs
              <ExternalLink size={14} className="text-gray-400" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

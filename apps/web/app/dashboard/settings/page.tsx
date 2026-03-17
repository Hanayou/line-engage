"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Copy, Check, Eye, EyeOff } from "lucide-react";

export default function SettingsPage() {
  const { data: session } = useSession();
  const [copied, setCopied] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [notifications, setNotifications] = useState({
    newCustomer: true,
    vocSubmission: true,
    campaignComplete: false,
    weeklyReport: true,
  });

  const mockApiKey = "le_live_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6";

  function handleCopy() {
    navigator.clipboard.writeText(mockApiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function toggleNotification(key: keyof typeof notifications) {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 mt-1">Manage your account and preferences</p>
      </div>

      <div className="max-w-2xl space-y-6">
        {/* Profile */}
        <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
          <h2 className="text-base font-semibold text-gray-900 mb-5">
            Profile
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Name
              </label>
              <input
                type="text"
                defaultValue={session?.user?.name || ""}
                className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm focus:border-line-green focus:outline-none focus:ring-2 focus:ring-line-green/20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Email
              </label>
              <input
                type="email"
                defaultValue={session?.user?.email || ""}
                disabled
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Role
              </label>
              <input
                type="text"
                defaultValue="Admin"
                disabled
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-500"
              />
            </div>
            <button className="rounded-lg bg-line-green px-4 py-2 text-sm font-semibold text-white hover:bg-line-green-hover transition-colors">
              Save Changes
            </button>
          </div>
        </div>

        {/* Notifications */}
        <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
          <h2 className="text-base font-semibold text-gray-900 mb-5">
            Notifications
          </h2>
          <div className="space-y-3">
            {[
              {
                key: "newCustomer" as const,
                label: "New customer registration",
                desc: "Get notified when a new LINE user connects",
              },
              {
                key: "vocSubmission" as const,
                label: "VoC submission",
                desc: "Alerts for new customer feedback",
              },
              {
                key: "campaignComplete" as const,
                label: "Campaign completion",
                desc: "Notification when a campaign finishes sending",
              },
              {
                key: "weeklyReport" as const,
                label: "Weekly report",
                desc: "Summary of engagement metrics every Monday",
              },
            ].map((item) => (
              <div
                key={item.key}
                className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0"
              >
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    {item.label}
                  </div>
                  <div className="text-xs text-gray-500">{item.desc}</div>
                </div>
                <button
                  onClick={() => toggleNotification(item.key)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    notifications[item.key] ? "bg-line-green" : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                      notifications[item.key]
                        ? "translate-x-6"
                        : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* API Key */}
        <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
          <h2 className="text-base font-semibold text-gray-900 mb-1">
            API Key
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            Use this key to authenticate requests to the LINE Engage API.
          </p>
          <div className="flex items-center gap-2">
            <div className="flex-1 rounded-lg border border-gray-300 bg-gray-50 px-3.5 py-2.5 font-mono text-sm text-gray-700">
              {showKey ? mockApiKey : "le_live_••••••••••••••••••••••••••••"}
            </div>
            <button
              onClick={() => setShowKey(!showKey)}
              className="rounded-lg border border-gray-300 p-2.5 text-gray-500 hover:bg-gray-50 transition-colors"
              title={showKey ? "Hide" : "Show"}
            >
              {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
            <button
              onClick={handleCopy}
              className="rounded-lg border border-gray-300 p-2.5 text-gray-500 hover:bg-gray-50 transition-colors"
              title="Copy"
            >
              {copied ? (
                <Check size={16} className="text-line-green" />
              ) : (
                <Copy size={16} />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

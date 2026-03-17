"use client";

import { useState } from "react";
import {
  MessageCircle,
  User,
  Send,
  CheckCircle2,
  ExternalLink,
  Code2,
} from "lucide-react";

// Mock LIFF profile data (matches @line/liff-mock defaults)
const MOCK_PROFILE = {
  displayName: "田中太郎",
  userId: "U1234567890abcdef1234567890abcdef",
  pictureUrl: null,
  statusMessage: "LINE Engage テスト中 🚀",
};

export default function LinePage() {
  const [liffInitialized, setLiffInitialized] = useState(false);
  const [profile, setProfile] = useState<typeof MOCK_PROFILE | null>(null);
  const [messageSent, setMessageSent] = useState(false);
  const [showCode, setShowCode] = useState(false);

  function handleInitLiff() {
    // Simulates liff.init() + liff.getProfile()
    // In production, this would use the real LIFF SDK:
    // await liff.init({ liffId: 'YOUR_LIFF_ID' });
    // const profile = await liff.getProfile();
    setTimeout(() => {
      setLiffInitialized(true);
      setProfile(MOCK_PROFILE);
    }, 600);
  }

  function handleSendMessage() {
    // Simulates liff.sendMessages()
    setMessageSent(true);
    setTimeout(() => setMessageSent(false), 3000);
  }

  const initCode = `import liff from '@line/liff';
import { LiffMockPlugin } from '@line/liff-mock';

// Use mock in development
if (process.env.NODE_ENV === 'development') {
  liff.use(new LiffMockPlugin());
}

await liff.init({
  liffId: process.env.NEXT_PUBLIC_LIFF_ID!,
  mock: process.env.NODE_ENV === 'development',
});

// Get user profile
const profile = await liff.getProfile();
console.log(profile.displayName); // "田中太郎"
console.log(profile.userId);      // "U1234..."

// Send message to chat
await liff.sendMessages([{
  type: 'text',
  text: 'Hello from LINE Engage! 🎉',
}]);`;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">LINE Integration</h1>
        <p className="text-gray-500 mt-1">
          Manage your LINE channel and test LIFF SDK features
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LIFF SDK Demo */}
        <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-semibold text-gray-900">
              LIFF SDK Demo
            </h2>
            <span className="badge bg-amber-100 text-amber-700">
              Mock Mode
            </span>
          </div>

          {!liffInitialized ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-line-green/10 flex items-center justify-center">
                <MessageCircle size={28} className="text-line-green" />
              </div>
              <p className="text-sm text-gray-500 mb-4">
                Initialize the LIFF SDK to retrieve user profile and interact
                with the LINE platform.
              </p>
              <button
                onClick={handleInitLiff}
                className="rounded-lg bg-line-green px-5 py-2.5 text-sm font-semibold text-white hover:bg-line-green-hover transition-colors"
              >
                Initialize LIFF
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Profile card */}
              <div className="rounded-lg bg-gray-50 p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-line-green/20 flex items-center justify-center text-lg font-bold text-line-green">
                    {profile?.displayName.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">
                      {profile?.displayName}
                    </div>
                    <div className="text-xs text-gray-500 font-mono">
                      {profile?.userId.slice(0, 16)}...
                    </div>
                  </div>
                  <CheckCircle2
                    size={18}
                    className="ml-auto text-line-green"
                  />
                </div>
                <div className="text-sm text-gray-600">
                  {profile?.statusMessage}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={handleSendMessage}
                  disabled={messageSent}
                  className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
                >
                  <Send size={14} />
                  {messageSent ? "Sent ✓" : "Send Test Message"}
                </button>
                <button
                  onClick={() => setShowCode(!showCode)}
                  className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Code2 size={14} />
                  {showCode ? "Hide Code" : "View Code"}
                </button>
              </div>

              {messageSent && (
                <div className="rounded-lg bg-line-green/10 border border-line-green/20 px-4 py-2.5 text-sm text-line-green">
                  Message sent to chat: &quot;Hello from LINE Engage! 🎉&quot;
                </div>
              )}
            </div>
          )}
        </div>

        {/* Channel Status */}
        <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
          <h2 className="text-base font-semibold text-gray-900 mb-5">
            Channel Status
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
              <span className="text-sm text-gray-600">Webhook URL</span>
              <code className="text-xs font-mono text-gray-500">
                https://api.line-engage.dev/webhook
              </code>
            </div>
            <div className="flex items-center justify-between py-3">
              <span className="text-sm text-gray-600">Verification</span>
              <span className="badge bg-amber-100 text-amber-700">
                Unverified
              </span>
            </div>
          </div>

          <a
            href="https://developers.line.biz/console/"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Open LINE Developers Console
            <ExternalLink size={14} />
          </a>
        </div>
      </div>

      {/* Code example */}
      {showCode && (
        <div className="mt-6 rounded-xl bg-gray-900 p-5 shadow-sm overflow-x-auto">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-gray-400">
              LIFF Integration Example
            </span>
            <span className="text-xs text-gray-500">TypeScript</span>
          </div>
          <pre className="text-sm text-gray-300 font-mono leading-relaxed whitespace-pre">
            {initCode}
          </pre>
        </div>
      )}
    </div>
  );
}

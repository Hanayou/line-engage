"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@line-engage.dev");
  const [password, setPassword] = useState("demo1234");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Invalid email or password");
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-line-green to-emerald-600 items-center justify-center p-12">
        <div className="max-w-md text-white">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <span className="text-2xl font-bold tracking-tight">
              LINE Engage
            </span>
          </div>
          <h1 className="text-4xl font-bold leading-tight mb-4">
            Customer engagement,
            <br />
            reimagined.
          </h1>
          <p className="text-white/80 text-lg leading-relaxed">
            Connect with your customers through LINE Mini Apps. Collect
            feedback, drive loyalty, and grow your community — all from one
            platform.
          </p>
          <div className="mt-10 flex gap-6 text-sm text-white/70">
            <div>
              <div className="text-3xl font-bold text-white">2,800+</div>
              LINE Friends
            </div>
            <div>
              <div className="text-3xl font-bold text-white">68%</div>
              Open Rate
            </div>
            <div>
              <div className="text-3xl font-bold text-white">4.8★</div>
              NPS Score
            </div>
          </div>
        </div>
      </div>

      {/* Right panel — login form */}
      <div className="flex flex-1 items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-9 h-9 bg-line-green rounded-lg flex items-center justify-center">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <span className="text-lg font-bold text-gray-900">
              LINE Engage
            </span>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-1">
            Welcome back
          </h2>
          <p className="text-gray-500 mb-8">Sign in to your dashboard</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm shadow-sm focus:border-line-green focus:outline-none focus:ring-2 focus:ring-line-green/20 transition-colors"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm shadow-sm focus:border-line-green focus:outline-none focus:ring-2 focus:ring-line-green/20 transition-colors"
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <div className="rounded-lg bg-red-50 border border-red-200 px-3.5 py-2.5 text-sm text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-line-green px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-line-green-hover focus:outline-none focus:ring-2 focus:ring-line-green/40 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <div className="mt-6 rounded-lg bg-gray-50 border border-gray-200 px-3.5 py-3 text-xs text-gray-500">
            <span className="font-medium text-gray-700">Demo credentials:</span>
            <br />
            admin@line-engage.dev / demo1234
          </div>
        </div>
      </div>
    </div>
  );
}

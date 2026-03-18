import { useEffect, useState } from "react";
import { initializeLiff, getProfile } from "./lib/liff";
import { LoadingScreen } from "./components/LoadingScreen";
import { ProfileCard } from "./components/ProfileCard";
import { FeedbackForm } from "./components/FeedbackForm";

type Profile = {
  displayName: string;
  userId: string;
  statusMessage?: string;
  pictureUrl?: string;
};

type AppState = "loading" | "ready" | "submitted" | "error";

export function App() {
  const [state, setState] = useState<AppState>("loading");
  const [profile, setProfile] = useState<Profile | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    initializeLiff()
      .then(async () => {
        const p = await getProfile();
        setProfile(p as Profile);
        setState("ready");
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "LIFF の初期化に失敗しました");
        setState("error");
      });
  }, []);

  if (state === "loading") {
    return <LoadingScreen />;
  }

  return (
    <div className="mx-auto min-h-screen max-w-md bg-gray-50 px-4 py-6">
      {/* Header */}
      <div className="mb-6 text-center">
        <h1 className="text-xl font-bold text-gray-900">LINE Engage</h1>
        <p className="mt-1 text-sm text-gray-500">カスタマーフィードバック</p>
      </div>

      {state === "error" && (
        <div className="rounded-2xl bg-red-50 p-5 text-center">
          <p className="text-sm text-red-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-3 text-sm font-medium text-red-700 underline"
          >
            再読み込み
          </button>
        </div>
      )}

      {state === "ready" && profile && (
        <div className="space-y-4">
          <ProfileCard profile={profile} />
          <FeedbackForm
            lineUserId={profile.userId}
            onSubmitted={() => setState("submitted")}
          />
        </div>
      )}

      {state === "submitted" && (
        <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-line-green/10">
            <svg
              className="h-8 w-8 text-line-green"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="mb-2 text-lg font-bold text-gray-900">
            ありがとうございます！
          </h2>
          <p className="text-sm text-gray-500">
            フィードバックを受け付けました。
            <br />
            サービスの改善に活用させていただきます。
          </p>
        </div>
      )}

      {/* Footer */}
      <p className="mt-8 text-center text-xs text-gray-400">
        Powered by LINE Engage
      </p>
    </div>
  );
}

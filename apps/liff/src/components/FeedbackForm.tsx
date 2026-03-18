import { useState } from "react";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8787";

const RATINGS = [
  { value: 1, label: "1" },
  { value: 2, label: "2" },
  { value: 3, label: "3" },
  { value: 4, label: "4" },
  { value: 5, label: "5" },
];

type Props = {
  lineUserId: string;
  onSubmitted: () => void;
};

export function FeedbackForm({ lineUserId, onSubmitted }: Props) {
  const [rating, setRating] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (rating === null) return;

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE}/api/v1/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lineUserId, rating, comment }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({ message: "送信に失敗しました" }));
        throw new Error(data.message || "送信に失敗しました");
      }

      onSubmitted();
    } catch (err) {
      setError(err instanceof Error ? err.message : "送信に失敗しました");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl bg-white p-5 shadow-sm">
      <h3 className="mb-1 text-base font-bold text-gray-900">
        ご意見をお聞かせください
      </h3>
      <p className="mb-4 text-sm text-gray-500">
        サービスの改善に役立てさせていただきます
      </p>

      {/* Rating */}
      <div className="mb-4">
        <p className="mb-2 text-sm font-medium text-gray-700">満足度</p>
        <div className="flex gap-2">
          {RATINGS.map((r) => (
            <button
              key={r.value}
              type="button"
              onClick={() => setRating(r.value)}
              className={`flex h-11 w-11 items-center justify-center rounded-xl text-sm font-semibold transition-colors ${
                rating === r.value
                  ? "bg-line-green text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
        <div className="mt-1 flex justify-between text-xs text-gray-400">
          <span>不満</span>
          <span>満足</span>
        </div>
      </div>

      {/* Comment */}
      <div className="mb-4">
        <label htmlFor="comment" className="mb-1 block text-sm font-medium text-gray-700">
          コメント（任意）
        </label>
        <textarea
          id="comment"
          rows={3}
          maxLength={500}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="ご自由にお書きください..."
          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-line-green focus:outline-none focus:ring-1 focus:ring-line-green"
        />
        <p className="mt-1 text-right text-xs text-gray-400">{comment.length}/500</p>
      </div>

      {error && (
        <p className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={rating === null || submitting}
        className="w-full rounded-xl bg-line-green py-3 text-sm font-semibold text-white transition-colors hover:bg-line-green-hover disabled:opacity-50"
      >
        {submitting ? "送信中..." : "送信する"}
      </button>
    </form>
  );
}

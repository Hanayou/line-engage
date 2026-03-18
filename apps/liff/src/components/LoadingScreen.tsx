export function LoadingScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-line-green" />
        <p className="text-sm text-gray-500">読み込み中...</p>
      </div>
    </div>
  );
}

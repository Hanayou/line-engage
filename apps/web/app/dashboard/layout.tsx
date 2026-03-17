import { Sidebar } from "@/components/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <main className="ml-[var(--sidebar-width)]">
        <div className="px-8 py-6">{children}</div>
      </main>
    </div>
  );
}

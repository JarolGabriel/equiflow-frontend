import { BottomTabBar } from "@/components/nav/bottom-tab-bar";
import { DashboardHeader } from "@/components/nav/dashboard-header";
import { Sidebar } from "@/components/nav/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh">
      <Sidebar />
      <div className="md:pl-60">
        <DashboardHeader />
        <main className="mx-auto w-full max-w-5xl px-4 py-6 pb-24 md:px-6 md:pb-10">
          {children}
        </main>
      </div>
      <BottomTabBar />
    </div>
  );
}

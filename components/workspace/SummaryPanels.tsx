import { Ellipsis, RefreshCw, X } from "lucide-react";
import type { Role } from "@/lib/types";
import { PanelCard } from "./ui";

type SummaryPanelsProps = {
  userLabel: string;
  userRole: Role;
  enrollmentCount: number;
  onRefresh: () => void;
  onLogout: () => void;
};

export default function SummaryPanels({
  userLabel,
  userRole,
  enrollmentCount,
  onRefresh,
  onLogout,
}: SummaryPanelsProps) {
  return (
    <>
      <aside id="summary-panel" className="pointer-events-none absolute right-0 top-40 hidden w-68.5 xl:block">
        <div className="overflow-hidden rounded-[22px] bg-zinc-900 text-white shadow-[0_24px_56px_-22px_rgba(0,0,0,0.7)]">
          <div className="h-42 bg-[linear-gradient(120deg,#8f9b9f,#bcc3c7)] p-3">
            <div className="flex items-start justify-between">
              <span className="rounded-full bg-brand-neon px-2 py-1 text-[10px] text-black">Live</span>
              <div className="flex gap-1">
                <button
                  onClick={onRefresh}
                  className="pointer-events-auto grid h-6 w-6 place-items-center rounded-full bg-black/30 text-[10px]"
                  title="Refresh"
                >
                  <RefreshCw size={11} />
                </button>
                <button
                  onClick={onLogout}
                  className="pointer-events-auto grid h-6 w-6 place-items-center rounded-full bg-black/30 text-[10px]"
                  title="Logout"
                >
                  <X size={11} />
                </button>
              </div>
            </div>
          </div>
          <div className="p-3">
            <div className="flex items-center justify-between rounded-full bg-black px-3 py-2">
              <p className="text-sm font-medium">Summary</p>
              <Ellipsis size={12} className="text-zinc-400" />
            </div>
            <div className="mt-3 space-y-2">
              <PanelCard title="User" content={userLabel} />
              <PanelCard title="Goal" content="Make course management and student enrollment flow instantly visible." />
              <PanelCard title="Enrollments" content={userRole === "admin" ? `${enrollmentCount} records` : "Student view"} />
              <PanelCard title="Connection" content={process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8000/api/v1"} />
            </div>
          </div>
        </div>
      </aside>

      <section id="summary-panel-mobile" className="mt-5 xl:hidden">
        <div className="overflow-hidden rounded-[22px] bg-zinc-900 text-white shadow-[0_24px_56px_-22px_rgba(0,0,0,0.5)]">
          <div className="p-3">
            <div className="flex items-center justify-between rounded-full bg-black px-3 py-2">
              <p className="text-sm font-medium">Summary</p>
              <Ellipsis size={12} className="text-zinc-400" />
            </div>
            <div className="mt-3 space-y-2">
              <PanelCard title="User" content={userLabel} />
              <PanelCard title="Goal" content="Make course management and student enrollment flow instantly visible." />
              <PanelCard title="Enrollments" content={userRole === "admin" ? `${enrollmentCount} records` : "Student view"} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

import { BookOpen, ClipboardList, GraduationCap, Home, LogOut, PanelRightOpen, RefreshCw, Zap } from "lucide-react";
import type { ReactNode } from "react";
import Link from "next/link";
import type { Role } from "@/lib/types";
import { MetricStack } from "./ui";

export type WorkspaceView = "dashboard" | "courses" | "enrollments" | "actions";

type WorkspaceLayoutProps = {
  userNameOrEmail: string;
  userRole: Role;
  coursesCount: number;
  enrollmentsCount: number;
  totalSeats: number;
  message: string;
  children: ReactNode;
  currentView: WorkspaceView;
  onRefresh: () => void;
  onSummary: () => void;
  onLogout: () => void;
  onNewAction: () => void;
};

export default function WorkspaceLayout({
  userNameOrEmail,
  userRole,
  coursesCount,
  enrollmentsCount,
  totalSeats,
  message,
  children,
  currentView,
  onRefresh,
  onSummary,
  onLogout,
  onNewAction,
}: WorkspaceLayoutProps) {
  const isAdmin = userRole === "admin";
  const baseRoute = isAdmin ? "/admin" : "";
  const homeRoute = `${baseRoute}/dashboard`;
  const viewLabel = currentView[0].toUpperCase() + currentView.slice(1);
  const compactIdentity = (() => {
    const trimmed = userNameOrEmail.trim();
    if (!trimmed) {
      return "User";
    }

    if (trimmed.includes("@")) {
      const localPart = trimmed.split("@")[0];
      return localPart || "User";
    }

    const [firstName] = trimmed.split(/\s+/);
    return firstName || trimmed;
  })();
  const flowLabelLong = isAdmin ? "Admin Flow" : "Student Flow";
  const flowLabelShort = isAdmin ? "Adm" : "Std";
  const navItems: Array<{
    key: WorkspaceView;
    label: string;
    href: string;
    icon: typeof Home;
  }> = [
    { key: "dashboard", label: "Dashboard", href: homeRoute, icon: Home },
    { key: "courses", label: "Courses", href: `${baseRoute}/courses`, icon: BookOpen },
    { key: "enrollments", label: "Enrollments", href: `${baseRoute}/enrollments`, icon: ClipboardList },
    { key: "actions", label: "Actions", href: `${baseRoute}/actions`, icon: Zap },
  ];

  return (
    <div className="min-h-screen bg-brand-bg px-1.5 py-2.5 sm:px-4 sm:py-4 lg:px-8 lg:py-8">
      <div className="mx-auto grid min-h-[94vh] max-w-310 grid-cols-1 gap-2.5 rounded-[22px] bg-brand-bg p-1.5 sm:gap-3 sm:p-3 sm:rounded-[30px] lg:grid-cols-[76px_1fr] lg:p-4">
        <aside className="rounded-[20px] border border-black/5 bg-white p-2 shadow-[0_10px_40px_-12px_rgba(0,0,0,0.07)]">
          <div className="flex h-full flex-row flex-wrap items-center justify-between gap-2 lg:flex-col lg:justify-start lg:gap-0">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-brand-dark text-white">
              <div className="grid h-7 w-7 place-items-center rounded-xl bg-brand-neon text-black">
                <GraduationCap size={13} />
              </div>
            </div>
            <div className="mt-0 flex flex-wrap justify-center gap-2 lg:mt-5 lg:flex-col lg:flex-nowrap">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.key;
                return (
                <Link
                  key={item.key}
                  href={item.href}
                  className={`grid h-10 w-10 place-items-center rounded-xl text-sm transition ${
                    isActive
                      ? "bg-brand-dark text-white"
                      : "bg-zinc-100 text-brand-text-muted hover:bg-zinc-200"
                  }`}
                  title={item.label}
                >
                  <Icon size={14} />
                </Link>
                );
              })}
            </div>
            <button
              onClick={onLogout}
              className="grid h-10 w-10 place-items-center rounded-xl bg-zinc-100 text-brand-text-muted lg:mt-auto"
              title="Logout"
            >
              <LogOut size={14} />
            </button>
          </div>
        </aside>

        <main id="top" className="relative overflow-hidden rounded-[22px] bg-brand-bg px-0.5 pb-3 sm:rounded-[26px] sm:px-1 lg:px-2">
          <section className="rounded-[22px] bg-black p-1.5 shadow-[0_20px_45px_-20px_rgba(0,0,0,0.35)] md:rounded-2xl">
            <div className="rounded-[20px] bg-black/90 p-1.5 md:rounded-2xl sm:p-2">
              <div className="flex items-center justify-between gap-2">
                <div className="rounded-full bg-black px-4 py-2 text-[11px] text-zinc-300">
                  <p className="font-semibold text-white">EduTrack Live Ops</p>
                  <p>{new Date().toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={onRefresh}
                    className="grid h-9 w-9 place-items-center rounded-xl bg-white/95 text-[10px] transition hover:bg-white sm:h-10 sm:w-10"
                    title="Refresh workspace"
                  >
                    <RefreshCw size={13} />
                  </button>
                  <button
                    onClick={onSummary}
                    className="grid h-9 w-9 place-items-center rounded-xl bg-white/95 text-[10px] transition hover:bg-white sm:h-10 sm:w-10"
                    title="Open summary"
                  >
                    <PanelRightOpen size={13} />
                  </button>
                </div>
              </div>

              <div className="mt-1.5 rounded-full bg-brand-neon px-2 py-1.5 text-black sm:px-3 sm:py-2 md:px-4">
                <div className="grid min-w-0 grid-cols-[72px_1fr_52px] items-center gap-1.5 text-[10px] sm:grid-cols-[84px_1fr_88px] sm:text-[11px] md:text-xs">
                  <span className="rounded-full bg-black/10 px-2 py-1 text-center font-medium">{viewLabel}</span>
                  <span className="min-w-0 truncate text-center font-semibold">
                    <span className="sm:hidden">{compactIdentity}</span>
                    <span className="hidden sm:inline">{userNameOrEmail}</span>
                  </span>
                  <span className="text-center uppercase tracking-wide">
                    <span className="sm:hidden">{flowLabelShort}</span>
                    <span className="hidden sm:inline">{flowLabelLong}</span>
                  </span>
                </div>
              </div>
            </div>
          </section>

          <section className="mt-4 pr-0 xl:pr-72.5">
            <header className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex min-w-0 flex-wrap items-center gap-2.5 sm:gap-3">
                <h1 className="text-2xl font-medium tracking-tight text-brand-dark sm:text-[33px]">WORKSPACE</h1>
                <button
                  onClick={onNewAction}
                  className="rounded-full bg-brand-dark px-4 py-1.5 text-[11px] text-white hover:opacity-90"
                >
                  {userRole === "admin" ? "+ New Course" : "+ Study Task"}
                </button>
              </div>
              <div className="flex w-full flex-wrap gap-3 text-brand-dark sm:w-auto sm:gap-6">
                <MetricStack value={String(coursesCount)} label="courses" dot="bg-brand-neon" />
                <MetricStack value={String(enrollmentsCount)} label="enrollments" dot="bg-brand-neon" />
                <MetricStack value={String(totalSeats)} label="total seats" dot="bg-sky-400" />
              </div>
            </header>

            {message && (
              <div className="mt-3 rounded-2xl bg-white px-4 py-2.5 text-sm text-brand-dark shadow-[0_10px_30px_-24px_rgba(0,0,0,0.4)]">
                {message}
              </div>
            )}

            {children}
          </section>
        </main>
      </div>
    </div>
  );
}

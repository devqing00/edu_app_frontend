import Link from "next/link";

export default function Page() {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8000/api/v1";
  const environmentLabel = apiBaseUrl.includes("127.0.0.1") || apiBaseUrl.includes("localhost")
    ? "Local"
    : apiBaseUrl.includes("staging") || apiBaseUrl.includes("dev")
      ? "Staging"
      : "Production";

  return (
    <main className="min-h-screen bg-brand-bg px-3 py-4 sm:px-6 sm:py-6 md:px-10 md:py-8">
      <section className="mx-auto w-full max-w-6xl overflow-hidden rounded-4xl border border-black/5 bg-white p-4 shadow-[0_24px_80px_-42px_rgba(0,0,0,0.35)] sm:p-6 md:p-10">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-black/5 bg-brand-bg p-2">
          <span className="rounded-full bg-brand-dark px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-neon">
            EduTrack Platform
          </span>
          <div className="flex flex-wrap gap-1.5 text-[11px]">
            <Link href="/auth" className="rounded-full bg-white px-3 py-1.5 font-semibold text-brand-dark hover:bg-zinc-100">Student</Link>
            <Link href="/admin/login" className="rounded-full bg-white px-3 py-1.5 font-semibold text-brand-dark hover:bg-zinc-100">Admin Login</Link>
            <Link href="/admin/register" className="rounded-full bg-white px-3 py-1.5 font-semibold text-brand-dark hover:bg-zinc-100">Admin Register</Link>
          </div>
        </div>

        <div className="rounded-3xl bg-brand-dark p-6 text-white sm:p-8 md:p-10">
          <p className="inline-flex rounded-full bg-brand-neon/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-neon">
            EduTrack Workspace
          </p>
          <h1 className="mt-4 max-w-3xl text-3xl font-semibold leading-tight sm:text-4xl md:text-5xl">
            Run your learning operations from one live control center.
          </h1>
          <p className="mt-4 max-w-2xl text-sm text-zinc-300 sm:text-base">
            EduTrack brings student enrollment, course lifecycle management, and action tracking into one high-visibility dashboard for teams that need speed and clarity.
          </p>

          <div className="mt-6 grid gap-2.5 text-xs text-zinc-300 sm:grid-cols-3 sm:text-sm">
            <article className="rounded-2xl bg-white/5 p-3.5">
              <p className="text-2xl font-light text-white sm:text-3xl">24+</p>
              <p className="mt-1 uppercase tracking-wide text-zinc-400">Active Courses</p>
            </article>
            <article className="rounded-2xl bg-white/5 p-3.5">
              <p className="text-2xl font-light text-white sm:text-3xl">180+</p>
              <p className="mt-1 uppercase tracking-wide text-zinc-400">Enrollment Events</p>
            </article>
            <article className="rounded-2xl bg-white/5 p-3.5">
              <p className="text-2xl font-light text-white sm:text-3xl">94%</p>
              <p className="mt-1 uppercase tracking-wide text-zinc-400">Flow Visibility</p>
            </article>
          </div>

          <div className="mt-7 flex flex-wrap gap-2.5">
            <Link
              href="/auth"
              className="rounded-full bg-brand-neon px-5 py-2.5 text-sm font-semibold text-black transition hover:opacity-90"
            >
              Student Access
            </Link>

          </div>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <article className="rounded-3xl border border-black/5 bg-brand-bg p-4">
            <h2 className="text-sm font-semibold text-brand-dark">Course Intelligence</h2>
            <p className="mt-2 text-xs text-brand-text-muted sm:text-sm">Create, edit, activate, or retire courses from one place while monitoring current seat capacity and status.</p>
          </article>
          <article className="rounded-3xl border border-black/5 bg-brand-bg p-4">
            <h2 className="text-sm font-semibold text-brand-dark">Enrollment Control</h2>
            <p className="mt-2 text-xs text-brand-text-muted sm:text-sm">Track enrollments globally or by specific course, then quickly search and verify records in real time.</p>
          </article>
          <article className="rounded-3xl border border-black/5 bg-brand-bg p-4 sm:col-span-2 lg:col-span-1">
            <h2 className="text-sm font-semibold text-brand-dark">Role-Aware Workflows</h2>
            <p className="mt-2 text-xs text-brand-text-muted sm:text-sm">Students and admins use dedicated entry points and role-based dashboards tailored to their exact actions.</p>
          </article>
        </div>
      </section>
    </main>
  );
}

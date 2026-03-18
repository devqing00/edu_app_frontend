import type { Dispatch, FormEvent, ReactNode, SetStateAction } from "react";
import type { Role } from "@/lib/types";
import { AuthInput } from "./ui";

type AuthMode = "login" | "signup";

type AuthScreenProps = {
  authMode: AuthMode;
  setAuthMode: (mode: AuthMode) => void;
  allowSignup?: boolean;
  title?: string;
  subtitle?: string;
  footerContent?: ReactNode;
  loading: boolean;
  message: string;
  loginForm: { email: string; password: string };
  setLoginForm: Dispatch<SetStateAction<{ email: string; password: string }>>;
  signupForm: { email: string; password: string; name: string; role: Role };
  setSignupForm: Dispatch<
    SetStateAction<{ email: string; password: string; name: string; role: Role }>
  >;
  onLogin: (event: FormEvent<HTMLFormElement>) => void;
  onSignup: (event: FormEvent<HTMLFormElement>) => void;
};

export default function AuthScreen({
  authMode,
  setAuthMode,
  allowSignup = true,
  title = "Bring every student, course, and enrollment into one dashboard.",
  subtitle = "A neon-highlighted, high-contrast learning operations cockpit designed for speed and clarity.",
  footerContent,
  loading,
  message,
  loginForm,
  setLoginForm,
  signupForm,
  setSignupForm,
  onLogin,
  onSignup,
}: AuthScreenProps) {
  return (
    <div className="min-h-screen bg-brand-bg px-2.5 py-3 md:px-8 md:py-8">
      <div className="mx-auto flex min-h-[92vh] w-full max-w-6xl overflow-hidden rounded-3xl bg-brand-bg p-1.5 md:rounded-[36px] md:p-6">
        <div className="grid w-full grid-cols-1 gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-4xl bg-brand-dark p-5 text-white shadow-[0_22px_52px_-18px_rgba(0,0,0,0.6)] sm:p-8">
            <p className="mb-4 inline-flex rounded-full bg-white/10 px-4 py-1 text-xs uppercase tracking-[0.18em] text-brand-neon">
              EduTrack Workspace
            </p>
            <h1 className="text-[1.7rem] font-semibold leading-tight sm:text-3xl md:text-5xl">
              {title}
            </h1>
            <p className="mt-5 max-w-lg text-sm text-zinc-300 md:text-base">
              {subtitle}
            </p>

            <div className="mt-7 rounded-2xl bg-black p-1.5 shadow-inner sm:mt-8 sm:p-2 sm:rounded-full">
              <div className="grid grid-cols-2 gap-1.5 rounded-2xl bg-brand-neon p-1.5 text-[10px] font-semibold uppercase tracking-wide text-black sm:grid-cols-3 sm:rounded-full sm:px-3 sm:py-2 sm:text-xs sm:tracking-normal md:text-sm">
                <span className="rounded-full bg-black/10 px-2 py-1 text-center leading-tight">Courses</span>
                <span className="rounded-full px-2 py-1 text-center leading-tight">Enrollments</span>
                <span className="col-span-2 rounded-full px-2 py-1 text-center leading-tight sm:col-span-1">Insights</span>
              </div>
            </div>

            <div className="mt-7 grid grid-cols-2 gap-2.5 sm:mt-8 sm:gap-4 sm:grid-cols-3">
              {[
                ["24", "courses"],
                ["182", "enrollments"],
                ["94%", "attendance"],
              ].map(([count, label]) => (
                <article
                  key={label}
                  className={`rounded-3xl bg-white/5 px-3 py-3 text-center sm:p-4 ${
                    label === "attendance" ? "col-span-2 sm:col-span-1" : ""
                  }`}
                >
                  <p className="text-2xl font-light text-white sm:text-3xl">{count}</p>
                  <p className="text-[10px] uppercase tracking-wide text-zinc-400 sm:text-xs">{label}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="rounded-4xl bg-white p-4 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] sm:p-6 md:p-8">
            <div className="mb-6 flex rounded-full bg-zinc-100 p-1">
              <button
                onClick={() => setAuthMode("login")}
                className={`w-1/2 rounded-full px-4 py-2 text-sm font-medium transition ${
                  authMode === "login" ? "bg-brand-dark text-white" : "text-brand-text-muted"
                }`}
              >
                Login
              </button>
              <button
                onClick={() => setAuthMode("signup")}
                disabled={!allowSignup}
                className={`w-1/2 rounded-full px-4 py-2 text-sm font-medium transition ${
                  !allowSignup
                    ? "cursor-not-allowed text-zinc-400"
                    : authMode === "signup"
                      ? "bg-brand-dark text-white"
                      : "text-brand-text-muted"
                }`}
              >
                Sign up
              </button>
            </div>

            {authMode === "login" ? (
              <form className="space-y-4" onSubmit={onLogin}>
                <AuthInput
                  label="Email"
                  type="email"
                  value={loginForm.email}
                  onChange={(value) => setLoginForm((prev) => ({ ...prev, email: value }))}
                />
                <AuthInput
                  label="Password"
                  type="password"
                  value={loginForm.password}
                  onChange={(value) => setLoginForm((prev) => ({ ...prev, password: value }))}
                />
                <button
                  disabled={loading}
                  className="w-full rounded-full bg-brand-dark px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
                  type="submit"
                >
                  {loading ? "Signing in..." : "Open Workspace"}
                </button>
              </form>
            ) : allowSignup ? (
              <form className="space-y-4" onSubmit={onSignup}>
                <AuthInput
                  label="Name"
                  type="text"
                  value={signupForm.name}
                  onChange={(value) => setSignupForm((prev) => ({ ...prev, name: value }))}
                />
                <AuthInput
                  label="Email"
                  type="email"
                  value={signupForm.email}
                  onChange={(value) => setSignupForm((prev) => ({ ...prev, email: value }))}
                />
                <AuthInput
                  label="Password"
                  type="password"
                  value={signupForm.password}
                  onChange={(value) => setSignupForm((prev) => ({ ...prev, password: value }))}
                />
                <button
                  disabled={loading}
                  className="w-full rounded-full bg-brand-dark px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
                  type="submit"
                >
                  {loading ? "Creating account..." : "Create account"}
                </button>
              </form>
            ) : (
              <div className="rounded-2xl bg-brand-bg px-4 py-3 text-sm text-brand-dark">
                Registration is disabled on this page.
              </div>
            )}

            {message && (
              <p className="mt-4 rounded-2xl bg-brand-bg px-4 py-3 text-sm text-brand-dark">
                {message}
              </p>
            )}

            {footerContent ? (
              <div className="mt-4 text-center text-xs text-brand-text-muted">{footerContent}</div>
            ) : null}
          </section>
        </div>
      </div>
    </div>
  );
}

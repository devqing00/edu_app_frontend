"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthScreen from "@/components/workspace/AuthScreen";
import { getProfile, signup } from "@/lib/api";
import { SESSION_STORAGE_KEY } from "@/lib/session";
import type { Role } from "@/lib/types";

export default function AdminRegisterPage() {
  const [loading, setLoading] = useState(false);
  const [sessionChecked, setSessionChecked] = useState(false);
  const [message, setMessage] = useState("");
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [signupForm, setSignupForm] = useState({
    email: "",
    password: "",
    name: "",
    role: "admin" as Role,
  });
  const [authMode, setAuthMode] = useState<"login" | "signup">("signup");
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!stored) {
      setSessionChecked(true);
      return;
    }

    void (async () => {
      try {
        const profile = await getProfile(stored);
        if (profile.role === "admin") {
          router.replace("/admin/dashboard");
        }
      } catch {
        localStorage.removeItem(SESSION_STORAGE_KEY);
      } finally {
        setSessionChecked(true);
      }
    })();
  }, [router]);

  if (!sessionChecked) {
    return null;
  }

  function handleAuthMode(mode: "login" | "signup") {
    if (mode === "login") {
      router.push("/admin/login");
      return;
    }
    setAuthMode("signup");
  }

  async function handleAdminSignup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    try {
      setLoading(true);
      await signup({ ...signupForm, role: "admin" });
      setMessage("Admin account created. Redirecting to admin login...");
      setSignupForm({ email: "", password: "", name: "", role: "admin" });
      window.setTimeout(() => {
        router.replace("/admin/login");
      }, 700);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to register admin");
    } finally {
      setLoading(false);
    }
  }

  function goToAdminLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    router.push("/admin/login");
  }

  return (
    <AuthScreen
      authMode={authMode}
      setAuthMode={handleAuthMode}
      loading={loading}
      message={message}
      loginForm={loginForm}
      setLoginForm={setLoginForm}
      signupForm={signupForm}
      setSignupForm={setSignupForm}
      onLogin={goToAdminLogin}
      onSignup={handleAdminSignup}
      allowSignup
      title="Admin account registration"
      subtitle="Create a privileged admin account for workspace-level management and controls."
      footerContent={
        <>
          Already have an admin account? <Link href="/admin/login" className="text-brand-dark underline">Sign in</Link>
        </>
      }
    />
  );
}

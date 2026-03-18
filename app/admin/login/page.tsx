"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getProfile, login } from "@/lib/api";
import { SESSION_STORAGE_KEY } from "@/lib/session";
import type { Role, User } from "@/lib/types";
import AuthScreen from "@/components/workspace/AuthScreen";

export default function AdminLoginPage() {
  const [loading, setLoading] = useState(false);
  const [sessionChecked, setSessionChecked] = useState(false);
  const [message, setMessage] = useState("");
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [signupForm, setSignupForm] = useState({
    email: "",
    password: "",
    name: "",
    role: "student" as Role,
  });
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
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

  async function handleAdminLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    try {
      setLoading(true);
      const tokenData = await login(loginForm.email, loginForm.password);
      const profile: User = await getProfile(tokenData.access_token);

      if (profile.role !== "admin") {
        setMessage("This login is only for admin accounts.");
        return;
      }

      localStorage.setItem(SESSION_STORAGE_KEY, tokenData.access_token);
      router.replace("/admin/dashboard");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to login");
    } finally {
      setLoading(false);
    }
  }

  function goToAdminRegister(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    router.push("/admin/register");
  }

  return (
    <AuthScreen
      authMode={authMode}
      setAuthMode={setAuthMode}
      loading={loading}
      message={message}
      loginForm={loginForm}
      setLoginForm={setLoginForm}
      signupForm={signupForm}
      setSignupForm={setSignupForm}
      onLogin={handleAdminLogin}
      onSignup={goToAdminRegister}
      allowSignup
      title="Admin control access"
      subtitle="Use your assigned admin account to access control dashboards and enrollment management."
      footerContent={
        <>
          Need an admin account? <Link href="/admin/register" className="text-brand-dark underline">Register here</Link>
        </>
      }
    />
  );
}

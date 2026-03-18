"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import AuthScreen from "@/components/workspace/AuthScreen";
import useWorkspaceController from "@/components/workspace/useWorkspaceController";

export default function AuthPage() {
  const controller = useWorkspaceController();
  const router = useRouter();

  useEffect(() => {
    if (!controller.sessionChecked || controller.loading) {
      return;
    }

    if (!controller.user) {
      return;
    }
    if (controller.user.role === "admin") {
      router.replace("/admin/dashboard");
      return;
    }
    router.replace("/dashboard");
  }, [controller.sessionChecked, controller.loading, controller.user, router]);

  if (!controller.sessionChecked || controller.loading || controller.user) {
    return null;
  }

  return (
    <AuthScreen
      authMode={controller.authMode}
      setAuthMode={controller.setAuthMode}
      loading={controller.loading}
      message={controller.message}
      loginForm={controller.loginForm}
      setLoginForm={controller.setLoginForm}
      signupForm={controller.signupForm}
      setSignupForm={controller.setSignupForm}
      onLogin={controller.handleLogin}
      onSignup={controller.handleSignup}
      allowSignup
      title="Student workspace access"
      subtitle="Create a student account or sign in to access courses, actions, and your dashboard."
    />
  );
}

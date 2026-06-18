"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/authStore";

export default function ProtectedRoute({ children, allowedRoles }) {
  const router = useRouter();
  const { user, isAuthenticated, checkSession, isLoading } = useAuthStore();

  useEffect(() => {
    // Check session on component mount
    checkSession();
  }, [checkSession]);

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push("/auth/login");
        return;
      }

      if (allowedRoles && user && !allowedRoles.includes(user.role)) {
        router.push("/dashboard");
      }
    }
  }, [isAuthenticated, user, allowedRoles, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center transition-colors duration-300" style={{ background: "var(--cn-bg)" }}>
        <div style={{ color: "var(--cn-text)" }}>Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return null; // Will redirect
  }

  return <>{children}</>;
}

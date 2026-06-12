"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/authStore";
import AppShell from "@/components/app/AppShell";

export default function AdminDashboard() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuthStore();

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== "Admin")) {
      router.push("/auth/login");
    }
  }, [isAuthenticated, user, isLoading, router]);

  if (isLoading || !isAuthenticated || user?.role !== "Admin") {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "var(--cn-bg)" }}
      >
        <div className="flex flex-col items-center gap-4">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #6366F1, #818CF8)" }}
          >
            <span className="text-white text-lg font-bold">C</span>
          </div>
          <div
            className="w-6 h-6 rounded-full border-2"
            style={{
              borderColor: "var(--cn-primary)",
              borderTopColor: "transparent",
              animation: "cn-spin 0.8s linear infinite",
            }}
          />
        </div>
      </div>
    );
  }

  return <AppShell />;
}

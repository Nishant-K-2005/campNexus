"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/authStore";
import AppShell from "@/components/app/AppShell";
import { getSocket } from "@/lib/socket";
import useActivityStore from "@/store/activityStore";

export default function AppLayout({ children }) {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, checkSession } = useAuthStore();
  const { initSocketListeners, clearSocketListeners } = useActivityStore();

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/auth/login");
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated && user?.user_id) {
      const socket = getSocket(user.user_id);
      if (socket) {
        initSocketListeners(socket);
      }
      return () => {
        if (socket) {
          clearSocketListeners(socket);
        }
      };
    }
  }, [isAuthenticated, user?.user_id, initSocketListeners, clearSocketListeners]);

  if (isLoading || !isAuthenticated || !user) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "var(--cn-bg)" }}
      >
        <div
          className="w-8 h-8 rounded-full border-2 border-t-transparent cn-animate-spin"
          style={{ borderColor: "var(--cn-primary)", borderTopColor: "transparent" }}
        />
      </div>
    );
  }

  return <AppShell>{children}</AppShell>;
}


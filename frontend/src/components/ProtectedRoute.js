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
        // Redirect to appropriate dashboard based on role
        switch (user.role) {
          case "Student":
            router.push("/student");
            break;
          case "Teacher":
            router.push("/teacher");
            break;
          case "Admin":
            router.push("/admin");
            break;
          default:
            router.push("/auth/login");
        }
      }
    }
  }, [isAuthenticated, user, allowedRoles, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#060B1A] flex items-center justify-center">
        <div className="text-white">Loading...</div>
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

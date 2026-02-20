"use client";

import { useEffect } from "react";
import useAuthStore from "@/store/authStore";

export default function AuthProvider({ children }) {
  const { checkSession } = useAuthStore();

  useEffect(() => {
    // Check session on app load
    checkSession();
  }, [checkSession]);

  return <>{children}</>;
}

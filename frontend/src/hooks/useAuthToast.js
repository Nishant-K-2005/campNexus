"use client";

import { useEffect } from "react";
import useAuthStore from "@/store/authStore";
import { useToast } from "./useToast";

export function useAuthToast() {
  const toast = useToast();
  const authToast = useAuthStore((state) => state.toast);
  const clearAuthToast = useAuthStore((state) => state.clearToast);

  useEffect(() => {
    if (authToast) {
      toast[authToast.type](authToast.message);
      clearAuthToast();
    }
  }, [authToast, toast, clearAuthToast]);

  return toast;
}

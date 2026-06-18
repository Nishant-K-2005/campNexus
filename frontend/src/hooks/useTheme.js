"use client";

import { useTheme as useNextTheme } from "next-themes";
import { useEffect, useState } from "react";

export function useTheme() {
  const { theme, setTheme, resolvedTheme, systemTheme } = useNextTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = mounted
    ? (resolvedTheme ?? theme ?? "dark") === "dark"
    : true;

  const toggleTheme = () => setTheme(isDark ? "light" : "dark");

  return {
    theme,
    setTheme,
    resolvedTheme,
    systemTheme,
    isDark,
    mounted,
    toggleTheme,
  };
}

export default useTheme;

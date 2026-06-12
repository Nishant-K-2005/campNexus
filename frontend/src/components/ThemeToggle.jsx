"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ThemeToggle({ size = "md", className = "" }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return (
    <div className={`cn-theme-toggle-placeholder ${size === "sm" ? "w-8 h-8" : "w-10 h-10"}`} />
  );

  const isDark = theme === "dark";

  return (
    <motion.button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      whileTap={{ scale: 0.88 }}
      whileHover={{ scale: 1.08 }}
      className={`
        relative inline-flex items-center justify-center rounded-xl
        transition-all duration-200 cursor-pointer
        border border-[var(--cn-border)]
        bg-[var(--cn-surface)]
        hover:bg-[var(--cn-surface-2)]
        hover:border-[var(--cn-primary)]
        ${size === "sm" ? "w-8 h-8" : "w-10 h-10"}
        ${className}
      `}
      aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
      title={`Switch to ${isDark ? "light" : "dark"} theme`}
    >
      <AnimatePresence mode="wait" initial={false}>
        {isDark ? (
          <motion.span
            key="moon"
            initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
            transition={{ duration: 0.2 }}
          >
            <Moon className={`text-[var(--cn-primary)] ${size === "sm" ? "w-3.5 h-3.5" : "w-4.5 h-4.5"}`} style={{ width: size === "sm" ? 14 : 18, height: size === "sm" ? 14 : 18 }} />
          </motion.span>
        ) : (
          <motion.span
            key="sun"
            initial={{ opacity: 0, rotate: 90, scale: 0.5 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: -90, scale: 0.5 }}
            transition={{ duration: 0.2 }}
          >
            <Sun className={`text-[var(--cn-warning)]`} style={{ width: size === "sm" ? 14 : 18, height: size === "sm" ? 14 : 18 }} />
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

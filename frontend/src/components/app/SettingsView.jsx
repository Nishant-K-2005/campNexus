"use client";

import { motion } from "framer-motion";
import {
  User, Bell, Shield, Palette, Globe, Moon,
  ChevronRight, LogOut, Smartphone, Key,
} from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import useAuthStore from "@/store/authStore";
import { useRouter } from "next/navigation";

const settingsSections = [
  {
    title: "Account",
    icon: User,
    color: "#6366F1",
    items: ["Edit Profile", "Change Email", "Change Password", "Connected Accounts"],
  },
  {
    title: "Notifications",
    icon: Bell,
    color: "#10B981",
    items: ["Email Notifications", "Push Notifications", "Mentions & Replies", "Community Updates"],
  },
  {
    title: "Privacy & Security",
    icon: Shield,
    color: "#EF4444",
    items: ["Two-Factor Authentication", "Privacy Settings", "Active Sessions", "Data Export"],
  },
  {
    title: "Preferences",
    icon: Palette,
    color: "#F59E0B",
    items: ["Language & Region", "Accessibility", "Keyboard Shortcuts"],
  },
];

export default function SettingsView() {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const initials = user?.full_name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "U";

  return (
    <div className="p-5 sm:p-8 max-w-3xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold" style={{ color: "var(--cn-text)" }}>Settings</h2>
        <p className="text-sm mt-1" style={{ color: "var(--cn-text-3)" }}>Manage your account and preferences</p>
      </div>

      {/* Profile card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="p-5 rounded-2xl flex items-center gap-4"
        style={{
          background: "var(--cn-card)",
          border: "1px solid var(--cn-border)",
          boxShadow: "var(--cn-shadow)",
        }}
      >
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold text-white flex-shrink-0"
          style={{ background: "linear-gradient(135deg, #6366F1, #818CF8)" }}
        >
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-base font-bold" style={{ color: "var(--cn-text)" }}>{user?.full_name || "User"}</p>
          <p className="text-sm" style={{ color: "var(--cn-text-3)" }}>{user?.email || ""}</p>
          <span
            className="inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-semibold"
            style={{ background: "var(--cn-primary-l)", color: "var(--cn-primary)" }}
          >
            {user?.role || "Member"}
          </span>
        </div>
        <button
          className="px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all"
          style={{
            background: "var(--cn-surface-2)",
            border: "1px solid var(--cn-border)",
            color: "var(--cn-text-2)",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--cn-primary)"; e.currentTarget.style.color = "var(--cn-primary)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--cn-border)"; e.currentTarget.style.color = "var(--cn-text-2)"; }}
        >
          Edit
        </button>
      </motion.div>

      {/* Theme toggle */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="p-5 rounded-2xl flex items-center justify-between"
        style={{
          background: "var(--cn-card)",
          border: "1px solid var(--cn-border)",
          boxShadow: "var(--cn-shadow)",
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: "rgba(245,158,11,0.1)" }}
          >
            <Moon style={{ width: 18, height: 18, color: "#F59E0B" }} />
          </div>
          <div>
            <p className="text-sm font-semibold" style={{ color: "var(--cn-text)" }}>Theme</p>
            <p className="text-xs" style={{ color: "var(--cn-text-4)" }}>Switch between light and dark mode</p>
          </div>
        </div>
        <ThemeToggle />
      </motion.div>

      {/* Settings sections */}
      {settingsSections.map((section, si) => {
        const SIcon = section.icon;
        return (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 + si * 0.07, duration: 0.4 }}
            className="rounded-2xl overflow-hidden"
            style={{
              background: "var(--cn-card)",
              border: "1px solid var(--cn-border)",
              boxShadow: "var(--cn-shadow)",
            }}
          >
            <div
              className="flex items-center gap-3 px-5 py-4"
              style={{ borderBottom: "1px solid var(--cn-border)" }}
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: `${section.color}15` }}
              >
                <SIcon style={{ width: 15, height: 15, color: section.color }} />
              </div>
              <h3 className="text-sm font-semibold" style={{ color: "var(--cn-text)" }}>
                {section.title}
              </h3>
            </div>
            {section.items.map((item, ii) => (
              <button
                key={item}
                className="w-full flex items-center justify-between px-5 py-3.5 text-left transition-all cursor-pointer"
                style={{
                  borderBottom: ii < section.items.length - 1 ? "1px solid var(--cn-border)" : "none",
                  background: "transparent",
                  color: "var(--cn-text-2)",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "var(--cn-surface-2)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
              >
                <span className="text-sm">{item}</span>
                <ChevronRight style={{ width: 14, height: 14, color: "var(--cn-text-4)" }} />
              </button>
            ))}
          </motion.div>
        );
      })}

      {/* Danger zone */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.4 }}
        className="p-5 rounded-2xl"
        style={{
          background: "rgba(239,68,68,0.04)",
          border: "1px solid rgba(239,68,68,0.2)",
        }}
      >
        <p className="text-sm font-semibold mb-3" style={{ color: "#EF4444" }}>Danger Zone</p>
        <div className="flex gap-3 flex-wrap">
          <button
            onClick={async () => { await logout(); router.push("/auth/login"); }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium cursor-pointer transition-all"
            style={{
              background: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.2)",
              color: "#EF4444",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(239,68,68,0.2)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(239,68,68,0.1)"; }}
          >
            <LogOut style={{ width: 14, height: 14 }} /> Sign Out
          </button>
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium cursor-pointer transition-all"
            style={{
              background: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.2)",
              color: "#EF4444",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(239,68,68,0.2)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(239,68,68,0.1)"; }}
          >
            Delete Account
          </button>
        </div>
      </motion.div>
    </div>
  );
}

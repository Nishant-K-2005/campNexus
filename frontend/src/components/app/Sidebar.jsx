"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  Megaphone,
  MessageSquare,
  FolderOpen,
  Settings,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Sparkles,
} from "lucide-react";

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "communities", label: "Communities", icon: Users },
  { id: "declarations", label: "Declarations", icon: Megaphone },
  { id: "discussions", label: "Discussions", icon: MessageSquare },
  { id: "resources", label: "Resources", icon: FolderOpen },
  { id: "settings", label: "Settings", icon: Settings, divider: true },
];

export default function Sidebar({ activeTab, setActiveTab, collapsed, setCollapsed }) {
  return (
    <motion.aside
      animate={{ width: collapsed ? 64 : 240 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="flex flex-col h-full relative z-10 flex-shrink-0"
      style={{
        background: "var(--cn-surface)",
        borderRight: "1px solid var(--cn-border)",
      }}
    >
      {/* Logo */}
      <div
        className="flex items-center px-4 py-5 gap-3"
        style={{ borderBottom: "1px solid var(--cn-border)" }}
      >
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: "linear-gradient(135deg, #6366F1, #818CF8)" }}
        >
          <GraduationCap className="w-4 h-4 text-white" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.2 }}
              className="text-base font-bold overflow-hidden whitespace-nowrap"
              style={{ color: "var(--cn-text)" }}
            >
              CampNexus
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <div key={item.id}>
              {item.divider && (
                <div
                  className="my-2 h-px mx-2"
                  style={{ background: "var(--cn-border)" }}
                />
              )}
              <button
                onClick={() => setActiveTab(item.id)}
                title={collapsed ? item.label : undefined}
                className={`
                  w-full flex items-center gap-3 px-3 py-2.5 rounded-xl
                  text-sm font-medium transition-all duration-200 cursor-pointer
                  relative group
                `}
                style={{
                  background: isActive ? "var(--cn-primary-l)" : "transparent",
                  color: isActive ? "var(--cn-primary)" : "var(--cn-text-3)",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = "var(--cn-surface-2)";
                    e.currentTarget.style.color = "var(--cn-text)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "var(--cn-text-3)";
                  }
                }}
              >
                {/* Active indicator */}
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full"
                    style={{ background: "var(--cn-primary)" }}
                  />
                )}
                <Icon
                  className="flex-shrink-0"
                  style={{ width: 18, height: 18 }}
                />
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden whitespace-nowrap"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>

                {/* Tooltip for collapsed state */}
                {collapsed && (
                  <div
                    className="absolute left-full ml-3 px-2 py-1 rounded-lg text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50"
                    style={{
                      background: "var(--cn-card)",
                      border: "1px solid var(--cn-border)",
                      color: "var(--cn-text)",
                      boxShadow: "var(--cn-shadow)",
                    }}
                  >
                    {item.label}
                  </div>
                )}
              </button>
            </div>
          );
        })}
      </nav>

      {/* AI Badge */}
      <AnimatePresence>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mx-3 mb-3 p-3 rounded-xl"
            style={{
              background: "linear-gradient(135deg, rgba(99,102,241,0.1), rgba(129,140,248,0.05))",
              border: "1px solid rgba(99,102,241,0.2)",
            }}
          >
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-3.5 h-3.5" style={{ color: "var(--cn-primary)" }} />
              <span className="text-xs font-semibold" style={{ color: "var(--cn-primary)" }}>
                AI Powered
              </span>
            </div>
            <p className="text-xs" style={{ color: "var(--cn-text-4)" }}>
              Smart moderation & content recommendations active
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full flex items-center justify-center transition-all cursor-pointer z-20"
        style={{
          background: "var(--cn-surface)",
          border: "1px solid var(--cn-border)",
          color: "var(--cn-text-3)",
          boxShadow: "var(--cn-shadow)",
        }}
      >
        {collapsed ? (
          <ChevronRight style={{ width: 12, height: 12 }} />
        ) : (
          <ChevronLeft style={{ width: 12, height: 12 }} />
        )}
      </button>
    </motion.aside>
  );
}

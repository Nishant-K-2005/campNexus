"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Bell, TrendingUp, Activity } from "lucide-react";
import useActivityStore from "@/store/activityStore";
import { useRouter } from "next/navigation";

function timeAgo(iso) {
  if (!iso) return "just now";
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

const AI_LABELS = {
  "moderation:pending":  { text: "AI audit in progress…",     color: "#F59E0B" },
  "moderation:approved": { text: "Post approved by AI ✅",     color: "#10B981" },
  "moderation:rejected": { text: "Post rejected by AI ❌",     color: "#EF4444" },
};

const trendingCommunities = [
  { name: "AI Research Club",    members: 248, growth: "+12%" },
  { name: "Hackathon 2026",      members: 512, growth: "+89%" },
  { name: "Design Systems",      members: 134, growth: "+6%"  },
  { name: "CS Department",       members: 420, growth: "+3%"  },
];

export default function RightPanel() {
  const router = useRouter();
  const { notifications, activities, reputation, level, streak, markRead } = useActivityStore();

  const recentNotifs = notifications.slice(0, 3);
  const recentActivity = activities.slice(0, 4);
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <div
      className="h-full w-[300px] overflow-y-auto flex flex-col gap-4 p-4"
      style={{ background: "var(--cn-surface)" }}
    >
      {/* ── User Snapshot ─────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="rounded-2xl p-4"
        style={{
          background: "linear-gradient(135deg, rgba(79,70,229,0.12), rgba(6,182,212,0.06))",
          border: "1px solid rgba(79,70,229,0.18)",
        }}
      >
        <div className="flex items-center gap-2 mb-3">
          <Activity className="w-3.5 h-3.5" style={{ color: "var(--cn-primary)" }} />
          <span className="text-xs font-semibold" style={{ color: "var(--cn-primary)" }}>Your Stats</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "Reputation", value: reputation, emoji: "⭐" },
            { label: "Level",      value: level,       emoji: "🏅" },
            { label: "Streak",     value: `${streak}🔥`, emoji: "" },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-xl p-2 text-center cursor-pointer transition-all"
              style={{ background: "rgba(255,255,255,0.06)" }}
              onClick={() => router.push("/profile")}
              onMouseEnter={(e) => e.currentTarget.style.background = "rgba(79,70,229,0.12)"}
              onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.06)"}
            >
              <p className="text-sm font-bold" style={{ color: "var(--cn-text)" }}>
                {s.value}
              </p>
              <p className="text-[10px]" style={{ color: "var(--cn-text-4)" }}>{s.label}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── Live Activity Feed ─────────── */}
      <div>
        <div className="flex items-center gap-2 mb-2.5">
          <Sparkles className="w-3.5 h-3.5" style={{ color: "var(--cn-primary)" }} />
          <h3 className="text-xs font-semibold" style={{ color: "var(--cn-text)" }}>Live Activity</h3>
          <span
            className="ml-auto w-1.5 h-1.5 rounded-full"
            style={{ background: "#10B981", boxShadow: "0 0 6px #10B981" }}
          />
        </div>
        <div className="space-y-1.5">
          <AnimatePresence mode="popLayout">
            {recentActivity.length === 0 ? (
              <p className="text-xs px-3 py-2" style={{ color: "var(--cn-text-4)" }}>
                No activity yet. Explore the platform!
              </p>
            ) : (
              recentActivity.map((act, i) => (
                <motion.div
                  key={act.id}
                  layout
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ delay: i * 0.06 }}
                  className="flex items-start gap-2.5 rounded-xl p-2.5"
                  style={{
                    background: "var(--cn-card)",
                    border: "1px solid var(--cn-border)",
                  }}
                >
                  <div
                    className="w-6 h-6 rounded-lg flex items-center justify-center text-sm flex-shrink-0 mt-0.5"
                    style={{ background: `${act.color || "#6366F1"}18` }}
                  >
                    {act.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] leading-snug" style={{ color: "var(--cn-text-2)" }}>
                      {act.text}
                    </p>
                    <p className="text-[10px] mt-0.5" style={{ color: "var(--cn-text-4)" }}>
                      {act.time}
                    </p>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Recent Notifications ────────── */}
      <div>
        <div className="flex items-center gap-2 mb-2.5">
          <Bell className="w-3.5 h-3.5" style={{ color: "var(--cn-warning)" }} />
          <h3 className="text-xs font-semibold" style={{ color: "var(--cn-text)" }}>Notifications</h3>
          {unread > 0 && (
            <span
              className="ml-auto px-1.5 py-0.5 rounded-full text-[10px] font-bold text-white"
              style={{ background: "var(--cn-danger)" }}
            >
              {unread}
            </span>
          )}
        </div>
        <div className="space-y-1.5">
          {recentNotifs.length === 0 ? (
            <p className="text-xs px-3 py-2" style={{ color: "var(--cn-text-4)" }}>
              All caught up!
            </p>
          ) : (
            recentNotifs.map((n, i) => (
              <motion.div
                key={n.id}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                onClick={() => markRead(n.id)}
                className="rounded-xl p-2.5 cursor-pointer transition-colors"
                style={{
                  background: n.read ? "var(--cn-card)" : "var(--cn-primary-l)",
                  border: `1px solid ${n.read ? "var(--cn-border)" : "rgba(79,70,229,0.2)"}`,
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = "var(--cn-surface-2)"}
                onMouseLeave={(e) => e.currentTarget.style.background = n.read ? "var(--cn-card)" : "var(--cn-primary-l)"}
              >
                <div className="flex items-start gap-2">
                  <span className="text-sm flex-shrink-0">{n.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] leading-snug" style={{ color: "var(--cn-text-2)", fontWeight: n.read ? 400 : 600 }}>
                      {n.text}
                    </p>
                    <p className="text-[10px] mt-0.5" style={{ color: "var(--cn-text-4)" }}>
                      {timeAgo(n.time)}
                    </p>
                  </div>
                  {!n.read && (
                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1" style={{ background: "var(--cn-primary)" }} />
                  )}
                </div>
              </motion.div>
            ))
          )}
        </div>
        {notifications.length > 3 && (
          <button
            onClick={() => router.push("/notifications")}
            className="w-full mt-2 py-2 rounded-xl text-[11px] font-semibold transition-colors"
            style={{
              background: "var(--cn-primary-l)",
              color: "var(--cn-primary)",
              border: "1px solid rgba(79,70,229,0.2)",
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = "rgba(79,70,229,0.15)"}
            onMouseLeave={(e) => e.currentTarget.style.background = "var(--cn-primary-l)"}
          >
            View all {notifications.length} notifications →
          </button>
        )}
      </div>

      {/* ── Trending Communities ─────── */}
      <div>
        <div className="flex items-center gap-2 mb-2.5">
          <TrendingUp className="w-3.5 h-3.5" style={{ color: "var(--cn-success)" }} />
          <h3 className="text-xs font-semibold" style={{ color: "var(--cn-text)" }}>Trending</h3>
        </div>
        <div className="space-y-1.5">
          {trendingCommunities.map((c, i) => (
            <motion.div
              key={c.name}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.06 }}
              className="flex items-center justify-between rounded-xl p-2.5 cursor-pointer transition-colors"
              style={{ background: "var(--cn-card)", border: "1px solid var(--cn-border)" }}
              onMouseEnter={(e) => e.currentTarget.style.background = "var(--cn-surface-2)"}
              onMouseLeave={(e) => e.currentTarget.style.background = "var(--cn-card)"}
            >
              <div>
                <p className="text-[11px] font-medium" style={{ color: "var(--cn-text)" }}>{c.name}</p>
                <p className="text-[10px]" style={{ color: "var(--cn-text-4)" }}>{c.members.toLocaleString()} members</p>
              </div>
              <span
                className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
                style={{ background: "rgba(16,185,129,0.12)", color: "#10B981" }}
              >
                {c.growth}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

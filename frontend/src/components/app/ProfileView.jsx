"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star, Zap, Flame, Award, TrendingUp, Users,
  MessageSquare, FolderOpen, Shield, Trophy,
  ChevronRight, Edit3, BookOpen, BarChart2,
} from "lucide-react";
import useAuthStore from "@/store/authStore";
import useActivityStore from "@/store/activityStore";

/* ─── Utility ─────────────────────────────── */
const XP_PER_LEVEL = 500;

function getLevelTitle(level) {
  const titles = [
    "Newcomer", "Explorer", "Contributor", "Scholar", "Mentor",
    "Expert", "Pioneer", "Legend", "Grandmaster", "Campus God",
  ];
  return titles[Math.min(level - 1, titles.length - 1)];
}

function getRoleColor(role) {
  const map = {
    Student: "#6366F1",
    Professor: "#10B981",
    ClubHead: "#F59E0B",
    Admin: "#EF4444",
  };
  return map[role] || "#6366F1";
}

/* ─── Sub-components ──────────────────────── */
function XPProgressBar({ xp, level }) {
  const xpInLevel = xp % XP_PER_LEVEL;
  const pct = Math.min((xpInLevel / XP_PER_LEVEL) * 100, 100);
  const xpToNext = XP_PER_LEVEL - xpInLevel;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium" style={{ color: "var(--cn-text-3)" }}>
          Level {level} → {level + 1}
        </span>
        <span className="text-xs font-semibold" style={{ color: "var(--cn-primary)" }}>
          {xpInLevel} / {XP_PER_LEVEL} XP
        </span>
      </div>
      <div
        className="relative w-full h-3 rounded-full overflow-hidden"
        style={{ background: "var(--cn-surface-2)" }}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
          className="h-full rounded-full"
          style={{
            background: "linear-gradient(90deg, #4F46E5, #818CF8, #06B6D4)",
            boxShadow: "0 0 8px rgba(79,70,229,0.5)",
          }}
        />
        {/* Glow pulse */}
        <motion.div
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute right-0 top-0 h-full w-4 rounded-full"
          style={{
            background: "linear-gradient(90deg, transparent, rgba(129,140,248,0.8))",
            display: pct > 5 ? "block" : "none",
          }}
        />
      </div>
      <p className="text-xs" style={{ color: "var(--cn-text-4)" }}>
        {xpToNext} XP until Level {level + 1}
      </p>
    </div>
  );
}

function StatChip({ icon: Icon, label, value, color }) {
  return (
    <div
      className="flex flex-col items-center gap-1.5 p-4 rounded-2xl text-center"
      style={{
        background: "var(--cn-surface)",
        border: "1px solid var(--cn-border)",
        minWidth: 90,
      }}
    >
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center"
        style={{ background: `${color}18` }}
      >
        <Icon style={{ width: 16, height: 16, color }} />
      </div>
      <p className="text-lg font-bold" style={{ color: "var(--cn-text)" }}>{value}</p>
      <p className="text-[11px]" style={{ color: "var(--cn-text-4)" }}>{label}</p>
    </div>
  );
}

function BadgeCard({ badge, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.07, duration: 0.35 }}
      whileHover={{ y: -4, boxShadow: "var(--cn-shadow-lg)" }}
      className="flex flex-col items-center gap-2 p-4 rounded-2xl text-center cursor-default transition-all"
      style={{
        background: "var(--cn-card)",
        border: "1px solid var(--cn-border)",
        boxShadow: "var(--cn-shadow)",
      }}
    >
      <div
        className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
        style={{
          background: "linear-gradient(135deg, rgba(99,102,241,0.12), rgba(6,182,212,0.08))",
          border: "1px solid rgba(99,102,241,0.2)",
        }}
      >
        {badge.icon}
      </div>
      <div>
        <p className="text-xs font-semibold" style={{ color: "var(--cn-text)" }}>
          {badge.title}
        </p>
        <p className="text-[10px] mt-0.5" style={{ color: "var(--cn-text-4)" }}>
          {badge.desc}
        </p>
        <p className="text-[10px] mt-0.5" style={{ color: "var(--cn-text-4)" }}>
          {badge.date}
        </p>
      </div>
    </motion.div>
  );
}

const LEADERBOARD = [
  { rank: 1, name: "Arjun Mehta", rep: 1840, avatar: "🦁", role: "Student" },
  { rank: 2, name: "Priya Sharma", rep: 1650, avatar: "🌸", role: "Professor" },
  { rank: 3, name: "Dev Kapoor", rep: 1520, avatar: "⚡", role: "ClubHead" },
  { rank: 4, name: "Riya Patel", rep: 1380, avatar: "🌟", role: "Student" },
  { rank: 5, name: "Vikram Nair", rep: 1240, avatar: "🔥", role: "Student" },
];

function LeaderboardRow({ entry, isSelf, index }) {
  const rankColors = ["#F59E0B", "#9CA3AF", "#B45309"];
  const color = getRoleColor(entry.role);

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.06 }}
      className="flex items-center gap-3 p-3 rounded-xl transition-all"
      style={{
        background: isSelf ? "var(--cn-primary-l)" : "transparent",
        border: isSelf ? "1px solid rgba(79,70,229,0.2)" : "1px solid transparent",
      }}
      onMouseEnter={(e) => { if (!isSelf) e.currentTarget.style.background = "var(--cn-surface-2)"; }}
      onMouseLeave={(e) => { if (!isSelf) e.currentTarget.style.background = "transparent"; }}
    >
      <span
        className="text-sm font-bold w-6 text-center flex-shrink-0"
        style={{ color: rankColors[entry.rank - 1] || "var(--cn-text-4)" }}
      >
        {entry.rank <= 3 ? ["🥇", "🥈", "🥉"][entry.rank - 1] : `#${entry.rank}`}
      </span>
      <div
        className="w-8 h-8 rounded-xl flex items-center justify-center text-base flex-shrink-0"
        style={{ background: `${color}18` }}
      >
        {entry.avatar}
      </div>
      <div className="flex-1 min-w-0">
        <p
          className="text-sm font-semibold truncate"
          style={{ color: isSelf ? "var(--cn-primary)" : "var(--cn-text)" }}
        >
          {entry.name} {isSelf && <span className="text-[10px]">(You)</span>}
        </p>
        <p className="text-[11px]" style={{ color: color }}>{entry.role}</p>
      </div>
      <span className="text-sm font-bold flex-shrink-0" style={{ color: "var(--cn-text)" }}>
        {entry.rep.toLocaleString()} ⭐
      </span>
    </motion.div>
  );
}

/* ─── Main View ───────────────────────────── */
export default function ProfileView() {
  const { user, profile } = useAuthStore();
  const { reputation, xp, level, streak, badges, activities } = useActivityStore();
  const [activeTab, setActiveTab] = useState("overview");

  const levelTitle = getLevelTitle(level);
  const roleColor = getRoleColor(user?.role);
  const displayName = user?.full_name || profile?.full_name || user?.email?.split("@")[0] || "User";
  const initials = displayName.split(" ").map((p) => p[0]).join("").toUpperCase().slice(0, 2);

  const tabs = ["overview", "badges", "activity", "leaderboard"];

  return (
    <div className="p-5 sm:p-8 max-w-5xl mx-auto space-y-6">
      {/* Hero Card */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-3xl p-6 sm:p-8"
        style={{
          background: "var(--cn-card)",
          border: "1px solid var(--cn-border)",
          boxShadow: "var(--cn-shadow-lg)",
        }}
      >
        {/* Background glow */}
        <div
          className="absolute inset-0 opacity-30 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at top right, ${roleColor}25, transparent 60%)`,
          }}
        />

        <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-6">
          {/* Avatar */}
          <div className="relative">
            <div
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl flex items-center justify-center text-3xl sm:text-4xl font-bold text-white flex-shrink-0"
              style={{
                background: `linear-gradient(135deg, ${roleColor}, ${roleColor}99)`,
                boxShadow: `0 8px 32px ${roleColor}40`,
              }}
            >
              {initials}
            </div>
            {/* Level badge */}
            <div
              className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white border-2"
              style={{
                background: "linear-gradient(135deg, #4F46E5, #818CF8)",
                borderColor: "var(--cn-card)",
              }}
            >
              {level}
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h1 className="text-xl sm:text-2xl font-bold" style={{ color: "var(--cn-text)" }}>
                {displayName}
              </h1>
              <span
                className="px-2.5 py-0.5 rounded-full text-xs font-semibold"
                style={{ background: `${roleColor}18`, color: roleColor }}
              >
                {user?.role || "Student"}
              </span>
            </div>
            <p className="text-sm mb-1" style={{ color: "var(--cn-text-3)" }}>
              {user?.email}
            </p>
            <p className="text-xs font-medium mb-4" style={{ color: "var(--cn-primary)" }}>
              {levelTitle} · Level {level}
            </p>
            <XPProgressBar xp={xp} level={level} />
          </div>

          {/* Edit button */}
          <button
            className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium transition-all self-start"
            style={{
              background: "var(--cn-surface)",
              color: "var(--cn-text-3)",
              border: "1px solid var(--cn-border)",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "var(--cn-primary)"; e.currentTarget.style.borderColor = "rgba(79,70,229,0.3)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "var(--cn-text-3)"; e.currentTarget.style.borderColor = "var(--cn-border)"; }}
          >
            <Edit3 style={{ width: 12, height: 12 }} />
            Edit Profile
          </button>
        </div>

        {/* Stats strip */}
        <div className="relative mt-6 flex flex-wrap gap-3">
          <StatChip icon={Star} label="Reputation" value={reputation} color="#F59E0B" />
          <StatChip icon={Zap} label="Total XP" value={`${xp.toLocaleString()}`} color="#6366F1" />
          <StatChip icon={Flame} label="Day Streak" value={`${streak}🔥`} color="#EF4444" />
          <StatChip icon={Award} label="Badges" value={badges.length} color="#8B5CF6" />
          <StatChip icon={Trophy} label="Level" value={level} color="#10B981" />
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex gap-1 p-1 rounded-2xl"
        style={{ background: "var(--cn-surface)", border: "1px solid var(--cn-border)", width: "fit-content" }}
      >
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all"
            style={{
              background: activeTab === tab ? "linear-gradient(135deg, #4F46E5, #6366F1)" : "transparent",
              color: activeTab === tab ? "#fff" : "var(--cn-text-3)",
              boxShadow: activeTab === tab ? "0 4px 12px rgba(79,70,229,0.3)" : "none",
            }}
          >
            {tab}
          </button>
        ))}
      </motion.div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === "overview" && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-6"
          >
            {/* Recent Badges preview */}
            <div
              className="p-5 rounded-2xl"
              style={{ background: "var(--cn-card)", border: "1px solid var(--cn-border)", boxShadow: "var(--cn-shadow)" }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold" style={{ color: "var(--cn-text)" }}>Recent Badges</h3>
                <button
                  className="text-xs font-medium"
                  style={{ color: "var(--cn-primary)" }}
                  onClick={() => setActiveTab("badges")}
                >
                  View all
                </button>
              </div>
              {badges.length === 0 ? (
                <p className="text-xs" style={{ color: "var(--cn-text-4)" }}>No badges earned yet. Keep contributing!</p>
              ) : (
                <div className="flex flex-wrap gap-3">
                  {badges.slice(0, 4).map((b, i) => (
                    <div
                      key={b.id}
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-xl"
                      style={{ background: "var(--cn-surface-2)", border: "1px solid var(--cn-border)" }}
                      title={b.title}
                    >
                      {b.icon}
                    </div>
                  ))}
                  {badges.length > 4 && (
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-xs font-semibold"
                      style={{ background: "var(--cn-surface-2)", color: "var(--cn-text-3)" }}
                    >
                      +{badges.length - 4}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Streak & Activity */}
            <div
              className="p-5 rounded-2xl"
              style={{ background: "var(--cn-card)", border: "1px solid var(--cn-border)", boxShadow: "var(--cn-shadow)" }}
            >
              <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--cn-text)" }}>Activity Streak</h3>
              <div className="flex flex-col items-center gap-3">
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ repeat: Infinity, duration: 2.5 }}
                  className="text-5xl"
                >
                  🔥
                </motion.div>
                <p className="text-3xl font-bold" style={{ color: "var(--cn-text)" }}>
                  {streak} <span className="text-base font-medium" style={{ color: "var(--cn-text-4)" }}>days</span>
                </p>
                <p className="text-xs" style={{ color: "var(--cn-text-4)" }}>
                  Keep it up! Log in daily to grow your streak.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "badges" && (
          <motion.div
            key="badges"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
          >
            {badges.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3">
                <div className="text-5xl">🏅</div>
                <p className="text-sm font-medium" style={{ color: "var(--cn-text-3)" }}>No badges yet</p>
                <p className="text-xs" style={{ color: "var(--cn-text-4)" }}>
                  Participate in discussions, share resources, and contribute to earn badges.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {badges.map((badge, i) => <BadgeCard key={badge.id} badge={badge} index={i} />)}
              </div>
            )}
          </motion.div>
        )}

        {activeTab === "activity" && (
          <motion.div
            key="activity"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="rounded-2xl overflow-hidden"
            style={{ background: "var(--cn-card)", border: "1px solid var(--cn-border)", boxShadow: "var(--cn-shadow)" }}
          >
            <div className="p-5 space-y-1">
              {activities.length === 0 ? (
                <p className="text-center py-8 text-sm" style={{ color: "var(--cn-text-4)" }}>
                  No recent activity. Explore the platform to get started!
                </p>
              ) : (
                activities.map((act, i) => (
                  <motion.div
                    key={act.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="flex items-center gap-3 p-3 rounded-xl transition-colors"
                    onMouseEnter={(e) => e.currentTarget.style.background = "var(--cn-surface-2)"}
                    onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-base flex-shrink-0"
                      style={{ background: `${act.color || "#6366F1"}18` }}
                    >
                      {act.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm truncate" style={{ color: "var(--cn-text-2)" }}>{act.text}</p>
                    </div>
                    <span className="text-xs flex-shrink-0" style={{ color: "var(--cn-text-4)" }}>
                      {act.time}
                    </span>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        )}

        {activeTab === "leaderboard" && (
          <motion.div
            key="leaderboard"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="rounded-2xl overflow-hidden"
            style={{ background: "var(--cn-card)", border: "1px solid var(--cn-border)", boxShadow: "var(--cn-shadow)" }}
          >
            <div className="p-5 border-b" style={{ borderColor: "var(--cn-border)" }}>
              <div className="flex items-center gap-2">
                <Trophy style={{ width: 16, height: 16, color: "#F59E0B" }} />
                <h3 className="text-sm font-semibold" style={{ color: "var(--cn-text)" }}>Campus Leaderboard</h3>
                <span className="ml-auto text-xs" style={{ color: "var(--cn-text-4)" }}>Top by reputation</span>
              </div>
            </div>
            <div className="p-4 space-y-1">
              {LEADERBOARD.map((entry, i) => (
                <LeaderboardRow
                  key={entry.rank}
                  entry={entry}
                  index={i}
                  isSelf={entry.name === displayName}
                />
              ))}
              {/* Current user if not in top 5 */}
              {!LEADERBOARD.some((e) => e.name === displayName) && (
                <>
                  <div className="flex items-center gap-2 py-2 px-3">
                    <div className="flex-1 h-px" style={{ background: "var(--cn-border)" }} />
                    <span className="text-xs" style={{ color: "var(--cn-text-4)" }}>your ranking</span>
                    <div className="flex-1 h-px" style={{ background: "var(--cn-border)" }} />
                  </div>
                  <LeaderboardRow
                    entry={{ rank: 42, name: displayName, rep: reputation, avatar: initials, role: user?.role || "Student" }}
                    isSelf={true}
                    index={6}
                  />
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

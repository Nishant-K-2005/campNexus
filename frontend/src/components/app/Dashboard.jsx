"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

import {
  Users, MessageSquare, FolderOpen, Megaphone,
  TrendingUp, BookOpen, Award, Activity,
  ArrowUpRight, Zap, Clock, Star,
} from "lucide-react";
import useAuthStore from "@/store/authStore";

const stats = [
  { label: "Communities Joined", value: "8", sub: "+2 this week", icon: Users, color: "#6366F1", bg: "rgba(99,102,241,0.1)" },
  { label: "Discussions", value: "47", sub: "12 unanswered", icon: MessageSquare, color: "#10B981", bg: "rgba(16,185,129,0.1)" },
  { label: "Resources Saved", value: "134", sub: "23 downloaded", icon: FolderOpen, color: "#F59E0B", bg: "rgba(245,158,11,0.1)" },
  { label: "Declarations", value: "6", sub: "2 upcoming events", icon: Megaphone, color: "#EF4444", bg: "rgba(239,68,68,0.1)" },
];

const recentActivity = [
  { type: "discussion", text: "Replied in 'Data Structures & Algorithms'", time: "10 min ago", icon: "💬", color: "#6366F1" },
  { type: "resource", text: "Downloaded 'Machine Learning Notes.pdf'", time: "1h ago", icon: "📄", color: "#10B981" },
  { type: "community", text: "Joined AI Research Club", time: "3h ago", icon: "🏛️", color: "#F59E0B" },
  { type: "event", text: "Registered for Hackathon 2026", time: "Yesterday", icon: "🚀", color: "#EF4444" },
  { type: "declaration", text: "New notice: Mid-term Schedule Released", time: "2 days ago", icon: "📣", color: "#8B5CF6" },
];

const upcomingEvents = [
  { title: "Hackathon 2026 Finals", date: "Jun 15", tag: "Event", urgent: true },
  { title: "AI Research Symposium", date: "Jun 18", tag: "Academic" },
  { title: "Club Meet – Tech Society", date: "Jun 20", tag: "Community" },
  { title: "Mid-term Exams Begin", date: "Jun 25", tag: "Academic", urgent: true },
];

const quickStats = [
  { label: "Active Streak", value: "12 days", icon: Zap, color: "#F59E0B" },
  { label: "Posts Liked", value: "89", icon: Star, color: "#EF4444" },
  { label: "Avg. Response Time", value: "~2h", icon: Clock, color: "#10B981" },
  { label: "Top Contributor", value: "#3 in AI Club", icon: Award, color: "#8B5CF6" },
];

function StatCard({ stat, index }) {
  const Icon = stat.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      whileHover={{ y: -3, boxShadow: "var(--cn-shadow-lg)" }}
      className="p-5 rounded-2xl cursor-default"
      style={{
        background: "var(--cn-card)",
        border: "1px solid var(--cn-border)",
        boxShadow: "var(--cn-shadow)",
        transition: "all 0.2s ease",
      }}
    >
      <div className="flex items-start justify-between">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: stat.bg }}
        >
          <Icon style={{ width: 18, height: 18, color: stat.color }} />
        </div>
        <ArrowUpRight style={{ width: 14, height: 14, color: "var(--cn-text-4)" }} />
      </div>
      <div className="mt-4">
        <p className="text-2xl font-bold" style={{ color: "var(--cn-text)" }}>{stat.value}</p>
        <p className="text-sm font-medium mt-0.5" style={{ color: "var(--cn-text-2)" }}>{stat.label}</p>
        <p className="text-xs mt-1" style={{ color: stat.color }}>{stat.sub}</p>
      </div>
    </motion.div>
  );
}

export default function DashboardView() {
  const { user } = useAuthStore();
  const [communityCount, setCommunityCount] = useState(null);

  useEffect(() => {
    import("@/lib/api").then(({ default: api }) => {
      api.communities.getAll()
        .then((d) => setCommunityCount((d.communities || []).length))
        .catch(() => setCommunityCount(0));
    });
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const firstName = user?.full_name?.split(" ")[0] || "there";

  const liveStats = stats.map((s) =>
    s.label === "Communities Joined" && communityCount !== null
      ? { ...s, value: String(communityCount) }
      : s
  );

  return (
    <div className="p-5 sm:p-8 max-w-7xl mx-auto space-y-8">
      {/* Welcome */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold" style={{ color: "var(--cn-text)" }}>
              {greeting}, {firstName} 👋
            </h2>
            <p className="mt-1 text-sm" style={{ color: "var(--cn-text-3)" }}>
              Here&apos;s what&apos;s happening in your campus today
            </p>
          </div>
          <div
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl self-start sm:self-auto"
            style={{
              background: "linear-gradient(135deg, rgba(99,102,241,0.1), rgba(129,140,248,0.05))",
              border: "1px solid rgba(99,102,241,0.2)",
            }}
          >
            <Activity style={{ width: 15, height: 15, color: "var(--cn-primary)" }} />
            <span className="text-sm font-medium" style={{ color: "var(--cn-primary)" }}>Campus is Active</span>
            <span
              className="w-2 h-2 rounded-full"
              style={{ background: "#10B981", boxShadow: "0 0 6px #10B981" }}
            />
          </div>
        </div>
      </motion.div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {liveStats.map((stat, i) => <StatCard key={stat.label} stat={stat} index={i} />)}
      </div>

      {/* Quick stats strip */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.4 }}
        className="grid grid-cols-2 sm:grid-cols-4 gap-3"
      >
        {quickStats.map(({ label, value, icon: Icon, color }) => (
          <div
            key={label}
            className="flex items-center gap-3 px-4 py-3 rounded-xl"
            style={{
              background: "var(--cn-surface)",
              border: "1px solid var(--cn-border)",
            }}
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: `${color}15` }}
            >
              <Icon style={{ width: 14, height: 14, color }} />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate" style={{ color: "var(--cn-text)" }}>{value}</p>
              <p className="text-xs truncate" style={{ color: "var(--cn-text-4)" }}>{label}</p>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Bottom grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="lg:col-span-2 rounded-2xl p-6"
          style={{
            background: "var(--cn-card)",
            border: "1px solid var(--cn-border)",
            boxShadow: "var(--cn-shadow)",
          }}
        >
          <div className="flex justify-between items-center mb-5">
            <h3 className="text-base font-semibold" style={{ color: "var(--cn-text)" }}>Recent Activity</h3>
            <button className="text-xs font-medium cursor-pointer" style={{ color: "var(--cn-primary)" }}>View all</button>
          </div>
          <div className="space-y-3">
            {recentActivity.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.06 }}
                className="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all"
                style={{ background: "transparent" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "var(--cn-surface-2)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                  style={{ background: `${item.color}15` }}
                >
                  {item.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: "var(--cn-text-2)" }}>
                    {item.text}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: "var(--cn-text-4)" }}>{item.time}</p>
                </div>
                <div
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ background: item.color }}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Upcoming Events */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="rounded-2xl p-6"
          style={{
            background: "var(--cn-card)",
            border: "1px solid var(--cn-border)",
            boxShadow: "var(--cn-shadow)",
          }}
        >
          <div className="flex justify-between items-center mb-5">
            <h3 className="text-base font-semibold" style={{ color: "var(--cn-text)" }}>Upcoming</h3>
            <button className="text-xs font-medium cursor-pointer" style={{ color: "var(--cn-primary)" }}>Calendar</button>
          </div>
          <div className="space-y-3">
            {upcomingEvents.map((ev, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all"
                style={{ background: "transparent" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "var(--cn-surface-2)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
              >
                <div
                  className="flex-shrink-0 text-center w-11 h-11 rounded-xl flex flex-col items-center justify-center"
                  style={{
                    background: ev.urgent ? "rgba(239,68,68,0.1)" : "var(--cn-surface-2)",
                    border: `1px solid ${ev.urgent ? "rgba(239,68,68,0.2)" : "var(--cn-border)"}`,
                  }}
                >
                  <span className="text-[10px] font-semibold" style={{ color: ev.urgent ? "#EF4444" : "var(--cn-text-4)" }}>
                    {ev.date.split(" ")[0].toUpperCase()}
                  </span>
                  <span className="text-sm font-bold" style={{ color: ev.urgent ? "#EF4444" : "var(--cn-text)" }}>
                    {ev.date.split(" ")[1]}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold truncate" style={{ color: "var(--cn-text)" }}>
                    {ev.title}
                  </p>
                  <span
                    className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-semibold"
                    style={{
                      background: ev.tag === "Academic" ? "rgba(99,102,241,0.1)" : ev.tag === "Event" ? "rgba(239,68,68,0.1)" : "rgba(16,185,129,0.1)",
                      color: ev.tag === "Academic" ? "#6366F1" : ev.tag === "Event" ? "#EF4444" : "#10B981",
                    }}
                  >
                    {ev.tag}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Users, MessageSquare, FolderOpen, Megaphone, Award,
  TrendingUp, Sparkles, Calendar, ArrowUpRight, BookOpen,
} from "lucide-react";
import useAuthStore from "@/store/authStore";
import api from "@/lib/api";

const recentDiscussions = [
  { title: "Best resources for ML midterms?", community: "AI Research Club", time: "12m ago" },
  { title: "Hackathon team formation", community: "Tech Society", time: "1h ago" },
  { title: "Office hours this week?", community: "CS101", time: "3h ago" },
];

const recommendedResources = [
  { name: "Linear Algebra Notes.pdf", community: "Mathematics", type: "PDF" },
  { name: "Week 4 Slides.pptx", community: "Data Structures", type: "PPT" },
  { name: "Lab Manual.docx", community: "Robotics", type: "DOCX" },
];

const recentDeclarations = [
  { title: "Mid-term exam schedule released", type: "Academic", pinned: true },
  { title: "Campus Wi-Fi maintenance", type: "Notice", pinned: false },
  { title: "Club fair registration open", type: "Event", pinned: true },
];

const upcomingEvents = [
  { title: "Hackathon 2026 Finals", date: "Jun 15", tag: "Event" },
  { title: "AI Research Symposium", date: "Jun 18", tag: "Academic" },
  { title: "Club Meet – Tech Society", date: "Jun 20", tag: "Community" },
];

const activityTimeline = [
  { text: "Joined AI Research Club", time: "Today, 10:30 AM", icon: Users },
  { text: "Uploaded study notes", time: "Yesterday", icon: FolderOpen },
  { text: "Replied in Discussions", time: "2 days ago", icon: MessageSquare },
];

function OverviewCard({ children, className = "", delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      whileHover={{ y: -2 }}
      className={`rounded-2xl p-5 ${className}`}
      style={{
        background: "var(--cn-card)",
        border: "1px solid var(--cn-border)",
        boxShadow: "var(--cn-shadow)",
      }}
    >
      {children}
    </motion.div>
  );
}

export default function DashboardOverview() {
  const { user, profile } = useAuthStore();
  const [communityCount, setCommunityCount] = useState(0);

  useEffect(() => {
    api.communities.getAll()
      .then((d) => setCommunityCount((d?.communities || []).length))
      .catch(() => setCommunityCount(0));
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const firstName = user?.full_name?.split(" ")[0] || "there";
  const reputation = profile?.reputation_points ?? 0;

  const statCards = [
    { label: "Communities Joined", value: communityCount, icon: Users, color: "#6366F1" },
    { label: "Reputation Points", value: reputation, icon: Award, color: "#10B981" },
    { label: "Recent Discussions", value: recentDiscussions.length, icon: MessageSquare, color: "#F59E0B" },
    { label: "Resources Saved", value: recommendedResources.length, icon: FolderOpen, color: "#8B5CF6" },
  ];

  return (
    <div className="p-5 sm:p-8 max-w-7xl mx-auto space-y-8">
      {/* Welcome */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-2xl sm:text-3xl font-bold" style={{ color: "var(--cn-text)" }}>
          {greeting}, {firstName} 👋
        </h2>
        <p className="mt-1 text-sm" style={{ color: "var(--cn-text-3)" }}>
          Welcome back — here&apos;s your campus at a glance
        </p>
      </motion.div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <OverviewCard key={stat.label} delay={i * 0.06}>
              <div className="flex items-start justify-between">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: `${stat.color}15` }}
                >
                  <Icon style={{ width: 18, height: 18, color: stat.color }} />
                </div>
                <ArrowUpRight style={{ width: 14, height: 14, color: "var(--cn-text-4)" }} />
              </div>
              <p className="mt-4 text-2xl font-bold" style={{ color: "var(--cn-text)" }}>{stat.value}</p>
              <p className="text-sm font-medium mt-0.5" style={{ color: "var(--cn-text-2)" }}>{stat.label}</p>
            </OverviewCard>
          );
        })}
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Discussions */}
        <OverviewCard className="lg:col-span-2" delay={0.2}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-base font-semibold" style={{ color: "var(--cn-text)" }}>Recent Discussions</h3>
            <Link href="/discussions" className="text-xs font-medium" style={{ color: "var(--cn-primary)" }}>View all</Link>
          </div>
          <div className="space-y-2">
            {recentDiscussions.map((d, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-3 rounded-xl transition-colors cursor-pointer"
                style={{ background: "var(--cn-surface)" }}
              >
                <MessageSquare style={{ width: 16, height: 16, color: "var(--cn-primary)" }} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: "var(--cn-text)" }}>{d.title}</p>
                  <p className="text-xs" style={{ color: "var(--cn-text-4)" }}>{d.community} · {d.time}</p>
                </div>
              </div>
            ))}
          </div>
        </OverviewCard>

        {/* AI Insights */}
        <OverviewCard delay={0.25}>
          <div className="flex items-center gap-2 mb-4">
            <Sparkles style={{ width: 16, height: 16, color: "var(--cn-primary)" }} />
            <h3 className="text-base font-semibold" style={{ color: "var(--cn-text)" }}>AI Insights</h3>
          </div>
          <div className="space-y-3">
            {[
              "Your posts match community topics at 82%",
              "2 discussions recommended for you",
              "Moderation queue: 1 pending post",
            ].map((text, i) => (
              <p key={i} className="text-xs leading-relaxed p-3 rounded-xl" style={{ background: "var(--cn-surface)", color: "var(--cn-text-2)" }}>
                {text}
              </p>
            ))}
          </div>
        </OverviewCard>
      </div>

      {/* Second row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <OverviewCard delay={0.3}>
          <div className="flex justify-between mb-4">
            <h3 className="text-base font-semibold" style={{ color: "var(--cn-text)" }}>Recommended Resources</h3>
            <Link href="/resources" className="text-xs" style={{ color: "var(--cn-primary)" }}>Browse</Link>
          </div>
          {recommendedResources.map((r, i) => (
            <div key={i} className="flex items-center gap-3 py-2">
              <BookOpen style={{ width: 14, height: 14, color: "var(--cn-warning)" }} />
              <div>
                <p className="text-xs font-medium" style={{ color: "var(--cn-text)" }}>{r.name}</p>
                <p className="text-[10px]" style={{ color: "var(--cn-text-4)" }}>{r.community} · {r.type}</p>
              </div>
            </div>
          ))}
        </OverviewCard>

        <OverviewCard delay={0.35}>
          <div className="flex justify-between mb-4">
            <h3 className="text-base font-semibold" style={{ color: "var(--cn-text)" }}>Recent Declarations</h3>
            <Link href="/declarations" className="text-xs" style={{ color: "var(--cn-primary)" }}>View all</Link>
          </div>
          {recentDeclarations.map((d, i) => (
            <div key={i} className="flex items-start gap-2 py-2">
              <Megaphone style={{ width: 14, height: 14, color: d.pinned ? "var(--cn-danger)" : "var(--cn-text-4)", marginTop: 2 }} />
              <div>
                <p className="text-xs font-medium" style={{ color: "var(--cn-text)" }}>{d.title}</p>
                <span className="text-[10px]" style={{ color: "var(--cn-primary)" }}>{d.type}</span>
              </div>
            </div>
          ))}
        </OverviewCard>

        <OverviewCard delay={0.4}>
          <div className="flex items-center gap-2 mb-4">
            <Calendar style={{ width: 16, height: 16, color: "var(--cn-primary)" }} />
            <h3 className="text-base font-semibold" style={{ color: "var(--cn-text)" }}>Upcoming Events</h3>
          </div>
          {upcomingEvents.map((ev, i) => (
            <div key={i} className="flex items-center gap-3 py-2">
              <div
                className="w-10 h-10 rounded-lg flex flex-col items-center justify-center text-center flex-shrink-0"
                style={{ background: "var(--cn-surface-2)", border: "1px solid var(--cn-border)" }}
              >
                <span className="text-[9px] font-bold" style={{ color: "var(--cn-text-4)" }}>{ev.date.split(" ")[0]}</span>
                <span className="text-xs font-bold" style={{ color: "var(--cn-text)" }}>{ev.date.split(" ")[1]}</span>
              </div>
              <div>
                <p className="text-xs font-medium" style={{ color: "var(--cn-text)" }}>{ev.title}</p>
                <span className="text-[10px]" style={{ color: "var(--cn-text-4)" }}>{ev.tag}</span>
              </div>
            </div>
          ))}
        </OverviewCard>
      </div>

      {/* Activity timeline + trending */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <OverviewCard delay={0.45}>
          <h3 className="text-base font-semibold mb-4" style={{ color: "var(--cn-text)" }}>Activity Timeline</h3>
          {activityTimeline.map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} className="flex gap-3 py-3" style={{ borderBottom: i < activityTimeline.length - 1 ? "1px solid var(--cn-border)" : "none" }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "var(--cn-primary-l)" }}>
                  <Icon style={{ width: 14, height: 14, color: "var(--cn-primary)" }} />
                </div>
                <div>
                  <p className="text-sm" style={{ color: "var(--cn-text-2)" }}>{item.text}</p>
                  <p className="text-xs mt-0.5" style={{ color: "var(--cn-text-4)" }}>{item.time}</p>
                </div>
              </div>
            );
          })}
        </OverviewCard>

        <OverviewCard delay={0.5}>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp style={{ width: 16, height: 16, color: "var(--cn-success)" }} />
            <h3 className="text-base font-semibold" style={{ color: "var(--cn-text)" }}>Trending Communities</h3>
          </div>
          {["AI Research Club", "Robotics Society", "Entrepreneurship Hub"].map((name, i) => (
            <div key={i} className="flex items-center justify-between py-3" style={{ borderBottom: i < 2 ? "1px solid var(--cn-border)" : "none" }}>
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold text-white"
                  style={{ background: `linear-gradient(135deg, #6366F1, #818CF8)` }}
                >
                  {name[0]}
                </div>
                <span className="text-sm font-medium" style={{ color: "var(--cn-text)" }}>{name}</span>
              </div>
              <Link href="/communities" className="text-xs font-medium" style={{ color: "var(--cn-primary)" }}>Join</Link>
            </div>
          ))}
        </OverviewCard>
      </div>
    </div>
  );
}

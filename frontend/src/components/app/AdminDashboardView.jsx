"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield, Users, Flag, BarChart2, Globe,
  Search, Trash2, UserCog, ChevronDown, ChevronUp,
  CheckCircle, XCircle, AlertTriangle, Eye,
  TrendingUp, Zap, Activity, Brain, Award,
  RefreshCw, Filter, MoreVertical, Crown,
} from "lucide-react";
import useAuthStore from "@/store/authStore";

/* ─── Mock Data (replaced by API when backend is live) ─── */
const MOCK_USERS = [
  { user_id: "u1", full_name: "Arjun Mehta",   email: "arjun@campus.edu",   role: "Student",   reputation: 1840, joined: "2024-01-15", status: "active" },
  { user_id: "u2", full_name: "Priya Sharma",   email: "priya@campus.edu",   role: "Professor", reputation: 1650, joined: "2023-08-20", status: "active" },
  { user_id: "u3", full_name: "Dev Kapoor",     email: "dev@campus.edu",     role: "ClubHead",  reputation: 1520, joined: "2024-03-10", status: "active" },
  { user_id: "u4", full_name: "Riya Patel",     email: "riya@campus.edu",    role: "Student",   reputation: 1380, joined: "2024-05-01", status: "active" },
  { user_id: "u5", full_name: "Vikram Nair",    email: "vikram@campus.edu",  role: "Student",   reputation: 320,  joined: "2025-01-10", status: "suspended" },
  { user_id: "u6", full_name: "Sneha Joshi",    email: "sneha@campus.edu",   role: "Student",   reputation: 890,  joined: "2024-09-05", status: "active" },
];

const MOCK_FLAGGED = [
  {
    id: "f1", title: "Python Threading vs Multiprocessing",
    author: "Vikram Nair", community: "CS Dept",
    similarity: 91, reason: "High content similarity with existing post",
    llmAudit: "Content appears largely copied from Stack Overflow thread #48201. Original authorship unclear.",
    status: "pending", type: "discussion", flaggedAt: "2026-06-18T10:00:00Z",
  },
  {
    id: "f2", title: "ML Notes 2026.pdf",
    author: "Anonymous Upload", community: "AI Research Club",
    similarity: 87, reason: "Potential copyright infringement",
    llmAudit: "PDF content matches 87% of published textbook pages. Likely uploaded without author permission.",
    status: "pending", type: "resource", flaggedAt: "2026-06-18T08:30:00Z",
  },
  {
    id: "f3", title: "Off-topic promotional post",
    author: "Riya Patel", community: "Campus General",
    similarity: 12, reason: "Off-topic / promotional",
    llmAudit: "Post is a product advertisement unrelated to campus activities. Does not meet community guidelines.",
    status: "pending", type: "discussion", flaggedAt: "2026-06-17T22:00:00Z",
  },
];

const MOCK_COMMUNITIES = [
  { id: "c1", name: "CS Department", members: 420, posts: 1830, created: "2023-01-01", category: "Academic" },
  { id: "c2", name: "AI Research Club", members: 218, posts: 974, created: "2023-06-15", category: "Club" },
  { id: "c3", name: "Campus General",  members: 1250, posts: 3420, created: "2022-09-01", category: "General" },
  { id: "c4", name: "Tech Society",    members: 310, posts: 1140, created: "2023-11-20", category: "Club" },
];

const ANALYTICS = {
  totalUsers:       { value: 1842, label: "Total Users",       icon: Users,      color: "#6366F1", sub: "+48 this week" },
  activeToday:      { value: 394,  label: "Active Today",      icon: Activity,   color: "#10B981", sub: "21% of users" },
  totalPosts:       { value: 7368, label: "Total Posts",       icon: Globe,      color: "#F59E0B", sub: "+182 this week" },
  flaggedContent:   { value: 12,   label: "Pending Flags",     icon: Flag,       color: "#EF4444", sub: "3 high priority" },
  aiAccuracy:       { value: "94%", label: "AI Mod Accuracy",  icon: Brain,      color: "#8B5CF6", sub: "Last 30 days" },
  avgReputation:    { value: 847,  label: "Avg Reputation",    icon: Award,      color: "#06B6D4", sub: "Per active user" },
};

const ROLE_COLORS = {
  Student: "#6366F1", Professor: "#10B981",
  ClubHead: "#F59E0B", Admin: "#EF4444",
};

/* ─── Sub-components ──────────────────────── */
function AnalyticCard({ data, index }) {
  const Icon = data.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07 }}
      whileHover={{ y: -3 }}
      className="p-5 rounded-2xl cursor-default transition-all"
      style={{
        background: "var(--cn-card)",
        border: "1px solid var(--cn-border)",
        boxShadow: "var(--cn-shadow)",
      }}
    >
      <div className="flex items-start justify-between mb-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: `${data.color}18` }}
        >
          <Icon style={{ width: 18, height: 18, color: data.color }} />
        </div>
        <TrendingUp style={{ width: 12, height: 12, color: "var(--cn-success)" }} />
      </div>
      <p className="text-2xl font-bold" style={{ color: "var(--cn-text)" }}>{data.value}</p>
      <p className="text-xs font-medium mt-0.5" style={{ color: "var(--cn-text-3)" }}>{data.label}</p>
      <p className="text-[11px] mt-1" style={{ color: data.color }}>{data.sub}</p>
    </motion.div>
  );
}

function RoleBadge({ role }) {
  const color = ROLE_COLORS[role] || "#6366F1";
  return (
    <span
      className="px-2 py-0.5 rounded-full text-[11px] font-semibold"
      style={{ background: `${color}18`, color }}
    >
      {role}
    </span>
  );
}

function StatusDot({ status }) {
  const color = status === "active" ? "#10B981" : status === "suspended" ? "#EF4444" : "#F59E0B";
  return (
    <span className="flex items-center gap-1.5">
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
      <span className="text-[11px] capitalize" style={{ color }}>{status}</span>
    </span>
  );
}

/* ─── Tab: Manage Users ─────────────────── */
function ManageUsersTab() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [users, setUsers] = useState(MOCK_USERS);
  const [editingRole, setEditingRole] = useState(null);

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    const matchQ = u.full_name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
    const matchR = roleFilter === "all" || u.role === roleFilter;
    return matchQ && matchR;
  });

  const changeRole = (uid, newRole) => {
    setUsers((prev) => prev.map((u) => u.user_id === uid ? { ...u, role: newRole } : u));
    setEditingRole(null);
  };

  const deleteUser = (uid) => {
    if (window.confirm("Delete this user? This cannot be undone.")) {
      setUsers((prev) => prev.filter((u) => u.user_id !== uid));
    }
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div
          className="flex items-center gap-2 flex-1 px-3 py-2.5 rounded-xl"
          style={{ background: "var(--cn-surface)", border: "1px solid var(--cn-border)" }}
        >
          <Search style={{ width: 14, height: 14, color: "var(--cn-text-4)" }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users by name or email…"
            className="flex-1 bg-transparent text-sm outline-none"
            style={{ color: "var(--cn-text)", caretColor: "var(--cn-primary)" }}
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-3 py-2.5 rounded-xl text-sm outline-none cursor-pointer"
          style={{
            background: "var(--cn-surface)",
            border: "1px solid var(--cn-border)",
            color: "var(--cn-text)",
          }}
        >
          <option value="all">All Roles</option>
          <option value="Student">Student</option>
          <option value="Professor">Professor</option>
          <option value="ClubHead">Club Head</option>
          <option value="Admin">Admin</option>
        </select>
      </div>

      {/* Table */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{ border: "1px solid var(--cn-border)", boxShadow: "var(--cn-shadow)" }}
      >
        <table className="w-full">
          <thead>
            <tr style={{ background: "var(--cn-surface-2)" }}>
              {["User", "Role", "Reputation", "Status", "Joined", "Actions"].map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-left text-xs font-semibold"
                  style={{ color: "var(--cn-text-4)" }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {filtered.map((u, i) => (
                <motion.tr
                  key={u.user_id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ delay: i * 0.04 }}
                  style={{
                    borderTop: "1px solid var(--cn-border)",
                    background: "var(--cn-card)",
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "var(--cn-surface-2)"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "var(--cn-card)"}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                        style={{ background: `linear-gradient(135deg, ${ROLE_COLORS[u.role]}, ${ROLE_COLORS[u.role]}99)` }}
                      >
                        {u.full_name.split(" ").map((p) => p[0]).join("").slice(0, 2)}
                      </div>
                      <div>
                        <p className="text-xs font-semibold" style={{ color: "var(--cn-text)" }}>{u.full_name}</p>
                        <p className="text-[10px]" style={{ color: "var(--cn-text-4)" }}>{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {editingRole === u.user_id ? (
                      <select
                        defaultValue={u.role}
                        onChange={(e) => changeRole(u.user_id, e.target.value)}
                        onBlur={() => setEditingRole(null)}
                        autoFocus
                        className="text-xs px-2 py-1 rounded-lg outline-none cursor-pointer"
                        style={{
                          background: "var(--cn-surface)",
                          border: "1px solid var(--cn-primary)",
                          color: "var(--cn-text)",
                        }}
                      >
                        <option value="Student">Student</option>
                        <option value="Professor">Professor</option>
                        <option value="ClubHead">ClubHead</option>
                        <option value="Admin">Admin</option>
                      </select>
                    ) : (
                      <RoleBadge role={u.role} />
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-semibold" style={{ color: "var(--cn-text)" }}>
                      ⭐ {u.reputation}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <StatusDot status={u.status} />
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs" style={{ color: "var(--cn-text-4)" }}>
                      {new Date(u.joined).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "2-digit" })}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setEditingRole(u.user_id)}
                        className="p-1.5 rounded-lg transition-colors"
                        title="Change role"
                        style={{ color: "var(--cn-primary)" }}
                        onMouseEnter={(e) => e.currentTarget.style.background = "var(--cn-primary-l)"}
                        onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                      >
                        <UserCog style={{ width: 13, height: 13 }} />
                      </button>
                      <button
                        onClick={() => deleteUser(u.user_id)}
                        className="p-1.5 rounded-lg transition-colors"
                        title="Delete user"
                        style={{ color: "var(--cn-danger)" }}
                        onMouseEnter={(e) => e.currentTarget.style.background = "rgba(239,68,68,0.08)"}
                        onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                      >
                        <Trash2 style={{ width: 13, height: 13 }} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="py-10 text-center text-sm" style={{ color: "var(--cn-text-4)" }}>
            No users match your search.
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Tab: Flagged Content ──────────────── */
function FlaggedContentTab() {
  const [items, setItems] = useState(MOCK_FLAGGED);
  const [expanded, setExpanded] = useState(null);

  const resolve = (id, action) => {
    setItems((prev) =>
      prev.map((it) => it.id === id ? { ...it, status: action } : it)
    );
  };

  const remove = (id) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
  };

  const pending = items.filter((it) => it.status === "pending");
  const resolved = items.filter((it) => it.status !== "pending");

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <AlertTriangle style={{ width: 15, height: 15, color: "var(--cn-warning)" }} />
        <span className="text-sm font-semibold" style={{ color: "var(--cn-text)" }}>
          {pending.length} item{pending.length !== 1 ? "s" : ""} pending review
        </span>
      </div>

      {[...pending, ...resolved].map((item, i) => {
        const isExpanded = expanded === item.id;
        const simColor =
          item.similarity >= 85 ? "#EF4444" :
          item.similarity >= 60 ? "#F59E0B" : "#10B981";

        return (
          <motion.div
            key={item.id}
            layout
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="rounded-2xl overflow-hidden"
            style={{
              background: "var(--cn-card)",
              border: `1px solid ${item.status === "pending" ? "var(--cn-border)" : item.status === "approved" ? "rgba(16,185,129,0.3)" : "rgba(239,68,68,0.3)"}`,
              boxShadow: "var(--cn-shadow)",
              opacity: item.status !== "pending" ? 0.7 : 1,
            }}
          >
            {/* Header */}
            <div
              className="flex items-start gap-3 p-4 cursor-pointer"
              onClick={() => setExpanded(isExpanded ? null : item.id)}
            >
              <div
                className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: `${simColor}18` }}
              >
                <Flag style={{ width: 14, height: 14, color: simColor }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold truncate" style={{ color: "var(--cn-text)" }}>
                      {item.title}
                    </p>
                    <p className="text-[11px] mt-0.5" style={{ color: "var(--cn-text-4)" }}>
                      by {item.author} · {item.community} · {item.type}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {/* Similarity badge */}
                    <div
                      className="px-2 py-0.5 rounded-full text-[11px] font-bold"
                      style={{ background: `${simColor}18`, color: simColor }}
                    >
                      {item.similarity}% match
                    </div>
                    {item.status !== "pending" && (
                      <span
                        className="px-2 py-0.5 rounded-full text-[11px] font-semibold capitalize"
                        style={{
                          background: item.status === "approved" ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.15)",
                          color: item.status === "approved" ? "#10B981" : "#EF4444",
                        }}
                      >
                        {item.status}
                      </span>
                    )}
                    {isExpanded
                      ? <ChevronUp style={{ width: 13, height: 13, color: "var(--cn-text-4)" }} />
                      : <ChevronDown style={{ width: 13, height: 13, color: "var(--cn-text-4)" }} />
                    }
                  </div>
                </div>

                {/* Similarity bar */}
                <div className="mt-2 flex items-center gap-2">
                  <div
                    className="flex-1 h-1.5 rounded-full overflow-hidden"
                    style={{ background: "var(--cn-surface-2)" }}
                  >
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${item.similarity}%` }}
                      transition={{ duration: 0.8, delay: i * 0.1 }}
                      className="h-full rounded-full"
                      style={{ background: simColor }}
                    />
                  </div>
                  <span className="text-[10px] flex-shrink-0" style={{ color: "var(--cn-text-4)" }}>
                    {item.reason}
                  </span>
                </div>
              </div>
            </div>

            {/* Expanded details */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  style={{ borderTop: "1px solid var(--cn-border)" }}
                >
                  <div className="p-4 space-y-3">
                    {/* LLM Audit */}
                    <div
                      className="p-3 rounded-xl"
                      style={{
                        background: "linear-gradient(135deg, rgba(139,92,246,0.08), rgba(99,102,241,0.05))",
                        border: "1px solid rgba(139,92,246,0.2)",
                      }}
                    >
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <Brain style={{ width: 12, height: 12, color: "#8B5CF6" }} />
                        <span className="text-xs font-semibold" style={{ color: "#8B5CF6" }}>AI Audit Reasoning</span>
                      </div>
                      <p className="text-xs leading-relaxed" style={{ color: "var(--cn-text-3)" }}>
                        {item.llmAudit}
                      </p>
                    </div>

                    {/* Action buttons */}
                    {item.status === "pending" && (
                      <div className="flex items-center gap-2 flex-wrap">
                        <button
                          onClick={() => resolve(item.id, "approved")}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all"
                          style={{
                            background: "rgba(16,185,129,0.12)",
                            color: "#10B981",
                            border: "1px solid rgba(16,185,129,0.25)",
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.background = "rgba(16,185,129,0.22)"}
                          onMouseLeave={(e) => e.currentTarget.style.background = "rgba(16,185,129,0.12)"}
                        >
                          <CheckCircle style={{ width: 13, height: 13 }} /> Approve
                        </button>
                        <button
                          onClick={() => resolve(item.id, "rejected")}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all"
                          style={{
                            background: "rgba(239,68,68,0.1)",
                            color: "#EF4444",
                            border: "1px solid rgba(239,68,68,0.25)",
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.background = "rgba(239,68,68,0.2)"}
                          onMouseLeave={(e) => e.currentTarget.style.background = "rgba(239,68,68,0.1)"}
                        >
                          <XCircle style={{ width: 13, height: 13 }} /> Reject
                        </button>
                        <button
                          onClick={() => remove(item.id)}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all ml-auto"
                          style={{
                            background: "var(--cn-surface-2)",
                            color: "var(--cn-text-3)",
                            border: "1px solid var(--cn-border)",
                          }}
                        >
                          <Trash2 style={{ width: 13, height: 13 }} /> Delete Post
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}

/* ─── Tab: Communities ──────────────────── */
function CommunitiesTab() {
  const [communities, setCommunities] = useState(MOCK_COMMUNITIES);

  const deleteCommunity = (id) => {
    if (window.confirm("Delete this community? All posts will be lost.")) {
      setCommunities((prev) => prev.filter((c) => c.id !== id));
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {communities.map((c, i) => (
        <motion.div
          key={c.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.07 }}
          className="p-5 rounded-2xl"
          style={{
            background: "var(--cn-card)",
            border: "1px solid var(--cn-border)",
            boxShadow: "var(--cn-shadow)",
          }}
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white text-sm"
                style={{
                  background: "linear-gradient(135deg, #4F46E5, #818CF8)",
                }}
              >
                {c.name.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-semibold" style={{ color: "var(--cn-text)" }}>{c.name}</p>
                <span
                  className="text-[11px] px-1.5 py-0.5 rounded-full font-medium"
                  style={{
                    background: c.category === "Academic" ? "rgba(99,102,241,0.12)" : c.category === "Club" ? "rgba(245,158,11,0.12)" : "rgba(16,185,129,0.12)",
                    color: c.category === "Academic" ? "#4F46E5" : c.category === "Club" ? "#F59E0B" : "#10B981",
                  }}
                >
                  {c.category}
                </span>
              </div>
            </div>
            <button
              onClick={() => deleteCommunity(c.id)}
              className="p-1.5 rounded-lg transition-colors"
              style={{ color: "var(--cn-danger)" }}
              onMouseEnter={(e) => e.currentTarget.style.background = "rgba(239,68,68,0.08)"}
              onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
            >
              <Trash2 style={{ width: 14, height: 14 }} />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-3">
            <div
              className="p-2.5 rounded-xl text-center"
              style={{ background: "var(--cn-surface-2)" }}
            >
              <p className="text-base font-bold" style={{ color: "var(--cn-text)" }}>{c.members.toLocaleString()}</p>
              <p className="text-[10px]" style={{ color: "var(--cn-text-4)" }}>Members</p>
            </div>
            <div
              className="p-2.5 rounded-xl text-center"
              style={{ background: "var(--cn-surface-2)" }}
            >
              <p className="text-base font-bold" style={{ color: "var(--cn-text)" }}>{c.posts.toLocaleString()}</p>
              <p className="text-[10px]" style={{ color: "var(--cn-text-4)" }}>Posts</p>
            </div>
          </div>
          <p className="text-[11px] mt-2" style={{ color: "var(--cn-text-4)" }}>
            Created {new Date(c.created).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
          </p>
        </motion.div>
      ))}
    </div>
  );
}

/* ─── Tab: Analytics ────────────────────── */
function AnalyticsTab() {
  const roleBreakdown = [
    { role: "Student",   count: 1580, pct: 86, color: "#6366F1" },
    { role: "Professor", count: 142,  pct: 8,  color: "#10B981" },
    { role: "ClubHead",  count: 96,   pct: 5,  color: "#F59E0B" },
    { role: "Admin",     count: 24,   pct: 1,  color: "#EF4444" },
  ];

  const aiMetrics = [
    { label: "Posts Processed",   value: "4,821", color: "#6366F1" },
    { label: "Approved",          value: "4,321 (89.6%)", color: "#10B981" },
    { label: "Rejected",          value: "500 (10.4%)",   color: "#EF4444" },
    { label: "Avg Confidence",    value: "91.3%",          color: "#8B5CF6" },
    { label: "Avg Similarity",    value: "47.2%",          color: "#F59E0B" },
    { label: "OCR Processed",     value: "2,140",          color: "#06B6D4" },
  ];

  return (
    <div className="space-y-6">
      {/* User Role Distribution */}
      <div
        className="p-5 rounded-2xl"
        style={{ background: "var(--cn-card)", border: "1px solid var(--cn-border)", boxShadow: "var(--cn-shadow)" }}
      >
        <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--cn-text)" }}>User Role Distribution</h3>
        <div className="space-y-3">
          {roleBreakdown.map((r, i) => (
            <div key={r.role} className="flex items-center gap-3">
              <span className="text-xs w-20 font-medium flex-shrink-0" style={{ color: "var(--cn-text-3)" }}>{r.role}</span>
              <div className="flex-1 h-2.5 rounded-full overflow-hidden" style={{ background: "var(--cn-surface-2)" }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${r.pct}%` }}
                  transition={{ duration: 0.9, delay: i * 0.1, ease: "easeOut" }}
                  className="h-full rounded-full"
                  style={{ background: r.color }}
                />
              </div>
              <span className="text-xs w-16 text-right flex-shrink-0" style={{ color: r.color }}>
                {r.count.toLocaleString()} ({r.pct}%)
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* AI Metrics */}
      <div
        className="p-5 rounded-2xl"
        style={{ background: "var(--cn-card)", border: "1px solid var(--cn-border)", boxShadow: "var(--cn-shadow)" }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Brain style={{ width: 15, height: 15, color: "#8B5CF6" }} />
          <h3 className="text-sm font-semibold" style={{ color: "var(--cn-text)" }}>AI Moderation Metrics</h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {aiMetrics.map((m, i) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.07 }}
              className="p-3 rounded-xl"
              style={{ background: "var(--cn-surface-2)" }}
            >
              <p className="text-base font-bold" style={{ color: m.color }}>{m.value}</p>
              <p className="text-[11px] mt-0.5" style={{ color: "var(--cn-text-4)" }}>{m.label}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Top Communities */}
      <div
        className="p-5 rounded-2xl"
        style={{ background: "var(--cn-card)", border: "1px solid var(--cn-border)", boxShadow: "var(--cn-shadow)" }}
      >
        <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--cn-text)" }}>Top Communities by Activity</h3>
        <div className="space-y-2">
          {MOCK_COMMUNITIES.sort((a, b) => b.posts - a.posts).map((c, i) => (
            <div key={c.id} className="flex items-center gap-3">
              <span className="text-xs w-5 font-bold text-center flex-shrink-0" style={{ color: "var(--cn-text-4)" }}>
                {i + 1}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium truncate" style={{ color: "var(--cn-text)" }}>{c.name}</span>
                  <span className="text-[11px] flex-shrink-0" style={{ color: "var(--cn-text-4)" }}>{c.posts.toLocaleString()} posts</span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--cn-surface-2)" }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(c.posts / 3420) * 100}%` }}
                    transition={{ duration: 0.8, delay: i * 0.1 }}
                    className="h-full rounded-full"
                    style={{ background: "linear-gradient(90deg, #4F46E5, #818CF8)" }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Main Admin Dashboard ──────────────── */
const TABS = [
  { key: "analytics",   label: "Analytics",           icon: BarChart2 },
  { key: "users",       label: "Manage Users",         icon: Users },
  { key: "flagged",     label: "Flagged Content",      icon: Flag },
  { key: "communities", label: "Communities",          icon: Globe },
];

export default function AdminDashboardView() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState("analytics");

  if (user?.role !== "Admin") {
    return (
      <div className="flex flex-col items-center justify-center h-full py-24 gap-4">
        <Shield style={{ width: 48, height: 48, color: "var(--cn-text-4)" }} />
        <p className="text-base font-semibold" style={{ color: "var(--cn-text-3)" }}>Access Denied</p>
        <p className="text-sm" style={{ color: "var(--cn-text-4)" }}>
          You need Admin privileges to view this page.
        </p>
      </div>
    );
  }

  return (
    <div className="p-5 sm:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-center gap-3 mb-1">
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #EF4444, #F87171)" }}
          >
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold" style={{ color: "var(--cn-text)" }}>Admin Dashboard</h1>
            <p className="text-xs" style={{ color: "var(--cn-text-4)" }}>
              Manage users, review flagged content, and monitor platform health
            </p>
          </div>
        </div>
      </motion.div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {Object.values(ANALYTICS).map((d, i) => (
          <AnalyticCard key={d.label} data={d} index={i} />
        ))}
      </div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex gap-1 p-1 rounded-2xl flex-wrap"
        style={{ background: "var(--cn-surface)", border: "1px solid var(--cn-border)", width: "fit-content" }}
      >
        {TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all"
            style={{
              background: activeTab === key ? "linear-gradient(135deg, #4F46E5, #6366F1)" : "transparent",
              color: activeTab === key ? "#fff" : "var(--cn-text-3)",
              boxShadow: activeTab === key ? "0 4px 12px rgba(79,70,229,0.3)" : "none",
            }}
          >
            <Icon style={{ width: 13, height: 13 }} />
            <span className="hidden sm:inline">{label}</span>
          </button>
        ))}
      </motion.div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
        >
          {activeTab === "analytics"   && <AnalyticsTab />}
          {activeTab === "users"       && <ManageUsersTab />}
          {activeTab === "flagged"     && <FlaggedContentTab />}
          {activeTab === "communities" && <CommunitiesTab />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

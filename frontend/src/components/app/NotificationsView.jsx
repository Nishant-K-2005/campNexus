"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell, BellOff, Check, CheckCheck, Trash2, Filter,
  Megaphone, MessageSquare, FolderOpen, Users, Shield,
  Star, Zap, X, MoreVertical, ArrowLeft,
} from "lucide-react";
import useActivityStore from "@/store/activityStore";

const CATEGORIES = [
  { key: "all",         label: "All",         icon: Bell },
  { key: "declarations",label: "Declarations", icon: Megaphone },
  { key: "discussions", label: "Discussions",  icon: MessageSquare },
  { key: "moderation",  label: "AI Moderation",icon: Shield },
  { key: "reputation",  label: "Reputation",   icon: Star },
  { key: "activity",    label: "Activity",     icon: Zap },
];

function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "Just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function NotifCard({ notif, onRead, onDelete, delay }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -30, height: 0, marginBottom: 0, paddingTop: 0, paddingBottom: 0 }}
      transition={{ duration: 0.3, delay }}
      className="group relative flex items-start gap-4 p-4 rounded-2xl cursor-pointer transition-colors"
      style={{
        background: notif.read ? "var(--cn-surface)" : "var(--cn-primary-l)",
        border: `1px solid ${notif.read ? "var(--cn-border)" : "rgba(79,70,229,0.2)"}`,
        marginBottom: "0.625rem",
      }}
      onClick={() => !notif.read && onRead(notif.id)}
    >
      {/* Unread dot */}
      {!notif.read && (
        <span
          className="absolute top-4 right-10 w-2 h-2 rounded-full"
          style={{ background: "var(--cn-primary)" }}
        />
      )}

      {/* Icon bubble */}
      <div
        className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-lg"
        style={{ background: `${notif.color || "var(--cn-primary)"}18` }}
      >
        {notif.icon || "🔔"}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p
          className="text-sm leading-snug"
          style={{
            color: notif.read ? "var(--cn-text-3)" : "var(--cn-text)",
            fontWeight: notif.read ? 400 : 600,
          }}
        >
          {notif.text}
        </p>
        <div className="flex items-center gap-2 mt-1.5">
          <span
            className="text-xs px-2 py-0.5 rounded-full font-medium"
            style={{
              background: `${notif.color || "var(--cn-primary)"}18`,
              color: notif.color || "var(--cn-primary)",
            }}
          >
            {notif.type}
          </span>
          <span className="text-xs" style={{ color: "var(--cn-text-4)" }}>
            {notif.time ? timeAgo(notif.time) : "Just now"}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="relative flex-shrink-0">
        <button
          onClick={(e) => { e.stopPropagation(); setMenuOpen((p) => !p); }}
          className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ color: "var(--cn-text-4)" }}
        >
          <MoreVertical style={{ width: 14, height: 14 }} />
        </button>
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: -5 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -5 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-8 z-20 rounded-xl overflow-hidden shadow-xl"
              style={{
                background: "var(--cn-surface)",
                border: "1px solid var(--cn-border)",
                minWidth: 150,
              }}
            >
              {!notif.read && (
                <button
                  onClick={(e) => { e.stopPropagation(); onRead(notif.id); setMenuOpen(false); }}
                  className="w-full flex items-center gap-2 px-3 py-2.5 text-xs font-medium hover:bg-opacity-10 transition-colors"
                  style={{ color: "var(--cn-primary)" }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "var(--cn-primary-l)"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                >
                  <Check style={{ width: 12, height: 12 }} /> Mark as read
                </button>
              )}
              <button
                onClick={(e) => { e.stopPropagation(); onDelete(notif.id); setMenuOpen(false); }}
                className="w-full flex items-center gap-2 px-3 py-2.5 text-xs font-medium transition-colors"
                style={{ color: "var(--cn-danger)" }}
                onMouseEnter={(e) => e.currentTarget.style.background = "rgba(239,68,68,0.08)"}
                onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
              >
                <Trash2 style={{ width: 12, height: 12 }} /> Delete
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default function NotificationsView() {
  const {
    notifications, markRead, markAllRead, deleteNotification, clearNotifications,
  } = useActivityStore();

  const [activeCategory, setActiveCategory] = useState("all");
  const [filterUnread, setFilterUnread] = useState(false);

  const filtered = useMemo(() => {
    let list = [...notifications].sort(
      (a, b) => new Date(b.time || 0) - new Date(a.time || 0)
    );
    if (activeCategory !== "all") {
      list = list.filter((n) => n.category === activeCategory);
    }
    if (filterUnread) {
      list = list.filter((n) => !n.read);
    }
    return list;
  }, [notifications, activeCategory, filterUnread]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="p-5 sm:p-8 max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #4F46E5, #818CF8)" }}
              >
                <Bell className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold" style={{ color: "var(--cn-text)" }}>
                  Notifications
                </h1>
                {unreadCount > 0 && (
                  <p className="text-xs mt-0.5" style={{ color: "var(--cn-text-4)" }}>
                    {unreadCount} unread
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setFilterUnread((p) => !p)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all"
              style={{
                background: filterUnread ? "var(--cn-primary-l)" : "var(--cn-surface)",
                color: filterUnread ? "var(--cn-primary)" : "var(--cn-text-3)",
                border: `1px solid ${filterUnread ? "rgba(79,70,229,0.3)" : "var(--cn-border)"}`,
              }}
            >
              <Filter style={{ width: 12, height: 12 }} />
              Unread only
            </button>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all"
                style={{
                  background: "var(--cn-surface)",
                  color: "var(--cn-text-3)",
                  border: "1px solid var(--cn-border)",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = "var(--cn-primary)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = "var(--cn-text-3)"; }}
              >
                <CheckCheck style={{ width: 12, height: 12 }} />
                Mark all read
              </button>
            )}
            {notifications.length > 0 && (
              <button
                onClick={clearNotifications}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all"
                style={{
                  background: "var(--cn-surface)",
                  color: "var(--cn-danger)",
                  border: "1px solid rgba(239,68,68,0.2)",
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = "rgba(239,68,68,0.08)"}
                onMouseLeave={(e) => e.currentTarget.style.background = "var(--cn-surface)"}
              >
                <Trash2 style={{ width: 12, height: 12 }} />
                Clear all
              </button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Category Tabs */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="flex gap-2 flex-wrap mb-6"
      >
        {CATEGORIES.map(({ key, label, icon: Icon }) => {
          const count = key === "all"
            ? notifications.filter((n) => !n.read).length
            : notifications.filter((n) => n.category === key && !n.read).length;
          const active = activeCategory === key;
          return (
            <button
              key={key}
              onClick={() => setActiveCategory(key)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium transition-all"
              style={{
                background: active ? "linear-gradient(135deg, #4F46E5, #6366F1)" : "var(--cn-surface)",
                color: active ? "#fff" : "var(--cn-text-3)",
                border: active ? "none" : "1px solid var(--cn-border)",
                boxShadow: active ? "0 4px 12px rgba(79,70,229,0.3)" : "none",
              }}
            >
              <Icon style={{ width: 12, height: 12 }} />
              {label}
              {count > 0 && (
                <span
                  className="ml-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold"
                  style={{
                    background: active ? "rgba(255,255,255,0.25)" : "var(--cn-primary-l)",
                    color: active ? "#fff" : "var(--cn-primary)",
                  }}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </motion.div>

      {/* Notification List */}
      <AnimatePresence mode="popLayout">
        {filtered.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-20 gap-4"
          >
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{ background: "var(--cn-surface-2)" }}
            >
              <BellOff style={{ width: 28, height: 28, color: "var(--cn-text-4)" }} />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium" style={{ color: "var(--cn-text-3)" }}>
                {filterUnread ? "No unread notifications" : "All caught up!"}
              </p>
              <p className="text-xs mt-1" style={{ color: "var(--cn-text-4)" }}>
                {filterUnread
                  ? "Switch off the filter to see all notifications"
                  : "You'll get notified when there's new activity"}
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div key="list" layout>
            {filtered.map((notif, i) => (
              <NotifCard
                key={notif.id}
                notif={notif}
                onRead={markRead}
                onDelete={deleteNotification}
                delay={i * 0.04}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

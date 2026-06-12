"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Bell, LogOut, User, Settings, ChevronDown, ShieldCheck, X } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import useAuthStore from "@/store/authStore";
import { useRouter } from "next/navigation";
import { getSocket, disconnectSocket } from "@/lib/socket";
import { toast } from "sonner";

const MAX_NOTIFS = 20;

/* ── status colours matching Discussions view ─── */
const statusStyle = {
  Accepted: { bg: "rgba(16,185,129,0.1)", color: "#10B981", icon: "✅" },
  Rejected:  { bg: "rgba(239,68,68,0.1)",  color: "#EF4444", icon: "❌" },
  Flagged:   { bg: "rgba(239,68,68,0.1)",  color: "#EF4444", icon: "🚩" },
};

export default function Navbar({ activeTab, onMobileMenu }) {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [showNotifs, setShowNotifs]   = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [notifications, setNotifications] = useState([]);

  const notifRef   = useRef(null);
  const profileRef = useRef(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const tabLabels = {
    dashboard:    "Dashboard",
    communities:  "Communities",
    declarations: "Declarations",
    discussions:  "Discussions",
    resources:    "Resources",
    settings:     "Settings",
  };

  /* ── Socket.io connection ─────────────────────── */
  useEffect(() => {
    if (!user?.user_id) return;

    const socket = getSocket(user.user_id);
    if (!socket) return;

    const handleModeration = (data) => {
      const style = statusStyle[data.status] || { icon: "🔔", color: "var(--cn-primary)" };

      /* Push into in-app notification list */
      const notif = {
        id:      `${data.postId}-${Date.now()}`,
        icon:    style.icon,
        color:   style.color,
        text:    data.message || `Your post was ${data.status?.toLowerCase()}.`,
        time:    "just now",
        status:  data.status,
        postId:  data.postId,
        read:    false,
      };

      setNotifications((prev) => [notif, ...prev].slice(0, MAX_NOTIFS));

      /* Also show a sonner toast */
      if (data.status === "Accepted") {
        toast.success("🎉 Post Approved!", {
          description: data.message || "Your post is now live.",
          duration: 5000,
        });
      } else {
        toast.error("❌ Post Rejected", {
          description: data.message || "Your post didn't meet community guidelines.",
          duration: 6000,
        });
      }
    };

    socket.on("moderation-data", handleModeration);
    return () => socket.off("moderation-data", handleModeration);
  }, [user?.user_id]);

  /* ── Close dropdowns on outside click ────────── */
  useEffect(() => {
    const handleClick = (e) => {
      if (notifRef.current   && !notifRef.current.contains(e.target))   setShowNotifs(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setShowProfile(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleLogout = async () => {
    disconnectSocket();
    await logout();
    router.push("/auth/login");
  };

  const markAllRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

  const clearAll = () => setNotifications([]);

  const initials = user?.full_name
    ? user.full_name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  return (
    <header
      className="h-16 flex items-center px-4 sm:px-6 gap-4 flex-shrink-0"
      style={{
        background:   "var(--cn-surface)",
        borderBottom: "1px solid var(--cn-border)",
      }}
    >
      {/* Mobile hamburger */}
      {onMobileMenu && (
        <button
          onClick={onMobileMenu}
          className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl cursor-pointer"
          style={{ border: "1.5px solid var(--cn-border)", color: "var(--cn-text-2)" }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M2 4h12M2 8h12M2 12h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
      )}

      {/* Page title */}
      <div className="hidden sm:block">
        <h1 className="text-base font-semibold" style={{ color: "var(--cn-text)" }}>
          {tabLabels[activeTab] || "CampNexus"}
        </h1>
      </div>

      {/* Search */}
      <div className="flex-1 max-w-xs sm:max-w-sm">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2"
            style={{ width: 15, height: 15, color: "var(--cn-text-4)" }}
          />
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Search anything..."
            className="w-full text-sm py-2 pl-9 pr-4 rounded-xl outline-none transition-all"
            style={{
              background: "var(--cn-surface-2)",
              border:     "1.5px solid var(--cn-border)",
              color:      "var(--cn-text)",
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "var(--cn-primary)";
              e.target.style.boxShadow   = "0 0 0 3px var(--cn-primary-l)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "var(--cn-border)";
              e.target.style.boxShadow   = "none";
            }}
          />
        </div>
      </div>

      {/* Right actions */}
      <div className="ml-auto flex items-center gap-2">
        {/* Theme toggle */}
        <ThemeToggle size="sm" />

        {/* ── Notifications ── */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => { setShowNotifs(!showNotifs); setShowProfile(false); }}
            className="relative w-9 h-9 flex items-center justify-center rounded-xl transition-all cursor-pointer"
            style={{
              background: showNotifs ? "var(--cn-primary-l)" : "transparent",
              border:     `1.5px solid ${showNotifs ? "var(--cn-primary)" : "var(--cn-border)"}`,
              color:      "var(--cn-text-2)",
            }}
          >
            <Bell style={{ width: 16, height: 16 }} />
            {unreadCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-white flex items-center justify-center text-[10px] font-bold"
                style={{ background: "var(--cn-danger)" }}
              >
                {unreadCount > 9 ? "9+" : unreadCount}
              </motion.span>
            )}
          </button>

          <AnimatePresence>
            {showNotifs && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 top-12 w-80 rounded-2xl overflow-hidden z-50"
                style={{
                  background:  "var(--cn-card)",
                  border:      "1px solid var(--cn-border)",
                  boxShadow:   "var(--cn-shadow-lg)",
                }}
              >
                {/* Header */}
                <div
                  className="px-4 py-3 flex justify-between items-center"
                  style={{ borderBottom: "1px solid var(--cn-border)" }}
                >
                  <span className="text-sm font-semibold" style={{ color: "var(--cn-text)" }}>
                    Notifications
                  </span>
                  <div className="flex items-center gap-2">
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllRead}
                        className="text-[10px] font-medium cursor-pointer"
                        style={{ color: "var(--cn-primary)" }}
                      >
                        Mark all read
                      </button>
                    )}
                    {notifications.length > 0 && (
                      <button
                        onClick={clearAll}
                        className="cursor-pointer"
                        style={{ color: "var(--cn-text-4)" }}
                      >
                        <X style={{ width: 13, height: 13 }} />
                      </button>
                    )}
                  </div>
                </div>

                {/* List */}
                <div className="max-h-72 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="py-10 text-center">
                      <Bell style={{ width: 28, height: 28, color: "var(--cn-text-4)", margin: "0 auto 8px" }} />
                      <p className="text-xs" style={{ color: "var(--cn-text-4)" }}>
                        No notifications yet
                      </p>
                      <p className="text-[10px] mt-1" style={{ color: "var(--cn-text-4)" }}>
                        Real-time moderation alerts will appear here
                      </p>
                    </div>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className="px-4 py-3 flex gap-3 cursor-pointer transition-all"
                        style={{
                          background:   !notif.read ? "var(--cn-primary-l)" : "transparent",
                          borderBottom: "1px solid var(--cn-border)",
                        }}
                        onClick={() =>
                          setNotifications((prev) =>
                            prev.map((n) => n.id === notif.id ? { ...n, read: true } : n)
                          )
                        }
                        onMouseEnter={(e) => { e.currentTarget.style.background = "var(--cn-surface-2)"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = !notif.read ? "var(--cn-primary-l)" : "transparent"; }}
                      >
                        <span className="text-base flex-shrink-0 mt-0.5">{notif.icon}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs leading-relaxed" style={{ color: "var(--cn-text-2)" }}>
                            {notif.text}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span
                              className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full"
                              style={{ background: statusStyle[notif.status]?.bg || "var(--cn-surface-2)", color: notif.color }}
                            >
                              {notif.status}
                            </span>
                            <p className="text-[10px]" style={{ color: "var(--cn-text-4)" }}>
                              {notif.time}
                            </p>
                          </div>
                        </div>
                        {!notif.read && (
                          <div
                            className="w-2 h-2 rounded-full flex-shrink-0 mt-1.5"
                            style={{ background: "var(--cn-primary)" }}
                          />
                        )}
                      </div>
                    ))
                  )}
                </div>

                {/* Footer */}
                <div
                  className="px-4 py-2.5 flex items-center gap-2"
                  style={{ borderTop: "1px solid var(--cn-border)" }}
                >
                  <ShieldCheck style={{ width: 12, height: 12, color: "var(--cn-success)" }} />
                  <p className="text-[10px]" style={{ color: "var(--cn-text-4)" }}>
                    AI moderation results appear here in real-time
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Profile ── */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => { setShowProfile(!showProfile); setShowNotifs(false); }}
            className="flex items-center gap-2 px-2 py-1.5 rounded-xl transition-all cursor-pointer"
            style={{
              background: showProfile ? "var(--cn-surface-2)" : "transparent",
              border:     `1.5px solid ${showProfile ? "var(--cn-border-2)" : "var(--cn-border)"}`,
            }}
          >
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white"
              style={{ background: "linear-gradient(135deg, #6366F1, #818CF8)" }}
            >
              {initials}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-semibold leading-none" style={{ color: "var(--cn-text)" }}>
                {user?.full_name || "User"}
              </p>
              <p className="text-[10px] mt-0.5" style={{ color: "var(--cn-text-4)" }}>
                {user?.role || "Member"}
              </p>
            </div>
            <ChevronDown style={{ width: 12, height: 12, color: "var(--cn-text-4)" }} />
          </button>

          <AnimatePresence>
            {showProfile && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 top-12 w-52 rounded-2xl overflow-hidden z-50"
                style={{
                  background: "var(--cn-card)",
                  border:     "1px solid var(--cn-border)",
                  boxShadow:  "var(--cn-shadow-lg)",
                }}
              >
                <div className="px-4 py-3" style={{ borderBottom: "1px solid var(--cn-border)" }}>
                  <p className="text-sm font-semibold" style={{ color: "var(--cn-text)" }}>
                    {user?.full_name || "User"}
                  </p>
                  <p className="text-xs" style={{ color: "var(--cn-text-4)" }}>
                    {user?.email || ""}
                  </p>
                </div>

                {[
                  { label: "View Profile", icon: User },
                  { label: "Settings",     icon: Settings },
                ].map(({ label, icon: Icon }) => (
                  <button
                    key={label}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-all cursor-pointer text-left"
                    style={{ color: "var(--cn-text-2)" }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "var(--cn-surface-2)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                  >
                    <Icon style={{ width: 14, height: 14 }} />
                    {label}
                  </button>
                ))}

                <div style={{ borderTop: "1px solid var(--cn-border)" }}>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-all cursor-pointer text-left"
                    style={{ color: "var(--cn-danger)" }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(239,68,68,0.06)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                  >
                    <LogOut style={{ width: 14, height: 14 }} />
                    Sign Out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}

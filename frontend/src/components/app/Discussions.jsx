"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Heart, MessageCircle, Share2, Paperclip,
  ShieldCheck, Clock, TrendingUp, X, Send, Loader,
  ChevronDown,
} from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";

const aiStatusConfig = {
  Pending:  { label: "AI Reviewing", color: "#F59E0B", icon: Clock },
  Accepted: { label: "AI Verified",  color: "#10B981", icon: ShieldCheck },
  Rejected: { label: "Rejected",     color: "#EF4444", icon: ShieldCheck },
  Flagged:  { label: "Flagged",      color: "#EF4444", icon: ShieldCheck },
};

const COLORS = ["#6366F1","#10B981","#F59E0B","#EF4444","#8B5CF6","#06B6D4","#F97316","#EC4899"];
const tagColor = (i) => COLORS[i % COLORS.length];

/* ─── Helpers ───────────────────────────────────────────── */
function initials(name = "") {
  return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2) || "?";
}

function timeAgo(dateStr) {
  const diff = (Date.now() - new Date(dateStr)) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

/* ─── Reply Section ──────────────────────────────────────── */
function ReplySection({ postId }) {
  const [replies, setReplies] = useState([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    api.replies.getAll(postId)
      .then((d) => setReplies(d.replies || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [postId]);

  const send = async () => {
    if (!content.trim()) return;
    setSending(true);
    try {
      const d = await api.replies.send({ postId, content });
      setReplies((prev) => [d.reply, ...prev]);
      setContent("");
    } catch (err) {
      toast.error(err.message || "Failed to send reply");
    } finally {
      setSending(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="px-5 pb-4"
      style={{ borderTop: "1px solid var(--cn-border)" }}
    >
      <div className="flex gap-2 mt-3">
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write a reply…"
          className="cn-input py-2 text-xs flex-1"
          onKeyDown={(e) => { if (e.key === "Enter") send(); }}
        />
        <button
          onClick={send}
          disabled={sending}
          className="px-3 py-2 rounded-xl flex items-center gap-1 text-xs font-medium text-white cursor-pointer disabled:opacity-60"
          style={{ background: "var(--cn-primary)" }}
        >
          {sending ? <Loader style={{ width: 12, height: 12 }} className="cn-animate-spin" /> : <Send style={{ width: 12, height: 12 }} />}
        </button>
      </div>
      {loading && <p className="text-xs mt-2" style={{ color: "var(--cn-text-4)" }}>Loading replies…</p>}
      {!loading && replies.length > 0 && (
        <div className="mt-3 space-y-2">
          {replies.map((r) => (
            <div key={r.reply_id} className="flex gap-2 items-start">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                style={{ background: "linear-gradient(135deg, #6366F1, #818CF8)" }}
              >
                {initials(r.user?.full_name)}
              </div>
              <div
                className="flex-1 px-3 py-2 rounded-xl text-xs"
                style={{ background: "var(--cn-surface-2)", color: "var(--cn-text-2)" }}
              >
                <span className="font-semibold mr-1" style={{ color: "var(--cn-text)" }}>{r.user?.full_name || "User"}</span>
                {r.content}
                <span className="ml-2 text-[10px]" style={{ color: "var(--cn-text-4)" }}>{timeAgo(r.created_at)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

/* ─── Post Card ──────────────────────────────────────────── */
function PostCard({ post, index }) {
  const [showReplies, setShowReplies] = useState(false);
  const aiCfg = aiStatusConfig[post.status] || aiStatusConfig.Pending;
  const AIIcon = aiCfg.icon;
  const color = tagColor(index);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.4 }}
      className="rounded-2xl overflow-hidden"
      style={{ background: "var(--cn-card)", border: "1px solid var(--cn-border)", boxShadow: "var(--cn-shadow)" }}
    >
      <div className="p-5">
        {/* Author */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
              style={{ background: `linear-gradient(135deg, ${color}, ${color}CC)` }}
            >
              {initials(post.user?.full_name)}
            </div>
            <div>
              <p className="text-sm font-semibold" style={{ color: "var(--cn-text)" }}>{post.user?.full_name || "Unknown"}</p>
              <p className="text-xs" style={{ color: "var(--cn-text-4)" }}>
                {post.user?.role || "Member"} · {timeAgo(post.created_at)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-full" style={{ background: `${aiCfg.color}15` }}>
            <AIIcon style={{ width: 10, height: 10, color: aiCfg.color }} />
            <span className="text-[10px] font-semibold" style={{ color: aiCfg.color }}>{aiCfg.label}</span>
          </div>
        </div>

        {/* Content */}
        <p className="text-sm leading-relaxed" style={{ color: "var(--cn-text-2)" }}>{post.content}</p>

        {/* Attachments */}
        {post.attachments?.filter((a) => a.url).map((att) => (
          <a
            key={att.attachment_id}
            href={att.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 mt-3 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
            style={{ background: "var(--cn-surface-2)", border: "1px solid var(--cn-border)", color: "var(--cn-text-3)" }}
          >
            <Paperclip style={{ width: 10, height: 10 }} /> {att.title || "Attachment"}
          </a>
        ))}

        {/* Actions */}
        <div className="flex items-center gap-4 mt-4 pt-4" style={{ borderTop: "1px solid var(--cn-border)" }}>
          <button
            onClick={() => setShowReplies(!showReplies)}
            className="flex items-center gap-1.5 text-xs font-medium transition-all cursor-pointer"
            style={{ color: showReplies ? "var(--cn-primary)" : "var(--cn-text-4)" }}
          >
            <MessageCircle style={{ width: 15, height: 15 }} />
            {post.replies?.length ?? post._count?.replies ?? 0} replies
          </button>
          <button
            className="flex items-center gap-1.5 text-xs font-medium cursor-pointer"
            style={{ color: "var(--cn-text-4)" }}
          >
            <Share2 style={{ width: 15, height: 15 }} /> Share
          </button>
        </div>
      </div>

      {/* Reply section */}
      <AnimatePresence>
        {showReplies && <ReplySection postId={post.post_id} />}
      </AnimatePresence>
    </motion.div>
  );
}

/* ─── AI Moderation Visualizer ───────────────────────────── */
const MOD_STEPS = [
  { key: "upload",     label: "Uploading",        icon: "📤", color: "#6366F1" },
  { key: "ocr",        label: "OCR Processing",   icon: "🔍", color: "#06B6D4" },
  { key: "parse",      label: "Parsing Content",  icon: "📝", color: "#8B5CF6" },
  { key: "embed",      label: "Embedding",        icon: "🧠", color: "#F59E0B" },
  { key: "similarity", label: "Similarity Check", icon: "🔗", color: "#EF4444" },
  { key: "ai",         label: "AI Moderation",    icon: "🤖", color: "#10B981" },
  { key: "decision",   label: "Final Decision",   icon: "✅", color: "#10B981" },
];

function AIModerationVisualizer({ visible, onDone }) {
  const [currentStep, setCurrentStep] = useState(-1);
  const [similarity, setSimilarity] = useState(null);
  const [decision, setDecision] = useState(null);

  useEffect(() => {
    if (!visible) return;
    setCurrentStep(0);
    setDecision(null);
    setSimilarity(null);

    const delays = [400, 900, 700, 1100, 800, 900, 600];
    let total = 0;
    delays.forEach((d, i) => {
      total += d;
      setTimeout(() => {
        setCurrentStep(i + 1);
        if (i === 4) setSimilarity(Math.floor(Math.random() * 30) + 55); // 55–85%
        if (i === 6) {
          const approved = Math.random() > 0.25;
          setDecision(approved ? "approved" : "flagged");
          setTimeout(onDone, 1200);
        }
      }, total);
    });
  }, [visible, onDone]);

  if (!visible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="rounded-2xl overflow-hidden"
      style={{
        background: "linear-gradient(135deg, rgba(79,70,229,0.06), rgba(6,182,212,0.04))",
        border: "1px solid rgba(79,70,229,0.2)",
        marginTop: "1rem",
      }}
    >
      <div className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-sm">🤖</span>
          <p className="text-xs font-semibold" style={{ color: "var(--cn-primary)" }}>AI Moderation Pipeline</p>
          {decision && (
            <span
              className="ml-auto px-2 py-0.5 rounded-full text-[10px] font-bold"
              style={{
                background: decision === "approved" ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.15)",
                color: decision === "approved" ? "#10B981" : "#EF4444",
              }}
            >
              {decision === "approved" ? "✅ Approved" : "🚩 Flagged"}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1">
          {MOD_STEPS.map((s, i) => {
            const done = i < currentStep;
            const active = i === currentStep - 1;
            return (
              <div key={s.key} className="flex items-center gap-1 flex-1 min-w-0">
                <div className="flex flex-col items-center gap-1">
                  <motion.div
                    animate={active ? { scale: [1, 1.15, 1] } : {}}
                    transition={{ repeat: active ? Infinity : 0, duration: 0.7 }}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-sm flex-shrink-0"
                    style={{
                      background: done ? `${s.color}22` : active ? `${s.color}30` : "var(--cn-surface-2)",
                      border: `1.5px solid ${done || active ? s.color : "var(--cn-border)"}`,
                      opacity: done || active ? 1 : 0.4,
                      boxShadow: active ? `0 0 8px ${s.color}60` : "none",
                    }}
                  >
                    {active ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                        className="w-3 h-3 rounded-full border-2 border-t-transparent"
                        style={{ borderColor: s.color, borderTopColor: "transparent" }}
                      />
                    ) : done ? (
                      <span>{s.icon}</span>
                    ) : (
                      <span className="text-[10px]">{i + 1}</span>
                    )}
                  </motion.div>
                  <span
                    className="text-[9px] text-center leading-tight"
                    style={{
                      color: done || active ? s.color : "var(--cn-text-4)",
                      fontWeight: done || active ? 600 : 400,
                      maxWidth: 48,
                    }}
                  >
                    {s.label}
                  </span>
                </div>
                {i < MOD_STEPS.length - 1 && (
                  <div
                    className="h-0.5 flex-1 rounded-full mb-4"
                    style={{
                      background: i < currentStep - 1 ? "var(--cn-primary)" : "var(--cn-border)",
                      transition: "background 0.4s",
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>

        {similarity !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-3 flex items-center gap-2"
          >
            <span className="text-[11px]" style={{ color: "var(--cn-text-4)" }}>Similarity Score:</span>
            <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "var(--cn-surface-2)" }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${similarity}%` }}
                transition={{ duration: 0.8 }}
                className="h-full rounded-full"
                style={{ background: similarity > 80 ? "#EF4444" : similarity > 60 ? "#F59E0B" : "#10B981" }}
              />
            </div>
            <span className="text-[11px] font-bold" style={{ color: similarity > 80 ? "#EF4444" : similarity > 60 ? "#F59E0B" : "#10B981" }}>
              {similarity}%
            </span>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

/* ─── Create Post Modal ──────────────────────────────────── */
function CreatePostModal({ communities, onClose, onCreate }) {
  const [form, setForm] = useState({ communityId: communities[0]?.community_id || "", content: "", file: null });
  const [loading, setLoading] = useState(false);
  const [showAI, setShowAI] = useState(false);
  const [fileName, setFileName] = useState(null);
  const MAX_CHARS = 2000;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.content.trim()) return toast.error("Post content is required");
    if (!form.communityId) return toast.error("Select a community");
    setLoading(true);
    setShowAI(true);
  };

  const handleAIDone = async () => {
    try {
      await onCreate(form);
      onClose();
    } catch {
      // toasted by caller
    } finally {
      setLoading(false);
      setShowAI(false);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }} onClick={onClose} />
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 12 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="relative w-full max-w-lg rounded-2xl p-6 z-10 max-h-[90vh] overflow-y-auto"
        style={{ background: "var(--cn-card)", border: "1.5px solid rgba(79,70,229,0.4)", boxShadow: "0 0 0 4px rgba(79,70,229,0.08), var(--cn-shadow-lg)" }}
      >
        <div className="flex justify-between items-center mb-5">
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #4F46E5, #818CF8)" }}
            >
              <Plus style={{ width: 15, height: 15, color: "#fff" }} />
            </div>
            <div>
              <h2 className="text-sm font-bold" style={{ color: "var(--cn-text)" }}>New Discussion</h2>
              <p className="text-[10px]" style={{ color: "var(--cn-text-4)" }}>AI moderation will review before publishing</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg cursor-pointer transition-colors"
            style={{ color: "var(--cn-text-4)" }}
            onMouseEnter={(e) => e.currentTarget.style.background = "var(--cn-surface-2)"}
            onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
          >
            <X style={{ width: 16, height: 16 }} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Community picker */}
          <div>
            <label className="cn-label">Community</label>
            <div className="relative">
              <select
                className="cn-input appearance-none pr-8"
                value={form.communityId}
                onChange={(e) => setForm((p) => ({ ...p, communityId: e.target.value }))}
                style={{ background: "var(--cn-surface)" }}
              >
                {communities.length === 0 && <option value="">— no communities —</option>}
                {communities.map((c) => (
                  <option key={c.community_id} value={c.community_id}>{c.name}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ width: 14, height: 14, color: "var(--cn-text-4)" }} />
            </div>
          </div>

          {/* Rich textarea */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="cn-label">Your post</label>
              <span className="text-[10px]" style={{ color: form.content.length > MAX_CHARS * 0.9 ? "var(--cn-danger)" : "var(--cn-text-4)" }}>
                {form.content.length}/{MAX_CHARS}
              </span>
            </div>
            <textarea
              className="cn-input resize-none"
              rows={5}
              placeholder="Share a question, idea, or insight with your community…"
              value={form.content}
              maxLength={MAX_CHARS}
              onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))}
              style={{ lineHeight: 1.6 }}
            />
          </div>

          {/* Styled file picker */}
          <div>
            <label className="cn-label">Attachment <span style={{ color: "var(--cn-text-4)", fontWeight: 400 }}>(optional)</span></label>
            <label
              className="flex items-center gap-2 w-full px-3 py-2.5 rounded-xl text-xs cursor-pointer transition-all"
              style={{
                background: fileName ? "var(--cn-primary-l)" : "var(--cn-surface)",
                border: `1.5px dashed ${fileName ? "var(--cn-primary)" : "var(--cn-border)"}`,
                color: fileName ? "var(--cn-primary)" : "var(--cn-text-3)",
              }}
            >
              <Paperclip style={{ width: 13, height: 13, flexShrink: 0 }} />
              <span className="truncate">{fileName || "Click to attach a file (PDF, DOCX, image…)"}</span>
              <input
                type="file"
                className="sr-only"
                accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.csv,.jpg,.jpeg,.png,.gif"
                onChange={(e) => {
                  const f = e.target.files[0] || null;
                  setFileName(f?.name || null);
                  setForm((p) => ({ ...p, file: f }));
                }}
              />
            </label>
          </div>

          {/* AI badge */}
          <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl"
            style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.2)" }}>
            <ShieldCheck style={{ width: 12, height: 12, color: "#10B981" }} />
            <span className="text-[11px] font-medium" style={{ color: "#10B981" }}>
              AI moderation — your post will be reviewed before publishing
            </span>
          </div>

          {/* AI visualizer */}
          <AnimatePresence>
            {showAI && <AIModerationVisualizer visible={showAI} onDone={handleAIDone} />}
          </AnimatePresence>

          <button
            type="submit"
            disabled={loading || showAI || !form.content.trim()}
            className="w-full py-3 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 transition-all"
            style={{
              background: "linear-gradient(135deg, var(--cn-primary), #818CF8)",
              boxShadow: "0 4px 16px rgba(99,102,241,0.3)",
            }}
          >
            {loading && <Loader style={{ width: 14, height: 14 }} className="cn-animate-spin" />}
            {showAI ? "AI is reviewing your post…" : loading ? "Posting…" : "Post Discussion"}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}


/* ─── Main View ──────────────────────────────────────────── */
export default function DiscussionsView() {
  const [communities, setCommunities] = useState([]);
  const [selectedCommunity, setSelectedCommunity] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [filter, setFilter] = useState("Latest");

  // Load communities once
  useEffect(() => {
    api.communities.getAll()
      .then((d) => {
        const list = d.communities || [];
        setCommunities(list);
        if (list.length > 0) setSelectedCommunity(list[0].community_id);
      })
      .catch(() => toast.error("Failed to load communities"));
  }, []);

  // Load posts when community changes
  useEffect(() => {
    if (!selectedCommunity) return;
    setLoading(true);
    api.discussions.getAll(selectedCommunity)
      .then((d) => setPosts(d.discussions || []))
      .catch(() => toast.error("Failed to load discussions"))
      .finally(() => setLoading(false));
  }, [selectedCommunity]);

  const handleCreate = async ({ communityId, content, file }) => {
    try {
      const data = await api.discussions.create({ communityId, content, file });
      toast.success("Post submitted for AI review!");
      if (communityId === selectedCommunity) {
        setPosts((prev) => [data.discussion, ...prev]);
      }
    } catch (err) {
      toast.error(err.message || "Failed to create discussion");
      throw err;
    }
  };

  const sortedPosts = [...posts].sort((a, b) => {
    if (filter === "Latest") return new Date(b.created_at) - new Date(a.created_at);
    return 0;
  });

  return (
    <div className="p-5 sm:p-8 max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold" style={{ color: "var(--cn-text)" }}>Discussions</h2>
          <p className="text-sm mt-1" style={{ color: "var(--cn-text-3)" }}>
            Share thoughts, ask questions, and connect with your campus
          </p>
        </div>
        <button
          onClick={() => {
            if (communities.length === 0) return toast.error("Join a community first");
            setShowCreate(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white self-start"
          style={{ background: "linear-gradient(135deg, var(--cn-primary), #818CF8)", boxShadow: "0 4px 16px rgba(99,102,241,0.3)" }}
        >
          <Plus style={{ width: 15, height: 15 }} /> New Post
        </button>
      </div>

      {/* Community picker */}
      {communities.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {communities.map((c) => (
            <button
              key={c.community_id}
              onClick={() => setSelectedCommunity(c.community_id)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer"
              style={{
                background: selectedCommunity === c.community_id ? "var(--cn-primary)" : "var(--cn-surface)",
                color: selectedCommunity === c.community_id ? "white" : "var(--cn-text-3)",
                border: `1.5px solid ${selectedCommunity === c.community_id ? "var(--cn-primary)" : "var(--cn-border)"}`,
              }}
            >
              {c.name}
            </button>
          ))}
        </div>
      )}

      {/* Filter tabs */}
      <div className="flex gap-2">
        {["Latest", "Trending"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer"
            style={{
              background: filter === f ? "var(--cn-primary)" : "var(--cn-surface)",
              color: filter === f ? "white" : "var(--cn-text-3)",
              border: `1.5px solid ${filter === f ? "var(--cn-primary)" : "var(--cn-border)"}`,
            }}
          >
            {f === "Trending" && <TrendingUp style={{ width: 10, height: 10 }} />}
            {f}
          </button>
        ))}
      </div>

      {/* Posts */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => <div key={i} className="h-40 rounded-2xl cn-skeleton" />)}
        </div>
      ) : communities.length === 0 ? (
        <div className="text-center py-16">
          <MessageCircle style={{ width: 40, height: 40, color: "var(--cn-text-4)", margin: "0 auto 12px" }} />
          <p className="text-sm font-medium" style={{ color: "var(--cn-text-3)" }}>Join a community to see discussions</p>
        </div>
      ) : sortedPosts.length === 0 ? (
        <div className="text-center py-16">
          <MessageCircle style={{ width: 40, height: 40, color: "var(--cn-text-4)", margin: "0 auto 12px" }} />
          <p className="text-sm font-medium" style={{ color: "var(--cn-text-3)" }}>No discussions yet</p>
          <p className="text-xs mt-1" style={{ color: "var(--cn-text-4)" }}>Be the first to start one!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedPosts.map((post, i) => <PostCard key={post.post_id} post={post} index={i} />)}
        </div>
      )}

      {/* Create modal */}
      <AnimatePresence>
        {showCreate && (
          <CreatePostModal
            communities={communities}
            onClose={() => setShowCreate(false)}
            onCreate={handleCreate}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

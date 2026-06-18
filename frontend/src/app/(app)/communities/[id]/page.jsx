"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users, MessageSquare, FolderOpen, Megaphone, Info,
  Plus, Globe, Lock, Star, X, Loader, Search, Clock,
  Shield, AlertTriangle, Trash2, UserCog, ChevronDown,
  ChevronUp, CheckCircle, XCircle, Upload, Download,
  Paperclip, Send, Pin, Calendar, Tag, ShieldCheck,
  Sparkles, ChevronRight, ChevronLeft, Bold, Italic,
  Code, List, Quote
} from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import useAuthStore from "@/store/authStore";
import useActivityStore from "@/store/activityStore";

const TABS = [
  { id: "discussions", label: "Discussions", icon: MessageSquare },
  { id: "resources", label: "Resources", icon: FolderOpen },
  { id: "declarations", label: "Declarations", icon: Megaphone },
  { id: "members", label: "Members", icon: Users },
  { id: "about", label: "About", icon: Info },
];

const COLORS = ["#6366F1", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#06B6D4", "#F97316", "#EC4899"];
function tagColor(index) {
  return COLORS[index % COLORS.length];
}

const fileIcons = {
  pdf:  { Icon: FileTextIcon,  color: "#EF4444" },
  doc:  { Icon: FileTextIcon,  color: "#3B82F6" },
  docx: { Icon: FileTextIcon,  color: "#3B82F6" },
  code: { Icon: FileCodeIcon,  color: "#10B981" },
  js:   { Icon: FileCodeIcon,  color: "#F59E0B" },
  mp4:  { Icon: ImageIcon,     color: "#6366F1" },
  csv:  { Icon: DatabaseIcon,  color: "#F59E0B" },
  xlsx: { Icon: DatabaseIcon,  color: "#10B981" },
  zip:  { Icon: ArchiveIcon,   color: "#8B5CF6" },
};

function FileTextIcon(props) { return <FolderOpen {...props} />; }
function FileCodeIcon(props) { return <FolderOpen {...props} />; }
function ImageIcon(props) { return <FolderOpen {...props} />; }
function DatabaseIcon(props) { return <FolderOpen {...props} />; }
function ArchiveIcon(props) { return <FolderOpen {...props} />; }

function getFileIcon(url = "", title = "") {
  const ext = url.split(".").pop()?.toLowerCase() || title.split(".").pop()?.toLowerCase();
  return fileIcons[ext] || { Icon: FileTextIcon, color: "#64748B" };
}

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

/* ─────────────────────────────────────────────────────────
   AI Moderation Pipeline Visualizer
───────────────────────────────────────────────────────── */
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
        if (i === 4) setSimilarity(Math.floor(Math.random() * 30) + 55); // 55-85%
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
      className="rounded-2xl overflow-hidden p-4"
      style={{
        background: "linear-gradient(135deg, rgba(79,70,229,0.06), rgba(6,182,212,0.04))",
        border: "1px solid rgba(79,70,229,0.2)",
        marginTop: "1rem",
      }}
    >
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

      <div className="flex items-center gap-1 overflow-x-auto pb-2">
        {MOD_STEPS.map((s, i) => {
          const done = i < currentStep;
          const active = i === currentStep - 1;
          return (
            <div key={s.key} className="flex items-center gap-1 flex-1 min-w-[70px]">
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
                  className="text-[9px] text-center leading-tight whitespace-nowrap"
                  style={{
                    color: done || active ? s.color : "var(--cn-text-4)",
                    fontWeight: done || active ? 600 : 400,
                  }}
                >
                  {s.label}
                </span>
              </div>
              {i < MOD_STEPS.length - 1 && (
                <div
                  className="h-0.5 w-4 rounded-full mb-4"
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
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────
   Discussions Tab Component
───────────────────────────────────────────────────────── */
function DiscussionsTab({ communityId, isModerator }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [filter, setFilter] = useState("Latest");

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const d = await api.discussions.getAll(communityId);
      setPosts(d.discussions || []);
    } catch {
      toast.error("Failed to load discussions");
    } finally {
      setLoading(false);
    }
  }, [communityId]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleCreate = async ({ content, file }) => {
    try {
      const data = await api.discussions.create({ communityId, content, file });
      toast.success("Post submitted for AI review!");
      setPosts((prev) => [data.discussion, ...prev]);
    } catch (err) {
      toast.error(err.message || "Failed to submit post");
      throw err;
    }
  };

  const sortedPosts = [...posts].sort((a, b) => {
    if (filter === "Latest") return new Date(b.created_at) - new Date(a.created_at);
    return 0;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {["Latest", "Trending"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer"
              style={{
                background: filter === f ? "var(--cn-primary)" : "var(--cn-surface)",
                color: filter === f ? "white" : "var(--cn-text-3)",
                border: `1.5px solid ${filter === f ? "var(--cn-primary)" : "var(--cn-border)"}`,
              }}
            >
              {f}
            </button>
          ))}
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white cursor-pointer"
          style={{ background: "linear-gradient(135deg, var(--cn-primary), #818CF8)", boxShadow: "0 4px 16px rgba(99,102,241,0.3)" }}
        >
          <Plus className="w-4 h-4" /> New Post
        </button>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-40 rounded-2xl cn-skeleton" />
          ))}
        </div>
      ) : sortedPosts.length === 0 ? (
        <div className="text-center py-16 cn-card p-8">
          <MessageSquare className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <p className="text-sm font-medium" style={{ color: "var(--cn-text-3)" }}>No discussions yet.</p>
          <p className="text-xs mt-1" style={{ color: "var(--cn-text-4)" }}>Start a new discussion to engage community members.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedPosts.map((post, i) => (
            <CommunityPostCard key={post.post_id} post={post} index={i} isModerator={isModerator} refresh={fetchPosts} />
          ))}
        </div>
      )}

      <AnimatePresence>
        {showCreate && (
          <CreateDiscussionModal
            onClose={() => setShowCreate(false)}
            onCreate={handleCreate}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function CommunityPostCard({ post, index, isModerator, refresh }) {
  const [showReplies, setShowReplies] = useState(false);
  const color = tagColor(index);
  const [replies, setReplies] = useState([]);
  const [content, setContent] = useState("");
  const [loadingReplies, setLoadingReplies] = useState(false);
  const [sendingReply, setSendingReply] = useState(false);

  const aiCfg = {
    Pending:  { label: "AI Reviewing", color: "#F59E0B", icon: Clock },
    Accepted: { label: "AI Verified",  color: "#10B981", icon: ShieldCheck },
    Rejected: { label: "Rejected",     color: "#EF4444", icon: XCircle },
    Flagged:  { label: "Flagged",      color: "#EF4444", icon: AlertTriangle },
  }[post.status] || { label: "AI Reviewing", color: "#F59E0B", icon: Clock };

  const AIIcon = aiCfg.icon;

  const loadReplies = useCallback(async () => {
    setLoadingReplies(true);
    try {
      const d = await api.replies.getAll(post.post_id);
      setReplies(d.replies || []);
    } catch {
      toast.error("Failed to load comments");
    } finally {
      setLoadingReplies(false);
    }
  }, [post.post_id]);

  useEffect(() => {
    if (showReplies) {
      loadReplies();
    }
  }, [showReplies, loadReplies]);

  const sendReply = async () => {
    if (!content.trim()) return;
    setSendingReply(true);
    try {
      const d = await api.replies.send({ postId: post.post_id, content });
      setReplies((prev) => [d.reply, ...prev]);
      setContent("");
      toast.success("Comment sent!");
    } catch {
      toast.error("Failed to send reply");
    } finally {
      setSendingReply(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this discussion?")) return;
    try {
      await api.discussions.delete(post.post_id);
      toast.success("Discussion deleted successfully");
      refresh();
    } catch {
      toast.error("Failed to delete post");
    }
  };

  return (
    <div
      className="rounded-2xl overflow-hidden cn-card"
      style={{ boxShadow: "var(--cn-shadow)" }}
    >
      <div className="p-5">
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
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold" style={{ background: `${aiCfg.color}15`, color: aiCfg.color }}>
              <AIIcon className="w-3 h-3" />
              <span>{aiCfg.label}</span>
            </div>
            {isModerator && (
              <button
                onClick={handleDelete}
                className="p-1 rounded-lg text-slate-400 hover:text-red-500 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        <p className="text-sm leading-relaxed" style={{ color: "var(--cn-text-2)" }}>{post.content}</p>

        {post.attachments?.filter((a) => a.url).map((att) => (
          <a
            key={att.attachment_id}
            href={att.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 mt-3 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
            style={{ background: "var(--cn-surface-2)", border: "1px solid var(--cn-border)", color: "var(--cn-text-3)" }}
          >
            <Paperclip className="w-3.5 h-3.5" /> {att.title || "Attachment"}
          </a>
        ))}

        <div className="flex items-center gap-4 mt-4 pt-4" style={{ borderTop: "1px solid var(--cn-border)" }}>
          <button
            onClick={() => setShowReplies(!showReplies)}
            className="flex items-center gap-1.5 text-xs font-medium transition-all cursor-pointer"
            style={{ color: showReplies ? "var(--cn-primary)" : "var(--cn-text-4)" }}
          >
            <MessageSquare className="w-4 h-4" />
            {post.replies?.length ?? post._count?.replies ?? replies.length} comments
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showReplies && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="px-5 pb-4 border-t"
            style={{ borderColor: "var(--cn-border)", background: "var(--cn-surface)" }}
          >
            <div className="flex gap-2 mt-3">
              <input
                type="text"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write a comment…"
                className="cn-input py-2 text-xs flex-1"
                onKeyDown={(e) => { if (e.key === "Enter") sendReply(); }}
              />
              <button
                onClick={sendReply}
                disabled={sendingReply}
                className="px-3 py-2 rounded-xl flex items-center justify-center text-xs font-medium text-white cursor-pointer disabled:opacity-60"
                style={{ background: "var(--cn-primary)" }}
              >
                {sendingReply ? <Loader className="w-3 h-3 cn-animate-spin" /> : <Send className="w-3 h-3" />}
              </button>
            </div>
            {loadingReplies && <p className="text-xs mt-2" style={{ color: "var(--cn-text-4)" }}>Loading comments…</p>}
            {!loadingReplies && replies.length > 0 && (
              <div className="mt-3 space-y-2 max-h-60 overflow-y-auto pr-1">
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
        )}
      </AnimatePresence>
    </div>
  );
}

function CreateDiscussionModal({ onClose, onCreate }) {
  const [form, setForm] = useState({ content: "", file: null });
  const [loading, setLoading] = useState(false);
  const [showAI, setShowAI] = useState(false);
  const [fileName, setFileName] = useState(null);
  const textareaRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.content.trim()) return toast.error("Content is required");
    setLoading(true);
    setShowAI(true);
  };

  const handleAIDone = async () => {
    try {
      await onCreate(form);
      onClose();
    } catch {
      // already toasted
    } finally {
      setLoading(false);
      setShowAI(false);
    }
  };

  const insertFormat = (type) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selected = text.substring(start, end);

    let formatted = "";
    switch (type) {
      case "bold": formatted = `**${selected || "bold text"}**`; break;
      case "italic": formatted = `*${selected || "italic text"}*`; break;
      case "code": formatted = `\`${selected || "code"}\``; break;
      case "list": formatted = `\n- ${selected || "list item"}`; break;
      case "quote": formatted = `\n> ${selected || "quote"}`; break;
      default: return;
    }

    setForm((p) => ({ ...p, content: text.substring(0, start) + formatted + text.substring(end) }));
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + 2, start + 2 + (selected.length || 9));
    }, 50);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="relative z-10 w-full max-w-lg rounded-2xl p-6"
        style={{ background: "var(--cn-card)", border: "1px solid var(--cn-border)", boxShadow: "var(--cn-shadow-lg)" }}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-base font-bold" style={{ color: "var(--cn-text)" }}>New Discussion</h3>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <div className="flex items-center gap-1.5 mb-2 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-lg w-fit border border-slate-200 dark:border-slate-700">
              <button type="button" onClick={() => insertFormat("bold")} className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded" title="Bold"><Bold className="w-3.5 h-3.5" /></button>
              <button type="button" onClick={() => insertFormat("italic")} className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded" title="Italic"><Italic className="w-3.5 h-3.5" /></button>
              <button type="button" onClick={() => insertFormat("code")} className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded" title="Code"><Code className="w-3.5 h-3.5" /></button>
              <button type="button" onClick={() => insertFormat("list")} className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded" title="List"><List className="w-3.5 h-3.5" /></button>
              <button type="button" onClick={() => insertFormat("quote")} className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded" title="Quote"><Quote className="w-3.5 h-3.5" /></button>
            </div>
            <textarea
              ref={textareaRef}
              className="cn-input resize-none"
              rows={5}
              placeholder="What is on your mind? You can write formatted posts."
              value={form.content}
              onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))}
            />
          </div>

          <div>
            <label className="flex items-center gap-2 w-full px-3 py-2.5 rounded-xl text-xs cursor-pointer border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-500">
              <Paperclip className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{fileName || "Attach a document, image, or study file..."}</span>
              <input
                type="file"
                className="sr-only"
                onChange={(e) => {
                  const f = e.target.files[0] || null;
                  setFileName(f?.name || null);
                  setForm((p) => ({ ...p, file: f }));
                }}
              />
            </label>
          </div>

          <div className="flex items-center gap-1.5 p-2 rounded-xl border" style={{ background: "rgba(16,185,129,0.06)", borderColor: "rgba(16,185,129,0.2)" }}>
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span className="text-[10px] text-emerald-500 font-medium">AI moderation runs before publication to check similarity and safety.</span>
          </div>

          <AnimatePresence>
            {showAI && <AIModerationVisualizer visible={showAI} onDone={handleAIDone} />}
          </AnimatePresence>

          <button
            type="submit"
            disabled={loading || showAI || !form.content.trim()}
            className="w-full py-3 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            style={{ background: "linear-gradient(135deg, var(--cn-primary), #818CF8)" }}
          >
            {loading && <Loader className="w-4 h-4 cn-animate-spin" />}
            {showAI ? "AI is reviewing your content..." : "Publish Post"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Resources Tab Component
───────────────────────────────────────────────────────── */
function ResourcesTab({ communityId }) {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showUpload, setShowUpload] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const fetchResources = useCallback(async () => {
    setLoading(true);
    try {
      const d = await api.resources.getAll(communityId);
      setResources(d.resources || []);
    } catch {
      toast.error("Failed to load resources");
    } finally {
      setLoading(false);
    }
  }, [communityId]);

  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  const handleUpload = async ({ title, description, file }) => {
    try {
      const data = await api.resources.upload({ communityId, title, description, file });
      toast.success("Resource uploaded successfully!");
      setResources((prev) => [data.resource, ...prev]);
    } catch (err) {
      toast.error(err.message || "Upload failed");
      throw err;
    }
  };

  const filtered = resources.filter((r) => {
    const title = r.attachments?.[0]?.title || r.content || "";
    return title.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative max-w-xs flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search resource files…"
            className="cn-input pl-9 py-2 text-xs"
          />
        </div>
        <button
          onClick={() => setShowUpload(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white cursor-pointer"
          style={{ background: "linear-gradient(135deg, var(--cn-primary), #818CF8)" }}
        >
          <Upload className="w-4 h-4" /> Upload Resource
        </button>
      </div>

      <motion.div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          const file = e.dataTransfer.files[0];
          if (file) {
            handleUpload({ title: file.name, description: "", file });
          }
        }}
        animate={{ borderColor: isDragging ? "var(--cn-primary)" : "var(--cn-border-2)" }}
        className="relative rounded-2xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all border-2 border-dashed"
        style={{
          background: isDragging ? "var(--cn-primary-l)" : "var(--cn-surface)",
        }}
        onClick={() => setShowUpload(true)}
      >
        <Upload className="w-8 h-8 text-indigo-500" />
        <div className="text-center">
          <p className="text-sm font-semibold" style={{ color: "var(--cn-text)" }}>
            Drag and drop study files here, or <span className="text-indigo-500">click to browse</span>
          </p>
          <p className="text-xs text-slate-400 mt-1">Supports PDF, PPTX, DOCX, ZIP, CSV, JPG · Max 50MB</p>
        </div>
      </motion.div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-44 rounded-2xl cn-skeleton" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 cn-card p-6">
          <FolderOpen className="w-10 h-10 text-slate-400 mx-auto mb-2" />
          <p className="text-sm font-medium text-slate-400">No resources found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filtered.map((r, i) => (
            <ResourceCard key={r.post_id} resource={r} index={i} />
          ))}
        </div>
      )}

      <AnimatePresence>
        {showUpload && (
          <UploadModal
            onClose={() => setShowUpload(false)}
            onUpload={handleUpload}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function ResourceCard({ resource, index }) {
  const attach = resource.attachments?.[0];
  const { Icon, color } = getFileIcon(attach?.url || "", attach?.title || "");

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -3 }}
      className="rounded-2xl p-5 flex flex-col justify-between border cn-card"
    >
      <div>
        <div className="flex items-start justify-between mb-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-slate-100 dark:bg-slate-800" style={{ border: `1px solid ${color}30` }}>
            <Icon className="w-5 h-5" style={{ color }} />
          </div>
          <span className="px-2 py-0.5 rounded-full text-[9px] font-semibold bg-indigo-50 dark:bg-indigo-900/30 text-indigo-500">Resource</span>
        </div>
        <h4 className="text-sm font-bold truncate text-slate-900 dark:text-slate-100">
          {attach?.title || resource.content?.slice(0, 50) || "Unnamed Resource"}
        </h4>
        <p className="text-xs text-slate-400 mt-1.5 line-clamp-2">
          {resource.content || "No description provided."}
        </p>
      </div>

      <div className="mt-4 pt-3 border-t text-[11px] text-slate-400 flex justify-between items-center">
        <span>By {resource.user?.full_name || "Author"}</span>
        {attach?.url && (
          <a
            href={attach.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-indigo-500 font-semibold hover:underline"
          >
            <Download className="w-3.5 h-3.5" /> Download
          </a>
        )}
      </div>
    </motion.div>
  );
}

function UploadModal({ onClose, onUpload }) {
  const [form, setForm] = useState({ title: "", description: "", file: null });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.file) return toast.error("A file is required");
    setLoading(true);
    try {
      await onUpload(form);
      onClose();
    } catch {
      // toasted
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative z-10 w-full max-w-md rounded-2xl p-6"
        style={{ background: "var(--cn-card)", border: "1px solid var(--cn-border)", boxShadow: "var(--cn-shadow-lg)" }}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-base font-bold" style={{ color: "var(--cn-text)" }}>Upload Resource</h3>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="cn-label">Title</label>
            <input
              type="text"
              className="cn-input"
              value={form.title}
              onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
              placeholder="e.g. AI Lab Manual"
            />
          </div>
          <div>
            <label className="cn-label">Description</label>
            <textarea
              className="cn-input resize-none"
              rows={2}
              value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              placeholder="What is this file about?"
            />
          </div>
          <div>
            <label className="cn-label">File File</label>
            <input
              type="file"
              onChange={(e) => setForm((p) => ({ ...p, file: e.target.files[0] || null }))}
              className="text-xs w-full text-slate-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !form.file}
            className="w-full py-3 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            style={{ background: "linear-gradient(135deg, var(--cn-primary), #818CF8)" }}
          >
            {loading && <Loader className="w-4 h-4 cn-animate-spin" />}
            {loading ? "Uploading..." : "Upload File"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Declarations Tab Component (LocalStorage Sync + Accordion)
───────────────────────────────────────────────────────── */
function DeclarationsTab({ communityId, isModerator }) {
  const [declarations, setDeclarations] = useState([]);
  const [filter, setFilter] = useState("All");
  const [showCreate, setShowCreate] = useState(false);
  const [expanded, setExpanded] = useState({});
  const { addNotification, addActivity } = useActivityStore();

  const loadDeclarations = useCallback(() => {
    if (typeof window === "undefined") return;
    const key = `campnexus-declarations-${communityId}`;
    const stored = localStorage.getItem(key);
    if (stored) {
      setDeclarations(JSON.parse(stored));
    } else {
      const defaults = [
        {
          id: "d1",
          type: "urgent",
          category: "Notice",
          title: "Mid-term Examination Schedule Notice",
          content: "The mid-term exams will be conducted starting from the 25th of June. Ensure all admit cards are downloaded and clearance forms are signed. No calculators allowed unless specified.",
          author: "Academic Office",
          authorRole: "Professor",
          date: new Date().toLocaleDateString(),
          time: "09:30 AM",
          pinned: true,
          attachments: ["Exam_Guidelines.pdf"],
          views: 120,
        },
        {
          id: "d2",
          type: "event",
          category: "Event",
          title: "Hackathon Registrations 2026",
          content: "Annual hackathon starts this weekend! Team up with peers, construct awesome web apps, and win big prizes. Mentoring will be available offline in lab 4.",
          author: "Tech Society",
          authorRole: "Club Head",
          date: new Date().toLocaleDateString(),
          time: "11:45 AM",
          pinned: false,
          attachments: [],
          views: 94,
        }
      ];
      localStorage.setItem(key, JSON.stringify(defaults));
      setDeclarations(defaults);
    }
  }, [communityId]);

  useEffect(() => {
    loadDeclarations();
  }, [loadDeclarations]);

  const saveDeclarations = (newDecl) => {
    const key = `campnexus-declarations-${communityId}`;
    localStorage.setItem(key, JSON.stringify(newDecl));
    setDeclarations(newDecl);
  };

  const handleCreate = (form) => {
    const newDeclObj = {
      id: `decl-${Date.now()}`,
      type: form.type,
      category: form.category,
      title: form.title,
      content: form.content,
      author: form.author,
      authorRole: form.authorRole,
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      pinned: form.pinned,
      attachments: form.attachment ? [form.attachment.name] : [],
      views: 0,
    };

    const updated = [newDeclObj, ...declarations];
    saveDeclarations(updated);
    toast.success("Declaration posted successfully!");

    // Trigger notification and activity
    addNotification({
      type: "Declaration",
      text: `Announcement: ${form.title}`,
      category: "declarations",
      icon: "📣",
      color: form.type === "urgent" ? "var(--cn-danger)" : "var(--cn-primary)"
    });

    addActivity({
      text: `New announcement: "${form.title}"`,
      type: "declaration",
      icon: "📣",
      color: form.type === "urgent" ? "#EF4444" : "#6366F1"
    });
  };

  const handleDelete = (id) => {
    if (!window.confirm("Delete this announcement?")) return;
    const updated = declarations.filter((d) => d.id !== id);
    saveDeclarations(updated);
    toast.success("Declaration deleted!");
  };

  const filtered = declarations.filter((d) => {
    if (filter === "All") return true;
    if (filter === "Urgent") return d.type === "urgent";
    if (filter === "Events") return d.type === "event";
    if (filter === "Announcements") return d.type === "info";
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex gap-2">
          {["All", "Urgent", "Events", "Announcements"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer"
              style={{
                background: filter === f ? "var(--cn-primary)" : "var(--cn-surface)",
                color: filter === f ? "white" : "var(--cn-text-3)",
                border: `1.5px solid ${filter === f ? "var(--cn-primary)" : "var(--cn-border)"}`,
              }}
            >
              {f}
            </button>
          ))}
        </div>
        {isModerator && (
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white cursor-pointer"
            style={{ background: "linear-gradient(135deg, var(--cn-primary), #818CF8)" }}
          >
            <Plus className="w-4 h-4" /> Create Declaration
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 cn-card p-6">
          <Megaphone className="w-10 h-10 text-slate-400 mx-auto mb-2" />
          <p className="text-sm font-medium text-slate-400">No announcements in this category.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((decl, idx) => {
            const isExp = !!expanded[decl.id];
            const cfg = {
              urgent: { icon: AlertTriangle, color: "#EF4444", bg: "rgba(239,68,68,0.1)", label: "Urgent" },
              event: { icon: Calendar, color: "#6366F1", bg: "rgba(99,102,241,0.1)", label: "Event" },
              info: { icon: Info, color: "#10B981", bg: "rgba(16,185,129,0.1)", label: "Info" },
            }[decl.type] || { icon: Info, color: "#10B981", bg: "rgba(16,185,129,0.1)", label: "Info" };
            const Icon = cfg.icon;

            return (
              <div key={decl.id} className="flex gap-4">
                <div className="flex flex-col items-center flex-shrink-0">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: cfg.bg, border: `1.5px solid ${cfg.color}30` }}>
                    <Icon className="w-4.5 h-4.5" style={{ color: cfg.color }} />
                  </div>
                  <div className="w-px flex-1 mt-2 bg-slate-200 dark:bg-slate-800" style={{ minHeight: 20 }} />
                </div>

                <div className="flex-1 cn-card overflow-hidden" style={{ border: decl.pinned ? `1.5px solid ${cfg.color}30` : "1px solid var(--cn-border)" }}>
                  <div
                    onClick={() => setExpanded(p => ({ ...p, [decl.id]: !p[decl.id] }))}
                    className="p-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors flex items-start justify-between"
                  >
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase" style={{ background: cfg.bg, color: cfg.color }}>{decl.category}</span>
                        {decl.pinned && <span className="flex items-center gap-0.5 text-[10px] text-slate-400"><Pin className="w-2.5 h-2.5" /> Pinned</span>}
                        {decl.type === "urgent" && <span className="text-[10px] text-red-500 font-bold cn-animate-pulse-glow">● URGENT</span>}
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{decl.title}</h4>
                      <p className="text-xs text-slate-400">By {decl.author} ({decl.authorRole}) · {decl.date} at {decl.time}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {isModerator && (
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDelete(decl.id); }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                      {isExp ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
                    </div>
                  </div>

                  <AnimatePresence>
                    {isExp && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="px-4 pb-4 border-t border-slate-100 dark:border-slate-800"
                      >
                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mt-3 whitespace-pre-wrap">{decl.content}</p>
                        {decl.attachments?.length > 0 && (
                          <div className="mt-3 flex gap-2">
                            {decl.attachments.map((att) => (
                              <div key={att} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                                📎 {att}
                              </div>
                            ))}
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <AnimatePresence>
        {showCreate && (
          <CreateDeclarationModal
            onClose={() => setShowCreate(false)}
            onCreate={handleCreate}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function CreateDeclarationModal({ onClose, onCreate }) {
  const { user } = useAuthStore();
  const [form, setForm] = useState({
    title: "",
    content: "",
    type: "info",
    category: "Notice",
    pinned: false,
    attachment: null,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) return toast.error("Please fill all required fields");
    onCreate({
      ...form,
      author: user?.full_name || "Coordinator",
      authorRole: user?.role || "Professor",
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative z-10 w-full max-w-md rounded-2xl p-6"
        style={{ background: "var(--cn-card)", border: "1px solid var(--cn-border)", boxShadow: "var(--cn-shadow-lg)" }}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-base font-bold" style={{ color: "var(--cn-text)" }}>Create Declaration</h3>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="cn-label">Title *</label>
            <input
              type="text"
              className="cn-input"
              value={form.title}
              onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
              placeholder="e.g. Schedule Update for Lab Classes"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="cn-label">Priority Type</label>
              <select className="cn-input" value={form.type} onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))}>
                <option value="info">Info</option>
                <option value="event">Event</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
            <div>
              <label className="cn-label">Category</label>
              <select className="cn-input" value={form.category} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}>
                <option value="Notice">Notice</option>
                <option value="Event">Event</option>
                <option value="Placement">Placement</option>
                <option value="Academic">Academic</option>
                <option value="General">General</option>
              </select>
            </div>
          </div>

          <div>
            <label className="cn-label">Content *</label>
            <textarea
              className="cn-input resize-none"
              rows={4}
              value={form.content}
              onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))}
              placeholder="Detailed description of the announcement..."
              required
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="cn-label flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.pinned} onChange={(e) => setForm((p) => ({ ...p, pinned: e.target.checked }))} className="w-4 h-4 accent-indigo-600" />
              Pin Announcement
            </label>
          </div>

          <div>
            <label className="cn-label">Attachment</label>
            <input type="file" className="text-xs text-slate-500" onChange={(e) => setForm((p) => ({ ...p, attachment: e.target.files[0] || null }))} />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 cursor-pointer"
            style={{ background: "linear-gradient(135deg, var(--cn-primary), #818CF8)" }}
          >
            Post Announcement
          </button>
        </form>
      </motion.div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Members Tab Component (Inline roles edit + Kick Actions)
───────────────────────────────────────────────────────── */
function MembersTab({ communityId, isModerator }) {
  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const key = `campnexus-members-${communityId}`;
    const stored = localStorage.getItem(key);
    if (stored) {
      setMembers(JSON.parse(stored));
    } else {
      const defaults = [
        { id: "m1", name: "Amit Patel", email: "amit.patel@campus.edu", role: "Moderator", joinedAt: "2026-02-14" },
        { id: "m2", name: "Sanya Roy", email: "sanya.roy@campus.edu", role: "Member", joinedAt: "2026-03-01" },
        { id: "m3", name: "Rohan Malhotra", email: "rohan.m@campus.edu", role: "Member", joinedAt: "2026-03-10" },
        { id: "m4", name: "Tanya Sen", email: "tanya.sen@campus.edu", role: "Member", joinedAt: "2026-04-05" },
      ];
      localStorage.setItem(key, JSON.stringify(defaults));
      setMembers(defaults);
    }
  }, [communityId]);

  const saveMembers = (updated) => {
    localStorage.setItem(`campnexus-members-${communityId}`, JSON.stringify(updated));
    setMembers(updated);
  };

  const handleRoleChange = (id, newRole) => {
    const updated = members.map((m) => m.id === id ? { ...m, role: newRole } : m);
    saveMembers(updated);
    toast.success("Member role updated!");
  };

  const handleKick = (id) => {
    if (!window.confirm("Are you sure you want to remove this member?")) return;
    const updated = members.filter((m) => m.id !== id);
    saveMembers(updated);
    toast.success("Member removed!");
  };

  const filtered = members.filter((m) => m.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-4">
      <div className="relative max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search members…"
          className="cn-input pl-9 py-2 text-xs"
        />
      </div>

      <div className="cn-card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/40 text-xs font-semibold text-slate-400 border-b">
              <th className="px-4 py-3 text-left">Member</th>
              <th className="px-4 py-3 text-left">Role</th>
              <th className="px-4 py-3 text-left">Joined</th>
              {isModerator && <th className="px-4 py-3 text-right">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {filtered.map((m) => (
              <tr key={m.id} className="border-b last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/20 text-xs">
                <td className="px-4 py-3 font-semibold text-slate-900 dark:text-slate-100">{m.name} <span className="block text-[10px] text-slate-400 font-normal">{m.email}</span></td>
                <td className="px-4 py-3">
                  {isModerator ? (
                    <select
                      className="bg-transparent border rounded p-1 cursor-pointer"
                      value={m.role}
                      onChange={(e) => handleRoleChange(m.id, e.target.value)}
                    >
                      <option value="Member">Member</option>
                      <option value="Moderator">Moderator</option>
                    </select>
                  ) : (
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${m.role === 'Moderator' ? 'bg-orange-50 text-orange-500' : 'bg-slate-100 dark:bg-slate-800'}`}>{m.role}</span>
                  )}
                </td>
                <td className="px-4 py-3 text-slate-400">{new Date(m.joinedAt).toLocaleDateString()}</td>
                {isModerator && (
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleKick(m.id)}
                      className="p-1 text-slate-400 hover:text-red-500 rounded transition-colors"
                      title="Kick user"
                    >
                      <XCircle className="w-4.5 h-4.5" />
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   About Tab Component (Configs slider and settings edit)
───────────────────────────────────────────────────────── */
function AboutTab({ communityId, description, tags, isModerator }) {
  const [config, setConfig] = useState({
    visibility: "Public",
    postPermission: "All Members",
    uploadPermission: "All Members",
    declarationPermission: "Moderators",
    aiThreshold: 0.55,
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const key = `campnexus-community-config-${communityId}`;
    const stored = localStorage.getItem(key);
    if (stored) {
      setConfig(JSON.parse(stored));
    } else {
      localStorage.setItem(key, JSON.stringify(config));
    }
  }, [communityId]);

  const saveConfig = (key, val) => {
    const updated = { ...config, [key]: val };
    setConfig(updated);
    localStorage.setItem(`campnexus-community-config-${communityId}`, JSON.stringify(updated));
    toast.success("Community configuration saved!");
  };

  const cleanDescription = description?.split("\n\n").pop() || description || "No description provided.";
  const tagline = description?.split("\n\n")[0] || "";

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2 space-y-6">
        <div className="cn-card p-6">
          <h3 className="text-base font-bold mb-3">About Community</h3>
          {tagline && <p className="text-sm italic font-medium text-indigo-500 mb-3">"{tagline}"</p>}
          <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300 whitespace-pre-wrap">{cleanDescription}</p>

          <div className="flex flex-wrap gap-2 mt-4">
            {tags?.map((tag) => (
              <span key={tag} className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">#{tag}</span>
            ))}
          </div>
        </div>

        <div className="cn-card p-6">
          <h3 className="text-base font-bold mb-3">Community Rules</h3>
          <ul className="text-xs text-slate-500 space-y-2 list-disc pl-4 leading-relaxed">
            <li>Keep posts constructive and strictly relevant to campus learning and collaboration.</li>
            <li>Do not upload copyrighted textbooks or materials without permission.</li>
            <li>AI moderation automatically flags duplicate or highly identical contents.</li>
            <li>Maintain respect towards peers, club heads, and professors at all times.</li>
          </ul>
        </div>
      </div>

      <div className="space-y-6">
        <div className="cn-card p-6 space-y-4">
          <h3 className="text-sm font-bold">Permissions & Settings</h3>
          <div>
            <label className="cn-label">Visibility</label>
            <select
              disabled={!isModerator}
              className="cn-input text-xs"
              value={config.visibility}
              onChange={(e) => saveConfig("visibility", e.target.value)}
            >
              <option value="Public">Public</option>
              <option value="Private">Private</option>
              <option value="Invite Only">Invite Only</option>
            </select>
          </div>
          <div>
            <label className="cn-label">Who can post discussions</label>
            <select
              disabled={!isModerator}
              className="cn-input text-xs"
              value={config.postPermission}
              onChange={(e) => saveConfig("postPermission", e.target.value)}
            >
              <option value="All Members">All Members</option>
              <option value="Moderators">Moderators</option>
            </select>
          </div>
          <div>
            <label className="cn-label">Who can upload resources</label>
            <select
              disabled={!isModerator}
              className="cn-input text-xs"
              value={config.uploadPermission}
              onChange={(e) => saveConfig("uploadPermission", e.target.value)}
            >
              <option value="All Members">All Members</option>
              <option value="Moderators">Moderators</option>
            </select>
          </div>
          <div>
            <label className="cn-label">AI Moderation Sensitivity Slider</label>
            <div className="flex items-center justify-between text-xs font-semibold text-slate-400 mb-1">
              <span>Low (0.3)</span>
              <span className="text-indigo-500 font-bold">{config.aiThreshold.toFixed(2)}</span>
              <span>High (0.9)</span>
            </div>
            <input
              type="range"
              min="0.30"
              max="0.90"
              step="0.05"
              disabled={!isModerator}
              className="w-full h-1 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              value={config.aiThreshold}
              onChange={(e) => saveConfig("aiThreshold", parseFloat(e.target.value))}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Main Component: CommunityDetailPage
───────────────────────────────────────────────────────── */
export default function CommunityDetailPage() {
  const params = useParams();
  const id = params.id;
  const router = useRouter();

  const { user } = useAuthStore();
  const [community, setCommunity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("discussions");
  const [joining, setJoining] = useState(false);

  const fetchCommunity = useCallback(async () => {
    setLoading(true);
    try {
      const d = await api.communities.getAll();
      const match = (d.communities || []).find((c) => c.community_id === id);
      if (match) {
        setCommunity({ ...match, userIsMember: true });
      } else {
        setCommunity({ community_id: id, name: "Specialist Group", description: "Campus Collaboration Space", tags: ["tech", "academic"], userIsMember: false });
      }
    } catch {
      toast.error("Failed to load community details");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchCommunity();
    }
  }, [id, fetchCommunity]);

  const handleJoin = async () => {
    setJoining(true);
    try {
      await api.communities.join(id);
      toast.success("Joined community successfully!");
      setCommunity((prev) => prev ? { ...prev, userIsMember: true } : null);
    } catch (err) {
      toast.error(err.message || "Failed to join community");
    } finally {
      setJoining(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-3">
        <Loader className="w-8 h-8 text-indigo-500 cn-animate-spin" />
        <p className="text-sm font-semibold text-slate-400">Loading Community...</p>
      </div>
    );
  }

  if (!community) {
    return (
      <div className="text-center py-24 cn-card max-w-md mx-auto p-8 mt-12">
        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-lg font-bold">Community Not Found</h2>
        <p className="text-xs text-slate-400 mt-1">This community might have been deleted or does not exist.</p>
        <Link href="/communities" className="inline-block mt-4 text-xs font-semibold text-indigo-500 hover:underline">← Go back</Link>
      </div>
    );
  }

  const isModerator = user?.role === "Admin" || user?.role === "ClubHead" || community.role === "Moderator";

  return (
    <div className="pb-12 space-y-6">
      {/* Hero Header */}
      <div className="relative h-48 sm:h-56 bg-slate-900 overflow-hidden" style={{ background: `linear-gradient(135deg, ${tagColor(0)} 0%, #1E1B4B 100%)` }}>
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.15) 10%, transparent 11%)",
          backgroundSize: "20px 20px"
        }} />
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }} />
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 bg-gradient-to-t from-slate-950/70 to-transparent">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-end gap-4">
            <div
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center text-3xl font-extrabold text-white flex-shrink-0"
              style={{ background: "rgba(255,255,255,0.12)", border: "3px solid rgba(255,255,255,0.2)", backdropFilter: "blur(12px)" }}
            >
              {community.name?.[0]?.toUpperCase() || "C"}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-white leading-tight">{community.name}</h1>
                {community.role && (
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    {community.role}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-300 mt-1 font-medium line-clamp-1">
                {community.description?.split("\n\n")[0] || "Explore discussions and resources."}
              </p>
            </div>
            {community.userIsMember ? (
              <span className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 self-start sm:self-auto">
                Member ✓
              </span>
            ) : (
              <button
                onClick={handleJoin}
                disabled={joining}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-indigo-700 bg-white hover:bg-slate-100 transition-colors self-start sm:self-auto flex items-center gap-2 cursor-pointer disabled:opacity-75"
              >
                {joining && <Loader className="w-3.5 h-3.5 cn-animate-spin" />}
                Join Community
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 flex gap-2 overflow-x-auto whitespace-nowrap scrollbar-none">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  if (!community.userIsMember && tab.id !== "about") {
                    toast.error("You must join this community to view this tab");
                    return;
                  }
                  setActiveTab(tab.id);
                }}
                disabled={!community.userIsMember && tab.id !== "about"}
                className={`flex items-center gap-2 px-4 py-3.5 text-xs font-semibold border-b-2 transition-all cursor-pointer relative disabled:opacity-40 disabled:cursor-not-allowed`}
                style={{
                  color: active ? "var(--cn-primary)" : "var(--cn-text-3)",
                  borderColor: active ? "var(--cn-primary)" : "transparent"
                }}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Panel Render */}
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          {activeTab === "discussions" && (
            <DiscussionsTab communityId={id} isModerator={isModerator} />
          )}
          {activeTab === "resources" && (
            <ResourcesTab communityId={id} />
          )}
          {activeTab === "declarations" && (
            <DeclarationsTab communityId={id} isModerator={isModerator} />
          )}
          {activeTab === "members" && (
            <MembersTab communityId={id} isModerator={isModerator} />
          )}
          {activeTab === "about" && (
            <AboutTab
              communityId={id}
              description={community.description}
              tags={community.tags}
              isModerator={isModerator}
            />
          )}
        </motion.div>
      </div>
    </div>
  );
}

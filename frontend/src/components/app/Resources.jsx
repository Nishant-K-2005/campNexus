"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload, Search, Download, Eye, FileText,
  Image, FileCode, Database, Archive, Filter, X, Loader, ChevronDown,
} from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";

const fileIcons = {
  pdf:  { Icon: FileText,  color: "#EF4444" },
  doc:  { Icon: FileText,  color: "#3B82F6" },
  docx: { Icon: FileText,  color: "#3B82F6" },
  code: { Icon: FileCode,  color: "#10B981" },
  js:   { Icon: FileCode,  color: "#F59E0B" },
  mp4:  { Icon: Image,     color: "#6366F1" },
  csv:  { Icon: Database,  color: "#F59E0B" },
  xlsx: { Icon: Database,  color: "#10B981" },
  zip:  { Icon: Archive,   color: "#8B5CF6" },
};

function getFileIcon(url = "", title = "") {
  const ext = url.split(".").pop()?.toLowerCase() || title.split(".").pop()?.toLowerCase();
  return fileIcons[ext] || { Icon: FileText, color: "#64748B" };
}

function timeAgo(dateStr) {
  const diff = (Date.now() - new Date(dateStr)) / 1000;
  if (diff < 86400) return "Today";
  if (diff < 172800) return "Yesterday";
  return new Date(dateStr).toLocaleDateString();
}

/* ─── Resource Card ─────────────────────────────────────── */
function ResourceCard({ resource, index }) {
  const attach = resource.attachments?.[0];
  const { Icon, color } = getFileIcon(attach?.url || "", attach?.title || "");

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4 }}
      whileHover={{ y: -3 }}
      className="rounded-2xl p-5 flex flex-col cursor-default transition-all duration-200"
      style={{ background: "var(--cn-card)", border: "1px solid var(--cn-border)", boxShadow: "var(--cn-shadow)" }}
      onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "var(--cn-shadow-lg)"; e.currentTarget.style.borderColor = color + "40"; }}
      onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "var(--cn-shadow)"; e.currentTarget.style.borderColor = "var(--cn-border)"; }}
    >
      {/* Icon + badge */}
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center"
          style={{ background: `${color}15`, border: `1px solid ${color}30` }}
        >
          <Icon style={{ width: 20, height: 20, color }} />
        </div>
        <span
          className="px-2 py-0.5 rounded-full text-[10px] font-semibold"
          style={{ background: "var(--cn-primary-l)", color: "var(--cn-primary)" }}
        >
          Resource
        </span>
      </div>

      {/* Name */}
      <h3 className="text-sm font-semibold leading-snug flex-1" style={{ color: "var(--cn-text)" }}>
        {attach?.title || resource.content?.slice(0, 60) || "Untitled Resource"}
      </h3>
      <p className="text-xs mt-1.5 leading-relaxed line-clamp-2" style={{ color: "var(--cn-text-4)" }}>
        {resource.content || "No description."}
      </p>

      {/* Meta */}
      <div className="mt-4 pt-4 space-y-3" style={{ borderTop: "1px solid var(--cn-border)" }}>
        <div className="flex justify-between text-xs" style={{ color: "var(--cn-text-4)" }}>
          <span>By {resource.user?.full_name || "Unknown"}</span>
          <span>{timeAgo(resource.created_at)}</span>
        </div>
        {attach?.url && (
          <div className="flex items-center justify-between">
            <span className="text-xs" style={{ color: "var(--cn-text-4)" }}>
              {attach.file_size || ""}
            </span>
            <a
              href={attach.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-all"
              style={{ background: "var(--cn-primary)" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "var(--cn-primary-h)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "var(--cn-primary)"; }}
            >
              <Download style={{ width: 12, height: 12 }} /> Download
            </a>
          </div>
        )}
      </div>
    </motion.div>
  );
}

/* ─── Upload Modal ───────────────────────────────────────── */
function UploadModal({ communities, onClose, onUpload }) {
  const [form, setForm] = useState({
    communityId: communities[0]?.community_id || "",
    title: "",
    description: "",
    file: null,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.file) return toast.error("Please select a file");
    if (!form.communityId) return toast.error("Select a community");
    setLoading(true);
    try {
      await onUpload(form);
      onClose();
    } catch {
      // toasted by caller
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.5)" }} onClick={onClose} />
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="relative w-full max-w-md rounded-2xl p-6 z-10"
        style={{ background: "var(--cn-card)", border: "1px solid var(--cn-border)", boxShadow: "var(--cn-shadow-lg)" }}
      >
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-base font-bold" style={{ color: "var(--cn-text)" }}>Upload Resource</h2>
          <button onClick={onClose} className="cursor-pointer" style={{ color: "var(--cn-text-4)" }}>
            <X style={{ width: 18, height: 18 }} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
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
          <div>
            <label className="cn-label">Title (optional)</label>
            <input
              className="cn-input"
              placeholder="e.g. ML Notes Week 7"
              value={form.title}
              onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
            />
          </div>
          <div>
            <label className="cn-label">Description (optional)</label>
            <textarea
              className="cn-input resize-none"
              rows={2}
              placeholder="Brief description of this resource"
              value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
            />
          </div>
          <div>
            <label className="cn-label">File *</label>
            <input
              type="file"
              className="text-xs w-full"
              style={{ color: "var(--cn-text-3)" }}
              onChange={(e) => setForm((p) => ({ ...p, file: e.target.files[0] || null }))}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            style={{ background: "linear-gradient(135deg, var(--cn-primary), #818CF8)" }}
          >
            {loading && <Loader style={{ width: 14, height: 14 }} className="cn-animate-spin" />}
            {loading ? "Uploading…" : "Upload Resource"}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}

/* ─── Main View ──────────────────────────────────────────── */
export default function ResourcesView() {
  const [communities, setCommunities] = useState([]);
  const [selectedCommunity, setSelectedCommunity] = useState(null);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [showUpload, setShowUpload] = useState(false);

  // Load communities
  useEffect(() => {
    api.communities.getAll()
      .then((d) => {
        const list = d.communities || [];
        setCommunities(list);
        if (list.length > 0) setSelectedCommunity(list[0].community_id);
      })
      .catch(() => toast.error("Failed to load communities"));
  }, []);

  // Load resources when community changes
  useEffect(() => {
    if (!selectedCommunity) return;
    setLoading(true);
    api.resources.getAll(selectedCommunity)
      .then((d) => setResources(d.resources || []))
      .catch(() => toast.error("Failed to load resources"))
      .finally(() => setLoading(false));
  }, [selectedCommunity]);

  const handleUpload = async ({ communityId, title, description, file }) => {
    try {
      const data = await api.resources.upload({ communityId, title, description, file });
      toast.success("Resource submitted for AI review!");
      if (communityId === selectedCommunity) {
        setResources((prev) => [data.resource, ...prev]);
      }
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
    <div className="p-5 sm:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold" style={{ color: "var(--cn-text)" }}>Resources</h2>
          <p className="text-sm mt-1" style={{ color: "var(--cn-text-3)" }}>
            {loading ? "Loading…" : `${resources.length} resource${resources.length !== 1 ? "s" : ""} in this community`}
          </p>
        </div>
        <button
          onClick={() => {
            if (communities.length === 0) return toast.error("Join a community first");
            setShowUpload(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white self-start"
          style={{ background: "linear-gradient(135deg, var(--cn-primary), #818CF8)", boxShadow: "0 4px 16px rgba(99,102,241,0.3)" }}
        >
          <Upload style={{ width: 15, height: 15 }} /> Upload Resource
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

      {/* Drag & drop upload zone */}
      <motion.div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          const file = e.dataTransfer.files[0];
          if (file && communities.length > 0) {
            handleUpload({ communityId: selectedCommunity, title: file.name, description: "", file });
          } else if (communities.length === 0) {
            toast.error("Join a community first");
          }
        }}
        animate={{ borderColor: isDragging ? "var(--cn-primary)" : "var(--cn-border-2)" }}
        className="relative rounded-2xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all"
        style={{
          border: `2px dashed ${isDragging ? "var(--cn-primary)" : "var(--cn-border-2)"}`,
          background: isDragging ? "var(--cn-primary-l)" : "var(--cn-surface)",
        }}
        onClick={() => { if (communities.length > 0) setShowUpload(true); }}
      >
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: "var(--cn-primary-l)" }}>
          <Upload style={{ width: 22, height: 22, color: "var(--cn-primary)" }} />
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold" style={{ color: "var(--cn-text)" }}>
            Drop files here or <span style={{ color: "var(--cn-primary)" }}>click to upload</span>
          </p>
          <p className="text-xs mt-1" style={{ color: "var(--cn-text-4)" }}>
            Supports PDF, DOCX, XLSX, ZIP, MP4 · Max 500MB
          </p>
        </div>
      </motion.div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2"
          style={{ width: 15, height: 15, color: "var(--cn-text-4)" }}
        />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search resources…"
          className="cn-input pl-9 py-2.5"
        />
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {[...Array(6)].map((_, i) => <div key={i} className="h-52 rounded-2xl cn-skeleton" />)}
        </div>
      ) : communities.length === 0 ? (
        <div className="text-center py-16">
          <FileText style={{ width: 40, height: 40, color: "var(--cn-text-4)", margin: "0 auto 12px" }} />
          <p className="text-sm font-medium" style={{ color: "var(--cn-text-3)" }}>Join a community to browse resources</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <FileText style={{ width: 40, height: 40, color: "var(--cn-text-4)", margin: "0 auto 12px" }} />
          <p className="text-sm font-medium" style={{ color: "var(--cn-text-3)" }}>No resources found</p>
          <p className="text-xs mt-1" style={{ color: "var(--cn-text-4)" }}>Upload the first one!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((r, i) => <ResourceCard key={r.post_id} resource={r} index={i} />)}
        </div>
      )}

      {/* Upload Modal */}
      <AnimatePresence>
        {showUpload && (
          <UploadModal
            communities={communities}
            onClose={() => setShowUpload(false)}
            onUpload={handleUpload}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

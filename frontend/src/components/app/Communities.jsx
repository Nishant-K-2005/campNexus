"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Users, Plus, Globe, Lock, Star, TrendingUp, X, Loader } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";

const categories = ["All", "Technology", "Arts & Culture", "Engineering", "Business", "Wellbeing", "Other"];

/* colour palette for unknown communities (cycles by index) */
const COLORS = ["#6366F1", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#06B6D4", "#F97316", "#EC4899"];

function tagColor(index) {
  return COLORS[index % COLORS.length];
}

function CommunityCard({ community, index, onJoin }) {
  const [joining, setJoining] = useState(false);
  const color = tagColor(index);
  const isJoined = community.userIsMember;

  const handleJoin = async (e) => {
    e.stopPropagation();
    if (isJoined) return;
    setJoining(true);
    try {
      await onJoin(community.community_id);
    } finally {
      setJoining(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4 }}
      whileHover={{ y: -4 }}
      className="rounded-2xl p-5 flex flex-col cursor-pointer transition-all duration-200"
      style={{
        background: "var(--cn-card)",
        border: "1px solid var(--cn-border)",
        boxShadow: "var(--cn-shadow)",
      }}
      onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "var(--cn-shadow-lg)"; e.currentTarget.style.borderColor = color + "40"; }}
      onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "var(--cn-shadow)"; e.currentTarget.style.borderColor = "var(--cn-border)"; }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold text-white flex-shrink-0"
            style={{ background: `linear-gradient(135deg, ${color}, ${color}CC)` }}
          >
            {community.name?.[0]?.toUpperCase() || "C"}
          </div>
          <div>
            <h3 className="text-sm font-semibold" style={{ color: "var(--cn-text)" }}>
              {community.name}
            </h3>
            {community.role && (
              <span className="text-[10px] font-semibold uppercase tracking-wide" style={{ color }}>
                {community.role}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="text-xs leading-relaxed flex-1" style={{ color: "var(--cn-text-3)" }}>
        {community.description || "No description provided."}
      </p>

      {/* Tags */}
      {community.tags?.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {community.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 rounded-full text-[10px] font-medium"
              style={{
                background: "var(--cn-surface-2)",
                color: "var(--cn-text-3)",
                border: "1px solid var(--cn-border)",
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between mt-4 pt-4" style={{ borderTop: "1px solid var(--cn-border)" }}>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-xs" style={{ color: "var(--cn-text-4)" }}>
            <Users style={{ width: 11, height: 11 }} />
            {community.members?.length ?? community._count?.members ?? "—"}
          </span>
        </div>
        <button
          onClick={handleJoin}
          disabled={joining || isJoined}
          className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer disabled:opacity-70 flex items-center gap-1"
          style={{
            background: isJoined ? "var(--cn-surface-2)" : color,
            color: isJoined ? "var(--cn-text-2)" : "white",
            border: `1.5px solid ${isJoined ? "var(--cn-border)" : color}`,
          }}
        >
          {joining && <Loader style={{ width: 10, height: 10 }} className="cn-animate-spin" />}
          {isJoined ? "Joined ✓" : "Join"}
        </button>
      </div>
    </motion.div>
  );
}

/* ─── Create Community Modal ───────────────────────────── */
function CreateCommunityModal({ onClose, onCreate }) {
  const [form, setForm] = useState({ name: "", description: "", tags: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return toast.error("Community name is required");
    setLoading(true);
    try {
      const tags = form.tags.split(",").map((t) => t.trim()).filter(Boolean);
      await onCreate({ name: form.name, description: form.description, tags });
      onClose();
    } catch {
      // error already toasted by caller
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
      <div
        className="absolute inset-0"
        style={{ background: "rgba(0,0,0,0.5)" }}
        onClick={onClose}
      />
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="relative w-full max-w-md rounded-2xl p-6 z-10"
        style={{ background: "var(--cn-card)", border: "1px solid var(--cn-border)", boxShadow: "var(--cn-shadow-lg)" }}
      >
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-base font-bold" style={{ color: "var(--cn-text)" }}>Create Community</h2>
          <button onClick={onClose} className="cursor-pointer" style={{ color: "var(--cn-text-4)" }}>
            <X style={{ width: 18, height: 18 }} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="cn-label">Community Name *</label>
            <input
              className="cn-input"
              placeholder="e.g. AI Research Club"
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            />
          </div>
          <div>
            <label className="cn-label">Description</label>
            <textarea
              className="cn-input resize-none"
              rows={3}
              placeholder="What is this community about?"
              value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
            />
          </div>
          <div>
            <label className="cn-label">Tags (comma-separated)</label>
            <input
              className="cn-input"
              placeholder="e.g. AI, Machine Learning, Python"
              value={form.tags}
              onChange={(e) => setForm((p) => ({ ...p, tags: e.target.value }))}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            style={{ background: "linear-gradient(135deg, var(--cn-primary), #818CF8)" }}
          >
            {loading && <Loader style={{ width: 14, height: 14 }} className="cn-animate-spin" />}
            {loading ? "Creating..." : "Create Community"}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}

/* ─── Main View ─────────────────────────────────────────── */
export default function CommunitiesView() {
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);

  const fetchCommunities = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.communities.getAll();
      // Backend returns communities the user is a member of; mark them
      const enriched = (data.communities || []).map((c) => ({ ...c, userIsMember: true }));
      setCommunities(enriched);
    } catch (err) {
      toast.error(err.message || "Failed to load communities");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchCommunities(); }, [fetchCommunities]);

  const handleJoin = async (communityId) => {
    try {
      await api.communities.join(communityId);
      toast.success("Joined community!");
      setCommunities((prev) =>
        prev.map((c) => c.community_id === communityId ? { ...c, userIsMember: true } : c)
      );
    } catch (err) {
      toast.error(err.message || "Could not join community");
      throw err;
    }
  };

  const handleCreate = async ({ name, description, tags }) => {
    try {
      const data = await api.communities.create({ name, description, tags });
      toast.success("Community created!");
      setCommunities((prev) => [{ ...data.community, userIsMember: true, role: "Moderator" }, ...prev]);
    } catch (err) {
      toast.error(err.message || "Could not create community");
      throw err;
    }
  };

  const filtered = communities.filter((c) =>
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-5 sm:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold" style={{ color: "var(--cn-text)" }}>Communities</h2>
          <p className="text-sm mt-1" style={{ color: "var(--cn-text-3)" }}>
            {loading ? "Loading…" : `You're a member of ${communities.length} communit${communities.length !== 1 ? "ies" : "y"}`}
          </p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white self-start"
          style={{ background: "linear-gradient(135deg, var(--cn-primary), #818CF8)", boxShadow: "0 4px 16px rgba(99,102,241,0.3)" }}
        >
          <Plus style={{ width: 15, height: 15 }} /> Create Community
        </button>
      </div>

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
          placeholder="Search communities..."
          className="cn-input pl-9 py-2.5"
        />
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-52 rounded-2xl cn-skeleton" />
          ))}
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((c, i) => (
            <CommunityCard key={c.community_id} community={c} index={i} onJoin={handleJoin} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <Globe style={{ width: 40, height: 40, color: "var(--cn-text-4)", margin: "0 auto 12px" }} />
          <p className="text-sm font-medium" style={{ color: "var(--cn-text-3)" }}>
            {communities.length === 0 ? "You haven't joined any communities yet" : "No communities match your search"}
          </p>
          <p className="text-xs mt-1" style={{ color: "var(--cn-text-4)" }}>
            {communities.length === 0 ? "Create one to get started!" : "Try a different search term"}
          </p>
        </div>
      )}

      {/* Create Modal */}
      <AnimatePresence>
        {showCreate && (
          <CreateCommunityModal onClose={() => setShowCreate(false)} onCreate={handleCreate} />
        )}
      </AnimatePresence>
    </div>
  );
}

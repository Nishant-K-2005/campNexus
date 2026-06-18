"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle, Calendar, Info, Bell, Pin, ChevronDown,
  ChevronRight, Plus, X, Loader, ShieldCheck
} from "lucide-react";
import { toast } from "sonner";
import useAuthStore from "@/store/authStore";
import useActivityStore from "@/store/activityStore";
import api from "@/lib/api";

const initialDeclarations = [
  {
    id: "g1",
    type: "urgent",
    category: "Notice",
    title: "Mid-term Examination Schedule – June 2026",
    content: "The mid-term examinations for all departments will be held from June 25 to July 2, 2026. Students are required to carry their identity cards. No electronic devices will be allowed in the examination halls. Detailed timetables have been uploaded to the student portal.",
    author: "Academic Office",
    authorRole: "Administration",
    date: "Jun 11, 2026",
    time: "9:00 AM",
    pinned: true,
    attachments: ["Mid-term_Schedule_2026.pdf"],
    views: 3421,
  },
  {
    id: "g2",
    type: "event",
    category: "Event",
    title: "CampNexus Hackathon 2026 – Registration Open",
    content: "We are thrilled to announce the CampNexus Hackathon 2026! This is a 48-hour event where teams of 2-5 members will build innovative solutions across tracks including AI/ML, Web3, ClimateTech, and EdTech. Prize pool of ₹5,0,000. Registration closes June 15.",
    author: "Tech Society",
    authorRole: "Club Head",
    date: "Jun 10, 2026",
    time: "2:00 PM",
    pinned: true,
    attachments: ["Hackathon_Brochure.pdf", "Registration_Form.xlsx"],
    views: 5843,
  },
  {
    id: "g3",
    type: "info",
    category: "Announcement",
    title: "New AI-Powered Research Lab Inaugurated",
    content: "The university has inaugurated a state-of-the-art AI Research Lab equipped with 20 NVIDIA A100 GPUs, enabling advanced research in generative AI, robotics, and computational biology. The lab will be accessible to final-year students and research scholars.",
    author: "VC Office",
    authorRole: "Administration",
    date: "Jun 9, 2026",
    time: "11:00 AM",
    attachments: [],
    views: 2109,
  },
  {
    id: "g4",
    type: "event",
    category: "Event",
    title: "AI Research Symposium – Call for Papers",
    content: "The annual AI Research Symposium is accepting paper submissions until June 20, 2026. This year's theme is 'Responsible AI for a Sustainable Future'. Papers can be submitted in the areas of ML, NLP, Computer Vision, and AI Ethics.",
    author: "Research Department",
    authorRole: "Academic",
    date: "Jun 8, 2026",
    time: "4:00 PM",
    attachments: ["Submission_Guidelines.pdf"],
    views: 1876,
  },
  {
    id: "g5",
    type: "info",
    category: "Notice",
    title: "Library Working Hours Extended for Exam Season",
    content: "The central library will operate 24/7 from June 20 to July 5, 2026 to support students during exam preparation. Additional study spaces on floor 3 will also be opened. Silent zones will be strictly enforced after 10 PM.",
    author: "Library Administration",
    authorRole: "Administration",
    date: "Jun 7, 2026",
    time: "10:00 AM",
    attachments: [],
    views: 987,
  },
  {
    id: "g6",
    type: "urgent",
    category: "Notice",
    title: "Campus Network Maintenance – Scheduled Downtime",
    content: "The campus network will undergo scheduled maintenance on June 13, 2026 from 2:00 AM to 6:00 AM. All services including the student portal, LMS, and Wi-Fi will be unavailable during this window. Please plan accordingly.",
    author: "IT Department",
    authorRole: "Administration",
    date: "Jun 6, 2026",
    time: "3:00 PM",
    attachments: [],
    views: 4231,
  },
];

const typeConfig = {
  urgent: { icon: AlertTriangle, color: "#EF4444", bg: "rgba(239,68,68,0.1)", label: "Urgent" },
  event: { icon: Calendar, color: "#6366F1", bg: "rgba(99,102,241,0.1)", label: "Event" },
  info: { icon: Info, color: "#10B981", bg: "rgba(16,185,129,0.1)", label: "Info" },
};

function DeclarationCard({ decl, index, isModerator, onDelete }) {
  const [expanded, setExpanded] = useState(index === 0);
  const config = typeConfig[decl.type] || typeConfig.info;
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.07, duration: 0.4 }}
      className="flex gap-4 relative"
    >
      <div className="flex flex-col items-center flex-shrink-0">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center z-10"
          style={{ background: config.bg, border: `1.5px solid ${config.color}30` }}
        >
          <Icon style={{ width: 15, height: 15, color: config.color }} />
        </div>
        <div
          className="w-px flex-1 mt-2"
          style={{ background: "var(--cn-border)", minHeight: 20 }}
        />
      </div>

      <div
        className="flex-1 mb-4 rounded-2xl overflow-hidden"
        style={{
          background: "var(--cn-card)",
          border: `1px solid ${decl.pinned ? config.color + "30" : "var(--cn-border)"}`,
          boxShadow: "var(--cn-shadow)",
        }}
      >
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-start gap-3 p-4 text-left cursor-pointer transition-all"
          style={{ background: "transparent" }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "var(--cn-surface-2)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
        >
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span
                className="px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase"
                style={{ background: config.bg, color: config.color }}
              >
                {decl.category}
              </span>
              {decl.pinned && (
                <span className="flex items-center gap-1 text-[10px] font-semibold" style={{ color: "var(--cn-text-4)" }}>
                  <Pin style={{ width: 8, height: 8 }} /> Pinned
                </span>
              )}
              {decl.type === "urgent" && (
                <motion.span
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="px-2 py-0.5 rounded-full text-[10px] font-bold"
                  style={{ background: "rgba(239,68,68,0.15)", color: "#EF4444" }}
                >
                  ● URGENT
                </motion.span>
              )}
            </div>
            <h3 className="text-sm font-semibold" style={{ color: "var(--cn-text)" }}>{decl.title}</h3>
            <div className="flex flex-wrap items-center gap-2 mt-1.5">
              <span className="text-xs font-medium" style={{ color: "var(--cn-text-3)" }}>
                {decl.author}
              </span>
              <span className="text-xs" style={{ color: "var(--cn-text-4)" }}>·</span>
              <span className="text-xs" style={{ color: "var(--cn-text-4)" }}>{decl.date} at {decl.time}</span>
              <span className="text-xs" style={{ color: "var(--cn-text-4)" }}>·</span>
              <span className="text-xs" style={{ color: "var(--cn-text-4)" }}>{decl.views.toLocaleString()} views</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isModerator && (
              <button
                onClick={(e) => { e.stopPropagation(); onDelete(decl.id); }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 transition-colors"
              >
                <Trash2Icon className="w-4 h-4" />
              </button>
            )}
            {expanded ? (
              <ChevronDown style={{ width: 16, height: 16, color: "var(--cn-text-4)", flexShrink: 0 }} />
            ) : (
              <ChevronRight style={{ width: 16, height: 16, color: "var(--cn-text-4)", flexShrink: 0 }} />
            )}
          </div>
        </button>

        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="px-4 pb-4"
            style={{ borderTop: "1px solid var(--cn-border)" }}
          >
            <p className="text-sm leading-relaxed mt-3" style={{ color: "var(--cn-text-2)" }}>
              {decl.content}
            </p>
            {decl.attachments?.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {decl.attachments.map((att) => (
                  <button
                    key={att}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer"
                    style={{
                      background: "var(--cn-surface-2)",
                      border: "1px solid var(--cn-border)",
                      color: "var(--cn-text-2)",
                    }}
                  >
                    📎 {att}
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

function Trash2Icon(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M3 6h18"/>
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
    </svg>
  );
}

export default function DeclarationsView() {
  const [declarations, setDeclarations] = useState([]);
  const [filter, setFilter] = useState("All");
  const [showCreate, setShowCreate] = useState(false);
  const { user } = useAuthStore();
  const { addNotification, addActivity } = useActivityStore();

  const loadGlobalDeclarations = useCallback(() => {
    if (typeof window === "undefined") return;
    const key = "campnexus-global-declarations";
    const stored = localStorage.getItem(key);
    if (stored) {
      setDeclarations(JSON.parse(stored));
    } else {
      localStorage.setItem(key, JSON.stringify(initialDeclarations));
      setDeclarations(initialDeclarations);
    }
  }, []);

  useEffect(() => {
    loadGlobalDeclarations();
  }, [loadGlobalDeclarations]);

  const saveDeclarations = (newDecls) => {
    localStorage.setItem("campnexus-global-declarations", JSON.stringify(newDecls));
    setDeclarations(newDecls);
  };

  const handleCreate = (form) => {
    const newDeclObj = {
      id: `decl-${Date.now()}`,
      type: form.type,
      category: form.category,
      title: form.title,
      content: form.content,
      author: user?.full_name || "Academic Coordinator",
      authorRole: user?.role || "Professor",
      date: new Date().toLocaleDateString("en-US", { day: 'numeric', month: 'short', year: 'numeric' }),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      pinned: form.pinned,
      attachments: form.attachment ? [form.attachment.name] : [],
      views: 0,
    };

    const updated = [newDeclObj, ...declarations];
    saveDeclarations(updated);
    toast.success("Global declaration posted successfully!");

    addNotification({
      type: "Declaration",
      text: `Announcement: ${form.title}`,
      category: "declarations",
      icon: "📣",
      color: form.type === "urgent" ? "var(--cn-danger)" : "var(--cn-primary)"
    });

    addActivity({
      text: `Posted campus declaration: "${form.title}"`,
      type: "declaration",
      icon: "📣",
      color: form.type === "urgent" ? "#EF4444" : "#6366F1"
    });
  };

  const handleDelete = (id) => {
    if (!window.confirm("Delete this campus declaration?")) return;
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

  const filters = ["All", "Urgent", "Events", "Announcements"];
  const isPrivileged = user?.role === "Admin" || user?.role === "Professor" || user?.role === "ClubHead";

  return (
    <div className="p-5 sm:p-8 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold" style={{ color: "var(--cn-text)" }}>Declarations</h2>
          <p className="text-sm mt-1" style={{ color: "var(--cn-text-3)" }}>
            Official announcements, events, and notices from your campus
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {filters.map((f) => (
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
          {isPrivileged && (
            <button
              onClick={() => setShowCreate(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-all cursor-pointer bg-indigo-600 hover:bg-indigo-700"
            >
              <Plus className="w-3.5 h-3.5" /> Post
            </button>
          )}
        </div>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Total", value: declarations.length, color: "var(--cn-primary)" },
          { label: "Urgent", value: declarations.filter((d) => d.type === "urgent").length, color: "#EF4444" },
          { label: "Events", value: declarations.filter((d) => d.type === "event").length, color: "#6366F1" },
        ].map(({ label, value, color }) => (
          <div
            key={label}
            className="p-3 rounded-xl text-center"
            style={{ background: "var(--cn-surface)", border: "1px solid var(--cn-border)" }}
          >
            <p className="text-xl font-bold" style={{ color }}>{value}</p>
            <p className="text-xs" style={{ color: "var(--cn-text-4)" }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Timeline */}
      <div className="space-y-4">
        {filtered.map((decl, i) => (
          <DeclarationCard
            key={decl.id}
            decl={decl}
            index={i}
            isModerator={isPrivileged}
            onDelete={handleDelete}
          />
        ))}
      </div>

      <AnimatePresence>
        {showCreate && (
          <GlobalDeclarationCreateModal
            onClose={() => setShowCreate(false)}
            onCreate={handleCreate}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function GlobalDeclarationCreateModal({ onClose, onCreate }) {
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
    onCreate(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="relative z-10 w-full max-w-md rounded-2xl p-6"
        style={{ background: "var(--cn-card)", border: "1px solid var(--cn-border)", boxShadow: "var(--cn-shadow-lg)" }}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-base font-bold" style={{ color: "var(--cn-text)" }}>Create Campus Declaration</h3>
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
              placeholder="e.g. Campus Holiday Announcement"
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

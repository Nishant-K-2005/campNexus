"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Calendar, Info, Bell, Pin, ChevronDown, ChevronRight } from "lucide-react";

const declarations = [
  {
    id: 1,
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
    id: 2,
    type: "event",
    category: "Event",
    title: "CampNexus Hackathon 2026 – Registration Open",
    content: "We are thrilled to announce the CampNexus Hackathon 2026! This is a 48-hour event where teams of 2-5 members will build innovative solutions across tracks including AI/ML, Web3, ClimateTech, and EdTech. Prize pool of ₹5,00,000. Registration closes June 15.",
    author: "Tech Society",
    authorRole: "Club Head",
    date: "Jun 10, 2026",
    time: "2:00 PM",
    pinned: true,
    attachments: ["Hackathon_Brochure.pdf", "Registration_Form.xlsx"],
    views: 5843,
  },
  {
    id: 3,
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
    id: 4,
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
    id: 5,
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
    id: 6,
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

function DeclarationCard({ decl, index }) {
  const [expanded, setExpanded] = useState(index === 0);
  const config = typeConfig[decl.type];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.07, duration: 0.4 }}
      className="flex gap-4 relative"
    >
      {/* Timeline line */}
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

      {/* Card */}
      <div
        className="flex-1 mb-4 rounded-2xl overflow-hidden"
        style={{
          background: "var(--cn-card)",
          border: `1px solid ${decl.pinned ? config.color + "30" : "var(--cn-border)"}`,
          boxShadow: "var(--cn-shadow)",
        }}
      >
        {/* Card header */}
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
          {expanded ? (
            <ChevronDown style={{ width: 16, height: 16, color: "var(--cn-text-4)", flexShrink: 0 }} />
          ) : (
            <ChevronRight style={{ width: 16, height: 16, color: "var(--cn-text-4)", flexShrink: 0 }} />
          )}
        </button>

        {/* Expanded content */}
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
            {decl.attachments.length > 0 && (
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
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--cn-primary)"; e.currentTarget.style.color = "var(--cn-primary)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--cn-border)"; e.currentTarget.style.color = "var(--cn-text-2)"; }}
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

export default function DeclarationsView() {
  const [filter, setFilter] = useState("All");
  const filters = ["All", "Urgent", "Events", "Announcements"];

  const filtered = declarations.filter((d) => {
    if (filter === "All") return true;
    if (filter === "Urgent") return d.type === "urgent";
    if (filter === "Events") return d.type === "event";
    if (filter === "Announcements") return d.type === "info";
    return true;
  });

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
      <div>
        {filtered.map((decl, i) => (
          <DeclarationCard key={decl.id} decl={decl} index={i} />
        ))}
      </div>
    </div>
  );
}

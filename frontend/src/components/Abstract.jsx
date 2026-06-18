"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Brain, Cpu, Users, GraduationCap, ShieldCheck } from "lucide-react";

const abstractSections = [
  {
    icon: GraduationCap,
    title: "Unified Collaboration",
    desc: "Bridges the gap between fragmented chats and formal portals, allowing students and faculty to share resources and interact in a unified, campus-specific space.",
    color: "#6366F1",
    bg: "rgba(99,102,241,0.08)"
  },
  {
    icon: Users,
    title: "Digitized Discourse",
    desc: "Asynchronous forum discussions and centralized document pools decrease the cognitive load of campus communication, maintaining a searchable knowledge archive.",
    color: "#06B6D4",
    bg: "rgba(6,182,212,0.08)"
  },
  {
    icon: Brain,
    title: "AI Content Gatekeeper",
    desc: "Leverages Large Language Models and vector embeddings to audit post content, ensuring on-topic discussions and automated similarity matching in real-time.",
    color: "#10B981",
    bg: "rgba(16,185,129,0.08)"
  },
  {
    icon: Cpu,
    title: "Robust Full-Stack",
    desc: "Next.js frontend, Express/Node.js core API, and Postgres + pgvector storage provide high-performance concurrent request handling and semantic similarity search.",
    color: "#8B5CF6",
    bg: "rgba(139,92,246,0.08)"
  }
];

export default function Abstract() {
  return (
    <section className="py-24 relative overflow-hidden transition-colors duration-300" style={{ background: "var(--cn-bg)" }}>
      {/* Decorative Blur */}
      <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 blur-[140px] opacity-20 pointer-events-none">
        <div className="h-[480px] w-[480px] rounded-full bg-gradient-to-tr from-indigo-500 to-cyan-500" />
      </div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs border border-indigo-200 dark:border-indigo-900/30 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 font-semibold">
            <Sparkles className="w-3.5 h-3.5" /> Project Overview
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight" style={{ color: "var(--cn-text)" }}>
            CampNexus Core Abstract
          </h2>
          <p className="text-sm sm:text-base leading-relaxed" style={{ color: "var(--cn-text-3)" }}>
            An academic hub integrating artificial intelligence with structured community governance to support networking and collaborative campus learning.
          </p>
        </div>

        {/* Abstract Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-3xl p-6 sm:p-10 border relative overflow-hidden mb-12 shadow-xl"
          style={{
            background: "var(--cn-card)",
            borderColor: "var(--cn-border)",
            boxShadow: "var(--cn-shadow-lg)"
          }}
        >
          <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-bl from-indigo-500/10 to-transparent blur-xl" />
          
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: "var(--cn-text)" }}>
            <ShieldCheck className="w-5 h-5 text-indigo-500" /> Executive Summary
          </h3>
          <p className="text-xs sm:text-sm leading-relaxed text-justify space-y-4 font-medium" style={{ color: "var(--cn-text-2)" }}>
            CampNexus is a centralized digital platform designed to improve how students and faculty manage academic collaboration and campus communication. By integrating a full stack architecture comprising Next.js, Express.js, Node.js, and PostgreSQL via Prisma, the application provides an organized interface for educational interaction. The primary objective is to bridge the gap between fragmented messaging applications and formal academic portals, allowing users to share resources and participate in structured discussions within a unified, domain-specific ecosystem.
          </p>
        </motion.div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {abstractSections.map((sec, idx) => {
            const Icon = sec.icon;
            return (
              <motion.div
                key={sec.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                whileHover={{ y: -3 }}
                className="rounded-2xl p-6 border transition-all"
                style={{
                  background: "var(--cn-card)",
                  borderColor: "var(--cn-border)",
                  boxShadow: "var(--cn-shadow)"
                }}
              >
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: sec.bg, border: `1px solid ${sec.color}25` }}>
                    <Icon className="w-5 h-5" style={{ color: sec.color }} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold mb-1.5" style={{ color: "var(--cn-text)" }}>{sec.title}</h4>
                    <p className="text-xs leading-relaxed" style={{ color: "var(--cn-text-3)" }}>{sec.desc}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

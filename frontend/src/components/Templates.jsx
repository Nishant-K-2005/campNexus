"use client";

import React from "react";
import { Reveal } from "./MotionWrap";

const data = [
  { title: "Data Science Club", tag: "Community" },
  { title: "Placement Prep Hub", tag: "Community" },
  { title: "AI Study Group", tag: "Community" },
  { title: "Notes & Resources", tag: "Verified" },
  { title: "Hackathon Teams", tag: "Community" },
  { title: "Project Showcase", tag: "Verified" },
];

function Templates() {
  return (
    <section id="templates" className="relative py-20 overflow-hidden transition-colors duration-300" style={{ background: "var(--cn-bg)" }}>
      <div className="absolute top-10 left-0 -translate-x-1/3 blur-3xl opacity-10 pointer-events-none">
        <div className="aspect-square h-[420px] rounded-full bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-400" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <Reveal>
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs border" style={{ borderColor: "var(--cn-border)", background: "var(--cn-surface-2)", color: "var(--cn-text-2)" }}>
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse" />
              Start fast
            </div>
            <h2 className="mt-4 text-3xl md:text-4xl font-extrabold tracking-tight" style={{ color: "var(--cn-text)" }}>
              Explore verified campus spaces
            </h2>
            <p className="mt-3 text-sm sm:text-base" style={{ color: "var(--cn-text-3)" }}>
              Join communities, access verified resources, and collaborate — all in one place.
            </p>
          </div>
        </Reveal>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {data.map((x, i) => (
            <Reveal key={x.title} delay={i * 0.06}>
              <div
                className="rounded-2xl p-6 relative overflow-hidden transition-all duration-200"
                style={{
                  background: "var(--cn-card)",
                  border: "1px solid var(--cn-border)",
                  boxShadow: "var(--cn-shadow)"
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "var(--cn-shadow-lg)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "var(--cn-shadow)"; }}
              >
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#1d2a52_1px,transparent_1px)] [background-size:22px_22px] [mask-image:linear-gradient(0deg,#fff,rgba(255,255,255,0.6))]" />
                <div className="relative">
                  <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: x.tag === "Verified" ? "var(--cn-success)" : "var(--cn-primary)" }}>{x.tag}</div>
                  <div className="mt-1 font-bold text-lg" style={{ color: "var(--cn-text)" }}>{x.title}</div>
 
                  <div className="mt-4 space-y-2">
                    <div className="h-3 rounded w-full" style={{ background: "var(--cn-surface-2)" }} />
                    <div className="h-3 rounded w-5/6" style={{ background: "var(--cn-surface-2)" }} />
                    <div className="h-3 rounded w-4/6" style={{ background: "var(--cn-surface-2)" }} />
                  </div>
 
                  <div className="mt-5 flex gap-2">
                    <span className="px-3 py-1 text-xs rounded-full border" style={{ background: "var(--cn-primary-l)", color: "var(--cn-primary)", borderColor: "rgba(99,102,241,0.2)" }}>
                      #Campus
                    </span>
                    <span className="px-3 py-1 text-xs rounded-full border" style={{ background: "rgba(16,185,129,0.1)", color: "var(--cn-success)", borderColor: "rgba(16,185,129,0.2)" }}>
                      AI Verified
                    </span>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Templates;


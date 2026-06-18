"use client";

import React from "react";
import { Reveal } from "./MotionWrap";
import {
  Brain,
  Users,
  Search,
  Share2,
  GraduationCap,
  ShieldCheck,
} from "lucide-react";

const feats = [
  {
    title: "AI Verified Resources",
    desc: "Less misinformation. More learning.",
    icon: Brain,
  },
  {
    title: "Focused Communities",
    desc: "Only relevant posts and discussions.",
    icon: Users,
  },
  {
    title: "Smart Search",
    desc: "Find notes, posts, and people quickly.",
    icon: Search,
  },
  {
    title: "Project Sharing",
    desc: "Show your work & get feedback.",
    icon: Share2,
  },
  {
    title: "Mentor Spaces",
    desc: "Guidance from seniors & mentors.",
    icon: GraduationCap,
  },
  {
    title: "Safe Moderation",
    desc: "Clean, respectful environment.",
    icon: ShieldCheck,
  },
];

function Features() {
  return (
    <section id="features" className="relative py-20 overflow-hidden transition-colors duration-300" style={{ background: "var(--cn-bg)" }}>
      <div className="absolute bottom-0 right-0 translate-x-1/3 blur-3xl opacity-10 pointer-events-none">
        <div className="aspect-square h-[460px] rounded-full bg-gradient-to-tr from-cyan-500 to-indigo-600" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <Reveal>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight" style={{ color: "var(--cn-text)" }}>
            Built for serious students
          </h2>
          <p className="mt-3 max-w-2xl text-sm sm:text-base" style={{ color: "var(--cn-text-3)" }}>
            Everything in CampNexus matches the same verified + focused learning theme.
          </p>
        </Reveal>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {feats.map((f, i) => {
            const Icon = f.icon;

            return (
              <Reveal key={f.title} delay={i * 0.06}>
                <div
                  className="rounded-2xl p-6 transition-all duration-200 cursor-default"
                  style={{
                    background: "var(--cn-card)",
                    border: "1px solid var(--cn-border)",
                    boxShadow: "var(--cn-shadow)",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "var(--cn-shadow-lg)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "var(--cn-shadow)"; }}
                >
                  {/* Icon Box */}
                  <div
                    className="h-11 w-11 rounded-xl flex items-center justify-center shadow-sm"
                    style={{
                      background: "var(--cn-primary-l)",
                      border: "1px solid rgba(99,102,241,0.2)",
                    }}
                  >
                    <Icon className="w-5 h-5" style={{ color: "var(--cn-primary)" }} />
                  </div>

                  <h3 className="mt-4 font-bold text-lg" style={{ color: "var(--cn-text)" }}>
                    {f.title}
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm" style={{ color: "var(--cn-text-3)" }}>{f.desc}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Features;


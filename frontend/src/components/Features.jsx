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
    <section id="features" className="relative bg-[#060B1A] py-20 overflow-hidden">
      <div className="absolute bottom-0 right-0 translate-x-1/3 blur-3xl opacity-20 pointer-events-none">
        <div className="aspect-square h-[460px] rounded-full bg-gradient-to-tr from-cyan-500 to-indigo-600" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <Reveal>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Built for serious students
          </h2>
          <p className="mt-3 text-slate-300 max-w-2xl">
            Everything in Campnexus matches the same verified + focused learning theme.
          </p>
        </Reveal>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {feats.map((f, i) => {
            const Icon = f.icon;

            return (
              <Reveal key={f.title} delay={i * 0.06}>
                <div className="rounded-2xl bg-white/5 border border-white/10 shadow-xl shadow-indigo-500/10 p-6 backdrop-blur hover:translate-y-[-2px] hover:shadow-indigo-500/20 transition-all duration-300">

                  {/* Icon Box */}
                  <div className="h-11 w-11 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                    <Icon className="w-5 h-5 text-indigo-400" />
                  </div>

                  <h3 className="mt-4 text-white font-bold text-lg">
                    {f.title}
                  </h3>
                  <p className="mt-2 text-slate-300">{f.desc}</p>
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

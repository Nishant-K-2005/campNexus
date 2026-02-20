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
    <section id="templates" className="relative bg-[#060B1A] py-20 overflow-hidden">
      <div className="absolute top-10 left-0 -translate-x-1/3 blur-3xl opacity-20 pointer-events-none">
        <div className="aspect-square h-[420px] rounded-full bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-400" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <Reveal>
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-200">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
              Start fast
            </div>
            <h2 className="mt-4 text-3xl md:text-4xl font-extrabold tracking-tight text-white">
              Explore verified campus spaces
            </h2>
            <p className="mt-3 text-slate-300">
              Join communities, access verified resources, and collaborate — all in one place.
            </p>
          </div>
        </Reveal>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {data.map((x, i) => (
            <Reveal key={x.title} delay={i * 0.06}>
              <div className="rounded-2xl bg-white/5 border border-white/10 shadow-xl shadow-indigo-500/10 p-6 backdrop-blur relative overflow-hidden hover:translate-y-[-2px] transition-transform">
                <div className="absolute inset-0 opacity-30 bg-[radial-gradient(#1d2a52_1px,transparent_1px)] [background-size:22px_22px] [mask-image:linear-gradient(0deg,#fff,rgba(255,255,255,0.6))]" />
                <div className="relative">
                  <div className="text-xs text-slate-400">{x.tag}</div>
                  <div className="mt-1 text-white font-bold text-lg">{x.title}</div>

                  <div className="mt-4 space-y-2">
                    <div className="h-3 bg-white/10 rounded w-full" />
                    <div className="h-3 bg-white/10 rounded w-5/6" />
                    <div className="h-3 bg-white/10 rounded w-4/6" />
                  </div>

                  <div className="mt-5 flex gap-2">
                    <span className="px-3 py-1 bg-indigo-500/10 text-indigo-300 text-xs rounded-full border border-indigo-400/20">
                      #Campus
                    </span>
                    <span className="px-3 py-1 bg-emerald-500/10 text-emerald-300 text-xs rounded-full border border-emerald-400/20">
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

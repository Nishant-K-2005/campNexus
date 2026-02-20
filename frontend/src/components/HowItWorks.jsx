"use client";

import React from "react";
import { Reveal } from "./MotionWrap";

const SvgCommunity = () => (
  <svg
    viewBox="0 0 240 96"
    className="w-full h-full"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="g1" x1="0" y1="0" x2="240" y2="96">
        <stop stopColor="#6366F1" stopOpacity="0.9" />
        <stop offset="0.6" stopColor="#A855F7" stopOpacity="0.7" />
        <stop offset="1" stopColor="#22D3EE" stopOpacity="0.7" />
      </linearGradient>
    </defs>

    {/* nodes */}
    <circle cx="52" cy="48" r="10" stroke="url(#g1)" strokeWidth="2" />
    <circle cx="120" cy="26" r="10" stroke="url(#g1)" strokeWidth="2" />
    <circle cx="120" cy="70" r="10" stroke="url(#g1)" strokeWidth="2" />
    <circle cx="188" cy="48" r="10" stroke="url(#g1)" strokeWidth="2" />

    {/* links */}
    <path
      d="M62 48 L110 28"
      stroke="url(#g1)"
      strokeWidth="2"
      strokeLinecap="round"
      opacity="0.9"
    />
    <path
      d="M62 48 L110 68"
      stroke="url(#g1)"
      strokeWidth="2"
      strokeLinecap="round"
      opacity="0.9"
    />
    <path
      d="M130 26 L178 48"
      stroke="url(#g1)"
      strokeWidth="2"
      strokeLinecap="round"
      opacity="0.9"
    />
    <path
      d="M130 70 L178 48"
      stroke="url(#g1)"
      strokeWidth="2"
      strokeLinecap="round"
      opacity="0.9"
    />

    {/* subtle glow dots */}
    <circle cx="52" cy="48" r="3" fill="#6366F1" opacity="0.8" />
    <circle cx="120" cy="26" r="3" fill="#A855F7" opacity="0.8" />
    <circle cx="120" cy="70" r="3" fill="#22D3EE" opacity="0.8" />
    <circle cx="188" cy="48" r="3" fill="#6366F1" opacity="0.8" />
  </svg>
);

const SvgVerified = () => (
  <svg
    viewBox="0 0 240 96"
    className="w-full h-full"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="g2" x1="0" y1="0" x2="240" y2="96">
        <stop stopColor="#22D3EE" stopOpacity="0.75" />
        <stop offset="0.6" stopColor="#6366F1" stopOpacity="0.85" />
        <stop offset="1" stopColor="#A855F7" stopOpacity="0.7" />
      </linearGradient>
    </defs>

    {/* badge */}
    <path
      d="M120 16 L150 28 V56 C150 70 137 79 120 84 C103 79 90 70 90 56 V28 L120 16 Z"
      stroke="url(#g2)"
      strokeWidth="2.5"
      opacity="0.95"
    />
    {/* check */}
    <path
      d="M108 50 L117 59 L134 41"
      stroke="url(#g2)"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    {/* side bars */}
    <rect
      x="22"
      y="28"
      width="46"
      height="10"
      rx="5"
      fill="white"
      opacity="0.08"
    />
    <rect
      x="22"
      y="46"
      width="62"
      height="10"
      rx="5"
      fill="white"
      opacity="0.08"
    />
    <rect
      x="22"
      y="64"
      width="38"
      height="10"
      rx="5"
      fill="white"
      opacity="0.08"
    />

    <rect
      x="170"
      y="28"
      width="48"
      height="10"
      rx="5"
      fill="white"
      opacity="0.08"
    />
    <rect
      x="156"
      y="46"
      width="62"
      height="10"
      rx="5"
      fill="white"
      opacity="0.08"
    />
    <rect
      x="178"
      y="64"
      width="40"
      height="10"
      rx="5"
      fill="white"
      opacity="0.08"
    />
  </svg>
);

const SvgDiscuss = () => (
  <svg
    viewBox="0 0 240 96"
    className="w-full h-full"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="g3" x1="0" y1="0" x2="240" y2="96">
        <stop stopColor="#6366F1" stopOpacity="0.9" />
        <stop offset="0.6" stopColor="#22D3EE" stopOpacity="0.75" />
        <stop offset="1" stopColor="#A855F7" stopOpacity="0.7" />
      </linearGradient>
    </defs>

    {/* chat bubble 1 */}
    <path
      d="M34 28 C34 22 39 18 45 18 H120 C126 18 131 22 131 28 V48 C131 54 126 58 120 58 H74 L54 72 V58 H45 C39 58 34 54 34 48 V28 Z"
      stroke="url(#g3)"
      strokeWidth="2"
      opacity="0.95"
    />
    {/* chat lines */}
    <rect x="50" y="30" width="62" height="8" rx="4" fill="white" opacity="0.10" />
    <rect x="50" y="44" width="42" height="8" rx="4" fill="white" opacity="0.10" />

    {/* chat bubble 2 */}
    <path
      d="M112 40 C112 34 117 30 123 30 H194 C200 30 205 34 205 40 V60 C205 66 200 70 194 70 H162 L176 82 V70 H123 C117 70 112 66 112 60 V40 Z"
      stroke="url(#g3)"
      strokeWidth="2"
      opacity="0.95"
    />
    <rect x="128" y="44" width="56" height="8" rx="4" fill="white" opacity="0.10" />
    <rect x="128" y="58" width="34" height="8" rx="4" fill="white" opacity="0.10" />
  </svg>
);

const steps = [
  {
    title: "Join focused communities",
    desc: "Find your tribe by domain, goal, and interest — no noise.",
    Art: SvgCommunity,
  },
  {
    title: "Access verified resources",
    desc: "AI verified notes, links, and materials — clean and reliable.",
    Art: SvgVerified,
  },
  {
    title: "Discuss & grow together",
    desc: "Ask doubts, share projects, and level up with peers.",
    Art: SvgDiscuss,
  },
];

function HowItWorks() {
  return (
    <section id="how" className="bg-[#060B1A] py-20">
      <div className="max-w-7xl mx-auto px-6">
        <Reveal>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            How Campnexus works
          </h2>
          <p className="mt-3 text-slate-300 max-w-2xl">
            Simple flow — discover → verify → collaborate.
          </p>
        </Reveal>

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-5">
          {steps.map((s, idx) => {
            const Art = s.Art;

            return (
              <Reveal key={s.title} delay={idx * 0.08}>
                <div className="rounded-2xl bg-white/5 border border-white/10 shadow-xl shadow-indigo-500/10 p-6 backdrop-blur hover:translate-y-[-2px] transition-transform">
                  <div className="h-10 w-10 rounded-xl bg-indigo-600/20 border border-indigo-400/20 flex items-center justify-center text-indigo-300 font-bold">
                    {idx + 1}
                  </div>

                  <h3 className="mt-4 text-white font-bold text-lg">{s.title}</h3>
                  <p className="mt-2 text-slate-300">{s.desc}</p>

                  {/* SVG preview box */}
                  <div className="mt-5 h-100 rounded-xl bg-white/5 border border-white/10 p-3 overflow-hidden relative">
                    <div className="absolute inset-0 opacity-35 bg-[radial-gradient(#1d2a52_1px,transparent_1px)] [background-size:18px_18px]" />
                    <div className="relative h-full w-full">
                      <Art />
                    </div>

                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;

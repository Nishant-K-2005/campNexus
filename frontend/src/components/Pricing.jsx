"use client";

import React from "react";
import Link from "next/link";
import { Reveal } from "./MotionWrap";

const plans = [
  {
    name: "Free",
    price: "₹0",
    desc: "Get started with communities & basic verification.",
    items: ["Join communities", "Basic verification", "Limited resources"],
  },
  {
    name: "Pro",
    price: "₹199/mo",
    desc: "For serious learners & placement prep.",
    items: ["Unlimited resources", "Priority verification", "Advanced search", "Mentor spaces"],
    popular: true,
  },
  {
    name: "Team",
    price: "₹499/mo",
    desc: "For clubs, groups and campus teams.",
    items: ["Team workspaces", "Role management", "Project boards", "Collaboration tools"],
  },
];

function Pricing() {
  return (
    <section id="pricing" className="bg-[#060B1A] py-20">
      <div className="max-w-7xl mx-auto px-6">
        <Reveal>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Pricing
          </h2>
          <p className="mt-3 text-slate-300 max-w-2xl">
            Same theme. Simple plans. Upgrade anytime.
          </p>
        </Reveal>

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-5">
          {plans.map((p, i) => (
            <Reveal key={p.name} delay={i * 0.08}>
              <div
                className={`rounded-2xl bg-white/5 border border-white/10 shadow-xl shadow-indigo-500/10 p-7 backdrop-blur relative overflow-hidden hover:translate-y-[-2px] transition-transform ${
                  p.popular ? "ring-1 ring-indigo-500/40" : ""
                }`}
              >
                {p.popular && (
                  <div className="absolute top-5 right-5 px-3 py-1 bg-indigo-500/10 text-indigo-300 text-xs rounded-full border border-indigo-400/20">
                    MOST POPULAR
                  </div>
                )}

                <h3 className="text-white font-bold text-xl">{p.name}</h3>
                <div className="mt-2 text-3xl font-extrabold text-white">{p.price}</div>
                <p className="mt-2 text-slate-300">{p.desc}</p>

                <ul className="mt-6 space-y-3 text-slate-300">
                  {p.items.map((it) => (
                    <li key={it} className="flex gap-3">
                      <span className="h-5 w-5 rounded-full bg-emerald-500/10 border border-emerald-400/20 flex-shrink-0" />
                      {it}
                    </li>
                  ))}
                </ul>

                <Link
                  href="/auth/signup"
                  className={`mt-7 inline-flex w-full items-center justify-center px-6 py-3 rounded-xl font-medium transition-colors border ${
                    p.popular
                      ? "bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-500/30 border-indigo-400/20"
                      : "bg-white/10 text-white hover:bg-white/15 border-white/15"
                  }`}
                >
                  Get started
                </Link>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Pricing;

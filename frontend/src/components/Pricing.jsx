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
    <section id="pricing" className="py-20 transition-colors duration-300" style={{ background: "var(--cn-bg)" }}>
      <div className="max-w-7xl mx-auto px-6">
        <Reveal>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight" style={{ color: "var(--cn-text)" }}>
            Pricing
          </h2>
          <p className="mt-3 max-w-2xl text-sm" style={{ color: "var(--cn-text-3)" }}>
            Same theme. Simple plans. Upgrade anytime.
          </p>
        </Reveal>

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-5">
          {plans.map((p, i) => (
            <Reveal key={p.name} delay={i * 0.08}>
              <div
                className={`rounded-2xl p-7 relative overflow-hidden transition-all duration-200 ${
                  p.popular ? "ring-2 ring-indigo-500/40" : ""
                }`}
                style={{
                  background: "var(--cn-card)",
                  border: "1px solid var(--cn-border)",
                  boxShadow: "var(--cn-shadow)",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "var(--cn-shadow-lg)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "var(--cn-shadow)"; }}
              >
                {p.popular && (
                  <div className="absolute top-5 right-5 px-3 py-1 text-xs rounded-full border" style={{ background: "var(--cn-primary-l)", color: "var(--cn-primary)", borderColor: "rgba(99,102,241,0.2)" }}>
                    MOST POPULAR
                  </div>
                )}

                <h3 className="font-bold text-xl" style={{ color: "var(--cn-text)" }}>{p.name}</h3>
                <div className="mt-2 text-3xl font-extrabold" style={{ color: "var(--cn-text)" }}>{p.price}</div>
                <p className="mt-2 text-xs sm:text-sm" style={{ color: "var(--cn-text-3)" }}>{p.desc}</p>

                <ul className="mt-6 space-y-3 text-xs sm:text-sm" style={{ color: "var(--cn-text-2)" }}>
                  {p.items.map((it) => (
                    <li key={it} className="flex items-center gap-3">
                      <span
                        className="h-5 w-5 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{
                          background: "rgba(16,185,129,0.1)",
                          border: "1px solid rgba(16,185,129,0.25)",
                        }}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      </span>
                      {it}
                    </li>
                  ))}
                </ul>

                <Link
                  href="/auth/signup"
                  className="mt-7 inline-flex w-full items-center justify-center px-6 py-3 rounded-xl font-medium transition-colors border text-xs sm:text-sm shadow-md"
                  style={p.popular ? {
                    background: "linear-gradient(135deg, var(--cn-primary), #818CF8)",
                    color: "white",
                    borderColor: "transparent"
                  } : {
                    background: "var(--cn-surface-2)",
                    borderColor: "var(--cn-border)",
                    color: "var(--cn-text-2)"
                  }}
                  onMouseEnter={(e) => {
                    if (!p.popular) {
                      e.currentTarget.style.background = "var(--cn-border)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!p.popular) {
                      e.currentTarget.style.background = "var(--cn-surface-2)";
                    }
                  }}
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


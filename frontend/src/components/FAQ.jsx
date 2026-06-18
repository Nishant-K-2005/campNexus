"use client";

import React, { useState } from "react";
import { Reveal } from "./MotionWrap";

const faqs = [
  {
    q: "What does AI Verified mean?",
    a: "Content/resources are checked using AI rules to reduce spam and misinformation.",
  },
  {
    q: "Is CampNexus free?",
    a: "Yes. You can start with the free plan and upgrade anytime.",
  },
  {
    q: "Can I create my own community?",
    a: "Yes, Pro/Team can create and manage communities with controls.",
  },
  {
    q: "Is it for all branches?",
    a: "Yes, any field: CSE, IT, DS, ECE, Commerce, etc.",
  },
];

function FAQ() {
  const [open, setOpen] = useState(null);

  return (
    <section id="faq" className="py-20 transition-colors duration-300" style={{ background: "var(--cn-bg)" }}>
      <div className="max-w-7xl mx-auto px-6">
        <Reveal>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight" style={{ color: "var(--cn-text)" }}>
            FAQ
          </h2>
          <p className="mt-3 max-w-2xl text-sm" style={{ color: "var(--cn-text-3)" }}>
            Quick answers to common questions.
          </p>
        </Reveal>

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-5">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={f.q} delay={i * 0.06}>
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="text-left w-full rounded-2xl p-6 transition-all cursor-pointer"
                  style={{
                    background: "var(--cn-card)",
                    border: "1px solid var(--cn-border)",
                    boxShadow: "var(--cn-shadow)",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "var(--cn-surface-2)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "var(--cn-card)"; }}
                >
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="font-bold text-sm sm:text-base" style={{ color: "var(--cn-text)" }}>{f.q}</h3>
                    <span style={{ color: "var(--cn-primary)" }} className="font-bold">
                      {isOpen ? "−" : "+"}
                    </span>
                  </div>

                  <div
                    className={`grid transition-all duration-300 ease-out ${
                      isOpen ? "grid-rows-[1fr] mt-3" : "grid-rows-[0fr] mt-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="text-xs sm:text-sm leading-relaxed" style={{ color: "var(--cn-text-2)" }}>{f.a}</p>
                    </div>
                  </div>
                </button>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default FAQ;


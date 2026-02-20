"use client";

import React, { useState } from "react";
import { Reveal } from "./MotionWrap";

const faqs = [
  {
    q: "What does AI Verified mean?",
    a: "Content/resources are checked using AI rules to reduce spam and misinformation.",
  },
  {
    q: "Is Campnexus free?",
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
    <section id="faq" className="bg-[#060B1A] py-20">
      <div className="max-w-7xl mx-auto px-6">
        <Reveal>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            FAQ
          </h2>
          <p className="mt-3 text-slate-300 max-w-2xl">
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
                  className="text-left w-full rounded-2xl bg-white/5 border border-white/10 shadow-xl shadow-indigo-500/10 p-6 backdrop-blur hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="text-white font-bold">{f.q}</h3>
                    <span className="text-indigo-300 font-bold">
                      {isOpen ? "−" : "+"}
                    </span>
                  </div>

                  <div
                    className={`grid transition-all duration-300 ease-out ${
                      isOpen ? "grid-rows-[1fr] mt-3" : "grid-rows-[0fr] mt-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="text-slate-300">{f.a}</p>
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

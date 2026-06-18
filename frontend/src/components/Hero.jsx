"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

function Hero() {
  return (
    <section className="relative overflow-hidden min-h-screen flex items-center transition-colors duration-300" style={{ background: "var(--cn-bg)" }}>
      {/* Background decorative blob */}
      <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 blur-3xl opacity-30 pointer-events-none">
        <div className="aspect-square h-[650px] rounded-full bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-400" />
      </div>

      {/* Subtle background glow bottom-left */}
      <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 blur-3xl opacity-20 pointer-events-none">
        <div className="aspect-square h-[520px] rounded-full bg-gradient-to-tr from-cyan-500 to-indigo-600" />
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column */}
          <div className="flex flex-col space-y-8 text-center lg:text-left">
            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1]"
              style={{ color: "var(--cn-text)" }}
            >
              Discover your academic tribe.
              <span className="block" style={{ color: "var(--cn-primary)" }}>Verified by AI.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.12, ease: "easeOut" }}
              className="text-lg md:text-xl max-w-2xl mx-auto lg:mx-0"
              style={{ color: "var(--cn-text-3)" }}
            >
              Join focused campus communities, access verified resources, and
              engage in meaningful discussions. No noise, just learning.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.22, ease: "easeOut" }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start font-medium"
            >
              <Link
                href="/auth/login"
                className="inline-flex items-center justify-center px-8 py-3 rounded-xl text-white hover:opacity-90 transition-all shadow-lg hover:-translate-y-0.5"
                style={{
                  background: "linear-gradient(135deg, var(--cn-primary), #818CF8)",
                  boxShadow: "0 4px 20px rgba(99,102,241,0.3)"
                }}
              >
                Login
              </Link>

              <Link
                href="/auth/signup"
                className="inline-flex items-center justify-center px-8 py-3 rounded-xl border transition-all"
                style={{
                  background: "var(--cn-surface-2)",
                  borderColor: "var(--cn-border)",
                  color: "var(--cn-text-2)"
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "var(--cn-border)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "var(--cn-surface-2)"; }}
              >
                Signup
              </Link>
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="relative hidden lg:block">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.18, ease: "easeOut" }}
              className="aspect-[4/3] rounded-2xl bg-white/5 border border-white/10 shadow-xl shadow-indigo-500/10 p-8 flex items-center justify-center overflow-hidden relative backdrop-blur"
            >
              {/* Dark grid overlay */}
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#1d2a52_1px,transparent_1px)] [background-size:22px_22px] [mask-image:linear-gradient(0deg,#fff,rgba(255,255,255,0.6))]" />

              {/* Floating + hover tilt card */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
                whileHover={{ rotate: 0, scale: 1.02 }}
                initial={{ rotate: 3 }}
                className="relative shadow-2xl rounded-xl p-6 w-3/4 h-3/4 backdrop-blur"
                style={{
                  background: "var(--cn-card)",
                  border: "1px solid var(--cn-border)",
                }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <span style={{ color: "var(--cn-primary)" }} className="font-semibold">⌘</span>
                  <h3 className="font-bold" style={{ color: "var(--cn-text)" }}>Data Science Club</h3>
                </div>

                <div className="space-y-3">
                  <div className="h-4 rounded w-full animate-pulse" style={{ background: "var(--cn-surface-2)" }} />
                  <div className="h-4 rounded w-5/6 animate-pulse" style={{ background: "var(--cn-surface-2)" }} />
                  <div className="h-4 rounded w-4/6 animate-pulse" style={{ background: "var(--cn-surface-2)" }} />
                </div>

                <div className="mt-6 flex gap-2">
                  <span className="px-3 py-1 text-xs rounded-full border" style={{ background: "var(--cn-primary-l)", color: "var(--cn-primary)", borderColor: "rgba(99,102,241,0.2)" }}>
                    #MachineLearning
                  </span>
                  <span className="px-3 py-1 text-xs rounded-full border animate-pulse" style={{ background: "rgba(16,185,129,0.1)", color: "var(--cn-success)", borderColor: "rgba(16,185,129,0.2)" }}>
                    AI Verified
                  </span>
                </div>
              </motion.div>
            </motion.div>
          </div>
          {/* end */}
        </div>
      </div>
    </section>
  );
}

export default Hero;


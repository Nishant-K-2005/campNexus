"use client";

import React from "react";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";

function Navbar() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md transition-colors duration-300" style={{ background: "var(--cn-surface)", opacity: 0.9, borderBottom: "1px solid var(--cn-border)" }}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-xl flex items-center justify-center" style={{ background: "var(--cn-primary-l)", border: "1px solid rgba(99,102,241,0.2)" }}>
            <span className="font-black" style={{ color: "var(--cn-primary)" }}>C</span>
          </div>
          <div className="leading-tight">
            <div className="font-semibold text-sm sm:text-base" style={{ color: "var(--cn-text)" }}>CampNexus</div>
            <div className="text-[10px] sm:text-xs" style={{ color: "var(--cn-text-4)" }}>AI Verified Communities</div>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          {["templates", "how", "features", "pricing", "faq"].map((id) => (
            <a
              key={id}
              href={`#${id}`}
              className="transition-colors capitalize hover:opacity-100"
              style={{ color: "var(--cn-text-3)" }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "var(--cn-text)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "var(--cn-text-3)"; }}
            >
              {id === "how" ? "How it works" : id}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle size="sm" />
          <Link
            href="/auth/login"
            className="hidden sm:inline-flex items-center justify-center px-4 py-2 rounded-xl text-xs font-semibold border transition-all"
            style={{
              background: "var(--cn-surface-2)",
              borderColor: "var(--cn-border)",
              color: "var(--cn-text-2)"
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "var(--cn-border)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "var(--cn-surface-2)"; }}
          >
            Login
          </Link>
          <Link
            href="/auth/signup"
            className="inline-flex items-center justify-center px-4 py-2 rounded-xl text-xs font-semibold text-white transition-all shadow-lg hover:-translate-y-0.5"
            style={{
              background: "linear-gradient(135deg, var(--cn-primary), #818CF8)",
              boxShadow: "0 4px 14px rgba(99,102,241,0.3)"
            }}
          >
            Signup
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Navbar;


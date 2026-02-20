import React from "react";
import Link from "next/link";

function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-[#060B1A]/70 backdrop-blur border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center">
            <span className="text-indigo-400 font-black">C</span>
          </div>
          <div className="leading-tight">
            <div className="text-white font-semibold">Campnexus</div>
            <div className="text-xs text-slate-400">AI Verified Communities</div>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm text-slate-300">
          <a href="#templates" className="hover:text-white transition">Templates</a>
          <a href="#how" className="hover:text-white transition">How it works</a>
          <a href="#features" className="hover:text-white transition">Features</a>
          <a href="#pricing" className="hover:text-white transition">Pricing</a>
          <a href="#faq" className="hover:text-white transition">FAQ</a>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/auth/login"
            className="hidden sm:inline-flex items-center justify-center px-5 py-2 rounded-xl bg-white/10 text-white hover:bg-white/15 transition-colors border border-white/15 backdrop-blur"
          >
            Login
          </Link>
          <Link
            href="/auth/signup"
            className="inline-flex items-center justify-center px-5 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-500/30 border border-indigo-400/20"
          >
            Signup
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Navbar;

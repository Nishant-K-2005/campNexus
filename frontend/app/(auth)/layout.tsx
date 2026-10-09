'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, GraduationCap } from 'lucide-react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background-dark flex flex-col lg:flex-row text-white">
      {/* Left Form Panel */}
      <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-20 py-12 lg:max-w-2xl bg-black/25 relative z-10">
        <div className="absolute top-8 left-8">
          <Link href="/" className="flex items-center space-x-2 text-indigo-300 hover:text-white transition">
            <GraduationCap className="w-6 h-6 text-accent-indigo" />
            <span className="font-extrabold tracking-wider text-sm bg-gradient-to-r from-accent-indigo via-accent-violet to-accent-fuchsia bg-clip-text text-transparent">
              CAMPNEXUS
            </span>
          </Link>
        </div>
        <div className="w-full max-w-md mx-auto space-y-8">
          {children}
        </div>
      </div>

      {/* Right Visual Panel */}
      <div className="hidden lg:flex flex-1 flex-col justify-center items-center relative overflow-hidden bg-gradient-to-br from-indigo-950 via-slate-950 to-purple-950 px-12 border-l border-white/5">
        {/* Glow Spheres */}
        <div className="absolute top-1/3 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent-indigo/10 rounded-full blur-[120px] animate-pulse [animation-duration:6s]" />
        <div className="absolute bottom-1/3 right-1/3 translate-x-1/2 translate-y-1/2 w-[400px] h-[400px] bg-accent-violet/10 rounded-full blur-[100px] animate-pulse [animation-duration:4s]" />

        <div className="max-w-md text-center space-y-6 relative z-10">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring' as const, duration: 1 }}
            className="inline-flex p-4 rounded-3xl bg-white/5 border border-white/10 shadow-[0_0_20px_rgba(99,102,241,0.2)] mb-4"
          >
            <Sparkles className="w-12 h-12 text-indigo-300" />
          </motion.div>

          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-extrabold tracking-tight"
          >
            Connect, Share, and <span className="gradient-text">Grow Together.</span>
          </motion.h2>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-indigo-200/60 text-base leading-relaxed"
          >
            Access exclusive student forums, study groups, course resource indexes, and verified academic material under secure AI moderation.
          </motion.p>
        </div>
      </div>
    </div>
  );
}

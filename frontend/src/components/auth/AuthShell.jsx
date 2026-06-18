"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  GraduationCap,
  MessageSquare,
  Users,
  Bell,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

const floatingCards = [
  {
    id: 1,
    icon: MessageSquare,
    title: "New discussion",
    subtitle: "AI Research Club · 2m ago",
    x: "8%",
    y: "18%",
    delay: 0.2,
    rotate: -6,
  },
  {
    id: 2,
    icon: Users,
    title: "128 members joined",
    subtitle: "Robotics Society",
    x: "52%",
    y: "12%",
    delay: 0.35,
    rotate: 4,
  },
  {
    id: 3,
    icon: Bell,
    title: "Post approved ✓",
    subtitle: "AI moderation · just now",
    x: "18%",
    y: "58%",
    delay: 0.5,
    rotate: 3,
  },
  {
    id: 4,
    icon: TrendingUp,
    title: "+24 reputation",
    subtitle: "Helpful contributor",
    x: "55%",
    y: "62%",
    delay: 0.65,
    rotate: -4,
  },
];

function AnimatedShowcase() {
  const reduced = useReducedMotion();

  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* Gradient orbs */}
      <motion.div
        animate={reduced ? {} : { scale: [1, 1.08, 1], opacity: [0.35, 0.5, 0.35] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -left-20 -top-20 h-72 w-72 rounded-full"
        style={{ background: "radial-gradient(circle, #6366F1 0%, transparent 70%)", filter: "blur(50px)" }}
      />
      <motion.div
        animate={reduced ? {} : { scale: [1, 1.12, 1], opacity: [0.2, 0.35, 0.2] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute -bottom-24 -right-16 h-80 w-80 rounded-full"
        style={{ background: "radial-gradient(circle, #22D3EE 0%, transparent 70%)", filter: "blur(60px)" }}
      />
      <motion.div
        animate={reduced ? {} : { y: [0, -12, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-1/3 top-1/3 h-48 w-48 rounded-full"
        style={{ background: "radial-gradient(circle, #A78BFA 0%, transparent 70%)", filter: "blur(40px)", opacity: 0.25 }}
      />

      {/* Grid */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* Floating UI cards — Boardme-style */}
      {floatingCards.map((card) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{
              opacity: 1,
              y: reduced ? 0 : [0, -8, 0],
              scale: 1,
            }}
            transition={{
              opacity: { delay: card.delay, duration: 0.6 },
              y: reduced ? { duration: 0 } : { delay: card.delay + 0.6, duration: 4 + card.id, repeat: Infinity, ease: "easeInOut" },
              scale: { delay: card.delay, duration: 0.6, type: "spring", stiffness: 120 },
            }}
            className="absolute w-52 rounded-2xl p-4 backdrop-blur-md"
            style={{
              left: card.x,
              top: card.y,
              transform: `rotate(${card.rotate}deg)`,
              background: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(255,255,255,0.12)",
              boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
            }}
          >
            <div className="mb-2 flex items-center gap-2">
              <div
                className="flex h-8 w-8 items-center justify-center rounded-lg"
                style={{ background: "rgba(99,102,241,0.25)" }}
              >
                <Icon className="h-4 w-4 text-indigo-300" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-xs font-semibold text-white">{card.title}</p>
                <p className="truncate text-[10px] text-slate-400">{card.subtitle}</p>
              </div>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "72%" }}
                transition={{ delay: card.delay + 0.8, duration: 1.2, ease: "easeOut" }}
                className="h-full rounded-full"
                style={{ background: "linear-gradient(90deg, #6366F1, #22D3EE)" }}
              />
            </div>
          </motion.div>
        );
      })}

      {/* Center hero copy */}
      <div className="relative z-10 flex h-full flex-col justify-end p-12 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.7 }}
        >
          <div className="mb-4 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-indigo-300" />
            <span className="text-xs font-semibold uppercase tracking-widest text-indigo-300">
              AI-Powered Campus
            </span>
          </div>
          <h1 className="text-4xl font-bold leading-tight text-white xl:text-5xl">
            Collaborate.
            <br />
            <span
              style={{
                background: "linear-gradient(135deg, #818CF8 0%, #22D3EE 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Connect. Create.
            </span>
          </h1>
          <p className="mt-4 max-w-sm text-base text-slate-400">
            Your university hub for communities, discussions, resources, and real-time AI moderation.
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export default function AuthShell({ children, mode = "login" }) {
  return (
    <div
      className="flex min-h-screen"
      style={{ background: "var(--cn-bg)", color: "var(--cn-text)" }}
    >
      {/* Left animated panel */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative hidden overflow-hidden lg:flex lg:w-[55%] xl:w-[58%]"
        style={{
          background: "linear-gradient(145deg, #0F172A 0%, #1E1B4B 45%, #0F172A 100%)",
        }}
      >
        <div className="absolute left-10 top-8 z-20 flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl"
            style={{ background: "linear-gradient(135deg, #6366F1, #818CF8)" }}
          >
            <GraduationCap className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight text-white">CampNexus</span>
        </div>
        <AnimatedShowcase />
      </motion.div>

      {/* Right form panel */}
      <div className="flex w-full flex-col lg:w-[45%] xl:w-[42%]">
        <div className="flex items-center justify-between p-6">
          <Link href="/" className="flex items-center gap-2 lg:hidden">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-lg"
              style={{ background: "linear-gradient(135deg, #6366F1, #818CF8)" }}
            >
              <GraduationCap className="h-4 w-4 text-white" />
            </div>
            <span className="text-base font-bold" style={{ color: "var(--cn-text)" }}>
              CampNexus
            </span>
          </Link>
          <div className="ml-auto flex items-center gap-3">
            <ThemeToggle size="sm" />
          </div>
        </div>

        <div className="flex flex-1 items-center justify-center px-6 pb-12">
          <motion.div
            key={mode}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-[420px]"
          >
            {children}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { Separator } from "@/components/ui/separator";
import { Reveal } from "./MotionWrap";
import { motion } from "framer-motion";

export default function Footer() {
  const links = [
    { label: "Product", href: "#product" },
    { label: "Features", href: "#features" },
    { label: "Templates", href: "#templates" },
    { label: "Pricing", href: "#pricing" },
    { label: "FAQ", href: "#faq" },
  ];

  return (
    <footer className="relative bg-[#060B1A] overflow-hidden">
      
      {/* Background glow blob */}
      <div className="absolute -bottom-40 right-0 translate-x-1/3 blur-3xl opacity-20 pointer-events-none">
        <div className="aspect-square h-[420px] rounded-full bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-400" />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-6 pt-12 pb-16">
        
        <Reveal>
          <Separator className="bg-white/10" />
        </Reveal>

        <div className="mt-10 flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">

          {/* Brand */}
          <Reveal>
            <div>
              <div className="font-semibold text-white text-lg">
                Campnexus
              </div>
              <div className="text-sm text-slate-400 mt-1">
                Discover your academic tribe. Verified by AI.
              </div>
            </div>
          </Reveal>

          {/* Links with stagger animation */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={{
              hidden: {},
              show: {
                transition: { staggerChildren: 0.08 },
              },
            }}
            className="flex flex-wrap gap-6 text-sm text-slate-300"
          >
            {links.map((link) => (
              <motion.a
                key={link.label}
                href={link.href}
                variants={{
                  hidden: { opacity: 0, y: 10 },
                  show: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.4 }}
                className="hover:text-white transition-colors"
              >
                {link.label}
              </motion.a>
            ))}
          </motion.div>

          {/* Copyright */}
          <Reveal delay={0.2}>
            <div className="text-sm text-slate-500">
              © {new Date().getFullYear()} Campnexus. All rights reserved.
            </div>
          </Reveal>

        </div>
      </div>
    </footer>
  );
}

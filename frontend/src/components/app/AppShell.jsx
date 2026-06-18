"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import RightPanel from "@/components/layout/RightPanel";

export default function AppShell({ children }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [rightOpen, setRightOpen] = useState(true);

  const activeTab =
    pathname.split("/").filter(Boolean)[0] || "dashboard";

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "var(--cn-bg)" }}>
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 z-40 lg:hidden"
            style={{ background: "rgba(0,0,0,0.5)" }}
          />
        )}
      </AnimatePresence>

      <div className="hidden lg:flex h-full">
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ x: -260 }}
            animate={{ x: 0 }}
            exit={{ x: -260 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed left-0 top-0 h-full z-50 lg:hidden"
            style={{ width: 240 }}
          >
            <Sidebar collapsed={false} setCollapsed={() => {}} onNavigate={() => setMobileOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        <Navbar
          activeTab={activeTab}
          onMobileMenu={() => setMobileOpen(!mobileOpen)}
          onToggleRight={() => setRightOpen(!rightOpen)}
          rightOpen={rightOpen}
        />

        <div className="flex flex-1 overflow-hidden">
          <main className="flex-1 overflow-y-auto" style={{ background: "var(--cn-bg)" }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={pathname}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="min-h-full"
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </main>

          <AnimatePresence>
            {rightOpen && (
              <motion.aside
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 300, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="hidden xl:block overflow-hidden flex-shrink-0"
                style={{ borderLeft: "1px solid var(--cn-border)" }}
              >
                <RightPanel />
              </motion.aside>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

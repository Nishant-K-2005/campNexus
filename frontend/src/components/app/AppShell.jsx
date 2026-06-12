"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import DashboardView from "./Dashboard";
import CommunitiesView from "./Communities";
import DeclarationsView from "./Declarations";
import DiscussionsView from "./Discussions";
import ResourcesView from "./Resources";
import SettingsView from "./SettingsView";

const views = {
  dashboard: DashboardView,
  communities: CommunitiesView,
  declarations: DeclarationsView,
  discussions: DiscussionsView,
  resources: ResourcesView,
  settings: SettingsView,
};

export default function AppShell() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const ActiveView = views[activeTab] || DashboardView;

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ background: "var(--cn-bg)" }}
    >
      {/* Mobile overlay */}
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

      {/* Sidebar – desktop */}
      <div className="hidden lg:flex h-full">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
        />
      </div>

      {/* Sidebar – mobile drawer */}
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
            <Sidebar
              activeTab={activeTab}
              setActiveTab={(tab) => { setActiveTab(tab); setMobileOpen(false); }}
              collapsed={false}
              setCollapsed={() => {}}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar activeTab={activeTab} onMobileMenu={() => setMobileOpen(!mobileOpen)} />

        <main
          className="flex-1 overflow-y-auto"
          style={{ background: "var(--cn-bg)" }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="h-full"
            >
              <ActiveView />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

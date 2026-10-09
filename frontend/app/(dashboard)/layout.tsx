'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import {
  LayoutDashboard,
  Users,
  User as UserIcon,
  Bell,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  GraduationCap,
  ShieldAlert,
  X,
} from 'lucide-react';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { connectSocket, disconnectSocket } from '@/lib/socket';
import { authApi } from '@/lib/api/auth';
import AuthGuard from '@/components/AuthGuard';
import NotificationPanel from '@/components/NotificationPanel';
import { NotificationItem } from '@/types';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const {
    user,
    clearAuth,
    notifications,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useAuthStore();

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [aiRejectionModal, setAiRejectionModal] = useState<{
    isOpen: boolean;
    message: string;
  }>({
    isOpen: false,
    message: '',
  });

  // Socket Connection for Real-Time Moderation
  useEffect(() => {
    if (user && user.user_id) {
      const socket = connectSocket(user.user_id);

      socket.on('moderation-data', (data: any) => {
        console.log('Moderation socket payload:', data);
        
        // Push notification item
        const newNotif: NotificationItem = {
          id: Math.random().toString(36).substr(2, 9),
          postId: data.postId,
          status: data.status,
          message: data.message,
          timestamp: new Date().toISOString(),
          isRead: false,
        };

        addNotification(newNotif);

        // Triggers react-hot-toast alert message
        if (data.status === 'Accepted') {
          toast.success(data.message, {
            icon: '✨',
            duration: 5000,
          });
        } else {
          toast.error(data.message, {
            icon: '⚠️',
            duration: 6000,
          });
          setAiRejectionModal({
            isOpen: true,
            message: data.message,
          });
        }

        // Invalidate queries so that dashboard/community posts update instantly
        queryClient.invalidateQueries({ queryKey: ['discussions'] });
        queryClient.invalidateQueries({ queryKey: ['resources'] });
        queryClient.invalidateQueries({ queryKey: ['communities'] });
        queryClient.invalidateQueries({ queryKey: ['session'] });
        queryClient.invalidateQueries({ queryKey: ['dashboard-feed'] });
      });

      return () => {
        disconnectSocket();
      };
    }
  }, [user, queryClient, addNotification]);

  const handleLogout = async () => {
    try {
      await authApi.logout();
      clearAuth();
      toast.success('Logged out successfully');
      router.push('/login');
    } catch (error) {
      toast.error('Error logging out');
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const sidebarLinks = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Communities', href: '/communities', icon: Users },
    { name: 'My Profile', href: '/profile', icon: UserIcon },
    { name: 'Notifications', href: '/notifications', icon: Bell },
  ];

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background-dark text-white flex flex-row overflow-hidden">
        
        {/* Desktop Sidebar */}
        <motion.aside
          animate={{ width: isSidebarCollapsed ? 80 : 260 }}
          className="hidden md:flex flex-col border-r border-white/5 bg-[rgba(8,14,28,0.45)] backdrop-blur-xl h-screen sticky top-0 relative z-30 transition-all"
        >
          {/* Logo Section */}
          <div className="h-16 flex items-center justify-between px-5 border-b border-white/5">
            <Link href="/dashboard" className="flex items-center space-x-2.5 overflow-hidden">
              <GraduationCap className="w-8 h-8 text-accent-indigo flex-shrink-0" />
              {!isSidebarCollapsed && (
                <span className="font-extrabold tracking-wider bg-gradient-to-r from-indigo-200 via-indigo-400 to-violet-300 bg-clip-text text-transparent text-sm">
                  CAMPNEXUS
                </span>
              )}
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 py-6 px-3 space-y-1.5 overflow-y-auto">
            {sidebarLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`flex items-center space-x-3.5 px-4 py-3.5 rounded-xl text-sm font-semibold transition duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-accent-indigo/25 to-accent-violet/10 text-white border border-accent-indigo/35 shadow-[0_0_15px_rgba(99,102,241,0.05)]'
                      : 'text-indigo-200/50 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-accent-indigo' : 'text-indigo-200/50'}`} />
                  {!isSidebarCollapsed && <span>{link.name}</span>}
                </Link>
              );
            })}
          </nav>

          {/* Collapse sidebar controls */}
          <div className="p-3 border-t border-white/5 space-y-1">
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="w-full flex items-center justify-center p-2.5 rounded-xl hover:bg-white/5 text-indigo-300/40 hover:text-white transition"
            >
              {isSidebarCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
            </button>
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3.5 px-4 py-3 rounded-xl hover:bg-red-500/10 text-red-400 hover:text-red-300 font-semibold transition"
            >
              <LogOut className="w-5 h-5 flex-shrink-0" />
              {!isSidebarCollapsed && <span className="text-sm">Sign Out</span>}
            </button>
          </div>
        </motion.aside>

        {/* Mobile Navbar Bottom / Drawer */}
        <AnimatePresence>
          {isMobileOpen && (
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween' as const }}
              className="fixed inset-0 bg-slate-950/95 z-50 flex flex-col md:hidden p-6"
            >
              <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
                <div className="flex items-center space-x-2">
                  <GraduationCap className="w-7 h-7 text-accent-indigo" />
                  <span className="font-extrabold tracking-wider text-sm bg-gradient-to-r from-accent-indigo to-accent-violet bg-clip-text text-transparent">CAMPNEXUS</span>
                </div>
                <button onClick={() => setIsMobileOpen(false)} className="text-white hover:text-indigo-300">
                  <ChevronLeft className="w-6 h-6" />
                </button>
              </div>
              <nav className="flex-1 space-y-2">
                {sidebarLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={() => setIsMobileOpen(false)}
                      className={`flex items-center space-x-4 px-4 py-4 rounded-2xl text-base font-semibold ${
                        isActive
                          ? 'bg-accent-indigo/25 text-white border border-accent-indigo/25'
                          : 'text-indigo-200/50 hover:bg-white/5'
                      }`}
                    >
                      <Icon className="w-6 h-6" />
                      <span>{link.name}</span>
                    </Link>
                  );
                })}
              </nav>
              <div className="border-t border-white/5 pt-4">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-4 px-4 py-4 rounded-2xl text-red-400 hover:bg-red-500/10 font-semibold"
                >
                  <LogOut className="w-6 h-6" />
                  <span>Sign Out</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content Panel Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
          {/* Top Header */}
          <header className="h-16 border-b border-white/5 bg-[rgba(3,7,18,0.4)] backdrop-blur-md px-5 flex items-center justify-between z-20">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsMobileOpen(true)}
                className="md:hidden p-2 rounded-xl hover:bg-white/5 text-indigo-300"
              >
                <Menu className="w-6 h-6" />
              </button>
              <h2 className="font-extrabold text-lg tracking-wide hidden sm:block">
                {pathname.includes('/communities')
                  ? 'Communities Hub'
                  : pathname.includes('/profile')
                  ? 'My Reputation & Profile'
                  : pathname.includes('/notifications')
                  ? 'Notifications'
                  : 'Dashboard Activity'}
              </h2>
            </div>

            {/* Topbar Actions */}
            <div className="flex items-center space-x-4">
              {/* Notification Bell */}
              <button
                onClick={() => setIsNotificationsOpen(true)}
                className="p-2.5 rounded-xl hover:bg-white/5 border border-white/5 bg-white/[0.02] text-indigo-200/80 hover:text-white relative transition group"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-accent-indigo text-[10px] font-bold flex items-center justify-center text-white ring-2 ring-slate-950 animate-bounce">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* User Avatar Card info */}
              {user && (
                <Link
                  href="/profile"
                  className="flex items-center space-x-2.5 p-1 px-2.5 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/5 transition"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-accent-indigo to-accent-violet flex items-center justify-center font-bold text-sm text-white border border-white/10">
                    {user.full_name.charAt(0).toUpperCase()}
                  </div>
                  <div className="hidden lg:block text-left">
                    <div className="text-xs font-bold text-white line-clamp-1">{user.full_name}</div>
                    <div className="text-[10px] text-indigo-300/40 font-semibold">{user.role}</div>
                  </div>
                </Link>
              )}
            </div>
          </header>

          {/* Core Route Display */}
          <main className="flex-grow overflow-y-auto p-4 sm:p-6 lg:p-8 relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={pathname}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
                className="max-w-7xl mx-auto h-full"
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>

        {/* Right drawer notifications */}
        <NotificationPanel
          isOpen={isNotificationsOpen}
          onClose={() => setIsNotificationsOpen(false)}
          notifications={notifications}
          onMarkAsRead={markAsRead}
          onMarkAllAsRead={markAllAsRead}
          onDelete={deleteNotification}
        />

        {/* AI Rejection Modal Popup */}
        <AnimatePresence>
          {aiRejectionModal.isOpen && (
            <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-md bg-slate-900 border border-red-500/20 rounded-3xl p-6 relative overflow-hidden shadow-2xl"
              >
                {/* Top border red glow */}
                <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-red-500" />
                
                {/* Close Button */}
                <button
                  onClick={() => setAiRejectionModal({ isOpen: false, message: '' })}
                  className="absolute top-4 right-4 p-1.5 rounded-lg text-indigo-300/40 hover:text-white hover:bg-white/5 transition"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="text-center space-y-4">
                  {/* Danger icon circle */}
                  <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-400 border border-red-500/10 flex items-center justify-center mx-auto animate-bounce">
                    <ShieldAlert className="w-6 h-6" />
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-white">Post Blocked by AI Gatekeeper</h3>
                    <p className="text-xs text-indigo-200/50 leading-relaxed">
                      Your submission has failed academic integrity verification and was removed from the system.
                    </p>
                  </div>

                  {/* Specific Reason Box */}
                  <div className="text-xs font-semibold text-red-400 bg-red-500/5 border border-red-500/10 p-4 rounded-2xl leading-relaxed text-left">
                    <span className="text-[10px] text-red-400/50 uppercase tracking-wider block mb-1 font-bold">
                      Reason for Rejection:
                    </span>
                    {aiRejectionModal.message}
                  </div>

                  <button
                    onClick={() => setAiRejectionModal({ isOpen: false, message: '' })}
                    className="w-full py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-sm transition shadow-[0_4px_15px_rgba(239,68,68,0.2)]"
                  >
                    I Understand
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </AuthGuard>
  );
}

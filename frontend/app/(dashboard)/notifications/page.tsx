'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  CheckCircle,
  AlertTriangle,
  Clock,
  Sparkles,
  Check,
  Trash2,
  Inbox,
} from 'lucide-react';
import { useAuthStore } from '@/lib/store/useAuthStore';
import Link from 'next/link';

export default function NotificationsPage() {
  const {
    notifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useAuthStore();

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header with actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold text-white">Notifications</h1>
          <p className="text-sm text-indigo-200/50">
            Real-time AI moderation updates and community activity notifications.
          </p>
        </div>
        
        {notifications.length > 0 && (
          <div className="flex items-center space-x-3">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 font-bold text-xs text-white transition"
              >
                <Check className="w-4 h-4 text-accent-indigo" />
                <span>Mark all read</span>
              </button>
            )}
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Left/Main Column: Notifications List */}
        <div className="lg:col-span-8 space-y-4">
          <AnimatePresence mode="popLayout">
            {notifications.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="glass-card p-16 rounded-3xl border border-white/5 text-center space-y-6"
              >
                <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
                  <div className="absolute inset-0 bg-accent-indigo/5 rounded-full blur-xl animate-pulse" />
                  <div className="relative w-full h-full rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-indigo-300/30">
                    <Inbox className="w-8 h-8" />
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-white">All Clear!</h3>
                  <p className="text-sm text-indigo-200/40 max-w-sm mx-auto leading-relaxed">
                    Your notification history will appear here as you post discussions and share resources in your communities.
                  </p>
                </div>
              </motion.div>
            ) : (
              <div className="space-y-3">
                {notifications.map((notif) => (
                  <motion.div
                    key={notif.id}
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className={`p-5 rounded-2xl border transition duration-200 flex items-start justify-between gap-4 relative group ${
                      notif.isRead
                        ? 'border-white/5 bg-white/[0.01] hover:bg-white/[0.02]'
                        : 'border-accent-indigo/25 bg-accent-indigo/[0.02] hover:bg-accent-indigo/[0.04]'
                    }`}
                  >
                    <div className="flex items-start space-x-4">
                      {/* Icon */}
                      <div className="mt-0.5 flex-shrink-0">
                        {notif.status === 'Accepted' ? (
                          <div className="p-2 rounded-xl bg-green-500/10 text-green-400 border border-green-500/10 shadow-[0_0_10px_rgba(34,197,94,0.1)]">
                            <CheckCircle className="w-4 h-4" />
                          </div>
                        ) : notif.status === 'Rejected' ? (
                          <div className="p-2 rounded-xl bg-red-500/10 text-red-400 border border-red-500/10 shadow-[0_0_10px_rgba(239,68,68,0.1)]">
                            <AlertTriangle className="w-4 h-4" />
                          </div>
                        ) : (
                          <div className="p-2 rounded-xl bg-yellow-500/10 text-yellow-400 border border-yellow-500/10 animate-pulse">
                            <Clock className="w-4 h-4" />
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="space-y-1.5">
                        <p className={`text-sm leading-relaxed ${notif.isRead ? 'text-indigo-200/60' : 'text-white font-medium'}`}>
                          {notif.message}
                        </p>
                        
                        <div className="flex items-center space-x-3 text-[10px] text-indigo-300/30">
                          <span>
                            {new Date(notif.timestamp).toLocaleString(undefined, {
                              dateStyle: 'short',
                              timeStyle: 'short',
                            })}
                          </span>
                          <span>•</span>
                          <Link
                            href={`/communities/any/discussions/${notif.postId}`}
                            className="text-accent-indigo hover:underline font-bold"
                          >
                            View Post thread
                          </Link>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2">
                      {!notif.isRead && (
                        <button
                          onClick={() => markAsRead(notif.id)}
                          className="p-2 rounded-xl bg-white/5 hover:bg-accent-indigo hover:text-white text-indigo-300 transition"
                          title="Mark as read"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotification(notif.id)}
                        className="p-2 rounded-xl bg-white/5 hover:bg-red-500/20 hover:text-red-400 text-indigo-300 transition"
                        title="Delete notification"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Column: Guidelines Card */}
        <div className="lg:col-span-4 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6 rounded-2xl border border-accent-indigo/20 bg-accent-indigo/5 space-y-5"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-accent-indigo/10 text-accent-indigo">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-base">AI Gatekeeper Guide</h3>
            </div>
            
            <div className="space-y-4 text-xs leading-relaxed text-indigo-200/60">
              <div className="space-y-1">
                <div className="font-bold text-white flex items-center space-x-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
                  <span>1. Queue Processing</span>
                </div>
                <p className="pl-3">
                  Every post or PDF resource uploaded is instantly analyzed in the background by the FastAPI service.
                </p>
              </div>

              <div className="space-y-1">
                <div className="font-bold text-white flex items-center space-x-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                  <span>2. Semantic Matching</span>
                </div>
                <p className="pl-3">
                  If the content matches the community topics with a score of 0.55 or higher, the post is automatically approved.
                </p>
              </div>

              <div className="space-y-1">
                <div className="font-bold text-white flex items-center space-x-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                  <span>3. Auto Moderation</span>
                </div>
                <p className="pl-3">
                  Off-topic posts are automatically hidden and marked as Rejected. You will be notified instantly if this happens.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Quick Stats card */}
          <div className="glass-card p-6 rounded-2xl border border-white/5 space-y-4">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider text-indigo-200/50">
              Notification Status
            </h4>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-3 bg-white/5 border border-white/5 rounded-xl">
                <div className="text-xl font-black text-white">{notifications.length}</div>
                <div className="text-[10px] text-indigo-300/30 uppercase font-bold">Total Logs</div>
              </div>
              <div className="p-3 bg-accent-indigo/10 border border-accent-indigo/10 rounded-xl">
                <div className="text-xl font-black text-accent-indigo">{unreadCount}</div>
                <div className="text-[10px] text-indigo-200/40 uppercase font-bold">Unread</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

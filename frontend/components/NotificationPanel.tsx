'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertTriangle, Clock, Trash2, Check } from 'lucide-react';
import { SocketModerationData, NotificationItem } from '../types';

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onDelete: (id: string) => void;
}

export default function NotificationPanel({
  isOpen,
  onClose,
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onDelete,
}: NotificationPanelProps) {
  const panelVariants = {
    closed: { x: '100%', transition: { type: 'spring' as const, stiffness: 300, damping: 30 } },
    open: { x: 0, transition: { type: 'spring' as const, stiffness: 300, damping: 30 } },
  };

  const overlayVariants = {
    closed: { opacity: 0 },
    open: { opacity: 0.5 },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Overlay */}
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={overlayVariants}
            onClick={onClose}
            className="fixed inset-0 bg-black z-40"
          />

          {/* Sliding Panel */}
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={panelVariants}
            className="fixed top-0 right-0 bottom-0 w-full sm:w-96 glass-panel z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="p-5 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-lg font-bold text-white">Notifications</span>
                {notifications.some((n) => !n.isRead) && (
                  <span className="w-2.5 h-2.5 rounded-full bg-accent-indigo" />
                )}
              </div>
              <div className="flex items-center space-x-2">
                {notifications.length > 0 && notifications.some((n) => !n.isRead) && (
                  <button
                    onClick={onMarkAllAsRead}
                    className="p-1.5 rounded-lg text-indigo-300 hover:text-white hover:bg-white/5 transition"
                    title="Mark all as read"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg text-indigo-300/60 hover:text-white hover:bg-white/5 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {notifications.length === 0 ? (
                <div className="h-64 flex flex-col items-center justify-center text-center space-y-3 p-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-indigo-300/40">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div className="text-sm font-semibold text-white/80">All caught up!</div>
                  <div className="text-xs text-indigo-200/40">No new notifications from communities or AI moderation logs.</div>
                </div>
              ) : (
                notifications.map((notif) => (
                  <motion.div
                    key={notif.id}
                    layout
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className={`p-4 rounded-2xl border transition duration-200 flex items-start space-x-3.5 relative group ${
                      notif.isRead
                        ? 'border-white/5 bg-white/[0.01] hover:bg-white/[0.03]'
                        : 'border-accent-indigo/20 bg-accent-indigo/[0.03] hover:bg-accent-indigo/[0.05]'
                    }`}
                  >
                    {/* Status icon */}
                    <div className="mt-0.5">
                      {notif.status === 'Accepted' ? (
                        <div className="p-1 rounded-lg bg-green-500/10 text-green-400">
                          <CheckCircle className="w-4 h-4" />
                        </div>
                      ) : notif.status === 'Rejected' ? (
                        <div className="p-1 rounded-lg bg-red-500/10 text-red-400">
                          <AlertTriangle className="w-4 h-4" />
                        </div>
                      ) : (
                        <div className="p-1 rounded-lg bg-yellow-500/10 text-yellow-400 animate-pulse">
                          <Clock className="w-4 h-4" />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 pr-6">
                      <p className={`text-xs leading-relaxed ${notif.isRead ? 'text-indigo-200/50' : 'text-indigo-100'}`}>
                        {notif.message}
                      </p>
                      <span className="text-[10px] text-indigo-300/30 block mt-2 font-medium">
                        {new Date(notif.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>

                    {/* Actions overlay */}
                    <div className="absolute right-3 top-3 flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {!notif.isRead && (
                        <button
                          onClick={() => onMarkAsRead(notif.id)}
                          className="p-1 rounded bg-white/5 hover:bg-white/10 text-indigo-300 hover:text-white transition"
                          title="Mark as read"
                        >
                          <Check className="w-3 h-3" />
                        </button>
                      )}
                      <button
                        onClick={() => onDelete(notif.id)}
                        className="p-1 rounded bg-white/5 hover:bg-white/10 text-indigo-300 hover:text-red-400 transition"
                        title="Delete"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

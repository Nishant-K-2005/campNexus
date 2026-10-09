'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import {
  ShieldAlert,
  Trash2,
  Search,
  Loader2,
  Compass,
  Users,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';
import { communitiesApi } from '@/lib/api/communities';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { Community } from '@/types';
import Link from 'next/link';

export default function SecretAdminPortal() {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');

  // 1. Guard check: only allow 'Admin' role users to see this page.
  // Otherwise, render a completely generic 404 page so normal users cannot detect it.
  const isAdmin = user?.role === 'Admin';

  // Fetch all communities
  const { data: communities = [], isLoading } = useQuery<Community[]>({
    queryKey: ['communities'],
    queryFn: communitiesApi.getCommunities,
    enabled: isAdmin,
  });

  // Delete Community Mutation
  const deleteCommunityMutation = useMutation({
    mutationFn: communitiesApi.deleteCommunity,
    onSuccess: () => {
      toast.success('Community deleted successfully by Admin.');
      queryClient.invalidateQueries({ queryKey: ['communities'] });
    },
    onError: (err: any) => {
      console.error(err);
      toast.error(err.response?.data?.error || 'Failed to delete community.');
    },
  });

  if (!isAdmin) {
    // Return a standard Next.js 404-like error screen to throw off non-admins
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6">
        <div className="space-y-5 max-w-md">
          <h1 className="text-8xl font-black text-white/10 tracking-widest">404</h1>
          <h2 className="text-xl font-bold text-white">Page Not Found</h2>
          <p className="text-sm text-indigo-200/50 leading-relaxed">
            The page you are looking for does not exist, has been removed, or is temporarily unavailable.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-accent-indigo hover:bg-accent-violet transition text-sm font-semibold text-white mt-4"
          >
            <span>Back to Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  // Filter communities by search
  const filteredCommunities = communities.filter((c) => {
    const q = searchQuery.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      (c.description && c.description.toLowerCase().includes(q)) ||
      c.tags.some((t) => t.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header Banner */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl relative overflow-hidden border border-red-500/20 bg-red-500/[0.02] shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-red-500/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full border border-red-500/20 bg-red-500/5 text-red-400 text-xs font-semibold uppercase tracking-wider">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Super Administrator Mode</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">Secret Admin Portal</h1>
          <p className="text-sm text-indigo-200/50 max-w-2xl">
            Delete any community in the system. Note: Deleting a community deletes all its member links, resources, discussions, and replies permanently.
          </p>
        </div>
      </div>

      {/* Search and stats bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:max-w-md">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-red-400">
            <Search className="w-5 h-5" />
          </span>
          <input
            type="text"
            placeholder="Search communities to delete..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-white/10 bg-black/40 text-white placeholder-indigo-300/30 focus:outline-none focus:border-red-500 transition"
          />
        </div>

        <div className="px-5 py-2.5 rounded-xl border border-red-500/10 bg-red-500/5 text-xs text-red-400 font-bold flex items-center space-x-2">
          <AlertTriangle className="w-4 h-4" />
          <span>Total Communities: {communities.length}</span>
        </div>
      </div>

      {/* Grid listing all communities */}
      {isLoading ? (
        <div className="h-64 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-red-500" />
        </div>
      ) : filteredCommunities.length === 0 ? (
        <div className="glass-card p-12 text-center space-y-4 max-w-md mx-auto w-full mt-6">
          <Compass className="w-12 h-12 text-red-500/20 mx-auto" />
          <h4 className="font-bold text-white text-lg">No Communities Found</h4>
          <p className="text-xs text-indigo-200/50">
            There are no communities matching your search query.
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredCommunities.map((community) => (
              <motion.div
                key={community.community_id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="glass-card p-6 rounded-3xl border border-white/5 flex flex-col justify-between h-56 relative overflow-hidden group hover:border-red-500/20 transition duration-300"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <h3 className="font-extrabold text-lg text-white group-hover:text-red-400 transition line-clamp-1">
                      {community.name}
                    </h3>
                    <span className="text-[9px] font-bold tracking-wider uppercase bg-white/5 text-indigo-300 border border-white/5 px-2 py-0.5 rounded-md">
                      Role: {community.role || 'Non-Member'}
                    </span>
                  </div>
                  <p className="text-xs text-indigo-200/50 leading-relaxed line-clamp-3">
                    {community.description || 'No description provided.'}
                  </p>
                </div>

                <div className="space-y-3 pt-4">
                  <div className="flex flex-wrap gap-1">
                    {community.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="text-[9px] font-semibold text-indigo-200/30 bg-white/5 px-1.5 py-0.5 rounded-md"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={() => {
                      if (confirm(`Are you absolutely sure you want to delete community "${community.name}"? This action is irreversible.`)) {
                        deleteCommunityMutation.mutate(community.community_id);
                      }
                    }}
                    disabled={deleteCommunityMutation.isPending}
                    className="w-full py-2.5 rounded-xl border border-red-500/20 hover:border-red-500 bg-red-500/10 hover:bg-red-500 text-xs font-bold text-red-200 hover:text-white transition duration-200 flex items-center justify-center space-x-1.5"
                  >
                    {deleteCommunityMutation.isPending && deleteCommunityMutation.variables === community.community_id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <Trash2 className="w-4 h-4" />
                        <span>Delete Community</span>
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

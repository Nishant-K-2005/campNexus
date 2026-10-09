'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  Sparkles,
  BookOpen,
  ArrowRight,
  ShieldAlert,
  ShieldCheck,
  MessageSquare,
  Award,
  ChevronRight,
  Compass,
  FileText,
  Clock,
  ExternalLink,
  AlertTriangle,
} from 'lucide-react';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { communitiesApi } from '@/lib/api/communities';
import { discussionsApi } from '@/lib/api/discussions';
import { Post, Community } from '@/types';

export default function DashboardPage() {
  const { user, profile } = useAuthStore();
  const [filterType, setFilterType] = useState<string>('all');

  // 1. Fetch joined communities
  const { data: allCommunities = [], isLoading: loadingCommunities } = useQuery<Community[]>({
    queryKey: ['communities'],
    queryFn: communitiesApi.getCommunities,
  });

  const communities = allCommunities.filter(
    (c) => c.role === 'Member' || c.role === 'Moderator'
  );

  // 2. Fetch discussions across joined communities and merge them
  const { data: feedPosts = [], isLoading: loadingFeed } = useQuery<Post[]>({
    queryKey: ['dashboard-feed', communities.map((c) => c.community_id)],
    queryFn: async () => {
      if (communities.length === 0) return [];
      
      const allPostsPromises = communities.map(async (community) => {
        try {
          const posts = await discussionsApi.getDiscussions(community.community_id);
          // Inject community name into each post for visual display
          return posts.map((post) => ({
            ...post,
            communityName: community.name,
          })) as (Post & { communityName: string })[];
        } catch (error) {
          console.error(`Error loading feed for community ${community.community_id}:`, error);
          return [];
        }
      });

      const results = await Promise.all(allPostsPromises);
      const flatPosts = results.flat();
      
      // Sort chronologically (descending)
      return flatPosts.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    },
    enabled: communities.length > 0,
  });

  const filteredPosts = feedPosts.filter((post) => {
    if (post.status !== 'Accepted') return false;
    if (filterType === 'all') return true;
    return post.type === filterType;
  });

  // Animation variants
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemFade = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring' as const, stiffness: 100, damping: 15 },
    },
  };

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6 sm:p-8 rounded-3xl relative overflow-hidden border border-white/5 shadow-xl"
      >
        <div className="absolute top-0 right-0 w-80 h-80 bg-accent-indigo/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full border border-indigo-500/20 bg-indigo-500/5 text-accent-indigo text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Campus Community Portal</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
              Welcome back, <span className="gradient-text">{user?.full_name}</span>
            </h1>
            <p className="text-indigo-200/60 text-sm max-w-xl">
              Engage with your university network, access shared resource slides, and see AI-verified academic threads.
            </p>
          </div>

          {/* User Reputation Stats Widget */}
          <div className="flex-shrink-0 flex items-center space-x-4 bg-white/5 border border-white/5 p-4 rounded-2xl">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-accent-indigo to-accent-violet flex items-center justify-center font-bold text-white shadow-lg">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs text-indigo-300/40 font-bold uppercase tracking-widest">Reputation</div>
              <div className="text-2xl font-black text-white">{profile?.reputation_points || 0} Points</div>
              <div className="text-[10px] text-indigo-200/50">Level 1 Academic Contributor</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Grid: Feed left, sidebar shortcuts right */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Post Feed */}
        <div className="lg:col-span-8 space-y-6">
          {/* Feed Header */}
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white">Recent Activity</h3>
            
            {/* Filter Tabs */}
            <div className="flex bg-white/5 p-1 rounded-xl border border-white/5">
              {['all', 'Discussion', 'Resource'].map((type) => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition ${
                    filterType === type ? 'bg-accent-indigo text-white shadow' : 'text-indigo-200/50 hover:text-white'
                  }`}
                >
                  {type === 'all' ? 'All' : type}
                </button>
              ))}
            </div>
          </div>

          {/* Feed Content */}
          {loadingCommunities || loadingFeed ? (
            <div className="space-y-4">
              {[1, 2, 3].map((n) => (
                <div key={n} className="glass-card p-6 rounded-2xl border border-white/5 space-y-4 animate-pulse">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-white/5" />
                    <div className="space-y-2 flex-1">
                      <div className="h-4 bg-white/5 rounded w-1/3" />
                      <div className="h-3 bg-white/5 rounded w-1/4" />
                    </div>
                  </div>
                  <div className="h-16 bg-white/5 rounded" />
                </div>
              ))}
            </div>
          ) : communities.length === 0 ? (
            <div className="glass-card p-12 rounded-2xl text-center space-y-6 border border-white/5">
              <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-accent-indigo/60 mx-auto">
                <Compass className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h4 className="text-lg font-bold text-white">No Communities Joined</h4>
                <p className="text-sm text-indigo-200/50 max-w-sm mx-auto">
                  To get posts on your dashboard feed, explore and join course or club communities.
                </p>
              </div>
              <Link
                href="/communities"
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-accent-indigo hover:bg-accent-violet transition text-sm font-semibold text-white"
              >
                <span>Find Communities</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="glass-card p-12 rounded-2xl text-center space-y-4 border border-white/5">
              <div className="text-sm text-indigo-200/50">No activity matching the active filter in your communities.</div>
            </div>
          ) : (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="space-y-4"
            >
              {filteredPosts.map((post) => (
                <motion.div
                  key={post.post_id}
                  variants={itemFade}
                  className="glass-card p-6 rounded-2xl border border-white/5 glass-card-hover relative"
                >
                  <div className="flex items-start justify-between gap-4">
                    {/* Author Meta */}
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-accent-indigo to-accent-violet flex items-center justify-center font-bold text-white text-xs">
                        {post.user?.full_name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">{post.user?.full_name}</div>
                        <div className="text-[10px] text-indigo-200/40 flex items-center space-x-1.5">
                          <span>{post.user?.role}</span>
                          <span>•</span>
                          <span className="flex items-center space-x-0.5">
                            <Clock className="w-3 h-3" />
                            <span>
                              {new Date(post.created_at).toLocaleDateString([], {
                                month: 'short',
                                day: 'numeric',
                              })}
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Community name badge */}
                    <span className="text-[10px] font-bold text-accent-indigo uppercase tracking-wider bg-accent-indigo/5 px-2.5 py-1 rounded-md border border-accent-indigo/10">
                      {(post as any).communityName}
                    </span>
                  </div>

                  {/* Post Content */}
                  <div className="space-y-4">
                    <p className="text-sm text-indigo-100/70 leading-relaxed line-clamp-3">
                      {post.content}
                    </p>

                    {/* Attachment Preview (if any) */}
                    {post.attachments && post.attachments.length > 0 && (
                      <div className="p-3 rounded-xl border border-white/5 bg-black/20 flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <FileText className="w-4 h-4 text-accent-indigo" />
                          <span className="text-xs text-indigo-200 font-semibold truncate max-w-xs sm:max-w-md">
                            {post.attachments[0].title}
                          </span>
                        </div>
                        <span className="text-[10px] text-indigo-200/30 uppercase font-bold">
                          {post.attachments[0].type}
                        </span>
                      </div>
                    )}

                    {/* Footer Controls */}
                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                      {/* Moderation Badge */}
                      {post.status === 'Accepted' ? (
                        <div className="flex items-center space-x-1.5 text-green-400">
                          <ShieldCheck className="w-4 h-4" />
                          <span className="text-[10px] font-bold uppercase tracking-wider">AI Approved</span>
                        </div>
                      ) : post.status === 'Rejected' ? (
                        <div className="flex items-center space-x-1.5 text-red-400">
                          <AlertTriangle className="w-4 h-4" />
                          <span className="text-[10px] font-bold uppercase tracking-wider">AI Rejected</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-1.5 text-yellow-400">
                          <Clock className="w-4 h-4 animate-pulse" />
                          <span className="text-[10px] font-bold uppercase tracking-wider animate-pulse">AI Verifying</span>
                        </div>
                      )}

                      {/* Go to thread button */}
                      <Link
                        href={`/communities/${post.community_id}/discussions/${post.post_id}`}
                        className="inline-flex items-center space-x-1.5 text-xs text-indigo-300 hover:text-white font-semibold transition"
                      >
                        <span>View Discussion</span>
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>

        {/* Right Column: Shortcuts sidebar */}
        <div className="lg:col-span-4 space-y-6">
          {/* Quick links to joined communities */}
          <div className="glass-card p-6 rounded-2xl border border-white/5 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-white text-sm">My Communities</h4>
              <Link href="/communities" className="text-xs text-accent-indigo hover:text-indigo-400 font-semibold">
                Explore
              </Link>
            </div>

            {loadingCommunities ? (
              <div className="space-y-2">
                {[1, 2].map((n) => (
                  <div key={n} className="h-10 bg-white/5 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : communities.length === 0 ? (
              <div className="text-xs text-indigo-200/40 text-center py-4">You haven&apos;t joined any communities yet.</div>
            ) : (
              <div className="space-y-2">
                {communities.map((community) => (
                  <Link
                    key={community.community_id}
                    href={`/communities/${community.community_id}`}
                    className="flex items-center justify-between p-3 rounded-xl border border-white/5 bg-white/[0.01] hover:bg-white/5 transition group"
                  >
                    <span className="text-xs font-bold text-indigo-100 group-hover:text-white truncate max-w-[150px]">
                      {community.name}
                    </span>
                    <span className="text-[10px] font-semibold text-indigo-300/40 group-hover:text-accent-indigo uppercase transition">
                      Enter →
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Academic Resource Tracker / Helpful tips */}
          <div className="glass-card p-6 rounded-2xl border border-white/5 bg-gradient-to-br from-indigo-950/10 via-slate-950/10 to-violet-950/15 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-accent-violet/5 rounded-full blur-2xl pointer-events-none" />
            <h4 className="font-bold text-white text-sm mb-3">Community Spotlight</h4>
            <p className="text-xs text-indigo-200/60 leading-relaxed mb-4">
              CampNexus verifies your uploads automatically. Earn up to 20 reputation points for every AI-approved slide deck, exam summary, or study card you post!
            </p>
            <Link
              href="/communities"
              className="inline-flex items-center space-x-2 text-xs text-accent-indigo font-bold hover:text-indigo-300"
            >
              <span>Explore Resource Centers</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

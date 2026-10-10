'use client';

import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'react-hot-toast';
import {
  Users,
  Plus,
  Search,
  Loader2,
  X,
  Compass,
  Hash,
  TrendingUp,
  Clock,
  AlignLeft,
  AlertCircle,
  ArrowUpDown,
} from 'lucide-react';
import { communitiesApi } from '@/lib/api/communities';
import { Community } from '@/types';
import Link from 'next/link';

// Schema matching createCommunitySchema validator in backend
const communitySchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters').max(30, 'Name must be under 30 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  tagsInput: z.string().optional(),
});

type CommunityFormValues = z.infer<typeof communitySchema>;
type SortOption = 'latest' | 'popular' | 'alphabetical';

const SORT_OPTIONS: { value: SortOption; label: string; icon: React.ReactNode }[] = [
  { value: 'latest', label: 'Latest', icon: <Clock className="w-3.5 h-3.5" /> },
  { value: 'popular', label: 'Popular', icon: <TrendingUp className="w-3.5 h-3.5" /> },
  { value: 'alphabetical', label: 'A–Z', icon: <AlignLeft className="w-3.5 h-3.5" /> },
];

function sortCommunities(communities: Community[], sort: SortOption): Community[] {
  switch (sort) {
    case 'latest':
      return [...communities].sort((a, b) => {
        const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
        return dateB - dateA;
      });
    case 'popular':
      return [...communities].sort((a, b) => (b.member_count ?? 0) - (a.member_count ?? 0));
    case 'alphabetical':
      return [...communities].sort((a, b) => a.name.localeCompare(b.name));
    default:
      return communities;
  }
}

function timeAgo(dateStr?: string): string {
  if (!dateStr) return '';
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}

export default function CommunitiesPage() {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'joined' | 'discover'>('joined');
  const [sortOption, setSortOption] = useState<SortOption>('latest');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tagsList, setTagsList] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');

  // Fetch ALL communities from the database (returns all communities + current user's membership role)
  const { data: allCommunities = [], isLoading, isError, refetch } = useQuery<Community[]>({
    queryKey: ['communities'],
    queryFn: communitiesApi.getCommunities,
    staleTime: 30_000, // 30s — still fresh enough, refetch on window focus
    refetchOnWindowFocus: true,
  });

  // Communities where user is a member or moderator
  const joinedCommunities = useMemo(() =>
    allCommunities.filter((c) => c.role === 'Member' || c.role === 'Moderator'),
    [allCommunities]
  );

  // All public communities NOT yet joined by the current user (other users' communities)
  const discoverCommunities = useMemo(() =>
    allCommunities.filter((c) => !c.role),
    [allCommunities]
  );

  // 2. Join Community Mutation
  const joinMutation = useMutation({
    mutationFn: communitiesApi.joinCommunity,
    onSuccess: () => {
      toast.success('Successfully joined community!');
      queryClient.invalidateQueries({ queryKey: ['communities'] });
    },
    onError: (err: any) => {
      console.error(err);
      toast.error(err.response?.data?.error || 'Failed to join community.');
    },
  });

  // 3. Create Community Mutation
  const createMutation = useMutation({
    mutationFn: communitiesApi.createCommunity,
    onSuccess: () => {
      toast.success('Community created successfully!');
      setIsModalOpen(false);
      setTagsList([]);
      reset();
      // Invalidate so both "My Communities" and "Explore" immediately reflect the new community
      queryClient.invalidateQueries({ queryKey: ['communities'] });
    },
    onError: (err: any) => {
      console.error(err);
      toast.error(err.response?.data?.error || 'Failed to create community.');
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CommunityFormValues>({
    resolver: zodResolver(communitySchema),
  });

  const handleAddTag = () => {
    const trimmed = newTag.trim().toLowerCase();
    if (trimmed && !tagsList.includes(trimmed)) {
      setTagsList([...tagsList, trimmed]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTagsList(tagsList.filter((t) => t !== tag));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const onSubmit = (data: CommunityFormValues) => {
    if (tagsList.length < 3) {
      toast.error('Please add at least 3 descriptive tags');
      return;
    }
    createMutation.mutate({
      name: data.name,
      description: data.description,
      tags: tagsList,
    });
  };

  // Filter + sort for the active tab
  const filteredJoined = useMemo(() => {
    const query = searchQuery.toLowerCase();
    const filtered = joinedCommunities.filter((c) =>
      c.name.toLowerCase().includes(query) ||
      (c.description && c.description.toLowerCase().includes(query)) ||
      c.tags.some((t) => t.toLowerCase().includes(query))
    );
    return sortCommunities(filtered, sortOption);
  }, [joinedCommunities, searchQuery, sortOption]);

  const filteredDiscover = useMemo(() => {
    const query = searchQuery.toLowerCase();
    const filtered = discoverCommunities.filter((dc) =>
      dc.name.toLowerCase().includes(query) ||
      (dc.description && dc.description.toLowerCase().includes(query)) ||
      dc.tags.some((t) => t.toLowerCase().includes(query))
    );
    return sortCommunities(filtered, sortOption);
  }, [discoverCommunities, searchQuery, sortOption]);

  return (
    <div className="space-y-8">
      {/* Top Banner actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold text-white">Communities</h1>
          <p className="text-sm text-indigo-200/50">
            Join courses, study circles, and clubs to share resources.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex-shrink-0 flex items-center justify-center space-x-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-accent-indigo to-accent-violet hover:opacity-95 text-white font-semibold transition shadow-[0_4px_15px_rgba(99,102,241,0.25)]"
        >
          <Plus className="w-5 h-5" />
          <span>New Community</span>
        </button>
      </div>

      {/* Search, Tabs, and Sort */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search */}
          <div className="relative w-full md:max-w-md">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-indigo-400">
              <Search className="w-5 h-5" />
            </span>
            <input
              type="text"
              placeholder="Search by name, description, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-white/10 bg-black/40 text-white placeholder-indigo-300/30 focus:outline-none focus:border-accent-indigo transition"
            />
          </div>

          {/* Tab Controls */}
          <div className="flex bg-white/5 p-1 rounded-xl border border-white/5 w-full md:w-auto">
            <button
              onClick={() => setActiveTab('joined')}
              className={`flex-1 md:flex-initial px-5 py-2 rounded-lg text-xs font-bold transition flex items-center justify-center space-x-2 ${
                activeTab === 'joined' ? 'bg-accent-indigo text-white shadow' : 'text-indigo-200/50 hover:text-white'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>My Communities ({joinedCommunities.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('discover')}
              className={`flex-1 md:flex-initial px-5 py-2 rounded-lg text-xs font-bold transition flex items-center justify-center space-x-2 ${
                activeTab === 'discover' ? 'bg-accent-indigo text-white shadow' : 'text-indigo-200/50 hover:text-white'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Explore ({discoverCommunities.length})</span>
            </button>
          </div>
        </div>

        {/* Sort Options */}
        <div className="flex items-center gap-2">
          <ArrowUpDown className="w-3.5 h-3.5 text-indigo-400/60 flex-shrink-0" />
          <span className="text-[11px] text-indigo-300/50 font-medium uppercase tracking-wider mr-1">Sort:</span>
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setSortOption(opt.value)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold transition ${
                sortOption === opt.value
                  ? 'bg-accent-indigo/20 text-accent-indigo border border-accent-indigo/30'
                  : 'text-indigo-300/40 hover:text-indigo-200/70 border border-white/5 hover:border-white/10'
              }`}
            >
              {opt.icon}
              <span>{opt.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Error State */}
      {isError && (
        <div className="glass-card p-6 rounded-2xl border border-red-500/20 flex items-center gap-4">
          <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0" />
          <div>
            <p className="text-white font-semibold text-sm">Failed to load communities</p>
            <p className="text-xs text-indigo-200/50 mt-0.5">Could not connect to the server. Check your connection.</p>
          </div>
          <button
            onClick={() => refetch()}
            className="ml-auto px-4 py-2 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-bold text-white transition"
          >
            Retry
          </button>
        </div>
      )}

      {/* Main Grid display */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {isLoading ? (
            [1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="h-52 rounded-2xl bg-white/5 animate-pulse border border-white/5" />
            ))
          ) : activeTab === 'joined' ? (
            filteredJoined.length === 0 ? (
              <div className="sm:col-span-2 lg:col-span-3 glass-card p-12 text-center space-y-4 max-w-md mx-auto w-full mt-6">
                <Compass className="w-12 h-12 text-indigo-300/40 mx-auto" />
                <h4 className="font-bold text-white text-lg">No Communities found</h4>
                <p className="text-xs text-indigo-200/50">
                  {searchQuery
                    ? 'Try refining your search terms.'
                    : 'Go to Explore to find communities to join!'}
                </p>
                {!searchQuery && (
                  <button
                    onClick={() => setActiveTab('discover')}
                    className="mt-2 px-5 py-2.5 rounded-xl bg-accent-indigo/20 border border-accent-indigo/30 text-accent-indigo text-xs font-bold hover:bg-accent-indigo/30 transition"
                  >
                    Browse Explore
                  </button>
                )}
              </div>
            ) : (
              filteredJoined.map((community) => (
                <motion.div
                  key={community.community_id}
                  layoutId={`joined-${community.community_id}`}
                  className="glass-card p-6 rounded-3xl border border-white/5 flex flex-col justify-between h-52 glass-card-hover group relative overflow-hidden"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <h3 className="font-extrabold text-lg text-white group-hover:text-accent-indigo transition line-clamp-1">
                        {community.name}
                      </h3>
                      {community.role && (
                        <span className="text-[10px] font-bold tracking-wider uppercase bg-accent-indigo/10 text-accent-indigo border border-accent-indigo/10 px-2 py-0.5 rounded-md flex-shrink-0">
                          {community.role}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-indigo-200/50 leading-relaxed line-clamp-2">
                      {community.description || 'No description provided.'}
                    </p>
                    <p className="text-[10px] text-indigo-300/30">
                      {community.member_count ?? 0} members · {community.post_count ?? 0} posts
                      {community.created_at && ` · ${timeAgo(community.created_at)}`}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-3">
                    {community.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="text-[9px] font-semibold text-indigo-200/40 bg-white/5 px-2 py-0.5 rounded-md border border-white/5 flex items-center space-x-0.5"
                      >
                        <Hash className="w-2.5 h-2.5" />
                        <span>{tag}</span>
                      </span>
                    ))}
                    {community.tags.length > 3 && (
                      <span className="text-[9px] font-semibold text-indigo-200/30 bg-white/5 px-1.5 py-0.5 rounded-md border border-white/5">
                        +{community.tags.length - 3}
                      </span>
                    )}
                  </div>

                  {/* Absolute Click link to sub-route detail */}
                  <Link
                    href={`/communities/${community.community_id}`}
                    className="absolute inset-0 z-10"
                    aria-label={`View ${community.name}`}
                  />
                </motion.div>
              ))
            )
          ) : filteredDiscover.length === 0 ? (
            <div className="sm:col-span-2 lg:col-span-3 glass-card p-12 text-center space-y-4 max-w-md mx-auto w-full mt-6">
              <Compass className="w-12 h-12 text-indigo-300/40 mx-auto" />
              <h4 className="font-bold text-white text-lg">No Communities to discover</h4>
              <p className="text-xs text-indigo-200/50">
                {searchQuery
                  ? 'Try refining your search terms.'
                  : 'You have joined every community, or no public communities exist yet. Create one!'}
              </p>
              {!searchQuery && (
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="mt-2 px-5 py-2.5 rounded-xl bg-accent-indigo/20 border border-accent-indigo/30 text-accent-indigo text-xs font-bold hover:bg-accent-indigo/30 transition"
                >
                  + Create Community
                </button>
              )}
            </div>
          ) : (
            filteredDiscover.map((dc) => (
              <motion.div
                key={dc.community_id}
                layoutId={`discover-${dc.community_id}`}
                className="glass-card p-6 rounded-3xl border border-white/5 flex flex-col justify-between h-64 relative overflow-hidden"
              >
                <div className="space-y-2">
                  <h3 className="font-extrabold text-lg text-white line-clamp-1">{dc.name}</h3>
                  <p className="text-xs text-indigo-200/50 leading-relaxed line-clamp-2">
                    {dc.description}
                  </p>
                  <p className="text-[10px] text-indigo-300/30">
                    By <span className="text-indigo-300/50 font-semibold">{dc.created_by?.full_name || 'a student'}</span>
                    {' · '}
                    <span>{dc.member_count ?? 0} members</span>
                    {' · '}
                    <span>{dc.post_count ?? 0} posts</span>
                    {dc.created_at && ` · ${timeAgo(dc.created_at)}`}
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex flex-wrap gap-1.5">
                    {dc.tags.slice(0, 4).map((tag) => (
                      <span
                        key={tag}
                        className="text-[9px] font-semibold text-indigo-200/40 bg-white/5 px-2 py-0.5 rounded-md border border-white/5"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <Link
                      href={`/communities/${dc.community_id}`}
                      className="flex-1 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-xs font-bold text-indigo-100 text-center transition z-10 relative"
                    >
                      View
                    </Link>
                    <button
                      onClick={() => joinMutation.mutate(dc.community_id)}
                      disabled={joinMutation.isPending && joinMutation.variables === dc.community_id}
                      className="flex-1 py-2.5 rounded-xl border border-white/5 hover:border-accent-indigo/35 bg-white/5 hover:bg-accent-indigo text-xs font-bold text-indigo-100 hover:text-white transition duration-200 flex items-center justify-center space-x-1.5 z-10 relative"
                    >
                      {joinMutation.isPending && joinMutation.variables === dc.community_id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <Users className="w-4 h-4" />
                          <span>Join</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </motion.div>
      </AnimatePresence>

      {/* Slide-out Creation Modal Overlay */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-black z-40"
            />

            {/* Form Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring' as const, damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-full sm:w-[480px] glass-panel z-50 flex flex-col p-6 overflow-y-auto"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
                <div className="flex items-center space-x-2">
                  <Users className="w-6 h-6 text-accent-indigo" />
                  <span className="font-extrabold text-lg">Create Community</span>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 rounded-lg text-indigo-300/60 hover:text-white hover:bg-white/5 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form Body */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 flex-grow">
                {/* Community Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-indigo-300/80">
                    Community Name
                  </label>
                  <input
                    type="text"
                    {...register('name')}
                    placeholder="e.g., Computer Science 101"
                    className={`w-full px-4 py-3 rounded-xl border bg-black/40 text-white placeholder-indigo-300/30 focus:outline-none transition ${
                      errors.name
                        ? 'border-red-500/50 focus:border-red-500'
                        : 'border-white/10 focus:border-accent-indigo'
                    }`}
                  />
                  {errors.name && (
                    <p className="text-xs text-red-400 font-medium">{errors.name.message}</p>
                  )}
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-indigo-300/80">
                    Description (Min 20 characters)
                  </label>
                  <textarea
                    {...register('description')}
                    rows={4}
                    placeholder="Describe the purpose, syllabus topic discussions, or course focus. Explain guidelines..."
                    className={`w-full px-4 py-3 rounded-xl border bg-black/40 text-white placeholder-indigo-300/30 focus:outline-none transition ${
                      errors.description
                        ? 'border-red-500/50 focus:border-red-500'
                        : 'border-white/10 focus:border-accent-indigo'
                    }`}
                  />
                  {errors.description && (
                    <p className="text-xs text-red-400 font-medium">{errors.description.message}</p>
                  )}
                </div>

                {/* Tags Section */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-indigo-300/80">
                    Tags (Add at least 3)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Type tag and click Add (or hit Enter)"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyDown={handleKeyPress}
                      className="flex-grow px-4 py-2.5 rounded-xl border border-white/10 bg-black/40 text-white placeholder-indigo-300/30 focus:outline-none focus:border-accent-indigo transition"
                    />
                    <button
                      type="button"
                      onClick={handleAddTag}
                      className="px-4 rounded-xl border border-white/10 hover:border-accent-indigo/35 bg-white/5 hover:bg-accent-indigo/10 transition font-bold text-xs"
                    >
                      Add
                    </button>
                  </div>

                  {/* Render tag list badges */}
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {tagsList.length === 0 ? (
                      <span className="text-xs text-indigo-200/30 italic">No tags added yet.</span>
                    ) : (
                      tagsList.map((tag) => (
                        <span
                          key={tag}
                          className="flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-bold text-indigo-100 bg-accent-indigo/10 border border-accent-indigo/25"
                        >
                          <span>#{tag}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(tag)}
                            className="text-indigo-300/60 hover:text-white"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))
                    )}
                  </div>
                </div>

                {/* Submit Panel */}
                <div className="pt-6 border-t border-white/5">
                  <button
                    type="submit"
                    disabled={createMutation.isPending}
                    className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-accent-indigo to-accent-violet hover:opacity-95 text-white font-semibold transition flex items-center justify-center space-x-2 shadow-[0_4px_15px_rgba(99,102,241,0.2)] disabled:opacity-50"
                  >
                    {createMutation.isPending ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <span>Create Community</span>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
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
  Tag,
  Loader2,
  X,
  Compass,
  CheckCircle,
  HelpCircle,
  Hash,
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

// Predefined discovery communities to join
const DISCOVER_COMMUNITIES = [
  {
    community_id: 'ML-Tribe-CS401',
    name: 'Machine Learning Tribe',
    description: 'Deep discussions around linear regression, neural networks, and classification theory.',
    tags: ['CS-401', 'ML', 'Python', 'AI'],
  },
  {
    community_id: 'Calculus-II-Study',
    name: 'Calculus II study',
    description: 'Peer support group for solving integration techniques, series convergence, and calculus limits.',
    tags: ['Math', 'Calculus', 'Limits', 'Integrals'],
  },
  {
    community_id: 'Robotics-Engineering-Club',
    name: 'Robotics Engineering Club',
    description: 'Building autonomous rovers and drones. Share blueprints, sensor configs, and code guides.',
    tags: ['Engineering', 'Robotics', 'C++', 'Hardware'],
  },
  {
    community_id: 'Design-Aesthetics-Studio',
    name: 'Design Aesthetics Studio',
    description: 'Critique and share user interface layouts, micro-interaction mockups, and layout grids.',
    tags: ['Design', 'UI', 'UX', 'Figma'],
  },
];

export default function CommunitiesPage() {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'joined' | 'discover'>('joined');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tagsList, setTagsList] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');

  // 1. Fetch all communities from the database
  const { data: allCommunities = [], isLoading } = useQuery<Community[]>({
    queryKey: ['communities'],
    queryFn: communitiesApi.getCommunities,
  });

  const joinedCommunities = allCommunities.filter(
    (c) => c.role === 'Member' || c.role === 'Moderator'
  );

  // 2. Join Community Mutation
  const joinMutation = useMutation({
    mutationFn: communitiesApi.joinCommunity,
    onSuccess: (data) => {
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
    onSuccess: (data) => {
      toast.success('Community created successfully!');
      setIsModalOpen(false);
      setTagsList([]);
      reset();
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

  // Filters joined communities by search input
  const filteredJoined = joinedCommunities.filter((c) => {
    const query = searchQuery.toLowerCase();
    return (
      c.name.toLowerCase().includes(query) ||
      (c.description && c.description.toLowerCase().includes(query)) ||
      c.tags.some((t) => t.toLowerCase().includes(query))
    );
  });

  // Filters discover communities (excluding ones already joined)
  const nonJoinedDiscover = allCommunities.filter(
    (c) => !c.role
  );

  const filteredDiscover = nonJoinedDiscover.filter((dc) => {
    const query = searchQuery.toLowerCase();
    return (
      dc.name.toLowerCase().includes(query) ||
      (dc.description && dc.description.toLowerCase().includes(query)) ||
      dc.tags.some((t) => t.toLowerCase().includes(query))
    );
  });

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

      {/* Search and Navigation Tabs */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative w-full md:max-w-md">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-indigo-400">
            <Search className="w-5 h-5" />
          </span>
          <input
            type="text"
            placeholder="Search by community name, course code, or tags..."
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
            <span>Explore Discovery</span>
          </button>
        </div>
      </div>

      {/* Main Grid display */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {activeTab === 'joined' ? (
            isLoading ? (
              [1, 2, 3].map((n) => (
                <div key={n} className="h-48 rounded-2xl bg-white/5 animate-pulse border border-white/5" />
              ))
            ) : filteredJoined.length === 0 ? (
              <div className="sm:col-span-2 lg:col-span-3 glass-card p-12 text-center space-y-4 max-w-md mx-auto w-full mt-6">
                <Compass className="w-12 h-12 text-indigo-300/40 mx-auto" />
                <h4 className="font-bold text-white text-lg">No Communities found</h4>
                <p className="text-xs text-indigo-200/50">
                  {searchQuery ? 'Try refining your search terms.' : 'Go to Explore Discovery to find communities to join!'}
                </p>
              </div>
            ) : (
              filteredJoined.map((community) => (
                <motion.div
                  key={community.community_id}
                  layoutId={community.community_id}
                  className="glass-card p-6 rounded-3xl border border-white/5 flex flex-col justify-between h-52 glass-card-hover group relative overflow-hidden"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <h3 className="font-extrabold text-lg text-white group-hover:text-accent-indigo transition line-clamp-1">
                        {community.name}
                      </h3>
                      {community.role && (
                        <span className="text-[10px] font-bold tracking-wider uppercase bg-accent-indigo/10 text-accent-indigo border border-accent-indigo/10 px-2 py-0.5 rounded-md">
                          {community.role}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-indigo-200/50 leading-relaxed line-clamp-3">
                      {community.description || 'No description provided.'}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-4">
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
              <p className="text-xs text-indigo-200/50">You have joined all recommended communities.</p>
            </div>
          ) : (
            filteredDiscover.map((dc) => (
              <motion.div
                key={dc.community_id}
                layoutId={dc.community_id}
                className="glass-card p-6 rounded-3xl border border-white/5 flex flex-col justify-between h-56 relative overflow-hidden"
              >
                <div className="space-y-3">
                  <h3 className="font-extrabold text-lg text-white line-clamp-1">{dc.name}</h3>
                  <p className="text-xs text-indigo-200/50 leading-relaxed line-clamp-3">
                    {dc.description}
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex flex-wrap gap-1.5">
                    {dc.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[9px] font-semibold text-indigo-200/40 bg-white/5 px-2 py-0.5 rounded-md border border-white/5"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={() => joinMutation.mutate(dc.community_id)}
                    disabled={joinMutation.isPending}
                    className="w-full py-2.5 rounded-xl border border-white/5 hover:border-accent-indigo/35 bg-white/5 hover:bg-accent-indigo text-xs font-bold text-indigo-100 hover:text-white transition duration-200 flex items-center justify-center space-x-1.5"
                  >
                    {joinMutation.isPending && joinMutation.variables === dc.community_id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <Users className="w-4 h-4" />
                        <span>Join Community</span>
                      </>
                    )}
                  </button>
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

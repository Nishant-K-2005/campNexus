'use client';

import React, { useState, use } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import {
  MessageSquare,
  FileText,
  Plus,
  Search,
  Upload,
  Trash2,
  ShieldCheck,
  Loader2,
  X,
  FileDown,
  Lock,
  ExternalLink,
  ChevronRight,
  Clock,
  AlertTriangle,
  CheckCircle,
} from 'lucide-react';
import { communitiesApi } from '@/lib/api/communities';
import { discussionsApi } from '@/lib/api/discussions';
import { resourcesApi } from '@/lib/api/resources';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { Community, Post } from '@/types';
import Link from 'next/link';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function CommunityDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const communityId = resolvedParams.id;
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  const [activeTab, setActiveTab] = useState<'discussions' | 'resources'>('discussions');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals state
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isResourceModalOpen, setIsResourceModalOpen] = useState(false);

  // Form states
  const [fileAttachment, setFileAttachment] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // AI Gatekeeper Processing Modal state
  const [aiProcessingState, setAiProcessingState] = useState<{
    isOpen: boolean;
    type: 'post' | 'resource';
    step: number;
    status: 'idle' | 'processing' | 'success' | 'error';
    errorMsg?: string;
  }>({
    isOpen: false,
    type: 'post',
    step: 1,
    status: 'idle',
  });

  // Simulated AI Gatekeeper Processing Step Advancer
  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (aiProcessingState.isOpen && aiProcessingState.status === 'processing') {
      interval = setInterval(() => {
        setAiProcessingState((prev) => {
          if (prev.step < 3) {
            return { ...prev, step: prev.step + 1 };
          }
          return prev;
        });
      }, 900);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [aiProcessingState.isOpen, aiProcessingState.status]);

  // 1. Fetch all communities to locate the active one (as there is no direct GET /api/communities/:id)
  const { data: communities = [], isLoading: loadingCommunityInfo } = useQuery<Community[]>({
    queryKey: ['communities'],
    queryFn: communitiesApi.getCommunities,
  });

  const activeCommunity = communities.find((c) => c.community_id === communityId);

  // 2. Fetch Discussions
  const { data: discussions = [], isLoading: loadingDiscussions } = useQuery<Post[]>({
    queryKey: ['discussions', communityId],
    queryFn: () => discussionsApi.getDiscussions(communityId),
    enabled: !!activeCommunity,
  });

  // 3. Fetch Resources
  const { data: resources = [], isLoading: loadingResources } = useQuery<Post[]>({
    queryKey: ['resources', communityId],
    queryFn: () => resourcesApi.getResources(communityId),
    enabled: !!activeCommunity,
  });

  // 4. Delete Post Mutation (for both discussions and resources)
  const deleteMutation = useMutation({
    mutationFn: async ({ postId, type }: { postId: string; type: 'Discussion' | 'Resource' }) => {
      if (type === 'Discussion') {
        return discussionsApi.deleteDiscussion(postId);
      } else {
        return resourcesApi.deleteResource(postId);
      }
    },
    onSuccess: (_, variables) => {
      toast.success(`${variables.type} deleted successfully`);
      queryClient.invalidateQueries({ queryKey: [variables.type === 'Discussion' ? 'discussions' : 'resources', communityId] });
    },
    onError: (err: any) => {
      console.error(err);
      toast.error('Failed to delete post.');
    },
  });

  // 5. Create Discussion Mutation
  const createDiscussionMutation = useMutation({
    mutationFn: discussionsApi.createDiscussion,
    onMutate: () => {
      setIsPostModalOpen(false);
      setAiProcessingState({
        isOpen: true,
        type: 'post',
        step: 1,
        status: 'processing',
      });
    },
    onSuccess: () => {
      setTimeout(() => {
        setAiProcessingState((prev) => ({
          ...prev,
          step: 4,
          status: 'success',
        }));
        setTimeout(() => {
          setAiProcessingState((prev) => ({ ...prev, isOpen: false, status: 'idle' }));
          setFileAttachment(null);
          queryClient.invalidateQueries({ queryKey: ['discussions', communityId] });
          toast.success('Submitted for AI review. It will appear only if approved.');
        }, 1200);
      }, 800);
    },
    onError: (err: any) => {
      console.error(err);
      setAiProcessingState((prev) => ({
        ...prev,
        status: 'error',
        errorMsg: err.response?.data?.error || 'Failed to submit discussion.',
      }));
    },
  });

  // 6. Upload Resource Mutation
  const uploadResourceMutation = useMutation({
    mutationFn: resourcesApi.uploadResource,
    onMutate: () => {
      setIsResourceModalOpen(false);
      setAiProcessingState({
        isOpen: true,
        type: 'resource',
        step: 1,
        status: 'processing',
      });
    },
    onSuccess: () => {
      setTimeout(() => {
        setAiProcessingState((prev) => ({
          ...prev,
          step: 4,
          status: 'success',
        }));
        setTimeout(() => {
          setAiProcessingState((prev) => ({ ...prev, isOpen: false, status: 'idle' }));
          setFileAttachment(null);
          queryClient.invalidateQueries({ queryKey: ['resources', communityId] });
          toast.success('Submitted for AI review. It will appear only if approved.');
        }, 1200);
      }, 800);
    },
    onError: (err: any) => {
      console.error(err);
      setAiProcessingState((prev) => ({
        ...prev,
        status: 'error',
        errorMsg: err.response?.data?.error || 'Failed to upload resource.',
      }));
    },
  });

  // Discussion submit handler
  const handleDiscussionSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const content = formData.get('content') as string;

    if (!content.trim()) {
      toast.error('Post content cannot be empty');
      return;
    }

    createDiscussionMutation.mutate({
      communityId,
      content,
      file: fileAttachment,
    });
  };

  // Resource upload submit handler
  const handleResourceSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;

    if (!title.trim() || !description.trim()) {
      toast.error('Title and description are required');
      return;
    }

    if (!fileAttachment) {
      toast.error('Please attach a resource document file');
      return;
    }

    uploadResourceMutation.mutate({
      title,
      description,
      communityId,
      file: fileAttachment,
    });
  };

  // Filters posts by search input
  const filteredDiscussions = discussions.filter((d) =>
    d.status === 'Accepted' && (
      d.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (d.user?.full_name && d.user.full_name.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  );

  const filteredResources = resources.filter((r) =>
    r.status === 'Accepted' && (
      r.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.attachments && r.attachments[0]?.title.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  );

  if (loadingCommunityInfo) {
    return (
      <div className="h-64 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-accent-indigo" />
      </div>
    );
  }

  if (!activeCommunity || !activeCommunity.role) {
    return (
      <div className="glass-card p-8 text-center max-w-md mx-auto space-y-4">
        <Lock className="w-12 h-12 text-red-400 mx-auto" />
        <h3 className="text-xl font-bold text-white">Community Access Restricted</h3>
        <p className="text-sm text-indigo-200/50">
          You must be a member of this community to access resources. Go to the Communities search to join.
        </p>
        <Link
          href="/communities"
          className="inline-block px-5 py-2.5 rounded-xl bg-accent-indigo hover:bg-accent-violet transition font-semibold text-white text-sm"
        >
          Explore Communities
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Community Header Banner */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl relative overflow-hidden border border-white/5 shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-accent-violet/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="relative z-10 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-3xl font-extrabold text-white">{activeCommunity.name}</h1>
              <p className="text-indigo-200/60 text-sm max-w-2xl">{activeCommunity.description}</p>
            </div>
            
            {/* Joined State Tag */}
            <div className="flex-shrink-0 flex items-center space-x-2">
              <span className="px-3.5 py-1.5 rounded-full border border-green-500/20 bg-green-500/10 text-green-400 text-xs font-bold uppercase tracking-wider">
                Joined Member
              </span>
              {activeCommunity.role === 'Moderator' && (
                <span className="px-3.5 py-1.5 rounded-full border border-accent-indigo/20 bg-accent-indigo/10 text-accent-indigo text-xs font-bold uppercase tracking-wider">
                  Moderator
                </span>
              )}
            </div>
          </div>

          {/* Tags list */}
          <div className="flex flex-wrap gap-2 pt-2">
            {activeCommunity.tags.map((tag) => (
              <span
                key={tag}
                className="text-[10px] font-bold text-indigo-300/40 bg-white/5 px-2.5 py-1 rounded-md border border-white/5"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Switcher & Actions header */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between border-b border-white/5 pb-4">
        {/* Navigation Tabs */}
        <div className="flex space-x-6 relative">
          {(['discussions', 'resources'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setSearchQuery('');
              }}
              className={`text-sm font-bold pb-2 uppercase tracking-wider relative transition duration-200 capitalize ${
                activeTab === tab ? 'text-white' : 'text-indigo-300/40 hover:text-white'
              }`}
            >
              <span>{tab}</span>
              {activeTab === tab && (
                <motion.div
                  layoutId="activeTabUnderline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-accent-indigo to-accent-violet"
                />
              )}
            </button>
          ))}
        </div>

        {/* Filters and Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
          {/* Search */}
          <div className="relative w-full sm:max-w-xs">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-indigo-400">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-white/10 bg-black/40 text-white placeholder-indigo-300/30 focus:outline-none focus:border-accent-indigo text-xs"
            />
          </div>

          {/* Action Trigger */}
          {activeTab === 'discussions' ? (
            <button
              onClick={() => setIsPostModalOpen(true)}
              className="w-full sm:w-auto flex-shrink-0 flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-accent-indigo hover:bg-accent-violet text-white text-xs font-semibold transition shadow-[0_4px_10px_rgba(99,102,241,0.2)]"
            >
              <Plus className="w-4 h-4" />
              <span>New Discussion</span>
            </button>
          ) : (
            <button
              onClick={() => setIsResourceModalOpen(true)}
              className="w-full sm:w-auto flex-shrink-0 flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-accent-indigo hover:bg-accent-violet text-white text-xs font-semibold transition shadow-[0_4px_10px_rgba(99,102,241,0.2)]"
            >
              <Upload className="w-4 h-4" />
              <span>Upload Document</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs Layout contents */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          className="space-y-4"
        >
          {activeTab === 'discussions' ? (
            loadingDiscussions ? (
              <div className="space-y-4">
                {[1, 2].map((n) => (
                  <div key={n} className="h-44 bg-white/5 animate-pulse rounded-2xl border border-white/5" />
                ))}
              </div>
            ) : filteredDiscussions.length === 0 ? (
              <div className="glass-card p-12 text-center text-sm text-indigo-200/40 border border-white/5 rounded-2xl">
                No discussion threads found. Click New Discussion to start one!
              </div>
            ) : (
              filteredDiscussions.map((post) => (
                <div
                  key={post.post_id}
                  className="glass-card p-6 rounded-2xl border border-white/5 hover:border-white/10 transition relative group"
                >
                  <div className="flex items-start justify-between gap-4">
                    {/* Author Meta */}
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-accent-indigo to-accent-violet flex items-center justify-center font-bold text-white text-xs border border-white/10">
                        {post.user?.full_name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">{post.user?.full_name}</div>
                        <div className="text-[10px] text-indigo-300/40 flex items-center space-x-1.5">
                          <span>{post.user?.role}</span>
                          <span>•</span>
                          <span>{new Date(post.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    {/* Delete capability */}
                    {(user?.role === 'Admin' || user?.user_id === post.user_id) && (
                      <button
                        onClick={() => deleteMutation.mutate({ postId: post.post_id, type: 'Discussion' })}
                        disabled={deleteMutation.isPending}
                        className="opacity-0 group-hover:opacity-100 p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition"
                        title="Delete Thread"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Body */}
                  <div className="space-y-4">
                    <p className="text-sm text-indigo-100/70 leading-relaxed break-words whitespace-pre-line">
                      {post.content}
                    </p>

                    {/* Attached file link */}
                    {post.attachments && post.attachments.length > 0 && (
                      <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between text-xs max-w-sm">
                        <div className="flex items-center space-x-2">
                          <FileText className="w-4 h-4 text-accent-indigo" />
                          <span className="font-semibold truncate max-w-[150px] sm:max-w-xs">{post.attachments[0].title}</span>
                        </div>
                        <a
                          href={post.attachments[0].url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-accent-indigo text-indigo-300 hover:text-white transition"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    )}

                    {/* Footer stats */}
                    <div className="flex items-center justify-between pt-4 border-t border-white/5 text-xs text-indigo-200/50">
                      {post.status === 'Accepted' ? (
                        <div className="flex items-center space-x-1 text-green-400">
                          <ShieldCheck className="w-4 h-4" />
                          <span className="text-[10px] font-bold uppercase tracking-wider">AI Approved</span>
                        </div>
                      ) : post.status === 'Rejected' ? (
                        <div className="flex items-center space-x-1 text-red-400">
                          <AlertTriangle className="w-4 h-4" />
                          <span className="text-[10px] font-bold uppercase tracking-wider">AI Rejected</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-1 text-yellow-400">
                          <Clock className="w-4 h-4 animate-pulse" />
                          <span className="text-[10px] font-bold uppercase tracking-wider animate-pulse">AI Verifying</span>
                        </div>
                      )}
                      
                      {/* Nav link */}
                      <Link
                        href={`/communities/${communityId}/discussions/${post.post_id}`}
                        className="inline-flex items-center space-x-1.5 text-accent-indigo hover:text-indigo-400 font-semibold transition"
                      >
                        <span>Replies & Thread</span>
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )
          ) : loadingResources ? (
            <div className="grid sm:grid-cols-2 gap-4">
              {[1, 2].map((n) => (
                <div key={n} className="h-44 bg-white/5 animate-pulse rounded-2xl border border-white/5" />
              ))}
            </div>
          ) : filteredResources.length === 0 ? (
            <div className="glass-card p-12 text-center text-sm text-indigo-200/40 border border-white/5 rounded-2xl">
              No shared documents found. Click Upload Document to share resource slides!
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {filteredResources.map((resource) => (
                <div
                  key={resource.post_id}
                  className="glass-card p-5 rounded-2xl border border-white/5 flex flex-col justify-between h-48 relative group hover:border-white/10 transition"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center space-x-2">
                        <div className="p-1.5 rounded-lg bg-accent-indigo/10 text-accent-indigo">
                          <FileText className="w-4 h-4" />
                        </div>
                        <h4 className="font-bold text-sm text-white line-clamp-1">
                          {resource.attachments?.[0]?.title || 'Shared Document'}
                        </h4>
                      </div>

                      {/* Delete */}
                      {(user?.role === 'Admin' || user?.user_id === resource.user_id) && (
                        <button
                          onClick={() => deleteMutation.mutate({ postId: resource.post_id, type: 'Resource' })}
                          disabled={deleteMutation.isPending}
                          className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                    <p className="text-xs text-indigo-200/50 line-clamp-3 leading-relaxed">
                      {resource.content}
                    </p>
                  </div>

                  <div className="space-y-3">
                    {/* Verification Status */}
                    <div className="text-[10px] flex items-center space-x-2">
                      {resource.status === 'Accepted' ? (
                        <span className="text-green-400 font-bold uppercase tracking-wider flex items-center space-x-1">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>AI Approved</span>
                        </span>
                      ) : resource.status === 'Rejected' ? (
                        <span className="text-red-400 font-bold uppercase tracking-wider flex items-center space-x-1">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>AI Rejected</span>
                        </span>
                      ) : (
                        <span className="text-yellow-400 font-bold uppercase tracking-wider animate-pulse flex items-center space-x-1">
                          <Clock className="w-3.5 h-3.5" />
                          <span>AI Verifying</span>
                        </span>
                      )}
                      <span className="text-indigo-300/30">•</span>
                      <span className="text-indigo-300/30">Uploaded by {resource.user?.full_name}</span>
                    </div>

                    {/* Action download */}
                    {resource.attachments?.[0]?.url && (
                      <a
                        href={resource.attachments[0].url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-2 rounded-xl bg-white/5 hover:bg-accent-indigo text-xs font-bold text-center text-indigo-100 hover:text-white transition flex items-center justify-center space-x-1.5 border border-white/5"
                      >
                        <FileDown className="w-4 h-4" />
                        <span>Download Slide / Doc</span>
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* New Discussion Modal */}
      <AnimatePresence>
        {isPostModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsPostModalOpen(false)}
              className="fixed inset-0 bg-black z-40"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="fixed top-0 right-0 bottom-0 w-full sm:w-[480px] glass-panel z-50 flex flex-col p-6 overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
                <div className="flex items-center space-x-2">
                  <MessageSquare className="w-6 h-6 text-accent-indigo" />
                  <span className="font-extrabold text-lg">New Discussion</span>
                </div>
                <button
                  onClick={() => setIsPostModalOpen(false)}
                  className="p-1.5 rounded-lg text-indigo-300/60 hover:text-white hover:bg-white/5 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleDiscussionSubmit} className="space-y-5 flex-grow">
                {/* Content */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-indigo-300/80">
                    Discussion Content
                  </label>
                  <textarea
                    name="content"
                    rows={6}
                    placeholder="Ask a question, share a midterm recap idea, or propose a syllabus reading group..."
                    className="w-full px-4 py-3 rounded-xl border border-white/10 bg-black/40 text-white placeholder-indigo-300/30 focus:outline-none focus:border-accent-indigo transition text-sm"
                    required
                  />
                </div>

                {/* File Attachment */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-indigo-300/80">
                    Attach Study Document (Optional)
                  </label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="file"
                      id="discussionFile"
                      onChange={(e) => setFileAttachment(e.target.files?.[0] || null)}
                      className="hidden"
                    />
                    <label
                      htmlFor="discussionFile"
                      className="px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition text-xs font-bold text-indigo-300 hover:text-white cursor-pointer flex items-center space-x-1.5"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Choose File</span>
                    </label>
                    <span className="text-xs text-indigo-200/50 truncate max-w-[200px]">
                      {fileAttachment ? fileAttachment.name : 'No file chosen'}
                    </span>
                  </div>
                </div>

                <div className="pt-6 border-t border-white/5 mt-auto">
                  <button
                    type="submit"
                    disabled={createDiscussionMutation.isPending}
                    className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-accent-indigo to-accent-violet hover:opacity-95 text-white font-semibold transition flex items-center justify-center space-x-2 shadow-[0_4px_15px_rgba(99,102,241,0.2)] disabled:opacity-50"
                  >
                    {createDiscussionMutation.isPending ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <span>Post Discussion</span>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Upload Resource Modal */}
      <AnimatePresence>
        {isResourceModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsResourceModalOpen(false)}
              className="fixed inset-0 bg-black z-40"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="fixed top-0 right-0 bottom-0 w-full sm:w-[480px] glass-panel z-50 flex flex-col p-6 overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
                <div className="flex items-center space-x-2">
                  <Upload className="w-6 h-6 text-accent-indigo" />
                  <span className="font-extrabold text-lg">Upload Resource</span>
                </div>
                <button
                  onClick={() => setIsResourceModalOpen(false)}
                  className="p-1.5 rounded-lg text-indigo-300/60 hover:text-white hover:bg-white/5 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleResourceSubmit} className="space-y-5 flex-grow">
                {/* Title */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-indigo-300/80">
                    Resource Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    placeholder="e.g., Lecture 5 - Backpropagation Proofs"
                    className="w-full px-4 py-3 rounded-xl border border-white/10 bg-black/40 text-white placeholder-indigo-300/30 focus:outline-none focus:border-accent-indigo transition text-sm"
                    required
                  />
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-indigo-300/80">
                    Description / Context
                  </label>
                  <textarea
                    name="description"
                    rows={4}
                    placeholder="Explain what is inside this document. Note pages, topics, summary..."
                    className="w-full px-4 py-3 rounded-xl border border-white/10 bg-black/40 text-white placeholder-indigo-300/30 focus:outline-none focus:border-accent-indigo transition text-sm"
                    required
                  />
                </div>

                {/* File Upload Zone */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-indigo-300/80">
                    Attached Document
                  </label>
                  <div className="border-2 border-dashed border-white/10 hover:border-accent-indigo/50 p-6 rounded-2xl text-center bg-black/20 transition cursor-pointer relative">
                    <input
                      type="file"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      onChange={(e) => setFileAttachment(e.target.files?.[0] || null)}
                      required
                    />
                    <div className="space-y-2">
                      <div className="w-10 h-10 rounded-full bg-accent-indigo/10 text-accent-indigo flex items-center justify-center mx-auto">
                        <Upload className="w-5 h-5" />
                      </div>
                      <div className="text-xs font-semibold text-white">Click or drag document to upload</div>
                      <div className="text-[10px] text-indigo-300/30">Supports PDF, DOCX, ZIP, JPG up to 10MB</div>
                    </div>
                  </div>
                  {fileAttachment && (
                    <div className="p-3 bg-white/5 border border-white/5 rounded-xl text-xs flex items-center justify-between text-indigo-200 mt-2">
                      <span className="truncate pr-4">{fileAttachment.name}</span>
                      <button
                        type="button"
                        onClick={() => setFileAttachment(null)}
                        className="text-red-400 hover:text-red-300"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>

                <div className="pt-6 border-t border-white/5 mt-auto">
                  <button
                    type="submit"
                    disabled={uploadResourceMutation.isPending}
                    className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-accent-indigo to-accent-violet hover:opacity-95 text-white font-semibold transition flex items-center justify-center space-x-2 shadow-[0_4px_15px_rgba(99,102,241,0.2)] disabled:opacity-50"
                  >
                    {uploadResourceMutation.isPending ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <span>Upload Resource</span>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* AI Processing Step Overlay */}
      <AnimatePresence>
        {aiProcessingState.isOpen && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-slate-900 border border-indigo-500/20 rounded-3xl p-6 relative overflow-hidden shadow-2xl"
            >
              {/* Outer top border glow */}
              <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-accent-indigo via-accent-violet to-accent-fuchsia" />

              {/* Scanning Core */}
              <div className="relative w-22 h-22 mx-auto mb-6 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-2 border-dashed border-accent-indigo/25 animate-spin [animation-duration:10s]" />
                <div className="absolute inset-2 rounded-full border border-dashed border-accent-violet/30 animate-spin [animation-duration:5s] [animation-direction:reverse]" />
                
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-accent-indigo to-accent-violet flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.4)] animate-pulse">
                  {aiProcessingState.status === 'success' ? (
                    <ShieldCheck className="w-6 h-6 text-white" />
                  ) : aiProcessingState.status === 'error' ? (
                    <AlertTriangle className="w-6 h-6 text-white animate-bounce" />
                  ) : (
                    <Loader2 className="w-6 h-6 text-white animate-spin" />
                  )}
                </div>
              </div>

              {/* Text header */}
              <div className="text-center space-y-2 mb-6">
                <h3 className="text-lg font-bold text-white">
                  {aiProcessingState.status === 'success'
                    ? 'AI Verification Complete!'
                    : aiProcessingState.status === 'error'
                    ? 'AI Verification Error'
                    : 'AI Gatekeeper Auditing...'}
                </h3>
                <p className="text-xs text-indigo-200/40">
                  {aiProcessingState.type === 'resource'
                    ? 'Analyzing academic resource for course relevance and spam check'
                    : 'Auditing forum post against community guidelines and similarity index'}
                </p>
              </div>

              {/* Steps progression */}
              <div className="space-y-4 mb-6">
                {(aiProcessingState.type === 'resource'
                  ? [
                      'Uploading file securely to storage bucket',
                      'Performing OCR parsing and text extraction',
                      'AI matching against community embeddings',
                      'Verifying compliance & indexing resource',
                    ]
                  : [
                      'Uploading post content to CampNexus sandbox',
                      'Analyzing text vectors & extracting tags',
                      'AI Gatekeeper relevance check',
                      'Publishing verified discussion thread',
                    ]
                ).map((stepText, index) => {
                  const stepNum = index + 1;
                  const isCompleted =
                    aiProcessingState.step > stepNum || aiProcessingState.status === 'success';
                  const isCurrent =
                    aiProcessingState.step === stepNum && aiProcessingState.status === 'processing';

                  return (
                    <div key={stepNum} className="flex items-center space-x-3.5">
                      <div className="flex-shrink-0">
                        {isCompleted ? (
                          <div className="p-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/10">
                            <CheckCircle className="w-3.5 h-3.5" />
                          </div>
                        ) : isCurrent ? (
                          <div className="p-1 rounded-full bg-accent-indigo/10 text-accent-indigo border border-accent-indigo/10">
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          </div>
                        ) : (
                          <div className="w-5.5 h-5.5 rounded-full bg-white/5 border border-white/5 text-[9px] font-bold text-indigo-300/30 flex items-center justify-center">
                            {stepNum}
                          </div>
                        )}
                      </div>
                      <span
                        className={`text-xs font-semibold transition-colors duration-300 ${
                          isCompleted
                            ? 'text-green-400'
                            : isCurrent
                            ? 'text-white'
                            : 'text-indigo-200/20'
                        }`}
                      >
                        {stepText}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Progress bar */}
              <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden mb-6">
                <div
                  className="h-full bg-gradient-to-r from-accent-indigo via-accent-violet to-accent-fuchsia transition-all duration-500"
                  style={{
                    width:
                      aiProcessingState.status === 'success'
                        ? '100%'
                        : aiProcessingState.status === 'error'
                        ? '100%'
                        : `${(aiProcessingState.step / 4) * 100}%`,
                    backgroundColor: aiProcessingState.status === 'error' ? '#ef4444' : undefined,
                  }}
                />
              </div>

              {/* Error messages and close button */}
              {aiProcessingState.status === 'error' && (
                <div className="space-y-4">
                  <p className="text-xs font-medium text-red-400 bg-red-500/5 border border-red-500/10 p-3 rounded-xl leading-relaxed">
                    {aiProcessingState.errorMsg}
                  </p>
                  <button
                    onClick={() =>
                      setAiProcessingState((prev) => ({ ...prev, isOpen: false, status: 'idle' }))
                    }
                    className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-white transition border border-white/5"
                  >
                    Dismiss
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

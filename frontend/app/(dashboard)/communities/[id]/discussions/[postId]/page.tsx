'use client';

import React, { useState, use } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import {
  MessageSquare,
  CornerDownRight,
  Send,
  Trash2,
  Clock,
  ArrowLeft,
  ShieldCheck,
  ShieldAlert,
  Hourglass,
  Loader2,
  ChevronDown,
  ChevronUp,
  FileText,
  Image as ImageIcon,
  ExternalLink,
  Lock,
} from 'lucide-react';
import Link from 'next/link';
import { discussionsApi } from '@/lib/api/discussions';
import { repliesApi } from '@/lib/api/replies';
import { communitiesApi } from '@/lib/api/communities';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { Post, Reply, Community } from '@/types';

interface PageProps {
  params: Promise<{ id: string; postId: string }>;
}

// Status badge for AI moderation result
function ModerationBadge({ status }: { status: string }) {
  if (status === 'Accepted') {
    return (
      <div className="flex items-center space-x-2 text-green-400 bg-green-500/5 border border-green-500/10 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
        <ShieldCheck className="w-4 h-4" />
        <span>AI Verified</span>
      </div>
    );
  }
  if (status === 'Rejected') {
    return (
      <div className="flex items-center space-x-2 text-red-400 bg-red-500/5 border border-red-500/10 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
        <ShieldAlert className="w-4 h-4" />
        <span>AI Rejected</span>
      </div>
    );
  }
  return (
    <div className="flex items-center space-x-2 text-yellow-400 bg-yellow-500/5 border border-yellow-500/10 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
      <Hourglass className="w-4 h-4 animate-pulse" />
      <span>Pending Review</span>
    </div>
  );
}

export default function DiscussionThreadPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const communityId = resolvedParams.id;
  const postId = resolvedParams.postId;
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  const [topLevelReplyText, setTopLevelReplyText] = useState('');
  const [activeReplyInputId, setActiveReplyInputId] = useState<string | null>(null);
  const [nestedReplyText, setNestedReplyText] = useState('');

  // Fetch the post directly by ID
  const { data: activePost, isLoading: loadingPost } = useQuery<Post>({
    queryKey: ['discussion', postId],
    queryFn: () => discussionsApi.getDiscussion(postId),
    retry: 1,
  });

  // Fetch top-level replies (parent_id = null)
  const { data: replies = [], isLoading: loadingReplies } = useQuery<Reply[]>({
    queryKey: ['replies', postId, 'root'],
    queryFn: () => repliesApi.getReplies(postId, null),
    enabled: !!postId,
  });

  // Fetch all communities to locate the active one and verify membership
  const { data: communities = [], isLoading: loadingCommunities } = useQuery<Community[]>({
    queryKey: ['communities'],
    queryFn: communitiesApi.getCommunities,
  });

  const activeCommunity = communities.find((c) => c.community_id === (activePost?.community_id || communityId));

  // Create Reply Mutation
  const createReplyMutation = useMutation({
    mutationFn: repliesApi.createReply,
    onSuccess: () => {
      toast.success('Reply added!');
      setTopLevelReplyText('');
      setNestedReplyText('');
      setActiveReplyInputId(null);
      queryClient.invalidateQueries({ queryKey: ['replies', postId] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.error || 'Failed to post reply.');
    },
  });

  // Delete Reply Mutation
  const deleteReplyMutation = useMutation({
    mutationFn: repliesApi.deleteReply,
    onSuccess: () => {
      toast.success('Reply deleted.');
      queryClient.invalidateQueries({ queryKey: ['replies', postId] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.error || 'Failed to delete reply.');
    },
  });

  const handlePostTopReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topLevelReplyText.trim()) return;
    createReplyMutation.mutate({ postId, content: topLevelReplyText, parent_id: null });
  };

  const handlePostNestedReply = (parentId: string) => {
    if (!nestedReplyText.trim()) return;
    createReplyMutation.mutate({ postId, content: nestedReplyText, parent_id: parentId });
  };

  // Recursive nested replies component
  const NestedRepliesContainer = ({ parentId, depth }: { parentId: string; depth: number }) => {
    const { data: childReplies = [], isLoading: loadingChildren } = useQuery<Reply[]>({
      queryKey: ['replies', postId, parentId],
      queryFn: () => repliesApi.getReplies(postId, parentId),
    });
    const [isExpanded, setIsExpanded] = useState(false);

    if (loadingChildren) return (
      <div className="pl-6 py-2 flex items-center space-x-1.5 text-xs text-indigo-300/30">
        <Loader2 className="w-3 h-3 animate-spin" />
        <span>Loading...</span>
      </div>
    );
    if (childReplies.length === 0) return null;

    return (
      <div className="mt-2 pl-4 sm:pl-6 border-l border-white/5 space-y-3">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center space-x-1 text-[10px] font-bold text-accent-indigo hover:text-indigo-400 tracking-wider uppercase transition"
        >
          {isExpanded ? (
            <><ChevronUp className="w-3 h-3" /><span>Hide ({childReplies.length})</span></>
          ) : (
            <><ChevronDown className="w-3 h-3" /><span>Show {childReplies.length} {childReplies.length === 1 ? 'reply' : 'replies'}</span></>
          )}
        </button>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-3 pt-1 overflow-hidden"
            >
              {childReplies.map((reply) => (
                <div key={reply.reply_id} className="space-y-2">
                  <div className="p-3 rounded-xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.02] flex justify-between relative group">
                    <div className="space-y-1.5 flex-1 pr-6">
                      <div className="flex items-center space-x-2 text-[10px] text-indigo-300/40">
                        <span className="font-bold text-white/80">{reply.user?.full_name}</span>
                        <span>•</span>
                        <span>{reply.user?.role}</span>
                        <span>•</span>
                        <span>{new Date(reply.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <p className="text-xs text-indigo-100/70 leading-relaxed">{reply.content}</p>
                    </div>
                    {(user?.role === 'Admin' || user?.user_id === reply.user_id) && (
                      <button
                        onClick={() => deleteReplyMutation.mutate(reply.reply_id)}
                        disabled={deleteReplyMutation.isPending}
                        className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 transition absolute right-2 top-2"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <div className="flex items-center space-x-3.5 pl-2">
                    <button
                      onClick={() => setActiveReplyInputId(activeReplyInputId === reply.reply_id ? null : reply.reply_id)}
                      className="text-[10px] font-bold text-indigo-200/50 hover:text-white uppercase transition"
                    >
                      Reply
                    </button>
                  </div>
                  {activeReplyInputId === reply.reply_id && (
                    <div className="flex gap-2 items-center pl-2">
                      <CornerDownRight className="w-4 h-4 text-indigo-300/40" />
                      <input
                        type="text"
                        placeholder={`Reply to ${reply.user?.full_name}...`}
                        value={nestedReplyText}
                        onChange={(e) => setNestedReplyText(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handlePostNestedReply(reply.reply_id)}
                        className="flex-grow px-3 py-1.5 rounded-lg border border-white/10 bg-black/40 text-xs text-white placeholder-indigo-300/30 focus:outline-none focus:border-accent-indigo transition"
                      />
                      <button
                        onClick={() => handlePostNestedReply(reply.reply_id)}
                        disabled={createReplyMutation.isPending || !nestedReplyText.trim()}
                        className="p-2 rounded-lg bg-accent-indigo hover:bg-accent-violet text-white transition disabled:opacity-50"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                  {depth < 3 && <NestedRepliesContainer parentId={reply.reply_id} depth={depth + 1} />}
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  if (loadingPost || loadingCommunities) {
    return (
      <div className="h-64 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-accent-indigo" />
      </div>
    );
  }

  if (!activePost || activePost.status !== 'Accepted') {
    return (
      <div className="glass-card p-8 text-center max-w-md mx-auto space-y-4">
        <h3 className="text-xl font-bold text-white">Post Not Found</h3>
        <p className="text-sm text-indigo-200/50">This thread has been removed or was not approved.</p>
        <Link
          href={`/communities/${communityId}`}
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-accent-indigo hover:bg-accent-violet transition font-semibold text-white text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Community</span>
        </Link>
      </div>
    );
  }

  if (!activeCommunity || !activeCommunity.role) {
    return (
      <div className="glass-card p-8 text-center max-w-md mx-auto space-y-4">
        <Lock className="w-12 h-12 text-red-400 mx-auto" />
        <h3 className="text-xl font-bold text-white">Community Access Restricted</h3>
        <p className="text-sm text-indigo-200/50">
          You must be a member of this community to view discussions and comments. Go to the Communities search to join.
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

  const attachment = activePost.attachments?.[0];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Back button */}
      <Link
        href={`/communities/${activePost?.community_id || communityId}`}
        className="inline-flex items-center space-x-2 text-sm text-indigo-200/60 hover:text-white transition font-medium"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Discussions</span>
      </Link>

      {/* Main Post Card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6 rounded-3xl border border-white/5"
      >
        {/* Author Header */}
        <div className="flex items-center space-x-3.5 mb-6">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-accent-indigo to-accent-violet flex items-center justify-center font-bold text-white text-sm border border-white/10">
            {activePost.user?.full_name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div>
            <div className="text-sm font-bold text-white">{activePost.user?.full_name}</div>
            <div className="text-xs text-indigo-300/40 flex items-center space-x-2">
              <span>{activePost.user?.role}</span>
              <span>•</span>
              <span className="flex items-center space-x-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{new Date(activePost.created_at).toLocaleString()}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          <p className="text-base text-indigo-100/80 leading-relaxed whitespace-pre-line break-words">
            {activePost.content}
          </p>

          {/* Attachment Preview */}
          {attachment && (
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between text-sm max-w-md">
              <div className="flex items-center space-x-2.5">
                {attachment.type === 'Image' ? (
                  <ImageIcon className="w-5 h-5 text-accent-violet" />
                ) : (
                  <FileText className="w-5 h-5 text-accent-indigo" />
                )}
                <div>
                  <span className="font-semibold text-white block truncate max-w-[200px] sm:max-w-xs">
                    {attachment.title}
                  </span>
                  <span className="text-[10px] text-indigo-300/30 uppercase font-bold">
                    {attachment.type}
                  </span>
                </div>
              </div>
              <a
                href={attachment.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl bg-white/5 hover:bg-accent-indigo text-indigo-300 hover:text-white transition"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          )}

          {/* Moderation Footer */}
          <div className="flex items-center justify-between border-t border-white/5 pt-5 mt-4">
            <ModerationBadge status={activePost.status} />
            {(user?.role === 'Admin' || user?.user_id === activePost.user_id) && (
              <button
                onClick={async () => {
                  try {
                    await discussionsApi.deleteDiscussion(postId);
                    toast.success('Discussion deleted.');
                    window.history.back();
                  } catch {
                    toast.error('Failed to delete discussion.');
                  }
                }}
                className="flex items-center space-x-1 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 px-3 py-1.5 rounded-xl transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Post</span>
              </button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Comment Section */}
      <div className="pt-4 border-t border-white/5">
        <h3 className="text-lg font-bold text-white flex items-center space-x-2">
          <MessageSquare className="w-5 h-5 text-accent-indigo" />
          <span>Comments ({replies.length})</span>
        </h3>
      </div>

      {/* New top-level comment input */}
      <form onSubmit={handlePostTopReply} className="flex gap-3">
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-accent-indigo to-accent-violet flex-shrink-0 flex items-center justify-center text-white text-xs font-bold border border-white/10">
          {user?.full_name?.charAt(0).toUpperCase() || 'U'}
        </div>
        <input
          type="text"
          placeholder="Write a comment..."
          value={topLevelReplyText}
          onChange={(e) => setTopLevelReplyText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handlePostTopReply(e as any)}
          className="flex-grow px-4 py-3.5 rounded-2xl border border-white/10 bg-black/40 text-sm text-white placeholder-indigo-300/30 focus:outline-none focus:border-accent-indigo transition"
        />
        <button
          type="submit"
          disabled={createReplyMutation.isPending || !topLevelReplyText.trim()}
          className="px-5 rounded-2xl bg-accent-indigo hover:bg-accent-violet text-white font-semibold transition flex items-center justify-center disabled:opacity-50 shadow-[0_4px_10px_rgba(99,102,241,0.2)]"
        >
          {createReplyMutation.isPending && !activeReplyInputId ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </button>
      </form>

      {/* Comments list */}
      {loadingReplies ? (
        <div className="space-y-4 pt-4">
          {[1, 2].map((n) => (
            <div key={n} className="h-16 bg-white/5 animate-pulse rounded-xl border border-white/5" />
          ))}
        </div>
      ) : replies.length === 0 ? (
        <div className="p-8 text-center text-xs text-indigo-200/30 italic">
          No comments yet. Be the first to reply!
        </div>
      ) : (
        <div className="space-y-4 pt-2">
          {replies.map((reply) => (
            <div key={reply.reply_id} className="space-y-2">
              <div className="p-4 rounded-2xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.02] transition flex justify-between relative group">
                <div className="space-y-2 flex-1 pr-8">
                  <div className="flex items-center space-x-2 text-[10px] text-indigo-300/40">
                    <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-accent-indigo/60 to-accent-violet/60 flex items-center justify-center text-[9px] font-bold text-white">
                      {reply.user?.full_name?.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-bold text-white/80">{reply.user?.full_name}</span>
                    <span>•</span>
                    <span>{reply.user?.role}</span>
                    <span>•</span>
                    <span>{new Date(reply.created_at).toLocaleDateString()}</span>
                  </div>
                  <p className="text-sm text-indigo-100/70 leading-relaxed break-words pl-7">{reply.content}</p>
                </div>
                {(user?.role === 'Admin' || user?.user_id === reply.user_id) && (
                  <button
                    onClick={() => deleteReplyMutation.mutate(reply.reply_id)}
                    disabled={deleteReplyMutation.isPending}
                    className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 transition absolute right-3 top-3"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Reply action */}
              <div className="flex items-center space-x-3.5 pl-3">
                <button
                  onClick={() => setActiveReplyInputId(activeReplyInputId === reply.reply_id ? null : reply.reply_id)}
                  className="text-[10px] font-bold text-indigo-200/50 hover:text-accent-indigo uppercase transition flex items-center space-x-1"
                >
                  <CornerDownRight className="w-3 h-3" />
                  <span>Reply</span>
                </button>
              </div>

              {/* Nested reply input */}
              {activeReplyInputId === reply.reply_id && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-2 items-center pl-3"
                >
                  <CornerDownRight className="w-4 h-4 text-indigo-300/40 flex-shrink-0" />
                  <input
                    type="text"
                    placeholder={`Reply to ${reply.user?.full_name}...`}
                    value={nestedReplyText}
                    onChange={(e) => setNestedReplyText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handlePostNestedReply(reply.reply_id)}
                    autoFocus
                    className="flex-grow px-3 py-2 rounded-xl border border-white/10 bg-black/40 text-xs text-white placeholder-indigo-300/30 focus:outline-none focus:border-accent-indigo transition"
                  />
                  <button
                    onClick={() => handlePostNestedReply(reply.reply_id)}
                    disabled={createReplyMutation.isPending || !nestedReplyText.trim()}
                    className="p-2 rounded-xl bg-accent-indigo hover:bg-accent-violet text-white transition disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </motion.div>
              )}

              {/* Recursive children */}
              <NestedRepliesContainer parentId={reply.reply_id} depth={1} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

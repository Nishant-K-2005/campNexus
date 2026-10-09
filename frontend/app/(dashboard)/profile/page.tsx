'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import {
  Award,
  BookOpen,
  Briefcase,
  Check,
  Edit,
  Mail,
  User,
  GraduationCap,
  Sparkles,
  Link as LinkIcon,
  ToggleLeft,
  ToggleRight,
  Plus,
  X,
  Shield,
  HelpCircle,
  Loader2,
} from 'lucide-react';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { authApi } from '@/lib/api/auth';

// Mock list of unlockable badges based on reputation points
const BADGES_LIST = [
  {
    id: 'badge-1',
    name: 'AI Verified Author',
    description: 'Submitted first discussion post approved by the AI moderation engine.',
    minPoints: 10,
    icon: Shield,
    color: 'from-blue-500 to-indigo-500',
  },
  {
    id: 'badge-2',
    name: 'Helpful Peer',
    description: 'Contributed 5+ discussion comments across study groups.',
    minPoints: 30,
    icon: BookOpen,
    color: 'from-emerald-500 to-teal-500',
  },
  {
    id: 'badge-3',
    name: 'Academic Guide',
    description: 'Enabled the mentoring status to support class peers.',
    minPoints: 50,
    icon: GraduationCap,
    color: 'from-violet-500 to-purple-500',
  },
  {
    id: 'badge-4',
    name: 'Top Resource Curator',
    description: 'Uploaded course study guides or lecture notes that reached 50+ reputation points.',
    minPoints: 100,
    icon: Award,
    color: 'from-amber-500 to-orange-500',
  },
];

export default function ProfilePage() {
  const { user, profile, updateProfileState } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);

  const [isSaving, setIsSaving] = useState(false);

  // Edit fields state
  const [bio, setBio] = useState(profile?.bio || '');
  const [portfolioLink, setPortfolioLink] = useState(profile?.portfolio_link || '');
  const [openToMentoring, setOpenToMentoring] = useState(profile?.open_to_mentoring || false);
  const [tagInput, setTagInput] = useState('');
  const [interestedTags, setInterestedTags] = useState<string[]>(profile?.interested_tags || []);

  useEffect(() => {
    if (profile) {
      setBio(profile.bio || '');
      setPortfolioLink(profile.portfolio_link || '');
      setOpenToMentoring(profile.open_to_mentoring || false);
      setInterestedTags(profile.interested_tags || []);
    }
  }, [profile, isEditing]);

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const trimmed = tagInput.trim().toLowerCase();
      if (trimmed && !interestedTags.includes(trimmed)) {
        setInterestedTags([...interestedTags, trimmed]);
        setTagInput('');
      }
    }
  };

  const handleRemoveTag = (tag: string) => {
    setInterestedTags(interestedTags.filter((t) => t !== tag));
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await authApi.updateProfile({
        bio: bio || null,
        portfolio_link: portfolioLink || null,
        open_to_mentoring: openToMentoring,
        interested_tags: interestedTags,
      });

      updateProfileState({
        bio: bio || null,
        portfolio_link: portfolioLink || null,
        open_to_mentoring: openToMentoring,
        interested_tags: interestedTags,
      });

      toast.success('Profile details saved successfully!');
      setIsEditing(false);
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.error || 'Failed to save profile details.');
    } finally {
      setIsSaving(false);
    }
  };

  // Calculate badge milestones
  const points = profile?.reputation_points || 0;
  const nextMilestone = BADGES_LIST.find((b) => b.minPoints > points) || { minPoints: 150, name: 'Elite Member' };
  const milestoneProgress = Math.min(100, (points / nextMilestone.minPoints) * 100);

  // Radial progress stroke calculator
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (milestoneProgress / 100) * circumference;

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Profile Overview Card */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl relative overflow-hidden border border-white/5 shadow-xl flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
        <div className="absolute top-0 right-0 w-80 h-80 bg-accent-indigo/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6 text-center md:text-left">
          {/* Avatar Icon */}
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-accent-indigo via-accent-violet to-accent-fuchsia flex items-center justify-center font-bold text-white text-3xl shadow-xl relative border border-white/10">
            {user?.full_name.charAt(0).toUpperCase()}
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{user?.full_name}</h1>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 text-xs text-indigo-200/50">
              <span className="px-2.5 py-1 bg-white/5 rounded-lg border border-white/5 text-white font-semibold">
                {user?.role}
              </span>
              <span>•</span>
              <span className="flex items-center space-x-1">
                <Mail className="w-3.5 h-3.5 text-indigo-400" />
                <span>{user?.email}</span>
              </span>
            </div>
            <p className="text-sm text-indigo-100/60 max-w-md italic leading-relaxed pt-1">
              {profile?.bio || 'No bio written yet. Click Edit Profile to update details!'}
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsEditing(!isEditing)}
          className="flex-shrink-0 flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 font-semibold text-sm transition"
        >
          <Edit className="w-4 h-4" />
          <span>{isEditing ? 'Cancel Edit' : 'Edit Profile'}</span>
        </button>
      </div>

      <div className="grid md:grid-cols-12 gap-8 items-start">
        {/* Left: Progress and Badges */}
        <div className="md:col-span-7 space-y-6">
          {/* Reputation Progress Ring */}
          <div className="glass-card p-6 rounded-2xl border border-white/5 flex items-center justify-between gap-6">
            <div className="space-y-2">
              <h3 className="font-bold text-white text-base">Academic Reputation</h3>
              <p className="text-xs text-indigo-200/50 leading-relaxed max-w-[200px] sm:max-w-xs">
                Contribute study documents and answer posts in your communities to unlock badges.
              </p>
              <div className="text-2xl font-black text-white pt-2">{points} Points</div>
              <div className="text-[10px] text-indigo-300/40">
                Next Milestone: {nextMilestone.name} ({nextMilestone.minPoints} pts)
              </div>
            </div>

            {/* Circular Progress Ring */}
            <div className="relative w-28 h-28 flex items-center justify-center flex-shrink-0">
              <svg className="w-full h-full transform -rotate-95">
                <circle
                  cx="56"
                  cy="56"
                  r={radius}
                  className="stroke-white/5"
                  strokeWidth="8"
                  fill="transparent"
                />
                <motion.circle
                  cx="56"
                  cy="56"
                  r={radius}
                  className="stroke-accent-indigo"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={circumference}
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset }}
                  transition={{ duration: 1, ease: 'easeOut' as const }}
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-base font-black text-white">{Math.round(milestoneProgress)}%</span>
                <span className="text-[9px] text-indigo-300/30 font-bold uppercase tracking-wider">Milestone</span>
              </div>
            </div>
          </div>

          {/* Badges Collection */}
          <div className="glass-card p-6 rounded-2xl border border-white/5 space-y-5">
            <h3 className="font-bold text-white text-base">Earned Badges</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {BADGES_LIST.map((badge) => {
                const isUnlocked = points >= badge.minPoints;
                const IconComponent = badge.icon;
                return (
                  <div
                    key={badge.id}
                    className={`p-4 rounded-xl border flex items-start space-x-3.5 relative overflow-hidden transition duration-200 ${
                      isUnlocked
                        ? 'border-white/10 bg-white/[0.01] hover:bg-white/[0.03]'
                        : 'border-white/5 bg-black/40 opacity-40'
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-tr text-white shadow ${badge.color}`}
                    >
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-white">{badge.name}</h4>
                      <p className="text-[10px] text-indigo-200/50 leading-normal mt-1">{badge.description}</p>
                    </div>
                    {!isUnlocked && (
                      <div className="absolute bottom-2 right-2 text-[9px] font-bold text-indigo-300/30">
                        {badge.minPoints} Points Required
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Edit Form or Details */}
        <div className="md:col-span-5 space-y-6">
          {isEditing ? (
            <form onSubmit={handleSaveProfile} className="glass-card p-6 rounded-2xl border border-white/10 space-y-5">
              <h3 className="font-extrabold text-white text-sm">Update Details</h3>

              {/* Bio */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-indigo-300/80">Bio</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                  disabled={isSaving}
                  placeholder="Share your academic research focus, syllabus interests, or study habits..."
                  className="w-full px-3 py-2 rounded-xl border border-white/10 bg-black/40 text-xs text-white placeholder-indigo-300/30 focus:outline-none focus:border-accent-indigo transition"
                />
              </div>

              {/* Portfolio Link */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-indigo-300/80">
                  Portfolio / GitHub Link
                </label>
                <input
                  type="url"
                  value={portfolioLink}
                  onChange={(e) => setPortfolioLink(e.target.value)}
                  disabled={isSaving}
                  placeholder="https://myportfolio.com"
                  className="w-full px-3 py-2 rounded-xl border border-white/10 bg-black/40 text-xs text-white placeholder-indigo-300/30 focus:outline-none focus:border-accent-indigo transition"
                />
              </div>

              {/* Open to mentoring */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                <div>
                  <span className="text-xs font-semibold text-white block">Open to Mentoring</span>
                  <span className="text-[10px] text-indigo-300/30">Allow peers to see you are available to help</span>
                </div>
                <button
                  type="button"
                  disabled={isSaving}
                  onClick={() => setOpenToMentoring(!openToMentoring)}
                  className="text-accent-indigo hover:text-indigo-300"
                >
                  {openToMentoring ? (
                    <ToggleRight className="w-8 h-8" />
                  ) : (
                    <ToggleLeft className="w-8 h-8 text-indigo-300/30" />
                  )}
                </button>
              </div>

              {/* Interested Tags */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-indigo-300/80">
                  Interested Topics
                </label>
                <input
                  type="text"
                  placeholder="Type topic and hit Enter"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleAddTag}
                  disabled={isSaving}
                  className="w-full px-3 py-2 rounded-xl border border-white/10 bg-black/40 text-xs text-white placeholder-indigo-300/30 focus:outline-none focus:border-accent-indigo transition"
                />
                <div className="flex flex-wrap gap-1 mt-2">
                  {interestedTags.map((tag) => (
                    <span
                      key={tag}
                      className="flex items-center space-x-1 px-2 py-0.5 rounded bg-accent-indigo/10 border border-accent-indigo/25 text-[10px] text-indigo-200"
                    >
                      <span>#{tag}</span>
                      <button type="button" disabled={isSaving} onClick={() => handleRemoveTag(tag)}>
                        <X className="w-2.5 h-2.5 text-indigo-300/60" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={isSaving}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-accent-indigo to-accent-violet hover:opacity-95 text-xs font-semibold text-white shadow-[0_4px_10px_rgba(99,102,241,0.2)] flex items-center justify-center space-x-2"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving Profile...</span>
                  </>
                ) : (
                  <span>Save Profile</span>
                )}
              </button>
            </form>
          ) : (
            <div className="glass-card p-6 rounded-2xl border border-white/5 space-y-5">
              <h3 className="font-bold text-white text-base">Academic Details</h3>

              <div className="space-y-3.5 text-xs">
                {/* Portfolio Link */}
                <div className="flex justify-between items-center py-2 border-b border-white/5">
                  <span className="text-indigo-200/50">Research Links:</span>
                  {profile?.portfolio_link ? (
                    <a
                      href={profile.portfolio_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent-indigo hover:underline flex items-center space-x-1"
                    >
                      <span>Portfolio</span>
                      <LinkIcon className="w-3.5 h-3.5" />
                    </a>
                  ) : (
                    <span className="text-indigo-300/20 italic">None added</span>
                  )}
                </div>

                {/* Mentoring Status */}
                <div className="flex justify-between items-center py-2 border-b border-white/5">
                  <span className="text-indigo-200/50">Mentoring Available:</span>
                  {profile?.open_to_mentoring ? (
                    <span className="text-green-400 font-semibold uppercase tracking-wider text-[10px] bg-green-500/10 px-2 py-0.5 rounded border border-green-500/10">
                      Yes
                    </span>
                  ) : (
                    <span className="text-indigo-300/30 uppercase tracking-wider text-[10px] bg-white/5 px-2 py-0.5 rounded border border-white/5">
                      No
                    </span>
                  )}
                </div>

                {/* Tags */}
                <div className="space-y-2">
                  <span className="text-indigo-200/50 block">Interested Topics:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {profile?.interested_tags && profile.interested_tags.length > 0 ? (
                      profile.interested_tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded bg-white/5 border border-white/5 text-[10px] text-indigo-300/50"
                        >
                          #{tag}
                        </span>
                      ))
                    ) : (
                      <span className="text-indigo-300/20 italic text-[11px]">No topics configured</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

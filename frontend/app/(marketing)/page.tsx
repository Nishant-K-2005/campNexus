'use client';

import React from 'react';
import Link from 'next/link';
import {Variants, motion } from 'framer-motion';
import { Shield, Users, BookOpen, Award, ArrowRight, CheckCircle, Sparkles } from 'lucide-react';

export default function LandingPage() {
  const  containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring' as const, stiffness: 80, damping: 15 },
    },
  };

  const floatVariants = {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 5,
        repeat: Infinity,
        ease: 'easeInOut' as const,
      },
    },
  };

  return (
    <div className="min-h-screen bg-background-dark flex flex-col selection:bg-accent-indigo selection:text-white">
      {/* Navigation Header */}
      <header className="border-b border-[rgba(255,255,255,0.06)] bg-[rgba(3,7,18,0.7)] backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-extrabold tracking-wider bg-gradient-to-r from-accent-indigo via-accent-violet to-accent-fuchsia bg-clip-text text-transparent">
              CAMPNEXUS
            </span>
          </Link>
          <div className="flex items-center space-x-4">
            <Link
              href="/login"
              className="text-sm font-medium text-indigo-200 hover:text-white transition duration-200"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="px-4 py-2 rounded-xl text-sm font-semibold bg-accent-indigo hover:bg-accent-violet transition duration-200 shadow-[0_0_15px_rgba(99,102,241,0.3)] hover:shadow-[0_0_20px_rgba(139,92,246,0.5)] border border-[rgba(255,255,255,0.1)] text-white"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-grow flex flex-col justify-center">
        <section className="relative pt-20 pb-24 overflow-hidden px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
          {/* Subtle Decorative Lights */}
          <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent-indigo/10 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-accent-fuchsia/10 rounded-full blur-[100px] pointer-events-none" />

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid lg:grid-cols-12 gap-12 items-center"
          >
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-8 text-left">
              <motion.div variants={itemVariants} className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full border border-indigo-500/20 bg-indigo-500/5 text-accent-indigo text-xs font-semibold tracking-wider uppercase">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Next-Gen Campus Hub</span>
              </motion.div>

              <motion.h1
                variants={itemVariants}
                className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] text-white"
              >
                Discover your <br />
                <span className="gradient-text">academic tribe.</span> <br />
                <span className="relative">
                  Verified by AI.
                  <span className="absolute bottom-1 left-0 w-full h-1 bg-gradient-to-r from-accent-indigo to-accent-fuchsia rounded-full" />
                </span>
              </motion.h1>

              <motion.p
                variants={itemVariants}
                className="text-lg text-indigo-100/70 max-w-xl leading-relaxed"
              >
                Connect with study groups, join moderated academic communities, share study resources, and earn reputation badges — backed by smart automated verification.
              </motion.p>

              <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/signup"
                  className="flex items-center justify-center space-x-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-accent-indigo to-accent-violet hover:opacity-95 transition font-semibold shadow-[0_4px_20px_rgba(99,102,241,0.4)] group text-white"
                >
                  <span>Join CampNexus</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/login"
                  className="flex items-center justify-center px-8 py-4 rounded-2xl border border-[rgba(255,255,255,0.08)] bg-white/5 hover:bg-white/10 transition font-semibold text-indigo-100"
                >
                  Explore Forums
                </Link>
              </motion.div>
            </div>

            {/* Right Card Mockup Column */}
            <motion.div
              variants={itemVariants}
              className="lg:col-span-5 flex justify-center"
            >
              <motion.div
                variants={floatVariants}
                animate="animate"
                className="w-full max-w-md glass-card rounded-3xl p-6 relative border border-[rgba(255,255,255,0.08)] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
              >
                {/* Glow Header */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent-indigo via-accent-violet to-accent-fuchsia" />

                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-3.5 h-3.5 rounded-full bg-red-500/80" />
                    <div className="w-3.5 h-3.5 rounded-full bg-yellow-500/80" />
                    <div className="w-3.5 h-3.5 rounded-full bg-green-500/80" />
                  </div>
                  <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full border border-green-500/20 bg-green-500/10 text-green-400 text-xs font-bold uppercase tracking-wider">
                    <Shield className="w-3 h-3" />
                    <span>AI Moderated</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start space-y-1 flex-col">
                    <div className="text-xs text-indigo-300/50 uppercase tracking-widest font-bold">Community Post</div>
                    <div className="text-lg font-bold text-white leading-snug">
                      Machine Learning Midterm Study Guide (CS-401)
                    </div>
                  </div>

                  <p className="text-sm text-indigo-100/70 leading-relaxed bg-white/5 p-4 rounded-xl border border-white/5">
                    Hey everyone! Here is my study guide for the exam next Wednesday. Attached the PDF file containing summarized regression proofs and backprop derivatives. Let's study!
                  </p>

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-accent-indigo to-accent-fuchsia flex items-center justify-center font-bold text-white text-sm">
                        JD
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">Jane Doe</div>
                        <div className="text-[10px] text-indigo-200/50">Computer Science Student</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 text-accent-indigo">
                      <Award className="w-4 h-4" />
                      <span className="text-xs font-bold">+15 Rep</span>
                    </div>
                  </div>

                  {/* Verification Status Overlay */}
                  <div className="mt-4 border-t border-[rgba(255,255,255,0.06)] pt-4 flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-1.5 text-green-400">
                      <CheckCircle className="w-4 h-4" />
                      <span className="font-semibold">Similarity Score: 98%</span>
                    </div>
                    <div className="text-indigo-300/60 font-semibold">Verified 2m ago</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </section>

        {/* Feature Grid Section */}
        <section className="border-t border-[rgba(255,255,255,0.06)] bg-black/20 py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-3xl mx-auto space-y-4 mb-20">
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                Everything you need to thrive academically
              </h2>
              <p className="text-indigo-200/60 text-base leading-relaxed">
                CampNexus bridges the gap between structured course learning and peer community support with automated features.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: Users,
                  title: 'Academic Tribe',
                  desc: 'Join specific departments, clubs, or study circles created specifically for your courses and interests.',
                },
                {
                  icon: Shield,
                  title: 'AI Moderation',
                  desc: 'Our similarity scanner checks posts for community alignment in real time to filter spam and plagiarism.',
                },
                {
                  icon: BookOpen,
                  title: 'Resource Sharing',
                  desc: 'Upload study notes, PDFs, or slides. Download verified documents shared by top-performing peers.',
                },
                {
                  icon: Award,
                  title: 'Gamified Reputation',
                  desc: 'Contribute high-value answers and resources to earn reputation points and unlock exclusive profile badges.',
                },
              ].map((feat, idx) => (
                <div
                  key={idx}
                  className="glass-card p-6 rounded-2xl border border-[rgba(255,255,255,0.06)] hover:border-accent-indigo/30 transition-all group"
                >
                  <div className="w-12 h-12 rounded-xl bg-accent-indigo/10 text-accent-indigo flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-accent-indigo/20 transition-transform">
                    <feat.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{feat.title}</h3>
                  <p className="text-sm text-indigo-100/60 leading-relaxed">{feat.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[rgba(255,255,255,0.06)] bg-black/45 py-8 text-center px-4 sm:px-6 lg:px-8 text-xs text-indigo-300/40">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>© {new Date().getFullYear()} CampNexus. All rights reserved.</div>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-white transition">Terms of Service</a>
            <a href="#" className="hover:text-white transition">Privacy Policy</a>
            <a href="#" className="hover:text-white transition">University Guidelines</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

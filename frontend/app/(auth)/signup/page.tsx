'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'react-hot-toast';
import { Loader2, Mail, Lock, User, Shield, Eye, EyeOff } from 'lucide-react';
import { authApi } from '@/lib/api/auth';
import { useAuthStore } from '@/lib/store/useAuthStore';

const ROLES = ['Student', 'Professor', 'Club Head'] as const;

const signupSchema = z.object({
  full_name: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  role: z.enum(ROLES, { message: 'Please select an academic role' }),
  pass: z.string().min(8, 'Password must be at least 8 characters'),
});

type SignupFormValues = z.infer<typeof signupSchema>;

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const redirectPath = searchParams.get('redirect') || '/dashboard';

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      full_name: '',
      email: '',
      role: 'Student',
      pass: '',
    },
  });

  const selectedRole = watch('role');

  const onSubmit = async (data: SignupFormValues) => {
    setIsSubmitting(true);
    try {
      const response = await authApi.signup(data);
      setAuth(response.user, response.profile);
      toast.success(response.message || 'Registration successful!');
      router.push(redirectPath);
    } catch (err: any) {
      console.error('Signup error:', err);
      const errMsg = err.response?.data?.error || 'Registration failed. Try again.';
      toast.error(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold tracking-tight">Create Account</h1>
        <p className="text-sm text-indigo-200/60">
          Scaffold your profile to connect with peers and faculty
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Full Name Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-indigo-300/80">
            Full Name
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-indigo-400">
              <User className="w-5 h-5" />
            </span>
            <input
              type="text"
              {...register('full_name')}
              placeholder="Alex Johnson"
              className={`w-full pl-11 pr-4 py-3 rounded-xl border bg-black/40 text-white placeholder-indigo-300/30 focus:outline-none transition duration-200 ${
                errors.full_name
                  ? 'border-red-500/50 focus:border-red-500'
                  : 'border-white/10 focus:border-accent-indigo'
              }`}
            />
          </div>
          {errors.full_name && (
            <p className="text-xs text-red-400 font-medium animate-slide-up">
              {errors.full_name.message}
            </p>
          )}
        </div>

        {/* Email Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-indigo-300/80">
            University Email
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-indigo-400">
              <Mail className="w-5 h-5" />
            </span>
            <input
              type="email"
              {...register('email')}
              placeholder="alex@university.edu"
              className={`w-full pl-11 pr-4 py-3 rounded-xl border bg-black/40 text-white placeholder-indigo-300/30 focus:outline-none transition duration-200 ${
                errors.email
                  ? 'border-red-500/50 focus:border-red-500'
                  : 'border-white/10 focus:border-accent-indigo'
              }`}
            />
          </div>
          {errors.email && (
            <p className="text-xs text-red-400 font-medium animate-slide-up">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Role Selector dropdown */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-indigo-300/80">
            Campus Role
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-indigo-400">
              <Shield className="w-5 h-5" />
            </span>
            <select
              value={selectedRole}
              onChange={(e) => setValue('role', e.target.value as any, { shouldValidate: true })}
              className={`w-full pl-11 pr-4 py-3 rounded-xl border bg-black/40 text-white placeholder-indigo-300/30 focus:outline-none transition duration-200 appearance-none ${
                errors.role
                  ? 'border-red-500/50 focus:border-red-500'
                  : 'border-white/10 focus:border-accent-indigo'
              }`}
            >
              <option value="Student" className="bg-slate-900 text-white">Student</option>
              <option value="Professor" className="bg-slate-900 text-white">Professor</option>
              <option value="Club Head" className="bg-slate-900 text-white">Club Head</option>
            </select>
            {/* Custom arrow down */}
            <span className="absolute inset-y-0 right-0 pr-4 flex items-center text-indigo-400 pointer-events-none">
              ▼
            </span>
          </div>
          {errors.role && (
            <p className="text-xs text-red-400 font-medium animate-slide-up">
              {errors.role.message}
            </p>
          )}
        </div>

        {/* Password Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-indigo-300/80">
            Password (Min 8 characters)
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-indigo-400">
              <Lock className="w-5 h-5" />
            </span>
            <input
              type={showPassword ? 'text' : 'password'}
              {...register('pass')}
              placeholder="••••••••"
              className={`w-full pl-11 pr-11 py-3 rounded-xl border bg-black/40 text-white placeholder-indigo-300/30 focus:outline-none transition duration-200 ${
                errors.pass
                  ? 'border-red-500/50 focus:border-red-500'
                  : 'border-white/10 focus:border-accent-indigo'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-indigo-400 hover:text-white"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {errors.pass && (
            <p className="text-xs text-red-400 font-medium animate-slide-up">
              {errors.pass.message}
            </p>
          )}
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-accent-indigo to-accent-violet hover:opacity-95 text-white font-semibold transition-all duration-200 flex items-center justify-center space-x-2 shadow-[0_4px_15px_rgba(99,102,241,0.2)] disabled:opacity-50"
        >
          {isSubmitting ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <span>Create Account</span>
          )}
        </button>
      </form>

      <div className="text-center text-sm text-indigo-200/50">
        Already have an account?{' '}
        <Link href="/login" className="text-accent-indigo hover:text-indigo-400 font-semibold transition">
          Sign In
        </Link>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-accent-indigo" />
        <p className="text-xs text-indigo-300/40">Loading signup portal...</p>
      </div>
    }>
      <SignupForm />
    </Suspense>
  );
}

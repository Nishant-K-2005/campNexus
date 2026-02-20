"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/authStore";
import { Loader, User, Mail, Lock } from "lucide-react";
import { motion } from "framer-motion";

const LoginPage = () => {
  const router = useRouter();

  const { isLoading, user, login: loginUser } = useAuthStore();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "Student",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email is invalid";

    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 8)
      newErrors.password = "Password must be at least 8 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await loginUser({
        email: formData.email,
        pass: formData.password,
      });
    } catch (error) {
      // Error is handled in the store
      console.error('Login failed:', error);
    }
  };

  useEffect(() => {
    if (user?.role) {
      switch (user.role) {
        case "Student":
          router.push("/student");
          break;
        case "Professor":
          router.push("/professor");
          break;
        case "Admin":
          router.push("/admin");
          break;
        default:
          router.push("/auth/login");
      }
    }
  }, [user, router]);

  return (
    <div className="min-h-screen bg-[#060B1A] text-white overflow-hidden relative flex items-center justify-center px-4">
      {/* Background blobs */}
      <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 blur-3xl opacity-30 pointer-events-none">
        <div className="aspect-square h-[650px] rounded-full bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-400" />
      </div>

      <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 blur-3xl opacity-20 pointer-events-none">
        <div className="aspect-square h-[520px] rounded-full bg-gradient-to-tr from-cyan-500 to-indigo-600" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md rounded-2xl bg-white/5 border border-white/10 shadow-xl shadow-indigo-500/10 backdrop-blur p-6 sm:p-8 relative overflow-hidden"
      >
        <div className="relative">
          {/* Header */}
          <div className="text-center mb-8">
           
            <h1 className="mt-4 text-2xl font-extrabold">
              CampNexus
            </h1>
            <p className="text-slate-300 mt-2 text-sm">
              Sign in to your account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-slate-200">
                Select Role
              </label>
              <div className="mt-1 relative rounded-xl">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 border border-white/10 rounded-xl bg-[#0B122A]/70 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                >
                  <option value="Student">Student</option>
                  <option value="Professor">Professor</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-200">
                Email Address
              </label>
              <div className="mt-1 relative rounded-xl">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className={`block w-full pl-10 pr-3 py-3 border rounded-xl bg-[#0B122A]/70 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
                    errors.email ? "border-red-400/40" : "border-white/10"
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-sm text-red-200 mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-slate-200">
                Password
              </label>
              <div className="mt-1 relative rounded-xl">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className={`block w-full pl-10 pr-3 py-3 border rounded-xl bg-[#0B122A]/70 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
                    errors.password ? "border-red-400/40" : "border-white/10"
                  }`}
                />
              </div>
              {errors.password && (
                <p className="text-sm text-red-200 mt-1">{errors.password}</p>
              )}
            </div>

            {/* Forgot Password */}
            <div className="text-right">
              <Link
                href="/forgot-password"
                className="text-sm text-indigo-300 hover:text-indigo-200"
              >
                Forgot your password?
              </Link>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full inline-flex items-center justify-center py-3 px-4 rounded-xl text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 border border-indigo-400/20 shadow-lg shadow-indigo-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader className="animate-spin mr-2 h-5 w-5 text-white" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Bottom link */}
          <div className="mt-6 text-center text-sm text-slate-300">
            Don&apos;t have an account?{" "}
            <Link
              href="/auth/signup"
              className="font-medium text-indigo-300 hover:text-indigo-200"
            >
              Sign up
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;

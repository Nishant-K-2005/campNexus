"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/authStore";
import { Loader, Mail, Lock, Eye, EyeOff, GraduationCap } from "lucide-react";
import { motion } from "framer-motion";
import ThemeToggle from "@/components/ThemeToggle";

const LoginPage = () => {
  const router = useRouter();
  const { isLoading, user, login: loginUser } = useAuthStore();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "Student",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Please enter a valid email";
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
      await loginUser({ email: formData.email, pass: formData.password });
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  useEffect(() => {
    if (user?.role) {
      switch (user.role) {
        case "Student": router.push("/student"); break;
        case "Professor": router.push("/professor"); break;
        case "Admin": router.push("/admin"); break;
        default: router.push("/auth/login");
      }
    }
  }, [user, router]);

  const roles = ["Student", "Professor", "Admin"];

  return (
    <div
      className="min-h-screen flex"
      style={{ background: "var(--cn-bg)", color: "var(--cn-text)" }}
    >
      {/* ─── LEFT PANEL (Branding) ─── */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="hidden lg:flex lg:w-[55%] xl:w-[60%] relative flex-col justify-between p-12 overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0F172A 0%, #1E1B4B 50%, #0F172A 100%)" }}
      >
        {/* Animated mesh orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full opacity-30"
            style={{
              background: "radial-gradient(circle, #6366F1 0%, transparent 70%)",
              filter: "blur(60px)",
              animation: "cn-float 6s ease-in-out infinite",
            }}
          />
          <div
            className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full opacity-20"
            style={{
              background: "radial-gradient(circle, #22D3EE 0%, transparent 70%)",
              filter: "blur(80px)",
              animation: "cn-float 8s ease-in-out infinite reverse",
            }}
          />
          <div
            className="absolute top-[40%] right-[20%] w-[300px] h-[300px] rounded-full opacity-15"
            style={{
              background: "radial-gradient(circle, #A78BFA 0%, transparent 70%)",
              filter: "blur(50px)",
              animation: "cn-float 5s ease-in-out infinite 1s",
            }}
          />
          {/* Grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
        </div>

        {/* Logo */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #6366F1, #818CF8)" }}
            >
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">CampNexus</span>
          </div>
        </div>

        {/* Hero text */}
        <div className="relative z-10 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
          >
            <h1 className="text-4xl xl:text-5xl font-bold text-white leading-tight">
              Your campus,<br />
              <span style={{ background: "linear-gradient(135deg, #818CF8, #22D3EE)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                connected.
              </span>
            </h1>
            <p className="mt-4 text-lg" style={{ color: "#94A3B8" }}>
              The all-in-one platform for campus communities, discussions, and academic resources.
            </p>
          </motion.div>

          {/* Feature pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="flex flex-wrap gap-2"
          >
            {["🏛️ Communities", "📣 Declarations", "💬 Discussions", "📚 Resources"].map((item) => (
              <span
                key={item}
                className="px-3 py-1.5 rounded-full text-sm font-medium"
                style={{
                  background: "rgba(99,102,241,0.15)",
                  border: "1px solid rgba(99,102,241,0.3)",
                  color: "#A5B4FC",
                }}
              >
                {item}
              </span>
            ))}
          </motion.div>

          {/* Testimonial */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="p-5 rounded-2xl"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <p className="text-sm italic" style={{ color: "#CBD5E1" }}>
              "CampNexus completely transformed how our university community collaborates. Everything in one place."
            </p>
            <div className="mt-3 flex items-center gap-2">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
                style={{ background: "linear-gradient(135deg, #6366F1, #8B5CF6)" }}
              >
                A
              </div>
              <div>
                <p className="text-xs font-medium text-white">Aanya Sharma</p>
                <p className="text-xs" style={{ color: "#64748B" }}>Student, IIT Delhi</p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* ─── RIGHT PANEL (Form) ─── */}
      <div
        className="w-full lg:w-[45%] xl:w-[40%] flex flex-col"
        style={{ background: "var(--cn-bg)" }}
      >
        {/* Top bar */}
        <div className="flex justify-between items-center p-6">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 lg:hidden">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #6366F1, #818CF8)" }}
            >
              <GraduationCap className="w-4 h-4 text-white" />
            </div>
            <span className="text-base font-bold" style={{ color: "var(--cn-text)" }}>CampNexus</span>
          </div>
          <div className="hidden lg:block" />
          <ThemeToggle />
        </div>

        {/* Form area */}
        <div className="flex-1 flex items-center justify-center px-6 pb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-full max-w-sm"
          >
            {/* Header */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold" style={{ color: "var(--cn-text)" }}>
                Welcome back 👋
              </h2>
              <p className="mt-1.5 text-sm" style={{ color: "var(--cn-text-3)" }}>
                Sign in to your CampNexus account
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Role selector */}
              <div>
                <label className="cn-label">Sign in as</label>
                <div className="grid grid-cols-3 gap-2 mt-1">
                  {roles.map((role) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => setFormData((p) => ({ ...p, role }))}
                      className="py-2 px-3 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer"
                      style={{
                        background: formData.role === role ? "var(--cn-primary)" : "var(--cn-surface)",
                        color: formData.role === role ? "white" : "var(--cn-text-3)",
                        border: `1.5px solid ${formData.role === role ? "var(--cn-primary)" : "var(--cn-border)"}`,
                        transform: formData.role === role ? "scale(1.02)" : "scale(1)",
                      }}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="cn-label" htmlFor="login-email">Email address</label>
                <div className="relative">
                  <Mail
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                    style={{ color: "var(--cn-text-4)" }}
                  />
                  <input
                    id="login-email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@university.edu"
                    className="cn-input pl-10"
                    style={{
                      borderColor: errors.email ? "var(--cn-danger)" : undefined,
                      boxShadow: errors.email ? "0 0 0 3px rgba(239,68,68,0.1)" : undefined,
                    }}
                  />
                </div>
                {errors.email && (
                  <p className="text-xs mt-1" style={{ color: "var(--cn-danger)" }}>{errors.email}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <div className="flex justify-between items-center">
                  <label className="cn-label" htmlFor="login-password">Password</label>
                  <Link
                    href="/forgot-password"
                    className="text-xs font-medium transition-colors"
                    style={{ color: "var(--cn-primary)" }}
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                    style={{ color: "var(--cn-text-4)" }}
                  />
                  <input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="cn-input pl-10 pr-10"
                    style={{
                      borderColor: errors.password ? "var(--cn-danger)" : undefined,
                      boxShadow: errors.password ? "0 0 0 3px rgba(239,68,68,0.1)" : undefined,
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                    style={{ color: "var(--cn-text-4)" }}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs mt-1" style={{ color: "var(--cn-danger)" }}>{errors.password}</p>
                )}
              </div>

              {/* Remember me */}
              <div className="flex items-center gap-2">
                <input
                  id="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded cursor-pointer"
                  style={{ accentColor: "var(--cn-primary)" }}
                />
                <label
                  htmlFor="remember-me"
                  className="text-xs cursor-pointer select-none"
                  style={{ color: "var(--cn-text-3)" }}
                >
                  Remember me for 30 days
                </label>
              </div>

              {/* Submit */}
              <motion.button
                type="submit"
                disabled={isLoading}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 transition-all duration-200"
                style={{
                  background: isLoading ? "var(--cn-text-4)" : "linear-gradient(135deg, var(--cn-primary), #818CF8)",
                  boxShadow: isLoading ? "none" : "0 4px 20px rgba(99,102,241,0.4)",
                  cursor: isLoading ? "not-allowed" : "pointer",
                }}
              >
                {isLoading ? (
                  <>
                    <Loader className="cn-animate-spin w-4 h-4" />
                    Signing in...
                  </>
                ) : (
                  "Sign In →"
                )}
              </motion.button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center gap-3">
              <div className="flex-1 h-px" style={{ background: "var(--cn-border)" }} />
              <span className="text-xs" style={{ color: "var(--cn-text-4)" }}>or</span>
              <div className="flex-1 h-px" style={{ background: "var(--cn-border)" }} />
            </div>

            {/* Bottom link */}
            <p className="text-center text-sm" style={{ color: "var(--cn-text-3)" }}>
              Don&apos;t have an account?{" "}
              <Link
                href="/auth/signup"
                className="font-semibold transition-colors"
                style={{ color: "var(--cn-primary)" }}
              >
                Create account
              </Link>
            </p>

            <p className="text-center text-xs mt-8" style={{ color: "var(--cn-text-4)" }}>
              By signing in, you agree to our{" "}
              <a href="#" style={{ color: "var(--cn-primary)" }}>Terms</a> and{" "}
              <a href="#" style={{ color: "var(--cn-primary)" }}>Privacy Policy</a>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

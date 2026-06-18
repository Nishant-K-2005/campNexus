"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/authStore";
import { Loader, Mail, Lock, Eye, EyeOff, User, GraduationCap, BookOpen, Users, Shield } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ThemeToggle from "@/components/ThemeToggle";
import AuthShell from "@/components/auth/AuthShell";

const roleOptions = [
  {
    value: "Student",
    label: "Student",
    icon: GraduationCap,
    desc: "Access courses & communities",
    color: "#6366F1",
    bg: "rgba(99,102,241,0.1)",
  },
  {
    value: "Professor",
    label: "Professor",
    icon: BookOpen,
    desc: "Manage courses & students",
    color: "#10B981",
    bg: "rgba(16,185,129,0.1)",
  },
  {
    value: "ClubHead",
    label: "Club Head",
    icon: Users,
    desc: "Run campus communities",
    color: "#F59E0B",
    bg: "rgba(245,158,11,0.1)",
  },
  {
    value: "Admin",
    label: "Administrator",
    icon: Shield,
    desc: "Full platform access",
    color: "#EF4444",
    bg: "rgba(239,68,68,0.1)",
  },
];

export default function SignupPage() {
  const router = useRouter();
  const { isLoading, user, error, signup: signupUser } = useAuthStore();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "Student",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [step, setStep] = useState(1); // 1 = role select, 2 = form

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Full name is required";
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Please enter a valid email";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 8)
      newErrors.password = "Password must be at least 8 characters";
    if (!formData.confirmPassword) newErrors.confirmPassword = "Please confirm your password";
    else if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      await signupUser({
        email: formData.email,
        pass: formData.password,
        full_name: formData.name,
        role: formData.role === "ClubHead" ? "Club Head" : formData.role,
      });
    } catch (error) {
      console.error("Signup failed:", error);
    }
  };

  useEffect(() => {
    if (user?.role) {
      router.push("/dashboard");
    }
  }, [user, router]);

  const selectedRole = roleOptions.find((r) => r.value === formData.role);

  return (
    <AuthShell mode="signup">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold" style={{ color: "var(--cn-text)" }}>
          Create your account
        </h1>
        <p className="mt-2 text-sm" style={{ color: "var(--cn-text-3)" }}>
          Join students, professors, and campus leaders on CampNexus
        </p>
      </div>

      <div
        className="rounded-2xl p-6"
        style={{
          background: "var(--cn-card)",
          border: "1px solid var(--cn-border)",
          boxShadow: "var(--cn-shadow-lg)",
        }}
      >
            {/* Step indicator */}
            <div className="flex items-center gap-2 mb-6">
              {[1, 2].map((s) => (
                <div key={s} className="flex items-center gap-2">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300"
                    style={{
                      background: step >= s ? "var(--cn-primary)" : "var(--cn-surface-2)",
                      color: step >= s ? "white" : "var(--cn-text-4)",
                    }}
                  >
                    {s}
                  </div>
                  {s === 1 && (
                    <>
                      <span className="text-xs font-medium" style={{ color: step >= s ? "var(--cn-primary)" : "var(--cn-text-4)" }}>
                        Choose Role
                      </span>
                      <div className="w-12 h-px" style={{ background: "var(--cn-border)" }} />
                    </>
                  )}
                  {s === 2 && (
                    <span className="text-xs font-medium" style={{ color: step >= s ? "var(--cn-primary)" : "var(--cn-text-4)" }}>
                      Your Details
                    </span>
                  )}
                </div>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {step === 1 ? (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="text-sm font-medium mb-4" style={{ color: "var(--cn-text-2)" }}>
                    I am a...
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {roleOptions.map((role) => {
                      const Icon = role.icon;
                      const isSelected = formData.role === role.value;
                      return (
                        <button
                          key={role.value}
                          type="button"
                          onClick={() => setFormData((p) => ({ ...p, role: role.value }))}
                          className="p-4 rounded-xl text-left transition-all duration-200 cursor-pointer"
                          style={{
                            background: isSelected ? role.bg : "var(--cn-surface)",
                            border: `2px solid ${isSelected ? role.color : "var(--cn-border)"}`,
                            transform: isSelected ? "scale(1.02)" : "scale(1)",
                            boxShadow: isSelected ? `0 4px 16px ${role.bg}` : "none",
                          }}
                        >
                          <div
                            className="w-9 h-9 rounded-lg flex items-center justify-center mb-3"
                            style={{ background: role.bg }}
                          >
                            <Icon className="w-4.5 h-4.5" style={{ color: role.color, width: 18, height: 18 }} />
                          </div>
                          <p
                            className="text-sm font-semibold"
                            style={{ color: isSelected ? role.color : "var(--cn-text)" }}
                          >
                            {role.label}
                          </p>
                          <p className="text-xs mt-0.5" style={{ color: "var(--cn-text-4)" }}>
                            {role.desc}
                          </p>
                          {isSelected && (
                            <div
                              className="mt-2 w-4 h-4 rounded-full flex items-center justify-center text-white text-xs"
                              style={{ background: role.color }}
                            >
                              ✓
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setStep(2)}
                    className="w-full mt-6 py-3 rounded-xl text-sm font-semibold text-white"
                    style={{
                      background: "linear-gradient(135deg, var(--cn-primary), #818CF8)",
                      boxShadow: "0 4px 20px rgba(99,102,241,0.4)",
                      cursor: "pointer",
                    }}
                  >
                    Continue as {selectedRole?.label} →
                  </motion.button>
                </motion.div>
              ) : (
                <motion.form
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={handleSubmit}
                  className="space-y-4"
                >
                  {/* Selected role badge */}
                  <div
                    className="flex items-center gap-2 p-3 rounded-xl"
                    style={{ background: "var(--cn-surface)", border: "1px solid var(--cn-border)" }}
                  >
                    {selectedRole && (
                      <>
                        <selectedRole.icon
                          className="w-4 h-4"
                          style={{ color: selectedRole.color, width: 16, height: 16 }}
                        />
                        <span className="text-sm font-medium" style={{ color: "var(--cn-text-2)" }}>
                          Signing up as <strong style={{ color: selectedRole.color }}>{selectedRole.label}</strong>
                        </span>
                      </>
                    )}
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="ml-auto text-xs cursor-pointer transition-colors"
                      style={{ color: "var(--cn-primary)" }}
                    >
                      Change
                    </button>
                  </div>

                  {/* Full Name */}
                  <div>
                    <label className="cn-label" htmlFor="signup-name">Full Name</label>
                    <div className="relative">
                      <User
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                        style={{ color: "var(--cn-text-4)" }}
                      />
                      <input
                        id="signup-name"
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Your full name"
                        className="cn-input pl-10"
                        style={{
                          borderColor: errors.name ? "var(--cn-danger)" : undefined,
                          boxShadow: errors.name ? "0 0 0 3px rgba(239,68,68,0.1)" : undefined,
                        }}
                      />
                    </div>
                    {errors.name && <p className="text-xs mt-1" style={{ color: "var(--cn-danger)" }}>{errors.name}</p>}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="cn-label" htmlFor="signup-email">Email Address</label>
                    <div className="relative">
                      <Mail
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                        style={{ color: "var(--cn-text-4)" }}
                      />
                      <input
                        id="signup-email"
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
                    {errors.email && <p className="text-xs mt-1" style={{ color: "var(--cn-danger)" }}>{errors.email}</p>}
                  </div>

                  {/* Password */}
                  <div>
                    <label className="cn-label" htmlFor="signup-password">Password</label>
                    <div className="relative">
                      <Lock
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                        style={{ color: "var(--cn-text-4)" }}
                      />
                      <input
                        id="signup-password"
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Min. 8 characters"
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
                    {errors.password && <p className="text-xs mt-1" style={{ color: "var(--cn-danger)" }}>{errors.password}</p>}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="cn-label" htmlFor="signup-confirm">Confirm Password</label>
                    <div className="relative">
                      <Lock
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                        style={{ color: "var(--cn-text-4)" }}
                      />
                      <input
                        id="signup-confirm"
                        type={showConfirm ? "text" : "password"}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Repeat your password"
                        className="cn-input pl-10 pr-10"
                        style={{
                          borderColor: errors.confirmPassword ? "var(--cn-danger)" : (formData.confirmPassword && formData.password === formData.confirmPassword ? "var(--cn-success)" : undefined),
                          boxShadow: errors.confirmPassword ? "0 0 0 3px rgba(239,68,68,0.1)" : (formData.confirmPassword && formData.password === formData.confirmPassword ? "0 0 0 3px rgba(16,185,129,0.1)" : undefined),
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirm(!showConfirm)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                        style={{ color: "var(--cn-text-4)" }}
                      >
                        {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {errors.confirmPassword && <p className="text-xs mt-1" style={{ color: "var(--cn-danger)" }}>{errors.confirmPassword}</p>}
                    {!errors.confirmPassword && formData.confirmPassword && formData.password === formData.confirmPassword && (
                      <p className="text-xs mt-1" style={{ color: "var(--cn-success)" }}>✓ Passwords match</p>
                    )}
                  </div>

                  <div className="flex gap-3 pt-1">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="flex-none py-3 px-5 rounded-xl text-sm font-semibold transition-all cursor-pointer"
                      style={{
                        background: "var(--cn-surface)",
                        border: "1.5px solid var(--cn-border)",
                        color: "var(--cn-text-2)",
                      }}
                    >
                      ← Back
                    </button>
                    <motion.button
                      type="submit"
                      disabled={isLoading}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 py-3 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 transition-all"
                      style={{
                        background: isLoading ? "var(--cn-text-4)" : "linear-gradient(135deg, var(--cn-primary), #818CF8)",
                        boxShadow: isLoading ? "none" : "0 4px 20px rgba(99,102,241,0.4)",
                        cursor: isLoading ? "not-allowed" : "pointer",
                      }}
                    >
                      {isLoading ? (
                        <>
                          <Loader className="cn-animate-spin w-4 h-4" />
                          Creating...
                        </>
                      ) : (
                        "Create Account →"
                      )}
                    </motion.button>
                  </div>

                  <p className="text-center text-xs" style={{ color: "var(--cn-text-4)" }}>
                    By creating an account, you agree to our{" "}
                    <a href="#" style={{ color: "var(--cn-primary)" }}>Terms</a> and{" "}
                    <a href="#" style={{ color: "var(--cn-primary)" }}>Privacy Policy</a>
                  </p>
                </motion.form>
              )}
            </AnimatePresence>
          </div>

      <p className="text-center text-sm mt-4" style={{ color: "var(--cn-text-3)" }}>
        Already have an account?{" "}
        <Link href="/auth/login" className="font-semibold" style={{ color: "var(--cn-primary)" }}>
          Sign in
        </Link>
      </p>
    </AuthShell>
  );
}

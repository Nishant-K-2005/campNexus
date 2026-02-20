"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/authStore";
import ProtectedRoute from "@/components/ProtectedRoute";
import { BookOpen, Users, Calendar, Award, LogOut } from "lucide-react";

export default function StudentDashboard() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "Student") {
      router.push("/auth/login");
    }
  }, [isAuthenticated, user, router]);

  const handleLogout = async () => {
    await logout();
    router.push("/auth/login");
  };

  if (!isAuthenticated || user?.role !== "Student") {
    return <div className="min-h-screen bg-[#060B1A] flex items-center justify-center">
      <div className="text-white">Loading...</div>
    </div>;
  }

  return (
    <ProtectedRoute allowedRoles={["Student"]}>
      <div className="min-h-screen bg-[#060B1A] text-white">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-indigo-500/20 blur-[120px]" />
        <div className="absolute top-40 -left-40 h-[520px] w-[520px] rounded-full bg-fuchsia-500/20 blur-[120px]" />
      </div>

      {/* Header */}
      <header className="relative border-b border-white/10 backdrop-blur">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold">CampNexus</h1>
            <span className="text-slate-400">Student Dashboard</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-slate-300">Welcome, {user?.full_name}</span>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Stats Cards */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur">
            <div className="flex items-center justify-between mb-4">
              <BookOpen className="w-8 h-8 text-indigo-400" />
              <span className="text-2xl font-bold">12</span>
            </div>
            <h3 className="text-slate-300">Courses</h3>
            <p className="text-sm text-slate-400">Active enrollments</p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur">
            <div className="flex items-center justify-between mb-4">
              <Users className="w-8 h-8 text-green-400" />
              <span className="text-2xl font-bold">8</span>
            </div>
            <h3 className="text-slate-300">Clubs</h3>
            <p className="text-sm text-slate-400">Member of</p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur">
            <div className="flex items-center justify-between mb-4">
              <Calendar className="w-8 h-8 text-blue-400" />
              <span className="text-2xl font-bold">24</span>
            </div>
            <h3 className="text-slate-300">Events</h3>
            <p className="text-sm text-slate-400">Upcoming</p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur">
            <div className="flex items-center justify-between mb-4">
              <Award className="w-8 h-8 text-yellow-400" />
              <span className="text-2xl font-bold">3</span>
            </div>
            <h3 className="text-slate-300">Achievements</h3>
            <p className="text-sm text-slate-400">Earned</p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur">
            <h2 className="text-xl font-semibold mb-4">Recent Courses</h2>
            <div className="space-y-3">
              {["Web Development", "Data Science", "Machine Learning"].map((course, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <span className="text-slate-300">{course}</span>
                  <span className="text-sm text-indigo-400">75% Complete</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur">
            <h2 className="text-xl font-semibold mb-4">Upcoming Events</h2>
            <div className="space-y-3">
              {["Hackathon 2024", "Tech Talk: AI", "Club Meeting"].map((event, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <span className="text-slate-300">{event}</span>
                  <span className="text-sm text-green-400">In {index + 1} days</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
    </ProtectedRoute>
  );
}

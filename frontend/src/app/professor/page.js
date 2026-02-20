"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/authStore";
import ProtectedRoute from "@/components/ProtectedRoute";
import { BookOpen, Users, Calendar, Award, LogOut, FileText, BarChart } from "lucide-react";

export default function TeacherDashboard() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "Teacher") {
      router.push("/auth/login");
    }
  }, [isAuthenticated, user, router]);

  const handleLogout = async () => {
    await logout();
    router.push("/auth/login");
  };

  if (!isAuthenticated || user?.role !== "Teacher") {
    return <div className="min-h-screen bg-[#060B1A] flex items-center justify-center">
      <div className="text-white">Loading...</div>
    </div>;
  }

  return (
    <ProtectedRoute allowedRoles={["Teacher"]}>
      <div className="min-h-screen bg-[#060B1A] text-white">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-green-500/20 blur-[120px]" />
        <div className="absolute top-40 -left-40 h-[520px] w-[520px] rounded-full bg-blue-500/20 blur-[120px]" />
      </div>

      {/* Header */}
      <header className="relative border-b border-white/10 backdrop-blur">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold">CampNexus</h1>
            <span className="text-slate-400">Professor Dashboard</span>
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
        {/* Teacher Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur">
            <div className="flex items-center justify-between mb-4">
              <BookOpen className="w-8 h-8 text-green-400" />
              <span className="text-2xl font-bold">6</span>
            </div>
            <h3 className="text-slate-300">My Courses</h3>
            <p className="text-sm text-slate-400">Active this semester</p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur">
            <div className="flex items-center justify-between mb-4">
              <Users className="w-8 h-8 text-blue-400" />
              <span className="text-2xl font-bold">248</span>
            </div>
            <h3 className="text-slate-300">Students</h3>
            <p className="text-sm text-slate-400">Total enrolled</p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur">
            <div className="flex items-center justify-between mb-4">
              <FileText className="w-8 h-8 text-purple-400" />
              <span className="text-2xl font-bold">42</span>
            </div>
            <h3 className="text-slate-300">Assignments</h3>
            <p className="text-sm text-slate-400">Created</p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur">
            <div className="flex items-center justify-between mb-4">
              <BarChart className="w-8 h-8 text-yellow-400" />
              <span className="text-2xl font-bold">4.2</span>
            </div>
            <h3 className="text-slate-300">Avg Rating</h3>
            <p className="text-sm text-slate-400">From students</p>
          </div>
        </div>

        {/* Quick Actions & Courses */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3">
              <button className="p-3 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 rounded-lg transition-colors">
                Create Assignment
              </button>
              <button className="p-3 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg transition-colors">
                Grade Submissions
              </button>
              <button className="p-3 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 rounded-lg transition-colors">
                Schedule Office Hours
              </button>
              <button className="p-3 bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-500/30 rounded-lg transition-colors">
                Post Announcement
              </button>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur">
            <h2 className="text-xl font-semibold mb-4">My Courses</h2>
            <div className="space-y-3">
              {[
                { name: "Web Development", students: 45, progress: "Week 8 of 12" },
                { name: "Database Systems", students: 38, progress: "Week 6 of 12" },
                { name: "Software Engineering", students: 52, progress: "Week 10 of 12" },
              ].map((course, index) => (
                <div key={index} className="p-3 bg-white/5 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-slate-300 font-medium">{course.name}</span>
                    <span className="text-sm text-green-400">{course.students} students</span>
                  </div>
                  <div className="text-sm text-slate-400">{course.progress}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {[
              "New assignment posted in Web Development",
              "15 students submitted Database homework",
              "Office hours scheduled for tomorrow",
              "Course materials updated for Software Engineering",
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <span className="text-slate-300">{activity}</span>
                <span className="text-sm text-slate-400">{index + 1}h ago</span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
    </ProtectedRoute>
  );
}

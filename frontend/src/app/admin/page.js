"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/authStore";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Users, BookOpen, Calendar, Settings, LogOut, TrendingUp, AlertCircle } from "lucide-react";

export default function AdminDashboard() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "Admin") {
      router.push("/auth/login");
    }
  }, [isAuthenticated, user, router]);

  const handleLogout = async () => {
    await logout();
    router.push("/auth/login");
  };

  if (!isAuthenticated || user?.role !== "Admin") {
    return <div className="min-h-screen bg-[#060B1A] flex items-center justify-center">
      <div className="text-white">Loading...</div>
    </div>;
  }

  return (
    <ProtectedRoute allowedRoles={["Admin"]}>
      <div className="min-h-screen bg-[#060B1A] text-white">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-purple-500/20 blur-[120px]" />
        <div className="absolute top-40 -left-40 h-[520px] w-[520px] rounded-full bg-red-500/20 blur-[120px]" />
      </div>

      {/* Header */}
      <header className="relative border-b border-white/10 backdrop-blur">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold">CampNexus</h1>
            <span className="text-slate-400">Admin Dashboard</span>
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
        {/* Admin Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur">
            <div className="flex items-center justify-between mb-4">
              <Users className="w-8 h-8 text-blue-400" />
              <span className="text-2xl font-bold">1,248</span>
            </div>
            <h3 className="text-slate-300">Total Users</h3>
            <p className="text-sm text-green-400">+12% this month</p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur">
            <div className="flex items-center justify-between mb-4">
              <BookOpen className="w-8 h-8 text-green-400" />
              <span className="text-2xl font-bold">45</span>
            </div>
            <h3 className="text-slate-300">Courses</h3>
            <p className="text-sm text-slate-400">Active courses</p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur">
            <div className="flex items-center justify-between mb-4">
              <Calendar className="w-8 h-8 text-purple-400" />
              <span className="text-2xl font-bold">18</span>
            </div>
            <h3 className="text-slate-300">Events</h3>
            <p className="text-sm text-slate-400">This month</p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur">
            <div className="flex items-center justify-between mb-4">
              <AlertCircle className="w-8 h-8 text-yellow-400" />
              <span className="text-2xl font-bold">3</span>
            </div>
            <h3 className="text-slate-300">Pending</h3>
            <p className="text-sm text-slate-400">Approvals</p>
          </div>
        </div>

        {/* Admin Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Settings className="w-5 h-5 mr-2" />
              Quick Actions
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <button className="p-3 bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/30 rounded-lg transition-colors">
                Add User
              </button>
              <button className="p-3 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 rounded-lg transition-colors">
                Create Course
              </button>
              <button className="p-3 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 rounded-lg transition-colors">
                Schedule Event
              </button>
              <button className="p-3 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg transition-colors">
                View Reports
              </button>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              System Overview
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Server Status</span>
                <span className="text-sm text-green-400">Online</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Database</span>
                <span className="text-sm text-green-400">Connected</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Last Backup</span>
                <span className="text-sm text-slate-400">2 hours ago</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Active Sessions</span>
                <span className="text-sm text-blue-400">142</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {[
              "New user registration: John Doe",
              "Course 'React Advanced' created",
              "Event 'Tech Summit 2024' scheduled",
              "System maintenance completed",
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

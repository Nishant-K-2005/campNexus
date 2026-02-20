"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/authStore";
import { 
  User, 
  Settings, 
  LogOut, 
  ChevronDown, 
  BookOpen, 
  Calendar, 
  MessageSquare, 
  Home,
  Contact,
  HelpCircle,
  Bell
} from "lucide-react";

export default function Header() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push("/auth/login");
  };

  const getDashboardLink = () => {
    switch (user?.role) {
      case "Student":
        return "/student";
      case "Teacher":
        return "/teacher";
      case "Admin":
        return "/admin";
      default:
        return "/auth/login";
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <header className="relative border-b border-white/10 backdrop-blur bg-[#060B1A]/90">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-8">
            <Link href={getDashboardLink()} className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">CN</span>
              </div>
              <h1 className="text-xl font-bold text-white">CampNexus</h1>
            </Link>

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link 
                href={getDashboardLink()}
                className="flex items-center space-x-2 text-slate-300 hover:text-white transition-colors"
              >
                <Home className="w-4 h-4" />
                <span>Dashboard</span>
              </Link>
              
              {user?.role === "Student" && (
                <>
                  <Link 
                    href="/courses"
                    className="flex items-center space-x-2 text-slate-300 hover:text-white transition-colors"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Courses</span>
                  </Link>
                  <Link 
                    href="/events"
                    className="flex items-center space-x-2 text-slate-300 hover:text-white transition-colors"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Events</span>
                  </Link>
                </>
              )}
              
              {user?.role === "Teacher" && (
                <>
                  <Link 
                    href="/my-courses"
                    className="flex items-center space-x-2 text-slate-300 hover:text-white transition-colors"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>My Courses</span>
                  </Link>
                  <Link 
                    href="/assignments"
                    className="flex items-center space-x-2 text-slate-300 hover:text-white transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    <span>Assignments</span>
                  </Link>
                </>
              )}
              
              {user?.role === "Admin" && (
                <>
                  <Link 
                    href="/users"
                    className="flex items-center space-x-2 text-slate-300 hover:text-white transition-colors"
                  >
                    <User className="w-4 h-4" />
                    <span>Users</span>
                  </Link>
                  <Link 
                    href="/admin/settings"
                    className="flex items-center space-x-2 text-slate-300 hover:text-white transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    <span>Settings</span>
                  </Link>
                </>
              )}
            </nav>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button className="relative p-2 text-slate-300 hover:text-white transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Messages */}
            <button className="p-2 text-slate-300 hover:text-white transition-colors">
              <MessageSquare className="w-5 h-5" />
            </button>

            {/* Help */}
            <button className="p-2 text-slate-300 hover:text-white transition-colors">
              <HelpCircle className="w-5 h-5" />
            </button>

            {/* Contact */}
            <button className="p-2 text-slate-300 hover:text-white transition-colors">
              <Contact className="w-5 h-5" />
            </button>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {user?.full_name?.charAt(0)?.toUpperCase() || "U"}
                  </span>
                </div>
                <span className="text-slate-300 text-sm hidden sm:block">
                  {user?.full_name || "User"}
                </span>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>

              {/* Dropdown Menu */}
              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white/10 backdrop-blur border border-white/20 rounded-lg shadow-xl z-50">
                  <div className="p-3 border-b border-white/10">
                    <p className="text-white font-medium text-sm">{user?.full_name}</p>
                    <p className="text-slate-400 text-xs">{user?.email}</p>
                    <p className="text-indigo-400 text-xs mt-1">{user?.role}</p>
                  </div>
                  
                  <div className="py-2">
                    <Link
                      href="/profile"
                      className="flex items-center space-x-2 px-3 py-2 text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                    >
                      <User className="w-4 h-4" />
                      <span>Profile</span>
                    </Link>
                    
                    <Link
                      href="/settings"
                      className="flex items-center space-x-2 px-3 py-2 text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                    >
                      <Settings className="w-4 h-4" />
                      <span>Settings</span>
                    </Link>
                  </div>
                  
                  <div className="border-t border-white/10 py-2">
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 px-3 py-2 text-red-400 hover:text-red-300 hover:bg-white/10 transition-colors w-full"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import NotificationDropdown from "@/components/NotificationDropdown";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Shield } from "lucide-react";

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();

  // Exclude Navbar from auth pages if desired, but we keep it minimal there
  const isAuthPage = pathname === "/login" || pathname === "/register";

  return (
    <nav className="bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800 sticky top-0 z-50 shadow-sm transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex-shrink-0 flex items-center group">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center mr-3 shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">Civic<span className="text-blue-600 dark:text-blue-400">Guard</span></span>
            </Link>
            
            {!isAuthPage && (
              <div className="hidden md:flex space-x-1">
                {/* Navbar Links mainly for Landing Page or quick jumps, Dashboard uses Sidebar */}
                <Link href="/" className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${pathname === "/" ? "bg-gray-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400" : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800"}`}>Home</Link>
                {session ? (
                  <Link href="/dashboard" className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${pathname.startsWith("/dashboard") ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400" : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800"}`}>Dashboard</Link>
                ) : null}
              </div>
            )}
          </div>

          <div className="flex items-center space-x-3">
            <ThemeToggle />
            
            {session ? (
              <>
                <NotificationDropdown />
                <div className="hidden sm:flex items-center pl-4 border-l border-gray-200 dark:border-gray-700 space-x-3">
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white leading-none">{session.user?.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{session.user?.role}</p>
                  </div>
                  <div className="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300 font-bold border border-blue-200 dark:border-blue-800">
                    {session.user?.name?.charAt(0) || "U"}
                  </div>
                </div>
              </>
            ) : (
              !isAuthPage && (
                <div className="flex items-center space-x-3">
                  <Link href="/login" className="px-5 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">Log In</Link>
                  <Link href="/register" className="px-5 py-2 text-sm font-medium bg-blue-600 text-white rounded-xl shadow-sm hover:bg-blue-700 hover:shadow-md transition-all">Sign Up</Link>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

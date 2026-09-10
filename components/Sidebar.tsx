"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { LayoutDashboard, FileText, Map as MapIcon, ShieldAlert, BarChart3, LogOut, Settings } from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const links = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "File Report", href: "/complaints/new", icon: FileText },
    { name: "Crime Map", href: "/map", icon: MapIcon },
  ];

  if (session?.user?.role === "Admin") {
    links.push({ name: "Analytics", href: "/admin/analytics", icon: BarChart3 });
  }

  return (
    <aside className="w-64 bg-white dark:bg-slate-900 border-r border-gray-100 dark:border-slate-800 hidden lg:flex flex-col h-[calc(100vh-4rem)] sticky top-16 shadow-sm">
      <div className="p-5 flex-1 overflow-y-auto">
        <div className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4 px-3 flex items-center">
          Overview
        </div>
        <nav className="space-y-1.5">
          {links.map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
            const Icon = link.icon;
            return (
              <Link 
                key={link.name} 
                href={link.href}
                className={`flex items-center px-3 py-2.5 rounded-xl transition-all font-medium ${
                  isActive 
                    ? "bg-blue-50 dark:bg-blue-600/10 text-blue-600 dark:text-blue-400 shadow-sm border border-blue-100 dark:border-blue-800/50" 
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-gray-100 border border-transparent"
                }`}
              >
                <Icon className={`w-5 h-5 mr-3 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'}`} />
                {link.name}
              </Link>
            );
          })}
        </nav>
      </div>
      
      <div className="p-5 border-t border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-900/50">
        <button 
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex items-center w-full px-3 py-2.5 rounded-xl text-gray-600 dark:text-gray-400 font-medium hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-colors border border-transparent hover:border-red-100 dark:hover:border-red-900/50"
        >
          <LogOut className="w-5 h-5 mr-3" />
          Log Out
        </button>
      </div>
    </aside>
  );
}

"use client";
import { usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import LegalChatbot from "@/components/LegalChatbot";

export default function AppLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname === "/login" || pathname === "/register";
  const isLandingPage = pathname === "/";
  const hideSidebar = isAuthPage || isLandingPage;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <Navbar />
      <div className="flex flex-1">
        {!hideSidebar && <Sidebar />}
        <main className={`flex-1 flex flex-col ${!hideSidebar ? 'p-4 sm:p-6 lg:p-8 overflow-y-auto w-full' : 'w-full'}`}>
          {children}
        </main>
      </div>
      <LegalChatbot />
    </div>
  );
}

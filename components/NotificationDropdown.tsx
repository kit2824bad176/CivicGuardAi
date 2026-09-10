"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Bell, Info, CheckCircle2 } from "lucide-react";

export default function NotificationDropdown() {
  const { data: session } = useSession();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!session) return;
    async function loadNotifs() {
      try {
        const res = await fetch("/api/notifications");
        if (res.ok) {
          setNotifications(await res.json());
        }
      } catch(e){}
    }
    loadNotifs();
    const interval = setInterval(loadNotifs, 30000);
    return () => clearInterval(interval);
  }, [session]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAsRead = async () => {
    if (unreadCount === 0) return;
    await fetch("/api/notifications/mark-read", { method: "POST" });
    setNotifications(notifications.map(n => ({...n, isRead: true})));
  };

  return (
    <div className="relative">
      <button 
        onClick={() => { setIsOpen(!isOpen); if(!isOpen) markAsRead(); }}
        className="relative p-2.5 rounded-xl bg-gray-50 dark:bg-slate-800 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-slate-700 dark:hover:text-white transition-all shadow-sm border border-gray-100 dark:border-slate-700"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && <span className="absolute top-1.5 right-1.5 flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border-2 border-white dark:border-slate-800"></span></span>}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-800 overflow-hidden z-[100] animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-4 bg-gray-50/50 dark:bg-slate-800/50 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center">
            <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest flex items-center">
              <Bell className="w-3.5 h-3.5 mr-2" /> Recent Alerts
            </h3>
            {unreadCount > 0 && <span className="text-[10px] font-bold bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2 py-0.5 rounded-md border border-blue-200 dark:border-blue-800">{unreadCount} New</span>}
          </div>
          <div className="max-h-[320px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center flex flex-col items-center">
                <CheckCircle2 className="w-8 h-8 text-green-500 mb-2 opacity-50" />
                <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">You're all caught up.</span>
              </div>
            ) : (
              <div className="divide-y divide-gray-50 dark:divide-slate-800">
                {notifications.map(n => (
                  <div key={n._id} className={`p-4 text-sm transition-colors flex items-start ${!n.isRead ? 'bg-blue-50/50 dark:bg-blue-900/10' : 'hover:bg-gray-50 dark:hover:bg-slate-800/50'}`}>
                    <div className={`mt-0.5 w-2 h-2 rounded-full mr-3 flex-shrink-0 ${!n.isRead ? 'bg-blue-500' : 'bg-transparent'}`}></div>
                    <div className="flex-1">
                      <p className={`text-gray-800 dark:text-gray-200 leading-snug ${!n.isRead ? 'font-bold' : 'font-medium'}`}>{n.message}</p>
                      <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 mt-1.5 block">{new Date(n.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - {new Date(n.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="p-3 bg-gray-50 dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800 text-center">
            <button onClick={() => setIsOpen(false)} className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 hover:underline">Close Panel</button>
          </div>
        </div>
      )}
    </div>
  );
}

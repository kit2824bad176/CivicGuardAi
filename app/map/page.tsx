"use client";
import dynamic from 'next/dynamic';

const CrimeMapClient = dynamic(() => import('@/components/CrimeMapClient'), { ssr: false });

export default function MapPage() {
  return (
    <div className="flex flex-col h-[calc(100vh-7rem)] bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-500 relative">
      <CrimeMapClient />
    </div>
  );
}

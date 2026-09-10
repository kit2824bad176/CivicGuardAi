"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AnalyticsDashboard() {
  const { data: session } = useSession();
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.user?.role && session.user.role !== "Admin") {
      router.push("/dashboard");
      return;
    }

    async function fetchAnalytics() {
      try {
        const res = await fetch("/api/admin/analytics");
        if (res.ok) {
          setData(await res.json());
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    
    if (session) fetchAnalytics();
  }, [session, router]);

  if (loading) return <div className="p-10 text-center font-medium text-slate-500">Loading analytics...</div>;
  if (!data) return <div className="p-10 text-center font-medium text-slate-500">Analytics unavailable</div>;

  return (
    <div className="max-w-7xl mx-auto p-6 mt-8">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Platform Analytics</h1>
        <p className="text-slate-500 font-medium">Overview of civic safety metrics and system performance.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center hover:shadow-md transition-shadow">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Total Cases</span>
          <span className="text-5xl font-black text-slate-800">{data.totalCases}</span>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-transparent border-t-emerald-500 flex flex-col items-center justify-center hover:shadow-md transition-shadow">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Resolved</span>
          <span className="text-5xl font-black text-emerald-500">{data.resolvedCases}</span>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-transparent border-t-amber-500 flex flex-col items-center justify-center hover:shadow-md transition-shadow">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Pending</span>
          <span className="text-5xl font-black text-amber-500">{data.pendingCases}</span>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-transparent border-t-indigo-500 flex flex-col items-center justify-center hover:shadow-md transition-shadow">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Resolution Rate</span>
          <span className="text-5xl font-black text-indigo-600">{data.resolutionRate}%</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-8 border-b pb-4">Category Distribution</h3>
          <div className="space-y-6">
            {data.categoryDistribution.map((cat: any) => (
              <div key={cat._id} className="flex flex-col">
                <div className="flex justify-between text-sm font-bold text-slate-700 mb-2">
                  <span className="uppercase tracking-wide">{cat._id}</span>
                  <span className="text-indigo-600">{cat.count}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3">
                  <div className="bg-indigo-500 h-3 rounded-full" style={{ width: `${(cat.count / data.totalCases) * 100}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-8 border-b pb-4">AI Priority Assessment</h3>
          <div className="space-y-6">
            {data.priorityDistribution.map((pri: any) => (
              <div key={pri._id} className="flex flex-col">
                <div className="flex justify-between text-sm font-bold text-slate-700 mb-2">
                  <span className="uppercase tracking-wide">{pri._id || "Unassigned"}</span>
                  <span className={`${pri._id === 'High' ? 'text-red-500' : pri._id === 'Medium' ? 'text-orange-500' : 'text-slate-700'}`}>{pri.count}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3">
                  <div className={`h-3 rounded-full ${pri._id === 'High' ? 'bg-red-500' : pri._id === 'Medium' ? 'bg-orange-400' : 'bg-green-400'}`} style={{ width: `${(pri._id ? (pri.count / data.totalCases) * 100 : 0)}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

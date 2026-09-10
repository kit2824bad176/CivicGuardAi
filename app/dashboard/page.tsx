"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { PlusCircle, FileText, CheckCircle, Clock, MapPin, Loader2, ArrowRight, Activity, Zap } from "lucide-react";

export default function Dashboard() {
  const { data: session } = useSession();
  const [cases, setCases] = useState<any[]>([]);
  const [officers, setOfficers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("All");

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/cases");
        if (res.ok) setCases(await res.json());

        // Standardize fetching officers if Admin
        if (session?.user?.role === "Admin" || session?.user?.role === "Police Officer") {
          const offRes = await fetch("/api/officers");
          if (offRes.ok) setOfficers(await offRes.json());
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [session]);

  const handleAssign = async (caseId: string, officerId: string) => {
    try {
      await fetch(`/api/complaints/${caseId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assignedOfficerId: officerId, status: "Assigned Officer" })
      });
      // Optimistic upate
      setCases(cases.map(c => c._id === caseId ? { ...c, assignedOfficerId: officerId, status: "Assigned Officer" } : c));
    } catch(e){}
  }

  // STEP 14: Smart Incident Detection (Hotspots)
  const hotspots = useMemo(() => {
    const locCounts: Record<string, number> = {};
    cases.forEach(c => {
      if (c.status !== "Resolved" && c.location) {
        locCounts[c.location] = (locCounts[c.location] || 0) + 1;
      }
    });
    // Flags locations with >= 2 active issues
    return Object.keys(locCounts).filter(loc => locCounts[loc] >= 2);
  }, [cases]);

  if (loading) return (
    <div className="flex h-full items-center justify-center p-12 min-h-[50vh]">
      <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
    </div>
  );

  const isCitizen = session?.user?.role === "Citizen";

  const totalCases = cases.length;
  const activeCases = cases.filter(c => c.status === "Pending Review" || c.status === "In Progress" || c.status === "Assigned Officer").length;
  const resolvedCases = cases.filter(c => c.status === "Resolved").length;

  const filteredCases = filterStatus === "All" ? cases : cases.filter(c => c.status === filterStatus);

  if (isCitizen) {
    return (
      <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-500">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Citizen Dashboard</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Overview of your submitted reports and their current statuses.</p>
          </div>
          <Link href="/complaints/new" className="flex items-center px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-500/30 transition-all font-semibold text-sm">
            <PlusCircle className="w-5 h-5 mr-2" /> Register New Case
          </Link>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm flex items-center group">
            <div className="w-14 h-14 bg-gray-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center mr-5 group-hover:scale-110 transition-transform">
              <FileText className="w-7 h-7 text-gray-600 dark:text-gray-300" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1">Total Reports</p>
              <h3 className="text-3xl font-black text-gray-900 dark:text-white">{totalCases}</h3>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm flex items-center group">
            <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mr-5 group-hover:scale-110 transition-transform">
              <Clock className="w-7 h-7 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1">Active Cases</p>
              <h3 className="text-3xl font-black text-gray-900 dark:text-white">{activeCases}</h3>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm flex items-center group">
            <div className="w-14 h-14 bg-green-50 dark:bg-green-900/30 rounded-2xl flex items-center justify-center mr-5 group-hover:scale-110 transition-transform">
              <CheckCircle className="w-7 h-7 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1">Resolved</p>
              <h3 className="text-3xl font-black text-gray-900 dark:text-white">{resolvedCases}</h3>
            </div>
          </div>
        </div>

        {/* Recent Cases */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-900/50 flex justify-between items-center">
            <h3 className="font-bold text-lg text-gray-900 dark:text-white">Recent Complaints</h3>
            <span className="text-xs font-bold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-slate-800 px-3 py-1 rounded-full">{cases.length} Items</span>
          </div>
          <div className="divide-y divide-gray-50 dark:divide-slate-800">
            {cases.length === 0 ? (
              <div className="p-12 text-center flex flex-col items-center justify-center">
                <FileText className="w-12 h-12 text-gray-300 dark:text-gray-700 mb-4" />
                <p className="text-gray-500 dark:text-gray-400 font-medium">No cases found. Start by registering a new complaint.</p>
              </div>
            ) : (
              cases.map((c) => (
                <Link key={c._id} href={`/cases/${c._id}`} className="block p-6 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors group">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                    <div className="flex items-start">
                      <div className={`p-3 rounded-full mr-4 shadow-sm border ${c.status === 'Resolved' ? 'bg-green-50 text-green-600 border-green-100 dark:bg-green-900/30 dark:border-green-800/30' : 'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-900/30 dark:border-blue-800/30'}`}>
                        {c.status === 'Resolved' ? <CheckCircle className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                      </div>
                      <div>
                        <h4 className="font-bold text-lg text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors flex items-center">
                          {c.title}
                          {hotspots.includes(c.location) && (
                            <span className="ml-3 inline-flex items-center text-[10px] bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 px-2 py-0.5 rounded-md font-bold uppercase tracking-widest"><Zap className="w-3 h-3 mr-1" /> Hotspot</span>
                          )}
                        </h4>
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-2">
                          <span className="bg-gray-100 dark:bg-slate-800 px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider mr-3">{c.category}</span>
                          <span className="flex items-center font-medium"><MapPin className="w-3.5 h-3.5 mr-1 text-gray-400" /> {c.location || "N/A"}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center text-sm sm:text-right">
                      <ArrowRight className="w-5 h-5 text-gray-300 dark:text-gray-600 group-hover:text-blue-500 transition-colors sm:hidden" />
                      <div className="hidden sm:block">
                        <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border ${
                          c.status === 'Resolved' ? 'bg-green-50 border-green-200 text-green-700 dark:bg-green-900/20 dark:border-green-800/50 dark:text-green-400' :
                          'bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-900/20 dark:border-amber-800/50 dark:text-amber-400'
                        }`}>
                          {c.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    );
  }

  // Police / Admin View
  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Command Center</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage and track active civic safety incidents across regions.</p>
        </div>
      </div>

      {hotspots.length > 0 && (
        <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800/50 p-6 rounded-2xl shadow-sm">
          <h3 className="font-bold text-red-800 dark:text-red-400 flex items-center mb-3">
             <Activity className="w-5 h-5 mr-2 animate-pulse" /> Smart Incident Detection Alerts
          </h3>
          <p className="text-sm text-red-700 dark:text-red-300 mb-4 font-medium">Auto-detected geographical anomaly: Multiple unassigned or pending complaints discovered at matching locations. Immediate police dispatch recommended.</p>
          <div className="flex flex-wrap gap-2">
            {hotspots.map(h => (
              <span key={h} className="bg-red-100 dark:bg-red-800/30 text-red-800 dark:text-red-400 px-3 py-1.5 rounded-lg text-xs font-bold border border-red-200 dark:border-red-900/50 flex items-center">
                <MapPin className="w-3.5 h-3.5 mr-1" /> {h}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-900/50 flex justify-between items-center flex-wrap gap-4">
          <h3 className="font-bold text-lg text-gray-900 dark:text-white flex items-center">
            Incident Database
            <span className="ml-3 text-xs font-bold text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-slate-800 px-2 py-0.5 rounded-full">{filteredCases.length}</span>
          </h3>
          <select 
            className="rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 outline-none text-gray-700 dark:text-gray-200 cursor-pointer shadow-sm transition-all"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Pending Review">Pending Review</option>
            <option value="Assigned Officer">Assigned Officer</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 dark:text-gray-400 uppercase bg-gray-50 dark:bg-slate-800/50 border-b border-gray-100 dark:border-slate-800">
              <tr>
                <th className="px-6 py-4 font-bold tracking-widest pl-6">Title & Category</th>
                <th className="px-6 py-4 font-bold tracking-widest">Location</th>
                <th className="px-6 py-4 font-bold tracking-widest">Priority</th>
                <th className="px-6 py-4 font-bold tracking-widest">Assigned Officer</th>
                <th className="px-6 py-4 font-bold tracking-widest">Status</th>
                <th className="px-6 py-4 font-bold tracking-widest text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-slate-800">
              {filteredCases.map(c => (
                <tr key={c._id} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/30 transition-colors group cursor-default">
                  <td className="px-6 py-5">
                    <p className="font-bold text-gray-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors flex items-center">
                       {c.title}
                       {hotspots.includes(c.location) && (
                            <span title="High-Risk Hotspot Detected" className="ml-2 inline-flex items-center text-[10px] bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-full px-1.5 py-0.5 font-bold uppercase"><Zap className="w-3 h-3" /></span>
                        )}
                    </p>
                    <span className="bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded text-xs font-bold pb-[3px] uppercase tracking-wider">{c.category}</span>
                  </td>
                  <td className="px-6 py-5 text-gray-600 dark:text-gray-300 font-medium h-full mt-2">
                    <span className="flex items-center">
                       <MapPin className="w-3.5 h-3.5 mr-1.5 text-gray-400" />
                       {c.location || "N/A"}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider border ${
                      c.priorityScore === 'High' ? 'bg-red-50 border-red-200 text-red-700 dark:bg-red-500/10 dark:border-red-500/30 dark:text-red-400' :
                      c.priorityScore === 'Medium' ? 'bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-500/10 dark:border-amber-500/30 dark:text-amber-400' :
                      'bg-green-50 border-green-200 text-green-700 dark:bg-green-500/10 dark:border-green-500/30 dark:text-green-400'
                    }`}>
                      {c.priorityScore || 'Low'}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    {c.assignedOfficerId ? (
                      <span className="inline-flex items-center px-3 py-1.5 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/50 rounded-lg text-xs font-bold">
                        Assigned
                      </span>
                    ) : (
                      <select 
                        className="bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-xs px-2 py-1.5 outline-none font-medium cursor-pointer"
                        onChange={(e) => handleAssign(c._id, e.target.value)}
                        defaultValue=""
                      >
                         <option value="" disabled>Assign Officer</option>
                         {officers.map(off => (
                           <option key={off._id} value={off._id}>{off.name}</option>
                         ))}
                      </select>
                    )}
                  </td>
                  <td className="px-6 py-5">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border ${
                      c.status === 'Resolved' ? 'bg-gray-50 border-gray-200 text-gray-600 dark:bg-slate-800 dark:border-slate-700 dark:text-gray-400' : 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/20 dark:border-blue-800/50 dark:text-blue-400'
                    }`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <Link href={`/cases/${c._id}`} className="inline-flex items-center px-4 py-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 shadow-sm transition-all focus:ring-2 focus:ring-blue-500 outline-none">
                      Manage <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredCases.length === 0 && (
            <div className="p-16 text-center text-gray-500 dark:text-gray-400 flex flex-col items-center">
              <FileText className="w-12 h-12 text-gray-300 dark:text-gray-700 mb-4" />
              <p className="font-semibold text-lg">No incidents match your current filter.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

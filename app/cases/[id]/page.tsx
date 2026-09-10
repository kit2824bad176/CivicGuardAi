"use client";

import { useEffect, useState, use } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Circle, Clock, MapPin, BrainCircuit, ShieldAlert, Image as ImageIcon, Link as LinkIcon, Loader2 } from "lucide-react";

export default function CaseDetail({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { data: session } = useSession();
  const [complaint, setComplaint] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [statusUpdating, setStatusUpdating] = useState(false);

  useEffect(() => {
    async function fetchCase() {
      try {
        const res = await fetch(`/api/complaints/${resolvedParams.id}`);
        if (res.ok) {
          const data = await res.json();
          setComplaint(data);
        } else {
          router.push("/dashboard");
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchCase();
  }, [resolvedParams.id, router]);

  const handleStatusUpdate = async (newStatus: string) => {
    setStatusUpdating(true);
    try {
      const res = await fetch(`/api/complaints/${resolvedParams.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setComplaint({ ...complaint, status: newStatus });
      }
    } catch(e) {}
    setStatusUpdating(false);
  };

  if (loading) return (
    <div className="flex h-[80vh] items-center justify-center">
      <div className="flex flex-col items-center">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-4" />
        <p className="text-gray-500 font-medium tracking-wide">Retrieving secure records...</p>
      </div>
    </div>
  );

  if (!complaint) return null;

  const isAdmin = session?.user?.role === "Admin" || session?.user?.role === "Police Officer";
  
  const steps = ["Pending Review", "In Progress", "Resolved"];
  const currentStepIndex = steps.indexOf(complaint.status);

  return (
    <div className="max-w-6xl mx-auto py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-3">
             <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-widest border border-blue-200 dark:border-blue-800/50 shadow-sm">Case #{complaint._id.slice(-6).toUpperCase()}</span>
             <span className="text-gray-400 dark:text-gray-500 text-sm font-medium">{new Date(complaint.createdAt).toLocaleDateString()}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-tight">{complaint.title}</h1>
        </div>
        
        {isAdmin && (
          <div className="bg-white dark:bg-slate-900 p-2 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm flex items-center space-x-1">
            {steps.map(s => (
              <button 
                key={s}
                disabled={statusUpdating || complaint.status === s}
                onClick={() => handleStatusUpdate(s)}
                className={`px-4 py-2.5 text-xs font-bold rounded-lg transition-all ${
                  complaint.status === s 
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30' 
                    : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {s}
              </button>
            ))}
            {statusUpdating && <Loader2 className="w-4 h-4 animate-spin text-blue-600 ml-2 mr-2" />}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Content (Left 2 columns) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Status Timeline Component */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-slate-800">
            <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-6 flex items-center">
              <Clock className="w-5 h-5 mr-3 text-blue-500" /> Progression Timeline
            </h3>
            <div className="relative flex justify-between items-center w-full max-w-xl mx-auto my-12">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-2 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 transition-all duration-1000 ease-out"
                  style={{ width: `${currentStepIndex === 0 ? 0 : currentStepIndex === 1 ? 50 : 100}%` }}
                ></div>
              </div>
              
              {steps.map((step, idx) => {
                const isCompleted = idx <= currentStepIndex;
                const isCurrent = idx === currentStepIndex;
                return (
                  <div key={step} className="relative flex flex-col items-center group">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center z-10 transition-all duration-700 ease-out border-[6px] border-white dark:border-slate-900 ${
                      isCompleted ? 'bg-blue-600 shadow-lg shadow-blue-500/40 scale-110' : 'bg-gray-200 dark:bg-slate-800'
                    }`}>
                      {isCompleted ? <CheckCircle2 className="w-6 h-6 text-white animate-in zoom-in" /> : <Circle className="w-3 h-3 text-gray-400" />}
                    </div>
                    <span className={`absolute top-16 w-32 text-center text-xs font-bold uppercase tracking-widest transition-colors ${
                      isCurrent ? 'text-blue-600 dark:text-blue-400' : isCompleted ? 'text-gray-700 dark:text-gray-300' : 'text-gray-400 dark:text-gray-600'
                    }`}>{step}</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Description Block */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-slate-800">
            <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-4">Official Description</h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap font-medium">{complaint.description}</p>
          </div>

          {/* Evidence Gallery Component placeholder */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-slate-800">
            <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-6 flex items-center">
              <ImageIcon className="w-5 h-5 mr-3 text-indigo-500" /> Digital Evidence Block
            </h3>
            
            <div className="bg-gray-50/50 dark:bg-slate-800/30 rounded-2xl p-8 border border-gray-100 dark:border-slate-800 flex flex-col items-center justify-center text-center">
                <ShieldAlert className="w-14 h-14 text-gray-300 dark:text-gray-600 mb-4" />
                <p className="text-base font-bold text-gray-700 dark:text-gray-300 mb-1">Encrypted Secure Vault</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm leading-relaxed mb-6">Evidence files are cryptographically sealed with SHA-256 caching and restricted to authorized personnel.</p>
                
                {/* Simulated file box */}
                <div className="flex items-center bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 shadow-sm rounded-xl px-5 py-3.5 cursor-not-allowed opacity-90 transition-transform hover:scale-[1.02]">
                   <LinkIcon className="w-5 h-5 text-blue-500 mr-4" />
                   <div className="text-left">
                     <p className="text-sm font-bold text-gray-900 dark:text-white">Encrypted_Media.jpg</p>
                     <p className="text-xs text-gray-500 font-mono mt-0.5 tracking-tight">SHA256: e3b0c442...855</p>
                   </div>
                </div>
            </div>
          </div>

        </div>


        {/* Sidebar Info (Right Column) */}
        <div className="space-y-6">
          
          {/* AI Insights Card */}
          <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-3xl p-1 shadow-xl shadow-blue-500/20 group hover:shadow-2xl transition-shadow">
            <div className="bg-white dark:bg-slate-900 rounded-[22px] p-8 h-full">
              <div className="flex items-center space-x-3 mb-8">
                <div className="bg-indigo-50 dark:bg-indigo-900/40 p-3 rounded-xl">
                  <BrainCircuit className="w-6 h-6 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform" />
                </div>
                <h3 className="font-bold text-lg text-gray-900 dark:text-white">AI Analysis</h3>
              </div>
              
              <div className="space-y-6">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Neural Classification</p>
                  <p className="text-sm font-bold text-gray-900 dark:text-white bg-gray-50 dark:bg-slate-800 px-4 py-2.5 rounded-xl inline-block border border-gray-200 dark:border-slate-700 shadow-sm">{complaint.category}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Threat Priority</p>
                  <span className={`inline-flex items-center px-4 py-2 rounded-xl text-sm font-bold uppercase tracking-widest border shadow-sm ${
                    complaint.priorityScore === 'High' ? 'bg-red-50 border-red-200 text-red-700 dark:bg-red-900/20 dark:border-red-800/50 dark:text-red-400' :
                    complaint.priorityScore === 'Medium' ? 'bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-900/20 dark:border-amber-800/50 dark:text-amber-400' :
                    'bg-green-50 border-green-200 text-green-700 dark:bg-green-900/20 dark:border-green-800/50 dark:text-green-400'
                  }`}>
                    {complaint.priorityScore || 'Low'}
                  </span>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-900/50 mt-8">
                  <p className="text-xs text-blue-800 dark:text-blue-300 font-medium leading-relaxed">This report was automatically assessed by the CivicGuard Python NLP microservice ensuring instantaneous risk routing.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Location Map Placeholder */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-slate-800">
            <h3 className="font-bold text-gray-900 dark:text-white mb-5 flex items-center text-lg">
              <MapPin className="w-5 h-5 mr-3 text-red-500" /> Location Data
            </h3>
            <p className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-6 bg-gray-50 dark:bg-slate-800 px-4 py-3 rounded-xl border border-gray-100 dark:border-slate-700">{complaint.location}</p>
            
            <div className="w-full h-56 bg-gray-100 dark:bg-slate-800 rounded-2xl relative overflow-hidden group border border-gray-200 dark:border-slate-700 cursor-pointer" onClick={() => router.push('/map')}>
               {/* Decorative Map Pattern */}
               <div className="absolute inset-0 opacity-20 dark:opacity-40" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)', backgroundSize: '16px 16px' }}></div>
               <div className="absolute inset-0 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                 <div className="absolute w-14 h-14 bg-red-500/20 rounded-full animate-ping"></div>
                 <div className="absolute w-6 h-6 bg-red-500/40 rounded-full animate-pulse"></div>
                 <MapPin className="w-10 h-10 text-red-500 relative z-10" fill="white" />
               </div>
               
               <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all backdrop-blur-sm duration-300">
                  <span className="bg-white text-gray-900 font-bold px-5 py-2.5 rounded-xl text-sm shadow-xl">View Full Map</span>
               </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

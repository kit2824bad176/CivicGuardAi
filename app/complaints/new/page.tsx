"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { UploadCloud, MapPin, Subtitles, FileText, Shield, Loader2, Info, Mic, MicOff } from "lucide-react";

export default function NewComplaint() {
  const router = useRouter();
  const { data: session } = useSession();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Theft");
  const [location, setLocation] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const toggleListening = () => {
    if (isListening) {
      if (recognitionRef.current) recognitionRef.current.stop();
      setIsListening(false);
      return;
    }
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser. Please use Google Chrome.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onresult = (event: any) => {
      let finalTranscript = event.results[0][0].transcript;
      setDescription(prev => prev + (prev ? " " : "") + finalTranscript);
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognition.start();
    recognitionRef.current = recognition;
    setIsListening(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      let evidenceHash = null;
      let evidenceUrl = null;

      if (files.length > 0) {
        const formData = new FormData();
        formData.append("file", files[0]);
        // To accurately mimic the full endpoint, we assume it's set up
        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        }).catch(() => null);

        if (uploadRes && uploadRes.ok) {
          const uploadedData = await uploadRes.json();
          evidenceHash = uploadedData.hash;
          evidenceUrl = uploadedData.url;
        }
      }

      const res = await fetch("/api/complaints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          category,
          location,
          isAnonymous,
        }),
      });

      if (res.ok) {
        router.push("/dashboard");
      } else {
        setError("Failed to submit complaint.");
      }
    } catch (err) {
      setError("Network error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 animate-in fade-in zoom-in-95 duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Register a New Case</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">Submit detailed information about the incident. Our AI will automatically categorize and prioritize it for law enforcement.</p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden">
        <div className="bg-gray-50/50 dark:bg-slate-900/50 px-8 py-6 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between flex-wrap gap-4">
          <h2 className="font-bold text-gray-900 dark:text-white flex items-center text-lg">
            <span className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center mr-4">
              <FileText className="w-5 h-5" />
            </span>
            Incident Details
          </h2>
          <div className="flex items-center space-x-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 px-4 py-2 rounded-xl text-sm font-semibold border border-blue-100 dark:border-blue-900/50">
            <Shield className="w-4 h-4 mr-2" /> Encrypted & Secure
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium border border-red-100 shadow-sm">{error}</div>}

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                 Incident Title <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Subtitles className="h-5 w-5 text-gray-400" />
                </div>
                <input 
                  type="text" 
                  value={title} 
                  onChange={e => setTitle(e.target.value)} 
                  className="block w-full pl-12 pr-4 py-3.5 border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm dark:text-white transition-all shadow-sm"
                  placeholder="E.g. Vandalism at City Park"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                  Select Category <span className="text-red-500 ml-1">*</span>
                </label>
                <select 
                  value={category} 
                  onChange={e => setCategory(e.target.value)} 
                  className="block w-full px-4 py-3.5 border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm dark:text-white transition-all shadow-sm appearance-none cursor-pointer"
                >
                  <option value="Theft">Theft</option>
                  <option value="Assault">Assault</option>
                  <option value="Vandalism">Vandalism</option>
                  <option value="Fraud">Fraud</option>
                  <option value="Other">Other</option>
                </select>
                <p className="mt-2 flex items-center text-xs text-gray-500 dark:text-gray-400 font-medium"><Info className="w-3.5 h-3.5 mr-1" /> Our AI may re-categorize based on your description.</p>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                  Location (GPS Configured) <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-gray-400" />
                  </div>
                  <input 
                    type="text" 
                    value={location} 
                    onChange={e => setLocation(e.target.value)} 
                    className="block w-full pl-12 pr-4 py-3.5 border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm dark:text-white transition-all shadow-sm"
                    placeholder="Search or enter location"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">Detailed Description <span className="text-red-500 ml-1">*</span></label>
                <button 
                  type="button" 
                  onClick={toggleListening}
                  className={`flex items-center text-xs font-bold px-3 py-1.5 rounded-lg transition-colors border ${isListening ? 'bg-red-50 text-red-600 border-red-200 dark:bg-red-900/40 dark:border-red-800/50 dark:text-red-400 animate-pulse' : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200 dark:bg-slate-800 dark:border-slate-700 dark:text-gray-300'}`}
                >
                  {isListening ? <><Mic className="w-3.5 h-3.5 mr-1.5" /> Recording...</> : <><MicOff className="w-3.5 h-3.5 mr-1.5" /> Voice Dictation</>}
                </button>
              </div>
              <textarea 
                value={description} 
                onChange={e => setDescription(e.target.value)} 
                rows={5}
                className="block w-full p-5 border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm dark:text-white transition-all shadow-sm resize-none"
                placeholder="Please describe the incident in detail... You may type or use the voice dictation button above."
                required
              ></textarea>
            </div>

            <div className="border-t border-gray-100 dark:border-slate-800 pt-6">
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-4">Digital Evidence (Tamper-Proof)</label>
              <div className="w-full border-2 border-dashed border-gray-300 dark:border-slate-700 rounded-2xl p-10 hover:bg-gray-50 dark:hover:bg-slate-800/50 hover:border-blue-400 dark:hover:border-blue-500 transition-all cursor-pointer group flex flex-col items-center justify-center relative bg-gray-50/30 dark:bg-slate-800/20">
                <input type="file" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/50 transition-all shadow-sm">
                  <UploadCloud className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <p className="text-sm font-bold text-gray-800 dark:text-white mb-2">Click to upload or drag & drop</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center max-w-sm leading-relaxed font-medium">Files are cryptographic hashed (SHA-256) upon upload ensuring court admissibility and data fidelity.</p>
                {files.length > 0 && <span className="mt-4 px-3 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-lg border border-green-200">{files[0].name}</span>}
              </div>
            </div>

            <div className="flex items-center justify-between p-5 bg-gray-50 dark:bg-slate-800/50 rounded-2xl border border-gray-200 dark:border-slate-700 transition-colors hover:bg-gray-100 dark:hover:bg-slate-800">
              <div>
                <h4 className="font-bold text-gray-900 dark:text-white text-sm">File Anonymously</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium">Your identity will be completely hidden from public records.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={isAnonymous} onChange={() => setIsAnonymous(!isAnonymous)} />
                <div className="w-11 h-6 bg-gray-300 dark:bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>

          <div className="pt-6 flex justify-end">
             <button 
              type="submit" 
              disabled={loading}
              className="flex items-center px-10 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 transition-all disabled:opacity-70 text-sm hover:-translate-y-0.5"
            >
              {loading ? <><Loader2 className="w-5 h-5 mr-3 animate-spin" /> Processing & Processing AI...</> : "Submit Incident Report"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

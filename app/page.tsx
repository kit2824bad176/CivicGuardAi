import Link from "next/link";
import { Shield } from "lucide-react";

export default function Home() {
  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white dark:bg-slate-900 sm:py-32 py-20 pb-20">
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" style={{clipPath: "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"}}></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-4xl sm:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            The Next Generation of <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-400 dark:to-cyan-300">Civic Safety & Justice</span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed font-medium">
            Report incidents, upload tamper-proof evidence via blockchain-grade SHA-256 hashes, and track your case securely in real-time. Powering a transparent future for citizens and law enforcement.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register" className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-blue-600 text-white font-bold tracking-wide shadow-lg shadow-blue-500/30 hover:bg-blue-700 hover:-translate-y-1 transition-all transform duration-200">
              Get Started as Citizen
            </Link>
            <Link href="/login" className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-white font-bold border border-slate-200 dark:border-slate-700 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
              Law Enforcement Login
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Enterprise-Grade Security & AI</h2>
            <p className="mt-4 text-slate-500 font-medium max-w-2xl mx-auto">Engineered to protect citizens and streamline police workflows through automation and cryptographic security.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all border border-slate-100 group hover:-translate-y-1 duration-300">
              <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 transition-colors">
                <svg className="w-6 h-6 text-indigo-600 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">AI Case Classification</h3>
              <p className="text-slate-500 font-medium leading-relaxed">Our FastAPI Python microservice analyzes complaint descriptions using NLP to instantly predict categories and assign priority threat scores.</p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all border border-slate-100 group hover:-translate-y-1 duration-300">
              <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-emerald-500 transition-colors">
                <svg className="w-6 h-6 text-emerald-600 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Tamper-Proof Evidence</h3>
              <p className="text-slate-500 font-medium leading-relaxed">All digital evidence is locked with cryptographic SHA-256 hashes immediately upon upload, rendering it admissible and immutable for court proceedings.</p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all border border-slate-100 group hover:-translate-y-1 duration-300">
              <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-red-500 transition-colors">
                <svg className="w-6 h-6 text-red-600 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Live Crime Heatmaps</h3>
              <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">Police administrators get a bird's-eye view of dynamic crime hotspots powered by Leaflet and OpenStreetMap visual intelligence.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center">
             <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3 shadow-md">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">Civic<span className="text-blue-400">Guard</span></span>
          </div>
          <p className="text-slate-400 text-sm font-medium">© {new Date().getFullYear()} CivicGuardAI. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="#" className="text-slate-400 hover:text-white transition-colors text-sm font-medium">Contact</Link>
            <Link href="#" className="text-slate-400 hover:text-white transition-colors text-sm font-medium">Privacy Policy</Link>
            <Link href="#" className="text-slate-400 hover:text-white transition-colors text-sm font-medium">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

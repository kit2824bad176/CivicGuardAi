"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Shield, AlertCircle, Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }
    
    setIsLoading(true);
    setError("");

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError("Invalid credentials");
      setIsLoading(false);
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-xl shadow-blue-900/5 dark:shadow-none border border-gray-100 dark:border-slate-800 p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-blue-500/30">
            <Shield className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Welcome Back</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 text-center">Securely access the CivicGuardAI platform to manage cases or file reports.</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl flex items-center text-sm border border-red-100 dark:border-red-900/50">
            <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
            <p className="font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
            <input 
              type="email" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              className="w-full rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all dark:text-white"
              placeholder="name@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              className="w-full rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all dark:text-white"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full flex items-center justify-center py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-500/30 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign In"}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          Don't have an account?{" "}
          <Link href="/register" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
}

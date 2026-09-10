"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";

export default function LegalChatbot() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'bot', text: string}[]>([
    { role: 'bot', text: "Hello! I'm your CivicGuard Legal Assistant. Ask me about reporting procedures, evidence requirements, or your rights." }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // Hidden for admin/police, mostly for citizens
  if (session?.user?.role && session.user.role !== "Citizen") return null;

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage })
      });
      if (res.ok) {
        const data = await res.json();
        setMessages(prev => [...prev, { role: 'bot', text: data.reply }]);
      }
    } catch(err) {
      setMessages(prev => [...prev, { role: 'bot', text: "Network error." }]);
    }
    setLoading(false);
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 p-4 rounded-full shadow-2xl bg-indigo-600 text-white hover:bg-indigo-700 transition-all z-50 flex items-center justify-center transform hover:scale-105 hover:shadow-indigo-500/50"
      >
        {isOpen ? (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        ) : (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
        )}
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-100 flex flex-col overflow-hidden z-50 max-h-[500px]">
          <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 p-4 text-white">
            <h3 className="font-bold tracking-wide flex items-center">
              <span className="w-2 h-2 rounded-full bg-green-400 mr-2"></span>
              CivicGuard Assistant
            </h3>
            <p className="text-xs text-indigo-100 opacity-90 ml-4">AI-powered legal guidance</p>
          </div>
          
          <div className="flex-1 p-4 overflow-y-auto max-h-96 min-h-[300px] space-y-4 bg-slate-50">
            {messages.map((ms, i) => (
              <div key={i} className={`flex ${ms.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${ms.role === 'user' ? 'bg-indigo-600 text-white rounded-br-sm shadow-md' : 'bg-white border text-slate-700 rounded-bl-sm shadow-sm'}`}>
                  {ms.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-200 p-3 rounded-2xl rounded-bl-sm shadow-sm w-16 flex space-x-1 items-center justify-center">
                  <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-100 flex items-center space-x-2">
            <input 
              type="text" 
              value={input} 
              onChange={e => setInput(e.target.value)} 
              placeholder="Ask for legal help..." 
              className="flex-1 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors text-slate-800"
            />
            <button type="submit" disabled={!input.trim() || loading} className="p-2 bg-indigo-600 rounded-full text-white hover:bg-indigo-700 disabled:opacity-50 transition-colors shadow-sm">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
            </button>
          </form>
        </div>
      )}
    </>
  );
}

import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Loader2, MessageSquare, Trash2, Lock, Crown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { User as UserType } from '../types';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  isPremiumNotice?: boolean;
}

interface AIAssistantProps {
  theme: 'light' | 'dark';
  user: UserType | null;
  onNavigate: (view: string) => void;
}

export default function AIAssistant({ theme, user, onNavigate }: AIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRestricted, setIsRestricted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isLight = theme === 'light';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || isRestricted) return;

    const userMessage = input.trim();
    
    // Check Premium Status
    if (user && !user.isPremium) {
      setInput('');
      setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
      setIsLoading(true);
      
      // Simulate natural thinking delay as requested
      setTimeout(() => {
        setMessages(prev => [
          ...prev, 
          { 
            role: 'assistant', 
            content: `🔒 AI Tutor is a Premium Feature\nሰላም! 👋 AI Tutorን ለመጠቀም Premium መኖር ያስፈልጋል።\n\n💎 Premium ጥቅሞች:\n🤖 AI Tutor (ያለገደብ)\n📚 Full Notes & Exams\n📥 Smart Offline & Analytics\n🚀 አሁኑኑ Upgrade በማድረግ ያለገደብ ይጠቀሙ!\n\n💙 Unlock potential with Premium!`,
            isPremiumNotice: true
          }
        ]);
        setIsLoading(false);
        setIsRestricted(true);
      }, 2000);
      return;
    }

    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, { role: 'user', content: userMessage }].map(m => ({
            role: m.role,
            content: m.content
          }))
        }),
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      setMessages(prev => [...prev, { role: 'assistant', content: data.message }]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please check your connection or try again later.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    if (window.confirm('Are you sure you want to clear the conversation?')) {
      setMessages([]);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-180px)] max-w-4xl mx-auto">
      {/* Header */}
      <div className={`p-6 border-b flex items-center justify-between ${isLight ? 'border-slate-200' : 'border-white/10'}`}>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
            <Bot className="w-8 h-8" />
          </div>
          <div>
            <h2 className={`text-lg font-black uppercase tracking-tight ${isLight ? 'text-slate-800' : 'text-white'}`}>Bridge AI</h2>
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-500 uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Online Assistant
            </div>
          </div>
        </div>
        
        {messages.length > 0 && (
          <button 
            onClick={clearChat}
            className={`p-2 rounded-xl transition cursor-pointer ${isLight ? 'text-slate-400 hover:text-red-500 hover:bg-red-50' : 'text-slate-500 hover:text-red-400 hover:bg-red-500/10'}`}
            title="Clear Chat"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-60">
            <div className={`p-6 rounded-full ${isLight ? 'bg-slate-100' : 'bg-slate-800'}`}>
              <Sparkles className={`w-12 h-12 ${isLight ? 'text-blue-600' : 'text-blue-400'}`} />
            </div>
            <div className="max-w-xs">
              <h3 className={`text-lg font-bold ${isLight ? 'text-slate-800' : 'text-white'}`}>How can I help you today?</h3>
              <p className={`text-sm mt-1 leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                Ask me about exam concepts, study tips, or any subject-specific questions.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-8 w-full max-w-md">
              {[
                "Explain Newton's Laws",
                "History of Ethiopia in 19th Century",
                "Tips for Mathematics exam",
                "Biology Cell structures summary"
              ].map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => {
                    setInput(prompt);
                    // Triggering send manually would be better but let's just prefill
                  }}
                  className={`p-3 text-xs font-bold rounded-xl border text-left transition cursor-pointer ${
                    isLight 
                      ? 'bg-white border-slate-200 text-slate-700 hover:border-blue-600 hover:text-blue-600' 
                      : 'bg-slate-800/40 border-white/5 text-slate-300 hover:border-blue-400 hover:text-blue-400'
                  }`}
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center shadow-md ${
                msg.role === 'assistant' 
                  ? 'bg-blue-600 text-white' 
                  : (isLight ? 'bg-slate-200 text-slate-600' : 'bg-slate-700 text-slate-200')
              }`}>
                {msg.role === 'assistant' ? <Bot className="w-6 h-6" /> : <User className="w-5 h-5" />}
              </div>
              
              <div className={`max-w-[85%] p-4 rounded-2xl shadow-sm leading-relaxed ${
                msg.role === 'assistant'
                  ? (msg.isPremiumNotice 
                      ? (isLight ? 'bg-amber-50 border border-amber-200 text-amber-900' : 'bg-amber-900/10 border border-amber-500/20 text-amber-200')
                      : (isLight ? 'bg-white border border-slate-200 text-slate-800' : 'bg-slate-800 border border-white/5 text-slate-200'))
                  : (isLight ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white')
              }`}>
                <div className={`${msg.isPremiumNotice ? 'text-[11px]' : 'text-sm'} whitespace-pre-wrap`}>{msg.content}</div>
                
                {msg.isPremiumNotice && (
                  <button
                    onClick={() => onNavigate('premium')}
                    className="mt-4 w-full flex items-center justify-center gap-2 py-3 bg-amber-500 hover:bg-amber-400 text-black text-xs font-black uppercase tracking-wider rounded-xl shadow-lg shadow-amber-500/20 transition-all active:scale-95 cursor-pointer"
                  >
                    <Crown className="w-4 h-4" />
                    <span>Unlock Premium</span>
                  </button>
                )}
              </div>
            </motion.div>
          ))
        )}
        
        {isLoading && (
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md">
              <Bot className="w-6 h-6" />
            </div>
            <div className={`p-4 rounded-2xl border flex items-center gap-3 ${isLight ? 'bg-white border-slate-200' : 'bg-slate-800 border-white/5'}`}>
              <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
              <span className={`text-xs font-bold animate-pulse ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>AI Typing...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className={`p-4 border-t ${isLight ? 'border-slate-200 bg-slate-50' : 'border-white/10 bg-slate-900/40'}`}>
        <form onSubmit={handleSend} className="relative flex items-center gap-3 max-w-4xl mx-auto">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isRestricted}
            placeholder={isRestricted ? "Chat locked - Upgrade to Premium" : "Type your message here..."}
            className={`flex-1 p-4 pr-14 text-sm font-medium rounded-2xl border transition outline-none ${
              isRestricted
                ? 'bg-slate-200/50 border-slate-300 text-slate-400 cursor-not-allowed'
                : (isLight 
                    ? 'bg-white border-slate-200 text-slate-800 focus:border-blue-600 shadow-sm' 
                    : 'bg-slate-800 border-white/5 text-white focus:border-blue-500')
            }`}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading || isRestricted}
            className={`absolute right-2 p-2.5 rounded-xl transition cursor-pointer active:scale-90 ${
              input.trim() && !isLoading && !isRestricted
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                : (isRestricted ? 'bg-slate-400 text-white opacity-40 cursor-not-allowed' : 'bg-slate-400 text-white opacity-40 cursor-not-allowed')
            }`}
          >
            {isRestricted ? <Lock className="w-5 h-5" /> : <Send className="w-5 h-5" />}
          </button>
        </form>
        <p className={`text-[10px] text-center mt-3 font-bold uppercase tracking-widest ${isLight ? 'text-slate-400' : 'text-slate-600'}`}>
          {isRestricted ? "Upgrade to Premium to unlock AI Tutor" : "Bridge AI can make mistakes. Verify critical exam info."}
        </p>
      </div>
    </div>
  );
}

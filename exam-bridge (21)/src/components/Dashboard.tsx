/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  BookOpen,
  ClipboardList,
  LineChart,
  BookMarked,
  Video,
  Award,
  Crown,
  Flame,
  Clock,
  ArrowRight,
  ChevronRight,
  Sparkles,
  Search,
  WifiOff,
  HardDrive,
  Bot
} from 'lucide-react';
import { User, LanguageType, StreamType } from '../types';
import { translations } from '../translations';
import { offlineCache } from '../utils/offlineCache';

interface DashboardProps {
  user: User;
  language: LanguageType;
  onNavigate: (view: string, subViewData?: any) => void;
  theme: 'light' | 'dark';
  isOfflineSimulated: boolean;
}

export default function Dashboard({ user, language, onNavigate, theme, isOfflineSimulated }: DashboardProps) {
  const t = translations[language];

  const [cachedSubjectNames, setCachedSubjectNames] = useState<string[]>([]);

  useEffect(() => {
    const fetchCached = async () => {
      try {
        const subs = await offlineCache.getCachedSubjects();
        setCachedSubjectNames(subs.map(s => s.name.toLowerCase()));
      } catch (err) {
        console.error("Failed to fetch offline subjects list", err);
      }
    };
    fetchCached();
  }, []);

  // Subjects lists depending on Stream
  const naturalSubjects = [
    { name: t.biology || "Biology", icon: "🧬", total: 450, acc: 84, prog: 65, color: "from-blue-500/10 to-indigo-500/10 text-blue-400 border-blue-500/20" },
    { name: t.physics || "Physics", icon: "⚛️", total: 420, acc: 78, prog: 40, color: "from-purple-500/10 to-pink-500/10 text-purple-400 border-purple-500/20" },
    { name: t.chemistry || "Chemistry", icon: "🧪", total: 380, acc: 81, prog: 55, color: "from-teal-500/10 to-emerald-500/10 text-teal-400 border-teal-500/20" },
    { name: t.english || "English", icon: "🇬🇧", total: 500, acc: 90, prog: 80, color: "from-red-500/10 to-orange-500/10 text-red-400 border-red-500/20" },
    { name: t.mathematics || "Mathematics", icon: "📐", total: 600, acc: 72, prog: 35, color: "from-amber-500/10 to-yellow-500/10 text-amber-400 border-amber-500/20" },
    { name: t.aptitude || "Aptitude", icon: "🧠", total: 350, acc: 85, prog: 60, color: "from-cyan-500/10 to-blue-500/10 text-cyan-400 border-cyan-500/20" }
  ];

  const socialSubjects = [
    { name: t.history || "History", icon: "📜", total: 480, acc: 88, prog: 75, color: "from-yellow-500/10 to-amber-500/10 text-yellow-400 border-yellow-500/20" },
    { name: t.geography || "Geography", icon: "🌍", total: 410, acc: 82, prog: 50, color: "from-emerald-500/10 to-teal-500/10 text-emerald-400 border-emerald-500/20" },
    { name: t.economics || "Economics", icon: "📈", total: 360, acc: 76, prog: 45, color: "from-green-500/10 to-lime-500/10 text-green-400 border-green-500/20" },
    { name: t.english || "English", icon: "🇬🇧", total: 500, acc: 90, prog: 80, color: "from-red-500/10 to-orange-500/10 text-red-400 border-red-500/20" },
    { name: t.mathematics || "Mathematics", icon: "📐", total: 600, acc: 72, prog: 35, color: "from-amber-500/10 to-yellow-500/10 text-amber-400 border-amber-500/20" },
    { name: t.aptitude || "Aptitude", icon: "🧠", total: 350, acc: 85, prog: 60, color: "from-cyan-500/10 to-blue-500/10 text-cyan-400 border-cyan-500/20" }
  ];

  const subjects = user.stream === 'Social Science' ? socialSubjects : naturalSubjects;

  const isLight = theme === 'light';

  return (
    <div className="space-y-6">
      
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-[20px] bg-gradient-to-r from-[#2563EB] to-[#1e40af] p-3 sm:p-4 text-white shadow-2xl">
        {/* Background glow graphics */}
        <div className="absolute right-0 top-0 -mr-6 -mt-6 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute left-1/3 bottom-0 -mb-10 w-24 h-24 bg-indigo-400/20 rounded-full blur-2xl" />

        <div className="flex items-center justify-between gap-2 relative z-10">
          <div className="min-w-0">
            <h1 className="font-display text-xs sm:text-sm md:text-base font-black text-white leading-tight flex items-center gap-1 sm:gap-1.5 mb-0.5 sm:mb-1 whitespace-nowrap">
              <span className="text-sm sm:text-base md:text-lg shrink-0">👋</span>
              <span className="truncate">{t.welcomeBack}, {user.name}</span>
            </h1>
            <p className="text-[9px] sm:text-[10px] text-blue-100/90 font-sans truncate">
              Stream: <span className="font-bold uppercase tracking-wider">{user.stream === 'Natural Science' ? t.naturalScience : t.socialScience}</span>
            </p>
          </div>

          <button
            onClick={() => onNavigate('premium')}
            className="shrink-0 flex items-center gap-1 sm:gap-1.5 px-2.5 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-900 text-[9px] sm:text-[10px] font-extrabold uppercase tracking-widest shadow-lg shadow-yellow-500/35 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer border border-yellow-300/30 whitespace-nowrap"
          >
            <Crown className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-slate-900 fill-slate-900 animate-pulse shrink-0" />
            <span className="whitespace-nowrap">Upgrade to Premium</span>
          </button>
        </div>
      </div>

      {/* Offline Mode Banner */}
      {isOfflineSimulated && (
        <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-3xl flex gap-3 text-xs leading-relaxed text-amber-400 items-center">
          <WifiOff className="w-5 h-5 text-amber-400 shrink-0 animate-bounce" />
          <div>
            <span className="font-bold uppercase tracking-wider block">Study Offline Mode Active</span>
            Only cached subjects, mock tests, and lecture summaries are fully active. Toggle offline settings in the <span className="underline font-bold cursor-pointer" onClick={() => onNavigate('offline')}>Offline Study Center</span>.
          </div>
        </div>
      )}

      {/* Bridge AI CTA */}
      <div 
        onClick={() => onNavigate('ai')}
        className={`p-5 rounded-[30px] border flex items-center justify-between gap-4 cursor-pointer transition-all duration-200 group ${
          isLight 
            ? 'bg-blue-50 border-blue-100 hover:bg-blue-100/50' 
            : 'bg-gradient-to-r from-blue-600/10 to-indigo-600/5 border-blue-500/20 hover:bg-blue-500/15'
        }`}
      >
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/20 group-hover:scale-105 transition-transform">
            <Bot className="w-10 h-10" />
          </div>
          <div>
            <h4 className={`text-lg font-black uppercase tracking-tight ${isLight ? 'text-blue-800' : 'text-blue-400'}`}>
              Bridge AI Assistant
            </h4>
            <p className={`text-xs mt-0.5 font-medium ${isLight ? 'text-blue-600/70' : 'text-slate-400'}`}>
              Ask anything about your subjects and get instant explanations.
            </p>
          </div>
        </div>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isLight ? 'bg-blue-100 text-blue-600' : 'bg-blue-500/10 text-blue-400'}`}>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>

      {/* Dynamic Subjects Section */}
      <div>
        {/* Subjects List Grid */}
        <div className="flex flex-col gap-3">
          {subjects.map((sub, idx) => {
            const isSubjectCached = cachedSubjectNames.includes(sub.name.toLowerCase());
            const isOfflineDisabled = isOfflineSimulated && !isSubjectCached;

            return (
              <div
                key={idx}
                className={`glass-card p-4 border flex items-center gap-4 relative cursor-pointer group ${
                  isLight ? 'glass-card-light hover:bg-slate-50' : 'hover:bg-white/[0.02]'
                } ${isOfflineDisabled ? 'opacity-40 grayscale pointer-events-none' : ''}`}
                onClick={() => onNavigate('practice', { subject: sub.name })}
              >
                {/* Icon */}
                <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center text-3xl sm:text-4xl shrink-0 ${
                  isLight ? 'bg-slate-100 shadow-inner border border-slate-200/50' : 'bg-slate-800/80 shadow-inner shadow-white/5 border border-white/5'
                }`}>
                  <span className="filter drop-shadow-md">{sub.icon}</span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                  {/* Top Row: Title & Questions Badge */}
                  <div className="flex justify-between items-start mb-1">
                    <div className="flex flex-col items-start gap-1">
                      <h4 className={`font-display text-sm sm:text-base font-bold tracking-wide ${isLight ? 'text-slate-800' : 'text-slate-100'}`}>
                        {sub.name}
                      </h4>
                      <span className={`inline-block text-[8px] sm:text-[9px] font-bold font-mono tracking-wider px-2 py-0.5 rounded ${
                        isLight 
                          ? 'bg-blue-50 text-blue-700 border border-blue-100' 
                          : 'bg-blue-900/30 text-blue-300 border border-blue-500/10'
                      }`}>
                        {sub.name === t.mathematics ? '2012-2018 UEE QUESTIONS' : '2007-2018 MATRIC & UEE QUESTIONS'}
                      </span>
                    </div>
                    
                    {/* Status & Qs Badge */}
                    <div className="flex flex-col items-end gap-1 shrink-0 pr-8">
                      <div className="flex items-center gap-1.5">
                        {isSubjectCached && (
                          <span className="text-[8px] font-black tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded-full flex items-center gap-1 font-mono uppercase">
                            <span>✓</span> CACHED
                          </span>
                        )}
                        {isOfflineDisabled && (
                          <span className="text-[8px] font-black tracking-wider bg-red-500/10 text-red-400 border border-red-500/20 px-1.5 py-0.5 rounded-full flex items-center gap-1 font-mono uppercase animate-pulse">
                            <span>𐄂</span> UNCACHED
                          </span>
                        )}
                        <span className={`text-[9px] sm:text-[10px] font-mono px-2.5 py-0.5 rounded-full font-medium ${
                          isLight ? 'bg-slate-200/70 text-slate-600' : 'bg-[#1e293b] text-slate-400'
                        }`}>
                          {sub.total} Qs
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Progress Row */}
                  <div className="mt-3 w-full pr-12">
                    <div className={`flex justify-between text-[9px] sm:text-[10px] mb-1.5 font-medium ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                      <span>Accuracy: {sub.acc}%</span>
                      <span>Progress: {sub.prog}%</span>
                    </div>
                    <div className={`w-full h-1.5 rounded-full overflow-hidden ${isLight ? 'bg-slate-200' : 'bg-slate-800'}`}>
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                        style={{ width: `${sub.prog}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Right Arrow */}
                <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shrink-0 absolute right-4 top-1/2 -translate-y-1/2 transition-transform group-hover:translate-x-1 ${
                  isLight ? 'bg-slate-200 text-slate-600' : 'bg-slate-800/80 text-slate-400'
                }`}>
                  <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Call to action Premium Banner if free */}
      {!user.isPremium && (
        <div
          onClick={() => onNavigate('premium')}
          className={`relative overflow-hidden rounded-[30px] p-5 flex flex-col sm:flex-row items-center justify-between gap-5 cursor-pointer transition-all duration-300 group border-b-[4px] active:translate-y-0.5 active:border-b-0 ${
            isLight 
              ? 'bg-[#475569] border-[#334155] shadow-xl' 
              : 'bg-[#1e293b] border-[#0f172a] shadow-xl shadow-black/50'
          }`}
        >
          {/* Content Group */}
          <div className="flex flex-row items-center gap-4 text-left">
            {/* Crown Icon with 3D background */}
            <div className="relative shrink-0">
              <div className="w-14 h-14 bg-[#fffbeb] rounded-2xl flex items-center justify-center shadow-md border-b-2 border-amber-100/50">
                <Crown className="w-8 h-8 text-[#f59e0b] fill-[#f59e0b] drop-shadow-[0_2px_0_rgba(180,83,9,0.3)]" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h4 className="text-lg font-black uppercase tracking-tight bg-gradient-to-b from-[#fbbf24] via-[#f59e0b] to-[#d97706] bg-clip-text text-transparent">
                  Unlock Premium
                </h4>
                <span className="px-2 py-0.5 bg-[#fbbf24] text-[#451a03] text-[8px] font-black rounded-full shadow-[0_2px_0_#b45309]">
                  BEST VALUE
                </span>
              </div>
              <p className="text-xs font-medium text-slate-200/90 leading-tight max-w-[200px]">
                Full notes, mock exams, and smart offline study.
              </p>
            </div>
          </div>

          {/* 3D Button */}
          <button 
            id="cta-premium-btn" 
            className="w-full sm:w-auto px-6 py-3 bg-[#fbbf24] hover:bg-[#fcd34d] text-[#1e293b] text-xs font-black rounded-xl shadow-[0_4px_0_#b45309] border border-amber-300 transition-all active:translate-y-0.5 active:shadow-[0_2px_0_#b45309] flex items-center justify-center gap-2"
          >
            Go Premium
          </button>
        </div>
      )}

    </div>
  );
}

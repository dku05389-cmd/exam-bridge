/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion } from 'motion/react';
import { BookOpen, ClipboardList, BookMarked, LineChart, Award, Bot, MessageCircle, HelpCircle } from 'lucide-react';
import { LanguageType } from '../types';
import { translations } from '../translations';
import studentStudyImage from '../assets/images/student_learning_no_text_1782592290760.jpg';

interface QuickAccessProps {
  language: LanguageType;
  onNavigate: (view: string, subViewData?: any) => void;
  theme: 'light' | 'dark';
}

export default function QuickAccess({ language, onNavigate, theme }: QuickAccessProps) {
  const [showSupport, setShowSupport] = useState(false);
  const t = translations[language];
  const isLight = theme === 'light';

  const quickActions = [
    {
      id: 'practice',
      label: t.practice || "Practice",
      icon: <BookOpen className={`w-5 h-5 ${isLight ? 'text-blue-600' : 'text-blue-400'}`} />,
      className: isLight
        ? 'bg-blue-50/90 hover:bg-blue-100 border-blue-200 text-blue-900 shadow-xs'
        : 'bg-blue-500/10 border-blue-500/20 hover:bg-blue-500/20 text-white'
    },
    {
      id: 'mock',
      label: t.mockExams || "Mock Exams",
      icon: <ClipboardList className={`w-5 h-5 ${isLight ? 'text-emerald-600' : 'text-emerald-400'}`} />,
      className: isLight
        ? 'bg-emerald-50/90 hover:bg-emerald-100 border-emerald-200 text-emerald-900 shadow-xs'
        : 'bg-emerald-500/10 border-emerald-500/20 hover:bg-emerald-500/20 text-white'
    },
    {
      id: 'notes',
      label: t.notes || "Notes",
      icon: <BookMarked className={`w-5 h-5 ${isLight ? 'text-amber-600' : 'text-amber-400'}`} />,
      className: isLight
        ? 'bg-amber-50/90 hover:bg-amber-100 border-amber-200 text-amber-900 shadow-xs'
        : 'bg-amber-500/10 border-amber-500/20 hover:bg-amber-500/20 text-white'
    },
    {
      id: 'analytics',
      label: t.analytics || "Analytics",
      icon: <LineChart className={`w-5 h-5 ${isLight ? 'text-purple-600' : 'text-purple-400'}`} />,
      className: isLight
        ? 'bg-purple-50/90 hover:bg-purple-100 border-purple-200 text-purple-900 shadow-xs'
        : 'bg-purple-500/10 border-purple-500/20 hover:bg-purple-500/20 text-white'
    },
    {
      id: 'leaderboard',
      label: t.leaderboard || "Leaderboard",
      icon: <Award className={`w-5 h-5 ${isLight ? 'text-red-600' : 'text-red-400'}`} />,
      className: isLight
        ? 'bg-red-50/90 hover:bg-red-100 border-red-200 text-red-900 shadow-xs'
        : 'bg-red-500/10 border-red-500/20 hover:bg-red-500/20 text-white'
    },
    {
      id: 'ai',
      label: "AI Tutor",
      icon: <Bot className={`w-5 h-5 ${isLight ? 'text-cyan-600' : 'text-cyan-400'}`} />,
      className: isLight
        ? 'bg-cyan-50/90 hover:bg-cyan-100 border-cyan-200 text-cyan-900 shadow-xs'
        : 'bg-cyan-500/10 border-cyan-500/20 hover:bg-cyan-500/20 text-white'
    },
  ];

  return (
    <div className="mb-6 space-y-4">
      <div className="grid grid-cols-3 gap-3">
        {quickActions.map((act) => (
          <button
            id={`quick-action-${act.id}`}
            key={act.id}
            onClick={() => onNavigate(act.id)}
            className={`flex flex-col items-center gap-2 p-3 rounded-2xl border text-xs font-bold transition duration-200 cursor-pointer ${act.className}`}
          >
            {act.icon}
            <span className="text-center whitespace-nowrap">{act.label}</span>
          </button>
        ))}
      </div>
      <img
        src={studentStudyImage}
        alt="Student learning"
        className="w-full h-auto rounded-3xl mt-4"
        referrerPolicy="no-referrer"
      />
      
      <motion.div 
        className="relative mt-4 flex gap-2 w-full"
        animate={{ y: [0, -6, 0] }}
        transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
      >
        <button
          onClick={() => setShowSupport(!showSupport)}
          className={`flex items-center gap-2 px-4 py-3 rounded-2xl w-full text-sm font-bold transition duration-200 cursor-pointer border-2 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)] ${isLight ? 'bg-sky-100 text-sky-900' : 'bg-sky-500/20 text-white'}`}
        >
          <MessageCircle className="w-5 h-5" />
          Get Support
        </button>
        <button
          onClick={() => setShowSupport(!showSupport)}
          className={`p-3 rounded-2xl transition duration-200 cursor-pointer border-2 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)] ${isLight ? 'bg-sky-100 hover:bg-sky-200 text-sky-900' : 'bg-sky-500/20 hover:bg-sky-500/30 text-white'}`}
          title="Telegram Support"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.05-.2-.06-.06-.15-.04-.21-.03-.09.02-1.5.95-4.24 2.78-.4.27-.76.4-1.09.39-.36-.01-1.05-.2-1.57-.37-.63-.2-1.13-.31-1.08-.66.02-.13.21-.26.58-.4 2.28-.99 3.91-1.7 4.9-2.12 2.33-1.01 2.81-1.18 3.13-1.19.07 0 .23.01.33.09.08.07.1.16.12.23.01.05.01.12.01.2z" />
          </svg>
        </button>
        {showSupport && (
          <div className={`absolute bottom-full left-0 mb-2 w-full rounded-2xl p-2 shadow-lg z-10 ${isLight ? 'bg-white border' : 'bg-slate-800'}`}>
            <button className={`w-full flex items-center gap-2 text-left px-4 py-2 rounded-xl text-sm ${isLight ? 'hover:bg-slate-100 text-slate-800' : 'hover:bg-slate-700 text-white'}`}>
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.05-.2-.06-.06-.15-.04-.21-.03-.09.02-1.5.95-4.24 2.78-.4.27-.76.4-1.09.39-.36-.01-1.05-.2-1.57-.37-.63-.2-1.13-.31-1.08-.66.02-.13.21-.26.58-.4 2.28-.99 3.91-1.7 4.9-2.12 2.33-1.01 2.81-1.18 3.13-1.19.07 0 .23.01.33.09.08.07.1.16.12.23.01.05.01.12.01.2z" />
              </svg>
              Get Support
            </button>
            <button className={`w-full flex items-center gap-2 text-left px-4 py-2 rounded-xl text-sm ${isLight ? 'hover:bg-slate-100 text-slate-800' : 'hover:bg-slate-700 text-white'}`}>
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.05-.2-.06-.06-.15-.04-.21-.03-.09.02-1.5.95-4.24 2.78-.4.27-.76.4-1.09.39-.36-.01-1.05-.2-1.57-.37-.63-.2-1.13-.31-1.08-.66.02-.13.21-.26.58-.4 2.28-.99 3.91-1.7 4.9-2.12 2.33-1.01 2.81-1.18 3.13-1.19.07 0 .23.01.33.09.08.07.1.16.12.23.01.05.01.12.01.2z" />
              </svg>
              Join Community
            </button>
          </div>
        )}
      </motion.div>
      <motion.div 
        className="mt-2 flex gap-2 w-full"
        animate={{ y: [0, -6, 0] }}
        transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut", delay: 0.2 }}
      >
        <button
          onClick={() => onNavigate('faq')}
          className={`flex items-center gap-2 px-4 py-3 rounded-2xl w-full text-sm font-bold transition duration-200 cursor-pointer border-2 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)] ${isLight ? 'bg-sky-100 hover:bg-sky-200 text-sky-900' : 'bg-sky-500/20 hover:bg-sky-500/30 text-white'}`}
        >
          <HelpCircle className="w-5 h-5" />
          FAQs & Guide
        </button>
        <button
          onClick={() => onNavigate('faq')}
          className={`px-4 py-3 rounded-2xl text-xs font-bold transition duration-200 cursor-pointer border-2 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)] whitespace-nowrap ${isLight ? 'bg-sky-100 hover:bg-sky-200 text-sky-900' : 'bg-sky-500/20 hover:bg-sky-500/30 text-white'}`}
        >
          View
        </button>
      </motion.div>
    </div>
  );
}

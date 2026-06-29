/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Home, ClipboardList, BookOpen, User, MessageCircle, Bot } from 'lucide-react';
import { AppTheme, LanguageType } from '../types';
import { translations } from '../translations';

interface BottomNavigationProps {
  currentView: string;
  language: LanguageType;
  theme: AppTheme;
  focusMode?: boolean;
  onNavigate: (view: string) => void;
}

export default function BottomNavigation({ currentView, language, theme, focusMode, onNavigate }: BottomNavigationProps) {
  const t = translations[language];

  const allTabs = [
    { id: 'exams', label: t.exams || "Exams", icon: <ClipboardList className="w-5 h-5" /> },
    { id: 'home', label: t.home || "Home", icon: <Home className="w-5 h-5" /> },
    { id: 'ai', label: "Bridge AI", icon: <Bot className="w-6 h-6" /> },
    { id: 'notes', label: t.notes || "Notes", icon: <BookOpen className="w-5 h-5" /> },
    { id: 'profile', label: t.profile || "Profile", icon: <User className="w-5 h-5" /> }
  ];

  // Restrict distracting items in focus mode
  const tabs = focusMode 
    ? allTabs.filter(tab => ['exams', 'notes', 'ai'].includes(tab.id))
    : allTabs;

  const isLight = theme === 'light';

  return (
    <nav
      id="app-bottom-nav"
      className="fixed bottom-0 inset-x-0 bg-[#0B0F19] text-slate-100 border-t border-white/5 shadow-[0_-10px_40px_rgba(0,0,0,0.45)] z-30"
    >
      <div className="max-w-md mx-auto flex justify-between items-center px-3 py-2">
        {tabs.map((tab) => {
          const isActive = currentView === tab.id;
          return (
            <button
              id={`nav-tab-${tab.id}`}
              key={tab.id}
              onClick={() => onNavigate(tab.id)}
              className="flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl transition duration-200 focus:outline-none cursor-pointer relative"
            >
              {/* Highlight Circle for Active Status */}
              <div
                className={`flex items-center justify-center p-2 rounded-xl transition duration-300 ${
                  isActive
                    ? 'bg-[#2563EB] text-white scale-110 shadow-lg shadow-[#2563EB]/30'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {tab.icon}
              </div>

              {/* Label */}
              <span
                className={`text-[10px] mt-1 font-bold tracking-wide transition duration-200 ${
                  isActive
                    ? 'text-white opacity-100 scale-105'
                    : 'text-white/90 opacity-90'
                }`}
              >
                {tab.label}
              </span>

              {/* Dot Under Active */}
              {isActive && (
                <span className="absolute bottom-0 w-1 h-1 bg-[#2563EB] rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

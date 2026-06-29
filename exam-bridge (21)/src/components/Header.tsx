/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Menu, Sun, Moon, ArrowLeft } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AppTheme, LanguageType } from '../types';
import { translations } from '../translations';

interface HeaderProps {
  title: string;
  theme: AppTheme;
  language: LanguageType;
  onSetTheme: (theme: AppTheme) => void;
  onOpenSidebar: () => void;
  onNavigate?: (view: string) => void;
  showBack?: boolean;
  onBack?: () => void;
  isOnline?: boolean;
  syncStatus?: { lastSynced: string | null; isDownloading: boolean; progress: number };
}

export default function Header({ title, theme, language, onSetTheme, onOpenSidebar, onNavigate, showBack, onBack, isOnline, syncStatus }: HeaderProps) {
  const t = translations[language];
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowThemeMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Map standardized title keys to translated titles if matching exists
  const getTranslatedTitle = (inputTitle: string) => {
    const key = inputTitle.toLowerCase().replace(/\s+/g, '');
    if (key === 'home') return t.appName || "Exam Bridge";
    if (key === 'faq' || key === 'support') return t.faq || "Frequently Asked Questions";
    if (key === 'exams') return t.exams || "Exams";
    if (key === 'uee') return t.uee || "UEE";
    if (key === 'notes') return t.notes || "Notes";
    if (key === 'settings') return t.settings || "Settings";
    if (key === 'profile') return t.profile || "Profile";
    if (key === 'payment') return t.payment || "Payment";
    if (key === 'aboutus') return t.aboutUs || "About Us";
    if (key === 'leaderboard') return t.leaderboard || "Leaderboard";
    if (key === 'premium') return t.premium || "Premium";
    if (key === 'adminpanel') return t.admin || "Admin Panel";
    return inputTitle; // Fallback e.g. "Grade 12 Biology"
  };

  return (
    <header
      id="app-header"
      className="shrink-0 w-full bg-[#032B43] text-white shadow-2xl z-20"
    >
      <div className="max-w-7xl mx-auto px-2.5 py-3.5 flex items-center justify-between">
        {/* Left Side: Hamburger Menu or Back Button & Title */}
        <div className="flex items-center gap-2 sm:gap-3">
          {showBack ? (
            <button
              id="hdr-back-btn"
              onClick={onBack}
              className="p-1.5 hover:bg-white/15 rounded-xl transition cursor-pointer active:scale-95 -ml-1.5"
              aria-label="Back"
            >
              <ArrowLeft className="w-6 h-6 text-white" />
            </button>
          ) : (
            <button
              id="hdr-menu-btn"
              onClick={onOpenSidebar}
              className="p-1.5 hover:bg-white/15 rounded-xl transition cursor-pointer active:scale-95 -ml-1.5"
              aria-label="Open Sidebar Menu"
            >
              <Menu className="w-6 h-6 text-white" />
            </button>
          )}

          <h2 className="font-display font-bold text-lg sm:text-xl tracking-tight leading-tight select-none">
            {getTranslatedTitle(title)}
          </h2>
        </div>

        {/* Right Side: Theme Toggle & Menu */}
        <div className="flex items-center gap-3 relative" ref={menuRef}>
          {/* Connectivity Badge */}


          {syncStatus?.isDownloading && (
            <div className="flex items-center gap-2 px-2 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full">
              <div className="w-2 h-2 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-[9px] font-bold text-blue-500">{syncStatus.progress}%</span>
            </div>
          )}

          <button
            id="hdr-theme-btn"
            onClick={() => setShowThemeMenu(!showThemeMenu)}
            className="p-2 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl transition cursor-pointer active:scale-95"
            title="Change Theme"
          >
            {theme === 'dark' ? (
              <Moon className="w-5 h-5 text-blue-300" />
            ) : (
              <Sun className="w-5 h-5 text-amber-400" />
            )}
          </button>

          <AnimatePresence>
            {showThemeMenu && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 py-2 z-50 overflow-hidden"
              >
                <p className="px-4 py-2 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                  Theme
                </p>
                {[
                  { id: 'light', label: 'Light Mode', icon: Sun, color: 'text-amber-500' },
                  { id: 'dark', label: 'Dark Mode', icon: Moon, color: 'text-blue-400' }
                ].map((option) => (
                  <button
                    key={option.id}
                    onClick={() => {
                      onSetTheme(option.id as AppTheme);
                      setShowThemeMenu(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold transition-colors cursor-pointer ${
                      theme === option.id 
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' 
                        : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                    }`}
                  >
                    <option.icon className={`w-4 h-4 ${option.color}`} />
                    {option.label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}

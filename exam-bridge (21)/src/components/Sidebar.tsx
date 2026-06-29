/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Crown,
  Settings,
  ShieldCheck,
  Info,
  Star,
  LogOut,
  Languages,
  ArrowRight,
  WifiOff
} from 'lucide-react';
import { User, LanguageType } from '../types';
import { translations } from '../translations';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  language: LanguageType;
  focusMode?: boolean;
  onChangeLanguage: (lang: LanguageType) => void;
  onNavigate: (view: string) => void;
  onLogout: () => void;
}

export default function Sidebar({
  isOpen,
  onClose,
  user,
  language,
  focusMode,
  onChangeLanguage,
  onNavigate,
  onLogout
}: SidebarProps) {
  const t = translations[language];

  const allMenuItems = [
    { label: t.premium, icon: <Crown className="w-5 h-5 text-amber-400" />, view: 'premium' },
    { label: t.settings, icon: <Settings className="w-5 h-5" />, view: 'settings' },
    { label: t.admin, icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />, view: 'admin' },
    { label: t.aboutUs, icon: <Info className="w-5 h-5" />, view: 'about' },
  ];

  // Restrict items in focus mode
  const menuItems = focusMode
    ? allMenuItems.filter(item => ['settings'].includes(item.view))
    : allMenuItems;

  const languages: { code: LanguageType; label: string }[] = [
    { code: 'en', label: 'English' },
    { code: 'am', label: 'አማርኛ' },
    { code: 'om', label: 'Oromoo' },
    { code: 'ti', label: 'ትግርኛ' }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-40 backdrop-blur-xs"
          />

          {/* Sliding Menu Panel */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 left-0 w-80 max-w-[85vw] bg-slate-900 border-r border-white/10 text-white z-50 flex flex-col justify-between shadow-2xl"
          >
            {/* Header / Brand */}
            <div className="p-5 border-b border-white/5 bg-slate-950/40">
              <div className="flex items-center justify-between mb-4">
                <span className="font-display font-extrabold text-lg tracking-wider text-blue-400 flex items-center gap-1.5">
                  🎓 EXAM BRIDGE
                </span>
                <button
                  id="side-close-btn"
                  onClick={onClose}
                  className="p-1.5 hover:bg-white/20 rounded-xl text-white transition cursor-pointer active:scale-95 border border-white/20"
                >
                  <X className="w-7 h-7 stroke-[3px] text-white" />
                </button>
              </div>

              {/* Student Card Summary */}
              {user && (
                <div className="flex items-center gap-3 p-3 bg-white/5 border border-white/5 rounded-2xl overflow-hidden">
                  <div className="shrink-0 w-12 h-12 rounded-xl bg-blue-500/10 border border-white/5 flex items-center justify-center overflow-hidden">
                    {user.avatar.startsWith('data:image') || user.avatar.startsWith('http') ? (
                      <img 
                        src={user.avatar} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <span className="text-2xl truncate max-w-full">
                        {user.avatar.length > 4 ? user.avatar.substring(0, 2) : user.avatar}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-black text-white truncate uppercase tracking-tight">{user.name}</h4>
                    <p className="text-[9px] text-slate-500 font-mono truncate tracking-tighter mb-1.5">{user.id}</p>
                    <div className="flex items-center gap-2">
                      <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-md ${
                        user.isPremium ? 'bg-amber-500/20 text-amber-500 border border-amber-500/20' : 'bg-slate-800 text-slate-400 border border-white/5'
                      }`}>
                        {user.isPremium ? 'PREMIUM' : 'FREE'}
                      </span>
                      <div className="flex items-center gap-1">
                        <div className="w-1 h-1 rounded-full bg-blue-500 animate-pulse" />
                        <span className="text-[8px] text-slate-500 font-bold uppercase tracking-widest">Streak: {user.studyStreak}d</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Menu Links */}
            <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1.5 no-scrollbar">
              {menuItems.map((item) => (
                <button
                  id={`side-menu-${item.view}`}
                  key={item.view}
                  onClick={() => {
                    onNavigate(item.view);
                    onClose();
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white/5 text-slate-300 hover:text-white transition duration-200 cursor-pointer group text-left"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-slate-400 group-hover:text-blue-400 transition">
                      {item.icon}
                    </span>
                    <span className="text-sm font-semibold">{item.label}</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-600 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition duration-200" />
                </button>
              ))}

              {/* Rate App Button */}
              {!focusMode && (
                <button
                  id="side-rate-btn"
                  onClick={() => {
                    alert("Thank you for rating Exam Bridge with 5 Stars! ⭐️");
                    onClose();
                  }}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 text-slate-300 hover:text-white transition duration-200 cursor-pointer text-left"
                >
                  <Star className="w-5 h-5 text-amber-400" />
                  <span className="text-sm font-semibold">{t.rateApp || "Rate This App"}</span>
                </button>
              )}
            </div>

            {/* Language Quick-select + Logout */}
            <div className="p-5 border-t border-white/5 bg-slate-950/20">
              {/* Language Section */}
              <div className="mb-4">
                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold mb-2">
                  <Languages className="w-3.5 h-3.5" />
                  <span>{t.language || "Language"}</span>
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  {languages.map((lang) => (
                    <button
                      id={`side-lang-${lang.code}`}
                      key={lang.code}
                      onClick={() => onChangeLanguage(lang.code)}
                      className={`py-1.5 text-[10px] font-bold rounded-lg border transition-all cursor-pointer ${
                        language === lang.code
                          ? 'bg-blue-600/20 border-blue-500 text-blue-300 shadow'
                          : 'bg-slate-800/50 border-white/5 text-slate-400 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Logout Button */}
              <button
                id="side-logout-btn"
                onClick={() => {
                  onLogout();
                  onClose();
                }}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-red-950/30 hover:bg-red-900/40 border border-red-500/20 text-red-400 hover:text-red-300 text-xs font-bold transition duration-200 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>{t.logout || "Logout"}</span>
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  User as UserIcon, 
  Settings, 
  ChevronRight, 
  CheckCircle2, 
  Mail, 
  Star, 
  ShieldCheck, 
  Bell, 
  BarChart3, 
  HelpCircle,
  Trophy,
  Target,
  Zap,
  Medal,
  Edit2,
  Camera,
  X,
  Smile,
  CloudDownload,
  Clock,
  Wifi,
  WifiOff
} from 'lucide-react';
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LanguageType, User as UserType, AppTheme } from '../types';
import { translations } from '../translations';

interface ProfileViewProps {
  user: UserType;
  language: LanguageType;
  theme?: AppTheme;
  focusMode?: boolean;
  isOnline?: boolean;
  onNavigate: (view: string) => void;
  onUpdateUser?: (updatedUser: UserType) => void;
}

export default function ProfileView({ user, language, theme = 'dark', focusMode, isOnline, onNavigate, onUpdateUser }: ProfileViewProps) {
  const t = translations[language];
  const isLight = theme === 'light';
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const emojis = ['👨‍🎓', '👩‍🎓', '🧑‍💻', '🧠', '📚', '🚀', '🏆', '🥇', '🎯', '💡', '🦁', '🦅', '🔥', '✨', '💻', '📝'];

  const allMenuItems = [
    { id: 'edit', label: 'Edit Profile', subLabel: 'Update your personal information', icon: <UserIcon className="w-5 h-5 text-blue-500" />, bgColor: 'bg-blue-50 dark:bg-blue-900/20' },
    { id: 'security', label: 'Account & Security', subLabel: 'Manage password and security', icon: <ShieldCheck className="w-5 h-5 text-emerald-500" />, bgColor: 'bg-emerald-50 dark:bg-emerald-900/20' },
    { id: 'notifications', label: 'Notifications', subLabel: 'Manage notification preferences', icon: <Bell className="w-5 h-5 text-purple-500" />, bgColor: 'bg-purple-50 dark:bg-purple-900/20' },
    { id: 'analytics', label: 'Performance', subLabel: 'View your learning analytics', icon: <BarChart3 className="w-5 h-5 text-amber-500" />, bgColor: 'bg-amber-50 dark:bg-amber-900/20' },
    { id: 'help', label: 'Help & Support', subLabel: 'Get help and contact support', icon: <HelpCircle className="w-5 h-5 text-sky-500" />, bgColor: 'bg-sky-50 dark:bg-sky-900/20' },
  ];

  // Restrict items in focus mode
  const menuItems = focusMode
    ? allMenuItems.filter(item => ['edit', 'security'].includes(item.id))
    : allMenuItems;

  const achievements = [
    { label: 'Exams Taken', value: '12', icon: <Trophy className="w-6 h-6 text-emerald-500" />, bgColor: 'bg-emerald-50 dark:bg-emerald-900/20' },
    { label: 'Average Score', value: '85%', icon: <Target className="w-6 h-6 text-blue-500" />, bgColor: 'bg-blue-50 dark:bg-blue-900/20' },
    { label: 'Day Streak', value: '35', icon: <Zap className="w-6 h-6 text-purple-500" />, bgColor: 'bg-purple-50 dark:bg-purple-900/20' },
    { label: 'Badges Earned', value: '5', icon: <Medal className="w-6 h-6 text-amber-500" />, bgColor: 'bg-amber-50 dark:bg-amber-900/20' },
  ];

  const handleAvatarUpdate = (newAvatar: string) => {
    if (onUpdateUser) {
      onUpdateUser({
        ...user,
        avatar: newAvatar
      });
    }
    setShowAvatarPicker(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleAvatarUpdate(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Profile Header Card */}
      <div className={`relative overflow-hidden rounded-[2.5rem] shadow-xl ${isLight ? 'bg-white' : 'bg-slate-900/80 border border-white/5'}`}>
        {/* Subtle Background Pattern */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-sky-500/10 rounded-full -ml-12 -mb-12 blur-2xl"></div>

        <div className="relative p-8">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div 
                  className="w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-lg border-4 border-white dark:border-slate-800 overflow-hidden cursor-pointer group relative"
                  onClick={() => setShowAvatarPicker(true)}
                >
                  {user.avatar && (user.avatar.startsWith('data:image') || user.avatar.startsWith('http')) ? (
                    <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <span className="text-4xl">
                      {user.avatar && user.avatar.length > 4 ? user.avatar.substring(0, 2) : (user.avatar || '👨‍🎓')}
                    </span>
                  )}
                  
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div className="absolute bottom-1 right-1 bg-blue-500 rounded-full border-2 border-white dark:border-slate-800 p-0.5 shadow-sm">
                  <CheckCircle2 className="w-4 h-4 text-white" />
                </div>
              </div>
              <div className="space-y-1.5">
                <h2 className={`text-3xl font-extrabold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  {user.name}
                </h2>
                <p className={`text-sm font-medium flex items-center gap-1.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                  Stream: <span className="text-blue-500 font-bold">{user.stream}</span>
                </p>
                <div className="flex items-center gap-2 bg-emerald-500 px-3 py-1.5 rounded-lg w-fit shadow-md whitespace-nowrap">
                  <Star className="w-3.5 h-3.5 text-white fill-white" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">Active Learner</span>
                </div>
              </div>
            </div>
            <button 
              onClick={() => onNavigate('settings')}
              className={`p-2.5 rounded-2xl transition duration-200 shadow-sm border ${isLight ? 'bg-white border-slate-100 text-slate-400 hover:text-blue-600' : 'bg-slate-800 border-white/10 text-slate-500 hover:text-blue-400'}`}
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4">
            <div className={`flex items-center gap-3 p-4 rounded-3xl border ${isLight ? 'bg-sky-50/30 border-sky-100/50' : 'bg-slate-800/50 border-white/5'}`}>
              <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-xl">
                <Mail className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="overflow-hidden">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Email</p>
                <p className={`text-xs font-bold truncate ${isLight ? 'text-slate-900' : 'text-white'}`}>{user.email}</p>
              </div>
            </div>
            <div className={`flex items-center gap-3 p-4 rounded-3xl border ${isLight ? 'bg-amber-50/30 border-amber-100/50' : 'bg-slate-800/50 border-white/5'}`}>
              <div className="p-2 bg-amber-100 dark:bg-amber-900/40 rounded-xl">
                <Star className="w-4 h-4 text-amber-500" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Points</p>
                <p className={`text-xs font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>{user.points}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Avatar Picker Modal */}
      <AnimatePresence>
        {showAvatarPicker && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAvatarPicker(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className={`relative w-full max-w-sm rounded-[2.5rem] shadow-2xl overflow-hidden ${isLight ? 'bg-white' : 'bg-slate-900 border border-white/10'}`}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className={`text-xl font-black ${isLight ? 'text-slate-900' : 'text-white'}`}>Update Avatar</h3>
                  <button onClick={() => setShowAvatarPicker(false)} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-colors">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Upload Section */}
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 px-1">Upload Photo</p>
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 border-dashed transition-all duration-200 ${isLight ? 'bg-slate-50 border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 text-slate-600' : 'bg-slate-800/50 border-white/10 hover:border-blue-500 hover:bg-blue-500/5 text-slate-300'}`}
                    >
                      <div className="p-3 bg-blue-500/10 rounded-xl">
                        <Camera className="w-6 h-6 text-blue-500" />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-bold">Choose from Gallery</p>
                        <p className="text-[10px] opacity-60">PNG, JPG up to 5MB</p>
                      </div>
                    </button>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleFileUpload} 
                      className="hidden" 
                      accept="image/*" 
                    />
                  </div>

                  {/* Emoji Picker Section */}
                  <div>
                    <div className="flex items-center gap-2 mb-3 px-1">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Choose Emoji</p>
                      <Smile className="w-3 h-3 text-slate-400" />
                    </div>
                    <div className="grid grid-cols-4 gap-3">
                      {emojis.map((emoji) => (
                        <button
                          key={emoji}
                          onClick={() => handleAvatarUpdate(emoji)}
                          className={`aspect-square flex items-center justify-center text-2xl rounded-2xl transition duration-200 hover:scale-110 active:scale-95 ${isLight ? 'bg-slate-100 hover:bg-slate-200' : 'bg-slate-800 hover:bg-slate-700'}`}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className={`p-4 text-center border-t ${isLight ? 'bg-slate-50/50 border-slate-100' : 'bg-white/5 border-white/5'}`}>
                <button 
                  onClick={() => handleAvatarUpdate('')}
                  className="text-xs font-bold text-red-500 hover:underline transition-all"
                >
                  Remove Avatar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Menu List */}
      <div className={`rounded-[2rem] overflow-hidden border ${isLight ? 'bg-white border-slate-100 shadow-sm' : 'bg-slate-900/60 border-white/5'}`}>
        {menuItems.map((item, idx) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id === 'help' ? 'faq' : 'settings')}
            className={`w-full flex items-center justify-between p-5 transition duration-200 group ${
              idx !== menuItems.length - 1 ? (isLight ? 'border-b border-slate-50' : 'border-b border-white/5') : ''
            } hover:bg-slate-50 dark:hover:bg-white/5`}
          >
            <div className="flex items-center gap-4">
              <div className={`p-2.5 rounded-2xl ${item.bgColor} transition-transform group-hover:scale-110 duration-200`}>
                {item.icon}
              </div>
              <div className="text-left">
                <p className={`text-sm font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>{item.label}</p>
                <p className="text-[10px] text-slate-500 font-medium">{item.subLabel}</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-blue-500 transition-colors" />
          </button>
        ))}
      </div>

      {/* Achievements Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h3 className={`text-sm font-extrabold uppercase tracking-widest ${isLight ? 'text-slate-900' : 'text-white'}`}>
            Your Achievements
          </h3>
          <button className="text-[10px] font-bold text-blue-500 flex items-center gap-1 hover:underline">
            View All <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {achievements.map((ach) => (
            <div 
              key={ach.label}
              className={`p-5 rounded-[2rem] border flex flex-col items-center gap-3 transition duration-200 hover:shadow-md ${
                isLight ? 'bg-white border-slate-100' : 'bg-slate-900/60 border-white/5'
              }`}
            >
              <div className={`p-3 rounded-2xl ${ach.bgColor}`}>
                {ach.icon}
              </div>
              <div className="text-center">
                <p className={`text-lg font-black ${isLight ? 'text-slate-900' : 'text-white'}`}>{ach.value}</p>
                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter whitespace-nowrap">{ach.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

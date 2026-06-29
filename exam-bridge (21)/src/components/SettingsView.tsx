/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion } from 'motion/react';
import {
  Edit2,
  Share2,
  Copy,
  Languages,
  ArrowRight,
  Calendar,
  Building2,
  Save,
  BookOpen,
  Focus
} from 'lucide-react';
import { User, LanguageType, AppTheme } from '../types';
import { translations } from '../translations';

interface SettingsViewProps {
  user: User;
  language: LanguageType;
  theme: AppTheme;
  focusMode: boolean;
  onToggleFocusMode: () => void;
  onUpdateUser: (updatedUser: User) => void;
  onChangeLanguage: (lang: LanguageType) => void;
  onSetTheme: (theme: AppTheme) => void;
  onNavigate: (view: string) => void;
  onLogout: () => void;
}

export default function SettingsView({
  user,
  language,
  theme,
  focusMode,
  onToggleFocusMode,
  onUpdateUser,
  onChangeLanguage,
  onSetTheme,
  onNavigate,
  onLogout
}: SettingsViewProps) {
  const t = translations[language];

  const [isEditing, setIsEditing] = useState(false);
  const [showLanguageOptions, setShowLanguageOptions] = useState(false);
  const [editedName, setEditedName] = useState(user.name);
  const [editedSchool, setEditedSchool] = useState(user.school);
  const [editedPassword, setEditedPassword] = useState('••••••••');

  const [copyReferralSuccess, setCopyReferralSuccess] = useState(false);
  const [copyIdSuccess, setCopyIdSuccess] = useState(false);

  // Generate unique referral link
  const referralLink = `${window.location.origin}/ref/${user.id}`;

  const handleCopyReferral = () => {
    navigator.clipboard.writeText(referralLink);
    setCopyReferralSuccess(true);
    setTimeout(() => setCopyReferralSuccess(false), 2000);
  };

  const handleCopyStudentId = () => {
    navigator.clipboard.writeText(user.id);
    setCopyIdSuccess(true);
    setTimeout(() => setCopyIdSuccess(false), 2000);
  };

  const handleShareReferral = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Join Exam Bridge',
        text: 'Prepare smarter for your Ethiopian University Entrance Exams with me!',
        url: referralLink,
      }).catch(err => console.log(err));
    } else {
      alert(`Share link copied: ${referralLink}`);
      handleCopyReferral();
    }
  };

  const handleSaveProfile = () => {
    if (!editedName || !editedSchool) {
      alert("Name and school cannot be blank.");
      return;
    }

    onUpdateUser({
      ...user,
      name: editedName,
      school: editedSchool
    });

    setIsEditing(false);
  };

  const isLight = theme === 'light';

  return (
    <div className="space-y-6 max-w-xl mx-auto text-left">
      
      {/* Top Beautiful Profile Card */}
      <div className={`glass-card p-6 border relative overflow-hidden ${isLight ? 'glass-card-light' : 'border-white/5'}`}>
        <div className="absolute right-0 top-0 -mr-6 -mt-6 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl" />

        <div className="flex justify-between items-start mb-4">
          <h3 className={`text-xs font-bold uppercase tracking-widest ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            {t.profileCardTitle || "Student Profile Card"}
          </h3>

          <button
            id="profile-edit-toggle-btn"
            onClick={() => {
              if (isEditing) {
                handleSaveProfile();
              } else {
                setIsEditing(true);
              }
            }}
            className={`p-2 rounded-xl transition cursor-pointer active:scale-95 flex items-center gap-1.5 text-xs font-bold ${
              isEditing
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30'
                : 'bg-slate-800 hover:bg-slate-700 border border-white/5 text-slate-300'
            }`}
          >
            {isEditing ? (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>{t.save || "Save"}</span>
              </>
            ) : (
              <>
                <Edit2 className="w-3.5 h-3.5" />
                <span>{t.edit || "Edit"}</span>
              </>
            )}
          </button>
        </div>

        {/* Profile Details layout */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
          <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0 shadow-inner overflow-hidden">
            {user.avatar.startsWith('data:image') || user.avatar.startsWith('http') ? (
              <img 
                src={user.avatar} 
                alt="Avatar" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <span className="text-3xl">
                {user.avatar.length > 4 ? user.avatar.substring(0, 2) : user.avatar}
              </span>
            )}
          </div>

          <div className="flex-1 w-full text-center sm:text-left space-y-3">
            
            {/* Editable Fields vs Read-Only Fields */}
            {isEditing ? (
              <div className="space-y-3 pt-1">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase">Full Name</label>
                  <input
                    id="edit-profile-name"
                    type="text"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    className="mt-1 w-full bg-slate-800/80 border border-white/10 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase">School Name</label>
                  <input
                    id="edit-profile-school"
                    type="text"
                    value={editedSchool}
                    onChange={(e) => setEditedSchool(e.target.value)}
                    className="mt-1 w-full bg-slate-800/80 border border-white/10 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase">Change Password</label>
                  <input
                    id="edit-profile-pwd"
                    type="password"
                    value={editedPassword}
                    onChange={(e) => setEditedPassword(e.target.value)}
                    className="mt-1 w-full bg-slate-800/80 border border-white/10 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-1.5">
                <h4 className={`text-lg font-black tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>{user.name}</h4>
                <p className="text-xs text-slate-400 font-sans flex items-center justify-center sm:justify-start gap-1">
                  <Building2 className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span>{user.school}</span>
                </p>

                {/* Student ID Copy Row */}
                <div className="pt-2 flex flex-col sm:flex-row gap-2 items-center sm:items-start">
                  <div className="p-2 bg-slate-950/40 rounded-xl border border-white/5 flex items-center gap-2 font-mono text-[10px] text-slate-300">
                    <span className="text-slate-500">S.ID:</span>
                    <span className="font-bold text-blue-400">{user.id}</span>
                    <button
                      id="sett-copy-sid"
                      onClick={handleCopyStudentId}
                      className="p-1 hover:bg-white/5 text-slate-500 hover:text-white rounded transition cursor-pointer"
                      title="Copy Student ID"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>
                  {copyIdSuccess && (
                    <span className="text-[10px] text-emerald-400 font-semibold mt-1">Copied S.ID!</span>
                  )}
                </div>

                <p className="text-[11px] text-slate-500 font-mono">Phone: {user.phone}</p>
              </div>
            )}

            {/* Premium badge */}
            <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-2 pt-1.5">
              <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border ${
                user.isPremium
                  ? (isLight ? 'bg-amber-100 text-amber-700 border-amber-200' : 'bg-amber-500/10 text-amber-400 border-amber-500/20')
                  : (isLight ? 'bg-slate-100 text-slate-500 border-slate-200' : 'bg-slate-800 text-slate-400 border-white/5')
              }`}>
                {user.isPremium ? t.premiumYearlyMember : t.notPremiumYet}
              </span>
              
              {user.isPremium && (
                <button
                  onClick={() => onUpdateUser({ ...user, isPremium: false, premiumStatus: 'free', premiumJoinedDate: null })}
                  className="text-[9px] font-bold text-red-400 hover:text-red-300 underline cursor-pointer"
                >
                  Cancel Premium
                </button>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* Account enrollment dates (Read only) */}
      <div className={`glass-card p-5 border ${isLight ? 'glass-card-light' : 'border-white/5'}`}>
        <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-1.5">
          <Calendar className="w-4 h-4 text-slate-400" />
          <span>Account Information (Read-Only)</span>
        </h4>

        <div className="grid grid-cols-2 gap-4 text-xs font-sans">
          <div>
            <span className="block text-[10px] text-slate-500 uppercase">{t.regDate || "Registration Date"}</span>
            <span className={`font-semibold ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>{user.registrationDate}</span>
          </div>
          <div>
            <span className="block text-[10px] text-slate-500 uppercase">{t.premJoinDate || "Premium Joined Date"}</span>
            <span className={`font-semibold ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>{user.premiumJoinedDate || "Not Upgraded"}</span>
          </div>
        </div>
      </div>

      {/* Referral Link Box */}
      <div className={`glass-card p-5 border space-y-3 ${isLight ? 'glass-card-light' : 'border-white/5'}`}>
        <div className="flex justify-between items-center">
          <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{t.referralLink || "Your Referral Link"}</h4>
          <span className="px-1.5 py-0.5 bg-blue-500/10 text-blue-400 text-[8px] font-black rounded border border-blue-500/20">POINTS BONUS</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex-1 p-2.5 bg-slate-950/40 border border-white/5 rounded-xl font-mono text-[10px] text-slate-300 truncate select-all">
            {referralLink}
          </div>

          <button
            id="sett-copy-ref"
            onClick={handleCopyReferral}
            className="p-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow cursor-pointer transition flex items-center justify-center shrink-0"
            title="Copy link"
          >
            <Copy className="w-4 h-4" />
          </button>

          <button
            id="sett-share-ref"
            onClick={handleShareReferral}
            className="p-2.5 bg-slate-800 hover:bg-slate-700 border border-white/10 text-slate-300 hover:text-white rounded-xl cursor-pointer transition flex items-center justify-center shrink-0"
            title="Share"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>

        {copyReferralSuccess && (
          <p className="text-[10px] text-emerald-400 font-bold">Referral link copied to clipboard successfully!</p>
        )}
      </div>

      {/* App preferences settings menu items */}
      <div className={`glass-card overflow-hidden border ${isLight ? 'glass-card-light' : 'border-white/5'}`}>
        

        {/* Change Stream action item */}
        <div className="p-4 border-b border-white/5 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
            <BookOpen className="w-4 h-4" />
            <span>{t.academicPref || "Academic Path"}</span>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onUpdateUser({ ...user, stream: 'Natural Science' })}
              className={`py-2 text-[10px] sm:text-xs font-bold rounded-xl border text-center transition cursor-pointer ${
                user.stream === 'Natural Science' 
                  ? 'bg-blue-600 border-blue-500 text-white' 
                  : (isLight ? 'bg-slate-100 border-slate-300 text-slate-600 hover:bg-slate-200' : 'bg-slate-800/50 border-white/5 text-slate-400 hover:bg-slate-800')
              }`}
            >
              Natural Science
            </button>
            <button
              onClick={() => onUpdateUser({ ...user, stream: 'Social Science' })}
              className={`py-2 text-[10px] sm:text-xs font-bold rounded-xl border text-center transition cursor-pointer ${
                user.stream === 'Social Science' 
                  ? 'bg-emerald-600 border-emerald-500 text-white' 
                  : (isLight ? 'bg-slate-100 border-slate-300 text-slate-600 hover:bg-slate-200' : 'bg-slate-800/50 border-white/5 text-slate-400 hover:bg-slate-800')
              }`}
            >
              Social Science
            </button>
          </div>
        </div>

        {/* Multi-language selection Row */}
        <div className="p-4 border-b border-white/5 space-y-3">
          <div 
            className="flex items-center justify-between cursor-pointer"
            onClick={() => setShowLanguageOptions(!showLanguageOptions)}
          >
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
              <Languages className="w-4 h-4" />
              <span>{t.language || "App Language"}</span>
            </div>
            <span className="text-[10px] font-bold text-blue-400">
              {language === 'en' ? 'English' : language === 'am' ? 'አማርኛ' : language === 'om' ? 'Oromoo' : 'ትግርኛ'}
            </span>
          </div>

          {showLanguageOptions && (
            <div className="grid grid-cols-4 gap-2 pt-2">
              {[
                { code: 'en', label: 'English' },
                { code: 'am', label: 'አማርኛ' },
                { code: 'om', label: 'Oromoo' },
                { code: 'ti', label: 'ትግርኛ' }
              ].map((lang) => (
                <button
                  id={`sett-lang-opt-${lang.code}`}
                  key={lang.code}
                  onClick={() => onChangeLanguage(lang.code as LanguageType)}
                  className={`py-2 text-[10px] font-bold rounded-xl border text-center transition cursor-pointer ${
                    language === lang.code
                      ? 'bg-blue-600/20 border-blue-500 text-blue-300 shadow'
                      : 'bg-slate-800/40 border-white/5 text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Logout */}
        <div
          id="sett-logout-row"
          onClick={onLogout}
          className="p-4 flex items-center justify-between cursor-pointer hover:bg-red-500/5 transition text-red-400 hover:text-red-300"
        >
          <span className="text-xs font-bold">{t.logout || "Logout Student Account"}</span>
          <ArrowRight className="w-4 h-4" />
        </div>

      </div>

      {/* Focus Mode & Notifications */}
      <div className={`glass-card p-5 border space-y-4 ${isLight ? 'glass-card-light' : 'border-white/5'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${focusMode ? 'bg-indigo-500/20 text-indigo-400' : 'bg-slate-500/10 text-slate-400'}`}>
              <Focus className="w-5 h-5" />
            </div>
            <div>
              <h4 className={`text-sm font-bold ${isLight ? 'text-slate-800' : 'text-white'}`}>Focus Mode</h4>
              <p className="text-[10px] text-slate-500 font-medium leading-tight">Silence distractions and study deeply.</p>
            </div>
          </div>
          
          <button
            onClick={onToggleFocusMode}
            className={`relative w-12 h-6 rounded-full transition-colors duration-200 focus:outline-none ${focusMode ? 'bg-indigo-600' : 'bg-slate-700'}`}
          >
            <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ${focusMode ? 'translate-x-6' : 'translate-x-0'}`} />
          </button>
        </div>

        {focusMode && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="p-3 bg-indigo-500/5 border border-indigo-500/20 rounded-xl"
          >
            <p className="text-[10px] text-indigo-400 leading-relaxed font-medium">
              ✨ <b>Focus Mode Active:</b> Your notifications are silenced, and distracting menu items are restricted to help you stay in the zone.
            </p>
          </motion.div>
        )}
      </div>


    </div>
  );
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion } from 'motion/react';
import {
  BookOpen,
  Download,
  Check,
  ShieldAlert,
  Crown,
  Trash2,
  HardDrive,
  WifiOff
} from 'lucide-react';
import { mockNotes } from '../data';
import { Note, LanguageType, User, AppTheme } from '../types';
import { translations } from '../translations';

interface NotesViewProps {
  user: User;
  language: LanguageType;
  theme?: AppTheme;
  onNavigate: (view: string) => void;
  downloadedNotes: string[]; // List of note IDs
  onDownloadNote: (noteId: string) => void;
  onDeleteNote: (noteId: string) => void;
  isOfflineSimulated?: boolean;
  isOnline?: boolean;
}

export default function NotesView({
  user,
  language,
  theme = 'dark',
  onNavigate,
  downloadedNotes,
  onDownloadNote,
  onDeleteNote,
  isOfflineSimulated = false,
  isOnline = true
}: NotesViewProps) {
  const t = translations[language];

  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [selectedGrade, setSelectedGrade] = useState<number | 'All'>('All');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  // Filter notes by stream
  const streamNotes = mockNotes.filter(n => n.stream === user.stream);
  const categories = ['All', 'Short Notes', 'PDF Notes', 'Formula Sheets', 'Revision Guides'];
  const subjects = ['All', ...Array.from(new Set(streamNotes.map(n => n.subject)))];
  const grades = ['All', ...Array.from(new Set(streamNotes.map(n => n.grade)))].sort();

  const filteredNotes = streamNotes.filter(n => 
    (activeCategory === 'All' || n.category === activeCategory) &&
    (selectedSubject === 'All' || n.subject === selectedSubject) &&
    (selectedGrade === 'All' || n.grade === selectedGrade)
  );

  const handleDownload = (note: Note) => {
    if (!user.isPremium) {
      alert("Smart Offline Caching is locked for free users. Upgrade to Premium to download notes!");
      onNavigate('premium');
      return;
    }

    setDownloadingId(note.id);
    setTimeout(() => {
      onDownloadNote(note.id);
      setDownloadingId(null);
    }, 1500); // simulate fast download
  };

  // Calculate Cache Usage
  const calculateCacheSize = () => {
    // Arbitrary size for simulation
    const count = downloadedNotes.length;
    if (count === 0) return '0 MB';
    return `${(count * 2.3).toFixed(1)} MB`;
  };

  const isLight = theme === 'light';

  return (
    <div className="space-y-6">
      
      {/* Offline Mode Banner */}
      {isOfflineSimulated && (
        <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-3xl flex gap-3 text-xs leading-relaxed text-amber-400 items-center">
          <WifiOff className="w-5 h-5 text-amber-400 shrink-0 animate-bounce" />
          <div>
            <span className="font-bold uppercase tracking-wider block">Offline Study Active</span>
            Only cached summaries can be read without internet access. Toggle offline states in the <span className="underline font-bold cursor-pointer" onClick={() => onNavigate('offline')}>Offline Center</span>.
          </div>
        </div>
      )}

      {/* Top Banner and Offline Indicator */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className={`text-2xl font-display font-black ${isLight ? 'text-slate-800' : 'text-white'}`}>{t.notes || "Lecture & PDF Notes"}</h2>
          <p className={`text-sm ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Review structured summaries curated by national syllabus examiners.</p>
        </div>

        {/* Cache memory manager */}
        {user.isPremium && (
          <div className={`p-3 border rounded-2xl flex items-center gap-2.5 ${
            isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-900/60 border-white/10'
          }`}>
            <HardDrive className={`w-4.5 h-4.5 ${isLight ? 'text-blue-600' : 'text-blue-400'}`} />
            <div className="text-left font-mono text-[10px]">
              <span className={`block uppercase font-bold tracking-wider ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Offline Cache Space</span>
              <span className={`font-bold ${isLight ? 'text-slate-800' : 'text-white'}`}>{calculateCacheSize()} / Unlimited</span>
            </div>
            {downloadedNotes.length > 0 && (
              <button
                id="notes-clear-cache"
                onClick={() => {
                  if (confirm("Are you sure you want to clear all offline downloads?")) {
                    downloadedNotes.forEach(id => onDeleteNote(id));
                  }
                }}
                className="p-1.5 bg-red-950/30 hover:bg-red-900/40 border border-red-500/20 text-red-400 hover:text-red-300 rounded-lg transition cursor-pointer"
                title="Clear Cache"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Subject and Grade Filters */}
      <div className="space-y-3">
        <div className="flex gap-2 items-center">
          <label className={`text-xs font-bold ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Subject:</label>
          <div className="flex overflow-x-auto gap-2 pb-1 no-scrollbar">
            {subjects.map((sub) => (
              <button
                key={sub}
                onClick={() => { setSelectedSubject(sub); setSelectedGrade('All'); }}
                className={`py-1.5 px-3 text-[10px] font-bold rounded-lg border whitespace-nowrap transition cursor-pointer ${
                  selectedSubject === sub
                    ? (isLight ? 'bg-blue-600 border-blue-600 text-white' : 'bg-blue-500/20 border-blue-500 text-blue-300')
                    : (isLight ? 'bg-white border-slate-200 text-slate-600' : 'bg-slate-800/40 border-white/5 text-slate-400')
                }`}
              >
                {sub}
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex gap-2 items-center">
          <label className={`text-xs font-bold ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Grade:</label>
          <div className="flex overflow-x-auto gap-2 pb-1 no-scrollbar">
            {grades.map((gr) => (
              <button
                key={gr}
                onClick={() => setSelectedGrade(gr as any)}
                className={`py-1.5 px-3 text-[10px] font-bold rounded-lg border whitespace-nowrap transition cursor-pointer ${
                  selectedGrade === gr
                    ? (isLight ? 'bg-blue-600 border-blue-600 text-white' : 'bg-blue-500/20 border-blue-500 text-blue-300')
                    : (isLight ? 'bg-white border-slate-200 text-slate-600' : 'bg-slate-800/40 border-white/5 text-slate-400')
                }`}
              >
                {gr}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex overflow-x-auto pb-1 gap-2 no-scrollbar">
        {categories.map((cat) => (
          <button
            id={`notes-cat-tab-${cat}`}
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`py-2 px-4 text-xs font-bold rounded-xl border whitespace-nowrap transition cursor-pointer ${
              activeCategory === cat
                ? (isLight ? 'bg-blue-600 border-blue-600 text-white shadow' : 'bg-blue-600/25 border-blue-500 text-blue-300 shadow')
                : (isLight ? 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50' : 'bg-slate-800/40 border-white/5 text-slate-400 hover:bg-slate-800')
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Notes Grid Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredNotes.map((note) => {
          const isLocked = note.chapter > 1 && !user.isPremium;
          const isDownloaded = downloadedNotes.includes(note.id);
          const isDownloading = downloadingId === note.id;
          const isOfflineDisabled = isOfflineSimulated && !isDownloaded && !isLocked;

          return (
            <div
              key={note.id}
              className={`p-5 border flex flex-col justify-between min-h-[190px] relative rounded-3xl ${
                isLocked 
                  ? (isLight ? 'border-amber-500/20 bg-amber-500/[0.02] opacity-70' : 'border-amber-500/10 opacity-70') 
                  : (isLight ? 'bg-white border-slate-200/80 shadow-sm' : 'glass-card border-white/5')
              } ${isOfflineDisabled ? 'opacity-40 grayscale pointer-events-none' : ''}`}
            >
              {/* Category tag */}
              <div className="flex justify-between items-start mb-3">
                <div className="flex flex-wrap gap-1.5 items-center">
                  <span className={`px-2.5 py-0.5 border text-[9px] font-black rounded-full uppercase ${
                    isLight ? 'bg-blue-50 border-blue-100 text-blue-700' : 'bg-blue-500/10 border-blue-500/20 text-blue-400'
                  }`}>
                    {note.category}
                  </span>
                  {isOfflineDisabled && (
                    <span className="text-[8px] font-black tracking-wider bg-red-500/10 text-red-400 border border-red-500/20 px-1.5 py-0.5 rounded-full flex items-center gap-1 font-mono uppercase">
                      OFFLINE
                    </span>
                  )}
                  {isDownloaded && !isLocked && (
                    <span className="text-[8px] font-black tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded-full flex items-center gap-1 font-mono uppercase">
                      CACHED
                    </span>
                  )}
                </div>

                {isLocked ? (
                  <span className={`px-2 py-0.5 text-[8px] font-black rounded border flex items-center gap-1 ${
                    isLight ? 'bg-amber-100 border-amber-200 text-amber-700' : 'bg-amber-500/20 border-amber-500/30 text-amber-400'
                  }`}>
                    <Crown className={`w-2.5 h-2.5 ${isLight ? 'fill-amber-600 text-amber-600' : 'fill-amber-400 text-amber-400'}`} />
                    <span>LOCKED</span>
                  </span>
                ) : (
                  <span className={`text-[10px] font-mono ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>{note.fileSize}</span>
                )}
              </div>

              <div>
                <h4 className={`text-sm font-bold mb-2 leading-snug ${isLight ? 'text-slate-800' : 'text-white'}`}>{note.title}</h4>
                {/* Expand content truncated */}
                <p className={`text-xs leading-relaxed font-sans mb-4 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                  {isLocked ? "Upgrade to Premium to read and download the complete lecture materials of this chapter." : note.content}
                </p>
              </div>

              {/* Action Buttons */}
              {!isLocked && (
                <div className={`flex items-center gap-2 pt-3 border-t ${isLight ? 'border-slate-100' : 'border-white/5'}`}>
                  <button
                    id={`notes-open-${note.id}`}
                    disabled={isOfflineDisabled}
                    onClick={() => alert(`Opening ${note.title}. Scroll through details...`)}
                    className={`flex-1 py-2 px-3 text-xs font-bold rounded-xl transition cursor-pointer text-center border ${
                      isOfflineDisabled
                        ? 'bg-slate-800 border-white/5 text-slate-500 cursor-not-allowed'
                        : isLight 
                        ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-800' 
                        : 'bg-slate-800 hover:bg-slate-700 border-white/5 hover:border-white/10 text-white'
                    }`}
                  >
                    {isOfflineDisabled ? 'Unavailable Offline' : 'Open Reader'}
                  </button>

                  {/* Caching button */}
                  {!isOfflineDisabled && (
                    <button
                      id={`notes-dl-${note.id}`}
                      disabled={isDownloading || !isOnline}
                      onClick={() => {
                        if (isDownloaded) {
                          onDeleteNote(note.id);
                        } else {
                          handleDownload(note);
                        }
                      }}
                      className={`p-2.5 rounded-xl border transition cursor-pointer flex items-center justify-center gap-1.5 ${
                        isDownloaded
                          ? (isLight ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400')
                          : isDownloading
                          ? (isLight ? 'bg-blue-50 border-blue-100 text-blue-600 animate-pulse' : 'bg-blue-500/10 border-blue-500/20 text-blue-300 animate-pulse')
                          : isOnline
                          ? (isLight ? 'bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-800 hover:bg-slate-200' : 'bg-slate-800 border-white/5 text-slate-400 hover:text-white')
                          : (isLight ? 'bg-slate-50 border-slate-100 text-slate-300 cursor-not-allowed' : 'bg-slate-800/40 border-white/5 text-slate-600 cursor-not-allowed')
                      }`}
                      title={isDownloaded ? "Delete offline file" : isOnline ? "Download offline" : "Internet connection required"}
                    >
                      {isDownloaded ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span className="text-[10px] font-bold">Cached</span>
                        </>
                      ) : isDownloading ? (
                        <span className="text-[10px] font-bold">Syncing...</span>
                      ) : (
                        <>
                          <Download className="w-4 h-4" />
                          <span className="text-[10px] font-bold">Cache</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              )}

              {/* Locked Upgrade Action */}
              {isLocked && (
                <button
                  id={`notes-lock-btn-${note.id}`}
                  onClick={() => onNavigate('premium')}
                  className="w-full py-2 px-3 bg-amber-500 hover:bg-amber-400 text-black text-xs font-black rounded-xl transition cursor-pointer text-center"
                >
                  Unlock with Premium
                </button>
              )}

            </div>
          );
        })}
      </div>

    </div>
  );
}

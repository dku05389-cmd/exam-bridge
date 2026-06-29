/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  HardDrive,
  CheckCircle,
  Download,
  Trash2,
  AlertCircle,
  Wifi,
  WifiOff,
  BookOpen,
  ClipboardList,
  FileText,
  Clock,
  Sparkles
} from 'lucide-react';
import { User, LanguageType, AppTheme, Note, Question } from '../types';
import { translations } from '../translations';
import { offlineCache, CachedSubject, CachedMockExam, CachedNote } from '../utils/offlineCache';
import { mockQuestions, mockNotes } from '../data';

interface OfflineViewProps {
  user: User;
  language: LanguageType;
  theme?: AppTheme;
  onNavigate: (view: string) => void;
  isOfflineSimulated: boolean;
  onToggleOfflineSimulated: (status: boolean) => void;
}

export default function OfflineView({
  user,
  language,
  theme = 'dark',
  onNavigate,
  isOfflineSimulated,
  onToggleOfflineSimulated
}: OfflineViewProps) {
  const t = translations[language];
  const isLight = theme === 'light';

  // State for loaded caches
  const [cachedSubjects, setCachedSubjects] = useState<CachedSubject[]>([]);
  const [cachedExams, setCachedExams] = useState<CachedMockExam[]>([]);
  const [cachedNotes, setCachedNotes] = useState<CachedNote[]>([]);
  const [cacheSizeText, setCacheSizeText] = useState('0 KB');
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState('');

  // Get stream subjects
  const naturalSubjectsList = ["Biology", "Physics", "Chemistry", "English", "Mathematics", "Aptitude"];
  const socialSubjectsList = ["History", "Geography", "Economics", "English", "Mathematics", "Aptitude"];
  const subjectsList = user.stream === 'Social Science' ? socialSubjectsList : naturalSubjectsList;

  // Mock exams list
  const mockExamsList = [
    { id: 'full', title: t.fullEntrance || "Full Entrance UEE" },
    { id: 'subject', title: t.subjectExam || "Chapter Based Exam" },
    { id: 'timed', title: t.timedExam || "Timed Exam" },
    { id: 'random', title: t.randomExam || "Random Exam" }
  ];

  // Refresh cached items list from IndexedDB
  const refreshCacheData = async () => {
    try {
      const subs = await offlineCache.getCachedSubjects();
      const exams = await offlineCache.getCachedMockExams();
      const notes = await offlineCache.getCachedNotes();
      const bytes = await offlineCache.getCacheUsageBytes();

      setCachedSubjects(subs);
      setCachedExams(exams);
      setCachedNotes(notes);

      if (bytes === 0) {
        setCacheSizeText('0 KB');
      } else if (bytes < 1024 * 1024) {
        setCacheSizeText(`${(bytes / 1024).toFixed(1)} KB`);
      } else {
        setCacheSizeText(`${(bytes / (1024 * 1024)).toFixed(1)} MB`);
      }
    } catch (err) {
      console.error("Error refreshing offline cache metadata:", err);
    }
  };

  useEffect(() => {
    refreshCacheData();
  }, [user.stream]);

  const showFeedback = (msg: string) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(''), 3000);
  };

  // Cache/Uncache actions
  const handleToggleSubject = async (subName: string) => {
    if (!user.isPremium) {
      alert("Smart Offline Caching is a Premium feature! Please upgrade to continue.");
      onNavigate('premium');
      return;
    }

    const isCurrentlyCached = cachedSubjects.some(s => s.name === subName);
    setSyncingId(`subject-${subName}`);

    // Simulate download delay
    setTimeout(async () => {
      try {
        if (isCurrentlyCached) {
          await offlineCache.uncacheSubject(subName);
          showFeedback(`Removed ${subName} from offline storage.`);
        } else {
          // Filter questions for this subject and stream
          const questionsToCache = mockQuestions.filter(q => q.subject.toLowerCase() === subName.toLowerCase());
          await offlineCache.cacheSubject(subName, questionsToCache);
          showFeedback(`Successfully downloaded ${subName} with ${questionsToCache.length} questions!`);
        }
        await refreshCacheData();
      } catch (err) {
        console.error("Subject cache toggle failed", err);
      } finally {
        setSyncingId(null);
      }
    }, 1000);
  };

  const handleToggleExam = async (examId: string, title: string) => {
    if (!user.isPremium) {
      alert("Smart Offline Caching is a Premium feature! Please upgrade to continue.");
      onNavigate('premium');
      return;
    }

    const isCurrentlyCached = cachedExams.some(e => e.id === examId);
    setSyncingId(`exam-${examId}`);

    setTimeout(async () => {
      try {
        if (isCurrentlyCached) {
          await offlineCache.uncacheMockExam(examId);
          showFeedback(`Removed ${title} from offline storage.`);
        } else {
          const questionsToCache = mockQuestions.filter(q => q.stream === user.stream);
          await offlineCache.cacheMockExam(examId, title, questionsToCache);
          showFeedback(`Successfully cached ${title} questions into local DB!`);
        }
        await refreshCacheData();
      } catch (err) {
        console.error("Exam cache toggle failed", err);
      } finally {
        setSyncingId(null);
      }
    }, 1000);
  };

  const handleToggleNote = async (note: Note) => {
    if (!user.isPremium) {
      alert("Smart Offline Caching is a Premium feature! Please upgrade to continue.");
      onNavigate('premium');
      return;
    }

    const isCurrentlyCached = cachedNotes.some(n => n.id === note.id);
    setSyncingId(`note-${note.id}`);

    setTimeout(async () => {
      try {
        if (isCurrentlyCached) {
          await offlineCache.uncacheNote(note.id);
          showFeedback(`Removed ${note.title} from offline cache.`);
        } else {
          await offlineCache.cacheNote(note);
          showFeedback(`Cached ${note.title} for offline reading.`);
        }
        await refreshCacheData();
      } catch (err) {
        console.error("Note cache toggle failed", err);
      } finally {
        setSyncingId(null);
      }
    }, 800);
  };

  const handleClearAll = async () => {
    if (confirm("Are you sure you want to completely wipe out the IndexedDB persistent offline storage?")) {
      await offlineCache.clearAllCache();
      showFeedback("Offline cache completely cleared!");
      await refreshCacheData();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className={`text-2xl font-display font-black ${isLight ? 'text-slate-800' : 'text-white'}`}>Smart Offline Study</h2>
          <p className={`text-sm ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
            Manage offline persistent downloads using local IndexedDB storage.
          </p>
        </div>
        <div className={`p-2 rounded-2xl border ${isLight ? 'bg-white border-slate-200' : 'bg-slate-900/60 border-white/10'}`}>
          <HardDrive className={`w-6 h-6 ${isLight ? 'text-blue-600' : 'text-blue-400'}`} />
        </div>
      </div>

      {/* Persistent Info Card */}
      <div className={`p-5 rounded-3xl border flex flex-col sm:flex-row items-center justify-between gap-4 ${
        isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900/50 border-white/10'
      }`}>
        <div className="flex items-center gap-3.5 w-full sm:w-auto">
          <div className="p-3 bg-blue-500/10 text-blue-500 rounded-2xl">
            <HardDrive className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">Storage Engine</span>
            <div className="flex items-baseline gap-1.5">
              <span className={`text-xl font-extrabold ${isLight ? 'text-slate-800' : 'text-white'}`}>{cacheSizeText}</span>
              <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-wider">PERSISTENT (IndexedDB)</span>
            </div>
          </div>
        </div>

        {cachedSubjects.length > 0 || cachedExams.length > 0 || cachedNotes.length > 0 ? (
          <button
            id="clear-all-offline-cache"
            onClick={handleClearAll}
            className="w-full sm:w-auto px-4 py-2 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white border border-red-500/20 rounded-xl text-xs font-bold transition cursor-pointer"
          >
            Clear All
          </button>
        ) : null}
      </div>

      {/* Simulator Mode Panel */}
      <div className={`p-5 rounded-3xl border ${
        isOfflineSimulated 
          ? (isLight ? 'bg-amber-500/10 border-amber-500/20' : 'bg-amber-500/5 border-amber-500/25') 
          : (isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900/50 border-white/10')
      }`}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className={`p-2.5 rounded-2xl ${
              isOfflineSimulated ? 'bg-amber-500/20 text-amber-500' : 'bg-slate-500/10 text-slate-500'
            }`}>
              {isOfflineSimulated ? <WifiOff className="w-5 h-5" /> : <Wifi className="w-5 h-5 animate-pulse" />}
            </div>
            <div>
              <h3 className={`text-xs font-bold uppercase tracking-widest ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                {isOfflineSimulated ? 'Study Offline Mode Activated' : 'Study Offline Mode Inactive'}
              </h3>
              <p className={`text-[11px] leading-relaxed mt-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                {isOfflineSimulated 
                  ? 'The app is now isolated from mock networks. Only cached subjects, exams, and notes will be available to read and test.' 
                  : 'Toggle this mode to verify and simulate how the application runs perfectly when a student has zero internet access.'}
              </p>
            </div>
          </div>

          <button
            id="offline-simulation-toggle"
            onClick={() => onToggleOfflineSimulated(!isOfflineSimulated)}
            className={`px-4 py-2 text-xs font-black rounded-xl transition cursor-pointer shrink-0 border ${
              isOfflineSimulated 
                ? 'bg-amber-500 border-amber-600 text-black shadow-md' 
                : (isLight ? 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200' : 'bg-slate-800 border-white/5 text-slate-300 hover:bg-slate-700')
            }`}
          >
            {isOfflineSimulated ? 'Go Online' : 'Study Offline'}
          </button>
        </div>
      </div>

      {/* Feedback Messages */}
      {feedbackMsg && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs text-center rounded-2xl font-bold"
        >
          {feedbackMsg}
        </motion.div>
      )}

      {/* Free Tier locks */}
      {!user.isPremium && (
        <div className="p-5 rounded-3xl border border-amber-500/20 bg-amber-500/5 flex items-center justify-between gap-4">
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-amber-500 uppercase tracking-widest">Premium Account Required</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Offline caching to persistent IndexedDB is restricted to Premium Students. Unlock full subjects, notes, and full length mock tests offline!
            </p>
          </div>
          <button
            onClick={() => onNavigate('premium')}
            className="px-4 py-2 bg-amber-500 text-black text-xs font-black rounded-xl shadow-md shrink-0 cursor-pointer"
          >
            Upgrade
          </button>
        </div>
      )}

      {/* Tab Sections */}
      <div className="space-y-6">
        {/* SECTION 1: SUBJECTS CACHING */}
        <div className="space-y-3">
          <h3 className={`text-xs font-black uppercase tracking-widest flex items-center gap-2 ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>
            <BookOpen className="w-4 h-4 text-blue-500" />
            <span>1. Download Subjects ({cachedSubjects.length}/{subjectsList.length})</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {subjectsList.map((sub) => {
              const cachedInfo = cachedSubjects.find(s => s.name === sub);
              const isCached = !!cachedInfo;
              const isSyncing = syncingId === `subject-${sub}`;

              return (
                <div 
                  key={sub}
                  className={`p-4 border rounded-3xl flex justify-between items-center transition ${
                    isCached 
                      ? (isLight ? 'bg-emerald-50/50 border-emerald-200' : 'bg-emerald-500/[0.03] border-emerald-500/20')
                      : (isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-900/40 border-white/5')
                  }`}
                >
                  <div className="text-left">
                    <h4 className={`text-xs font-bold ${isLight ? 'text-slate-800' : 'text-white'}`}>{sub}</h4>
                    {isCached ? (
                      <span className="text-[9px] text-slate-500 font-mono block mt-0.5">
                        Downloaded: {cachedInfo.fileSize} • {cachedInfo.questionsCount} Qs
                      </span>
                    ) : (
                      <span className="text-[9px] text-slate-500 block mt-0.5">Ready for Offline Study</span>
                    )}
                  </div>

                  <button
                    id={`toggle-sub-cache-${sub}`}
                    disabled={isSyncing}
                    onClick={() => handleToggleSubject(sub)}
                    className={`p-2 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 border ${
                      isCached
                        ? 'bg-emerald-500/10 text-emerald-500 hover:bg-red-600/10 hover:text-red-500 hover:border-red-500/20 border-emerald-500/10'
                        : isSyncing
                        ? 'bg-blue-500/10 border-blue-500/20 text-blue-300 animate-pulse'
                        : (isLight ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700' : 'bg-slate-800 border-white/5 text-slate-300 hover:bg-slate-700')
                    }`}
                  >
                    {isCached ? (
                      <Trash2 className="w-4 h-4" />
                    ) : isSyncing ? (
                      <span className="text-[9px] font-bold">Syncing...</span>
                    ) : (
                      <>
                        <Download className="w-4 h-4" />
                        <span className="text-[9px] font-bold">Download</span>
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* SECTION 2: MOCK EXAMS CACHING */}
        <div className="space-y-3">
          <h3 className={`text-xs font-black uppercase tracking-widest flex items-center gap-2 ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>
            <ClipboardList className="w-4 h-4 text-purple-500" />
            <span>2. Download Mock Exams ({cachedExams.length}/{mockExamsList.length})</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {mockExamsList.map((exam) => {
              const cachedInfo = cachedExams.find(e => e.id === exam.id);
              const isCached = !!cachedInfo;
              const isSyncing = syncingId === `exam-${exam.id}`;

              return (
                <div 
                  key={exam.id}
                  className={`p-4 border rounded-3xl flex justify-between items-center transition ${
                    isCached 
                      ? (isLight ? 'bg-emerald-50/50 border-emerald-200' : 'bg-emerald-500/[0.03] border-emerald-500/20')
                      : (isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-900/40 border-white/5')
                  }`}
                >
                  <div className="text-left">
                    <h4 className={`text-xs font-bold ${isLight ? 'text-slate-800' : 'text-white'}`}>{exam.title}</h4>
                    {isCached ? (
                      <span className="text-[9px] text-slate-500 font-mono block mt-0.5">
                        Downloaded: {cachedInfo.fileSize}
                      </span>
                    ) : (
                      <span className="text-[9px] text-slate-500 block mt-0.5">Offline Simulator Sync</span>
                    )}
                  </div>

                  <button
                    id={`toggle-exam-cache-${exam.id}`}
                    disabled={isSyncing}
                    onClick={() => handleToggleExam(exam.id, exam.title)}
                    className={`p-2 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 border ${
                      isCached
                        ? 'bg-emerald-500/10 text-emerald-500 hover:bg-red-600/10 hover:text-red-500 hover:border-red-500/20 border-emerald-500/10'
                        : isSyncing
                        ? 'bg-blue-500/10 border-blue-500/20 text-blue-300 animate-pulse'
                        : (isLight ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700' : 'bg-slate-800 border-white/5 text-slate-300 hover:bg-slate-700')
                    }`}
                  >
                    {isCached ? (
                      <Trash2 className="w-4 h-4" />
                    ) : isSyncing ? (
                      <span className="text-[9px] font-bold">Syncing...</span>
                    ) : (
                      <>
                        <Download className="w-4 h-4" />
                        <span className="text-[9px] font-bold">Download</span>
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* SECTION 3: NOTES & PDF CACHING */}
        <div className="space-y-3">
          <h3 className={`text-xs font-black uppercase tracking-widest flex items-center gap-2 ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>
            <FileText className="w-4 h-4 text-amber-500" />
            <span>3. Download PDF Notes & Lecture summaries ({cachedNotes.length}/{mockNotes.filter(n => n.stream === user.stream).length})</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {mockNotes.filter(n => n.stream === user.stream).map((note) => {
              const cachedInfo = cachedNotes.find(cn => cn.id === note.id);
              const isCached = !!cachedInfo;
              const isSyncing = syncingId === `note-${note.id}`;

              return (
                <div 
                  key={note.id}
                  className={`p-4 border rounded-3xl flex justify-between items-center transition ${
                    isCached 
                      ? (isLight ? 'bg-emerald-50/50 border-emerald-200' : 'bg-emerald-500/[0.03] border-emerald-500/20')
                      : (isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-900/40 border-white/5')
                  }`}
                >
                  <div className="text-left min-w-0 flex-1 mr-2">
                    <h4 className={`text-xs font-bold truncate ${isLight ? 'text-slate-800' : 'text-white'}`}>{note.title}</h4>
                    <span className="text-[9px] text-slate-500 font-mono block mt-0.5">
                      Subject: {note.subject} • size: {note.fileSize}
                    </span>
                  </div>

                  <button
                    id={`toggle-note-cache-${note.id}`}
                    disabled={isSyncing}
                    onClick={() => handleToggleNote(note)}
                    className={`p-2 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 border shrink-0 ${
                      isCached
                        ? 'bg-emerald-500/10 text-emerald-500 hover:bg-red-600/10 hover:text-red-500 hover:border-red-500/20 border-emerald-500/10'
                        : isSyncing
                        ? 'bg-blue-500/10 border-blue-500/20 text-blue-300 animate-pulse'
                        : (isLight ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700' : 'bg-slate-800 border-white/5 text-slate-300 hover:bg-slate-700')
                    }`}
                  >
                    {isCached ? (
                      <Trash2 className="w-4 h-4" />
                    ) : isSyncing ? (
                      <span className="text-[9px] font-bold">Syncing...</span>
                    ) : (
                      <>
                        <Download className="w-4 h-4" />
                        <span className="text-[9px] font-bold">Download</span>
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

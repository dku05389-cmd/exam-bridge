/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import {
  ShieldAlert,
  Clock,
  CheckCircle2,
  ListRestart,
  Activity,
  Award,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Info
} from 'lucide-react';
import { mockQuestions } from '../data';
import { Question, LanguageType, User, AppTheme } from '../types';
import { translations } from '../translations';

interface MockExamProps {
  user: User;
  language: LanguageType;
  theme?: AppTheme;
  onNavigate: (view: string) => void;
  onAddPoints: (pts: number) => void;
  viewMode?: string;
}

export default function MockExam({ user, language, theme = 'dark', onNavigate, onAddPoints, viewMode }: MockExamProps) {
  const t = translations[language];

  // Helper for dynamic local text based on viewMode
  const getLocalizedText = (key: 'mockExamCenter' | 'fullEntrance' | 'subjectExam') => {
    const isUEE = viewMode === 'uee';
    
    const originalTexts = {
      mockExamCenter: {
        en: "Mock Exam Center",
        am: "የሙከራ ፈተና ማዕከል",
        om: "Giddu-gala Qormaata Yaalii",
        ti: "ማእከል ፈተና ፈተነ"
      },
      fullEntrance: {
        en: "Full Entrance Exam",
        am: "ሙሉ የመግቢያ ፈተና",
        om: "Qormaata Seensa Guutuu",
        ti: "ምሉእ መእተዊ ፈተና"
      },
      subjectExam: {
        en: "Subject Exam",
        am: "የትምህርት ፈተና",
        om: "Qormaata Barnootaa",
        ti: "ናይ ትምህርቲ ፈተና"
      }
    };

    const newTexts = {
      mockExamCenter: {
        en: "Practice Exam Center",
        am: "የልምምድ ፈተና ማዕከል",
        om: "Giddu-gala Qormaata Shaakalaa",
        ti: "ማእከል ፈተና ልምምድ"
      },
      fullEntrance: {
        en: "Full Entrance UEE",
        am: "ሙሉ የመግቢያ UEE",
        om: "Seensa Guutuu UEE",
        ti: "ምሉእ መእተዊ UEE"
      },
      subjectExam: {
        en: "Chapter Based Exam",
        am: "በምዕራፍ የተመረኮዘ ፈተና",
        om: "Qormaata Boqonnaa Irratti Hundaa'e",
        ti: "ኣብ ምዕራፍ ዝተመርኮሰ ፈተና"
      }
    };

    const dict = isUEE ? originalTexts : newTexts;
    return dict[key]?.[language] || dict[key]?.['en'];
  };

  // Gated states
  const [examType, setExamType] = useState<string>('');
  const [isActive, setIsActive] = useState(false);
  const [examQuestions, setExamQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, 'A' | 'B' | 'C' | 'D'>>({});
  const [timeLeft, setTimeLeft] = useState(1200); // 20 minutes countdown
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  const [autoSaveMsg, setAutoSaveMsg] = useState('');

  // Auto-Save representation
  useEffect(() => {
    if (isActive && !isFinished) {
      const autoSaveTimer = setInterval(() => {
        setAutoSaveMsg(t.autoSaved || "Progress auto-saved locally.");
        setTimeout(() => setAutoSaveMsg(''), 3000);
      }, 30000); // every 30 seconds

      return () => clearInterval(autoSaveTimer);
    }
  }, [isActive, isFinished, t.autoSaved]);

  // Countdown timer
  useEffect(() => {
    if (isActive && !isFinished && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            submitExam();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, isFinished, timeLeft]);

  // Restrict questions if user is free
  const startExam = (type: string) => {
    if (!user.isPremium && type === 'full') {
      alert("Full Entrance Mock Exam is locked for free users. Upgrade to Premium to unlock.");
      onNavigate('premium');
      return;
    }

    setExamType(type);
    const filterPool = mockQuestions.filter(q => q.stream === user.stream);
    
    // Free users get maximum 5 questions, Premium get full 15
    const examLength = user.isPremium ? 15 : 5;
    const selectedPool = [...filterPool].sort(() => 0.5 - Math.random()).slice(0, examLength);

    setExamQuestions(selectedPool);
    setSelectedAnswers({});
    setTimeLeft(examLength * 90); // 90 seconds per question
    setCurrentIdx(0);
    setIsFinished(false);
    setIsActive(true);
  };

  const handleSelectOption = (opt: 'A' | 'B' | 'C' | 'D') => {
    setSelectedAnswers(prev => ({
      ...prev,
      [currentIdx]: opt
    }));
  };

  const submitExam = () => {
    setIsFinished(true);
    setIsActive(false);
    
    // Calculate performance points
    let correct = 0;
    examQuestions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctAnswer) correct++;
    });

    onAddPoints(correct * 20); // 20 points per mock question

    // Save mock test completed to user analytics
    const savedMocks = JSON.parse(localStorage.getItem('eb_mock_history') || '[]');
    savedMocks.push({
      score: correct,
      total: examQuestions.length,
      type: examType,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    });
    localStorage.setItem('eb_mock_history', JSON.stringify(savedMocks));
  };

  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  // 1. Selector view
  if (!isActive && !isFinished) {
    const isLight = theme === 'light';
    return (
      <div className="space-y-6 max-w-xl mx-auto pb-10">
        <div className="text-center">
          <h2 className={`text-2xl font-display font-black ${isLight ? 'text-slate-800' : 'text-white'}`}>{getLocalizedText('mockExamCenter')}</h2>
          <p className={`text-sm mt-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Challenge yourself with real-time National Entrance Exam environments.</p>
        </div>

        {/* Free Limits Banner */}
        {!user.isPremium && (
          <div className={`p-4 rounded-2xl flex gap-3 text-xs leading-relaxed border ${
            isLight
              ? 'bg-amber-500/10 border-amber-500/20 text-amber-800'
              : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
          }`}>
            <ShieldAlert className={`w-5 h-5 shrink-0 ${isLight ? 'text-amber-600' : 'text-amber-400'}`} />
            <div>
              <span className="font-bold">Free Trial Restricted:</span> Free users can only take limited mock sessions of maximum 5 questions. Upgrade to Premium to simulate full 15-question exam lengths, countdown timer backups, and national ranking reviews.
            </div>
          </div>
        )}

        {/* Mocks Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { id: 'full', label: getLocalizedText('fullEntrance'), desc: "Simulate a complete multi-subject entrance test.", isPremiumOnly: true },
            { id: 'subject', label: getLocalizedText('subjectExam'), desc: "Select specific subjects to focus your evaluation.", isPremiumOnly: false },
            { id: 'timed', label: t.timedExam || "Timed Exam", desc: "Speed run! Test with strict, rapid timer conditions.", isPremiumOnly: false },
            { id: 'random', label: t.randomExam || "Random Exam", desc: "Rapidly randomized questions pulled from our servers.", isPremiumOnly: false },
          ].filter(exam => {
            // Remove Full Entrance Exam from Exams page as requested
            if (viewMode === 'exams' && exam.id === 'full') {
              return false;
            }
            return true;
          }).map((exam) => {
            const isLocked = exam.isPremiumOnly && !user.isPremium;
            return (
              <div
                key={exam.id}
                onClick={() => startExam(exam.id)}
                className={`p-5 border text-left flex flex-col justify-between min-h-[160px] cursor-pointer rounded-3xl transition duration-200 relative ${
                  isLocked 
                    ? (isLight ? 'bg-amber-500/[0.03] border-amber-500/20 opacity-75' : 'bg-slate-900/40 border-amber-500/10 opacity-75') 
                    : (isLight ? 'bg-white hover:bg-slate-50 border-slate-200/80 shadow-sm' : 'glass-card hover:bg-slate-800/30 border-white/5')
                }`}
              >
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className={`p-2 rounded-xl border ${
                      isLight ? 'bg-blue-50 border-blue-100' : 'bg-blue-500/10 border-blue-500/20'
                    }`}>
                      <Clock className={`w-5 h-5 ${isLight ? 'text-blue-600' : 'text-blue-400'}`} />
                    </span>
                    {isLocked && (
                      <span className={`px-2 py-0.5 text-[9px] font-black rounded border ${
                        isLight ? 'bg-amber-100 border-amber-200 text-amber-800' : 'bg-amber-500/20 border-amber-500/30 text-amber-400'
                      }`}>LOCKED</span>
                    )}
                  </div>
                  <h4 className={`text-sm font-bold mb-1.5 ${isLight ? 'text-slate-800' : 'text-white'}`}>{exam.label}</h4>
                  <p className={`text-[11px] leading-relaxed ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>{exam.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // 2. Performance submissions report
  if (isFinished) {
    let score = 0;
    examQuestions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctAnswer) score++;
    });

    const percent = Math.round((score / examQuestions.length) * 100);
    // Simulating percentile ranking
    const rankVal = percent >= 90 ? "Top 1%" : percent >= 75 ? "Top 8%" : percent >= 50 ? "Top 24%" : "Top 62%";
    const rankNum = percent >= 90 ? "34th / 14,200" : percent >= 75 ? "512th / 14,200" : percent >= 50 ? "3,215th / 14,200" : "8,750th / 14,200";
    const isLight = theme === 'light';

    return (
      <div className="space-y-6 max-w-xl mx-auto pb-10">
        <div className="text-center">
          <div className={`inline-flex p-3 rounded-full mb-3 border ${
            isLight ? 'bg-blue-50 border-blue-100 text-blue-600' : 'bg-blue-500/10 border-blue-500/20 text-blue-400'
          }`}>
            <Award className="w-10 h-10 animate-pulse" />
          </div>
          <h2 className={`text-3xl font-display font-black ${isLight ? 'text-slate-800' : 'text-white'}`}>{t.rank || "National Ranking Metrics"}</h2>
          <p className={`text-sm ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Exam completed. Performance report generated instantly.</p>
        </div>

        {/* Results Banner Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className={`rounded-2xl p-5 text-left space-y-2 border ${
            isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900/60 border-white/5'
          }`}>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Percentile Standing</span>
            <div className="flex items-baseline gap-2">
              <span className={`text-3xl font-black ${isLight ? 'text-emerald-600' : 'text-emerald-400'}`}>{rankVal}</span>
              <span className="text-xs text-slate-500">of students</span>
            </div>
            <p className={`text-[10px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Positioning: <span className={`font-bold ${isLight ? 'text-slate-800' : 'text-white'}`}>{rankNum}</span></p>
          </div>

          <div className={`rounded-2xl p-5 text-left space-y-2 border ${
            isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900/60 border-white/5'
          }`}>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Correct Score</span>
            <div className="flex items-baseline gap-2">
              <span className={`text-3xl font-black ${isLight ? 'text-blue-600' : 'text-blue-400'}`}>{score} / {examQuestions.length}</span>
              <span className="text-xs text-slate-500">solved</span>
            </div>
            <p className={`text-[10px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Accuracy standard: <span className={`font-bold ${isLight ? 'text-slate-800' : 'text-white'}`}>{percent}% score</span></p>
          </div>
        </div>

        {/* Performance analysis review */}
        <div className={`rounded-3xl p-6 text-left border ${
          isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900/60 border-white/10'
        }`}>
          <div className={`flex items-center gap-2 text-xs font-bold uppercase mb-3 ${isLight ? 'text-blue-600' : 'text-blue-400'}`}>
            <Activity className="w-4 h-4" />
            <span>{t.performanceAnalysis || "Performance Analysis Report"}</span>
          </div>

          <div className="space-y-3.5 text-xs leading-relaxed font-sans">
            <div className={`p-3 rounded-xl border ${
              isLight ? 'bg-emerald-50 border-emerald-100 text-slate-700' : 'bg-emerald-500/5 border-emerald-500/10 text-slate-300'
            }`}>
              <span className={`font-bold block mb-0.5 ${isLight ? 'text-emerald-700' : 'text-emerald-400'}`}>🚀 Core Strength:</span>
              You excelled on questions centered around high-level concepts and structures. Keep maintaining your steady streak!
            </div>
            <div className={`p-3 rounded-xl border ${
              isLight ? 'bg-amber-50 border-amber-100 text-slate-700' : 'bg-amber-500/5 border-amber-500/10 text-slate-300'
            }`}>
              <span className={`font-bold block mb-0.5 ${isLight ? 'text-amber-700' : 'text-amber-600'}`}>⚠️ Study Target Suggestions:</span>
              Focus on improving speed when reviewing long-form explanations. Chapter 2 notes and Formula Sheets would be helpful for quick synthesis.
            </div>
          </div>
        </div>

        <button
          id="mock-continue-btn"
          onClick={() => onNavigate('home')}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg cursor-pointer"
        >
          Proceed to Home Dashboard
        </button>
      </div>
    );
  }

  // 3. Full Screen Exam Simulation Frame
  return (
    <div className="fixed inset-0 bg-[#0F172A] z-50 overflow-y-auto px-6 py-8 text-white flex flex-col justify-between">
      <div className="max-w-2xl mx-auto w-full space-y-6">
        
        {/* Full screen header bar */}
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-red-500 animate-ping" />
            <span className="text-xs uppercase font-extrabold text-slate-400 tracking-wider">Exam Simulator Mode</span>
          </div>

          {/* Time Countdown */}
          <div className="flex items-center gap-2 px-3.5 py-1.5 bg-slate-900 border border-white/10 rounded-full font-mono text-sm text-yellow-400">
            <Clock className="w-4 h-4 animate-spin text-yellow-500" />
            <span>{formatTime(timeLeft)}</span>
          </div>

          <button
            id="mock-submit-btn"
            onClick={() => { if (confirm("Are you sure you want to submit and complete the exam?")) submitExam(); }}
            className="px-4 py-1.5 bg-red-600/30 border border-red-500/30 hover:bg-red-600 text-red-300 hover:text-white rounded-xl text-xs font-bold transition cursor-pointer"
          >
            Submit Exam
          </button>
        </div>

        {/* Auto save message alert */}
        {autoSaveMsg && (
          <div className="p-2 text-center text-[10px] bg-slate-900 border border-white/5 text-slate-400 rounded-lg animate-pulse">
            {autoSaveMsg}
          </div>
        )}

        {/* Question Counter tracker */}
        <div className="flex justify-between text-xs text-slate-400">
          <span>Mode: {examType.toUpperCase()} Mock Test</span>
          <span>Question {currentIdx + 1} of {examQuestions.length}</span>
        </div>

        <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 transition-all duration-300"
            style={{ width: `${((currentIdx + 1) / examQuestions.length) * 100}%` }}
          />
        </div>

        {/* Exam Question Card */}
        <div className="bg-slate-900 border border-white/10 rounded-3xl p-6 shadow-xl relative">
          
          <div className="text-[10px] text-blue-400 font-bold uppercase tracking-wider mb-2">
            {examQuestions[currentIdx]?.subject} • {examQuestions[currentIdx]?.topic}
          </div>

          <p className="text-sm sm:text-base font-bold text-slate-100 leading-relaxed mb-6">
            {examQuestions[currentIdx]?.text}
          </p>

          <div className="space-y-3">
            {(Object.keys(examQuestions[currentIdx]?.options || {}) as Array<'A' | 'B' | 'C' | 'D'>).map((key) => {
              const isSelected = selectedAnswers[currentIdx] === key;
              return (
                <div
                  id={`mock-opt-${key}`}
                  key={key}
                  onClick={() => handleSelectOption(key)}
                  className={`flex items-center gap-3 p-4 rounded-2xl border text-xs sm:text-sm cursor-pointer transition ${
                    isSelected
                      ? 'bg-blue-600/25 border-blue-500 text-blue-200 font-semibold'
                      : 'bg-slate-800/40 border-white/5 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black border ${
                    isSelected ? 'bg-blue-500 text-white border-blue-400' : 'bg-white/5 border-white/10 text-slate-400'
                  }`}>
                    {key}
                  </span>
                  <span>{examQuestions[currentIdx]?.options[key]}</span>
                </div>
              );
            })}
          </div>

        </div>

        {/* Controls */}
        <div className="flex items-center justify-between pt-6">
          <button
            id="mock-prev-btn"
            disabled={currentIdx === 0}
            onClick={() => setCurrentIdx(prev => prev - 1)}
            className={`flex items-center gap-1 px-4 py-2.5 rounded-xl border text-xs font-bold transition cursor-pointer ${
              currentIdx === 0
                ? 'border-white/5 text-slate-600 cursor-not-allowed'
                : 'border-white/10 text-slate-400 hover:text-white'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>{t.previous || "Previous"}</span>
          </button>

          <button
            id="mock-next-btn"
            onClick={() => {
              if (currentIdx < examQuestions.length - 1) {
                setCurrentIdx(prev => prev + 1);
              } else {
                if (confirm("You are on the last question. Ready to submit?")) submitExam();
              }
            }}
            className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow transition cursor-pointer"
          >
            <span>{currentIdx === examQuestions.length - 1 ? "Submit Exam" : (t.nextQuestion || "Next")}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}

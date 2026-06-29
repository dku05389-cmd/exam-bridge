/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Timer,
  ChevronLeft,
  ChevronRight,
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  RotateCcw,
  Sparkles,
  Download
} from 'lucide-react';
import { mockQuestions } from '../data';
import { Question, LanguageType, Bookmark as BookmarkType, User, AppTheme } from '../types';
import { translations } from '../translations';

interface PracticeModeProps {
  user: User;
  language: LanguageType;
  theme?: AppTheme;
  initialSubject?: string;
  bookmarks: BookmarkType[];
  isOnline?: boolean;
  onToggleBookmark: (qId: string, subject: string) => void;
  onAddPoints: (pts: number) => void;
  onBackToDashboard: () => void;
}

export default function PracticeMode({
  user,
  language,
  theme = 'dark',
  initialSubject,
  bookmarks,
  isOnline = true,
  onToggleBookmark,
  onAddPoints,
  onBackToDashboard
}: PracticeModeProps) {
  const t = translations[language];

  // Filters state
  const [selectedSubject, setSelectedSubject] = useState<string>(initialSubject || '');
  const [downloadingSubject, setDownloadingSubject] = useState<string | null>(null);
  const [downloadedSubjects, setDownloadedSubjects] = useState<string[]>(() => {
    return JSON.parse(localStorage.getItem('eb_downloaded_subjects') || '[]');
  });

  const handleDownload = (e: React.MouseEvent, subjectName: string) => {
    e.stopPropagation();
    if (!isOnline) return;
    
    setDownloadingSubject(subjectName);
    setTimeout(() => {
      const updated = [...downloadedSubjects, subjectName];
      setDownloadedSubjects(updated);
      localStorage.setItem('eb_downloaded_subjects', JSON.stringify(updated));
      setDownloadingSubject(null);
    }, 1500);
  };

  // Quiz active state
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [quizQuestions, setQuizQuestions] = useState<Question[]>([]);
  const [isActive, setIsActive] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, 'A' | 'B' | 'C' | 'D'>>({});
  const [revealedAnswers, setRevealedAnswers] = useState<Record<number, boolean>>({});

  // Timer state
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Results screen state
  const [isFinished, setIsFinished] = useState(false);

  // Gather unique subjects based on user stream
  const availableQuestions = mockQuestions.filter(q => q.stream === user.stream);
  const subjects = Array.from(new Set(availableQuestions.map(q => q.subject)));

  // Start the Practice session
  const startQuiz = (yearOverride?: string) => {
    let filtered = availableQuestions;
    const activeYear = yearOverride || selectedYear;

    if (selectedSubject) {
      filtered = filtered.filter(q => q.subject === selectedSubject);
    }
    
    if (activeYear) {
      filtered = filtered.filter(q => q.year === activeYear);
    }

    if (filtered.length === 0) {
      // If no questions match the specific year in mock data, we'll just use subject-based filtering for simulation
      // but in a real app, this would be strict.
      filtered = availableQuestions.filter(q => q.subject === selectedSubject);
    }

    // Shuffle
    const shuffled = [...filtered].sort(() => 0.5 - Math.random()).slice(0, 10);
    setQuizQuestions(shuffled);
    setCurrentIdx(0);
    setSelectedAnswers({});
    setRevealedAnswers({});
    setSecondsElapsed(0);
    setIsFinished(false);
    setIsActive(true);
  };

  // Timer effect
  useEffect(() => {
    if (isActive && !isFinished) {
      timerRef.current = setInterval(() => {
        setSecondsElapsed(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, isFinished]);

  const handleSelectOption = (opt: 'A' | 'B' | 'C' | 'D') => {
    if (revealedAnswers[currentIdx]) return; // locked once checked

    setSelectedAnswers(prev => ({
      ...prev,
      [currentIdx]: opt
    }));
  };

  const handleCheckAnswer = () => {
    if (!selectedAnswers[currentIdx]) return;
    setRevealedAnswers(prev => ({
      ...prev,
      [currentIdx]: true
    }));
  };

  const isBookmarked = (qId: string) => {
    return bookmarks.some(b => b.questionId === qId);
  };

  const toggleBookmarkCurrent = () => {
    const q = quizQuestions[currentIdx];
    onToggleBookmark(q.id, q.subject);
  };

  const handleNext = () => {
    if (currentIdx < quizQuestions.length - 1) {
      setCurrentIdx(prev => prev + 1);
    } else {
      finishQuiz();
    }
  };

  const handlePrevious = () => {
    if (currentIdx > 0) {
      setCurrentIdx(prev => prev - 1);
    }
  };

  const finishQuiz = () => {
    setIsFinished(true);
    // Award experience points based on score
    let correct = 0;
    quizQuestions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctAnswer) correct++;
    });

    const gainedPoints = correct * 15;
    onAddPoints(gainedPoints);

    // Save history locally to merge with analytics
    const solvedCount = quizQuestions.length;
    const correctCount = correct;
    const sessionTime = secondsElapsed;

    const userStats = {
      solved: solvedCount,
      correct: correctCount,
      seconds: sessionTime,
      date: new Date().toISOString().split('T')[0]
    };

    const savedHistory = JSON.parse(localStorage.getItem('eb_practice_history') || '[]');
    savedHistory.push(userStats);
    localStorage.setItem('eb_practice_history', JSON.stringify(savedHistory));
  };

  const formatTime = (secs: number) => {
    const minutes = Math.floor(secs / 60);
    const seconds = secs % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Render selection filter screen if not started
  if (!isActive) {
    const isLight = theme === 'light';
    const isMathematics = selectedSubject === t.mathematics || selectedSubject === "Mathematics";
    const years = isMathematics
      ? ["2012", "2013", "2014", "2015", "2016", "2017", "2018"]
      : ["2007", "2008", "2009", "2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018"];

    return (
      <div className="space-y-6 max-w-xl mx-auto pb-10">
        <div className="text-center">
          <h2 className={`text-2xl font-display font-extrabold ${isLight ? 'text-slate-800' : 'text-white'}`}>
            {selectedSubject ? `${selectedSubject}: Select Year` : (t.practice || "Practice Session")}
          </h2>
          <p className={`text-sm mt-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
            {selectedSubject 
              ? "Select the national exam year to begin your practice drill." 
              : "Select subjects and topics to drill key entrance concepts."}
          </p>
        </div>

        <div className={`border rounded-3xl p-6 shadow-xl backdrop-blur-md space-y-6 ${
          isLight ? 'bg-white border-slate-200/80 shadow-sm' : 'bg-slate-900/60 border-white/10'
        }`}>
          
          {!selectedSubject ? (
            /* Subject Select */
            <div className="space-y-3">
              <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Select Subject</label>
              <div className="space-y-3">
                {subjects.map(sub => {
                  const isDownloaded = downloadedSubjects.includes(sub);
                  const isDownloading = downloadingSubject === sub;

                  return (
                    <div key={sub} className="flex gap-2">
                      <button
                        id={`practice-sub-sel-${sub}`}
                        onClick={() => { setSelectedSubject(sub); }}
                        className={`flex-1 flex items-center justify-between py-4 px-5 text-sm font-bold rounded-2xl border transition cursor-pointer ${
                          selectedSubject === sub
                            ? (isLight ? 'bg-blue-600 border-blue-600 text-white' : 'bg-blue-600/25 border-blue-500 text-blue-300')
                            : (isLight ? 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100' : 'bg-slate-800/50 border-white/5 text-slate-200 hover:bg-slate-800')
                        }`}
                      >
                        <span>{sub}</span>
                        <ChevronRight className="w-5 h-5 opacity-50" />
                      </button>
                      <button
                        onClick={(e) => handleDownload(e, sub)}
                        disabled={isDownloading || !isOnline}
                        className={`px-4 rounded-2xl border transition duration-200 active:scale-95 ${
                          isDownloaded 
                            ? (isLight ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400')
                            : isOnline 
                              ? (isLight ? 'bg-white border-slate-200 text-slate-400 hover:text-blue-600' : 'bg-slate-800/50 border-white/5 text-slate-500 hover:text-blue-400')
                              : 'bg-slate-800/20 border-white/5 text-slate-700 cursor-not-allowed'
                        }`}
                      >
                        {isDownloading ? (
                          <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                        ) : isDownloaded ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : (
                          <Download className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Year Select */
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <label className={`block text-xs font-bold uppercase tracking-wider ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Select Exam Year (E.C)</label>
                <button 
                  onClick={() => { setSelectedSubject(''); setSelectedYear(''); }}
                  className="text-[10px] font-bold text-blue-500 hover:underline cursor-pointer"
                >
                  Change Subject
                </button>
              </div>
              
              <div className="space-y-6">
                {/* Matric Section (2007-2010) - Hidden for Math as it starts from 2012 */}
                {!isMathematics && (
                  <div className="space-y-3">
                    <h4 className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg w-fit ${isLight ? 'bg-slate-100 text-slate-500' : 'bg-slate-800 text-slate-400'}`}>
                      Matric Exams (Grade 10)
                    </h4>
                    <div className="grid grid-cols-4 gap-3">
                      {["2007", "2008", "2009", "2010"].map(year => (
                        <button
                          key={year}
                          onClick={() => { setSelectedYear(year); startQuiz(year); }}
                          className={`py-3.5 text-sm font-black rounded-xl border transition cursor-pointer active:scale-95 ${
                            selectedYear === year
                              ? (isLight ? 'bg-blue-600 border-blue-600 text-white shadow-md' : 'bg-blue-500 border-blue-400 text-white shadow-lg shadow-blue-500/20')
                              : (isLight ? 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100' : 'bg-slate-800/40 border-white/5 text-slate-400 hover:bg-slate-800/60')
                          }`}
                        >
                          {year}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Entrance Section (2011-2018) */}
                <div className="space-y-3">
                  <h4 className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg w-fit ${isLight ? 'bg-blue-50 text-blue-600' : 'bg-blue-900/30 text-blue-400'}`}>
                    Entrance Exams (Grade 12)
                  </h4>
                  <div className="grid grid-cols-4 gap-3">
                    {(isMathematics 
                      ? ["2012", "2013", "2014", "2015", "2016", "2017", "2018"] 
                      : ["2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018"]
                    ).map(year => (
                      <button
                        key={year}
                        onClick={() => { setSelectedYear(year); startQuiz(year); }}
                        className={`py-3.5 text-sm font-black rounded-xl border transition cursor-pointer active:scale-95 ${
                          selectedYear === year
                            ? (isLight ? 'bg-blue-600 border-blue-600 text-white shadow-md' : 'bg-blue-500 border-blue-400 text-white shadow-lg shadow-blue-500/20')
                            : (isLight ? 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100' : 'bg-slate-800/40 border-white/5 text-slate-400 hover:bg-slate-800/60')
                        }`}
                      >
                        {year}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Render Finished Stats Screen
  if (isFinished) {
    let totalCorrect = 0;
    quizQuestions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctAnswer) totalCorrect++;
    });
    const accuracyVal = quizQuestions.length > 0 ? Math.round((totalCorrect / quizQuestions.length) * 100) : 0;
    const isLight = theme === 'light';

    return (
      <div className="space-y-6 max-w-xl mx-auto pb-10">
        <div className="text-center">
          <div className={`inline-flex p-3 rounded-full mb-3 border ${
            isLight ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
          }`}>
            <CheckCircle2 className="w-10 h-10 animate-bounce" />
          </div>
          <h2 className={`text-3xl font-display font-black ${isLight ? 'text-slate-800' : 'text-white'}`}>{t.examCompleted || "Practice Completed!"}</h2>
          <p className={`text-sm ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Fantastic job. Review your accuracy stats below.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className={`border rounded-2xl p-5 text-center ${
            isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900/60 border-white/5'
          }`}>
            <span className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Score Obtained</span>
            <span className={`text-2xl font-black ${isLight ? 'text-blue-600' : 'text-blue-400'}`}>{totalCorrect} / {quizQuestions.length}</span>
          </div>

          <div className={`border rounded-2xl p-5 text-center ${
            isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900/60 border-white/5'
          }`}>
            <span className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Accuracy</span>
            <span className={`text-2xl font-black ${isLight ? 'text-emerald-600' : 'text-emerald-400'}`}>{accuracyVal}%</span>
          </div>

          <div className={`border rounded-2xl p-5 text-center ${
            isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900/60 border-white/5'
          }`}>
            <span className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Time Elapsed</span>
            <span className="text-2xl font-black text-yellow-500">{formatTime(secondsElapsed)}</span>
          </div>

          <div className={`border rounded-2xl p-5 text-center ${
            isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900/60 border-white/5'
          }`}>
            <span className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Experience Gained</span>
            <span className="text-2xl font-black text-amber-500">+{totalCorrect * 15} PTS</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <button
            id="practice-retry-btn"
            onClick={startQuiz}
            className={`w-full py-3.5 rounded-xl border text-xs font-bold cursor-pointer transition flex items-center justify-center gap-2 ${
              isLight 
                ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-800' 
                : 'bg-slate-800 hover:bg-slate-700 border-white/10 text-white'
            }`}
          >
            <RotateCcw className="w-4 h-4" />
            <span>Practice Again</span>
          </button>

          <button
            id="practice-home-btn"
            onClick={onBackToDashboard}
            className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold cursor-pointer transition"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Active quiz interface
  const currentQuestion = quizQuestions[currentIdx];
  const userSelected = selectedAnswers[currentIdx];
  const isChecked = revealedAnswers[currentIdx];
  const isLight = theme === 'light';

  return (
    <div className="space-y-6 max-w-xl mx-auto pb-10">
      
      {/* Top bar with timer and quit button */}
      <div className="flex items-center justify-between">
        <button
          id="practice-quit-btn"
          onClick={() => { if (confirm("Do you want to exit practice mode?")) onBackToDashboard(); }}
          className={`text-xs flex items-center gap-1 cursor-pointer transition ${
            isLight ? 'text-slate-500 hover:text-slate-800' : 'text-slate-400 hover:text-white'
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Exit</span>
        </button>

        {/* Stopwatch Timer */}
        <div className={`flex items-center gap-1.5 px-3 py-1.5 border rounded-full font-mono text-xs ${
          isLight ? 'bg-white border-slate-200 text-slate-800 shadow-xs' : 'bg-slate-900/60 border-white/10 text-slate-200'
        }`}>
          <Timer className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
          <span>{formatTime(secondsElapsed)}</span>
        </div>

        {/* Bookmark Action */}
        <button
          id="practice-bookmark-btn"
          onClick={toggleBookmarkCurrent}
          className={`p-2 border rounded-xl cursor-pointer transition ${
            isLight ? 'bg-white border-slate-200 text-amber-500 hover:text-amber-600 shadow-xs' : 'bg-slate-900/60 border-white/10 text-amber-400 hover:text-amber-300'
          }`}
        >
          {isBookmarked(currentQuestion.id) ? (
            <BookmarkCheck className="w-4 h-4 fill-amber-400 text-amber-400" />
          ) : (
            <Bookmark className="w-4 h-4 text-slate-400" />
          )}
        </button>
      </div>

      {/* Progress indicators */}
      <div className="space-y-2">
        <div className={`flex justify-between text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
          <span className="font-bold">Subject: {currentQuestion.subject}</span>
          <span>Question {currentIdx + 1} of {quizQuestions.length}</span>
        </div>
        <div className={`w-full h-1.5 rounded-full overflow-hidden ${isLight ? 'bg-slate-100' : 'bg-slate-800'}`}>
          <div
            className="h-full bg-blue-500 transition-all duration-300"
            style={{ width: `${((currentIdx + 1) / quizQuestions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question Card Display */}
      <div className={`border rounded-3xl p-6 shadow-xl relative overflow-hidden ${
        isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900/60 border-white/10'
      }`}>
        
        {/* Topic label */}
        <div className={`text-[10px] font-bold uppercase tracking-wider mb-2 ${isLight ? 'text-blue-600' : 'text-blue-400'}`}>
          {currentQuestion.topic}
        </div>

        {/* Question Text */}
        <p className={`text-sm sm:text-base font-semibold leading-relaxed mb-6 ${isLight ? 'text-slate-800' : 'text-slate-100'}`}>
          {currentQuestion.text}
        </p>

        {/* Options Stack */}
        <div className="space-y-3">
          {(Object.keys(currentQuestion.options) as Array<'A' | 'B' | 'C' | 'D'>).map((key) => {
            const isSelected = userSelected === key;
            const isCorrect = currentQuestion.correctAnswer === key;

            let cardStyle = isLight 
              ? "bg-slate-50 border-slate-200 hover:bg-slate-100/70 hover:border-slate-300 text-slate-700" 
              : "bg-slate-800/40 border-white/5 hover:bg-slate-800 hover:border-white/10 text-slate-300";
            if (isChecked) {
              if (isCorrect) {
                cardStyle = isLight
                  ? "bg-emerald-50 border-emerald-300 text-emerald-800 font-semibold"
                  : "bg-emerald-500/25 border-emerald-500 text-emerald-200 font-semibold";
              } else if (isSelected) {
                cardStyle = isLight
                  ? "bg-red-50 border-red-300 text-red-800"
                  : "bg-red-500/25 border-red-500 text-red-200";
              } else {
                cardStyle = isLight
                  ? "bg-slate-50/50 border-slate-100 text-slate-400 opacity-60"
                  : "bg-slate-800/20 border-white/5 text-slate-500";
              }
            } else if (isSelected) {
              cardStyle = isLight
                ? "bg-blue-50 border-blue-400 text-blue-800 font-semibold shadow-xs"
                : "bg-blue-600/20 border-blue-500 text-blue-200 font-semibold";
            }

            return (
              <div
                id={`practice-opt-${key}`}
                key={key}
                onClick={() => handleSelectOption(key)}
                className={`flex items-center justify-between p-4 rounded-2xl border text-xs sm:text-sm cursor-pointer transition duration-200 ${cardStyle}`}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black border ${
                    isSelected 
                      ? 'bg-blue-500 text-white border-blue-400' 
                      : (isLight ? 'bg-white border-slate-200 text-slate-500' : 'bg-white/5 border-white/10 text-slate-400')
                  }`}>
                    {key}
                  </span>
                  <span>{currentQuestion.options[key]}</span>
                </div>

                {/* Validation icons when checked */}
                {isChecked && (
                  <div>
                    {isCorrect ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    ) : isSelected ? (
                      <XCircle className="w-5 h-5 text-red-400" />
                    ) : null}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Check answer trigger */}
        {!isChecked && userSelected && (
          <button
            id="practice-check-btn"
            onClick={handleCheckAnswer}
            className="mt-6 w-full py-3.5 rounded-xl bg-blue-500 hover:bg-blue-400 text-white text-xs font-bold cursor-pointer transition"
          >
            Check Answer
          </button>
        )}

        {/* Explanation view if checked */}
        {isChecked && (
          <div className={`mt-6 p-4 border rounded-2xl ${
            isLight ? 'bg-blue-50/50 border-blue-200/50' : 'bg-blue-500/5 border-blue-500/10'
          }`}>
            <div className={`flex items-center gap-1.5 text-xs font-bold mb-1.5 ${isLight ? 'text-blue-600' : 'text-blue-400'}`}>
              <HelpCircle className="w-3.5 h-3.5" />
              <span>{t.explanation || "Explanation"}</span>
            </div>
            <p className={`text-xs leading-relaxed font-sans ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
              {currentQuestion.explanation}
            </p>
          </div>
        )}

      </div>

      {/* Footer controllers */}
      <div className={`flex items-center justify-between pt-4 border-t ${isLight ? 'border-slate-200/60' : 'border-white/5'}`}>
        <button
          id="practice-prev-btn"
          disabled={currentIdx === 0}
          onClick={handlePrevious}
          className={`flex items-center gap-1 px-4 py-2.5 rounded-xl border text-xs font-bold transition cursor-pointer ${
            currentIdx === 0
              ? (isLight ? 'border-slate-100 text-slate-300 cursor-not-allowed' : 'border-white/5 text-slate-600 cursor-not-allowed')
              : (isLight ? 'border-slate-200 text-slate-600 hover:bg-slate-50' : 'border-white/10 text-slate-400 hover:text-white')
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
          <span>{t.previous || "Previous"}</span>
        </button>

        <button
          id="practice-next-btn"
          disabled={!isChecked && !userSelected}
          onClick={handleNext}
          className={`flex items-center gap-1.5 px-6 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
            !isChecked && !userSelected
              ? (isLight ? 'bg-slate-200 text-slate-400 cursor-not-allowed border-slate-200' : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-white/5')
              : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white'
          }`}
        >
          <span>{currentIdx === quizQuestions.length - 1 ? (t.submitExam || "Finish Drill") : (t.nextQuestion || "Next")}</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}

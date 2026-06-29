/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BookOpen, FlaskConical, Atom, Dna, Languages, BrainCircuit, Download, CheckCircle2 } from 'lucide-react';
import React, { useState } from 'react';
import { LanguageType, User, AppTheme } from '../types';
import { translations } from '../translations';

interface UeeExamViewProps {
  user: User;
  language: LanguageType;
  onNavigate: (view: string, subViewData?: any) => void;
  theme?: AppTheme;
  isOnline?: boolean;
}

export default function UeeExamView({ user, language, onNavigate, theme = 'dark', isOnline = true }: UeeExamViewProps) {
  const t = translations[language];
  const isLight = theme === 'light';
  const [downloadingSubject, setDownloadingSubject] = useState<string | null>(null);
  const [downloadedSubjects, setDownloadedSubjects] = useState<string[]>(() => {
    return JSON.parse(localStorage.getItem('eb_downloaded_subjects') || '[]');
  });

  const subjects = [
    { name: t.mathematics || "Mathematics", icon: BookOpen, color: "bg-blue-600" },
    { name: t.physics || "Physics", icon: Atom, color: "bg-indigo-600" },
    { name: t.chemistry || "Chemistry", icon: FlaskConical, color: "bg-emerald-600" },
    { name: t.biology || "Biology", icon: Dna, color: "bg-green-600" },
    { name: t.english || "English", icon: Languages, color: "bg-purple-600" },
    { name: t.aptitude || "Aptitude", icon: BrainCircuit, color: "bg-pink-600" },
  ];

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

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <h2 className={`text-2xl font-display font-black ${isLight ? 'text-slate-800' : 'text-white'}`}>All UEE Exams</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {subjects.map((sub, idx) => {
          const isDownloaded = downloadedSubjects.includes(sub.name);
          const isDownloading = downloadingSubject === sub.name;

          return (
            <div
              key={idx}
              onClick={() => onNavigate('practice', { subject: sub.name })}
              className={`p-6 rounded-3xl text-white cursor-pointer transition-transform hover:scale-105 ${sub.color} shadow-lg relative overflow-hidden group`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/20 rounded-2xl group-hover:rotate-6 transition-transform">
                    <sub.icon className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{sub.name}</h3>
                    <p className="text-sm opacity-80">UEE Practice</p>
                  </div>
                </div>

                <button
                  onClick={(e) => handleDownload(e, sub.name)}
                  disabled={isDownloading || !isOnline}
                  className={`p-2.5 rounded-2xl border transition-all duration-200 ${
                    isDownloaded 
                      ? 'bg-emerald-500 border-emerald-400' 
                      : isOnline 
                        ? 'bg-white/20 border-white/20 hover:bg-white/30' 
                        : 'bg-white/10 border-white/10 opacity-50 cursor-not-allowed'
                  }`}
                >
                  {isDownloading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : isDownloaded ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <Download className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

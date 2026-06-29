/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { LineChart, Clock, Award, HelpCircle, Activity, Sparkles, Trophy } from 'lucide-react';
import { LanguageType, User, AppTheme } from '../types';
import { translations } from '../translations';

interface AnalyticsViewProps {
  user: User;
  language: LanguageType;
  theme?: AppTheme;
}

export default function AnalyticsView({ user, language, theme = 'dark' }: AnalyticsViewProps) {
  const t = translations[language];
  const isLight = theme === 'light';

  // Load local practice logs
  const [solvedStats, setSolvedStats] = useState({ solved: 140, correct: 112, seconds: 7200 });
  const [mockCount, setMockCount] = useState(4);

  useEffect(() => {
    // Read local histories and aggregate
    const practiceHistory = JSON.parse(localStorage.getItem('eb_practice_history') || '[]');
    const mockHistory = JSON.parse(localStorage.getItem('eb_mock_history') || '[]');

    let addSolved = 0;
    let addCorrect = 0;
    let addSeconds = 0;

    practiceHistory.forEach((item: any) => {
      addSolved += item.solved || 0;
      addCorrect += item.correct || 0;
      addSeconds += item.seconds || 0;
    });

    setSolvedStats({
      solved: 140 + addSolved,
      correct: 112 + addCorrect,
      seconds: 7200 + addSeconds
    });

    setMockCount(4 + mockHistory.length);
  }, []);

  const totalSolved = solvedStats.solved;
  const totalCorrect = solvedStats.correct;
  const accuracyPercent = totalSolved > 0 ? Math.round((totalCorrect / totalSolved) * 100) : 0;
  
  const formatHours = (secs: number) => {
    return (secs / 3600).toFixed(1);
  };

  // Static chart coordinates for rendering beautiful SVGs
  const weeklyPoints = [
    { label: "Mon", score: 68 },
    { label: "Tue", score: 72 },
    { label: "Wed", score: 85 },
    { label: "Thu", score: 78 },
    { label: "Fri", score: 82 },
    { label: "Sat", score: 90 },
    { label: "Sun", score: accuracyPercent }
  ];

  const maxScore = 100;
  const chartHeight = 120;
  const chartWidth = 320;

  // Build points string for SVG polyline
  const pointsStr = weeklyPoints
    .map((p, idx) => {
      const x = (idx * (chartWidth / (weeklyPoints.length - 1))) + 10;
      const y = chartHeight - (p.score / maxScore) * chartHeight + 10;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div className="space-y-6">
      
      {/* Overview stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        {/* Metric 1 */}
        <div className={`border rounded-2xl p-4 text-left ${
          isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900/60 border-white/5'
        }`}>
          <div className="p-2 bg-blue-500/10 border border-blue-500/20 rounded-xl inline-flex mb-3">
            <Activity className="w-5 h-5 text-blue-500" />
          </div>
          <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">{t.accuracyRate || "Accuracy Rate"}</span>
          <span className="text-xl font-black text-blue-500 mt-1 block">{accuracyPercent}%</span>
        </div>

        {/* Metric 2 */}
        <div className={`border rounded-2xl p-4 text-left ${
          isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900/60 border-white/5'
        }`}>
          <div className="p-2 bg-yellow-500/10 border border-yellow-500/20 rounded-xl inline-flex mb-3">
            <Clock className="w-5 h-5 text-yellow-500" />
          </div>
          <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">{t.studyTime || "Study Time"}</span>
          <span className="text-xl font-black text-yellow-500 mt-1 block">{formatHours(solvedStats.seconds)} Hrs</span>
        </div>

        {/* Metric 3 */}
        <div className={`border rounded-2xl p-4 text-left ${
          isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900/60 border-white/5'
        }`}>
          <div className="p-2 bg-purple-500/10 border border-purple-500/20 rounded-xl inline-flex mb-3">
            <HelpCircle className="w-5 h-5 text-purple-500" />
          </div>
          <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">{t.questionsSolvedText || "Solved"}</span>
          <span className="text-xl font-black text-purple-500 mt-1 block">{totalSolved} Qs</span>
        </div>

        {/* Metric 4 */}
        <div className={`border rounded-2xl p-4 text-left ${
          isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900/60 border-white/5'
        }`}>
          <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl inline-flex mb-3">
            <Trophy className="w-5 h-5 text-emerald-500" />
          </div>
          <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">{t.mockCompleted || "Mocks Completed"}</span>
          <span className="text-xl font-black text-emerald-500 mt-1 block">{mockCount} tests</span>
        </div>

      </div>

      {/* SVG Performance Chart */}
      <div className={`border rounded-3xl p-6 text-left ${
        isLight ? 'bg-white border-slate-200/80 shadow-sm' : 'bg-slate-900/60 border-white/10'
      }`}>
        <div className="flex justify-between items-center mb-4">
          <div>
            <h4 className={`text-sm font-bold uppercase tracking-wider ${isLight ? 'text-slate-800' : 'text-white'}`}>{t.weeklyPerformance || "Weekly Performance"}</h4>
            <p className={`text-[10px] mt-0.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>National Mock score accuracy trend.</p>
          </div>
          <span className="px-2.5 py-1 bg-blue-500/10 text-blue-500 text-[10px] font-extrabold rounded-lg border border-blue-500/20">LIVE</span>
        </div>

        {/* SVG Wrapper */}
        <div className="w-full overflow-hidden pt-2">
          <svg viewBox={`0 0 ${chartWidth + 20} ${chartHeight + 30}`} className="w-full h-auto">
            {/* Horizontal helper lines */}
            <line x1="10" y1="10" x2={chartWidth + 10} y2="10" stroke={isLight ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.05)"} strokeDasharray="4" />
            <line x1="10" y1="70" x2={chartWidth + 10} y2="70" stroke={isLight ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.05)"} strokeDasharray="4" />
            <line x1="10" y1="130" x2={chartWidth + 10} y2="130" stroke={isLight ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.08)"} />

            {/* Polyline line graph */}
            <polyline
              fill="none"
              stroke="url(#blue-gradient)"
              strokeWidth="3.5"
              points={pointsStr}
            />

            {/* Gradient definition */}
            <defs>
              <linearGradient id="blue-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="50%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#6366f1" />
              </linearGradient>
            </defs>

            {/* Data circles */}
            {weeklyPoints.map((p, idx) => {
              const x = (idx * (chartWidth / (weeklyPoints.length - 1))) + 10;
              const y = chartHeight - (p.score / maxScore) * chartHeight + 10;
              return (
                <g key={idx}>
                  <circle cx={x} cy={y} r="5" fill={isLight ? "#ffffff" : "#0f172a"} className="stroke-blue-500 stroke-2" />
                  {/* Score text on hover representation */}
                  <text x={x} y={y - 8} textAnchor="middle" className={`text-[8px] font-bold font-mono ${isLight ? 'fill-slate-600' : 'fill-slate-300'}`}>{p.score}%</text>
                </g>
              );
            })}

            {/* X-axis labels */}
            {weeklyPoints.map((p, idx) => {
              const x = (idx * (chartWidth / (weeklyPoints.length - 1))) + 10;
              return (
                <text key={idx} x={x} y={chartHeight + 24} textAnchor="middle" className={`text-[8px] font-bold font-mono ${isLight ? 'fill-slate-400' : 'fill-slate-500'}`}>
                  {p.label}
                </text>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Subject balance bars */}
      <div className={`border rounded-3xl p-6 text-left ${
        isLight ? 'bg-white border-slate-200/80 shadow-sm' : 'bg-slate-900/60 border-white/10'
      }`}>
        <h4 className={`text-sm font-bold uppercase tracking-wider mb-4 ${isLight ? 'text-slate-800' : 'text-white'}`}>{t.subjectComparison || "Subject Accuracy Comparison"}</h4>
        
        <div className="space-y-4">
          {[
            { name: "English Language", accuracy: 88, color: "bg-blue-500" },
            { name: "Mathematics (UEE standard)", accuracy: 72, color: "bg-amber-500" },
            { name: "Aptitude & Reasoning", accuracy: 82, color: "bg-purple-500" },
            { name: user.stream === 'Natural Science' ? "Biology Science" : "Ethiopian History", accuracy: 85, color: "bg-emerald-500" }
          ].map((subj, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex justify-between items-center text-xs">
                <span className={`font-semibold ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>{subj.name}</span>
                <span className={`font-bold font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>{subj.accuracy}% accuracy</span>
              </div>
              <div className={`w-full h-2.5 rounded-full overflow-hidden ${isLight ? 'bg-slate-100' : 'bg-slate-800'}`}>
                <div
                  className={`h-full ${subj.color} rounded-full transition-all duration-500`}
                  style={{ width: `${subj.accuracy}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

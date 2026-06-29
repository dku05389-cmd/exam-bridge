/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion } from 'motion/react';
import { Trophy, Medal, Star, Shield, HelpCircle } from 'lucide-react';
import { mockLeaderboard } from '../data';
import { LanguageType, User, LeaderboardEntry, AppTheme } from '../types';
import { translations } from '../translations';

interface LeaderboardViewProps {
  user: User;
  language: LanguageType;
  theme?: AppTheme;
}

export default function LeaderboardView({ user, language, theme = 'dark' }: LeaderboardViewProps) {
  const t = translations[language];
  const isLight = theme === 'light';

  const [timeframe, setTimeframe] = useState<'weekly' | 'monthly'>('weekly');

  // Insert user dynamically into leaderboard rankings
  const getLeaderboardData = (): LeaderboardEntry[] => {
    // Determine user's mock badge
    let userBadge = "Rising Star";
    if (user.points > 4000) userBadge = "Grandmaster";
    else if (user.points > 3000) userBadge = "Elite";
    else if (user.points > 2000) userBadge = "Expert";
    else if (user.points > 1000) userBadge = "Pro";

    const userEntry: LeaderboardEntry = {
      rank: 6, // Simulated rank slot
      name: `${user.name} (You)`,
      points: user.points,
      badge: userBadge,
      avatar: user.avatar,
      isCurrentUser: true
    };

    // Sort leaderboard containing user
    const combined = [...mockLeaderboard];
    const userIndex = combined.findIndex(item => item.name === user.name);
    if (userIndex === -1) {
      combined.push(userEntry);
    } else {
      combined[userIndex].points = user.points;
      combined[userIndex].badge = userBadge;
    }

    const sorted = combined.sort((a, b) => b.points - a.points);
    // Re-assign ranks
    return sorted.map((entry, idx) => ({
      ...entry,
      rank: idx + 1
    }));
  };

  const dataList = getLeaderboardData();

  return (
    <div className="space-y-6 text-left">
      
      {/* Top Banner */}
      <div className="text-center max-w-md mx-auto space-y-2">
        <div className={`inline-flex p-3 border rounded-full text-yellow-500 ${
          isLight ? 'bg-yellow-50 border-yellow-100' : 'bg-yellow-500/10 border-yellow-500/20'
        }`}>
          <Trophy className="w-10 h-10 animate-pulse" />
        </div>
        <h2 className={`text-2xl font-display font-black ${isLight ? 'text-slate-800' : 'text-white'}`}>{t.leaderboard || "Global Leaderboard"}</h2>
        <p className={`text-sm ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Compete with entrance exam takers nationwide. Answer questions correctly to gain points!</p>
      </div>

      {/* Timeframe Toggles */}
      <div className="flex justify-center">
        <div className={`p-1 rounded-2xl border flex gap-1 ${
          isLight ? 'bg-slate-100 border-slate-200/80 shadow-xs' : 'bg-slate-900/80 border-white/5'
        }`}>
          <button
            id="leaderboard-toggle-weekly"
            onClick={() => setTimeframe('weekly')}
            className={`py-2 px-6 text-xs font-bold rounded-xl transition cursor-pointer ${
              timeframe === 'weekly'
                ? 'bg-blue-600 text-white shadow'
                : (isLight ? 'text-slate-500 hover:text-slate-800' : 'text-slate-400 hover:text-white')
            }`}
          >
            {t.weekly || "Weekly"}
          </button>
          <button
            id="leaderboard-toggle-monthly"
            onClick={() => setTimeframe('monthly')}
            className={`py-2 px-6 text-xs font-bold rounded-xl transition cursor-pointer ${
              timeframe === 'monthly'
                ? 'bg-blue-600 text-white shadow'
                : (isLight ? 'text-slate-500 hover:text-slate-800' : 'text-slate-400 hover:text-white')
            }`}
          >
            {t.monthly || "Monthly"}
          </button>
        </div>
      </div>

      {/* Ranks list container */}
      <div className={`max-w-xl mx-auto border rounded-[28px] overflow-hidden shadow-2xl backdrop-blur-md ${
        isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900/60 border-white/10'
      }`}>
        
        {/* Leaderboard Table Headers */}
        <div className={`grid grid-cols-12 gap-2 px-5 py-4 border-b text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono ${
          isLight ? 'bg-slate-50 border-slate-100' : 'bg-slate-950/40 border-white/5'
        }`}>
          <div className="col-span-2 text-center">Rank</div>
          <div className="col-span-6">Student Name</div>
          <div className="col-span-2 text-right">Points</div>
          <div className="col-span-2 text-right">Badge</div>
        </div>

        {/* List items */}
        <div className={`divide-y ${isLight ? 'divide-slate-100' : 'divide-white/5'}`}>
          {dataList.map((entry) => {
            const isTop3 = entry.rank <= 3;
            const isSelf = entry.isCurrentUser;

            return (
              <div
                id={`leaderboard-row-${entry.rank}`}
                key={entry.rank}
                className={`grid grid-cols-12 gap-2 px-5 py-3.5 items-center transition duration-200 ${
                  isSelf 
                    ? (isLight ? 'bg-blue-50/70 border-y border-blue-100' : 'bg-blue-600/10 border-y border-blue-500/20') 
                    : (isLight ? 'hover:bg-slate-50' : 'hover:bg-white/5')
                }`}
              >
                {/* Rank */}
                <div className="col-span-2 flex justify-center">
                  {isTop3 ? (
                    <span className="text-xl filter drop-shadow">
                      {entry.rank === 1 ? "🥇" : entry.rank === 2 ? "🥈" : "🥉"}
                    </span>
                  ) : (
                    <span className="text-xs font-bold font-mono text-slate-400">#{entry.rank}</span>
                  )}
                </div>

                {/* Name */}
                <div className="col-span-6 flex items-center gap-3 min-w-0">
                  <div className={`text-xl shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
                    isLight ? 'bg-slate-100' : 'bg-white/5'
                  }`}>
                    {entry.avatar}
                  </div>
                  <div className="min-w-0">
                    <p className={`text-xs font-bold truncate ${isSelf ? (isLight ? 'text-blue-700' : 'text-blue-300') : (isLight ? 'text-slate-700' : 'text-slate-200')}`}>
                      {entry.name}
                    </p>
                    {isSelf && (
                      <span className="text-[8px] font-black uppercase tracking-wider text-blue-500 bg-blue-500/10 border border-blue-500/20 px-1 py-0.2 rounded">YOU</span>
                    )}
                  </div>
                </div>

                {/* Points */}
                <div className="col-span-2 text-right">
                  <span className={`text-xs font-black font-mono ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>{entry.points}</span>
                </div>

                {/* Badge */}
                <div className="col-span-2 text-right">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                    isTop3
                      ? (isLight ? 'bg-amber-50 border border-amber-200 text-amber-700' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20')
                      : (isLight ? 'bg-slate-100 text-slate-600 border border-slate-200' : 'bg-slate-800 text-slate-400 border border-white/5')
                  }`}>
                    {entry.badge}
                  </span>
                </div>

              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}

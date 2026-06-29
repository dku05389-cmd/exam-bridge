/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion } from 'motion/react';
import {
  Play,
  History,
  Clock,
  Crown,
  Lock,
  Compass,
  CheckCircle,
  PlayCircle
} from 'lucide-react';
import { mockVideos } from '../data';
import { VideoLesson, LanguageType, User, AppTheme } from '../types';
import { translations } from '../translations';

interface VideosViewProps {
  user: User;
  language: LanguageType;
  theme?: AppTheme;
  onNavigate: (view: string) => void;
}

export default function VideosView({ user, language, theme = 'dark', onNavigate }: VideosViewProps) {
  const t = translations[language];
  const isLight = theme === 'light';

  // Selected video for active player
  const [activeVideo, setActiveVideo] = useState<VideoLesson | null>(
    mockVideos.find(v => v.stream === user.stream && !v.isPremiumOnly) || null
  );
  const [watchHistory, setWatchHistory] = useState<string[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);

  // Filter video playlist by stream
  const playlist = mockVideos.filter(v => v.stream === user.stream);

  const handleSelectVideo = (video: VideoLesson) => {
    if (video.isPremiumOnly && !user.isPremium) {
      alert("This video lecture is reserved for Premium Yearly members. Upgrade to get full access!");
      onNavigate('premium');
      return;
    }

    setActiveVideo(video);
    setIsPlaying(false);
    // Add to history list
    if (!watchHistory.includes(video.id)) {
      setWatchHistory(prev => [video.id, ...prev]);
    }
  };

  return (
    <div className="space-y-6 text-left">
      
      <div>
        <h2 className={`text-2xl font-display font-black ${isLight ? 'text-slate-800' : 'text-white'}`}>{t.videos || "Video Lectures & Playlists"}</h2>
        <p className={`text-sm ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>High-yield entrance exam lectures prepared by veteran instructors.</p>
      </div>

      {/* Main simulated Video Player */}
      {activeVideo && (
        <div className={`border rounded-3xl overflow-hidden shadow-2xl ${
          isLight ? 'bg-white border-slate-200/80 shadow-sm' : 'bg-slate-900 border-white/10'
        }`}>
          <div className="relative aspect-video bg-black flex items-center justify-center group overflow-hidden">
            {isPlaying ? (
              // Simulated Playback Stream
              <div className="absolute inset-0 flex flex-col justify-between p-4 bg-slate-950">
                <div className="flex justify-between items-center text-xs text-slate-400">
                  <span>🔴 STREAMING LIVE HD</span>
                  <span>{activeVideo.duration} remaining</span>
                </div>
                {/* Visual Audio Waves */}
                <div className="flex justify-center items-center gap-1.5 h-20">
                  <span className="w-1.5 bg-blue-500 rounded animate-[pulse_1.2s_infinite] h-8" />
                  <span className="w-1.5 bg-indigo-500 rounded animate-[pulse_0.8s_infinite] h-14" />
                  <span className="w-1.5 bg-emerald-500 rounded animate-[pulse_1.5s_infinite] h-16" />
                  <span className="w-1.5 bg-blue-400 rounded animate-[pulse_1s_infinite] h-10" />
                </div>
                {/* Custom bar controls */}
                <div className="space-y-2">
                  <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: '0%' }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 180, ease: 'linear' }}
                      className="h-full bg-blue-500 rounded-full"
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <button
                      id="video-pause"
                      onClick={() => setIsPlaying(false)}
                      className="hover:text-white"
                    >
                      Pause
                    </button>
                    <span>{activeVideo.subject} • Prep Series</span>
                  </div>
                </div>
              </div>
            ) : (
              // Video Thumbnail and Play Button overlay
              <>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/35 z-10" />
                <div className="absolute inset-0 bg-blue-900/10 blur-xl scale-75" />
                <div className="z-20 text-center space-y-3">
                  <button
                    id="video-play-trigger"
                    onClick={() => setIsPlaying(true)}
                    className="w-16 h-16 rounded-full bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition cursor-pointer"
                  >
                    <Play className="w-7 h-7 fill-white translate-x-0.5" />
                  </button>
                  <p className="text-[11px] font-bold text-blue-200 tracking-wider uppercase font-mono bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full inline-block">
                    {activeVideo.subject} Lesson
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Active video metadata */}
          <div className={`p-5 border-t ${isLight ? 'border-slate-100 bg-slate-50/50' : 'border-white/5 bg-slate-950/20'}`}>
            <h3 className={`font-display text-base font-bold mb-1.5 ${isLight ? 'text-slate-800' : 'text-white'}`}>{activeVideo.title}</h3>
            <div className={`flex items-center gap-3 text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{activeVideo.duration} Mins</span>
              </span>
              <span>•</span>
              <span className={`font-bold ${isLight ? 'text-blue-600' : 'text-blue-400'}`}>{activeVideo.subject} Playlist</span>
            </div>
          </div>
        </div>
      )}

      {/* Playlist and Watch History columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Playlist column */}
        <div className="md:col-span-2 space-y-3">
          <h4 className={`text-xs font-bold uppercase tracking-widest flex items-center gap-1.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            <Compass className="w-4 h-4 text-blue-400" />
            <span>{t.playlist || "Subject Playlist"}</span>
          </h4>

          <div className="space-y-2.5">
            {playlist.map((video) => {
              const isActive = activeVideo?.id === video.id;
              const isLocked = video.isPremiumOnly && !user.isPremium;

              return (
                <div
                  id={`video-item-${video.id}`}
                  key={video.id}
                  onClick={() => handleSelectVideo(video)}
                  className={`p-3.5 rounded-2xl border transition flex items-center justify-between cursor-pointer ${
                    isActive
                      ? (isLight ? 'bg-blue-50 border-blue-300 text-blue-800' : 'bg-blue-600/15 border-blue-500 text-blue-200')
                      : isLocked
                      ? (isLight ? 'bg-slate-100 border-amber-500/20 opacity-70 hover:bg-slate-200' : 'bg-slate-900/40 border-amber-500/10 opacity-70 hover:bg-slate-900')
                      : (isLight ? 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700 shadow-xs' : 'bg-slate-900/60 border-white/5 hover:bg-slate-800/40 text-slate-300')
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      isActive ? 'bg-blue-500 text-white' : (isLight ? 'bg-slate-100 text-slate-400' : 'bg-white/5 text-slate-400')
                    }`}>
                      {isActive && isPlaying ? (
                        <span className="flex gap-0.5 items-end justify-center h-3">
                          <span className="w-0.5 bg-white h-2 animate-[pulse_0.6s_infinite]" />
                          <span className="w-0.5 bg-white h-3 animate-[pulse_1s_infinite]" />
                          <span className="w-0.5 bg-white h-1.5 animate-[pulse_0.8s_infinite]" />
                        </span>
                      ) : (
                        <PlayCircle className="w-5 h-5" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold truncate">{video.title}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">{video.subject} • {video.duration} mins</p>
                    </div>
                  </div>

                  {/* Lock Indicator */}
                  {isLocked && (
                    <span className="p-1.5 bg-amber-500/10 text-amber-400 rounded-lg border border-amber-500/20" title="Premium Required">
                      <Lock className="w-3.5 h-3.5" />
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Watch History column */}
        <div className="space-y-3">
          <h4 className={`text-xs font-bold uppercase tracking-widest flex items-center gap-1.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            <History className="w-4 h-4 text-emerald-400" />
            <span>{t.watchHistory || "Watch History"}</span>
          </h4>

          {watchHistory.length === 0 ? (
            <div className={`p-5 border rounded-2xl text-center text-xs ${
              isLight ? 'bg-white border-slate-200 text-slate-400' : 'bg-slate-900/30 border-white/5 text-slate-500'
            }`}>
              No videos watched in this session yet. Start learning above!
            </div>
          ) : (
            <div className="space-y-2">
              {watchHistory.map(id => {
                const item = mockVideos.find(v => v.id === id);
                if (!item) return null;
                return (
                  <div key={id} className={`p-3 border rounded-xl flex items-center gap-2 text-xs font-sans ${
                    isLight ? 'bg-white border-slate-200 text-slate-600 shadow-xs' : 'bg-slate-900/60 border-white/5 text-slate-400'
                  }`}>
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="truncate">{item.title}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>

    </div>
  );
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion } from 'motion/react';
import { Microscope, Globe, Check, GraduationCap } from 'lucide-react';
import { StreamType, LanguageType } from '../types';
import { translations } from '../translations';

interface StreamSelectionProps {
  language: LanguageType;
  onSelect: (stream: StreamType) => void;
}

export default function StreamSelection({ language, onSelect }: StreamSelectionProps) {
  const [selected, setSelected] = useState<StreamType | null>(null);
  const t = translations[language];

  const handleConfirm = () => {
    if (selected) {
      onSelect(selected);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4 flex flex-col justify-center min-h-[85vh]">
      <div className="text-center mb-10">
        <motion.div
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="inline-flex items-center justify-center p-3.5 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-full shadow-lg border border-white/10 mb-4"
        >
          <GraduationCap className="w-8 h-8 text-white" />
        </motion.div>
        <h2 className="text-3xl font-display font-bold text-white tracking-tight">
          {t.chooseStream || "Choose Your Academic Stream"}
        </h2>
        <p className="text-sm text-slate-400 mt-2 max-w-md mx-auto leading-relaxed">
          Select your primary pathway. Your dashboard, exam simulator, mock tests, and download guides will customize instantly.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        
        {/* Natural Science Card */}
        <div
          id="stream-natural-card"
          onClick={() => setSelected('Natural Science')}
          className={`glass-card p-6 cursor-pointer relative flex flex-col justify-between min-h-[280px] group ${
            selected === 'Natural Science' ? 'glowing-border-active bg-blue-600/10' : 'hover:bg-slate-800/20'
          }`}
        >
          <div>
            <div className="flex justify-between items-start mb-4">
              <div className="p-3.5 bg-blue-500/10 border border-blue-500/20 rounded-2xl group-hover:scale-110 transition duration-300">
                <Microscope className="w-7 h-7 text-blue-400" />
              </div>
              {selected === 'Natural Science' && (
                <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center shadow">
                  <Check className="w-3.5 h-3.5 text-white" />
                </div>
              )}
            </div>
            <h3 className="text-xl font-bold text-white mb-2">{t.naturalScience || "Natural Science"}</h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              {t.naturalDesc || "Includes Biology, Physics, Chemistry, English, Mathematics, and Aptitude."}
            </p>
          </div>
          {/* Subjects tag preview */}
          <div className="flex flex-wrap gap-1.5 pt-3 border-t border-white/5">
            {['🧬 Bio', '⚛️ Phys', '🧪 Chem', '🇬🇧 Eng', '📐 Math', '🧠 Apt'].map(subj => (
              <span key={subj} className="px-2 py-0.5 bg-white/5 text-[9px] text-slate-400 rounded-md border border-white/5 font-mono">{subj}</span>
            ))}
          </div>
        </div>

        {/* Social Science Card */}
        <div
          id="stream-social-card"
          onClick={() => setSelected('Social Science')}
          className={`glass-card p-6 cursor-pointer relative flex flex-col justify-between min-h-[280px] group ${
            selected === 'Social Science' ? 'glowing-border-active bg-emerald-600/10' : 'hover:bg-slate-800/20'
          }`}
        >
          <div>
            <div className="flex justify-between items-start mb-4">
              <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl group-hover:scale-110 transition duration-300">
                <Globe className="w-7 h-7 text-emerald-400" />
              </div>
              {selected === 'Social Science' && (
                <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center shadow">
                  <Check className="w-3.5 h-3.5 text-white" />
                </div>
              )}
            </div>
            <h3 className="text-xl font-bold text-white mb-2">{t.socialScience || "Social Science"}</h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              {t.socialDesc || "Includes History, Geography, Economics, English, Mathematics, and Aptitude."}
            </p>
          </div>
          {/* Subjects tag preview */}
          <div className="flex flex-wrap gap-1.5 pt-3 border-t border-white/5">
            {['📜 Hist', '🌍 Geog', '📈 Econ', '🇬🇧 Eng', '📐 Math', '🧠 Apt'].map(subj => (
              <span key={subj} className="px-2 py-0.5 bg-white/5 text-[9px] text-slate-400 rounded-md border border-white/5 font-mono">{subj}</span>
            ))}
          </div>
        </div>

      </div>

      {/* Continue Action */}
      <div className="flex justify-center pt-2">
        <button
          id="stream-continue-btn"
          disabled={!selected}
          onClick={handleConfirm}
          className={`w-full max-w-sm font-semibold py-3.5 px-6 rounded-2xl cursor-pointer ${
            selected
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white active:scale-95'
              : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-white/5'
          }`}
        >
          {t.continue || "Continue"}
        </button>
      </div>
    </div>
  );
}

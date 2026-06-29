/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, LineChart, Award, ChevronRight, Sparkles } from 'lucide-react';
import { LanguageType } from '../types';
import { translations } from '../translations';

interface OnboardingProps {
  language: LanguageType;
  onDone: () => void;
}

export default function Onboarding({ language, onDone }: OnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const t = translations[language];

  const steps = [
    {
      title: t.prepareSmarterTitle || "Prepare Smarter",
      desc: t.prepareSmarterDesc || "Access thousands of entrance exam questions and structured solutions.",
      icon: <BookOpen className="w-16 h-16 text-blue-400" />,
      visual: (
        <div className="relative w-full h-48 bg-slate-900/50 rounded-2xl border border-white/5 flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-blue-500/5 blur-xl rounded-full" />
          {/* Mock Exam Question Card inside visual */}
          <div className="w-[85%] bg-slate-800/90 border border-white/10 rounded-xl p-4 shadow-xl text-left scale-95">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-[10px] font-semibold rounded">BIOLOGY</span>
              <span className="text-slate-500 text-[10px]">Entrance Q-101</span>
            </div>
            <p className="text-xs font-semibold text-slate-200 leading-relaxed mb-3">Which cellular organelle is responsible for respiration?</p>
            <div className="space-y-1.5">
              <div className="p-2 rounded bg-slate-700/50 border border-white/5 text-[10px] text-slate-300">A. Chloroplast</div>
              <div className="p-2 rounded bg-blue-600/30 border border-blue-500/50 text-[10px] text-blue-200 font-medium">B. Mitochondrion ✓</div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: t.trackProgressTitle || "Track Progress",
      desc: t.trackProgressDesc || "Monitor your daily study performance with detailed analytics charts.",
      icon: <LineChart className="w-16 h-16 text-emerald-400" />,
      visual: (
        <div className="relative w-full h-48 bg-slate-900/50 rounded-2xl border border-white/5 flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-emerald-500/5 blur-xl rounded-full" />
          {/* Mock Analytics Chart Card inside visual */}
          <div className="w-[85%] bg-slate-800/90 border border-white/10 rounded-xl p-4 shadow-xl text-left scale-95">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-semibold text-slate-300">Weekly Performance</span>
              <span className="text-emerald-400 text-[10px] font-bold">+24% accuracy</span>
            </div>
            {/* SVG Bars for chart */}
            <div className="flex items-end justify-between h-20 px-2 gap-2">
              <div className="w-full bg-slate-700 rounded-t h-1/3" />
              <div className="w-full bg-slate-700 rounded-t h-1/2" />
              <div className="w-full bg-slate-700 rounded-t h-2/5" />
              <div className="w-full bg-gradient-to-t from-emerald-600 to-teal-400 rounded-t h-[85%]" />
              <div className="w-full bg-slate-700 rounded-t h-3/5" />
            </div>
            <div className="flex justify-between text-[8px] text-slate-500 mt-2 px-1">
              <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span>
            </div>
          </div>
        </div>
      )
    },
    {
      title: t.achieveSuccessTitle || "Achieve Success",
      desc: t.achieveSuccessDesc || "Practice, learn and succeed in your university entrance exams.",
      icon: <Award className="w-16 h-16 text-amber-400" />,
      visual: (
        <div className="relative w-full h-48 bg-slate-900/50 rounded-2xl border border-white/5 flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-amber-500/5 blur-xl rounded-full" />
          {/* Achievements badge inside visual */}
          <div className="text-center">
            <div className="inline-flex relative mb-2">
              <div className="w-16 h-16 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-amber-400" />
              </div>
              <span className="absolute -top-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-4 w-4 bg-amber-500" />
              </span>
            </div>
            <h4 className="text-xs font-bold text-amber-300 uppercase tracking-widest">UEE Ready</h4>
            <p className="text-[10px] text-slate-400 mt-1">Streaks active & study goal locked</p>
          </div>
        </div>
      )
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onDone();
    }
  };

  const handleSkip = () => {
    onDone();
  };

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#0A1945] text-white z-40 px-2.5">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.08),transparent_40%)]" />

      {/* Main Glass Onboarding Card */}
      <div className="w-full max-w-md bg-slate-900/80 border border-white/10 rounded-[32px] p-6 shadow-2xl backdrop-blur-xl relative overflow-hidden flex flex-col min-h-[520px] justify-between">
        
        {/* Header Options */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-blue-400 tracking-wider">EXAM BRIDGE</span>
          {currentStep < steps.length - 1 && (
            <button
              id="onb-skip-btn"
              onClick={handleSkip}
              className="text-xs text-slate-400 hover:text-white transition duration-200 cursor-pointer font-medium"
            >
              {t.skip || "Skip"}
            </button>
          )}
        </div>

        {/* Swipeable steps content */}
        <div className="my-8 flex-1 flex flex-col justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center text-center space-y-6"
            >
              {/* Animated Icon Circle */}
              <div className="p-4 bg-white/5 rounded-3xl border border-white/10 shadow-inner">
                {steps[currentStep].icon}
              </div>

              {/* Title & Description */}
              <div className="space-y-2">
                <h2 className="font-display text-2xl font-bold tracking-tight text-white">
                  {steps[currentStep].title}
                </h2>
                <p className="font-sans text-sm text-slate-400 leading-relaxed max-w-xs mx-auto">
                  {steps[currentStep].desc}
                </p>
              </div>

              {/* Graphical Visual Panel */}
              <div className="w-full pt-2">
                {steps[currentStep].visual}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer controls */}
        <div className="flex items-center justify-between pt-4 border-t border-white/5">
          {/* Step dots */}
          <div className="flex space-x-2">
            {steps.map((_, idx) => (
              <span
                key={idx}
                className={`h-2 rounded-full transition-all duration-300 ${
                  idx === currentStep ? 'w-6 bg-blue-500' : 'w-2 bg-slate-700'
                }`}
              />
            ))}
          </div>

          {/* Action button */}
          <button
            id="onb-next-btn"
            onClick={handleNext}
            className="flex items-center gap-1.5 px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-sm font-semibold text-white active:scale-95 transition-all duration-200 cursor-pointer"
          >
            <span>{currentStep === steps.length - 1 ? (t.getStarted || "Get Started") : (t.next || "Next")}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}

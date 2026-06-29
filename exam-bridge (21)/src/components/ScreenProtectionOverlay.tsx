/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert, Lock, EyeOff } from 'lucide-react';
import { User } from '../types';

interface ScreenProtectionOverlayProps {
  isProtected: boolean;
  screenshotAttempted: boolean;
  user: User | null;
}

export default function ScreenProtectionOverlay({
  isProtected,
  screenshotAttempted,
  user
}: ScreenProtectionOverlayProps) {
  
  // Format current date & time for security logs
  const getSecurityTimestamp = () => {
    const now = new Date();
    return now.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  };

  // Safe username fallback
  const studentName = user?.name || 'Authorized Student';
  const studentId = user?.id || 'EB-SECURE-SESSION';

  return (
    <>
      {/* 2. Full-Screen Backdrop Blur Shield Cover when app is hidden, sent to background, or blurred */}
      <AnimatePresence>
        {isProtected && (
          <motion.div
            id="screen-blur-shield"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-[10000] bg-slate-950 backdrop-blur-3xl select-none flex items-center justify-center"
          >
            {screenshotAttempted && (
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-black/60 border border-white/10 px-6 py-4 rounded-3xl flex flex-col items-center gap-3 backdrop-blur-md"
              >
                <ShieldAlert className="w-8 h-8 text-amber-500" />
                <span className="text-[10px] font-black uppercase tracking-widest text-white">Screenshot Restricted</span>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

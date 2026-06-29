/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, Phone, User, School, Eye, EyeOff, Sparkles } from 'lucide-react';
import { User as UserType, LanguageType } from '../types';
import { translations } from '../translations';

interface AuthProps {
  language: LanguageType;
  onAuthSuccess: (user: UserType) => void;
}

export default function Auth({ language, onAuthSuccess }: AuthProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [school, setSchool] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const t = translations[language];

  // Unique Student ID Generator
  const generateStudentId = () => {
    const year = new Date().getFullYear();
    const rand = Math.floor(10000 + Math.random() * 90000);
    return `EB-${year}-${rand}`;
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email || !password) {
      setErrorMsg("Please fill in all required fields.");
      return;
    }

    if (isLogin) {
      // Simulate Login
      const savedUsers: UserType[] = JSON.parse(localStorage.getItem('eb_users') || '[]');
      const foundUser = savedUsers.find(u => u.email.toLowerCase() === email.toLowerCase());

      if (foundUser) {
        onAuthSuccess(foundUser);
      } else {
        // Fallback default student if none exist
        const defaultUser: UserType = {
          id: generateStudentId(),
          name: email.split('@')[0].toUpperCase(),
          email: email,
          phone: "+251 912 345 678",
          school: "High School Prep",
          stream: null, // Forces stream selection on first login
          isPremium: false,
          premiumStatus: 'free',
          registrationDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
          premiumJoinedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          studyStreak: 35, // default study streak requested in welcome banner
          studyTimeSeconds: 4200,
          questionsSolved: 140,
          correctAnswersCount: 112,
          avatar: "👨‍🎓",
          points: 1200
        };
        // Add default user to store
        savedUsers.push(defaultUser);
        localStorage.setItem('eb_users', JSON.stringify(savedUsers));
        onAuthSuccess(defaultUser);
      }
    } else {
      // Registration flow
      if (!fullName || !phone || !school) {
        setErrorMsg("Please fill in all registration fields.");
        return;
      }

      const savedUsers: UserType[] = JSON.parse(localStorage.getItem('eb_users') || '[]');
      const userExists = savedUsers.some(u => u.email.toLowerCase() === email.toLowerCase());

      if (userExists) {
        setErrorMsg("An account with this email already exists.");
        return;
      }

      const newUser: UserType = {
        id: generateStudentId(),
        name: fullName,
        email: email,
        phone: phone,
        school: school,
        stream: null, // Must choose Stream next!
        isPremium: false,
        premiumStatus: 'free',
        registrationDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        premiumJoinedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        studyStreak: 1,
        studyTimeSeconds: 0,
        questionsSolved: 0,
        correctAnswersCount: 0,
        avatar: Math.random() > 0.5 ? "👨‍🎓" : "👩‍🎓",
        points: 100 // Welcome points
      };

      savedUsers.push(newUser);
      localStorage.setItem('eb_users', JSON.stringify(savedUsers));
      onAuthSuccess(newUser);
    }
  };

  const handleGoogleMockLogin = () => {
    const googleUser: UserType = {
      id: generateStudentId(),
      name: "Abel Tesfaye",
      email: "abel.tesfaye@gmail.com",
      phone: "+251 987 654 321",
      school: "Bole Secondary School",
      stream: null, // First-time setup
      isPremium: false,
      premiumStatus: 'free',
      registrationDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      premiumJoinedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      studyStreak: 35,
      studyTimeSeconds: 7200,
      questionsSolved: 240,
      correctAnswersCount: 198,
      avatar: "👨‍🎓",
      points: 2400
    };
    
    const savedUsers: UserType[] = JSON.parse(localStorage.getItem('eb_users') || '[]');
    const userIndex = savedUsers.findIndex(u => u.email === googleUser.email);
    if (userIndex === -1) {
      savedUsers.push(googleUser);
    } else {
      googleUser.stream = savedUsers[userIndex].stream;
      googleUser.isPremium = false;
      googleUser.premiumStatus = 'free';
    }
    localStorage.setItem('eb_users', JSON.stringify(savedUsers));
    onAuthSuccess(googleUser);
  };

  return (
    <div className="w-full max-w-md mx-auto px-2.5 py-4 flex flex-col justify-center min-h-[85vh]">
      <div className="text-center mb-8">
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="inline-flex items-center justify-center p-3.5 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-3xl shadow-lg border border-white/15 mb-4"
        >
          <Sparkles className="w-7 h-7 text-white" />
        </motion.div>
        <h2 className="text-3xl font-display font-extrabold text-white tracking-tight">
          {isLogin ? t.login : t.register}
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          {t.tagline}
        </p>
      </div>

      <div className="bg-slate-900/60 border border-white/10 rounded-[28px] p-6 shadow-2xl backdrop-blur-xl">
        <form onSubmit={handleAuthSubmit} className="space-y-4">
          
          {errorMsg && (
            <div className="p-3 text-xs bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-center">
              {errorMsg}
            </div>
          )}

          {/* Registration Fields */}
          {!isLogin && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">{t.fullName}</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    id="auth-name"
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Samuel Alene"
                    className="w-full bg-slate-800/50 border border-white/5 focus:border-blue-500/80 rounded-2xl py-3 pl-11 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500/30 transition duration-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">{t.phoneNumber}</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    id="auth-phone"
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+251 912 345 678"
                    className="w-full bg-slate-800/50 border border-white/5 focus:border-blue-500/80 rounded-2xl py-3 pl-11 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500/30 transition duration-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">{t.schoolName}</label>
                <div className="relative">
                  <School className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    id="auth-school"
                    type="text"
                    required
                    value={school}
                    onChange={(e) => setSchool(e.target.value)}
                    placeholder="e.g. Bole Secondary School"
                    className="w-full bg-slate-800/50 border border-white/5 focus:border-blue-500/80 rounded-2xl py-3 pl-11 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500/30 transition duration-200"
                  />
                </div>
              </div>
            </>
          )}

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">{t.email}</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                id="auth-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="yourname@domain.com"
                className="w-full bg-slate-800/50 border border-white/5 focus:border-blue-500/80 rounded-2xl py-3 pl-11 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500/30 transition duration-200"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-semibold text-slate-400">{t.password}</label>
              {isLogin && (
                <button
                  id="auth-forgot-btn"
                  type="button"
                  onClick={() => alert("Verification code sent to registered email.")}
                  className="text-[11px] text-blue-400 hover:text-blue-300 font-medium cursor-pointer"
                >
                  {t.forgotPassword}
                </button>
              )}
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                id="auth-password"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-800/50 border border-white/5 focus:border-blue-500/80 rounded-2xl py-3 pl-11 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500/30 transition duration-200"
              />
              <button
                id="auth-eye-btn"
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Remember Me */}
          {isLogin && (
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  id="auth-remember-check"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-700 text-blue-500 bg-slate-800 focus:ring-blue-500/30"
                />
                <span className="text-xs text-slate-400">{t.rememberMe}</span>
              </label>
            </div>
          )}

          {/* Submit Button */}
          <button
            id="auth-submit-btn"
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold py-3.5 px-4 rounded-2xl active:scale-95 transition-all duration-200 cursor-pointer mt-4"
          >
            {isLogin ? t.login : t.register}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/5"></div>
          </div>
          <span className="relative bg-[#111827] px-3 text-[11px] text-slate-500 font-medium uppercase tracking-wider">Or continue with</span>
        </div>

        {/* Social Login */}
        <button
          id="auth-google-btn"
          onClick={handleGoogleMockLogin}
          type="button"
          className="w-full bg-slate-800 hover:bg-slate-700 border border-white/5 hover:border-white/10 text-white text-xs font-semibold py-3 px-4 rounded-2xl flex items-center justify-center gap-2 transition duration-200 cursor-pointer"
        >
          {/* Custom inline Google SVG logo */}
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>{t.googleLogin}</span>
        </button>

        {/* Auth Toggle */}
        <div className="text-center mt-6">
          <button
            id="auth-toggle-btn"
            onClick={() => setIsLogin(!isLogin)}
            className="text-xs text-slate-400 hover:text-white font-medium transition duration-200 cursor-pointer"
          >
            {isLogin ? t.noAccount : t.hasAccount}
          </button>
        </div>
      </div>
    </div>
  );
}

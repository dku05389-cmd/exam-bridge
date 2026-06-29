/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type StreamType = 'Natural Science' | 'Social Science';

export interface User {
  id: string; // Unique Student ID: EB-XXXX-XXXX
  name: string;
  email: string;
  phone: string;
  school: string;
  stream: StreamType | null;
  isPremium: boolean;
  premiumStatus: 'free' | 'pending' | 'premium';
  registrationDate: string;
  premiumJoinedDate: string | null;
  studyStreak: number;
  studyTimeSeconds: number; // For analytics
  questionsSolved: number;
  correctAnswersCount: number;
  avatar: string;
  points: number;
}

export interface Question {
  id: string;
  text: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  explanation: string;
  subject: string;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  stream: StreamType;
  year?: string;
}

export interface Note {
  id: string;
  title: string;
  subject: string;
  grade: number;
  chapter: number;
  category: 'Short Notes' | 'PDF Notes' | 'Formula Sheets' | 'Revision Guides';
  content: string;
  fileSize: string;
  isPremiumOnly: boolean;
  stream: StreamType;
}

export interface VideoLesson {
  id: string;
  title: string;
  subject: string;
  duration: string;
  youtubeId: string; // For simulation
  isPremiumOnly: boolean;
  stream: StreamType;
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  points: number;
  badge: string;
  avatar: string;
  isCurrentUser?: boolean;
}

export interface PaymentRequest {
  id: string;
  studentId: string;
  studentName: string;
  amount: number;
  bankName: string;
  transactionId: string;
  receiptName: string;
  receiptUrl: string; // Data URL for simulation
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  comment?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'reminder' | 'question' | 'note' | 'mock' | 'premium';
  createdAt: string;
  read: boolean;
}

export interface Bookmark {
  questionId: string;
  subject: string;
}

export type LanguageType = 'en' | 'am' | 'om' | 'ti';
export type AppTheme = 'light' | 'dark';

export interface AppState {
  user: User | null;
  theme: AppTheme;
  language: LanguageType;
  selectedStream: StreamType | null;
  bookmarks: Bookmark[];
  paymentRequests: PaymentRequest[];
  notifications: Notification[];
  offlineDownloadedSubjects: string[]; // Subject names
  streakCount: number;
  lastStudyDate: string | null;
  focusMode: boolean;
}

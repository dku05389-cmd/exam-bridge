/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Shield,
  Upload,
  Coins,
  FileSpreadsheet,
  CheckCircle,
  XCircle,
  Activity,
  UserCheck,
  Trash2,
  AlertTriangle,
  Sparkles,
  Save,
  Plus
} from 'lucide-react';
import { LanguageType, PaymentRequest, Question, AppTheme } from '../types';
import { mockQuestions } from '../data';

interface AdminPanelProps {
  language: LanguageType;
  theme?: AppTheme;
  paymentRequests: PaymentRequest[];
  onApprovePayment: (reqId: string) => void;
  onDeclinePayment: (reqId: string) => void;
  onBulkAddQuestions: (qs: Question[]) => void;
}

export default function AdminPanel({
  language,
  theme = 'dark',
  paymentRequests,
  onApprovePayment,
  onDeclinePayment,
  onBulkAddQuestions
}: AdminPanelProps) {
  const isLight = theme === 'light';
  
  // Premium Price configuration state
  const [premiumPrice, setPremiumPrice] = useState(200);
  const [dragOver, setDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [fileName, setFileName] = useState('');

  // Bulk preview questions state
  const [previewList, setPreviewList] = useState<any[]>([]);
  const [stats, setStats] = useState({ duplicates: 0, errors: 0 });

  useEffect(() => {
    const savedPrice = localStorage.getItem('eb_premium_price');
    if (savedPrice) {
      setPremiumPrice(Number(savedPrice));
    }
  }, []);

  const handleSavePrice = () => {
    localStorage.setItem('eb_premium_price', String(premiumPrice));
    alert(`Yearly Premium Subscription Price updated successfully to ${premiumPrice} ETB.`);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  // Mock file uploader and validator
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    setFileName(file.name);
    setIsUploading(true);
    setUploadProgress(10);

    // Simulate progress upload increments
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          // Generate mock parsed bulk questions matching requirements
          generateBulkQuestions();
          return 100;
        }
        return prev + 30;
      });
    }, 400);
  };

  const generateBulkQuestions = () => {
    // Generate simulated parsed questions list
    const parsed = [
      {
        id: "bulk-q1",
        text: "Which of the following describes the correct chronological sequence of hominid evolution?",
        options: {
          A: "Australopithecus, Homo habilis, Homo erectus, Homo sapiens",
          B: "Homo erectus, Australopithecus, Homo habilis, Homo sapiens",
          C: "Homo habilis, Homo erectus, Homo sapiens, Australopithecus",
          D: "Australopithecus, Homo erectus, Homo habilis, Homo sapiens"
        },
        correctAnswer: "A",
        explanation: "Australopithecus evolved first, followed by Homo habilis (handy man), then Homo erectus (upright man), leading to Homo sapiens.",
        subject: "Biology",
        topic: "Human Evolution",
        difficulty: "medium",
        stream: "Natural Science"
      },
      {
        text: "The speed of light in a vacuum is approximately:",
        options: {
          A: "3 x 10^8 m/s",
          B: "3 x 10^6 m/s",
          C: "1.5 x 10^8 m/s",
          D: "3 x 10^10 m/s"
        },
        correctAnswer: "A",
        explanation: "The constant speed of light in vacuum is defined exactly as 299,792,458 m/s (~3 x 10^8 m/s).",
        subject: "Physics",
        topic: "Optics",
        difficulty: "easy",
        stream: "Natural Science"
      },
      {
        text: "What was the main cause of the battle of Adwa in 1896?",
        options: {
          A: "The interpretation of Article XVII of the Treaty of Wuchale",
          B: "Italian territorial hunger to secure deep sea ports",
          C: "Dispute over the control of trade routes to Massawa",
          D: "British instigation of the regional governors"
        },
        correctAnswer: "A",
        explanation: "Italian version claimed Ethiopian protectorate, Amharic version claimed optional support. This conflict led to the historic victory at Adwa.",
        subject: "History",
        topic: "Modern Ethiopia",
        difficulty: "hard",
        stream: "Social Science"
      }
    ];

    setPreviewList(parsed);
    // Simulate error/duplicate logs (e.g. duplicate check against current db)
    setStats({
      duplicates: 0,
      errors: 0
    });
  };

  const handleEditPreview = (index: number, key: string, val: any) => {
    setPreviewList(prev => {
      const copy = [...prev];
      copy[index] = {
        ...copy[index],
        [key]: val
      };
      return copy;
    });
  };

  const handleCommitUpload = () => {
    if (previewList.length === 0) return;

    // Convert preview objects to proper Question format
    const formatted: Question[] = previewList.map((q, idx) => ({
      id: `bulk-${Date.now()}-${idx}`,
      text: q.text,
      options: q.options,
      correctAnswer: q.correctAnswer || 'A',
      explanation: q.explanation || 'No explanation provided.',
      subject: q.subject || 'Biology',
      topic: q.topic || 'General',
      difficulty: q.difficulty || 'medium',
      stream: q.stream || 'Natural Science'
    }));

    onBulkAddQuestions(formatted);
    alert(`Successfully loaded & merged ${formatted.length} new bulk questions into database.`);
    setPreviewList([]);
    setFileName('');
  };

  const handleRemovePreview = (index: number) => {
    setPreviewList(prev => prev.filter((_, idx) => idx !== index));
  };

  return (
    <div className="space-y-8 text-left max-w-4xl mx-auto">
      
      {/* Admin header */}
      <div className="flex items-center gap-3">
        <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-full">
          <Shield className="w-8 h-8" />
        </div>
        <div>
          <h2 className={`text-2xl font-display font-black ${isLight ? 'text-slate-800' : 'text-white'}`}>Administration Command Console</h2>
          <p className={`text-sm ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Manage payment verifications, update catalog pricing, and upload bulk questions.</p>
        </div>
      </div>

      {/* Grid: 1. Price config, 2. Pending Requests */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Subscription Price Control */}
        <div className={`border rounded-3xl p-6 space-y-4 ${
          isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900/60 border-white/10'
        }`}>
          <h3 className={`text-xs font-bold uppercase tracking-widest flex items-center gap-2 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            <Coins className="w-4 h-4 text-blue-500" />
            <span>Premium Price Config</span>
          </h3>

          <div className="space-y-3">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Yearly Price (ETB)</label>
              <input
                id="admin-price-input"
                type="number"
                value={premiumPrice}
                onChange={(e) => setPremiumPrice(Number(e.target.value))}
                className={`w-full border rounded-xl py-2 px-3 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                  isLight ? 'bg-slate-50 border-slate-200 text-slate-800' : 'bg-slate-800 border-white/5 text-white'
                }`}
              />
            </div>

            <button
              id="admin-save-price"
              onClick={handleSavePrice}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow cursor-pointer transition"
            >
              Save Price Settings
            </button>
          </div>
        </div>

        {/* Student Payment approvals queue */}
        <div className={`md:col-span-2 border rounded-3xl p-6 space-y-4 ${
          isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900/60 border-white/10'
        }`}>
          <h3 className={`text-xs font-bold uppercase tracking-widest flex items-center gap-2 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            <UserCheck className="w-4 h-4 text-emerald-500" />
            <span>Student Payment Reviews ({paymentRequests.length})</span>
          </h3>

          {paymentRequests.length === 0 ? (
            <div className={`p-6 text-center text-xs border rounded-2xl ${
              isLight ? 'bg-slate-50 border-slate-200 text-slate-400' : 'bg-slate-950/20 border-white/5 text-slate-500'
            }`}>
              All payment submissions reviewed. Queue is empty.
            </div>
          ) : (
            <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
              {paymentRequests.map((req) => (
                <div key={req.id} className={`p-4 border rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 ${
                  isLight ? 'bg-slate-50/50 border-slate-200' : 'bg-slate-950/40 border-white/5'
                }`}>
                  <div className="space-y-1 text-xs font-sans">
                    <p className={`font-bold ${isLight ? 'text-slate-800' : 'text-white'}`}>Student: {req.studentName} <span className="font-mono text-[9px] text-slate-400">({req.studentId})</span></p>
                    <p className={`text-[10px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Bank: {req.bankName} • ID: <span className={`font-mono ${isLight ? 'text-slate-700' : 'text-slate-200'}`}>{req.transactionId}</span></p>
                    <p className="text-emerald-500 font-bold">{req.amount} ETB</p>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      id={`admin-approve-${req.id}`}
                      onClick={() => onApprovePayment(req.id)}
                      className="flex-1 sm:flex-none px-3.5 py-1.5 bg-emerald-600 text-white hover:bg-emerald-500 rounded-xl text-xs font-bold transition cursor-pointer"
                    >
                      Approve
                    </button>
                    <button
                      id={`admin-decline-${req.id}`}
                      onClick={() => onDeclinePayment(req.id)}
                      className="flex-1 sm:flex-none px-3.5 py-1.5 bg-red-600 text-white hover:bg-red-500 rounded-xl text-xs font-bold transition cursor-pointer"
                    >
                      Decline
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Bulk Question Upload Module (Excel/CSV/JSON/Word mockup) */}
      <div className={`border rounded-3xl p-6 space-y-6 ${
        isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900/60 border-white/10'
      }`}>
        <div className={`flex justify-between items-center pb-3 border-b ${isLight ? 'border-slate-100' : 'border-white/5'}`}>
          <div>
            <h3 className={`text-sm font-bold uppercase tracking-widest flex items-center gap-2 ${isLight ? 'text-slate-800' : 'text-slate-400'}`}>
              <Upload className="w-4.5 h-4.5 text-blue-500 animate-bounce" />
              <span>Bulk Question Upload Portal</span>
            </h3>
            <p className={`text-[11px] mt-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Accepts Excel (.xlsx), CSV (.csv), JSON (.json), Word (.docx) formats.</p>
          </div>
          <span className="px-2 py-0.5 bg-blue-500/10 text-blue-500 text-[8px] font-black rounded border border-blue-500/20">ADMIN ONLY</span>
        </div>

        {/* Drag and drop panel */}
        <div
          id="bulk-drag-drop"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => document.getElementById('admin-file-picker')?.click()}
          className={`border-2 border-dashed rounded-3xl p-8 text-center cursor-pointer transition ${
            dragOver 
              ? 'border-blue-400 bg-blue-500/5' 
              : (isLight ? 'border-slate-200 hover:border-slate-300 bg-slate-50' : 'border-white/10 hover:border-white/20 bg-slate-950/20')
          }`}
        >
          <input
            id="admin-file-picker"
            type="file"
            accept=".xlsx,.csv,.json,.docx"
            className="hidden"
            onChange={handleFileChange}
          />

          <div className="space-y-3">
            <FileSpreadsheet className="w-10 h-10 text-blue-500 mx-auto" />
            <div className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-200'}`}>
              <span className={`font-bold block text-sm ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>Drag & Drop Catalog File Here</span>
              <span className="text-slate-400 font-sans block mt-1">or click to browse local folders</span>
            </div>
          </div>
        </div>

        {/* Upload progress bars */}
        {isUploading && (
          <div className={`p-4 border rounded-2xl ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/40 border-white/5'}`}>
            <div className={`flex justify-between text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              <span className="font-bold truncate max-w-[180px]">Parsing: {fileName}</span>
              <span className="font-mono">{uploadProgress}%</span>
            </div>
            <div className={`w-full h-1.5 rounded-full overflow-hidden ${isLight ? 'bg-slate-200' : 'bg-slate-800'}`}>
              <div
                className="h-full bg-blue-500 transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Catalog Preview Table before import */}
        {previewList.length > 0 && (
          <div className={`space-y-4 pt-4 border-t ${isLight ? 'border-slate-100' : 'border-white/5'}`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className={`text-xs font-bold uppercase ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>Pre-Import Catalog Preview</h4>
                <p className="text-[10px] text-slate-400 font-sans">Please review parsed options, auto stream, and difficulty allocations.</p>
              </div>

              {/* Stats & validations logs */}
              <div className="flex items-center gap-3.5">
                <span className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-bold rounded-lg flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>{previewList.length} Questions Verified</span>
                </span>
                <span className="px-2.5 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-500 text-[10px] font-bold rounded-lg flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Simulating AI validation</span>
                </span>
              </div>
            </div>

            {/* List Table edit item rows */}
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
              {previewList.map((q, idx) => (
                <div key={idx} className={`p-4 border rounded-2xl relative space-y-3 ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/60 border-white/5'
                }`}>
                  <button
                    id={`admin-remove-prev-${idx}`}
                    onClick={() => handleRemovePreview(idx)}
                    className="absolute top-4 right-4 text-slate-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-slate-200 transition"
                    title="Remove Question"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                    <div className="sm:col-span-2">
                      <label className="block text-[9px] font-bold text-slate-400 uppercase">Question Text</label>
                      <input
                        type="text"
                        value={q.text}
                        onChange={(e) => handleEditPreview(idx, 'text', e.target.value)}
                        className={`mt-1 w-full border rounded-xl py-2 px-3 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                          isLight ? 'bg-white border-slate-300 text-slate-800' : 'bg-slate-800 border border-white/5 text-white'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold text-slate-400 uppercase">Subject</label>
                      <input
                        type="text"
                        value={q.subject}
                        onChange={(e) => handleEditPreview(idx, 'subject', e.target.value)}
                        className={`mt-1 w-full border rounded-xl py-2 px-3 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                          isLight ? 'bg-white border-slate-300 text-slate-800' : 'bg-slate-800 border border-white/5 text-white'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold text-slate-400 uppercase">Correct Answer</label>
                      <select
                        value={q.correctAnswer}
                        onChange={(e) => handleEditPreview(idx, 'correctAnswer', e.target.value)}
                        className={`mt-1 w-full border rounded-xl py-2 px-3 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                          isLight ? 'bg-white border-slate-300 text-slate-800' : 'bg-slate-800 border border-white/5 text-white'
                        }`}
                      >
                        <option value="A">A</option>
                        <option value="B">B</option>
                        <option value="C">C</option>
                        <option value="D">D</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Action commit bulk */}
            <div className="flex gap-3">
              <button
                id="bulk-commit-btn"
                onClick={handleCommitUpload}
                className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow cursor-pointer transition"
              >
                Commit & Upload Checked Catalog
              </button>
              <button
                id="bulk-cancel-btn"
                onClick={() => setPreviewList([])}
                className={`py-3 px-6 border font-bold text-xs rounded-xl cursor-pointer transition ${
                  isLight ? 'bg-white hover:bg-slate-50 border-slate-200 text-slate-600' : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-white/5'
                }`}
              >
                Clear Preview
              </button>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}

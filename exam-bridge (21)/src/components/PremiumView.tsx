/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Crown,
  CheckCircle2,
  Copy,
  Upload,
  Coins,
  ShieldCheck,
  FileCheck,
  CreditCard,
  Building2,
  Lock
} from 'lucide-react';
import { LanguageType, User, PaymentRequest, AppTheme } from '../types';
import { translations } from '../translations';

interface PremiumViewProps {
  user: User;
  language: LanguageType;
  theme?: AppTheme;
  onNavigate: (view: string) => void;
  onSubmitPayment: (request: Omit<PaymentRequest, 'id' | 'studentId' | 'studentName' | 'status' | 'submittedAt'>) => void;
  pendingRequest: PaymentRequest | null;
}

export default function PremiumView({
  user,
  language,
  theme = 'dark',
  onNavigate,
  onSubmitPayment,
  pendingRequest
}: PremiumViewProps) {
  const t = translations[language];
  const isLight = theme === 'light';

  // Price yearly controlled by admin (defaults to 200 ETB / Year)
  const [yearlyPrice, setYearlyPrice] = useState(200);
  const [selectedBank, setSelectedBank] = useState<string>('');
  const [transactionId, setTransactionId] = useState('');
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptBase64, setReceiptBase64] = useState<string>('');
  const [copySuccess, setCopySuccess] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    const adminPrice = localStorage.getItem('eb_premium_price');
    if (adminPrice) {
      setYearlyPrice(Number(adminPrice));
    }
  }, []);

  const banks = [
    { id: 'cbe', name: "Commercial Bank of Ethiopia (CBE)", acc: "1000456123789", holder: "EXAM BRIDGE EDTECH SYSTEM" },
    { id: 'abyssinia', name: "Bank of Abyssinia (BOA)", acc: "87641235", holder: "EXAM BRIDGE EDTECH" },
    { id: 'awash', name: "Awash International Bank", acc: "01320448123500", holder: "EXAM BRIDGE SYST" },
    { id: 'abbay', name: "Abbay Bank S.C.", acc: "401235678", holder: "EXAM BRIDGE GROUP" },
    { id: 'telebirr', name: "Telebirr merchant", acc: "654123", holder: "EXAM BRIDGE PORTAL" },
    { id: 'cbebirr', name: "CBE Birr Wallet", acc: "0912345678", holder: "EXAM BRIDGE BILLS" }
  ];

  const activeBank = banks.find(b => b.id === selectedBank);

  const handleCopyAccount = () => {
    if (activeBank) {
      navigator.clipboard.writeText(activeBank.acc);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setReceiptFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setReceiptBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setReceiptFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setReceiptBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedBank || !transactionId || !receiptBase64) {
      alert("Please fill in all verification fields and upload your receipt.");
      return;
    }

    onSubmitPayment({
      amount: yearlyPrice,
      bankName: activeBank?.name || selectedBank,
      transactionId: transactionId,
      receiptName: receiptFile?.name || 'uploaded_receipt.jpg',
      receiptUrl: receiptBase64
    });
  };

  // 1. Render user is already Premium Member
  if (user.isPremium) {
    return (
      <div className="space-y-6 max-w-xl mx-auto pb-10 text-center">
        <div className={`inline-flex p-4 rounded-full text-amber-500 mb-3 border ${
          isLight ? 'bg-amber-50 border-amber-100' : 'bg-amber-500/10 border-amber-500/20'
        }`}>
          <Crown className="w-12 h-12 fill-amber-500 animate-pulse" />
        </div>
        <h2 className={`text-3xl font-display font-black ${isLight ? 'text-slate-800' : 'text-white'}`}>{t.premiumYearlyMember || "🏆 Premium Yearly Member"}</h2>
        <p className={`text-sm ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Your account is fully upgraded and secure. Enjoy unlimited educational items!</p>

        <div className={`border rounded-3xl p-6 text-left space-y-3 mt-4 ${
          isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900/60 border-white/10'
        }`}>
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest font-mono">Active Plan Details</h4>
          <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>Duration: <span className="font-bold text-emerald-500">365 Days Unlimited Access</span></p>
          <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>Status: <span className="font-bold uppercase text-blue-500">{t.active}</span></p>
          <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>Joined Date: <span className="font-bold text-slate-500">{user.premiumJoinedDate || "June 2026"}</span></p>
        </div>

        <button
          id="prem-home-btn"
          onClick={() => onNavigate('home')}
          className="w-full max-w-xs mt-6 py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold rounded-xl shadow cursor-pointer transition"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  // 2. Render Payment Pending Approval State (locks all fields)
  if (pendingRequest) {
    return (
      <div className="space-y-6 max-w-xl mx-auto pb-10 text-center">
        <div className="inline-flex p-4 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 mb-3">
          <FileCheck className="w-12 h-12 animate-pulse" />
        </div>
        <h2 className={`text-2xl font-display font-black ${isLight ? 'text-slate-800' : 'text-white'}`}>{t.pendingReview || "Verification Pending Review"}</h2>
        <p className={`text-sm ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>{t.verificationSuccess || "Verification Submitted Successfully!"}</p>

        <div className={`border rounded-3xl p-6 text-left space-y-4 mt-4 ${
          isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900/60 border-white/10'
        }`}>
          <div className={`p-3 rounded-xl border text-xs font-sans leading-relaxed ${
            isLight ? 'bg-blue-50/40 border-blue-200/50 text-slate-700' : 'bg-blue-500/5 border-blue-500/10 text-slate-300'
          }`}>
            {t.pendingMsg || "Your payment review will be completed within 12 hours. Please wait patiently. Thank you!"}
          </div>

          <div className="space-y-2 text-xs font-sans">
            <h4 className="font-bold uppercase text-[10px] tracking-widest text-slate-500 mb-1">Receipt Details (Locked)</h4>
            <p className={isLight ? 'text-slate-600' : 'text-slate-400'}>Transaction ID: <span className={`font-bold font-mono ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>{pendingRequest.transactionId}</span></p>
            <p className={isLight ? 'text-slate-600' : 'text-slate-400'}>Payment Method: <span className={`font-bold ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>{pendingRequest.bankName}</span></p>
            <p className={isLight ? 'text-slate-600' : 'text-slate-400'}>Amount Transferred: <span className="font-bold text-emerald-500">{pendingRequest.amount} ETB</span></p>
            <p className={isLight ? 'text-slate-600' : 'text-slate-400'}>Status: <span className="font-bold text-yellow-600">PENDING APPROVAL</span></p>
          </div>
        </div>

        <button
          id="prem-back-btn"
          onClick={() => onNavigate('home')}
          className={`w-full max-w-xs mt-6 py-3 px-4 border text-xs font-bold rounded-xl cursor-pointer transition ${
            isLight ? 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700 shadow-sm' : 'bg-slate-800 border-white/10 hover:bg-slate-700 text-white'
          }`}
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  // 3. Normal Selection and Payment Upload Screen
  return (
    <div className="space-y-6 max-w-2xl mx-auto text-left">
      
      {/* Advantage list banner */}
      <div className="text-center max-w-md mx-auto space-y-2 mb-6">
        <div className={`inline-flex p-3 rounded-full text-amber-500 border ${
          isLight ? 'bg-amber-50 border-amber-100' : 'bg-amber-500/10 border-amber-500/20'
        }`}>
          <Crown className="w-8 h-8 fill-amber-500 animate-pulse" />
        </div>
        <h2 className={`text-2xl font-display font-black ${isLight ? 'text-slate-800' : 'text-white'}`}>{t.premiumTitle || "Premium Yearly Plan"}</h2>
        <p className={`text-sm ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Unlock your full potential with continuous access to all learning materials for an entire year.</p>
        <span className="inline-block px-3 py-1 bg-amber-500 text-black text-xs font-black rounded-full shadow-md animate-bounce">
          {yearlyPrice} ETB / 365 DAYS (BEST VALUE)
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        
        {/* Features Comparison Side */}
        <div className={`border rounded-3xl p-6 space-y-5 ${
          isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900/60 border-white/10'
        }`}>
          <h3 className="text-sm font-bold uppercase tracking-widest text-amber-500">{t.premiumFeaturesTitle || "Premium Benefits"}</h3>
          
          <div className="space-y-3 text-xs leading-relaxed font-sans">
            {[
              t.pFeat1 || "✅ Unlimited Questions",
              t.pFeat2 || "✅ Unlimited Mock Exams",
              t.pFeat3 || "✅ Full Access to All PDF & Revision Notes",
              t.pFeat4 || "✅ Full High-Quality Video Lessons",
              t.pFeat5 || "✅ Smart AI Study Planner & Analysis",
              t.pFeat6 || "✅ Smart Offline Caching for Study Anywhere",
              t.pFeat7 || "✅ Performance & Progress Reports",
              t.pFeat8 || "✅ Priority Student Support"
            ].map((f, i) => (
              <p key={i} className={isLight ? 'text-slate-700' : 'text-slate-200'}>{f}</p>
            ))}
          </div>
        </div>

        {/* Step-by-Step Payment Side */}
        <div className={`border rounded-3xl p-6 space-y-5 ${
          isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900/60 border-white/10'
        }`}>
          <h3 className="text-sm font-bold uppercase tracking-widest text-blue-500">Step 1: Choose Payment Method</h3>

          {/* Select Bank */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-400 uppercase">Choose Payment Method</label>
            <select
              id="premium-bank-select"
              value={selectedBank}
              onChange={(e) => setSelectedBank(e.target.value)}
              className={`w-full border rounded-xl py-3 px-4 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                isLight ? 'bg-slate-50 border-slate-200 text-slate-800' : 'bg-slate-800/80 border-white/10 text-slate-200'
              }`}
            >
              <option value="">-- Choose Payment Method --</option>
              {banks.map((b) => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
          </div>

          {/* Account transfer card details */}
          {activeBank && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 border rounded-2xl space-y-3 text-xs ${
                isLight ? 'bg-blue-50/50 border-blue-200 text-slate-700' : 'bg-blue-500/5 border-blue-500/15 text-slate-200'
              }`}
            >
              <div className={`flex justify-between items-center pb-2 border-b ${isLight ? 'border-slate-200' : 'border-white/5'}`}>
                <span className="font-bold text-blue-500">Transfer Instructions</span>
                <button
                  id="bank-copy-acc-btn"
                  onClick={handleCopyAccount}
                  className={`p-1.5 rounded-lg flex items-center gap-1 cursor-pointer ${
                    isLight ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' : 'bg-blue-500/10 hover:bg-blue-500/20 text-blue-300'
                  }`}
                >
                  <Copy className="w-3 h-3" />
                  <span className="text-[9px] font-bold">{copySuccess ? (t.copied || "Copied") : (t.copy || "Copy")}</span>
                </button>
              </div>

              <div className="space-y-1 text-xs font-sans">
                <p>Bank: <span className={`font-bold ${isLight ? 'text-slate-800' : 'text-white'}`}>{activeBank.name}</span></p>
                <p>{t.accNumber || "Account Number"}: <span className={`font-bold font-mono tracking-wider px-2 py-0.5 rounded ${isLight ? 'bg-slate-100 text-slate-800' : 'bg-slate-950/40 text-white'}`}>{activeBank.acc}</span></p>
                <p>{t.accName || "Account Name"}: <span className={`font-bold ${isLight ? 'text-slate-800' : 'text-white'}`}>{activeBank.holder}</span></p>
                <p>{t.amountToPay || "Amount to Pay"}: <span className="font-black text-emerald-500">{yearlyPrice} ETB</span></p>
              </div>
            </motion.div>
          )}

          {/* Verification section */}
          {selectedBank && (
            <form onSubmit={handleSubmit} className={`space-y-4 pt-3 border-t ${isLight ? 'border-slate-100' : 'border-white/5'}`}>
              <h3 className="text-sm font-bold uppercase tracking-widest text-blue-500">Step 2: Payment Verification</h3>

              {/* Transaction ID */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">{t.transactionId || "Transaction ID"}</label>
                <input
                  id="pay-tx-id"
                  type="text"
                  required
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  placeholder="e.g. FT2340798216"
                  className={`w-full border focus:border-blue-500/80 rounded-xl py-2.5 px-3.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500/30 transition duration-200 ${
                    isLight ? 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400' : 'bg-slate-800/50 border-white/5 text-white placeholder-slate-500'
                  }`}
                />
              </div>

              {/* Receipt File upload */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">{t.uploadReceipt || "Upload Payment Receipt"}</label>
                
                <div
                  id="pay-drag-drop"
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`border border-dashed rounded-2xl p-4 text-center cursor-pointer transition ${
                    dragOver 
                      ? 'border-blue-400 bg-blue-500/5' 
                      : (isLight ? 'border-slate-200 hover:border-slate-300 bg-slate-50' : 'border-white/10 hover:border-white/20 bg-slate-800/30')
                  }`}
                  onClick={() => document.getElementById('pay-receipt-picker')?.click()}
                >
                  <input
                    id="pay-receipt-picker"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />

                  {receiptFile ? (
                    <div className="flex items-center justify-center gap-2 text-xs">
                      <FileCheck className="w-5 h-5 text-emerald-500" />
                      <div className="text-left">
                        <span className={`font-bold block truncate max-w-[180px] ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>{receiptFile.name}</span>
                        <span className="text-[10px] text-slate-400">{(receiptFile.size / 1024).toFixed(1)} KB</span>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1.5 text-slate-400">
                      <Upload className="w-6 h-6 mx-auto text-blue-500" />
                      <p className="text-[11px] font-sans leading-relaxed">
                        {t.dragDropReceipt || "Drag & drop receipt photo, or click to browse"}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <button
                id="pay-submit-btn"
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl cursor-pointer active:scale-95 transition"
              >
                {t.submitVerification || "Submit Payment Verification"}
              </button>

            </form>
          )}

        </div>

      </div>

    </div>
  );
}

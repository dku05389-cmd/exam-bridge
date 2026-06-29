/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { translations } from './translations';
import { User, LanguageType, AppTheme, Bookmark, PaymentRequest, AppState } from './types';
import Onboarding from './components/Onboarding';
import Auth from './components/Auth';
import StreamSelection from './components/StreamSelection';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import BottomNavigation from './components/BottomNavigation';
import Dashboard from './components/Dashboard';
import QuickAccess from './components/QuickAccess';
import PracticeMode from './components/PracticeMode';
import MockExam from './components/MockExam';
import AnalyticsView from './components/AnalyticsView';
import NotesView from './components/NotesView';
import VideosView from './components/VideosView';
import LeaderboardView from './components/LeaderboardView';
import PremiumView from './components/PremiumView';
import ProfileView from './components/ProfileView';
import SettingsView from './components/SettingsView';
import FAQView from './components/FAQView';
import AdminPanel from './components/AdminPanel';
import OfflineView from './components/OfflineView';
import UeeExamView from './components/UeeExamView';
import AIAssistant from './components/AIAssistant';
import { useScreenProtection } from './hooks/useScreenProtection';
import ScreenProtectionOverlay from './components/ScreenProtectionOverlay';
import { syncService, SyncStatus } from './lib/SyncService';

export default function App() {
  const { isProtected, screenshotAttempted } = useScreenProtection({
    enableBlurOnBlur: true,
    enableBlurOnHide: true,
    blockContextMenu: true,
    blockPrint: true,
  });

  // Navigation & Lifecycle states
  const [appState, setAppState] = useState<AppState>(() => {
    const savedUserStr = localStorage.getItem('eb_active_user');
    if (savedUserStr) {
      try {
        const parsedUser = JSON.parse(savedUserStr);
        if (parsedUser.stream) {
          return 'dashboard';
        }
        return 'stream';
      } catch (e) {
        return 'onboarding';
      }
    }
    return 'onboarding';
  });
  const [currentView, setCurrentView] = useState<string>('home');
  const [viewData, setViewData] = useState<any>(null);

  // App settings state
  const [language, setLanguage] = useState<LanguageType>('en');
  const [theme, setTheme] = useState<AppTheme>('dark');
  const [focusMode, setFocusMode] = useState<boolean>(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Core business models
  const [activeUser, setActiveUser] = useState<User | null>(null);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [downloadedNotes, setDownloadedNotes] = useState<string[]>([]);
  const [paymentRequests, setPaymentRequests] = useState<PaymentRequest[]>([]);
  const [isOfflineSimulated, setIsOfflineSimulated] = useState<boolean>(false);
  
  // Connectivity & Sync states
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>(() => syncService.getStatus());

  // 1. Initial State Hydration from LocalStorage
  useEffect(() => {
    // Connectivity listeners
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Sync status listener (polling for simulation)
    const syncInterval = setInterval(() => {
      setSyncStatus(syncService.getStatus());
    }, 1000);

    // Language Preference
    const savedLang = localStorage.getItem('eb_lang') as LanguageType;
    if (savedLang) {
      setLanguage(savedLang);
    }

    // Appearance Theme
    const savedTheme = localStorage.getItem('eb_theme') as AppTheme;
    if (savedTheme) {
      setTheme(savedTheme);
      applyThemeClass(savedTheme);
    } else {
      applyThemeClass('dark');
    }

    // Focus Mode
    const savedFocus = localStorage.getItem('eb_focus_mode');
    if (savedFocus === 'true') {
      setFocusMode(true);
    }

    // Active Student Session
    const savedUserStr = localStorage.getItem('eb_active_user');
    if (savedUserStr) {
      try {
        const parsedUser = JSON.parse(savedUserStr);
        // Downgrade to free if it was premium
        if (parsedUser.isPremium) {
          parsedUser.isPremium = false;
          parsedUser.premiumStatus = 'free';
          parsedUser.premiumJoinedDate = null;
          localStorage.setItem('eb_active_user', JSON.stringify(parsedUser));
        }
        // Load user session
        setActiveUser(parsedUser);
        
        // Target state is already resolved in initial state, but we ensure hydration here
        if (parsedUser.stream) {
          setAppState('dashboard');
        } else {
          setAppState('stream');
        }
      } catch (e) {
        console.error("Hydration parse error:", e);
      }
    }

    // Hydrate Bookmarks
    const savedBookmarks = localStorage.getItem('eb_bookmarks');
    if (savedBookmarks) {
      setBookmarks(JSON.parse(savedBookmarks));
    }

    // Hydrate Offline Cached notes
    const savedCachedNotes = localStorage.getItem('eb_cached_notes');
    if (savedCachedNotes) {
      setDownloadedNotes(JSON.parse(savedCachedNotes));
    }

    // Hydrate Payment requests queue
    const savedPayments = localStorage.getItem('eb_payments');
    if (savedPayments) {
      setPaymentRequests(JSON.parse(savedPayments));
    } else {
      // Seed initial mock payment request for CBE if empty
      const initialMock: PaymentRequest = {
        id: "mock-pay-1",
        studentId: "EB-2026-88741",
        studentName: "Dagmawi Abebe",
        amount: 1500,
        bankName: "Commercial Bank of Ethiopia (CBE)",
        transactionId: "CBE-98104571",
        receiptName: "receipt_0625.png",
        receiptUrl: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=",
        status: 'pending',
        submittedAt: new Date().toLocaleDateString()
      };
      setPaymentRequests([initialMock]);
      localStorage.setItem('eb_payments', JSON.stringify([initialMock]));
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(syncInterval);
    };
  }, []);

  const applyThemeClass = (t: AppTheme) => {
    const root = window.document.documentElement;
    const isDark = t === 'dark';
    
    if (isDark) {
      root.classList.add('dark');
      root.style.backgroundColor = '#0A1945';
    } else {
      root.classList.remove('dark');
      root.style.backgroundColor = '#F1F5F9'; 
    }
  };

  const handleSetTheme = (newTheme: AppTheme) => {
    setTheme(newTheme);
    localStorage.setItem('eb_theme', newTheme);
    applyThemeClass(newTheme);
  };

  const handleChangeLanguage = (lang: LanguageType) => {
    setLanguage(lang);
    localStorage.setItem('eb_lang', lang);
  };

  const handleToggleFocusMode = () => {
    setFocusMode((prev) => {
      const next = !prev;
      localStorage.setItem('eb_focus_mode', String(next));
      return next;
    });
  };

  // 2. Authentication handlers
  const handleAuthCompleted = (user: User) => {
    setActiveUser(user);
    localStorage.setItem('eb_active_user', JSON.stringify(user));

    if (user.stream) {
      setAppState('dashboard');
    } else {
      setAppState('stream');
    }
  };

  const handleStreamSelected = (stream: 'Natural Science' | 'Social Science') => {
    if (!activeUser) return;
    const updated = {
      ...activeUser,
      stream: stream
    };
    setActiveUser(updated);
    localStorage.setItem('eb_active_user', JSON.stringify(updated));
    setAppState('dashboard');
    setCurrentView('home');
  };

  // 3. Learning interactions handlers
  const handleAddPoints = (pointsGained: number) => {
    if (!activeUser) return;
    const updated = {
      ...activeUser,
      points: activeUser.points + pointsGained
    };
    setActiveUser(updated);
    localStorage.setItem('eb_active_user', JSON.stringify(updated));
  };

  const handleToggleBookmark = (qId: string, subject: string) => {
    setBookmarks((prev) => {
      let next;
      const index = prev.findIndex((b) => b.questionId === qId);
      if (index > -1) {
        next = prev.filter((_, idx) => idx !== index);
      } else {
        const newBookmark: Bookmark = {
          questionId: qId,
          subject: subject
        };
        next = [...prev, newBookmark];
      }
      localStorage.setItem('eb_bookmarks', JSON.stringify(next));
      return next;
    });
  };

  const handleDownloadNote = (noteId: string) => {
    setDownloadedNotes((prev) => {
      if (prev.includes(noteId)) return prev;
      const next = [...prev, noteId];
      localStorage.setItem('eb_cached_notes', JSON.stringify(next));
      return next;
    });
  };

  const handleDeleteNote = (noteId: string) => {
    setDownloadedNotes((prev) => {
      const next = prev.filter((id) => id !== noteId);
      localStorage.setItem('eb_cached_notes', JSON.stringify(next));
      return next;
    });
  };

  const handleUpdateUser = (updatedUser: User) => {
    setActiveUser(updatedUser);
    localStorage.setItem('eb_active_user', JSON.stringify(updatedUser));
  };

  // 4. Payment processing handles
  const handleSubmitPayment = (paymentDetails: Omit<PaymentRequest, 'id' | 'studentId' | 'studentName' | 'status' | 'submittedAt'>) => {
    if (!activeUser) return;

    const newRequest: PaymentRequest = {
      id: `pay-${Date.now()}`,
      studentId: activeUser.id,
      studentName: activeUser.name,
      amount: paymentDetails.amount,
      bankName: paymentDetails.bankName,
      transactionId: paymentDetails.transactionId,
      receiptName: paymentDetails.receiptName,
      receiptUrl: paymentDetails.receiptUrl,
      status: 'pending',
      submittedAt: new Date().toLocaleDateString()
    };

    const updatedRequests = [newRequest, ...paymentRequests];
    setPaymentRequests(updatedRequests);
    localStorage.setItem('eb_payments', JSON.stringify(updatedRequests));
  };

  // 5. Admin Panel reviewing approvals handles
  const handleApprovePayment = (requestId: string) => {
    const updated = paymentRequests.map((req) => {
      if (req.id === requestId) {
        return { ...req, status: 'approved' as const };
      }
      return req;
    });
    setPaymentRequests(updated);
    localStorage.setItem('eb_payments', JSON.stringify(updated));

    // Grant premium access to the targeted student
    const targetedRequest = paymentRequests.find((r) => r.id === requestId);
    if (targetedRequest) {
      // If the approved request is for the current student, update activeUser state instantly!
      if (activeUser && activeUser.id === targetedRequest.studentId) {
        const updatedUser = {
          ...activeUser,
          isPremium: true,
          premiumJoinedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        };
        setActiveUser(updatedUser);
        localStorage.setItem('eb_active_user', JSON.stringify(updatedUser));
      } else {
        // If it was another student, register in simulation records
        const cachedUsers = JSON.parse(localStorage.getItem('eb_simulated_users') || '[]');
        const updatedCached = cachedUsers.map((u: any) => {
          if (u.id === targetedRequest.studentId) {
            return { ...u, isPremium: true, premiumJoinedDate: new Date().toLocaleDateString() };
          }
          return u;
        });
        localStorage.setItem('eb_simulated_users', JSON.stringify(updatedCached));
      }
    }
  };

  const handleDeclinePayment = (requestId: string) => {
    const updated = paymentRequests.filter((req) => req.id !== requestId);
    setPaymentRequests(updated);
    localStorage.setItem('eb_payments', JSON.stringify(updated));
  };

  const handleBulkAddQuestions = (newQuestions: any[]) => {
    // Merge new questions into local database storage
    const customQuestions = JSON.parse(localStorage.getItem('eb_custom_questions') || '[]');
    const updatedQuestions = [...customQuestions, ...newQuestions];
    localStorage.setItem('eb_custom_questions', JSON.stringify(updatedQuestions));
  };

  const handleDownloadData = async () => {
    if (!isOnline) return;

    syncService.updateStatus({ isDownloading: true, progress: 0 });
    
    // Simulate multi-step download
    for (let i = 1; i <= 5; i++) {
      await new Promise(resolve => setTimeout(resolve, 800));
      syncService.updateStatus({ progress: i * 20 });
    }

    const mockSyncData = {
      timestamp: new Date().toISOString(),
      exams: [],
      notes: [],
      version: "1.0.4"
    };

    await syncService.saveOfflineData(mockSyncData);
    setSyncStatus(syncService.getStatus());
  };

  const handleLogout = () => {
    if (confirm("Are you sure you want to log out of your student profile?")) {
      syncService.clearAllData();
      setActiveUser(null);
      setAppState('auth');
    }
  };

  // Find if current user has a pending verification request
  const userPendingRequest = activeUser
    ? paymentRequests.find((r) => r.studentId === activeUser.id && r.status === 'pending') || null
    : null;

  // View router controller mapping
  const renderViewContent = () => {
    if (!activeUser) return null;

    switch (currentView) {
      case 'home':
        return (
          <QuickAccess
            language={language}
            theme={theme}
            onNavigate={(view, data) => {
              setCurrentView(view);
              if (data) setViewData(data);
            }}
          />
        );
      case 'offline':
        return (
          <OfflineView
            user={activeUser}
            language={language}
            theme={theme}
            onNavigate={setCurrentView}
            isOfflineSimulated={isOfflineSimulated}
            onToggleOfflineSimulated={setIsOfflineSimulated}
          />
        );
      case 'practice':
        return (
          <PracticeMode
            user={activeUser}
            language={language}
            theme={theme}
            initialSubject={viewData?.subject}
            bookmarks={bookmarks}
            isOnline={isOnline}
            onToggleBookmark={handleToggleBookmark}
            onAddPoints={handleAddPoints}
            onBackToDashboard={() => {
              setCurrentView('home');
              setViewData(null);
            }}
          />
        );
      case 'uee':
        return <UeeExamView user={activeUser} language={language} theme={theme} isOnline={isOnline} onNavigate={setCurrentView} />;
      case 'ai':
        return <AIAssistant theme={theme} user={activeUser} onNavigate={setCurrentView} />;
      case 'notes':
        return (
          <NotesView
            user={activeUser}
            language={language}
            theme={theme}
            onNavigate={setCurrentView}
            downloadedNotes={downloadedNotes}
            onDownloadNote={handleDownloadNote}
            onDeleteNote={handleDeleteNote}
            isOnline={isOnline}
          />
        );
      case 'videos':
        return (
          <VideosView
            user={activeUser}
            language={language}
            theme={theme}
            onNavigate={setCurrentView}
          />
        );
      case 'analytics':
        return <AnalyticsView user={activeUser} language={language} theme={theme} />;
      case 'profile':
        return (
          <ProfileView
            user={activeUser}
            language={language}
            theme={theme}
            focusMode={focusMode}
            isOnline={isOnline}
            onNavigate={setCurrentView}
            onUpdateUser={handleUpdateUser}
          />
        );
      case 'support':
        return <FAQView theme={theme} language={language} onChangeLanguage={handleChangeLanguage} onNavigate={setCurrentView} />;
      case 'faq':
        return <FAQView theme={theme} language={language} onChangeLanguage={handleChangeLanguage} onNavigate={setCurrentView} />;
      case 'leaderboard':
        return <LeaderboardView user={activeUser} language={language} theme={theme} />;
      case 'premium':
        return (
          <PremiumView
            user={activeUser}
            language={language}
            theme={theme}
            onNavigate={setCurrentView}
            onSubmitPayment={handleSubmitPayment}
            pendingRequest={userPendingRequest}
          />
        );
      case 'settings':
        return (
          <SettingsView
            user={activeUser}
            language={language}
            theme={theme}
            focusMode={focusMode}
            onToggleFocusMode={handleToggleFocusMode}
            onUpdateUser={(updated) => {
              setActiveUser(updated);
              localStorage.setItem('eb_active_user', JSON.stringify(updated));
            }}
            onChangeLanguage={handleChangeLanguage}
            onSetTheme={handleSetTheme}
            onNavigate={setCurrentView}
            onLogout={handleLogout}
          />
        );
      case 'admin':
        return (
          <AdminPanel
            language={language}
            theme={theme}
            paymentRequests={paymentRequests.filter((r) => r.status === 'pending')}
            onApprovePayment={handleApprovePayment}
            onDeclinePayment={handleDeclinePayment}
            onBulkAddQuestions={handleBulkAddQuestions}
          />
        );
      default:
        return (
          <Dashboard
            user={activeUser}
            language={language}
            theme={theme}
            isOfflineSimulated={isOfflineSimulated}
            onNavigate={(view, data) => {
              setCurrentView(view);
              if (data) setViewData(data);
            }}
          />
        );
    }
  };

  // Lifecycle flow templates router
  if (appState === 'onboarding') {
    return (
      <>
        <ScreenProtectionOverlay isProtected={isProtected} screenshotAttempted={screenshotAttempted} user={activeUser} />
        <Onboarding language={language} onDone={() => setAppState('auth')} />
      </>
    );
  }

  if (appState === 'auth') {
    return (
      <>
        <ScreenProtectionOverlay isProtected={isProtected} screenshotAttempted={screenshotAttempted} user={activeUser} />
        <Auth language={language} onAuthSuccess={handleAuthCompleted} />
      </>
    );
  }

  if (appState === 'stream') {
    return (
      <>
        <ScreenProtectionOverlay isProtected={isProtected} screenshotAttempted={screenshotAttempted} user={activeUser} />
        <StreamSelection language={language} onSelect={handleStreamSelected} />
      </>
    );
  }

  // Dashboard Frame Layout
  return (
    <div className={`h-[100dvh] overflow-hidden flex flex-col justify-between select-none relative antialiased ${
      theme === 'light' ? 'bg-[#F1F5F9] text-slate-900' : 'bg-[#0A1945] text-white'
    }`}>
      
      <ScreenProtectionOverlay
        isProtected={isProtected}
        screenshotAttempted={screenshotAttempted}
        user={activeUser}
      />

      {/* Header bar */}
      <Header
        title={currentView}
        theme={theme}
        language={language}
        onSetTheme={handleSetTheme}
        onOpenSidebar={() => setSidebarOpen(true)}
        onNavigate={setCurrentView}
        showBack={currentView === 'faq' || currentView === 'support'}
        onBack={() => setCurrentView('home')}
        isOnline={isOnline}
        syncStatus={syncStatus}
      />

      {/* Main Container screen slots */}
      <main className={`flex-1 w-full mx-auto pt-3 pb-24 relative z-10 overflow-y-auto ${(currentView === 'faq' || currentView === 'support') ? 'px-0 max-w-none' : 'px-1.5 max-w-md'}`}>
        {renderViewContent()}
      </main>

      {/* Navigation bottom deck */}
      {!(currentView === 'faq' || currentView === 'support') && (
        <BottomNavigation
          currentView={currentView}
          language={language}
          theme={theme}
          focusMode={focusMode}
          onNavigate={(view) => {
            setCurrentView(view);
            setViewData(null);
          }}
        />
      )}

      {/* Sidebar Drawer */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        user={activeUser}
        language={language}
        focusMode={focusMode}
        onChangeLanguage={handleChangeLanguage}
        onNavigate={(view) => {
          setCurrentView(view);
          setSidebarOpen(false);
          setViewData(null);
        }}
        onLogout={handleLogout}
      />

    </div>
  );
}

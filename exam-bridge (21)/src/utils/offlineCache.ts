/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Question, Note } from '../types';

const DB_NAME = 'ExamBridge_Offline_Cache';
const DB_VERSION = 1;

export interface CachedSubject {
  name: string;
  cachedAt: string;
  questionsCount: number;
  fileSize: string; // e.g., "1.8 MB"
}

export interface CachedMockExam {
  id: string;
  title: string;
  cachedAt: string;
  questionsCount: number;
  fileSize: string; // e.g., "0.5 MB"
}

export interface CachedNote {
  id: string;
  title: string;
  subject: string;
  cachedAt: string;
  content: string;
  fileSize: string;
}

// Open the IndexedDB database
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      console.error('Failed to open offline cache database.');
      reject(request.error);
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onupgradeneeded = (event) => {
      const db = request.result;
      
      // Create store for cached subjects
      if (!db.objectStoreNames.contains('subjects')) {
        db.createObjectStore('subjects', { keyPath: 'name' });
      }

      // Create store for cached mock exams
      if (!db.objectStoreNames.contains('mock_exams')) {
        db.createObjectStore('mock_exams', { keyPath: 'id' });
      }

      // Create store for cached notes
      if (!db.objectStoreNames.contains('notes')) {
        db.createObjectStore('notes', { keyPath: 'id' });
      }

      // Store cached questions
      if (!db.objectStoreNames.contains('questions')) {
        db.createObjectStore('questions', { keyPath: 'id' });
      }
    };
  });
}

export const offlineCache = {
  // --- SUBJECTS ---
  async cacheSubject(subjectName: string, questions: Question[]): Promise<void> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['subjects', 'questions'], 'readwrite');
      const subjectsStore = transaction.objectStore('subjects');
      const questionsStore = transaction.objectStore('questions');

      const subjectData: CachedSubject = {
        name: subjectName,
        cachedAt: new Date().toLocaleDateString(),
        questionsCount: questions.length,
        fileSize: `${(questions.length * 0.05 + 0.4).toFixed(1)} MB` // simulated file size
      };

      subjectsStore.put(subjectData);

      // Save all questions for offline
      questions.forEach(q => {
        questionsStore.put(q);
      });

      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  },

  async uncacheSubject(subjectName: string): Promise<void> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['subjects'], 'readwrite');
      const store = transaction.objectStore('subjects');
      
      store.delete(subjectName);

      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  },

  async getCachedSubjects(): Promise<CachedSubject[]> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['subjects'], 'readonly');
      const store = transaction.objectStore('subjects');
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  },

  // --- MOCK EXAMS ---
  async cacheMockExam(examId: string, title: string, questions: Question[]): Promise<void> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['mock_exams', 'questions'], 'readwrite');
      const examStore = transaction.objectStore('mock_exams');
      const questionsStore = transaction.objectStore('questions');

      const examData: CachedMockExam = {
        id: examId,
        title,
        cachedAt: new Date().toLocaleDateString(),
        questionsCount: questions.length,
        fileSize: `${(questions.length * 0.05 + 0.2).toFixed(1)} MB`
      };

      examStore.put(examData);

      questions.forEach(q => {
        questionsStore.put(q);
      });

      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  },

  async uncacheMockExam(examId: string): Promise<void> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['mock_exams'], 'readwrite');
      const store = transaction.objectStore('mock_exams');
      
      store.delete(examId);

      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  },

  async getCachedMockExams(): Promise<CachedMockExam[]> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['mock_exams'], 'readonly');
      const store = transaction.objectStore('mock_exams');
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  },

  // --- NOTES ---
  async cacheNote(note: Note): Promise<void> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['notes'], 'readwrite');
      const store = transaction.objectStore('notes');

      const noteData: CachedNote = {
        id: note.id,
        title: note.title,
        subject: note.subject,
        cachedAt: new Date().toLocaleDateString(),
        content: note.content,
        fileSize: note.fileSize
      };

      store.put(noteData);

      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  },

  async uncacheNote(noteId: string): Promise<void> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['notes'], 'readwrite');
      const store = transaction.objectStore('notes');
      
      store.delete(noteId);

      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  },

  async getCachedNotes(): Promise<CachedNote[]> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['notes'], 'readonly');
      const store = transaction.objectStore('notes');
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  },

  // --- QUESTIONS RETRIEVAL ---
  async getOfflineQuestionsBySubject(subjectName: string): Promise<Question[]> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['questions'], 'readonly');
      const store = transaction.objectStore('questions');
      const request = store.getAll();

      request.onsuccess = () => {
        const allQuestions: Question[] = request.result || [];
        resolve(allQuestions.filter(q => q.subject.toLowerCase() === subjectName.toLowerCase()));
      };
      request.onerror = () => reject(request.error);
    });
  },

  // --- GENERAL CACHE SPACE CALCULATION ---
  async getCacheUsageBytes(): Promise<number> {
    const db = await openDB();
    return new Promise((resolve) => {
      let totalBytes = 0;
      const stores = ['subjects', 'mock_exams', 'notes', 'questions'];
      const transaction = db.transaction(stores, 'readonly');
      
      let count = 0;
      stores.forEach(storeName => {
        const store = transaction.objectStore(storeName);
        const request = store.getAll();
        request.onsuccess = () => {
          const items = request.result || [];
          totalBytes += JSON.stringify(items).length; // simple approximation
          count++;
          if (count === stores.length) {
            resolve(totalBytes);
          }
        };
      });
    });
  },

  async clearAllCache(): Promise<void> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const stores = ['subjects', 'mock_exams', 'notes', 'questions'];
      const transaction = db.transaction(stores, 'readwrite');
      
      stores.forEach(storeName => {
        transaction.objectStore(storeName).clear();
      });

      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  }
};

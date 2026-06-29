/**
 * SyncService.ts
 * Handles data synchronization and offline storage
 */

export interface SyncStatus {
  lastSynced: string | null;
  isDownloading: boolean;
  progress: number;
}

class SyncService {
  private STORAGE_KEY = 'eb_sync_data';
  private STATUS_KEY = 'eb_sync_status';

  /**
   * Save downloaded data to local storage
   */
  async saveOfflineData(data: any): Promise<void> {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    this.updateStatus({ lastSynced: new Date().toISOString(), isDownloading: false, progress: 100 });
  }

  /**
   * Get offline data
   */
  getOfflineData(): any {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  }

  /**
   * Update sync status
   */
  updateStatus(status: Partial<SyncStatus>): void {
    const current = this.getStatus();
    localStorage.setItem(this.STATUS_KEY, JSON.stringify({ ...current, ...status }));
  }

  /**
   * Get sync status
   */
  getStatus(): SyncStatus {
    const status = localStorage.getItem(this.STATUS_KEY);
    return status ? JSON.parse(status) : { lastSynced: null, isDownloading: false, progress: 0 };
  }

  /**
   * Clear all local data (on logout)
   */
  clearAllData(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    localStorage.removeItem(this.STATUS_KEY);
    localStorage.removeItem('eb_active_user');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('eb_downloaded_subjects');
    localStorage.removeItem('eb_downloaded_notes');
    localStorage.removeItem('eb_practice_history');
  }
}

export const syncService = new SyncService();

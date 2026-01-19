'use client';

import { useState, useEffect, useCallback } from 'react';

const DB_NAME = 'OptiForge-Offline';
const DB_VERSION = 1;

interface CachedItem<T> {
  key: string;
  data: T;
  timestamp: number;
  expiresAt?: number;
}

interface PendingAction {
  id?: number;
  url: string;
  method: string;
  headers: Record<string, string>;
  body: any;
  timestamp: number;
}

/**
 * Hook for managing offline data storage using IndexedDB
 */
export function useOfflineStorage<T = any>(storeName: string = 'cachedData') {
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [db, setDb] = useState<IDBDatabase | null>(null);
  const [isReady, setIsReady] = useState(false);

  // Initialize IndexedDB
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      console.error('[OfflineStorage] Failed to open database');
    };

    request.onsuccess = () => {
      setDb(request.result);
      setIsReady(true);
    };

    request.onupgradeneeded = (event) => {
      const database = (event.target as IDBOpenDBRequest).result;

      // Store for cached data
      if (!database.objectStoreNames.contains('cachedData')) {
        const store = database.createObjectStore('cachedData', { keyPath: 'key' });
        store.createIndex('timestamp', 'timestamp');
        store.createIndex('expiresAt', 'expiresAt');
      }

      // Store for pending actions (offline mutations)
      if (!database.objectStoreNames.contains('pendingActions')) {
        database.createObjectStore('pendingActions', { keyPath: 'id', autoIncrement: true });
      }

      // Store for offline form drafts
      if (!database.objectStoreNames.contains('formDrafts')) {
        const draftsStore = database.createObjectStore('formDrafts', { keyPath: 'formId' });
        draftsStore.createIndex('timestamp', 'timestamp');
      }
    };

    return () => {
      if (db) {
        db.close();
      }
    };
  }, []);

  // Track online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Get item from cache
  const getItem = useCallback(async (key: string): Promise<T | null> => {
    if (!db) return null;

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.get(key);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const result = request.result as CachedItem<T> | undefined;

        if (!result) {
          resolve(null);
          return;
        }

        // Check expiration
        if (result.expiresAt && Date.now() > result.expiresAt) {
          // Delete expired item
          deleteItem(key);
          resolve(null);
          return;
        }

        resolve(result.data);
      };
    });
  }, [db, storeName]);

  // Set item in cache
  const setItem = useCallback(async (key: string, data: T, ttlMs?: number): Promise<void> => {
    if (!db) return;

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);

      const item: CachedItem<T> = {
        key,
        data,
        timestamp: Date.now(),
        expiresAt: ttlMs ? Date.now() + ttlMs : undefined,
      };

      const request = store.put(item);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }, [db, storeName]);

  // Delete item from cache
  const deleteItem = useCallback(async (key: string): Promise<void> => {
    if (!db) return;

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.delete(key);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }, [db, storeName]);

  // Get all items from cache
  const getAllItems = useCallback(async (): Promise<T[]> => {
    if (!db) return [];

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.getAll();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const items = (request.result as CachedItem<T>[])
          .filter(item => !item.expiresAt || Date.now() <= item.expiresAt)
          .map(item => item.data);
        resolve(items);
      };
    });
  }, [db, storeName]);

  // Clear all items in store
  const clearStore = useCallback(async (): Promise<void> => {
    if (!db) return;

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.clear();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }, [db, storeName]);

  // Queue action for later sync
  const queueAction = useCallback(async (action: Omit<PendingAction, 'id' | 'timestamp'>): Promise<void> => {
    if (!db) return;

    return new Promise((resolve, reject) => {
      const transaction = db.transaction('pendingActions', 'readwrite');
      const store = transaction.objectStore('pendingActions');

      const pendingAction: Omit<PendingAction, 'id'> = {
        ...action,
        timestamp: Date.now(),
      };

      const request = store.add(pendingAction);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        // Trigger background sync if available
        if ('serviceWorker' in navigator && 'sync' in registration) {
          navigator.serviceWorker.ready.then((reg) => {
            (reg as any).sync?.register('sync-offline-actions');
          });
        }
        resolve();
      };
    });
  }, [db]);

  // Get pending actions
  const getPendingActions = useCallback(async (): Promise<PendingAction[]> => {
    if (!db) return [];

    return new Promise((resolve, reject) => {
      const transaction = db.transaction('pendingActions', 'readonly');
      const store = transaction.objectStore('pendingActions');
      const request = store.getAll();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }, [db]);

  return {
    isOnline,
    isReady,
    getItem,
    setItem,
    deleteItem,
    getAllItems,
    clearStore,
    queueAction,
    getPendingActions,
  };
}

/**
 * Hook for managing form drafts offline
 */
export function useFormDraft<T = any>(formId: string) {
  const { isReady, getItem, setItem, deleteItem } = useOfflineStorage<T>('formDrafts');
  const [draft, setDraft] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load draft on mount
  useEffect(() => {
    if (isReady) {
      getItem(formId).then((data) => {
        setDraft(data);
        setIsLoading(false);
      });
    }
  }, [isReady, formId, getItem]);

  // Save draft
  const saveDraft = useCallback(async (data: T) => {
    await setItem(formId, data);
    setDraft(data);
  }, [formId, setItem]);

  // Clear draft
  const clearDraft = useCallback(async () => {
    await deleteItem(formId);
    setDraft(null);
  }, [formId, deleteItem]);

  return {
    draft,
    isLoading,
    saveDraft,
    clearDraft,
  };
}

/**
 * Hook for fetching data with offline fallback
 */
export function useOfflineQuery<T>(
  key: string,
  fetchFn: () => Promise<T>,
  options?: {
    ttlMs?: number;
    staleWhileRevalidate?: boolean;
  }
) {
  const { isOnline, isReady, getItem, setItem } = useOfflineStorage<T>();
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isStale, setIsStale] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      // Try cache first
      if (isReady) {
        const cached = await getItem(key);
        if (cached) {
          setData(cached);
          setIsStale(true);
          if (!options?.staleWhileRevalidate && !isOnline) {
            setIsLoading(false);
            return;
          }
        }
      }

      // Fetch fresh data if online
      if (isOnline) {
        setIsLoading(true);
        const freshData = await fetchFn();
        setData(freshData);
        setIsStale(false);
        setError(null);

        // Cache the result
        if (isReady) {
          await setItem(key, freshData, options?.ttlMs);
        }
      } else if (!data) {
        setError(new Error('No cached data available'));
      }
    } catch (err) {
      setError(err as Error);

      // Try cache on error
      if (isReady) {
        const cached = await getItem(key);
        if (cached) {
          setData(cached);
          setIsStale(true);
        }
      }
    } finally {
      setIsLoading(false);
    }
  }, [key, fetchFn, isOnline, isReady, getItem, setItem, options]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(() => {
    return fetchData();
  }, [fetchData]);

  return {
    data,
    isLoading,
    error,
    isStale,
    isOnline,
    refetch,
  };
}

export default useOfflineStorage;

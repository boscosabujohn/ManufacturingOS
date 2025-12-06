'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  ReactNode,
} from 'react';
import {
  Wifi,
  WifiOff,
  RefreshCw,
  Cloud,
  CloudOff,
  CheckCircle,
  AlertCircle,
  Clock,
  Database,
  Trash2,
  Download,
  Upload,
} from 'lucide-react';

// Types
export interface CachedItem<T = unknown> {
  key: string;
  data: T;
  timestamp: number;
  expiresAt?: number;
  version?: number;
}

export interface PendingAction {
  id: string;
  type: 'create' | 'update' | 'delete';
  endpoint: string;
  method: 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  payload?: unknown;
  timestamp: number;
  retries: number;
}

export interface SyncStatus {
  lastSync: Date | null;
  isSyncing: boolean;
  pendingCount: number;
  error: string | null;
}

export interface OfflineContextValue {
  isOnline: boolean;
  isOfflineMode: boolean;
  syncStatus: SyncStatus;
  cachedData: Map<string, CachedItem>;
  pendingActions: PendingAction[];
  // Cache operations
  cacheData: <T>(key: string, data: T, ttlMs?: number) => void;
  getCachedData: <T>(key: string) => T | null;
  removeCachedData: (key: string) => void;
  clearCache: () => void;
  // Offline actions
  queueAction: (action: Omit<PendingAction, 'id' | 'timestamp' | 'retries'>) => void;
  syncPendingActions: () => Promise<void>;
  clearPendingActions: () => void;
  // Settings
  enableOfflineMode: () => void;
  disableOfflineMode: () => void;
}

const OfflineContext = createContext<OfflineContextValue | null>(null);

// Storage keys
const CACHE_STORAGE_KEY = 'offline_cache';
const PENDING_ACTIONS_KEY = 'offline_pending_actions';
const LAST_SYNC_KEY = 'offline_last_sync';

// Default TTL: 24 hours
const DEFAULT_TTL = 24 * 60 * 60 * 1000;

// Provider component
interface OfflineProviderProps {
  children: ReactNode;
  onSync?: (actions: PendingAction[]) => Promise<void>;
  autoSync?: boolean;
  syncInterval?: number;
}

export function OfflineProvider({
  children,
  onSync,
  autoSync = true,
  syncInterval = 30000,
}: OfflineProviderProps) {
  const [isOnline, setIsOnline] = useState(true);
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const [cachedData, setCachedData] = useState<Map<string, CachedItem>>(new Map());
  const [pendingActions, setPendingActions] = useState<PendingAction[]>([]);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    lastSync: null,
    isSyncing: false,
    pendingCount: 0,
    error: null,
  });

  // Initialize from storage
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Load cached data
    try {
      const stored = localStorage.getItem(CACHE_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        const map = new Map<string, CachedItem>();
        const now = Date.now();

        // Filter out expired items
        Object.entries(parsed).forEach(([key, item]) => {
          const cachedItem = item as CachedItem;
          if (!cachedItem.expiresAt || cachedItem.expiresAt > now) {
            map.set(key, cachedItem);
          }
        });

        setCachedData(map);
      }
    } catch (e) {
      console.error('Failed to load cache:', e);
    }

    // Load pending actions
    try {
      const stored = localStorage.getItem(PENDING_ACTIONS_KEY);
      if (stored) {
        setPendingActions(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load pending actions:', e);
    }

    // Load last sync time
    try {
      const stored = localStorage.getItem(LAST_SYNC_KEY);
      if (stored) {
        setSyncStatus(prev => ({
          ...prev,
          lastSync: new Date(parseInt(stored)),
        }));
      }
    } catch (e) {
      console.error('Failed to load last sync:', e);
    }

    // Check online status
    setIsOnline(navigator.onLine);
  }, []);

  // Online/offline listeners
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleOnline = () => {
      setIsOnline(true);
      // Auto-sync when coming back online
      if (autoSync && pendingActions.length > 0) {
        syncPendingActions();
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [autoSync, pendingActions.length]);

  // Update pending count in sync status
  useEffect(() => {
    setSyncStatus(prev => ({
      ...prev,
      pendingCount: pendingActions.length,
    }));
  }, [pendingActions.length]);

  // Persist cache to storage
  const persistCache = useCallback((data: Map<string, CachedItem>) => {
    try {
      const obj: Record<string, CachedItem> = {};
      data.forEach((value, key) => {
        obj[key] = value;
      });
      localStorage.setItem(CACHE_STORAGE_KEY, JSON.stringify(obj));
    } catch (e) {
      console.error('Failed to persist cache:', e);
    }
  }, []);

  // Persist pending actions
  const persistPendingActions = useCallback((actions: PendingAction[]) => {
    try {
      localStorage.setItem(PENDING_ACTIONS_KEY, JSON.stringify(actions));
    } catch (e) {
      console.error('Failed to persist pending actions:', e);
    }
  }, []);

  // Cache data
  const cacheData = useCallback(<T,>(key: string, data: T, ttlMs: number = DEFAULT_TTL) => {
    const item: CachedItem<T> = {
      key,
      data,
      timestamp: Date.now(),
      expiresAt: Date.now() + ttlMs,
    };

    setCachedData(prev => {
      const next = new Map(prev);
      next.set(key, item as CachedItem);
      persistCache(next);
      return next;
    });
  }, [persistCache]);

  // Get cached data
  const getCachedData = useCallback(<T,>(key: string): T | null => {
    const item = cachedData.get(key);
    if (!item) return null;

    // Check expiration
    if (item.expiresAt && item.expiresAt < Date.now()) {
      // Remove expired item
      setCachedData(prev => {
        const next = new Map(prev);
        next.delete(key);
        persistCache(next);
        return next;
      });
      return null;
    }

    return item.data as T;
  }, [cachedData, persistCache]);

  // Remove cached data
  const removeCachedData = useCallback((key: string) => {
    setCachedData(prev => {
      const next = new Map(prev);
      next.delete(key);
      persistCache(next);
      return next;
    });
  }, [persistCache]);

  // Clear all cache
  const clearCache = useCallback(() => {
    setCachedData(new Map());
    localStorage.removeItem(CACHE_STORAGE_KEY);
  }, []);

  // Queue an action for offline sync
  const queueAction = useCallback((
    action: Omit<PendingAction, 'id' | 'timestamp' | 'retries'>
  ) => {
    const newAction: PendingAction = {
      ...action,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      retries: 0,
    };

    setPendingActions(prev => {
      const next = [...prev, newAction];
      persistPendingActions(next);
      return next;
    });
  }, [persistPendingActions]);

  // Sync pending actions
  const syncPendingActions = useCallback(async () => {
    if (!isOnline || pendingActions.length === 0) return;

    setSyncStatus(prev => ({ ...prev, isSyncing: true, error: null }));

    try {
      if (onSync) {
        await onSync(pendingActions);
      } else {
        // Default sync: attempt to send each action
        for (const action of pendingActions) {
          try {
            await fetch(action.endpoint, {
              method: action.method,
              headers: { 'Content-Type': 'application/json' },
              body: action.payload ? JSON.stringify(action.payload) : undefined,
            });
          } catch (e) {
            console.error(`Failed to sync action ${action.id}:`, e);
            throw e;
          }
        }
      }

      // Clear pending actions on success
      setPendingActions([]);
      localStorage.removeItem(PENDING_ACTIONS_KEY);

      // Update last sync time
      const now = Date.now();
      localStorage.setItem(LAST_SYNC_KEY, now.toString());
      setSyncStatus(prev => ({
        ...prev,
        lastSync: new Date(now),
        isSyncing: false,
        pendingCount: 0,
      }));
    } catch (e) {
      setSyncStatus(prev => ({
        ...prev,
        isSyncing: false,
        error: e instanceof Error ? e.message : 'Sync failed',
      }));
    }
  }, [isOnline, pendingActions, onSync]);

  // Clear pending actions
  const clearPendingActions = useCallback(() => {
    setPendingActions([]);
    localStorage.removeItem(PENDING_ACTIONS_KEY);
  }, []);

  // Enable/disable offline mode
  const enableOfflineMode = useCallback(() => setIsOfflineMode(true), []);
  const disableOfflineMode = useCallback(() => setIsOfflineMode(false), []);

  // Auto-sync interval
  useEffect(() => {
    if (!autoSync || !isOnline) return;

    const interval = setInterval(() => {
      if (pendingActions.length > 0) {
        syncPendingActions();
      }
    }, syncInterval);

    return () => clearInterval(interval);
  }, [autoSync, isOnline, syncInterval, pendingActions.length, syncPendingActions]);

  const value = useMemo<OfflineContextValue>(() => ({
    isOnline,
    isOfflineMode,
    syncStatus,
    cachedData,
    pendingActions,
    cacheData,
    getCachedData,
    removeCachedData,
    clearCache,
    queueAction,
    syncPendingActions,
    clearPendingActions,
    enableOfflineMode,
    disableOfflineMode,
  }), [
    isOnline,
    isOfflineMode,
    syncStatus,
    cachedData,
    pendingActions,
    cacheData,
    getCachedData,
    removeCachedData,
    clearCache,
    queueAction,
    syncPendingActions,
    clearPendingActions,
    enableOfflineMode,
    disableOfflineMode,
  ]);

  return (
    <OfflineContext.Provider value={value}>
      {children}
    </OfflineContext.Provider>
  );
}

// Hook
export function useOffline() {
  const context = useContext(OfflineContext);
  if (!context) {
    throw new Error('useOffline must be used within an OfflineProvider');
  }
  return context;
}

// Offline Status Indicator
interface OfflineIndicatorProps {
  variant?: 'banner' | 'badge' | 'minimal';
  showSyncButton?: boolean;
  className?: string;
}

export function OfflineIndicator({
  variant = 'banner',
  showSyncButton = true,
  className = '',
}: OfflineIndicatorProps) {
  const { isOnline, syncStatus, syncPendingActions } = useOffline();

  if (variant === 'minimal') {
    return (
      <div className={`flex items-center gap-1 ${className}`}>
        {isOnline ? (
          <Wifi className="w-4 h-4 text-green-500" />
        ) : (
          <WifiOff className="w-4 h-4 text-red-500" />
        )}
      </div>
    );
  }

  if (variant === 'badge') {
    if (isOnline && syncStatus.pendingCount === 0) return null;

    return (
      <div
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm ${
          isOnline
            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200'
            : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200'
        } ${className}`}
      >
        {isOnline ? (
          <>
            <Clock className="w-4 h-4" />
            {syncStatus.pendingCount} pending
          </>
        ) : (
          <>
            <WifiOff className="w-4 h-4" />
            Offline
          </>
        )}
      </div>
    );
  }

  // Banner variant
  if (isOnline && syncStatus.pendingCount === 0) return null;

  return (
    <div
      className={`flex items-center justify-between px-4 py-2 ${
        isOnline
          ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
          : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
      } border-b ${className}`}
    >
      <div className="flex items-center gap-3">
        {isOnline ? (
          <Cloud className="w-5 h-5 text-yellow-600" />
        ) : (
          <CloudOff className="w-5 h-5 text-red-600" />
        )}
        <div>
          <p className={`font-medium ${isOnline ? 'text-yellow-800 dark:text-yellow-200' : 'text-red-800 dark:text-red-200'}`}>
            {isOnline ? 'Sync Pending' : 'You are offline'}
          </p>
          <p className={`text-sm ${isOnline ? 'text-yellow-600 dark:text-yellow-300' : 'text-red-600 dark:text-red-300'}`}>
            {isOnline
              ? `${syncStatus.pendingCount} changes waiting to sync`
              : 'Changes will sync when you reconnect'}
          </p>
        </div>
      </div>

      {showSyncButton && isOnline && syncStatus.pendingCount > 0 && (
        <button
          onClick={() => syncPendingActions()}
          disabled={syncStatus.isSyncing}
          className="flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg text-sm font-medium hover:bg-yellow-700 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${syncStatus.isSyncing ? 'animate-spin' : ''}`} />
          {syncStatus.isSyncing ? 'Syncing...' : 'Sync Now'}
        </button>
      )}
    </div>
  );
}

// Sync Status Panel
interface SyncStatusPanelProps {
  className?: string;
}

export function SyncStatusPanel({ className = '' }: SyncStatusPanelProps) {
  const {
    isOnline,
    syncStatus,
    pendingActions,
    cachedData,
    syncPendingActions,
    clearPendingActions,
    clearCache,
  } = useOffline();

  const cacheSize = useMemo(() => {
    let size = 0;
    cachedData.forEach(item => {
      size += JSON.stringify(item).length;
    });
    return (size / 1024).toFixed(1);
  }, [cachedData]);

  return (
    <div className={`bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900 dark:text-white">Sync Status</h3>
          <div className={`flex items-center gap-2 px-2 py-1 rounded-full text-sm ${
            isOnline
              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
              : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
          }`}>
            {isOnline ? (
              <>
                <Wifi className="w-3 h-3" />
                Online
              </>
            ) : (
              <>
                <WifiOff className="w-3 h-3" />
                Offline
              </>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="p-4 grid grid-cols-2 gap-4 border-b border-gray-200 dark:border-gray-700">
        <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <Database className="w-5 h-5 mx-auto mb-1 text-gray-400" />
          <p className="text-lg font-bold text-gray-900 dark:text-white">{cacheSize} KB</p>
          <p className="text-xs text-gray-500">Cached Data</p>
        </div>
        <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <Upload className="w-5 h-5 mx-auto mb-1 text-gray-400" />
          <p className="text-lg font-bold text-gray-900 dark:text-white">{pendingActions.length}</p>
          <p className="text-xs text-gray-500">Pending Actions</p>
        </div>
      </div>

      {/* Last Sync */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Last Sync</span>
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            {syncStatus.lastSync
              ? syncStatus.lastSync.toLocaleString()
              : 'Never'}
          </span>
        </div>
        {syncStatus.error && (
          <div className="mt-2 flex items-center gap-2 text-sm text-red-600">
            <AlertCircle className="w-4 h-4" />
            {syncStatus.error}
          </div>
        )}
      </div>

      {/* Pending Actions List */}
      {pendingActions.length > 0 && (
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Pending Changes
          </p>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {pendingActions.map(action => (
              <div
                key={action.id}
                className="flex items-center gap-2 text-sm p-2 bg-gray-50 dark:bg-gray-800 rounded"
              >
                <span className={`w-2 h-2 rounded-full ${
                  action.type === 'create' ? 'bg-green-500' :
                  action.type === 'update' ? 'bg-blue-500' :
                  'bg-red-500'
                }`} />
                <span className="flex-1 truncate text-gray-700 dark:text-gray-300">
                  {action.type.toUpperCase()}: {action.endpoint}
                </span>
                <span className="text-xs text-gray-400">
                  {new Date(action.timestamp).toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="p-4 flex gap-2">
        <button
          onClick={() => syncPendingActions()}
          disabled={!isOnline || syncStatus.isSyncing || pendingActions.length === 0}
          className="flex-1 flex items-center justify-center gap-2 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RefreshCw className={`w-4 h-4 ${syncStatus.isSyncing ? 'animate-spin' : ''}`} />
          {syncStatus.isSyncing ? 'Syncing...' : 'Sync Now'}
        </button>
        <button
          onClick={() => {
            if (confirm('Clear all pending actions? This cannot be undone.')) {
              clearPendingActions();
            }
          }}
          disabled={pendingActions.length === 0}
          className="p-2 text-gray-600 hover:text-red-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50"
          title="Clear pending actions"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

// Offline Data Wrapper
interface OfflineDataWrapperProps<T> {
  cacheKey: string;
  fetchData: () => Promise<T>;
  ttlMs?: number;
  children: (data: T | null, loading: boolean, error: Error | null, refresh: () => void) => ReactNode;
  fallback?: ReactNode;
}

export function OfflineDataWrapper<T>({
  cacheKey,
  fetchData,
  ttlMs = DEFAULT_TTL,
  children,
  fallback,
}: OfflineDataWrapperProps<T>) {
  const { isOnline, cacheData, getCachedData } = useOffline();
  const [data, setData] = useState<T | null>(() => getCachedData<T>(cacheKey));
  const [loading, setLoading] = useState(!data);
  const [error, setError] = useState<Error | null>(null);

  const loadData = useCallback(async () => {
    if (!isOnline) {
      // Try to use cached data when offline
      const cached = getCachedData<T>(cacheKey);
      if (cached) {
        setData(cached);
        setLoading(false);
      } else {
        setError(new Error('No cached data available'));
        setLoading(false);
      }
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await fetchData();
      setData(result);
      cacheData(cacheKey, result, ttlMs);
    } catch (e) {
      // Fall back to cache on error
      const cached = getCachedData<T>(cacheKey);
      if (cached) {
        setData(cached);
      } else {
        setError(e instanceof Error ? e : new Error('Failed to load data'));
      }
    } finally {
      setLoading(false);
    }
  }, [isOnline, fetchData, cacheKey, cacheData, getCachedData, ttlMs]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (loading && !data && fallback) {
    return <>{fallback}</>;
  }

  return <>{children(data, loading, error, loadData)}</>;
}

// Offline Action Button
interface OfflineActionButtonProps {
  action: Omit<PendingAction, 'id' | 'timestamp' | 'retries'>;
  onSuccess?: () => void;
  children: ReactNode;
  className?: string;
  disabled?: boolean;
}

export function OfflineActionButton({
  action,
  onSuccess,
  children,
  className = '',
  disabled = false,
}: OfflineActionButtonProps) {
  const { isOnline, queueAction } = useOffline();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleClick = async () => {
    if (!isOnline) {
      // Queue for later sync
      queueAction(action);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
      onSuccess?.();
      return;
    }

    setLoading(true);

    try {
      await fetch(action.endpoint, {
        method: action.method,
        headers: { 'Content-Type': 'application/json' },
        body: action.payload ? JSON.stringify(action.payload) : undefined,
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
      onSuccess?.();
    } catch (e) {
      // Queue on failure
      queueAction(action);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled || loading}
      className={`relative ${className}`}
    >
      {loading ? (
        <RefreshCw className="w-4 h-4 animate-spin" />
      ) : success ? (
        <CheckCircle className="w-4 h-4 text-green-500" />
      ) : (
        children
      )}
      {!isOnline && (
        <span className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-500 rounded-full" />
      )}
    </button>
  );
}

// Cache Manager Component
interface CacheManagerProps {
  className?: string;
}

export function CacheManager({ className = '' }: CacheManagerProps) {
  const { cachedData, removeCachedData, clearCache } = useOffline();
  const [showDetails, setShowDetails] = useState(false);

  const items = useMemo(() => {
    const arr: CachedItem[] = [];
    cachedData.forEach(item => arr.push(item));
    return arr.sort((a, b) => b.timestamp - a.timestamp);
  }, [cachedData]);

  return (
    <div className={`bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 ${className}`}>
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-gray-400" />
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Cached Data ({items.length} items)
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              {showDetails ? 'Hide' : 'Show'} Details
            </button>
            <button
              onClick={() => {
                if (confirm('Clear all cached data?')) {
                  clearCache();
                }
              }}
              className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {showDetails && (
        <div className="p-4 max-h-60 overflow-y-auto">
          {items.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">No cached data</p>
          ) : (
            <div className="space-y-2">
              {items.map(item => (
                <div
                  key={item.key}
                  className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-lg"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-gray-900 dark:text-white truncate">
                      {item.key}
                    </p>
                    <p className="text-xs text-gray-500">
                      Cached: {new Date(item.timestamp).toLocaleString()}
                      {item.expiresAt && (
                        <> • Expires: {new Date(item.expiresAt).toLocaleString()}</>
                      )}
                    </p>
                  </div>
                  <button
                    onClick={() => removeCachedData(item.key)}
                    className="p-1 text-gray-400 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export type {
  CachedItem,
  PendingAction,
  SyncStatus,
  OfflineContextValue,
  OfflineProviderProps,
  OfflineIndicatorProps,
  SyncStatusPanelProps,
  OfflineDataWrapperProps,
  OfflineActionButtonProps,
  CacheManagerProps,
};

'use client';

import React, { useState, useEffect, useCallback, createContext, useContext } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Clock,
  X,
  ChevronRight,
  FileText,
  Trash2,
  ExternalLink,
} from 'lucide-react';

// Types
export interface RecentPage {
  id: string;
  path: string;
  title: string;
  subtitle?: string;
  icon?: string;
  timestamp: number;
}

interface RecentlyViewedContextValue {
  recentPages: RecentPage[];
  addPage: (page: Omit<RecentPage, 'id' | 'timestamp'>) => void;
  removePage: (id: string) => void;
  clearAll: () => void;
}

interface RecentlyViewedProps {
  className?: string;
  maxItems?: number;
  variant?: 'dropdown' | 'sidebar' | 'list';
  showClearButton?: boolean;
}

const STORAGE_KEY = 'manufacturingos-recent-pages';
const MAX_RECENT_PAGES = 10;

// Context
const RecentlyViewedContext = createContext<RecentlyViewedContextValue | null>(null);

// Provider component
export function RecentlyViewedProvider({ children }: { children: React.ReactNode }) {
  const [recentPages, setRecentPages] = useState<RecentPage[]>([]);
  const pathname = usePathname();

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setRecentPages(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse recent pages:', e);
      }
    }
  }, []);

  // Save to localStorage when pages change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(recentPages));
  }, [recentPages]);

  const addPage = useCallback((page: Omit<RecentPage, 'id' | 'timestamp'>) => {
    setRecentPages(prev => {
      // Remove existing entry with same path
      const filtered = prev.filter(p => p.path !== page.path);

      // Add new entry at beginning
      const newPage: RecentPage = {
        ...page,
        id: `${page.path}-${Date.now()}`,
        timestamp: Date.now(),
      };

      // Keep only max items
      return [newPage, ...filtered].slice(0, MAX_RECENT_PAGES);
    });
  }, []);

  const removePage = useCallback((id: string) => {
    setRecentPages(prev => prev.filter(p => p.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setRecentPages([]);
  }, []);

  return (
    <RecentlyViewedContext.Provider value={{ recentPages, addPage, removePage, clearAll }}>
      {children}
    </RecentlyViewedContext.Provider>
  );
}

// Hook to use recent pages
export function useRecentlyViewed() {
  const context = useContext(RecentlyViewedContext);
  if (!context) {
    throw new Error('useRecentlyViewed must be used within RecentlyViewedProvider');
  }
  return context;
}

// Hook to track page visits
export function useTrackPageVisit(title: string, subtitle?: string, icon?: string) {
  const pathname = usePathname();
  const context = useContext(RecentlyViewedContext);

  useEffect(() => {
    if (context && pathname && title) {
      // Don't track certain paths
      const excludedPaths = ['/login', '/logout', '/404', '/500'];
      if (!excludedPaths.some(p => pathname.startsWith(p))) {
        context.addPage({ path: pathname, title, subtitle, icon });
      }
    }
  }, [pathname, title, subtitle, icon, context]);
}

// Format relative time
function formatRelativeTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;

  return new Date(timestamp).toLocaleDateString();
}

// Display component
export function RecentlyViewed({
  className = '',
  maxItems = 10,
  variant = 'dropdown',
  showClearButton = true,
}: RecentlyViewedProps) {
  const { recentPages, removePage, clearAll } = useRecentlyViewed();
  const [isOpen, setIsOpen] = useState(false);

  const displayedPages = recentPages.slice(0, maxItems);

  if (variant === 'sidebar') {
    return (
      <div className={`${className}`}>
        <div className="flex items-center justify-between px-3 py-2">
          <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Recently Viewed
          </h3>
          {showClearButton && displayedPages.length > 0 && (
            <button
              onClick={clearAll}
              className="text-xs text-gray-400 hover:text-red-500 transition-colors"
              title="Clear all"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          )}
        </div>
        <div className="space-y-0.5">
          {displayedPages.length === 0 ? (
            <div className="px-3 py-2 text-sm text-gray-400 dark:text-gray-500">
              No recent pages
            </div>
          ) : (
            displayedPages.map(page => (
              <Link
                key={page.id}
                href={page.path}
                className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md group"
              >
                <Clock className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                <span className="truncate flex-1">{page.title}</span>
                <span className="text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  {formatRelativeTime(page.timestamp)}
                </span>
              </Link>
            ))
          )}
        </div>
      </div>
    );
  }

  if (variant === 'list') {
    return (
      <div className={`bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 ${className}`}>
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
          <h3 className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-500" />
            Recently Viewed
          </h3>
          {showClearButton && displayedPages.length > 0 && (
            <button
              onClick={clearAll}
              className="text-sm text-gray-500 hover:text-red-500 transition-colors flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear all
            </button>
          )}
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {displayedPages.length === 0 ? (
            <div className="px-4 py-8 text-center text-gray-500">
              No recently viewed pages
            </div>
          ) : (
            displayedPages.map(page => (
              <div
                key={page.id}
                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 group"
              >
                <div className="flex-shrink-0 text-gray-400">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <Link
                    href={page.path}
                    className="font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    {page.title}
                  </Link>
                  {page.subtitle && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                      {page.subtitle}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-xs text-gray-400">
                    {formatRelativeTime(page.timestamp)}
                  </span>
                  <button
                    onClick={() => removePage(page.id)}
                    className="p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  // Dropdown variant
  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
      >
        <Clock className="w-4 h-4" />
        <span className="hidden sm:inline">Recent</span>
        {displayedPages.length > 0 && (
          <span className="text-xs bg-gray-200 dark:bg-gray-700 px-1.5 py-0.5 rounded-full">
            {displayedPages.length}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-gray-900 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
              <h3 className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-500" />
                Recently Viewed
              </h3>
              {showClearButton && displayedPages.length > 0 && (
                <button
                  onClick={clearAll}
                  className="text-xs text-gray-500 hover:text-red-500"
                >
                  Clear all
                </button>
              )}
            </div>
            <div className="max-h-80 overflow-y-auto">
              {displayedPages.length === 0 ? (
                <div className="px-4 py-8 text-center text-gray-500">
                  No recently viewed pages
                </div>
              ) : (
                displayedPages.map(page => (
                  <Link
                    key={page.id}
                    href={page.path}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-800 group"
                  >
                    <div className="flex-shrink-0 text-gray-400">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 dark:text-white truncate text-sm">
                        {page.title}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {formatRelativeTime(page.timestamp)}
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500" />
                  </Link>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export type { RecentlyViewedProps };

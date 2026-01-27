'use client';

import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  ReactNode,
  useMemo,
} from 'react';

// ============================================================================
// Progressive Loading Types
// ============================================================================

export type LoadingPhase = 'initial' | 'partial' | 'complete' | 'error';

export interface ProgressiveData<T> {
  data: T | null;
  phase: LoadingPhase;
  progress: number; // 0-100
  error: Error | null;
}

// ============================================================================
// Progressive Data Loader Hook
// ============================================================================

export interface UseProgressiveLoadOptions<T> {
  /** Initial/cached data to show immediately */
  initialData?: T;
  /** Function to fetch partial data (e.g., first page) */
  fetchPartial?: () => Promise<Partial<T>>;
  /** Function to fetch complete data */
  fetchComplete: () => Promise<T>;
  /** Delay before fetching complete data */
  completeDelay?: number;
  /** Enable background refresh */
  backgroundRefresh?: boolean;
  /** Refresh interval in ms */
  refreshInterval?: number;
}

export function useProgressiveLoad<T>(
  options: UseProgressiveLoadOptions<T>
): ProgressiveData<T> & { refresh: () => void } {
  const {
    initialData,
    fetchPartial,
    fetchComplete,
    completeDelay = 0,
    backgroundRefresh = false,
    refreshInterval = 30000,
  } = options;

  const [data, setData] = useState<T | null>(initialData || null);
  const [phase, setPhase] = useState<LoadingPhase>(initialData ? 'partial' : 'initial');
  const [progress, setProgress] = useState(initialData ? 50 : 0);
  const [error, setError] = useState<Error | null>(null);
  const mountedRef = useRef(true);

  const load = useCallback(async () => {
    try {
      setError(null);

      // Phase 1: Show cached/initial data immediately
      if (initialData) {
        setData(initialData);
        setPhase('partial');
        setProgress(30);
      }

      // Phase 2: Fetch partial data
      if (fetchPartial) {
        setPhase('partial');
        const partialData = await fetchPartial();
        if (mountedRef.current) {
          setData(prev => ({ ...prev, ...partialData } as T));
          setProgress(60);
        }
      }

      // Phase 3: Fetch complete data
      if (completeDelay > 0) {
        await new Promise(resolve => setTimeout(resolve, completeDelay));
      }

      const completeData = await fetchComplete();
      if (mountedRef.current) {
        setData(completeData);
        setPhase('complete');
        setProgress(100);
      }
    } catch (err) {
      if (mountedRef.current) {
        setError(err instanceof Error ? err : new Error('Failed to load data'));
        setPhase('error');
      }
    }
  }, [initialData, fetchPartial, fetchComplete, completeDelay]);

  // Initial load
  useEffect(() => {
    load();
  }, [load]);

  // Background refresh
  useEffect(() => {
    if (!backgroundRefresh || phase !== 'complete') return;

    const interval = setInterval(load, refreshInterval);
    return () => clearInterval(interval);
  }, [backgroundRefresh, phase, refreshInterval, load]);

  // Cleanup
  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  return { data, phase, progress, error, refresh: load };
}

// ============================================================================
// Progressive Loading Component
// ============================================================================

export interface ProgressiveLoadProps<T> {
  /** Fetch function for complete data */
  fetchData: () => Promise<T>;
  /** Initial/cached data */
  initialData?: T;
  /** Render function for data */
  children: (data: T) => ReactNode;
  /** Loading state renderer */
  loadingRenderer?: (progress: number) => ReactNode;
  /** Partial data renderer */
  partialRenderer?: (data: Partial<T>) => ReactNode;
  /** Error renderer */
  errorRenderer?: (error: Error, retry: () => void) => ReactNode;
  /** Show progress indicator */
  showProgress?: boolean;
  className?: string;
}

export function ProgressiveLoad<T>({
  fetchData,
  initialData,
  children,
  loadingRenderer,
  partialRenderer,
  errorRenderer,
  showProgress = true,
  className = '',
}: ProgressiveLoadProps<T>) {
  const { data, phase, progress, error, refresh } = useProgressiveLoad({
    initialData,
    fetchComplete: fetchData,
  });

  // Default loading renderer
  const defaultLoadingRenderer = (prog: number) => (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4" />
      {showProgress && (
        <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-600 transition-all duration-300"
            style={{ width: `${prog}%` }}
          />
        </div>
      )}
    </div>
  );

  // Default error renderer
  const defaultErrorRenderer = (err: Error, retry: () => void) => (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
        <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
      <p className="text-gray-600 dark:text-gray-400 mb-4">{err.message}</p>
      <button
        onClick={retry}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Try Again
      </button>
    </div>
  );

  return (
    <div className={className}>
      {phase === 'initial' && (loadingRenderer?.(progress) || defaultLoadingRenderer(progress))}
      {phase === 'partial' && data && (partialRenderer?.(data) || children(data))}
      {phase === 'complete' && data && children(data)}
      {phase === 'error' && error && (errorRenderer?.(error, refresh) || defaultErrorRenderer(error, refresh))}
    </div>
  );
}

// ============================================================================
// Staggered Loading Hook
// ============================================================================

export interface UseStaggeredLoadOptions {
  /** Total number of items */
  totalItems: number;
  /** Items to load per batch */
  batchSize?: number;
  /** Delay between batches in ms */
  batchDelay?: number;
  /** Start loading immediately */
  immediate?: boolean;
}

export interface UseStaggeredLoadResult {
  /** Number of items currently visible */
  visibleCount: number;
  /** Whether all items are loaded */
  isComplete: boolean;
  /** Progress percentage */
  progress: number;
  /** Start loading */
  start: () => void;
  /** Reset to initial state */
  reset: () => void;
}

export function useStaggeredLoad(options: UseStaggeredLoadOptions): UseStaggeredLoadResult {
  const {
    totalItems,
    batchSize = 10,
    batchDelay = 100,
    immediate = true,
  } = options;

  const [visibleCount, setVisibleCount] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const isComplete = visibleCount >= totalItems;
  const progress = totalItems > 0 ? Math.round((visibleCount / totalItems) * 100) : 0;

  const loadNextBatch = useCallback(() => {
    setVisibleCount(prev => {
      const next = Math.min(prev + batchSize, totalItems);
      if (next < totalItems) {
        timeoutRef.current = setTimeout(loadNextBatch, batchDelay);
      }
      return next;
    });
  }, [totalItems, batchSize, batchDelay]);

  const start = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setVisibleCount(0);
    loadNextBatch();
  }, [loadNextBatch]);

  const reset = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setVisibleCount(0);
  }, []);

  useEffect(() => {
    if (immediate && totalItems > 0) {
      start();
    }
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [immediate, totalItems, start]);

  return { visibleCount, isComplete, progress, start, reset };
}

// ============================================================================
// Staggered List Component
// ============================================================================

export interface StaggeredListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => ReactNode;
  keyExtractor: (item: T, index: number) => string | number;
  batchSize?: number;
  batchDelay?: number;
  loadingPlaceholder?: (count: number) => ReactNode;
  className?: string;
  itemClassName?: string;
}

export function StaggeredList<T>({
  items,
  renderItem,
  keyExtractor,
  batchSize = 10,
  batchDelay = 50,
  loadingPlaceholder,
  className = '',
  itemClassName = '',
}: StaggeredListProps<T>) {
  const { visibleCount, isComplete } = useStaggeredLoad({
    totalItems: items.length,
    batchSize,
    batchDelay,
  });

  const visibleItems = useMemo(
    () => items.slice(0, visibleCount),
    [items, visibleCount]
  );

  const remainingCount = items.length - visibleCount;

  return (
    <div className={className}>
      {visibleItems.map((item, index) => (
        <div
          key={keyExtractor(item, index)}
          className={`animate-fadeIn ${itemClassName}`}
          style={{
            animationDelay: `${(index % batchSize) * 50}ms`,
          }}
        >
          {renderItem(item, index)}
        </div>
      ))}
      {!isComplete && loadingPlaceholder?.(remainingCount)}

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

// ============================================================================
// Progressive Image Loading
// ============================================================================

export interface ProgressiveImageProps {
  src: string;
  alt: string;
  placeholder?: string;
  lowQualitySrc?: string;
  width?: number | string;
  height?: number | string;
  className?: string;
  onLoad?: () => void;
  onError?: (error: Error) => void;
}

export function ProgressiveImage({
  src,
  alt,
  placeholder,
  lowQualitySrc,
  width,
  height,
  className = '',
  onLoad,
  onError,
}: ProgressiveImageProps) {
  const [phase, setPhase] = useState<'placeholder' | 'low' | 'high'>('placeholder');
  const [currentSrc, setCurrentSrc] = useState(placeholder || '');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Reset when src changes
    setPhase('placeholder');
    setCurrentSrc(placeholder || '');
    setIsLoading(true);

    // Load low quality image first
    if (lowQualitySrc) {
      const lowImg = new Image();
      lowImg.src = lowQualitySrc;
      lowImg.onload = () => {
        setCurrentSrc(lowQualitySrc);
        setPhase('low');
      };
    }

    // Load high quality image
    const highImg = new Image();
    highImg.src = src;
    highImg.onload = () => {
      setCurrentSrc(src);
      setPhase('high');
      setIsLoading(false);
      onLoad?.();
    };
    highImg.onerror = () => {
      setIsLoading(false);
      onError?.(new Error('Failed to load image'));
    };
  }, [src, lowQualitySrc, placeholder, onLoad, onError]);

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{ width, height }}
    >
      {/* Placeholder/blur background */}
      {phase !== 'high' && placeholder && (
        <div
          className="absolute inset-0 bg-cover bg-center blur-lg scale-110"
          style={{ backgroundImage: `url(${placeholder})` }}
        />
      )}

      {/* Actual image */}
      {currentSrc && (
        <img
          src={currentSrc}
          alt={alt}
          className={`
            w-full h-full object-cover
            transition-all duration-500
            ${phase === 'high' ? 'opacity-100 blur-0' : 'opacity-90 blur-sm'}
          `}
        />
      )}

      {/* Loading indicator */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200 dark:bg-gray-800">
          <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Content Placeholder (Optimistic UI)
// ============================================================================

export interface ContentPlaceholderProps {
  loading: boolean;
  expectedContent?: ReactNode;
  actualContent: ReactNode;
  transitionDuration?: number;
  className?: string;
}

export function ContentPlaceholder({
  loading,
  expectedContent,
  actualContent,
  transitionDuration = 300,
  className = '',
}: ContentPlaceholderProps) {
  const [showActual, setShowActual] = useState(!loading);

  useEffect(() => {
    if (!loading) {
      setShowActual(true);
    }
  }, [loading]);

  return (
    <div className={`relative ${className}`}>
      {/* Expected/placeholder content */}
      <div
        className={`transition-opacity ${showActual ? 'opacity-0 pointer-events-none absolute inset-0' : 'opacity-100'}`}
        style={{ transitionDuration: `${transitionDuration}ms` }}
      >
        {expectedContent}
      </div>

      {/* Actual content */}
      <div
        className={`transition-opacity ${showActual ? 'opacity-100' : 'opacity-0 pointer-events-none absolute inset-0'}`}
        style={{ transitionDuration: `${transitionDuration}ms` }}
      >
        {actualContent}
      </div>
    </div>
  );
}

// ============================================================================
// Loading Progress Bar
// ============================================================================

export interface LoadingProgressBarProps {
  progress: number;
  showPercentage?: boolean;
  height?: string;
  color?: string;
  backgroundColor?: string;
  animated?: boolean;
  className?: string;
}

export function LoadingProgressBar({
  progress,
  showPercentage = false,
  height = '4px',
  color = '#3B82F6',
  backgroundColor = '#E5E7EB',
  animated = true,
  className = '',
}: LoadingProgressBarProps) {
  return (
    <div className={className}>
      <div
        className="w-full rounded-full overflow-hidden"
        style={{ height, backgroundColor }}
      >
        <div
          className={`h-full rounded-full ${animated ? 'transition-all duration-300' : ''}`}
          style={{
            width: `${Math.min(Math.max(progress, 0), 100)}%`,
            backgroundColor: color,
          }}
        />
      </div>
      {showPercentage && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 text-right">
          {Math.round(progress)}%
        </p>
      )}
    </div>
  );
}


'use client';

import React, {
  lazy,
  Suspense,
  ComponentType,
  ReactNode,
  useEffect,
  useState,
  useCallback,
} from 'react';

// ============================================================================
// Lazy Loading Utilities
// ============================================================================

export interface LazyLoadOptions {
  /** Fallback component while loading */
  fallback?: ReactNode;
  /** Delay before showing fallback (prevents flash) */
  delay?: number;
  /** Timeout before showing error */
  timeout?: number;
  /** Retry count on failure */
  retryCount?: number;
  /** Preload on hover/focus */
  preloadOnInteraction?: boolean;
}

/**
 * Create a lazy-loaded component with enhanced options
 */
export function createLazyComponent<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  options: LazyLoadOptions = {}
): React.LazyExoticComponent<T> & { preload: () => void } {
  const {
    retryCount = 3,
  } = options;

  let retries = 0;

  const lazyImport = () => {
    return importFn().catch((error) => {
      if (retries < retryCount) {
        retries++;
        // Exponential backoff
        return new Promise<{ default: T }>((resolve) => {
          setTimeout(() => resolve(lazyImport()), Math.pow(2, retries) * 1000);
        });
      }
      throw error;
    });
  };

  const LazyComponent = lazy(lazyImport) as React.LazyExoticComponent<T> & { preload: () => void };

  // Add preload method
  LazyComponent.preload = () => {
    importFn();
  };

  return LazyComponent;
}

// ============================================================================
// Lazy Load Wrapper with Delay
// ============================================================================

export interface LazyLoadWrapperProps {
  children: ReactNode;
  fallback?: ReactNode;
  delay?: number;
  minLoadTime?: number;
}

export function LazyLoadWrapper({
  children,
  fallback,
  delay = 200,
  minLoadTime = 0,
}: LazyLoadWrapperProps) {
  const [showFallback, setShowFallback] = useState(false);
  const [minTimeElapsed, setMinTimeElapsed] = useState(minLoadTime === 0);

  useEffect(() => {
    // Delay showing fallback to prevent flash
    const delayTimer = setTimeout(() => {
      setShowFallback(true);
    }, delay);

    // Minimum load time
    const minTimer = setTimeout(() => {
      setMinTimeElapsed(true);
    }, minLoadTime);

    return () => {
      clearTimeout(delayTimer);
      clearTimeout(minTimer);
    };
  }, [delay, minLoadTime]);

  const actualFallback = showFallback && fallback ? fallback : null;

  if (!minTimeElapsed) {
    return <>{actualFallback}</>;
  }

  return (
    <Suspense fallback={actualFallback}>
      {children}
    </Suspense>
  );
}

// ============================================================================
// Route-based Code Splitting
// ============================================================================

export interface RouteConfig {
  path: string;
  component: () => Promise<{ default: ComponentType<any> }>;
  preload?: boolean;
  fallback?: ReactNode;
}

/**
 * Create lazy routes with preloading support
 */
export function createLazyRoutes(routes: RouteConfig[]) {
  return routes.map((route) => {
    const LazyComponent = createLazyComponent(route.component);

    // Preload if configured
    if (route.preload) {
      LazyComponent.preload();
    }

    return {
      path: route.path,
      Component: LazyComponent,
      fallback: route.fallback,
      preload: LazyComponent.preload,
    };
  });
}

// ============================================================================
// Preload on Interaction
// ============================================================================

export interface PreloadLinkProps {
  href: string;
  preloadFn: () => void;
  children: ReactNode;
  className?: string;
  onNavigate?: () => void;
}

export function PreloadLink({
  href,
  preloadFn,
  children,
  className = '',
  onNavigate,
}: PreloadLinkProps) {
  const handleInteraction = useCallback(() => {
    preloadFn();
  }, [preloadFn]);

  const handleClick = useCallback((e: React.MouseEvent) => {
    if (onNavigate) {
      e.preventDefault();
      onNavigate();
    }
  }, [onNavigate]);

  return (
    <a
      href={href}
      className={className}
      onMouseEnter={handleInteraction}
      onFocus={handleInteraction}
      onTouchStart={handleInteraction}
      onClick={handleClick}
    >
      {children}
    </a>
  );
}

// ============================================================================
// Dynamic Import with Loading State
// ============================================================================

export interface UseDynamicImportResult<T> {
  Component: T | null;
  loading: boolean;
  error: Error | null;
  retry: () => void;
}

export function useDynamicImport<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  options: { immediate?: boolean } = {}
): UseDynamicImportResult<T> {
  const { immediate = true } = options;

  const [Component, setComponent] = useState<T | null>(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState<Error | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const module = await importFn();
      setComponent(() => module.default);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load component'));
    } finally {
      setLoading(false);
    }
  }, [importFn]);

  useEffect(() => {
    if (immediate) {
      load();
    }
  }, [immediate, load]);

  return {
    Component,
    loading,
    error,
    retry: load,
  };
}

// ============================================================================
// Intersection Observer Lazy Load
// ============================================================================

export interface LazyOnViewProps {
  children: ReactNode;
  fallback?: ReactNode;
  rootMargin?: string;
  threshold?: number;
  triggerOnce?: boolean;
  className?: string;
  onVisible?: () => void;
}

export function LazyOnView({
  children,
  fallback,
  rootMargin = '100px',
  threshold = 0,
  triggerOnce = true,
  className = '',
  onVisible,
}: LazyOnViewProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [ref, setRef] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ref || (triggerOnce && isVisible)) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          onVisible?.();

          if (triggerOnce) {
            observer.disconnect();
          }
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      { rootMargin, threshold }
    );

    observer.observe(ref);

    return () => observer.disconnect();
  }, [ref, rootMargin, threshold, triggerOnce, isVisible, onVisible]);

  return (
    <div ref={setRef} className={className}>
      {isVisible ? children : fallback}
    </div>
  );
}

// ============================================================================
// Module Preloader
// ============================================================================

type PreloadModule = () => Promise<unknown>;

class ModulePreloader {
  private preloadedModules = new Set<string>();
  private loadingModules = new Map<string, Promise<unknown>>();

  preload(id: string, importFn: PreloadModule): void {
    if (this.preloadedModules.has(id) || this.loadingModules.has(id)) {
      return;
    }

    const promise = importFn()
      .then(() => {
        this.preloadedModules.add(id);
        this.loadingModules.delete(id);
      })
      .catch(() => {
        this.loadingModules.delete(id);
      });

    this.loadingModules.set(id, promise);
  }

  isPreloaded(id: string): boolean {
    return this.preloadedModules.has(id);
  }

  isLoading(id: string): boolean {
    return this.loadingModules.has(id);
  }

  async waitFor(id: string): Promise<void> {
    const promise = this.loadingModules.get(id);
    if (promise) {
      await promise;
    }
  }
}

export const modulePreloader = new ModulePreloader();

// ============================================================================
// Preload Hints
// ============================================================================

export function preloadRoute(path: string): void {
  // Add preload link hint
  if (typeof document !== 'undefined') {
    const existing = document.querySelector(`link[href="${path}"]`);
    if (!existing) {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = path;
      document.head.appendChild(link);
    }
  }
}

export function preloadImage(src: string): void {
  if (typeof window !== 'undefined') {
    const img = new Image();
    img.src = src;
  }
}

export function preloadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof document === 'undefined') {
      resolve();
      return;
    }

    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
    document.head.appendChild(script);
  });
}

// ============================================================================
// Page Transition Loading
// ============================================================================

export interface PageTransitionProps {
  loading: boolean;
  children: ReactNode;
  fallback?: ReactNode;
  minDisplayTime?: number;
  className?: string;
}

export function PageTransition({
  loading,
  children,
  fallback,
  minDisplayTime = 300,
  className = '',
}: PageTransitionProps) {
  const [showContent, setShowContent] = useState(!loading);
  const [showLoading, setShowLoading] = useState(loading);

  useEffect(() => {
    if (loading) {
      setShowLoading(true);
      setShowContent(false);
    } else {
      // Ensure minimum display time for loading state
      const timer = setTimeout(() => {
        setShowLoading(false);
        setShowContent(true);
      }, minDisplayTime);

      return () => clearTimeout(timer);
    }
  }, [loading, minDisplayTime]);

  return (
    <div className={className}>
      {showLoading && fallback}
      <div
        className={`transition-opacity duration-300 ${showContent ? 'opacity-100' : 'opacity-0'}`}
        style={{ display: showContent ? undefined : 'none' }}
      >
        {children}
      </div>
    </div>
  );
}


'use client';

import React, { useEffect, useState, useCallback, useMemo } from 'react';

// ============================================================================
// Performance Metrics Types
// ============================================================================

export interface PerformanceMetrics {
  // Core Web Vitals
  lcp?: number; // Largest Contentful Paint
  fid?: number; // First Input Delay
  cls?: number; // Cumulative Layout Shift
  fcp?: number; // First Contentful Paint
  ttfb?: number; // Time to First Byte
  inp?: number; // Interaction to Next Paint

  // Navigation Timing
  domContentLoaded?: number;
  loadComplete?: number;
  domInteractive?: number;

  // Resource Timing
  resourceCount?: number;
  totalTransferSize?: number;
  totalDecodedSize?: number;

  // Custom metrics
  jsHeapSize?: number;
  timestamp: number;
}

export interface ResourceMetric {
  name: string;
  type: string;
  transferSize: number;
  decodedSize: number;
  duration: number;
  startTime: number;
}

// ============================================================================
// Performance Monitor Hook
// ============================================================================

export interface UsePerformanceMonitorOptions {
  /** Enable Core Web Vitals tracking */
  trackWebVitals?: boolean;
  /** Enable resource timing tracking */
  trackResources?: boolean;
  /** Enable memory tracking (Chrome only) */
  trackMemory?: boolean;
  /** Callback when metrics are collected */
  onMetrics?: (metrics: PerformanceMetrics) => void;
  /** Collection interval in ms */
  interval?: number;
}

export function usePerformanceMonitor(options: UsePerformanceMonitorOptions = {}) {
  const {
    trackWebVitals = true,
    trackResources = true,
    trackMemory = true,
    onMetrics,
    interval = 5000,
  } = options;

  const [metrics, setMetrics] = useState<PerformanceMetrics>({ timestamp: Date.now() });
  const [resources, setResources] = useState<ResourceMetric[]>([]);

  // Collect navigation timing metrics
  const collectNavigationMetrics = useCallback(() => {
    if (typeof window === 'undefined') return {};

    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (!navigation) return {};

    return {
      ttfb: navigation.responseStart - navigation.requestStart,
      domContentLoaded: navigation.domContentLoadedEventEnd - navigation.startTime,
      loadComplete: navigation.loadEventEnd - navigation.startTime,
      domInteractive: navigation.domInteractive - navigation.startTime,
    };
  }, []);

  // Collect resource metrics
  const collectResourceMetrics = useCallback(() => {
    if (typeof window === 'undefined' || !trackResources) return;

    const resourceEntries = performance.getEntriesByType('resource') as PerformanceResourceTiming[];

    const resourceMetrics: ResourceMetric[] = resourceEntries.map(entry => ({
      name: entry.name,
      type: entry.initiatorType,
      transferSize: entry.transferSize,
      decodedSize: entry.decodedBodySize,
      duration: entry.duration,
      startTime: entry.startTime,
    }));

    setResources(resourceMetrics);

    const totalTransferSize = resourceMetrics.reduce((sum, r) => sum + r.transferSize, 0);
    const totalDecodedSize = resourceMetrics.reduce((sum, r) => sum + r.decodedSize, 0);

    return {
      resourceCount: resourceMetrics.length,
      totalTransferSize,
      totalDecodedSize,
    };
  }, [trackResources]);

  // Collect memory metrics (Chrome only)
  const collectMemoryMetrics = useCallback(() => {
    if (typeof window === 'undefined' || !trackMemory) return {};

    // @ts-ignore - memory is Chrome-specific
    const memory = performance.memory;
    if (!memory) return {};

    return {
      jsHeapSize: memory.usedJSHeapSize,
    };
  }, [trackMemory]);

  // Main collection function
  const collectMetrics = useCallback(() => {
    const navMetrics = collectNavigationMetrics();
    const resourceMetrics = collectResourceMetrics();
    const memoryMetrics = collectMemoryMetrics();

    const newMetrics: PerformanceMetrics = {
      ...navMetrics,
      ...resourceMetrics,
      ...memoryMetrics,
      timestamp: Date.now(),
    };

    setMetrics(prev => ({ ...prev, ...newMetrics }));
    onMetrics?.(newMetrics);
  }, [collectNavigationMetrics, collectResourceMetrics, collectMemoryMetrics, onMetrics]);

  // Web Vitals tracking
  useEffect(() => {
    if (typeof window === 'undefined' || !trackWebVitals) return;

    // LCP Observer
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1] as PerformanceEntry & { startTime: number };
      setMetrics(prev => ({ ...prev, lcp: lastEntry.startTime }));
    });

    // FCP Observer
    const fcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const fcpEntry = entries.find(e => e.name === 'first-contentful-paint');
      if (fcpEntry) {
        setMetrics(prev => ({ ...prev, fcp: fcpEntry.startTime }));
      }
    });

    // CLS Observer
    let clsValue = 0;
    const clsObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        // @ts-ignore - hadRecentInput is part of LayoutShift
        if (!entry.hadRecentInput) {
          // @ts-ignore - value is part of LayoutShift
          clsValue += entry.value;
          setMetrics(prev => ({ ...prev, cls: clsValue }));
        }
      }
    });

    // FID Observer
    const fidObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      if (entries.length > 0) {
        // @ts-ignore - processingStart is part of PerformanceEventTiming
        const fid = entries[0].processingStart - entries[0].startTime;
        setMetrics(prev => ({ ...prev, fid }));
      }
    });

    try {
      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
      fcpObserver.observe({ type: 'paint', buffered: true });
      clsObserver.observe({ type: 'layout-shift', buffered: true });
      fidObserver.observe({ type: 'first-input', buffered: true });
    } catch (e) {
      // Observer not supported
    }

    return () => {
      lcpObserver.disconnect();
      fcpObserver.disconnect();
      clsObserver.disconnect();
      fidObserver.disconnect();
    };
  }, [trackWebVitals]);

  // Periodic collection
  useEffect(() => {
    collectMetrics();

    const timer = setInterval(collectMetrics, interval);
    return () => clearInterval(timer);
  }, [collectMetrics, interval]);

  return { metrics, resources, refresh: collectMetrics };
}

// ============================================================================
// Performance Dashboard Component
// ============================================================================

export interface PerformanceDashboardProps {
  showWebVitals?: boolean;
  showResources?: boolean;
  showMemory?: boolean;
  className?: string;
}

export function PerformanceDashboard({
  showWebVitals = true,
  showResources = true,
  showMemory = true,
  className = '',
}: PerformanceDashboardProps) {
  const { metrics, resources } = usePerformanceMonitor({
    trackWebVitals: showWebVitals,
    trackResources: showResources,
    trackMemory: showMemory,
  });

  // Format bytes
  const formatBytes = (bytes?: number) => {
    if (bytes === undefined) return 'N/A';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // Format time
  const formatTime = (ms?: number) => {
    if (ms === undefined) return 'N/A';
    if (ms < 1000) return `${Math.round(ms)} ms`;
    return `${(ms / 1000).toFixed(2)} s`;
  };

  // Get status color for Web Vitals
  const getVitalStatus = (vital: string, value?: number): string => {
    if (value === undefined) return 'bg-gray-100 text-gray-600';

    const thresholds: Record<string, [number, number]> = {
      lcp: [2500, 4000],
      fid: [100, 300],
      cls: [0.1, 0.25],
      fcp: [1800, 3000],
      ttfb: [800, 1800],
    };

    const [good, poor] = thresholds[vital] || [0, 0];
    if (value <= good) return 'bg-green-100 text-green-700';
    if (value <= poor) return 'bg-yellow-100 text-yellow-700';
    return 'bg-red-100 text-red-700';
  };

  // Group resources by type
  const resourcesByType = useMemo(() => {
    const groups: Record<string, { count: number; size: number }> = {};
    resources.forEach(r => {
      if (!groups[r.type]) {
        groups[r.type] = { count: 0, size: 0 };
      }
      groups[r.type].count++;
      groups[r.type].size += r.transferSize;
    });
    return groups;
  }, [resources]);

  return (
    <div className={`bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden ${className}`}>
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Performance Metrics
        </h2>
        <p className="text-sm text-gray-500">
          Last updated: {new Date(metrics.timestamp).toLocaleTimeString()}
        </p>
      </div>

      {/* Web Vitals */}
      {showWebVitals && (
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Core Web Vitals</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <div className={`p-3 rounded-lg ${getVitalStatus('lcp', metrics.lcp)}`}>
              <p className="text-xs font-medium opacity-75">LCP</p>
              <p className="text-lg font-bold">{formatTime(metrics.lcp)}</p>
            </div>
            <div className={`p-3 rounded-lg ${getVitalStatus('fid', metrics.fid)}`}>
              <p className="text-xs font-medium opacity-75">FID</p>
              <p className="text-lg font-bold">{formatTime(metrics.fid)}</p>
            </div>
            <div className={`p-3 rounded-lg ${getVitalStatus('cls', metrics.cls)}`}>
              <p className="text-xs font-medium opacity-75">CLS</p>
              <p className="text-lg font-bold">{metrics.cls?.toFixed(3) || 'N/A'}</p>
            </div>
            <div className={`p-3 rounded-lg ${getVitalStatus('fcp', metrics.fcp)}`}>
              <p className="text-xs font-medium opacity-75">FCP</p>
              <p className="text-lg font-bold">{formatTime(metrics.fcp)}</p>
            </div>
            <div className={`p-3 rounded-lg ${getVitalStatus('ttfb', metrics.ttfb)}`}>
              <p className="text-xs font-medium opacity-75">TTFB</p>
              <p className="text-lg font-bold">{formatTime(metrics.ttfb)}</p>
            </div>
            <div className="p-3 rounded-lg bg-gray-100 dark:bg-gray-800">
              <p className="text-xs font-medium text-gray-500">Load Complete</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                {formatTime(metrics.loadComplete)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Resource Breakdown */}
      {showResources && (
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Resources</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Total Resources:</span>
              <span className="font-medium text-gray-900 dark:text-white">{metrics.resourceCount}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Transfer Size:</span>
              <span className="font-medium text-gray-900 dark:text-white">{formatBytes(metrics.totalTransferSize)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Decoded Size:</span>
              <span className="font-medium text-gray-900 dark:text-white">{formatBytes(metrics.totalDecodedSize)}</span>
            </div>
          </div>

          {/* Resource types breakdown */}
          <div className="mt-4 space-y-2">
            {Object.entries(resourcesByType).map(([type, data]) => (
              <div key={type} className="flex items-center gap-2">
                <div className="flex-1">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="capitalize text-gray-600 dark:text-gray-400">{type}</span>
                    <span className="text-gray-500">{data.count} files • {formatBytes(data.size)}</span>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500"
                      style={{
                        width: `${Math.min((data.size / (metrics.totalTransferSize || 1)) * 100, 100)}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Memory */}
      {showMemory && metrics.jsHeapSize !== undefined && (
        <div className="p-4">
          <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Memory</h3>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">JS Heap Size:</span>
            <span className="font-medium text-gray-900 dark:text-white">{formatBytes(metrics.jsHeapSize)}</span>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Bundle Size Warning Component
// ============================================================================

export interface BundleSizeWarningProps {
  maxSize?: number; // in KB
  currentSize: number; // in KB
  showPercentage?: boolean;
  className?: string;
}

export function BundleSizeWarning({
  maxSize = 200,
  currentSize,
  showPercentage = true,
  className = '',
}: BundleSizeWarningProps) {
  const percentage = (currentSize / maxSize) * 100;
  const isWarning = percentage > 80 && percentage <= 100;
  const isError = percentage > 100;

  const statusColor = isError
    ? 'text-red-600 bg-red-50 border-red-200'
    : isWarning
      ? 'text-yellow-600 bg-yellow-50 border-yellow-200'
      : 'text-green-600 bg-green-50 border-green-200';

  const barColor = isError ? 'bg-red-500' : isWarning ? 'bg-yellow-500' : 'bg-green-500';

  return (
    <div className={`p-4 rounded-lg border ${statusColor} ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="font-medium">Bundle Size</span>
        <span className="text-sm">
          {currentSize.toFixed(1)} KB / {maxSize} KB
          {showPercentage && ` (${percentage.toFixed(0)}%)`}
        </span>
      </div>
      <div className="h-2 bg-white/50 rounded-full overflow-hidden">
        <div
          className={`h-full ${barColor} transition-all duration-300`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
      {isError && (
        <p className="mt-2 text-sm">
          Bundle exceeds recommended size. Consider code splitting or removing unused dependencies.
        </p>
      )}
    </div>
  );
}

// ============================================================================
// Performance Report Generator
// ============================================================================

export function generatePerformanceReport(metrics: PerformanceMetrics): string {
  const lines: string[] = [
    '# Performance Report',
    `Generated: ${new Date(metrics.timestamp).toISOString()}`,
    '',
    '## Core Web Vitals',
    `- LCP: ${metrics.lcp?.toFixed(0) || 'N/A'} ms`,
    `- FID: ${metrics.fid?.toFixed(0) || 'N/A'} ms`,
    `- CLS: ${metrics.cls?.toFixed(3) || 'N/A'}`,
    `- FCP: ${metrics.fcp?.toFixed(0) || 'N/A'} ms`,
    `- TTFB: ${metrics.ttfb?.toFixed(0) || 'N/A'} ms`,
    '',
    '## Navigation Timing',
    `- DOM Content Loaded: ${metrics.domContentLoaded?.toFixed(0) || 'N/A'} ms`,
    `- Load Complete: ${metrics.loadComplete?.toFixed(0) || 'N/A'} ms`,
    `- DOM Interactive: ${metrics.domInteractive?.toFixed(0) || 'N/A'} ms`,
    '',
    '## Resources',
    `- Total Resources: ${metrics.resourceCount || 'N/A'}`,
    `- Transfer Size: ${metrics.totalTransferSize ? (metrics.totalTransferSize / 1024).toFixed(1) + ' KB' : 'N/A'}`,
    `- Decoded Size: ${metrics.totalDecodedSize ? (metrics.totalDecodedSize / 1024).toFixed(1) + ' KB' : 'N/A'}`,
  ];

  if (metrics.jsHeapSize) {
    lines.push('', '## Memory');
    lines.push(`- JS Heap Size: ${(metrics.jsHeapSize / (1024 * 1024)).toFixed(1)} MB`);
  }

  return lines.join('\n');
}

export type {
  PerformanceMetrics,
  ResourceMetric,
  UsePerformanceMonitorOptions,
  PerformanceDashboardProps,
  BundleSizeWarningProps,
};

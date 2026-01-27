'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  ZoomIn,
  ZoomOut,
  Move,
  Maximize2,
  RotateCcw,
  Download,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

// Types
export interface ZoomState {
  scale: number;
  translateX: number;
  translateY: number;
}

export interface TimeRange {
  start: Date;
  end: Date;
}

export interface ChartContainerProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  width?: number | string;
  height?: number | string;
  enableZoom?: boolean;
  enablePan?: boolean;
  enableExport?: boolean;
  minZoom?: number;
  maxZoom?: number;
  zoomStep?: number;
  timeRange?: TimeRange;
  onTimeRangeChange?: (range: TimeRange) => void;
  onZoomChange?: (zoom: ZoomState) => void;
  onExport?: (format: 'png' | 'svg' | 'pdf') => void;
  className?: string;
}

// Predefined time ranges
const timeRangePresets = [
  { label: '1D', days: 1 },
  { label: '1W', days: 7 },
  { label: '1M', days: 30 },
  { label: '3M', days: 90 },
  { label: '6M', days: 180 },
  { label: '1Y', days: 365 },
  { label: 'YTD', days: -1 }, // Special: year to date
  { label: 'All', days: 0 }, // Special: all data
];

export function ChartContainer({
  children,
  title,
  subtitle,
  width = '100%',
  height = 400,
  enableZoom = true,
  enablePan = true,
  enableExport = true,
  minZoom = 0.5,
  maxZoom = 4,
  zoomStep = 0.25,
  timeRange,
  onTimeRangeChange,
  onZoomChange,
  onExport,
  className = '',
}: ChartContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<HTMLDivElement>(null);

  const [zoom, setZoom] = useState<ZoomState>({
    scale: 1,
    translateX: 0,
    translateY: 0,
  });

  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activePreset, setActivePreset] = useState<string | null>(null);

  // Zoom in
  const handleZoomIn = useCallback(() => {
    setZoom(prev => {
      const newScale = Math.min(prev.scale + zoomStep, maxZoom);
      const newZoom = { ...prev, scale: newScale };
      onZoomChange?.(newZoom);
      return newZoom;
    });
  }, [zoomStep, maxZoom, onZoomChange]);

  // Zoom out
  const handleZoomOut = useCallback(() => {
    setZoom(prev => {
      const newScale = Math.max(prev.scale - zoomStep, minZoom);
      const newZoom = { ...prev, scale: newScale };
      onZoomChange?.(newZoom);
      return newZoom;
    });
  }, [zoomStep, minZoom, onZoomChange]);

  // Reset zoom
  const handleResetZoom = useCallback(() => {
    const resetZoom = { scale: 1, translateX: 0, translateY: 0 };
    setZoom(resetZoom);
    onZoomChange?.(resetZoom);
  }, [onZoomChange]);

  // Handle wheel zoom
  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (!enableZoom || !e.ctrlKey) return;

    e.preventDefault();
    const delta = e.deltaY > 0 ? -zoomStep : zoomStep;

    setZoom(prev => {
      const newScale = Math.min(Math.max(prev.scale + delta, minZoom), maxZoom);
      const newZoom = { ...prev, scale: newScale };
      onZoomChange?.(newZoom);
      return newZoom;
    });
  }, [enableZoom, zoomStep, minZoom, maxZoom, onZoomChange]);

  // Pan handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!enablePan || zoom.scale <= 1) return;

    setIsPanning(true);
    setPanStart({
      x: e.clientX - zoom.translateX,
      y: e.clientY - zoom.translateY,
    });
  }, [enablePan, zoom]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isPanning) return;

    const newTranslateX = e.clientX - panStart.x;
    const newTranslateY = e.clientY - panStart.y;

    setZoom(prev => {
      const newZoom = { ...prev, translateX: newTranslateX, translateY: newTranslateY };
      onZoomChange?.(newZoom);
      return newZoom;
    });
  }, [isPanning, panStart, onZoomChange]);

  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
  }, []);

  // Time range navigation
  const handleTimeRangeShift = useCallback((direction: 'prev' | 'next') => {
    if (!timeRange || !onTimeRangeChange) return;

    const duration = timeRange.end.getTime() - timeRange.start.getTime();
    const shift = direction === 'next' ? duration : -duration;

    onTimeRangeChange({
      start: new Date(timeRange.start.getTime() + shift),
      end: new Date(timeRange.end.getTime() + shift),
    });
  }, [timeRange, onTimeRangeChange]);

  // Preset time range selection
  const handlePresetSelect = useCallback((preset: { label: string; days: number }) => {
    if (!onTimeRangeChange) return;

    const now = new Date();
    let start: Date;
    const end = now;

    if (preset.days === -1) {
      // YTD
      start = new Date(now.getFullYear(), 0, 1);
    } else if (preset.days === 0) {
      // All - use a very early date
      start = new Date(2020, 0, 1);
    } else {
      start = new Date(now.getTime() - preset.days * 24 * 60 * 60 * 1000);
    }

    setActivePreset(preset.label);
    onTimeRangeChange({ start, end });
  }, [onTimeRangeChange]);

  // Toggle fullscreen
  const toggleFullscreen = useCallback(() => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  return (
    <div
      ref={containerRef}
      className={`bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden ${
        isFullscreen ? 'fixed inset-0 z-50' : ''
      } ${className}`}
      style={{ width: isFullscreen ? '100vw' : width, height: isFullscreen ? '100vh' : height }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <div>
          {title && (
            <h3 className="font-medium text-gray-900 dark:text-white">{title}</h3>
          )}
          {subtitle && (
            <p className="text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Time Range Presets */}
          {onTimeRangeChange && (
            <div className="flex items-center gap-1 mr-2">
              <button
                onClick={() => handleTimeRangeShift('prev')}
                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                title="Previous period"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-0.5">
                {timeRangePresets.map(preset => (
                  <button
                    key={preset.label}
                    onClick={() => handlePresetSelect(preset)}
                    className={`px-2 py-1 text-xs font-medium rounded transition-colors ${
                      activePreset === preset.label
                        ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>

              <button
                onClick={() => handleTimeRangeShift('next')}
                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                title="Next period"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Zoom Controls */}
          {enableZoom && (
            <div className="flex items-center gap-1 border-l border-gray-200 dark:border-gray-700 pl-2">
              <button
                onClick={handleZoomOut}
                disabled={zoom.scale <= minZoom}
                className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded disabled:opacity-50"
                title="Zoom out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>

              <span className="text-xs text-gray-500 min-w-[3rem] text-center">
                {Math.round(zoom.scale * 100)}%
              </span>

              <button
                onClick={handleZoomIn}
                disabled={zoom.scale >= maxZoom}
                className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded disabled:opacity-50"
                title="Zoom in"
              >
                <ZoomIn className="w-4 h-4" />
              </button>

              <button
                onClick={handleResetZoom}
                disabled={zoom.scale === 1 && zoom.translateX === 0 && zoom.translateY === 0}
                className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded disabled:opacity-50"
                title="Reset zoom"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Pan indicator */}
          {enablePan && zoom.scale > 1 && (
            <div className="flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded text-xs">
              <Move className="w-3 h-3" />
              Drag to pan
            </div>
          )}

          {/* Export Button */}
          {enableExport && onExport && (
            <button
              onClick={() => onExport('png')}
              className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
              title="Export chart"
            >
              <Download className="w-4 h-4" />
            </button>
          )}

          {/* Fullscreen */}
          <button
            onClick={toggleFullscreen}
            className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
            title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Chart Area */}
      <div
        ref={chartRef}
        className={`relative overflow-hidden ${isPanning ? 'cursor-grabbing' : zoom.scale > 1 ? 'cursor-grab' : ''}`}
        style={{ height: `calc(100% - 52px)` }}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div
          className="w-full h-full transition-transform duration-100"
          style={{
            transform: `scale(${zoom.scale}) translate(${zoom.translateX / zoom.scale}px, ${zoom.translateY / zoom.scale}px)`,
            transformOrigin: 'center center',
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

// Zoom controls hook for external use
interface ChartZoomOptions {
  minZoom?: number;
  maxZoom?: number;
  zoomStep?: number;
}

export function useChartZoom(options?: ChartZoomOptions) {
  const { minZoom = 0.5, maxZoom = 4, zoomStep = 0.25 } = options || {};

  const [zoom, setZoom] = useState<ZoomState>({
    scale: 1,
    translateX: 0,
    translateY: 0,
  });

  const zoomIn = useCallback(() => {
    setZoom(prev => ({
      ...prev,
      scale: Math.min(prev.scale + zoomStep, maxZoom),
    }));
  }, [zoomStep, maxZoom]);

  const zoomOut = useCallback(() => {
    setZoom(prev => ({
      ...prev,
      scale: Math.max(prev.scale - zoomStep, minZoom),
    }));
  }, [zoomStep, minZoom]);

  const reset = useCallback(() => {
    setZoom({ scale: 1, translateX: 0, translateY: 0 });
  }, []);

  const setScale = useCallback((scale: number) => {
    setZoom(prev => ({
      ...prev,
      scale: Math.min(Math.max(scale, minZoom), maxZoom),
    }));
  }, [minZoom, maxZoom]);

  return {
    zoom,
    zoomIn,
    zoomOut,
    reset,
    setScale,
    setZoom,
  };
}

// ZoomState and TimeRange are already exported at their definitions

'use client';

import React, { useState, useCallback, useMemo } from 'react';
import {
  Calendar,
  TrendingUp,
  TrendingDown,
  Minus,
  ChevronDown,
  ArrowLeftRight,
  Eye,
  EyeOff,
  Settings,
} from 'lucide-react';

// Types
export interface TimePeriod {
  start: Date;
  end: Date;
  label: string;
}

export interface ComparisonDataPoint {
  date: Date;
  value: number;
  label?: string;
}

export interface ComparisonSeries {
  id: string;
  name: string;
  color: string;
  data: ComparisonDataPoint[];
  visible?: boolean;
}

export interface PeriodComparisonProps {
  currentPeriod: TimePeriod;
  comparisonPeriod: TimePeriod;
  currentData: ComparisonDataPoint[];
  comparisonData: ComparisonDataPoint[];
  title?: string;
  valueFormatter?: (value: number) => string;
  dateFormatter?: (date: Date) => string;
  onPeriodChange?: (current: TimePeriod, comparison: TimePeriod) => void;
  showPercentChange?: boolean;
  showOverlay?: boolean;
  overlayOpacity?: number;
  currentColor?: string;
  comparisonColor?: string;
  renderChart: (
    series: ComparisonSeries[],
    options: { showOverlay: boolean; overlayOpacity: number }
  ) => React.ReactNode;
  className?: string;
}

// Comparison period presets
export type ComparisonPreset =
  | 'previous_period'
  | 'previous_year'
  | 'previous_month'
  | 'previous_quarter'
  | 'custom';

const presetLabels: Record<ComparisonPreset, string> = {
  previous_period: 'Previous Period',
  previous_year: 'Previous Year',
  previous_month: 'Previous Month',
  previous_quarter: 'Previous Quarter',
  custom: 'Custom Range',
};

// Calculate comparison period based on preset
function getComparisonPeriod(currentPeriod: TimePeriod, preset: ComparisonPreset): TimePeriod {
  const duration = currentPeriod.end.getTime() - currentPeriod.start.getTime();
  const startDate = new Date(currentPeriod.start);
  const endDate = new Date(currentPeriod.end);

  switch (preset) {
    case 'previous_period':
      return {
        start: new Date(startDate.getTime() - duration),
        end: new Date(endDate.getTime() - duration),
        label: 'Previous Period',
      };

    case 'previous_year':
      startDate.setFullYear(startDate.getFullYear() - 1);
      endDate.setFullYear(endDate.getFullYear() - 1);
      return { start: startDate, end: endDate, label: 'Previous Year' };

    case 'previous_month':
      startDate.setMonth(startDate.getMonth() - 1);
      endDate.setMonth(endDate.getMonth() - 1);
      return { start: startDate, end: endDate, label: 'Previous Month' };

    case 'previous_quarter':
      startDate.setMonth(startDate.getMonth() - 3);
      endDate.setMonth(endDate.getMonth() - 3);
      return { start: startDate, end: endDate, label: 'Previous Quarter' };

    default:
      return currentPeriod;
  }
}

// Calculate summary statistics
interface ComparisonStats {
  currentTotal: number;
  comparisonTotal: number;
  absoluteChange: number;
  percentChange: number;
  trend: 'up' | 'down' | 'neutral';
  currentAvg: number;
  comparisonAvg: number;
}

function calculateStats(
  currentData: ComparisonDataPoint[],
  comparisonData: ComparisonDataPoint[]
): ComparisonStats {
  const currentTotal = currentData.reduce((sum, d) => sum + d.value, 0);
  const comparisonTotal = comparisonData.reduce((sum, d) => sum + d.value, 0);
  const absoluteChange = currentTotal - comparisonTotal;
  const percentChange = comparisonTotal !== 0
    ? ((currentTotal - comparisonTotal) / comparisonTotal) * 100
    : 0;

  return {
    currentTotal,
    comparisonTotal,
    absoluteChange,
    percentChange,
    trend: percentChange > 0 ? 'up' : percentChange < 0 ? 'down' : 'neutral',
    currentAvg: currentData.length > 0 ? currentTotal / currentData.length : 0,
    comparisonAvg: comparisonData.length > 0 ? comparisonTotal / comparisonData.length : 0,
  };
}

export function PeriodComparison({
  currentPeriod,
  comparisonPeriod,
  currentData,
  comparisonData,
  title,
  valueFormatter = (v) => v.toLocaleString(),
  dateFormatter = (d) => d.toLocaleDateString(),
  onPeriodChange,
  showPercentChange = true,
  showOverlay: initialShowOverlay = true,
  overlayOpacity: initialOpacity = 0.3,
  currentColor = '#3B82F6',
  comparisonColor = '#9CA3AF',
  renderChart,
  className = '',
}: PeriodComparisonProps) {
  const [showOverlay, setShowOverlay] = useState(initialShowOverlay);
  const [overlayOpacity, setOverlayOpacity] = useState(initialOpacity);
  const [selectedPreset, setSelectedPreset] = useState<ComparisonPreset>('previous_period');
  const [showPresetMenu, setShowPresetMenu] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Calculate statistics
  const stats = useMemo(
    () => calculateStats(currentData, comparisonData),
    [currentData, comparisonData]
  );

  // Prepare series data
  const series: ComparisonSeries[] = useMemo(() => [
    {
      id: 'current',
      name: currentPeriod.label,
      color: currentColor,
      data: currentData,
      visible: true,
    },
    {
      id: 'comparison',
      name: comparisonPeriod.label,
      color: comparisonColor,
      data: comparisonData,
      visible: showOverlay,
    },
  ], [currentPeriod, comparisonPeriod, currentData, comparisonData, currentColor, comparisonColor, showOverlay]);

  // Handle preset change
  const handlePresetChange = useCallback((preset: ComparisonPreset) => {
    setSelectedPreset(preset);
    setShowPresetMenu(false);

    if (preset !== 'custom' && onPeriodChange) {
      const newComparisonPeriod = getComparisonPeriod(currentPeriod, preset);
      onPeriodChange(currentPeriod, newComparisonPeriod);
    }
  }, [currentPeriod, onPeriodChange]);

  // Trend icon
  const TrendIcon = stats.trend === 'up' ? TrendingUp : stats.trend === 'down' ? TrendingDown : Minus;
  const trendColor = stats.trend === 'up' ? 'text-green-500' : stats.trend === 'down' ? 'text-red-500' : 'text-gray-400';

  return (
    <div className={`bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <div>
          {title && (
            <h3 className="font-medium text-gray-900 dark:text-white">{title}</h3>
          )}
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {dateFormatter(currentPeriod.start)} - {dateFormatter(currentPeriod.end)}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Comparison Period Selector */}
          <div className="relative">
            <button
              onClick={() => setShowPresetMenu(!showPresetMenu)}
              className="flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <ArrowLeftRight className="w-4 h-4 text-gray-500" />
              <span className="text-gray-700 dark:text-gray-300">{presetLabels[selectedPreset]}</span>
              <ChevronDown className="w-3 h-3 text-gray-400" />
            </button>

            {showPresetMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowPresetMenu(false)} />
                <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50 py-1">
                  {(Object.keys(presetLabels) as ComparisonPreset[]).map(preset => (
                    <button
                      key={preset}
                      onClick={() => handlePresetChange(preset)}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${
                        selectedPreset === preset
                          ? 'text-blue-600 font-medium'
                          : 'text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {presetLabels[preset]}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Toggle Overlay */}
          <button
            onClick={() => setShowOverlay(!showOverlay)}
            className={`p-1.5 rounded transition-colors ${
              showOverlay
                ? 'text-blue-600 bg-blue-100 dark:bg-blue-900/30'
                : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
            title={showOverlay ? 'Hide comparison' : 'Show comparison'}
          >
            {showOverlay ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </button>

          {/* Settings */}
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
            title="Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-4 gap-4 px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
        {/* Current Period */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: currentColor }} />
            <span className="text-xs text-gray-500">Current</span>
          </div>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            {valueFormatter(stats.currentTotal)}
          </p>
        </div>

        {/* Comparison Period */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: comparisonColor }} />
            <span className="text-xs text-gray-500">Previous</span>
          </div>
          <p className="text-lg font-semibold text-gray-600 dark:text-gray-400">
            {valueFormatter(stats.comparisonTotal)}
          </p>
        </div>

        {/* Absolute Change */}
        <div>
          <span className="text-xs text-gray-500">Change</span>
          <p className={`text-lg font-semibold ${trendColor}`}>
            {stats.absoluteChange >= 0 ? '+' : ''}{valueFormatter(stats.absoluteChange)}
          </p>
        </div>

        {/* Percent Change */}
        {showPercentChange && (
          <div>
            <span className="text-xs text-gray-500">% Change</span>
            <div className={`flex items-center gap-1 text-lg font-semibold ${trendColor}`}>
              <TrendIcon className="w-4 h-4" />
              {stats.percentChange >= 0 ? '+' : ''}{stats.percentChange.toFixed(1)}%
            </div>
          </div>
        )}
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm text-gray-600 dark:text-gray-400">
              Overlay Opacity
            </label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.1"
                value={overlayOpacity}
                onChange={(e) => setOverlayOpacity(Number(e.target.value))}
                className="w-24"
              />
              <span className="text-sm text-gray-500 w-8">
                {Math.round(overlayOpacity * 100)}%
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600 dark:text-gray-400">Current:</label>
              <input
                type="color"
                value={currentColor}
                onChange={() => {}}
                className="w-6 h-6 rounded border border-gray-300"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600 dark:text-gray-400">Comparison:</label>
              <input
                type="color"
                value={comparisonColor}
                onChange={() => {}}
                className="w-6 h-6 rounded border border-gray-300"
              />
            </div>
          </div>
        </div>
      )}

      {/* Chart */}
      <div className="p-4">
        {renderChart(series, { showOverlay, overlayOpacity })}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 px-4 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: currentColor }} />
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {currentPeriod.label}
          </span>
        </div>
        {showOverlay && (
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: comparisonColor, opacity: overlayOpacity }}
            />
            <span className="text-sm text-gray-500">
              {comparisonPeriod.label}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

// Comparison summary card
interface ComparisonCardProps {
  label: string;
  currentValue: number;
  previousValue: number;
  valueFormatter?: (value: number) => string;
  icon?: React.ReactNode;
  className?: string;
}

export function ComparisonCard({
  label,
  currentValue,
  previousValue,
  valueFormatter = (v) => v.toLocaleString(),
  icon,
  className = '',
}: ComparisonCardProps) {
  const change = previousValue !== 0
    ? ((currentValue - previousValue) / previousValue) * 100
    : 0;

  const TrendIcon = change > 0 ? TrendingUp : change < 0 ? TrendingDown : Minus;
  const trendColor = change > 0 ? 'text-green-500' : change < 0 ? 'text-red-500' : 'text-gray-400';
  const trendBg = change > 0 ? 'bg-green-50 dark:bg-green-900/20' : change < 0 ? 'bg-red-50 dark:bg-red-900/20' : 'bg-gray-50 dark:bg-gray-800';

  return (
    <div className={`p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 ${className}`}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {valueFormatter(currentValue)}
          </p>
        </div>
        {icon && (
          <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600">
            {icon}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500">
          vs {valueFormatter(previousValue)}
        </span>
        <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-sm ${trendBg} ${trendColor}`}>
          <TrendIcon className="w-3 h-3" />
          {change >= 0 ? '+' : ''}{change.toFixed(1)}%
        </div>
      </div>
    </div>
  );
}

// Hook for period comparison
export function usePeriodComparison(initialPeriod?: TimePeriod) {
  const [currentPeriod, setCurrentPeriod] = useState<TimePeriod>(
    initialPeriod || {
      start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      end: new Date(),
      label: 'Current Period',
    }
  );

  const [comparisonPreset, setComparisonPreset] = useState<ComparisonPreset>('previous_period');

  const comparisonPeriod = useMemo(
    () => getComparisonPeriod(currentPeriod, comparisonPreset),
    [currentPeriod, comparisonPreset]
  );

  const setPreset = useCallback((preset: ComparisonPreset) => {
    setComparisonPreset(preset);
  }, []);

  const setPeriod = useCallback((period: TimePeriod) => {
    setCurrentPeriod(period);
  }, []);

  return {
    currentPeriod,
    comparisonPeriod,
    comparisonPreset,
    setPreset,
    setPeriod,
  };
}

export { getComparisonPeriod, calculateStats, presetLabels };
export type { TimePeriod, ComparisonDataPoint, ComparisonSeries, ComparisonStats, ComparisonPreset, ComparisonCardProps };

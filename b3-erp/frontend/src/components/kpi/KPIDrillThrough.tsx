'use client';

import React, { useState, useMemo } from 'react';
import {
  X,
  TrendingUp,
  TrendingDown,
  Minus,
  ChevronRight,
  ChevronDown,
  BarChart3,
  PieChart,
  Table,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  Download,
  ExternalLink,
} from 'lucide-react';
import { Sparkline } from './KPICard';

// Types
export interface ContributingFactor {
  id: string;
  name: string;
  value: number;
  contribution: number; // percentage contribution to total
  trend?: number; // percentage change
  previousValue?: number;
  children?: ContributingFactor[];
  metadata?: Record<string, any>;
  link?: string;
}

export interface KPIDrillThroughProps {
  isOpen: boolean;
  onClose: () => void;
  kpiName: string;
  kpiValue: number | string;
  kpiChange?: number;
  kpiUnit?: string;
  factors: ContributingFactor[];
  sparklineData?: { value: number }[];
  dateRange?: { start: Date; end: Date };
  onFactorClick?: (factor: ContributingFactor) => void;
  onExport?: () => void;
  valueFormatter?: (value: number) => string;
  className?: string;
}

// Factor row component
interface FactorRowProps {
  factor: ContributingFactor;
  depth: number;
  totalValue: number;
  onExpand: (factorId: string) => void;
  expandedIds: Set<string>;
  onClick?: (factor: ContributingFactor) => void;
  valueFormatter: (value: number) => string;
}

function FactorRow({
  factor,
  depth,
  totalValue,
  onExpand,
  expandedIds,
  onClick,
  valueFormatter,
}: FactorRowProps) {
  const hasChildren = factor.children && factor.children.length > 0;
  const isExpanded = expandedIds.has(factor.id);

  const TrendIcon = factor.trend && factor.trend > 0
    ? TrendingUp
    : factor.trend && factor.trend < 0
      ? TrendingDown
      : Minus;

  const trendColor = factor.trend && factor.trend > 0
    ? 'text-green-500'
    : factor.trend && factor.trend < 0
      ? 'text-red-500'
      : 'text-gray-400';

  // Calculate bar width based on contribution
  const barWidth = Math.min(100, Math.max(5, factor.contribution));

  return (
    <>
      <tr
        className={`hover:bg-gray-50 dark:hover:bg-gray-800 ${onClick ? 'cursor-pointer' : ''}`}
        onClick={() => onClick?.(factor)}
      >
        <td className="px-4 py-3">
          <div className="flex items-center" style={{ paddingLeft: `${depth * 20}px` }}>
            {hasChildren && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onExpand(factor.id);
                }}
                className="p-1 mr-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              >
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </button>
            )}
            {!hasChildren && <span className="w-6 mr-2" />}
            <span className="font-medium text-gray-900 dark:text-white">
              {factor.name}
            </span>
            {factor.link && (
              <ExternalLink className="w-3 h-3 ml-2 text-gray-400" />
            )}
          </div>
        </td>
        <td className="px-4 py-3 text-right font-medium text-gray-900 dark:text-white">
          {valueFormatter(factor.value)}
        </td>
        <td className="px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex-1 h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full"
                style={{ width: `${barWidth}%` }}
              />
            </div>
            <span className="text-sm text-gray-500 w-12 text-right">
              {factor.contribution.toFixed(1)}%
            </span>
          </div>
        </td>
        <td className="px-4 py-3">
          {factor.trend !== undefined && (
            <div className={`flex items-center gap-1 ${trendColor}`}>
              <TrendIcon className="w-4 h-4" />
              <span className="text-sm">
                {factor.trend >= 0 ? '+' : ''}{factor.trend.toFixed(1)}%
              </span>
            </div>
          )}
        </td>
      </tr>
      {isExpanded && hasChildren && factor.children?.map(child => (
        <FactorRow
          key={child.id}
          factor={child}
          depth={depth + 1}
          totalValue={totalValue}
          onExpand={onExpand}
          expandedIds={expandedIds}
          onClick={onClick}
          valueFormatter={valueFormatter}
        />
      ))}
    </>
  );
}

// Main component
export function KPIDrillThrough({
  isOpen,
  onClose,
  kpiName,
  kpiValue,
  kpiChange,
  kpiUnit,
  factors,
  sparklineData,
  dateRange,
  onFactorClick,
  onExport,
  valueFormatter = (v) => v.toLocaleString(),
  className = '',
}: KPIDrillThroughProps) {
  const [viewMode, setViewMode] = useState<'table' | 'chart'>('table');
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState<'value' | 'contribution' | 'trend'>('contribution');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Calculate total value
  const totalValue = useMemo(() => {
    return factors.reduce((sum, f) => sum + f.value, 0);
  }, [factors]);

  // Sort factors
  const sortedFactors = useMemo(() => {
    return [...factors].sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'value':
          comparison = a.value - b.value;
          break;
        case 'contribution':
          comparison = a.contribution - b.contribution;
          break;
        case 'trend':
          comparison = (a.trend || 0) - (b.trend || 0);
          break;
      }
      return sortOrder === 'desc' ? -comparison : comparison;
    });
  }, [factors, sortBy, sortOrder]);

  // Toggle expand
  const toggleExpand = (factorId: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(factorId)) {
        next.delete(factorId);
      } else {
        next.add(factorId);
      }
      return next;
    });
  };

  // Toggle sort
  const handleSort = (column: typeof sortBy) => {
    if (sortBy === column) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  // Trend color
  const trendColor = kpiChange && kpiChange > 0
    ? 'text-green-500'
    : kpiChange && kpiChange < 0
      ? 'text-red-500'
      : 'text-gray-400';

  const TrendIcon = kpiChange && kpiChange > 0
    ? ArrowUpRight
    : kpiChange && kpiChange < 0
      ? ArrowDownRight
      : Minus;

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-4 md:inset-8 z-50 flex items-center justify-center">
        <div
          className={`w-full max-w-4xl max-h-full bg-white dark:bg-gray-900 rounded-xl shadow-2xl overflow-hidden flex flex-col ${className}`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-start justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex-1">
              <div className="flex items-center gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {kpiName}
                  </h2>
                  {dateRange && (
                    <p className="text-sm text-gray-500">
                      {dateRange.start.toLocaleDateString()} - {dateRange.end.toLocaleDateString()}
                    </p>
                  )}
                </div>
                {sparklineData && sparklineData.length > 0 && (
                  <Sparkline
                    data={sparklineData}
                    width={120}
                    height={40}
                    color={kpiChange && kpiChange >= 0 ? '#10B981' : '#EF4444'}
                    showArea
                  />
                )}
              </div>

              {/* KPI Value */}
              <div className="flex items-end gap-4 mt-3">
                <div className="text-3xl font-bold text-gray-900 dark:text-white">
                  {typeof kpiValue === 'number' ? valueFormatter(kpiValue) : kpiValue}
                  {kpiUnit && <span className="text-lg text-gray-500 ml-1">{kpiUnit}</span>}
                </div>
                {kpiChange !== undefined && (
                  <div className={`flex items-center gap-1 ${trendColor}`}>
                    <TrendIcon className="w-5 h-5" />
                    <span className="text-lg font-medium">
                      {kpiChange >= 0 ? '+' : ''}{kpiChange.toFixed(1)}%
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* View Mode Toggle */}
              <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-0.5">
                <button
                  onClick={() => setViewMode('table')}
                  className={`p-1.5 rounded ${
                    viewMode === 'table'
                      ? 'bg-white dark:bg-gray-700 shadow-sm'
                      : 'text-gray-500'
                  }`}
                >
                  <Table className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('chart')}
                  className={`p-1.5 rounded ${
                    viewMode === 'chart'
                      ? 'bg-white dark:bg-gray-700 shadow-sm'
                      : 'text-gray-500'
                  }`}
                >
                  <BarChart3 className="w-4 h-4" />
                </button>
              </div>

              {onExport && (
                <button
                  onClick={onExport}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                >
                  <Download className="w-4 h-4" />
                </button>
              )}

              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-auto">
            {viewMode === 'table' ? (
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-800 sticky top-0">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-400">
                      Factor
                    </th>
                    <th
                      className="px-4 py-3 text-right text-sm font-medium text-gray-600 dark:text-gray-400 cursor-pointer hover:text-gray-900 dark:hover:text-white"
                      onClick={() => handleSort('value')}
                    >
                      Value {sortBy === 'value' && (sortOrder === 'desc' ? '↓' : '↑')}
                    </th>
                    <th
                      className="px-4 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-400 cursor-pointer hover:text-gray-900 dark:hover:text-white"
                      onClick={() => handleSort('contribution')}
                    >
                      Contribution {sortBy === 'contribution' && (sortOrder === 'desc' ? '↓' : '↑')}
                    </th>
                    <th
                      className="px-4 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-400 cursor-pointer hover:text-gray-900 dark:hover:text-white"
                      onClick={() => handleSort('trend')}
                    >
                      Trend {sortBy === 'trend' && (sortOrder === 'desc' ? '↓' : '↑')}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {sortedFactors.map(factor => (
                    <FactorRow
                      key={factor.id}
                      factor={factor}
                      depth={0}
                      totalValue={totalValue}
                      onExpand={toggleExpand}
                      expandedIds={expandedIds}
                      onClick={onFactorClick}
                      valueFormatter={valueFormatter}
                    />
                  ))}
                </tbody>
                <tfoot className="bg-gray-50 dark:bg-gray-800 border-t-2 border-gray-200 dark:border-gray-700">
                  <tr>
                    <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white">
                      Total
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-gray-900 dark:text-white">
                      {valueFormatter(totalValue)}
                    </td>
                    <td className="px-4 py-3 text-gray-500">100%</td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            ) : (
              // Chart View
              <div className="p-6">
                <div className="space-y-3">
                  {sortedFactors.map(factor => (
                    <div
                      key={factor.id}
                      className={`${onFactorClick ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800' : ''} p-3 rounded-lg`}
                      onClick={() => onFactorClick?.(factor)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900 dark:text-white">
                          {factor.name}
                        </span>
                        <div className="flex items-center gap-4">
                          <span className="text-gray-600 dark:text-gray-400">
                            {valueFormatter(factor.value)}
                          </span>
                          <span className="text-sm text-gray-500 w-16 text-right">
                            {factor.contribution.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                      <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 rounded-full transition-all"
                          style={{ width: `${factor.contribution}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-3 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 text-sm text-gray-500">
            {factors.length} contributing factors • Click on a row to explore further
          </div>
        </div>
      </div>
    </>
  );
}

// Hook for drill-through state
export function useKPIDrillThrough() {
  const [state, setState] = useState<{
    isOpen: boolean;
    kpiId: string | null;
  }>({
    isOpen: false,
    kpiId: null,
  });

  const open = (kpiId: string) => {
    setState({ isOpen: true, kpiId });
  };

  const close = () => {
    setState({ isOpen: false, kpiId: null });
  };

  return {
    ...state,
    open,
    close,
  };
}

export type { FactorRowProps };

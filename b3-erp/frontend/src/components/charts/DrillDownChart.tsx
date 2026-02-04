'use client';

import React, { useState, useCallback, useMemo } from 'react';
import {
  ChevronRight,
  ChevronLeft,
  Home,
  ArrowLeft,
  Table,
  X,
  Download,
  Filter,
} from 'lucide-react';

// Types
export interface DrillDownLevel {
  id: string;
  label: string;
  field: string;
  parentValue?: string;
}

export interface DrillDownDataPoint {
  id: string;
  label: string;
  value: number;
  color?: string;
  children?: DrillDownDataPoint[];
  metadata?: Record<string, unknown>;
}

export interface DrillDownPath {
  level: DrillDownLevel;
  value: string;
  label: string;
}

export interface DrillDownChartProps {
  data: DrillDownDataPoint[];
  levels: DrillDownLevel[];
  title?: string;
  onDrillDown?: (path: DrillDownPath[], data: DrillDownDataPoint[]) => void;
  onDataPointClick?: (point: DrillDownDataPoint, path: DrillDownPath[]) => void;
  renderChart: (data: DrillDownDataPoint[], onPointClick: (point: DrillDownDataPoint) => void) => React.ReactNode;
  renderDetailView?: (point: DrillDownDataPoint, path: DrillDownPath[]) => React.ReactNode;
  showBreadcrumb?: boolean;
  showDataTable?: boolean;
  className?: string;
}

export function DrillDownChart({
  data,
  levels,
  title,
  onDrillDown,
  onDataPointClick,
  renderChart,
  renderDetailView,
  showBreadcrumb = true,
  showDataTable = false,
  className = '',
}: DrillDownChartProps) {
  const [drillPath, setDrillPath] = useState<DrillDownPath[]>([]);
  const [selectedPoint, setSelectedPoint] = useState<DrillDownDataPoint | null>(null);
  const [showTable, setShowTable] = useState(showDataTable);

  // Get current data based on drill path
  const currentData = useMemo(() => {
    let result = data;

    for (const pathItem of drillPath) {
      const parent = result.find(d => d.id === pathItem.value || d.label === pathItem.label);
      if (parent?.children) {
        result = parent.children;
      } else {
        break;
      }
    }

    return result;
  }, [data, drillPath]);

  // Current level
  const currentLevel = useMemo(() => {
    return levels[drillPath.length] || levels[levels.length - 1];
  }, [levels, drillPath]);

  // Can drill deeper
  const canDrillDown = drillPath.length < levels.length - 1;

  // Handle point click
  const handlePointClick = useCallback((point: DrillDownDataPoint) => {
    onDataPointClick?.(point, drillPath);

    if (canDrillDown && point.children && point.children.length > 0) {
      const newPath = [
        ...drillPath,
        {
          level: currentLevel,
          value: point.id,
          label: point.label,
        },
      ];
      setDrillPath(newPath);
      onDrillDown?.(newPath, point.children);
    } else {
      // Show detail view for leaf nodes
      setSelectedPoint(point);
    }
  }, [canDrillDown, drillPath, currentLevel, onDrillDown, onDataPointClick]);

  // Navigate back
  const handleBack = useCallback(() => {
    if (drillPath.length > 0) {
      const newPath = drillPath.slice(0, -1);
      setDrillPath(newPath);
      onDrillDown?.(newPath, currentData);
    }
  }, [drillPath, currentData, onDrillDown]);

  // Navigate to specific level
  const handleNavigateToLevel = useCallback((index: number) => {
    const newPath = drillPath.slice(0, index);
    setDrillPath(newPath);
    onDrillDown?.(newPath, currentData);
  }, [drillPath, currentData, onDrillDown]);

  // Reset to root
  const handleReset = useCallback(() => {
    setDrillPath([]);
    onDrillDown?.([], data);
  }, [data, onDrillDown]);

  // Close detail view
  const handleCloseDetail = useCallback(() => {
    setSelectedPoint(null);
  }, []);

  return (
    <div className={`bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <div className="flex items-center gap-3">
          {drillPath.length > 0 && (
            <button
              onClick={handleBack}
              className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
              title="Go back"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}

          <div>
            {title && (
              <h3 className="font-medium text-gray-900 dark:text-white">{title}</h3>
            )}
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {currentLevel.label} • {currentData.length} items
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowTable(!showTable)}
            className={`p-1.5 rounded transition-colors ${
              showTable
                ? 'text-blue-600 bg-blue-100 dark:bg-blue-900/30'
                : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
            title="Toggle data table"
          >
            <Table className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Breadcrumb */}
      {showBreadcrumb && drillPath.length > 0 && (
        <div className="flex items-center gap-1 px-4 py-2 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
          <button
            onClick={handleReset}
            className="flex items-center gap-1 px-2 py-1 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
          >
            <Home className="w-3 h-3" />
            All
          </button>

          {drillPath.map((pathItem, index) => (
            <React.Fragment key={index}>
              <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <button
                onClick={() => handleNavigateToLevel(index + 1)}
                className={`px-2 py-1 text-sm rounded transition-colors whitespace-nowrap ${
                  index === drillPath.length - 1
                    ? 'font-medium text-blue-600 bg-blue-50 dark:bg-blue-900/20'
                    : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                }`}
              >
                {pathItem.label}
              </button>
            </React.Fragment>
          ))}
        </div>
      )}

      {/* Chart / Table View */}
      <div className="p-4">
        {showTable ? (
          <DataTable data={currentData} onRowClick={handlePointClick} canDrill={canDrillDown} />
        ) : (
          <div className="relative">
            {renderChart(currentData, handlePointClick)}

            {/* Drill hint */}
            {canDrillDown && (
              <div className="absolute bottom-2 right-2 text-xs text-gray-400 bg-white dark:bg-gray-900 px-2 py-1 rounded shadow">
                Click to drill down
              </div>
            )}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedPoint && renderDetailView && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/50">
          <div className="w-full max-w-2xl max-h-[80vh] bg-white dark:bg-gray-900 rounded-xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-3 py-2 border-b border-gray-200 dark:border-gray-700">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {selectedPoint.label}
                </h3>
                <p className="text-sm text-gray-500">
                  Value: {selectedPoint.value.toLocaleString()}
                </p>
              </div>
              <button
                onClick={handleCloseDetail}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {renderDetailView(selectedPoint, drillPath)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Data Table Component
interface DataTableProps {
  data: DrillDownDataPoint[];
  onRowClick: (point: DrillDownDataPoint) => void;
  canDrill: boolean;
}

function DataTable({ data, onRowClick, canDrill }: DataTableProps) {
  const total = useMemo(() => data.reduce((sum, d) => sum + d.value, 0), [data]);

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-700">
            <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Name</th>
            <th className="text-right py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Value</th>
            <th className="text-right py-3 px-4 font-medium text-gray-600 dark:text-gray-400">%</th>
            {canDrill && (
              <th className="text-center py-3 px-4 font-medium text-gray-600 dark:text-gray-400 w-20"></th>
            )}
          </tr>
        </thead>
        <tbody>
          {data.map((point) => (
            <tr
              key={point.id}
              onClick={() => onRowClick(point)}
              className={`border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 ${
                canDrill ? 'cursor-pointer' : ''
              }`}
            >
              <td className="py-3 px-4">
                <div className="flex items-center gap-3">
                  {point.color && (
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: point.color }}
                    />
                  )}
                  <span className="font-medium text-gray-900 dark:text-white">{point.label}</span>
                </div>
              </td>
              <td className="py-3 px-4 text-right text-gray-700 dark:text-gray-300">
                {point.value.toLocaleString()}
              </td>
              <td className="py-3 px-4 text-right text-gray-500">
                {total > 0 ? ((point.value / total) * 100).toFixed(1) : 0}%
              </td>
              {canDrill && (
                <td className="py-3 px-4 text-center">
                  {point.children && point.children.length > 0 && (
                    <ChevronRight className="w-4 h-4 text-gray-400 inline" />
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="bg-gray-50 dark:bg-gray-800">
            <td className="py-3 px-4 font-semibold text-gray-900 dark:text-white">Total</td>
            <td className="py-3 px-4 text-right font-semibold text-gray-900 dark:text-white">
              {total.toLocaleString()}
            </td>
            <td className="py-3 px-4 text-right font-semibold text-gray-500">100%</td>
            {canDrill && <td></td>}
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

// Hook for managing drill-down state
export function useDrillDown<T extends DrillDownDataPoint>(
  initialData: T[],
  levels: DrillDownLevel[]
) {
  const [path, setPath] = useState<DrillDownPath[]>([]);
  const [_history, setHistory] = useState<{ path: DrillDownPath[]; data: T[] }[]>([]);

  const currentData = useMemo(() => {
    let result = initialData;

    for (const pathItem of path) {
      const parent = result.find(d => d.id === pathItem.value);
      if (parent?.children) {
        result = parent.children as T[];
      }
    }

    return result;
  }, [initialData, path]);

  const currentLevel = levels[path.length] || levels[levels.length - 1];
  const canDrillDown = path.length < levels.length - 1;
  const canGoBack = path.length > 0;

  const drillDown = useCallback((point: T) => {
    if (canDrillDown && point.children) {
      setHistory(prev => [...prev, { path, data: currentData }]);
      setPath(prev => [
        ...prev,
        { level: currentLevel, value: point.id, label: point.label },
      ]);
    }
  }, [canDrillDown, path, currentData, currentLevel]);

  const goBack = useCallback(() => {
    if (canGoBack) {
      setPath(prev => prev.slice(0, -1));
      setHistory(prev => prev.slice(0, -1));
    }
  }, [canGoBack]);

  const goToLevel = useCallback((index: number) => {
    setPath(prev => prev.slice(0, index));
    setHistory(prev => prev.slice(0, index));
  }, []);

  const reset = useCallback(() => {
    setPath([]);
    setHistory([]);
  }, []);

  return {
    path,
    currentData,
    currentLevel,
    canDrillDown,
    canGoBack,
    drillDown,
    goBack,
    goToLevel,
    reset,
  };
}

// DrillDownLevel, DrillDownDataPoint, and DrillDownPath are already exported at their definitions

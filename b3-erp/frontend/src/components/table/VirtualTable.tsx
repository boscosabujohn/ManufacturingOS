'use client';

import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
  memo,
} from 'react';
import {
  ChevronDown,
  ChevronUp,
  ArrowUpDown,
} from 'lucide-react';

// Types
export interface VirtualColumn<T> {
  id: string;
  header: string;
  accessor: keyof T | ((row: T) => React.ReactNode);
  width: number;
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
  renderCell?: (value: any, row: T, rowIndex: number) => React.ReactNode;
}

export interface VirtualTableProps<T> {
  data: T[];
  columns: VirtualColumn<T>[];
  keyField: keyof T;
  height?: number;
  rowHeight?: number;
  overscan?: number;
  className?: string;
  onRowClick?: (row: T) => void;
  sortable?: boolean;
  striped?: boolean;
  headerSticky?: boolean;
}

interface VirtualRowProps<T> {
  row: T;
  columns: VirtualColumn<T>[];
  rowIndex: number;
  style: React.CSSProperties;
  onClick?: (row: T) => void;
  striped: boolean;
}

// Memoized row component for performance
const VirtualRow = memo(function VirtualRow<T extends Record<string, any>>({
  row,
  columns,
  rowIndex,
  style,
  onClick,
  striped,
}: VirtualRowProps<T>) {
  return (
    <div
      className={`flex items-center border-b border-gray-200 dark:border-gray-700 ${
        striped && rowIndex % 2 === 1 ? 'bg-gray-50 dark:bg-gray-800/50' : 'bg-white dark:bg-gray-900'
      } hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${
        onClick ? 'cursor-pointer' : ''
      }`}
      style={style}
      onClick={() => onClick?.(row)}
    >
      {columns.map(column => {
        const value = typeof column.accessor === 'function'
          ? column.accessor(row)
          : row[column.accessor];

        return (
          <div
            key={column.id}
            className={`flex-shrink-0 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 truncate ${
              column.align === 'center' ? 'text-center' : column.align === 'right' ? 'text-right' : 'text-left'
            }`}
            style={{ width: column.width }}
          >
            {column.renderCell
              ? column.renderCell(value, row, rowIndex)
              : value !== null && value !== undefined
                ? String(value)
                : '-'
            }
          </div>
        );
      })}
    </div>
  );
}) as <T extends Record<string, any>>(props: VirtualRowProps<T>) => JSX.Element;

export function VirtualTable<T extends Record<string, any>>({
  data,
  columns,
  keyField,
  height = 500,
  rowHeight = 44,
  overscan = 5,
  className = '',
  onRowClick,
  sortable = true,
  striped = true,
  headerSticky = true,
}: VirtualTableProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [sortConfig, setSortConfig] = useState<{ column: string; direction: 'asc' | 'desc' | null }>({
    column: '',
    direction: null,
  });

  // Handle scroll
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  // Handle sort
  const handleSort = useCallback((columnId: string) => {
    if (!sortable) return;

    setSortConfig(prev => {
      if (prev.column !== columnId) {
        return { column: columnId, direction: 'asc' };
      }
      if (prev.direction === 'asc') {
        return { column: columnId, direction: 'desc' };
      }
      return { column: '', direction: null };
    });
  }, [sortable]);

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortConfig.column || !sortConfig.direction) return data;

    const column = columns.find(c => c.id === sortConfig.column);
    if (!column) return data;

    return [...data].sort((a, b) => {
      const accessor = column.accessor;
      const aValue = typeof accessor === 'function' ? accessor(a) : a[accessor];
      const bValue = typeof accessor === 'function' ? accessor(b) : b[accessor];

      if (aValue === bValue) return 0;
      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      const comparison = aValue < bValue ? -1 : 1;
      return sortConfig.direction === 'asc' ? comparison : -comparison;
    });
  }, [data, sortConfig, columns]);

  // Calculate visible range
  const { visibleRows, startIndex, totalHeight, offsetY } = useMemo(() => {
    const totalHeight = sortedData.length * rowHeight;
    const startIndex = Math.max(0, Math.floor(scrollTop / rowHeight) - overscan);
    const visibleCount = Math.ceil(height / rowHeight) + overscan * 2;
    const endIndex = Math.min(startIndex + visibleCount, sortedData.length);

    return {
      visibleRows: sortedData.slice(startIndex, endIndex),
      startIndex,
      totalHeight,
      offsetY: startIndex * rowHeight,
    };
  }, [sortedData, scrollTop, rowHeight, height, overscan]);

  // Total width for horizontal scroll
  const totalWidth = useMemo(() => {
    return columns.reduce((sum, col) => sum + col.width, 0);
  }, [columns]);

  return (
    <div className={`bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden ${className}`}>
      {/* Header */}
      <div
        className={`flex bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 ${
          headerSticky ? 'sticky top-0 z-10' : ''
        }`}
        style={{ minWidth: totalWidth }}
      >
        {columns.map(column => (
          <div
            key={column.id}
            className={`flex-shrink-0 px-3 py-3 font-semibold text-sm text-gray-700 dark:text-gray-300 ${
              column.align === 'center' ? 'text-center' : column.align === 'right' ? 'text-right' : 'text-left'
            } ${column.sortable !== false && sortable ? 'cursor-pointer select-none hover:bg-gray-100 dark:hover:bg-gray-700' : ''}`}
            style={{ width: column.width }}
            onClick={() => column.sortable !== false && handleSort(column.id)}
          >
            <div className="flex items-center gap-1">
              <span className="truncate">{column.header}</span>
              {sortConfig.column === column.id ? (
                sortConfig.direction === 'asc' ? (
                  <ChevronUp className="w-4 h-4 text-blue-600 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-blue-600 flex-shrink-0" />
                )
              ) : column.sortable !== false && sortable ? (
                <ArrowUpDown className="w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100 flex-shrink-0" />
              ) : null}
            </div>
          </div>
        ))}
      </div>

      {/* Virtual Scroll Container */}
      <div
        ref={containerRef}
        className="overflow-auto"
        style={{ height }}
        onScroll={handleScroll}
      >
        {/* Scroll spacer */}
        <div style={{ height: totalHeight, position: 'relative', minWidth: totalWidth }}>
          {/* Visible rows */}
          <div style={{ position: 'absolute', top: offsetY, left: 0, right: 0 }}>
            {visibleRows.map((row, index) => (
              <VirtualRow
                key={row[keyField]}
                row={row}
                columns={columns}
                rowIndex={startIndex + index}
                style={{ height: rowHeight }}
                onClick={onRowClick}
                striped={striped}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-400">
        <div className="flex items-center justify-between">
          <span>
            Showing {startIndex + 1}-{Math.min(startIndex + visibleRows.length, sortedData.length)} of {sortedData.length.toLocaleString()} rows
          </span>
          <span className="text-xs">
            Virtual scrolling enabled
          </span>
        </div>
      </div>
    </div>
  );
}

export default VirtualTable;

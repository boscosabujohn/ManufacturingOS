'use client';

import React, { useState, useCallback, useMemo } from 'react';
import {
  ChevronDown,
  ChevronUp,
  ChevronRight,
  MoreVertical,
  Check,
  Filter,
  Search,
  Grid,
  List,
  ArrowUpDown,
} from 'lucide-react';

// Types
export interface ResponsiveColumn<T> {
  key: keyof T | string;
  header: string;
  render?: (value: any, row: T, index: number) => React.ReactNode;
  sortable?: boolean;
  priority?: 'high' | 'medium' | 'low'; // high = always show, low = hide on mobile
  width?: string;
  align?: 'left' | 'center' | 'right';
  mobileLabel?: string;
  hideOnMobile?: boolean;
}

export interface ResponsiveTableProps<T> {
  data: T[];
  columns: ResponsiveColumn<T>[];
  keyField: keyof T;
  onRowClick?: (row: T) => void;
  onRowAction?: (action: string, row: T) => void;
  actions?: { id: string; label: string; icon?: React.ReactNode }[];
  emptyMessage?: string;
  loading?: boolean;
  selectable?: boolean;
  selectedRows?: T[];
  onSelectionChange?: (selected: T[]) => void;
  mobileBreakpoint?: number;
  cardRenderer?: (row: T, index: number) => React.ReactNode;
  expandedContent?: (row: T) => React.ReactNode;
  searchable?: boolean;
  searchPlaceholder?: string;
  className?: string;
}

// Custom hook for responsive detection
function useIsMobile(breakpoint: number = 768) {
  const [isMobile, setIsMobile] = useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [breakpoint]);

  return isMobile;
}

export function ResponsiveTable<T extends Record<string, any>>({
  data,
  columns,
  keyField,
  onRowClick,
  onRowAction,
  actions = [],
  emptyMessage = 'No data to display',
  loading = false,
  selectable = false,
  selectedRows = [],
  onSelectionChange,
  mobileBreakpoint = 768,
  cardRenderer,
  expandedContent,
  searchable = false,
  searchPlaceholder = 'Search...',
  className = '',
}: ResponsiveTableProps<T>) {
  const isMobile = useIsMobile(mobileBreakpoint);
  const [expandedRows, setExpandedRows] = useState<Set<any>>(new Set());
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'auto' | 'table' | 'cards'>('auto');
  const [activeActionRow, setActiveActionRow] = useState<any>(null);

  // Determine view mode
  const showCards = viewMode === 'cards' || (viewMode === 'auto' && isMobile);

  // Filter columns for mobile
  const mobileColumns = useMemo(() => {
    return columns.filter(col => !col.hideOnMobile && col.priority !== 'low');
  }, [columns]);

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortColumn) return data;

    return [...data].sort((a, b) => {
      const aVal = a[sortColumn];
      const bVal = b[sortColumn];

      if (aVal === bVal) return 0;
      if (aVal === null || aVal === undefined) return 1;
      if (bVal === null || bVal === undefined) return -1;

      const comparison = aVal < bVal ? -1 : 1;
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [data, sortColumn, sortDirection]);

  // Filter data by search
  const filteredData = useMemo(() => {
    if (!searchQuery) return sortedData;

    const query = searchQuery.toLowerCase();
    return sortedData.filter(row =>
      columns.some(col => {
        const value = row[col.key as keyof T];
        return value != null && String(value).toLowerCase().includes(query);
      })
    );
  }, [sortedData, searchQuery, columns]);

  // Toggle row expansion
  const toggleExpand = useCallback((key: any) => {
    setExpandedRows(prev => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  }, []);

  // Toggle row selection
  const toggleSelection = useCallback((row: T) => {
    if (!onSelectionChange) return;

    const isSelected = selectedRows.some(r => r[keyField] === row[keyField]);
    if (isSelected) {
      onSelectionChange(selectedRows.filter(r => r[keyField] !== row[keyField]));
    } else {
      onSelectionChange([...selectedRows, row]);
    }
  }, [selectedRows, onSelectionChange, keyField]);

  // Select all
  const toggleSelectAll = useCallback(() => {
    if (!onSelectionChange) return;

    if (selectedRows.length === filteredData.length) {
      onSelectionChange([]);
    } else {
      onSelectionChange([...filteredData]);
    }
  }, [selectedRows, filteredData, onSelectionChange]);

  // Handle sort
  const handleSort = useCallback((columnKey: string) => {
    if (sortColumn === columnKey) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(columnKey);
      setSortDirection('asc');
    }
  }, [sortColumn]);

  // Get cell value
  const getCellValue = useCallback((row: T, column: ResponsiveColumn<T>, index: number) => {
    const value = row[column.key as keyof T];
    if (column.render) {
      return column.render(value, row, index);
    }
    return value != null ? String(value) : '-';
  }, []);

  // Render card view
  const renderCard = (row: T, index: number) => {
    if (cardRenderer) {
      return cardRenderer(row, index);
    }

    const rowKey = row[keyField];
    const isExpanded = expandedRows.has(rowKey);
    const isSelected = selectedRows.some(r => r[keyField] === rowKey);

    return (
      <div
        key={String(rowKey)}
        className={`bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden ${
          onRowClick ? 'active:bg-gray-50 dark:active:bg-gray-800' : ''
        } ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
      >
        {/* Card Header */}
        <div
          className="flex items-center gap-3 p-3"
          onClick={() => onRowClick?.(row)}
        >
          {selectable && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleSelection(row);
              }}
              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                isSelected
                  ? 'bg-blue-600 border-blue-600 text-white'
                  : 'border-gray-300 dark:border-gray-600'
              }`}
            >
              {isSelected && <Check className="w-4 h-4" />}
            </button>
          )}

          <div className="flex-1 min-w-0">
            {/* Primary column */}
            {mobileColumns[0] && (
              <p className="font-medium text-gray-900 dark:text-white truncate">
                {getCellValue(row, mobileColumns[0], index)}
              </p>
            )}
            {/* Secondary column */}
            {mobileColumns[1] && (
              <p className="text-sm text-gray-500 truncate">
                {getCellValue(row, mobileColumns[1], index)}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            {expandedContent && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleExpand(rowKey);
                }}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
            )}

            {actions.length > 0 && (
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveActionRow(activeActionRow === rowKey ? null : rowKey);
                  }}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <MoreVertical className="w-5 h-5" />
                </button>

                {activeActionRow === rowKey && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setActiveActionRow(null)} />
                    <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50 py-1">
                      {actions.map(action => (
                        <button
                          key={action.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            onRowAction?.(action.id, row);
                            setActiveActionRow(null);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          {action.icon}
                          {action.label}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            {onRowClick && !expandedContent && (
              <ChevronRight className="w-5 h-5 text-gray-400" />
            )}
          </div>
        </div>

        {/* Card Body - Additional columns */}
        {mobileColumns.length > 2 && (
          <div className="px-4 pb-4 pt-0 grid grid-cols-2 gap-3">
            {mobileColumns.slice(2).map(column => (
              <div key={String(column.key)}>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">
                  {column.mobileLabel || column.header}
                </p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {getCellValue(row, column, index)}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Expanded Content */}
        {isExpanded && expandedContent && (
          <div className="px-4 pb-4 border-t border-gray-200 dark:border-gray-700 pt-4">
            {expandedContent(row)}
          </div>
        )}
      </div>
    );
  };

  // Render table view
  const renderTable = () => (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            {selectable && (
              <th className="w-12 px-4 py-3">
                <button
                  onClick={toggleSelectAll}
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                    selectedRows.length === filteredData.length && filteredData.length > 0
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                >
                  {selectedRows.length === filteredData.length && filteredData.length > 0 && (
                    <Check className="w-3 h-3" />
                  )}
                </button>
              </th>
            )}
            {columns.map(column => (
              <th
                key={String(column.key)}
                className={`px-4 py-3 text-sm font-medium text-gray-600 dark:text-gray-400 ${
                  column.align === 'right' ? 'text-right' : column.align === 'center' ? 'text-center' : 'text-left'
                } ${column.sortable ? 'cursor-pointer hover:text-gray-900 dark:hover:text-white' : ''}`}
                style={{ width: column.width }}
                onClick={() => column.sortable && handleSort(String(column.key))}
              >
                <div className="flex items-center gap-1">
                  {column.header}
                  {column.sortable && (
                    <ArrowUpDown className={`w-4 h-4 ${
                      sortColumn === column.key ? 'text-blue-600' : 'text-gray-400'
                    }`} />
                  )}
                </div>
              </th>
            ))}
            {actions.length > 0 && <th className="w-12"></th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {filteredData.map((row, index) => {
            const rowKey = row[keyField];
            const isSelected = selectedRows.some(r => r[keyField] === rowKey);

            return (
              <tr
                key={String(rowKey)}
                onClick={() => onRowClick?.(row)}
                className={`${onRowClick ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800' : ''} ${
                  isSelected ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                }`}
              >
                {selectable && (
                  <td className="px-4 py-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSelection(row);
                      }}
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                        isSelected
                          ? 'bg-blue-600 border-blue-600 text-white'
                          : 'border-gray-300 dark:border-gray-600'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3" />}
                    </button>
                  </td>
                )}
                {columns.map(column => (
                  <td
                    key={String(column.key)}
                    className={`px-4 py-3 text-sm text-gray-900 dark:text-gray-100 ${
                      column.align === 'right' ? 'text-right' : column.align === 'center' ? 'text-center' : ''
                    }`}
                  >
                    {getCellValue(row, column, index)}
                  </td>
                ))}
                {actions.length > 0 && (
                  <td className="px-4 py-3">
                    <div className="relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveActionRow(activeActionRow === rowKey ? null : rowKey);
                        }}
                        className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>

                      {activeActionRow === rowKey && (
                        <>
                          <div className="fixed inset-0 z-40" onClick={() => setActiveActionRow(null)} />
                          <div className="absolute right-0 top-full mt-1 w-40 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50 py-1">
                            {actions.map(action => (
                              <button
                                key={action.id}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onRowAction?.(action.id, row);
                                  setActiveActionRow(null);
                                }}
                                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                              >
                                {action.icon}
                                {action.label}
                              </button>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className={className}>
      {/* Toolbar */}
      {(searchable || !isMobile) && (
        <div className="flex items-center gap-3 mb-2">
          {searchable && (
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          {!isMobile && (
            <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-0.5">
              <button
                onClick={() => setViewMode('table')}
                className={`p-2 rounded ${
                  viewMode === 'table' || (viewMode === 'auto' && !isMobile)
                    ? 'bg-white dark:bg-gray-700 shadow-sm'
                    : 'text-gray-500'
                }`}
                title="Table view"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('cards')}
                className={`p-2 rounded ${
                  viewMode === 'cards'
                    ? 'bg-white dark:bg-gray-700 shadow-sm'
                    : 'text-gray-500'
                }`}
                title="Card view"
              >
                <Grid className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filteredData.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          {emptyMessage}
        </div>
      ) : showCards ? (
        <div className="space-y-3">
          {filteredData.map((row, index) => renderCard(row, index))}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          {renderTable()}
        </div>
      )}

      {/* Results count */}
      <p className="mt-3 text-sm text-gray-500 text-center">
        {filteredData.length} {filteredData.length === 1 ? 'result' : 'results'}
        {searchQuery && ` for "${searchQuery}"`}
      </p>
    </div>
  );
}

export { useIsMobile };

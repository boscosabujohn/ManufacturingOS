'use client';

import React, { useState, useMemo } from 'react';
import {
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Grid3X3,
  List
} from 'lucide-react';
import { EmptyState } from './EmptyState';
import { TableSkeleton } from './LoadingState';

export interface Column<T = any> {
  id?: string;
  key?: string;
  header?: string | (() => React.ReactNode);
  label?: string;
  accessor?: keyof T | ((row: T) => any);
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
  render?: (value: any, row: T, index: number) => React.ReactNode;
  // Mobile-specific options
  hideOnMobile?: boolean;
  isPrimary?: boolean; // Show prominently in card view
  isSecondary?: boolean; // Show as subtitle in card view
}

export interface ResponsiveDataTableProps<T = any> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  emptyMessage?: string;
  emptyDescription?: string;
  selectable?: boolean;
  onSelectionChange?: (selectedRows: T[]) => void;
  pagination?: {
    enabled: boolean;
    pageSize?: number;
    currentPage?: number;
    onPageChange?: (page: number) => void;
  };
  sorting?: {
    enabled: boolean;
    defaultSort?: { column: string; direction: 'asc' | 'desc' };
  };
  className?: string;
  rowClassName?: string | ((row: T, index: number) => string);
  onRowClick?: (row: T, index: number) => void;
  // Mobile card view options
  cardActions?: {
    onView?: (row: T) => void;
    onEdit?: (row: T) => void;
    onDelete?: (row: T) => void;
    custom?: { icon: React.ReactNode; label: string; onClick: (row: T) => void }[];
  };
  // View mode control
  defaultViewMode?: 'table' | 'card';
  allowViewToggle?: boolean;
  // Card view customization
  cardImageField?: keyof T;
  cardStatusField?: keyof T;
  getCardStatus?: (row: T) => { label: string; color: 'green' | 'yellow' | 'red' | 'blue' | 'gray' };
}

export function ResponsiveDataTable<T extends Record<string, any>>({
  data,
  columns,
  loading = false,
  emptyMessage = 'No data available',
  emptyDescription = 'There are no records to display at this time.',
  selectable = false,
  onSelectionChange,
  pagination,
  sorting,
  className = '',
  rowClassName,
  onRowClick,
  cardActions,
  defaultViewMode = 'table',
  allowViewToggle = true,
  cardImageField,
  cardStatusField,
  getCardStatus
}: ResponsiveDataTableProps<T>) {
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [sortConfig, setSortConfig] = useState<{ column: string; direction: 'asc' | 'desc' } | null>(
    sorting?.defaultSort || null
  );
  const [currentPage, setCurrentPage] = useState(pagination?.currentPage || 1);
  const [viewMode, setViewMode] = useState<'table' | 'card'>(defaultViewMode);
  const [activeCardMenu, setActiveCardMenu] = useState<number | null>(null);

  const pageSize = pagination?.pageSize || 10;

  // Find primary and secondary columns for card view
  const primaryColumn = columns.find(c => c.isPrimary) || columns[0];
  const secondaryColumn = columns.find(c => c.isSecondary) || columns[1];
  const visibleMobileColumns = columns.filter(c => !c.hideOnMobile && !c.isPrimary && !c.isSecondary);

  // Handle sorting
  const sortedData = useMemo(() => {
    if (!sortConfig || !sorting?.enabled) return data;

    const { column, direction } = sortConfig;
    const col = columns.find(c => (c.id || c.key) === column);
    if (!col) return data;

    return [...data].sort((a, b) => {
      const aValue = typeof col.accessor === 'function' ? col.accessor(a) : (col.accessor ? a[col.accessor] : undefined);
      const bValue = typeof col.accessor === 'function' ? col.accessor(b) : (col.accessor ? b[col.accessor] : undefined);

      if (aValue === bValue) return 0;

      const comparison = aValue < bValue ? -1 : 1;
      return direction === 'asc' ? comparison : -comparison;
    });
  }, [data, sortConfig, columns, sorting]);

  // Handle pagination
  const paginatedData = useMemo(() => {
    if (!pagination?.enabled) return sortedData;

    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return sortedData.slice(start, end);
  }, [sortedData, currentPage, pageSize, pagination]);

  const totalPages = pagination?.enabled ? Math.ceil(sortedData.length / pageSize) : 1;

  // Handle sorting
  const handleSort = (columnId: string) => {
    if (!sorting?.enabled) return;

    setSortConfig(current => {
      if (current?.column === columnId) {
        return current.direction === 'asc'
          ? { column: columnId, direction: 'desc' }
          : null;
      }
      return { column: columnId, direction: 'asc' };
    });
  };

  // Handle selection
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(new Set(paginatedData.map((_, i) => i)));
      onSelectionChange?.(paginatedData);
    } else {
      setSelectedRows(new Set());
      onSelectionChange?.([]);
    }
  };

  const handleSelectRow = (index: number, checked: boolean) => {
    const newSelected = new Set(selectedRows);
    if (checked) {
      newSelected.add(index);
    } else {
      newSelected.delete(index);
    }
    setSelectedRows(newSelected);

    const selectedData = Array.from(newSelected).map(i => paginatedData[i]);
    onSelectionChange?.(selectedData);
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    pagination?.onPageChange?.(page);
    setSelectedRows(new Set());
  };

  const getCellValue = (row: T, column: Column<T>) => {
    const accessor = column.accessor || (column.id as keyof T) || (column.key as keyof T);
    return typeof accessor === 'function'
      ? accessor(row)
      : accessor ? row[accessor] : undefined;
  };

  const getColumnHeader = (column: Column<T>): string => {
    if (typeof column.header === 'function') return '';
    return column.header || column.label || '';
  };

  const getRowClassName = (row: T, index: number): string => {
    const baseClass = 'border-b border-gray-200 hover:bg-gray-50 transition-colors';
    const clickableClass = onRowClick ? 'cursor-pointer' : '';
    const customClass = typeof rowClassName === 'function'
      ? rowClassName(row, index)
      : rowClassName || '';

    return `${baseClass} ${clickableClass} ${customClass}`.trim();
  };

  const statusColors = {
    green: 'bg-green-100 text-green-800',
    yellow: 'bg-yellow-100 text-yellow-800',
    red: 'bg-red-100 text-red-800',
    blue: 'bg-blue-100 text-blue-800',
    gray: 'bg-gray-100 text-gray-800'
  };

  if (loading) {
    return <TableSkeleton rows={pageSize} />;
  }

  if (data.length === 0) {
    return (
      <EmptyState
        title={emptyMessage}
        description={emptyDescription}
        size="sm"
      />
    );
  }

  const allSelected = selectedRows.size === paginatedData.length && paginatedData.length > 0;
  const someSelected = selectedRows.size > 0 && selectedRows.size < paginatedData.length;

  return (
    <div className={className}>
      {/* View Toggle & Selection Info */}
      {(allowViewToggle || (selectable && selectedRows.size > 0)) && (
        <div className="flex items-center justify-between mb-4 px-2">
          {selectable && selectedRows.size > 0 && (
            <span className="text-sm text-blue-600 font-medium">
              {selectedRows.size} item{selectedRows.size > 1 ? 's' : ''} selected
            </span>
          )}
          {allowViewToggle && (
            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1 ml-auto">
              <button
                onClick={() => setViewMode('table')}
                className={`p-2 rounded-md transition-colors touch-target ${
                  viewMode === 'table'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                aria-label="Table view"
              >
                <List className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('card')}
                className={`p-2 rounded-md transition-colors touch-target ${
                  viewMode === 'card'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                aria-label="Card view"
              >
                <Grid3X3 className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Table View (Hidden on mobile by default when card view is active) */}
      <div className={`${viewMode === 'card' ? 'hidden md:block' : 'hidden sm:block'}`}>
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {selectable && (
                  <th className="w-12 px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      ref={input => {
                        if (input) input.indeterminate = someSelected;
                      }}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-5 h-5"
                    />
                  </th>
                )}

                {columns.map((column) => {
                  const headerContent = typeof column.header === 'function'
                    ? column.header()
                    : (column.header || column.label);
                  const columnId = column.id || column.key || '';

                  return (
                    <th
                      key={columnId || column.label || (typeof column.header === 'string' ? column.header : '')}
                      className={`px-4 py-3 text-${column.align || 'left'} text-xs font-medium text-gray-700 uppercase tracking-wider ${column.width || ''}`}
                    >
                      {column.sortable && sorting?.enabled ? (
                        <button
                          onClick={() => handleSort(columnId)}
                          className="inline-flex items-center gap-1 hover:text-gray-900 transition-colors group touch-target"
                        >
                          {headerContent}
                          <span className="text-gray-400 group-hover:text-gray-600">
                            {sortConfig && sortConfig.column === columnId ? (
                              sortConfig.direction === 'asc' ? (
                                <ChevronUp className="w-4 h-4" />
                              ) : (
                                <ChevronDown className="w-4 h-4" />
                              )
                            ) : (
                              <ChevronsUpDown className="w-4 h-4" />
                            )}
                          </span>
                        </button>
                      ) : (
                        headerContent
                      )}
                    </th>
                  );
                })}

                {cardActions && (
                  <th className="w-16 px-4 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                )}
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedData.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className={getRowClassName(row, rowIndex)}
                  onClick={() => onRowClick?.(row, rowIndex)}
                >
                  {selectable && (
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedRows.has(rowIndex)}
                        onChange={(e) => {
                          e.stopPropagation();
                          handleSelectRow(rowIndex, e.target.checked);
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-5 h-5"
                      />
                    </td>
                  )}

                  {columns.map((column) => {
                    const value = getCellValue(row, column);
                    const headerKey = typeof column.header === 'string' ? column.header : '';

                    return (
                      <td
                        key={column.id || column.key || column.label || headerKey}
                        className={`px-4 py-3 text-sm text-gray-900 text-${column.align || 'left'}`}
                      >
                        {column.render ? column.render(value, row, rowIndex) : value}
                      </td>
                    );
                  })}

                  {cardActions && (
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {cardActions.onView && (
                          <button
                            onClick={(e) => { e.stopPropagation(); cardActions.onView?.(row); }}
                            className="p-2 text-gray-400 hover:text-blue-600 transition-colors touch-target"
                            aria-label="View"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        )}
                        {cardActions.onEdit && (
                          <button
                            onClick={(e) => { e.stopPropagation(); cardActions.onEdit?.(row); }}
                            className="p-2 text-gray-400 hover:text-green-600 transition-colors touch-target"
                            aria-label="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        )}
                        {cardActions.onDelete && (
                          <button
                            onClick={(e) => { e.stopPropagation(); cardActions.onDelete?.(row); }}
                            className="p-2 text-gray-400 hover:text-red-600 transition-colors touch-target"
                            aria-label="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Card View (Mobile-optimized) */}
      <div className={`${viewMode === 'card' ? 'block md:hidden' : 'block sm:hidden'}`}>
        <div className="space-y-3">
          {paginatedData.map((row, rowIndex) => {
            const primaryValue = getCellValue(row, primaryColumn);
            const secondaryValue = secondaryColumn ? getCellValue(row, secondaryColumn) : null;
            const status = getCardStatus ? getCardStatus(row) :
              (cardStatusField && row[cardStatusField] ? { label: String(row[cardStatusField]), color: 'gray' as const } : null);

            return (
              <div
                key={rowIndex}
                className={`bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden ${
                  onRowClick ? 'cursor-pointer active:bg-gray-50' : ''
                } ${selectedRows.has(rowIndex) ? 'ring-2 ring-blue-500' : ''}`}
                onClick={() => onRowClick?.(row, rowIndex)}
              >
                {/* Card Header */}
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      {selectable && (
                        <input
                          type="checkbox"
                          checked={selectedRows.has(rowIndex)}
                          onChange={(e) => {
                            e.stopPropagation();
                            handleSelectRow(rowIndex, e.target.checked);
                          }}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-5 h-5 mt-1 flex-shrink-0"
                        />
                      )}

                      {cardImageField && row[cardImageField] && (
                        <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                          <img
                            src={String(row[cardImageField])}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}

                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate text-base">
                          {primaryColumn.render
                            ? primaryColumn.render(primaryValue, row, rowIndex)
                            : primaryValue}
                        </h3>
                        {secondaryValue && (
                          <p className="text-sm text-gray-500 mt-0.5 truncate">
                            {secondaryColumn?.render
                              ? secondaryColumn.render(secondaryValue, row, rowIndex)
                              : secondaryValue}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      {status && (
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[status.color]}`}>
                          {status.label}
                        </span>
                      )}

                      {cardActions && (
                        <div className="relative">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveCardMenu(activeCardMenu === rowIndex ? null : rowIndex);
                            }}
                            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors touch-target"
                            aria-label="More actions"
                          >
                            <MoreVertical className="w-5 h-5" />
                          </button>

                          {activeCardMenu === rowIndex && (
                            <>
                              <div
                                className="fixed inset-0 z-10"
                                onClick={(e) => { e.stopPropagation(); setActiveCardMenu(null); }}
                              />
                              <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                                {cardActions.onView && (
                                  <button
                                    onClick={(e) => { e.stopPropagation(); cardActions.onView?.(row); setActiveCardMenu(null); }}
                                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors touch-target"
                                  >
                                    <Eye className="w-4 h-4" />
                                    View Details
                                  </button>
                                )}
                                {cardActions.onEdit && (
                                  <button
                                    onClick={(e) => { e.stopPropagation(); cardActions.onEdit?.(row); setActiveCardMenu(null); }}
                                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors touch-target"
                                  >
                                    <Edit className="w-4 h-4" />
                                    Edit
                                  </button>
                                )}
                                {cardActions.custom?.map((action, i) => (
                                  <button
                                    key={i}
                                    onClick={(e) => { e.stopPropagation(); action.onClick(row); setActiveCardMenu(null); }}
                                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors touch-target"
                                  >
                                    {action.icon}
                                    {action.label}
                                  </button>
                                ))}
                                {cardActions.onDelete && (
                                  <button
                                    onClick={(e) => { e.stopPropagation(); cardActions.onDelete?.(row); setActiveCardMenu(null); }}
                                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors touch-target"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                    Delete
                                  </button>
                                )}
                              </div>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Body - Additional Fields */}
                {visibleMobileColumns.length > 0 && (
                  <div className="px-4 py-3 space-y-2 bg-gray-50">
                    {visibleMobileColumns.slice(0, 4).map((column) => {
                      const value = getCellValue(row, column);
                      const header = getColumnHeader(column);

                      return (
                        <div key={column.id || column.key || header} className="flex justify-between items-center text-sm">
                          <span className="text-gray-500">{header}</span>
                          <span className="text-gray-900 font-medium">
                            {column.render ? column.render(value, row, rowIndex) : value}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Pagination - Touch-friendly */}
      {pagination?.enabled && totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-4 border-t border-gray-200 bg-white mt-4 rounded-lg">
          <div className="text-sm text-gray-600 text-center sm:text-left">
            Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, sortedData.length)} of {sortedData.length}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="inline-flex items-center justify-center gap-1 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium touch-target min-h-[44px]"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Previous</span>
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(totalPages, 3) }, (_, i) => {
                let pageNum: number;
                if (totalPages <= 3) {
                  pageNum = i + 1;
                } else if (currentPage <= 2) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 1) {
                  pageNum = totalPages - 2 + i;
                } else {
                  pageNum = currentPage - 1 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`min-w-[44px] h-11 px-3 rounded-lg text-sm font-medium transition-colors touch-target ${
                      currentPage === pageNum
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 hover:bg-gray-100 border border-gray-300'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="inline-flex items-center justify-center gap-1 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium touch-target min-h-[44px]"
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ResponsiveDataTable;

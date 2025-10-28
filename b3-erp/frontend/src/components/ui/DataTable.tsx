import React, { useState, useMemo } from 'react';
import { ChevronUp, ChevronDown, ChevronsUpDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { EmptyState } from './EmptyState';
import { TableSkeleton } from './LoadingState';

export interface Column<T = any> {
  id?: string;
  key?: string; // Alternative to id for backward compatibility
  header?: string | (() => React.ReactNode);
  label?: string; // Alternative to header for backward compatibility
  accessor?: keyof T | ((row: T) => any);
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
  render?: (value: any, row: T, index: number) => React.ReactNode;
}

export interface DataTableProps<T = any> {
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
}

export function DataTable<T extends Record<string, any>>({
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
  onRowClick
}: DataTableProps<T>) {
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [sortConfig, setSortConfig] = useState<{ column: string; direction: 'asc' | 'desc' } | null>(
    sorting?.defaultSort || null
  );
  const [currentPage, setCurrentPage] = useState(pagination?.currentPage || 1);

  const pageSize = pagination?.pageSize || 10;

  // Handle sorting
  const sortedData = useMemo(() => {
    if (!sortConfig || !sorting?.enabled) return data;

    const { column, direction } = sortConfig;
    const col = columns.find(c => c.id === column);
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
    setSelectedRows(new Set()); // Clear selection on page change
  };

  const getCellValue = (row: T, column: Column<T>) => {
    const accessor = column.accessor || (column.id as keyof T) || (column.key as keyof T);
    return typeof accessor === 'function'
      ? accessor(row)
      : accessor ? row[accessor] : undefined;
  };

  const getRowClassName = (row: T, index: number): string => {
    const baseClass = 'border-b border-gray-200 hover:bg-gray-50 transition-colors';
    const clickableClass = onRowClick ? 'cursor-pointer' : '';
    const customClass = typeof rowClassName === 'function'
      ? rowClassName(row, index)
      : rowClassName || '';

    return `${baseClass} ${clickableClass} ${customClass}`.trim();
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
      <div className="overflow-x-auto">
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
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
              )}

              {columns.map((column) => {
                const headerContent = typeof column.header === 'function'
                  ? column.header()
                  : (column.header || column.label);

                return (
                  <th
                    key={column.id || column.key || column.label || (typeof column.header === 'string' ? column.header : '')}
                    className={`px-4 py-3 text-${column.align || 'left'} text-xs font-medium text-gray-700 uppercase tracking-wider ${column.width || ''}`}
                  >
                    {column.sortable && sorting?.enabled ? (
                      <button
                        onClick={() => handleSort(column.id || column.key || '')}
                        className="inline-flex items-center gap-1 hover:text-gray-900 transition-colors group"
                      >
                        {headerContent}
                        <span className="text-gray-400 group-hover:text-gray-600">
                          {sortConfig && sortConfig.column === (column.id || column.key) ? (
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
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination?.enabled && totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-white">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>
              Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, sortedData.length)} of {sortedData.length} results
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="inline-flex items-center gap-1 px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                let pageNum: number;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      currentPage === pageNum
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
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
              className="inline-flex items-center gap-1 px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DataTable;

'use client';

import React from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';

interface TablePaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  pageSizeOptions?: number[];
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  className?: string;
  showPageSizeSelector?: boolean;
  showItemCount?: boolean;
  showPageJumper?: boolean;
  compact?: boolean;
}

export function TablePagination({
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  pageSizeOptions = [10, 25, 50, 100],
  onPageChange,
  onPageSizeChange,
  className = '',
  showPageSizeSelector = true,
  showItemCount = true,
  showPageJumper = false,
  compact = false,
}: TablePaginationProps) {
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | 'ellipsis')[] = [];
    const maxPagesToShow = compact ? 3 : 5;
    const halfWay = Math.floor(maxPagesToShow / 2);

    if (totalPages <= maxPagesToShow) {
      // Show all pages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else if (currentPage <= halfWay + 1) {
      // Near the start
      for (let i = 1; i <= maxPagesToShow - 1; i++) {
        pages.push(i);
      }
      pages.push('ellipsis');
      pages.push(totalPages);
    } else if (currentPage >= totalPages - halfWay) {
      // Near the end
      pages.push(1);
      pages.push('ellipsis');
      for (let i = totalPages - maxPagesToShow + 2; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // In the middle
      pages.push(1);
      pages.push('ellipsis');
      for (let i = currentPage - halfWay + 1; i <= currentPage + halfWay - 1; i++) {
        pages.push(i);
      }
      pages.push('ellipsis');
      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  if (totalPages <= 1 && !showItemCount && !showPageSizeSelector) {
    return null;
  }

  return (
    <div className={`flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 ${className}`}>
      {/* Left side - Item count and page size */}
      <div className="flex items-center gap-4">
        {showItemCount && (
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Showing <span className="font-medium text-gray-900 dark:text-white">{startItem}</span> to{' '}
            <span className="font-medium text-gray-900 dark:text-white">{endItem}</span> of{' '}
            <span className="font-medium text-gray-900 dark:text-white">{totalItems.toLocaleString()}</span> results
          </span>
        )}

        {showPageSizeSelector && onPageSizeChange && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Rows per page:</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="px-2 py-1 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {pageSizeOptions.map(size => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Right side - Pagination controls */}
      <div className="flex items-center gap-2">
        {/* First page */}
        {!compact && (
          <button
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
            className="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
            title="First page"
          >
            <ChevronsLeft className="w-4 h-4" />
          </button>
        )}

        {/* Previous page */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex items-center gap-1 px-2 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
        >
          <ChevronLeft className="w-4 h-4" />
          {!compact && <span>Previous</span>}
        </button>

        {/* Page numbers */}
        <div className="flex items-center gap-1">
          {pageNumbers.map((page, index) =>
            page === 'ellipsis' ? (
              <span key={`ellipsis-${index}`} className="px-2 text-gray-400">
                ...
              </span>
            ) : (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`min-w-[32px] h-8 px-2 text-sm rounded-md transition-colors ${
                  currentPage === page
                    ? 'bg-blue-600 text-white font-medium'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                {page}
              </button>
            )
          )}
        </div>

        {/* Next page */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex items-center gap-1 px-2 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
        >
          {!compact && <span>Next</span>}
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Last page */}
        {!compact && (
          <button
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages}
            className="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
            title="Last page"
          >
            <ChevronsRight className="w-4 h-4" />
          </button>
        )}

        {/* Page jumper */}
        {showPageJumper && (
          <div className="flex items-center gap-2 ml-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Go to:</span>
            <input
              type="number"
              min={1}
              max={totalPages}
              value={currentPage}
              onChange={(e) => {
                const page = parseInt(e.target.value, 10);
                if (page >= 1 && page <= totalPages) {
                  onPageChange(page);
                }
              }}
              className="w-16 px-2 py-1 text-sm text-center bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}
      </div>
    </div>
  );
}

// Simple pagination hook
export function usePagination<T>(
  data: T[],
  initialPageSize: number = 10
): {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
  paginatedData: T[];
  setCurrentPage: (page: number) => void;
  setPageSize: (size: number) => void;
  goToFirstPage: () => void;
  goToLastPage: () => void;
  goToNextPage: () => void;
  goToPreviousPage: () => void;
} {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(initialPageSize);

  const totalItems = data.length;
  const totalPages = Math.ceil(totalItems / pageSize);

  // Ensure current page is valid
  React.useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const paginatedData = React.useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return data.slice(start, start + pageSize);
  }, [data, currentPage, pageSize]);

  return {
    currentPage,
    pageSize,
    totalPages,
    totalItems,
    paginatedData,
    setCurrentPage,
    setPageSize: (size: number) => {
      setPageSize(size);
      setCurrentPage(1);
    },
    goToFirstPage: () => setCurrentPage(1),
    goToLastPage: () => setCurrentPage(totalPages),
    goToNextPage: () => setCurrentPage(p => Math.min(p + 1, totalPages)),
    goToPreviousPage: () => setCurrentPage(p => Math.max(p - 1, 1)),
  };
}

export type { TablePaginationProps };

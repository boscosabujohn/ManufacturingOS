'use client'

import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react'
import {
  ChevronUp, ChevronDown, ChevronsUpDown, Search, Filter, Download,
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Settings,
  Eye, EyeOff, Copy, Printer, FileDown, X, Check, MoreVertical,
  ArrowUp, ArrowDown, Keyboard, VolumeX, Volume2
} from 'lucide-react'
import { useKeyboardNavigation, useScreenReader } from './Accessibility'

// ============= Enhanced Types with Accessibility =============
export interface AccessibleColumn<T = any> {
  key: string
  header: string
  ariaLabel?: string
  sortable?: boolean
  filterable?: boolean
  width?: string
  align?: 'left' | 'center' | 'right'
  render?: (value: any, row: T, index: number) => React.ReactNode
  format?: 'text' | 'number' | 'currency' | 'date' | 'boolean' | 'badge'
  exportable?: boolean
  visible?: boolean
  description?: string
}

export interface AccessibleDataTableProps<T = any> {
  columns: AccessibleColumn<T>[]
  data: T[]
  pageSize?: number
  searchable?: boolean
  exportable?: boolean
  selectable?: boolean
  onRowClick?: (row: T, index: number) => void
  onSelectionChange?: (selectedRows: T[]) => void
  customActions?: React.ReactNode
  loading?: boolean
  emptyMessage?: string
  ariaLabel?: string
  caption?: string
  keyboardNavigation?: boolean
  announceChanges?: boolean
  rowIdKey?: string
}

// ============= Accessible Data Table Component =============
export function AccessibleDataTable<T extends Record<string, any>>({
  columns: initialColumns,
  data,
  pageSize = 10,
  searchable = true,
  exportable = true,
  selectable = false,
  onRowClick,
  onSelectionChange,
  customActions,
  loading = false,
  emptyMessage = 'No data available',
  ariaLabel = 'Data table',
  caption,
  keyboardNavigation = true,
  announceChanges = true,
  rowIdKey = 'id'
}: AccessibleDataTableProps<T>) {
  const [columns, setColumns] = useState(initialColumns)
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedRows, setSelectedRows] = useState<T[]>([])
  const [showColumnSettings, setShowColumnSettings] = useState(false)
  const [filters, setFilters] = useState<Record<string, any>>({})
  const [showFilters, setShowFilters] = useState(false)
  const [focusedRowIndex, setFocusedRowIndex] = useState(-1)
  const [focusedColumnIndex, setFocusedColumnIndex] = useState(-1)

  const tableRef = useRef<HTMLTableElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const { announce, AnnouncementRegion } = useScreenReader()

  // Enhanced filtering logic
  const filteredData = useMemo(() => {
    let filtered = [...data]

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      filtered = filtered.filter(row =>
        Object.entries(row).some(([key, value]) => {
          const column = columns.find(col => col.key === key)
          if (column && column.visible === false) return false
          return String(value).toLowerCase().includes(searchLower)
        })
      )
    }

    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        filtered = filtered.filter(row =>
          String(row[key]).toLowerCase().includes(String(value).toLowerCase())
        )
      }
    })

    return filtered
  }, [data, searchTerm, filters, columns])

  // Enhanced sorting logic with announcements
  const sortedData = useMemo(() => {
    if (!sortConfig) return filteredData

    const sorted = [...filteredData].sort((a, b) => {
      const aVal = a[sortConfig.key]
      const bVal = b[sortConfig.key]

      if (aVal === null || aVal === undefined) return 1
      if (bVal === null || bVal === undefined) return -1

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal
      }

      const aStr = String(aVal).toLowerCase()
      const bStr = String(bVal).toLowerCase()

      if (aStr < bStr) return sortConfig.direction === 'asc' ? -1 : 1
      if (aStr > bStr) return sortConfig.direction === 'asc' ? 1 : -1
      return 0
    })

    if (announceChanges) {
      const column = columns.find(col => col.key === sortConfig.key)
      announce(
        `Table sorted by ${column?.header || sortConfig.key} in ${sortConfig.direction}ending order. ${sorted.length} rows displayed.`,
        'polite'
      )
    }

    return sorted
  }, [filteredData, sortConfig, columns, announce, announceChanges])

  // Pagination logic
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize
    return sortedData.slice(startIndex, startIndex + pageSize)
  }, [sortedData, currentPage, pageSize])

  const totalPages = Math.ceil(sortedData.length / pageSize)
  const visibleColumns = columns.filter(col => col.visible !== false)

  // Enhanced sorting with accessibility
  const handleSort = useCallback((key: string) => {
    setSortConfig(current => {
      if (!current || current.key !== key) {
        return { key, direction: 'asc' }
      }
      if (current.direction === 'asc') {
        return { key, direction: 'desc' }
      }
      return null
    })

    // Reset focus when sorting changes
    setFocusedRowIndex(-1)
    setFocusedColumnIndex(-1)
  }, [])

  // Enhanced selection with announcements
  const handleSelectAll = useCallback(() => {
    const newSelection = selectedRows.length === paginatedData.length ? [] : paginatedData
    setSelectedRows(newSelection)

    if (announceChanges) {
      const message = newSelection.length === 0
        ? 'All rows deselected'
        : `All ${newSelection.length} rows selected`
      announce(message, 'polite')
    }
  }, [selectedRows.length, paginatedData, announceChanges, announce])

  const handleSelectRow = useCallback((row: T, index: number) => {
    setSelectedRows(current => {
      const rowId = row[rowIdKey]
      const isSelected = current.some(r => r[rowIdKey] === rowId)
      let newSelection: T[]

      if (isSelected) {
        newSelection = current.filter(r => r[rowIdKey] !== rowId)
      } else {
        newSelection = [...current, row]
      }

      if (announceChanges) {
        const action = isSelected ? 'deselected' : 'selected'
        announce(`Row ${index + 1} ${action}. ${newSelection.length} rows selected.`, 'polite')
      }

      return newSelection
    })
  }, [rowIdKey, announceChanges, announce])

  // Keyboard navigation for table
  const handleTableKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (!keyboardNavigation) return

    const { key, ctrlKey, shiftKey } = event
    const maxRowIndex = paginatedData.length - 1
    const maxColIndex = visibleColumns.length - 1

    switch (key) {
      case 'ArrowDown':
        event.preventDefault()
        setFocusedRowIndex(prev => Math.min(prev + 1, maxRowIndex))
        break

      case 'ArrowUp':
        event.preventDefault()
        setFocusedRowIndex(prev => Math.max(prev - 1, -1))
        break

      case 'ArrowRight':
        event.preventDefault()
        if (focusedRowIndex >= 0) {
          setFocusedColumnIndex(prev => Math.min(prev + 1, maxColIndex))
        }
        break

      case 'ArrowLeft':
        event.preventDefault()
        if (focusedRowIndex >= 0) {
          setFocusedColumnIndex(prev => Math.max(prev - 1, 0))
        }
        break

      case 'Home':
        event.preventDefault()
        if (ctrlKey) {
          setFocusedRowIndex(0)
          setFocusedColumnIndex(0)
        } else {
          setFocusedColumnIndex(0)
        }
        break

      case 'End':
        event.preventDefault()
        if (ctrlKey) {
          setFocusedRowIndex(maxRowIndex)
          setFocusedColumnIndex(maxColIndex)
        } else {
          setFocusedColumnIndex(maxColIndex)
        }
        break

      case 'Enter':
      case ' ':
        event.preventDefault()
        if (focusedRowIndex >= 0) {
          const row = paginatedData[focusedRowIndex]
          if (selectable && shiftKey) {
            handleSelectRow(row, focusedRowIndex)
          } else if (onRowClick) {
            onRowClick(row, focusedRowIndex)
          }
        }
        break

      case 'PageDown':
        event.preventDefault()
        if (currentPage < totalPages) {
          setCurrentPage(prev => prev + 1)
          setFocusedRowIndex(0)
          announce(`Page ${currentPage + 1} of ${totalPages}`, 'polite')
        }
        break

      case 'PageUp':
        event.preventDefault()
        if (currentPage > 1) {
          setCurrentPage(prev => prev - 1)
          setFocusedRowIndex(0)
          announce(`Page ${currentPage - 1} of ${totalPages}`, 'polite')
        }
        break
    }
  }, [
    keyboardNavigation, focusedRowIndex, focusedColumnIndex, paginatedData,
    visibleColumns, currentPage, totalPages, selectable, onRowClick,
    handleSelectRow, announce
  ])

  // Search functionality with announcements
  const handleSearch = useCallback((value: string) => {
    setSearchTerm(value)
    setCurrentPage(1)
    setFocusedRowIndex(-1)

    if (announceChanges && value) {
      // Debounced announcement
      const timeoutId = setTimeout(() => {
        const resultCount = filteredData.length
        announce(`Search results: ${resultCount} items found for "${value}"`, 'polite')
      }, 500)

      return () => clearTimeout(timeoutId)
    }
  }, [announceChanges, announce, filteredData.length])

  // Page change with announcements
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page)
    setFocusedRowIndex(-1)

    if (announceChanges) {
      announce(`Page ${page} of ${totalPages}. Showing ${paginatedData.length} items.`, 'polite')
    }
  }, [announceChanges, announce, totalPages, paginatedData.length])

  // Export functionality
  const exportToCSV = useCallback(() => {
    const exportableColumns = columns.filter(col => col.exportable !== false)
    const headers = exportableColumns.map(col => col.header).join(',')

    const rows = sortedData.map(row =>
      exportableColumns.map(col => {
        const value = row[col.key]
        return typeof value === 'string' && value.includes(',')
          ? `"${value}"`
          : String(value || '')
      }).join(',')
    )

    const csvContent = [headers, ...rows].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')

    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', `table-export-${new Date().toISOString().split('T')[0]}.csv`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      if (announceChanges) {
        announce(`Table data exported to CSV file with ${sortedData.length} rows`, 'polite')
      }
    }
  }, [columns, sortedData, announceChanges, announce])

  // Effect for selection change callback
  useEffect(() => {
    onSelectionChange?.(selectedRows)
  }, [selectedRows, onSelectionChange])

  // Focus management
  useEffect(() => {
    if (focusedRowIndex >= 0 && tableRef.current) {
      const row = tableRef.current.rows[focusedRowIndex + 1] // +1 for header
      if (row) {
        const cell = focusedColumnIndex >= 0 ? row.cells[focusedColumnIndex] : row
        if (cell) {
          const focusableElement = cell.querySelector('button, a, input, [tabindex]') as HTMLElement
          if (focusableElement) {
            focusableElement.focus()
          } else {
            cell.focus()
          }
        }
      }
    }
  }, [focusedRowIndex, focusedColumnIndex])

  // Format cell value
  const formatCellValue = (value: any, format?: string) => {
    if (value === null || value === undefined) return '-'

    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD'
        }).format(Number(value) || 0)
      case 'date':
        return new Date(value).toLocaleDateString()
      case 'number':
        return new Intl.NumberFormat().format(Number(value) || 0)
      case 'boolean':
        return value ? 'Yes' : 'No'
      default:
        return String(value)
    }
  }

  if (loading) {
    return (
      <div className="space-y-2" role="status" aria-label="Loading table data">
        <div className="animate-pulse space-y-2">
          <div className="h-10 bg-gray-200 rounded w-1/3"></div>
          <div className="space-y-2">
            {Array.from({ length: pageSize }).map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
        <span className="sr-only">Loading table data, please wait</span>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <AnnouncementRegion />

      {/* Table Header with Search and Actions */}
      <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center justify-between">
        {searchable && (
          <div className="relative flex-1 max-w-md">
            <label htmlFor="table-search" className="sr-only">
              Search table data
            </label>
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              id="table-search"
              ref={searchInputRef}
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              aria-describedby="search-description"
            />
            <div id="search-description" className="sr-only">
              Search across all table columns. Results will be filtered as you type.
            </div>
          </div>
        )}

        <div className="flex items-center gap-2">
          {exportable && (
            <button
              onClick={exportToCSV}
              className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              data-shortcut="export"
              aria-label="Export table data to CSV"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </button>
          )}

          {customActions}

          <button
            onClick={() => setShowColumnSettings(!showColumnSettings)}
            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Toggle column visibility settings"
            aria-expanded={showColumnSettings}
          >
            <Settings className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Column Settings Panel */}
      {showColumnSettings && (
        <div className="bg-white border border-gray-200 rounded-lg p-3" role="dialog" aria-label="Column settings">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Visible Columns</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
            {columns.map((column) => (
              <label key={column.key} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={column.visible !== false}
                  onChange={(e) => {
                    setColumns(prev =>
                      prev.map(col =>
                        col.key === column.key
                          ? { ...col, visible: e.target.checked }
                          : col
                      )
                    )
                  }}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{column.header}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table
          ref={tableRef}
          className="min-w-full divide-y divide-gray-200"
          role="table"
          aria-label={ariaLabel}
          aria-rowcount={sortedData.length}
          onKeyDown={handleTableKeyDown}
          tabIndex={keyboardNavigation ? 0 : -1}
        >
          {caption && <caption className="sr-only">{caption}</caption>}

          <thead className="bg-gray-50">
            <tr role="row">
              {selectable && (
                <th scope="col" className="w-12 px-3 py-2">
                  <input
                    type="checkbox"
                    checked={selectedRows.length === paginatedData.length && paginatedData.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    aria-label="Select all rows"
                  />
                </th>
              )}

              {visibleColumns.map((column, index) => (
                <th
                  key={column.key}
                  scope="col"
                  className={`px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                    column.sortable ? 'cursor-pointer hover:bg-gray-100' : ''
                  } ${column.align === 'center' ? 'text-center' : column.align === 'right' ? 'text-right' : ''}`}
                  style={{ width: column.width }}
                  onClick={column.sortable ? () => handleSort(column.key) : undefined}
                  aria-sort={
                    sortConfig?.key === column.key
                      ? sortConfig.direction === 'asc' ? 'ascending' : 'descending'
                      : column.sortable ? 'none' : undefined
                  }
                  tabIndex={column.sortable ? 0 : -1}
                  onKeyDown={(e) => {
                    if ((e.key === 'Enter' || e.key === ' ') && column.sortable) {
                      e.preventDefault()
                      handleSort(column.key)
                    }
                  }}
                  aria-label={column.ariaLabel || `${column.header} column ${column.sortable ? '(sortable)' : ''}`}
                >
                  <div className="flex items-center gap-2">
                    <span>{column.header}</span>
                    {column.sortable && (
                      <span className="text-gray-400">
                        {sortConfig?.key === column.key ? (
                          sortConfig.direction === 'asc' ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )
                        ) : (
                          <ChevronsUpDown className="h-4 w-4" />
                        )}
                      </span>
                    )}
                  </div>
                  {column.description && (
                    <div className="sr-only">{column.description}</div>
                  )}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan={visibleColumns.length + (selectable ? 1 : 0)}
                  className="px-6 py-12 text-center text-gray-500"
                  role="cell"
                >
                  <div className="flex flex-col items-center">
                    <Search className="h-12 w-12 text-gray-300 mb-2" />
                    <p className="text-lg font-medium">{emptyMessage}</p>
                    {searchTerm && (
                      <p className="text-sm mt-1">
                        Try adjusting your search terms or clearing the search filter.
                      </p>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              paginatedData.map((row, rowIndex) => {
                const isSelected = selectedRows.some(r => r[rowIdKey] === row[rowIdKey])
                const isFocused = focusedRowIndex === rowIndex

                return (
                  <tr
                    key={row[rowIdKey] || rowIndex}
                    role="row"
                    aria-rowindex={rowIndex + 1}
                    aria-selected={selectable ? isSelected : undefined}
                    className={`hover:bg-gray-50 ${isSelected ? 'bg-blue-50' : ''} ${
                      isFocused ? 'ring-2 ring-blue-500 ring-inset' : ''
                    } ${onRowClick ? 'cursor-pointer' : ''}`}
                    onClick={() => onRowClick?.(row, rowIndex)}
                    tabIndex={isFocused ? 0 : -1}
                  >
                    {selectable && (
                      <td className="w-12 px-3 py-2" role="cell">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleSelectRow(row, rowIndex)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          aria-label={`Select row ${rowIndex + 1}`}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </td>
                    )}

                    {visibleColumns.map((column, colIndex) => {
                      const value = row[column.key]
                      const isCellFocused = isFocused && focusedColumnIndex === colIndex

                      return (
                        <td
                          key={column.key}
                          role="cell"
                          className={`px-3 py-2 whitespace-nowrap text-sm ${
                            column.align === 'center' ? 'text-center' :
                            column.align === 'right' ? 'text-right' : 'text-left'
                          } ${isCellFocused ? 'ring-1 ring-blue-500' : ''}`}
                          tabIndex={isCellFocused ? 0 : -1}
                        >
                          {column.render ?
                            column.render(value, row, rowIndex) :
                            formatCellValue(value, column.format)
                          }
                        </td>
                      )
                    })}
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between" role="navigation" aria-label="Table pagination">
          <div className="text-sm text-gray-700">
            Showing {Math.min((currentPage - 1) * pageSize + 1, sortedData.length)} to{' '}
            {Math.min(currentPage * pageSize, sortedData.length)} of {sortedData.length} results
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Go to first page"
            >
              <ChevronsLeft className="h-4 w-4" />
            </button>

            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Go to previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <span className="px-3 py-2 text-sm" aria-live="polite">
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Go to next page"
            >
              <ChevronRight className="h-4 w-4" />
            </button>

            <button
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Go to last page"
            >
              <ChevronsRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Keyboard Navigation Help */}
      {keyboardNavigation && (
        <div className="text-xs text-gray-500 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="flex items-center gap-1">
              <Keyboard className="h-3 w-3" />
              Keyboard navigation enabled
            </span>
            <span>↑↓ Navigate rows</span>
            <span>←→ Navigate columns</span>
            <span>Enter/Space: Activate</span>
            <span>PgUp/PgDn: Change pages</span>
          </div>
        </div>
      )}
    </div>
  )
}
'use client'

import React, { useState, useMemo, useEffect } from 'react'
import {
  ChevronUp, ChevronDown, ChevronsUpDown, Search, Filter, Download,
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Settings,
  Eye, EyeOff, Copy, Printer, FileDown, X, Check, MoreVertical
} from 'lucide-react'

// ============= Types =============
export interface Column<T = any> {
  key: string
  header: string
  sortable?: boolean
  filterable?: boolean
  width?: string
  align?: 'left' | 'center' | 'right'
  render?: (value: any, row: T) => React.ReactNode
  format?: 'text' | 'number' | 'currency' | 'date' | 'boolean' | 'badge'
  exportable?: boolean
  visible?: boolean
}

export interface DataTableProps<T = any> {
  columns: Column<T>[]
  data: T[]
  pageSize?: number
  searchable?: boolean
  exportable?: boolean
  selectable?: boolean
  onRowClick?: (row: T) => void
  onSelectionChange?: (selectedRows: T[]) => void
  customActions?: React.ReactNode
  loading?: boolean
  emptyMessage?: string
}

// ============= Advanced Data Table Component =============
export function DataTable<T extends Record<string, any>>({
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
  emptyMessage = 'No data available'
}: DataTableProps<T>) {
  const [columns, setColumns] = useState(initialColumns)
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedRows, setSelectedRows] = useState<T[]>([])
  const [showColumnSettings, setShowColumnSettings] = useState(false)
  const [filters, setFilters] = useState<Record<string, any>>({})
  const [showFilters, setShowFilters] = useState(false)

  // Filtering logic
  const filteredData = useMemo(() => {
    let filtered = [...data]

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(row =>
        Object.values(row).some(value =>
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    }

    // Apply column filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        filtered = filtered.filter(row =>
          String(row[key]).toLowerCase().includes(String(value).toLowerCase())
        )
      }
    })

    return filtered
  }, [data, searchTerm, filters])

  // Sorting logic
  const sortedData = useMemo(() => {
    if (!sortConfig) return filteredData

    return [...filteredData].sort((a, b) => {
      const aVal = a[sortConfig.key]
      const bVal = b[sortConfig.key]

      if (aVal === null || aVal === undefined) return 1
      if (bVal === null || bVal === undefined) return -1

      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1
      return 0
    })
  }, [filteredData, sortConfig])

  // Pagination logic
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize
    return sortedData.slice(startIndex, startIndex + pageSize)
  }, [sortedData, currentPage, pageSize])

  const totalPages = Math.ceil(sortedData.length / pageSize)

  // Handle sorting
  const handleSort = (key: string) => {
    setSortConfig(current => {
      if (!current || current.key !== key) {
        return { key, direction: 'asc' }
      }
      if (current.direction === 'asc') {
        return { key, direction: 'desc' }
      }
      return null
    })
  }

  // Handle selection
  const handleSelectAll = () => {
    if (selectedRows.length === paginatedData.length) {
      setSelectedRows([])
    } else {
      setSelectedRows(paginatedData)
    }
  }

  const handleSelectRow = (row: T) => {
    setSelectedRows(current => {
      const isSelected = current.some(r => JSON.stringify(r) === JSON.stringify(row))
      if (isSelected) {
        return current.filter(r => JSON.stringify(r) !== JSON.stringify(row))
      }
      return [...current, row]
    })
  }

  useEffect(() => {
    onSelectionChange?.(selectedRows)
  }, [selectedRows, onSelectionChange])

  // Export functionality
  const exportToCSV = () => {
    const exportableColumns = columns.filter(col => col.exportable !== false)
    const headers = exportableColumns.map(col => col.header).join(',')
    const rows = sortedData.map(row =>
      exportableColumns.map(col => {
        const value = row[col.key]
        return typeof value === 'string' && value.includes(',') ? `"${value}"` : value
      }).join(',')
    ).join('\n')

    const csv = `${headers}\n${rows}`
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `export-${Date.now()}.csv`
    a.click()
  }

  const exportToJSON = () => {
    const json = JSON.stringify(sortedData, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `export-${Date.now()}.json`
    a.click()
  }

  const copyToClipboard = () => {
    const exportableColumns = columns.filter(col => col.exportable !== false)
    const headers = exportableColumns.map(col => col.header).join('\t')
    const rows = sortedData.map(row =>
      exportableColumns.map(col => row[col.key]).join('\t')
    ).join('\n')

    const text = `${headers}\n${rows}`
    navigator.clipboard.writeText(text)
  }

  // Column visibility toggle
  const toggleColumnVisibility = (key: string) => {
    setColumns(current =>
      current.map(col =>
        col.key === key ? { ...col, visible: col.visible === false ? true : false } : col
      )
    )
  }

  const visibleColumns = columns.filter(col => col.visible !== false)

  // Render cell content based on format
  const renderCellContent = (column: Column<T>, value: any, row: T) => {
    if (column.render) {
      return column.render(value, row)
    }

    switch (column.format) {
      case 'currency':
        return `$${Number(value).toLocaleString()}`
      case 'number':
        return Number(value).toLocaleString()
      case 'date':
        return new Date(value).toLocaleDateString()
      case 'boolean':
        return value ? <Check className="h-4 w-4 text-green-600" /> : <X className="h-4 w-4 text-red-600" />
      case 'badge':
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700">
            {value}
          </span>
        )
      default:
        return value
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      {/* Table Header */}
      <div className="p-4 border-b">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div className="flex items-center gap-2 flex-1">
            {searchable && (
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2 border rounded-lg hover:bg-gray-50 ${showFilters ? 'bg-gray-100' : ''}`}
            >
              <Filter className="h-4 w-4" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            {customActions}
            {exportable && (
              <div className="relative group">
                <button className="inline-flex items-center gap-1.5 px-3 py-2 border rounded-lg hover:bg-gray-50">
                  <Download className="h-4 w-4 text-gray-600" />
                  <span className="text-gray-700">Export</span>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border hidden group-hover:block z-10">
                  <button
                    onClick={exportToCSV}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                  >
                    <FileDown className="h-4 w-4" />
                    Export as CSV
                  </button>
                  <button
                    onClick={exportToJSON}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                  >
                    <FileDown className="h-4 w-4" />
                    Export as JSON
                  </button>
                  <button
                    onClick={copyToClipboard}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                  >
                    <Copy className="h-4 w-4" />
                    Copy to Clipboard
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                  >
                    <Printer className="h-4 w-4" />
                    Print
                  </button>
                </div>
              </div>
            )}
            <button
              onClick={() => setShowColumnSettings(!showColumnSettings)}
              className="p-2 border rounded-lg hover:bg-gray-50"
            >
              <Settings className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Column Filters */}
        {showFilters && (
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2">
            {visibleColumns.filter(col => col.filterable !== false).map(column => (
              <div key={column.key}>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  {column.header}
                </label>
                <input
                  type="text"
                  placeholder={`Filter ${column.header}`}
                  value={filters[column.key] || ''}
                  onChange={(e) => setFilters({ ...filters, [column.key]: e.target.value })}
                  className="w-full px-3 py-1.5 border rounded text-sm"
                />
              </div>
            ))}
          </div>
        )}

        {/* Column Settings */}
        {showColumnSettings && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Column Visibility</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {columns.map(column => (
                <label key={column.key} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={column.visible !== false}
                    onChange={() => toggleColumnVisibility(column.key)}
                    className="rounded"
                  />
                  <span className="text-sm">{column.header}</span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Table Body */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-gray-50">
              {selectable && (
                <th className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selectedRows.length === paginatedData.length && paginatedData.length > 0}
                    onChange={handleSelectAll}
                    className="rounded"
                  />
                </th>
              )}
              {visibleColumns.map(column => (
                <th
                  key={column.key}
                  className={`px-4 py-3 text-${column.align || 'left'} font-medium text-gray-700`}
                  style={{ width: column.width }}
                >
                  {column.sortable !== false ? (
                    <button
                      onClick={() => handleSort(column.key)}
                      className="inline-flex items-center gap-1 hover:text-gray-900"
                    >
                      {column.header}
                      {sortConfig?.key === column.key ? (
                        sortConfig.direction === 'asc' ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )
                      ) : (
                        <ChevronsUpDown className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  ) : (
                    column.header
                  )}
                </th>
              ))}
              {onRowClick && <th className="px-4 py-3 w-10"></th>}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className={`border-b hover:bg-gray-50 ${onRowClick ? 'cursor-pointer' : ''}`}
                  onClick={() => onRowClick?.(row)}
                >
                  {selectable && (
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedRows.some(r => JSON.stringify(r) === JSON.stringify(row))}
                        onChange={(e) => {
                          e.stopPropagation()
                          handleSelectRow(row)
                        }}
                        onClick={(e) => e.stopPropagation()}
                        className="rounded"
                      />
                    </td>
                  )}
                  {visibleColumns.map(column => (
                    <td
                      key={column.key}
                      className={`px-4 py-3 text-${column.align || 'left'}`}
                    >
                      {renderCellContent(column, row[column.key], row)}
                    </td>
                  ))}
                  {onRowClick && (
                    <td className="px-4 py-3">
                      <MoreVertical className="h-4 w-4 text-gray-400" />
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={visibleColumns.length + (selectable ? 1 : 0) + (onRowClick ? 1 : 0)}
                  className="px-4 py-8 text-center text-gray-500"
                >
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer with Pagination */}
      <div className="p-4 border-t">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="text-sm text-gray-700">
            Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, sortedData.length)} of {sortedData.length} entries
            {selectedRows.length > 0 && (
              <span className="ml-2 text-blue-600">
                ({selectedRows.length} selected)
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="p-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronsLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum
                if (totalPages <= 5) {
                  pageNum = i + 1
                } else if (currentPage <= 3) {
                  pageNum = i + 1
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i
                } else {
                  pageNum = currentPage - 2 + i
                }

                return (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-3 py-1 rounded-lg ${
                      currentPage === pageNum
                        ? 'bg-blue-600 text-white'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    {pageNum}
                  </button>
                )
              })}
            </div>

            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="p-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronsRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
'use client';

import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
  forwardRef,
  useImperativeHandle,
} from 'react';
import {
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Check,
  X,
  Edit2,
  Trash2,
  Download,
  MoreHorizontal,
  Settings,
  GripVertical,
  Eye,
  EyeOff,
  Columns,
  ArrowUpDown,
  Minus,
} from 'lucide-react';

// Types
export type ColumnAlign = 'left' | 'center' | 'right';
export type TableDensity = 'compact' | 'normal' | 'comfortable';
export type SortDirection = 'asc' | 'desc' | null;

export interface Column<T> {
  id: string;
  header: string;
  accessor: keyof T | ((row: T) => React.ReactNode);
  width?: number;
  minWidth?: number;
  maxWidth?: number;
  align?: ColumnAlign;
  sortable?: boolean;
  resizable?: boolean;
  hidden?: boolean;
  fixed?: 'left' | 'right';
  editable?: boolean;
  editType?: 'text' | 'number' | 'select' | 'date';
  editOptions?: { value: string; label: string }[];
  renderCell?: (value: any, row: T, rowIndex: number) => React.ReactNode;
  renderEditCell?: (value: any, onChange: (value: any) => void, row: T) => React.ReactNode;
}

export interface BulkAction<T> {
  id: string;
  label: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'danger';
  onClick: (selectedRows: T[]) => void;
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyField: keyof T;
  className?: string;

  // Features
  selectable?: boolean;
  expandable?: boolean;
  renderExpandedRow?: (row: T) => React.ReactNode;

  // Sorting
  sortable?: boolean;
  defaultSort?: { column: string; direction: SortDirection };
  onSort?: (column: string, direction: SortDirection) => void;

  // Bulk actions
  bulkActions?: BulkAction<T>[];

  // Inline editing
  editable?: boolean;
  onCellEdit?: (rowKey: any, columnId: string, value: any) => void;

  // Column management
  columnVisibilityToggle?: boolean;
  columnReorder?: boolean;
  columnResize?: boolean;

  // Density
  density?: TableDensity;
  densityToggle?: boolean;

  // Virtual scrolling
  virtualScroll?: boolean;
  rowHeight?: number;

  // Events
  onRowClick?: (row: T) => void;
  onSelectionChange?: (selectedKeys: any[]) => void;

  // Styling
  striped?: boolean;
  bordered?: boolean;
  hoverable?: boolean;

  // Loading state
  loading?: boolean;
  emptyMessage?: string;
}

// Storage key for preferences
const STORAGE_PREFIX = 'datatable-prefs-';

// Density configurations
const densityConfig: Record<TableDensity, { rowHeight: number; padding: string; fontSize: string }> = {
  compact: { rowHeight: 32, padding: 'py-1 px-2', fontSize: 'text-xs' },
  normal: { rowHeight: 44, padding: 'py-2 px-3', fontSize: 'text-sm' },
  comfortable: { rowHeight: 56, padding: 'py-3 px-4', fontSize: 'text-sm' },
};

export function DataTable<T extends Record<string, any>>({
  data,
  columns: initialColumns,
  keyField,
  className = '',
  selectable = false,
  expandable = false,
  renderExpandedRow,
  sortable = true,
  defaultSort,
  onSort,
  bulkActions = [],
  editable = false,
  onCellEdit,
  columnVisibilityToggle = true,
  columnReorder = true,
  columnResize = true,
  density: initialDensity = 'normal',
  densityToggle = true,
  virtualScroll = false,
  rowHeight: customRowHeight,
  onRowClick,
  onSelectionChange,
  striped = true,
  bordered = false,
  hoverable = true,
  loading = false,
  emptyMessage = 'No data available',
}: DataTableProps<T>) {
  // State
  const [columns, setColumns] = useState(initialColumns);
  const [selectedRows, setSelectedRows] = useState<Set<any>>(new Set());
  const [expandedRows, setExpandedRows] = useState<Set<any>>(new Set());
  const [sortConfig, setSortConfig] = useState<{ column: string; direction: SortDirection }>(
    defaultSort || { column: '', direction: null }
  );
  const [density, setDensity] = useState<TableDensity>(initialDensity);
  const [editingCell, setEditingCell] = useState<{ rowKey: any; columnId: string } | null>(null);
  const [editValue, setEditValue] = useState<any>(null);
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>({});
  const [showColumnMenu, setShowColumnMenu] = useState(false);
  const [showDensityMenu, setShowDensityMenu] = useState(false);
  const [draggedColumn, setDraggedColumn] = useState<string | null>(null);
  const [resizingColumn, setResizingColumn] = useState<string | null>(null);
  const [resizeStartX, setResizeStartX] = useState(0);
  const [resizeStartWidth, setResizeStartWidth] = useState(0);

  // Refs
  const tableRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLTableSectionElement>(null);

  // Virtual scrolling state
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const actualRowHeight = customRowHeight || densityConfig[density].rowHeight;

  // Initialize column widths
  useEffect(() => {
    const widths: Record<string, number> = {};
    columns.forEach(col => {
      widths[col.id] = col.width || 150;
    });
    setColumnWidths(prev => ({ ...widths, ...prev }));
  }, [columns]);

  // Visible columns
  const visibleColumns = useMemo(() => {
    return columns.filter(col => !col.hidden);
  }, [columns]);

  // Sorted data
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

  // Virtual scrolling calculations
  const virtualScrollData = useMemo(() => {
    if (!virtualScroll) return { visibleData: sortedData, startIndex: 0, endIndex: sortedData.length };

    const containerHeight = containerRef.current?.clientHeight || 500;
    const totalHeight = sortedData.length * actualRowHeight;
    const startIndex = Math.floor(scrollTop / actualRowHeight);
    const visibleCount = Math.ceil(containerHeight / actualRowHeight) + 2;
    const endIndex = Math.min(startIndex + visibleCount, sortedData.length);

    return {
      visibleData: sortedData.slice(startIndex, endIndex),
      startIndex,
      endIndex,
      totalHeight,
      offsetY: startIndex * actualRowHeight,
    };
  }, [virtualScroll, sortedData, scrollTop, actualRowHeight]);

  // Handle selection
  const handleSelectAll = useCallback(() => {
    if (selectedRows.size === data.length) {
      setSelectedRows(new Set());
      onSelectionChange?.([]);
    } else {
      const allKeys = data.map(row => row[keyField]);
      setSelectedRows(new Set(allKeys));
      onSelectionChange?.(allKeys);
    }
  }, [data, keyField, selectedRows.size, onSelectionChange]);

  const handleSelectRow = useCallback((rowKey: any) => {
    setSelectedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(rowKey)) {
        newSet.delete(rowKey);
      } else {
        newSet.add(rowKey);
      }
      onSelectionChange?.(Array.from(newSet));
      return newSet;
    });
  }, [onSelectionChange]);

  // Handle sorting
  const handleSort = useCallback((columnId: string) => {
    setSortConfig(prev => {
      let newDirection: SortDirection;
      if (prev.column !== columnId) {
        newDirection = 'asc';
      } else if (prev.direction === 'asc') {
        newDirection = 'desc';
      } else {
        newDirection = null;
      }
      onSort?.(columnId, newDirection);
      return { column: columnId, direction: newDirection };
    });
  }, [onSort]);

  // Handle expand
  const handleExpandRow = useCallback((rowKey: any) => {
    setExpandedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(rowKey)) {
        newSet.delete(rowKey);
      } else {
        newSet.add(rowKey);
      }
      return newSet;
    });
  }, []);

  // Handle inline editing
  const startEditing = useCallback((rowKey: any, columnId: string, currentValue: any) => {
    setEditingCell({ rowKey, columnId });
    setEditValue(currentValue);
  }, []);

  const saveEdit = useCallback(() => {
    if (editingCell) {
      onCellEdit?.(editingCell.rowKey, editingCell.columnId, editValue);
      setEditingCell(null);
      setEditValue(null);
    }
  }, [editingCell, editValue, onCellEdit]);

  const cancelEdit = useCallback(() => {
    setEditingCell(null);
    setEditValue(null);
  }, []);

  // Handle column visibility
  const toggleColumnVisibility = useCallback((columnId: string) => {
    setColumns(prev => prev.map(col =>
      col.id === columnId ? { ...col, hidden: !col.hidden } : col
    ));
  }, []);

  // Handle column reorder
  const handleDragStart = useCallback((columnId: string) => {
    setDraggedColumn(columnId);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, targetColumnId: string) => {
    e.preventDefault();
    if (!draggedColumn || draggedColumn === targetColumnId) return;

    setColumns(prev => {
      const newColumns = [...prev];
      const draggedIndex = newColumns.findIndex(c => c.id === draggedColumn);
      const targetIndex = newColumns.findIndex(c => c.id === targetColumnId);

      const [removed] = newColumns.splice(draggedIndex, 1);
      newColumns.splice(targetIndex, 0, removed);

      return newColumns;
    });
  }, [draggedColumn]);

  const handleDragEnd = useCallback(() => {
    setDraggedColumn(null);
  }, []);

  // Handle column resize
  const handleResizeStart = useCallback((e: React.MouseEvent, columnId: string) => {
    e.preventDefault();
    setResizingColumn(columnId);
    setResizeStartX(e.clientX);
    setResizeStartWidth(columnWidths[columnId] || 150);
  }, [columnWidths]);

  useEffect(() => {
    if (!resizingColumn) return;

    const handleMouseMove = (e: MouseEvent) => {
      const diff = e.clientX - resizeStartX;
      const column = columns.find(c => c.id === resizingColumn);
      const minWidth = column?.minWidth || 50;
      const maxWidth = column?.maxWidth || 500;
      const newWidth = Math.min(maxWidth, Math.max(minWidth, resizeStartWidth + diff));

      setColumnWidths(prev => ({
        ...prev,
        [resizingColumn]: newWidth,
      }));
    };

    const handleMouseUp = () => {
      setResizingColumn(null);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [resizingColumn, resizeStartX, resizeStartWidth, columns]);

  // Virtual scroll handler
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    if (virtualScroll) {
      setScrollTop(e.currentTarget.scrollTop);
    }
  }, [virtualScroll]);

  // Get cell value
  const getCellValue = useCallback((row: T, column: Column<T>) => {
    if (typeof column.accessor === 'function') {
      return column.accessor(row);
    }
    return row[column.accessor];
  }, []);

  // Render cell content
  const renderCellContent = useCallback((row: T, column: Column<T>, rowIndex: number) => {
    const value = getCellValue(row, column);
    const rowKey = row[keyField];
    const isEditing = editingCell?.rowKey === rowKey && editingCell?.columnId === column.id;

    if (isEditing && column.editable) {
      if (column.renderEditCell) {
        return column.renderEditCell(editValue, setEditValue, row);
      }

      return (
        <div className="flex items-center gap-1">
          {column.editType === 'select' ? (
            <select
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="w-full px-2 py-1 text-sm border border-blue-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            >
              {column.editOptions?.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          ) : (
            <input
              type={column.editType || 'text'}
              value={editValue ?? ''}
              onChange={(e) => setEditValue(column.editType === 'number' ? Number(e.target.value) : e.target.value)}
              className="w-full px-2 py-1 text-sm border border-blue-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') saveEdit();
                if (e.key === 'Escape') cancelEdit();
              }}
            />
          )}
          <button onClick={saveEdit} className="p-1 text-green-600 hover:bg-green-100 rounded">
            <Check className="w-3 h-3" />
          </button>
          <button onClick={cancelEdit} className="p-1 text-red-600 hover:bg-red-100 rounded">
            <X className="w-3 h-3" />
          </button>
        </div>
      );
    }

    if (column.renderCell) {
      return column.renderCell(value, row, rowIndex);
    }

    return (
      <span className="truncate">
        {value !== null && value !== undefined ? String(value) : '-'}
      </span>
    );
  }, [editingCell, editValue, getCellValue, keyField, saveEdit, cancelEdit]);

  const selectedRowsData = useMemo(() => {
    return data.filter(row => selectedRows.has(row[keyField]));
  }, [data, selectedRows, keyField]);

  const densityStyles = densityConfig[density];

  return (
    <div className={`bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden ${className}`}>
      {/* Toolbar */}
      {(bulkActions.length > 0 && selectedRows.size > 0) || columnVisibilityToggle || densityToggle ? (
        <div className="flex items-center justify-between px-4 py-2 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          {/* Bulk Actions */}
          {selectedRows.size > 0 && bulkActions.length > 0 ? (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {selectedRows.size} selected
              </span>
              <div className="h-4 w-px bg-gray-300 dark:bg-gray-600" />
              {bulkActions.map(action => (
                <button
                  key={action.id}
                  onClick={() => action.onClick(selectedRowsData)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md transition-colors ${
                    action.variant === 'danger'
                      ? 'text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {action.icon}
                  {action.label}
                </button>
              ))}
            </div>
          ) : (
            <div />
          )}

          {/* Settings */}
          <div className="flex items-center gap-2">
            {/* Column Visibility */}
            {columnVisibilityToggle && (
              <div className="relative">
                <button
                  onClick={() => setShowColumnMenu(!showColumnMenu)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md"
                >
                  <Columns className="w-4 h-4" />
                  Columns
                </button>
                {showColumnMenu && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowColumnMenu(false)} />
                    <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 py-1">
                      {columns.map(col => (
                        <button
                          key={col.id}
                          onClick={() => toggleColumnVisibility(col.id)}
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          {col.hidden ? (
                            <EyeOff className="w-4 h-4 text-gray-400" />
                          ) : (
                            <Eye className="w-4 h-4 text-blue-600" />
                          )}
                          <span className={col.hidden ? 'text-gray-400' : 'text-gray-700 dark:text-gray-300'}>
                            {col.header}
                          </span>
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Density Toggle */}
            {densityToggle && (
              <div className="relative">
                <button
                  onClick={() => setShowDensityMenu(!showDensityMenu)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md"
                >
                  <Settings className="w-4 h-4" />
                  Density
                </button>
                {showDensityMenu && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowDensityMenu(false)} />
                    <div className="absolute right-0 top-full mt-1 w-40 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 py-1">
                      {(['compact', 'normal', 'comfortable'] as TableDensity[]).map(d => (
                        <button
                          key={d}
                          onClick={() => {
                            setDensity(d);
                            setShowDensityMenu(false);
                          }}
                          className={`w-full flex items-center gap-2 px-3 py-2 text-sm text-left ${
                            density === d
                              ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600'
                              : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                          }`}
                        >
                          {density === d && <Check className="w-4 h-4" />}
                          <span className="capitalize">{d}</span>
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      ) : null}

      {/* Table Container */}
      <div
        ref={containerRef}
        className={`overflow-auto ${virtualScroll ? 'h-[500px]' : ''}`}
        onScroll={handleScroll}
      >
        <div style={virtualScroll ? { height: virtualScrollData.totalHeight, position: 'relative' } : undefined}>
          <table
            className={`w-full ${bordered ? 'border-collapse' : ''}`}
            style={virtualScroll ? { position: 'absolute', top: virtualScrollData.offsetY, width: '100%' } : undefined}
          >
            {/* Header */}
            <thead ref={headerRef} className="bg-gray-50 dark:bg-gray-800 sticky top-0 z-10">
              <tr>
                {/* Selection Column */}
                {selectable && (
                  <th className={`${densityStyles.padding} w-12 border-b border-gray-200 dark:border-gray-700`}>
                    <input
                      type="checkbox"
                      checked={selectedRows.size === data.length && data.length > 0}
                      onChange={handleSelectAll}
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                )}

                {/* Expand Column */}
                {expandable && (
                  <th className={`${densityStyles.padding} w-12 border-b border-gray-200 dark:border-gray-700`} />
                )}

                {/* Data Columns */}
                {visibleColumns.map((column, index) => (
                  <th
                    key={column.id}
                    className={`${densityStyles.padding} ${densityStyles.fontSize} font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700 ${
                      column.align === 'center' ? 'text-center' : column.align === 'right' ? 'text-right' : 'text-left'
                    } ${draggedColumn === column.id ? 'opacity-50' : ''}`}
                    style={{ width: columnWidths[column.id] }}
                    draggable={columnReorder}
                    onDragStart={() => handleDragStart(column.id)}
                    onDragOver={(e) => handleDragOver(e, column.id)}
                    onDragEnd={handleDragEnd}
                  >
                    <div className="flex items-center gap-1">
                      {columnReorder && (
                        <GripVertical className="w-3 h-3 text-gray-400 cursor-grab flex-shrink-0" />
                      )}
                      <span
                        className={`flex-1 ${column.sortable !== false && sortable ? 'cursor-pointer select-none' : ''}`}
                        onClick={() => column.sortable !== false && sortable && handleSort(column.id)}
                      >
                        {column.header}
                      </span>
                      {sortConfig.column === column.id && sortConfig.direction && (
                        sortConfig.direction === 'asc' ? (
                          <ChevronUp className="w-4 h-4 text-blue-600" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-blue-600" />
                        )
                      )}
                      {columnResize && column.resizable !== false && (
                        <div
                          className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-blue-500 group"
                          onMouseDown={(e) => handleResizeStart(e, column.id)}
                        />
                      )}
                    </div>
                  </th>
                ))}

                {/* Actions Column */}
                {editable && (
                  <th className={`${densityStyles.padding} w-20 border-b border-gray-200 dark:border-gray-700`} />
                )}
              </tr>
            </thead>

            {/* Body */}
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={visibleColumns.length + (selectable ? 1 : 0) + (expandable ? 1 : 0) + (editable ? 1 : 0)}
                    className="text-center py-12"
                  >
                    <div className="flex items-center justify-center gap-2 text-gray-500">
                      <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
                      Loading...
                    </div>
                  </td>
                </tr>
              ) : (virtualScroll ? virtualScrollData.visibleData : sortedData).length === 0 ? (
                <tr>
                  <td
                    colSpan={visibleColumns.length + (selectable ? 1 : 0) + (expandable ? 1 : 0) + (editable ? 1 : 0)}
                    className="text-center py-12 text-gray-500 dark:text-gray-400"
                  >
                    {emptyMessage}
                  </td>
                </tr>
              ) : (
                (virtualScroll ? virtualScrollData.visibleData : sortedData).map((row, rowIndex) => {
                  const rowKey = row[keyField];
                  const isSelected = selectedRows.has(rowKey);
                  const isExpanded = expandedRows.has(rowKey);
                  const actualRowIndex = virtualScroll ? virtualScrollData.startIndex + rowIndex : rowIndex;

                  return (
                    <React.Fragment key={rowKey}>
                      <tr
                        className={`
                          ${striped && actualRowIndex % 2 === 1 ? 'bg-gray-50 dark:bg-gray-800/50' : ''}
                          ${hoverable ? 'hover:bg-gray-100 dark:hover:bg-gray-800' : ''}
                          ${isSelected ? 'bg-blue-50 dark:bg-blue-900/20' : ''}
                          ${onRowClick ? 'cursor-pointer' : ''}
                          transition-colors
                        `}
                        onClick={() => onRowClick?.(row)}
                        style={{ height: actualRowHeight }}
                      >
                        {/* Selection Cell */}
                        {selectable && (
                          <td
                            className={`${densityStyles.padding} ${bordered ? 'border border-gray-200 dark:border-gray-700' : 'border-b border-gray-200 dark:border-gray-700'}`}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleSelectRow(rowKey)}
                              className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                          </td>
                        )}

                        {/* Expand Cell */}
                        {expandable && (
                          <td
                            className={`${densityStyles.padding} ${bordered ? 'border border-gray-200 dark:border-gray-700' : 'border-b border-gray-200 dark:border-gray-700'}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleExpandRow(rowKey);
                            }}
                          >
                            <button className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded">
                              {isExpanded ? (
                                <ChevronDown className="w-4 h-4 text-gray-500" />
                              ) : (
                                <ChevronRight className="w-4 h-4 text-gray-500" />
                              )}
                            </button>
                          </td>
                        )}

                        {/* Data Cells */}
                        {visibleColumns.map(column => (
                          <td
                            key={column.id}
                            className={`${densityStyles.padding} ${densityStyles.fontSize} ${
                              bordered ? 'border border-gray-200 dark:border-gray-700' : 'border-b border-gray-200 dark:border-gray-700'
                            } ${
                              column.align === 'center' ? 'text-center' : column.align === 'right' ? 'text-right' : 'text-left'
                            } text-gray-900 dark:text-gray-100`}
                            style={{ width: columnWidths[column.id], maxWidth: columnWidths[column.id] }}
                            onDoubleClick={() => {
                              if (editable && column.editable) {
                                startEditing(rowKey, column.id, getCellValue(row, column));
                              }
                            }}
                          >
                            {renderCellContent(row, column, actualRowIndex)}
                          </td>
                        ))}

                        {/* Actions Cell */}
                        {editable && (
                          <td
                            className={`${densityStyles.padding} ${bordered ? 'border border-gray-200 dark:border-gray-700' : 'border-b border-gray-200 dark:border-gray-700'}`}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">
                              <MoreHorizontal className="w-4 h-4" />
                            </button>
                          </td>
                        )}
                      </tr>

                      {/* Expanded Row */}
                      {expandable && isExpanded && renderExpandedRow && (
                        <tr className="bg-gray-50 dark:bg-gray-800/50">
                          <td
                            colSpan={visibleColumns.length + (selectable ? 1 : 0) + 1 + (editable ? 1 : 0)}
                            className="p-4 border-b border-gray-200 dark:border-gray-700"
                          >
                            {renderExpandedRow(row)}
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer */}
      {data.length > 0 && (
        <div className="flex items-center justify-between px-4 py-2 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-400">
          <span>
            {virtualScroll
              ? `Showing ${virtualScrollData.startIndex + 1}-${Math.min(virtualScrollData.endIndex, data.length)} of ${data.length} rows`
              : `${data.length} rows`
            }
          </span>
          {selectable && selectedRows.size > 0 && (
            <span>{selectedRows.size} selected</span>
          )}
        </div>
      )}
    </div>
  );
}

export default DataTable;

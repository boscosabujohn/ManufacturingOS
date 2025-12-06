'use client';

import React, { useState, useCallback } from 'react';
import {
  Columns,
  Eye,
  EyeOff,
  GripVertical,
  Check,
  RotateCcw,
  Settings,
  X,
} from 'lucide-react';

// Types
export interface ManagedColumn {
  id: string;
  header: string;
  visible: boolean;
  order: number;
  locked?: boolean;
}

interface TableColumnManagerProps {
  columns: ManagedColumn[];
  onChange: (columns: ManagedColumn[]) => void;
  className?: string;
  variant?: 'dropdown' | 'panel';
  allowReorder?: boolean;
  onReset?: () => void;
}

export function TableColumnManager({
  columns,
  onChange,
  className = '',
  variant = 'dropdown',
  allowReorder = true,
  onReset,
}: TableColumnManagerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  // Sort columns by order
  const sortedColumns = [...columns].sort((a, b) => a.order - b.order);

  // Toggle visibility
  const toggleVisibility = useCallback((columnId: string) => {
    onChange(columns.map(col =>
      col.id === columnId && !col.locked ? { ...col, visible: !col.visible } : col
    ));
  }, [columns, onChange]);

  // Show all columns
  const showAll = useCallback(() => {
    onChange(columns.map(col => ({ ...col, visible: true })));
  }, [columns, onChange]);

  // Hide all columns (except locked)
  const hideAll = useCallback(() => {
    onChange(columns.map(col => col.locked ? col : { ...col, visible: false }));
  }, [columns, onChange]);

  // Handle drag reorder
  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === targetIndex) return;

    const newColumns = [...sortedColumns];
    const [dragged] = newColumns.splice(draggedIndex, 1);
    newColumns.splice(targetIndex, 0, dragged);

    // Update order
    const reordered = newColumns.map((col, i) => ({ ...col, order: i }));
    onChange(reordered);
    setDraggedIndex(targetIndex);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const visibleCount = columns.filter(c => c.visible).length;

  if (variant === 'panel') {
    return (
      <div className={`bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 ${className}`}>
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
          <h3 className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
            <Columns className="w-4 h-4" />
            Column Settings
          </h3>
          <div className="flex items-center gap-2">
            <button
              onClick={showAll}
              className="text-xs text-blue-600 hover:text-blue-700"
            >
              Show All
            </button>
            <span className="text-gray-300">|</span>
            <button
              onClick={hideAll}
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              Hide All
            </button>
            {onReset && (
              <>
                <span className="text-gray-300">|</span>
                <button
                  onClick={onReset}
                  className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  Reset
                </button>
              </>
            )}
          </div>
        </div>

        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {sortedColumns.map((column, index) => (
            <div
              key={column.id}
              className={`flex items-center gap-3 px-4 py-2 ${
                draggedIndex === index ? 'opacity-50 bg-blue-50 dark:bg-blue-900/20' : ''
              } ${column.locked ? 'bg-gray-50 dark:bg-gray-800' : ''}`}
              draggable={allowReorder && !column.locked}
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
            >
              {allowReorder && !column.locked && (
                <GripVertical className="w-4 h-4 text-gray-400 cursor-grab flex-shrink-0" />
              )}
              {column.locked && (
                <div className="w-4" />
              )}
              <button
                onClick={() => toggleVisibility(column.id)}
                disabled={column.locked}
                className={`p-1 rounded transition-colors ${
                  column.visible
                    ? 'text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30'
                    : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                } ${column.locked ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {column.visible ? (
                  <Eye className="w-4 h-4" />
                ) : (
                  <EyeOff className="w-4 h-4" />
                )}
              </button>
              <span className={`flex-1 text-sm ${column.visible ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}>
                {column.header}
              </span>
              {column.locked && (
                <span className="text-xs text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">
                  Locked
                </span>
              )}
            </div>
          ))}
        </div>

        <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500">
          {visibleCount} of {columns.length} columns visible
        </div>
      </div>
    );
  }

  // Dropdown variant
  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
      >
        <Columns className="w-4 h-4" />
        Columns
        <span className="text-xs bg-gray-200 dark:bg-gray-700 px-1.5 py-0.5 rounded">
          {visibleCount}/{columns.length}
        </span>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-gray-900 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden">
            <div className="flex items-center justify-between px-3 py-2 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <span className="text-xs font-medium text-gray-500 uppercase">Columns</span>
              <div className="flex items-center gap-1">
                <button onClick={showAll} className="text-xs text-blue-600 hover:underline">All</button>
                <span className="text-gray-300">|</span>
                <button onClick={hideAll} className="text-xs text-gray-500 hover:underline">None</button>
              </div>
            </div>

            <div className="max-h-64 overflow-y-auto py-1">
              {sortedColumns.map((column, index) => (
                <button
                  key={column.id}
                  onClick={() => toggleVisibility(column.id)}
                  disabled={column.locked}
                  className={`w-full flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-800 ${
                    column.locked ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <span className={`w-4 h-4 rounded border flex items-center justify-center ${
                    column.visible
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'border-gray-300 dark:border-gray-600'
                  }`}>
                    {column.visible && <Check className="w-3 h-3" />}
                  </span>
                  <span className={column.visible ? 'text-gray-900 dark:text-white' : 'text-gray-500'}>
                    {column.header}
                  </span>
                </button>
              ))}
            </div>

            {onReset && (
              <div className="px-3 py-2 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => {
                    onReset();
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-1 py-1.5 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                >
                  <RotateCcw className="w-3 h-3" />
                  Reset to Default
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export type { TableColumnManagerProps, ManagedColumn };

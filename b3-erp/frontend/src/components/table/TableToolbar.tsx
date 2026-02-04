'use client';

import React, { useState } from 'react';
import {
  Search,
  Filter,
  Download,
  Upload,
  RefreshCw,
  Plus,
  Settings,
  Columns,
  LayoutGrid,
  List,
  ChevronDown,
  X,
  Check,
  Trash2,
  Edit2,
  Copy,
  MoreHorizontal,
} from 'lucide-react';

// Types
export type TableDensity = 'compact' | 'normal' | 'comfortable';
export type ViewMode = 'table' | 'grid' | 'list';

export interface BulkAction {
  id: string;
  label: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'danger';
  onClick: () => void;
}

interface FilterOption {
  id: string;
  label: string;
  type: 'select' | 'text' | 'date' | 'number';
  options?: { value: string; label: string }[];
  value?: any;
}

interface TableToolbarProps {
  className?: string;

  // Search
  searchable?: boolean;
  searchValue?: string;
  searchPlaceholder?: string;
  onSearchChange?: (value: string) => void;

  // Filters
  filters?: FilterOption[];
  activeFilters?: Record<string, any>;
  onFilterChange?: (filterId: string, value: any) => void;
  onClearFilters?: () => void;

  // Bulk Actions
  selectedCount?: number;
  bulkActions?: BulkAction[];

  // View Options
  showViewToggle?: boolean;
  viewMode?: ViewMode;
  onViewModeChange?: (mode: ViewMode) => void;

  // Density
  showDensityToggle?: boolean;
  density?: TableDensity;
  onDensityChange?: (density: TableDensity) => void;

  // Column Manager
  showColumnManager?: boolean;
  onColumnManagerClick?: () => void;

  // Actions
  onRefresh?: () => void;
  onExport?: () => void;
  onImport?: () => void;
  onCreate?: () => void;
  createLabel?: string;

  // Custom actions
  customActions?: React.ReactNode;
}

export function TableToolbar({
  className = '',
  searchable = true,
  searchValue = '',
  searchPlaceholder = 'Search...',
  onSearchChange,
  filters = [],
  activeFilters = {},
  onFilterChange,
  onClearFilters,
  selectedCount = 0,
  bulkActions = [],
  showViewToggle = false,
  viewMode = 'table',
  onViewModeChange,
  showDensityToggle = true,
  density = 'normal',
  onDensityChange,
  showColumnManager = true,
  onColumnManagerClick,
  onRefresh,
  onExport,
  onImport,
  onCreate,
  createLabel = 'Create New',
  customActions,
}: TableToolbarProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [showDensityMenu, setShowDensityMenu] = useState(false);

  const activeFilterCount = Object.values(activeFilters).filter(v => v !== undefined && v !== '').length;

  // Bulk actions mode
  if (selectedCount > 0 && bulkActions.length > 0) {
    return (
      <div className={`flex items-center justify-between px-4 py-3 bg-blue-50 dark:bg-blue-900/20 border-b border-blue-200 dark:border-blue-800 ${className}`}>
        <div className="flex items-center gap-2">
          <span className="font-medium text-blue-700 dark:text-blue-300">
            {selectedCount} selected
          </span>
          <div className="h-5 w-px bg-blue-300 dark:bg-blue-700" />
          <div className="flex items-center gap-2">
            {bulkActions.map(action => (
              <button
                key={action.id}
                onClick={action.onClick}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  action.variant === 'danger'
                    ? 'text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30'
                    : 'text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/30'
                }`}
              >
                {action.icon}
                {action.label}
              </button>
            ))}
          </div>
        </div>
        <button
          onClick={() => {/* Clear selection */}}
          className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400"
        >
          Clear selection
        </button>
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Main Toolbar */}
      <div className="flex items-center justify-between gap-2">
        {/* Left Side */}
        <div className="flex items-center gap-3 flex-1">
          {/* Search */}
          {searchable && (
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchValue}
                onChange={(e) => onSearchChange?.(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full pl-10 pr-4 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {searchValue && (
                <button
                  onClick={() => onSearchChange?.('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          )}

          {/* Filter Toggle */}
          {filters.length > 0 && (
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg border transition-colors ${
                showFilters || activeFilterCount > 0
                  ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300'
                  : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <Filter className="w-4 h-4" />
              Filters
              {activeFilterCount > 0 && (
                <span className="px-1.5 py-0.5 text-xs bg-blue-600 text-white rounded-full">
                  {activeFilterCount}
                </span>
              )}
            </button>
          )}
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-2">
          {/* Custom Actions */}
          {customActions}

          {/* View Mode Toggle */}
          {showViewToggle && (
            <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
              <button
                onClick={() => onViewModeChange?.('table')}
                className={`p-1.5 rounded ${
                  viewMode === 'table'
                    ? 'bg-white dark:bg-gray-700 shadow text-gray-900 dark:text-white'
                    : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
                title="Table view"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => onViewModeChange?.('grid')}
                className={`p-1.5 rounded ${
                  viewMode === 'grid'
                    ? 'bg-white dark:bg-gray-700 shadow text-gray-900 dark:text-white'
                    : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
                title="Grid view"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Density Toggle */}
          {showDensityToggle && (
            <div className="relative">
              <button
                onClick={() => setShowDensityMenu(!showDensityMenu)}
                className="flex items-center gap-1 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
              >
                <Settings className="w-4 h-4" />
                <ChevronDown className="w-3 h-3" />
              </button>
              {showDensityMenu && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowDensityMenu(false)} />
                  <div className="absolute right-0 top-full mt-1 w-36 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 py-1">
                    <div className="px-3 py-1 text-xs font-medium text-gray-500 uppercase">Density</div>
                    {(['compact', 'normal', 'comfortable'] as TableDensity[]).map(d => (
                      <button
                        key={d}
                        onClick={() => {
                          onDensityChange?.(d);
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

          {/* Column Manager */}
          {showColumnManager && onColumnManagerClick && (
            <button
              onClick={onColumnManagerClick}
              className="flex items-center gap-1 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
            >
              <Columns className="w-4 h-4" />
            </button>
          )}

          {/* Refresh */}
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
              title="Refresh"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          )}

          {/* Export */}
          {onExport && (
            <button
              onClick={onExport}
              className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          )}

          {/* Import */}
          {onImport && (
            <button
              onClick={onImport}
              className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
            >
              <Upload className="w-4 h-4" />
              Import
            </button>
          )}

          {/* Create Button */}
          {onCreate && (
            <button
              onClick={onCreate}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              {createLabel}
            </button>
          )}
        </div>
      </div>

      {/* Filter Row */}
      {showFilters && filters.length > 0 && (
        <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          {filters.map(filter => (
            <div key={filter.id} className="flex items-center gap-2">
              <label className="text-sm text-gray-600 dark:text-gray-400">{filter.label}:</label>
              {filter.type === 'select' ? (
                <select
                  value={activeFilters[filter.id] || ''}
                  onChange={(e) => onFilterChange?.(filter.id, e.target.value || undefined)}
                  className="px-3 py-1.5 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All</option>
                  {filter.options?.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              ) : (
                <input
                  type={filter.type}
                  value={activeFilters[filter.id] || ''}
                  onChange={(e) => onFilterChange?.(filter.id, e.target.value || undefined)}
                  className="px-3 py-1.5 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={`Filter by ${filter.label.toLowerCase()}`}
                />
              )}
            </div>
          ))}
          {activeFilterCount > 0 && (
            <button
              onClick={onClearFilters}
              className="flex items-center gap-1 px-2 py-1 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              <X className="w-3 h-3" />
              Clear
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export type { TableToolbarProps, FilterOption };

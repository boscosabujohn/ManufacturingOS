'use client';

import React, { useState, useCallback, useRef } from 'react';
import {
  GripVertical,
  Maximize2,
  Minimize2,
  Settings,
  X,
  RefreshCw,
  MoreVertical,
  Move,
} from 'lucide-react';

// Types
export type WidgetSize = 'small' | 'medium' | 'large' | 'full';

export interface WidgetConfig {
  id: string;
  type: string;
  title: string;
  size: WidgetSize;
  position: { x: number; y: number };
  settings?: Record<string, any>;
  refreshInterval?: number; // in seconds
}

interface DashboardWidgetProps {
  config: WidgetConfig;
  children: React.ReactNode;
  onRemove?: (id: string) => void;
  onResize?: (id: string, size: WidgetSize) => void;
  onSettings?: (id: string) => void;
  onRefresh?: (id: string) => void;
  onDragStart?: (id: string, e: React.DragEvent) => void;
  onDragEnd?: (id: string) => void;
  isEditing?: boolean;
  isLoading?: boolean;
  error?: string;
  className?: string;
}

// Size configurations
const sizeClasses: Record<WidgetSize, string> = {
  small: 'col-span-1 row-span-1',
  medium: 'col-span-2 row-span-1',
  large: 'col-span-2 row-span-2',
  full: 'col-span-4 row-span-2',
};

const sizeLabels: Record<WidgetSize, string> = {
  small: '1x1',
  medium: '2x1',
  large: '2x2',
  full: '4x2',
};

export function DashboardWidget({
  config,
  children,
  onRemove,
  onResize,
  onSettings,
  onRefresh,
  onDragStart,
  onDragEnd,
  isEditing = false,
  isLoading = false,
  error,
  className = '',
}: DashboardWidgetProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const widgetRef = useRef<HTMLDivElement>(null);

  const handleDragStart = useCallback((e: React.DragEvent) => {
    if (!isEditing) return;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', config.id);
    onDragStart?.(config.id, e);
  }, [config.id, isEditing, onDragStart]);

  const handleDragEnd = useCallback(() => {
    onDragEnd?.(config.id);
  }, [config.id, onDragEnd]);

  const handleResize = useCallback((newSize: WidgetSize) => {
    onResize?.(config.id, newSize);
    setShowMenu(false);
  }, [config.id, onResize]);

  const toggleMaximize = useCallback(() => {
    setIsMaximized(prev => !prev);
  }, []);

  // Maximized view
  if (isMaximized) {
    return (
      <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-8">
        <div className="w-full h-full max-w-7xl bg-white dark:bg-gray-900 rounded-xl shadow-2xl overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
            <h3 className="font-semibold text-gray-900 dark:text-white">{config.title}</h3>
            <div className="flex items-center gap-2">
              {onRefresh && (
                <button
                  onClick={() => onRefresh(config.id)}
                  className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg"
                >
                  <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                </button>
              )}
              <button
                onClick={toggleMaximize}
                className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg"
              >
                <Minimize2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-auto p-6">
            {error ? (
              <div className="h-full flex items-center justify-center text-red-500">
                <p>{error}</p>
              </div>
            ) : (
              children
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={widgetRef}
      className={`${sizeClasses[config.size]} bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden flex flex-col ${
        isEditing ? 'ring-2 ring-blue-500 ring-opacity-50' : ''
      } ${className}`}
      draggable={isEditing}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <div className="flex items-center gap-2">
          {isEditing && (
            <div className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600">
              <GripVertical className="w-4 h-4" />
            </div>
          )}
          <h3 className="font-medium text-sm text-gray-900 dark:text-white truncate">
            {config.title}
          </h3>
        </div>

        <div className="flex items-center gap-1">
          {isLoading && (
            <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />
          )}

          {!isEditing && (
            <>
              {onRefresh && (
                <button
                  onClick={() => onRefresh(config.id)}
                  disabled={isLoading}
                  className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                  title="Refresh"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                onClick={toggleMaximize}
                className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                title="Maximize"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            </>
          )}

          {/* Menu */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
            >
              <MoreVertical className="w-3.5 h-3.5" />
            </button>

            {showMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
                <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50 py-1">
                  {/* Resize options */}
                  {onResize && (
                    <>
                      <div className="px-3 py-1 text-xs font-medium text-gray-500 uppercase">
                        Size
                      </div>
                      <div className="px-2 py-1 flex flex-wrap gap-1">
                        {(['small', 'medium', 'large', 'full'] as WidgetSize[]).map(size => (
                          <button
                            key={size}
                            onClick={() => handleResize(size)}
                            className={`px-2 py-1 text-xs rounded ${
                              config.size === size
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                            }`}
                          >
                            {sizeLabels[size]}
                          </button>
                        ))}
                      </div>
                      <hr className="my-1 border-gray-200 dark:border-gray-700" />
                    </>
                  )}

                  {onSettings && (
                    <button
                      onClick={() => {
                        onSettings(config.id);
                        setShowMenu(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <Settings className="w-4 h-4" />
                      Widget Settings
                    </button>
                  )}

                  {onRefresh && (
                    <button
                      onClick={() => {
                        onRefresh(config.id);
                        setShowMenu(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Refresh Data
                    </button>
                  )}

                  {onRemove && (
                    <>
                      <hr className="my-1 border-gray-200 dark:border-gray-700" />
                      <button
                        onClick={() => {
                          onRemove(config.id);
                          setShowMenu(false);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <X className="w-4 h-4" />
                        Remove Widget
                      </button>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4">
        {error ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <p className="text-red-500 text-sm">{error}</p>
              {onRefresh && (
                <button
                  onClick={() => onRefresh(config.id)}
                  className="mt-2 text-sm text-blue-600 hover:underline"
                >
                  Try again
                </button>
              )}
            </div>
          </div>
        ) : isLoading && !children ? (
          <div className="h-full flex items-center justify-center">
            <RefreshCw className="w-8 h-8 text-gray-300 animate-spin" />
          </div>
        ) : (
          children
        )}
      </div>

      {/* Resize handle (when editing) */}
      {isEditing && (
        <div className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize opacity-0 group-hover:opacity-100">
          <svg viewBox="0 0 16 16" className="w-full h-full text-gray-400">
            <path d="M14 14H10M14 14V10M14 14L8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
      )}
    </div>
  );
}

// Widget wrapper for consistent styling
interface WidgetContentProps {
  children: React.ReactNode;
  centered?: boolean;
  padded?: boolean;
  className?: string;
}

export function WidgetContent({
  children,
  centered = false,
  padded = true,
  className = '',
}: WidgetContentProps) {
  return (
    <div className={`h-full ${centered ? 'flex items-center justify-center' : ''} ${padded ? '' : '-m-4'} ${className}`}>
      {children}
    </div>
  );
}

// Widget stat display
interface WidgetStatProps {
  label: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon?: React.ReactNode;
  color?: 'blue' | 'green' | 'red' | 'yellow' | 'purple';
}

export function WidgetStat({
  label,
  value,
  change,
  changeLabel,
  icon,
  color = 'blue',
}: WidgetStatProps) {
  const colorClasses = {
    blue: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30',
    green: 'text-green-600 bg-green-100 dark:bg-green-900/30',
    red: 'text-red-600 bg-red-100 dark:bg-red-900/30',
    yellow: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30',
    purple: 'text-purple-600 bg-purple-100 dark:bg-purple-900/30',
  };

  return (
    <div className="flex items-start gap-4">
      {icon && (
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          {icon}
        </div>
      )}
      <div className="flex-1">
        <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
        {change !== undefined && (
          <p className={`text-sm mt-1 ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {change >= 0 ? '+' : ''}{change}%
            {changeLabel && <span className="text-gray-500 ml-1">{changeLabel}</span>}
          </p>
        )}
      </div>
    </div>
  );
}

export type { DashboardWidgetProps, WidgetContentProps, WidgetStatProps };

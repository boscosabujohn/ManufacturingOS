'use client';

import React, { useState, useCallback, useEffect, createContext, useContext } from 'react';
import {
  Plus,
  Edit3,
  Save,
  X,
  RotateCcw,
  Layout,
  Settings,
} from 'lucide-react';
import { DashboardWidget, WidgetConfig, WidgetSize } from './DashboardWidget';
import { WidgetLibrary, WidgetDefinition, useWidgetLibrary } from './WidgetLibrary';

// Dashboard configuration
export interface DashboardConfig {
  id: string;
  name: string;
  description?: string;
  widgets: WidgetConfig[];
  columns?: number;
  rowHeight?: number;
  gap?: number;
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: string;
  isShared?: boolean;
  templateId?: string;
}

// Context for dashboard state
interface DashboardContextValue {
  config: DashboardConfig;
  isEditing: boolean;
  setIsEditing: (editing: boolean) => void;
  addWidget: (widget: WidgetDefinition) => void;
  removeWidget: (widgetId: string) => void;
  updateWidget: (widgetId: string, updates: Partial<WidgetConfig>) => void;
  resizeWidget: (widgetId: string, size: WidgetSize) => void;
  moveWidget: (widgetId: string, newPosition: { x: number; y: number }) => void;
  saveLayout: () => void;
  resetLayout: () => void;
}

const DashboardContext = createContext<DashboardContextValue | null>(null);

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within DashboardProvider');
  }
  return context;
}

// Storage key
const STORAGE_KEY_PREFIX = 'dashboard-config-';

// Props
interface DashboardGridProps {
  dashboardId: string;
  initialConfig?: DashboardConfig;
  defaultConfig?: DashboardConfig;
  widgetRenderer: (config: WidgetConfig) => React.ReactNode;
  onConfigChange?: (config: DashboardConfig) => void;
  onWidgetRefresh?: (widgetId: string) => void;
  onWidgetSettings?: (widgetId: string) => void;
  customWidgets?: WidgetDefinition[];
  columns?: number;
  rowHeight?: number;
  gap?: number;
  className?: string;
  editable?: boolean;
}

export function DashboardGrid({
  dashboardId,
  initialConfig,
  defaultConfig,
  widgetRenderer,
  onConfigChange,
  onWidgetRefresh,
  onWidgetSettings,
  customWidgets,
  columns = 4,
  rowHeight = 200,
  gap = 16,
  className = '',
  editable = true,
}: DashboardGridProps) {
  const [config, setConfig] = useState<DashboardConfig>(() => {
    // Try to load from localStorage first
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY_PREFIX + dashboardId);
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch (e) {
          console.error('Failed to parse stored dashboard config:', e);
        }
      }
    }
    return initialConfig || defaultConfig || {
      id: dashboardId,
      name: 'My Dashboard',
      widgets: [],
    };
  });

  const [isEditing, setIsEditing] = useState(false);
  const [draggedWidget, setDraggedWidget] = useState<string | null>(null);
  const [originalConfig, setOriginalConfig] = useState<DashboardConfig | null>(null);
  const widgetLibrary = useWidgetLibrary();

  // Save config to localStorage and notify parent
  const saveConfig = useCallback((newConfig: DashboardConfig) => {
    setConfig(newConfig);
    localStorage.setItem(STORAGE_KEY_PREFIX + dashboardId, JSON.stringify(newConfig));
    onConfigChange?.(newConfig);
  }, [dashboardId, onConfigChange]);

  // Add widget
  const addWidget = useCallback((widget: WidgetDefinition) => {
    const newWidget: WidgetConfig = {
      id: `${widget.type}-${Date.now()}`,
      type: widget.type,
      title: widget.name,
      size: widget.defaultSize,
      position: { x: 0, y: config.widgets.length },
      settings: {},
    };

    const newConfig = {
      ...config,
      widgets: [...config.widgets, newWidget],
      updatedAt: new Date(),
    };

    saveConfig(newConfig);
  }, [config, saveConfig]);

  // Remove widget
  const removeWidget = useCallback((widgetId: string) => {
    const newConfig = {
      ...config,
      widgets: config.widgets.filter(w => w.id !== widgetId),
      updatedAt: new Date(),
    };
    saveConfig(newConfig);
  }, [config, saveConfig]);

  // Update widget
  const updateWidget = useCallback((widgetId: string, updates: Partial<WidgetConfig>) => {
    const newConfig = {
      ...config,
      widgets: config.widgets.map(w =>
        w.id === widgetId ? { ...w, ...updates } : w
      ),
      updatedAt: new Date(),
    };
    saveConfig(newConfig);
  }, [config, saveConfig]);

  // Resize widget
  const resizeWidget = useCallback((widgetId: string, size: WidgetSize) => {
    updateWidget(widgetId, { size });
  }, [updateWidget]);

  // Move widget
  const moveWidget = useCallback((widgetId: string, newPosition: { x: number; y: number }) => {
    updateWidget(widgetId, { position: newPosition });
  }, [updateWidget]);

  // Start editing mode
  const startEditing = useCallback(() => {
    setOriginalConfig(config);
    setIsEditing(true);
  }, [config]);

  // Save layout
  const saveLayout = useCallback(() => {
    setIsEditing(false);
    setOriginalConfig(null);
  }, []);

  // Reset layout
  const resetLayout = useCallback(() => {
    if (originalConfig) {
      saveConfig(originalConfig);
    }
    setIsEditing(false);
    setOriginalConfig(null);
  }, [originalConfig, saveConfig]);

  // Reset to default
  const resetToDefault = useCallback(() => {
    if (defaultConfig) {
      saveConfig(defaultConfig);
    }
  }, [defaultConfig, saveConfig]);

  // Drag handlers
  const handleDragStart = useCallback((widgetId: string) => {
    setDraggedWidget(widgetId);
  }, []);

  const handleDragEnd = useCallback(() => {
    setDraggedWidget(null);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (!draggedWidget) return;

    const widgets = [...config.widgets];
    const draggedIndex = widgets.findIndex(w => w.id === draggedWidget);

    if (draggedIndex === -1 || draggedIndex === targetIndex) return;

    const [removed] = widgets.splice(draggedIndex, 1);
    widgets.splice(targetIndex, 0, removed);

    // Update positions
    const updatedWidgets = widgets.map((w, i) => ({
      ...w,
      position: { x: i % columns, y: Math.floor(i / columns) },
    }));

    saveConfig({
      ...config,
      widgets: updatedWidgets,
      updatedAt: new Date(),
    });

    setDraggedWidget(null);
  }, [config, draggedWidget, columns, saveConfig]);

  // Context value
  const contextValue: DashboardContextValue = {
    config,
    isEditing,
    setIsEditing,
    addWidget,
    removeWidget,
    updateWidget,
    resizeWidget,
    moveWidget,
    saveLayout,
    resetLayout,
  };

  const existingWidgetTypes = config.widgets.map(w => w.type);

  return (
    <DashboardContext.Provider value={contextValue}>
      <div className={`space-y-4 ${className}`}>
        {/* Toolbar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {config.name}
            </h2>
            {config.description && (
              <span className="text-sm text-gray-500">{config.description}</span>
            )}
          </div>

          {editable && (
            <div className="flex items-center gap-2">
              {isEditing ? (
                <>
                  <button
                    onClick={widgetLibrary.open}
                    className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 rounded-lg transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Add Widget
                  </button>
                  <button
                    onClick={resetLayout}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                  <button
                    onClick={saveLayout}
                    className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    Save Layout
                  </button>
                </>
              ) : (
                <>
                  {defaultConfig && (
                    <button
                      onClick={resetToDefault}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                      title="Reset to default"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={startEditing}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                    Customize
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        {/* Grid */}
        {config.widgets.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-gray-50 dark:bg-gray-800 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600">
            <Layout className="w-12 h-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No widgets yet
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Add widgets to customize your dashboard
            </p>
            {editable && (
              <button
                onClick={() => {
                  startEditing();
                  widgetLibrary.open();
                }}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Your First Widget
              </button>
            )}
          </div>
        ) : (
          <div
            className="grid gap-4"
            style={{
              gridTemplateColumns: `repeat(${columns}, 1fr)`,
              gridAutoRows: `${rowHeight}px`,
            }}
            onDragOver={handleDragOver}
          >
            {config.widgets.map((widget, index) => (
              <div
                key={widget.id}
                onDrop={(e) => handleDrop(e, index)}
                onDragOver={handleDragOver}
                className={draggedWidget === widget.id ? 'opacity-50' : ''}
              >
                <DashboardWidget
                  config={widget}
                  isEditing={isEditing}
                  onRemove={removeWidget}
                  onResize={resizeWidget}
                  onSettings={onWidgetSettings}
                  onRefresh={onWidgetRefresh}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                >
                  {widgetRenderer(widget)}
                </DashboardWidget>
              </div>
            ))}
          </div>
        )}

        {/* Widget Library */}
        <WidgetLibrary
          isOpen={widgetLibrary.isOpen}
          onClose={widgetLibrary.close}
          onAddWidget={(widget) => {
            addWidget(widget);
            // Keep library open for adding more widgets
          }}
          existingWidgetTypes={existingWidgetTypes}
          customWidgets={customWidgets}
        />
      </div>
    </DashboardContext.Provider>
  );
}

// Dashboard Layout Component (simplified view without editing)
interface DashboardLayoutProps {
  config: DashboardConfig;
  widgetRenderer: (config: WidgetConfig) => React.ReactNode;
  onWidgetRefresh?: (widgetId: string) => void;
  columns?: number;
  rowHeight?: number;
  className?: string;
}

export function DashboardLayout({
  config,
  widgetRenderer,
  onWidgetRefresh,
  columns = 4,
  rowHeight = 200,
  className = '',
}: DashboardLayoutProps) {
  return (
    <div
      className={`grid gap-4 ${className}`}
      style={{
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gridAutoRows: `${rowHeight}px`,
      }}
    >
      {config.widgets.map(widget => (
        <DashboardWidget
          key={widget.id}
          config={widget}
          onRefresh={onWidgetRefresh}
        >
          {widgetRenderer(widget)}
        </DashboardWidget>
      ))}
    </div>
  );
}

export type { DashboardGridProps, DashboardLayoutProps, DashboardContextValue };

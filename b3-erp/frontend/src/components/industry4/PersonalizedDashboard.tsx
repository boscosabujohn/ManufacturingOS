'use client';

import React, { useState, useCallback, useMemo } from 'react';
import {
  GripVertical,
  Plus,
  X,
  Settings,
  Layout,
  Maximize2,
  Minimize2,
  Eye,
  EyeOff,
  Save,
  RotateCcw,
  User,
  BarChart3,
  Activity,
  Package,
  AlertTriangle,
  Clock,
  Target,
  TrendingUp,
  Gauge,
  CheckCircle,
  Calendar,
  Users,
  Wrench,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

// ============================================================================
// Types
// ============================================================================

export type WidgetSize = 'small' | 'medium' | 'large' | 'full';
export type WidgetCategory = 'production' | 'quality' | 'inventory' | 'maintenance' | 'analytics' | 'alerts';
export type UserRole = 'operator' | 'supervisor' | 'manager' | 'admin';

export interface DashboardWidget {
  id: string;
  type: string;
  title: string;
  category: WidgetCategory;
  size: WidgetSize;
  position: number;
  isVisible: boolean;
  isCollapsed: boolean;
  config?: Record<string, unknown>;
}

export interface DashboardLayout {
  id: string;
  name: string;
  role: UserRole;
  widgets: DashboardWidget[];
  columns: number;
  isDefault: boolean;
}

export interface PersonalizedDashboardProps {
  userId?: string;
  role?: UserRole;
  onSaveLayout?: (layout: DashboardLayout) => void;
  onWidgetClick?: (widget: DashboardWidget) => void;
}

// ============================================================================
// Available Widgets Configuration
// ============================================================================

const availableWidgets: Omit<DashboardWidget, 'id' | 'position' | 'isVisible' | 'isCollapsed'>[] = [
  { type: 'oee-gauge', title: 'OEE Gauge', category: 'production', size: 'small' },
  { type: 'production-count', title: 'Production Count', category: 'production', size: 'small' },
  { type: 'machine-status', title: 'Machine Status', category: 'production', size: 'medium' },
  { type: 'quality-score', title: 'Quality Score', category: 'quality', size: 'small' },
  { type: 'defect-rate', title: 'Defect Rate', category: 'quality', size: 'small' },
  { type: 'quality-trend', title: 'Quality Trend', category: 'quality', size: 'medium' },
  { type: 'inventory-levels', title: 'Inventory Levels', category: 'inventory', size: 'medium' },
  { type: 'low-stock-alerts', title: 'Low Stock Alerts', category: 'inventory', size: 'small' },
  { type: 'maintenance-schedule', title: 'Maintenance Schedule', category: 'maintenance', size: 'medium' },
  { type: 'equipment-health', title: 'Equipment Health', category: 'maintenance', size: 'medium' },
  { type: 'performance-chart', title: 'Performance Chart', category: 'analytics', size: 'large' },
  { type: 'kpi-summary', title: 'KPI Summary', category: 'analytics', size: 'medium' },
  { type: 'active-alerts', title: 'Active Alerts', category: 'alerts', size: 'medium' },
  { type: 'shift-summary', title: 'Shift Summary', category: 'production', size: 'medium' },
  { type: 'team-performance', title: 'Team Performance', category: 'analytics', size: 'large' },
];

// Default layouts per role
const defaultLayouts: Record<UserRole, Omit<DashboardWidget, 'id'>[]> = {
  operator: [
    { type: 'production-count', title: 'Production Count', category: 'production', size: 'medium', position: 0, isVisible: true, isCollapsed: false },
    { type: 'quality-score', title: 'Quality Score', category: 'quality', size: 'small', position: 1, isVisible: true, isCollapsed: false },
    { type: 'active-alerts', title: 'Active Alerts', category: 'alerts', size: 'medium', position: 2, isVisible: true, isCollapsed: false },
    { type: 'machine-status', title: 'My Machine', category: 'production', size: 'medium', position: 3, isVisible: true, isCollapsed: false },
  ],
  supervisor: [
    { type: 'oee-gauge', title: 'OEE Gauge', category: 'production', size: 'medium', position: 0, isVisible: true, isCollapsed: false },
    { type: 'machine-status', title: 'Machine Status', category: 'production', size: 'large', position: 1, isVisible: true, isCollapsed: false },
    { type: 'active-alerts', title: 'Active Alerts', category: 'alerts', size: 'medium', position: 2, isVisible: true, isCollapsed: false },
    { type: 'quality-trend', title: 'Quality Trend', category: 'quality', size: 'medium', position: 3, isVisible: true, isCollapsed: false },
    { type: 'shift-summary', title: 'Shift Summary', category: 'production', size: 'medium', position: 4, isVisible: true, isCollapsed: false },
    { type: 'team-performance', title: 'Team Performance', category: 'analytics', size: 'large', position: 5, isVisible: true, isCollapsed: false },
  ],
  manager: [
    { type: 'kpi-summary', title: 'KPI Summary', category: 'analytics', size: 'large', position: 0, isVisible: true, isCollapsed: false },
    { type: 'oee-gauge', title: 'OEE Gauge', category: 'production', size: 'small', position: 1, isVisible: true, isCollapsed: false },
    { type: 'quality-score', title: 'Quality Score', category: 'quality', size: 'small', position: 2, isVisible: true, isCollapsed: false },
    { type: 'performance-chart', title: 'Performance Trend', category: 'analytics', size: 'large', position: 3, isVisible: true, isCollapsed: false },
    { type: 'inventory-levels', title: 'Inventory Status', category: 'inventory', size: 'medium', position: 4, isVisible: true, isCollapsed: false },
    { type: 'maintenance-schedule', title: 'Maintenance', category: 'maintenance', size: 'medium', position: 5, isVisible: true, isCollapsed: false },
    { type: 'team-performance', title: 'Team Performance', category: 'analytics', size: 'large', position: 6, isVisible: true, isCollapsed: false },
  ],
  admin: [
    { type: 'kpi-summary', title: 'System KPIs', category: 'analytics', size: 'large', position: 0, isVisible: true, isCollapsed: false },
    { type: 'performance-chart', title: 'Overall Performance', category: 'analytics', size: 'large', position: 1, isVisible: true, isCollapsed: false },
    { type: 'active-alerts', title: 'System Alerts', category: 'alerts', size: 'medium', position: 2, isVisible: true, isCollapsed: false },
    { type: 'equipment-health', title: 'Equipment Health', category: 'maintenance', size: 'large', position: 3, isVisible: true, isCollapsed: false },
  ],
};

// ============================================================================
// Widget Content Renderers
// ============================================================================

function WidgetContent({ type }: { type: string }) {
  switch (type) {
    case 'oee-gauge':
      return (
        <div className="flex flex-col items-center justify-center h-full">
          <div className="relative w-24 h-24">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" fill="none" stroke="#e5e7eb" strokeWidth="8" />
              <circle
                cx="50" cy="50" r="40" fill="none" stroke="#22c55e" strokeWidth="8"
                strokeDasharray={`${85 * 2.51} 251`} strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold">85%</span>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">Overall Equipment Effectiveness</p>
        </div>
      );

    case 'production-count':
      return (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-3xl font-bold text-green-600">1,247</p>
              <p className="text-sm text-gray-500">Units Produced</p>
            </div>
            <Target className="w-12 h-12 text-green-200" />
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Target: 1,500</span>
            <span className="text-green-600">83% Complete</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-green-500 rounded-full" style={{ width: '83%' }} />
          </div>
        </div>
      );

    case 'machine-status':
      return (
        <div className="grid grid-cols-4 gap-2">
          {[
            { name: 'CNC-01', status: 'running' },
            { name: 'CNC-02', status: 'running' },
            { name: 'CNC-03', status: 'idle' },
            { name: 'CNC-04', status: 'warning' },
            { name: 'ASM-01', status: 'running' },
            { name: 'ASM-02', status: 'running' },
            { name: 'PKG-01', status: 'running' },
            { name: 'PKG-02', status: 'offline' },
          ].map(machine => (
            <div key={machine.name} className="text-center p-2 rounded bg-gray-50 dark:bg-gray-800">
              <div className={`w-3 h-3 rounded-full mb-1 ${machine.status === 'running' ? 'bg-green-500' :
                  machine.status === 'idle' ? 'bg-blue-500' :
                    machine.status === 'warning' ? 'bg-amber-500' : 'bg-gray-400'
                }`} />
              <p className="text-xs font-medium">{machine.name}</p>
            </div>
          ))}
        </div>
      );

    case 'quality-score':
      return (
        <div className="flex flex-col items-center justify-center h-full">
          <div className="text-4xl font-bold text-blue-600">98.5%</div>
          <p className="text-sm text-gray-500 mt-1">First Pass Yield</p>
          <div className="flex items-center gap-1 mt-2 text-green-600 text-sm">
            <TrendingUp className="w-4 h-4" />
            <span>+1.2% vs last shift</span>
          </div>
        </div>
      );

    case 'defect-rate':
      return (
        <div className="flex flex-col items-center justify-center h-full">
          <div className="text-4xl font-bold text-amber-600">1.5%</div>
          <p className="text-sm text-gray-500 mt-1">Defect Rate</p>
          <div className="flex items-center gap-1 mt-2 text-green-600 text-sm">
            <TrendingUp className="w-4 h-4 rotate-180" />
            <span>-0.3% vs target</span>
          </div>
        </div>
      );

    case 'active-alerts':
      return (
        <div className="space-y-2">
          {[
            { level: 'warning', message: 'CNC-04: Temperature high', time: '5m ago' },
            { level: 'info', message: 'Shift change in 30 minutes', time: '10m ago' },
            { level: 'critical', message: 'PKG-02: Emergency stop', time: '15m ago' },
          ].map((alert, i) => (
            <div key={i} className={`flex items-center gap-2 p-2 rounded text-sm ${alert.level === 'critical' ? 'bg-red-100 dark:bg-red-900/30' :
                alert.level === 'warning' ? 'bg-amber-100 dark:bg-amber-900/30' :
                  'bg-blue-100 dark:bg-blue-900/30'
              }`}>
              <AlertTriangle className={`w-4 h-4 ${alert.level === 'critical' ? 'text-red-600' :
                  alert.level === 'warning' ? 'text-amber-600' : 'text-blue-600'
                }`} />
              <span className="flex-1">{alert.message}</span>
              <span className="text-xs text-gray-500">{alert.time}</span>
            </div>
          ))}
        </div>
      );

    case 'kpi-summary':
      return (
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: 'OEE', value: '85%', color: 'text-green-600', icon: Gauge },
            { label: 'Quality', value: '98.5%', color: 'text-blue-600', icon: CheckCircle },
            { label: 'On-Time', value: '94%', color: 'text-purple-600', icon: Clock },
            { label: 'Efficiency', value: '91%', color: 'text-amber-600', icon: TrendingUp },
          ].map(kpi => (
            <div key={kpi.label} className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <kpi.icon className={`w-4 h-4 ${kpi.color}`} />
                <span className="text-xs text-gray-500">{kpi.label}</span>
              </div>
              <p className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</p>
            </div>
          ))}
        </div>
      );

    case 'shift-summary':
      return (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Current Shift</span>
            <span className="font-medium">Day Shift (06:00 - 14:00)</span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-green-50 dark:bg-green-900/30 p-2 rounded">
              <p className="text-lg font-bold text-green-600">1,247</p>
              <p className="text-xs text-gray-500">Produced</p>
            </div>
            <div className="bg-red-50 dark:bg-red-900/30 p-2 rounded">
              <p className="text-lg font-bold text-red-600">12</p>
              <p className="text-xs text-gray-500">Defects</p>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/30 p-2 rounded">
              <p className="text-lg font-bold text-blue-600">4:23</p>
              <p className="text-xs text-gray-500">Hours Left</p>
            </div>
          </div>
        </div>
      );

    default:
      return (
        <div className="flex items-center justify-center h-full text-gray-400">
          <div className="text-center">
            <BarChart3 className="w-12 h-12 mb-2 opacity-50" />
            <p className="text-sm">Widget: {type}</p>
          </div>
        </div>
      );
  }
}

// ============================================================================
// Draggable Widget Component
// ============================================================================

function DraggableWidget({
  widget,
  isEditMode,
  onRemove,
  onToggleCollapse,
  onToggleVisibility,
  onResize,
  onDragStart,
  onDragOver,
  onDrop,
  onClick,
}: {
  widget: DashboardWidget;
  isEditMode: boolean;
  onRemove: (id: string) => void;
  onToggleCollapse: (id: string) => void;
  onToggleVisibility: (id: string) => void;
  onResize: (id: string, size: WidgetSize) => void;
  onDragStart: (e: React.DragEvent, id: string) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, id: string) => void;
  onClick?: (widget: DashboardWidget) => void;
}) {
  const sizeClasses = {
    small: 'col-span-1',
    medium: 'col-span-1 md:col-span-2',
    large: 'col-span-1 md:col-span-2 lg:col-span-3',
    full: 'col-span-full',
  };

  const categoryColors = {
    production: 'border-t-green-500',
    quality: 'border-t-blue-500',
    inventory: 'border-t-purple-500',
    maintenance: 'border-t-amber-500',
    analytics: 'border-t-indigo-500',
    alerts: 'border-t-red-500',
  };

  if (!widget.isVisible && !isEditMode) return null;

  return (
    <div
      className={`${sizeClasses[widget.size]} ${!widget.isVisible ? 'opacity-50' : ''}`}
      draggable={isEditMode}
      onDragStart={(e) => onDragStart(e, widget.id)}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, widget.id)}
    >
      <Card className={`h-full border-t-4 ${categoryColors[widget.category]} ${isEditMode ? 'cursor-move' : ''}`}>
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            {isEditMode && <GripVertical className="w-4 h-4 text-gray-400" />}
            <CardTitle className="text-sm">{widget.title}</CardTitle>
          </div>
          <div className="flex items-center gap-1">
            {isEditMode && (
              <>
                <button
                  onClick={() => onToggleVisibility(widget.id)}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                >
                  {widget.isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
                <select
                  value={widget.size}
                  onChange={(e) => onResize(widget.id, e.target.value as WidgetSize)}
                  className="text-xs border rounded px-1 py-0.5 bg-white dark:bg-gray-800"
                >
                  <option value="small">S</option>
                  <option value="medium">M</option>
                  <option value="large">L</option>
                  <option value="full">Full</option>
                </select>
                <button
                  onClick={() => onRemove(widget.id)}
                  className="p-1 hover:bg-red-100 dark:hover:bg-red-900/50 rounded text-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </>
            )}
            <button
              onClick={() => onToggleCollapse(widget.id)}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            >
              {widget.isCollapsed ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
            </button>
          </div>
        </CardHeader>
        {!widget.isCollapsed && (
          <CardContent
            className="min-h-[120px] cursor-pointer"
            onClick={() => onClick?.(widget)}
          >
            <WidgetContent type={widget.type} />
          </CardContent>
        )}
      </Card>
    </div>
  );
}

// ============================================================================
// Widget Palette Component
// ============================================================================

function WidgetPalette({
  onAddWidget,
  existingWidgets,
}: {
  onAddWidget: (type: string) => void;
  existingWidgets: string[];
}) {
  const [filter, setFilter] = useState<WidgetCategory | 'all'>('all');

  const filteredWidgets = availableWidgets.filter(w =>
    filter === 'all' || w.category === filter
  );

  const categoryIcons: Record<WidgetCategory, React.ReactNode> = {
    production: <Activity className="w-4 h-4" />,
    quality: <CheckCircle className="w-4 h-4" />,
    inventory: <Package className="w-4 h-4" />,
    maintenance: <Wrench className="w-4 h-4" />,
    analytics: <BarChart3 className="w-4 h-4" />,
    alerts: <AlertTriangle className="w-4 h-4" />,
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Widgets
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-1 mb-3">
          <button
            onClick={() => setFilter('all')}
            className={`px-2 py-1 rounded text-xs ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700'}`}
          >
            All
          </button>
          {(Object.keys(categoryIcons) as WidgetCategory[]).map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-2 py-1 rounded text-xs capitalize flex items-center gap-1 ${filter === cat ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700'}`}
            >
              {categoryIcons[cat]}
              {cat}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto">
          {filteredWidgets.map(widget => {
            const isAdded = existingWidgets.includes(widget.type);
            return (
              <button
                key={widget.type}
                onClick={() => !isAdded && onAddWidget(widget.type)}
                disabled={isAdded}
                className={`p-2 rounded border text-left text-xs transition-colors ${isAdded
                    ? 'opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-800'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700 border-gray-200 dark:border-gray-600'
                  }`}
              >
                <p className="font-medium">{widget.title}</p>
                <p className="text-gray-500 capitalize">{widget.category}</p>
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export function PersonalizedDashboard({
  userId,
  role = 'operator',
  onSaveLayout,
  onWidgetClick,
}: PersonalizedDashboardProps) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [widgets, setWidgets] = useState<DashboardWidget[]>(() => {
    const defaultConfig = defaultLayouts[role];
    return defaultConfig.map((w, i) => ({
      ...w,
      id: `widget-${i}`,
    }));
  });
  const [draggedWidget, setDraggedWidget] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedWidget(id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!draggedWidget || draggedWidget === targetId) return;

    setWidgets(prev => {
      const newWidgets = [...prev];
      const draggedIndex = newWidgets.findIndex(w => w.id === draggedWidget);
      const targetIndex = newWidgets.findIndex(w => w.id === targetId);

      if (draggedIndex !== -1 && targetIndex !== -1) {
        const [removed] = newWidgets.splice(draggedIndex, 1);
        newWidgets.splice(targetIndex, 0, removed);
        return newWidgets.map((w, i) => ({ ...w, position: i }));
      }
      return prev;
    });
    setDraggedWidget(null);
  };

  const handleRemoveWidget = (id: string) => {
    setWidgets(prev => prev.filter(w => w.id !== id));
  };

  const handleToggleCollapse = (id: string) => {
    setWidgets(prev => prev.map(w =>
      w.id === id ? { ...w, isCollapsed: !w.isCollapsed } : w
    ));
  };

  const handleToggleVisibility = (id: string) => {
    setWidgets(prev => prev.map(w =>
      w.id === id ? { ...w, isVisible: !w.isVisible } : w
    ));
  };

  const handleResize = (id: string, size: WidgetSize) => {
    setWidgets(prev => prev.map(w =>
      w.id === id ? { ...w, size } : w
    ));
  };

  const handleAddWidget = (type: string) => {
    const widgetConfig = availableWidgets.find(w => w.type === type);
    if (!widgetConfig) return;

    const newWidget: DashboardWidget = {
      ...widgetConfig,
      id: `widget-${Date.now()}`,
      position: widgets.length,
      isVisible: true,
      isCollapsed: false,
    };
    setWidgets(prev => [...prev, newWidget]);
  };

  const handleResetLayout = () => {
    const defaultConfig = defaultLayouts[role];
    setWidgets(defaultConfig.map((w, i) => ({
      ...w,
      id: `widget-${i}-${Date.now()}`,
    })));
  };

  const handleSaveLayout = () => {
    const layout: DashboardLayout = {
      id: `layout-${userId}-${Date.now()}`,
      name: `${role} Dashboard`,
      role,
      widgets,
      columns: 4,
      isDefault: false,
    };
    onSaveLayout?.(layout);
    setIsEditMode(false);
  };

  const existingWidgetTypes = widgets.map(w => w.type);

  return (
    <div className="space-y-2">
      {/* Header */}
      <Card>
        <CardContent className="py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-violet-600 to-purple-600 rounded-lg">
                <Layout className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="font-semibold">Personalized Dashboard</h2>
                <p className="text-sm text-gray-500 capitalize">
                  <User className="w-3 h-3 inline mr-1" />
                  {role} View
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isEditMode ? (
                <>
                  <Button variant="outline" size="sm" onClick={handleResetLayout}>
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setIsEditMode(false)}>
                    Cancel
                  </Button>
                  <Button size="sm" onClick={handleSaveLayout}>
                    <Save className="w-4 h-4 mr-2" />
                    Save Layout
                  </Button>
                </>
              ) : (
                <Button variant="outline" size="sm" onClick={() => setIsEditMode(true)}>
                  <Settings className="w-4 h-4 mr-2" />
                  Customize
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className={`grid gap-2 ${isEditMode ? 'grid-cols-1 lg:grid-cols-4' : ''}`}>
        {/* Widget Palette (Edit Mode) */}
        {isEditMode && (
          <div className="lg:col-span-1">
            <WidgetPalette
              onAddWidget={handleAddWidget}
              existingWidgets={existingWidgetTypes}
            />
          </div>
        )}

        {/* Dashboard Grid */}
        <div className={isEditMode ? 'lg:col-span-3' : ''}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
            {widgets.map(widget => (
              <DraggableWidget
                key={widget.id}
                widget={widget}
                isEditMode={isEditMode}
                onRemove={handleRemoveWidget}
                onToggleCollapse={handleToggleCollapse}
                onToggleVisibility={handleToggleVisibility}
                onResize={handleResize}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={onWidgetClick}
              />
            ))}
          </div>

          {widgets.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center text-gray-500">
                <Layout className="w-12 h-12 mb-2 opacity-50" />
                <p>No widgets added yet</p>
                <p className="text-sm">Click "Customize" to add widgets to your dashboard</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

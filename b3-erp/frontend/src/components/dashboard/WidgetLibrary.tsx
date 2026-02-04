'use client';

import React, { useState, useMemo } from 'react';
import {
  X,
  Search,
  Plus,
  BarChart3,
  LineChart,
  PieChart,
  Activity,
  TrendingUp,
  DollarSign,
  Package,
  Users,
  ShoppingCart,
  Truck,
  Factory,
  AlertTriangle,
  Clock,
  Calendar,
  Target,
  Gauge,
  Map,
  List,
  Table,
  FileText,
  Bell,
} from 'lucide-react';
import { WidgetSize } from './DashboardWidget';

// Widget Definition Type
export interface WidgetDefinition {
  id: string;
  type: string;
  name: string;
  description: string;
  category: WidgetCategory;
  icon: React.ReactNode;
  defaultSize: WidgetSize;
  supportedSizes: WidgetSize[];
  preview?: string;
  settings?: WidgetSettingDefinition[];
}

export interface WidgetSettingDefinition {
  key: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'boolean' | 'color';
  options?: { value: string; label: string }[];
  defaultValue: any;
}

export type WidgetCategory =
  | 'analytics'
  | 'operations'
  | 'sales'
  | 'inventory'
  | 'production'
  | 'alerts'
  | 'scheduling'
  | 'other';

// Category definitions
const categories: { id: WidgetCategory; label: string; icon: React.ReactNode }[] = [
  { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-4 h-4" /> },
  { id: 'operations', label: 'Operations', icon: <Activity className="w-4 h-4" /> },
  { id: 'sales', label: 'Sales & Revenue', icon: <DollarSign className="w-4 h-4" /> },
  { id: 'inventory', label: 'Inventory', icon: <Package className="w-4 h-4" /> },
  { id: 'production', label: 'Production', icon: <Factory className="w-4 h-4" /> },
  { id: 'alerts', label: 'Alerts & Notifications', icon: <Bell className="w-4 h-4" /> },
  { id: 'scheduling', label: 'Scheduling', icon: <Calendar className="w-4 h-4" /> },
  { id: 'other', label: 'Other', icon: <List className="w-4 h-4" /> },
];

// Default widget definitions
const defaultWidgets: WidgetDefinition[] = [
  // Analytics
  {
    id: 'revenue-chart',
    type: 'revenue-chart',
    name: 'Revenue Chart',
    description: 'Line chart showing revenue trends over time',
    category: 'analytics',
    icon: <LineChart className="w-6 h-6" />,
    defaultSize: 'medium',
    supportedSizes: ['small', 'medium', 'large', 'full'],
  },
  {
    id: 'sales-breakdown',
    type: 'sales-breakdown',
    name: 'Sales Breakdown',
    description: 'Pie chart showing sales by category or region',
    category: 'analytics',
    icon: <PieChart className="w-6 h-6" />,
    defaultSize: 'medium',
    supportedSizes: ['small', 'medium', 'large'],
  },
  {
    id: 'kpi-summary',
    type: 'kpi-summary',
    name: 'KPI Summary',
    description: 'Key performance indicators at a glance',
    category: 'analytics',
    icon: <Target className="w-6 h-6" />,
    defaultSize: 'large',
    supportedSizes: ['medium', 'large', 'full'],
  },
  {
    id: 'performance-gauge',
    type: 'performance-gauge',
    name: 'Performance Gauge',
    description: 'Visual gauge showing performance metrics',
    category: 'analytics',
    icon: <Gauge className="w-6 h-6" />,
    defaultSize: 'small',
    supportedSizes: ['small', 'medium'],
  },

  // Operations
  {
    id: 'oee-monitor',
    type: 'oee-monitor',
    name: 'OEE Monitor',
    description: 'Overall Equipment Effectiveness tracking',
    category: 'operations',
    icon: <Activity className="w-6 h-6" />,
    defaultSize: 'medium',
    supportedSizes: ['small', 'medium', 'large'],
  },
  {
    id: 'machine-status',
    type: 'machine-status',
    name: 'Machine Status',
    description: 'Real-time status of production machines',
    category: 'operations',
    icon: <Factory className="w-6 h-6" />,
    defaultSize: 'large',
    supportedSizes: ['medium', 'large', 'full'],
  },
  {
    id: 'downtime-tracker',
    type: 'downtime-tracker',
    name: 'Downtime Tracker',
    description: 'Track and analyze machine downtime',
    category: 'operations',
    icon: <Clock className="w-6 h-6" />,
    defaultSize: 'medium',
    supportedSizes: ['small', 'medium', 'large'],
  },

  // Sales
  {
    id: 'sales-summary',
    type: 'sales-summary',
    name: 'Sales Summary',
    description: 'Total sales and order statistics',
    category: 'sales',
    icon: <DollarSign className="w-6 h-6" />,
    defaultSize: 'small',
    supportedSizes: ['small', 'medium'],
  },
  {
    id: 'top-customers',
    type: 'top-customers',
    name: 'Top Customers',
    description: 'List of highest value customers',
    category: 'sales',
    icon: <Users className="w-6 h-6" />,
    defaultSize: 'medium',
    supportedSizes: ['small', 'medium', 'large'],
  },
  {
    id: 'order-pipeline',
    type: 'order-pipeline',
    name: 'Order Pipeline',
    description: 'Orders by status and progress',
    category: 'sales',
    icon: <ShoppingCart className="w-6 h-6" />,
    defaultSize: 'medium',
    supportedSizes: ['medium', 'large'],
  },
  {
    id: 'revenue-target',
    type: 'revenue-target',
    name: 'Revenue vs Target',
    description: 'Progress towards revenue goals',
    category: 'sales',
    icon: <TrendingUp className="w-6 h-6" />,
    defaultSize: 'small',
    supportedSizes: ['small', 'medium'],
  },

  // Inventory
  {
    id: 'inventory-levels',
    type: 'inventory-levels',
    name: 'Inventory Levels',
    description: 'Current stock levels and alerts',
    category: 'inventory',
    icon: <Package className="w-6 h-6" />,
    defaultSize: 'medium',
    supportedSizes: ['small', 'medium', 'large'],
  },
  {
    id: 'low-stock-alerts',
    type: 'low-stock-alerts',
    name: 'Low Stock Alerts',
    description: 'Items below reorder point',
    category: 'inventory',
    icon: <AlertTriangle className="w-6 h-6" />,
    defaultSize: 'small',
    supportedSizes: ['small', 'medium'],
  },
  {
    id: 'warehouse-map',
    type: 'warehouse-map',
    name: 'Warehouse Map',
    description: 'Visual warehouse occupancy',
    category: 'inventory',
    icon: <Map className="w-6 h-6" />,
    defaultSize: 'large',
    supportedSizes: ['medium', 'large', 'full'],
  },

  // Production
  {
    id: 'production-schedule',
    type: 'production-schedule',
    name: 'Production Schedule',
    description: 'Upcoming production orders',
    category: 'production',
    icon: <Calendar className="w-6 h-6" />,
    defaultSize: 'large',
    supportedSizes: ['medium', 'large', 'full'],
  },
  {
    id: 'work-orders',
    type: 'work-orders',
    name: 'Work Orders',
    description: 'Active work orders status',
    category: 'production',
    icon: <FileText className="w-6 h-6" />,
    defaultSize: 'medium',
    supportedSizes: ['small', 'medium', 'large'],
  },
  {
    id: 'quality-metrics',
    type: 'quality-metrics',
    name: 'Quality Metrics',
    description: 'Defect rates and quality KPIs',
    category: 'production',
    icon: <Target className="w-6 h-6" />,
    defaultSize: 'medium',
    supportedSizes: ['small', 'medium', 'large'],
  },

  // Alerts
  {
    id: 'notifications',
    type: 'notifications',
    name: 'Notifications',
    description: 'Recent alerts and notifications',
    category: 'alerts',
    icon: <Bell className="w-6 h-6" />,
    defaultSize: 'small',
    supportedSizes: ['small', 'medium'],
  },
  {
    id: 'system-alerts',
    type: 'system-alerts',
    name: 'System Alerts',
    description: 'Critical system notifications',
    category: 'alerts',
    icon: <AlertTriangle className="w-6 h-6" />,
    defaultSize: 'medium',
    supportedSizes: ['small', 'medium'],
  },

  // Scheduling
  {
    id: 'upcoming-tasks',
    type: 'upcoming-tasks',
    name: 'Upcoming Tasks',
    description: 'Tasks due today and this week',
    category: 'scheduling',
    icon: <Clock className="w-6 h-6" />,
    defaultSize: 'medium',
    supportedSizes: ['small', 'medium', 'large'],
  },
  {
    id: 'delivery-schedule',
    type: 'delivery-schedule',
    name: 'Delivery Schedule',
    description: 'Upcoming shipments and deliveries',
    category: 'scheduling',
    icon: <Truck className="w-6 h-6" />,
    defaultSize: 'medium',
    supportedSizes: ['small', 'medium', 'large'],
  },

  // Other
  {
    id: 'data-table',
    type: 'data-table',
    name: 'Data Table',
    description: 'Customizable data table widget',
    category: 'other',
    icon: <Table className="w-6 h-6" />,
    defaultSize: 'large',
    supportedSizes: ['medium', 'large', 'full'],
  },
  {
    id: 'quick-links',
    type: 'quick-links',
    name: 'Quick Links',
    description: 'Shortcuts to frequently used pages',
    category: 'other',
    icon: <List className="w-6 h-6" />,
    defaultSize: 'small',
    supportedSizes: ['small', 'medium'],
  },
];

// Props
interface WidgetLibraryProps {
  isOpen: boolean;
  onClose: () => void;
  onAddWidget: (widget: WidgetDefinition) => void;
  existingWidgetTypes?: string[];
  customWidgets?: WidgetDefinition[];
}

export function WidgetLibrary({
  isOpen,
  onClose,
  onAddWidget,
  existingWidgetTypes = [],
  customWidgets = [],
}: WidgetLibraryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<WidgetCategory | 'all'>('all');

  // Combine default and custom widgets
  const allWidgets = useMemo(() => {
    return [...defaultWidgets, ...customWidgets];
  }, [customWidgets]);

  // Filter widgets
  const filteredWidgets = useMemo(() => {
    return allWidgets.filter(widget => {
      const matchesSearch =
        widget.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        widget.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || widget.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [allWidgets, searchQuery, selectedCategory]);

  // Group by category
  const widgetsByCategory = useMemo(() => {
    const grouped: Record<WidgetCategory, WidgetDefinition[]> = {
      analytics: [],
      operations: [],
      sales: [],
      inventory: [],
      production: [],
      alerts: [],
      scheduling: [],
      other: [],
    };

    filteredWidgets.forEach(widget => {
      grouped[widget.category].push(widget);
    });

    return grouped;
  }, [filteredWidgets]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50 transition-opacity"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed inset-y-0 right-0 w-full max-w-lg bg-white dark:bg-gray-900 z-50 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-3 py-2 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Widget Library</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Add widgets to your dashboard
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="px-3 py-2 border-b border-gray-200 dark:border-gray-700">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search widgets..."
              className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="px-3 py-2 border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              All
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {cat.icon}
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Widget List */}
        <div className="flex-1 overflow-y-auto p-3">
          {selectedCategory === 'all' ? (
            // Show by category
            <>
              {categories.map(cat => {
                const widgets = widgetsByCategory[cat.id];
                if (widgets.length === 0) return null;

                return (
                  <div key={cat.id} className="mb-3">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-2">
                      {cat.icon}
                      {cat.label}
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      {widgets.map(widget => (
                        <WidgetCard
                          key={widget.id}
                          widget={widget}
                          isAdded={existingWidgetTypes.includes(widget.type)}
                          onAdd={() => onAddWidget(widget)}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </>
          ) : (
            // Show filtered
            <div className="grid grid-cols-2 gap-3">
              {filteredWidgets.map(widget => (
                <WidgetCard
                  key={widget.id}
                  widget={widget}
                  isAdded={existingWidgetTypes.includes(widget.type)}
                  onAdd={() => onAddWidget(widget)}
                />
              ))}
            </div>
          )}

          {filteredWidgets.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">No widgets found</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// Widget Card Component
interface WidgetCardProps {
  widget: WidgetDefinition;
  isAdded: boolean;
  onAdd: () => void;
}

function WidgetCard({ widget, isAdded, onAdd }: WidgetCardProps) {
  return (
    <div className={`relative p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 ${
      isAdded ? 'opacity-60' : 'hover:border-blue-300 dark:hover:border-blue-700'
    }`}>
      <div className="flex items-start gap-3">
        <div className="p-2 bg-white dark:bg-gray-700 rounded-lg text-blue-600 dark:text-blue-400">
          {widget.icon}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-sm text-gray-900 dark:text-white truncate">
            {widget.name}
          </h4>
          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mt-0.5">
            {widget.description}
          </p>
        </div>
      </div>

      <button
        onClick={onAdd}
        disabled={isAdded}
        className={`absolute top-2 right-2 p-1.5 rounded-lg transition-colors ${
          isAdded
            ? 'text-gray-400 cursor-not-allowed'
            : 'text-gray-400 hover:text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30'
        }`}
        title={isAdded ? 'Already added' : 'Add widget'}
      >
        <Plus className="w-4 h-4" />
      </button>

      <div className="mt-3 flex items-center gap-2">
        <span className="text-xs text-gray-400">
          Default: {widget.defaultSize}
        </span>
      </div>
    </div>
  );
}

// Hook for widget library
export function useWidgetLibrary() {
  const [isOpen, setIsOpen] = useState(false);

  return {
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
    toggle: () => setIsOpen(prev => !prev),
  };
}

export { defaultWidgets, categories };
export type { WidgetLibraryProps };

'use client';

import React, { useState } from 'react';
import {
  Layout,
  Check,
  Eye,
  Download,
  Crown,
  Factory,
  TrendingUp,
  Package,
  Truck,
  Settings,
  Users,
  Shield,
  BarChart3,
  ClipboardList,
  Wrench,
} from 'lucide-react';
import { DashboardConfig, DashboardLayout } from './DashboardGrid';
import { WidgetConfig } from './DashboardWidget';

// Template definition
export interface DashboardTemplate {
  id: string;
  name: string;
  description: string;
  role: UserRole;
  icon: React.ReactNode;
  config: DashboardConfig;
  preview?: string;
  isDefault?: boolean;
  isPremium?: boolean;
}

// User roles
export type UserRole =
  | 'ceo'
  | 'plant_manager'
  | 'production_manager'
  | 'inventory_manager'
  | 'logistics_manager'
  | 'quality_manager'
  | 'sales_manager'
  | 'maintenance_manager'
  | 'it_admin'
  | 'custom';

// Role info
const roleInfo: Record<UserRole, { label: string; icon: React.ReactNode; description: string }> = {
  ceo: {
    label: 'Executive / CEO',
    icon: <Crown className="w-5 h-5" />,
    description: 'High-level business metrics and KPIs',
  },
  plant_manager: {
    label: 'Plant Manager',
    icon: <Factory className="w-5 h-5" />,
    description: 'Overall plant operations and efficiency',
  },
  production_manager: {
    label: 'Production Manager',
    icon: <ClipboardList className="w-5 h-5" />,
    description: 'Production schedules and work orders',
  },
  inventory_manager: {
    label: 'Inventory Manager',
    icon: <Package className="w-5 h-5" />,
    description: 'Stock levels and warehouse operations',
  },
  logistics_manager: {
    label: 'Logistics Manager',
    icon: <Truck className="w-5 h-5" />,
    description: 'Shipping and delivery management',
  },
  quality_manager: {
    label: 'Quality Manager',
    icon: <Shield className="w-5 h-5" />,
    description: 'Quality metrics and compliance',
  },
  sales_manager: {
    label: 'Sales Manager',
    icon: <TrendingUp className="w-5 h-5" />,
    description: 'Sales performance and pipeline',
  },
  maintenance_manager: {
    label: 'Maintenance Manager',
    icon: <Wrench className="w-5 h-5" />,
    description: 'Equipment maintenance and downtime',
  },
  it_admin: {
    label: 'IT Admin',
    icon: <Settings className="w-5 h-5" />,
    description: 'System monitoring and administration',
  },
  custom: {
    label: 'Custom',
    icon: <Layout className="w-5 h-5" />,
    description: 'Build your own dashboard',
  },
};

// Pre-built dashboard templates
export const dashboardTemplates: DashboardTemplate[] = [
  {
    id: 'executive-dashboard',
    name: 'Executive Dashboard',
    description: 'High-level KPIs and business metrics for C-suite executives',
    role: 'ceo',
    icon: <Crown className="w-6 h-6" />,
    isDefault: true,
    config: {
      id: 'executive-dashboard',
      name: 'Executive Dashboard',
      widgets: [
        { id: 'revenue-1', type: 'revenue-chart', title: 'Revenue Trend', size: 'large', position: { x: 0, y: 0 } },
        { id: 'kpi-1', type: 'kpi-summary', title: 'Key Metrics', size: 'medium', position: { x: 2, y: 0 } },
        { id: 'sales-1', type: 'sales-summary', title: 'Sales Summary', size: 'small', position: { x: 0, y: 2 } },
        { id: 'revenue-target-1', type: 'revenue-target', title: 'Revenue vs Target', size: 'small', position: { x: 1, y: 2 } },
        { id: 'top-customers-1', type: 'top-customers', title: 'Top Customers', size: 'medium', position: { x: 2, y: 2 } },
        { id: 'oee-1', type: 'oee-monitor', title: 'OEE Overview', size: 'medium', position: { x: 0, y: 3 } },
      ],
    },
  },
  {
    id: 'plant-manager-dashboard',
    name: 'Plant Manager Dashboard',
    description: 'Overall plant operations, equipment status, and efficiency metrics',
    role: 'plant_manager',
    icon: <Factory className="w-6 h-6" />,
    config: {
      id: 'plant-manager-dashboard',
      name: 'Plant Manager Dashboard',
      widgets: [
        { id: 'oee-1', type: 'oee-monitor', title: 'OEE Monitor', size: 'medium', position: { x: 0, y: 0 } },
        { id: 'machine-1', type: 'machine-status', title: 'Machine Status', size: 'large', position: { x: 2, y: 0 } },
        { id: 'downtime-1', type: 'downtime-tracker', title: 'Downtime Analysis', size: 'medium', position: { x: 0, y: 1 } },
        { id: 'production-1', type: 'production-schedule', title: 'Production Schedule', size: 'large', position: { x: 2, y: 1 } },
        { id: 'quality-1', type: 'quality-metrics', title: 'Quality Metrics', size: 'medium', position: { x: 0, y: 3 } },
        { id: 'alerts-1', type: 'system-alerts', title: 'System Alerts', size: 'medium', position: { x: 2, y: 3 } },
      ],
    },
  },
  {
    id: 'production-dashboard',
    name: 'Production Dashboard',
    description: 'Production schedules, work orders, and quality tracking',
    role: 'production_manager',
    icon: <ClipboardList className="w-6 h-6" />,
    config: {
      id: 'production-dashboard',
      name: 'Production Dashboard',
      widgets: [
        { id: 'schedule-1', type: 'production-schedule', title: 'Production Schedule', size: 'full', position: { x: 0, y: 0 } },
        { id: 'work-orders-1', type: 'work-orders', title: 'Active Work Orders', size: 'medium', position: { x: 0, y: 2 } },
        { id: 'quality-1', type: 'quality-metrics', title: 'Quality Metrics', size: 'medium', position: { x: 2, y: 2 } },
        { id: 'machine-1', type: 'machine-status', title: 'Machine Status', size: 'large', position: { x: 0, y: 3 } },
        { id: 'inventory-1', type: 'inventory-levels', title: 'Material Inventory', size: 'medium', position: { x: 2, y: 3 } },
      ],
    },
  },
  {
    id: 'inventory-dashboard',
    name: 'Inventory Dashboard',
    description: 'Stock levels, warehouse operations, and reorder alerts',
    role: 'inventory_manager',
    icon: <Package className="w-6 h-6" />,
    config: {
      id: 'inventory-dashboard',
      name: 'Inventory Dashboard',
      widgets: [
        { id: 'inventory-1', type: 'inventory-levels', title: 'Inventory Levels', size: 'large', position: { x: 0, y: 0 } },
        { id: 'low-stock-1', type: 'low-stock-alerts', title: 'Low Stock Alerts', size: 'medium', position: { x: 2, y: 0 } },
        { id: 'warehouse-1', type: 'warehouse-map', title: 'Warehouse Map', size: 'large', position: { x: 0, y: 2 } },
        { id: 'delivery-1', type: 'delivery-schedule', title: 'Incoming Deliveries', size: 'medium', position: { x: 2, y: 2 } },
      ],
    },
  },
  {
    id: 'logistics-dashboard',
    name: 'Logistics Dashboard',
    description: 'Shipping schedules, delivery tracking, and fleet management',
    role: 'logistics_manager',
    icon: <Truck className="w-6 h-6" />,
    config: {
      id: 'logistics-dashboard',
      name: 'Logistics Dashboard',
      widgets: [
        { id: 'delivery-1', type: 'delivery-schedule', title: 'Delivery Schedule', size: 'large', position: { x: 0, y: 0 } },
        { id: 'order-1', type: 'order-pipeline', title: 'Order Pipeline', size: 'medium', position: { x: 2, y: 0 } },
        { id: 'alerts-1', type: 'notifications', title: 'Shipping Alerts', size: 'small', position: { x: 0, y: 2 } },
        { id: 'warehouse-1', type: 'warehouse-map', title: 'Warehouse Overview', size: 'large', position: { x: 1, y: 2 } },
      ],
    },
  },
  {
    id: 'sales-dashboard',
    name: 'Sales Dashboard',
    description: 'Sales performance, customer analytics, and pipeline tracking',
    role: 'sales_manager',
    icon: <TrendingUp className="w-6 h-6" />,
    config: {
      id: 'sales-dashboard',
      name: 'Sales Dashboard',
      widgets: [
        { id: 'revenue-1', type: 'revenue-chart', title: 'Revenue Trend', size: 'large', position: { x: 0, y: 0 } },
        { id: 'target-1', type: 'revenue-target', title: 'Revenue vs Target', size: 'medium', position: { x: 2, y: 0 } },
        { id: 'sales-1', type: 'sales-breakdown', title: 'Sales by Category', size: 'medium', position: { x: 0, y: 2 } },
        { id: 'customers-1', type: 'top-customers', title: 'Top Customers', size: 'medium', position: { x: 2, y: 2 } },
        { id: 'pipeline-1', type: 'order-pipeline', title: 'Order Pipeline', size: 'large', position: { x: 0, y: 3 } },
      ],
    },
  },
  {
    id: 'quality-dashboard',
    name: 'Quality Dashboard',
    description: 'Quality metrics, defect tracking, and compliance monitoring',
    role: 'quality_manager',
    icon: <Shield className="w-6 h-6" />,
    config: {
      id: 'quality-dashboard',
      name: 'Quality Dashboard',
      widgets: [
        { id: 'quality-1', type: 'quality-metrics', title: 'Quality Metrics', size: 'large', position: { x: 0, y: 0 } },
        { id: 'gauge-1', type: 'performance-gauge', title: 'Defect Rate', size: 'small', position: { x: 2, y: 0 } },
        { id: 'gauge-2', type: 'performance-gauge', title: 'First Pass Yield', size: 'small', position: { x: 3, y: 0 } },
        { id: 'production-1', type: 'production-schedule', title: 'Inspection Schedule', size: 'large', position: { x: 0, y: 1 } },
        { id: 'alerts-1', type: 'system-alerts', title: 'Quality Alerts', size: 'medium', position: { x: 2, y: 1 } },
      ],
    },
  },
  {
    id: 'maintenance-dashboard',
    name: 'Maintenance Dashboard',
    description: 'Equipment maintenance schedules and downtime tracking',
    role: 'maintenance_manager',
    icon: <Wrench className="w-6 h-6" />,
    config: {
      id: 'maintenance-dashboard',
      name: 'Maintenance Dashboard',
      widgets: [
        { id: 'machine-1', type: 'machine-status', title: 'Equipment Status', size: 'large', position: { x: 0, y: 0 } },
        { id: 'downtime-1', type: 'downtime-tracker', title: 'Downtime Analysis', size: 'medium', position: { x: 2, y: 0 } },
        { id: 'tasks-1', type: 'upcoming-tasks', title: 'Maintenance Tasks', size: 'large', position: { x: 0, y: 2 } },
        { id: 'alerts-1', type: 'system-alerts', title: 'Equipment Alerts', size: 'medium', position: { x: 2, y: 2 } },
      ],
    },
  },
];

// Props
interface DashboardTemplatesProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (template: DashboardTemplate) => void;
  currentRole?: UserRole;
}

export function DashboardTemplates({
  isOpen,
  onClose,
  onSelectTemplate,
  currentRole,
}: DashboardTemplatesProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole | 'all'>(currentRole || 'all');
  const [previewTemplate, setPreviewTemplate] = useState<DashboardTemplate | null>(null);

  const filteredTemplates = selectedRole === 'all'
    ? dashboardTemplates
    : dashboardTemplates.filter(t => t.role === selectedRole);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="fixed inset-4 z-50 flex items-center justify-center">
        <div className="w-full  max-h-full bg-white dark:bg-gray-900 rounded-xl shadow-2xl overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-3 py-2 border-b border-gray-200 dark:border-gray-700">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Dashboard Templates
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Choose a pre-built dashboard for your role
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
            >
              ×
            </button>
          </div>

          {/* Role Filter */}
          <div className="px-3 py-2 border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSelectedRole('all')}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${
                  selectedRole === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                All Roles
              </button>
              {Object.entries(roleInfo).filter(([key]) => key !== 'custom').map(([role, info]) => (
                <button
                  key={role}
                  onClick={() => setSelectedRole(role as UserRole)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${
                    selectedRole === role
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {info.icon}
                  {info.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-3">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {filteredTemplates.map(template => {
                const role = roleInfo[template.role];
                return (
                  <div
                    key={template.id}
                    className="relative p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
                  >
                    {template.isDefault && (
                      <span className="absolute top-2 right-2 px-2 py-0.5 text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full">
                        Recommended
                      </span>
                    )}

                    <div className="flex items-start gap-2 mb-2">
                      <div className="p-3 bg-white dark:bg-gray-700 rounded-lg text-blue-600 dark:text-blue-400">
                        {template.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {template.name}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {template.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                      {role.icon}
                      <span>{role.label}</span>
                      <span className="text-gray-300 dark:text-gray-600">•</span>
                      <span>{template.config.widgets.length} widgets</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setPreviewTemplate(template)}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        Preview
                      </button>
                      <button
                        onClick={() => {
                          onSelectTemplate(template);
                          onClose();
                        }}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                      >
                        <Check className="w-4 h-4" />
                        Use This
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {previewTemplate && (
        <>
          <div
            className="fixed inset-0 bg-black/70 z-[60]"
            onClick={() => setPreviewTemplate(null)}
          />
          <div className="fixed inset-8 z-[60] bg-white dark:bg-gray-900 rounded-xl shadow-2xl overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-3 py-2 border-b border-gray-200 dark:border-gray-700">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {previewTemplate.name} Preview
                </h3>
                <p className="text-sm text-gray-500">{previewTemplate.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    onSelectTemplate(previewTemplate);
                    setPreviewTemplate(null);
                    onClose();
                  }}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
                >
                  <Check className="w-4 h-4" />
                  Use This Template
                </button>
                <button
                  onClick={() => setPreviewTemplate(null)}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-auto p-3 bg-gray-100 dark:bg-gray-800">
              <div className="transform scale-75 origin-top-left">
                <DashboardLayout
                  config={previewTemplate.config}
                  widgetRenderer={(widget) => (
                    <div className="h-full flex items-center justify-center text-gray-400">
                      <div className="text-center">
                        <BarChart3 className="w-8 h-8 mb-2 opacity-30" />
                        <p className="text-sm">{widget.title}</p>
                        <p className="text-xs opacity-50">{widget.type}</p>
                      </div>
                    </div>
                  )}
                />
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

// Hook for template selection
export function useDashboardTemplates() {
  const [isOpen, setIsOpen] = useState(false);

  return {
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
    toggle: () => setIsOpen(prev => !prev),
  };
}

export { roleInfo };
export type { DashboardTemplatesProps };

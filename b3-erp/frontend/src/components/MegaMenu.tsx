'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Users,
  ShoppingCart,
  Package,
  Factory,
  DollarSign,
  UserCog,
  ShoppingBag,
  Calculator,
  Workflow,
  BarChart3,
  Truck,
  Headphones,
  Settings,
  FolderKanban,
  ChevronDown,
  LucideIcon,
  ArrowRight,
  Briefcase,
} from 'lucide-react';

interface MegaMenuItem {
  id: string;
  name: string;
  href: string;
  description: string;
}

interface MegaMenuSection {
  id: string;
  name: string;
  icon: LucideIcon;
  color: string;
  items: MegaMenuItem[];
}

const megaMenuData: Record<string, MegaMenuSection[]> = {
  sales: [
    {
      id: 'crm',
      name: 'CRM',
      icon: Users,
      color: 'text-blue-600 bg-blue-50',
      items: [
        { id: 'customers', name: 'Customers', href: '/crm/customers', description: 'Manage customer database and profiles' },
        { id: 'leads', name: 'Leads', href: '/crm/leads', description: 'Track and convert leads' },
        { id: 'contacts', name: 'Contacts', href: '/crm/contacts', description: 'Contact management system' },
        { id: 'interactions', name: 'Interactions', href: '/crm/interactions', description: 'Log customer interactions' },
      ],
    },
    {
      id: 'sales-ops',
      name: 'Sales Operations',
      icon: ShoppingCart,
      color: 'text-green-600 bg-green-50',
      items: [
        { id: 'rfp', name: 'RFP/Proposals', href: '/sales/rfp', description: 'Create and manage proposals' },
        { id: 'quotations', name: 'Quotations', href: '/sales/quotations', description: 'Generate customer quotes' },
        { id: 'orders', name: 'Sales Orders', href: '/sales/orders', description: 'Process and track orders' },
        { id: 'handover', name: 'Order Handover', href: '/sales/handover', description: 'Handover to production team' },
      ],
    },
    {
      id: 'estimation',
      name: 'Estimation & Costing',
      icon: Calculator,
      color: 'text-purple-600 bg-purple-50',
      items: [
        { id: 'boq', name: 'BOQ Analysis', href: '/estimation/boq', description: 'Bill of quantities analysis' },
        { id: 'costing', name: 'Cost Estimation', href: '/estimation/costing', description: 'Calculate project costs' },
        { id: 'pricing', name: 'Pricing Strategy', href: '/estimation/pricing', description: 'Dynamic pricing models' },
      ],
    },
  ],
  operations: [
    {
      id: 'projects',
      name: 'Project Management',
      icon: Briefcase,
      color: 'text-purple-600 bg-purple-50',
      items: [
        { id: 'dashboard', name: 'Project Dashboard', href: '/project-management/1/dashboard', description: 'Overview and key metrics' },
        { id: 'gantt', name: 'Gantt Chart', href: '/project-management/gantt', description: 'Interactive timeline & dependencies' },
        { id: 'resources', name: 'Resource Management', href: '/project-management/resources', description: 'Allocation & capacity planning' },
        { id: 'budget', name: 'Budget Management', href: '/project-management/budget', description: 'Cost tracking & forecasting' },
        { id: 'tasks', name: 'Task Board', href: '/project-management/tasks', description: 'Kanban board for tasks' },
      ],
    },
    {
      id: 'production',
      name: 'Production',
      icon: Factory,
      color: 'text-red-600 bg-red-50',
      items: [
        { id: 'ppg', name: 'PPG Planning', href: '/production/ppg', description: 'Production planning group' },
        { id: 'work-orders', name: 'Work Orders', href: '/production/work-orders', description: 'Manufacturing work orders' },
        { id: 'scheduling', name: 'Production Scheduling', href: '/production/scheduling', description: 'Schedule production runs' },
        { id: 'floor', name: 'Shop Floor', href: '/production/floor', description: 'Floor operations management' },
        { id: 'quality', name: 'Quality Control', href: '/production/quality', description: 'QC and testing' },
      ],
    },
    {
      id: 'inventory',
      name: 'Inventory & Warehouse',
      icon: Package,
      color: 'text-orange-600 bg-orange-50',
      items: [
        { id: 'warehouse', name: 'Warehouse Management', href: '/inventory/warehouse', description: 'Multi-warehouse operations' },
        { id: 'stock', name: 'Stock Management', href: '/inventory/stock', description: 'Real-time stock tracking' },
        { id: 'movements', name: 'Stock Movements', href: '/inventory/movements', description: 'Track material movements' },
        { id: 'transfers', name: 'Inter-Warehouse Transfers', href: '/inventory/transfers', description: 'Transfer between locations' },
      ],
    },
    {
      id: 'procurement',
      name: 'Procurement',
      icon: ShoppingBag,
      color: 'text-indigo-600 bg-indigo-50',
      items: [
        { id: 'requisitions', name: 'Purchase Requisitions', href: '/procurement/requisitions', description: 'Material requisitions' },
        { id: 'rfq', name: 'RFQ Management', href: '/procurement/rfq', description: 'Request for quotations' },
        { id: 'po', name: 'Purchase Orders', href: '/procurement/po', description: 'Create and track POs' },
        { id: 'vendors', name: 'Vendor Management', href: '/procurement/vendors', description: 'Supplier database' },
        { id: 'grn', name: 'Goods Receipt', href: '/procurement/grn', description: 'Receive and verify goods' },
      ],
    },
  ],
  projects: [
    {
      id: 'project-overview',
      name: 'Overview & Planning',
      icon: FolderKanban,
      color: 'text-cyan-600 bg-cyan-50',
      items: [
        { id: 'pm-dashboard', name: 'Dashboard', href: '/project-management/dashboard', description: 'Overview & analytics' },
        { id: 'all-projects', name: 'All Projects', href: '/project-management', description: 'Project list' },
        { id: 'create-project', name: 'Create Project', href: '/project-management/create', description: 'New project' },
        { id: 'analytics', name: 'Analytics', href: '/project-management/analytics', description: 'Project analytics' },
        { id: 'templates', name: 'Templates', href: '/project-management/templates', description: 'Project templates' },
        { id: 'project-types', name: 'Project Types', href: '/project-management/project-types', description: 'Type management' },
      ],
    },
    {
      id: 'project-execution',
      name: 'Execution & Tracking',
      icon: FolderKanban,
      color: 'text-blue-600 bg-blue-50',
      items: [
        { id: 'deliverables', name: 'Deliverables', href: '/project-management/deliverables', description: 'Track deliverables' },
        { id: 'tasks', name: 'Tasks', href: '/project-management/tasks', description: 'Task management' },
        { id: 'schedule', name: 'Schedule', href: '/project-management/schedule', description: 'Gantt chart' },
        { id: 'timeline', name: 'Timeline', href: '/project-management/timeline', description: 'Project timeline' },
        { id: 'progress', name: 'Progress Tracking', href: '/project-management/progress', description: 'Track progress' },
        { id: 'wbs', name: 'WBS', href: '/project-management/wbs', description: 'Work breakdown structure' },
        { id: 'milestone-templates', name: 'Milestone Templates', href: '/project-management/milestone-templates', description: 'Milestone templates' },
      ],
    },
    {
      id: 'project-resources',
      name: 'Resources & Costs',
      icon: FolderKanban,
      color: 'text-green-600 bg-green-50',
      items: [
        { id: 'resources', name: 'Resources', href: '/project-management/resources', description: 'Resource list' },
        { id: 'resource-allocation', name: 'Resource Allocation', href: '/project-management/resource-allocation', description: 'Allocate resources' },
        { id: 'resource-utilization', name: 'Resource Utilization', href: '/project-management/resource-utilization', description: 'Track utilization' },
        { id: 'budget', name: 'Budget', href: '/project-management/budget', description: 'Budget management' },
        { id: 'project-costing', name: 'Project Costing', href: '/project-management/project-costing', description: 'Cost tracking' },
        { id: 'profitability', name: 'Profitability', href: '/project-management/profitability', description: 'Profit analysis' },
        { id: 'labor-tracking', name: 'Labor Tracking', href: '/project-management/labor-tracking', description: 'Track labor costs' },
        { id: 'material-consumption', name: 'Material Consumption', href: '/project-management/material-consumption', description: 'Material usage' },
        { id: 'mrp', name: 'MRP', href: '/project-management/mrp', description: 'Material planning' },
      ],
    },
    {
      id: 'project-operations',
      name: 'Site & Operations',
      icon: FolderKanban,
      color: 'text-orange-600 bg-orange-50',
      items: [
        { id: 'site-survey', name: 'Site Survey', href: '/project-management/site-survey', description: 'Site surveys' },
        { id: 'site-issues', name: 'Site Issues', href: '/project-management/site-issues', description: 'Site problems' },
        { id: 'installation-tracking', name: 'Installation Tracking', href: '/project-management/installation-tracking', description: 'Track installations' },
        { id: 'commissioning', name: 'Commissioning', href: '/project-management/commissioning', description: 'Commissioning tasks' },
        { id: 'quality-inspection', name: 'Quality Inspection', href: '/project-management/quality-inspection', description: 'Quality checks' },
        { id: 'customer-acceptance', name: 'Customer Acceptance', href: '/project-management/customer-acceptance', description: 'Acceptance tracking' },
      ],
    },
    {
      id: 'project-admin',
      name: 'Issues & Admin',
      icon: FolderKanban,
      color: 'text-purple-600 bg-purple-50',
      items: [
        { id: 'issues', name: 'Issues', href: '/project-management/issues', description: 'Issue tracking' },
        { id: 'change-orders', name: 'Change Orders', href: '/project-management/change-orders', description: 'Change requests' },
        { id: 'documents', name: 'Documents', href: '/project-management/documents', description: 'Document management' },
        { id: 'reports', name: 'Reports', href: '/project-management/reports', description: 'Project reports' },
        { id: 'settings', name: 'Settings', href: '/project-management/settings', description: 'PM settings' },
      ],
    },
    {
      id: 'logistics',
      name: 'Logistics',
      icon: Truck,
      color: 'text-lime-600 bg-lime-50',
      items: [
        { id: 'shipping', name: 'Shipping Management', href: '/logistics/shipping', description: 'Manage shipments' },
        { id: 'tracking', name: 'Shipment Tracking', href: '/logistics/tracking', description: 'Track deliveries' },
        { id: 'carriers', name: 'Carrier Management', href: '/logistics/carriers', description: 'Manage logistics partners' },
      ],
    },
  ],
  admin: [
    {
      id: 'finance',
      name: 'Finance & Accounting',
      icon: DollarSign,
      color: 'text-yellow-600 bg-yellow-50',
      items: [
        { id: 'accounting', name: 'General Accounting', href: '/finance/accounting', description: 'General ledger and journals' },
        { id: 'invoices', name: 'Invoice Management', href: '/finance/invoices', description: 'Create and track invoices' },
        { id: 'payments', name: 'Payment Processing', href: '/finance/payments', description: 'Process payments' },
        { id: 'receivables', name: 'Accounts Receivable', href: '/finance/receivables', description: 'AR management' },
        { id: 'payables', name: 'Accounts Payable', href: '/finance/payables', description: 'AP management' },
      ],
    },
    {
      id: 'hr',
      name: 'Human Resources',
      icon: UserCog,
      color: 'text-pink-600 bg-pink-50',
      items: [
        { id: 'employees', name: 'Employee Management', href: '/hr/employees', description: 'Employee records and profiles' },
        { id: 'attendance', name: 'Attendance System', href: '/hr/attendance', description: 'Time and attendance' },
        { id: 'payroll', name: 'Payroll Processing', href: '/hr/payroll', description: 'Salary processing' },
        { id: 'leave', name: 'Leave Management', href: '/hr/leave', description: 'Leave requests and approvals' },
        { id: 'performance', name: 'Performance Reviews', href: '/hr/performance', description: 'Employee performance' },
      ],
    },
    {
      id: 'workflow-automation',
      name: 'Workflow Automation',
      icon: Workflow,
      color: 'text-blue-600 bg-blue-50',
      items: [
        { id: 'workflow-overview', name: 'Overview Dashboard', href: '/admin/workflow-overview', description: 'Central hub for workflows' },
        { id: 'workflows', name: 'Manage Workflows', href: '/admin/workflows', description: 'View and edit all workflows' },
        { id: 'workflow-builder', name: 'Workflow Builder', href: '/admin/workflows/builder', description: 'Create new workflows' },
        { id: 'pending-approvals', name: 'Pending Approvals', href: '/workflow/approvals', description: 'Review and action approvals' },
        { id: 'sla-analytics', name: 'SLA Analytics', href: '/admin/sla-analytics', description: 'Performance metrics & compliance' },
        { id: 'delay-analysis', name: 'Delay Analysis', href: '/admin/delay-analysis', description: 'Identify bottlenecks & delays' },
      ],
    },
    {
      id: 'system',
      name: 'System & Support',
      icon: Settings,
      color: 'text-gray-600 bg-gray-50',
      items: [
        { id: 'reports', name: 'Reports & Analytics', href: '/reports/analytics', description: 'Business intelligence' },
        { id: 'support', name: 'Support & Incidents', href: '/support/tickets', description: 'Help desk management' },
        { id: 'it-admin', name: 'IT Administration', href: '/it-admin/users', description: 'User and system settings' },
      ],
    },
  ],
};

interface MegaMenuProps {
  activeMenu: string | null;
  onClose: () => void;
}

export default function MegaMenu({ activeMenu, onClose }: MegaMenuProps) {
  if (!activeMenu || !megaMenuData[activeMenu]) {
    return null;
  }

  const sections = megaMenuData[activeMenu];

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-30 z-40"
        onClick={onClose}
      />

      {/* Mega Menu Panel */}
      <div className="absolute top-full left-0 right-0 bg-white border-t border-gray-200 shadow-2xl z-50 animate-slideDown max-h-[80vh] overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <div key={section.id} className="space-y-3">
                  {/* Section Header */}
                  <div className="flex items-center space-x-2 pb-2 border-b border-gray-200">
                    <div className={`p-1.5 rounded-lg ${section.color}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <h3 className="text-base font-bold text-gray-900">{section.name}</h3>
                  </div>

                  {/* Section Items */}
                  <div className="space-y-1">
                    {section.items.map((item) => (
                      <Link
                        key={item.id}
                        href={item.href}
                        onClick={onClose}
                        className="block p-2 rounded-lg hover:bg-blue-50 transition-colors group"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors flex items-center">
                              {item.name}
                              <ArrowRight className="h-3 w-3 ml-1.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                            </h4>
                            <p className="text-xs text-gray-600 mt-0.5">{item.description}</p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Actions Footer */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-0.5">Need help navigating?</h4>
                <p className="text-xs text-gray-600">Check our documentation or contact support</p>
              </div>
              <div className="flex space-x-4">
                <Link
                  href="/help"
                  className="text-sm font-medium text-blue-600 hover:text-blue-700"
                  onClick={onClose}
                >
                  View Documentation →
                </Link>
                <Link
                  href="/support"
                  className="text-sm font-medium text-blue-600 hover:text-blue-700"
                  onClick={onClose}
                >
                  Contact Support →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.2s ease-out;
        }
      `}</style>
    </>
  );
}

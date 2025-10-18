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
  ChevronDown,
  ChevronRight,
  Home,
  FileText,
  ClipboardList,
  Warehouse,
  Wrench,
  FolderKanban,
  LucideIcon,
  Shield,
  AlertCircle,
} from 'lucide-react';

interface SubMenuItem {
  id: string;
  name: string;
  href: string;
  description?: string;
}

interface MenuItem {
  id: string;
  name: string;
  icon: LucideIcon;
  href?: string;
  color: string;
  subItems?: SubMenuItem[];
}

const menuItems: MenuItem[] = [
  {
    id: 'dashboard',
    name: 'Dashboard',
    icon: Home,
    href: '/dashboard',
    color: 'text-blue-600',
  },
  {
    id: 'crm',
    name: 'CRM',
    icon: Users,
    color: 'text-blue-600',
    subItems: [
      { id: 'customers', name: 'Customers', href: '/crm/customers', description: 'Customer database' },
      { id: 'leads', name: 'Leads', href: '/crm/leads', description: 'Lead management' },
      { id: 'contacts', name: 'Contacts', href: '/crm/contacts', description: 'Contact management' },
      { id: 'interactions', name: 'Interactions', href: '/crm/interactions', description: 'Customer interactions' },
    ],
  },
  {
    id: 'sales',
    name: 'Sales',
    icon: ShoppingCart,
    color: 'text-green-600',
    subItems: [
      { id: 'rfp', name: 'RFP/Proposals', href: '/sales/rfp', description: 'Manage proposals' },
      { id: 'quotations', name: 'Quotations', href: '/sales/quotations', description: 'Create quotations' },
      { id: 'orders', name: 'Sales Orders', href: '/sales/orders', description: 'Manage orders' },
      { id: 'handover', name: 'Order Handover', href: '/sales/handover', description: 'Handover to production' },
    ],
  },
  {
    id: 'estimation',
    name: 'Estimation',
    icon: Calculator,
    color: 'text-purple-600',
    subItems: [
      { id: 'boq', name: 'BOQ Analysis', href: '/estimation/boq', description: 'Bill of quantities' },
      { id: 'costing', name: 'Cost Estimation', href: '/estimation/costing', description: 'Calculate costs' },
      { id: 'pricing', name: 'Pricing', href: '/estimation/pricing', description: 'Price calculation' },
    ],
  },
  {
    id: 'production',
    name: 'Production',
    icon: Factory,
    color: 'text-red-600',
    subItems: [
      { id: 'ppg', name: 'PPG Planning', href: '/production/ppg', description: 'Production planning' },
      { id: 'work-orders', name: 'Work Orders', href: '/production/work-orders', description: 'Production orders' },
      { id: 'scheduling', name: 'Scheduling', href: '/production/scheduling', description: 'Schedule production' },
      { id: 'floor', name: 'Shop Floor', href: '/production/floor', description: 'Floor operations' },
      { id: 'quality', name: 'Quality Control', href: '/production/quality', description: 'Quality checks' },
    ],
  },
  {
    id: 'inventory',
    name: 'Inventory',
    icon: Package,
    color: 'text-orange-600',
    subItems: [
      { id: 'warehouse', name: 'Warehouse', href: '/inventory/warehouse', description: 'Warehouse management' },
      { id: 'stock', name: 'Stock Management', href: '/inventory/stock', description: 'Stock levels' },
      { id: 'movements', name: 'Stock Movements', href: '/inventory/movements', description: 'Track movements' },
      { id: 'transfers', name: 'Transfers', href: '/inventory/transfers', description: 'Inter-warehouse' },
    ],
  },
  {
    id: 'procurement',
    name: 'Procurement',
    icon: ShoppingBag,
    color: 'text-indigo-600',
    subItems: [
      { id: 'requisitions', name: 'Purchase Requisitions', href: '/procurement/requisitions', description: 'Material requests' },
      { id: 'rfq', name: 'RFQ Management', href: '/procurement/rfq', description: 'Request for quotes' },
      { id: 'po', name: 'Purchase Orders', href: '/procurement/po', description: 'Purchase orders' },
      { id: 'vendors', name: 'Vendor Management', href: '/procurement/vendors', description: 'Vendor database' },
      { id: 'grn', name: 'Goods Receipt', href: '/procurement/grn', description: 'Receive goods' },
    ],
  },
  {
    id: 'project-management',
    name: 'Project Management',
    icon: FolderKanban,
    color: 'text-cyan-600',
    subItems: [
      { id: 'pm-dashboard', name: 'Dashboard', href: '/project-management/dashboard', description: 'Overview & analytics' },
      { id: 'projects', name: 'All Projects', href: '/project-management', description: 'Project list' },
      { id: 'create-project', name: 'Create Project', href: '/project-management/create', description: 'New project' },
      { id: 'analytics', name: 'Analytics', href: '/project-management/analytics', description: 'Project analytics' },
      { id: 'deliverables', name: 'Deliverables', href: '/project-management/deliverables', description: 'Track deliverables' },
      { id: 'tasks', name: 'Tasks', href: '/project-management/tasks', description: 'Task management' },
      { id: 'schedule', name: 'Schedule', href: '/project-management/schedule', description: 'Gantt chart' },
      { id: 'timeline', name: 'Timeline', href: '/project-management/timeline', description: 'Project timeline' },
      { id: 'progress', name: 'Progress Tracking', href: '/project-management/progress', description: 'Track progress' },
      { id: 'wbs', name: 'WBS', href: '/project-management/wbs', description: 'Work breakdown' },
      { id: 'resources', name: 'Resources', href: '/project-management/resources', description: 'Resource list' },
      { id: 'resource-allocation', name: 'Resource Allocation', href: '/project-management/resource-allocation', description: 'Allocate resources' },
      { id: 'resource-utilization', name: 'Resource Utilization', href: '/project-management/resource-utilization', description: 'Track utilization' },
      { id: 'budget', name: 'Budget', href: '/project-management/budget', description: 'Budget management' },
      { id: 'project-costing', name: 'Project Costing', href: '/project-management/project-costing', description: 'Cost tracking' },
      { id: 'profitability', name: 'Profitability', href: '/project-management/profitability', description: 'Profit analysis' },
      { id: 'issues', name: 'Issues', href: '/project-management/issues', description: 'Issue tracking' },
      { id: 'change-orders', name: 'Change Orders', href: '/project-management/change-orders', description: 'Change requests' },
      { id: 'documents', name: 'Documents', href: '/project-management/documents', description: 'Document management' },
      { id: 'site-survey', name: 'Site Survey', href: '/project-management/site-survey', description: 'Site surveys' },
      { id: 'site-issues', name: 'Site Issues', href: '/project-management/site-issues', description: 'Site problems' },
      { id: 'installation-tracking', name: 'Installation Tracking', href: '/project-management/installation-tracking', description: 'Track installations' },
      { id: 'commissioning', name: 'Commissioning', href: '/project-management/commissioning', description: 'Commissioning tasks' },
      { id: 'quality-inspection', name: 'Quality Inspection', href: '/project-management/quality-inspection', description: 'Quality checks' },
      { id: 'customer-acceptance', name: 'Customer Acceptance', href: '/project-management/customer-acceptance', description: 'Acceptance tracking' },
      { id: 'labor-tracking', name: 'Labor Tracking', href: '/project-management/labor-tracking', description: 'Track labor' },
      { id: 'material-consumption', name: 'Material Consumption', href: '/project-management/material-consumption', description: 'Material usage' },
      { id: 'mrp', name: 'MRP', href: '/project-management/mrp', description: 'Material planning' },
      { id: 'templates', name: 'Templates', href: '/project-management/templates', description: 'Project templates' },
      { id: 'milestone-templates', name: 'Milestone Templates', href: '/project-management/milestone-templates', description: 'Milestone templates' },
      { id: 'project-types', name: 'Project Types', href: '/project-management/project-types', description: 'Type management' },
      { id: 'reports', name: 'Reports', href: '/project-management/reports', description: 'Project reports' },
      { id: 'settings', name: 'Settings', href: '/project-management/settings', description: 'PM settings' },
    ],
  },
  {
    id: 'finance',
    name: 'Finance',
    icon: DollarSign,
    color: 'text-yellow-600',
    subItems: [
      { id: 'accounting', name: 'Accounting', href: '/finance/accounting', description: 'General ledger' },
      { id: 'costing', name: 'Job Costing', href: '/finance/costing', description: 'Cost management' },
      { id: 'invoices', name: 'Invoices', href: '/finance/invoices', description: 'Invoice management' },
      { id: 'payments', name: 'Payments', href: '/finance/payments', description: 'Payment processing' },
      { id: 'receivables', name: 'Receivables', href: '/finance/receivables', description: 'AR management' },
      { id: 'payables', name: 'Payables', href: '/finance/payables', description: 'AP management' },
    ],
  },
  {
    id: 'hr',
    name: 'HR',
    icon: UserCog,
    color: 'text-pink-600',
    subItems: [
      { id: 'employees', name: 'Employee Management', href: '/hr/employees', description: 'Employee database' },
      { id: 'attendance', name: 'Attendance', href: '/hr/attendance', description: 'Track attendance' },
      { id: 'payroll', name: 'Payroll', href: '/hr/payroll', description: 'Process payroll' },
      { id: 'leave', name: 'Leave Management', href: '/hr/leave', description: 'Manage leaves' },
      { id: 'performance', name: 'Performance', href: '/hr/performance', description: 'Performance reviews' },
    ],
  },
  {
    id: 'workflow',
    name: 'Workflow',
    icon: Workflow,
    color: 'text-cyan-600',
    subItems: [
      { id: 'automation', name: 'Automation', href: '/workflow/automation', description: 'Workflow automation' },
      { id: 'approvals', name: 'Approvals', href: '/workflow/approvals', description: 'Approval workflows' },
      { id: 'templates', name: 'Templates', href: '/workflow/templates', description: 'Workflow templates' },
    ],
  },
  {
    id: 'reports',
    name: 'Reports',
    icon: BarChart3,
    color: 'text-teal-600',
    subItems: [
      { id: 'analytics', name: 'Analytics', href: '/reports/analytics', description: 'Business analytics' },
      { id: 'dashboards', name: 'Dashboards', href: '/reports/dashboards', description: 'Custom dashboards' },
      { id: 'custom', name: 'Custom Reports', href: '/reports/custom', description: 'Build reports' },
    ],
  },
  {
    id: 'logistics',
    name: 'Logistics',
    icon: Truck,
    color: 'text-lime-600',
    subItems: [
      { id: 'shipping', name: 'Shipping', href: '/logistics/shipping', description: 'Shipment management' },
      { id: 'tracking', name: 'Tracking', href: '/logistics/tracking', description: 'Track shipments' },
      { id: 'carriers', name: 'Carriers', href: '/logistics/carriers', description: 'Carrier management' },
    ],
  },
  {
    id: 'after-sales-service',
    name: 'After Sales Service',
    icon: Wrench,
    color: 'text-emerald-600',
    subItems: [
      { id: 'ass-dashboard', name: 'Service Dashboard', href: '/after-sales-service/dashboard', description: 'Main overview' },
      { id: 'service-contracts', name: 'Service Contracts', href: '/after-sales-service/service-contracts', description: 'AMC management' },
      { id: 'warranties', name: 'Warranties', href: '/after-sales-service/warranties', description: 'Warranty tracking' },
      { id: 'service-requests', name: 'Service Requests', href: '/after-sales-service/service-requests', description: 'Ticket management' },
      { id: 'installations', name: 'Installations', href: '/after-sales-service/installations', description: 'Installation jobs' },
      { id: 'field-service', name: 'Field Service', href: '/after-sales-service/field-service/dispatch', description: 'Field operations' },
      { id: 'billing', name: 'Service Billing', href: '/after-sales-service/billing', description: 'Invoice management' },
    ],
  },
  {
    id: 'support',
    name: 'Support',
    icon: Headphones,
    color: 'text-rose-600',
    subItems: [
      { id: 'tickets', name: 'Support Tickets', href: '/support/tickets', description: 'Ticket management' },
      { id: 'incidents', name: 'Incidents', href: '/support/incidents', description: 'Incident tracking' },
      { id: 'knowledge', name: 'Knowledge Base', href: '/support/knowledge', description: 'Documentation' },
    ],
  },
  {
    id: 'it-admin',
    name: 'IT Admin',
    icon: Settings,
    color: 'text-gray-600',
    subItems: [
      { id: 'users', name: 'User Management', href: '/it-admin/users', description: 'Manage users' },
      { id: 'roles', name: 'Roles & Permissions', href: '/it-admin/roles', description: 'Role management' },
      { id: 'system', name: 'System Settings', href: '/it-admin/system', description: 'System config' },
      { id: 'audit', name: 'Audit Logs', href: '/it-admin/audit', description: 'Activity logs' },
    ],
  },
];

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleItem = (itemId: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-white border-r border-gray-200 z-50 transition-all duration-300 ${
          isOpen ? 'w-72' : 'w-0 lg:w-20'
        } overflow-hidden flex flex-col shadow-lg`}
      >
        {/* Header */}
        <div className="h-16 border-b border-gray-200 flex items-center justify-between px-4 bg-gradient-to-r from-blue-600 to-indigo-600">
          {isOpen && (
            <h2 className="text-lg font-bold text-white">B3 MACBIS</h2>
          )}
          <button
            onClick={onToggle}
            className="p-2 rounded-lg hover:bg-white/20 text-white transition-colors"
          >
            <ChevronRight className={`h-5 w-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 overflow-y-auto py-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isExpanded = expandedItems.has(item.id);
            const hasSubItems = item.subItems && item.subItems.length > 0;

            return (
              <div key={item.id} className="mb-1">
                {hasSubItems ? (
                  <button
                    onClick={() => toggleItem(item.id)}
                    className={`w-full flex items-center justify-between px-4 py-3 hover:bg-blue-50 transition-colors ${
                      isExpanded ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className={`h-5 w-5 ${item.color}`} />
                      {isOpen && (
                        <span className="font-medium text-gray-700">{item.name}</span>
                      )}
                    </div>
                    {isOpen && (
                      <ChevronDown
                        className={`h-4 w-4 text-gray-500 transition-transform ${
                          isExpanded ? 'rotate-180' : ''
                        }`}
                      />
                    )}
                  </button>
                ) : (
                  <Link
                    href={item.href || '#'}
                    className="flex items-center space-x-3 px-4 py-3 hover:bg-blue-50 transition-colors"
                  >
                    <Icon className={`h-5 w-5 ${item.color}`} />
                    {isOpen && (
                      <span className="font-medium text-gray-700">{item.name}</span>
                    )}
                  </Link>
                )}

                {/* Sub-items */}
                {hasSubItems && isExpanded && isOpen && (
                  <div className="bg-white border-l-2 border-blue-400 ml-4">
                    {item.subItems!.map((subItem) => (
                      <Link
                        key={subItem.id}
                        href={subItem.href}
                        className="block px-8 py-2.5 text-sm text-gray-600 hover:text-blue-600 hover:bg-white transition-colors group"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium group-hover:translate-x-1 transition-transform">
                            {subItem.name}
                          </span>
                        </div>
                        {subItem.description && (
                          <span className="text-xs text-gray-500 block mt-0.5">
                            {subItem.description}
                          </span>
                        )}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Footer */}
        {isOpen && (
          <div className="border-t border-gray-200 p-4 bg-white">
            <p className="text-xs text-gray-500 text-center">
              B3 MACBIS - Kitchen Manufacturing ERP
            </p>
            <p className="text-xs text-gray-400 text-center mt-1">
              Powered by KreupAI Technologies LLC
            </p>
          </div>
        )}
      </aside>
    </>
  );
}

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
  Database,
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
      { id: 'strategic-sourcing', name: 'Strategic Sourcing', href: '/procurement/strategic-sourcing', description: 'Sourcing strategy & optimization' },
      { id: 'supplier-relationship', name: 'Supplier Relationship', href: '/procurement/supplier-relationship', description: 'SRM & partnerships' },
      { id: 'purchase-requisition', name: 'Purchase Requisition', href: '/procurement/purchase-requisition', description: 'Requisition workflow' },
      { id: 'rfq-rfp', name: 'RFQ/RFP Management', href: '/procurement/rfq-rfp', description: 'Bidding & proposals' },
      { id: 'contract-management', name: 'Contract Management', href: '/procurement/contract-management', description: 'Contract lifecycle' },
      { id: 'spend-analysis', name: 'Spend Analysis', href: '/procurement/spend-analysis', description: 'Spend optimization' },
      { id: 'supplier-scorecard', name: 'Supplier Scorecard', href: '/procurement/supplier-scorecard', description: 'Performance evaluation' },
      { id: 'procurement-automation', name: 'Procurement Automation', href: '/procurement/automation', description: 'AI & automation' },
      { id: 'supplier-onboarding', name: 'Supplier Onboarding', href: '/procurement/supplier-onboarding', description: 'Onboarding portal' },
      { id: 'quality-assurance', name: 'Quality Assurance', href: '/procurement/quality-assurance', description: 'Quality control & inspection' },
      { id: 'risk-management', name: 'Risk Management', href: '/procurement/risk-management', description: 'Risk assessment & mitigation' },
      { id: 'e-marketplace', name: 'E-Procurement Marketplace', href: '/procurement/e-marketplace', description: 'Digital marketplace' },
      { id: 'analytics', name: 'Procurement Analytics', href: '/procurement/analytics', description: 'Analytics & insights' },
      { id: 'collaboration', name: 'Supplier Collaboration', href: '/procurement/collaboration', description: 'Collaboration portal' },
      { id: 'compliance', name: 'Compliance Management', href: '/procurement/compliance', description: 'Regulatory compliance' },
      { id: 'category-management', name: 'Category Management', href: '/procurement/category-management', description: 'Strategic categories' },
      { id: 'budget-tracking', name: 'Budget Tracking', href: '/procurement/budget-tracking', description: 'Budget management' },
      { id: 'supplier-diversity', name: 'Supplier Diversity', href: '/procurement/supplier-diversity', description: 'Diversity & inclusion' },
      { id: 'savings-tracker', name: 'Savings Tracker', href: '/procurement/savings-tracker', description: 'Cost savings tracking' },
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
      { id: 'finance-dashboard', name: 'Finance Dashboard', href: '/finance/dashboard', description: 'Financial overview' },
      { id: 'cash-flow', name: 'Cash Flow Management', href: '/finance/cash-flow', description: 'Cash flow forecasting' },
      { id: 'accounts-receivable', name: 'Accounts Receivable', href: '/finance/accounts-receivable', description: 'AR management' },
      { id: 'accounts-payable', name: 'Accounts Payable', href: '/finance/accounts-payable', description: 'AP workflow' },
      { id: 'financial-reporting', name: 'Financial Reporting', href: '/finance/reporting', description: 'Reports & statements' },
      { id: 'budget-management', name: 'Budget Management', href: '/finance/budget', description: 'Budget planning' },
      { id: 'asset-management', name: 'Asset Management', href: '/finance/assets', description: 'Fixed assets' },
      { id: 'general-ledger', name: 'General Ledger', href: '/finance/general-ledger', description: 'Journal entries' },
      { id: 'tax-management', name: 'Tax Management', href: '/finance/tax', description: 'Tax compliance' },
      { id: 'financial-analytics', name: 'Financial Analytics', href: '/finance/analytics', description: 'Advanced analytics' },
      { id: 'multi-currency', name: 'Multi-Currency', href: '/finance/multi-currency', description: 'Currency management' },
      { id: 'cost-center', name: 'Cost Centers', href: '/finance/cost-centers', description: 'Cost allocation' },
      { id: 'financial-controls', name: 'Financial Controls', href: '/finance/controls', description: 'Audit & controls' },
      { id: 'bank-reconciliation', name: 'Bank Reconciliation', href: '/finance/bank-reconciliation', description: 'Bank matching' },
      { id: 'consolidation', name: 'Financial Consolidation', href: '/finance/consolidation', description: 'Multi-entity reporting' },
      { id: 'investment-portfolio', name: 'Investment Portfolio', href: '/finance/investments', description: 'Portfolio management' },
      { id: 'credit-management', name: 'Credit Management', href: '/finance/credit', description: 'Credit limits' },
      { id: 'period-management', name: 'Period Management', href: '/finance/periods', description: 'Closing procedures' },
      { id: 'financial-workflows', name: 'Financial Workflows', href: '/finance/workflows', description: 'Approval processes' },
      { id: 'integrations', name: 'Integrations', href: '/finance/integrations', description: 'External systems' },
      { id: 'automation', name: 'Financial Automation', href: '/finance/automation', description: 'Automated rules' },
      { id: 'finance-settings', name: 'Settings', href: '/finance/settings', description: 'Finance configuration' },
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
    id: 'common-masters',
    name: 'Common Masters',
    icon: Database,
    color: 'text-slate-600',
    subItems: [
      // Organization & Company Masters
      { id: 'company-master', name: 'Company Master', href: '/common-masters/company-master', description: 'Multiple company/entity management' },
      { id: 'branch-master', name: 'Branch/Location Master', href: '/common-masters/branch-master', description: 'All operational locations' },
      { id: 'department-master', name: 'Department Master', href: '/common-masters/department-master', description: 'Organizational departments' },
      { id: 'cost-center-master', name: 'Cost Center Master', href: '/common-masters/cost-center-master', description: 'Cost allocation centers' },
      { id: 'plant-master', name: 'Plant/Factory Master', href: '/common-masters/plant-master', description: 'Manufacturing facilities' },
      { id: 'warehouse-master', name: 'Warehouse Master', href: '/common-masters/warehouse-master', description: 'Storage locations' },
      { id: 'currency-master', name: 'Currency Master', href: '/common-masters/currency-master', description: 'Multi-currency support' },
      { id: 'exchange-rate-master', name: 'Exchange Rate Master', href: '/common-masters/exchange-rate-master', description: 'Currency conversion rates' },

      // Product & Item Masters
      { id: 'item-master', name: 'Item Master', href: '/common-masters/item-master', description: 'Complete product/material catalog' },
      { id: 'item-category-master', name: 'Item Category Master', href: '/common-masters/item-category-master', description: 'Product categorization' },
      { id: 'item-group-master', name: 'Item Group Master', href: '/common-masters/item-group-master', description: 'Product grouping' },
      { id: 'brand-master', name: 'Brand Master', href: '/common-masters/brand-master', description: 'Product brands' },
      { id: 'uom-master', name: 'Unit of Measure Master', href: '/common-masters/uom-master', description: 'Measurement units' },
      { id: 'uom-conversion-master', name: 'UOM Conversion Master', href: '/common-masters/uom-conversion-master', description: 'Unit conversions' },
      { id: 'hsn-sac-master', name: 'HSN/SAC Code Master', href: '/common-masters/hsn-sac-master', description: 'Tax classification codes' },
      { id: 'barcode-master', name: 'Barcode Master', href: '/common-masters/barcode-master', description: 'Product identification' },

      // Customer & Vendor Masters
      { id: 'customer-master', name: 'Customer Master', href: '/common-masters/customer-master', description: 'Client database' },
      { id: 'customer-category-master', name: 'Customer Category Master', href: '/common-masters/customer-category-master', description: 'Customer classification' },
      { id: 'vendor-master', name: 'Vendor/Supplier Master', href: '/common-masters/vendor-master', description: 'Supplier database' },
      { id: 'vendor-category-master', name: 'Vendor Category Master', href: '/common-masters/vendor-category-master', description: 'Supplier classification' },

      // Financial Masters
      { id: 'chart-of-accounts-master', name: 'Chart of Accounts Master', href: '/common-masters/chart-of-accounts-master', description: 'Account structure' },
      { id: 'bank-master', name: 'Bank Master', href: '/common-masters/bank-master', description: 'Banking information' },
      { id: 'tax-master', name: 'Tax Master', href: '/common-masters/tax-master', description: 'Tax codes and rates' },
      { id: 'payment-terms-master', name: 'Payment Terms Master', href: '/common-masters/payment-terms-master', description: 'Payment conditions' },
      { id: 'price-list-master', name: 'Price List Master', href: '/common-masters/price-list-master', description: 'Pricing structures' },

      // Geographic Masters
      { id: 'country-master', name: 'Country Master', href: '/common-masters/country-master', description: 'Global locations' },
      { id: 'state-master', name: 'State/Province Master', href: '/common-masters/state-master', description: 'Regional divisions' },
      { id: 'city-master', name: 'City Master', href: '/common-masters/city-master', description: 'City database' },
      { id: 'territory-master', name: 'Territory Master', href: '/common-masters/territory-master', description: 'Sales territories' },

      // HR Masters
      { id: 'employee-master', name: 'Employee Master', href: '/common-masters/employee-master', description: 'Personnel database' },
      { id: 'designation-master', name: 'Designation Master', href: '/common-masters/designation-master', description: 'Job positions' },
      { id: 'shift-master', name: 'Shift Master', href: '/common-masters/shift-master', description: 'Work schedules' },
      { id: 'holiday-master', name: 'Holiday Master', href: '/common-masters/holiday-master', description: 'Calendar management' },

      // Manufacturing Masters
      { id: 'machine-master', name: 'Machine Master', href: '/common-masters/machine-master', description: 'Equipment database' },
      { id: 'work-center-master', name: 'Work Center Master', href: '/common-masters/work-center-master', description: 'Production centers' },
      { id: 'operation-master', name: 'Operation Master', href: '/common-masters/operation-master', description: 'Manufacturing processes' },
      { id: 'tool-master', name: 'Tool Master', href: '/common-masters/tool-master', description: 'Manufacturing tools' },

      // Kitchen Manufacturing Specific
      { id: 'cabinet-type-master', name: 'Cabinet Type Master', href: '/common-masters/cabinet-type-master', description: 'Product categories' },
      { id: 'hardware-master', name: 'Hardware Master', href: '/common-masters/hardware-master', description: 'Fittings & accessories' },
      { id: 'finish-master', name: 'Finish Master', href: '/common-masters/finish-master', description: 'Surface treatments' },
      { id: 'material-grade-master', name: 'Material Grade Master', href: '/common-masters/material-grade-master', description: 'Quality grades' },

      // System Masters
      { id: 'user-master', name: 'User Master', href: '/common-masters/user-master', description: 'System users' },
      { id: 'role-master', name: 'Role Master', href: '/common-masters/role-master', description: 'User permissions' },
      { id: 'document-type-master', name: 'Document Type Master', href: '/common-masters/document-type-master', description: 'Document categories' },
      { id: 'number-series-master', name: 'Number Series Master', href: '/common-masters/number-series-master', description: 'Auto-numbering' },
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

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
      id: 'project-mgmt',
      name: 'Project Management',
      icon: FolderKanban,
      color: 'text-cyan-600 bg-cyan-50',
      items: [
        { id: 'planning', name: 'Project Planning', href: '/projects/planning', description: 'Create project plans' },
        { id: 'commissioning', name: 'Commissioning', href: '/projects/commissioning', description: 'Site commissioning activities' },
        { id: 'tracking', name: 'Progress Tracking', href: '/projects/tracking', description: 'Monitor project progress' },
        { id: 'resources', name: 'Resource Allocation', href: '/projects/resources', description: 'Allocate team resources' },
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
      id: 'system',
      name: 'System & Support',
      icon: Settings,
      color: 'text-gray-600 bg-white',
      items: [
        { id: 'workflow', name: 'Workflow Automation', href: '/workflow/automation', description: 'Automate business processes' },
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
      <div className="absolute top-full left-0 right-0 bg-white border-t border-gray-200 shadow-2xl z-50 animate-slideDown">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <div key={section.id} className="space-y-4">
                  {/* Section Header */}
                  <div className="flex items-center space-x-3 pb-3 border-b border-gray-200">
                    <div className={`p-2 rounded-lg ${section.color}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">{section.name}</h3>
                  </div>

                  {/* Section Items */}
                  <div className="space-y-2">
                    {section.items.map((item) => (
                      <Link
                        key={item.id}
                        href={item.href}
                        onClick={onClose}
                        className="block p-3 rounded-lg hover:bg-blue-50 transition-colors group"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors flex items-center">
                              {item.name}
                              <ArrowRight className="h-4 w-4 ml-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                            </h4>
                            <p className="text-sm text-gray-600 mt-1">{item.description}</p>
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
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-1">Need help navigating?</h4>
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

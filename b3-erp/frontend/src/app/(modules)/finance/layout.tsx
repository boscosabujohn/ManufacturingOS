'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  BookOpen,
  Calendar,
  Wallet,
  Building2,
  Receipt,
  CreditCard,
  TrendingUp,
  Package,
  Calculator,
  Percent,
  FileSpreadsheet,
  PieChart,
  BarChart3,
  DollarSign,
  ArrowUpCircle,
  ArrowDownCircle,
  Settings,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';

interface NavItem {
  name: string;
  href: string;
  icon: any;
  children?: NavItem[];
}

export default function FinanceLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [expandedSections, setExpandedSections] = useState<string[]>([
    'accounting',
    'cash',
    'reports',
  ]);

  const navigation: NavItem[] = [
    {
      name: 'Dashboard',
      href: '/finance',
      icon: LayoutDashboard,
    },
    {
      name: 'Accounting',
      href: '#',
      icon: BookOpen,
      children: [
        { name: 'Chart of Accounts', href: '/finance/accounting/chart-of-accounts', icon: Building2 },
        { name: 'Journal Entries', href: '/finance/accounting/journal-entries', icon: FileText },
        { name: 'General Ledger', href: '/finance/accounting/general-ledger', icon: BookOpen },
        { name: 'Trial Balance', href: '/finance/accounting/trial-balance', icon: Calculator },
        { name: 'Financial Periods', href: '/finance/accounting/periods', icon: Calendar },
      ],
    },
    {
      name: 'Cash & Bank',
      href: '#',
      icon: Wallet,
      children: [
        { name: 'Bank Accounts', href: '/finance/cash/bank-accounts', icon: Building2 },
        { name: 'Cash Management', href: '/finance/cash/management', icon: Wallet },
        { name: 'Bank Reconciliation', href: '/finance/cash/reconciliation', icon: Calculator },
        { name: 'Anticipated Receipts', href: '/finance/cash/anticipated-receipts', icon: ArrowUpCircle },
        { name: 'Anticipated Payments', href: '/finance/cash/anticipated-payments', icon: ArrowDownCircle },
      ],
    },
    {
      name: 'Accounts Receivable',
      href: '#',
      icon: TrendingUp,
      children: [
        { name: 'Invoices', href: '/finance/invoices', icon: FileText },
        { name: 'Receipts', href: '/finance/receivables', icon: Receipt },
        { name: 'Customer Aging', href: '/finance/receivables/aging', icon: BarChart3 },
        { name: 'Credit Management', href: '/finance/receivables/credit', icon: CreditCard },
      ],
    },
    {
      name: 'Accounts Payable',
      href: '#',
      icon: CreditCard,
      children: [
        { name: 'Bills', href: '/finance/payables', icon: FileText },
        { name: 'Payments', href: '/finance/payments', icon: DollarSign },
        { name: 'Vendor Aging', href: '/finance/payables/aging', icon: BarChart3 },
      ],
    },
    {
      name: 'Fixed Assets',
      href: '#',
      icon: Package,
      children: [
        { name: 'Asset Register', href: '/finance/assets/register', icon: Package },
        { name: 'Depreciation', href: '/finance/assets/depreciation', icon: TrendingUp },
        { name: 'Asset Maintenance', href: '/finance/assets/maintenance', icon: Settings },
      ],
    },
    {
      name: 'Budgeting',
      href: '#',
      icon: PieChart,
      children: [
        { name: 'Budgets', href: '/finance/budgets', icon: PieChart },
        { name: 'Budget vs Actual', href: '/finance/budgets/variance', icon: BarChart3 },
      ],
    },
    {
      name: 'Cost Accounting',
      href: '#',
      icon: Calculator,
      children: [
        { name: 'Cost Centers', href: '/finance/costing/cost-centers', icon: Building2 },
        { name: 'Standard Costs', href: '/finance/costing/standard-costs', icon: Calculator },
        { name: 'Variance Analysis', href: '/finance/costing/variance', icon: BarChart3 },
        { name: 'WIP Accounting', href: '/finance/costing/wip', icon: Package },
        { name: 'Job Costing', href: '/finance/costing', icon: FileText },
      ],
    },
    {
      name: 'Tax Management',
      href: '#',
      icon: Percent,
      children: [
        { name: 'GST', href: '/finance/tax/gst', icon: Percent },
        { name: 'TDS', href: '/finance/tax/tds', icon: FileSpreadsheet },
        { name: 'Tax Returns', href: '/finance/tax/returns', icon: FileText },
      ],
    },
    {
      name: 'Reports',
      href: '#',
      icon: FileSpreadsheet,
      children: [
        { name: 'Profit & Loss', href: '/finance/reports/profit-loss', icon: TrendingUp },
        { name: 'Balance Sheet', href: '/finance/reports/balance-sheet', icon: BarChart3 },
        { name: 'Cash Flow Statement', href: '/finance/reports/cash-flow', icon: Wallet },
        { name: 'Financial Ratios', href: '/finance/reports/ratios', icon: Calculator },
      ],
    },
  ];

  const toggleSection = (sectionName: string) => {
    setExpandedSections((prev) =>
      prev.includes(sectionName)
        ? prev.filter((s) => s !== sectionName)
        : [...prev, sectionName]
    );
  };

  const isActive = (href: string) => {
    if (href === '/finance') {
      return pathname === href;
    }
    return pathname?.startsWith(href);
  };

  const getSectionKey = (item: NavItem) => {
    return item.name.toLowerCase().replace(/\s+/g, '-');
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-72 bg-gradient-to-b from-gray-900 to-gray-800 text-white overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Finance Module</h2>
              <p className="text-xs text-gray-400">ERP System</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {navigation.map((item) => {
            const sectionKey = getSectionKey(item);
            const isExpanded = expandedSections.includes(sectionKey);
            const hasChildren = item.children && item.children.length > 0;

            return (
              <div key={item.name}>
                {hasChildren ? (
                  <>
                    <button
                      onClick={() => toggleSection(sectionKey)}
                      className="w-full flex items-center justify-between px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className="w-5 h-5" />
                        <span className="font-medium">{item.name}</span>
                      </div>
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </button>
                    {isExpanded && (
                      <div className="mt-1 ml-4 space-y-1">
                        {item.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                              isActive(child.href)
                                ? 'bg-blue-600 text-white'
                                : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                            }`}
                          >
                            <child.icon className="w-4 h-4" />
                            <span className="text-sm">{child.name}</span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive(item.href)
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                )}
              </div>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-700 mt-auto">
          <Link
            href="/finance/settings"
            className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-gray-700 hover:text-white rounded-lg transition-colors"
          >
            <Settings className="w-5 h-5" />
            <span className="font-medium">Settings</span>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {children}
      </div>
    </div>
  );
}

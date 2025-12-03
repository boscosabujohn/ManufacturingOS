'use client';

import Link from 'next/link';
import { BarChart3, FileText, TrendingUp, Wallet, BookOpen, ArrowRight } from 'lucide-react';

export default function FinancialReportsPage() {
  const reportCategories = [
    {
      title: 'Primary Financial Statements',
      icon: FileText,
      color: 'blue',
      reports: [
        { name: 'Profit & Loss Statement', href: '/finance/reports/profit-loss', description: 'Income statement showing revenue and expenses' },
        { name: 'Balance Sheet', href: '/finance/reports/balance-sheet', description: 'Statement of financial position' },
        { name: 'Cash Flow Statement', href: '/finance/reports/cash-flow', description: 'Analysis of cash inflows and outflows' },
        { name: 'Trial Balance', href: '/finance/reports/trial-balance', description: 'Verify accounting accuracy' },
      ],
    },
    {
      title: 'Analytics & Insights',
      icon: TrendingUp,
      color: 'purple',
      reports: [
        { name: 'Financial Ratios', href: '/finance/analytics/financial-ratios', description: 'Key financial ratios and metrics' },
        { name: 'Profitability Analysis', href: '/finance/analytics/profitability-analysis', description: 'Detailed profitability breakdown' },
        { name: 'KPI Dashboard', href: '/finance/analytics/kpi-dashboard', description: 'Key performance indicators' },
      ],
    },
    {
      title: 'Cash & Banking',
      icon: Wallet,
      color: 'green',
      reports: [
        { name: 'Cash Flow Forecast', href: '/finance/cash/cash-flow-forecast', description: 'Future cash flow projections' },
        { name: 'Bank Accounts', href: '/finance/cash/bank-accounts', description: 'Bank account balances and transactions' },
        { name: 'Bank Reconciliation', href: '/finance/cash/bank-reconciliation', description: 'Reconcile bank statements' },
      ],
    },
    {
      title: 'General Ledger',
      icon: BookOpen,
      color: 'orange',
      reports: [
        { name: 'General Ledger', href: '/finance/accounting/general-ledger', description: 'Complete general ledger report' },
        { name: 'Ledger Report', href: '/finance/accounting/ledger-report', description: 'Account-wise ledger details' },
        { name: 'Chart of Accounts', href: '/finance/accounting/chart-of-accounts', description: 'View account structure' },
      ],
    },
  ];

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 max-w-7xl">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Report Categories */}
            {reportCategories.map((category) => (
              <div key={category.title} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 bg-${category.color}-100 rounded-lg flex items-center justify-center`}>
                    <category.icon className={`w-6 h-6 text-${category.color}-600`} />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">{category.title}</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {category.reports.map((report) => (
                    <Link
                      key={report.name}
                      href={report.href}
                      className="group p-4 rounded-lg border border-gray-200 hover:border-blue-500 hover:shadow-md transition-all"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 mb-1">
                            {report.name}
                          </h3>
                          <p className="text-sm text-gray-600">{report.description}</p>
                        </div>
                        <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

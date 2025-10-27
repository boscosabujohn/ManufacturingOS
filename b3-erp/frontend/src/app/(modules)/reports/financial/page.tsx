'use client';

import { useState } from 'react';
import Link from 'next/link';
import { DollarSign, FileText, TrendingUp, ArrowLeft, Download, Eye, Calendar, Filter } from 'lucide-react';

interface FinancialReport {
  id: string;
  name: string;
  description: string;
  category: string;
  frequency: string;
  lastGenerated?: string;
}

const financialReports: FinancialReport[] = [
  { id: '1', name: 'Profit & Loss Statement', description: 'Comprehensive income statement showing revenues and expenses', category: 'Financial Statements', frequency: 'Monthly', lastGenerated: '2025-10-27' },
  { id: '2', name: 'Balance Sheet', description: 'Statement of financial position - assets, liabilities, and equity', category: 'Financial Statements', frequency: 'Monthly', lastGenerated: '2025-10-27' },
  { id: '3', name: 'Cash Flow Statement', description: 'Analysis of cash inflows and outflows', category: 'Financial Statements', frequency: 'Monthly', lastGenerated: '2025-10-26' },
  { id: '4', name: 'Trial Balance', description: 'Summary of all ledger account balances', category: 'Accounting', frequency: 'Monthly', lastGenerated: '2025-10-27' },
  { id: '5', name: 'General Ledger Report', description: 'Detailed transactions for all accounts', category: 'Accounting', frequency: 'On-Demand', lastGenerated: '2025-10-25' },
  { id: '6', name: 'Accounts Receivable Aging', description: 'Outstanding customer invoices by age', category: 'Receivables', frequency: 'Weekly', lastGenerated: '2025-10-27' },
  { id: '7', name: 'Accounts Payable Aging', description: 'Outstanding vendor bills by age', category: 'Payables', frequency: 'Weekly', lastGenerated: '2025-10-27' },
  { id: '8', name: 'Revenue Analysis', description: 'Detailed breakdown of revenue by product/service', category: 'Revenue', frequency: 'Monthly', lastGenerated: '2025-10-26' },
  { id: '9', name: 'Expense Analysis', description: 'Categorized expense tracking and trends', category: 'Expenses', frequency: 'Monthly', lastGenerated: '2025-10-26' },
  { id: '10', name: 'Budget vs Actual', description: 'Compare actual performance against budget', category: 'Budget', frequency: 'Monthly', lastGenerated: '2025-10-25' },
  { id: '11', name: 'Cost Center Analysis', description: 'Department-wise cost allocation and analysis', category: 'Cost Accounting', frequency: 'Monthly' },
  { id: '12', name: 'Tax Summary Report', description: 'GST/VAT collection and payment summary', category: 'Tax', frequency: 'Monthly', lastGenerated: '2025-10-20' },
];

export default function FinancialReportsPage() {
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['all', ...Array.from(new Set(financialReports.map(r => r.category)))];

  const filteredReports = financialReports.filter(report => {
    const matchesCategory = filterCategory === 'all' || report.category === filterCategory;
    const matchesSearch = report.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         report.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link href="/reports" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Reports
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Financial Reports</h1>
              <p className="text-gray-600">Comprehensive financial analysis and accounting reports</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow border border-gray-200 p-4 mb-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[300px]">
              <input
                type="text"
                placeholder="Search reports..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Reports Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReports.map((report) => (
            <div
              key={report.id}
              className="bg-white rounded-lg shadow border border-gray-200 hover:shadow-lg transition-all duration-200 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-green-600" />
                  </div>
                  <span className="text-xs px-2 py-1 bg-blue-100 text-blue-600 rounded">
                    {report.frequency}
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-2">{report.name}</h3>
                <p className="text-sm text-gray-600 mb-3">{report.description}</p>

                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div className="text-xs text-gray-500">
                    {report.lastGenerated ? (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {report.lastGenerated}
                      </span>
                    ) : (
                      <span>Not generated yet</span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors" title="View">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors" title="Generate">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredReports.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">No reports found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}

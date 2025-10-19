'use client';

import { Clock, TrendingDown, AlertTriangle, DollarSign } from 'lucide-react';

export default function ARAgingPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          <Clock className="h-8 w-8 text-yellow-600" />
          Accounts Receivable Aging Report
        </h1>
        <p className="text-gray-600 mt-2">Track overdue customer invoices by aging buckets</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
          <p className="text-blue-600 text-sm font-medium">Total Outstanding</p>
          <p className="text-2xl font-bold text-blue-900 mt-1">₹45.2L</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
          <p className="text-green-600 text-sm font-medium">Current (0-30 days)</p>
          <p className="text-2xl font-bold text-green-900 mt-1">₹28.5L</p>
        </div>
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4 border border-yellow-200">
          <p className="text-yellow-600 text-sm font-medium">30-60 days</p>
          <p className="text-2xl font-bold text-yellow-900 mt-1">₹12.8L</p>
        </div>
        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4 border border-red-200">
          <p className="text-red-600 text-sm font-medium">Over 60 days</p>
          <p className="text-2xl font-bold text-red-900 mt-1">₹3.9L</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="text-center text-gray-500">
          <Clock className="h-16 w-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">AR Aging Analysis</h3>
          <p className="text-gray-600">Detailed aging report will be displayed here</p>
        </div>
      </div>
    </div>
  );
}

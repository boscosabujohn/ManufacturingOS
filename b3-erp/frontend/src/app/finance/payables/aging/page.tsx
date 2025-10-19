'use client';

import { Clock, AlertCircle } from 'lucide-react';

export default function APAgingPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          <Clock className="h-8 w-8 text-orange-600" />
          Accounts Payable Aging Report
        </h1>
        <p className="text-gray-600 mt-2">Track vendor bills by payment due dates</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
          <p className="text-blue-600 text-sm font-medium">Total Payable</p>
          <p className="text-2xl font-bold text-blue-900 mt-1">₹38.7L</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
          <p className="text-green-600 text-sm font-medium">Not Due</p>
          <p className="text-2xl font-bold text-green-900 mt-1">₹22.3L</p>
        </div>
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4 border border-yellow-200">
          <p className="text-yellow-600 text-sm font-medium">Due Soon</p>
          <p className="text-2xl font-bold text-yellow-900 mt-1">₹11.2L</p>
        </div>
        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4 border border-red-200">
          <p className="text-red-600 text-sm font-medium">Overdue</p>
          <p className="text-2xl font-bold text-red-900 mt-1">₹5.2L</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="text-center text-gray-500">
          <Clock className="h-16 w-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">AP Aging Analysis</h3>
          <p className="text-gray-600">Detailed vendor payment aging report will be displayed here</p>
        </div>
      </div>
    </div>
  );
}

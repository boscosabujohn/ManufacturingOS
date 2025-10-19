'use client';

import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

export default function ForexGainLossPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          <DollarSign className="h-8 w-8 text-purple-600" />
          Forex Gain/Loss
        </h1>
        <p className="text-gray-600 mt-2">Foreign exchange gain and loss tracking</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">Realized Gain</p>
              <p className="text-2xl font-bold text-green-900 mt-1">₹2.45L</p>
            </div>
            <TrendingUp className="h-10 w-10 text-green-600 opacity-50" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4 border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-600 text-sm font-medium">Realized Loss</p>
              <p className="text-2xl font-bold text-red-900 mt-1">₹1.82L</p>
            </div>
            <TrendingDown className="h-10 w-10 text-red-600 opacity-50" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">Net Position</p>
              <p className="text-2xl font-bold text-blue-900 mt-1">₹63K</p>
            </div>
            <DollarSign className="h-10 w-10 text-blue-600 opacity-50" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="text-center text-gray-500">
          <DollarSign className="h-16 w-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Currency Gain/Loss Report</h3>
          <p className="text-gray-600">Foreign exchange adjustments and revaluations will be displayed here</p>
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import {
  DollarSign,
  TrendingUp,
  Package,
  BarChart3,
  PieChart,
  Download,
  Calendar,
  Filter,
  RefreshCw,
  ChevronDown,
  AlertCircle
} from 'lucide-react';

interface CategoryValuation {
  category: string;
  items: number;
  quantity: number;
  fifoValue: number;
  lifoValue: number;
  wavgValue: number;
  percentOfTotal: number;
}

interface ValuationHistory {
  date: string;
  fifo: number;
  lifo: number;
  wavg: number;
}

export default function StockValuationPage() {
  const [valuationMethod, setValuationMethod] = useState<'FIFO' | 'LIFO' | 'WAVG'>('FIFO');
  const [selectedPeriod, setSelectedPeriod] = useState('current');

  const categoryData: CategoryValuation[] = [
    {
      category: 'Raw Materials',
      items: 145,
      quantity: 12450,
      fifoValue: 2850000,
      lifoValue: 2720000,
      wavgValue: 2785000,
      percentOfTotal: 35.5
    },
    {
      category: 'Components',
      items: 89,
      quantity: 3420,
      fifoValue: 1950000,
      lifoValue: 1880000,
      wavgValue: 1915000,
      percentOfTotal: 24.3
    },
    {
      category: 'Finished Goods',
      items: 67,
      quantity: 1280,
      fifoValue: 2150000,
      lifoValue: 2100000,
      wavgValue: 2125000,
      percentOfTotal: 26.8
    },
    {
      category: 'Work In Progress',
      items: 45,
      quantity: 890,
      fifoValue: 980000,
      lifoValue: 945000,
      wavgValue: 962500,
      percentOfTotal: 12.2
    },
    {
      category: 'Consumables',
      items: 32,
      quantity: 5600,
      fifoValue: 95000,
      lifoValue: 92000,
      wavgValue: 93500,
      percentOfTotal: 1.2
    }
  ];

  const valuationHistory: ValuationHistory[] = [
    { date: '2025-01-01', fifo: 7500000, lifo: 7200000, wavg: 7350000 },
    { date: '2025-01-05', fifo: 7650000, lifo: 7320000, wavg: 7485000 },
    { date: '2025-01-10', fifo: 7800000, lifo: 7450000, wavg: 7625000 },
    { date: '2025-01-15', fifo: 7950000, lifo: 7580000, wavg: 7765000 },
    { date: '2025-01-20', fifo: 8025000, lifo: 7637000, wavg: 7831000 }
  ];

  const getCurrentValue = (category: CategoryValuation) => {
    switch (valuationMethod) {
      case 'FIFO':
        return category.fifoValue;
      case 'LIFO':
        return category.lifoValue;
      case 'WAVG':
        return category.wavgValue;
      default:
        return category.fifoValue;
    }
  };

  const totalValuation = categoryData.reduce((sum, cat) => sum + getCurrentValue(cat), 0);
  const totalItems = categoryData.reduce((sum, cat) => sum + cat.items, 0);
  const totalQuantity = categoryData.reduce((sum, cat) => sum + cat.quantity, 0);

  const varianceFromFIFO = ((totalValuation - categoryData.reduce((sum, cat) => sum + cat.fifoValue, 0)) / totalValuation * 100).toFixed(2);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
            <DollarSign className="w-8 h-8 text-green-600" />
            <span>Stock Valuation</span>
          </h1>
          <p className="text-gray-600 mt-1">Inventory valuation using different costing methods</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2">
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Valuation Method Selector */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Valuation Method</h3>
            <p className="text-sm text-gray-600 mt-1">Select the inventory costing method to apply</p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setValuationMethod('FIFO')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                valuationMethod === 'FIFO'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              FIFO
            </button>
            <button
              onClick={() => setValuationMethod('LIFO')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                valuationMethod === 'LIFO'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              LIFO
            </button>
            <button
              onClick={() => setValuationMethod('WAVG')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                valuationMethod === 'WAVG'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Weighted Average
            </button>
          </div>
        </div>

        {/* Method Description */}
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start space-x-2">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              {valuationMethod === 'FIFO' && (
                <>
                  <h4 className="font-semibold text-blue-900">First In, First Out (FIFO)</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    Assumes oldest inventory is sold first. Generally results in lower COGS during inflationary periods.
                  </p>
                </>
              )}
              {valuationMethod === 'LIFO' && (
                <>
                  <h4 className="font-semibold text-blue-900">Last In, First Out (LIFO)</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    Assumes newest inventory is sold first. Results in higher COGS during inflationary periods.
                  </p>
                </>
              )}
              {valuationMethod === 'WAVG' && (
                <>
                  <h4 className="font-semibold text-blue-900">Weighted Average Cost</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    Calculates average cost of all units available for sale. Smooths out price fluctuations.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="w-8 h-8 text-green-600" />
            <span className="text-2xl font-bold text-green-900">₹{(totalValuation / 100000).toFixed(1)}L</span>
          </div>
          <div className="text-sm font-medium text-green-700">Total Inventory Value</div>
          <div className="text-xs text-green-600 mt-1">Using {valuationMethod} Method</div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <Package className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-bold text-blue-900">{totalItems}</span>
          </div>
          <div className="text-sm font-medium text-blue-700">Total Items</div>
          <div className="text-xs text-blue-600 mt-1">{totalQuantity.toLocaleString()} Units</div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 border border-purple-200">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-8 h-8 text-purple-600" />
            <span className="text-2xl font-bold text-purple-900">{varianceFromFIFO}%</span>
          </div>
          <div className="text-sm font-medium text-purple-700">Variance from FIFO</div>
          <div className="text-xs text-purple-600 mt-1">Method Comparison</div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-6 border border-orange-200">
          <div className="flex items-center justify-between mb-2">
            <BarChart3 className="w-8 h-8 text-orange-600" />
            <span className="text-2xl font-bold text-orange-900">₹{(totalValuation / totalQuantity).toFixed(0)}</span>
          </div>
          <div className="text-sm font-medium text-orange-700">Avg. Unit Value</div>
          <div className="text-xs text-orange-600 mt-1">Across All Stock</div>
        </div>
      </div>

      {/* Category-wise Valuation Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Category-wise Valuation</h3>
          <p className="text-sm text-gray-600 mt-1">Inventory value breakdown by category</p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">FIFO Value</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">LIFO Value</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">WAVG Value</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Value</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">% of Total</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {categoryData.map((category, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{category.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{category.items}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{category.quantity.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{category.fifoValue.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{category.lifoValue.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{category.wavgValue.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-semibold text-green-600">
                      ₹{getCurrentValue(category).toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${category.percentOfTotal}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600">{category.percentOfTotal}%</span>
                    </div>
                  </td>
                </tr>
              ))}
              <tr className="bg-gray-50 font-semibold">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">TOTAL</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{totalItems}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{totalQuantity.toLocaleString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ₹{categoryData.reduce((sum, cat) => sum + cat.fifoValue, 0).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ₹{categoryData.reduce((sum, cat) => sum + cat.lifoValue, 0).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ₹{categoryData.reduce((sum, cat) => sum + cat.wavgValue, 0).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-600">
                  ₹{totalValuation.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">100%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Valuation Trend */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Valuation Trend</h3>
            <p className="text-sm text-gray-600 mt-1">Historical inventory valuation comparison</p>
          </div>
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="current">Current Month</option>
            <option value="quarter">Last Quarter</option>
            <option value="year">Last Year</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Date</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">FIFO</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">LIFO</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Weighted Avg</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Change</th>
              </tr>
            </thead>
            <tbody>
              {valuationHistory.map((record, index) => {
                const prevRecord = index > 0 ? valuationHistory[index - 1] : null;
                const change = prevRecord
                  ? ((record.fifo - prevRecord.fifo) / prevRecord.fifo * 100).toFixed(2)
                  : '0.00';
                const isPositive = parseFloat(change) >= 0;

                return (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">{record.date}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">₹{record.fifo.toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">₹{record.lifo.toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">₹{record.wavg.toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`flex items-center space-x-1 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                        {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingUp className="w-4 h-4 rotate-180" />}
                        <span>{Math.abs(parseFloat(change))}%</span>
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Method Comparison Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-gray-900">FIFO Total</h4>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">First In First Out</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">
            ₹{categoryData.reduce((sum, cat) => sum + cat.fifoValue, 0).toLocaleString()}
          </div>
          <div className="text-sm text-gray-600 mt-2">Highest valuation method</div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-gray-900">LIFO Total</h4>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">Last In First Out</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">
            ₹{categoryData.reduce((sum, cat) => sum + cat.lifoValue, 0).toLocaleString()}
          </div>
          <div className="text-sm text-gray-600 mt-2">Lowest valuation method</div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-gray-900">WAVG Total</h4>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">Weighted Average</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">
            ₹{categoryData.reduce((sum, cat) => sum + cat.wavgValue, 0).toLocaleString()}
          </div>
          <div className="text-sm text-gray-600 mt-2">Middle valuation method</div>
        </div>
      </div>
    </div>
  );
}

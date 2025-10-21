'use client';

import React, { useState } from 'react';
import {
  TrendingUp,
  Calendar,
  Package,
  BarChart3,
  Download,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  Percent
} from 'lucide-react';

interface ItemTurnover {
  itemCode: string;
  itemName: string;
  category: string;
  avgInventory: number;
  cogs: number;
  turnoverRatio: number;
  turnoverDays: number;
  trend: 'up' | 'down' | 'stable';
  salesValue: number;
}

export default function InventoryTurnoverPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('this-year');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const [turnoverData, setTurnoverData] = useState<ItemTurnover[]>([
    {
      itemCode: 'HYD-001',
      itemName: 'Hydraulic Pump Assembly',
      category: 'Hydraulics',
      avgInventory: 245000,
      cogs: 1470000,
      turnoverRatio: 6.0,
      turnoverDays: 61,
      trend: 'up',
      salesValue: 1680000
    },
    {
      itemCode: 'ELC-015',
      itemName: 'Control Panel PCB',
      category: 'Electronics',
      avgInventory: 180000,
      cogs: 1260000,
      turnoverRatio: 7.0,
      turnoverDays: 52,
      trend: 'up',
      salesValue: 1450000
    },
    {
      itemCode: 'STL-042',
      itemName: 'Steel Plates - Grade A',
      category: 'Raw Materials',
      avgInventory: 320000,
      cogs: 1920000,
      turnoverRatio: 6.0,
      turnoverDays: 61,
      trend: 'stable',
      salesValue: 2150000
    },
    {
      itemCode: 'BRG-028',
      itemName: 'Bearing Assembly Kit',
      category: 'Components',
      avgInventory: 95000,
      cogs: 665000,
      turnoverRatio: 7.0,
      turnoverDays: 52,
      trend: 'up',
      salesValue: 780000
    },
    {
      itemCode: 'FIN-012',
      itemName: 'Finished Excavator Unit',
      category: 'Finished Goods',
      avgInventory: 1250000,
      cogs: 5000000,
      turnoverRatio: 4.0,
      turnoverDays: 91,
      trend: 'stable',
      salesValue: 6500000
    },
    {
      itemCode: 'SPR-056',
      itemName: 'Spare Parts Kit - Standard',
      category: 'Spares',
      avgInventory: 65000,
      cogs: 195000,
      turnoverRatio: 3.0,
      turnoverDays: 122,
      trend: 'down',
      salesValue: 245000
    },
    {
      itemCode: 'WLD-022',
      itemName: 'Welding Electrodes',
      category: 'Consumables',
      avgInventory: 12000,
      cogs: 144000,
      turnoverRatio: 12.0,
      turnoverDays: 30,
      trend: 'up',
      salesValue: 165000
    },
    {
      itemCode: 'CAB-008',
      itemName: 'Operator Cabin Assembly',
      category: 'Sub-Assembly',
      avgInventory: 425000,
      cogs: 1700000,
      turnoverRatio: 4.0,
      turnoverDays: 91,
      trend: 'stable',
      salesValue: 2100000
    }
  ]);

  const getTurnoverColor = (ratio: number) => {
    if (ratio >= 8) return 'text-green-600 bg-green-50 border-green-200';
    if (ratio >= 4) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getTurnoverLabel = (ratio: number) => {
    if (ratio >= 8) return 'Fast Moving';
    if (ratio >= 4) return 'Medium Moving';
    return 'Slow Moving';
  };

  const avgTurnoverRatio = (turnoverData.reduce((sum, item) => sum + item.turnoverRatio, 0) / turnoverData.length).toFixed(1);
  const avgTurnoverDays = Math.round(turnoverData.reduce((sum, item) => sum + item.turnoverDays, 0) / turnoverData.length);
  const fastMovingCount = turnoverData.filter(item => item.turnoverRatio >= 8).length;
  const slowMovingCount = turnoverData.filter(item => item.turnoverRatio < 4).length;

  const filteredData = turnoverData.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesCategory;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
            <TrendingUp className="w-8 h-8 text-blue-600" />
            <span>Inventory Turnover Analysis</span>
          </h1>
          <p className="text-gray-600 mt-1">Track inventory turnover ratios and stock rotation efficiency</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-bold text-blue-900">{avgTurnoverRatio}x</span>
          </div>
          <div className="text-sm font-medium text-blue-700">Avg Turnover Ratio</div>
          <div className="text-xs text-blue-600 mt-1">Annual Average</div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 border border-purple-200">
          <div className="flex items-center justify-between mb-2">
            <Calendar className="w-8 h-8 text-purple-600" />
            <span className="text-2xl font-bold text-purple-900">{avgTurnoverDays}</span>
          </div>
          <div className="text-sm font-medium text-purple-700">Avg Turnover Days</div>
          <div className="text-xs text-purple-600 mt-1">Days in Inventory</div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
          <div className="flex items-center justify-between mb-2">
            <ArrowUpRight className="w-8 h-8 text-green-600" />
            <span className="text-2xl font-bold text-green-900">{fastMovingCount}</span>
          </div>
          <div className="text-sm font-medium text-green-700">Fast Moving Items</div>
          <div className="text-xs text-green-600 mt-1">Turnover ≥ 8x</div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-6 border border-red-200">
          <div className="flex items-center justify-between mb-2">
            <ArrowDownRight className="w-8 h-8 text-red-600" />
            <span className="text-2xl font-bold text-red-900">{slowMovingCount}</span>
          </div>
          <div className="text-sm font-medium text-red-700">Slow Moving Items</div>
          <div className="text-xs text-red-600 mt-1">Turnover &lt; 4x</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="this-quarter">This Quarter</option>
            <option value="this-year">This Year</option>
            <option value="last-year">Last Year</option>
            <option value="ytd">Year to Date</option>
          </select>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Categories</option>
            <option value="Hydraulics">Hydraulics</option>
            <option value="Electronics">Electronics</option>
            <option value="Raw Materials">Raw Materials</option>
            <option value="Components">Components</option>
            <option value="Finished Goods">Finished Goods</option>
            <option value="Spares">Spares</option>
            <option value="Consumables">Consumables</option>
            <option value="Sub-Assembly">Sub-Assembly</option>
          </select>
        </div>
      </div>

      {/* Turnover Analysis Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Item-wise Turnover Analysis</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item Details</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Inventory</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">COGS</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Turnover Ratio</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Turnover Days</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Classification</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trend</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm">
                    <div className="font-medium text-gray-900">{item.itemCode}</div>
                    <div className="text-xs text-gray-500">{item.itemName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {item.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ₹{item.avgInventory.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ₹{item.cogs.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-1">
                      <Percent className="w-4 h-4 text-blue-500" />
                      <span className="text-lg font-bold text-blue-600">{item.turnoverRatio.toFixed(1)}x</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="font-medium text-gray-900">{item.turnoverDays} days</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getTurnoverColor(item.turnoverRatio)}`}>
                      {getTurnoverLabel(item.turnoverRatio)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.trend === 'up' && (
                      <div className="flex items-center space-x-1 text-green-600">
                        <ArrowUpRight className="w-5 h-5" />
                        <span className="text-xs font-medium">Improving</span>
                      </div>
                    )}
                    {item.trend === 'down' && (
                      <div className="flex items-center space-x-1 text-red-600">
                        <ArrowDownRight className="w-5 h-5" />
                        <span className="text-xs font-medium">Declining</span>
                      </div>
                    )}
                    {item.trend === 'stable' && (
                      <span className="text-xs text-gray-500">Stable</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Formula Reference */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center space-x-2">
          <BarChart3 className="w-5 h-5" />
          <span>Turnover Calculation Formula</span>
        </h3>
        <div className="space-y-2 text-sm text-blue-800">
          <p><strong>Inventory Turnover Ratio</strong> = Cost of Goods Sold (COGS) ÷ Average Inventory</p>
          <p><strong>Turnover Days</strong> = 365 ÷ Inventory Turnover Ratio</p>
          <p className="mt-3 text-blue-700">
            <strong>Interpretation:</strong> Higher turnover ratio indicates faster inventory movement and better efficiency. 
            Lower turnover days mean stock is sold/used quickly, reducing holding costs.
          </p>
        </div>
      </div>
    </div>
  );
}

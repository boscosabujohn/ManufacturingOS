'use client';

import React, { useState } from 'react';
import {
  DollarSign,
  TrendingUp,
  Package,
  Warehouse,
  BarChart3,
  Download,
  Calendar,
  Percent
} from 'lucide-react';

interface CarryingCostItem {
  itemCode: string;
  itemName: string;
  category: string;
  avgInventoryValue: number;
  storageCost: number;
  capitalCost: number;
  insuranceCost: number;
  obsolescenceCost: number;
  totalCarryingCost: number;
  carryingCostRate: number;
  annualTurnover: number;
}

export default function CarryingCostPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('this-year');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const [costData, setCostData] = useState<CarryingCostItem[]>([
    {
      itemCode: 'FIN-012',
      itemName: 'Finished Excavator Unit',
      category: 'Finished Goods',
      avgInventoryValue: 1250000,
      storageCost: 37500,
      capitalCost: 125000,
      insuranceCost: 25000,
      obsolescenceCost: 12500,
      totalCarryingCost: 200000,
      carryingCostRate: 16.0,
      annualTurnover: 4
    },
    {
      itemCode: 'CAB-008',
      itemName: 'Operator Cabin Assembly',
      category: 'Sub-Assembly',
      avgInventoryValue: 425000,
      storageCost: 12750,
      capitalCost: 42500,
      insuranceCost: 8500,
      obsolescenceCost: 4250,
      totalCarryingCost: 68000,
      carryingCostRate: 16.0,
      annualTurnover: 4
    },
    {
      itemCode: 'STL-042',
      itemName: 'Steel Plates - Grade A',
      category: 'Raw Materials',
      avgInventoryValue: 320000,
      storageCost: 16000,
      capitalCost: 28800,
      insuranceCost: 6400,
      obsolescenceCost: 3200,
      totalCarryingCost: 54400,
      carryingCostRate: 17.0,
      annualTurnover: 6
    },
    {
      itemCode: 'HYD-001',
      itemName: 'Hydraulic Pump Assembly',
      category: 'Hydraulics',
      avgInventoryValue: 245000,
      storageCost: 7350,
      capitalCost: 24500,
      insuranceCost: 4900,
      obsolescenceCost: 2450,
      totalCarryingCost: 39200,
      carryingCostRate: 16.0,
      annualTurnover: 6
    },
    {
      itemCode: 'ELC-015',
      itemName: 'Control Panel PCB',
      category: 'Electronics',
      avgInventoryValue: 180000,
      storageCost: 3600,
      capitalCost: 18000,
      insuranceCost: 3600,
      obsolescenceCost: 9000,
      totalCarryingCost: 34200,
      carryingCostRate: 19.0,
      annualTurnover: 7
    },
    {
      itemCode: 'BRG-028',
      itemName: 'Bearing Assembly Kit',
      category: 'Components',
      avgInventoryValue: 95000,
      storageCost: 2850,
      capitalCost: 9500,
      insuranceCost: 1900,
      obsolescenceCost: 950,
      totalCarryingCost: 15200,
      carryingCostRate: 16.0,
      annualTurnover: 7
    },
    {
      itemCode: 'SPR-056',
      itemName: 'Spare Parts Kit - Standard',
      category: 'Spares',
      avgInventoryValue: 65000,
      storageCost: 3250,
      capitalCost: 5850,
      insuranceCost: 1300,
      obsolescenceCost: 3250,
      totalCarryingCost: 13650,
      carryingCostRate: 21.0,
      annualTurnover: 3
    },
    {
      itemCode: 'WLD-022',
      itemName: 'Welding Electrodes',
      category: 'Consumables',
      avgInventoryValue: 12000,
      storageCost: 360,
      capitalCost: 1080,
      insuranceCost: 240,
      obsolescenceCost: 120,
      totalCarryingCost: 1800,
      carryingCostRate: 15.0,
      annualTurnover: 12
    }
  ]);

  const totalInventoryValue = costData.reduce((sum, item) => sum + item.avgInventoryValue, 0);
  const totalCarryingCost = costData.reduce((sum, item) => sum + item.totalCarryingCost, 0);
  const avgCarryingCostRate = ((totalCarryingCost / totalInventoryValue) * 100).toFixed(1);
  const highestCostItem = costData.reduce((max, item) => item.totalCarryingCost > max.totalCarryingCost ? item : max, costData[0]);

  const filteredData = costData.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesCategory;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
            <DollarSign className="w-8 h-8 text-green-600" />
            <span>Inventory Carrying Cost Analysis</span>
          </h1>
          <p className="text-gray-600 mt-1">Analyze inventory holding costs and cost optimization opportunities</p>
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
            <Package className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-bold text-blue-900">₹{(totalInventoryValue / 1000000).toFixed(1)}M</span>
          </div>
          <div className="text-sm font-medium text-blue-700">Total Inventory Value</div>
          <div className="text-xs text-blue-600 mt-1">Average Annual</div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-6 border border-red-200">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="w-8 h-8 text-red-600" />
            <span className="text-2xl font-bold text-red-900">₹{(totalCarryingCost / 1000).toFixed(0)}K</span>
          </div>
          <div className="text-sm font-medium text-red-700">Total Carrying Cost</div>
          <div className="text-xs text-red-600 mt-1">Annual</div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 border border-purple-200">
          <div className="flex items-center justify-between mb-2">
            <Percent className="w-8 h-8 text-purple-600" />
            <span className="text-2xl font-bold text-purple-900">{avgCarryingCostRate}%</span>
          </div>
          <div className="text-sm font-medium text-purple-700">Avg Carrying Cost Rate</div>
          <div className="text-xs text-purple-600 mt-1">% of Inventory Value</div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-6 border border-orange-200">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-8 h-8 text-orange-600" />
            <span className="text-2xl font-bold text-orange-900">₹{(highestCostItem.totalCarryingCost / 1000).toFixed(0)}K</span>
          </div>
          <div className="text-sm font-medium text-orange-700">Highest Cost Item</div>
          <div className="text-xs text-orange-600 mt-1 truncate">{highestCostItem.itemCode}</div>
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
            <option value="Finished Goods">Finished Goods</option>
            <option value="Sub-Assembly">Sub-Assembly</option>
            <option value="Raw Materials">Raw Materials</option>
            <option value="Hydraulics">Hydraulics</option>
            <option value="Electronics">Electronics</option>
            <option value="Components">Components</option>
            <option value="Spares">Spares</option>
            <option value="Consumables">Consumables</option>
          </select>
        </div>
      </div>

      {/* Carrying Cost Analysis Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Item-wise Carrying Cost Breakdown</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item Details</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Inventory Value</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Storage Cost</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Capital Cost</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Insurance</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Obsolescence</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Cost</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cost Rate</th>
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
                    ₹{item.avgInventoryValue.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    ₹{item.storageCost.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    ₹{item.capitalCost.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    ₹{item.insuranceCost.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    ₹{item.obsolescenceCost.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-red-600">
                    ₹{item.totalCarryingCost.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-1">
                      <Percent className="w-4 h-4 text-purple-500" />
                      <span className="font-bold text-purple-600">{item.carryingCostRate.toFixed(1)}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-50">
              <tr>
                <td colSpan={2} className="px-6 py-4 text-sm font-bold text-gray-900">
                  Total
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                  ₹{totalInventoryValue.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                  ₹{costData.reduce((sum, item) => sum + item.storageCost, 0).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                  ₹{costData.reduce((sum, item) => sum + item.capitalCost, 0).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                  ₹{costData.reduce((sum, item) => sum + item.insuranceCost, 0).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                  ₹{costData.reduce((sum, item) => sum + item.obsolescenceCost, 0).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-red-600">
                  ₹{totalCarryingCost.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-purple-600">
                  {avgCarryingCostRate}%
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Cost Components Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Storage Cost</h3>
            <Warehouse className="w-6 h-6 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-blue-600 mb-2">
            ₹{costData.reduce((sum, item) => sum + item.storageCost, 0).toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">Warehouse space, utilities, handling</div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Capital Cost</h3>
            <DollarSign className="w-6 h-6 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-green-600 mb-2">
            ₹{costData.reduce((sum, item) => sum + item.capitalCost, 0).toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">Opportunity cost of tied-up capital</div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Insurance Cost</h3>
            <Package className="w-6 h-6 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-purple-600 mb-2">
            ₹{costData.reduce((sum, item) => sum + item.insuranceCost, 0).toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">Coverage for inventory risks</div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Obsolescence</h3>
            <TrendingUp className="w-6 h-6 text-orange-600" />
          </div>
          <div className="text-2xl font-bold text-orange-600 mb-2">
            ₹{costData.reduce((sum, item) => sum + item.obsolescenceCost, 0).toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">Depreciation, expiry, damage</div>
        </div>
      </div>

      {/* Formula Reference */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-green-900 mb-3 flex items-center space-x-2">
          <BarChart3 className="w-5 h-5" />
          <span>Carrying Cost Calculation</span>
        </h3>
        <div className="space-y-2 text-sm text-green-800">
          <p><strong>Total Carrying Cost</strong> = Storage Cost + Capital Cost + Insurance + Obsolescence</p>
          <p><strong>Carrying Cost Rate</strong> = (Total Carrying Cost ÷ Average Inventory Value) × 100</p>
          <p className="mt-3 text-green-700">
            <strong>Industry Benchmark:</strong> Typical carrying costs range from 15-25% of inventory value annually. 
            Higher turnover items have lower carrying costs per unit sold.
          </p>
        </div>
      </div>
    </div>
  );
}

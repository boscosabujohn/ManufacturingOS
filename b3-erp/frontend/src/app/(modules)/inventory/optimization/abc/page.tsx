'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Search, BarChart3, Download, RefreshCw, TrendingUp, Package, DollarSign, Percent } from 'lucide-react';

interface ABCItem {
  id: string;
  itemCode: string;
  itemName: string;
  category: string;
  annualUsageQty: number;
  unitCost: number;
  annualUsageValue: number;
  percentOfTotal: number;
  cumulativePercent: number;
  abcClass: 'A' | 'B' | 'C';
  uom: string;
  turnoverRate: number;
  currentStock: number;
  recommendedPolicy: string;
}

export default function ABCAnalysisPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterClass, setFilterClass] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');

  const abcItems: ABCItem[] = [
    {
      id: '1',
      itemCode: 'CP-078',
      itemName: 'Ball Bearing 6208',
      category: 'Component',
      annualUsageQty: 2555,
      unitCost: 45,
      annualUsageValue: 114975,
      percentOfTotal: 18.5,
      cumulativePercent: 18.5,
      abcClass: 'A',
      uom: 'Nos',
      turnoverRate: 17.6,
      currentStock: 145,
      recommendedPolicy: 'Daily review, tight control'
    },
    {
      id: '2',
      itemCode: 'RM-001',
      itemName: 'Steel Sheet 1mm',
      category: 'Raw Material',
      annualUsageQty: 5475,
      unitCost: 18,
      annualUsageValue: 98550,
      percentOfTotal: 15.8,
      cumulativePercent: 34.3,
      abcClass: 'A',
      uom: 'Sheets',
      turnoverRate: 12.2,
      currentStock: 450,
      recommendedPolicy: 'Daily review, tight control'
    },
    {
      id: '3',
      itemCode: 'CP-045',
      itemName: 'Hydraulic Cylinder',
      category: 'Component',
      annualUsageQty: 365,
      unitCost: 250,
      annualUsageValue: 91250,
      percentOfTotal: 14.7,
      cumulativePercent: 49.0,
      abcClass: 'A',
      uom: 'Nos',
      turnoverRate: 30.4,
      currentStock: 12,
      recommendedPolicy: 'Daily review, tight control'
    },
    {
      id: '4',
      itemCode: 'RM-089',
      itemName: 'Aluminum Rod 20mm',
      category: 'Raw Material',
      annualUsageQty: 4380,
      unitCost: 12,
      annualUsageValue: 52560,
      percentOfTotal: 8.5,
      cumulativePercent: 57.5,
      abcClass: 'A',
      uom: 'Pcs',
      turnoverRate: 56.2,
      currentStock: 78,
      recommendedPolicy: 'Daily review, tight control'
    },
    {
      id: '5',
      itemCode: 'RM-112',
      itemName: 'Brass Sheet 2mm',
      category: 'Raw Material',
      annualUsageQty: 1095,
      unitCost: 35,
      annualUsageValue: 38325,
      percentOfTotal: 6.2,
      cumulativePercent: 63.7,
      abcClass: 'A',
      uom: 'Sheets',
      turnoverRate: 49.8,
      currentStock: 22,
      recommendedPolicy: 'Daily review, tight control'
    },
    {
      id: '6',
      itemCode: 'CS-023',
      itemName: 'Cutting Oil Premium',
      category: 'Consumable',
      annualUsageQty: 1825,
      unitCost: 15,
      annualUsageValue: 27375,
      percentOfTotal: 4.4,
      cumulativePercent: 68.1,
      abcClass: 'B',
      uom: 'Liters',
      turnoverRate: 52.1,
      currentStock: 35,
      recommendedPolicy: 'Weekly review, moderate control'
    },
    {
      id: '7',
      itemCode: 'RM-034',
      itemName: 'Copper Wire 4mm',
      category: 'Raw Material',
      annualUsageQty: 730,
      unitCost: 28,
      annualUsageValue: 20440,
      percentOfTotal: 3.3,
      cumulativePercent: 71.4,
      abcClass: 'B',
      uom: 'Kg',
      turnoverRate: 91.2,
      currentStock: 8,
      recommendedPolicy: 'Weekly review, moderate control'
    },
    {
      id: '8',
      itemCode: 'CS-056',
      itemName: 'Grinding Wheel 180mm',
      category: 'Consumable',
      annualUsageQty: 1460,
      unitCost: 8,
      annualUsageValue: 11680,
      percentOfTotal: 1.9,
      cumulativePercent: 73.3,
      abcClass: 'B',
      uom: 'Nos',
      turnoverRate: 26.1,
      currentStock: 56,
      recommendedPolicy: 'Weekly review, moderate control'
    },
    {
      id: '9',
      itemCode: 'CP-125',
      itemName: 'Gasket Set Standard',
      category: 'Component',
      annualUsageQty: 912,
      unitCost: 6.5,
      annualUsageValue: 5928,
      percentOfTotal: 1.0,
      cumulativePercent: 74.3,
      abcClass: 'B',
      uom: 'Sets',
      turnoverRate: 18.2,
      currentStock: 50,
      recommendedPolicy: 'Weekly review, moderate control'
    },
    {
      id: '10',
      itemCode: 'CS-089',
      itemName: 'Cleaning Solvent',
      category: 'Consumable',
      annualUsageQty: 730,
      unitCost: 5,
      annualUsageValue: 3650,
      percentOfTotal: 0.6,
      cumulativePercent: 74.9,
      abcClass: 'C',
      uom: 'Liters',
      turnoverRate: 20.8,
      currentStock: 35,
      recommendedPolicy: 'Monthly review, simple control'
    },
    {
      id: '11',
      itemCode: 'CS-145',
      itemName: 'Shop Rags Box',
      category: 'Consumable',
      annualUsageQty: 365,
      unitCost: 8,
      annualUsageValue: 2920,
      percentOfTotal: 0.5,
      cumulativePercent: 75.4,
      abcClass: 'C',
      uom: 'Boxes',
      turnoverRate: 10.4,
      currentStock: 35,
      recommendedPolicy: 'Monthly review, simple control'
    },
    {
      id: '12',
      itemCode: 'CP-234',
      itemName: 'Bolt M10x40',
      category: 'Component',
      annualUsageQty: 5840,
      unitCost: 0.25,
      annualUsageValue: 1460,
      percentOfTotal: 0.2,
      cumulativePercent: 75.6,
      abcClass: 'C',
      uom: 'Nos',
      turnoverRate: 116.8,
      currentStock: 50,
      recommendedPolicy: 'Monthly review, simple control'
    }
  ];

  const filteredItems = abcItems.filter(item => {
    const matchesSearch = item.itemCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.itemName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesClass = filterClass === 'all' || item.abcClass === filterClass;
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
    return matchesSearch && matchesClass && matchesCategory;
  });

  const getClassColor = (abcClass: string) => {
    switch (abcClass) {
      case 'A': return 'bg-red-100 text-red-700 border-red-200';
      case 'B': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'C': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getTotalValue = () => {
    return abcItems.reduce((sum, item) => sum + item.annualUsageValue, 0);
  };

  const getClassStats = (abcClass: 'A' | 'B' | 'C') => {
    const items = abcItems.filter(item => item.abcClass === abcClass);
    const totalValue = items.reduce((sum, item) => sum + item.annualUsageValue, 0);
    const percentOfTotal = (totalValue / getTotalValue()) * 100;
    return {
      count: items.length,
      value: totalValue,
      percent: percentOfTotal
    };
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">ABC Analysis</h1>
            <p className="text-sm text-gray-500 mt-1">Classify inventory by value to prioritize management efforts</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            <span>Recalculate</span>
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
            <Download className="w-4 h-4" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6 border border-red-200">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm font-medium text-red-600">Class A Items</p>
              <p className="text-3xl font-bold text-red-900 mt-1">{getClassStats('A').count}</p>
            </div>
            <BarChart3 className="w-6 h-6 text-red-700" />
          </div>
          <div className="text-xs text-red-700">
            <p className="font-semibold">${(getClassStats('A').value / 1000).toFixed(1)}K value</p>
            <p>{getClassStats('A').percent.toFixed(1)}% of total " High control</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-6 border border-yellow-200">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm font-medium text-yellow-600">Class B Items</p>
              <p className="text-3xl font-bold text-yellow-900 mt-1">{getClassStats('B').count}</p>
            </div>
            <Package className="w-6 h-6 text-yellow-700" />
          </div>
          <div className="text-xs text-yellow-700">
            <p className="font-semibold">${(getClassStats('B').value / 1000).toFixed(1)}K value</p>
            <p>{getClassStats('B').percent.toFixed(1)}% of total " Moderate control</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm font-medium text-green-600">Class C Items</p>
              <p className="text-3xl font-bold text-green-900 mt-1">{getClassStats('C').count}</p>
            </div>
            <TrendingUp className="w-6 h-6 text-green-700" />
          </div>
          <div className="text-xs text-green-700">
            <p className="font-semibold">${(getClassStats('C').value / 1000).toFixed(1)}K value</p>
            <p>{getClassStats('C').percent.toFixed(1)}% of total " Simple control</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm font-medium text-blue-600">Total Value</p>
              <p className="text-3xl font-bold text-blue-900 mt-1">${(getTotalValue() / 1000).toFixed(0)}K</p>
            </div>
            <DollarSign className="w-6 h-6 text-blue-700" />
          </div>
          <div className="text-xs text-blue-700">
            <p>Annual usage value</p>
            <p>{abcItems.length} total items analyzed</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">ABC Distribution Chart</h3>
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-red-700">Class A (High Value)</span>
              <span className="text-sm font-bold text-red-900">{getClassStats('A').percent.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-red-100 rounded-full h-6">
              <div
                className="bg-red-600 h-6 rounded-full flex items-center justify-end pr-3"
                style={{ width: `${getClassStats('A').percent}%` }}
              >
                <span className="text-xs font-bold text-white">${(getClassStats('A').value / 1000).toFixed(0)}K</span>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-yellow-700">Class B (Medium Value)</span>
              <span className="text-sm font-bold text-yellow-900">{getClassStats('B').percent.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-yellow-100 rounded-full h-6">
              <div
                className="bg-yellow-600 h-6 rounded-full flex items-center justify-end pr-3"
                style={{ width: `${getClassStats('B').percent}%` }}
              >
                <span className="text-xs font-bold text-white">${(getClassStats('B').value / 1000).toFixed(0)}K</span>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-green-700">Class C (Low Value)</span>
              <span className="text-sm font-bold text-green-900">{getClassStats('C').percent.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-green-100 rounded-full h-6">
              <div
                className="bg-green-600 h-6 rounded-full flex items-center justify-end pr-3"
                style={{ width: `${getClassStats('C').percent}%` }}
              >
                <span className="text-xs font-bold text-white">${(getClassStats('C').value / 1000).toFixed(0)}K</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by item code or name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={filterClass}
            onChange={(e) => setFilterClass(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Classes</option>
            <option value="A">Class A</option>
            <option value="B">Class B</option>
            <option value="C">Class C</option>
          </select>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Categories</option>
            <option value="Raw Material">Raw Material</option>
            <option value="Component">Component</option>
            <option value="Consumable">Consumable</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Annual Qty</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Unit Cost</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Annual Value</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">% of Total</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Cumulative %</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Turnover</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Class</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Policy</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="text-sm font-semibold text-gray-900">{item.itemCode}</div>
                    <div className="text-xs text-gray-500">{item.itemName}</div>
                    <div className="text-xs text-gray-400 mt-1">{item.category}</div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="text-sm font-semibold text-gray-900">
                      {item.annualUsageQty.toLocaleString()} {item.uom}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="text-sm font-semibold text-gray-900">${item.unitCost}</div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="text-sm font-bold text-blue-600">
                      ${item.annualUsageValue.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="text-sm font-bold text-gray-900">{item.percentOfTotal.toFixed(1)}%</div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="text-sm font-semibold text-purple-600">{item.cumulativePercent.toFixed(1)}%</div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="text-sm font-semibold text-green-600">{item.turnoverRate.toFixed(1)}x</div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-bold border ${getClassColor(item.abcClass)}`}>
                      {item.abcClass}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-xs text-gray-700">{item.recommendedPolicy}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No items found matching your criteria</p>
          </div>
        )}
      </div>

      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
        <h3 className="text-sm font-semibold text-blue-900 mb-2">ABC Classification Guidelines:</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-blue-700">
          <div className="bg-white p-3 rounded border border-red-200">
            <h4 className="font-bold text-red-700 mb-2">Class A (Top 20%)</h4>
            <ul className="space-y-1 list-disc list-inside text-xs">
              <li>~70-80% of annual value</li>
              <li>Daily monitoring required</li>
              <li>Tight inventory control</li>
              <li>Accurate demand forecasting</li>
              <li>Frequent review cycles</li>
              <li>JIT or low safety stock</li>
            </ul>
          </div>
          <div className="bg-white p-3 rounded border border-yellow-200">
            <h4 className="font-bold text-yellow-700 mb-2">Class B (Next 30%)</h4>
            <ul className="space-y-1 list-disc list-inside text-xs">
              <li>~15-25% of annual value</li>
              <li>Weekly monitoring</li>
              <li>Moderate control levels</li>
              <li>Standard forecasting</li>
              <li>Periodic reviews</li>
              <li>Moderate safety stock</li>
            </ul>
          </div>
          <div className="bg-white p-3 rounded border border-green-200">
            <h4 className="font-bold text-green-700 mb-2">Class C (Bottom 50%)</h4>
            <ul className="space-y-1 list-disc list-inside text-xs">
              <li>~5% of annual value</li>
              <li>Monthly or quarterly review</li>
              <li>Simple control methods</li>
              <li>Basic forecasting</li>
              <li>Bulk ordering acceptable</li>
              <li>Higher safety stock OK</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

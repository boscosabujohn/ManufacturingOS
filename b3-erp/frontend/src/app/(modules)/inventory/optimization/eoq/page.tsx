'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Search, Calculator, DollarSign, Package, TrendingDown, Save, Download, BarChart3 } from 'lucide-react';

interface EOQData {
  id: string;
  itemCode: string;
  itemName: string;
  category: string;
  annualDemand: number;
  currentOrderQty: number;
  suggestedEOQ: number;
  unitCost: number;
  orderingCost: number;
  holdingCostPercent: number;
  holdingCostPerUnit: number;
  currentAnnualCost: number;
  optimizedAnnualCost: number;
  potentialSavings: number;
  ordersPerYear: number;
  uom: string;
}

export default function EOQOptimizationPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  const eoqData: EOQData[] = [
    {
      id: '1',
      itemCode: 'RM-001',
      itemName: 'Steel Sheet 1mm',
      category: 'Raw Material',
      annualDemand: 5475,
      currentOrderQty: 500,
      suggestedEOQ: 329,
      unitCost: 18,
      orderingCost: 150,
      holdingCostPercent: 25,
      holdingCostPerUnit: 4.5,
      currentAnnualCost: 2768,
      optimizedAnnualCost: 1481,
      potentialSavings: 1287,
      ordersPerYear: 16.6,
      uom: 'Sheets'
    },
    {
      id: '2',
      itemCode: 'CP-078',
      itemName: 'Ball Bearing 6208',
      category: 'Component',
      annualDemand: 2555,
      currentOrderQty: 400,
      suggestedEOQ: 234,
      unitCost: 45,
      orderingCost: 120,
      holdingCostPercent: 22,
      holdingCostPerUnit: 9.9,
      currentAnnualCost: 2746,
      optimizedAnnualCost: 2317,
      potentialSavings: 429,
      ordersPerYear: 10.9,
      uom: 'Nos'
    },
    {
      id: '3',
      itemCode: 'RM-089',
      itemName: 'Aluminum Rod 20mm',
      category: 'Raw Material',
      annualDemand: 4380,
      currentOrderQty: 300,
      suggestedEOQ: 428,
      unitCost: 12,
      orderingCost: 150,
      holdingCostPercent: 25,
      holdingCostPerUnit: 3.0,
      currentAnnualCost: 2640,
      optimizedAnnualCost: 1284,
      potentialSavings: 1356,
      ordersPerYear: 10.2,
      uom: 'Pcs'
    },
    {
      id: '4',
      itemCode: 'CP-045',
      itemName: 'Hydraulic Cylinder',
      category: 'Component',
      annualDemand: 365,
      currentOrderQty: 50,
      suggestedEOQ: 38,
      unitCost: 250,
      orderingCost: 180,
      holdingCostPercent: 20,
      holdingCostPerUnit: 50,
      currentAnnualCost: 2564,
      optimizedAnnualCost: 1900,
      potentialSavings: 664,
      ordersPerYear: 9.6,
      uom: 'Nos'
    },
    {
      id: '5',
      itemCode: 'CS-023',
      itemName: 'Cutting Oil Premium',
      category: 'Consumable',
      annualDemand: 1825,
      currentOrderQty: 150,
      suggestedEOQ: 156,
      unitCost: 15,
      orderingCost: 80,
      holdingCostPercent: 28,
      holdingCostPerUnit: 4.2,
      currentAnnualCost: 1288,
      optimizedAnnualCost: 655,
      potentialSavings: 633,
      ordersPerYear: 11.7,
      uom: 'Liters'
    },
    {
      id: '6',
      itemCode: 'RM-034',
      itemName: 'Copper Wire 4mm',
      category: 'Raw Material',
      annualDemand: 730,
      currentOrderQty: 100,
      suggestedEOQ: 78,
      unitCost: 28,
      orderingCost: 150,
      holdingCostPercent: 25,
      holdingCostPerUnit: 7.0,
      currentAnnualCost: 1445,
      optimizedAnnualCost: 546,
      potentialSavings: 899,
      ordersPerYear: 9.4,
      uom: 'Kg'
    },
    {
      id: '7',
      itemCode: 'CS-056',
      itemName: 'Grinding Wheel 180mm',
      category: 'Consumable',
      annualDemand: 1460,
      currentOrderQty: 180,
      suggestedEOQ: 152,
      unitCost: 8,
      orderingCost: 60,
      holdingCostPercent: 30,
      holdingCostPerUnit: 2.4,
      currentAnnualCost: 703,
      optimizedAnnualCost: 365,
      potentialSavings: 338,
      ordersPerYear: 9.6,
      uom: 'Nos'
    },
    {
      id: '8',
      itemCode: 'RM-112',
      itemName: 'Brass Sheet 2mm',
      category: 'Raw Material',
      annualDemand: 1095,
      currentOrderQty: 150,
      suggestedEOQ: 106,
      unitCost: 35,
      orderingCost: 150,
      holdingCostPercent: 24,
      holdingCostPerUnit: 8.4,
      currentAnnualCost: 1725,
      optimizedAnnualCost: 890,
      potentialSavings: 835,
      ordersPerYear: 10.3,
      uom: 'Sheets'
    }
  ];

  const filteredData = eoqData.filter(item => {
    const matchesSearch = item.itemCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.itemName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const getTotalSavings = () => {
    return eoqData.reduce((sum, item) => sum + item.potentialSavings, 0);
  };

  const getVarianceColor = (current: number, suggested: number) => {
    const diff = Math.abs(current - suggested);
    const variance = (diff / current) * 100;
    if (variance > 30) return 'text-red-600';
    if (variance > 15) return 'text-orange-600';
    return 'text-green-600';
  };

  const handleApplyAll = () => {
    if (confirm('Apply all suggested EOQ values?')) {
      alert('EOQ values updated successfully!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">EOQ Optimization</h1>
            <p className="text-sm text-gray-500 mt-1">Economic Order Quantity to minimize total inventory costs</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
          <button
            onClick={handleApplyAll}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Apply All EOQ</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Total Savings</p>
              <p className="text-3xl font-bold text-green-900 mt-1">
                ${(getTotalSavings() / 1000).toFixed(1)}K
              </p>
              <p className="text-xs text-green-600 mt-1">Annual if optimized</p>
            </div>
            <TrendingDown className="w-6 h-6 text-green-700" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Current Cost</p>
              <p className="text-3xl font-bold text-blue-900 mt-1">
                ${(eoqData.reduce((sum, item) => sum + item.currentAnnualCost, 0) / 1000).toFixed(1)}K
              </p>
              <p className="text-xs text-blue-600 mt-1">Total annual cost</p>
            </div>
            <DollarSign className="w-6 h-6 text-blue-700" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">Optimized Cost</p>
              <p className="text-3xl font-bold text-purple-900 mt-1">
                ${(eoqData.reduce((sum, item) => sum + item.optimizedAnnualCost, 0) / 1000).toFixed(1)}K
              </p>
              <p className="text-xs text-purple-600 mt-1">With EOQ applied</p>
            </div>
            <Calculator className="w-6 h-6 text-purple-700" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-600">Items Analyzed</p>
              <p className="text-3xl font-bold text-orange-900 mt-1">{eoqData.length}</p>
              <p className="text-xs text-orange-600 mt-1">Total inventory items</p>
            </div>
            <Package className="w-6 h-6 text-orange-700" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Annual Demand</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Current Qty</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">EOQ</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Orders/Year</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Current Cost</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Optimized Cost</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Savings</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredData.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="text-sm font-semibold text-gray-900">{item.itemCode}</div>
                    <div className="text-xs text-gray-500">{item.itemName}</div>
                    <div className="text-xs text-gray-400 mt-1">{item.category}</div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="text-sm font-semibold text-gray-900">
                      {item.annualDemand.toLocaleString()} {item.uom}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className={`text-sm font-semibold ${getVarianceColor(item.currentOrderQty, item.suggestedEOQ)}`}>
                      {item.currentOrderQty} {item.uom}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="text-sm font-bold text-blue-600">
                      {item.suggestedEOQ} {item.uom}
                    </div>
                    <div className="text-xs text-gray-500">
                      {((Math.abs(item.currentOrderQty - item.suggestedEOQ) / item.currentOrderQty) * 100).toFixed(0)}% diff
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="text-sm font-semibold text-purple-600">
                      {item.ordersPerYear.toFixed(1)}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="text-sm font-semibold text-gray-900">
                      ${item.currentAnnualCost.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="text-sm font-bold text-green-600">
                      ${item.optimizedAnnualCost.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="text-sm font-bold text-green-700">
                      ${item.potentialSavings.toLocaleString()}
                    </div>
                    <div className="text-xs text-green-600">
                      {((item.potentialSavings / item.currentAnnualCost) * 100).toFixed(0)}% savings
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredData.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No items found matching your criteria</p>
          </div>
        )}
      </div>

      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
        <h3 className="text-sm font-semibold text-blue-900 mb-2">Economic Order Quantity (EOQ) Formula:</h3>
        <div className="text-sm text-blue-700 space-y-2">
          <p className="font-mono bg-white px-3 py-2 rounded border border-blue-200 text-center text-lg">
            EOQ = ((2 × D × S) / H)
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
            <div className="bg-white p-3 rounded border border-blue-200">
              <p className="font-semibold mb-2">Where:</p>
              <ul className="space-y-1 text-xs">
                <li><strong>D</strong> = Annual demand (units/year)</li>
                <li><strong>S</strong> = Ordering cost per order ($)</li>
                <li><strong>H</strong> = Holding cost per unit per year ($)</li>
              </ul>
            </div>
            <div className="bg-white p-3 rounded border border-blue-200">
              <p className="font-semibold mb-2">Total Annual Cost:</p>
              <ul className="space-y-1 text-xs">
                <li><strong>Ordering Cost</strong> = (D / Q) × S</li>
                <li><strong>Holding Cost</strong> = (Q / 2) × H</li>
                <li><strong>Total Cost</strong> = Ordering + Holding</li>
              </ul>
            </div>
          </div>
          <p className="mt-3 text-xs">
            EOQ minimizes the sum of ordering and holding costs by balancing order frequency against inventory levels.
            Optimal order quantity occurs when ordering costs equal holding costs.
          </p>
        </div>
      </div>
    </div>
  );
}

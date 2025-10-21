'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Search, Shield, Calculator, Save, Download, AlertTriangle, CheckCircle, TrendingUp, BarChart3 } from 'lucide-react';

interface SafetyStockData {
  id: string;
  itemCode: string;
  itemName: string;
  category: string;
  currentSafetyStock: number;
  suggestedSafetyStock: number;
  variance: number;
  avgDemand: number;
  demandStdDev: number;
  demandVariability: number;
  leadTimeDays: number;
  leadTimeStdDev: number;
  serviceLevel: number;
  stockoutCost: number;
  holdingCostPerUnit: number;
  uom: string;
  status: 'optimal' | 'insufficient' | 'excessive';
}

export default function SafetyStockOptimizationPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [targetServiceLevel, setTargetServiceLevel] = useState(95);

  const safetyStockData: SafetyStockData[] = [
    {
      id: '1',
      itemCode: 'RM-001',
      itemName: 'Steel Sheet 1mm',
      category: 'Raw Material',
      currentSafetyStock: 30,
      suggestedSafetyStock: 40,
      variance: 10,
      avgDemand: 15,
      demandStdDev: 4.2,
      demandVariability: 28,
      leadTimeDays: 7,
      leadTimeStdDev: 1.5,
      serviceLevel: 95,
      stockoutCost: 500,
      holdingCostPerUnit: 2.5,
      uom: 'Sheets',
      status: 'insufficient'
    },
    {
      id: '2',
      itemCode: 'CP-045',
      itemName: 'Hydraulic Cylinder',
      category: 'Component',
      currentSafetyStock: 5,
      suggestedSafetyStock: 4,
      variance: -1,
      avgDemand: 1,
      demandStdDev: 0.5,
      demandVariability: 50,
      leadTimeDays: 14,
      leadTimeStdDev: 2.0,
      serviceLevel: 95,
      stockoutCost: 1200,
      holdingCostPerUnit: 15,
      uom: 'Nos',
      status: 'optimal'
    },
    {
      id: '3',
      itemCode: 'RM-089',
      itemName: 'Aluminum Rod 20mm',
      category: 'Raw Material',
      currentSafetyStock: 25,
      suggestedSafetyStock: 12,
      variance: -13,
      avgDemand: 12,
      demandStdDev: 2.8,
      demandVariability: 23,
      leadTimeDays: 5,
      leadTimeStdDev: 0.8,
      serviceLevel: 95,
      stockoutCost: 300,
      holdingCostPerUnit: 3.8,
      uom: 'Pcs',
      status: 'excessive'
    },
    {
      id: '4',
      itemCode: 'CS-023',
      itemName: 'Cutting Oil Premium',
      category: 'Consumable',
      currentSafetyStock: 10,
      suggestedSafetyStock: 7,
      variance: -3,
      avgDemand: 5,
      demandStdDev: 1.2,
      demandVariability: 24,
      leadTimeDays: 3,
      leadTimeStdDev: 0.5,
      serviceLevel: 95,
      stockoutCost: 150,
      holdingCostPerUnit: 1.2,
      uom: 'Liters',
      status: 'optimal'
    },
    {
      id: '5',
      itemCode: 'CP-078',
      itemName: 'Ball Bearing 6208',
      category: 'Component',
      currentSafetyStock: 30,
      suggestedSafetyStock: 48,
      variance: 18,
      avgDemand: 7,
      demandStdDev: 1.8,
      demandVariability: 26,
      leadTimeDays: 10,
      leadTimeStdDev: 1.2,
      serviceLevel: 95,
      stockoutCost: 800,
      holdingCostPerUnit: 5.5,
      uom: 'Nos',
      status: 'insufficient'
    },
    {
      id: '6',
      itemCode: 'RM-034',
      itemName: 'Copper Wire 4mm',
      category: 'Raw Material',
      currentSafetyStock: 15,
      suggestedSafetyStock: 10,
      variance: -5,
      avgDemand: 2,
      demandStdDev: 0.6,
      demandVariability: 30,
      leadTimeDays: 6,
      leadTimeStdDev: 1.0,
      serviceLevel: 95,
      stockoutCost: 400,
      holdingCostPerUnit: 6.2,
      uom: 'Kg',
      status: 'excessive'
    },
    {
      id: '7',
      itemCode: 'CS-056',
      itemName: 'Grinding Wheel 180mm',
      category: 'Consumable',
      currentSafetyStock: 12,
      suggestedSafetyStock: 12,
      variance: 0,
      avgDemand: 4,
      demandStdDev: 1.0,
      demandVariability: 25,
      leadTimeDays: 4,
      leadTimeStdDev: 0.6,
      serviceLevel: 95,
      stockoutCost: 200,
      holdingCostPerUnit: 2.8,
      uom: 'Nos',
      status: 'optimal'
    },
    {
      id: '8',
      itemCode: 'RM-112',
      itemName: 'Brass Sheet 2mm',
      category: 'Raw Material',
      currentSafetyStock: 12,
      suggestedSafetyStock: 18,
      variance: 6,
      avgDemand: 3,
      demandStdDev: 1.5,
      demandVariability: 50,
      leadTimeDays: 8,
      leadTimeStdDev: 1.5,
      serviceLevel: 95,
      stockoutCost: 600,
      holdingCostPerUnit: 4.5,
      uom: 'Sheets',
      status: 'insufficient'
    }
  ];

  const filteredData = safetyStockData.filter(item => {
    const matchesSearch = item.itemCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.itemName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'optimal': return 'bg-green-100 text-green-700 border-green-200';
      case 'insufficient': return 'bg-red-100 text-red-700 border-red-200';
      case 'excessive': return 'bg-orange-100 text-orange-700 border-orange-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getVarianceColor = (variance: number) => {
    if (variance > 5) return 'text-red-600';
    if (variance < -5) return 'text-orange-600';
    return 'text-green-600';
  };

  const getVariabilityColor = (variability: number) => {
    if (variability > 40) return 'text-red-600';
    if (variability > 25) return 'text-orange-600';
    return 'text-green-600';
  };

  const calculatePotentialSavings = () => {
    return safetyStockData.reduce((total, item) => {
      if (item.variance < 0) {
        return total + (Math.abs(item.variance) * item.holdingCostPerUnit * 12);
      }
      return total;
    }, 0);
  };

  const handleApplyAll = () => {
    const itemsToUpdate = safetyStockData.filter(item => item.status !== 'optimal').length;
    if (confirm(`Apply suggested safety stock values to ${itemsToUpdate} item(s)?`)) {
      alert(`Updated ${itemsToUpdate} safety stock levels successfully!`);
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
            <h1 className="text-2xl font-bold text-gray-900">Safety Stock Optimization</h1>
            <p className="text-sm text-gray-500 mt-1">Optimize safety stock levels to balance service and costs</p>
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
            <span>Apply Suggestions</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Optimal</p>
              <p className="text-3xl font-bold text-green-900 mt-1">
                {safetyStockData.filter(d => d.status === 'optimal').length}
              </p>
              <p className="text-xs text-green-600 mt-1">Well balanced</p>
            </div>
            <CheckCircle className="w-6 h-6 text-green-700" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6 border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-600">Insufficient</p>
              <p className="text-3xl font-bold text-red-900 mt-1">
                {safetyStockData.filter(d => d.status === 'insufficient').length}
              </p>
              <p className="text-xs text-red-600 mt-1">Stockout risk</p>
            </div>
            <AlertTriangle className="w-6 h-6 text-red-700" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-600">Excessive</p>
              <p className="text-3xl font-bold text-orange-900 mt-1">
                {safetyStockData.filter(d => d.status === 'excessive').length}
              </p>
              <p className="text-xs text-orange-600 mt-1">High holding cost</p>
            </div>
            <TrendingUp className="w-6 h-6 text-orange-700" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Annual Savings</p>
              <p className="text-3xl font-bold text-blue-900 mt-1">
                ${(calculatePotentialSavings() / 1000).toFixed(0)}K
              </p>
              <p className="text-xs text-blue-600 mt-1">If optimized</p>
            </div>
            <BarChart3 className="w-6 h-6 text-blue-700" />
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
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="optimal">Optimal</option>
            <option value="insufficient">Insufficient</option>
            <option value="excessive">Excessive</option>
          </select>
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-gray-700">Target Service:</label>
            <input
              type="range"
              min="90"
              max="99"
              value={targetServiceLevel}
              onChange={(e) => setTargetServiceLevel(Number(e.target.value))}
              className="flex-1"
            />
            <span className="text-sm font-bold text-blue-600 w-12">{targetServiceLevel}%</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Current</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Suggested</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Variance</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Demand CV%</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Lead Time</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Stockout Cost</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Holding Cost</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Status</th>
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
                    <div className="text-sm font-semibold text-gray-900">{item.currentSafetyStock} {item.uom}</div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="text-sm font-bold text-blue-600">{item.suggestedSafetyStock} {item.uom}</div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className={`text-sm font-bold ${getVarianceColor(item.variance)}`}>
                      {item.variance > 0 ? '+' : ''}{item.variance} {item.uom}
                    </div>
                    {item.currentSafetyStock > 0 && (
                      <div className="text-xs text-gray-500">
                        {((Math.abs(item.variance) / item.currentSafetyStock) * 100).toFixed(1)}%
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className={`text-sm font-bold ${getVariabilityColor(item.demandVariability)}`}>
                      {item.demandVariability}%
                    </div>
                    <div className="text-xs text-gray-500">Ã = {item.demandStdDev}</div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="text-sm font-semibold text-gray-900">{item.leadTimeDays} days</div>
                    <div className="text-xs text-gray-500">Ã = {item.leadTimeStdDev}</div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="text-sm font-semibold text-red-600">${item.stockoutCost}</div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="text-sm font-semibold text-orange-600">${item.holdingCostPerUnit}</div>
                    <div className="text-xs text-gray-500">per {item.uom}/yr</div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(item.status)}`}>
                      {item.status === 'optimal' && <CheckCircle className="w-3 h-3" />}
                      {item.status === 'insufficient' && <AlertTriangle className="w-3 h-3" />}
                      {item.status === 'excessive' && <TrendingUp className="w-3 h-3" />}
                      {item.status}
                    </span>
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
        <h3 className="text-sm font-semibold text-blue-900 mb-2">Safety Stock Calculation Methods:</h3>
        <div className="text-sm text-blue-700 space-y-2">
          <p className="font-mono bg-white px-3 py-2 rounded border border-blue-200">
            Safety Stock = Z-Score × Ã<sub>demand</sub> × (Lead Time)
          </p>
          <p className="font-mono bg-white px-3 py-2 rounded border border-blue-200">
            With Variable Lead Time: Z × ((Avg LT × Ã<sub>demand</sub>²) + (Avg Demand² × Ã<sub>LT</sub>²))
          </p>
          <ul className="list-disc list-inside space-y-1 mt-3">
            <li><strong>Demand CV (Coefficient of Variation):</strong> (Ã<sub>demand</sub> / Avg Demand) × 100</li>
            <li><strong>High variability (&gt;40%):</strong> Requires higher safety stock</li>
            <li><strong>Low variability (&lt;25%):</strong> Can maintain lower safety stock</li>
            <li><strong>Stockout Cost:</strong> Revenue loss per stockout occurrence</li>
            <li><strong>Holding Cost:</strong> Annual cost to hold one unit in inventory</li>
            <li>Optimal safety stock balances stockout risk vs holding costs</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

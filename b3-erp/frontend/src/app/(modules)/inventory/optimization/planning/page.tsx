'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Search, Calendar, Download, TrendingUp, Package, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

interface PlanningItem {
  id: string;
  itemCode: string;
  itemName: string;
  category: string;
  currentStock: number;
  forecastDemand: number;
  plannedReceipts: number;
  projectedStock: number;
  recommendedAction: 'order' | 'adequate' | 'reduce' | 'critical';
  orderQuantity: number;
  orderDate: string;
  expectedDate: string;
  uom: string;
  minLevel: number;
  maxLevel: number;
  leadTime: number;
}

export default function PlanningOptimizationPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [planningHorizon, setPlanningHorizon] = useState(90);
  const [filterAction, setFilterAction] = useState('all');

  const planningData: PlanningItem[] = [
    {
      id: '1',
      itemCode: 'RM-001',
      itemName: 'Steel Sheet 1mm',
      category: 'Raw Material',
      currentStock: 450,
      forecastDemand: 1350,
      plannedReceipts: 500,
      projectedStock: -400,
      recommendedAction: 'order',
      orderQuantity: 900,
      orderDate: '2025-10-25',
      expectedDate: '2025-11-01',
      uom: 'Sheets',
      minLevel: 100,
      maxLevel: 500,
      leadTime: 7
    },
    {
      id: '2',
      itemCode: 'CP-078',
      itemName: 'Ball Bearing 6208',
      category: 'Component',
      currentStock: 145,
      forecastDemand: 630,
      plannedReceipts: 400,
      projectedStock: -85,
      recommendedAction: 'order',
      orderQuantity: 255,
      orderDate: '2025-10-28',
      expectedDate: '2025-11-07',
      uom: 'Nos',
      minLevel: 100,
      maxLevel: 400,
      leadTime: 10
    },
    {
      id: '3',
      itemCode: 'RM-089',
      itemName: 'Aluminum Rod 20mm',
      category: 'Raw Material',
      currentStock: 78,
      forecastDemand: 1095,
      plannedReceipts: 0,
      projectedStock: -1017,
      recommendedAction: 'critical',
      orderQuantity: 1222,
      orderDate: '2025-10-22',
      expectedDate: '2025-10-27',
      uom: 'Pcs',
      minLevel: 50,
      maxLevel: 300,
      leadTime: 5
    },
    {
      id: '4',
      itemCode: 'CS-023',
      itemName: 'Cutting Oil Premium',
      category: 'Consumable',
      currentStock: 35,
      forecastDemand: 450,
      plannedReceipts: 150,
      projectedStock: -265,
      recommendedAction: 'order',
      orderQuantity: 380,
      orderDate: '2025-10-26',
      expectedDate: '2025-10-29',
      uom: 'Liters',
      minLevel: 30,
      maxLevel: 150,
      leadTime: 3
    },
    {
      id: '5',
      itemCode: 'CP-045',
      itemName: 'Hydraulic Cylinder',
      category: 'Component',
      currentStock: 12,
      forecastDemand: 91,
      plannedReceipts: 50,
      projectedStock: -29,
      recommendedAction: 'order',
      orderQuantity: 38,
      orderDate: '2025-11-01',
      expectedDate: '2025-11-15',
      uom: 'Nos',
      minLevel: 10,
      maxLevel: 50,
      leadTime: 14
    },
    {
      id: '6',
      itemCode: 'RM-034',
      itemName: 'Copper Wire 4mm',
      category: 'Raw Material',
      currentStock: 8,
      forecastDemand: 180,
      plannedReceipts: 200,
      projectedStock: 28,
      recommendedAction: 'adequate',
      orderQuantity: 0,
      orderDate: '',
      expectedDate: '',
      uom: 'Kg',
      minLevel: 25,
      maxLevel: 200,
      leadTime: 6
    },
    {
      id: '7',
      itemCode: 'CS-056',
      itemName: 'Grinding Wheel 180mm',
      category: 'Consumable',
      currentStock: 56,
      forecastDemand: 360,
      plannedReceipts: 180,
      projectedStock: -124,
      recommendedAction: 'order',
      orderQuantity: 200,
      orderDate: '2025-10-30',
      expectedDate: '2025-11-03',
      uom: 'Nos',
      minLevel: 40,
      maxLevel: 180,
      leadTime: 4
    },
    {
      id: '8',
      itemCode: 'RM-112',
      itemName: 'Brass Sheet 2mm',
      category: 'Raw Material',
      currentStock: 22,
      forecastDemand: 273,
      plannedReceipts: 150,
      projectedStock: -101,
      recommendedAction: 'order',
      orderQuantity: 128,
      orderDate: '2025-10-27',
      expectedDate: '2025-11-04',
      uom: 'Sheets',
      minLevel: 30,
      maxLevel: 150,
      leadTime: 8
    }
  ];

  const filteredData = planningData.filter(item => {
    const matchesSearch = item.itemCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.itemName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAction = filterAction === 'all' || item.recommendedAction === filterAction;
    return matchesSearch && matchesAction;
  });

  const getActionColor = (action: string) => {
    switch (action) {
      case 'critical': return 'bg-red-100 text-red-700 border-red-200';
      case 'order': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'adequate': return 'bg-green-100 text-green-700 border-green-200';
      case 'reduce': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'critical': return <AlertTriangle className="w-3 h-3" />;
      case 'order': return <Package className="w-3 h-3" />;
      case 'adequate': return <CheckCircle className="w-3 h-3" />;
      case 'reduce': return <TrendingUp className="w-3 h-3 rotate-180" />;
      default: return null;
    }
  };

  const getStockHealthColor = (projected: number, min: number) => {
    if (projected < 0) return 'text-red-600';
    if (projected < min) return 'text-orange-600';
    return 'text-green-600';
  };

  const getTotalOrderValue = () => {
    return planningData
      .filter(item => item.recommendedAction === 'order' || item.recommendedAction === 'critical')
      .reduce((sum, item) => sum + (item.orderQuantity * 50), 0); // Simplified calc
  };

  return (
    <div className="min-h-screen bg-gray-50 px-3 py-2">
      <div className="mb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="flex items-center gap-2">
          <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Inventory Planning Optimization</h1>
            <p className="text-sm text-gray-500 mt-1">Plan inventory requirements based on forecast and lead times</p>
          </div>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
          <Download className="w-4 h-4" />
          <span>Export Plan</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-3">
        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-3 border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-600">Critical</p>
              <p className="text-3xl font-bold text-red-900 mt-1">
                {planningData.filter(i => i.recommendedAction === 'critical').length}
              </p>
              <p className="text-xs text-red-600 mt-1">Immediate action</p>
            </div>
            <AlertTriangle className="w-6 h-6 text-red-700" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-3 border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-600">Order Required</p>
              <p className="text-3xl font-bold text-orange-900 mt-1">
                {planningData.filter(i => i.recommendedAction === 'order').length}
              </p>
              <p className="text-xs text-orange-600 mt-1">Plan orders</p>
            </div>
            <Package className="w-6 h-6 text-orange-700" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-3 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Adequate</p>
              <p className="text-3xl font-bold text-green-900 mt-1">
                {planningData.filter(i => i.recommendedAction === 'adequate').length}
              </p>
              <p className="text-xs text-green-600 mt-1">No action needed</p>
            </div>
            <CheckCircle className="w-6 h-6 text-green-700" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-3 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Order Value</p>
              <p className="text-3xl font-bold text-blue-900 mt-1">
                ${(getTotalOrderValue() / 1000).toFixed(0)}K
              </p>
              <p className="text-xs text-blue-600 mt-1">Planned purchases</p>
            </div>
            <TrendingUp className="w-6 h-6 text-blue-700" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-3 mb-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
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
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Actions</option>
            <option value="critical">Critical</option>
            <option value="order">Order Required</option>
            <option value="adequate">Adequate</option>
            <option value="reduce">Reduce</option>
          </select>
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-gray-700">Planning Days:</label>
            <input
              type="range"
              min="30"
              max="365"
              step="30"
              value={planningHorizon}
              onChange={(e) => setPlanningHorizon(Number(e.target.value))}
              className="flex-1"
            />
            <span className="text-sm font-bold text-blue-600 w-12">{planningHorizon}</span>
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
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Forecast Demand</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Planned Receipts</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Projected Stock</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Order Qty</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order/Expected</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Action</th>
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
                    <div className="text-sm font-semibold text-gray-900">{item.currentStock} {item.uom}</div>
                    <div className="text-xs text-gray-500">Min: {item.minLevel}</div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="text-sm font-bold text-blue-600">{item.forecastDemand} {item.uom}</div>
                    <div className="text-xs text-gray-500">{planningHorizon} days</div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="text-sm font-semibold text-purple-600">
                      {item.plannedReceipts > 0 ? `${item.plannedReceipts} ${item.uom}` : '-'}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className={`text-sm font-bold ${getStockHealthColor(item.projectedStock, item.minLevel)}`}>
                      {item.projectedStock} {item.uom}
                    </div>
                    {item.projectedStock < 0 && (
                      <div className="text-xs text-red-600">Shortage</div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {item.orderQuantity > 0 ? (
                      <div className="text-sm font-bold text-orange-600">
                        {item.orderQuantity} {item.uom}
                      </div>
                    ) : (
                      <div className="text-sm text-gray-400">-</div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {item.orderDate && (
                      <div className="text-xs text-gray-700">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-orange-500" />
                          <span className="font-semibold">Order: {item.orderDate}</span>
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          <Clock className="w-3 h-3 text-green-500" />
                          <span>Arrive: {item.expectedDate}</span>
                        </div>
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getActionColor(item.recommendedAction)}`}>
                      {getActionIcon(item.recommendedAction)}
                      {item.recommendedAction}
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

      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-3">
        <h3 className="text-sm font-semibold text-blue-900 mb-2">Inventory Planning Process:</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-blue-700">
          <div className="bg-white p-3 rounded border border-blue-200">
            <h4 className="font-bold mb-2">Calculation:</h4>
            <ul className="space-y-1 text-xs list-disc list-inside">
              <li>Projected Stock = Current + Planned Receipts - Forecast Demand</li>
              <li>Order Qty = Max Level - Projected Stock (if negative)</li>
              <li>Order Date = Today + (Lead Time Buffer)</li>
              <li>Expected Date = Order Date + Lead Time</li>
            </ul>
          </div>
          <div className="bg-white p-3 rounded border border-blue-200">
            <h4 className="font-bold mb-2">Actions:</h4>
            <ul className="space-y-1 text-xs list-disc list-inside">
              <li><strong>Critical:</strong> Projected &lt; 0, order immediately</li>
              <li><strong>Order:</strong> Projected &lt; Min, plan order</li>
              <li><strong>Adequate:</strong> Projected &gt; Min, no action</li>
              <li><strong>Reduce:</strong> Projected &gt; Max, excess inventory</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

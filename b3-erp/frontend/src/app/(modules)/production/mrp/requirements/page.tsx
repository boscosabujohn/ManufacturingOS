'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Download, RefreshCw, Filter, Calendar, Package, AlertTriangle, CheckCircle } from 'lucide-react';

interface MaterialRequirement {
  id: string;
  materialCode: string;
  materialName: string;
  category: string;
  uom: string;
  grossRequirement: number;
  scheduledReceipts: number;
  onHandInventory: number;
  netRequirement: number;
  plannedOrderQuantity: number;
  requiredDate: string;
  leadTimeDays: number;
  safetyStock: number;
  status: 'sufficient' | 'shortage' | 'critical' | 'planned';
  relatedWorkOrders: string[];
}

export default function MRPRequirementsPage() {
  const router = useRouter();
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Mock data for material requirements
  const requirements: MaterialRequirement[] = [
    {
      id: '1',
      materialCode: 'RM-SS304-001',
      materialName: 'Stainless Steel 304 Sheet (2mm)',
      category: 'Raw Material',
      uom: 'kg',
      grossRequirement: 1250,
      scheduledReceipts: 800,
      onHandInventory: 350,
      netRequirement: 100,
      plannedOrderQuantity: 500,
      requiredDate: '2025-10-25',
      leadTimeDays: 7,
      safetyStock: 200,
      status: 'planned',
      relatedWorkOrders: ['WO-2025-1135', 'WO-2025-1142']
    },
    {
      id: '2',
      materialCode: 'RM-BRASS-002',
      materialName: 'Brass Rod (25mm diameter)',
      category: 'Raw Material',
      uom: 'meter',
      grossRequirement: 480,
      scheduledReceipts: 0,
      onHandInventory: 120,
      netRequirement: 360,
      plannedOrderQuantity: 500,
      requiredDate: '2025-10-23',
      leadTimeDays: 10,
      safetyStock: 100,
      status: 'critical',
      relatedWorkOrders: ['WO-2025-1138']
    },
    {
      id: '3',
      materialCode: 'CP-VALVE-003',
      materialName: 'Ceramic Disc Valve Cartridge',
      category: 'Component',
      uom: 'pcs',
      grossRequirement: 850,
      scheduledReceipts: 600,
      onHandInventory: 420,
      netRequirement: 0,
      plannedOrderQuantity: 0,
      requiredDate: '2025-10-28',
      leadTimeDays: 14,
      safetyStock: 150,
      status: 'sufficient',
      relatedWorkOrders: ['WO-2025-1138', 'WO-2025-1140']
    },
    {
      id: '4',
      materialCode: 'RM-GRANITE-004',
      materialName: 'Granite Slab - Black Galaxy',
      category: 'Raw Material',
      uom: 'sq.ft',
      grossRequirement: 320,
      scheduledReceipts: 150,
      onHandInventory: 85,
      netRequirement: 85,
      plannedOrderQuantity: 200,
      requiredDate: '2025-10-26',
      leadTimeDays: 12,
      safetyStock: 50,
      status: 'shortage',
      relatedWorkOrders: ['WO-2025-1145']
    },
    {
      id: '5',
      materialCode: 'CP-HANDLE-005',
      materialName: 'Chrome Plated Lever Handle',
      category: 'Component',
      uom: 'pcs',
      grossRequirement: 680,
      scheduledReceipts: 400,
      onHandInventory: 180,
      netRequirement: 100,
      plannedOrderQuantity: 300,
      requiredDate: '2025-10-27',
      leadTimeDays: 8,
      safetyStock: 120,
      status: 'planned',
      relatedWorkOrders: ['WO-2025-1138', 'WO-2025-1140', 'WO-2025-1142']
    },
    {
      id: '6',
      materialCode: 'RM-ALUMINUM-006',
      materialName: 'Aluminum Extrusion Profile',
      category: 'Raw Material',
      uom: 'meter',
      grossRequirement: 920,
      scheduledReceipts: 1000,
      onHandInventory: 450,
      netRequirement: 0,
      plannedOrderQuantity: 0,
      requiredDate: '2025-10-29',
      leadTimeDays: 9,
      safetyStock: 180,
      status: 'sufficient',
      relatedWorkOrders: ['WO-2025-1147', 'WO-2025-1149']
    },
    {
      id: '7',
      materialCode: 'CP-GASKET-007',
      materialName: 'Silicone Gasket (Food Grade)',
      category: 'Component',
      uom: 'pcs',
      grossRequirement: 1450,
      scheduledReceipts: 800,
      onHandInventory: 220,
      netRequirement: 430,
      plannedOrderQuantity: 600,
      requiredDate: '2025-10-24',
      leadTimeDays: 5,
      safetyStock: 200,
      status: 'critical',
      relatedWorkOrders: ['WO-2025-1135', 'WO-2025-1142', 'WO-2025-1147']
    },
    {
      id: '8',
      materialCode: 'RM-WOOD-008',
      materialName: 'Hardwood Plywood (18mm)',
      category: 'Raw Material',
      uom: 'sheet',
      grossRequirement: 145,
      scheduledReceipts: 80,
      onHandInventory: 42,
      netRequirement: 23,
      plannedOrderQuantity: 50,
      requiredDate: '2025-10-30',
      leadTimeDays: 11,
      safetyStock: 20,
      status: 'planned',
      relatedWorkOrders: ['WO-2025-1150']
    },
    {
      id: '9',
      materialCode: 'CP-MOTOR-009',
      materialName: 'Electric Motor (250W) - Kitchen Appliance',
      category: 'Component',
      uom: 'pcs',
      grossRequirement: 185,
      scheduledReceipts: 0,
      onHandInventory: 35,
      netRequirement: 150,
      plannedOrderQuantity: 200,
      requiredDate: '2025-10-22',
      leadTimeDays: 18,
      safetyStock: 30,
      status: 'critical',
      relatedWorkOrders: ['WO-2025-1143']
    },
    {
      id: '10',
      materialCode: 'RM-CERAMIC-010',
      materialName: 'Ceramic Coating Material',
      category: 'Raw Material',
      uom: 'liter',
      grossRequirement: 280,
      scheduledReceipts: 150,
      onHandInventory: 95,
      netRequirement: 35,
      plannedOrderQuantity: 100,
      requiredDate: '2025-10-28',
      leadTimeDays: 6,
      safetyStock: 50,
      status: 'shortage',
      relatedWorkOrders: ['WO-2025-1146', 'WO-2025-1148']
    }
  ];

  const filteredRequirements = requirements.filter(req => {
    const categoryMatch = filterCategory === 'all' || req.category === filterCategory;
    const statusMatch = filterStatus === 'all' || req.status === filterStatus;
    return categoryMatch && statusMatch;
  });

  const totalGrossRequirement = requirements.reduce((sum, req) => sum + req.grossRequirement, 0);
  const totalNetRequirement = requirements.reduce((sum, req) => sum + req.netRequirement, 0);
  const criticalItems = requirements.filter(req => req.status === 'critical').length;
  const shortageItems = requirements.filter(req => req.status === 'shortage').length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sufficient': return 'text-green-700 bg-green-100';
      case 'planned': return 'text-blue-700 bg-blue-100';
      case 'shortage': return 'text-yellow-700 bg-yellow-100';
      case 'critical': return 'text-red-700 bg-red-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sufficient': return <CheckCircle className="w-4 h-4" />;
      case 'critical': return <AlertTriangle className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-3 py-2">
      {/* Inline Header */}
      <div className="mb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Material Requirements</h1>
            <p className="text-sm text-gray-500 mt-1">MRP - Net requirements calculation and planning</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            <span>Run MRP</span>
          </button>
          <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-3">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-3 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Total Materials</p>
              <p className="text-2xl font-bold text-blue-900 mt-1">{requirements.length}</p>
            </div>
            <div className="p-3 bg-blue-200 rounded-lg">
              <Package className="w-6 h-6 text-blue-700" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-3 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">Net Requirement</p>
              <p className="text-2xl font-bold text-purple-900 mt-1">{totalNetRequirement.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-purple-200 rounded-lg">
              <Calendar className="w-6 h-6 text-purple-700" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-3 border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-600">Critical Items</p>
              <p className="text-2xl font-bold text-red-900 mt-1">{criticalItems}</p>
            </div>
            <div className="p-3 bg-red-200 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-700" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-3 border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-600">Shortage Items</p>
              <p className="text-2xl font-bold text-yellow-900 mt-1">{shortageItems}</p>
            </div>
            <div className="p-3 bg-yellow-200 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-yellow-700" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-3 mb-3">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-400" />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Categories</option>
            <option value="Raw Material">Raw Material</option>
            <option value="Component">Component</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="sufficient">Sufficient</option>
            <option value="planned">Planned</option>
            <option value="shortage">Shortage</option>
            <option value="critical">Critical</option>
          </select>
        </div>
      </div>

      {/* Requirements Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Material</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Gross Req.</th>
                <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Scheduled</th>
                <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">On Hand</th>
                <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Net Req.</th>
                <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Planned Order</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Required Date</th>
                <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Lead Time</th>
                <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRequirements.map((req) => (
                <tr key={req.id} className="hover:bg-gray-50">
                  <td className="px-3 py-2">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{req.materialCode}</div>
                      <div className="text-sm text-gray-500">{req.materialName}</div>
                    </div>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <span className="text-sm text-gray-700">{req.category}</span>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-right">
                    <span className="text-sm font-medium text-gray-900">{req.grossRequirement.toLocaleString()}</span>
                    <span className="text-xs text-gray-500 ml-1">{req.uom}</span>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-right">
                    <span className="text-sm text-gray-700">{req.scheduledReceipts.toLocaleString()}</span>
                    <span className="text-xs text-gray-500 ml-1">{req.uom}</span>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-right">
                    <span className="text-sm text-gray-700">{req.onHandInventory.toLocaleString()}</span>
                    <span className="text-xs text-gray-500 ml-1">{req.uom}</span>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-right">
                    <span className={`text-sm font-medium ${req.netRequirement > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                      {req.netRequirement.toLocaleString()}
                    </span>
                    <span className="text-xs text-gray-500 ml-1">{req.uom}</span>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-right">
                    <span className="text-sm font-medium text-blue-600">{req.plannedOrderQuantity.toLocaleString()}</span>
                    <span className="text-xs text-gray-500 ml-1">{req.uom}</span>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <div className="flex items-center gap-1 text-sm text-gray-700">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      {req.requiredDate}
                    </div>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-center">
                    <span className="text-sm text-gray-700">{req.leadTimeDays} days</span>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-center">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(req.status)}`}>
                      {getStatusIcon(req.status)}
                      {req.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

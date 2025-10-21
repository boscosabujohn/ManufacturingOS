'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Download, AlertTriangle, Calendar, Package, DollarSign, TrendingUp, Clock } from 'lucide-react';

interface MaterialShortage {
  id: string;
  materialCode: string;
  materialName: string;
  category: string;
  uom: string;
  requiredQuantity: number;
  availableQuantity: number;
  shortageQuantity: number;
  shortagePercentage: number;
  criticalityLevel: 'critical' | 'high' | 'medium' | 'low';
  requiredDate: string;
  daysUntilRequired: number;
  affectedWorkOrders: string[];
  affectedWOCount: number;
  estimatedImpactValue: number;
  suggestedAction: string;
  currentLeadTime: number;
  preferredSupplier: string;
  alternativeSuppliers: string[];
  lastPurchasePrice: number;
  status: 'pending-resolution' | 'order-placed' | 'expediting' | 'resolved';
}

export default function MRPShortagePage() {
  const router = useRouter();
  const [filterCriticality, setFilterCriticality] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Mock data for material shortages
  const shortages: MaterialShortage[] = [
    {
      id: '1',
      materialCode: 'RM-BRASS-002',
      materialName: 'Brass Rod (25mm diameter)',
      category: 'Raw Material',
      uom: 'meter',
      requiredQuantity: 480,
      availableQuantity: 120,
      shortageQuantity: 360,
      shortagePercentage: 75,
      criticalityLevel: 'critical',
      requiredDate: '2025-10-23',
      daysUntilRequired: 3,
      affectedWorkOrders: ['WO-2025-1138', 'WO-2025-1140'],
      affectedWOCount: 2,
      estimatedImpactValue: 425000,
      suggestedAction: 'Expedite purchase order - contact alternative suppliers',
      currentLeadTime: 10,
      preferredSupplier: 'Metal Works Limited',
      alternativeSuppliers: ['Brass India Co.', 'Premium Metals Ltd'],
      lastPurchasePrice: 370,
      status: 'expediting'
    },
    {
      id: '2',
      materialCode: 'CP-GASKET-007',
      materialName: 'Silicone Gasket (Food Grade)',
      category: 'Component',
      uom: 'pcs',
      requiredQuantity: 1450,
      availableQuantity: 220,
      shortageQuantity: 430,
      shortagePercentage: 70.3,
      criticalityLevel: 'critical',
      requiredDate: '2025-10-24',
      daysUntilRequired: 4,
      affectedWorkOrders: ['WO-2025-1135', 'WO-2025-1142', 'WO-2025-1147'],
      affectedWOCount: 3,
      estimatedImpactValue: 385000,
      suggestedAction: 'Emergency order required - multiple work orders at risk',
      currentLeadTime: 5,
      preferredSupplier: 'Silicone Tech India',
      alternativeSuppliers: ['Gasket Solutions', 'Food Grade Components Ltd'],
      lastPurchasePrice: 60,
      status: 'order-placed'
    },
    {
      id: '3',
      materialCode: 'CP-MOTOR-009',
      materialName: 'Electric Motor (250W) - Kitchen Appliance',
      category: 'Component',
      uom: 'pcs',
      requiredQuantity: 185,
      availableQuantity: 35,
      shortageQuantity: 150,
      shortagePercentage: 81.1,
      criticalityLevel: 'critical',
      requiredDate: '2025-10-22',
      daysUntilRequired: 2,
      affectedWorkOrders: ['WO-2025-1143'],
      affectedWOCount: 1,
      estimatedImpactValue: 620000,
      suggestedAction: 'Critical shortage - production line stoppage risk',
      currentLeadTime: 18,
      preferredSupplier: 'Electric Motors Pvt Ltd',
      alternativeSuppliers: ['Motor Tech India', 'Appliance Components Co.'],
      lastPurchasePrice: 1600,
      status: 'pending-resolution'
    },
    {
      id: '4',
      materialCode: 'RM-GRANITE-004',
      materialName: 'Granite Slab - Black Galaxy',
      category: 'Raw Material',
      uom: 'sq.ft',
      requiredQuantity: 320,
      availableQuantity: 85,
      shortageQuantity: 85,
      shortagePercentage: 26.6,
      criticalityLevel: 'high',
      requiredDate: '2025-10-26',
      daysUntilRequired: 6,
      affectedWorkOrders: ['WO-2025-1145'],
      affectedWOCount: 1,
      estimatedImpactValue: 295000,
      suggestedAction: 'Place purchase order - sufficient lead time available',
      currentLeadTime: 12,
      preferredSupplier: 'Indian Granite Suppliers',
      alternativeSuppliers: ['Stone Masters', 'Premium Granite Ltd'],
      lastPurchasePrice: 840,
      status: 'order-placed'
    },
    {
      id: '5',
      materialCode: 'RM-CERAMIC-010',
      materialName: 'Ceramic Coating Material',
      category: 'Raw Material',
      uom: 'liter',
      requiredQuantity: 280,
      availableQuantity: 95,
      shortageQuantity: 135,
      shortagePercentage: 48.2,
      criticalityLevel: 'high',
      requiredDate: '2025-10-28',
      daysUntilRequired: 8,
      affectedWorkOrders: ['WO-2025-1146', 'WO-2025-1148'],
      affectedWOCount: 2,
      estimatedImpactValue: 175000,
      suggestedAction: 'Standard purchase order - monitor lead time',
      currentLeadTime: 6,
      preferredSupplier: 'Ceramic Coatings India',
      alternativeSuppliers: ['Non-Stick Solutions', 'Coating Tech Ltd'],
      lastPurchasePrice: 480,
      status: 'order-placed'
    },
    {
      id: '6',
      materialCode: 'RM-SS304-001',
      materialName: 'Stainless Steel 304 Sheet (2mm)',
      category: 'Raw Material',
      uom: 'kg',
      requiredQuantity: 1250,
      availableQuantity: 350,
      shortageQuantity: 100,
      shortagePercentage: 8,
      criticalityLevel: 'medium',
      requiredDate: '2025-10-25',
      daysUntilRequired: 5,
      affectedWorkOrders: ['WO-2025-1135', 'WO-2025-1142'],
      affectedWOCount: 2,
      estimatedImpactValue: 145000,
      suggestedAction: 'Minor shortage - scheduled receipt covers requirement',
      currentLeadTime: 7,
      preferredSupplier: 'Steel India Pvt Ltd',
      alternativeSuppliers: ['Metal Suppliers Co.', 'Steel Works Ltd'],
      lastPurchasePrice: 550,
      status: 'resolved'
    },
    {
      id: '7',
      materialCode: 'CP-HANDLE-005',
      materialName: 'Chrome Plated Lever Handle',
      category: 'Component',
      uom: 'pcs',
      requiredQuantity: 680,
      availableQuantity: 180,
      shortageQuantity: 100,
      shortagePercentage: 14.7,
      criticalityLevel: 'medium',
      requiredDate: '2025-10-27',
      daysUntilRequired: 7,
      affectedWorkOrders: ['WO-2025-1138', 'WO-2025-1140', 'WO-2025-1142'],
      affectedWOCount: 3,
      estimatedImpactValue: 125000,
      suggestedAction: 'Production order placed - internal manufacturing',
      currentLeadTime: 8,
      preferredSupplier: 'Internal Production',
      alternativeSuppliers: ['Chrome Parts Ltd', 'Handle Manufacturing Co.'],
      lastPurchasePrice: 150,
      status: 'order-placed'
    },
    {
      id: '8',
      materialCode: 'RM-WOOD-008',
      materialName: 'Hardwood Plywood (18mm)',
      category: 'Raw Material',
      uom: 'sheet',
      requiredQuantity: 145,
      availableQuantity: 42,
      shortageQuantity: 53,
      shortagePercentage: 36.6,
      criticalityLevel: 'low',
      requiredDate: '2025-10-30',
      daysUntilRequired: 10,
      affectedWorkOrders: ['WO-2025-1150'],
      affectedWOCount: 1,
      estimatedImpactValue: 89000,
      suggestedAction: 'Sufficient time - place standard purchase order',
      currentLeadTime: 11,
      preferredSupplier: 'Premium Wood Industries',
      alternativeSuppliers: ['Wood Suppliers Ltd', 'Timber Products Co.'],
      lastPurchasePrice: 1350,
      status: 'pending-resolution'
    }
  ];

  const filteredShortages = shortages.filter(shortage => {
    const criticalityMatch = filterCriticality === 'all' || shortage.criticalityLevel === filterCriticality;
    const statusMatch = filterStatus === 'all' || shortage.status === filterStatus;
    return criticalityMatch && statusMatch;
  });

  const totalShortages = shortages.length;
  const criticalShortages = shortages.filter(s => s.criticalityLevel === 'critical').length;
  const totalImpactValue = shortages.reduce((sum, s) => sum + s.estimatedImpactValue, 0);
  const affectedWorkOrders = new Set(shortages.flatMap(s => s.affectedWorkOrders)).size;

  const getCriticalityColor = (level: string) => {
    switch (level) {
      case 'critical': return 'text-red-700 bg-red-100 border-red-200';
      case 'high': return 'text-orange-700 bg-orange-100 border-orange-200';
      case 'medium': return 'text-yellow-700 bg-yellow-100 border-yellow-200';
      case 'low': return 'text-green-700 bg-green-100 border-green-200';
      default: return 'text-gray-700 bg-gray-100 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending-resolution': return 'text-red-700 bg-red-100';
      case 'order-placed': return 'text-blue-700 bg-blue-100';
      case 'expediting': return 'text-orange-700 bg-orange-100';
      case 'resolved': return 'text-green-700 bg-green-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-6">
      {/* Inline Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Material Shortages</h1>
            <p className="text-sm text-gray-500 mt-1">MRP - Critical material shortage analysis</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            <span>Resolve Critical</span>
          </button>
          <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6 border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-600">Total Shortages</p>
              <p className="text-2xl font-bold text-red-900 mt-1">{totalShortages}</p>
            </div>
            <div className="p-3 bg-red-200 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-700" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-600">Critical Items</p>
              <p className="text-2xl font-bold text-orange-900 mt-1">{criticalShortages}</p>
            </div>
            <div className="p-3 bg-orange-200 rounded-lg">
              <Package className="w-6 h-6 text-orange-700" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">Impact Value</p>
              <p className="text-2xl font-bold text-purple-900 mt-1">₹{(totalImpactValue / 100000).toFixed(1)}L</p>
            </div>
            <div className="p-3 bg-purple-200 rounded-lg">
              <DollarSign className="w-6 h-6 text-purple-700" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Affected Work Orders</p>
              <p className="text-2xl font-bold text-blue-900 mt-1">{affectedWorkOrders}</p>
            </div>
            <div className="p-3 bg-blue-200 rounded-lg">
              <TrendingUp className="w-6 h-6 text-blue-700" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
        <div className="flex items-center gap-4">
          <AlertTriangle className="w-5 h-5 text-gray-400" />
          <select
            value={filterCriticality}
            onChange={(e) => setFilterCriticality(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Criticality Levels</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="pending-resolution">Pending Resolution</option>
            <option value="order-placed">Order Placed</option>
            <option value="expediting">Expediting</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>
      </div>

      {/* Shortages List */}
      <div className="space-y-4">
        {filteredShortages.map((shortage) => (
          <div key={shortage.id} className={`bg-white rounded-xl border-2 p-6 ${getCriticalityColor(shortage.criticalityLevel)}`}>
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
              {/* Left Section - Material Info */}
              <div className="flex-1">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-white rounded-lg">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-bold text-gray-900">{shortage.materialCode}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCriticalityColor(shortage.criticalityLevel)}`}>
                        {shortage.criticalityLevel}
                      </span>
                    </div>
                    <p className="text-gray-700 font-medium mb-2">{shortage.materialName}</p>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Required</p>
                        <p className="font-semibold text-gray-900">{shortage.requiredQuantity.toLocaleString()} {shortage.uom}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Available</p>
                        <p className="font-semibold text-gray-900">{shortage.availableQuantity.toLocaleString()} {shortage.uom}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Shortage</p>
                        <p className="font-semibold text-red-600">{shortage.shortageQuantity.toLocaleString()} {shortage.uom}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Shortage %</p>
                        <p className="font-semibold text-red-600">{shortage.shortagePercentage.toFixed(1)}%</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Section - Timeline & Impact */}
              <div className="lg:w-80 space-y-3">
                <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">Required in</span>
                  </div>
                  <span className="text-sm font-bold text-gray-900">{shortage.daysUntilRequired} days</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">Required Date</span>
                  </div>
                  <span className="text-sm font-bold text-gray-900">{shortage.requiredDate}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">Affected WOs</span>
                  </div>
                  <span className="text-sm font-bold text-gray-900">{shortage.affectedWOCount}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">Impact Value</span>
                  </div>
                  <span className="text-sm font-bold text-gray-900">₹{shortage.estimatedImpactValue.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Bottom Section - Action & Status */}
            <div className="mt-4 pt-4 border-t border-gray-200 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
              <div className="flex-1">
                <p className="text-sm text-gray-600 mb-1">Suggested Action</p>
                <p className="text-sm font-medium text-gray-900">{shortage.suggestedAction}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Preferred Supplier: {shortage.preferredSupplier} | Lead Time: {shortage.currentLeadTime} days
                </p>
              </div>
              <div>
                <span className={`inline-flex px-4 py-2 rounded-lg text-sm font-medium ${getStatusColor(shortage.status)}`}>
                  {shortage.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft, Edit, Warehouse as WarehouseIcon, MapPin, Package,
  Users, DollarSign, BarChart3, TrendingUp, AlertTriangle,
  CheckCircle, Phone, Mail, Calendar, Activity, Download
} from 'lucide-react';

interface Warehouse {
  id: string;
  warehouseCode: string;
  warehouseName: string;
  warehouseType: 'main' | 'auxiliary' | 'transit' | 'external';
  address: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  contactPerson: string;
  contactPhone: string;
  contactEmail: string;
  totalArea: number;
  usedArea: number;
  areaUnit: string;
  totalCapacity: number;
  usedCapacity: number;
  capacityUnit: string;
  zones: number;
  aisles: number;
  racks: number;
  bins: number;
  status: 'active' | 'inactive' | 'maintenance';
  temperature controlled: boolean;
  securityEnabled: boolean;
  fireSafety: boolean;
  manager: string;
  establishedDate: string;
  createdBy: string;
  createdDate: string;
}

interface ZoneInfo {
  zone: string;
  name: string;
  aisles: number;
  capacity: number;
  utilized: number;
  itemsStored: number;
  utilizationPercentage: number;
}

interface StockSummary {
  category: string;
  itemCount: number;
  totalQuantity: number;
  totalValue: number;
  percentage: number;
}

interface ActivityLog {
  id: string;
  timestamp: string;
  action: string;
  user: string;
  details: string;
  type: 'info' | 'warning' | 'success';
}

export default function WarehouseViewPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'overview' | 'zones' | 'stock' | 'activity'>('overview');

  // Mock data
  const warehouse: Warehouse = {
    id: params.id,
    warehouseCode: 'WH-PUNE-001',
    warehouseName: 'Main Warehouse - Pune',
    warehouseType: 'main',
    address: 'Plot No. 45, Chakan Industrial Area, Phase II',
    city: 'Pune',
    state: 'Maharashtra',
    pincode: '410501',
    country: 'India',
    contactPerson: 'Rajesh Kulkarni',
    contactPhone: '+91 20 2765 4321',
    contactEmail: 'rajesh.kulkarni@company.com',
    totalArea: 50000,
    usedArea: 38500,
    areaUnit: 'sq ft',
    totalCapacity: 25000,
    usedCapacity: 19250,
    capacityUnit: 'pallets',
    zones: 8,
    aisles: 45,
    racks: 180,
    bins: 1440,
    status: 'active',
    temperatureControlled: true,
    securityEnabled: true,
    fireSafety: true,
    manager: 'Priya Sharma',
    establishedDate: '2020-03-15',
    createdBy: 'Admin',
    createdDate: '2020-02-01'
  };

  const zones: ZoneInfo[] = [
    { zone: 'A', name: 'Raw Materials - Metals', aisles: 8, capacity: 5000, utilized: 4250, itemsStored: 142, utilizationPercentage: 85.0 },
    { zone: 'B', name: 'Raw Materials - Plastics', aisles: 6, capacity: 3000, utilized: 2100, itemsStored: 89, utilizationPercentage: 70.0 },
    { zone: 'C', name: 'Components - Electrical', aisles: 7, capacity: 4000, utilized: 3400, itemsStored: 256, utilizationPercentage: 85.0 },
    { zone: 'D', name: 'Components - Mechanical', aisles: 6, capacity: 3500, utilized: 2975, itemsStored: 198, utilizationPercentage: 85.0 },
    { zone: 'E', name: 'Finished Goods', aisles: 8, capacity: 4500, utilized: 3150, itemsStored: 112, utilizationPercentage: 70.0 },
    { zone: 'F', name: 'Packaging Materials', aisles: 4, capacity: 2000, utilized: 1400, itemsStored: 67, utilizationPercentage: 70.0 },
    { zone: 'G', name: 'Tools & Equipment', aisles: 3, capacity: 1500, utilized: 975, itemsStored: 145, utilizationPercentage: 65.0 },
    { zone: 'H', name: 'Quarantine & Returns', aisles: 3, capacity: 1500, utilized: 1000, itemsStored: 34, utilizationPercentage: 66.7 }
  ];

  const stockSummary: StockSummary[] = [
    { category: 'Raw Materials', itemCount: 285, totalQuantity: 156420, totalValue: 28956780, percentage: 42.5 },
    { category: 'Components', itemCount: 542, totalQuantity: 89650, totalValue: 18742500, percentage: 27.5 },
    { category: 'Finished Goods', itemCount: 156, totalQuantity: 8945, totalValue: 15680000, percentage: 23.0 },
    { category: 'Packaging Materials', itemCount: 89, totalQuantity: 45620, totalValue: 2845000, percentage: 4.2 },
    { category: 'Tools & Equipment', itemCount: 198, totalQuantity: 1256, totalValue: 1890000, percentage: 2.8 }
  ];

  const activityLog: ActivityLog[] = [
    { id: 'A1', timestamp: '2025-10-16 16:45', action: 'Stock Receipt', user: 'Sunita Reddy', details: 'Received 500 KG of SS304 sheets - PO-2025-5678', type: 'success' },
    { id: 'A2', timestamp: '2025-10-16 14:20', action: 'Stock Issue', user: 'Amit Kumar', details: 'Issued 125 KG to WO-2025-1234', type: 'info' },
    { id: 'A3', timestamp: '2025-10-16 11:30', action: 'Bin Relocation', user: 'Vikram Singh', details: 'Moved items from Bin AA-001 to AA-005', type: 'info' },
    { id: 'A4', timestamp: '2025-10-16 09:15', action: 'Cycle Count', user: 'Lakshmi Iyer', details: 'Completed cycle count for Zone A - 2 discrepancies found', type: 'warning' },
    { id: 'A5', timestamp: '2025-10-15 17:30', action: 'Stock Transfer Out', user: 'Mohammed Ali', details: 'Transferred 150 KG to Bangalore warehouse', type: 'info' },
    { id: 'A6', timestamp: '2025-10-15 14:50', action: 'Quality Hold', user: 'Anjali Mehta', details: 'Moved rejected items to Zone H', type: 'warning' },
    { id: 'A7', timestamp: '2025-10-15 10:20', action: 'Stock Receipt', user: 'Sunita Reddy', details: 'Received 300 PCS motors - PO-2025-5599', type: 'success' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'main': return 'Main Warehouse';
      case 'auxiliary': return 'Auxiliary Storage';
      case 'transit': return 'Transit Hub';
      case 'external': return 'External Storage';
      default: return type;
    }
  };

  const getUtilizationColor = (percentage: number) => {
    if (percentage >= 90) return 'text-red-600 bg-red-100';
    if (percentage >= 75) return 'text-orange-600 bg-orange-100';
    if (percentage >= 50) return 'text-yellow-600 bg-yellow-100';
    return 'text-green-600 bg-green-100';
  };

  const areaUtilization = ((warehouse.usedArea / warehouse.totalArea) * 100).toFixed(1);
  const capacityUtilization = ((warehouse.usedCapacity / warehouse.totalCapacity) * 100).toFixed(1);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-gray-900">{warehouse.warehouseName}</h1>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(warehouse.status)}`}>
                {warehouse.status.toUpperCase()}
              </span>
              <span className="px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-700">
                {getTypeLabel(warehouse.warehouseType)}
              </span>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <WarehouseIcon className="w-4 h-4" />
                <span className="font-mono font-semibold">{warehouse.warehouseCode}</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {warehouse.city}, {warehouse.state}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                Manager: {warehouse.manager}
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
            <Download className="w-4 h-4" />
            Export
          </button>
          <button
            onClick={() => router.push(`/inventory/warehouse/edit/${params.id}`)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700"
          >
            <Edit className="w-4 h-4" />
            Edit Warehouse
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-5 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl text-white">
          <div className="flex items-center justify-between mb-2">
            <BarChart3 className="w-8 h-8 opacity-80" />
          </div>
          <div className="text-3xl font-bold mb-1">{zones.reduce((sum, z) => sum + z.itemsStored, 0)}</div>
          <div className="text-blue-100 text-sm">Total Items</div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-xl text-white">
          <div className="flex items-center justify-between mb-2">
            <Package className="w-8 h-8 opacity-80" />
            <span className="text-sm text-green-100">{areaUtilization}%</span>
          </div>
          <div className="text-3xl font-bold mb-1">{warehouse.usedArea.toLocaleString()}</div>
          <div className="text-green-100 text-sm">Used Area ({warehouse.areaUnit})</div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-xl text-white">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-8 h-8 opacity-80" />
            <span className="text-sm text-purple-100">{capacityUtilization}%</span>
          </div>
          <div className="text-3xl font-bold mb-1">{warehouse.usedCapacity.toLocaleString()}</div>
          <div className="text-purple-100 text-sm">Used Capacity ({warehouse.capacityUnit})</div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-6 rounded-xl text-white">
          <div className="flex items-center justify-between mb-2">
            <MapPin className="w-8 h-8 opacity-80" />
          </div>
          <div className="text-3xl font-bold mb-1">{warehouse.zones}</div>
          <div className="text-orange-100 text-sm">Storage Zones</div>
        </div>

        <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 p-6 rounded-xl text-white">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="w-8 h-8 opacity-80" />
          </div>
          <div className="text-3xl font-bold mb-1">₹{(stockSummary.reduce((sum, s) => sum + s.totalValue, 0) / 10000000).toFixed(1)}Cr</div>
          <div className="text-indigo-100 text-sm">Stock Value</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex gap-6">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-3 px-1 border-b-2 font-medium transition-colors ${
              activeTab === 'overview'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('zones')}
            className={`pb-3 px-1 border-b-2 font-medium transition-colors ${
              activeTab === 'zones'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Zones & Capacity
          </button>
          <button
            onClick={() => setActiveTab('stock')}
            className={`pb-3 px-1 border-b-2 font-medium transition-colors ${
              activeTab === 'stock'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Stock Summary
          </button>
          <button
            onClick={() => setActiveTab('activity')}
            className={`pb-3 px-1 border-b-2 font-medium transition-colors ${
              activeTab === 'activity'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Recent Activity
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Warehouse Information */}
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <WarehouseIcon className="w-5 h-5 text-blue-600" />
                Warehouse Information
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Warehouse Code</span>
                  <span className="font-mono font-semibold text-gray-900">{warehouse.warehouseCode}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Type</span>
                  <span className="font-medium text-gray-900">{getTypeLabel(warehouse.warehouseType)}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Status</span>
                  <span className={`px-2 py-1 rounded text-sm font-semibold ${getStatusColor(warehouse.status)}`}>
                    {warehouse.status.toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Manager</span>
                  <span className="font-medium text-gray-900">{warehouse.manager}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Established Date</span>
                  <span className="font-medium text-gray-900">{warehouse.establishedDate}</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-green-600" />
                Location & Contact
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-gray-600 block mb-1">Address</label>
                  <p className="text-sm font-medium text-gray-900">{warehouse.address}</p>
                  <p className="text-sm text-gray-700 mt-1">
                    {warehouse.city}, {warehouse.state} - {warehouse.pincode}
                  </p>
                </div>
                <div className="pt-3 border-t border-gray-200">
                  <label className="text-sm text-gray-600 block mb-2">Contact Person</label>
                  <p className="font-semibold text-gray-900 mb-2">{warehouse.contactPerson}</p>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-700">{warehouse.contactPhone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-700">{warehouse.contactEmail}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Capacity Information */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-purple-600" />
              Capacity & Utilization
            </h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="text-sm text-gray-600 block mb-2">Area Utilization</label>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-700">
                    {warehouse.usedArea.toLocaleString()} / {warehouse.totalArea.toLocaleString()} {warehouse.areaUnit}
                  </span>
                  <span className={`px-2 py-1 rounded text-sm font-bold ${getUtilizationColor(parseFloat(areaUtilization))}`}>
                    {areaUtilization}%
                  </span>
                </div>
                <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${
                      parseFloat(areaUtilization) >= 90 ? 'bg-red-500' :
                      parseFloat(areaUtilization) >= 75 ? 'bg-orange-500' :
                      parseFloat(areaUtilization) >= 50 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${areaUtilization}%` }}
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-600 block mb-2">Capacity Utilization</label>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-700">
                    {warehouse.usedCapacity.toLocaleString()} / {warehouse.totalCapacity.toLocaleString()} {warehouse.capacityUnit}
                  </span>
                  <span className={`px-2 py-1 rounded text-sm font-bold ${getUtilizationColor(parseFloat(capacityUtilization))}`}>
                    {capacityUtilization}%
                  </span>
                </div>
                <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${
                      parseFloat(capacityUtilization) >= 90 ? 'bg-red-500' :
                      parseFloat(capacityUtilization) >= 75 ? 'bg-orange-500' :
                      parseFloat(capacityUtilization) >= 50 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${capacityUtilization}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Storage Infrastructure */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Storage Infrastructure</h3>
            <div className="grid grid-cols-4 gap-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="text-3xl font-bold text-blue-900 mb-1">{warehouse.zones}</div>
                <div className="text-sm text-blue-600">Zones</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="text-3xl font-bold text-green-900 mb-1">{warehouse.aisles}</div>
                <div className="text-sm text-green-600">Aisles</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
                <div className="text-3xl font-bold text-purple-900 mb-1">{warehouse.racks}</div>
                <div className="text-sm text-purple-600">Racks</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
                <div className="text-3xl font-bold text-orange-900 mb-1">{warehouse.bins}</div>
                <div className="text-sm text-orange-600">Storage Bins</div>
              </div>
            </div>
          </div>

          {/* Facilities */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Facilities & Features</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className={`flex items-center gap-3 p-4 rounded-lg border-2 ${
                warehouse.temperatureControlled ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
              }`}>
                {warehouse.temperatureControlled ? (
                  <CheckCircle className="w-6 h-6 text-green-600" />
                ) : (
                  <AlertTriangle className="w-6 h-6 text-gray-400" />
                )}
                <div>
                  <div className="font-semibold text-gray-900">Temperature Control</div>
                  <div className="text-sm text-gray-600">
                    {warehouse.temperatureControlled ? 'Available' : 'Not Available'}
                  </div>
                </div>
              </div>

              <div className={`flex items-center gap-3 p-4 rounded-lg border-2 ${
                warehouse.securityEnabled ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
              }`}>
                {warehouse.securityEnabled ? (
                  <CheckCircle className="w-6 h-6 text-green-600" />
                ) : (
                  <AlertTriangle className="w-6 h-6 text-gray-400" />
                )}
                <div>
                  <div className="font-semibold text-gray-900">Security System</div>
                  <div className="text-sm text-gray-600">
                    {warehouse.securityEnabled ? 'Enabled' : 'Not Enabled'}
                  </div>
                </div>
              </div>

              <div className={`flex items-center gap-3 p-4 rounded-lg border-2 ${
                warehouse.fireSafety ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
              }`}>
                {warehouse.fireSafety ? (
                  <CheckCircle className="w-6 h-6 text-green-600" />
                ) : (
                  <AlertTriangle className="w-6 h-6 text-gray-400" />
                )}
                <div>
                  <div className="font-semibold text-gray-900">Fire Safety</div>
                  <div className="text-sm text-gray-600">
                    {warehouse.fireSafety ? 'Compliant' : 'Not Compliant'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'zones' && (
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Zone Details & Utilization</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Zone</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Name</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Aisles</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Capacity</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Utilized</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Items</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Utilization</th>
                </tr>
              </thead>
              <tbody>
                {zones.map((zone) => (
                  <tr key={zone.zone} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <span className="font-mono font-bold text-lg text-blue-600">{zone.zone}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-medium text-gray-900">{zone.name}</span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="text-sm font-medium text-gray-900">{zone.aisles}</span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="text-sm font-medium text-gray-900">{zone.capacity.toLocaleString()}</span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="text-sm font-bold text-blue-700">{zone.utilized.toLocaleString()}</span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="text-sm font-medium text-gray-900">{zone.itemsStored}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center gap-3">
                        <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${
                              zone.utilizationPercentage >= 90 ? 'bg-red-500' :
                              zone.utilizationPercentage >= 75 ? 'bg-orange-500' :
                              zone.utilizationPercentage >= 50 ? 'bg-yellow-500' : 'bg-green-500'
                            }`}
                            style={{ width: `${zone.utilizationPercentage}%` }}
                          />
                        </div>
                        <span className={`text-sm font-bold ${getUtilizationColor(zone.utilizationPercentage)}`}>
                          {zone.utilizationPercentage.toFixed(1)}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'stock' && (
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Stock Summary by Category</h3>
          <div className="space-y-4">
            {stockSummary.map((stock, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">{stock.category}</h4>
                    <div className="text-sm text-gray-600">
                      {stock.itemCount} items • {stock.totalQuantity.toLocaleString()} units
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-blue-700">
                      ₹{(stock.totalValue / 10000000).toFixed(2)}Cr
                    </div>
                    <div className="text-sm text-gray-600">{stock.percentage.toFixed(1)}% of total</div>
                  </div>
                </div>
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-blue-600"
                    style={{ width: `${stock.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-sm text-blue-600 mb-1">Total Items</div>
                <div className="text-2xl font-bold text-blue-900">
                  {stockSummary.reduce((sum, s) => sum + s.itemCount, 0)}
                </div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-sm text-green-600 mb-1">Total Quantity</div>
                <div className="text-2xl font-bold text-green-900">
                  {stockSummary.reduce((sum, s) => sum + s.totalQuantity, 0).toLocaleString()}
                </div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-sm text-purple-600 mb-1">Total Value</div>
                <div className="text-2xl font-bold text-purple-900">
                  ₹{(stockSummary.reduce((sum, s) => sum + s.totalValue, 0) / 10000000).toFixed(2)}Cr
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'activity' && (
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Recent Activity</h3>
          <div className="space-y-3">
            {activityLog.map((log) => (
              <div key={log.id} className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                  log.type === 'success' ? 'bg-green-100 text-green-600' :
                  log.type === 'warning' ? 'bg-yellow-100 text-yellow-600' :
                  'bg-blue-100 text-blue-600'
                }`}>
                  <Activity className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-1">
                    <h4 className="font-semibold text-gray-900">{log.action}</h4>
                    <span className="text-xs text-gray-500">{log.timestamp}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{log.details}</p>
                  <p className="text-xs text-gray-500">by {log.user}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Metadata */}
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between text-sm">
          <div>
            <span className="text-gray-600">Created By: </span>
            <span className="font-medium text-gray-900">{warehouse.createdBy}</span>
            <span className="text-gray-500 ml-2">{warehouse.createdDate}</span>
          </div>
          <div>
            <span className="text-gray-600">Warehouse ID: </span>
            <span className="font-mono font-medium text-gray-900">{warehouse.id}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Search, AlertTriangle, Calendar, Package, Clock, CheckCircle, XCircle } from 'lucide-react';

interface ExpiryItem {
  id: string;
  itemCode: string;
  itemName: string;
  batchNumber: string;
  quantity: number;
  uom: string;
  manufacturedDate: string;
  expiryDate: string;
  daysToExpiry: number;
  location: string;
  supplier: string;
  category: string;
  status: 'expired' | 'critical' | 'warning' | 'good';
}

export default function ExpiryTrackingPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const expiryItems: ExpiryItem[] = [
    {
      id: '1',
      itemCode: 'CHM-008',
      itemName: 'Cutting Fluid Concentrate',
      batchNumber: 'BATCH-2024-156',
      quantity: 25,
      uom: 'Liters',
      manufacturedDate: '2024-10-10',
      expiryDate: '2025-10-10',
      daysToExpiry: -11,
      location: 'Zone D - Bin D-02-R01',
      supplier: 'ChemSupply Co',
      category: 'Chemicals',
      status: 'expired'
    },
    {
      id: '2',
      itemCode: 'CP-015',
      itemName: 'Hydraulic Oil Grade 46',
      batchNumber: 'BATCH-2025-002',
      quantity: 80,
      uom: 'Liters',
      manufacturedDate: '2025-08-20',
      expiryDate: '2026-02-20',
      daysToExpiry: 122,
      location: 'Zone D - Bin D-01-R02',
      supplier: 'LubeTech Industries',
      category: 'Consumables',
      status: 'warning'
    },
    {
      id: '3',
      itemCode: 'ADH-102',
      itemName: 'Industrial Adhesive Epoxy',
      batchNumber: 'BATCH-2025-078',
      quantity: 15,
      uom: 'Kg',
      manufacturedDate: '2025-09-05',
      expiryDate: '2025-11-05',
      daysToExpiry: 15,
      location: 'Zone D - Bin D-03-R01',
      supplier: 'BondTech Solutions',
      category: 'Chemicals',
      status: 'critical'
    },
    {
      id: '4',
      itemCode: 'LUB-045',
      itemName: 'Grease Lithium Complex',
      batchNumber: 'BATCH-2025-089',
      quantity: 50,
      uom: 'Kg',
      manufacturedDate: '2025-08-15',
      expiryDate: '2025-11-20',
      daysToExpiry: 30,
      location: 'Zone D - Bin D-01-R03',
      supplier: 'LubeTech Industries',
      category: 'Consumables',
      status: 'critical'
    },
    {
      id: '5',
      itemCode: 'SLV-023',
      itemName: 'Solvent Degreaser',
      batchNumber: 'BATCH-2024-234',
      quantity: 10,
      uom: 'Liters',
      manufacturedDate: '2024-09-01',
      expiryDate: '2025-09-01',
      daysToExpiry: -50,
      location: 'Zone D - Bin D-02-R02',
      supplier: 'CleanChem Ltd',
      category: 'Chemicals',
      status: 'expired'
    },
    {
      id: '6',
      itemCode: 'PAI-067',
      itemName: 'Industrial Paint Primer',
      batchNumber: 'BATCH-2025-112',
      quantity: 35,
      uom: 'Liters',
      manufacturedDate: '2025-07-10',
      expiryDate: '2026-07-10',
      daysToExpiry: 262,
      location: 'Zone C - Bin C-01-R01',
      supplier: 'CoatTech Industries',
      category: 'Chemicals',
      status: 'good'
    },
    {
      id: '7',
      itemCode: 'CLN-034',
      itemName: 'Machine Coolant Additive',
      batchNumber: 'BATCH-2025-145',
      quantity: 60,
      uom: 'Liters',
      manufacturedDate: '2025-09-01',
      expiryDate: '2026-03-01',
      daysToExpiry: 131,
      location: 'Zone D - Bin D-01-R04',
      supplier: 'CoolTech Systems',
      category: 'Consumables',
      status: 'warning'
    },
    {
      id: '8',
      itemCode: 'SEA-089',
      itemName: 'Gasket Sealant Silicone',
      batchNumber: 'BATCH-2025-034',
      quantity: 20,
      uom: 'Tubes',
      manufacturedDate: '2025-06-15',
      expiryDate: '2025-12-15',
      daysToExpiry: 55,
      location: 'Zone C - Bin C-02-R01',
      supplier: 'SealPro Industries',
      category: 'Chemicals',
      status: 'warning'
    }
  ];

  const filteredItems = expiryItems.filter(item => {
    const matchesSearch = item.itemCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.batchNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'expired': return 'bg-red-100 text-red-700 border-red-200';
      case 'critical': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'warning': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'good': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'expired': return <XCircle className="w-4 h-4" />;
      case 'critical': return <AlertTriangle className="w-4 h-4" />;
      case 'warning': return <Clock className="w-4 h-4" />;
      case 'good': return <CheckCircle className="w-4 h-4" />;
      default: return null;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'expired': return 'Expired';
      case 'critical': return 'Critical (< 30 days)';
      case 'warning': return 'Warning (< 120 days)';
      case 'good': return 'Good';
      default: return status;
    }
  };

  const getDaysText = (days: number) => {
    if (days < 0) return `Expired ${Math.abs(days)} days ago`;
    if (days === 0) return 'Expires today';
    return `${days} days remaining`;
  };

  return (
    <div className="min-h-screen bg-gray-50 px-3 py-2">
      <div className="mb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="flex items-center gap-2">
          <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Expiry Tracking</h1>
            <p className="text-sm text-gray-500 mt-1">Monitor and manage items approaching expiration</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-3">
        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-3 border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-600">Expired</p>
              <p className="text-3xl font-bold text-red-900 mt-1">
                {expiryItems.filter(i => i.status === 'expired').length}
              </p>
            </div>
            <XCircle className="w-6 h-6 text-red-700" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-3 border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-600">Critical</p>
              <p className="text-3xl font-bold text-orange-900 mt-1">
                {expiryItems.filter(i => i.status === 'critical').length}
              </p>
              <p className="text-xs text-orange-600 mt-1">&lt; 30 days</p>
            </div>
            <AlertTriangle className="w-6 h-6 text-orange-700" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-3 border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-600">Warning</p>
              <p className="text-3xl font-bold text-yellow-900 mt-1">
                {expiryItems.filter(i => i.status === 'warning').length}
              </p>
              <p className="text-xs text-yellow-600 mt-1">&lt; 120 days</p>
            </div>
            <Clock className="w-6 h-6 text-yellow-700" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-3 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Good</p>
              <p className="text-3xl font-bold text-green-900 mt-1">
                {expiryItems.filter(i => i.status === 'good').length}
              </p>
              <p className="text-xs text-green-600 mt-1">&gt; 120 days</p>
            </div>
            <CheckCircle className="w-6 h-6 text-green-700" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-3 mb-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div className="relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by item code, name, or batch..."
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
            <option value="expired">Expired</option>
            <option value="critical">Critical (&lt; 30 days)</option>
            <option value="warning">Warning (&lt; 120 days)</option>
            <option value="good">Good (&gt; 120 days)</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Batch Number</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Quantity</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Manufactured</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expiry Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Days to Expiry</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Status</th>
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
                  <td className="px-4 py-3 text-sm font-mono font-bold text-gray-900">{item.batchNumber}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-right font-semibold">
                    {item.quantity} {item.uom}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-gray-400" />
                      {item.manufacturedDate}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-gray-400" />
                      {item.expiryDate}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className={`text-sm font-semibold ${
                      item.daysToExpiry < 0 ? 'text-red-600' :
                      item.daysToExpiry < 30 ? 'text-orange-600' :
                      item.daysToExpiry < 120 ? 'text-yellow-600' :
                      'text-green-600'
                    }`}>
                      {getDaysText(item.daysToExpiry)}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    <div className="flex items-center gap-1">
                      <Package className="w-3 h-3 text-gray-400" />
                      {item.location}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(item.status)}`}>
                      {getStatusIcon(item.status)}
                      {getStatusLabel(item.status)}
                    </span>
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

      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-3">
        <h3 className="text-sm font-semibold text-blue-900 mb-2">Expiry Management Guidelines:</h3>
        <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
          <li>Items marked as <strong>Expired</strong> should be quarantined and disposed per regulations</li>
          <li>Items with <strong>Critical</strong> status (&lt; 30 days) require immediate action or usage planning</li>
          <li>Items with <strong>Warning</strong> status (&lt; 120 days) should be prioritized for consumption</li>
          <li>Regular audits ensure compliance with safety and quality standards</li>
          <li>Coordinate with procurement to prevent over-stocking of time-sensitive materials</li>
        </ul>
      </div>
    </div>
  );
}

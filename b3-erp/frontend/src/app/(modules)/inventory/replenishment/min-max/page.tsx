'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Search, TrendingUp, TrendingDown, Edit, Save, X, AlertCircle, Calculator, Download, Upload } from 'lucide-react';

interface MinMaxSetting {
  id: string;
  itemCode: string;
  itemName: string;
  category: string;
  currentStock: number;
  minLevel: number;
  maxLevel: number;
  reorderPoint: number;
  uom: string;
  location: string;
  leadTimeDays: number;
  avgDailyUsage: number;
  safetyStock: number;
  lastReviewed: string;
  status: 'optimal' | 'review-needed' | 'critical';
}

export default function MinMaxSettingsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState({
    minLevel: '',
    maxLevel: '',
    reorderPoint: ''
  });

  const minMaxSettings: MinMaxSetting[] = [
    {
      id: '1',
      itemCode: 'RM-001',
      itemName: 'Steel Sheet 1mm',
      category: 'Raw Material',
      currentStock: 450,
      minLevel: 100,
      maxLevel: 500,
      reorderPoint: 120,
      uom: 'Sheets',
      location: 'Zone A - Bin A-01',
      leadTimeDays: 7,
      avgDailyUsage: 15,
      safetyStock: 30,
      lastReviewed: '2025-10-15',
      status: 'optimal'
    },
    {
      id: '2',
      itemCode: 'RM-008',
      itemName: 'Steel Plate 5mm',
      category: 'Raw Material',
      currentStock: 45,
      minLevel: 100,
      maxLevel: 500,
      reorderPoint: 120,
      uom: 'Sheets',
      location: 'Zone A - Bin A-01',
      leadTimeDays: 7,
      avgDailyUsage: 8,
      safetyStock: 20,
      lastReviewed: '2025-09-20',
      status: 'critical'
    },
    {
      id: '3',
      itemCode: 'CP-045',
      itemName: 'Hydraulic Cylinder',
      category: 'Component',
      currentStock: 12,
      minLevel: 10,
      maxLevel: 50,
      reorderPoint: 15,
      uom: 'Nos',
      location: 'Zone B - Bin B-03',
      leadTimeDays: 14,
      avgDailyUsage: 1,
      safetyStock: 5,
      lastReviewed: '2025-10-10',
      status: 'review-needed'
    },
    {
      id: '4',
      itemCode: 'RM-089',
      itemName: 'Aluminum Rod 20mm',
      category: 'Raw Material',
      currentStock: 78,
      minLevel: 50,
      maxLevel: 300,
      reorderPoint: 75,
      uom: 'Pcs',
      location: 'Zone A - Bin A-04',
      leadTimeDays: 5,
      avgDailyUsage: 12,
      safetyStock: 25,
      lastReviewed: '2025-10-18',
      status: 'review-needed'
    },
    {
      id: '5',
      itemCode: 'CS-023',
      itemName: 'Cutting Oil Premium',
      category: 'Consumable',
      currentStock: 35,
      minLevel: 30,
      maxLevel: 150,
      reorderPoint: 40,
      uom: 'Liters',
      location: 'Zone D - Bin D-02',
      leadTimeDays: 3,
      avgDailyUsage: 5,
      safetyStock: 10,
      lastReviewed: '2025-10-20',
      status: 'optimal'
    },
    {
      id: '6',
      itemCode: 'CP-078',
      itemName: 'Ball Bearing 6208',
      category: 'Component',
      currentStock: 145,
      minLevel: 100,
      maxLevel: 400,
      reorderPoint: 120,
      uom: 'Nos',
      location: 'Zone B - Bin B-01',
      leadTimeDays: 10,
      avgDailyUsage: 7,
      safetyStock: 30,
      lastReviewed: '2025-10-12',
      status: 'optimal'
    },
    {
      id: '7',
      itemCode: 'RM-034',
      itemName: 'Copper Wire 4mm',
      category: 'Raw Material',
      currentStock: 8,
      minLevel: 25,
      maxLevel: 200,
      reorderPoint: 30,
      uom: 'Kg',
      location: 'Zone A - Bin A-05',
      leadTimeDays: 6,
      avgDailyUsage: 2,
      safetyStock: 8,
      lastReviewed: '2025-09-15',
      status: 'critical'
    },
    {
      id: '8',
      itemCode: 'CS-056',
      itemName: 'Grinding Wheel 180mm',
      category: 'Consumable',
      currentStock: 56,
      minLevel: 40,
      maxLevel: 180,
      reorderPoint: 50,
      uom: 'Nos',
      location: 'Zone D - Bin D-03',
      leadTimeDays: 4,
      avgDailyUsage: 4,
      safetyStock: 12,
      lastReviewed: '2025-10-19',
      status: 'optimal'
    }
  ];

  const filteredSettings = minMaxSettings.filter(setting => {
    const matchesSearch = setting.itemCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         setting.itemName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || setting.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || setting.status === filterStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'optimal': return 'bg-green-100 text-green-700 border-green-200';
      case 'review-needed': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'critical': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStockHealthColor = (current: number, min: number, reorder: number) => {
    if (current < min) return 'text-red-600';
    if (current < reorder) return 'text-orange-600';
    return 'text-green-600';
  };

  const handleEdit = (setting: MinMaxSetting) => {
    setEditingId(setting.id);
    setEditValues({
      minLevel: setting.minLevel.toString(),
      maxLevel: setting.maxLevel.toString(),
      reorderPoint: setting.reorderPoint.toString()
    });
  };

  const handleSave = (id: string) => {
    alert(`Saved min-max settings for item ${id}`);
    setEditingId(null);
  };

  const handleCancel = () => {
    setEditingId(null);
  };

  const calculateSuggestedROP = (leadTime: number, avgUsage: number, safetyStock: number) => {
    return (leadTime * avgUsage) + safetyStock;
  };

  const calculateSuggestedMax = (rop: number, avgUsage: number) => {
    return Math.round(rop + (avgUsage * 30)); // 30 days coverage
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Min-Max Settings</h1>
            <p className="text-sm text-gray-500 mt-1">Configure minimum, maximum, and reorder point levels</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
            <Upload className="w-4 h-4" />
            <span>Import</span>
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
            <Calculator className="w-4 h-4" />
            <span>Auto-Calculate</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Optimal</p>
              <p className="text-3xl font-bold text-green-900 mt-1">
                {minMaxSettings.filter(s => s.status === 'optimal').length}
              </p>
              <p className="text-xs text-green-600 mt-1">Well-configured items</p>
            </div>
            <TrendingUp className="w-6 h-6 text-green-700" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-6 border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-600">Review Needed</p>
              <p className="text-3xl font-bold text-yellow-900 mt-1">
                {minMaxSettings.filter(s => s.status === 'review-needed').length}
              </p>
              <p className="text-xs text-yellow-600 mt-1">Requires attention</p>
            </div>
            <AlertCircle className="w-6 h-6 text-yellow-700" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6 border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-600">Critical</p>
              <p className="text-3xl font-bold text-red-900 mt-1">
                {minMaxSettings.filter(s => s.status === 'critical').length}
              </p>
              <p className="text-xs text-red-600 mt-1">Below minimum level</p>
            </div>
            <TrendingDown className="w-6 h-6 text-red-700" />
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
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Categories</option>
            <option value="Raw Material">Raw Material</option>
            <option value="Component">Component</option>
            <option value="Consumable">Consumable</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="optimal">Optimal</option>
            <option value="review-needed">Review Needed</option>
            <option value="critical">Critical</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Current</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Min Level</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Reorder Point</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Max Level</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Avg Usage</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Lead Time</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredSettings.map((setting) => (
                <tr key={setting.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="text-sm font-semibold text-gray-900">{setting.itemCode}</div>
                    <div className="text-xs text-gray-500">{setting.itemName}</div>
                    <div className="text-xs text-gray-400 mt-1">{setting.category}</div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className={`text-sm font-bold ${getStockHealthColor(setting.currentStock, setting.minLevel, setting.reorderPoint)}`}>
                      {setting.currentStock} {setting.uom}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {editingId === setting.id ? (
                      <input
                        type="number"
                        value={editValues.minLevel}
                        onChange={(e) => setEditValues({ ...editValues, minLevel: e.target.value })}
                        className="w-20 px-2 py-1 border border-blue-300 rounded text-sm text-right focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <div className="text-sm font-semibold text-gray-900">{setting.minLevel} {setting.uom}</div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {editingId === setting.id ? (
                      <div>
                        <input
                          type="number"
                          value={editValues.reorderPoint}
                          onChange={(e) => setEditValues({ ...editValues, reorderPoint: e.target.value })}
                          className="w-20 px-2 py-1 border border-blue-300 rounded text-sm text-right focus:ring-2 focus:ring-blue-500"
                        />
                        <div className="text-xs text-blue-600 mt-1">
                          Suggested: {calculateSuggestedROP(setting.leadTimeDays, setting.avgDailyUsage, setting.safetyStock)}
                        </div>
                      </div>
                    ) : (
                      <div className="text-sm font-bold text-orange-600">{setting.reorderPoint} {setting.uom}</div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {editingId === setting.id ? (
                      <div>
                        <input
                          type="number"
                          value={editValues.maxLevel}
                          onChange={(e) => setEditValues({ ...editValues, maxLevel: e.target.value })}
                          className="w-20 px-2 py-1 border border-blue-300 rounded text-sm text-right focus:ring-2 focus:ring-blue-500"
                        />
                        <div className="text-xs text-blue-600 mt-1">
                          Suggested: {calculateSuggestedMax(setting.reorderPoint, setting.avgDailyUsage)}
                        </div>
                      </div>
                    ) : (
                      <div className="text-sm font-semibold text-green-600">{setting.maxLevel} {setting.uom}</div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="text-sm text-gray-900">{setting.avgDailyUsage} {setting.uom}/day</div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="text-sm font-medium text-gray-900">{setting.leadTimeDays} days</div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(setting.status)}`}>
                      {setting.status.replace('-', ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {editingId === setting.id ? (
                      <div className="flex justify-center gap-1">
                        <button
                          onClick={() => handleSave(setting.id)}
                          className="p-1.5 bg-green-600 text-white rounded hover:bg-green-700"
                         
                        >
                          <Save className="w-4 h-4" />
                        </button>
                        <button
                          onClick={handleCancel}
                          className="p-1.5 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                         
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleEdit(setting)}
                        className="p-1.5 bg-blue-600 text-white rounded hover:bg-blue-700"
                       
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredSettings.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No items found matching your criteria</p>
          </div>
        )}
      </div>

      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
        <h3 className="text-sm font-semibold text-blue-900 mb-2">Min-Max Level Guidelines:</h3>
        <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
          <li><strong>Minimum Level:</strong> Absolute lowest acceptable stock level before emergency replenishment</li>
          <li><strong>Reorder Point (ROP):</strong> Stock level that triggers replenishment = (Lead Time × Avg Usage) + Safety Stock</li>
          <li><strong>Maximum Level:</strong> Target stock level after replenishment to optimize holding costs</li>
          <li><strong>Safety Stock:</strong> Buffer to account for demand variability and supply uncertainties</li>
          <li>Review settings regularly based on consumption patterns and business changes</li>
          <li>Use Auto-Calculate feature to generate suggested levels based on historical data</li>
        </ul>
      </div>
    </div>
  );
}

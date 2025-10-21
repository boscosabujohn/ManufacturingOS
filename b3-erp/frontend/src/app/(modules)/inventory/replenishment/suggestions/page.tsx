'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Search, TrendingUp, AlertTriangle, CheckCircle, XCircle, TrendingDown, Calendar, Plus } from 'lucide-react';

interface ReplenishmentSuggestion {
  id: string;
  itemCode: string;
  itemName: string;
  currentStock: number;
  minLevel: number;
  maxLevel: number;
  reorderPoint: number;
  suggestedQty: number;
  uom: string;
  location: string;
  supplier: string;
  leadTime: number;
  avgConsumption: number;
  daysToStockout: number;
  priority: 'critical' | 'high' | 'medium' | 'low';
  category: string;
  trend: 'increasing' | 'stable' | 'decreasing';
}

export default function ReplenishmentSuggestionsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState('all');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const suggestions: ReplenishmentSuggestion[] = [
    {
      id: '1',
      itemCode: 'RM-008',
      itemName: 'Steel Plate 5mm',
      currentStock: 45,
      minLevel: 100,
      maxLevel: 500,
      reorderPoint: 120,
      suggestedQty: 455,
      uom: 'Sheets',
      location: 'Zone A - Bin A-01',
      supplier: 'SteelCorp Industries',
      leadTime: 7,
      avgConsumption: 8,
      daysToStockout: 5,
      priority: 'critical',
      category: 'Raw Material',
      trend: 'increasing'
    },
    {
      id: '2',
      itemCode: 'RM-034',
      itemName: 'Copper Wire 4mm',
      currentStock: 8,
      minLevel: 25,
      maxLevel: 200,
      reorderPoint: 30,
      suggestedQty: 192,
      uom: 'Kg',
      location: 'Zone A - Bin A-05',
      supplier: 'WireTech Solutions',
      leadTime: 6,
      avgConsumption: 2,
      daysToStockout: 4,
      priority: 'critical',
      category: 'Raw Material',
      trend: 'stable'
    },
    {
      id: '3',
      itemCode: 'RM-089',
      itemName: 'Aluminum Rod 20mm',
      currentStock: 78,
      minLevel: 50,
      maxLevel: 300,
      reorderPoint: 75,
      suggestedQty: 222,
      uom: 'Pcs',
      location: 'Zone A - Bin A-04',
      supplier: 'MetalSource Ltd',
      leadTime: 5,
      avgConsumption: 12,
      daysToStockout: 6,
      priority: 'high',
      category: 'Raw Material',
      trend: 'increasing'
    },
    {
      id: '4',
      itemCode: 'CP-045',
      itemName: 'Hydraulic Cylinder',
      currentStock: 12,
      minLevel: 10,
      maxLevel: 50,
      reorderPoint: 15,
      suggestedQty: 38,
      uom: 'Nos',
      location: 'Zone B - Bin B-03',
      supplier: 'HydroTech Systems',
      leadTime: 14,
      avgConsumption: 1,
      daysToStockout: 12,
      priority: 'high',
      category: 'Component',
      trend: 'stable'
    },
    {
      id: '5',
      itemCode: 'CS-023',
      itemName: 'Cutting Oil Premium',
      currentStock: 35,
      minLevel: 30,
      maxLevel: 150,
      reorderPoint: 40,
      suggestedQty: 115,
      uom: 'Liters',
      location: 'Zone D - Bin D-02',
      supplier: 'ChemSupply Co',
      leadTime: 3,
      avgConsumption: 5,
      daysToStockout: 7,
      priority: 'medium',
      category: 'Consumable',
      trend: 'stable'
    },
    {
      id: '6',
      itemCode: 'RM-112',
      itemName: 'Brass Sheet 2mm',
      currentStock: 22,
      minLevel: 30,
      maxLevel: 150,
      reorderPoint: 35,
      suggestedQty: 128,
      uom: 'Sheets',
      location: 'Zone A - Bin A-02',
      supplier: 'MetalSource Ltd',
      leadTime: 8,
      avgConsumption: 3,
      daysToStockout: 7,
      priority: 'high',
      category: 'Raw Material',
      trend: 'decreasing'
    },
    {
      id: '7',
      itemCode: 'CP-078',
      itemName: 'Ball Bearing 6208',
      currentStock: 145,
      minLevel: 100,
      maxLevel: 400,
      reorderPoint: 120,
      suggestedQty: 255,
      uom: 'Nos',
      location: 'Zone B - Bin B-01',
      supplier: 'BearingTech Industries',
      leadTime: 10,
      avgConsumption: 7,
      daysToStockout: 20,
      priority: 'medium',
      category: 'Component',
      trend: 'stable'
    },
    {
      id: '8',
      itemCode: 'CS-056',
      itemName: 'Grinding Wheel 180mm',
      currentStock: 56,
      minLevel: 40,
      maxLevel: 180,
      reorderPoint: 50,
      suggestedQty: 124,
      uom: 'Nos',
      location: 'Zone D - Bin D-03',
      supplier: 'AbrasiveTech Co',
      leadTime: 4,
      avgConsumption: 4,
      daysToStockout: 14,
      priority: 'low',
      category: 'Consumable',
      trend: 'decreasing'
    }
  ];

  const filteredSuggestions = suggestions.filter(sug => {
    const matchesSearch = sug.itemCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         sug.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         sug.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = filterPriority === 'all' || sug.priority === filterPriority;
    return matchesSearch && matchesPriority;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-700 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing': return <TrendingUp className="w-3 h-3 text-red-600" />;
      case 'decreasing': return <TrendingDown className="w-3 h-3 text-green-600" />;
      case 'stable': return <span className="w-3 h-0.5 bg-blue-600 block" />;
      default: return null;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'increasing': return 'text-red-600';
      case 'decreasing': return 'text-green-600';
      case 'stable': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  const getStockHealthColor = (current: number, min: number, reorder: number) => {
    if (current < min) return 'text-red-600';
    if (current < reorder) return 'text-orange-600';
    return 'text-green-600';
  };

  const handleToggleSelect = (id: string) => {
    setSelectedItems(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedItems.length === filteredSuggestions.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredSuggestions.map(s => s.id));
    }
  };

  const handleCreateRequests = () => {
    if (selectedItems.length === 0) {
      alert('Please select at least one item to create replenishment requests');
      return;
    }
    alert(`Creating ${selectedItems.length} replenishment request(s)...`);
    router.push('/inventory/replenishment');
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Replenishment Suggestions</h1>
            <p className="text-sm text-gray-500 mt-1">AI-powered inventory replenishment recommendations</p>
          </div>
        </div>
        <button
          onClick={handleCreateRequests}
          disabled={selectedItems.length === 0}
          className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 ${
            selectedItems.length > 0
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          <Plus className="w-4 h-4" />
          Create {selectedItems.length > 0 ? `(${selectedItems.length})` : ''} Request
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6 border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-600">Critical</p>
              <p className="text-3xl font-bold text-red-900 mt-1">
                {suggestions.filter(s => s.priority === 'critical').length}
              </p>
              <p className="text-xs text-red-600 mt-1">&lt; 5 days to stockout</p>
            </div>
            <AlertTriangle className="w-6 h-6 text-red-700" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-600">High Priority</p>
              <p className="text-3xl font-bold text-orange-900 mt-1">
                {suggestions.filter(s => s.priority === 'high').length}
              </p>
              <p className="text-xs text-orange-600 mt-1">&lt; 10 days to stockout</p>
            </div>
            <TrendingUp className="w-6 h-6 text-orange-700" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-6 border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-600">Medium</p>
              <p className="text-3xl font-bold text-yellow-900 mt-1">
                {suggestions.filter(s => s.priority === 'medium').length}
              </p>
              <p className="text-xs text-yellow-600 mt-1">&lt; 15 days to stockout</p>
            </div>
            <Calendar className="w-6 h-6 text-yellow-700" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Total Items</p>
              <p className="text-3xl font-bold text-blue-900 mt-1">{suggestions.length}</p>
            </div>
            <CheckCircle className="w-6 h-6 text-blue-700" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by item code, name, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Priorities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-center">
                  <input
                    type="checkbox"
                    checked={selectedItems.length === filteredSuggestions.length && filteredSuggestions.length > 0}
                    onChange={handleSelectAll}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Current Stock</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Min/ROP/Max</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Suggested Qty</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Avg Usage</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Days to Stockout</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Trend</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Priority</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredSuggestions.map((sug) => (
                <tr key={sug.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-center">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(sug.id)}
                      onChange={() => handleToggleSelect(sug.id)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm font-semibold text-gray-900">{sug.itemCode}</div>
                    <div className="text-xs text-gray-500">{sug.itemName}</div>
                    <div className="text-xs text-gray-400 mt-1">{sug.category} " {sug.location}</div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className={`text-sm font-bold ${getStockHealthColor(sug.currentStock, sug.minLevel, sug.reorderPoint)}`}>
                      {sug.currentStock} {sug.uom}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="text-xs text-gray-600">
                      <div>Min: {sug.minLevel}</div>
                      <div className="text-orange-600 font-semibold">ROP: {sug.reorderPoint}</div>
                      <div>Max: {sug.maxLevel}</div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="text-sm font-bold text-blue-600">
                      {sug.suggestedQty} {sug.uom}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="text-sm font-semibold text-gray-900">
                      {sug.avgConsumption} {sug.uom}/day
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className={`text-sm font-bold ${
                      sug.daysToStockout < 5 ? 'text-red-600' :
                      sug.daysToStockout < 10 ? 'text-orange-600' :
                      'text-green-600'
                    }`}>
                      {sug.daysToStockout} days
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className={`flex items-center justify-center gap-1 ${getTrendColor(sug.trend)}`}>
                      {getTrendIcon(sug.trend)}
                      <span className="text-xs font-medium capitalize">{sug.trend}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(sug.priority)}`}>
                      {sug.priority}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredSuggestions.length === 0 && (
          <div className="text-center py-12">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
            <p className="text-gray-500">No replenishment suggestions at this time</p>
            <p className="text-sm text-gray-400 mt-1">All items are adequately stocked</p>
          </div>
        )}
      </div>

      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
        <h3 className="text-sm font-semibold text-blue-900 mb-2">How Suggestions Work:</h3>
        <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
          <li><strong>AI-Powered Analysis:</strong> System analyzes consumption patterns, lead times, and stock levels</li>
          <li><strong>Priority Levels:</strong> Based on days to stockout and consumption trends</li>
          <li><strong>Trend Indicators:</strong> Increasing (—), Stable (), or Decreasing (˜) consumption</li>
          <li><strong>Suggested Quantity:</strong> Calculated to bring stock to max level accounting for lead time usage</li>
          <li>Select multiple items and create bulk replenishment requests with one click</li>
        </ul>
      </div>
    </div>
  );
}

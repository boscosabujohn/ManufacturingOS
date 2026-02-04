'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Search, Package, AlertTriangle, TrendingUp, Clock, CheckCircle, XCircle, Plus, RefreshCw } from 'lucide-react';
import { inventoryService } from '@/services/InventoryService';

interface ReplenishmentRequest {
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
  leadTime: number;
  supplier: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  status: 'pending' | 'approved' | 'ordered' | 'completed' | 'rejected';
  requestDate: string;
  estimatedArrival: string;
}

export default function ReplenishmentPage() {
  const router = useRouter();
  const [replenishmentRequests, setReplenishmentRequests] = useState<ReplenishmentRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchSuggestions();
  }, []);

  const fetchSuggestions = async () => {
    try {
      setLoading(true);
      const suggestions = await inventoryService.getReorderSuggestions();
      const mappedRequests: ReplenishmentRequest[] = suggestions.map((s) => ({
        id: s.id,
        itemCode: s.itemCode,
        itemName: s.itemName,
        currentStock: s.currentStock,
        minLevel: 0, // Placeholder
        maxLevel: 0, // Placeholder
        reorderPoint: s.reorderPoint,
        suggestedQty: s.suggestedQuantity,
        uom: 'Unit', // Placeholder
        location: 'Warehouse', // Placeholder
        leadTime: s.leadTimeDays,
        supplier: s.vendorName || 'Unknown',
        priority: s.priority,
        status: s.status === 'suggested' ? 'pending' : s.status as any,
        requestDate: new Date(s.createdAt).toISOString().split('T')[0],
        estimatedArrival: s.expectedDeliveryDate,
      }));
      setReplenishmentRequests(mappedRequests);
    } catch (error) {
      console.error('Failed to fetch reorder suggestions:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredRequests = replenishmentRequests.filter(req => {
    const matchesSearch = req.itemCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.supplier.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = filterPriority === 'all' || req.priority === filterPriority;
    const matchesStatus = filterStatus === 'all' || req.status === filterStatus;
    return matchesSearch && matchesPriority && matchesStatus;
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'approved': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'ordered': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'completed': return 'bg-green-100 text-green-700 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-3 h-3" />;
      case 'rejected': return <XCircle className="w-3 h-3" />;
      case 'ordered': return <Package className="w-3 h-3" />;
      case 'pending': return <Clock className="w-3 h-3" />;
      default: return null;
    }
  };

  const getStockHealthColor = (current: number, min: number, reorder: number) => {
    if (current < min) return 'text-red-600';
    if (current < reorder) return 'text-orange-600';
    return 'text-green-600';
  };

  if (loading) {
    return <div className="p-8 text-center">Loading replenishment requests...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 px-3 py-2">
      <div className="mb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="flex items-center gap-2">
          <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Inventory Replenishment</h1>
            <p className="text-sm text-gray-500 mt-1">Manage stock replenishment requests and orders</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => router.push('/inventory/replenishment/suggestions')}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
          >
            <TrendingUp className="w-4 h-4" />
            <span>Suggestions</span>
          </button>
          <button
            onClick={() => router.push('/inventory/replenishment/create')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>New Request</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-2 mb-3">
        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-3 border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-600">Critical</p>
              <p className="text-3xl font-bold text-red-900 mt-1">
                {replenishmentRequests.filter(r => r.priority === 'critical').length}
              </p>
            </div>
            <AlertTriangle className="w-6 h-6 text-red-700" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-3 border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-600">Pending</p>
              <p className="text-3xl font-bold text-yellow-900 mt-1">
                {replenishmentRequests.filter(r => r.status === 'pending').length}
              </p>
            </div>
            <Clock className="w-6 h-6 text-yellow-700" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-3 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">Ordered</p>
              <p className="text-3xl font-bold text-purple-900 mt-1">
                {replenishmentRequests.filter(r => r.status === 'ordered').length}
              </p>
            </div>
            <Package className="w-6 h-6 text-purple-700" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-3 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Completed</p>
              <p className="text-3xl font-bold text-green-900 mt-1">
                {replenishmentRequests.filter(r => r.status === 'completed').length}
              </p>
            </div>
            <CheckCircle className="w-6 h-6 text-green-700" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-3 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Total</p>
              <p className="text-3xl font-bold text-blue-900 mt-1">{replenishmentRequests.length}</p>
            </div>
            <RefreshCw className="w-6 h-6 text-blue-700" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-3">
        <div className="md:col-span-2 bg-white rounded-xl border border-gray-200 p-3 flex items-center gap-3 cursor-pointer hover:bg-gray-50"
          onClick={() => router.push('/inventory/replenishment/min-max')}>
          <div className="bg-blue-100 p-3 rounded-lg">
            <TrendingUp className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Min-Max Settings</p>
            <p className="text-xs text-gray-500 mt-1">Configure reorder points and stock levels</p>
          </div>
        </div>

        <div className="md:col-span-2 bg-white rounded-xl border border-gray-200 p-3 flex items-center gap-3 cursor-pointer hover:bg-gray-50"
          onClick={() => router.push('/inventory/replenishment/auto')}>
          <div className="bg-purple-100 p-3 rounded-lg">
            <RefreshCw className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Auto Replenishment</p>
            <p className="text-xs text-gray-500 mt-1">Enable automated replenishment rules</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-3 mb-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <div className="relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by item, code, or supplier..."
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
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="ordered">Ordered</option>
            <option value="completed">Completed</option>
            <option value="rejected">Rejected</option>
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
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Min/Max</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Suggested Qty</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Supplier</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Lead Time</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Est. Arrival</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Priority</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredRequests.map((req) => (
                <tr key={req.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="text-sm font-semibold text-gray-900">{req.itemCode}</div>
                    <div className="text-xs text-gray-500">{req.itemName}</div>
                    <div className="text-xs text-gray-400 mt-1">{req.location}</div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className={`text-sm font-bold ${getStockHealthColor(req.currentStock, req.minLevel, req.reorderPoint)}`}>
                      {req.currentStock} {req.uom}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="text-xs text-gray-600">
                      <div>Min: {req.minLevel}</div>
                      <div>Max: {req.maxLevel}</div>
                      <div className="text-orange-600 font-semibold">ROP: {req.reorderPoint}</div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="text-sm font-bold text-blue-600">
                      {req.suggestedQty} {req.uom}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">{req.supplier}</td>
                  <td className="px-4 py-3 text-center">
                    <span className="text-sm font-medium text-gray-900">{req.leadTime} days</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{req.estimatedArrival}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(req.priority)}`}>
                      {req.priority}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(req.status)}`}>
                      {getStatusIcon(req.status)}
                      {req.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredRequests.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No replenishment requests found matching your criteria</p>
          </div>
        )}
      </div>

      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-3">
        <h3 className="text-sm font-semibold text-blue-900 mb-2">Replenishment Guidelines:</h3>
        <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
          <li><strong>Critical</strong> items require immediate action - stock below minimum level</li>
          <li><strong>Reorder Point (ROP)</strong> triggers replenishment when stock falls below this level</li>
          <li>Suggested quantity brings stock to maximum level accounting for lead time consumption</li>
          <li>Review and approve pending requests regularly to prevent stockouts</li>
          <li>Consider supplier lead times when planning replenishment schedules</li>
        </ul>
      </div>
    </div>
  );
}

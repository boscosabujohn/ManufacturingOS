'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Download, Plus, Filter, Calendar, Package, CheckCircle, Clock, AlertTriangle, Eye, ThumbsUp, ArrowRight } from 'lucide-react';
import {
  CreatePlannedOrderModal,
  ViewPlannedOrderModal,
  ApproveOrderModal,
  ConvertToPOModal,
  PlannedOrder as PlannedOrderType
} from '@/components/production/PlannedOrderModals';

interface PlannedOrder {
  id: string;
  plannedOrderNumber: string;
  materialCode: string;
  materialName: string;
  category: string;
  quantity: number;
  uom: string;
  plannedReleaseDate: string;
  plannedReceiptDate: string;
  leadTimeDays: number;
  supplier: string;
  estimatedCost: number;
  priority: 'urgent' | 'high' | 'medium' | 'low';
  orderType: 'purchase' | 'production' | 'transfer';
  status: 'pending-approval' | 'approved' | 'released' | 'converted';
  sourceRequirements: string[];
  notes: string;
}

export default function MRPPlannedOrdersPage() {
  const router = useRouter();
  const [filterOrderType, setFilterOrderType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Modal state hooks
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isApproveOpen, setIsApproveOpen] = useState(false);
  const [isConvertOpen, setIsConvertOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<PlannedOrder | null>(null);

  // Mock data for planned orders
  const plannedOrders: PlannedOrder[] = [
    {
      id: '1',
      plannedOrderNumber: 'PLO-2025-1001',
      materialCode: 'RM-SS304-001',
      materialName: 'Stainless Steel 304 Sheet (2mm)',
      category: 'Raw Material',
      quantity: 500,
      uom: 'kg',
      plannedReleaseDate: '2025-10-18',
      plannedReceiptDate: '2025-10-25',
      leadTimeDays: 7,
      supplier: 'Steel India Pvt Ltd',
      estimatedCost: 275000,
      priority: 'high',
      orderType: 'purchase',
      status: 'approved',
      sourceRequirements: ['WO-2025-1135', 'WO-2025-1142'],
      notes: 'Urgent order for kitchen sink production'
    },
    {
      id: '2',
      plannedOrderNumber: 'PLO-2025-1002',
      materialCode: 'RM-BRASS-002',
      materialName: 'Brass Rod (25mm diameter)',
      category: 'Raw Material',
      quantity: 500,
      uom: 'meter',
      plannedReleaseDate: '2025-10-13',
      plannedReceiptDate: '2025-10-23',
      leadTimeDays: 10,
      supplier: 'Metal Works Limited',
      estimatedCost: 185000,
      priority: 'urgent',
      orderType: 'purchase',
      status: 'pending-approval',
      sourceRequirements: ['WO-2025-1138'],
      notes: 'Critical shortage - expedite approval'
    },
    {
      id: '3',
      plannedOrderNumber: 'PLO-2025-1003',
      materialCode: 'CP-HANDLE-005',
      materialName: 'Chrome Plated Lever Handle',
      category: 'Component',
      quantity: 300,
      uom: 'pcs',
      plannedReleaseDate: '2025-10-19',
      plannedReceiptDate: '2025-10-27',
      leadTimeDays: 8,
      supplier: 'Internal Production',
      estimatedCost: 45000,
      priority: 'medium',
      orderType: 'production',
      status: 'released',
      sourceRequirements: ['WO-2025-1138', 'WO-2025-1140'],
      notes: 'Internal manufacturing order'
    },
    {
      id: '4',
      plannedOrderNumber: 'PLO-2025-1004',
      materialCode: 'RM-GRANITE-004',
      materialName: 'Granite Slab - Black Galaxy',
      category: 'Raw Material',
      quantity: 200,
      uom: 'sq.ft',
      plannedReleaseDate: '2025-10-14',
      plannedReceiptDate: '2025-10-26',
      leadTimeDays: 12,
      supplier: 'Indian Granite Suppliers',
      estimatedCost: 168000,
      priority: 'high',
      orderType: 'purchase',
      status: 'approved',
      sourceRequirements: ['WO-2025-1145'],
      notes: 'Premium quality granite for countertops'
    },
    {
      id: '5',
      plannedOrderNumber: 'PLO-2025-1005',
      materialCode: 'CP-GASKET-007',
      materialName: 'Silicone Gasket (Food Grade)',
      category: 'Component',
      quantity: 600,
      uom: 'pcs',
      plannedReleaseDate: '2025-10-19',
      plannedReceiptDate: '2025-10-24',
      leadTimeDays: 5,
      supplier: 'Silicone Tech India',
      estimatedCost: 36000,
      priority: 'urgent',
      orderType: 'purchase',
      status: 'released',
      sourceRequirements: ['WO-2025-1135', 'WO-2025-1142'],
      notes: 'Food-grade certification required'
    },
    {
      id: '6',
      plannedOrderNumber: 'PLO-2025-1006',
      materialCode: 'RM-WOOD-008',
      materialName: 'Hardwood Plywood (18mm)',
      category: 'Raw Material',
      quantity: 50,
      uom: 'sheet',
      plannedReleaseDate: '2025-10-19',
      plannedReceiptDate: '2025-10-30',
      leadTimeDays: 11,
      supplier: 'Premium Wood Industries',
      estimatedCost: 67500,
      priority: 'low',
      orderType: 'purchase',
      status: 'pending-approval',
      sourceRequirements: ['WO-2025-1150'],
      notes: 'For cabinet manufacturing'
    },
    {
      id: '7',
      plannedOrderNumber: 'PLO-2025-1007',
      materialCode: 'CP-MOTOR-009',
      materialName: 'Electric Motor (250W) - Kitchen Appliance',
      category: 'Component',
      quantity: 200,
      uom: 'pcs',
      plannedReleaseDate: '2025-10-04',
      plannedReceiptDate: '2025-10-22',
      leadTimeDays: 18,
      supplier: 'Electric Motors Pvt Ltd',
      estimatedCost: 320000,
      priority: 'urgent',
      orderType: 'purchase',
      status: 'converted',
      sourceRequirements: ['WO-2025-1143'],
      notes: 'Converted to PO-2025-5432'
    },
    {
      id: '8',
      plannedOrderNumber: 'PLO-2025-1008',
      materialCode: 'RM-CERAMIC-010',
      materialName: 'Ceramic Coating Material',
      category: 'Raw Material',
      quantity: 100,
      uom: 'liter',
      plannedReleaseDate: '2025-10-22',
      plannedReceiptDate: '2025-10-28',
      leadTimeDays: 6,
      supplier: 'Ceramic Coatings India',
      estimatedCost: 48000,
      priority: 'medium',
      orderType: 'purchase',
      status: 'approved',
      sourceRequirements: ['WO-2025-1146', 'WO-2025-1148'],
      notes: 'Non-stick coating for cookware'
    },
    {
      id: '9',
      plannedOrderNumber: 'PLO-2025-1009',
      materialCode: 'RM-SS304-001',
      materialName: 'Stainless Steel 304 Sheet (2mm)',
      category: 'Raw Material',
      quantity: 300,
      uom: 'kg',
      plannedReleaseDate: '2025-10-25',
      plannedReceiptDate: '2025-11-01',
      leadTimeDays: 7,
      supplier: 'Warehouse Transfer',
      estimatedCost: 0,
      priority: 'low',
      orderType: 'transfer',
      status: 'pending-approval',
      sourceRequirements: ['WO-2025-1151'],
      notes: 'Transfer from Mumbai warehouse'
    },
    {
      id: '10',
      plannedOrderNumber: 'PLO-2025-1010',
      materialCode: 'CP-VALVE-003',
      materialName: 'Ceramic Disc Valve Cartridge',
      category: 'Component',
      quantity: 400,
      uom: 'pcs',
      plannedReleaseDate: '2025-10-20',
      plannedReceiptDate: '2025-11-03',
      leadTimeDays: 14,
      supplier: 'Internal Production',
      estimatedCost: 68000,
      priority: 'medium',
      orderType: 'production',
      status: 'approved',
      sourceRequirements: ['WO-2025-1152', 'WO-2025-1153'],
      notes: 'In-house valve assembly'
    }
  ];

  const filteredOrders = plannedOrders.filter(order => {
    const typeMatch = filterOrderType === 'all' || order.orderType === filterOrderType;
    const statusMatch = filterStatus === 'all' || order.status === filterStatus;
    return typeMatch && statusMatch;
  });

  const totalOrders = plannedOrders.length;
  const totalValue = plannedOrders.reduce((sum, order) => sum + order.estimatedCost, 0);
  const urgentOrders = plannedOrders.filter(order => order.priority === 'urgent').length;
  const pendingApproval = plannedOrders.filter(order => order.status === 'pending-approval').length;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-700 bg-red-100';
      case 'high': return 'text-orange-700 bg-orange-100';
      case 'medium': return 'text-yellow-700 bg-yellow-100';
      case 'low': return 'text-green-700 bg-green-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending-approval': return 'text-yellow-700 bg-yellow-100';
      case 'approved': return 'text-blue-700 bg-blue-100';
      case 'released': return 'text-green-700 bg-green-100';
      case 'converted': return 'text-gray-700 bg-gray-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending-approval': return <Clock className="w-4 h-4" />;
      case 'approved': return <CheckCircle className="w-4 h-4" />;
      case 'released': return <Package className="w-4 h-4" />;
      case 'converted': return <CheckCircle className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  const getOrderTypeColor = (type: string) => {
    switch (type) {
      case 'purchase': return 'text-blue-700 bg-blue-50';
      case 'production': return 'text-purple-700 bg-purple-50';
      case 'transfer': return 'text-green-700 bg-green-50';
      default: return 'text-gray-700 bg-gray-50';
    }
  };

  // Handler functions for modals
  const handleCreate = () => {
    setIsCreateOpen(true);
  };

  const handleView = (order: PlannedOrder) => {
    setSelectedOrder(order);
    setIsViewOpen(true);
  };

  const handleApprove = (order: PlannedOrder) => {
    setSelectedOrder(order);
    setIsApproveOpen(true);
  };

  const handleConvert = (order: PlannedOrder) => {
    setSelectedOrder(order);
    setIsConvertOpen(true);
  };

  const handleCreateSubmit = (data: any) => {
    // TODO: Implement API call to create planned order
    console.log('Creating planned order:', data);
    setIsCreateOpen(false);
  };

  const handleApproveSubmit = (data: any) => {
    // TODO: Implement API call to approve order
    console.log('Approving order:', selectedOrder?.plannedOrderNumber, data);
    setIsApproveOpen(false);
    setSelectedOrder(null);
  };

  const handleConvertSubmit = (data: any) => {
    // TODO: Implement API call to convert order to PO
    console.log('Converting order to PO:', selectedOrder?.plannedOrderNumber, data);
    setIsConvertOpen(false);
    setSelectedOrder(null);
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
            <h1 className="text-2xl font-bold text-gray-900">Planned Orders</h1>
            <p className="text-sm text-gray-500 mt-1">MRP - Generated purchase and production orders</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleCreate} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
            <Plus className="w-4 h-4" />
            <span>Create Order</span>
          </button>
          <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Total Planned Orders</p>
              <p className="text-2xl font-bold text-blue-900 mt-1">{totalOrders}</p>
            </div>
            <div className="p-3 bg-blue-200 rounded-lg">
              <Package className="w-6 h-6 text-blue-700" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Total Estimated Value</p>
              <p className="text-2xl font-bold text-green-900 mt-1">₹{(totalValue / 100000).toFixed(1)}L</p>
            </div>
            <div className="p-3 bg-green-200 rounded-lg">
              <Calendar className="w-6 h-6 text-green-700" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6 border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-600">Urgent Orders</p>
              <p className="text-2xl font-bold text-red-900 mt-1">{urgentOrders}</p>
            </div>
            <div className="p-3 bg-red-200 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-700" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-6 border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-600">Pending Approval</p>
              <p className="text-2xl font-bold text-yellow-900 mt-1">{pendingApproval}</p>
            </div>
            <div className="p-3 bg-yellow-200 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-700" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
        <div className="flex items-center gap-4">
          <Filter className="w-5 h-5 text-gray-400" />
          <select
            value={filterOrderType}
            onChange={(e) => setFilterOrderType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Order Types</option>
            <option value="purchase">Purchase</option>
            <option value="production">Production</option>
            <option value="transfer">Transfer</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="pending-approval">Pending Approval</option>
            <option value="approved">Approved</option>
            <option value="released">Released</option>
            <option value="converted">Converted</option>
          </select>
        </div>
      </div>

      {/* Planned Orders Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Material</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Release Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Receipt Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supplier</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Est. Cost</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => handleView(order)}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-blue-600">{order.plannedOrderNumber}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{order.materialCode}</div>
                      <div className="text-sm text-gray-500">{order.materialName}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getOrderTypeColor(order.orderType)}`}>
                      {order.orderType}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <span className="text-sm font-medium text-gray-900">{order.quantity.toLocaleString()}</span>
                    <span className="text-xs text-gray-500 ml-1">{order.uom}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1 text-sm text-gray-700">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      {order.plannedReleaseDate}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1 text-sm text-gray-700">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      {order.plannedReceiptDate}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-700">{order.supplier}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <span className="text-sm font-medium text-gray-900">
                      {order.estimatedCost > 0 ? `₹${order.estimatedCost.toLocaleString()}` : '-'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(order.priority)}`}>
                      {order.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleView(order)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {order.status === 'pending-approval' && (
                        <button
                          onClick={() => handleApprove(order)}
                          className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Approve Order"
                        >
                          <ThumbsUp className="w-4 h-4" />
                        </button>
                      )}
                      {(order.status === 'approved' || order.status === 'released') && (
                        <button
                          onClick={() => handleConvert(order)}
                          className="p-1.5 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                          title="Convert to PO"
                        >
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Components */}
      <CreatePlannedOrderModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreate={handleCreateSubmit}
      />

      <ViewPlannedOrderModal
        isOpen={isViewOpen}
        onClose={() => {
          setIsViewOpen(false);
          setSelectedOrder(null);
        }}
        order={selectedOrder}
      />

      <ApproveOrderModal
        isOpen={isApproveOpen}
        onClose={() => {
          setIsApproveOpen(false);
          setSelectedOrder(null);
        }}
        order={selectedOrder}
        onApprove={handleApproveSubmit}
      />

      <ConvertToPOModal
        isOpen={isConvertOpen}
        onClose={() => {
          setIsConvertOpen(false);
          setSelectedOrder(null);
        }}
        order={selectedOrder}
        onConvert={handleConvertSubmit}
      />
    </div>
  );
}

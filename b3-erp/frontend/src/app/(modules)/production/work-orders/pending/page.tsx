'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Search,
  Clock,
  AlertTriangle,
  Calendar,
  Package,
  User,
  CheckCircle2,
  Play,
  XCircle,
  Eye,
  FileText,
  TrendingUp
} from 'lucide-react';

interface PendingWorkOrder {
  id: string;
  workOrderNumber: string;
  productCode: string;
  productName: string;
  category: string;
  quantity: number;
  unit: string;
  priority: 'urgent' | 'high' | 'medium' | 'low';
  salesOrderNumber: string;
  customerName: string;
  requiredDate: string;
  daysUntilDue: number;
  materialAvailability: number;
  laborAvailable: boolean;
  equipmentReady: boolean;
  estimatedDuration: number;
  estimatedCost: number;
  createdDate: string;
  createdBy: string;
  blockers: string[];
  status: 'awaiting-materials' | 'awaiting-approval' | 'ready-to-start' | 'on-hold';
}

export default function PendingWorkOrdersPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const pendingOrders: PendingWorkOrder[] = [
    {
      id: '1',
      workOrderNumber: 'WO-2025-1142',
      productCode: 'KIT-SINK-001',
      productName: 'Premium SS304 Kitchen Sink - Double Bowl',
      category: 'Kitchen Sinks',
      quantity: 25,
      unit: 'PC',
      priority: 'urgent',
      salesOrderNumber: 'SO-2025-0856',
      customerName: 'Metro Builders Pvt Ltd',
      requiredDate: '2025-10-25',
      daysUntilDue: 5,
      materialAvailability: 95,
      laborAvailable: true,
      equipmentReady: true,
      estimatedDuration: 8,
      estimatedCost: 281250,
      createdDate: '2025-10-18',
      createdBy: 'Production Manager',
      blockers: ['Waiting for final quality check on raw material batch'],
      status: 'awaiting-materials'
    },
    {
      id: '2',
      workOrderNumber: 'WO-2025-1143',
      productCode: 'KIT-APPL-001',
      productName: 'Auto-Clean Kitchen Chimney - 90cm',
      category: 'Kitchen Appliances',
      quantity: 15,
      unit: 'PC',
      priority: 'high',
      salesOrderNumber: 'SO-2025-0862',
      customerName: 'Luxury Homes Ltd',
      requiredDate: '2025-10-28',
      daysUntilDue: 8,
      materialAvailability: 100,
      laborAvailable: true,
      equipmentReady: true,
      estimatedDuration: 12,
      estimatedCost: 552750,
      createdDate: '2025-10-19',
      createdBy: 'Production Manager',
      blockers: [],
      status: 'ready-to-start'
    },
    {
      id: '3',
      workOrderNumber: 'WO-2025-1144',
      productCode: 'KIT-CAB-001',
      productName: 'Modular Base Cabinet - 3 Drawer',
      category: 'Kitchen Cabinets',
      quantity: 40,
      unit: 'PC',
      priority: 'high',
      salesOrderNumber: 'SO-2025-0858',
      customerName: 'Skyline Apartments',
      requiredDate: '2025-11-02',
      daysUntilDue: 13,
      materialAvailability: 65,
      laborAvailable: true,
      equipmentReady: false,
      estimatedDuration: 18,
      estimatedCost: 860000,
      createdDate: '2025-10-17',
      createdBy: 'Production Manager',
      blockers: ['CNC Machine under maintenance', 'Plywood shipment delayed - ETA Oct 23'],
      status: 'awaiting-materials'
    },
    {
      id: '4',
      workOrderNumber: 'WO-2025-1145',
      productCode: 'KIT-FAUC-001',
      productName: 'Chrome Finish Kitchen Faucet - Single Lever',
      category: 'Kitchen Faucets',
      quantity: 60,
      unit: 'PC',
      priority: 'medium',
      salesOrderNumber: 'SO-2025-0864',
      customerName: 'Home Essentials Store',
      requiredDate: '2025-11-05',
      daysUntilDue: 16,
      materialAvailability: 100,
      laborAvailable: true,
      equipmentReady: true,
      estimatedDuration: 10,
      estimatedCost: 271200,
      createdDate: '2025-10-19',
      createdBy: 'Production Manager',
      blockers: [],
      status: 'ready-to-start'
    },
    {
      id: '5',
      workOrderNumber: 'WO-2025-1146',
      productCode: 'KIT-COOK-001',
      productName: 'Professional Cookware Set - 7 Piece',
      category: 'Cookware',
      quantity: 50,
      unit: 'SET',
      priority: 'medium',
      salesOrderNumber: 'SO-2025-0867',
      customerName: 'Kitchen World Retail',
      requiredDate: '2025-11-08',
      daysUntilDue: 19,
      materialAvailability: 88,
      laborAvailable: true,
      equipmentReady: true,
      estimatedDuration: 14,
      estimatedCost: 444000,
      createdDate: '2025-10-18',
      createdBy: 'Production Manager',
      blockers: ['Non-stick coating supplier delay - ETA Oct 24'],
      status: 'awaiting-materials'
    },
    {
      id: '6',
      workOrderNumber: 'WO-2025-1147',
      productCode: 'KIT-SINK-003',
      productName: 'Undermount SS Sink - Single Bowl Large',
      category: 'Kitchen Sinks',
      quantity: 30,
      unit: 'PC',
      priority: 'urgent',
      salesOrderNumber: 'SO-2025-0869',
      customerName: 'Premium Interiors',
      requiredDate: '2025-10-26',
      daysUntilDue: 6,
      materialAvailability: 100,
      laborAvailable: false,
      equipmentReady: true,
      estimatedDuration: 9,
      estimatedCost: 370500,
      createdDate: '2025-10-19',
      createdBy: 'Production Manager',
      blockers: ['Skilled welders on leave - return Oct 22'],
      status: 'on-hold'
    },
    {
      id: '7',
      workOrderNumber: 'WO-2025-1148',
      productCode: 'KIT-COUNT-001',
      productName: 'Granite Countertop - Premium Black Galaxy',
      category: 'Countertops',
      quantity: 12,
      unit: 'PC',
      priority: 'high',
      salesOrderNumber: 'SO-2025-0871',
      customerName: 'Elite Villa Projects',
      requiredDate: '2025-11-01',
      daysUntilDue: 12,
      materialAvailability: 75,
      laborAvailable: true,
      equipmentReady: true,
      estimatedDuration: 15,
      estimatedCost: 297600,
      createdDate: '2025-10-16',
      createdBy: 'Production Manager',
      blockers: ['Granite slab quality inspection pending'],
      status: 'awaiting-approval'
    },
    {
      id: '8',
      workOrderNumber: 'WO-2025-1149',
      productCode: 'KIT-ACC-001',
      productName: 'Modular Kitchen Organizer Set - Premium',
      category: 'Kitchen Accessories',
      quantity: 80,
      unit: 'SET',
      priority: 'low',
      salesOrderNumber: 'SO-2025-0873',
      customerName: 'Urban Living Store',
      requiredDate: '2025-11-12',
      daysUntilDue: 23,
      materialAvailability: 100,
      laborAvailable: true,
      equipmentReady: true,
      estimatedDuration: 6,
      estimatedCost: 394400,
      createdDate: '2025-10-17',
      createdBy: 'Production Manager',
      blockers: [],
      status: 'ready-to-start'
    },
    {
      id: '9',
      workOrderNumber: 'WO-2025-1150',
      productCode: 'KIT-APPL-002',
      productName: 'Built-in Microwave Oven - 30L',
      category: 'Kitchen Appliances',
      quantity: 20,
      unit: 'PC',
      priority: 'medium',
      salesOrderNumber: 'SO-2025-0875',
      customerName: 'Smart Homes Ltd',
      requiredDate: '2025-11-06',
      daysUntilDue: 17,
      materialAvailability: 92,
      laborAvailable: true,
      equipmentReady: true,
      estimatedDuration: 11,
      estimatedCost: 492000,
      createdDate: '2025-10-18',
      createdBy: 'Production Manager',
      blockers: ['Electronic components customs clearance in progress'],
      status: 'awaiting-materials'
    },
    {
      id: '10',
      workOrderNumber: 'WO-2025-1151',
      productCode: 'KIT-SINK-002',
      productName: 'Granite Composite Sink - Single Bowl',
      category: 'Kitchen Sinks',
      quantity: 18,
      unit: 'PC',
      priority: 'high',
      salesOrderNumber: 'SO-2025-0877',
      customerName: 'Designer Kitchens Co',
      requiredDate: '2025-10-30',
      daysUntilDue: 10,
      materialAvailability: 100,
      laborAvailable: true,
      equipmentReady: true,
      estimatedDuration: 10,
      estimatedCost: 284400,
      createdDate: '2025-10-19',
      createdBy: 'Production Manager',
      blockers: [],
      status: 'ready-to-start'
    }
  ];

  const priorities = ['all', 'urgent', 'high', 'medium', 'low'];
  const statuses = ['all', 'ready-to-start', 'awaiting-materials', 'awaiting-approval', 'on-hold'];

  const filteredOrders = pendingOrders.filter(order => {
    const matchesSearch =
      order.workOrderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.salesOrderNumber.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesPriority = filterPriority === 'all' || order.priority === filterPriority;
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;

    return matchesSearch && matchesPriority && matchesStatus;
  });

  const getPriorityBadge = (priority: string) => {
    const badges = {
      urgent: { color: 'bg-red-100 text-red-800 border-red-300', icon: AlertTriangle },
      high: { color: 'bg-orange-100 text-orange-800 border-orange-300', icon: TrendingUp },
      medium: { color: 'bg-blue-100 text-blue-800 border-blue-300', icon: Clock },
      low: { color: 'bg-gray-100 text-gray-800 border-gray-300', icon: Clock }
    };
    return badges[priority as keyof typeof badges] || badges.medium;
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      'ready-to-start': { color: 'bg-green-100 text-green-800', icon: CheckCircle2, label: 'Ready to Start' },
      'awaiting-materials': { color: 'bg-yellow-100 text-yellow-800', icon: Package, label: 'Awaiting Materials' },
      'awaiting-approval': { color: 'bg-purple-100 text-purple-800', icon: FileText, label: 'Awaiting Approval' },
      'on-hold': { color: 'bg-red-100 text-red-800', icon: XCircle, label: 'On Hold' }
    };
    return badges[status as keyof typeof badges] || badges['awaiting-materials'];
  };

  // Summary stats
  const totalPending = pendingOrders.length;
  const readyToStart = pendingOrders.filter(o => o.status === 'ready-to-start').length;
  const urgentOrders = pendingOrders.filter(o => o.priority === 'urgent').length;
  const totalValue = pendingOrders.reduce((sum, o) => sum + o.estimatedCost, 0);

  const handleViewDetails = (workOrderId: string) => {
    router.push(`/production/work-orders/view/${workOrderId}`);
  };

  const handleStartProduction = (order: PendingWorkOrder) => {
    if (confirm(`Start production for Work Order ${order.workOrderNumber}?\n\nProduct: ${order.productName}\nQuantity: ${order.quantity} ${order.unit}\nEstimated Duration: ${order.estimatedDuration} days`)) {
      console.log('Starting production for:', order);
      alert(`Production started for ${order.workOrderNumber}!\n\nWork order has been moved to "In Progress" status.\nYou can track progress in the In Progress section.`);
      router.push('/production/work-orders/progress');
    }
  };

  return (
    <div className="w-full px-3 py-2">
      {/* Inline Header */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back</span>
          </button>
          <div className="h-6 w-px bg-gray-300" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Pending Work Orders</h1>
            <p className="text-sm text-gray-600">Work orders awaiting production start</p>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-3">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-blue-900">Total Pending</span>
            <Clock className="h-5 w-5 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-blue-900">{totalPending}</div>
          <div className="text-xs text-blue-700 mt-1">Work orders</div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-green-900">Ready to Start</span>
            <CheckCircle2 className="h-5 w-5 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-green-900">{readyToStart}</div>
          <div className="text-xs text-green-700 mt-1">Can begin now</div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-red-900">Urgent Orders</span>
            <AlertTriangle className="h-5 w-5 text-red-600" />
          </div>
          <div className="text-2xl font-bold text-red-900">{urgentOrders}</div>
          <div className="text-xs text-red-700 mt-1">Need immediate attention</div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-purple-900">Total Value</span>
            <Package className="h-5 w-5 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-purple-900">₹{(totalValue / 100000).toFixed(1)}L</div>
          <div className="text-xs text-purple-700 mt-1">Pending production</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 mb-3">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search work orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {priorities.map(pri => (
              <option key={pri} value={pri}>
                {pri === 'all' ? 'All Priorities' : pri.charAt(0).toUpperCase() + pri.slice(1)}
              </option>
            ))}
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {statuses.map(status => (
              <option key={status} value={status}>
                {status === 'all' ? 'All Status' : status.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Work Orders List */}
      <div className="space-y-2">
        {filteredOrders.map((order) => {
          const priorityInfo = getPriorityBadge(order.priority);
          const statusInfo = getStatusBadge(order.status);
          const PriorityIcon = priorityInfo.icon;
          const StatusIcon = statusInfo.icon;
          const isOverdue = order.daysUntilDue < 0;
          const isDueSoon = order.daysUntilDue >= 0 && order.daysUntilDue <= 7;

          return (
            <div key={order.id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="p-5">
                {/* Header */}
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{order.workOrderNumber}</h3>
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${priorityInfo.color}`}>
                        <PriorityIcon className="h-3 w-3" />
                        {order.priority.toUpperCase()}
                      </span>
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}>
                        <StatusIcon className="h-3 w-3" />
                        {statusInfo.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {order.customerName}
                      </span>
                      <span>SO: {order.salesOrderNumber}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-medium ${
                      isOverdue ? 'text-red-600' : isDueSoon ? 'text-orange-600' : 'text-gray-900'
                    }`}>
                      {isOverdue ? `${Math.abs(order.daysUntilDue)} days overdue` : `${order.daysUntilDue} days until due`}
                    </div>
                    <div className="text-xs text-gray-500 flex items-center gap-1 justify-end mt-1">
                      <Calendar className="h-3 w-3" />
                      Due: {order.requiredDate}
                    </div>
                  </div>
                </div>

                {/* Product Info */}
                <div className="bg-blue-50 rounded-lg p-3 mb-2">
                  <div className="flex items-start gap-3">
                    <Package className="h-5 w-5 text-blue-600 mt-1" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{order.productName}</h4>
                      <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                        <span>{order.productCode}</span>
                        <span>•</span>
                        <span className="font-medium">Qty: {order.quantity} {order.unit}</span>
                        <span>•</span>
                        <span>{order.category}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-600">Est. Cost</div>
                      <div className="text-lg font-bold text-blue-900">₹{order.estimatedCost.toLocaleString()}</div>
                    </div>
                  </div>
                </div>

                {/* Readiness Indicators */}
                <div className="grid grid-cols-4 gap-3 mb-2">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-xs text-gray-600 mb-1">Materials</div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${order.materialAvailability === 100 ? 'bg-green-600' : order.materialAvailability >= 75 ? 'bg-blue-600' : 'bg-orange-600'}`}
                          style={{ width: `${order.materialAvailability}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-medium">{order.materialAvailability}%</span>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-xs text-gray-600 mb-1">Labor</div>
                    <div className={`text-sm font-medium ${order.laborAvailable ? 'text-green-900' : 'text-red-900'}`}>
                      {order.laborAvailable ? '✓ Available' : '✗ Not Available'}
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-xs text-gray-600 mb-1">Equipment</div>
                    <div className={`text-sm font-medium ${order.equipmentReady ? 'text-green-900' : 'text-red-900'}`}>
                      {order.equipmentReady ? '✓ Ready' : '✗ Not Ready'}
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-xs text-gray-600 mb-1">Duration</div>
                    <div className="text-sm font-medium text-gray-900">{order.estimatedDuration} days</div>
                  </div>
                </div>

                {/* Blockers */}
                {order.blockers.length > 0 && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-2">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5" />
                      <div className="flex-1">
                        <div className="text-xs font-medium text-red-900 mb-1">Blockers ({order.blockers.length})</div>
                        <ul className="space-y-1">
                          {order.blockers.map((blocker, idx) => (
                            <li key={idx} className="text-xs text-red-700">• {blocker}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="text-xs text-gray-500">
                    Created {order.createdDate} by {order.createdBy}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleViewDetails(order.id)}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm flex items-center gap-2"
                    >
                      <Eye className="h-4 w-4" />
                      View Details
                    </button>
                    {order.status === 'ready-to-start' && (
                      <button
                        onClick={() => handleStartProduction(order)}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm flex items-center gap-2"
                      >
                        <Play className="h-4 w-4" />
                        Start Production
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="mt-6 text-sm text-gray-600">
        Showing {filteredOrders.length} of {totalPending} pending work orders
      </div>
    </div>
  );
}

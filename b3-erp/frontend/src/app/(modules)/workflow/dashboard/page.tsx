'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Activity,
  Package,
  Truck,
  CheckCircle,
  Clock,
  AlertTriangle,
  TrendingUp,
  Factory,
  ClipboardCheck,
  DollarSign,
  RefreshCw,
  Search,
  Filter,
  ArrowRight,
  Eye,
  Bell,
} from 'lucide-react';

// Order status types matching backend
type OrderTrackingStatus =
  | 'order_placed'
  | 'order_confirmed'
  | 'production_planning'
  | 'material_procurement'
  | 'in_production'
  | 'quality_check'
  | 'ready_for_dispatch'
  | 'dispatched'
  | 'in_transit'
  | 'delivered'
  | 'completed'
  | 'cancelled'
  | 'on_hold';

interface OrderTracking {
  id: string;
  orderId: string;
  orderNumber: string;
  customerName: string;
  status: OrderTrackingStatus;
  totalAmount: number;
  itemCount: number;
  expectedDeliveryDate: string;
  progress: number;
  events: Array<{
    status: string;
    timestamp: string;
    description: string;
  }>;
  workOrders: Array<{
    workOrderNumber: string;
    itemName: string;
    quantity: number;
    status: string;
  }>;
}

interface WorkflowMetrics {
  totalOrders: number;
  inProduction: number;
  pendingQC: number;
  readyToShip: number;
  overdue: number;
  completedToday: number;
}

// Mock data for demonstration
const mockOrders: OrderTracking[] = [
  {
    id: '1',
    orderId: 'ord-001',
    orderNumber: 'SO-2024-001',
    customerName: 'ABC Manufacturing Ltd',
    status: 'in_production',
    totalAmount: 125000,
    itemCount: 5,
    expectedDeliveryDate: '2024-12-15',
    progress: 45,
    events: [
      { status: 'order_placed', timestamp: '2024-11-15T10:00:00', description: 'Order placed' },
      { status: 'order_confirmed', timestamp: '2024-11-15T14:30:00', description: 'Order confirmed' },
      { status: 'production_planning', timestamp: '2024-11-16T09:00:00', description: 'Production planning started' },
      { status: 'in_production', timestamp: '2024-11-18T08:00:00', description: 'Production started' },
    ],
    workOrders: [
      { workOrderNumber: 'WO-001', itemName: 'Kitchen Cabinet A', quantity: 10, status: 'in_progress' },
      { workOrderNumber: 'WO-002', itemName: 'Kitchen Cabinet B', quantity: 5, status: 'pending' },
    ],
  },
  {
    id: '2',
    orderId: 'ord-002',
    orderNumber: 'SO-2024-002',
    customerName: 'XYZ Interiors',
    status: 'quality_check',
    totalAmount: 85000,
    itemCount: 3,
    expectedDeliveryDate: '2024-12-10',
    progress: 65,
    events: [
      { status: 'order_placed', timestamp: '2024-11-10T10:00:00', description: 'Order placed' },
      { status: 'in_production', timestamp: '2024-11-12T08:00:00', description: 'Production started' },
      { status: 'quality_check', timestamp: '2024-11-19T14:00:00', description: 'Quality check in progress' },
    ],
    workOrders: [
      { workOrderNumber: 'WO-003', itemName: 'Modular Kitchen Set', quantity: 3, status: 'completed' },
    ],
  },
  {
    id: '3',
    orderId: 'ord-003',
    orderNumber: 'SO-2024-003',
    customerName: 'Home Solutions Inc',
    status: 'ready_for_dispatch',
    totalAmount: 200000,
    itemCount: 8,
    expectedDeliveryDate: '2024-12-05',
    progress: 85,
    events: [
      { status: 'order_placed', timestamp: '2024-11-05T10:00:00', description: 'Order placed' },
      { status: 'ready_for_dispatch', timestamp: '2024-11-20T10:00:00', description: 'Ready for dispatch' },
    ],
    workOrders: [
      { workOrderNumber: 'WO-004', itemName: 'Premium Cabinet Set', quantity: 8, status: 'completed' },
    ],
  },
  {
    id: '4',
    orderId: 'ord-004',
    orderNumber: 'SO-2024-004',
    customerName: 'Elite Kitchens',
    status: 'dispatched',
    totalAmount: 150000,
    itemCount: 6,
    expectedDeliveryDate: '2024-12-08',
    progress: 90,
    events: [
      { status: 'dispatched', timestamp: '2024-11-19T16:00:00', description: 'Order dispatched' },
    ],
    workOrders: [
      { workOrderNumber: 'WO-005', itemName: 'Custom Kitchen', quantity: 6, status: 'completed' },
    ],
  },
  {
    id: '5',
    orderId: 'ord-005',
    orderNumber: 'SO-2024-005',
    customerName: 'Modern Living',
    status: 'order_confirmed',
    totalAmount: 95000,
    itemCount: 4,
    expectedDeliveryDate: '2024-12-20',
    progress: 15,
    events: [
      { status: 'order_placed', timestamp: '2024-11-20T09:00:00', description: 'Order placed' },
      { status: 'order_confirmed', timestamp: '2024-11-20T11:00:00', description: 'Order confirmed' },
    ],
    workOrders: [],
  },
];

const mockMetrics: WorkflowMetrics = {
  totalOrders: 45,
  inProduction: 12,
  pendingQC: 5,
  readyToShip: 8,
  overdue: 2,
  completedToday: 3,
};

// Status configuration
const statusConfig: Record<OrderTrackingStatus, { label: string; color: string; bgColor: string; icon: React.ElementType }> = {
  order_placed: { label: 'Order Placed', color: 'text-gray-600', bgColor: 'bg-gray-100', icon: Clock },
  order_confirmed: { label: 'Confirmed', color: 'text-blue-600', bgColor: 'bg-blue-100', icon: CheckCircle },
  production_planning: { label: 'Planning', color: 'text-indigo-600', bgColor: 'bg-indigo-100', icon: ClipboardCheck },
  material_procurement: { label: 'Procurement', color: 'text-purple-600', bgColor: 'bg-purple-100', icon: Package },
  in_production: { label: 'In Production', color: 'text-orange-600', bgColor: 'bg-orange-100', icon: Factory },
  quality_check: { label: 'Quality Check', color: 'text-yellow-600', bgColor: 'bg-yellow-100', icon: ClipboardCheck },
  ready_for_dispatch: { label: 'Ready to Ship', color: 'text-teal-600', bgColor: 'bg-teal-100', icon: Package },
  dispatched: { label: 'Dispatched', color: 'text-cyan-600', bgColor: 'bg-cyan-100', icon: Truck },
  in_transit: { label: 'In Transit', color: 'text-sky-600', bgColor: 'bg-sky-100', icon: Truck },
  delivered: { label: 'Delivered', color: 'text-green-600', bgColor: 'bg-green-100', icon: CheckCircle },
  completed: { label: 'Completed', color: 'text-green-700', bgColor: 'bg-green-100', icon: CheckCircle },
  cancelled: { label: 'Cancelled', color: 'text-red-600', bgColor: 'bg-red-100', icon: AlertTriangle },
  on_hold: { label: 'On Hold', color: 'text-amber-600', bgColor: 'bg-amber-100', icon: Clock },
};

export default function WorkflowDashboardPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<OrderTracking[]>(mockOrders);
  const [metrics, setMetrics] = useState<WorkflowMetrics>(mockMetrics);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);

  // Filter orders based on search and status
  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleRefresh = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Workflow Dashboard</h1>
              <p className="mt-1 text-sm text-gray-500">
                Real-time visibility into order processing and workflow status
              </p>
            </div>
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">{metrics.totalOrders}</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <Activity className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">In Production</p>
                <p className="text-2xl font-bold text-orange-600">{metrics.inProduction}</p>
              </div>
              <div className="p-2 bg-orange-100 rounded-lg">
                <Factory className="h-5 w-5 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Pending QC</p>
                <p className="text-2xl font-bold text-yellow-600">{metrics.pendingQC}</p>
              </div>
              <div className="p-2 bg-yellow-100 rounded-lg">
                <ClipboardCheck className="h-5 w-5 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Ready to Ship</p>
                <p className="text-2xl font-bold text-teal-600">{metrics.readyToShip}</p>
              </div>
              <div className="p-2 bg-teal-100 rounded-lg">
                <Package className="h-5 w-5 text-teal-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Overdue</p>
                <p className="text-2xl font-bold text-red-600">{metrics.overdue}</p>
              </div>
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Completed Today</p>
                <p className="text-2xl font-bold text-green-600">{metrics.completedToday}</p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Workflow Pipeline Visualization */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Workflow Pipeline</h2>
          <div className="flex items-center justify-between overflow-x-auto pb-2">
            {[
              { status: 'order_confirmed', count: 5 },
              { status: 'production_planning', count: 3 },
              { status: 'in_production', count: 12 },
              { status: 'quality_check', count: 5 },
              { status: 'ready_for_dispatch', count: 8 },
              { status: 'dispatched', count: 4 },
              { status: 'delivered', count: 8 },
            ].map((stage, index, arr) => {
              const config = statusConfig[stage.status as OrderTrackingStatus];
              const Icon = config.icon;
              return (
                <React.Fragment key={stage.status}>
                  <div className="flex flex-col items-center min-w-[100px]">
                    <div className={`p-3 rounded-full ${config.bgColor} mb-2`}>
                      <Icon className={`h-6 w-6 ${config.color}`} />
                    </div>
                    <p className="text-sm font-medium text-gray-900">{stage.count}</p>
                    <p className="text-xs text-gray-500 text-center">{config.label}</p>
                  </div>
                  {index < arr.length - 1 && (
                    <ArrowRight className="h-5 w-5 text-gray-300 mx-2 flex-shrink-0" />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Orders List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Active Orders</h2>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search orders..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Status</option>
                  {Object.entries(statusConfig).map(([key, config]) => (
                    <option key={key} value={key}>{config.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="divide-y divide-gray-200">
            {filteredOrders.map((order) => {
              const config = statusConfig[order.status];
              const Icon = config.icon;
              return (
                <div
                  key={order.id}
                  className="p-4 hover:bg-gray-50 cursor-pointer"
                  onClick={() => router.push(`/workflow/orders/${order.id}`)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-lg ${config.bgColor}`}>
                        <Icon className={`h-5 w-5 ${config.color}`} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-gray-900">{order.orderNumber}</p>
                          <span className={`px-2 py-0.5 text-xs rounded-full ${config.bgColor} ${config.color}`}>
                            {config.label}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">{order.customerName}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">{formatCurrency(order.totalAmount)}</p>
                        <p className="text-xs text-gray-500">{order.itemCount} items</p>
                      </div>

                      <div className="text-right">
                        <p className="text-sm text-gray-900">Due: {formatDate(order.expectedDeliveryDate)}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <div className="w-20 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-blue-600 rounded-full"
                              style={{ width: `${order.progress}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-500">{order.progress}%</span>
                        </div>
                      </div>

                      <button className="p-2 hover:bg-gray-100 rounded-lg">
                        <Eye className="h-4 w-4 text-gray-400" />
                      </button>
                    </div>
                  </div>

                  {/* Work Orders */}
                  {order.workOrders.length > 0 && (
                    <div className="mt-3 pl-14">
                      <div className="flex items-center gap-2 flex-wrap">
                        {order.workOrders.map((wo) => (
                          <span
                            key={wo.workOrderNumber}
                            className={`px-2 py-1 text-xs rounded ${wo.status === 'completed'
                              ? 'bg-green-100 text-green-700'
                              : wo.status === 'in_progress'
                                ? 'bg-orange-100 text-orange-700'
                                : 'bg-gray-100 text-gray-700'
                              }`}
                          >
                            {wo.workOrderNumber}: {wo.itemName} ({wo.quantity})
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {filteredOrders.length === 0 && (
              <div className="p-8 text-center">
                <Package className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No orders found</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Notifications */}
        <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Bell className="h-5 w-5 text-gray-400" />
            Recent Workflow Events
          </h2>
          <div className="space-y-3">
            {[
              { time: '2 mins ago', message: 'Work Order WO-001 started production for Kitchen Cabinet A', type: 'info' },
              { time: '15 mins ago', message: 'Order SO-2024-002 passed quality check', type: 'success' },
              { time: '1 hour ago', message: 'Low stock alert: Plywood Sheet 18mm below reorder level', type: 'warning' },
              { time: '2 hours ago', message: 'Order SO-2024-004 dispatched to Elite Kitchens', type: 'info' },
              { time: '3 hours ago', message: 'New order SO-2024-005 confirmed from Modern Living', type: 'success' },
            ].map((event, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <div className={`mt-0.5 p-1 rounded-full ${event.type === 'success' ? 'bg-green-100' :
                  event.type === 'warning' ? 'bg-yellow-100' : 'bg-blue-100'
                  }`}>
                  {event.type === 'success' ? (
                    <CheckCircle className="h-3 w-3 text-green-600" />
                  ) : event.type === 'warning' ? (
                    <AlertTriangle className="h-3 w-3 text-yellow-600" />
                  ) : (
                    <Activity className="h-3 w-3 text-blue-600" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{event.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{event.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

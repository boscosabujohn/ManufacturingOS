'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Search, Eye, Edit, ShoppingCart, User, Calendar, DollarSign, TrendingUp, Package, Truck, CheckCircle, Clock, Download, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';

interface SalesOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerId: string;
  orderDate: string;
  deliveryDate: string;
  status: 'draft' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  totalAmount: number;
  paidAmount: number;
  paymentStatus: 'pending' | 'partial' | 'paid';
  items: number;
  assignedTo: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  shippingAddress: string;
}

const mockOrders: SalesOrder[] = [
  {
    id: 'SO-001',
    orderNumber: 'SO-2025-001',
    customerName: 'Hotel Paradise Ltd',
    customerId: 'CUST-001',
    orderDate: '2025-10-01',
    deliveryDate: '2025-10-25',
    status: 'processing',
    totalAmount: 150000,
    paidAmount: 75000,
    paymentStatus: 'partial',
    items: 12,
    assignedTo: 'John Anderson',
    priority: 'high',
    shippingAddress: '123 Beach Road, Miami, FL',
  },
  {
    id: 'SO-002',
    orderNumber: 'SO-2025-002',
    customerName: 'Culinary Delights Inc',
    customerId: 'CUST-002',
    orderDate: '2025-10-05',
    deliveryDate: '2025-10-28',
    status: 'shipped',
    totalAmount: 102000,
    paidAmount: 102000,
    paymentStatus: 'paid',
    items: 8,
    assignedTo: 'Sarah Johnson',
    priority: 'medium',
    shippingAddress: '456 Market Street, Boston, MA',
  },
  {
    id: 'SO-003',
    orderNumber: 'SO-2025-003',
    customerName: 'City General Hospital',
    customerId: 'CUST-003',
    orderDate: '2025-10-08',
    deliveryDate: '2025-11-05',
    status: 'confirmed',
    totalAmount: 240000,
    paidAmount: 0,
    paymentStatus: 'pending',
    items: 15,
    assignedTo: 'Michael Chen',
    priority: 'urgent',
    shippingAddress: '789 Health Avenue, Chicago, IL',
  },
  {
    id: 'SO-004',
    orderNumber: 'SO-2025-004',
    customerName: 'Springfield Academy',
    customerId: 'CUST-004',
    orderDate: '2025-10-10',
    deliveryDate: '2025-10-30',
    status: 'processing',
    totalAmount: 54000,
    paidAmount: 54000,
    paymentStatus: 'paid',
    items: 6,
    assignedTo: 'Emily Davis',
    priority: 'low',
    shippingAddress: '321 Education Lane, Springfield, IL',
  },
  {
    id: 'SO-005',
    orderNumber: 'SO-2025-005',
    customerName: 'Artisan Bakers Co',
    customerId: 'CUST-005',
    orderDate: '2025-10-12',
    deliveryDate: '2025-11-08',
    status: 'shipped',
    totalAmount: 210000,
    paidAmount: 105000,
    paymentStatus: 'partial',
    items: 18,
    assignedTo: 'Robert Wilson',
    priority: 'high',
    shippingAddress: '555 Baker Street, Portland, OR',
  },
  {
    id: 'SO-006',
    orderNumber: 'SO-2025-006',
    customerName: 'Restaurant Group LLC',
    customerId: 'CUST-006',
    orderDate: '2025-10-14',
    deliveryDate: '2025-11-10',
    status: 'delivered',
    totalAmount: 95000,
    paidAmount: 95000,
    paymentStatus: 'paid',
    items: 10,
    assignedTo: 'Lisa Martinez',
    priority: 'medium',
    shippingAddress: '888 Dining Plaza, Seattle, WA',
  },
];

const statusColors = {
  draft: 'bg-gray-100 text-gray-700',
  confirmed: 'bg-blue-100 text-blue-700',
  processing: 'bg-yellow-100 text-yellow-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

const statusLabels = {
  draft: 'Draft',
  confirmed: 'Confirmed',
  processing: 'Processing',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

const paymentStatusColors = {
  pending: 'bg-red-100 text-red-700',
  partial: 'bg-yellow-100 text-yellow-700',
  paid: 'bg-green-100 text-green-700',
};

const paymentStatusLabels = {
  pending: 'Pending',
  partial: 'Partial',
  paid: 'Paid',
};

const priorityColors = {
  low: 'bg-gray-100 text-gray-700',
  medium: 'bg-blue-100 text-blue-700',
  high: 'bg-orange-100 text-orange-700',
  urgent: 'bg-red-100 text-red-700',
};

export default function SalesOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<SalesOrder[]>(mockOrders);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedOrders = filteredOrders.slice(startIndex, startIndex + itemsPerPage);

  const stats = {
    totalOrders: orders.length,
    processing: orders.filter((o) => o.status === 'processing').length,
    shipped: orders.filter((o) => o.status === 'shipped').length,
    totalValue: orders.reduce((sum, o) => sum + o.totalAmount, 0),
  };

  const handleExport = () => {
    console.log('Exporting sales orders data...');
  };

  return (
    <div className="w-full h-full px-4 sm:px-6 lg:px-8 py-6">
      {/* Stats */}
      <div className="mb-6 flex items-start gap-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 flex-1">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total Orders</p>
                <p className="text-2xl font-bold text-blue-900 mt-1">{stats.totalOrders}</p>
              </div>
              <ShoppingCart className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4 border border-yellow-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-600">Processing</p>
                <p className="text-2xl font-bold text-yellow-900 mt-1">{stats.processing}</p>
              </div>
              <Package className="h-8 w-8 text-yellow-600" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Shipped</p>
                <p className="text-2xl font-bold text-purple-900 mt-1">{stats.shipped}</p>
              </div>
              <Truck className="h-8 w-8 text-purple-600" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Total Value</p>
                <p className="text-2xl font-bold text-green-900 mt-1">
                  ${(stats.totalValue / 1000).toFixed(0)}K
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </div>
        </div>

        <button
          onClick={() => router.push('/sales/orders/add')}
          className="flex items-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors h-fit flex-shrink-0"
        >
          <Plus className="h-5 w-5" />
          <span>Create Order</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by order number, customer name, or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Status</option>
          <option value="draft">Draft</option>
          <option value="confirmed">Confirmed</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <button
          onClick={handleExport}
          className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          <Download className="h-4 w-4" />
          <span>Export</span>
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dates</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Priority</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assigned To</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-start space-x-3">
                      <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <ShoppingCart className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{order.orderNumber}</div>
                        <div className="text-xs text-gray-500">{order.items} items</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{order.customerName}</div>
                    <div className="text-sm text-gray-500">{order.customerId}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center text-xs text-gray-600">
                        <Calendar className="h-3 w-3 mr-1" />
                        <span>Order: {order.orderDate}</span>
                      </div>
                      <div className="flex items-center text-xs text-blue-600">
                        <Truck className="h-3 w-3 mr-1" />
                        <span>Delivery: {order.deliveryDate}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-gray-900">${order.totalAmount.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">Paid: ${order.paidAmount.toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${paymentStatusColors[order.paymentStatus]}`}>
                      {paymentStatusLabels[order.paymentStatus]}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${priorityColors[order.priority]}`}>
                      {order.priority.charAt(0).toUpperCase() + order.priority.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusColors[order.status]}`}>
                      {statusLabels[order.status]}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{order.assignedTo}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => router.push(`/sales/orders/view/${order.id}`)}
                        className="flex items-center space-x-1 px-3 py-1.5 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-sm font-medium"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                        <span>View</span>
                      </button>
                      <button
                        onClick={() => router.push(`/sales/orders/edit/${order.id}`)}
                        className="flex items-center space-x-1 px-3 py-1.5 text-green-600 bg-green-50 hover:bg-green-100 rounded-lg transition-colors text-sm font-medium"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                        <span>Edit</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredOrders.length)} of{' '}
            {filteredOrders.length} items
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="flex items-center space-x-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((page) => {
                  return page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1);
                })
                .map((page, index, array) => (
                  <div key={page} className="flex items-center">
                    {index > 0 && array[index - 1] !== page - 1 && <span className="px-2 text-gray-400">...</span>}
                    <button
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1 rounded-lg ${
                        currentPage === page ? 'bg-blue-600 text-white' : 'border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  </div>
                ))}
            </div>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

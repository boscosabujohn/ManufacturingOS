'use client';

import React, { useState } from 'react';
import {
  CheckCircle,
  ShoppingCart,
  DollarSign,
  Package,
  TrendingUp,
  Eye,
  Download,
  Send,
  Truck,
  Search,
  Filter,
  Calendar,
  User,
  Building2,
  Phone,
  Mail,
  Clock,
  AlertCircle,
  FileText,
  CreditCard,
  PlayCircle
} from 'lucide-react';

interface ConfirmedOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerCompany: string;
  customerEmail: string;
  customerPhone: string;
  orderDate: string;
  confirmedDate: string;
  expectedDelivery: string;
  totalAmount: number;
  items: number;
  assignedTo: string;
  priority: 'normal' | 'high' | 'urgent';
  paymentStatus: 'pending' | 'partial' | 'paid';
  paymentTerms: string;
  deliveryTerms: string;
  shippingMethod: string;
  notes: string;
}

export default function ConfirmedOrdersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [paymentFilter, setPaymentFilter] = useState<string>('all');

  const orders: ConfirmedOrder[] = [
    {
      id: 'SO-001',
      orderNumber: 'SO-2025-001',
      customerName: 'Rajesh Sharma',
      customerCompany: 'Tech Innovations Pvt Ltd',
      customerEmail: 'rajesh@techinnovations.com',
      customerPhone: '+91 98765 43210',
      orderDate: '2025-10-01',
      confirmedDate: '2025-10-02',
      expectedDelivery: '2025-10-22',
      totalAmount: 12500000,
      items: 8,
      assignedTo: 'Sarah Johnson',
      priority: 'high',
      paymentStatus: 'pending',
      paymentTerms: 'Net 30 Days',
      deliveryTerms: 'FOB Mumbai',
      shippingMethod: 'Standard Freight',
      notes: 'Priority customer - expedited processing required'
    },
    {
      id: 'SO-002',
      orderNumber: 'SO-2025-003',
      customerName: 'Amit Kumar',
      customerCompany: 'Industrial Automation Ltd',
      customerEmail: 'amit@indauto.com',
      customerPhone: '+91 97654 32109',
      orderDate: '2025-10-08',
      confirmedDate: '2025-10-09',
      expectedDelivery: '2025-10-28',
      totalAmount: 15300000,
      items: 15,
      assignedTo: 'Emily Rodriguez',
      priority: 'urgent',
      paymentStatus: 'partial',
      paymentTerms: 'Net 60 Days',
      deliveryTerms: 'CIF Delhi',
      shippingMethod: 'Express Delivery',
      notes: 'Large enterprise order - VIP handling'
    },
    {
      id: 'SO-003',
      orderNumber: 'SO-2025-005',
      customerName: 'Vikram Singh',
      customerCompany: 'Engineering Works Ltd',
      customerEmail: 'vikram@engworks.com',
      customerPhone: '+91 99876 54321',
      orderDate: '2025-09-28',
      confirmedDate: '2025-09-29',
      expectedDelivery: '2025-10-20',
      totalAmount: 9800000,
      items: 10,
      assignedTo: 'Jennifer Martinez',
      priority: 'normal',
      paymentStatus: 'paid',
      paymentTerms: 'Net 30 Days',
      deliveryTerms: 'CFR Kolkata',
      shippingMethod: 'Standard Freight',
      notes: 'Repeat customer - standard processing'
    },
    {
      id: 'SO-004',
      orderNumber: 'SO-2025-007',
      customerName: 'Ravi Krishnan',
      customerCompany: 'Precision Tools Ltd',
      customerEmail: 'ravi@precisiontools.com',
      customerPhone: '+91 97123 45678',
      orderDate: '2025-10-02',
      confirmedDate: '2025-10-03',
      expectedDelivery: '2025-10-25',
      totalAmount: 18200000,
      items: 18,
      assignedTo: 'Sarah Johnson',
      priority: 'urgent',
      paymentStatus: 'partial',
      paymentTerms: 'Net 60 Days',
      deliveryTerms: 'FOB Mumbai',
      shippingMethod: 'Express Delivery',
      notes: 'Largest order this quarter - executive oversight'
    },
    {
      id: 'SO-005',
      orderNumber: 'SO-2025-009',
      customerName: 'Priya Menon',
      customerCompany: 'Manufacturing Solutions Inc',
      customerEmail: 'priya.menon@mansol.com',
      customerPhone: '+91 98123 45678',
      orderDate: '2025-10-10',
      confirmedDate: '2025-10-11',
      expectedDelivery: '2025-10-30',
      totalAmount: 11200000,
      items: 12,
      assignedTo: 'Michael Chen',
      priority: 'high',
      paymentStatus: 'pending',
      paymentTerms: 'Net 30 Days',
      deliveryTerms: 'Ex-Works',
      shippingMethod: 'Customer Pickup',
      notes: 'Customer will arrange own transport'
    },
    {
      id: 'SO-006',
      orderNumber: 'SO-2025-011',
      customerName: 'Sneha Patel',
      customerCompany: 'Global Machinery Corp',
      customerEmail: 'sneha.p@globalmach.com',
      customerPhone: '+91 98234 56789',
      orderDate: '2025-10-12',
      confirmedDate: '2025-10-13',
      expectedDelivery: '2025-11-01',
      totalAmount: 7500000,
      items: 9,
      assignedTo: 'David Park',
      priority: 'normal',
      paymentStatus: 'paid',
      paymentTerms: 'Net 30 Days',
      deliveryTerms: 'FOB Chennai',
      shippingMethod: 'Standard Freight',
      notes: 'Payment received in advance'
    },
    {
      id: 'SO-007',
      orderNumber: 'SO-2025-013',
      customerName: 'Anita Desai',
      customerCompany: 'Production Systems Inc',
      customerEmail: 'anita@prodsys.com',
      customerPhone: '+91 98765 12345',
      orderDate: '2025-10-15',
      confirmedDate: '2025-10-16',
      expectedDelivery: '2025-10-26',
      totalAmount: 5600000,
      items: 6,
      assignedTo: 'Alex Thompson',
      priority: 'high',
      paymentStatus: 'pending',
      paymentTerms: 'Net 15 Days',
      deliveryTerms: 'Ex-Works',
      shippingMethod: 'Express Delivery',
      notes: 'Fast-track delivery requested'
    },
    {
      id: 'SO-008',
      orderNumber: 'SO-2025-015',
      customerName: 'Meera Shah',
      customerCompany: 'Industrial Supplies Co',
      customerEmail: 'meera@indsupplies.com',
      customerPhone: '+91 98456 78901',
      orderDate: '2025-10-17',
      confirmedDate: '2025-10-18',
      expectedDelivery: '2025-11-05',
      totalAmount: 8700000,
      items: 11,
      assignedTo: 'Michael Chen',
      priority: 'normal',
      paymentStatus: 'partial',
      paymentTerms: 'Net 45 Days',
      deliveryTerms: 'CIF Bangalore',
      shippingMethod: 'Standard Freight',
      notes: 'New customer - first order'
    }
  ];

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customerCompany.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = priorityFilter === 'all' || order.priority === priorityFilter;
    const matchesPayment = paymentFilter === 'all' || order.paymentStatus === paymentFilter;
    return matchesSearch && matchesPriority && matchesPayment;
  });

  const stats = [
    {
      label: 'Total Confirmed',
      value: orders.length,
      subtitle: 'Ready for processing',
      icon: CheckCircle,
      color: 'from-green-500 to-green-600'
    },
    {
      label: 'Total Value',
      value: '₹' + (orders.reduce((sum, o) => sum + o.totalAmount, 0) / 10000000).toFixed(1) + 'Cr',
      subtitle: 'Confirmed pipeline',
      icon: DollarSign,
      color: 'from-blue-500 to-blue-600'
    },
    {
      label: 'Urgent Orders',
      value: orders.filter(o => o.priority === 'urgent').length,
      subtitle: 'Need immediate attention',
      icon: AlertCircle,
      color: 'from-red-500 to-red-600'
    },
    {
      label: 'Payment Pending',
      value: orders.filter(o => o.paymentStatus === 'pending').length,
      subtitle: 'Awaiting payment',
      icon: CreditCard,
      color: 'from-orange-500 to-orange-600'
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-700 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-700 border-orange-200';
      default: return 'bg-blue-100 text-blue-700 border-blue-200';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-700 border-green-200';
      case 'partial': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'pending': return 'bg-orange-100 text-orange-700 border-orange-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getDaysUntilDelivery = (deliveryDate: string) => {
    const today = new Date();
    const delivery = new Date(deliveryDate);
    const diffTime = delivery.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="container mx-auto h-full px-4 sm:px-6 lg:px-8 py-6 max-w-7xl">
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className={`bg-gradient-to-br ${stat.color} rounded-xl p-6 text-white`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/80 text-sm">{stat.label}</p>
                    <p className="text-3xl font-bold mt-1">{stat.value}</p>
                    <p className="text-white/70 text-xs mt-1">{stat.subtitle}</p>
                  </div>
                  <Icon className="w-12 h-12 text-white/30" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Search className="w-4 h-4 inline mr-1" />
                Search
              </label>
              <input
                type="text"
                placeholder="Search by order number, customer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Filter className="w-4 h-4 inline mr-1" />
                Priority
              </label>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Priorities</option>
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="normal">Normal</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <CreditCard className="w-4 h-4 inline mr-1" />
                Payment Status
              </label>
              <select
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Payments</option>
                <option value="paid">Paid</option>
                <option value="partial">Partial</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>
        </div>

        {/* Orders Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredOrders.map((order) => {
            const daysUntilDelivery = getDaysUntilDelivery(order.expectedDelivery);
            const isUrgentDelivery = daysUntilDelivery <= 5;

            return (
              <div
                key={order.id}
                className={`bg-white rounded-lg border-2 transition-all hover:shadow-lg ${
                  order.priority === 'urgent' ? 'border-red-300 bg-red-50/30' :
                  order.priority === 'high' ? 'border-orange-300 bg-orange-50/30' :
                  'border-green-200 bg-green-50/20'
                }`}
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <h3 className="text-lg font-bold text-gray-900">{order.orderNumber}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(order.priority)}`}>
                          {order.priority.toUpperCase()}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPaymentStatusColor(order.paymentStatus)}`}>
                          {order.paymentStatus.toUpperCase()}
                        </span>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-semibold">
                          {order.customerName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{order.customerName}</p>
                          <p className="text-sm text-gray-600 flex items-center gap-1">
                            <Building2 className="w-4 h-4" />
                            {order.customerCompany}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Contact Details */}
                  <div className="grid grid-cols-2 gap-3 mb-4 pb-4 border-b border-gray-200">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail className="w-4 h-4" />
                      <span className="truncate">{order.customerEmail}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="w-4 h-4" />
                      <span>{order.customerPhone}</span>
                    </div>
                  </div>

                  {/* Confirmed Info */}
                  <div className="bg-green-50 rounded-lg p-3 mb-4 border border-green-200">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs text-green-700 mb-1">Confirmed On</p>
                        <div className="flex items-center gap-1">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <p className="text-sm font-bold text-green-900">
                            {new Date(order.confirmedDate).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-green-700 mb-1">Expected Delivery</p>
                        <div className="flex items-center gap-1">
                          <Truck className={`w-4 h-4 ${isUrgentDelivery ? 'text-red-600' : 'text-green-600'}`} />
                          <p className={`text-sm font-bold ${isUrgentDelivery ? 'text-red-900' : 'text-green-900'}`}>
                            {daysUntilDelivery} days
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-500">Order Date</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <p className="text-sm font-medium text-gray-900">
                          {new Date(order.orderDate).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Delivery Date</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <p className="text-sm font-medium text-gray-900">
                          {new Date(order.expectedDelivery).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Total Amount</p>
                      <p className="text-lg font-bold text-gray-900 mt-1">
                        ₹{(order.totalAmount / 100000).toFixed(1)}L
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Items</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Package className="w-4 h-4 text-gray-400" />
                        <p className="text-lg font-bold text-gray-900">{order.items}</p>
                      </div>
                    </div>
                  </div>

                  {/* Shipping & Payment Details */}
                  <div className="grid grid-cols-2 gap-3 mb-4 pb-4 border-b border-gray-200">
                    <div>
                      <p className="text-xs text-gray-500">Payment Terms</p>
                      <p className="text-sm font-medium text-gray-900 mt-1">{order.paymentTerms}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Delivery Terms</p>
                      <p className="text-sm font-medium text-gray-900 mt-1">{order.deliveryTerms}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-xs text-gray-500">Shipping Method</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Truck className="w-4 h-4 text-gray-400" />
                        <p className="text-sm font-medium text-gray-900">{order.shippingMethod}</p>
                      </div>
                    </div>
                  </div>

                  {/* Team Info */}
                  <div className="mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">Assigned to:</span>
                      <span className="font-medium text-gray-900">{order.assignedTo}</span>
                    </div>
                  </div>

                  {/* Notes */}
                  {order.notes && (
                    <div className="bg-blue-50 rounded-lg p-3 mb-4">
                      <p className="text-xs font-medium text-blue-900 mb-1">Notes</p>
                      <p className="text-sm text-blue-800">{order.notes}</p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                      <PlayCircle className="w-4 h-4" />
                      Start Processing
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <Eye className="w-4 h-4 text-gray-600" />
                    </button>
                    <button className="p-2 hover:bg-green-50 rounded-lg transition-colors">
                      <Download className="w-4 h-4 text-green-600" />
                    </button>
                    <button className="p-2 hover:bg-purple-50 rounded-lg transition-colors">
                      <Send className="w-4 h-4 text-purple-600" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredOrders.length === 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <CheckCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Confirmed Orders</h3>
            <p className="text-gray-600">No orders match your current filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}

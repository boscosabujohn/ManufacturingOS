'use client';

import React, { useState } from 'react';
import {
  CheckCircle,
  ShoppingCart,
  TrendingUp,
  DollarSign,
  Award,
  Eye,
  Download,
  Send,
  Copy,
  ArrowRight,
  Search,
  Filter,
  Calendar,
  User,
  Building2,
  Phone,
  Mail,
  Package,
  Clock,
  FileText,
  Truck,
  CreditCard
} from 'lucide-react';

interface ConvertedQuotation {
  id: string;
  quotationNumber: string;
  salesOrderNumber: string;
  customerName: string;
  customerCompany: string;
  customerEmail: string;
  customerPhone: string;
  quotationDate: string;
  convertedDate: string;
  quotationAmount: number;
  finalOrderAmount: number;
  items: number;
  assignedTo: string;
  conversionDays: number;
  discount: number;
  orderStatus: 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'completed';
  paymentStatus: 'pending' | 'partial' | 'paid';
  deliveryDate?: string;
  notes: string;
}

export default function ConvertedQuotationsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<string>('all');

  const quotations: ConvertedQuotation[] = [
    {
      id: 'QUO-001',
      quotationNumber: 'QUO-2025-001',
      salesOrderNumber: 'SO-2025-001',
      customerName: 'Rajesh Sharma',
      customerCompany: 'Tech Innovations Pvt Ltd',
      customerEmail: 'rajesh@techinnovations.com',
      customerPhone: '+91 98765 43210',
      quotationDate: '2025-09-15',
      convertedDate: '2025-10-01',
      quotationAmount: 12500000,
      finalOrderAmount: 12500000,
      items: 8,
      assignedTo: 'Sarah Johnson',
      conversionDays: 16,
      discount: 5,
      orderStatus: 'delivered',
      paymentStatus: 'paid',
      deliveryDate: '2025-10-18',
      notes: 'Fast conversion - excellent customer relationship'
    },
    {
      id: 'QUO-002',
      quotationNumber: 'QUO-2025-003',
      salesOrderNumber: 'SO-2025-003',
      customerName: 'Amit Kumar',
      customerCompany: 'Industrial Automation Ltd',
      customerEmail: 'amit@indauto.com',
      customerPhone: '+91 97654 32109',
      quotationDate: '2025-09-25',
      convertedDate: '2025-10-08',
      quotationAmount: 15600000,
      finalOrderAmount: 15300000,
      items: 15,
      assignedTo: 'Emily Rodriguez',
      conversionDays: 13,
      discount: 8,
      orderStatus: 'shipped',
      paymentStatus: 'partial',
      deliveryDate: '2025-10-22',
      notes: 'Slight negotiation on final pricing'
    },
    {
      id: 'QUO-003',
      quotationNumber: 'QUO-2025-005',
      salesOrderNumber: 'SO-2025-005',
      customerName: 'Vikram Singh',
      customerCompany: 'Engineering Works Ltd',
      customerEmail: 'vikram@engworks.com',
      customerPhone: '+91 99876 54321',
      quotationDate: '2025-09-10',
      convertedDate: '2025-09-28',
      quotationAmount: 9800000,
      finalOrderAmount: 9800000,
      items: 10,
      assignedTo: 'Jennifer Martinez',
      conversionDays: 18,
      discount: 6,
      orderStatus: 'completed',
      paymentStatus: 'paid',
      deliveryDate: '2025-10-12',
      notes: 'Repeat customer - smooth transaction'
    },
    {
      id: 'QUO-004',
      quotationNumber: 'QUO-2025-007',
      salesOrderNumber: 'SO-2025-007',
      customerName: 'Ravi Krishnan',
      customerCompany: 'Precision Tools Ltd',
      customerEmail: 'ravi@precisiontools.com',
      customerPhone: '+91 97123 45678',
      quotationDate: '2025-09-18',
      convertedDate: '2025-10-02',
      quotationAmount: 18900000,
      finalOrderAmount: 18200000,
      items: 18,
      assignedTo: 'Sarah Johnson',
      conversionDays: 14,
      discount: 10,
      orderStatus: 'processing',
      paymentStatus: 'partial',
      deliveryDate: '2025-10-25',
      notes: 'Largest order - VIP handling required'
    },
    {
      id: 'QUO-005',
      quotationNumber: 'QUO-2025-009',
      salesOrderNumber: 'SO-2025-009',
      customerName: 'Priya Menon',
      customerCompany: 'Manufacturing Solutions Inc',
      customerEmail: 'priya.menon@mansol.com',
      customerPhone: '+91 98123 45678',
      quotationDate: '2025-09-28',
      convertedDate: '2025-10-10',
      quotationAmount: 11200000,
      finalOrderAmount: 11200000,
      items: 12,
      assignedTo: 'Michael Chen',
      conversionDays: 12,
      discount: 3,
      orderStatus: 'confirmed',
      paymentStatus: 'pending',
      deliveryDate: '2025-10-28',
      notes: 'Quick decision maker - strong relationship'
    },
    {
      id: 'QUO-006',
      quotationNumber: 'QUO-2025-011',
      salesOrderNumber: 'SO-2025-011',
      customerName: 'Sneha Patel',
      customerCompany: 'Global Machinery Corp',
      customerEmail: 'sneha.p@globalmach.com',
      customerPhone: '+91 98234 56789',
      quotationDate: '2025-10-01',
      convertedDate: '2025-10-12',
      quotationAmount: 7800000,
      finalOrderAmount: 7500000,
      items: 9,
      assignedTo: 'David Park',
      conversionDays: 11,
      discount: 4,
      orderStatus: 'processing',
      paymentStatus: 'partial',
      deliveryDate: '2025-10-26',
      notes: 'Price negotiation successful'
    },
    {
      id: 'QUO-007',
      quotationNumber: 'QUO-2025-013',
      salesOrderNumber: 'SO-2025-013',
      customerName: 'Anita Desai',
      customerCompany: 'Production Systems Inc',
      customerEmail: 'anita@prodsys.com',
      customerPhone: '+91 98765 12345',
      quotationDate: '2025-10-05',
      convertedDate: '2025-10-15',
      quotationAmount: 5600000,
      finalOrderAmount: 5600000,
      items: 6,
      assignedTo: 'Alex Thompson',
      conversionDays: 10,
      discount: 2,
      orderStatus: 'shipped',
      paymentStatus: 'paid',
      deliveryDate: '2025-10-21',
      notes: 'Fast-track delivery requested and confirmed'
    },
    {
      id: 'QUO-008',
      quotationNumber: 'QUO-2025-015',
      salesOrderNumber: 'SO-2025-015',
      customerName: 'Meera Shah',
      customerCompany: 'Industrial Supplies Co',
      customerEmail: 'meera@indsupplies.com',
      customerPhone: '+91 98456 78901',
      quotationDate: '2025-10-08',
      convertedDate: '2025-10-17',
      quotationAmount: 8900000,
      finalOrderAmount: 8700000,
      items: 11,
      assignedTo: 'Michael Chen',
      conversionDays: 9,
      discount: 5,
      orderStatus: 'confirmed',
      paymentStatus: 'pending',
      deliveryDate: '2025-10-30',
      notes: 'New customer - first order'
    }
  ];

  const filteredQuotations = quotations.filter(quotation => {
    const matchesSearch = quotation.quotationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quotation.salesOrderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quotation.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quotation.customerCompany.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesOrderStatus = orderStatusFilter === 'all' || quotation.orderStatus === orderStatusFilter;
    const matchesPaymentStatus = paymentStatusFilter === 'all' || quotation.paymentStatus === paymentStatusFilter;
    return matchesSearch && matchesOrderStatus && matchesPaymentStatus;
  });

  const avgConversionDays = Math.round(quotations.reduce((sum, q) => sum + q.conversionDays, 0) / quotations.length);
  const conversionRate = ((quotations.filter(q => q.finalOrderAmount === q.quotationAmount).length / quotations.length) * 100).toFixed(0);

  const stats = [
    {
      label: 'Total Converted',
      value: quotations.length,
      subtitle: `${conversionRate}% at quoted price`,
      icon: CheckCircle,
      color: 'from-green-500 to-green-600'
    },
    {
      label: 'Total Revenue',
      value: '₹' + (quotations.reduce((sum, q) => sum + q.finalOrderAmount, 0) / 10000000).toFixed(1) + 'Cr',
      subtitle: 'From converted quotations',
      icon: DollarSign,
      color: 'from-blue-500 to-blue-600'
    },
    {
      label: 'Avg Conversion Time',
      value: avgConversionDays + ' days',
      subtitle: 'Quote to order',
      icon: Clock,
      color: 'from-purple-500 to-purple-600'
    },
    {
      label: 'Active Orders',
      value: quotations.filter(q => ['confirmed', 'processing', 'shipped'].includes(q.orderStatus)).length,
      subtitle: 'In progress',
      icon: ShoppingCart,
      color: 'from-orange-500 to-orange-600'
    }
  ];

  const getOrderStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'processing': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'shipped': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'delivered': return 'bg-green-100 text-green-700 border-green-200';
      case 'completed': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
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

  return (
    <div className="w-full h-full px-4 sm:px-6 lg:px-8 py-6">
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
                placeholder="Search by quotation, order, or customer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Filter className="w-4 h-4 inline mr-1" />
                Order Status
              </label>
              <select
                value={orderStatusFilter}
                onChange={(e) => setOrderStatusFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="confirmed">Confirmed</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <CreditCard className="w-4 h-4 inline mr-1" />
                Payment Status
              </label>
              <select
                value={paymentStatusFilter}
                onChange={(e) => setPaymentStatusFilter(e.target.value)}
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

        {/* Quotations Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredQuotations.map((quotation) => {
            const priceChange = quotation.finalOrderAmount - quotation.quotationAmount;
            const priceChangePercent = ((priceChange / quotation.quotationAmount) * 100).toFixed(1);

            return (
              <div
                key={quotation.id}
                className="bg-white rounded-lg border-2 border-green-200 bg-gradient-to-br from-green-50/30 to-emerald-50/30 transition-all hover:shadow-lg"
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Award className="w-5 h-5 text-green-600" />
                        <h3 className="text-lg font-bold text-gray-900">{quotation.quotationNumber}</h3>
                        <ArrowRight className="w-4 h-4 text-gray-400" />
                        <h3 className="text-lg font-bold text-green-700">{quotation.salesOrderNumber}</h3>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-semibold">
                          {quotation.customerName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{quotation.customerName}</p>
                          <p className="text-sm text-gray-600 flex items-center gap-1">
                            <Building2 className="w-4 h-4" />
                            {quotation.customerCompany}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Status Badges */}
                  <div className="flex items-center gap-2 mb-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getOrderStatusColor(quotation.orderStatus)}`}>
                      {quotation.orderStatus.toUpperCase()}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPaymentStatusColor(quotation.paymentStatus)}`}>
                      {quotation.paymentStatus.toUpperCase()}
                    </span>
                  </div>

                  {/* Contact Details */}
                  <div className="grid grid-cols-2 gap-3 mb-4 pb-4 border-b border-gray-200">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail className="w-4 h-4" />
                      <span className="truncate">{quotation.customerEmail}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="w-4 h-4" />
                      <span>{quotation.customerPhone}</span>
                    </div>
                  </div>

                  {/* Conversion Info */}
                  <div className="bg-green-50 rounded-lg p-3 mb-4 border border-green-200">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs text-green-700 mb-1">Converted In</p>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4 text-green-600" />
                          <p className="text-sm font-bold text-green-900">{quotation.conversionDays} days</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-green-700 mb-1">Conversion Date</p>
                        <p className="text-sm font-bold text-green-900">
                          {new Date(quotation.convertedDate).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Financial Details */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-500">Quoted Amount</p>
                      <p className="text-sm font-medium text-gray-600 mt-1">
                        ₹{(quotation.quotationAmount / 100000).toFixed(1)}L
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Final Order Amount</p>
                      <p className="text-lg font-bold text-gray-900 mt-1">
                        ₹{(quotation.finalOrderAmount / 100000).toFixed(1)}L
                      </p>
                    </div>
                    {priceChange !== 0 && (
                      <div className="col-span-2">
                        <p className="text-xs text-gray-500">Price Adjustment</p>
                        <p className={`text-sm font-semibold mt-1 ${priceChange < 0 ? 'text-red-600' : 'text-green-600'}`}>
                          {priceChange < 0 ? '-' : '+'}₹{Math.abs(priceChange / 100000).toFixed(1)}L ({priceChangePercent}%)
                        </p>
                      </div>
                    )}
                    <div>
                      <p className="text-xs text-gray-500">Items</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Package className="w-4 h-4 text-gray-400" />
                        <p className="text-lg font-bold text-gray-900">{quotation.items}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Discount</p>
                      <p className="text-lg font-bold text-gray-900 mt-1">{quotation.discount}%</p>
                    </div>
                  </div>

                  {/* Delivery Info */}
                  {quotation.deliveryDate && (
                    <div className="mb-4 pb-4 border-b border-gray-200">
                      <div className="flex items-center gap-2 text-sm">
                        <Truck className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">Expected Delivery:</span>
                        <span className="font-medium text-gray-900">
                          {new Date(quotation.deliveryDate).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Team Info */}
                  <div className="mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">Sales Rep:</span>
                      <span className="font-medium text-gray-900">{quotation.assignedTo}</span>
                    </div>
                  </div>

                  {/* Notes */}
                  {quotation.notes && (
                    <div className="bg-blue-50 rounded-lg p-3 mb-4">
                      <p className="text-xs font-medium text-blue-900 mb-1">Notes</p>
                      <p className="text-sm text-blue-800">{quotation.notes}</p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                      <Eye className="w-4 h-4" />
                      View Order
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Download PDF">
                      <Download className="w-4 h-4 text-gray-600" />
                    </button>
                    <button className="p-2 hover:bg-blue-50 rounded-lg transition-colors" title="Send Invoice">
                      <Send className="w-4 h-4 text-blue-600" />
                    </button>
                    <button className="p-2 hover:bg-purple-50 rounded-lg transition-colors" title="Duplicate">
                      <Copy className="w-4 h-4 text-purple-600" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredQuotations.length === 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Converted Quotations</h3>
            <p className="text-gray-600">No quotations match your current filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}

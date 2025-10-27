'use client';

import React, { useState } from 'react';
import {
  Clock,
  Send,
  Eye,
  Edit,
  Trash2,
  Search,
  Filter,
  Calendar,
  User,
  DollarSign,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  FileText,
  Phone,
  Mail,
  Building2,
  ArrowUpRight,
  Copy
} from 'lucide-react';

interface PendingQuotation {
  id: string;
  quotationNumber: string;
  customerName: string;
  customerCompany: string;
  customerEmail: string;
  customerPhone: string;
  quotationDate: string;
  validUntil: string;
  totalAmount: number;
  items: number;
  assignedTo: string;
  status: 'pending_approval' | 'pending_send' | 'awaiting_response';
  priority: 'high' | 'medium' | 'low';
  daysRemaining: number;
  lastFollowUp?: string;
  notes: string;
}

export default function PendingQuotationsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  const quotations: PendingQuotation[] = [
    {
      id: 'QUO-001',
      quotationNumber: 'QUO-2025-001',
      customerName: 'Rajesh Sharma',
      customerCompany: 'Tech Innovations Pvt Ltd',
      customerEmail: 'rajesh@techinnovations.com',
      customerPhone: '+91 98765 43210',
      quotationDate: '2025-10-15',
      validUntil: '2025-11-15',
      totalAmount: 12500000,
      items: 8,
      assignedTo: 'Sarah Johnson',
      status: 'awaiting_response',
      priority: 'high',
      daysRemaining: 26,
      lastFollowUp: '2025-10-18',
      notes: 'Follow up scheduled for this week'
    },
    {
      id: 'QUO-002',
      quotationNumber: 'QUO-2025-002',
      customerName: 'Priya Menon',
      customerCompany: 'Manufacturing Solutions Inc',
      customerEmail: 'priya.menon@mansol.com',
      customerPhone: '+91 98123 45678',
      quotationDate: '2025-10-18',
      validUntil: '2025-11-18',
      totalAmount: 8750000,
      items: 12,
      assignedTo: 'Michael Chen',
      status: 'pending_send',
      priority: 'high',
      daysRemaining: 29,
      notes: 'Waiting for final pricing approval'
    },
    {
      id: 'QUO-003',
      quotationNumber: 'QUO-2025-003',
      customerName: 'Amit Kumar',
      customerCompany: 'Industrial Automation Ltd',
      customerEmail: 'amit@indauto.com',
      customerPhone: '+91 97654 32109',
      quotationDate: '2025-10-12',
      validUntil: '2025-11-12',
      totalAmount: 15600000,
      items: 15,
      assignedTo: 'Emily Rodriguez',
      status: 'awaiting_response',
      priority: 'medium',
      daysRemaining: 23,
      lastFollowUp: '2025-10-16',
      notes: 'Customer requested technical specifications'
    },
    {
      id: 'QUO-004',
      quotationNumber: 'QUO-2025-004',
      customerName: 'Sneha Patel',
      customerCompany: 'Global Machinery Corp',
      customerEmail: 'sneha.p@globalmach.com',
      customerPhone: '+91 98234 56789',
      quotationDate: '2025-10-19',
      validUntil: '2025-11-19',
      totalAmount: 6300000,
      items: 6,
      assignedTo: 'David Park',
      status: 'pending_approval',
      priority: 'medium',
      daysRemaining: 30,
      notes: 'Pending management approval for discount'
    },
    {
      id: 'QUO-005',
      quotationNumber: 'QUO-2025-005',
      customerName: 'Vikram Singh',
      customerCompany: 'Engineering Works Ltd',
      customerEmail: 'vikram@engworks.com',
      customerPhone: '+91 99876 54321',
      quotationDate: '2025-10-10',
      validUntil: '2025-11-10',
      totalAmount: 9800000,
      items: 10,
      assignedTo: 'Jennifer Martinez',
      status: 'awaiting_response',
      priority: 'high',
      daysRemaining: 21,
      lastFollowUp: '2025-10-17',
      notes: 'Urgent - competitor in play'
    },
    {
      id: 'QUO-006',
      quotationNumber: 'QUO-2025-006',
      customerName: 'Anita Desai',
      customerCompany: 'Production Systems Inc',
      customerEmail: 'anita@prodsys.com',
      customerPhone: '+91 98765 12345',
      quotationDate: '2025-10-16',
      validUntil: '2025-11-16',
      totalAmount: 4500000,
      items: 5,
      assignedTo: 'Alex Thompson',
      status: 'pending_send',
      priority: 'low',
      daysRemaining: 27,
      notes: 'Waiting for product availability confirmation'
    },
    {
      id: 'QUO-007',
      quotationNumber: 'QUO-2025-007',
      customerName: 'Ravi Krishnan',
      customerCompany: 'Precision Tools Ltd',
      customerEmail: 'ravi@precisiontools.com',
      customerPhone: '+91 97123 45678',
      quotationDate: '2025-10-08',
      validUntil: '2025-11-08',
      totalAmount: 18900000,
      items: 18,
      assignedTo: 'Sarah Johnson',
      status: 'awaiting_response',
      priority: 'high',
      daysRemaining: 19,
      lastFollowUp: '2025-10-15',
      notes: 'Large order - needs executive review call'
    },
    {
      id: 'QUO-008',
      quotationNumber: 'QUO-2025-008',
      customerName: 'Meera Shah',
      customerCompany: 'Industrial Supplies Co',
      customerEmail: 'meera@indsupplies.com',
      customerPhone: '+91 98456 78901',
      quotationDate: '2025-10-17',
      validUntil: '2025-11-17',
      totalAmount: 7200000,
      items: 9,
      assignedTo: 'Michael Chen',
      status: 'pending_approval',
      priority: 'low',
      daysRemaining: 28,
      notes: 'Standard approval process'
    }
  ];

  const filteredQuotations = quotations.filter(quotation => {
    const matchesSearch = quotation.quotationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quotation.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quotation.customerCompany.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || quotation.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || quotation.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const stats = [
    {
      label: 'Total Pending',
      value: quotations.length,
      subtitle: `${quotations.filter(q => q.daysRemaining < 7).length} expiring soon`,
      icon: Clock,
      color: 'from-blue-500 to-blue-600'
    },
    {
      label: 'Awaiting Response',
      value: quotations.filter(q => q.status === 'awaiting_response').length,
      subtitle: 'Sent to customers',
      icon: Send,
      color: 'from-purple-500 to-purple-600'
    },
    {
      label: 'Pending Approval',
      value: quotations.filter(q => q.status === 'pending_approval').length,
      subtitle: 'Internal review',
      icon: AlertCircle,
      color: 'from-orange-500 to-orange-600'
    },
    {
      label: 'Total Value',
      value: '₹' + (quotations.reduce((sum, q) => sum + q.totalAmount, 0) / 10000000).toFixed(1) + 'Cr',
      subtitle: 'In pipeline',
      icon: DollarSign,
      color: 'from-green-500 to-green-600'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending_approval': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'pending_send': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'awaiting_response': return 'bg-purple-100 text-purple-700 border-purple-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending_approval': return 'Pending Approval';
      case 'pending_send': return 'Pending Send';
      case 'awaiting_response': return 'Awaiting Response';
      default: return status;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-700 border-green-200';
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
                placeholder="Search by quotation number, customer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Filter className="w-4 h-4 inline mr-1" />
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="pending_approval">Pending Approval</option>
                <option value="pending_send">Pending Send</option>
                <option value="awaiting_response">Awaiting Response</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Priorities</option>
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>
            </div>
          </div>
        </div>

        {/* Quotations Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredQuotations.map((quotation) => (
            <div
              key={quotation.id}
              className={`bg-white rounded-lg border-2 transition-all hover:shadow-lg ${
                quotation.daysRemaining < 7 ? 'border-orange-300 bg-orange-50/30' : 'border-gray-200'
              }`}
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-bold text-gray-900">{quotation.quotationNumber}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(quotation.status)}`}>
                        {getStatusLabel(quotation.status)}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(quotation.priority)}`}>
                        {quotation.priority.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
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

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-gray-500">Quotation Date</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <p className="text-sm font-medium text-gray-900">
                        {new Date(quotation.quotationDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Valid Until</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <p className="text-sm font-medium text-gray-900">
                        {new Date(quotation.validUntil).toLocaleDateString('en-US', {
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
                      ₹{(quotation.totalAmount / 100000).toFixed(1)}L
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Items</p>
                    <p className="text-lg font-bold text-gray-900 mt-1">{quotation.items}</p>
                  </div>
                </div>

                {/* Days Remaining */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-gray-600">Days Remaining</span>
                    <span className={`text-sm font-bold ${
                      quotation.daysRemaining < 7 ? 'text-red-600' : quotation.daysRemaining < 14 ? 'text-orange-600' : 'text-green-600'
                    }`}>
                      {quotation.daysRemaining} days
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        quotation.daysRemaining < 7
                          ? 'bg-red-500'
                          : quotation.daysRemaining < 14
                          ? 'bg-orange-500'
                          : 'bg-green-500'
                      }`}
                      style={{ width: `${Math.min((quotation.daysRemaining / 30) * 100, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Additional Info */}
                <div className="space-y-2 mb-4 pb-4 border-b border-gray-200">
                  <div className="flex items-center gap-2 text-sm">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">Assigned to:</span>
                    <span className="font-medium text-gray-900">{quotation.assignedTo}</span>
                  </div>
                  {quotation.lastFollowUp && (
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">Last Follow-up:</span>
                      <span className="font-medium text-gray-900">
                        {new Date(quotation.lastFollowUp).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  )}
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
                    <Send className="w-4 h-4" />
                    {quotation.status === 'pending_send' ? 'Send Now' : 'Follow Up'}
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <Eye className="w-4 h-4 text-gray-600" />
                  </button>
                  <button className="p-2 hover:bg-blue-50 rounded-lg transition-colors">
                    <Edit className="w-4 h-4 text-blue-600" />
                  </button>
                  <button className="p-2 hover:bg-purple-50 rounded-lg transition-colors">
                    <Copy className="w-4 h-4 text-purple-600" />
                  </button>
                  <button className="p-2 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredQuotations.length === 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Pending Quotations</h3>
            <p className="text-gray-600">No quotations match your current filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}

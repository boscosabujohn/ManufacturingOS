'use client';

import React, { useState } from 'react';
import {
  AlertCircle,
  XCircle,
  Clock,
  DollarSign,
  TrendingDown,
  RefreshCw,
  Eye,
  Copy,
  Trash2,
  Search,
  Filter,
  Calendar,
  User,
  Building2,
  Phone,
  Mail,
  Package,
  FileText,
  RotateCcw,
  Send
} from 'lucide-react';

interface ExpiredQuotation {
  id: string;
  quotationNumber: string;
  customerName: string;
  customerCompany: string;
  customerEmail: string;
  customerPhone: string;
  quotationDate: string;
  validUntil: string;
  expiredDate: string;
  daysExpired: number;
  totalAmount: number;
  items: number;
  assignedTo: string;
  reason: 'no_response' | 'rejected' | 'lost_to_competitor' | 'budget_constraints' | 'timing_issues' | 'other';
  lastFollowUp?: string;
  followUpCount: number;
  discount: number;
  notes: string;
  canRevive: boolean;
}

export default function ExpiredQuotationsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [reasonFilter, setReasonFilter] = useState<string>('all');
  const [ageFilter, setAgeFilter] = useState<string>('all');

  const quotations: ExpiredQuotation[] = [
    {
      id: 'QUO-001',
      quotationNumber: 'QUO-2025-002',
      customerName: 'Rajesh Kumar',
      customerCompany: 'Manufacturing Tech Ltd',
      customerEmail: 'rajesh@mfgtech.com',
      customerPhone: '+91 98765 43210',
      quotationDate: '2025-08-15',
      validUntil: '2025-09-15',
      expiredDate: '2025-09-15',
      daysExpired: 35,
      totalAmount: 8500000,
      items: 7,
      assignedTo: 'Sarah Johnson',
      reason: 'no_response',
      lastFollowUp: '2025-09-10',
      followUpCount: 3,
      discount: 5,
      notes: 'Customer stopped responding after initial interest',
      canRevive: true
    },
    {
      id: 'QUO-002',
      quotationNumber: 'QUO-2025-004',
      customerName: 'Priya Singh',
      customerCompany: 'Industrial Solutions Inc',
      customerEmail: 'priya@indsol.com',
      customerPhone: '+91 98123 45678',
      quotationDate: '2025-08-20',
      validUntil: '2025-09-20',
      expiredDate: '2025-09-20',
      daysExpired: 30,
      totalAmount: 12300000,
      items: 12,
      assignedTo: 'Michael Chen',
      reason: 'lost_to_competitor',
      lastFollowUp: '2025-09-18',
      followUpCount: 5,
      discount: 8,
      notes: 'Customer chose competitor due to lower pricing',
      canRevive: false
    },
    {
      id: 'QUO-003',
      quotationNumber: 'QUO-2025-006',
      customerName: 'Amit Patel',
      customerCompany: 'Engineering Works Ltd',
      customerEmail: 'amit@engworks.com',
      customerPhone: '+91 97654 32109',
      quotationDate: '2025-09-01',
      validUntil: '2025-10-01',
      expiredDate: '2025-10-01',
      daysExpired: 19,
      totalAmount: 6700000,
      items: 8,
      assignedTo: 'Emily Rodriguez',
      reason: 'budget_constraints',
      lastFollowUp: '2025-09-28',
      followUpCount: 4,
      discount: 3,
      notes: 'Budget not approved for this quarter',
      canRevive: true
    },
    {
      id: 'QUO-004',
      quotationNumber: 'QUO-2025-008',
      customerName: 'Sneha Desai',
      customerCompany: 'Production Systems Co',
      customerEmail: 'sneha@prodsys.com',
      customerPhone: '+91 98234 56789',
      quotationDate: '2025-08-25',
      validUntil: '2025-09-25',
      expiredDate: '2025-09-25',
      daysExpired: 25,
      totalAmount: 9800000,
      items: 10,
      assignedTo: 'David Park',
      reason: 'timing_issues',
      lastFollowUp: '2025-09-22',
      followUpCount: 2,
      discount: 6,
      notes: 'Project postponed to next year',
      canRevive: true
    },
    {
      id: 'QUO-005',
      quotationNumber: 'QUO-2025-010',
      customerName: 'Vikram Mehta',
      customerCompany: 'Automation Industries',
      customerEmail: 'vikram@autoinds.com',
      customerPhone: '+91 99876 54321',
      quotationDate: '2025-09-05',
      validUntil: '2025-10-05',
      expiredDate: '2025-10-05',
      daysExpired: 15,
      totalAmount: 15600000,
      items: 15,
      assignedTo: 'Jennifer Martinez',
      reason: 'rejected',
      lastFollowUp: '2025-10-03',
      followUpCount: 6,
      discount: 10,
      notes: 'Customer decided not to proceed with project',
      canRevive: false
    },
    {
      id: 'QUO-006',
      quotationNumber: 'QUO-2025-012',
      customerName: 'Anita Shah',
      customerCompany: 'Machinery Exports Ltd',
      customerEmail: 'anita@machexp.com',
      customerPhone: '+91 98765 12345',
      quotationDate: '2025-09-10',
      validUntil: '2025-10-10',
      expiredDate: '2025-10-10',
      daysExpired: 10,
      totalAmount: 5400000,
      items: 6,
      assignedTo: 'Alex Thompson',
      reason: 'no_response',
      lastFollowUp: '2025-10-08',
      followUpCount: 2,
      discount: 2,
      notes: 'Multiple follow-up attempts, no response',
      canRevive: true
    },
    {
      id: 'QUO-007',
      quotationNumber: 'QUO-2025-014',
      customerName: 'Ravi Krishnan',
      customerCompany: 'Global Manufacturing',
      customerEmail: 'ravi@globalmfg.com',
      customerPhone: '+91 97123 45678',
      quotationDate: '2025-08-28',
      validUntil: '2025-09-28',
      expiredDate: '2025-09-28',
      daysExpired: 22,
      totalAmount: 11200000,
      items: 13,
      assignedTo: 'Sarah Johnson',
      reason: 'other',
      lastFollowUp: '2025-09-25',
      followUpCount: 3,
      discount: 7,
      notes: 'Internal restructuring delayed decision',
      canRevive: true
    },
    {
      id: 'QUO-008',
      quotationNumber: 'QUO-2025-016',
      customerName: 'Meera Reddy',
      customerCompany: 'Tech Solutions Inc',
      customerEmail: 'meera@techsol.com',
      customerPhone: '+91 98456 78901',
      quotationDate: '2025-09-12',
      validUntil: '2025-10-12',
      expiredDate: '2025-10-12',
      daysExpired: 8,
      totalAmount: 7800000,
      items: 9,
      assignedTo: 'Michael Chen',
      reason: 'budget_constraints',
      lastFollowUp: '2025-10-10',
      followUpCount: 4,
      discount: 4,
      notes: 'Waiting for next fiscal year budget',
      canRevive: true
    }
  ];

  const filteredQuotations = quotations.filter(quotation => {
    const matchesSearch = quotation.quotationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quotation.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quotation.customerCompany.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesReason = reasonFilter === 'all' || quotation.reason === reasonFilter;

    let matchesAge = true;
    if (ageFilter === 'recent') matchesAge = quotation.daysExpired <= 15;
    else if (ageFilter === 'moderate') matchesAge = quotation.daysExpired > 15 && quotation.daysExpired <= 30;
    else if (ageFilter === 'old') matchesAge = quotation.daysExpired > 30;

    return matchesSearch && matchesReason && matchesAge;
  });

  const stats = [
    {
      label: 'Total Expired',
      value: quotations.length,
      subtitle: `${quotations.filter(q => q.canRevive).length} can be revived`,
      icon: XCircle,
      color: 'from-red-500 to-red-600'
    },
    {
      label: 'Lost Revenue',
      value: '₹' + (quotations.reduce((sum, q) => sum + q.totalAmount, 0) / 10000000).toFixed(1) + 'Cr',
      subtitle: 'Potential value',
      icon: DollarSign,
      color: 'from-orange-500 to-orange-600'
    },
    {
      label: 'Avg Days Expired',
      value: Math.round(quotations.reduce((sum, q) => sum + q.daysExpired, 0) / quotations.length),
      subtitle: 'Since expiry',
      icon: Clock,
      color: 'from-gray-500 to-gray-600'
    },
    {
      label: 'Revival Candidates',
      value: quotations.filter(q => q.canRevive).length,
      subtitle: `${Math.round((quotations.filter(q => q.canRevive).length / quotations.length) * 100)}% of expired`,
      icon: RefreshCw,
      color: 'from-blue-500 to-blue-600'
    }
  ];

  const getReasonColor = (reason: string) => {
    switch (reason) {
      case 'no_response': return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'rejected': return 'bg-red-100 text-red-700 border-red-200';
      case 'lost_to_competitor': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'budget_constraints': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'timing_issues': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-purple-100 text-purple-700 border-purple-200';
    }
  };

  const getReasonLabel = (reason: string) => {
    switch (reason) {
      case 'no_response': return 'No Response';
      case 'rejected': return 'Rejected';
      case 'lost_to_competitor': return 'Lost to Competitor';
      case 'budget_constraints': return 'Budget Constraints';
      case 'timing_issues': return 'Timing Issues';
      default: return 'Other';
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
                Expiry Reason
              </label>
              <select
                value={reasonFilter}
                onChange={(e) => setReasonFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Reasons</option>
                <option value="no_response">No Response</option>
                <option value="rejected">Rejected</option>
                <option value="lost_to_competitor">Lost to Competitor</option>
                <option value="budget_constraints">Budget Constraints</option>
                <option value="timing_issues">Timing Issues</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Age
              </label>
              <select
                value={ageFilter}
                onChange={(e) => setAgeFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Ages</option>
                <option value="recent">Recent (≤15 days)</option>
                <option value="moderate">Moderate (16-30 days)</option>
                <option value="old">Old ({'>'}30 days)</option>
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
                quotation.canRevive ? 'border-orange-200 bg-orange-50/20' : 'border-gray-300 bg-gray-50/30'
              }`}
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <XCircle className="w-5 h-5 text-red-600" />
                      <h3 className="text-lg font-bold text-gray-900">{quotation.quotationNumber}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getReasonColor(quotation.reason)}`}>
                        {getReasonLabel(quotation.reason)}
                      </span>
                      {quotation.canRevive && (
                        <RefreshCw className="w-4 h-4 text-blue-600" />
                      )}
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center text-white font-semibold">
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

                {/* Expiry Info */}
                <div className="bg-red-50 rounded-lg p-3 mb-4 border border-red-200">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-red-700 mb-1">Expired Since</p>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4 text-red-600" />
                        <p className="text-sm font-bold text-red-900">{quotation.daysExpired} days ago</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-red-700 mb-1">Expired On</p>
                      <p className="text-sm font-bold text-red-900">
                        {new Date(quotation.expiredDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
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
                      <AlertCircle className="w-4 h-4 text-red-500" />
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
                    <div className="flex items-center gap-1 mt-1">
                      <Package className="w-4 h-4 text-gray-400" />
                      <p className="text-lg font-bold text-gray-900">{quotation.items}</p>
                    </div>
                  </div>
                </div>

                {/* Follow-up Info */}
                <div className="grid grid-cols-2 gap-3 mb-4 pb-4 border-b border-gray-200">
                  <div>
                    <p className="text-xs text-gray-500">Follow-ups</p>
                    <p className="text-sm font-medium text-gray-900 mt-1">{quotation.followUpCount} attempts</p>
                  </div>
                  {quotation.lastFollowUp && (
                    <div>
                      <p className="text-xs text-gray-500">Last Follow-up</p>
                      <p className="text-sm font-medium text-gray-900 mt-1">
                        {new Date(quotation.lastFollowUp).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  )}
                </div>

                {/* Team Info */}
                <div className="mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">Assigned to:</span>
                    <span className="font-medium text-gray-900">{quotation.assignedTo}</span>
                  </div>
                </div>

                {/* Notes */}
                {quotation.notes && (
                  <div className="bg-yellow-50 rounded-lg p-3 mb-4">
                    <p className="text-xs font-medium text-yellow-900 mb-1">Notes</p>
                    <p className="text-sm text-yellow-800">{quotation.notes}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-2">
                  {quotation.canRevive ? (
                    <>
                      <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                        <RotateCcw className="w-4 h-4" />
                        Revive Quote
                      </button>
                      <button className="p-2 hover:bg-green-50 rounded-lg transition-colors">
                        <Send className="w-4 h-4 text-green-600" />
                      </button>
                    </>
                  ) : (
                    <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm">
                      <Eye className="w-4 h-4" />
                      View Details
                    </button>
                  )}
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
            <XCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Expired Quotations</h3>
            <p className="text-gray-600">No quotations match your current filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}

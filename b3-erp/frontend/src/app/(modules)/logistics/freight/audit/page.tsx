'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Search, AlertTriangle, CheckCircle, XCircle, DollarSign, TrendingUp, TrendingDown, Filter, Eye } from 'lucide-react';

interface FreightAudit {
  id: string;
  auditNo: string;
  invoiceNo: string;
  bookingNo: string;
  customerName: string;
  carrier: string;
  auditDate: string;
  invoicedAmount: number;
  auditedAmount: number;
  variance: number;
  variancePercent: number;
  status: 'pending' | 'in-review' | 'approved' | 'disputed' | 'adjusted';
  discrepancyType: string;
  auditedBy: string;
  findings: string[];
  recommendation: string;
  priority: 'high' | 'medium' | 'low';
}

export default function FreightAuditPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  const audits: FreightAudit[] = [
    {
      id: '1',
      auditNo: 'AUD-2025-5001',
      invoiceNo: 'INV-2025-3001',
      bookingNo: 'FB-2025-2001',
      customerName: 'ABC Manufacturing Ltd',
      carrier: 'Maersk Line',
      auditDate: '2025-10-26',
      invoicedAmount: 485000,
      auditedAmount: 485000,
      variance: 0,
      variancePercent: 0,
      status: 'approved',
      discrepancyType: 'None',
      auditedBy: 'Audit Team A',
      findings: ['All charges verified', 'Documentation complete', 'Rates match contract'],
      recommendation: 'Approve for payment',
      priority: 'low'
    },
    {
      id: '2',
      auditNo: 'AUD-2025-5002',
      invoiceNo: 'INV-2025-3002',
      bookingNo: 'FB-2025-2002',
      customerName: 'Global Traders Inc',
      carrier: 'Emirates SkyCargo',
      auditDate: '2025-10-23',
      invoicedAmount: 927000,
      auditedAmount: 890000,
      variance: -37000,
      variancePercent: -4.0,
      status: 'disputed',
      discrepancyType: 'Overcharge - Handling fees',
      auditedBy: 'Audit Team B',
      findings: [
        'Handling charges 15% higher than contract rate',
        'No documentation for additional handling',
        'Fuel surcharge calculation correct'
      ],
      recommendation: 'Dispute invoice and request credit note for ¹37,000',
      priority: 'high'
    },
    {
      id: '3',
      auditNo: 'AUD-2025-5003',
      invoiceNo: 'INV-2025-3003',
      bookingNo: 'FB-2025-2003',
      customerName: 'TechCorp Solutions',
      carrier: 'VRL Logistics',
      auditDate: '2025-10-25',
      invoicedAmount: 185550,
      auditedAmount: 182000,
      variance: -3550,
      variancePercent: -1.9,
      status: 'in-review',
      discrepancyType: 'Weight discrepancy',
      auditedBy: 'Audit Team A',
      findings: [
        'Invoiced for 12,500 kg but actual weight was 12,000 kg',
        'Documentation shows lower weight',
        'Rate per kg is correct'
      ],
      recommendation: 'Request revised invoice with correct weight',
      priority: 'medium'
    },
    {
      id: '4',
      auditNo: 'AUD-2025-5004',
      invoiceNo: 'INV-2025-3004',
      bookingNo: 'FB-2025-2004',
      customerName: 'Precision Parts Ltd',
      carrier: 'Indian Railways',
      auditDate: '2025-10-27',
      invoicedAmount: 125000,
      auditedAmount: 125000,
      variance: 0,
      variancePercent: 0,
      status: 'approved',
      discrepancyType: 'None',
      auditedBy: 'Audit Team C',
      findings: ['Charges match quote', 'Rail freight certificate attached', 'Payment terms verified'],
      recommendation: 'Approve for payment',
      priority: 'low'
    },
    {
      id: '5',
      auditNo: 'AUD-2025-5005',
      invoiceNo: 'INV-2025-3005',
      bookingNo: 'FB-2025-2005',
      customerName: 'Eastern Electronics',
      carrier: 'COSCO Shipping',
      auditDate: '2025-10-29',
      invoicedAmount: 625000,
      auditedAmount: 625000,
      variance: 0,
      variancePercent: 0,
      status: 'pending',
      discrepancyType: 'Pending verification',
      auditedBy: 'Audit Team B',
      findings: ['Audit in progress', 'Awaiting container loading report'],
      recommendation: 'Continue audit process',
      priority: 'medium'
    },
    {
      id: '6',
      auditNo: 'AUD-2025-5006',
      invoiceNo: 'INV-2025-3006',
      bookingNo: 'FB-2025-2006',
      customerName: 'Metro Wholesale',
      carrier: 'Gati Ltd',
      auditDate: '2025-10-22',
      invoicedAmount: 95100,
      auditedAmount: 95100,
      variance: 0,
      variancePercent: 0,
      status: 'approved',
      discrepancyType: 'None',
      auditedBy: 'Audit Team A',
      findings: ['Standard charges applied', 'Contract rates honored', 'POD received'],
      recommendation: 'Approve for payment',
      priority: 'low'
    },
    {
      id: '7',
      auditNo: 'AUD-2025-5007',
      invoiceNo: 'INV-2025-3007',
      bookingNo: 'FB-2025-2007',
      customerName: 'Northern Distributors',
      carrier: 'Lufthansa Cargo',
      auditDate: '2025-10-20',
      invoicedAmount: 1295000,
      auditedAmount: 1225000,
      variance: -70000,
      variancePercent: -5.4,
      status: 'adjusted',
      discrepancyType: 'Duplicate customs charge',
      auditedBy: 'Audit Team C',
      findings: [
        'Customs clearance charged twice',
        'First charge: ¹45,000 (legitimate)',
        'Second charge: ¹70,000 (duplicate)',
        'Carrier acknowledged error'
      ],
      recommendation: 'Adjusted invoice issued by carrier. Approve ¹1,225,000',
      priority: 'high'
    },
    {
      id: '8',
      auditNo: 'AUD-2025-5008',
      invoiceNo: 'INV-2025-3009',
      bookingNo: 'FB-2025-2009',
      customerName: 'Western Industries',
      carrier: 'DHL Express',
      auditDate: '2025-10-21',
      invoicedAmount: 550000,
      auditedAmount: 520000,
      variance: -30000,
      variancePercent: -5.5,
      status: 'disputed',
      discrepancyType: 'Fuel surcharge error',
      auditedBy: 'Audit Team B',
      findings: [
        'Fuel surcharge rate 18% applied instead of contract rate 12%',
        'Overcharge: ¹30,000',
        'Base freight charges correct'
      ],
      recommendation: 'Dispute and request credit note',
      priority: 'high'
    }
  ];

  const auditStats = {
    total: audits.length,
    pending: audits.filter(a => a.status === 'pending').length,
    inReview: audits.filter(a => a.status === 'in-review').length,
    approved: audits.filter(a => a.status === 'approved').length,
    disputed: audits.filter(a => a.status === 'disputed').length,
    adjusted: audits.filter(a => a.status === 'adjusted').length,
    totalInvoiced: audits.reduce((sum, a) => sum + a.invoicedAmount, 0),
    totalAudited: audits.reduce((sum, a) => sum + a.auditedAmount, 0),
    totalSavings: audits.reduce((sum, a) => sum + Math.abs(Math.min(a.variance, 0)), 0)
  };

  const filteredAudits = audits.filter(audit => {
    const matchesSearch =
      audit.auditNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      audit.invoiceNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      audit.customerName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || audit.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || audit.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-700 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'in-review': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'disputed': return 'bg-red-100 text-red-700 border-red-200';
      case 'adjusted': return 'bg-purple-100 text-purple-700 border-purple-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-50 text-red-700';
      case 'medium': return 'bg-yellow-50 text-yellow-700';
      case 'low': return 'bg-green-50 text-green-700';
      default: return 'bg-gray-50 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6 flex items-center gap-4">
        <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Freight Audit</h1>
          <p className="text-sm text-gray-500 mt-1">Review and audit freight invoices for accuracy</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 mb-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <AlertTriangle className="w-7 h-7 opacity-80" />
            <span className="text-2xl font-bold">{auditStats.total}</span>
          </div>
          <p className="text-xs font-medium opacity-90">Total Audits</p>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <AlertTriangle className="w-7 h-7 opacity-80" />
            <span className="text-2xl font-bold">{auditStats.pending}</span>
          </div>
          <p className="text-xs font-medium opacity-90">Pending</p>
        </div>

        <div className="bg-gradient-to-br from-blue-400 to-blue-500 text-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <Eye className="w-7 h-7 opacity-80" />
            <span className="text-2xl font-bold">{auditStats.inReview}</span>
          </div>
          <p className="text-xs font-medium opacity-90">In Review</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="w-7 h-7 opacity-80" />
            <span className="text-2xl font-bold">{auditStats.approved}</span>
          </div>
          <p className="text-xs font-medium opacity-90">Approved</p>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-red-600 text-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <XCircle className="w-7 h-7 opacity-80" />
            <span className="text-2xl font-bold">{auditStats.disputed}</span>
          </div>
          <p className="text-xs font-medium opacity-90">Disputed</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-7 h-7 opacity-80" />
            <span className="text-2xl font-bold">{auditStats.adjusted}</span>
          </div>
          <p className="text-xs font-medium opacity-90">Adjusted</p>
        </div>

        <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="w-7 h-7 opacity-80" />
            <span className="text-lg font-bold">¹{(auditStats.totalInvoiced / 1000000).toFixed(1)}M</span>
          </div>
          <p className="text-xs font-medium opacity-90">Invoiced</p>
        </div>

        <div className="bg-gradient-to-br from-green-400 to-green-500 text-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <TrendingDown className="w-7 h-7 opacity-80" />
            <span className="text-lg font-bold">¹{(auditStats.totalSavings / 1000).toFixed(0)}K</span>
          </div>
          <p className="text-xs font-medium opacity-90">Savings</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex flex-col gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by audit no, invoice no, or customer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in-review">In Review</option>
              <option value="approved">Approved</option>
              <option value="disputed">Disputed</option>
              <option value="adjusted">Adjusted</option>
            </select>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Priority</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Filter className="w-4 h-4" />
            <span>Showing {filteredAudits.length} of {auditStats.total} audits</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredAudits.map((audit) => (
          <div key={audit.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-bold text-gray-900">{audit.auditNo}</h3>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(audit.status)}`}>
                    {audit.status}
                  </span>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getPriorityColor(audit.priority)}`}>
                    {audit.priority} priority
                  </span>
                </div>
                <p className="text-sm font-semibold text-blue-600">{audit.customerName}</p>
                <p className="text-xs text-gray-500 mt-0.5">Invoice: {audit.invoiceNo} " Booking: {audit.bookingNo}</p>
              </div>

              {audit.variance !== 0 && (
                <div className="text-right">
                  <p className="text-xs text-gray-500 mb-0.5">Variance</p>
                  <p className={`text-2xl font-bold ${audit.variance < 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {audit.variance < 0 ? '-' : '+'}¹{Math.abs(audit.variance).toLocaleString()}
                  </p>
                  <p className={`text-sm ${audit.variance < 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {audit.variancePercent.toFixed(1)}%
                  </p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="bg-blue-50 rounded-lg p-3">
                <p className="text-xs text-blue-600 font-medium mb-1">Invoiced Amount</p>
                <p className="text-lg font-bold text-blue-900">¹{audit.invoicedAmount.toLocaleString()}</p>
              </div>

              <div className="bg-green-50 rounded-lg p-3">
                <p className="text-xs text-green-600 font-medium mb-1">Audited Amount</p>
                <p className="text-lg font-bold text-green-900">¹{audit.auditedAmount.toLocaleString()}</p>
              </div>

              <div className="bg-purple-50 rounded-lg p-3">
                <p className="text-xs text-purple-600 font-medium mb-1">Discrepancy</p>
                <p className="text-sm font-semibold text-purple-900">{audit.discrepancyType}</p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <p className="text-xs text-gray-500 font-medium mb-2">Audit Findings</p>
              <ul className="space-y-1">
                {audit.findings.map((finding, idx) => (
                  <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                    <span className="text-blue-500 mt-1">"</span>
                    <span>{finding}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className={`rounded-lg p-3 mb-4 ${
              audit.status === 'approved' ? 'bg-green-50 border border-green-200' :
              audit.status === 'disputed' ? 'bg-red-50 border border-red-200' :
              'bg-blue-50 border border-blue-200'
            }`}>
              <p className="text-xs font-medium mb-1 ${
                audit.status === 'approved' ? 'text-green-600' :
                audit.status === 'disputed' ? 'text-red-600' :
                'text-blue-600'
              }">Recommendation</p>
              <p className="text-sm ${
                audit.status === 'approved' ? 'text-green-900' :
                audit.status === 'disputed' ? 'text-red-900' :
                'text-blue-900'
              }">{audit.recommendation}</p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-gray-200">
              <div>
                <p className="text-xs text-gray-500">Audited by {audit.auditedBy} on {audit.auditDate}</p>
                <p className="text-xs text-gray-500 mt-0.5">Carrier: {audit.carrier}</p>
              </div>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm">
                View Full Report
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredAudits.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <AlertTriangle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-lg mb-2">No audits found</p>
          <p className="text-sm text-gray-400">Try adjusting your search or filter criteria</p>
        </div>
      )}

      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
        <h3 className="text-sm font-semibold text-blue-900 mb-2">Audit Process Guide:</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-blue-700">
          <div><span className="font-medium">Pending:</span> Audit scheduled, not yet started</div>
          <div><span className="font-medium">In Review:</span> Audit in progress, reviewing charges</div>
          <div><span className="font-medium">Approved:</span> No discrepancies, approved for payment</div>
          <div><span className="font-medium">Disputed:</span> Discrepancies found, dispute raised with carrier</div>
          <div><span className="font-medium">Adjusted:</span> Carrier issued corrected invoice</div>
          <div><span className="font-medium">Variance:</span> Negative = savings, Positive = additional charges</div>
        </div>
      </div>
    </div>
  );
}

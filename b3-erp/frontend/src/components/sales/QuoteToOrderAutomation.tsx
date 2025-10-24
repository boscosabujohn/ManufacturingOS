'use client'

import { useState } from 'react'
import { Zap, FileText, ShoppingCart, CheckCircle, Clock, AlertCircle, ArrowRight, DollarSign, Calendar, User } from 'lucide-react'

export type QuoteStatus = 'draft' | 'sent' | 'viewed' | 'negotiation' | 'accepted' | 'rejected' | 'expired' | 'converted';
export type AutomationRule = 'auto-approval' | 'credit-check' | 'pricing-validation' | 'inventory-check' | 'volume-discount';

export interface Quote {
  id: string;
  quoteNumber: string;
  customer: string;
  customerId: string;
  salesRep: string;
  status: QuoteStatus;
  items: {
    product: string;
    quantity: number;
    unitPrice: number;
    discount: number;
    totalPrice: number;
  }[];
  subtotal: number;
  tax: number;
  totalAmount: number;
  validUntil: string;
  createdDate: string;
  sentDate?: string;
  viewedDate?: string;
  acceptedDate?: string;
  convertedToOrderId?: string;
  automationTriggers: AutomationRule[];
  approvalRequired: boolean;
  approvalStatus?: 'pending' | 'approved' | 'rejected';
}

export interface ConversionMetrics {
  totalQuotes: number;
  quotesConverted: number;
  conversionRate: number;
  avgTimeToConvert: number; // in days
  totalQuoteValue: number;
  convertedValue: number;
  avgQuoteValue: number;
  avgOrderValue: number;
}

export interface AutomationLog {
  id: string;
  quoteId: string;
  timestamp: string;
  action: string;
  rule: AutomationRule;
  result: 'success' | 'failed' | 'pending';
  details: string;
}

export default function QuoteToOrderAutomation() {
  const [viewMode, setViewMode] = useState<'quotes' | 'automation' | 'metrics'>('quotes');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const [quotes] = useState<Quote[]>([
    {
      id: 'Q-001',
      quoteNumber: 'QT-2025-456',
      customer: 'ABC Manufacturing Ltd',
      customerId: 'CUST-001',
      salesRep: 'Rajesh Kumar',
      status: 'accepted',
      items: [
        { product: 'Hydraulic Press HP-500', quantity: 10, unitPrice: 2500000, discount: 5, totalPrice: 23750000 }
      ],
      subtotal: 23750000,
      tax: 4275000,
      totalAmount: 28025000,
      validUntil: '2025-11-15',
      createdDate: '2025-10-05',
      sentDate: '2025-10-05',
      viewedDate: '2025-10-06',
      acceptedDate: '2025-10-10',
      convertedToOrderId: 'SO-2025-234',
      automationTriggers: ['auto-approval', 'credit-check', 'inventory-check'],
      approvalRequired: false,
      approvalStatus: 'approved'
    },
    {
      id: 'Q-002',
      quoteNumber: 'QT-2025-457',
      customer: 'XYZ Industries Inc',
      customerId: 'CUST-002',
      salesRep: 'Priya Sharma',
      status: 'negotiation',
      items: [
        { product: 'CNC Machine CM-350', quantity: 5, unitPrice: 3750000, discount: 10, totalPrice: 16875000 }
      ],
      subtotal: 16875000,
      tax: 3037500,
      totalAmount: 19912500,
      validUntil: '2025-11-20',
      createdDate: '2025-10-12',
      sentDate: '2025-10-12',
      viewedDate: '2025-10-13',
      automationTriggers: ['pricing-validation', 'volume-discount'],
      approvalRequired: true,
      approvalStatus: 'pending'
    },
    {
      id: 'Q-003',
      quoteNumber: 'QT-2025-458',
      customer: 'Tech Solutions Pvt Ltd',
      customerId: 'CUST-003',
      salesRep: 'Amit Patel',
      status: 'sent',
      items: [
        { product: 'Control Panel CP-1000', quantity: 15, unitPrice: 800000, discount: 3, totalPrice: 11640000 }
      ],
      subtotal: 11640000,
      tax: 2095200,
      totalAmount: 13735200,
      validUntil: '2025-10-30',
      createdDate: '2025-10-15',
      sentDate: '2025-10-15',
      automationTriggers: ['auto-approval', 'inventory-check'],
      approvalRequired: false
    },
    {
      id: 'Q-004',
      quoteNumber: 'QT-2025-459',
      customer: 'Global Exports Corp',
      customerId: 'CUST-004',
      salesRep: 'Sunita Verma',
      status: 'converted',
      items: [
        { product: 'Conveyor System CS-200', quantity: 8, unitPrice: 1200000, discount: 0, totalPrice: 9600000 }
      ],
      subtotal: 9600000,
      tax: 1728000,
      totalAmount: 11328000,
      validUntil: '2025-10-25',
      createdDate: '2025-10-01',
      sentDate: '2025-10-01',
      viewedDate: '2025-10-02',
      acceptedDate: '2025-10-05',
      convertedToOrderId: 'SO-2025-237',
      automationTriggers: ['auto-approval', 'credit-check'],
      approvalRequired: false,
      approvalStatus: 'approved'
    },
    {
      id: 'Q-005',
      quoteNumber: 'QT-2025-460',
      customer: 'New Customer Ltd',
      customerId: 'CUST-015',
      salesRep: 'Rajesh Kumar',
      status: 'viewed',
      items: [
        { product: 'Hydraulic Press HP-300', quantity: 20, unitPrice: 1800000, discount: 15, totalPrice: 30600000 }
      ],
      subtotal: 30600000,
      tax: 5508000,
      totalAmount: 36108000,
      validUntil: '2025-11-10',
      createdDate: '2025-10-18',
      sentDate: '2025-10-18',
      viewedDate: '2025-10-19',
      automationTriggers: ['credit-check', 'pricing-validation', 'volume-discount'],
      approvalRequired: true,
      approvalStatus: 'pending'
    }
  ]);

  const [automationLogs] = useState<AutomationLog[]>([
    {
      id: 'LOG-001',
      quoteId: 'Q-001',
      timestamp: '2025-10-10 14:30:00',
      action: 'Auto-convert to Sales Order',
      rule: 'auto-approval',
      result: 'success',
      details: 'Quote accepted by customer. Credit check passed. Inventory available. Order SO-2025-234 created automatically.'
    },
    {
      id: 'LOG-002',
      quoteId: 'Q-001',
      timestamp: '2025-10-10 14:29:45',
      action: 'Credit Limit Validation',
      rule: 'credit-check',
      result: 'success',
      details: 'Customer credit limit: ₹5Cr, Outstanding: ₹1.25Cr, Order value: ₹2.8Cr. Approved.'
    },
    {
      id: 'LOG-003',
      quoteId: 'Q-001',
      timestamp: '2025-10-10 14:29:30',
      action: 'Inventory Availability Check',
      rule: 'inventory-check',
      result: 'success',
      details: 'All items available in stock. 10 units of Hydraulic Press HP-500 reserved.'
    },
    {
      id: 'LOG-004',
      quoteId: 'Q-002',
      timestamp: '2025-10-13 10:15:00',
      action: 'Volume Discount Validation',
      rule: 'volume-discount',
      result: 'pending',
      details: '10% discount exceeds auto-approval threshold (8%). Manager approval required.'
    },
    {
      id: 'LOG-005',
      quoteId: 'Q-005',
      timestamp: '2025-10-18 16:45:00',
      action: 'New Customer Credit Check',
      rule: 'credit-check',
      result: 'pending',
      details: 'New customer. Credit verification in progress. Finance team review required.'
    },
    {
      id: 'LOG-006',
      quoteId: 'Q-004',
      timestamp: '2025-10-05 11:20:00',
      action: 'Auto-convert to Sales Order',
      rule: 'auto-approval',
      result: 'success',
      details: 'All validation checks passed. Order SO-2025-237 created and sent to production planning.'
    }
  ]);

  const conversionMetrics: ConversionMetrics = {
    totalQuotes: 142,
    quotesConverted: 58,
    conversionRate: 40.8,
    avgTimeToConvert: 4.5,
    totalQuoteValue: 785000000,
    convertedValue: 352000000,
    avgQuoteValue: 5528000,
    avgOrderValue: 6068000
  };

  const getStatusColor = (status: QuoteStatus) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-700 border-gray-300';
      case 'sent':
        return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'viewed':
        return 'bg-purple-100 text-purple-700 border-purple-300';
      case 'negotiation':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'accepted':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'rejected':
        return 'bg-red-100 text-red-700 border-red-300';
      case 'expired':
        return 'bg-orange-100 text-orange-700 border-orange-300';
      case 'converted':
        return 'bg-emerald-100 text-emerald-700 border-emerald-300';
    }
  };

  const getResultColor = (result: 'success' | 'failed' | 'pending') => {
    switch (result) {
      case 'success':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'failed':
        return 'bg-red-100 text-red-700 border-red-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
    }
  };

  const formatCurrency = (amount: number) => {
    return `₹${(amount / 10000000).toFixed(2)}Cr`;
  };

  const filteredQuotes = filterStatus === 'all'
    ? quotes
    : quotes.filter(q => q.status === filterStatus);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <Zap className="h-8 w-8 text-blue-600" />
              Quote-to-Order Automation
            </h2>
            <p className="text-gray-600 mt-1">Automated quote conversion with intelligent workflows</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('quotes')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                viewMode === 'quotes'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Quotes
            </button>
            <button
              onClick={() => setViewMode('automation')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                viewMode === 'automation'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Automation Logs
            </button>
            <button
              onClick={() => setViewMode('metrics')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                viewMode === 'metrics'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Metrics
            </button>
          </div>
        </div>
      </div>

      {viewMode === 'quotes' && (
        <>
          {/* Filter */}
          <div className="bg-white shadow-md p-4">
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium text-gray-700">Filter by Status:</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Quotes</option>
                <option value="draft">Draft</option>
                <option value="sent">Sent</option>
                <option value="viewed">Viewed</option>
                <option value="negotiation">Negotiation</option>
                <option value="accepted">Accepted</option>
                <option value="converted">Converted</option>
                <option value="rejected">Rejected</option>
                <option value="expired">Expired</option>
              </select>
            </div>
          </div>

          {/* Quotes List */}
          <div className="bg-white shadow-lg border border-gray-200">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-cyan-50">
              <h3 className="text-lg font-semibold text-gray-900">
                Quotes ({filteredQuotes.length})
              </h3>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                {filteredQuotes.map((quote) => (
                  <div key={quote.id} className="p-5 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                    {/* Quote Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="text-lg font-bold text-gray-900">{quote.quoteNumber}</h4>
                        <p className="text-sm text-gray-600 mt-1">{quote.customer}</p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(quote.status)}`}>
                          {quote.status.toUpperCase()}
                        </span>
                        {quote.convertedToOrderId && (
                          <div className="flex items-center gap-1 text-xs text-green-600 font-medium">
                            <ShoppingCart className="h-3 w-3" />
                            {quote.convertedToOrderId}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Quote Details */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <p className="text-xs text-blue-600 font-medium">Total Amount</p>
                        <p className="text-lg font-bold text-blue-900">{formatCurrency(quote.totalAmount)}</p>
                      </div>
                      <div className="p-3 bg-purple-50 rounded-lg">
                        <p className="text-xs text-purple-600 font-medium">Sales Rep</p>
                        <p className="text-sm font-bold text-purple-900">{quote.salesRep}</p>
                      </div>
                      <div className="p-3 bg-green-50 rounded-lg">
                        <p className="text-xs text-green-600 font-medium">Created</p>
                        <p className="text-sm font-bold text-green-900">{quote.createdDate}</p>
                      </div>
                      <div className="p-3 bg-yellow-50 rounded-lg">
                        <p className="text-xs text-yellow-600 font-medium">Valid Until</p>
                        <p className="text-sm font-bold text-yellow-900">{quote.validUntil}</p>
                      </div>
                    </div>

                    {/* Items */}
                    <div className="mb-4">
                      <p className="text-sm font-semibold text-gray-700 mb-2">Quote Items:</p>
                      <div className="space-y-2">
                        {quote.items.map((item, idx) => (
                          <div key={idx} className="p-3 bg-gray-50 rounded-lg flex items-center justify-between">
                            <div>
                              <p className="font-medium text-gray-900">{item.product}</p>
                              <p className="text-xs text-gray-600">Qty: {item.quantity} @ {formatCurrency(item.unitPrice)}/unit</p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-gray-900">{formatCurrency(item.totalPrice)}</p>
                              {item.discount > 0 && (
                                <p className="text-xs text-orange-600">{item.discount}% discount</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Automation Triggers */}
                    <div className="mb-3">
                      <p className="text-sm font-semibold text-gray-700 mb-2">Automation Rules:</p>
                      <div className="flex flex-wrap gap-2">
                        {quote.automationTriggers.map((trigger, idx) => (
                          <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded flex items-center gap-1">
                            <Zap className="h-3 w-3" />
                            {trigger.replace('-', ' ').toUpperCase()}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Approval Status */}
                    {quote.approvalRequired && (
                      <div className={`p-3 rounded-lg border ${
                        quote.approvalStatus === 'approved' ? 'bg-green-50 border-green-300' :
                        quote.approvalStatus === 'rejected' ? 'bg-red-50 border-red-300' :
                        'bg-yellow-50 border-yellow-300'
                      }`}>
                        <div className="flex items-center gap-2">
                          {quote.approvalStatus === 'approved' ? <CheckCircle className="h-4 w-4 text-green-600" /> :
                           quote.approvalStatus === 'rejected' ? <AlertCircle className="h-4 w-4 text-red-600" /> :
                           <Clock className="h-4 w-4 text-yellow-600" />}
                          <span className={`text-sm font-medium ${
                            quote.approvalStatus === 'approved' ? 'text-green-700' :
                            quote.approvalStatus === 'rejected' ? 'text-red-700' :
                            'text-yellow-700'
                          }`}>
                            Approval {quote.approvalStatus?.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Timeline */}
                    <div className="mt-4 flex items-center gap-3 text-xs text-gray-600">
                      {quote.sentDate && (
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Sent: {quote.sentDate}
                        </span>
                      )}
                      {quote.viewedDate && (
                        <ArrowRight className="h-3 w-3" />
                      )}
                      {quote.viewedDate && (
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          Viewed: {quote.viewedDate}
                        </span>
                      )}
                      {quote.acceptedDate && (
                        <ArrowRight className="h-3 w-3" />
                      )}
                      {quote.acceptedDate && (
                        <span className="flex items-center gap-1">
                          <CheckCircle className="h-3 w-3 text-green-600" />
                          Accepted: {quote.acceptedDate}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {viewMode === 'automation' && (
        <div className="bg-white shadow-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-cyan-50">
            <h3 className="text-lg font-semibold text-gray-900">
              Automation Logs ({automationLogs.length})
            </h3>
          </div>

          <div className="p-6">
            <div className="space-y-3">
              {automationLogs.map((log) => {
                const quote = quotes.find(q => q.id === log.quoteId);
                return (
                  <div key={log.id} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-bold text-gray-900">{log.action}</h4>
                        <p className="text-sm text-gray-600 mt-1">
                          Quote: {quote?.quoteNumber} • {quote?.customer}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getResultColor(log.result)}`}>
                        {log.result.toUpperCase()}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-700 capitalize">
                        {log.rule.replace('-', ' ')}
                      </span>
                    </div>

                    <p className="text-sm text-gray-700 mb-2">{log.details}</p>

                    <p className="text-xs text-gray-500">{log.timestamp}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {viewMode === 'metrics' && (
        <div className="bg-white shadow-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-cyan-50">
            <h3 className="text-lg font-semibold text-gray-900">Conversion Metrics & Performance</h3>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-600 font-medium">Total Quotes</p>
                <p className="text-3xl font-bold text-blue-900 mt-2">{conversionMetrics.totalQuotes}</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <p className="text-sm text-green-600 font-medium">Quotes Converted</p>
                <p className="text-3xl font-bold text-green-900 mt-2">{conversionMetrics.quotesConverted}</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <p className="text-sm text-purple-600 font-medium">Conversion Rate</p>
                <p className="text-3xl font-bold text-purple-900 mt-2">{conversionMetrics.conversionRate}%</p>
              </div>
              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <p className="text-sm text-yellow-600 font-medium">Avg Time to Convert</p>
                <p className="text-3xl font-bold text-yellow-900 mt-2">{conversionMetrics.avgTimeToConvert}d</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-sm text-blue-600 font-medium">Total Quote Value</p>
                    <p className="text-2xl font-bold text-blue-900 mt-1">{formatCurrency(conversionMetrics.totalQuoteValue)}</p>
                  </div>
                  <FileText className="h-10 w-10 text-blue-600" />
                </div>
                <p className="text-xs text-blue-700">Avg: {formatCurrency(conversionMetrics.avgQuoteValue)}</p>
              </div>

              <div className="p-5 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-sm text-green-600 font-medium">Converted Value</p>
                    <p className="text-2xl font-bold text-green-900 mt-1">{formatCurrency(conversionMetrics.convertedValue)}</p>
                  </div>
                  <DollarSign className="h-10 w-10 text-green-600" />
                </div>
                <p className="text-xs text-green-700">Avg Order: {formatCurrency(conversionMetrics.avgOrderValue)}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

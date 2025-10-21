'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Search, FileText, DollarSign, TrendingUp, Package, Truck, MapPin, Calendar, Clock, Plus, CheckCircle, XCircle, Filter } from 'lucide-react';

interface FreightQuote {
  id: string;
  quoteNo: string;
  customerName: string;
  origin: string;
  destination: string;
  cargoType: string;
  weight: number;
  volume: number;
  transportMode: 'air' | 'sea' | 'road' | 'rail';
  serviceType: 'express' | 'standard' | 'economy';
  quotedAmount: number;
  validUntil: string;
  transitTime: string;
  carrier: string;
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';
  createdDate: string;
  createdBy: string;
  remarks: string;
  includedServices: string[];
  fuelSurcharge: number;
  insuranceCharge: number;
  handlingCharge: number;
  customsClearance: number;
}

export default function FreightQuotesPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [modeFilter, setModeFilter] = useState<string>('all');

  const quotes: FreightQuote[] = [
    {
      id: '1',
      quoteNo: 'FQ-2025-1001',
      customerName: 'ABC Manufacturing Ltd',
      origin: 'Chennai Port',
      destination: 'Singapore Port',
      cargoType: 'Industrial Machinery',
      weight: 15000,
      volume: 45,
      transportMode: 'sea',
      serviceType: 'standard',
      quotedAmount: 485000,
      validUntil: '2025-11-05',
      transitTime: '7-10 days',
      carrier: 'Maersk Line',
      status: 'sent',
      createdDate: '2025-10-18',
      createdBy: 'Rajesh Kumar',
      remarks: 'LCL shipment, weekly sailing available',
      includedServices: ['Port handling', 'Documentation', 'Basic insurance'],
      fuelSurcharge: 48500,
      insuranceCharge: 14550,
      handlingCharge: 24250,
      customsClearance: 0
    },
    {
      id: '2',
      quoteNo: 'FQ-2025-1002',
      customerName: 'Global Traders Inc',
      origin: 'Mumbai',
      destination: 'Dubai',
      cargoType: 'Electronics',
      weight: 8500,
      volume: 28,
      transportMode: 'air',
      serviceType: 'express',
      quotedAmount: 890000,
      validUntil: '2025-11-02',
      transitTime: '2-3 days',
      carrier: 'Emirates SkyCargo',
      status: 'accepted',
      createdDate: '2025-10-15',
      createdBy: 'Priya Sharma',
      remarks: 'Temperature controlled cargo, priority handling',
      includedServices: ['Air freight', 'Express customs', 'Insurance', 'Door delivery'],
      fuelSurcharge: 89000,
      insuranceCharge: 26700,
      handlingCharge: 44500,
      customsClearance: 35000
    },
    {
      id: '3',
      quoteNo: 'FQ-2025-1003',
      customerName: 'TechCorp Solutions',
      origin: 'Bangalore',
      destination: 'Delhi',
      cargoType: 'IT Equipment',
      weight: 12000,
      volume: 38,
      transportMode: 'road',
      serviceType: 'express',
      quotedAmount: 185000,
      validUntil: '2025-10-28',
      transitTime: '2-3 days',
      carrier: 'VRL Logistics',
      status: 'rejected',
      createdDate: '2025-10-12',
      createdBy: 'Amit Patel',
      remarks: 'Customer opted for cheaper alternative',
      includedServices: ['Full truck load', 'GPS tracking', 'Loading/unloading'],
      fuelSurcharge: 18500,
      insuranceCharge: 5550,
      handlingCharge: 9250,
      customsClearance: 0
    },
    {
      id: '4',
      quoteNo: 'FQ-2025-1004',
      customerName: 'Precision Parts Ltd',
      origin: 'Chennai',
      destination: 'Kolkata',
      cargoType: 'Auto Components',
      weight: 18500,
      volume: 52,
      transportMode: 'rail',
      serviceType: 'economy',
      quotedAmount: 125000,
      validUntil: '2025-11-10',
      transitTime: '5-7 days',
      carrier: 'Indian Railways',
      status: 'sent',
      createdDate: '2025-10-20',
      createdBy: 'Suresh Menon',
      remarks: 'Cost-effective rail freight for non-urgent cargo',
      includedServices: ['Rail transport', 'Basic loading', 'Destination delivery'],
      fuelSurcharge: 12500,
      insuranceCharge: 3750,
      handlingCharge: 6250,
      customsClearance: 0
    },
    {
      id: '5',
      quoteNo: 'FQ-2025-1005',
      customerName: 'Eastern Electronics',
      origin: 'Visakhapatnam Port',
      destination: 'Hong Kong Port',
      cargoType: 'Consumer Electronics',
      weight: 22000,
      volume: 68,
      transportMode: 'sea',
      serviceType: 'express',
      quotedAmount: 625000,
      validUntil: '2025-11-08',
      transitTime: '5-7 days',
      carrier: 'COSCO Shipping',
      status: 'draft',
      createdDate: '2025-10-21',
      createdBy: 'Deepak Singh',
      remarks: 'FCL shipment, awaiting final cargo details',
      includedServices: ['Container freight', 'THC charges', 'Full insurance'],
      fuelSurcharge: 62500,
      insuranceCharge: 18750,
      handlingCharge: 31250,
      customsClearance: 0
    },
    {
      id: '6',
      quoteNo: 'FQ-2025-1006',
      customerName: 'Metro Wholesale',
      origin: 'Hyderabad',
      destination: 'Mumbai',
      cargoType: 'FMCG Products',
      weight: 9500,
      volume: 32,
      transportMode: 'road',
      serviceType: 'standard',
      quotedAmount: 95000,
      validUntil: '2025-11-01',
      transitTime: '3-4 days',
      carrier: 'Gati Ltd',
      status: 'accepted',
      createdDate: '2025-10-16',
      createdBy: 'Vikas Reddy',
      remarks: 'Regular weekly shipment, contract rates applied',
      includedServices: ['Part truck load', 'Standard insurance', 'Tracking'],
      fuelSurcharge: 9500,
      insuranceCharge: 2850,
      handlingCharge: 4750,
      customsClearance: 0
    },
    {
      id: '7',
      quoteNo: 'FQ-2025-1007',
      customerName: 'Coastal Enterprises',
      origin: 'Kochi',
      destination: 'Colombo',
      cargoType: 'Textiles',
      weight: 13500,
      volume: 42,
      transportMode: 'sea',
      serviceType: 'economy',
      quotedAmount: 215000,
      validUntil: '2025-09-15',
      transitTime: '8-12 days',
      carrier: 'Sri Lanka Shipping',
      status: 'expired',
      createdDate: '2025-09-01',
      createdBy: 'Lakshmi Iyer',
      remarks: 'Quote expired, customer did not respond',
      includedServices: ['Sea freight', 'Port charges', 'Basic documentation'],
      fuelSurcharge: 21500,
      insuranceCharge: 6450,
      handlingCharge: 10750,
      customsClearance: 8500
    },
    {
      id: '8',
      quoteNo: 'FQ-2025-1008',
      customerName: 'Northern Distributors',
      origin: 'Delhi Airport',
      destination: 'Frankfurt Airport',
      cargoType: 'Pharmaceuticals',
      weight: 5500,
      volume: 18,
      transportMode: 'air',
      serviceType: 'express',
      quotedAmount: 1250000,
      validUntil: '2025-11-12',
      transitTime: '1-2 days',
      carrier: 'Lufthansa Cargo',
      status: 'sent',
      createdDate: '2025-10-19',
      createdBy: 'Rahul Verma',
      remarks: 'Temperature controlled, GDP compliant handling required',
      includedServices: ['Air freight', 'Cold chain', 'Express customs', 'Priority handling'],
      fuelSurcharge: 125000,
      insuranceCharge: 37500,
      handlingCharge: 62500,
      customsClearance: 45000
    }
  ];

  const quoteStats = {
    total: quotes.length,
    draft: quotes.filter(q => q.status === 'draft').length,
    sent: quotes.filter(q => q.status === 'sent').length,
    accepted: quotes.filter(q => q.status === 'accepted').length,
    rejected: quotes.filter(q => q.status === 'rejected').length,
    expired: quotes.filter(q => q.status === 'expired').length,
    totalValue: quotes.filter(q => q.status === 'accepted').reduce((sum, q) => sum + q.quotedAmount, 0),
    avgQuoteValue: Math.round(quotes.reduce((sum, q) => sum + q.quotedAmount, 0) / quotes.length),
    conversionRate: ((quotes.filter(q => q.status === 'accepted').length / quotes.filter(q => q.status !== 'draft').length) * 100).toFixed(1)
  };

  const filteredQuotes = quotes.filter(quote => {
    const matchesSearch =
      quote.quoteNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.destination.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || quote.status === statusFilter;
    const matchesMode = modeFilter === 'all' || quote.transportMode === modeFilter;

    return matchesSearch && matchesStatus && matchesMode;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'sent': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'accepted': return 'bg-green-100 text-green-700 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-700 border-red-200';
      case 'expired': return 'bg-orange-100 text-orange-700 border-orange-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getModeColor = (mode: string) => {
    switch (mode) {
      case 'air': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'sea': return 'bg-cyan-100 text-cyan-700 border-cyan-200';
      case 'road': return 'bg-green-100 text-green-700 border-green-200';
      case 'rail': return 'bg-purple-100 text-purple-700 border-purple-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getModeIcon = (mode: string) => {
    switch (mode) {
      case 'air': return '';
      case 'sea': return '=¢';
      case 'road': return '=›';
      case 'rail': return '=‚';
      default: return '=æ';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Freight Quotes</h1>
            <p className="text-sm text-gray-500 mt-1">Create and manage freight quotations</p>
          </div>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2">
          <Plus className="w-4 h-4" />
          New Quote
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 mb-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <FileText className="w-7 h-7 opacity-80" />
            <span className="text-2xl font-bold">{quoteStats.total}</span>
          </div>
          <p className="text-xs font-medium opacity-90">Total Quotes</p>
        </div>

        <div className="bg-gradient-to-br from-gray-500 to-gray-600 text-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <FileText className="w-7 h-7 opacity-80" />
            <span className="text-2xl font-bold">{quoteStats.draft}</span>
          </div>
          <p className="text-xs font-medium opacity-90">Draft</p>
        </div>

        <div className="bg-gradient-to-br from-blue-400 to-blue-500 text-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-7 h-7 opacity-80" />
            <span className="text-2xl font-bold">{quoteStats.sent}</span>
          </div>
          <p className="text-xs font-medium opacity-90">Sent</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="w-7 h-7 opacity-80" />
            <span className="text-2xl font-bold">{quoteStats.accepted}</span>
          </div>
          <p className="text-xs font-medium opacity-90">Accepted</p>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-red-600 text-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <XCircle className="w-7 h-7 opacity-80" />
            <span className="text-2xl font-bold">{quoteStats.rejected}</span>
          </div>
          <p className="text-xs font-medium opacity-90">Rejected</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <Calendar className="w-7 h-7 opacity-80" />
            <span className="text-2xl font-bold">{quoteStats.expired}</span>
          </div>
          <p className="text-xs font-medium opacity-90">Expired</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="w-7 h-7 opacity-80" />
            <span className="text-lg font-bold">¹{(quoteStats.totalValue / 1000000).toFixed(1)}M</span>
          </div>
          <p className="text-xs font-medium opacity-90">Total Value</p>
        </div>

        <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-7 h-7 opacity-80" />
            <span className="text-2xl font-bold">{quoteStats.conversionRate}%</span>
          </div>
          <p className="text-xs font-medium opacity-90">Conversion Rate</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex flex-col gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by quote no, customer, origin, or destination..."
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
              <option value="draft">Draft</option>
              <option value="sent">Sent</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
              <option value="expired">Expired</option>
            </select>

            <select
              value={modeFilter}
              onChange={(e) => setModeFilter(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Modes</option>
              <option value="air">Air</option>
              <option value="sea">Sea</option>
              <option value="road">Road</option>
              <option value="rail">Rail</option>
            </select>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Filter className="w-4 h-4" />
            <span>Showing {filteredQuotes.length} of {quoteStats.total} quotes</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredQuotes.map((quote) => (
          <div key={quote.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-bold text-gray-900">{quote.quoteNo}</h3>
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(quote.status)}`}>
                    {quote.status}
                  </span>
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getModeColor(quote.transportMode)}`}>
                    {getModeIcon(quote.transportMode)} {quote.transportMode}
                  </span>
                </div>
                <p className="text-sm font-semibold text-blue-600">{quote.customerName}</p>
                <p className="text-xs text-gray-500 mt-0.5">{quote.cargoType}</p>
              </div>

              <div className="text-right">
                <p className="text-xs text-gray-500 mb-0.5">Quoted Amount</p>
                <p className="text-2xl font-bold text-indigo-600">¹{quote.quotedAmount.toLocaleString()}</p>
                <p className="text-xs text-gray-500 mt-1">Valid until: {quote.validUntil}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
              <div className="bg-blue-50 rounded-lg p-3">
                <div className="flex items-center gap-1 mb-1">
                  <MapPin className="w-3 h-3 text-blue-600" />
                  <p className="text-xs text-blue-600 font-medium">Route</p>
                </div>
                <p className="text-sm font-semibold text-blue-900">{quote.origin}</p>
                <p className="text-xs text-blue-700 my-0.5">’</p>
                <p className="text-sm font-semibold text-blue-900">{quote.destination}</p>
              </div>

              <div className="bg-green-50 rounded-lg p-3">
                <div className="flex items-center gap-1 mb-1">
                  <Package className="w-3 h-3 text-green-600" />
                  <p className="text-xs text-green-600 font-medium">Cargo Details</p>
                </div>
                <p className="text-sm font-semibold text-green-900">{quote.weight.toLocaleString()} kg</p>
                <p className="text-xs text-green-700">{quote.volume} CBM</p>
              </div>

              <div className="bg-purple-50 rounded-lg p-3">
                <div className="flex items-center gap-1 mb-1">
                  <Truck className="w-3 h-3 text-purple-600" />
                  <p className="text-xs text-purple-600 font-medium">Carrier & Service</p>
                </div>
                <p className="text-sm font-semibold text-purple-900">{quote.carrier}</p>
                <p className="text-xs text-purple-700">{quote.serviceType}</p>
              </div>

              <div className="bg-orange-50 rounded-lg p-3">
                <div className="flex items-center gap-1 mb-1">
                  <Clock className="w-3 h-3 text-orange-600" />
                  <p className="text-xs text-orange-600 font-medium">Transit Time</p>
                </div>
                <p className="text-sm font-semibold text-orange-900">{quote.transitTime}</p>
                <p className="text-xs text-orange-700 mt-1">Created: {quote.createdDate}</p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-3 mb-4">
              <p className="text-xs text-gray-500 font-medium mb-2">Cost Breakdown</p>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
                <div>
                  <p className="text-gray-600">Base Rate</p>
                  <p className="font-semibold text-gray-900">¹{(quote.quotedAmount - quote.fuelSurcharge - quote.insuranceCharge - quote.handlingCharge - quote.customsClearance).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-600">Fuel Surcharge</p>
                  <p className="font-semibold text-gray-900">¹{quote.fuelSurcharge.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-600">Insurance</p>
                  <p className="font-semibold text-gray-900">¹{quote.insuranceCharge.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-600">Handling</p>
                  <p className="font-semibold text-gray-900">¹{quote.handlingCharge.toLocaleString()}</p>
                </div>
                {quote.customsClearance > 0 && (
                  <div>
                    <p className="text-gray-600">Customs</p>
                    <p className="font-semibold text-gray-900">¹{quote.customsClearance.toLocaleString()}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="mb-4">
              <p className="text-xs text-gray-500 font-medium mb-2">Included Services</p>
              <div className="flex flex-wrap gap-2">
                {quote.includedServices.map((service, idx) => (
                  <span key={idx} className="inline-flex items-center px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">
                     {service}
                  </span>
                ))}
              </div>
            </div>

            {quote.remarks && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                <p className="text-xs text-yellow-600 font-medium mb-1">Remarks</p>
                <p className="text-sm text-yellow-900">{quote.remarks}</p>
              </div>
            )}

            <div className="flex items-center justify-between pt-3 border-t border-gray-200">
              <p className="text-xs text-gray-500">Created by {quote.createdBy} on {quote.createdDate}</p>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm">
                  View Details
                </button>
                {quote.status === 'draft' && (
                  <button className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 font-medium text-sm">
                    Send Quote
                  </button>
                )}
                {quote.status === 'sent' && (
                  <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium text-sm">
                    Follow Up
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredQuotes.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-lg mb-2">No quotes found</p>
          <p className="text-sm text-gray-400">Try adjusting your search or filter criteria</p>
        </div>
      )}

      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
        <h3 className="text-sm font-semibold text-blue-900 mb-2">Freight Quote Guide:</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-blue-700">
          <div className="flex items-start gap-2">
            <span className="font-medium">Transport Modes:</span>
            <span>Air (fastest), Sea (economical), Road (flexible), Rail (bulk)</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="font-medium">Quote Validity:</span>
            <span>Typical validity period is 7-15 days from issue date</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="font-medium">Cost Components:</span>
            <span>Base rate + fuel surcharge + insurance + handling + customs</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="font-medium">Conversion Rate:</span>
            <span>Percentage of sent quotes that are accepted by customers</span>
          </div>
        </div>
      </div>
    </div>
  );
}

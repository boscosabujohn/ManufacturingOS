'use client';

import React, { useState } from 'react';
import { 
  Calendar, 
  Building, 
  DollarSign,
  AlertCircle,
  Clock,
  TrendingUp,
  Download,
  Filter,
  Search,
  ArrowUpRight,
  ArrowDownRight,
  ChevronDown,
  ChevronRight,
  Eye
} from 'lucide-react';

interface VendorAging {
  vendorId: string;
  vendorName: string;
  totalOutstanding: number;
  current: number;          // 0-30 days
  days31to60: number;       // 31-60 days
  days61to90: number;       // 61-90 days
  over90days: number;       // 90+ days
  creditLimit: number;
  paymentTerms: string;
  lastPayment: string;
  lastPaymentAmount: number;
  contactPerson: string;
  riskRating: 'low' | 'medium' | 'high';
  currency: string;
}

interface AgingSummary {
  totalOutstanding: number;
  current: number;
  days31to60: number;
  days61to90: number;
  over90days: number;
  vendorCount: number;
  highRiskVendors: number;
}

export default function PayablesAgingPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRisk, setSelectedRisk] = useState<string>('all');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('all');
  const [expandedVendor, setExpandedVendor] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Mock data
  const agingSummary: AgingSummary = {
    totalOutstanding: 8750000,
    current: 3500000,
    days31to60: 2800000,
    days61to90: 1450000,
    over90days: 1000000,
    vendorCount: 47,
    highRiskVendors: 8
  };

  const vendorAging: VendorAging[] = [
    {
      vendorId: 'V-001',
      vendorName: 'Tata Steel Ltd',
      totalOutstanding: 1250000,
      current: 450000,
      days31to60: 400000,
      days61to90: 250000,
      over90days: 150000,
      creditLimit: 2000000,
      paymentTerms: 'Net 45',
      lastPayment: '2024-02-15',
      lastPaymentAmount: 380000,
      contactPerson: 'Rajesh Kumar',
      riskRating: 'medium',
      currency: '₹'
    },
    {
      vendorId: 'V-002',
      vendorName: 'JSW Steel',
      totalOutstanding: 980000,
      current: 600000,
      days31to60: 280000,
      days61to90: 100000,
      over90days: 0,
      creditLimit: 1500000,
      paymentTerms: 'Net 30',
      lastPayment: '2024-03-01',
      lastPaymentAmount: 520000,
      contactPerson: 'Amit Sharma',
      riskRating: 'low',
      currency: '₹'
    },
    {
      vendorId: 'V-003',
      vendorName: 'Hindalco Industries',
      totalOutstanding: 1450000,
      current: 350000,
      days31to60: 400000,
      days61to90: 350000,
      over90days: 350000,
      creditLimit: 2500000,
      paymentTerms: 'Net 60',
      lastPayment: '2024-01-28',
      lastPaymentAmount: 425000,
      contactPerson: 'Priya Patel',
      riskRating: 'high',
      currency: '₹'
    },
    {
      vendorId: 'V-004',
      vendorName: 'L&T Construction',
      totalOutstanding: 2100000,
      current: 850000,
      days31to60: 650000,
      days61to90: 400000,
      over90days: 200000,
      creditLimit: 3000000,
      paymentTerms: 'Net 45',
      lastPayment: '2024-02-20',
      lastPaymentAmount: 680000,
      contactPerson: 'Suresh Reddy',
      riskRating: 'medium',
      currency: '₹'
    },
    {
      vendorId: 'V-005',
      vendorName: 'Siemens India',
      totalOutstanding: 760000,
      current: 560000,
      days31to60: 200000,
      days61to90: 0,
      over90days: 0,
      creditLimit: 1200000,
      paymentTerms: 'Net 30',
      lastPayment: '2024-03-05',
      lastPaymentAmount: 340000,
      contactPerson: 'Michael Schmidt',
      riskRating: 'low',
      currency: '₹'
    },
    {
      vendorId: 'V-006',
      vendorName: 'ABB India Ltd',
      totalOutstanding: 1320000,
      current: 420000,
      days31to60: 500000,
      days61to90: 250000,
      over90days: 150000,
      creditLimit: 1800000,
      paymentTerms: 'Net 45',
      lastPayment: '2024-02-10',
      lastPaymentAmount: 460000,
      contactPerson: 'Lars Andersson',
      riskRating: 'medium',
      currency: '₹'
    },
    {
      vendorId: 'V-007',
      vendorName: 'Schneider Electric',
      totalOutstanding: 890000,
      current: 270000,
      days31to60: 370000,
      days61to90: 100000,
      over90days: 150000,
      creditLimit: 1500000,
      paymentTerms: 'Net 60',
      lastPayment: '2024-01-18',
      lastPaymentAmount: 390000,
      contactPerson: 'Jean Dupont',
      riskRating: 'high',
      currency: '₹'
    }
  ];

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const filteredVendors = vendorAging.filter(vendor => {
    const matchesSearch = vendor.vendorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         vendor.vendorId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRisk = selectedRisk === 'all' || vendor.riskRating === selectedRisk;
    const matchesPeriod = selectedPeriod === 'all' ||
      (selectedPeriod === 'current' && vendor.current > 0) ||
      (selectedPeriod === '31-60' && vendor.days31to60 > 0) ||
      (selectedPeriod === '61-90' && vendor.days61to90 > 0) ||
      (selectedPeriod === '90+' && vendor.over90days > 0);
    
    return matchesSearch && matchesRisk && matchesPeriod;
  });

  const calculatePercentage = (amount: number, total: number) => {
    return total > 0 ? ((amount / total) * 100).toFixed(1) : '0.0';
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 max-w-7xl">
          {/* Header with Action Buttons */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-6 w-6 text-blue-600" />
                <h1 className="text-2xl font-bold text-gray-900">Accounts Payable Aging</h1>
              </div>
              <p className="text-sm text-gray-600">Track outstanding payables by aging period</p>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
                  showFilters ? 'bg-blue-50 border-blue-300 text-blue-700' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Filter className="h-4 w-4" />
                <span>Filters</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Download className="h-4 w-4" />
                <span>Export Report</span>
              </button>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-gray-600">Total Outstanding</p>
                <DollarSign className="h-5 w-5 text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">₹{(agingSummary.totalOutstanding / 1000).toFixed(0)}K</p>
              <p className="text-xs text-gray-500 mt-1">{agingSummary.vendorCount} vendors</p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-green-700">Current (0-30)</p>
                <ArrowDownRight className="h-5 w-5 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-green-900">₹{(agingSummary.current / 1000).toFixed(0)}K</p>
              <p className="text-xs text-green-600 mt-1">{calculatePercentage(agingSummary.current, agingSummary.totalOutstanding)}% of total</p>
            </div>

            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4 border border-yellow-200">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-yellow-700">31-90 Days</p>
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
              <p className="text-2xl font-bold text-yellow-900">₹{((agingSummary.days31to60 + agingSummary.days61to90) / 1000).toFixed(0)}K</p>
              <p className="text-xs text-yellow-600 mt-1">{calculatePercentage(agingSummary.days31to60 + agingSummary.days61to90, agingSummary.totalOutstanding)}% of total</p>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4 border border-red-200">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-red-700">90+ Days</p>
                <AlertCircle className="h-5 w-5 text-red-600" />
              </div>
              <p className="text-2xl font-bold text-red-900">₹{(agingSummary.over90days / 1000).toFixed(0)}K</p>
              <p className="text-xs text-red-600 mt-1">{agingSummary.highRiskVendors} high-risk vendors</p>
            </div>
          </div>

          {/* Aging Distribution Chart */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Aging Distribution</h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Current (0-30 days)</span>
                  <span className="font-medium text-gray-900">₹{(agingSummary.current / 1000).toFixed(0)}K ({calculatePercentage(agingSummary.current, agingSummary.totalOutstanding)}%)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all"
                    style={{ width: `${calculatePercentage(agingSummary.current, agingSummary.totalOutstanding)}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">31-60 days</span>
                  <span className="font-medium text-gray-900">₹{(agingSummary.days31to60 / 1000).toFixed(0)}K ({calculatePercentage(agingSummary.days31to60, agingSummary.totalOutstanding)}%)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all"
                    style={{ width: `${calculatePercentage(agingSummary.days31to60, agingSummary.totalOutstanding)}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">61-90 days</span>
                  <span className="font-medium text-gray-900">₹{(agingSummary.days61to90 / 1000).toFixed(0)}K ({calculatePercentage(agingSummary.days61to90, agingSummary.totalOutstanding)}%)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-yellow-500 h-2 rounded-full transition-all"
                    style={{ width: `${calculatePercentage(agingSummary.days61to90, agingSummary.totalOutstanding)}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Over 90 days</span>
                  <span className="font-medium text-gray-900">₹{(agingSummary.over90days / 1000).toFixed(0)}K ({calculatePercentage(agingSummary.over90days, agingSummary.totalOutstanding)}%)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-red-500 h-2 rounded-full transition-all"
                    style={{ width: `${calculatePercentage(agingSummary.over90days, agingSummary.totalOutstanding)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search vendors..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <select
                  value={selectedRisk}
                  onChange={(e) => setSelectedRisk(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Risk Levels</option>
                  <option value="low">Low Risk</option>
                  <option value="medium">Medium Risk</option>
                  <option value="high">High Risk</option>
                </select>

                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Periods</option>
                  <option value="current">Current (0-30)</option>
                  <option value="31-60">31-60 Days</option>
                  <option value="61-90">61-90 Days</option>
                  <option value="90+">Over 90 Days</option>
                </select>
              </div>
            </div>
          )}

          {/* Vendor Aging Table */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Vendor
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Outstanding
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Current
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      31-60 Days
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      61-90 Days
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      90+ Days
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Risk
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredVendors.map((vendor) => (
                    <React.Fragment key={vendor.vendorId}>
                      <tr className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <button
                              onClick={() => setExpandedVendor(expandedVendor === vendor.vendorId ? null : vendor.vendorId)}
                              className="mr-2"
                            >
                              {expandedVendor === vendor.vendorId ? (
                                <ChevronDown className="h-4 w-4 text-gray-400" />
                              ) : (
                                <ChevronRight className="h-4 w-4 text-gray-400" />
                              )}
                            </button>
                            <div>
                              <div className="text-sm font-medium text-gray-900">{vendor.vendorName}</div>
                              <div className="text-xs text-gray-500">{vendor.vendorId}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="text-sm font-semibold text-gray-900">
                            {vendor.currency}{(vendor.totalOutstanding / 1000).toFixed(0)}K
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="text-sm text-green-600 font-medium">
                            {vendor.current > 0 ? `${vendor.currency}${(vendor.current / 1000).toFixed(0)}K` : '-'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="text-sm text-blue-600 font-medium">
                            {vendor.days31to60 > 0 ? `${vendor.currency}${(vendor.days31to60 / 1000).toFixed(0)}K` : '-'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="text-sm text-yellow-600 font-medium">
                            {vendor.days61to90 > 0 ? `${vendor.currency}${(vendor.days61to90 / 1000).toFixed(0)}K` : '-'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="text-sm text-red-600 font-medium">
                            {vendor.over90days > 0 ? `${vendor.currency}${(vendor.over90days / 1000).toFixed(0)}K` : '-'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRiskColor(vendor.riskRating)}`}>
                            {vendor.riskRating.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <button className="text-blue-600 hover:text-blue-800">
                            <Eye className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                      {expandedVendor === vendor.vendorId && (
                        <tr className="bg-gray-50">
                          <td colSpan={8} className="px-6 py-4">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <p className="text-gray-500 mb-1">Payment Terms</p>
                                <p className="font-medium text-gray-900">{vendor.paymentTerms}</p>
                              </div>
                              <div>
                                <p className="text-gray-500 mb-1">Credit Limit</p>
                                <p className="font-medium text-gray-900">{vendor.currency}{(vendor.creditLimit / 1000).toFixed(0)}K</p>
                              </div>
                              <div>
                                <p className="text-gray-500 mb-1">Last Payment</p>
                                <p className="font-medium text-gray-900">{vendor.lastPayment}</p>
                                <p className="text-xs text-gray-500">{vendor.currency}{(vendor.lastPaymentAmount / 1000).toFixed(0)}K</p>
                              </div>
                              <div>
                                <p className="text-gray-500 mb-1">Contact Person</p>
                                <p className="font-medium text-gray-900">{vendor.contactPerson}</p>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

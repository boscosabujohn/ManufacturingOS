'use client';

import { useState, useMemo } from 'react';
import { FileText, Calendar, AlertCircle, CheckCircle, Building } from 'lucide-react';

interface AMCContract {
  id: string;
  contractId: string;
  assetCategory: 'laptop' | 'desktop' | 'mobile' | 'printer' | 'server' | 'network' | 'other';
  vendor: string;
  vendorContact: string;
  startDate: string;
  endDate: string;
  duration: number;
  numberOfAssets: number;
  contractValue: number;
  paymentTerms: 'monthly' | 'quarterly' | 'half_yearly' | 'annual';
  coverage: string[];
  responseTime: string;
  status: 'active' | 'expiring_soon' | 'expired' | 'pending_renewal';
  renewalDate?: string;
  location: string;
  contactPerson: string;
  remarks?: string;
}

export default function Page() {
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const mockContracts: AMCContract[] = [
    {
      id: '1',
      contractId: 'AMC-2024-001',
      assetCategory: 'laptop',
      vendor: 'Dell India Support Services',
      vendorContact: '+91-80-2678-9999',
      startDate: '2024-01-01',
      endDate: '2025-12-31',
      duration: 24,
      numberOfAssets: 150,
      contractValue: 450000,
      paymentTerms: 'quarterly',
      coverage: ['Hardware Repair', 'Preventive Maintenance', 'On-site Support'],
      responseTime: '4 hours',
      status: 'active',
      location: 'All India',
      contactPerson: 'Ramesh Kumar',
      remarks: 'Comprehensive support for all Dell laptops'
    },
    {
      id: '2',
      contractId: 'AMC-2024-002',
      assetCategory: 'desktop',
      vendor: 'HP India Service Center',
      vendorContact: '+91-124-460-8888',
      startDate: '2024-03-01',
      endDate: '2025-02-28',
      duration: 12,
      numberOfAssets: 80,
      contractValue: 192000,
      paymentTerms: 'quarterly',
      coverage: ['Hardware Repair', 'Parts Replacement', 'Remote Support'],
      responseTime: '8 hours',
      status: 'active',
      location: 'Mumbai, Pune, Delhi',
      contactPerson: 'Sneha Reddy'
    },
    {
      id: '3',
      contractId: 'AMC-2023-045',
      assetCategory: 'printer',
      vendor: 'Canon India Services',
      vendorContact: '+91-124-488-5000',
      startDate: '2023-06-01',
      endDate: '2025-05-31',
      duration: 24,
      numberOfAssets: 45,
      contractValue: 270000,
      paymentTerms: 'half_yearly',
      coverage: ['Maintenance', 'Parts Replacement', 'Toner Support', 'On-site'],
      responseTime: '24 hours',
      status: 'expiring_soon',
      renewalDate: '2025-04-01',
      location: 'Bangalore, Hyderabad',
      contactPerson: 'Vikram Singh'
    },
    {
      id: '4',
      contractId: 'AMC-2023-012',
      assetCategory: 'server',
      vendor: 'Lenovo Data Center Services',
      vendorContact: '+91-80-4933-5000',
      startDate: '2023-01-15',
      endDate: '2024-01-14',
      duration: 12,
      numberOfAssets: 12,
      contractValue: 600000,
      paymentTerms: 'annual',
      coverage: ['24x7 Support', 'Critical Hardware Replacement', 'Preventive Maintenance'],
      responseTime: '2 hours',
      status: 'expired',
      location: 'Mumbai Data Center',
      contactPerson: 'Arjun Kapoor',
      remarks: 'Renewal pending approval'
    },
    {
      id: '5',
      contractId: 'AMC-2024-003',
      assetCategory: 'network',
      vendor: 'Cisco India Support',
      vendorContact: '+91-80-6773-0000',
      startDate: '2024-02-01',
      endDate: '2027-01-31',
      duration: 36,
      numberOfAssets: 200,
      contractValue: 1800000,
      paymentTerms: 'annual',
      coverage: ['24x7 Network Support', 'Firmware Updates', 'Hardware Replacement', 'TAC Support'],
      responseTime: '1 hour',
      status: 'active',
      location: 'All Offices',
      contactPerson: 'Priya Sharma'
    }
  ];

  const filteredContracts = mockContracts.filter(c => {
    if (selectedStatus !== 'all' && c.status !== selectedStatus) return false;
    if (selectedCategory !== 'all' && c.assetCategory !== selectedCategory) return false;
    return true;
  });

  const stats = useMemo(() => ({
    total: mockContracts.length,
    active: mockContracts.filter(c => c.status === 'active').length,
    expiring: mockContracts.filter(c => c.status === 'expiring_soon').length,
    expired: mockContracts.filter(c => c.status === 'expired').length,
    totalValue: mockContracts.filter(c => c.status === 'active' || c.status === 'expiring_soon').reduce((sum, c) => sum + c.contractValue, 0)
  }), [mockContracts]);

  const statusColors = {
    active: 'bg-green-100 text-green-700',
    expiring_soon: 'bg-yellow-100 text-yellow-700',
    expired: 'bg-red-100 text-red-700',
    pending_renewal: 'bg-orange-100 text-orange-700'
  };

  const categoryColors = {
    laptop: 'bg-blue-100 text-blue-700',
    desktop: 'bg-purple-100 text-purple-700',
    mobile: 'bg-green-100 text-green-700',
    printer: 'bg-orange-100 text-orange-700',
    server: 'bg-red-100 text-red-700',
    network: 'bg-indigo-100 text-indigo-700',
    other: 'bg-gray-100 text-gray-700'
  };

  const paymentTermsLabel = {
    monthly: 'Monthly',
    quarterly: 'Quarterly',
    half_yearly: 'Half-Yearly',
    annual: 'Annual'
  };

  const getDaysUntilExpiry = (endDate: string) => {
    const today = new Date();
    const expiry = new Date(endDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="w-full h-full px-3 py-2">
      <div className="mb-3">
        <h1 className="text-2xl font-bold text-gray-900">AMC Management</h1>
        <p className="text-sm text-gray-600 mt-1">Manage Annual Maintenance Contracts for assets</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-2 mb-3">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-3 border border-blue-200">
          <p className="text-sm font-medium text-blue-600">Total Contracts</p>
          <p className="text-2xl font-bold text-blue-900 mt-1">{stats.total}</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-3 border border-green-200">
          <p className="text-sm font-medium text-green-600">Active</p>
          <p className="text-2xl font-bold text-green-900 mt-1">{stats.active}</p>
        </div>
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-3 border border-yellow-200">
          <p className="text-sm font-medium text-yellow-600">Expiring Soon</p>
          <p className="text-2xl font-bold text-yellow-900 mt-1">{stats.expiring}</p>
        </div>
        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-3 border border-red-200">
          <p className="text-sm font-medium text-red-600">Expired</p>
          <p className="text-2xl font-bold text-red-900 mt-1">{stats.expired}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-3 border border-purple-200">
          <p className="text-sm font-medium text-purple-600">Total Value</p>
          <p className="text-2xl font-bold text-purple-900 mt-1">₹{(stats.totalValue / 100000).toFixed(2)}L</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 mb-3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="expiring_soon">Expiring Soon</option>
              <option value="expired">Expired</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Asset Category</label>
            <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="all">All Categories</option>
              <option value="laptop">Laptop</option>
              <option value="desktop">Desktop</option>
              <option value="mobile">Mobile</option>
              <option value="printer">Printer</option>
              <option value="server">Server</option>
              <option value="network">Network</option>
            </select>
          </div>
          <div className="flex items-end">
            <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm">
              Add Contract
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {filteredContracts.map(contract => {
          const daysLeft = getDaysUntilExpiry(contract.endDate);
          return (
            <div key={contract.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-3">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-12 w-12 bg-blue-50 rounded-lg flex items-center justify-center">
                      <FileText className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{contract.vendor}</h3>
                      <p className="text-sm text-gray-600">Contract ID: {contract.contractId} • {contract.vendorContact}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 text-xs font-semibold rounded ${categoryColors[contract.assetCategory]}`}>
                      {contract.assetCategory.charAt(0).toUpperCase() + contract.assetCategory.slice(1)}
                    </span>
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusColors[contract.status]}`}>
                      {contract.status === 'expiring_soon' ? 'Expiring Soon' : contract.status === 'pending_renewal' ? 'Pending Renewal' : contract.status.charAt(0).toUpperCase() + contract.status.slice(1)}
                    </span>
                    {contract.status === 'active' && daysLeft <= 90 && (
                      <span className="px-2 py-1 text-xs font-semibold rounded bg-yellow-50 text-yellow-700 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {daysLeft} days left
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500 uppercase font-medium mb-1">Contract Value</p>
                  <p className="text-2xl font-bold text-blue-600">₹{contract.contractValue.toLocaleString('en-IN')}</p>
                  <p className="text-xs text-gray-600 mt-1">{paymentTermsLabel[contract.paymentTerms]}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-2 py-4 border-y border-gray-200">
                <div>
                  <p className="text-xs text-gray-500 uppercase font-medium mb-1">Duration</p>
                  <p className="text-sm font-semibold text-gray-900">{contract.duration} months</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-medium mb-1">Assets Covered</p>
                  <p className="text-sm font-semibold text-gray-900">{contract.numberOfAssets}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-medium mb-1">Response Time</p>
                  <p className="text-sm font-semibold text-gray-900">{contract.responseTime}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-medium mb-1">Location</p>
                  <p className="text-sm font-semibold text-gray-900">{contract.location}</p>
                </div>
              </div>

              <div className="mb-2">
                <p className="text-xs text-gray-500 uppercase font-medium mb-2">Coverage</p>
                <div className="flex flex-wrap gap-2">
                  {contract.coverage.map((item, idx) => (
                    <span key={idx} className="flex items-center gap-1 px-3 py-1 bg-green-50 text-green-700 text-xs rounded-full border border-green-200">
                      <CheckCircle className="h-3 w-3" />
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2 py-4 border-t border-gray-200">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-xs text-gray-500">Start Date</p>
                    <p className="text-sm font-semibold text-gray-900">{new Date(contract.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                  </div>
                  <span className="text-gray-400 mx-2">→</span>
                  <div>
                    <p className="text-xs text-gray-500">End Date</p>
                    <p className="text-sm font-semibold text-gray-900">{new Date(contract.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-xs text-gray-500">Contact Person</p>
                    <p className="text-sm font-semibold text-gray-900">{contract.contactPerson}</p>
                  </div>
                </div>
              </div>

              {contract.remarks && (
                <div className="bg-gray-50 rounded-lg p-3 mb-2">
                  <p className="text-xs text-gray-500 uppercase font-medium mb-1">Remarks</p>
                  <p className="text-sm text-gray-700">{contract.remarks}</p>
                </div>
              )}

              <div className="flex gap-2">
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium text-sm">
                  View Details
                </button>
                {(contract.status === 'expiring_soon' || contract.status === 'expired') && (
                  <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-medium text-sm">
                    Renew Contract
                  </button>
                )}
                {contract.status === 'active' && (
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm">
                    Edit Contract
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

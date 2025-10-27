'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Search, Eye, Edit, Trash2, FileText, RefreshCw, AlertCircle, CheckCircle, Clock, XCircle, Download, Filter, Calendar, DollarSign, TrendingUp } from 'lucide-react';

interface ServiceContract {
  id: string;
  contractNumber: string;
  contractType: 'AMC' | 'CMC' | 'Pay Per Visit' | 'Parts & Labor' | 'Extended Warranty';
  customerId: string;
  customerName: string;
  status: 'draft' | 'active' | 'expired' | 'renewed' | 'terminated' | 'suspended';
  startDate: string;
  endDate: string;
  duration: number; // in months
  pricingTier: 'Basic' | 'Standard' | 'Premium' | 'Enterprise';
  contractValue: number;
  responseTimeSLA: number; // in hours
  resolutionTimeSLA: number; // in hours
  renewalCount: number;
  totalBilled: number;
  totalPaid: number;
  outstandingAmount: number;
  equipmentCount: number;
  accountManager: string;
  billingFrequency: 'monthly' | 'quarterly' | 'half_yearly' | 'annual';
  autoRenewal: boolean;
}

const mockContracts: ServiceContract[] = [
  {
    id: '1',
    contractNumber: 'AMC-2025-0001',
    contractType: 'AMC',
    customerId: 'CUST001',
    customerName: 'Sharma Modular Kitchens Pvt Ltd',
    status: 'active',
    startDate: '2025-01-01',
    endDate: '2025-12-31',
    duration: 12,
    pricingTier: 'Premium',
    contractValue: 450000,
    responseTimeSLA: 4,
    resolutionTimeSLA: 24,
    renewalCount: 2,
    totalBilled: 225000,
    totalPaid: 225000,
    outstandingAmount: 0,
    equipmentCount: 45,
    accountManager: 'Priya Patel',
    billingFrequency: 'quarterly',
    autoRenewal: true,
  },
  {
    id: '2',
    contractNumber: 'CMC-2025-0012',
    contractType: 'CMC',
    customerId: 'CUST002',
    customerName: 'Prestige Developers Bangalore',
    status: 'active',
    startDate: '2025-03-15',
    endDate: '2026-03-14',
    duration: 12,
    pricingTier: 'Enterprise',
    contractValue: 1250000,
    responseTimeSLA: 2,
    resolutionTimeSLA: 6,
    renewalCount: 0,
    totalBilled: 625000,
    totalPaid: 625000,
    outstandingAmount: 0,
    equipmentCount: 120,
    accountManager: 'Amit Kumar',
    billingFrequency: 'half_yearly',
    autoRenewal: true,
  },
  {
    id: '3',
    contractNumber: 'AMC-2025-0035',
    contractType: 'AMC',
    customerId: 'CUST003',
    customerName: 'Urban Interiors & Designers',
    status: 'active',
    startDate: '2025-06-01',
    endDate: '2026-05-31',
    duration: 12,
    pricingTier: 'Standard',
    contractValue: 280000,
    responseTimeSLA: 8,
    resolutionTimeSLA: 48,
    renewalCount: 1,
    totalBilled: 93333,
    totalPaid: 93333,
    outstandingAmount: 0,
    equipmentCount: 28,
    accountManager: 'Rahul Verma',
    billingFrequency: 'quarterly',
    autoRenewal: false,
  },
  {
    id: '4',
    contractNumber: 'AMC-2024-0234',
    contractType: 'AMC',
    customerId: 'CUST004',
    customerName: 'Elite Contractors & Builders',
    status: 'expired',
    startDate: '2024-08-01',
    endDate: '2025-07-31',
    duration: 12,
    pricingTier: 'Basic',
    contractValue: 180000,
    responseTimeSLA: 24,
    resolutionTimeSLA: 72,
    renewalCount: 0,
    totalBilled: 180000,
    totalPaid: 160000,
    outstandingAmount: 20000,
    equipmentCount: 18,
    accountManager: 'Sanjay Gupta',
    billingFrequency: 'annual',
    autoRenewal: false,
  },
  {
    id: '5',
    contractNumber: 'CMC-2025-0045',
    contractType: 'CMC',
    customerId: 'CUST005',
    customerName: 'DLF Universal Projects',
    status: 'active',
    startDate: '2025-04-01',
    endDate: '2026-03-31',
    duration: 12,
    pricingTier: 'Premium',
    contractValue: 850000,
    responseTimeSLA: 4,
    resolutionTimeSLA: 12,
    renewalCount: 3,
    totalBilled: 425000,
    totalPaid: 425000,
    outstandingAmount: 0,
    equipmentCount: 85,
    accountManager: 'Priya Patel',
    billingFrequency: 'half_yearly',
    autoRenewal: true,
  },
  {
    id: '6',
    contractNumber: 'AMC-2025-0078',
    contractType: 'Extended Warranty',
    customerId: 'CUST006',
    customerName: 'Signature Interiors Pune',
    status: 'suspended',
    startDate: '2025-02-15',
    endDate: '2026-02-14',
    duration: 12,
    pricingTier: 'Standard',
    contractValue: 320000,
    responseTimeSLA: 8,
    resolutionTimeSLA: 24,
    renewalCount: 0,
    totalBilled: 160000,
    totalPaid: 80000,
    outstandingAmount: 80000,
    equipmentCount: 32,
    accountManager: 'Amit Kumar',
    billingFrequency: 'half_yearly',
    autoRenewal: false,
  },
  {
    id: '7',
    contractNumber: 'AMC-2025-0103',
    contractType: 'AMC',
    customerId: 'CUST007',
    customerName: 'Royal Homes Hyderabad',
    status: 'draft',
    startDate: '2025-11-01',
    endDate: '2026-10-31',
    duration: 12,
    pricingTier: 'Premium',
    contractValue: 720000,
    responseTimeSLA: 4,
    resolutionTimeSLA: 24,
    renewalCount: 0,
    totalBilled: 0,
    totalPaid: 0,
    outstandingAmount: 0,
    equipmentCount: 68,
    accountManager: 'Rahul Verma',
    billingFrequency: 'quarterly',
    autoRenewal: true,
  },
  {
    id: '8',
    contractNumber: 'CMC-2025-0089',
    contractType: 'CMC',
    customerId: 'CUST008',
    customerName: 'Modern Living Ahmedabad',
    status: 'active',
    startDate: '2025-05-01',
    endDate: '2026-04-30',
    duration: 12,
    pricingTier: 'Enterprise',
    contractValue: 950000,
    responseTimeSLA: 2,
    resolutionTimeSLA: 8,
    renewalCount: 1,
    totalBilled: 475000,
    totalPaid: 475000,
    outstandingAmount: 0,
    equipmentCount: 95,
    accountManager: 'Priya Patel',
    billingFrequency: 'half_yearly',
    autoRenewal: true,
  },
];

const statusColors = {
  draft: 'bg-gray-100 text-gray-700',
  active: 'bg-green-100 text-green-700',
  expired: 'bg-red-100 text-red-700',
  renewed: 'bg-blue-100 text-blue-700',
  terminated: 'bg-orange-100 text-orange-700',
  suspended: 'bg-yellow-100 text-yellow-700',
};

const statusIcons = {
  draft: Clock,
  active: CheckCircle,
  expired: XCircle,
  renewed: RefreshCw,
  terminated: AlertCircle,
  suspended: AlertCircle,
};

const contractTypeColors = {
  'AMC': 'bg-blue-100 text-blue-700',
  'CMC': 'bg-purple-100 text-purple-700',
  'Pay Per Visit': 'bg-orange-100 text-orange-700',
  'Parts & Labor': 'bg-cyan-100 text-cyan-700',
  'Extended Warranty': 'bg-emerald-100 text-emerald-700',
};

const pricingTierColors = {
  'Basic': 'bg-gray-100 text-gray-700',
  'Standard': 'bg-blue-100 text-blue-700',
  'Premium': 'bg-purple-100 text-purple-700',
  'Enterprise': 'bg-orange-100 text-orange-700',
};

export default function ServiceContractsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter contracts
  const filteredContracts = mockContracts.filter((contract) => {
    const matchesSearch =
      contract.contractNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || contract.status === statusFilter;
    const matchesType = typeFilter === 'all' || contract.contractType === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  // Pagination
  const totalPages = Math.ceil(filteredContracts.length / itemsPerPage);
  const paginatedContracts = filteredContracts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Calculate statistics
  const stats = {
    totalContracts: mockContracts.length,
    activeContracts: mockContracts.filter(c => c.status === 'active').length,
    expiringIn30Days: mockContracts.filter(c => {
      const daysUntilExpiry = Math.ceil((new Date(c.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
      return c.status === 'active' && daysUntilExpiry <= 30 && daysUntilExpiry > 0;
    }).length,
    totalActiveValue: mockContracts
      .filter(c => c.status === 'active')
      .reduce((sum, c) => sum + c.contractValue, 0),
    totalOutstanding: mockContracts.reduce((sum, c) => sum + c.outstandingAmount, 0),
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getExpiryStatus = (endDate: string) => {
    const daysUntilExpiry = Math.ceil((new Date(endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    if (daysUntilExpiry < 0) return <span className="text-red-600 text-sm">Expired</span>;
    if (daysUntilExpiry <= 30) return <span className="text-orange-600 text-sm font-medium">Expires in {daysUntilExpiry} days</span>;
    return <span className="text-gray-600 text-sm">{daysUntilExpiry} days remaining</span>;
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Service Contracts</h1>
        <p className="text-gray-600">Manage AMC, CMC, and service agreements</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Contracts</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalContracts}</p>
            </div>
            <FileText className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Contracts</p>
              <p className="text-2xl font-bold text-green-600">{stats.activeContracts}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Expiring Soon</p>
              <p className="text-2xl font-bold text-orange-600">{stats.expiringIn30Days}</p>
            </div>
            <AlertCircle className="h-8 w-8 text-orange-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Value</p>
              <p className="text-xl font-bold text-purple-600">{formatCurrency(stats.totalActiveValue)}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Outstanding</p>
              <p className="text-xl font-bold text-red-600">{formatCurrency(stats.totalOutstanding)}</p>
            </div>
            <DollarSign className="h-8 w-8 text-red-600" />
          </div>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex-1 flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search by contract number or customer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="active">Active</option>
              <option value="expired">Expired</option>
              <option value="renewed">Renewed</option>
              <option value="terminated">Terminated</option>
              <option value="suspended">Suspended</option>
            </select>

            {/* Type Filter */}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              <option value="all">All Types</option>
              <option value="AMC">AMC</option>
              <option value="CMC">CMC</option>
              <option value="Pay Per Visit">Pay Per Visit</option>
              <option value="Parts & Labor">Parts & Labor</option>
              <option value="Extended Warranty">Extended Warranty</option>
            </select>
          </div>

          <div className="flex gap-2">
            <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export
            </button>
            <button
              onClick={() => router.push('/after-sales-service/service-contracts/add')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              New Contract
            </button>
          </div>
        </div>
      </div>

      {/* Contracts Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contract Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type & Tier
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Duration
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  SLA
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Value & Payment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Account Manager
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedContracts.map((contract) => {
                const StatusIcon = statusIcons[contract.status];
                return (
                  <tr key={contract.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-900">{contract.contractNumber}</span>
                        <span className="text-sm text-gray-600">{contract.customerName}</span>
                        <span className="text-xs text-gray-500">{contract.equipmentCount} equipment(s)</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${contractTypeColors[contract.contractType]}`}>
                          {contract.contractType}
                        </span>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${pricingTierColors[contract.pricingTier]}`}>
                          {contract.pricingTier}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusColors[contract.status]}`}>
                        <StatusIcon className="h-3 w-3" />
                        {contract.status.charAt(0).toUpperCase() + contract.status.slice(1)}
                      </span>
                      {contract.autoRenewal && (
                        <div className="mt-1">
                          <span className="text-xs text-green-600 flex items-center gap-1">
                            <RefreshCw className="h-3 w-3" /> Auto-renewal
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col text-sm">
                        <span className="text-gray-900">{contract.duration} months</span>
                        <span className="text-xs text-gray-600">
                          {new Date(contract.startDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </span>
                        <span className="text-xs text-gray-600">
                          to {new Date(contract.endDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </span>
                        {contract.status === 'active' && (
                          <div className="mt-1">{getExpiryStatus(contract.endDate)}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col text-xs text-gray-600">
                        <span>Response: {contract.responseTimeSLA}h</span>
                        <span>Resolution: {contract.resolutionTimeSLA}h</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-900">{formatCurrency(contract.contractValue)}</span>
                        <span className="text-xs text-gray-600">Billed: {formatCurrency(contract.totalBilled)}</span>
                        <span className="text-xs text-gray-600">Paid: {formatCurrency(contract.totalPaid)}</span>
                        {contract.outstandingAmount > 0 && (
                          <span className="text-xs text-red-600 font-medium">Due: {formatCurrency(contract.outstandingAmount)}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-900">{contract.accountManager}</span>
                      <div className="text-xs text-gray-500">Renewals: {contract.renewalCount}</div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => router.push(`/after-sales-service/service-contracts/view/${contract.id}`)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                         
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => router.push(`/after-sales-service/service-contracts/edit/${contract.id}`)}
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                         
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        {contract.status === 'active' && (
                          <button
                            onClick={() => router.push(`/after-sales-service/service-contracts/renew/${contract.id}`)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                           
                          >
                            <RefreshCw className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                         
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredContracts.length)} of {filteredContracts.length} contracts
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

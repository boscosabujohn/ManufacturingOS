'use client';

import { useState } from 'react';
import { Plus, Search, Eye, Edit, Download, FileText, DollarSign, Calendar, AlertCircle, CheckCircle, Clock, TrendingUp, User, Building2, RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Contract {
  id: string;
  contractNumber: string;
  title: string;
  customer: string;
  customerCompany: string;
  type: 'service' | 'subscription' | 'license' | 'support' | 'maintenance' | 'custom';
  status: 'draft' | 'active' | 'pending_renewal' | 'expired' | 'terminated' | 'suspended';
  value: number;
  recurringValue?: number;
  billingCycle?: 'monthly' | 'quarterly' | 'annually' | 'one-time';
  startDate: string;
  endDate: string;
  signedDate?: string;
  autoRenew: boolean;
  renewalNoticeDays: number;
  paymentTerms: string;
  assignedTo: string;
  tags: string[];
  attachments: number;
  lastInvoiceDate?: string;
  nextInvoiceDate?: string;
  totalInvoiced: number;
  outstandingAmount: number;
  createdDate: string;
}

const mockContracts: Contract[] = [
  {
    id: '1',
    contractNumber: 'CNT-2024-001',
    title: 'Enterprise Software License Agreement',
    customer: 'John Smith',
    customerCompany: 'Acme Corporation',
    type: 'license',
    status: 'active',
    value: 450000,
    recurringValue: 90000,
    billingCycle: 'annually',
    startDate: '2024-01-01',
    endDate: '2026-12-31',
    signedDate: '2023-12-15',
    autoRenew: true,
    renewalNoticeDays: 90,
    paymentTerms: 'Net 30',
    assignedTo: 'Sarah Johnson',
    tags: ['Enterprise', 'Software', 'Multi-Year'],
    attachments: 8,
    lastInvoiceDate: '2024-01-01',
    nextInvoiceDate: '2025-01-01',
    totalInvoiced: 90000,
    outstandingAmount: 0,
    createdDate: '2023-11-20',
  },
  {
    id: '2',
    contractNumber: 'CNT-2024-002',
    title: 'Cloud Infrastructure Services',
    customer: 'Emily Davis',
    customerCompany: 'TechStart Inc',
    type: 'service',
    status: 'active',
    value: 36000,
    recurringValue: 3000,
    billingCycle: 'monthly',
    startDate: '2024-03-01',
    endDate: '2025-02-28',
    signedDate: '2024-02-20',
    autoRenew: true,
    renewalNoticeDays: 60,
    paymentTerms: 'Net 15',
    assignedTo: 'Michael Chen',
    tags: ['Cloud', 'Infrastructure', 'Monthly'],
    attachments: 4,
    lastInvoiceDate: '2024-10-01',
    nextInvoiceDate: '2024-11-01',
    totalInvoiced: 21000,
    outstandingAmount: 3000,
    createdDate: '2024-02-10',
  },
  {
    id: '3',
    contractNumber: 'CNT-2024-003',
    title: 'Premium Support Package',
    customer: 'Robert Johnson',
    customerCompany: 'Global Industries Ltd',
    type: 'support',
    status: 'pending_renewal',
    value: 85000,
    recurringValue: 85000,
    billingCycle: 'annually',
    startDate: '2023-11-01',
    endDate: '2024-10-31',
    signedDate: '2023-10-15',
    autoRenew: false,
    renewalNoticeDays: 60,
    paymentTerms: 'Net 30',
    assignedTo: 'Sarah Johnson',
    tags: ['Support', 'Premium', 'Renewal Due'],
    attachments: 3,
    lastInvoiceDate: '2023-11-01',
    nextInvoiceDate: '2024-11-01',
    totalInvoiced: 85000,
    outstandingAmount: 0,
    createdDate: '2023-09-20',
  },
  {
    id: '4',
    contractNumber: 'CNT-2024-004',
    title: 'Custom ERP Implementation & Maintenance',
    customer: 'Lisa Anderson',
    customerCompany: 'Manufacturing Solutions Co',
    type: 'custom',
    status: 'active',
    value: 520000,
    recurringValue: 40000,
    billingCycle: 'quarterly',
    startDate: '2024-02-01',
    endDate: '2027-01-31',
    signedDate: '2024-01-20',
    autoRenew: false,
    renewalNoticeDays: 120,
    paymentTerms: 'Net 45',
    assignedTo: 'David Park',
    tags: ['ERP', 'Custom', 'Implementation'],
    attachments: 12,
    lastInvoiceDate: '2024-08-01',
    nextInvoiceDate: '2024-11-01',
    totalInvoiced: 120000,
    outstandingAmount: 40000,
    createdDate: '2023-12-15',
  },
  {
    id: '5',
    contractNumber: 'CNT-2024-005',
    title: 'SaaS Subscription - Business Plan',
    customer: 'James Wilson',
    customerCompany: 'Financial Services Group',
    type: 'subscription',
    status: 'active',
    value: 24000,
    recurringValue: 2000,
    billingCycle: 'monthly',
    startDate: '2024-05-01',
    endDate: '2025-04-30',
    signedDate: '2024-04-25',
    autoRenew: true,
    renewalNoticeDays: 30,
    paymentTerms: 'Credit Card - Immediate',
    assignedTo: 'Sarah Johnson',
    tags: ['SaaS', 'Subscription', 'Business'],
    attachments: 2,
    lastInvoiceDate: '2024-10-01',
    nextInvoiceDate: '2024-11-01',
    totalInvoiced: 10000,
    outstandingAmount: 0,
    createdDate: '2024-04-15',
  },
  {
    id: '6',
    contractNumber: 'CNT-2024-006',
    title: 'Annual Maintenance Agreement',
    customer: 'Maria Garcia',
    customerCompany: 'Retail Innovations',
    type: 'maintenance',
    status: 'active',
    value: 48000,
    recurringValue: 48000,
    billingCycle: 'annually',
    startDate: '2024-06-01',
    endDate: '2025-05-31',
    signedDate: '2024-05-20',
    autoRenew: true,
    renewalNoticeDays: 60,
    paymentTerms: 'Net 30',
    assignedTo: 'Michael Chen',
    tags: ['Maintenance', 'Annual', 'Hardware'],
    attachments: 5,
    lastInvoiceDate: '2024-06-01',
    nextInvoiceDate: '2025-06-01',
    totalInvoiced: 48000,
    outstandingAmount: 0,
    createdDate: '2024-05-10',
  },
  {
    id: '7',
    contractNumber: 'CNT-2023-015',
    title: 'Consulting Services Agreement',
    customer: 'Thomas Brown',
    customerCompany: 'Healthcare Systems Inc',
    type: 'service',
    status: 'expired',
    value: 180000,
    billingCycle: 'one-time',
    startDate: '2023-06-01',
    endDate: '2024-05-31',
    signedDate: '2023-05-15',
    autoRenew: false,
    renewalNoticeDays: 90,
    paymentTerms: 'Net 30 - Milestone Based',
    assignedTo: 'David Park',
    tags: ['Consulting', 'Project', 'Expired'],
    attachments: 9,
    lastInvoiceDate: '2024-05-01',
    totalInvoiced: 180000,
    outstandingAmount: 0,
    createdDate: '2023-04-20',
  },
  {
    id: '8',
    contractNumber: 'CNT-2024-007',
    title: 'Software Development Services',
    customer: 'Patricia Martinez',
    customerCompany: 'E-Commerce Solutions Ltd',
    type: 'service',
    status: 'suspended',
    value: 120000,
    recurringValue: 10000,
    billingCycle: 'monthly',
    startDate: '2024-04-01',
    endDate: '2025-03-31',
    signedDate: '2024-03-20',
    autoRenew: false,
    renewalNoticeDays: 60,
    paymentTerms: 'Net 30',
    assignedTo: 'Michael Chen',
    tags: ['Development', 'Custom', 'Suspended'],
    attachments: 6,
    lastInvoiceDate: '2024-08-01',
    totalInvoiced: 50000,
    outstandingAmount: 20000,
    createdDate: '2024-03-10',
  },
  {
    id: '9',
    contractNumber: 'CNT-2024-008',
    title: 'Enterprise Support & Training Package',
    customer: 'William Davis',
    customerCompany: 'Tech Innovations Corp',
    type: 'support',
    status: 'draft',
    value: 95000,
    recurringValue: 95000,
    billingCycle: 'annually',
    startDate: '2024-11-01',
    endDate: '2025-10-31',
    autoRenew: true,
    renewalNoticeDays: 60,
    paymentTerms: 'Net 30',
    assignedTo: 'Sarah Johnson',
    tags: ['Support', 'Training', 'Draft'],
    attachments: 1,
    totalInvoiced: 0,
    outstandingAmount: 0,
    createdDate: '2024-10-15',
  },
];

export default function ContractsPage() {
  const router = useRouter();
  const [contracts] = useState<Contract[]>(mockContracts);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'draft' | 'active' | 'pending_renewal' | 'expired' | 'terminated' | 'suspended'>('all');
  const [filterType, setFilterType] = useState<'all' | 'service' | 'subscription' | 'license' | 'support' | 'maintenance' | 'custom'>('all');

  const filteredContracts = contracts.filter(contract => {
    const matchesSearch = contract.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contract.contractNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contract.customerCompany.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contract.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = filterStatus === 'all' || contract.status === filterStatus;
    const matchesType = filterType === 'all' || contract.type === filterType;
    return matchesSearch && matchesStatus && matchesType;
  });

  const stats = {
    totalContracts: contracts.length,
    activeContracts: contracts.filter(c => c.status === 'active').length,
    totalValue: contracts.filter(c => c.status === 'active').reduce((sum, c) => sum + c.value, 0),
    recurringRevenue: contracts.filter(c => c.status === 'active' && c.recurringValue).reduce((sum, c) => sum + (c.recurringValue || 0), 0),
    pendingRenewal: contracts.filter(c => c.status === 'pending_renewal').length,
    outstanding: contracts.reduce((sum, c) => sum + c.outstandingAmount, 0),
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-700';
      case 'active': return 'bg-green-100 text-green-700';
      case 'pending_renewal': return 'bg-yellow-100 text-yellow-700';
      case 'expired': return 'bg-orange-100 text-orange-700';
      case 'terminated': return 'bg-red-100 text-red-700';
      case 'suspended': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'service': return 'bg-blue-100 text-blue-700';
      case 'subscription': return 'bg-purple-100 text-purple-700';
      case 'license': return 'bg-green-100 text-green-700';
      case 'support': return 'bg-orange-100 text-orange-700';
      case 'maintenance': return 'bg-teal-100 text-teal-700';
      case 'custom': return 'bg-pink-100 text-pink-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getDaysUntilEnd = (endDate: string) => {
    return Math.ceil((new Date(endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  };

  const isExpiringWithin90Days = (contract: Contract) => {
    const days = getDaysUntilEnd(contract.endDate);
    return days <= 90 && days >= 0 && contract.status === 'active';
  };

  const handleCreateContract = () => {
    router.push('/crm/contracts/create');
  };

  const handleViewContract = (contract: Contract) => {
    router.push(`/crm/contracts/view/${contract.id}`);
  };

  const handleEditContract = (contract: Contract) => {
    router.push(`/crm/contracts/edit/${contract.id}`);
  };

  const handleDownloadContract = (contract: Contract) => {
    // Silent download operation
    console.log(`Downloading contract ${contract.contractNumber}`);
  };

  return (
    <div className="container mx-auto h-full px-4 sm:px-6 lg:px-8 py-6 ">
      <div className="mb-8">
        <div className="flex justify-end mb-6">
          <button
            onClick={handleCreateContract}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            Create Contract
          </button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white">
            <FileText className="w-8 h-8 opacity-80 mb-2" />
            <div className="text-3xl font-bold mb-1">{stats.totalContracts}</div>
            <div className="text-blue-100 text-sm">Total Contracts</div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white">
            <CheckCircle className="w-8 h-8 opacity-80 mb-2" />
            <div className="text-3xl font-bold mb-1">{stats.activeContracts}</div>
            <div className="text-green-100 text-sm">Active</div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6 text-white">
            <DollarSign className="w-8 h-8 opacity-80 mb-2" />
            <div className="text-3xl font-bold mb-1">${(stats.totalValue / 1000000).toFixed(1)}M</div>
            <div className="text-purple-100 text-sm">Total Value</div>
          </div>

          <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg p-6 text-white">
            <TrendingUp className="w-8 h-8 opacity-80 mb-2" />
            <div className="text-3xl font-bold mb-1">${(stats.recurringRevenue / 1000).toFixed(0)}K</div>
            <div className="text-teal-100 text-sm">MRR/ARR</div>
          </div>

          <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg p-6 text-white">
            <RefreshCw className="w-8 h-8 opacity-80 mb-2" />
            <div className="text-3xl font-bold mb-1">{stats.pendingRenewal}</div>
            <div className="text-yellow-100 text-sm">Pending Renewal</div>
          </div>

          <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-lg p-6 text-white">
            <AlertCircle className="w-8 h-8 opacity-80 mb-2" />
            <div className="text-3xl font-bold mb-1">${(stats.outstanding / 1000).toFixed(0)}K</div>
            <div className="text-red-100 text-sm">Outstanding</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="flex gap-4 items-center">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search contracts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="active">Active</option>
              <option value="pending_renewal">Pending Renewal</option>
              <option value="expired">Expired</option>
              <option value="suspended">Suspended</option>
              <option value="terminated">Terminated</option>
            </select>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Types</option>
              <option value="service">Service</option>
              <option value="subscription">Subscription</option>
              <option value="license">License</option>
              <option value="support">Support</option>
              <option value="maintenance">Maintenance</option>
              <option value="custom">Custom</option>
            </select>
          </div>
        </div>
      </div>

      {/* Contracts List */}
      <div className="space-y-4">
        {filteredContracts.map((contract) => {
          const expiringWithin90Days = isExpiringWithin90Days(contract);
          const daysUntilEnd = getDaysUntilEnd(contract.endDate);

          return (
            <div
              key={contract.id}
              className={`bg-white rounded-lg border p-6 hover:shadow-md transition-shadow ${
                expiringWithin90Days ? 'border-yellow-300 bg-yellow-50' : 'border-gray-200'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">{contract.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(contract.status)}`}>
                      {contract.status.replace('_', ' ')}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getTypeColor(contract.type)}`}>
                      {contract.type}
                    </span>
                    {contract.autoRenew && (
                      <span className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                        <RefreshCw className="w-3 h-3" />
                        Auto-Renew
                      </span>
                    )}
                    {expiringWithin90Days && (
                      <span className="flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs font-medium">
                        <AlertCircle className="w-3 h-3" />
                        Expiring in {daysUntilEnd} days
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="font-medium">{contract.contractNumber}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Building2 className="w-4 h-4" />
                      {contract.customerCompany}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {contract.customer}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleViewContract(contract)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm"
                  >
                    <Eye className="w-4 h-4" />
                    <span>View</span>
                  </button>
                  <button
                    onClick={() => handleEditContract(contract)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDownloadContract(contract)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-6 gap-4 mb-4">
                {/* Contract Value */}
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4">
                  <div className="flex items-center gap-1 text-green-700 mb-1">
                    <DollarSign className="w-4 h-4" />
                    <span className="text-xs font-medium">Total Value</span>
                  </div>
                  <div className="text-2xl font-bold text-green-900">
                    ${(contract.value / 1000).toFixed(0)}K
                  </div>
                  {contract.recurringValue && (
                    <div className="text-xs text-green-700 mt-1">
                      ${(contract.recurringValue / 1000).toFixed(1)}K {contract.billingCycle}
                    </div>
                  )}
                </div>

                {/* Contract Period */}
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
                  <div className="flex items-center gap-1 text-blue-700 mb-1">
                    <Calendar className="w-4 h-4" />
                    <span className="text-xs font-medium">Period</span>
                  </div>
                  <div className="text-sm font-bold text-blue-900">
                    {new Date(contract.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  </div>
                  <div className="text-xs text-blue-700">
                    to {new Date(contract.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  </div>
                </div>

                {/* Invoiced */}
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4">
                  <div className="flex items-center gap-1 text-purple-700 mb-1">
                    <DollarSign className="w-4 h-4" />
                    <span className="text-xs font-medium">Invoiced</span>
                  </div>
                  <div className="text-2xl font-bold text-purple-900">
                    ${(contract.totalInvoiced / 1000).toFixed(0)}K
                  </div>
                  <div className="text-xs text-purple-700">
                    {((contract.totalInvoiced / contract.value) * 100).toFixed(0)}% of total
                  </div>
                </div>

                {/* Outstanding */}
                <div className={`bg-gradient-to-br rounded-lg p-4 ${
                  contract.outstandingAmount > 0
                    ? 'from-red-50 to-red-100'
                    : 'from-gray-50 to-gray-100'
                }`}>
                  <div className={`flex items-center gap-1 mb-1 ${
                    contract.outstandingAmount > 0 ? 'text-red-700' : 'text-gray-700'
                  }`}>
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-xs font-medium">Outstanding</span>
                  </div>
                  <div className={`text-2xl font-bold ${
                    contract.outstandingAmount > 0 ? 'text-red-900' : 'text-gray-900'
                  }`}>
                    ${(contract.outstandingAmount / 1000).toFixed(1)}K
                  </div>
                  <div className={`text-xs ${
                    contract.outstandingAmount > 0 ? 'text-red-700' : 'text-gray-600'
                  }`}>
                    {contract.outstandingAmount > 0 ? contract.paymentTerms : 'All paid'}
                  </div>
                </div>

                {/* Next Invoice */}
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4">
                  <div className="flex items-center gap-1 text-orange-700 mb-1">
                    <Calendar className="w-4 h-4" />
                    <span className="text-xs font-medium">Next Invoice</span>
                  </div>
                  <div className="text-sm font-bold text-orange-900">
                    {contract.nextInvoiceDate
                      ? new Date(contract.nextInvoiceDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                      : 'N/A'}
                  </div>
                  <div className="text-xs text-orange-700 capitalize">
                    {contract.billingCycle || 'One-time'}
                  </div>
                </div>

                {/* Assigned To */}
                <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-lg p-4">
                  <div className="flex items-center gap-1 text-teal-700 mb-1">
                    <User className="w-4 h-4" />
                    <span className="text-xs font-medium">Assigned To</span>
                  </div>
                  <div className="text-sm font-medium text-teal-900">{contract.assignedTo}</div>
                  <div className="text-xs text-teal-700">{contract.attachments} attachments</div>
                </div>
              </div>

              {/* Additional Details */}
              <div className="grid grid-cols-3 gap-4 mb-4 pt-4 border-t border-gray-100">
                <div>
                  <div className="text-xs text-gray-600 mb-1">Payment Terms</div>
                  <div className="text-sm font-medium text-gray-900">{contract.paymentTerms}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-600 mb-1">Renewal Notice</div>
                  <div className="text-sm font-medium text-gray-900">{contract.renewalNoticeDays} days</div>
                </div>
                <div>
                  <div className="text-xs text-gray-600 mb-1">Signed Date</div>
                  <div className="text-sm font-medium text-gray-900">
                    {contract.signedDate ? new Date(contract.signedDate).toLocaleDateString() : 'Not signed'}
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-3">
                {contract.tags.map((tag, index) => (
                  <span key={index} className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Timeline */}
              {contract.status === 'active' && (
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-3 border border-blue-200">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="text-gray-600">Contract Progress</span>
                    <span className="font-medium text-gray-900">
                      {((new Date().getTime() - new Date(contract.startDate).getTime()) /
                        (new Date(contract.endDate).getTime() - new Date(contract.startDate).getTime()) * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                      style={{
                        width: `${((new Date().getTime() - new Date(contract.startDate).getTime()) /
                                (new Date(contract.endDate).getTime() - new Date(contract.startDate).getTime()) * 100).toFixed(0)}%`
                      }}
                    ></div>
                  </div>
                  <div className="flex justify-between mt-2 text-xs text-gray-600">
                    <span>{new Date(contract.startDate).toLocaleDateString()}</span>
                    <span>{daysUntilEnd > 0 ? `${daysUntilEnd} days remaining` : 'Expired'}</span>
                    <span>{new Date(contract.endDate).toLocaleDateString()}</span>
                  </div>
                </div>
              )}

              <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-500">
                Created: {new Date(contract.createdDate).toLocaleDateString()}
              </div>
            </div>
          );
        })}
      </div>

      {filteredContracts.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No contracts found</h3>
          <p className="text-gray-600">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
}

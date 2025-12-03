'use client';

import React, { useState } from 'react';
import {
  Wallet,
  Plus,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  CheckCircle,
  Clock,
  AlertTriangle,
  XCircle,
  Printer,
  Send,
  Calendar,
  DollarSign,
  TrendingUp,
  Building,
  FileText,
  Mail,
  Phone
} from 'lucide-react';

interface Collection {
  id: string;
  collectionNumber: string;
  collectionDate: string;
  customerName: string;
  customerCode: string;
  paymentMethod: 'Bank Transfer' | 'Cheque' | 'Cash' | 'Credit Card' | 'UPI' | 'DD';
  bankAccount: string;
  referenceNumber?: string;
  invoiceNumber?: string;
  amount: number;
  tdsDeducted: number;
  netCollection: number;
  status: 'Draft' | 'Pending Verification' | 'Verified' | 'Deposited' | 'Cleared' | 'Bounced' | 'Cancelled';
  verifiedBy?: string;
  verifiedDate?: string;
  clearedDate?: string;
  description: string;
  costCenter?: string;
  department?: string;
  createdBy: string;
  createdDate: string;
  followUpRequired: boolean;
  collectionAgent: string;
}

export default function CollectionsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [methodFilter, setMethodFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  // Sample collections data
  const collections: Collection[] = [
    {
      id: 'COL001',
      collectionNumber: 'COL-2025-001',
      collectionDate: '2025-11-05',
      customerName: 'Hotel Paradise Ltd',
      customerCode: 'CUST-001',
      paymentMethod: 'Bank Transfer',
      bankAccount: 'HDFC Bank - *5678',
      referenceNumber: 'UTR202511051234567',
      invoiceNumber: 'INV-2025-001',
      amount: 172500,
      tdsDeducted: 3450,
      netCollection: 169050,
      status: 'Cleared',
      verifiedBy: 'Sarah Collections',
      verifiedDate: '2025-11-05',
      clearedDate: '2025-11-05',
      description: 'Payment received for invoice INV-2025-001',
      costCenter: 'CC-SAL-001',
      department: 'Sales',
      createdBy: 'John AR',
      createdDate: '2025-11-05',
      followUpRequired: false,
      collectionAgent: 'Sarah Collections'
    },
    {
      id: 'COL002',
      collectionNumber: 'COL-2025-002',
      collectionDate: '2025-11-04',
      customerName: 'Culinary Delights Inc',
      customerCode: 'CUST-002',
      paymentMethod: 'Cheque',
      bankAccount: 'ICICI Bank - *1234',
      referenceNumber: 'CHQ-456789',
      invoiceNumber: 'INV-2025-002',
      amount: 60000,
      tdsDeducted: 1200,
      netCollection: 58800,
      status: 'Deposited',
      verifiedBy: 'John AR',
      verifiedDate: '2025-11-04',
      description: 'Partial payment received',
      costCenter: 'CC-SAL-001',
      department: 'Sales',
      createdBy: 'Sarah Collections',
      createdDate: '2025-11-04',
      followUpRequired: true,
      collectionAgent: 'Sarah Collections'
    },
    {
      id: 'COL003',
      collectionNumber: 'COL-2025-003',
      collectionDate: '2025-11-03',
      customerName: 'City General Hospital',
      customerCode: 'CUST-003',
      paymentMethod: 'UPI',
      bankAccount: 'HDFC Bank - *5678',
      referenceNumber: 'UPI-987654321',
      invoiceNumber: 'INV-2025-005',
      amount: 85000,
      tdsDeducted: 1700,
      netCollection: 83300,
      status: 'Cleared',
      verifiedBy: 'Michael Collections',
      verifiedDate: '2025-11-03',
      clearedDate: '2025-11-03',
      description: 'UPI payment received',
      costCenter: 'CC-SAL-002',
      department: 'Sales',
      createdBy: 'John AR',
      createdDate: '2025-11-03',
      followUpRequired: false,
      collectionAgent: 'Michael Collections'
    },
    {
      id: 'COL004',
      collectionNumber: 'COL-2025-004',
      collectionDate: '2025-11-02',
      customerName: 'Restaurant Group LLC',
      customerCode: 'CUST-006',
      paymentMethod: 'Bank Transfer',
      bankAccount: 'Axis Bank - *9012',
      referenceNumber: 'UTR202511021112233',
      invoiceNumber: 'INV-2025-006',
      amount: 109250,
      tdsDeducted: 2185,
      netCollection: 107065,
      status: 'Pending Verification',
      description: 'Payment received, awaiting verification',
      costCenter: 'CC-SAL-001',
      department: 'Sales',
      createdBy: 'Sarah Collections',
      createdDate: '2025-11-02',
      followUpRequired: false,
      collectionAgent: 'Sarah Collections'
    },
    {
      id: 'COL005',
      collectionNumber: 'COL-2025-005',
      collectionDate: '2025-10-28',
      customerName: 'Springfield Academy',
      customerCode: 'CUST-004',
      paymentMethod: 'Cheque',
      bankAccount: 'SBI - *3456',
      referenceNumber: 'CHQ-111222',
      invoiceNumber: 'INV-2025-004',
      amount: 62100,
      tdsDeducted: 1242,
      netCollection: 60858,
      status: 'Bounced',
      verifiedBy: 'John AR',
      verifiedDate: '2025-10-28',
      description: 'Cheque bounced - insufficient funds',
      costCenter: 'CC-SAL-002',
      department: 'Sales',
      createdBy: 'Michael Collections',
      createdDate: '2025-10-28',
      followUpRequired: true,
      collectionAgent: 'Michael Collections'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Draft': return 'bg-gray-100 text-gray-700';
      case 'Pending Verification': return 'bg-yellow-100 text-yellow-700';
      case 'Verified': return 'bg-blue-100 text-blue-700';
      case 'Deposited': return 'bg-purple-100 text-purple-700';
      case 'Cleared': return 'bg-green-100 text-green-700';
      case 'Bounced': return 'bg-red-100 text-red-700';
      case 'Cancelled': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Cleared': return <CheckCircle className="h-4 w-4" />;
      case 'Bounced': return <XCircle className="h-4 w-4" />;
      case 'Pending Verification': return <Clock className="h-4 w-4" />;
      case 'Deposited': return <TrendingUp className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const filteredCollections = collections.filter(collection => {
    const matchesSearch = collection.collectionNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         collection.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (collection.invoiceNumber && collection.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || collection.status === statusFilter;
    const matchesMethod = methodFilter === 'all' || collection.paymentMethod === methodFilter;
    return matchesSearch && matchesStatus && matchesMethod;
  });

  const stats = {
    totalCollections: collections.length,
    totalAmount: collections.reduce((sum, c) => sum + c.netCollection, 0),
    cleared: collections.filter(c => c.status === 'Cleared').length,
    pending: collections.filter(c => c.status === 'Pending Verification').length,
    bounced: collections.filter(c => c.status === 'Bounced').length,
    followUpRequired: collections.filter(c => c.followUpRequired).length
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gradient-to-br from-gray-50 via-green-50 to-emerald-50">
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 max-w-7xl">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Wallet className="h-6 w-6 text-green-600" />
                <h1 className="text-2xl font-bold text-gray-900">Collections Management</h1>
              </div>
              <p className="text-sm text-gray-600">Track and manage customer payment collections</p>
            </div>
            
            <div className="flex gap-2">
              <button className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                <Download className="h-4 w-4" />
                <span>Export</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                <Plus className="h-4 w-4" />
                <span>Record Collection</span>
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-gray-600">Total Collections</p>
                <Wallet className="h-5 w-5 text-gray-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">₹{(stats.totalAmount / 1000).toFixed(0)}K</p>
              <p className="text-xs text-gray-500 mt-1">{stats.totalCollections} transactions</p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-green-700">Cleared</p>
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-green-900">{stats.cleared}</p>
              <p className="text-xs text-green-600 mt-1">Funds received</p>
            </div>

            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4 border border-yellow-200">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-yellow-700">Pending</p>
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
              <p className="text-2xl font-bold text-yellow-900">{stats.pending}</p>
              <p className="text-xs text-yellow-600 mt-1">Awaiting verification</p>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4 border border-red-200">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-red-700">Follow-up</p>
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <p className="text-2xl font-bold text-red-900">{stats.followUpRequired}</p>
              <p className="text-xs text-red-600 mt-1">{stats.bounced} bounced</p>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search collections..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="all">All Status</option>
                <option value="Draft">Draft</option>
                <option value="Pending Verification">Pending Verification</option>
                <option value="Verified">Verified</option>
                <option value="Deposited">Deposited</option>
                <option value="Cleared">Cleared</option>
                <option value="Bounced">Bounced</option>
                <option value="Cancelled">Cancelled</option>
              </select>

              <select
                value={methodFilter}
                onChange={(e) => setMethodFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="all">All Methods</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Cheque">Cheque</option>
                <option value="Cash">Cash</option>
                <option value="Credit Card">Credit Card</option>
                <option value="UPI">UPI</option>
                <option value="DD">Demand Draft</option>
              </select>

              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="all">All Dates</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
            </div>
          </div>

          {/* Collections Table */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Collection Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment Method
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Invoice
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredCollections.map((collection) => (
                    <tr key={collection.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{collection.collectionNumber}</div>
                          <div className="text-xs text-gray-500">{collection.collectionDate}</div>
                          {collection.referenceNumber && (
                            <div className="text-xs text-blue-600 mt-1">Ref: {collection.referenceNumber}</div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Building className="h-4 w-4 text-gray-400" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">{collection.customerName}</div>
                            <div className="text-xs text-gray-500">{collection.customerCode}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{collection.paymentMethod}</div>
                        <div className="text-xs text-gray-500">{collection.bankAccount}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {collection.invoiceNumber ? (
                          <div className="flex items-center gap-1">
                            <FileText className="h-4 w-4 text-blue-500" />
                            <span className="text-sm font-medium text-blue-600">{collection.invoiceNumber}</span>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="text-sm font-bold text-gray-900">₹{collection.netCollection.toLocaleString()}</div>
                        {collection.tdsDeducted > 0 && (
                          <div className="text-xs text-gray-500">TDS: ₹{collection.tdsDeducted.toLocaleString()}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(collection.status)}`}>
                          {getStatusIcon(collection.status)}
                          {collection.status}
                        </span>
                        {collection.followUpRequired && (
                          <div className="text-xs text-red-600 font-semibold mt-1 flex items-center justify-center gap-1">
                            <AlertTriangle className="h-3 w-3" />
                            Follow-up
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button className="text-blue-600 hover:text-blue-800">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="text-green-600 hover:text-green-800">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button className="text-purple-600 hover:text-purple-800">
                            <Printer className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
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

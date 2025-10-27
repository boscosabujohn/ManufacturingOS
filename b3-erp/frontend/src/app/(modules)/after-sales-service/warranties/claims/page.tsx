'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  FileText,
  Plus,
  Search,
  Filter,
  Calendar,
  DollarSign,
  TrendingUp,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  Download
} from 'lucide-react';

interface WarrantyClaim {
  id: string;
  claimNumber: string;
  warrantyNumber: string;
  customerName: string;
  productName: string;
  dateRaised: string;
  issueDescription: string;
  claimAmount: number;
  approvedAmount?: number;
  status: 'Pending Review' | 'Under Investigation' | 'Approved' | 'Rejected' | 'Completed';
  priority: 'High' | 'Medium' | 'Low';
  assignedTo: string;
}

export default function WarrantyClaimsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Mock Claims Data
  const allClaims: WarrantyClaim[] = [
    {
      id: 'CLM-001',
      claimNumber: 'CLM-2025-0045',
      warrantyNumber: 'WRN-2025-0001',
      customerName: 'Sharma Kitchens Pvt Ltd',
      productName: 'Commercial Gas Range - 6 Burner',
      dateRaised: '2025-02-15',
      issueDescription: 'Gas burner ignition failure - control valve replacement required',
      claimAmount: 8500,
      approvedAmount: 8500,
      status: 'Completed',
      priority: 'High',
      assignedTo: 'Rajesh Kumar'
    },
    {
      id: 'CLM-002',
      claimNumber: 'CLM-2025-0044',
      warrantyNumber: 'WRN-2025-0003',
      customerName: 'Prestige Developers',
      productName: 'Industrial Dishwasher',
      dateRaised: '2025-02-14',
      issueDescription: 'Water pump motor failure causing drainage issues',
      claimAmount: 12000,
      status: 'Pending Review',
      priority: 'High',
      assignedTo: 'Amit Patel'
    },
    {
      id: 'CLM-003',
      claimNumber: 'CLM-2025-0043',
      warrantyNumber: 'WRN-2025-0005',
      customerName: 'Royal Restaurant Chain',
      productName: 'Commercial Deep Fryer',
      dateRaised: '2025-02-13',
      issueDescription: 'Heating element malfunction - inconsistent temperature',
      claimAmount: 6500,
      approvedAmount: 5500,
      status: 'Approved',
      priority: 'Medium',
      assignedTo: 'Priya Singh'
    },
    {
      id: 'CLM-004',
      claimNumber: 'CLM-2025-0042',
      warrantyNumber: 'WRN-2025-0002',
      customerName: 'Hotel Grand Plaza',
      productName: 'Walk-in Refrigerator',
      dateRaised: '2025-02-12',
      issueDescription: 'Compressor failure - complete cooling system breakdown',
      claimAmount: 25000,
      status: 'Under Investigation',
      priority: 'High',
      assignedTo: 'Suresh Reddy'
    },
    {
      id: 'CLM-005',
      claimNumber: 'CLM-2025-0041',
      warrantyNumber: 'WRN-2025-0007',
      customerName: 'Green Valley Resorts',
      productName: 'Commercial Mixer Grinder',
      dateRaised: '2025-02-11',
      issueDescription: 'Motor bearing wear - excessive noise during operation',
      claimAmount: 3500,
      status: 'Rejected',
      priority: 'Low',
      assignedTo: 'Neha Sharma'
    },
    {
      id: 'CLM-006',
      claimNumber: 'CLM-2025-0040',
      warrantyNumber: 'WRN-2025-0004',
      customerName: 'City Cafe Express',
      productName: 'Espresso Machine - 3 Group',
      dateRaised: '2025-02-10',
      issueDescription: 'Pressure gauge failure and steam wand malfunction',
      claimAmount: 9500,
      approvedAmount: 9500,
      status: 'Completed',
      priority: 'Medium',
      assignedTo: 'Rajesh Kumar'
    },
    {
      id: 'CLM-007',
      claimNumber: 'CLM-2025-0039',
      warrantyNumber: 'WRN-2025-0006',
      customerName: 'Paradise Banquet Hall',
      productName: 'Industrial Oven - Convection',
      dateRaised: '2025-02-09',
      issueDescription: 'Temperature sensor failure - inaccurate heating',
      claimAmount: 7500,
      status: 'Pending Review',
      priority: 'Medium',
      assignedTo: 'Amit Patel'
    },
    {
      id: 'CLM-008',
      claimNumber: 'CLM-2025-0038',
      warrantyNumber: 'WRN-2025-0008',
      customerName: 'Spice Garden Restaurant',
      productName: 'Commercial Refrigerator - 4 Door',
      dateRaised: '2025-02-08',
      issueDescription: 'Door seal damage causing temperature fluctuation',
      claimAmount: 4500,
      approvedAmount: 4000,
      status: 'Approved',
      priority: 'Low',
      assignedTo: 'Priya Singh'
    }
  ];

  // Filter claims
  const filteredClaims = allClaims.filter(claim => {
    const matchesSearch =
      claim.claimNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      claim.warrantyNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      claim.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      claim.productName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'All' || claim.status === statusFilter;
    const matchesPriority = priorityFilter === 'All' || claim.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Pagination
  const totalPages = Math.ceil(filteredClaims.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedClaims = filteredClaims.slice(startIndex, startIndex + itemsPerPage);

  // Statistics
  const stats = {
    total: allClaims.length,
    pending: allClaims.filter(c => c.status === 'Pending Review').length,
    approved: allClaims.filter(c => c.status === 'Approved' || c.status === 'Completed').length,
    rejected: allClaims.filter(c => c.status === 'Rejected').length,
    totalAmount: allClaims.reduce((sum, c) => sum + c.claimAmount, 0),
    approvedAmount: allClaims.reduce((sum, c) => sum + (c.approvedAmount || 0), 0)
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: WarrantyClaim['status']) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-700';
      case 'Approved': return 'bg-blue-100 text-blue-700';
      case 'Pending Review': return 'bg-yellow-100 text-yellow-700';
      case 'Under Investigation': return 'bg-orange-100 text-orange-700';
      case 'Rejected': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getPriorityColor = (priority: WarrantyClaim['priority']) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-700';
      case 'Medium': return 'bg-yellow-100 text-yellow-700';
      case 'Low': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Warranty Claims</h1>
          <p className="text-sm text-gray-500 mt-1">Manage and track warranty claim requests</p>
        </div>
        <button
          onClick={() => router.push('/after-sales-service/warranties/claims/new')}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          File New Claim
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Total Claims</span>
            <FileText className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
          <div className="text-xs text-gray-500 mt-1">{stats.pending} pending review</div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Approved</span>
            <CheckCircle2 className="w-4 h-4 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{stats.approved}</div>
          <div className="text-xs text-gray-500 mt-1">
            {((stats.approved / stats.total) * 100).toFixed(0)}% approval rate
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Total Claim Value</span>
            <DollarSign className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalAmount)}</div>
          <div className="text-xs text-gray-500 mt-1">
            {formatCurrency(stats.approvedAmount)} approved
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Rejected</span>
            <XCircle className="w-4 h-4 text-red-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{stats.rejected}</div>
          <div className="text-xs text-gray-500 mt-1">
            {((stats.rejected / stats.total) * 100).toFixed(0)}% rejection rate
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Search by claim #, warranty #, customer, or product..."
              />
            </div>
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Status</option>
              <option value="Pending Review">Pending Review</option>
              <option value="Under Investigation">Under Investigation</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Priority</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Claims Table */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Claim #</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Warranty #</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date Raised</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Claim Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Priority</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedClaims.map((claim) => (
                <tr key={claim.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-blue-600 hover:underline cursor-pointer">
                    {claim.claimNumber}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{claim.warrantyNumber}</td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{claim.customerName}</div>
                    <div className="text-xs text-gray-500">Assigned to: {claim.assignedTo}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">{claim.productName}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{formatDate(claim.dateRaised)}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 text-right">
                    {formatCurrency(claim.claimAmount)}
                    {claim.approvedAmount && claim.approvedAmount !== claim.claimAmount && (
                      <div className="text-xs text-green-600">
                        Approved: {formatCurrency(claim.approvedAmount)}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(claim.status)}`}>
                      {claim.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(claim.priority)}`}>
                      {claim.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => router.push(`/after-sales-service/warranties/claims/${claim.id}`)}
                        className="p-1 text-gray-600 hover:bg-gray-100 rounded"
                       
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        className="p-1 text-gray-600 hover:bg-gray-100 rounded"
                       
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
            <div className="text-sm text-gray-600">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredClaims.length)} of {filteredClaims.length} claims
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1 rounded-md text-sm font-medium ${
                    currentPage === i + 1
                      ? 'bg-blue-600 text-white'
                      : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {filteredClaims.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No claims found</p>
            <p className="text-sm text-gray-400 mt-1">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Search, Eye, Edit, FileText, AlertCircle, CheckCircle, Clock, XCircle, Shield, Calendar, DollarSign, TrendingUp, Download } from 'lucide-react';

interface Warranty {
  id: string;
  warrantyNumber: string;
  warrantyType: 'Standard' | 'Extended' | 'Manufacturer' | 'Dealer';
  customerId: string;
  customerName: string;
  equipmentId: string;
  equipmentModel: string;
  status: 'active' | 'expired' | 'void' | 'extended' | 'transferred';
  startDate: string;
  endDate: string;
  durationMonths: number;
  coverage: 'Parts Only' | 'Labor Only' | 'Parts & Labor' | 'Comprehensive';
  claimCount: number;
  totalClaimValue: number;
  remainingCoverage: number; // percentage
  isExtended: boolean;
  baseWarrantyId?: string;
}

const mockWarranties: Warranty[] = [
  {
    id: '1',
    warrantyNumber: 'WRN-2025-00001',
    warrantyType: 'Standard',
    customerId: 'CUST001',
    customerName: 'Sharma Modular Kitchens Pvt Ltd',
    equipmentId: 'EQP-MK-2025-001',
    equipmentModel: 'Modular Kitchen Premium SS-304',
    status: 'active',
    startDate: '2025-01-15',
    endDate: '2026-01-14',
    durationMonths: 12,
    coverage: 'Parts & Labor',
    claimCount: 0,
    totalClaimValue: 0,
    remainingCoverage: 100,
    isExtended: false,
  },
  {
    id: '2',
    warrantyNumber: 'WRN-2025-00045',
    warrantyType: 'Extended',
    customerId: 'CUST002',
    customerName: 'Prestige Developers Bangalore',
    equipmentId: 'EQP-HB-2024-234',
    equipmentModel: 'Built-in Hob 4 Burner Gas',
    status: 'active',
    startDate: '2024-03-20',
    endDate: '2027-03-19',
    durationMonths: 36,
    coverage: 'Comprehensive',
    claimCount: 2,
    totalClaimValue: 28500,
    remainingCoverage: 85,
    isExtended: true,
    baseWarrantyId: 'WRN-2024-00012',
  },
  {
    id: '3',
    warrantyNumber: 'WRN-2025-00123',
    warrantyType: 'Manufacturer',
    customerId: 'CUST003',
    customerName: 'Urban Interiors & Designers',
    equipmentId: 'EQP-CH-2025-067',
    equipmentModel: 'Chimney Auto Clean 90cm',
    status: 'active',
    startDate: '2025-05-10',
    endDate: '2027-05-09',
    durationMonths: 24,
    coverage: 'Parts Only',
    claimCount: 1,
    totalClaimValue: 8500,
    remainingCoverage: 95,
    isExtended: false,
  },
  {
    id: '4',
    warrantyNumber: 'WRN-2024-00876',
    warrantyType: 'Standard',
    customerId: 'CUST004',
    customerName: 'Elite Contractors & Builders',
    equipmentId: 'EQP-OV-2024-543',
    equipmentModel: 'Built-in Oven 60L',
    status: 'expired',
    startDate: '2024-02-01',
    endDate: '2025-01-31',
    durationMonths: 12,
    coverage: 'Parts & Labor',
    claimCount: 3,
    totalClaimValue: 45000,
    remainingCoverage: 0,
    isExtended: false,
  },
  {
    id: '5',
    warrantyNumber: 'WRN-2025-00234',
    warrantyType: 'Extended',
    customerId: 'CUST005',
    customerName: 'DLF Universal Projects',
    equipmentId: 'EQP-DW-2023-890',
    equipmentModel: 'Dishwasher 14 Place Settings',
    status: 'active',
    startDate: '2023-08-15',
    endDate: '2026-08-14',
    durationMonths: 36,
    coverage: 'Comprehensive',
    claimCount: 4,
    totalClaimValue: 67000,
    remainingCoverage: 70,
    isExtended: true,
    baseWarrantyId: 'WRN-2023-00456',
  },
  {
    id: '6',
    warrantyNumber: 'WRN-2025-00345',
    warrantyType: 'Dealer',
    customerId: 'CUST006',
    customerName: 'Signature Interiors Pune',
    equipmentId: 'EQP-MK-2025-234',
    equipmentModel: 'Modular Kitchen L-Shape',
    status: 'active',
    startDate: '2025-04-01',
    endDate: '2026-03-31',
    durationMonths: 12,
    coverage: 'Labor Only',
    claimCount: 0,
    totalClaimValue: 0,
    remainingCoverage: 100,
    isExtended: false,
  },
  {
    id: '7',
    warrantyNumber: 'WRN-2024-00567',
    warrantyType: 'Standard',
    customerId: 'CUST007',
    customerName: 'Royal Homes Hyderabad',
    equipmentId: 'EQP-HB-2024-789',
    equipmentModel: 'Induction Hob 4 Burner',
    status: 'transferred',
    startDate: '2024-06-15',
    endDate: '2025-06-14',
    durationMonths: 12,
    coverage: 'Parts & Labor',
    claimCount: 1,
    totalClaimValue: 12000,
    remainingCoverage: 90,
    isExtended: false,
  },
  {
    id: '8',
    warrantyNumber: 'WRN-2025-00456',
    warrantyType: 'Manufacturer',
    customerId: 'CUST008',
    customerName: 'Modern Living Ahmedabad',
    equipmentId: 'EQP-MW-2025-123',
    equipmentModel: 'Microwave Oven 30L Convection',
    status: 'active',
    startDate: '2025-07-20',
    endDate: '2027-07-19',
    durationMonths: 24,
    coverage: 'Comprehensive',
    claimCount: 0,
    totalClaimValue: 0,
    remainingCoverage: 100,
    isExtended: false,
  },
  {
    id: '9',
    warrantyNumber: 'WRN-2023-00234',
    warrantyType: 'Standard',
    customerId: 'CUST009',
    customerName: 'Decor Studio Chennai',
    equipmentId: 'EQP-CH-2023-456',
    equipmentModel: 'Chimney Curved Glass 60cm',
    status: 'void',
    startDate: '2023-12-01',
    endDate: '2024-11-30',
    durationMonths: 12,
    coverage: 'Parts Only',
    claimCount: 5,
    totalClaimValue: 89000,
    remainingCoverage: 0,
    isExtended: false,
  },
  {
    id: '10',
    warrantyNumber: 'WRN-2025-00789',
    warrantyType: 'Extended',
    customerId: 'CUST010',
    customerName: 'Cosmos Furniture Mart',
    equipmentId: 'EQP-RO-2024-678',
    equipmentModel: 'RO Water Purifier 10L',
    status: 'active',
    startDate: '2024-09-01',
    endDate: '2027-08-31',
    durationMonths: 36,
    coverage: 'Parts & Labor',
    claimCount: 2,
    totalClaimValue: 15000,
    remainingCoverage: 88,
    isExtended: true,
    baseWarrantyId: 'WRN-2024-00345',
  },
];

const statusColors = {
  active: 'bg-green-100 text-green-700',
  expired: 'bg-red-100 text-red-700',
  void: 'bg-gray-100 text-gray-700',
  extended: 'bg-blue-100 text-blue-700',
  transferred: 'bg-purple-100 text-purple-700',
};

const statusIcons = {
  active: CheckCircle,
  expired: XCircle,
  void: AlertCircle,
  extended: Clock,
  transferred: FileText,
};

const warrantyTypeColors = {
  'Standard': 'bg-blue-100 text-blue-700',
  'Extended': 'bg-purple-100 text-purple-700',
  'Manufacturer': 'bg-orange-100 text-orange-700',
  'Dealer': 'bg-cyan-100 text-cyan-700',
};

const coverageColors = {
  'Parts Only': 'bg-yellow-100 text-yellow-700',
  'Labor Only': 'bg-orange-100 text-orange-700',
  'Parts & Labor': 'bg-blue-100 text-blue-700',
  'Comprehensive': 'bg-green-100 text-green-700',
};

export default function WarrantiesPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter warranties
  const filteredWarranties = mockWarranties.filter((warranty) => {
    const matchesSearch =
      warranty.warrantyNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      warranty.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      warranty.equipmentModel.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || warranty.status === statusFilter;
    const matchesType = typeFilter === 'all' || warranty.warrantyType === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  // Pagination
  const totalPages = Math.ceil(filteredWarranties.length / itemsPerPage);
  const paginatedWarranties = filteredWarranties.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Calculate statistics
  const stats = {
    totalWarranties: mockWarranties.length,
    activeWarranties: mockWarranties.filter(w => w.status === 'active').length,
    expiringIn30Days: mockWarranties.filter(w => {
      const daysUntilExpiry = Math.ceil((new Date(w.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
      return w.status === 'active' && daysUntilExpiry <= 30 && daysUntilExpiry > 0;
    }).length,
    totalClaims: mockWarranties.reduce((sum, w) => sum + w.claimCount, 0),
    totalClaimValue: mockWarranties.reduce((sum, w) => sum + w.totalClaimValue, 0),
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getExpiryStatus = (endDate: string, status: string) => {
    if (status !== 'active') return null;
    const daysUntilExpiry = Math.ceil((new Date(endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    if (daysUntilExpiry < 0) return <span className="text-red-600 text-sm">Expired</span>;
    if (daysUntilExpiry <= 30) return <span className="text-orange-600 text-sm font-medium">Expires in {daysUntilExpiry} days</span>;
    return <span className="text-gray-600 text-sm">{daysUntilExpiry} days remaining</span>;
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Warranties</h1>
        <p className="text-gray-600">Manage product warranties and claims</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Warranties</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalWarranties}</p>
            </div>
            <Shield className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active</p>
              <p className="text-2xl font-bold text-green-600">{stats.activeWarranties}</p>
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
              <p className="text-sm text-gray-600">Total Claims</p>
              <p className="text-2xl font-bold text-purple-600">{stats.totalClaims}</p>
            </div>
            <FileText className="h-8 w-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Claim Value</p>
              <p className="text-xl font-bold text-red-600">{formatCurrency(stats.totalClaimValue)}</p>
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
                placeholder="Search by warranty number, customer, or equipment..."
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
              <option value="active">Active</option>
              <option value="expired">Expired</option>
              <option value="void">Void</option>
              <option value="extended">Extended</option>
              <option value="transferred">Transferred</option>
            </select>

            {/* Type Filter */}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              <option value="all">All Types</option>
              <option value="Standard">Standard</option>
              <option value="Extended">Extended</option>
              <option value="Manufacturer">Manufacturer</option>
              <option value="Dealer">Dealer</option>
            </select>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => router.push('/after-sales-service/warranties/claims')}
              className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <FileText className="h-4 w-4" />
              View Claims
            </button>
            <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export
            </button>
            <button
              onClick={() => router.push('/after-sales-service/warranties/add')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Register Warranty
            </button>
          </div>
        </div>
      </div>

      {/* Warranties Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Warranty Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Equipment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type & Coverage
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Duration
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Claims
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Coverage Left
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedWarranties.map((warranty) => {
                const StatusIcon = statusIcons[warranty.status];
                return (
                  <tr key={warranty.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-900">{warranty.warrantyNumber}</span>
                        <span className="text-sm text-gray-600">{warranty.customerName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm text-gray-900">{warranty.equipmentModel}</span>
                        <span className="text-xs text-gray-500">{warranty.equipmentId}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${warrantyTypeColors[warranty.warrantyType]}`}>
                          {warranty.warrantyType}
                        </span>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${coverageColors[warranty.coverage]}`}>
                          {warranty.coverage}
                        </span>
                        {warranty.isExtended && (
                          <span className="text-xs text-blue-600">Extended from #{warranty.baseWarrantyId?.slice(-4)}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusColors[warranty.status]}`}>
                        <StatusIcon className="h-3 w-3" />
                        {warranty.status.charAt(0).toUpperCase() + warranty.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col text-sm">
                        <span className="text-gray-900">{warranty.durationMonths} months</span>
                        <span className="text-xs text-gray-600">
                          {new Date(warranty.startDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </span>
                        <span className="text-xs text-gray-600">
                          to {new Date(warranty.endDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </span>
                        <div className="mt-1">{getExpiryStatus(warranty.endDate, warranty.status)}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-900">{warranty.claimCount} claims</span>
                        {warranty.totalClaimValue > 0 && (
                          <span className="text-xs text-red-600">{formatCurrency(warranty.totalClaimValue)}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col items-start">
                        <span className="text-sm font-medium text-gray-900">{warranty.remainingCoverage}%</span>
                        <div className="w-24 h-2 bg-gray-200 rounded-full mt-1">
                          <div
                            className={`h-full rounded-full ${
                              warranty.remainingCoverage >= 80 ? 'bg-green-500' :
                              warranty.remainingCoverage >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${warranty.remainingCoverage}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => router.push(`/after-sales-service/warranties/view/${warranty.id}`)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        {warranty.status === 'active' && (
                          <button
                            onClick={() => router.push(`/after-sales-service/warranties/claims/add?warrantyId=${warranty.id}`)}
                            className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                            title="Create Claim"
                          >
                            <FileText className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          onClick={() => router.push(`/after-sales-service/warranties/edit/${warranty.id}`)}
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
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
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredWarranties.length)} of {filteredWarranties.length} warranties
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

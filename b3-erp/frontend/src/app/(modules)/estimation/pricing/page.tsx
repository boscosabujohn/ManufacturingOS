'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Search, Eye, Edit, Trash2, DollarSign, TrendingUp, Package, Calendar, Percent, Download, ChevronLeft, ChevronRight, Tag, Activity } from 'lucide-react';

interface PriceList {
  id: string;
  priceListName: string;
  description: string;
  currency: string;
  effectiveFrom: string;
  effectiveTo: string;
  status: 'active' | 'inactive' | 'draft' | 'expired';
  totalItems: number;
  priceType: 'standard' | 'promotional' | 'bulk' | 'custom';
  customerSegment: string;
  lastUpdated: string;
  updatedBy: string;
  averageMargin: number;
}

const mockPriceLists: PriceList[] = [
  {
    id: 'PL-001',
    priceListName: 'Standard Commercial Kitchen Equipment',
    description: 'Default pricing for all commercial kitchen products',
    currency: 'USD',
    effectiveFrom: '2025-01-01',
    effectiveTo: '2025-12-31',
    status: 'active',
    totalItems: 250,
    priceType: 'standard',
    customerSegment: 'All Customers',
    lastUpdated: '2025-10-15',
    updatedBy: 'John Pricing',
    averageMargin: 22.5,
  },
  {
    id: 'PL-002',
    priceListName: 'Hospital & Healthcare Special Pricing',
    description: 'Special pricing for healthcare sector clients',
    currency: 'USD',
    effectiveFrom: '2025-09-01',
    effectiveTo: '2025-11-30',
    status: 'active',
    totalItems: 180,
    priceType: 'custom',
    customerSegment: 'Healthcare',
    lastUpdated: '2025-10-10',
    updatedBy: 'Sarah Pricing',
    averageMargin: 18.0,
  },
  {
    id: 'PL-003',
    priceListName: 'Q4 2025 Promotional Pricing',
    description: 'Year-end promotional offers',
    currency: 'USD',
    effectiveFrom: '2025-10-01',
    effectiveTo: '2025-12-31',
    status: 'active',
    totalItems: 95,
    priceType: 'promotional',
    customerSegment: 'All Customers',
    lastUpdated: '2025-10-01',
    updatedBy: 'Michael Marketing',
    averageMargin: 15.5,
  },
  {
    id: 'PL-004',
    priceListName: 'Bulk Order Pricing - Hotels',
    description: 'Volume-based pricing for hotel chains',
    currency: 'USD',
    effectiveFrom: '2025-08-01',
    effectiveTo: '2026-07-31',
    status: 'active',
    totalItems: 220,
    priceType: 'bulk',
    customerSegment: 'Hospitality',
    lastUpdated: '2025-09-25',
    updatedBy: 'Lisa Sales',
    averageMargin: 20.0,
  },
  {
    id: 'PL-005',
    priceListName: 'Legacy Price List 2024',
    description: 'Previous year pricing - for reference only',
    currency: 'USD',
    effectiveFrom: '2024-01-01',
    effectiveTo: '2024-12-31',
    status: 'expired',
    totalItems: 235,
    priceType: 'standard',
    customerSegment: 'All Customers',
    lastUpdated: '2024-12-31',
    updatedBy: 'System',
    averageMargin: 21.0,
  },
  {
    id: 'PL-006',
    priceListName: 'Education Sector Special Rates',
    description: 'Discounted pricing for schools and universities',
    currency: 'USD',
    effectiveFrom: '2025-11-01',
    effectiveTo: '2026-10-31',
    status: 'draft',
    totalItems: 160,
    priceType: 'custom',
    customerSegment: 'Education',
    lastUpdated: '2025-10-14',
    updatedBy: 'Robert Pricing',
    averageMargin: 17.5,
  },
];

const statusColors = {
  active: 'bg-green-100 text-green-700',
  inactive: 'bg-gray-100 text-gray-700',
  draft: 'bg-yellow-100 text-yellow-700',
  expired: 'bg-red-100 text-red-700',
};

const statusLabels = {
  active: 'Active',
  inactive: 'Inactive',
  draft: 'Draft',
  expired: 'Expired',
};

const priceTypeColors = {
  standard: 'bg-blue-100 text-blue-700',
  promotional: 'bg-purple-100 text-purple-700',
  bulk: 'bg-orange-100 text-orange-700',
  custom: 'bg-pink-100 text-pink-700',
};

const priceTypeLabels = {
  standard: 'Standard',
  promotional: 'Promotional',
  bulk: 'Bulk Order',
  custom: 'Custom',
};

export default function PricingPage() {
  const router = useRouter();
  const [priceLists, setPriceLists] = useState<PriceList[]>(mockPriceLists);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priceTypeFilter, setPriceTypeFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredPriceLists = priceLists.filter((pl) => {
    const matchesSearch =
      pl.priceListName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pl.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pl.customerSegment.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || pl.status === statusFilter;
    const matchesPriceType = priceTypeFilter === 'all' || pl.priceType === priceTypeFilter;
    return matchesSearch && matchesStatus && matchesPriceType;
  });

  const totalPages = Math.ceil(filteredPriceLists.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPriceLists = filteredPriceLists.slice(startIndex, startIndex + itemsPerPage);

  const stats = {
    totalPriceLists: priceLists.length,
    activePriceLists: priceLists.filter((pl) => pl.status === 'active').length,
    totalProducts: priceLists.reduce((sum, pl) => sum + pl.totalItems, 0),
    averageMargin: priceLists.reduce((sum, pl) => sum + pl.averageMargin, 0) / priceLists.length,
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this price list?')) {
      setPriceLists(priceLists.filter((pl) => pl.id !== id));
    }
  };

  const getMarginColor = (margin: number) => {
    if (margin >= 20) return 'text-green-600';
    if (margin >= 15) return 'text-blue-600';
    return 'text-orange-600';
  };

  return (
    <div className="w-full h-full px-4 sm:px-6 lg:px-8 py-6">
      {/* Stats */}
      <div className="mb-6 flex items-start gap-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 flex-1">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total Price Lists</p>
                <p className="text-2xl font-bold text-blue-900 mt-1">{stats.totalPriceLists}</p>
              </div>
              <Tag className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Active Lists</p>
                <p className="text-2xl font-bold text-green-900 mt-1">{stats.activePriceLists}</p>
              </div>
              <Activity className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Total Products</p>
                <p className="text-2xl font-bold text-purple-900 mt-1">{stats.totalProducts}</p>
              </div>
              <Package className="h-8 w-8 text-purple-600" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4 border border-yellow-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-600">Avg Margin</p>
                <p className="text-2xl font-bold text-yellow-900 mt-1">{stats.averageMargin.toFixed(1)}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-yellow-600" />
            </div>
          </div>
        </div>

        <button
          onClick={() => router.push('/estimation/pricing/add')}
          className="flex items-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors h-fit flex-shrink-0"
        >
          <Plus className="h-5 w-5" />
          <span>New Price List</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, description, or customer segment..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={priceTypeFilter}
          onChange={(e) => setPriceTypeFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Price Types</option>
          <option value="standard">Standard</option>
          <option value="promotional">Promotional</option>
          <option value="bulk">Bulk Order</option>
          <option value="custom">Custom</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="draft">Draft</option>
          <option value="inactive">Inactive</option>
          <option value="expired">Expired</option>
        </select>
        <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
          <Download className="h-4 w-4" />
          <span>Export</span>
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price List</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Segment</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Products</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Effective Period</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Margin</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Updated</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedPriceLists.map((pl) => {
                const isExpired = new Date(pl.effectiveTo) < new Date();
                const isActive = pl.status === 'active' && !isExpired;

                return (
                  <tr key={pl.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-start space-x-3">
                        <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                          <DollarSign className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">{pl.priceListName}</div>
                          <div className="text-sm text-gray-500">{pl.id}</div>
                          <div className="text-xs text-gray-400 mt-0.5">{pl.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${priceTypeColors[pl.priceType]}`}>
                        {priceTypeLabels[pl.priceType]}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{pl.customerSegment}</div>
                      <div className="text-sm text-gray-500">{pl.currency}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-1">
                        <Package className="h-4 w-4 text-gray-400" />
                        <span className="font-semibold text-gray-900">{pl.totalItems}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center text-xs text-gray-600">
                          <Calendar className="h-3 w-3 mr-1" />
                          <span>From: {pl.effectiveFrom}</span>
                        </div>
                        <div className={`flex items-center text-xs ${isExpired ? 'text-red-600 font-semibold' : 'text-blue-600'}`}>
                          <Calendar className="h-3 w-3 mr-1" />
                          <span>To: {pl.effectiveTo}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-1">
                        <Percent className={`h-4 w-4 ${getMarginColor(pl.averageMargin)}`} />
                        <span className={`text-lg font-bold ${getMarginColor(pl.averageMargin)}`}>
                          {pl.averageMargin.toFixed(1)}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusColors[pl.status]}`}>
                        {statusLabels[pl.status]}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{pl.lastUpdated}</div>
                      <div className="text-xs text-gray-500">By {pl.updatedBy}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => router.push(`/estimation/pricing/view/${pl.id}`)}
                          className="flex items-center space-x-1 px-3 py-1.5 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-sm font-medium"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                          <span>View</span>
                        </button>
                        <button
                          onClick={() => router.push(`/estimation/pricing/edit/${pl.id}`)}
                          className="flex items-center space-x-1 px-3 py-1.5 text-green-600 bg-green-50 hover:bg-green-100 rounded-lg transition-colors text-sm font-medium"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDelete(pl.id)}
                          className="flex items-center space-x-1 px-3 py-1.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors text-sm font-medium"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span>Delete</span>
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
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredPriceLists.length)} of{' '}
            {filteredPriceLists.length} items
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="flex items-center space-x-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((page) => {
                  return page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1);
                })
                .map((page, index, array) => (
                  <div key={page} className="flex items-center">
                    {index > 0 && array[index - 1] !== page - 1 && <span className="px-2 text-gray-400">...</span>}
                    <button
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1 rounded-lg ${
                        currentPage === page ? 'bg-blue-600 text-white' : 'border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  </div>
                ))}
            </div>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

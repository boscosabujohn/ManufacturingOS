'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Search, Eye, Edit, Trash2, Building2, Star, Phone, Mail, MapPin, TrendingUp, DollarSign, Package, ChevronLeft, ChevronRight, Download } from 'lucide-react';

interface Vendor {
  id: string;
  vendorCode: string;
  vendorName: string;
  contactPerson: string;
  email: string;
  phone: string;
  category: string;
  rating: number;
  status: 'active' | 'inactive' | 'blacklisted' | 'pending_approval';
  totalOrders: number;
  totalSpend: number;
  onTimeDelivery: number;
  qualityScore: number;
  paymentTerms: string;
  address: string;
  city: string;
  country: string;
  registeredDate: string;
  lastOrderDate: string;
}

const mockVendors: Vendor[] = [
  {
    id: 'V-001',
    vendorCode: 'VND-SS-001',
    vendorName: 'Steel Masters Inc',
    contactPerson: 'John Anderson',
    email: 'john@steelmasters.com',
    phone: '+1 234-567-8900',
    category: 'Raw Material',
    rating: 4.8,
    status: 'active',
    totalOrders: 145,
    totalSpend: 1250000,
    onTimeDelivery: 96,
    qualityScore: 98,
    paymentTerms: 'Net 30',
    address: '123 Industrial Ave',
    city: 'Pittsburgh',
    country: 'USA',
    registeredDate: '2023-01-15',
    lastOrderDate: '2025-10-10',
  },
  {
    id: 'V-002',
    vendorCode: 'VND-ELC-002',
    vendorName: 'ElectroTech Solutions',
    contactPerson: 'Sarah Chen',
    email: 's.chen@electrotech.com',
    phone: '+1 234-567-8901',
    category: 'Electronics',
    rating: 4.5,
    status: 'active',
    totalOrders: 89,
    totalSpend: 675000,
    onTimeDelivery: 92,
    qualityScore: 95,
    paymentTerms: 'Net 45',
    address: '456 Tech Park',
    city: 'San Jose',
    country: 'USA',
    registeredDate: '2023-03-20',
    lastOrderDate: '2025-10-08',
  },
  {
    id: 'V-003',
    vendorCode: 'VND-PKG-003',
    vendorName: 'PackPro Industries',
    contactPerson: 'Michael Brown',
    email: 'm.brown@packpro.com',
    phone: '+1 234-567-8902',
    category: 'Packaging',
    rating: 4.2,
    status: 'active',
    totalOrders: 234,
    totalSpend: 450000,
    onTimeDelivery: 88,
    qualityScore: 90,
    paymentTerms: 'Net 30',
    address: '789 Logistics Blvd',
    city: 'Chicago',
    country: 'USA',
    registeredDate: '2022-11-10',
    lastOrderDate: '2025-10-12',
  },
  {
    id: 'V-004',
    vendorCode: 'VND-MCH-004',
    vendorName: 'Precision Machinery Co',
    contactPerson: 'Emily Davis',
    email: 'e.davis@precisionmach.com',
    phone: '+1 234-567-8903',
    category: 'Machinery',
    rating: 4.9,
    status: 'active',
    totalOrders: 23,
    totalSpend: 2300000,
    onTimeDelivery: 98,
    qualityScore: 99,
    paymentTerms: 'Net 60',
    address: '321 Manufacturing St',
    city: 'Detroit',
    country: 'USA',
    registeredDate: '2023-05-15',
    lastOrderDate: '2025-09-28',
  },
  {
    id: 'V-005',
    vendorCode: 'VND-CHM-005',
    vendorName: 'ChemSupply Corp',
    contactPerson: 'Robert Wilson',
    email: 'r.wilson@chemsupply.com',
    phone: '+1 234-567-8904',
    category: 'Chemicals',
    rating: 3.8,
    status: 'inactive',
    totalOrders: 56,
    totalSpend: 340000,
    onTimeDelivery: 82,
    qualityScore: 85,
    paymentTerms: 'Net 30',
    address: '555 Chemical Row',
    city: 'Houston',
    country: 'USA',
    registeredDate: '2023-02-08',
    lastOrderDate: '2025-08-15',
  },
  {
    id: 'V-006',
    vendorCode: 'VND-LOG-006',
    vendorName: 'Global Logistics Partners',
    contactPerson: 'Lisa Martinez',
    email: 'l.martinez@globallog.com',
    phone: '+1 234-567-8905',
    category: 'Logistics',
    rating: 4.6,
    status: 'active',
    totalOrders: 178,
    totalSpend: 890000,
    onTimeDelivery: 94,
    qualityScore: 96,
    paymentTerms: 'Net 15',
    address: '777 Shipping Lane',
    city: 'Los Angeles',
    country: 'USA',
    registeredDate: '2022-09-22',
    lastOrderDate: '2025-10-14',
  },
];

const statusColors = {
  active: 'bg-green-100 text-green-700',
  inactive: 'bg-gray-100 text-gray-700',
  blacklisted: 'bg-red-100 text-red-700',
  pending_approval: 'bg-yellow-100 text-yellow-700',
};

const statusLabels = {
  active: 'Active',
  inactive: 'Inactive',
  blacklisted: 'Blacklisted',
  pending_approval: 'Pending Approval',
};

const getRatingColor = (rating: number) => {
  if (rating >= 4.5) return 'text-green-600';
  if (rating >= 4.0) return 'text-blue-600';
  if (rating >= 3.5) return 'text-yellow-600';
  return 'text-orange-600';
};

export default function VendorsPage() {
  const router = useRouter();
  const [vendors, setVendors] = useState<Vendor[]>(mockVendors);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredVendors = vendors.filter((vendor) => {
    const matchesSearch =
      vendor.vendorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.vendorCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || vendor.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || vendor.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const totalPages = Math.ceil(filteredVendors.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedVendors = filteredVendors.slice(startIndex, startIndex + itemsPerPage);

  const stats = {
    totalVendors: vendors.length,
    activeVendors: vendors.filter((v) => v.status === 'active').length,
    topRated: vendors.filter((v) => v.rating >= 4.5).length,
    totalSpend: vendors.reduce((sum, v) => sum + v.totalSpend, 0),
  };

  const categories = Array.from(new Set(vendors.map((v) => v.category)));

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this vendor?')) {
      setVendors(vendors.filter((v) => v.id !== id));
    }
  };

  return (
    <div className="w-full h-full px-4 sm:px-6 lg:px-8 py-6">
      {/* Stats */}
      <div className="mb-6 flex items-start gap-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 flex-1">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total Vendors</p>
                <p className="text-2xl font-bold text-blue-900 mt-1">{stats.totalVendors}</p>
              </div>
              <Building2 className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Active</p>
                <p className="text-2xl font-bold text-green-900 mt-1">{stats.activeVendors}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4 border border-yellow-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-600">Top Rated</p>
                <p className="text-2xl font-bold text-yellow-900 mt-1">{stats.topRated}</p>
              </div>
              <Star className="h-8 w-8 text-yellow-600" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Total Spend</p>
                <p className="text-2xl font-bold text-purple-900 mt-1">
                  ${(stats.totalSpend / 1000000).toFixed(1)}M
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-purple-600" />
            </div>
          </div>
        </div>

        <button
          onClick={() => router.push('/procurement/vendors/add')}
          className="flex items-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors h-fit flex-shrink-0"
        >
          <Plus className="h-5 w-5" />
          <span>Add Vendor</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search vendors by name, code, contact person..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="blacklisted">Blacklisted</option>
          <option value="pending_approval">Pending Approval</option>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vendor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rating</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Performance</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Orders</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Spend</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedVendors.map((vendor) => (
                <tr key={vendor.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-start space-x-3">
                      <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <Building2 className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{vendor.vendorName}</div>
                        <div className="text-sm text-gray-500">{vendor.vendorCode}</div>
                        <div className="text-xs text-gray-400 mt-0.5 flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {vendor.city}, {vendor.country}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{vendor.contactPerson}</div>
                    <div className="text-xs text-gray-500 flex items-center mt-1">
                      <Mail className="h-3 w-3 mr-1" />
                      {vendor.email}
                    </div>
                    <div className="text-xs text-gray-500 flex items-center mt-0.5">
                      <Phone className="h-3 w-3 mr-1" />
                      {vendor.phone}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                      {vendor.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-1">
                      <Star className={`h-5 w-5 ${getRatingColor(vendor.rating)} fill-current`} />
                      <span className={`text-lg font-bold ${getRatingColor(vendor.rating)}`}>
                        {vendor.rating.toFixed(1)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-600">On-Time:</span>
                        <span className="font-semibold text-green-600">{vendor.onTimeDelivery}%</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-600">Quality:</span>
                        <span className="font-semibold text-blue-600">{vendor.qualityScore}%</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-1">
                      <Package className="h-4 w-4 text-gray-400" />
                      <span className="font-semibold text-gray-900">{vendor.totalOrders}</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">Last: {vendor.lastOrderDate}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-green-700">${(vendor.totalSpend / 1000).toFixed(0)}K</div>
                    <div className="text-xs text-gray-500">{vendor.paymentTerms}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusColors[vendor.status]}`}>
                      {statusLabels[vendor.status]}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => router.push(`/procurement/vendors/view/${vendor.id}`)}
                        className="flex items-center space-x-1 px-3 py-1.5 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-sm font-medium"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                        <span>View</span>
                      </button>
                      <button
                        onClick={() => router.push(`/procurement/vendors/edit/${vendor.id}`)}
                        className="flex items-center space-x-1 px-3 py-1.5 text-green-600 bg-green-50 hover:bg-green-100 rounded-lg transition-colors text-sm font-medium"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete(vendor.id)}
                        className="flex items-center space-x-1 px-3 py-1.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors text-sm font-medium"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredVendors.length)} of{' '}
            {filteredVendors.length} items
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

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Plus,
  Download,
  Upload,
  Grid3x3,
  List,
  SlidersHorizontal,
  FileText,
  Users,
  TrendingUp,
  DollarSign,
  Building2,
  Star,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  PlusCircle,
  FileSpreadsheet,
  MapPin,
  Mail,
  Phone,
  Package,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';
import VendorFilters from '@/components/procurement/VendorFilters';
import VendorCard from '@/components/procurement/VendorCard';

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
  tags?: string[];
  certifications?: string[];
  responseTime?: number;
  disputeRate?: number;
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
    tags: ['Premium', 'ISO 9001', 'Preferred'],
    certifications: ['ISO 9001', 'ISO 14001'],
    responseTime: 2.5,
    disputeRate: 0.5
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
    tags: ['Reliable', 'Tech Leader'],
    certifications: ['ISO 9001'],
    responseTime: 1.8,
    disputeRate: 1.2
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
    tags: ['Volume Discount', 'Eco-Friendly'],
    certifications: ['ISO 14001'],
    responseTime: 2.1,
    disputeRate: 0.8
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
    tags: ['Premium', 'Strategic Partner', 'Innovation'],
    certifications: ['ISO 9001', 'CE', 'ASME'],
    responseTime: 1.2,
    disputeRate: 0.2
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
    tags: ['Under Review'],
    certifications: ['REACH'],
    responseTime: 3.5,
    disputeRate: 2.1
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
    tags: ['Fast Delivery', 'Global Network'],
    certifications: ['ISO 9001', 'C-TPAT'],
    responseTime: 1.5,
    disputeRate: 0.6
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
  const [filteredVendors, setFilteredVendors] = useState<Vendor[]>(mockVendors);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [selectedVendors, setSelectedVendors] = useState<string[]>([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState<string>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const handleFiltersChange = (filters: any) => {
    let filtered = [...vendors];

    // Apply all filters
    Object.keys(filters).forEach(key => {
      if (filters[key] !== 'all') {
        switch(key) {
          case 'status':
            filtered = filtered.filter(v => v.status === filters[key]);
            break;
          case 'category':
            filtered = filtered.filter(v => v.category === filters[key]);
            break;
          case 'rating':
            if (filters[key] === 'top') filtered = filtered.filter(v => v.rating >= 4.5);
            else if (filters[key] === 'good') filtered = filtered.filter(v => v.rating >= 4.0);
            else if (filters[key] === 'average') filtered = filtered.filter(v => v.rating >= 3.5);
            else if (filters[key] === 'below') filtered = filtered.filter(v => v.rating < 3.5);
            break;
          case 'performance':
            const perf = (v: Vendor) => (v.onTimeDelivery + v.qualityScore) / 2;
            if (filters[key] === 'excellent') filtered = filtered.filter(v => perf(v) >= 90);
            else if (filters[key] === 'good') filtered = filtered.filter(v => perf(v) >= 80);
            else if (filters[key] === 'average') filtered = filtered.filter(v => perf(v) >= 70);
            else if (filters[key] === 'poor') filtered = filtered.filter(v => perf(v) < 70);
            break;
          case 'country':
            filtered = filtered.filter(v => v.country === filters[key]);
            break;
          case 'paymentTerms':
            const termMap: any = { net15: 'Net 15', net30: 'Net 30', net45: 'Net 45', net60: 'Net 60' };
            filtered = filtered.filter(v => v.paymentTerms === termMap[filters[key]]);
            break;
          case 'spendRange':
            if (filters[key] === 'high') filtered = filtered.filter(v => v.totalSpend >= 1000000);
            else if (filters[key] === 'medium') filtered = filtered.filter(v => v.totalSpend >= 100000 && v.totalSpend < 1000000);
            else if (filters[key] === 'low') filtered = filtered.filter(v => v.totalSpend >= 10000 && v.totalSpend < 100000);
            else if (filters[key] === 'minimal') filtered = filtered.filter(v => v.totalSpend < 10000);
            break;
        }
      }
    });

    // Apply sorting
    filtered.sort((a, b) => {
      let compareValue = 0;
      switch(sortBy) {
        case 'name':
          compareValue = a.vendorName.localeCompare(b.vendorName);
          break;
        case 'rating':
          compareValue = b.rating - a.rating;
          break;
        case 'orders':
          compareValue = b.totalOrders - a.totalOrders;
          break;
        case 'spend':
          compareValue = b.totalSpend - a.totalSpend;
          break;
        case 'performance':
          const perfA = (a.onTimeDelivery + a.qualityScore) / 2;
          const perfB = (b.onTimeDelivery + b.qualityScore) / 2;
          compareValue = perfB - perfA;
          break;
      }
      return sortOrder === 'asc' ? compareValue : -compareValue;
    });

    setFilteredVendors(filtered);
    setCurrentPage(1);
  };

  const handleSearchChange = (search: string) => {
    const filtered = vendors.filter((vendor) => {
      return vendor.vendorName.toLowerCase().includes(search.toLowerCase()) ||
             vendor.vendorCode.toLowerCase().includes(search.toLowerCase()) ||
             vendor.contactPerson.toLowerCase().includes(search.toLowerCase()) ||
             vendor.email.toLowerCase().includes(search.toLowerCase()) ||
             vendor.city.toLowerCase().includes(search.toLowerCase());
    });
    setFilteredVendors(filtered);
    setCurrentPage(1);
  };

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
  const countries = Array.from(new Set(vendors.map((v) => v.country)));

  const handleVendorSelect = (id: string) => {
    if (selectedVendors.includes(id)) {
      setSelectedVendors(selectedVendors.filter(v => v !== id));
    } else {
      setSelectedVendors([...selectedVendors, id]);
    }
    setShowBulkActions(selectedVendors.length > 0 || (!selectedVendors.includes(id) && selectedVendors.length === 0));
  };

  const handleSelectAll = () => {
    if (selectedVendors.length === paginatedVendors.length) {
      setSelectedVendors([]);
      setShowBulkActions(false);
    } else {
      setSelectedVendors(paginatedVendors.map(v => v.id));
      setShowBulkActions(true);
    }
  };

  const handleBulkExport = () => {
    console.log('Exporting selected vendors:', selectedVendors);
  };

  const handleBulkDelete = () => {
    if (confirm(`Are you sure you want to delete ${selectedVendors.length} vendors?`)) {
      setVendors(vendors.filter(v => !selectedVendors.includes(v.id)));
      setFilteredVendors(filteredVendors.filter(v => !selectedVendors.includes(v.id)));
      setSelectedVendors([]);
      setShowBulkActions(false);
    }
  };

  const handleCompare = (id: string) => {
    console.log('Comparing vendor:', id);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this vendor?')) {
      setVendors(vendors.filter((v) => v.id !== id));
      setFilteredVendors(filteredVendors.filter((v) => v.id !== id));
    }
  };

  const handleView = (id: string) => {
    router.push(`/procurement/vendors/view/${id}`);
  };

  const handleEdit = (id: string) => {
    router.push(`/procurement/vendors/edit/${id}`);
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Vendor Management</h1>
            <p className="text-gray-600 mt-1">Manage your suppliers and track performance</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/procurement/vendors/import')}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Upload className="h-4 w-4" />
              Import
            </button>
            <button
              onClick={() => router.push('/procurement/vendors/add')}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md"
            >
              <PlusCircle className="h-4 w-4" />
              Add Vendor
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-start gap-4">
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

      </div>
      </div>

      {/* Filters */}
      <VendorFilters
        onFiltersChange={handleFiltersChange}
        onSearchChange={handleSearchChange}
        categories={categories}
        countries={countries}
        totalCount={filteredVendors.length}
      />

      {/* Bulk Actions Bar */}
      {showBulkActions && selectedVendors.length > 0 && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-blue-900">
              {selectedVendors.length} vendor{selectedVendors.length > 1 ? 's' : ''} selected
            </span>
            <button
              onClick={handleSelectAll}
              className="text-sm text-blue-600 hover:text-blue-700 underline"
            >
              {selectedVendors.length === paginatedVendors.length ? 'Deselect all' : 'Select all'}
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleBulkExport}
              className="px-3 py-1.5 bg-white border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-100 text-sm font-medium"
            >
              Export Selected
            </button>
            <button
              onClick={handleBulkDelete}
              className="px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium"
            >
              Delete Selected
            </button>
          </div>
        </div>
      )}

      {/* View Controls */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-white border border-gray-300 rounded-lg">
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'} rounded-l-lg transition-colors`}
            >
              <List className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'} rounded-r-lg transition-colors`}
            >
              <Grid3x3 className="h-4 w-4" />
            </button>
          </div>

          {/* Sort Options */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm"
          >
            <option value="name">Sort by Name</option>
            <option value="rating">Sort by Rating</option>
            <option value="orders">Sort by Orders</option>
            <option value="spend">Sort by Spend</option>
            <option value="performance">Sort by Performance</option>
          </select>

          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <SlidersHorizontal className="h-4 w-4" />
          </button>

          {/* Items per page */}
          <select
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm"
          >
            <option value={10}>10 per page</option>
            <option value={20}>20 per page</option>
            <option value={50}>50 per page</option>
            <option value={100}>100 per page</option>
          </select>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </button>
          <button className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
            <FileSpreadsheet className="h-4 w-4" />
            Export All
          </button>
        </div>
      </div>

      {/* Vendors Display */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {paginatedVendors.map((vendor) => (
            <VendorCard
              key={vendor.id}
              vendor={vendor}
              viewMode="grid"
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onCompare={handleCompare}
              isSelected={selectedVendors.includes(vendor.id)}
              onSelect={handleVendorSelect}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {/* Select All Checkbox for List View */}
          {viewMode === 'list' && (
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center gap-4">
                <input
                  type="checkbox"
                  checked={selectedVendors.length === paginatedVendors.length && paginatedVendors.length > 0}
                  onChange={handleSelectAll}
                  className="h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">Select All</span>
              </div>
            </div>
          )}

          {paginatedVendors.map((vendor) => (
            <VendorCard
              key={vendor.id}
              vendor={vendor}
              viewMode="list"
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onCompare={handleCompare}
              isSelected={selectedVendors.includes(vendor.id)}
              onSelect={handleVendorSelect}
            />
          ))}
        </div>
      )}

      {/* Old Table Code - Removing */}
      {false && (
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
                       
                      >
                        <Eye className="h-4 w-4" />
                        <span>View</span>
                      </button>
                      <button
                        onClick={() => router.push(`/procurement/vendors/edit/${vendor.id}`)}
                        className="flex items-center space-x-1 px-3 py-1.5 text-green-600 bg-green-50 hover:bg-green-100 rounded-lg transition-colors text-sm font-medium"
                       
                      >
                        <Edit className="h-4 w-4" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete(vendor.id)}
                        className="flex items-center space-x-1 px-3 py-1.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors text-sm font-medium"
                       
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
        </div>
      )}

      {/* Pagination */}
      <div className="bg-white rounded-lg border border-gray-200">
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

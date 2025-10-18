'use client';

import React, { useState } from 'react';
import { Plus, Search, Filter, Edit, Trash2, Eye, Truck, Phone, Mail, MapPin, Building, Star, DollarSign, CreditCard, FileText, Download, Upload, MoreHorizontal, Grid, List, Package } from 'lucide-react';

interface Vendor {
  id: string;
  vendorCode: string;
  vendorName: string;
  vendorType: 'supplier' | 'contractor' | 'service_provider' | 'manufacturer';
  category: string;
  status: 'active' | 'inactive' | 'blacklisted' | 'pending_approval';
  contactPerson: string;
  email: string;
  phone: string;
  mobile: string;
  website?: string;
  address: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
  taxInfo: {
    taxId?: string;
    vatNumber?: string;
    taxClassification: string;
  };
  paymentInfo: {
    paymentTerms: string;
    preferredPaymentMethod: string;
    bankName?: string;
    accountNumber?: string;
    routingNumber?: string;
  };
  qualifications: {
    certifications: string[];
    licenses: string[];
    insuranceExpiry?: string;
    qualityRating: 'excellent' | 'good' | 'fair' | 'poor';
  };
  supplierInfo: {
    leadTime: number;
    minimumOrderValue: number;
    currency: string;
    priceValidity: number;
    suppliedCategories: string[];
  };
  performance: {
    onTimeDelivery: number;
    qualityScore: number;
    totalOrders: number;
    totalValue: number;
    lastOrderDate?: string;
    averageOrderValue: number;
  };
  createdAt: string;
  updatedAt: string;
}

const mockVendors: Vendor[] = [
  {
    id: '1',
    vendorCode: 'VEND001',
    vendorName: 'Premium Hardware Supplies Inc.',
    vendorType: 'supplier',
    category: 'Hardware',
    status: 'active',
    contactPerson: 'Michael Johnson',
    email: 'mjohnson@premiumhardware.com',
    phone: '+1-555-234-5678',
    mobile: '+1-555-876-5432',
    website: 'www.premiumhardware.com',
    address: {
      line1: '789 Industrial Drive',
      line2: 'Building A',
      city: 'Atlanta',
      state: 'GA',
      country: 'USA',
      postalCode: '30309'
    },
    taxInfo: {
      taxId: '98-7654321',
      vatNumber: 'US987654321',
      taxClassification: 'Corporation'
    },
    paymentInfo: {
      paymentTerms: 'Net 30',
      preferredPaymentMethod: 'ACH',
      bankName: 'First National Bank',
      accountNumber: '****5678',
      routingNumber: '021000021'
    },
    qualifications: {
      certifications: ['ISO 9001', 'ANSI Z535'],
      licenses: ['General Contractor', 'Wholesale Distributor'],
      insuranceExpiry: '2024-12-31',
      qualityRating: 'excellent'
    },
    supplierInfo: {
      leadTime: 5,
      minimumOrderValue: 500,
      currency: 'USD',
      priceValidity: 90,
      suppliedCategories: ['Cabinet Hardware', 'Hinges', 'Handles', 'Slides']
    },
    performance: {
      onTimeDelivery: 95,
      qualityScore: 4.8,
      totalOrders: 127,
      totalValue: 485000,
      lastOrderDate: '2024-01-15',
      averageOrderValue: 3819
    },
    createdAt: '2023-03-15',
    updatedAt: '2024-01-15'
  },
  {
    id: '2',
    vendorCode: 'VEND002',
    vendorName: 'Elite Wood Solutions',
    vendorType: 'manufacturer',
    category: 'Wood Materials',
    status: 'active',
    contactPerson: 'Sarah Williams',
    email: 'swilliams@elitewood.com',
    phone: '+1-555-345-6789',
    mobile: '+1-555-765-4321',
    website: 'www.elitewood.com',
    address: {
      line1: '456 Lumber Mill Road',
      city: 'Portland',
      state: 'OR',
      country: 'USA',
      postalCode: '97201'
    },
    taxInfo: {
      taxId: '87-6543210',
      vatNumber: 'US876543210',
      taxClassification: 'Corporation'
    },
    paymentInfo: {
      paymentTerms: 'Net 45',
      preferredPaymentMethod: 'Wire Transfer',
      bankName: 'Pacific Credit Union',
      accountNumber: '****1234',
      routingNumber: '323371076'
    },
    qualifications: {
      certifications: ['FSC Certified', 'CARB Phase 2'],
      licenses: ['Timber Harvesting', 'Manufacturing'],
      insuranceExpiry: '2024-08-30',
      qualityRating: 'excellent'
    },
    supplierInfo: {
      leadTime: 14,
      minimumOrderValue: 2000,
      currency: 'USD',
      priceValidity: 60,
      suppliedCategories: ['Plywood', 'Hardwood', 'MDF', 'Particle Board']
    },
    performance: {
      onTimeDelivery: 88,
      qualityScore: 4.6,
      totalOrders: 89,
      totalValue: 675000,
      lastOrderDate: '2024-01-08',
      averageOrderValue: 7584
    },
    createdAt: '2023-05-20',
    updatedAt: '2024-01-08'
  }
];

const vendorCategories = ['Hardware', 'Wood Materials', 'Appliances', 'Countertops', 'Flooring', 'Electrical', 'Plumbing', 'Tools'];
const suppliedCategories = [
  'Cabinet Hardware', 'Hinges', 'Handles', 'Slides', 'Plywood', 'Hardwood', 'MDF', 'Particle Board',
  'Appliances', 'Countertops', 'Tile', 'Hardwood Flooring', 'Electrical Components', 'Plumbing Fixtures'
];

export default function VendorMaster() {
  const [vendors, setVendors] = useState<Vendor[]>(mockVendors);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showModal, setShowModal] = useState(false);
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [activeTab, setActiveTab] = useState('basic');

  const filteredVendors = vendors.filter(vendor => {
    const matchesSearch = vendor.vendorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vendor.vendorCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vendor.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || vendor.vendorType === filterType;
    const matchesCategory = filterCategory === 'all' || vendor.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || vendor.status === filterStatus;

    return matchesSearch && matchesType && matchesCategory && matchesStatus;
  });

  const handleAddVendor = () => {
    setEditingVendor(null);
    setShowModal(true);
    setActiveTab('basic');
  };

  const handleEditVendor = (vendor: Vendor) => {
    setEditingVendor(vendor);
    setShowModal(true);
    setActiveTab('basic');
  };

  const handleDeleteVendor = (id: string) => {
    if (confirm('Are you sure you want to delete this vendor?')) {
      setVendors(vendors.filter(vendor => vendor.id !== id));
    }
  };

  const handleSaveVendor = (vendorData: any) => {
    if (editingVendor) {
      setVendors(vendors.map(vendor =>
        vendor.id === editingVendor.id
          ? { ...vendor, ...vendorData, updatedAt: new Date().toISOString().split('T')[0] }
          : vendor
      ));
    } else {
      const newVendor: Vendor = {
        id: Date.now().toString(),
        ...vendorData,
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0]
      };
      setVendors([...vendors, newVendor]);
    }
    setShowModal(false);
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-yellow-100 text-yellow-800',
      blacklisted: 'bg-red-100 text-red-800',
      pending_approval: 'bg-blue-100 text-blue-800'
    };
    return `px-2 py-1 rounded-full text-xs font-medium ${colors[status as keyof typeof colors]}`;
  };

  const getRatingBadge = (rating: string) => {
    const colors = {
      excellent: 'bg-green-100 text-green-800',
      good: 'bg-blue-100 text-blue-800',
      fair: 'bg-yellow-100 text-yellow-800',
      poor: 'bg-red-100 text-red-800'
    };
    return `px-2 py-1 rounded-full text-xs font-medium ${colors[rating as keyof typeof colors]}`;
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Truck className="w-8 h-8 text-blue-600" />
              Vendor Master
            </h1>
            <p className="text-gray-600">Manage supplier and vendor information</p>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Upload className="w-4 h-4" />
              Import
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Download className="w-4 h-4" />
              Export
            </button>
            <button
              onClick={handleAddVendor}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" />
              Add Vendor
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search vendors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Types</option>
            <option value="supplier">Supplier</option>
            <option value="contractor">Contractor</option>
            <option value="service_provider">Service Provider</option>
            <option value="manufacturer">Manufacturer</option>
          </select>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Categories</option>
            {vendorCategories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="blacklisted">Blacklisted</option>
            <option value="pending_approval">Pending Approval</option>
          </select>
          <div className="flex border border-gray-300 rounded-lg">
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-2 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-2 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <Grid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {viewMode === 'list' ? (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performance</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supply Info</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredVendors.map((vendor) => (
                  <tr key={vendor.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{vendor.vendorName}</div>
                        <div className="text-sm text-gray-500">{vendor.vendorCode}</div>
                        <div className="text-sm text-gray-500">{vendor.category}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="capitalize text-sm text-gray-900">{vendor.vendorType.replace('_', ' ')}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{vendor.contactPerson}</div>
                      <div className="text-sm text-gray-500 flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {vendor.email}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        {vendor.phone}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">On-time: {vendor.performance.onTimeDelivery}%</div>
                      <div className="text-sm text-gray-500">Quality: {vendor.performance.qualityScore}/5</div>
                      <span className={getRatingBadge(vendor.qualifications.qualityRating)}>
                        {vendor.qualifications.qualityRating}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">Lead: {vendor.supplierInfo.leadTime} days</div>
                      <div className="text-sm text-gray-500">Min: ${vendor.supplierInfo.minimumOrderValue.toLocaleString()}</div>
                      <div className="text-sm text-gray-500">{vendor.supplierInfo.suppliedCategories.length} categories</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={getStatusBadge(vendor.status)}>
                        {vendor.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditVendor(vendor)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-900">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteVendor(vendor.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVendors.map((vendor) => (
            <div key={vendor.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{vendor.vendorName}</h3>
                  <p className="text-sm text-gray-500">{vendor.vendorCode}</p>
                  <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">{vendor.category}</span>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleEditVendor(vendor)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteVendor(vendor.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="w-4 h-4" />
                  {vendor.email}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone className="w-4 h-4" />
                  {vendor.phone}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4" />
                  {vendor.address.city}, {vendor.address.state}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Package className="w-4 h-4" />
                  Lead: {vendor.supplierInfo.leadTime} days
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className={getStatusBadge(vendor.status)}>
                  {vendor.status.replace('_', ' ')}
                </span>
                <span className={getRatingBadge(vendor.qualifications.qualityRating)}>
                  {vendor.qualifications.qualityRating}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <VendorModal
          vendor={editingVendor}
          onSave={handleSaveVendor}
          onClose={() => setShowModal(false)}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      )}
    </div>
  );
}

interface VendorModalProps {
  vendor: Vendor | null;
  onSave: (vendor: any) => void;
  onClose: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

function VendorModal({ vendor, onSave, onClose, activeTab, setActiveTab }: VendorModalProps) {
  const [formData, setFormData] = useState({
    vendorCode: vendor?.vendorCode || '',
    vendorName: vendor?.vendorName || '',
    vendorType: vendor?.vendorType || 'supplier',
    category: vendor?.category || '',
    status: vendor?.status || 'active',
    contactPerson: vendor?.contactPerson || '',
    email: vendor?.email || '',
    phone: vendor?.phone || '',
    mobile: vendor?.mobile || '',
    website: vendor?.website || '',
    address: vendor?.address || {
      line1: '',
      line2: '',
      city: '',
      state: '',
      country: '',
      postalCode: ''
    },
    taxInfo: vendor?.taxInfo || {
      taxId: '',
      vatNumber: '',
      taxClassification: ''
    },
    paymentInfo: vendor?.paymentInfo || {
      paymentTerms: 'Net 30',
      preferredPaymentMethod: 'ACH',
      bankName: '',
      accountNumber: '',
      routingNumber: ''
    },
    qualifications: vendor?.qualifications || {
      certifications: [],
      licenses: [],
      insuranceExpiry: '',
      qualityRating: 'good'
    },
    supplierInfo: vendor?.supplierInfo || {
      leadTime: 0,
      minimumOrderValue: 0,
      currency: 'USD',
      priceValidity: 30,
      suppliedCategories: []
    },
    performance: vendor?.performance || {
      onTimeDelivery: 0,
      qualityScore: 0,
      totalOrders: 0,
      totalValue: 0,
      lastOrderDate: '',
      averageOrderValue: 0
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: Building },
    { id: 'contact', label: 'Contact & Address', icon: MapPin },
    { id: 'tax', label: 'Tax & Payment', icon: FileText },
    { id: 'qualifications', label: 'Qualifications', icon: Star },
    { id: 'supply', label: 'Supply Info', icon: Package },
    { id: 'performance', label: 'Performance', icon: DollarSign }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            {vendor ? 'Edit Vendor' : 'Add New Vendor'}
          </h2>
        </div>

        <div className="flex border-b border-gray-200">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 text-sm font-medium border-b-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </div>
              </button>
            );
          })}
        </div>

        <form onSubmit={handleSubmit} className="overflow-y-auto max-h-96">
          <div className="px-6 py-4">
            {activeTab === 'basic' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Vendor Code</label>
                  <input
                    type="text"
                    value={formData.vendorCode}
                    onChange={(e) => setFormData({...formData, vendorCode: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Vendor Name</label>
                  <input
                    type="text"
                    value={formData.vendorName}
                    onChange={(e) => setFormData({...formData, vendorName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Vendor Type</label>
                  <select
                    value={formData.vendorType}
                    onChange={(e) => setFormData({...formData, vendorType: e.target.value as any})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="supplier">Supplier</option>
                    <option value="contractor">Contractor</option>
                    <option value="service_provider">Service Provider</option>
                    <option value="manufacturer">Manufacturer</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Category</option>
                    {vendorCategories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact Person</label>
                  <input
                    type="text"
                    value={formData.contactPerson}
                    onChange={(e) => setFormData({...formData, contactPerson: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value as any})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="blacklisted">Blacklisted</option>
                    <option value="pending_approval">Pending Approval</option>
                  </select>
                </div>
              </div>
            )}

            {activeTab === 'contact' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mobile</label>
                    <input
                      type="tel"
                      value={formData.mobile}
                      onChange={(e) => setFormData({...formData, mobile: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                    <input
                      type="url"
                      value={formData.website}
                      onChange={(e) => setFormData({...formData, website: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Address</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 1</label>
                      <input
                        type="text"
                        value={formData.address.line1}
                        onChange={(e) => setFormData({...formData, address: {...formData.address, line1: e.target.value}})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 2</label>
                      <input
                        type="text"
                        value={formData.address.line2}
                        onChange={(e) => setFormData({...formData, address: {...formData.address, line2: e.target.value}})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                      <input
                        type="text"
                        value={formData.address.city}
                        onChange={(e) => setFormData({...formData, address: {...formData.address, city: e.target.value}})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                      <input
                        type="text"
                        value={formData.address.state}
                        onChange={(e) => setFormData({...formData, address: {...formData.address, state: e.target.value}})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'supply' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Lead Time (days)</label>
                  <input
                    type="number"
                    value={formData.supplierInfo.leadTime}
                    onChange={(e) => setFormData({...formData, supplierInfo: {...formData.supplierInfo, leadTime: Number(e.target.value)}})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Order Value</label>
                  <input
                    type="number"
                    value={formData.supplierInfo.minimumOrderValue}
                    onChange={(e) => setFormData({...formData, supplierInfo: {...formData.supplierInfo, minimumOrderValue: Number(e.target.value)}})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                  <select
                    value={formData.supplierInfo.currency}
                    onChange={(e) => setFormData({...formData, supplierInfo: {...formData.supplierInfo, currency: e.target.value}})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                    <option value="CAD">CAD</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price Validity (days)</label>
                  <input
                    type="number"
                    value={formData.supplierInfo.priceValidity}
                    onChange={(e) => setFormData({...formData, supplierInfo: {...formData.supplierInfo, priceValidity: Number(e.target.value)}})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            )}
          </div>
        </form>

        <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {vendor ? 'Update Vendor' : 'Create Vendor'}
          </button>
        </div>
      </div>
    </div>
  );
}
'use client';

import React, { useState, useEffect } from 'react';
import {
  Building2, Plus, Search, Filter, Edit3, Eye, Trash2, Upload,
  Download, Copy, MoreVertical, MapPin, Phone, Mail, Globe,
  Calendar, Users, Package, DollarSign, FileText, CheckCircle,
  XCircle, AlertCircle, Settings, Save, X, Check
} from 'lucide-react';

interface Company {
  id: string;
  code: string;
  name: string;
  shortName: string;
  type: 'holding' | 'subsidiary' | 'branch' | 'division';
  parentCompany?: string;
  status: 'active' | 'inactive' | 'suspended';
  incorporationDate: string;
  registrationNumber: string;
  taxId: string;
  address: {
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
  };
  contact: {
    phone?: string;
    email?: string;
    website?: string;
    fax?: string;
  };
  financial: {
    baseCurrency: string;
    fiscalYearStart: string;
    reportingCurrency?: string;
  };
  legal: {
    legalName: string;
    businessType: string;
    industry: string;
    licenses: string[];
  };
  logo?: string;
  createdBy: string;
  createdAt: string;
  updatedBy?: string;
  updatedAt?: string;
}

const CompanyMaster: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('create');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [isLoading, setIsLoading] = useState(false);

  // Mock data - In real app, this would come from API
  const mockCompanies: Company[] = [
    {
      id: 'COMP001',
      code: 'KAI',
      name: 'KreupAI Technologies LLC',
      shortName: 'KreupAI',
      type: 'holding',
      status: 'active',
      incorporationDate: '2020-01-15',
      registrationNumber: 'LLC-2020-001',
      taxId: 'TAX123456789',
      address: {
        line1: '123 Technology Drive',
        line2: 'Suite 500',
        city: 'San Francisco',
        state: 'California',
        country: 'United States',
        postalCode: '94105'
      },
      contact: {
        phone: '+1-555-0123',
        email: 'info@kreupai.com',
        website: 'https://kreupai.com',
        fax: '+1-555-0124'
      },
      financial: {
        baseCurrency: 'USD',
        fiscalYearStart: '01-01',
        reportingCurrency: 'USD'
      },
      legal: {
        legalName: 'KreupAI Technologies Limited Liability Company',
        businessType: 'Limited Liability Company',
        industry: 'Technology',
        licenses: ['Business License', 'Technology License']
      },
      createdBy: 'admin',
      createdAt: '2024-01-15T10:00:00Z',
      updatedBy: 'admin',
      updatedAt: '2024-12-16T10:00:00Z'
    },
    {
      id: 'COMP002',
      code: 'B3M',
      name: 'B3 MACBIS Manufacturing',
      shortName: 'B3 MACBIS',
      type: 'subsidiary',
      parentCompany: 'COMP001',
      status: 'active',
      incorporationDate: '2021-03-20',
      registrationNumber: 'SUB-2021-002',
      taxId: 'TAX987654321',
      address: {
        line1: '456 Manufacturing Blvd',
        city: 'Detroit',
        state: 'Michigan',
        country: 'United States',
        postalCode: '48201'
      },
      contact: {
        phone: '+1-555-0125',
        email: 'info@b3macbis.com',
        website: 'https://b3macbis.com'
      },
      financial: {
        baseCurrency: 'USD',
        fiscalYearStart: '01-01'
      },
      legal: {
        legalName: 'B3 MACBIS Manufacturing Corporation',
        businessType: 'Corporation',
        industry: 'Kitchen Manufacturing',
        licenses: ['Manufacturing License', 'Safety Certification']
      },
      createdBy: 'admin',
      createdAt: '2024-03-20T10:00:00Z'
    },
    {
      id: 'COMP003',
      code: 'B3EU',
      name: 'B3 MACBIS Europe',
      shortName: 'B3 Europe',
      type: 'branch',
      parentCompany: 'COMP002',
      status: 'active',
      incorporationDate: '2022-06-10',
      registrationNumber: 'EU-2022-003',
      taxId: 'EU123456789',
      address: {
        line1: '789 Industrial Park',
        city: 'Berlin',
        state: 'Berlin',
        country: 'Germany',
        postalCode: '10115'
      },
      contact: {
        phone: '+49-30-12345678',
        email: 'info@b3macbis.eu',
        website: 'https://b3macbis.eu'
      },
      financial: {
        baseCurrency: 'EUR',
        fiscalYearStart: '01-01'
      },
      legal: {
        legalName: 'B3 MACBIS Europe GmbH',
        businessType: 'GmbH',
        industry: 'Kitchen Manufacturing',
        licenses: ['EU Manufacturing License', 'CE Certification']
      },
      createdBy: 'admin',
      createdAt: '2024-06-10T10:00:00Z'
    }
  ];

  useEffect(() => {
    // Simulate API call
    setIsLoading(true);
    setTimeout(() => {
      setCompanies(mockCompanies);
      setFilteredCompanies(mockCompanies);
      setIsLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let filtered = companies;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(company =>
        company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.shortName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(company => company.status === filterStatus);
    }

    // Filter by type
    if (filterType !== 'all') {
      filtered = filtered.filter(company => company.type === filterType);
    }

    setFilteredCompanies(filtered);
  }, [companies, searchTerm, filterStatus, filterType]);

  const handleCreateCompany = () => {
    setSelectedCompany(null);
    setModalMode('create');
    setIsModalOpen(true);
  };

  const handleEditCompany = (company: Company) => {
    setSelectedCompany(company);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleViewCompany = (company: Company) => {
    setSelectedCompany(company);
    setModalMode('view');
    setIsModalOpen(true);
  };

  const handleDeleteCompany = (companyId: string) => {
    if (confirm('Are you sure you want to delete this company? This action cannot be undone.')) {
      setCompanies(companies.filter(c => c.id !== companyId));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4" />;
      case 'inactive': return <XCircle className="h-4 w-4" />;
      case 'suspended': return <AlertCircle className="h-4 w-4" />;
      default: return <XCircle className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'holding': return 'bg-purple-100 text-purple-800';
      case 'subsidiary': return 'bg-blue-100 text-blue-800';
      case 'branch': return 'bg-green-100 text-green-800';
      case 'division': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const CompanyModal = () => {
    const [formData, setFormData] = useState<Partial<Company>>(
      selectedCompany || {
        code: '',
        name: '',
        shortName: '',
        type: 'subsidiary',
        status: 'active',
        incorporationDate: '',
        registrationNumber: '',
        taxId: '',
        address: {
          line1: '',
          line2: '',
          city: '',
          state: '',
          country: '',
          postalCode: ''
        },
        contact: {
          phone: '',
          email: '',
          website: '',
          fax: ''
        },
        financial: {
          baseCurrency: 'USD',
          fiscalYearStart: '01-01',
          reportingCurrency: ''
        },
        legal: {
          legalName: '',
          businessType: '',
          industry: '',
          licenses: []
        }
      }
    );

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      // Here you would typically call an API
      console.log('Submitting:', formData);
      setIsModalOpen(false);
    };

    const isViewMode = modalMode === 'view';

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center p-6 border-b">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              {modalMode === 'create' ? 'Create Company' : modalMode === 'edit' ? 'Edit Company' : 'Company Details'}
            </h2>
            <button
              onClick={() => setIsModalOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Company Code *</label>
                <input
                  type="text"
                  value={formData.code || ''}
                  onChange={(e) => setFormData({...formData, code: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., KAI"
                  disabled={isViewMode}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Company Type *</label>
                <select
                  value={formData.type || ''}
                  onChange={(e) => setFormData({...formData, type: e.target.value as Company['type']})}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  disabled={isViewMode}
                  required
                >
                  <option value="holding">Holding Company</option>
                  <option value="subsidiary">Subsidiary</option>
                  <option value="branch">Branch Office</option>
                  <option value="division">Division</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Company Name *</label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Full company name"
                  disabled={isViewMode}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Short Name *</label>
                <input
                  type="text"
                  value={formData.shortName || ''}
                  onChange={(e) => setFormData({...formData, shortName: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Short name"
                  disabled={isViewMode}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select
                  value={formData.status || 'active'}
                  onChange={(e) => setFormData({...formData, status: e.target.value as Company['status']})}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  disabled={isViewMode}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Incorporation Date</label>
                <input
                  type="date"
                  value={formData.incorporationDate || ''}
                  onChange={(e) => setFormData({...formData, incorporationDate: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  disabled={isViewMode}
                />
              </div>
            </div>

            {/* Registration Details */}
            <div className="border-t pt-4">
              <h3 className="text-lg font-medium mb-3">Registration Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Registration Number</label>
                  <input
                    type="text"
                    value={formData.registrationNumber || ''}
                    onChange={(e) => setFormData({...formData, registrationNumber: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    disabled={isViewMode}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Tax ID</label>
                  <input
                    type="text"
                    value={formData.taxId || ''}
                    onChange={(e) => setFormData({...formData, taxId: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    disabled={isViewMode}
                  />
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div className="border-t pt-4">
              <h3 className="text-lg font-medium mb-3">Address Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Address Line 1</label>
                  <input
                    type="text"
                    value={formData.address?.line1 || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      address: {...formData.address, line1: e.target.value}
                    })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    disabled={isViewMode}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Address Line 2</label>
                  <input
                    type="text"
                    value={formData.address?.line2 || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      address: {...formData.address, line2: e.target.value}
                    })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    disabled={isViewMode}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">City</label>
                    <input
                      type="text"
                      value={formData.address?.city || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        address: {...formData.address, city: e.target.value}
                      })}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      disabled={isViewMode}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">State</label>
                    <input
                      type="text"
                      value={formData.address?.state || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        address: {...formData.address, state: e.target.value}
                      })}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      disabled={isViewMode}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Country</label>
                    <input
                      type="text"
                      value={formData.address?.country || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        address: {...formData.address, country: e.target.value}
                      })}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      disabled={isViewMode}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Postal Code</label>
                    <input
                      type="text"
                      value={formData.address?.postalCode || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        address: {...formData.address, postalCode: e.target.value}
                      })}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      disabled={isViewMode}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="border-t pt-4">
              <h3 className="text-lg font-medium mb-3">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Phone</label>
                  <input
                    type="tel"
                    value={formData.contact?.phone || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      contact: {...formData.contact, phone: e.target.value}
                    })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    disabled={isViewMode}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.contact?.email || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      contact: {...formData.contact, email: e.target.value}
                    })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    disabled={isViewMode}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Website</label>
                  <input
                    type="url"
                    value={formData.contact?.website || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      contact: {...formData.contact, website: e.target.value}
                    })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    disabled={isViewMode}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Fax</label>
                  <input
                    type="tel"
                    value={formData.contact?.fax || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      contact: {...formData.contact, fax: e.target.value}
                    })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    disabled={isViewMode}
                  />
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                {isViewMode ? 'Close' : 'Cancel'}
              </button>
              {!isViewMode && (
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  {modalMode === 'create' ? 'Create Company' : 'Update Company'}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
              <Building2 className="h-6 w-6" />
              Company Master
            </h2>
            <p className="text-gray-600">Manage company and organizational entities</p>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Import
            </button>
            <button
              onClick={handleCreateCompany}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Company
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center border rounded-lg px-3 py-2 flex-1 min-w-64">
            <Search className="h-4 w-4 text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search companies..."
              className="outline-none flex-1"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="px-3 py-2 border rounded-lg"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
          </select>
          <select
            className="px-3 py-2 border rounded-lg"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="all">All Types</option>
            <option value="holding">Holding Company</option>
            <option value="subsidiary">Subsidiary</option>
            <option value="branch">Branch Office</option>
            <option value="division">Division</option>
          </select>
          <button className="px-3 py-2 border rounded-lg hover:bg-gray-50">
            <Filter className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Companies Grid */}
      {isLoading ? (
        <div className="bg-white rounded-lg shadow p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading companies...</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredCompanies.map((company) => (
            <div key={company.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Building2 className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{company.shortName}</h3>
                      <p className="text-sm text-gray-600">{company.code}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className={`px-2 py-1 rounded-full text-xs flex items-center gap-1 ${getStatusColor(company.status)}`}>
                      {getStatusIcon(company.status)}
                      {company.status}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <p className="font-medium">{company.name}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span className={`px-2 py-1 rounded-full text-xs ${getTypeColor(company.type)}`}>
                      {company.type}
                    </span>
                    {company.parentCompany && (
                      <span className="text-xs">Parent: {company.parentCompany}</span>
                    )}
                  </div>
                </div>

                <div className="space-y-2 mb-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{company.address.city}, {company.address.country}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <span>{company.contact.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    <span>{company.financial.baseCurrency}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleViewCompany(company)}
                      className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded"
                      title="View Details"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleEditCompany(company)}
                      className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded"
                      title="Edit Company"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteCompany(company.id)}
                      className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded"
                      title="Delete Company"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <button className="p-2 text-gray-600 hover:text-gray-800 rounded">
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {filteredCompanies.length === 0 && !isLoading && (
        <div className="bg-white rounded-lg shadow p-8">
          <div className="text-center">
            <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No companies found</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || filterStatus !== 'all' || filterType !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Get started by creating your first company'
              }
            </p>
            {!searchTerm && filterStatus === 'all' && filterType === 'all' && (
              <button
                onClick={handleCreateCompany}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2 mx-auto"
              >
                <Plus className="h-4 w-4" />
                Add Company
              </button>
            )}
          </div>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && <CompanyModal />}
    </div>
  );
};

export default CompanyMaster;
'use client';

import React, { useState, useMemo } from 'react';
import {
  Map, Plus, Search, Edit2, Trash2, Download, Upload,
  CheckCircle2, XCircle, AlertTriangle, Users, Building2,
  DollarSign, TrendingUp, Target, Warehouse
} from 'lucide-react';

interface Region {
  id: string;
  regionCode: string;
  regionName: string;
  regionType: 'Geographic' | 'Sales' | 'Administrative' | 'Custom';

  // Coverage
  coverage: {
    countries: string[];
    states: string[];
    territories?: string[];
    totalArea?: number;
  };

  // Management
  management: {
    regionalHead: string;
    regionalHeadId: string;
    headquarters: string;
    deputyHeads?: string[];
  };

  // Business Units
  businessUnits: {
    branches: number;
    warehouses: number;
    plants: number;
    servicesCenters: number;
  };

  // Financial
  financial: {
    budgetAllocated?: number;
    budgetUtilized?: number;
    revenueTarget?: number;
    actualRevenue?: number;
    profitMargin?: number;
  };

  // Performance
  kpis: {
    customerSatisfaction?: number;
    employeeStrength?: number;
    marketShare?: number;
    growthRate?: number;
  };

  status: 'Active' | 'Inactive' | 'Under Restructuring';

  metadata: {
    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
    updatedBy: string;
  };
}

const mockRegions: Region[] = [
  {
    id: '1',
    regionCode: 'REG-WEST',
    regionName: 'Western Region',
    regionType: 'Geographic',
    coverage: {
      countries: ['India'],
      states: ['Maharashtra', 'Gujarat', 'Goa'],
      territories: ['WEST-MH-01', 'WEST-GJ-01'],
      totalArea: 508052
    },
    management: {
      regionalHead: 'Amit Shah',
      regionalHeadId: 'EMP-RH-001',
      headquarters: 'Mumbai',
      deputyHeads: ['EMP-DH-001', 'EMP-DH-002']
    },
    businessUnits: {
      branches: 25,
      warehouses: 8,
      plants: 3,
      servicesCenters: 12
    },
    financial: {
      budgetAllocated: 50000000,
      budgetUtilized: 42000000,
      revenueTarget: 150000000,
      actualRevenue: 138000000,
      profitMargin: 18.5
    },
    kpis: {
      customerSatisfaction: 88,
      employeeStrength: 450,
      marketShare: 22.5,
      growthRate: 12.8
    },
    status: 'Active',
    metadata: {
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2024-03-20'),
      createdBy: 'Admin',
      updatedBy: 'Manager'
    }
  },
  {
    id: '2',
    regionCode: 'REG-SOUTH',
    regionName: 'Southern Region',
    regionType: 'Geographic',
    coverage: {
      countries: ['India'],
      states: ['Karnataka', 'Tamil Nadu', 'Kerala', 'Telangana'],
      territories: ['SOUTH-KA-01', 'SOUTH-TN-01'],
      totalArea: 635780
    },
    management: {
      regionalHead: 'Priya Sharma',
      regionalHeadId: 'EMP-RH-002',
      headquarters: 'Bengaluru',
      deputyHeads: ['EMP-DH-003']
    },
    businessUnits: {
      branches: 32,
      warehouses: 10,
      plants: 5,
      servicesCenters: 15
    },
    financial: {
      budgetAllocated: 60000000,
      budgetUtilized: 55000000,
      revenueTarget: 180000000,
      actualRevenue: 175000000,
      profitMargin: 20.2
    },
    kpis: {
      customerSatisfaction: 92,
      employeeStrength: 580,
      marketShare: 28.3,
      growthRate: 15.5
    },
    status: 'Active',
    metadata: {
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2024-03-18'),
      createdBy: 'Admin',
      updatedBy: 'Manager'
    }
  },
  {
    id: '3',
    regionCode: 'REG-NORTH',
    regionName: 'Northern Region',
    regionType: 'Sales',
    coverage: {
      countries: ['India'],
      states: ['Delhi', 'Punjab', 'Haryana', 'Uttar Pradesh'],
      territories: ['NORTH-DL-01', 'NORTH-UP-01'],
      totalArea: 443982
    },
    management: {
      regionalHead: 'Rajesh Kumar',
      regionalHeadId: 'EMP-RH-003',
      headquarters: 'New Delhi',
      deputyHeads: ['EMP-DH-004', 'EMP-DH-005']
    },
    businessUnits: {
      branches: 28,
      warehouses: 7,
      plants: 4,
      servicesCenters: 18
    },
    financial: {
      budgetAllocated: 55000000,
      budgetUtilized: 48000000,
      revenueTarget: 165000000,
      actualRevenue: 152000000,
      profitMargin: 17.8
    },
    kpis: {
      customerSatisfaction: 85,
      employeeStrength: 520,
      marketShare: 25.7,
      growthRate: 11.2
    },
    status: 'Active',
    metadata: {
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2024-03-15'),
      createdBy: 'Admin',
      updatedBy: 'Manager'
    }
  }
];

export default function RegionMaster() {
  const [regions, setRegions] = useState<Region[]>(mockRegions);
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [currentTab, setCurrentTab] = useState('basic');

  const handleEdit = (region: Region) => {
    setSelectedRegion(region);
    setIsModalOpen(true);
    setCurrentTab('basic');
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this region?')) {
      setRegions(regions.filter(r => r.id !== id));
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'Active': { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle2 },
      'Inactive': { bg: 'bg-gray-100', text: 'text-gray-800', icon: XCircle },
      'Under Restructuring': { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: AlertTriangle }
    };
    const config = statusConfig[status as keyof typeof statusConfig];
    const Icon = config.icon;
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        <Icon className="h-3 w-3" />
        {status}
      </span>
    );
  };

  const getTypeBadge = (type: string) => {
    const typeConfig = {
      'Geographic': { bg: 'bg-blue-100', text: 'text-blue-800' },
      'Sales': { bg: 'bg-green-100', text: 'text-green-800' },
      'Administrative': { bg: 'bg-purple-100', text: 'text-purple-800' },
      'Custom': { bg: 'bg-orange-100', text: 'text-orange-800' }
    };
    const config = typeConfig[type as keyof typeof typeConfig];
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {type}
      </span>
    );
  };

  const filteredRegions = useMemo(() => {
    return regions.filter(region => {
      const matchesSearch = region.regionName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           region.regionCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           region.management.regionalHead.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'All' || region.regionType === filterType;
      const matchesStatus = filterStatus === 'All' || region.status === filterStatus;
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [regions, searchTerm, filterType, filterStatus]);

  const totalRevenue = regions.reduce((sum, r) => sum + (r.financial.actualRevenue || 0), 0);
  const totalBranches = regions.reduce((sum, r) => sum + r.businessUnits.branches, 0);

  return (
    <div className="p-6 ">
      <div className="mb-3">
        <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
          <Map className="h-8 w-8 text-blue-600" />
          Region Master
        </h2>
        <p className="text-gray-600">Manage geographic and operational regions</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
        <div className="bg-white p-3 rounded-lg shadow border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Regions</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{regions.length}</p>
            </div>
            <Map className="h-12 w-12 text-blue-600 opacity-20" />
          </div>
        </div>

        <div className="bg-white p-3 rounded-lg shadow border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                ${(totalRevenue / 1000000).toFixed(1)}M
              </p>
            </div>
            <DollarSign className="h-12 w-12 text-green-600 opacity-20" />
          </div>
        </div>

        <div className="bg-white p-3 rounded-lg shadow border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Branches</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{totalBranches}</p>
            </div>
            <Building2 className="h-12 w-12 text-purple-600 opacity-20" />
          </div>
        </div>

        <div className="bg-white p-3 rounded-lg shadow border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Growth Rate</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {(regions.reduce((sum, r) => sum + (r.kpis.growthRate || 0), 0) / regions.length).toFixed(1)}%
              </p>
            </div>
            <TrendingUp className="h-12 w-12 text-orange-600 opacity-20" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center justify-between">
            <div className="flex flex-1 gap-2">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search regions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="All">All Types</option>
                <option value="Geographic">Geographic</option>
                <option value="Sales">Sales</option>
                <option value="Administrative">Administrative</option>
                <option value="Custom">Custom</option>
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="All">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Under Restructuring">Under Restructuring</option>
              </select>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Import
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
                <Download className="h-4 w-4" />
                Export
              </button>
              <button
                onClick={() => {
                  setSelectedRegion(null);
                  setIsModalOpen(true);
                  setCurrentTab('basic');
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Region
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Region
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Regional Head
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Coverage
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Business Units
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Financial
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  KPIs
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRegions.map((region) => (
                <tr key={region.id} className="hover:bg-gray-50">
                  <td className="px-3 py-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <Map className="h-4 w-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-900">{region.regionName}</span>
                      </div>
                      <div className="text-sm text-gray-500 mt-1">{region.regionCode}</div>
                      <div className="mt-1">
                        {getTypeBadge(region.regionType)}
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    <div className="text-sm">
                      <div className="font-medium text-gray-900">{region.management.regionalHead}</div>
                      <div className="text-gray-500">{region.management.headquarters}</div>
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    <div className="text-sm">
                      <div className="text-gray-900">{region.coverage.states.length} states</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {region.coverage.states.slice(0, 2).join(', ')}
                        {region.coverage.states.length > 2 && ` +${region.coverage.states.length - 2}`}
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    <div className="text-sm space-y-1">
                      <div className="flex items-center gap-1">
                        <Building2 className="h-3 w-3 text-gray-400" />
                        <span>{region.businessUnits.branches} branches</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Warehouse className="h-3 w-3 text-gray-400" />
                        <span>{region.businessUnits.warehouses} warehouses</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    <div className="text-sm">
                      <div className="font-medium text-gray-900">
                        ${((region.financial.actualRevenue || 0) / 1000000).toFixed(1)}M
                      </div>
                      <div className="text-xs text-gray-500">
                        Margin: {region.financial.profitMargin?.toFixed(1)}%
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    <div className="text-sm">
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-3 w-3 text-green-600" />
                        <span>{region.kpis.growthRate?.toFixed(1)}% growth</span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        CS: {region.kpis.customerSatisfaction}%
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    {getStatusBadge(region.status)}
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(region)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(region.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full  max-h-[90vh] overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold">
                {selectedRegion ? 'Edit Region' : 'Add New Region'}
              </h3>
            </div>

            <div className="flex border-b border-gray-200">
              {['basic', 'coverage', 'management', 'financial'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setCurrentTab(tab)}
                  className={`px-4 py-2 font-medium capitalize ${
                    currentTab === tab
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab === 'basic' ? 'Basic Info' : tab}
                </button>
              ))}
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
              {currentTab === 'basic' && (
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Region Name *
                      </label>
                      <input
                        type="text"
                        defaultValue={selectedRegion?.regionName}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter region name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Region Code *
                      </label>
                      <input
                        type="text"
                        defaultValue={selectedRegion?.regionCode}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="REG-WEST"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Region Type *
                      </label>
                      <select defaultValue={selectedRegion?.regionType || 'Geographic'}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                        <option value="Geographic">Geographic</option>
                        <option value="Sales">Sales</option>
                        <option value="Administrative">Administrative</option>
                        <option value="Custom">Custom</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Status
                      </label>
                      <select defaultValue={selectedRegion?.status || 'Active'}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                        <option value="Under Restructuring">Under Restructuring</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-gray-200 flex justify-end gap-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  alert('Region saved successfully!');
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {selectedRegion ? 'Update' : 'Create'} Region
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import React, { useState, useMemo } from 'react';
import {
  Layers, Plus, Search, Edit2, Trash2, Download, Upload,
  CheckCircle2, XCircle, MapPin, Truck, DollarSign, Clock,
  Package, Users, TrendingUp, Navigation, AlertCircle
} from 'lucide-react';

interface Zone {
  id: string;
  zoneCode: string;
  zoneName: string;
  zoneType: 'Operational' | 'Delivery' | 'Service' | 'Pricing' | 'Tax';

  // Coverage
  coverage: {
    regions?: string[];
    states?: string[];
    cities?: string[];
    pinCodes?: string[];
    customBoundary?: string;
  };

  // Zone Specific Settings
  zoneSettings: {
    // For Delivery Zones
    standardDeliveryDays?: number;
    expressDeliveryDays?: number;
    shippingCharges?: number;
    freeShippingThreshold?: number;

    // For Pricing Zones
    pricingMultiplier?: number;
    currencyCode?: string;

    // For Tax Zones
    taxRate?: number;
    taxType?: string;

    // For Service Zones
    serviceLevel?: 'Premium' | 'Standard' | 'Basic';
    responseTime?: number;
  };

  // Operations
  operations: {
    zoneManager?: string;
    zoneTeam?: string[];
    workingHours?: string;
    supportedLanguages?: string[];
  };

  // Performance
  metrics: {
    avgDeliveryTime?: number;
    deliverySuccess?: number;
    customerCount?: number;
    orderVolume?: number;
    revenue?: number;
  };

  status: 'Active' | 'Inactive' | 'Testing';
  priority: number;

  metadata: {
    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
    updatedBy: string;
  };
}

const mockZones: Zone[] = [
  {
    id: '1',
    zoneCode: 'ZONE-A',
    zoneName: 'Metro Zone A',
    zoneType: 'Delivery',
    coverage: {
      cities: ['Mumbai', 'Delhi', 'Bengaluru', 'Chennai'],
      pinCodes: ['400001-400098', '110001-110096']
    },
    zoneSettings: {
      standardDeliveryDays: 2,
      expressDeliveryDays: 1,
      shippingCharges: 50,
      freeShippingThreshold: 500,
      serviceLevel: 'Premium',
      responseTime: 2
    },
    operations: {
      zoneManager: 'Priya Sharma',
      zoneTeam: ['OPS-001', 'OPS-002', 'OPS-003'],
      workingHours: '24x7',
      supportedLanguages: ['English', 'Hindi']
    },
    metrics: {
      avgDeliveryTime: 1.8,
      deliverySuccess: 98.5,
      customerCount: 12500,
      orderVolume: 45000,
      revenue: 18500000
    },
    status: 'Active',
    priority: 1,
    metadata: {
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2024-03-20'),
      createdBy: 'Admin',
      updatedBy: 'Manager'
    }
  },
  {
    id: '2',
    zoneCode: 'ZONE-TAX-MH',
    zoneName: 'Maharashtra Tax Zone',
    zoneType: 'Tax',
    coverage: {
      states: ['Maharashtra']
    },
    zoneSettings: {
      taxRate: 18,
      taxType: 'SGST + CGST'
    },
    operations: {
      zoneManager: 'Rajesh Kumar',
      workingHours: '9 AM - 6 PM'
    },
    metrics: {
      customerCount: 5800,
      revenue: 12000000
    },
    status: 'Active',
    priority: 1,
    metadata: {
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2024-03-18'),
      createdBy: 'Admin',
      updatedBy: 'Tax Manager'
    }
  },
  {
    id: '3',
    zoneCode: 'ZONE-B',
    zoneName: 'Tier-1 Zone B',
    zoneType: 'Delivery',
    coverage: {
      cities: ['Pune', 'Hyderabad', 'Ahmedabad', 'Kolkata'],
      pinCodes: ['411001-411068', '500001-500100']
    },
    zoneSettings: {
      standardDeliveryDays: 3,
      expressDeliveryDays: 2,
      shippingCharges: 75,
      freeShippingThreshold: 750,
      serviceLevel: 'Standard',
      responseTime: 4
    },
    operations: {
      zoneManager: 'Amit Singh',
      zoneTeam: ['OPS-004', 'OPS-005'],
      workingHours: '8 AM - 8 PM',
      supportedLanguages: ['English', 'Hindi', 'Regional']
    },
    metrics: {
      avgDeliveryTime: 2.5,
      deliverySuccess: 95.2,
      customerCount: 8400,
      orderVolume: 28000,
      revenue: 9800000
    },
    status: 'Active',
    priority: 2,
    metadata: {
      createdAt: new Date('2023-01-15'),
      updatedAt: new Date('2024-03-15'),
      createdBy: 'Admin',
      updatedBy: 'Manager'
    }
  },
  {
    id: '4',
    zoneCode: 'ZONE-PRICE-WEST',
    zoneName: 'Western Pricing Zone',
    zoneType: 'Pricing',
    coverage: {
      states: ['Maharashtra', 'Gujarat', 'Goa']
    },
    zoneSettings: {
      pricingMultiplier: 1.05,
      currencyCode: 'INR'
    },
    operations: {
      zoneManager: 'Sanjay Patel',
      workingHours: '9 AM - 6 PM'
    },
    metrics: {
      customerCount: 6500,
      revenue: 15200000
    },
    status: 'Active',
    priority: 2,
    metadata: {
      createdAt: new Date('2023-02-01'),
      updatedAt: new Date('2024-03-10'),
      createdBy: 'Admin',
      updatedBy: 'Pricing Manager'
    }
  },
  {
    id: '5',
    zoneCode: 'ZONE-C',
    zoneName: 'Rural Zone C',
    zoneType: 'Service',
    coverage: {
      cities: ['Various Rural Areas'],
      pinCodes: ['Various']
    },
    zoneSettings: {
      serviceLevel: 'Basic',
      responseTime: 24
    },
    operations: {
      zoneManager: 'Ravi Verma',
      zoneTeam: ['OPS-006'],
      workingHours: '9 AM - 5 PM',
      supportedLanguages: ['Regional Languages']
    },
    metrics: {
      avgDeliveryTime: 5.5,
      deliverySuccess: 88.0,
      customerCount: 3200,
      orderVolume: 8500,
      revenue: 2400000
    },
    status: 'Active',
    priority: 3,
    metadata: {
      createdAt: new Date('2023-03-01'),
      updatedAt: new Date('2024-03-05'),
      createdBy: 'Admin',
      updatedBy: 'Manager'
    }
  }
];

export default function ZoneMaster() {
  const [zones, setZones] = useState<Zone[]>(mockZones);
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [currentTab, setCurrentTab] = useState('basic');

  const handleEdit = (zone: Zone) => {
    setSelectedZone(zone);
    setIsModalOpen(true);
    setCurrentTab('basic');
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this zone?')) {
      setZones(zones.filter(z => z.id !== id));
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'Active': { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle2 },
      'Inactive': { bg: 'bg-gray-100', text: 'text-gray-800', icon: XCircle },
      'Testing': { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: AlertCircle }
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
      'Operational': { bg: 'bg-blue-100', text: 'text-blue-800' },
      'Delivery': { bg: 'bg-green-100', text: 'text-green-800' },
      'Service': { bg: 'bg-purple-100', text: 'text-purple-800' },
      'Pricing': { bg: 'bg-orange-100', text: 'text-orange-800' },
      'Tax': { bg: 'bg-red-100', text: 'text-red-800' }
    };
    const config = typeConfig[type as keyof typeof typeConfig];
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {type}
      </span>
    );
  };

  const getPriorityBadge = (priority: number) => {
    const priorityConfig = {
      1: { bg: 'bg-red-100', text: 'text-red-800', label: 'High' },
      2: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Medium' },
      3: { bg: 'bg-green-100', text: 'text-green-800', label: 'Low' }
    };
    const config = priorityConfig[priority as keyof typeof priorityConfig] || priorityConfig[3];
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${config.bg} ${config.text}`}>
        P{priority}
      </span>
    );
  };

  const filteredZones = useMemo(() => {
    return zones.filter(zone => {
      const matchesSearch = zone.zoneName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           zone.zoneCode.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'All' || zone.zoneType === filterType;
      const matchesStatus = filterStatus === 'All' || zone.status === filterStatus;
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [zones, searchTerm, filterType, filterStatus]);

  const totalRevenue = zones.reduce((sum, z) => sum + (z.metrics.revenue || 0), 0);
  const totalCustomers = zones.reduce((sum, z) => sum + (z.metrics.customerCount || 0), 0);
  const avgDeliverySuccess = zones.filter(z => z.metrics.deliverySuccess).reduce((sum, z) => sum + (z.metrics.deliverySuccess || 0), 0) / zones.filter(z => z.metrics.deliverySuccess).length;

  return (
    <div className="p-6 ">
      <div className="mb-3">
        <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
          <Layers className="h-8 w-8 text-blue-600" />
          Zone Master
        </h2>
        <p className="text-gray-600">Manage operational and delivery zones</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
        <div className="bg-white p-3 rounded-lg shadow border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Zones</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{zones.length}</p>
            </div>
            <Layers className="h-12 w-12 text-blue-600 opacity-20" />
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
              <p className="text-sm text-gray-600">Total Customers</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {totalCustomers.toLocaleString()}
              </p>
            </div>
            <Users className="h-12 w-12 text-purple-600 opacity-20" />
          </div>
        </div>

        <div className="bg-white p-3 rounded-lg shadow border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Success Rate</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {avgDeliverySuccess.toFixed(1)}%
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
                  placeholder="Search zones..."
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
                <option value="Operational">Operational</option>
                <option value="Delivery">Delivery</option>
                <option value="Service">Service</option>
                <option value="Pricing">Pricing</option>
                <option value="Tax">Tax</option>
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="All">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Testing">Testing</option>
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
                  setSelectedZone(null);
                  setIsModalOpen(true);
                  setCurrentTab('basic');
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Zone
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Zone
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Manager & Coverage
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Settings
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Performance
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
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
              {filteredZones.map((zone) => (
                <tr key={zone.id} className="hover:bg-gray-50">
                  <td className="px-3 py-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <Layers className="h-4 w-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-900">{zone.zoneName}</span>
                      </div>
                      <div className="text-sm text-gray-500 mt-1">{zone.zoneCode}</div>
                      <div className="mt-1">
                        {getTypeBadge(zone.zoneType)}
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    <div className="text-sm">
                      {zone.operations.zoneManager && (
                        <div className="flex items-center gap-1 mb-1">
                          <Users className="h-3 w-3 text-gray-400" />
                          <span className="font-medium text-gray-900">{zone.operations.zoneManager}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1 text-gray-500">
                        <MapPin className="h-3 w-3" />
                        <span className="text-xs">
                          {zone.coverage.cities?.length || zone.coverage.states?.length || 'Various'} locations
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    <div className="text-sm space-y-1">
                      {zone.zoneType === 'Delivery' && (
                        <>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3 text-gray-400" />
                            <span className="text-xs">{zone.zoneSettings.standardDeliveryDays} days std</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Truck className="h-3 w-3 text-gray-400" />
                            <span className="text-xs">₹{zone.zoneSettings.shippingCharges} shipping</span>
                          </div>
                        </>
                      )}
                      {zone.zoneType === 'Tax' && (
                        <div className="text-xs text-gray-900">
                          {zone.zoneSettings.taxRate}% {zone.zoneSettings.taxType}
                        </div>
                      )}
                      {zone.zoneType === 'Service' && (
                        <div className="text-xs">
                          <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded">
                            {zone.zoneSettings.serviceLevel}
                          </span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    <div className="text-sm">
                      {zone.metrics.deliverySuccess && (
                        <div className="text-green-600 font-medium">
                          {zone.metrics.deliverySuccess.toFixed(1)}% success
                        </div>
                      )}
                      <div className="text-xs text-gray-500 mt-1">
                        {zone.metrics.customerCount?.toLocaleString() || 0} customers
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    {getPriorityBadge(zone.priority)}
                  </td>
                  <td className="px-3 py-2">
                    {getStatusBadge(zone.status)}
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(zone)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(zone.id)}
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
                {selectedZone ? 'Edit Zone' : 'Add New Zone'}
              </h3>
            </div>

            <div className="flex border-b border-gray-200">
              {['basic', 'settings', 'operations'].map((tab) => (
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
                        Zone Name *
                      </label>
                      <input
                        type="text"
                        defaultValue={selectedZone?.zoneName}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter zone name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Zone Code *
                      </label>
                      <input
                        type="text"
                        defaultValue={selectedZone?.zoneCode}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="ZONE-A"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Zone Type *
                      </label>
                      <select defaultValue={selectedZone?.zoneType || 'Delivery'}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                        <option value="Operational">Operational</option>
                        <option value="Delivery">Delivery</option>
                        <option value="Service">Service</option>
                        <option value="Pricing">Pricing</option>
                        <option value="Tax">Tax</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Priority
                      </label>
                      <select defaultValue={selectedZone?.priority || 1}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                        <option value={1}>1 - High</option>
                        <option value={2}>2 - Medium</option>
                        <option value={3}>3 - Low</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Status
                      </label>
                      <select defaultValue={selectedZone?.status || 'Active'}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                        <option value="Testing">Testing</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {currentTab === 'settings' && (
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Standard Delivery Days
                      </label>
                      <input
                        type="number"
                        defaultValue={selectedZone?.zoneSettings.standardDeliveryDays}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Express Delivery Days
                      </label>
                      <input
                        type="number"
                        defaultValue={selectedZone?.zoneSettings.expressDeliveryDays}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Shipping Charges
                      </label>
                      <input
                        type="number"
                        defaultValue={selectedZone?.zoneSettings.shippingCharges}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Free Shipping Threshold
                      </label>
                      <input
                        type="number"
                        defaultValue={selectedZone?.zoneSettings.freeShippingThreshold}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {currentTab === 'operations' && (
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Zone Manager
                      </label>
                      <input
                        type="text"
                        defaultValue={selectedZone?.operations.zoneManager}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Working Hours
                      </label>
                      <input
                        type="text"
                        defaultValue={selectedZone?.operations.workingHours}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="9 AM - 6 PM"
                      />
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
                  alert('Zone saved successfully!');
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {selectedZone ? 'Update' : 'Create'} Zone
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import React, { useState, useMemo } from 'react';
import {
  Hash, Plus, Search, Edit2, Trash2, Download, Upload, MapPin,
  CheckCircle2, XCircle, Truck, Package, Clock, DollarSign,
  AlertTriangle, Building2, Users, Navigation
} from 'lucide-react';

interface PinCode {
  id: string;
  pinCode: string;
  postalCode?: string;
  cityId: string;
  cityName: string;
  stateId: string;
  stateName: string;
  countryId: string;
  countryName: string;

  // Area Details
  areaDetails: {
    locality?: string;
    subLocality?: string;
    district?: string;
    taluk?: string;
  };

  // Delivery
  deliverySettings: {
    deliveryEnabled: boolean;
    codEnabled: boolean;
    standardDays: number;
    expressDeliveryAvailable: boolean;
    shippingZone?: string;
  };

  // Logistics
  logistics: {
    sortingCenter?: string;
    hubLocation?: string;
    serviceableBy: string[];
  };

  // Business
  statistics: {
    totalAddresses: number;
    totalCustomers?: number;
    totalSuppliers?: number;
    avgDeliveryDays?: number;
  };

  status: 'Active' | 'Inactive' | 'Serviceable' | 'Non-Serviceable';
  notes?: string;

  metadata: {
    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
    updatedBy: string;
  };
}

const mockPinCodes: PinCode[] = [
  {
    id: '1',
    pinCode: '400001',
    cityId: '1',
    cityName: 'Mumbai',
    stateId: '1',
    stateName: 'Maharashtra',
    countryId: '1',
    countryName: 'India',
    areaDetails: {
      locality: 'Fort',
      subLocality: 'Fort Business District',
      district: 'Mumbai City',
      taluk: 'Mumbai'
    },
    deliverySettings: {
      deliveryEnabled: true,
      codEnabled: true,
      standardDays: 2,
      expressDeliveryAvailable: true,
      shippingZone: 'Zone-A'
    },
    logistics: {
      sortingCenter: 'Mumbai Central',
      hubLocation: 'Fort Hub',
      serviceableBy: ['BlueDart', 'DTDC', 'FedEx', 'DHL']
    },
    statistics: {
      totalAddresses: 2450,
      totalCustomers: 180,
      totalSuppliers: 45,
      avgDeliveryDays: 1.5
    },
    status: 'Serviceable',
    metadata: {
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2024-03-20'),
      createdBy: 'System',
      updatedBy: 'Admin'
    }
  },
  {
    id: '2',
    pinCode: '560001',
    cityId: '2',
    cityName: 'Bengaluru',
    stateId: '2',
    stateName: 'Karnataka',
    countryId: '1',
    countryName: 'India',
    areaDetails: {
      locality: 'Shivaji Nagar',
      district: 'Bangalore Urban',
      taluk: 'Bangalore North'
    },
    deliverySettings: {
      deliveryEnabled: true,
      codEnabled: true,
      standardDays: 2,
      expressDeliveryAvailable: true,
      shippingZone: 'Zone-A'
    },
    logistics: {
      sortingCenter: 'Bangalore Central',
      hubLocation: 'Shivaji Nagar Hub',
      serviceableBy: ['BlueDart', 'DTDC', 'FedEx']
    },
    statistics: {
      totalAddresses: 1850,
      totalCustomers: 145,
      totalSuppliers: 38,
      avgDeliveryDays: 1.8
    },
    status: 'Serviceable',
    metadata: {
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2024-03-18'),
      createdBy: 'System',
      updatedBy: 'Admin'
    }
  },
  {
    id: '3',
    pinCode: '110001',
    cityId: '3',
    cityName: 'New Delhi',
    stateId: '3',
    stateName: 'Delhi',
    countryId: '1',
    countryName: 'India',
    areaDetails: {
      locality: 'Connaught Place',
      subLocality: 'CP Central',
      district: 'New Delhi',
      taluk: 'Delhi'
    },
    deliverySettings: {
      deliveryEnabled: true,
      codEnabled: true,
      standardDays: 1,
      expressDeliveryAvailable: true,
      shippingZone: 'Zone-A'
    },
    logistics: {
      sortingCenter: 'Delhi Central',
      hubLocation: 'CP Hub',
      serviceableBy: ['BlueDart', 'DTDC', 'FedEx', 'DHL', 'Aramex']
    },
    statistics: {
      totalAddresses: 3200,
      totalCustomers: 220,
      totalSuppliers: 52,
      avgDeliveryDays: 1.2
    },
    status: 'Serviceable',
    metadata: {
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2024-03-15'),
      createdBy: 'System',
      updatedBy: 'Admin'
    }
  },
  {
    id: '4',
    pinCode: '411001',
    cityId: '4',
    cityName: 'Pune',
    stateId: '1',
    stateName: 'Maharashtra',
    countryId: '1',
    countryName: 'India',
    areaDetails: {
      locality: 'Shivajinagar',
      district: 'Pune',
      taluk: 'Pune City'
    },
    deliverySettings: {
      deliveryEnabled: true,
      codEnabled: true,
      standardDays: 2,
      expressDeliveryAvailable: true,
      shippingZone: 'Zone-B'
    },
    logistics: {
      sortingCenter: 'Pune Central',
      hubLocation: 'Shivajinagar Hub',
      serviceableBy: ['BlueDart', 'DTDC']
    },
    statistics: {
      totalAddresses: 1450,
      totalCustomers: 98,
      totalSuppliers: 28,
      avgDeliveryDays: 2.1
    },
    status: 'Serviceable',
    metadata: {
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2024-03-12'),
      createdBy: 'System',
      updatedBy: 'Admin'
    }
  },
  {
    id: '5',
    pinCode: '600001',
    cityId: '6',
    cityName: 'Chennai',
    stateId: '6',
    stateName: 'Tamil Nadu',
    countryId: '1',
    countryName: 'India',
    areaDetails: {
      locality: 'Parrys',
      district: 'Chennai',
      taluk: 'Chennai North'
    },
    deliverySettings: {
      deliveryEnabled: true,
      codEnabled: false,
      standardDays: 3,
      expressDeliveryAvailable: false,
      shippingZone: 'Zone-C'
    },
    logistics: {
      sortingCenter: 'Chennai Central',
      hubLocation: 'Parrys Hub',
      serviceableBy: ['DTDC']
    },
    statistics: {
      totalAddresses: 850,
      totalCustomers: 45,
      totalSuppliers: 12,
      avgDeliveryDays: 3.5
    },
    status: 'Active',
    metadata: {
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2024-03-10'),
      createdBy: 'System',
      updatedBy: 'Admin'
    }
  }
];

export default function PinCodeMaster() {
  const [pinCodes, setPinCodes] = useState<PinCode[]>(mockPinCodes);
  const [selectedPinCode, setSelectedPinCode] = useState<PinCode | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCity, setFilterCity] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [currentTab, setCurrentTab] = useState('basic');

  const handleEdit = (pinCode: PinCode) => {
    setSelectedPinCode(pinCode);
    setIsModalOpen(true);
    setCurrentTab('basic');
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this PIN code?')) {
      setPinCodes(pinCodes.filter(p => p.id !== id));
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'Serviceable': { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle2 },
      'Active': { bg: 'bg-blue-100', text: 'text-blue-800', icon: CheckCircle2 },
      'Non-Serviceable': { bg: 'bg-red-100', text: 'text-red-800', icon: XCircle },
      'Inactive': { bg: 'bg-gray-100', text: 'text-gray-800', icon: XCircle }
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

  const getZoneBadge = (zone?: string) => {
    if (!zone) return null;
    const zoneConfig = {
      'Zone-A': { bg: 'bg-purple-100', text: 'text-purple-800' },
      'Zone-B': { bg: 'bg-blue-100', text: 'text-blue-800' },
      'Zone-C': { bg: 'bg-green-100', text: 'text-green-800' },
      'Zone-D': { bg: 'bg-yellow-100', text: 'text-yellow-800' }
    };
    const config = zoneConfig[zone as keyof typeof zoneConfig] || { bg: 'bg-gray-100', text: 'text-gray-800' };
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${config.bg} ${config.text}`}>
        {zone}
      </span>
    );
  };

  const filteredPinCodes = useMemo(() => {
    return pinCodes.filter(pinCode => {
      const matchesSearch = pinCode.pinCode.includes(searchTerm) ||
                           pinCode.cityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           pinCode.areaDetails.locality?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCity = filterCity === 'All' || pinCode.cityName === filterCity;
      const matchesStatus = filterStatus === 'All' || pinCode.status === filterStatus;
      return matchesSearch && matchesCity && matchesStatus;
    });
  }, [pinCodes, searchTerm, filterCity, filterStatus]);

  const uniqueCities = Array.from(new Set(pinCodes.map(p => p.cityName)));
  const serviceablePinCodes = pinCodes.filter(p => p.status === 'Serviceable' || p.status === 'Active');

  return (
    <div className="p-6 ">
      <div className="mb-3">
        <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
          <Hash className="h-8 w-8 text-blue-600" />
          Pin Code / Postal Code Master
        </h2>
        <p className="text-gray-600">Manage postal codes and delivery serviceability</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
        <div className="bg-white p-3 rounded-lg shadow border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total PIN Codes</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{pinCodes.length}</p>
            </div>
            <Hash className="h-12 w-12 text-blue-600 opacity-20" />
          </div>
        </div>

        <div className="bg-white p-3 rounded-lg shadow border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Serviceable</p>
              <p className="text-2xl font-bold text-green-600 mt-1">
                {serviceablePinCodes.length}
              </p>
            </div>
            <CheckCircle2 className="h-12 w-12 text-green-600 opacity-20" />
          </div>
        </div>

        <div className="bg-white p-3 rounded-lg shadow border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">COD Available</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {pinCodes.filter(p => p.deliverySettings.codEnabled).length}
              </p>
            </div>
            <DollarSign className="h-12 w-12 text-purple-600 opacity-20" />
          </div>
        </div>

        <div className="bg-white p-3 rounded-lg shadow border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Delivery</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {(pinCodes.reduce((sum, p) => sum + (p.statistics.avgDeliveryDays || 0), 0) / pinCodes.length).toFixed(1)} days
              </p>
            </div>
            <Clock className="h-12 w-12 text-orange-600 opacity-20" />
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
                  placeholder="Search PIN codes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <select
                value={filterCity}
                onChange={(e) => setFilterCity(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="All">All Cities</option>
                {uniqueCities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="All">All Status</option>
                <option value="Serviceable">Serviceable</option>
                <option value="Non-Serviceable">Non-Serviceable</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
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
                  setSelectedPinCode(null);
                  setIsModalOpen(true);
                  setCurrentTab('basic');
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add PIN Code
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  PIN Code
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Delivery Settings
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Logistics
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statistics
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
              {filteredPinCodes.map((pinCode) => (
                <tr key={pinCode.id} className="hover:bg-gray-50">
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span className="text-sm font-mono font-bold text-gray-900">
                        {pinCode.pinCode}
                      </span>
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    <div className="text-sm">
                      <div className="font-medium text-gray-900">{pinCode.areaDetails.locality}</div>
                      <div className="text-gray-500">{pinCode.cityName}, {pinCode.stateName}</div>
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Clock className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-900">
                          {pinCode.deliverySettings.standardDays} days
                        </span>
                        {pinCode.deliverySettings.expressDeliveryAvailable && (
                          <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 text-xs rounded">Express</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {pinCode.deliverySettings.codEnabled && (
                          <span className="px-1.5 py-0.5 bg-green-100 text-green-700 text-xs rounded">COD</span>
                        )}
                        {getZoneBadge(pinCode.deliverySettings.shippingZone)}
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    <div className="text-sm">
                      <div className="text-gray-900 text-xs">{pinCode.logistics.sortingCenter}</div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {pinCode.logistics.serviceableBy.slice(0, 2).map(courier => (
                          <span key={courier} className="px-1.5 py-0.5 bg-gray-100 text-gray-700 text-xs rounded">
                            {courier}
                          </span>
                        ))}
                        {pinCode.logistics.serviceableBy.length > 2 && (
                          <span className="px-1.5 py-0.5 bg-gray-100 text-gray-700 text-xs rounded">
                            +{pinCode.logistics.serviceableBy.length - 2}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    <div className="text-sm">
                      <div className="flex items-center gap-1">
                        <Building2 className="h-3 w-3 text-gray-400" />
                        <span className="text-xs">{pinCode.statistics.totalAddresses} addresses</span>
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        <Users className="h-3 w-3 text-gray-400" />
                        <span className="text-xs">{pinCode.statistics.totalCustomers || 0} customers</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    {getStatusBadge(pinCode.status)}
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(pinCode)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(pinCode.id)}
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
                {selectedPinCode ? 'Edit PIN Code' : 'Add New PIN Code'}
              </h3>
            </div>

            <div className="flex border-b border-gray-200">
              {['basic', 'delivery', 'logistics'].map((tab) => (
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
                        PIN Code *
                      </label>
                      <input
                        type="text"
                        defaultValue={selectedPinCode?.pinCode}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="400001"
                        maxLength={6}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        City *
                      </label>
                      <select
                        defaultValue={selectedPinCode?.cityId}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select City</option>
                        <option value="1">Mumbai</option>
                        <option value="2">Bengaluru</option>
                        <option value="3">New Delhi</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Locality *
                      </label>
                      <input
                        type="text"
                        defaultValue={selectedPinCode?.areaDetails.locality}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Sub Locality
                      </label>
                      <input
                        type="text"
                        defaultValue={selectedPinCode?.areaDetails.subLocality}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        District
                      </label>
                      <input
                        type="text"
                        defaultValue={selectedPinCode?.areaDetails.district}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Status
                      </label>
                      <select defaultValue={selectedPinCode?.status || 'Active'}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                        <option value="Serviceable">Serviceable</option>
                        <option value="Non-Serviceable">Non-Serviceable</option>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {currentTab === 'delivery' && (
                <div className="space-y-2">
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Standard Delivery Days
                      </label>
                      <input
                        type="number"
                        defaultValue={selectedPinCode?.deliverySettings.standardDays}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Shipping Zone
                      </label>
                      <select
                        defaultValue={selectedPinCode?.deliverySettings.shippingZone}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Zone-A">Zone-A</option>
                        <option value="Zone-B">Zone-B</option>
                        <option value="Zone-C">Zone-C</option>
                        <option value="Zone-D">Zone-D</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        defaultChecked={selectedPinCode?.deliverySettings.deliveryEnabled}
                        className="rounded"
                      />
                      <Truck className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium text-gray-700">
                        Delivery Enabled
                      </span>
                    </label>

                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        defaultChecked={selectedPinCode?.deliverySettings.codEnabled}
                        className="rounded"
                      />
                      <DollarSign className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium text-gray-700">
                        COD Enabled
                      </span>
                    </label>

                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        defaultChecked={selectedPinCode?.deliverySettings.expressDeliveryAvailable}
                        className="rounded"
                      />
                      <Navigation className="h-4 w-4 text-purple-600" />
                      <span className="text-sm font-medium text-gray-700">
                        Express Delivery Available
                      </span>
                    </label>
                  </div>
                </div>
              )}

              {currentTab === 'logistics' && (
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Sorting Center
                      </label>
                      <input
                        type="text"
                        defaultValue={selectedPinCode?.logistics.sortingCenter}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Hub Location
                      </label>
                      <input
                        type="text"
                        defaultValue={selectedPinCode?.logistics.hubLocation}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Serviceable By (Comma separated)
                    </label>
                    <input
                      type="text"
                      defaultValue={selectedPinCode?.logistics.serviceableBy.join(', ')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="BlueDart, DTDC, FedEx"
                    />
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
                  alert('PIN Code saved successfully!');
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {selectedPinCode ? 'Update' : 'Create'} PIN Code
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

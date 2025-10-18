'use client';

import React, { useState } from 'react';
import { Plus, Search, Filter, Edit, Trash2, Eye, Warehouse, MapPin, Phone, Mail, Package, Truck, Grid, List, Download, Upload, BarChart3, ThermometerSun } from 'lucide-react';

interface WarehouseLocation {
  id: string;
  warehouseCode: string;
  warehouseName: string;
  warehouseType: 'main' | 'distribution' | 'transit' | 'cold_storage' | 'bonded';
  status: 'active' | 'inactive' | 'under_maintenance';
  address: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
    latitude?: number;
    longitude?: number;
  };
  contact: {
    manager: string;
    phone: string;
    email: string;
    alternatePhone?: string;
  };
  capacity: {
    totalArea: number;
    areaUnit: 'sqft' | 'sqm';
    storageCapacity: number;
    capacityUnit: 'cubic_ft' | 'cubic_m' | 'pallets';
    currentUtilization: number;
    rackingSystem: boolean;
    numberOfBays: number;
    numberOfDocks: number;
  };
  operations: {
    operatingHours: string;
    workingDays: string[];
    shiftPattern: string;
    staffCount: number;
    pickingMethod: 'fifo' | 'lifo' | 'fefo' | 'manual';
    allowNegativeStock: boolean;
  };
  zones: {
    receivingArea: boolean;
    quarantineArea: boolean;
    qualityCheckArea: boolean;
    packingArea: boolean;
    shippingArea: boolean;
    returnArea: boolean;
  };
  facilities: {
    temperatureControlled: boolean;
    temperatureRange?: {
      min: number;
      max: number;
      unit: 'C' | 'F';
    };
    humidityControlled: boolean;
    securitySystem: boolean;
    fireProtection: boolean;
    hasLoadingDock: boolean;
    forkliftsAvailable: number;
  };
  inventory: {
    totalItems: number;
    totalValue: number;
    lastStockCount: string;
    cycleCountFrequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  };
  costCenter: {
    code: string;
    budgetAllocated: number;
    operatingCost: number;
    costPerSqft: number;
  };
  integration: {
    wmsIntegrated: boolean;
    barcodeEnabled: boolean;
    rfidEnabled: boolean;
    automationLevel: 'manual' | 'semi_automated' | 'fully_automated';
  };
  createdAt: string;
  updatedAt: string;
}

const mockWarehouses: WarehouseLocation[] = [
  {
    id: '1',
    warehouseCode: 'WH-001',
    warehouseName: 'Central Distribution Center',
    warehouseType: 'main',
    status: 'active',
    address: {
      line1: '100 Logistics Parkway',
      line2: 'Building A',
      city: 'Atlanta',
      state: 'GA',
      country: 'USA',
      postalCode: '30301',
      latitude: 33.7490,
      longitude: -84.3880
    },
    contact: {
      manager: 'Robert Chen',
      phone: '+1-404-555-0100',
      email: 'robert.chen@warehouse.com',
      alternatePhone: '+1-404-555-0101'
    },
    capacity: {
      totalArea: 50000,
      areaUnit: 'sqft',
      storageCapacity: 10000,
      capacityUnit: 'pallets',
      currentUtilization: 75,
      rackingSystem: true,
      numberOfBays: 12,
      numberOfDocks: 8
    },
    operations: {
      operatingHours: '6:00 AM - 10:00 PM',
      workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      shiftPattern: '2 Shifts',
      staffCount: 45,
      pickingMethod: 'fifo',
      allowNegativeStock: false
    },
    zones: {
      receivingArea: true,
      quarantineArea: true,
      qualityCheckArea: true,
      packingArea: true,
      shippingArea: true,
      returnArea: true
    },
    facilities: {
      temperatureControlled: false,
      humidityControlled: false,
      securitySystem: true,
      fireProtection: true,
      hasLoadingDock: true,
      forkliftsAvailable: 8
    },
    inventory: {
      totalItems: 15000,
      totalValue: 2500000,
      lastStockCount: '2024-01-10',
      cycleCountFrequency: 'weekly'
    },
    costCenter: {
      code: 'CC-WH001',
      budgetAllocated: 500000,
      operatingCost: 425000,
      costPerSqft: 8.5
    },
    integration: {
      wmsIntegrated: true,
      barcodeEnabled: true,
      rfidEnabled: false,
      automationLevel: 'semi_automated'
    },
    createdAt: '2023-01-15',
    updatedAt: '2024-01-15'
  },
  {
    id: '2',
    warehouseCode: 'WH-002',
    warehouseName: 'Cold Storage Facility',
    warehouseType: 'cold_storage',
    status: 'active',
    address: {
      line1: '250 Freezer Lane',
      city: 'Chicago',
      state: 'IL',
      country: 'USA',
      postalCode: '60601',
      latitude: 41.8781,
      longitude: -87.6298
    },
    contact: {
      manager: 'Sarah Miller',
      phone: '+1-312-555-0200',
      email: 'sarah.miller@warehouse.com'
    },
    capacity: {
      totalArea: 25000,
      areaUnit: 'sqft',
      storageCapacity: 5000,
      capacityUnit: 'pallets',
      currentUtilization: 65,
      rackingSystem: true,
      numberOfBays: 6,
      numberOfDocks: 4
    },
    operations: {
      operatingHours: '24/7',
      workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      shiftPattern: '3 Shifts',
      staffCount: 30,
      pickingMethod: 'fefo',
      allowNegativeStock: false
    },
    zones: {
      receivingArea: true,
      quarantineArea: true,
      qualityCheckArea: true,
      packingArea: true,
      shippingArea: true,
      returnArea: false
    },
    facilities: {
      temperatureControlled: true,
      temperatureRange: {
        min: -20,
        max: 5,
        unit: 'C'
      },
      humidityControlled: true,
      securitySystem: true,
      fireProtection: true,
      hasLoadingDock: true,
      forkliftsAvailable: 4
    },
    inventory: {
      totalItems: 8000,
      totalValue: 1800000,
      lastStockCount: '2024-01-08',
      cycleCountFrequency: 'monthly'
    },
    costCenter: {
      code: 'CC-WH002',
      budgetAllocated: 400000,
      operatingCost: 380000,
      costPerSqft: 15.2
    },
    integration: {
      wmsIntegrated: true,
      barcodeEnabled: true,
      rfidEnabled: true,
      automationLevel: 'semi_automated'
    },
    createdAt: '2023-03-20',
    updatedAt: '2024-01-10'
  }
];

const warehouseTypes = ['main', 'distribution', 'transit', 'cold_storage', 'bonded'];
const pickingMethods = ['fifo', 'lifo', 'fefo', 'manual'];
const cycleCountFrequencies = ['daily', 'weekly', 'monthly', 'quarterly'];
const automationLevels = ['manual', 'semi_automated', 'fully_automated'];

export default function WarehouseMaster() {
  const [warehouses, setWarehouses] = useState<WarehouseLocation[]>(mockWarehouses);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showModal, setShowModal] = useState(false);
  const [editingWarehouse, setEditingWarehouse] = useState<WarehouseLocation | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [activeTab, setActiveTab] = useState('basic');

  const filteredWarehouses = warehouses.filter(warehouse => {
    const matchesSearch = warehouse.warehouseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         warehouse.warehouseCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         warehouse.address.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || warehouse.warehouseType === filterType;
    const matchesStatus = filterStatus === 'all' || warehouse.status === filterStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  const handleAddWarehouse = () => {
    setEditingWarehouse(null);
    setShowModal(true);
    setActiveTab('basic');
  };

  const handleEditWarehouse = (warehouse: WarehouseLocation) => {
    setEditingWarehouse(warehouse);
    setShowModal(true);
    setActiveTab('basic');
  };

  const handleDeleteWarehouse = (id: string) => {
    if (confirm('Are you sure you want to delete this warehouse?')) {
      setWarehouses(warehouses.filter(warehouse => warehouse.id !== id));
    }
  };

  const handleSaveWarehouse = (warehouseData: any) => {
    if (editingWarehouse) {
      setWarehouses(warehouses.map(warehouse =>
        warehouse.id === editingWarehouse.id
          ? { ...warehouse, ...warehouseData, updatedAt: new Date().toISOString().split('T')[0] }
          : warehouse
      ));
    } else {
      const newWarehouse: WarehouseLocation = {
        id: Date.now().toString(),
        ...warehouseData,
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0]
      };
      setWarehouses([...warehouses, newWarehouse]);
    }
    setShowModal(false);
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-yellow-100 text-yellow-800',
      under_maintenance: 'bg-red-100 text-red-800'
    };
    return `px-2 py-1 rounded-full text-xs font-medium ${colors[status as keyof typeof colors]}`;
  };

  const getTypeBadge = (type: string) => {
    const colors = {
      main: 'bg-blue-100 text-blue-800',
      distribution: 'bg-purple-100 text-purple-800',
      transit: 'bg-yellow-100 text-yellow-800',
      cold_storage: 'bg-cyan-100 text-cyan-800',
      bonded: 'bg-gray-100 text-gray-800'
    };
    return `px-2 py-1 rounded-full text-xs font-medium ${colors[type as keyof typeof colors]}`;
  };

  const getUtilizationColor = (utilization: number) => {
    if (utilization < 50) return 'text-green-600';
    if (utilization < 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Warehouse className="w-8 h-8 text-blue-600" />
              Warehouse Master
            </h1>
            <p className="text-gray-600">Manage warehouse locations and facilities</p>
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
              onClick={handleAddWarehouse}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" />
              Add Warehouse
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search warehouses..."
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
            {warehouseTypes.map(type => (
              <option key={type} value={type}>{type.replace('_', ' ')}</option>
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
            <option value="under_maintenance">Under Maintenance</option>
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Warehouse</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Capacity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Operations</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Inventory</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredWarehouses.map((warehouse) => (
                  <tr key={warehouse.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{warehouse.warehouseName}</div>
                        <div className="text-sm text-gray-500">{warehouse.warehouseCode}</div>
                        <span className={getTypeBadge(warehouse.warehouseType)}>
                          {warehouse.warehouseType.replace('_', ' ')}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{warehouse.address.city}, {warehouse.address.state}</div>
                      <div className="text-sm text-gray-500">{warehouse.address.country}</div>
                      <div className="text-sm text-gray-500 flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        {warehouse.contact.phone}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {warehouse.capacity.totalArea.toLocaleString()} {warehouse.capacity.areaUnit}
                      </div>
                      <div className="text-sm text-gray-500">
                        {warehouse.capacity.storageCapacity.toLocaleString()} {warehouse.capacity.capacityUnit}
                      </div>
                      <div className={`text-sm font-medium ${getUtilizationColor(warehouse.capacity.currentUtilization)}`}>
                        {warehouse.capacity.currentUtilization}% utilized
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{warehouse.operations.operatingHours}</div>
                      <div className="text-sm text-gray-500">{warehouse.operations.staffCount} staff</div>
                      <div className="text-sm text-gray-500">{warehouse.operations.pickingMethod.toUpperCase()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{warehouse.inventory.totalItems.toLocaleString()} items</div>
                      <div className="text-sm text-gray-500">${warehouse.inventory.totalValue.toLocaleString()}</div>
                      <div className="text-sm text-gray-500">Count: {warehouse.inventory.cycleCountFrequency}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={getStatusBadge(warehouse.status)}>
                        {warehouse.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditWarehouse(warehouse)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-900">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteWarehouse(warehouse.id)}
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
          {filteredWarehouses.map((warehouse) => (
            <div key={warehouse.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{warehouse.warehouseName}</h3>
                  <p className="text-sm text-gray-500">{warehouse.warehouseCode}</p>
                  <span className={getTypeBadge(warehouse.warehouseType)}>
                    {warehouse.warehouseType.replace('_', ' ')}
                  </span>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleEditWarehouse(warehouse)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteWarehouse(warehouse.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4" />
                  {warehouse.address.city}, {warehouse.address.state}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Package className="w-4 h-4" />
                  {warehouse.capacity.totalArea.toLocaleString()} {warehouse.capacity.areaUnit}
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <BarChart3 className="w-4 h-4" />
                  <span className={getUtilizationColor(warehouse.capacity.currentUtilization)}>
                    {warehouse.capacity.currentUtilization}% utilized
                  </span>
                </div>
                {warehouse.facilities.temperatureControlled && (
                  <div className="flex items-center gap-2 text-sm text-blue-600">
                    <ThermometerSun className="w-4 h-4" />
                    Temperature Controlled
                  </div>
                )}
              </div>
              <div className="flex justify-between items-center">
                <span className={getStatusBadge(warehouse.status)}>
                  {warehouse.status.replace('_', ' ')}
                </span>
                <span className="text-sm text-gray-600">
                  {warehouse.inventory.totalItems.toLocaleString()} items
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <WarehouseModal
          warehouse={editingWarehouse}
          onSave={handleSaveWarehouse}
          onClose={() => setShowModal(false)}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      )}
    </div>
  );
}

interface WarehouseModalProps {
  warehouse: WarehouseLocation | null;
  onSave: (warehouse: any) => void;
  onClose: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

function WarehouseModal({ warehouse, onSave, onClose, activeTab, setActiveTab }: WarehouseModalProps) {
  const [formData, setFormData] = useState({
    warehouseCode: warehouse?.warehouseCode || '',
    warehouseName: warehouse?.warehouseName || '',
    warehouseType: warehouse?.warehouseType || 'main',
    status: warehouse?.status || 'active',
    address: warehouse?.address || {
      line1: '',
      line2: '',
      city: '',
      state: '',
      country: '',
      postalCode: '',
      latitude: 0,
      longitude: 0
    },
    contact: warehouse?.contact || {
      manager: '',
      phone: '',
      email: '',
      alternatePhone: ''
    },
    capacity: warehouse?.capacity || {
      totalArea: 0,
      areaUnit: 'sqft',
      storageCapacity: 0,
      capacityUnit: 'pallets',
      currentUtilization: 0,
      rackingSystem: false,
      numberOfBays: 0,
      numberOfDocks: 0
    },
    operations: warehouse?.operations || {
      operatingHours: '',
      workingDays: [],
      shiftPattern: '',
      staffCount: 0,
      pickingMethod: 'fifo',
      allowNegativeStock: false
    },
    zones: warehouse?.zones || {
      receivingArea: false,
      quarantineArea: false,
      qualityCheckArea: false,
      packingArea: false,
      shippingArea: false,
      returnArea: false
    },
    facilities: warehouse?.facilities || {
      temperatureControlled: false,
      temperatureRange: {
        min: 0,
        max: 0,
        unit: 'C'
      },
      humidityControlled: false,
      securitySystem: false,
      fireProtection: false,
      hasLoadingDock: false,
      forkliftsAvailable: 0
    },
    inventory: warehouse?.inventory || {
      totalItems: 0,
      totalValue: 0,
      lastStockCount: new Date().toISOString().split('T')[0],
      cycleCountFrequency: 'monthly'
    },
    costCenter: warehouse?.costCenter || {
      code: '',
      budgetAllocated: 0,
      operatingCost: 0,
      costPerSqft: 0
    },
    integration: warehouse?.integration || {
      wmsIntegrated: false,
      barcodeEnabled: false,
      rfidEnabled: false,
      automationLevel: 'manual'
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: Warehouse },
    { id: 'address', label: 'Location', icon: MapPin },
    { id: 'capacity', label: 'Capacity', icon: Package },
    { id: 'operations', label: 'Operations', icon: Truck },
    { id: 'facilities', label: 'Facilities', icon: ThermometerSun },
    { id: 'integration', label: 'Integration', icon: BarChart3 }
  ];

  const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            {warehouse ? 'Edit Warehouse' : 'Add New Warehouse'}
          </h2>
        </div>

        <div className="flex border-b border-gray-200 overflow-x-auto">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap ${
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Warehouse Code</label>
                  <input
                    type="text"
                    value={formData.warehouseCode}
                    onChange={(e) => setFormData({...formData, warehouseCode: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Warehouse Name</label>
                  <input
                    type="text"
                    value={formData.warehouseName}
                    onChange={(e) => setFormData({...formData, warehouseName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Warehouse Type</label>
                  <select
                    value={formData.warehouseType}
                    onChange={(e) => setFormData({...formData, warehouseType: e.target.value as any})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {warehouseTypes.map(type => (
                      <option key={type} value={type}>{type.replace('_', ' ')}</option>
                    ))}
                  </select>
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
                    <option value="under_maintenance">Under Maintenance</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Manager</label>
                  <input
                    type="text"
                    value={formData.contact.manager}
                    onChange={(e) => setFormData({...formData, contact: {...formData.contact, manager: e.target.value}})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
                  <input
                    type="email"
                    value={formData.contact.email}
                    onChange={(e) => setFormData({...formData, contact: {...formData.contact, email: e.target.value}})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={formData.contact.phone}
                    onChange={(e) => setFormData({...formData, contact: {...formData.contact, phone: e.target.value}})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Alternate Phone</label>
                  <input
                    type="tel"
                    value={formData.contact.alternatePhone}
                    onChange={(e) => setFormData({...formData, contact: {...formData.contact, alternatePhone: e.target.value}})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            )}

            {activeTab === 'address' && (
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                  <input
                    type="text"
                    value={formData.address.country}
                    onChange={(e) => setFormData({...formData, address: {...formData.address, country: e.target.value}})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                  <input
                    type="text"
                    value={formData.address.postalCode}
                    onChange={(e) => setFormData({...formData, address: {...formData.address, postalCode: e.target.value}})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            )}

            {activeTab === 'capacity' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Total Area</label>
                  <input
                    type="number"
                    value={formData.capacity.totalArea}
                    onChange={(e) => setFormData({...formData, capacity: {...formData.capacity, totalArea: Number(e.target.value)}})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Area Unit</label>
                  <select
                    value={formData.capacity.areaUnit}
                    onChange={(e) => setFormData({...formData, capacity: {...formData.capacity, areaUnit: e.target.value as any}})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="sqft">Square Feet</option>
                    <option value="sqm">Square Meters</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Storage Capacity</label>
                  <input
                    type="number"
                    value={formData.capacity.storageCapacity}
                    onChange={(e) => setFormData({...formData, capacity: {...formData.capacity, storageCapacity: Number(e.target.value)}})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Capacity Unit</label>
                  <select
                    value={formData.capacity.capacityUnit}
                    onChange={(e) => setFormData({...formData, capacity: {...formData.capacity, capacityUnit: e.target.value as any}})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="pallets">Pallets</option>
                    <option value="cubic_ft">Cubic Feet</option>
                    <option value="cubic_m">Cubic Meters</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Utilization (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.capacity.currentUtilization}
                    onChange={(e) => setFormData({...formData, capacity: {...formData.capacity, currentUtilization: Number(e.target.value)}})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Number of Bays</label>
                  <input
                    type="number"
                    value={formData.capacity.numberOfBays}
                    onChange={(e) => setFormData({...formData, capacity: {...formData.capacity, numberOfBays: Number(e.target.value)}})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Number of Docks</label>
                  <input
                    type="number"
                    value={formData.capacity.numberOfDocks}
                    onChange={(e) => setFormData({...formData, capacity: {...formData.capacity, numberOfDocks: Number(e.target.value)}})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.capacity.rackingSystem}
                      onChange={(e) => setFormData({...formData, capacity: {...formData.capacity, rackingSystem: e.target.checked}})}
                      className="mr-2"
                    />
                    Has Racking System
                  </label>
                </div>
              </div>
            )}

            {activeTab === 'operations' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Operating Hours</label>
                    <input
                      type="text"
                      value={formData.operations.operatingHours}
                      onChange={(e) => setFormData({...formData, operations: {...formData.operations, operatingHours: e.target.value}})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., 8:00 AM - 6:00 PM"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Shift Pattern</label>
                    <input
                      type="text"
                      value={formData.operations.shiftPattern}
                      onChange={(e) => setFormData({...formData, operations: {...formData.operations, shiftPattern: e.target.value}})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., 2 Shifts"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Staff Count</label>
                    <input
                      type="number"
                      value={formData.operations.staffCount}
                      onChange={(e) => setFormData({...formData, operations: {...formData.operations, staffCount: Number(e.target.value)}})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Picking Method</label>
                    <select
                      value={formData.operations.pickingMethod}
                      onChange={(e) => setFormData({...formData, operations: {...formData.operations, pickingMethod: e.target.value as any}})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {pickingMethods.map(method => (
                        <option key={method} value={method}>{method.toUpperCase()}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Working Days</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {weekDays.map(day => (
                      <label key={day} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.operations.workingDays.includes(day)}
                          onChange={(e) => {
                            const days = e.target.checked
                              ? [...formData.operations.workingDays, day]
                              : formData.operations.workingDays.filter(d => d !== day);
                            setFormData({...formData, operations: {...formData.operations, workingDays: days}});
                          }}
                          className="mr-2"
                        />
                        {day}
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.operations.allowNegativeStock}
                      onChange={(e) => setFormData({...formData, operations: {...formData.operations, allowNegativeStock: e.target.checked}})}
                      className="mr-2"
                    />
                    Allow Negative Stock
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Warehouse Zones</label>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(formData.zones).map(([zone, enabled]) => (
                      <label key={zone} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={enabled}
                          onChange={(e) => setFormData({...formData, zones: {...formData.zones, [zone]: e.target.checked}})}
                          className="mr-2"
                        />
                        {zone.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'facilities' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.facilities.temperatureControlled}
                      onChange={(e) => setFormData({...formData, facilities: {...formData.facilities, temperatureControlled: e.target.checked}})}
                      className="mr-2"
                    />
                    Temperature Controlled
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.facilities.humidityControlled}
                      onChange={(e) => setFormData({...formData, facilities: {...formData.facilities, humidityControlled: e.target.checked}})}
                      className="mr-2"
                    />
                    Humidity Controlled
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.facilities.securitySystem}
                      onChange={(e) => setFormData({...formData, facilities: {...formData.facilities, securitySystem: e.target.checked}})}
                      className="mr-2"
                    />
                    Security System
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.facilities.fireProtection}
                      onChange={(e) => setFormData({...formData, facilities: {...formData.facilities, fireProtection: e.target.checked}})}
                      className="mr-2"
                    />
                    Fire Protection
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.facilities.hasLoadingDock}
                      onChange={(e) => setFormData({...formData, facilities: {...formData.facilities, hasLoadingDock: e.target.checked}})}
                      className="mr-2"
                    />
                    Has Loading Dock
                  </label>
                </div>

                {formData.facilities.temperatureControlled && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Min Temperature</label>
                      <input
                        type="number"
                        value={formData.facilities.temperatureRange?.min}
                        onChange={(e) => setFormData({...formData, facilities: {...formData.facilities, temperatureRange: {...formData.facilities.temperatureRange!, min: Number(e.target.value)}}})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Max Temperature</label>
                      <input
                        type="number"
                        value={formData.facilities.temperatureRange?.max}
                        onChange={(e) => setFormData({...formData, facilities: {...formData.facilities, temperatureRange: {...formData.facilities.temperatureRange!, max: Number(e.target.value)}}})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                      <select
                        value={formData.facilities.temperatureRange?.unit}
                        onChange={(e) => setFormData({...formData, facilities: {...formData.facilities, temperatureRange: {...formData.facilities.temperatureRange!, unit: e.target.value as any}}})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="C">Celsius</option>
                        <option value="F">Fahrenheit</option>
                      </select>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Available Forklifts</label>
                  <input
                    type="number"
                    value={formData.facilities.forkliftsAvailable}
                    onChange={(e) => setFormData({...formData, facilities: {...formData.facilities, forkliftsAvailable: Number(e.target.value)}})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            )}

            {activeTab === 'integration' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.integration.wmsIntegrated}
                      onChange={(e) => setFormData({...formData, integration: {...formData.integration, wmsIntegrated: e.target.checked}})}
                      className="mr-2"
                    />
                    WMS Integrated
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.integration.barcodeEnabled}
                      onChange={(e) => setFormData({...formData, integration: {...formData.integration, barcodeEnabled: e.target.checked}})}
                      className="mr-2"
                    />
                    Barcode Enabled
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.integration.rfidEnabled}
                      onChange={(e) => setFormData({...formData, integration: {...formData.integration, rfidEnabled: e.target.checked}})}
                      className="mr-2"
                    />
                    RFID Enabled
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Automation Level</label>
                  <select
                    value={formData.integration.automationLevel}
                    onChange={(e) => setFormData({...formData, integration: {...formData.integration, automationLevel: e.target.value as any}})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {automationLevels.map(level => (
                      <option key={level} value={level}>{level.replace('_', ' ')}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cycle Count Frequency</label>
                  <select
                    value={formData.inventory.cycleCountFrequency}
                    onChange={(e) => setFormData({...formData, inventory: {...formData.inventory, cycleCountFrequency: e.target.value as any}})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {cycleCountFrequencies.map(freq => (
                      <option key={freq} value={freq}>{freq}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cost Center Code</label>
                    <input
                      type="text"
                      value={formData.costCenter.code}
                      onChange={(e) => setFormData({...formData, costCenter: {...formData.costCenter, code: e.target.value}})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Budget Allocated</label>
                    <input
                      type="number"
                      value={formData.costCenter.budgetAllocated}
                      onChange={(e) => setFormData({...formData, costCenter: {...formData.costCenter, budgetAllocated: Number(e.target.value)}})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
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
            {warehouse ? 'Update Warehouse' : 'Create Warehouse'}
          </button>
        </div>
      </div>
    </div>
  );
}
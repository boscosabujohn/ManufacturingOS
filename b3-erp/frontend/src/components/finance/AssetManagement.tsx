'use client';

import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import {
  BuildingOfficeIcon, TruckIcon, ComputerDesktopIcon, WrenchScrewdriverIcon,
  ClockIcon, CurrencyDollarIcon, DocumentTextIcon, CalendarIcon,
  PlusIcon, PencilIcon, TrashIcon, EyeIcon, ArrowTrendingDownIcon,
  CheckCircleIcon, ExclamationTriangleIcon, InformationCircleIcon,
  QrCodeIcon, DocumentDuplicateIcon, PhotoIcon, MapPinIcon
} from '@heroicons/react/24/outline';

interface Asset {
  id: string;
  name: string;
  assetNumber: string;
  category: AssetCategory;
  type: string;
  description: string;
  status: 'active' | 'inactive' | 'disposed' | 'maintenance' | 'damaged';
  location: string;
  department: string;
  custodian: string;
  serialNumber?: string;
  manufacturer?: string;
  model?: string;
  acquisitionDate: string;
  acquisitionCost: number;
  currentValue: number;
  depreciationMethod: 'straight-line' | 'double-declining' | 'sum-of-years' | 'units-of-production';
  usefulLife: number;
  salvageValue: number;
  accumulatedDepreciation: number;
  bookValue: number;
  lastMaintenanceDate?: string;
  nextMaintenanceDate?: string;
  warranty?: AssetWarranty;
  tags: string[];
  documents: AssetDocument[];
  images: string[];
  notes?: string;
  createdDate: string;
  lastModified: string;
}

interface AssetCategory {
  id: string;
  name: string;
  code: string;
  color: string;
  icon: any;
  defaultUsefulLife: number;
  defaultDepreciationMethod: string;
}

interface AssetWarranty {
  provider: string;
  startDate: string;
  endDate: string;
  description: string;
  status: 'active' | 'expired' | 'claimed';
}

interface AssetDocument {
  id: string;
  name: string;
  type: 'purchase_order' | 'invoice' | 'warranty' | 'manual' | 'certificate' | 'other';
  url: string;
  uploadDate: string;
  size: string;
}

interface DepreciationSchedule {
  year: number;
  beginningValue: number;
  depreciationExpense: number;
  accumulatedDepreciation: number;
  endingValue: number;
}

interface MaintenanceRecord {
  id: string;
  assetId: string;
  date: string;
  type: 'preventive' | 'corrective' | 'emergency' | 'inspection';
  description: string;
  cost: number;
  technician: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  notes?: string;
}

interface AssetMovement {
  id: string;
  assetId: string;
  date: string;
  fromLocation: string;
  toLocation: string;
  fromCustodian: string;
  toCustodian: string;
  reason: string;
  authorizedBy: string;
}

const AssetManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'assets' | 'depreciation' | 'maintenance' | 'movements'>('dashboard');
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [showAssetModal, setShowAssetModal] = useState(false);
  const [showDepreciationModal, setShowDepreciationModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Asset categories
  const assetCategories: AssetCategory[] = [
    {
      id: '1',
      name: 'Buildings & Real Estate',
      code: 'BLDG',
      color: '#3B82F6',
      icon: BuildingOfficeIcon,
      defaultUsefulLife: 30,
      defaultDepreciationMethod: 'straight-line'
    },
    {
      id: '2',
      name: 'Vehicles & Transportation',
      code: 'VHCL',
      color: '#10B981',
      icon: TruckIcon,
      defaultUsefulLife: 5,
      defaultDepreciationMethod: 'double-declining'
    },
    {
      id: '3',
      name: 'Computer & IT Equipment',
      code: 'IT',
      color: '#F59E0B',
      icon: ComputerDesktopIcon,
      defaultUsefulLife: 3,
      defaultDepreciationMethod: 'straight-line'
    },
    {
      id: '4',
      name: 'Machinery & Equipment',
      code: 'MACH',
      color: '#EF4444',
      icon: WrenchScrewdriverIcon,
      defaultUsefulLife: 10,
      defaultDepreciationMethod: 'straight-line'
    }
  ];

  // Mock data
  const [assets] = useState<Asset[]>([
    {
      id: '1',
      name: 'Manufacturing Equipment Line A',
      assetNumber: 'MACH-001',
      category: assetCategories[3],
      type: 'Production Equipment',
      description: 'High-precision manufacturing equipment for product line A',
      status: 'active',
      location: 'Factory Floor - Bay 1',
      department: 'Manufacturing',
      custodian: 'John Smith',
      serialNumber: 'ME2024001',
      manufacturer: 'TechManufacturing Inc.',
      model: 'TM-5000X',
      acquisitionDate: '2022-03-15T00:00:00Z',
      acquisitionCost: 250000,
      currentValue: 187500,
      depreciationMethod: 'straight-line',
      usefulLife: 10,
      salvageValue: 25000,
      accumulatedDepreciation: 62500,
      bookValue: 187500,
      lastMaintenanceDate: '2024-01-10T00:00:00Z',
      nextMaintenanceDate: '2024-04-10T00:00:00Z',
      warranty: {
        provider: 'TechManufacturing Inc.',
        startDate: '2022-03-15T00:00:00Z',
        endDate: '2025-03-15T00:00:00Z',
        description: 'Full parts and labor warranty',
        status: 'active'
      },
      tags: ['critical', 'production', 'high-value'],
      documents: [
        {
          id: '1',
          name: 'Purchase Order PO-2022-0315',
          type: 'purchase_order',
          url: '/documents/po-2022-0315.pdf',
          uploadDate: '2022-03-15T00:00:00Z',
          size: '2.3 MB'
        }
      ],
      images: ['/assets/mach-001-1.jpg', '/assets/mach-001-2.jpg'],
      notes: 'Critical production equipment. Requires monthly maintenance.',
      createdDate: '2022-03-15T00:00:00Z',
      lastModified: '2024-01-15T10:30:00Z'
    },
    {
      id: '2',
      name: 'Company Fleet Vehicle',
      assetNumber: 'VHCL-001',
      category: assetCategories[1],
      type: 'Delivery Truck',
      description: '2023 Ford Transit delivery vehicle',
      status: 'active',
      location: 'Parking Lot A',
      department: 'Logistics',
      custodian: 'Mike Johnson',
      serialNumber: '1FTBW2CM5PKA12345',
      manufacturer: 'Ford',
      model: 'Transit 350',
      acquisitionDate: '2023-06-01T00:00:00Z',
      acquisitionCost: 45000,
      currentValue: 36000,
      depreciationMethod: 'double-declining',
      usefulLife: 5,
      salvageValue: 5000,
      accumulatedDepreciation: 9000,
      bookValue: 36000,
      lastMaintenanceDate: '2024-01-05T00:00:00Z',
      nextMaintenanceDate: '2024-04-05T00:00:00Z',
      warranty: {
        provider: 'Ford Motor Company',
        startDate: '2023-06-01T00:00:00Z',
        endDate: '2026-06-01T00:00:00Z',
        description: 'Bumper-to-bumper warranty',
        status: 'active'
      },
      tags: ['vehicle', 'delivery', 'logistics'],
      documents: [],
      images: [],
      createdDate: '2023-06-01T00:00:00Z',
      lastModified: '2024-01-10T14:20:00Z'
    },
    {
      id: '3',
      name: 'Office Building Main',
      assetNumber: 'BLDG-001',
      category: assetCategories[0],
      type: 'Commercial Building',
      description: 'Main office building and headquarters',
      status: 'active',
      location: '123 Business Ave',
      department: 'Administration',
      custodian: 'Facilities Management',
      acquisitionDate: '2020-01-01T00:00:00Z',
      acquisitionCost: 2500000,
      currentValue: 2166667,
      depreciationMethod: 'straight-line',
      usefulLife: 30,
      salvageValue: 250000,
      accumulatedDepreciation: 333333,
      bookValue: 2166667,
      tags: ['building', 'headquarters', 'real-estate'],
      documents: [],
      images: [],
      createdDate: '2020-01-01T00:00:00Z',
      lastModified: '2024-01-01T00:00:00Z'
    }
  ]);

  const [maintenanceRecords] = useState<MaintenanceRecord[]>([
    {
      id: '1',
      assetId: '1',
      date: '2024-01-10T00:00:00Z',
      type: 'preventive',
      description: 'Monthly preventive maintenance - lubrication and inspection',
      cost: 1200,
      technician: 'Bob Wilson',
      status: 'completed',
      notes: 'All systems operating normally. Replaced filter.'
    },
    {
      id: '2',
      assetId: '2',
      date: '2024-01-05T00:00:00Z',
      type: 'preventive',
      description: 'Quarterly vehicle inspection and oil change',
      cost: 350,
      technician: 'Auto Service Center',
      status: 'completed',
      notes: 'Oil changed, tires rotated, brakes inspected.'
    },
    {
      id: '3',
      assetId: '1',
      date: '2024-02-15T00:00:00Z',
      type: 'corrective',
      description: 'Replace worn belt in main drive system',
      cost: 800,
      technician: 'Bob Wilson',
      status: 'scheduled'
    }
  ]);

  const [assetMovements] = useState<AssetMovement[]>([
    {
      id: '1',
      assetId: '2',
      date: '2024-01-08T00:00:00Z',
      fromLocation: 'Parking Lot B',
      toLocation: 'Parking Lot A',
      fromCustodian: 'Sarah Davis',
      toCustodian: 'Mike Johnson',
      reason: 'Department transfer',
      authorizedBy: 'Fleet Manager'
    }
  ]);

  // Mock chart data
  const assetValueData = [
    { month: 'Jan', acquisition: 2795000, current: 2390000, depreciation: 405000 },
    { month: 'Feb', acquisition: 2795000, current: 2370000, depreciation: 425000 },
    { month: 'Mar', acquisition: 2795000, current: 2350000, depreciation: 445000 },
    { month: 'Apr', acquisition: 2795000, current: 2330000, depreciation: 465000 },
    { month: 'May', acquisition: 2795000, current: 2310000, depreciation: 485000 },
    { month: 'Jun', acquisition: 2795000, current: 2290000, depreciation: 505000 }
  ];

  const depreciationTrendData = [
    { year: 2024, expense: 125000 },
    { year: 2025, expense: 118000 },
    { year: 2026, expense: 112000 },
    { year: 2027, expense: 105000 },
    { year: 2028, expense: 98000 }
  ];

  const categoryDistribution = assetCategories.map(cat => ({
    name: cat.name,
    value: assets.filter(a => a.category.id === cat.id).reduce((sum, a) => sum + a.currentValue, 0),
    color: cat.color,
    count: assets.filter(a => a.category.id === cat.id).length
  }));

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircleIcon },
      inactive: { bg: 'bg-gray-100', text: 'text-gray-800', icon: ClockIcon },
      disposed: { bg: 'bg-red-100', text: 'text-red-800', icon: TrashIcon },
      maintenance: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: WrenchScrewdriverIcon },
      damaged: { bg: 'bg-red-100', text: 'text-red-800', icon: ExclamationTriangleIcon }
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        <Icon className="w-3 h-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const calculateDepreciationSchedule = (asset: Asset): DepreciationSchedule[] => {
    const schedule: DepreciationSchedule[] = [];
    const depreciableAmount = asset.acquisitionCost - asset.salvageValue;
    let beginningValue = asset.acquisitionCost;
    let accumulatedDepreciation = 0;

    for (let year = 1; year <= asset.usefulLife; year++) {
      let depreciationExpense = 0;

      if (asset.depreciationMethod === 'straight-line') {
        depreciationExpense = depreciableAmount / asset.usefulLife;
      } else if (asset.depreciationMethod === 'double-declining') {
        const rate = (2 / asset.usefulLife);
        depreciationExpense = Math.min(beginningValue * rate, beginningValue - asset.salvageValue);
      }

      accumulatedDepreciation += depreciationExpense;
      const endingValue = asset.acquisitionCost - accumulatedDepreciation;

      schedule.push({
        year,
        beginningValue,
        depreciationExpense,
        accumulatedDepreciation,
        endingValue: Math.max(endingValue, asset.salvageValue)
      });

      beginningValue = endingValue;

      if (endingValue <= asset.salvageValue) break;
    }

    return schedule;
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CurrencyDollarIcon className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Asset Value</p>
              <p className="text-2xl font-semibold text-gray-900">
                {formatCurrency(assets.reduce((sum, a) => sum + a.currentValue, 0))}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <DocumentTextIcon className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Assets</p>
              <p className="text-2xl font-semibold text-gray-900">{assets.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ArrowTrendingDownIcon className="h-8 w-8 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Annual Depreciation</p>
              <p className="text-2xl font-semibold text-gray-900">
                {formatCurrency(assets.reduce((sum, a) => sum + (a.acquisitionCost - a.salvageValue) / a.usefulLife, 0))}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <WrenchScrewdriverIcon className="h-8 w-8 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Maintenance Due</p>
              <p className="text-2xl font-semibold text-gray-900">
                {assets.filter(a => a.nextMaintenanceDate && new Date(a.nextMaintenanceDate) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)).length}
              </p>
              <p className="text-sm text-red-600">Next 30 days</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Asset Value Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={assetValueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              <Legend />
              <Area type="monotone" dataKey="current" stackId="1" stroke="#10B981" fill="#10B981" name="Current Value" />
              <Area type="monotone" dataKey="depreciation" stackId="1" stroke="#EF4444" fill="#EF4444" name="Accumulated Depreciation" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Asset Distribution by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Depreciation Expense Forecast</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={depreciationTrendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              <Bar dataKey="expense" fill="#F59E0B" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Asset Categories</h3>
          <div className="space-y-4">
            {categoryDistribution.map((category) => (
              <div key={category.name} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full mr-3" style={{ backgroundColor: category.color }}></div>
                  <div>
                    <p className="font-medium text-gray-900">{category.name}</p>
                    <p className="text-sm text-gray-600">{category.count} assets</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">{formatCurrency(category.value)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderAssets = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <h3 className="text-lg font-semibold text-gray-900">Asset Registry</h3>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          >
            <option value="all">All Categories</option>
            {assetCategories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
        <button
          onClick={() => setShowAssetModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Add Asset
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Asset
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Current Value
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {assets
                .filter(asset => selectedCategory === 'all' || asset.category.id === selectedCategory)
                .map((asset) => {
                  const CategoryIcon = asset.category.icon;
                  return (
                    <tr key={asset.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8">
                            <CategoryIcon className="h-8 w-8" style={{ color: asset.category.color }} />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{asset.name}</div>
                            <div className="text-sm text-gray-500">{asset.assetNumber}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                              style={{ backgroundColor: asset.category.color + '20', color: asset.category.color }}>
                          {asset.category.name}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {asset.location}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatCurrency(asset.currentValue)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(asset.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setSelectedAsset(asset)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <EyeIcon className="w-4 h-4" />
                          </button>
                          <button className="text-gray-600 hover:text-blue-600">
                            <PencilIcon className="w-4 h-4" />
                          </button>
                          <button className="text-gray-600 hover:text-green-600">
                            <QrCodeIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderDepreciation = () => {
    const selectedAssetForDepreciation = selectedAsset || assets[0];
    const schedule = calculateDepreciationSchedule(selectedAssetForDepreciation);

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">Depreciation Analysis</h3>
          <select
            value={selectedAsset?.id || assets[0]?.id}
            onChange={(e) => setSelectedAsset(assets.find(a => a.id === e.target.value) || null)}
            className="border border-gray-300 rounded-lg px-3 py-2"
          >
            {assets.map((asset) => (
              <option key={asset.id} value={asset.id}>{asset.name}</option>
            ))}
          </select>
        </div>

        {selectedAssetForDepreciation && (
          <>
            {/* Asset Summary */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h4 className="font-medium text-gray-900 mb-4">{selectedAssetForDepreciation.name}</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Acquisition Cost</p>
                  <p className="font-medium text-gray-900">{formatCurrency(selectedAssetForDepreciation.acquisitionCost)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Current Value</p>
                  <p className="font-medium text-gray-900">{formatCurrency(selectedAssetForDepreciation.currentValue)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Accumulated Depreciation</p>
                  <p className="font-medium text-red-600">{formatCurrency(selectedAssetForDepreciation.accumulatedDepreciation)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Useful Life</p>
                  <p className="font-medium text-gray-900">{selectedAssetForDepreciation.usefulLife} years</p>
                </div>
              </div>
            </div>

            {/* Depreciation Schedule */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h4 className="font-medium text-gray-900">Depreciation Schedule</h4>
              </div>
              <div className="p-6">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Year
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Beginning Value
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Depreciation Expense
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Accumulated Depreciation
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Ending Value
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {schedule.map((row) => (
                        <tr key={row.year}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {row.year}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatCurrency(row.beginningValue)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                            {formatCurrency(row.depreciationExpense)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                            {formatCurrency(row.accumulatedDepreciation)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {formatCurrency(row.endingValue)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    );
  };

  const renderMaintenance = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Maintenance Management</h3>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h4 className="font-medium text-gray-900">Maintenance Records</h4>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {maintenanceRecords.map((record) => {
              const asset = assets.find(a => a.id === record.assetId);
              return (
                <div key={record.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h5 className="font-medium text-gray-900">{asset?.name}</h5>
                      <p className="text-sm text-gray-600">{record.description}</p>
                      <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                        <span>Date: {formatDate(record.date)}</span>
                        <span>Technician: {record.technician}</span>
                        <span>Cost: {formatCurrency(record.cost)}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                        record.type === 'preventive' ? 'bg-blue-100 text-blue-800' :
                        record.type === 'corrective' ? 'bg-yellow-100 text-yellow-800' :
                        record.type === 'emergency' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {record.type}
                      </span>
                      {getStatusBadge(record.status)}
                    </div>
                  </div>
                  {record.notes && (
                    <p className="mt-2 text-sm text-gray-600 bg-gray-50 p-2 rounded">
                      {record.notes}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );

  const renderMovements = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Asset Movements</h3>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h4 className="font-medium text-gray-900">Movement History</h4>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {assetMovements.map((movement) => {
              const asset = assets.find(a => a.id === movement.assetId);
              return (
                <div key={movement.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h5 className="font-medium text-gray-900">{asset?.name}</h5>
                      <p className="text-sm text-gray-600">{movement.reason}</p>
                      <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">From:</p>
                          <p className="text-gray-900">{movement.fromLocation}</p>
                          <p className="text-gray-600">{movement.fromCustodian}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">To:</p>
                          <p className="text-gray-900">{movement.toLocation}</p>
                          <p className="text-gray-600">{movement.toCustodian}</p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right text-sm text-gray-500">
                      <p>{formatDate(movement.date)}</p>
                      <p>Authorized by: {movement.authorizedBy}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Asset Management</h1>
        <p className="text-gray-600 mt-2">Track and manage assets with depreciation calculation and maintenance scheduling</p>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {[
            { key: 'dashboard', label: 'Dashboard', icon: CurrencyDollarIcon },
            { key: 'assets', label: 'Assets', icon: DocumentTextIcon },
            { key: 'depreciation', label: 'Depreciation', icon: ArrowTrendingDownIcon },
            { key: 'maintenance', label: 'Maintenance', icon: WrenchScrewdriverIcon },
            { key: 'movements', label: 'Movements', icon: MapPinIcon }
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center ${
                activeTab === key
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Icon className="w-5 h-5 mr-2" />
              {label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'dashboard' && renderDashboard()}
      {activeTab === 'assets' && renderAssets()}
      {activeTab === 'depreciation' && renderDepreciation()}
      {activeTab === 'maintenance' && renderMaintenance()}
      {activeTab === 'movements' && renderMovements()}
    </div>
  );
};

export default AssetManagement;
'use client';

import React, { useState } from 'react';
import {
  Package,
  TrendingDown,
  Calendar,
  Wrench,
  AlertCircle,
  Plus,
  Search,
  Filter,
  Download,
  Edit,
  Eye,
  Trash2,
  MoreVertical,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface FixedAsset {
  id: string;
  assetCode: string;
  assetName: string;
  category: 'Land & Building' | 'Plant & Machinery' | 'Furniture & Fixtures' | 'Vehicles' | 'Computers' | 'Office Equipment';
  location: string;
  purchaseDate: string;
  purchaseValue: number;
  salvageValue: number;
  usefulLife: number;
  depreciationMethod: 'Straight Line' | 'Written Down Value' | 'Double Declining' | 'Units of Production' | 'Sum of Years Digits';
  accumulatedDepreciation: number;
  netBookValue: number;
  status: 'Active' | 'Disposed' | 'Under Maintenance' | 'Idle';
  lastDepreciationDate: string;
  nextDepreciationDate: string;
  maintenanceSchedule?: string;
  warrantyExpiry?: string;
  insuranceExpiry?: string;
}

export default function FixedAssetsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Sample fixed assets data
  const fixedAssets: FixedAsset[] = [
    {
      id: 'FA001',
      assetCode: 'BLD-2020-001',
      assetName: 'Factory Building - Block A',
      category: 'Land & Building',
      location: 'Bangalore - Whitefield',
      purchaseDate: '2020-01-15',
      purchaseValue: 50000000,
      salvageValue: 5000000,
      usefulLife: 30,
      depreciationMethod: 'Straight Line',
      accumulatedDepreciation: 7500000,
      netBookValue: 42500000,
      status: 'Active',
      lastDepreciationDate: '2024-12-31',
      nextDepreciationDate: '2025-01-31',
      insuranceExpiry: '2025-06-30'
    },
    {
      id: 'FA002',
      assetCode: 'MCH-2021-005',
      assetName: 'CNC Machine - DMG Mori',
      category: 'Plant & Machinery',
      location: 'Factory - Shop Floor 1',
      purchaseDate: '2021-06-10',
      purchaseValue: 8500000,
      salvageValue: 850000,
      usefulLife: 10,
      depreciationMethod: 'Written Down Value',
      accumulatedDepreciation: 2720000,
      netBookValue: 5780000,
      status: 'Active',
      lastDepreciationDate: '2024-12-31',
      nextDepreciationDate: '2025-01-31',
      maintenanceSchedule: 'Quarterly',
      warrantyExpiry: '2024-06-10',
      insuranceExpiry: '2025-06-10'
    },
    {
      id: 'FA003',
      assetCode: 'VEH-2022-012',
      assetName: 'Delivery Truck - Tata LPT 1618',
      category: 'Vehicles',
      location: 'Logistics Yard',
      purchaseDate: '2022-03-20',
      purchaseValue: 2200000,
      salvageValue: 220000,
      usefulLife: 8,
      depreciationMethod: 'Written Down Value',
      accumulatedDepreciation: 618750,
      netBookValue: 1581250,
      status: 'Active',
      lastDepreciationDate: '2024-12-31',
      nextDepreciationDate: '2025-01-31',
      maintenanceSchedule: 'Monthly',
      insuranceExpiry: '2025-03-20'
    },
    {
      id: 'FA004',
      assetCode: 'COM-2023-045',
      assetName: 'Dell Workstation - Precision 5820',
      category: 'Computers',
      location: 'Office - Engineering Dept',
      purchaseDate: '2023-08-15',
      purchaseValue: 180000,
      salvageValue: 18000,
      usefulLife: 3,
      depreciationMethod: 'Straight Line',
      accumulatedDepreciation: 72000,
      netBookValue: 108000,
      status: 'Active',
      lastDepreciationDate: '2024-12-31',
      nextDepreciationDate: '2025-01-31',
      warrantyExpiry: '2026-08-15'
    },
    {
      id: 'FA005',
      assetCode: 'FUR-2019-008',
      assetName: 'Conference Table - 12 Seater',
      category: 'Furniture & Fixtures',
      location: 'Office - Conference Room 1',
      purchaseDate: '2019-11-05',
      purchaseValue: 150000,
      salvageValue: 15000,
      usefulLife: 10,
      depreciationMethod: 'Straight Line',
      accumulatedDepreciation: 70200,
      netBookValue: 79800,
      status: 'Active',
      lastDepreciationDate: '2024-12-31',
      nextDepreciationDate: '2025-01-31'
    },
    {
      id: 'FA006',
      assetCode: 'MCH-2018-002',
      assetName: 'Lathe Machine - HMT',
      category: 'Plant & Machinery',
      location: 'Factory - Shop Floor 2',
      purchaseDate: '2018-05-15',
      purchaseValue: 1500000,
      salvageValue: 150000,
      usefulLife: 12,
      depreciationMethod: 'Written Down Value',
      accumulatedDepreciation: 852000,
      netBookValue: 648000,
      status: 'Under Maintenance',
      lastDepreciationDate: '2024-12-31',
      nextDepreciationDate: '2025-01-31',
      maintenanceSchedule: 'Quarterly'
    },
    {
      id: 'FA007',
      assetCode: 'VEH-2020-003',
      assetName: 'Maruti Suzuki Swift - KA01AB1234',
      category: 'Vehicles',
      location: 'N/A',
      purchaseDate: '2020-02-10',
      purchaseValue: 750000,
      salvageValue: 75000,
      usefulLife: 5,
      depreciationMethod: 'Written Down Value',
      accumulatedDepreciation: 600000,
      netBookValue: 0,
      status: 'Disposed',
      lastDepreciationDate: '2024-12-31',
      nextDepreciationDate: '2025-01-31'
    }
  ];

  const filteredAssets = fixedAssets.filter(asset => {
    const matchesSearch =
      asset.assetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.assetCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = categoryFilter === 'all' || asset.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || asset.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Calculate statistics
  const totalGrossValue = fixedAssets
    .filter(a => a.status !== 'Disposed')
    .reduce((sum, asset) => sum + asset.purchaseValue, 0);

  const totalDepreciation = fixedAssets
    .filter(a => a.status !== 'Disposed')
    .reduce((sum, asset) => sum + asset.accumulatedDepreciation, 0);

  const totalNetValue = fixedAssets
    .filter(a => a.status !== 'Disposed')
    .reduce((sum, asset) => sum + asset.netBookValue, 0);

  const maintenanceCount = fixedAssets.filter(a => a.status === 'Under Maintenance').length;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      Active: 'bg-green-500/20 text-green-400 border-green-500/50',
      Disposed: 'bg-gray-500/20 text-gray-400 border-gray-500/50',
      'Under Maintenance': 'bg-orange-500/20 text-orange-400 border-orange-500/50',
      Idle: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50'
    };
    const icons = {
      Active: CheckCircle,
      Disposed: XCircle,
      'Under Maintenance': Wrench,
      Idle: AlertCircle
    };
    const Icon = icons[status as keyof typeof icons];

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${styles[status as keyof typeof styles]}`}>
        <Icon className="w-3 h-3" />
        {status}
      </span>
    );
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'Land & Building': 'bg-purple-500/20 text-purple-400',
      'Plant & Machinery': 'bg-blue-500/20 text-blue-400',
      'Furniture & Fixtures': 'bg-green-500/20 text-green-400',
      'Vehicles': 'bg-orange-500/20 text-orange-400',
      'Computers': 'bg-cyan-500/20 text-cyan-400',
      'Office Equipment': 'bg-pink-500/20 text-pink-400'
    };
    return colors[category as keyof typeof colors];
  };

  const getDepreciationPercentage = (accumulated: number, purchase: number) => {
    return ((accumulated / purchase) * 100).toFixed(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Fixed Assets Register</h1>
            <p className="text-gray-400">Track and manage fixed assets and depreciation</p>
          </div>
          <button className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors shadow-lg">
            <Plus className="w-5 h-5" />
            Add Asset
          </button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <Package className="w-8 h-8 opacity-80" />
              <TrendingDown className="w-5 h-5" />
            </div>
            <div className="text-2xl font-bold mb-1">{formatCurrency(totalGrossValue)}</div>
            <div className="text-blue-100 text-sm">Total Gross Value</div>
            <div className="mt-2 text-xs text-blue-100">{fixedAssets.filter(a => a.status !== 'Disposed').length} active assets</div>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <TrendingDown className="w-8 h-8 opacity-80" />
              <Calendar className="w-5 h-5" />
            </div>
            <div className="text-2xl font-bold mb-1">{formatCurrency(totalDepreciation)}</div>
            <div className="text-orange-100 text-sm">Accumulated Depreciation</div>
            <div className="mt-2 text-xs text-orange-100">
              {((totalDepreciation / totalGrossValue) * 100).toFixed(1)}% of gross value
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <Package className="w-8 h-8 opacity-80" />
              <CheckCircle className="w-5 h-5" />
            </div>
            <div className="text-2xl font-bold mb-1">{formatCurrency(totalNetValue)}</div>
            <div className="text-green-100 text-sm">Net Book Value</div>
            <div className="mt-2 text-xs text-green-100">Current asset value</div>
          </div>

          <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <Wrench className="w-8 h-8 opacity-80" />
              <AlertCircle className="w-5 h-5" />
            </div>
            <div className="text-2xl font-bold mb-1">{maintenanceCount}</div>
            <div className="text-red-100 text-sm">Under Maintenance</div>
            <div className="mt-2 text-xs text-red-100">Requires attention</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-[300px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by asset name, code, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">All Categories</option>
                <option value="Land & Building">Land & Building</option>
                <option value="Plant & Machinery">Plant & Machinery</option>
                <option value="Furniture & Fixtures">Furniture & Fixtures</option>
                <option value="Vehicles">Vehicles</option>
                <option value="Computers">Computers</option>
                <option value="Office Equipment">Office Equipment</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">All Status</option>
                <option value="Active">Active</option>
                <option value="Disposed">Disposed</option>
                <option value="Under Maintenance">Under Maintenance</option>
                <option value="Idle">Idle</option>
              </select>
            </div>

            <button className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        {/* Fixed Assets Table */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-900/50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Asset Details</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Category</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Location</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">Purchase Value</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">Depreciation</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">Net Book Value</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-300">Status</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAssets.map((asset, index) => (
                  <tr key={asset.id} className="border-b border-gray-700 hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-white">{asset.assetName}</div>
                        <div className="text-sm text-gray-400 font-mono">{asset.assetCode}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          Purchased: {new Date(asset.purchaseDate).toLocaleDateString()}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(asset.category)}`}>
                        {asset.category}
                      </span>
                      <div className="text-xs text-gray-500 mt-1">{asset.depreciationMethod}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-300 text-sm">{asset.location}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="text-white font-medium">{formatCurrency(asset.purchaseValue)}</div>
                      <div className="text-xs text-gray-400 mt-1">Life: {asset.usefulLife} years</div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="text-orange-400 font-medium">{formatCurrency(asset.accumulatedDepreciation)}</div>
                      <div className="text-xs text-gray-400 mt-1">
                        {getDepreciationPercentage(asset.accumulatedDepreciation, asset.purchaseValue)}%
                      </div>
                      <div className="mt-1 w-full bg-gray-700 rounded-full h-1.5">
                        <div
                          className="bg-orange-500 h-1.5 rounded-full"
                          style={{
                            width: `${getDepreciationPercentage(asset.accumulatedDepreciation, asset.purchaseValue)}%`
                          }}
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="text-green-400 font-medium">{formatCurrency(asset.netBookValue)}</div>
                      <div className="text-xs text-gray-400 mt-1">
                        Salvage: {formatCurrency(asset.salvageValue)}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {getStatusBadge(asset.status)}
                      {asset.warrantyExpiry && (
                        <div className="text-xs text-gray-400 mt-1">
                          Warranty: {new Date(asset.warrantyExpiry).toLocaleDateString()}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                         
                        >
                          <Eye className="w-4 h-4 text-blue-400" />
                        </button>
                        <button
                          className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                         
                        >
                          <Edit className="w-4 h-4 text-green-400" />
                        </button>
                        <button
                          className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                         
                        >
                          <TrendingDown className="w-4 h-4 text-orange-400" />
                        </button>
                        <button
                          className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                         
                        >
                          <MoreVertical className="w-4 h-4 text-gray-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredAssets.length === 0 && (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">No fixed assets found</p>
              <p className="text-gray-500 text-sm mt-2">Try adjusting your search or filters</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {filteredAssets.length > 0 && (
          <div className="flex items-center justify-between bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700">
            <div className="text-gray-400 text-sm">
              Showing {filteredAssets.length} of {fixedAssets.length} assets
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                Previous
              </button>
              <button className="px-4 py-2 bg-purple-600 text-white rounded-lg">1</button>
              <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors">
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

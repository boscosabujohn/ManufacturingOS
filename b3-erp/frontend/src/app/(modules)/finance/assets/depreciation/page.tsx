'use client';

import React, { useState } from 'react';
import {
  TrendingDown,
  Calendar,
  DollarSign,
  BarChart3,
  Plus,
  Search,
  Filter,
  Download,
  Play,
  Pause,
  CheckCircle,
  AlertTriangle,
  Eye,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

interface DepreciationSchedule {
  id: string;
  assetId: string;
  assetName: string;
  assetCode: string;
  category: string;
  depreciationMethod: string;
  purchaseValue: number;
  salvageValue: number;
  usefulLife: number;
  startDate: string;
  endDate: string;
  annualDepreciation: number;
  monthlyDepreciation: number;
  accumulatedDepreciation: number;
  netBookValue: number;
  remainingLife: number;
  status: 'Active' | 'Completed' | 'Paused';
}

interface DepreciationEntry {
  id: string;
  date: string;
  assetId: string;
  assetName: string;
  period: string;
  depreciationAmount: number;
  accumulatedDepreciation: number;
  netBookValue: number;
  journalEntryId?: string;
  posted: boolean;
}

export default function DepreciationPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [methodFilter, setMethodFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeTab, setActiveTab] = useState<'schedule' | 'entries'>('schedule');
  const [expandedAsset, setExpandedAsset] = useState<string | null>(null);

  // Sample depreciation schedules
  const depreciationSchedules: DepreciationSchedule[] = [
    {
      id: 'DS001',
      assetId: 'FA001',
      assetName: 'Factory Building - Block A',
      assetCode: 'BLD-2020-001',
      category: 'Land & Building',
      depreciationMethod: 'Straight Line',
      purchaseValue: 50000000,
      salvageValue: 5000000,
      usefulLife: 30,
      startDate: '2020-01-15',
      endDate: '2050-01-14',
      annualDepreciation: 1500000,
      monthlyDepreciation: 125000,
      accumulatedDepreciation: 7500000,
      netBookValue: 42500000,
      remainingLife: 25,
      status: 'Active'
    },
    {
      id: 'DS002',
      assetId: 'FA002',
      assetName: 'CNC Machine - DMG Mori',
      assetCode: 'MCH-2021-005',
      category: 'Plant & Machinery',
      depreciationMethod: 'Written Down Value',
      purchaseValue: 8500000,
      salvageValue: 850000,
      usefulLife: 10,
      startDate: '2021-06-10',
      endDate: '2031-06-09',
      annualDepreciation: 680000,
      monthlyDepreciation: 56667,
      accumulatedDepreciation: 2720000,
      netBookValue: 5780000,
      remainingLife: 6.5,
      status: 'Active'
    },
    {
      id: 'DS003',
      assetId: 'FA003',
      assetName: 'Delivery Truck - Tata LPT 1618',
      assetCode: 'VEH-2022-012',
      category: 'Vehicles',
      depreciationMethod: 'Written Down Value',
      purchaseValue: 2200000,
      salvageValue: 220000,
      usefulLife: 8,
      startDate: '2022-03-20',
      endDate: '2030-03-19',
      annualDepreciation: 247500,
      monthlyDepreciation: 20625,
      accumulatedDepreciation: 618750,
      netBookValue: 1581250,
      remainingLife: 5.3,
      status: 'Active'
    },
    {
      id: 'DS004',
      assetId: 'FA004',
      assetName: 'Dell Workstation - Precision 5820',
      assetCode: 'COM-2023-045',
      category: 'Computers',
      depreciationMethod: 'Straight Line',
      purchaseValue: 180000,
      salvageValue: 18000,
      usefulLife: 3,
      startDate: '2023-08-15',
      endDate: '2026-08-14',
      annualDepreciation: 54000,
      monthlyDepreciation: 4500,
      accumulatedDepreciation: 72000,
      netBookValue: 108000,
      remainingLife: 1.6,
      status: 'Active'
    }
  ];

  // Sample depreciation entries
  const depreciationEntries: DepreciationEntry[] = [
    {
      id: 'DE001',
      date: '2025-01-31',
      assetId: 'FA001',
      assetName: 'Factory Building - Block A',
      period: 'Jan 2025',
      depreciationAmount: 125000,
      accumulatedDepreciation: 7625000,
      netBookValue: 42375000,
      journalEntryId: 'JE-2025-001',
      posted: true
    },
    {
      id: 'DE002',
      date: '2025-01-31',
      assetId: 'FA002',
      assetName: 'CNC Machine - DMG Mori',
      period: 'Jan 2025',
      depreciationAmount: 56667,
      accumulatedDepreciation: 2776667,
      netBookValue: 5723333,
      journalEntryId: 'JE-2025-001',
      posted: true
    },
    {
      id: 'DE003',
      date: '2025-01-31',
      assetId: 'FA003',
      assetName: 'Delivery Truck - Tata LPT 1618',
      period: 'Jan 2025',
      depreciationAmount: 20625,
      accumulatedDepreciation: 639375,
      netBookValue: 1560625,
      journalEntryId: 'JE-2025-001',
      posted: true
    },
    {
      id: 'DE004',
      date: '2025-01-31',
      assetId: 'FA004',
      assetName: 'Dell Workstation - Precision 5820',
      period: 'Jan 2025',
      depreciationAmount: 4500,
      accumulatedDepreciation: 76500,
      netBookValue: 103500,
      posted: false
    },
    {
      id: 'DE005',
      date: '2024-12-31',
      assetId: 'FA001',
      assetName: 'Factory Building - Block A',
      period: 'Dec 2024',
      depreciationAmount: 125000,
      accumulatedDepreciation: 7500000,
      netBookValue: 42500000,
      journalEntryId: 'JE-2024-012',
      posted: true
    }
  ];

  const filteredSchedules = depreciationSchedules.filter(schedule => {
    const matchesSearch =
      schedule.assetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      schedule.assetCode.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesMethod = methodFilter === 'all' || schedule.depreciationMethod === methodFilter;
    const matchesStatus = statusFilter === 'all' || schedule.status === statusFilter;

    return matchesSearch && matchesMethod && matchesStatus;
  });

  const filteredEntries = depreciationEntries.filter(entry => {
    const matchesSearch =
      entry.assetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.period.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  // Calculate statistics
  const totalMonthlyDepreciation = depreciationSchedules
    .filter(s => s.status === 'Active')
    .reduce((sum, s) => sum + s.monthlyDepreciation, 0);

  const totalAnnualDepreciation = depreciationSchedules
    .filter(s => s.status === 'Active')
    .reduce((sum, s) => sum + s.annualDepreciation, 0);

  const totalAccumulatedDepreciation = depreciationSchedules
    .reduce((sum, s) => sum + s.accumulatedDepreciation, 0);

  const pendingPostings = depreciationEntries.filter(e => !e.posted).length;

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
      Active: 'bg-green-500/20 text-green-400',
      Completed: 'bg-blue-500/20 text-blue-400',
      Paused: 'bg-orange-500/20 text-orange-400'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles]}`}>
        {status}
      </span>
    );
  };

  const toggleAssetExpansion = (assetId: string) => {
    setExpandedAsset(expandedAsset === assetId ? null : assetId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-orange-900 to-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Depreciation Management</h1>
            <p className="text-gray-400">Track and process asset depreciation</p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors">
              <Play className="w-4 h-4" />
              Run Depreciation
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
              <Plus className="w-4 h-4" />
              Manual Entry
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <TrendingDown className="w-8 h-8 opacity-80" />
              <Calendar className="w-5 h-5" />
            </div>
            <div className="text-2xl font-bold mb-1">{formatCurrency(totalMonthlyDepreciation)}</div>
            <div className="text-orange-100 text-sm">Monthly Depreciation</div>
            <div className="mt-2 text-xs text-orange-100">Current month charge</div>
          </div>

          <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <BarChart3 className="w-8 h-8 opacity-80" />
              <TrendingDown className="w-5 h-5" />
            </div>
            <div className="text-2xl font-bold mb-1">{formatCurrency(totalAnnualDepreciation)}</div>
            <div className="text-red-100 text-sm">Annual Depreciation</div>
            <div className="mt-2 text-xs text-red-100">Projected for current year</div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="w-8 h-8 opacity-80" />
              <TrendingDown className="w-5 h-5" />
            </div>
            <div className="text-2xl font-bold mb-1">{formatCurrency(totalAccumulatedDepreciation)}</div>
            <div className="text-purple-100 text-sm">Total Accumulated</div>
            <div className="mt-2 text-xs text-purple-100">All assets to date</div>
          </div>

          <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <AlertTriangle className="w-8 h-8 opacity-80" />
              <CheckCircle className="w-5 h-5" />
            </div>
            <div className="text-2xl font-bold mb-1">{pendingPostings}</div>
            <div className="text-yellow-100 text-sm">Pending Postings</div>
            <div className="mt-2 text-xs text-yellow-100">Awaiting journal entry</div>
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
                  placeholder="Search by asset name or code..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={methodFilter}
                onChange={(e) => setMethodFilter(e.target.value)}
                className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="all">All Methods</option>
                <option value="Straight Line">Straight Line</option>
                <option value="Written Down Value">Written Down Value</option>
                <option value="Double Declining">Double Declining</option>
                <option value="Units of Production">Units of Production</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="all">All Status</option>
                <option value="Active">Active</option>
                <option value="Completed">Completed</option>
                <option value="Paused">Paused</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 overflow-hidden">
          <div className="flex border-b border-gray-700">
            <button
              onClick={() => setActiveTab('schedule')}
              className={`flex-1 px-6 py-4 font-medium transition-colors ${
                activeTab === 'schedule'
                  ? 'bg-orange-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Calendar className="w-5 h-5" />
                Depreciation Schedules ({filteredSchedules.length})
              </div>
            </button>
            <button
              onClick={() => setActiveTab('entries')}
              className={`flex-1 px-6 py-4 font-medium transition-colors ${
                activeTab === 'entries'
                  ? 'bg-orange-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <TrendingDown className="w-5 h-5" />
                Depreciation Entries ({filteredEntries.length})
              </div>
            </button>
          </div>

          {/* Schedules Tab */}
          {activeTab === 'schedule' && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-900/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Asset Details</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Method</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">Purchase Value</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">Monthly Depreciation</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">Accumulated</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">Net Book Value</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-300">Remaining Life</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-300">Status</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSchedules.map((schedule) => (
                    <React.Fragment key={schedule.id}>
                      <tr className="border-b border-gray-700 hover:bg-gray-800/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => toggleAssetExpansion(schedule.assetId)}
                              className="p-1 hover:bg-gray-700 rounded transition-colors"
                            >
                              {expandedAsset === schedule.assetId ? (
                                <ChevronDown className="w-4 h-4 text-gray-400" />
                              ) : (
                                <ChevronRight className="w-4 h-4 text-gray-400" />
                              )}
                            </button>
                            <div>
                              <div className="font-medium text-white">{schedule.assetName}</div>
                              <div className="text-sm text-gray-400 font-mono">{schedule.assetCode}</div>
                              <div className="text-xs text-gray-500">{schedule.category}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-white text-sm">{schedule.depreciationMethod}</div>
                          <div className="text-xs text-gray-400">{schedule.usefulLife} years</div>
                        </td>
                        <td className="px-6 py-4 text-right text-white font-medium">
                          {formatCurrency(schedule.purchaseValue)}
                        </td>
                        <td className="px-6 py-4 text-right text-orange-400 font-medium">
                          {formatCurrency(schedule.monthlyDepreciation)}
                        </td>
                        <td className="px-6 py-4 text-right text-red-400 font-medium">
                          {formatCurrency(schedule.accumulatedDepreciation)}
                        </td>
                        <td className="px-6 py-4 text-right text-green-400 font-medium">
                          {formatCurrency(schedule.netBookValue)}
                        </td>
                        <td className="px-6 py-4 text-center text-white">
                          {schedule.remainingLife.toFixed(1)} years
                        </td>
                        <td className="px-6 py-4 text-center">
                          {getStatusBadge(schedule.status)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
                              <Eye className="w-4 h-4 text-blue-400" />
                            </button>
                            <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
                              <Pause className="w-4 h-4 text-orange-400" />
                            </button>
                          </div>
                        </td>
                      </tr>
                      {expandedAsset === schedule.assetId && (
                        <tr className="bg-gray-900/50 border-b border-gray-700">
                          <td colSpan={9} className="px-6 py-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div className="space-y-2">
                                <div className="text-sm font-semibold text-gray-400">Schedule Details</div>
                                <div className="flex justify-between text-sm">
                                  <span className="text-gray-500">Start Date:</span>
                                  <span className="text-white">{new Date(schedule.startDate).toLocaleDateString()}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span className="text-gray-500">End Date:</span>
                                  <span className="text-white">{new Date(schedule.endDate).toLocaleDateString()}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span className="text-gray-500">Salvage Value:</span>
                                  <span className="text-white">{formatCurrency(schedule.salvageValue)}</span>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <div className="text-sm font-semibold text-gray-400">Depreciation Rates</div>
                                <div className="flex justify-between text-sm">
                                  <span className="text-gray-500">Annual:</span>
                                  <span className="text-white">{formatCurrency(schedule.annualDepreciation)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span className="text-gray-500">Monthly:</span>
                                  <span className="text-white">{formatCurrency(schedule.monthlyDepreciation)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span className="text-gray-500">Rate:</span>
                                  <span className="text-white">
                                    {((schedule.annualDepreciation / schedule.purchaseValue) * 100).toFixed(2)}%
                                  </span>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <div className="text-sm font-semibold text-gray-400">Current Status</div>
                                <div className="flex justify-between text-sm">
                                  <span className="text-gray-500">Depreciated:</span>
                                  <span className="text-white">
                                    {((schedule.accumulatedDepreciation / schedule.purchaseValue) * 100).toFixed(1)}%
                                  </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span className="text-gray-500">Remaining:</span>
                                  <span className="text-white">
                                    {(((schedule.purchaseValue - schedule.accumulatedDepreciation) / schedule.purchaseValue) * 100).toFixed(1)}%
                                  </span>
                                </div>
                                <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                                  <div
                                    className="bg-orange-500 h-2 rounded-full"
                                    style={{
                                      width: `${((schedule.accumulatedDepreciation / schedule.purchaseValue) * 100).toFixed(1)}%`
                                    }}
                                  />
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Entries Tab */}
          {activeTab === 'entries' && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-900/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Date</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Asset Name</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Period</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">Depreciation Amount</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">Accumulated</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">Net Book Value</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-300">Journal Entry</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-300">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEntries.map((entry) => (
                    <tr key={entry.id} className="border-b border-gray-700 hover:bg-gray-800/50 transition-colors">
                      <td className="px-6 py-4 text-white text-sm">
                        {new Date(entry.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-gray-300 text-sm">{entry.assetName}</td>
                      <td className="px-6 py-4 text-gray-400 text-sm">{entry.period}</td>
                      <td className="px-6 py-4 text-right text-orange-400 font-medium">
                        {formatCurrency(entry.depreciationAmount)}
                      </td>
                      <td className="px-6 py-4 text-right text-red-400 font-medium">
                        {formatCurrency(entry.accumulatedDepreciation)}
                      </td>
                      <td className="px-6 py-4 text-right text-green-400 font-medium">
                        {formatCurrency(entry.netBookValue)}
                      </td>
                      <td className="px-6 py-4 text-center text-gray-400 text-sm font-mono">
                        {entry.journalEntryId || '-'}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {entry.posted ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs">
                            <CheckCircle className="w-3 h-3" />
                            Posted
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs">
                            <AlertTriangle className="w-3 h-3" />
                            Pending
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

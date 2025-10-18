'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Plus,
  Calendar,
  Lock,
  Unlock,
  CheckCircle,
  XCircle,
  Eye,
  Edit,
  AlertCircle,
  Clock,
  TrendingUp,
  FileText,
  Settings,
  ChevronRight,
} from 'lucide-react';

interface FinancialYear {
  id: string;
  yearCode: string;
  yearName: string;
  startDate: string;
  endDate: string;
  status: 'Open' | 'Closed' | 'Locked';
  isCurrent: boolean;
  periodsCount: number;
  openPeriodsCount: number;
}

interface FinancialPeriod {
  id: string;
  periodCode: string;
  periodName: string;
  yearCode: string;
  periodType: 'Month' | 'Quarter' | 'Half Year' | 'Year';
  periodNumber: number;
  startDate: string;
  endDate: string;
  status: 'Open' | 'Closed' | 'Locked';
  isCurrent: boolean;
  transactionsCount: number;
}

export default function FinancialPeriodsPage() {
  const [financialYears] = useState<FinancialYear[]>([
    {
      id: '1',
      yearCode: 'FY2025-26',
      yearName: 'Financial Year 2025-2026',
      startDate: '2025-04-01',
      endDate: '2026-03-31',
      status: 'Open',
      isCurrent: true,
      periodsCount: 12,
      openPeriodsCount: 6,
    },
    {
      id: '2',
      yearCode: 'FY2024-25',
      yearName: 'Financial Year 2024-2025',
      startDate: '2024-04-01',
      endDate: '2025-03-31',
      status: 'Open',
      isCurrent: false,
      periodsCount: 12,
      openPeriodsCount: 7,
    },
    {
      id: '3',
      yearCode: 'FY2023-24',
      yearName: 'Financial Year 2023-2024',
      startDate: '2023-04-01',
      endDate: '2024-03-31',
      status: 'Closed',
      isCurrent: false,
      periodsCount: 12,
      openPeriodsCount: 0,
    },
  ]);

  const [periods] = useState<FinancialPeriod[]>([
    {
      id: '1',
      periodCode: 'FY2025-P01',
      periodName: 'April 2025',
      yearCode: 'FY2025-26',
      periodType: 'Month',
      periodNumber: 1,
      startDate: '2025-04-01',
      endDate: '2025-04-30',
      status: 'Closed',
      isCurrent: false,
      transactionsCount: 245,
    },
    {
      id: '2',
      periodCode: 'FY2025-P02',
      periodName: 'May 2025',
      yearCode: 'FY2025-26',
      periodType: 'Month',
      periodNumber: 2,
      startDate: '2025-05-01',
      endDate: '2025-05-31',
      status: 'Closed',
      isCurrent: false,
      transactionsCount: 312,
    },
    {
      id: '3',
      periodCode: 'FY2025-P03',
      periodName: 'June 2025',
      yearCode: 'FY2025-26',
      periodType: 'Month',
      periodNumber: 3,
      startDate: '2025-06-01',
      endDate: '2025-06-30',
      status: 'Closed',
      isCurrent: false,
      transactionsCount: 289,
    },
    {
      id: '4',
      periodCode: 'FY2025-P04',
      periodName: 'July 2025',
      yearCode: 'FY2025-26',
      periodType: 'Month',
      periodNumber: 4,
      startDate: '2025-07-01',
      endDate: '2025-07-31',
      status: 'Closed',
      isCurrent: false,
      transactionsCount: 267,
    },
    {
      id: '5',
      periodCode: 'FY2025-P05',
      periodName: 'August 2025',
      yearCode: 'FY2025-26',
      periodType: 'Month',
      periodNumber: 5,
      startDate: '2025-08-01',
      endDate: '2025-08-31',
      status: 'Closed',
      isCurrent: false,
      transactionsCount: 298,
    },
    {
      id: '6',
      periodCode: 'FY2025-P06',
      periodName: 'September 2025',
      yearCode: 'FY2025-26',
      periodType: 'Month',
      periodNumber: 6,
      startDate: '2025-09-01',
      endDate: '2025-09-30',
      status: 'Closed',
      isCurrent: false,
      transactionsCount: 321,
    },
    {
      id: '7',
      periodCode: 'FY2025-P07',
      periodName: 'October 2025',
      yearCode: 'FY2025-26',
      periodType: 'Month',
      periodNumber: 7,
      startDate: '2025-10-01',
      endDate: '2025-10-31',
      status: 'Open',
      isCurrent: true,
      transactionsCount: 156,
    },
    {
      id: '8',
      periodCode: 'FY2025-P08',
      periodName: 'November 2025',
      yearCode: 'FY2025-26',
      periodType: 'Month',
      periodNumber: 8,
      startDate: '2025-11-01',
      endDate: '2025-11-30',
      status: 'Open',
      isCurrent: false,
      transactionsCount: 0,
    },
  ]);

  const [selectedYear, setSelectedYear] = useState('FY2025-26');

  const currentYear = financialYears.find((y) => y.yearCode === selectedYear);
  const yearPeriods = periods.filter((p) => p.yearCode === selectedYear);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'Closed':
        return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'Locked':
        return 'bg-red-100 text-red-700 border-red-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Open':
        return <Unlock className="w-4 h-4" />;
      case 'Closed':
        return <Lock className="w-4 h-4" />;
      case 'Locked':
        return <Lock className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Calendar className="w-8 h-8 text-purple-600" />
              Financial Periods
            </h1>
            <p className="text-gray-600 mt-1">Manage financial years and accounting periods</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/finance/accounting/periods/create"
              className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg shadow-lg transition-all hover:shadow-xl"
            >
              <Plus className="w-5 h-5" />
              <span className="font-semibold">New Financial Year</span>
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <p className="text-purple-100 text-sm">Active Financial Years</p>
              <Calendar className="w-8 h-8 text-purple-200" />
            </div>
            <p className="text-3xl font-bold">{financialYears.filter((y) => y.status === 'Open').length}</p>
            <p className="text-sm text-purple-100 mt-2">Out of {financialYears.length} total</p>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <p className="text-green-100 text-sm">Open Periods</p>
              <Unlock className="w-8 h-8 text-green-200" />
            </div>
            <p className="text-3xl font-bold">{periods.filter((p) => p.status === 'Open').length}</p>
            <p className="text-sm text-green-100 mt-2">Current period: {periods.find((p) => p.isCurrent)?.periodName}</p>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <p className="text-blue-100 text-sm">Closed Periods</p>
              <Lock className="w-8 h-8 text-blue-200" />
            </div>
            <p className="text-3xl font-bold">{periods.filter((p) => p.status === 'Closed').length}</p>
            <p className="text-sm text-blue-100 mt-2">Locked for editing</p>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <p className="text-orange-100 text-sm">Total Transactions</p>
              <FileText className="w-8 h-8 text-orange-200" />
            </div>
            <p className="text-3xl font-bold">{periods.reduce((sum, p) => sum + p.transactionsCount, 0)}</p>
            <p className="text-sm text-orange-100 mt-2">Across all periods</p>
          </div>
        </div>
      </div>

      {/* Financial Years Section */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-purple-600" />
            Financial Years
          </h2>
        </div>

        <div className="space-y-3">
          {financialYears.map((year) => (
            <div
              key={year.id}
              className={`border-2 rounded-xl p-6 transition-all cursor-pointer ${
                selectedYear === year.yearCode
                  ? 'border-purple-500 bg-purple-50 shadow-md'
                  : 'border-gray-200 hover:border-purple-300 hover:shadow-sm'
              }`}
              onClick={() => setSelectedYear(year.yearCode)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    year.isCurrent ? 'bg-purple-600' : 'bg-gray-400'
                  }`}>
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-bold text-gray-900">{year.yearName}</h3>
                      {year.isCurrent && (
                        <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded-full font-semibold">
                          CURRENT
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {year.yearCode} • {year.startDate} to {year.endDate}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">{year.periodsCount}</p>
                    <p className="text-xs text-gray-500">Total Periods</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">{year.openPeriodsCount}</p>
                    <p className="text-xs text-gray-500">Open</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">{year.periodsCount - year.openPeriodsCount}</p>
                    <p className="text-xs text-gray-500">Closed</p>
                  </div>
                  <span
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(
                      year.status
                    )}`}
                  >
                    {getStatusIcon(year.status)}
                    {year.status}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    <button
                      className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                      title="Settings"
                    >
                      <Settings className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Periods for Selected Year */}
      {currentYear && (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-6 text-white">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <ChevronRight className="w-6 h-6" />
              Periods for {currentYear.yearName}
            </h2>
            <p className="text-purple-100 mt-1">
              Manage monthly accounting periods and their status
            </p>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {yearPeriods.map((period) => (
                <div
                  key={period.id}
                  className={`border-2 rounded-xl p-4 transition-all ${
                    period.isCurrent
                      ? 'border-purple-500 bg-purple-50 shadow-md'
                      : period.status === 'Open'
                      ? 'border-green-300 hover:shadow-md'
                      : 'border-gray-200 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      period.isCurrent
                        ? 'bg-purple-600'
                        : period.status === 'Open'
                        ? 'bg-green-500'
                        : 'bg-blue-500'
                    }`}>
                      <Calendar className="w-5 h-5 text-white" />
                    </div>
                    {period.isCurrent && (
                      <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded-full font-semibold">
                        CURRENT
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 mb-1">{period.periodName}</h3>
                  <p className="text-sm text-gray-600 mb-3">{period.periodCode}</p>

                  <div className="space-y-2 mb-3">
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <Calendar className="w-3 h-3" />
                      <span>{period.startDate} to {period.endDate}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <FileText className="w-3 h-3" />
                      <span>{period.transactionsCount} transactions</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                        period.status
                      )}`}
                    >
                      {getStatusIcon(period.status)}
                      {period.status}
                    </span>

                    <div className="flex items-center gap-1">
                      <button
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="View"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {period.status === 'Open' && (
                        <button
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Close Period"
                        >
                          <Lock className="w-4 h-4" />
                        </button>
                      )}
                      {period.status === 'Closed' && (
                        <button
                          className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors"
                          title="Reopen Period"
                        >
                          <Unlock className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Period Closing Checklist */}
          <div className="border-t border-gray-200 p-6 bg-gray-50">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Period End Closing Checklist
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium text-gray-900">All invoices posted</span>
                </div>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium text-gray-900">Bank reconciliation completed</span>
                </div>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium text-gray-900">Depreciation calculated</span>
                </div>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-orange-600" />
                  <span className="text-sm font-medium text-gray-900">Inventory valuation</span>
                </div>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <XCircle className="w-5 h-5 text-red-600" />
                  <span className="text-sm font-medium text-gray-900">Accruals and provisions</span>
                </div>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-gray-400" />
                  <span className="text-sm font-medium text-gray-900">Management review</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import { useState, useMemo } from 'react';
import { Play, CheckCircle, Clock, AlertCircle, Download, Users, IndianRupee, Calendar as CalendarIcon } from 'lucide-react';

interface PayrollRun {
  id: string;
  monthYear: string;
  payPeriodStart: string;
  payPeriodEnd: string;
  paymentDate: string;
  employeeCount: number;
  totalGross: number;
  totalDeductions: number;
  totalNet: number;
  status: 'draft' | 'processing' | 'verified' | 'approved' | 'disbursed';
  processedBy?: string;
  processedOn?: string;
  verifiedBy?: string;
  approvedBy?: string;
  disbursedOn?: string;
}

export default function PayrollRunPage() {
  const [selectedTab, setSelectedTab] = useState<'draft' | 'processing' | 'verified' | 'approved' | 'disbursed'>('draft');

  const mockPayrollRuns: PayrollRun[] = [
    {
      id: 'PR-2025-12',
      monthYear: 'December 2025',
      payPeriodStart: '2025-12-01',
      payPeriodEnd: '2025-12-31',
      paymentDate: '2025-12-30',
      employeeCount: 145,
      totalGross: 7250000,
      totalDeductions: 1087500,
      totalNet: 6162500,
      status: 'draft'
    },
    {
      id: 'PR-2025-11',
      monthYear: 'November 2025',
      payPeriodStart: '2025-11-01',
      payPeriodEnd: '2025-11-30',
      paymentDate: '2025-11-29',
      employeeCount: 142,
      totalGross: 7100000,
      totalDeductions: 1065000,
      totalNet: 6035000,
      status: 'verified',
      processedBy: 'Payroll Team',
      processedOn: '2025-11-25',
      verifiedBy: 'Finance Head'
    },
    {
      id: 'PR-2025-10',
      monthYear: 'October 2025',
      payPeriodStart: '2025-10-01',
      payPeriodEnd: '2025-10-31',
      paymentDate: '2025-10-31',
      employeeCount: 140,
      totalGross: 7000000,
      totalDeductions: 1050000,
      totalNet: 5950000,
      status: 'disbursed',
      processedBy: 'Payroll Team',
      processedOn: '2025-10-26',
      verifiedBy: 'Finance Head',
      approvedBy: 'CFO',
      disbursedOn: '2025-10-31'
    }
  ];

  const filteredPayrollRuns = useMemo(() => {
    return mockPayrollRuns.filter(run => run.status === selectedTab);
  }, [selectedTab]);

  const stats = {
    draft: mockPayrollRuns.filter(r => r.status === 'draft').length,
    processing: mockPayrollRuns.filter(r => r.status === 'processing').length,
    verified: mockPayrollRuns.filter(r => r.status === 'verified').length,
    approved: mockPayrollRuns.filter(r => r.status === 'approved').length,
    disbursed: mockPayrollRuns.filter(r => r.status === 'disbursed').length,
    currentEmployees: 145,
    nextPaymentDate: '2025-12-30'
  };

  const statusColors = {
    draft: 'bg-gray-100 text-gray-700',
    processing: 'bg-blue-100 text-blue-700',
    verified: 'bg-yellow-100 text-yellow-700',
    approved: 'bg-green-100 text-green-700',
    disbursed: 'bg-purple-100 text-purple-700'
  };

  const statusIcons = {
    draft: <Clock className="h-4 w-4" />,
    processing: <Play className="h-4 w-4" />,
    verified: <CheckCircle className="h-4 w-4" />,
    approved: <CheckCircle className="h-4 w-4" />,
    disbursed: <CheckCircle className="h-4 w-4" />
  };

  const formatCurrency = (amount: number) => {
    return `₹${(amount / 100000).toFixed(2)}L`;
  };

  return (
    <div className="w-full h-full px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Run Payroll</h1>
        <p className="text-sm text-gray-600 mt-1">Process and manage monthly payroll runs</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Active Employees</p>
              <p className="text-2xl font-bold text-blue-900 mt-1">{stats.currentEmployees}</p>
            </div>
            <Users className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Next Payment</p>
              <p className="text-sm font-bold text-green-900 mt-1">{new Date(stats.nextPaymentDate).toLocaleDateString('en-IN')}</p>
            </div>
            <CalendarIcon className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4 border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-600">Pending Verification</p>
              <p className="text-2xl font-bold text-yellow-900 mt-1">{stats.verified}</p>
            </div>
            <AlertCircle className="h-8 w-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">Disbursed This Year</p>
              <p className="text-2xl font-bold text-purple-900 mt-1">{stats.disbursed}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-purple-600" />
          </div>
        </div>
      </div>

      <div className="mb-4 flex gap-2 overflow-x-auto">
        {(['draft', 'processing', 'verified', 'approved', 'disbursed'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setSelectedTab(tab)}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors whitespace-nowrap ${
              selectedTab === tab
                ? tab === 'draft' ? 'bg-gray-600 text-white' :
                  tab === 'processing' ? 'bg-blue-600 text-white' :
                  tab === 'verified' ? 'bg-yellow-600 text-white' :
                  tab === 'approved' ? 'bg-green-600 text-white' :
                  'bg-purple-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)} ({stats[tab]})
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filteredPayrollRuns.map(run => (
          <div key={run.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-bold text-gray-900">{run.monthYear}</h3>
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusColors[run.status]}`}>
                    <span className="inline-flex items-center gap-1">
                      {statusIcons[run.status]}
                      {run.status.toUpperCase()}
                    </span>
                  </span>
                </div>
                <p className="text-sm text-gray-600">Payroll ID: {run.id}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Pay Period: {new Date(run.payPeriodStart).toLocaleDateString('en-IN')} - {new Date(run.payPeriodEnd).toLocaleDateString('en-IN')}
                </p>
                <p className="text-xs text-gray-500">
                  Payment Date: {new Date(run.paymentDate).toLocaleDateString('en-IN')}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs font-medium text-gray-600 mb-1">Employees</p>
                <p className="text-2xl font-bold text-gray-900">{run.employeeCount}</p>
              </div>

              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <p className="text-xs font-medium text-green-700 mb-1">Total Gross</p>
                <p className="text-xl font-bold text-green-900">{formatCurrency(run.totalGross)}</p>
              </div>

              <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                <p className="text-xs font-medium text-red-700 mb-1">Total Deductions</p>
                <p className="text-xl font-bold text-red-900">{formatCurrency(run.totalDeductions)}</p>
              </div>

              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <p className="text-xs font-medium text-blue-700 mb-1">Net Payable</p>
                <p className="text-xl font-bold text-blue-900">{formatCurrency(run.totalNet)}</p>
              </div>
            </div>

            {(run.processedBy || run.verifiedBy || run.approvedBy) && (
              <div className="mt-4 pt-4 border-t border-gray-200 text-xs text-gray-500">
                {run.processedBy && (
                  <p>Processed by: {run.processedBy} on {run.processedOn && new Date(run.processedOn).toLocaleDateString('en-IN')}</p>
                )}
                {run.verifiedBy && (
                  <p>Verified by: {run.verifiedBy}</p>
                )}
                {run.approvedBy && (
                  <p>Approved by: {run.approvedBy}</p>
                )}
                {run.disbursedOn && (
                  <p>Disbursed on: {new Date(run.disbursedOn).toLocaleDateString('en-IN')}</p>
                )}
              </div>
            )}

            <div className="flex gap-2 mt-4">
              {run.status === 'draft' && (
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm">
                  <Play className="inline h-4 w-4 mr-2" />
                  Start Processing
                </button>
              )}
              {run.status === 'processing' && (
                <button className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 font-medium text-sm">
                  <CheckCircle className="inline h-4 w-4 mr-2" />
                  Mark as Verified
                </button>
              )}
              {run.status === 'verified' && (
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium text-sm">
                  <CheckCircle className="inline h-4 w-4 mr-2" />
                  Approve Payroll
                </button>
              )}
              {run.status === 'approved' && (
                <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium text-sm">
                  <IndianRupee className="inline h-4 w-4 mr-2" />
                  Disburse Salaries
                </button>
              )}
              <button className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg font-medium text-sm border border-gray-300">
                <Download className="inline h-4 w-4 mr-2" />
                Download Report
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredPayrollRuns.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No payroll runs found</h3>
          <p className="text-gray-600 mb-4">Create a new payroll run to get started</p>
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
            <Play className="inline h-4 w-4 mr-2" />
            Create New Payroll Run
          </button>
        </div>
      )}
    </div>
  );
}

'use client';

import { useState, useMemo } from 'react';
import { Calculator, CheckCircle, Clock, AlertCircle, IndianRupee } from 'lucide-react';

interface FNFSalarySettlement {
  id: string;
  employeeId: string;
  employeeName: string;
  designation: string;
  department: string;
  lastWorkingDay: string;
  joiningDate: string;
  basicSalary: number;
  hra: number;
  specialAllowance: number;
  otherAllowances: number;
  grossSalary: number;
  workingDays: number;
  daysWorked: number;
  salaryForPeriod: number;
  deductions: {
    noticePeriodBuyout?: number;
    loanRecovery?: number;
    advanceRecovery?: number;
    otherDeductions?: number;
  };
  additions: {
    pendingReimbursements?: number;
    bonus?: number;
    incentives?: number;
  };
  netSalaryComponent: number;
  status: 'pending' | 'calculated' | 'approved' | 'processed';
  calculatedBy?: string;
  calculatedOn?: string;
  approvedBy?: string;
}

export default function FNFSalaryPage() {
  const [selectedTab, setSelectedTab] = useState<'pending' | 'calculated' | 'approved' | 'processed'>('pending');

  const mockSettlements: FNFSalarySettlement[] = [
    {
      id: 'FNF-SAL-001',
      employeeId: 'EMP001',
      employeeName: 'Rahul Sharma',
      designation: 'Senior Software Engineer',
      department: 'Engineering',
      lastWorkingDay: '2025-12-14',
      joiningDate: '2022-01-15',
      basicSalary: 50000,
      hra: 20000,
      specialAllowance: 15000,
      otherAllowances: 5000,
      grossSalary: 90000,
      workingDays: 26,
      daysWorked: 14,
      salaryForPeriod: 48461,
      deductions: {
        noticePeriodBuyout: 180000,
        loanRecovery: 50000
      },
      additions: {
        pendingReimbursements: 5000
      },
      netSalaryComponent: -176539,
      status: 'calculated',
      calculatedBy: 'Priya Singh - HR Manager',
      calculatedOn: '2025-12-10'
    },
    {
      id: 'FNF-SAL-002',
      employeeId: 'EMP002',
      employeeName: 'Priya Singh',
      designation: 'Marketing Manager',
      department: 'Marketing',
      lastWorkingDay: '2025-11-30',
      joiningDate: '2020-06-10',
      basicSalary: 60000,
      hra: 24000,
      specialAllowance: 18000,
      otherAllowances: 8000,
      grossSalary: 110000,
      workingDays: 26,
      daysWorked: 26,
      salaryForPeriod: 110000,
      deductions: {
        advanceRecovery: 15000
      },
      additions: {
        pendingReimbursements: 8000,
        bonus: 20000
      },
      netSalaryComponent: 123000,
      status: 'approved',
      calculatedBy: 'Amit Kumar - Finance Head',
      calculatedOn: '2025-11-25',
      approvedBy: 'Rajesh Patel - CFO'
    },
    {
      id: 'FNF-SAL-003',
      employeeId: 'EMP003',
      employeeName: 'Amit Kumar',
      designation: 'Product Manager',
      department: 'Product',
      lastWorkingDay: '2025-10-31',
      joiningDate: '2019-03-20',
      basicSalary: 70000,
      hra: 28000,
      specialAllowance: 20000,
      otherAllowances: 12000,
      grossSalary: 130000,
      workingDays: 26,
      daysWorked: 26,
      salaryForPeriod: 130000,
      deductions: {},
      additions: {
        pendingReimbursements: 12000,
        bonus: 50000
      },
      netSalaryComponent: 192000,
      status: 'processed',
      calculatedBy: 'Priya Singh - HR Manager',
      calculatedOn: '2025-10-25',
      approvedBy: 'Rajesh Patel - CFO'
    }
  ];

  const filteredSettlements = useMemo(() => {
    return mockSettlements.filter(settlement => settlement.status === selectedTab);
  }, [selectedTab]);

  const stats = {
    pending: mockSettlements.filter(s => s.status === 'pending').length,
    calculated: mockSettlements.filter(s => s.status === 'calculated').length,
    approved: mockSettlements.filter(s => s.status === 'approved').length,
    processed: mockSettlements.filter(s => s.status === 'processed').length
  };

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-700',
    calculated: 'bg-blue-100 text-blue-700',
    approved: 'bg-green-100 text-green-700',
    processed: 'bg-gray-100 text-gray-700'
  };

  const statusIcons = {
    pending: <Clock className="h-4 w-4" />,
    calculated: <Calculator className="h-4 w-4" />,
    approved: <CheckCircle className="h-4 w-4" />,
    processed: <CheckCircle className="h-4 w-4" />
  };

  const formatCurrency = (amount: number) => {
    return `₹${Math.abs(amount).toLocaleString('en-IN')}`;
  };

  const calculateTotalDeductions = (deductions: FNFSalarySettlement['deductions']) => {
    return Object.values(deductions).reduce((sum, val) => sum + (val || 0), 0);
  };

  const calculateTotalAdditions = (additions: FNFSalarySettlement['additions']) => {
    return Object.values(additions).reduce((sum, val) => sum + (val || 0), 0);
  };

  return (
    <div className="w-full h-full px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">FNF - Salary Settlement</h1>
        <p className="text-sm text-gray-600 mt-1">Final month salary calculation and settlement</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4 border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-900 mt-1">{stats.pending}</p>
            </div>
            <Clock className="h-8 w-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Calculated</p>
              <p className="text-2xl font-bold text-blue-900 mt-1">{stats.calculated}</p>
            </div>
            <Calculator className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Approved</p>
              <p className="text-2xl font-bold text-green-900 mt-1">{stats.approved}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Processed</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.processed}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-gray-600" />
          </div>
        </div>
      </div>

      <div className="mb-4 flex gap-2">
        <button
          onClick={() => setSelectedTab('pending')}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
            selectedTab === 'pending'
              ? 'bg-yellow-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Pending ({stats.pending})
        </button>
        <button
          onClick={() => setSelectedTab('calculated')}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
            selectedTab === 'calculated'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Calculated ({stats.calculated})
        </button>
        <button
          onClick={() => setSelectedTab('approved')}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
            selectedTab === 'approved'
              ? 'bg-green-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Approved ({stats.approved})
        </button>
        <button
          onClick={() => setSelectedTab('processed')}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
            selectedTab === 'processed'
              ? 'bg-gray-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Processed ({stats.processed})
        </button>
      </div>

      <div className="space-y-4">
        {filteredSettlements.map(settlement => {
          const totalDeductions = calculateTotalDeductions(settlement.deductions);
          const totalAdditions = calculateTotalAdditions(settlement.additions);

          return (
            <div key={settlement.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-gray-900">{settlement.employeeName}</h3>
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusColors[settlement.status]}`}>
                      <span className="inline-flex items-center gap-1">
                        {statusIcons[settlement.status]}
                        {settlement.status.toUpperCase()}
                      </span>
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{settlement.designation} • {settlement.department}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Last Working Day: {new Date(settlement.lastWorkingDay).toLocaleDateString('en-IN')}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Salary Breakdown</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Basic Salary</span>
                      <span className="font-medium text-gray-900">{formatCurrency(settlement.basicSalary)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">HRA</span>
                      <span className="font-medium text-gray-900">{formatCurrency(settlement.hra)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Special Allowance</span>
                      <span className="font-medium text-gray-900">{formatCurrency(settlement.specialAllowance)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Other Allowances</span>
                      <span className="font-medium text-gray-900">{formatCurrency(settlement.otherAllowances)}</span>
                    </div>
                    <div className="flex justify-between text-sm pt-2 border-t border-gray-200">
                      <span className="font-semibold text-gray-900">Gross Monthly Salary</span>
                      <span className="font-bold text-gray-900">{formatCurrency(settlement.grossSalary)}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Working Days</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Total Working Days</span>
                      <span className="font-medium text-gray-900">{settlement.workingDays} days</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Days Worked</span>
                      <span className="font-medium text-gray-900">{settlement.daysWorked} days</span>
                    </div>
                    <div className="flex justify-between text-sm pt-2 border-t border-gray-200">
                      <span className="font-semibold text-gray-900">Salary for Period</span>
                      <span className="font-bold text-blue-600">{formatCurrency(settlement.salaryForPeriod)}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Calculated: {formatCurrency(settlement.grossSalary)} ÷ {settlement.workingDays} × {settlement.daysWorked}
                    </p>
                  </div>
                </div>
              </div>

              {(Object.keys(settlement.deductions).length > 0 || Object.keys(settlement.additions).length > 0) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {Object.keys(settlement.additions).length > 0 && (
                    <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                      <h4 className="font-semibold text-green-900 mb-3">Additions</h4>
                      <div className="space-y-2">
                        {settlement.additions.pendingReimbursements && (
                          <div className="flex justify-between text-sm">
                            <span className="text-green-700">Pending Reimbursements</span>
                            <span className="font-medium text-green-900">
                              +{formatCurrency(settlement.additions.pendingReimbursements)}
                            </span>
                          </div>
                        )}
                        {settlement.additions.bonus && (
                          <div className="flex justify-between text-sm">
                            <span className="text-green-700">Bonus</span>
                            <span className="font-medium text-green-900">
                              +{formatCurrency(settlement.additions.bonus)}
                            </span>
                          </div>
                        )}
                        {settlement.additions.incentives && (
                          <div className="flex justify-between text-sm">
                            <span className="text-green-700">Incentives</span>
                            <span className="font-medium text-green-900">
                              +{formatCurrency(settlement.additions.incentives)}
                            </span>
                          </div>
                        )}
                        <div className="flex justify-between text-sm pt-2 border-t border-green-300">
                          <span className="font-semibold text-green-900">Total Additions</span>
                          <span className="font-bold text-green-900">+{formatCurrency(totalAdditions)}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {Object.keys(settlement.deductions).length > 0 && (
                    <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                      <h4 className="font-semibold text-red-900 mb-3">Deductions</h4>
                      <div className="space-y-2">
                        {settlement.deductions.noticePeriodBuyout && (
                          <div className="flex justify-between text-sm">
                            <span className="text-red-700">Notice Period Buyout</span>
                            <span className="font-medium text-red-900">
                              -{formatCurrency(settlement.deductions.noticePeriodBuyout)}
                            </span>
                          </div>
                        )}
                        {settlement.deductions.loanRecovery && (
                          <div className="flex justify-between text-sm">
                            <span className="text-red-700">Loan Recovery</span>
                            <span className="font-medium text-red-900">
                              -{formatCurrency(settlement.deductions.loanRecovery)}
                            </span>
                          </div>
                        )}
                        {settlement.deductions.advanceRecovery && (
                          <div className="flex justify-between text-sm">
                            <span className="text-red-700">Advance Recovery</span>
                            <span className="font-medium text-red-900">
                              -{formatCurrency(settlement.deductions.advanceRecovery)}
                            </span>
                          </div>
                        )}
                        {settlement.deductions.otherDeductions && (
                          <div className="flex justify-between text-sm">
                            <span className="text-red-700">Other Deductions</span>
                            <span className="font-medium text-red-900">
                              -{formatCurrency(settlement.deductions.otherDeductions)}
                            </span>
                          </div>
                        )}
                        <div className="flex justify-between text-sm pt-2 border-t border-red-300">
                          <span className="font-semibold text-red-900">Total Deductions</span>
                          <span className="font-bold text-red-900">-{formatCurrency(totalDeductions)}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className={`rounded-lg p-4 border-2 ${
                settlement.netSalaryComponent >= 0
                  ? 'bg-green-50 border-green-300'
                  : 'bg-red-50 border-red-300'
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Net Salary Component (FNF)</p>
                    <p className={`text-2xl font-bold ${
                      settlement.netSalaryComponent >= 0 ? 'text-green-700' : 'text-red-700'
                    }`}>
                      {settlement.netSalaryComponent >= 0 ? '+' : '-'}
                      {formatCurrency(settlement.netSalaryComponent)}
                    </p>
                  </div>
                  <IndianRupee className={`h-12 w-12 ${
                    settlement.netSalaryComponent >= 0 ? 'text-green-600' : 'text-red-600'
                  }`} />
                </div>
                {settlement.netSalaryComponent < 0 && (
                  <div className="flex items-center gap-2 mt-2 text-xs text-red-700">
                    <AlertCircle className="h-4 w-4" />
                    <span>Employee owes this amount to the company (recoverable from final settlement)</span>
                  </div>
                )}
              </div>

              {settlement.calculatedBy && (
                <div className="mt-4 pt-4 border-t border-gray-200 text-xs text-gray-500">
                  <p>Calculated by: {settlement.calculatedBy} on {new Date(settlement.calculatedOn!).toLocaleDateString('en-IN')}</p>
                  {settlement.approvedBy && (
                    <p>Approved by: {settlement.approvedBy}</p>
                  )}
                </div>
              )}

              <div className="flex gap-2 mt-4">
                {settlement.status === 'pending' && (
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm">
                    <Calculator className="inline h-4 w-4 mr-2" />
                    Calculate Salary
                  </button>
                )}
                {settlement.status === 'calculated' && (
                  <>
                    <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium text-sm">
                      <CheckCircle className="inline h-4 w-4 mr-2" />
                      Approve Calculation
                    </button>
                    <button className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg font-medium text-sm border border-gray-300">
                      Recalculate
                    </button>
                  </>
                )}
                {settlement.status === 'approved' && (
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm">
                    Mark as Processed
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

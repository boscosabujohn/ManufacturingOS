'use client';

import { useState, useMemo } from 'react';
import { Calendar, CheckCircle, Clock, IndianRupee, AlertCircle } from 'lucide-react';

interface FNFLeaveEncashment {
  id: string;
  employeeId: string;
  employeeName: string;
  designation: string;
  department: string;
  lastWorkingDay: string;
  joiningDate: string;
  leaveBalance: {
    earnedLeave: number;
    casualLeave: number;
    sickLeave: number;
    privilegeLeave: number;
  };
  leavePolicy: {
    earnedLeaveEncashable: boolean;
    casualLeaveEncashable: boolean;
    sickLeaveEncashable: boolean;
    privilegeLeaveEncashable: boolean;
    maxEncashableDays?: number;
  };
  encashableDays: number;
  dailyRate: number;
  encashmentAmount: number;
  status: 'pending' | 'calculated' | 'approved' | 'processed';
  calculatedBy?: string;
  calculatedOn?: string;
  approvedBy?: string;
}

export default function FNFLeavePage() {
  const [selectedTab, setSelectedTab] = useState<'pending' | 'calculated' | 'approved' | 'processed'>('pending');

  const mockEncashments: FNFLeaveEncashment[] = [
    {
      id: 'FNF-LV-001',
      employeeId: 'EMP001',
      employeeName: 'Rahul Sharma',
      designation: 'Senior Software Engineer',
      department: 'Engineering',
      lastWorkingDay: '2025-12-14',
      joiningDate: '2022-01-15',
      leaveBalance: {
        earnedLeave: 15,
        casualLeave: 3,
        sickLeave: 2,
        privilegeLeave: 8
      },
      leavePolicy: {
        earnedLeaveEncashable: true,
        casualLeaveEncashable: false,
        sickLeaveEncashable: false,
        privilegeLeaveEncashable: true,
        maxEncashableDays: 30
      },
      encashableDays: 23,
      dailyRate: 3461,
      encashmentAmount: 79603,
      status: 'calculated',
      calculatedBy: 'Priya Singh - HR Manager',
      calculatedOn: '2025-12-10'
    },
    {
      id: 'FNF-LV-002',
      employeeId: 'EMP002',
      employeeName: 'Priya Singh',
      designation: 'Marketing Manager',
      department: 'Marketing',
      lastWorkingDay: '2025-11-30',
      joiningDate: '2020-06-10',
      leaveBalance: {
        earnedLeave: 20,
        casualLeave: 5,
        sickLeave: 4,
        privilegeLeave: 12
      },
      leavePolicy: {
        earnedLeaveEncashable: true,
        casualLeaveEncashable: false,
        sickLeaveEncashable: false,
        privilegeLeaveEncashable: true,
        maxEncashableDays: 30
      },
      encashableDays: 30,
      dailyRate: 4230,
      encashmentAmount: 126900,
      status: 'approved',
      calculatedBy: 'Amit Kumar - Finance Head',
      calculatedOn: '2025-11-25',
      approvedBy: 'Rajesh Patel - CFO'
    },
    {
      id: 'FNF-LV-003',
      employeeId: 'EMP003',
      employeeName: 'Amit Kumar',
      designation: 'Product Manager',
      department: 'Product',
      lastWorkingDay: '2025-10-31',
      joiningDate: '2019-03-20',
      leaveBalance: {
        earnedLeave: 25,
        casualLeave: 2,
        sickLeave: 1,
        privilegeLeave: 15
      },
      leavePolicy: {
        earnedLeaveEncashable: true,
        casualLeaveEncashable: false,
        sickLeaveEncashable: false,
        privilegeLeaveEncashable: true,
        maxEncashableDays: 30
      },
      encashableDays: 30,
      dailyRate: 5000,
      encashmentAmount: 150000,
      status: 'processed',
      calculatedBy: 'Priya Singh - HR Manager',
      calculatedOn: '2025-10-25',
      approvedBy: 'Rajesh Patel - CFO'
    }
  ];

  const filteredEncashments = useMemo(() => {
    return mockEncashments.filter(encashment => encashment.status === selectedTab);
  }, [selectedTab]);

  const stats = {
    pending: mockEncashments.filter(e => e.status === 'pending').length,
    calculated: mockEncashments.filter(e => e.status === 'calculated').length,
    approved: mockEncashments.filter(e => e.status === 'approved').length,
    processed: mockEncashments.filter(e => e.status === 'processed').length
  };

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-700',
    calculated: 'bg-blue-100 text-blue-700',
    approved: 'bg-green-100 text-green-700',
    processed: 'bg-gray-100 text-gray-700'
  };

  const statusIcons = {
    pending: <Clock className="h-4 w-4" />,
    calculated: <Calendar className="h-4 w-4" />,
    approved: <CheckCircle className="h-4 w-4" />,
    processed: <CheckCircle className="h-4 w-4" />
  };

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const calculateTotalLeaves = (balance: FNFLeaveEncashment['leaveBalance']) => {
    return Object.values(balance).reduce((sum, val) => sum + val, 0);
  };

  return (
    <div className="w-full h-full px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">FNF - Leave Encashment</h1>
        <p className="text-sm text-gray-600 mt-1">Calculate and process leave encashment for exiting employees</p>
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
            <Calendar className="h-8 w-8 text-blue-600" />
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
        {filteredEncashments.map(encashment => {
          const totalLeaves = calculateTotalLeaves(encashment.leaveBalance);

          return (
            <div key={encashment.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-gray-900">{encashment.employeeName}</h3>
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusColors[encashment.status]}`}>
                      <span className="inline-flex items-center gap-1">
                        {statusIcons[encashment.status]}
                        {encashment.status.toUpperCase()}
                      </span>
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{encashment.designation} • {encashment.department}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Last Working Day: {new Date(encashment.lastWorkingDay).toLocaleDateString('en-IN')}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Leave Balance</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Earned Leave (EL)</span>
                      <span className={`font-medium ${encashment.leavePolicy.earnedLeaveEncashable ? 'text-green-600' : 'text-gray-400'}`}>
                        {encashment.leaveBalance.earnedLeave} days
                        {encashment.leavePolicy.earnedLeaveEncashable && ' ✓'}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Privilege Leave (PL)</span>
                      <span className={`font-medium ${encashment.leavePolicy.privilegeLeaveEncashable ? 'text-green-600' : 'text-gray-400'}`}>
                        {encashment.leaveBalance.privilegeLeave} days
                        {encashment.leavePolicy.privilegeLeaveEncashable && ' ✓'}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Casual Leave (CL)</span>
                      <span className={`font-medium ${encashment.leavePolicy.casualLeaveEncashable ? 'text-green-600' : 'text-gray-400'}`}>
                        {encashment.leaveBalance.casualLeave} days
                        {!encashment.leavePolicy.casualLeaveEncashable && ' ✗'}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Sick Leave (SL)</span>
                      <span className={`font-medium ${encashment.leavePolicy.sickLeaveEncashable ? 'text-green-600' : 'text-gray-400'}`}>
                        {encashment.leaveBalance.sickLeave} days
                        {!encashment.leavePolicy.sickLeaveEncashable && ' ✗'}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm pt-2 border-t border-gray-200">
                      <span className="font-semibold text-gray-900">Total Leave Balance</span>
                      <span className="font-bold text-gray-900">{totalLeaves} days</span>
                    </div>
                  </div>
                  <div className="mt-3 p-2 bg-blue-50 rounded border border-blue-200">
                    <p className="text-xs text-blue-700">
                      ✓ = Encashable  •  ✗ = Non-encashable
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Encashment Calculation</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Encashable Days</span>
                      <span className="font-medium text-gray-900">{encashment.encashableDays} days</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Daily Rate</span>
                      <span className="font-medium text-gray-900">{formatCurrency(encashment.dailyRate)}</span>
                    </div>
                    {encashment.leavePolicy.maxEncashableDays && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Policy Limit</span>
                        <span className="font-medium text-gray-900">{encashment.leavePolicy.maxEncashableDays} days</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm pt-2 border-t border-gray-200">
                      <span className="font-semibold text-gray-900">Encashment Amount</span>
                      <span className="font-bold text-green-600">{formatCurrency(encashment.encashmentAmount)}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Calculated: {encashment.encashableDays} days × {formatCurrency(encashment.dailyRate)}
                    </p>
                  </div>
                  {encashment.leavePolicy.maxEncashableDays &&
                   (encashment.leaveBalance.earnedLeave + encashment.leaveBalance.privilegeLeave) > encashment.leavePolicy.maxEncashableDays && (
                    <div className="mt-3 p-2 bg-yellow-50 rounded border border-yellow-200">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
                        <p className="text-xs text-yellow-700">
                          Encashable days capped at {encashment.leavePolicy.maxEncashableDays} days as per policy
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4 border-2 border-green-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-700 mb-1">Total Leave Encashment</p>
                    <p className="text-2xl font-bold text-green-900">
                      {formatCurrency(encashment.encashmentAmount)}
                    </p>
                    <p className="text-xs text-green-700 mt-1">
                      {encashment.encashableDays} days to be added to FNF settlement
                    </p>
                  </div>
                  <IndianRupee className="h-12 w-12 text-green-600" />
                </div>
              </div>

              {encashment.calculatedBy && (
                <div className="mt-4 pt-4 border-t border-gray-200 text-xs text-gray-500">
                  <p>Calculated by: {encashment.calculatedBy} on {new Date(encashment.calculatedOn!).toLocaleDateString('en-IN')}</p>
                  {encashment.approvedBy && (
                    <p>Approved by: {encashment.approvedBy}</p>
                  )}
                </div>
              )}

              <div className="flex gap-2 mt-4">
                {encashment.status === 'pending' && (
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm">
                    <Calendar className="inline h-4 w-4 mr-2" />
                    Calculate Encashment
                  </button>
                )}
                {encashment.status === 'calculated' && (
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
                {encashment.status === 'approved' && (
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

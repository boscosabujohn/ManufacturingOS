'use client';

import { useState, useMemo } from 'react';
import { RefreshCw, Plus, Check, X, AlertCircle, CheckCircle, XCircle, Clock } from 'lucide-react';
import DataTable from '@/components/DataTable';
import StatusBadge from '@/components/StatusBadge';

interface ShiftSwap {
  id: string;
  requestId: string;
  fromEmployee: { code: string; name: string; };
  toEmployee: { code: string; name: string; };
  swapDate: string;
  fromShift: string;
  toShift: string;
  reason: string;
  requestDate: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  approvedBy?: string;
  approvedDate?: string;
}

export default function ShiftSwapsPage() {
  const [selectedStatus, setSelectedStatus] = useState('all');

  const mockSwaps: ShiftSwap[] = [
    {
      id: '1', requestId: 'SWP001',
      fromEmployee: { code: 'KMF2020001', name: 'Rajesh Kumar' },
      toEmployee: { code: 'KMF2019002', name: 'Meera Nair' },
      swapDate: '2024-11-25', fromShift: 'General Day Shift', toShift: 'Morning Shift',
      reason: 'Personal commitment', requestDate: '2024-11-18',
      status: 'pending'
    },
    {
      id: '2', requestId: 'SWP002',
      fromEmployee: { code: 'KMF2021003', name: 'Arun Patel' },
      toEmployee: { code: 'KMF2022004', name: 'Vikram Singh' },
      swapDate: '2024-11-22', fromShift: 'Night Shift', toShift: 'Evening Shift',
      reason: 'Medical appointment', requestDate: '2024-11-15',
      status: 'approved', approvedBy: 'HR Manager', approvedDate: '2024-11-16'
    },
    {
      id: '3', requestId: 'SWP003',
      fromEmployee: { code: 'KMF2020005', name: 'Priya Menon' },
      toEmployee: { code: 'KMF2018006', name: 'Suresh Babu' },
      swapDate: '2024-11-28', fromShift: 'General Day Shift', toShift: 'Evening Shift',
      reason: 'Family function', requestDate: '2024-11-19',
      status: 'pending'
    },
    {
      id: '4', requestId: 'SWP004',
      fromEmployee: { code: 'KMF2019007', name: 'Anjali Reddy' },
      toEmployee: { code: 'KMF2021008', name: 'Kavita Desai' },
      swapDate: '2024-11-20', fromShift: 'Morning Shift', toShift: 'General Day Shift',
      reason: 'School event', requestDate: '2024-11-14',
      status: 'approved', approvedBy: 'Department Head', approvedDate: '2024-11-15'
    },
    {
      id: '5', requestId: 'SWP005',
      fromEmployee: { code: 'KMF2020001', name: 'Rajesh Kumar' },
      toEmployee: { code: 'KMF2022004', name: 'Vikram Singh' },
      swapDate: '2024-11-21', fromShift: 'General Day Shift', toShift: 'Night Shift',
      reason: 'House shifting', requestDate: '2024-11-13',
      status: 'rejected', approvedBy: 'HR Manager', approvedDate: '2024-11-14'
    },
    {
      id: '6', requestId: 'SWP006',
      fromEmployee: { code: 'KMF2018006', name: 'Suresh Babu' },
      toEmployee: { code: 'KMF2020005', name: 'Priya Menon' },
      swapDate: '2024-11-26', fromShift: 'Evening Shift', toShift: 'General Day Shift',
      reason: 'Training program', requestDate: '2024-11-17',
      status: 'pending'
    },
    {
      id: '7', requestId: 'SWP007',
      fromEmployee: { code: 'KMF2021003', name: 'Arun Patel' },
      toEmployee: { code: 'KMF2019002', name: 'Meera Nair' },
      swapDate: '2024-11-23', fromShift: 'Flexible Shift', toShift: 'Morning Shift',
      reason: 'Client meeting', requestDate: '2024-11-16',
      status: 'approved', approvedBy: 'Team Lead', approvedDate: '2024-11-17'
    },
    {
      id: '8', requestId: 'SWP008',
      fromEmployee: { code: 'KMF2022004', name: 'Vikram Singh' },
      toEmployee: { code: 'KMF2020001', name: 'Rajesh Kumar' },
      swapDate: '2024-11-27', fromShift: 'Night Shift', toShift: 'General Day Shift',
      reason: 'Health checkup', requestDate: '2024-11-19',
      status: 'pending'
    }
  ];

  const filteredData = useMemo(() => {
    if (selectedStatus === 'all') return mockSwaps;
    return mockSwaps.filter(swap => swap.status === selectedStatus);
  }, [selectedStatus]);

  const stats = {
    total: mockSwaps.length,
    pending: mockSwaps.filter(s => s.status === 'pending').length,
    approved: mockSwaps.filter(s => s.status === 'approved').length,
    rejected: mockSwaps.filter(s => s.status === 'rejected').length
  };

  const columns = [
    { key: 'requestId', label: 'Request ID', sortable: true,
      render: (v: string, row: ShiftSwap) => (
        <div>
          <div className="font-semibold text-gray-900">{v}</div>
          <div className="text-xs text-gray-500">
            {new Date(row.requestDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
          </div>
        </div>
      )
    },
    { key: 'fromEmployee', label: 'From Employee', sortable: true,
      render: (v: { code: string; name: string }) => (
        <div>
          <div className="font-medium text-gray-900">{v.name}</div>
          <div className="text-xs text-gray-500">{v.code}</div>
        </div>
      )
    },
    { key: 'toEmployee', label: 'To Employee', sortable: true,
      render: (v: { code: string; name: string }) => (
        <div>
          <div className="font-medium text-gray-900">{v.name}</div>
          <div className="text-xs text-gray-500">{v.code}</div>
        </div>
      )
    },
    { key: 'swapDate', label: 'Swap Date', sortable: true,
      render: (v: string) => (
        <div className="font-medium text-gray-900">
          {new Date(v).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
        </div>
      )
    },
    { key: 'fromShift', label: 'Shift Exchange', sortable: false,
      render: (v: string, row: ShiftSwap) => (
        <div className="text-sm">
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 rounded bg-blue-100 text-blue-700 text-xs font-medium">{v}</span>
            <RefreshCw className="w-3 h-3 text-gray-400" />
            <span className="px-2 py-1 rounded bg-purple-100 text-purple-700 text-xs font-medium">{row.toShift}</span>
          </div>
        </div>
      )
    },
    { key: 'reason', label: 'Reason', sortable: false,
      render: (v: string) => (
        <div className="text-sm text-gray-700 max-w-xs truncate">{v}</div>
      )
    },
    { key: 'status', label: 'Status', sortable: true,
      render: (v: string) => <StatusBadge status={v} />
    },
    { key: 'id', label: 'Actions', sortable: false,
      render: (_, row: ShiftSwap) => (
        row.status === 'pending' ? (
          <div className="flex gap-2">
            <button className="p-2 text-green-600 hover:bg-green-50 rounded transition-colors">
              <Check className="h-4 w-4" />
            </button>
            <button className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors">
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="text-xs text-gray-500">
            {row.approvedBy && `By ${row.approvedBy}`}
          </div>
        )
      )
    }
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          <RefreshCw className="h-8 w-8 text-blue-600" />
          Shift Swaps
        </h1>
        <p className="text-gray-600 mt-2">Manage shift exchange requests between employees</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border-2 border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Requests</p>
              <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
            </div>
            <RefreshCw className="h-10 w-10 text-blue-400" />
          </div>
        </div>
        <div className="bg-white border-2 border-yellow-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
            <Clock className="h-10 w-10 text-yellow-400" />
          </div>
        </div>
        <div className="bg-white border-2 border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Approved</p>
              <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
            </div>
            <CheckCircle className="h-10 w-10 text-green-400" />
          </div>
        </div>
        <div className="bg-white border-2 border-red-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Rejected</p>
              <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
            </div>
            <XCircle className="h-10 w-10 text-red-400" />
          </div>
        </div>
      </div>

      {/* Pending Alert */}
      {stats.pending > 0 && (
        <div className="bg-yellow-50 border-l-4 border-yellow-500 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-yellow-600" />
            <div>
              <h3 className="font-semibold text-yellow-900">Pending Approval</h3>
              <p className="text-sm text-yellow-700">{stats.pending} shift swap request{stats.pending > 1 ? 's' : ''} awaiting approval.</p>
            </div>
          </div>
        </div>
      )}

      {/* Action Bar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedStatus('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedStatus === 'all' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All ({stats.total})
            </button>
            <button
              onClick={() => setSelectedStatus('pending')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedStatus === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Pending ({stats.pending})
            </button>
            <button
              onClick={() => setSelectedStatus('approved')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedStatus === 'approved' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Approved ({stats.approved})
            </button>
            <button
              onClick={() => setSelectedStatus('rejected')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedStatus === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Rejected ({stats.rejected})
            </button>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Plus className="h-4 w-4" />
            Request Swap
          </button>
        </div>
      </div>

      {/* Swap Requests Table */}
      <DataTable data={filteredData} columns={columns} />
    </div>
  );
}

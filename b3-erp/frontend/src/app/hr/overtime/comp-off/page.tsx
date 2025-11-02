'use client';

import { useState, useMemo } from 'react';
import { Calendar, Plus, Search, Filter, Clock, CheckCircle, XCircle, AlertCircle, TrendingUp } from 'lucide-react';
import DataTable from '@/components/DataTable';
import StatusBadge from '@/components/StatusBadge';
import { ApplyCompOffModal } from '@/components/hr/ApplyCompOffModal';

interface CompOff {
  id: string;
  earnedDate: string;
  reason: string;
  overtimeHours: number;
  daysEarned: number;
  daysUsed: number;
  balance: number;
  expiryDate: string;
  status: 'available' | 'used' | 'expired' | 'expiring_soon';
  usedDate?: string;
}

export default function CompensatoryOffPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  const mockCompOffs: CompOff[] = [
    {
      id: '1', earnedDate: '2024-10-15', reason: 'Weekend production support',
      overtimeHours: 8, daysEarned: 1.0, daysUsed: 0, balance: 1.0,
      expiryDate: '2025-01-15', status: 'available'
    },
    {
      id: '2', earnedDate: '2024-09-20', reason: 'Holiday work - Machine installation',
      overtimeHours: 12, daysEarned: 1.5, daysUsed: 1.5, balance: 0,
      expiryDate: '2024-12-20', status: 'used', usedDate: '2024-11-10'
    },
    {
      id: '3', earnedDate: '2024-10-28', reason: 'Emergency production target',
      overtimeHours: 10, daysEarned: 1.0, daysUsed: 0, balance: 1.0,
      expiryDate: '2025-01-28', status: 'available'
    },
    {
      id: '4', earnedDate: '2024-11-05', reason: 'Server maintenance on Sunday',
      overtimeHours: 6, daysEarned: 0.5, daysUsed: 0, balance: 0.5,
      expiryDate: '2025-02-05', status: 'available'
    },
    {
      id: '5', earnedDate: '2024-08-12', reason: 'Festival work - Quality inspection',
      overtimeHours: 8, daysEarned: 1.0, daysUsed: 0, balance: 1.0,
      expiryDate: '2024-11-30', status: 'expiring_soon'
    },
    {
      id: '6', earnedDate: '2024-07-18', reason: 'Weekend shift coverage',
      overtimeHours: 8, daysEarned: 1.0, daysUsed: 1.0, balance: 0,
      expiryDate: '2024-10-18', status: 'expired'
    },
    {
      id: '7', earnedDate: '2024-10-22', reason: 'Urgent client delivery support',
      overtimeHours: 9, daysEarned: 1.0, daysUsed: 0.5, balance: 0.5,
      expiryDate: '2025-01-22', status: 'available', usedDate: '2024-11-15'
    },
    {
      id: '8', earnedDate: '2024-11-10', reason: 'Weekend audit preparation',
      overtimeHours: 12, daysEarned: 1.5, daysUsed: 0, balance: 1.5,
      expiryDate: '2025-02-10', status: 'available'
    }
  ];

  const filteredData = useMemo(() => {
    return mockCompOffs.filter(compOff => {
      const matchesSearch = compOff.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           compOff.earnedDate.includes(searchTerm);
      const matchesStatus = selectedStatus === 'all' || compOff.status === selectedStatus;
      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, selectedStatus]);

  const stats = {
    totalAvailable: mockCompOffs.filter(c => c.status === 'available').reduce((sum, c) => sum + c.balance, 0),
    earnedThisMonth: mockCompOffs.filter(c => new Date(c.earnedDate).getMonth() === 10).reduce((sum, c) => sum + c.daysEarned, 0),
    usedThisMonth: mockCompOffs.filter(c => c.usedDate && new Date(c.usedDate).getMonth() === 10).reduce((sum, c) => sum + c.daysUsed, 0),
    expiringSoon: mockCompOffs.filter(c => c.status === 'expiring_soon').reduce((sum, c) => sum + c.balance, 0)
  };

  const getStatusColor = (status: string) => {
    const colors = {
      available: 'bg-green-100 text-green-800',
      used: 'bg-gray-100 text-gray-800',
      expired: 'bg-red-100 text-red-800',
      expiring_soon: 'bg-yellow-100 text-yellow-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      available: 'Available',
      used: 'Used',
      expired: 'Expired',
      expiring_soon: 'Expiring Soon'
    };
    return labels[status as keyof typeof labels] || status;
  };

  const columns = [
    { key: 'earnedDate', label: 'Date Earned', sortable: true,
      render: (v: string) => (
        <div>
          <div className="font-medium text-gray-900">
            {new Date(v).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
          </div>
        </div>
      )
    },
    { key: 'reason', label: 'Reason', sortable: false,
      render: (v: string, row: CompOff) => (
        <div>
          <div className="text-sm text-gray-900">{v}</div>
          <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
            <Clock className="w-3 h-3" />
            {row.overtimeHours} hrs OT
          </div>
        </div>
      )
    },
    { key: 'daysEarned', label: 'Days Earned', sortable: true,
      render: (v: number) => (
        <div className="flex items-center gap-1 text-green-700">
          <TrendingUp className="w-4 h-4" />
          <span className="font-semibold">{v.toFixed(1)}</span>
        </div>
      )
    },
    { key: 'daysUsed', label: 'Days Used', sortable: true,
      render: (v: number, row: CompOff) => (
        <div>
          <div className="font-medium text-gray-900">{v.toFixed(1)}</div>
          {row.usedDate && (
            <div className="text-xs text-gray-500">
              {new Date(row.usedDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
            </div>
          )}
        </div>
      )
    },
    { key: 'balance', label: 'Balance', sortable: true,
      render: (v: number) => (
        <div className={`font-bold ${v > 0 ? 'text-blue-700' : 'text-gray-400'}`}>
          {v.toFixed(1)} {v === 1 ? 'day' : 'days'}
        </div>
      )
    },
    { key: 'expiryDate', label: 'Expiry Date', sortable: true,
      render: (v: string, row: CompOff) => {
        const isExpiringSoon = row.status === 'expiring_soon';
        return (
          <div>
            <div className={`font-medium ${isExpiringSoon ? 'text-orange-700' : 'text-gray-900'}`}>
              {new Date(v).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
            </div>
            {isExpiringSoon && (
              <div className="text-xs text-orange-600 flex items-center gap-1 mt-1">
                <AlertCircle className="w-3 h-3" />
                Expiring soon
              </div>
            )}
          </div>
        );
      }
    },
    { key: 'status', label: 'Status', sortable: true,
      render: (v: string) => (
        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(v)}`}>
          {getStatusLabel(v)}
        </span>
      )
    }
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          <Calendar className="h-8 w-8 text-blue-600" />
          Compensatory Off
        </h1>
        <p className="text-gray-600 mt-2">Manage comp-off credits and utilization</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border-2 border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Available Comp-Off</p>
              <p className="text-2xl font-bold text-blue-600">{stats.totalAvailable.toFixed(1)} days</p>
            </div>
            <CheckCircle className="h-10 w-10 text-blue-400" />
          </div>
        </div>
        <div className="bg-white border-2 border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Earned This Month</p>
              <p className="text-2xl font-bold text-green-600">{stats.earnedThisMonth.toFixed(1)} days</p>
            </div>
            <TrendingUp className="h-10 w-10 text-green-400" />
          </div>
        </div>
        <div className="bg-white border-2 border-yellow-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Used This Month</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.usedThisMonth.toFixed(1)} days</p>
            </div>
            <Clock className="h-10 w-10 text-yellow-400" />
          </div>
        </div>
        <div className="bg-white border-2 border-orange-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Expiring Soon</p>
              <p className="text-2xl font-bold text-orange-600">{stats.expiringSoon.toFixed(1)} days</p>
            </div>
            <AlertCircle className="h-10 w-10 text-orange-400" />
          </div>
        </div>
      </div>

      {/* Expiring Soon Alert */}
      {stats.expiringSoon > 0 && (
        <div className="bg-orange-50 border-l-4 border-orange-500 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-orange-600" />
            <div>
              <h3 className="font-semibold text-orange-900">Comp-Off Days Expiring Soon</h3>
              <p className="text-sm text-orange-700">
                You have {stats.expiringSoon.toFixed(1)} comp-off day{stats.expiringSoon > 1 ? 's' : ''} expiring soon.
                Please plan to use them before they expire.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Action Bar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search by reason or date..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${
              showFilters ? 'bg-blue-50 border-blue-300 text-blue-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Filter className="h-4 w-4" />
            Filters
          </button>
          <button
            onClick={() => setIsApplyModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            Apply Comp-Off
          </button>
        </div>

        {showFilters && (
          <div className="mt-4 pt-4 border-t">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full md:w-64 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Statuses</option>
                <option value="available">Available</option>
                <option value="used">Used</option>
                <option value="expiring_soon">Expiring Soon</option>
                <option value="expired">Expired</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Comp-Off History */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-900">Comp-Off History</h3>
        </div>
        <DataTable data={filteredData} columns={columns} />
      </div>

      {/* Info Box */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-blue-900 mb-2">Comp-Off Policy</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Comp-off is credited for overtime work exceeding 4 hours in a day</li>
          <li>• 8 hours of overtime = 1 day of comp-off</li>
          <li>• Comp-off credits expire after 90 days from the date earned</li>
          <li>• Comp-off can be utilized subject to manager approval</li>
          <li>• Unutilized comp-off will not be encashed</li>
        </ul>
      </div>

      {/* Apply Comp-Off Modal */}
      <ApplyCompOffModal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        onSubmit={(data) => {
          console.log('Apply comp-off:', data);
          setIsApplyModalOpen(false);
          // TODO: Implement actual comp-off application logic
        }}
        availableCredits={mockCompOffs
          .filter(c => c.status === 'available' || c.status === 'expiring_soon')
          .map(c => ({
            id: c.id,
            earnedDate: c.earnedDate,
            reason: c.reason,
            daysAvailable: c.balance,
            expiryDate: c.expiryDate
          }))}
      />
    </div>
  );
}

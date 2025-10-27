'use client';

import { useState, useMemo } from 'react';
import { ClipboardCheck, Calendar, CheckCircle, AlertCircle, XCircle, Package, User } from 'lucide-react';

interface AuditRecord {
  id: string;
  auditId: string;
  auditDate: string;
  auditType: 'scheduled' | 'surprise' | 'annual' | 'spot';
  location: string;
  auditor: string;
  totalAssets: number;
  verified: number;
  missing: number;
  damaged: number;
  status: 'completed' | 'in_progress' | 'pending' | 'approved';
  completionDate?: string;
  remarks?: string;
}

export default function Page() {
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedType, setSelectedType] = useState('all');

  const mockAudits: AuditRecord[] = [
    {
      id: '1',
      auditId: 'AUD-2025-Q4-001',
      auditDate: '2025-10-01',
      auditType: 'scheduled',
      location: 'Mumbai Office',
      auditor: 'Rajesh Kumar',
      totalAssets: 245,
      verified: 245,
      missing: 0,
      damaged: 0,
      status: 'completed',
      completionDate: '2025-10-05',
      remarks: 'All assets accounted for'
    },
    {
      id: '2',
      auditId: 'AUD-2025-Q4-002',
      auditDate: '2025-10-15',
      auditType: 'annual',
      location: 'Delhi Office',
      auditor: 'Priya Sharma',
      totalAssets: 189,
      verified: 185,
      missing: 2,
      damaged: 2,
      status: 'in_progress'
    },
    {
      id: '3',
      auditId: 'AUD-2025-Q4-003',
      auditDate: '2025-10-20',
      auditType: 'surprise',
      location: 'Bangalore Office',
      auditor: 'Amit Patel',
      totalAssets: 312,
      verified: 0,
      missing: 0,
      damaged: 0,
      status: 'pending'
    },
    {
      id: '4',
      auditId: 'AUD-2025-Q3-045',
      auditDate: '2025-09-10',
      auditType: 'scheduled',
      location: 'Pune Office',
      auditor: 'Sneha Reddy',
      totalAssets: 156,
      verified: 150,
      missing: 4,
      damaged: 2,
      status: 'approved',
      completionDate: '2025-09-15',
      remarks: '4 laptops missing - FIR filed'
    }
  ];

  const filteredAudits = mockAudits.filter(a => {
    const statusMatch = selectedStatus === 'all' || a.status === selectedStatus;
    const typeMatch = selectedType === 'all' || a.auditType === selectedType;
    return statusMatch && typeMatch;
  });

  const stats = useMemo(() => ({
    total: mockAudits.length,
    completed: mockAudits.filter(a => a.status === 'completed').length,
    inProgress: mockAudits.filter(a => a.status === 'in_progress').length,
    pending: mockAudits.filter(a => a.status === 'pending').length
  }), [mockAudits]);

  const statusColors = {
    completed: 'bg-green-100 text-green-700',
    in_progress: 'bg-blue-100 text-blue-700',
    pending: 'bg-yellow-100 text-yellow-700',
    approved: 'bg-purple-100 text-purple-700'
  };

  const typeColors = {
    scheduled: 'bg-blue-100 text-blue-700',
    surprise: 'bg-orange-100 text-orange-700',
    annual: 'bg-purple-100 text-purple-700',
    spot: 'bg-green-100 text-green-700'
  };

  return (
    <div className="w-full h-full px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Asset Inventory Audit</h1>
        <p className="text-sm text-gray-600 mt-1">Track and manage asset audits</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
          <p className="text-sm font-medium text-blue-600">Total Audits</p>
          <p className="text-2xl font-bold text-blue-900 mt-1">{stats.total}</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
          <p className="text-sm font-medium text-green-600">Completed</p>
          <p className="text-2xl font-bold text-green-900 mt-1">{stats.completed}</p>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
          <p className="text-sm font-medium text-blue-600">In Progress</p>
          <p className="text-2xl font-bold text-blue-900 mt-1">{stats.inProgress}</p>
        </div>
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4 border border-yellow-200">
          <p className="text-sm font-medium text-yellow-600">Pending</p>
          <p className="text-2xl font-bold text-yellow-900 mt-1">{stats.pending}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="approved">Approved</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Audit Type</label>
            <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="all">All Types</option>
              <option value="scheduled">Scheduled</option>
              <option value="surprise">Surprise</option>
              <option value="annual">Annual</option>
              <option value="spot">Spot</option>
            </select>
          </div>
          <div className="flex items-end">
            <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm">
              Schedule New Audit
            </button>
          </div>
        </div>
      </div>

      {/* Audits List */}
      <div className="space-y-4">
        {filteredAudits.map(audit => (
          <div key={audit.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-12 w-12 bg-indigo-50 rounded-lg flex items-center justify-center">
                    <ClipboardCheck className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{audit.auditId}</h3>
                    <p className="text-sm text-gray-600">{audit.location}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-1 text-xs font-semibold rounded ${typeColors[audit.auditType]}`}>
                    {audit.auditType.charAt(0).toUpperCase() + audit.auditType.slice(1)}
                  </span>
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusColors[audit.status]}`}>
                    {audit.status === 'in_progress' ? 'In Progress' : audit.status.charAt(0).toUpperCase() + audit.status.slice(1)}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 py-4 border-y border-gray-200">
              <div>
                <p className="text-xs text-gray-500 uppercase font-medium mb-1">Auditor</p>
                <p className="text-sm font-semibold text-gray-900 flex items-center gap-1">
                  <User className="h-4 w-4" />
                  {audit.auditor}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-medium mb-1">Audit Date</p>
                <p className="text-sm font-semibold text-gray-900 flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {new Date(audit.auditDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-medium mb-1">Total Assets</p>
                <p className="text-2xl font-bold text-gray-900">{audit.totalAssets}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-medium mb-1">Progress</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${(audit.verified / audit.totalAssets) * 100}%` }}></div>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">{Math.round((audit.verified / audit.totalAssets) * 100)}%</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="bg-green-50 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <p className="text-xs text-green-600 uppercase font-medium">Verified</p>
                </div>
                <p className="text-2xl font-bold text-green-900">{audit.verified}</p>
              </div>
              <div className="bg-orange-50 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <AlertCircle className="h-4 w-4 text-orange-600" />
                  <p className="text-xs text-orange-600 uppercase font-medium">Missing</p>
                </div>
                <p className="text-2xl font-bold text-orange-900">{audit.missing}</p>
              </div>
              <div className="bg-red-50 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <XCircle className="h-4 w-4 text-red-600" />
                  <p className="text-xs text-red-600 uppercase font-medium">Damaged</p>
                </div>
                <p className="text-2xl font-bold text-red-900">{audit.damaged}</p>
              </div>
            </div>

            {audit.remarks && (
              <div className="bg-gray-50 rounded-lg p-3 mb-4">
                <p className="text-xs text-gray-500 uppercase font-medium mb-1">Remarks</p>
                <p className="text-sm text-gray-700">{audit.remarks}</p>
              </div>
            )}

            <div className="flex gap-2">
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium text-sm">
                View Details
              </button>
              {audit.status === 'pending' && (
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm">
                  Start Audit
                </button>
              )}
              {audit.status === 'in_progress' && (
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium text-sm">
                  Complete Audit
                </button>
              )}
              {audit.status === 'completed' && (
                <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium text-sm">
                  Approve
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

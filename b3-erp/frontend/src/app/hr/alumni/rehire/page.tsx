'use client';

import { useState } from 'react';
import { UserPlus, Users, CheckCircle, Clock, XCircle, Calendar, Briefcase, Mail, Phone, TrendingUp, AlertCircle } from 'lucide-react';

interface RehireCandidate {
  id: string;
  employeeCode: string;
  name: string;
  previousDesignation: string;
  department: string;
  exitDate: string;
  exitReason: string;
  tenure: string;
  proposedDesignation: string;
  proposedDepartment: string;
  proposedCTC: number;
  requestedBy: string;
  requestDate: string;
  status: 'pending' | 'approved' | 'rejected' | 'on_hold';
  eligibilityScore: number;
  performanceRating: string;
  noticePeriodServed: boolean;
  pendingDues: boolean;
  backgroundCheckStatus: 'pending' | 'cleared' | 'issues';
  comments?: string;
}

export default function Page() {
  const [selectedStatus, setSelectedStatus] = useState('all');

  const mockCandidates: RehireCandidate[] = [
    {
      id: '1',
      employeeCode: 'EMP001',
      name: 'Rajesh Kumar',
      previousDesignation: 'Senior Production Manager',
      department: 'Production',
      exitDate: '2024-08-31',
      exitReason: 'Career Growth',
      tenure: '6 years 5 months',
      proposedDesignation: 'General Manager - Production',
      proposedDepartment: 'Production',
      proposedCTC: 1800000,
      requestedBy: 'Suresh Iyer (VP Operations)',
      requestDate: '2025-10-15',
      status: 'pending',
      eligibilityScore: 95,
      performanceRating: 'Excellent',
      noticePeriodServed: true,
      pendingDues: false,
      backgroundCheckStatus: 'cleared',
      comments: 'Excellent track record. Left for higher position at Tata Motors. Willing to return.'
    },
    {
      id: '2',
      employeeCode: 'EMP123',
      name: 'Amit Patel',
      previousDesignation: 'Quality Assurance Lead',
      department: 'Quality',
      exitDate: '2023-12-31',
      exitReason: 'Career Growth',
      tenure: '6 years 10 months',
      proposedDesignation: 'Quality Manager',
      proposedDepartment: 'Quality',
      proposedCTC: 1500000,
      requestedBy: 'Madhav Singh (Head QA)',
      requestDate: '2025-10-10',
      status: 'approved',
      eligibilityScore: 92,
      performanceRating: 'Outstanding',
      noticePeriodServed: true,
      pendingDues: false,
      backgroundCheckStatus: 'cleared',
      comments: 'Six Sigma Black Belt certified. High performer.'
    },
    {
      id: '3',
      employeeCode: 'EMP078',
      name: 'Sneha Reddy',
      previousDesignation: 'Maintenance Engineer',
      department: 'Maintenance',
      exitDate: '2024-06-30',
      exitReason: 'Career Growth',
      tenure: '4 years 5 months',
      proposedDesignation: 'Senior Maintenance Engineer',
      proposedDepartment: 'Maintenance',
      proposedCTC: 1200000,
      requestedBy: 'Ramesh Nair (Maintenance Head)',
      requestDate: '2025-10-05',
      status: 'on_hold',
      eligibilityScore: 85,
      performanceRating: 'Good',
      noticePeriodServed: true,
      pendingDues: false,
      backgroundCheckStatus: 'pending',
      comments: 'Awaiting background verification clearance from L&T.'
    },
    {
      id: '4',
      employeeCode: 'EMP145',
      name: 'Karthik Menon',
      previousDesignation: 'Production Supervisor',
      department: 'Production',
      exitDate: '2023-03-15',
      exitReason: 'Personal Reasons',
      tenure: '3 years 2 months',
      proposedDesignation: 'Production Supervisor',
      proposedDepartment: 'Production',
      proposedCTC: 900000,
      requestedBy: 'Suresh Iyer (VP Operations)',
      requestDate: '2025-09-25',
      status: 'rejected',
      eligibilityScore: 65,
      performanceRating: 'Average',
      noticePeriodServed: false,
      pendingDues: true,
      backgroundCheckStatus: 'issues',
      comments: 'Did not serve full notice period. Pending dues of ₹25,000.'
    }
  ];

  const filteredCandidates = mockCandidates.filter(c =>
    selectedStatus === 'all' || c.status === selectedStatus
  );

  const stats = {
    total: mockCandidates.length,
    pending: mockCandidates.filter(c => c.status === 'pending').length,
    approved: mockCandidates.filter(c => c.status === 'approved').length,
    rejected: mockCandidates.filter(c => c.status === 'rejected').length,
    avgEligibilityScore: Math.round(
      mockCandidates.reduce((sum, c) => sum + c.eligibilityScore, 0) / mockCandidates.length
    )
  };

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-700',
    approved: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700',
    on_hold: 'bg-orange-100 text-orange-700'
  };

  const getEligibilityColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 75) return 'text-blue-600';
    if (score >= 60) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <div className="w-full h-full px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Alumni Rehire Process</h1>
        <p className="text-sm text-gray-600 mt-1">Manage rehiring requests for former employees</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Total Requests</p>
              <p className="text-2xl font-bold text-blue-900 mt-1">{stats.total}</p>
            </div>
            <Users className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4 border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-900 mt-1">{stats.pending}</p>
            </div>
            <Clock className="h-8 w-8 text-yellow-600" />
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

        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4 border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-600">Rejected</p>
              <p className="text-2xl font-bold text-red-900 mt-1">{stats.rejected}</p>
            </div>
            <XCircle className="h-8 w-8 text-red-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">Avg Score</p>
              <p className="text-2xl font-bold text-purple-900 mt-1">{stats.avgEligibilityScore}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex gap-2">
          {['all', 'pending', 'approved', 'on_hold', 'rejected'].map(status => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                selectedStatus === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status === 'all' ? 'All Requests' : status.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Rehire Requests Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Candidate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Previous Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Proposed Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Eligibility
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
              {filteredCandidates.map(candidate => (
                <tr key={candidate.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-semibold text-gray-900">{candidate.name}</div>
                      <div className="text-sm text-gray-600">{candidate.employeeCode}</div>
                      <div className="text-xs text-gray-500">Exit: {candidate.exitDate}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{candidate.previousDesignation}</div>
                      <div className="text-xs text-gray-600">{candidate.department}</div>
                      <div className="text-xs text-gray-500">Tenure: {candidate.tenure}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{candidate.proposedDesignation}</div>
                      <div className="text-xs text-gray-600">{candidate.proposedDepartment}</div>
                      <div className="text-xs text-gray-900 font-semibold">
                        ₹{(candidate.proposedCTC / 100000).toFixed(1)}L
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className={`text-2xl font-bold ${getEligibilityColor(candidate.eligibilityScore)}`}>
                        {candidate.eligibilityScore}
                      </div>
                      <div className="text-xs text-gray-600">{candidate.performanceRating}</div>
                      <div className="flex gap-1 mt-1">
                        {candidate.noticePeriodServed && (
                          <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded">
                            Notice Served
                          </span>
                        )}
                        {candidate.pendingDues && (
                          <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded">
                            Dues Pending
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusColors[candidate.status]}`}>
                      {candidate.status.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-blue-600 hover:text-blue-800 font-medium text-sm">
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredCandidates.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200 mt-6">
          <UserPlus className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No rehire requests found</h3>
          <p className="text-gray-600">No requests match the selected filter</p>
        </div>
      )}

      {/* Eligibility Criteria Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-semibold text-blue-900 mb-2">Rehire Eligibility Criteria</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Minimum eligibility score: 70/100</li>
              <li>• Notice period must be served (full/buyout)</li>
              <li>• No pending dues or clearances</li>
              <li>• Performance rating: Good or above</li>
              <li>• Background verification clearance required</li>
              <li>• Cooling period: Minimum 6 months from exit date</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

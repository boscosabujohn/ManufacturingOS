'use client';

import { useState } from 'react';
import { CheckCircle, Users, Clock, XCircle, FileText, Calendar } from 'lucide-react';

interface ConfirmationRequest {
  id: string;
  employeeCode: string;
  name: string;
  designation: string;
  department: string;
  joiningDate: string;
  probationEndDate: string;
  reviewScore: number;
  attendance: number;
  recommendation: 'confirm' | 'extend' | 'terminate';
  recommender: string;
  status: 'pending' | 'approved' | 'rejected';
  confirmationDate?: string;
  remarks?: string;
}

export default function Page() {
  const [selectedStatus, setSelectedStatus] = useState('all');

  const mockRequests: ConfirmationRequest[] = [
    {
      id: '1',
      employeeCode: 'EMP567',
      name: 'Arjun Nair',
      designation: 'Production Engineer',
      department: 'Production',
      joiningDate: '2025-04-15',
      probationEndDate: '2025-10-15',
      reviewScore: 85,
      attendance: 98,
      recommendation: 'confirm',
      recommender: 'Suresh Iyer',
      status: 'pending'
    },
    {
      id: '2',
      employeeCode: 'EMP578',
      name: 'Priyanka Joshi',
      designation: 'HR Executive',
      department: 'Human Resources',
      joiningDate: '2025-06-01',
      probationEndDate: '2025-09-01',
      reviewScore: 92,
      attendance: 100,
      recommendation: 'confirm',
      recommender: 'Kavita Sharma',
      status: 'approved',
      confirmationDate: '2025-09-01',
      remarks: 'Excellent performance. Confirmed.'
    },
    {
      id: '3',
      employeeCode: 'EMP612',
      name: 'Aditya Sharma',
      designation: 'IT Support Engineer',
      department: 'Information Technology',
      joiningDate: '2025-05-01',
      probationEndDate: '2025-11-01',
      reviewScore: 68,
      attendance: 92,
      recommendation: 'extend',
      recommender: 'Vikram Singh',
      status: 'pending',
      remarks: 'Performance needs improvement. Extend by 3 months.'
    }
  ];

  const filteredRequests = mockRequests.filter(r =>
    selectedStatus === 'all' || r.status === selectedStatus
  );

  const stats = {
    total: mockRequests.length,
    pending: mockRequests.filter(r => r.status === 'pending').length,
    approved: mockRequests.filter(r => r.status === 'approved').length,
    rejected: mockRequests.filter(r => r.status === 'rejected').length
  };

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-700',
    approved: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700'
  };

  const recommendationColors = {
    confirm: 'bg-green-100 text-green-700',
    extend: 'bg-orange-100 text-orange-700',
    terminate: 'bg-red-100 text-red-700'
  };

  return (
    <div className="w-full h-full px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Confirmation Process</h1>
        <p className="text-sm text-gray-600 mt-1">Process probation confirmation requests</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
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
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex gap-2">
          {['all', 'pending', 'approved', 'rejected'].map(status => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-4 py-2 rounded-lg font-medium text-sm ${
                selectedStatus === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredRequests.map(request => (
          <div key={request.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">{request.name}</h3>
                <p className="text-sm text-gray-600">{request.designation} • {request.employeeCode}</p>
              </div>
              <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusColors[request.status]}`}>
                {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
              </span>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Department:</span>
                <span className="font-semibold text-gray-900">{request.department}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Probation End:</span>
                <span className="font-semibold text-gray-900">{request.probationEndDate}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Review Score:</span>
                <span className="font-semibold text-green-600">{request.reviewScore}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Attendance:</span>
                <span className="font-semibold text-blue-600">{request.attendance}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Recommendation:</span>
                <span className={`px-2 py-0.5 text-xs font-semibold rounded ${recommendationColors[request.recommendation]}`}>
                  {request.recommendation.charAt(0).toUpperCase() + request.recommendation.slice(1)}
                </span>
              </div>
            </div>

            {request.remarks && (
              <div className="bg-gray-50 rounded p-3 mb-4">
                <p className="text-xs text-gray-500 uppercase font-medium mb-1">Remarks</p>
                <p className="text-sm text-gray-700">{request.remarks}</p>
              </div>
            )}

            {request.status === 'pending' && (
              <div className="flex gap-2">
                <button className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium text-sm">
                  Approve
                </button>
                <button className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium text-sm">
                  Reject
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

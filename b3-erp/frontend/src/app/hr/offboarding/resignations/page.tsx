'use client';

import { useState, useMemo } from 'react';
import { LogOut, Plus, Calendar, User, FileText } from 'lucide-react';

interface ResignationRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  designation: string;
  department: string;
  joiningDate: string;
  resignationDate: string;
  lastWorkingDay: string;
  noticePeriod: number;
  reason: string;
  status: 'submitted' | 'under-review' | 'accepted' | 'rejected' | 'withdrawn';
  submittedOn: string;
  reviewedBy?: string;
  reviewedOn?: string;
  remarks?: string;
}

export default function ResignationsPage() {
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('all');

  const mockResignations: ResignationRequest[] = [
    {
      id: 'RES001',
      employeeId: 'EMP001',
      employeeName: 'Rahul Sharma',
      designation: 'Senior Software Engineer',
      department: 'Engineering',
      joiningDate: '2020-03-15',
      resignationDate: '2025-10-15',
      lastWorkingDay: '2025-12-14',
      noticePeriod: 60,
      reason: 'Higher Education',
      status: 'accepted',
      submittedOn: '2025-10-15',
      reviewedBy: 'Rajesh Kumar',
      reviewedOn: '2025-10-18',
      remarks: 'Best wishes for future endeavors'
    },
    {
      id: 'RES002',
      employeeId: 'EMP002',
      employeeName: 'Priya Singh',
      designation: 'Marketing Manager',
      department: 'Marketing',
      joiningDate: '2019-06-20',
      resignationDate: '2025-10-20',
      lastWorkingDay: '2025-11-19',
      noticePeriod: 30,
      reason: 'Better Opportunity',
      status: 'under-review',
      submittedOn: '2025-10-20'
    },
    {
      id: 'RES003',
      employeeId: 'EMP003',
      employeeName: 'Amit Patel',
      designation: 'Finance Executive',
      department: 'Finance',
      joiningDate: '2021-01-10',
      resignationDate: '2025-10-25',
      lastWorkingDay: '2025-12-24',
      noticePeriod: 60,
      reason: 'Personal Reasons',
      status: 'submitted',
      submittedOn: '2025-10-25'
    }
  ];

  const filteredResignations = useMemo(() => {
    if (selectedStatus === 'all') return mockResignations;
    return mockResignations.filter(r => r.status === selectedStatus);
  }, [selectedStatus]);

  const stats = {
    total: mockResignations.length,
    submitted: mockResignations.filter(r => r.status === 'submitted').length,
    underReview: mockResignations.filter(r => r.status === 'under-review').length,
    accepted: mockResignations.filter(r => r.status === 'accepted').length,
    rejected: mockResignations.filter(r => r.status === 'rejected').length
  };

  const statusColors = {
    submitted: 'bg-blue-100 text-blue-700',
    'under-review': 'bg-yellow-100 text-yellow-700',
    accepted: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700',
    withdrawn: 'bg-gray-100 text-gray-700'
  };

  const calculateTenure = (joiningDate: string, resignationDate: string) => {
    const start = new Date(joiningDate);
    const end = new Date(resignationDate);
    const years = end.getFullYear() - start.getFullYear();
    const months = end.getMonth() - start.getMonth();
    const totalMonths = years * 12 + months;
    return `${Math.floor(totalMonths / 12)}y ${totalMonths % 12}m`;
  };

  return (
    <div className="w-full h-full px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Resignation Requests</h1>
          <p className="text-sm text-gray-600 mt-1">Manage employee resignation submissions</p>
        </div>
        <button
          onClick={() => setShowSubmitForm(!showSubmitForm)}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Submit Resignation
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Total</p>
              <p className="text-2xl font-bold text-blue-900 mt-1">{stats.total}</p>
            </div>
            <LogOut className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Submitted</p>
              <p className="text-2xl font-bold text-blue-900 mt-1">{stats.submitted}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4 border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-600">Under Review</p>
              <p className="text-2xl font-bold text-yellow-900 mt-1">{stats.underReview}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Accepted</p>
              <p className="text-2xl font-bold text-green-900 mt-1">{stats.accepted}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4 border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-600">Rejected</p>
              <p className="text-2xl font-bold text-red-900 mt-1">{stats.rejected}</p>
            </div>
          </div>
        </div>
      </div>

      {showSubmitForm && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Submit Resignation</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Resignation Date</label>
              <input
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Intended Last Working Day</label>
              <input
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Resignation</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Better Opportunity</option>
                <option>Higher Education</option>
                <option>Personal Reasons</option>
                <option>Health Issues</option>
                <option>Relocation</option>
                <option>Career Change</option>
                <option>Other</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Additional Comments</label>
              <textarea
                rows={4}
                placeholder="Please provide any additional details..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium">
              Submit Resignation
            </button>
            <button
              onClick={() => setShowSubmitForm(false)}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Status</label>
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="w-full md:w-64 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Statuses</option>
          <option value="submitted">Submitted</option>
          <option value="under-review">Under Review</option>
          <option value="accepted">Accepted</option>
          <option value="rejected">Rejected</option>
          <option value="withdrawn">Withdrawn</option>
        </select>
      </div>

      <div className="space-y-4">
        {filteredResignations.map(resignation => (
          <div key={resignation.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-bold text-gray-900">{resignation.employeeName}</h3>
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusColors[resignation.status]}`}>
                    {resignation.status.replace('-', ' ').toUpperCase()}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{resignation.designation} • {resignation.department}</p>
                <p className="text-xs text-gray-500 mt-1">Request ID: {resignation.id}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div>
                <p className="text-xs text-gray-500 uppercase font-medium mb-1">Resignation Date</p>
                <p className="text-sm font-semibold text-gray-900">
                  {new Date(resignation.resignationDate).toLocaleDateString('en-IN')}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-medium mb-1">Last Working Day</p>
                <p className="text-sm font-semibold text-gray-900">
                  {new Date(resignation.lastWorkingDay).toLocaleDateString('en-IN')}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-medium mb-1">Notice Period</p>
                <p className="text-sm font-semibold text-gray-900">{resignation.noticePeriod} days</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-medium mb-1">Tenure</p>
                <p className="text-sm font-semibold text-gray-900">
                  {calculateTenure(resignation.joiningDate, resignation.resignationDate)}
                </p>
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded p-3 mb-4">
              <p className="text-xs text-gray-500 uppercase font-medium mb-1">Reason</p>
              <p className="text-sm text-gray-900">{resignation.reason}</p>
            </div>

            {resignation.reviewedBy && (
              <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-4">
                <p className="text-xs text-blue-500 uppercase font-medium mb-1">Review Details</p>
                <p className="text-sm text-blue-900">
                  Reviewed by {resignation.reviewedBy} on {new Date(resignation.reviewedOn!).toLocaleDateString('en-IN')}
                </p>
                {resignation.remarks && <p className="text-sm text-blue-800 mt-1">{resignation.remarks}</p>}
              </div>
            )}

            <div className="flex gap-2 pt-4 border-t border-gray-200">
              {resignation.status === 'submitted' && (
                <>
                  <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium text-sm">
                    Accept
                  </button>
                  <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium text-sm">
                    Reject
                  </button>
                </>
              )}
              <button className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg font-medium text-sm">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

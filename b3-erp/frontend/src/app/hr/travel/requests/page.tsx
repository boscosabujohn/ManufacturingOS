'use client';

import { useState } from 'react';
import { Plane, MapPin, Calendar, IndianRupee, Users, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface TravelRequest {
  id: string;
  requestNumber: string;
  employeeCode: string;
  employeeName: string;
  department: string;
  designation: string;
  travelType: 'domestic' | 'international';
  purpose: string;
  fromLocation: string;
  toLocation: string;
  startDate: string;
  endDate: string;
  duration: number;
  estimatedCost: number;
  transportMode: 'flight' | 'train' | 'bus' | 'car' | 'multiple';
  accommodation: boolean;
  advanceRequired: boolean;
  advanceAmount?: number;
  status: 'draft' | 'pending' | 'approved' | 'rejected' | 'cancelled';
  submittedDate?: string;
  approver?: string;
  approvedDate?: string;
  rejectionReason?: string;
}

export default function Page() {
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);

  const mockRequests: TravelRequest[] = [
    {
      id: '1',
      requestNumber: 'TR-2025-001',
      employeeCode: 'EMP234',
      employeeName: 'Rajesh Kumar',
      department: 'Sales',
      designation: 'Regional Manager',
      travelType: 'domestic',
      purpose: 'Client Meeting - Tata Motors Pune Plant',
      fromLocation: 'Mumbai, Maharashtra',
      toLocation: 'Pune, Maharashtra',
      startDate: '2025-11-05',
      endDate: '2025-11-07',
      duration: 3,
      estimatedCost: 25000,
      transportMode: 'car',
      accommodation: true,
      advanceRequired: true,
      advanceAmount: 15000,
      status: 'pending',
      submittedDate: '2025-10-20',
      approver: 'Suresh Iyer'
    },
    {
      id: '2',
      requestNumber: 'TR-2025-002',
      employeeCode: 'EMP456',
      employeeName: 'Priya Sharma',
      department: 'Engineering',
      designation: 'Technical Lead',
      travelType: 'domestic',
      purpose: 'Technical Training - Siemens Bangalore',
      fromLocation: 'Pune, Maharashtra',
      toLocation: 'Bangalore, Karnataka',
      startDate: '2025-11-10',
      endDate: '2025-11-15',
      duration: 6,
      estimatedCost: 45000,
      transportMode: 'flight',
      accommodation: true,
      advanceRequired: true,
      advanceAmount: 30000,
      status: 'approved',
      submittedDate: '2025-10-18',
      approver: 'Madhav Singh',
      approvedDate: '2025-10-19'
    },
    {
      id: '3',
      requestNumber: 'TR-2025-003',
      employeeCode: 'EMP789',
      employeeName: 'Amit Patel',
      department: 'Quality',
      designation: 'Quality Manager',
      travelType: 'international',
      purpose: 'ISO Audit - Singapore Plant',
      fromLocation: 'Pune, Maharashtra',
      toLocation: 'Singapore',
      startDate: '2025-12-01',
      endDate: '2025-12-07',
      duration: 7,
      estimatedCost: 185000,
      transportMode: 'flight',
      accommodation: true,
      advanceRequired: true,
      advanceAmount: 100000,
      status: 'pending',
      submittedDate: '2025-10-22',
      approver: 'Kavita Sharma'
    },
    {
      id: '4',
      requestNumber: 'TR-2025-004',
      employeeCode: 'EMP567',
      employeeName: 'Sneha Reddy',
      department: 'Production',
      designation: 'Production Supervisor',
      travelType: 'domestic',
      purpose: 'Supplier Visit - Auto Components Ltd',
      fromLocation: 'Pune, Maharashtra',
      toLocation: 'Chennai, Tamil Nadu',
      startDate: '2025-11-01',
      endDate: '2025-11-03',
      duration: 3,
      estimatedCost: 35000,
      transportMode: 'flight',
      accommodation: true,
      advanceRequired: false,
      status: 'rejected',
      submittedDate: '2025-10-15',
      approver: 'Suresh Iyer',
      approvedDate: '2025-10-16',
      rejectionReason: 'Budget constraints. Please defer to next quarter.'
    }
  ];

  const filteredRequests = mockRequests.filter(r =>
    selectedStatus === 'all' || r.status === selectedStatus
  );

  const stats = {
    total: mockRequests.length,
    pending: mockRequests.filter(r => r.status === 'pending').length,
    approved: mockRequests.filter(r => r.status === 'approved').length,
    rejected: mockRequests.filter(r => r.status === 'rejected').length,
    totalBudget: mockRequests.filter(r => r.status !== 'rejected').reduce((sum, r) => sum + r.estimatedCost, 0)
  };

  const statusColors = {
    draft: 'bg-gray-100 text-gray-700',
    pending: 'bg-yellow-100 text-yellow-700',
    approved: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700',
    cancelled: 'bg-orange-100 text-orange-700'
  };

  return (
    <div className="w-full h-full px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Travel Requests</h1>
        <p className="text-sm text-gray-600 mt-1">Submit and track business travel requests</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Total Requests</p>
              <p className="text-2xl font-bold text-blue-900 mt-1">{stats.total}</p>
            </div>
            <Plane className="h-8 w-8 text-blue-600" />
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
              <p className="text-sm font-medium text-purple-600">Total Budget</p>
              <p className="text-2xl font-bold text-purple-900 mt-1">₹{(stats.totalBudget / 100000).toFixed(1)}L</p>
            </div>
            <IndianRupee className="h-8 w-8 text-purple-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex justify-between items-center">
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
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm"
          >
            New Request
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {filteredRequests.map(request => (
          <div key={request.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-bold text-gray-900">{request.requestNumber}</h3>
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusColors[request.status]}`}>
                    {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                  </span>
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                    request.travelType === 'domestic' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                  }`}>
                    {request.travelType.charAt(0).toUpperCase() + request.travelType.slice(1)}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{request.employeeName} • {request.designation} • {request.department}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-900">₹{request.estimatedCost.toLocaleString('en-IN')}</p>
                <p className="text-xs text-gray-500">{request.duration} days</p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <p className="text-xs text-gray-500 uppercase font-medium mb-2">Purpose</p>
              <p className="text-sm font-semibold text-gray-900">{request.purpose}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <p className="text-xs text-gray-500 uppercase font-medium mb-1">Route</p>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <div className="text-sm">
                    <p className="font-semibold text-gray-900">{request.fromLocation}</p>
                    <p className="text-gray-600">to {request.toLocation}</p>
                  </div>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-medium mb-1">Travel Dates</p>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <div className="text-sm">
                    <p className="font-semibold text-gray-900">{request.startDate}</p>
                    <p className="text-gray-600">to {request.endDate}</p>
                  </div>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-medium mb-1">Transport & Stay</p>
                <div className="text-sm">
                  <p className="font-semibold text-gray-900 capitalize">{request.transportMode}</p>
                  <p className="text-gray-600">{request.accommodation ? 'Accommodation: Yes' : 'No accommodation'}</p>
                </div>
              </div>
            </div>

            {request.advanceRequired && request.advanceAmount && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                <div className="flex items-center gap-2">
                  <IndianRupee className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-semibold text-blue-900">
                    Advance Required: ₹{request.advanceAmount.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            )}

            {request.rejectionReason && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-red-600 mt-0.5" />
                  <div>
                    <p className="text-xs text-red-600 uppercase font-medium mb-1">Rejection Reason</p>
                    <p className="text-sm text-red-900">{request.rejectionReason}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div className="text-sm text-gray-600">
                {request.submittedDate && (
                  <span>Submitted: {request.submittedDate}</span>
                )}
                {request.approver && (
                  <span className="ml-4">Approver: {request.approver}</span>
                )}
              </div>
              <button className="text-blue-600 hover:text-blue-800 font-medium text-sm">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredRequests.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
          <Plane className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No travel requests found</h3>
          <p className="text-gray-600">No requests match the selected filter</p>
        </div>
      )}
    </div>
  );
}

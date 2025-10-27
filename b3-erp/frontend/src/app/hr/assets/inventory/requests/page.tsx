'use client';

import { useState, useMemo } from 'react';
import { ShoppingBag, User, Calendar, Package, CheckCircle, Clock, XCircle } from 'lucide-react';

interface AssetRequest {
  id: string;
  requestId: string;
  requestDate: string;
  requester: string;
  employeeCode: string;
  department: string;
  assetType: 'laptop' | 'desktop' | 'mobile' | 'monitor' | 'furniture' | 'other';
  assetName: string;
  quantity: number;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  purpose: string;
  status: 'pending' | 'approved' | 'rejected' | 'fulfilled';
  approver?: string;
  approvalDate?: string;
  fulfillmentDate?: string;
  remarks?: string;
}

export default function Page() {
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  const mockRequests: AssetRequest[] = [
    {
      id: '1',
      requestId: 'REQ-2025-001',
      requestDate: '2025-10-20',
      requester: 'Rajesh Kumar',
      employeeCode: 'EMP345',
      department: 'Sales',
      assetType: 'laptop',
      assetName: 'Dell Latitude 5420',
      quantity: 1,
      priority: 'high',
      purpose: 'New joinee requirement',
      status: 'fulfilled',
      approver: 'IT Manager',
      approvalDate: '2025-10-21',
      fulfillmentDate: '2025-10-22'
    },
    {
      id: '2',
      requestId: 'REQ-2025-002',
      requestDate: '2025-10-22',
      requester: 'Priya Sharma',
      employeeCode: 'EMP412',
      department: 'Marketing',
      assetType: 'monitor',
      assetName: 'Dell 24" Monitor',
      quantity: 2,
      priority: 'medium',
      purpose: 'Dual monitor setup for design work',
      status: 'approved',
      approver: 'Admin Manager',
      approvalDate: '2025-10-23'
    },
    {
      id: '3',
      requestId: 'REQ-2025-003',
      requestDate: '2025-10-24',
      requester: 'Amit Patel',
      employeeCode: 'EMP287',
      department: 'Logistics',
      assetType: 'mobile',
      assetName: 'Samsung Galaxy S21',
      quantity: 1,
      priority: 'urgent',
      purpose: 'Field work - old phone damaged',
      status: 'pending'
    },
    {
      id: '4',
      requestId: 'REQ-2025-004',
      requestDate: '2025-10-23',
      requester: 'Sneha Reddy',
      employeeCode: 'EMP523',
      department: 'HR',
      assetType: 'furniture',
      assetName: 'Ergonomic Office Chair',
      quantity: 3,
      priority: 'low',
      purpose: 'New workstations setup',
      status: 'rejected',
      approver: 'Admin Manager',
      approvalDate: '2025-10-24',
      remarks: 'Budget constraints - defer to next quarter'
    },
    {
      id: '5',
      requestId: 'REQ-2025-005',
      requestDate: '2025-10-25',
      requester: 'Vikram Singh',
      employeeCode: 'EMP198',
      department: 'IT',
      assetType: 'desktop',
      assetName: 'HP Elite Desktop',
      quantity: 1,
      priority: 'high',
      purpose: 'Development workstation',
      status: 'pending'
    }
  ];

  const filteredRequests = mockRequests.filter(r => {
    const statusMatch = selectedStatus === 'all' || r.status === selectedStatus;
    const priorityMatch = selectedPriority === 'all' || r.priority === selectedPriority;
    const deptMatch = selectedDepartment === 'all' || r.department === selectedDepartment;
    return statusMatch && priorityMatch && deptMatch;
  });

  const stats = useMemo(() => ({
    total: mockRequests.length,
    pending: mockRequests.filter(r => r.status === 'pending').length,
    approved: mockRequests.filter(r => r.status === 'approved').length,
    fulfilled: mockRequests.filter(r => r.status === 'fulfilled').length
  }), [mockRequests]);

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-700',
    approved: 'bg-blue-100 text-blue-700',
    rejected: 'bg-red-100 text-red-700',
    fulfilled: 'bg-green-100 text-green-700'
  };

  const priorityColors = {
    low: 'bg-gray-100 text-gray-700',
    medium: 'bg-blue-100 text-blue-700',
    high: 'bg-orange-100 text-orange-700',
    urgent: 'bg-red-100 text-red-700'
  };

  return (
    <div className="w-full h-full px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Asset Requests</h1>
        <p className="text-sm text-gray-600 mt-1">Manage employee asset requests</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
          <p className="text-sm font-medium text-blue-600">Total Requests</p>
          <p className="text-2xl font-bold text-blue-900 mt-1">{stats.total}</p>
        </div>
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4 border border-yellow-200">
          <p className="text-sm font-medium text-yellow-600">Pending</p>
          <p className="text-2xl font-bold text-yellow-900 mt-1">{stats.pending}</p>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
          <p className="text-sm font-medium text-blue-600">Approved</p>
          <p className="text-2xl font-bold text-blue-900 mt-1">{stats.approved}</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
          <p className="text-sm font-medium text-green-600">Fulfilled</p>
          <p className="text-2xl font-bold text-green-900 mt-1">{stats.fulfilled}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="fulfilled">Fulfilled</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
            <select value={selectedPriority} onChange={(e) => setSelectedPriority(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="all">All Priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
            <select value={selectedDepartment} onChange={(e) => setSelectedDepartment(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="all">All Departments</option>
              <option value="Sales">Sales</option>
              <option value="IT">IT</option>
              <option value="HR">HR</option>
              <option value="Marketing">Marketing</option>
            </select>
          </div>
          <div className="flex items-end">
            <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm flex items-center justify-center gap-2">
              <ShoppingBag className="h-4 w-4" />
              New Request
            </button>
          </div>
        </div>
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        {filteredRequests.map(request => (
          <div key={request.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-12 w-12 bg-indigo-50 rounded-lg flex items-center justify-center">
                    <Package className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{request.assetName}</h3>
                    <p className="text-sm text-gray-600">Request ID: {request.requestId}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-1 text-xs font-semibold rounded ${priorityColors[request.priority]}`}>
                    {request.priority.charAt(0).toUpperCase() + request.priority.slice(1)} Priority
                  </span>
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusColors[request.status]}`}>
                    {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500 uppercase font-medium mb-1">Quantity</p>
                <p className="text-2xl font-bold text-gray-900">{request.quantity}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 py-4 border-y border-gray-200">
              <div>
                <p className="text-xs text-gray-500 uppercase font-medium mb-1">Requester</p>
                <p className="text-sm font-semibold text-gray-900 flex items-center gap-1">
                  <User className="h-4 w-4" />
                  {request.requester}
                </p>
                <p className="text-xs text-gray-600">{request.employeeCode} • {request.department}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-medium mb-1">Request Date</p>
                <p className="text-sm font-semibold text-gray-900 flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {new Date(request.requestDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-medium mb-1">Asset Type</p>
                <p className="text-sm font-semibold text-gray-900">{request.assetType.charAt(0).toUpperCase() + request.assetType.slice(1)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-medium mb-1">Purpose</p>
                <p className="text-sm text-gray-700">{request.purpose}</p>
              </div>
            </div>

            {(request.approver || request.remarks) && (
              <div className="bg-gray-50 rounded-lg p-3 mb-4">
                {request.approver && (
                  <div className="mb-2">
                    <p className="text-xs text-gray-500 uppercase font-medium mb-1">Approval Details</p>
                    <p className="text-sm text-gray-700">
                      Approved by: {request.approver} on {request.approvalDate && new Date(request.approvalDate).toLocaleDateString('en-IN')}
                    </p>
                    {request.fulfillmentDate && (
                      <p className="text-sm text-green-600">
                        Fulfilled on: {new Date(request.fulfillmentDate).toLocaleDateString('en-IN')}
                      </p>
                    )}
                  </div>
                )}
                {request.remarks && (
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-medium mb-1">Remarks</p>
                    <p className="text-sm text-gray-700">{request.remarks}</p>
                  </div>
                )}
              </div>
            )}

            <div className="flex gap-2">
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium text-sm">
                View Details
              </button>
              {request.status === 'pending' && (
                <>
                  <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium text-sm">
                    Approve
                  </button>
                  <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium text-sm">
                    Reject
                  </button>
                </>
              )}
              {request.status === 'approved' && (
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm">
                  Mark as Fulfilled
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

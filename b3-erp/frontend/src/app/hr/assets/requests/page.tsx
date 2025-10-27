'use client';

import { useState, useMemo } from 'react';
import { ShoppingCart, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface AssetRequest {
  id: string;
  requestId: string;
  requestedBy: string;
  employeeCode: string;
  department: string;
  designation: string;
  assetCategory: 'laptop' | 'desktop' | 'mobile' | 'tablet' | 'monitor' | 'printer' | 'furniture' | 'other';
  assetType: string;
  quantity: number;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'approved' | 'rejected' | 'fulfilled' | 'cancelled';
  requestDate: string;
  requiredBy: string;
  businessJustification: string;
  estimatedCost?: number;
  approvedBy?: string;
  approvalDate?: string;
  rejectionReason?: string;
  fulfilledDate?: string;
  assignedAssets?: string[];
}

export default function Page() {
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');

  const mockRequests: AssetRequest[] = [
    {
      id: '1',
      requestId: 'REQ-2024-001',
      requestedBy: 'Amit Sharma',
      employeeCode: 'EMP789',
      department: 'Sales',
      designation: 'Sales Executive',
      assetCategory: 'laptop',
      assetType: 'Dell Latitude 5430',
      quantity: 1,
      priority: 'high',
      status: 'pending',
      requestDate: '2024-10-20',
      requiredBy: '2024-10-30',
      businessJustification: 'Current laptop is 5 years old and experiencing frequent crashes. Need new laptop for client presentations and field work.',
      estimatedCost: 75000
    },
    {
      id: '2',
      requestId: 'REQ-2024-002',
      requestedBy: 'Priya Menon',
      employeeCode: 'EMP456',
      department: 'IT',
      designation: 'System Administrator',
      assetCategory: 'desktop',
      assetType: 'HP ProDesk 600 G6',
      quantity: 3,
      priority: 'urgent',
      status: 'approved',
      requestDate: '2024-10-18',
      requiredBy: '2024-10-25',
      businessJustification: 'New employees joining next week. Need desktops for their workstations.',
      estimatedCost: 180000,
      approvedBy: 'Rajesh Kumar (IT Manager)',
      approvalDate: '2024-10-19'
    },
    {
      id: '3',
      requestId: 'REQ-2024-003',
      requestedBy: 'Vikram Singh',
      employeeCode: 'EMP234',
      department: 'Marketing',
      designation: 'Marketing Manager',
      assetCategory: 'mobile',
      assetType: 'Samsung Galaxy S23',
      quantity: 2,
      priority: 'medium',
      status: 'fulfilled',
      requestDate: '2024-10-10',
      requiredBy: '2024-10-20',
      businessJustification: 'Marketing team needs mobile devices for social media content creation and client communication.',
      estimatedCost: 140000,
      approvedBy: 'Sunita Reddy (CMO)',
      approvalDate: '2024-10-12',
      fulfilledDate: '2024-10-15',
      assignedAssets: ['MOB-2024-045', 'MOB-2024-046']
    },
    {
      id: '4',
      requestId: 'REQ-2024-004',
      requestedBy: 'Neha Gupta',
      employeeCode: 'EMP567',
      department: 'Finance',
      designation: 'Financial Analyst',
      assetCategory: 'monitor',
      assetType: 'Dell UltraSharp 27" 4K Monitor',
      quantity: 2,
      priority: 'low',
      status: 'rejected',
      requestDate: '2024-10-15',
      requiredBy: '2024-11-01',
      businessJustification: 'Need dual monitor setup for better productivity while working on financial reports.',
      estimatedCost: 80000,
      rejectionReason: 'Budget constraints for Q4. Request can be resubmitted in Q1 2025.'
    },
    {
      id: '5',
      requestId: 'REQ-2024-005',
      requestedBy: 'Arjun Patel',
      employeeCode: 'EMP890',
      department: 'Operations',
      designation: 'Operations Lead',
      assetCategory: 'printer',
      assetType: 'Canon imageRUNNER 2625i',
      quantity: 1,
      priority: 'high',
      status: 'approved',
      requestDate: '2024-10-22',
      requiredBy: '2024-10-28',
      businessJustification: 'Operations floor needs a multifunction printer for printing production reports and shipping labels.',
      estimatedCost: 125000,
      approvedBy: 'Meera Krishnan (COO)',
      approvalDate: '2024-10-23'
    },
    {
      id: '6',
      requestId: 'REQ-2024-006',
      requestedBy: 'Sanjay Desai',
      employeeCode: 'EMP123',
      department: 'HR',
      designation: 'HR Executive',
      assetCategory: 'furniture',
      assetType: 'Ergonomic Office Chair',
      quantity: 5,
      priority: 'medium',
      status: 'fulfilled',
      requestDate: '2024-10-05',
      requiredBy: '2024-10-15',
      businessJustification: 'New joiners need ergonomic chairs to prevent workplace injuries.',
      estimatedCost: 75000,
      approvedBy: 'Kavita Sharma (HR Head)',
      approvalDate: '2024-10-06',
      fulfilledDate: '2024-10-12',
      assignedAssets: ['FUR-2024-089', 'FUR-2024-090', 'FUR-2024-091', 'FUR-2024-092', 'FUR-2024-093']
    }
  ];

  const filteredRequests = mockRequests.filter(r => {
    if (selectedStatus !== 'all' && r.status !== selectedStatus) return false;
    if (selectedDepartment !== 'all' && r.department !== selectedDepartment) return false;
    if (selectedPriority !== 'all' && r.priority !== selectedPriority) return false;
    return true;
  });

  const stats = useMemo(() => ({
    total: mockRequests.length,
    pending: mockRequests.filter(r => r.status === 'pending').length,
    approved: mockRequests.filter(r => r.status === 'approved').length,
    fulfilled: mockRequests.filter(r => r.status === 'fulfilled').length,
    rejected: mockRequests.filter(r => r.status === 'rejected').length
  }), [mockRequests]);

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-700',
    approved: 'bg-blue-100 text-blue-700',
    rejected: 'bg-red-100 text-red-700',
    fulfilled: 'bg-green-100 text-green-700',
    cancelled: 'bg-gray-100 text-gray-700'
  };

  const priorityColors = {
    low: 'bg-gray-100 text-gray-700',
    medium: 'bg-blue-100 text-blue-700',
    high: 'bg-orange-100 text-orange-700',
    urgent: 'bg-red-100 text-red-700'
  };

  const categoryColors = {
    laptop: 'bg-blue-100 text-blue-700',
    desktop: 'bg-purple-100 text-purple-700',
    mobile: 'bg-green-100 text-green-700',
    tablet: 'bg-teal-100 text-teal-700',
    monitor: 'bg-indigo-100 text-indigo-700',
    printer: 'bg-pink-100 text-pink-700',
    furniture: 'bg-orange-100 text-orange-700',
    other: 'bg-gray-100 text-gray-700'
  };

  return (
    <div className="w-full h-full px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Asset Requests</h1>
        <p className="text-sm text-gray-600 mt-1">Manage and track asset requests</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
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
        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4 border border-red-200">
          <p className="text-sm font-medium text-red-600">Rejected</p>
          <p className="text-2xl font-bold text-red-900 mt-1">{stats.rejected}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="fulfilled">Fulfilled</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
            <select value={selectedDepartment} onChange={(e) => setSelectedDepartment(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="all">All Departments</option>
              <option value="Sales">Sales</option>
              <option value="IT">IT</option>
              <option value="Marketing">Marketing</option>
              <option value="Finance">Finance</option>
              <option value="Operations">Operations</option>
              <option value="HR">HR</option>
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
          <div className="flex items-end">
            <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm">
              New Request
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {filteredRequests.map(request => (
          <div key={request.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-12 w-12 bg-blue-50 rounded-lg flex items-center justify-center">
                    <ShoppingCart className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{request.assetType}</h3>
                    <p className="text-sm text-gray-600">{request.requestId} • {request.requestedBy} ({request.employeeCode})</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`px-2 py-1 text-xs font-semibold rounded ${categoryColors[request.assetCategory]}`}>
                    {request.assetCategory.charAt(0).toUpperCase() + request.assetCategory.slice(1)}
                  </span>
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusColors[request.status]}`}>
                    {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                  </span>
                  <span className={`px-2 py-1 text-xs font-semibold rounded ${priorityColors[request.priority]}`}>
                    {request.priority.charAt(0).toUpperCase() + request.priority.slice(1)} Priority
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500 uppercase font-medium mb-1">Estimated Cost</p>
                <p className="text-2xl font-bold text-blue-600">₹{request.estimatedCost?.toLocaleString('en-IN')}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 py-4 border-y border-gray-200">
              <div>
                <p className="text-xs text-gray-500 uppercase font-medium mb-1">Department</p>
                <p className="text-sm font-semibold text-gray-900">{request.department}</p>
                <p className="text-xs text-gray-600">{request.designation}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-medium mb-1">Quantity</p>
                <p className="text-sm font-semibold text-gray-900">{request.quantity} {request.quantity > 1 ? 'units' : 'unit'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-medium mb-1">Request Date</p>
                <p className="text-sm font-semibold text-gray-900 flex items-center gap-1">
                  <Clock className="h-4 w-4 text-gray-500" />
                  {new Date(request.requestDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-medium mb-1">Required By</p>
                <p className="text-sm font-semibold text-gray-900">
                  {new Date(request.requiredBy).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <p className="text-xs text-gray-500 uppercase font-medium mb-2">Business Justification</p>
              <p className="text-sm text-gray-700">{request.businessJustification}</p>
            </div>

            {request.status === 'approved' && request.approvedBy && (
              <div className="bg-blue-50 rounded-lg p-3 mb-4 border border-blue-200">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle className="h-4 w-4 text-blue-600" />
                  <p className="text-xs text-blue-700 uppercase font-medium">Approved</p>
                </div>
                <p className="text-sm text-blue-900">
                  Approved by {request.approvedBy} on {new Date(request.approvalDate!).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
              </div>
            )}

            {request.status === 'fulfilled' && request.fulfilledDate && (
              <div className="bg-green-50 rounded-lg p-3 mb-4 border border-green-200">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <p className="text-xs text-green-700 uppercase font-medium">Fulfilled</p>
                </div>
                <p className="text-sm text-green-900 mb-2">
                  Fulfilled on {new Date(request.fulfilledDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
                {request.assignedAssets && request.assignedAssets.length > 0 && (
                  <div>
                    <p className="text-xs text-green-600 uppercase font-medium mb-1">Assigned Assets</p>
                    <div className="flex flex-wrap gap-2">
                      {request.assignedAssets.map((asset, idx) => (
                        <span key={idx} className="px-2 py-1 bg-white text-green-700 text-xs font-semibold rounded border border-green-300">
                          {asset}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {request.status === 'rejected' && request.rejectionReason && (
              <div className="bg-red-50 rounded-lg p-3 mb-4 border border-red-200">
                <div className="flex items-center gap-2 mb-1">
                  <XCircle className="h-4 w-4 text-red-600" />
                  <p className="text-xs text-red-700 uppercase font-medium">Rejected</p>
                </div>
                <p className="text-sm text-red-900">{request.rejectionReason}</p>
              </div>
            )}

            {request.status === 'pending' && request.priority === 'urgent' && (
              <div className="bg-red-50 rounded-lg p-3 mb-4 border border-red-200">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <p className="text-xs text-red-700 uppercase font-medium">Urgent - Awaiting Approval</p>
                </div>
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

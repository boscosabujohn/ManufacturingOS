'use client';

import { useState, useMemo } from 'react';
import { Wrench, User, Clock, AlertCircle } from 'lucide-react';

interface MaintenanceRequest {
  id: string;
  requestId: string;
  assetTag: string;
  assetName: string;
  assetCategory: 'laptop' | 'desktop' | 'mobile' | 'monitor' | 'printer' | 'server' | 'network' | 'other';
  requestedBy: string;
  employeeCode: string;
  department: string;
  issueType: 'hardware_failure' | 'software_issue' | 'performance' | 'peripheral' | 'network' | 'other';
  issueDescription: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  requestDate: string;
  expectedDate?: string;
  status: 'pending' | 'approved' | 'in_progress' | 'completed' | 'rejected' | 'on_hold';
  assignedTo?: string;
  approvedBy?: string;
  approvalDate?: string;
  estimatedCost?: number;
  location: string;
  contactNumber: string;
  attachments?: number;
  remarks?: string;
}

export default function Page() {
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const mockRequests: MaintenanceRequest[] = [
    {
      id: '1',
      requestId: 'MR-2024-1267',
      assetTag: 'LAP-2024-015',
      assetName: 'Dell Latitude 5420',
      assetCategory: 'laptop',
      requestedBy: 'Rajesh Kumar',
      employeeCode: 'EMP345',
      department: 'Sales',
      issueType: 'hardware_failure',
      issueDescription: 'Laptop battery not charging. Shows "plugged in, not charging" error. Battery health at 15%.',
      priority: 'high',
      requestDate: '2024-10-24',
      expectedDate: '2024-10-27',
      status: 'approved',
      assignedTo: 'Dell Service Center',
      approvedBy: 'IT Manager - Vikram Singh',
      approvalDate: '2024-10-24',
      estimatedCost: 5500,
      location: 'Mumbai Office',
      contactNumber: '+91-98765-43210',
      attachments: 2,
      remarks: 'Urgent - employee traveling next week'
    },
    {
      id: '2',
      requestId: 'MR-2024-1268',
      assetTag: 'PRN-2023-045',
      assetName: 'Canon imageRUNNER 2525i',
      assetCategory: 'printer',
      requestedBy: 'Priya Sharma',
      employeeCode: 'EMP412',
      department: 'Marketing',
      issueType: 'hardware_failure',
      issueDescription: 'Printer showing paper jam error even after clearing. Print quality deteriorating with streaks on output.',
      priority: 'medium',
      requestDate: '2024-10-25',
      status: 'in_progress',
      assignedTo: 'Canon Service Engineer',
      approvedBy: 'IT Manager - Vikram Singh',
      approvalDate: '2024-10-25',
      estimatedCost: 3500,
      location: 'Bangalore Office',
      contactNumber: '+91-99887-65432',
      attachments: 1
    },
    {
      id: '3',
      requestId: 'MR-2024-1269',
      assetTag: 'DESK-2024-008',
      assetName: 'HP Elite 800 G8',
      assetCategory: 'desktop',
      requestedBy: 'Sneha Reddy',
      employeeCode: 'EMP523',
      department: 'HR',
      issueType: 'performance',
      issueDescription: 'Computer running very slow. Applications taking long time to open. Frequent system freezes.',
      priority: 'low',
      requestDate: '2024-10-26',
      status: 'pending',
      location: 'Hyderabad Office',
      contactNumber: '+91-97654-32109',
      remarks: 'May need RAM upgrade'
    },
    {
      id: '4',
      requestId: 'MR-2024-1265',
      assetTag: 'MOB-2024-003',
      assetName: 'Samsung Galaxy S21',
      assetCategory: 'mobile',
      requestedBy: 'Arjun Kapoor',
      employeeCode: 'EMP890',
      department: 'Sales',
      issueType: 'hardware_failure',
      issueDescription: 'Screen cracked after accidental drop. Touch response partially working.',
      priority: 'critical',
      requestDate: '2024-10-23',
      expectedDate: '2024-10-24',
      status: 'completed',
      assignedTo: 'Samsung Service Center',
      approvedBy: 'IT Manager - Vikram Singh',
      approvalDate: '2024-10-23',
      estimatedCost: 12000,
      location: 'Delhi Office',
      contactNumber: '+91-96543-21098',
      attachments: 3,
      remarks: 'Accidental damage - employee to bear 50% cost'
    },
    {
      id: '5',
      requestId: 'MR-2024-1270',
      assetTag: 'NET-2024-012',
      assetName: 'Cisco Catalyst 9300 Switch',
      assetCategory: 'network',
      requestedBy: 'Network Team',
      employeeCode: 'EMP156',
      department: 'IT',
      issueType: 'network',
      issueDescription: 'Intermittent network connectivity issues in building B. Multiple ports showing errors.',
      priority: 'critical',
      requestDate: '2024-10-26',
      expectedDate: '2024-10-26',
      status: 'approved',
      assignedTo: 'Cisco TAC Support',
      approvedBy: 'CTO - Ramesh Iyer',
      approvalDate: '2024-10-26',
      location: 'Pune Office - Building B',
      contactNumber: '+91-95432-10987',
      remarks: 'Affecting 50+ users - immediate attention required'
    },
    {
      id: '6',
      requestId: 'MR-2024-1266',
      assetTag: 'LAP-2023-089',
      assetName: 'Lenovo ThinkPad X1',
      assetCategory: 'laptop',
      requestedBy: 'Kavita Mehta',
      employeeCode: 'EMP234',
      department: 'Finance',
      issueType: 'software_issue',
      issueDescription: 'Microsoft Office not activating. Error code 0xC004F074. Need urgent resolution for month-end reporting.',
      priority: 'high',
      requestDate: '2024-10-25',
      status: 'rejected',
      approvedBy: 'IT Manager - Vikram Singh',
      approvalDate: '2024-10-25',
      location: 'Mumbai Office',
      contactNumber: '+91-94321-09876',
      remarks: 'Software issue - to be handled by IT helpdesk, not maintenance'
    }
  ];

  const filteredRequests = mockRequests.filter(r => {
    if (selectedStatus !== 'all' && r.status !== selectedStatus) return false;
    if (selectedPriority !== 'all' && r.priority !== selectedPriority) return false;
    if (selectedCategory !== 'all' && r.assetCategory !== selectedCategory) return false;
    return true;
  });

  const stats = useMemo(() => ({
    total: mockRequests.length,
    pending: mockRequests.filter(r => r.status === 'pending').length,
    inProgress: mockRequests.filter(r => r.status === 'in_progress').length,
    critical: mockRequests.filter(r => r.priority === 'critical' && (r.status === 'pending' || r.status === 'approved' || r.status === 'in_progress')).length,
    completed: mockRequests.filter(r => r.status === 'completed').length
  }), [mockRequests]);

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-700',
    approved: 'bg-blue-100 text-blue-700',
    in_progress: 'bg-purple-100 text-purple-700',
    completed: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700',
    on_hold: 'bg-gray-100 text-gray-700'
  };

  const priorityColors = {
    low: 'bg-gray-100 text-gray-700',
    medium: 'bg-blue-100 text-blue-700',
    high: 'bg-orange-100 text-orange-700',
    critical: 'bg-red-100 text-red-700'
  };

  const categoryColors = {
    laptop: 'bg-blue-100 text-blue-700',
    desktop: 'bg-purple-100 text-purple-700',
    mobile: 'bg-green-100 text-green-700',
    monitor: 'bg-orange-100 text-orange-700',
    printer: 'bg-pink-100 text-pink-700',
    server: 'bg-red-100 text-red-700',
    network: 'bg-indigo-100 text-indigo-700',
    other: 'bg-gray-100 text-gray-700'
  };

  const issueTypeLabel = {
    hardware_failure: 'Hardware Failure',
    software_issue: 'Software Issue',
    performance: 'Performance Issue',
    peripheral: 'Peripheral Issue',
    network: 'Network Issue',
    other: 'Other'
  };

  const statusLabel = {
    pending: 'Pending',
    approved: 'Approved',
    in_progress: 'In Progress',
    completed: 'Completed',
    rejected: 'Rejected',
    on_hold: 'On Hold'
  };

  return (
    <div className="w-full h-full px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Maintenance Requests</h1>
        <p className="text-sm text-gray-600 mt-1">Raise and track asset maintenance requests</p>
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
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
          <p className="text-sm font-medium text-purple-600">In Progress</p>
          <p className="text-2xl font-bold text-purple-900 mt-1">{stats.inProgress}</p>
        </div>
        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4 border border-red-200">
          <p className="text-sm font-medium text-red-600">Critical</p>
          <p className="text-2xl font-bold text-red-900 mt-1">{stats.critical}</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
          <p className="text-sm font-medium text-green-600">Completed</p>
          <p className="text-2xl font-bold text-green-900 mt-1">{stats.completed}</p>
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
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
            <select value={selectedPriority} onChange={(e) => setSelectedPriority(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="all">All Priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Asset Category</label>
            <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="all">All Categories</option>
              <option value="laptop">Laptop</option>
              <option value="desktop">Desktop</option>
              <option value="mobile">Mobile</option>
              <option value="printer">Printer</option>
              <option value="server">Server</option>
              <option value="network">Network</option>
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
                  <div className="h-12 w-12 bg-orange-50 rounded-lg flex items-center justify-center">
                    <Wrench className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{request.assetName}</h3>
                    <p className="text-sm text-gray-600">Request: {request.requestId} • Asset: {request.assetTag}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`px-2 py-1 text-xs font-semibold rounded ${categoryColors[request.assetCategory]}`}>
                    {request.assetCategory.charAt(0).toUpperCase() + request.assetCategory.slice(1)}
                  </span>
                  <span className={`px-2 py-1 text-xs font-semibold rounded ${priorityColors[request.priority]}`}>
                    {request.priority.charAt(0).toUpperCase() + request.priority.slice(1)} Priority
                  </span>
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusColors[request.status]}`}>
                    {statusLabel[request.status]}
                  </span>
                  {request.priority === 'critical' && (request.status === 'pending' || request.status === 'approved') && (
                    <span className="px-2 py-1 text-xs font-semibold rounded bg-red-50 text-red-700 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      Urgent Attention Required
                    </span>
                  )}
                </div>
              </div>
              {request.estimatedCost && (
                <div className="text-right">
                  <p className="text-xs text-gray-500 uppercase font-medium mb-1">Estimated Cost</p>
                  <p className="text-2xl font-bold text-blue-600">₹{request.estimatedCost.toLocaleString('en-IN')}</p>
                </div>
              )}
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <p className="text-xs text-gray-500 uppercase font-medium mb-1">Issue Type</p>
              <p className="text-sm font-semibold text-gray-900 mb-2">{issueTypeLabel[request.issueType]}</p>
              <p className="text-xs text-gray-500 uppercase font-medium mb-1">Description</p>
              <p className="text-sm text-gray-700">{request.issueDescription}</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 py-4 border-y border-gray-200">
              <div>
                <p className="text-xs text-gray-500 uppercase font-medium mb-1">Requested By</p>
                <p className="text-sm font-semibold text-gray-900 flex items-center gap-1">
                  <User className="h-4 w-4 text-gray-500" />
                  {request.requestedBy}
                </p>
                <p className="text-xs text-gray-600">{request.employeeCode} • {request.department}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-medium mb-1">Request Date</p>
                <p className="text-sm font-semibold text-gray-900 flex items-center gap-1">
                  <Clock className="h-4 w-4 text-gray-500" />
                  {new Date(request.requestDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-medium mb-1">Location</p>
                <p className="text-sm font-semibold text-gray-900">{request.location}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-medium mb-1">Contact</p>
                <p className="text-sm font-semibold text-gray-900">{request.contactNumber}</p>
              </div>
            </div>

            {request.assignedTo && (
              <div className="bg-blue-50 rounded-lg p-3 mb-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-blue-600 uppercase font-medium mb-1">Assigned To</p>
                    <p className="text-sm font-semibold text-blue-900">{request.assignedTo}</p>
                  </div>
                  {request.approvedBy && (
                    <div>
                      <p className="text-xs text-blue-600 uppercase font-medium mb-1">Approved By</p>
                      <p className="text-sm font-semibold text-blue-900">{request.approvedBy}</p>
                      <p className="text-xs text-blue-700">{request.approvalDate && new Date(request.approvalDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {request.remarks && (
              <div className={`rounded-lg p-3 mb-4 ${request.status === 'rejected' ? 'bg-red-50 border border-red-200' : 'bg-yellow-50 border border-yellow-200'}`}>
                <p className={`text-xs uppercase font-medium mb-1 flex items-center gap-1 ${request.status === 'rejected' ? 'text-red-700' : 'text-yellow-700'}`}>
                  <AlertCircle className="h-3 w-3" />
                  Remarks
                </p>
                <p className={`text-sm ${request.status === 'rejected' ? 'text-red-800' : 'text-yellow-800'}`}>{request.remarks}</p>
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                {request.attachments && (
                  <span>{request.attachments} attachment{request.attachments > 1 ? 's' : ''}</span>
                )}
              </div>
              <div className="flex gap-2">
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
                    Assign Technician
                  </button>
                )}
                {request.status === 'in_progress' && (
                  <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium text-sm">
                    Update Status
                  </button>
                )}
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium text-sm">
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

'use client';

import { useState, useMemo } from 'react';
import { Clock, Download, FileText, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface CertificateRequest {
  id: string;
  type: 'experience' | 'salary' | 'employment';
  purpose: string;
  requestDate: string;
  status: 'pending' | 'approved' | 'generated' | 'delivered' | 'rejected';
  approvedBy?: string;
  approvedOn?: string;
  generatedOn?: string;
  deliveredOn?: string;
  rejectedReason?: string;
  deliveryMode: 'email' | 'physical' | 'both';
}

export default function CertificateStatusPage() {
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const mockRequests: CertificateRequest[] = [
    {
      id: 'EXP001',
      type: 'experience',
      purpose: 'Higher Education - MBA Application',
      requestDate: '2025-10-15',
      status: 'delivered',
      approvedBy: 'HR Manager',
      approvedOn: '2025-10-16',
      generatedOn: '2025-10-16',
      deliveredOn: '2025-10-16',
      deliveryMode: 'email'
    },
    {
      id: 'SAL001',
      type: 'salary',
      purpose: 'Home Loan Application',
      requestDate: '2025-10-10',
      status: 'delivered',
      approvedBy: 'HR Manager',
      approvedOn: '2025-10-11',
      generatedOn: '2025-10-11',
      deliveredOn: '2025-10-11',
      deliveryMode: 'email'
    },
    {
      id: 'EMP001',
      type: 'employment',
      purpose: 'Rental Agreement',
      requestDate: '2025-10-12',
      status: 'delivered',
      approvedBy: 'HR Manager',
      approvedOn: '2025-10-13',
      generatedOn: '2025-10-13',
      deliveredOn: '2025-10-13',
      deliveryMode: 'email'
    },
    {
      id: 'EXP002',
      type: 'experience',
      purpose: 'Visa Application - Work Permit',
      requestDate: '2025-10-20',
      status: 'generated',
      approvedBy: 'HR Manager',
      approvedOn: '2025-10-21',
      generatedOn: '2025-10-21',
      deliveryMode: 'both'
    },
    {
      id: 'SAL002',
      type: 'salary',
      purpose: 'Credit Card Application',
      requestDate: '2025-10-18',
      status: 'generated',
      approvedBy: 'HR Manager',
      approvedOn: '2025-10-19',
      generatedOn: '2025-10-19',
      deliveryMode: 'physical'
    },
    {
      id: 'SAL003',
      type: 'salary',
      purpose: 'Visa Application',
      requestDate: '2025-10-24',
      status: 'approved',
      approvedBy: 'HR Manager',
      approvedOn: '2025-10-25',
      deliveryMode: 'both'
    },
    {
      id: 'EXP003',
      type: 'experience',
      purpose: 'Job Application',
      requestDate: '2025-10-25',
      status: 'pending',
      deliveryMode: 'email'
    },
    {
      id: 'EMP002',
      type: 'employment',
      purpose: 'Background Verification',
      requestDate: '2025-10-19',
      status: 'generated',
      approvedBy: 'HR Manager',
      approvedOn: '2025-10-20',
      generatedOn: '2025-10-20',
      deliveryMode: 'physical'
    }
  ];

  const filteredRequests = useMemo(() => {
    return mockRequests.filter(req => {
      const matchesType = selectedType === 'all' || req.type === selectedType;
      const matchesStatus = selectedStatus === 'all' || req.status === selectedStatus;
      return matchesType && matchesStatus;
    });
  }, [selectedType, selectedStatus]);

  const stats = {
    total: mockRequests.length,
    pending: mockRequests.filter(r => r.status === 'pending').length,
    approved: mockRequests.filter(r => r.status === 'approved').length,
    generated: mockRequests.filter(r => r.status === 'generated').length,
    delivered: mockRequests.filter(r => r.status === 'delivered').length
  };

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-700',
    approved: 'bg-blue-100 text-blue-700',
    generated: 'bg-green-100 text-green-700',
    delivered: 'bg-purple-100 text-purple-700',
    rejected: 'bg-red-100 text-red-700'
  };

  const typeLabels = {
    experience: 'Experience Certificate',
    salary: 'Salary Certificate',
    employment: 'Employment Certificate'
  };

  return (
    <div className="w-full h-full px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Certificate Request Status</h1>
        <p className="text-sm text-gray-600 mt-1">Track all your certificate requests</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Total Requests</p>
              <p className="text-2xl font-bold text-blue-900 mt-1">{stats.total}</p>
            </div>
            <FileText className="h-8 w-8 text-blue-600" />
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

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Approved</p>
              <p className="text-2xl font-bold text-blue-900 mt-1">{stats.approved}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Generated</p>
              <p className="text-2xl font-bold text-green-900 mt-1">{stats.generated}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">Delivered</p>
              <p className="text-2xl font-bold text-purple-900 mt-1">{stats.delivered}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Certificate Type</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Types</option>
              <option value="experience">Experience Certificate</option>
              <option value="salary">Salary Certificate</option>
              <option value="employment">Employment Certificate</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="generated">Generated</option>
              <option value="delivered">Delivered</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {filteredRequests.map(request => (
          <div key={request.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-bold text-gray-900">{typeLabels[request.type]}</h3>
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusColors[request.status]}`}>
                    {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                  </span>
                </div>
                <p className="text-sm text-gray-600">Request ID: {request.id} • {request.purpose}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div>
                <p className="text-xs text-gray-500 uppercase font-medium mb-1">Request Date</p>
                <p className="text-sm font-semibold text-gray-900">
                  {new Date(request.requestDate).toLocaleDateString('en-IN')}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-medium mb-1">Delivery Mode</p>
                <p className="text-sm font-semibold text-gray-900 capitalize">{request.deliveryMode}</p>
              </div>
              {request.approvedBy && (
                <div>
                  <p className="text-xs text-gray-500 uppercase font-medium mb-1">Approved By</p>
                  <p className="text-sm font-semibold text-gray-900">{request.approvedBy}</p>
                  <p className="text-xs text-gray-500">{new Date(request.approvedOn!).toLocaleDateString('en-IN')}</p>
                </div>
              )}
              {request.generatedOn && (
                <div>
                  <p className="text-xs text-gray-500 uppercase font-medium mb-1">Generated On</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {new Date(request.generatedOn).toLocaleDateString('en-IN')}
                  </p>
                </div>
              )}
            </div>

            {request.status === 'pending' && (
              <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mb-4">
                <div className="flex items-start gap-2">
                  <Clock className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-yellow-900">Pending Approval</p>
                    <p className="text-xs text-yellow-700 mt-1">Your request is being reviewed by HR department</p>
                  </div>
                </div>
              </div>
            )}

            {request.status === 'approved' && (
              <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-4">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-900">Approved - Being Generated</p>
                    <p className="text-xs text-blue-700 mt-1">Certificate is being prepared and will be ready soon</p>
                  </div>
                </div>
              </div>
            )}

            {request.status === 'generated' && (
              <div className="bg-green-50 border border-green-200 rounded p-3 mb-4">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-green-900">Certificate Generated</p>
                    <p className="text-xs text-green-700 mt-1">
                      {request.deliveryMode === 'email' && 'Certificate will be sent to your email'}
                      {request.deliveryMode === 'physical' && 'Collect physical copy from HR department'}
                      {request.deliveryMode === 'both' && 'Certificate will be emailed and physical copy is ready for collection'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {request.status === 'delivered' && (
              <div className="bg-purple-50 border border-purple-200 rounded p-3 mb-4">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-purple-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-purple-900">Delivered</p>
                    <p className="text-xs text-purple-700 mt-1">
                      Delivered on {new Date(request.deliveredOn!).toLocaleDateString('en-IN')}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {request.rejectedReason && (
              <div className="bg-red-50 border border-red-200 rounded p-3 mb-4">
                <div className="flex items-start gap-2">
                  <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-red-900">Request Rejected</p>
                    <p className="text-xs text-red-700 mt-1">{request.rejectedReason}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-2 pt-4 border-t border-gray-200">
              {(request.status === 'delivered' || request.status === 'generated') && (
                <button className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg font-medium text-sm">
                  <Download className="h-4 w-4" />
                  Download Certificate
                </button>
              )}
              {request.status === 'pending' && (
                <button className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg font-medium text-sm">
                  Cancel Request
                </button>
              )}
              <button className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg font-medium text-sm">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredRequests.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No requests found</h3>
          <p className="text-gray-600">No certificate requests match the selected filters</p>
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
        <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          Request Processing Timeline
        </h3>
        <ul className="text-sm text-blue-800 space-y-1 ml-7">
          <li>• <strong>Pending:</strong> Request submitted and awaiting HR approval (1-2 days)</li>
          <li>• <strong>Approved:</strong> Request approved and certificate being prepared (1 day)</li>
          <li>• <strong>Generated:</strong> Certificate ready for delivery</li>
          <li>• <strong>Delivered:</strong> Certificate sent via email or available for physical collection</li>
          <li>• Average processing time: 2-3 working days</li>
          <li>• For urgent requests, contact HR department at hr@company.com</li>
        </ul>
      </div>
    </div>
  );
}

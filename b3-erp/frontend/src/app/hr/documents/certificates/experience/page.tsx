'use client';

import { useState } from 'react';
import { Award, Plus, Calendar, FileText, AlertCircle } from 'lucide-react';

interface ExperienceCertificateRequest {
  id: string;
  requestDate: string;
  purpose: string;
  addressedTo: string;
  deliveryMode: 'email' | 'physical' | 'both';
  status: 'pending' | 'approved' | 'generated' | 'delivered';
  requestedBy: string;
  approvedBy?: string;
  approvedOn?: string;
  generatedOn?: string;
  deliveredOn?: string;
  remarks?: string;
}

export default function ExperienceCertificatePage() {
  const [showRequestForm, setShowRequestForm] = useState(false);

  const mockRequests: ExperienceCertificateRequest[] = [
    {
      id: 'EXP001',
      requestDate: '2025-10-15',
      purpose: 'Higher Education - MBA Application',
      addressedTo: 'To Whom It May Concern',
      deliveryMode: 'email',
      status: 'delivered',
      requestedBy: 'Rahul Sharma',
      approvedBy: 'HR Manager',
      approvedOn: '2025-10-16',
      generatedOn: '2025-10-16',
      deliveredOn: '2025-10-16'
    },
    {
      id: 'EXP002',
      requestDate: '2025-10-20',
      purpose: 'Visa Application - Work Permit',
      addressedTo: 'Embassy of Canada',
      deliveryMode: 'both',
      status: 'generated',
      requestedBy: 'Rahul Sharma',
      approvedBy: 'HR Manager',
      approvedOn: '2025-10-21',
      generatedOn: '2025-10-21'
    },
    {
      id: 'EXP003',
      requestDate: '2025-10-25',
      purpose: 'Job Application',
      addressedTo: 'To Whom It May Concern',
      deliveryMode: 'email',
      status: 'pending',
      requestedBy: 'Rahul Sharma'
    }
  ];

  const stats = {
    total: mockRequests.length,
    pending: mockRequests.filter(r => r.status === 'pending').length,
    approved: mockRequests.filter(r => r.status === 'approved').length,
    delivered: mockRequests.filter(r => r.status === 'delivered').length
  };

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-700',
    approved: 'bg-blue-100 text-blue-700',
    generated: 'bg-green-100 text-green-700',
    delivered: 'bg-purple-100 text-purple-700'
  };

  return (
    <div className="w-full h-full px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Experience Certificate</h1>
          <p className="text-sm text-gray-600 mt-1">Request experience certificate for various purposes</p>
        </div>
        <button
          onClick={() => setShowRequestForm(!showRequestForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          New Request
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Total Requests</p>
              <p className="text-2xl font-bold text-blue-900 mt-1">{stats.total}</p>
            </div>
            <Award className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4 border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-900 mt-1">{stats.pending}</p>
            </div>
            <Calendar className="h-8 w-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Approved</p>
              <p className="text-2xl font-bold text-green-900 mt-1">{stats.approved}</p>
            </div>
            <FileText className="h-8 w-8 text-green-600" />
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

      {showRequestForm && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">New Experience Certificate Request</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Purpose</label>
              <input
                type="text"
                placeholder="e.g., Visa Application, Higher Education"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Addressed To</label>
              <input
                type="text"
                placeholder="e.g., To Whom It May Concern, Embassy of..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Mode</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="email">Email Only</option>
                <option value="physical">Physical Copy Only</option>
                <option value="both">Both Email & Physical</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quantity (if physical)</label>
              <input
                type="number"
                min="1"
                max="5"
                defaultValue="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Additional Details (Optional)</label>
            <textarea
              rows={3}
              placeholder="Any specific requirements or details..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-2 mt-4">
            <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
              Submit Request
            </button>
            <button
              onClick={() => setShowRequestForm(false)}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {mockRequests.map(request => (
          <div key={request.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-bold text-gray-900">{request.purpose}</h3>
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusColors[request.status]}`}>
                    {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                  </span>
                </div>
                <p className="text-sm text-gray-600">Request ID: {request.id}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <p className="text-xs text-gray-500 uppercase font-medium mb-1">Request Date</p>
                <p className="text-sm font-semibold text-gray-900">
                  {new Date(request.requestDate).toLocaleDateString('en-IN')}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-medium mb-1">Addressed To</p>
                <p className="text-sm font-semibold text-gray-900">{request.addressedTo}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-medium mb-1">Delivery Mode</p>
                <p className="text-sm font-semibold text-gray-900 capitalize">{request.deliveryMode}</p>
              </div>
            </div>

            {request.approvedBy && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase font-medium mb-1">Approved By</p>
                  <p className="text-sm font-semibold text-gray-900">{request.approvedBy}</p>
                  <p className="text-xs text-gray-500">{new Date(request.approvedOn!).toLocaleDateString('en-IN')}</p>
                </div>
                {request.generatedOn && (
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-medium mb-1">Generated On</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {new Date(request.generatedOn).toLocaleDateString('en-IN')}
                    </p>
                  </div>
                )}
                {request.deliveredOn && (
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-medium mb-1">Delivered On</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {new Date(request.deliveredOn).toLocaleDateString('en-IN')}
                    </p>
                  </div>
                )}
              </div>
            )}

            {request.remarks && (
              <div className="bg-gray-50 border border-gray-200 rounded p-3 mb-4">
                <p className="text-xs text-gray-500 uppercase font-medium mb-1">Remarks</p>
                <p className="text-sm text-gray-700">{request.remarks}</p>
              </div>
            )}

            <div className="flex gap-2 pt-4 border-t border-gray-200">
              {request.status === 'delivered' && (
                <button className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg font-medium text-sm">
                  Download Certificate
                </button>
              )}
              {request.status === 'generated' && (
                <button className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg font-medium text-sm">
                  Download Certificate
                </button>
              )}
              {request.status === 'pending' && (
                <button className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg font-medium text-sm">
                  Cancel Request
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
        <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          Experience Certificate Guidelines
        </h3>
        <ul className="text-sm text-blue-800 space-y-1 ml-7">
          <li>• Experience certificates are typically processed within 3-5 working days</li>
          <li>• Certificates will include your designation, employment period, and responsibilities</li>
          <li>• For physical copies, collect from HR department during office hours</li>
          <li>• Email copies will be sent to your registered email address</li>
          <li>• Maximum 2 requests per month allowed</li>
          <li>• Certificates are issued on company letterhead with authorized signature</li>
          <li>• For urgent requests, please contact HR department directly</li>
        </ul>
      </div>
    </div>
  );
}

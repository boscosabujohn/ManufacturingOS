'use client';

import { useState, useMemo } from 'react';
import { History, Eye, Download, Upload, Edit, Trash2, FileText, AlertCircle } from 'lucide-react';

interface AuditLog {
  id: string;
  timestamp: string;
  action: 'upload' | 'view' | 'download' | 'edit' | 'delete' | 'verify' | 'reject';
  documentType: string;
  documentId: string;
  employeeId: string;
  employeeName: string;
  performedBy: string;
  performedByRole: string;
  ipAddress: string;
  remarks?: string;
}

export default function AuditTrailPage() {
  const [selectedAction, setSelectedAction] = useState('all');
  const [selectedDate, setSelectedDate] = useState('7days');

  const mockAuditLogs: AuditLog[] = [
    {
      id: 'AUD001',
      timestamp: '2025-10-27 14:32:15',
      action: 'upload',
      documentType: 'PAN Card',
      documentId: 'DOC12345',
      employeeId: 'EMP001',
      employeeName: 'Rahul Sharma',
      performedBy: 'Rahul Sharma',
      performedByRole: 'Employee',
      ipAddress: '192.168.1.45'
    },
    {
      id: 'AUD002',
      timestamp: '2025-10-27 14:15:22',
      action: 'verify',
      documentType: 'Degree Certificate',
      documentId: 'DOC12344',
      employeeId: 'EMP002',
      employeeName: 'Priya Singh',
      performedBy: 'Rajesh Kumar',
      performedByRole: 'HR Manager',
      ipAddress: '192.168.1.10',
      remarks: 'Document verified and approved'
    },
    {
      id: 'AUD003',
      timestamp: '2025-10-27 13:45:10',
      action: 'download',
      documentType: 'Salary Slip',
      documentId: 'DOC12343',
      employeeId: 'EMP003',
      employeeName: 'Amit Patel',
      performedBy: 'Amit Patel',
      performedByRole: 'Employee',
      ipAddress: '192.168.1.67'
    },
    {
      id: 'AUD004',
      timestamp: '2025-10-27 12:20:35',
      action: 'view',
      documentType: 'Employment Letter',
      documentId: 'DOC12342',
      employeeId: 'EMP004',
      employeeName: 'Sneha Reddy',
      performedBy: 'Rajesh Kumar',
      performedByRole: 'HR Manager',
      ipAddress: '192.168.1.10'
    },
    {
      id: 'AUD005',
      timestamp: '2025-10-27 11:55:48',
      action: 'edit',
      documentType: 'EPF Form 11',
      documentId: 'DOC12341',
      employeeId: 'EMP005',
      employeeName: 'Karthik Kumar',
      performedBy: 'Sneha Kulkarni',
      performedByRole: 'HR Executive',
      ipAddress: '192.168.1.12',
      remarks: 'Updated UAN number'
    },
    {
      id: 'AUD006',
      timestamp: '2025-10-27 10:30:12',
      action: 'reject',
      documentType: 'Passport',
      documentId: 'DOC12340',
      employeeId: 'EMP006',
      employeeName: 'Anjali Gupta',
      performedBy: 'Rajesh Kumar',
      performedByRole: 'HR Manager',
      ipAddress: '192.168.1.10',
      remarks: 'Document not clear, please reupload'
    },
    {
      id: 'AUD007',
      timestamp: '2025-10-26 16:45:33',
      action: 'delete',
      documentType: 'Duplicate Aadhaar',
      documentId: 'DOC12339',
      employeeId: 'EMP007',
      employeeName: 'Vikram Singh',
      performedBy: 'Rajesh Kumar',
      performedByRole: 'HR Manager',
      ipAddress: '192.168.1.10',
      remarks: 'Duplicate document removed'
    },
    {
      id: 'AUD008',
      timestamp: '2025-10-26 15:20:18',
      action: 'upload',
      documentType: 'Medical Certificate',
      documentId: 'DOC12338',
      employeeId: 'EMP008',
      employeeName: 'Meera Joshi',
      performedBy: 'Meera Joshi',
      performedByRole: 'Employee',
      ipAddress: '192.168.1.89'
    }
  ];

  const filteredLogs = useMemo(() => {
    const now = new Date();
    const filterDate = new Date();

    switch (selectedDate) {
      case '24hours':
        filterDate.setHours(now.getHours() - 24);
        break;
      case '7days':
        filterDate.setDate(now.getDate() - 7);
        break;
      case '30days':
        filterDate.setDate(now.getDate() - 30);
        break;
      case '90days':
        filterDate.setDate(now.getDate() - 90);
        break;
      default:
        filterDate.setFullYear(2000); // Show all
    }

    return mockAuditLogs.filter(log => {
      const matchesAction = selectedAction === 'all' || log.action === selectedAction;
      const logDate = new Date(log.timestamp);
      const matchesDate = logDate >= filterDate;
      return matchesAction && matchesDate;
    });
  }, [selectedAction, selectedDate]);

  const stats = {
    total: filteredLogs.length,
    uploads: filteredLogs.filter(l => l.action === 'upload').length,
    views: filteredLogs.filter(l => l.action === 'view').length,
    downloads: filteredLogs.filter(l => l.action === 'download').length,
    modifications: filteredLogs.filter(l => ['edit', 'delete', 'verify', 'reject'].includes(l.action)).length
  };

  const actionIcons = {
    upload: Upload,
    view: Eye,
    download: Download,
    edit: Edit,
    delete: Trash2,
    verify: FileText,
    reject: AlertCircle
  };

  const actionColors = {
    upload: 'bg-green-100 text-green-700',
    view: 'bg-blue-100 text-blue-700',
    download: 'bg-purple-100 text-purple-700',
    edit: 'bg-yellow-100 text-yellow-700',
    delete: 'bg-red-100 text-red-700',
    verify: 'bg-green-100 text-green-700',
    reject: 'bg-red-100 text-red-700'
  };

  const actionLabels = {
    upload: 'Upload',
    view: 'View',
    download: 'Download',
    edit: 'Edit',
    delete: 'Delete',
    verify: 'Verify',
    reject: 'Reject'
  };

  return (
    <div className="w-full h-full px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Document Audit Trail</h1>
        <p className="text-sm text-gray-600 mt-1">Complete audit log of all document activities</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Total Activities</p>
              <p className="text-2xl font-bold text-blue-900 mt-1">{stats.total}</p>
            </div>
            <History className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Uploads</p>
              <p className="text-2xl font-bold text-green-900 mt-1">{stats.uploads}</p>
            </div>
            <Upload className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Views</p>
              <p className="text-2xl font-bold text-blue-900 mt-1">{stats.views}</p>
            </div>
            <Eye className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">Downloads</p>
              <p className="text-2xl font-bold text-purple-900 mt-1">{stats.downloads}</p>
            </div>
            <Download className="h-8 w-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4 border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-600">Modifications</p>
              <p className="text-2xl font-bold text-yellow-900 mt-1">{stats.modifications}</p>
            </div>
            <Edit className="h-8 w-8 text-yellow-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Action Type</label>
            <select
              value={selectedAction}
              onChange={(e) => setSelectedAction(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Actions</option>
              <option value="upload">Upload</option>
              <option value="view">View</option>
              <option value="download">Download</option>
              <option value="edit">Edit</option>
              <option value="delete">Delete</option>
              <option value="verify">Verify</option>
              <option value="reject">Reject</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Time Period</label>
            <select
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="24hours">Last 24 Hours</option>
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="90days">Last 90 Days</option>
              <option value="all">All Time</option>
            </select>
          </div>
          <div className="flex items-end">
            <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
              Export Audit Log
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Document</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performed By</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IP Address</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredLogs.map(log => {
                const ActionIcon = actionIcons[log.action];
                return (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString('en-IN')}
                    </td>
                    <td className="px-4 py-3 text-sm whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <ActionIcon className="h-4 w-4" />
                        <span className={`px-2 py-1 text-xs font-semibold rounded ${actionColors[log.action]}`}>
                          {actionLabels[log.action]}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      <div>
                        <p className="font-medium">{log.documentType}</p>
                        <p className="text-xs text-gray-500">{log.documentId}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      <div>
                        <p className="font-medium">{log.employeeName}</p>
                        <p className="text-xs text-gray-500">{log.employeeId}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      <div>
                        <p className="font-medium">{log.performedBy}</p>
                        <p className="text-xs text-gray-500">{log.performedByRole}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap font-mono">
                      {log.ipAddress}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {log.remarks || '-'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {filteredLogs.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200 mt-4">
          <History className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No audit logs found</h3>
          <p className="text-gray-600">No activities match the selected filters</p>
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
        <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          Audit Trail Information
        </h3>
        <ul className="text-sm text-blue-800 space-y-1 ml-7">
          <li>• All document activities are logged with timestamp and user details</li>
          <li>• IP addresses are recorded for security and compliance purposes</li>
          <li>• Audit logs are retained for 7 years as per regulatory requirements</li>
          <li>• Logs are tamper-proof and cannot be modified or deleted</li>
          <li>• Export functionality available for compliance audits and reporting</li>
          <li>• Sensitive actions (delete, verify, reject) require additional authorization</li>
        </ul>
      </div>
    </div>
  );
}

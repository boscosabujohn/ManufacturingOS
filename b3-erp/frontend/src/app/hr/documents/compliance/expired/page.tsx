'use client';

import { useState, useMemo } from 'react';
import { XCircle, AlertTriangle, Upload, FileText } from 'lucide-react';

interface ExpiredDocument {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  documentType: string;
  category: 'personal' | 'education' | 'statutory';
  expiryDate: string;
  daysExpired: number;
  lastReminderSent?: string;
  uploadedOn: string;
  severity: 'critical' | 'high' | 'medium';
}

export default function ExpiredDocumentsPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSeverity, setSelectedSeverity] = useState('all');

  const mockExpiredDocs: ExpiredDocument[] = [
    {
      id: 'EXP001',
      employeeId: 'EMP001',
      employeeName: 'Rahul Sharma',
      department: 'Engineering',
      documentType: 'Passport',
      category: 'personal',
      expiryDate: '2025-08-15',
      daysExpired: 73,
      lastReminderSent: '2025-10-20',
      uploadedOn: '2024-01-10',
      severity: 'high'
    },
    {
      id: 'EXP002',
      employeeId: 'EMP002',
      employeeName: 'Priya Singh',
      department: 'HR',
      documentType: 'Medical Insurance',
      category: 'statutory',
      expiryDate: '2025-07-31',
      daysExpired: 88,
      lastReminderSent: '2025-10-15',
      uploadedOn: '2024-07-31',
      severity: 'critical'
    },
    {
      id: 'EXP003',
      employeeId: 'EMP003',
      employeeName: 'Amit Patel',
      department: 'Finance',
      documentType: 'Driving License',
      category: 'personal',
      expiryDate: '2025-09-10',
      daysExpired: 47,
      uploadedOn: '2023-09-10',
      severity: 'medium'
    },
    {
      id: 'EXP004',
      employeeId: 'EMP004',
      employeeName: 'Sneha Reddy',
      department: 'Marketing',
      documentType: 'Police Verification',
      category: 'statutory',
      expiryDate: '2025-06-20',
      daysExpired: 129,
      lastReminderSent: '2025-10-18',
      uploadedOn: '2024-06-20',
      severity: 'critical'
    },
    {
      id: 'EXP005',
      employeeId: 'EMP005',
      employeeName: 'Karthik Kumar',
      department: 'Sales',
      documentType: 'Professional Certification',
      category: 'education',
      expiryDate: '2025-09-30',
      daysExpired: 27,
      uploadedOn: '2022-09-30',
      severity: 'medium'
    }
  ];

  const filteredDocs = useMemo(() => {
    return mockExpiredDocs.filter(doc => {
      const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
      const matchesSeverity = selectedSeverity === 'all' || doc.severity === selectedSeverity;
      return matchesCategory && matchesSeverity;
    });
  }, [selectedCategory, selectedSeverity]);

  const stats = {
    total: mockExpiredDocs.length,
    critical: mockExpiredDocs.filter(d => d.severity === 'critical').length,
    high: mockExpiredDocs.filter(d => d.severity === 'high').length,
    medium: mockExpiredDocs.filter(d => d.severity === 'medium').length
  };

  const severityColors = {
    critical: 'bg-red-100 text-red-700',
    high: 'bg-orange-100 text-orange-700',
    medium: 'bg-yellow-100 text-yellow-700'
  };

  const categoryLabels = {
    personal: 'Personal',
    education: 'Education',
    statutory: 'Statutory'
  };

  return (
    <div className="w-full h-full px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Expired Documents</h1>
        <p className="text-sm text-gray-600 mt-1">Track and renew expired employee documents</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4 border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-600">Total Expired</p>
              <p className="text-2xl font-bold text-red-900 mt-1">{stats.total}</p>
            </div>
            <XCircle className="h-8 w-8 text-red-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4 border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-600">Critical</p>
              <p className="text-2xl font-bold text-red-900 mt-1">{stats.critical}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-600">High Severity</p>
              <p className="text-2xl font-bold text-orange-900 mt-1">{stats.high}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4 border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-600">Medium Severity</p>
              <p className="text-2xl font-bold text-yellow-900 mt-1">{stats.medium}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              <option value="personal">Personal Documents</option>
              <option value="education">Education Documents</option>
              <option value="statutory">Statutory Documents</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Severity</label>
            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Severities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
            </select>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {filteredDocs.map(doc => (
          <div key={doc.id} className="bg-white rounded-lg shadow-sm border-l-4 border-l-red-500 border-t border-r border-b border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-bold text-gray-900">{doc.documentType}</h3>
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${severityColors[doc.severity]}`}>
                    {doc.severity.toUpperCase()}
                  </span>
                  <span className="px-3 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-700">
                    {categoryLabels[doc.category]}
                  </span>
                </div>
                <p className="text-sm text-gray-600">Document ID: {doc.id}</p>
              </div>
            </div>

            <div className="bg-red-50 border border-red-200 rounded p-3 mb-4">
              <div className="flex items-start gap-2">
                <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-900">
                    Expired {doc.daysExpired} days ago on {new Date(doc.expiryDate).toLocaleDateString('en-IN')}
                  </p>
                  <p className="text-xs text-red-700 mt-1">
                    {doc.severity === 'critical' && 'URGENT: Immediate renewal required for compliance'}
                    {doc.severity === 'high' && 'High priority: Please renew at the earliest'}
                    {doc.severity === 'medium' && 'Please schedule renewal soon'}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div>
                <p className="text-xs text-gray-500 uppercase font-medium mb-1">Employee</p>
                <p className="text-sm font-semibold text-gray-900">{doc.employeeName}</p>
                <p className="text-xs text-gray-500">{doc.employeeId}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-medium mb-1">Department</p>
                <p className="text-sm font-semibold text-gray-900">{doc.department}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-medium mb-1">Originally Uploaded</p>
                <p className="text-sm font-semibold text-gray-900">
                  {new Date(doc.uploadedOn).toLocaleDateString('en-IN')}
                </p>
              </div>
              {doc.lastReminderSent && (
                <div>
                  <p className="text-xs text-gray-500 uppercase font-medium mb-1">Last Reminder</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {new Date(doc.lastReminderSent).toLocaleDateString('en-IN')}
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-2 pt-4 border-t border-gray-200">
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm">
                <Upload className="h-4 w-4" />
                Upload Renewed Document
              </button>
              <button className="px-4 py-2 text-orange-600 hover:bg-orange-50 rounded-lg font-medium text-sm">
                Send Renewal Reminder
              </button>
              <button className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg font-medium text-sm">
                View Old Document
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredDocs.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No expired documents</h3>
          <p className="text-gray-600">All documents are current and valid</p>
        </div>
      )}

      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-6">
        <h3 className="font-semibold text-red-900 mb-2 flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Expiry Severity Levels
        </h3>
        <ul className="text-sm text-red-800 space-y-1 ml-7">
          <li>• <strong>Critical:</strong> Expired 90+ days - Statutory/compliance documents requiring immediate action</li>
          <li>• <strong>High:</strong> Expired 60-89 days - Important documents affecting employee operations</li>
          <li>• <strong>Medium:</strong> Expired 30-59 days - Documents that should be renewed soon</li>
          <li>• Send immediate escalation for critical expired documents</li>
          <li>• Weekly reminders for high severity expired documents</li>
          <li>• Bi-weekly reminders for medium severity expired documents</li>
        </ul>
      </div>
    </div>
  );
}

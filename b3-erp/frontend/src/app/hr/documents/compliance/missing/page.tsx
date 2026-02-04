'use client';

import { useState, useMemo } from 'react';
import { AlertCircle, Upload, FileText, User } from 'lucide-react';

interface MissingDocument {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  documentType: string;
  category: 'personal' | 'education' | 'employment' | 'statutory';
  priority: 'high' | 'medium' | 'low';
  requestedOn: string;
  lastReminder?: string;
  remarks?: string;
}

export default function MissingDocumentsPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');

  const mockMissingDocs: MissingDocument[] = [
    {
      id: 'MISS001',
      employeeId: 'EMP001',
      employeeName: 'Rahul Sharma',
      department: 'Engineering',
      documentType: 'PAN Card',
      category: 'personal',
      priority: 'high',
      requestedOn: '2025-10-01',
      lastReminder: '2025-10-20'
    },
    {
      id: 'MISS002',
      employeeId: 'EMP002',
      employeeName: 'Priya Singh',
      department: 'HR',
      documentType: 'Degree Certificate',
      category: 'education',
      priority: 'high',
      requestedOn: '2025-09-15',
      lastReminder: '2025-10-15'
    },
    {
      id: 'MISS003',
      employeeId: 'EMP003',
      employeeName: 'Amit Patel',
      department: 'Finance',
      documentType: 'EPF Form 11',
      category: 'statutory',
      priority: 'high',
      requestedOn: '2025-10-10',
      lastReminder: '2025-10-22'
    },
    {
      id: 'MISS004',
      employeeId: 'EMP004',
      employeeName: 'Sneha Reddy',
      department: 'Marketing',
      documentType: 'Previous Employment Letter',
      category: 'employment',
      priority: 'medium',
      requestedOn: '2025-10-05',
      lastReminder: '2025-10-18'
    },
    {
      id: 'MISS005',
      employeeId: 'EMP005',
      employeeName: 'Karthik Kumar',
      department: 'Sales',
      documentType: 'Passport',
      category: 'personal',
      priority: 'low',
      requestedOn: '2025-09-20'
    }
  ];

  const filteredDocs = useMemo(() => {
    return mockMissingDocs.filter(doc => {
      const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
      const matchesPriority = selectedPriority === 'all' || doc.priority === selectedPriority;
      return matchesCategory && matchesPriority;
    });
  }, [selectedCategory, selectedPriority]);

  const stats = {
    total: mockMissingDocs.length,
    high: mockMissingDocs.filter(d => d.priority === 'high').length,
    medium: mockMissingDocs.filter(d => d.priority === 'medium').length,
    low: mockMissingDocs.filter(d => d.priority === 'low').length
  };

  const priorityColors = {
    high: 'bg-red-100 text-red-700',
    medium: 'bg-yellow-100 text-yellow-700',
    low: 'bg-blue-100 text-blue-700'
  };

  const categoryLabels = {
    personal: 'Personal Documents',
    education: 'Education Documents',
    employment: 'Employment Documents',
    statutory: 'Statutory Documents'
  };

  return (
    <div className="w-full h-full px-3 py-2">
      <div className="mb-3">
        <h1 className="text-2xl font-bold text-gray-900">Missing Documents</h1>
        <p className="text-sm text-gray-600 mt-1">Track and follow up on pending document submissions</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-3">
        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-3 border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-600">Total Missing</p>
              <p className="text-2xl font-bold text-red-900 mt-1">{stats.total}</p>
            </div>
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-3 border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-600">High Priority</p>
              <p className="text-2xl font-bold text-red-900 mt-1">{stats.high}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-3 border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-600">Medium Priority</p>
              <p className="text-2xl font-bold text-yellow-900 mt-1">{stats.medium}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-3 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Low Priority</p>
              <p className="text-2xl font-bold text-blue-900 mt-1">{stats.low}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 mb-3">
        <div className="flex flex-col md:flex-row gap-2">
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
              <option value="employment">Employment Documents</option>
              <option value="statutory">Statutory Documents</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Priorities</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {filteredDocs.map(doc => (
          <div key={doc.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-3">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-bold text-gray-900">{doc.documentType}</h3>
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${priorityColors[doc.priority]}`}>
                    {doc.priority.toUpperCase()} PRIORITY
                  </span>
                  <span className="px-3 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-700">
                    {categoryLabels[doc.category]}
                  </span>
                </div>
                <p className="text-sm text-gray-600">Document ID: {doc.id}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-2">
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
                <p className="text-xs text-gray-500 uppercase font-medium mb-1">Requested On</p>
                <p className="text-sm font-semibold text-gray-900">
                  {new Date(doc.requestedOn).toLocaleDateString('en-IN')}
                </p>
              </div>
              {doc.lastReminder && (
                <div>
                  <p className="text-xs text-gray-500 uppercase font-medium mb-1">Last Reminder</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {new Date(doc.lastReminder).toLocaleDateString('en-IN')}
                  </p>
                </div>
              )}
            </div>

            {doc.remarks && (
              <div className="bg-gray-50 border border-gray-200 rounded p-3 mb-2">
                <p className="text-xs text-gray-500 uppercase font-medium mb-1">Remarks</p>
                <p className="text-sm text-gray-700">{doc.remarks}</p>
              </div>
            )}

            <div className="flex gap-2 pt-4 border-t border-gray-200">
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm">
                <Upload className="h-4 w-4" />
                Upload Document
              </button>
              <button className="px-4 py-2 text-orange-600 hover:bg-orange-50 rounded-lg font-medium text-sm">
                Send Reminder
              </button>
              <button className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg font-medium text-sm">
                View Employee Profile
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredDocs.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
          <FileText className="h-12 w-12 text-gray-400 mb-2" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No missing documents</h3>
          <p className="text-gray-600">All required documents have been submitted</p>
        </div>
      )}

      <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mt-6">
        <h3 className="font-semibold text-orange-900 mb-2 flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          Document Compliance Guidelines
        </h3>
        <ul className="text-sm text-orange-800 space-y-1 ml-7">
          <li>• <strong>High Priority:</strong> Statutory/mandatory documents required for compliance</li>
          <li>• <strong>Medium Priority:</strong> Important documents needed for employee records</li>
          <li>• <strong>Low Priority:</strong> Optional documents that enhance employee profile</li>
          <li>• Send automated reminders weekly for high priority documents</li>
          <li>• Escalate to department heads if documents not received within 30 days</li>
          <li>• Maintain audit trail of all document requests and reminders</li>
        </ul>
      </div>
    </div>
  );
}

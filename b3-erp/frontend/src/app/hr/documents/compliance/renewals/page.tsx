'use client';

import { useState, useMemo } from 'react';
import { Bell, Calendar, FileText, AlertCircle } from 'lucide-react';

interface RenewalReminder {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  documentType: string;
  category: 'personal' | 'statutory';
  expiryDate: string;
  daysUntilExpiry: number;
  uploadedOn: string;
  urgency: 'urgent' | 'soon' | 'upcoming';
  remindersSent: number;
  lastReminderDate?: string;
}

export default function RenewalRemindersPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedUrgency, setSelectedUrgency] = useState('all');

  const calculateDaysUntilExpiry = (expiryDate: string) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const mockRenewals: RenewalReminder[] = [
    {
      id: 'REN001',
      employeeId: 'EMP001',
      employeeName: 'Rahul Sharma',
      department: 'Engineering',
      documentType: 'Passport',
      category: 'personal',
      expiryDate: '2025-11-15',
      daysUntilExpiry: 19,
      uploadedOn: '2020-11-15',
      urgency: 'urgent',
      remindersSent: 2,
      lastReminderDate: '2025-10-20'
    },
    {
      id: 'REN002',
      employeeId: 'EMP002',
      employeeName: 'Priya Singh',
      department: 'HR',
      documentType: 'Medical Insurance',
      category: 'statutory',
      expiryDate: '2025-11-30',
      daysUntilExpiry: 34,
      uploadedOn: '2024-11-30',
      urgency: 'soon',
      remindersSent: 1,
      lastReminderDate: '2025-10-15'
    },
    {
      id: 'REN003',
      employeeId: 'EMP003',
      employeeName: 'Amit Patel',
      department: 'Finance',
      documentType: 'Driving License',
      category: 'personal',
      expiryDate: '2025-12-20',
      daysUntilExpiry: 54,
      uploadedOn: '2020-12-20',
      urgency: 'soon',
      remindersSent: 0
    },
    {
      id: 'REN004',
      employeeId: 'EMP004',
      employeeName: 'Sneha Reddy',
      department: 'Marketing',
      documentType: 'Police Verification',
      category: 'statutory',
      expiryDate: '2026-01-15',
      daysUntilExpiry: 80,
      uploadedOn: '2025-01-15',
      urgency: 'upcoming',
      remindersSent: 0
    },
    {
      id: 'REN005',
      employeeId: 'EMP005',
      employeeName: 'Karthik Kumar',
      department: 'Sales',
      documentType: 'Professional Certification',
      category: 'personal',
      expiryDate: '2025-11-10',
      daysUntilExpiry: 14,
      uploadedOn: '2022-11-10',
      urgency: 'urgent',
      remindersSent: 3,
      lastReminderDate: '2025-10-24'
    }
  ];

  const filteredRenewals = useMemo(() => {
    return mockRenewals.filter(renewal => {
      const matchesCategory = selectedCategory === 'all' || renewal.category === selectedCategory;
      const matchesUrgency = selectedUrgency === 'all' || renewal.urgency === selectedUrgency;
      return matchesCategory && matchesUrgency;
    });
  }, [selectedCategory, selectedUrgency]);

  const stats = {
    total: mockRenewals.length,
    urgent: mockRenewals.filter(r => r.urgency === 'urgent').length,
    soon: mockRenewals.filter(r => r.urgency === 'soon').length,
    upcoming: mockRenewals.filter(r => r.urgency === 'upcoming').length
  };

  const urgencyColors = {
    urgent: 'bg-red-100 text-red-700',
    soon: 'bg-yellow-100 text-yellow-700',
    upcoming: 'bg-blue-100 text-blue-700'
  };

  const categoryLabels = {
    personal: 'Personal',
    statutory: 'Statutory'
  };

  return (
    <div className="w-full h-full px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Document Renewal Reminders</h1>
        <p className="text-sm text-gray-600 mt-1">Proactive reminders for upcoming document expirations</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-600">Total Renewals</p>
              <p className="text-2xl font-bold text-orange-900 mt-1">{stats.total}</p>
            </div>
            <Bell className="h-8 w-8 text-orange-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4 border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-600">Urgent (≤30 days)</p>
              <p className="text-2xl font-bold text-red-900 mt-1">{stats.urgent}</p>
            </div>
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4 border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-600">Soon (31-60 days)</p>
              <p className="text-2xl font-bold text-yellow-900 mt-1">{stats.soon}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Upcoming (61-90 days)</p>
              <p className="text-2xl font-bold text-blue-900 mt-1">{stats.upcoming}</p>
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
              <option value="statutory">Statutory Documents</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Urgency</label>
            <select
              value={selectedUrgency}
              onChange={(e) => setSelectedUrgency(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Urgencies</option>
              <option value="urgent">Urgent (≤30 days)</option>
              <option value="soon">Soon (31-60 days)</option>
              <option value="upcoming">Upcoming (61-90 days)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {filteredRenewals.map(renewal => (
          <div key={renewal.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-bold text-gray-900">{renewal.documentType}</h3>
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${urgencyColors[renewal.urgency]}`}>
                    {renewal.urgency.toUpperCase()}
                  </span>
                  <span className="px-3 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-700">
                    {categoryLabels[renewal.category]}
                  </span>
                </div>
                <p className="text-sm text-gray-600">Renewal ID: {renewal.id}</p>
              </div>
            </div>

            <div className={`border rounded p-3 mb-4 ${
              renewal.urgency === 'urgent' ? 'bg-red-50 border-red-200' :
              renewal.urgency === 'soon' ? 'bg-yellow-50 border-yellow-200' :
              'bg-blue-50 border-blue-200'
            }`}>
              <div className="flex items-start gap-2">
                <Calendar className={`h-5 w-5 mt-0.5 ${
                  renewal.urgency === 'urgent' ? 'text-red-600' :
                  renewal.urgency === 'soon' ? 'text-yellow-600' :
                  'text-blue-600'
                }`} />
                <div>
                  <p className={`text-sm font-medium ${
                    renewal.urgency === 'urgent' ? 'text-red-900' :
                    renewal.urgency === 'soon' ? 'text-yellow-900' :
                    'text-blue-900'
                  }`}>
                    Expires in {renewal.daysUntilExpiry} days on {new Date(renewal.expiryDate).toLocaleDateString('en-IN')}
                  </p>
                  <p className={`text-xs mt-1 ${
                    renewal.urgency === 'urgent' ? 'text-red-700' :
                    renewal.urgency === 'soon' ? 'text-yellow-700' :
                    'text-blue-700'
                  }`}>
                    {renewal.urgency === 'urgent' && 'Immediate renewal action required'}
                    {renewal.urgency === 'soon' && 'Please initiate renewal process'}
                    {renewal.urgency === 'upcoming' && 'Renewal reminder for advance planning'}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
              <div>
                <p className="text-xs text-gray-500 uppercase font-medium mb-1">Employee</p>
                <p className="text-sm font-semibold text-gray-900">{renewal.employeeName}</p>
                <p className="text-xs text-gray-500">{renewal.employeeId}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-medium mb-1">Department</p>
                <p className="text-sm font-semibold text-gray-900">{renewal.department}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-medium mb-1">Originally Uploaded</p>
                <p className="text-sm font-semibold text-gray-900">
                  {new Date(renewal.uploadedOn).toLocaleDateString('en-IN')}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-medium mb-1">Reminders Sent</p>
                <p className="text-sm font-semibold text-gray-900">{renewal.remindersSent}</p>
              </div>
              {renewal.lastReminderDate && (
                <div>
                  <p className="text-xs text-gray-500 uppercase font-medium mb-1">Last Reminder</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {new Date(renewal.lastReminderDate).toLocaleDateString('en-IN')}
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-2 pt-4 border-t border-gray-200">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm">
                Send Renewal Reminder
              </button>
              <button className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg font-medium text-sm">
                View Current Document
              </button>
              <button className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg font-medium text-sm">
                Contact Employee
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredRenewals.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No renewals due</h3>
          <p className="text-gray-600">No documents require renewal in the selected timeframe</p>
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
        <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Renewal Reminder Schedule
        </h3>
        <ul className="text-sm text-blue-800 space-y-1 ml-7">
          <li>• <strong>Urgent (≤30 days):</strong> Weekly reminders sent automatically</li>
          <li>• <strong>Soon (31-60 days):</strong> Bi-weekly reminders sent automatically</li>
          <li>• <strong>Upcoming (61-90 days):</strong> Monthly advance notice sent</li>
          <li>• First reminder sent at 90 days before expiry</li>
          <li>• Escalation to manager if document not renewed within 15 days of expiry</li>
          <li>• Employees can request early renewal at any time</li>
        </ul>
      </div>
    </div>
  );
}

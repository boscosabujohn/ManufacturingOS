'use client';

import { useState, useMemo } from 'react';
import { CheckCircle, Search, Clock, AlertCircle, FileText, Download } from 'lucide-react';

interface PolicyAcknowledgment {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  designation: string;
  policyName: string;
  policyVersion: string;
  policyCategory: 'code_of_conduct' | 'compliance' | 'safety' | 'hr' | 'it_security' | 'other';
  assignedDate: string;
  dueDate: string;
  acknowledgmentDate?: string;
  status: 'pending' | 'acknowledged' | 'overdue';
  acknowledgedVia: 'digital_signature' | 'email' | 'in_person' | null;
  remindersSent: number;
  lastReminderDate?: string;
  remarks?: string;
}

export default function Page() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  const mockAcknowledgments: PolicyAcknowledgment[] = [
    {
      id: '1',
      employeeId: 'EMP001',
      employeeName: 'Rajesh Kumar',
      department: 'Manufacturing',
      designation: 'Production Manager',
      policyName: 'Code of Conduct Policy',
      policyVersion: 'v2.0',
      policyCategory: 'code_of_conduct',
      assignedDate: '2025-01-01',
      dueDate: '2025-01-15',
      acknowledgmentDate: '2025-01-10',
      status: 'acknowledged',
      acknowledgedVia: 'digital_signature',
      remindersSent: 1,
      lastReminderDate: '2025-01-08'
    },
    {
      id: '2',
      employeeId: 'EMP002',
      employeeName: 'Priya Sharma',
      department: 'HR',
      designation: 'HR Manager',
      policyName: 'Prevention of Sexual Harassment (POSH) Policy',
      policyVersion: 'v1.5',
      policyCategory: 'hr',
      assignedDate: '2025-01-01',
      dueDate: '2025-01-15',
      acknowledgmentDate: '2025-01-12',
      status: 'acknowledged',
      acknowledgedVia: 'digital_signature',
      remindersSent: 2,
      lastReminderDate: '2025-01-10'
    },
    {
      id: '3',
      employeeId: 'EMP003',
      employeeName: 'Amit Patel',
      department: 'IT',
      designation: 'Software Engineer',
      policyName: 'Information Security Policy',
      policyVersion: 'v3.1',
      policyCategory: 'it_security',
      assignedDate: '2025-01-05',
      dueDate: '2025-01-20',
      status: 'pending',
      acknowledgedVia: null,
      remindersSent: 3,
      lastReminderDate: '2025-01-18',
      remarks: 'Multiple reminders sent, pending acknowledgment'
    },
    {
      id: '4',
      employeeId: 'EMP004',
      employeeName: 'Neha Desai',
      department: 'Finance',
      designation: 'Accountant',
      policyName: 'Anti-Bribery and Corruption Policy',
      policyVersion: 'v2.2',
      policyCategory: 'compliance',
      assignedDate: '2024-12-20',
      dueDate: '2025-01-05',
      status: 'overdue',
      acknowledgedVia: null,
      remindersSent: 5,
      lastReminderDate: '2025-01-10',
      remarks: 'Escalation required - overdue by 21 days'
    },
    {
      id: '5',
      employeeId: 'EMP005',
      employeeName: 'Suresh Mehta',
      department: 'Manufacturing',
      designation: 'Safety Officer',
      policyName: 'Workplace Safety and Health Policy',
      policyVersion: 'v4.0',
      policyCategory: 'safety',
      assignedDate: '2025-01-01',
      dueDate: '2025-01-15',
      acknowledgmentDate: '2025-01-08',
      status: 'acknowledged',
      acknowledgedVia: 'digital_signature',
      remindersSent: 0
    },
    {
      id: '6',
      employeeId: 'EMP006',
      employeeName: 'Vikram Singh',
      department: 'Operations',
      designation: 'Operations Manager',
      policyName: 'Environmental Compliance Policy',
      policyVersion: 'v1.8',
      policyCategory: 'compliance',
      assignedDate: '2025-01-10',
      dueDate: '2025-01-25',
      status: 'pending',
      acknowledgedVia: null,
      remindersSent: 1,
      lastReminderDate: '2025-01-20'
    },
    {
      id: '7',
      employeeId: 'EMP007',
      employeeName: 'Anita Joshi',
      department: 'HR',
      designation: 'Recruitment Specialist',
      policyName: 'Equal Employment Opportunity Policy',
      policyVersion: 'v2.0',
      policyCategory: 'hr',
      assignedDate: '2025-01-01',
      dueDate: '2025-01-15',
      acknowledgmentDate: '2025-01-11',
      status: 'acknowledged',
      acknowledgedVia: 'email',
      remindersSent: 1,
      lastReminderDate: '2025-01-09'
    },
    {
      id: '8',
      employeeId: 'EMP008',
      employeeName: 'Rahul Verma',
      department: 'IT',
      designation: 'Network Administrator',
      policyName: 'Data Privacy and Protection Policy',
      policyVersion: 'v2.5',
      policyCategory: 'it_security',
      assignedDate: '2025-01-05',
      dueDate: '2025-01-20',
      status: 'pending',
      acknowledgedVia: null,
      remindersSent: 2,
      lastReminderDate: '2025-01-19'
    }
  ];

  const filteredAcknowledgments = useMemo(() => {
    return mockAcknowledgments.filter(ack => {
      const matchesSearch = ack.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           ack.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           ack.policyName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = selectedStatus === 'all' || ack.status === selectedStatus;
      const matchesCategory = selectedCategory === 'all' || ack.policyCategory === selectedCategory;
      const matchesDepartment = selectedDepartment === 'all' || ack.department === selectedDepartment;
      return matchesSearch && matchesStatus && matchesCategory && matchesDepartment;
    });
  }, [searchTerm, selectedStatus, selectedCategory, selectedDepartment, mockAcknowledgments]);

  const stats = {
    total: mockAcknowledgments.length,
    acknowledged: mockAcknowledgments.filter(a => a.status === 'acknowledged').length,
    pending: mockAcknowledgments.filter(a => a.status === 'pending').length,
    overdue: mockAcknowledgments.filter(a => a.status === 'overdue').length
  };

  const statusColors = {
    acknowledged: 'bg-green-100 text-green-700 border-green-300',
    pending: 'bg-yellow-100 text-yellow-700 border-yellow-300',
    overdue: 'bg-red-100 text-red-700 border-red-300'
  };

  const statusIcons = {
    acknowledged: CheckCircle,
    pending: Clock,
    overdue: AlertCircle
  };

  const categoryColors = {
    code_of_conduct: 'bg-blue-100 text-blue-700',
    compliance: 'bg-purple-100 text-purple-700',
    safety: 'bg-red-100 text-red-700',
    hr: 'bg-teal-100 text-teal-700',
    it_security: 'bg-orange-100 text-orange-700',
    other: 'bg-gray-100 text-gray-700'
  };

  const departments = ['All Departments', 'Manufacturing', 'HR', 'IT', 'Finance', 'Operations'];

  const getDaysOverdue = (dueDate: string) => {
    const days = Math.floor((new Date().getTime() - new Date(dueDate).getTime()) / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  };

  return (
    <div className="w-full h-full px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <CheckCircle className="h-6 w-6 text-green-600" />
          Policy Acknowledgment Tracking
        </h1>
        <p className="text-sm text-gray-600 mt-1">Track employee acknowledgment of company policies</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow-sm border border-blue-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Total Assignments</p>
              <p className="text-3xl font-bold text-blue-900 mt-1">{stats.total}</p>
              <p className="text-xs text-blue-700 mt-1">All policies</p>
            </div>
            <FileText className="h-10 w-10 text-blue-600 opacity-60" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg shadow-sm border border-green-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-green-600 uppercase tracking-wide">Acknowledged</p>
              <p className="text-3xl font-bold text-green-900 mt-1">{stats.acknowledged}</p>
              <p className="text-xs text-green-700 mt-1">{Math.round((stats.acknowledged / stats.total) * 100)}% completion</p>
            </div>
            <CheckCircle className="h-10 w-10 text-green-600 opacity-60" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg shadow-sm border border-yellow-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-yellow-600 uppercase tracking-wide">Pending</p>
              <p className="text-3xl font-bold text-yellow-900 mt-1">{stats.pending}</p>
              <p className="text-xs text-yellow-700 mt-1">Awaiting response</p>
            </div>
            <Clock className="h-10 w-10 text-yellow-600 opacity-60" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg shadow-sm border border-red-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-red-600 uppercase tracking-wide">Overdue</p>
              <p className="text-3xl font-bold text-red-900 mt-1">{stats.overdue}</p>
              <p className="text-xs text-red-700 mt-1">Past deadline</p>
            </div>
            <AlertCircle className="h-10 w-10 text-red-600 opacity-60" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search employee or policy..."
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500">
              <option value="all">All Status</option>
              <option value="acknowledged">Acknowledged</option>
              <option value="pending">Pending</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500">
              <option value="all">All Categories</option>
              <option value="code_of_conduct">Code of Conduct</option>
              <option value="compliance">Compliance</option>
              <option value="safety">Safety</option>
              <option value="hr">HR</option>
              <option value="it_security">IT Security</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
            <select value={selectedDepartment} onChange={(e) => setSelectedDepartment(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500">
              {departments.map((dept, idx) => (
                <option key={idx} value={dept === 'All Departments' ? 'all' : dept}>{dept}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {filteredAcknowledgments.length > 0 ? (
          filteredAcknowledgments.map((ack) => {
            const StatusIcon = statusIcons[ack.status];
            const daysOverdue = getDaysOverdue(ack.dueDate);

            return (
              <div key={ack.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-gray-900">{ack.policyName}</h3>
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full border-2 flex items-center gap-1 ${statusColors[ack.status]}`}>
                        <StatusIcon className="h-3 w-3" />
                        {ack.status.toUpperCase()}
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded ${categoryColors[ack.policyCategory]}`}>
                        {ack.policyCategory.replace('_', ' ').toUpperCase()}
                      </span>
                      <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded">
                        {ack.policyVersion}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 font-medium">
                      {ack.employeeName} ({ack.employeeId}) - {ack.designation}
                    </p>
                    <p className="text-xs text-gray-600">Department: {ack.department}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-600 uppercase font-medium mb-1">Assigned Date</p>
                    <p className="text-sm font-bold text-gray-900">
                      {new Date(ack.assignedDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-600 uppercase font-medium mb-1">Due Date</p>
                    <p className="text-sm font-bold text-gray-900">
                      {new Date(ack.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                  {ack.acknowledgmentDate && (
                    <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                      <p className="text-xs text-green-600 uppercase font-medium mb-1">Acknowledged On</p>
                      <p className="text-sm font-bold text-green-900">
                        {new Date(ack.acknowledgmentDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                  )}
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-600 uppercase font-medium mb-1">Reminders Sent</p>
                    <p className="text-sm font-bold text-gray-900">{ack.remindersSent}</p>
                  </div>
                </div>

                {ack.status === 'overdue' && (
                  <div className="bg-red-50 rounded-lg p-3 border border-red-200 mb-4">
                    <p className="text-xs text-red-600 uppercase font-medium mb-1">Days Overdue</p>
                    <p className="text-lg font-bold text-red-900">{daysOverdue} days</p>
                  </div>
                )}

                {ack.acknowledgedVia && (
                  <div className="bg-blue-50 rounded-lg p-3 border border-blue-200 mb-4">
                    <p className="text-xs text-blue-600 uppercase font-medium mb-1">Acknowledged Via</p>
                    <p className="text-sm text-blue-900">{ack.acknowledgedVia.replace('_', ' ').toUpperCase()}</p>
                  </div>
                )}

                {ack.lastReminderDate && (
                  <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-200 mb-4">
                    <p className="text-xs text-yellow-600 uppercase font-medium mb-1">Last Reminder Sent</p>
                    <p className="text-sm text-yellow-900">
                      {new Date(ack.lastReminderDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                )}

                {ack.remarks && (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-4">
                    <p className="text-xs text-gray-600 uppercase font-medium mb-1">Remarks</p>
                    <p className="text-sm text-gray-900">{ack.remarks}</p>
                  </div>
                )}

                <div className="flex gap-2">
                  <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    View Policy
                  </button>
                  <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Download
                  </button>
                  {ack.status !== 'acknowledged' && (
                    <button className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 text-sm font-medium">
                      Send Reminder
                    </button>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
            <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No acknowledgments found</h3>
            <p className="text-gray-600">No policy acknowledgments match the selected filters</p>
          </div>
        )}
      </div>
    </div>
  );
}

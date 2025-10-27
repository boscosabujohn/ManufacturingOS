'use client';

import { useState } from 'react';
import { FileText, Plus, Edit, Eye, Clock, Calendar, AlertCircle, CheckCircle, Users, Settings } from 'lucide-react';
import StatusBadge from '@/components/StatusBadge';

interface AttendancePolicy {
  id: string;
  name: string;
  type: 'working_hours' | 'late_arrival' | 'early_departure' | 'grace_period' | 'half_day' | 'overtime';
  description: string;
  applicableTo: string;
  effectiveFrom: string;
  status: 'active' | 'inactive' | 'draft';
  rules: { key: string; value: string }[];
  createdBy: string;
  lastModified: string;
}

export default function AttendancePoliciesPage() {
  const [selectedPolicy, setSelectedPolicy] = useState<AttendancePolicy | null>(null);

  const mockPolicies: AttendancePolicy[] = [
    {
      id: 'POL001',
      name: 'Regular Working Hours Policy',
      type: 'working_hours',
      description: 'Standard working hours for production and office staff',
      applicableTo: 'All Employees',
      effectiveFrom: '2024-01-01',
      status: 'active',
      rules: [
        { key: 'Start Time', value: '09:00 AM' },
        { key: 'End Time', value: '06:00 PM' },
        { key: 'Break Duration', value: '1 hour' },
        { key: 'Working Days', value: 'Monday to Saturday' },
        { key: 'Week Off', value: 'Sunday' }
      ],
      createdBy: 'HR Admin',
      lastModified: '2024-01-15'
    },
    {
      id: 'POL002',
      name: 'Flexi-Time Policy',
      type: 'working_hours',
      description: 'Flexible working hours for IT and senior management',
      applicableTo: 'IT Department, Managers & Above',
      effectiveFrom: '2024-01-01',
      status: 'active',
      rules: [
        { key: 'Core Hours', value: '11:00 AM to 04:00 PM' },
        { key: 'Flexible Hours', value: '08:00 AM to 10:00 PM' },
        { key: 'Minimum Hours/Day', value: '9 hours' },
        { key: 'Mandatory Days', value: 'Tuesday, Wednesday, Thursday' }
      ],
      createdBy: 'HR Admin',
      lastModified: '2024-02-10'
    },
    {
      id: 'POL003',
      name: 'Late Arrival Policy',
      type: 'late_arrival',
      description: 'Rules and penalties for late arrivals',
      applicableTo: 'All Employees',
      effectiveFrom: '2024-01-01',
      status: 'active',
      rules: [
        { key: 'Grace Period', value: '15 minutes' },
        { key: 'Late Marks (1-3/month)', value: 'Warning' },
        { key: 'Late Marks (4-6/month)', value: '0.5 day salary deduction' },
        { key: 'Late Marks (>6/month)', value: '1 day salary deduction + Notice' }
      ],
      createdBy: 'HR Admin',
      lastModified: '2024-01-20'
    },
    {
      id: 'POL004',
      name: 'Early Departure Policy',
      type: 'early_departure',
      description: 'Guidelines for early departure from work',
      applicableTo: 'All Employees',
      effectiveFrom: '2024-01-01',
      status: 'active',
      rules: [
        { key: 'Minimum Hours Required', value: '4 hours for half day' },
        { key: 'Prior Approval', value: 'Required from reporting manager' },
        { key: 'Without Approval', value: 'Marked as unauthorized absence' },
        { key: 'Medical Emergency', value: 'Intimation required within 2 hours' }
      ],
      createdBy: 'HR Admin',
      lastModified: '2024-01-10'
    },
    {
      id: 'POL005',
      name: 'Grace Period Policy',
      type: 'grace_period',
      description: 'Daily grace period for attendance marking',
      applicableTo: 'All Employees except Security & Production',
      effectiveFrom: '2024-01-01',
      status: 'active',
      rules: [
        { key: 'Check-in Grace', value: '15 minutes after shift start' },
        { key: 'Check-out Grace', value: '15 minutes before shift end' },
        { key: 'Break Extension', value: '5 minutes per break' },
        { key: 'Frequency Limit', value: 'Max 10 times per month' }
      ],
      createdBy: 'HR Admin',
      lastModified: '2024-03-05'
    },
    {
      id: 'POL006',
      name: 'Half-Day Attendance Policy',
      type: 'half_day',
      description: 'Criteria for marking half-day attendance',
      applicableTo: 'All Employees',
      effectiveFrom: '2024-01-01',
      status: 'active',
      rules: [
        { key: 'First Half', value: '09:00 AM to 01:00 PM (4 hours)' },
        { key: 'Second Half', value: '02:00 PM to 06:00 PM (4 hours)' },
        { key: 'Minimum Hours', value: '4 hours for half day credit' },
        { key: 'Leave Deduction', value: '0.5 day from leave balance' }
      ],
      createdBy: 'HR Admin',
      lastModified: '2024-02-28'
    },
    {
      id: 'POL007',
      name: 'Overtime Eligibility Policy',
      type: 'overtime',
      description: 'Rules for overtime calculation and approval',
      applicableTo: 'Non-management Staff',
      effectiveFrom: '2024-01-01',
      status: 'active',
      rules: [
        { key: 'Minimum OT Duration', value: '1 hour beyond shift' },
        { key: 'Prior Approval', value: 'Required from department head' },
        { key: 'OT Rate (Weekday)', value: '1.5x hourly rate' },
        { key: 'OT Rate (Sunday/Holiday)', value: '2x hourly rate' },
        { key: 'Max OT per Month', value: '40 hours' }
      ],
      createdBy: 'HR Admin',
      lastModified: '2024-01-25'
    },
    {
      id: 'POL008',
      name: 'Shift Rotation Policy',
      type: 'working_hours',
      description: 'Guidelines for shift changes and rotation',
      applicableTo: 'Production & Security Staff',
      effectiveFrom: '2024-01-01',
      status: 'draft',
      rules: [
        { key: 'Rotation Cycle', value: 'Weekly basis' },
        { key: 'Notice Period', value: '3 days in advance' },
        { key: 'Consecutive Night Shifts', value: 'Maximum 5 days' },
        { key: 'Rest Period', value: 'Minimum 12 hours between shifts' }
      ],
      createdBy: 'HR Manager',
      lastModified: '2024-11-10'
    }
  ];

  const getTypeIcon = (type: string) => {
    const icons = {
      working_hours: <Clock className="w-5 h-5 text-blue-600" />,
      late_arrival: <AlertCircle className="w-5 h-5 text-orange-600" />,
      early_departure: <AlertCircle className="w-5 h-5 text-yellow-600" />,
      grace_period: <CheckCircle className="w-5 h-5 text-green-600" />,
      half_day: <Calendar className="w-5 h-5 text-purple-600" />,
      overtime: <Clock className="w-5 h-5 text-indigo-600" />
    };
    return icons[type as keyof typeof icons] || <Settings className="w-5 h-5 text-gray-600" />;
  };

  const getTypeColor = (type: string) => {
    const colors = {
      working_hours: 'bg-blue-100 text-blue-700 border-blue-200',
      late_arrival: 'bg-orange-100 text-orange-700 border-orange-200',
      early_departure: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      grace_period: 'bg-green-100 text-green-700 border-green-200',
      half_day: 'bg-purple-100 text-purple-700 border-purple-200',
      overtime: 'bg-indigo-100 text-indigo-700 border-indigo-200'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          <FileText className="h-8 w-8 text-blue-600" />
          Attendance Policies
        </h1>
        <p className="text-gray-600 mt-2">Configure and manage attendance rules and policies</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border-2 border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Policies</p>
              <p className="text-2xl font-bold text-blue-600">{mockPolicies.length}</p>
            </div>
            <FileText className="h-8 w-8 text-blue-400" />
          </div>
        </div>
        <div className="bg-white border-2 border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Policies</p>
              <p className="text-2xl font-bold text-green-600">
                {mockPolicies.filter(p => p.status === 'active').length}
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-400" />
          </div>
        </div>
        <div className="bg-white border-2 border-yellow-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Draft Policies</p>
              <p className="text-2xl font-bold text-yellow-600">
                {mockPolicies.filter(p => p.status === 'draft').length}
              </p>
            </div>
            <Edit className="h-8 w-8 text-yellow-400" />
          </div>
        </div>
        <div className="bg-white border-2 border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Coverage</p>
              <p className="text-2xl font-bold text-gray-700">100%</p>
              <p className="text-xs text-gray-500 mt-1">All employees</p>
            </div>
            <Users className="h-8 w-8 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-700">All Policies</h2>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Plus className="h-4 w-4" />
            Create New Policy
          </button>
        </div>
      </div>

      {/* Policies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mockPolicies.map((policy) => (
          <div
            key={policy.id}
            className="bg-white rounded-lg shadow-sm border-2 border-gray-200 p-6 hover:shadow-md transition-all hover:border-blue-300"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-3 flex-1">
                <div className="p-2 rounded-lg bg-gray-50">
                  {getTypeIcon(policy.type)}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{policy.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{policy.description}</p>
                  <div className={`inline-block px-2 py-1 rounded-md text-xs font-medium border ${getTypeColor(policy.type)}`}>
                    {policy.type.replace('_', ' ').toUpperCase()}
                  </div>
                </div>
              </div>
              <StatusBadge status={policy.status} />
            </div>

            <div className="border-t border-gray-200 pt-4 mb-4">
              <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                <div>
                  <span className="text-gray-500">Applicable To:</span>
                  <p className="font-medium text-gray-900">{policy.applicableTo}</p>
                </div>
                <div>
                  <span className="text-gray-500">Effective From:</span>
                  <p className="font-medium text-gray-900">
                    {new Date(policy.effectiveFrom).toLocaleDateString('en-IN', {
                      day: 'numeric', month: 'short', year: 'numeric'
                    })}
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-3 mb-3">
                <p className="text-xs font-medium text-gray-700 mb-2">Key Rules:</p>
                <div className="space-y-1">
                  {policy.rules.slice(0, 3).map((rule, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs">
                      <CheckCircle className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="font-medium text-gray-700">{rule.key}:</span>
                        <span className="text-gray-600 ml-1">{rule.value}</span>
                      </div>
                    </div>
                  ))}
                  {policy.rules.length > 3 && (
                    <p className="text-xs text-blue-600 font-medium">+{policy.rules.length - 3} more rules</p>
                  )}
                </div>
              </div>

              <div className="text-xs text-gray-500">
                Last modified: {new Date(policy.lastModified).toLocaleDateString('en-IN')} by {policy.createdBy}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setSelectedPolicy(policy)}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 text-sm font-medium transition-colors"
              >
                <Eye className="h-4 w-4" />
                View Details
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 text-sm font-medium transition-colors">
                <Edit className="h-4 w-4" />
                Edit Policy
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Policy Detail Modal */}
      {selectedPolicy && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedPolicy.name}</h2>
                  <p className="text-gray-600 mt-1">{selectedPolicy.description}</p>
                </div>
                <button
                  onClick={() => setSelectedPolicy(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Policy ID</p>
                  <p className="font-semibold text-gray-900">{selectedPolicy.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Status</p>
                  <StatusBadge status={selectedPolicy.status} />
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Applicable To</p>
                  <p className="font-semibold text-gray-900">{selectedPolicy.applicableTo}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Effective From</p>
                  <p className="font-semibold text-gray-900">
                    {new Date(selectedPolicy.effectiveFrom).toLocaleDateString('en-IN', {
                      day: 'numeric', month: 'long', year: 'numeric'
                    })}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Policy Rules</h3>
                <div className="space-y-2">
                  {selectedPolicy.rules.map((rule, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{rule.key}</p>
                        <p className="text-sm text-gray-600 mt-1">{rule.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <p className="text-sm text-gray-500">
                  Created by {selectedPolicy.createdBy} • Last modified on{' '}
                  {new Date(selectedPolicy.lastModified).toLocaleDateString('en-IN', {
                    day: 'numeric', month: 'long', year: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

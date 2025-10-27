'use client';

import { useState } from 'react';
import { CheckSquare, AlertCircle, CheckCircle, Clock, FileText, Calendar, Users } from 'lucide-react';

interface ComplianceItem {
  id: string;
  act: string;
  requirement: string;
  frequency: 'monthly' | 'quarterly' | 'half_yearly' | 'annual' | 'as_needed';
  applicability: string;
  responsibility: string;
  lastCompleted?: string;
  nextDue: string;
  status: 'compliant' | 'overdue' | 'due_soon' | 'not_applicable';
  documents: string[];
  penalties?: string;
}

export default function Page() {
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedFrequency, setSelectedFrequency] = useState('all');

  const mockCompliance: ComplianceItem[] = [
    {
      id: '1',
      act: 'Factories Act, 1948',
      requirement: 'Form 25 - Annual Return',
      frequency: 'annual',
      applicability: 'All manufacturing units with 10+ workers',
      responsibility: 'Factory Manager',
      lastCompleted: '2024-01-31',
      nextDue: '2025-01-31',
      status: 'due_soon',
      documents: ['Form 25', 'Worker attendance register', 'Accident register'],
      penalties: 'Fine up to ₹2,00,000 or imprisonment up to 2 years'
    },
    {
      id: '2',
      act: 'Shops & Establishments Act',
      requirement: 'Display of Registration Certificate',
      frequency: 'as_needed',
      applicability: 'All registered establishments',
      responsibility: 'HR Manager',
      lastCompleted: '2024-01-01',
      nextDue: 'Ongoing',
      status: 'compliant',
      documents: ['S&E Registration Certificate'],
      penalties: 'Fine up to ₹10,000'
    },
    {
      id: '3',
      act: 'Provident Fund Act, 1952',
      requirement: 'ECR Filing',
      frequency: 'monthly',
      applicability: 'Establishments with 20+ employees',
      responsibility: 'Payroll Team',
      lastCompleted: '2025-10-15',
      nextDue: '2025-11-15',
      status: 'compliant',
      documents: ['ECR file', 'Challan payment proof'],
      penalties: 'Interest @ 12% p.a. + damages @ 25% + fine'
    },
    {
      id: '4',
      act: 'ESI Act, 1948',
      requirement: 'Monthly ESI Return',
      frequency: 'monthly',
      applicability: 'Establishments with 10+ employees (salary <₹21,000)',
      responsibility: 'Payroll Team',
      lastCompleted: '2025-10-15',
      nextDue: '2025-11-21',
      status: 'compliant',
      documents: ['ESI challan', 'Return filed acknowledgment'],
      penalties: 'Fine up to ₹10,000 + imprisonment up to 2 years'
    },
    {
      id: '5',
      act: 'Contract Labour Act, 1970',
      requirement: 'Half-yearly Return',
      frequency: 'half_yearly',
      applicability: 'Establishments employing 20+ contract workers',
      responsibility: 'Contract Manager',
      lastCompleted: '2025-04-30',
      nextDue: '2025-10-31',
      status: 'overdue',
      documents: ['Form XXIV', 'Contractor license copies', 'Wage register'],
      penalties: 'Fine up to ₹20,000'
    },
    {
      id: '6',
      act: 'Payment of Wages Act, 1936',
      requirement: 'Wage Register Maintenance',
      frequency: 'monthly',
      applicability: 'All establishments',
      responsibility: 'Payroll Team',
      lastCompleted: '2025-10-25',
      nextDue: '2025-11-25',
      status: 'compliant',
      documents: ['Form I - Wage Register', 'Payment slips', 'Bank statements'],
      penalties: 'Fine up to ₹3,750'
    },
    {
      id: '7',
      act: 'Gratuity Act, 1972',
      requirement: 'Form I - Notice to Authorities',
      frequency: 'as_needed',
      applicability: 'Establishments with 10+ employees',
      responsibility: 'HR Manager',
      lastCompleted: '2024-01-15',
      nextDue: 'Within 30 days of employment',
      status: 'compliant',
      documents: ['Form I', 'Employee list', 'Establishment details'],
      penalties: 'Fine up to ₹10,000'
    },
    {
      id: '8',
      act: 'Professional Tax',
      requirement: 'Monthly PT Return & Payment',
      frequency: 'monthly',
      applicability: 'All employees in applicable states',
      responsibility: 'Payroll Team',
      lastCompleted: '2025-10-20',
      nextDue: '2025-11-20',
      status: 'compliant',
      documents: ['PT challan', 'Return acknowledgment'],
      penalties: 'Interest + penalty as per state rules'
    }
  ];

  const filteredCompliance = mockCompliance.filter(item => {
    const matchesStatus = selectedStatus === 'all' || item.status === selectedStatus;
    const matchesFrequency = selectedFrequency === 'all' || item.frequency === selectedFrequency;
    return matchesStatus && matchesFrequency;
  });

  const stats = {
    total: mockCompliance.length,
    compliant: mockCompliance.filter(i => i.status === 'compliant').length,
    dueSoon: mockCompliance.filter(i => i.status === 'due_soon').length,
    overdue: mockCompliance.filter(i => i.status === 'overdue').length
  };

  const statusColors = {
    compliant: 'bg-green-100 text-green-700 border-green-300',
    due_soon: 'bg-yellow-100 text-yellow-700 border-yellow-300',
    overdue: 'bg-red-100 text-red-700 border-red-300',
    not_applicable: 'bg-gray-100 text-gray-700 border-gray-300'
  };

  const statusIcons = {
    compliant: CheckCircle,
    due_soon: Clock,
    overdue: AlertCircle,
    not_applicable: CheckSquare
  };

  return (
    <div className="w-full h-full px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <CheckSquare className="h-6 w-6 text-red-600" />
          Labor Law Compliance Tracker
        </h1>
        <p className="text-sm text-gray-600 mt-1">Track Indian labor law compliance requirements and deadlines</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow-sm border border-blue-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Total Requirements</p>
              <p className="text-3xl font-bold text-blue-900 mt-1">{stats.total}</p>
            </div>
            <FileText className="h-10 w-10 text-blue-600 opacity-60" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg shadow-sm border border-green-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-green-600 uppercase tracking-wide">Compliant</p>
              <p className="text-3xl font-bold text-green-900 mt-1">{stats.compliant}</p>
            </div>
            <CheckCircle className="h-10 w-10 text-green-600 opacity-60" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg shadow-sm border border-yellow-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-yellow-600 uppercase tracking-wide">Due Soon</p>
              <p className="text-3xl font-bold text-yellow-900 mt-1">{stats.dueSoon}</p>
            </div>
            <Clock className="h-10 w-10 text-yellow-600 opacity-60" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg shadow-sm border border-red-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-red-600 uppercase tracking-wide">Overdue</p>
              <p className="text-3xl font-bold text-red-900 mt-1">{stats.overdue}</p>
            </div>
            <AlertCircle className="h-10 w-10 text-red-600 opacity-60" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Status</label>
            <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500">
              <option value="all">All Statuses</option>
              <option value="compliant">Compliant</option>
              <option value="due_soon">Due Soon</option>
              <option value="overdue">Overdue</option>
              <option value="not_applicable">Not Applicable</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Frequency</label>
            <select value={selectedFrequency} onChange={(e) => setSelectedFrequency(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500">
              <option value="all">All Frequencies</option>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="half_yearly">Half-Yearly</option>
              <option value="annual">Annual</option>
              <option value="as_needed">As Needed</option>
            </select>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {filteredCompliance.map((item) => {
          const StatusIcon = statusIcons[item.status];
          return (
            <div key={item.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-gray-900">{item.act}</h3>
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full border-2 ${statusColors[item.status]}`}>
                      <StatusIcon className="h-3 w-3 inline mr-1" />
                      {item.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 font-medium mb-2">{item.requirement}</p>
                  <p className="text-sm text-gray-600">{item.applicability}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-600 uppercase font-medium mb-1">Frequency</p>
                  <p className="text-sm font-bold text-gray-900">{item.frequency.replace('_', ' ')}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-600 uppercase font-medium mb-1">Next Due</p>
                  <p className="text-sm font-bold text-gray-900">{item.nextDue}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-600 uppercase font-medium mb-1">Responsibility</p>
                  <p className="text-sm font-bold text-gray-900">{item.responsibility}</p>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-xs text-gray-600 uppercase font-medium mb-2">Required Documents</p>
                <div className="flex flex-wrap gap-2">
                  {item.documents.map((doc, idx) => (
                    <span key={idx} className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full border border-blue-200">
                      {doc}
                    </span>
                  ))}
                </div>
              </div>

              {item.penalties && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-red-600 mt-0.5" />
                    <div>
                      <p className="text-xs text-red-600 uppercase font-medium mb-1">Non-Compliance Penalty</p>
                      <p className="text-sm text-red-800">{item.penalties}</p>
                    </div>
                  </div>
                </div>
              )}

              {item.lastCompleted && (
                <div className="mt-4 pt-4 border-t border-gray-200 text-xs text-gray-600">
                  Last Completed: {new Date(item.lastCompleted).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

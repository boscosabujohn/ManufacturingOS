'use client';

import { useState } from 'react';
import { BookOpen, Download, FileText, Users, Calendar, CheckCircle } from 'lucide-react';

interface StatutoryRegister {
  id: string;
  registerName: string;
  act: string;
  formNumber: string;
  applicability: string;
  frequency: 'daily' | 'monthly' | 'ongoing';
  responsibility: string;
  lastUpdated: string;
  status: 'up_to_date' | 'needs_update' | 'overdue';
  totalEntries: number;
  format: 'physical' | 'electronic' | 'both';
  retentionPeriod: string;
}

export default function Page() {
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedFormat, setSelectedFormat] = useState('all');

  const mockRegisters: StatutoryRegister[] = [
    {
      id: '1',
      registerName: 'Wage Register',
      act: 'Payment of Wages Act, 1936',
      formNumber: 'Form I',
      applicability: 'All establishments',
      frequency: 'monthly',
      responsibility: 'Payroll Department',
      lastUpdated: '2025-10-25',
      status: 'up_to_date',
      totalEntries: 245,
      format: 'both',
      retentionPeriod: '3 years from last entry'
    },
    {
      id: '2',
      registerName: 'Attendance Register',
      act: 'Factories Act, 1948',
      formNumber: 'Form 20',
      applicability: 'All factories',
      frequency: 'daily',
      responsibility: 'HR Department',
      lastUpdated: '2025-10-26',
      status: 'up_to_date',
      totalEntries: 7850,
      format: 'electronic',
      retentionPeriod: '5 years from last entry'
    },
    {
      id: '3',
      registerName: 'Overtime Register',
      act: 'Factories Act, 1948',
      formNumber: 'Form 21',
      applicability: 'Factories with overtime work',
      frequency: 'daily',
      responsibility: 'Production Department',
      lastUpdated: '2025-10-26',
      status: 'up_to_date',
      totalEntries: 892,
      format: 'both',
      retentionPeriod: '5 years from last entry'
    },
    {
      id: '4',
      registerName: 'Leave Register',
      act: 'Factories Act, 1948',
      formNumber: 'Form 22',
      applicability: 'All factories',
      frequency: 'ongoing',
      responsibility: 'HR Department',
      lastUpdated: '2025-10-24',
      status: 'needs_update',
      totalEntries: 1245,
      format: 'electronic',
      retentionPeriod: '3 years from last entry'
    },
    {
      id: '5',
      registerName: 'Accident Register',
      act: 'Factories Act, 1948',
      formNumber: 'Form 23',
      applicability: 'All factories',
      frequency: 'ongoing',
      responsibility: 'Safety Officer',
      lastUpdated: '2025-09-15',
      status: 'up_to_date',
      totalEntries: 12,
      format: 'both',
      retentionPeriod: '10 years from last entry'
    },
    {
      id: '6',
      registerName: 'Fines Register',
      act: 'Payment of Wages Act, 1936',
      formNumber: 'Form IV',
      applicability: 'Establishments imposing fines',
      frequency: 'ongoing',
      responsibility: 'HR Department',
      lastUpdated: '2025-10-01',
      status: 'up_to_date',
      totalEntries: 8,
      format: 'physical',
      retentionPeriod: '3 years from last entry'
    },
    {
      id: '7',
      registerName: 'Bonus Register',
      act: 'Payment of Bonus Act, 1965',
      formNumber: 'Form D',
      applicability: 'Establishments with 20+ employees',
      frequency: 'monthly',
      responsibility: 'Payroll Department',
      lastUpdated: '2025-09-30',
      status: 'needs_update',
      totalEntries: 245,
      format: 'electronic',
      retentionPeriod: '3 years from last entry'
    },
    {
      id: '8',
      registerName: 'Contract Labour Register',
      act: 'Contract Labour Act, 1970',
      formNumber: 'Form XIII',
      applicability: 'Establishments employing contract labour',
      frequency: 'daily',
      responsibility: 'Contract Manager',
      lastUpdated: '2025-10-20',
      status: 'overdue',
      totalEntries: 156,
      format: 'both',
      retentionPeriod: '5 years from last entry'
    },
    {
      id: '9',
      registerName: 'Muster Roll',
      act: 'Factories Act, 1948',
      formNumber: 'Form 13',
      applicability: 'All factories',
      frequency: 'daily',
      responsibility: 'HR Department',
      lastUpdated: '2025-10-26',
      status: 'up_to_date',
      totalEntries: 7850,
      format: 'electronic',
      retentionPeriod: '3 years from last entry'
    },
    {
      id: '10',
      registerName: 'Health Register',
      act: 'Factories Act, 1948',
      formNumber: 'Form 14',
      applicability: 'All factories',
      frequency: 'ongoing',
      responsibility: 'Medical Officer',
      lastUpdated: '2025-10-15',
      status: 'up_to_date',
      totalEntries: 356,
      format: 'both',
      retentionPeriod: '5 years from last entry'
    }
  ];

  const filteredRegisters = mockRegisters.filter(register => {
    const matchesStatus = selectedStatus === 'all' || register.status === selectedStatus;
    const matchesFormat = selectedFormat === 'all' || register.format === selectedFormat;
    return matchesStatus && matchesFormat;
  });

  const stats = {
    total: mockRegisters.length,
    upToDate: mockRegisters.filter(r => r.status === 'up_to_date').length,
    needsUpdate: mockRegisters.filter(r => r.status === 'needs_update').length,
    overdue: mockRegisters.filter(r => r.status === 'overdue').length
  };

  const statusColors = {
    up_to_date: 'bg-green-100 text-green-700 border-green-300',
    needs_update: 'bg-yellow-100 text-yellow-700 border-yellow-300',
    overdue: 'bg-red-100 text-red-700 border-red-300'
  };

  const formatBadgeColors = {
    physical: 'bg-blue-100 text-blue-700',
    electronic: 'bg-purple-100 text-purple-700',
    both: 'bg-teal-100 text-teal-700'
  };

  return (
    <div className="w-full h-full px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-red-600" />
          Statutory Labor Registers
        </h1>
        <p className="text-sm text-gray-600 mt-1">Maintain mandatory registers as per Indian labor laws</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow-sm border border-blue-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Total Registers</p>
              <p className="text-3xl font-bold text-blue-900 mt-1">{stats.total}</p>
            </div>
            <BookOpen className="h-10 w-10 text-blue-600 opacity-60" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg shadow-sm border border-green-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-green-600 uppercase tracking-wide">Up to Date</p>
              <p className="text-3xl font-bold text-green-900 mt-1">{stats.upToDate}</p>
            </div>
            <CheckCircle className="h-10 w-10 text-green-600 opacity-60" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg shadow-sm border border-yellow-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-yellow-600 uppercase tracking-wide">Needs Update</p>
              <p className="text-3xl font-bold text-yellow-900 mt-1">{stats.needsUpdate}</p>
            </div>
            <Calendar className="h-10 w-10 text-yellow-600 opacity-60" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg shadow-sm border border-red-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-red-600 uppercase tracking-wide">Overdue</p>
              <p className="text-3xl font-bold text-red-900 mt-1">{stats.overdue}</p>
            </div>
            <FileText className="h-10 w-10 text-red-600 opacity-60" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Status</label>
            <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500">
              <option value="all">All Statuses</option>
              <option value="up_to_date">Up to Date</option>
              <option value="needs_update">Needs Update</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Format</label>
            <select value={selectedFormat} onChange={(e) => setSelectedFormat(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500">
              <option value="all">All Formats</option>
              <option value="physical">Physical</option>
              <option value="electronic">Electronic</option>
              <option value="both">Both</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredRegisters.map((register) => (
          <div key={register.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-bold text-gray-900">{register.registerName}</h3>
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full border-2 ${statusColors[register.status]}`}>
                    {register.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
                <p className="text-sm text-gray-700 font-medium mb-1">{register.act}</p>
                <p className="text-xs text-gray-600">{register.formNumber}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-600 uppercase font-medium mb-1">Frequency</p>
                <p className="text-sm font-bold text-gray-900 capitalize">{register.frequency}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-600 uppercase font-medium mb-1">Format</p>
                <span className={`inline-block px-2 py-1 text-xs font-semibold rounded ${formatBadgeColors[register.format]}`}>
                  {register.format === 'both' ? 'Both' : register.format.charAt(0).toUpperCase() + register.format.slice(1)}
                </span>
              </div>
            </div>

            <div className="space-y-2 mb-4 text-sm">
              <div className="flex items-start gap-2">
                <Users className="h-4 w-4 text-gray-400 mt-0.5" />
                <div>
                  <span className="text-gray-600">Responsibility:</span>
                  <span className="font-semibold text-gray-900 ml-1">{register.responsibility}</span>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <FileText className="h-4 w-4 text-gray-400 mt-0.5" />
                <div>
                  <span className="text-gray-600">Total Entries:</span>
                  <span className="font-semibold text-gray-900 ml-1">{register.totalEntries.toLocaleString('en-IN')}</span>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Calendar className="h-4 w-4 text-gray-400 mt-0.5" />
                <div>
                  <span className="text-gray-600">Last Updated:</span>
                  <span className="font-semibold text-gray-900 ml-1">
                    {new Date(register.lastUpdated).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
              <p className="text-xs text-blue-600 uppercase font-medium mb-1">Applicability</p>
              <p className="text-sm text-blue-900">{register.applicability}</p>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-4">
              <p className="text-xs text-gray-600 uppercase font-medium mb-1">Retention Period</p>
              <p className="text-sm text-gray-900 font-semibold">{register.retentionPeriod}</p>
            </div>

            <div className="flex gap-2">
              <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium">
                <FileText className="h-4 w-4" />
                View Register
              </button>
              <button className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium text-gray-700">
                <Download className="h-4 w-4" />
                Export
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

'use client';

import React, { useState, useMemo } from 'react';
import {
  ClipboardCheck, Plus, Search, Edit3, Trash2, Calendar,
  CheckCircle, XCircle, AlertCircle, Clock, FileText, Users
} from 'lucide-react';

interface Audit {
  id: string;
  auditCode: string;
  auditName: string;
  auditType: 'Internal' | 'External' | 'Statutory' | 'Surveillance' | 'Certification' | 'Compliance' | 'Process' | 'Product' | 'Financial';
  auditCategory: 'Planned' | 'Unplanned' | 'Special' | 'Follow-up';
  standard?: string;
  schedule: {
    plannedDate: Date;
    duration: number;
    frequency?: 'Monthly' | 'Quarterly' | 'Half-Yearly' | 'Yearly' | 'One-time';
  };
  auditTeam: {
    leadAuditor: string;
    teamSize: number;
  };
  auditee: {
    department: string;
    responsiblePerson: string;
  };
  findings: {
    majorNCRs: number;
    minorNCRs: number;
    observations: number;
    OFIs: number;
  };
  reportDetails: {
    reportDate?: Date;
    overallResult?: 'Approved' | 'Approved with Observations' | 'Not Approved' | 'Pending';
  };
  costs: {
    auditFee: number;
    totalCost: number;
    currency: string;
  };
  status: 'Scheduled' | 'In Progress' | 'Completed' | 'Cancelled' | 'Postponed';
}

const mockAudits: Audit[] = [
  {
    id: '1',
    auditCode: 'AUD-INT-Q1-2024',
    auditName: 'Q1 2024 Internal Quality Audit',
    auditType: 'Internal',
    auditCategory: 'Planned',
    standard: 'ISO 9001:2015',
    schedule: {
      plannedDate: new Date('2024-03-15'),
      duration: 8,
      frequency: 'Quarterly'
    },
    auditTeam: {
      leadAuditor: 'Ms. Neha Kapoor',
      teamSize: 3
    },
    auditee: {
      department: 'Production',
      responsiblePerson: 'Mr. Rajesh Kumar'
    },
    findings: {
      majorNCRs: 0,
      minorNCRs: 1,
      observations: 0,
      OFIs: 1
    },
    reportDetails: {
      reportDate: new Date('2024-03-20'),
      overallResult: 'Approved with Observations'
    },
    costs: {
      auditFee: 0,
      totalCost: 5000,
      currency: 'INR'
    },
    status: 'Completed'
  },
  {
    id: '2',
    auditCode: 'AUD-EXT-ISO-2024',
    auditName: 'ISO 9001:2015 Surveillance Audit 2024',
    auditType: 'Surveillance',
    auditCategory: 'Planned',
    standard: 'ISO 9001:2015',
    schedule: {
      plannedDate: new Date('2024-06-10'),
      duration: 16,
      frequency: 'Yearly'
    },
    auditTeam: {
      leadAuditor: 'Mr. John Smith',
      teamSize: 2
    },
    auditee: {
      department: 'All Departments',
      responsiblePerson: 'Ms. Anjali Verma'
    },
    findings: {
      majorNCRs: 0,
      minorNCRs: 0,
      observations: 0,
      OFIs: 0
    },
    reportDetails: {},
    costs: {
      auditFee: 75000,
      totalCost: 100000,
      currency: 'INR'
    },
    status: 'Scheduled'
  },
  {
    id: '3',
    auditCode: 'AUD-INT-SAFETY-2024',
    auditName: 'Workplace Safety Audit 2024',
    auditType: 'Internal',
    auditCategory: 'Planned',
    standard: 'ISO 45001:2018',
    schedule: {
      plannedDate: new Date('2024-04-20'),
      duration: 6,
      frequency: 'Half-Yearly'
    },
    auditTeam: {
      leadAuditor: 'Mr. Arun Sharma',
      teamSize: 2
    },
    auditee: {
      department: 'Manufacturing',
      responsiblePerson: 'Mr. Vikram Singh'
    },
    findings: {
      majorNCRs: 0,
      minorNCRs: 0,
      observations: 0,
      OFIs: 0
    },
    reportDetails: {},
    costs: {
      auditFee: 0,
      totalCost: 3000,
      currency: 'INR'
    },
    status: 'In Progress'
  },
  {
    id: '4',
    auditCode: 'AUD-FIN-STAT-2024',
    auditName: 'Statutory Financial Audit FY 2023-24',
    auditType: 'Statutory',
    auditCategory: 'Planned',
    schedule: {
      plannedDate: new Date('2024-05-01'),
      duration: 20,
      frequency: 'Yearly'
    },
    auditTeam: {
      leadAuditor: 'CA. Ramesh Patel',
      teamSize: 4
    },
    auditee: {
      department: 'Finance',
      responsiblePerson: 'Ms. Priya Mehta'
    },
    findings: {
      majorNCRs: 0,
      minorNCRs: 0,
      observations: 0,
      OFIs: 0
    },
    reportDetails: {},
    costs: {
      auditFee: 150000,
      totalCost: 175000,
      currency: 'INR'
    },
    status: 'Scheduled'
  }
];

export default function AuditMaster() {
  const [audits, setAudits] = useState<Audit[]>(mockAudits);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');

  const filteredAudits = useMemo(() => {
    return audits.filter(audit => {
      const matchesSearch =
        audit.auditName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        audit.auditCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (audit.standard && audit.standard.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesType = filterType === 'All' || audit.auditType === filterType;
      const matchesStatus = filterStatus === 'All' || audit.status === filterStatus;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [audits, searchTerm, filterType, filterStatus]);

  const statistics = [
    {
      label: 'Total Audits',
      value: audits.length,
      icon: ClipboardCheck,
      color: 'blue'
    },
    {
      label: 'Completed Audits',
      value: audits.filter(a => a.status === 'Completed').length,
      icon: CheckCircle,
      color: 'green'
    },
    {
      label: 'Pending Audits',
      value: audits.filter(a => ['Scheduled', 'In Progress'].includes(a.status)).length,
      icon: Clock,
      color: 'orange'
    },
    {
      label: 'Open NCRs',
      value: audits.reduce((sum, a) => sum + a.findings.majorNCRs + a.findings.minorNCRs, 0),
      icon: AlertCircle,
      color: 'red'
    }
  ];

  const statusColors = {
    Scheduled: 'bg-blue-100 text-blue-800',
    'In Progress': 'bg-yellow-100 text-yellow-800',
    Completed: 'bg-green-100 text-green-800',
    Cancelled: 'bg-red-100 text-red-800',
    Postponed: 'bg-gray-100 text-gray-800'
  };

  const typeColors = {
    Internal: 'bg-blue-100 text-blue-800',
    External: 'bg-purple-100 text-purple-800',
    Statutory: 'bg-red-100 text-red-800',
    Surveillance: 'bg-green-100 text-green-800',
    Certification: 'bg-indigo-100 text-indigo-800',
    Compliance: 'bg-orange-100 text-orange-800',
    Process: 'bg-cyan-100 text-cyan-800',
    Product: 'bg-pink-100 text-pink-800',
    Financial: 'bg-emerald-100 text-emerald-800'
  };

  const resultColors = {
    Approved: 'bg-green-100 text-green-800',
    'Approved with Observations': 'bg-yellow-100 text-yellow-800',
    'Not Approved': 'bg-red-100 text-red-800',
    Pending: 'bg-gray-100 text-gray-800'
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Audit Master</h1>
          <p className="text-sm text-gray-600 mt-1">Manage internal and external audit schedules</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <Plus className="w-4 h-4" />
          Schedule Audit
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statistics.map((stat, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg bg-${stat.color}-100`}>
                <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by audit name, code, or standard..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="All">All Types</option>
              <option value="Internal">Internal</option>
              <option value="External">External</option>
              <option value="Statutory">Statutory</option>
              <option value="Surveillance">Surveillance</option>
              <option value="Certification">Certification</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="All">All Status</option>
              <option value="Scheduled">Scheduled</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Audits Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Audit Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type & Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Schedule
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Team & Auditee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Findings
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Result
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAudits.map((audit) => (
                <tr key={audit.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-green-100 rounded-lg">
                        <ClipboardCheck className="h-6 w-6 text-green-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{audit.auditName}</div>
                        <div className="text-sm text-gray-500">{audit.auditCode}</div>
                        {audit.standard && (
                          <div className="text-xs text-blue-600">{audit.standard}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${typeColors[audit.auditType]}`}>
                      {audit.auditType}
                    </span>
                    <div className="text-xs text-gray-500 mt-1">{audit.auditCategory}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm space-y-1">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-gray-400" />
                        <span className="text-gray-900">
                          {audit.schedule.plannedDate.toLocaleDateString()}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500">
                        Duration: {audit.schedule.duration} hours
                      </div>
                      {audit.schedule.frequency && (
                        <div className="text-xs text-blue-600">{audit.schedule.frequency}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm space-y-1">
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3 text-gray-400" />
                        <span className="text-gray-900">{audit.auditTeam.leadAuditor}</span>
                      </div>
                      <div className="text-xs text-gray-500">
                        Team: {audit.auditTeam.teamSize} members
                      </div>
                      <div className="text-xs text-gray-500">
                        {audit.auditee.department}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm space-y-1">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Major NCR:</span>
                        <span className={`font-semibold ${audit.findings.majorNCRs > 0 ? 'text-red-600' : 'text-green-600'}`}>
                          {audit.findings.majorNCRs}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Minor NCR:</span>
                        <span className={`font-semibold ${audit.findings.minorNCRs > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                          {audit.findings.minorNCRs}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">OFI:</span>
                        <span className="font-semibold text-blue-600">{audit.findings.OFIs}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {audit.reportDetails.overallResult ? (
                      <div className="space-y-1">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${resultColors[audit.reportDetails.overallResult]}`}>
                          {audit.reportDetails.overallResult}
                        </span>
                        {audit.reportDetails.reportDate && (
                          <div className="text-xs text-gray-500">
                            {audit.reportDetails.reportDate.toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="text-xs text-gray-500">Pending</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColors[audit.status]}`}>
                      {audit.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button className="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                        <Edit3 className="w-4 h-4 text-gray-600" />
                        <span className="text-gray-700">Edit</span>
                      </button>
                      <button className="inline-flex items-center gap-1.5 px-3 py-2 border border-red-300 rounded-lg hover:bg-red-50 text-sm">
                        <Trash2 className="w-4 h-4 text-red-600" />
                        <span className="text-red-600">Delete</span>
                      </button>
                      <button className="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                        <FileText className="w-4 h-4 text-gray-600" />
                        <span className="text-gray-700">Document</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Showing results */}
      <div className="text-sm text-gray-600">
        Showing {filteredAudits.length} of {audits.length} audits
      </div>
    </div>
  );
}

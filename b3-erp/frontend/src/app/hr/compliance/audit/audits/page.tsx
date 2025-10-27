'use client';

import { useState, useMemo } from 'react';
import { ClipboardCheck, Calendar, Search, Users, CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface ComplianceAudit {
  id: string;
  auditId: string;
  title: string;
  auditType: 'internal' | 'external' | 'statutory' | 'third_party';
  scope: string[];
  auditor: string;
  scheduledDate: string;
  completedDate?: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'overdue';
  findings: number;
  criticalFindings: number;
  complianceScore?: number;
  nextAuditDue?: string;
}

export default function Page() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const mockAudits: ComplianceAudit[] = [
    {
      id: '1',
      auditId: 'AUD2025001',
      title: 'Q1 2025 Labor Law Compliance Audit',
      auditType: 'statutory',
      scope: ['PF Compliance', 'ESI Compliance', 'Professional Tax', 'Minimum Wages Act'],
      auditor: 'Maharashtra Labour Commissioner',
      scheduledDate: '2025-02-15',
      status: 'scheduled',
      findings: 0,
      criticalFindings: 0,
      nextAuditDue: '2025-05-15'
    },
    {
      id: '2',
      auditId: 'AUD2025002',
      title: 'Annual POSH Compliance Audit 2024-25',
      auditType: 'internal',
      scope: ['ICC Constitution', 'Complaint Handling', 'Training Records', 'Annual Report'],
      auditor: 'Internal Audit Team',
      scheduledDate: '2025-01-20',
      completedDate: '2025-01-25',
      status: 'completed',
      findings: 2,
      criticalFindings: 0,
      complianceScore: 98,
      nextAuditDue: '2026-01-20'
    },
    {
      id: '3',
      auditId: 'AUD2024015',
      title: 'Factory License & Safety Compliance',
      auditType: 'statutory',
      scope: ['Factory License', 'Fire Safety', 'Safety Equipment', 'Occupational Health'],
      auditor: 'Maharashtra Factory Inspector',
      scheduledDate: '2024-12-10',
      completedDate: '2024-12-15',
      status: 'completed',
      findings: 5,
      criticalFindings: 1,
      complianceScore: 92,
      nextAuditDue: '2025-06-10'
    },
    {
      id: '4',
      auditId: 'AUD2024018',
      title: 'Employee Records & Documentation Audit',
      auditType: 'internal',
      scope: ['Employee Files', 'Contract Management', 'Leave Records', 'Attendance Logs'],
      auditor: 'HR Internal Audit',
      scheduledDate: '2024-11-25',
      completedDate: '2024-12-02',
      status: 'completed',
      findings: 8,
      criticalFindings: 2,
      complianceScore: 88,
      nextAuditDue: '2025-05-25'
    },
    {
      id: '5',
      auditId: 'AUD2025003',
      title: 'ISO 45001:2018 Surveillance Audit',
      auditType: 'third_party',
      scope: ['OH&S Management System', 'Risk Assessment', 'Incident Reporting', 'Training Compliance'],
      auditor: 'Bureau Veritas India',
      scheduledDate: '2025-03-10',
      status: 'scheduled',
      findings: 0,
      criticalFindings: 0,
      nextAuditDue: '2026-03-10'
    }
  ];

  const filteredAudits = useMemo(() => {
    return mockAudits.filter(audit => {
      const matchesSearch = audit.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           audit.auditId.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = selectedType === 'all' || audit.auditType === selectedType;
      const matchesStatus = selectedStatus === 'all' || audit.status === selectedStatus;
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [searchTerm, selectedType, selectedStatus, mockAudits]);

  const stats = {
    total: mockAudits.length,
    scheduled: mockAudits.filter(a => a.status === 'scheduled').length,
    completed: mockAudits.filter(a => a.status === 'completed').length,
    avgCompliance: Math.round(mockAudits.filter(a => a.complianceScore).reduce((sum, a) => sum + (a.complianceScore || 0), 0) / mockAudits.filter(a => a.complianceScore).length)
  };

  const typeColors = {
    internal: 'bg-blue-100 text-blue-700',
    external: 'bg-purple-100 text-purple-700',
    statutory: 'bg-red-100 text-red-700',
    third_party: 'bg-green-100 text-green-700'
  };

  const statusColors = {
    scheduled: 'bg-blue-100 text-blue-700',
    in_progress: 'bg-yellow-100 text-yellow-700',
    completed: 'bg-green-100 text-green-700',
    overdue: 'bg-red-100 text-red-700'
  };

  return (
    <div className="w-full h-full px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <ClipboardCheck className="h-6 w-6 text-indigo-600" />
          Compliance Audits Management
        </h1>
        <p className="text-sm text-gray-600 mt-1">Schedule, track, and manage compliance audits</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow-sm border border-blue-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Total Audits</p>
              <p className="text-3xl font-bold text-blue-900 mt-1">{stats.total}</p>
            </div>
            <ClipboardCheck className="h-10 w-10 text-blue-600 opacity-60" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg shadow-sm border border-yellow-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-yellow-600 uppercase tracking-wide">Scheduled</p>
              <p className="text-3xl font-bold text-yellow-900 mt-1">{stats.scheduled}</p>
            </div>
            <Calendar className="h-10 w-10 text-yellow-600 opacity-60" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg shadow-sm border border-green-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-green-600 uppercase tracking-wide">Completed</p>
              <p className="text-3xl font-bold text-green-900 mt-1">{stats.completed}</p>
            </div>
            <CheckCircle className="h-10 w-10 text-green-600 opacity-60" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg shadow-sm border border-indigo-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wide">Avg Compliance</p>
              <p className="text-3xl font-bold text-indigo-900 mt-1">{stats.avgCompliance}%</p>
            </div>
            <Users className="h-10 w-10 text-indigo-600 opacity-60" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search audits..."
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Audit Type</label>
            <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <option value="all">All Types</option>
              <option value="internal">Internal</option>
              <option value="external">External</option>
              <option value="statutory">Statutory</option>
              <option value="third_party">Third Party</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <option value="all">All Status</option>
              <option value="scheduled">Scheduled</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {filteredAudits.map((audit) => (
          <div key={audit.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-bold text-gray-900">{audit.title}</h3>
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${typeColors[audit.auditType]}`}>
                    {audit.auditType.replace('_', ' ').toUpperCase()}
                  </span>
                  <span className={`px-2 py-1 text-xs font-medium rounded ${statusColors[audit.status]}`}>
                    {audit.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
                <p className="text-sm text-gray-700 font-medium">{audit.auditId} | Auditor: {audit.auditor}</p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <p className="text-xs text-gray-600 uppercase font-medium mb-2">Audit Scope</p>
              <div className="flex flex-wrap gap-2">
                {audit.scope.map((item, idx) => (
                  <span key={idx} className="px-2 py-1 text-xs font-medium rounded bg-indigo-100 text-indigo-700">
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                <p className="text-xs text-blue-600 uppercase font-medium mb-1">Scheduled Date</p>
                <p className="text-sm font-bold text-blue-900">
                  {new Date(audit.scheduledDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
              </div>
              {audit.completedDate && (
                <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                  <p className="text-xs text-green-600 uppercase font-medium mb-1">Completed Date</p>
                  <p className="text-sm font-bold text-green-900">
                    {new Date(audit.completedDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
              )}
              {audit.complianceScore !== undefined && (
                <div className={`rounded-lg p-3 border ${audit.complianceScore >= 95 ? 'bg-green-50 border-green-200' : audit.complianceScore >= 85 ? 'bg-yellow-50 border-yellow-200' : 'bg-red-50 border-red-200'}`}>
                  <p className={`text-xs uppercase font-medium mb-1 ${audit.complianceScore >= 95 ? 'text-green-600' : audit.complianceScore >= 85 ? 'text-yellow-600' : 'text-red-600'}`}>
                    Compliance Score
                  </p>
                  <p className={`text-sm font-bold ${audit.complianceScore >= 95 ? 'text-green-900' : audit.complianceScore >= 85 ? 'text-yellow-900' : 'text-red-900'}`}>
                    {audit.complianceScore}%
                  </p>
                </div>
              )}
              {audit.nextAuditDue && (
                <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                  <p className="text-xs text-purple-600 uppercase font-medium mb-1">Next Audit Due</p>
                  <p className="text-sm font-bold text-purple-900">
                    {new Date(audit.nextAuditDue).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
              )}
            </div>

            {audit.status === 'completed' && (
              <div className="bg-gray-50 rounded-lg p-3 mb-4 border border-gray-200">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-600 uppercase font-medium mb-1">Total Findings</p>
                    <p className="text-2xl font-bold text-gray-900">{audit.findings}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 uppercase font-medium mb-1">Critical Findings</p>
                    <p className="text-2xl font-bold text-red-700">{audit.criticalFindings}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium">
                View Details
              </button>
              {audit.status === 'completed' && (
                <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm font-medium">
                  View Findings
                </button>
              )}
              {audit.status === 'scheduled' && (
                <button className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 text-sm font-medium">
                  Start Audit
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

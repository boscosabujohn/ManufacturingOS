'use client';

import React, { useState } from 'react';
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  FileText,
  Shield,
  Download,
  Upload,
  RefreshCw,
  Calendar,
  TrendingUp,
  Activity,
  Bell
} from 'lucide-react';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export type ComplianceStatus = 'compliant' | 'non_compliant' | 'pending' | 'overdue' | 'not_applicable';
export type ComplianceType = 'tax' | 'regulatory' | 'statutory' | 'internal' | 'audit';
export type Frequency = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annually';

export interface ComplianceRule {
  id: string;
  code: string;
  name: string;
  description: string;
  type: ComplianceType;
  frequency: Frequency;
  authority: string;
  applicableRegions: string[];
  isActive: boolean;
  automationEnabled: boolean;
  dueDate?: string;
  lastCompleted?: string;
  nextDue: string;
}

export interface ComplianceCheck {
  id: string;
  ruleId: string;
  ruleName: string;
  executedAt: string;
  executedBy: string;
  status: ComplianceStatus;
  score: number; // 0-100
  findings: Finding[];
  evidence: Evidence[];
  remediation?: string;
  dueDate: string;
  completedDate?: string;
}

export interface Finding {
  id: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  affectedRecords: number;
  recommendation: string;
  resolved: boolean;
}

export interface Evidence {
  id: string;
  type: 'document' | 'screenshot' | 'report' | 'certificate';
  name: string;
  uploadedAt: string;
  uploadedBy: string;
  fileSize: number;
}

export interface ComplianceReport {
  id: string;
  period: string;
  type: ComplianceType;
  generatedAt: string;
  overallScore: number;
  totalRules: number;
  compliantRules: number;
  nonCompliantRules: number;
  pendingRules: number;
}

export interface ComplianceStats {
  overallScore: number;
  totalRules: number;
  compliantCount: number;
  nonCompliantCount: number;
  pendingCount: number;
  overdueCount: number;
  checksThisMonth: number;
  automatedChecks: number;
}

export interface ComplianceAutomationData {
  rules: ComplianceRule[];
  checks: ComplianceCheck[];
  reports: ComplianceReport[];
  stats: ComplianceStats;
}

// ============================================================================
// PROPS
// ============================================================================

export interface ComplianceAutomationProps {
  data?: ComplianceAutomationData;
  onRunCheck?: (ruleId: string) => void;
  onGenerateReport?: (type: ComplianceType, period: string) => void;
  onExport?: (format: 'excel' | 'pdf') => void;
  editable?: boolean;
}

// ============================================================================
// COMPONENT
// ============================================================================

export default function ComplianceAutomation({
  data,
  onRunCheck,
  onGenerateReport,
  onExport,
  editable = false
}: ComplianceAutomationProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'rules' | 'checks' | 'reports'>('overview');
  const [selectedCheck, setSelectedCheck] = useState<ComplianceCheck | null>(null);

  const getStatusBadge = (status: ComplianceStatus) => {
    const styles = {
      compliant: 'bg-green-100 text-green-700 border-green-200',
      non_compliant: 'bg-red-100 text-red-700 border-red-200',
      pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      overdue: 'bg-orange-100 text-orange-700 border-orange-200',
      not_applicable: 'bg-gray-100 text-gray-700 border-gray-200'
    };

    const icons = {
      compliant: CheckCircle,
      non_compliant: XCircle,
      pending: Clock,
      overdue: AlertTriangle,
      not_applicable: FileText
    };

    const Icon = icons[status];

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${styles[status]}`}>
        <Icon className="w-3 h-3" />
        {status.replace('_', ' ').toUpperCase()}
      </span>
    );
  };

  const getTypeBadge = (type: ComplianceType) => {
    const styles = {
      tax: 'bg-blue-100 text-blue-700',
      regulatory: 'bg-purple-100 text-purple-700',
      statutory: 'bg-indigo-100 text-indigo-700',
      internal: 'bg-cyan-100 text-cyan-700',
      audit: 'bg-pink-100 text-pink-700'
    };

    return <span className={`px-2 py-1 rounded text-xs font-medium ${styles[type]}`}>{type.toUpperCase()}</span>;
  };

  const getSeverityBadge = (severity: Finding['severity']) => {
    const styles = {
      low: 'bg-blue-100 text-blue-700',
      medium: 'bg-yellow-100 text-yellow-700',
      high: 'bg-orange-100 text-orange-700',
      critical: 'bg-red-100 text-red-700'
    };

    return <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[severity]}`}>{severity.toUpperCase()}</span>;
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const compliancePercentage = ((data?.stats.compliantCount || 0) / (data?.stats.totalRules || 1)) * 100;

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Shield className="w-7 h-7 text-indigo-600" />
            Compliance Automation
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Automated compliance monitoring and regulatory reporting
          </p>
        </div>
        <div className="flex items-center gap-3">
          {editable && (
            <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 shadow-md">
              <RefreshCw className="w-4 h-4" />
              Run All Checks
            </button>
          )}
          <button
            onClick={() => onExport?.('pdf')}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <div className="md:col-span-2 bg-gradient-to-br from-indigo-50 to-indigo-100 border border-indigo-200 rounded-lg p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs font-medium text-indigo-600 uppercase">Overall Compliance</p>
              <p className="text-3xl font-bold text-indigo-900 mt-1">{compliancePercentage.toFixed(1)}%</p>
            </div>
            <div className="relative w-20 h-20">
              <svg className="transform -rotate-90 w-20 h-20">
                <circle
                  cx="40"
                  cy="40"
                  r="32"
                  stroke="#e0e7ff"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="40"
                  cy="40"
                  r="32"
                  stroke="#4f46e5"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={`${2 * Math.PI * 32}`}
                  strokeDashoffset={`${2 * Math.PI * 32 * (1 - compliancePercentage / 100)}`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
          </div>
          <div className="text-xs text-indigo-600">
            Score: {data?.stats.overallScore || 0}/100
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-green-600 uppercase">Compliant</p>
              <p className="text-2xl font-bold text-green-900 mt-1">{data?.stats.compliantCount}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600 opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-red-600 uppercase">Non-Compliant</p>
              <p className="text-2xl font-bold text-red-900 mt-1">{data?.stats.nonCompliantCount}</p>
            </div>
            <XCircle className="w-8 h-8 text-red-600 opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-yellow-600 uppercase">Pending</p>
              <p className="text-2xl font-bold text-yellow-900 mt-1">{data?.stats.pendingCount}</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-600 opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-orange-600 uppercase">Overdue</p>
              <p className="text-2xl font-bold text-orange-900 mt-1">{data?.stats.overdueCount}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-orange-600 opacity-80" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-4">
          {[
            { id: 'overview', label: 'Overview', icon: Activity },
            { id: 'rules', label: 'Compliance Rules', icon: Shield },
            { id: 'checks', label: 'Recent Checks', icon: CheckCircle },
            { id: 'reports', label: 'Reports', icon: FileText }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Compliance by Type */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
              <h3 className="text-lg font-semibold text-gray-900">Compliance by Type</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {(['tax', 'regulatory', 'statutory', 'internal', 'audit'] as ComplianceType[]).map((type) => {
                  const typeRules = data?.rules.filter((r) => r.type === type) || [];
                  const total = typeRules.length;
                  const compliant = data?.checks.filter(
                    (c) => typeRules.some((r) => r.id === c.ruleId) && c.status === 'compliant'
                  ).length || 0;
                  const percentage = total > 0 ? (compliant / total) * 100 : 0;

                  return (
                    <div key={type}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {getTypeBadge(type)}
                          <span className="text-sm text-gray-600">{total} rules</span>
                        </div>
                        <span className="text-sm font-semibold text-gray-900">
                          {compliant}/{total} ({percentage.toFixed(0)}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            percentage >= 90
                              ? 'bg-green-500'
                              : percentage >= 70
                              ? 'bg-blue-500'
                              : percentage >= 50
                              ? 'bg-yellow-500'
                              : 'bg-red-500'
                          }`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Upcoming Deadlines */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-orange-50 to-red-50">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-orange-600" />
                Upcoming Deadlines
              </h3>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                {data?.checks
                  .filter((c) => c.status === 'pending' || c.status === 'overdue')
                  .slice(0, 5)
                  .map((check) => (
                    <div key={check.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{check.ruleName}</p>
                        <p className="text-xs text-gray-500 mt-1">Due: {formatDate(check.dueDate)}</p>
                      </div>
                      {getStatusBadge(check.status)}
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rules Tab */}
      {activeTab === 'rules' && (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Rule Code</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Authority</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Frequency</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Next Due</th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase">Automation</th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data?.rules.map((rule) => (
                  <tr key={rule.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-mono text-sm text-gray-900">{rule.code}</td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{rule.name}</p>
                        <p className="text-xs text-gray-500 mt-1 max-w-xs truncate">{rule.description}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">{getTypeBadge(rule.type)}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{rule.authority}</td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-900 capitalize">{rule.frequency}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{formatDate(rule.nextDue)}</td>
                    <td className="px-6 py-4 text-center">
                      {rule.automationEnabled ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                          <CheckCircle className="w-3 h-3" />
                          Enabled
                        </span>
                      ) : (
                        <span className="text-xs text-gray-500">Manual</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {editable && (
                        <button
                          onClick={() => onRunCheck?.(rule.id)}
                          className="px-3 py-1 bg-indigo-600 text-white text-xs rounded hover:bg-indigo-700"
                        >
                          Run Check
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Checks Tab */}
      {activeTab === 'checks' && (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Rule</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Executed</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">By</th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase">Score</th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase">Findings</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Due Date</th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase">Status</th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data?.checks.map((check) => (
                  <tr key={check.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 max-w-xs truncate">{check.ruleName}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{formatDate(check.executedAt)}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{check.executedBy}</td>
                    <td className="px-6 py-4 text-center">
                      <div className="inline-flex items-center gap-2">
                        <span
                          className={`text-sm font-bold ${
                            check.score >= 90
                              ? 'text-green-600'
                              : check.score >= 70
                              ? 'text-blue-600'
                              : check.score >= 50
                              ? 'text-yellow-600'
                              : 'text-red-600'
                          }`}
                        >
                          {check.score}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {check.findings.length > 0 ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700">
                          <AlertTriangle className="w-3 h-3" />
                          {check.findings.length}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-500">None</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{formatDate(check.dueDate)}</td>
                    <td className="px-6 py-4 text-center">{getStatusBadge(check.status)}</td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => setSelectedCheck(check)}
                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                      >
                        <FileText className="w-4 h-4 text-indigo-600" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Reports Tab */}
      {activeTab === 'reports' && (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Compliance Reports</h3>
              {editable && (
                <button className="flex items-center gap-2 px-3 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700">
                  <FileText className="w-4 h-4" />
                  Generate Report
                </button>
              )}
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Period</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Generated</th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase">Overall Score</th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase">Compliant</th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase">Non-Compliant</th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data?.reports.map((report) => (
                  <tr key={report.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{report.period}</td>
                    <td className="px-6 py-4">{getTypeBadge(report.type)}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{formatDate(report.generatedAt)}</td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`text-sm font-bold ${
                          report.overallScore >= 90
                            ? 'text-green-600'
                            : report.overallScore >= 70
                            ? 'text-blue-600'
                            : 'text-red-600'
                        }`}
                      >
                        {report.overallScore}%
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center text-sm text-green-600 font-medium">
                      {report.compliantRules}/{report.totalRules}
                    </td>
                    <td className="px-6 py-4 text-center text-sm text-red-600 font-medium">
                      {report.nonCompliantRules}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                        <Download className="w-4 h-4 text-indigo-600" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Check Details Modal */}
      {selectedCheck && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">Compliance Check Details</h3>
                <button onClick={() => setSelectedCheck(null)} className="text-gray-400 hover:text-gray-600">
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">Rule</p>
                  <p className="text-lg font-medium text-gray-900 mt-1">{selectedCheck.ruleName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Status</p>
                  <div className="mt-1">{getStatusBadge(selectedCheck.status)}</div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Score</p>
                  <p className="text-2xl font-bold text-indigo-600 mt-1">{selectedCheck.score}%</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Executed</p>
                  <p className="text-sm text-gray-900 mt-1">
                    {formatDate(selectedCheck.executedAt)} by {selectedCheck.executedBy}
                  </p>
                </div>
              </div>

              {/* Findings */}
              {selectedCheck.findings.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Findings ({selectedCheck.findings.length})</h4>
                  <div className="space-y-3">
                    {selectedCheck.findings.map((finding) => (
                      <div key={finding.id} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {getSeverityBadge(finding.severity)}
                            <span className="text-sm text-gray-600">{finding.affectedRecords} records affected</span>
                          </div>
                          {finding.resolved && (
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Resolved</span>
                          )}
                        </div>
                        <p className="text-sm text-gray-900 mb-2">{finding.description}</p>
                        <p className="text-xs text-blue-600">
                          <strong>Recommendation:</strong> {finding.recommendation}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Evidence */}
              {selectedCheck.evidence.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Supporting Evidence</h4>
                  <div className="space-y-2">
                    {selectedCheck.evidence.map((evidence) => (
                      <div key={evidence.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-blue-600" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">{evidence.name}</p>
                            <p className="text-xs text-gray-500">
                              Uploaded by {evidence.uploadedBy} on {formatDate(evidence.uploadedAt)}
                            </p>
                          </div>
                        </div>
                        <button className="p-1 hover:bg-blue-100 rounded">
                          <Download className="w-4 h-4 text-blue-600" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { Shield, AlertTriangle, CheckCircle, Clock, FileText, Calendar, Bell, TrendingUp, Activity, Download, Eye, Plus } from 'lucide-react';
import { AddComplianceRuleModal, CreateAnalyticsReportModal, CreateOnboardingWorkflowModal, InitiateReviewCycleModal, CreatePolicyModal } from './HRAdvancedModals';

export type ComplianceStatus = 'compliant' | 'at-risk' | 'non-compliant' | 'pending-review';
export type ComplianceCategory = 'labor-law' | 'tax' | 'statutory' | 'data-privacy' | 'safety' | 'contractual';

export interface ComplianceRequirement {
  id: string;
  category: ComplianceCategory;
  title: string;
  description: string;
  regulation: string;
  status: ComplianceStatus;
  dueDate: string;
  assignedTo: string;
  lastReviewDate?: string;
  nextReviewDate: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  evidence?: string[];
}

export interface ComplianceAlert {
  id: string;
  type: 'deadline' | 'violation' | 'renewal' | 'audit';
  severity: 'info' | 'warning' | 'error' | 'critical';
  title: string;
  message: string;
  requirement: string;
  createdAt: string;
  dueDate?: string;
  acknowledged: boolean;
}

export default function ComplianceTracking() {
  const [activeTab, setActiveTab] = useState<'overview' | 'requirements' | 'alerts' | 'reports'>('overview');

  const requirements: ComplianceRequirement[] = [
    {
      id: 'req-001',
      category: 'labor-law',
      title: 'Minimum Wages Compliance',
      description: 'Ensure all employees receive at least minimum wage as per state regulations',
      regulation: 'Minimum Wages Act, 1948',
      status: 'compliant',
      dueDate: '2025-12-31',
      assignedTo: 'HR Manager',
      lastReviewDate: '2025-01-15',
      nextReviewDate: '2025-04-15',
      riskLevel: 'high',
      evidence: ['wage-register.pdf', 'compliance-certificate.pdf'],
    },
    {
      id: 'req-002',
      category: 'statutory',
      title: 'PF Registration & Compliance',
      description: 'Maintain PF registration and timely remittance',
      regulation: 'EPF & MP Act, 1952',
      status: 'compliant',
      dueDate: '2025-02-15',
      assignedTo: 'Payroll Team',
      lastReviewDate: '2025-01-10',
      nextReviewDate: '2025-02-10',
      riskLevel: 'critical',
    },
    {
      id: 'req-003',
      category: 'data-privacy',
      title: 'Employee Data Protection',
      description: 'Implement data protection measures for employee PII',
      regulation: 'IT Act, 2000 & DPDP Act, 2023',
      status: 'at-risk',
      dueDate: '2025-03-31',
      assignedTo: 'IT Security',
      nextReviewDate: '2025-02-28',
      riskLevel: 'high',
    },
    {
      id: 'req-004',
      category: 'safety',
      title: 'Workplace Safety Compliance',
      description: 'Annual safety audit and training certification',
      regulation: 'Factories Act, 1948',
      status: 'pending-review',
      dueDate: '2025-06-30',
      assignedTo: 'Safety Officer',
      nextReviewDate: '2025-05-31',
      riskLevel: 'medium',
    },
  ];

  const alerts: ComplianceAlert[] = [
    {
      id: 'alert-001',
      type: 'deadline',
      severity: 'warning',
      title: 'PF Return Due in 5 Days',
      message: 'Monthly PF return for January 2025 is due on February 15, 2025',
      requirement: 'PF Registration & Compliance',
      createdAt: '2025-02-10',
      dueDate: '2025-02-15',
      acknowledged: false,
    },
    {
      id: 'alert-002',
      type: 'renewal',
      severity: 'error',
      title: 'License Renewal Required',
      message: 'Factory license expires on March 31, 2025. Renewal process should be initiated.',
      requirement: 'Factory License',
      createdAt: '2025-02-01',
      dueDate: '2025-03-31',
      acknowledged: false,
    },
    {
      id: 'alert-003',
      type: 'audit',
      severity: 'info',
      title: 'Upcoming Labor Law Audit',
      message: 'Labor department audit scheduled for March 2025',
      requirement: 'Labor Law Compliance',
      createdAt: '2025-01-20',
      dueDate: '2025-03-15',
      acknowledged: true,
    },
  ];

  const getStatusColor = (status: ComplianceStatus) => {
    switch (status) {
      case 'compliant': return 'bg-green-100 text-green-800';
      case 'at-risk': return 'bg-yellow-100 text-yellow-800';
      case 'non-compliant': return 'bg-red-100 text-red-800';
      case 'pending-review': return 'bg-blue-100 text-blue-800';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'critical': return 'bg-red-600 text-white';
      case 'high': return 'bg-orange-600 text-white';
      case 'medium': return 'bg-yellow-600 text-white';
      case 'low': return 'bg-green-600 text-white';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case 'error': return <AlertTriangle className="w-5 h-5 text-orange-600" />;
      case 'warning': return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'info': return <Bell className="w-5 h-5 text-blue-600" />;
    }
  };

  const complianceStats = {
    total: requirements.length,
    compliant: requirements.filter(r => r.status === 'compliant').length,
    atRisk: requirements.filter(r => r.status === 'at-risk').length,
    nonCompliant: requirements.filter(r => r.status === 'non-compliant').length,
    pendingReview: requirements.filter(r => r.status === 'pending-review').length,
    complianceScore: 85,
  };

  return (
    <div className="w-full h-full bg-gradient-to-br from-gray-50 via-green-50 to-emerald-50 p-6">
      <div>
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Compliance Tracking & Alerts</h1>
          <p className="text-gray-600">Monitor and manage regulatory compliance requirements</p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="flex">
            {['overview', 'requirements', 'alerts', 'reports'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`flex-1 px-6 py-4 font-medium transition-colors ${
                  activeTab === tab
                    ? 'text-green-600 border-b-2 border-green-600 bg-green-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1).replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
                  <div className="flex items-center gap-3 mb-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <p className="text-sm font-medium text-gray-700">Compliant</p>
                  </div>
                  <p className="text-3xl font-bold text-green-600">{complianceStats.compliant}</p>
                </div>
                <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-lg p-4 border border-yellow-200">
                  <div className="flex items-center gap-3 mb-2">
                    <Clock className="w-5 h-5 text-yellow-600" />
                    <p className="text-sm font-medium text-gray-700">At Risk</p>
                  </div>
                  <p className="text-3xl font-bold text-yellow-600">{complianceStats.atRisk}</p>
                </div>
                <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-lg p-4 border border-red-200">
                  <div className="flex items-center gap-3 mb-2">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                    <p className="text-sm font-medium text-gray-700">Non-Compliant</p>
                  </div>
                  <p className="text-3xl font-bold text-red-600">{complianceStats.nonCompliant}</p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200">
                  <div className="flex items-center gap-3 mb-2">
                    <TrendingUp className="w-5 h-5 text-purple-600" />
                    <p className="text-sm font-medium text-gray-700">Compliance Score</p>
                  </div>
                  <p className="text-3xl font-bold text-purple-600">{complianceStats.complianceScore}%</p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Alerts</h3>
                <div className="space-y-3">
                  {alerts.slice(0, 3).map((alert) => (
                    <div key={alert.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="flex items-start gap-3">
                        {getSeverityIcon(alert.severity)}
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-semibold text-gray-900">{alert.title}</h4>
                            {!alert.acknowledged && (
                              <button className="text-sm text-blue-600 hover:text-blue-700">Acknowledge</button>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{alert.message}</p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                            <span>{alert.createdAt}</span>
                            {alert.dueDate && <span>Due: {alert.dueDate}</span>}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'requirements' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Compliance Requirements</h2>
                <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                  <Plus className="w-4 h-4" />
                  Add Requirement
                </button>
              </div>

              {requirements.map((req) => (
                <div key={req.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900">{req.title}</h3>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getRiskColor(req.riskLevel)}`}>
                          {req.riskLevel.toUpperCase()}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(req.status)}`}>
                          {req.status.replace('-', ' ').toUpperCase()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{req.description}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <FileText className="w-4 h-4" />
                          {req.regulation}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          Next Review: {req.nextReviewDate}
                        </span>
                      </div>
                    </div>
                    <button className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
                      <Eye className="w-4 h-4" />
                      Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'alerts' && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Compliance Alerts</h2>
              {alerts.map((alert) => (
                <div key={alert.id} className={`rounded-lg p-4 border-l-4 ${
                  alert.severity === 'critical' ? 'bg-red-50 border-red-600' :
                  alert.severity === 'error' ? 'bg-orange-50 border-orange-600' :
                  alert.severity === 'warning' ? 'bg-yellow-50 border-yellow-600' :
                  'bg-blue-50 border-blue-600'
                }`}>
                  <div className="flex items-start gap-3">
                    {getSeverityIcon(alert.severity)}
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-900">{alert.title}</h3>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          alert.acknowledged ? 'bg-gray-200 text-gray-700' : 'bg-blue-600 text-white'
                        }`}>
                          {alert.acknowledged ? 'Acknowledged' : 'New'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">{alert.message}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-xs text-gray-600">
                          <span>Type: {alert.type}</span>
                          <span>Created: {alert.createdAt}</span>
                          {alert.dueDate && <span>Due: {alert.dueDate}</span>}
                        </div>
                        {!alert.acknowledged && (
                          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                            Acknowledge Alert →
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Compliance Reports</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { name: 'Monthly Compliance Summary', icon: FileText },
                  { name: 'Risk Assessment Report', icon: AlertTriangle },
                  { name: 'Audit Trail Report', icon: Activity },
                  { name: 'Statutory Compliance Status', icon: Shield },
                ].map((report, index) => {
                  const Icon = report.icon;
                  return (
                    <div key={index} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer">
                      <Icon className="w-8 h-8 text-green-600 mb-3" />
                      <h3 className="font-semibold text-gray-900 mb-2">{report.name}</h3>
                      <button className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium">
                        <Download className="w-4 h-4" />
                        Generate Report
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

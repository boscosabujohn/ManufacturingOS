'use client'

import { useState } from 'react'
import { GitBranch, FileText, CheckCircle, XCircle, Clock, AlertTriangle, DollarSign, Calendar, Users } from 'lucide-react'

export type ChangeStatus = 'submitted' | 'under-review' | 'approved' | 'rejected' | 'implemented' | 'cancelled';
export type ChangeType = 'scope' | 'schedule' | 'budget' | 'resource' | 'technical' | 'quality';
export type ImpactLevel = 'critical' | 'high' | 'medium' | 'low';

export interface ChangeRequest {
  id: string;
  projectId: string;
  projectName: string;
  title: string;
  description: string;
  type: ChangeType;
  status: ChangeStatus;
  impact: ImpactLevel;
  submittedBy: string;
  submittedDate: string;
  reviewedBy?: string;
  reviewedDate?: string;
  implementedDate?: string;
  costImpact: number; // in rupees
  scheduleImpact: number; // in days
  scopeImpact: string;
  justification: string;
  approvers: {
    name: string;
    role: string;
    decision: 'pending' | 'approved' | 'rejected';
    comments?: string;
  }[];
}

export interface ChangeImpactAnalysis {
  changeRequestId: string;
  affectedProjects: string[];
  affectedResources: string[];
  budgetVariance: number;
  scheduleVariance: number;
  riskAssessment: {
    risk: string;
    likelihood: 'high' | 'medium' | 'low';
    impact: 'high' | 'medium' | 'low';
    mitigation: string;
  }[];
}

export default function ChangeControl() {
  const [viewMode, setViewMode] = useState<'requests' | 'analysis'>('requests');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const [changeRequests] = useState<ChangeRequest[]>([
    {
      id: 'CR-001',
      projectId: 'PRJ-2025-001',
      projectName: 'Hydraulic Press Installation',
      title: 'Add vibration monitoring system',
      description: 'Customer requested addition of real-time vibration monitoring and alerting system to detect potential equipment failures',
      type: 'scope',
      status: 'approved',
      impact: 'medium',
      submittedBy: 'Rajesh Kumar',
      submittedDate: '2025-10-05',
      reviewedBy: 'Project Steering Committee',
      reviewedDate: '2025-10-08',
      implementedDate: '2025-10-12',
      costImpact: 2500000,
      scheduleImpact: 7,
      scopeImpact: 'Add vibration sensors, monitoring software, and alert system',
      justification: 'Critical for predictive maintenance and reducing unplanned downtime',
      approvers: [
        { name: 'Sunita Verma', role: 'Project Manager', decision: 'approved', comments: 'Aligned with quality objectives' },
        { name: 'Finance Head', role: 'CFO', decision: 'approved', comments: 'Budget adjustment approved' },
        { name: 'Customer Sponsor', role: 'Client', decision: 'approved', comments: 'Essential requirement' }
      ]
    },
    {
      id: 'CR-002',
      projectId: 'PRJ-2025-003',
      projectName: 'Automation System',
      title: 'Extend integration testing phase by 2 weeks',
      description: 'Integration testing uncovered 8 critical defects requiring extended testing period',
      type: 'schedule',
      status: 'under-review',
      impact: 'high',
      submittedBy: 'Priya Sharma',
      submittedDate: '2025-10-18',
      costImpact: 1500000,
      scheduleImpact: 14,
      scopeImpact: 'No scope change - quality improvement only',
      justification: 'Quality risks are too high to proceed without additional testing',
      approvers: [
        { name: 'Sunita Verma', role: 'Project Manager', decision: 'approved', comments: 'Quality is priority' },
        { name: 'Finance Head', role: 'CFO', decision: 'pending', comments: '' },
        { name: 'Customer Sponsor', role: 'Client', decision: 'pending', comments: '' }
      ]
    },
    {
      id: 'CR-003',
      projectId: 'PRJ-2025-002',
      projectName: 'CNC Machine Upgrade',
      title: 'Change supplier for control system components',
      description: 'Original supplier cannot meet delivery timeline, proposing alternate supplier with 10% cost increase',
      type: 'resource',
      status: 'approved',
      impact: 'medium',
      submittedBy: 'Procurement Team',
      submittedDate: '2025-10-10',
      reviewedBy: 'Project Steering Committee',
      reviewedDate: '2025-10-11',
      costImpact: 500000,
      scheduleImpact: -5,
      scopeImpact: 'No change - equivalent components from alternate supplier',
      justification: 'Avoid 3-week delay by switching to supplier with immediate availability',
      approvers: [
        { name: 'Sunita Verma', role: 'Project Manager', decision: 'approved' },
        { name: 'Finance Head', role: 'CFO', decision: 'approved' },
        { name: 'Technical Lead', role: 'Engineer', decision: 'approved', comments: 'Components are compatible' }
      ]
    },
    {
      id: 'CR-004',
      projectId: 'PRJ-2025-001',
      projectName: 'Hydraulic Press Installation',
      title: 'Upgrade hydraulic pump capacity by 20%',
      description: 'Customer wants higher capacity for future expansion capability',
      type: 'technical',
      status: 'rejected',
      impact: 'high',
      submittedBy: 'Customer Sponsor',
      submittedDate: '2025-10-01',
      reviewedBy: 'Project Steering Committee',
      reviewedDate: '2025-10-02',
      costImpact: 5000000,
      scheduleImpact: 21,
      scopeImpact: 'Major redesign of hydraulic system',
      justification: 'Future-proofing for anticipated production increase',
      approvers: [
        { name: 'Sunita Verma', role: 'Project Manager', decision: 'rejected', comments: 'Too late in project lifecycle' },
        { name: 'Finance Head', role: 'CFO', decision: 'rejected', comments: 'Budget impact too high' },
        { name: 'Technical Lead', role: 'Engineer', decision: 'rejected', comments: 'Requires complete redesign' }
      ]
    },
    {
      id: 'CR-005',
      projectId: 'PRJ-2025-004',
      projectName: 'Production Line Setup',
      title: 'Add 2 additional engineers to team',
      description: 'Current team size insufficient to meet aggressive timeline',
      type: 'resource',
      status: 'submitted',
      impact: 'medium',
      submittedBy: 'Project Manager C',
      submittedDate: '2025-10-20',
      costImpact: 3000000,
      scheduleImpact: 0,
      scopeImpact: 'No scope change - resource augmentation only',
      justification: 'Prevent schedule delays and reduce team burnout',
      approvers: [
        { name: 'HR Head', role: 'HR', decision: 'pending' },
        { name: 'Finance Head', role: 'CFO', decision: 'pending' },
        { name: 'PMO Director', role: 'PMO', decision: 'pending' }
      ]
    }
  ]);

  const [impactAnalysis] = useState<ChangeImpactAnalysis[]>([
    {
      changeRequestId: 'CR-001',
      affectedProjects: ['PRJ-2025-001'],
      affectedResources: ['Rajesh Kumar', 'Amit Patel', 'Integration Team'],
      budgetVariance: 2500000,
      scheduleVariance: 7,
      riskAssessment: [
        {
          risk: 'Integration complexity may extend timeline',
          likelihood: 'medium',
          impact: 'medium',
          mitigation: 'Assign dedicated integration engineer'
        },
        {
          risk: 'Vendor delivery delay for sensors',
          likelihood: 'low',
          impact: 'high',
          mitigation: 'Pre-order sensors with advance payment'
        }
      ]
    },
    {
      changeRequestId: 'CR-002',
      affectedProjects: ['PRJ-2025-003', 'PRJ-2025-004'],
      affectedResources: ['Priya Sharma', 'QA Team', 'Integration Team'],
      budgetVariance: 1500000,
      scheduleVariance: 14,
      riskAssessment: [
        {
          risk: 'Downstream project PRJ-2025-004 will be delayed',
          likelihood: 'high',
          impact: 'medium',
          mitigation: 'Adjust PRJ-2025-004 timeline and inform stakeholders'
        },
        {
          risk: 'Customer dissatisfaction with delay',
          likelihood: 'medium',
          impact: 'high',
          mitigation: 'Present quality benefits and revised timeline to customer'
        }
      ]
    },
    {
      changeRequestId: 'CR-005',
      affectedProjects: ['PRJ-2025-004'],
      affectedResources: ['Project Manager C', 'Engineering Team'],
      budgetVariance: 3000000,
      scheduleVariance: 0,
      riskAssessment: [
        {
          risk: 'Time required to onboard new engineers',
          likelihood: 'high',
          impact: 'low',
          mitigation: 'Assign experienced mentor to each new engineer'
        },
        {
          risk: 'Availability of qualified engineers',
          likelihood: 'medium',
          impact: 'high',
          mitigation: 'Engage recruitment agency immediately'
        }
      ]
    }
  ]);

  const getStatusColor = (status: ChangeStatus) => {
    switch (status) {
      case 'submitted':
        return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'under-review':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'approved':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'rejected':
        return 'bg-red-100 text-red-700 border-red-300';
      case 'implemented':
        return 'bg-purple-100 text-purple-700 border-purple-300';
      case 'cancelled':
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getImpactColor = (impact: ImpactLevel) => {
    switch (impact) {
      case 'critical':
        return 'text-red-600';
      case 'high':
        return 'text-orange-600';
      case 'medium':
        return 'text-yellow-600';
      case 'low':
        return 'text-green-600';
    }
  };

  const getDecisionIcon = (decision: 'pending' | 'approved' | 'rejected') => {
    switch (decision) {
      case 'approved':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-600" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return `₹${(amount / 100000).toFixed(2)}L`;
  };

  const filteredRequests = filterStatus === 'all'
    ? changeRequests
    : changeRequests.filter(r => r.status === filterStatus);

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="bg-white shadow-lg p-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <GitBranch className="h-8 w-8 text-orange-600" />
              Change Control Workflow
            </h2>
            <p className="text-gray-600 mt-1">Manage and track project change requests</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('requests')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                viewMode === 'requests'
                  ? 'bg-orange-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Change Requests
            </button>
            <button
              onClick={() => setViewMode('analysis')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                viewMode === 'analysis'
                  ? 'bg-orange-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Impact Analysis
            </button>
          </div>
        </div>
      </div>

      {viewMode === 'requests' && (
        <>
          {/* Filter */}
          <div className="bg-white shadow-md p-3">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Filter by Status:</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="all">All Requests</option>
                <option value="submitted">Submitted</option>
                <option value="under-review">Under Review</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="implemented">Implemented</option>
              </select>
            </div>
          </div>

          {/* Change Requests */}
          <div className="bg-white shadow-lg border border-gray-200">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-orange-50 to-yellow-50">
              <h3 className="text-lg font-semibold text-gray-900">
                Change Requests ({filteredRequests.length})
              </h3>
            </div>

            <div className="p-6">
              <div className="space-y-3">
                {filteredRequests.map((request) => (
                  <div key={request.id} className="p-5 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                    {/* Request Header */}
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="text-lg font-bold text-gray-900">{request.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{request.id} • {request.projectName}</p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(request.status)}`}>
                          {request.status.toUpperCase()}
                        </span>
                        <span className={`text-sm font-bold ${getImpactColor(request.impact)}`}>
                          {request.impact.toUpperCase()} IMPACT
                        </span>
                      </div>
                    </div>

                    {/* Request Details */}
                    <div className="p-4 bg-gray-50 rounded-lg mb-2">
                      <p className="text-sm text-gray-700">{request.description}</p>
                    </div>

                    {/* Impact Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-2">
                      <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                        <div className="flex items-center gap-2 mb-1">
                          <DollarSign className="h-4 w-4 text-red-600" />
                          <p className="text-xs text-red-600 font-medium">Cost Impact</p>
                        </div>
                        <p className={`text-lg font-bold ${request.costImpact >= 0 ? 'text-red-900' : 'text-green-900'}`}>
                          {request.costImpact >= 0 ? '+' : ''}{formatCurrency(request.costImpact)}
                        </p>
                      </div>
                      <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                        <div className="flex items-center gap-2 mb-1">
                          <Calendar className="h-4 w-4 text-yellow-600" />
                          <p className="text-xs text-yellow-600 font-medium">Schedule Impact</p>
                        </div>
                        <p className={`text-lg font-bold ${request.scheduleImpact >= 0 ? 'text-yellow-900' : 'text-green-900'}`}>
                          {request.scheduleImpact >= 0 ? '+' : ''}{request.scheduleImpact} days
                        </p>
                      </div>
                      <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-center gap-2 mb-1">
                          <FileText className="h-4 w-4 text-blue-600" />
                          <p className="text-xs text-blue-600 font-medium">Type</p>
                        </div>
                        <p className="text-lg font-bold text-blue-900 capitalize">{request.type}</p>
                      </div>
                    </div>

                    {/* Scope Impact & Justification */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
                      <div>
                        <p className="text-xs font-semibold text-gray-700 mb-1">Scope Impact:</p>
                        <p className="text-sm text-gray-600">{request.scopeImpact}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-700 mb-1">Justification:</p>
                        <p className="text-sm text-gray-600">{request.justification}</p>
                      </div>
                    </div>

                    {/* Approvers */}
                    <div className="border-t border-gray-200 pt-4">
                      <p className="text-sm font-semibold text-gray-700 mb-3">Approvals:</p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {request.approvers.map((approver, idx) => (
                          <div key={idx} className="p-3 bg-white border border-gray-200 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <div>
                                <p className="font-medium text-gray-900 text-sm">{approver.name}</p>
                                <p className="text-xs text-gray-600">{approver.role}</p>
                              </div>
                              {getDecisionIcon(approver.decision)}
                            </div>
                            {approver.comments && (
                              <p className="text-xs text-gray-600 mt-2 italic">"{approver.comments}"</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Submission Info */}
                    <div className="mt-4 flex items-center justify-between text-xs text-gray-600">
                      <div className="flex items-center gap-2">
                        <span>Submitted by: <span className="font-medium">{request.submittedBy}</span></span>
                        <span>Date: {request.submittedDate}</span>
                      </div>
                      {request.reviewedDate && (
                        <span>Reviewed: {request.reviewedDate}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {viewMode === 'analysis' && (
        <div className="bg-white shadow-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-orange-50 to-red-50">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <AlertTriangle className="h-6 w-6 text-orange-600" />
              Impact Analysis ({impactAnalysis.length})
            </h3>
          </div>

          <div className="p-6">
            <div className="space-y-3">
              {impactAnalysis.map((analysis) => {
                const request = changeRequests.find(r => r.id === analysis.changeRequestId);
                if (!request) return null;

                return (
                  <div key={analysis.changeRequestId} className="p-5 border-2 border-orange-200 rounded-lg bg-orange-50">
                    <div className="mb-2">
                      <h4 className="text-lg font-bold text-gray-900">{request.title}</h4>
                      <p className="text-sm text-gray-600">{analysis.changeRequestId}</p>
                    </div>

                    {/* Impact Summary */}
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      <div className="p-3 bg-white rounded-lg">
                        <p className="text-xs text-gray-600 mb-1">Budget Variance</p>
                        <p className="text-lg font-bold text-red-900">{formatCurrency(analysis.budgetVariance)}</p>
                      </div>
                      <div className="p-3 bg-white rounded-lg">
                        <p className="text-xs text-gray-600 mb-1">Schedule Variance</p>
                        <p className="text-lg font-bold text-yellow-900">{analysis.scheduleVariance} days</p>
                      </div>
                    </div>

                    {/* Affected Projects */}
                    <div className="mb-2">
                      <p className="text-sm font-semibold text-gray-700 mb-2">Affected Projects:</p>
                      <div className="flex flex-wrap gap-2">
                        {analysis.affectedProjects.map((projectId, idx) => (
                          <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm font-medium">
                            {projectId}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Affected Resources */}
                    <div className="mb-2">
                      <p className="text-sm font-semibold text-gray-700 mb-2">Affected Resources:</p>
                      <div className="flex flex-wrap gap-2">
                        {analysis.affectedResources.map((resource, idx) => (
                          <span key={idx} className="px-3 py-1 bg-purple-100 text-purple-700 rounded text-sm font-medium flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {resource}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Risk Assessment */}
                    <div>
                      <p className="text-sm font-semibold text-gray-700 mb-3">Risk Assessment:</p>
                      <div className="space-y-3">
                        {analysis.riskAssessment.map((risk, idx) => (
                          <div key={idx} className="p-4 bg-white border border-gray-200 rounded-lg">
                            <div className="flex items-start gap-3 mb-2">
                              <AlertTriangle className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
                              <div className="flex-1">
                                <p className="font-medium text-gray-900">{risk.risk}</p>
                                <div className="flex items-center gap-2 mt-2">
                                  <span className={`text-xs px-2 py-1 rounded ${
                                    risk.likelihood === 'high' ? 'bg-red-100 text-red-700' :
                                    risk.likelihood === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                    'bg-green-100 text-green-700'
                                  }`}>
                                    Likelihood: {risk.likelihood.toUpperCase()}
                                  </span>
                                  <span className={`text-xs px-2 py-1 rounded ${
                                    risk.impact === 'high' ? 'bg-red-100 text-red-700' :
                                    risk.impact === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                    'bg-green-100 text-green-700'
                                  }`}>
                                    Impact: {risk.impact.toUpperCase()}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="ml-8 mt-2 p-2 bg-green-50 border border-green-200 rounded">
                              <p className="text-xs font-semibold text-green-700">Mitigation:</p>
                              <p className="text-sm text-gray-700 mt-1">{risk.mitigation}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

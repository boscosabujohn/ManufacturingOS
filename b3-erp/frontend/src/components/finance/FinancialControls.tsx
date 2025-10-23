'use client';

import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import {
  ShieldCheckIcon, ExclamationTriangleIcon, ClockIcon, CheckCircleIcon,
  DocumentTextIcon, UserIcon, CogIcon, BellIcon,
  PlusIcon, PencilIcon, EyeIcon, TrashIcon,
  LockClosedIcon, UnlockOpenIcon, InformationCircleIcon,
  AdjustmentsHorizontalIcon, MagnifyingGlassIcon,
  DocumentMagnifyingGlassIcon, ChartBarIcon, CalendarIcon
} from '@heroicons/react/24/outline';

interface FinancialControl {
  id: string;
  name: string;
  description: string;
  category: 'segregation_of_duties' | 'authorization_limits' | 'reconciliation' | 'data_validation' | 'access_control' | 'approval_workflow';
  type: 'preventive' | 'detective' | 'corrective';
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  frequency: 'real-time' | 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annually';
  isActive: boolean;
  isAutomated: boolean;
  owner: string;
  ownerEmail: string;
  reviewer: string;
  reviewerEmail: string;
  lastExecuted?: string;
  nextExecution?: string;
  effectivenessRating: number; // 1-5 scale
  complianceStatus: 'compliant' | 'non-compliant' | 'warning' | 'unknown';
  rules: ControlRule[];
  exceptions: ControlException[];
  auditHistory: AuditRecord[];
  createdDate: string;
  lastModified: string;
}

interface ControlRule {
  id: string;
  name: string;
  description: string;
  conditions: RuleCondition[];
  actions: RuleAction[];
  severity: 'low' | 'medium' | 'high' | 'critical';
  isActive: boolean;
}

interface RuleCondition {
  id: string;
  field: string;
  operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains' | 'between';
  value: string | number | [number, number];
  logicalOperator?: 'AND' | 'OR';
}

interface RuleAction {
  id: string;
  type: 'alert' | 'block' | 'require_approval' | 'log' | 'email' | 'escalate';
  parameters: Record<string, any>;
}

interface ControlException {
  id: string;
  controlId: string;
  ruleId: string;
  description: string;
  detectedDate: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'investigating' | 'resolved' | 'false_positive';
  assignedTo: string;
  resolvedBy?: string;
  resolvedDate?: string;
  resolution?: string;
  relatedTransactions: string[];
  impact: string;
  rootCause?: string;
}

interface AuditRecord {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: string;
  entityType: string;
  entityId: string;
  oldValues?: Record<string, any>;
  newValues?: Record<string, any>;
  ipAddress: string;
  userAgent: string;
  sessionId: string;
  result: 'success' | 'failure' | 'blocked';
  reason?: string;
  riskScore?: number;
}

interface ApprovalWorkflow {
  id: string;
  name: string;
  description: string;
  triggerConditions: WorkflowCondition[];
  steps: ApprovalStep[];
  isActive: boolean;
  createdDate: string;
  lastModified: string;
}

interface WorkflowCondition {
  id: string;
  field: string;
  operator: string;
  value: any;
  description: string;
}

interface ApprovalStep {
  id: string;
  stepNumber: number;
  name: string;
  approverType: 'user' | 'role' | 'amount_based' | 'department_head';
  approvers: string[];
  isRequired: boolean;
  timeoutHours?: number;
  escalationRules?: EscalationRule[];
}

interface EscalationRule {
  id: string;
  triggerAfterHours: number;
  escalateTo: string[];
  notificationMethod: 'email' | 'system' | 'both';
}

interface ComplianceReport {
  id: string;
  name: string;
  period: string;
  generatedDate: string;
  controlsReviewed: number;
  compliantControls: number;
  nonCompliantControls: number;
  exceptionsRaised: number;
  exceptionsResolved: number;
  overallRating: number;
  keyFindings: string[];
  recommendations: string[];
}

const FinancialControls: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'controls' | 'exceptions' | 'audit-trail' | 'workflows' | 'compliance'>('dashboard');
  const [selectedControl, setSelectedControl] = useState<FinancialControl | null>(null);
  const [selectedException, setSelectedException] = useState<ControlException | null>(null);
  const [showControlModal, setShowControlModal] = useState(false);
  const [showWorkflowModal, setShowWorkflowModal] = useState(false);
  const [auditFilters, setAuditFilters] = useState({
    dateFrom: '2024-01-01',
    dateTo: '2024-01-31',
    userId: '',
    action: '',
    entityType: ''
  });

  // Mock data
  const [financialControls] = useState<FinancialControl[]>([
    {
      id: '1',
      name: 'Three-Way Matching Control',
      description: 'Ensures purchase orders, receipts, and invoices match before payment authorization',
      category: 'data_validation',
      type: 'preventive',
      riskLevel: 'high',
      frequency: 'real-time',
      isActive: true,
      isAutomated: true,
      owner: 'John Smith',
      ownerEmail: 'john.smith@company.com',
      reviewer: 'Sarah Johnson',
      reviewerEmail: 'sarah.johnson@company.com',
      lastExecuted: '2024-01-18T14:30:00Z',
      nextExecution: '2024-01-19T00:00:00Z',
      effectivenessRating: 4,
      complianceStatus: 'compliant',
      rules: [
        {
          id: '1',
          name: 'Amount Variance Check',
          description: 'Invoice amount cannot exceed PO amount by more than 5%',
          conditions: [
            { id: '1', field: 'invoice_amount', operator: 'greater_than', value: 'po_amount * 1.05' }
          ],
          actions: [
            { id: '1', type: 'block', parameters: { message: 'Invoice amount exceeds PO tolerance' } },
            { id: '2', type: 'alert', parameters: { recipients: ['ap@company.com'] } }
          ],
          severity: 'high',
          isActive: true
        }
      ],
      exceptions: [],
      auditHistory: [],
      createdDate: '2024-01-01T09:00:00Z',
      lastModified: '2024-01-15T10:30:00Z'
    },
    {
      id: '2',
      name: 'Bank Reconciliation Review',
      description: 'Monthly bank reconciliation must be completed and reviewed within 5 business days',
      category: 'reconciliation',
      type: 'detective',
      riskLevel: 'medium',
      frequency: 'monthly',
      isActive: true,
      isAutomated: false,
      owner: 'Mike Chen',
      ownerEmail: 'mike.chen@company.com',
      reviewer: 'Emma Davis',
      reviewerEmail: 'emma.davis@company.com',
      lastExecuted: '2024-01-05T16:00:00Z',
      nextExecution: '2024-02-05T16:00:00Z',
      effectivenessRating: 3,
      complianceStatus: 'compliant',
      rules: [],
      exceptions: [],
      auditHistory: [],
      createdDate: '2024-01-01T09:00:00Z',
      lastModified: '2024-01-15T10:30:00Z'
    },
    {
      id: '3',
      name: 'Authorization Limits',
      description: 'Spending authorization limits based on employee level and transaction type',
      category: 'authorization_limits',
      type: 'preventive',
      riskLevel: 'critical',
      frequency: 'real-time',
      isActive: true,
      isAutomated: true,
      owner: 'Sarah Johnson',
      ownerEmail: 'sarah.johnson@company.com',
      reviewer: 'David Wilson',
      reviewerEmail: 'david.wilson@company.com',
      lastExecuted: '2024-01-18T14:30:00Z',
      effectivenessRating: 5,
      complianceStatus: 'compliant',
      rules: [],
      exceptions: [],
      auditHistory: [],
      createdDate: '2024-01-01T09:00:00Z',
      lastModified: '2024-01-15T10:30:00Z'
    },
    {
      id: '4',
      name: 'Segregation of Duties',
      description: 'Ensures proper segregation between transaction initiation, authorization, and recording',
      category: 'segregation_of_duties',
      type: 'preventive',
      riskLevel: 'high',
      frequency: 'real-time',
      isActive: true,
      isAutomated: true,
      owner: 'Emma Davis',
      ownerEmail: 'emma.davis@company.com',
      reviewer: 'John Smith',
      reviewerEmail: 'john.smith@company.com',
      lastExecuted: '2024-01-18T14:30:00Z',
      effectivenessRating: 4,
      complianceStatus: 'warning',
      rules: [],
      exceptions: [],
      auditHistory: [],
      createdDate: '2024-01-01T09:00:00Z',
      lastModified: '2024-01-15T10:30:00Z'
    }
  ]);

  const [controlExceptions] = useState<ControlException[]>([
    {
      id: '1',
      controlId: '1',
      ruleId: '1',
      description: 'Invoice INV-2024-001 exceeds PO amount by 8% ($4,000)',
      detectedDate: '2024-01-18T10:30:00Z',
      severity: 'high',
      status: 'investigating',
      assignedTo: 'John Smith',
      relatedTransactions: ['INV-2024-001', 'PO-2024-001'],
      impact: 'Potential overpayment of $4,000'
    },
    {
      id: '2',
      controlId: '4',
      ruleId: '1',
      description: 'User attempted to both create and approve purchase order PO-2024-002',
      detectedDate: '2024-01-17T14:20:00Z',
      severity: 'medium',
      status: 'resolved',
      assignedTo: 'Emma Davis',
      resolvedBy: 'Emma Davis',
      resolvedDate: '2024-01-17T16:00:00Z',
      resolution: 'Transaction was properly reassigned to authorized approver',
      relatedTransactions: ['PO-2024-002'],
      impact: 'Segregation of duties violation prevented',
      rootCause: 'User training gap identified'
    },
    {
      id: '3',
      controlId: '3',
      ruleId: '1',
      description: 'Manager attempted to approve expense beyond authorization limit ($25,000)',
      detectedDate: '2024-01-16T11:45:00Z',
      severity: 'critical',
      status: 'open',
      assignedTo: 'Sarah Johnson',
      relatedTransactions: ['EXP-2024-003'],
      impact: 'Authorization limit exceeded by $10,000'
    }
  ]);

  const [auditRecords] = useState<AuditRecord[]>([
    {
      id: '1',
      timestamp: '2024-01-18T14:30:00Z',
      userId: 'user123',
      userName: 'John Smith',
      action: 'CREATE_JOURNAL_ENTRY',
      entityType: 'JournalEntry',
      entityId: 'JE-2024-001',
      newValues: { amount: 50000, description: 'Monthly depreciation' },
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      sessionId: 'sess_abc123',
      result: 'success',
      riskScore: 2
    },
    {
      id: '2',
      timestamp: '2024-01-18T14:25:00Z',
      userId: 'user456',
      userName: 'Sarah Johnson',
      action: 'APPROVE_PAYMENT',
      entityType: 'Payment',
      entityId: 'PAY-2024-001',
      oldValues: { status: 'pending' },
      newValues: { status: 'approved', approver: 'Sarah Johnson' },
      ipAddress: '192.168.1.101',
      userAgent: 'Mozilla/5.0 (macOS; Intel Mac OS X 10_15_7)',
      sessionId: 'sess_def456',
      result: 'success',
      riskScore: 1
    },
    {
      id: '3',
      timestamp: '2024-01-18T14:20:00Z',
      userId: 'user789',
      userName: 'Mike Chen',
      action: 'MODIFY_AUTHORIZATION_LIMIT',
      entityType: 'AuthorizationLimit',
      entityId: 'LIMIT-001',
      oldValues: { limit: 10000 },
      newValues: { limit: 15000 },
      ipAddress: '192.168.1.102',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      sessionId: 'sess_ghi789',
      result: 'blocked',
      reason: 'Insufficient privileges',
      riskScore: 8
    }
  ]);

  const [approvalWorkflows] = useState<ApprovalWorkflow[]>([
    {
      id: '1',
      name: 'Purchase Order Approval',
      description: 'Multi-level approval process for purchase orders based on amount',
      triggerConditions: [
        { id: '1', field: 'document_type', operator: 'equals', value: 'purchase_order', description: 'Applies to purchase orders' },
        { id: '2', field: 'amount', operator: 'greater_than', value: 1000, description: 'Amount exceeds $1,000' }
      ],
      steps: [
        {
          id: '1',
          stepNumber: 1,
          name: 'Department Manager Approval',
          approverType: 'department_head',
          approvers: ['dept_manager'],
          isRequired: true,
          timeoutHours: 24,
          escalationRules: [
            {
              id: '1',
              triggerAfterHours: 24,
              escalateTo: ['senior_manager'],
              notificationMethod: 'email'
            }
          ]
        },
        {
          id: '2',
          stepNumber: 2,
          name: 'Finance Approval',
          approverType: 'amount_based',
          approvers: ['finance_manager'],
          isRequired: true,
          timeoutHours: 48
        }
      ],
      isActive: true,
      createdDate: '2024-01-01T09:00:00Z',
      lastModified: '2024-01-15T10:30:00Z'
    }
  ]);

  // Chart data
  const controlEffectivenessData = financialControls.map(control => ({
    name: control.name.split(' ').slice(0, 2).join(' '),
    effectiveness: control.effectivenessRating,
    compliance: control.complianceStatus === 'compliant' ? 100 :
                control.complianceStatus === 'warning' ? 75 :
                control.complianceStatus === 'non-compliant' ? 25 : 0
  }));

  const exceptionTrendsData = [
    { month: 'Jan', high: 2, medium: 5, low: 8, resolved: 12 },
    { month: 'Feb', high: 1, medium: 3, low: 6, resolved: 15 },
    { month: 'Mar', high: 3, medium: 4, low: 7, resolved: 18 },
    { month: 'Apr', high: 1, medium: 2, low: 5, resolved: 20 },
    { month: 'May', high: 2, medium: 6, low: 9, resolved: 22 },
    { month: 'Jun', high: 1, medium: 4, low: 6, resolved: 25 }
  ];

  const riskDistribution = [
    { name: 'Critical', value: 1, color: '#DC2626' },
    { name: 'High', value: 2, color: '#EA580C' },
    { name: 'Medium', value: 1, color: '#D97706' },
    { name: 'Low', value: 0, color: '#16A34A' }
  ];

  const complianceStatusData = [
    { name: 'Compliant', value: 3, color: '#16A34A' },
    { name: 'Warning', value: 1, color: '#D97706' },
    { name: 'Non-Compliant', value: 0, color: '#DC2626' },
    { name: 'Unknown', value: 0, color: '#6B7280' }
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getRiskLevelColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'critical':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getComplianceStatusColor = (status: string) => {
    switch (status) {
      case 'compliant':
        return 'bg-green-100 text-green-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'non-compliant':
        return 'bg-red-100 text-red-800';
      case 'unknown':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getExceptionStatusBadge = (status: string) => {
    const statusConfig = {
      open: { bg: 'bg-red-100', text: 'text-red-800', icon: ExclamationTriangleIcon },
      investigating: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: ClockIcon },
      resolved: { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircleIcon },
      false_positive: { bg: 'bg-gray-100', text: 'text-gray-800', icon: InformationCircleIcon }
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        <Icon className="w-3 h-3 mr-1" />
        {status.replace('_', ' ').charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
      </span>
    );
  };

  const getAuditResultBadge = (result: string) => {
    const resultConfig = {
      success: { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircleIcon },
      failure: { bg: 'bg-red-100', text: 'text-red-800', icon: ExclamationTriangleIcon },
      blocked: { bg: 'bg-orange-100', text: 'text-orange-800', icon: LockClosedIcon }
    };

    const config = resultConfig[result as keyof typeof resultConfig];
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        <Icon className="w-3 h-3 mr-1" />
        {result.charAt(0).toUpperCase() + result.slice(1)}
      </span>
    );
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ShieldCheckIcon className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Controls</p>
              <p className="text-2xl font-semibold text-gray-900">
                {financialControls.filter(c => c.isActive).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ExclamationTriangleIcon className="h-8 w-8 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Open Exceptions</p>
              <p className="text-2xl font-semibold text-gray-900">
                {controlExceptions.filter(e => e.status === 'open' || e.status === 'investigating').length}
              </p>
              <p className="text-sm text-orange-600">
                {controlExceptions.filter(e => e.severity === 'critical' && e.status === 'open').length} critical
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CheckCircleIcon className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Compliance Rate</p>
              <p className="text-2xl font-semibold text-gray-900">
                {Math.round((financialControls.filter(c => c.complianceStatus === 'compliant').length / financialControls.length) * 100)}%
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <DocumentTextIcon className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Audit Records</p>
              <p className="text-2xl font-semibold text-gray-900">{auditRecords.length}</p>
              <p className="text-sm text-purple-600">Last 30 days</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Control Effectiveness & Compliance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={controlEffectivenessData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="effectiveness" fill="#3B82F6" name="Effectiveness (1-5)" />
              <Bar dataKey="compliance" fill="#10B981" name="Compliance %" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Exception Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={exceptionTrendsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="high" stackId="1" stroke="#DC2626" fill="#DC2626" name="High" />
              <Area type="monotone" dataKey="medium" stackId="1" stroke="#D97706" fill="#D97706" name="Medium" />
              <Area type="monotone" dataKey="low" stackId="1" stroke="#16A34A" fill="#16A34A" name="Low" />
              <Line type="monotone" dataKey="resolved" stroke="#6366F1" strokeWidth={3} name="Resolved" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Level Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={riskDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {riskDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Compliance Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={complianceStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {complianceStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Control Activities</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {controlExceptions.slice(0, 3).map((exception) => {
              const control = financialControls.find(c => c.id === exception.controlId);
              return (
                <div key={exception.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{control?.name}</h4>
                    <p className="text-sm text-gray-600">{exception.description}</p>
                    <p className="text-sm text-gray-500">
                      Detected: {formatDateTime(exception.detectedDate)} • Assigned to: {exception.assignedTo}
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRiskLevelColor(exception.severity)}`}>
                      {exception.severity.charAt(0).toUpperCase() + exception.severity.slice(1)}
                    </span>
                    {getExceptionStatusBadge(exception.status)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );

  const renderControls = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Financial Controls</h3>
        <button
          onClick={() => setShowControlModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Add Control
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {financialControls.map((control) => (
          <div key={control.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">{control.name}</h4>
                <p className="text-sm text-gray-600 mt-1">{control.description}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setSelectedControl(control)}
                  className="text-gray-600 hover:text-blue-600"
                >
                  <EyeIcon className="w-4 h-4" />
                </button>
                <button className="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                  <PencilIcon className="w-4 h-4 text-gray-600" />
                  <span className="text-gray-700">Edit</span>
                </button>
                <button className="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                  <CogIcon className="w-4 h-4 text-gray-600" />
                  <span className="text-gray-700">Settings</span>
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Category:</span>
                <span className="text-sm font-medium text-gray-900 capitalize">
                  {control.category.replace('_', ' ')}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Type:</span>
                <span className="text-sm text-gray-900 capitalize">{control.type}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Risk Level:</span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRiskLevelColor(control.riskLevel)}`}>
                  {control.riskLevel.charAt(0).toUpperCase() + control.riskLevel.slice(1)}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Compliance:</span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getComplianceStatusColor(control.complianceStatus)}`}>
                  {control.complianceStatus.replace('_', ' ').charAt(0).toUpperCase() + control.complianceStatus.slice(1).replace('_', ' ')}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Effectiveness:</span>
                <div className="flex items-center">
                  <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${(control.effectivenessRating / 5) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-900">{control.effectivenessRating}/5</span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Owner:</span>
                <span className="text-sm text-gray-900">{control.owner}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Frequency:</span>
                <span className="text-sm text-gray-900 capitalize">{control.frequency.replace('_', ' ')}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Automated:</span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  control.isAutomated ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {control.isAutomated ? 'Yes' : 'No'}
                </span>
              </div>

              {control.lastExecuted && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Last Executed:</span>
                  <span className="text-sm text-gray-900">{formatDate(control.lastExecuted)}</span>
                </div>
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200 flex space-x-2">
              <button className={`flex-1 px-3 py-2 rounded text-sm font-medium ${
                control.isActive
                  ? 'bg-red-100 text-red-800 hover:bg-red-200'
                  : 'bg-green-100 text-green-800 hover:bg-green-200'
              }`}>
                {control.isActive ? 'Disable' : 'Enable'}
              </button>
              <button className="px-3 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50">
                Test
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderExceptions = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Control Exceptions</h3>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Control
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Severity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assigned To
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Detected
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {controlExceptions.map((exception) => {
                const control = financialControls.find(c => c.id === exception.controlId);
                return (
                  <tr key={exception.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {control?.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div className="max-w-xs">
                        {exception.description}
                        {exception.impact && (
                          <div className="text-xs text-gray-500 mt-1">Impact: {exception.impact}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRiskLevelColor(exception.severity)}`}>
                        {exception.severity.charAt(0).toUpperCase() + exception.severity.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getExceptionStatusBadge(exception.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {exception.assignedTo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(exception.detectedDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setSelectedException(exception)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <EyeIcon className="w-4 h-4" />
                        </button>
                        <button className="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                          <PencilIcon className="w-4 h-4 text-gray-600" />
                          <span className="text-gray-700">Edit</span>
                        </button>
                        {exception.status === 'open' && (
                          <button className="inline-flex items-center gap-1.5 px-3 py-2 border border-green-300 rounded-lg hover:bg-green-50 text-sm">
                            <CheckCircleIcon className="w-4 h-4 text-green-600" />
                            <span className="text-green-600">Approve</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderAuditTrail = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Audit Trail</h3>
        <div className="flex space-x-2">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm">
            Export Audit Log
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
            <input
              type="date"
              value={auditFilters.dateFrom}
              onChange={(e) => setAuditFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
            <input
              type="date"
              value={auditFilters.dateTo}
              onChange={(e) => setAuditFilters(prev => ({ ...prev, dateTo: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">User</label>
            <input
              type="text"
              placeholder="User name or ID"
              value={auditFilters.userId}
              onChange={(e) => setAuditFilters(prev => ({ ...prev, userId: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Action</label>
            <select
              value={auditFilters.action}
              onChange={(e) => setAuditFilters(prev => ({ ...prev, action: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            >
              <option value="">All Actions</option>
              <option value="CREATE">Create</option>
              <option value="UPDATE">Update</option>
              <option value="DELETE">Delete</option>
              <option value="APPROVE">Approve</option>
              <option value="REJECT">Reject</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Entity Type</label>
            <select
              value={auditFilters.entityType}
              onChange={(e) => setAuditFilters(prev => ({ ...prev, entityType: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            >
              <option value="">All Types</option>
              <option value="JournalEntry">Journal Entry</option>
              <option value="Payment">Payment</option>
              <option value="Invoice">Invoice</option>
              <option value="PurchaseOrder">Purchase Order</option>
            </select>
          </div>
        </div>
      </div>

      {/* Audit Records */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Timestamp
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Entity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Result
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Risk Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {auditRecords.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDateTime(record.timestamp)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{record.userName}</div>
                      <div className="text-sm text-gray-500">{record.userId}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {record.action.replace('_', ' ')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{record.entityType}</div>
                      <div className="text-sm text-gray-500">{record.entityId}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getAuditResultBadge(record.result)}
                    {record.reason && (
                      <div className="text-xs text-gray-500 mt-1">{record.reason}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {record.riskScore && (
                      <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full mr-2 ${
                          record.riskScore >= 7 ? 'bg-red-500' :
                          record.riskScore >= 4 ? 'bg-yellow-500' : 'bg-green-500'
                        }`}></div>
                        <span className="text-sm text-gray-900">{record.riskScore}/10</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                      <DocumentMagnifyingGlassIcon className="w-4 h-4 text-gray-600" />
                      <span className="text-gray-700">Review</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderWorkflows = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Approval Workflows</h3>
        <button
          onClick={() => setShowWorkflowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Create Workflow
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {approvalWorkflows.map((workflow) => (
          <div key={workflow.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">{workflow.name}</h4>
                <p className="text-sm text-gray-600 mt-1">{workflow.description}</p>
              </div>
              <div className="flex space-x-2">
                <button className="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                  <EyeIcon className="w-4 h-4 text-gray-600" />
                  <span className="text-gray-700">View</span>
                </button>
                <button className="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                  <PencilIcon className="w-4 h-4 text-gray-600" />
                  <span className="text-gray-700">Edit</span>
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <span className="text-sm text-gray-600">Trigger Conditions:</span>
                <div className="mt-1">
                  {workflow.triggerConditions.map((condition, index) => (
                    <div key={condition.id} className="text-sm text-gray-900">
                      • {condition.description}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-sm text-gray-600">Approval Steps:</span>
                <div className="mt-1 space-y-2">
                  {workflow.steps.map((step) => (
                    <div key={step.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div>
                        <span className="text-sm font-medium text-gray-900">
                          {step.stepNumber}. {step.name}
                        </span>
                        <div className="text-xs text-gray-500">
                          {step.approverType.replace('_', ' ').charAt(0).toUpperCase() + step.approverType.slice(1).replace('_', ' ')}
                          {step.timeoutHours && ` • ${step.timeoutHours}h timeout`}
                        </div>
                      </div>
                      <span className={`inline-flex items-center px-2 py-1 rounded text-xs ${
                        step.isRequired ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {step.isRequired ? 'Required' : 'Optional'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Status:</span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  workflow.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {workflow.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200 flex space-x-2">
              <button className={`flex-1 px-3 py-2 rounded text-sm font-medium ${
                workflow.isActive
                  ? 'bg-red-100 text-red-800 hover:bg-red-200'
                  : 'bg-green-100 text-green-800 hover:bg-green-200'
              }`}>
                {workflow.isActive ? 'Deactivate' : 'Activate'}
              </button>
              <button className="px-3 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50">
                Test
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCompliance = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Compliance Monitoring</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h4 className="font-medium text-gray-900 mb-4">Overall Compliance Score</h4>
          <div className="text-center">
            <div className="text-4xl font-bold text-green-600 mb-2">92%</div>
            <div className="text-sm text-gray-600">4 of 4 controls compliant</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h4 className="font-medium text-gray-900 mb-4">Control Effectiveness</h4>
          <div className="space-y-3">
            {financialControls.map((control) => (
              <div key={control.id} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{control.name.split(' ')[0]}</span>
                <div className="flex items-center">
                  <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${(control.effectivenessRating / 5) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-900">{control.effectivenessRating}/5</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h4 className="font-medium text-gray-900 mb-4">Risk Assessment</h4>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Critical Risks:</span>
              <span className="text-sm font-medium text-red-600">1</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">High Risks:</span>
              <span className="text-sm font-medium text-orange-600">2</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Medium Risks:</span>
              <span className="text-sm font-medium text-yellow-600">1</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Low Risks:</span>
              <span className="text-sm font-medium text-green-600">0</span>
            </div>
          </div>
        </div>
      </div>

      {/* Compliance Reports */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h4 className="font-medium text-gray-900">Compliance Reports</h4>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: 'SOX Compliance Report', period: 'Q1 2024', score: 95 },
              { name: 'Internal Controls Assessment', period: 'January 2024', score: 88 },
              { name: 'Risk Management Review', period: 'Q1 2024', score: 92 }
            ].map((report, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <h5 className="font-medium text-gray-900">{report.name}</h5>
                <p className="text-sm text-gray-600 mt-1">{report.period}</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-2xl font-bold text-green-600">{report.score}%</span>
                  <button className="text-blue-600 hover:text-blue-800 text-sm">
                    View Report
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Financial Controls & Audit</h1>
        <p className="text-gray-600 mt-2">Monitor financial controls, track exceptions, and maintain comprehensive audit trails</p>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {[
            { key: 'dashboard', label: 'Dashboard', icon: ChartBarIcon },
            { key: 'controls', label: 'Controls', icon: ShieldCheckIcon },
            { key: 'exceptions', label: 'Exceptions', icon: ExclamationTriangleIcon },
            { key: 'audit-trail', label: 'Audit Trail', icon: DocumentMagnifyingGlassIcon },
            { key: 'workflows', label: 'Workflows', icon: AdjustmentsHorizontalIcon },
            { key: 'compliance', label: 'Compliance', icon: CheckCircleIcon }
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center ${
                activeTab === key
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Icon className="w-5 h-5 mr-2" />
              {label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'dashboard' && renderDashboard()}
      {activeTab === 'controls' && renderControls()}
      {activeTab === 'exceptions' && renderExceptions()}
      {activeTab === 'audit-trail' && renderAuditTrail()}
      {activeTab === 'workflows' && renderWorkflows()}
      {activeTab === 'compliance' && renderCompliance()}
    </div>
  );
};

export default FinancialControls;
'use client';

import React, { useState, useEffect } from 'react';
import { Zap, Bot, Settings, Play, Pause, Clock, CheckCircle, XCircle, AlertCircle, TrendingUp, Calendar, Filter, Plus, X, Eye, Code, Terminal, Database, GitBranch, RefreshCw, Shield, Bell, Activity, FileText, DollarSign, ArrowRight, Target, Cpu, ChevronDown } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, RadialBarChart, RadialBar, ScatterChart, Scatter, Treemap } from 'recharts';

interface AutomationRule {
  id: string;
  name: string;
  description: string;
  category: 'invoice' | 'payment' | 'reconciliation' | 'reporting' | 'compliance' | 'general';
  type: 'trigger' | 'scheduled' | 'conditional' | 'workflow';
  status: 'active' | 'inactive' | 'testing' | 'error';
  priority: 'low' | 'medium' | 'high' | 'critical';
  trigger: RuleTrigger;
  conditions: RuleCondition[];
  actions: RuleAction[];
  schedule?: Schedule;
  lastRun?: string;
  nextRun?: string;
  executionCount: number;
  successRate: number;
  averageRunTime: number;
  createdBy: string;
  createdDate: string;
  modifiedDate: string;
}

interface RuleTrigger {
  type: 'event' | 'time' | 'data' | 'manual' | 'api';
  event?: string;
  source?: string;
  frequency?: string;
  dataCondition?: string;
}

interface RuleCondition {
  id: string;
  field: string;
  operator: 'equals' | 'not_equals' | 'greater' | 'less' | 'contains' | 'between' | 'in' | 'regex';
  value: any;
  logic: 'and' | 'or';
  group?: number;
}

interface RuleAction {
  id: string;
  type: 'email' | 'notification' | 'update' | 'create' | 'delete' | 'calculate' | 'integrate' | 'script';
  target: string;
  parameters: any;
  sequence: number;
  errorHandling: 'stop' | 'continue' | 'retry';
  retryAttempts?: number;
}

interface Schedule {
  frequency: 'minute' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'custom';
  interval?: number;
  time?: string;
  dayOfWeek?: number[];
  dayOfMonth?: number[];
  timezone: string;
  startDate: string;
  endDate?: string;
}

interface RuleExecution {
  id: string;
  ruleId: string;
  startTime: string;
  endTime?: string;
  status: 'running' | 'completed' | 'failed' | 'cancelled';
  triggeredBy: string;
  recordsProcessed: number;
  recordsAffected: number;
  errorMessage?: string;
  logs: ExecutionLog[];
}

interface ExecutionLog {
  timestamp: string;
  level: 'info' | 'warning' | 'error' | 'debug';
  message: string;
  details?: any;
}

interface AutomationTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  popularity: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;
  rules: Partial<AutomationRule>[];
}

interface PerformanceMetric {
  ruleId: string;
  executions: number;
  successRate: number;
  averageTime: number;
  lastRunTime: number;
  errorCount: number;
  resourceUsage: {
    cpu: number;
    memory: number;
    api: number;
  };
}

const FinancialAutomation = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedRule, setSelectedRule] = useState<AutomationRule | null>(null);
  const [showRuleBuilder, setShowRuleBuilder] = useState(false);
  const [showTestModal, setShowTestModal] = useState(false);
  const [filterCategory, setFilterCategory] = useState('all');
  const [showTemplateModal, setShowTemplateModal] = useState(false);

  // Mock data
  const automationRules: AutomationRule[] = [
    {
      id: 'RULE001',
      name: 'Auto Invoice Processing',
      description: 'Automatically process and approve invoices under $5000',
      category: 'invoice',
      type: 'trigger',
      status: 'active',
      priority: 'high',
      trigger: { type: 'event', event: 'invoice.created', source: 'ERP' },
      conditions: [
        { id: 'C001', field: 'amount', operator: 'less', value: 5000, logic: 'and' },
        { id: 'C002', field: 'vendor.approved', operator: 'equals', value: true, logic: 'and' }
      ],
      actions: [
        { id: 'A001', type: 'update', target: 'invoice.status', parameters: { value: 'approved' }, sequence: 1, errorHandling: 'stop' },
        { id: 'A002', type: 'notification', target: 'finance.team', parameters: { message: 'Invoice auto-approved' }, sequence: 2, errorHandling: 'continue' }
      ],
      lastRun: '2024-03-26 15:30:00',
      executionCount: 245,
      successRate: 98.5,
      averageRunTime: 2.3,
      createdBy: 'Admin',
      createdDate: '2024-01-15',
      modifiedDate: '2024-03-20'
    },
    {
      id: 'RULE002',
      name: 'Payment Reminder',
      description: 'Send payment reminders for overdue invoices',
      category: 'payment',
      type: 'scheduled',
      status: 'active',
      priority: 'medium',
      trigger: { type: 'time', frequency: 'daily' },
      conditions: [
        { id: 'C003', field: 'invoice.dueDate', operator: 'less', value: 'TODAY', logic: 'and' },
        { id: 'C004', field: 'invoice.status', operator: 'not_equals', value: 'paid', logic: 'and' }
      ],
      actions: [
        { id: 'A003', type: 'email', target: 'customer.email', parameters: { template: 'payment_reminder' }, sequence: 1, errorHandling: 'continue' },
        { id: 'A004', type: 'update', target: 'invoice.reminderCount', parameters: { increment: 1 }, sequence: 2, errorHandling: 'continue' }
      ],
      schedule: {
        frequency: 'daily',
        time: '09:00',
        timezone: 'America/New_York',
        startDate: '2024-01-01'
      },
      lastRun: '2024-03-26 09:00:00',
      nextRun: '2024-03-27 09:00:00',
      executionCount: 85,
      successRate: 99.2,
      averageRunTime: 45.6,
      createdBy: 'Admin',
      createdDate: '2024-01-20',
      modifiedDate: '2024-03-15'
    },
    {
      id: 'RULE003',
      name: 'Bank Reconciliation',
      description: 'Auto-match bank transactions with system records',
      category: 'reconciliation',
      type: 'trigger',
      status: 'active',
      priority: 'high',
      trigger: { type: 'event', event: 'bank.transaction.received', source: 'Banking API' },
      conditions: [
        { id: 'C005', field: 'transaction.amount', operator: 'greater', value: 0, logic: 'and' }
      ],
      actions: [
        { id: 'A005', type: 'calculate', target: 'matching.algorithm', parameters: { method: 'fuzzy', threshold: 0.95 }, sequence: 1, errorHandling: 'retry', retryAttempts: 3 },
        { id: 'A006', type: 'update', target: 'reconciliation.status', parameters: {}, sequence: 2, errorHandling: 'stop' }
      ],
      lastRun: '2024-03-26 14:45:00',
      executionCount: 1250,
      successRate: 94.8,
      averageRunTime: 8.2,
      createdBy: 'Finance Manager',
      createdDate: '2024-02-01',
      modifiedDate: '2024-03-22'
    },
    {
      id: 'RULE004',
      name: 'Monthly Financial Reports',
      description: 'Generate and distribute monthly financial reports',
      category: 'reporting',
      type: 'scheduled',
      status: 'active',
      priority: 'high',
      trigger: { type: 'time', frequency: 'monthly' },
      conditions: [],
      actions: [
        { id: 'A007', type: 'script', target: 'report.generator', parameters: { reports: ['P&L', 'Balance Sheet', 'Cash Flow'] }, sequence: 1, errorHandling: 'stop' },
        { id: 'A008', type: 'email', target: 'executives.list', parameters: { attachments: true }, sequence: 2, errorHandling: 'retry', retryAttempts: 3 }
      ],
      schedule: {
        frequency: 'monthly',
        dayOfMonth: [1],
        time: '06:00',
        timezone: 'America/New_York',
        startDate: '2024-01-01'
      },
      lastRun: '2024-03-01 06:00:00',
      nextRun: '2024-04-01 06:00:00',
      executionCount: 15,
      successRate: 100,
      averageRunTime: 180.5,
      createdBy: 'CFO',
      createdDate: '2023-01-01',
      modifiedDate: '2024-02-28'
    },
    {
      id: 'RULE005',
      name: 'Tax Compliance Check',
      description: 'Automated tax calculation and compliance verification',
      category: 'compliance',
      type: 'conditional',
      status: 'testing',
      priority: 'critical',
      trigger: { type: 'data', dataCondition: 'transaction.type = taxable' },
      conditions: [
        { id: 'C006', field: 'transaction.jurisdiction', operator: 'in', value: ['US', 'CA', 'UK'], logic: 'and' }
      ],
      actions: [
        { id: 'A009', type: 'integrate', target: 'tax.api', parameters: { endpoint: 'calculate' }, sequence: 1, errorHandling: 'stop' },
        { id: 'A010', type: 'create', target: 'tax.record', parameters: {}, sequence: 2, errorHandling: 'stop' }
      ],
      lastRun: '2024-03-26 12:00:00',
      executionCount: 450,
      successRate: 96.7,
      averageRunTime: 5.4,
      createdBy: 'Tax Manager',
      createdDate: '2024-03-01',
      modifiedDate: '2024-03-25'
    }
  ];

  const ruleExecutions: RuleExecution[] = [
    {
      id: 'EXEC001',
      ruleId: 'RULE001',
      startTime: '2024-03-26 15:30:00',
      endTime: '2024-03-26 15:30:02',
      status: 'completed',
      triggeredBy: 'System Event',
      recordsProcessed: 5,
      recordsAffected: 5,
      logs: [
        { timestamp: '2024-03-26 15:30:00', level: 'info', message: 'Rule execution started' },
        { timestamp: '2024-03-26 15:30:01', level: 'info', message: '5 invoices matched criteria' },
        { timestamp: '2024-03-26 15:30:02', level: 'info', message: 'All invoices processed successfully' }
      ]
    },
    {
      id: 'EXEC002',
      ruleId: 'RULE002',
      startTime: '2024-03-26 09:00:00',
      endTime: '2024-03-26 09:00:45',
      status: 'completed',
      triggeredBy: 'Scheduler',
      recordsProcessed: 28,
      recordsAffected: 28,
      logs: [
        { timestamp: '2024-03-26 09:00:00', level: 'info', message: 'Scheduled execution started' },
        { timestamp: '2024-03-26 09:00:30', level: 'info', message: '28 overdue invoices found' },
        { timestamp: '2024-03-26 09:00:45', level: 'info', message: 'All reminders sent successfully' }
      ]
    },
    {
      id: 'EXEC003',
      ruleId: 'RULE003',
      startTime: '2024-03-26 14:45:00',
      status: 'running',
      triggeredBy: 'Bank API',
      recordsProcessed: 45,
      recordsAffected: 0,
      logs: [
        { timestamp: '2024-03-26 14:45:00', level: 'info', message: 'Processing bank transactions batch' },
        { timestamp: '2024-03-26 14:45:05', level: 'info', message: '45 transactions received for matching' }
      ]
    }
  ];

  const automationTemplates: AutomationTemplate[] = [
    {
      id: 'TEMP001',
      name: 'Invoice Approval Workflow',
      category: 'invoice',
      description: 'Multi-level invoice approval based on amount thresholds',
      popularity: 95,
      difficulty: 'intermediate',
      estimatedTime: '15 minutes',
      rules: []
    },
    {
      id: 'TEMP002',
      name: 'Expense Report Automation',
      category: 'expense',
      description: 'Automate expense report processing and reimbursement',
      popularity: 88,
      difficulty: 'beginner',
      estimatedTime: '10 minutes',
      rules: []
    },
    {
      id: 'TEMP003',
      name: 'Cash Flow Forecasting',
      category: 'reporting',
      description: 'Automated cash flow predictions and alerts',
      popularity: 76,
      difficulty: 'advanced',
      estimatedTime: '30 minutes',
      rules: []
    },
    {
      id: 'TEMP004',
      name: 'Vendor Payment Optimization',
      category: 'payment',
      description: 'Optimize payment timing for cash discount capture',
      popularity: 82,
      difficulty: 'intermediate',
      estimatedTime: '20 minutes',
      rules: []
    },
    {
      id: 'TEMP005',
      name: 'Compliance Monitoring',
      category: 'compliance',
      description: 'Real-time compliance checks and reporting',
      popularity: 70,
      difficulty: 'advanced',
      estimatedTime: '45 minutes',
      rules: []
    }
  ];

  const performanceMetrics: PerformanceMetric[] = [
    {
      ruleId: 'RULE001',
      executions: 245,
      successRate: 98.5,
      averageTime: 2.3,
      lastRunTime: 2.1,
      errorCount: 3,
      resourceUsage: { cpu: 12, memory: 8, api: 5 }
    },
    {
      ruleId: 'RULE002',
      executions: 85,
      successRate: 99.2,
      averageTime: 45.6,
      lastRunTime: 42.3,
      errorCount: 1,
      resourceUsage: { cpu: 25, memory: 15, api: 28 }
    },
    {
      ruleId: 'RULE003',
      executions: 1250,
      successRate: 94.8,
      averageTime: 8.2,
      lastRunTime: 7.8,
      errorCount: 65,
      resourceUsage: { cpu: 35, memory: 22, api: 45 }
    }
  ];

  // Analytics data
  const executionTrend = [
    { hour: '00:00', executions: 12, errors: 1 },
    { hour: '04:00', executions: 8, errors: 0 },
    { hour: '08:00', executions: 45, errors: 2 },
    { hour: '12:00', executions: 62, errors: 3 },
    { hour: '16:00', executions: 55, errors: 2 },
    { hour: '20:00', executions: 28, errors: 1 }
  ];

  const categoryDistribution = [
    { category: 'Invoice', count: 8, percentage: 32 },
    { category: 'Payment', count: 6, percentage: 24 },
    { category: 'Reconciliation', count: 5, percentage: 20 },
    { category: 'Reporting', count: 4, percentage: 16 },
    { category: 'Compliance', count: 2, percentage: 8 }
  ];

  const resourceUtilization = [
    { resource: 'CPU', used: 35, available: 65 },
    { resource: 'Memory', used: 42, available: 58 },
    { resource: 'API Calls', used: 2850, limit: 5000 },
    { resource: 'Storage', used: 15, available: 85 }
  ];

  const renderDashboardTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Rules</p>
              <p className="text-2xl font-bold text-gray-900">
                {automationRules.filter(r => r.status === 'active').length}
              </p>
              <p className="text-xs text-gray-500">of {automationRules.length} total</p>
            </div>
            <Zap className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Executions Today</p>
              <p className="text-2xl font-bold text-gray-900">210</p>
              <p className="text-xs text-gray-500">98.1% success</p>
            </div>
            <Activity className="h-8 w-8 text-green-500" />
          </div>
        </div>
        <div className="bg-purple-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Time Saved</p>
              <p className="text-2xl font-bold text-gray-900">48h</p>
              <p className="text-xs text-gray-500">This week</p>
            </div>
            <Clock className="h-8 w-8 text-purple-500" />
          </div>
        </div>
        <div className="bg-yellow-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Cost Savings</p>
              <p className="text-2xl font-bold text-gray-900">$12.5K</p>
              <p className="text-xs text-gray-500">This month</p>
            </div>
            <DollarSign className="h-8 w-8 text-yellow-600" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Execution Activity</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={executionTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="executions" stroke="#3B82F6" fill="#93C5FD" fillOpacity={0.6} />
              <Area type="monotone" dataKey="errors" stroke="#EF4444" fill="#FCA5A5" fillOpacity={0.6} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Rules by Category</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={categoryDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ category, percentage }) => `${category} ${percentage}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {categoryDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'][index % 5]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Active Automation Rules</h3>
          <button className="text-blue-600 hover:text-blue-800 text-sm">View All</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {automationRules.filter(r => r.status === 'active').slice(0, 6).map(rule => (
            <div key={rule.id} className="border rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-medium">{rule.name}</h4>
                  <p className="text-xs text-gray-500 capitalize">{rule.category}</p>
                </div>
                <span className={`px-2 py-1 rounded text-xs capitalize ${
                  rule.priority === 'critical' ? 'bg-red-100 text-red-800' :
                  rule.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                  rule.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {rule.priority}
                </span>
              </div>

              <p className="text-sm text-gray-600 mb-3">{rule.description}</p>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-500">Executions:</span>
                  <span className="font-medium">{rule.executionCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Success Rate:</span>
                  <span className={`font-medium ${rule.successRate >= 95 ? 'text-green-600' : 'text-yellow-600'}`}>
                    {rule.successRate}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Avg Time:</span>
                  <span className="font-medium">{rule.averageRunTime}s</span>
                </div>
                {rule.lastRun && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Last Run:</span>
                    <span>{new Date(rule.lastRun).toLocaleTimeString()}</span>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center mt-3 pt-3 border-t">
                <button
                  onClick={() => setSelectedRule(rule)}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  View Details
                </button>
                <div className="flex space-x-2">
                  <button className="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                    <Settings className="h-4 w-4 text-gray-600" />
                    <span className="text-gray-700">Settings</span>
                  </button>
                  <button className="inline-flex items-center gap-1.5 px-3 py-2 border border-yellow-300 rounded-lg hover:bg-yellow-50 text-sm">
                    <Pause className="h-4 w-4 text-yellow-600" />
                    <span className="text-yellow-600">Pause</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Resource Utilization</h3>
          <div className="space-y-3">
            {resourceUtilization.map(resource => (
              <div key={resource.resource}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{resource.resource}</span>
                  <span className="text-gray-500">
                    {resource.resource === 'API Calls' ? `${resource.used}/${resource.limit}` : `${resource.used}%`}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      resource.used > 80 ? 'bg-red-500' :
                      resource.used > 60 ? 'bg-yellow-500' :
                      'bg-green-500'
                    }`}
                    style={{ width: `${resource.resource === 'API Calls' ? (resource.used / (resource.limit ?? 1)) * 100 : resource.used}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Executions</h3>
          <div className="space-y-2">
            {ruleExecutions.slice(0, 5).map(execution => {
              const rule = automationRules.find(r => r.id === execution.ruleId);
              return (
                <div key={execution.id} className="p-2 bg-gray-50 rounded">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{rule?.name}</p>
                      <p className="text-xs text-gray-500">{execution.startTime}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      execution.status === 'completed' ? 'bg-green-100 text-green-800' :
                      execution.status === 'running' ? 'bg-blue-100 text-blue-800' :
                      execution.status === 'failed' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {execution.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Upcoming Scheduled</h3>
          <div className="space-y-2">
            {automationRules
              .filter(r => r.nextRun)
              .sort((a, b) => new Date(a.nextRun!).getTime() - new Date(b.nextRun!).getTime())
              .slice(0, 5)
              .map(rule => (
                <div key={rule.id} className="p-2 bg-gray-50 rounded">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{rule.name}</p>
                      <p className="text-xs text-gray-500">{rule.nextRun}</p>
                    </div>
                    <Clock className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderRulesTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Automation Rules</h3>
          <div className="flex space-x-2">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="border rounded px-3 py-2"
            >
              <option value="all">All Categories</option>
              <option value="invoice">Invoice</option>
              <option value="payment">Payment</option>
              <option value="reconciliation">Reconciliation</option>
              <option value="reporting">Reporting</option>
              <option value="compliance">Compliance</option>
            </select>
            <button
              onClick={() => setShowRuleBuilder(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Rule
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Rule Name</th>
                <th className="text-left py-2">Category</th>
                <th className="text-left py-2">Type</th>
                <th className="text-center py-2">Status</th>
                <th className="text-center py-2">Priority</th>
                <th className="text-right py-2">Executions</th>
                <th className="text-right py-2">Success Rate</th>
                <th className="text-left py-2">Last Run</th>
                <th className="text-center py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {automationRules
                .filter(r => filterCategory === 'all' || r.category === filterCategory)
                .map(rule => (
                  <tr key={rule.id} className="border-b hover:bg-gray-50">
                    <td className="py-2">
                      <div>
                        <p className="font-medium">{rule.name}</p>
                        <p className="text-xs text-gray-500">{rule.description}</p>
                      </div>
                    </td>
                    <td className="py-2 capitalize">{rule.category}</td>
                    <td className="py-2 capitalize">{rule.type}</td>
                    <td className="text-center py-2">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        rule.status === 'active' ? 'bg-green-100 text-green-800' :
                        rule.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
                        rule.status === 'testing' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {rule.status}
                      </span>
                    </td>
                    <td className="text-center py-2">
                      <span className={`px-2 py-1 rounded text-xs capitalize ${
                        rule.priority === 'critical' ? 'bg-red-100 text-red-800' :
                        rule.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                        rule.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {rule.priority}
                      </span>
                    </td>
                    <td className="text-right py-2">{rule.executionCount}</td>
                    <td className="text-right py-2">
                      <span className={`font-medium ${
                        rule.successRate >= 95 ? 'text-green-600' :
                        rule.successRate >= 80 ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        {rule.successRate}%
                      </span>
                    </td>
                    <td className="py-2 text-sm">
                      {rule.lastRun ? new Date(rule.lastRun).toLocaleString() : '-'}
                    </td>
                    <td className="text-center py-2">
                      <div className="flex justify-center space-x-2">
                        <button
                          onClick={() => setShowTestModal(true)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Terminal className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setSelectedRule(rule)}
                          className="text-gray-600 hover:text-gray-800"
                        >
                          <Settings className="h-4 w-4" />
                        </button>
                        {rule.status === 'active' ? (
                          <button className="inline-flex items-center gap-1.5 px-3 py-2 border border-yellow-300 rounded-lg hover:bg-yellow-50 text-sm">
                            <Pause className="h-4 w-4 text-yellow-600" />
                            <span className="text-yellow-600">Pause</span>
                          </button>
                        ) : (
                          <button className="inline-flex items-center gap-1.5 px-3 py-2 border border-green-300 rounded-lg hover:bg-green-50 text-sm">
                            <Play className="h-4 w-4 text-green-600" />
                            <span className="text-green-600">Play</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedRule && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">{selectedRule.name} - Configuration</h3>
            <button onClick={() => setSelectedRule(null)}>
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">Trigger Configuration</h4>
              <div className="p-4 bg-gray-50 rounded space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Type:</span>
                  <span className="capitalize">{selectedRule.trigger.type}</span>
                </div>
                {selectedRule.trigger.event && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Event:</span>
                    <span className="font-mono text-xs">{selectedRule.trigger.event}</span>
                  </div>
                )}
                {selectedRule.trigger.frequency && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Frequency:</span>
                    <span>{selectedRule.trigger.frequency}</span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3">Performance Metrics</h4>
              <div className="p-4 bg-gray-50 rounded space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total Executions:</span>
                  <span className="font-semibold">{selectedRule.executionCount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Success Rate:</span>
                  <span className="font-semibold text-green-600">{selectedRule.successRate}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Avg Run Time:</span>
                  <span className="font-semibold">{selectedRule.averageRunTime}s</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Modified:</span>
                  <span>{selectedRule.modifiedDate}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h4 className="font-medium mb-3">Conditions ({selectedRule.conditions.length})</h4>
            <div className="space-y-2">
              {selectedRule.conditions.map(condition => (
                <div key={condition.id} className="flex items-center p-3 bg-gray-50 rounded">
                  <span className="text-sm font-mono">{condition.field}</span>
                  <span className="mx-2 px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                    {condition.operator}
                  </span>
                  <span className="text-sm font-mono">{condition.value}</span>
                  {condition.logic && (
                    <span className="ml-auto px-2 py-1 bg-gray-200 rounded text-xs uppercase">
                      {condition.logic}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <h4 className="font-medium mb-3">Actions ({selectedRule.actions.length})</h4>
            <div className="space-y-2">
              {selectedRule.actions.map(action => (
                <div key={action.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div className="flex items-center">
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs mr-3">
                      {action.sequence}
                    </span>
                    <div>
                      <span className="text-sm font-medium capitalize">{action.type}</span>
                      <span className="text-sm text-gray-600 ml-2">{action.target}</span>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">
                    Error: {action.errorHandling}
                    {action.retryAttempts && ` (${action.retryAttempts} retries)`}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderTemplatesTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Automation Templates</h3>
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Search templates..."
              className="border rounded px-3 py-2"
            />
            <button className="border border-gray-300 px-4 py-2 rounded hover:bg-gray-50">
              <Filter className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {automationTemplates.map(template => (
            <div key={template.id} className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-semibold">{template.name}</h4>
                  <p className="text-xs text-gray-500 capitalize">{template.category}</p>
                </div>
                <div className="flex items-center">
                  <span className={`px-2 py-1 rounded text-xs capitalize ${
                    template.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                    template.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {template.difficulty}
                  </span>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-3">{template.description}</p>

              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <div className="flex -space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className={`w-4 h-4 rounded-full border-2 border-white ${
                          i < Math.floor(template.popularity / 20) ? 'bg-yellow-400' : 'bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-gray-500 ml-2">{template.popularity}% popular</span>
                </div>
                <span className="text-xs text-gray-500">
                  <Clock className="h-3 w-3 inline mr-1" />
                  {template.estimatedTime}
                </span>
              </div>

              <button
                onClick={() => setShowTemplateModal(true)}
                className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 text-sm"
              >
                Use Template
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Popular Use Cases</h3>
          <div className="space-y-3">
            {[
              { name: 'Automated Invoice Processing', users: 250, savings: '$45K/month' },
              { name: 'Payment Reminder Workflow', users: 180, savings: '$12K/month' },
              { name: 'Expense Report Automation', users: 156, savings: '$8K/month' },
              { name: 'Bank Reconciliation', users: 142, savings: '$25K/month' },
              { name: 'Financial Report Generation', users: 98, savings: '$15K/month' }
            ].map((useCase, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">{useCase.name}</p>
                    <p className="text-xs text-gray-500">{useCase.users} users</p>
                  </div>
                  <span className="text-sm font-semibold text-green-600">{useCase.savings}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Template Categories</h3>
          <ResponsiveContainer width="100%" height={250}>
            <Treemap
              data={[
                { name: 'Invoice', size: 35, fill: '#3B82F6' },
                { name: 'Payment', size: 25, fill: '#10B981' },
                { name: 'Reporting', size: 20, fill: '#F59E0B' },
                { name: 'Compliance', size: 12, fill: '#EF4444' },
                { name: 'Other', size: 8, fill: '#8B5CF6' }
              ]}
              dataKey="size"
              aspectRatio={4/3}
              stroke="#fff"
            >
              <Tooltip />
            </Treemap>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  const renderMonitoringTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">System Health</h3>
          <div className="space-y-3">
            {[
              { component: 'Rule Engine', status: 'operational', latency: 12 },
              { component: 'Scheduler', status: 'operational', latency: 8 },
              { component: 'Event Processor', status: 'operational', latency: 15 },
              { component: 'Action Handler', status: 'degraded', latency: 45 },
              { component: 'Notification Service', status: 'operational', latency: 20 }
            ].map(component => (
              <div key={component.component} className="flex items-center justify-between">
                <span className="text-sm">{component.component}</span>
                <div className="flex items-center">
                  <span className="text-xs text-gray-500 mr-2">{component.latency}ms</span>
                  <div className={`w-2 h-2 rounded-full ${
                    component.status === 'operational' ? 'bg-green-500' :
                    component.status === 'degraded' ? 'bg-yellow-500' :
                    'bg-red-500'
                  }`} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Execution Performance</h3>
          <ResponsiveContainer width="100%" height={200}>
            <RadialBarChart cx="50%" cy="50%" innerRadius="10%" outerRadius="90%" data={[
              { name: 'Success', value: 98.1, fill: '#10B981' },
              { name: 'Failed', value: 1.9, fill: '#EF4444' }
            ]}>
              <RadialBar dataKey="value" />
              <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="text-2xl font-bold">
                98.1%
              </text>
            </RadialBarChart>
          </ResponsiveContainer>
          <div className="flex justify-between text-sm mt-4">
            <span>Success Rate</span>
            <span className="font-semibold">Last 24h</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Top Performing Rules</h3>
          <div className="space-y-2">
            {performanceMetrics
              .sort((a, b) => b.successRate - a.successRate)
              .slice(0, 3)
              .map(metric => {
                const rule = automationRules.find(r => r.id === metric.ruleId);
                return (
                  <div key={metric.ruleId} className="p-2 bg-gray-50 rounded">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{rule?.name}</span>
                      <span className="text-xs font-semibold text-green-600">{metric.successRate}%</span>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>{metric.executions} runs</span>
                      <span>{metric.averageTime}s avg</span>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Execution Logs</h3>
          <div className="flex space-x-2">
            <select className="border rounded px-3 py-2 text-sm">
              <option>All Rules</option>
              {automationRules.map(rule => (
                <option key={rule.id} value={rule.id}>{rule.name}</option>
              ))}
            </select>
            <button className="text-blue-600 hover:text-blue-800 text-sm flex items-center">
              <RefreshCw className="h-4 w-4 mr-1" />
              Refresh
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Execution ID</th>
                <th className="text-left py-2">Rule</th>
                <th className="text-left py-2">Started</th>
                <th className="text-center py-2">Status</th>
                <th className="text-right py-2">Records</th>
                <th className="text-left py-2">Triggered By</th>
                <th className="text-center py-2">Logs</th>
              </tr>
            </thead>
            <tbody>
              {ruleExecutions.map(execution => {
                const rule = automationRules.find(r => r.id === execution.ruleId);
                return (
                  <tr key={execution.id} className="border-b hover:bg-gray-50">
                    <td className="py-2 font-mono text-xs">{execution.id}</td>
                    <td className="py-2">{rule?.name}</td>
                    <td className="py-2">{execution.startTime}</td>
                    <td className="text-center py-2">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        execution.status === 'completed' ? 'bg-green-100 text-green-800' :
                        execution.status === 'running' ? 'bg-blue-100 text-blue-800' :
                        execution.status === 'failed' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {execution.status}
                      </span>
                    </td>
                    <td className="text-right py-2">{execution.recordsProcessed}</td>
                    <td className="py-2">{execution.triggeredBy}</td>
                    <td className="text-center py-2">
                      <button className="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                        <Eye className="h-4 w-4 text-gray-600" />
                        <span className="text-gray-700">View</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Error Analysis</h3>
          <div className="space-y-3">
            {[
              { error: 'Timeout Exception', count: 5, trend: 'down' },
              { error: 'Validation Failed', count: 8, trend: 'up' },
              { error: 'API Rate Limit', count: 3, trend: 'stable' },
              { error: 'Permission Denied', count: 2, trend: 'down' }
            ].map((error, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div className="flex items-center">
                  <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
                  <span className="text-sm">{error.error}</span>
                </div>
                <div className="flex items-center">
                  <span className="font-semibold mr-2">{error.count}</span>
                  {error.trend === 'up' && <TrendingUp className="h-4 w-4 text-red-500" />}
                  {error.trend === 'down' && <ChevronDown className="h-4 w-4 text-green-500" />}
                  {error.trend === 'stable' && <ArrowRight className="h-4 w-4 text-gray-500" />}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Resource Usage Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={executionTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="executions" stroke="#3B82F6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Financial Automation</h2>
        <p className="text-gray-600">Configure automated rules, workflows, and intelligent process automation</p>
      </div>

      <div className="bg-white rounded-lg shadow mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            {['dashboard', 'rules', 'templates', 'monitoring'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-2 px-6 border-b-2 font-medium text-sm capitalize ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div>
        {activeTab === 'dashboard' && renderDashboardTab()}
        {activeTab === 'rules' && renderRulesTab()}
        {activeTab === 'templates' && renderTemplatesTab()}
        {activeTab === 'monitoring' && renderMonitoringTab()}
      </div>

      {showRuleBuilder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Rule Builder</h3>
              <button onClick={() => setShowRuleBuilder(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded">
              <Bot className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Visual rule builder would be implemented here</p>
              <p className="text-sm text-gray-500 mt-2">Configure triggers, conditions, and actions with drag-and-drop</p>
            </div>
            <div className="flex justify-end mt-6 pt-4 border-t">
              <button
                onClick={() => setShowRuleBuilder(false)}
                className="px-4 py-2 border rounded hover:bg-gray-50 mr-2"
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                Save Rule
              </button>
            </div>
          </div>
        </div>
      )}

      {showTestModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-3xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Test Rule Execution</h3>
              <button onClick={() => setShowTestModal(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="bg-gray-900 text-green-400 p-4 rounded font-mono text-sm">
              <div>$ testing rule: Auto Invoice Processing...</div>
              <div className="mt-2">✓ Trigger configured: invoice.created</div>
              <div>✓ Conditions validated: 2 conditions</div>
              <div>✓ Actions configured: 2 actions</div>
              <div className="mt-2">$ executing test with sample data...</div>
              <div>✓ Condition 1: amount {'<'} 5000 - PASSED</div>
              <div>✓ Condition 2: vendor.approved = true - PASSED</div>
              <div>✓ Action 1: Update invoice.status - SUCCESS</div>
              <div>✓ Action 2: Send notification - SUCCESS</div>
              <div className="mt-2 text-green-300">Test execution completed successfully!</div>
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setShowTestModal(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {showTemplateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Apply Template</h3>
              <button onClick={() => setShowTemplateModal(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Rule Name</label>
                <input type="text" className="w-full border rounded px-3 py-2" defaultValue="Invoice Approval Workflow" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea className="w-full border rounded px-3 py-2" rows={3} defaultValue="Multi-level invoice approval based on amount thresholds" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <select className="w-full border rounded px-3 py-2">
                  <option>Invoice</option>
                  <option>Payment</option>
                  <option>Expense</option>
                  <option>Reporting</option>
                </select>
              </div>
              <div className="bg-blue-50 p-4 rounded">
                <h4 className="font-medium mb-2">Template Configuration</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Approval Levels:</span>
                    <input type="number" className="w-20 border rounded px-2 py-1" defaultValue="3" />
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Threshold Amount:</span>
                    <input type="number" className="w-32 border rounded px-2 py-1" defaultValue="5000" />
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Auto-approve below:</span>
                    <input type="number" className="w-32 border rounded px-2 py-1" defaultValue="1000" />
                  </div>
                </div>
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <button
                  onClick={() => setShowTemplateModal(false)}
                  className="px-4 py-2 border rounded hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                  Apply Template
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinancialAutomation;
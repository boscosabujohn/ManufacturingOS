'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Play,
  Pause,
  Square,
  RotateCcw,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Workflow,
  GitBranch,
  ArrowRight,
  Activity,
  Calendar,
  Timer,
  Zap,
  Settings,
  ChevronDown,
  ChevronUp,
  MoreVertical,
  Eye,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

// ============================================================================
// Types
// ============================================================================

export type WorkflowStatus = 'running' | 'completed' | 'failed' | 'paused' | 'scheduled' | 'idle';
export type TriggerType = 'scheduled' | 'event' | 'manual' | 'webhook' | 'condition';
export type StepStatus = 'completed' | 'running' | 'pending' | 'failed' | 'skipped';

export interface WorkflowStep {
  id: string;
  name: string;
  type: string;
  status: StepStatus;
  startTime?: string;
  endTime?: string;
  duration?: number;
  input?: Record<string, unknown>;
  output?: Record<string, unknown>;
  error?: string;
}

export interface WorkflowExecution {
  id: string;
  workflowId: string;
  status: WorkflowStatus;
  startTime: string;
  endTime?: string;
  duration?: number;
  currentStep: number;
  totalSteps: number;
  steps: WorkflowStep[];
  triggeredBy: string;
}

export interface AutomatedWorkflow {
  id: string;
  name: string;
  description: string;
  category: string;
  status: WorkflowStatus;
  triggerType: TriggerType;
  schedule?: string;
  lastRun?: string;
  nextRun?: string;
  successRate: number;
  avgDuration: number;
  runCount: number;
  isEnabled: boolean;
  steps: { name: string; type: string }[];
  currentExecution?: WorkflowExecution;
}

export interface AutomatedWorkflowStatusProps {
  onWorkflowClick?: (workflow: AutomatedWorkflow) => void;
  onStartWorkflow?: (workflowId: string) => void;
  onPauseWorkflow?: (workflowId: string) => void;
  onStopWorkflow?: (workflowId: string) => void;
}

// ============================================================================
// Mock Data Generator
// ============================================================================

const generateMockWorkflows = (): AutomatedWorkflow[] => [
  {
    id: 'wf-1',
    name: 'Daily Production Schedule Sync',
    description: 'Synchronizes production schedules from ERP to MES every morning',
    category: 'Scheduling',
    status: 'running',
    triggerType: 'scheduled',
    schedule: '0 6 * * *',
    lastRun: '2024-12-05T06:00:00Z',
    nextRun: '2024-12-06T06:00:00Z',
    successRate: 98.5,
    avgDuration: 45,
    runCount: 342,
    isEnabled: true,
    steps: [
      { name: 'Fetch ERP Schedules', type: 'api-call' },
      { name: 'Transform Data', type: 'transform' },
      { name: 'Validate Schedules', type: 'validation' },
      { name: 'Push to MES', type: 'api-call' },
      { name: 'Send Notifications', type: 'notification' },
    ],
    currentExecution: {
      id: 'exec-1',
      workflowId: 'wf-1',
      status: 'running',
      startTime: '2024-12-05T06:00:00Z',
      currentStep: 3,
      totalSteps: 5,
      triggeredBy: 'Scheduler',
      steps: [
        { id: 's1', name: 'Fetch ERP Schedules', type: 'api-call', status: 'completed', startTime: '2024-12-05T06:00:00Z', endTime: '2024-12-05T06:00:12Z', duration: 12000 },
        { id: 's2', name: 'Transform Data', type: 'transform', status: 'completed', startTime: '2024-12-05T06:00:12Z', endTime: '2024-12-05T06:00:18Z', duration: 6000 },
        { id: 's3', name: 'Validate Schedules', type: 'validation', status: 'running', startTime: '2024-12-05T06:00:18Z' },
        { id: 's4', name: 'Push to MES', type: 'api-call', status: 'pending' },
        { id: 's5', name: 'Send Notifications', type: 'notification', status: 'pending' },
      ],
    },
  },
  {
    id: 'wf-2',
    name: 'Quality Alert Handler',
    description: 'Automatically creates tickets and notifies teams when quality issues detected',
    category: 'Quality',
    status: 'idle',
    triggerType: 'event',
    lastRun: '2024-12-05T13:45:22Z',
    successRate: 99.2,
    avgDuration: 8,
    runCount: 156,
    isEnabled: true,
    steps: [
      { name: 'Parse Alert', type: 'transform' },
      { name: 'Create Ticket', type: 'integration' },
      { name: 'Notify Team', type: 'notification' },
      { name: 'Update Dashboard', type: 'api-call' },
    ],
  },
  {
    id: 'wf-3',
    name: 'Inventory Reorder Automation',
    description: 'Triggers purchase orders when inventory falls below reorder point',
    category: 'Inventory',
    status: 'completed',
    triggerType: 'condition',
    lastRun: '2024-12-05T14:00:00Z',
    successRate: 95.8,
    avgDuration: 120,
    runCount: 89,
    isEnabled: true,
    steps: [
      { name: 'Check Inventory Levels', type: 'query' },
      { name: 'Calculate Requirements', type: 'calculation' },
      { name: 'Select Vendors', type: 'decision' },
      { name: 'Generate POs', type: 'document' },
      { name: 'Send to Procurement', type: 'api-call' },
    ],
  },
  {
    id: 'wf-4',
    name: 'Machine Maintenance Scheduler',
    description: 'Schedules preventive maintenance based on machine runtime and sensor data',
    category: 'Maintenance',
    status: 'failed',
    triggerType: 'scheduled',
    schedule: '0 */4 * * *',
    lastRun: '2024-12-05T12:00:00Z',
    nextRun: '2024-12-05T16:00:00Z',
    successRate: 87.3,
    avgDuration: 35,
    runCount: 456,
    isEnabled: true,
    steps: [
      { name: 'Collect Sensor Data', type: 'api-call' },
      { name: 'Analyze Runtime', type: 'calculation' },
      { name: 'Check Thresholds', type: 'condition' },
      { name: 'Schedule Maintenance', type: 'scheduling' },
    ],
    currentExecution: {
      id: 'exec-2',
      workflowId: 'wf-4',
      status: 'failed',
      startTime: '2024-12-05T12:00:00Z',
      endTime: '2024-12-05T12:00:25Z',
      duration: 25000,
      currentStep: 2,
      totalSteps: 4,
      triggeredBy: 'Scheduler',
      steps: [
        { id: 's1', name: 'Collect Sensor Data', type: 'api-call', status: 'completed', startTime: '2024-12-05T12:00:00Z', endTime: '2024-12-05T12:00:15Z', duration: 15000 },
        { id: 's2', name: 'Analyze Runtime', type: 'calculation', status: 'failed', startTime: '2024-12-05T12:00:15Z', endTime: '2024-12-05T12:00:25Z', duration: 10000, error: 'Data format mismatch: expected numeric values' },
        { id: 's3', name: 'Check Thresholds', type: 'condition', status: 'skipped' },
        { id: 's4', name: 'Schedule Maintenance', type: 'scheduling', status: 'skipped' },
      ],
    },
  },
  {
    id: 'wf-5',
    name: 'Shift Handover Report',
    description: 'Generates and distributes shift handover reports automatically',
    category: 'Reporting',
    status: 'scheduled',
    triggerType: 'scheduled',
    schedule: '0 6,14,22 * * *',
    lastRun: '2024-12-05T06:00:00Z',
    nextRun: '2024-12-05T14:00:00Z',
    successRate: 100,
    avgDuration: 28,
    runCount: 1024,
    isEnabled: true,
    steps: [
      { name: 'Collect Production Data', type: 'query' },
      { name: 'Generate Report', type: 'document' },
      { name: 'Send Email', type: 'notification' },
    ],
  },
  {
    id: 'wf-6',
    name: 'WIP Tracking Update',
    description: 'Real-time WIP tracking from barcode scans to ERP system',
    category: 'Production',
    status: 'paused',
    triggerType: 'event',
    lastRun: '2024-12-05T13:30:00Z',
    successRate: 99.8,
    avgDuration: 2,
    runCount: 15678,
    isEnabled: false,
    steps: [
      { name: 'Parse Scan Data', type: 'transform' },
      { name: 'Update WIP Status', type: 'api-call' },
      { name: 'Trigger Downstream', type: 'event' },
    ],
  },
];

// ============================================================================
// Helper Functions
// ============================================================================

const getStatusColor = (status: WorkflowStatus) => {
  switch (status) {
    case 'running': return 'text-blue-600';
    case 'completed': return 'text-green-600';
    case 'failed': return 'text-red-600';
    case 'paused': return 'text-amber-600';
    case 'scheduled': return 'text-purple-600';
    case 'idle': return 'text-gray-500';
  }
};

const getStatusBgColor = (status: WorkflowStatus) => {
  switch (status) {
    case 'running': return 'bg-blue-100 dark:bg-blue-900/30';
    case 'completed': return 'bg-green-100 dark:bg-green-900/30';
    case 'failed': return 'bg-red-100 dark:bg-red-900/30';
    case 'paused': return 'bg-amber-100 dark:bg-amber-900/30';
    case 'scheduled': return 'bg-purple-100 dark:bg-purple-900/30';
    case 'idle': return 'bg-gray-100 dark:bg-gray-700';
  }
};

const getStatusIcon = (status: WorkflowStatus) => {
  switch (status) {
    case 'running': return Play;
    case 'completed': return CheckCircle;
    case 'failed': return XCircle;
    case 'paused': return Pause;
    case 'scheduled': return Clock;
    case 'idle': return Square;
  }
};

const getStepStatusColor = (status: StepStatus) => {
  switch (status) {
    case 'completed': return 'bg-green-500';
    case 'running': return 'bg-blue-500';
    case 'pending': return 'bg-gray-300 dark:bg-gray-600';
    case 'failed': return 'bg-red-500';
    case 'skipped': return 'bg-gray-400';
  }
};

const getTriggerIcon = (type: TriggerType) => {
  switch (type) {
    case 'scheduled': return Calendar;
    case 'event': return Zap;
    case 'manual': return Play;
    case 'webhook': return GitBranch;
    case 'condition': return AlertTriangle;
  }
};

const formatDuration = (ms: number) => {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
  return `${Math.round(ms / 60000)}m`;
};

// ============================================================================
// Workflow Stats Component
// ============================================================================

function WorkflowStats({ workflows }: { workflows: AutomatedWorkflow[] }) {
  const stats = useMemo(() => {
    const running = workflows.filter(w => w.status === 'running').length;
    const failed = workflows.filter(w => w.status === 'failed').length;
    const enabled = workflows.filter(w => w.isEnabled).length;
    const totalRuns = workflows.reduce((sum, w) => sum + w.runCount, 0);
    const avgSuccess = Math.round(workflows.reduce((sum, w) => sum + w.successRate, 0) / workflows.length * 10) / 10;

    return { running, failed, enabled, total: workflows.length, totalRuns, avgSuccess };
  }, [workflows]);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-2">
      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center gap-3">
            <Play className="w-8 h-8 text-blue-500" />
            <div>
              <p className="text-2xl font-bold text-blue-600">{stats.running}</p>
              <p className="text-xs text-gray-500">Running Now</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-8 h-8 text-green-500" />
            <div>
              <p className="text-2xl font-bold text-green-600">{stats.enabled}/{stats.total}</p>
              <p className="text-xs text-gray-500">Active Workflows</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center gap-3">
            <XCircle className="w-8 h-8 text-red-500" />
            <div>
              <p className="text-2xl font-bold text-red-600">{stats.failed}</p>
              <p className="text-xs text-gray-500">Failed</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center gap-3">
            <Activity className="w-8 h-8 text-purple-500" />
            <div>
              <p className="text-2xl font-bold">{(stats.totalRuns / 1000).toFixed(1)}K</p>
              <p className="text-xs text-gray-500">Total Runs</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center gap-3">
            <Timer className="w-8 h-8 text-indigo-500" />
            <div>
              <p className="text-2xl font-bold text-indigo-600">{stats.avgSuccess}%</p>
              <p className="text-xs text-gray-500">Avg Success Rate</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ============================================================================
// Workflow Step Visualization Component
// ============================================================================

function WorkflowStepVisualization({ steps }: { steps: WorkflowStep[] }) {
  return (
    <div className="relative flex items-center gap-1 py-2">
      {steps.map((step, index) => (
        <React.Fragment key={step.id}>
          {/* Step Node */}
          <div className="relative group">
            <div className={`w-8 h-8 rounded-full ${getStepStatusColor(step.status)} flex items-center justify-center`}>
              {step.status === 'running' ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : step.status === 'completed' ? (
                <CheckCircle className="w-4 h-4 text-white" />
              ) : step.status === 'failed' ? (
                <XCircle className="w-4 h-4 text-white" />
              ) : (
                <span className="text-xs text-white font-medium">{index + 1}</span>
              )}
            </div>

            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
              <p className="font-medium">{step.name}</p>
              {step.duration && <p className="text-gray-300">{formatDuration(step.duration)}</p>}
              {step.error && <p className="text-red-300">{step.error}</p>}
            </div>
          </div>

          {/* Connector */}
          {index < steps.length - 1 && (
            <div className={`flex-1 h-0.5 min-w-[20px] ${
              step.status === 'completed' ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
            }`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

// ============================================================================
// Workflow Card Component
// ============================================================================

function WorkflowCard({
  workflow,
  onStart,
  onPause,
  onStop,
  onClick,
}: {
  workflow: AutomatedWorkflow;
  onStart?: (id: string) => void;
  onPause?: (id: string) => void;
  onStop?: (id: string) => void;
  onClick?: (workflow: AutomatedWorkflow) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(workflow.status === 'running' || workflow.status === 'failed');
  const StatusIcon = getStatusIcon(workflow.status);
  const TriggerIcon = getTriggerIcon(workflow.triggerType);

  return (
    <Card className={`${workflow.status === 'failed' ? 'border-red-300 dark:border-red-700' : ''} ${!workflow.isEnabled ? 'opacity-60' : ''}`}>
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className={`p-2 rounded-lg ${getStatusBgColor(workflow.status)}`}>
              <StatusIcon className={`w-5 h-5 ${getStatusColor(workflow.status)} ${workflow.status === 'running' ? 'animate-pulse' : ''}`} />
            </div>
            <div>
              <h4
                className="font-semibold text-gray-900 dark:text-white cursor-pointer hover:text-blue-600 transition-colors"
                onClick={() => onClick?.(workflow)}
              >
                {workflow.name}
              </h4>
              <p className="text-sm text-gray-500 mt-0.5">{workflow.description}</p>
              <div className="flex items-center gap-3 mt-2">
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${getStatusBgColor(workflow.status)} ${getStatusColor(workflow.status)}`}>
                  {workflow.status.toUpperCase()}
                </span>
                <span className="flex items-center gap-1 text-xs text-gray-500">
                  <TriggerIcon className="w-3 h-3" />
                  {workflow.triggerType}
                </span>
                <span className="text-xs text-gray-500">{workflow.category}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {workflow.status === 'running' ? (
              <>
                <Button variant="outline" size="sm" onClick={() => onPause?.(workflow.id)}>
                  <Pause className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => onStop?.(workflow.id)}>
                  <Square className="w-4 h-4" />
                </Button>
              </>
            ) : workflow.status === 'paused' ? (
              <Button variant="outline" size="sm" onClick={() => onStart?.(workflow.id)}>
                <Play className="w-4 h-4" />
              </Button>
            ) : (
              <Button variant="outline" size="sm" onClick={() => onStart?.(workflow.id)} disabled={!workflow.isEnabled}>
                <Play className="w-4 h-4" />
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={() => setIsExpanded(!isExpanded)}>
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-2 mt-4 text-sm">
          <div>
            <p className="text-gray-500 text-xs">Success Rate</p>
            <p className={`font-semibold ${workflow.successRate >= 95 ? 'text-green-600' : workflow.successRate >= 80 ? 'text-amber-600' : 'text-red-600'}`}>
              {workflow.successRate}%
            </p>
          </div>
          <div>
            <p className="text-gray-500 text-xs">Avg Duration</p>
            <p className="font-semibold">{workflow.avgDuration}s</p>
          </div>
          <div>
            <p className="text-gray-500 text-xs">Total Runs</p>
            <p className="font-semibold">{workflow.runCount.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-gray-500 text-xs">Last Run</p>
            <p className="font-semibold text-xs">
              {workflow.lastRun ? new Date(workflow.lastRun).toLocaleTimeString() : 'Never'}
            </p>
          </div>
        </div>

        {/* Current Execution */}
        {isExpanded && workflow.currentExecution && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-3">
              <h5 className="text-sm font-medium">Current Execution</h5>
              <span className="text-xs text-gray-500">
                Step {workflow.currentExecution.currentStep} of {workflow.currentExecution.totalSteps}
              </span>
            </div>

            <WorkflowStepVisualization steps={workflow.currentExecution.steps} />

            {/* Step details */}
            <div className="mt-3 space-y-2">
              {workflow.currentExecution.steps.map(step => (
                <div
                  key={step.id}
                  className={`p-2 rounded text-sm flex items-center justify-between ${
                    step.status === 'running' ? 'bg-blue-50 dark:bg-blue-900/20' :
                    step.status === 'failed' ? 'bg-red-50 dark:bg-red-900/20' :
                    step.status === 'completed' ? 'bg-green-50 dark:bg-green-900/20' :
                    'bg-gray-50 dark:bg-gray-800'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${getStepStatusColor(step.status)}`} />
                    <span className={step.status === 'skipped' ? 'text-gray-400 line-through' : ''}>
                      {step.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    {step.duration && <span>{formatDuration(step.duration)}</span>}
                    {step.error && <span className="text-red-600">{step.error}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Next Run */}
        {workflow.nextRun && workflow.isEnabled && (
          <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between text-sm">
            <span className="text-gray-500">Next scheduled run:</span>
            <span className="font-medium flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {new Date(workflow.nextRun).toLocaleString()}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export function AutomatedWorkflowStatus({
  onWorkflowClick,
  onStartWorkflow,
  onPauseWorkflow,
  onStopWorkflow,
}: AutomatedWorkflowStatusProps) {
  const [workflows, setWorkflows] = useState<AutomatedWorkflow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<WorkflowStatus | 'all'>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  useEffect(() => {
    setWorkflows(generateMockWorkflows());
    setIsLoading(false);
  }, []);

  const categories = useMemo(() => {
    const cats = new Set(workflows.map(w => w.category));
    return Array.from(cats);
  }, [workflows]);

  const filteredWorkflows = useMemo(() => {
    let result = [...workflows];

    if (filterStatus !== 'all') {
      result = result.filter(w => w.status === filterStatus);
    }

    if (filterCategory !== 'all') {
      result = result.filter(w => w.category === filterCategory);
    }

    // Sort: running first, then failed, then others
    const statusOrder = { running: 0, failed: 1, paused: 2, scheduled: 3, completed: 4, idle: 5 };
    result.sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);

    return result;
  }, [workflows, filterStatus, filterCategory]);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="h-[400px] flex items-center justify-center">
          <Activity className="w-8 h-8 animate-spin text-gray-400" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {/* Header */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Workflow className="w-5 h-5 text-purple-600" />
              Automated Workflow Status
            </CardTitle>
            <div className="flex items-center gap-3">
              <select
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value as WorkflowStatus | 'all')}
                className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm"
              >
                <option value="all">All Status</option>
                <option value="running">Running</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
                <option value="paused">Paused</option>
                <option value="scheduled">Scheduled</option>
                <option value="idle">Idle</option>
              </select>

              <select
                value={filterCategory}
                onChange={e => setFilterCategory(e.target.value)}
                className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm"
              >
                <option value="all">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>

              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Manage
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <WorkflowStats workflows={workflows} />
        </CardContent>
      </Card>

      {/* Workflow Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
        {filteredWorkflows.map(workflow => (
          <WorkflowCard
            key={workflow.id}
            workflow={workflow}
            onStart={onStartWorkflow}
            onPause={onPauseWorkflow}
            onStop={onStopWorkflow}
            onClick={onWorkflowClick}
          />
        ))}
      </div>

      {filteredWorkflows.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center text-gray-500">
            No workflows match the selected filters
          </CardContent>
        </Card>
      )}
    </div>
  );
}

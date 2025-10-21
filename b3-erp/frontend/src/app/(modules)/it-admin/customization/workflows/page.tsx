'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, GitBranch, Play, Pause, Edit, Trash2, CheckCircle, ArrowRight, Mail, Bell, Database, AlertTriangle } from 'lucide-react';

interface WorkflowAction {
  type: 'email' | 'notification' | 'update_field' | 'create_record' | 'approval' | 'webhook';
  config: {
    [key: string]: any;
  };
}

interface Workflow {
  id: string;
  name: string;
  description: string;
  module: string;
  trigger: 'onCreate' | 'onUpdate' | 'onDelete' | 'onStatusChange' | 'scheduled';
  triggerConfig?: string;
  conditions: string[];
  actions: WorkflowAction[];
  active: boolean;
  executionCount: number;
  lastExecuted?: string;
  createdAt: string;
  priority: 'low' | 'medium' | 'high';
}

export default function WorkflowsPage() {
  const router = useRouter();
  const [selectedModule, setSelectedModule] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);

  const [workflows, setWorkflows] = useState<Workflow[]>([
    {
      id: '1',
      name: 'New Order Notification',
      description: 'Send email and notification when a new sales order is created',
      module: 'Sales Orders',
      trigger: 'onCreate',
      conditions: ['status = "pending"', 'amount > 10000'],
      actions: [
        { type: 'email', config: { to: 'sales@company.com', template: 'new_order' } },
        { type: 'notification', config: { users: ['sales_manager'], message: 'New high-value order created' } }
      ],
      active: true,
      executionCount: 1247,
      lastExecuted: '2024-01-20 14:23:00',
      createdAt: '2024-01-05',
      priority: 'high'
    },
    {
      id: '2',
      name: 'Order Approval Workflow',
      description: 'Require manager approval for orders above $50,000',
      module: 'Sales Orders',
      trigger: 'onCreate',
      conditions: ['amount > 50000'],
      actions: [
        { type: 'approval', config: { approver_role: 'manager', timeout: 24 } },
        { type: 'email', config: { to: 'manager@company.com', template: 'approval_required' } }
      ],
      active: true,
      executionCount: 89,
      lastExecuted: '2024-01-19 16:45:00',
      createdAt: '2024-01-08',
      priority: 'high'
    },
    {
      id: '3',
      name: 'Low Stock Alert',
      description: 'Alert when inventory falls below minimum level',
      module: 'Inventory',
      trigger: 'onUpdate',
      triggerConfig: 'quantity_on_hand changed',
      conditions: ['quantity_on_hand < reorder_point'],
      actions: [
        { type: 'notification', config: { users: ['inventory_manager'], message: 'Low stock alert' } },
        { type: 'create_record', config: { module: 'purchase_requisitions', auto_populate: true } }
      ],
      active: true,
      executionCount: 456,
      lastExecuted: '2024-01-20 11:30:00',
      createdAt: '2024-01-10',
      priority: 'high'
    },
    {
      id: '4',
      name: 'Work Order Completion',
      description: 'Update inventory and notify customer when work order completes',
      module: 'Work Orders',
      trigger: 'onStatusChange',
      triggerConfig: 'status changed to "completed"',
      conditions: ['quality_check_passed = true'],
      actions: [
        { type: 'update_field', config: { module: 'inventory', field: 'quantity_on_hand', operation: 'increment' } },
        { type: 'email', config: { to: 'customer.email', template: 'order_ready' } },
        { type: 'notification', config: { users: ['production_manager'], message: 'Work order completed' } }
      ],
      active: true,
      executionCount: 2847,
      lastExecuted: '2024-01-20 15:10:00',
      createdAt: '2024-01-03',
      priority: 'medium'
    },
    {
      id: '5',
      name: 'Customer Welcome Email',
      description: 'Send welcome email to new customers',
      module: 'Customers',
      trigger: 'onCreate',
      conditions: [],
      actions: [
        { type: 'email', config: { to: 'customer.email', template: 'welcome' } }
      ],
      active: true,
      executionCount: 234,
      lastExecuted: '2024-01-20 09:15:00',
      createdAt: '2024-01-12',
      priority: 'low'
    },
    {
      id: '6',
      name: 'Invoice Payment Reminder',
      description: 'Send reminder for overdue invoices',
      module: 'Invoices',
      trigger: 'scheduled',
      triggerConfig: 'daily at 09:00',
      conditions: ['due_date < today()', 'status = "unpaid"'],
      actions: [
        { type: 'email', config: { to: 'customer.email', template: 'payment_reminder' } }
      ],
      active: true,
      executionCount: 1567,
      lastExecuted: '2024-01-20 09:00:00',
      createdAt: '2024-01-07',
      priority: 'medium'
    },
    {
      id: '7',
      name: 'Quality Check Failed',
      description: 'Alert when quality check fails on production',
      module: 'Quality Checks',
      trigger: 'onCreate',
      conditions: ['result = "failed"'],
      actions: [
        { type: 'notification', config: { users: ['quality_manager', 'production_manager'], message: 'Quality check failed - immediate attention required' } },
        { type: 'update_field', config: { module: 'work_orders', field: 'status', value: 'on_hold' } },
        { type: 'webhook', config: { url: 'https://api.company.com/quality-alert', method: 'POST' } }
      ],
      active: true,
      executionCount: 45,
      lastExecuted: '2024-01-18 14:20:00',
      createdAt: '2024-01-15',
      priority: 'high'
    },
    {
      id: '8',
      name: 'Supplier Order Auto-Create',
      description: 'Automatically create purchase orders for low stock items',
      module: 'Inventory',
      trigger: 'scheduled',
      triggerConfig: 'weekly on Monday at 08:00',
      conditions: ['quantity_on_hand < reorder_point', 'auto_reorder = true'],
      actions: [
        { type: 'create_record', config: { module: 'purchase_orders', auto_populate: true } },
        { type: 'email', config: { to: 'purchasing@company.com', template: 'auto_po_created' } }
      ],
      active: false,
      executionCount: 23,
      lastExecuted: '2024-01-15 08:00:00',
      createdAt: '2024-01-11',
      priority: 'medium'
    },
    {
      id: '9',
      name: 'Shipment Tracking Update',
      description: 'Notify customer when shipment status changes',
      module: 'Shipments',
      trigger: 'onUpdate',
      triggerConfig: 'tracking_status changed',
      conditions: [],
      actions: [
        { type: 'email', config: { to: 'customer.email', template: 'shipment_update' } },
        { type: 'notification', config: { users: ['customer'], message: 'Your shipment status has been updated' } }
      ],
      active: true,
      executionCount: 3456,
      lastExecuted: '2024-01-20 13:45:00',
      createdAt: '2024-01-06',
      priority: 'low'
    },
    {
      id: '10',
      name: 'Employee Onboarding',
      description: 'Automate employee onboarding tasks',
      module: 'Employees',
      trigger: 'onCreate',
      conditions: ['status = "active"'],
      actions: [
        { type: 'email', config: { to: 'employee.email', template: 'onboarding_welcome' } },
        { type: 'create_record', config: { module: 'tasks', tasks: ['Setup workstation', 'Assign equipment', 'Schedule training'] } },
        { type: 'notification', config: { users: ['hr_manager'], message: 'New employee onboarding initiated' } }
      ],
      active: true,
      executionCount: 12,
      lastExecuted: '2024-01-17 10:00:00',
      createdAt: '2024-01-14',
      priority: 'medium'
    }
  ]);

  const modules = [
    'all',
    'Sales Orders',
    'Inventory',
    'Work Orders',
    'Customers',
    'Invoices',
    'Quality Checks',
    'Shipments',
    'Employees'
  ];

  const triggers = [
    { id: 'onCreate', name: 'On Create', icon: Plus, description: 'When a new record is created' },
    { id: 'onUpdate', name: 'On Update', icon: Edit, description: 'When a record is updated' },
    { id: 'onDelete', name: 'On Delete', icon: Trash2, description: 'When a record is deleted' },
    { id: 'onStatusChange', name: 'On Status Change', icon: GitBranch, description: 'When status field changes' },
    { id: 'scheduled', name: 'Scheduled', icon: Play, description: 'Run on a schedule' }
  ];

  const actionTypes = [
    { id: 'email', name: 'Send Email', icon: Mail, color: 'blue' },
    { id: 'notification', name: 'Send Notification', icon: Bell, color: 'purple' },
    { id: 'update_field', name: 'Update Field', icon: Edit, color: 'green' },
    { id: 'create_record', name: 'Create Record', icon: Plus, color: 'orange' },
    { id: 'approval', name: 'Request Approval', icon: CheckCircle, color: 'yellow' },
    { id: 'webhook', name: 'Call Webhook', icon: ArrowRight, color: 'indigo' }
  ];

  const getPriorityColor = (priority: string) => {
    const colors = {
      low: 'bg-blue-100 text-blue-700 border-blue-300',
      medium: 'bg-yellow-100 text-yellow-700 border-yellow-300',
      high: 'bg-red-100 text-red-700 border-red-300'
    };
    return colors[priority as keyof typeof colors] || colors.low;
  };

  const getActionIcon = (type: string) => {
    const action = actionTypes.find(a => a.id === type);
    return action?.icon || ArrowRight;
  };

  const getActionColor = (type: string) => {
    const action = actionTypes.find(a => a.id === type);
    const colorMap: { [key: string]: string } = {
      blue: 'text-blue-600',
      purple: 'text-purple-600',
      green: 'text-green-600',
      orange: 'text-orange-600',
      yellow: 'text-yellow-600',
      indigo: 'text-indigo-600'
    };
    return colorMap[action?.color || 'blue'];
  };

  const filteredWorkflows = selectedModule === 'all'
    ? workflows
    : workflows.filter(w => w.module === selectedModule);

  const handleToggleActive = (workflowId: string) => {
    setWorkflows(prev =>
      prev.map(w =>
        w.id === workflowId ? { ...w, active: !w.active } : w
      )
    );
  };

  const handleDelete = (workflowId: string) => {
    setWorkflows(prev => prev.filter(w => w.id !== workflowId));
  };

  const stats = {
    totalWorkflows: workflows.length,
    activeWorkflows: workflows.filter(w => w.active).length,
    totalExecutions: workflows.reduce((acc, w) => acc + w.executionCount, 0),
    highPriority: workflows.filter(w => w.priority === 'high').length
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6 flex items-center gap-4">
        <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">Workflow Automation</h1>
          <p className="text-sm text-gray-500 mt-1">Automate business processes with custom workflows</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Create Workflow
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-50 rounded-lg">
              <GitBranch className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Workflows</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalWorkflows}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-50 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Active</p>
              <p className="text-2xl font-bold text-green-600">{stats.activeWorkflows}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-50 rounded-lg">
              <Play className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Executions</p>
              <p className="text-2xl font-bold text-purple-600">{stats.totalExecutions.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-50 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">High Priority</p>
              <p className="text-2xl font-bold text-red-600">{stats.highPriority}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Module Filter & Info */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Filter by Module</h2>

            <div className="space-y-2">
              {modules.map((module) => {
                const count = module === 'all'
                  ? workflows.length
                  : workflows.filter(w => w.module === module).length;

                return (
                  <button
                    key={module}
                    onClick={() => setSelectedModule(module)}
                    className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                      selectedModule === module
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-gray-900 text-sm">
                        {module === 'all' ? 'All Modules' : module}
                      </p>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        selectedModule === module
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {count}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-6">
            <h3 className="text-sm font-bold text-purple-900 mb-3">Available Actions</h3>
            <div className="space-y-2">
              {actionTypes.map((action) => {
                const IconComponent = action.icon;
                return (
                  <div key={action.id} className="flex items-center gap-2 text-xs">
                    <IconComponent className={`w-4 h-4 ${getActionColor(action.id)}`} />
                    <span className="text-purple-900">{action.name}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Workflows List */}
        <div className="lg:col-span-3 bg-white rounded-xl border border-gray-200 p-6">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-gray-900">
              {selectedModule === 'all' ? 'All Workflows' : `${selectedModule} Workflows`}
            </h2>
            <p className="text-sm text-gray-600">
              {filteredWorkflows.length} workflow{filteredWorkflows.length !== 1 ? 's' : ''} found
            </p>
          </div>

          <div className="space-y-4">
            {filteredWorkflows.map((workflow) => (
              <div key={workflow.id} className={`border-2 rounded-lg p-5 ${workflow.active ? 'border-gray-200' : 'border-gray-200 bg-gray-50 opacity-70'}`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <GitBranch className={workflow.active ? 'w-5 h-5 text-blue-600' : 'w-5 h-5 text-gray-400'} />
                      <div>
                        <h3 className="font-bold text-gray-900">{workflow.name}</h3>
                        <p className="text-sm text-gray-600">{workflow.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs px-2 py-1 bg-purple-50 text-purple-700 rounded border border-purple-200">
                        {workflow.module}
                      </span>
                      <span className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded border border-blue-200">
                        {workflow.trigger.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded border ${getPriorityColor(workflow.priority)}`}>
                        {workflow.priority.charAt(0).toUpperCase() + workflow.priority.slice(1)} Priority
                      </span>
                      {!workflow.active && (
                        <span className="text-xs px-2 py-1 bg-gray-200 text-gray-700 rounded">
                          Inactive
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                      <div>
                        <p className="text-xs font-semibold text-gray-600 mb-2">Conditions:</p>
                        {workflow.conditions.length > 0 ? (
                          <div className="space-y-1">
                            {workflow.conditions.slice(0, 2).map((condition, i) => (
                              <p key={i} className="text-xs text-gray-700 bg-gray-50 p-2 rounded font-mono">
                                {condition}
                              </p>
                            ))}
                            {workflow.conditions.length > 2 && (
                              <p className="text-xs text-gray-600">+{workflow.conditions.length - 2} more</p>
                            )}
                          </div>
                        ) : (
                          <p className="text-xs text-gray-500">No conditions</p>
                        )}
                      </div>

                      <div>
                        <p className="text-xs font-semibold text-gray-600 mb-2">Actions ({workflow.actions.length}):</p>
                        <div className="flex flex-wrap gap-2">
                          {workflow.actions.map((action, i) => {
                            const IconComponent = getActionIcon(action.type);
                            return (
                              <div key={i} className="flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 rounded text-xs border border-green-200">
                                <IconComponent className="w-3 h-3" />
                                <span>{action.type.replace('_', ' ')}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-gray-600 pt-3 border-t border-gray-200">
                      <div>
                        <span className="font-semibold">Executions:</span> {workflow.executionCount.toLocaleString()}
                      </div>
                      {workflow.lastExecuted && (
                        <div>
                          <span className="font-semibold">Last Run:</span> {workflow.lastExecuted}
                        </div>
                      )}
                      <div>
                        <span className="font-semibold">Created:</span> {workflow.createdAt}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleToggleActive(workflow.id)}
                      className={`p-2 rounded-lg ${workflow.active ? 'hover:bg-yellow-50 text-yellow-600' : 'hover:bg-green-50 text-green-600'}`}
                      title={workflow.active ? 'Pause workflow' : 'Activate workflow'}
                    >
                      {workflow.active ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                    </button>
                    <button
                      className="p-2 hover:bg-blue-50 rounded-lg text-blue-600"
                      title="Edit workflow"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(workflow.id)}
                      className="p-2 hover:bg-red-50 rounded-lg text-red-600"
                      title="Delete workflow"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredWorkflows.length === 0 && (
            <div className="text-center py-12">
              <GitBranch className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-600 font-medium">No workflows found</p>
              <p className="text-sm text-gray-500">Create a new workflow to automate your processes</p>
            </div>
          )}

          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-blue-900 mb-2">Workflow Best Practices:</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Test workflows thoroughly before activating in production</li>
              <li>• Use conditions to prevent unnecessary workflow executions</li>
              <li>• Monitor execution counts to identify issues</li>
              <li>• High-priority workflows execute first when multiple are triggered</li>
              <li>• Inactive workflows are preserved but won't execute</li>
              <li>• Consider performance impact of scheduled workflows</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

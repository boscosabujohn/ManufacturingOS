'use client';

import React, { useState } from 'react';
import {
  Play,
  Pause,
  Plus,
  Trash2,
  Edit,
  GitBranch,
  Clock,
  Filter,
  Send,
  Bell,
  UserPlus,
  Tag,
  CheckCircle,
  AlertCircle,
  Zap,
  Settings,
  Save,
  Eye,
} from 'lucide-react';

export type TriggerType = 'record_created' | 'record_updated' | 'field_changed' | 'time_based' | 'manual';
export type ActionType = 'send_email' | 'create_task' | 'assign_user' | 'update_field' | 'notify' | 'webhook' | 'add_tag';
export type ConditionOperator = 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than' | 'is_empty' | 'is_not_empty';

export interface WorkflowCondition {
  id: string;
  field: string;
  operator: ConditionOperator;
  value: string;
  logicOperator?: 'AND' | 'OR';
}

export interface WorkflowAction {
  id: string;
  type: ActionType;
  config: Record<string, any>;
  delay?: number; // minutes
}

export interface WorkflowTrigger {
  type: TriggerType;
  config?: Record<string, any>;
}

export interface Workflow {
  id: string;
  name: string;
  description?: string;
  trigger: WorkflowTrigger;
  conditions: WorkflowCondition[];
  actions: WorkflowAction[];
  status: 'active' | 'inactive' | 'draft';
  createdAt: string;
  lastRun?: string;
  runCount?: number;
}

export interface WorkflowBuilderProps {
  workflow?: Workflow;
  onSave?: (workflow: Workflow) => void;
  onTest?: (workflow: Workflow) => void;
  onCancel?: () => void;
  availableFields?: { name: string; label: string; type: string }[];
  availableUsers?: { id: string; name: string }[];
  className?: string;
}

export const WorkflowBuilder: React.FC<WorkflowBuilderProps> = ({
  workflow: initialWorkflow,
  onSave,
  onTest,
  onCancel,
  availableFields = [],
  availableUsers = [],
  className = '',
}) => {
  const [workflow, setWorkflow] = useState<Workflow>(
    initialWorkflow || {
      id: '',
      name: 'New Workflow',
      trigger: { type: 'record_created' },
      conditions: [],
      actions: [],
      status: 'draft',
      createdAt: new Date().toISOString(),
    }
  );

  const [showTriggerConfig, setShowTriggerConfig] = useState(false);
  const [showActionConfig, setShowActionConfig] = useState<string | null>(null);

  const triggerTypes = [
    { value: 'record_created', label: 'Record Created', icon: Plus },
    { value: 'record_updated', label: 'Record Updated', icon: Edit },
    { value: 'field_changed', label: 'Field Changed', icon: AlertCircle },
    { value: 'time_based', label: 'Time-Based', icon: Clock },
    { value: 'manual', label: 'Manual', icon: Play },
  ];

  const actionTypes = [
    { value: 'send_email', label: 'Send Email', icon: Send },
    { value: 'create_task', label: 'Create Task', icon: CheckCircle },
    { value: 'assign_user', label: 'Assign to User', icon: UserPlus },
    { value: 'update_field', label: 'Update Field', icon: Edit },
    { value: 'notify', label: 'Send Notification', icon: Bell },
    { value: 'add_tag', label: 'Add Tag', icon: Tag },
    { value: 'webhook', label: 'Call Webhook', icon: Zap },
  ];

  const conditionOperators = [
    { value: 'equals', label: 'Equals' },
    { value: 'not_equals', label: 'Not Equals' },
    { value: 'contains', label: 'Contains' },
    { value: 'greater_than', label: 'Greater Than' },
    { value: 'less_than', label: 'Less Than' },
    { value: 'is_empty', label: 'Is Empty' },
    { value: 'is_not_empty', label: 'Is Not Empty' },
  ];

  const handleAddCondition = () => {
    setWorkflow({
      ...workflow,
      conditions: [
        ...workflow.conditions,
        {
          id: `cond-${Date.now()}`,
          field: availableFields[0]?.name || '',
          operator: 'equals',
          value: '',
        },
      ],
    });
  };

  const handleUpdateCondition = (id: string, updates: Partial<WorkflowCondition>) => {
    setWorkflow({
      ...workflow,
      conditions: workflow.conditions.map((c) => (c.id === id ? { ...c, ...updates } : c)),
    });
  };

  const handleRemoveCondition = (id: string) => {
    setWorkflow({
      ...workflow,
      conditions: workflow.conditions.filter((c) => c.id !== id),
    });
  };

  const handleAddAction = (type: ActionType) => {
    setWorkflow({
      ...workflow,
      actions: [
        ...workflow.actions,
        {
          id: `action-${Date.now()}`,
          type,
          config: {},
        },
      ],
    });
  };

  const handleUpdateAction = (id: string, updates: Partial<WorkflowAction>) => {
    setWorkflow({
      ...workflow,
      actions: workflow.actions.map((a) => (a.id === id ? { ...a, ...updates } : a)),
    });
  };

  const handleRemoveAction = (id: string) => {
    setWorkflow({
      ...workflow,
      actions: workflow.actions.filter((a) => a.id !== id),
    });
  };

  const getTriggerIcon = (type: TriggerType) => {
    const trigger = triggerTypes.find((t) => t.value === type);
    return trigger ? trigger.icon : Play;
  };

  const getActionIcon = (type: ActionType) => {
    const action = actionTypes.find((a) => a.value === type);
    return action ? action.icon : Zap;
  };

  return (
    <div className={`bg-white rounded-lg border border-gray-200 ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <input
              type="text"
              value={workflow.name}
              onChange={(e) => setWorkflow({ ...workflow, name: e.target.value })}
              className="text-2xl font-bold text-gray-900 bg-transparent border-0 focus:outline-none focus:ring-0 px-0"
              placeholder="Workflow Name"
            />
            <textarea
              value={workflow.description || ''}
              onChange={(e) => setWorkflow({ ...workflow, description: e.target.value })}
              className="mt-2 w-full text-sm text-gray-600 bg-transparent border-0 focus:outline-none focus:ring-0 px-0 resize-none"
              placeholder="Add a description..."
              rows={2}
            />
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onTest && onTest(workflow)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
            >
              <Play className="h-4 w-4" />
              <span>Test</span>
            </button>
            <button
              onClick={() => onSave && onSave(workflow)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>Save</span>
            </button>
          </div>
        </div>

        {/* Status Badge */}
        <div className="mt-4 flex items-center space-x-2">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              workflow.status === 'active'
                ? 'bg-green-100 text-green-700'
                : workflow.status === 'inactive'
                ? 'bg-gray-100 text-gray-700'
                : 'bg-yellow-100 text-yellow-700'
            }`}
          >
            {workflow.status.toUpperCase()}
          </span>
          {workflow.runCount !== undefined && (
            <span className="text-xs text-gray-600">Executed {workflow.runCount} times</span>
          )}
        </div>
      </div>

      {/* Workflow Builder */}
      <div className="p-6">
        <div className="space-y-8">
          {/* Trigger Section */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-sm font-bold text-blue-700">1</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900">When this happens</h3>
            </div>

            <div className="ml-12 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border-2 border-blue-200 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {React.createElement(getTriggerIcon(workflow.trigger.type), {
                    className: 'h-5 w-5 text-blue-600',
                  })}
                  <div>
                    <p className="font-semibold text-gray-900">
                      {triggerTypes.find((t) => t.value === workflow.trigger.type)?.label}
                    </p>
                    <p className="text-sm text-gray-600">Trigger this workflow</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowTriggerConfig(!showTriggerConfig)}
                  className="p-2 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                >
                  <Settings className="h-4 w-4" />
                </button>
              </div>

              {showTriggerConfig && (
                <div className="mt-4 pt-4 border-t border-blue-200">
                  <div className="grid grid-cols-2 gap-4">
                    {triggerTypes.map((trigger) => (
                      <button
                        key={trigger.value}
                        onClick={() =>
                          setWorkflow({
                            ...workflow,
                            trigger: { type: trigger.value as TriggerType },
                          })
                        }
                        className={`p-3 rounded-lg border-2 text-left transition-all ${
                          workflow.trigger.type === trigger.value
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300 bg-white'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          {React.createElement(trigger.icon, { className: 'h-4 w-4' })}
                          <span className="font-medium">{trigger.label}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Conditions Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                  <span className="text-sm font-bold text-purple-700">2</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900">Only if these conditions match</h3>
                <span className="text-xs text-gray-500">(Optional)</span>
              </div>
              <button
                onClick={handleAddCondition}
                className="px-3 py-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-1 text-sm"
              >
                <Plus className="h-4 w-4" />
                <span>Add Condition</span>
              </button>
            </div>

            {workflow.conditions.length > 0 ? (
              <div className="ml-12 space-y-3">
                {workflow.conditions.map((condition, index) => (
                  <div key={condition.id}>
                    {index > 0 && (
                      <div className="flex items-center space-x-2 my-2">
                        <button
                          onClick={() =>
                            handleUpdateCondition(condition.id, {
                              logicOperator: condition.logicOperator === 'AND' ? 'OR' : 'AND',
                            })
                          }
                          className={`px-3 py-1 rounded-full text-xs font-bold ${
                            condition.logicOperator === 'OR'
                              ? 'bg-orange-100 text-orange-700'
                              : 'bg-purple-100 text-purple-700'
                          }`}
                        >
                          {condition.logicOperator || 'AND'}
                        </button>
                      </div>
                    )}

                    <div className="bg-purple-50 rounded-lg border border-purple-200 p-4">
                      <div className="flex items-center space-x-3">
                        <Filter className="h-5 w-5 text-purple-600 flex-shrink-0" />
                        <select
                          value={condition.field}
                          onChange={(e) =>
                            handleUpdateCondition(condition.id, { field: e.target.value })
                          }
                          className="flex-1 px-3 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                        >
                          {availableFields.map((field) => (
                            <option key={field.name} value={field.name}>
                              {field.label}
                            </option>
                          ))}
                        </select>
                        <select
                          value={condition.operator}
                          onChange={(e) =>
                            handleUpdateCondition(condition.id, {
                              operator: e.target.value as ConditionOperator,
                            })
                          }
                          className="px-3 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                        >
                          {conditionOperators.map((op) => (
                            <option key={op.value} value={op.value}>
                              {op.label}
                            </option>
                          ))}
                        </select>
                        {!['is_empty', 'is_not_empty'].includes(condition.operator) && (
                          <input
                            type="text"
                            value={condition.value}
                            onChange={(e) =>
                              handleUpdateCondition(condition.id, { value: e.target.value })
                            }
                            placeholder="Value"
                            className="flex-1 px-3 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                          />
                        )}
                        <button
                          onClick={() => handleRemoveCondition(condition.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="ml-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 p-6 text-center">
                <Filter className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">No conditions added</p>
                <p className="text-xs text-gray-500 mt-1">Workflow will run for all matching triggers</p>
              </div>
            )}
          </div>

          {/* Actions Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                  <span className="text-sm font-bold text-green-700">3</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900">Do these actions</h3>
              </div>
            </div>

            {workflow.actions.length > 0 ? (
              <div className="ml-12 space-y-3">
                {workflow.actions.map((action, index) => {
                  const actionType = actionTypes.find((a) => a.value === action.type);
                  const ActionIcon = actionType?.icon || Zap;

                  return (
                    <div key={action.id}>
                      {index > 0 && action.delay && (
                        <div className="flex items-center space-x-2 my-2 ml-6">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <span className="text-xs text-gray-600">Wait {action.delay} minutes</span>
                        </div>
                      )}

                      <div className="bg-green-50 rounded-lg border border-green-200 p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <ActionIcon className="h-5 w-5 text-green-600" />
                            <div>
                              <p className="font-semibold text-gray-900">{actionType?.label}</p>
                              <p className="text-xs text-gray-600">Action {index + 1}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() =>
                                setShowActionConfig(
                                  showActionConfig === action.id ? null : action.id
                                )
                              }
                              className="p-2 text-green-600 hover:bg-green-100 rounded transition-colors"
                            >
                              <Settings className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleRemoveAction(action.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>

                        {showActionConfig === action.id && (
                          <div className="pt-3 border-t border-green-200 space-y-3">
                            {/* Action-specific configuration */}
                            {action.type === 'send_email' && (
                              <>
                                <input
                                  type="text"
                                  placeholder="To: email@example.com"
                                  className="w-full px-3 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                                />
                                <input
                                  type="text"
                                  placeholder="Subject"
                                  className="w-full px-3 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                                />
                                <textarea
                                  placeholder="Email body..."
                                  className="w-full px-3 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm resize-none"
                                  rows={3}
                                />
                              </>
                            )}
                            {action.type === 'assign_user' && (
                              <select className="w-full px-3 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm">
                                <option value="">Select user...</option>
                                {availableUsers.map((user) => (
                                  <option key={user.id} value={user.id}>
                                    {user.name}
                                  </option>
                                ))}
                              </select>
                            )}
                            <div className="flex items-center space-x-2">
                              <label className="text-xs text-gray-600">Delay (minutes):</label>
                              <input
                                type="number"
                                min="0"
                                value={action.delay || 0}
                                onChange={(e) =>
                                  handleUpdateAction(action.id, {
                                    delay: parseInt(e.target.value) || 0,
                                  })
                                }
                                className="w-20 px-2 py-1 border border-green-200 rounded text-sm"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="ml-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 p-6 text-center">
                <Zap className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-3">No actions added</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {actionTypes.map((actionType) => (
                    <button
                      key={actionType.value}
                      onClick={() => handleAddAction(actionType.value as ActionType)}
                      className="px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-1 text-sm"
                    >
                      {React.createElement(actionType.icon, { className: 'h-4 w-4' })}
                      <span>{actionType.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {workflow.actions.length > 0 && (
              <div className="ml-12 mt-3">
                <button
                  onClick={() => setShowActionConfig(null)}
                  className="px-3 py-1.5 border border-green-300 text-green-700 rounded-lg hover:bg-green-50 transition-colors flex items-center space-x-1 text-sm"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Another Action</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

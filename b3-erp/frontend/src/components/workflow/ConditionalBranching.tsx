'use client'

import { useState } from 'react'
import { GitBranch, Plus, Trash2, Settings, Play, Check, X } from 'lucide-react'

export type ConditionOperator = 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains' | 'not_contains' | 'starts_with' | 'ends_with' | 'is_empty' | 'is_not_empty';
export type LogicOperator = 'AND' | 'OR';
export type FieldType = 'string' | 'number' | 'boolean' | 'date' | 'array' | 'object';

export interface Condition {
  id: string;
  field: string;
  fieldType: FieldType;
  operator: ConditionOperator;
  value: any;
  description?: string;
}

export interface ConditionGroup {
  id: string;
  conditions: Condition[];
  logicOperator: LogicOperator;
  description?: string;
}

export interface Branch {
  id: string;
  name: string;
  conditionGroups: ConditionGroup[];
  groupLogicOperator: LogicOperator;
  thenActions: string[];
  elseActions?: string[];
  priority: number;
}

export interface ConditionalRule {
  id: string;
  name: string;
  description: string;
  branches: Branch[];
  defaultAction?: string;
  status: 'active' | 'inactive' | 'testing';
  lastModified: string;
}

export default function ConditionalBranching() {
  const [rules] = useState<ConditionalRule[]>([
    {
      id: 'RULE-001',
      name: 'Purchase Order Approval Logic',
      description: 'Multi-level approval based on amount and department',
      status: 'active',
      lastModified: '2025-01-20',
      branches: [
        {
          id: 'BR-1',
          name: 'High Value - Finance Approval',
          priority: 1,
          groupLogicOperator: 'AND',
          conditionGroups: [
            {
              id: 'CG-1',
              logicOperator: 'AND',
              conditions: [
                { id: 'C1', field: 'amount', fieldType: 'number', operator: 'greater_than', value: 100000, description: 'Amount exceeds ₹1L' },
                { id: 'C2', field: 'department', fieldType: 'string', operator: 'equals', value: 'Finance', description: 'Finance department' }
              ]
            }
          ],
          thenActions: ['send_to_cfo_approval', 'notify_finance_team', 'log_high_value_po'],
          elseActions: ['proceed_to_next_branch']
        },
        {
          id: 'BR-2',
          name: 'Medium Value - Manager Approval',
          priority: 2,
          groupLogicOperator: 'AND',
          conditionGroups: [
            {
              id: 'CG-2',
              logicOperator: 'AND',
              conditions: [
                { id: 'C3', field: 'amount', fieldType: 'number', operator: 'greater_than', value: 50000 },
                { id: 'C4', field: 'amount', fieldType: 'number', operator: 'less_than', value: 100000 }
              ]
            }
          ],
          thenActions: ['send_to_manager_approval', 'notify_requester'],
          elseActions: ['auto_approve']
        }
      ],
      defaultAction: 'auto_approve_low_value'
    },
    {
      id: 'RULE-002',
      name: 'Inventory Reorder Logic',
      description: 'Automatic reorder based on stock levels and demand forecast',
      status: 'active',
      lastModified: '2025-01-18',
      branches: [
        {
          id: 'BR-3',
          name: 'Critical Stock - Express Order',
          priority: 1,
          groupLogicOperator: 'OR',
          conditionGroups: [
            {
              id: 'CG-3',
              logicOperator: 'AND',
              conditions: [
                { id: 'C5', field: 'stockLevel', fieldType: 'number', operator: 'less_than', value: 50 },
                { id: 'C6', field: 'demandForecast', fieldType: 'string', operator: 'equals', value: 'high' }
              ]
            },
            {
              id: 'CG-4',
              logicOperator: 'AND',
              conditions: [
                { id: 'C7', field: 'stockLevel', fieldType: 'number', operator: 'less_than', value: 20 },
                { id: 'C8', field: 'itemCategory', fieldType: 'string', operator: 'equals', value: 'critical' }
              ]
            }
          ],
          thenActions: ['create_urgent_po', 'notify_procurement_team', 'flag_express_shipping'],
          elseActions: ['proceed_to_standard_reorder']
        }
      ],
      defaultAction: 'monitor_stock_level'
    },
    {
      id: 'RULE-003',
      name: 'Quality Control Routing',
      description: 'Route items for inspection based on supplier and value',
      status: 'active',
      lastModified: '2025-01-15',
      branches: [
        {
          id: 'BR-4',
          name: 'New Supplier - Full Inspection',
          priority: 1,
          groupLogicOperator: 'OR',
          conditionGroups: [
            {
              id: 'CG-5',
              logicOperator: 'OR',
              conditions: [
                { id: 'C9', field: 'supplierTenure', fieldType: 'number', operator: 'less_than', value: 6, description: 'Less than 6 months' },
                { id: 'C10', field: 'supplierRating', fieldType: 'number', operator: 'less_than', value: 4.0 },
                { id: 'C11', field: 'orderValue', fieldType: 'number', operator: 'greater_than', value: 500000 }
              ]
            }
          ],
          thenActions: ['route_to_full_qc', 'assign_senior_inspector', 'schedule_detailed_report'],
          elseActions: ['route_to_sampling_qc']
        }
      ],
      defaultAction: 'skip_qc_trusted_supplier'
    }
  ]);

  const [selectedRule, setSelectedRule] = useState<string | null>(null);
  const [testMode, setTestMode] = useState(false);

  const getOperatorLabel = (op: ConditionOperator): string => {
    const labels: Record<ConditionOperator, string> = {
      equals: '=',
      not_equals: '≠',
      greater_than: '>',
      less_than: '<',
      contains: '∋',
      not_contains: '∌',
      starts_with: '⊢',
      ends_with: '⊣',
      is_empty: '∅',
      is_not_empty: '¬∅'
    };
    return labels[op];
  };

  const getStatusColor = (status: string) => {
    return status === 'active' ? 'bg-green-100 text-green-700' : status === 'testing' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700';
  };

  const renderCondition = (condition: Condition) => (
    <div key={condition.id} className="flex items-center gap-2 p-2 bg-blue-50 border border-blue-200 rounded text-sm">
      <span className="font-medium text-blue-900">{condition.field}</span>
      <span className="text-blue-600 font-bold">{getOperatorLabel(condition.operator)}</span>
      <span className="text-blue-800">{JSON.stringify(condition.value)}</span>
      {condition.description && (
        <span className="text-xs text-blue-600 ml-2">({condition.description})</span>
      )}
    </div>
  );

  const renderConditionGroup = (group: ConditionGroup) => (
    <div key={group.id} className="p-3 bg-purple-50 border border-purple-200 rounded">
      <div className="space-y-2">
        {group.conditions.map((condition, idx) => (
          <div key={condition.id}>
            {renderCondition(condition)}
            {idx < group.conditions.length - 1 && (
              <div className="flex items-center justify-center my-1">
                <span className="px-2 py-1 bg-purple-600 text-white text-xs font-bold rounded">
                  {group.logicOperator}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderBranch = (branch: Branch) => (
    <div key={branch.id} className="p-4 bg-white border-2 border-gray-300 rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <GitBranch className="h-5 w-5 text-purple-600" />
          <h4 className="font-semibold text-gray-900">{branch.name}</h4>
          <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded">
            Priority {branch.priority}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        <div className="space-y-2">
          {branch.conditionGroups.map((group, idx) => (
            <div key={group.id}>
              {renderConditionGroup(group)}
              {idx < branch.conditionGroups.length - 1 && (
                <div className="flex items-center justify-center my-2">
                  <span className="px-3 py-1 bg-orange-600 text-white text-sm font-bold rounded">
                    {branch.groupLogicOperator}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="pt-3 border-t border-gray-200">
          <div className="flex items-start gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Check className="h-4 w-4 text-green-600" />
                <span className="text-xs font-medium text-green-700 uppercase">Then Actions</span>
              </div>
              <div className="space-y-1">
                {branch.thenActions.map((action, idx) => (
                  <div key={idx} className="text-sm text-gray-700 bg-green-50 px-2 py-1 rounded">
                    • {action.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </div>
                ))}
              </div>
            </div>

            {branch.elseActions && branch.elseActions.length > 0 && (
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <X className="h-4 w-4 text-red-600" />
                  <span className="text-xs font-medium text-red-700 uppercase">Else Actions</span>
                </div>
                <div className="space-y-1">
                  {branch.elseActions.map((action, idx) => (
                    <div key={idx} className="text-sm text-gray-700 bg-red-50 px-2 py-1 rounded">
                      • {action.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="bg-white shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <GitBranch className="h-8 w-8 text-purple-600" />
              Conditional Branching & Logic Builder
            </h2>
            <p className="text-gray-600 mt-1">IF/THEN/ELSE logic with AND/OR operators</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 bg-purple-600 text-white rounded-lg flex items-center gap-2 hover:bg-purple-700">
              <Plus className="h-5 w-5" />
              New Rule
            </button>
            <button
              onClick={() => setTestMode(!testMode)}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                testMode ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              <Play className="h-5 w-5" />
              {testMode ? 'Testing Mode ON' : 'Test Mode'}
            </button>
          </div>
        </div>
      </div>

      {rules.map((rule) => (
        <div key={rule.id} className="bg-white shadow-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-indigo-50">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{rule.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{rule.description}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">Modified: {rule.lastModified}</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(rule.status)}`}>
                  {rule.status.toUpperCase()}
                </span>
                <button className="px-3 py-1 text-gray-700 hover:bg-gray-100 rounded flex items-center gap-1">
                  <Settings className="h-4 w-4" />
                  Edit
                </button>
              </div>
            </div>
          </div>

          <div className="p-8 bg-gray-50">
            <div className="space-y-6">
              {rule.branches.map((branch) => renderBranch(branch))}

              {rule.defaultAction && (
                <div className="p-4 bg-gray-100 border-2 border-dashed border-gray-400 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium text-gray-700 uppercase">Default Action</span>
                  </div>
                  <div className="text-sm text-gray-900">
                    • {rule.defaultAction.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="p-4 bg-white border-t border-gray-200 flex justify-between items-center">
            <div className="text-sm text-gray-600">
              {rule.branches.length} branches • {rule.branches.reduce((sum, b) => sum + b.conditionGroups.reduce((s, g) => s + g.conditions.length, 0), 0)} conditions
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1 text-green-700 hover:bg-green-100 rounded flex items-center gap-1">
                <Play className="h-4 w-4" />
                Test Rule
              </button>
              <button className="px-3 py-1 text-red-700 hover:bg-red-100 rounded flex items-center gap-1">
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

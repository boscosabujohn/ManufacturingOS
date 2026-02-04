'use client';

import React, { useState } from 'react';
import {
  Plus,
  Edit,
  Trash2,
  Play,
  Pause,
  Copy,
  Save,
  AlertCircle,
  CheckCircle,
  Code,
  Zap,
  Filter,
  DollarSign,
  Percent,
  Calendar,
  Users,
  Package,
} from 'lucide-react';

export type RuleType = 'discount' | 'markup' | 'price_override' | 'bundle' | 'volume' | 'time_based';
export type RuleOperator = 'equals' | 'greater_than' | 'less_than' | 'between' | 'in' | 'contains';
export type RuleAction = 'set_price' | 'add_discount' | 'multiply' | 'add_amount' | 'set_min' | 'set_max';

export interface RuleCondition {
  id: string;
  field: string;
  operator: RuleOperator;
  value: any;
  logicOperator?: 'AND' | 'OR';
}

export interface RuleActionConfig {
  type: RuleAction;
  value: number;
  applyTo?: string; // which field to apply to
}

export interface PricingRule {
  id: string;
  name: string;
  description?: string;
  type: RuleType;
  priority: number;
  status: 'active' | 'inactive' | 'draft';
  conditions: RuleCondition[];
  actions: RuleActionConfig[];
  validFrom?: string;
  validTo?: string;
  createdBy: string;
  createdAt: string;
  lastModified: string;
  executionCount?: number;
}

export interface PricingRulesEngineProps {
  rules: PricingRule[];
  onCreateRule?: () => void;
  onEditRule?: (ruleId: string) => void;
  onDeleteRule?: (ruleId: string) => void;
  onDuplicateRule?: (ruleId: string) => void;
  onToggleStatus?: (ruleId: string) => void;
  onTestRule?: (ruleId: string) => void;
  className?: string;
}

export const PricingRulesEngine: React.FC<PricingRulesEngineProps> = ({
  rules,
  onCreateRule,
  onEditRule,
  onDeleteRule,
  onDuplicateRule,
  onToggleStatus,
  onTestRule,
  className = '',
}) => {
  const [filter, setFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const getRuleTypeConfig = (type: RuleType) => {
    switch (type) {
      case 'discount':
        return { icon: Percent, color: 'text-green-600', bg: 'bg-green-50', label: 'Discount Rule' };
      case 'markup':
        return { icon: DollarSign, color: 'text-blue-600', bg: 'bg-blue-50', label: 'Markup Rule' };
      case 'price_override':
        return { icon: Code, color: 'text-purple-600', bg: 'bg-purple-50', label: 'Price Override' };
      case 'bundle':
        return { icon: Package, color: 'text-orange-600', bg: 'bg-orange-50', label: 'Bundle Pricing' };
      case 'volume':
        return { icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50', label: 'Volume Discount' };
      case 'time_based':
        return { icon: Calendar, color: 'text-pink-600', bg: 'bg-pink-50', label: 'Time-Based' };
      default:
        return { icon: Zap, color: 'text-gray-600', bg: 'bg-gray-50', label: 'Custom Rule' };
    }
  };

  const filteredRules = rules.filter((rule) => {
    const matchesSearch =
      rule.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rule.description?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      filter === 'all' ||
      (filter === 'active' && rule.status === 'active') ||
      (filter === 'inactive' && rule.status === 'inactive') ||
      (filter === 'draft' && rule.status === 'draft');

    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: rules.length,
    active: rules.filter((r) => r.status === 'active').length,
    inactive: rules.filter((r) => r.status === 'inactive').length,
    draft: rules.filter((r) => r.status === 'draft').length,
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Stats Bar */}
      <div className="grid grid-cols-4 gap-2">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-3 text-white">
          <p className="text-sm opacity-90">Total Rules</p>
          <p className="text-3xl font-bold">{stats.total}</p>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-3 text-white">
          <p className="text-sm opacity-90">Active</p>
          <p className="text-3xl font-bold">{stats.active}</p>
        </div>
        <div className="bg-gradient-to-br from-gray-500 to-gray-600 rounded-lg p-3 text-white">
          <p className="text-sm opacity-90">Inactive</p>
          <p className="text-3xl font-bold">{stats.inactive}</p>
        </div>
        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg p-3 text-white">
          <p className="text-sm opacity-90">Draft</p>
          <p className="text-3xl font-bold">{stats.draft}</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-lg border border-gray-200 p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 flex-1">
            {/* Search */}
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search rules..."
              className="flex-1 max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {/* Filter */}
            <div className="flex items-center space-x-2">
              {['all', 'active', 'inactive', 'draft'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filter === f
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Create Button */}
          {onCreateRule && (
            <button
              onClick={onCreateRule}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>New Rule</span>
            </button>
          )}
        </div>
      </div>

      {/* Rules List */}
      <div className="space-y-3">
        {filteredRules.length > 0 ? (
          filteredRules
            .sort((a, b) => b.priority - a.priority)
            .map((rule) => {
              const typeConfig = getRuleTypeConfig(rule.type);
              const Icon = typeConfig.icon;

              return (
                <div
                  key={rule.id}
                  className="bg-white rounded-lg border-2 border-gray-200 hover:border-blue-400 hover:shadow-lg transition-all p-3"
                >
                  <div className="flex items-start justify-between">
                    {/* Rule Info */}
                    <div className="flex items-start space-x-4 flex-1">
                      {/* Icon & Priority */}
                      <div className="flex flex-col items-center space-y-2">
                        <div className={`p-3 rounded-lg ${typeConfig.bg}`}>
                          <Icon className={`h-6 w-6 ${typeConfig.color}`} />
                        </div>
                        <div className="text-xs text-gray-500">
                          <div className="font-semibold">Priority</div>
                          <div className="text-center">{rule.priority}</div>
                        </div>
                      </div>

                      {/* Details */}
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-bold text-gray-900">{rule.name}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${typeConfig.bg} ${typeConfig.color}`}>
                            {typeConfig.label}
                          </span>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              rule.status === 'active'
                                ? 'bg-green-100 text-green-700'
                                : rule.status === 'inactive'
                                ? 'bg-gray-100 text-gray-700'
                                : 'bg-yellow-100 text-yellow-700'
                            }`}
                          >
                            {rule.status.toUpperCase()}
                          </span>
                        </div>

                        {rule.description && (
                          <p className="text-sm text-gray-600 mb-3">{rule.description}</p>
                        )}

                        {/* Conditions */}
                        <div className="mb-3">
                          <p className="text-xs font-semibold text-gray-700 mb-2">Conditions:</p>
                          <div className="flex flex-wrap gap-2">
                            {rule.conditions.map((condition, idx) => (
                              <div key={condition.id} className="flex items-center space-x-2">
                                {idx > 0 && (
                                  <span className="text-xs font-bold text-purple-600">
                                    {condition.logicOperator || 'AND'}
                                  </span>
                                )}
                                <div className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">
                                  {condition.field} {condition.operator} {String(condition.value)}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="mb-3">
                          <p className="text-xs font-semibold text-gray-700 mb-2">Actions:</p>
                          <div className="flex flex-wrap gap-2">
                            {rule.actions.map((action, idx) => (
                              <div key={idx} className="px-2 py-1 bg-green-50 text-green-700 rounded text-xs">
                                {action.type}: {action.value}
                                {action.applyTo && ` → ${action.applyTo}`}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Validity & Stats */}
                        <div className="flex items-center space-x-4 text-xs text-gray-600">
                          {rule.validFrom && (
                            <span>Valid: {new Date(rule.validFrom).toLocaleDateString()} - {rule.validTo ? new Date(rule.validTo).toLocaleDateString() : 'Ongoing'}</span>
                          )}
                          {rule.executionCount !== undefined && (
                            <span>Executed: {rule.executionCount} times</span>
                          )}
                          <span>Modified: {new Date(rule.lastModified).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center space-x-2 ml-4">
                      {onTestRule && (
                        <button
                          onClick={() => onTestRule(rule.id)}
                          className="p-2 text-purple-600 hover:bg-purple-50 rounded transition-colors"
                          title="Test Rule"
                        >
                          <Play className="h-4 w-4" />
                        </button>
                      )}
                      {onToggleStatus && (
                        <button
                          onClick={() => onToggleStatus(rule.id)}
                          className={`p-2 rounded transition-colors ${
                            rule.status === 'active'
                              ? 'text-gray-600 hover:bg-gray-50'
                              : 'text-green-600 hover:bg-green-50'
                          }`}
                          title={rule.status === 'active' ? 'Deactivate' : 'Activate'}
                        >
                          {rule.status === 'active' ? (
                            <Pause className="h-4 w-4" />
                          ) : (
                            <Play className="h-4 w-4" />
                          )}
                        </button>
                      )}
                      {onDuplicateRule && (
                        <button
                          onClick={() => onDuplicateRule(rule.id)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="Duplicate"
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                      )}
                      {onEditRule && (
                        <button
                          onClick={() => onEditRule(rule.id)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded transition-colors"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                      )}
                      {onDeleteRule && (
                        <button
                          onClick={() => onDeleteRule(rule.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
        ) : (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <Filter className="h-12 w-12 text-gray-400 mb-3" />
            <p className="text-gray-600">No pricing rules found</p>
            {onCreateRule && (
              <button
                onClick={onCreateRule}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Your First Rule
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

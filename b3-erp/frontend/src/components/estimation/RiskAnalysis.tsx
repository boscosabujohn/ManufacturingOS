'use client';

import React, { useState } from 'react';
import {
  AlertTriangle,
  Shield,
  TrendingUp,
  Clock,
  DollarSign,
  Users,
  Package,
  CheckCircle,
  XCircle,
  AlertCircle,
  Info,
  Plus,
  Edit,
  Trash2,
  BarChart3,
} from 'lucide-react';

export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';
export type RiskCategory = 'technical' | 'schedule' | 'cost' | 'resource' | 'vendor' | 'regulatory' | 'market';
export type RiskStatus = 'open' | 'mitigated' | 'accepted' | 'closed';

export interface RiskItem {
  id: string;
  title: string;
  description: string;
  category: RiskCategory;
  level: RiskLevel;
  status: RiskStatus;
  probability: number; // 0-100
  impact: number; // 0-100
  riskScore: number; // probability * impact
  costImpact?: number;
  scheduleImpact?: number; // days
  mitigationPlan?: string;
  contingencyAmount?: number;
  owner?: string;
  identifiedDate: string;
  lastUpdated: string;
}

export interface RiskAnalysisProps {
  estimateId: string;
  risks: RiskItem[];
  totalContingency: number;
  onAddRisk?: () => void;
  onEditRisk?: (riskId: string) => void;
  onDeleteRisk?: (riskId: string) => void;
  onUpdateStatus?: (riskId: string, status: RiskStatus) => void;
  editable?: boolean;
  className?: string;
}

export const RiskAnalysis: React.FC<RiskAnalysisProps> = ({
  estimateId,
  risks,
  totalContingency,
  onAddRisk,
  onEditRisk,
  onDeleteRisk,
  onUpdateStatus,
  editable = false,
  className = '',
}) => {
  const [filter, setFilter] = useState<string>('all');

  const getRiskLevelConfig = (level: RiskLevel) => {
    switch (level) {
      case 'low':
        return { color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200', label: 'Low' };
      case 'medium':
        return { color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200', label: 'Medium' };
      case 'high':
        return { color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200', label: 'High' };
      case 'critical':
        return { color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', label: 'Critical' };
    }
  };

  const getCategoryConfig = (category: RiskCategory) => {
    switch (category) {
      case 'technical':
        return { icon: Package, color: 'text-blue-600', label: 'Technical' };
      case 'schedule':
        return { icon: Clock, color: 'text-purple-600', label: 'Schedule' };
      case 'cost':
        return { icon: DollarSign, color: 'text-green-600', label: 'Cost' };
      case 'resource':
        return { icon: Users, color: 'text-orange-600', label: 'Resource' };
      case 'vendor':
        return { icon: Shield, color: 'text-indigo-600', label: 'Vendor' };
      case 'regulatory':
        return { icon: AlertCircle, color: 'text-red-600', label: 'Regulatory' };
      case 'market':
        return { icon: TrendingUp, color: 'text-cyan-600', label: 'Market' };
    }
  };

  const getStatusConfig = (status: RiskStatus) => {
    switch (status) {
      case 'open':
        return { icon: AlertCircle, color: 'text-red-600', label: 'Open' };
      case 'mitigated':
        return { icon: CheckCircle, color: 'text-green-600', label: 'Mitigated' };
      case 'accepted':
        return { icon: Info, color: 'text-blue-600', label: 'Accepted' };
      case 'closed':
        return { icon: XCircle, color: 'text-gray-600', label: 'Closed' };
    }
  };

  const filteredRisks = risks.filter((risk) => {
    if (filter === 'all') return true;
    if (filter === 'open') return risk.status === 'open';
    return risk.level === filter;
  });

  const stats = {
    total: risks.length,
    open: risks.filter((r) => r.status === 'open').length,
    critical: risks.filter((r) => r.level === 'critical').length,
    high: risks.filter((r) => r.level === 'high').length,
    totalCostImpact: risks.reduce((sum, r) => sum + (r.costImpact || 0), 0),
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Stats */}
      <div className="grid grid-cols-5 gap-2">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-3 text-white">
          <p className="text-sm opacity-90">Total Risks</p>
          <p className="text-3xl font-bold">{stats.total}</p>
        </div>
        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-lg p-3 text-white">
          <p className="text-sm opacity-90">Open Risks</p>
          <p className="text-3xl font-bold">{stats.open}</p>
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-3 text-white">
          <p className="text-sm opacity-90">Critical/High</p>
          <p className="text-3xl font-bold">{stats.critical + stats.high}</p>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-3 text-white">
          <p className="text-sm opacity-90">Cost Impact</p>
          <p className="text-2xl font-bold">${(stats.totalCostImpact / 1000).toFixed(0)}K</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-3 text-white">
          <p className="text-sm opacity-90">Contingency</p>
          <p className="text-2xl font-bold">${(totalContingency / 1000).toFixed(0)}K</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-lg border border-gray-200 p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {['all', 'open', 'critical', 'high', 'medium', 'low'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === f ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
          {editable && onAddRisk && (
            <button
              onClick={onAddRisk}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Add Risk</span>
            </button>
          )}
        </div>
      </div>

      {/* Risk Matrix */}
      <div className="bg-white rounded-lg border border-gray-200 p-3">
        <h3 className="text-lg font-bold text-gray-900 mb-2">Risk Matrix</h3>
        <div className="grid grid-cols-6 gap-2">
          {/* Header */}
          <div className="text-center text-xs font-semibold text-gray-700"></div>
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="text-center text-xs font-semibold text-gray-700">
              {i}
            </div>
          ))}
          {/* Rows */}
          {[5, 4, 3, 2, 1].map((prob) => (
            <React.Fragment key={prob}>
              <div className="flex items-center justify-center text-xs font-semibold text-gray-700">{prob}</div>
              {[1, 2, 3, 4, 5].map((impact) => {
                const score = prob * impact;
                const bg =
                  score >= 20
                    ? 'bg-red-100'
                    : score >= 12
                    ? 'bg-orange-100'
                    : score >= 6
                    ? 'bg-yellow-100'
                    : 'bg-green-100';
                const count = risks.filter(
                  (r) => Math.ceil(r.probability / 20) === prob && Math.ceil(r.impact / 20) === impact
                ).length;

                return (
                  <div key={impact} className={`h-16 rounded ${bg} flex items-center justify-center text-sm font-bold`}>
                    {count > 0 && count}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-between text-xs text-gray-600">
          <span>Low Impact ←</span>
          <span>→ High Impact</span>
        </div>
      </div>

      {/* Risk List */}
      <div className="space-y-3">
        {filteredRisks
          .sort((a, b) => b.riskScore - a.riskScore)
          .map((risk) => {
            const levelConfig = getRiskLevelConfig(risk.level);
            const categoryConfig = getCategoryConfig(risk.category);
            const statusConfig = getStatusConfig(risk.status);
            const CategoryIcon = categoryConfig.icon;
            const StatusIcon = statusConfig.icon;

            return (
              <div
                key={risk.id}
                className={`bg-white rounded-lg border-2 ${levelConfig.border} hover:shadow-lg transition-all p-3`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className={`p-3 rounded-lg ${levelConfig.bg}`}>
                      <AlertTriangle className={`h-6 w-6 ${levelConfig.color}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="text-lg font-bold text-gray-900">{risk.title}</h4>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold border ${levelConfig.bg} ${levelConfig.color} ${levelConfig.border}`}
                        >
                          {levelConfig.label}
                        </span>
                        <span className={`px-2 py-1 rounded text-xs font-semibold flex items-center space-x-1`}>
                          <CategoryIcon className={`h-3 w-3 ${categoryConfig.color}`} />
                          <span>{categoryConfig.label}</span>
                        </span>
                        <span className={`px-2 py-1 rounded text-xs font-semibold flex items-center space-x-1`}>
                          <StatusIcon className={`h-3 w-3 ${statusConfig.color}`} />
                          <span>{statusConfig.label}</span>
                        </span>
                      </div>

                      <p className="text-sm text-gray-600 mb-3">{risk.description}</p>

                      <div className="grid grid-cols-4 gap-3 mb-3">
                        <div className="bg-gray-50 rounded p-2">
                          <p className="text-xs text-gray-600">Probability</p>
                          <p className="text-sm font-bold text-gray-900">{risk.probability}%</p>
                        </div>
                        <div className="bg-gray-50 rounded p-2">
                          <p className="text-xs text-gray-600">Impact</p>
                          <p className="text-sm font-bold text-gray-900">{risk.impact}%</p>
                        </div>
                        <div className="bg-gray-50 rounded p-2">
                          <p className="text-xs text-gray-600">Risk Score</p>
                          <p className="text-sm font-bold text-red-600">{risk.riskScore.toFixed(0)}</p>
                        </div>
                        {risk.costImpact && (
                          <div className="bg-gray-50 rounded p-2">
                            <p className="text-xs text-gray-600">Cost Impact</p>
                            <p className="text-sm font-bold text-orange-600">${risk.costImpact.toLocaleString()}</p>
                          </div>
                        )}
                      </div>

                      {risk.mitigationPlan && (
                        <div className="p-3 bg-blue-50 rounded border border-blue-200">
                          <p className="text-xs font-semibold text-blue-900 mb-1">Mitigation Plan:</p>
                          <p className="text-sm text-blue-800">{risk.mitigationPlan}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {editable && (
                    <div className="flex items-center space-x-2 ml-4">
                      {onEditRisk && (
                        <button
                          onClick={() => onEditRisk(risk.id)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                      )}
                      {onDeleteRisk && (
                        <button
                          onClick={() => onDeleteRisk(risk.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
      </div>

      {filteredRisks.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <Shield className="h-12 w-12 text-gray-400 mb-3" />
          <p className="text-gray-600">No risks found matching your filter</p>
        </div>
      )}
    </div>
  );
};

'use client';

import React, { useState, useEffect } from 'react';
import {
  Lightbulb,
  Package,
  Calendar,
  Wrench,
  TrendingUp,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  ChevronRight,
  Sparkles,
  Zap,
  ShoppingCart,
  Users,
  Target,
  ArrowRight,
  ThumbsUp,
  ThumbsDown,
  RefreshCw,
  Filter,
  BarChart3,
} from 'lucide-react';

// ============================================================================
// Types
// ============================================================================

export type RecommendationType = 'reorder' | 'scheduling' | 'maintenance' | 'efficiency' | 'quality' | 'cost';
export type RecommendationImpact = 'high' | 'medium' | 'low';
export type RecommendationStatus = 'pending' | 'accepted' | 'rejected' | 'implemented';

export interface Recommendation {
  id: string;
  type: RecommendationType;
  title: string;
  description: string;
  rationale: string;
  impact: RecommendationImpact;
  status: RecommendationStatus;
  estimatedSavings?: number;
  estimatedROI?: number;
  timeToImplement: string;
  confidence: number;
  affectedItems: string[];
  actions: {
    label: string;
    primary?: boolean;
  }[];
  generatedAt: Date;
  expiresAt?: Date;
}

export interface SmartRecommendationsProps {
  onRecommendationAction?: (recommendationId: string, action: string) => void;
  onFeedback?: (recommendationId: string, helpful: boolean) => void;
}

// ============================================================================
// Configuration
// ============================================================================

const typeConfig: Record<RecommendationType, {
  icon: React.ElementType;
  color: string;
  bgColor: string;
  label: string;
}> = {
  reorder: {
    icon: ShoppingCart,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    label: 'Reorder Point',
  },
  scheduling: {
    icon: Calendar,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
    label: 'Scheduling',
  },
  maintenance: {
    icon: Wrench,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
    label: 'Maintenance',
  },
  efficiency: {
    icon: Zap,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
    label: 'Efficiency',
  },
  quality: {
    icon: Target,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    label: 'Quality',
  },
  cost: {
    icon: DollarSign,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-100',
    label: 'Cost Reduction',
  },
};

const impactConfig: Record<RecommendationImpact, {
  color: string;
  bgColor: string;
  label: string;
}> = {
  high: { color: 'text-red-600', bgColor: 'bg-red-100', label: 'High Impact' },
  medium: { color: 'text-yellow-600', bgColor: 'bg-yellow-100', label: 'Medium Impact' },
  low: { color: 'text-green-600', bgColor: 'bg-green-100', label: 'Low Impact' },
};

const statusConfig: Record<RecommendationStatus, {
  color: string;
  bgColor: string;
  label: string;
  icon: React.ElementType;
}> = {
  pending: { color: 'text-gray-600', bgColor: 'bg-gray-100', label: 'Pending', icon: Clock },
  accepted: { color: 'text-blue-600', bgColor: 'bg-blue-100', label: 'Accepted', icon: CheckCircle },
  rejected: { color: 'text-red-600', bgColor: 'bg-red-100', label: 'Rejected', icon: XCircle },
  implemented: { color: 'text-green-600', bgColor: 'bg-green-100', label: 'Implemented', icon: CheckCircle },
};

// ============================================================================
// Recommendation Card Component
// ============================================================================

function RecommendationCard({
  recommendation,
  onAction,
  onFeedback,
}: {
  recommendation: Recommendation;
  onAction?: (action: string) => void;
  onFeedback?: (helpful: boolean) => void;
}) {
  const type = typeConfig[recommendation.type];
  const impact = impactConfig[recommendation.impact];
  const status = statusConfig[recommendation.status];
  const TypeIcon = type.icon;
  const StatusIcon = status.icon;

  const isExpired = recommendation.expiresAt && new Date() > recommendation.expiresAt;

  return (
    <div
      className={`
        bg-white dark:bg-gray-800 rounded-xl border-2 transition-all duration-300
        ${recommendation.impact === 'high' ? 'border-red-200 shadow-red-100/50' :
          recommendation.impact === 'medium' ? 'border-yellow-200' : 'border-gray-200 dark:border-gray-700'}
        hover:shadow-lg ${isExpired ? 'opacity-50' : ''}
      `}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-start gap-3">
          <div className={`w-12 h-12 rounded-xl ${type.bgColor} flex items-center justify-center flex-shrink-0`}>
            <TypeIcon className={`w-6 h-6 ${type.color}`} />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${type.bgColor} ${type.color}`}>
                {type.label}
              </span>
              <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${impact.bgColor} ${impact.color}`}>
                {impact.label}
              </span>
              <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${status.bgColor} ${status.color} flex items-center gap-1`}>
                <StatusIcon className="w-3 h-3" />
                {status.label}
              </span>
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white">{recommendation.title}</h3>
          </div>

          {/* Confidence */}
          <div className="text-right">
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              <span>{recommendation.confidence}% confident</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{recommendation.description}</p>

        {/* Rationale */}
        <div className="mb-2 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <Lightbulb className="w-4 h-4 text-indigo-600" />
            <span className="text-sm font-medium text-indigo-600">AI Rationale</span>
          </div>
          <p className="text-sm text-gray-700 dark:text-gray-300">{recommendation.rationale}</p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-3 gap-3 mb-2">
          {recommendation.estimatedSavings && (
            <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg text-center">
              <p className="text-lg font-bold text-green-600">${recommendation.estimatedSavings.toLocaleString()}</p>
              <p className="text-xs text-gray-500">Est. Savings</p>
            </div>
          )}
          {recommendation.estimatedROI && (
            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
              <p className="text-lg font-bold text-blue-600">{recommendation.estimatedROI}%</p>
              <p className="text-xs text-gray-500">Est. ROI</p>
            </div>
          )}
          <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-center">
            <p className="text-lg font-bold text-purple-600">{recommendation.timeToImplement}</p>
            <p className="text-xs text-gray-500">To Implement</p>
          </div>
        </div>

        {/* Affected Items */}
        {recommendation.affectedItems.length > 0 && (
          <div className="mb-2">
            <p className="text-xs text-gray-500 mb-2">Affected Items:</p>
            <div className="flex flex-wrap gap-1">
              {recommendation.affectedItems.map((item, index) => (
                <span
                  key={index}
                  className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        {recommendation.status === 'pending' && (
          <div className="flex gap-2">
            {recommendation.actions.map((action, index) => (
              <button
                key={index}
                onClick={() => onAction?.(action.label)}
                className={`
                  flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-colors
                  flex items-center justify-center gap-2
                  ${action.primary
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300'
                  }
                `}
              >
                {action.label}
                {action.primary && <ArrowRight className="w-4 h-4" />}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
        <span className="text-xs text-gray-500">
          Generated {recommendation.generatedAt.toLocaleDateString()}
          {recommendation.expiresAt && !isExpired && (
            <> | Expires {recommendation.expiresAt.toLocaleDateString()}</>
          )}
          {isExpired && <span className="text-red-500"> | Expired</span>}
        </span>

        {/* Feedback */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">Helpful?</span>
          <button
            onClick={() => onFeedback?.(true)}
            className="p-1.5 hover:bg-green-100 rounded-lg transition-colors"
            title="Yes, helpful"
          >
            <ThumbsUp className="w-4 h-4 text-gray-400 hover:text-green-600" />
          </button>
          <button
            onClick={() => onFeedback?.(false)}
            className="p-1.5 hover:bg-red-100 rounded-lg transition-colors"
            title="Not helpful"
          >
            <ThumbsDown className="w-4 h-4 text-gray-400 hover:text-red-600" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Summary Stats Component
// ============================================================================

function SummaryStats({ recommendations }: { recommendations: Recommendation[] }) {
  const pending = recommendations.filter(r => r.status === 'pending').length;
  const totalSavings = recommendations
    .filter(r => r.status === 'implemented')
    .reduce((sum, r) => sum + (r.estimatedSavings || 0), 0);
  const avgConfidence = Math.round(
    recommendations.reduce((sum, r) => sum + r.confidence, 0) / recommendations.length
  );

  return (
    <div className="grid grid-cols-4 gap-2 mb-3">
      <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl">
        <p className="text-2xl font-bold text-indigo-600">{recommendations.length}</p>
        <p className="text-sm text-gray-600">Total Suggestions</p>
      </div>
      <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl">
        <p className="text-2xl font-bold text-yellow-600">{pending}</p>
        <p className="text-sm text-gray-600">Awaiting Action</p>
      </div>
      <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
        <p className="text-2xl font-bold text-green-600">${totalSavings.toLocaleString()}</p>
        <p className="text-sm text-gray-600">Realized Savings</p>
      </div>
      <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
        <p className="text-2xl font-bold text-purple-600">{avgConfidence}%</p>
        <p className="text-sm text-gray-600">Avg Confidence</p>
      </div>
    </div>
  );
}

// ============================================================================
// Smart Recommendations Component
// ============================================================================

export function SmartRecommendations({
  onRecommendationAction,
  onFeedback,
}: SmartRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [filter, setFilter] = useState<RecommendationType | 'all'>('all');
  const [isLoading, setIsLoading] = useState(true);

  // Generate sample recommendations
  useEffect(() => {
    const sampleRecommendations: Recommendation[] = [
      {
        id: 'rec-1',
        type: 'reorder',
        title: 'Optimize Reorder Point for Steel Sheets',
        description: 'Analysis indicates current reorder point is too conservative, causing excess inventory holding costs.',
        rationale: 'Based on 90-day demand patterns, lead time variability, and safety stock calculations, the optimal reorder point should be reduced from 500 to 380 units.',
        impact: 'high',
        status: 'pending',
        estimatedSavings: 12500,
        estimatedROI: 340,
        timeToImplement: '1 day',
        confidence: 92,
        affectedItems: ['Steel Sheet 4mm', 'Steel Sheet 6mm', 'Steel Sheet 8mm'],
        actions: [
          { label: 'Apply Changes', primary: true },
          { label: 'Review Details' },
          { label: 'Dismiss' },
        ],
        generatedAt: new Date(Date.now() - 86400000),
        expiresAt: new Date(Date.now() + 604800000),
      },
      {
        id: 'rec-2',
        type: 'scheduling',
        title: 'Batch Similar Jobs on CNC Line 2',
        description: 'Grouping similar part families together can significantly reduce setup time and increase throughput.',
        rationale: 'AI analysis of job characteristics shows 35% of setup time could be eliminated by sequencing jobs with similar tooling requirements.',
        impact: 'high',
        status: 'pending',
        estimatedSavings: 28000,
        estimatedROI: 450,
        timeToImplement: '2 hours',
        confidence: 88,
        affectedItems: ['WO-4521', 'WO-4523', 'WO-4528', 'WO-4531'],
        actions: [
          { label: 'Optimize Schedule', primary: true },
          { label: 'View Gantt' },
          { label: 'Dismiss' },
        ],
        generatedAt: new Date(),
      },
      {
        id: 'rec-3',
        type: 'maintenance',
        title: 'Schedule Preventive Maintenance for Press #3',
        description: 'Predictive model indicates hydraulic system degradation. Schedule maintenance before failure.',
        rationale: 'Vibration analysis and pressure readings suggest hydraulic pump efficiency has dropped 15%. Historical data shows failures occur within 200 operating hours of this pattern.',
        impact: 'medium',
        status: 'accepted',
        estimatedSavings: 45000,
        timeToImplement: '4 hours',
        confidence: 85,
        affectedItems: ['Press #3', 'Hydraulic Pump HP-312'],
        actions: [
          { label: 'Schedule Now', primary: true },
          { label: 'Defer 1 Week' },
        ],
        generatedAt: new Date(Date.now() - 172800000),
      },
      {
        id: 'rec-4',
        type: 'efficiency',
        title: 'Adjust Spindle Speed on Lathe Operations',
        description: 'Current spindle speeds are suboptimal for the material grade being processed.',
        rationale: 'Tool wear analysis combined with material properties database suggests a 12% speed increase would improve cycle time without compromising quality.',
        impact: 'medium',
        status: 'pending',
        estimatedSavings: 8500,
        estimatedROI: 280,
        timeToImplement: '30 min',
        confidence: 79,
        affectedItems: ['CNC Lathe #1', 'CNC Lathe #2'],
        actions: [
          { label: 'Update Parameters', primary: true },
          { label: 'Run Simulation' },
        ],
        generatedAt: new Date(),
      },
      {
        id: 'rec-5',
        type: 'quality',
        title: 'Add Inspection Point After Welding',
        description: 'Defect analysis shows welding-related issues are caught too late in the process.',
        rationale: 'SPC data reveals 65% of quality escapes originate from welding operations. An intermediate inspection could catch 80% of these issues early.',
        impact: 'low',
        status: 'implemented',
        estimatedSavings: 15000,
        timeToImplement: '1 week',
        confidence: 94,
        affectedItems: ['Assembly Line 1', 'QC Station'],
        actions: [],
        generatedAt: new Date(Date.now() - 604800000),
      },
      {
        id: 'rec-6',
        type: 'cost',
        title: 'Switch to Alternate Supplier for Fasteners',
        description: 'Price analysis identifies significant savings opportunity with qualified alternate supplier.',
        rationale: 'Supplier B offers 18% lower pricing with equivalent quality ratings and better delivery performance based on market analysis.',
        impact: 'medium',
        status: 'pending',
        estimatedSavings: 22000,
        estimatedROI: 180,
        timeToImplement: '2 weeks',
        confidence: 76,
        affectedItems: ['Hex Bolts M8', 'Lock Nuts M8', 'Washers'],
        actions: [
          { label: 'Request Quote', primary: true },
          { label: 'Compare Suppliers' },
        ],
        generatedAt: new Date(Date.now() - 43200000),
      },
    ];

    setRecommendations(sampleRecommendations);
    setIsLoading(false);
  }, []);

  // Filter recommendations
  const filteredRecommendations = recommendations.filter(r =>
    filter === 'all' ? true : r.type === filter
  );

  // Handle action
  const handleAction = (recommendationId: string, action: string) => {
    if (action === 'Dismiss') {
      setRecommendations(prev =>
        prev.map(r => r.id === recommendationId ? { ...r, status: 'rejected' as RecommendationStatus } : r)
      );
    } else if (action.includes('Apply') || action.includes('Optimize') || action.includes('Schedule')) {
      setRecommendations(prev =>
        prev.map(r => r.id === recommendationId ? { ...r, status: 'accepted' as RecommendationStatus } : r)
      );
    }
    onRecommendationAction?.(recommendationId, action);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="px-3 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Lightbulb className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Smart Recommendations</h2>
              <p className="text-sm text-amber-100">AI-powered optimization suggestions</p>
            </div>
          </div>

          <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="p-6">
        {/* Summary Stats */}
        <SummaryStats recommendations={recommendations} />

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <Filter className="w-4 h-4 text-gray-400" />
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filter === 'all'
                ? 'bg-gray-800 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            All
          </button>
          {(Object.keys(typeConfig) as RecommendationType[]).map(type => {
            const config = typeConfig[type];
            return (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  filter === type
                    ? `${config.bgColor} ${config.color}`
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {config.label}
              </button>
            );
          })}
        </div>

        {/* Recommendations List */}
        <div className="space-y-2 max-h-[600px] overflow-y-auto">
          {filteredRecommendations.map(recommendation => (
            <RecommendationCard
              key={recommendation.id}
              recommendation={recommendation}
              onAction={(action) => handleAction(recommendation.id, action)}
              onFeedback={(helpful) => onFeedback?.(recommendation.id, helpful)}
            />
          ))}

          {filteredRecommendations.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <Lightbulb className="w-12 h-12 mb-3 text-gray-300" />
              <p>No recommendations for this category</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SmartRecommendations;

'use client';

import React, { useState, useEffect } from 'react';
import {
  Brain,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Clock,
  Package,
  Wrench,
  Target,
  Zap,
  ChevronRight,
  RefreshCw,
  Sparkles,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Info,
  CheckCircle,
  XCircle,
} from 'lucide-react';

// ============================================================================
// Types
// ============================================================================

export type InsightCategory = 'demand' | 'quality' | 'maintenance' | 'efficiency' | 'inventory';
export type InsightPriority = 'high' | 'medium' | 'low';
export type TrendDirection = 'up' | 'down' | 'stable';

export interface MLPrediction {
  id: string;
  category: InsightCategory;
  title: string;
  description: string;
  prediction: string;
  confidence: number;
  impact: string;
  priority: InsightPriority;
  trend: TrendDirection;
  timeframe: string;
  metrics: {
    label: string;
    current: number;
    predicted: number;
    unit: string;
  }[];
  actions: string[];
  modelAccuracy: number;
  lastUpdated: Date;
}

export interface AIInsightsPanelProps {
  onInsightClick?: (insight: MLPrediction) => void;
  onActionClick?: (insightId: string, action: string) => void;
  refreshInterval?: number;
}

// ============================================================================
// Configuration
// ============================================================================

const categoryConfig: Record<InsightCategory, {
  icon: React.ElementType;
  color: string;
  bgColor: string;
  label: string;
}> = {
  demand: {
    icon: TrendingUp,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    label: 'Demand Forecast',
  },
  quality: {
    icon: Target,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    label: 'Quality Prediction',
  },
  maintenance: {
    icon: Wrench,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
    label: 'Maintenance',
  },
  efficiency: {
    icon: Zap,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
    label: 'Efficiency',
  },
  inventory: {
    icon: Package,
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-100',
    label: 'Inventory',
  },
};

const priorityConfig: Record<InsightPriority, {
  color: string;
  bgColor: string;
  label: string;
}> = {
  high: { color: 'text-red-600', bgColor: 'bg-red-100', label: 'High Priority' },
  medium: { color: 'text-yellow-600', bgColor: 'bg-yellow-100', label: 'Medium Priority' },
  low: { color: 'text-green-600', bgColor: 'bg-green-100', label: 'Low Priority' },
};

// ============================================================================
// Confidence Meter Component
// ============================================================================

function ConfidenceMeter({ confidence, size = 'sm' }: { confidence: number; size?: 'sm' | 'md' }) {
  const getColor = () => {
    if (confidence >= 90) return 'bg-green-500';
    if (confidence >= 75) return 'bg-blue-500';
    if (confidence >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className={`flex items-center gap-2 ${size === 'md' ? 'text-sm' : 'text-xs'}`}>
      <div className={`${size === 'md' ? 'w-20 h-2' : 'w-16 h-1.5'} bg-gray-200 rounded-full overflow-hidden`}>
        <div
          className={`h-full ${getColor()} transition-all duration-500 rounded-full`}
          style={{ width: `${confidence}%` }}
        />
      </div>
      <span className="text-gray-500 font-medium">{confidence}%</span>
    </div>
  );
}

// ============================================================================
// Metric Comparison Component
// ============================================================================

function MetricComparison({ metric }: { metric: MLPrediction['metrics'][0] }) {
  const change = metric.predicted - metric.current;
  const changePercent = ((change / metric.current) * 100).toFixed(1);
  const isPositive = change > 0;

  return (
    <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
      <div>
        <p className="text-xs text-gray-500">{metric.label}</p>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            {metric.current.toLocaleString()}{metric.unit}
          </span>
          <ArrowUpRight className="w-3 h-3 text-gray-400" />
          <span className={`text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {metric.predicted.toLocaleString()}{metric.unit}
          </span>
        </div>
      </div>
      <div className={`flex items-center gap-1 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        {isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
        <span className="text-xs font-medium">{isPositive ? '+' : ''}{changePercent}%</span>
      </div>
    </div>
  );
}

// ============================================================================
// Insight Card Component
// ============================================================================

function InsightCard({
  insight,
  isExpanded,
  onToggle,
  onActionClick,
}: {
  insight: MLPrediction;
  isExpanded: boolean;
  onToggle: () => void;
  onActionClick?: (action: string) => void;
}) {
  const category = categoryConfig[insight.category];
  const priority = priorityConfig[insight.priority];
  const CategoryIcon = category.icon;

  const TrendIcon = insight.trend === 'up' ? TrendingUp :
                    insight.trend === 'down' ? TrendingDown : Minus;
  const trendColor = insight.trend === 'up' ? 'text-green-500' :
                     insight.trend === 'down' ? 'text-red-500' : 'text-gray-400';

  return (
    <div
      className={`
        bg-white dark:bg-gray-800 rounded-xl border-2 transition-all duration-300
        ${insight.priority === 'high' ? 'border-red-300 shadow-red-100' :
          insight.priority === 'medium' ? 'border-yellow-300' : 'border-gray-200 dark:border-gray-700'}
        ${isExpanded ? 'shadow-lg' : 'hover:shadow-md'}
      `}
    >
      {/* Header */}
      <div
        onClick={onToggle}
        className="p-4 cursor-pointer"
      >
        <div className="flex items-start gap-3">
          {/* Category Icon */}
          <div className={`w-10 h-10 rounded-lg ${category.bgColor} flex items-center justify-center flex-shrink-0`}>
            <CategoryIcon className={`w-5 h-5 ${category.color}`} />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${priority.bgColor} ${priority.color}`}>
                {priority.label}
              </span>
              <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${category.bgColor} ${category.color}`}>
                {category.label}
              </span>
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white">{insight.title}</h3>
            <p className="text-sm text-gray-500 mt-1 line-clamp-2">{insight.description}</p>
          </div>

          {/* Trend & Confidence */}
          <div className="flex flex-col items-end gap-2">
            <TrendIcon className={`w-5 h-5 ${trendColor}`} />
            <ConfidenceMeter confidence={insight.confidence} />
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="px-4 pb-4 border-t border-gray-100 dark:border-gray-700 pt-4">
          {/* Prediction */}
          <div className="mb-2 p-3 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span className="text-sm font-medium text-indigo-600">AI Prediction</span>
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300">{insight.prediction}</p>
            <p className="text-xs text-gray-500 mt-2">
              Timeframe: {insight.timeframe} | Model Accuracy: {insight.modelAccuracy}%
            </p>
          </div>

          {/* Metrics */}
          {insight.metrics.length > 0 && (
            <div className="mb-2">
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Predicted Changes
              </h4>
              <div className="space-y-2">
                {insight.metrics.map((metric, index) => (
                  <MetricComparison key={index} metric={metric} />
                ))}
              </div>
            </div>
          )}

          {/* Impact */}
          <div className="mb-2 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span className="text-sm font-medium text-amber-600">Business Impact</span>
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300">{insight.impact}</p>
          </div>

          {/* Recommended Actions */}
          <div>
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Recommended Actions
            </h4>
            <div className="space-y-2">
              {insight.actions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => onActionClick?.(action)}
                  className="w-full flex items-center justify-between p-2 text-left text-sm bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    {action}
                  </span>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </button>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              Updated {insight.lastUpdated.toLocaleTimeString()}
            </span>
            <span className="flex items-center gap-1">
              <Brain className="w-3.5 h-3.5" />
              ML Model v2.1
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// AI Insights Panel Component
// ============================================================================

export function AIInsightsPanel({
  onInsightClick,
  onActionClick,
  refreshInterval = 30000,
}: AIInsightsPanelProps) {
  const [insights, setInsights] = useState<MLPrediction[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<InsightCategory | 'all'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Generate simulated ML predictions
  const generateInsights = (): MLPrediction[] => {
    return [
      {
        id: 'insight-1',
        category: 'demand',
        title: 'Demand Surge Expected for Product Line A',
        description: 'Our demand forecasting model predicts a 23% increase in orders for Product Line A over the next 2 weeks based on market trends and seasonal patterns.',
        prediction: 'Expected order volume will increase from 1,200 to 1,476 units. Peak demand anticipated on Week 2, Day 3-4.',
        confidence: 87,
        impact: 'Potential revenue increase of $156,000 if demand is met. Risk of stockouts without production adjustment.',
        priority: 'high',
        trend: 'up',
        timeframe: 'Next 14 days',
        metrics: [
          { label: 'Daily Orders', current: 85, predicted: 105, unit: ' units' },
          { label: 'Lead Time', current: 5, predicted: 7, unit: ' days' },
        ],
        actions: [
          'Increase production capacity by 25%',
          'Pre-order raw materials for buffer stock',
          'Schedule overtime shifts for Week 2',
        ],
        modelAccuracy: 94,
        lastUpdated: new Date(),
      },
      {
        id: 'insight-2',
        category: 'quality',
        title: 'Defect Rate Anomaly on Production Line 2',
        description: 'Quality prediction model detected an emerging pattern that may lead to increased defect rates. Early intervention recommended.',
        prediction: 'Defect rate likely to increase from 1.2% to 2.8% within 48 hours if current conditions persist.',
        confidence: 82,
        impact: 'Potential cost of $45,000 in rework and scrap if unaddressed. Customer satisfaction impact risk.',
        priority: 'high',
        trend: 'up',
        timeframe: 'Next 48 hours',
        metrics: [
          { label: 'Defect Rate', current: 1.2, predicted: 2.8, unit: '%' },
          { label: 'Scrap Cost', current: 5200, predicted: 12500, unit: '$' },
        ],
        actions: [
          'Inspect and calibrate Line 2 sensors',
          'Review recent material batch quality',
          'Schedule preventive maintenance',
        ],
        modelAccuracy: 91,
        lastUpdated: new Date(),
      },
      {
        id: 'insight-3',
        category: 'maintenance',
        title: 'CNC Mill #3 Bearing Wear Detected',
        description: 'Predictive maintenance algorithm detected vibration patterns indicating spindle bearing degradation.',
        prediction: 'Bearing failure probability reaches 75% within 120 operating hours. Recommended replacement window: next 5 days.',
        confidence: 91,
        impact: 'Unplanned downtime cost estimated at $28,000. Planned maintenance cost: $3,500.',
        priority: 'medium',
        trend: 'down',
        timeframe: '120 operating hours',
        metrics: [
          { label: 'Vibration Level', current: 4.2, predicted: 7.8, unit: ' mm/s' },
          { label: 'Bearing Life', current: 78, predicted: 25, unit: '%' },
        ],
        actions: [
          'Schedule bearing replacement',
          'Order replacement parts',
          'Prepare backup machine allocation',
        ],
        modelAccuracy: 96,
        lastUpdated: new Date(),
      },
      {
        id: 'insight-4',
        category: 'efficiency',
        title: 'Scheduling Optimization Opportunity',
        description: 'AI analysis identified inefficiencies in current job sequencing that can be improved.',
        prediction: 'Optimized scheduling can improve throughput by 12% and reduce setup time by 18%.',
        confidence: 78,
        impact: 'Potential efficiency gain of $72,000 annually. No additional resource investment required.',
        priority: 'medium',
        trend: 'up',
        timeframe: 'Immediate implementation',
        metrics: [
          { label: 'Throughput', current: 850, predicted: 952, unit: ' units/day' },
          { label: 'Setup Time', current: 45, predicted: 37, unit: ' min' },
        ],
        actions: [
          'Review AI-suggested job sequence',
          'Update production schedule',
          'Train operators on new workflow',
        ],
        modelAccuracy: 88,
        lastUpdated: new Date(),
      },
      {
        id: 'insight-5',
        category: 'inventory',
        title: 'Raw Material Reorder Point Alert',
        description: 'Inventory optimization model recommends adjusting reorder points based on demand forecast.',
        prediction: 'Current stock levels will fall below safety stock in 8 days at predicted consumption rate.',
        confidence: 85,
        impact: 'Risk of production stoppage. Expedited shipping would cost additional $8,500.',
        priority: 'low',
        trend: 'down',
        timeframe: '8 days',
        metrics: [
          { label: 'Stock Level', current: 2400, predicted: 850, unit: ' units' },
          { label: 'Days of Supply', current: 12, predicted: 4, unit: ' days' },
        ],
        actions: [
          'Place purchase order for 5,000 units',
          'Contact alternate suppliers',
          'Adjust safety stock parameters',
        ],
        modelAccuracy: 92,
        lastUpdated: new Date(),
      },
    ];
  };

  // Load insights
  useEffect(() => {
    setInsights(generateInsights());
    setIsLoading(false);
  }, []);

  // Refresh insights periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setIsRefreshing(true);
      setTimeout(() => {
        setInsights(generateInsights());
        setIsRefreshing(false);
      }, 1000);
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [refreshInterval]);

  // Filter insights
  const filteredInsights = insights.filter(i =>
    filter === 'all' ? true : i.category === filter
  );

  // Count by category
  const categoryCounts = insights.reduce((acc, i) => {
    acc[i.category] = (acc[i.category] || 0) + 1;
    return acc;
  }, {} as Record<InsightCategory, number>);

  // Count high priority
  const highPriorityCount = insights.filter(i => i.priority === 'high').length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-3">
          <Brain className="w-8 h-8 animate-pulse text-indigo-600" />
          <span className="text-gray-600">Loading AI insights...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="px-3 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Brain className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">AI Insights Panel</h2>
              <p className="text-sm text-indigo-100">Machine learning predictions & recommendations</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {highPriorityCount > 0 && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-red-500/20 rounded-full">
                <AlertTriangle className="w-4 h-4 text-red-300" />
                <span className="text-sm font-medium">{highPriorityCount} High Priority</span>
              </div>
            )}
            <button
              onClick={() => {
                setIsRefreshing(true);
                setTimeout(() => {
                  setInsights(generateInsights());
                  setIsRefreshing(false);
                }, 1000);
              }}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              disabled={isRefreshing}
            >
              <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="px-3 py-2 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filter === 'all'
                ? 'bg-gray-800 text-white dark:bg-gray-200 dark:text-gray-800'
                : 'bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-300 hover:bg-gray-300'
            }`}
          >
            All ({insights.length})
          </button>

          {(Object.keys(categoryConfig) as InsightCategory[]).map(category => {
            const count = categoryCounts[category] || 0;
            const config = categoryConfig[category];
            return (
              <button
                key={category}
                onClick={() => setFilter(category)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  filter === category
                    ? `${config.bgColor} ${config.color}`
                    : 'bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-300 hover:bg-gray-300'
                }`}
              >
                {config.label} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Insights List */}
      <div className="p-6 space-y-2 max-h-[700px] overflow-y-auto">
        {filteredInsights.map(insight => (
          <InsightCard
            key={insight.id}
            insight={insight}
            isExpanded={expandedId === insight.id}
            onToggle={() => {
              setExpandedId(expandedId === insight.id ? null : insight.id);
              onInsightClick?.(insight);
            }}
            onActionClick={(action) => onActionClick?.(insight.id, action)}
          />
        ))}

        {filteredInsights.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Brain className="w-12 h-12 mb-3 text-gray-300" />
            <p>No insights for the selected category</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AIInsightsPanel;

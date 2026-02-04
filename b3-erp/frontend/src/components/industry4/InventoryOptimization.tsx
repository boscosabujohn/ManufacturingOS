'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Package,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  DollarSign,
  ShoppingCart,
  Zap,
  Brain,
  RefreshCw,
  Filter,
  Download,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Boxes,
  BarChart3,
  Target,
  Sparkles,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

// ============================================================================
// Types
// ============================================================================

export type ReorderUrgency = 'critical' | 'high' | 'medium' | 'low' | 'none';
export type InventoryStatus = 'stockout' | 'critical' | 'low' | 'optimal' | 'excess';
export type AIConfidence = 'high' | 'medium' | 'low';

export interface DemandForecast {
  period: string;
  predicted: number;
  lower: number;
  upper: number;
}

export interface CostImpact {
  holdingCost: number;
  stockoutCost: number;
  orderingCost: number;
  totalCost: number;
  potentialSavings: number;
}

export interface ReorderSuggestion {
  id: string;
  itemId: string;
  itemName: string;
  category: string;
  currentStock: number;
  reorderPoint: number;
  safetyStock: number;
  eoq: number;
  suggestedQuantity: number;
  suggestedDate: string;
  urgency: ReorderUrgency;
  status: InventoryStatus;
  leadTimeDays: number;
  unitCost: number;
  demandForecast: DemandForecast[];
  costImpact: CostImpact;
  aiRationale: string;
  confidence: AIConfidence;
  daysToStockout: number;
  preferredVendor: string;
  alternativeVendors: string[];
}

export interface InventoryMetrics {
  totalValue: number;
  turnoverRate: number;
  fillRate: number;
  stockoutRate: number;
  excessValue: number;
  potentialSavings: number;
}

export interface InventoryOptimizationProps {
  onReorderClick?: (suggestion: ReorderSuggestion) => void;
  onApproveReorder?: (suggestionId: string) => void;
  onDismissSuggestion?: (suggestionId: string) => void;
}

// ============================================================================
// Mock Data Generator
// ============================================================================

const generateMockSuggestions = (): ReorderSuggestion[] => [
  {
    id: 'sugg-1',
    itemId: 'SKU-001234',
    itemName: 'Electronic Control Unit - Type A',
    category: 'Electronics',
    currentStock: 45,
    reorderPoint: 100,
    safetyStock: 50,
    eoq: 250,
    suggestedQuantity: 300,
    suggestedDate: '2024-12-08',
    urgency: 'critical',
    status: 'critical',
    leadTimeDays: 21,
    unitCost: 125,
    demandForecast: [
      { period: 'Week 1', predicted: 60, lower: 45, upper: 75 },
      { period: 'Week 2', predicted: 65, lower: 50, upper: 80 },
      { period: 'Week 3', predicted: 70, lower: 55, upper: 85 },
      { period: 'Week 4', predicted: 68, lower: 53, upper: 83 },
    ],
    costImpact: {
      holdingCost: 1250,
      stockoutCost: 15000,
      orderingCost: 450,
      totalCost: 16700,
      potentialSavings: 12500,
    },
    aiRationale: 'Stock level below reorder point with high demand forecast. Immediate reorder recommended to avoid production stoppage. Historical data shows 98% accuracy for this item category.',
    confidence: 'high',
    daysToStockout: 3,
    preferredVendor: 'Precision Components Ltd',
    alternativeVendors: ['Eastern Electronics Co', 'Pacific Motors'],
  },
  {
    id: 'sugg-2',
    itemId: 'SKU-002345',
    itemName: 'Semiconductor Chip - X200',
    category: 'Semiconductors',
    currentStock: 2500,
    reorderPoint: 3000,
    safetyStock: 1500,
    eoq: 5000,
    suggestedQuantity: 5000,
    suggestedDate: '2024-12-12',
    urgency: 'high',
    status: 'low',
    leadTimeDays: 35,
    unitCost: 8.50,
    demandForecast: [
      { period: 'Week 1', predicted: 800, lower: 650, upper: 950 },
      { period: 'Week 2', predicted: 850, lower: 700, upper: 1000 },
      { period: 'Week 3', predicted: 900, lower: 750, upper: 1050 },
      { period: 'Week 4', predicted: 920, lower: 770, upper: 1070 },
    ],
    costImpact: {
      holdingCost: 4250,
      stockoutCost: 25000,
      orderingCost: 680,
      totalCost: 29930,
      potentialSavings: 18500,
    },
    aiRationale: 'Long lead time requires early reorder. Seasonal demand increase expected. Bulk order at EOQ provides 15% cost savings.',
    confidence: 'high',
    daysToStockout: 8,
    preferredVendor: 'Eastern Electronics Co',
    alternativeVendors: ['Tokyo Semiconductors'],
  },
  {
    id: 'sugg-3',
    itemId: 'SKU-003456',
    itemName: 'Steel Frame Assembly',
    category: 'Structural',
    currentStock: 80,
    reorderPoint: 60,
    safetyStock: 30,
    eoq: 100,
    suggestedQuantity: 100,
    suggestedDate: '2024-12-20',
    urgency: 'medium',
    status: 'optimal',
    leadTimeDays: 14,
    unitCost: 450,
    demandForecast: [
      { period: 'Week 1', predicted: 20, lower: 15, upper: 25 },
      { period: 'Week 2', predicted: 22, lower: 17, upper: 27 },
      { period: 'Week 3', predicted: 25, lower: 20, upper: 30 },
      { period: 'Week 4', predicted: 23, lower: 18, upper: 28 },
    ],
    costImpact: {
      holdingCost: 2700,
      stockoutCost: 0,
      orderingCost: 350,
      totalCost: 3050,
      potentialSavings: 850,
    },
    aiRationale: 'Proactive reorder to maintain optimal stock levels. Current inventory sufficient for 3 weeks. Scheduling order now ensures continuous supply.',
    confidence: 'medium',
    daysToStockout: 21,
    preferredVendor: 'Global Steel Works',
    alternativeVendors: ['MidWest Manufacturing'],
  },
  {
    id: 'sugg-4',
    itemId: 'SKU-004567',
    itemName: 'Plastic Housing - Large',
    category: 'Plastics',
    currentStock: 1200,
    reorderPoint: 400,
    safetyStock: 200,
    eoq: 600,
    suggestedQuantity: 0,
    suggestedDate: '',
    urgency: 'none',
    status: 'excess',
    leadTimeDays: 10,
    unitCost: 12,
    demandForecast: [
      { period: 'Week 1', predicted: 80, lower: 60, upper: 100 },
      { period: 'Week 2', predicted: 75, lower: 55, upper: 95 },
      { period: 'Week 3', predicted: 85, lower: 65, upper: 105 },
      { period: 'Week 4', predicted: 80, lower: 60, upper: 100 },
    ],
    costImpact: {
      holdingCost: 3600,
      stockoutCost: 0,
      orderingCost: 0,
      totalCost: 3600,
      potentialSavings: -2400,
    },
    aiRationale: 'Excess inventory detected. Current stock covers 15 weeks of demand. Consider reducing future orders or promotional usage to reduce holding costs.',
    confidence: 'high',
    daysToStockout: 105,
    preferredVendor: 'Nordic Plastics AB',
    alternativeVendors: [],
  },
  {
    id: 'sugg-5',
    itemId: 'SKU-005678',
    itemName: 'Motor Assembly - 5HP',
    category: 'Motors',
    currentStock: 0,
    reorderPoint: 25,
    safetyStock: 15,
    eoq: 50,
    suggestedQuantity: 75,
    suggestedDate: '2024-12-06',
    urgency: 'critical',
    status: 'stockout',
    leadTimeDays: 18,
    unitCost: 890,
    demandForecast: [
      { period: 'Week 1', predicted: 12, lower: 8, upper: 16 },
      { period: 'Week 2', predicted: 15, lower: 11, upper: 19 },
      { period: 'Week 3', predicted: 14, lower: 10, upper: 18 },
      { period: 'Week 4', predicted: 13, lower: 9, upper: 17 },
    ],
    costImpact: {
      holdingCost: 0,
      stockoutCost: 45000,
      orderingCost: 580,
      totalCost: 45580,
      potentialSavings: 35000,
    },
    aiRationale: 'URGENT: Stockout condition. Production line 3 affected. Expedited shipping recommended. Higher quantity ordered to cover backlog and demand during lead time.',
    confidence: 'high',
    daysToStockout: 0,
    preferredVendor: 'Pacific Motors',
    alternativeVendors: ['UK Precision Tools'],
  },
  {
    id: 'sugg-6',
    itemId: 'SKU-006789',
    itemName: 'Precision Bearings - Type C',
    category: 'Components',
    currentStock: 350,
    reorderPoint: 300,
    safetyStock: 150,
    eoq: 400,
    suggestedQuantity: 400,
    suggestedDate: '2024-12-15',
    urgency: 'low',
    status: 'optimal',
    leadTimeDays: 12,
    unitCost: 35,
    demandForecast: [
      { period: 'Week 1', predicted: 50, lower: 40, upper: 60 },
      { period: 'Week 2', predicted: 55, lower: 45, upper: 65 },
      { period: 'Week 3', predicted: 52, lower: 42, upper: 62 },
      { period: 'Week 4', predicted: 48, lower: 38, upper: 58 },
    ],
    costImpact: {
      holdingCost: 1400,
      stockoutCost: 0,
      orderingCost: 280,
      totalCost: 1680,
      potentialSavings: 420,
    },
    aiRationale: 'Stock approaching reorder point. Standard reorder at EOQ recommended. No urgency - can be combined with other orders for shipping optimization.',
    confidence: 'medium',
    daysToStockout: 17,
    preferredVendor: 'Precision Components Ltd',
    alternativeVendors: ['UK Precision Tools', 'MidWest Manufacturing'],
  },
];

const generateMockMetrics = (): InventoryMetrics => ({
  totalValue: 2450000,
  turnoverRate: 6.2,
  fillRate: 97.5,
  stockoutRate: 2.1,
  excessValue: 185000,
  potentialSavings: 67500,
});

// ============================================================================
// Helper Functions
// ============================================================================

const getUrgencyColor = (urgency: ReorderUrgency) => {
  switch (urgency) {
    case 'critical':
      return 'bg-red-500';
    case 'high':
      return 'bg-orange-500';
    case 'medium':
      return 'bg-amber-500';
    case 'low':
      return 'bg-blue-500';
    case 'none':
      return 'bg-gray-400';
  }
};

const getUrgencyBgColor = (urgency: ReorderUrgency) => {
  switch (urgency) {
    case 'critical':
      return 'bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-700';
    case 'high':
      return 'bg-orange-100 dark:bg-orange-900/30 border-orange-300 dark:border-orange-700';
    case 'medium':
      return 'bg-amber-100 dark:bg-amber-900/30 border-amber-300 dark:border-amber-700';
    case 'low':
      return 'bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700';
    case 'none':
      return 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600';
  }
};

const getStatusColor = (status: InventoryStatus) => {
  switch (status) {
    case 'stockout':
      return 'text-red-600';
    case 'critical':
      return 'text-red-500';
    case 'low':
      return 'text-orange-500';
    case 'optimal':
      return 'text-green-500';
    case 'excess':
      return 'text-purple-500';
  }
};

// ============================================================================
// Metrics Dashboard Component
// ============================================================================

function MetricsDashboard({ metrics }: { metrics: InventoryMetrics }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-6 gap-2 mb-3">
      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center gap-3">
            <DollarSign className="w-8 h-8 text-green-500" />
            <div>
              <p className="text-xl font-bold">${(metrics.totalValue / 1000000).toFixed(1)}M</p>
              <p className="text-xs text-gray-500">Total Value</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center gap-3">
            <RefreshCw className="w-8 h-8 text-blue-500" />
            <div>
              <p className="text-xl font-bold">{metrics.turnoverRate}x</p>
              <p className="text-xs text-gray-500">Turnover Rate</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center gap-3">
            <Target className="w-8 h-8 text-indigo-500" />
            <div>
              <p className="text-xl font-bold text-green-600">{metrics.fillRate}%</p>
              <p className="text-xs text-gray-500">Fill Rate</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-8 h-8 text-red-500" />
            <div>
              <p className="text-xl font-bold text-red-600">{metrics.stockoutRate}%</p>
              <p className="text-xs text-gray-500">Stockout Rate</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center gap-3">
            <Boxes className="w-8 h-8 text-purple-500" />
            <div>
              <p className="text-xl font-bold text-purple-600">${(metrics.excessValue / 1000).toFixed(0)}K</p>
              <p className="text-xs text-gray-500">Excess Value</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-amber-500" />
            <div>
              <p className="text-xl font-bold text-green-600">${(metrics.potentialSavings / 1000).toFixed(0)}K</p>
              <p className="text-xs text-gray-500">Potential Savings</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ============================================================================
// Demand Forecast Chart Component
// ============================================================================

function DemandForecastChart({ forecast }: { forecast: DemandForecast[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const padding = 20;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Find max value for scaling
    const maxValue = Math.max(...forecast.map(f => f.upper)) * 1.1;

    // Draw confidence interval
    ctx.beginPath();
    ctx.fillStyle = 'rgba(99, 102, 241, 0.2)';
    forecast.forEach((f, i) => {
      const x = padding + (i / (forecast.length - 1)) * chartWidth;
      const y = height - padding - (f.upper / maxValue) * chartHeight;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    [...forecast].reverse().forEach((f, i) => {
      const x = padding + ((forecast.length - 1 - i) / (forecast.length - 1)) * chartWidth;
      const y = height - padding - (f.lower / maxValue) * chartHeight;
      ctx.lineTo(x, y);
    });
    ctx.closePath();
    ctx.fill();

    // Draw predicted line
    ctx.beginPath();
    ctx.strokeStyle = '#6366f1';
    ctx.lineWidth = 2;
    forecast.forEach((f, i) => {
      const x = padding + (i / (forecast.length - 1)) * chartWidth;
      const y = height - padding - (f.predicted / maxValue) * chartHeight;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Draw points
    forecast.forEach((f, i) => {
      const x = padding + (i / (forecast.length - 1)) * chartWidth;
      const y = height - padding - (f.predicted / maxValue) * chartHeight;
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#6366f1';
      ctx.fill();
    });
  }, [forecast]);

  return (
    <canvas ref={canvasRef} width={200} height={80} className="w-full h-20" />
  );
}

// ============================================================================
// Inventory Level Bar Component
// ============================================================================

function InventoryLevelBar({ suggestion }: { suggestion: ReorderSuggestion }) {
  const maxLevel = Math.max(suggestion.currentStock, suggestion.reorderPoint * 2, suggestion.eoq);
  const stockPercent = (suggestion.currentStock / maxLevel) * 100;
  const reorderPercent = (suggestion.reorderPoint / maxLevel) * 100;
  const safetyPercent = (suggestion.safetyStock / maxLevel) * 100;

  return (
    <div className="relative h-6 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
      {/* Safety stock zone */}
      <div
        className="absolute h-full bg-red-200 dark:bg-red-900/50"
        style={{ width: `${safetyPercent}%` }}
      />

      {/* Current stock bar */}
      <div
        className={`absolute h-full rounded-full transition-all ${
          suggestion.status === 'stockout' ? 'bg-red-500' :
          suggestion.status === 'critical' ? 'bg-red-400' :
          suggestion.status === 'low' ? 'bg-orange-400' :
          suggestion.status === 'optimal' ? 'bg-green-500' : 'bg-purple-500'
        }`}
        style={{ width: `${stockPercent}%` }}
      />

      {/* Reorder point marker */}
      <div
        className="absolute h-full w-0.5 bg-amber-600"
        style={{ left: `${reorderPercent}%` }}
      />

      {/* Labels */}
      <div className="absolute inset-0 flex items-center justify-between px-2 text-xs font-medium">
        <span className="text-white drop-shadow">{suggestion.currentStock}</span>
        <span className="text-gray-600 dark:text-gray-300">ROP: {suggestion.reorderPoint}</span>
      </div>
    </div>
  );
}

// ============================================================================
// Suggestion Card Component
// ============================================================================

function SuggestionCard({
  suggestion,
  onReorderClick,
  onApprove,
  onDismiss,
}: {
  suggestion: ReorderSuggestion;
  onReorderClick?: (suggestion: ReorderSuggestion) => void;
  onApprove?: (id: string) => void;
  onDismiss?: (id: string) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(suggestion.urgency === 'critical');

  return (
    <Card className={`border ${getUrgencyBgColor(suggestion.urgency)}`}>
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-2">
            <div className={`p-2 rounded-lg ${getUrgencyColor(suggestion.urgency)}`}>
              {suggestion.status === 'stockout' ? (
                <AlertTriangle className="w-6 h-6 text-white" />
              ) : suggestion.status === 'excess' ? (
                <Boxes className="w-6 h-6 text-white" />
              ) : (
                <Package className="w-6 h-6 text-white" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4
                  className="font-semibold text-gray-900 dark:text-white cursor-pointer hover:text-blue-600 transition-colors"
                  onClick={() => onReorderClick?.(suggestion)}
                >
                  {suggestion.itemName}
                </h4>
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${getUrgencyColor(suggestion.urgency)} text-white`}>
                  {suggestion.urgency.toUpperCase()}
                </span>
              </div>
              <p className="text-sm text-gray-500">{suggestion.itemId} • {suggestion.category}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Vendor: <span className="font-medium">{suggestion.preferredVendor}</span>
              </p>
            </div>
          </div>

          <div className="text-right">
            {suggestion.suggestedQuantity > 0 ? (
              <>
                <p className="text-2xl font-bold text-blue-600">{suggestion.suggestedQuantity}</p>
                <p className="text-xs text-gray-500">Suggested Qty</p>
                <p className="text-sm font-medium mt-1">
                  ${(suggestion.suggestedQuantity * suggestion.unitCost).toLocaleString()}
                </p>
              </>
            ) : (
              <>
                <p className="text-sm font-medium text-purple-600">No Reorder Needed</p>
                <p className="text-xs text-gray-500">Excess Stock</p>
              </>
            )}
          </div>
        </div>

        {/* Inventory Level Bar */}
        <div className="mt-4">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Current Stock</span>
            <span className={getStatusColor(suggestion.status)}>
              {suggestion.daysToStockout > 0 ? `${suggestion.daysToStockout} days to stockout` : 'STOCKOUT'}
            </span>
          </div>
          <InventoryLevelBar suggestion={suggestion} />
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-2 mt-4 text-sm">
          <div>
            <p className="text-gray-500 text-xs">Lead Time</p>
            <p className="font-semibold">{suggestion.leadTimeDays} days</p>
          </div>
          <div>
            <p className="text-gray-500 text-xs">Unit Cost</p>
            <p className="font-semibold">${suggestion.unitCost}</p>
          </div>
          <div>
            <p className="text-gray-500 text-xs">EOQ</p>
            <p className="font-semibold">{suggestion.eoq}</p>
          </div>
          <div>
            <p className="text-gray-500 text-xs">Savings</p>
            <p className={`font-semibold ${suggestion.costImpact.potentialSavings > 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${Math.abs(suggestion.costImpact.potentialSavings).toLocaleString()}
              {suggestion.costImpact.potentialSavings > 0 ? (
                <ArrowDownRight className="w-3 h-3 inline ml-1" />
              ) : (
                <ArrowUpRight className="w-3 h-3 inline ml-1" />
              )}
            </p>
          </div>
        </div>

        {/* AI Rationale */}
        <div className="mt-4 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-start gap-2">
            <Brain className="w-4 h-4 text-indigo-500 mt-0.5 flex-shrink-0" />
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-medium text-indigo-600">AI Recommendation</span>
                <span className={`px-1.5 py-0.5 rounded text-xs ${
                  suggestion.confidence === 'high' ? 'bg-green-100 text-green-700' :
                  suggestion.confidence === 'medium' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-700'
                }`}>
                  {suggestion.confidence} confidence
                </span>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300">{suggestion.aiRationale}</p>
            </div>
          </div>
        </div>

        {/* Expanded Details */}
        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
              {/* Demand Forecast */}
              <div>
                <h5 className="text-sm font-medium mb-2">Demand Forecast</h5>
                <DemandForecastChart forecast={suggestion.demandForecast} />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  {suggestion.demandForecast.map(f => (
                    <span key={f.period}>{f.period}</span>
                  ))}
                </div>
              </div>

              {/* Cost Impact */}
              <div>
                <h5 className="text-sm font-medium mb-2">Cost Impact Analysis</h5>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Holding Cost</span>
                    <span>${suggestion.costImpact.holdingCost.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Stockout Cost</span>
                    <span className="text-red-600">${suggestion.costImpact.stockoutCost.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Ordering Cost</span>
                    <span>${suggestion.costImpact.orderingCost.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t font-medium">
                    <span>Total Cost</span>
                    <span>${suggestion.costImpact.totalCost.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Alternative Vendors */}
            {suggestion.alternativeVendors.length > 0 && (
              <div className="mt-4">
                <h5 className="text-sm font-medium mb-2">Alternative Vendors</h5>
                <div className="flex flex-wrap gap-2">
                  {suggestion.alternativeVendors.map(vendor => (
                    <span key={vendor} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">
                      {vendor}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? 'Show Less' : 'Show More'}
            <ChevronRight className={`w-4 h-4 ml-1 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
          </Button>

          {suggestion.suggestedQuantity > 0 && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDismiss?.(suggestion.id)}
              >
                Dismiss
              </Button>
              <Button
                size="sm"
                className={suggestion.urgency === 'critical' ? 'bg-red-600 hover:bg-red-700' : ''}
                onClick={() => onApprove?.(suggestion.id)}
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Approve Reorder
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export function InventoryOptimization({
  onReorderClick,
  onApproveReorder,
  onDismissSuggestion,
}: InventoryOptimizationProps) {
  const [suggestions, setSuggestions] = useState<ReorderSuggestion[]>([]);
  const [metrics, setMetrics] = useState<InventoryMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filterUrgency, setFilterUrgency] = useState<ReorderUrgency | 'all'>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  useEffect(() => {
    setSuggestions(generateMockSuggestions());
    setMetrics(generateMockMetrics());
    setIsLoading(false);
  }, []);

  const categories = useMemo(() => {
    const cats = new Set(suggestions.map(s => s.category));
    return Array.from(cats);
  }, [suggestions]);

  const filteredSuggestions = useMemo(() => {
    let result = [...suggestions];

    if (filterUrgency !== 'all') {
      result = result.filter(s => s.urgency === filterUrgency);
    }

    if (filterCategory !== 'all') {
      result = result.filter(s => s.category === filterCategory);
    }

    // Sort by urgency
    const urgencyOrder = { critical: 0, high: 1, medium: 2, low: 3, none: 4 };
    result.sort((a, b) => urgencyOrder[a.urgency] - urgencyOrder[b.urgency]);

    return result;
  }, [suggestions, filterUrgency, filterCategory]);

  if (isLoading || !metrics) {
    return (
      <Card>
        <CardContent className="h-[400px] flex items-center justify-center">
          <RefreshCw className="w-8 h-8 animate-spin text-gray-400" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-2">
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-indigo-600" />
              AI-Driven Inventory Optimization
            </CardTitle>

            <div className="flex items-center gap-3">
              <select
                value={filterUrgency}
                onChange={e => setFilterUrgency(e.target.value as ReorderUrgency | 'all')}
                className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm"
              >
                <option value="all">All Urgencies</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
                <option value="none">No Action</option>
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
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <MetricsDashboard metrics={metrics} />
        </CardContent>
      </Card>

      {/* Summary Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-2">
        {(['critical', 'high', 'medium', 'low'] as ReorderUrgency[]).map(urgency => {
          const count = suggestions.filter(s => s.urgency === urgency).length;
          const totalValue = suggestions
            .filter(s => s.urgency === urgency)
            .reduce((sum, s) => sum + (s.suggestedQuantity * s.unitCost), 0);

          return (
            <Card
              key={urgency}
              className={`cursor-pointer transition-all hover:shadow-lg ${
                filterUrgency === urgency ? 'ring-2 ring-indigo-500' : ''
              }`}
              onClick={() => setFilterUrgency(filterUrgency === urgency ? 'all' : urgency)}
            >
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 capitalize">{urgency} Priority</p>
                    <p className="text-2xl font-bold">{count}</p>
                    <p className="text-sm text-gray-500">${(totalValue / 1000).toFixed(0)}K value</p>
                  </div>
                  <div className={`w-4 h-4 rounded-full ${getUrgencyColor(urgency)}`} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Suggestions List */}
      <div className="space-y-2">
        {filteredSuggestions.map(suggestion => (
          <SuggestionCard
            key={suggestion.id}
            suggestion={suggestion}
            onReorderClick={onReorderClick}
            onApprove={onApproveReorder}
            onDismiss={onDismissSuggestion}
          />
        ))}
      </div>

      {filteredSuggestions.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center text-gray-500">
            No suggestions match the selected filters
          </CardContent>
        </Card>
      )}
    </div>
  );
}

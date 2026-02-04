'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Target,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Calendar,
  Clock,
  BarChart3,
  LineChart,
  RefreshCw,
  Download,
  Settings,
  Info,
  Layers,
} from 'lucide-react';

// ============================================================================
// Types
// ============================================================================

export interface QualityDataPoint {
  date: string;
  actual?: number;
  predicted?: number;
  upperBound?: number;
  lowerBound?: number;
  target: number;
}

export interface QualityMetric {
  id: string;
  name: string;
  unit: string;
  currentValue: number;
  predictedValue: number;
  target: number;
  trend: 'improving' | 'declining' | 'stable';
  confidence: number;
  riskLevel: 'low' | 'medium' | 'high';
  historicalData: QualityDataPoint[];
  forecastData: QualityDataPoint[];
}

export interface PredictiveQualityChartsProps {
  productLine?: string;
  timeRange?: '7d' | '14d' | '30d' | '90d';
  onMetricClick?: (metric: QualityMetric) => void;
}

// ============================================================================
// Configuration
// ============================================================================

const riskConfig: Record<string, {
  color: string;
  bgColor: string;
  label: string;
}> = {
  low: { color: 'text-green-600', bgColor: 'bg-green-100', label: 'Low Risk' },
  medium: { color: 'text-yellow-600', bgColor: 'bg-yellow-100', label: 'Medium Risk' },
  high: { color: 'text-red-600', bgColor: 'bg-red-100', label: 'High Risk' },
};

// ============================================================================
// Quality Trend Chart Component
// ============================================================================

function QualityTrendChart({
  metric,
  width = 400,
  height = 200,
}: {
  metric: QualityMetric;
  width?: number;
  height?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const allData = [...metric.historicalData, ...metric.forecastData];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Calculate scales
    const values = allData.flatMap(d => [
      d.actual || 0,
      d.predicted || 0,
      d.upperBound || 0,
      d.lowerBound || 0,
      d.target,
    ].filter(v => v > 0));

    const minVal = Math.min(...values) * 0.95;
    const maxVal = Math.max(...values) * 1.05;
    const range = maxVal - minVal || 1;

    const padding = { top: 20, right: 20, bottom: 30, left: 50 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    const getX = (index: number) => padding.left + (index / (allData.length - 1)) * chartWidth;
    const getY = (val: number) => padding.top + (1 - (val - minVal) / range) * chartHeight;

    // Draw grid
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
      const y = padding.top + (chartHeight / 5) * i;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();

      // Y-axis labels
      const val = maxVal - (range / 5) * i;
      ctx.fillStyle = '#9ca3af';
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(val.toFixed(1), padding.left - 5, y + 3);
    }

    // Divider between historical and forecast
    const dividerX = getX(metric.historicalData.length - 1);
    ctx.strokeStyle = '#d1d5db';
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(dividerX, padding.top);
    ctx.lineTo(dividerX, height - padding.bottom);
    ctx.stroke();
    ctx.setLineDash([]);

    // Labels
    ctx.fillStyle = '#6b7280';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Historical', padding.left + (dividerX - padding.left) / 2, height - 5);
    ctx.fillText('Forecast', dividerX + (width - padding.right - dividerX) / 2, height - 5);

    // Draw confidence interval (shaded area)
    ctx.fillStyle = 'rgba(99, 102, 241, 0.15)';
    ctx.beginPath();
    let started = false;
    metric.forecastData.forEach((d, i) => {
      const x = getX(metric.historicalData.length + i);
      const yUpper = getY(d.upperBound || d.predicted || 0);
      if (!started) {
        ctx.moveTo(x, yUpper);
        started = true;
      } else {
        ctx.lineTo(x, yUpper);
      }
    });
    // Draw back along lower bound
    for (let i = metric.forecastData.length - 1; i >= 0; i--) {
      const d = metric.forecastData[i];
      const x = getX(metric.historicalData.length + i);
      const yLower = getY(d.lowerBound || d.predicted || 0);
      ctx.lineTo(x, yLower);
    }
    ctx.closePath();
    ctx.fill();

    // Draw target line
    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 2;
    ctx.setLineDash([8, 4]);
    ctx.beginPath();
    ctx.moveTo(padding.left, getY(metric.target));
    ctx.lineTo(width - padding.right, getY(metric.target));
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw actual values (historical)
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    ctx.beginPath();
    metric.historicalData.forEach((d, i) => {
      if (d.actual === undefined) return;
      const x = getX(i);
      const y = getY(d.actual);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Draw predicted values (forecast)
    ctx.strokeStyle = '#8b5cf6';
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    // Start from last actual point
    const lastActual = metric.historicalData[metric.historicalData.length - 1];
    if (lastActual.actual !== undefined) {
      ctx.moveTo(getX(metric.historicalData.length - 1), getY(lastActual.actual));
    }
    metric.forecastData.forEach((d, i) => {
      if (d.predicted === undefined) return;
      const x = getX(metric.historicalData.length + i);
      const y = getY(d.predicted);
      ctx.lineTo(x, y);
    });
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw data points
    metric.historicalData.forEach((d, i) => {
      if (d.actual === undefined) return;
      const x = getX(i);
      const y = getY(d.actual);
      ctx.fillStyle = '#3b82f6';
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fill();
    });

  }, [metric, width, height, allData]);

  return (
    <div className="relative">
      <canvas ref={canvasRef} width={width} height={height} className="w-full" />
      {/* Legend */}
      <div className="flex items-center justify-center gap-2 mt-2 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-3 h-0.5 bg-blue-500 rounded" />
          <span className="text-gray-500">Actual</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-0.5 bg-purple-500 rounded" style={{ borderStyle: 'dashed' }} />
          <span className="text-gray-500">Predicted</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-indigo-500/20 rounded" />
          <span className="text-gray-500">Confidence</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-0.5 bg-green-500 rounded" />
          <span className="text-gray-500">Target</span>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Metric Summary Card Component
// ============================================================================

function MetricSummaryCard({
  metric,
  onClick,
}: {
  metric: QualityMetric;
  onClick?: () => void;
}) {
  const risk = riskConfig[metric.riskLevel];
  const TrendIcon = metric.trend === 'improving' ? TrendingUp :
                    metric.trend === 'declining' ? TrendingDown : BarChart3;
  const trendColor = metric.trend === 'improving' ? 'text-green-500' :
                     metric.trend === 'declining' ? 'text-red-500' : 'text-gray-400';

  const vsTarget = ((metric.currentValue - metric.target) / metric.target * 100).toFixed(1);
  const isAboveTarget = metric.currentValue >= metric.target;

  return (
    <div
      onClick={onClick}
      className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all cursor-pointer"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-white">{metric.name}</h4>
          <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full ${risk.bgColor} ${risk.color}`}>
            {risk.label}
          </span>
        </div>
        <TrendIcon className={`w-5 h-5 ${trendColor}`} />
      </div>

      <div className="grid grid-cols-2 gap-2 mb-3">
        <div>
          <p className="text-xs text-gray-500">Current</p>
          <p className="text-lg font-bold text-gray-900 dark:text-white">
            {metric.currentValue.toFixed(2)}{metric.unit}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Predicted</p>
          <p className="text-lg font-bold text-purple-600">
            {metric.predictedValue.toFixed(2)}{metric.unit}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-1">
          <Target className="w-4 h-4 text-gray-400" />
          <span className="text-gray-500">Target: {metric.target}{metric.unit}</span>
        </div>
        <span className={isAboveTarget ? 'text-green-600' : 'text-red-600'}>
          {isAboveTarget ? '+' : ''}{vsTarget}%
        </span>
      </div>

      <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-500">Confidence</span>
          <div className="flex items-center gap-2">
            <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-500 rounded-full"
                style={{ width: `${metric.confidence}%` }}
              />
            </div>
            <span className="text-gray-600 font-medium">{metric.confidence}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Predictive Quality Charts Component
// ============================================================================

export function PredictiveQualityCharts({
  productLine = 'All Lines',
  timeRange = '14d',
  onMetricClick,
}: PredictiveQualityChartsProps) {
  const [metrics, setMetrics] = useState<QualityMetric[]>([]);
  const [selectedMetric, setSelectedMetric] = useState<QualityMetric | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Generate sample data
  useEffect(() => {
    const generateData = (baseValue: number, volatility: number, trend: number, days: number): QualityDataPoint[] => {
      const data: QualityDataPoint[] = [];
      let value = baseValue;

      for (let i = 0; i < days; i++) {
        value += trend + (Math.random() - 0.5) * volatility;
        value = Math.max(0, Math.min(100, value));

        const date = new Date();
        date.setDate(date.getDate() - (days - i));

        data.push({
          date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          actual: value,
          target: 95,
        });
      }
      return data;
    };

    const generateForecast = (lastValue: number, trend: number, days: number): QualityDataPoint[] => {
      const data: QualityDataPoint[] = [];
      let value = lastValue;
      let uncertainty = 0.5;

      for (let i = 0; i < days; i++) {
        value += trend + (Math.random() - 0.5) * 2;
        value = Math.max(0, Math.min(100, value));
        uncertainty += 0.3;

        const date = new Date();
        date.setDate(date.getDate() + i + 1);

        data.push({
          date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          predicted: value,
          upperBound: Math.min(100, value + uncertainty * 2),
          lowerBound: Math.max(0, value - uncertainty * 2),
          target: 95,
        });
      }
      return data;
    };

    const sampleMetrics: QualityMetric[] = [
      {
        id: 'yield',
        name: 'First Pass Yield',
        unit: '%',
        currentValue: 96.2,
        predictedValue: 97.1,
        target: 95,
        trend: 'improving',
        confidence: 89,
        riskLevel: 'low',
        historicalData: generateData(94, 3, 0.15, 14),
        forecastData: generateForecast(96.2, 0.1, 7),
      },
      {
        id: 'defect',
        name: 'Defect Rate',
        unit: '%',
        currentValue: 1.8,
        predictedValue: 2.3,
        target: 2,
        trend: 'declining',
        confidence: 82,
        riskLevel: 'medium',
        historicalData: generateData(1.5, 0.5, 0.02, 14),
        forecastData: generateForecast(1.8, 0.05, 7),
      },
      {
        id: 'cpk',
        name: 'Process Capability (Cpk)',
        unit: '',
        currentValue: 1.45,
        predictedValue: 1.42,
        target: 1.33,
        trend: 'stable',
        confidence: 91,
        riskLevel: 'low',
        historicalData: generateData(1.4, 0.1, 0.005, 14),
        forecastData: generateForecast(1.45, -0.003, 7),
      },
      {
        id: 'rework',
        name: 'Rework Rate',
        unit: '%',
        currentValue: 3.2,
        predictedValue: 3.8,
        target: 3,
        trend: 'declining',
        confidence: 76,
        riskLevel: 'high',
        historicalData: generateData(2.8, 0.8, 0.03, 14),
        forecastData: generateForecast(3.2, 0.08, 7),
      },
    ];

    setMetrics(sampleMetrics);
    setSelectedMetric(sampleMetrics[0]);
    setIsLoading(false);
  }, []);

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
      <div className="px-3 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <LineChart className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Predictive Quality Charts</h2>
              <p className="text-sm text-green-100">Quality trend forecasting with confidence intervals</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <select className="px-3 py-1.5 bg-white/10 border border-white/20 rounded-lg text-sm">
              <option value="7d">Last 7 days</option>
              <option value="14d">Last 14 days</option>
              <option value="30d">Last 30 days</option>
            </select>
            <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
              <Download className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Metric Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-3">
          {metrics.map(metric => (
            <MetricSummaryCard
              key={metric.id}
              metric={metric}
              onClick={() => {
                setSelectedMetric(metric);
                onMetricClick?.(metric);
              }}
            />
          ))}
        </div>

        {/* Main Chart */}
        {selectedMetric && (
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {selectedMetric.name} Trend & Forecast
                </h3>
                <p className="text-sm text-gray-500">
                  {productLine} | 14-day history + 7-day forecast
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">Confidence:</span>
                  <span className="font-medium text-indigo-600">{selectedMetric.confidence}%</span>
                </div>
                <div className={`flex items-center gap-1 ${riskConfig[selectedMetric.riskLevel].color}`}>
                  <AlertTriangle className="w-4 h-4" />
                  <span className="font-medium">{riskConfig[selectedMetric.riskLevel].label}</span>
                </div>
              </div>
            </div>

            <QualityTrendChart metric={selectedMetric} width={800} height={250} />

            {/* Forecast Summary */}
            <div className="mt-4 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Info className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Forecast Summary</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {selectedMetric.trend === 'improving' ? (
                      <>
                        <CheckCircle className="w-4 h-4 inline text-green-500 mr-1" />
                        {selectedMetric.name} is trending positively. Expected to reach {selectedMetric.predictedValue.toFixed(2)}{selectedMetric.unit} within 7 days.
                      </>
                    ) : selectedMetric.trend === 'declining' ? (
                      <>
                        <AlertTriangle className="w-4 h-4 inline text-red-500 mr-1" />
                        {selectedMetric.name} shows declining trend. May fall to {selectedMetric.predictedValue.toFixed(2)}{selectedMetric.unit} within 7 days. Intervention recommended.
                      </>
                    ) : (
                      <>
                        <Layers className="w-4 h-4 inline text-gray-400 mr-1" />
                        {selectedMetric.name} is stable. Expected to maintain around {selectedMetric.predictedValue.toFixed(2)}{selectedMetric.unit}.
                      </>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PredictiveQualityCharts;

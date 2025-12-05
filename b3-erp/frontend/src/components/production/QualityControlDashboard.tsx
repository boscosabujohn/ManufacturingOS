'use client';

import React, { useState, useMemo } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  ComposedChart,
  Area,
  Cell
} from 'recharts';
import {
  AlertTriangle,
  CheckCircle,
  XCircle,
  TrendingUp,
  TrendingDown,
  Activity,
  Target,
  BarChart3,
  PieChart,
  RefreshCw,
  Download,
  Filter,
  Calendar,
  Gauge,
  ShieldCheck,
  AlertCircle,
  Info
} from 'lucide-react';

// Types
interface SPCDataPoint {
  id: string;
  timestamp: Date;
  value: number;
  sampleNumber: number;
  outOfControl?: boolean;
  rule?: string;
}

interface DefectCategory {
  category: string;
  count: number;
  percentage: number;
  cumulative: number;
}

interface QualityMetric {
  id: string;
  name: string;
  value: number;
  target: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  status: 'good' | 'warning' | 'critical';
}

interface InspectionResult {
  id: string;
  partNumber: string;
  batchId: string;
  inspector: string;
  timestamp: Date;
  status: 'pass' | 'fail' | 'hold';
  defects: string[];
  measurements: { name: string; value: number; spec: { min: number; max: number } }[];
}

interface QualityControlDashboardProps {
  spcData?: SPCDataPoint[];
  defectData?: DefectCategory[];
  qualityMetrics?: QualityMetric[];
  inspectionResults?: InspectionResult[];
  productLine?: string;
  onRefresh?: () => void;
  onExport?: (type: 'spc' | 'pareto' | 'all') => void;
  refreshInterval?: number;
}

// SPC Control Limits Calculator
function calculateControlLimits(data: SPCDataPoint[]) {
  if (data.length === 0) return { mean: 0, ucl: 0, lcl: 0, sigma: 0 };

  const values = data.map(d => d.value);
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const variance = values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length;
  const sigma = Math.sqrt(variance);

  return {
    mean,
    ucl: mean + 3 * sigma, // Upper Control Limit (3-sigma)
    lcl: mean - 3 * sigma, // Lower Control Limit (3-sigma)
    sigma,
    usl: mean + 2 * sigma, // Upper Spec Limit (2-sigma warning)
    lsl: mean - 2 * sigma, // Lower Spec Limit (2-sigma warning)
  };
}

// Detect out-of-control points using Western Electric rules
function detectOutOfControl(data: SPCDataPoint[], limits: ReturnType<typeof calculateControlLimits>) {
  return data.map((point, index) => {
    const rules: string[] = [];

    // Rule 1: Point beyond 3 sigma
    if (point.value > limits.ucl || point.value < limits.lcl) {
      rules.push('Beyond 3σ');
    }

    // Rule 2: 2 of 3 consecutive points beyond 2 sigma
    if (index >= 2) {
      const recent3 = [data[index - 2], data[index - 1], data[index]];
      const beyond2Sigma = recent3.filter(p =>
        p.value > (limits.usl || limits.ucl) || p.value < (limits.lsl || limits.lcl)
      );
      if (beyond2Sigma.length >= 2) {
        rules.push('2 of 3 beyond 2σ');
      }
    }

    // Rule 3: 7 consecutive points on same side of mean
    if (index >= 6) {
      const recent7 = data.slice(index - 6, index + 1);
      const allAbove = recent7.every(p => p.value > limits.mean);
      const allBelow = recent7.every(p => p.value < limits.mean);
      if (allAbove || allBelow) {
        rules.push('7 consecutive same side');
      }
    }

    return {
      ...point,
      outOfControl: rules.length > 0,
      rule: rules.join(', ') || undefined
    };
  });
}

// Sample data generators
function generateSampleSPCData(): SPCDataPoint[] {
  const data: SPCDataPoint[] = [];
  const baseValue = 10;
  const sigma = 0.5;

  for (let i = 0; i < 50; i++) {
    // Introduce some variation and occasional outliers
    let value = baseValue + (Math.random() - 0.5) * sigma * 2;

    // Add some special cause variation for demonstration
    if (i === 15 || i === 35) value = baseValue + sigma * 3.5; // Out of control
    if (i >= 20 && i <= 27) value = baseValue + sigma * 0.8; // Trend

    data.push({
      id: `spc-${i}`,
      timestamp: new Date(Date.now() - (50 - i) * 3600000),
      value: Math.round(value * 1000) / 1000,
      sampleNumber: i + 1,
    });
  }

  return data;
}

function generateSampleDefectData(): DefectCategory[] {
  const defects = [
    { category: 'Surface Scratch', count: 45 },
    { category: 'Dimensional Error', count: 32 },
    { category: 'Color Mismatch', count: 28 },
    { category: 'Assembly Defect', count: 18 },
    { category: 'Missing Component', count: 12 },
    { category: 'Packaging Damage', count: 8 },
    { category: 'Label Error', count: 5 },
    { category: 'Other', count: 3 },
  ];

  const total = defects.reduce((a, b) => a + b.count, 0);
  let cumulative = 0;

  return defects.map(d => {
    cumulative += (d.count / total) * 100;
    return {
      ...d,
      percentage: Math.round((d.count / total) * 1000) / 10,
      cumulative: Math.round(cumulative * 10) / 10,
    };
  });
}

function generateSampleMetrics(): QualityMetric[] {
  return [
    { id: '1', name: 'First Pass Yield', value: 94.5, target: 95, unit: '%', trend: 'up', status: 'warning' },
    { id: '2', name: 'Defect Rate', value: 1.2, target: 1.5, unit: '%', trend: 'down', status: 'good' },
    { id: '3', name: 'Cpk Index', value: 1.45, target: 1.33, unit: '', trend: 'stable', status: 'good' },
    { id: '4', name: 'Scrap Rate', value: 2.8, target: 2.0, unit: '%', trend: 'up', status: 'critical' },
    { id: '5', name: 'Customer Returns', value: 0.3, target: 0.5, unit: '%', trend: 'down', status: 'good' },
    { id: '6', name: 'Inspection Pass Rate', value: 97.2, target: 98, unit: '%', trend: 'stable', status: 'warning' },
  ];
}

function generateSampleInspections(): InspectionResult[] {
  const statuses: ('pass' | 'fail' | 'hold')[] = ['pass', 'pass', 'pass', 'pass', 'fail', 'hold', 'pass', 'pass'];
  const defectTypes = ['Surface Scratch', 'Dimensional Error', 'Color Mismatch', 'Assembly Defect'];

  return Array.from({ length: 10 }, (_, i) => ({
    id: `insp-${i}`,
    partNumber: `PN-${1000 + i}`,
    batchId: `BATCH-${2024001 + Math.floor(i / 3)}`,
    inspector: ['John D.', 'Sarah M.', 'Mike R.'][i % 3],
    timestamp: new Date(Date.now() - i * 1800000),
    status: statuses[i % statuses.length],
    defects: statuses[i % statuses.length] === 'fail'
      ? [defectTypes[Math.floor(Math.random() * defectTypes.length)]]
      : [],
    measurements: [
      { name: 'Length', value: 100 + (Math.random() - 0.5) * 2, spec: { min: 99, max: 101 } },
      { name: 'Width', value: 50 + (Math.random() - 0.5) * 1, spec: { min: 49.5, max: 50.5 } },
      { name: 'Height', value: 25 + (Math.random() - 0.5) * 0.5, spec: { min: 24.75, max: 25.25 } },
    ],
  }));
}

/**
 * QualityControlDashboard - Comprehensive quality control visualization
 * Features SPC charts, Pareto analysis, quality metrics, and inspection tracking
 */
export function QualityControlDashboard({
  spcData: propSpcData,
  defectData: propDefectData,
  qualityMetrics: propQualityMetrics,
  inspectionResults: propInspectionResults,
  productLine = 'All Lines',
  onRefresh,
  onExport,
  refreshInterval = 30000,
}: QualityControlDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'spc' | 'pareto' | 'inspections'>('overview');
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  // Use sample data if not provided
  const spcData = propSpcData || generateSampleSPCData();
  const defectData = propDefectData || generateSampleDefectData();
  const qualityMetrics = propQualityMetrics || generateSampleMetrics();
  const inspectionResults = propInspectionResults || generateSampleInspections();

  // Calculate SPC control limits
  const controlLimits = useMemo(() => calculateControlLimits(spcData), [spcData]);

  // Detect out-of-control points
  const analyzedSpcData = useMemo(() =>
    detectOutOfControl(spcData, controlLimits), [spcData, controlLimits]
  );

  // Format SPC data for chart
  const spcChartData = useMemo(() =>
    analyzedSpcData.map(d => ({
      ...d,
      sample: d.sampleNumber,
      ucl: controlLimits.ucl,
      lcl: controlLimits.lcl,
      mean: controlLimits.mean,
      usl: controlLimits.usl,
      lsl: controlLimits.lsl,
    })), [analyzedSpcData, controlLimits]
  );

  // Out of control count
  const outOfControlCount = analyzedSpcData.filter(d => d.outOfControl).length;

  // Auto refresh effect
  React.useEffect(() => {
    if (!autoRefresh || !onRefresh) return;

    const interval = setInterval(() => {
      onRefresh();
      setLastRefresh(new Date());
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, onRefresh]);

  const handleRefresh = () => {
    onRefresh?.();
    setLastRefresh(new Date());
  };

  // Custom tooltip for SPC chart
  const SPCTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const point = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="font-semibold text-gray-900 dark:text-white">Sample #{label}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Value: <span className="font-medium">{point.value.toFixed(3)}</span>
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Mean: {controlLimits.mean.toFixed(3)}
          </p>
          {point.outOfControl && (
            <p className="text-sm text-red-600 dark:text-red-400 font-medium mt-1">
              Out of Control: {point.rule}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  // Custom tooltip for Pareto chart
  const ParetoTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="font-semibold text-gray-900 dark:text-white">{data.category}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Count: <span className="font-medium">{data.count}</span>
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Percentage: <span className="font-medium">{data.percentage}%</span>
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Cumulative: <span className="font-medium">{data.cumulative}%</span>
          </p>
        </div>
      );
    }
    return null;
  };

  // Pareto bar colors (gradient from red to yellow)
  const getParetoColor = (index: number, total: number) => {
    const hue = 0 + (index / total) * 60; // Red (0) to Yellow (60)
    return `hsl(${hue}, 70%, 50%)`;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-7 h-7 text-green-600" />
              Quality Control Dashboard
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {productLine} | Last updated: {lastRefresh.toLocaleTimeString()}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Time Range Selector */}
            <select
              value={selectedTimeRange}
              onChange={(e) => setSelectedTimeRange(e.target.value)}
              className="px-3 py-2 bg-gray-100 dark:bg-gray-700 border-0 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              <option value="1h">Last 1 Hour</option>
              <option value="8h">Last 8 Hours</option>
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
            </select>

            {/* Auto Refresh Toggle */}
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`p-2 rounded-lg transition-colors ${
                autoRefresh
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                  : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
              }`}
              title={autoRefresh ? 'Auto-refresh ON' : 'Auto-refresh OFF'}
            >
              <RefreshCw className={`w-5 h-5 ${autoRefresh ? 'animate-spin' : ''}`} style={{ animationDuration: '3s' }} />
            </button>

            {/* Manual Refresh */}
            <button
              onClick={handleRefresh}
              className="p-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              title="Refresh now"
            >
              <RefreshCw className="w-5 h-5" />
            </button>

            {/* Export */}
            <button
              onClick={() => onExport?.('all')}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span className="font-medium">Export</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mt-4 overflow-x-auto pb-1">
          {[
            { id: 'overview', label: 'Overview', icon: Gauge },
            { id: 'spc', label: 'SPC Charts', icon: Activity },
            { id: 'pareto', label: 'Pareto Analysis', icon: BarChart3 },
            { id: 'inspections', label: 'Inspections', icon: CheckCircle },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {qualityMetrics.map(metric => (
                <div
                  key={metric.id}
                  className={`bg-white dark:bg-gray-800 rounded-xl p-4 border-l-4 ${
                    metric.status === 'good' ? 'border-green-500' :
                    metric.status === 'warning' ? 'border-yellow-500' :
                    'border-red-500'
                  }`}
                >
                  <p className="text-sm text-gray-500 dark:text-gray-400">{metric.name}</p>
                  <div className="flex items-end gap-2 mt-1">
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                      {metric.value}{metric.unit}
                    </span>
                    {metric.trend === 'up' && <TrendingUp className="w-4 h-4 text-green-500" />}
                    {metric.trend === 'down' && <TrendingDown className="w-4 h-4 text-red-500" />}
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Target: {metric.target}{metric.unit}</p>
                </div>
              ))}
            </div>

            {/* Charts Row */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Mini SPC Chart */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <Activity className="w-5 h-5 text-blue-500" />
                    Process Control (SPC)
                  </h3>
                  {outOfControlCount > 0 && (
                    <span className="flex items-center gap-1 text-sm text-red-600 dark:text-red-400">
                      <AlertTriangle className="w-4 h-4" />
                      {outOfControlCount} out of control
                    </span>
                  )}
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={spcChartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                      <XAxis dataKey="sample" tick={{ fontSize: 12 }} />
                      <YAxis domain={['auto', 'auto']} tick={{ fontSize: 12 }} />
                      <Tooltip content={<SPCTooltip />} />
                      <ReferenceLine y={controlLimits.ucl} stroke="#ef4444" strokeDasharray="5 5" label={{ value: 'UCL', position: 'right', fontSize: 10 }} />
                      <ReferenceLine y={controlLimits.mean} stroke="#22c55e" strokeDasharray="3 3" label={{ value: 'Mean', position: 'right', fontSize: 10 }} />
                      <ReferenceLine y={controlLimits.lcl} stroke="#ef4444" strokeDasharray="5 5" label={{ value: 'LCL', position: 'right', fontSize: 10 }} />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        dot={({ cx, cy, payload }: any) => (
                          <circle
                            key={payload.id}
                            cx={cx}
                            cy={cy}
                            r={payload.outOfControl ? 6 : 3}
                            fill={payload.outOfControl ? '#ef4444' : '#3b82f6'}
                            stroke={payload.outOfControl ? '#ef4444' : '#3b82f6'}
                          />
                        )}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Mini Pareto Chart */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-orange-500" />
                    Defect Pareto
                  </h3>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Total: {defectData.reduce((a, b) => a + b.count, 0)} defects
                  </span>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={defectData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                      <XAxis dataKey="category" tick={{ fontSize: 10 }} angle={-45} textAnchor="end" height={80} />
                      <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
                      <YAxis yAxisId="right" orientation="right" domain={[0, 100]} tick={{ fontSize: 12 }} unit="%" />
                      <Tooltip content={<ParetoTooltip />} />
                      <Bar yAxisId="left" dataKey="count" radius={[4, 4, 0, 0]}>
                        {defectData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={getParetoColor(index, defectData.length)} />
                        ))}
                      </Bar>
                      <Line yAxisId="right" type="monotone" dataKey="cumulative" stroke="#f97316" strokeWidth={2} dot={{ fill: '#f97316', r: 4 }} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Recent Inspections */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                <CheckCircle className="w-5 h-5 text-green-500" />
                Recent Inspections
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-sm text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                      <th className="pb-3 font-medium">Part #</th>
                      <th className="pb-3 font-medium">Batch</th>
                      <th className="pb-3 font-medium">Status</th>
                      <th className="pb-3 font-medium">Inspector</th>
                      <th className="pb-3 font-medium">Time</th>
                      <th className="pb-3 font-medium">Defects</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inspectionResults.slice(0, 5).map(result => (
                      <tr key={result.id} className="border-b border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <td className="py-3 font-medium text-gray-900 dark:text-white">{result.partNumber}</td>
                        <td className="py-3 text-gray-600 dark:text-gray-400">{result.batchId}</td>
                        <td className="py-3">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                            result.status === 'pass' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                            result.status === 'fail' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                            'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                          }`}>
                            {result.status === 'pass' && <CheckCircle className="w-3 h-3" />}
                            {result.status === 'fail' && <XCircle className="w-3 h-3" />}
                            {result.status === 'hold' && <AlertCircle className="w-3 h-3" />}
                            {result.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-3 text-gray-600 dark:text-gray-400">{result.inspector}</td>
                        <td className="py-3 text-gray-600 dark:text-gray-400">{result.timestamp.toLocaleTimeString()}</td>
                        <td className="py-3 text-gray-600 dark:text-gray-400">
                          {result.defects.length > 0 ? result.defects.join(', ') : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* SPC Tab */}
        {activeTab === 'spc' && (
          <div className="space-y-6">
            {/* SPC Info Banner */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900 dark:text-blue-100">Statistical Process Control (SPC)</h4>
                <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                  Control limits are calculated using 3-sigma rules. Red points indicate out-of-control conditions
                  detected using Western Electric rules. Investigate and address root causes for any out-of-control points.
                </p>
              </div>
            </div>

            {/* Control Limits Card */}
            <div className="grid md:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">Upper Control Limit (UCL)</p>
                <p className="text-2xl font-bold text-red-600">{controlLimits.ucl.toFixed(3)}</p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">Process Mean</p>
                <p className="text-2xl font-bold text-green-600">{controlLimits.mean.toFixed(3)}</p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">Lower Control Limit (LCL)</p>
                <p className="text-2xl font-bold text-red-600">{controlLimits.lcl.toFixed(3)}</p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">Standard Deviation (σ)</p>
                <p className="text-2xl font-bold text-blue-600">{controlLimits.sigma.toFixed(4)}</p>
              </div>
            </div>

            {/* Full SPC Chart */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">X-bar Control Chart</h3>
                <div className="flex items-center gap-4 text-sm">
                  <span className="flex items-center gap-2">
                    <span className="w-3 h-3 bg-red-500 rounded-full" />
                    Out of Control ({outOfControlCount})
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="w-3 h-3 bg-blue-500 rounded-full" />
                    In Control
                  </span>
                </div>
              </div>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={spcChartData} margin={{ top: 20, right: 60, left: 20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                    <XAxis
                      dataKey="sample"
                      label={{ value: 'Sample Number', position: 'bottom', offset: -5 }}
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis
                      domain={['auto', 'auto']}
                      label={{ value: 'Measurement', angle: -90, position: 'left' }}
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip content={<SPCTooltip />} />

                    {/* Control Limit Lines */}
                    <ReferenceLine y={controlLimits.ucl} stroke="#ef4444" strokeWidth={2} strokeDasharray="8 4" />
                    <ReferenceLine y={controlLimits.usl || 0} stroke="#f97316" strokeWidth={1} strokeDasharray="4 4" />
                    <ReferenceLine y={controlLimits.mean} stroke="#22c55e" strokeWidth={2} />
                    <ReferenceLine y={controlLimits.lsl || 0} stroke="#f97316" strokeWidth={1} strokeDasharray="4 4" />
                    <ReferenceLine y={controlLimits.lcl} stroke="#ef4444" strokeWidth={2} strokeDasharray="8 4" />

                    {/* 2-sigma zones */}
                    <Area
                      type="monotone"
                      dataKey="usl"
                      fill="#fef3c7"
                      fillOpacity={0.3}
                      stroke="none"
                    />

                    {/* Data Line */}
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      dot={({ cx, cy, payload }: any) => (
                        <circle
                          key={payload.id}
                          cx={cx}
                          cy={cy}
                          r={payload.outOfControl ? 8 : 4}
                          fill={payload.outOfControl ? '#ef4444' : '#3b82f6'}
                          stroke={payload.outOfControl ? '#991b1b' : '#1d4ed8'}
                          strokeWidth={2}
                        />
                      )}
                      activeDot={{ r: 8, fill: '#3b82f6', stroke: '#1d4ed8', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Out of Control Points Table */}
            {outOfControlCount > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                  Out of Control Points
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-sm text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                        <th className="pb-3 font-medium">Sample #</th>
                        <th className="pb-3 font-medium">Value</th>
                        <th className="pb-3 font-medium">Deviation</th>
                        <th className="pb-3 font-medium">Rule Violated</th>
                        <th className="pb-3 font-medium">Timestamp</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analyzedSpcData.filter(d => d.outOfControl).map(point => (
                        <tr key={point.id} className="border-b border-gray-100 dark:border-gray-700/50">
                          <td className="py-3 font-medium text-gray-900 dark:text-white">#{point.sampleNumber}</td>
                          <td className="py-3 text-red-600 font-semibold">{point.value.toFixed(3)}</td>
                          <td className="py-3 text-gray-600 dark:text-gray-400">
                            {((point.value - controlLimits.mean) / controlLimits.sigma).toFixed(2)}σ
                          </td>
                          <td className="py-3">
                            <span className="px-2 py-1 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-full text-xs">
                              {point.rule}
                            </span>
                          </td>
                          <td className="py-3 text-gray-600 dark:text-gray-400">
                            {point.timestamp.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Pareto Tab */}
        {activeTab === 'pareto' && (
          <div className="space-y-6">
            {/* Pareto Info Banner */}
            <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl p-4 flex items-start gap-3">
              <Info className="w-5 h-5 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-orange-900 dark:text-orange-100">Pareto Principle (80/20 Rule)</h4>
                <p className="text-sm text-orange-700 dark:text-orange-300 mt-1">
                  Approximately 80% of defects come from 20% of causes. Focus improvement efforts on the
                  top categories to achieve the greatest impact on quality.
                </p>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Defects</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {defectData.reduce((a, b) => a + b.count, 0)}
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">Top 3 Categories</p>
                <p className="text-3xl font-bold text-orange-600">
                  {defectData.slice(0, 3).reduce((a, b) => a + b.count, 0)}
                </p>
                <p className="text-sm text-gray-400">
                  ({Math.round((defectData.slice(0, 3).reduce((a, b) => a + b.count, 0) / defectData.reduce((a, b) => a + b.count, 0)) * 100)}% of total)
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">Categories</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {defectData.length}
                </p>
              </div>
            </div>

            {/* Full Pareto Chart */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Defect Pareto Chart</h3>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={defectData} margin={{ top: 20, right: 60, left: 20, bottom: 80 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                    <XAxis
                      dataKey="category"
                      tick={{ fontSize: 12 }}
                      angle={-45}
                      textAnchor="end"
                      interval={0}
                    />
                    <YAxis
                      yAxisId="left"
                      label={{ value: 'Count', angle: -90, position: 'left' }}
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      domain={[0, 100]}
                      label={{ value: 'Cumulative %', angle: 90, position: 'right' }}
                      tick={{ fontSize: 12 }}
                      unit="%"
                    />
                    <Tooltip content={<ParetoTooltip />} />
                    <Legend />

                    {/* 80% Reference Line */}
                    <ReferenceLine yAxisId="right" y={80} stroke="#9333ea" strokeDasharray="5 5" label={{ value: '80%', position: 'right', fontSize: 12 }} />

                    <Bar yAxisId="left" dataKey="count" name="Defect Count" radius={[4, 4, 0, 0]}>
                      {defectData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={getParetoColor(index, defectData.length)} />
                      ))}
                    </Bar>
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="cumulative"
                      name="Cumulative %"
                      stroke="#f97316"
                      strokeWidth={3}
                      dot={{ fill: '#f97316', r: 5, strokeWidth: 2, stroke: '#fff' }}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Defect Details Table */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Defect Categories Breakdown</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-sm text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                      <th className="pb-3 font-medium">Rank</th>
                      <th className="pb-3 font-medium">Category</th>
                      <th className="pb-3 font-medium">Count</th>
                      <th className="pb-3 font-medium">Percentage</th>
                      <th className="pb-3 font-medium">Cumulative</th>
                      <th className="pb-3 font-medium">Progress</th>
                    </tr>
                  </thead>
                  <tbody>
                    {defectData.map((defect, index) => (
                      <tr key={defect.category} className="border-b border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <td className="py-3 font-medium text-gray-900 dark:text-white">#{index + 1}</td>
                        <td className="py-3 font-medium text-gray-900 dark:text-white">{defect.category}</td>
                        <td className="py-3 text-gray-600 dark:text-gray-400">{defect.count}</td>
                        <td className="py-3 text-gray-600 dark:text-gray-400">{defect.percentage}%</td>
                        <td className="py-3">
                          <span className={`font-medium ${defect.cumulative <= 80 ? 'text-orange-600' : 'text-gray-500'}`}>
                            {defect.cumulative}%
                          </span>
                        </td>
                        <td className="py-3 w-40">
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div
                              className="h-2 rounded-full"
                              style={{
                                width: `${defect.percentage}%`,
                                backgroundColor: getParetoColor(index, defectData.length)
                              }}
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Inspections Tab */}
        {activeTab === 'inspections' && (
          <div className="space-y-6">
            {/* Inspection Summary */}
            <div className="grid md:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border-l-4 border-green-500">
                <p className="text-sm text-gray-500 dark:text-gray-400">Passed</p>
                <p className="text-3xl font-bold text-green-600">
                  {inspectionResults.filter(r => r.status === 'pass').length}
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border-l-4 border-red-500">
                <p className="text-sm text-gray-500 dark:text-gray-400">Failed</p>
                <p className="text-3xl font-bold text-red-600">
                  {inspectionResults.filter(r => r.status === 'fail').length}
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border-l-4 border-yellow-500">
                <p className="text-sm text-gray-500 dark:text-gray-400">On Hold</p>
                <p className="text-3xl font-bold text-yellow-600">
                  {inspectionResults.filter(r => r.status === 'hold').length}
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border-l-4 border-blue-500">
                <p className="text-sm text-gray-500 dark:text-gray-400">Pass Rate</p>
                <p className="text-3xl font-bold text-blue-600">
                  {Math.round((inspectionResults.filter(r => r.status === 'pass').length / inspectionResults.length) * 100)}%
                </p>
              </div>
            </div>

            {/* Full Inspection Table */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">All Inspections</h3>
                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm">
                    <Filter className="w-4 h-4" />
                    Filter
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-sm text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                      <th className="pb-3 font-medium">Part Number</th>
                      <th className="pb-3 font-medium">Batch ID</th>
                      <th className="pb-3 font-medium">Status</th>
                      <th className="pb-3 font-medium">Inspector</th>
                      <th className="pb-3 font-medium">Time</th>
                      <th className="pb-3 font-medium">Measurements</th>
                      <th className="pb-3 font-medium">Defects</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inspectionResults.map(result => (
                      <tr key={result.id} className="border-b border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <td className="py-3 font-medium text-gray-900 dark:text-white">{result.partNumber}</td>
                        <td className="py-3 text-gray-600 dark:text-gray-400">{result.batchId}</td>
                        <td className="py-3">
                          <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold ${
                            result.status === 'pass' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                            result.status === 'fail' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                            'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                          }`}>
                            {result.status === 'pass' && <CheckCircle className="w-3.5 h-3.5" />}
                            {result.status === 'fail' && <XCircle className="w-3.5 h-3.5" />}
                            {result.status === 'hold' && <AlertCircle className="w-3.5 h-3.5" />}
                            {result.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-3 text-gray-600 dark:text-gray-400">{result.inspector}</td>
                        <td className="py-3 text-gray-600 dark:text-gray-400">
                          {result.timestamp.toLocaleString()}
                        </td>
                        <td className="py-3">
                          <div className="flex flex-wrap gap-1">
                            {result.measurements.map(m => {
                              const inSpec = m.value >= m.spec.min && m.value <= m.spec.max;
                              return (
                                <span
                                  key={m.name}
                                  className={`text-xs px-2 py-0.5 rounded ${
                                    inSpec
                                      ? 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                                      : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                  }`}
                                  title={`${m.name}: ${m.value.toFixed(2)} (${m.spec.min}-${m.spec.max})`}
                                >
                                  {m.name}: {m.value.toFixed(1)}
                                </span>
                              );
                            })}
                          </div>
                        </td>
                        <td className="py-3 text-gray-600 dark:text-gray-400">
                          {result.defects.length > 0 ? (
                            <span className="text-red-600 dark:text-red-400">{result.defects.join(', ')}</span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default QualityControlDashboard;

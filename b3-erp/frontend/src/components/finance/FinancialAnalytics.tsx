'use client';

import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area, ComposedChart, Scatter, ScatterChart,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Treemap
} from 'recharts';
import {
  ChartBarIcon, FunnelIcon, ArrowTrendingUpIcon, ArrowTrendingDownIcon,
  CurrencyDollarIcon, CalculatorIcon, PresentationChartLineIcon,
  MagnifyingGlassIcon, AdjustmentsHorizontalIcon, EyeIcon,
  DocumentArrowDownIcon, CalendarIcon, ClockIcon,
  ExclamationTriangleIcon, CheckCircleIcon, InformationCircleIcon
} from '@heroicons/react/24/outline';

interface AnalyticsMetric {
  id: string;
  name: string;
  value: number;
  previousValue: number;
  changePercent: number;
  trend: 'up' | 'down' | 'stable';
  format: 'currency' | 'percentage' | 'number';
  category: 'profitability' | 'liquidity' | 'efficiency' | 'leverage';
  description: string;
  formula?: string;
  benchmark?: number;
}

interface DrillDownData {
  level: number;
  category: string;
  items: DrillDownItem[];
  totalValue: number;
  filters: Record<string, any>;
}

interface DrillDownItem {
  id: string;
  name: string;
  value: number;
  percentage: number;
  children?: DrillDownItem[];
  metadata: Record<string, any>;
}

interface AnalyticsFilter {
  period: string;
  startDate: string;
  endDate: string;
  department?: string;
  costCenter?: string;
  currency: string;
  comparison: 'previous_period' | 'previous_year' | 'budget' | 'forecast';
}

interface Insight {
  id: string;
  type: 'trend' | 'anomaly' | 'opportunity' | 'risk';
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  impact: number;
  category: string;
  recommendations: string[];
  dataPoints: any[];
  generatedDate: string;
}

interface CustomReport {
  id: string;
  name: string;
  description: string;
  metrics: string[];
  visualizations: VisualizationConfig[];
  filters: AnalyticsFilter;
  schedule?: ReportSchedule;
  createdBy: string;
  createdDate: string;
  lastRun?: string;
}

interface VisualizationConfig {
  id: string;
  type: 'line' | 'bar' | 'pie' | 'area' | 'scatter' | 'radar' | 'treemap';
  title: string;
  xAxis: string;
  yAxis: string[];
  groupBy?: string;
  aggregation: 'sum' | 'avg' | 'count' | 'min' | 'max';
  size: 'small' | 'medium' | 'large';
}

interface ReportSchedule {
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  time: string;
  recipients: string[];
  format: 'pdf' | 'excel' | 'csv';
  isActive: boolean;
}

const FinancialAnalytics: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'metrics' | 'drill-down' | 'insights' | 'custom-reports'>('overview');
  const [selectedMetric, setSelectedMetric] = useState<AnalyticsMetric | null>(null);
  const [drillDownPath, setDrillDownPath] = useState<DrillDownData[]>([]);
  const [filters, setFilters] = useState<AnalyticsFilter>({
    period: 'current_year',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    currency: 'USD',
    comparison: 'previous_year'
  });
  const [showReportBuilder, setShowReportBuilder] = useState(false);

  // Mock analytics metrics
  const [analyticsMetrics] = useState<AnalyticsMetric[]>([
    {
      id: '1',
      name: 'Gross Profit Margin',
      value: 42.5,
      previousValue: 38.2,
      changePercent: 11.3,
      trend: 'up',
      format: 'percentage',
      category: 'profitability',
      description: 'Percentage of revenue remaining after deducting cost of goods sold',
      formula: '(Revenue - COGS) / Revenue * 100',
      benchmark: 40.0
    },
    {
      id: '2',
      name: 'Current Ratio',
      value: 2.1,
      previousValue: 1.8,
      changePercent: 16.7,
      trend: 'up',
      format: 'number',
      category: 'liquidity',
      description: 'Ability to pay short-term obligations with current assets',
      formula: 'Current Assets / Current Liabilities',
      benchmark: 2.0
    },
    {
      id: '3',
      name: 'Return on Assets (ROA)',
      value: 8.3,
      previousValue: 7.1,
      changePercent: 16.9,
      trend: 'up',
      format: 'percentage',
      category: 'efficiency',
      description: 'How efficiently company uses its assets to generate profit',
      formula: 'Net Income / Total Assets * 100',
      benchmark: 6.0
    },
    {
      id: '4',
      name: 'Debt-to-Equity Ratio',
      value: 0.45,
      previousValue: 0.52,
      changePercent: -13.5,
      trend: 'down',
      format: 'number',
      category: 'leverage',
      description: 'Financial leverage and capital structure analysis',
      formula: 'Total Debt / Shareholders Equity',
      benchmark: 0.5
    },
    {
      id: '5',
      name: 'EBITDA Margin',
      value: 18.7,
      previousValue: 16.2,
      changePercent: 15.4,
      trend: 'up',
      format: 'percentage',
      category: 'profitability',
      description: 'Operating profitability before interest, taxes, depreciation, and amortization',
      formula: 'EBITDA / Revenue * 100',
      benchmark: 15.0
    },
    {
      id: '6',
      name: 'Working Capital',
      value: 2500000,
      previousValue: 2100000,
      changePercent: 19.0,
      trend: 'up',
      format: 'currency',
      category: 'liquidity',
      description: 'Short-term financial health and operational efficiency',
      formula: 'Current Assets - Current Liabilities'
    }
  ]);

  // Mock insights
  const [insights] = useState<Insight[]>([
    {
      id: '1',
      type: 'opportunity',
      title: 'Cash Flow Optimization Opportunity',
      description: 'Accounts receivable collection period has increased by 15% compared to last quarter, indicating potential for cash flow improvement.',
      severity: 'medium',
      confidence: 85,
      impact: 78,
      category: 'Cash Management',
      recommendations: [
        'Implement stricter credit policies',
        'Offer early payment discounts',
        'Automate invoicing and follow-up processes'
      ],
      dataPoints: [],
      generatedDate: '2024-01-15T10:30:00Z'
    },
    {
      id: '2',
      type: 'trend',
      title: 'Improving Operating Efficiency',
      description: 'Operating expenses as a percentage of revenue have decreased by 8% over the past 6 months, showing improved operational efficiency.',
      severity: 'low',
      confidence: 92,
      impact: 65,
      category: 'Operations',
      recommendations: [
        'Continue current cost management initiatives',
        'Identify additional automation opportunities',
        'Benchmark against industry standards'
      ],
      dataPoints: [],
      generatedDate: '2024-01-14T14:20:00Z'
    },
    {
      id: '3',
      type: 'risk',
      title: 'Increasing Debt Service Coverage Risk',
      description: 'Debt service coverage ratio has declined to 1.8x, approaching the covenant threshold of 1.5x.',
      severity: 'high',
      confidence: 88,
      impact: 92,
      category: 'Financial Risk',
      recommendations: [
        'Review debt restructuring options',
        'Accelerate cash collection efforts',
        'Consider asset monetization strategies'
      ],
      dataPoints: [],
      generatedDate: '2024-01-13T09:15:00Z'
    }
  ]);

  // Mock drill-down data
  const generateDrillDownData = (metric: string, level: number = 0): DrillDownData => {
    const baseData: Record<string, DrillDownData> = {
      revenue: {
        level: 0,
        category: 'Revenue Analysis',
        totalValue: 12500000,
        filters: {},
        items: [
          {
            id: 'product_sales',
            name: 'Product Sales',
            value: 8500000,
            percentage: 68,
            metadata: { category: 'products' },
            children: [
              { id: 'product_a', name: 'Product A', value: 4250000, percentage: 50, metadata: {} },
              { id: 'product_b', name: 'Product B', value: 2975000, percentage: 35, metadata: {} },
              { id: 'product_c', name: 'Product C', value: 1275000, percentage: 15, metadata: {} }
            ]
          },
          {
            id: 'service_revenue',
            name: 'Service Revenue',
            value: 3000000,
            percentage: 24,
            metadata: { category: 'services' },
            children: [
              { id: 'consulting', name: 'Consulting', value: 1800000, percentage: 60, metadata: {} },
              { id: 'support', name: 'Support', value: 900000, percentage: 30, metadata: {} },
              { id: 'training', name: 'Training', value: 300000, percentage: 10, metadata: {} }
            ]
          },
          {
            id: 'other_revenue',
            name: 'Other Revenue',
            value: 1000000,
            percentage: 8,
            metadata: { category: 'other' }
          }
        ]
      }
    };

    return baseData[metric] || baseData.revenue;
  };

  // Chart data
  const monthlyTrends = [
    { month: 'Jan', revenue: 1200000, expenses: 850000, profit: 350000, margin: 29.2 },
    { month: 'Feb', revenue: 1350000, expenses: 920000, profit: 430000, margin: 31.9 },
    { month: 'Mar', revenue: 1180000, expenses: 880000, profit: 300000, margin: 25.4 },
    { month: 'Apr', revenue: 1420000, expenses: 960000, profit: 460000, margin: 32.4 },
    { month: 'May', revenue: 1380000, expenses: 940000, profit: 440000, margin: 31.9 },
    { month: 'Jun', revenue: 1500000, expenses: 1020000, profit: 480000, margin: 32.0 }
  ];

  const departmentAnalysis = [
    { department: 'Sales', revenue: 4500000, expenses: 2800000, profit: 1700000 },
    { department: 'Operations', revenue: 3200000, expenses: 2400000, profit: 800000 },
    { department: 'R&D', revenue: 2500000, expenses: 2100000, profit: 400000 },
    { department: 'Marketing', revenue: 1800000, expenses: 1400000, profit: 400000 },
    { department: 'Admin', revenue: 500000, expenses: 800000, profit: -300000 }
  ];

  const cashFlowAnalysis = [
    { quarter: 'Q1', operating: 850000, investing: -320000, financing: -180000, net: 350000 },
    { quarter: 'Q2', operating: 920000, investing: -280000, financing: -200000, net: 440000 },
    { quarter: 'Q3', operating: 780000, investing: -450000, financing: 150000, net: 480000 },
    { quarter: 'Q4', operating: 1100000, investing: -380000, financing: -220000, net: 500000 }
  ];

  const profitabilityMetrics = [
    { metric: 'Gross Margin', current: 42.5, benchmark: 40.0, target: 45.0 },
    { metric: 'Operating Margin', current: 18.7, benchmark: 15.0, target: 20.0 },
    { metric: 'Net Margin', current: 12.3, benchmark: 10.0, target: 15.0 },
    { metric: 'EBITDA Margin', current: 22.1, benchmark: 18.0, target: 25.0 },
    { metric: 'ROA', current: 8.3, benchmark: 6.0, target: 10.0 },
    { metric: 'ROE', current: 15.2, benchmark: 12.0, target: 18.0 }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const formatNumber = (value: number) => {
    return value.toFixed(2);
  };

  const formatMetricValue = (metric: AnalyticsMetric) => {
    switch (metric.format) {
      case 'currency':
        return formatCurrency(metric.value);
      case 'percentage':
        return formatPercentage(metric.value);
      case 'number':
        return formatNumber(metric.value);
      default:
        return metric.value.toString();
    }
  };

  const getTrendIcon = (trend: string, changePercent: number) => {
    if (changePercent > 0) {
      return <ArrowTrendingUpIcon className="w-4 h-4 text-green-600" />;
    } else if (changePercent < 0) {
      return <ArrowTrendingDownIcon className="w-4 h-4 text-red-600" />;
    }
    return <div className="w-4 h-4" />;
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'opportunity':
        return <CheckCircleIcon className="w-5 h-5 text-green-600" />;
      case 'risk':
        return <ExclamationTriangleIcon className="w-5 h-5 text-red-600" />;
      case 'trend':
        return <ArrowTrendingUpIcon className="w-5 h-5 text-blue-600" />;
      case 'anomaly':
        return <InformationCircleIcon className="w-5 h-5 text-orange-600" />;
      default:
        return <InformationCircleIcon className="w-5 h-5 text-gray-600" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Key Metrics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {analyticsMetrics.slice(0, 6).map((metric) => (
          <div key={metric.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">{metric.name}</h3>
              {getTrendIcon(metric.trend, metric.changePercent)}
            </div>
            <div className="flex items-baseline">
              <p className="text-2xl font-semibold text-gray-900">
                {formatMetricValue(metric)}
              </p>
              {metric.benchmark && (
                <span className="ml-2 text-sm text-gray-500">
                  vs {formatMetricValue({ ...metric, value: metric.benchmark })} target
                </span>
              )}
            </div>
            <div className="mt-2 flex items-center">
              <span className={`text-sm font-medium ${
                metric.changePercent > 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {metric.changePercent > 0 ? '+' : ''}{metric.changePercent.toFixed(1)}%
              </span>
              <span className="text-sm text-gray-500 ml-1">vs previous period</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue & Profitability Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={monthlyTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip
                formatter={(value, name) => [
                  name === 'margin' ? `${value}%` : formatCurrency(Number(value)),
                  name
                ]}
              />
              <Legend />
              <Bar yAxisId="left" dataKey="revenue" fill="#3B82F6" name="Revenue" />
              <Bar yAxisId="left" dataKey="expenses" fill="#EF4444" name="Expenses" />
              <Line yAxisId="right" type="monotone" dataKey="margin" stroke="#10B981" strokeWidth={3} name="Profit Margin %" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Department Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={departmentAnalysis} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="department" type="category" width={80} />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              <Legend />
              <Bar dataKey="revenue" fill="#3B82F6" name="Revenue" />
              <Bar dataKey="profit" fill="#10B981" name="Profit" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Cash Flow Analysis</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={cashFlowAnalysis}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="quarter" />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              <Legend />
              <Area type="monotone" dataKey="operating" stackId="1" stroke="#10B981" fill="#10B981" name="Operating" />
              <Area type="monotone" dataKey="investing" stackId="1" stroke="#EF4444" fill="#EF4444" name="Investing" />
              <Area type="monotone" dataKey="financing" stackId="1" stroke="#F59E0B" fill="#F59E0B" name="Financing" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Profitability Metrics vs Benchmarks</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={profitabilityMetrics}>
              <PolarGrid />
              <PolarAngleAxis dataKey="metric" />
              <PolarRadiusAxis angle={30} domain={[0, 30]} />
              <Radar name="Current" dataKey="current" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
              <Radar name="Benchmark" dataKey="benchmark" stroke="#10B981" fill="#10B981" fillOpacity={0.6} />
              <Radar name="Target" dataKey="target" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.6} />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  const renderMetrics = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Financial Metrics Analysis</h3>
        <div className="flex space-x-2">
          <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
            <option value="all">All Categories</option>
            <option value="profitability">Profitability</option>
            <option value="liquidity">Liquidity</option>
            <option value="efficiency">Efficiency</option>
            <option value="leverage">Leverage</option>
          </select>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm">
            Export Metrics
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {analyticsMetrics.map((metric) => (
          <div key={metric.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">{metric.name}</h4>
                <p className="text-sm text-gray-600 mt-1">{metric.description}</p>
              </div>
              <button
                onClick={() => setSelectedMetric(metric)}
                className="text-gray-600 hover:text-blue-600"
              >
                <EyeIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Current Value:</span>
                <span className="text-lg font-semibold text-gray-900">
                  {formatMetricValue(metric)}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Previous Period:</span>
                <span className="text-sm text-gray-900">
                  {formatMetricValue({ ...metric, value: metric.previousValue })}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Change:</span>
                <div className="flex items-center">
                  {getTrendIcon(metric.trend, metric.changePercent)}
                  <span className={`text-sm font-medium ml-1 ${
                    metric.changePercent > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {metric.changePercent > 0 ? '+' : ''}{metric.changePercent.toFixed(1)}%
                  </span>
                </div>
              </div>

              {metric.benchmark && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Benchmark:</span>
                  <span className="text-sm text-gray-900">
                    {formatMetricValue({ ...metric, value: metric.benchmark })}
                  </span>
                </div>
              )}

              <div className="pt-2 border-t border-gray-200">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  metric.category === 'profitability' ? 'bg-green-100 text-green-800' :
                  metric.category === 'liquidity' ? 'bg-blue-100 text-blue-800' :
                  metric.category === 'efficiency' ? 'bg-purple-100 text-purple-800' :
                  'bg-orange-100 text-orange-800'
                }`}>
                  {metric.category.charAt(0).toUpperCase() + metric.category.slice(1)}
                </span>
              </div>

              {metric.formula && (
                <div className="pt-2">
                  <p className="text-xs text-gray-500">Formula: {metric.formula}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderDrillDown = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Interactive Drill-Down Analysis</h3>
        <button
          onClick={() => setDrillDownPath([])}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          Reset View
        </button>
      </div>

      {/* Breadcrumb */}
      {drillDownPath.length > 0 && (
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <span>Path:</span>
          {drillDownPath.map((level, index) => (
            <React.Fragment key={index}>
              <button
                onClick={() => setDrillDownPath(drillDownPath.slice(0, index + 1))}
                className="text-blue-600 hover:text-blue-800"
              >
                {level.category}
              </button>
              {index < drillDownPath.length - 1 && <span>{'>'}</span>}
            </React.Fragment>
          ))}
        </div>
      )}

      {/* Drill-down interface */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="mb-4">
          <h4 className="font-medium text-gray-900">
            {drillDownPath.length > 0 ? drillDownPath[drillDownPath.length - 1].category : 'Revenue Breakdown'}
          </h4>
          <p className="text-sm text-gray-600">
            Click on any segment to drill down for more details
          </p>
        </div>

        {/* Demo drill-down chart */}
        <ResponsiveContainer width="100%" height={400}>
          <Treemap
            data={generateDrillDownData('revenue').items}
            dataKey="value"
            aspectRatio={4/3}
            stroke="#fff"
            fill="#3B82F6"
          />
        </ResponsiveContainer>

        {/* Data table */}
        <div className="mt-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Percentage
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {generateDrillDownData('revenue').items.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(item.value)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.percentage}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {item.children && (
                        <button className="text-blue-600 hover:text-blue-800">
                          Drill Down
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );

  const renderInsights = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">AI-Powered Financial Insights</h3>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm">
          Generate New Insights
        </button>
      </div>

      <div className="space-y-4">
        {insights.map((insight) => (
          <div key={insight.id} className={`border rounded-lg p-6 ${getSeverityColor(insight.severity)}`}>
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3 flex-1">
                {getInsightIcon(insight.type)}
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h4 className="font-semibold text-gray-900">{insight.title}</h4>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      insight.type === 'opportunity' ? 'bg-green-100 text-green-800' :
                      insight.type === 'risk' ? 'bg-red-100 text-red-800' :
                      insight.type === 'trend' ? 'bg-blue-100 text-blue-800' :
                      'bg-orange-100 text-orange-800'
                    }`}>
                      {insight.type.charAt(0).toUpperCase() + insight.type.slice(1)}
                    </span>
                  </div>

                  <p className="text-gray-700 mb-3">{insight.description}</p>

                  <div className="grid grid-cols-3 gap-4 mb-3 text-sm">
                    <div>
                      <span className="text-gray-600">Confidence: </span>
                      <span className="font-medium">{insight.confidence}%</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Impact: </span>
                      <span className="font-medium">{insight.impact}%</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Category: </span>
                      <span className="font-medium">{insight.category}</span>
                    </div>
                  </div>

                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">Recommendations:</h5>
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                      {insight.recommendations.map((rec, index) => (
                        <li key={index}>{rec}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex space-x-2">
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  View Details
                </button>
                <button className="text-green-600 hover:text-green-800 text-sm font-medium">
                  Take Action
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCustomReports = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Custom Analytics Reports</h3>
        <button
          onClick={() => setShowReportBuilder(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
        >
          <PresentationChartLineIcon className="w-5 h-5 mr-2" />
          Build Report
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {[
          { name: 'Executive Dashboard', metrics: 8, visualizations: 4, schedule: 'Daily', lastRun: '2024-01-15' },
          { name: 'Department Performance', metrics: 12, visualizations: 6, schedule: 'Weekly', lastRun: '2024-01-10' },
          { name: 'Cash Flow Analysis', metrics: 6, visualizations: 3, schedule: 'Monthly', lastRun: '2024-01-01' },
          { name: 'Profitability Deep Dive', metrics: 15, visualizations: 8, schedule: 'Quarterly', lastRun: '2024-01-01' }
        ].map((report, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="font-semibold text-gray-900">{report.name}</h4>
                <p className="text-sm text-gray-600 mt-1">Custom analytics report</p>
              </div>
              <button className="text-gray-600 hover:text-blue-600">
                <EyeIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Metrics:</span>
                <span className="font-medium text-gray-900">{report.metrics}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Visualizations:</span>
                <span className="font-medium text-gray-900">{report.visualizations}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Schedule:</span>
                <span className="font-medium text-gray-900">{report.schedule}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Last Run:</span>
                <span className="text-gray-900">{report.lastRun}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200 flex space-x-2">
              <button className="flex-1 bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700">
                Run Report
              </button>
              <button className="px-3 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50">
                Edit
              </button>
              <button className="px-3 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50">
                <DocumentArrowDownIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Financial Analytics</h1>
        <p className="text-gray-600 mt-2">Advanced financial analysis with interactive drill-down capabilities and AI insights</p>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Period</label>
            <select
              value={filters.period}
              onChange={(e) => setFilters(prev => ({ ...prev, period: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            >
              <option value="current_year">Current Year</option>
              <option value="last_year">Last Year</option>
              <option value="ytd">Year to Date</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
            <select
              value={filters.currency}
              onChange={(e) => setFilters(prev => ({ ...prev, currency: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Compare To</label>
            <select
              value={filters.comparison}
              onChange={(e) => setFilters(prev => ({ ...prev, comparison: e.target.value as any }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            >
              <option value="previous_period">Previous Period</option>
              <option value="previous_year">Previous Year</option>
              <option value="budget">Budget</option>
              <option value="forecast">Forecast</option>
            </select>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {[
            { key: 'overview', label: 'Overview', icon: ChartBarIcon },
            { key: 'metrics', label: 'Key Metrics', icon: CalculatorIcon },
            { key: 'drill-down', label: 'Drill-Down', icon: FunnelIcon },
            { key: 'insights', label: 'AI Insights', icon: ArrowTrendingUpIcon },
            { key: 'custom-reports', label: 'Custom Reports', icon: PresentationChartLineIcon }
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center ${
                activeTab === key
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Icon className="w-5 h-5 mr-2" />
              {label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && renderOverview()}
      {activeTab === 'metrics' && renderMetrics()}
      {activeTab === 'drill-down' && renderDrillDown()}
      {activeTab === 'insights' && renderInsights()}
      {activeTab === 'custom-reports' && renderCustomReports()}
    </div>
  );
};

export default FinancialAnalytics;
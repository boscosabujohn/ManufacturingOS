'use client';

import { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Download,
  Calendar,
  DollarSign,
  FileText,
  PieChart,
  Activity,
  Target,
  AlertCircle,
  CheckCircle,
  ArrowRight,
  RefreshCw,
  Filter,
  Eye
} from 'lucide-react';

interface Report {
  id: string;
  name: string;
  category: 'financial' | 'operational' | 'compliance' | 'analysis';
  description: string;
  frequency: string;
  lastGenerated: string;
  status: 'ready' | 'generating' | 'scheduled';
  icon: React.ReactNode;
  color: string;
}

interface KPI {
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  target?: string;
  status: 'good' | 'warning' | 'critical';
}

export default function FinanceReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('current-month');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isGenerating, setIsGenerating] = useState(false);

  // Financial KPIs
  const kpis: KPI[] = [
    {
      label: 'Revenue',
      value: '₹156.8L',
      change: '+18.7%',
      trend: 'up',
      target: '₹150L',
      status: 'good'
    },
    {
      label: 'Gross Margin',
      value: '42.5%',
      change: '+2.3%',
      trend: 'up',
      target: '40%',
      status: 'good'
    },
    {
      label: 'Operating Expense',
      value: '₹52.3L',
      change: '-4.2%',
      trend: 'down',
      target: '₹55L',
      status: 'good'
    },
    {
      label: 'Net Profit',
      value: '₹14.2L',
      change: '+15.3%',
      trend: 'up',
      target: '₹12L',
      status: 'good'
    },
    {
      label: 'Working Capital',
      value: '₹45.7L',
      change: '-8.5%',
      trend: 'down',
      target: '₹50L',
      status: 'warning'
    },
    {
      label: 'DSO (Days)',
      value: '42',
      change: '+5 days',
      trend: 'up',
      target: '35 days',
      status: 'warning'
    },
    {
      label: 'DPO (Days)',
      value: '38',
      change: '+3 days',
      trend: 'up',
      target: '40 days',
      status: 'good'
    },
    {
      label: 'Current Ratio',
      value: '1.85',
      change: '-0.15',
      trend: 'down',
      target: '2.0',
      status: 'warning'
    }
  ];

  // Available Reports
  const reports: Report[] = [
    {
      id: '1',
      name: 'Profit & Loss Statement',
      category: 'financial',
      description: 'Comprehensive income statement with revenue, expenses, and net profit',
      frequency: 'Monthly',
      lastGenerated: '2 hours ago',
      status: 'ready',
      icon: <TrendingUp className="h-6 w-6" />,
      color: 'from-green-500 to-green-600'
    },
    {
      id: '2',
      name: 'Balance Sheet',
      category: 'financial',
      description: 'Assets, liabilities, and equity snapshot at period end',
      frequency: 'Monthly',
      lastGenerated: '3 hours ago',
      status: 'ready',
      icon: <FileText className="h-6 w-6" />,
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: '3',
      name: 'Cash Flow Statement',
      category: 'financial',
      description: 'Operating, investing, and financing cash activities',
      frequency: 'Monthly',
      lastGenerated: '5 hours ago',
      status: 'ready',
      icon: <DollarSign className="h-6 w-6" />,
      color: 'from-purple-500 to-purple-600'
    },
    {
      id: '4',
      name: 'AR Aging Summary',
      category: 'operational',
      description: 'Customer receivables aging by bucket with collection metrics',
      frequency: 'Weekly',
      lastGenerated: '1 hour ago',
      status: 'ready',
      icon: <Calendar className="h-6 w-6" />,
      color: 'from-orange-500 to-orange-600'
    },
    {
      id: '5',
      name: 'AP Aging Summary',
      category: 'operational',
      description: 'Vendor payables aging with payment priorities',
      frequency: 'Weekly',
      lastGenerated: '1 hour ago',
      status: 'ready',
      icon: <Calendar className="h-6 w-6" />,
      color: 'from-red-500 to-red-600'
    },
    {
      id: '6',
      name: 'Forex Gain/Loss Report',
      category: 'operational',
      description: 'Realized and unrealized forex gains and losses',
      frequency: 'Monthly',
      lastGenerated: '4 hours ago',
      status: 'ready',
      icon: <RefreshCw className="h-6 w-6" />,
      color: 'from-indigo-500 to-indigo-600'
    },
    {
      id: '7',
      name: 'Financial Ratios Analysis',
      category: 'analysis',
      description: 'Liquidity, profitability, and efficiency ratios',
      frequency: 'Monthly',
      lastGenerated: '6 hours ago',
      status: 'ready',
      icon: <Activity className="h-6 w-6" />,
      color: 'from-teal-500 to-teal-600'
    },
    {
      id: '8',
      name: 'Budget vs Actual',
      category: 'analysis',
      description: 'Variance analysis between budgeted and actual performance',
      frequency: 'Monthly',
      lastGenerated: 'Scheduled',
      status: 'scheduled',
      icon: <Target className="h-6 w-6" />,
      color: 'from-yellow-500 to-yellow-600'
    },
    {
      id: '9',
      name: 'GST Returns Summary',
      category: 'compliance',
      description: 'GST input, output, and liability summary',
      frequency: 'Monthly',
      lastGenerated: '12 hours ago',
      status: 'ready',
      icon: <FileText className="h-6 w-6" />,
      color: 'from-pink-500 to-pink-600'
    },
    {
      id: '10',
      name: 'TDS Compliance Report',
      category: 'compliance',
      description: 'TDS deducted, deposited, and pending reconciliation',
      frequency: 'Quarterly',
      lastGenerated: '1 day ago',
      status: 'ready',
      icon: <CheckCircle className="h-6 w-6" />,
      color: 'from-cyan-500 to-cyan-600'
    },
    {
      id: '11',
      name: 'Revenue Trend Analysis',
      category: 'analysis',
      description: 'Month-over-month and year-over-year revenue trends',
      frequency: 'Monthly',
      lastGenerated: '8 hours ago',
      status: 'ready',
      icon: <BarChart3 className="h-6 w-6" />,
      color: 'from-emerald-500 to-emerald-600'
    },
    {
      id: '12',
      name: 'Expense Analysis',
      category: 'analysis',
      description: 'Detailed breakdown of expenses by category and department',
      frequency: 'Monthly',
      lastGenerated: 'Generating...',
      status: 'generating',
      icon: <PieChart className="h-6 w-6" />,
      color: 'from-amber-500 to-amber-600'
    }
  ];

  const filteredReports = selectedCategory === 'all'
    ? reports
    : reports.filter(r => r.category === selectedCategory);

  const handleGenerateReport = (reportId: string, reportName: string) => {
    setIsGenerating(true);
    setTimeout(() => {
      alert(`Report Generation Started!\n\nReport: ${reportName}\nPeriod: ${selectedPeriod}\n\nThe report will be generated and available for download in a few moments. You'll receive a notification once it's ready.`);
      setIsGenerating(false);
    }, 1000);
  };

  const handleDownloadReport = (reportId: string, reportName: string) => {
    alert(`Downloading Report\n\n${reportName}\nFormat: PDF\nPeriod: ${selectedPeriod}\n\nThe report will be downloaded to your device.`);
  };

  const handleViewReport = (reportId: string, reportName: string) => {
    alert(`View Report\n\n${reportName}\n\nThis will open the detailed report viewer with interactive charts and drill-down capabilities.`);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ready':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            Ready
          </span>
        );
      case 'generating':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 flex items-center gap-1">
            <RefreshCw className="h-3 w-3 animate-spin" />
            Generating
          </span>
        );
      case 'scheduled':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800 flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            Scheduled
          </span>
        );
      default:
        return null;
    }
  };

  const getKPIStatusColor = (status: string) => {
    switch (status) {
      case 'good':
        return 'border-green-200 bg-green-50';
      case 'warning':
        return 'border-yellow-200 bg-yellow-50';
      case 'critical':
        return 'border-red-200 bg-red-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  return (
    <div className="p-6 ">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
              <div className="bg-gradient-to-br from-purple-500 to-indigo-600 p-3 rounded-xl">
                <BarChart3 className="h-8 w-8 text-white" />
              </div>
              Reports & Analytics
            </h1>
            <p className="text-gray-600 mt-2 text-lg">
              Financial reports, insights, and performance metrics • FY 2025-26
            </p>
          </div>
          <div className="flex gap-3">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
            >
              <option value="today">Today</option>
              <option value="current-week">This Week</option>
              <option value="current-month">This Month</option>
              <option value="current-quarter">This Quarter</option>
              <option value="current-year">This Year</option>
              <option value="last-month">Last Month</option>
              <option value="last-quarter">Last Quarter</option>
              <option value="last-year">Last Year</option>
            </select>
            <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2 font-medium transition-colors">
              <Download className="h-4 w-4" />
              Export All
            </button>
          </div>
        </div>
      </div>

      {/* Financial KPIs */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
          <Target className="h-6 w-6 text-purple-600" />
          Key Performance Indicators
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
          {kpis.map((kpi, index) => (
            <div
              key={index}
              className={`rounded-xl shadow-sm border-2 p-5 ${getKPIStatusColor(kpi.status)}`}
            >
              <div className="flex items-start justify-between mb-2">
                <p className="text-sm font-medium text-gray-700">{kpi.label}</p>
                {kpi.trend === 'up' ? (
                  <TrendingUp className={`h-5 w-5 ${kpi.status === 'good' ? 'text-green-600' : 'text-red-600'}`} />
                ) : kpi.trend === 'down' ? (
                  <TrendingDown className={`h-5 w-5 ${kpi.status === 'good' ? 'text-green-600' : 'text-orange-600'}`} />
                ) : (
                  <Activity className="h-5 w-5 text-gray-600" />
                )}
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-1">{kpi.value}</p>
              <div className="flex items-center justify-between">
                <span className={`text-sm font-semibold ${
                  kpi.status === 'good' ? 'text-green-700' :
                  kpi.status === 'warning' ? 'text-orange-700' : 'text-red-700'
                }`}>
                  {kpi.change}
                </span>
                {kpi.target && (
                  <span className="text-xs text-gray-600">Target: {kpi.target}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Report Categories Filter */}
      <div className="mb-3">
        <div className="flex items-center gap-3 bg-white rounded-lg shadow-sm border border-gray-200 p-2">
          <Filter className="h-5 w-5 text-gray-600 ml-2" />
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-md font-medium text-sm transition-colors ${
              selectedCategory === 'all'
                ? 'bg-purple-600 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            All Reports ({reports.length})
          </button>
          <button
            onClick={() => setSelectedCategory('financial')}
            className={`px-4 py-2 rounded-md font-medium text-sm transition-colors ${
              selectedCategory === 'financial'
                ? 'bg-purple-600 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Financial ({reports.filter(r => r.category === 'financial').length})
          </button>
          <button
            onClick={() => setSelectedCategory('operational')}
            className={`px-4 py-2 rounded-md font-medium text-sm transition-colors ${
              selectedCategory === 'operational'
                ? 'bg-purple-600 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Operational ({reports.filter(r => r.category === 'operational').length})
          </button>
          <button
            onClick={() => setSelectedCategory('analysis')}
            className={`px-4 py-2 rounded-md font-medium text-sm transition-colors ${
              selectedCategory === 'analysis'
                ? 'bg-purple-600 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Analysis ({reports.filter(r => r.category === 'analysis').length})
          </button>
          <button
            onClick={() => setSelectedCategory('compliance')}
            className={`px-4 py-2 rounded-md font-medium text-sm transition-colors ${
              selectedCategory === 'compliance'
                ? 'bg-purple-600 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Compliance ({reports.filter(r => r.category === 'compliance').length})
          </button>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
          <FileText className="h-6 w-6 text-purple-600" />
          Available Reports
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredReports.map((report) => (
            <div
              key={report.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between mb-2">
                <div className={`bg-gradient-to-br ${report.color} p-3 rounded-lg text-white`}>
                  {report.icon}
                </div>
                {getStatusBadge(report.status)}
              </div>

              <h3 className="text-lg font-bold text-gray-900 mb-2">{report.name}</h3>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{report.description}</p>

              <div className="flex items-center justify-between text-xs text-gray-500 mb-2 pb-4 border-b border-gray-200">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {report.frequency}
                </span>
                <span>Updated: {report.lastGenerated}</span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleViewReport(report.id, report.name)}
                  disabled={report.status === 'generating'}
                  className="flex-1 px-3 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 text-sm font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Eye className="h-4 w-4" />
                  View
                </button>
                <button
                  onClick={() => handleDownloadReport(report.id, report.name)}
                  disabled={report.status !== 'ready'}
                  className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Download className="h-4 w-4" />
                  Download
                </button>
                {report.status !== 'generating' && (
                  <button
                    onClick={() => handleGenerateReport(report.id, report.name)}
                    disabled={isGenerating}
                    className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <RefreshCw className={`h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Insights */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-200 p-3">
        <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
          <AlertCircle className="h-6 w-6 text-purple-600" />
          Quick Insights
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="bg-white rounded-lg p-5 border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              Positive Trends
            </h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                <span>Revenue increased by 18.7% compared to last month</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                <span>Operating expenses reduced by 4.2%</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                <span>Net profit margin improved to 9.1%</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                <span>Gross margin up by 2.3 percentage points</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-lg p-5 border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-orange-600" />
              Areas of Concern
            </h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-orange-600 mt-0.5" />
                <span>DSO increased to 42 days (target: 35 days)</span>
              </li>
              <li className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-orange-600 mt-0.5" />
                <span>Working capital decreased by 8.5%</span>
              </li>
              <li className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-orange-600 mt-0.5" />
                <span>Current ratio below target at 1.85</span>
              </li>
              <li className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-orange-600 mt-0.5" />
                <span>5 vendor bills overdue by more than 90 days</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-6 bg-white rounded-lg p-5 border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-600" />
            Recommended Actions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <div className="flex items-start gap-3">
              <div className="bg-blue-100 rounded-full p-2">
                <ArrowRight className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900 text-sm">Accelerate Collections</p>
                <p className="text-xs text-gray-600 mt-1">Focus on 30+ day overdue invoices to improve DSO</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-green-100 rounded-full p-2">
                <ArrowRight className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900 text-sm">Optimize Working Capital</p>
                <p className="text-xs text-gray-600 mt-1">Review inventory levels and payment terms</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-orange-100 rounded-full p-2">
                <ArrowRight className="h-4 w-4 text-orange-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900 text-sm">Address Overdue Payables</p>
                <p className="text-xs text-gray-600 mt-1">Clear 90+ day overdue vendor bills promptly</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

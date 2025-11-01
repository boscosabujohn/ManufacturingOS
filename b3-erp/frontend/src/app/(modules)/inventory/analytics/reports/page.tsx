'use client';

import React, { useState } from 'react';
import {
  FileText,
  BarChart3,
  TrendingUp,
  Package,
  DollarSign,
  Calendar,
  Download,
  Eye,
  Filter,
  PieChart,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import {
  TurnoverAnalysisModal,
  ABCAnalysisModal,
  ValuationReportModal,
  StockAgingModal,
  ReorderAnalysisModal,
  TurnoverAnalysisData,
  ABCAnalysisData,
  ValuationReportData,
  StockAgingData,
  ReorderAnalysisData
} from '@/components/inventory/InventoryAnalyticsModals';

interface Report {
  id: number;
  reportName: string;
  reportType: string;
  category: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'on-demand';
  lastGenerated: string;
  generatedBy: string;
  status: 'ready' | 'generating' | 'scheduled';
  format: 'PDF' | 'Excel' | 'CSV';
}

export default function AnalyticsReportsPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedFrequency, setSelectedFrequency] = useState('all');

  // Modal states for quick analytics
  const [isTurnoverModalOpen, setIsTurnoverModalOpen] = useState(false);
  const [isABCModalOpen, setIsABCModalOpen] = useState(false);
  const [isValuationModalOpen, setIsValuationModalOpen] = useState(false);
  const [isAgingModalOpen, setIsAgingModalOpen] = useState(false);
  const [isReorderModalOpen, setIsReorderModalOpen] = useState(false);

  // Generated analysis results
  const [turnoverResult, setTurnoverResult] = useState<TurnoverAnalysisData | null>(null);
  const [abcResult, setABCResult] = useState<ABCAnalysisData | null>(null);
  const [valuationResult, setValuationResult] = useState<ValuationReportData | null>(null);
  const [agingResult, setAgingResult] = useState<StockAgingData | null>(null);
  const [reorderResult, setReorderResult] = useState<ReorderAnalysisData | null>(null);

  const [reports, setReports] = useState<Report[]>([
    {
      id: 1,
      reportName: 'Inventory Turnover Analysis',
      reportType: 'Turnover',
      category: 'Performance',
      frequency: 'monthly',
      lastGenerated: '2025-01-22',
      generatedBy: 'John Smith',
      status: 'ready',
      format: 'PDF'
    },
    {
      id: 2,
      reportName: 'Item Velocity Report',
      reportType: 'Velocity',
      category: 'Performance',
      frequency: 'weekly',
      lastGenerated: '2025-01-20',
      generatedBy: 'Sarah Johnson',
      status: 'ready',
      format: 'Excel'
    },
    {
      id: 3,
      reportName: 'Dead Stock Identification',
      reportType: 'Dead Stock',
      category: 'Optimization',
      frequency: 'monthly',
      lastGenerated: '2025-01-15',
      generatedBy: 'Mike Davis',
      status: 'ready',
      format: 'PDF'
    },
    {
      id: 4,
      reportName: 'Carrying Cost Analysis',
      reportType: 'Carrying Cost',
      category: 'Financial',
      frequency: 'quarterly',
      lastGenerated: '2025-01-10',
      generatedBy: 'Emily Chen',
      status: 'ready',
      format: 'Excel'
    },
    {
      id: 5,
      reportName: 'ABC Classification Report',
      reportType: 'ABC Analysis',
      category: 'Optimization',
      frequency: 'monthly',
      lastGenerated: '2025-01-22',
      generatedBy: 'Robert Lee',
      status: 'ready',
      format: 'PDF'
    },
    {
      id: 6,
      reportName: 'Stock Valuation Report',
      reportType: 'Valuation',
      category: 'Financial',
      frequency: 'monthly',
      lastGenerated: '2025-01-21',
      generatedBy: 'John Smith',
      status: 'ready',
      format: 'Excel'
    },
    {
      id: 7,
      reportName: 'Daily Stock Movement',
      reportType: 'Movements',
      category: 'Operational',
      frequency: 'daily',
      lastGenerated: '2025-01-22',
      generatedBy: 'Sarah Johnson',
      status: 'ready',
      format: 'CSV'
    },
    {
      id: 8,
      reportName: 'Warehouse Utilization Report',
      reportType: 'Warehouse',
      category: 'Operational',
      frequency: 'weekly',
      lastGenerated: '2025-01-19',
      generatedBy: 'Mike Davis',
      status: 'ready',
      format: 'PDF'
    },
    {
      id: 9,
      reportName: 'Aging Analysis Report',
      reportType: 'Aging',
      category: 'Optimization',
      frequency: 'monthly',
      lastGenerated: '2025-01-18',
      generatedBy: 'Emily Chen',
      status: 'ready',
      format: 'Excel'
    },
    {
      id: 10,
      reportName: 'Low Stock Alert Report',
      reportType: 'Reorder',
      category: 'Operational',
      frequency: 'daily',
      lastGenerated: '2025-01-22',
      generatedBy: 'Robert Lee',
      status: 'ready',
      format: 'PDF'
    }
  ]);

  const getFrequencyColor = (frequency: string) => {
    switch (frequency) {
      case 'daily':
        return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'weekly':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'monthly':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'quarterly':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'on-demand':
        return 'text-gray-600 bg-gray-50 border-gray-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'generating':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'scheduled':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const totalReports = reports.length;
  const readyReports = reports.filter(r => r.status === 'ready').length;
  const dailyReports = reports.filter(r => r.frequency === 'daily').length;
  const monthlyReports = reports.filter(r => r.frequency === 'monthly').length;

  const filteredReports = reports.filter(report => {
    const matchesCategory = selectedCategory === 'all' || report.category === selectedCategory;
    const matchesFrequency = selectedFrequency === 'all' || report.frequency === selectedFrequency;
    return matchesCategory && matchesFrequency;
  });

  // Handler functions for modal generate actions
  const handleTurnoverGenerate = (config: any) => {
    console.log('Generating turnover analysis with config:', config);
    // TODO: API call to generate turnover analysis
    // const response = await fetch('/api/inventory/analytics/turnover', { method: 'POST', body: JSON.stringify(config) });
    // const data = await response.json();
    // setTurnoverResult(data);

    // Mock result for demo
    setTurnoverResult({
      period: config.period,
      startDate: config.startDate,
      endDate: config.endDate,
      warehouse: config.warehouse,
      category: config.category,
      items: [],
      summary: {
        avgTurnoverRatio: 5.8,
        fastMovingCount: 12,
        slowMovingCount: 8,
        nonMovingCount: 3
      }
    });
    setIsTurnoverModalOpen(false);
    alert('Turnover analysis generated successfully!');
  };

  const handleABCGenerate = (config: any) => {
    console.log('Generating ABC analysis with config:', config);
    // TODO: API call to generate ABC analysis
    // const response = await fetch('/api/inventory/analytics/abc', { method: 'POST', body: JSON.stringify(config) });
    // const data = await response.json();
    // setABCResult(data);

    setABCResult({
      analysisDate: config.analysisDate,
      warehouse: config.warehouse,
      criteria: config.criteria,
      items: [],
      summary: {
        aClassCount: 15,
        bClassCount: 35,
        cClassCount: 78,
        aClassValue: 5600000,
        bClassValue: 1800000,
        cClassValue: 625000
      }
    });
    setIsABCModalOpen(false);
    alert('ABC analysis generated successfully!');
  };

  const handleValuationGenerate = (config: any) => {
    console.log('Generating valuation report with config:', config);
    // TODO: API call to generate valuation report
    // const response = await fetch('/api/inventory/analytics/valuation', { method: 'POST', body: JSON.stringify(config) });
    // const data = await response.json();
    // setValuationResult(data);

    setValuationResult({
      reportDate: config.reportDate,
      warehouse: config.warehouse,
      valuationMethod: config.valuationMethod,
      items: [],
      summary: {
        totalItems: 378,
        totalQuantity: 18450,
        totalValue: 8025000,
        byCategory: []
      }
    });
    setIsValuationModalOpen(false);
    alert('Valuation report generated successfully!');
  };

  const handleAgingGenerate = (config: any) => {
    console.log('Generating aging analysis with config:', config);
    // TODO: API call to generate aging analysis
    // const response = await fetch('/api/inventory/analytics/aging', { method: 'POST', body: JSON.stringify(config) });
    // const data = await response.json();
    // setAgingResult(data);

    setAgingResult({
      reportDate: config.reportDate,
      warehouse: config.warehouse,
      items: [],
      summary: {
        totalValue: 681300,
        bucket_0_30: { quantity: 0, value: 0, percentage: 0 },
        bucket_31_60: { quantity: 195, value: 66600, percentage: 9.8 },
        bucket_61_90: { quantity: 67, value: 214400, percentage: 31.5 },
        bucket_91_180: { quantity: 363, value: 194500, percentage: 28.5 },
        bucket_180_plus: { quantity: 45, value: 202500, percentage: 29.7 }
      }
    });
    setIsAgingModalOpen(false);
    alert('Stock aging analysis generated successfully!');
  };

  const handleReorderGenerate = (config: any) => {
    console.log('Generating reorder analysis with config:', config);
    // TODO: API call to generate reorder analysis
    // const response = await fetch('/api/inventory/analytics/reorder', { method: 'POST', body: JSON.stringify(config) });
    // const data = await response.json();
    // setReorderResult(data);

    setReorderResult({
      analysisDate: config.analysisDate,
      warehouse: config.warehouse,
      items: [],
      summary: {
        criticalItems: 5,
        highPriorityItems: 12,
        totalReorderValue: 1250000
      }
    });
    setIsReorderModalOpen(false);
    alert('Reorder analysis generated successfully!');
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
            <FileText className="w-8 h-8 text-indigo-600" />
            <span>Inventory Analytics Reports</span>
          </h1>
          <p className="text-gray-600 mt-1">Access and generate inventory analysis reports</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Download All</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg p-6 border border-indigo-200">
          <div className="flex items-center justify-between mb-2">
            <FileText className="w-8 h-8 text-indigo-600" />
            <span className="text-2xl font-bold text-indigo-900">{totalReports}</span>
          </div>
          <div className="text-sm font-medium text-indigo-700">Total Reports</div>
          <div className="text-xs text-indigo-600 mt-1">Available Reports</div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
          <div className="flex items-center justify-between mb-2">
            <BarChart3 className="w-8 h-8 text-green-600" />
            <span className="text-2xl font-bold text-green-900">{readyReports}</span>
          </div>
          <div className="text-sm font-medium text-green-700">Ready to Download</div>
          <div className="text-xs text-green-600 mt-1">Latest Generated</div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 border border-purple-200">
          <div className="flex items-center justify-between mb-2">
            <Calendar className="w-8 h-8 text-purple-600" />
            <span className="text-2xl font-bold text-purple-900">{dailyReports}</span>
          </div>
          <div className="text-sm font-medium text-purple-700">Daily Reports</div>
          <div className="text-xs text-purple-600 mt-1">Auto-Generated</div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-bold text-blue-900">{monthlyReports}</span>
          </div>
          <div className="text-sm font-medium text-blue-700">Monthly Reports</div>
          <div className="text-xs text-blue-600 mt-1">Scheduled</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Categories</option>
            <option value="Performance">Performance</option>
            <option value="Financial">Financial</option>
            <option value="Optimization">Optimization</option>
            <option value="Operational">Operational</option>
          </select>

          <select
            value={selectedFrequency}
            onChange={(e) => setSelectedFrequency(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Frequencies</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="on-demand">On-Demand</option>
          </select>
        </div>
      </div>

      {/* Reports Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Available Reports</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Report Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Frequency</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Generated</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Generated By</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Format</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredReports.map((report) => (
                <tr key={report.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm">
                    <div className="font-medium text-gray-900">{report.reportName}</div>
                    <div className="text-xs text-gray-500">{report.reportType}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {report.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getFrequencyColor(report.frequency)}`}>
                      {report.frequency.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span>{report.lastGenerated}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {report.generatedBy}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 bg-gray-100 rounded text-xs font-medium text-gray-700">
                      {report.format}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(report.status)}`}>
                      {report.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center space-x-2">
                      <button className="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                        <Eye className="w-4 h-4 text-gray-600" />
                        <span className="text-gray-700">View</span>
                      </button>
                      <button className="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                        <Download className="w-4 h-4 text-gray-600" />
                        <span className="text-gray-700">Download</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Analytics Actions */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg shadow-md p-6 border border-indigo-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Quick Analytics</h3>
            <p className="text-sm text-gray-600 mt-1">Generate reports and analysis on-demand</p>
          </div>
          <BarChart3 className="w-8 h-8 text-indigo-600" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          <button
            onClick={() => setIsTurnoverModalOpen(true)}
            className="flex flex-col items-center gap-2 p-4 bg-white rounded-lg border-2 border-blue-200 hover:border-blue-500 hover:shadow-md transition-all"
          >
            <TrendingUp className="w-6 h-6 text-blue-600" />
            <span className="text-sm font-medium text-gray-900">Turnover Analysis</span>
          </button>
          <button
            onClick={() => setIsABCModalOpen(true)}
            className="flex flex-col items-center gap-2 p-4 bg-white rounded-lg border-2 border-purple-200 hover:border-purple-500 hover:shadow-md transition-all"
          >
            <PieChart className="w-6 h-6 text-purple-600" />
            <span className="text-sm font-medium text-gray-900">ABC Analysis</span>
          </button>
          <button
            onClick={() => setIsValuationModalOpen(true)}
            className="flex flex-col items-center gap-2 p-4 bg-white rounded-lg border-2 border-green-200 hover:border-green-500 hover:shadow-md transition-all"
          >
            <DollarSign className="w-6 h-6 text-green-600" />
            <span className="text-sm font-medium text-gray-900">Valuation Report</span>
          </button>
          <button
            onClick={() => setIsAgingModalOpen(true)}
            className="flex flex-col items-center gap-2 p-4 bg-white rounded-lg border-2 border-orange-200 hover:border-orange-500 hover:shadow-md transition-all"
          >
            <Calendar className="w-6 h-6 text-orange-600" />
            <span className="text-sm font-medium text-gray-900">Stock Aging</span>
          </button>
          <button
            onClick={() => setIsReorderModalOpen(true)}
            className="flex flex-col items-center gap-2 p-4 bg-white rounded-lg border-2 border-red-200 hover:border-red-500 hover:shadow-md transition-all"
          >
            <AlertCircle className="w-6 h-6 text-red-600" />
            <span className="text-sm font-medium text-gray-900">Reorder Analysis</span>
          </button>
        </div>
      </div>

      {/* Quick Access Report Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Performance Reports</h3>
            <TrendingUp className="w-6 h-6 text-blue-600" />
          </div>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Inventory Turnover Analysis</span>
            </li>
            <li className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Item Velocity Report</span>
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Financial Reports</h3>
            <DollarSign className="w-6 h-6 text-green-600" />
          </div>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Carrying Cost Analysis</span>
            </li>
            <li className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Stock Valuation Report</span>
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Optimization Reports</h3>
            <Package className="w-6 h-6 text-purple-600" />
          </div>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>Dead Stock Identification</span>
            </li>
            <li className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>ABC Classification Report</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Analytics Modals */}
      <TurnoverAnalysisModal
        isOpen={isTurnoverModalOpen}
        onClose={() => setIsTurnoverModalOpen(false)}
        onGenerate={handleTurnoverGenerate}
      />
      <ABCAnalysisModal
        isOpen={isABCModalOpen}
        onClose={() => setIsABCModalOpen(false)}
        onGenerate={handleABCGenerate}
      />
      <ValuationReportModal
        isOpen={isValuationModalOpen}
        onClose={() => setIsValuationModalOpen(false)}
        onGenerate={handleValuationGenerate}
      />
      <StockAgingModal
        isOpen={isAgingModalOpen}
        onClose={() => setIsAgingModalOpen(false)}
        onGenerate={handleAgingGenerate}
      />
      <ReorderAnalysisModal
        isOpen={isReorderModalOpen}
        onClose={() => setIsReorderModalOpen(false)}
        onGenerate={handleReorderGenerate}
      />
    </div>
  );
}

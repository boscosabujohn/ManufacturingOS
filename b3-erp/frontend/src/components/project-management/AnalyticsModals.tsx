'use client';

import { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Clock,
  Target,
  Filter,
  Download,
  Calendar,
  Users,
  Package,
  Settings,
  Bell,
  Share2,
  Eye,
  FileText,
  Sliders,
} from 'lucide-react';

// ============================================================
// INTERFACES
// ============================================================

interface ProjectMetrics {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  delayedProjects: number;
  totalRevenue: number;
  totalCost: number;
  profitMargin: number;
  avgProjectDuration: number;
  onTimeDelivery: number;
  customerSatisfaction: number;
}

interface MonthlyData {
  month: string;
  revenue: number;
  cost: number;
  profit: number;
  projectsCompleted: number;
}

// ============================================================
// MODAL 1: CUSTOM DASHBOARD MODAL (Blue Gradient)
// ============================================================

interface CustomDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (config: any) => void;
}

export function CustomDashboardModal({ isOpen, onClose, onSave }: CustomDashboardModalProps) {
  const [dashboardName, setDashboardName] = useState('');
  const [selectedWidgets, setSelectedWidgets] = useState<string[]>([
    'Revenue Trend',
    'Project Status',
    'Resource Utilization',
  ]);
  const [layout, setLayout] = useState('grid');
  const [refreshRate, setRefreshRate] = useState('manual');

  const availableWidgets = [
    { id: 'Revenue Trend', category: 'Financial' },
    { id: 'Profit Margin', category: 'Financial' },
    { id: 'Cost Analysis', category: 'Financial' },
    { id: 'Project Status', category: 'Projects' },
    { id: 'Timeline Performance', category: 'Projects' },
    { id: 'Delayed Projects', category: 'Projects' },
    { id: 'Resource Utilization', category: 'Resources' },
    { id: 'Team Efficiency', category: 'Resources' },
    { id: 'Customer Satisfaction', category: 'Quality' },
    { id: 'Quality Metrics', category: 'Quality' },
    { id: 'Risk Dashboard', category: 'Risk' },
    { id: 'Top Projects', category: 'Performance' },
  ];

  const toggleWidget = (widgetId: string) => {
    setSelectedWidgets(prev =>
      prev.includes(widgetId) ? prev.filter(w => w !== widgetId) : [...prev, widgetId]
    );
  };

  const handleSubmit = () => {
    onSave({
      name: dashboardName,
      widgets: selectedWidgets,
      layout,
      refreshRate,
    });
    onClose();
  };

  if (!isOpen) return null;

  const widgetsByCategory = availableWidgets.reduce((acc, widget) => {
    if (!acc[widget.category]) acc[widget.category] = [];
    acc[widget.category].push(widget);
    return acc;
  }, {} as Record<string, typeof availableWidgets>);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 flex justify-between items-center rounded-t-lg">
          <div className="flex items-center space-x-3">
            <Settings className="h-6 w-6" />
            <h2 className="text-xl font-bold">Customize Dashboard</h2>
          </div>
          <button onClick={onClose} className="text-white hover:text-gray-200">
            ✕
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Dashboard Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Dashboard Name *</label>
            <input
              type="text"
              value={dashboardName}
              onChange={(e) => setDashboardName(e.target.value)}
              placeholder="My Custom Analytics Dashboard"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Widget Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Select Widgets ({selectedWidgets.length} selected)
            </label>
            <div className="space-y-4 max-h-96 overflow-y-auto border border-gray-200 rounded-lg p-4">
              {Object.entries(widgetsByCategory).map(([category, widgets]) => (
                <div key={category}>
                  <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">{category}</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {widgets.map(widget => (
                      <label
                        key={widget.id}
                        className={`flex items-center space-x-2 p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                          selectedWidgets.includes(widget.id)
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 bg-white hover:bg-gray-50'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedWidgets.includes(widget.id)}
                          onChange={() => toggleWidget(widget.id)}
                          className="h-4 w-4 text-blue-600 rounded"
                        />
                        <span className="text-sm text-gray-700">{widget.id}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Layout and Refresh Settings */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Layout</label>
              <select
                value={layout}
                onChange={(e) => setLayout(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="grid">Grid Layout</option>
                <option value="list">List Layout</option>
                <option value="compact">Compact View</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Auto Refresh</label>
              <select
                value={refreshRate}
                onChange={(e) => setRefreshRate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="manual">Manual</option>
                <option value="1min">Every 1 Minute</option>
                <option value="5min">Every 5 Minutes</option>
                <option value="15min">Every 15 Minutes</option>
              </select>
            </div>
          </div>

          {/* Preview */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-2">Configuration Summary</h4>
            <div className="text-sm text-gray-700 space-y-1">
              <p><span className="font-medium">Widgets:</span> {selectedWidgets.length} selected</p>
              <p><span className="font-medium">Layout:</span> {layout}</p>
              <p><span className="font-medium">Refresh:</span> {refreshRate}</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 rounded-b-lg">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!dashboardName || selectedWidgets.length === 0}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300"
          >
            Save Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// MODAL 2: TIME PERIOD FILTER MODAL (Green Gradient)
// ============================================================

interface TimePeriodFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filter: any) => void;
}

export function TimePeriodFilterModal({ isOpen, onClose, onApply }: TimePeriodFilterModalProps) {
  const [filterType, setFilterType] = useState<'preset' | 'custom'>('preset');
  const [preset, setPreset] = useState('currentMonth');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [compareWith, setCompareWith] = useState('none');

  const handleSubmit = () => {
    onApply({
      type: filterType,
      preset: filterType === 'preset' ? preset : undefined,
      startDate: filterType === 'custom' ? startDate : undefined,
      endDate: filterType === 'custom' ? endDate : undefined,
      compareWith: compareWith !== 'none' ? compareWith : undefined,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-4 flex justify-between items-center rounded-t-lg">
          <div className="flex items-center space-x-3">
            <Calendar className="h-6 w-6" />
            <h2 className="text-xl font-bold">Time Period Filter</h2>
          </div>
          <button onClick={onClose} className="text-white hover:text-gray-200">
            ✕
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Filter Type */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Filter Type</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setFilterType('preset')}
                className={`p-4 rounded-lg border-2 text-center transition-colors ${
                  filterType === 'preset'
                    ? 'border-green-600 bg-green-50'
                    : 'border-gray-200 bg-white hover:bg-gray-50'
                }`}
              >
                <Clock className="h-6 w-6 mx-auto mb-2 text-green-600" />
                <span className="text-sm font-medium">Preset Periods</span>
              </button>
              <button
                onClick={() => setFilterType('custom')}
                className={`p-4 rounded-lg border-2 text-center transition-colors ${
                  filterType === 'custom'
                    ? 'border-green-600 bg-green-50'
                    : 'border-gray-200 bg-white hover:bg-gray-50'
                }`}
              >
                <Calendar className="h-6 w-6 mx-auto mb-2 text-green-600" />
                <span className="text-sm font-medium">Custom Range</span>
              </button>
            </div>
          </div>

          {/* Preset Periods */}
          {filterType === 'preset' && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Select Period</label>
              <select
                value={preset}
                onChange={(e) => setPreset(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              >
                <option value="today">Today</option>
                <option value="yesterday">Yesterday</option>
                <option value="thisWeek">This Week</option>
                <option value="lastWeek">Last Week</option>
                <option value="currentMonth">Current Month</option>
                <option value="lastMonth">Last Month</option>
                <option value="currentQuarter">Current Quarter</option>
                <option value="lastQuarter">Last Quarter</option>
                <option value="currentYear">Current Year</option>
                <option value="lastYear">Last Year</option>
                <option value="last30Days">Last 30 Days</option>
                <option value="last90Days">Last 90 Days</option>
                <option value="last6Months">Last 6 Months</option>
                <option value="last12Months">Last 12 Months</option>
              </select>
            </div>
          )}

          {/* Custom Range */}
          {filterType === 'custom' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Start Date *</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">End Date *</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
          )}

          {/* Compare With */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Compare With (Optional)</label>
            <select
              value={compareWith}
              onChange={(e) => setCompareWith(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            >
              <option value="none">No Comparison</option>
              <option value="previousPeriod">Previous Period</option>
              <option value="previousYear">Previous Year</option>
              <option value="budget">Budget/Target</option>
            </select>
          </div>

          {/* Summary */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-2">Filter Summary</h4>
            <p className="text-sm text-gray-700">
              {filterType === 'preset'
                ? `Showing data for: ${preset.replace(/([A-Z])/g, ' $1').trim()}`
                : startDate && endDate
                ? `Custom range: ${startDate} to ${endDate}`
                : 'Please select start and end dates'}
            </p>
            {compareWith !== 'none' && (
              <p className="text-sm text-gray-700 mt-1">
                Comparing with: {compareWith.replace(/([A-Z])/g, ' $1').trim()}
              </p>
            )}
          </div>
        </div>

        <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 rounded-b-lg">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={filterType === 'custom' && (!startDate || !endDate)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300"
          >
            Apply Filter
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// MODAL 3: EXPORT ANALYTICS MODAL (Purple Gradient)
// ============================================================

interface ExportAnalyticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (config: any) => void;
}

export function ExportAnalyticsModal({ isOpen, onClose, onExport }: ExportAnalyticsModalProps) {
  const [exportFormat, setExportFormat] = useState('PDF');
  const [selectedSections, setSelectedSections] = useState<string[]>([
    'Key Metrics',
    'Revenue Trend',
    'Project Analysis',
  ]);
  const [includeCharts, setIncludeCharts] = useState(true);
  const [includeRawData, setIncludeRawData] = useState(false);
  const [fileName, setFileName] = useState('');

  const availableSections = [
    'Key Metrics',
    'Revenue Trend',
    'Profit Analysis',
    'Project Analysis',
    'Resource Utilization',
    'Customer Satisfaction',
    'Top Projects',
    'Performance Insights',
  ];

  const toggleSection = (section: string) => {
    setSelectedSections(prev =>
      prev.includes(section) ? prev.filter(s => s !== section) : [...prev, section]
    );
  };

  const handleSubmit = () => {
    onExport({
      format: exportFormat,
      sections: selectedSections,
      includeCharts,
      includeRawData,
      fileName: fileName || `Analytics_Report_${new Date().toISOString().split('T')[0]}`,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-4 flex justify-between items-center rounded-t-lg">
          <div className="flex items-center space-x-3">
            <Download className="h-6 w-6" />
            <h2 className="text-xl font-bold">Export Analytics</h2>
          </div>
          <button onClick={onClose} className="text-white hover:text-gray-200">
            ✕
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* File Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">File Name (Optional)</label>
            <input
              type="text"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              placeholder={`Analytics_Report_${new Date().toISOString().split('T')[0]}`}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Export Format */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Export Format</label>
            <div className="grid grid-cols-4 gap-3">
              {['PDF', 'Excel', 'PowerPoint', 'CSV'].map(format => (
                <button
                  key={format}
                  onClick={() => setExportFormat(format)}
                  className={`p-4 rounded-lg border-2 text-center transition-colors ${
                    exportFormat === format
                      ? 'border-purple-600 bg-purple-50'
                      : 'border-gray-200 bg-white hover:bg-gray-50'
                  }`}
                >
                  <FileText className="h-6 w-6 mx-auto mb-2 text-purple-600" />
                  <span className="text-sm font-medium">{format}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Section Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Select Sections ({selectedSections.length}/{availableSections.length})
            </label>
            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-3">
              {availableSections.map(section => (
                <label
                  key={section}
                  className={`flex items-center space-x-2 p-2 rounded cursor-pointer ${
                    selectedSections.includes(section) ? 'bg-purple-50' : 'hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedSections.includes(section)}
                    onChange={() => toggleSection(section)}
                    className="h-4 w-4 text-purple-600 rounded"
                  />
                  <span className="text-sm text-gray-700">{section}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Export Options */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-900">Export Options</h4>
            <label className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
              <input
                type="checkbox"
                checked={includeCharts}
                onChange={(e) => setIncludeCharts(e.target.checked)}
                className="h-4 w-4 text-purple-600 rounded"
              />
              <div>
                <p className="text-sm font-medium text-gray-900">Include Charts & Visualizations</p>
                <p className="text-xs text-gray-600">Export with all graphs and charts</p>
              </div>
            </label>
            <label className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
              <input
                type="checkbox"
                checked={includeRawData}
                onChange={(e) => setIncludeRawData(e.target.checked)}
                className="h-4 w-4 text-purple-600 rounded"
              />
              <div>
                <p className="text-sm font-medium text-gray-900">Include Raw Data Tables</p>
                <p className="text-xs text-gray-600">Export with detailed data tables</p>
              </div>
            </label>
          </div>

          {/* Export Summary */}
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-2">Export Summary</h4>
            <div className="text-sm text-gray-700 space-y-1">
              <p><span className="font-medium">Format:</span> {exportFormat}</p>
              <p><span className="font-medium">Sections:</span> {selectedSections.length} selected</p>
              <p><span className="font-medium">Options:</span> {includeCharts && 'Charts'}{includeCharts && includeRawData && ', '}{includeRawData && 'Raw Data'}</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 rounded-b-lg">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={selectedSections.length === 0}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300 flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// MODAL 4: KPI CONFIGURATION MODAL (Orange Gradient)
// ============================================================

interface KPIConfigurationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (config: any) => void;
}

export function KPIConfigurationModal({ isOpen, onClose, onSave }: KPIConfigurationModalProps) {
  const [selectedKPIs, setSelectedKPIs] = useState<string[]>([
    'Total Revenue',
    'Profit Margin',
    'On-Time Delivery',
  ]);
  const [targets, setTargets] = useState<Record<string, string>>({});

  const availableKPIs = [
    { id: 'Total Revenue', unit: '₹', target: '15000000' },
    { id: 'Total Projects', unit: '', target: '50' },
    { id: 'Profit Margin', unit: '%', target: '30' },
    { id: 'Customer Satisfaction', unit: '/5', target: '4.5' },
    { id: 'On-Time Delivery', unit: '%', target: '85' },
    { id: 'Resource Utilization', unit: '%', target: '75' },
    { id: 'Team Efficiency', unit: '%', target: '90' },
    { id: 'Project Success Rate', unit: '%', target: '90' },
  ];

  const toggleKPI = (kpiId: string) => {
    setSelectedKPIs(prev =>
      prev.includes(kpiId) ? prev.filter(k => k !== kpiId) : [...prev, kpiId]
    );
  };

  const setTarget = (kpiId: string, value: string) => {
    setTargets(prev => ({ ...prev, [kpiId]: value }));
  };

  const handleSubmit = () => {
    onSave({
      kpis: selectedKPIs,
      targets,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-orange-600 to-orange-700 text-white px-6 py-4 flex justify-between items-center rounded-t-lg">
          <div className="flex items-center space-x-3">
            <Target className="h-6 w-6" />
            <h2 className="text-xl font-bold">Configure KPIs & Targets</h2>
          </div>
          <button onClick={onClose} className="text-white hover:text-gray-200">
            ✕
          </button>
        </div>

        <div className="p-6 space-y-6">
          <p className="text-sm text-gray-600">
            Select KPIs to track and set target values for performance measurement.
          </p>

          {/* KPI List */}
          <div className="space-y-3">
            {availableKPIs.map(kpi => (
              <div
                key={kpi.id}
                className={`border-2 rounded-lg p-4 transition-colors ${
                  selectedKPIs.includes(kpi.id)
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-200 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <label className="flex items-center space-x-3 flex-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedKPIs.includes(kpi.id)}
                      onChange={() => toggleKPI(kpi.id)}
                      className="h-5 w-5 text-orange-600 rounded"
                    />
                    <span className="text-sm font-medium text-gray-900">{kpi.id}</span>
                  </label>
                  {selectedKPIs.includes(kpi.id) && (
                    <div className="flex items-center space-x-2">
                      <label className="text-sm text-gray-600">Target:</label>
                      <input
                        type="text"
                        value={targets[kpi.id] || kpi.target}
                        onChange={(e) => setTarget(kpi.id, e.target.value)}
                        placeholder={kpi.target}
                        className="w-24 px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-orange-500"
                      />
                      <span className="text-sm text-gray-600">{kpi.unit}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-2">Configuration Summary</h4>
            <p className="text-sm text-gray-700">
              {selectedKPIs.length} KPI(s) selected with targets configured
            </p>
          </div>
        </div>

        <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 rounded-b-lg">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={selectedKPIs.length === 0}
            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:bg-gray-300"
          >
            Save Configuration
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// MODAL 5: DRILL-DOWN DETAILS MODAL (Indigo Gradient)
// ============================================================

interface DrillDownDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  metric: string | null;
  data: any;
}

export function DrillDownDetailsModal({ isOpen, onClose, metric, data }: DrillDownDetailsModalProps) {
  if (!isOpen || !metric) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-6 py-4 flex justify-between items-center rounded-t-lg">
          <div className="flex items-center space-x-3">
            <Eye className="h-6 w-6" />
            <h2 className="text-xl font-bold">Drill-Down: {metric}</h2>
          </div>
          <button onClick={onClose} className="text-white hover:text-gray-200">
            ✕
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-xs text-gray-600 mb-1">Total Value</p>
              <p className="text-2xl font-bold text-blue-700">₹12.5Cr</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-xs text-gray-600 mb-1">Growth</p>
              <p className="text-2xl font-bold text-green-700">+18%</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-xs text-gray-600 mb-1">Trend</p>
              <p className="text-2xl font-bold text-purple-700">
                <TrendingUp className="h-8 w-8" />
              </p>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <p className="text-xs text-gray-600 mb-1">vs Target</p>
              <p className="text-2xl font-bold text-orange-700">104%</p>
            </div>
          </div>

          {/* Detailed Breakdown */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900">Detailed Breakdown</h3>
            </div>
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Value</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">% of Total</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Trend</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {[
                  { name: 'Commercial Kitchen', value: 5200, percentage: 41.6, trend: '+15%' },
                  { name: 'Cold Room', value: 3800, percentage: 30.4, trend: '+22%' },
                  { name: 'Industrial Kitchen', value: 2800, percentage: 22.4, trend: '+12%' },
                  { name: 'Others', value: 700, percentage: 5.6, trend: '+8%' },
                ].map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-900">{item.name}</td>
                    <td className="px-4 py-3 text-right text-gray-900">₹{item.value / 100}Cr</td>
                    <td className="px-4 py-3 text-right text-gray-600">{item.percentage}%</td>
                    <td className="px-4 py-3 text-right text-green-600 font-medium">{item.trend}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Trend Chart Placeholder */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h4 className="text-sm font-semibold text-gray-900 mb-4">Historical Trend</h4>
            <div className="h-48 bg-gradient-to-br from-indigo-100 to-indigo-50 rounded-lg flex items-center justify-center">
              <BarChart3 className="h-16 w-16 text-indigo-400" />
            </div>
          </div>
        </div>

        <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 rounded-b-lg">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Export Details</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// MODAL 6: COMPARISON ANALYSIS MODAL (Teal Gradient)
// ============================================================

interface ComparisonAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  metrics: ProjectMetrics;
}

export function ComparisonAnalysisModal({ isOpen, onClose, metrics }: ComparisonAnalysisModalProps) {
  const [compareType, setCompareType] = useState('periodOverPeriod');
  const [period1, setPeriod1] = useState('currentMonth');
  const [period2, setPeriod2] = useState('previousMonth');

  if (!isOpen) return null;

  const comparisonData = [
    { metric: 'Total Projects', period1: metrics.totalProjects, period2: 42, change: +7.1 },
    { metric: 'Revenue', period1: metrics.totalRevenue, period2: 106000000, change: +17.9 },
    { metric: 'Profit Margin', period1: metrics.profitMargin, period2: 26.9, change: +5.6 },
    { metric: 'On-Time Delivery', period1: metrics.onTimeDelivery, period2: 82, change: -4.9 },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-teal-600 to-teal-700 text-white px-6 py-4 flex justify-between items-center rounded-t-lg">
          <div className="flex items-center space-x-3">
            <BarChart3 className="h-6 w-6" />
            <h2 className="text-xl font-bold">Comparison Analysis</h2>
          </div>
          <button onClick={onClose} className="text-white hover:text-gray-200">
            ✕
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Comparison Type */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Compare Type</label>
              <select
                value={compareType}
                onChange={(e) => setCompareType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
              >
                <option value="periodOverPeriod">Period over Period</option>
                <option value="projectType">By Project Type</option>
                <option value="department">By Department</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Period 1</label>
              <select
                value={period1}
                onChange={(e) => setPeriod1(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
              >
                <option value="currentMonth">Current Month</option>
                <option value="lastMonth">Last Month</option>
                <option value="currentQuarter">Current Quarter</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Period 2</label>
              <select
                value={period2}
                onChange={(e) => setPeriod2(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
              >
                <option value="previousMonth">Previous Month</option>
                <option value="previousQuarter">Previous Quarter</option>
                <option value="previousYear">Previous Year</option>
              </select>
            </div>
          </div>

          {/* Comparison Table */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Metric</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Period 1</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Period 2</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Change</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {comparisonData.map((row, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{row.metric}</td>
                    <td className="px-4 py-3 text-right text-gray-900">
                      {row.metric.includes('Revenue') ? `₹${(row.period1 / 10000000).toFixed(1)}Cr` :
                       row.metric.includes('Margin') || row.metric.includes('Delivery') ? `${row.period1}%` :
                       row.period1}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-600">
                      {row.metric.includes('Revenue') ? `₹${(row.period2 / 10000000).toFixed(1)}Cr` :
                       row.metric.includes('Margin') || row.metric.includes('Delivery') ? `${row.period2}%` :
                       row.period2}
                    </td>
                    <td className={`px-4 py-3 text-right font-semibold ${
                      row.change > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {row.change > 0 ? '+' : ''}{row.change}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Insights */}
          <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-2">Key Insights</h4>
            <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
              <li>Revenue growth of 17.9% indicates strong business expansion</li>
              <li>Profit margin improved by 5.6% through cost optimization</li>
              <li>On-time delivery decreased by 4.9%, requires attention</li>
            </ul>
          </div>
        </div>

        <div className="bg-gray-50 px-6 py-4 flex justify-end rounded-b-lg">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// MODAL 7: ALERT THRESHOLD MODAL (Yellow Gradient)
// ============================================================

interface AlertThresholdModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (alerts: any) => void;
}

export function AlertThresholdModal({ isOpen, onClose, onSave }: AlertThresholdModalProps) {
  const [enableAlerts, setEnableAlerts] = useState(true);
  const [thresholds, setThresholds] = useState({
    revenueMin: '10000000',
    profitMarginMin: '25',
    onTimeDeliveryMin: '80',
    utilizationMax: '85',
  });

  const setThreshold = (key: string, value: string) => {
    setThresholds(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    onSave({
      enabled: enableAlerts,
      thresholds,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-yellow-600 to-yellow-700 text-white px-6 py-4 flex justify-between items-center rounded-t-lg">
          <div className="flex items-center space-x-3">
            <Bell className="h-6 w-6" />
            <h2 className="text-xl font-bold">Alert Thresholds</h2>
          </div>
          <button onClick={onClose} className="text-white hover:text-gray-200">
            ✕
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Master Toggle */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={enableAlerts}
                onChange={(e) => setEnableAlerts(e.target.checked)}
                className="h-5 w-5 text-yellow-600 rounded"
              />
              <div>
                <p className="font-semibold text-gray-900">Enable Performance Alerts</p>
                <p className="text-sm text-gray-600">Receive notifications when metrics fall outside thresholds</p>
              </div>
            </label>
          </div>

          {enableAlerts && (
            <>
              {/* Revenue Alert */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-5 w-5 text-gray-600" />
                    <h4 className="text-sm font-semibold text-gray-900">Revenue Alert</h4>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Minimum Monthly Revenue</label>
                    <div className="flex items-center">
                      <span className="text-sm text-gray-600 mr-2">₹</span>
                      <input
                        type="number"
                        value={thresholds.revenueMin}
                        onChange={(e) => setThreshold('revenueMin', e.target.value)}
                        className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-yellow-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Profit Margin Alert */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <Target className="h-5 w-5 text-gray-600" />
                    <h4 className="text-sm font-semibold text-gray-900">Profit Margin Alert</h4>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Minimum Profit Margin</label>
                    <div className="flex items-center">
                      <input
                        type="number"
                        value={thresholds.profitMarginMin}
                        onChange={(e) => setThreshold('profitMarginMin', e.target.value)}
                        className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-yellow-500"
                      />
                      <span className="text-sm text-gray-600 ml-2">%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* On-Time Delivery Alert */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-gray-600" />
                    <h4 className="text-sm font-semibold text-gray-900">On-Time Delivery Alert</h4>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Minimum Delivery Rate</label>
                    <div className="flex items-center">
                      <input
                        type="number"
                        value={thresholds.onTimeDeliveryMin}
                        onChange={(e) => setThreshold('onTimeDeliveryMin', e.target.value)}
                        className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-yellow-500"
                      />
                      <span className="text-sm text-gray-600 ml-2">%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Resource Utilization Alert */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-gray-600" />
                    <h4 className="text-sm font-semibold text-gray-900">Resource Utilization Alert</h4>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Maximum Utilization</label>
                    <div className="flex items-center">
                      <input
                        type="number"
                        value={thresholds.utilizationMax}
                        onChange={(e) => setThreshold('utilizationMax', e.target.value)}
                        className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-yellow-500"
                      />
                      <span className="text-sm text-gray-600 ml-2">%</span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 rounded-b-lg">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
          >
            Save Alerts
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// MODAL 8: SCHEDULE ANALYTICS MODAL (Pink Gradient)
// ============================================================

interface ScheduleAnalyticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSchedule: (schedule: any) => void;
}

export function ScheduleAnalyticsModal({ isOpen, onClose, onSchedule }: ScheduleAnalyticsModalProps) {
  const [reportName, setReportName] = useState('');
  const [frequency, setFrequency] = useState('weekly');
  const [recipients, setRecipients] = useState<string[]>([]);
  const [emailInput, setEmailInput] = useState('');
  const [includeCharts, setIncludeCharts] = useState(true);

  const addRecipient = () => {
    if (emailInput && !recipients.includes(emailInput)) {
      setRecipients([...recipients, emailInput]);
      setEmailInput('');
    }
  };

  const removeRecipient = (email: string) => {
    setRecipients(recipients.filter(r => r !== email));
  };

  const handleSubmit = () => {
    onSchedule({
      name: reportName,
      frequency,
      recipients,
      includeCharts,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-pink-600 to-pink-700 text-white px-6 py-4 flex justify-between items-center rounded-t-lg">
          <div className="flex items-center space-x-3">
            <Calendar className="h-6 w-6" />
            <h2 className="text-xl font-bold">Schedule Analytics Report</h2>
          </div>
          <button onClick={onClose} className="text-white hover:text-gray-200">
            ✕
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Report Name *</label>
            <input
              type="text"
              value={reportName}
              onChange={(e) => setReportName(e.target.value)}
              placeholder="Weekly Analytics Digest"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Frequency *</label>
            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly (Monday Morning)</option>
              <option value="monthly">Monthly (1st of Month)</option>
              <option value="quarterly">Quarterly</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Email Recipients</label>
            <div className="flex gap-2 mb-2">
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addRecipient()}
                placeholder="Enter email address..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
              />
              <button
                onClick={addRecipient}
                className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700"
              >
                Add
              </button>
            </div>
            <div className="space-y-2">
              {recipients.map((email, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg">
                  <span className="text-sm text-gray-700">{email}</span>
                  <button
                    onClick={() => removeRecipient(email)}
                    className="text-red-600 hover:text-red-700 text-sm"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-pink-50 border border-pink-200 rounded-lg p-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={includeCharts}
                onChange={(e) => setIncludeCharts(e.target.checked)}
                className="h-4 w-4 text-pink-600 rounded"
              />
              <span className="text-sm text-gray-700">Include charts and visualizations</span>
            </label>
          </div>
        </div>

        <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 rounded-b-lg">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!reportName || recipients.length === 0}
            className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 disabled:bg-gray-300"
          >
            Schedule Report
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// MODAL 9: SHARE ANALYTICS MODAL (Cyan Gradient)
// ============================================================

interface ShareAnalyticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShare: (data: any) => void;
}

export function ShareAnalyticsModal({ isOpen, onClose, onShare }: ShareAnalyticsModalProps) {
  const [shareMethod, setShareMethod] = useState('email');
  const [recipients, setRecipients] = useState('');
  const [message, setMessage] = useState('');
  const [expiryDays, setExpiryDays] = useState('7');

  const handleSubmit = () => {
    onShare({
      method: shareMethod,
      recipients,
      message,
      expiryDays,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-cyan-600 to-cyan-700 text-white px-6 py-4 flex justify-between items-center rounded-t-lg">
          <div className="flex items-center space-x-3">
            <Share2 className="h-6 w-6" />
            <h2 className="text-xl font-bold">Share Analytics</h2>
          </div>
          <button onClick={onClose} className="text-white hover:text-gray-200">
            ✕
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Share Method</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setShareMethod('email')}
                className={`p-4 rounded-lg border-2 text-center ${
                  shareMethod === 'email' ? 'border-cyan-600 bg-cyan-50' : 'border-gray-200'
                }`}
              >
                Email
              </button>
              <button
                onClick={() => setShareMethod('link')}
                className={`p-4 rounded-lg border-2 text-center ${
                  shareMethod === 'link' ? 'border-cyan-600 bg-cyan-50' : 'border-gray-200'
                }`}
              >
                Shareable Link
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {shareMethod === 'email' ? 'Recipients' : 'Link Expiry'}
            </label>
            {shareMethod === 'email' ? (
              <input
                type="text"
                value={recipients}
                onChange={(e) => setRecipients(e.target.value)}
                placeholder="email1@example.com, email2@example.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
              />
            ) : (
              <select
                value={expiryDays}
                onChange={(e) => setExpiryDays(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
              >
                <option value="1">1 Day</option>
                <option value="7">7 Days</option>
                <option value="30">30 Days</option>
                <option value="never">Never</option>
              </select>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Message (Optional)</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Add a message..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
            />
          </div>
        </div>

        <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 rounded-b-lg">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={shareMethod === 'email' && !recipients}
            className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 disabled:bg-gray-300"
          >
            Share
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// MODAL 10: SAVED VIEWS MODAL (Red Gradient)
// ============================================================

interface SavedViewsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoad: (view: any) => void;
}

export function SavedViewsModal({ isOpen, onClose, onLoad }: SavedViewsModalProps) {
  const [views, setViews] = useState([
    { id: '1', name: 'Executive Summary', description: 'High-level KPIs for management', lastUsed: '2025-01-15' },
    { id: '2', name: 'Project Deep Dive', description: 'Detailed project analytics', lastUsed: '2025-01-14' },
    { id: '3', name: 'Resource Analysis', description: 'Team utilization and efficiency', lastUsed: '2025-01-12' },
  ]);

  const handleLoad = (view: any) => {
    onLoad(view);
    onClose();
  };

  const handleDelete = (viewId: string) => {
    setViews(views.filter(v => v.id !== viewId));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-4 flex justify-between items-center rounded-t-lg">
          <div className="flex items-center space-x-3">
            <Eye className="h-6 w-6" />
            <h2 className="text-xl font-bold">Saved Views</h2>
          </div>
          <button onClick={onClose} className="text-white hover:text-gray-200">
            ✕
          </button>
        </div>

        <div className="p-6 space-y-4">
          {views.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No saved views yet. Create a custom dashboard to save your first view.</p>
            </div>
          ) : (
            views.map(view => (
              <div key={view.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-gray-900">{view.name}</h4>
                    <p className="text-xs text-gray-600 mt-1">{view.description}</p>
                    <p className="text-xs text-gray-500 mt-2">Last used: {view.lastUsed}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleLoad(view)}
                      className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                    >
                      Load
                    </button>
                    <button
                      onClick={() => handleDelete(view.id)}
                      className="px-3 py-1 border border-gray-300 text-gray-700 rounded text-sm hover:bg-gray-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="bg-gray-50 px-6 py-4 flex justify-end rounded-b-lg">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

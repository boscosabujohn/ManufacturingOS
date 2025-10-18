'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  FileText,
  Download,
  Calendar,
  Filter,
  Eye,
  TrendingUp,
  BarChart3,
  PieChart,
  Clock,
  DollarSign,
  Users,
  CheckCircle,
  AlertTriangle,
  FileSpreadsheet,
  FileBarChart,
  FilePieChart,
  Layout,
} from 'lucide-react';

interface Report {
  id: string;
  reportName: string;
  reportType: 'Financial' | 'Progress' | 'Resource' | 'Quality' | 'Risk' | 'Executive' | 'Custom';
  category: string;
  description: string;
  frequency: 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly' | 'On-Demand';
  format: 'PDF' | 'Excel' | 'PowerPoint' | 'CSV';
  lastGenerated: string;
  generatedBy: string;
  projectScope: 'All Projects' | 'Single Project' | 'Project Type' | 'Department' | 'Client';
  projectCount: number;
  fileSize: string;
  status: 'Available' | 'Generating' | 'Failed' | 'Scheduled';
  icon: any;
}

interface ReportTemplate {
  id: string;
  templateName: string;
  reportType: string;
  description: string;
  dataPoints: string[];
  filters: string[];
  charts: string[];
  icon: any;
}

export default function ProjectReportsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'recent' | 'templates'>('recent');
  const [searchTerm, setSearchTerm] = useState('');
  const [reportTypeFilter, setReportTypeFilter] = useState('all');
  const [frequencyFilter, setFrequencyFilter] = useState('all');
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<ReportTemplate | null>(null);

  // Mock recent reports - 12 records
  const mockReports: Report[] = [
    {
      id: '1',
      reportName: 'Monthly Project Status Report - May 2024',
      reportType: 'Executive',
      category: 'Executive Summary',
      description: 'Comprehensive overview of all active projects with key metrics and highlights',
      frequency: 'Monthly',
      format: 'PDF',
      lastGenerated: '2024-06-01',
      generatedBy: 'Rajesh Kumar',
      projectScope: 'All Projects',
      projectCount: 18,
      fileSize: '2.4 MB',
      status: 'Available',
      icon: FileText,
    },
    {
      id: '2',
      reportName: 'Project Profitability Analysis - Q1 2024',
      reportType: 'Financial',
      category: 'Financial Analysis',
      description: 'Detailed profitability metrics for all projects with margin analysis',
      frequency: 'Quarterly',
      format: 'Excel',
      lastGenerated: '2024-04-05',
      generatedBy: 'Priya Sharma',
      projectScope: 'All Projects',
      projectCount: 22,
      fileSize: '1.8 MB',
      status: 'Available',
      icon: FileSpreadsheet,
    },
    {
      id: '3',
      reportName: 'Resource Utilization Dashboard - May 2024',
      reportType: 'Resource',
      category: 'Resource Management',
      description: 'Team member allocation, utilization rates, and efficiency metrics',
      frequency: 'Monthly',
      format: 'PowerPoint',
      lastGenerated: '2024-06-01',
      generatedBy: 'Amit Patel',
      projectScope: 'All Projects',
      projectCount: 18,
      fileSize: '3.2 MB',
      status: 'Available',
      icon: Users,
    },
    {
      id: '4',
      reportName: 'Taj Kitchen Upgrade - Progress Report',
      reportType: 'Progress',
      category: 'Project Progress',
      description: 'Detailed progress tracking with milestones, tasks, and timeline analysis',
      frequency: 'Weekly',
      format: 'PDF',
      lastGenerated: '2024-05-31',
      generatedBy: 'Rajesh Kumar',
      projectScope: 'Single Project',
      projectCount: 1,
      fileSize: '1.5 MB',
      status: 'Available',
      icon: TrendingUp,
    },
    {
      id: '5',
      reportName: 'Quality Inspection Summary - May 2024',
      reportType: 'Quality',
      category: 'Quality Assurance',
      description: 'Quality checkpoints, defects tracking, and compliance status',
      frequency: 'Monthly',
      format: 'Excel',
      lastGenerated: '2024-06-01',
      generatedBy: 'Kavita Singh',
      projectScope: 'All Projects',
      projectCount: 18,
      fileSize: '950 KB',
      status: 'Available',
      icon: CheckCircle,
    },
    {
      id: '6',
      reportName: 'Risk Assessment & Mitigation Report',
      reportType: 'Risk',
      category: 'Risk Management',
      description: 'Project risks, issues, and mitigation strategies across portfolio',
      frequency: 'Monthly',
      format: 'PDF',
      lastGenerated: '2024-05-30',
      generatedBy: 'Deepak Mehta',
      projectScope: 'All Projects',
      projectCount: 18,
      fileSize: '1.2 MB',
      status: 'Available',
      icon: AlertTriangle,
    },
    {
      id: '7',
      reportName: 'Commercial Kitchen Projects - Cost Analysis',
      reportType: 'Financial',
      category: 'Cost Analysis',
      description: 'Cost breakdown and variance analysis for all kitchen projects',
      frequency: 'On-Demand',
      format: 'Excel',
      lastGenerated: '2024-05-28',
      generatedBy: 'Anjali Gupta',
      projectScope: 'Project Type',
      projectCount: 5,
      fileSize: '1.1 MB',
      status: 'Available',
      icon: DollarSign,
    },
    {
      id: '8',
      reportName: 'Schedule Performance Index Report',
      reportType: 'Progress',
      category: 'Schedule Analysis',
      description: 'Timeline performance metrics with SPI and schedule variance',
      frequency: 'Monthly',
      format: 'PowerPoint',
      lastGenerated: '2024-06-01',
      generatedBy: 'Suresh Reddy',
      projectScope: 'All Projects',
      projectCount: 18,
      fileSize: '2.8 MB',
      status: 'Available',
      icon: Clock,
    },
    {
      id: '9',
      reportName: 'Material Consumption vs Budget Report',
      reportType: 'Financial',
      category: 'Material Management',
      description: 'Material usage tracking with cost variance and wastage analysis',
      frequency: 'Weekly',
      format: 'Excel',
      lastGenerated: '2024-05-31',
      generatedBy: 'Anjali Gupta',
      projectScope: 'All Projects',
      projectCount: 18,
      fileSize: '850 KB',
      status: 'Available',
      icon: BarChart3,
    },
    {
      id: '10',
      reportName: 'Client Satisfaction Survey Results',
      reportType: 'Executive',
      category: 'Client Relations',
      description: 'Customer feedback analysis and satisfaction metrics',
      frequency: 'Quarterly',
      format: 'PDF',
      lastGenerated: '2024-04-10',
      generatedBy: 'Meera Iyer',
      projectScope: 'All Projects',
      projectCount: 15,
      fileSize: '1.6 MB',
      status: 'Available',
      icon: Users,
    },
    {
      id: '11',
      reportName: 'Safety Compliance Report - May 2024',
      reportType: 'Quality',
      category: 'Safety & Compliance',
      description: 'Safety incidents, compliance status, and corrective actions',
      frequency: 'Monthly',
      format: 'PDF',
      lastGenerated: '2024-06-01',
      generatedBy: 'Arun Nair',
      projectScope: 'All Projects',
      projectCount: 18,
      fileSize: '1.3 MB',
      status: 'Available',
      icon: AlertTriangle,
    },
    {
      id: '12',
      reportName: 'Change Orders Impact Analysis',
      reportType: 'Financial',
      category: 'Change Management',
      description: 'Financial and schedule impact of all approved change orders',
      frequency: 'On-Demand',
      format: 'Excel',
      lastGenerated: '2024-05-29',
      generatedBy: 'Priya Sharma',
      projectScope: 'All Projects',
      projectCount: 18,
      fileSize: '750 KB',
      status: 'Available',
      icon: FileBarChart,
    },
  ];

  // Report templates
  const reportTemplates: ReportTemplate[] = [
    {
      id: 'T1',
      templateName: 'Executive Dashboard',
      reportType: 'Executive',
      description: 'High-level overview with key metrics, trends, and highlights for leadership',
      dataPoints: ['Project Status', 'Budget vs Actual', 'Timeline Performance', 'Resource Utilization', 'Risk Summary'],
      filters: ['Date Range', 'Project Type', 'Department', 'Client'],
      charts: ['Status Distribution Pie', 'Cost Trend Line', 'Schedule Performance Bar', 'Resource Heat Map'],
      icon: Layout,
    },
    {
      id: 'T2',
      templateName: 'Financial Performance Report',
      reportType: 'Financial',
      description: 'Detailed financial analysis with profitability, variance, and cash flow',
      dataPoints: ['Revenue', 'Cost', 'Profit Margin', 'Budget Variance', 'Cash Flow', 'Billing Status'],
      filters: ['Date Range', 'Project', 'Cost Category', 'Client'],
      charts: ['Profitability Bar', 'Cost Breakdown Pie', 'Variance Waterfall', 'Cash Flow Line'],
      icon: DollarSign,
    },
    {
      id: 'T3',
      templateName: 'Project Progress Report',
      reportType: 'Progress',
      description: 'Comprehensive progress tracking with milestones, tasks, and deliverables',
      dataPoints: ['Overall Progress', 'Milestone Status', 'Task Completion', 'Schedule Variance', 'Critical Path'],
      filters: ['Date Range', 'Project', 'Phase', 'Work Package'],
      charts: ['Gantt Chart', 'Progress S-Curve', 'Milestone Timeline', 'Completion Bar'],
      icon: TrendingUp,
    },
    {
      id: 'T4',
      templateName: 'Resource Allocation Report',
      reportType: 'Resource',
      description: 'Team allocation, utilization, availability, and efficiency metrics',
      dataPoints: ['Utilization Rate', 'Capacity', 'Allocation by Project', 'Efficiency', 'Cost per Hour'],
      filters: ['Date Range', 'Department', 'Resource Type', 'Project'],
      charts: ['Utilization Bar', 'Allocation Heat Map', 'Efficiency Trend', 'Availability Pie'],
      icon: Users,
    },
    {
      id: 'T5',
      templateName: 'Quality & Compliance Report',
      reportType: 'Quality',
      description: 'Quality inspections, defects, compliance status, and corrective actions',
      dataPoints: ['Inspection Status', 'Defect Count', 'Compliance Rate', 'Corrective Actions', 'Quality Score'],
      filters: ['Date Range', 'Project', 'Inspection Type', 'Status'],
      charts: ['Quality Trend Line', 'Defect Pareto', 'Compliance Gauge', 'Status Distribution'],
      icon: CheckCircle,
    },
    {
      id: 'T6',
      templateName: 'Risk & Issues Dashboard',
      reportType: 'Risk',
      description: 'Risk register, issue tracking, impact analysis, and mitigation plans',
      dataPoints: ['Open Risks', 'Critical Issues', 'Risk Score', 'Mitigation Status', 'Impact Assessment'],
      filters: ['Date Range', 'Project', 'Risk Category', 'Severity'],
      charts: ['Risk Matrix', 'Issue Status Bar', 'Impact Bubble', 'Trend Line'],
      icon: AlertTriangle,
    },
    {
      id: 'T7',
      templateName: 'Cost Variance Analysis',
      reportType: 'Financial',
      description: 'Detailed cost analysis with budget vs actual comparison and variance drivers',
      dataPoints: ['Budget', 'Actual Cost', 'Variance', 'Forecast', 'Cost Performance Index'],
      filters: ['Date Range', 'Project', 'Cost Category', 'Work Package'],
      charts: ['Variance Waterfall', 'Budget vs Actual Bar', 'CPI Trend', 'Category Breakdown'],
      icon: FileBarChart,
    },
    {
      id: 'T8',
      templateName: 'Material Consumption Report',
      reportType: 'Custom',
      description: 'Material tracking with planned vs actual consumption and wastage analysis',
      dataPoints: ['Material Category', 'Planned Qty', 'Consumed Qty', 'Variance', 'Cost Impact', 'Wastage'],
      filters: ['Date Range', 'Project', 'Material Category', 'Supplier'],
      charts: ['Consumption Bar', 'Variance Pie', 'Cost Trend', 'Wastage Analysis'],
      icon: BarChart3,
    },
  ];

  const filteredReports = mockReports.filter((report) => {
    const matchesSearch =
      report.reportName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = reportTypeFilter === 'all' || report.reportType === reportTypeFilter;
    const matchesFrequency = frequencyFilter === 'all' || report.frequency === frequencyFilter;
    return matchesSearch && matchesType && matchesFrequency;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available':
        return 'text-green-600 bg-green-50';
      case 'Generating':
        return 'text-blue-600 bg-blue-50';
      case 'Failed':
        return 'text-red-600 bg-red-50';
      case 'Scheduled':
        return 'text-yellow-600 bg-yellow-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getReportTypeColor = (type: string) => {
    switch (type) {
      case 'Financial':
        return 'text-green-600 bg-green-50';
      case 'Progress':
        return 'text-blue-600 bg-blue-50';
      case 'Resource':
        return 'text-purple-600 bg-purple-50';
      case 'Quality':
        return 'text-cyan-600 bg-cyan-50';
      case 'Risk':
        return 'text-orange-600 bg-orange-50';
      case 'Executive':
        return 'text-indigo-600 bg-indigo-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getFormatColor = (format: string) => {
    switch (format) {
      case 'PDF':
        return 'text-red-600 bg-red-50';
      case 'Excel':
        return 'text-green-600 bg-green-50';
      case 'PowerPoint':
        return 'text-orange-600 bg-orange-50';
      case 'CSV':
        return 'text-blue-600 bg-blue-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Project Reports Center</h1>
            <p className="text-gray-600 mt-1">Generate, view, and manage project reports</p>
          </div>
          <button
            onClick={() => setShowGenerateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700"
          >
            <FileText className="w-4 h-4" />
            Generate New Report
          </button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Reports</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{mockReports.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Report Templates</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{reportTemplates.length}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Layout className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">This Month</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {mockReports.filter(r => r.lastGenerated.startsWith('2024-05') || r.lastGenerated.startsWith('2024-06')).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Size</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">18.3 MB</p>
              </div>
              <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center">
                <Download className="w-6 h-6 text-cyan-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab('recent')}
          className={`px-6 py-3 font-medium ${
            activeTab === 'recent'
              ? 'text-cyan-600 border-b-2 border-cyan-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Recent Reports
        </button>
        <button
          onClick={() => setActiveTab('templates')}
          className={`px-6 py-3 font-medium ${
            activeTab === 'templates'
              ? 'text-cyan-600 border-b-2 border-cyan-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Report Templates
        </button>
      </div>

      {/* Recent Reports Tab */}
      {activeTab === 'recent' && (
        <>
          {/* Filters */}
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search reports..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
              </div>
              <select
                value={reportTypeFilter}
                onChange={(e) => setReportTypeFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="Executive">Executive</option>
                <option value="Financial">Financial</option>
                <option value="Progress">Progress</option>
                <option value="Resource">Resource</option>
                <option value="Quality">Quality</option>
                <option value="Risk">Risk</option>
                <option value="Custom">Custom</option>
              </select>
              <select
                value={frequencyFilter}
                onChange={(e) => setFrequencyFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              >
                <option value="all">All Frequencies</option>
                <option value="Daily">Daily</option>
                <option value="Weekly">Weekly</option>
                <option value="Monthly">Monthly</option>
                <option value="Quarterly">Quarterly</option>
                <option value="On-Demand">On-Demand</option>
              </select>
            </div>
          </div>

          {/* Reports Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReports.map((report) => {
              const IconComponent = report.icon;
              return (
                <div key={report.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      <IconComponent className="w-6 h-6 text-gray-600" />
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                      {report.status}
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{report.reportName}</h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{report.description}</p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Type:</span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getReportTypeColor(report.reportType)}`}>
                        {report.reportType}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Format:</span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getFormatColor(report.format)}`}>
                        {report.format}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Frequency:</span>
                      <span className="text-gray-900">{report.frequency}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Projects:</span>
                      <span className="text-gray-900">{report.projectCount}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Size:</span>
                      <span className="text-gray-900">{report.fileSize}</span>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <p className="text-xs text-gray-500 mb-3">
                      Generated on {new Date(report.lastGenerated).toLocaleDateString('en-IN')} by {report.generatedBy}
                    </p>
                    <div className="flex gap-2">
                      <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 text-sm">
                        <Download className="w-4 h-4" />
                        Download
                      </button>
                      <button className="flex items-center justify-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Templates Tab */}
      {activeTab === 'templates' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reportTemplates.map((template) => {
            const IconComponent = template.icon;
            return (
              <div key={template.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <IconComponent className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{template.templateName}</h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getReportTypeColor(template.reportType)}`}>
                      {template.reportType}
                    </span>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-4">{template.description}</p>

                <div className="space-y-3 mb-4">
                  <div>
                    <p className="text-xs font-semibold text-gray-700 mb-2">Data Points:</p>
                    <div className="flex flex-wrap gap-1">
                      {template.dataPoints.map((point, idx) => (
                        <span key={idx} className="inline-flex items-center px-2 py-1 rounded text-xs bg-blue-50 text-blue-700">
                          {point}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-gray-700 mb-2">Available Filters:</p>
                    <div className="flex flex-wrap gap-1">
                      {template.filters.map((filter, idx) => (
                        <span key={idx} className="inline-flex items-center px-2 py-1 rounded text-xs bg-purple-50 text-purple-700">
                          {filter}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-gray-700 mb-2">Charts & Visualizations:</p>
                    <div className="flex flex-wrap gap-1">
                      {template.charts.map((chart, idx) => (
                        <span key={idx} className="inline-flex items-center px-2 py-1 rounded text-xs bg-green-50 text-green-700">
                          {chart}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSelectedTemplate(template);
                    setShowGenerateModal(true);
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700"
                >
                  <FileText className="w-4 h-4" />
                  Generate Report
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Generate Report Modal */}
      {showGenerateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Generate New Report</h2>
              <p className="text-gray-600 mt-1">Configure and generate a custom report</p>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Report Template
                </label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent">
                  <option>Executive Dashboard</option>
                  <option>Financial Performance Report</option>
                  <option>Project Progress Report</option>
                  <option>Resource Allocation Report</option>
                  <option>Quality & Compliance Report</option>
                  <option>Risk & Issues Dashboard</option>
                  <option>Cost Variance Analysis</option>
                  <option>Material Consumption Report</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Report Name
                </label>
                <input
                  type="text"
                  placeholder="Enter report name..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date Range
                  </label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent">
                    <option>Current Month</option>
                    <option>Current Quarter</option>
                    <option>Current Year</option>
                    <option>Last Month</option>
                    <option>Last Quarter</option>
                    <option>Custom Range</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Output Format
                  </label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent">
                    <option>PDF</option>
                    <option>Excel</option>
                    <option>PowerPoint</option>
                    <option>CSV</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Scope
                </label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent">
                  <option>All Projects</option>
                  <option>Active Projects Only</option>
                  <option>Completed Projects</option>
                  <option>Commercial Kitchen Projects</option>
                  <option>Cold Room Projects</option>
                  <option>Switchgear Projects</option>
                  <option>Select Specific Projects...</option>
                </select>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowGenerateModal(false);
                  setSelectedTemplate(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700">
                Generate Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

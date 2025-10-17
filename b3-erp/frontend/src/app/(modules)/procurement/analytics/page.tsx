'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Package,
  FileText,
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  Download,
  Upload,
  Filter,
  RefreshCw,
  Target,
  Zap,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  Award,
  Percent,
  ArrowUpRight,
  ArrowDownRight,
  Users,
  Building2,
  Truck,
  Timer,
  AlertTriangle,
  ThumbsUp,
  ThumbsDown,
  ChevronDown,
  ChevronUp,
  Mail,
  Printer,
  Share2,
  Settings,
  Eye,
  Layers,
  Box,
  GitBranch,
  Gauge,
  TrendingDownIcon,
  LineChart,
  AreaChart
} from 'lucide-react';

// TypeScript Interfaces
interface ProcurementMetrics {
  total_pos_month: number;
  total_spend_month: number;
  avg_po_value: number;
  pending_approvals: number;
  pos_vs_last_month: number;
  spend_vs_last_month: number;
  avg_processing_time: number;
  approval_cycle_time: number;
}

interface SpendData {
  month: string;
  amount: number;
  budget: number;
  variance: number;
}

interface CategorySpend {
  category: string;
  amount: number;
  percentage: number;
  po_count: number;
}

interface VendorSpend {
  vendor_name: string;
  amount: number;
  percentage: number;
  po_count: number;
}

interface DepartmentSpend {
  department: string;
  amount: number;
  percentage: number;
  budget: number;
  variance: number;
}

interface POStatusData {
  status: string;
  count: number;
  percentage: number;
  value: number;
}

interface DeliveryPerformance {
  vendor_name: string;
  on_time: number;
  late: number;
  avg_delay_days: number;
  on_time_percentage: number;
}

interface CostSavings {
  type: string;
  description: string;
  amount: number;
  percentage: number;
}

interface QualityMetrics {
  vendor_name: string;
  total_received: number;
  accepted: number;
  rejected: number;
  rejection_rate: number;
}

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  last_generated?: string;
}

const ProcurementAnalyticsDashboard = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<'7d' | '1m' | '3m' | '6m' | '1y'>('1m');
  const [vendorFilter, setVendorFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [selectedChart, setSelectedChart] = useState<'spend' | 'category' | 'vendor' | 'delivery'>('spend');
  const [selectedReport, setSelectedReport] = useState('');

  const [metrics, setMetrics] = useState<ProcurementMetrics>({
    total_pos_month: 0,
    total_spend_month: 0,
    avg_po_value: 0,
    pending_approvals: 0,
    pos_vs_last_month: 0,
    spend_vs_last_month: 0,
    avg_processing_time: 0,
    approval_cycle_time: 0
  });

  const [spendTrend, setSpendTrend] = useState<SpendData[]>([]);
  const [categorySpend, setCategorySpend] = useState<CategorySpend[]>([]);
  const [vendorSpend, setVendorSpend] = useState<VendorSpend[]>([]);
  const [departmentSpend, setDepartmentSpend] = useState<DepartmentSpend[]>([]);
  const [poStatus, setPOStatus] = useState<POStatusData[]>([]);
  const [deliveryPerformance, setDeliveryPerformance] = useState<DeliveryPerformance[]>([]);
  const [costSavings, setCostSavings] = useState<CostSavings[]>([]);
  const [qualityMetrics, setQualityMetrics] = useState<QualityMetrics[]>([]);

  const reportTemplates: ReportTemplate[] = [
    {
      id: 'spend_analysis',
      name: 'Spend Analysis Report',
      description: 'Detailed spend analysis by category, vendor, and department',
      last_generated: '2025-01-15'
    },
    {
      id: 'vendor_performance',
      name: 'Vendor Performance Report',
      description: 'Comprehensive vendor performance metrics and ratings',
      last_generated: '2025-01-14'
    },
    {
      id: 'po_status',
      name: 'PO Status Report',
      description: 'Status overview of all purchase orders',
      last_generated: '2025-01-15'
    },
    {
      id: 'grn_report',
      name: 'GRN Report',
      description: 'Goods receipt notes with quality inspection details',
      last_generated: '2025-01-13'
    },
    {
      id: 'rejection_analysis',
      name: 'Rejection Analysis',
      description: 'Material rejection trends and vendor-wise analysis',
      last_generated: '2025-01-12'
    },
    {
      id: 'budget_variance',
      name: 'Budget vs Actual',
      description: 'Budget variance analysis by department and category',
      last_generated: '2025-01-10'
    }
  ];

  // Load data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      // Simulate API call
      setTimeout(() => {
        // Mock Metrics
        setMetrics({
          total_pos_month: 89,
          total_spend_month: 12750000,
          avg_po_value: 143258,
          pending_approvals: 12,
          pos_vs_last_month: 15.3,
          spend_vs_last_month: 8.7,
          avg_processing_time: 2.5,
          approval_cycle_time: 1.8
        });

        // Mock Spend Trend
        setSpendTrend([
          { month: 'Aug 2024', amount: 9850000, budget: 10000000, variance: -150000 },
          { month: 'Sep 2024', amount: 10250000, budget: 10000000, variance: 250000 },
          { month: 'Oct 2024', amount: 11200000, budget: 11000000, variance: 200000 },
          { month: 'Nov 2024', amount: 10900000, budget: 11000000, variance: -100000 },
          { month: 'Dec 2024', amount: 11750000, budget: 12000000, variance: -250000 },
          { month: 'Jan 2025', amount: 12750000, budget: 12500000, variance: 250000 }
        ]);

        // Mock Category Spend
        setCategorySpend([
          { category: 'Raw Materials', amount: 4850000, percentage: 38.0, po_count: 34 },
          { category: 'Components', amount: 2950000, percentage: 23.1, po_count: 28 },
          { category: 'Packaging', amount: 1560000, percentage: 12.2, po_count: 15 },
          { category: 'MRO Supplies', amount: 1240000, percentage: 9.7, po_count: 18 },
          { category: 'Logistics', amount: 980000, percentage: 7.7, po_count: 22 },
          { category: 'Chemicals', amount: 670000, percentage: 5.3, po_count: 9 },
          { category: 'Services', amount: 500000, percentage: 4.0, po_count: 7 }
        ]);

        // Mock Vendor Spend (Top 10)
        setVendorSpend([
          { vendor_name: 'Tata Steel Limited', amount: 3820000, percentage: 29.9, po_count: 15 },
          { vendor_name: 'JSW Steel', amount: 2890000, percentage: 22.7, po_count: 12 },
          { vendor_name: 'Bosch India', amount: 1980000, percentage: 15.5, po_count: 18 },
          { vendor_name: 'L&T Construction', amount: 1450000, percentage: 11.4, po_count: 3 },
          { vendor_name: 'SKF Bearings', amount: 1340000, percentage: 10.5, po_count: 11 },
          { vendor_name: 'Essar Steel', amount: 890000, percentage: 7.0, po_count: 8 },
          { vendor_name: 'Reliance Industries', amount: 760000, percentage: 6.0, po_count: 7 },
          { vendor_name: 'Mahindra Logistics', amount: 560000, percentage: 4.4, po_count: 14 },
          { vendor_name: 'ABC Chemicals Ltd', amount: 380000, percentage: 3.0, po_count: 5 },
          { vendor_name: 'XYZ Trading Co', amount: 290000, percentage: 2.3, po_count: 9 }
        ]);

        // Mock Department Spend
        setDepartmentSpend([
          { department: 'Production', amount: 6750000, percentage: 52.9, budget: 6500000, variance: 250000 },
          { department: 'Maintenance', amount: 2340000, percentage: 18.4, budget: 2500000, variance: -160000 },
          { department: 'Quality Control', amount: 1560000, percentage: 12.2, budget: 1500000, variance: 60000 },
          { department: 'R&D', amount: 980000, percentage: 7.7, budget: 1000000, variance: -20000 },
          { department: 'Logistics', amount: 720000, percentage: 5.6, budget: 750000, variance: -30000 },
          { department: 'Administration', amount: 400000, percentage: 3.1, budget: 500000, variance: -100000 }
        ]);

        // Mock PO Status
        setPOStatus([
          { status: 'Approved', count: 48, percentage: 53.9, value: 6870000 },
          { status: 'Pending Approval', count: 12, percentage: 13.5, value: 1720000 },
          { status: 'Partially Received', count: 18, percentage: 20.2, value: 2590000 },
          { status: 'Closed', count: 9, percentage: 10.1, value: 1290000 },
          { status: 'Draft', count: 2, percentage: 2.2, value: 280000 }
        ]);

        // Mock Delivery Performance
        setDeliveryPerformance([
          { vendor_name: 'Bosch India', on_time: 18, late: 0, avg_delay_days: 0, on_time_percentage: 100 },
          { vendor_name: 'Tata Steel Limited', on_time: 14, late: 1, avg_delay_days: 2, on_time_percentage: 93.3 },
          { vendor_name: 'SKF Bearings', on_time: 10, late: 1, avg_delay_days: 1, on_time_percentage: 90.9 },
          { vendor_name: 'JSW Steel', on_time: 10, late: 2, avg_delay_days: 3, on_time_percentage: 83.3 },
          { vendor_name: 'L&T Construction', on_time: 2, late: 1, avg_delay_days: 5, on_time_percentage: 66.7 },
          { vendor_name: 'Essar Steel', on_time: 5, late: 3, avg_delay_days: 6, on_time_percentage: 62.5 },
          { vendor_name: 'ABC Chemicals Ltd', on_time: 2, late: 3, avg_delay_days: 8, on_time_percentage: 40.0 }
        ]);

        // Mock Cost Savings
        setCostSavings([
          { type: 'Negotiated Savings', description: 'Price negotiation with vendors', amount: 560000, percentage: 4.4 },
          { type: 'Volume Discounts', description: 'Bulk purchase discounts', amount: 320000, percentage: 2.5 },
          { type: 'Early Payment Discounts', description: '2% discount on early payments', amount: 180000, percentage: 1.4 },
          { type: 'Vendor Consolidation', description: 'Reduced vendor base', amount: 120000, percentage: 0.9 }
        ]);

        // Mock Quality Metrics
        setQualityMetrics([
          { vendor_name: 'Bosch India', total_received: 5000, accepted: 4990, rejected: 10, rejection_rate: 0.2 },
          { vendor_name: 'SKF Bearings', total_received: 3200, accepted: 3150, rejected: 50, rejection_rate: 1.6 },
          { vendor_name: 'Tata Steel Limited', total_received: 8850, accepted: 8700, rejected: 150, rejection_rate: 1.7 },
          { vendor_name: 'JSW Steel', total_received: 5600, accepted: 5480, rejected: 120, rejection_rate: 2.1 },
          { vendor_name: 'Reliance Industries', total_received: 2400, accepted: 2330, rejected: 70, rejection_rate: 2.9 },
          { vendor_name: 'Essar Steel', total_received: 4850, accepted: 4420, rejected: 430, rejection_rate: 8.9 },
          { vendor_name: 'ABC Chemicals Ltd', total_received: 1200, accepted: 1050, rejected: 150, rejection_rate: 12.5 }
        ]);

        setLoading(false);
      }, 1200);
    };

    fetchData();
  }, [dateRange, vendorFilter, categoryFilter, departmentFilter]);

  const handleExportReport = (format: 'excel' | 'pdf') => {
    alert(`Exporting report as ${format.toUpperCase()}...`);
  };

  const handleScheduleReport = () => {
    alert('Schedule report functionality will be implemented');
  };

  const handleGenerateReport = (templateId: string) => {
    alert(`Generating ${reportTemplates.find(t => t.id === templateId)?.name}...`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading procurement analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Procurement Analytics & Reports</h1>
              <p className="text-sm text-gray-600 mt-1">Comprehensive procurement insights and performance metrics</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleScheduleReport}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Mail className="w-4 h-4" />
                Schedule
              </button>
              <button
                onClick={() => handleExportReport('excel')}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Download className="w-4 h-4" />
                Export Excel
              </button>
              <button
                onClick={() => handleExportReport('pdf')}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Printer className="w-4 h-4" />
                Export PDF
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="grid grid-cols-5 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Date Range</label>
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                >
                  <option value="7d">Last 7 Days</option>
                  <option value="1m">Last Month</option>
                  <option value="3m">Last 3 Months</option>
                  <option value="6m">Last 6 Months</option>
                  <option value="1y">Last Year</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Vendor</label>
                <select
                  value={vendorFilter}
                  onChange={(e) => setVendorFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Vendors</option>
                  <option value="V001">Tata Steel Limited</option>
                  <option value="V002">JSW Steel</option>
                  <option value="V004">Bosch India</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Categories</option>
                  <option value="raw_materials">Raw Materials</option>
                  <option value="components">Components</option>
                  <option value="packaging">Packaging</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Department</label>
                <select
                  value={departmentFilter}
                  onChange={(e) => setDepartmentFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Departments</option>
                  <option value="production">Production</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="quality">Quality Control</option>
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={() => {
                    setVendorFilter('all');
                    setCategoryFilter('all');
                    setDepartmentFilter('all');
                  }}
                  className="flex items-center gap-2 w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <RefreshCw className="w-4 h-4" />
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats Cards */}
        <div className="grid grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <ShoppingCart className="w-6 h-6 text-blue-600" />
              </div>
              <span className={`text-xs font-medium flex items-center gap-1 ${
                metrics.pos_vs_last_month >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {metrics.pos_vs_last_month >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {Math.abs(metrics.pos_vs_last_month)}%
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{metrics.total_pos_month}</h3>
            <p className="text-sm text-gray-600 mt-1">Total POs (Month)</p>
            <p className="text-xs text-gray-500 mt-2">vs last month</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <span className={`text-xs font-medium flex items-center gap-1 ${
                metrics.spend_vs_last_month >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {metrics.spend_vs_last_month >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {Math.abs(metrics.spend_vs_last_month)}%
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">
              {(metrics.total_spend_month / 1000000).toFixed(1)}M
            </h3>
            <p className="text-sm text-gray-600 mt-1">Total Spend</p>
            <p className="text-xs text-gray-500 mt-2">vs last month</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-xs font-medium text-blue-600 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                Avg
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">
              {(metrics.avg_po_value / 1000).toFixed(0)}K
            </h3>
            <p className="text-sm text-gray-600 mt-1">Avg PO Value</p>
            <p className="text-xs text-gray-500 mt-2">Per purchase order</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 bg-orange-100 rounded-lg">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
              <span className="text-xs font-medium text-orange-600 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                Pending
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{metrics.pending_approvals}</h3>
            <p className="text-sm text-gray-600 mt-1">Pending Approvals</p>
            <p className="text-xs text-gray-500 mt-2">Awaiting action</p>
          </div>
        </div>

        {/* Spend Analysis Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            Month-wise Spend Trend
          </h3>
          <div className="space-y-3">
            {spendTrend.map((data, index) => {
              const maxAmount = Math.max(...spendTrend.map(d => d.amount));
              const percentage = (data.amount / maxAmount) * 100;
              const budgetPercentage = (data.budget / maxAmount) * 100;
              return (
                <div key={index}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-900">{data.month}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-600">
                        Actual: <span className="font-bold text-gray-900">{(data.amount / 1000000).toFixed(1)}M</span>
                      </span>
                      <span className="text-sm text-gray-600">
                        Budget: <span className="font-medium text-gray-700">{(data.budget / 1000000).toFixed(1)}M</span>
                      </span>
                      <span className={`text-sm font-medium ${data.variance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {data.variance >= 0 ? '+' : ''}{(data.variance / 1000).toFixed(0)}K
                      </span>
                    </div>
                  </div>
                  <div className="relative h-8 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="absolute h-full bg-blue-200 rounded-full transition-all"
                      style={{ width: `${budgetPercentage}%` }}
                    ></div>
                    <div
                      className="absolute h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    ></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xs font-medium text-white drop-shadow">
                        {((data.amount / data.budget) * 100).toFixed(0)}% of budget
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Category & Vendor Spend */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* Category-wise Spend */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <PieChart className="w-5 h-5 text-green-600" />
              Category-wise Spend
            </h3>
            <div className="space-y-3">
              {categorySpend.map((cat, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-900">{cat.category}</span>
                      <span className="text-sm font-bold text-gray-900">
                        {(cat.amount / 1000000).toFixed(1)}M
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full"
                          style={{ width: `${cat.percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-600 w-12">{cat.percentage}%</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{cat.po_count} POs</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Vendor-wise Spend */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-purple-600" />
              Top 10 Vendors by Spend
            </h3>
            <div className="space-y-2">
              {vendorSpend.map((vendor, index) => (
                <div key={index} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                  <span className="text-xs font-medium text-gray-500 w-6">#{index + 1}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-900 truncate">{vendor.vendor_name}</span>
                      <span className="text-sm font-bold text-gray-900">
                        {(vendor.amount / 1000000).toFixed(1)}M
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                        <div
                          className="bg-gradient-to-r from-purple-500 to-purple-600 h-1.5 rounded-full"
                          style={{ width: `${vendor.percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-500">{vendor.po_count} POs</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Department Spend & PO Status */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* Department-wise Spend */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-600" />
              Department-wise Spend
            </h3>
            <div className="space-y-3">
              {departmentSpend.map((dept, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-900">{dept.department}</span>
                    <span className="text-sm font-bold text-gray-900">
                      {(dept.amount / 1000000).toFixed(1)}M
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <span className="text-gray-500">Budget:</span>
                      <span className="ml-1 font-medium text-gray-700">
                        {(dept.budget / 1000000).toFixed(1)}M
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Variance:</span>
                      <span className={`ml-1 font-bold ${dept.variance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {dept.variance >= 0 ? '+' : ''}{(dept.variance / 1000).toFixed(0)}K
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">% of Total:</span>
                      <span className="ml-1 font-medium text-gray-700">{dept.percentage}%</span>
                    </div>
                  </div>
                  <div className="mt-2 bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        dept.variance >= 0 ? 'bg-gradient-to-r from-green-500 to-green-600' : 'bg-gradient-to-r from-red-500 to-red-600'
                      }`}
                      style={{ width: `${(dept.amount / dept.budget) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* PO Status Distribution */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              PO Status Distribution
            </h3>
            <div className="space-y-4">
              {poStatus.map((status, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      status.status === 'Approved' ? 'bg-green-100' :
                      status.status === 'Pending Approval' ? 'bg-yellow-100' :
                      status.status === 'Partially Received' ? 'bg-blue-100' :
                      status.status === 'Closed' ? 'bg-gray-100' :
                      'bg-orange-100'
                    }`}>
                      {status.status === 'Approved' && <CheckCircle className="w-5 h-5 text-green-600" />}
                      {status.status === 'Pending Approval' && <Clock className="w-5 h-5 text-yellow-600" />}
                      {status.status === 'Partially Received' && <Package className="w-5 h-5 text-blue-600" />}
                      {status.status === 'Closed' && <XCircle className="w-5 h-5 text-gray-600" />}
                      {status.status === 'Draft' && <FileText className="w-5 h-5 text-orange-600" />}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{status.status}</p>
                      <p className="text-xs text-gray-500">{status.count} POs</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">{status.percentage}%</p>
                    <p className="text-xs text-gray-500">{(status.value / 1000000).toFixed(1)}M</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Delivery Performance */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Truck className="w-5 h-5 text-orange-600" />
            Delivery Performance by Vendor
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="text-left text-xs font-semibold text-gray-700 p-3 border-b">Vendor</th>
                  <th className="text-center text-xs font-semibold text-gray-700 p-3 border-b">On-Time</th>
                  <th className="text-center text-xs font-semibold text-gray-700 p-3 border-b">Late</th>
                  <th className="text-center text-xs font-semibold text-gray-700 p-3 border-b">Avg Delay (Days)</th>
                  <th className="text-center text-xs font-semibold text-gray-700 p-3 border-b">OTD %</th>
                  <th className="text-center text-xs font-semibold text-gray-700 p-3 border-b">Performance</th>
                </tr>
              </thead>
              <tbody>
                {deliveryPerformance.map((vendor, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="p-3 border-b text-sm font-medium text-gray-900">{vendor.vendor_name}</td>
                    <td className="p-3 border-b text-center">
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                        <CheckCircle className="w-3 h-3" />
                        {vendor.on_time}
                      </span>
                    </td>
                    <td className="p-3 border-b text-center">
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
                        <XCircle className="w-3 h-3" />
                        {vendor.late}
                      </span>
                    </td>
                    <td className="p-3 border-b text-center text-sm font-medium text-gray-900">
                      {vendor.avg_delay_days}
                    </td>
                    <td className="p-3 border-b text-center">
                      <span className={`text-sm font-bold ${
                        vendor.on_time_percentage >= 90 ? 'text-green-600' :
                        vendor.on_time_percentage >= 75 ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        {vendor.on_time_percentage}%
                      </span>
                    </td>
                    <td className="p-3 border-b text-center">
                      {vendor.on_time_percentage >= 90 ? (
                        <ThumbsUp className="w-5 h-5 text-green-600 mx-auto" />
                      ) : vendor.on_time_percentage < 75 ? (
                        <ThumbsDown className="w-5 h-5 text-red-600 mx-auto" />
                      ) : (
                        <div className="w-5 h-5 bg-yellow-400 rounded-full mx-auto"></div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Cost Savings & Quality Metrics */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* Cost Savings Analysis */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-green-600" />
              Cost Savings Analysis
            </h3>
            <div className="space-y-3">
              {costSavings.map((saving, index) => (
                <div key={index} className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-900">{saving.type}</span>
                    <span className="text-lg font-bold text-green-600">
                      {(saving.amount / 1000).toFixed(0)}K
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">{saving.description}</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-green-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full"
                        style={{ width: `${(saving.percentage / 5) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-xs font-medium text-green-700">{saving.percentage}%</span>
                  </div>
                </div>
              ))}
              <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-gray-900">Total Savings</span>
                  <span className="text-2xl font-bold text-blue-600">
                    {(costSavings.reduce((sum, s) => sum + s.amount, 0) / 1000).toFixed(0)}K
                  </span>
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  {costSavings.reduce((sum, s) => sum + s.percentage, 0).toFixed(1)}% of total spend
                </p>
              </div>
            </div>
          </div>

          {/* Quality Metrics */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-red-600" />
              Rejection Rate by Vendor
            </h3>
            <div className="space-y-2">
              {qualityMetrics.map((metric, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900">{metric.vendor_name}</span>
                    <span className={`text-lg font-bold ${
                      metric.rejection_rate <= 2 ? 'text-green-600' :
                      metric.rejection_rate <= 5 ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {metric.rejection_rate}%
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs mb-2">
                    <div>
                      <span className="text-gray-500">Received:</span>
                      <span className="ml-1 font-medium text-gray-700">{metric.total_received.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Accepted:</span>
                      <span className="ml-1 font-medium text-green-600">{metric.accepted.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Rejected:</span>
                      <span className="ml-1 font-medium text-red-600">{metric.rejected.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        metric.rejection_rate <= 2 ? 'bg-gradient-to-r from-green-500 to-green-600' :
                        metric.rejection_rate <= 5 ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' :
                        'bg-gradient-to-r from-red-500 to-red-600'
                      }`}
                      style={{ width: `${Math.min(metric.rejection_rate * 5, 100)}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Process Metrics */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Timer className="w-5 h-5 text-purple-600" />
            Process Efficiency Metrics
          </h3>
          <div className="grid grid-cols-4 gap-4">
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <p className="text-xs font-medium text-purple-700 mb-2">Avg PO Processing Time</p>
              <p className="text-3xl font-bold text-purple-900">{metrics.avg_processing_time}</p>
              <p className="text-xs text-purple-600 mt-1">days</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-xs font-medium text-blue-700 mb-2">Approval Cycle Time</p>
              <p className="text-3xl font-bold text-blue-900">{metrics.approval_cycle_time}</p>
              <p className="text-xs text-blue-600 mt-1">days</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <p className="text-xs font-medium text-green-700 mb-2">PO Approval Rate</p>
              <p className="text-3xl font-bold text-green-900">94.2</p>
              <p className="text-xs text-green-600 mt-1">%</p>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
              <p className="text-xs font-medium text-orange-700 mb-2">Avg Delivery Time</p>
              <p className="text-3xl font-bold text-orange-900">6.5</p>
              <p className="text-xs text-orange-600 mt-1">days</p>
            </div>
          </div>
        </div>

        {/* Report Templates */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-600" />
            Report Templates
          </h3>
          <div className="grid grid-cols-3 gap-4">
            {reportTemplates.map((template) => (
              <div
                key={template.id}
                className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FileCheck className="w-5 h-5 text-blue-600" />
                  </div>
                  <button
                    onClick={() => handleGenerateReport(template.id)}
                    className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
                <h4 className="text-sm font-semibold text-gray-900 mb-1">{template.name}</h4>
                <p className="text-xs text-gray-600 mb-3">{template.description}</p>
                {template.last_generated && (
                  <p className="text-xs text-gray-500">Last generated: {template.last_generated}</p>
                )}
                <button
                  onClick={() => handleGenerateReport(template.id)}
                  className="mt-3 w-full px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
                >
                  Generate Report
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcurementAnalyticsDashboard;

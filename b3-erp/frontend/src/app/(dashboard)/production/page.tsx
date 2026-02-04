'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Factory,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  Package,
  Activity,
  BarChart3,
  Calendar,
  Settings,
  PlayCircle,
  PauseCircle,
  StopCircle,
  Wrench,
  Target,
  Zap,
  Loader2
} from 'lucide-react';
import { workOrderService, WorkOrder } from '@/services/work-order.service';
import { workCenterService, WorkCenter } from '@/services/work-center.service';

// UI interfaces for display - mapped from service data
interface ProductionOrderDisplay {
  id: string;
  orderNumber: string;
  productName: string;
  productCode: string;
  quantity: number;
  producedQty: number;
  status: 'scheduled' | 'in-progress' | 'paused' | 'completed' | 'delayed';
  priority: 'critical' | 'high' | 'medium' | 'low';
  startDate: string;
  dueDate: string;
  workCenter: string;
  operator: string;
  efficiency: number;
}

interface WorkCenterDisplay {
  id: string;
  name: string;
  code: string;
  status: 'running' | 'idle' | 'maintenance' | 'breakdown';
  currentJob: string;
  utilizationRate: number;
  oee: number;
  availability: number;
  performance: number;
  quality: number;
}

interface QualityMetric {
  shift: string;
  produced: number;
  passed: number;
  rejected: number;
  reworked: number;
  defectRate: number;
}

// Helper functions to map service data to display format
function mapWorkOrderToDisplay(wo: WorkOrder): ProductionOrderDisplay {
  const statusMap: Record<string, ProductionOrderDisplay['status']> = {
    'Draft': 'scheduled',
    'Planned': 'scheduled',
    'Released': 'scheduled',
    'In Progress': 'in-progress',
    'On Hold': 'paused',
    'Completed': 'completed',
    'Cancelled': 'delayed',
  };

  const priorityMap: Record<string, ProductionOrderDisplay['priority']> = {
    'Low': 'low',
    'Medium': 'medium',
    'High': 'high',
    'Critical': 'critical',
  };

  // Check if delayed (past due date and not completed)
  const today = new Date();
  const dueDate = new Date(wo.plannedEndDate);
  const isDelayed = dueDate < today && wo.status !== 'Completed';

  return {
    id: wo.id,
    orderNumber: wo.workOrderNumber,
    productName: wo.productName,
    productCode: wo.productCode,
    quantity: wo.plannedQuantity,
    producedQty: wo.completedQuantity,
    status: isDelayed ? 'delayed' : (statusMap[wo.status] || 'scheduled'),
    priority: priorityMap[wo.priority] || 'medium',
    startDate: wo.plannedStartDate,
    dueDate: wo.plannedEndDate,
    workCenter: wo.scheduledWorkCenterName || 'Not Assigned',
    operator: 'Production Team',
    efficiency: wo.plannedQuantity > 0 ? Math.round((wo.completedQuantity / wo.plannedQuantity) * 100) : 0,
  };
}

function mapWorkCenterToDisplay(wc: WorkCenter): WorkCenterDisplay {
  const statusMap: Record<string, WorkCenterDisplay['status']> = {
    'Active': wc.currentJobNumber ? 'running' : 'idle',
    'Inactive': 'idle',
    'Maintenance': 'maintenance',
    'Decommissioned': 'breakdown',
  };

  return {
    id: wc.id,
    name: wc.workCenterName,
    code: wc.workCenterCode,
    status: statusMap[wc.status] || 'idle',
    currentJob: wc.currentJobNumber || 'None',
    utilizationRate: wc.capacity.utilization,
    oee: Math.round((wc.capacity.efficiency * wc.capacity.utilization) / 100),
    availability: Math.round(wc.capacity.efficiency * 0.95), // Estimate
    performance: Math.round(wc.capacity.efficiency),
    quality: 95, // Default quality metric
  };
}

export default function ProductionPage() {
  const [selectedView, setSelectedView] = useState<'overview' | 'orders' | 'machines'>('overview');
  const [timeFilter, setTimeFilter] = useState<'today' | 'week' | 'month'>('today');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [productionOrders, setProductionOrders] = useState<ProductionOrderDisplay[]>([]);
  const [workCenters, setWorkCenters] = useState<WorkCenterDisplay[]>([]);

  // Fetch data from services
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const [workOrders, workCenterData] = await Promise.all([
          workOrderService.getAllWorkOrders(),
          workCenterService.getAllWorkCenters(),
        ]);

        setProductionOrders(workOrders.map(mapWorkOrderToDisplay));
        setWorkCenters(workCenterData.map(mapWorkCenterToDisplay));
      } catch (err) {
        console.error('Error fetching production data:', err);
        setError('Failed to load production data. Please try again.');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);


  // Quality Metrics Data
  const qualityMetrics: QualityMetric[] = [
    { shift: 'Shift A (6AM-2PM)', produced: 1250, passed: 1180, rejected: 45, reworked: 25, defectRate: 3.6 },
    { shift: 'Shift B (2PM-10PM)', produced: 1180, passed: 1120, rejected: 38, reworked: 22, defectRate: 3.2 },
    { shift: 'Shift C (10PM-6AM)', produced: 980, passed: 935, rejected: 28, reworked: 17, defectRate: 2.9 }
  ];

  // Calculate KPIs
  const totalOrders = productionOrders.length;
  const inProgressOrders = productionOrders.filter(o => o.status === 'in-progress').length;
  const completedOrders = productionOrders.filter(o => o.status === 'completed').length;
  const delayedOrders = productionOrders.filter(o => o.status === 'delayed').length;

  const totalPlanned = productionOrders.reduce((sum, o) => sum + o.quantity, 0);
  const totalProduced = productionOrders.reduce((sum, o) => sum + o.producedQty, 0);
  const productionEfficiency = totalPlanned > 0 ? Math.round((totalProduced / totalPlanned) * 100) : 0;

  const runningMachines = workCenters.filter(w => w.status === 'running').length;
  const totalMachines = workCenters.length;
  const avgOEE = Math.round(workCenters.reduce((sum, w) => sum + w.oee, 0) / workCenters.length);
  const avgUtilization = Math.round(workCenters.reduce((sum, w) => sum + w.utilizationRate, 0) / workCenters.length);

  const totalQualityProduced = qualityMetrics.reduce((sum, q) => sum + q.produced, 0);
  const totalQualityPassed = qualityMetrics.reduce((sum, q) => sum + q.passed, 0);
  const totalQualityRejected = qualityMetrics.reduce((sum, q) => sum + q.rejected, 0);
  const overallDefectRate = totalQualityProduced > 0 ? ((totalQualityRejected / totalQualityProduced) * 100).toFixed(1) : '0.0';
  const firstPassYield = totalQualityProduced > 0 ? Math.round((totalQualityPassed / totalQualityProduced) * 100) : 0;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-green-100 text-green-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'delayed': return 'bg-red-100 text-red-800';
      case 'running': return 'bg-green-100 text-green-800';
      case 'idle': return 'bg-gray-100 text-gray-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      case 'breakdown': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running':
      case 'in-progress':
        return <PlayCircle className="w-4 h-4" />;
      case 'paused':
      case 'maintenance':
        return <PauseCircle className="w-4 h-4" />;
      case 'idle':
        return <StopCircle className="w-4 h-4" />;
      case 'breakdown':
      case 'delayed':
        return <AlertTriangle className="w-4 h-4" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-2" />
          <p className="text-gray-600">Loading production data...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-red-600 mb-2" />
          <p className="text-gray-900 font-semibold mb-2">Error Loading Data</p>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-3 py-8">
        {/* Header */}
        <div className="mb-3">
          <Link href="/" className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 mb-2">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="h-12 w-12 bg-red-500 rounded-lg flex items-center justify-center mr-4">
                <Factory className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Production Dashboard</h1>
                <p className="text-gray-600">Real-time production monitoring & control</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <select
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                <Settings className="w-4 h-4" />
                Settings
              </button>
            </div>
          </div>
        </div>

        {/* View Tabs */}
        <div className="mb-3 border-b border-gray-200">
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedView('overview')}
              className={`px-4 py-2 border-b-2 font-medium transition-colors ${
                selectedView === 'overview'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setSelectedView('orders')}
              className={`px-4 py-2 border-b-2 font-medium transition-colors ${
                selectedView === 'orders'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Production Orders
            </button>
            <button
              onClick={() => setSelectedView('machines')}
              className={`px-4 py-2 border-b-2 font-medium transition-colors ${
                selectedView === 'machines'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Work Centers
            </button>
          </div>
        </div>

        {/* Overview Tab */}
        {selectedView === 'overview' && (
          <>
            {/* KPI Cards - Row 1: Production Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
              <div className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-600">Total Orders</h3>
                  <Package className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-3xl font-bold text-gray-900">{totalOrders}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {inProgressOrders} in progress
                    </p>
                  </div>
                  <div className="flex items-center text-green-600">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    <span className="text-sm font-medium">+8%</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-600">Production Output</h3>
                  <Target className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-3xl font-bold text-gray-900">{totalProduced}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      of {totalPlanned} units planned
                    </p>
                  </div>
                  <div className="flex items-center text-green-600">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    <span className="text-sm font-medium">+12%</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-600">Production Efficiency</h3>
                  <Activity className="w-5 h-5 text-purple-600" />
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-3xl font-bold text-gray-900">{productionEfficiency}%</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Target: 85%
                    </p>
                  </div>
                  <div className={`flex items-center ${productionEfficiency >= 85 ? 'text-green-600' : 'text-orange-600'}`}>
                    {productionEfficiency >= 85 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                    <span className="text-sm font-medium">{productionEfficiency >= 85 ? '+5%' : '-3%'}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-600">Delayed Orders</h3>
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-3xl font-bold text-red-600">{delayedOrders}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Requires attention
                    </p>
                  </div>
                  <div className="flex items-center text-red-600">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    <span className="text-sm font-medium">+2</span>
                  </div>
                </div>
              </div>
            </div>

            {/* KPI Cards - Row 2: Machine & Quality Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
              <div className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-600">Machine Status</h3>
                  <Zap className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-3xl font-bold text-gray-900">{runningMachines}/{totalMachines}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Machines running
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-600">Util: {avgUtilization}%</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-600">Average OEE</h3>
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-3xl font-bold text-gray-900">{avgOEE}%</p>
                    <p className="text-sm text-gray-500 mt-1">
                      World-class: 85%
                    </p>
                  </div>
                  <div className="flex items-center text-orange-600">
                    <TrendingDown className="w-4 h-4 mr-1" />
                    <span className="text-sm font-medium">-2%</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-600">First Pass Yield</h3>
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-3xl font-bold text-gray-900">{firstPassYield}%</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {totalQualityPassed} of {totalQualityProduced}
                    </p>
                  </div>
                  <div className="flex items-center text-green-600">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    <span className="text-sm font-medium">+1.5%</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-600">Defect Rate</h3>
                  <AlertTriangle className="w-5 h-5 text-orange-600" />
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-3xl font-bold text-gray-900">{overallDefectRate}%</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {totalQualityRejected} rejected
                    </p>
                  </div>
                  <div className="flex items-center text-green-600">
                    <TrendingDown className="w-4 h-4 mr-1" />
                    <span className="text-sm font-medium">-0.5%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Production Orders Summary & Quality by Shift */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-3">
              {/* Active Production Orders */}
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Active Production Orders</h3>
                  <p className="text-sm text-gray-500">Current orders in progress</p>
                </div>
                <div className="p-6">
                  <div className="space-y-2">
                    {productionOrders
                      .filter(o => o.status === 'in-progress' || o.status === 'delayed' || o.status === 'paused')
                      .slice(0, 4)
                      .map((order) => (
                        <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold text-gray-900">{order.orderNumber}</span>
                              <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                                {order.status}
                              </span>
                              <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getPriorityColor(order.priority)}`}>
                                {order.priority}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600">{order.productName}</p>
                            <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                              <span>WC: {order.workCenter}</span>
                              <span>Due: {order.dueDate}</span>
                            </div>
                          </div>
                          <div className="text-right ml-4">
                            <div className="text-lg font-bold text-gray-900">
                              {order.producedQty}/{order.quantity}
                            </div>
                            <div className="text-sm text-gray-500">
                              {Math.round((order.producedQty / order.quantity) * 100)}% complete
                            </div>
                            <div className="mt-2 w-32 bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${
                                  order.status === 'delayed' ? 'bg-red-500' :
                                  order.status === 'paused' ? 'bg-yellow-500' :
                                  'bg-green-500'
                                }`}
                                style={{ width: `${(order.producedQty / order.quantity) * 100}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>

              {/* Quality Metrics by Shift */}
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Quality Metrics by Shift</h3>
                  <p className="text-sm text-gray-500">Today's production quality</p>
                </div>
                <div className="p-6">
                  <div className="space-y-2">
                    {qualityMetrics.map((metric, idx) => (
                      <div key={idx} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <span className="font-semibold text-gray-900">{metric.shift}</span>
                          <span className={`text-sm font-semibold ${
                            metric.defectRate < 3 ? 'text-green-600' :
                            metric.defectRate < 5 ? 'text-yellow-600' :
                            'text-red-600'
                          }`}>
                            {metric.defectRate}% defect rate
                          </span>
                        </div>
                        <div className="grid grid-cols-4 gap-3 text-center text-sm">
                          <div>
                            <p className="text-gray-500">Produced</p>
                            <p className="font-semibold text-gray-900">{metric.produced}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Passed</p>
                            <p className="font-semibold text-green-600">{metric.passed}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Rejected</p>
                            <p className="font-semibold text-red-600">{metric.rejected}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Reworked</p>
                            <p className="font-semibold text-yellow-600">{metric.reworked}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Work Centers Status Overview */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Work Centers Status</h3>
                <p className="text-sm text-gray-500">Real-time machine monitoring</p>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                  {workCenters.map((wc) => (
                    <div key={wc.id} className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-gray-900">{wc.code}</h4>
                          <p className="text-sm text-gray-600">{wc.name}</p>
                        </div>
                        <span className={`flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(wc.status)}`}>
                          {getStatusIcon(wc.status)}
                          {wc.status}
                        </span>
                      </div>

                      <div className="mb-3">
                        <p className="text-xs text-gray-500 mb-1">Current Job</p>
                        <p className="text-sm font-medium text-gray-900">{wc.currentJob}</p>
                      </div>

                      <div className="space-y-2">
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-gray-600">OEE</span>
                            <span className={`font-semibold ${
                              wc.oee >= 75 ? 'text-green-600' :
                              wc.oee >= 60 ? 'text-yellow-600' :
                              'text-red-600'
                            }`}>{wc.oee}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div
                              className={`h-1.5 rounded-full ${
                                wc.oee >= 75 ? 'bg-green-500' :
                                wc.oee >= 60 ? 'bg-yellow-500' :
                                'bg-red-500'
                              }`}
                              style={{ width: `${wc.oee}%` }}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div>
                            <p className="text-gray-500">Avail.</p>
                            <p className="font-semibold text-gray-900">{wc.availability}%</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Perf.</p>
                            <p className="font-semibold text-gray-900">{wc.performance}%</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Qual.</p>
                            <p className="font-semibold text-gray-900">{wc.quality}%</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {/* Production Orders Tab */}
        {selectedView === 'orders' && (
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">All Production Orders</h3>
              <p className="text-sm text-gray-500">Detailed view of all production orders</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Order #</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Work Center</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Operator</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Progress</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Efficiency</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Due Date</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Priority</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {productionOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-3 py-2 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-900">{order.orderNumber}</span>
                      </td>
                      <td className="px-3 py-2">
                        <div className="text-sm font-medium text-gray-900">{order.productName}</div>
                        <div className="text-sm text-gray-500">{order.productCode}</div>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <span className="text-sm text-gray-900">{order.workCenter}</span>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <span className="text-sm text-gray-900">{order.operator}</span>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">{order.producedQty}/{order.quantity}</div>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                order.status === 'delayed' ? 'bg-red-500' :
                                order.status === 'paused' ? 'bg-yellow-500' :
                                order.status === 'completed' ? 'bg-gray-500' :
                                'bg-green-500'
                              }`}
                              style={{ width: `${(order.producedQty / order.quantity) * 100}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-600">{Math.round((order.producedQty / order.quantity) * 100)}%</span>
                        </div>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <span className={`text-sm font-semibold ${
                          order.efficiency >= 85 ? 'text-green-600' :
                          order.efficiency >= 70 ? 'text-yellow-600' :
                          order.efficiency > 0 ? 'text-red-600' :
                          'text-gray-400'
                        }`}>
                          {order.efficiency > 0 ? `${order.efficiency}%` : '-'}
                        </span>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <span className="text-sm text-gray-900">{order.dueDate}</span>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(order.priority)}`}>
                          {order.priority}
                        </span>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <span className={`flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)} w-fit`}>
                          {getStatusIcon(order.status)}
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Work Centers Tab */}
        {selectedView === 'machines' && (
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Work Centers Performance</h3>
              <p className="text-sm text-gray-500">Detailed OEE metrics and machine status</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Work Center Name</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Current Job</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Utilization</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">OEE</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Availability</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Performance</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Quality</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {workCenters.map((wc) => (
                    <tr key={wc.id} className="hover:bg-gray-50">
                      <td className="px-3 py-2 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-900">{wc.code}</span>
                      </td>
                      <td className="px-3 py-2">
                        <span className="text-sm text-gray-900">{wc.name}</span>
                      </td>
                      <td className="px-3 py-2">
                        <span className="text-sm text-gray-900">{wc.currentJob}</span>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <span className={`flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(wc.status)} w-fit`}>
                          {getStatusIcon(wc.status)}
                          {wc.status}
                        </span>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${wc.utilizationRate}%` }}
                            />
                          </div>
                          <span className="text-sm font-semibold text-gray-900">{wc.utilizationRate}%</span>
                        </div>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <span className={`text-sm font-semibold ${
                          wc.oee >= 75 ? 'text-green-600' :
                          wc.oee >= 60 ? 'text-yellow-600' :
                          'text-red-600'
                        }`}>
                          {wc.oee}%
                        </span>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <span className="text-sm text-gray-900">{wc.availability}%</span>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <span className="text-sm text-gray-900">{wc.performance}%</span>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <span className="text-sm text-gray-900">{wc.quality}%</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

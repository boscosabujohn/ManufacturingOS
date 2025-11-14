'use client';

import React, { useState } from 'react';
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
  Zap
} from 'lucide-react';

interface ProductionOrder {
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

interface WorkCenter {
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

export default function ProductionPage() {
  const [selectedView, setSelectedView] = useState<'overview' | 'orders' | 'machines'>('overview');
  const [timeFilter, setTimeFilter] = useState<'today' | 'week' | 'month'>('today');

  // Production Orders Data
  const productionOrders: ProductionOrder[] = [
    {
      id: '1',
      orderNumber: 'PO-2025-001',
      productName: 'Precision Shaft Assembly',
      productCode: 'PSA-2400',
      quantity: 500,
      producedQty: 425,
      status: 'in-progress',
      priority: 'high',
      startDate: '2025-11-12',
      dueDate: '2025-11-15',
      workCenter: 'CNC-CUT-01',
      operator: 'Rajesh Kumar',
      efficiency: 85
    },
    {
      id: '2',
      orderNumber: 'PO-2025-002',
      productName: 'Hydraulic Cylinder Body',
      productCode: 'HCB-1800',
      quantity: 200,
      producedQty: 200,
      status: 'completed',
      priority: 'medium',
      startDate: '2025-11-10',
      dueDate: '2025-11-13',
      workCenter: 'PRESS-HYDRO-01',
      operator: 'Sunil Technician',
      efficiency: 92
    },
    {
      id: '3',
      orderNumber: 'PO-2025-003',
      productName: 'Gear Box Housing',
      productCode: 'GBH-3200',
      quantity: 150,
      producedQty: 0,
      status: 'scheduled',
      priority: 'critical',
      startDate: '2025-11-15',
      dueDate: '2025-11-18',
      workCenter: 'LASER-CUT-02',
      operator: 'Not Assigned',
      efficiency: 0
    },
    {
      id: '4',
      orderNumber: 'PO-2025-004',
      productName: 'Conveyor Roller Assembly',
      productCode: 'CRA-1500',
      quantity: 300,
      producedQty: 180,
      status: 'delayed',
      priority: 'high',
      startDate: '2025-11-08',
      dueDate: '2025-11-14',
      workCenter: 'ASSY-LINE-01',
      operator: 'Maintenance Team A',
      efficiency: 60
    },
    {
      id: '5',
      orderNumber: 'PO-2025-005',
      productName: 'Motor Mounting Bracket',
      productCode: 'MMB-0800',
      quantity: 800,
      producedQty: 450,
      status: 'paused',
      priority: 'medium',
      startDate: '2025-11-11',
      dueDate: '2025-11-16',
      workCenter: 'WELD-ST-01',
      operator: 'Ramesh Technician',
      efficiency: 56
    },
    {
      id: '6',
      orderNumber: 'PO-2025-006',
      productName: 'Control Panel Enclosure',
      productCode: 'CPE-2200',
      quantity: 100,
      producedQty: 75,
      status: 'in-progress',
      priority: 'high',
      startDate: '2025-11-13',
      dueDate: '2025-11-15',
      workCenter: 'PAINT-BOOTH-01',
      operator: 'Cleaning Crew',
      efficiency: 75
    }
  ];

  // Work Centers Data
  const workCenters: WorkCenter[] = [
    {
      id: '1',
      name: 'CNC Cutting Machine #1',
      code: 'CNC-CUT-01',
      status: 'running',
      currentJob: 'PO-2025-001',
      utilizationRate: 85,
      oee: 72,
      availability: 90,
      performance: 85,
      quality: 94
    },
    {
      id: '2',
      name: 'Hydraulic Press Machine',
      code: 'PRESS-HYDRO-01',
      status: 'idle',
      currentJob: 'None',
      utilizationRate: 45,
      oee: 68,
      availability: 75,
      performance: 88,
      quality: 97
    },
    {
      id: '3',
      name: 'Laser Cutting Machine #2',
      code: 'LASER-CUT-02',
      status: 'idle',
      currentJob: 'None',
      utilizationRate: 30,
      oee: 65,
      availability: 72,
      performance: 82,
      quality: 95
    },
    {
      id: '4',
      name: 'TIG Welding Station #1',
      code: 'WELD-ST-01',
      status: 'maintenance',
      currentJob: 'PO-2025-005 (Paused)',
      utilizationRate: 20,
      oee: 45,
      availability: 50,
      performance: 78,
      quality: 92
    },
    {
      id: '5',
      name: 'Assembly Conveyor Line #1',
      code: 'ASSY-LINE-01',
      status: 'running',
      currentJob: 'PO-2025-004',
      utilizationRate: 78,
      oee: 70,
      availability: 88,
      performance: 80,
      quality: 96
    },
    {
      id: '6',
      name: 'Powder Coating Booth #1',
      code: 'PAINT-BOOTH-01',
      status: 'running',
      currentJob: 'PO-2025-006',
      utilizationRate: 82,
      oee: 75,
      availability: 92,
      performance: 83,
      quality: 98
    }
  ];

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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 mb-4">
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
        <div className="mb-6 border-b border-gray-200">
          <div className="flex gap-4">
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
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

              <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
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

              <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
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

              <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
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

              <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
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

              <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
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

              <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Active Production Orders */}
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Active Production Orders</h3>
                  <p className="text-sm text-gray-500">Current orders in progress</p>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {productionOrders
                      .filter(o => o.status === 'in-progress' || o.status === 'delayed' || o.status === 'paused')
                      .slice(0, 4)
                      .map((order) => (
                        <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
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
                            <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
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
                  <div className="space-y-4">
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order #</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Work Center</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Operator</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Progress</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Efficiency</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Due Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Priority</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {productionOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-900">{order.orderNumber}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{order.productName}</div>
                        <div className="text-sm text-gray-500">{order.productCode}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">{order.workCenter}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">{order.operator}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">{order.producedQty}/{order.quantity}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
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
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-sm font-semibold ${
                          order.efficiency >= 85 ? 'text-green-600' :
                          order.efficiency >= 70 ? 'text-yellow-600' :
                          order.efficiency > 0 ? 'text-red-600' :
                          'text-gray-400'
                        }`}>
                          {order.efficiency > 0 ? `${order.efficiency}%` : '-'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">{order.dueDate}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(order.priority)}`}>
                          {order.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Work Center Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Current Job</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Utilization</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">OEE</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Availability</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Performance</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quality</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {workCenters.map((wc) => (
                    <tr key={wc.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-900">{wc.code}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-900">{wc.name}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-900">{wc.currentJob}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(wc.status)} w-fit`}>
                          {getStatusIcon(wc.status)}
                          {wc.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
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
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-sm font-semibold ${
                          wc.oee >= 75 ? 'text-green-600' :
                          wc.oee >= 60 ? 'text-yellow-600' :
                          'text-red-600'
                        }`}>
                          {wc.oee}%
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">{wc.availability}%</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">{wc.performance}%</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
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

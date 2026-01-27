'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, RefreshCw, Filter, Activity, Clock, CheckCircle, AlertTriangle, Package, Users } from 'lucide-react';
import { StationDetailModal, WorkOrderDetailModal, StationDetail, WorkOrderDetail } from '@/components/shopfloor/ShopFloorDetailModals';

interface WorkStation {
  id: string;
  stationCode: string;
  stationName: string;
  department: string;
  status: 'running' | 'idle' | 'maintenance' | 'offline';
  currentWO: string | null;
  currentProduct: string | null;
  operator: string | null;
  startTime: string | null;
  plannedQuantity: number;
  completedQuantity: number;
  rejectedQuantity: number;
  completionPercentage: number;
  cycleTime: number;
  targetCycleTime: number;
  efficiency: number;
  utilizationPercent: number;
  lastUpdate: string;
}

interface ActiveWorkOrder {
  id: string;
  workOrderNumber: string;
  productCode: string;
  productName: string;
  totalQuantity: number;
  completedQuantity: number;
  currentStation: string;
  assignedOperators: string[];
  startTime: string;
  expectedCompletion: string;
  status: 'on-track' | 'at-risk' | 'delayed';
  completionPercentage: number;
}

export default function ShopFloorTrackingPage() {
  const router = useRouter();
  const [filterDepartment, setFilterDepartment] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Modal states
  const [isStationDetailOpen, setIsStationDetailOpen] = useState(false);
  const [isWorkOrderDetailOpen, setIsWorkOrderDetailOpen] = useState(false);
  const [selectedStation, setSelectedStation] = useState<StationDetail | null>(null);
  const [selectedWorkOrder, setSelectedWorkOrder] = useState<WorkOrderDetail | null>(null);

  // Mock data for work stations
  const workStations: WorkStation[] = [
    {
      id: '1',
      stationCode: 'ST-CUT-01',
      stationName: 'CNC Cutting Machine #1',
      department: 'Cutting',
      status: 'running',
      currentWO: 'WO-2025-1135',
      currentProduct: 'Kitchen Sink - Double Bowl',
      operator: 'Rajesh Kumar',
      startTime: '08:15 AM',
      plannedQuantity: 50,
      completedQuantity: 32,
      rejectedQuantity: 2,
      completionPercentage: 64,
      cycleTime: 18,
      targetCycleTime: 20,
      efficiency: 111,
      utilizationPercent: 87,
      lastUpdate: '2 mins ago'
    },
    {
      id: '2',
      stationCode: 'ST-WELD-01',
      stationName: 'Welding Station #1',
      department: 'Welding',
      status: 'running',
      currentWO: 'WO-2025-1138',
      currentProduct: 'Chrome Kitchen Faucet',
      operator: 'Amit Patel',
      startTime: '07:30 AM',
      plannedQuantity: 80,
      completedQuantity: 65,
      rejectedQuantity: 3,
      completionPercentage: 81,
      cycleTime: 12,
      targetCycleTime: 15,
      efficiency: 125,
      utilizationPercent: 92,
      lastUpdate: '1 min ago'
    },
    {
      id: '3',
      stationCode: 'ST-POLISH-01',
      stationName: 'Polishing Station #1',
      department: 'Finishing',
      status: 'running',
      currentWO: 'WO-2025-1142',
      currentProduct: 'Cookware Set - Non-Stick',
      operator: 'Priya Singh',
      startTime: '08:45 AM',
      plannedQuantity: 45,
      completedQuantity: 18,
      rejectedQuantity: 1,
      completionPercentage: 40,
      cycleTime: 25,
      targetCycleTime: 22,
      efficiency: 88,
      utilizationPercent: 78,
      lastUpdate: '30 secs ago'
    },
    {
      id: '4',
      stationCode: 'ST-ASSY-01',
      stationName: 'Assembly Line #1',
      department: 'Assembly',
      status: 'running',
      currentWO: 'WO-2025-1145',
      currentProduct: 'Built-in Kitchen Chimney',
      operator: 'Suresh Reddy',
      startTime: '09:00 AM',
      plannedQuantity: 35,
      completedQuantity: 22,
      rejectedQuantity: 0,
      completionPercentage: 63,
      cycleTime: 30,
      targetCycleTime: 28,
      efficiency: 93,
      utilizationPercent: 85,
      lastUpdate: '3 mins ago'
    },
    {
      id: '5',
      stationCode: 'ST-CUT-02',
      stationName: 'Laser Cutting Machine #2',
      department: 'Cutting',
      status: 'idle',
      currentWO: null,
      currentProduct: null,
      operator: 'Vikram Shah',
      startTime: null,
      plannedQuantity: 0,
      completedQuantity: 0,
      rejectedQuantity: 0,
      completionPercentage: 0,
      cycleTime: 0,
      targetCycleTime: 18,
      efficiency: 0,
      utilizationPercent: 45,
      lastUpdate: '15 mins ago'
    },
    {
      id: '6',
      stationCode: 'ST-PAINT-01',
      stationName: 'Powder Coating Booth #1',
      department: 'Finishing',
      status: 'maintenance',
      currentWO: null,
      currentProduct: null,
      operator: null,
      startTime: null,
      plannedQuantity: 0,
      completedQuantity: 0,
      rejectedQuantity: 0,
      completionPercentage: 0,
      cycleTime: 0,
      targetCycleTime: 35,
      efficiency: 0,
      utilizationPercent: 0,
      lastUpdate: '1 hour ago'
    },
    {
      id: '7',
      stationCode: 'ST-QC-01',
      stationName: 'Quality Inspection Station #1',
      department: 'Quality Control',
      status: 'running',
      currentWO: 'WO-2025-1140',
      currentProduct: 'Range Hood with LED',
      operator: 'Kavita Desai',
      startTime: '08:00 AM',
      plannedQuantity: 25,
      completedQuantity: 20,
      rejectedQuantity: 2,
      completionPercentage: 80,
      cycleTime: 15,
      targetCycleTime: 18,
      efficiency: 120,
      utilizationPercent: 88,
      lastUpdate: '1 min ago'
    },
    {
      id: '8',
      stationCode: 'ST-PACK-01',
      stationName: 'Packaging Line #1',
      department: 'Packaging',
      status: 'running',
      currentWO: 'WO-2025-1147',
      currentProduct: 'Kitchen Storage Container Set',
      operator: 'Ramesh Gupta',
      startTime: '07:45 AM',
      plannedQuantity: 100,
      completedQuantity: 78,
      rejectedQuantity: 4,
      completionPercentage: 78,
      cycleTime: 8,
      targetCycleTime: 10,
      efficiency: 125,
      utilizationPercent: 95,
      lastUpdate: '45 secs ago'
    }
  ];

  // Mock data for active work orders
  const activeWorkOrders: ActiveWorkOrder[] = [
    {
      id: '1',
      workOrderNumber: 'WO-2025-1135',
      productCode: 'KIT-SINK-001',
      productName: 'Premium Stainless Steel Kitchen Sink - Double Bowl',
      totalQuantity: 150,
      completedQuantity: 102,
      currentStation: 'ST-CUT-01',
      assignedOperators: ['Rajesh Kumar', 'Amit Verma'],
      startTime: '2025-10-18 08:15',
      expectedCompletion: '2025-10-22 17:00',
      status: 'on-track',
      completionPercentage: 68
    },
    {
      id: '2',
      workOrderNumber: 'WO-2025-1138',
      productCode: 'KIT-FAUCET-002',
      productName: 'Chrome Kitchen Faucet with Pull-Down Sprayer',
      totalQuantity: 200,
      completedQuantity: 164,
      currentStation: 'ST-WELD-01',
      assignedOperators: ['Amit Patel', 'Sunil Joshi'],
      startTime: '2025-10-17 07:30',
      expectedCompletion: '2025-10-21 16:00',
      status: 'on-track',
      completionPercentage: 82
    },
    {
      id: '3',
      workOrderNumber: 'WO-2025-1142',
      productCode: 'KIT-COOKWARE-003',
      productName: 'Non-Stick Cookware Set (7 Pieces)',
      totalQuantity: 120,
      completedQuantity: 48,
      currentStation: 'ST-POLISH-01',
      assignedOperators: ['Priya Singh'],
      startTime: '2025-10-19 08:45',
      expectedCompletion: '2025-10-24 15:00',
      status: 'at-risk',
      completionPercentage: 40
    },
    {
      id: '4',
      workOrderNumber: 'WO-2025-1145',
      productCode: 'KIT-CHIMNEY-001',
      productName: 'Built-in Kitchen Chimney (60cm)',
      totalQuantity: 85,
      completedQuantity: 54,
      currentStation: 'ST-ASSY-01',
      assignedOperators: ['Suresh Reddy', 'Mohan Das'],
      startTime: '2025-10-18 09:00',
      expectedCompletion: '2025-10-23 14:00',
      status: 'on-track',
      completionPercentage: 64
    }
  ];

  const filteredStations = workStations.filter(station => {
    const deptMatch = filterDepartment === 'all' || station.department === filterDepartment;
    const statusMatch = filterStatus === 'all' || station.status === filterStatus;
    return deptMatch && statusMatch;
  });

  const runningStations = workStations.filter(s => s.status === 'running').length;
  const idleStations = workStations.filter(s => s.status === 'idle').length;
  const avgEfficiency = workStations.filter(s => s.status === 'running').reduce((sum, s) => sum + s.efficiency, 0) / runningStations || 0;
  const avgUtilization = workStations.reduce((sum, s) => sum + s.utilizationPercent, 0) / workStations.length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'text-green-700 bg-green-100 border-green-200';
      case 'idle': return 'text-yellow-700 bg-yellow-100 border-yellow-200';
      case 'maintenance': return 'text-orange-700 bg-orange-100 border-orange-200';
      case 'offline': return 'text-red-700 bg-red-100 border-red-200';
      default: return 'text-gray-700 bg-gray-100 border-gray-200';
    }
  };

  const getWOStatusColor = (status: string) => {
    switch (status) {
      case 'on-track': return 'text-green-700 bg-green-100';
      case 'at-risk': return 'text-yellow-700 bg-yellow-100';
      case 'delayed': return 'text-red-700 bg-red-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 100) return 'text-green-600';
    if (efficiency >= 85) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Handler functions for modals
  const handleViewStation = (station: WorkStation) => {
    // Convert station data to StationDetail format
    const stationDetail: StationDetail = {
      id: station.id,
      stationCode: station.stationCode,
      name: station.stationName,
      type: station.department,
      location: 'Production Floor',
      status: station.status,
      equipment: station.stationName,
      capabilities: ['Manufacturing', 'Assembly'],
      assignedShifts: ['Morning', 'Evening', 'Night'],
      currentWorkOrder: station.currentWO || undefined,
      currentOperator: station.operator || undefined,
      currentOperation: station.currentProduct || undefined,
      progress: station.completionPercentage,
      operationProgress: station.completionPercentage,
      utilizationRate: station.utilizationPercent,
      availableCapacity: station.plannedQuantity - station.completedQuantity,
      totalCapacity: station.plannedQuantity,
      machineStatus: station.status,
      lastMaintenance: '2025-10-15',
      nextMaintenanceDue: '2025-11-15',
      partsProducedToday: station.completedQuantity,
      currentCycleTime: station.cycleTime,
      averageCycleTime: station.cycleTime,
      targetCycleTime: station.targetCycleTime,
      oeeScore: station.efficiency,
      availability: 95,
      performance: station.efficiency,
      quality: ((station.completedQuantity - station.rejectedQuantity) / station.completedQuantity * 100) || 100,
      downtimeToday: '15 mins'
    };
    setSelectedStation(stationDetail);
    setIsStationDetailOpen(true);
  };

  const handleViewWorkOrder = (workOrder: ActiveWorkOrder) => {
    // Convert work order data to WorkOrderDetail format
    const workOrderDetail: WorkOrderDetail = {
      id: workOrder.id,
      workOrderNumber: workOrder.workOrderNumber,
      productCode: workOrder.productCode,
      productName: workOrder.productName,
      quantity: workOrder.totalQuantity,
      completedQuantity: workOrder.completedQuantity,
      status: 'in-progress',
      priority: workOrder.status === 'delayed' ? 'urgent' : workOrder.status === 'at-risk' ? 'high' : 'medium',
      startDate: workOrder.startTime,
      dueDate: workOrder.expectedCompletion,
      completionDate: undefined,
      totalEstimatedTime: '40 hours',
      actualTimeSpent: '28 hours',
      notes: `Work order for ${workOrder.productName}`,
      currentOperation: 'Production',
      currentStation: workOrder.currentStation,
      currentOperator: workOrder.assignedOperators[0] || undefined,
      currentOperationStatus: 'in-progress',
      operations: [
        {
          sequence: 1,
          operationId: 'OP-001',
          operationName: 'Material Preparation',
          status: 'completed',
          station: workOrder.currentStation,
          operator: workOrder.assignedOperators[0],
          completedQty: workOrder.totalQuantity,
          totalQty: workOrder.totalQuantity,
          startTime: workOrder.startTime,
          endTime: workOrder.startTime,
          duration: '8 hours'
        },
        {
          sequence: 2,
          operationId: 'OP-002',
          operationName: 'Manufacturing',
          status: 'in-progress',
          station: workOrder.currentStation,
          operator: workOrder.assignedOperators[0],
          completedQty: workOrder.completedQuantity,
          totalQty: workOrder.totalQuantity,
          startTime: workOrder.startTime,
          duration: '20 hours'
        },
        {
          sequence: 3,
          operationId: 'OP-003',
          operationName: 'Quality Control',
          status: 'pending',
          completedQty: 0,
          totalQty: workOrder.totalQuantity
        }
      ],
      materials: [
        {
          materialCode: 'MAT-001',
          materialName: 'Primary Material',
          requiredQty: workOrder.totalQuantity * 2,
          availableQty: workOrder.totalQuantity * 2,
          unit: 'kg',
          status: 'available',
          location: 'Warehouse A'
        }
      ],
      inspectionStatus: 'in-progress',
      defectsFound: 0,
      qualityRate: 98
    };
    setSelectedWorkOrder(workOrderDetail);
    setIsWorkOrderDetailOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-6">
      {/* Inline Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Shop Floor Tracking</h1>
            <p className="text-sm text-gray-500 mt-1">Real-time production monitoring and station status</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Running Stations</p>
              <p className="text-2xl font-bold text-green-900 mt-1">{runningStations}/{workStations.length}</p>
            </div>
            <div className="p-3 bg-green-200 rounded-lg">
              <Activity className="w-6 h-6 text-green-700" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-6 border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-600">Idle Stations</p>
              <p className="text-2xl font-bold text-yellow-900 mt-1">{idleStations}</p>
            </div>
            <div className="p-3 bg-yellow-200 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-700" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Avg Efficiency</p>
              <p className="text-2xl font-bold text-blue-900 mt-1">{avgEfficiency.toFixed(0)}%</p>
            </div>
            <div className="p-3 bg-blue-200 rounded-lg">
              <CheckCircle className="w-6 h-6 text-blue-700" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">Avg Utilization</p>
              <p className="text-2xl font-bold text-purple-900 mt-1">{avgUtilization.toFixed(0)}%</p>
            </div>
            <div className="p-3 bg-purple-200 rounded-lg">
              <Package className="w-6 h-6 text-purple-700" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
        <div className="flex items-center gap-4">
          <Filter className="w-5 h-5 text-gray-400" />
          <select
            value={filterDepartment}
            onChange={(e) => setFilterDepartment(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Departments</option>
            <option value="Cutting">Cutting</option>
            <option value="Welding">Welding</option>
            <option value="Finishing">Finishing</option>
            <option value="Assembly">Assembly</option>
            <option value="Quality Control">Quality Control</option>
            <option value="Packaging">Packaging</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="running">Running</option>
            <option value="idle">Idle</option>
            <option value="maintenance">Maintenance</option>
            <option value="offline">Offline</option>
          </select>
        </div>
      </div>

      {/* Work Stations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {filteredStations.map((station) => (
          <div
            key={station.id}
            className={`bg-white rounded-xl border-2 p-6 cursor-pointer hover:shadow-lg transition-all ${getStatusColor(station.status)}`}
            onClick={() => handleViewStation(station)}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg font-bold text-gray-900">{station.stationCode}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(station.status)}`}>
                    {station.status}
                  </span>
                </div>
                <p className="text-gray-700 font-medium">{station.stationName}</p>
                <p className="text-sm text-gray-500">{station.department}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">Last Update</p>
                <p className="text-sm font-medium text-gray-900">{station.lastUpdate}</p>
              </div>
            </div>

            {station.status === 'running' && station.currentWO && (
              <>
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-gray-500">Work Order</p>
                      <p className="font-semibold text-blue-600">{station.currentWO}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Operator</p>
                      <p className="font-semibold text-gray-900">{station.operator}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-gray-500">Product</p>
                      <p className="font-semibold text-gray-900">{station.currentProduct}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Start Time</p>
                      <p className="font-semibold text-gray-900">{station.startTime}</p>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Progress</span>
                    <span className="text-sm font-bold text-gray-900">{station.completionPercentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-blue-600 h-3 rounded-full transition-all"
                      style={{ width: `${station.completionPercentage}%` }}
                    ></div>
                  </div>
                  <div className="flex items-center justify-between mt-1 text-xs text-gray-500">
                    <span>{station.completedQuantity} / {station.plannedQuantity} units</span>
                    <span className="text-red-600">{station.rejectedQuantity} rejected</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="p-2 bg-blue-50 rounded text-center">
                    <p className="text-xs text-blue-600">Cycle Time</p>
                    <p className="text-lg font-bold text-blue-900">{station.cycleTime}m</p>
                    <p className="text-xs text-gray-500">Target: {station.targetCycleTime}m</p>
                  </div>
                  <div className="p-2 bg-green-50 rounded text-center">
                    <p className="text-xs text-green-600">Efficiency</p>
                    <p className={`text-lg font-bold ${getEfficiencyColor(station.efficiency)}`}>{station.efficiency}%</p>
                  </div>
                  <div className="p-2 bg-purple-50 rounded text-center">
                    <p className="text-xs text-purple-600">Utilization</p>
                    <p className="text-lg font-bold text-purple-900">{station.utilizationPercent}%</p>
                  </div>
                </div>
              </>
            )}

            {station.status === 'idle' && (
              <div className="text-center py-6">
                <Clock className="w-12 h-12 text-yellow-400 mx-auto mb-2" />
                <p className="text-gray-600">Station is idle</p>
                <p className="text-sm text-gray-500">Operator: {station.operator}</p>
                <p className="text-sm text-gray-500">Utilization: {station.utilizationPercent}%</p>
              </div>
            )}

            {station.status === 'maintenance' && (
              <div className="text-center py-6">
                <AlertTriangle className="w-12 h-12 text-orange-400 mx-auto mb-2" />
                <p className="text-gray-600">Under maintenance</p>
                <p className="text-sm text-gray-500">Awaiting service</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Active Work Orders */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-900">Active Work Orders</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Work Order</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Station</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Operators</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expected</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {activeWorkOrders.map((wo) => (
                <tr
                  key={wo.id}
                  className="hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => handleViewWorkOrder(wo)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-blue-600">{wo.workOrderNumber}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{wo.productCode}</div>
                    <div className="text-sm text-gray-500">{wo.productName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="text-sm font-bold text-gray-900">{wo.completionPercentage}%</div>
                    <div className="text-xs text-gray-500">{wo.completedQuantity}/{wo.totalQuantity}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">{wo.currentStation}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-700">{wo.assignedOperators.length}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-700">{wo.expectedCompletion}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getWOStatusColor(wo.status)}`}>
                      {wo.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <StationDetailModal
        isOpen={isStationDetailOpen}
        onClose={() => setIsStationDetailOpen(false)}
        station={selectedStation}
      />

      <WorkOrderDetailModal
        isOpen={isWorkOrderDetailOpen}
        onClose={() => setIsWorkOrderDetailOpen(false)}
        workOrder={selectedWorkOrder}
      />
    </div>
  );
}

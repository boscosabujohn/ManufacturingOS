'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Search,
  Activity,
  AlertCircle,
  Calendar,
  Package,
  User,
  Clock,
  TrendingUp,
  TrendingDown,
  Eye,
  Pause,
  CheckCircle2,
  Users,
  Settings
} from 'lucide-react';
import { UpdateProgressModal } from '@/components/production/UpdateProgressModal';

interface InProgressWorkOrder {
  id: string;
  workOrderNumber: string;
  productCode: string;
  productName: string;
  category: string;
  quantity: number;
  unit: string;
  produced: number;
  rejected: number;
  priority: 'urgent' | 'high' | 'medium' | 'low';
  salesOrderNumber: string;
  customerName: string;
  startDate: string;
  dueDate: string;
  daysRemaining: number;
  currentStation: string;
  completionPercentage: number;
  plannedDuration: number;
  actualDaysElapsed: number;
  assignedTeam: string;
  shift: string;
  status: 'on-track' | 'at-risk' | 'delayed';
  issues: string[];
  nextMilestone: string;
}

export default function InProgressWorkOrdersPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedWorkOrder, setSelectedWorkOrder] = useState<InProgressWorkOrder | null>(null);
  const [isProgressModalOpen, setIsProgressModalOpen] = useState(false);

  const inProgressOrders: InProgressWorkOrder[] = [
    {
      id: '1',
      workOrderNumber: 'WO-2025-1135',
      productCode: 'KIT-SINK-001',
      productName: 'Premium SS304 Kitchen Sink - Double Bowl',
      category: 'Kitchen Sinks',
      quantity: 50,
      unit: 'PC',
      produced: 32,
      rejected: 2,
      priority: 'high',
      salesOrderNumber: 'SO-2025-0842',
      customerName: 'Grand Towers Ltd',
      startDate: '2025-10-12',
      dueDate: '2025-10-24',
      daysRemaining: 4,
      currentStation: 'Polishing & Finishing',
      completionPercentage: 68,
      plannedDuration: 12,
      actualDaysElapsed: 8,
      assignedTeam: 'Team A - Sinks',
      shift: 'Day Shift',
      status: 'on-track',
      issues: [],
      nextMilestone: 'Quality inspection - 6 units ready'
    },
    {
      id: '2',
      workOrderNumber: 'WO-2025-1138',
      productCode: 'KIT-APPL-001',
      productName: 'Auto-Clean Kitchen Chimney - 90cm',
      category: 'Kitchen Appliances',
      quantity: 30,
      unit: 'PC',
      produced: 18,
      rejected: 1,
      priority: 'urgent',
      salesOrderNumber: 'SO-2025-0845',
      customerName: 'Prestige Homes',
      startDate: '2025-10-10',
      dueDate: '2025-10-23',
      daysRemaining: 3,
      currentStation: 'Motor Assembly',
      completionPercentage: 62,
      plannedDuration: 13,
      actualDaysElapsed: 10,
      assignedTeam: 'Team C - Appliances',
      shift: 'Day & Night Shift',
      status: 'at-risk',
      issues: ['Motor supplier delay affecting 5 units', 'Overtime required to meet deadline'],
      nextMilestone: 'Complete motor installation - 12 units pending'
    },
    {
      id: '3',
      workOrderNumber: 'WO-2025-1139',
      productCode: 'KIT-CAB-001',
      productName: 'Modular Base Cabinet - 3 Drawer',
      category: 'Kitchen Cabinets',
      quantity: 60,
      unit: 'PC',
      produced: 25,
      rejected: 3,
      priority: 'medium',
      salesOrderNumber: 'SO-2025-0848',
      customerName: 'Urban Apartments',
      startDate: '2025-10-08',
      dueDate: '2025-10-28',
      daysRemaining: 8,
      currentStation: 'Cabinet Assembly',
      completionPercentage: 45,
      plannedDuration: 20,
      actualDaysElapsed: 12,
      assignedTeam: 'Team B - Cabinets',
      shift: 'Day Shift',
      status: 'delayed',
      issues: ['CNC machine breakdown - 2 days lost', 'Plywood quality issues - 3 units rejected'],
      nextMilestone: 'Complete base assembly - 35 units pending'
    },
    {
      id: '4',
      workOrderNumber: 'WO-2025-1140',
      productCode: 'KIT-FAUC-001',
      productName: 'Chrome Finish Kitchen Faucet - Single Lever',
      category: 'Kitchen Faucets',
      quantity: 100,
      unit: 'PC',
      produced: 78,
      rejected: 4,
      priority: 'medium',
      salesOrderNumber: 'SO-2025-0850',
      customerName: 'Kitchen Mart',
      startDate: '2025-10-14',
      dueDate: '2025-10-26',
      daysRemaining: 6,
      currentStation: 'Chrome Plating',
      completionPercentage: 82,
      plannedDuration: 12,
      actualDaysElapsed: 6,
      assignedTeam: 'Team D - Faucets',
      shift: 'Day Shift',
      status: 'on-track',
      issues: [],
      nextMilestone: 'Chrome plating batch 4 - 22 units'
    },
    {
      id: '5',
      workOrderNumber: 'WO-2025-1141',
      productCode: 'KIT-COOK-001',
      productName: 'Professional Cookware Set - 7 Piece',
      category: 'Cookware',
      quantity: 80,
      unit: 'SET',
      produced: 52,
      rejected: 5,
      priority: 'high',
      salesOrderNumber: 'SO-2025-0852',
      customerName: 'Chef\'s Choice Store',
      startDate: '2025-10-11',
      dueDate: '2025-10-27',
      daysRemaining: 7,
      currentStation: 'Non-Stick Coating',
      completionPercentage: 71,
      plannedDuration: 16,
      actualDaysElapsed: 9,
      assignedTeam: 'Team E - Cookware',
      shift: 'Day Shift',
      status: 'on-track',
      issues: ['5 sets failed coating quality check'],
      nextMilestone: 'Complete coating application - 28 sets pending'
    },
    {
      id: '6',
      workOrderNumber: 'WO-2025-1136',
      productCode: 'KIT-COUNT-001',
      productName: 'Granite Countertop - Premium Black Galaxy',
      category: 'Countertops',
      quantity: 20,
      unit: 'PC',
      produced: 8,
      rejected: 1,
      priority: 'urgent',
      salesOrderNumber: 'SO-2025-0843',
      customerName: 'Luxury Villas Co',
      startDate: '2025-10-09',
      dueDate: '2025-10-25',
      daysRemaining: 5,
      currentStation: 'Edge Polishing',
      completionPercentage: 42,
      plannedDuration: 16,
      actualDaysElapsed: 11,
      assignedTeam: 'Team F - Stone Work',
      shift: 'Day Shift',
      status: 'at-risk',
      issues: ['Granite slab defects - 1 piece rejected', 'Skilled labor shortage slowing progress'],
      nextMilestone: 'Complete edge polishing - 12 pieces pending'
    },
    {
      id: '7',
      workOrderNumber: 'WO-2025-1137',
      productCode: 'KIT-ACC-001',
      productName: 'Modular Kitchen Organizer Set - Premium',
      category: 'Kitchen Accessories',
      quantity: 120,
      unit: 'SET',
      produced: 95,
      rejected: 3,
      priority: 'low',
      salesOrderNumber: 'SO-2025-0844',
      customerName: 'Home Decor Plus',
      startDate: '2025-10-13',
      dueDate: '2025-10-30',
      daysRemaining: 10,
      currentStation: 'Packaging',
      completionPercentage: 82,
      plannedDuration: 17,
      actualDaysElapsed: 7,
      assignedTeam: 'Team G - Accessories',
      shift: 'Day Shift',
      status: 'on-track',
      issues: [],
      nextMilestone: 'Complete packaging - 25 sets remaining'
    },
    {
      id: '8',
      workOrderNumber: 'WO-2025-1134',
      productCode: 'KIT-SINK-003',
      productName: 'Undermount SS Sink - Single Bowl Large',
      category: 'Kitchen Sinks',
      quantity: 45,
      unit: 'PC',
      produced: 20,
      rejected: 2,
      priority: 'high',
      salesOrderNumber: 'SO-2025-0841',
      customerName: 'Designer Interiors',
      startDate: '2025-10-07',
      dueDate: '2025-10-22',
      daysRemaining: 2,
      currentStation: 'Welding',
      completionPercentage: 48,
      plannedDuration: 15,
      actualDaysElapsed: 13,
      assignedTeam: 'Team A - Sinks',
      shift: 'Day & Night Shift',
      status: 'delayed',
      issues: ['Welding quality issues - rework needed on 5 units', 'Behind schedule by 3 days'],
      nextMilestone: 'Complete welding - 25 units pending'
    }
  ];

  const priorities = ['all', 'urgent', 'high', 'medium', 'low'];
  const statuses = ['all', 'on-track', 'at-risk', 'delayed'];

  const filteredOrders = inProgressOrders.filter(order => {
    const matchesSearch =
      order.workOrderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.currentStation.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesPriority = filterPriority === 'all' || order.priority === filterPriority;
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;

    return matchesSearch && matchesPriority && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const badges = {
      'on-track': { color: 'bg-green-100 text-green-800', icon: CheckCircle2, label: 'On Track' },
      'at-risk': { color: 'bg-yellow-100 text-yellow-800', icon: AlertCircle, label: 'At Risk' },
      'delayed': { color: 'bg-red-100 text-red-800', icon: TrendingDown, label: 'Delayed' }
    };
    return badges[status as keyof typeof badges] || badges['on-track'];
  };

  // Summary stats
  const totalInProgress = inProgressOrders.length;
  const onTrack = inProgressOrders.filter(o => o.status === 'on-track').length;
  const atRisk = inProgressOrders.filter(o => o.status === 'at-risk').length;
  const delayed = inProgressOrders.filter(o => o.status === 'delayed').length;

  const handleViewDetails = (workOrderId: string) => {
    router.push(`/production/work-orders/view/${workOrderId}`);
  };

  const handlePause = (order: InProgressWorkOrder) => {
    if (confirm(`Pause production for Work Order ${order.workOrderNumber}?\n\nProduct: ${order.productName}\nCurrent Progress: ${order.completionPercentage}%`)) {
      console.log('Pausing work order:', order);
      alert(`Work Order ${order.workOrderNumber} has been paused.\n\nStatus: On Hold\nCurrent Progress: ${order.completionPercentage}%\nProduced: ${order.produced} ${order.unit}`);
    }
  };

  const handleUpdateProgress = (order: InProgressWorkOrder) => {
    setSelectedWorkOrder(order);
    setIsProgressModalOpen(true);
  };

  const handleProgressUpdate = (updateData: any) => {
    console.log('Progress updated:', updateData);
    alert(`Progress updated successfully for ${selectedWorkOrder?.workOrderNumber}!\n\nProduced: ${updateData.produced} ${selectedWorkOrder?.unit}\nRejected: ${updateData.rejected}\nCompletion: ${updateData.completionPercentage}%\nCurrent Station: ${updateData.currentStation}`);
  };

  return (
    <div className="w-full px-3 py-2">
      {/* Inline Header */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back</span>
          </button>
          <div className="h-6 w-px bg-gray-300" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Work Orders In Progress</h1>
            <p className="text-sm text-gray-600">Currently active production work orders</p>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-3">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-blue-900">In Progress</span>
            <Activity className="h-5 w-5 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-blue-900">{totalInProgress}</div>
          <div className="text-xs text-blue-700 mt-1">Active work orders</div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-green-900">On Track</span>
            <CheckCircle2 className="h-5 w-5 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-green-900">{onTrack}</div>
          <div className="text-xs text-green-700 mt-1">Meeting schedule</div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-yellow-900">At Risk</span>
            <AlertCircle className="h-5 w-5 text-yellow-600" />
          </div>
          <div className="text-2xl font-bold text-yellow-900">{atRisk}</div>
          <div className="text-xs text-yellow-700 mt-1">Need attention</div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-red-900">Delayed</span>
            <TrendingDown className="h-5 w-5 text-red-600" />
          </div>
          <div className="text-2xl font-bold text-red-900">{delayed}</div>
          <div className="text-xs text-red-700 mt-1">Behind schedule</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 mb-3">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search work orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {priorities.map(pri => (
              <option key={pri} value={pri}>
                {pri === 'all' ? 'All Priorities' : pri.charAt(0).toUpperCase() + pri.slice(1)}
              </option>
            ))}
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {statuses.map(status => (
              <option key={status} value={status}>
                {status === 'all' ? 'All Status' : status.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Work Orders List */}
      <div className="space-y-2">
        {filteredOrders.map((order) => {
          const statusInfo = getStatusBadge(order.status);
          const StatusIcon = statusInfo.icon;
          const completedQty = order.produced + order.rejected;
          const successRate = order.produced > 0 ? ((order.produced / completedQty) * 100).toFixed(1) : '0.0';

          return (
            <div key={order.id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="p-5">
                {/* Header */}
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{order.workOrderNumber}</h3>
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}>
                        <StatusIcon className="h-3 w-3" />
                        {statusInfo.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {order.customerName}
                      </span>
                      <span>SO: {order.salesOrderNumber}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">{order.daysRemaining} days remaining</div>
                    <div className="text-xs text-gray-500 flex items-center gap-1 justify-end mt-1">
                      <Calendar className="h-3 w-3" />
                      Due: {order.dueDate}
                    </div>
                  </div>
                </div>

                {/* Product Info */}
                <div className="bg-blue-50 rounded-lg p-3 mb-2">
                  <div className="flex items-start gap-3">
                    <Package className="h-5 w-5 text-blue-600 mt-1" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{order.productName}</h4>
                      <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                        <span>{order.productCode}</span>
                        <span>•</span>
                        <span className="font-medium">Target: {order.quantity} {order.unit}</span>
                        <span>•</span>
                        <span>{order.category}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Progress Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2">
                  {/* Completion Progress */}
                  <div className="bg-gray-50 rounded-lg p-3 col-span-2">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Overall Progress</span>
                      <span className="text-2xl font-bold text-blue-900">{order.completionPercentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
                      <div
                        className={`h-3 rounded-full ${
                          order.status === 'on-track' ? 'bg-green-600' :
                          order.status === 'at-risk' ? 'bg-yellow-600' :
                          'bg-red-600'
                        }`}
                        style={{ width: `${order.completionPercentage}%` }}
                      ></div>
                    </div>
                    <div className="grid grid-cols-3 gap-3 text-sm">
                      <div>
                        <div className="text-gray-600">Produced</div>
                        <div className="font-semibold text-green-900">{order.produced} {order.unit}</div>
                      </div>
                      <div>
                        <div className="text-gray-600">Rejected</div>
                        <div className="font-semibold text-red-900">{order.rejected} {order.unit}</div>
                      </div>
                      <div>
                        <div className="text-gray-600">Success Rate</div>
                        <div className="font-semibold text-blue-900">{successRate}%</div>
                      </div>
                    </div>
                  </div>

                  {/* Current Status */}
                  <div className="bg-purple-50 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-3">
                      <Settings className="h-5 w-5 text-purple-600" />
                      <span className="text-sm font-medium text-purple-900">Current Station</span>
                    </div>
                    <div className="font-semibold text-gray-900 mb-3">{order.currentStation}</div>
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Users className="h-3 w-3" />
                        {order.assignedTeam}
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock className="h-3 w-3" />
                        {order.shift}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Timeline */}
                <div className="bg-gray-50 rounded-lg p-3 mb-2">
                  <div className="grid grid-cols-3 gap-3 text-sm">
                    <div>
                      <div className="text-gray-600">Started</div>
                      <div className="font-medium text-gray-900">{order.startDate}</div>
                    </div>
                    <div>
                      <div className="text-gray-600">Duration</div>
                      <div className="font-medium text-gray-900">{order.actualDaysElapsed} of {order.plannedDuration} days</div>
                    </div>
                    <div>
                      <div className="text-gray-600">Next Milestone</div>
                      <div className="font-medium text-gray-900">{order.nextMilestone}</div>
                    </div>
                  </div>
                </div>

                {/* Issues */}
                {order.issues.length > 0 && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-2">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 text-red-600 mt-0.5" />
                      <div className="flex-1">
                        <div className="text-xs font-medium text-red-900 mb-1">Issues ({order.issues.length})</div>
                        <ul className="space-y-1">
                          {order.issues.map((issue, idx) => (
                            <li key={idx} className="text-xs text-red-700">• {issue}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => handleViewDetails(order.id)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm flex items-center gap-2"
                  >
                    <Eye className="h-4 w-4" />
                    View Details
                  </button>
                  <button
                    onClick={() => handlePause(order)}
                    className="px-4 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 text-sm flex items-center gap-2"
                  >
                    <Pause className="h-4 w-4" />
                    Pause
                  </button>
                  <button
                    onClick={() => handleUpdateProgress(order)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm flex items-center gap-2"
                  >
                    <TrendingUp className="h-4 w-4" />
                    Update Progress
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="mt-6 text-sm text-gray-600">
        Showing {filteredOrders.length} of {totalInProgress} work orders in progress
      </div>

      {/* Update Progress Modal */}
      <UpdateProgressModal
        isOpen={isProgressModalOpen}
        onClose={() => {
          setIsProgressModalOpen(false);
          setSelectedWorkOrder(null);
        }}
        workOrder={selectedWorkOrder}
        onUpdate={handleProgressUpdate}
      />
    </div>
  );
}

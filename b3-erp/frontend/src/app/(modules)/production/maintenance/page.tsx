'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Wrench, Clock, AlertTriangle, CheckCircle, TrendingUp, Calendar, Package } from 'lucide-react';

interface EquipmentStatus {
  id: string;
  equipmentCode: string;
  equipmentName: string;
  location: string;
  status: 'operational' | 'maintenance' | 'breakdown' | 'idle';
  utilization: number;
  lastMaintenance: string;
  nextMaintenance: string;
  daysUntilMaintenance: number;
  mtbf: number; // Mean Time Between Failures (hours)
  mttr: number; // Mean Time To Repair (hours)
  breakdownCount: number;
  maintenanceCost: number;
  criticalityLevel: 'critical' | 'high' | 'medium' | 'low';
}

interface MaintenanceAlert {
  id: string;
  alertType: 'overdue' | 'due-soon' | 'breakdown' | 'spare-shortage';
  severity: 'critical' | 'high' | 'medium' | 'low';
  equipmentCode: string;
  equipmentName: string;
  message: string;
  dueDate: string;
  assignedTo: string | null;
}

export default function MaintenanceDashboardPage() {
  const router = useRouter();
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Mock data for equipment status
  const equipmentStatus: EquipmentStatus[] = [
    {
      id: '1',
      equipmentCode: 'CNC-CUT-01',
      equipmentName: 'CNC Cutting Machine #1',
      location: 'Cutting Department - Bay A',
      status: 'operational',
      utilization: 87,
      lastMaintenance: '2025-10-05',
      nextMaintenance: '2025-11-05',
      daysUntilMaintenance: 16,
      mtbf: 480,
      mttr: 4.5,
      breakdownCount: 2,
      maintenanceCost: 145000,
      criticalityLevel: 'critical'
    },
    {
      id: '2',
      equipmentCode: 'WELD-ST-01',
      equipmentName: 'TIG Welding Station #1',
      location: 'Welding Department - Bay B',
      status: 'operational',
      utilization: 92,
      lastMaintenance: '2025-10-12',
      nextMaintenance: '2025-11-12',
      daysUntilMaintenance: 23,
      mtbf: 520,
      mttr: 3.2,
      breakdownCount: 1,
      maintenanceCost: 85000,
      criticalityLevel: 'high'
    },
    {
      id: '3',
      equipmentCode: 'POLISH-01',
      equipmentName: 'Polishing Machine #1',
      location: 'Finishing Department',
      status: 'maintenance',
      utilization: 0,
      lastMaintenance: '2025-10-20',
      nextMaintenance: '2025-11-20',
      daysUntilMaintenance: 31,
      mtbf: 380,
      mttr: 6.8,
      breakdownCount: 4,
      maintenanceCost: 220000,
      criticalityLevel: 'high'
    },
    {
      id: '4',
      equipmentCode: 'PAINT-BOOTH-01',
      equipmentName: 'Powder Coating Booth #1',
      location: 'Finishing Department',
      status: 'operational',
      utilization: 78,
      lastMaintenance: '2025-09-15',
      nextMaintenance: '2025-10-15',
      daysUntilMaintenance: -5,
      mtbf: 450,
      mttr: 8.5,
      breakdownCount: 3,
      maintenanceCost: 185000,
      criticalityLevel: 'medium'
    },
    {
      id: '5',
      equipmentCode: 'PRESS-HYDRO-01',
      equipmentName: 'Hydraulic Press Machine',
      location: 'Forming Department',
      status: 'operational',
      utilization: 85,
      lastMaintenance: '2025-10-18',
      nextMaintenance: '2025-11-18',
      daysUntilMaintenance: 29,
      mtbf: 610,
      mttr: 5.2,
      breakdownCount: 1,
      maintenanceCost: 125000,
      criticalityLevel: 'critical'
    },
    {
      id: '6',
      equipmentCode: 'ASSY-LINE-01',
      equipmentName: 'Assembly Conveyor Line #1',
      location: 'Assembly Department',
      status: 'breakdown',
      utilization: 0,
      lastMaintenance: '2025-10-10',
      nextMaintenance: '2025-11-10',
      daysUntilMaintenance: 21,
      mtbf: 320,
      mttr: 12.5,
      breakdownCount: 6,
      maintenanceCost: 340000,
      criticalityLevel: 'critical'
    },
    {
      id: '7',
      equipmentCode: 'LASER-CUT-02',
      equipmentName: 'Laser Cutting Machine #2',
      location: 'Cutting Department - Bay B',
      status: 'operational',
      utilization: 65,
      lastMaintenance: '2025-10-08',
      nextMaintenance: '2025-11-08',
      daysUntilMaintenance: 19,
      mtbf: 550,
      mttr: 4.0,
      breakdownCount: 2,
      maintenanceCost: 165000,
      criticalityLevel: 'high'
    },
    {
      id: '8',
      equipmentCode: 'FORK-LIFT-03',
      equipmentName: 'Forklift #3',
      location: 'Warehouse',
      status: 'idle',
      utilization: 45,
      lastMaintenance: '2025-10-01',
      nextMaintenance: '2025-11-01',
      daysUntilMaintenance: 12,
      mtbf: 720,
      mttr: 2.5,
      breakdownCount: 1,
      maintenanceCost: 45000,
      criticalityLevel: 'low'
    }
  ];

  // Mock data for maintenance alerts
  const maintenanceAlerts: MaintenanceAlert[] = [
    {
      id: '1',
      alertType: 'breakdown',
      severity: 'critical',
      equipmentCode: 'ASSY-LINE-01',
      equipmentName: 'Assembly Conveyor Line #1',
      message: 'Conveyor motor failure - production line stopped',
      dueDate: '2025-10-20',
      assignedTo: 'Maintenance Team Lead'
    },
    {
      id: '2',
      alertType: 'overdue',
      severity: 'high',
      equipmentCode: 'PAINT-BOOTH-01',
      equipmentName: 'Powder Coating Booth #1',
      message: 'Preventive maintenance overdue by 5 days',
      dueDate: '2025-10-15',
      assignedTo: 'Ramesh Technician'
    },
    {
      id: '3',
      alertType: 'due-soon',
      severity: 'medium',
      equipmentCode: 'FORK-LIFT-03',
      equipmentName: 'Forklift #3',
      message: 'Scheduled maintenance due in 12 days',
      dueDate: '2025-11-01',
      assignedTo: null
    },
    {
      id: '4',
      alertType: 'spare-shortage',
      severity: 'high',
      equipmentCode: 'CNC-CUT-01',
      equipmentName: 'CNC Cutting Machine #1',
      message: 'Critical spare parts inventory below minimum - CNC cutting blades',
      dueDate: '2025-10-22',
      assignedTo: 'Procurement Team'
    },
    {
      id: '5',
      alertType: 'due-soon',
      severity: 'medium',
      equipmentCode: 'CNC-CUT-01',
      equipmentName: 'CNC Cutting Machine #1',
      message: 'Preventive maintenance scheduled in 16 days',
      dueDate: '2025-11-05',
      assignedTo: 'Sunil Technician'
    }
  ];

  const filteredEquipment = equipmentStatus.filter(eq => {
    return filterStatus === 'all' || eq.status === filterStatus;
  });

  const totalEquipment = equipmentStatus.length;
  const operational = equipmentStatus.filter(e => e.status === 'operational').length;
  const underMaintenance = equipmentStatus.filter(e => e.status === 'maintenance').length;
  const breakdown = equipmentStatus.filter(e => e.status === 'breakdown').length;
  const avgUtilization = equipmentStatus.reduce((sum, e) => sum + e.utilization, 0) / totalEquipment;
  const overdueMaintenance = equipmentStatus.filter(e => e.daysUntilMaintenance < 0).length;
  const totalMaintenanceCost = equipmentStatus.reduce((sum, e) => sum + e.maintenanceCost, 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational': return 'text-green-700 bg-green-100 border-green-200';
      case 'maintenance': return 'text-blue-700 bg-blue-100 border-blue-200';
      case 'breakdown': return 'text-red-700 bg-red-100 border-red-200';
      case 'idle': return 'text-gray-700 bg-gray-100 border-gray-200';
      default: return 'text-gray-700 bg-gray-100 border-gray-200';
    }
  };

  const getCriticalityColor = (level: string) => {
    switch (level) {
      case 'critical': return 'text-red-700 bg-red-100';
      case 'high': return 'text-orange-700 bg-orange-100';
      case 'medium': return 'text-yellow-700 bg-yellow-100';
      case 'low': return 'text-green-700 bg-green-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  const getAlertSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-50 border-red-200';
      case 'high': return 'bg-orange-50 border-orange-200';
      case 'medium': return 'bg-yellow-50 border-yellow-200';
      case 'low': return 'bg-blue-50 border-blue-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'breakdown': return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case 'overdue': return <Clock className="w-5 h-5 text-orange-600" />;
      case 'due-soon': return <Calendar className="w-5 h-5 text-blue-600" />;
      case 'spare-shortage': return <Package className="w-5 h-5 text-yellow-600" />;
      default: return <Wrench className="w-5 h-5 text-gray-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-3 py-2">
      {/* Inline Header */}
      <div className="mb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Maintenance Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">Equipment status and maintenance overview</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => router.push('/production/maintenance/preventive')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Preventive Schedule
          </button>
          <button
            onClick={() => router.push('/production/maintenance/requests')}
            className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            New Request
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-3">
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-3 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Operational</p>
              <p className="text-2xl font-bold text-green-900 mt-1">{operational}/{totalEquipment}</p>
              <p className="text-xs text-green-600 mt-1">{((operational/totalEquipment)*100).toFixed(0)}% uptime</p>
            </div>
            <div className="p-3 bg-green-200 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-700" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-3 border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-600">Breakdown</p>
              <p className="text-2xl font-bold text-red-900 mt-1">{breakdown}</p>
              <p className="text-xs text-red-600 mt-1">Requires immediate attention</p>
            </div>
            <div className="p-3 bg-red-200 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-700" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-3 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Avg Utilization</p>
              <p className="text-2xl font-bold text-blue-900 mt-1">{avgUtilization.toFixed(0)}%</p>
              <p className="text-xs text-blue-600 mt-1">Across all equipment</p>
            </div>
            <div className="p-3 bg-blue-200 rounded-lg">
              <TrendingUp className="w-6 h-6 text-blue-700" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-3 border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-600">Overdue Maintenance</p>
              <p className="text-2xl font-bold text-orange-900 mt-1">{overdueMaintenance}</p>
              <p className="text-xs text-orange-600 mt-1">Action required</p>
            </div>
            <div className="p-3 bg-orange-200 rounded-lg">
              <Clock className="w-6 h-6 text-orange-700" />
            </div>
          </div>
        </div>
      </div>

      {/* Maintenance Alerts */}
      <div className="bg-white rounded-xl border border-gray-200 p-3 mb-3">
        <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-orange-600" />
          Active Maintenance Alerts ({maintenanceAlerts.length})
        </h3>
        <div className="space-y-3">
          {maintenanceAlerts.map((alert) => (
            <div key={alert.id} className={`p-4 border-2 rounded-lg ${getAlertSeverityColor(alert.severity)}`}>
              <div className="flex items-start gap-3">
                <div>{getAlertIcon(alert.alertType)}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-bold text-gray-900">{alert.equipmentCode}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCriticalityColor(alert.severity)}`}>
                      {alert.severity}
                    </span>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                      {alert.alertType}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{alert.message}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>Equipment: {alert.equipmentName}</span>
                    <span>Due: {alert.dueDate}</span>
                    {alert.assignedTo && <span>Assigned: {alert.assignedTo}</span>}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Equipment Status Filter */}
      <div className="bg-white rounded-xl border border-gray-200 p-3 mb-3">
        <div className="flex items-center gap-2">
          <Wrench className="w-5 h-5 text-gray-400" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Equipment</option>
            <option value="operational">Operational</option>
            <option value="maintenance">Under Maintenance</option>
            <option value="breakdown">Breakdown</option>
            <option value="idle">Idle</option>
          </select>
        </div>
      </div>

      {/* Equipment Status Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
        {filteredEquipment.map((equipment) => (
          <div key={equipment.id} className={`bg-white rounded-xl border-2 p-3 ${getStatusColor(equipment.status)}`}>
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg font-bold text-gray-900">{equipment.equipmentCode}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(equipment.status)}`}>
                    {equipment.status}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCriticalityColor(equipment.criticalityLevel)}`}>
                    {equipment.criticalityLevel}
                  </span>
                </div>
                <p className="text-gray-700 font-medium">{equipment.equipmentName}</p>
                <p className="text-sm text-gray-500">{equipment.location}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Utilization</p>
                <p className="text-2xl font-bold text-gray-900">{equipment.utilization}%</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-2">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500">Last Maintenance</p>
                <p className="text-sm font-semibold text-gray-900">{equipment.lastMaintenance}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-xs text-blue-600">Next Maintenance</p>
                <p className="text-sm font-semibold text-blue-900">{equipment.nextMaintenance}</p>
                <p className={`text-xs ${equipment.daysUntilMaintenance < 0 ? 'text-red-600' : 'text-gray-500'}`}>
                  {equipment.daysUntilMaintenance < 0 ? `${Math.abs(equipment.daysUntilMaintenance)} days overdue` : `in ${equipment.daysUntilMaintenance} days`}
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <p className="text-xs text-green-600">MTBF</p>
                <p className="text-sm font-semibold text-green-900">{equipment.mtbf}h</p>
              </div>
              <div className="p-3 bg-yellow-50 rounded-lg">
                <p className="text-xs text-yellow-600">MTTR</p>
                <p className="text-sm font-semibold text-yellow-900">{equipment.mttr}h</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-gray-200">
              <div className="text-sm">
                <span className="text-gray-500">Breakdowns:</span>
                <span className="font-semibold text-red-600 ml-1">{equipment.breakdownCount}</span>
              </div>
              <div className="text-sm">
                <span className="text-gray-500">Maintenance Cost:</span>
                <span className="font-semibold text-orange-600 ml-1">₹{(equipment.maintenanceCost / 1000).toFixed(0)}K</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Links */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-2">
        <button
          onClick={() => router.push('/production/maintenance/preventive')}
          className="p-4 bg-white border-2 border-blue-200 rounded-xl hover:bg-blue-50 transition-colors text-left"
        >
          <Calendar className="w-6 h-6 text-blue-600 mb-2" />
          <p className="font-semibold text-gray-900">Preventive Schedule</p>
          <p className="text-sm text-gray-500">View maintenance calendar</p>
        </button>
        <button
          onClick={() => router.push('/production/maintenance/requests')}
          className="p-4 bg-white border-2 border-orange-200 rounded-xl hover:bg-orange-50 transition-colors text-left"
        >
          <Wrench className="w-6 h-6 text-orange-600 mb-2" />
          <p className="font-semibold text-gray-900">Maintenance Requests</p>
          <p className="text-sm text-gray-500">Create or view requests</p>
        </button>
        <button
          onClick={() => router.push('/production/maintenance/history')}
          className="p-4 bg-white border-2 border-green-200 rounded-xl hover:bg-green-50 transition-colors text-left"
        >
          <Clock className="w-6 h-6 text-green-600 mb-2" />
          <p className="font-semibold text-gray-900">Maintenance History</p>
          <p className="text-sm text-gray-500">View past maintenance</p>
        </button>
        <button
          onClick={() => router.push('/production/maintenance/spares')}
          className="p-4 bg-white border-2 border-purple-200 rounded-xl hover:bg-purple-50 transition-colors text-left"
        >
          <Package className="w-6 h-6 text-purple-600 mb-2" />
          <p className="font-semibold text-gray-900">Spare Parts</p>
          <p className="text-sm text-gray-500">Manage inventory</p>
        </button>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Users,
  Settings,
  Calendar,
  TrendingUp,
  AlertCircle,
  Clock,
  CheckCircle2,
  Search
} from 'lucide-react';

interface ResourceAllocation {
  id: string;
  resourceType: 'labor' | 'equipment' | 'material';
  resourceName: string;
  totalCapacity: number;
  allocatedCapacity: number;
  availableCapacity: number;
  utilizationPercent: number;
  assignedTo: string[];
  workOrders: number;
  schedule: DaySchedule[];
  status: 'overloaded' | 'optimal' | 'underutilized';
}

interface DaySchedule {
  date: string;
  allocated: number;
  capacity: number;
}

export default function ResourceSchedulingPage() {
  const router = useRouter();
  const [filterType, setFilterType] = useState<string>('all');

  const resources: ResourceAllocation[] = [
    {
      id: '1',
      resourceType: 'labor',
      resourceName: 'Team A - Sinks',
      totalCapacity: 160,
      allocatedCapacity: 148,
      availableCapacity: 12,
      utilizationPercent: 92.5,
      assignedTo: ['WO-2025-1142', 'WO-2025-1138', 'WO-2025-1147'],
      workOrders: 3,
      schedule: [
        { date: '2025-10-21', allocated: 8, capacity: 8 },
        { date: '2025-10-22', allocated: 8, capacity: 8 },
        { date: '2025-10-23', allocated: 8, capacity: 8 }
      ],
      status: 'optimal'
    },
    {
      id: '2',
      resourceType: 'equipment',
      resourceName: 'CNC Machine - 3-Axis',
      totalCapacity: 200,
      allocatedCapacity: 195,
      availableCapacity: 5,
      utilizationPercent: 97.5,
      assignedTo: ['WO-2025-1144', 'WO-2025-1145'],
      workOrders: 2,
      schedule: [
        { date: '2025-10-21', allocated: 10, capacity: 10 },
        { date: '2025-10-22', allocated: 10, capacity: 10 }
      ],
      status: 'overloaded'
    },
    {
      id: '3',
      resourceType: 'labor',
      resourceName: 'Team C - Appliances',
      totalCapacity: 160,
      allocatedCapacity: 128,
      availableCapacity: 32,
      utilizationPercent: 80.0,
      assignedTo: ['WO-2025-1143', 'WO-2025-1146'],
      workOrders: 2,
      schedule: [
        { date: '2025-10-21', allocated: 8, capacity: 8 },
        { date: '2025-10-22', allocated: 6, capacity: 8 }
      ],
      status: 'optimal'
    },
    {
      id: '4',
      resourceType: 'equipment',
      resourceName: 'Polishing Station',
      totalCapacity: 180,
      allocatedCapacity: 95,
      availableCapacity: 85,
      utilizationPercent: 52.8,
      assignedTo: ['WO-2025-1142', 'WO-2025-1136'],
      workOrders: 2,
      schedule: [
        { date: '2025-10-21', allocated: 5, capacity: 9 },
        { date: '2025-10-22', allocated: 5, capacity: 9 }
      ],
      status: 'underutilized'
    },
    {
      id: '5',
      resourceType: 'labor',
      resourceName: 'Team B - Cabinets',
      totalCapacity: 160,
      allocatedCapacity: 160,
      availableCapacity: 0,
      utilizationPercent: 100.0,
      assignedTo: ['WO-2025-1144'],
      workOrders: 1,
      schedule: [
        { date: '2025-10-21', allocated: 8, capacity: 8 },
        { date: '2025-10-22', allocated: 8, capacity: 8 }
      ],
      status: 'overloaded'
    },
    {
      id: '6',
      resourceType: 'equipment',
      resourceName: 'Chrome Plating Tank',
      totalCapacity: 150,
      allocatedCapacity: 142,
      availableCapacity: 8,
      utilizationPercent: 94.7,
      assignedTo: ['WO-2025-1145'],
      workOrders: 1,
      schedule: [],
      status: 'optimal'
    }
  ];

  const types = ['all', 'labor', 'equipment', 'material'];

  const filteredResources = filterType === 'all'
    ? resources
    : resources.filter(r => r.resourceType === filterType);

  const getStatusBadge = (status: string) => {
    const badges = {
      optimal: { color: 'bg-green-100 text-green-800', icon: CheckCircle2 },
      overloaded: { color: 'bg-red-100 text-red-800', icon: AlertCircle },
      underutilized: { color: 'bg-yellow-100 text-yellow-800', icon: TrendingUp }
    };
    return badges[status as keyof typeof badges];
  };

  const totalResources = resources.length;
  const avgUtilization = resources.reduce((sum, r) => sum + r.utilizationPercent, 0) / totalResources;
  const overloaded = resources.filter(r => r.status === 'overloaded').length;

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <ArrowLeft className="h-5 w-5" />
            <span>Back</span>
          </button>
          <div className="h-6 w-px bg-gray-300" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Resource Scheduling</h1>
            <p className="text-sm text-gray-600">Manage labor, equipment, and material allocation</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-blue-900">Total Resources</span>
            <Settings className="h-5 w-5 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-blue-900">{totalResources}</div>
          <div className="text-xs text-blue-700 mt-1">Labor & Equipment</div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-green-900">Avg Utilization</span>
            <TrendingUp className="h-5 w-5 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-green-900">{avgUtilization.toFixed(1)}%</div>
          <div className="text-xs text-green-700 mt-1">Overall efficiency</div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-red-900">Overloaded</span>
            <AlertCircle className="h-5 w-5 text-red-600" />
          </div>
          <div className="text-2xl font-bold text-red-900">{overloaded}</div>
          <div className="text-xs text-red-700 mt-1">Need rebalancing</div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-purple-900">Active WOs</span>
            <Calendar className="h-5 w-5 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-purple-900">
            {resources.reduce((sum, r) => sum + r.workOrders, 0)}
          </div>
          <div className="text-xs text-purple-700 mt-1">Assigned</div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          {types.map(type => (
            <option key={type} value={type}>
              {type === 'all' ? 'All Resources' : type.charAt(0).toUpperCase() + type.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-4">
        {filteredResources.map((resource) => {
          const statusInfo = getStatusBadge(resource.status);
          const StatusIcon = statusInfo?.icon || Clock;

          return (
            <div key={resource.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {resource.resourceType === 'labor' ? <Users className="h-5 w-5 text-blue-600" /> : <Settings className="h-5 w-5 text-purple-600" />}
                    <h3 className="text-lg font-semibold text-gray-900">{resource.resourceName}</h3>
                    {statusInfo && (
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}>
                        <StatusIcon className="h-3 w-3" />
                        {resource.status}
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-600">
                    {resource.workOrders} work orders assigned • {resource.assignedTo.join(', ')}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-xs text-gray-600 mb-1">Total Capacity</div>
                  <div className="text-lg font-bold text-gray-900">{resource.totalCapacity}h</div>
                </div>
                <div className="bg-blue-50 rounded-lg p-3">
                  <div className="text-xs text-blue-700 mb-1">Allocated</div>
                  <div className="text-lg font-bold text-blue-900">{resource.allocatedCapacity}h</div>
                </div>
                <div className="bg-green-50 rounded-lg p-3">
                  <div className="text-xs text-green-700 mb-1">Available</div>
                  <div className="text-lg font-bold text-green-900">{resource.availableCapacity}h</div>
                </div>
              </div>

              <div className="mb-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">Utilization</span>
                  <span className="text-lg font-bold text-blue-900">{resource.utilizationPercent.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full ${
                      resource.utilizationPercent > 95 ? 'bg-red-600' :
                      resource.utilizationPercent >= 75 ? 'bg-green-600' :
                      'bg-yellow-600'
                    }`}
                    style={{ width: `${Math.min(resource.utilizationPercent, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

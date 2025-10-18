'use client';

import React, { useState, useMemo } from 'react';
import {
  Cpu, Plus, Search, Filter, Edit2, Trash2, MoreVertical,
  Factory, Gauge, Clock, Users, Wrench, Zap, Activity,
  TrendingUp, AlertTriangle, CheckCircle2, XCircle, AlertCircle,
  Calendar, DollarSign, Package, Settings, Shield, BarChart2
} from 'lucide-react';

interface WorkCenter {
  id: string;
  code: string;
  name: string;
  type: 'Production' | 'Assembly' | 'Quality' | 'Packaging' | 'Maintenance';
  department: string;
  location: string;
  capacity: {
    dailyCapacity: number;
    unitOfMeasure: string;
    shiftCapacity: number;
    efficiency: number;
    utilization: number;
  };
  operations: string[];
  resources: {
    machines: number;
    operators: number;
    helpers: number;
    supervisors: number;
  };
  performance: {
    oee: number;
    availability: number;
    performance: number;
    quality: number;
    mtbf: number;
    mttr: number;
  };
  costs: {
    hourlyRate: number;
    setupCost: number;
    maintenanceCost: number;
    overheadRate: number;
    currency: string;
  };
  schedule: {
    workingHours: string;
    shifts: string[];
    maintenanceWindow: string;
    plannedDowntime: number;
  };
  specifications: {
    maxWeight?: number;
    maxSize?: string;
    powerRequirement?: string;
    environmentControl?: string;
    certifications?: string[];
  };
  status: 'Active' | 'Inactive' | 'Maintenance' | 'Breakdown';
  metadata: {
    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
    updatedBy: string;
  };
}

const mockWorkCenters: WorkCenter[] = [
  {
    id: '1',
    code: 'WC-PRD-001',
    name: 'CNC Machining Center',
    type: 'Production',
    department: 'Manufacturing',
    location: 'Factory Floor - Zone A',
    capacity: {
      dailyCapacity: 500,
      unitOfMeasure: 'pieces',
      shiftCapacity: 250,
      efficiency: 85,
      utilization: 78
    },
    operations: ['Milling', 'Drilling', 'Boring', 'Tapping'],
    resources: {
      machines: 3,
      operators: 6,
      helpers: 3,
      supervisors: 1
    },
    performance: {
      oee: 72,
      availability: 90,
      performance: 85,
      quality: 94,
      mtbf: 120,
      mttr: 2
    },
    costs: {
      hourlyRate: 150,
      setupCost: 500,
      maintenanceCost: 2000,
      overheadRate: 25,
      currency: 'USD'
    },
    schedule: {
      workingHours: '24/7',
      shifts: ['Morning', 'Evening', 'Night'],
      maintenanceWindow: 'Sunday 06:00-12:00',
      plannedDowntime: 4
    },
    specifications: {
      maxWeight: 1000,
      maxSize: '2000x1000x800mm',
      powerRequirement: '415V, 3-phase, 50Hz',
      environmentControl: 'Temperature controlled',
      certifications: ['ISO 9001', 'ISO 14001']
    },
    status: 'Active',
    metadata: {
      createdAt: new Date('2023-01-15'),
      updatedAt: new Date('2024-03-20'),
      createdBy: 'Admin',
      updatedBy: 'Production Manager'
    }
  },
  {
    id: '2',
    code: 'WC-ASM-001',
    name: 'Assembly Line 1',
    type: 'Assembly',
    department: 'Assembly',
    location: 'Factory Floor - Zone B',
    capacity: {
      dailyCapacity: 1000,
      unitOfMeasure: 'units',
      shiftCapacity: 350,
      efficiency: 92,
      utilization: 85
    },
    operations: ['Component Assembly', 'Testing', 'Calibration'],
    resources: {
      machines: 1,
      operators: 12,
      helpers: 6,
      supervisors: 2
    },
    performance: {
      oee: 78,
      availability: 93,
      performance: 88,
      quality: 95,
      mtbf: 200,
      mttr: 1.5
    },
    costs: {
      hourlyRate: 100,
      setupCost: 300,
      maintenanceCost: 1500,
      overheadRate: 20,
      currency: 'USD'
    },
    schedule: {
      workingHours: '16 hours',
      shifts: ['Morning', 'Evening'],
      maintenanceWindow: 'Daily 22:00-06:00',
      plannedDowntime: 2
    },
    specifications: {
      maxWeight: 50,
      maxSize: '500x500x300mm',
      powerRequirement: '240V, single-phase',
      certifications: ['ISO 9001', 'Six Sigma']
    },
    status: 'Active',
    metadata: {
      createdAt: new Date('2023-02-20'),
      updatedAt: new Date('2024-03-15'),
      createdBy: 'Admin',
      updatedBy: 'Assembly Manager'
    }
  },
  {
    id: '3',
    code: 'WC-QC-001',
    name: 'Quality Control Station',
    type: 'Quality',
    department: 'Quality Assurance',
    location: 'QC Lab',
    capacity: {
      dailyCapacity: 200,
      unitOfMeasure: 'samples',
      shiftCapacity: 100,
      efficiency: 95,
      utilization: 70
    },
    operations: ['Inspection', 'Testing', 'Measurement', 'Documentation'],
    resources: {
      machines: 5,
      operators: 4,
      helpers: 2,
      supervisors: 1
    },
    performance: {
      oee: 85,
      availability: 98,
      performance: 90,
      quality: 97,
      mtbf: 500,
      mttr: 0.5
    },
    costs: {
      hourlyRate: 80,
      setupCost: 200,
      maintenanceCost: 1000,
      overheadRate: 15,
      currency: 'USD'
    },
    schedule: {
      workingHours: '8 hours',
      shifts: ['Morning'],
      maintenanceWindow: 'Weekly maintenance',
      plannedDowntime: 1
    },
    specifications: {
      environmentControl: 'Clean room, Class 10000',
      certifications: ['ISO 9001', 'ISO/IEC 17025', 'NADCAP']
    },
    status: 'Active',
    metadata: {
      createdAt: new Date('2023-03-10'),
      updatedAt: new Date('2024-02-28'),
      createdBy: 'Admin',
      updatedBy: 'Quality Manager'
    }
  }
];

export default function WorkCenterMaster() {
  const [workCenters, setWorkCenters] = useState<WorkCenter[]>(mockWorkCenters);
  const [selectedWorkCenter, setSelectedWorkCenter] = useState<WorkCenter | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [currentTab, setCurrentTab] = useState('basic');

  const handleEdit = (workCenter: WorkCenter) => {
    setSelectedWorkCenter(workCenter);
    setIsModalOpen(true);
    setCurrentTab('basic');
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this work center?')) {
      setWorkCenters(workCenters.filter(wc => wc.id !== id));
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'Active': { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle2 },
      'Inactive': { bg: 'bg-gray-100', text: 'text-gray-800', icon: XCircle },
      'Maintenance': { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: Wrench },
      'Breakdown': { bg: 'bg-red-100', text: 'text-red-800', icon: AlertTriangle }
    };
    const config = statusConfig[status as keyof typeof statusConfig];
    const Icon = config.icon;
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        <Icon className="h-3 w-3" />
        {status}
      </span>
    );
  };

  const getTypeBadge = (type: string) => {
    const typeConfig = {
      'Production': { bg: 'bg-blue-100', text: 'text-blue-800', icon: Factory },
      'Assembly': { bg: 'bg-purple-100', text: 'text-purple-800', icon: Cpu },
      'Quality': { bg: 'bg-green-100', text: 'text-green-800', icon: Shield },
      'Packaging': { bg: 'bg-orange-100', text: 'text-orange-800', icon: Package },
      'Maintenance': { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: Wrench }
    };
    const config = typeConfig[type as keyof typeof typeConfig];
    const Icon = config.icon;
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        <Icon className="h-3 w-3" />
        {type}
      </span>
    );
  };

  const getOEEColor = (oee: number) => {
    if (oee >= 85) return 'text-green-600';
    if (oee >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getUtilizationBar = (utilization: number) => {
    const color = utilization >= 80 ? 'bg-green-500' : utilization >= 60 ? 'bg-yellow-500' : 'bg-red-500';
    return (
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div className={`${color} h-2 rounded-full`} style={{ width: `${utilization}%` }} />
      </div>
    );
  };

  const filteredWorkCenters = useMemo(() => {
    return workCenters.filter(wc => {
      const matchesSearch = wc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           wc.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           wc.department.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'All' || wc.type === filterType;
      const matchesStatus = filterStatus === 'All' || wc.status === filterStatus;
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [workCenters, searchTerm, filterType, filterStatus]);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Work Center Master</h2>
        <p className="text-gray-600">Manage production work centers and resources</p>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-1 gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search work centers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="All">All Types</option>
                <option value="Production">Production</option>
                <option value="Assembly">Assembly</option>
                <option value="Quality">Quality</option>
                <option value="Packaging">Packaging</option>
                <option value="Maintenance">Maintenance</option>
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="All">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Breakdown">Breakdown</option>
              </select>
            </div>
            <button
              onClick={() => {
                setSelectedWorkCenter(null);
                setIsModalOpen(true);
                setCurrentTab('basic');
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Work Center
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Work Center
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type & Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Capacity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Performance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Resources
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredWorkCenters.map((wc) => (
                <tr key={wc.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{wc.name}</div>
                      <div className="text-sm text-gray-500">{wc.code}</div>
                      <div className="text-xs text-gray-400">{wc.department}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      {getTypeBadge(wc.type)}
                      <div className="text-sm text-gray-600">{wc.location}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <div className="flex items-center gap-1">
                        <Gauge className="h-3 w-3 text-gray-400" />
                        <span>{wc.capacity.dailyCapacity} {wc.capacity.unitOfMeasure}/day</span>
                      </div>
                      <div className="mt-1 space-y-1">
                        <div className="text-xs text-gray-500">
                          Utilization: {wc.capacity.utilization}%
                        </div>
                        {getUtilizationBar(wc.capacity.utilization)}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <div className={`font-medium ${getOEEColor(wc.performance.oee)}`}>
                        OEE: {wc.performance.oee}%
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        A: {wc.performance.availability}% | P: {wc.performance.performance}% | Q: {wc.performance.quality}%
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3 text-gray-400" />
                        <span>{wc.resources.operators} operators</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Factory className="h-3 w-3" />
                        <span>{wc.resources.machines} machines</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(wc.status)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(wc)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(wc.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold">
                {selectedWorkCenter ? 'Edit Work Center' : 'Add New Work Center'}
              </h3>
            </div>

            <div className="flex border-b border-gray-200">
              {['basic', 'capacity', 'resources', 'performance', 'costs', 'schedule'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setCurrentTab(tab)}
                  className={`px-4 py-2 font-medium capitalize ${
                    currentTab === tab
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab === 'basic' ? 'Basic Info' : tab}
                </button>
              ))}
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
              {currentTab === 'basic' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Work Center Code *
                      </label>
                      <input
                        type="text"
                        defaultValue={selectedWorkCenter?.code}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="WC-XXX-000"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Work Center Name *
                      </label>
                      <input
                        type="text"
                        defaultValue={selectedWorkCenter?.name}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter work center name"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Type *
                      </label>
                      <select defaultValue={selectedWorkCenter?.type || 'Production'}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                        <option value="Production">Production</option>
                        <option value="Assembly">Assembly</option>
                        <option value="Quality">Quality</option>
                        <option value="Packaging">Packaging</option>
                        <option value="Maintenance">Maintenance</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Status
                      </label>
                      <select defaultValue={selectedWorkCenter?.status || 'Active'}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                        <option value="Maintenance">Maintenance</option>
                        <option value="Breakdown">Breakdown</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Department *
                      </label>
                      <input
                        type="text"
                        defaultValue={selectedWorkCenter?.department}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., Manufacturing"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Location *
                      </label>
                      <input
                        type="text"
                        defaultValue={selectedWorkCenter?.location}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., Factory Floor - Zone A"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Operations
                    </label>
                    <textarea
                      defaultValue={selectedWorkCenter?.operations.join(', ')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      rows={2}
                      placeholder="Enter operations (comma-separated)"
                    />
                  </div>
                </div>
              )}

              {currentTab === 'capacity' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Daily Capacity *
                      </label>
                      <input
                        type="number"
                        defaultValue={selectedWorkCenter?.capacity.dailyCapacity}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Unit of Measure *
                      </label>
                      <input
                        type="text"
                        defaultValue={selectedWorkCenter?.capacity.unitOfMeasure}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., pieces, units, kg"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Shift Capacity
                      </label>
                      <input
                        type="number"
                        defaultValue={selectedWorkCenter?.capacity.shiftCapacity}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Efficiency (%)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        defaultValue={selectedWorkCenter?.capacity.efficiency}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Utilization (%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      defaultValue={selectedWorkCenter?.capacity.utilization}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              )}

              {currentTab === 'resources' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Number of Machines
                      </label>
                      <input
                        type="number"
                        defaultValue={selectedWorkCenter?.resources.machines}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Number of Operators
                      </label>
                      <input
                        type="number"
                        defaultValue={selectedWorkCenter?.resources.operators}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Number of Helpers
                      </label>
                      <input
                        type="number"
                        defaultValue={selectedWorkCenter?.resources.helpers}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Number of Supervisors
                      </label>
                      <input
                        type="number"
                        defaultValue={selectedWorkCenter?.resources.supervisors}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {currentTab === 'performance' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        OEE (%)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        defaultValue={selectedWorkCenter?.performance.oee}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Availability (%)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        defaultValue={selectedWorkCenter?.performance.availability}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Performance Rate (%)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        defaultValue={selectedWorkCenter?.performance.performance}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Quality Rate (%)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        defaultValue={selectedWorkCenter?.performance.quality}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        MTBF (hours)
                      </label>
                      <input
                        type="number"
                        defaultValue={selectedWorkCenter?.performance.mtbf}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Mean Time Between Failures"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        MTTR (hours)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        defaultValue={selectedWorkCenter?.performance.mttr}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Mean Time To Repair"
                      />
                    </div>
                  </div>
                </div>
              )}

              {currentTab === 'costs' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Hourly Rate
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        defaultValue={selectedWorkCenter?.costs.hourlyRate}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Currency
                      </label>
                      <select defaultValue={selectedWorkCenter?.costs.currency || 'USD'}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                        <option value="GBP">GBP</option>
                        <option value="INR">INR</option>
                        <option value="CNY">CNY</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Setup Cost
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        defaultValue={selectedWorkCenter?.costs.setupCost}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Maintenance Cost
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        defaultValue={selectedWorkCenter?.costs.maintenanceCost}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Overhead Rate (%)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      defaultValue={selectedWorkCenter?.costs.overheadRate}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              )}

              {currentTab === 'schedule' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Working Hours
                    </label>
                    <input
                      type="text"
                      defaultValue={selectedWorkCenter?.schedule.workingHours}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., 24/7, 8 hours, 16 hours"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Shifts
                    </label>
                    <div className="flex gap-3">
                      {['Morning', 'Evening', 'Night'].map(shift => (
                        <label key={shift} className="flex items-center">
                          <input
                            type="checkbox"
                            defaultChecked={selectedWorkCenter?.schedule.shifts?.includes(shift)}
                            className="mr-2"
                          />
                          <span className="text-sm">{shift}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Maintenance Window
                    </label>
                    <input
                      type="text"
                      defaultValue={selectedWorkCenter?.schedule.maintenanceWindow}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Sunday 06:00-12:00"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Planned Downtime (hours/week)
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      defaultValue={selectedWorkCenter?.schedule.plannedDowntime}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-3">Specifications</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Max Weight (kg)
                        </label>
                        <input
                          type="number"
                          defaultValue={selectedWorkCenter?.specifications?.maxWeight}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Max Size
                        </label>
                        <input
                          type="text"
                          defaultValue={selectedWorkCenter?.specifications?.maxSize}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="e.g., 2000x1000x800mm"
                        />
                      </div>
                    </div>

                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Power Requirement
                      </label>
                      <input
                        type="text"
                        defaultValue={selectedWorkCenter?.specifications?.powerRequirement}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., 415V, 3-phase, 50Hz"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-gray-200 flex justify-end gap-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  alert('Work Center saved successfully!');
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {selectedWorkCenter ? 'Update' : 'Create'} Work Center
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
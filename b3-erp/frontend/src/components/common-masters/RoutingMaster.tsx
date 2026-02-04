'use client';

import React, { useState, useMemo } from 'react';
import {
  GitBranch, Plus, Search, Edit2, Trash2, Copy,
  Factory, Clock, Settings, AlertCircle, CheckCircle2,
  Users, Wrench, DollarSign, TrendingUp, ArrowRight,
  ArrowDown, Layers, FileText, Calendar
} from 'lucide-react';

interface RoutingStep {
  stepNumber: number;
  operation: string;
  workCenter: string;
  setupTime: number;
  runTime: number;
  machineHours: number;
  laborHours: number;
  setupCost: number;
  runCost: number;
  description: string;
}

interface Routing {
  id: string;
  code: string;
  name: string;
  item: string;
  itemCode: string;
  version: string;
  effectiveFrom: Date;
  effectiveTo?: Date;
  steps: RoutingStep[];
  totalLeadTime: number;
  totalCost: number;
  defaultRouting: boolean;
  status: 'Active' | 'Inactive' | 'Draft' | 'Obsolete';
  approvedBy?: string;
  approvedDate?: Date;
  notes: string;
  metadata: {
    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
    updatedBy: string;
  };
}

const mockRoutings: Routing[] = [
  {
    id: '1',
    code: 'RTG-001',
    name: 'Standard Shaft Routing',
    item: 'Precision Shaft Assembly',
    itemCode: 'ITEM-001',
    version: 'V1.2',
    effectiveFrom: new Date('2024-01-01'),
    steps: [
      {
        stepNumber: 10,
        operation: 'Raw Material Cutting',
        workCenter: 'WC-PRD-001',
        setupTime: 30,
        runTime: 5,
        machineHours: 5,
        laborHours: 5,
        setupCost: 50,
        runCost: 25,
        description: 'Cut raw material to required length'
      },
      {
        stepNumber: 20,
        operation: 'CNC Turning',
        workCenter: 'WC-PRD-002',
        setupTime: 45,
        runTime: 15,
        machineHours: 15,
        laborHours: 15,
        setupCost: 75,
        runCost: 90,
        description: 'Turn shaft to specified diameter and tolerances'
      },
      {
        stepNumber: 30,
        operation: 'Heat Treatment',
        workCenter: 'WC-HT-001',
        setupTime: 60,
        runTime: 120,
        machineHours: 120,
        laborHours: 10,
        setupCost: 100,
        runCost: 200,
        description: 'Harden shaft through heat treatment process'
      },
      {
        stepNumber: 40,
        operation: 'Grinding',
        workCenter: 'WC-PRD-003',
        setupTime: 40,
        runTime: 20,
        machineHours: 20,
        laborHours: 20,
        setupCost: 60,
        runCost: 100,
        description: 'Finish grind to final dimensions'
      },
      {
        stepNumber: 50,
        operation: 'Quality Inspection',
        workCenter: 'WC-QC-001',
        setupTime: 15,
        runTime: 10,
        machineHours: 0,
        laborHours: 10,
        setupCost: 25,
        runCost: 40,
        description: 'Final dimensional and hardness inspection'
      }
    ],
    totalLeadTime: 225,
    totalCost: 765,
    defaultRouting: true,
    status: 'Active',
    approvedBy: 'Production Manager',
    approvedDate: new Date('2024-01-05'),
    notes: 'Standard routing for precision shaft manufacturing',
    metadata: {
      createdAt: new Date('2023-12-15'),
      updatedAt: new Date('2024-01-05'),
      createdBy: 'Process Engineer',
      updatedBy: 'Production Manager'
    }
  },
  {
    id: '2',
    code: 'RTG-002',
    name: 'Express Shaft Routing',
    item: 'Precision Shaft Assembly',
    itemCode: 'ITEM-001',
    version: 'V1.0',
    effectiveFrom: new Date('2024-02-01'),
    steps: [
      {
        stepNumber: 10,
        operation: 'Raw Material Cutting',
        workCenter: 'WC-PRD-001',
        setupTime: 20,
        runTime: 5,
        machineHours: 5,
        laborHours: 5,
        setupCost: 50,
        runCost: 25,
        description: 'Quick cut setup for urgent orders'
      },
      {
        stepNumber: 20,
        operation: 'Combined CNC Operations',
        workCenter: 'WC-PRD-004',
        setupTime: 30,
        runTime: 25,
        machineHours: 25,
        laborHours: 25,
        setupCost: 100,
        runCost: 150,
        description: 'Combined turning and finishing operations'
      },
      {
        stepNumber: 30,
        operation: 'Express Quality Check',
        workCenter: 'WC-QC-002',
        setupTime: 10,
        runTime: 5,
        machineHours: 0,
        laborHours: 5,
        setupCost: 20,
        runCost: 25,
        description: 'Expedited quality verification'
      }
    ],
    totalLeadTime: 120,
    totalCost: 395,
    defaultRouting: false,
    status: 'Active',
    approvedBy: 'Operations Director',
    approvedDate: new Date('2024-02-05'),
    notes: 'Fast-track routing for urgent production requirements',
    metadata: {
      createdAt: new Date('2024-01-20'),
      updatedAt: new Date('2024-02-05'),
      createdBy: 'Process Engineer',
      updatedBy: 'Operations Director'
    }
  }
];

export default function RoutingMaster() {
  const [routings, setRoutings] = useState<Routing[]>(mockRoutings);
  const [selectedRouting, setSelectedRouting] = useState<Routing | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [expandedRouting, setExpandedRouting] = useState<string | null>(null);

  const handleEdit = (routing: Routing) => {
    setSelectedRouting(routing);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this routing?')) {
      setRoutings(routings.filter(r => r.id !== id));
    }
  };

  const handleCopy = (routing: Routing) => {
    const newRouting = {
      ...routing,
      id: Date.now().toString(),
      code: `${routing.code}-COPY`,
      version: `V${parseFloat(routing.version.slice(1)) + 0.1}`,
      status: 'Draft' as const,
      defaultRouting: false
    };
    setRoutings([...routings, newRouting]);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'Active': { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle2 },
      'Inactive': { bg: 'bg-gray-100', text: 'text-gray-800', icon: AlertCircle },
      'Draft': { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: FileText },
      'Obsolete': { bg: 'bg-red-100', text: 'text-red-800', icon: AlertCircle }
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

  const filteredRoutings = useMemo(() => {
    return routings.filter(routing => {
      const matchesSearch = routing.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           routing.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           routing.item.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'All' || routing.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [routings, searchTerm, filterStatus]);

  return (
    <div className="p-6 ">
      <div className="mb-3">
        <h2 className="text-2xl font-bold mb-2">Routing Master</h2>
        <p className="text-gray-600">Manage manufacturing process sequences and operations</p>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center justify-between">
            <div className="flex flex-1 gap-2">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search routings..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="All">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Draft">Draft</option>
                <option value="Obsolete">Obsolete</option>
              </select>
            </div>
            <button
              onClick={() => {
                setSelectedRouting(null);
                setIsModalOpen(true);
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Routing
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          {filteredRoutings.map((routing) => (
            <div key={routing.id} className="border-b border-gray-200">
              <div 
                className="p-4 hover:bg-gray-50 cursor-pointer"
                onClick={() => setExpandedRouting(expandedRouting === routing.id ? null : routing.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 grid grid-cols-5 gap-2">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{routing.name}</div>
                      <div className="text-xs text-gray-500">{routing.code} • {routing.version}</div>
                      {routing.defaultRouting && (
                        <span className="inline-block mt-1 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">Default</span>
                      )}
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">{routing.item}</div>
                      <div className="text-xs text-gray-500">{routing.itemCode}</div>
                    </div>
                    <div>
                      <div className="flex items-center gap-1 text-sm">
                        <Layers className="h-3 w-3 text-gray-400" />
                        <span>{routing.steps.length} Steps</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock className="h-3 w-3" />
                        <span>{routing.totalLeadTime} min</span>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-1 text-sm">
                        <DollarSign className="h-3 w-3 text-gray-400" />
                        <span>${routing.totalCost.toFixed(2)}</span>
                      </div>
                      <div className="text-xs text-gray-500">Total Cost</div>
                    </div>
                    <div>
                      {getStatusBadge(routing.status)}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopy(routing);
                      }}
                      className="text-purple-600 hover:text-purple-800"
                      title="Copy Routing"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(routing);
                      }}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(routing.id);
                      }}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    <ArrowDown 
                      className={`h-4 w-4 text-gray-400 transition-transform ${
                        expandedRouting === routing.id ? 'transform rotate-180' : ''
                      }`}
                    />
                  </div>
                </div>
              </div>

              {expandedRouting === routing.id && (
                <div className="bg-gray-50 p-3 border-t border-gray-200">
                  <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
                    <GitBranch className="h-4 w-4" />
                    Process Steps
                  </h4>
                  <div className="space-y-2">
                    {routing.steps.map((step, index) => (
                      <div key={index} className="bg-white p-3 rounded border border-gray-200">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded">
                                Step {step.stepNumber}
                              </span>
                              <span className="text-sm font-medium">{step.operation}</span>
                            </div>
                            <div className="text-xs text-gray-600 mb-2">{step.description}</div>
                            <div className="grid grid-cols-4 gap-2 text-xs">
                              <div>
                                <span className="text-gray-500">Work Center:</span>
                                <div className="font-medium">{step.workCenter}</div>
                              </div>
                              <div>
                                <span className="text-gray-500">Setup/Run Time:</span>
                                <div className="font-medium">{step.setupTime}m / {step.runTime}m</div>
                              </div>
                              <div>
                                <span className="text-gray-500">Hours:</span>
                                <div className="font-medium">M:{step.machineHours} L:{step.laborHours}</div>
                              </div>
                              <div>
                                <span className="text-gray-500">Cost:</span>
                                <div className="font-medium">${(step.setupCost + step.runCost).toFixed(2)}</div>
                              </div>
                            </div>
                          </div>
                          {index < routing.steps.length - 1 && (
                            <ArrowRight className="h-4 w-4 text-gray-400 mt-2 ml-2" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  {routing.notes && (
                    <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded text-xs">
                      <span className="font-medium">Notes:</span> {routing.notes}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full  max-h-[90vh] overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold">
                {selectedRouting ? 'Edit Routing' : 'Add New Routing'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Routing Code *
                    </label>
                    <input
                      type="text"
                      defaultValue={selectedRouting?.code}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="RTG-XXX"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Routing Name *
                    </label>
                    <input
                      type="text"
                      defaultValue={selectedRouting?.name}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter routing name"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Item Code *
                    </label>
                    <input
                      type="text"
                      defaultValue={selectedRouting?.itemCode}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Select item"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Version *
                    </label>
                    <input
                      type="text"
                      defaultValue={selectedRouting?.version}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="V1.0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select 
                      defaultValue={selectedRouting?.status || 'Draft'}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                      <option value="Draft">Draft</option>
                      <option value="Obsolete">Obsolete</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    id="defaultRouting"
                    defaultChecked={selectedRouting?.defaultRouting}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="defaultRouting" className="text-sm text-gray-700">
                    Set as default routing for this item
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes
                  </label>
                  <textarea
                    defaultValue={selectedRouting?.notes}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="Additional notes about this routing"
                  />
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-gray-200 flex justify-end gap-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Save Routing
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

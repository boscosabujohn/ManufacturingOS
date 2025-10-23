'use client';

import React, { useState } from 'react';
import { Cog, Plus, Search, Eye, Edit3, Activity, AlertCircle, Wrench } from 'lucide-react';

interface Machine {
  id: string;
  machineCode: string;
  machineName: string;
  description: string;
  
  category: 'cutting' | 'drilling' | 'assembly' | 'finishing' | 'packaging' | 'testing';
  manufacturer: string;
  model: string;
  serialNumber: string;
  
  specifications: {
    capacity: string;
    power: string; // kW
    dimensions?: string; // L x W x H
    weight?: number; // kg
  };
  
  location: {
    plant: string;
    workCenter: string;
    floor?: string;
  };
  
  acquisition: {
    purchaseDate: string;
    supplier: string;
    purchaseCost: number;
    warrantyExpiry?: string;
  };
  
  maintenance: {
    lastServiceDate?: string;
    nextServiceDate: string;
    serviceInterval: number; // days
    downtime: number; // hours
  };
  
  performance: {
    efficiency: number; // percentage
    utilizationRate: number; // percentage
    productionRate: number; // units per hour
  };
  
  operators: string[];
  
  status: 'operational' | 'maintenance' | 'breakdown' | 'idle';
  createdBy: string;
  createdAt: string;
}

const MachineMaster: React.FC = () => {
  const [machines, setMachines] = useState<Machine[]>([
    {
      id: '1',
      machineCode: 'CNC-001',
      machineName: 'CNC Router Machine',
      description: 'High precision CNC router for cabinet cutting',
      category: 'cutting',
      manufacturer: 'Biesse',
      model: 'Rover A 1632',
      serialNumber: 'BIE-2023-CNC-001',
      specifications: {
        capacity: '1600 x 3200 mm',
        power: '9.2 kW',
        dimensions: '4500 x 2800 x 2200 mm',
        weight: 3500
      },
      location: {
        plant: 'Main Manufacturing Plant',
        workCenter: 'Cutting Center',
        floor: 'Ground Floor'
      },
      acquisition: {
        purchaseDate: '2023-06-15',
        supplier: 'Biesse India',
        purchaseCost: 4500000,
        warrantyExpiry: '2026-06-15'
      },
      maintenance: {
        lastServiceDate: '2024-09-15',
        nextServiceDate: '2024-12-15',
        serviceInterval: 90,
        downtime: 12
      },
      performance: {
        efficiency: 92,
        utilizationRate: 85,
        productionRate: 25
      },
      operators: ['OP-001', 'OP-002', 'OP-005'],
      status: 'operational',
      createdBy: 'admin',
      createdAt: '2023-06-15T10:00:00Z'
    },
    {
      id: '2',
      machineCode: 'EDG-001',
      machineName: 'Edge Banding Machine',
      description: 'Automatic edge banding for cabinet panels',
      category: 'finishing',
      manufacturer: 'SCM Group',
      model: 'Olimpic K 560',
      serialNumber: 'SCM-2022-EDG-001',
      specifications: {
        capacity: '560 mm width',
        power: '14.5 kW',
        dimensions: '6800 x 1200 x 1650 mm',
        weight: 2800
      },
      location: {
        plant: 'Main Manufacturing Plant',
        workCenter: 'Finishing Center',
        floor: 'Ground Floor'
      },
      acquisition: {
        purchaseDate: '2022-08-20',
        supplier: 'SCM India',
        purchaseCost: 3800000,
        warrantyExpiry: '2025-08-20'
      },
      maintenance: {
        lastServiceDate: '2024-08-20',
        nextServiceDate: '2024-11-20',
        serviceInterval: 90,
        downtime: 8
      },
      performance: {
        efficiency: 88,
        utilizationRate: 90,
        productionRate: 40
      },
      operators: ['OP-003', 'OP-004'],
      status: 'operational',
      createdBy: 'admin',
      createdAt: '2022-08-20T10:00:00Z'
    },
    {
      id: '3',
      machineCode: 'DRL-002',
      machineName: 'Multi-Spindle Drilling Machine',
      description: 'Multiple drilling heads for cabinet assembly',
      category: 'drilling',
      manufacturer: 'Vitap',
      model: 'Point K2',
      serialNumber: 'VIT-2023-DRL-002',
      specifications: {
        capacity: '32 spindles',
        power: '5.5 kW',
        dimensions: '1800 x 1200 x 2100 mm',
        weight: 1200
      },
      location: {
        plant: 'Main Manufacturing Plant',
        workCenter: 'Drilling Center',
        floor: 'Ground Floor'
      },
      acquisition: {
        purchaseDate: '2023-03-10',
        supplier: 'Vitap India',
        purchaseCost: 1500000
      },
      maintenance: {
        nextServiceDate: '2024-11-10',
        serviceInterval: 60,
        downtime: 4
      },
      performance: {
        efficiency: 95,
        utilizationRate: 78,
        productionRate: 60
      },
      operators: ['OP-006', 'OP-007'],
      status: 'operational',
      createdBy: 'admin',
      createdAt: '2023-03-10T10:00:00Z'
    },
    {
      id: '4',
      machineCode: 'SPR-001',
      machineName: 'Spray Booth',
      description: 'Automated spray painting booth with drying',
      category: 'finishing',
      manufacturer: 'Col-Met',
      model: 'Spray Booth SB-2040',
      serialNumber: 'CLM-2021-SPR-001',
      specifications: {
        capacity: '20 x 40 ft',
        power: '25 kW',
        dimensions: '7000 x 13000 x 3500 mm',
        weight: 5500
      },
      location: {
        plant: 'Main Manufacturing Plant',
        workCenter: 'Finishing Center',
        floor: 'First Floor'
      },
      acquisition: {
        purchaseDate: '2021-11-25',
        supplier: 'Col-Met India',
        purchaseCost: 2500000,
        warrantyExpiry: '2024-11-25'
      },
      maintenance: {
        lastServiceDate: '2024-07-25',
        nextServiceDate: '2024-10-25',
        serviceInterval: 90,
        downtime: 24
      },
      performance: {
        efficiency: 82,
        utilizationRate: 72,
        productionRate: 15
      },
      operators: ['OP-008', 'OP-009'],
      status: 'maintenance',
      createdBy: 'admin',
      createdAt: '2021-11-25T10:00:00Z'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredMachines = machines.filter(m => {
    const matchesSearch = m.machineName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         m.machineCode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || m.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const totalInvestment = machines.reduce((sum, m) => sum + m.acquisition.purchaseCost, 0);
  const avgEfficiency = machines.reduce((sum, m) => sum + m.performance.efficiency, 0) / machines.length;
  const avgUtilization = machines.reduce((sum, m) => sum + m.performance.utilizationRate, 0) / machines.length;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Cog className="w-8 h-8 text-indigo-600" />
                Machine Master
              </h1>
              <p className="text-gray-600 mt-2">Manage equipment database and performance</p>
            </div>
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Machine
            </button>
          </div>

          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search machines..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Status</option>
              <option value="operational">Operational</option>
              <option value="maintenance">Maintenance</option>
              <option value="breakdown">Breakdown</option>
              <option value="idle">Idle</option>
            </select>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Machines</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{machines.length}</p>
              </div>
              <Cog className="w-12 h-12 text-indigo-600 opacity-20" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Operational</p>
                <p className="text-2xl font-bold text-green-600 mt-1">
                  {machines.filter(m => m.status === 'operational').length}
                </p>
              </div>
              <Activity className="w-12 h-12 text-green-600 opacity-20" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Efficiency</p>
                <p className="text-2xl font-bold text-blue-600 mt-1">{avgEfficiency.toFixed(0)}%</p>
              </div>
              <Activity className="w-12 h-12 text-blue-600 opacity-20" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Utilization</p>
                <p className="text-2xl font-bold text-purple-600 mt-1">{avgUtilization.toFixed(0)}%</p>
              </div>
              <Wrench className="w-12 h-12 text-purple-600 opacity-20" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Investment</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  ₹{(totalInvestment / 10000000).toFixed(1)}Cr
                </p>
              </div>
              <AlertCircle className="w-12 h-12 text-orange-600 opacity-20" />
            </div>
          </div>
        </div>

        {/* Machines List */}
        <div className="space-y-4">
          {filteredMachines.map(machine => (
            <div key={machine.id} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{machine.machineName}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full uppercase font-medium ${
                      machine.category === 'cutting' 
                        ? 'bg-blue-100 text-blue-800'
                        : machine.category === 'drilling'
                        ? 'bg-green-100 text-green-800'
                        : machine.category === 'finishing'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {machine.category}
                    </span>
                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                      machine.status === 'operational' 
                        ? 'bg-green-100 text-green-800'
                        : machine.status === 'maintenance'
                        ? 'bg-yellow-100 text-yellow-800'
                        : machine.status === 'breakdown'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {machine.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">
                    {machine.machineCode} • {machine.manufacturer} {machine.model}
                  </p>
                  <p className="text-sm text-gray-500">{machine.description}</p>
                </div>
                <div className="flex gap-2">
                  <button className="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                    <Eye className="w-4 h-4 text-gray-600" />
                    <span className="text-gray-700">View</span>
                  </button>
                  <button className="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                    <Edit3 className="w-4 h-4 text-gray-600" />
                    <span className="text-gray-700">Edit</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Specifications */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Specifications</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Capacity:</span>
                      <span className="font-medium text-xs">{machine.specifications.capacity}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Power:</span>
                      <span className="font-medium">{machine.specifications.power}</span>
                    </div>
                    {machine.specifications.weight && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Weight:</span>
                        <span className="font-medium">{machine.specifications.weight} kg</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Performance */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Performance</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Efficiency:</span>
                      <span className={`font-medium ${machine.performance.efficiency >= 90 ? 'text-green-600' : 'text-orange-600'}`}>
                        {machine.performance.efficiency}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Utilization:</span>
                      <span className="font-medium">{machine.performance.utilizationRate}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Rate:</span>
                      <span className="font-medium">{machine.performance.productionRate}/hr</span>
                    </div>
                  </div>
                </div>

                {/* Maintenance */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Maintenance</h4>
                  <div className="space-y-1 text-sm">
                    {machine.maintenance.lastServiceDate && (
                      <div>
                        <span className="text-gray-600">Last Service:</span>
                        <p className="font-medium text-xs">
                          {new Date(machine.maintenance.lastServiceDate).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                    <div>
                      <span className="text-gray-600">Next Service:</span>
                      <p className="font-medium text-xs text-orange-600">
                        {new Date(machine.maintenance.nextServiceDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Downtime:</span>
                      <span className="font-medium">{machine.maintenance.downtime}h</span>
                    </div>
                  </div>
                </div>

                {/* Location & Cost */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Location & Cost</h4>
                  <div className="space-y-1 text-sm">
                    <div>
                      <span className="text-gray-600">Work Center:</span>
                      <p className="font-medium text-xs">{machine.location.workCenter}</p>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Cost:</span>
                      <span className="font-medium">
                        ₹{(machine.acquisition.purchaseCost / 100000).toFixed(1)}L
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Operators:</span>
                      <span className="font-medium">{machine.operators.length}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MachineMaster;

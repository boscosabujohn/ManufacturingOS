'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Search, Edit2, Trash2, GitBranch, Clock, DollarSign, Layers, ChevronRight, Settings } from 'lucide-react';

interface RoutingOperation {
  sequence: number;
  workCenter: string;
  operation: string;
  setupTime: number;
  cycleTime: number;
  laborCost: number;
}

interface Routing {
  id: string;
  code: string;
  name: string;
  productCode: string;
  productName: string;
  version: string;
  department: string;
  totalOperations: number;
  totalSetupTime: number;
  totalCycleTime: number;
  totalCost: number;
  status: 'active' | 'inactive' | 'draft' | 'archived';
  effectiveFrom: string;
  effectiveTo: string;
  operations: RoutingOperation[];
}

export default function RoutingSettingsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [expandedRouting, setExpandedRouting] = useState<string | null>(null);

  // Mock routing data
  const routings: Routing[] = [
    {
      id: 'ROUTE-001',
      code: 'RT-ASSY-001',
      name: 'Standard Assembly Routing',
      productCode: 'PROD-001',
      productName: 'Industrial Valve Assembly',
      version: 'v1.2',
      department: 'Assembly',
      totalOperations: 5,
      totalSetupTime: 45,
      totalCycleTime: 120,
      totalCost: 850,
      status: 'active',
      effectiveFrom: '2025-01-01',
      effectiveTo: '2025-12-31',
      operations: [
        { sequence: 10, workCenter: 'ASSY-LINE-01', operation: 'Base Assembly', setupTime: 15, cycleTime: 30, laborCost: 200 },
        { sequence: 20, workCenter: 'WELD-ST-01', operation: 'Welding', setupTime: 10, cycleTime: 25, laborCost: 180 },
        { sequence: 30, workCenter: 'QC-STATION-01', operation: 'Quality Check', setupTime: 5, cycleTime: 15, laborCost: 120 },
        { sequence: 40, workCenter: 'POLISH-01', operation: 'Polishing', setupTime: 10, cycleTime: 35, laborCost: 220 },
        { sequence: 50, workCenter: 'PACK-LINE-01', operation: 'Final Packaging', setupTime: 5, cycleTime: 15, laborCost: 130 }
      ]
    },
    {
      id: 'ROUTE-002',
      code: 'RT-FAB-001',
      name: 'Metal Fabrication Routing',
      productCode: 'PROD-002',
      productName: 'Steel Frame Component',
      version: 'v2.0',
      department: 'Fabrication',
      totalOperations: 4,
      totalSetupTime: 35,
      totalCycleTime: 95,
      totalCost: 720,
      status: 'active',
      effectiveFrom: '2025-01-01',
      effectiveTo: '2025-12-31',
      operations: [
        { sequence: 10, workCenter: 'CNC-CUT-01', operation: 'CNC Cutting', setupTime: 15, cycleTime: 30, laborCost: 250 },
        { sequence: 20, workCenter: 'PRESS-HYDRO-01', operation: 'Press Forming', setupTime: 10, cycleTime: 25, laborCost: 200 },
        { sequence: 30, workCenter: 'WELD-ST-01', operation: 'Welding', setupTime: 5, cycleTime: 25, laborCost: 180 },
        { sequence: 40, workCenter: 'QC-STATION-01', operation: 'Final Inspection', setupTime: 5, cycleTime: 15, laborCost: 90 }
      ]
    },
    {
      id: 'ROUTE-003',
      code: 'RT-PAINT-001',
      name: 'Paint & Finish Routing',
      productCode: 'PROD-003',
      productName: 'Painted Chassis',
      version: 'v1.5',
      department: 'Finishing',
      totalOperations: 6,
      totalSetupTime: 50,
      totalCycleTime: 140,
      totalCost: 950,
      status: 'active',
      effectiveFrom: '2025-01-01',
      effectiveTo: '2025-12-31',
      operations: [
        { sequence: 10, workCenter: 'POLISH-01', operation: 'Surface Prep', setupTime: 10, cycleTime: 20, laborCost: 150 },
        { sequence: 20, workCenter: 'PAINT-BOOTH-01', operation: 'Primer Coat', setupTime: 10, cycleTime: 25, laborCost: 180 },
        { sequence: 30, workCenter: 'PAINT-BOOTH-01', operation: 'Base Coat', setupTime: 10, cycleTime: 30, laborCost: 200 },
        { sequence: 40, workCenter: 'PAINT-BOOTH-01', operation: 'Clear Coat', setupTime: 10, cycleTime: 30, laborCost: 200 },
        { sequence: 50, workCenter: 'QC-STATION-01', operation: 'Quality Check', setupTime: 5, cycleTime: 20, laborCost: 120 },
        { sequence: 60, workCenter: 'PACK-LINE-01', operation: 'Packaging', setupTime: 5, cycleTime: 15, laborCost: 100 }
      ]
    },
    {
      id: 'ROUTE-004',
      code: 'RT-MACH-001',
      name: 'CNC Machining Routing',
      productCode: 'PROD-004',
      productName: 'Precision Gear',
      version: 'v1.0',
      department: 'Machining',
      totalOperations: 3,
      totalSetupTime: 40,
      totalCycleTime: 75,
      totalCost: 680,
      status: 'active',
      effectiveFrom: '2025-01-01',
      effectiveTo: '2025-12-31',
      operations: [
        { sequence: 10, workCenter: 'CNC-CUT-01', operation: 'Rough Machining', setupTime: 20, cycleTime: 35, laborCost: 300 },
        { sequence: 20, workCenter: 'CNC-CUT-01', operation: 'Finish Machining', setupTime: 15, cycleTime: 30, laborCost: 280 },
        { sequence: 30, workCenter: 'QC-STATION-01', operation: 'Dimensional Check', setupTime: 5, cycleTime: 10, laborCost: 100 }
      ]
    },
    {
      id: 'ROUTE-005',
      code: 'RT-LASER-001',
      name: 'Laser Cutting Routing',
      productCode: 'PROD-005',
      productName: 'Sheet Metal Part',
      version: 'v1.1',
      department: 'Cutting',
      totalOperations: 3,
      totalSetupTime: 25,
      totalCycleTime: 55,
      totalCost: 520,
      status: 'active',
      effectiveFrom: '2025-01-01',
      effectiveTo: '2025-12-31',
      operations: [
        { sequence: 10, workCenter: 'LASER-CUT-02', operation: 'Laser Cutting', setupTime: 15, cycleTime: 30, laborCost: 280 },
        { sequence: 20, workCenter: 'POLISH-01', operation: 'Deburring', setupTime: 5, cycleTime: 15, laborCost: 140 },
        { sequence: 30, workCenter: 'QC-STATION-01', operation: 'Inspection', setupTime: 5, cycleTime: 10, laborCost: 100 }
      ]
    },
    {
      id: 'ROUTE-006',
      code: 'RT-DRAFT-001',
      name: 'New Product Routing',
      productCode: 'PROD-006',
      productName: 'Prototype Assembly',
      version: 'v0.1',
      department: 'R&D',
      totalOperations: 4,
      totalSetupTime: 30,
      totalCycleTime: 80,
      totalCost: 600,
      status: 'draft',
      effectiveFrom: '2025-11-01',
      effectiveTo: '2025-12-31',
      operations: [
        { sequence: 10, workCenter: 'ASSY-LINE-01', operation: 'Assembly', setupTime: 10, cycleTime: 30, laborCost: 200 },
        { sequence: 20, workCenter: 'QC-STATION-01', operation: 'Testing', setupTime: 10, cycleTime: 25, laborCost: 180 },
        { sequence: 30, workCenter: 'POLISH-01', operation: 'Finishing', setupTime: 5, cycleTime: 15, laborCost: 120 },
        { sequence: 40, workCenter: 'PACK-LINE-01', operation: 'Packaging', setupTime: 5, cycleTime: 10, laborCost: 100 }
      ]
    },
    {
      id: 'ROUTE-007',
      code: 'RT-ASSY-002',
      name: 'Complex Assembly Routing',
      productCode: 'PROD-007',
      productName: 'Multi-component System',
      version: 'v3.0',
      department: 'Assembly',
      totalOperations: 7,
      totalSetupTime: 60,
      totalCycleTime: 180,
      totalCost: 1250,
      status: 'active',
      effectiveFrom: '2025-01-01',
      effectiveTo: '2025-12-31',
      operations: [
        { sequence: 10, workCenter: 'ASSY-LINE-01', operation: 'Sub-assembly 1', setupTime: 10, cycleTime: 25, laborCost: 180 },
        { sequence: 20, workCenter: 'ASSY-LINE-01', operation: 'Sub-assembly 2', setupTime: 10, cycleTime: 25, laborCost: 180 },
        { sequence: 30, workCenter: 'ASSY-LINE-01', operation: 'Main Assembly', setupTime: 15, cycleTime: 40, laborCost: 250 },
        { sequence: 40, workCenter: 'WELD-ST-01', operation: 'Welding', setupTime: 10, cycleTime: 30, laborCost: 200 },
        { sequence: 50, workCenter: 'QC-STATION-01', operation: 'Testing', setupTime: 5, cycleTime: 30, laborCost: 200 },
        { sequence: 60, workCenter: 'PAINT-BOOTH-01', operation: 'Coating', setupTime: 5, cycleTime: 20, laborCost: 140 },
        { sequence: 70, workCenter: 'PACK-LINE-01', operation: 'Final Packaging', setupTime: 5, cycleTime: 10, laborCost: 100 }
      ]
    },
    {
      id: 'ROUTE-008',
      code: 'RT-OLD-001',
      name: 'Legacy Product Routing',
      productCode: 'PROD-OLD',
      productName: 'Discontinued Model',
      version: 'v1.0',
      department: 'Assembly',
      totalOperations: 3,
      totalSetupTime: 20,
      totalCycleTime: 50,
      totalCost: 380,
      status: 'archived',
      effectiveFrom: '2024-01-01',
      effectiveTo: '2024-12-31',
      operations: [
        { sequence: 10, workCenter: 'ASSY-LINE-01', operation: 'Assembly', setupTime: 10, cycleTime: 25, laborCost: 180 },
        { sequence: 20, workCenter: 'QC-STATION-01', operation: 'Inspection', setupTime: 5, cycleTime: 15, laborCost: 100 },
        { sequence: 30, workCenter: 'PACK-LINE-01', operation: 'Packaging', setupTime: 5, cycleTime: 10, laborCost: 100 }
      ]
    }
  ];

  const filteredRoutings = routings.filter(routing => {
    const matchesSearch = routing.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         routing.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         routing.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         routing.productCode.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || routing.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700';
      case 'inactive': return 'bg-gray-100 text-gray-700';
      case 'draft': return 'bg-blue-100 text-blue-700';
      case 'archived': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedRouting(expandedRouting === id ? null : id);
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
            <h1 className="text-2xl font-bold text-gray-900">Production Routings</h1>
            <p className="text-sm text-gray-500 mt-1">Manage manufacturing routings and process flows</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
            <Plus className="w-4 h-4" />
            <span>Add Routing</span>
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-3">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-3 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Total Routings</p>
              <p className="text-3xl font-bold text-blue-900 mt-1">{routings.length}</p>
            </div>
            <div className="p-3 bg-blue-200 rounded-lg">
              <GitBranch className="w-6 h-6 text-blue-700" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-3 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Active Routings</p>
              <p className="text-3xl font-bold text-green-900 mt-1">
                {routings.filter(r => r.status === 'active').length}
              </p>
            </div>
            <div className="p-3 bg-green-200 rounded-lg">
              <Settings className="w-6 h-6 text-green-700" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-3 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">Total Operations</p>
              <p className="text-3xl font-bold text-purple-900 mt-1">
                {routings.filter(r => r.status === 'active').reduce((sum, r) => sum + r.totalOperations, 0)}
              </p>
            </div>
            <div className="p-3 bg-purple-200 rounded-lg">
              <Layers className="w-6 h-6 text-purple-700" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-3 border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-600">Avg Cycle Time</p>
              <p className="text-3xl font-bold text-orange-900 mt-1">
                {Math.round(routings.filter(r => r.status === 'active').reduce((sum, r) => sum + r.totalCycleTime, 0) /
                  routings.filter(r => r.status === 'active').length)}m
              </p>
            </div>
            <div className="p-3 bg-orange-200 rounded-lg">
              <Clock className="w-6 h-6 text-orange-700" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-3 mb-3">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by routing name, code, or product..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Routings List */}
      <div className="space-y-2">
        {filteredRoutings.map((routing) => (
          <div key={routing.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {/* Routing Header */}
            <div
              className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => toggleExpand(routing.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-gray-900">{routing.name}</h3>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(routing.status)}`}>
                      {routing.status}
                    </span>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">{routing.version}</span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mt-4">
                    <div>
                      <p className="text-xs text-gray-500">Routing Code</p>
                      <p className="text-sm font-mono font-bold text-gray-900">{routing.code}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Product</p>
                      <p className="text-sm font-semibold text-gray-900">{routing.productCode}</p>
                      <p className="text-xs text-gray-600">{routing.productName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Operations</p>
                      <p className="text-sm font-bold text-blue-600">{routing.totalOperations}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Total Time</p>
                      <p className="text-sm font-bold text-purple-600">{routing.totalCycleTime}m</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Total Cost</p>
                      <p className="text-sm font-bold text-green-600">${routing.totalCost}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={(e) => { e.stopPropagation(); }}
                    className="p-2 hover:bg-gray-100 rounded transition-colors"
                  >
                    <Edit2 className="w-4 h-4 text-blue-600" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); }}
                    className="p-2 hover:bg-gray-100 rounded transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                  <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${expandedRouting === routing.id ? 'rotate-90' : ''}`} />
                </div>
              </div>
            </div>

            {/* Expanded Operations */}
            {expandedRouting === routing.id && (
              <div className="border-t border-gray-200 bg-gray-50 p-3">
                <h4 className="text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <Layers className="w-4 h-4" />
                  Operations Sequence
                </h4>
                <div className="space-y-2">
                  {routing.operations.map((op, idx) => (
                    <div key={idx} className="bg-white p-3 rounded-lg border border-gray-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-700 font-bold rounded-full text-sm">
                            {op.sequence}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-900">{op.operation}</p>
                            <p className="text-xs text-gray-500">{op.workCenter}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <p className="text-xs text-gray-500">Setup Time</p>
                            <p className="text-sm font-semibold text-gray-900">{op.setupTime}m</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-gray-500">Cycle Time</p>
                            <p className="text-sm font-semibold text-purple-600">{op.cycleTime}m</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-gray-500">Labor Cost</p>
                            <p className="text-sm font-semibold text-green-600">${op.laborCost}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <p className="text-xs text-blue-600 font-medium">Total Setup Time</p>
                      <p className="text-lg font-bold text-blue-900">{routing.totalSetupTime}m</p>
                    </div>
                    <div>
                      <p className="text-xs text-purple-600 font-medium">Total Cycle Time</p>
                      <p className="text-lg font-bold text-purple-900">{routing.totalCycleTime}m</p>
                    </div>
                    <div>
                      <p className="text-xs text-green-600 font-medium">Total Labor Cost</p>
                      <p className="text-lg font-bold text-green-900">${routing.totalCost}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredRoutings.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-12">
          <div className="text-center">
            <p className="text-gray-500">No routings found matching your criteria</p>
          </div>
        </div>
      )}
    </div>
  );
}

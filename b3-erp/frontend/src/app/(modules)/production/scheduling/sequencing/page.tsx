'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Search,
  ArrowUpDown,
  Clock,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Package,
  GripVertical,
  Save,
  RefreshCw,
  Zap
} from 'lucide-react';

interface SequenceItem {
  id: string;
  sequence: number;
  workOrderNumber: string;
  productCode: string;
  productName: string;
  category: string;
  quantity: number;
  unit: string;
  priority: 'urgent' | 'high' | 'medium' | 'low';
  dueDate: string;
  estimatedDuration: number;
  setupTime: number;
  station: string;
  dependencies: string[];
  materialReady: boolean;
  status: 'queued' | 'ready' | 'blocked';
  suggestedSequence: number;
  setupCost: number;
}

export default function ProductionSequencingPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStation, setFilterStation] = useState<string>('all');
  const [sequenceMode, setSequenceMode] = useState<'manual' | 'auto'>('manual');
  const [draggedItem, setDraggedItem] = useState<string | null>(null);

  const [sequences, setSequences] = useState<SequenceItem[]>([
    {
      id: '1',
      sequence: 1,
      workOrderNumber: 'WO-2025-1143',
      productCode: 'KIT-APPL-001',
      productName: 'Auto-Clean Kitchen Chimney - 90cm',
      category: 'Kitchen Appliances',
      quantity: 15,
      unit: 'PC',
      priority: 'urgent',
      dueDate: '2025-10-23',
      estimatedDuration: 13,
      setupTime: 2,
      station: 'Motor Assembly',
      dependencies: [],
      materialReady: true,
      status: 'ready',
      suggestedSequence: 1,
      setupCost: 5000
    },
    {
      id: '2',
      sequence: 2,
      workOrderNumber: 'WO-2025-1142',
      productCode: 'KIT-SINK-001',
      productName: 'Premium SS304 Kitchen Sink - Double Bowl',
      category: 'Kitchen Sinks',
      quantity: 25,
      unit: 'PC',
      priority: 'high',
      dueDate: '2025-10-24',
      estimatedDuration: 12,
      setupTime: 1.5,
      station: 'Polishing & Finishing',
      dependencies: [],
      materialReady: true,
      status: 'ready',
      suggestedSequence: 2,
      setupCost: 3500
    },
    {
      id: '3',
      sequence: 3,
      workOrderNumber: 'WO-2025-1136',
      productCode: 'KIT-COUNT-001',
      productName: 'Granite Countertop - Premium Black Galaxy',
      category: 'Countertops',
      quantity: 20,
      unit: 'PC',
      priority: 'urgent',
      dueDate: '2025-10-25',
      estimatedDuration: 16,
      setupTime: 3,
      station: 'Edge Polishing',
      dependencies: [],
      materialReady: true,
      status: 'ready',
      suggestedSequence: 1,
      setupCost: 8000
    },
    {
      id: '4',
      sequence: 4,
      workOrderNumber: 'WO-2025-1135',
      productCode: 'KIT-COOK-001',
      productName: 'Professional Cookware Set - 7 Piece',
      category: 'Cookware',
      quantity: 50,
      unit: 'SET',
      priority: 'high',
      dueDate: '2025-10-27',
      estimatedDuration: 16,
      setupTime: 2.5,
      station: 'Non-Stick Coating',
      dependencies: [],
      materialReady: true,
      status: 'ready',
      suggestedSequence: 3,
      setupCost: 6000
    },
    {
      id: '5',
      sequence: 5,
      workOrderNumber: 'WO-2025-1144',
      productCode: 'KIT-CAB-001',
      productName: 'Modular Base Cabinet - 3 Drawer',
      category: 'Kitchen Cabinets',
      quantity: 40,
      unit: 'PC',
      priority: 'high',
      dueDate: '2025-11-02',
      estimatedDuration: 20,
      setupTime: 4,
      station: 'Panel Cutting',
      dependencies: [],
      materialReady: false,
      status: 'blocked',
      suggestedSequence: 7,
      setupCost: 10000
    },
    {
      id: '6',
      sequence: 6,
      workOrderNumber: 'WO-2025-1145',
      productCode: 'KIT-FAUC-001',
      productName: 'Chrome Finish Kitchen Faucet - Single Lever',
      category: 'Kitchen Faucets',
      quantity: 60,
      unit: 'PC',
      priority: 'medium',
      dueDate: '2025-11-05',
      estimatedDuration: 12,
      setupTime: 1,
      station: 'Body Machining',
      dependencies: [],
      materialReady: true,
      status: 'ready',
      suggestedSequence: 4,
      setupCost: 2500
    },
    {
      id: '7',
      sequence: 7,
      workOrderNumber: 'WO-2025-1137',
      productCode: 'KIT-ACC-001',
      productName: 'Modular Kitchen Organizer Set - Premium',
      category: 'Kitchen Accessories',
      quantity: 80,
      unit: 'SET',
      priority: 'low',
      dueDate: '2025-10-30',
      estimatedDuration: 12,
      setupTime: 0.5,
      station: 'Packaging',
      dependencies: [],
      materialReady: true,
      status: 'ready',
      suggestedSequence: 5,
      setupCost: 1000
    },
    {
      id: '8',
      sequence: 8,
      workOrderNumber: 'WO-2025-1138',
      productCode: 'KIT-SINK-003',
      productName: 'Undermount SS Sink - Single Bowl Large',
      category: 'Kitchen Sinks',
      quantity: 35,
      unit: 'PC',
      priority: 'high',
      dueDate: '2025-10-22',
      estimatedDuration: 15,
      setupTime: 1.5,
      station: 'Welding',
      dependencies: [],
      materialReady: true,
      status: 'ready',
      suggestedSequence: 1,
      setupCost: 3500
    },
    {
      id: '9',
      sequence: 9,
      workOrderNumber: 'WO-2025-1146',
      productCode: 'KIT-APPL-002',
      productName: 'Built-in Microwave Oven - 30L',
      category: 'Kitchen Appliances',
      quantity: 18,
      unit: 'PC',
      priority: 'medium',
      dueDate: '2025-11-07',
      estimatedDuration: 15,
      setupTime: 2,
      station: 'Assembly',
      dependencies: ['1'],
      materialReady: true,
      status: 'queued',
      suggestedSequence: 6,
      setupCost: 5000
    },
    {
      id: '10',
      sequence: 10,
      workOrderNumber: 'WO-2025-1147',
      productCode: 'KIT-SINK-002',
      productName: 'Granite Composite Sink - Single Bowl',
      category: 'Kitchen Sinks',
      quantity: 22,
      unit: 'PC',
      priority: 'medium',
      dueDate: '2025-11-10',
      estimatedDuration: 17,
      setupTime: 2.5,
      station: 'Molding',
      dependencies: ['2'],
      materialReady: true,
      status: 'queued',
      suggestedSequence: 8,
      setupCost: 6500
    }
  ]);

  const stations = ['all', ...Array.from(new Set(sequences.map(s => s.station)))];

  const filteredSequences = sequences.filter(seq => {
    const matchesSearch =
      seq.workOrderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      seq.productName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStation = filterStation === 'all' || seq.station === filterStation;

    return matchesSearch && matchesStation;
  }).sort((a, b) => a.sequence - b.sequence);

  const handleDragStart = (id: string) => {
    setDraggedItem(id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (targetId: string) => {
    if (!draggedItem || draggedItem === targetId) return;

    const newSequences = [...sequences];
    const draggedIdx = newSequences.findIndex(s => s.id === draggedItem);
    const targetIdx = newSequences.findIndex(s => s.id === targetId);

    const [removed] = newSequences.splice(draggedIdx, 1);
    newSequences.splice(targetIdx, 0, removed);

    // Update sequence numbers
    newSequences.forEach((seq, idx) => {
      seq.sequence = idx + 1;
    });

    setSequences(newSequences);
    setDraggedItem(null);
  };

  const optimizeSequence = () => {
    const newSequences = [...sequences].sort((a, b) => {
      // Priority sorting (urgent > high > medium > low)
      const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      // Due date sorting
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });

    newSequences.forEach((seq, idx) => {
      seq.sequence = idx + 1;
    });

    setSequences(newSequences);
    setSequenceMode('auto');
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      ready: { color: 'bg-green-100 text-green-800', icon: CheckCircle2, label: 'Ready' },
      queued: { color: 'bg-blue-100 text-blue-800', icon: Clock, label: 'Queued' },
      blocked: { color: 'bg-red-100 text-red-800', icon: AlertCircle, label: 'Blocked' }
    };
    return badges[status as keyof typeof badges] || badges.queued;
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      urgent: 'bg-red-500',
      high: 'bg-orange-500',
      medium: 'bg-blue-500',
      low: 'bg-gray-400'
    };
    return colors[priority as keyof typeof colors] || 'bg-gray-400';
  };

  // Summary stats
  const totalItems = sequences.length;
  const readyItems = sequences.filter(s => s.status === 'ready').length;
  const blockedItems = sequences.filter(s => s.status === 'blocked').length;
  const totalSetupTime = sequences.reduce((sum, s) => sum + s.setupTime, 0);

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
      {/* Inline Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back</span>
          </button>
          <div className="h-6 w-px bg-gray-300" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Production Sequencing</h1>
            <p className="text-sm text-gray-600">Optimize work order execution sequence</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={optimizeSequence}
            className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
          >
            <Zap className="h-4 w-4" />
            Auto-Optimize
          </button>
          <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            <Save className="h-4 w-4" />
            Save Sequence
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-blue-900">Total Items</span>
            <Package className="h-5 w-5 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-blue-900">{totalItems}</div>
          <div className="text-xs text-blue-700 mt-1">In sequence</div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-green-900">Ready to Start</span>
            <CheckCircle2 className="h-5 w-5 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-green-900">{readyItems}</div>
          <div className="text-xs text-green-700 mt-1">No blockers</div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-red-900">Blocked</span>
            <AlertCircle className="h-5 w-5 text-red-600" />
          </div>
          <div className="text-2xl font-bold text-red-900">{blockedItems}</div>
          <div className="text-xs text-red-700 mt-1">Need resolution</div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-purple-900">Total Setup Time</span>
            <Clock className="h-5 w-5 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-purple-900">{totalSetupTime.toFixed(1)}h</div>
          <div className="text-xs text-purple-700 mt-1">Estimated</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
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
            value={filterStation}
            onChange={(e) => setFilterStation(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {stations.map(station => (
              <option key={station} value={station}>
                {station === 'all' ? 'All Stations' : station}
              </option>
            ))}
          </select>
          <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg">
            <span className="text-sm text-gray-700">Mode:</span>
            <span className="text-sm font-medium text-gray-900">
              {sequenceMode === 'manual' ? 'Manual' : 'Auto-Optimized'}
            </span>
          </div>
        </div>
      </div>

      {/* Sequence List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Seq
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Work Order
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Station
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Due Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Duration
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Setup Time
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Suggested
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSequences.map((seq) => {
                const statusInfo = getStatusBadge(seq.status);
                const StatusIcon = statusInfo.icon;
                const isOptimal = seq.sequence === seq.suggestedSequence;

                return (
                  <tr
                    key={seq.id}
                    draggable
                    onDragStart={() => handleDragStart(seq.id)}
                    onDragOver={handleDragOver}
                    onDrop={() => handleDrop(seq.id)}
                    className={`hover:bg-gray-50 cursor-move ${draggedItem === seq.id ? 'opacity-50' : ''}`}
                  >
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <GripVertical className="h-4 w-4 text-gray-400" />
                        <span className="text-lg font-bold text-gray-900">{seq.sequence}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm font-medium text-gray-900">{seq.workOrderNumber}</div>
                    </td>
                    <td className="px-4 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{seq.productName}</div>
                        <div className="text-xs text-gray-500">{seq.quantity} {seq.unit}</div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm text-gray-900">{seq.station}</div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${getPriorityColor(seq.priority)}`}></div>
                        <span className="text-sm capitalize text-gray-900">{seq.priority}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1 text-sm text-gray-900">
                        <Calendar className="h-3 w-3" />
                        {seq.dueDate}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm text-gray-900">{seq.estimatedDuration} days</div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm text-gray-900">{seq.setupTime}h</div>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}>
                        <StatusIcon className="h-3 w-3" />
                        {statusInfo.label}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-900">#{seq.suggestedSequence}</span>
                        {isOptimal ? (
                          <CheckCircle2 className="h-4 w-4 text-green-600" title="Optimal position" />
                        ) : (
                          <TrendingUp className="h-4 w-4 text-orange-600" title="Could be optimized" />
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Help Text */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <ArrowUpDown className="h-5 w-5 text-blue-600 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-sm font-medium text-blue-900 mb-1">Drag & Drop to Reorder</h3>
            <p className="text-sm text-blue-700">
              Drag work orders to manually adjust the production sequence, or click "Auto-Optimize" to automatically sequence based on priority, due dates, and setup times.
            </p>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-4 text-sm text-gray-600">
        Showing {filteredSequences.length} of {totalItems} work orders • Green checkmark indicates optimal sequence position
      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import {
  ClipboardList,
  Calendar,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  Package,
  Search,
  Filter,
  Download,
  Plus,
  RefreshCw,
  BarChart3,
  Play
} from 'lucide-react';
import {
  CreateScheduleModal,
  StartSessionModal,
  PerformCountModal,
  ViewSessionDetailsModal,
  VarianceAnalysisModal,
  CycleCountSchedule,
  CycleCountSession,
  CycleCountVarianceAnalysis,
  CycleCountItem
} from '@/components/inventory/InventoryCycleCountModals';

interface CycleCount {
  id: number;
  countNumber: string;
  warehouse: string;
  zone: string;
  countType: 'ABC' | 'Random' | 'Full' | 'Spot';
  scheduledDate: string;
  assignedTo: string;
  itemsToCount: number;
  itemsCounted: number;
  variancesFound: number;
  status: 'scheduled' | 'in-progress' | 'completed' | 'reconciled';
  accuracy: number;
}

export default function CycleCountPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedType, setSelectedType] = useState('all');

  // Modal states
  const [isCreateScheduleModalOpen, setIsCreateScheduleModalOpen] = useState(false);
  const [isStartSessionModalOpen, setIsStartSessionModalOpen] = useState(false);
  const [isPerformCountModalOpen, setIsPerformCountModalOpen] = useState(false);
  const [isViewDetailsModalOpen, setIsViewDetailsModalOpen] = useState(false);
  const [isVarianceAnalysisModalOpen, setIsVarianceAnalysisModalOpen] = useState(false);

  // Selected data
  const [selectedSession, setSelectedSession] = useState<CycleCountSession | null>(null);
  const [selectedVarianceAnalysis, setSelectedVarianceAnalysis] = useState<CycleCountVarianceAnalysis | null>(null);

  const [cycleCounts, setCycleCounts] = useState<CycleCount[]>([
    {
      id: 1,
      countNumber: 'CC-2025-001',
      warehouse: 'Main Warehouse',
      zone: 'Zone A - Raw Materials',
      countType: 'ABC',
      scheduledDate: '2025-01-22',
      assignedTo: 'John Smith',
      itemsToCount: 145,
      itemsCounted: 145,
      variancesFound: 8,
      status: 'completed',
      accuracy: 94.5
    },
    {
      id: 2,
      countNumber: 'CC-2025-002',
      warehouse: 'Main Warehouse',
      zone: 'Zone B - Components',
      countType: 'Random',
      scheduledDate: '2025-01-21',
      assignedTo: 'Sarah Johnson',
      itemsToCount: 50,
      itemsCounted: 38,
      variancesFound: 3,
      status: 'in-progress',
      accuracy: 92.1
    },
    {
      id: 3,
      countNumber: 'CC-2025-003',
      warehouse: 'FG Store',
      zone: 'Zone A - Finished Goods',
      countType: 'Full',
      scheduledDate: '2025-01-23',
      assignedTo: 'Mike Davis',
      itemsToCount: 230,
      itemsCounted: 0,
      variancesFound: 0,
      status: 'scheduled',
      accuracy: 0
    },
    {
      id: 4,
      countNumber: 'CC-2025-004',
      warehouse: 'Assembly Plant',
      zone: 'Zone C - High Value Items',
      countType: 'ABC',
      scheduledDate: '2025-01-20',
      assignedTo: 'Emily Chen',
      itemsToCount: 89,
      itemsCounted: 89,
      variancesFound: 12,
      status: 'reconciled',
      accuracy: 86.5
    },
    {
      id: 5,
      countNumber: 'CC-2025-005',
      warehouse: 'Main Warehouse',
      zone: 'Zone D - Consumables',
      countType: 'Spot',
      scheduledDate: '2025-01-21',
      assignedTo: 'Robert Lee',
      itemsToCount: 25,
      itemsCounted: 25,
      variancesFound: 2,
      status: 'completed',
      accuracy: 92.0
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'in-progress':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'completed':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'reconciled':
        return 'text-purple-600 bg-purple-50 border-purple-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <Calendar className="w-4 h-4" />;
      case 'in-progress':
        return <Clock className="w-4 h-4" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'reconciled':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'ABC':
        return 'bg-purple-100 text-purple-800';
      case 'Random':
        return 'bg-blue-100 text-blue-800';
      case 'Full':
        return 'bg-orange-100 text-orange-800';
      case 'Spot':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const scheduledCount = cycleCounts.filter(c => c.status === 'scheduled').length;
  const inProgressCount = cycleCounts.filter(c => c.status === 'in-progress').length;
  const completedCount = cycleCounts.filter(c => c.status === 'completed').length;
  const totalVariances = cycleCounts.reduce((sum, c) => sum + c.variancesFound, 0);
  const avgAccuracy = cycleCounts.filter(c => c.accuracy > 0).reduce((sum, c) => sum + c.accuracy, 0) / 
                       cycleCounts.filter(c => c.accuracy > 0).length;

  const filteredCounts = cycleCounts.filter(count => {
    const matchesSearch = count.countNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         count.warehouse.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         count.zone.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || count.status === selectedStatus;
    const matchesType = selectedType === 'all' || count.countType === selectedType;

    return matchesSearch && matchesStatus && matchesType;
  });

  // Helper function to convert CycleCount to CycleCountSession
  const convertToSession = (count: CycleCount): CycleCountSession => {
    // Generate mock items for the session
    const mockItems: CycleCountItem[] = Array.from({ length: count.itemsToCount }, (_, index) => ({
      itemId: `item-${count.id}-${index + 1}`,
      itemCode: `ITM-${String(index + 1).padStart(4, '0')}`,
      itemName: `Item ${index + 1}`,
      location: count.warehouse,
      zone: count.zone,
      bin: `BIN-${String(index + 1).padStart(3, '0')}`,
      expectedQuantity: Math.floor(Math.random() * 100) + 10,
      countedQuantity: index < count.itemsCounted ? Math.floor(Math.random() * 100) + 10 : 0,
      variance: 0,
      variancePercentage: 0,
      status: index < count.itemsCounted ? 'counted' : 'pending',
      countedBy: index < count.itemsCounted ? count.assignedTo : undefined,
      countedDate: index < count.itemsCounted ? count.scheduledDate : undefined,
      notes: ''
    }));

    // Calculate variance for counted items
    mockItems.forEach(item => {
      if (item.countedQuantity > 0) {
        item.variance = item.countedQuantity - item.expectedQuantity;
        item.variancePercentage = item.expectedQuantity > 0
          ? (item.variance / item.expectedQuantity) * 100
          : 0;
        if (Math.abs(item.variancePercentage) > 5) {
          item.status = 'discrepancy';
        }
      }
    });

    const sessionStatus: 'draft' | 'in-progress' | 'completed' | 'verified' =
      count.status === 'scheduled' ? 'draft' :
      count.status === 'in-progress' ? 'in-progress' :
      count.status === 'completed' ? 'completed' :
      'verified';

    return {
      sessionId: count.countNumber,
      sessionName: `${count.zone} - ${count.countType} Count`,
      warehouse: count.warehouse,
      zones: [count.zone],
      countDate: count.scheduledDate,
      assignedTo: count.assignedTo,
      items: mockItems,
      status: sessionStatus,
      progress: count.itemsToCount > 0 ? Math.round((count.itemsCounted / count.itemsToCount) * 100) : 0,
      totalItems: count.itemsToCount,
      countedItems: count.itemsCounted,
      discrepancies: count.variancesFound,
      notes: `${count.countType} type cycle count for ${count.zone}`
    };
  };

  // Helper function to generate variance analysis
  const generateVarianceAnalysis = (session: CycleCountSession): CycleCountVarianceAnalysis => {
    const itemsWithVariance = session.items.filter(item => item.variance !== 0);
    const highVarianceItems = session.items
      .filter(item => Math.abs(item.variancePercentage) > 5)
      .sort((a, b) => Math.abs(b.variancePercentage) - Math.abs(a.variancePercentage))
      .slice(0, 10);

    const totalVariance = session.items.reduce((sum, item) => sum + Math.abs(item.variance), 0);
    const totalExpected = session.items.reduce((sum, item) => sum + item.expectedQuantity, 0);
    const variancePercentage = totalExpected > 0 ? (totalVariance / totalExpected) * 100 : 0;

    // Group by category (mock categories)
    const categories = ['Raw Materials', 'Components', 'Finished Goods', 'Consumables'];
    const varianceByCategory = categories.map(category => {
      const categoryItems = session.items.slice(0, Math.floor(session.items.length / categories.length));
      return {
        category,
        variance: categoryItems.reduce((sum, item) => sum + item.variance, 0),
        count: categoryItems.filter(item => item.variance !== 0).length
      };
    });

    // Group by zone
    const varianceByZone = session.zones.map(zone => ({
      zone,
      variance: session.items
        .filter(item => item.zone === zone)
        .reduce((sum, item) => sum + item.variance, 0),
      count: session.items
        .filter(item => item.zone === zone && item.variance !== 0).length
    }));

    return {
      sessionId: session.sessionId,
      totalVariance,
      variancePercentage,
      itemsWithVariance: itemsWithVariance.length,
      highVarianceItems,
      varianceByCategory,
      varianceByZone,
      recommendedActions: [
        'Review high variance items with physical verification team',
        'Investigate potential systematic counting errors in affected zones',
        'Update inventory records after verification',
        'Schedule recount for items with variance > 10%',
        'Review storage and handling procedures for affected categories'
      ]
    };
  };

  // Modal handlers
  const handleCreateSchedule = (data: CycleCountSchedule) => {
    // TODO: API call to create schedule
    console.log('Creating schedule:', data);
    setIsCreateScheduleModalOpen(false);
    // Refresh data after creation
  };

  const handleStartSession = (data: CycleCountSession) => {
    // TODO: API call to start session
    console.log('Starting session:', data);

    // Add new count to the list
    const newCount: CycleCount = {
      id: cycleCounts.length + 1,
      countNumber: data.sessionId,
      warehouse: data.warehouse,
      zone: data.zones[0] || 'Unknown Zone',
      countType: 'ABC', // Default, should be from form
      scheduledDate: data.countDate,
      assignedTo: data.assignedTo,
      itemsToCount: data.totalItems,
      itemsCounted: data.countedItems,
      variancesFound: data.discrepancies,
      status: 'in-progress',
      accuracy: 0
    };

    setCycleCounts([...cycleCounts, newCount]);
    setIsStartSessionModalOpen(false);
  };

  const handleUpdateCount = (itemId: string, countedQuantity: number, notes?: string) => {
    // TODO: API call to update item count
    console.log('Updating count:', { itemId, countedQuantity, notes });

    if (selectedSession) {
      const updatedItems = selectedSession.items.map(item => {
        if (item.itemId === itemId) {
          const variance = countedQuantity - item.expectedQuantity;
          const variancePercentage = item.expectedQuantity > 0
            ? (variance / item.expectedQuantity) * 100
            : 0;

          return {
            ...item,
            countedQuantity,
            variance,
            variancePercentage,
            status: (Math.abs(variancePercentage) > 5 ? 'discrepancy' : 'counted') as 'pending' | 'counted' | 'verified' | 'discrepancy',
            notes: notes || item.notes,
            countedBy: selectedSession.assignedTo,
            countedDate: new Date().toISOString().split('T')[0]
          };
        }
        return item;
      });

      const countedItems = updatedItems.filter(item => item.countedQuantity > 0).length;
      const discrepancies = updatedItems.filter(item => item.status === 'discrepancy').length;
      const progress = Math.round((countedItems / updatedItems.length) * 100);

      const updatedSession: CycleCountSession = {
        ...selectedSession,
        items: updatedItems,
        countedItems,
        discrepancies,
        progress
      };

      setSelectedSession(updatedSession);

      // Update the main cycleCounts array
      setCycleCounts(cycleCounts.map(count =>
        count.countNumber === selectedSession.sessionId
          ? { ...count, itemsCounted: countedItems, variancesFound: discrepancies }
          : count
      ));
    }
  };

  const handleViewDetails = (count: CycleCount) => {
    const session = convertToSession(count);
    setSelectedSession(session);
    setIsViewDetailsModalOpen(true);
  };

  const handleCompleteSession = () => {
    // TODO: API call to complete session
    if (selectedSession) {
      console.log('Completing session:', selectedSession.sessionId);

      // Update the status in cycleCounts
      setCycleCounts(cycleCounts.map(count =>
        count.countNumber === selectedSession.sessionId
          ? { ...count, status: 'completed' }
          : count
      ));

      // Update selected session status
      setSelectedSession({
        ...selectedSession,
        status: 'completed'
      });
    }
  };

  const handleViewVarianceAnalysis = () => {
    if (selectedSession) {
      const analysis = generateVarianceAnalysis(selectedSession);
      setSelectedVarianceAnalysis(analysis);
      setIsVarianceAnalysisModalOpen(true);
    }
  };

  const handleVarianceClick = (count: CycleCount) => {
    if (count.variancesFound > 0) {
      const session = convertToSession(count);
      const analysis = generateVarianceAnalysis(session);
      setSelectedVarianceAnalysis(analysis);
      setIsVarianceAnalysisModalOpen(true);
    }
  };

  const handlePerformCount = (count: CycleCount) => {
    const session = convertToSession(count);
    setSelectedSession(session);
    setIsPerformCountModalOpen(true);
  };

  // Check if there's an in-progress session
  const inProgressSession = cycleCounts.find(c => c.status === 'in-progress');

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
            <ClipboardList className="w-8 h-8 text-blue-600" />
            <span>Cycle Count Dashboard</span>
          </h1>
          <p className="text-gray-600 mt-1">Manage and track inventory cycle counting activities</p>
        </div>
        <div className="flex items-center space-x-3">
          {inProgressSession && (
            <button
              onClick={() => handlePerformCount(inProgressSession)}
              className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 flex items-center space-x-2"
            >
              <ClipboardList className="w-4 h-4" />
              <span>Perform Count</span>
            </button>
          )}
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2">
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
          <button
            onClick={() => setIsStartSessionModalOpen(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center space-x-2"
          >
            <Play className="w-4 h-4" />
            <span>Start Session</span>
          </button>
          <button
            onClick={() => setIsCreateScheduleModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule Count</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <Calendar className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-bold text-blue-900">{scheduledCount}</span>
          </div>
          <div className="text-sm font-medium text-blue-700">Scheduled</div>
          <div className="text-xs text-blue-600 mt-1">Upcoming Counts</div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-6 border border-yellow-200">
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-8 h-8 text-yellow-600" />
            <span className="text-2xl font-bold text-yellow-900">{inProgressCount}</span>
          </div>
          <div className="text-sm font-medium text-yellow-700">In Progress</div>
          <div className="text-xs text-yellow-600 mt-1">Active Counts</div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <span className="text-2xl font-bold text-green-900">{completedCount}</span>
          </div>
          <div className="text-sm font-medium text-green-700">Completed</div>
          <div className="text-xs text-green-600 mt-1">This Month</div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-6 border border-red-200">
          <div className="flex items-center justify-between mb-2">
            <AlertTriangle className="w-8 h-8 text-red-600" />
            <span className="text-2xl font-bold text-red-900">{totalVariances}</span>
          </div>
          <div className="text-sm font-medium text-red-700">Total Variances</div>
          <div className="text-xs text-red-600 mt-1">Needs Review</div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 border border-purple-200">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-8 h-8 text-purple-600" />
            <span className="text-2xl font-bold text-purple-900">{avgAccuracy.toFixed(1)}%</span>
          </div>
          <div className="text-sm font-medium text-purple-700">Avg Accuracy</div>
          <div className="text-xs text-purple-600 mt-1">Overall Performance</div>
        </div>
      </div>

      {/* Count Type Distribution */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Count Type Distribution</h3>
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="text-2xl font-bold text-purple-900">
              {cycleCounts.filter(c => c.countType === 'ABC').length}
            </div>
            <div className="text-sm text-purple-700 font-medium mt-1">ABC Analysis</div>
            <div className="text-xs text-purple-600 mt-1">High-value items</div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-900">
              {cycleCounts.filter(c => c.countType === 'Random').length}
            </div>
            <div className="text-sm text-blue-700 font-medium mt-1">Random Sample</div>
            <div className="text-xs text-blue-600 mt-1">Statistical sampling</div>
          </div>
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="text-2xl font-bold text-orange-900">
              {cycleCounts.filter(c => c.countType === 'Full').length}
            </div>
            <div className="text-sm text-orange-700 font-medium mt-1">Full Count</div>
            <div className="text-xs text-orange-600 mt-1">Complete inventory</div>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-900">
              {cycleCounts.filter(c => c.countType === 'Spot').length}
            </div>
            <div className="text-sm text-green-700 font-medium mt-1">Spot Check</div>
            <div className="text-xs text-green-600 mt-1">Ad-hoc verification</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search counts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="scheduled">Scheduled</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="reconciled">Reconciled</option>
          </select>

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Types</option>
            <option value="ABC">ABC Analysis</option>
            <option value="Random">Random Sample</option>
            <option value="Full">Full Count</option>
            <option value="Spot">Spot Check</option>
          </select>
        </div>
      </div>

      {/* Cycle Counts Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Count #</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Warehouse / Zone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Scheduled Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned To</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Variances</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Accuracy</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCounts.map((count) => (
                <tr
                  key={count.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleViewDetails(count)}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {count.countNumber}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <div className="font-medium">{count.warehouse}</div>
                    <div className="text-xs text-gray-500">{count.zone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(count.countType)}`}>
                      {count.countType}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {count.scheduledDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span>{count.assignedTo}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${(count.itemsCounted / count.itemsToCount) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-600">
                        {count.itemsCounted}/{count.itemsToCount}
                      </span>
                    </div>
                  </td>
                  <td
                    className="px-6 py-4 whitespace-nowrap"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleVarianceClick(count);
                    }}
                  >
                    {count.variancesFound > 0 ? (
                      <span className="text-sm font-semibold text-red-600 hover:text-red-800 cursor-pointer underline">
                        {count.variancesFound}
                      </span>
                    ) : (
                      <span className="text-sm text-gray-500">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {count.accuracy > 0 ? (
                      <span className={`text-sm font-semibold ${count.accuracy >= 95 ? 'text-green-600' : count.accuracy >= 90 ? 'text-yellow-600' : 'text-red-600'}`}>
                        {count.accuracy.toFixed(1)}%
                      </span>
                    ) : (
                      <span className="text-sm text-gray-500">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center space-x-1 w-fit ${getStatusColor(count.status)}`}>
                      {getStatusIcon(count.status)}
                      <span className="capitalize">{count.status.replace('-', ' ')}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewDetails(count);
                      }}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredCounts.length === 0 && (
          <div className="text-center py-12">
            <ClipboardList className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No cycle counts found matching your filters</p>
          </div>
        )}
      </div>

      {/* Modals */}
      <CreateScheduleModal
        isOpen={isCreateScheduleModalOpen}
        onClose={() => setIsCreateScheduleModalOpen(false)}
        onSubmit={handleCreateSchedule}
      />

      <StartSessionModal
        isOpen={isStartSessionModalOpen}
        onClose={() => setIsStartSessionModalOpen(false)}
        onSubmit={handleStartSession}
      />

      <PerformCountModal
        isOpen={isPerformCountModalOpen}
        onClose={() => setIsPerformCountModalOpen(false)}
        session={selectedSession}
        onUpdateCount={handleUpdateCount}
      />

      <ViewSessionDetailsModal
        isOpen={isViewDetailsModalOpen}
        onClose={() => setIsViewDetailsModalOpen(false)}
        session={selectedSession}
        onComplete={handleCompleteSession}
        onViewVariance={handleViewVarianceAnalysis}
      />

      <VarianceAnalysisModal
        isOpen={isVarianceAnalysisModalOpen}
        onClose={() => setIsVarianceAnalysisModalOpen(false)}
        analysis={selectedVarianceAnalysis}
      />
    </div>
  );
}

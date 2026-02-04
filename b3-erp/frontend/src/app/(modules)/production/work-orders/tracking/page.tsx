'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Search,
  MapPin,
  Package,
  Clock,
  CheckCircle2,
  TrendingUp,
  AlertCircle,
  Calendar,
  User,
  Activity,
  Eye,
  RefreshCw
} from 'lucide-react';

interface WorkOrderTracking {
  id: string;
  workOrderNumber: string;
  productCode: string;
  productName: string;
  quantity: number;
  unit: string;
  salesOrderNumber: string;
  customerName: string;
  currentStatus: 'pending' | 'in-progress' | 'quality-check' | 'packaging' | 'completed';
  currentStation: string;
  completionPercentage: number;
  startDate: string;
  dueDate: string;
  estimatedCompletion: string;
  assignedTeam: string;
  timeline: TrackingEvent[];
  lastUpdate: string;
  priority: 'urgent' | 'high' | 'medium' | 'low';
}

interface TrackingEvent {
  id: string;
  station: string;
  status: 'completed' | 'in-progress' | 'pending';
  startTime: string;
  endTime: string;
  duration: number;
  operator: string;
  notes: string;
  issues: string[];
}

export default function WorkOrderTrackingPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<WorkOrderTracking | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const trackingOrders: WorkOrderTracking[] = [
    {
      id: '1',
      workOrderNumber: 'WO-2025-1142',
      productCode: 'KIT-SINK-001',
      productName: 'Premium SS304 Kitchen Sink - Double Bowl',
      quantity: 25,
      unit: 'PC',
      salesOrderNumber: 'SO-2025-0856',
      customerName: 'Metro Builders Pvt Ltd',
      currentStatus: 'in-progress',
      currentStation: 'Polishing & Finishing',
      completionPercentage: 68,
      startDate: '2025-10-12',
      dueDate: '2025-10-24',
      estimatedCompletion: '2025-10-23',
      assignedTeam: 'Team A - Sinks',
      lastUpdate: '2025-10-20 14:30',
      priority: 'high',
      timeline: [
        {
          id: '1',
          station: 'Material Preparation',
          status: 'completed',
          startTime: '2025-10-12 08:00',
          endTime: '2025-10-12 16:00',
          duration: 8,
          operator: 'Ramesh P.',
          notes: 'SS304 sheets cut to size',
          issues: []
        },
        {
          id: '2',
          station: 'Bowl Forming',
          status: 'completed',
          startTime: '2025-10-13 08:00',
          endTime: '2025-10-14 17:00',
          duration: 33,
          operator: 'Sunil K.',
          notes: 'Deep drawing process completed for all 25 bowls',
          issues: []
        },
        {
          id: '3',
          station: 'Welding Assembly',
          status: 'completed',
          startTime: '2025-10-15 08:00',
          endTime: '2025-10-17 16:30',
          duration: 56.5,
          operator: 'Rajesh Kumar',
          notes: 'Double bowl assembly welded',
          issues: ['Minor rework on 2 units - welding quality']
        },
        {
          id: '4',
          station: 'Polishing & Finishing',
          status: 'in-progress',
          startTime: '2025-10-18 08:00',
          endTime: '',
          duration: 0,
          operator: 'Prakash M.',
          notes: 'Mirror finish polishing in progress - 17 of 25 completed',
          issues: []
        },
        {
          id: '5',
          station: 'Quality Inspection',
          status: 'pending',
          startTime: '',
          endTime: '',
          duration: 0,
          operator: '',
          notes: '',
          issues: []
        },
        {
          id: '6',
          station: 'Packaging',
          status: 'pending',
          startTime: '',
          endTime: '',
          duration: 0,
          operator: '',
          notes: '',
          issues: []
        }
      ]
    },
    {
      id: '2',
      workOrderNumber: 'WO-2025-1143',
      productCode: 'KIT-APPL-001',
      productName: 'Auto-Clean Kitchen Chimney - 90cm',
      quantity: 15,
      unit: 'PC',
      salesOrderNumber: 'SO-2025-0862',
      customerName: 'Luxury Homes Ltd',
      currentStatus: 'in-progress',
      currentStation: 'Motor Assembly',
      completionPercentage: 62,
      startDate: '2025-10-10',
      dueDate: '2025-10-23',
      estimatedCompletion: '2025-10-24',
      assignedTeam: 'Team C - Appliances',
      lastUpdate: '2025-10-20 11:15',
      priority: 'urgent',
      timeline: [
        {
          id: '1',
          station: 'Body Fabrication',
          status: 'completed',
          startTime: '2025-10-10 08:00',
          endTime: '2025-10-12 17:00',
          duration: 57,
          operator: 'Amit Patel',
          notes: 'SS chimney bodies formed and welded',
          issues: []
        },
        {
          id: '2',
          station: 'Filter Installation',
          status: 'completed',
          startTime: '2025-10-13 08:00',
          endTime: '2025-10-14 15:30',
          duration: 31.5,
          operator: 'Priya Sharma',
          notes: 'Auto-clean baffle filters installed',
          issues: []
        },
        {
          id: '3',
          station: 'Motor Assembly',
          status: 'in-progress',
          startTime: '2025-10-15 08:00',
          endTime: '',
          duration: 0,
          operator: 'Vikram Singh',
          notes: 'High-efficiency motors being installed - 9 of 15 done',
          issues: ['Motor supplier delay affecting 3 units']
        },
        {
          id: '4',
          station: 'Electrical Wiring',
          status: 'pending',
          startTime: '',
          endTime: '',
          duration: 0,
          operator: '',
          notes: '',
          issues: []
        },
        {
          id: '5',
          station: 'Testing & QC',
          status: 'pending',
          startTime: '',
          endTime: '',
          duration: 0,
          operator: '',
          notes: '',
          issues: []
        },
        {
          id: '6',
          station: 'Packaging',
          status: 'pending',
          startTime: '',
          endTime: '',
          duration: 0,
          operator: '',
          notes: '',
          issues: []
        }
      ]
    },
    {
      id: '3',
      workOrderNumber: 'WO-2025-1145',
      productCode: 'KIT-FAUC-001',
      productName: 'Chrome Finish Kitchen Faucet - Single Lever',
      quantity: 60,
      unit: 'PC',
      salesOrderNumber: 'SO-2025-0864',
      customerName: 'Home Essentials Store',
      currentStatus: 'pending',
      currentStation: 'Awaiting Start',
      completionPercentage: 0,
      startDate: '2025-10-21',
      dueDate: '2025-11-05',
      estimatedCompletion: '2025-11-04',
      assignedTeam: 'Team D - Faucets',
      lastUpdate: '2025-10-19 16:00',
      priority: 'medium',
      timeline: [
        {
          id: '1',
          station: 'Body Machining',
          status: 'pending',
          startTime: '',
          endTime: '',
          duration: 0,
          operator: '',
          notes: '',
          issues: []
        },
        {
          id: '2',
          station: 'Cartridge Assembly',
          status: 'pending',
          startTime: '',
          endTime: '',
          duration: 0,
          operator: '',
          notes: '',
          issues: []
        },
        {
          id: '3',
          station: 'Chrome Plating',
          status: 'pending',
          startTime: '',
          endTime: '',
          duration: 0,
          operator: '',
          notes: '',
          issues: []
        },
        {
          id: '4',
          station: 'Final Assembly',
          status: 'pending',
          startTime: '',
          endTime: '',
          duration: 0,
          operator: '',
          notes: '',
          issues: []
        },
        {
          id: '5',
          station: 'Leak Testing',
          status: 'pending',
          startTime: '',
          endTime: '',
          duration: 0,
          operator: '',
          notes: '',
          issues: []
        },
        {
          id: '6',
          station: 'Packaging',
          status: 'pending',
          startTime: '',
          endTime: '',
          duration: 0,
          operator: '',
          notes: '',
          issues: []
        }
      ]
    },
    {
      id: '4',
      workOrderNumber: 'WO-2025-1135',
      productCode: 'KIT-CAB-001',
      productName: 'Modular Base Cabinet - 3 Drawer',
      quantity: 50,
      unit: 'PC',
      salesOrderNumber: 'SO-2025-0842',
      customerName: 'Grand Towers Ltd',
      currentStatus: 'quality-check',
      currentStation: 'Quality Inspection',
      completionPercentage: 92,
      startDate: '2025-10-08',
      dueDate: '2025-10-28',
      estimatedCompletion: '2025-10-22',
      assignedTeam: 'Team B - Cabinets',
      lastUpdate: '2025-10-20 09:45',
      priority: 'high',
      timeline: [
        {
          id: '1',
          station: 'Panel Cutting',
          status: 'completed',
          startTime: '2025-10-08 08:00',
          endTime: '2025-10-10 17:00',
          duration: 57,
          operator: 'Arun Kumar',
          notes: 'CNC cutting of plywood panels',
          issues: []
        },
        {
          id: '2',
          station: 'Edge Banding',
          status: 'completed',
          startTime: '2025-10-11 08:00',
          endTime: '2025-10-12 16:30',
          duration: 32.5,
          operator: 'Neha Gupta',
          notes: 'PVC edge banding applied',
          issues: []
        },
        {
          id: '3',
          station: 'Drawer Assembly',
          status: 'completed',
          startTime: '2025-10-13 08:00',
          endTime: '2025-10-16 17:30',
          duration: 81.5,
          operator: 'Suresh Reddy',
          notes: 'Soft-close drawer mechanisms installed',
          issues: []
        },
        {
          id: '4',
          station: 'Cabinet Assembly',
          status: 'completed',
          startTime: '2025-10-17 08:00',
          endTime: '2025-10-19 16:00',
          duration: 56,
          operator: 'Meera Iyer',
          notes: 'Final cabinet assembly completed',
          issues: []
        },
        {
          id: '5',
          station: 'Quality Inspection',
          status: 'in-progress',
          startTime: '2025-10-20 08:00',
          endTime: '',
          duration: 0,
          operator: 'QC Team',
          notes: 'Dimensional checks and finish inspection - 46 of 50 passed',
          issues: []
        },
        {
          id: '6',
          station: 'Packaging',
          status: 'pending',
          startTime: '',
          endTime: '',
          duration: 0,
          operator: '',
          notes: '',
          issues: []
        }
      ]
    }
  ];

  const filteredOrders = trackingOrders.filter(order =>
    order.workOrderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: { color: 'bg-gray-100 text-gray-800', icon: Clock, label: 'Pending' },
      'in-progress': { color: 'bg-blue-100 text-blue-800', icon: Activity, label: 'In Progress' },
      'quality-check': { color: 'bg-purple-100 text-purple-800', icon: CheckCircle2, label: 'Quality Check' },
      packaging: { color: 'bg-orange-100 text-orange-800', icon: Package, label: 'Packaging' },
      completed: { color: 'bg-green-100 text-green-800', icon: CheckCircle2, label: 'Completed' }
    };
    return badges[status as keyof typeof badges] || badges.pending;
  };

  const getEventStatus = (status: string) => {
    if (status === 'completed') return 'bg-green-500';
    if (status === 'in-progress') return 'bg-blue-500 animate-pulse';
    return 'bg-gray-300';
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    console.log('Refreshing tracking data...');

    // Simulate data refresh
    setTimeout(() => {
      setIsRefreshing(false);
      alert('Tracking data refreshed successfully!\n\nAll work order statuses and timelines have been updated with the latest information from the production floor.');
    }, 1000);
  };

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
            <h1 className="text-2xl font-bold text-gray-900">Work Order Tracking</h1>
            <p className="text-sm text-gray-600">Real-time production status and progress tracking</p>
          </div>
        </div>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by work order, product, or customer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Work Orders List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredOrders.map((order) => {
          const statusInfo = getStatusBadge(order.currentStatus);
          const StatusIcon = statusInfo.icon;
          const isSelected = selectedOrder?.id === order.id;

          return (
            <div
              key={order.id}
              className={`bg-white rounded-lg shadow-sm border-2 transition-all cursor-pointer ${
                isSelected ? 'border-blue-500 shadow-md' : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setSelectedOrder(order)}
            >
              <div className="p-5">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{order.workOrderNumber}</h3>
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}>
                        <StatusIcon className="h-3 w-3" />
                        {statusInfo.label}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 flex items-center gap-2">
                      <User className="h-4 w-4" />
                      {order.customerName}
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedOrder(order);
                    }}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    <Eye className="h-5 w-5" />
                  </button>
                </div>

                {/* Product Info */}
                <div className="bg-blue-50 rounded-lg p-3 mb-4">
                  <div className="flex items-start gap-2">
                    <Package className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 text-sm">{order.productName}</div>
                      <div className="text-xs text-gray-600 mt-1">{order.quantity} {order.unit} • {order.productCode}</div>
                    </div>
                  </div>
                </div>

                {/* Progress */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Overall Progress</span>
                    <span className="text-lg font-bold text-blue-900">{order.completionPercentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${order.completionPercentage}%` }}
                    ></div>
                  </div>
                </div>

                {/* Current Station */}
                <div className="bg-purple-50 rounded-lg p-3 mb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <MapPin className="h-4 w-4 text-purple-600" />
                    <span className="text-xs font-medium text-purple-900">Current Station</span>
                  </div>
                  <div className="font-semibold text-gray-900">{order.currentStation}</div>
                </div>

                {/* Timeline Preview */}
                <div className="flex items-center gap-2 mb-4">
                  {order.timeline.slice(0, 6).map((event, idx) => (
                    <div
                      key={event.id}
                      className={`h-2 flex-1 rounded-full ${getEventStatus(event.status)}`}
                      title={event.station}
                    ></div>
                  ))}
                </div>

                {/* Footer Info */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <div className="text-gray-600">Started</div>
                    <div className="font-medium text-gray-900">{order.startDate}</div>
                  </div>
                  <div>
                    <div className="text-gray-600">Due Date</div>
                    <div className="font-medium text-gray-900">{order.dueDate}</div>
                  </div>
                  <div>
                    <div className="text-gray-600">Team</div>
                    <div className="font-medium text-gray-900">{order.assignedTeam}</div>
                  </div>
                  <div>
                    <div className="text-gray-600">Last Update</div>
                    <div className="font-medium text-gray-900">{order.lastUpdate}</div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detailed Timeline Modal/Panel */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl  w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{selectedOrder.workOrderNumber}</h2>
                <p className="text-sm text-gray-600">{selectedOrder.productName}</p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6">
              {/* Timeline */}
              <div className="space-y-6">
                {selectedOrder.timeline.map((event, idx) => (
                  <div key={event.id} className="flex gap-4">
                    {/* Status Indicator */}
                    <div className="flex flex-col items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        event.status === 'completed' ? 'bg-green-500' :
                        event.status === 'in-progress' ? 'bg-blue-500 animate-pulse' :
                        'bg-gray-300'
                      }`}>
                        {event.status === 'completed' ? (
                          <CheckCircle2 className="h-6 w-6 text-white" />
                        ) : event.status === 'in-progress' ? (
                          <Activity className="h-6 w-6 text-white" />
                        ) : (
                          <Clock className="h-6 w-6 text-white" />
                        )}
                      </div>
                      {idx < selectedOrder.timeline.length - 1 && (
                        <div className={`w-1 h-16 ${
                          event.status === 'completed' ? 'bg-green-300' : 'bg-gray-200'
                        }`}></div>
                      )}
                    </div>

                    {/* Event Details */}
                    <div className="flex-1 pb-8">
                      <div className={`rounded-lg border-2 p-4 ${
                        event.status === 'completed' ? 'border-green-200 bg-green-50' :
                        event.status === 'in-progress' ? 'border-blue-200 bg-blue-50' :
                        'border-gray-200 bg-gray-50'
                      }`}>
                        <h3 className="font-semibold text-gray-900 mb-2">{event.station}</h3>

                        {event.status !== 'pending' && (
                          <>
                            <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                              <div>
                                <div className="text-gray-600">Operator</div>
                                <div className="font-medium text-gray-900">{event.operator}</div>
                              </div>
                              <div>
                                <div className="text-gray-600">Duration</div>
                                <div className="font-medium text-gray-900">
                                  {event.status === 'completed' ? `${event.duration} hours` : 'In progress'}
                                </div>
                              </div>
                              {event.startTime && (
                                <div>
                                  <div className="text-gray-600">Start Time</div>
                                  <div className="font-medium text-gray-900">{event.startTime}</div>
                                </div>
                              )}
                              {event.endTime && (
                                <div>
                                  <div className="text-gray-600">End Time</div>
                                  <div className="font-medium text-gray-900">{event.endTime}</div>
                                </div>
                              )}
                            </div>

                            {event.notes && (
                              <div className="text-sm text-gray-700 mb-2">
                                <span className="font-medium">Notes:</span> {event.notes}
                              </div>
                            )}

                            {event.issues.length > 0 && (
                              <div className="bg-red-50 border border-red-200 rounded p-2 mt-2">
                                <div className="flex items-start gap-2">
                                  <AlertCircle className="h-4 w-4 text-red-600 mt-0.5" />
                                  <div className="flex-1">
                                    <div className="text-xs font-medium text-red-900 mb-1">Issues</div>
                                    <ul className="space-y-1">
                                      {event.issues.map((issue, i) => (
                                        <li key={i} className="text-xs text-red-700">• {issue}</li>
                                      ))}
                                    </ul>
                                  </div>
                                </div>
                              </div>
                            )}
                          </>
                        )}

                        {event.status === 'pending' && (
                          <div className="text-sm text-gray-500 italic">Awaiting start</div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer Info */}
      <div className="mt-6 text-sm text-gray-600">
        Showing {filteredOrders.length} work orders • Click on any order for detailed timeline
      </div>
    </div>
  );
}

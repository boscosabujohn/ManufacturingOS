'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Clock,
  Package,
  Truck,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Calendar,
  TrendingUp,
  TrendingDown,
  Filter,
  ChevronDown,
  ChevronUp,
  MapPin,
  ArrowRight,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

// ============================================================================
// Types
// ============================================================================

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'in-transit' | 'delivered' | 'delayed';
export type MilestoneStatus = 'completed' | 'current' | 'upcoming' | 'delayed' | 'skipped';

export interface Milestone {
  id: string;
  name: string;
  expectedDate: string;
  actualDate?: string;
  status: MilestoneStatus;
  location?: string;
  notes?: string;
}

export interface Order {
  id: string;
  poNumber: string;
  vendor: string;
  item: string;
  quantity: number;
  orderDate: string;
  expectedDelivery: string;
  actualDelivery?: string;
  status: OrderStatus;
  leadTimeDays: number;
  actualLeadTimeDays?: number;
  variance: number;
  milestones: Milestone[];
  priority: 'low' | 'medium' | 'high' | 'critical';
}

export interface LeadTimeStats {
  avgLeadTime: number;
  avgVariance: number;
  onTimeRate: number;
  delayedCount: number;
}

export interface LeadTimeTimelineProps {
  onOrderClick?: (order: Order) => void;
  onMilestoneClick?: (order: Order, milestone: Milestone) => void;
}

// ============================================================================
// Mock Data Generator
// ============================================================================

const generateMockOrders = (): Order[] => [
  {
    id: 'order-1',
    poNumber: 'PO-2024-001234',
    vendor: 'Precision Components Ltd',
    item: 'Electronic Control Units',
    quantity: 500,
    orderDate: '2024-11-01',
    expectedDelivery: '2024-12-10',
    status: 'in-transit',
    leadTimeDays: 40,
    variance: 0,
    priority: 'high',
    milestones: [
      { id: 'm1', name: 'Order Placed', expectedDate: '2024-11-01', actualDate: '2024-11-01', status: 'completed', location: 'Internal' },
      { id: 'm2', name: 'Order Confirmed', expectedDate: '2024-11-02', actualDate: '2024-11-02', status: 'completed', location: 'Supplier' },
      { id: 'm3', name: 'Production Started', expectedDate: '2024-11-05', actualDate: '2024-11-06', status: 'completed', location: 'Factory', notes: '1 day delay' },
      { id: 'm4', name: 'Quality Check', expectedDate: '2024-11-25', actualDate: '2024-11-26', status: 'completed', location: 'Factory' },
      { id: 'm5', name: 'Shipped', expectedDate: '2024-11-28', actualDate: '2024-11-28', status: 'completed', location: 'Shanghai Port' },
      { id: 'm6', name: 'In Transit', expectedDate: '2024-12-01', actualDate: '2024-12-01', status: 'current', location: 'Pacific Ocean' },
      { id: 'm7', name: 'Customs Clearance', expectedDate: '2024-12-08', status: 'upcoming', location: 'LA Port' },
      { id: 'm8', name: 'Delivered', expectedDate: '2024-12-10', status: 'upcoming', location: 'Warehouse' },
    ],
  },
  {
    id: 'order-2',
    poNumber: 'PO-2024-001235',
    vendor: 'Eastern Electronics Co',
    item: 'Semiconductor Chips',
    quantity: 10000,
    orderDate: '2024-10-15',
    expectedDelivery: '2024-11-30',
    actualDelivery: '2024-12-05',
    status: 'delayed',
    leadTimeDays: 45,
    actualLeadTimeDays: 50,
    variance: 5,
    priority: 'critical',
    milestones: [
      { id: 'm1', name: 'Order Placed', expectedDate: '2024-10-15', actualDate: '2024-10-15', status: 'completed', location: 'Internal' },
      { id: 'm2', name: 'Order Confirmed', expectedDate: '2024-10-16', actualDate: '2024-10-18', status: 'completed', location: 'Supplier', notes: '2 day delay' },
      { id: 'm3', name: 'Production Started', expectedDate: '2024-10-20', actualDate: '2024-10-22', status: 'completed', location: 'Factory' },
      { id: 'm4', name: 'Quality Check', expectedDate: '2024-11-10', actualDate: '2024-11-15', status: 'completed', location: 'Factory', notes: 'Quality issues found' },
      { id: 'm5', name: 'Shipped', expectedDate: '2024-11-15', actualDate: '2024-11-20', status: 'delayed', location: 'Shanghai Port', notes: 'Port congestion' },
      { id: 'm6', name: 'In Transit', expectedDate: '2024-11-20', actualDate: '2024-11-25', status: 'completed', location: 'Pacific Ocean' },
      { id: 'm7', name: 'Customs Clearance', expectedDate: '2024-11-28', actualDate: '2024-12-03', status: 'completed', location: 'LA Port', notes: 'Customs delay' },
      { id: 'm8', name: 'Delivered', expectedDate: '2024-11-30', actualDate: '2024-12-05', status: 'delayed', location: 'Warehouse' },
    ],
  },
  {
    id: 'order-3',
    poNumber: 'PO-2024-001236',
    vendor: 'Nordic Plastics AB',
    item: 'Injection Molded Parts',
    quantity: 2000,
    orderDate: '2024-11-10',
    expectedDelivery: '2024-12-05',
    actualDelivery: '2024-12-03',
    status: 'delivered',
    leadTimeDays: 25,
    actualLeadTimeDays: 23,
    variance: -2,
    priority: 'medium',
    milestones: [
      { id: 'm1', name: 'Order Placed', expectedDate: '2024-11-10', actualDate: '2024-11-10', status: 'completed', location: 'Internal' },
      { id: 'm2', name: 'Order Confirmed', expectedDate: '2024-11-11', actualDate: '2024-11-11', status: 'completed', location: 'Supplier' },
      { id: 'm3', name: 'Production Started', expectedDate: '2024-11-13', actualDate: '2024-11-12', status: 'completed', location: 'Factory' },
      { id: 'm4', name: 'Quality Check', expectedDate: '2024-11-25', actualDate: '2024-11-24', status: 'completed', location: 'Factory' },
      { id: 'm5', name: 'Shipped', expectedDate: '2024-11-27', actualDate: '2024-11-26', status: 'completed', location: 'Gothenburg' },
      { id: 'm6', name: 'In Transit', expectedDate: '2024-11-30', actualDate: '2024-11-29', status: 'completed', location: 'Atlantic' },
      { id: 'm7', name: 'Customs Clearance', expectedDate: '2024-12-03', actualDate: '2024-12-02', status: 'completed', location: 'NY Port' },
      { id: 'm8', name: 'Delivered', expectedDate: '2024-12-05', actualDate: '2024-12-03', status: 'completed', location: 'Warehouse' },
    ],
  },
  {
    id: 'order-4',
    poNumber: 'PO-2024-001237',
    vendor: 'Pacific Motors',
    item: 'Motor Assemblies',
    quantity: 300,
    orderDate: '2024-11-20',
    expectedDelivery: '2024-12-20',
    status: 'processing',
    leadTimeDays: 30,
    variance: 0,
    priority: 'high',
    milestones: [
      { id: 'm1', name: 'Order Placed', expectedDate: '2024-11-20', actualDate: '2024-11-20', status: 'completed', location: 'Internal' },
      { id: 'm2', name: 'Order Confirmed', expectedDate: '2024-11-21', actualDate: '2024-11-21', status: 'completed', location: 'Supplier' },
      { id: 'm3', name: 'Production Started', expectedDate: '2024-11-25', actualDate: '2024-11-25', status: 'current', location: 'Factory' },
      { id: 'm4', name: 'Quality Check', expectedDate: '2024-12-08', status: 'upcoming', location: 'Factory' },
      { id: 'm5', name: 'Shipped', expectedDate: '2024-12-10', status: 'upcoming', location: 'Tokyo Port' },
      { id: 'm6', name: 'In Transit', expectedDate: '2024-12-13', status: 'upcoming', location: 'Pacific Ocean' },
      { id: 'm7', name: 'Customs Clearance', expectedDate: '2024-12-18', status: 'upcoming', location: 'LA Port' },
      { id: 'm8', name: 'Delivered', expectedDate: '2024-12-20', status: 'upcoming', location: 'Warehouse' },
    ],
  },
  {
    id: 'order-5',
    poNumber: 'PO-2024-001238',
    vendor: 'Global Steel Works',
    item: 'Steel Frames',
    quantity: 150,
    orderDate: '2024-10-25',
    expectedDelivery: '2024-12-01',
    status: 'delayed',
    leadTimeDays: 37,
    variance: 8,
    priority: 'critical',
    milestones: [
      { id: 'm1', name: 'Order Placed', expectedDate: '2024-10-25', actualDate: '2024-10-25', status: 'completed', location: 'Internal' },
      { id: 'm2', name: 'Order Confirmed', expectedDate: '2024-10-26', actualDate: '2024-10-28', status: 'completed', location: 'Supplier', notes: 'Late confirmation' },
      { id: 'm3', name: 'Production Started', expectedDate: '2024-10-30', actualDate: '2024-11-05', status: 'delayed', location: 'Factory', notes: 'Material shortage' },
      { id: 'm4', name: 'Quality Check', expectedDate: '2024-11-15', actualDate: '2024-11-25', status: 'delayed', location: 'Factory', notes: 'Rework required' },
      { id: 'm5', name: 'Shipped', expectedDate: '2024-11-20', status: 'delayed', location: 'Mumbai Port', notes: 'Awaiting shipment' },
      { id: 'm6', name: 'In Transit', expectedDate: '2024-11-25', status: 'upcoming', location: 'Indian Ocean' },
      { id: 'm7', name: 'Customs Clearance', expectedDate: '2024-11-30', status: 'upcoming', location: 'NY Port' },
      { id: 'm8', name: 'Delivered', expectedDate: '2024-12-01', status: 'upcoming', location: 'Warehouse' },
    ],
  },
];

// ============================================================================
// Helper Functions
// ============================================================================

const getStatusColor = (status: OrderStatus) => {
  switch (status) {
    case 'delivered':
      return 'text-green-600';
    case 'in-transit':
    case 'shipped':
      return 'text-blue-600';
    case 'processing':
      return 'text-amber-600';
    case 'delayed':
      return 'text-red-600';
    case 'pending':
      return 'text-gray-500';
  }
};

const getStatusBgColor = (status: OrderStatus) => {
  switch (status) {
    case 'delivered':
      return 'bg-green-100 dark:bg-green-900/30';
    case 'in-transit':
    case 'shipped':
      return 'bg-blue-100 dark:bg-blue-900/30';
    case 'processing':
      return 'bg-amber-100 dark:bg-amber-900/30';
    case 'delayed':
      return 'bg-red-100 dark:bg-red-900/30';
    case 'pending':
      return 'bg-gray-100 dark:bg-gray-700';
  }
};

const getMilestoneColor = (status: MilestoneStatus) => {
  switch (status) {
    case 'completed':
      return 'bg-green-500';
    case 'current':
      return 'bg-blue-500';
    case 'upcoming':
      return 'bg-gray-300 dark:bg-gray-600';
    case 'delayed':
      return 'bg-red-500';
    case 'skipped':
      return 'bg-gray-400';
  }
};

const getPriorityBadge = (priority: Order['priority']) => {
  const styles = {
    low: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
    medium: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    high: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
    critical: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  };
  return styles[priority];
};

// ============================================================================
// Stats Component
// ============================================================================

function LeadTimeStatsBar({ orders }: { orders: Order[] }) {
  const stats = useMemo(() => {
    const delivered = orders.filter(o => o.status === 'delivered' || o.actualLeadTimeDays);
    const avgLeadTime = Math.round(orders.reduce((sum, o) => sum + o.leadTimeDays, 0) / orders.length);
    const avgActualLeadTime = delivered.length > 0
      ? Math.round(delivered.reduce((sum, o) => sum + (o.actualLeadTimeDays || o.leadTimeDays), 0) / delivered.length)
      : avgLeadTime;
    const onTime = orders.filter(o => o.variance <= 0).length;
    const delayed = orders.filter(o => o.status === 'delayed' || o.variance > 0).length;
    const avgVariance = Math.round(orders.reduce((sum, o) => sum + o.variance, 0) / orders.length * 10) / 10;

    return { avgLeadTime, avgActualLeadTime, onTimeRate: Math.round((onTime / orders.length) * 100), delayed, avgVariance };
  }, [orders]);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-2 mb-3">
      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center gap-3">
            <Clock className="w-8 h-8 text-blue-500" />
            <div>
              <p className="text-2xl font-bold">{stats.avgLeadTime}</p>
              <p className="text-xs text-gray-500">Avg Lead Time (days)</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center gap-3">
            <Package className="w-8 h-8 text-purple-500" />
            <div>
              <p className="text-2xl font-bold">{stats.avgActualLeadTime}</p>
              <p className="text-xs text-gray-500">Actual Avg (days)</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-8 h-8 text-green-500" />
            <div>
              <p className="text-2xl font-bold text-green-600">{stats.onTimeRate}%</p>
              <p className="text-xs text-gray-500">On-Time Rate</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-8 h-8 text-red-500" />
            <div>
              <p className="text-2xl font-bold text-red-600">{stats.delayed}</p>
              <p className="text-xs text-gray-500">Delayed Orders</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center gap-3">
            {stats.avgVariance > 0 ? (
              <TrendingUp className="w-8 h-8 text-red-500" />
            ) : (
              <TrendingDown className="w-8 h-8 text-green-500" />
            )}
            <div>
              <p className={`text-2xl font-bold ${stats.avgVariance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                {stats.avgVariance > 0 ? '+' : ''}{stats.avgVariance}
              </p>
              <p className="text-xs text-gray-500">Avg Variance (days)</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ============================================================================
// Milestone Timeline Component
// ============================================================================

function MilestoneTimeline({
  milestones,
  onMilestoneClick,
}: {
  milestones: Milestone[];
  onMilestoneClick?: (milestone: Milestone) => void;
}) {
  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute top-4 left-4 right-4 h-0.5 bg-gray-200 dark:bg-gray-700" />

      {/* Milestones */}
      <div className="relative flex justify-between">
        {milestones.map((milestone, index) => {
          const isFirst = index === 0;
          const isLast = index === milestones.length - 1;

          return (
            <div
              key={milestone.id}
              className="flex flex-col items-center cursor-pointer group"
              style={{ width: `${100 / milestones.length}%` }}
              onClick={() => onMilestoneClick?.(milestone)}
            >
              {/* Dot */}
              <div className={`relative z-10 w-8 h-8 rounded-full ${getMilestoneColor(milestone.status)} flex items-center justify-center`}>
                {milestone.status === 'completed' && <CheckCircle className="w-4 h-4 text-white" />}
                {milestone.status === 'current' && <Truck className="w-4 h-4 text-white animate-pulse" />}
                {milestone.status === 'delayed' && <AlertTriangle className="w-4 h-4 text-white" />}
                {milestone.status === 'upcoming' && <Clock className="w-4 h-4 text-gray-500" />}
              </div>

              {/* Label */}
              <div className="mt-2 text-center">
                <p className="text-xs font-medium text-gray-900 dark:text-white truncate max-w-[80px]">
                  {milestone.name}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {milestone.expectedDate}
                </p>
                {milestone.actualDate && milestone.actualDate !== milestone.expectedDate && (
                  <p className={`text-xs mt-0.5 ${milestone.status === 'delayed' ? 'text-red-600' : 'text-green-600'}`}>
                    Actual: {milestone.actualDate}
                  </p>
                )}
              </div>

              {/* Tooltip */}
              {milestone.notes && (
                <div className="absolute top-full mt-8 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
                  {milestone.notes}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================================
// Order Card Component
// ============================================================================

function OrderCard({
  order,
  onOrderClick,
  onMilestoneClick,
}: {
  order: Order;
  onOrderClick?: (order: Order) => void;
  onMilestoneClick?: (order: Order, milestone: Milestone) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(order.status === 'delayed' || order.priority === 'critical');

  const StatusIcon = order.status === 'delivered' ? CheckCircle :
    order.status === 'delayed' ? XCircle :
    order.status === 'in-transit' ? Truck : Package;

  return (
    <Card className={`${order.status === 'delayed' ? 'border-red-300 dark:border-red-700' : ''}`}>
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-2">
            <div className={`p-2 rounded-lg ${getStatusBgColor(order.status)}`}>
              <StatusIcon className={`w-6 h-6 ${getStatusColor(order.status)}`} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4
                  className="font-semibold text-gray-900 dark:text-white cursor-pointer hover:text-blue-600 transition-colors"
                  onClick={() => onOrderClick?.(order)}
                >
                  {order.poNumber}
                </h4>
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${getPriorityBadge(order.priority)}`}>
                  {order.priority.toUpperCase()}
                </span>
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${getStatusBgColor(order.status)} ${getStatusColor(order.status)}`}>
                  {order.status.replace('-', ' ').toUpperCase()}
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-1">{order.vendor}</p>
              <p className="text-sm text-gray-700 dark:text-gray-300">{order.item} × {order.quantity.toLocaleString()}</p>
            </div>
          </div>

          <div className="text-right">
            <div className="flex items-center gap-2">
              <div>
                <p className="text-xs text-gray-500">Lead Time</p>
                <p className="font-semibold">{order.leadTimeDays} days</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Variance</p>
                <p className={`font-semibold ${order.variance > 0 ? 'text-red-600' : order.variance < 0 ? 'text-green-600' : 'text-gray-600'}`}>
                  {order.variance > 0 ? '+' : ''}{order.variance} days
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Expected</p>
                <p className="font-semibold">{order.expectedDelivery}</p>
              </div>
              {order.actualDelivery && (
                <div>
                  <p className="text-xs text-gray-500">Actual</p>
                  <p className={`font-semibold ${order.variance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {order.actualDelivery}
                  </p>
                </div>
              )}
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>{order.orderDate}</span>
            <span>{order.expectedDelivery}</span>
          </div>
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            {(() => {
              const completed = order.milestones.filter(m => m.status === 'completed').length;
              const progress = (completed / order.milestones.length) * 100;
              return (
                <div
                  className={`h-full rounded-full transition-all ${
                    order.status === 'delayed' ? 'bg-red-500' :
                    order.status === 'delivered' ? 'bg-green-500' : 'bg-blue-500'
                  }`}
                  style={{ width: `${progress}%` }}
                />
              );
            })()}
          </div>
        </div>

        {/* Expanded Timeline */}
        {isExpanded && (
          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <MilestoneTimeline
              milestones={order.milestones}
              onMilestoneClick={(m) => onMilestoneClick?.(order, m)}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ============================================================================
// Gantt-style Timeline View
// ============================================================================

function GanttView({ orders, onOrderClick }: { orders: Order[]; onOrderClick?: (order: Order) => void }) {
  // Find date range
  const allDates = orders.flatMap(o => [o.orderDate, o.expectedDelivery, o.actualDelivery].filter(Boolean)) as string[];
  const minDate = new Date(Math.min(...allDates.map(d => new Date(d).getTime())));
  const maxDate = new Date(Math.max(...allDates.map(d => new Date(d).getTime())));
  const totalDays = Math.ceil((maxDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24)) + 7;

  const getPosition = (dateStr: string) => {
    const date = new Date(dateStr);
    const days = Math.ceil((date.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24));
    return (days / totalDays) * 100;
  };

  const getWidth = (startDate: string, endDate: string) => {
    return getPosition(endDate) - getPosition(startDate);
  };

  // Generate week markers
  const weeks: Date[] = [];
  const current = new Date(minDate);
  while (current <= maxDate) {
    weeks.push(new Date(current));
    current.setDate(current.getDate() + 7);
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">Lead Time Gantt View</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            {/* Header with dates */}
            <div className="flex border-b border-gray-200 dark:border-gray-700 pb-2 mb-2">
              <div className="w-48 flex-shrink-0 text-sm font-medium text-gray-500">Order</div>
              <div className="flex-1 relative h-6">
                {weeks.map((week, i) => (
                  <div
                    key={i}
                    className="absolute text-xs text-gray-400"
                    style={{ left: `${getPosition(week.toISOString().split('T')[0])}%` }}
                  >
                    {week.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                ))}
              </div>
            </div>

            {/* Order bars */}
            <div className="space-y-3">
              {orders.map(order => (
                <div key={order.id} className="flex items-center">
                  <div className="w-48 flex-shrink-0">
                    <p
                      className="text-sm font-medium truncate cursor-pointer hover:text-blue-600"
                      onClick={() => onOrderClick?.(order)}
                    >
                      {order.poNumber}
                    </p>
                    <p className="text-xs text-gray-500 truncate">{order.vendor}</p>
                  </div>
                  <div className="flex-1 relative h-8">
                    {/* Expected bar */}
                    <div
                      className="absolute h-6 bg-gray-200 dark:bg-gray-700 rounded top-1"
                      style={{
                        left: `${getPosition(order.orderDate)}%`,
                        width: `${getWidth(order.orderDate, order.expectedDelivery)}%`,
                      }}
                    />

                    {/* Actual/Progress bar */}
                    <div
                      className={`absolute h-6 rounded top-1 ${
                        order.status === 'delayed' ? 'bg-red-500' :
                        order.status === 'delivered' ? 'bg-green-500' : 'bg-blue-500'
                      }`}
                      style={{
                        left: `${getPosition(order.orderDate)}%`,
                        width: `${getWidth(order.orderDate, order.actualDelivery || order.expectedDelivery) * (order.milestones.filter(m => m.status === 'completed').length / order.milestones.length)}%`,
                      }}
                    />

                    {/* Today marker */}
                    <div
                      className="absolute w-0.5 h-8 bg-indigo-500 top-0"
                      style={{ left: `${getPosition(new Date().toISOString().split('T')[0])}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export function LeadTimeTimeline({
  onOrderClick,
  onMilestoneClick,
}: LeadTimeTimelineProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'list' | 'gantt'>('list');
  const [filterStatus, setFilterStatus] = useState<OrderStatus | 'all'>('all');
  const [filterPriority, setFilterPriority] = useState<Order['priority'] | 'all'>('all');

  useEffect(() => {
    setOrders(generateMockOrders());
    setIsLoading(false);
  }, []);

  const filteredOrders = useMemo(() => {
    let result = [...orders];

    if (filterStatus !== 'all') {
      result = result.filter(o => o.status === filterStatus);
    }

    if (filterPriority !== 'all') {
      result = result.filter(o => o.priority === filterPriority);
    }

    // Sort by variance (delays first)
    result.sort((a, b) => b.variance - a.variance);

    return result;
  }, [orders, filterStatus, filterPriority]);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="h-[400px] flex items-center justify-center">
          <Clock className="w-8 h-8 animate-spin text-gray-400" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-2">
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              Lead Time Tracking
            </CardTitle>

            <div className="flex items-center gap-3">
              <div className="flex rounded-lg border border-gray-300 dark:border-gray-600 overflow-hidden">
                <button
                  className={`px-3 py-1.5 text-sm ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-800'}`}
                  onClick={() => setViewMode('list')}
                >
                  List
                </button>
                <button
                  className={`px-3 py-1.5 text-sm ${viewMode === 'gantt' ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-800'}`}
                  onClick={() => setViewMode('gantt')}
                >
                  Gantt
                </button>
              </div>

              <select
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value as OrderStatus | 'all')}
                className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="in-transit">In Transit</option>
                <option value="delivered">Delivered</option>
                <option value="delayed">Delayed</option>
              </select>

              <select
                value={filterPriority}
                onChange={e => setFilterPriority(e.target.value as Order['priority'] | 'all')}
                className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm"
              >
                <option value="all">All Priorities</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <LeadTimeStatsBar orders={orders} />
        </CardContent>
      </Card>

      {/* Timeline View */}
      {viewMode === 'gantt' ? (
        <GanttView orders={filteredOrders} onOrderClick={onOrderClick} />
      ) : (
        <div className="space-y-2">
          {filteredOrders.map(order => (
            <OrderCard
              key={order.id}
              order={order}
              onOrderClick={onOrderClick}
              onMilestoneClick={onMilestoneClick}
            />
          ))}
        </div>
      )}

      {filteredOrders.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center text-gray-500">
            No orders match the selected filters
          </CardContent>
        </Card>
      )}
    </div>
  );
}

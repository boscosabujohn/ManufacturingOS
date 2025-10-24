'use client';

import React, { useState } from 'react';
import { Package, Truck, CheckCircle, Clock, AlertTriangle, MapPin, User, Barcode } from 'lucide-react';

export type TaskType = 'putaway' | 'picking' | 'replenishment' | 'cycle-count' | 'transfer';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskStatus = 'pending' | 'assigned' | 'in-progress' | 'completed' | 'cancelled';

export interface WarehouseTask {
  id: string;
  type: TaskType;
  priority: TaskPriority;
  status: TaskStatus;
  assignedTo?: string;
  item: string;
  sku: string;
  quantity: number;
  fromLocation?: string;
  toLocation: string;
  dueTime: string;
  createdAt: string;
  completedAt?: string;
}

export default function WarehouseTasking() {
  const tasks: WarehouseTask[] = [
    {
      id: 'TSK-001',
      type: 'picking',
      priority: 'urgent',
      status: 'in-progress',
      assignedTo: 'John Doe',
      item: 'Steel Sheet 304 - 2mm',
      sku: 'SS-304-2MM',
      quantity: 50,
      fromLocation: 'A-01-02-03',
      toLocation: 'STAGING-01',
      dueTime: '14:30',
      createdAt: '2025-01-24 13:45',
    },
    {
      id: 'TSK-002',
      type: 'putaway',
      priority: 'high',
      status: 'assigned',
      assignedTo: 'Jane Smith',
      item: 'Hydraulic Pump HP-500',
      sku: 'HP-500',
      quantity: 20,
      fromLocation: 'RECEIVING-01',
      toLocation: 'B-02-03-01',
      dueTime: '15:00',
      createdAt: '2025-01-24 14:00',
    },
    {
      id: 'TSK-003',
      type: 'replenishment',
      priority: 'medium',
      status: 'pending',
      item: 'Bearing 6205-2RS',
      sku: 'BRG-6205',
      quantity: 100,
      fromLocation: 'C-03-01-05',
      toLocation: 'PICK-ZONE-A',
      dueTime: '16:00',
      createdAt: '2025-01-24 14:15',
    },
  ];

  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-300';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'low': return 'bg-green-100 text-green-800 border-green-300';
    }
  };

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'assigned': return 'bg-purple-100 text-purple-800';
      case 'pending': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
    }
  };

  const getTypeIcon = (type: TaskType) => {
    switch (type) {
      case 'picking': return Package;
      case 'putaway': return MapPin;
      case 'replenishment': return Truck;
      case 'cycle-count': return Barcode;
      case 'transfer': return Truck;
    }
  };

  return (
    <div className="w-full h-full bg-gradient-to-br from-gray-50 via-orange-50 to-amber-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Warehouse Task Management</h1>
          <p className="text-gray-600">Optimized task assignment and execution tracking</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Pending', count: tasks.filter(t => t.status === 'pending').length, color: 'gray' },
            { label: 'In Progress', count: tasks.filter(t => t.status === 'in-progress').length, color: 'blue' },
            { label: 'Completed Today', count: 45, color: 'green' },
            { label: 'Overdue', count: 2, color: 'red' },
          ].map((stat) => (
            <div key={stat.label} className={`bg-white rounded-xl shadow-lg p-4 border border-${stat.color}-200`}>
              <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
              <p className={`text-3xl font-bold text-${stat.color}-600`}>{stat.count}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Active Tasks</h2>

          <div className="space-y-4">
            {tasks.map((task) => {
              const Icon = getTypeIcon(task.type);
              return (
                <div key={task.id} className={`rounded-lg p-4 border-2 ${getPriorityColor(task.priority)}`}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Icon className="w-6 h-6 text-gray-700" />
                      <div>
                        <h3 className="font-semibold text-gray-900">{task.item}</h3>
                        <p className="text-sm text-gray-600">SKU: {task.sku} • Qty: {task.quantity}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                        {task.status.toUpperCase().replace('-', ' ')}
                      </span>
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {task.type.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    {task.fromLocation && (
                      <div>
                        <p className="text-gray-600">From</p>
                        <p className="font-semibold text-gray-900">{task.fromLocation}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-gray-600">To</p>
                      <p className="font-semibold text-gray-900">{task.toLocation}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Due Time</p>
                      <p className="font-semibold text-orange-600">{task.dueTime}</p>
                    </div>
                    {task.assignedTo && (
                      <div>
                        <p className="text-gray-600">Assigned To</p>
                        <p className="font-semibold text-gray-900">{task.assignedTo}</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

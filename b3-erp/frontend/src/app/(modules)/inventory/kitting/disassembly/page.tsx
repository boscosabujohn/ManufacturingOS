'use client';

import React, { useState } from 'react';
import {
  PackageMinus,
  Calendar,
  User,
  Package,
  Search,
  Filter,
  CheckCircle,
  Clock,
  AlertCircle,
  Plus,
  Eye,
  Boxes,
  MapPin,
  Undo2
} from 'lucide-react';

interface DisassemblyOrder {
  id: number;
  disassemblyNumber: string;
  disassemblyDate: string;
  kitNumber: string;
  kitName: string;
  quantityOrdered: number;
  quantityDisassembled: number;
  disassembledBy?: string;
  warehouse: string;
  reason: string;
  status: 'pending' | 'in-progress' | 'completed' | 'on-hold';
  priority: 'normal' | 'high' | 'urgent';
  startDate?: string;
  completionDate?: string;
  expectedDate: string;
  componentsReturned: boolean;
}

export default function DisassemblyPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedReason, setSelectedReason] = useState('all');

  const [disassemblies, setDisassemblies] = useState<DisassemblyOrder[]>([
    {
      id: 1,
      disassemblyNumber: 'DIS-2025-001',
      disassemblyDate: '2025-01-20',
      kitNumber: 'KIT-001',
      kitName: 'Hydraulic System Assembly Kit',
      quantityOrdered: 2,
      quantityDisassembled: 2,
      disassembledBy: 'John Smith',
      warehouse: 'Assembly Plant',
      reason: 'Defective Kit',
      status: 'completed',
      priority: 'high',
      startDate: '2025-01-20',
      completionDate: '2025-01-20',
      expectedDate: '2025-01-20',
      componentsReturned: true
    },
    {
      id: 2,
      disassemblyNumber: 'DIS-2025-002',
      disassemblyDate: '2025-01-22',
      kitNumber: 'KIT-002',
      kitName: 'Control Panel Electronics Kit',
      quantityOrdered: 3,
      quantityDisassembled: 1,
      disassembledBy: 'Sarah Johnson',
      warehouse: 'Main Warehouse',
      reason: 'Excess Stock',
      status: 'in-progress',
      priority: 'normal',
      startDate: '2025-01-22',
      expectedDate: '2025-01-23',
      componentsReturned: false
    },
    {
      id: 3,
      disassemblyNumber: 'DIS-2025-003',
      disassemblyDate: '2025-01-21',
      kitNumber: 'KIT-003',
      kitName: 'Excavator Maintenance Kit',
      quantityOrdered: 5,
      quantityDisassembled: 0,
      warehouse: 'Spares Store',
      reason: 'Customer Return',
      status: 'pending',
      priority: 'urgent',
      expectedDate: '2025-01-23',
      componentsReturned: false
    },
    {
      id: 4,
      disassemblyNumber: 'DIS-2025-004',
      disassemblyDate: '2025-01-19',
      kitNumber: 'KIT-005',
      kitName: 'Bearing & Seal Replacement Kit',
      quantityOrdered: 4,
      quantityDisassembled: 4,
      disassembledBy: 'Mike Davis',
      warehouse: 'Assembly Plant',
      reason: 'Wrong Configuration',
      status: 'completed',
      priority: 'normal',
      startDate: '2025-01-19',
      completionDate: '2025-01-19',
      expectedDate: '2025-01-19',
      componentsReturned: true
    },
    {
      id: 5,
      disassemblyNumber: 'DIS-2025-005',
      disassemblyDate: '2025-01-22',
      kitNumber: 'KIT-006',
      kitName: 'Safety Equipment Bundle',
      quantityOrdered: 6,
      quantityDisassembled: 3,
      disassembledBy: 'Emily Chen',
      warehouse: 'Main Warehouse',
      reason: 'Damage Assessment',
      status: 'on-hold',
      priority: 'high',
      startDate: '2025-01-22',
      expectedDate: '2025-01-24',
      componentsReturned: false
    },
    {
      id: 6,
      disassemblyNumber: 'DIS-2025-006',
      disassemblyDate: '2025-01-18',
      kitNumber: 'KIT-004',
      kitName: 'Welding Consumables Pack',
      quantityOrdered: 8,
      quantityDisassembled: 8,
      disassembledBy: 'Robert Lee',
      warehouse: 'FG Store',
      reason: 'Component Shortage',
      status: 'completed',
      priority: 'normal',
      startDate: '2025-01-18',
      completionDate: '2025-01-18',
      expectedDate: '2025-01-18',
      componentsReturned: true
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'in-progress':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'pending':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'on-hold':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'high':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'normal':
        return 'text-gray-600 bg-gray-50 border-gray-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const totalDisassemblies = disassemblies.length;
  const pendingDisassemblies = disassemblies.filter(d => d.status === 'pending').length;
  const completedToday = disassemblies.filter(d => d.status === 'completed' && d.completionDate === '2025-01-22').length;
  const urgentDisassemblies = disassemblies.filter(d => d.priority === 'urgent' && d.status !== 'completed').length;

  const filteredDisassemblies = disassemblies.filter(disassembly => {
    const matchesSearch = disassembly.disassemblyNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         disassembly.kitName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || disassembly.status === selectedStatus;
    const matchesReason = selectedReason === 'all' || disassembly.reason === selectedReason;
    
    return matchesSearch && matchesStatus && matchesReason;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
            <Undo2 className="w-8 h-8 text-orange-600" />
            <span>Kit Disassembly Orders</span>
          </h1>
          <p className="text-gray-600 mt-1">Manage kit disassembly orders and component recovery</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Create Disassembly Order</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-6 border border-orange-200">
          <div className="flex items-center justify-between mb-2">
            <Undo2 className="w-8 h-8 text-orange-600" />
            <span className="text-2xl font-bold text-orange-900">{totalDisassemblies}</span>
          </div>
          <div className="text-sm font-medium text-orange-700">Total Disassembly Orders</div>
          <div className="text-xs text-orange-600 mt-1">All Status</div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-6 border border-yellow-200">
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-8 h-8 text-yellow-600" />
            <span className="text-2xl font-bold text-yellow-900">{pendingDisassemblies}</span>
          </div>
          <div className="text-sm font-medium text-yellow-700">Pending Disassembly</div>
          <div className="text-xs text-yellow-600 mt-1">Not Started</div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <span className="text-2xl font-bold text-green-900">{completedToday}</span>
          </div>
          <div className="text-sm font-medium text-green-700">Completed Today</div>
          <div className="text-xs text-green-600 mt-1">January 22, 2025</div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-6 border border-red-200">
          <div className="flex items-center justify-between mb-2">
            <AlertCircle className="w-8 h-8 text-red-600" />
            <span className="text-2xl font-bold text-red-900">{urgentDisassemblies}</span>
          </div>
          <div className="text-sm font-medium text-red-700">Urgent Disassembly</div>
          <div className="text-xs text-red-600 mt-1">High Priority</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search disassembly orders..."
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
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="on-hold">On Hold</option>
          </select>

          <select
            value={selectedReason}
            onChange={(e) => setSelectedReason(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Reasons</option>
            <option value="Defective Kit">Defective Kit</option>
            <option value="Excess Stock">Excess Stock</option>
            <option value="Customer Return">Customer Return</option>
            <option value="Wrong Configuration">Wrong Configuration</option>
            <option value="Damage Assessment">Damage Assessment</option>
            <option value="Component Shortage">Component Shortage</option>
          </select>
        </div>
      </div>

      {/* Disassembly Orders Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Disassembly #</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kit Details</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Warehouse</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Disassembled By</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredDisassemblies.map((disassembly) => (
                <tr key={disassembly.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {disassembly.disassemblyNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span>{disassembly.disassemblyDate}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <div className="font-medium">{disassembly.kitNumber}</div>
                    <div className="text-xs text-gray-500 flex items-center space-x-1">
                      <Boxes className="w-3 h-3" />
                      <span>{disassembly.kitName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center space-x-1">
                      <Package className="w-4 h-4 text-gray-400" />
                      <span className="font-medium">{disassembly.quantityOrdered} kits</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2 w-20">
                        <div
                          className={`h-2 rounded-full ${
                            disassembly.status === 'completed' ? 'bg-green-500' :
                            disassembly.status === 'in-progress' ? 'bg-orange-500' :
                            'bg-yellow-500'
                          }`}
                          style={{ width: `${(disassembly.quantityDisassembled / disassembly.quantityOrdered) * 100}%` }}
                        />
                      </div>
                      <span className="text-gray-700 font-medium">
                        {disassembly.quantityDisassembled}/{disassembly.quantityOrdered}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span>{disassembly.warehouse}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    <span className="px-2 py-1 bg-gray-100 rounded text-xs">{disassembly.reason}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {disassembly.disassembledBy ? (
                      <div className="flex items-center space-x-1">
                        <User className="w-4 h-4 text-gray-400" />
                        <span>{disassembly.disassembledBy}</span>
                      </div>
                    ) : (
                      <span className="text-gray-400">Not started</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(disassembly.priority)}`}>
                      {disassembly.priority.toUpperCase()}
                      {disassembly.priority === 'urgent' && <AlertCircle className="w-3 h-3 inline ml-1" />}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(disassembly.status)}`}>
                      {disassembly.status.replace('-', ' ').toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center space-x-2">
                      <button className="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                        <Eye className="w-4 h-4 text-gray-600" />
                        <span className="text-gray-700">View</span>
                      </button>
                      {disassembly.status === 'pending' && (
                        <button className="inline-flex items-center gap-1.5 px-3 py-2 border border-orange-300 rounded-lg hover:bg-orange-50 text-sm">
                          <Undo2 className="w-4 h-4 text-orange-600" />
                          <span className="text-orange-600">Revert</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredDisassemblies.length === 0 && (
          <div className="text-center py-12">
            <Undo2 className="w-12 h-12 text-gray-400 mb-4" />
            <p className="text-gray-500">No disassembly orders found matching your filters</p>
          </div>
        )}
      </div>
    </div>
  );
}

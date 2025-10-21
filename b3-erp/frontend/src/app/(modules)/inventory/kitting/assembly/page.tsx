'use client';

import React, { useState } from 'react';
import {
  PackagePlus,
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
  MapPin
} from 'lucide-react';

interface AssemblyOrder {
  id: number;
  assemblyNumber: string;
  assemblyDate: string;
  kitNumber: string;
  kitName: string;
  quantityOrdered: number;
  quantityAssembled: number;
  assembledBy?: string;
  warehouse: string;
  status: 'pending' | 'in-progress' | 'completed' | 'on-hold';
  priority: 'normal' | 'high' | 'urgent';
  startDate?: string;
  completionDate?: string;
  expectedDate: string;
  componentsPicked: boolean;
}

export default function AssemblyPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');

  const [assemblies, setAssemblies] = useState<AssemblyOrder[]>([
    {
      id: 1,
      assemblyNumber: 'ASM-2025-001',
      assemblyDate: '2025-01-22',
      kitNumber: 'KIT-001',
      kitName: 'Hydraulic System Assembly Kit',
      quantityOrdered: 5,
      quantityAssembled: 5,
      assembledBy: 'John Smith',
      warehouse: 'Assembly Plant',
      status: 'completed',
      priority: 'normal',
      startDate: '2025-01-22',
      completionDate: '2025-01-22',
      expectedDate: '2025-01-22',
      componentsPicked: true
    },
    {
      id: 2,
      assemblyNumber: 'ASM-2025-002',
      assemblyDate: '2025-01-22',
      kitNumber: 'KIT-002',
      kitName: 'Control Panel Electronics Kit',
      quantityOrdered: 10,
      quantityAssembled: 6,
      assembledBy: 'Sarah Johnson',
      warehouse: 'Main Warehouse',
      status: 'in-progress',
      priority: 'high',
      startDate: '2025-01-22',
      expectedDate: '2025-01-23',
      componentsPicked: true
    },
    {
      id: 3,
      assemblyNumber: 'ASM-2025-003',
      assemblyDate: '2025-01-21',
      kitNumber: 'KIT-004',
      kitName: 'Welding Consumables Pack',
      quantityOrdered: 20,
      quantityAssembled: 20,
      assembledBy: 'Mike Davis',
      warehouse: 'FG Store',
      status: 'completed',
      priority: 'normal',
      startDate: '2025-01-21',
      completionDate: '2025-01-21',
      expectedDate: '2025-01-21',
      componentsPicked: true
    },
    {
      id: 4,
      assemblyNumber: 'ASM-2025-004',
      assemblyDate: '2025-01-22',
      kitNumber: 'KIT-003',
      kitName: 'Excavator Maintenance Kit',
      quantityOrdered: 8,
      quantityAssembled: 0,
      warehouse: 'Spares Store',
      status: 'pending',
      priority: 'urgent',
      expectedDate: '2025-01-23',
      componentsPicked: true
    },
    {
      id: 5,
      assemblyNumber: 'ASM-2025-005',
      assemblyDate: '2025-01-22',
      kitNumber: 'KIT-005',
      kitName: 'Bearing & Seal Replacement Kit',
      quantityOrdered: 12,
      quantityAssembled: 0,
      warehouse: 'Assembly Plant',
      status: 'pending',
      priority: 'normal',
      expectedDate: '2025-01-24',
      componentsPicked: false
    },
    {
      id: 6,
      assemblyNumber: 'ASM-2025-006',
      assemblyDate: '2025-01-20',
      kitNumber: 'KIT-006',
      kitName: 'Safety Equipment Bundle',
      quantityOrdered: 15,
      quantityAssembled: 10,
      assembledBy: 'Emily Chen',
      warehouse: 'Main Warehouse',
      status: 'on-hold',
      priority: 'normal',
      startDate: '2025-01-20',
      expectedDate: '2025-01-22',
      componentsPicked: true
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

  const totalAssemblies = assemblies.length;
  const pendingAssemblies = assemblies.filter(a => a.status === 'pending').length;
  const completedToday = assemblies.filter(a => a.status === 'completed' && a.completionDate === '2025-01-22').length;
  const urgentAssemblies = assemblies.filter(a => a.priority === 'urgent' && a.status !== 'completed').length;

  const filteredAssemblies = assemblies.filter(assembly => {
    const matchesSearch = assembly.assemblyNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         assembly.kitName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || assembly.status === selectedStatus;
    const matchesPriority = selectedPriority === 'all' || assembly.priority === selectedPriority;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
            <PackagePlus className="w-8 h-8 text-green-600" />
            <span>Kit Assembly Orders</span>
          </h1>
          <p className="text-gray-600 mt-1">Manage kit assembly orders and track assembly progress</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Create Assembly Order</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
          <div className="flex items-center justify-between mb-2">
            <PackagePlus className="w-8 h-8 text-green-600" />
            <span className="text-2xl font-bold text-green-900">{totalAssemblies}</span>
          </div>
          <div className="text-sm font-medium text-green-700">Total Assembly Orders</div>
          <div className="text-xs text-green-600 mt-1">All Status</div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-6 border border-yellow-200">
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-8 h-8 text-yellow-600" />
            <span className="text-2xl font-bold text-yellow-900">{pendingAssemblies}</span>
          </div>
          <div className="text-sm font-medium text-yellow-700">Pending Assembly</div>
          <div className="text-xs text-yellow-600 mt-1">Not Started</div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-bold text-blue-900">{completedToday}</span>
          </div>
          <div className="text-sm font-medium text-blue-700">Completed Today</div>
          <div className="text-xs text-blue-600 mt-1">January 22, 2025</div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-6 border border-red-200">
          <div className="flex items-center justify-between mb-2">
            <AlertCircle className="w-8 h-8 text-red-600" />
            <span className="text-2xl font-bold text-red-900">{urgentAssemblies}</span>
          </div>
          <div className="text-sm font-medium text-red-700">Urgent Assembly</div>
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
              placeholder="Search assembly orders..."
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
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Priority</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="normal">Normal</option>
          </select>
        </div>
      </div>

      {/* Assembly Orders Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assembly #</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kit Details</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Warehouse</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assembled By</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAssemblies.map((assembly) => (
                <tr key={assembly.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {assembly.assemblyNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span>{assembly.assemblyDate}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <div className="font-medium">{assembly.kitNumber}</div>
                    <div className="text-xs text-gray-500 flex items-center space-x-1">
                      <Boxes className="w-3 h-3" />
                      <span>{assembly.kitName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center space-x-1">
                      <Package className="w-4 h-4 text-gray-400" />
                      <span className="font-medium">{assembly.quantityOrdered} units</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2 w-20">
                        <div
                          className={`h-2 rounded-full ${
                            assembly.status === 'completed' ? 'bg-green-500' :
                            assembly.status === 'in-progress' ? 'bg-blue-500' :
                            'bg-yellow-500'
                          }`}
                          style={{ width: `${(assembly.quantityAssembled / assembly.quantityOrdered) * 100}%` }}
                        />
                      </div>
                      <span className="text-gray-700 font-medium">
                        {assembly.quantityAssembled}/{assembly.quantityOrdered}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span>{assembly.warehouse}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {assembly.assembledBy ? (
                      <div className="flex items-center space-x-1">
                        <User className="w-4 h-4 text-gray-400" />
                        <span>{assembly.assembledBy}</span>
                      </div>
                    ) : (
                      <span className="text-gray-400">Not started</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(assembly.priority)}`}>
                      {assembly.priority.toUpperCase()}
                      {assembly.priority === 'urgent' && <AlertCircle className="w-3 h-3 inline ml-1" />}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(assembly.status)}`}>
                      {assembly.status.replace('-', ' ').toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center space-x-2">
                      <button className="text-blue-600 hover:text-blue-800">
                        <Eye className="w-4 h-4" />
                      </button>
                      {assembly.status === 'pending' && (
                        <button className="text-green-600 hover:text-green-800">
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredAssemblies.length === 0 && (
          <div className="text-center py-12">
            <PackagePlus className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No assembly orders found matching your filters</p>
          </div>
        )}
      </div>
    </div>
  );
}

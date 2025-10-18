'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Search,
  Plus,
  Package,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  Eye,
  Edit,
  FileText,
  User,
} from 'lucide-react';

interface Deliverable {
  id: string;
  deliverableNumber: string;
  deliverableName: string;
  projectNumber: string;
  projectName: string;
  type: 'Equipment' | 'Installation' | 'Documentation' | 'Training' | 'Service';
  description: string;
  assignedTo: string;
  plannedDate: string;
  actualDate?: string;
  status: 'Not Started' | 'In Progress' | 'Completed' | 'Delayed' | 'On Hold';
  progress: number;
  dependencies: string[];
  quantity: number;
  unit: string;
  notes: string;
}

const mockDeliverables: Deliverable[] = [
  {
    id: '1',
    deliverableNumber: 'DEL-001',
    deliverableName: 'Kitchen Equipment Delivery',
    projectNumber: 'PRJ-2024-001',
    projectName: 'Taj Hotel Commercial Kitchen',
    type: 'Equipment',
    description: 'Commercial cooking range, ovens, and refrigeration units',
    assignedTo: 'Logistics Team',
    plannedDate: '2024-02-15',
    actualDate: '2024-02-14',
    status: 'Completed',
    progress: 100,
    dependencies: [],
    quantity: 25,
    unit: 'Units',
    notes: 'All equipment delivered in good condition',
  },
  {
    id: '2',
    deliverableNumber: 'DEL-002',
    deliverableName: 'Site Preparation & Civil Work',
    projectNumber: 'PRJ-2024-001',
    projectName: 'Taj Hotel Commercial Kitchen',
    type: 'Installation',
    description: 'Floor reinforcement, drainage, and electrical infrastructure',
    assignedTo: 'Civil Team',
    plannedDate: '2024-03-01',
    actualDate: '2024-03-03',
    status: 'Completed',
    progress: 100,
    dependencies: ['DEL-001'],
    quantity: 1,
    unit: 'Phase',
    notes: 'Minor delays due to weather',
  },
  {
    id: '3',
    deliverableNumber: 'DEL-003',
    deliverableName: 'Equipment Installation',
    projectNumber: 'PRJ-2024-001',
    projectName: 'Taj Hotel Commercial Kitchen',
    type: 'Installation',
    description: 'Installation of cooking equipment, exhaust systems, and refrigeration',
    assignedTo: 'Rajesh Kumar',
    plannedDate: '2024-03-20',
    status: 'In Progress',
    progress: 65,
    dependencies: ['DEL-002'],
    quantity: 25,
    unit: 'Units',
    notes: 'Refrigeration pending',
  },
  {
    id: '4',
    deliverableNumber: 'DEL-004',
    deliverableName: 'Cold Room Panel Assembly',
    projectNumber: 'PRJ-2024-002',
    projectName: 'BigBasket Cold Storage',
    type: 'Installation',
    description: 'Assembly of insulated panels and door systems',
    assignedTo: 'Priya Sharma',
    plannedDate: '2024-03-10',
    status: 'In Progress',
    progress: 45,
    dependencies: ['DEL-005'],
    quantity: 120,
    unit: 'Panels',
    notes: 'On track',
  },
  {
    id: '5',
    deliverableNumber: 'DEL-005',
    deliverableName: 'Cold Room Materials Procurement',
    projectNumber: 'PRJ-2024-002',
    projectName: 'BigBasket Cold Storage',
    type: 'Equipment',
    description: 'Insulated panels, refrigeration units, and control systems',
    assignedTo: 'Procurement Team',
    plannedDate: '2024-02-20',
    actualDate: '2024-02-18',
    status: 'Completed',
    progress: 100,
    dependencies: [],
    quantity: 150,
    unit: 'Items',
    notes: 'All materials received',
  },
  {
    id: '6',
    deliverableNumber: 'DEL-006',
    deliverableName: 'Switchgear Testing Documentation',
    projectNumber: 'PRJ-2024-003',
    projectName: 'L&T Switchgear Panel',
    type: 'Documentation',
    description: 'Complete testing reports, FAT certificates, and compliance documents',
    assignedTo: 'QA Team',
    plannedDate: '2024-03-15',
    status: 'Delayed',
    progress: 75,
    dependencies: ['DEL-007'],
    quantity: 1,
    unit: 'Set',
    notes: 'Waiting for final test results',
  },
  {
    id: '7',
    deliverableNumber: 'DEL-007',
    deliverableName: 'Switchgear Manufacturing',
    projectNumber: 'PRJ-2024-003',
    projectName: 'L&T Switchgear Panel',
    type: 'Equipment',
    description: 'Manufacturing of HT switchgear panels',
    assignedTo: 'Production Team',
    plannedDate: '2024-02-28',
    actualDate: '2024-03-05',
    status: 'Completed',
    progress: 100,
    dependencies: [],
    quantity: 8,
    unit: 'Panels',
    notes: 'Manufacturing completed with minor delays',
  },
  {
    id: '8',
    deliverableNumber: 'DEL-008',
    deliverableName: 'Staff Training Program',
    projectNumber: 'PRJ-2024-001',
    projectName: 'Taj Hotel Commercial Kitchen',
    type: 'Training',
    description: 'Training hotel staff on equipment operation and maintenance',
    assignedTo: 'Training Team',
    plannedDate: '2024-04-15',
    status: 'Not Started',
    progress: 0,
    dependencies: ['DEL-003'],
    quantity: 15,
    unit: 'Staff',
    notes: 'Scheduled after installation completion',
  },
  {
    id: '9',
    deliverableNumber: 'DEL-009',
    deliverableName: 'Design & Drawings Approval',
    projectNumber: 'PRJ-2024-004',
    projectName: 'ITC Grand Kitchen Renovation',
    type: 'Documentation',
    description: 'Detailed engineering drawings and layout plans',
    assignedTo: 'Design Team',
    plannedDate: '2024-03-10',
    status: 'In Progress',
    progress: 80,
    dependencies: [],
    quantity: 1,
    unit: 'Set',
    notes: 'Client review pending',
  },
  {
    id: '10',
    deliverableNumber: 'DEL-010',
    deliverableName: 'Commissioning & Handover',
    projectNumber: 'PRJ-2024-005',
    projectName: 'Godrej Cold Room',
    type: 'Service',
    description: 'Final commissioning, testing, and project handover',
    assignedTo: 'Commissioning Team',
    plannedDate: '2024-05-25',
    status: 'Not Started',
    progress: 0,
    dependencies: ['DEL-011'],
    quantity: 1,
    unit: 'Project',
    notes: 'Pending installation completion',
  },
];

export default function DeliverablesListPage() {
  const [deliverables] = useState<Deliverable[]>(mockDeliverables);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Calculate statistics
  const stats = {
    total: deliverables.length,
    completed: deliverables.filter(d => d.status === 'Completed').length,
    inProgress: deliverables.filter(d => d.status === 'In Progress').length,
    delayed: deliverables.filter(d => d.status === 'Delayed').length,
    notStarted: deliverables.filter(d => d.status === 'Not Started').length,
  };

  // Filter deliverables
  const filteredDeliverables = deliverables.filter(deliverable => {
    const matchesSearch =
      deliverable.deliverableName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deliverable.deliverableNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deliverable.projectName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || deliverable.status === statusFilter;
    const matchesType = typeFilter === 'All' || deliverable.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  // Pagination
  const totalPages = Math.ceil(filteredDeliverables.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedDeliverables = filteredDeliverables.slice(startIndex, startIndex + itemsPerPage);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-700';
      case 'In Progress': return 'bg-blue-100 text-blue-700';
      case 'Delayed': return 'bg-red-100 text-red-700';
      case 'On Hold': return 'bg-yellow-100 text-yellow-700';
      case 'Not Started': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed': return <CheckCircle className="w-4 h-4" />;
      case 'In Progress': return <Clock className="w-4 h-4" />;
      case 'Delayed': return <AlertCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="w-full h-screen overflow-y-auto overflow-x-hidden">
      <div className="px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header Actions */}
      <div className="flex justify-end mb-4">
        <Link
          href="/project-management/deliverables/create"
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Deliverable
        </Link>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
            </div>
            <Package className="w-8 h-8 text-gray-400" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-green-900 mt-1">{stats.completed}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-blue-900 mt-1">{stats.inProgress}</p>
            </div>
            <Clock className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Delayed</p>
              <p className="text-2xl font-bold text-red-900 mt-1">{stats.delayed}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Not Started</p>
              <p className="text-2xl font-bold text-gray-600 mt-1">{stats.notStarted}</p>
            </div>
            <Clock className="w-8 h-8 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search deliverables..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="All">All Status</option>
            <option value="Not Started">Not Started</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Delayed">Delayed</option>
            <option value="On Hold">On Hold</option>
          </select>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="All">All Types</option>
            <option value="Equipment">Equipment</option>
            <option value="Installation">Installation</option>
            <option value="Documentation">Documentation</option>
            <option value="Training">Training</option>
            <option value="Service">Service</option>
          </select>
        </div>
      </div>

      {/* Deliverables List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="divide-y divide-gray-200">
          {paginatedDeliverables.map((deliverable) => (
            <div key={deliverable.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  {/* Icon */}
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Package className="w-6 h-6 text-blue-600" />
                  </div>

                  {/* Details */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {deliverable.deliverableName}
                      </h3>
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(deliverable.status)}`}>
                        {getStatusIcon(deliverable.status)}
                        {deliverable.status}
                      </span>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                        {deliverable.type}
                      </span>
                    </div>

                    <p className="text-sm text-gray-600 mb-3">{deliverable.description}</p>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-3">
                      <div>
                        <p className="text-xs text-gray-500">Deliverable #</p>
                        <p className="text-sm font-medium text-gray-900">{deliverable.deliverableNumber}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Project</p>
                        <p className="text-sm font-medium text-gray-900">{deliverable.projectNumber}</p>
                        <p className="text-xs text-gray-500">{deliverable.projectName}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Assigned To</p>
                        <div className="flex items-center gap-1 mt-1">
                          <User className="w-3 h-3 text-gray-400" />
                          <p className="text-sm font-medium text-gray-900">{deliverable.assignedTo}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Quantity</p>
                        <p className="text-sm font-medium text-gray-900">
                          {deliverable.quantity} {deliverable.unit}
                        </p>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-600">Progress</span>
                        <span className="text-xs font-medium text-gray-900">{deliverable.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all"
                          style={{ width: `${deliverable.progress}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Timeline */}
                    <div className="flex items-center gap-6 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">Planned:</span>
                        <span className="font-medium text-gray-900">{formatDate(deliverable.plannedDate)}</span>
                      </div>
                      {deliverable.actualDate && (
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-gray-600">Actual:</span>
                          <span className="font-medium text-green-900">{formatDate(deliverable.actualDate)}</span>
                        </div>
                      )}
                    </div>

                    {/* Dependencies */}
                    {deliverable.dependencies.length > 0 && (
                      <div className="mt-2">
                        <span className="text-xs text-gray-500">Dependencies: </span>
                        <span className="text-xs text-blue-600">{deliverable.dependencies.join(', ')}</span>
                      </div>
                    )}

                    {/* Notes */}
                    {deliverable.notes && (
                      <div className="mt-2 text-sm text-gray-600 italic">
                        Note: {deliverable.notes}
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 ml-4">
                  <Link
                    href={`/project-management/deliverables/view/${deliverable.id}`}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="View Details"
                  >
                    <Eye className="w-4 h-4" />
                  </Link>
                  <Link
                    href={`/project-management/deliverables/edit/${deliverable.id}`}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Edit className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredDeliverables.length)} of{' '}
            {filteredDeliverables.length} deliverables
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}

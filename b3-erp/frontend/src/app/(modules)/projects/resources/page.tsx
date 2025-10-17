'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Search, Eye, Edit, Users, UserCheck, UserX, Clock, Calendar, DollarSign, Download, Filter, ChevronLeft, ChevronRight, Briefcase } from 'lucide-react';

interface ResourceAllocation {
  id: string;
  projectCode: string;
  projectName: string;
  resourceName: string;
  role: string;
  department: string;
  allocatedHours: number;
  utilizedHours: number;
  allocation: number; // percentage
  startDate: string;
  endDate: string;
  status: 'active' | 'pending' | 'completed' | 'overloaded';
  costPerHour: number;
  skills: string[];
}

const mockResources: ResourceAllocation[] = [
  {
    id: 'RES-001',
    projectCode: 'PRJ-2025-001',
    projectName: 'Hotel Paradise Kitchen Setup',
    resourceName: 'Rajesh Kumar',
    role: 'Project Manager',
    department: 'Projects',
    allocatedHours: 320,
    utilizedHours: 210,
    allocation: 80,
    startDate: '2025-10-01',
    endDate: '2025-12-31',
    status: 'active',
    costPerHour: 2500,
    skills: ['Project Management', 'Team Leadership', 'Budgeting'],
  },
  {
    id: 'RES-002',
    projectCode: 'PRJ-2025-001',
    projectName: 'Hotel Paradise Kitchen Setup',
    resourceName: 'Amit Patel',
    role: 'Senior Technician',
    department: 'Technical',
    allocatedHours: 400,
    utilizedHours: 280,
    allocation: 100,
    startDate: '2025-10-05',
    endDate: '2025-12-20',
    status: 'overloaded',
    costPerHour: 1800,
    skills: ['Installation', 'Electrical', 'Plumbing'],
  },
  {
    id: 'RES-003',
    projectCode: 'PRJ-2025-002',
    projectName: 'City General Hospital Equipment',
    resourceName: 'Priya Sharma',
    role: 'Design Engineer',
    department: 'Engineering',
    allocatedHours: 240,
    utilizedHours: 45,
    allocation: 60,
    startDate: '2025-10-15',
    endDate: '2026-01-15',
    status: 'active',
    costPerHour: 2200,
    skills: ['CAD Design', 'Technical Drawings', 'BIM'],
  },
  {
    id: 'RES-004',
    projectCode: 'PRJ-2025-003',
    projectName: 'Culinary Institute Kitchen Lab',
    resourceName: 'Vikram Singh',
    role: 'Quality Inspector',
    department: 'Quality',
    allocatedHours: 160,
    utilizedHours: 125,
    allocation: 40,
    startDate: '2025-09-15',
    endDate: '2025-11-25',
    status: 'active',
    costPerHour: 1500,
    skills: ['Quality Control', 'Testing', 'Compliance'],
  },
  {
    id: 'RES-005',
    projectCode: 'PRJ-2025-004',
    projectName: 'Industrial Bakery Setup',
    resourceName: 'Neha Kulkarni',
    role: 'Procurement Specialist',
    department: 'Procurement',
    allocatedHours: 180,
    utilizedHours: 15,
    allocation: 45,
    startDate: '2025-11-01',
    endDate: '2026-02-28',
    status: 'pending',
    costPerHour: 1600,
    skills: ['Vendor Management', 'Negotiations', 'Supply Chain'],
  },
  {
    id: 'RES-006',
    projectCode: 'PRJ-2025-005',
    projectName: 'Restaurant Group Chain Expansion',
    resourceName: 'Sanjay Gupta',
    role: 'Site Supervisor',
    department: 'Operations',
    allocatedHours: 480,
    utilizedHours: 480,
    allocation: 100,
    startDate: '2025-08-15',
    endDate: '2025-10-30',
    status: 'completed',
    costPerHour: 1400,
    skills: ['Site Management', 'Safety', 'Coordination'],
  },
];

const statusColors = {
  active: 'bg-green-100 text-green-700',
  pending: 'bg-blue-100 text-blue-700',
  completed: 'bg-gray-100 text-gray-700',
  overloaded: 'bg-red-100 text-red-700',
};

export default function ResourcesPage() {
  const router = useRouter();
  const [resources, setResources] = useState<ResourceAllocation[]>(mockResources);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredResources = resources.filter((resource) => {
    const matchesSearch =
      resource.resourceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.role.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || resource.status === statusFilter;
    const matchesDepartment = departmentFilter === 'all' || resource.department === departmentFilter;
    return matchesSearch && matchesStatus && matchesDepartment;
  });

  const totalPages = Math.ceil(filteredResources.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedResources = filteredResources.slice(startIndex, startIndex + itemsPerPage);

  const departments = Array.from(new Set(resources.map(r => r.department)));

  const stats = {
    totalResources: resources.length,
    activeAllocations: resources.filter((r) => r.status === 'active').length,
    overloaded: resources.filter((r) => r.status === 'overloaded').length,
    avgUtilization: Math.round(
      resources.reduce((sum, r) => sum + (r.utilizedHours / r.allocatedHours) * 100, 0) / resources.length
    ),
  };

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  return (
    <div className="w-full min-h-screen px-4 sm:px-6 lg:px-8 py-6">
      {/* Stats */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Total Resources</p>
              <p className="text-2xl font-bold text-blue-900 mt-1">{stats.totalResources}</p>
            </div>
            <Users className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Active Allocations</p>
              <p className="text-2xl font-bold text-green-900 mt-1">{stats.activeAllocations}</p>
            </div>
            <UserCheck className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4 border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-600">Overloaded</p>
              <p className="text-2xl font-bold text-red-900 mt-1">{stats.overloaded}</p>
            </div>
            <UserX className="h-8 w-8 text-red-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">Avg Utilization</p>
              <p className="text-2xl font-bold text-purple-900 mt-1">{stats.avgUtilization}%</p>
            </div>
            <Briefcase className="h-8 w-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search resources, projects, or roles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="overloaded">Overloaded</option>
        </select>
        <select
          value={departmentFilter}
          onChange={(e) => setDepartmentFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Departments</option>
          {departments.map(dept => (
            <option key={dept} value={dept}>{dept}</option>
          ))}
        </select>
        <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
          <Download className="h-5 w-5" />
          <span>Export</span>
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto max-h-[calc(100vh-400px)] overflow-y-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Resource</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Project</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Allocation</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hours</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Period</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cost/Hour</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedResources.map((resource) => (
                <tr key={resource.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">{resource.resourceName}</div>
                    <div className="text-sm text-gray-700">{resource.role}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{resource.department}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">{resource.projectCode}</div>
                    <div className="text-sm text-gray-700">{resource.projectName}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm font-semibold text-gray-900">{resource.allocation}%</div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div
                        className={`h-2 rounded-full ${
                          resource.allocation > 100
                            ? 'bg-red-500'
                            : resource.allocation >= 80
                            ? 'bg-yellow-500'
                            : 'bg-green-500'
                        }`}
                        style={{ width: `${Math.min(resource.allocation, 100)}%` }}
                      ></div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm font-semibold text-gray-900">
                      {resource.utilizedHours} / {resource.allocatedHours}h
                    </div>
                    <div className="text-xs text-gray-500">
                      {Math.round((resource.utilizedHours / resource.allocatedHours) * 100)}% utilized
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center text-xs text-gray-600">
                      <Calendar className="h-3 w-3 mr-1" />
                      <span>{resource.startDate}</span>
                    </div>
                    <div className="flex items-center text-xs text-blue-600 mt-1">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>{resource.endDate}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm font-semibold text-gray-900">{formatCurrency(resource.costPerHour)}</div>
                    <div className="text-xs text-gray-500">per hour</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColors[resource.status]}`}>
                      {resource.status.charAt(0).toUpperCase() + resource.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => router.push(`/projects/resources/view/${resource.id}`)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => router.push(`/projects/resources/edit/${resource.id}`)}
                        className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredResources.length)} of {filteredResources.length} allocations
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-sm text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

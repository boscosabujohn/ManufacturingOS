'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Search,
  Plus,
  Users,
  Briefcase,
  CheckCircle,
  Clock,
  AlertCircle,
  TrendingUp,
  Calendar,
  Eye,
  Edit,
  Mail,
  Phone,
} from 'lucide-react';

interface Resource {
  id: string;
  employeeId: string;
  name: string;
  role: string;
  department: string;
  email: string;
  phone: string;
  skills: string[];
  currentProject: string;
  currentProjectId: string;
  allocation: number;
  availability: number;
  status: 'Available' | 'Partially Available' | 'Fully Allocated' | 'On Leave';
  totalProjects: number;
  completedProjects: number;
  efficiency: number;
  costRate: number;
  location: string;
  experienceYears: number;
}

const mockResources: Resource[] = [
  {
    id: '1',
    employeeId: 'EMP-001',
    name: 'Rajesh Kumar',
    role: 'Project Manager',
    department: 'Project Management',
    email: 'rajesh.kumar@b3macbis.com',
    phone: '+91-98765-43210',
    skills: ['Project Planning', 'Budgeting', 'Team Leadership', 'Client Management'],
    currentProject: 'Taj Hotel Commercial Kitchen',
    currentProjectId: 'PRJ-2024-001',
    allocation: 100,
    availability: 0,
    status: 'Fully Allocated',
    totalProjects: 15,
    completedProjects: 12,
    efficiency: 92,
    costRate: 3500,
    location: 'Mumbai',
    experienceYears: 12,
  },
  {
    id: '2',
    employeeId: 'EMP-002',
    name: 'Priya Sharma',
    role: 'Project Manager',
    department: 'Project Management',
    email: 'priya.sharma@b3macbis.com',
    phone: '+91-98765-43211',
    skills: ['Cold Room Projects', 'HVAC Systems', 'Vendor Management', 'Quality Control'],
    currentProject: 'BigBasket Cold Storage',
    currentProjectId: 'PRJ-2024-002',
    allocation: 100,
    availability: 0,
    status: 'Fully Allocated',
    totalProjects: 18,
    completedProjects: 15,
    efficiency: 95,
    costRate: 3800,
    location: 'Bangalore',
    experienceYears: 10,
  },
  {
    id: '3',
    employeeId: 'EMP-003',
    name: 'Amit Patel',
    role: 'Electrical Engineer',
    department: 'Engineering',
    email: 'amit.patel@b3macbis.com',
    phone: '+91-98765-43212',
    skills: ['Switchgear Design', 'Electrical Testing', 'Panel Assembly', 'AutoCAD'],
    currentProject: 'L&T Switchgear Panel',
    currentProjectId: 'PRJ-2024-003',
    allocation: 80,
    availability: 20,
    status: 'Partially Available',
    totalProjects: 22,
    completedProjects: 20,
    efficiency: 88,
    costRate: 2800,
    location: 'Pune',
    experienceYears: 8,
  },
  {
    id: '4',
    employeeId: 'EMP-004',
    name: 'Sunita Reddy',
    role: 'Senior Designer',
    department: 'Design',
    email: 'sunita.reddy@b3macbis.com',
    phone: '+91-98765-43213',
    skills: ['3D Modeling', 'Kitchen Design', 'Space Planning', 'SolidWorks'],
    currentProject: 'ITC Grand Kitchen',
    currentProjectId: 'PRJ-2024-004',
    allocation: 60,
    availability: 40,
    status: 'Partially Available',
    totalProjects: 25,
    completedProjects: 23,
    efficiency: 94,
    costRate: 2500,
    location: 'Delhi',
    experienceYears: 9,
  },
  {
    id: '5',
    employeeId: 'EMP-005',
    name: 'Vikram Singh',
    role: 'Installation Supervisor',
    department: 'Operations',
    email: 'vikram.singh@b3macbis.com',
    phone: '+91-98765-43214',
    skills: ['Site Management', 'Installation', 'Safety Compliance', 'Team Coordination'],
    currentProject: 'Godrej Cold Room',
    currentProjectId: 'PRJ-2024-005',
    allocation: 100,
    availability: 0,
    status: 'Fully Allocated',
    totalProjects: 30,
    completedProjects: 28,
    efficiency: 90,
    costRate: 2200,
    location: 'Hyderabad',
    experienceYears: 11,
  },
  {
    id: '6',
    employeeId: 'EMP-006',
    name: 'Manoj Kumar',
    role: 'Electrical Engineer',
    department: 'Engineering',
    email: 'manoj.kumar@b3macbis.com',
    phone: '+91-98765-43215',
    skills: ['HT Switchgear', 'Testing', 'Commissioning', 'Documentation'],
    currentProject: 'Siemens Switchgear',
    currentProjectId: 'PRJ-2024-006',
    allocation: 100,
    availability: 0,
    status: 'Fully Allocated',
    totalProjects: 16,
    completedProjects: 14,
    efficiency: 87,
    costRate: 3000,
    location: 'Bangalore',
    experienceYears: 7,
  },
  {
    id: '7',
    employeeId: 'EMP-007',
    name: 'Neha Gupta',
    role: 'Project Coordinator',
    department: 'Project Management',
    email: 'neha.gupta@b3macbis.com',
    phone: '+91-98765-43216',
    skills: ['Project Coordination', 'Documentation', 'Client Communication', 'MS Project'],
    currentProject: 'Prestige Modular Kitchen',
    currentProjectId: 'PRJ-2024-007',
    allocation: 70,
    availability: 30,
    status: 'Partially Available',
    totalProjects: 12,
    completedProjects: 10,
    efficiency: 91,
    costRate: 2000,
    location: 'Gurgaon',
    experienceYears: 5,
  },
  {
    id: '8',
    employeeId: 'EMP-008',
    name: 'Suresh Patel',
    role: 'Installation Technician',
    department: 'Operations',
    email: 'suresh.patel@b3macbis.com',
    phone: '+91-98765-43217',
    skills: ['Equipment Installation', 'Plumbing', 'Electrical Work', 'Troubleshooting'],
    currentProject: 'Taj Hotel Commercial Kitchen',
    currentProjectId: 'PRJ-2024-001',
    allocation: 100,
    availability: 0,
    status: 'Fully Allocated',
    totalProjects: 35,
    completedProjects: 33,
    efficiency: 89,
    costRate: 1800,
    location: 'Mumbai',
    experienceYears: 13,
  },
  {
    id: '9',
    employeeId: 'EMP-009',
    name: 'Anjali Verma',
    role: 'Quality Inspector',
    department: 'Quality Control',
    email: 'anjali.verma@b3macbis.com',
    phone: '+91-98765-43218',
    skills: ['Quality Auditing', 'ISO Standards', 'Inspection', 'Report Writing'],
    currentProject: '',
    currentProjectId: '',
    allocation: 0,
    availability: 100,
    status: 'Available',
    totalProjects: 20,
    completedProjects: 20,
    efficiency: 96,
    costRate: 2300,
    location: 'Chennai',
    experienceYears: 6,
  },
  {
    id: '10',
    employeeId: 'EMP-010',
    name: 'Deepak Joshi',
    role: 'Commissioning Engineer',
    department: 'Commissioning',
    email: 'deepak.joshi@b3macbis.com',
    phone: '+91-98765-43219',
    skills: ['Commissioning', 'Testing', 'Client Training', 'Documentation'],
    currentProject: 'Reliance Cold Chain',
    currentProjectId: 'PRJ-2024-009',
    allocation: 90,
    availability: 10,
    status: 'Partially Available',
    totalProjects: 18,
    completedProjects: 16,
    efficiency: 93,
    costRate: 2600,
    location: 'Ahmedabad',
    experienceYears: 8,
  },
  {
    id: '11',
    employeeId: 'EMP-011',
    name: 'Karan Malhotra',
    role: 'Site Supervisor',
    department: 'Operations',
    email: 'karan.malhotra@b3macbis.com',
    phone: '+91-98765-43220',
    skills: ['Site Management', 'Labor Coordination', 'Safety', 'Progress Tracking'],
    currentProject: '',
    currentProjectId: '',
    allocation: 0,
    availability: 100,
    status: 'Available',
    totalProjects: 14,
    completedProjects: 14,
    efficiency: 85,
    costRate: 2100,
    location: 'Noida',
    experienceYears: 7,
  },
  {
    id: '12',
    employeeId: 'EMP-012',
    name: 'Ramesh Nair',
    role: 'Civil Engineer',
    department: 'Engineering',
    email: 'ramesh.nair@b3macbis.com',
    phone: '+91-98765-43221',
    skills: ['Structural Design', 'Site Survey', 'Civil Work', 'AutoCAD'],
    currentProject: '',
    currentProjectId: '',
    allocation: 0,
    availability: 100,
    status: 'Available',
    totalProjects: 19,
    completedProjects: 18,
    efficiency: 88,
    costRate: 2400,
    location: 'Kochi',
    experienceYears: 10,
  },
];

export default function ResourcesListPage() {
  const [resources] = useState<Resource[]>(mockResources);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [roleFilter, setRoleFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Calculate statistics
  const stats = {
    total: resources.length,
    available: resources.filter(r => r.status === 'Available').length,
    fullyAllocated: resources.filter(r => r.status === 'Fully Allocated').length,
    partiallyAvailable: resources.filter(r => r.status === 'Partially Available').length,
    avgUtilization: Math.round(resources.reduce((sum, r) => sum + r.allocation, 0) / resources.length),
    avgEfficiency: Math.round(resources.reduce((sum, r) => sum + r.efficiency, 0) / resources.length),
  };

  // Filter resources
  const filteredResources = resources.filter(resource => {
    const matchesSearch =
      resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'All' || resource.status === statusFilter;
    const matchesRole = roleFilter === 'All' || resource.role === roleFilter;
    return matchesSearch && matchesStatus && matchesRole;
  });

  // Pagination
  const totalPages = Math.ceil(filteredResources.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedResources = filteredResources.slice(startIndex, startIndex + itemsPerPage);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available': return 'bg-green-100 text-green-700';
      case 'Partially Available': return 'bg-yellow-100 text-yellow-700';
      case 'Fully Allocated': return 'bg-blue-100 text-blue-700';
      case 'On Leave': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Available': return <CheckCircle className="w-4 h-4" />;
      case 'Partially Available': return <Clock className="w-4 h-4" />;
      case 'Fully Allocated': return <AlertCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const roles = Array.from(new Set(resources.map(r => r.role)));

  return (
    <div className="w-full min-h-screen px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header Actions */}
      <div className="flex justify-end mb-4">
        <Link
          href="/project-management/resources/add"
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Resource
        </Link>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Resources</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stats.total}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Available</p>
              <p className="text-3xl font-bold text-green-900 mt-1">{stats.available}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-sm text-gray-500">{stats.partiallyAvailable} partially available</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Utilization</p>
              <p className="text-3xl font-bold text-blue-900 mt-1">{stats.avgUtilization}%</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Efficiency</p>
              <p className="text-3xl font-bold text-purple-900 mt-1">{stats.avgEfficiency}%</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
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
                placeholder="Search by name, role, or skills..."
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
            <option value="Available">Available</option>
            <option value="Partially Available">Partially Available</option>
            <option value="Fully Allocated">Fully Allocated</option>
            <option value="On Leave">On Leave</option>
          </select>

          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="All">All Roles</option>
            {roles.map(role => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Resources List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="divide-y divide-gray-200">
          {paginatedResources.map((resource) => (
            <div key={resource.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  {/* Avatar */}
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0 text-white text-xl font-bold">
                    {resource.name.split(' ').map(n => n[0]).join('')}
                  </div>

                  {/* Details */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{resource.name}</h3>
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(resource.status)}`}>
                        {getStatusIcon(resource.status)}
                        {resource.status}
                      </span>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                        {resource.employeeId}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-3">
                      <div>
                        <p className="text-xs text-gray-500">Role</p>
                        <div className="flex items-center gap-1 mt-1">
                          <Briefcase className="w-3 h-3 text-gray-400" />
                          <p className="text-sm font-medium text-gray-900">{resource.role}</p>
                        </div>
                        <p className="text-xs text-gray-500">{resource.department}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Experience</p>
                        <p className="text-sm font-medium text-gray-900 mt-1">{resource.experienceYears} years</p>
                        <p className="text-xs text-gray-500">{resource.location}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Projects</p>
                        <p className="text-sm font-medium text-gray-900 mt-1">
                          {resource.completedProjects}/{resource.totalProjects} completed
                        </p>
                        <p className="text-xs text-green-600">Efficiency: {resource.efficiency}%</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Cost Rate</p>
                        <p className="text-sm font-medium text-gray-900 mt-1">{formatCurrency(resource.costRate)}/day</p>
                      </div>
                    </div>

                    {/* Allocation Progress */}
                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-600">Current Allocation</span>
                        <span className="text-xs font-medium text-gray-900">
                          {resource.allocation}% allocated · {resource.availability}% available
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            resource.allocation === 100 ? 'bg-red-500' :
                            resource.allocation >= 70 ? 'bg-yellow-500' :
                            'bg-green-500'
                          }`}
                          style={{ width: `${resource.allocation}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Current Project */}
                    {resource.currentProject && (
                      <div className="mb-3 bg-blue-50 rounded-lg p-3">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-blue-600" />
                          <span className="text-xs text-gray-600">Current Project:</span>
                          <Link
                            href={`/project-management/view/${resource.currentProjectId}`}
                            className="text-sm font-medium text-blue-600 hover:text-blue-700"
                          >
                            {resource.currentProject}
                          </Link>
                        </div>
                      </div>
                    )}

                    {/* Skills */}
                    <div className="mb-3">
                      <p className="text-xs text-gray-500 mb-2">Skills</p>
                      <div className="flex flex-wrap gap-2">
                        {resource.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Contact */}
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1 text-gray-600">
                        <Mail className="w-4 h-4" />
                        <a href={`mailto:${resource.email}`} className="hover:text-blue-600">
                          {resource.email}
                        </a>
                      </div>
                      <div className="flex items-center gap-1 text-gray-600">
                        <Phone className="w-4 h-4" />
                        <a href={`tel:${resource.phone}`} className="hover:text-blue-600">
                          {resource.phone}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 ml-4">
                  <Link
                    href={`/project-management/resources/view/${resource.id}`}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="View Details"
                  >
                    <Eye className="w-4 h-4" />
                  </Link>
                  <Link
                    href={`/project-management/resources/edit/${resource.id}`}
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
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredResources.length)} of{' '}
            {filteredResources.length} resources
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
  );
}

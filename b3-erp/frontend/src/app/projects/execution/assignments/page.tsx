'use client';

import { useMemo, useState } from 'react';
import { UserPlus, Search, Filter, PlusCircle, Users, Calendar, Clock, AlertTriangle, CheckCircle2, User } from 'lucide-react';

type Assignment = {
  id: string;
  assignmentNumber: string;
  taskCode: string;
  taskName: string;
  projectCode: string;
  projectName: string;
  resourceName: string;
  resourceRole: string;
  department: string;
  assignedBy: string;
  assignedDate: string;
  startDate: string;
  endDate: string;
  estimatedHours: number;
  actualHours: number;
  status: 'assigned' | 'in-progress' | 'completed' | 'on-hold' | 'reassigned';
  priority: 'critical' | 'high' | 'medium' | 'low';
  utilizationPercent: number;
  notes: string;
};

const ASSIGNMENTS: Assignment[] = [
  {
    id: '1',
    assignmentNumber: 'ASG-1001',
    taskCode: 'TSK-101',
    taskName: 'Kitchen Cabinet Installation - Unit A1',
    projectCode: 'KF-A',
    projectName: 'Kitchen Fitout - Tower A',
    resourceName: 'Sara Ali',
    resourceRole: 'Installer',
    department: 'Installation',
    assignedBy: 'Amit Singh',
    assignedDate: '2025-10-15',
    startDate: '2025-10-20',
    endDate: '2025-10-24',
    estimatedHours: 32,
    actualHours: 28,
    status: 'completed',
    priority: 'high',
    utilizationPercent: 87,
    notes: 'Completed ahead of schedule'
  },
  {
    id: '2',
    assignmentNumber: 'ASG-1002',
    taskCode: 'TSK-205',
    taskName: 'Wardrobe Design Review',
    projectCode: 'LVW-09',
    projectName: 'Luxury Villa Wardrobes',
    resourceName: 'Priya Patel',
    resourceRole: 'Designer',
    department: 'Design',
    assignedBy: 'Rahul Kumar',
    assignedDate: '2025-10-18',
    startDate: '2025-10-22',
    endDate: '2025-10-26',
    estimatedHours: 24,
    actualHours: 18,
    status: 'in-progress',
    priority: 'high',
    utilizationPercent: 75,
    notes: 'Client feedback pending'
  },
  {
    id: '3',
    assignmentNumber: 'ASG-1003',
    taskCode: 'TSK-312',
    taskName: 'Pantry Counter Assembly',
    projectCode: 'CPR-12',
    projectName: 'Corporate Pantry Rollout',
    resourceName: 'Vikram Reddy',
    resourceRole: 'Assembler',
    department: 'Production',
    assignedBy: 'Amit Singh',
    assignedDate: '2025-10-20',
    startDate: '2025-10-25',
    endDate: '2025-10-29',
    estimatedHours: 40,
    actualHours: 35,
    status: 'in-progress',
    priority: 'medium',
    utilizationPercent: 87,
    notes: 'Material delay resolved'
  },
  {
    id: '4',
    assignmentNumber: 'ASG-1004',
    taskCode: 'TSK-418',
    taskName: 'Quality Inspection - Showroom Units',
    projectCode: 'SR-08',
    projectName: 'Showroom Refurbishment',
    resourceName: 'Anjali Sharma',
    resourceRole: 'QC Inspector',
    department: 'Quality',
    assignedBy: 'Priya Patel',
    assignedDate: '2025-10-21',
    startDate: '2025-10-27',
    endDate: '2025-10-30',
    estimatedHours: 16,
    actualHours: 0,
    status: 'assigned',
    priority: 'critical',
    utilizationPercent: 0,
    notes: 'Awaiting unit completion'
  },
  {
    id: '5',
    assignmentNumber: 'ASG-1005',
    taskCode: 'TSK-527',
    taskName: 'Electrical Wiring - Kitchen Area',
    projectCode: 'KF-A',
    projectName: 'Kitchen Fitout - Tower A',
    resourceName: 'Karthik Iyer',
    resourceRole: 'Electrician',
    department: 'Installation',
    assignedBy: 'Rahul Kumar',
    assignedDate: '2025-10-19',
    startDate: '2025-10-23',
    endDate: '2025-10-27',
    estimatedHours: 28,
    actualHours: 12,
    status: 'in-progress',
    priority: 'high',
    utilizationPercent: 43,
    notes: 'Site access restricted on weekends'
  },
  {
    id: '6',
    assignmentNumber: 'ASG-1006',
    taskCode: 'TSK-634',
    taskName: 'Material Procurement Coordination',
    projectCode: 'LVW-09',
    projectName: 'Luxury Villa Wardrobes',
    resourceName: 'Neha Gupta',
    resourceRole: 'Procurement Officer',
    department: 'Procurement',
    assignedBy: 'Amit Singh',
    assignedDate: '2025-10-17',
    startDate: '2025-10-21',
    endDate: '2025-10-25',
    estimatedHours: 20,
    actualHours: 0,
    status: 'on-hold',
    priority: 'medium',
    utilizationPercent: 0,
    notes: 'Waiting for budget approval'
  },
  {
    id: '7',
    assignmentNumber: 'ASG-1007',
    taskCode: 'TSK-741',
    taskName: 'Site Survey & Measurements',
    projectCode: 'CPR-12',
    projectName: 'Corporate Pantry Rollout',
    resourceName: 'Arjun Nair',
    resourceRole: 'Site Engineer',
    department: 'Engineering',
    assignedBy: 'Priya Patel',
    assignedDate: '2025-10-16',
    startDate: '2025-10-19',
    endDate: '2025-10-21',
    estimatedHours: 16,
    actualHours: 16,
    status: 'completed',
    priority: 'high',
    utilizationPercent: 100,
    notes: 'Survey report submitted'
  },
  {
    id: '8',
    assignmentNumber: 'ASG-1008',
    taskCode: 'TSK-852',
    taskName: 'CAD Drawing Updates',
    projectCode: 'SR-08',
    projectName: 'Showroom Refurbishment',
    resourceName: 'Priya Patel',
    resourceRole: 'Designer',
    department: 'Design',
    assignedBy: 'Rahul Kumar',
    assignedDate: '2025-10-22',
    startDate: '2025-10-28',
    endDate: '2025-11-02',
    estimatedHours: 36,
    actualHours: 0,
    status: 'assigned',
    priority: 'medium',
    utilizationPercent: 0,
    notes: 'Client revisions received'
  },
  {
    id: '9',
    assignmentNumber: 'ASG-1009',
    taskCode: 'TSK-963',
    taskName: 'Final Finishing & Polishing',
    projectCode: 'KF-A',
    projectName: 'Kitchen Fitout - Tower A',
    resourceName: 'Deepak Singh',
    resourceRole: 'Finisher',
    department: 'Production',
    assignedBy: 'Amit Singh',
    assignedDate: '2025-10-20',
    startDate: '2025-10-26',
    endDate: '2025-10-30',
    estimatedHours: 32,
    actualHours: 8,
    status: 'in-progress',
    priority: 'high',
    utilizationPercent: 25,
    notes: 'Weather-dependent work'
  },
  {
    id: '10',
    assignmentNumber: 'ASG-1010',
    taskCode: 'TSK-1074',
    taskName: 'Hardware Installation',
    projectCode: 'LVW-09',
    projectName: 'Luxury Villa Wardrobes',
    resourceName: 'Ravi Menon',
    resourceRole: 'Installer',
    department: 'Installation',
    assignedBy: 'Priya Patel',
    assignedDate: '2025-10-23',
    startDate: '2025-10-29',
    endDate: '2025-11-02',
    estimatedHours: 24,
    actualHours: 0,
    status: 'assigned',
    priority: 'medium',
    utilizationPercent: 0,
    notes: 'Hardware shipment in transit'
  },
  {
    id: '11',
    assignmentNumber: 'ASG-1011',
    taskCode: 'TSK-1185',
    taskName: 'Client Presentation Prep',
    projectCode: 'SR-08',
    projectName: 'Showroom Refurbishment',
    resourceName: 'Meera Kapoor',
    resourceRole: 'Project Coordinator',
    department: 'Projects',
    assignedBy: 'Rahul Kumar',
    assignedDate: '2025-10-24',
    startDate: '2025-10-30',
    endDate: '2025-11-01',
    estimatedHours: 12,
    actualHours: 0,
    status: 'assigned',
    priority: 'low',
    utilizationPercent: 0,
    notes: 'Mock-up photos required'
  },
  {
    id: '12',
    assignmentNumber: 'ASG-1012',
    taskCode: 'TSK-1296',
    taskName: 'Safety Audit & Compliance Check',
    projectCode: 'CPR-12',
    projectName: 'Corporate Pantry Rollout',
    resourceName: 'Suresh Kumar',
    resourceRole: 'Safety Officer',
    department: 'Safety',
    assignedBy: 'Amit Singh',
    assignedDate: '2025-10-21',
    startDate: '2025-10-24',
    endDate: '2025-10-26',
    estimatedHours: 16,
    actualHours: 16,
    status: 'completed',
    priority: 'critical',
    utilizationPercent: 100,
    notes: 'All safety protocols verified'
  },
  {
    id: '13',
    assignmentNumber: 'ASG-1013',
    taskCode: 'TSK-1307',
    taskName: 'Vendor Coordination Meeting',
    projectCode: 'KF-A',
    projectName: 'Kitchen Fitout - Tower A',
    resourceName: 'Geeta Rao',
    resourceRole: 'Vendor Manager',
    department: 'Procurement',
    assignedBy: 'Priya Patel',
    assignedDate: '2025-10-18',
    startDate: '2025-10-22',
    endDate: '2025-10-22',
    estimatedHours: 4,
    actualHours: 0,
    status: 'reassigned',
    priority: 'medium',
    utilizationPercent: 0,
    notes: 'Reassigned to Neha Gupta'
  },
  {
    id: '14',
    assignmentNumber: 'ASG-1014',
    taskCode: 'TSK-1418',
    taskName: 'Plumbing & Water Supply Installation',
    projectCode: 'LVW-09',
    projectName: 'Luxury Villa Wardrobes',
    resourceName: 'Mohammad Ali',
    resourceRole: 'Plumber',
    department: 'Installation',
    assignedBy: 'Rahul Kumar',
    assignedDate: '2025-10-19',
    startDate: '2025-10-23',
    endDate: '2025-10-27',
    estimatedHours: 28,
    actualHours: 22,
    status: 'in-progress',
    priority: 'high',
    utilizationPercent: 79,
    notes: 'Additional fittings required'
  },
  {
    id: '15',
    assignmentNumber: 'ASG-1015',
    taskCode: 'TSK-1529',
    taskName: 'Documentation & Handover Prep',
    projectCode: 'SR-08',
    projectName: 'Showroom Refurbishment',
    resourceName: 'Lakshmi Iyer',
    resourceRole: 'Documentation Specialist',
    department: 'Administration',
    assignedBy: 'Amit Singh',
    assignedDate: '2025-10-25',
    startDate: '2025-11-01',
    endDate: '2025-11-05',
    estimatedHours: 20,
    actualHours: 0,
    status: 'assigned',
    priority: 'low',
    utilizationPercent: 0,
    notes: 'Awaiting project completion'
  }
];

export default function TaskAssignmentsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'assigned' | 'in-progress' | 'completed' | 'on-hold' | 'reassigned'>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'critical' | 'high' | 'medium' | 'low'>('all');
  const [deptFilter, setDeptFilter] = useState<string>('all');

  const departments = useMemo(() => ['all', ...Array.from(new Set(ASSIGNMENTS.map(a => a.department)))], []);

  const filtered = useMemo(() => {
    return ASSIGNMENTS.filter(a => {
      const matchesSearch = [
        a.assignmentNumber,
        a.taskCode,
        a.taskName,
        a.resourceName,
        a.resourceRole,
        a.projectName,
        a.projectCode,
        a.department
      ].some(v => v.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesStatus = statusFilter === 'all' ? true : a.status === statusFilter;
      const matchesPriority = priorityFilter === 'all' ? true : a.priority === priorityFilter;
      const matchesDept = deptFilter === 'all' ? true : a.department === deptFilter;
      return matchesSearch && matchesStatus && matchesPriority && matchesDept;
    });
  }, [searchTerm, statusFilter, priorityFilter, deptFilter]);

  // Calculate stats
  const totalAssignments = ASSIGNMENTS.length;
  const activeAssignments = ASSIGNMENTS.filter(a => a.status === 'in-progress' || a.status === 'assigned').length;
  const completedAssignments = ASSIGNMENTS.filter(a => a.status === 'completed').length;
  const totalEstimated = ASSIGNMENTS.reduce((sum, a) => sum + a.estimatedHours, 0);
  const totalActual = ASSIGNMENTS.reduce((sum, a) => sum + a.actualHours, 0);
  const avgUtilization = Math.round(ASSIGNMENTS.reduce((sum, a) => sum + a.utilizationPercent, 0) / ASSIGNMENTS.length);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          <UserPlus className="h-8 w-8 text-teal-600" />
          Task Assignments
        </h1>
        <p className="text-gray-600 mt-2">Assign and manage resource allocation to project tasks</p>
      </div>

      {/* Action Bar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search assignments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
              <Filter className="h-4 w-4" />
              Filter
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700">
              <PlusCircle className="h-4 w-4" />
              New Assignment
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
        <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-lg p-6 border border-teal-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-teal-600 text-sm font-medium">Total Assignments</p>
              <p className="text-3xl font-bold text-teal-900 mt-1">{totalAssignments}</p>
            </div>
            <UserPlus className="h-12 w-12 text-teal-600 opacity-50" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">Active</p>
              <p className="text-3xl font-bold text-blue-900 mt-1">{activeAssignments}</p>
            </div>
            <Users className="h-12 w-12 text-blue-600 opacity-50" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">Completed</p>
              <p className="text-3xl font-bold text-green-900 mt-1">{completedAssignments}</p>
            </div>
            <CheckCircle2 className="h-12 w-12 text-green-600 opacity-50" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 text-sm font-medium">Estimated Hours</p>
              <p className="text-3xl font-bold text-purple-900 mt-1">{totalEstimated}</p>
            </div>
            <Clock className="h-12 w-12 text-purple-600 opacity-50" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-6 border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-600 text-sm font-medium">Actual Hours</p>
              <p className="text-3xl font-bold text-orange-900 mt-1">{totalActual}</p>
            </div>
            <Clock className="h-12 w-12 text-orange-600 opacity-50" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg p-6 border border-indigo-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-indigo-600 text-sm font-medium">Avg Utilization</p>
              <p className="text-3xl font-bold text-indigo-900 mt-1">{avgUtilization}%</p>
            </div>
            <Users className="h-12 w-12 text-indigo-600 opacity-50" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="flex items-center gap-2 mr-auto">
            <Filter className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">Filters</span>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="all">All Status</option>
            <option value="assigned">Assigned</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="on-hold">On Hold</option>
            <option value="reassigned">Reassigned</option>
          </select>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="all">All Priorities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            {departments.map(d => (
              <option key={d} value={d}>{d === 'all' ? 'All Departments' : d}</option>
            ))}
          </select>
          <button
            onClick={() => {
              setSearchTerm('');
              setStatusFilter('all');
              setPriorityFilter('all');
              setDeptFilter('all');
            }}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Assignments table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Assignment</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Task</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Resource</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Project</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Duration</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Effort</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Utilization</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Priority</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {filtered.map(a => (
                <tr key={a.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-900">{a.assignmentNumber}</span>
                      <span className="text-xs text-gray-500">by {a.assignedBy}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-800">{a.taskName}</span>
                      <span className="text-xs text-gray-500">{a.taskCode}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-900">{a.resourceName}</span>
                        <span className="text-xs text-gray-500">{a.resourceRole} • {a.department}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    <div className="flex flex-col">
                      <span className="font-medium">{a.projectName}</span>
                      <span className="text-xs text-gray-500">{a.projectCode}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <div className="flex flex-col">
                        <span className="text-xs">{a.startDate}</span>
                        <span className="text-xs text-gray-500">to {a.endDate}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col text-sm">
                      <span className="text-gray-900">{a.actualHours}h / {a.estimatedHours}h</span>
                      <span className="text-xs text-gray-500">
                        {a.estimatedHours > 0 ? Math.round((a.actualHours / a.estimatedHours) * 100) : 0}% complete
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="w-32">
                      <div className="h-2 w-full bg-gray-100 rounded">
                        <div
                          className={`h-2 rounded ${
                            a.utilizationPercent >= 85
                              ? 'bg-green-600'
                              : a.utilizationPercent >= 50
                              ? 'bg-blue-600'
                              : 'bg-yellow-500'
                          }`}
                          style={{ width: `${Math.min(a.utilizationPercent, 100)}%` }}
                        />
                      </div>
                      <div className="mt-1 text-xs text-gray-600">{a.utilizationPercent}%</div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        a.priority === 'critical'
                          ? 'bg-red-50 text-red-700'
                          : a.priority === 'high'
                          ? 'bg-orange-50 text-orange-700'
                          : a.priority === 'medium'
                          ? 'bg-blue-50 text-blue-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {a.priority}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        a.status === 'completed'
                          ? 'bg-green-50 text-green-700'
                          : a.status === 'in-progress'
                          ? 'bg-blue-50 text-blue-700'
                          : a.status === 'on-hold'
                          ? 'bg-yellow-50 text-yellow-700'
                          : a.status === 'reassigned'
                          ? 'bg-purple-50 text-purple-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {a.status}
                    </span>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-gray-500">
                    No assignments found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Guidelines */}
      <div className="mt-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-blue-600" />
          Resource Assignment Guidelines
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">Assignment Best Practices:</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>Match resource skills to task requirements</li>
              <li>Consider current workload before assignment</li>
              <li>Set realistic effort estimates</li>
              <li>Communicate clearly with resources</li>
              <li>Monitor utilization levels (target 70-85%)</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">Utilization Guidelines:</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>0-50%: Under-utilized, can take more work</li>
              <li>50-70%: Good utilization, room for flexibility</li>
              <li>70-85%: Optimal utilization range</li>
              <li>85-100%: High utilization, monitor for burnout</li>
              <li>&gt;100%: Over-allocated, reassign or reschedule</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

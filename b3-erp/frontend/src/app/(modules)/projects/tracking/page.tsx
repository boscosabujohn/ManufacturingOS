'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Search, Eye, TrendingUp, BarChart3, Calendar, Clock, AlertTriangle, CheckCircle2, Download, Filter, ChevronLeft, ChevronRight, Activity } from 'lucide-react';

interface ProjectTracking {
  id: string;
  projectCode: string;
  projectName: string;
  client: string;
  startDate: string;
  dueDate: string;
  progressPercentage: number;
  status: 'on_track' | 'at_risk' | 'delayed' | 'completed';
  currentPhase: string;
  tasksCompleted: number;
  totalTasks: number;
  budgetUsed: number;
  budgetAllocated: number;
  hoursSpent: number;
  hoursEstimated: number;
  issuesOpen: number;
  lastUpdate: string;
}

const mockTracking: ProjectTracking[] = [
  {
    id: 'TRK-001',
    projectCode: 'PRJ-2025-001',
    projectName: 'Hotel Paradise Kitchen Setup',
    client: 'Hotel Paradise Ltd',
    startDate: '2025-10-01',
    dueDate: '2025-12-31',
    progressPercentage: 65,
    status: 'on_track',
    currentPhase: 'Installation & Setup',
    tasksCompleted: 45,
    totalTasks: 68,
    budgetUsed: 42000000,
    budgetAllocated: 45000000,
    hoursSpent: 1560,
    hoursEstimated: 2400,
    issuesOpen: 3,
    lastUpdate: '2025-10-15',
  },
  {
    id: 'TRK-002',
    projectCode: 'PRJ-2025-002',
    projectName: 'City General Hospital Equipment',
    client: 'City General Hospital',
    startDate: '2025-10-15',
    dueDate: '2026-02-28',
    progressPercentage: 15,
    status: 'at_risk',
    currentPhase: 'Planning & Design',
    tasksCompleted: 18,
    totalTasks: 120,
    budgetUsed: 5000000,
    budgetAllocated: 78000000,
    hoursSpent: 720,
    hoursEstimated: 4800,
    issuesOpen: 8,
    lastUpdate: '2025-10-16',
  },
  {
    id: 'TRK-003',
    projectCode: 'PRJ-2025-003',
    projectName: 'Culinary Institute Kitchen Lab',
    client: 'Springfield Academy',
    startDate: '2025-09-01',
    dueDate: '2025-11-30',
    progressPercentage: 80,
    status: 'on_track',
    currentPhase: 'Final Testing',
    tasksCompleted: 48,
    totalTasks: 60,
    budgetUsed: 26500000,
    budgetAllocated: 28000000,
    hoursSpent: 1440,
    hoursEstimated: 1800,
    issuesOpen: 2,
    lastUpdate: '2025-10-14',
  },
  {
    id: 'TRK-004',
    projectCode: 'PRJ-2025-004',
    projectName: 'Industrial Bakery Setup',
    client: 'Artisan Bakers Co',
    startDate: '2025-11-01',
    dueDate: '2026-03-31',
    progressPercentage: 5,
    status: 'delayed',
    currentPhase: 'Resource Allocation',
    tasksCompleted: 7,
    totalTasks: 150,
    budgetUsed: 8000000,
    budgetAllocated: 95000000,
    hoursSpent: 300,
    hoursEstimated: 6000,
    issuesOpen: 12,
    lastUpdate: '2025-10-12',
  },
  {
    id: 'TRK-005',
    projectCode: 'PRJ-2025-005',
    projectName: 'Restaurant Group Chain Expansion',
    client: 'Restaurant Group LLC',
    startDate: '2025-08-15',
    dueDate: '2025-10-30',
    progressPercentage: 100,
    status: 'completed',
    currentPhase: 'Handover Complete',
    tasksCompleted: 100,
    totalTasks: 100,
    budgetUsed: 51000000,
    budgetAllocated: 52000000,
    hoursSpent: 3100,
    hoursEstimated: 3200,
    issuesOpen: 0,
    lastUpdate: '2025-10-11',
  },
];

const statusColors = {
  on_track: 'bg-green-100 text-green-700',
  at_risk: 'bg-yellow-100 text-yellow-700',
  delayed: 'bg-red-100 text-red-700',
  completed: 'bg-blue-100 text-blue-700',
};

export default function ProgressTrackingPage() {
  const router = useRouter();
  const [tracking, setTracking] = useState<ProjectTracking[]>(mockTracking);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredTracking = tracking.filter((item) => {
    const matchesSearch =
      item.projectCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.client.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredTracking.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTracking = filteredTracking.slice(startIndex, startIndex + itemsPerPage);

  const stats = {
    totalProjects: tracking.length,
    onTrack: tracking.filter((t) => t.status === 'on_track').length,
    atRisk: tracking.filter((t) => t.status === 'at_risk').length,
    delayed: tracking.filter((t) => t.status === 'delayed').length,
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)} Cr`;
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)} L`;
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  return (
    <div className="w-full min-h-screen px-4 sm:px-6 lg:px-8 py-6">
      {/* Stats */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Total Projects</p>
              <p className="text-2xl font-bold text-blue-900 mt-1">{stats.totalProjects}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">On Track</p>
              <p className="text-2xl font-bold text-green-900 mt-1">{stats.onTrack}</p>
            </div>
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4 border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-600">At Risk</p>
              <p className="text-2xl font-bold text-yellow-900 mt-1">{stats.atRisk}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4 border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-600">Delayed</p>
              <p className="text-2xl font-bold text-red-900 mt-1">{stats.delayed}</p>
            </div>
            <Clock className="h-8 w-8 text-red-600" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search projects..."
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
          <option value="on_track">On Track</option>
          <option value="at_risk">At Risk</option>
          <option value="delayed">Delayed</option>
          <option value="completed">Completed</option>
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
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Project</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phase & Progress</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tasks</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Budget</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hours</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Issues</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedTracking.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">{item.projectCode}</div>
                    <div className="text-sm text-gray-700">{item.projectName}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{item.client}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm font-medium text-gray-900">{item.currentPhase}</div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div
                        className={`h-2 rounded-full ${
                          item.progressPercentage === 100
                            ? 'bg-green-500'
                            : item.progressPercentage >= 50
                            ? 'bg-blue-500'
                            : 'bg-yellow-500'
                        }`}
                        style={{ width: `${item.progressPercentage}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{item.progressPercentage}% Complete</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm font-semibold text-gray-900">
                      {item.tasksCompleted}/{item.totalTasks}
                    </div>
                    <div className="text-xs text-gray-500">
                      {Math.round((item.tasksCompleted / item.totalTasks) * 100)}% done
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm font-semibold text-gray-900">{formatCurrency(item.budgetUsed)}</div>
                    <div className="text-xs text-gray-500">of {formatCurrency(item.budgetAllocated)}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm font-semibold text-gray-900">{item.hoursSpent}h</div>
                    <div className="text-xs text-gray-500">of {item.hoursEstimated}h</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className={`text-sm font-semibold ${item.issuesOpen > 5 ? 'text-red-600' : 'text-gray-900'}`}>
                      {item.issuesOpen}
                    </div>
                    <div className="text-xs text-gray-500">open</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColors[item.status]}`}>
                      {item.status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => router.push(`/projects/tracking/view/${item.id}`)}
                      className="flex items-center space-x-1 px-3 py-1.5 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-sm font-medium"
                    >
                      <Eye className="h-4 w-4" />
                      <span>View</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredTracking.length)} of {filteredTracking.length} projects
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

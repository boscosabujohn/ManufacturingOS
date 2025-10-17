'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Search, Eye, Edit, Wrench, CheckCircle, XCircle, Clock, Calendar, MapPin, Download, Filter, ChevronLeft, ChevronRight, Tool, FileText } from 'lucide-react';

interface Commissioning {
  id: string;
  projectCode: string;
  projectName: string;
  siteLocation: string;
  commissioningDate: string;
  commissioningEngineer: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'failed' | 'rescheduled';
  testsPassed: number;
  totalTests: number;
  equipmentCount: number;
  commissionedEquipment: number;
  issuesFound: number;
  resolvedIssues: number;
  clientRepresentative: string;
  documentStatus: 'pending' | 'partial' | 'complete';
  handoverDate?: string;
}

const mockCommissioning: Commissioning[] = [
  {
    id: 'COM-001',
    projectCode: 'PRJ-2025-001',
    projectName: 'Hotel Paradise Kitchen Setup',
    siteLocation: 'Mumbai, Maharashtra',
    commissioningDate: '2025-12-15',
    commissioningEngineer: 'Amit Patel',
    status: 'scheduled',
    testsPassed: 0,
    totalTests: 25,
    equipmentCount: 15,
    commissionedEquipment: 0,
    issuesFound: 0,
    resolvedIssues: 0,
    clientRepresentative: 'Rajesh Sharma',
    documentStatus: 'pending',
  },
  {
    id: 'COM-002',
    projectCode: 'PRJ-2025-002',
    projectName: 'City General Hospital Equipment',
    siteLocation: 'Bangalore, Karnataka',
    commissioningDate: '2026-02-20',
    commissioningEngineer: 'Priya Sharma',
    status: 'scheduled',
    testsPassed: 0,
    totalTests: 40,
    equipmentCount: 25,
    commissionedEquipment: 0,
    issuesFound: 0,
    resolvedIssues: 0,
    clientRepresentative: 'Suresh Menon',
    documentStatus: 'pending',
  },
  {
    id: 'COM-003',
    projectCode: 'PRJ-2025-003',
    projectName: 'Culinary Institute Kitchen Lab',
    siteLocation: 'Delhi NCR',
    commissioningDate: '2025-11-20',
    commissioningEngineer: 'Vikram Singh',
    status: 'in_progress',
    testsPassed: 12,
    totalTests: 18,
    equipmentCount: 12,
    commissionedEquipment: 8,
    issuesFound: 5,
    resolvedIssues: 3,
    clientRepresentative: 'Archana Iyer',
    documentStatus: 'partial',
  },
  {
    id: 'COM-004',
    projectCode: 'PRJ-2025-004',
    projectName: 'Industrial Bakery Setup',
    siteLocation: 'Pune, Maharashtra',
    commissioningDate: '2026-03-10',
    commissioningEngineer: 'Neha Kulkarni',
    status: 'scheduled',
    testsPassed: 0,
    totalTests: 50,
    equipmentCount: 35,
    commissionedEquipment: 0,
    issuesFound: 0,
    resolvedIssues: 0,
    clientRepresentative: 'Vijay Singh',
    documentStatus: 'pending',
  },
  {
    id: 'COM-005',
    projectCode: 'PRJ-2025-005',
    projectName: 'Restaurant Group Chain Expansion',
    siteLocation: 'Hyderabad, Telangana',
    commissioningDate: '2025-10-25',
    commissioningEngineer: 'Sanjay Gupta',
    status: 'completed',
    testsPassed: 30,
    totalTests: 30,
    equipmentCount: 20,
    commissionedEquipment: 20,
    issuesFound: 8,
    resolvedIssues: 8,
    clientRepresentative: 'Karthik Reddy',
    documentStatus: 'complete',
    handoverDate: '2025-10-30',
  },
];

const statusColors = {
  scheduled: 'bg-blue-100 text-blue-700',
  in_progress: 'bg-yellow-100 text-yellow-700',
  completed: 'bg-green-100 text-green-700',
  failed: 'bg-red-100 text-red-700',
  rescheduled: 'bg-orange-100 text-orange-700',
};

const documentStatusColors = {
  pending: 'bg-gray-100 text-gray-700',
  partial: 'bg-yellow-100 text-yellow-700',
  complete: 'bg-green-100 text-green-700',
};

export default function CommissioningPage() {
  const router = useRouter();
  const [commissioning, setCommissioning] = useState<Commissioning[]>(mockCommissioning);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredCommissioning = commissioning.filter((item) => {
    const matchesSearch =
      item.projectCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.siteLocation.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredCommissioning.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCommissioning = filteredCommissioning.slice(startIndex, startIndex + itemsPerPage);

  const stats = {
    totalActivities: commissioning.length,
    inProgress: commissioning.filter((c) => c.status === 'in_progress').length,
    completed: commissioning.filter((c) => c.status === 'completed').length,
    scheduled: commissioning.filter((c) => c.status === 'scheduled').length,
  };

  return (
    <div className="w-full min-h-screen px-4 sm:px-6 lg:px-8 py-6">
      {/* Stats */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Total Activities</p>
              <p className="text-2xl font-bold text-blue-900 mt-1">{stats.totalActivities}</p>
            </div>
            <Wrench className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">Scheduled</p>
              <p className="text-2xl font-bold text-purple-900 mt-1">{stats.scheduled}</p>
            </div>
            <Clock className="h-8 w-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4 border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-600">In Progress</p>
              <p className="text-2xl font-bold text-yellow-900 mt-1">{stats.inProgress}</p>
            </div>
            <Tool className="h-8 w-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Completed</p>
              <p className="text-2xl font-bold text-green-900 mt-1">{stats.completed}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search commissioning activities..."
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
          <option value="scheduled">Scheduled</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="failed">Failed</option>
          <option value="rescheduled">Rescheduled</option>
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
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Project & Site</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Schedule</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tests</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Equipment</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Issues</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Documents</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedCommissioning.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">{item.projectCode}</div>
                    <div className="text-sm text-gray-700">{item.projectName}</div>
                    <div className="flex items-center text-xs text-gray-500 mt-0.5">
                      <MapPin className="h-3 w-3 mr-1" />
                      {item.siteLocation}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center text-sm text-gray-900">
                      <Calendar className="h-4 w-4 mr-1" />
                      {item.commissioningDate}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{item.commissioningEngineer}</div>
                    {item.handoverDate && (
                      <div className="text-xs text-green-600 mt-1">Handover: {item.handoverDate}</div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm font-semibold text-gray-900">
                      {item.testsPassed}/{item.totalTests}
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div
                        className={`h-2 rounded-full ${
                          item.testsPassed === item.totalTests
                            ? 'bg-green-500'
                            : item.testsPassed > 0
                            ? 'bg-blue-500'
                            : 'bg-gray-300'
                        }`}
                        style={{ width: `${(item.testsPassed / item.totalTests) * 100}%` }}
                      ></div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm font-semibold text-gray-900">
                      {item.commissionedEquipment}/{item.equipmentCount}
                    </div>
                    <div className="text-xs text-gray-500">
                      {Math.round((item.commissionedEquipment / item.equipmentCount) * 100)}% done
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm font-semibold text-gray-900">
                      {item.resolvedIssues}/{item.issuesFound}
                    </div>
                    <div className="text-xs text-gray-500">
                      {item.issuesFound - item.resolvedIssues} pending
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${documentStatusColors[item.documentStatus]}`}>
                      {item.documentStatus.charAt(0).toUpperCase() + item.documentStatus.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColors[item.status]}`}>
                      {item.status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => router.push(`/projects/commissioning/view/${item.id}`)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => router.push(`/projects/commissioning/edit/${item.id}`)}
                        className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => router.push(`/projects/commissioning/docs/${item.id}`)}
                        className="p-1.5 text-purple-600 hover:bg-purple-50 rounded transition-colors"
                      >
                        <FileText className="h-4 w-4" />
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
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredCommissioning.length)} of {filteredCommissioning.length} activities
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

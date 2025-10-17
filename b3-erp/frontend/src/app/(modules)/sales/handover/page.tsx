'use client';

import { useState } from 'react';
import {
  Search,
  Filter,
  Download,
  Eye,
  Edit2,
  CheckCircle,
  Clock,
  TrendingUp,
  FileCheck,
  XCircle,
  AlertCircle,
} from 'lucide-react';

interface ProjectHandover {
  id: string;
  handoverId: string;
  projectName: string;
  clientName: string;
  orderValue: number;
  completionDate: string;
  handoverDate: string;
  documentsStatus: 'complete' | 'pending' | 'partial';
  acceptanceStatus: 'pending' | 'accepted' | 'rejected' | 'conditional';
  salesManager: string;
  projectManager: string;
  projectType: 'Equipment Supply' | 'Turnkey Project' | 'Installation' | 'Commissioning';
  technicalSpecs: boolean;
  userManuals: boolean;
  testReports: boolean;
  warrantyDocs: boolean;
  trainingCompletion: boolean;
}

const mockHandovers: ProjectHandover[] = [
  {
    id: '1',
    handoverId: 'HO-2025-001',
    projectName: 'CNC Machining Center Installation',
    clientName: 'Godrej & Boyce Manufacturing',
    orderValue: 5500000,
    completionDate: '2025-01-15',
    handoverDate: '2025-01-20',
    documentsStatus: 'complete',
    acceptanceStatus: 'accepted',
    salesManager: 'Rajesh Kumar',
    projectManager: 'Suresh Nair',
    projectType: 'Equipment Supply',
    technicalSpecs: true,
    userManuals: true,
    testReports: true,
    warrantyDocs: true,
    trainingCompletion: true,
  },
  {
    id: '2',
    handoverId: 'HO-2025-002',
    projectName: 'Pharmaceutical Clean Room Setup',
    clientName: 'Cipla Pharmaceuticals',
    orderValue: 12000000,
    completionDate: '2025-01-18',
    handoverDate: '2025-01-25',
    documentsStatus: 'pending',
    acceptanceStatus: 'pending',
    salesManager: 'Priya Sharma',
    projectManager: 'Anil Mehta',
    projectType: 'Turnkey Project',
    technicalSpecs: true,
    userManuals: true,
    testReports: false,
    warrantyDocs: true,
    trainingCompletion: false,
  },
  {
    id: '3',
    handoverId: 'HO-2025-003',
    projectName: 'Robotic Welding Cell Implementation',
    clientName: 'Bharat Forge Limited',
    orderValue: 8500000,
    completionDate: '2025-01-12',
    handoverDate: '2025-01-18',
    documentsStatus: 'partial',
    acceptanceStatus: 'conditional',
    salesManager: 'Amit Patel',
    projectManager: 'Rakesh Verma',
    projectType: 'Installation',
    technicalSpecs: true,
    userManuals: true,
    testReports: true,
    warrantyDocs: false,
    trainingCompletion: true,
  },
  {
    id: '4',
    handoverId: 'HO-2025-004',
    projectName: 'HVAC System Commissioning',
    clientName: 'DLF Commercial Developers',
    orderValue: 3200000,
    completionDate: '2025-01-10',
    handoverDate: '2025-01-22',
    documentsStatus: 'complete',
    acceptanceStatus: 'accepted',
    salesManager: 'Sneha Reddy',
    projectManager: 'Vijay Kumar',
    projectType: 'Commissioning',
    technicalSpecs: true,
    userManuals: true,
    testReports: true,
    warrantyDocs: true,
    trainingCompletion: true,
  },
  {
    id: '5',
    handoverId: 'HO-2025-005',
    projectName: 'Conveyor System Integration',
    clientName: 'Hindustan Unilever Limited',
    orderValue: 4800000,
    completionDate: '2025-01-08',
    handoverDate: '2025-01-15',
    documentsStatus: 'complete',
    acceptanceStatus: 'rejected',
    salesManager: 'Vikram Singh',
    projectManager: 'Manoj Tiwari',
    projectType: 'Installation',
    technicalSpecs: true,
    userManuals: true,
    testReports: false,
    warrantyDocs: true,
    trainingCompletion: true,
  },
  {
    id: '6',
    handoverId: 'HO-2024-158',
    projectName: 'Power Distribution Panel Supply',
    clientName: 'Adani Green Energy',
    orderValue: 6700000,
    completionDate: '2024-12-28',
    handoverDate: '2025-01-05',
    documentsStatus: 'complete',
    acceptanceStatus: 'accepted',
    salesManager: 'Anita Desai',
    projectManager: 'Karan Malhotra',
    projectType: 'Equipment Supply',
    technicalSpecs: true,
    userManuals: true,
    testReports: true,
    warrantyDocs: true,
    trainingCompletion: true,
  },
];

const acceptanceStatusColors = {
  pending: 'bg-yellow-100 text-yellow-700 border-yellow-300',
  accepted: 'bg-green-100 text-green-700 border-green-300',
  rejected: 'bg-red-100 text-red-700 border-red-300',
  conditional: 'bg-orange-100 text-orange-700 border-orange-300',
};

const documentsStatusColors = {
  complete: 'bg-green-100 text-green-700 border-green-300',
  pending: 'bg-yellow-100 text-yellow-700 border-yellow-300',
  partial: 'bg-orange-100 text-orange-700 border-orange-300',
};

const projectTypeOptions = [
  { value: '', label: 'All Project Types' },
  { value: 'Equipment Supply', label: 'Equipment Supply' },
  { value: 'Turnkey Project', label: 'Turnkey Project' },
  { value: 'Installation', label: 'Installation' },
  { value: 'Commissioning', label: 'Commissioning' },
];

const statusOptions = [
  { value: '', label: 'All Status' },
  { value: 'pending', label: 'Pending' },
  { value: 'accepted', label: 'Accepted' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'conditional', label: 'Conditional' },
];

export default function HandoverPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [projectTypeFilter, setProjectTypeFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredHandovers = mockHandovers.filter((handover) => {
    const matchesSearch =
      handover.handoverId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      handover.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      handover.clientName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || handover.acceptanceStatus === statusFilter;
    const matchesProjectType = !projectTypeFilter || handover.projectType === projectTypeFilter;
    return matchesSearch && matchesStatus && matchesProjectType;
  });

  const totalPages = Math.ceil(filteredHandovers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedHandovers = filteredHandovers.slice(startIndex, startIndex + itemsPerPage);

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const stats = {
    pendingHandovers: mockHandovers.filter((h) => h.acceptanceStatus === 'pending').length,
    completedThisMonth: mockHandovers.filter((h) => {
      const handoverDate = new Date(h.handoverDate);
      return (
        h.acceptanceStatus === 'accepted' &&
        handoverDate.getMonth() === currentMonth &&
        handoverDate.getFullYear() === currentYear
      );
    }).length,
    inProgress: mockHandovers.filter((h) => ['pending', 'conditional'].includes(h.acceptanceStatus)).length,
    acceptanceRate: Math.round(
      (mockHandovers.filter((h) => h.acceptanceStatus === 'accepted').length / mockHandovers.length) * 100
    ),
  };

  const handleExport = () => {
    console.log('Exporting handover report...');
  };

  const handleView = (id: string) => {
    console.log('Viewing handover:', id);
  };

  const handleEdit = (id: string) => {
    console.log('Editing handover:', id);
  };

  const handleComplete = (id: string) => {
    console.log('Completing handover:', id);
  };

  return (
    <div className="w-full min-h-screen px-4 sm:px-6 lg:px-8 py-6">
      {/* Stats with Export Button */}
      <div className="mb-6 flex items-start gap-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 flex-1">
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4 border border-yellow-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-600">Pending Handovers</p>
                <p className="text-2xl font-bold text-yellow-900 mt-1">{stats.pendingHandovers}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Completed This Month</p>
                <p className="text-2xl font-bold text-green-900 mt-1">{stats.completedThisMonth}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">In Progress</p>
                <p className="text-2xl font-bold text-blue-900 mt-1">{stats.inProgress}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Acceptance Rate</p>
                <p className="text-2xl font-bold text-purple-900 mt-1">{stats.acceptanceRate}%</p>
              </div>
              <FileCheck className="h-8 w-8 text-purple-600" />
            </div>
          </div>
        </div>

        <button
          onClick={handleExport}
          className="flex items-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors h-fit flex-shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>Export</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-md p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by handover ID, project, or client..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <select
                value={projectTypeFilter}
                onChange={(e) => setProjectTypeFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {projectTypeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto overflow-y-auto max-h-[calc(100vh-24rem)]">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Handover ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Project Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Client Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Order Value
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Completion Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Handover Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Documents Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Acceptance Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Sales Manager
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Project Manager
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedHandovers.map((handover) => (
                  <tr key={handover.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">{handover.handoverId}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <span className="text-sm text-gray-900">{handover.projectName}</span>
                        <p className="text-xs text-gray-500">{handover.projectType}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{handover.clientName}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">
                        ₹{(handover.orderValue / 100000).toFixed(2)}L
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-600">
                        {new Date(handover.completionDate).toLocaleDateString('en-IN')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-600">
                        {new Date(handover.handoverDate).toLocaleDateString('en-IN')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <span
                          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${
                            documentsStatusColors[handover.documentsStatus]
                          }`}
                        >
                          {handover.documentsStatus.toUpperCase()}
                        </span>
                        <div className="mt-1 text-xs text-gray-500">
                          {[
                            handover.technicalSpecs && 'Tech Specs',
                            handover.userManuals && 'Manuals',
                            handover.testReports && 'Tests',
                            handover.warrantyDocs && 'Warranty',
                            handover.trainingCompletion && 'Training',
                          ]
                            .filter(Boolean)
                            .join(', ')}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${
                          acceptanceStatusColors[handover.acceptanceStatus]
                        }`}
                      >
                        {handover.acceptanceStatus.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{handover.salesManager}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{handover.projectManager}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleView(handover.id)}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(handover.id)}
                          className="p-1 text-yellow-600 hover:bg-yellow-50 rounded transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        {handover.acceptanceStatus === 'pending' && (
                          <button
                            onClick={() => handleComplete(handover.id)}
                            className="p-1 text-green-600 hover:bg-green-50 rounded transition-colors"
                            title="Complete"
                          >
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

          {/* Pagination */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredHandovers.length)} of{' '}
                {filteredHandovers.length} results
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                <div className="flex items-center gap-1">
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                        currentPage === i + 1
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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

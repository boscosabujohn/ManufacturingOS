'use client';

import { useState } from 'react';
import { Users, Clock, TrendingUp, AlertTriangle, DollarSign, Calendar, Plus, Download, Filter } from 'lucide-react';

interface LaborEntry {
  id: string;
  date: string;
  projectId: string;
  projectName: string;
  workPackage: string;
  laborCategory: 'Skilled' | 'Semi-Skilled' | 'Unskilled' | 'Supervisor' | 'Engineer';
  workersDeployed: number;
  hoursWorked: number;
  overtimeHours: number;
  totalManhours: number;
  plannedManhours: number;
  variance: number;
  hourlyRate: number;
  overtimeRate: number;
  totalCost: number;
  workDescription: string;
  shift: 'Day' | 'Night' | 'General';
  efficiency: number;
  supervisor: string;
  remarks: string;
}

export default function LaborTrackingPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterProject, setFilterProject] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterDate, setFilterDate] = useState<string>('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const mockLaborEntries: LaborEntry[] = [
    {
      id: 'LT-001',
      date: '2025-01-22',
      projectId: 'PRJ-2025-001',
      projectName: 'Taj Hotels - Commercial Kitchen Setup',
      workPackage: 'WP-001 - Equipment Installation',
      laborCategory: 'Skilled',
      workersDeployed: 8,
      hoursWorked: 64,
      overtimeHours: 8,
      totalManhours: 72,
      plannedManhours: 64,
      variance: 8,
      hourlyRate: 450,
      overtimeRate: 675,
      totalCost: 34200,
      workDescription: 'Installation of cooking ranges and exhaust hoods',
      shift: 'Day',
      efficiency: 88,
      supervisor: 'Ramesh Kumar',
      remarks: 'Overtime due to client requested early completion',
    },
    {
      id: 'LT-002',
      date: '2025-01-22',
      projectId: 'PRJ-2025-002',
      projectName: 'BigBasket - Cold Room Installation',
      workPackage: 'WP-002 - Panel Installation',
      laborCategory: 'Skilled',
      workersDeployed: 6,
      hoursWorked: 48,
      overtimeHours: 0,
      totalManhours: 48,
      plannedManhours: 48,
      variance: 0,
      hourlyRate: 420,
      overtimeRate: 630,
      totalCost: 20160,
      workDescription: 'PUF panel installation and cam-lock fitting',
      shift: 'Day',
      efficiency: 100,
      supervisor: 'Suresh Patel',
      remarks: 'Work completed as per schedule',
    },
    {
      id: 'LT-003',
      date: '2025-01-22',
      projectId: 'PRJ-2025-003',
      projectName: 'L&T Campus - Industrial Kitchen',
      workPackage: 'WP-003 - Civil Work',
      laborCategory: 'Unskilled',
      workersDeployed: 12,
      hoursWorked: 96,
      overtimeHours: 0,
      totalManhours: 96,
      plannedManhours: 80,
      variance: 16,
      hourlyRate: 250,
      overtimeRate: 375,
      totalCost: 24000,
      workDescription: 'Site cleaning and material handling',
      shift: 'Day',
      efficiency: 75,
      supervisor: 'Vijay Sharma',
      remarks: 'Additional workers deployed for faster completion',
    },
    {
      id: 'LT-004',
      date: '2025-01-22',
      projectId: 'PRJ-2025-001',
      projectName: 'Taj Hotels - Commercial Kitchen Setup',
      workPackage: 'WP-004 - Electrical Work',
      laborCategory: 'Skilled',
      workersDeployed: 4,
      hoursWorked: 32,
      overtimeHours: 4,
      totalManhours: 36,
      plannedManhours: 32,
      variance: 4,
      hourlyRate: 480,
      overtimeRate: 720,
      totalCost: 18240,
      workDescription: 'Power wiring and equipment connections',
      shift: 'Day',
      efficiency: 92,
      supervisor: 'Prakash Rao',
      remarks: 'Minor overtime for testing completion',
    },
    {
      id: 'LT-005',
      date: '2025-01-21',
      projectId: 'PRJ-2025-004',
      projectName: 'ITC Grand - Bakery Equipment Setup',
      workPackage: 'WP-005 - Equipment Commissioning',
      laborCategory: 'Engineer',
      workersDeployed: 2,
      hoursWorked: 16,
      overtimeHours: 0,
      totalManhours: 16,
      plannedManhours: 16,
      variance: 0,
      hourlyRate: 800,
      overtimeRate: 1200,
      totalCost: 12800,
      workDescription: 'Oven calibration and testing',
      shift: 'Day',
      efficiency: 100,
      supervisor: 'Amit Singh',
      remarks: 'Commissioning completed successfully',
    },
    {
      id: 'LT-006',
      date: '2025-01-21',
      projectId: 'PRJ-2025-003',
      projectName: 'L&T Campus - Industrial Kitchen',
      workPackage: 'WP-006 - Plumbing Work',
      laborCategory: 'Semi-Skilled',
      workersDeployed: 6,
      hoursWorked: 48,
      overtimeHours: 6,
      totalManhours: 54,
      plannedManhours: 48,
      variance: 6,
      hourlyRate: 350,
      overtimeRate: 525,
      totalCost: 20250,
      workDescription: 'Pipeline installation and drain connections',
      shift: 'Day',
      efficiency: 85,
      supervisor: 'Dinesh Kumar',
      remarks: 'Extended work for leak testing',
    },
    {
      id: 'LT-007',
      date: '2025-01-21',
      projectId: 'PRJ-2025-005',
      projectName: 'Godrej Properties - Modular Kitchen',
      workPackage: 'WP-007 - Cabinet Installation',
      laborCategory: 'Skilled',
      workersDeployed: 4,
      hoursWorked: 32,
      overtimeHours: 0,
      totalManhours: 32,
      plannedManhours: 32,
      variance: 0,
      hourlyRate: 400,
      overtimeRate: 600,
      totalCost: 12800,
      workDescription: 'Base and wall cabinet installation',
      shift: 'Day',
      efficiency: 95,
      supervisor: 'Ravi Shankar',
      remarks: 'Installation progressing smoothly',
    },
    {
      id: 'LT-008',
      date: '2025-01-20',
      projectId: 'PRJ-2025-002',
      projectName: 'BigBasket - Cold Room Installation',
      workPackage: 'WP-008 - Refrigeration Setup',
      laborCategory: 'Skilled',
      workersDeployed: 5,
      hoursWorked: 40,
      overtimeHours: 8,
      totalManhours: 48,
      plannedManhours: 40,
      variance: 8,
      hourlyRate: 500,
      overtimeRate: 750,
      totalCost: 26000,
      workDescription: 'Compressor and evaporator installation',
      shift: 'Day',
      efficiency: 90,
      supervisor: 'Venkat Rao',
      remarks: 'Overtime for gas charging completion',
    },
    {
      id: 'LT-009',
      date: '2025-01-20',
      projectId: 'PRJ-2025-001',
      projectName: 'Taj Hotels - Commercial Kitchen Setup',
      workPackage: 'WP-009 - Finishing Work',
      laborCategory: 'Semi-Skilled',
      workersDeployed: 6,
      hoursWorked: 48,
      overtimeHours: 0,
      totalManhours: 48,
      plannedManhours: 48,
      variance: 0,
      hourlyRate: 320,
      overtimeRate: 480,
      totalCost: 15360,
      workDescription: 'Wall cladding and floor finishing',
      shift: 'Day',
      efficiency: 93,
      supervisor: 'Mahesh Gupta',
      remarks: 'Good quality finish achieved',
    },
    {
      id: 'LT-010',
      date: '2025-01-20',
      projectId: 'PRJ-2025-006',
      projectName: 'Siemens - Switchgear Manufacturing Unit',
      workPackage: 'WP-010 - Assembly Line Setup',
      laborCategory: 'Engineer',
      workersDeployed: 3,
      hoursWorked: 24,
      overtimeHours: 0,
      totalManhours: 24,
      plannedManhours: 24,
      variance: 0,
      hourlyRate: 850,
      overtimeRate: 1275,
      totalCost: 20400,
      workDescription: 'Equipment alignment and testing',
      shift: 'Day',
      efficiency: 100,
      supervisor: 'Deepak Shah',
      remarks: 'Precision work completed as planned',
    },
    {
      id: 'LT-011',
      date: '2025-01-19',
      projectId: 'PRJ-2025-003',
      projectName: 'L&T Campus - Industrial Kitchen',
      workPackage: 'WP-011 - HVAC Installation',
      laborCategory: 'Skilled',
      workersDeployed: 8,
      hoursWorked: 64,
      overtimeHours: 12,
      totalManhours: 76,
      plannedManhours: 64,
      variance: 12,
      hourlyRate: 460,
      overtimeRate: 690,
      totalCost: 37720,
      workDescription: 'Duct installation and fan mounting',
      shift: 'Day',
      efficiency: 82,
      supervisor: 'Anil Joshi',
      remarks: 'Overtime due to duct leakage rectification',
    },
    {
      id: 'LT-012',
      date: '2025-01-19',
      projectId: 'PRJ-2025-008',
      projectName: 'Marriott Hotel - Kitchen Renovation',
      workPackage: 'WP-012 - Demolition Work',
      laborCategory: 'Unskilled',
      workersDeployed: 10,
      hoursWorked: 60,
      overtimeHours: 0,
      totalManhours: 60,
      plannedManhours: 60,
      variance: 0,
      hourlyRate: 280,
      overtimeRate: 420,
      totalCost: 16800,
      workDescription: 'Old equipment removal and debris clearing',
      shift: 'Night',
      efficiency: 88,
      supervisor: 'Naveen Kumar',
      remarks: 'Night shift to avoid hotel operation disruption',
    },
  ];

  const stats = {
    totalEntries: mockLaborEntries.length,
    totalWorkers: mockLaborEntries.reduce((sum, e) => sum + e.workersDeployed, 0),
    totalManhours: mockLaborEntries.reduce((sum, e) => sum + e.totalManhours, 0),
    totalCost: mockLaborEntries.reduce((sum, e) => sum + e.totalCost, 0),
    overtimeHours: mockLaborEntries.reduce((sum, e) => sum + e.overtimeHours, 0),
    avgEfficiency: (mockLaborEntries.reduce((sum, e) => sum + e.efficiency, 0) / mockLaborEntries.length).toFixed(1),
    varianceTotal: mockLaborEntries.reduce((sum, e) => sum + e.variance, 0),
  };

  const filteredEntries = mockLaborEntries.filter((entry) => {
    const matchesSearch =
      entry.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.workPackage.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.supervisor.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesProject = filterProject === 'all' || entry.projectId === filterProject;
    const matchesCategory = filterCategory === 'all' || entry.laborCategory === filterCategory;
    const matchesDate = !filterDate || entry.date === filterDate;
    return matchesSearch && matchesProject && matchesCategory && matchesDate;
  });

  const totalPages = Math.ceil(filteredEntries.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedEntries = filteredEntries.slice(startIndex, startIndex + itemsPerPage);

  const uniqueProjects = Array.from(new Set(mockLaborEntries.map(e => e.projectId)));

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Engineer':
        return 'bg-purple-100 text-purple-800';
      case 'Skilled':
        return 'bg-blue-100 text-blue-800';
      case 'Semi-Skilled':
        return 'bg-green-100 text-green-800';
      case 'Supervisor':
        return 'bg-orange-100 text-orange-800';
      case 'Unskilled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 90) return 'text-green-600';
    if (efficiency >= 75) return 'text-blue-600';
    if (efficiency >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getVarianceColor = (variance: number) => {
    if (variance === 0) return 'text-blue-600';
    if (variance > 0) return 'text-red-600';
    return 'text-green-600';
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Labor & Manhours Tracking</h1>
          <p className="text-gray-600 mt-1">Track workforce deployment and productivity across projects</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="h-5 w-5" />
          <span>Add Entry</span>
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Entries</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalEntries}</p>
            </div>
            <Calendar className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Workers</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalWorkers}</p>
            </div>
            <Users className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Manhours</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalManhours}</p>
            </div>
            <Clock className="h-8 w-8 text-purple-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Overtime</p>
              <p className="text-2xl font-bold text-orange-600">{stats.overtimeHours}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-orange-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Cost</p>
              <p className="text-2xl font-bold text-gray-900">₹{(stats.totalCost / 100000).toFixed(1)}L</p>
            </div>
            <DollarSign className="h-8 w-8 text-cyan-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Efficiency</p>
              <p className="text-2xl font-bold text-gray-900">{stats.avgEfficiency}%</p>
            </div>
            <TrendingUp className="h-8 w-8 text-indigo-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Variance</p>
              <p className={`text-2xl font-bold ${getVarianceColor(stats.varianceTotal)}`}>
                {stats.varianceTotal > 0 ? '+' : ''}{stats.varianceTotal}h
              </p>
            </div>
            <AlertTriangle className="h-8 w-8 text-yellow-600" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <input
              type="text"
              placeholder="Search project, work package..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Project</label>
            <select
              value={filterProject}
              onChange={(e) => setFilterProject(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Projects</option>
              {uniqueProjects.map((project) => (
                <option key={project} value={project}>
                  {project}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              <option value="Engineer">Engineer</option>
              <option value="Skilled">Skilled</option>
              <option value="Semi-Skilled">Semi-Skilled</option>
              <option value="Supervisor">Supervisor</option>
              <option value="Unskilled">Unskilled</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-end space-x-2">
            <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 h-10">
              <Filter className="h-4 w-4" />
              <span>More Filters</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 h-10">
              <Download className="h-4 w-4" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Labor Entries Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date / Project
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Work Package
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Workers
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Manhours
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Overtime
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cost
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Efficiency
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedEntries.map((entry) => (
                <tr key={entry.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{entry.date}</div>
                      <div className="text-sm text-gray-600">{entry.projectId}</div>
                      <div className="text-xs text-gray-500">{entry.projectName}</div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-sm text-gray-900">{entry.workPackage}</div>
                    <div className="text-xs text-gray-500">{entry.workDescription}</div>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(entry.laborCategory)}`}>
                      {entry.laborCategory}
                    </span>
                    <div className="text-xs text-gray-500 mt-1">{entry.shift} Shift</div>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <div className="text-sm font-medium text-gray-900">{entry.workersDeployed}</div>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <div className="text-sm font-medium text-gray-900">{entry.totalManhours}h</div>
                    <div className="text-xs text-gray-500">
                      Planned: {entry.plannedManhours}h
                    </div>
                    <div className={`text-xs font-semibold ${getVarianceColor(entry.variance)}`}>
                      {entry.variance > 0 ? '+' : ''}{entry.variance}h
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center">
                    {entry.overtimeHours > 0 ? (
                      <div className="text-sm font-medium text-orange-600">{entry.overtimeHours}h</div>
                    ) : (
                      <div className="text-sm text-gray-400">-</div>
                    )}
                  </td>
                  <td className="px-4 py-4 text-right">
                    <div className="text-sm font-medium text-gray-900">
                      ₹{entry.totalCost.toLocaleString('en-IN')}
                    </div>
                    <div className="text-xs text-gray-500">
                      @₹{entry.hourlyRate}/hr
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <div className={`text-sm font-semibold ${getEfficiencyColor(entry.efficiency)}`}>
                      {entry.efficiency}%
                    </div>
                    <div className="text-xs text-gray-500">{entry.supervisor}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
              <span className="font-medium">{Math.min(startIndex + itemsPerPage, filteredEntries.length)}</span> of{' '}
              <span className="font-medium">{filteredEntries.length}</span> entries
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-gray-300 rounded-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 border rounded-md text-sm font-medium ${
                    currentPage === page
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border border-gray-300 rounded-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add Entry Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">Add Labor Entry</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Project</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                    <option>Select Project</option>
                    <option>PRJ-2025-001 - Taj Hotels</option>
                    <option>PRJ-2025-002 - BigBasket</option>
                    <option>PRJ-2025-003 - L&T Campus</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Work Package</label>
                  <input
                    type="text"
                    placeholder="e.g., WP-001 - Equipment Installation"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Labor Category</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                    <option>Engineer</option>
                    <option>Skilled</option>
                    <option>Semi-Skilled</option>
                    <option>Supervisor</option>
                    <option>Unskilled</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Shift</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                    <option>Day</option>
                    <option>Night</option>
                    <option>General</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Workers Deployed</label>
                  <input
                    type="number"
                    placeholder="e.g., 8"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hours Worked</label>
                  <input
                    type="number"
                    placeholder="e.g., 64"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Overtime Hours</label>
                  <input
                    type="number"
                    placeholder="e.g., 8"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Planned Manhours</label>
                  <input
                    type="number"
                    placeholder="e.g., 64"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hourly Rate (₹)</label>
                  <input
                    type="number"
                    placeholder="e.g., 450"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Supervisor</label>
                  <input
                    type="text"
                    placeholder="Supervisor name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Work Description</label>
                  <textarea
                    rows={2}
                    placeholder="Brief description of work performed..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
                  <textarea
                    rows={2}
                    placeholder="Any additional notes..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Save Labor Entry
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

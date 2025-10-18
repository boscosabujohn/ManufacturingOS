'use client';

import { useState } from 'react';
import { Package, TrendingUp, AlertTriangle, CheckCircle, Plus, Filter, Download, Calendar } from 'lucide-react';

interface MaterialConsumption {
  id: string;
  date: string;
  projectId: string;
  projectName: string;
  workPackage: string;
  materialCode: string;
  materialName: string;
  category: string;
  unit: string;
  plannedQty: number;
  consumedQty: number;
  variance: number;
  variancePercent: number;
  unitCost: number;
  totalCost: number;
  source: 'Stock' | 'Direct Purchase' | 'Subcontractor';
  issuedBy: string;
  receivedBy: string;
  warehouseLocation: string;
  remarks: string;
  status: 'Within Budget' | 'Overused' | 'Critical';
}

export default function MaterialConsumptionPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterProject, setFilterProject] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const mockConsumptions: MaterialConsumption[] = [
    {
      id: 'MC-001',
      date: '2025-01-15',
      projectId: 'PRJ-2025-001',
      projectName: 'Taj Hotels - Commercial Kitchen Setup',
      workPackage: 'WP-001 - Equipment Installation',
      materialCode: 'MAT-CK-001',
      materialName: 'Stainless Steel Sheet 304 Grade',
      category: 'Raw Materials',
      unit: 'KG',
      plannedQty: 500,
      consumedQty: 520,
      variance: -20,
      variancePercent: -4.0,
      unitCost: 450,
      totalCost: 234000,
      source: 'Stock',
      issuedBy: 'Ramesh Kumar',
      receivedBy: 'Suresh Patel',
      warehouseLocation: 'WH-MUM-01',
      remarks: 'Additional material required for corner fabrication',
      status: 'Overused',
    },
    {
      id: 'MC-002',
      date: '2025-01-15',
      projectId: 'PRJ-2025-002',
      projectName: 'BigBasket - Cold Room Installation',
      workPackage: 'WP-002 - Civil Work',
      materialCode: 'MAT-CR-015',
      materialName: 'PUF Insulation Panel 100mm',
      category: 'Insulation Materials',
      unit: 'SQM',
      plannedQty: 250,
      consumedQty: 245,
      variance: 5,
      variancePercent: 2.0,
      unitCost: 850,
      totalCost: 208250,
      source: 'Direct Purchase',
      issuedBy: 'Vijay Sharma',
      receivedBy: 'Amit Singh',
      warehouseLocation: 'WH-BLR-02',
      remarks: 'Used slightly less due to optimized cutting plan',
      status: 'Within Budget',
    },
    {
      id: 'MC-003',
      date: '2025-01-14',
      projectId: 'PRJ-2025-003',
      projectName: 'L&T Campus - Industrial Kitchen',
      workPackage: 'WP-003 - Plumbing Work',
      materialCode: 'MAT-PLB-008',
      materialName: 'GI Pipe 2 inch Diameter',
      category: 'Plumbing Materials',
      unit: 'MTR',
      plannedQty: 200,
      consumedQty: 235,
      variance: -35,
      variancePercent: -17.5,
      unitCost: 180,
      totalCost: 42300,
      source: 'Stock',
      issuedBy: 'Prakash Rao',
      receivedBy: 'Dinesh Kumar',
      warehouseLocation: 'WH-DEL-01',
      remarks: 'Additional piping needed for extended layout',
      status: 'Critical',
    },
    {
      id: 'MC-004',
      date: '2025-01-14',
      projectId: 'PRJ-2025-004',
      projectName: 'ITC Grand - Bakery Equipment Setup',
      workPackage: 'WP-004 - Electrical Work',
      materialCode: 'MAT-ELE-025',
      materialName: 'Copper Cable 4 Core 6mm',
      category: 'Electrical Materials',
      unit: 'MTR',
      plannedQty: 300,
      consumedQty: 295,
      variance: 5,
      variancePercent: 1.7,
      unitCost: 125,
      totalCost: 36875,
      source: 'Stock',
      issuedBy: 'Sunil Reddy',
      receivedBy: 'Venkat Rao',
      warehouseLocation: 'WH-HYD-01',
      remarks: 'Efficient cable routing saved material',
      status: 'Within Budget',
    },
    {
      id: 'MC-005',
      date: '2025-01-13',
      projectId: 'PRJ-2025-005',
      projectName: 'Godrej Properties - Modular Kitchen',
      workPackage: 'WP-005 - Cabinet Installation',
      materialCode: 'MAT-CAB-012',
      materialName: 'HDHMR Board 18mm',
      category: 'Cabinet Materials',
      unit: 'SFT',
      plannedQty: 800,
      consumedQty: 850,
      variance: -50,
      variancePercent: -6.25,
      unitCost: 95,
      totalCost: 80750,
      source: 'Direct Purchase',
      issuedBy: 'Anil Joshi',
      receivedBy: 'Rajesh Mehta',
      warehouseLocation: 'WH-PUN-01',
      remarks: 'Client requested additional overhead cabinets',
      status: 'Overused',
    },
    {
      id: 'MC-006',
      date: '2025-01-13',
      projectId: 'PRJ-2025-001',
      projectName: 'Taj Hotels - Commercial Kitchen Setup',
      workPackage: 'WP-006 - HVAC Installation',
      materialCode: 'MAT-HVC-018',
      materialName: 'Copper Tubing 3/8 inch',
      category: 'HVAC Materials',
      unit: 'MTR',
      plannedQty: 150,
      consumedQty: 148,
      variance: 2,
      variancePercent: 1.3,
      unitCost: 320,
      totalCost: 47360,
      source: 'Stock',
      issuedBy: 'Mahesh Gupta',
      receivedBy: 'Kiran Kumar',
      warehouseLocation: 'WH-MUM-01',
      remarks: 'Minor savings on tubing',
      status: 'Within Budget',
    },
    {
      id: 'MC-007',
      date: '2025-01-12',
      projectId: 'PRJ-2025-002',
      projectName: 'BigBasket - Cold Room Installation',
      workPackage: 'WP-007 - Refrigeration Setup',
      materialCode: 'MAT-REF-009',
      materialName: 'R404A Refrigerant Gas',
      category: 'Refrigeration Materials',
      unit: 'KG',
      plannedQty: 80,
      consumedQty: 95,
      variance: -15,
      variancePercent: -18.75,
      unitCost: 1200,
      totalCost: 114000,
      source: 'Direct Purchase',
      issuedBy: 'Deepak Shah',
      receivedBy: 'Ashok Patil',
      warehouseLocation: 'WH-BLR-02',
      remarks: 'Additional gas needed for longer pipe runs and leak testing',
      status: 'Critical',
    },
    {
      id: 'MC-008',
      date: '2025-01-12',
      projectId: 'PRJ-2025-003',
      projectName: 'L&T Campus - Industrial Kitchen',
      workPackage: 'WP-008 - Equipment Foundation',
      materialCode: 'MAT-CIV-003',
      materialName: 'Cement OPC 53 Grade',
      category: 'Civil Materials',
      unit: 'BAG',
      plannedQty: 100,
      consumedQty: 98,
      variance: 2,
      variancePercent: 2.0,
      unitCost: 420,
      totalCost: 41160,
      source: 'Stock',
      issuedBy: 'Ravi Shankar',
      receivedBy: 'Mohan Lal',
      warehouseLocation: 'WH-DEL-01',
      remarks: 'Foundation work completed within budget',
      status: 'Within Budget',
    },
    {
      id: 'MC-009',
      date: '2025-01-11',
      projectId: 'PRJ-2025-004',
      projectName: 'ITC Grand - Bakery Equipment Setup',
      workPackage: 'WP-009 - Ventilation System',
      materialCode: 'MAT-VEN-014',
      materialName: 'Exhaust Hood Ducting 24 inch',
      category: 'Ventilation Materials',
      unit: 'MTR',
      plannedQty: 40,
      consumedQty: 45,
      variance: -5,
      variancePercent: -12.5,
      unitCost: 1800,
      totalCost: 81000,
      source: 'Subcontractor',
      issuedBy: 'Subcontractor Direct',
      receivedBy: 'Arun Kumar',
      warehouseLocation: 'Site Direct',
      remarks: 'Extended ducting for better ventilation coverage',
      status: 'Overused',
    },
    {
      id: 'MC-010',
      date: '2025-01-11',
      projectId: 'PRJ-2025-005',
      projectName: 'Godrej Properties - Modular Kitchen',
      workPackage: 'WP-010 - Countertop Installation',
      materialCode: 'MAT-CNT-007',
      materialName: 'Granite Slab Black Galaxy',
      category: 'Finishing Materials',
      unit: 'SFT',
      plannedQty: 120,
      consumedQty: 118,
      variance: 2,
      variancePercent: 1.7,
      unitCost: 350,
      totalCost: 41300,
      source: 'Direct Purchase',
      issuedBy: 'Naveen Kumar',
      receivedBy: 'Sanjay Gupta',
      warehouseLocation: 'WH-PUN-01',
      remarks: 'Efficient cutting and polishing',
      status: 'Within Budget',
    },
  ];

  const stats = {
    totalConsumptions: mockConsumptions.length,
    withinBudget: mockConsumptions.filter(m => m.status === 'Within Budget').length,
    overused: mockConsumptions.filter(m => m.status === 'Overused').length,
    critical: mockConsumptions.filter(m => m.status === 'Critical').length,
    totalCost: mockConsumptions.reduce((sum, m) => sum + m.totalCost, 0),
    avgVariance: (mockConsumptions.reduce((sum, m) => sum + Math.abs(m.variancePercent), 0) / mockConsumptions.length).toFixed(2),
  };

  const filteredConsumptions = mockConsumptions.filter((consumption) => {
    const matchesSearch =
      consumption.materialName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      consumption.materialCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      consumption.projectName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || consumption.status === filterStatus;
    const matchesProject = filterProject === 'all' || consumption.projectId === filterProject;
    return matchesSearch && matchesStatus && matchesProject;
  });

  const totalPages = Math.ceil(filteredConsumptions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedConsumptions = filteredConsumptions.slice(startIndex, startIndex + itemsPerPage);

  const uniqueProjects = Array.from(new Set(mockConsumptions.map(m => m.projectId)));

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Within Budget':
        return 'bg-green-100 text-green-800';
      case 'Overused':
        return 'bg-yellow-100 text-yellow-800';
      case 'Critical':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getVarianceColor = (variance: number) => {
    if (variance > 0) return 'text-green-600';
    if (variance < -10) return 'text-red-600';
    return 'text-yellow-600';
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Material Consumption Tracking</h1>
          <p className="text-gray-600 mt-1">Track material usage vs planned quantities</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="h-5 w-5" />
          <span>Add Consumption</span>
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Records</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalConsumptions}</p>
            </div>
            <Package className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Within Budget</p>
              <p className="text-2xl font-bold text-green-600">{stats.withinBudget}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Overused</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.overused}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-yellow-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Critical</p>
              <p className="text-2xl font-bold text-red-600">{stats.critical}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Cost</p>
              <p className="text-2xl font-bold text-gray-900">
                ₹{(stats.totalCost / 100000).toFixed(2)}L
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-purple-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Variance</p>
              <p className="text-2xl font-bold text-gray-900">{stats.avgVariance}%</p>
            </div>
            <TrendingUp className="h-8 w-8 text-indigo-600" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <input
              type="text"
              placeholder="Search material, code, project..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="Within Budget">Within Budget</option>
              <option value="Overused">Overused</option>
              <option value="Critical">Critical</option>
            </select>
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

      {/* Consumption Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date / Material
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Project / Work Package
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Planned
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Consumed
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Variance
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Cost
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedConsumptions.map((consumption) => (
                <tr key={consumption.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{consumption.materialCode}</div>
                        <div className="text-sm text-gray-600">{consumption.materialName}</div>
                        <div className="text-xs text-gray-500">{consumption.date}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-sm font-medium text-gray-900">{consumption.projectId}</div>
                    <div className="text-sm text-gray-600">{consumption.projectName}</div>
                    <div className="text-xs text-gray-500">{consumption.workPackage}</div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-sm text-gray-900">{consumption.category}</div>
                    <div className="text-xs text-gray-500">{consumption.source}</div>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <div className="text-sm font-medium text-gray-900">
                      {consumption.plannedQty} {consumption.unit}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <div className="text-sm font-medium text-gray-900">
                      {consumption.consumedQty} {consumption.unit}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <div className={`text-sm font-semibold ${getVarianceColor(consumption.variance)}`}>
                      {consumption.variance > 0 ? '+' : ''}{consumption.variance} {consumption.unit}
                    </div>
                    <div className={`text-xs ${getVarianceColor(consumption.variance)}`}>
                      ({consumption.variancePercent > 0 ? '+' : ''}{consumption.variancePercent.toFixed(2)}%)
                    </div>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <div className="text-sm font-medium text-gray-900">
                      ₹{consumption.totalCost.toLocaleString('en-IN')}
                    </div>
                    <div className="text-xs text-gray-500">
                      @ ₹{consumption.unitCost}/{consumption.unit}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(consumption.status)}`}>
                      {consumption.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 sm:px-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
              <span className="font-medium">{Math.min(startIndex + itemsPerPage, filteredConsumptions.length)}</span> of{' '}
              <span className="font-medium">{filteredConsumptions.length}</span> results
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

      {/* Add Consumption Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">Add Material Consumption</h2>
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Work Package</label>
                  <input
                    type="text"
                    placeholder="e.g., WP-001 - Equipment Installation"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Material Code</label>
                  <input
                    type="text"
                    placeholder="e.g., MAT-CK-001"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Material Name</label>
                  <input
                    type="text"
                    placeholder="e.g., Stainless Steel Sheet 304 Grade"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                    <option>Raw Materials</option>
                    <option>Insulation Materials</option>
                    <option>Plumbing Materials</option>
                    <option>Electrical Materials</option>
                    <option>Civil Materials</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                    <option>KG</option>
                    <option>MTR</option>
                    <option>SQM</option>
                    <option>SFT</option>
                    <option>BAG</option>
                    <option>NOS</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Planned Quantity</label>
                  <input
                    type="number"
                    placeholder="e.g., 500"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Consumed Quantity</label>
                  <input
                    type="number"
                    placeholder="e.g., 520"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Unit Cost (₹)</label>
                  <input
                    type="number"
                    placeholder="e.g., 450"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Source</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                    <option>Stock</option>
                    <option>Direct Purchase</option>
                    <option>Subcontractor</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Issued By</label>
                  <input
                    type="text"
                    placeholder="Store keeper name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Received By</label>
                  <input
                    type="text"
                    placeholder="Site engineer name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Warehouse Location</label>
                  <input
                    type="text"
                    placeholder="e.g., WH-MUM-01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
                  <textarea
                    rows={3}
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
                  Save Consumption Record
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

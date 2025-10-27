'use client';

import { useState, useMemo } from 'react';
import { Package, User, Calendar, MapPin, CheckCircle, Clock, Send, Filter } from 'lucide-react';

interface AssetAllocation {
  id: string;
  allocationId: string;
  assetTag: string;
  assetName: string;
  category: 'laptop' | 'desktop' | 'mobile' | 'monitor' | 'furniture' | 'other';
  employeeName: string;
  employeeCode: string;
  department: string;
  designation: string;
  location: string;
  allocationDate: string;
  expectedReturnDate?: string;
  actualReturnDate?: string;
  status: 'allocated' | 'in_use' | 'returned' | 'overdue';
  condition: 'excellent' | 'good' | 'fair' | 'poor';
  allocatedBy: string;
  remarks?: string;
}

export default function Page() {
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  const mockAllocations: AssetAllocation[] = [
    {
      id: '1',
      allocationId: 'ALLOC-2025-001',
      assetTag: 'LAP-2024-156',
      assetName: 'Dell Latitude 5420',
      category: 'laptop',
      employeeName: 'Rajesh Kumar',
      employeeCode: 'EMP345',
      department: 'Sales',
      designation: 'Sales Manager',
      location: 'Mumbai Office',
      allocationDate: '2025-01-15',
      status: 'in_use',
      condition: 'excellent',
      allocatedBy: 'IT Admin',
      remarks: 'For field work'
    },
    {
      id: '2',
      allocationId: 'ALLOC-2025-002',
      assetTag: 'MON-2024-089',
      assetName: 'Dell 24" Monitor',
      category: 'monitor',
      employeeName: 'Priya Sharma',
      employeeCode: 'EMP412',
      department: 'Marketing',
      designation: 'Marketing Executive',
      location: 'Delhi Office',
      allocationDate: '2025-02-10',
      status: 'in_use',
      condition: 'good',
      allocatedBy: 'IT Admin'
    },
    {
      id: '3',
      allocationId: 'ALLOC-2024-458',
      assetTag: 'MOB-2023-234',
      assetName: 'Samsung Galaxy S21',
      category: 'mobile',
      employeeName: 'Amit Patel',
      employeeCode: 'EMP287',
      department: 'Logistics',
      designation: 'Logistics Coordinator',
      location: 'Bangalore Office',
      allocationDate: '2024-08-20',
      expectedReturnDate: '2025-10-15',
      actualReturnDate: '2025-10-20',
      status: 'returned',
      condition: 'good',
      allocatedBy: 'HR Admin',
      remarks: 'Employee resigned'
    },
    {
      id: '4',
      allocationId: 'ALLOC-2025-003',
      assetTag: 'DESK-2024-045',
      assetName: 'HP Elite Desktop',
      category: 'desktop',
      employeeName: 'Sneha Reddy',
      employeeCode: 'EMP523',
      department: 'HR',
      designation: 'HR Executive',
      location: 'Hyderabad Office',
      allocationDate: '2025-03-05',
      status: 'in_use',
      condition: 'excellent',
      allocatedBy: 'IT Admin'
    },
    {
      id: '5',
      allocationId: 'ALLOC-2024-512',
      assetTag: 'LAP-2023-088',
      assetName: 'Lenovo ThinkPad',
      category: 'laptop',
      employeeName: 'Vikram Singh',
      employeeCode: 'EMP198',
      department: 'IT',
      designation: 'Software Developer',
      location: 'Pune Office',
      allocationDate: '2024-09-12',
      expectedReturnDate: '2025-10-01',
      status: 'overdue',
      condition: 'fair',
      allocatedBy: 'IT Manager',
      remarks: 'Temporary allocation - project ended'
    },
    {
      id: '6',
      allocationId: 'ALLOC-2025-004',
      assetTag: 'FURN-2025-012',
      assetName: 'Ergonomic Chair',
      category: 'furniture',
      employeeName: 'Kavita Mehta',
      employeeCode: 'EMP675',
      department: 'Finance',
      designation: 'Accountant',
      location: 'Mumbai Office',
      allocationDate: '2025-04-01',
      status: 'allocated',
      condition: 'excellent',
      allocatedBy: 'Admin'
    },
    {
      id: '7',
      allocationId: 'ALLOC-2025-005',
      assetTag: 'MOB-2024-156',
      assetName: 'iPhone 13',
      category: 'mobile',
      employeeName: 'Arjun Kapoor',
      employeeCode: 'EMP890',
      department: 'Sales',
      designation: 'Regional Manager',
      location: 'Delhi Office',
      allocationDate: '2025-03-20',
      status: 'in_use',
      condition: 'excellent',
      allocatedBy: 'IT Admin',
      remarks: 'Company SIM included'
    },
    {
      id: '8',
      allocationId: 'ALLOC-2024-389',
      assetTag: 'LAP-2023-234',
      assetName: 'HP ProBook',
      category: 'laptop',
      employeeName: 'Neha Gupta',
      employeeCode: 'EMP456',
      department: 'Operations',
      designation: 'Operations Manager',
      location: 'Chennai Office',
      allocationDate: '2024-11-15',
      expectedReturnDate: '2025-10-10',
      actualReturnDate: '2025-10-12',
      status: 'returned',
      condition: 'good',
      allocatedBy: 'IT Admin'
    }
  ];

  const filteredAllocations = mockAllocations.filter(a => {
    const statusMatch = selectedStatus === 'all' || a.status === selectedStatus;
    const categoryMatch = selectedCategory === 'all' || a.category === selectedCategory;
    const deptMatch = selectedDepartment === 'all' || a.department === selectedDepartment;
    return statusMatch && categoryMatch && deptMatch;
  });

  const stats = useMemo(() => ({
    total: mockAllocations.length,
    inUse: mockAllocations.filter(a => a.status === 'in_use').length,
    returned: mockAllocations.filter(a => a.status === 'returned').length,
    overdue: mockAllocations.filter(a => a.status === 'overdue').length
  }), [mockAllocations]);

  const statusColors = {
    allocated: 'bg-blue-100 text-blue-700',
    in_use: 'bg-green-100 text-green-700',
    returned: 'bg-gray-100 text-gray-700',
    overdue: 'bg-red-100 text-red-700'
  };

  const categoryColors = {
    laptop: 'bg-purple-100 text-purple-700',
    desktop: 'bg-blue-100 text-blue-700',
    mobile: 'bg-green-100 text-green-700',
    monitor: 'bg-orange-100 text-orange-700',
    furniture: 'bg-pink-100 text-pink-700',
    other: 'bg-gray-100 text-gray-700'
  };

  const conditionColors = {
    excellent: 'text-green-600',
    good: 'text-blue-600',
    fair: 'text-orange-600',
    poor: 'text-red-600'
  };

  return (
    <div className="w-full h-full px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Asset Allocation</h1>
        <p className="text-sm text-gray-600 mt-1">Manage asset allocations to employees</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Total Allocations</p>
              <p className="text-2xl font-bold text-blue-900 mt-1">{stats.total}</p>
            </div>
            <Package className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">In Use</p>
              <p className="text-2xl font-bold text-green-900 mt-1">{stats.inUse}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Returned</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.returned}</p>
            </div>
            <Send className="h-8 w-8 text-gray-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4 border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-600">Overdue</p>
              <p className="text-2xl font-bold text-red-900 mt-1">{stats.overdue}</p>
            </div>
            <Clock className="h-8 w-8 text-red-600" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="allocated">Allocated</option>
              <option value="in_use">In Use</option>
              <option value="returned">Returned</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              <option value="laptop">Laptop</option>
              <option value="desktop">Desktop</option>
              <option value="mobile">Mobile</option>
              <option value="monitor">Monitor</option>
              <option value="furniture">Furniture</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Departments</option>
              <option value="Sales">Sales</option>
              <option value="IT">IT</option>
              <option value="HR">HR</option>
              <option value="Finance">Finance</option>
              <option value="Marketing">Marketing</option>
            </select>
          </div>
          <div className="flex items-end">
            <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm flex items-center justify-center gap-2">
              <Send className="h-4 w-4" />
              New Allocation
            </button>
          </div>
        </div>
      </div>

      {/* Allocations List */}
      <div className="space-y-4">
        {filteredAllocations.map(allocation => (
          <div key={allocation.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-12 w-12 bg-blue-50 rounded-lg flex items-center justify-center">
                    <Package className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{allocation.assetName}</h3>
                    <p className="text-sm text-gray-600">Asset Tag: {allocation.assetTag} • ID: {allocation.allocationId}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-1 text-xs font-semibold rounded ${categoryColors[allocation.category]}`}>
                    {allocation.category.charAt(0).toUpperCase() + allocation.category.slice(1)}
                  </span>
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusColors[allocation.status]}`}>
                    {allocation.status === 'in_use' ? 'In Use' : allocation.status.charAt(0).toUpperCase() + allocation.status.slice(1)}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500 uppercase font-medium mb-1">Condition</p>
                <p className={`text-lg font-bold ${conditionColors[allocation.condition]}`}>
                  {allocation.condition.charAt(0).toUpperCase() + allocation.condition.slice(1)}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 py-4 border-y border-gray-200">
              <div>
                <p className="text-xs text-gray-500 uppercase font-medium mb-1">Allocated To</p>
                <p className="text-sm font-semibold text-gray-900 flex items-center gap-1">
                  <User className="h-4 w-4" />
                  {allocation.employeeName}
                </p>
                <p className="text-xs text-gray-600">{allocation.employeeCode} • {allocation.designation}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-medium mb-1">Department</p>
                <p className="text-sm font-semibold text-gray-900">{allocation.department}</p>
                <p className="text-xs text-gray-600 flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {allocation.location}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-medium mb-1">Allocation Date</p>
                <p className="text-sm font-semibold text-gray-900 flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {new Date(allocation.allocationDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
                <p className="text-xs text-gray-600">By: {allocation.allocatedBy}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-medium mb-1">Return Date</p>
                {allocation.actualReturnDate ? (
                  <>
                    <p className="text-sm font-semibold text-green-600">
                      {new Date(allocation.actualReturnDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                    <p className="text-xs text-green-600">✓ Returned</p>
                  </>
                ) : allocation.expectedReturnDate ? (
                  <>
                    <p className="text-sm font-semibold text-gray-900">
                      {new Date(allocation.expectedReturnDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                    <p className="text-xs text-gray-600">Expected</p>
                  </>
                ) : (
                  <p className="text-sm text-gray-500">Permanent</p>
                )}
              </div>
            </div>

            {allocation.remarks && (
              <div className="bg-gray-50 rounded-lg p-3 mb-4">
                <p className="text-xs text-gray-500 uppercase font-medium mb-1">Remarks</p>
                <p className="text-sm text-gray-700">{allocation.remarks}</p>
              </div>
            )}

            <div className="flex gap-2">
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium text-sm">
                View Details
              </button>
              {allocation.status === 'in_use' && (
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm">
                  Mark as Returned
                </button>
              )}
              {allocation.status === 'overdue' && (
                <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium text-sm">
                  Send Reminder
                </button>
              )}
              {allocation.status === 'allocated' && (
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium text-sm">
                  Confirm Handover
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

'use client';

import { useState, useMemo } from 'react';
import { UserCheck, Search, Filter, Plus, Edit, Users, Clock, CheckCircle } from 'lucide-react';
import DataTable from '@/components/DataTable';
import StatusBadge, { BadgeStatus } from '@/components/StatusBadge';

interface ShiftAssignment {
  id: string;
  employeeCode: string;
  employeeName: string;
  department: string;
  designation: string;
  currentShift: string;
  shiftType: 'day' | 'night' | 'morning' | 'evening' | 'flexible';
  effectiveFrom: string;
  status: 'active' | 'pending' | 'scheduled';
}

export default function ShiftAssignmentPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedShiftType, setSelectedShiftType] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  const mockAssignments: ShiftAssignment[] = [
    { id: '1', employeeCode: 'KMF2020001', employeeName: 'Rajesh Kumar', department: 'Production',
      designation: 'Manager', currentShift: 'General Day Shift', shiftType: 'day',
      effectiveFrom: '2024-01-01', status: 'active' },
    { id: '2', employeeCode: 'KMF2019002', employeeName: 'Meera Nair', department: 'Quality',
      designation: 'QC Head', currentShift: 'Morning Shift', shiftType: 'morning',
      effectiveFrom: '2024-01-01', status: 'active' },
    { id: '3', employeeCode: 'KMF2021003', employeeName: 'Arun Patel', department: 'IT',
      designation: 'Sr. Engineer', currentShift: 'Flexible Shift', shiftType: 'flexible',
      effectiveFrom: '2024-02-01', status: 'active' },
    { id: '4', employeeCode: 'KMF2022004', employeeName: 'Vikram Singh', department: 'Production',
      designation: 'Supervisor', currentShift: 'Night Shift', shiftType: 'night',
      effectiveFrom: '2024-01-01', status: 'active' },
    { id: '5', employeeCode: 'KMF2020005', employeeName: 'Priya Menon', department: 'Finance',
      designation: 'Accountant', currentShift: 'General Day Shift', shiftType: 'day',
      effectiveFrom: '2024-01-01', status: 'active' },
    { id: '6', employeeCode: 'KMF2018006', employeeName: 'Suresh Babu', department: 'Logistics',
      designation: 'Manager', currentShift: 'Evening Shift', shiftType: 'evening',
      effectiveFrom: '2024-01-15', status: 'active' },
    { id: '7', employeeCode: 'KMF2019007', employeeName: 'Anjali Reddy', department: 'Marketing',
      designation: 'Executive', currentShift: 'General Day Shift', shiftType: 'day',
      effectiveFrom: '2024-01-01', status: 'active' },
    { id: '8', employeeCode: 'KMF2021008', employeeName: 'Kavita Desai', department: 'HR',
      designation: 'Executive', currentShift: 'General Day Shift', shiftType: 'day',
      effectiveFrom: '2024-01-01', status: 'active' }
  ];

  const filteredData = useMemo(() => {
    return mockAssignments.filter(assignment => {
      const matchesSearch = assignment.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          assignment.employeeCode.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDepartment = selectedDepartment === 'all' || assignment.department === selectedDepartment;
      const matchesShiftType = selectedShiftType === 'all' || assignment.shiftType === selectedShiftType;
      return matchesSearch && matchesDepartment && matchesShiftType;
    });
  }, [searchTerm, selectedDepartment, selectedShiftType]);

  const stats = {
    total: mockAssignments.length,
    dayShifts: mockAssignments.filter(a => a.shiftType === 'day').length,
    nightShifts: mockAssignments.filter(a => a.shiftType === 'night').length,
    flexibleShifts: mockAssignments.filter(a => a.shiftType === 'flexible').length
  };

  const getShiftTypeColor = (type: string) => {
    const colors = {
      day: 'bg-yellow-100 text-yellow-700',
      night: 'bg-indigo-100 text-indigo-700',
      morning: 'bg-orange-100 text-orange-700',
      evening: 'bg-purple-100 text-purple-700',
      flexible: 'bg-blue-100 text-blue-700'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-700';
  };

  const columns = [
    { key: 'employeeName', label: 'Employee', sortable: true,
      render: (v: string, row: ShiftAssignment) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
            <span className="text-indigo-600 font-semibold text-sm">{v.split(' ').map(n => n[0]).join('')}</span>
          </div>
          <div>
            <div className="font-semibold text-gray-900">{v}</div>
            <div className="text-xs text-gray-500">{row.employeeCode}</div>
          </div>
        </div>
      )
    },
    { key: 'department', label: 'Department', sortable: true,
      render: (v: string, row: ShiftAssignment) => (
        <div>
          <div className="font-medium text-gray-900">{v}</div>
          <div className="text-xs text-gray-500">{row.designation}</div>
        </div>
      )
    },
    { key: 'currentShift', label: 'Current Shift', sortable: true,
      render: (v: string, row: ShiftAssignment) => (
        <div>
          <div className="font-medium text-gray-900">{v}</div>
          <div className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium ${getShiftTypeColor(row.shiftType)}`}>
            {row.shiftType.toUpperCase()}
          </div>
        </div>
      )
    },
    { key: 'effectiveFrom', label: 'Effective From', sortable: true,
      render: (v: string) => (
        <div className="text-sm text-gray-900">
          {new Date(v).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
        </div>
      )
    },
    { key: 'status', label: 'Status', sortable: true,
      render: (v: string) => <StatusBadge status={v as BadgeStatus} />
    },
    { key: 'id', label: 'Actions', sortable: false,
      render: () => (
        <button className="flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium text-sm">
          <Edit className="w-4 h-4" />
          Change Shift
        </button>
      )
    }
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          <UserCheck className="h-8 w-8 text-blue-600" />
          Shift Assignment
        </h1>
        <p className="text-gray-600 mt-2">Manage and assign shifts to employees</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border-2 border-indigo-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Assigned</p>
              <p className="text-2xl font-bold text-indigo-600">{stats.total}</p>
            </div>
            <Users className="h-10 w-10 text-indigo-400" />
          </div>
        </div>
        <div className="bg-white border-2 border-yellow-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Day Shifts</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.dayShifts}</p>
            </div>
            <Clock className="h-10 w-10 text-yellow-400" />
          </div>
        </div>
        <div className="bg-white border-2 border-indigo-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Night Shifts</p>
              <p className="text-2xl font-bold text-indigo-600">{stats.nightShifts}</p>
            </div>
            <Clock className="h-10 w-10 text-indigo-400" />
          </div>
        </div>
        <div className="bg-white border-2 border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Flexible</p>
              <p className="text-2xl font-bold text-blue-600">{stats.flexibleShifts}</p>
            </div>
            <CheckCircle className="h-10 w-10 text-blue-400" />
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search by employee name or code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${
              showFilters ? 'bg-blue-50 border-blue-300 text-blue-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Filter className="h-4 w-4" />
            Filters
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Plus className="h-4 w-4" />
            Bulk Assign
          </button>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Departments</option>
                <option value="Production">Production</option>
                <option value="Quality">Quality</option>
                <option value="IT">IT</option>
                <option value="HR">HR</option>
                <option value="Finance">Finance</option>
                <option value="Logistics">Logistics</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Shift Type</label>
              <select
                value={selectedShiftType}
                onChange={(e) => setSelectedShiftType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Shift Types</option>
                <option value="day">Day</option>
                <option value="night">Night</option>
                <option value="morning">Morning</option>
                <option value="evening">Evening</option>
                <option value="flexible">Flexible</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Assignment Table */}
      <DataTable data={filteredData} columns={columns} />
    </div>
  );
}

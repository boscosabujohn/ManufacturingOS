'use client';

import { useState } from 'react';
import { Clock, Users, CheckCircle, AlertTriangle, Calendar, TrendingUp, User, Briefcase } from 'lucide-react';

interface ProbationEmployee {
  id: string;
  employeeCode: string;
  name: string;
  designation: string;
  department: string;
  joiningDate: string;
  probationPeriod: number; // in months
  probationEndDate: string;
  daysRemaining: number;
  completionPercentage: number;
  status: 'ongoing' | 'due_soon' | 'overdue' | 'completed' | 'extended';
  reportingManager: string;
  reviewsCompleted: number;
  totalReviews: number;
  performanceScore: number;
  lastReviewDate?: string;
  nextReviewDate?: string;
  recommendation?: 'confirm' | 'extend' | 'terminate' | 'pending';
}

export default function Page() {
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  const mockEmployees: ProbationEmployee[] = [
    {
      id: '1',
      employeeCode: 'EMP567',
      name: 'Arjun Nair',
      designation: 'Production Engineer',
      department: 'Production',
      joiningDate: '2025-04-15',
      probationPeriod: 6,
      probationEndDate: '2025-10-15',
      daysRemaining: 11,
      completionPercentage: 94,
      status: 'due_soon',
      reportingManager: 'Suresh Iyer',
      reviewsCompleted: 2,
      totalReviews: 3,
      performanceScore: 85,
      lastReviewDate: '2025-09-15',
      nextReviewDate: '2025-10-13',
      recommendation: 'confirm'
    },
    {
      id: '2',
      employeeCode: 'EMP589',
      name: 'Meera Gupta',
      designation: 'Quality Inspector',
      department: 'Quality',
      joiningDate: '2025-07-01',
      probationPeriod: 3,
      probationEndDate: '2025-10-01',
      daysRemaining: -25,
      completionPercentage: 100,
      status: 'overdue',
      reportingManager: 'Madhav Singh',
      reviewsCompleted: 2,
      totalReviews: 3,
      performanceScore: 78,
      lastReviewDate: '2025-09-01',
      recommendation: 'pending'
    },
    {
      id: '3',
      employeeCode: 'EMP601',
      name: 'Rahul Verma',
      designation: 'Maintenance Technician',
      department: 'Maintenance',
      joiningDate: '2025-08-01',
      probationPeriod: 6,
      probationEndDate: '2026-02-01',
      daysRemaining: 98,
      completionPercentage: 46,
      status: 'ongoing',
      reportingManager: 'Ramesh Nair',
      reviewsCompleted: 1,
      totalReviews: 3,
      performanceScore: 82,
      lastReviewDate: '2025-09-01',
      nextReviewDate: '2025-11-01'
    },
    {
      id: '4',
      employeeCode: 'EMP578',
      name: 'Priyanka Joshi',
      designation: 'HR Executive',
      department: 'Human Resources',
      joiningDate: '2025-06-01',
      probationPeriod: 3,
      probationEndDate: '2025-09-01',
      daysRemaining: 0,
      completionPercentage: 100,
      status: 'completed',
      reportingManager: 'Kavita Sharma',
      reviewsCompleted: 3,
      totalReviews: 3,
      performanceScore: 92,
      lastReviewDate: '2025-08-25',
      recommendation: 'confirm'
    },
    {
      id: '5',
      employeeCode: 'EMP612',
      name: 'Aditya Sharma',
      designation: 'IT Support Engineer',
      department: 'Information Technology',
      joiningDate: '2025-05-01',
      probationPeriod: 6,
      probationEndDate: '2026-01-01',
      daysRemaining: 67,
      completionPercentage: 63,
      status: 'extended',
      reportingManager: 'Vikram Singh',
      reviewsCompleted: 2,
      totalReviews: 4,
      performanceScore: 68,
      lastReviewDate: '2025-09-01',
      nextReviewDate: '2025-11-01',
      recommendation: 'extend'
    }
  ];

  const filteredEmployees = mockEmployees.filter(emp => {
    const matchesStatus = selectedStatus === 'all' || emp.status === selectedStatus;
    const matchesDept = selectedDepartment === 'all' || emp.department === selectedDepartment;
    return matchesStatus && matchesDept;
  });

  const stats = {
    total: mockEmployees.length,
    ongoing: mockEmployees.filter(e => e.status === 'ongoing').length,
    dueSoon: mockEmployees.filter(e => e.status === 'due_soon').length,
    overdue: mockEmployees.filter(e => e.status === 'overdue').length,
    avgPerformance: Math.round(
      mockEmployees.reduce((sum, e) => sum + e.performanceScore, 0) / mockEmployees.length
    )
  };

  const departments = ['all', ...Array.from(new Set(mockEmployees.map(e => e.department)))];

  const statusColors = {
    ongoing: 'bg-blue-100 text-blue-700',
    due_soon: 'bg-yellow-100 text-yellow-700',
    overdue: 'bg-red-100 text-red-700',
    completed: 'bg-green-100 text-green-700',
    extended: 'bg-purple-100 text-purple-700'
  };

  const recommendationColors = {
    confirm: 'bg-green-100 text-green-700',
    extend: 'bg-orange-100 text-orange-700',
    terminate: 'bg-red-100 text-red-700',
    pending: 'bg-gray-100 text-gray-700'
  };

  const getPerformanceColor = (score: number) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-blue-600';
    if (score >= 60) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <div className="w-full h-full px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Probation Tracking</h1>
        <p className="text-sm text-gray-600 mt-1">Monitor and manage employee probation periods</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Total on Probation</p>
              <p className="text-2xl font-bold text-blue-900 mt-1">{stats.total}</p>
            </div>
            <Users className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Ongoing</p>
              <p className="text-2xl font-bold text-green-900 mt-1">{stats.ongoing}</p>
            </div>
            <Clock className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4 border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-600">Due Soon</p>
              <p className="text-2xl font-bold text-yellow-900 mt-1">{stats.dueSoon}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4 border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-600">Overdue</p>
              <p className="text-2xl font-bold text-red-900 mt-1">{stats.overdue}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">Avg Performance</p>
              <p className="text-2xl font-bold text-purple-900 mt-1">{stats.avgPerformance}%</p>
            </div>
            <TrendingUp className="h-8 w-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="ongoing">Ongoing</option>
              <option value="due_soon">Due Soon</option>
              <option value="overdue">Overdue</option>
              <option value="completed">Completed</option>
              <option value="extended">Extended</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {departments.map(dept => (
                <option key={dept} value={dept}>
                  {dept === 'all' ? 'All Departments' : dept}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Employees Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Probation Period
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Progress
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reviews
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Performance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEmployees.map(emp => (
                <tr key={emp.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-semibold text-gray-900">{emp.name}</div>
                      <div className="text-sm text-gray-600">{emp.designation}</div>
                      <div className="text-xs text-gray-500">{emp.department} • {emp.employeeCode}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm text-gray-900">
                        {emp.probationPeriod} months
                      </div>
                      <div className="text-xs text-gray-600">
                        {emp.joiningDate} to {emp.probationEndDate}
                      </div>
                      <div className={`text-xs font-semibold mt-1 ${
                        emp.daysRemaining < 0 ? 'text-red-600' :
                        emp.daysRemaining < 15 ? 'text-yellow-600' :
                        'text-gray-600'
                      }`}>
                        {emp.daysRemaining < 0
                          ? `${Math.abs(emp.daysRemaining)} days overdue`
                          : `${emp.daysRemaining} days remaining`
                        }
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-semibold text-gray-900">
                          {emp.completionPercentage}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            emp.completionPercentage >= 100 ? 'bg-red-600' :
                            emp.completionPercentage >= 90 ? 'bg-yellow-600' :
                            'bg-blue-600'
                          }`}
                          style={{ width: `${Math.min(emp.completionPercentage, 100)}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-semibold text-gray-900">
                        {emp.reviewsCompleted}/{emp.totalReviews} completed
                      </div>
                      {emp.lastReviewDate && (
                        <div className="text-xs text-gray-600">
                          Last: {emp.lastReviewDate}
                        </div>
                      )}
                      {emp.nextReviewDate && (
                        <div className="text-xs text-blue-600">
                          Next: {emp.nextReviewDate}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className={`text-2xl font-bold ${getPerformanceColor(emp.performanceScore)}`}>
                      {emp.performanceScore}
                    </div>
                    {emp.recommendation && (
                      <span className={`inline-block mt-1 px-2 py-0.5 text-xs font-semibold rounded ${recommendationColors[emp.recommendation]}`}>
                        {emp.recommendation === 'confirm' ? 'Confirm' :
                         emp.recommendation === 'extend' ? 'Extend' :
                         emp.recommendation === 'terminate' ? 'Terminate' : 'Pending'}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusColors[emp.status]}`}>
                      {emp.status === 'due_soon' ? 'Due Soon' :
                       emp.status === 'ongoing' ? 'Ongoing' :
                       emp.status.charAt(0).toUpperCase() + emp.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-blue-600 hover:text-blue-800 font-medium text-sm">
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredEmployees.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200 mt-6">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No employees found</h3>
          <p className="text-gray-600">No employees match the selected filters</p>
        </div>
      )}
    </div>
  );
}

'use client';

import { useState, useMemo } from 'react';
import { Award, Search, Calendar, Users, DollarSign, TrendingUp, Star, CheckCircle } from 'lucide-react';

interface PerformanceIncrement {
  id: string;
  employeeId: string;
  employeeName: string;
  designation: string;
  department: string;
  currentCTC: number;
  currentBasic: number;
  performanceRating: 'outstanding' | 'excellent' | 'good' | 'average' | 'below';
  performanceScore: number;
  incrementPercentage: number;
  incrementAmount: number;
  revisedCTC: number;
  revisedBasic: number;
  effectiveDate: string;
  quarter: string;
  status: 'draft' | 'calculated' | 'approved' | 'processed' | 'implemented';
  approvedBy?: string;
  approvedDate?: string;
  implementedDate?: string;
  remarks?: string;
}

export default function PerformanceIncrementPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedQuarter, setSelectedQuarter] = useState('Q3-2025-26');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedRating, setSelectedRating] = useState('all');

  const mockIncrements: PerformanceIncrement[] = [
    {
      id: 'PI-2025-Q3-001',
      employeeId: 'EMP001',
      employeeName: 'Rajesh Kumar',
      designation: 'Senior Production Manager',
      department: 'Production',
      currentCTC: 597000,
      currentBasic: 240000,
      performanceRating: 'outstanding',
      performanceScore: 95,
      incrementPercentage: 8.0,
      incrementAmount: 47760,
      revisedCTC: 644760,
      revisedBasic: 259200,
      effectiveDate: '2026-01-01',
      quarter: 'Q3 (Oct-Dec 2025)',
      status: 'approved',
      approvedBy: 'HR Manager',
      approvedDate: '2025-12-15'
    },
    {
      id: 'PI-2025-Q3-002',
      employeeId: 'EMP002',
      employeeName: 'Priya Sharma',
      designation: 'Quality Control Supervisor',
      department: 'Quality',
      currentCTC: 431712,
      currentBasic: 174000,
      performanceRating: 'excellent',
      performanceScore: 88,
      incrementPercentage: 6.0,
      incrementAmount: 25903,
      revisedCTC: 457615,
      revisedBasic: 184440,
      effectiveDate: '2026-01-01',
      quarter: 'Q3 (Oct-Dec 2025)',
      status: 'approved',
      approvedBy: 'HR Manager',
      approvedDate: '2025-12-15'
    },
    {
      id: 'PI-2025-Q3-003',
      employeeId: 'EMP003',
      employeeName: 'Amit Patel',
      designation: 'Production Operator',
      department: 'Production',
      currentCTC: 262488,
      currentBasic: 105600,
      performanceRating: 'good',
      performanceScore: 78,
      incrementPercentage: 4.5,
      incrementAmount: 11812,
      revisedCTC: 274300,
      revisedBasic: 110352,
      effectiveDate: '2026-01-01',
      quarter: 'Q3 (Oct-Dec 2025)',
      status: 'calculated',
      approvedBy: undefined,
      approvedDate: undefined
    },
    {
      id: 'PI-2025-Q3-004',
      employeeId: 'EMP004',
      employeeName: 'Neha Singh',
      designation: 'Maintenance Engineer',
      department: 'Maintenance',
      currentCTC: 409212,
      currentBasic: 164700,
      performanceRating: 'excellent',
      performanceScore: 85,
      incrementPercentage: 5.5,
      incrementAmount: 22507,
      revisedCTC: 431719,
      revisedBasic: 173859,
      effectiveDate: '2026-01-01',
      quarter: 'Q3 (Oct-Dec 2025)',
      status: 'calculated',
      approvedBy: undefined,
      approvedDate: undefined
    },
    {
      id: 'PI-2025-Q3-005',
      employeeId: 'EMP005',
      employeeName: 'Vikram Desai',
      designation: 'Logistics Coordinator',
      department: 'Logistics',
      currentCTC: 379200,
      currentBasic: 152640,
      performanceRating: 'good',
      performanceScore: 80,
      incrementPercentage: 5.0,
      incrementAmount: 18960,
      revisedCTC: 398160,
      revisedBasic: 160272,
      effectiveDate: '2026-01-01',
      quarter: 'Q3 (Oct-Dec 2025)',
      status: 'draft',
      approvedBy: undefined,
      approvedDate: undefined
    },
    {
      id: 'PI-2025-Q3-006',
      employeeId: 'EMP006',
      employeeName: 'Kavita Mehta',
      designation: 'HR Executive',
      department: 'HR',
      currentCTC: 394188,
      currentBasic: 158640,
      performanceRating: 'excellent',
      performanceScore: 87,
      incrementPercentage: 6.5,
      incrementAmount: 25622,
      revisedCTC: 419810,
      revisedBasic: 169112,
      effectiveDate: '2026-01-01',
      quarter: 'Q3 (Oct-Dec 2025)',
      status: 'approved',
      approvedBy: 'HR Manager',
      approvedDate: '2025-12-16'
    }
  ];

  const filteredIncrements = useMemo(() => {
    return mockIncrements.filter(inc => {
      const matchesSearch =
        inc.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inc.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDepartment = selectedDepartment === 'all' || inc.department === selectedDepartment;
      const matchesStatus = selectedStatus === 'all' || inc.status === selectedStatus;
      const matchesRating = selectedRating === 'all' || inc.performanceRating === selectedRating;
      return matchesSearch && matchesDepartment && matchesStatus && matchesRating;
    });
  }, [searchTerm, selectedDepartment, selectedStatus, selectedRating]);

  const departments = ['all', 'Production', 'Quality', 'Maintenance', 'Logistics', 'HR'];
  const statuses = ['all', 'draft', 'calculated', 'approved', 'processed', 'implemented'];
  const ratings = ['all', 'outstanding', 'excellent', 'good', 'average', 'below'];

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const statusColors = {
    draft: 'bg-gray-100 text-gray-700',
    calculated: 'bg-blue-100 text-blue-700',
    approved: 'bg-green-100 text-green-700',
    processed: 'bg-purple-100 text-purple-700',
    implemented: 'bg-teal-100 text-teal-700'
  };

  const ratingColors = {
    outstanding: 'bg-purple-100 text-purple-700',
    excellent: 'bg-blue-100 text-blue-700',
    good: 'bg-green-100 text-green-700',
    average: 'bg-yellow-100 text-yellow-700',
    below: 'bg-red-100 text-red-700'
  };

  const totalStats = useMemo(() => {
    const stats = filteredIncrements.reduce((acc, inc) => ({
      employees: acc.employees + 1,
      totalCurrent: acc.totalCurrent + inc.currentCTC,
      totalIncrement: acc.totalIncrement + inc.incrementAmount,
      totalRevised: acc.totalRevised + inc.revisedCTC,
      avgPercentage: acc.avgPercentage + inc.incrementPercentage,
      approved: acc.approved + (inc.status === 'approved' ? 1 : 0)
    }), { employees: 0, totalCurrent: 0, totalIncrement: 0, totalRevised: 0, avgPercentage: 0, approved: 0 });

    if (stats.employees > 0) {
      stats.avgPercentage = stats.avgPercentage / stats.employees;
    }

    return stats;
  }, [filteredIncrements]);

  return (
    <div className="w-full h-full px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Performance Increment</h1>
        <p className="text-sm text-gray-600 mt-1">Quarterly performance-based salary increment</p>
      </div>

      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg shadow-sm border border-purple-200 p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Q3 2025-26 (Oct-Dec 2025)</h2>
            <p className="text-sm text-gray-600 mt-1">Performance Increment for Q3</p>
            <p className="text-xs text-gray-500 mt-1">Effective Date: 01-Jan-2026</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600">Total Employees</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{totalStats.employees}</p>
              </div>
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600">Current CTC</p>
                <p className="text-lg font-bold text-gray-900 mt-1">{formatCurrency(totalStats.totalCurrent)}</p>
              </div>
              <DollarSign className="h-6 w-6 text-gray-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600">Total Increment</p>
                <p className="text-lg font-bold text-gray-900 mt-1">{formatCurrency(totalStats.totalIncrement)}</p>
              </div>
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600">Revised CTC</p>
                <p className="text-lg font-bold text-gray-900 mt-1">{formatCurrency(totalStats.totalRevised)}</p>
              </div>
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600">Avg Increment</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{totalStats.avgPercentage.toFixed(1)}%</p>
              </div>
              <Star className="h-6 w-6 text-yellow-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{totalStats.approved}</p>
              </div>
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search by employee name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            {departments.map(dept => (
              <option key={dept} value={dept}>
                {dept === 'all' ? 'All Departments' : dept}
              </option>
            ))}
          </select>
          <select
            value={selectedRating}
            onChange={(e) => setSelectedRating(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            {ratings.map(rating => (
              <option key={rating} value={rating}>
                {rating === 'all' ? 'All Ratings' : rating.charAt(0).toUpperCase() + rating.slice(1)}
              </option>
            ))}
          </select>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            {statuses.map(status => (
              <option key={status} value={status}>
                {status === 'all' ? 'All Status' : status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {filteredIncrements.map(inc => (
          <div key={inc.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-bold text-gray-900">{inc.employeeName}</h3>
                  <span className="px-3 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-700">
                    {inc.employeeId}
                  </span>
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusColors[inc.status]}`}>
                    {inc.status.toUpperCase()}
                  </span>
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${ratingColors[inc.performanceRating]}`}>
                    {inc.performanceRating.toUpperCase()}
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  {inc.designation} • {inc.department}
                </p>
                <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Performance Score: {inc.performanceScore}% • Effective: {new Date(inc.effectiveDate).toLocaleDateString('en-IN')}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500 mb-1">Increment</p>
                <p className="text-2xl font-bold text-green-600">{inc.incrementPercentage}%</p>
                <p className="text-sm font-semibold text-green-600">{formatCurrency(inc.incrementAmount)}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h4 className="text-xs font-semibold text-gray-700 mb-3">Current Salary</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">Basic Salary</span>
                    <span className="font-medium text-gray-900">{formatCurrency(inc.currentBasic)}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">Current CTC</span>
                    <span className="font-medium text-gray-900">{formatCurrency(inc.currentCTC)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                <h4 className="text-xs font-semibold text-yellow-900 mb-3">Performance</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-yellow-700">Rating</span>
                    <span className="font-medium text-yellow-900 uppercase">{inc.performanceRating}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-yellow-700">Score</span>
                    <span className="font-medium text-yellow-900">{inc.performanceScore}%</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-yellow-700">Quarter</span>
                    <span className="font-medium text-yellow-900">{inc.quarter}</span>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <h4 className="text-xs font-semibold text-green-900 mb-3">Increment Details</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-green-700">Percentage</span>
                    <span className="font-medium text-green-900">{inc.incrementPercentage}%</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-green-700">Amount</span>
                    <span className="font-medium text-green-900">{formatCurrency(inc.incrementAmount)}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-green-700">Effective Date</span>
                    <span className="font-medium text-green-900">{new Date(inc.effectiveDate).toLocaleDateString('en-IN')}</span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <h4 className="text-xs font-semibold text-blue-900 mb-3">Revised Salary</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-blue-700">New Basic</span>
                    <span className="font-medium text-blue-900">{formatCurrency(inc.revisedBasic)}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-blue-700">Revised CTC</span>
                    <span className="font-medium text-blue-900">{formatCurrency(inc.revisedCTC)}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-blue-700">Increase</span>
                    <span className="font-medium text-blue-900">+{formatCurrency(inc.revisedCTC - inc.currentCTC)}</span>
                  </div>
                </div>
              </div>
            </div>

            {inc.approvedBy && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between text-xs text-gray-600">
                  <div>
                    <span className="font-semibold">Approved by:</span> {inc.approvedBy} on {inc.approvedDate && new Date(inc.approvedDate).toLocaleDateString('en-IN')}
                  </div>
                  {inc.remarks && (
                    <span className="italic">{inc.remarks}</span>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 bg-purple-50 border border-purple-200 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-purple-900 mb-2">Performance Increment Guidelines</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="text-xs font-bold text-purple-800 mb-2">Increment Criteria (Performance-based):</h4>
            <ul className="text-sm text-purple-800 space-y-1">
              <li>• <strong>Outstanding (90%+):</strong> 7-10% increment</li>
              <li>• <strong>Excellent (80-89%):</strong> 5-7% increment</li>
              <li>• <strong>Good (70-79%):</strong> 4-5% increment</li>
              <li>• <strong>Average (60-69%):</strong> 2-3% increment</li>
              <li>• <strong>Below (Below 60%):</strong> 0-2% or no increment</li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-bold text-purple-800 mb-2">Important Points:</h4>
            <ul className="text-sm text-purple-800 space-y-1">
              <li>• <strong>Frequency:</strong> Quarterly performance review (every 3 months)</li>
              <li>• <strong>Eligibility:</strong> Employees completing 6 months service</li>
              <li>• <strong>Effective Date:</strong> 1st of month following quarter-end</li>
              <li>• <strong>Review Cycle:</strong> Q1 (Apr-Jun), Q2 (Jul-Sep), Q3 (Oct-Dec), Q4 (Jan-Mar)</li>
              <li>• <strong>Approval:</strong> Requires Department Head and HR approval</li>
              <li>• <strong>Arrears:</strong> No arrears for performance increment</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

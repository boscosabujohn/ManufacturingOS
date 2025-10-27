'use client';

import { useState, useMemo } from 'react';
import { TrendingUp, Search, Download, CheckCircle, Clock, Calendar, DollarSign, Users, ArrowUp, Percent } from 'lucide-react';

interface AnnualIncrement {
  id: string;
  employeeId: string;
  employeeName: string;
  designation: string;
  department: string;
  effectiveDate: string;
  financialYear: string;
  currentCTC: number;
  currentBasic: number;
  incrementPercentage: number;
  incrementAmount: number;
  revisedCTC: number;
  revisedBasic: number;
  performanceRating: 'outstanding' | 'excellent' | 'good' | 'average' | 'below';
  status: 'draft' | 'calculated' | 'approved' | 'processed' | 'implemented';
  calculatedDate?: string;
  approvedDate?: string;
  implementedDate?: string;
}

export default function AnnualIncrementPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedYear, setSelectedYear] = useState('2025-26');

  const mockIncrements: AnnualIncrement[] = [
    {
      id: 'INC-2025-001',
      employeeId: 'EMP001',
      employeeName: 'Rajesh Kumar',
      designation: 'Senior Production Manager',
      department: 'Production',
      effectiveDate: '2025-04-01',
      financialYear: '2025-26',
      currentCTC: 596700,
      currentBasic: 30000,
      incrementPercentage: 12,
      incrementAmount: 71604,
      revisedCTC: 668304,
      revisedBasic: 33600,
      performanceRating: 'outstanding',
      status: 'approved',
      calculatedDate: '2025-03-15',
      approvedDate: '2025-03-20'
    },
    {
      id: 'INC-2025-002',
      employeeId: 'EMP002',
      employeeName: 'Priya Sharma',
      designation: 'Quality Control Supervisor',
      department: 'Quality',
      effectiveDate: '2025-04-01',
      financialYear: '2025-26',
      currentCTC: 431712,
      currentBasic: 21000,
      incrementPercentage: 10,
      incrementAmount: 43171,
      revisedCTC: 474883,
      revisedBasic: 23100,
      performanceRating: 'excellent',
      status: 'approved',
      calculatedDate: '2025-03-15',
      approvedDate: '2025-03-20'
    },
    {
      id: 'INC-2025-003',
      employeeId: 'EMP003',
      employeeName: 'Amit Patel',
      designation: 'Production Operator',
      department: 'Production',
      effectiveDate: '2025-04-01',
      financialYear: '2025-26',
      currentCTC: 262488,
      currentBasic: 13000,
      incrementPercentage: 7,
      incrementAmount: 18374,
      revisedCTC: 280862,
      revisedBasic: 13910,
      performanceRating: 'good',
      status: 'calculated',
      calculatedDate: '2025-03-16'
    },
    {
      id: 'INC-2025-004',
      employeeId: 'EMP004',
      employeeName: 'Neha Singh',
      designation: 'Maintenance Engineer',
      department: 'Maintenance',
      effectiveDate: '2025-04-01',
      financialYear: '2025-26',
      currentCTC: 409212,
      currentBasic: 20000,
      incrementPercentage: 9,
      incrementAmount: 36829,
      revisedCTC: 446041,
      revisedBasic: 21800,
      performanceRating: 'excellent',
      status: 'approved',
      calculatedDate: '2025-03-16',
      approvedDate: '2025-03-21'
    },
    {
      id: 'INC-2025-005',
      employeeId: 'EMP005',
      employeeName: 'Vikram Desai',
      designation: 'Logistics Coordinator',
      department: 'Logistics',
      effectiveDate: '2025-04-01',
      financialYear: '2025-26',
      currentCTC: 379200,
      currentBasic: 19000,
      incrementPercentage: 6,
      incrementAmount: 22752,
      revisedCTC: 401952,
      revisedBasic: 20140,
      performanceRating: 'average',
      status: 'calculated',
      calculatedDate: '2025-03-16'
    },
    {
      id: 'INC-2025-006',
      employeeId: 'EMP006',
      employeeName: 'Kavita Mehta',
      designation: 'HR Executive',
      department: 'HR',
      effectiveDate: '2025-04-01',
      financialYear: '2025-26',
      currentCTC: 394188,
      currentBasic: 19000,
      incrementPercentage: 8,
      incrementAmount: 31535,
      revisedCTC: 425723,
      revisedBasic: 20520,
      performanceRating: 'good',
      status: 'implemented',
      calculatedDate: '2025-03-15',
      approvedDate: '2025-03-20',
      implementedDate: '2025-04-01'
    }
  ];

  const filteredIncrements = useMemo(() => {
    return mockIncrements.filter(inc => {
      const matchesSearch =
        inc.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inc.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDepartment = selectedDepartment === 'all' || inc.department === selectedDepartment;
      const matchesStatus = selectedStatus === 'all' || inc.status === selectedStatus;
      const matchesYear = inc.financialYear === selectedYear;
      return matchesSearch && matchesDepartment && matchesStatus && matchesYear;
    });
  }, [searchTerm, selectedDepartment, selectedStatus, selectedYear]);

  const departments = ['all', 'Production', 'Quality', 'Maintenance', 'Logistics', 'HR'];
  const statuses = ['all', 'draft', 'calculated', 'approved', 'processed', 'implemented'];
  const years = ['2025-26', '2024-25', '2023-24'];

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const statusColors = {
    draft: 'bg-gray-100 text-gray-700',
    calculated: 'bg-blue-100 text-blue-700',
    approved: 'bg-purple-100 text-purple-700',
    processed: 'bg-cyan-100 text-cyan-700',
    implemented: 'bg-green-100 text-green-700'
  };

  const statusIcons = {
    draft: Clock,
    calculated: TrendingUp,
    approved: CheckCircle,
    processed: DollarSign,
    implemented: CheckCircle
  };

  const performanceColors = {
    outstanding: 'bg-green-100 text-green-700',
    excellent: 'bg-blue-100 text-blue-700',
    good: 'bg-cyan-100 text-cyan-700',
    average: 'bg-yellow-100 text-yellow-700',
    below: 'bg-red-100 text-red-700'
  };

  const stats = {
    totalEmployees: filteredIncrements.length,
    calculated: filteredIncrements.filter(i => ['calculated', 'approved', 'processed', 'implemented'].includes(i.status)).length,
    approved: filteredIncrements.filter(i => ['approved', 'processed', 'implemented'].includes(i.status)).length,
    implemented: filteredIncrements.filter(i => i.status === 'implemented').length,
    totalIncrementAmount: filteredIncrements.reduce((sum, i) => sum + i.incrementAmount, 0),
    avgIncrementPercent: Math.round(filteredIncrements.reduce((sum, i) => sum + i.incrementPercentage, 0) / filteredIncrements.length * 10) / 10
  };

  return (
    <div className="w-full h-full px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Annual Increment</h1>
        <p className="text-sm text-gray-600 mt-1">Yearly salary increment processing for FY {selectedYear}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg shadow-sm border border-blue-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-blue-700">Total Employees</p>
              <p className="text-2xl font-bold text-blue-900 mt-1">{stats.totalEmployees}</p>
            </div>
            <Users className="h-6 w-6 text-blue-600" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-lg shadow-sm border border-cyan-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-cyan-700">Calculated</p>
              <p className="text-2xl font-bold text-cyan-900 mt-1">{stats.calculated}</p>
            </div>
            <TrendingUp className="h-6 w-6 text-cyan-600" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg shadow-sm border border-purple-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-purple-700">Approved</p>
              <p className="text-2xl font-bold text-purple-900 mt-1">{stats.approved}</p>
            </div>
            <CheckCircle className="h-6 w-6 text-purple-600" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg shadow-sm border border-green-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-green-700">Implemented</p>
              <p className="text-2xl font-bold text-green-900 mt-1">{stats.implemented}</p>
            </div>
            <ArrowUp className="h-6 w-6 text-green-600" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg shadow-sm border border-orange-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-orange-700">Total Amount</p>
              <p className="text-lg font-bold text-orange-900 mt-1">{formatCurrency(stats.totalIncrementAmount)}</p>
            </div>
            <DollarSign className="h-6 w-6 text-orange-600" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg shadow-sm border border-yellow-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-yellow-700">Avg Increment</p>
              <p className="text-2xl font-bold text-yellow-900 mt-1">{stats.avgIncrementPercent}%</p>
            </div>
            <Percent className="h-6 w-6 text-yellow-600" />
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
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            {years.map(year => (
              <option key={year} value={year}>
                FY {year}
              </option>
            ))}
          </select>
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
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            {statuses.map(status => (
              <option key={status} value={status}>
                {status === 'all' ? 'All Status' : status.toUpperCase()}
              </option>
            ))}
          </select>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Download className="h-4 w-4" />
            Export
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {filteredIncrements.map(increment => {
          const StatusIcon = statusIcons[increment.status];

          return (
            <div key={increment.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-gray-900">{increment.employeeName}</h3>
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-700">
                      {increment.employeeId}
                    </span>
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full flex items-center gap-1 ${statusColors[increment.status]}`}>
                      <StatusIcon className="h-3 w-3" />
                      {increment.status.toUpperCase()}
                    </span>
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${performanceColors[increment.performanceRating]}`}>
                      {increment.performanceRating.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {increment.designation} • {increment.department}
                  </p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Effective: {new Date(increment.effectiveDate).toLocaleDateString('en-IN')}
                    </span>
                    {increment.approvedDate && (
                      <span>Approved: {new Date(increment.approvedDate).toLocaleDateString('en-IN')}</span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500 mb-1">Increment Amount</p>
                  <p className="text-2xl font-bold text-green-600">{formatCurrency(increment.incrementAmount)}</p>
                  <p className="text-xs text-gray-500 mt-1">{increment.incrementPercentage}% increase</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <h4 className="text-xs font-semibold text-blue-900 mb-3">Current Salary</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-blue-700">Basic Salary</span>
                      <span className="font-bold text-blue-900">{formatCurrency(increment.currentBasic)}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-blue-700">Total CTC</span>
                      <span className="font-medium text-blue-800">{formatCurrency(increment.currentCTC)}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <h4 className="text-xs font-semibold text-green-900 mb-3">Increment Details</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-green-700">Percentage</span>
                      <span className="font-bold text-green-900">{increment.incrementPercentage}%</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-green-700">Amount</span>
                      <span className="font-bold text-green-900">{formatCurrency(increment.incrementAmount)}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                  <h4 className="text-xs font-semibold text-purple-900 mb-3">Revised Salary</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-purple-700">Basic Salary</span>
                      <span className="font-bold text-purple-900">{formatCurrency(increment.revisedBasic)}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-purple-700">Total CTC</span>
                      <span className="font-medium text-purple-800">{formatCurrency(increment.revisedCTC)}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                  <h4 className="text-xs font-semibold text-orange-900 mb-3">Status & Dates</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-orange-700">Effective From</span>
                      <span className="font-medium text-orange-900">
                        {new Date(increment.effectiveDate).toLocaleDateString('en-IN')}
                      </span>
                    </div>
                    {increment.implementedDate && (
                      <div className="flex justify-between text-xs">
                        <span className="text-orange-700">Implemented</span>
                        <span className="font-medium text-orange-800">
                          {new Date(increment.implementedDate).toLocaleDateString('en-IN')}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-4 flex justify-end gap-2">
                <button className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
                  View Details
                </button>
                {increment.status === 'calculated' && (
                  <button className="px-4 py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                    Approve
                  </button>
                )}
                {increment.status === 'approved' && (
                  <button className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    Implement
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-blue-900 mb-2">Annual Increment Policy Guidelines</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
          <div className="bg-white p-3 rounded">
            <h4 className="text-xs font-bold text-blue-800 mb-2">Increment Percentage (Performance-Based)</h4>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• <strong>Outstanding:</strong> 12-15% of current CTC</li>
              <li>• <strong>Excellent:</strong> 9-12% of current CTC</li>
              <li>• <strong>Good:</strong> 7-9% of current CTC</li>
              <li>• <strong>Average:</strong> 5-7% of current CTC</li>
              <li>• <strong>Below:</strong> 0-5% of current CTC or no increment</li>
              <li>• Increment applied to all salary components proportionally</li>
            </ul>
          </div>
          <div className="bg-white p-3 rounded">
            <h4 className="text-xs font-bold text-blue-800 mb-2">Eligibility Criteria</h4>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• Minimum 12 months of service completed</li>
              <li>• Should be confirmed employee (probation completed)</li>
              <li>• No major disciplinary issues in the year</li>
              <li>• Attendance above 90%</li>
              <li>• Based on annual performance appraisal rating</li>
              <li>• Pro-rated for mid-year promotions or transfers</li>
            </ul>
          </div>
        </div>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• <strong>Effective Date:</strong> Usually April 1st (start of financial year)</li>
          <li>• <strong>Performance Review:</strong> Based on previous year's performance (Apr-Mar)</li>
          <li>• <strong>Appraisal Cycle:</strong> Annual appraisals conducted in Feb-Mar for Apr implementation</li>
          <li>• <strong>Budget Allocation:</strong> Overall increment budget typically 8-10% of total salary cost</li>
          <li>• <strong>Market Adjustment:</strong> Additional adjustments may be made based on market rates and retention needs</li>
          <li>• <strong>Arrears:</strong> If implementation delayed beyond Apr 1st, arrears paid for the delayed period</li>
          <li>• <strong>Impact:</strong> Increment affects all salary components - basic, HRA, allowances, PF, gratuity calculations</li>
          <li>• <strong>Letter:</strong> Increment letter issued to each employee detailing old and new salary structure</li>
        </ul>
      </div>
    </div>
  );
}

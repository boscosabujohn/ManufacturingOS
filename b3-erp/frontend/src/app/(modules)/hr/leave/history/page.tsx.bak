'use client';

import React, { useMemo, useState } from 'react';
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle,
  Clock,
  Download,
  Filter,
  PieChart,
  Search,
  TrendingUp,
  Users,
  XCircle,
} from 'lucide-react';
import Link from 'next/link';

type LeaveType = 'sick' | 'casual' | 'annual' | 'maternity' | 'paternity' | 'unpaid' | 'comp_off';
type LeaveStatus = 'approved' | 'rejected' | 'cancelled';

interface LeaveHistoryRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  leaveType: LeaveType;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  totalDays: number;
  status: LeaveStatus;
  approvedBy: string;
  approvedOn: string; // YYYY-MM-DD
}

const mockHistory: LeaveHistoryRecord[] = [
  {
    id: 'LV-090',
    employeeId: 'EMP-1001',
    employeeName: 'Rajesh Kumar',
    department: 'Production',
    leaveType: 'sick',
    startDate: '2025-09-12',
    endDate: '2025-09-13',
    totalDays: 2,
    status: 'approved',
    approvedBy: 'Production Manager',
    approvedOn: '2025-09-11',
  },
  {
    id: 'LV-091',
    employeeId: 'EMP-1002',
    employeeName: 'Priya Sharma',
    department: 'Quality Control',
    leaveType: 'annual',
    startDate: '2025-08-01',
    endDate: '2025-08-10',
    totalDays: 10,
    status: 'approved',
    approvedBy: 'QA Head',
    approvedOn: '2025-07-25',
  },
  {
    id: 'LV-092',
    employeeId: 'EMP-1010',
    employeeName: 'Farhan Ali',
    department: 'Logistics',
    leaveType: 'casual',
    startDate: '2025-10-05',
    endDate: '2025-10-05',
    totalDays: 1,
    status: 'rejected',
    approvedBy: 'Logistics Manager',
    approvedOn: '2025-10-04',
  },
  {
    id: 'LV-093',
    employeeId: 'EMP-1011',
    employeeName: 'Neha Gupta',
    department: 'Finance',
    leaveType: 'comp_off',
    startDate: '2025-09-28',
    endDate: '2025-09-28',
    totalDays: 1,
    status: 'approved',
    approvedBy: 'Finance Controller',
    approvedOn: '2025-09-26',
  },
  {
    id: 'LV-094',
    employeeId: 'EMP-1007',
    employeeName: 'Isha Mehta',
    department: 'HR',
    leaveType: 'unpaid',
    startDate: '2025-07-15',
    endDate: '2025-07-16',
    totalDays: 2,
    status: 'cancelled',
    approvedBy: 'HR Manager',
    approvedOn: '2025-07-14',
  },
];

function Badge({ children, color }: { children: React.ReactNode; color: string }) {
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${color}`}>{children}</span>
  );
}

function typeBadge(type: LeaveType) {
  const map: Record<LeaveType, { label: string; color: string }> = {
    sick: { label: 'Sick', color: 'bg-red-50 text-red-700 border-red-100' },
    casual: { label: 'Casual', color: 'bg-blue-50 text-blue-700 border-blue-100' },
    annual: { label: 'Annual', color: 'bg-purple-50 text-purple-700 border-purple-100' },
    maternity: { label: 'Maternity', color: 'bg-pink-50 text-pink-700 border-pink-100' },
    paternity: { label: 'Paternity', color: 'bg-indigo-50 text-indigo-700 border-indigo-100' },
    unpaid: { label: 'Unpaid', color: 'bg-gray-50 text-gray-700 border-gray-100' },
    comp_off: { label: 'Comp Off', color: 'bg-green-50 text-green-700 border-green-100' },
  };
  const t = map[type];
  return <Badge color={t.color}>{t.label}</Badge>;
}

function statusBadge(status: LeaveStatus) {
  const map: Record<LeaveStatus, { label: string; color: string }> = {
    approved: { label: 'Approved', color: 'bg-green-100 text-green-800 border-green-200' },
    rejected: { label: 'Rejected', color: 'bg-red-100 text-red-800 border-red-200' },
    cancelled: { label: 'Cancelled', color: 'bg-gray-100 text-gray-800 border-gray-200' },
  };
  const s = map[status];
  return <Badge color={s.color}>{s.label}</Badge>;
}

export default function LeaveHistoryPage() {
  const [search, setSearch] = useState('');
  const [dept, setDept] = useState('all');
  const [type, setType] = useState<LeaveType | 'all'>('all');
  const [status, setStatus] = useState<LeaveStatus | 'all'>('all');
  const [fromDate, setFromDate] = useState('2025-07-01');
  const [toDate, setToDate] = useState('2025-10-31');
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const filtered = useMemo(() => {
    const from = new Date(fromDate);
    const to = new Date(toDate);
    return mockHistory.filter((r) => {
      const matchesSearch =
        r.employeeName.toLowerCase().includes(search.toLowerCase()) ||
        r.employeeId.toLowerCase().includes(search.toLowerCase()) ||
        r.department.toLowerCase().includes(search.toLowerCase()) ||
        r.id.toLowerCase().includes(search.toLowerCase());
      const matchesDept = dept === 'all' || r.department === dept;
      const matchesType = type === 'all' || r.leaveType === type;
      const matchesStatus = status === 'all' || r.status === status;
      const start = new Date(r.startDate);
      const end = new Date(r.endDate);
      const inRange = start <= to && end >= from;
      return matchesSearch && matchesDept && matchesType && matchesStatus && inRange;
    });
  }, [search, dept, type, status, fromDate, toDate]);

  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  const totals = useMemo(() => {
    const sum = (s: LeaveStatus) => filtered.filter((r) => r.status === s).length;
    const typeSum = (t: LeaveType) => filtered.filter((r) => r.leaveType === t).length;
    const days = filtered.reduce((acc, r) => acc + r.totalDays, 0);
    return {
      approved: sum('approved'),
      rejected: sum('rejected'),
      cancelled: sum('cancelled'),
      days,
      byType: {
        sick: typeSum('sick'),
        casual: typeSum('casual'),
        annual: typeSum('annual'),
        maternity: typeSum('maternity'),
        paternity: typeSum('paternity'),
        unpaid: typeSum('unpaid'),
        comp_off: typeSum('comp_off'),
      },
    };
  }, [filtered]);

  return (
    <div className="w-full min-h-screen px-4 sm:px-6 lg:px-8 py-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Link
              href="/hr/leave"
              className="inline-flex items-center px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Leave
            </Link>
            <h1 className="text-xl font-semibold text-gray-900">Leave History</h1>
          </div>
          <div className="flex items-center space-x-2">
            <button className="flex items-center px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all">
              <Download className="w-4 h-4 mr-2" /> Export
            </button>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Approved</p>
                <p className="text-2xl font-bold mt-1 text-green-900">{totals.approved}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4 border border-red-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600">Rejected</p>
                <p className="text-2xl font-bold mt-1 text-red-900">{totals.rejected}</p>
              </div>
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
          </div>
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Cancelled</p>
                <p className="text-2xl font-bold mt-1 text-gray-900">{totals.cancelled}</p>
              </div>
              <Clock className="w-8 h-8 text-gray-600" />
            </div>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total Days</p>
                <p className="text-2xl font-bold mt-1 text-blue-900">{totals.days}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Search by name, ID, department or request ID..."
                />
              </div>
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={dept}
                onChange={(e) => setDept(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                <option value="all">All Departments</option>
                <option value="Production">Production</option>
                <option value="Quality Control">Quality Control</option>
                <option value="Engineering">Engineering</option>
                <option value="Finance">Finance</option>
                <option value="HR">HR</option>
                <option value="Logistics">Logistics</option>
                <option value="Procurement">Procurement</option>
              </select>
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={type}
                onChange={(e) => setType(e.target.value as LeaveType | 'all')}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                <option value="all">All Leave Types</option>
                <option value="sick">Sick</option>
                <option value="casual">Casual</option>
                <option value="annual">Annual</option>
                <option value="maternity">Maternity</option>
                <option value="paternity">Paternity</option>
                <option value="unpaid">Unpaid</option>
                <option value="comp_off">Comp Off</option>
              </select>
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as LeaveStatus | 'all')}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                <option value="all">All Status</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">From</label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">To</label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* By Type quick glance */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center mb-4">
            <PieChart className="w-5 h-5 text-indigo-600 mr-2" />
            <h2 className="text-base font-semibold text-gray-900">Breakdown by Leave Type</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {Object.entries(totals.byType).map(([t, count]) => (
              <div key={t} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-3 border border-gray-200">
                <div className="text-xs text-gray-500 mb-1">{t.replace('_', ' ')}</div>
                <div className="text-xl font-bold text-gray-900">{count}</div>
              </div>
            ))}
          </div>
        </div>

        {/* History table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto overflow-y-auto max-h-[calc(100vh-22rem)]">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Employee</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Department</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Start</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">End</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Days</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Approved By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paged.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{r.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{r.employeeName}</div>
                      <div className="text-xs text-gray-500">{r.employeeId}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{r.department}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{typeBadge(r.leaveType)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{r.startDate}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{r.endDate}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{r.totalDays}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{statusBadge(r.status)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{r.approvedBy}</td>
                  </tr>
                ))}
                {paged.length === 0 && (
                  <tr>
                    <td className="px-6 py-10 text-center text-gray-500" colSpan={9}>
                      No records found for the selected filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, filtered.length)} of {filtered.length} records
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  disabled={page === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    className={`px-4 py-2 border rounded-lg text-sm font-medium ${
                      page === i + 1
                        ? 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white border-transparent'
                        : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                  disabled={page === totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Small help */}
        <p className="text-xs text-gray-500 mt-4">
          Tip: Use the date range and filters above to analyze historical leave patterns by department, type, and status. Export to CSV for audits.
        </p>
      </div>
    </div>
  );
}

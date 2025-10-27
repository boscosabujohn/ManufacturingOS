'use client';

import { useState, useMemo } from 'react';
import { BarChart3, Download, Filter, Clock, Users, TrendingUp, AlertCircle, DollarSign } from 'lucide-react';
import DataTable from '@/components/DataTable';

interface ProjectHours {
  id: string;
  projectName: string;
  projectCode: string;
  teamMembers: number;
  totalHours: number;
  billableHours: number;
  nonBillableHours: number;
  budgetHours: number;
  utilizationPercent: number;
  status: 'active' | 'on_hold' | 'completed';
  startDate: string;
  endDate?: string;
}

export default function ProjectHoursPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('this_month');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  const mockProjects: ProjectHours[] = [
    {
      id: '1', projectName: 'Kitchen Manufacturing ERP', projectCode: 'KM-ERP-2024',
      teamMembers: 8, totalHours: 1456, billableHours: 1398, nonBillableHours: 58,
      budgetHours: 1600, utilizationPercent: 91, status: 'active',
      startDate: '2024-01-15'
    },
    {
      id: '2', projectName: 'Quality Control System', projectCode: 'QCS-2024',
      teamMembers: 6, totalHours: 978, billableHours: 945, nonBillableHours: 33,
      budgetHours: 1000, utilizationPercent: 98, status: 'active',
      startDate: '2024-03-01'
    },
    {
      id: '3', projectName: 'Inventory Management Upgrade', projectCode: 'IMU-2024',
      teamMembers: 5, totalHours: 789, billableHours: 678, nonBillableHours: 111,
      budgetHours: 800, utilizationPercent: 99, status: 'active',
      startDate: '2024-04-10'
    },
    {
      id: '4', projectName: 'Production Dashboard', projectCode: 'PD-2024',
      teamMembers: 4, totalHours: 534, billableHours: 512, nonBillableHours: 22,
      budgetHours: 600, utilizationPercent: 89, status: 'active',
      startDate: '2024-05-20'
    },
    {
      id: '5', projectName: 'HR Attendance System', projectCode: 'HRA-2024',
      teamMembers: 7, totalHours: 412, billableHours: 389, nonBillableHours: 23,
      budgetHours: 500, utilizationPercent: 82, status: 'active',
      startDate: '2024-06-01'
    },
    {
      id: '6', projectName: 'Logistics Tracking Portal', projectCode: 'LTP-2024',
      teamMembers: 5, totalHours: 356, billableHours: 340, nonBillableHours: 16,
      budgetHours: 400, utilizationPercent: 89, status: 'active',
      startDate: '2024-07-15'
    },
    {
      id: '7', projectName: 'Finance Reporting Module', projectCode: 'FRM-2023',
      teamMembers: 3, totalHours: 800, billableHours: 800, nonBillableHours: 0,
      budgetHours: 800, utilizationPercent: 100, status: 'completed',
      startDate: '2023-11-01', endDate: '2024-02-28'
    },
    {
      id: '8', projectName: 'Vendor Management System', projectCode: 'VMS-2024',
      teamMembers: 4, totalHours: 123, billableHours: 100, nonBillableHours: 23,
      budgetHours: 600, utilizationPercent: 21, status: 'on_hold',
      startDate: '2024-08-01'
    }
  ];

  const filteredData = useMemo(() => {
    return mockProjects.filter(project => {
      const matchesStatus = selectedStatus === 'all' || project.status === selectedStatus;
      return matchesStatus;
    });
  }, [selectedStatus]);

  const stats = {
    totalHours: filteredData.reduce((sum, p) => sum + p.totalHours, 0),
    billableHours: filteredData.reduce((sum, p) => sum + p.billableHours, 0),
    activeProjects: filteredData.filter(p => p.status === 'active').length,
    avgHoursPerProject: Math.round(filteredData.reduce((sum, p) => sum + p.totalHours, 0) / filteredData.length),
    billableRate: Math.round((filteredData.reduce((sum, p) => sum + p.billableHours, 0) /
                             filteredData.reduce((sum, p) => sum + p.totalHours, 0)) * 100)
  };

  const getStatusColor = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      on_hold: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-blue-100 text-blue-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      active: 'Active',
      on_hold: 'On Hold',
      completed: 'Completed'
    };
    return labels[status as keyof typeof labels] || status;
  };

  const getUtilizationColor = (percent: number) => {
    if (percent >= 95) return 'text-red-700';
    if (percent >= 80) return 'text-orange-700';
    if (percent >= 60) return 'text-green-700';
    return 'text-blue-700';
  };

  const columns = [
    { key: 'projectName', label: 'Project', sortable: true,
      render: (v: string, row: ProjectHours) => (
        <div>
          <div className="font-semibold text-gray-900">{v}</div>
          <div className="text-xs text-gray-500">{row.projectCode}</div>
        </div>
      )
    },
    { key: 'teamMembers', label: 'Team', sortable: true,
      render: (v: number) => (
        <div className="flex items-center gap-1 text-gray-900">
          <Users className="w-4 h-4 text-gray-500" />
          <span className="font-medium">{v}</span>
        </div>
      )
    },
    { key: 'totalHours', label: 'Total Hours', sortable: true,
      render: (v: number) => (
        <div className="flex items-center gap-1 text-blue-700">
          <Clock className="w-4 h-4" />
          <span className="font-bold">{v} hrs</span>
        </div>
      )
    },
    { key: 'billableHours', label: 'Billable', sortable: true,
      render: (v: number, row: ProjectHours) => (
        <div>
          <div className="font-semibold text-green-700">{v} hrs</div>
          <div className="text-xs text-gray-500">Non-bill: {row.nonBillableHours}</div>
        </div>
      )
    },
    { key: 'budgetHours', label: 'Budget', sortable: true,
      render: (v: number, row: ProjectHours) => (
        <div>
          <div className="font-medium text-gray-900">{v} hrs</div>
          <div className="text-xs text-gray-500">Used: {row.totalHours}</div>
        </div>
      )
    },
    { key: 'utilizationPercent', label: 'Utilization', sortable: true,
      render: (v: number) => (
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[100px]">
            <div
              className={`h-2 rounded-full ${
                v >= 95 ? 'bg-red-600' :
                v >= 80 ? 'bg-orange-600' :
                v >= 60 ? 'bg-green-600' :
                'bg-blue-600'
              }`}
              style={{ width: `${Math.min(v, 100)}%` }}
            />
          </div>
          <span className={`text-sm font-bold ${getUtilizationColor(v)}`}>{v}%</span>
        </div>
      )
    },
    { key: 'status', label: 'Status', sortable: true,
      render: (v: string) => (
        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(v)}`}>
          {getStatusLabel(v)}
        </span>
      )
    }
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          <BarChart3 className="h-8 w-8 text-blue-600" />
          Project Hours Tracking
        </h1>
        <p className="text-gray-600 mt-2">Monitor project-wise time allocation and utilization</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <div className="flex gap-4">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="this_week">This Week</option>
              <option value="last_week">Last Week</option>
              <option value="this_month">This Month</option>
              <option value="last_month">Last Month</option>
              <option value="this_quarter">This Quarter</option>
              <option value="this_year">This Year</option>
            </select>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Projects</option>
              <option value="active">Active Projects</option>
              <option value="on_hold">On Hold</option>
              <option value="completed">Completed Projects</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${
                showFilters ? 'bg-blue-50 border-blue-300 text-blue-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Filter className="h-4 w-4" />
              More Filters
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <Download className="h-4 w-4" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white border-2 border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Hours</p>
              <p className="text-2xl font-bold text-blue-600">{stats.totalHours}</p>
            </div>
            <Clock className="h-10 w-10 text-blue-400" />
          </div>
        </div>
        <div className="bg-white border-2 border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Billable Hours</p>
              <p className="text-2xl font-bold text-green-600">{stats.billableHours}</p>
            </div>
            <DollarSign className="h-10 w-10 text-green-400" />
          </div>
        </div>
        <div className="bg-white border-2 border-yellow-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Projects</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.activeProjects}</p>
            </div>
            <TrendingUp className="h-10 w-10 text-yellow-400" />
          </div>
        </div>
        <div className="bg-white border-2 border-purple-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Hours/Project</p>
              <p className="text-2xl font-bold text-purple-600">{stats.avgHoursPerProject}</p>
            </div>
            <BarChart3 className="h-10 w-10 text-purple-400" />
          </div>
        </div>
        <div className="bg-white border-2 border-indigo-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Billable Rate</p>
              <p className="text-2xl font-bold text-indigo-600">{stats.billableRate}%</p>
            </div>
            <TrendingUp className="h-10 w-10 text-indigo-400" />
          </div>
        </div>
      </div>

      {/* Over-budget Alert */}
      {filteredData.some(p => p.utilizationPercent >= 95) && (
        <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-red-600" />
            <div>
              <h3 className="font-semibold text-red-900">Projects Over Budget</h3>
              <p className="text-sm text-red-700">
                {filteredData.filter(p => p.utilizationPercent >= 95).length} project(s) are nearing or exceeding budget hours.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Project Hours Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Project Hours Breakdown</h2>
        <DataTable data={filteredData} columns={columns} />
      </div>

      {/* Additional Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Projects by Hours */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            Top Projects by Hours
          </h3>
          <div className="space-y-3">
            {filteredData
              .filter(p => p.status === 'active')
              .sort((a, b) => b.totalHours - a.totalHours)
              .slice(0, 5)
              .map((project, idx) => (
                <div key={project.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      idx === 0 ? 'bg-yellow-100 text-yellow-700' :
                      idx === 1 ? 'bg-gray-200 text-gray-700' :
                      idx === 2 ? 'bg-orange-100 text-orange-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {idx + 1}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{project.projectName}</div>
                      <div className="text-xs text-gray-500">{project.teamMembers} members</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-blue-600">{project.totalHours} hrs</div>
                    <div className="text-xs text-gray-500">{project.utilizationPercent}% utilized</div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Billable vs Non-Billable */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-green-600" />
            Billable Hours Analysis
          </h3>
          <div className="space-y-4">
            {filteredData
              .filter(p => p.status === 'active')
              .sort((a, b) => b.billableHours - a.billableHours)
              .slice(0, 5)
              .map((project) => {
                const billablePercent = (project.billableHours / project.totalHours) * 100;
                return (
                  <div key={project.id}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium text-gray-900">{project.projectName}</div>
                      <div className="text-sm font-semibold text-green-700">
                        {project.billableHours}/{project.totalHours} hrs
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${billablePercent}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{billablePercent.toFixed(1)}% billable</div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}

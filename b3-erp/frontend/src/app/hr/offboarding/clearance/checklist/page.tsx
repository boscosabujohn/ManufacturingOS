'use client';

import { CheckSquare, Check, X, Clock } from 'lucide-react';

interface ClearanceItem {
  id: string;
  employeeId: string;
  employeeName: string;
  designation: string;
  department: string;
  lastWorkingDay: string;
  clearanceItems: {
    it: 'pending' | 'in-progress' | 'completed';
    hr: 'pending' | 'in-progress' | 'completed';
    finance: 'pending' | 'in-progress' | 'completed';
    assets: 'pending' | 'in-progress' | 'completed';
    admin: 'pending' | 'in-progress' | 'completed';
  };
  overallStatus: 'pending' | 'in-progress' | 'completed';
  completionPercentage: number;
}

export default function ClearanceChecklistPage() {
  const mockClearances: ClearanceItem[] = [
    {
      id: 'CLR001',
      employeeId: 'EMP001',
      employeeName: 'Rahul Sharma',
      designation: 'Senior Software Engineer',
      department: 'Engineering',
      lastWorkingDay: '2025-12-14',
      clearanceItems: {
        it: 'completed',
        hr: 'completed',
        finance: 'in-progress',
        assets: 'completed',
        admin: 'pending'
      },
      overallStatus: 'in-progress',
      completionPercentage: 60
    },
    {
      id: 'CLR002',
      employeeId: 'EMP002',
      employeeName: 'Priya Singh',
      designation: 'Marketing Manager',
      department: 'Marketing',
      lastWorkingDay: '2025-11-19',
      clearanceItems: {
        it: 'pending',
        hr: 'pending',
        finance: 'pending',
        assets: 'pending',
        admin: 'pending'
      },
      overallStatus: 'pending',
      completionPercentage: 0
    }
  ];

  const stats = {
    total: mockClearances.length,
    pending: mockClearances.filter(c => c.overallStatus === 'pending').length,
    inProgress: mockClearances.filter(c => c.overallStatus === 'in-progress').length,
    completed: mockClearances.filter(c => c.overallStatus === 'completed').length
  };

  const statusIcons = {
    pending: <Clock className="h-4 w-4 text-yellow-600" />,
    'in-progress': <Clock className="h-4 w-4 text-blue-600" />,
    completed: <Check className="h-4 w-4 text-green-600" />
  };

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-700',
    'in-progress': 'bg-blue-100 text-blue-700',
    completed: 'bg-green-100 text-green-700'
  };

  const departmentLabels = {
    it: 'IT Department',
    hr: 'HR Department',
    finance: 'Finance Department',
    assets: 'Assets Department',
    admin: 'Administration'
  };

  return (
    <div className="w-full h-full px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Exit Clearance Checklist</h1>
        <p className="text-sm text-gray-600 mt-1">Track departmental clearance status for exiting employees</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Total</p>
              <p className="text-2xl font-bold text-blue-900 mt-1">{stats.total}</p>
            </div>
            <CheckSquare className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4 border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-900 mt-1">{stats.pending}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">In Progress</p>
              <p className="text-2xl font-bold text-blue-900 mt-1">{stats.inProgress}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Completed</p>
              <p className="text-2xl font-bold text-green-900 mt-1">{stats.completed}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {mockClearances.map(clearance => (
          <div key={clearance.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-bold text-gray-900">{clearance.employeeName}</h3>
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusColors[clearance.overallStatus]}`}>
                    {clearance.overallStatus.replace('-', ' ').toUpperCase()}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{clearance.designation} • {clearance.department}</p>
                <p className="text-xs text-gray-500 mt-1">Last Working Day: {new Date(clearance.lastWorkingDay).toLocaleDateString('en-IN')}</p>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Overall Clearance Progress</span>
                <span className="font-semibold text-gray-900">{clearance.completionPercentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="h-3 rounded-full bg-blue-600 transition-all"
                  style={{ width: `${clearance.completionPercentage}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              {Object.entries(clearance.clearanceItems).map(([dept, status]) => (
                <div key={dept} className={`p-3 rounded-lg border-2 ${
                  status === 'completed' ? 'border-green-200 bg-green-50' :
                  status === 'in-progress' ? 'border-blue-200 bg-blue-50' :
                  'border-gray-200 bg-gray-50'
                }`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-gray-700">{departmentLabels[dept as keyof typeof departmentLabels]}</span>
                    {statusIcons[status]}
                  </div>
                  <span className={`text-xs font-semibold ${
                    status === 'completed' ? 'text-green-700' :
                    status === 'in-progress' ? 'text-blue-700' :
                    'text-yellow-700'
                  }`}>
                    {status.replace('-', ' ').toUpperCase()}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex gap-2 pt-4 mt-4 border-t border-gray-200">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm">
                View Detailed Status
              </button>
              <button className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg font-medium text-sm">
                Send Reminder
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

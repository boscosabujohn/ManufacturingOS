'use client';

import { useState } from 'react';
import { Grid, User, TrendingUp, Star } from 'lucide-react';

interface Employee {
  id: string;
  name: string;
  employeeCode: string;
  position: string;
  department: string;
  performance: 'low' | 'medium' | 'high';
  potential: 'low' | 'medium' | 'high';
  box: string;
}

export default function Page() {
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  const mockEmployees: Employee[] = [
    { id: '1', name: 'Rajesh Kumar', employeeCode: 'EMP001', position: 'CTO', department: 'IT', performance: 'high', potential: 'high', box: 'high-high' },
    { id: '2', name: 'Priya Sharma', employeeCode: 'EMP002', position: 'VP Sales', department: 'Sales', performance: 'high', potential: 'high', box: 'high-high' },
    { id: '3', name: 'Amit Patel', employeeCode: 'EMP003', position: 'Marketing Manager', department: 'Marketing', performance: 'high', potential: 'medium', box: 'high-medium' },
    { id: '4', name: 'Neha Gupta', employeeCode: 'EMP004', position: 'Finance Manager', department: 'Finance', performance: 'medium', potential: 'high', box: 'medium-high' },
    { id: '5', name: 'Vikram Singh', employeeCode: 'EMP005', position: 'Operations Lead', department: 'Operations', performance: 'high', potential: 'medium', box: 'high-medium' },
    { id: '6', name: 'Sunita Reddy', employeeCode: 'EMP006', position: 'HR Manager', department: 'HR', performance: 'medium', potential: 'high', box: 'medium-high' },
    { id: '7', name: 'Arjun Kapoor', employeeCode: 'EMP007', position: 'Sales Lead', department: 'Sales', performance: 'medium', potential: 'medium', box: 'medium-medium' },
    { id: '8', name: 'Kavita Singh', employeeCode: 'EMP008', position: 'IT Lead', department: 'IT', performance: 'high', potential: 'high', box: 'high-high' },
    { id: '9', name: 'Rohan Mehta', employeeCode: 'EMP009', position: 'Production Supervisor', department: 'Operations', performance: 'medium', potential: 'medium', box: 'medium-medium' },
    { id: '10', name: 'Divya Nair', employeeCode: 'EMP010', position: 'Financial Analyst', department: 'Finance', performance: 'medium', potential: 'high', box: 'medium-high' },
    { id: '11', name: 'Karthik Iyer', employeeCode: 'EMP011', position: 'Quality Manager', department: 'Quality', performance: 'high', potential: 'medium', box: 'high-medium' },
    { id: '12', name: 'Anjali Desai', employeeCode: 'EMP012', position: 'Marketing Executive', department: 'Marketing', performance: 'low', potential: 'medium', box: 'low-medium' },
    { id: '13', name: 'Sanjay Verma', employeeCode: 'EMP013', position: 'Sales Executive', department: 'Sales', performance: 'medium', potential: 'low', box: 'medium-low' },
    { id: '14', name: 'Meera Shah', employeeCode: 'EMP014', position: 'HR Executive', department: 'HR', performance: 'low', potential: 'high', box: 'low-high' },
    { id: '15', name: 'Rahul Khanna', employeeCode: 'EMP015', position: 'IT Developer', department: 'IT', performance: 'medium', potential: 'medium', box: 'medium-medium' },
  ];

  const filteredEmployees = mockEmployees.filter(emp =>
    selectedDepartment === 'all' || emp.department === selectedDepartment
  );

  const getEmployeesInBox = (performance: string, potential: string) => {
    return filteredEmployees.filter(emp =>
      emp.performance === performance && emp.potential === potential
    );
  };

  const getBoxColor = (performance: string, potential: string) => {
    if (performance === 'high' && potential === 'high') return 'bg-green-50 border-green-300';
    if (performance === 'high' && potential === 'medium') return 'bg-blue-50 border-blue-300';
    if (performance === 'high' && potential === 'low') return 'bg-orange-50 border-orange-300';
    if (performance === 'medium' && potential === 'high') return 'bg-teal-50 border-teal-300';
    if (performance === 'medium' && potential === 'medium') return 'bg-yellow-50 border-yellow-300';
    if (performance === 'medium' && potential === 'low') return 'bg-gray-50 border-gray-300';
    if (performance === 'low' && potential === 'high') return 'bg-purple-50 border-purple-300';
    if (performance === 'low' && potential === 'medium') return 'bg-pink-50 border-pink-300';
    return 'bg-red-50 border-red-300';
  };

  const getBoxTitle = (performance: string, potential: string) => {
    if (performance === 'high' && potential === 'high') return 'Stars';
    if (performance === 'high' && potential === 'medium') return 'Core Players';
    if (performance === 'high' && potential === 'low') return 'Solid Performers';
    if (performance === 'medium' && potential === 'high') return 'High Potentials';
    if (performance === 'medium' && potential === 'medium') return 'Key Contributors';
    if (performance === 'medium' && potential === 'low') return 'Solid Citizens';
    if (performance === 'low' && potential === 'high') return 'Rough Diamonds';
    if (performance === 'low' && potential === 'medium') return 'Inconsistent';
    return 'Low Performers';
  };

  const getBoxDescription = (performance: string, potential: string) => {
    if (performance === 'high' && potential === 'high') return 'Ready for C-suite roles';
    if (performance === 'high' && potential === 'medium') return 'Strong in current role';
    if (performance === 'high' && potential === 'low') return 'Maximize in current role';
    if (performance === 'medium' && potential === 'high') return 'Fast-track development';
    if (performance === 'medium' && potential === 'medium') return 'Steady contributors';
    if (performance === 'medium' && potential === 'low') return 'Support & maintain';
    if (performance === 'low' && potential === 'high') return 'Need performance coaching';
    if (performance === 'low' && potential === 'medium') return 'Require close monitoring';
    return 'Performance improvement plan';
  };

  const stats = {
    stars: getEmployeesInBox('high', 'high').length,
    highPotential: getEmployeesInBox('medium', 'high').length,
    core: getEmployeesInBox('high', 'medium').length,
    total: filteredEmployees.length
  };

  return (
    <div className="w-full h-full px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Grid className="h-6 w-6 text-teal-600" />
          Succession Matrix (9-Box Grid)
        </h1>
        <p className="text-sm text-gray-600 mt-1">Performance vs Potential talent assessment matrix</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
          <div className="flex items-center gap-2 mb-1">
            <Star className="h-5 w-5 text-green-600" />
            <p className="text-sm font-medium text-green-600">Stars</p>
          </div>
          <p className="text-2xl font-bold text-green-900">{stats.stars}</p>
          <p className="text-xs text-green-600 mt-1">High Performance + High Potential</p>
        </div>
        <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-lg p-4 border border-teal-200">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="h-5 w-5 text-teal-600" />
            <p className="text-sm font-medium text-teal-600">High Potentials</p>
          </div>
          <p className="text-2xl font-bold text-teal-900">{stats.highPotential}</p>
          <p className="text-xs text-teal-600 mt-1">Medium Performance + High Potential</p>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center gap-2 mb-1">
            <User className="h-5 w-5 text-blue-600" />
            <p className="text-sm font-medium text-blue-600">Core Players</p>
          </div>
          <p className="text-2xl font-bold text-blue-900">{stats.core}</p>
          <p className="text-xs text-blue-600 mt-1">High Performance + Medium Potential</p>
        </div>
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 border border-gray-200">
          <p className="text-sm font-medium text-gray-600">Total Employees</p>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          <p className="text-xs text-gray-600 mt-1">In current view</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-gray-700">Filter by Department:</label>
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="all">All Departments</option>
            <option value="IT">IT</option>
            <option value="Sales">Sales</option>
            <option value="Marketing">Marketing</option>
            <option value="Finance">Finance</option>
            <option value="Operations">Operations</option>
            <option value="HR">HR</option>
            <option value="Quality">Quality</option>
          </select>
        </div>
      </div>

      {/* 9-Box Grid */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="mb-4">
          <h2 className="text-lg font-bold text-gray-900 mb-2">Performance-Potential Matrix</h2>
          <p className="text-sm text-gray-600">Drag and drop employees to update their assessment (demo only)</p>
        </div>

        {/* Y-axis label */}
        <div className="flex">
          <div className="flex flex-col justify-center mr-4 w-16">
            <div className="transform -rotate-90 whitespace-nowrap">
              <p className="text-sm font-bold text-gray-700">POTENTIAL →</p>
            </div>
          </div>

          {/* Grid */}
          <div className="flex-1">
            {/* High Potential Row */}
            <div className="grid grid-cols-3 gap-4 mb-4">
              {['low', 'medium', 'high'].map((perf) => {
                const employees = getEmployeesInBox(perf, 'high');
                return (
                  <div
                    key={`high-${perf}`}
                    className={`${getBoxColor(perf, 'high')} rounded-lg border-2 p-4 min-h-[200px]`}
                  >
                    <div className="mb-3">
                      <h3 className="text-sm font-bold text-gray-900">{getBoxTitle(perf, 'high')}</h3>
                      <p className="text-xs text-gray-600">{getBoxDescription(perf, 'high')}</p>
                      <p className="text-xs text-gray-500 mt-1">{employees.length} employees</p>
                    </div>
                    <div className="space-y-2">
                      {employees.map((emp) => (
                        <div key={emp.id} className="bg-white rounded p-2 shadow-sm border border-gray-200">
                          <p className="text-xs font-semibold text-gray-900">{emp.name}</p>
                          <p className="text-xs text-gray-600">{emp.position}</p>
                          <p className="text-xs text-gray-500">{emp.employeeCode}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Medium Potential Row */}
            <div className="grid grid-cols-3 gap-4 mb-4">
              {['low', 'medium', 'high'].map((perf) => {
                const employees = getEmployeesInBox(perf, 'medium');
                return (
                  <div
                    key={`medium-${perf}`}
                    className={`${getBoxColor(perf, 'medium')} rounded-lg border-2 p-4 min-h-[200px]`}
                  >
                    <div className="mb-3">
                      <h3 className="text-sm font-bold text-gray-900">{getBoxTitle(perf, 'medium')}</h3>
                      <p className="text-xs text-gray-600">{getBoxDescription(perf, 'medium')}</p>
                      <p className="text-xs text-gray-500 mt-1">{employees.length} employees</p>
                    </div>
                    <div className="space-y-2">
                      {employees.map((emp) => (
                        <div key={emp.id} className="bg-white rounded p-2 shadow-sm border border-gray-200">
                          <p className="text-xs font-semibold text-gray-900">{emp.name}</p>
                          <p className="text-xs text-gray-600">{emp.position}</p>
                          <p className="text-xs text-gray-500">{emp.employeeCode}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Low Potential Row */}
            <div className="grid grid-cols-3 gap-4 mb-4">
              {['low', 'medium', 'high'].map((perf) => {
                const employees = getEmployeesInBox(perf, 'low');
                return (
                  <div
                    key={`low-${perf}`}
                    className={`${getBoxColor(perf, 'low')} rounded-lg border-2 p-4 min-h-[200px]`}
                  >
                    <div className="mb-3">
                      <h3 className="text-sm font-bold text-gray-900">{getBoxTitle(perf, 'low')}</h3>
                      <p className="text-xs text-gray-600">{getBoxDescription(perf, 'low')}</p>
                      <p className="text-xs text-gray-500 mt-1">{employees.length} employees</p>
                    </div>
                    <div className="space-y-2">
                      {employees.map((emp) => (
                        <div key={emp.id} className="bg-white rounded p-2 shadow-sm border border-gray-200">
                          <p className="text-xs font-semibold text-gray-900">{emp.name}</p>
                          <p className="text-xs text-gray-600">{emp.position}</p>
                          <p className="text-xs text-gray-500">{emp.employeeCode}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* X-axis labels */}
            <div className="grid grid-cols-3 gap-4 mt-2">
              <div className="text-center">
                <p className="text-sm font-bold text-gray-700">Low Performance</p>
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-gray-700">Medium Performance</p>
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-gray-700">High Performance</p>
              </div>
            </div>
            <div className="text-center mt-2">
              <p className="text-sm font-bold text-gray-700">← PERFORMANCE</p>
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Action Guidelines</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-green-700">Stars (High-High)</h4>
            <p className="text-xs text-gray-600">• Succession planning for C-suite</p>
            <p className="text-xs text-gray-600">• Leadership development programs</p>
            <p className="text-xs text-gray-600">• Retention strategies critical</p>
          </div>
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-teal-700">High Potentials (Medium-High)</h4>
            <p className="text-xs text-gray-600">• Fast-track development programs</p>
            <p className="text-xs text-gray-600">• Stretch assignments</p>
            <p className="text-xs text-gray-600">• Performance coaching needed</p>
          </div>
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-blue-700">Core Players (High-Medium)</h4>
            <p className="text-xs text-gray-600">• Recognize and reward performance</p>
            <p className="text-xs text-gray-600">• Lateral development opportunities</p>
            <p className="text-xs text-gray-600">• Expert/specialist tracks</p>
          </div>
        </div>
      </div>
    </div>
  );
}

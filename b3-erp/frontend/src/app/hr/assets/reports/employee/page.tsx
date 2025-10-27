'use client';

import { useState } from 'react';
import { User, Laptop, Monitor, Smartphone, Package } from 'lucide-react';

interface EmployeeAsset {
  employeeName: string;
  employeeCode: string;
  department: string;
  designation: string;
  laptop?: string;
  desktop?: string;
  mobile?: string;
  monitor?: string;
  furniture: string[];
  totalAssets: number;
  totalValue: number;
  location: string;
}

export default function Page() {
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const mockData: EmployeeAsset[] = [
    {
      employeeName: 'Rajesh Kumar',
      employeeCode: 'EMP345',
      department: 'Sales',
      designation: 'Senior Sales Manager',
      laptop: 'LAP-2024-001 (Dell Latitude 5420)',
      mobile: 'MOB-2024-001 (Samsung Galaxy S21)',
      monitor: 'MON-2024-015 (Dell P2422H 24")',
      furniture: ['Desk', 'Chair'],
      totalAssets: 5,
      totalValue: 145000,
      location: 'Mumbai Office'
    },
    {
      employeeName: 'Vikram Singh',
      employeeCode: 'EMP198',
      department: 'IT',
      designation: 'IT Manager',
      laptop: 'LAP-2023-045 (Lenovo ThinkPad X1)',
      desktop: 'DESK-2024-002 (HP Elite 800 G8)',
      mobile: 'MOB-2024-012 (iPhone 13)',
      monitor: 'MON-2024-028 (LG 27" 4K)',
      furniture: ['Executive Desk', 'Ergonomic Chair', 'Cabinet'],
      totalAssets: 8,
      totalValue: 285000,
      location: 'Pune Office'
    },
    {
      employeeName: 'Priya Sharma',
      employeeCode: 'EMP412',
      department: 'Marketing',
      designation: 'Marketing Executive',
      laptop: 'LAP-2024-023 (Dell Latitude 5420)',
      mobile: 'MOB-2024-018 (Samsung Galaxy S21)',
      monitor: 'MON-2024-032 (HP E24 24")',
      furniture: ['Desk', 'Chair'],
      totalAssets: 5,
      totalValue: 135000,
      location: 'Delhi Office'
    },
    {
      employeeName: 'Sneha Reddy',
      employeeCode: 'EMP523',
      department: 'HR',
      designation: 'HR Executive',
      laptop: 'LAP-2024-012 (HP EliteBook 840)',
      mobile: 'MOB-2024-005 (iPhone 12)',
      monitor: 'MON-2024-019 (Dell P2422H 24")',
      furniture: ['Desk', 'Chair', 'Cabinet'],
      totalAssets: 6,
      totalValue: 155000,
      location: 'Hyderabad Office'
    },
    {
      employeeName: 'Arjun Kapoor',
      employeeCode: 'EMP890',
      department: 'Sales',
      designation: 'Sales Executive',
      laptop: 'LAP-2024-035 (Lenovo ThinkPad E14)',
      mobile: 'MOB-2024-025 (OnePlus 11)',
      monitor: 'MON-2024-042 (HP E24 24")',
      furniture: ['Desk', 'Chair'],
      totalAssets: 5,
      totalValue: 125000,
      location: 'Delhi Office'
    },
    {
      employeeName: 'Ramesh Iyer',
      employeeCode: 'EMP001',
      department: 'Management',
      designation: 'CTO',
      laptop: 'LAP-2024-001 (MacBook Pro 16")',
      desktop: 'DESK-2024-001 (iMac 27")',
      mobile: 'MOB-2024-001 (iPhone 14 Pro)',
      monitor: 'MON-2024-001 (Dell UltraSharp 32")',
      furniture: ['Executive Desk', 'Executive Chair', 'Meeting Table', 'Cabinet'],
      totalAssets: 9,
      totalValue: 485000,
      location: 'Mumbai Office'
    }
  ];

  const filteredData = mockData.filter(emp => {
    if (selectedDepartment !== 'all' && emp.department !== selectedDepartment) return false;
    if (searchQuery && !emp.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) && !emp.employeeCode.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const stats = {
    totalEmployees: mockData.length,
    totalAssets: mockData.reduce((sum, emp) => sum + emp.totalAssets, 0),
    totalValue: mockData.reduce((sum, emp) => sum + emp.totalValue, 0),
    avgAssetsPerEmployee: (mockData.reduce((sum, emp) => sum + emp.totalAssets, 0) / mockData.length).toFixed(1)
  };

  return (
    <div className="w-full h-full px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Employee-wise Assets Report</h1>
        <p className="text-sm text-gray-600 mt-1">Individual employee asset allocation details</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
          <p className="text-sm font-medium text-blue-600">Total Employees</p>
          <p className="text-2xl font-bold text-blue-900 mt-1">{stats.totalEmployees}</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
          <p className="text-sm font-medium text-green-600">Total Assets</p>
          <p className="text-2xl font-bold text-green-900 mt-1">{stats.totalAssets}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
          <p className="text-sm font-medium text-purple-600">Avg/Employee</p>
          <p className="text-2xl font-bold text-purple-900 mt-1">{stats.avgAssetsPerEmployee}</p>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
          <p className="text-sm font-medium text-orange-600">Total Value</p>
          <p className="text-2xl font-bold text-orange-900 mt-1">₹{(stats.totalValue / 100000).toFixed(2)}L</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
            <select value={selectedDepartment} onChange={(e) => setSelectedDepartment(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="all">All Departments</option>
              <option value="Sales">Sales</option>
              <option value="IT">IT</option>
              <option value="Marketing">Marketing</option>
              <option value="HR">HR</option>
              <option value="Finance">Finance</option>
              <option value="Management">Management</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search Employee</label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Name or Code..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-end">
            <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm">
              Export Report
            </button>
          </div>
          <div className="flex items-end">
            <button className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium text-sm">
              Print Report
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {filteredData.map((emp, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 bg-blue-50 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{emp.employeeName}</h3>
                  <p className="text-sm text-gray-600">{emp.employeeCode} • {emp.designation} • {emp.department}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500 uppercase font-medium mb-1">Asset Value</p>
                <p className="text-2xl font-bold text-blue-600">₹{emp.totalValue.toLocaleString('en-IN')}</p>
                <p className="text-xs text-gray-600 mt-1">{emp.totalAssets} assets</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {emp.laptop && (
                <div className="bg-blue-50 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Laptop className="h-4 w-4 text-blue-600" />
                    <p className="text-xs text-blue-600 uppercase font-medium">Laptop</p>
                  </div>
                  <p className="text-sm font-semibold text-blue-900">{emp.laptop}</p>
                </div>
              )}
              {emp.desktop && (
                <div className="bg-purple-50 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Monitor className="h-4 w-4 text-purple-600" />
                    <p className="text-xs text-purple-600 uppercase font-medium">Desktop</p>
                  </div>
                  <p className="text-sm font-semibold text-purple-900">{emp.desktop}</p>
                </div>
              )}
              {emp.mobile && (
                <div className="bg-green-50 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Smartphone className="h-4 w-4 text-green-600" />
                    <p className="text-xs text-green-600 uppercase font-medium">Mobile</p>
                  </div>
                  <p className="text-sm font-semibold text-green-900">{emp.mobile}</p>
                </div>
              )}
              {emp.monitor && (
                <div className="bg-orange-50 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Monitor className="h-4 w-4 text-orange-600" />
                    <p className="text-xs text-orange-600 uppercase font-medium">Monitor</p>
                  </div>
                  <p className="text-sm font-semibold text-orange-900">{emp.monitor}</p>
                </div>
              )}
            </div>

            {emp.furniture.length > 0 && (
              <div className="bg-gray-50 rounded-lg p-3 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Package className="h-4 w-4 text-gray-600" />
                  <p className="text-xs text-gray-600 uppercase font-medium">Furniture & Others</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {emp.furniture.map((item, idx) => (
                    <span key={idx} className="px-2 py-1 bg-white text-gray-700 text-xs rounded border border-gray-200">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Location:</span> {emp.location}
              </p>
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium text-sm">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

'use client';

import { useState, useMemo } from 'react';
import { Building, Laptop, Monitor, Smartphone } from 'lucide-react';

interface DepartmentAssets {
  department: string;
  employees: number;
  laptops: number;
  desktops: number;
  mobiles: number;
  monitors: number;
  furniture: number;
  totalValue: number;
  assetsPerEmployee: number;
}

export default function Page() {
  const [sortBy, setSortBy] = useState('department');

  const mockData: DepartmentAssets[] = [
    {
      department: 'Sales',
      employees: 45,
      laptops: 42,
      desktops: 5,
      mobiles: 45,
      monitors: 47,
      furniture: 90,
      totalValue: 4850000,
      assetsPerEmployee: 5.1
    },
    {
      department: 'IT',
      employees: 28,
      laptops: 28,
      desktops: 15,
      mobiles: 28,
      monitors: 56,
      furniture: 56,
      totalValue: 5200000,
      assetsPerEmployee: 6.5
    },
    {
      department: 'HR',
      employees: 12,
      laptops: 12,
      desktops: 2,
      mobiles: 12,
      monitors: 14,
      furniture: 24,
      totalValue: 1450000,
      assetsPerEmployee: 5.3
    },
    {
      department: 'Marketing',
      employees: 18,
      laptops: 18,
      desktops: 3,
      mobiles: 18,
      monitors: 21,
      furniture: 36,
      totalValue: 2150000,
      assetsPerEmployee: 5.3
    },
    {
      department: 'Finance',
      employees: 15,
      laptops: 15,
      desktops: 8,
      mobiles: 15,
      monitors: 23,
      furniture: 30,
      totalValue: 1980000,
      assetsPerEmployee: 6.1
    },
    {
      department: 'Operations',
      employees: 35,
      laptops: 30,
      desktops: 12,
      mobiles: 35,
      monitors: 42,
      furniture: 70,
      totalValue: 3650000,
      assetsPerEmployee: 5.4
    }
  ];

  const stats = useMemo(() => {
    const totals = mockData.reduce((acc, dept) => ({
      employees: acc.employees + dept.employees,
      laptops: acc.laptops + dept.laptops,
      desktops: acc.desktops + dept.desktops,
      mobiles: acc.mobiles + dept.mobiles,
      monitors: acc.monitors + dept.monitors,
      furniture: acc.furniture + dept.furniture,
      totalValue: acc.totalValue + dept.totalValue
    }), { employees: 0, laptops: 0, desktops: 0, mobiles: 0, monitors: 0, furniture: 0, totalValue: 0 });

    return {
      ...totals,
      departments: mockData.length,
      avgAssetsPerEmployee: (totals.laptops + totals.desktops + totals.mobiles + totals.monitors + totals.furniture) / totals.employees
    };
  }, [mockData]);

  return (
    <div className="w-full h-full px-3 py-2">
      <div className="mb-3">
        <h1 className="text-2xl font-bold text-gray-900">Department-wise Assets Report</h1>
        <p className="text-sm text-gray-600 mt-1">Asset distribution across departments</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-2 mb-3">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-3 border border-blue-200">
          <p className="text-sm font-medium text-blue-600">Departments</p>
          <p className="text-2xl font-bold text-blue-900 mt-1">{stats.departments}</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-3 border border-green-200">
          <p className="text-sm font-medium text-green-600">Total Employees</p>
          <p className="text-2xl font-bold text-green-900 mt-1">{stats.employees}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-3 border border-purple-200">
          <p className="text-sm font-medium text-purple-600">IT Assets</p>
          <p className="text-2xl font-bold text-purple-900 mt-1">{stats.laptops + stats.desktops}</p>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-3 border border-orange-200">
          <p className="text-sm font-medium text-orange-600">Total Value</p>
          <p className="text-2xl font-bold text-orange-900 mt-1">₹{(stats.totalValue / 10000000).toFixed(2)}Cr</p>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-3 border border-blue-200">
          <p className="text-sm font-medium text-blue-600">Avg/Employee</p>
          <p className="text-2xl font-bold text-blue-900 mt-1">{stats.avgAssetsPerEmployee.toFixed(1)}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 mb-3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="department">Department Name</option>
              <option value="employees">Employee Count</option>
              <option value="value">Total Value</option>
            </select>
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

      <div className="space-y-2">
        {mockData.map((dept, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 bg-blue-50 rounded-lg flex items-center justify-center">
                  <Building className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{dept.department}</h3>
                  <p className="text-sm text-gray-600">{dept.employees} Employees • {dept.assetsPerEmployee.toFixed(1)} assets per employee</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500 uppercase font-medium mb-1">Department Value</p>
                <p className="text-2xl font-bold text-blue-600">₹{(dept.totalValue / 100000).toFixed(2)}L</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              <div className="bg-blue-50 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Laptop className="h-4 w-4 text-blue-600" />
                  <p className="text-xs text-blue-600 uppercase font-medium">Laptops</p>
                </div>
                <p className="text-xl font-bold text-blue-700">{dept.laptops}</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Monitor className="h-4 w-4 text-purple-600" />
                  <p className="text-xs text-purple-600 uppercase font-medium">Desktops</p>
                </div>
                <p className="text-xl font-bold text-purple-700">{dept.desktops}</p>
              </div>
              <div className="bg-green-50 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Smartphone className="h-4 w-4 text-green-600" />
                  <p className="text-xs text-green-600 uppercase font-medium">Mobiles</p>
                </div>
                <p className="text-xl font-bold text-green-700">{dept.mobiles}</p>
              </div>
              <div className="bg-orange-50 rounded-lg p-3">
                <p className="text-xs text-orange-600 uppercase font-medium mb-1">Monitors</p>
                <p className="text-xl font-bold text-orange-700">{dept.monitors}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-600 uppercase font-medium mb-1">Furniture</p>
                <p className="text-xl font-bold text-gray-700">{dept.furniture}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

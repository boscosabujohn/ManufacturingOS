'use client';

import React, { useState } from 'react';
import {
  Building,
  Search,
  Filter,
  Download,
  Users,
  Target,
  Award,
  TrendingUp
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ComposedChart,
  Line,
  Cell
} from 'recharts';

// Mock Data
const departmentData = [
  { name: 'Engineering', employees: 42, trained: 38, completionRate: 90, avgScore: 88, budget: 120000, spend: 105000, fill: '#8b5cf6' },
  { name: 'Sales', employees: 35, trained: 28, completionRate: 80, avgScore: 82, budget: 90000, spend: 85000, fill: '#f59e0b' },
  { name: 'Marketing', employees: 20, trained: 18, completionRate: 90, avgScore: 85, budget: 45000, spend: 38000, fill: '#ec4899' },
  { name: 'HR & Ops', employees: 15, trained: 15, completionRate: 100, avgScore: 92, budget: 30000, spend: 22000, fill: '#3b82f6' },
  { name: 'Product', employees: 12, trained: 10, completionRate: 83, avgScore: 86, budget: 35000, spend: 28000, fill: '#10b981' },
];

export default function DepartmentReportsPage() {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(value);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Building className="h-8 w-8 text-purple-600" />
            Department Training Reports
          </h1>
          <p className="text-gray-500 mt-1">Comparative analysis across departments</p>
        </div>
        <div className="flex gap-3">
          <button className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm transition-colors">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Completion Rate Comparison */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Training Completion Rate (%)</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentData} layout="vertical" margin={{ top: 0, right: 30, left: 40, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e5e7eb" />
                <XAxis type="number" domain={[0, 100]} />
                <YAxis dataKey="name" type="category" width={80} axisLine={false} tickLine={false} tick={{ fill: '#4b5563', fontSize: 12 }} />
                <Tooltip cursor={{ fill: '#f3f4f6' }} contentStyle={{ borderRadius: '8px' }} formatter={(val: number) => [`${val}%`, 'Completion']} />
                <Bar dataKey="completionRate" radius={[0, 4, 4, 0]} barSize={24}>
                  {departmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Budget Utilization Comparison */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Budget Utilization</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={departmentData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid stroke="#f5f5f5" />
                <XAxis dataKey="name" scale="band" />
                <YAxis tickFormatter={(val) => `$${val / 1000}k`} />
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Legend />
                <Bar dataKey="budget" barSize={20} fill="#e5e7eb" name="Allocated Budget" />
                <Bar dataKey="spend" barSize={20} fill="#8b5cf6" name="Actual Spend" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Department Breakdown Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-900">Department Performance Details</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-xs uppercase font-semibold text-gray-500">
              <tr>
                <th className="px-6 py-4">Department</th>
                <th className="px-6 py-4 text-center">Employees Trained</th>
                <th className="px-6 py-4 text-center">Avg. Assessment Score</th>
                <th className="px-6 py-4 text-center">Completion Rate</th>
                <th className="px-6 py-4 text-right">Total Spend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {departmentData.map((dept, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900 flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: dept.fill }}></div>
                    {dept.name}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="font-medium text-gray-900">{dept.trained}</span>
                    <span className="text-gray-400"> / {dept.employees}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${dept.avgScore >= 85 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                      {dept.avgScore}%
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-sm font-medium">{dept.completionRate}%</span>
                      <div className="w-16 bg-gray-200 rounded-full h-1.5">
                        <div className="bg-purple-600 h-1.5 rounded-full" style={{ width: `${dept.completionRate}%` }}></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right font-medium text-gray-900">{formatCurrency(dept.spend)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

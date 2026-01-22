'use client';

import React, { useState } from 'react';
import {
  TrendingUp,
  Search,
  Filter,
  ArrowDown,
  ArrowUp,
  Download,
  Calendar,
  AlertCircle
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

// Mock Data
const burnRateData = [
  { month: 'Jan', planned: 25000, actual: 22000 },
  { month: 'Feb', planned: 50000, actual: 48000 },
  { month: 'Mar', planned: 75000, actual: 82000 },
  { month: 'Apr', planned: 100000, actual: 95000 },
  { month: 'May', planned: 125000, actual: 121000 },
  { month: 'Jun', planned: 150000, actual: 140000 },
];

const categoryData = [
  { category: 'External Workshops', spend: 85000, budget: 100000 },
  { category: 'Online Courses', spend: 35000, budget: 50000 },
  { category: 'Software Tools', spend: 15000, budget: 20000 },
  { category: 'Internal Training', spend: 5000, budget: 30000 },
];

const expenses = [
  { id: 1, description: 'Leadership Summit Tickets', category: 'External Workshops', date: '2025-05-15', amount: 4500, department: 'Engineering' },
  { id: 2, description: 'Udemy Annual Subscription', category: 'Online Courses', date: '2025-05-10', amount: 12000, department: 'All' },
  { id: 3, description: 'Project Management Seminar', category: 'External Workshops', date: '2025-04-22', amount: 2800, department: 'Product' },
  { id: 4, description: 'Cloud AWS Certification Vouchers', category: 'Online Courses', date: '2025-04-05', amount: 5000, department: 'Engineering' },
];

export default function BudgetTrackingPage() {
  const [timeRange, setTimeRange] = useState('YTD');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(value);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <TrendingUp className="h-8 w-8 text-purple-600" />
            Budget Tracking
          </h1>
          <p className="text-gray-500 mt-1">Monitor training expenses and forecast</p>
        </div>
        <div className="flex gap-3">
          <select
            className="bg-white border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block p-2.5"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <option>Year to Date (YTD)</option>
            <option>Last Quarter</option>
            <option>Last Month</option>
          </select>
          <button className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm transition-colors">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-gray-500 text-sm font-medium">Total Spent (YTD)</p>
          <div className="flex items-center gap-2 mt-2">
            <h2 className="text-3xl font-bold text-gray-900">{formatCurrency(140000)}</h2>
            <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full font-medium flex items-center">
              <ArrowDown className="w-3 h-3 mr-1" /> 5% vs Budget
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-2">Budget: {formatCurrency(150000)}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-gray-500 text-sm font-medium">Projected End-Year</p>
          <div className="flex items-center gap-2 mt-2">
            <h2 className="text-3xl font-bold text-gray-900">{formatCurrency(290000)}</h2>
            <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full font-medium flex items-center">
              On Track
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-2">Annual Budget: {formatCurrency(300000)}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-gray-500 text-sm font-medium">Avg. Cost per Employee</p>
          <div className="flex items-center gap-2 mt-2">
            <h2 className="text-3xl font-bold text-gray-900">$850</h2>
            <span className="text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full font-medium flex items-center">
              <ArrowUp className="w-3 h-3 mr-1" /> 2% vs Last Year
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-2">Target: $800</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Burn Rate Chart */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Budget Burn Rate</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={burnRateData} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#6b7280' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280' }} tickFormatter={(val) => `$${val / 1000}k`} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }} formatter={(val: number) => formatCurrency(val)} />
                <Legend verticalAlign="top" height={36} />
                <Line type="monotone" dataKey="planned" stroke="#9ca3af" strokeDasharray="5 5" name="Planned Budget" />
                <Line type="monotone" dataKey="actual" stroke="#8b5cf6" strokeWidth={3} name="Actual Spend" activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Spend by Category</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} layout="vertical" margin={{ top: 0, right: 30, left: 40, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e5e7eb" />
                <XAxis type="number" hide />
                <YAxis dataKey="category" type="category" width={100} axisLine={false} tickLine={false} tick={{ fill: '#4b5563', fontSize: 13 }} />
                <Tooltip cursor={{ fill: '#f3f4f6' }} contentStyle={{ borderRadius: '8px' }} formatter={(val: number) => formatCurrency(val)} />
                <Legend verticalAlign="top" height={36} />
                <Bar dataKey="spend" fill="#8b5cf6" radius={[0, 4, 4, 0]} name="Used" barSize={20} />
                <Bar dataKey="budget" fill="#f3f4f6" radius={[0, 4, 4, 0]} name="Total Allocated" barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Expenses Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900">Recent Transactions</h3>
          <div className="flex gap-2">
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
              <Filter className="w-4 h-4" />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-xs uppercase font-semibold text-gray-500">
              <tr>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Description</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Department</th>
                <th className="px-6 py-4 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {expenses.map((expense) => (
                <tr key={expense.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium">{expense.date}</td>
                  <td className="px-6 py-4 text-gray-900">{expense.description}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center rounded-md bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700 ring-1 ring-inset ring-purple-700/10">
                      {expense.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{expense.department}</td>
                  <td className="px-6 py-4 text-right font-medium text-gray-900">{formatCurrency(expense.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

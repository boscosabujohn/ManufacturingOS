'use client';

import { useState } from 'react';
import { BarChart3, TrendingUp, Users, Calendar, MapPin, CreditCard, Download, FileText } from 'lucide-react';

export default function Page() {
  const [selectedPeriod, setSelectedPeriod] = useState('current-month');
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  const travelStats = {
    totalTrips: 45,
    totalExpenses: 2450000,
    avgTripCost: 54444,
    totalAdvances: 750000,
    cardExpenses: 1650000,
    cashExpenses: 550000,
    outstandingSettlements: 12,
    pendingApprovals: 8
  };

  const departmentData = [
    { name: 'Sales', trips: 18, expenses: 980000, avgCost: 54444 },
    { name: 'Engineering', trips: 12, expenses: 720000, avgCost: 60000 },
    { name: 'Operations', trips: 8, expenses: 450000, avgCost: 56250 },
    { name: 'Quality', trips: 4, expenses: 180000, avgCost: 45000 },
    { name: 'Maintenance', trips: 3, expenses: 120000, avgCost: 40000 }
  ];

  const topTravelers = [
    { name: 'Rajesh Kumar', trips: 8, expenses: 420000 },
    { name: 'Priya Sharma', trips: 6, expenses: 380000 },
    { name: 'Amit Singh', trips: 5, expenses: 290000 },
    { name: 'Meena Rao', trips: 4, expenses: 185000 },
    { name: 'Suresh Patel', trips: 4, expenses: 160000 }
  ];

  const expenseBreakdown = [
    { category: 'Accommodation', amount: 980000, percentage: 40 },
    { category: 'Transport', amount: 735000, percentage: 30 },
    { category: 'Meals', amount: 490000, percentage: 20 },
    { category: 'Fuel', amount: 147000, percentage: 6 },
    { category: 'Other', amount: 98000, percentage: 4 }
  ];

  const monthlyTrend = [
    { month: 'Jun', trips: 38, expenses: 2100000 },
    { month: 'Jul', trips: 42, expenses: 2300000 },
    { month: 'Aug', trips: 36, expenses: 1950000 },
    { month: 'Sep', trips: 40, expenses: 2200000 },
    { month: 'Oct', trips: 44, expenses: 2400000 },
    { month: 'Nov', trips: 45, expenses: 2450000 }
  ];

  const topDestinations = [
    { city: 'Bangalore', trips: 12, expenses: 620000 },
    { city: 'Mumbai', trips: 10, expenses: 580000 },
    { city: 'Delhi', trips: 8, expenses: 520000 },
    { city: 'Pune', trips: 7, expenses: 360000 },
    { city: 'Chennai', trips: 5, expenses: 280000 }
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          <BarChart3 className="h-8 w-8 text-blue-600" />
          Travel Analytics & Reports
        </h1>
        <p className="text-gray-600 mt-2">Comprehensive travel expense analytics and insights</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Time Period:</label>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="current-month">Current Month</option>
              <option value="last-month">Last Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Department:</label>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Departments</option>
              <option value="sales">Sales</option>
              <option value="engineering">Engineering</option>
              <option value="operations">Operations</option>
              <option value="quality">Quality</option>
            </select>
          </div>
          <div className="md:col-span-2 flex items-end gap-2">
            <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm">
              <Download className="h-4 w-4" />
              Export Excel
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium text-sm">
              <FileText className="h-4 w-4" />
              Generate PDF
            </button>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <Calendar className="h-8 w-8 text-blue-600" />
            <span className="text-sm font-medium text-blue-600">Total Trips</span>
          </div>
          <p className="text-3xl font-bold text-blue-900">{travelStats.totalTrips}</p>
          <p className="text-sm text-blue-700 mt-1">This period</p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="h-8 w-8 text-green-600" />
            <span className="text-sm font-medium text-green-600">Total Expenses</span>
          </div>
          <p className="text-3xl font-bold text-green-900">₹{(travelStats.totalExpenses / 100000).toFixed(2)}L</p>
          <p className="text-sm text-green-700 mt-1">+8% from last period</p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 border border-purple-200">
          <div className="flex items-center justify-between mb-2">
            <CreditCard className="h-8 w-8 text-purple-600" />
            <span className="text-sm font-medium text-purple-600">Avg Trip Cost</span>
          </div>
          <p className="text-3xl font-bold text-purple-900">₹{(travelStats.avgTripCost / 1000).toFixed(1)}k</p>
          <p className="text-sm text-purple-700 mt-1">Per trip average</p>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-6 border border-orange-200">
          <div className="flex items-center justify-between mb-2">
            <Users className="h-8 w-8 text-orange-600" />
            <span className="text-sm font-medium text-orange-600">Pending</span>
          </div>
          <p className="text-3xl font-bold text-orange-900">{travelStats.pendingApprovals}</p>
          <p className="text-sm text-orange-700 mt-1">Awaiting approval</p>
        </div>
      </div>

      {/* Payment Mode Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Payment Mode Distribution</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-700">Corporate Card</span>
                <span className="text-sm font-bold text-blue-600">₹{(travelStats.cardExpenses / 100000).toFixed(1)}L (67%)</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{width: '67%'}}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-700">Advance</span>
                <span className="text-sm font-bold text-orange-600">₹{(travelStats.totalAdvances / 100000).toFixed(1)}L (31%)</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-orange-600 h-2 rounded-full" style={{width: '31%'}}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-700">Cash</span>
                <span className="text-sm font-bold text-green-600">₹{(travelStats.cashExpenses / 1000).toFixed(0)}k (2%)</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{width: '2%'}}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Expense Category Breakdown</h3>
          <div className="space-y-3">
            {expenseBreakdown.map((item) => (
              <div key={item.category}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-700">{item.category}</span>
                  <span className="text-sm font-bold text-gray-900">₹{(item.amount / 100000).toFixed(2)}L ({item.percentage}%)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full"
                    style={{width: `${item.percentage}%`}}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Department-wise Analysis */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Department-wise Travel Analysis</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Trips</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Expenses</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Avg Cost/Trip</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">% of Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {departmentData.map((dept) => (
                <tr key={dept.name} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">{dept.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{dept.trips}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">₹{(dept.expenses / 100000).toFixed(2)}L</td>
                  <td className="px-6 py-4 text-sm text-gray-700">₹{(dept.avgCost / 1000).toFixed(1)}k</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{((dept.expenses / travelStats.totalExpenses) * 100).toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top Travelers and Destinations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-600" />
            Top Travelers
          </h3>
          <div className="space-y-3">
            {topTravelers.map((traveler, idx) => (
              <div key={traveler.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full font-bold text-sm">
                    {idx + 1}
                  </span>
                  <div>
                    <p className="font-semibold text-gray-900">{traveler.name}</p>
                    <p className="text-xs text-gray-600">{traveler.trips} trips</p>
                  </div>
                </div>
                <span className="font-bold text-blue-600">₹{(traveler.expenses / 1000).toFixed(0)}k</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <MapPin className="h-5 w-5 text-green-600" />
            Top Destinations
          </h3>
          <div className="space-y-3">
            {topDestinations.map((dest, idx) => (
              <div key={dest.city} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 bg-green-600 text-white rounded-full font-bold text-sm">
                    {idx + 1}
                  </span>
                  <div>
                    <p className="font-semibold text-gray-900">{dest.city}</p>
                    <p className="text-xs text-gray-600">{dest.trips} trips</p>
                  </div>
                </div>
                <span className="font-bold text-green-600">₹{(dest.expenses / 1000).toFixed(0)}k</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Monthly Trend */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">6-Month Trend</h3>
        <div className="space-y-4">
          {monthlyTrend.map((month) => (
            <div key={month.month}>
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-4">
                  <span className="font-semibold text-gray-900 w-12">{month.month}</span>
                  <span className="text-sm text-gray-600">{month.trips} trips</span>
                </div>
                <span className="font-bold text-blue-600">₹{(month.expenses / 100000).toFixed(2)}L</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-300"
                  style={{width: `${(month.expenses / 2500000) * 100}%`}}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-blue-900 mb-2">Report Notes</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• All amounts are in INR and exclude pending approvals</li>
          <li>• Corporate card expenses are reconciled with bank statements</li>
          <li>• Department allocation based on employee's primary department</li>
          <li>• Reports can be exported in Excel or PDF format for further analysis</li>
          <li>• Custom date ranges available for detailed historical analysis</li>
        </ul>
      </div>
    </div>
  );
}

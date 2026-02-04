'use client';

import { useState } from 'react';
import { History, MapPin, Calendar, IndianRupee, Plane, TrendingUp, Download } from 'lucide-react';

interface TravelHistory {
  id: string;
  tripNumber: string;
  employeeName: string;
  department: string;
  travelType: 'domestic' | 'international';
  purpose: string;
  destination: string;
  startDate: string;
  endDate: string;
  duration: number;
  totalCost: number;
  advanceTaken: number;
  expensesClaimed: number;
  status: 'completed' | 'expenses_pending';
}

export default function Page() {
  const [selectedYear, setSelectedYear] = useState('2025');

  const mockHistory: TravelHistory[] = [
    {
      id: '1',
      tripNumber: 'TR-2024-045',
      employeeName: 'Rajesh Kumar',
      department: 'Sales',
      travelType: 'domestic',
      purpose: 'Client Meeting - Mahindra',
      destination: 'Mumbai, Maharashtra',
      startDate: '2024-09-15',
      endDate: '2024-09-17',
      duration: 3,
      totalCost: 28500,
      advanceTaken: 20000,
      expensesClaimed: 28500,
      status: 'completed'
    },
    {
      id: '2',
      tripNumber: 'TR-2024-052',
      employeeName: 'Priya Sharma',
      department: 'Engineering',
      travelType: 'domestic',
      purpose: 'Technical Workshop - Bosch',
      destination: 'Bangalore, Karnataka',
      startDate: '2024-08-20',
      endDate: '2024-08-25',
      duration: 6,
      totalCost: 42000,
      advanceTaken: 30000,
      expensesClaimed: 42000,
      status: 'completed'
    },
    {
      id: '3',
      tripNumber: 'TR-2024-061',
      employeeName: 'Amit Patel',
      department: 'Quality',
      travelType: 'international',
      purpose: 'Quality Audit - Thailand Plant',
      destination: 'Bangkok, Thailand',
      startDate: '2024-07-10',
      endDate: '2024-07-17',
      duration: 8,
      totalCost: 165000,
      advanceTaken: 100000,
      expensesClaimed: 0,
      status: 'expenses_pending'
    }
  ];

  const stats = {
    totalTrips: mockHistory.length,
    domesticTrips: mockHistory.filter(t => t.travelType === 'domestic').length,
    internationalTrips: mockHistory.filter(t => t.travelType === 'international').length,
    totalSpent: mockHistory.reduce((sum, t) => sum + t.totalCost, 0),
    avgTripCost: Math.round(mockHistory.reduce((sum, t) => sum + t.totalCost, 0) / mockHistory.length)
  };

  return (
    <div className="w-full h-full px-3 py-2">
      <div className="mb-3">
        <h1 className="text-2xl font-bold text-gray-900">Travel History</h1>
        <p className="text-sm text-gray-600 mt-1">View past travel records and expenses</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-2 mb-3">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-3 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Total Trips</p>
              <p className="text-2xl font-bold text-blue-900 mt-1">{stats.totalTrips}</p>
            </div>
            <Plane className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-3 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Domestic</p>
              <p className="text-2xl font-bold text-green-900 mt-1">{stats.domesticTrips}</p>
            </div>
            <MapPin className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-3 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">International</p>
              <p className="text-2xl font-bold text-purple-900 mt-1">{stats.internationalTrips}</p>
            </div>
            <Plane className="h-8 w-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-3 border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-600">Total Spent</p>
              <p className="text-2xl font-bold text-orange-900 mt-1">₹{(stats.totalSpent / 100000).toFixed(1)}L</p>
            </div>
            <IndianRupee className="h-8 w-8 text-orange-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg p-3 border border-indigo-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-indigo-600">Avg Cost</p>
              <p className="text-2xl font-bold text-indigo-900 mt-1">₹{(stats.avgTripCost / 1000).toFixed(0)}K</p>
            </div>
            <TrendingUp className="h-8 w-8 text-indigo-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 mb-3">
        <div className="flex justify-between items-center">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="2025">2025</option>
            <option value="2024">2024</option>
            <option value="2023">2023</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm">
            <Download className="h-4 w-4" />
            Export Report
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Trip Details</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Destination</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Duration</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Financial</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {mockHistory.map(trip => (
              <tr key={trip.id} className="hover:bg-gray-50">
                <td className="px-3 py-2">
                  <div>
                    <div className="font-semibold text-gray-900">{trip.tripNumber}</div>
                    <div className="text-sm text-gray-600">{trip.employeeName}</div>
                    <div className="text-xs text-gray-500">{trip.purpose}</div>
                  </div>
                </td>
                <td className="px-3 py-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <div>
                      <div className="text-sm font-semibold text-gray-900">{trip.destination}</div>
                      <span className={`text-xs px-2 py-0.5 rounded ${
                        trip.travelType === 'domestic' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                      }`}>
                        {trip.travelType}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-2">
                  <div className="text-sm text-gray-900">{trip.startDate}</div>
                  <div className="text-sm text-gray-600">to {trip.endDate}</div>
                  <div className="text-xs text-gray-500">{trip.duration} days</div>
                </td>
                <td className="px-3 py-2">
                  <div className="text-sm">
                    <div className="font-semibold text-gray-900">₹{trip.totalCost.toLocaleString('en-IN')}</div>
                    <div className="text-xs text-gray-600">Advance: ₹{trip.advanceTaken.toLocaleString('en-IN')}</div>
                    <div className="text-xs text-gray-600">Claimed: ₹{trip.expensesClaimed.toLocaleString('en-IN')}</div>
                  </div>
                </td>
                <td className="px-3 py-2">
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                    trip.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {trip.status === 'completed' ? 'Completed' : 'Expenses Pending'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

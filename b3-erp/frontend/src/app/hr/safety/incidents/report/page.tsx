'use client';

import React, { useState } from 'react';
import {
  AlertCircle,
  Search,
  Filter,
  Plus,
  FileText,
  Clock,
  CheckCircle,
  MoreVertical,
  Download,
  AlertTriangle,
  Siren
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

// Mock Data
const incidentStats = {
  totalIncidents: 12,
  open: 3,
  investigating: 2,
  closed: 7,
  avgResolutionTime: '4.5 days'
};

const severityData = [
  { name: 'Low', value: 5, color: '#3b82f6' },
  { name: 'Medium', value: 4, color: '#f59e0b' },
  { name: 'High', value: 2, color: '#ef4444' },
  { name: 'Critical', value: 1, color: '#7f1d1d' },
];

const incidents = [
  {
    id: 'INC-2024-001',
    title: 'Minor Slip on Wet Floor',
    location: 'Warehouse Zone B',
    date: '2024-04-01',
    reportedBy: 'Mike Johnson',
    severity: 'Low',
    status: 'Closed',
    type: 'Injury'
  },
  {
    id: 'INC-2024-002',
    title: 'Forklift Near Collision',
    location: 'Loading Dock',
    date: '2024-04-03',
    reportedBy: 'Sarah Smith',
    severity: 'High',
    status: 'Investigating',
    type: 'Near Miss'
  },
  {
    id: 'INC-2024-003',
    title: 'Chemical Odor Reported',
    location: 'Lab 2',
    date: '2024-04-05',
    reportedBy: 'Dr. Emily Chen',
    severity: 'Medium',
    status: 'Open',
    type: 'Environmental'
  },
  {
    id: 'INC-2024-004',
    title: 'Machine Guard Tampered',
    location: 'Assembly Line 1',
    date: '2024-04-06',
    reportedBy: 'Robert Fox',
    severity: 'Critical',
    status: 'Investigating',
    type: 'Safety Violation'
  },
  {
    id: 'INC-2024-005',
    title: 'First Aid Kit Missing Items',
    location: 'Break Room',
    date: '2024-04-07',
    reportedBy: 'Jenny Wilson',
    severity: 'Low',
    status: 'Open',
    type: 'Compliance'
  },
];

export default function IncidentReportPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredIncidents = incidents.filter(inc => {
    const matchesSearch = inc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inc.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || inc.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <AlertCircle className="h-8 w-8 text-orange-600" />
            Incident Reporting
          </h1>
          <p className="text-gray-500 mt-1">Log, track, and manage safety incidents</p>
        </div>
        <button className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 shadow-sm transition-colors">
          <Siren className="w-4 h-4 mr-2" />
          Report New Incident
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Open Incidents</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{incidentStats.open}</p>
            </div>
            <div className="p-3 bg-red-50 rounded-lg">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">Requires immediate attention</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Under Investigation</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{incidentStats.investigating}</p>
            </div>
            <div className="p-3 bg-orange-50 rounded-lg">
              <Search className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">Active RCA processes</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Closed (This Month)</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{incidentStats.closed}</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <p className="text-xs text-green-600 mt-2">Avg. Resolution: {incidentStats.avgResolutionTime}</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center justify-center relative overflow-hidden">
          <p className="text-sm font-medium text-gray-500 absolute top-4 left-6">Severity Breakdown</p>
          <div className="w-full h-24 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={severityData}
                  innerRadius={25}
                  outerRadius={35}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {severityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex gap-2 text-xs text-gray-500 mt-1">
            <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-red-600 mr-1"></span>Critical</span>
            <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-blue-500 mr-1"></span>Low</span>
          </div>
        </div>
      </div>

      {/* Incident Log Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="p-6 border-b border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-lg font-bold text-gray-900">Incident Logs</h2>
          <div className="flex gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search incidents..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-orange-500 focus:border-orange-500 w-full md:w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="bg-white border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 block p-2.5"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Status</option>
              <option value="Open">Open</option>
              <option value="Investigating">Investigating</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-xs uppercase font-semibold text-gray-500">
              <tr>
                <th className="px-6 py-4">Incident ID & Title</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4">Reported By / Date</th>
                <th className="px-6 py-4">Severity</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredIncidents.map((incident) => (
                <tr key={incident.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-gray-900">{incident.title}</div>
                      <div className="text-xs text-gray-400">{incident.id}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2 py-1 rounded-md bg-gray-100 text-gray-600 text-xs font-medium">
                      {incident.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">{incident.location}</td>
                  <td className="px-6 py-4">
                    <div className="text-gray-900">{incident.reportedBy}</div>
                    <div className="text-xs text-gray-500">{incident.date}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${incident.severity === 'Critical' ? 'bg-red-100 text-red-800' :
                        incident.severity === 'High' ? 'bg-orange-100 text-orange-800' :
                          incident.severity === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-blue-100 text-blue-800'
                      }`}>
                      {incident.severity}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${incident.status === 'Open' ? 'bg-red-50 text-red-700 border border-red-100' :
                        incident.status === 'Investigating' ? 'bg-orange-50 text-orange-700 border border-orange-100' :
                          'bg-green-50 text-green-700 border border-green-100'
                      }`}>
                      {incident.status === 'Open' && <AlertCircle className="w-3 h-3" />}
                      {incident.status === 'Investigating' && <Search className="w-3 h-3" />}
                      {incident.status === 'Closed' && <CheckCircle className="w-3 h-3" />}
                      {incident.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="text-xs font-medium text-orange-600 hover:text-orange-900 hover:underline">View details</button>
                      <button className="p-1 hover:bg-gray-100 rounded text-gray-500 hover:text-gray-900 transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

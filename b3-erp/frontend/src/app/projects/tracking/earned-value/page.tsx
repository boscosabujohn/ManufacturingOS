'use client';

import { useMemo, useState } from 'react';
import { TrendingUp, Search, Filter, Download, DollarSign } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';

type EvmPoint = { period: string; PV: number; EV: number; AC: number };
const EVM_SERIES: EvmPoint[] = [
  { period: 'W36', PV: 850, EV: 820, AC: 790 },
  { period: 'W37', PV: 900, EV: 870, AC: 860 },
  { period: 'W38', PV: 1000, EV: 930, AC: 960 },
  { period: 'W39', PV: 1100, EV: 1040, AC: 1010 },
  { period: 'W40', PV: 1200, EV: 1110, AC: 1050 },
];

type EvmRow = { project: string; PV: number; EV: number; AC: number };
const EVM_TABLE: EvmRow[] = [
  { project: 'Kitchen Fitout - Tower A', PV: 420, EV: 400, AC: 380 },
  { project: 'Luxury Villa Wardrobes', PV: 360, EV: 330, AC: 340 },
  { project: 'Corporate Pantry Rollout', PV: 300, EV: 310, AC: 290 },
];

export default function EarnedValueManagementPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const rows = useMemo(() => EVM_TABLE.filter(r => r.project.toLowerCase().includes(searchTerm.toLowerCase())), [searchTerm]);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          <TrendingUp className="h-8 w-8 text-teal-600" />
          Earned Value Management
        </h1>
        <p className="text-gray-600 mt-2">EVM analysis and forecasting</p>
      </div>

      {/* Action Bar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
              <Filter className="h-4 w-4" />
              Filter
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700">
              <Download className="h-4 w-4" />
              Export Analysis
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">Planned Value (PV)</p>
              <p className="text-3xl font-bold text-blue-900 mt-1">$1.2M</p>
            </div>
            <DollarSign className="h-12 w-12 text-blue-600 opacity-50" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">Earned Value (EV)</p>
              <p className="text-3xl font-bold text-green-900 mt-1">$1.1M</p>
            </div>
            <DollarSign className="h-12 w-12 text-green-600 opacity-50" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-lg p-6 border border-teal-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-teal-600 text-sm font-medium">Actual Cost (AC)</p>
              <p className="text-3xl font-bold text-teal-900 mt-1">$1.05M</p>
            </div>
            <DollarSign className="h-12 w-12 text-teal-600 opacity-50" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 text-sm font-medium">Cost Variance</p>
              <p className="text-3xl font-bold text-purple-900 mt-1">+$50K</p>
            </div>
            <TrendingUp className="h-12 w-12 text-purple-600 opacity-50" />
          </div>
        </div>
      </div>

      {/* EVM Curve */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-gray-800">EVM S-Curve</h3>
          <span className="text-xs text-gray-500">Weekly</span>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={EVM_SERIES} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="PV" stroke="#6366f1" strokeWidth={2} />
              <Line type="monotone" dataKey="EV" stroke="#10b981" strokeWidth={2} />
              <Line type="monotone" dataKey="AC" stroke="#f59e0b" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Table with SPI/CPI */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-4 py-3 border-b">
          <h3 className="font-semibold text-gray-800">Project EVM Summary</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Project</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">PV</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">EV</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">AC</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">SV (EV - PV)</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">CV (EV - AC)</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">SPI (EV/PV)</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">CPI (EV/AC)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {rows.map(r => {
                const sv = r.EV - r.PV;
                const cv = r.EV - r.AC;
                const spi = r.PV ? (r.EV / r.PV) : 0;
                const cpi = r.AC ? (r.EV / r.AC) : 0;
                return (
                  <tr key={r.project} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-800">{r.project}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{r.PV.toFixed(0)}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{r.EV.toFixed(0)}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{r.AC.toFixed(0)}</td>
                    <td className={`px-4 py-3 text-sm ${sv>=0?'text-green-700':'text-red-700'}`}>{sv.toFixed(0)}</td>
                    <td className={`px-4 py-3 text-sm ${cv>=0?'text-green-700':'text-red-700'}`}>{cv.toFixed(0)}</td>
                    <td className="px-4 py-3 text-sm">{spi.toFixed(2)}</td>
                    <td className="px-4 py-3 text-sm">{cpi.toFixed(2)}</td>
                  </tr>
                );
              })}
              {rows.length===0 && (
                <tr><td colSpan={8} className="px-4 py-8 text-center text-gray-500">No matching projects</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

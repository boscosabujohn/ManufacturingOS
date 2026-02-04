'use client';

import React, { useState } from 'react';
import {
  Package,
  Truck,
  Database,
  CheckCircle,
  AlertCircle,
  Search,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Box,
  BarChart3,
  Clock,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

export default function SparePartsIntegration() {
  const [activeCategory, setActiveCategory] = useState('Critical');

  const stockAlerts = [
    { name: 'Compressor Fan (X-2)', code: 'PRT-2201', stock: 12, min: 20, priority: 'High', status: 'Reordering' },
    { name: 'Oven Door Seal', code: 'PRT-1109', stock: 5, min: 50, priority: 'Critical', status: 'Out of Stock' },
    { name: 'Filter Mesh Steel', code: 'PRT-8822', stock: 154, min: 100, priority: 'Normal', status: 'Healthy' },
  ];

  const inTransit = [
    { id: 'TRK-001', item: 'HVAC Control Board', qty: 50, eta: 'Tomorrow, 10 AM', vendor: 'ElectroPart Co.', progress: 75 },
    { id: 'TRK-005', item: 'Gas Valve Kit', qty: 200, eta: 'Oct 28', vendor: 'Pneumatics Ltd', progress: 30 },
  ];

  return (
    <div className="space-y-3">
      {/* Header Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 flex flex-col md:flex-row md:items-center justify-between gap-3 relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-3xl font-extrabold text-slate-900 flex items-center gap-2">
            <div className="p-3 bg-indigo-600 rounded-2xl shadow-indigo-100 shadow-xl">
              <Package className="h-7 w-7 text-white" />
            </div>
            Smart Parts Inventory
          </h2>
          <p className="text-slate-500 mt-2 text-lg">Integrated real-time supply chain and multi-warehouse sync</p>
        </div>
        <div className="flex items-center gap-2 relative z-10">
          <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs font-bold text-slate-600">ERP Connected: ERP-992-B</span>
          </div>
          <button className="flex items-center gap-2 px-3 py-2 bg-slate-900 text-white rounded-xl font-bold hover:bg-black transition-all shadow-lg active:scale-95">
            <RefreshCw className="h-4 w-4" />
            Sync with ERP
          </button>
        </div>
        {/* Background Decorative Element */}
        <Box className="absolute -right-12 -bottom-12 h-64 w-64 text-slate-50/50 -rotate-12 pointer-events-none" />
      </div>

      {/* High Level Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {[
          { label: 'Total SKU Count', value: '2,845', trend: '+12%', isUp: true, icon: Database, color: 'indigo' },
          { label: 'Inventory Value', value: '₹4.2 Cr', trend: '-2.4%', isUp: false, icon: BarChart3, color: 'blue' },
          { label: 'Availability Rate', value: '98.2%', trend: '+0.5%', isUp: true, icon: CheckCircle, color: 'green' },
          { label: 'Open Requisitions', value: '156', trend: '12 Urgent', isUp: true, icon: Clock, color: 'orange' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white p-3 rounded-2xl shadow-sm border border-slate-200 hover:border-indigo-500 transition-colors group">
            <div className="flex items-center justify-between mb-2">
              <div className={`p-3 bg-${stat.color}-50 rounded-xl`}>
                <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
              </div>
              <div className={`flex items-center gap-1 text-xs font-bold ${stat.isUp ? 'text-green-600' : 'text-red-500'}`}>
                {stat.isUp ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                {stat.trend}
              </div>
            </div>
            <div className="text-3xl font-black text-slate-900 mb-1">{stat.value}</div>
            <div className="text-sm font-semibold text-slate-400 uppercase tracking-wider">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Inventory Management Table */}
        <div className="lg:col-span-2 space-y-3">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between flex-wrap gap-2">
              <div>
                <h3 className="font-bold text-slate-900 text-lg">Inventory Stock Levels</h3>
                <p className="text-sm text-slate-500">Across 12 regional service warehouses</p>
              </div>
              <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-200">
                {['All', 'Critical', 'Low Stock'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeCategory === cat ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'
                      }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <tr>
                    <th className="px-3 py-2">Part / SKU</th>
                    <th className="px-3 py-2">Stock Status</th>
                    <th className="px-3 py-2">Quantity</th>
                    <th className="px-3 py-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {stockAlerts.map((part, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                            <Package className="h-5 w-5 text-slate-400" />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">{part.name}</p>
                            <p className="text-xs text-slate-400">{part.code}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${part.status === 'Healthy' ? 'bg-green-100 text-green-700' :
                            part.status === 'Out of Stock' ? 'bg-red-100 text-red-700' :
                              'bg-amber-100 text-amber-700'
                          }`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${part.status === 'Healthy' ? 'bg-green-500' :
                              part.status === 'Out of Stock' ? 'bg-red-500' :
                                'bg-amber-500'
                            }`}></div>
                          {part.status}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="space-y-1.5">
                          <div className="flex justify-between text-xs font-bold">
                            <span className="text-slate-900">{part.stock}</span>
                            <span className="text-slate-400">Min: {part.min}</span>
                          </div>
                          <div className="w-32 bg-slate-100 rounded-full h-1.5">
                            <div
                              className={`h-1.5 rounded-full ${(part.stock / part.min) < 0.5 ? 'bg-red-500' :
                                  (part.stock / part.min) < 1.0 ? 'bg-amber-500' :
                                    'bg-green-500'
                                }`}
                              style={{ width: `${Math.min(100, (part.stock / part.min) * 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all">
                          <ExternalLink className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-6 bg-slate-50/50 text-center">
              <button className="text-sm font-bold text-indigo-600 hover:underline">View All 2,345 Parts</button>
            </div>
          </div>

          {/* Supply Chain Timeline */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-3">
            <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Truck className="h-5 w-5 text-blue-600" />
              Parts in Transit
            </h3>
            <div className="space-y-8">
              {inTransit.map((transit, idx) => (
                <div key={idx} className="relative">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-50 rounded-lg"><Truck className="h-4 w-4 text-blue-600" /></div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{transit.item}</p>
                        <p className="text-[10px] font-bold text-slate-400">{transit.vendor} • ID: {transit.id}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-slate-900">{transit.eta}</p>
                      <p className="text-[10px] text-slate-400 font-medium">Estimated Arrival</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 transition-all duration-1000"
                        style={{ width: `${transit.progress}%` }}
                      ></div>
                    </div>
                    <span className="text-xs font-black text-slate-800">{transit.progress}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Sidebar */}
        <div className="space-y-3">
          {/* Smart Compatibility Tool */}
          <div className="bg-indigo-900 text-white rounded-2xl p-3 shadow-xl relative overflow-hidden group">
            <div className="relative z-10">
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-indigo-300" />
                Compatibility AI
              </h3>
              <p className="text-indigo-100 text-xs mb-3 leading-relaxed">
                Verify if a part fits a specific machine model instantly using our AI database.
              </p>
              <div className="space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-indigo-300" />
                  <input
                    type="text"
                    placeholder="Enter Part SKU..."
                    className="w-full bg-white/10 border border-white/20 rounded-xl py-2.5 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-white/40 placeholder:text-indigo-300"
                  />
                </div>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Enter Machine Model..."
                    className="w-full bg-white/10 border border-white/20 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-white/40 placeholder:text-indigo-300"
                  />
                </div>
                <button className="w-full py-3 bg-white text-indigo-900 rounded-xl font-black shadow-lg hover:bg-slate-50 transition-all active:scale-95">
                  Check Fitment
                </button>
              </div>
            </div>
            <Database className="absolute -right-8 -bottom-8 h-32 w-32 text-indigo-800 opacity-30 group-hover:scale-110 transition-transform duration-500" />
          </div>

          {/* Quick Stats Sidebar */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-3">
            <h3 className="font-bold text-slate-900 mb-2 tracking-tight">Supply Chain Health</h3>
            <div className="space-y-2">
              {[
                { label: 'Carrier Speed', value: 'Faster than avg', color: 'green' },
                { label: 'Return Rate', value: '4.2% (Normal)', color: 'blue' },
                { label: 'Damage Rate', value: '0.1% (Low)', color: 'green' },
              ].map((stat, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-xs font-bold text-slate-500">{stat.label}</span>
                  <span className={`text-xs font-black text-${stat.color}-600`}>{stat.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Catalog Link */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center group hover:border-indigo-500 transition-colors">
            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <Box className="h-8 w-8 text-slate-400 group-hover:text-indigo-600 transition-colors" />
            </div>
            <h4 className="font-bold text-slate-900 mb-1">Interactive Catalog</h4>
            <p className="text-xs text-slate-500 mb-3">Browse all 12,000+ parts with detailed 3D renders and assembly guides.</p>
            <button className="w-full py-4 border-2 border-slate-100 rounded-2xl font-black text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-all">
              Open Digital Catalog
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

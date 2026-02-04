'use client';

import React, { useState } from 'react';
import {
  ClipboardCheck,
  Search,
  Filter,
  Plus,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  ChevronRight,
  ShieldCheck,
  Zap,
  Flame,
  UserCheck
} from 'lucide-react';

// Mock Data
const inspectionStats = {
  activeInspections: 4,
  completedMTD: 12,
  avgCompliance: 94,
  outstandingIssues: 6
};

const inspectionChecklists = [
  {
    id: 'INSP-2024-040',
    title: 'Monthly Fire Safety Audit',
    area: 'Warehouse Sector A & B',
    inspector: 'John Smith',
    status: 'In Progress',
    compliance: 85,
    items: [
      { name: 'Fire Extinguishers Charged', status: 'Pass' },
      { name: 'Emergency Exits Clear', status: 'Fail', note: 'Blocked by pallet in Sector B' },
      { name: 'Sprinkler System Pressure', status: 'Pass' },
      { name: 'Emergency Lights Functional', status: 'Pending' },
    ]
  },
  {
    id: 'INSP-2024-041',
    title: 'Bi-Weekly Machine Guard Check',
    area: 'Production Line 4',
    inspector: 'Sarah Wilson',
    status: 'Scheduled',
    compliance: 0,
    items: []
  },
  {
    id: 'INSP-2024-039',
    title: 'Chemical Storage Review',
    area: 'Hazmat Room',
    inspector: 'Mike Johnson',
    status: 'Completed',
    compliance: 92,
    items: [
      { name: 'Proper Labeling', status: 'Pass' },
      { name: 'Bund Integrity', status: 'Fail', note: 'Minor crack in Bund 3' },
      { name: 'MSDS Sheets Accessible', status: 'Pass' },
    ]
  },
];

export default function InspectionsPage() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="p-6 space-y-3">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <ClipboardCheck className="h-8 w-8 text-orange-600" />
            Safety Inspections
          </h1>
          <p className="text-gray-500 mt-1">Conduct and manage routine safety walkthroughs and compliance checks</p>
        </div>
        <button className="inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 shadow-sm transition-colors">
          <Plus className="w-4 h-4 mr-2" />
          Start New Inspection
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Active</p>
          <div className="flex items-end justify-between mt-2">
            <span className="text-3xl font-bold text-gray-900">{inspectionStats.activeInspections}</span>
            <Clock className="w-8 h-8 text-blue-500 opacity-20" />
          </div>
          <p className="text-[10px] text-blue-600 mt-2 font-medium">Currently in-progress</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Completed (MTD)</p>
          <div className="flex items-end justify-between mt-2">
            <span className="text-3xl font-bold text-gray-900">{inspectionStats.completedMTD}</span>
            <ShieldCheck className="w-8 h-8 text-green-500 opacity-20" />
          </div>
          <p className="text-[10px] text-green-600 mt-2 font-medium">+2 from last month</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Avg. Compliance</p>
          <div className="flex items-end justify-between mt-2">
            <span className="text-3xl font-bold text-gray-900">{inspectionStats.avgCompliance}%</span>
            <UserCheck className="w-8 h-8 text-orange-500 opacity-20" />
          </div>
          <div className="w-full bg-gray-100 h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-orange-500 h-full" style={{ width: `${inspectionStats.avgCompliance}%` }}></div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Issues Found</p>
          <div className="flex items-end justify-between mt-2">
            <span className="text-3xl font-bold text-red-600">{inspectionStats.outstandingIssues}</span>
            <AlertCircle className="w-8 h-8 text-red-500 opacity-20" />
          </div>
          <p className="text-[10px] text-red-600 mt-2 font-medium">Requires corrective action</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {/* Inspection List */}
        <div className="lg:col-span-2 space-y-2">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-bold text-gray-900">Recent Inspections</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Filter inspections..."
                  className="pl-9 pr-3 py-1.5 border border-gray-200 rounded-lg text-xs focus:ring-orange-500 focus:border-orange-500 w-48"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="divide-y divide-gray-100">
              {inspectionChecklists.map((insp) => (
                <div key={insp.id} className="p-5 hover:bg-gray-50 transition-colors cursor-pointer group">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-gray-900 group-hover:text-orange-600 transition-colors">{insp.title}</h3>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${insp.status === 'Completed' ? 'bg-green-100 text-green-700' :
                            insp.status === 'In Progress' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'
                          }`}>
                          {insp.status}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 flex items-center gap-2">
                        <span className="font-medium">{insp.id}</span> · Area: {insp.area}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-gray-400 uppercase">Compliance</p>
                      <p className={`text-xl font-bold ${insp.compliance > 90 ? 'text-green-600' : 'text-orange-600'}`}>{insp.compliance}%</p>
                    </div>
                  </div>

                  {insp.items.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                      {insp.items.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded border border-gray-100 text-[11px]">
                          <span className="text-gray-700 flex items-center gap-2">
                            {item.status === 'Pass' ? <CheckCircle2 className="w-3.5 h-3.5 text-green-500" /> :
                              item.status === 'Fail' ? <XCircle className="w-3.5 h-3.5 text-red-500" /> :
                                <Clock className="w-3.5 h-3.5 text-blue-500" />}
                            {item.name}
                          </span>
                          {item.status === 'Fail' && <span className="text-[9px] bg-red-100 text-red-600 px-1 rounded">Action Needed</span>}
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center bg-transparent">
                    <span className="text-[10px] text-gray-400 flex items-center gap-1.5">
                      Inspector: <span className="font-bold text-gray-600">{insp.inspector}</span>
                    </span>
                    <button className="text-[11px] font-bold text-orange-600 flex items-center group-hover:gap-2 gap-1 transition-all">
                      View Full Checklist <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Inspection Templates & Tips */}
        <div className="space-y-3">
          <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-green-600" />
              Quick Templates
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:border-orange-200 cursor-pointer transition-all bg-gray-50">
                <div className="flex items-center gap-3">
                  <Zap className="w-4 h-4 text-orange-500" />
                  <span className="text-xs font-bold text-gray-700 uppercase">Electrical Safety</span>
                </div>
                <Plus className="w-3 h-3 text-gray-400" />
              </div>
              <div className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:border-orange-200 cursor-pointer transition-all bg-gray-50">
                <div className="flex items-center gap-3">
                  <Flame className="w-4 h-4 text-red-500" />
                  <span className="text-xs font-bold text-gray-700 uppercase">Fire Prevention</span>
                </div>
                <Plus className="w-3 h-3 text-gray-400" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-900 to-indigo-700 p-3 rounded-xl text-white shadow-lg relative overflow-hidden">
            <h3 className="font-bold mb-2">Did you know?</h3>
            <p className="text-xs opacity-80 leading-relaxed italic">
              "Mobile inspections are 40% more efficient than paper-based reporting. Capture photos of hazards directly to the checklist to accelerate corrective actions."
            </p>
            <ShieldCheck className="absolute -bottom-4 -right-4 w-32 h-32 opacity-10" />
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import {
  FileWarning,
  Search,
  Plus,
  ArrowRight,
  FileText,
  Download,
  Users,
  Clock,
  ShieldAlert,
  Flame,
  Droplets,
  Stethoscope,
  Zap,
  CheckCircle2,
  ChevronRight,
  MoreVertical
} from 'lucide-react';

// Mock Data
const emergencyPlans = [
  {
    id: 'ERP-001',
    title: 'Fire Evacuation Plan',
    icon: Flame,
    color: 'text-red-600',
    backgroundColor: 'bg-red-50',
    status: 'Active',
    lastReviewed: '2024-01-15',
    coordinators: ['John Smith', 'Maria Garcia'],
    priority: 'Critical'
  },
  {
    id: 'ERP-002',
    title: 'Chemical Spill Response',
    icon: Droplets,
    color: 'text-amber-600',
    backgroundColor: 'bg-amber-50',
    status: 'Under Review',
    lastReviewed: '2023-11-20',
    coordinators: ['Sam Taylor'],
    priority: 'High'
  },
  {
    id: 'ERP-003',
    title: 'Medical Emergency Protocol',
    icon: Stethoscope,
    color: 'text-blue-600',
    backgroundColor: 'bg-blue-50',
    status: 'Active',
    lastReviewed: '2024-02-10',
    coordinators: ['Emma Blunt', 'Robert Smith'],
    priority: 'High'
  },
  {
    id: 'ERP-004',
    title: 'Power Outage & Machinery Safety',
    icon: Zap,
    color: 'text-orange-600',
    backgroundColor: 'bg-orange-50',
    status: 'Revision Needed',
    lastReviewed: '2023-06-05',
    coordinators: ['David Miller'],
    priority: 'Medium'
  }
];

export default function EmergencyPlansPage() {
  const [selectedPlan, setSelectedPlan] = useState<any>(emergencyPlans[0]);

  return (
    <div className="p-6 space-y-3">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <ShieldAlert className="h-8 w-8 text-orange-600" />
            Emergency Response Plans (ERP)
          </h1>
          <p className="text-gray-500 mt-1">Institutional protocols for crisis management and workplace safety emergencies</p>
        </div>
        <button className="inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 shadow-sm transition-colors">
          <Plus className="w-4 h-4 mr-2" />
          Create New Plan
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {/* Plans Navigation */}
        <div className="space-y-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search plans..."
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-orange-500 focus:border-orange-500"
            />
          </div>

          <div className="space-y-2">
            {emergencyPlans.map((plan) => (
              <div
                key={plan.id}
                onClick={() => setSelectedPlan(plan)}
                className={`p-4 rounded-xl border transition-all cursor-pointer group flex items-start justify-between ${selectedPlan.id === plan.id
                    ? 'bg-orange-50 border-orange-200 shadow-sm'
                    : 'bg-white border-gray-100 hover:border-orange-100'
                  }`}
              >
                <div className="flex gap-2">
                  <div className={`p-3 rounded-lg ${plan.backgroundColor} ${plan.color}`}>
                    <plan.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className={`font-bold text-sm ${selectedPlan.id === plan.id ? 'text-orange-900' : 'text-gray-900'}`}>{plan.title}</h3>
                    <p className="text-[10px] text-gray-400 mt-0.5 uppercase tracking-tighter">ID: {plan.id} · {plan.status}</p>
                  </div>
                </div>
                <ChevronRight className={`w-4 h-4 mt-1 transition-transform ${selectedPlan.id === plan.id ? 'translate-x-1 text-orange-400' : 'text-gray-300'}`} />
              </div>
            ))}
          </div>

          <div className="bg-blue-600 p-3 rounded-xl text-white shadow-xl relative overflow-hidden">
            <div className="relative z-10">
              <h4 className="font-bold text-lg mb-2">Drill Effectiveness</h4>
              <p className="text-xs text-blue-50 text-opacity-80 leading-relaxed font-medium">
                Recent data shows average evacuation time has decreased by <span className="text-white font-bold underline italic">14%</span> since the implementation of the new Fire Wardens program.
              </p>
              <button className="mt-4 px-4 py-2 bg-white text-blue-600 rounded-lg text-xs font-bold shadow-sm hover:bg-blue-50 transition-colors flex items-center gap-2">
                View Analytics <ArrowRight className="w-3 h-3" />
              </button>
            </div>
            <ShieldAlert className="absolute -bottom-6 -right-6 w-32 h-32 opacity-10 rotate-12" />
          </div>
        </div>

        {/* Plan Detail View */}
        <div className="lg:col-span-2 space-y-3">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden text-sm">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`p-3 rounded-xl ${selectedPlan.backgroundColor} ${selectedPlan.color}`}>
                  <selectedPlan.icon className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{selectedPlan.title}</h2>
                  <p className="text-xs text-gray-400 flex items-center gap-2 mt-1">
                    <Clock className="w-3 h-3" /> Last Official Review: {selectedPlan.lastReviewed}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-gray-50 rounded-lg border border-gray-100 text-gray-400"><Download className="w-5 h-5" /></button>
                <button className="p-2 hover:bg-gray-50 rounded-lg border border-gray-100 text-gray-400"><MoreVertical className="w-5 h-5" /></button>
              </div>
            </div>

            <div className="p-6 space-y-8">
              {/* Quick Response Steps */}
              <div>
                <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5" /> Core Response Sequence
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 font-medium">
                  {[
                    { step: '1', title: 'Isolation', desc: 'Secure the immediate area and isolate hazards.' },
                    { step: '2', title: 'Activation', desc: 'Trigger the specific alert systems for this plan.' },
                    { step: '3', title: 'Deployment', desc: 'Dispatch Response Team to affected location.' }
                  ].map((item) => (
                    <div key={item.step} className="p-4 bg-gray-50 rounded-xl relative">
                      <span className="absolute -top-2 -left-2 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center text-[10px] font-black text-gray-400 italic">{item.step}</span>
                      <h4 className="text-xs font-bold text-gray-900 mb-1">{item.title}</h4>
                      <p className="text-[10px] text-gray-500 leading-relaxed">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Assigned Coordinators */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                    <Users className="w-3.5 h-3.5" /> Plan Leadership
                  </h3>
                  <div className="space-y-3">
                    {selectedPlan.coordinators.map((name: string, i: number) => (
                      <div key={i} className="flex items-center justify-between p-3 border border-gray-100 rounded-xl hover:border-orange-200 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center font-bold text-xs text-orange-600">
                            {name.charAt(0)}
                          </div>
                          <span className="text-xs font-bold text-gray-900">{name}</span>
                        </div>
                        <span className="text-[9px] bg-gray-50 px-2 py-0.5 rounded text-gray-400 uppercase font-bold tracking-tighter">Primary Contact</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-500" /> Compliance Checklist
                  </h3>
                  <div className="space-y-2">
                    {[
                      'Annual Review Completed',
                      'Physical Map Verified',
                      'Response Team Trained',
                      'Regulatory Filing Done'
                    ].map((check, i) => (
                      <div key={i} className="flex items-center gap-3 text-xs text-gray-600 py-1 font-medium italic">
                        <CheckCircle2 className={`w-3.5 h-3.5 ${i < 3 ? 'text-green-500' : 'text-gray-200'}`} />
                        {check}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-3 border-t border-gray-100 flex justify-between items-center px-8">
              <button className="text-xs font-bold text-orange-600 hover:underline">Download Comprehensive PDF Guide</button>
              <button className="px-6 py-2 bg-gray-900 text-white rounded-lg text-xs font-bold shadow-sm hover:bg-black transition-colors uppercase tracking-widest">Acknowledge Training</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

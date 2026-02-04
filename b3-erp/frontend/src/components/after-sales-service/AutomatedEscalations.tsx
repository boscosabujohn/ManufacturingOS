'use client';

import React, { useState } from 'react';
import {
  AlertTriangle,
  Bell,
  TrendingUp,
  Zap,
  ShieldAlert,
  Mail,
  MessageSquare,
  PhoneCall,
  ChevronRight,
  Clock,
  Plus,
  ArrowRight,
  Settings,
  MoreHorizontal
} from 'lucide-react';

export default function AutomatedEscalations() {
  const [activeTab, setActiveTab] = useState<'rules' | 'history'>('rules');

  const rules = [
    { id: 'RL-01', name: 'Critical Response Violation', trigger: 'SLA Response > 60m', action: 'Notify Manager', channel: 'SMS/Email', status: 'Active' },
    { id: 'RL-02', name: 'P1 Resolution Breach', trigger: 'SLA Resolution > 4h', action: 'Escalate to VP', channel: 'Email/Call', status: 'Active' },
    { id: 'RL-03', name: 'Parts Unavailability', trigger: 'Out of Stock > 24h', action: 'Alert Procurement', channel: 'ERP Note', status: 'Paused' },
  ];

  return (
    <div className="space-y-3">
      {/* Header with Visual Hierarchy */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 flex flex-col md:flex-row md:items-center justify-between gap-3 relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-3xl font-black text-slate-900 flex items-center gap-2 tracking-tight">
            <div className="p-3 bg-orange-600 rounded-2xl shadow-xl shadow-orange-100">
              <ShieldAlert className="h-7 w-7 text-white" />
            </div>
            Smart Escalation Engine
          </h2>
          <p className="text-slate-500 mt-2 text-lg font-medium">Automated mult-level response systems for SLA compliance</p>
        </div>
        <div className="flex items-center gap-3 relative z-10">
          <button className="flex items-center gap-2 px-3 py-2 border-2 border-slate-100 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-all">
            <Settings className="h-4 w-4" />
            Rules Library
          </button>
          <button className="flex items-center gap-2 px-3 py-2 bg-orange-600 text-white rounded-xl font-bold hover:bg-orange-700 transition-all shadow-lg shadow-orange-100 active:scale-95">
            <Plus className="h-4 w-4" />
            New Trigger
          </button>
        </div>
        <Bell className="absolute -right-12 -bottom-12 h-64 w-64 text-slate-50/50 rotate-12 pointer-events-none" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Rules Logic Builder Representation */}
        <div className="lg:col-span-2 space-y-3">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <Zap className="h-4 w-4 text-purple-600" />
                Active Escalation Workflows
              </h3>
              <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-200">
                <button
                  onClick={() => setActiveTab('rules')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'rules' ? 'bg-white shadow-sm text-orange-600' : 'text-slate-500'}`}
                >
                  Configured Rules
                </button>
                <button
                  onClick={() => setActiveTab('history')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'history' ? 'bg-white shadow-sm text-orange-600' : 'text-slate-500'}`}
                >
                  Trigger History
                </button>
              </div>
            </div>

            <div className="p-6 space-y-2">
              {rules.map((rule, idx) => (
                <div key={idx} className="group p-5 bg-slate-50/50 hover:bg-white border border-transparent hover:border-orange-200 rounded-2xl transition-all">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <div className="flex items-start gap-2">
                      <div className={`p-2.5 rounded-xl ${rule.status === 'Active' ? 'bg-green-100 text-green-600' : 'bg-slate-200 text-slate-500'}`}>
                        <Bell className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900">{rule.name}</h4>
                        <div className="flex items-center gap-3 mt-1 text-xs font-bold text-slate-400">
                          <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {rule.trigger}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1 uppercase tracking-wider">{rule.id}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-8 px-4 py-2 bg-white rounded-xl shadow-sm border border-slate-100">
                      <div className="text-center">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">ACTION</p>
                        <p className="text-xs font-bold text-slate-700">{rule.action}</p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-slate-300" />
                      <div className="text-center">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">CHANNELS</p>
                        <div className="flex gap-2">
                          {rule.channel.includes('Email') && <Mail className="h-3 w-3 text-slate-400" />}
                          {rule.channel.includes('SMS') && <MessageSquare className="h-3 w-3 text-slate-400" />}
                          {rule.channel.includes('Call') && <PhoneCall className="h-3 w-3 text-slate-400" />}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className={`text-[10px] font-black px-3 py-1 rounded-full ${rule.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-400'}`}>
                        {rule.status.toUpperCase()}
                      </div>
                      <button className="p-2 text-slate-400 hover:text-slate-600"><MoreHorizontal className="h-4 w-4" /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-6 bg-slate-50 text-center">
              <button className="text-sm font-bold text-orange-600 hover:underline">Manage All Orchestration Rules</button>
            </div>
          </div>

          {/* Escalation Matrix Preview */}
          <div className="bg-slate-50 p-3 rounded-2xl border border-dashed border-slate-300">
            <h4 className="font-bold text-slate-700 mb-2 text-sm">Escalation Path Hierarchy</h4>
            <div className="flex items-center justify-between max-w-lg">
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 bg-white border-2 border-slate-200 rounded-full flex items-center justify-center text-xs font-black text-slate-500">L1</div>
                <span className="text-[10px] font-bold text-slate-400">TECHNICIAN</span>
              </div>
              <div className="flex-1 h-0.5 bg-slate-200 mx-2 relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-50 px-2 text-[10px] font-black text-orange-600">30m</div>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 bg-white border-2 border-orange-500 rounded-full flex items-center justify-center text-xs font-black text-orange-600">L2</div>
                <span className="text-[10px] font-bold text-slate-600">SUPERVISOR</span>
              </div>
              <div className="flex-1 h-0.5 bg-slate-200 mx-2 relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-50 px-2 text-[10px] font-black text-red-600">2h</div>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 bg-slate-900 border-2 border-slate-900 rounded-full flex items-center justify-center text-xs font-black text-white">L3</div>
                <span className="text-[10px] font-bold text-slate-900">DIRECTOR</span>
              </div>
            </div>
          </div>
        </div>

        {/* Live Breach Monitor */}
        <div className="space-y-3">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-3">
            <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-red-600" />
              Live Violation Monitor
            </h3>
            <div className="space-y-5">
              {[
                { tkt: 'T-992', countdown: '12:45', client: 'Acme Corp', level: 'Near Breach' },
                { tkt: 'T-988', countdown: '04:20', client: 'Global Indus', level: 'Critical' },
              ].map((violation, idx) => (
                <div key={idx} className="p-4 bg-red-50 rounded-2xl border border-red-100 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-black text-red-400 uppercase tracking-widest mb-1">{violation.level}</p>
                    <h4 className="font-bold text-red-900 text-sm">{violation.tkt} • {violation.client}</h4>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-black text-red-600 font-mono">{violation.countdown}</p>
                    <p className="text-[10px] font-bold text-red-400">HRS LEFT</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-6 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all flex items-center justify-center gap-2">
              Analyze All Breaches
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Notification Distribution */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-3">
            <h4 className="font-black text-slate-900 text-[10px] uppercase tracking-widest mb-3">Alert Channels Health</h4>
            <div className="space-y-3">
              {[
                { label: 'Push Notifications', value: 98, color: 'blue' },
                { label: 'SMS Gateway', value: 85, color: 'orange' },
                { label: 'Email Server', value: 99, color: 'green' },
              ].map((channel, idx) => (
                <div key={idx}>
                  <div className="flex justify-between text-xs font-bold mb-2">
                    <span className="text-slate-500 uppercase tracking-tighter">{channel.label}</span>
                    <span className={`text-${channel.color}-600`}>{channel.value}% Deliverability</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5">
                    <div className={`bg-${channel.color}-500 h-1.5 rounded-full`} style={{ width: `${channel.value}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Promotion Card */}
          <div className="bg-gradient-to-br from-indigo-900 to-purple-900 p-8 rounded-2xl text-white shadow-xl group">
            <h3 className="text-xl font-bold mb-2 tracking-tight">AI Escalation Prediction</h3>
            <p className="text-indigo-100 text-xs mb-3 leading-relaxed">
              Leverage historical data to predict which tickets are likely to violate HLA before they occur.
            </p>
            <button className="w-full py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl font-black transition-all text-sm backdrop-blur">
              Enable Predictive Logic
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

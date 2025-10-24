'use client'

import { useState, useEffect } from 'react'
import { Clock, AlertTriangle, CheckCircle, TrendingUp, Target, Zap } from 'lucide-react'

export type SLAStatus = 'met' | 'at-risk' | 'breached';
export type Priority = 'critical' | 'high' | 'medium' | 'low';

export interface SLAPolicy {
  id: string;
  name: string;
  priority: Priority;
  firstResponseTime: number;
  resolutionTime: number;
  complianceRate: number;
  activeTickets: number;
}

export interface SLATicket {
  id: string;
  subject: string;
  priority: Priority;
  slaStatus: SLAStatus;
  timeRemaining: number;
  firstResponseDue: string;
  resolutionDue: string;
}

export default function SLAAutomation() {
  const [policies] = useState<SLAPolicy[]>([
    { id: 'SLA-001', name: 'Critical Issues', priority: 'critical', firstResponseTime: 15, resolutionTime: 240, complianceRate: 94.5, activeTickets: 12 },
    { id: 'SLA-002', name: 'High Priority', priority: 'high', firstResponseTime: 60, resolutionTime: 480, complianceRate: 92.3, activeTickets: 45 },
    { id: 'SLA-003', name: 'Medium Priority', priority: 'medium', firstResponseTime: 240, resolutionTime: 1440, complianceRate: 89.7, activeTickets: 123 },
    { id: 'SLA-004', name: 'Low Priority', priority: 'low', firstResponseTime: 480, resolutionTime: 2880, complianceRate: 95.2, activeTickets: 67 }
  ]);

  const [tickets] = useState<SLATicket[]>([
    { id: 'TKT-001', subject: 'Production server down', priority: 'critical', slaStatus: 'at-risk', timeRemaining: 8, firstResponseDue: '10:15 AM', resolutionDue: '2:00 PM' },
    { id: 'TKT-002', subject: 'Database connection errors', priority: 'high', slaStatus: 'met', timeRemaining: 180, firstResponseDue: '11:30 AM', resolutionDue: '5:00 PM' },
    { id: 'TKT-003', subject: 'Feature request', priority: 'low', slaStatus: 'met', timeRemaining: 1200, firstResponseDue: '2:00 PM Tomorrow', resolutionDue: '2:00 PM +2 days' }
  ]);

  const [realTimeUpdate, setRealTimeUpdate] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setRealTimeUpdate(prev => prev + 1), 3000);
    return () => clearInterval(interval);
  }, []);

  const getSLAStatusColor = (status: SLAStatus) => {
    const colors = {
      met: 'bg-green-100 text-green-700 border-green-300',
      'at-risk': 'bg-yellow-100 text-yellow-700 border-yellow-300',
      breached: 'bg-red-100 text-red-700 border-red-300'
    };
    return colors[status];
  };

  const getPriorityColor = (priority: Priority) => {
    const colors = {
      critical: 'bg-red-600',
      high: 'bg-orange-600',
      medium: 'bg-yellow-600',
      low: 'bg-green-600'
    };
    return colors[priority];
  };

  const avgCompliance = policies.reduce((sum, p) => sum + p.complianceRate, 0) / policies.length;

  return (
    <div className="space-y-6">
      <div className="bg-white shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
          <Clock className="h-8 w-8 text-blue-600" />
          SLA Automation
        </h2>
        <p className="text-gray-600 mt-1">Automated SLA tracking, escalation, and compliance monitoring</p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white shadow-lg border border-gray-200 rounded-lg p-6">
          <Target className="h-8 w-8 text-blue-600 mb-3" />
          <div className="text-3xl font-bold text-gray-900 mb-1">{avgCompliance.toFixed(1)}%</div>
          <div className="text-sm text-gray-600">Avg Compliance</div>
        </div>
        <div className="bg-white shadow-lg border border-gray-200 rounded-lg p-6">
          <CheckCircle className="h-8 w-8 text-green-600 mb-3" />
          <div className="text-3xl font-bold text-green-600 mb-1">{tickets.filter(t => t.slaStatus === 'met').length}</div>
          <div className="text-sm text-gray-600">Met SLA</div>
        </div>
        <div className="bg-white shadow-lg border border-gray-200 rounded-lg p-6">
          <AlertTriangle className="h-8 w-8 text-yellow-600 mb-3" />
          <div className="text-3xl font-bold text-yellow-600 mb-1">{tickets.filter(t => t.slaStatus === 'at-risk').length}</div>
          <div className="text-sm text-gray-600">At Risk</div>
        </div>
        <div className="bg-white shadow-lg border border-gray-200 rounded-lg p-6">
          <Zap className="h-8 w-8 text-purple-600 mb-3" />
          <div className="text-3xl font-bold text-purple-600 mb-1">{policies.length}</div>
          <div className="text-sm text-gray-600">Active Policies</div>
        </div>
      </div>

      {/* SLA Policies */}
      <div className="bg-white shadow-lg border border-gray-200 rounded-lg overflow-hidden">
        <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">SLA Policies</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Policy</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Priority</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">First Response</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Resolution</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Compliance</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Active</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {policies.map((policy) => (
                <tr key={policy.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{policy.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${getPriorityColor(policy.priority)}`}>
                      {policy.priority.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900">{policy.firstResponseTime}m</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900">{policy.resolutionTime / 60}h</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2 w-24">
                        <div className={`h-2 rounded-full ${policy.complianceRate >= 90 ? 'bg-green-600' : 'bg-yellow-600'}`} style={{ width: `${policy.complianceRate}%` }}></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{policy.complianceRate}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900">{policy.activeTickets}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* At-Risk Tickets */}
      <div className="bg-white shadow-lg border border-gray-200 rounded-lg overflow-hidden">
        <div className="p-6 bg-gradient-to-r from-yellow-50 to-orange-50 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">SLA Tracking - Live</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {tickets.map((ticket) => (
            <div key={ticket.id} className="p-6 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-semibold text-gray-900">{ticket.subject}</h4>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${getPriorityColor(ticket.priority)}`}>
                      {ticket.priority.toUpperCase()}
                    </span>
                    <span className={`px-3 py-1 rounded border ${getSLAStatusColor(ticket.slaStatus)}`}>
                      {ticket.slaStatus.toUpperCase()}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <div className="text-gray-600">Time Remaining</div>
                      <div className="font-bold text-gray-900">{ticket.timeRemaining}m</div>
                    </div>
                    <div>
                      <div className="text-gray-600">First Response Due</div>
                      <div className="font-medium text-gray-900">{ticket.firstResponseDue}</div>
                    </div>
                    <div>
                      <div className="text-gray-600">Resolution Due</div>
                      <div className="font-medium text-gray-900">{ticket.resolutionDue}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

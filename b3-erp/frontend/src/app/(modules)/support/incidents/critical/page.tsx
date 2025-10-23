'use client';

import { useState } from 'react';
import { AlertTriangle, Clock, Users, TrendingUp, Activity, Phone, Mail, Bell, Eye, CheckCircle2, XCircle } from 'lucide-react';

interface CriticalIncident {
  id: string;
  incidentNumber: string;
  title: string;
  description: string;
  priority: 'P0' | 'P1';
  severity: 'Critical' | 'High';
  status: string;
  category: string;
  affectedServices: string[];
  reportedBy: string;
  reportedAt: string;
  assignedTo: string;
  assignedTeam: string;
  impactedUsers: number;
  estimatedResolution: string;
  timeElapsed: string;
  slaStatus: 'Within SLA' | 'At Risk' | 'Breached';
  slaRemaining: string;
  escalationLevel: number;
  escalationPath: string[];
  warRoom: boolean;
  businessImpact: string;
  revenueImpact: string;
  lastUpdate: string;
  updateFrequency: string;
  criticalityScore: number;
}

const CriticalIncidentsPage = () => {
  const [selectedIncident, setSelectedIncident] = useState<CriticalIncident | null>(null);

  const [incidents] = useState<CriticalIncident[]>([
    {
      id: '1',
      incidentNumber: 'INC-2025-0088',
      title: 'Email Service Complete Outage',
      description: 'Complete email service failure affecting all automated notifications, order confirmations, and internal communications',
      priority: 'P0',
      severity: 'Critical',
      status: 'War Room Active',
      category: 'Application Error',
      affectedServices: ['Email Service', 'SMTP Server', 'Notification System', 'Order Management'],
      reportedBy: 'Amit Patel',
      reportedAt: '2025-10-21 13:15:00',
      assignedTo: 'Vikram Singh',
      assignedTeam: 'DevOps Team',
      impactedUsers: 187,
      estimatedResolution: '2025-10-21 14:30:00',
      timeElapsed: '1h 45m',
      slaStatus: 'At Risk',
      slaRemaining: '15 minutes',
      escalationLevel: 2,
      escalationPath: ['Team Lead', 'IT Manager', 'CTO'],
      warRoom: true,
      businessImpact: 'All automated communications down, customer orders not confirmed',
      revenueImpact: '₹5L/hour',
      lastUpdate: '2025-10-21 14:50:00',
      updateFrequency: 'Every 5 minutes',
      criticalityScore: 95,
    },
    {
      id: '2',
      incidentNumber: 'INC-2025-0089',
      title: 'ERP Application Severe Performance Degradation',
      description: 'All users experiencing severe slowness across all modules, timeout errors frequent, operations at near standstill',
      priority: 'P1',
      severity: 'Critical',
      status: 'In Progress',
      category: 'Performance Issue',
      affectedServices: ['ERP Application', 'Database Server', 'API Gateway', 'Load Balancer'],
      reportedBy: 'Rajesh Kumar',
      reportedAt: '2025-10-21 14:30:00',
      assignedTo: 'Priya Sharma',
      assignedTeam: 'Infrastructure Team',
      impactedUsers: 187,
      estimatedResolution: '2025-10-21 18:00:00',
      timeElapsed: '30m',
      slaStatus: 'Within SLA',
      slaRemaining: '30 minutes',
      escalationLevel: 1,
      escalationPath: ['Team Lead', 'IT Manager'],
      warRoom: false,
      businessImpact: 'All business operations severely impacted, productivity at 20%',
      revenueImpact: '₹3L/hour',
      lastUpdate: '2025-10-21 14:50:00',
      updateFrequency: 'Every 10 minutes',
      criticalityScore: 88,
    },
    {
      id: '3',
      incidentNumber: 'INC-2025-0087',
      title: 'Payment Gateway Complete Failure',
      description: 'All payment processing down, unable to accept any online payments, gateway returns system error for all transactions',
      priority: 'P0',
      severity: 'Critical',
      status: 'Investigating',
      category: 'Integration Failure',
      affectedServices: ['Payment Gateway', 'Order Management', 'Finance Module', 'Customer Portal'],
      reportedBy: 'Sneha Reddy',
      reportedAt: '2025-10-21 11:00:00',
      assignedTo: 'Rahul Mehta',
      assignedTeam: 'Integration Team',
      impactedUsers: 187,
      estimatedResolution: '2025-10-21 16:00:00',
      timeElapsed: '4h',
      slaStatus: 'Breached',
      slaRemaining: 'SLA exceeded by 3h 45m',
      escalationLevel: 3,
      escalationPath: ['Team Lead', 'IT Manager', 'CTO', 'CEO'],
      warRoom: true,
      businessImpact: 'Zero online revenue, all e-commerce operations halted',
      revenueImpact: '₹8L/hour',
      lastUpdate: '2025-10-21 14:55:00',
      updateFrequency: 'Every 5 minutes',
      criticalityScore: 98,
    },
    {
      id: '4',
      incidentNumber: 'INC-2025-0090',
      title: 'Database Server Primary Node Failure',
      description: 'Primary database server crashed, failover to secondary in progress, some data sync issues reported',
      priority: 'P0',
      severity: 'Critical',
      status: 'Failover In Progress',
      category: 'Hardware Failure',
      affectedServices: ['Database Server', 'ERP Application', 'All Modules'],
      reportedBy: 'System Monitor',
      reportedAt: '2025-10-21 14:45:00',
      assignedTo: 'Suresh Kumar',
      assignedTeam: 'Database Team',
      impactedUsers: 187,
      estimatedResolution: '2025-10-21 15:30:00',
      timeElapsed: '15m',
      slaStatus: 'Within SLA',
      slaRemaining: '45 minutes',
      escalationLevel: 2,
      escalationPath: ['Team Lead', 'IT Manager', 'CTO'],
      warRoom: true,
      businessImpact: 'Partial system availability, read-only mode, critical operations halted',
      revenueImpact: '₹10L/hour',
      lastUpdate: '2025-10-21 14:58:00',
      updateFrequency: 'Every 3 minutes',
      criticalityScore: 100,
    },
    {
      id: '5',
      incidentNumber: 'INC-2025-0091',
      title: 'Security Breach - Unauthorized Access Detected',
      description: 'Multiple unauthorized login attempts detected from foreign IP addresses, potential security breach in progress',
      priority: 'P0',
      severity: 'Critical',
      status: 'Active Response',
      category: 'Security Incident',
      affectedServices: ['Authentication Service', 'User Management', 'Security Module'],
      reportedBy: 'Security System',
      reportedAt: '2025-10-21 14:00:00',
      assignedTo: 'Naveen Kumar',
      assignedTeam: 'Security Team',
      impactedUsers: 187,
      estimatedResolution: '2025-10-21 16:00:00',
      timeElapsed: '1h',
      slaStatus: 'Within SLA',
      slaRemaining: '1 hour',
      escalationLevel: 3,
      escalationPath: ['Security Lead', 'CISO', 'CTO', 'CEO'],
      warRoom: true,
      businessImpact: 'Potential data breach, system security compromised, compliance risk',
      revenueImpact: 'Incalculable - Legal/Compliance risk',
      lastUpdate: '2025-10-21 14:55:00',
      updateFrequency: 'Every 5 minutes',
      criticalityScore: 99,
    },
    {
      id: '6',
      incidentNumber: 'INC-2025-0092',
      title: 'Production Line Data Feed Failure',
      description: 'Real-time production data feed stopped, unable to monitor production status, work orders not updating',
      priority: 'P1',
      severity: 'High',
      status: 'In Progress',
      category: 'Integration Failure',
      affectedServices: ['Production Module', 'IoT Gateway', 'Data Sync Service'],
      reportedBy: 'Meera Nair',
      reportedAt: '2025-10-21 13:30:00',
      assignedTo: 'Karthik Iyer',
      assignedTeam: 'Production IT Team',
      impactedUsers: 45,
      estimatedResolution: '2025-10-21 16:30:00',
      timeElapsed: '1h 30m',
      slaStatus: 'Within SLA',
      slaRemaining: '2 hours',
      escalationLevel: 1,
      escalationPath: ['Team Lead', 'Operations Manager'],
      warRoom: false,
      businessImpact: 'Production monitoring blind, quality control compromised',
      revenueImpact: '₹2L/hour',
      lastUpdate: '2025-10-21 14:45:00',
      updateFrequency: 'Every 15 minutes',
      criticalityScore: 82,
    },
  ]);

  const stats = {
    totalCritical: incidents.length,
    p0: incidents.filter(i => i.priority === 'P0').length,
    p1: incidents.filter(i => i.priority === 'P1').length,
    warRoom: incidents.filter(i => i.warRoom).length,
    slaBreach: incidents.filter(i => i.slaStatus === 'Breached').length,
    avgCriticality: Math.round(incidents.reduce((sum, i) => sum + i.criticalityScore, 0) / incidents.length),
  };

  const getSLAColor = (status: string) => {
    switch (status) {
      case 'Within SLA': return 'text-green-700 bg-green-50';
      case 'At Risk': return 'text-yellow-700 bg-yellow-50';
      case 'Breached': return 'text-red-700 bg-red-50';
      default: return 'text-gray-700 bg-gray-50';
    }
  };

  const getPriorityColor = (priority: string) => {
    return priority === 'P0' ? 'bg-red-100 text-red-800' : 'bg-orange-100 text-orange-800';
  };

  const getCriticalityColor = (score: number) => {
    if (score >= 95) return 'text-red-600';
    if (score >= 85) return 'text-orange-600';
    return 'text-yellow-600';
  };

  const handleViewDetails = (incident: CriticalIncident) => {
    setSelectedIncident(incident);
  };

  const handleCloseDetails = () => {
    setSelectedIncident(null);
  };

  const handleEscalate = (incidentNumber: string) => {
    alert(`Escalating incident ${incidentNumber} to next level`);
  };

  const handleInitiateWarRoom = (incidentNumber: string) => {
    alert(`Initiating war room for incident ${incidentNumber}`);
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      {/* Header with Alert */}
      <div className="mb-6">
        <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-xl p-6 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-lg">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Critical Incidents Dashboard</h1>
                <p className="text-red-100 mt-1">P0/P1 Priority - Immediate Attention Required</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold">{stats.totalCritical}</div>
              <div className="text-red-100">Active Critical Incidents</div>
            </div>
          </div>
        </div>

        {/* SLA Breach Alert */}
        {stats.slaBreach > 0 && (
          <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded-r-lg mb-4">
            <div className="flex items-center gap-3">
              <Bell className="w-6 h-6 text-red-600 animate-pulse" />
              <div>
                <div className="font-bold text-red-900">SLA Breach Alert</div>
                <div className="text-red-700">{stats.slaBreach} incident(s) have breached SLA targets - Immediate escalation required</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Total Critical</span>
            <AlertTriangle className="w-4 h-4 text-red-600" />
          </div>
          <div className="text-2xl font-bold text-red-600">{stats.totalCritical}</div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">P0 Priority</span>
            <XCircle className="w-4 h-4 text-red-700" />
          </div>
          <div className="text-2xl font-bold text-red-700">{stats.p0}</div>
          <div className="text-xs text-gray-500 mt-1">15 min response</div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">P1 Priority</span>
            <AlertTriangle className="w-4 h-4 text-orange-600" />
          </div>
          <div className="text-2xl font-bold text-orange-600">{stats.p1}</div>
          <div className="text-xs text-gray-500 mt-1">1 hour response</div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">War Rooms</span>
            <Users className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-purple-600">{stats.warRoom}</div>
          <div className="text-xs text-gray-500 mt-1">Active</div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">SLA Breach</span>
            <Clock className="w-4 h-4 text-red-600" />
          </div>
          <div className="text-2xl font-bold text-red-600">{stats.slaBreach}</div>
          <div className="text-xs text-gray-500 mt-1">Exceeded</div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Avg Criticality</span>
            <TrendingUp className="w-4 h-4 text-orange-600" />
          </div>
          <div className={`text-2xl font-bold ${getCriticalityColor(stats.avgCriticality)}`}>{stats.avgCriticality}</div>
          <div className="text-xs text-gray-500 mt-1">Out of 100</div>
        </div>
      </div>

      {/* Critical Incidents List */}
      <div className="space-y-4">
        {incidents.sort((a, b) => b.criticalityScore - a.criticalityScore).map((incident) => (
          <div key={incident.id} className="bg-white rounded-xl shadow-sm border-2 border-red-200 overflow-hidden hover:shadow-md transition-shadow">
            {/* Incident Header */}
            <div className={`p-4 ${incident.priority === 'P0' ? 'bg-gradient-to-r from-red-50 to-orange-50' : 'bg-orange-50'}`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold ${getPriorityColor(incident.priority)}`}>
                      {incident.priority}
                    </span>
                    <span className="font-mono text-lg font-bold text-gray-900">{incident.incidentNumber}</span>
                    {incident.warRoom && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                        <Users className="w-4 h-4" />
                        War Room Active
                      </span>
                    )}
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getSLAColor(incident.slaStatus)}`}>
                      {incident.slaStatus}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{incident.title}</h3>
                  <p className="text-gray-700 mb-3">{incident.description}</p>
                  
                  <div className="grid grid-cols-4 gap-4 mb-3">
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Time Elapsed</div>
                      <div className="font-bold text-red-600">{incident.timeElapsed}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">SLA Remaining</div>
                      <div className={`font-bold ${incident.slaStatus === 'Breached' ? 'text-red-600' : 'text-green-600'}`}>
                        {incident.slaRemaining}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Impacted Users</div>
                      <div className="font-bold text-gray-900">{incident.impactedUsers}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Revenue Impact</div>
                      <div className="font-bold text-red-600">{incident.revenueImpact}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 text-sm">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-700">{incident.assignedTo} ({incident.assignedTeam})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-700">Updates: {incident.updateFrequency}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-700">Escalation Level {incident.escalationLevel}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right ml-6">
                  <div className="mb-4">
                    <div className="text-sm text-gray-600 mb-1">Criticality Score</div>
                    <div className={`text-5xl font-bold ${getCriticalityColor(incident.criticalityScore)}`}>
                      {incident.criticalityScore}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Incident Details */}
            <div className="p-4 bg-gray-50 border-t border-gray-200">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="text-sm font-medium text-gray-700 mb-2">Business Impact:</div>
                  <div className="text-sm text-red-700 bg-red-50 rounded-lg p-3">{incident.businessImpact}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-700 mb-2">Affected Services:</div>
                  <div className="flex flex-wrap gap-2">
                    {incident.affectedServices.map((service, idx) => (
                      <span key={idx} className="px-2 py-1 bg-white border border-gray-300 text-gray-700 rounded text-xs">
                        {service}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <div className="text-sm font-medium text-gray-700 mb-2">Escalation Path:</div>
                <div className="flex items-center gap-2">
                  {incident.escalationPath.map((level, idx) => (
                    <div key={idx} className="flex items-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        idx < incident.escalationLevel 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {level}
                      </span>
                      {idx < incident.escalationPath.length - 1 && (
                        <div className="w-8 h-0.5 bg-gray-300 mx-1"></div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="p-4 bg-white border-t border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleViewDetails(incident)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  View Details
                </button>
                {!incident.warRoom && (
                  <button
                    onClick={() => handleInitiateWarRoom(incident.incidentNumber)}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    <Users className="w-4 h-4" />
                    Initiate War Room
                  </button>
                )}
                <button
                  onClick={() => handleEscalate(incident.incidentNumber)}
                  className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                >
                  <TrendingUp className="w-4 h-4" />
                  Escalate
                </button>
              </div>
              <div className="flex items-center gap-2">
                <button className="inline-flex items-center gap-1.5 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm">
                  <Phone className="w-4 h-4" />
                  <span className="text-gray-700">Call</span>
                </button>
                <button className="inline-flex items-center gap-1.5 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm">
                  <Mail className="w-4 h-4" />
                  <span className="text-gray-700">Email</span>
                </button>
                <button className="inline-flex items-center gap-1.5 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm">
                  <Bell className="w-4 h-4" />
                  <span className="text-gray-700">Notify</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Detail Modal */}
      {selectedIncident && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-5xl w-full max-h-[90vh] overflow-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-red-50">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{selectedIncident.incidentNumber}</h3>
                <p className="text-gray-600">{selectedIncident.title}</p>
              </div>
              <button
                onClick={handleCloseDetails}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm"
              >
                <XCircle className="w-5 h-5" />
                <span className="text-gray-700">Close</span>
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Description</label>
                    <div className="bg-gray-50 rounded-lg p-3 text-gray-900">{selectedIncident.description}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Business Impact</label>
                    <div className="bg-red-50 rounded-lg p-3 text-red-900">{selectedIncident.businessImpact}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Revenue Impact</label>
                    <div className="bg-red-50 rounded-lg p-3 text-2xl font-bold text-red-900">{selectedIncident.revenueImpact}</div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Priority</label>
                      <span className={`inline-flex px-3 py-1 rounded-full font-bold ${getPriorityColor(selectedIncident.priority)}`}>
                        {selectedIncident.priority}
                      </span>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Criticality</label>
                      <div className={`text-3xl font-bold ${getCriticalityColor(selectedIncident.criticalityScore)}`}>
                        {selectedIncident.criticalityScore}/100
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">SLA Status</label>
                    <span className={`inline-flex px-3 py-1 rounded-full font-medium ${getSLAColor(selectedIncident.slaStatus)}`}>
                      {selectedIncident.slaStatus}: {selectedIncident.slaRemaining}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Assigned To</label>
                    <div className="font-medium text-gray-900">{selectedIncident.assignedTo}</div>
                    <div className="text-sm text-gray-600">{selectedIncident.assignedTeam}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Time Elapsed</label>
                    <div className="text-2xl font-bold text-red-600">{selectedIncident.timeElapsed}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
              <button
                onClick={handleCloseDetails}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CriticalIncidentsPage;

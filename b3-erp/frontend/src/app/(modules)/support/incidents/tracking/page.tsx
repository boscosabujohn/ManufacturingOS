'use client';

import { useState } from 'react';
import { Activity, AlertTriangle, Clock, Users, Search, Filter, Calendar, TrendingUp, Eye, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

interface Incident {
  id: string;
  incidentNumber: string;
  title: string;
  description: string;
  priority: string;
  severity: string;
  status: string;
  category: string;
  affectedServices: string[];
  reportedBy: string;
  reportedAt: string;
  assignedTo: string;
  assignedTeam: string;
  impactedUsers: number;
  estimatedResolution: string;
  actualResolution?: string;
  lastUpdate: string;
  updateMessage: string;
  businessImpact: string;
  workaround?: string;
  resolutionSteps?: string[];
  escalationLevel: number;
}

const IncidentTrackingPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);

  const [incidents] = useState<Incident[]>([
    {
      id: '1',
      incidentNumber: 'INC-2025-0089',
      title: 'ERP Application Slow Performance',
      description: 'Users reporting extremely slow response times across all modules, particularly in inventory and sales sections',
      priority: 'P1',
      severity: 'High',
      status: 'In Progress',
      category: 'Performance Issue',
      affectedServices: ['ERP Application', 'Database Server', 'API Gateway'],
      reportedBy: 'Rajesh Kumar',
      reportedAt: '2025-10-21 14:30:00',
      assignedTo: 'Priya Sharma',
      assignedTeam: 'Infrastructure Team',
      impactedUsers: 187,
      estimatedResolution: '2025-10-21 18:00:00',
      lastUpdate: '2025-10-21 16:45:00',
      updateMessage: 'Database optimization in progress. Performance improved by 40%',
      businessImpact: 'All users affected, operations significantly slowed',
      workaround: 'Use mobile app for critical transactions',
      resolutionSteps: [
        'Identified database query bottleneck',
        'Applied index optimization',
        'Cleared application cache',
        'Monitoring performance metrics',
      ],
      escalationLevel: 1,
    },
    {
      id: '2',
      incidentNumber: 'INC-2025-0088',
      title: 'Email Service Outage',
      description: 'Complete email service outage affecting all automated notifications and user communications',
      priority: 'P0',
      severity: 'Critical',
      status: 'Critical',
      category: 'Application Error',
      affectedServices: ['Email Service', 'SMTP Server', 'Notification System'],
      reportedBy: 'Amit Patel',
      reportedAt: '2025-10-21 13:15:00',
      assignedTo: 'Vikram Singh',
      assignedTeam: 'DevOps Team',
      impactedUsers: 187,
      estimatedResolution: '2025-10-21 14:30:00',
      lastUpdate: '2025-10-21 14:00:00',
      updateMessage: 'Email server restarted, testing connectivity',
      businessImpact: 'Critical: No automated notifications, order confirmations failing',
      resolutionSteps: [
        'Identified SMTP server failure',
        'Restarted email service',
        'Verified configuration',
        'Testing email delivery',
      ],
      escalationLevel: 2,
    },
    {
      id: '3',
      incidentNumber: 'INC-2025-0087',
      title: 'Payment Gateway Integration Failure',
      description: 'Payment processing failures for online orders, gateway returning timeout errors',
      priority: 'P1',
      severity: 'High',
      status: 'In Progress',
      category: 'Integration Failure',
      affectedServices: ['Payment Gateway', 'Order Management', 'Finance Module'],
      reportedBy: 'Sneha Reddy',
      reportedAt: '2025-10-21 11:00:00',
      assignedTo: 'Rahul Mehta',
      assignedTeam: 'Integration Team',
      impactedUsers: 45,
      estimatedResolution: '2025-10-21 16:00:00',
      lastUpdate: '2025-10-21 15:30:00',
      updateMessage: 'Coordinating with payment gateway provider, API credentials updated',
      businessImpact: 'Online sales halted, revenue loss estimated at ₹2L/hour',
      workaround: 'Manual payment processing via bank transfer',
      resolutionSteps: [
        'Contacted payment gateway support',
        'Updated API credentials',
        'Testing payment flow',
      ],
      escalationLevel: 1,
    },
    {
      id: '4',
      incidentNumber: 'INC-2025-0086',
      title: 'VPN Connection Issues for Remote Users',
      description: 'Multiple remote users unable to connect to VPN, authentication failures reported',
      priority: 'P2',
      severity: 'Medium',
      status: 'Investigating',
      category: 'Network Problem',
      affectedServices: ['VPN Service', 'Authentication Service', 'Network Infrastructure'],
      reportedBy: 'Deepak Joshi',
      reportedAt: '2025-10-21 10:30:00',
      assignedTo: 'Anita Desai',
      assignedTeam: 'Network Team',
      impactedUsers: 23,
      estimatedResolution: '2025-10-21 17:00:00',
      lastUpdate: '2025-10-21 12:00:00',
      updateMessage: 'Investigating VPN server logs, certificate validity confirmed',
      businessImpact: 'Remote workers unable to access internal systems',
      workaround: 'Use web-based applications for non-critical work',
      resolutionSteps: [
        'Verified VPN server status',
        'Checked SSL certificates',
        'Reviewing authentication logs',
      ],
      escalationLevel: 0,
    },
    {
      id: '5',
      incidentNumber: 'INC-2025-0085',
      title: 'Database Backup Failure',
      description: 'Automated daily backup failed, backup files not created for last 2 days',
      priority: 'P1',
      severity: 'High',
      status: 'Resolved',
      category: 'Data Issue',
      affectedServices: ['Backup Service', 'Database Server', 'Cloud Storage'],
      reportedBy: 'System Monitor',
      reportedAt: '2025-10-20 02:15:00',
      assignedTo: 'Suresh Kumar',
      assignedTeam: 'Database Team',
      impactedUsers: 0,
      estimatedResolution: '2025-10-20 10:00:00',
      actualResolution: '2025-10-20 09:30:00',
      lastUpdate: '2025-10-20 09:30:00',
      updateMessage: 'Backup service restored, manual backups completed for missed days',
      businessImpact: 'Data recovery risk in case of system failure',
      resolutionSteps: [
        'Identified disk space issue on backup server',
        'Cleared old backup files',
        'Reconfigured backup retention policy',
        'Completed manual backups',
        'Verified automated backup working',
      ],
      escalationLevel: 0,
    },
    {
      id: '6',
      incidentNumber: 'INC-2025-0084',
      title: 'Production Module Data Sync Error',
      description: 'Work order data not syncing with inventory module, causing stock discrepancies',
      priority: 'P2',
      severity: 'Medium',
      status: 'In Progress',
      category: 'Data Issue',
      affectedServices: ['Production Module', 'Inventory Module', 'Data Sync Service'],
      reportedBy: 'Meera Nair',
      reportedAt: '2025-10-21 09:00:00',
      assignedTo: 'Karthik Iyer',
      assignedTeam: 'Application Team',
      impactedUsers: 34,
      estimatedResolution: '2025-10-21 17:00:00',
      lastUpdate: '2025-10-21 14:30:00',
      updateMessage: 'Data sync queue cleared, running reconciliation scripts',
      businessImpact: 'Inaccurate inventory counts, production planning affected',
      workaround: 'Manual inventory updates until sync restored',
      resolutionSteps: [
        'Identified message queue overflow',
        'Cleared stuck messages',
        'Running data reconciliation',
      ],
      escalationLevel: 0,
    },
    {
      id: '7',
      incidentNumber: 'INC-2025-0083',
      title: 'User Authentication Service Degradation',
      description: 'Login attempts taking 30+ seconds, timeout errors for some users',
      priority: 'P2',
      severity: 'Medium',
      status: 'Monitoring',
      category: 'Performance Issue',
      affectedServices: ['Authentication Service', 'LDAP Server', 'Session Management'],
      reportedBy: 'Pooja Gupta',
      reportedAt: '2025-10-21 08:00:00',
      assignedTo: 'Naveen Kumar',
      assignedTeam: 'Security Team',
      impactedUsers: 67,
      estimatedResolution: '2025-10-21 16:00:00',
      lastUpdate: '2025-10-21 13:00:00',
      updateMessage: 'LDAP cache refreshed, monitoring login performance',
      businessImpact: 'User frustration, delayed work start times',
      workaround: 'Use "Remember Me" option to reduce authentication frequency',
      resolutionSteps: [
        'Refreshed LDAP cache',
        'Optimized session queries',
        'Monitoring performance metrics',
      ],
      escalationLevel: 0,
    },
    {
      id: '8',
      incidentNumber: 'INC-2025-0082',
      title: 'Report Generation Service Timeout',
      description: 'Large reports failing to generate, service timing out after 5 minutes',
      priority: 'P3',
      severity: 'Low',
      status: 'Open',
      category: 'Application Error',
      affectedServices: ['Reports Module', 'Database Server'],
      reportedBy: 'Arjun Verma',
      reportedAt: '2025-10-21 07:30:00',
      assignedTo: 'Unassigned',
      assignedTeam: 'Application Team',
      impactedUsers: 12,
      estimatedResolution: '2025-10-22 12:00:00',
      lastUpdate: '2025-10-21 07:30:00',
      updateMessage: 'Incident logged, awaiting assignment',
      businessImpact: 'Management reports delayed, workaround available',
      workaround: 'Generate reports in smaller date ranges',
      escalationLevel: 0,
    },
  ]);

  const stats = {
    totalIncidents: incidents.length,
    critical: incidents.filter(i => i.status === 'Critical').length,
    inProgress: incidents.filter(i => i.status === 'In Progress').length,
    investigating: incidents.filter(i => i.status === 'Investigating').length,
    monitoring: incidents.filter(i => i.status === 'Monitoring').length,
    resolved: incidents.filter(i => i.status === 'Resolved').length,
  };

  const filteredIncidents = incidents.filter(incident => {
    const matchesSearch = searchTerm === '' || 
      incident.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      incident.incidentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      incident.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPriority = filterPriority === 'all' || incident.priority === filterPriority;
    const matchesStatus = filterStatus === 'all' || incident.status === filterStatus;
    const matchesCategory = filterCategory === 'all' || incident.category === filterCategory;

    return matchesSearch && matchesPriority && matchesStatus && matchesCategory;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'P0': return 'bg-red-100 text-red-800';
      case 'P1': return 'bg-orange-100 text-orange-800';
      case 'P2': return 'bg-yellow-100 text-yellow-800';
      case 'P3': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Critical': return 'bg-red-100 text-red-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Investigating': return 'bg-yellow-100 text-yellow-800';
      case 'Monitoring': return 'bg-purple-100 text-purple-800';
      case 'Resolved': return 'bg-green-100 text-green-800';
      case 'Open': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Critical': return <AlertCircle className="w-4 h-4 text-red-600" />;
      case 'In Progress': return <Activity className="w-4 h-4 text-blue-600" />;
      case 'Investigating': return <Search className="w-4 h-4 text-yellow-600" />;
      case 'Monitoring': return <TrendingUp className="w-4 h-4 text-purple-600" />;
      case 'Resolved': return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      default: return <XCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  const handleViewDetails = (incident: Incident) => {
    setSelectedIncident(incident);
  };

  const handleCloseDetails = () => {
    setSelectedIncident(null);
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <Activity className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Incident Tracking</h1>
              <p className="text-gray-600">Monitor and manage all active incidents</p>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Total Incidents</span>
            <Activity className="w-4 h-4 text-gray-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{stats.totalIncidents}</div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Critical</span>
            <AlertCircle className="w-4 h-4 text-red-600" />
          </div>
          <div className="text-2xl font-bold text-red-600">{stats.critical}</div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">In Progress</span>
            <Activity className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-blue-600">{stats.inProgress}</div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Investigating</span>
            <Search className="w-4 h-4 text-yellow-600" />
          </div>
          <div className="text-2xl font-bold text-yellow-600">{stats.investigating}</div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Monitoring</span>
            <TrendingUp className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-purple-600">{stats.monitoring}</div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Resolved</span>
            <CheckCircle2 className="w-4 h-4 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-green-600">{stats.resolved}</div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Filter className="w-5 h-5 text-gray-600" />
          <h3 className="font-semibold text-gray-900">Search & Filters</h3>
        </div>
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[300px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search incidents by title, number, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
          </div>
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            <option value="all">All Priorities</option>
            <option value="P0">P0 - Critical</option>
            <option value="P1">P1 - High</option>
            <option value="P2">P2 - Medium</option>
            <option value="P3">P3 - Low</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="Critical">Critical</option>
            <option value="In Progress">In Progress</option>
            <option value="Investigating">Investigating</option>
            <option value="Monitoring">Monitoring</option>
            <option value="Resolved">Resolved</option>
            <option value="Open">Open</option>
          </select>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            <option value="all">All Categories</option>
            <option value="Application Error">Application Error</option>
            <option value="Performance Issue">Performance Issue</option>
            <option value="Data Issue">Data Issue</option>
            <option value="Network Problem">Network Problem</option>
            <option value="Integration Failure">Integration Failure</option>
          </select>
        </div>
      </div>

      {/* Incidents List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left p-4 text-sm font-semibold text-gray-900">Incident</th>
                <th className="text-left p-4 text-sm font-semibold text-gray-900">Priority</th>
                <th className="text-left p-4 text-sm font-semibold text-gray-900">Status</th>
                <th className="text-left p-4 text-sm font-semibold text-gray-900">Assigned To</th>
                <th className="text-left p-4 text-sm font-semibold text-gray-900">Impacted Users</th>
                <th className="text-left p-4 text-sm font-semibold text-gray-900">Last Update</th>
                <th className="text-center p-4 text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredIncidents.map((incident) => (
                <tr key={incident.id} className="hover:bg-gray-50">
                  <td className="p-4">
                    <div>
                      <div className="font-semibold text-gray-900">{incident.incidentNumber}</div>
                      <div className="text-sm text-gray-600 line-clamp-1">{incident.title}</div>
                      <div className="text-xs text-gray-500 mt-1">{incident.category}</div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(incident.priority)}`}>
                      {incident.priority}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(incident.status)}`}>
                      {getStatusIcon(incident.status)}
                      {incident.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{incident.assignedTo}</div>
                      <div className="text-xs text-gray-500">{incident.assignedTeam}</div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span className="font-semibold text-gray-900">{incident.impactedUsers}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div>
                      <div className="text-sm text-gray-900">{incident.lastUpdate}</div>
                      <div className="text-xs text-gray-500 line-clamp-1">{incident.updateMessage}</div>
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => handleViewDetails(incident)}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredIncidents.length === 0 && (
          <div className="p-12 text-center">
            <Activity className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">No incidents found matching your criteria</p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedIncident && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-7xl w-full max-h-[90vh] overflow-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
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
              <div className="grid grid-cols-3 gap-6">
                {/* Left Column */}
                <div className="col-span-2 space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">Description</label>
                    <div className="bg-gray-50 rounded-lg p-4 text-gray-900">{selectedIncident.description}</div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">Business Impact</label>
                    <div className="bg-red-50 rounded-lg p-4 text-red-900">{selectedIncident.businessImpact}</div>
                  </div>

                  {selectedIncident.workaround && (
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">Workaround</label>
                      <div className="bg-blue-50 rounded-lg p-4 text-blue-900">{selectedIncident.workaround}</div>
                    </div>
                  )}

                  {selectedIncident.resolutionSteps && selectedIncident.resolutionSteps.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">Resolution Steps</label>
                      <div className="space-y-2">
                        {selectedIncident.resolutionSteps.map((step, idx) => (
                          <div key={idx} className="flex items-start gap-3 bg-gray-50 rounded-lg p-3">
                            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-900">{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">Affected Services</label>
                    <div className="flex flex-wrap gap-2">
                      {selectedIncident.affectedServices.map((service, idx) => (
                        <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">Priority</label>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(selectedIncident.priority)}`}>
                      {selectedIncident.priority}
                    </span>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">Status</label>
                    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedIncident.status)}`}>
                      {getStatusIcon(selectedIncident.status)}
                      {selectedIncident.status}
                    </span>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">Severity</label>
                    <div className="text-gray-900 font-medium">{selectedIncident.severity}</div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">Category</label>
                    <div className="text-gray-900">{selectedIncident.category}</div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">Assigned To</label>
                    <div className="text-gray-900 font-medium">{selectedIncident.assignedTo}</div>
                    <div className="text-sm text-gray-500">{selectedIncident.assignedTeam}</div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">Reported By</label>
                    <div className="text-gray-900">{selectedIncident.reportedBy}</div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">Reported At</label>
                    <div className="text-gray-900">{selectedIncident.reportedAt}</div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">Impacted Users</label>
                    <div className="text-2xl font-bold text-red-600">{selectedIncident.impactedUsers}</div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">Estimated Resolution</label>
                    <div className="text-gray-900">{selectedIncident.estimatedResolution}</div>
                  </div>

                  {selectedIncident.actualResolution && (
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">Actual Resolution</label>
                      <div className="text-green-600 font-medium">{selectedIncident.actualResolution}</div>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">Escalation Level</label>
                    <div className="text-2xl font-bold text-orange-600">Level {selectedIncident.escalationLevel}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
              <button
                onClick={handleCloseDetails}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
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

export default IncidentTrackingPage;

'use client';

import React, { useState, useEffect } from 'react';
import {
  ClipboardCheck, Package, AlertTriangle, CheckCircle,
  XCircle, Clock, TrendingUp, Shield, FileText, Camera,
  Settings, Download, Upload, Calendar, Filter, Search,
  BarChart3, PieChart, Activity, Users, Zap, AlertCircle,
  Target, Award, Gauge, ChevronRight, Eye, Edit3
} from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, PieChart as RePieChart, Pie,
  Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  AreaChart, Area, ScatterChart, Scatter, Treemap, Sankey
} from 'recharts';

interface QualityAssuranceProps {}

const QualityAssurance: React.FC<QualityAssuranceProps> = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedInspection, setSelectedInspection] = useState<any>(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data for quality metrics
  const qualityMetrics = {
    passRate: 96.5,
    defectRate: 3.5,
    inspectionsToday: 45,
    pendingInspections: 12,
    avgInspectionTime: '24 min',
    complianceScore: 98.2
  };

  // Mock data for inspection queue
  const inspectionQueue = [
    {
      id: 'INS001',
      poNumber: 'PO2024-001',
      supplier: 'Tech Components Ltd',
      items: 'Electronic Components',
      quantity: 5000,
      priority: 'high',
      dueDate: '2024-12-20',
      status: 'pending',
      inspector: null,
      riskLevel: 'medium'
    },
    {
      id: 'INS002',
      poNumber: 'PO2024-002',
      supplier: 'Metal Works Inc',
      items: 'Steel Plates',
      quantity: 200,
      priority: 'medium',
      dueDate: '2024-12-21',
      status: 'in_progress',
      inspector: 'John Smith',
      riskLevel: 'low'
    },
    {
      id: 'INS003',
      poNumber: 'PO2024-003',
      supplier: 'Chemical Supply Co',
      items: 'Raw Chemicals',
      quantity: 1000,
      priority: 'critical',
      dueDate: '2024-12-19',
      status: 'pending',
      inspector: null,
      riskLevel: 'high'
    }
  ];

  // Mock data for quality trends
  const qualityTrends = [
    { month: 'Jul', passRate: 95.2, defectRate: 4.8, inspections: 320 },
    { month: 'Aug', passRate: 96.1, defectRate: 3.9, inspections: 345 },
    { month: 'Sep', passRate: 95.8, defectRate: 4.2, inspections: 358 },
    { month: 'Oct', passRate: 96.5, defectRate: 3.5, inspections: 372 },
    { month: 'Nov', passRate: 96.3, defectRate: 3.7, inspections: 385 },
    { month: 'Dec', passRate: 96.5, defectRate: 3.5, inspections: 390 }
  ];

  // Mock data for defect categories
  const defectCategories = [
    { name: 'Dimensional', value: 35, color: '#3B82F6' },
    { name: 'Surface Finish', value: 25, color: '#10B981' },
    { name: 'Material', value: 20, color: '#F59E0B' },
    { name: 'Packaging', value: 12, color: '#EF4444' },
    { name: 'Documentation', value: 8, color: '#8B5CF6' }
  ];

  // Mock data for supplier quality scores
  const supplierQualityScores = [
    { supplier: 'Tech Components Ltd', score: 98.5, trend: 'up', inspections: 45 },
    { supplier: 'Metal Works Inc', score: 97.2, trend: 'stable', inspections: 38 },
    { supplier: 'Chemical Supply Co', score: 95.8, trend: 'down', inspections: 52 },
    { supplier: 'Plastic Solutions', score: 99.1, trend: 'up', inspections: 29 },
    { supplier: 'Global Electronics', score: 96.4, trend: 'up', inspections: 41 }
  ];

  // Mock data for inspection templates
  const inspectionTemplates = [
    {
      id: 'TPL001',
      name: 'Electronics Inspection',
      category: 'Electronics',
      checkpoints: 25,
      lastUsed: '2024-12-15',
      usage: 156
    },
    {
      id: 'TPL002',
      name: 'Raw Material Quality Check',
      category: 'Materials',
      checkpoints: 18,
      lastUsed: '2024-12-14',
      usage: 203
    },
    {
      id: 'TPL003',
      name: 'Packaging Verification',
      category: 'Packaging',
      checkpoints: 12,
      lastUsed: '2024-12-16',
      usage: 89
    }
  ];

  // Mock data for compliance standards
  const complianceStandards = [
    { standard: 'ISO 9001', status: 'compliant', score: 98, lastAudit: '2024-11-15' },
    { standard: 'ISO 14001', status: 'compliant', score: 96, lastAudit: '2024-10-20' },
    { standard: 'OHSAS 18001', status: 'pending', score: 94, lastAudit: '2024-09-10' },
    { standard: 'Industry Specific', status: 'compliant', score: 97, lastAudit: '2024-11-01' }
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Quality Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Pass Rate</p>
              <p className="text-2xl font-bold">{qualityMetrics.passRate}%</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm">Defect Rate</p>
              <p className="text-2xl font-bold">{qualityMetrics.defectRate}%</p>
            </div>
            <XCircle className="h-8 w-8 text-red-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Today's Inspections</p>
              <p className="text-2xl font-bold">{qualityMetrics.inspectionsToday}</p>
            </div>
            <ClipboardCheck className="h-8 w-8 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm">Pending</p>
              <p className="text-2xl font-bold">{qualityMetrics.pendingInspections}</p>
            </div>
            <Clock className="h-8 w-8 text-yellow-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Avg Time</p>
              <p className="text-2xl font-bold">{qualityMetrics.avgInspectionTime}</p>
            </div>
            <Clock className="h-8 w-8 text-purple-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-indigo-100 text-sm">Compliance</p>
              <p className="text-2xl font-bold">{qualityMetrics.complianceScore}%</p>
            </div>
            <Shield className="h-8 w-8 text-indigo-200" />
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quality Trends Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Quality Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={qualityTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="passRate" stroke="#10B981" name="Pass Rate %" strokeWidth={2} />
              <Line type="monotone" dataKey="defectRate" stroke="#EF4444" name="Defect Rate %" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Defect Categories */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Defect Categories</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RePieChart>
              <Pie
                data={defectCategories}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {defectCategories.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </RePieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Supplier Quality Scores */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Supplier Quality Scores</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Supplier</th>
                <th className="text-left py-2">Quality Score</th>
                <th className="text-left py-2">Trend</th>
                <th className="text-left py-2">Inspections</th>
                <th className="text-left py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {supplierQualityScores.map((supplier, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="py-2">{supplier.supplier}</td>
                  <td className="py-2">
                    <div className="flex items-center">
                      <span className="font-semibold">{supplier.score}%</span>
                      <div className="ml-2 w-32 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            supplier.score >= 98 ? 'bg-green-500' :
                            supplier.score >= 95 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${supplier.score}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                      supplier.trend === 'up' ? 'bg-green-100 text-green-800' :
                      supplier.trend === 'down' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {supplier.trend === 'up' ? '↑' : supplier.trend === 'down' ? '↓' : '→'}
                      {supplier.trend}
                    </span>
                  </td>
                  <td className="py-2">{supplier.inspections}</td>
                  <td className="py-2">
                    <button className="text-blue-600 hover:text-blue-800">View Report</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderInspections = () => (
    <div className="space-y-6">
      {/* Inspection Queue Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Inspection Queue</h3>
        <div className="flex gap-2">
          <select
            className="px-3 py-2 border rounded-lg"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
          </select>
          <div className="flex items-center border rounded-lg px-3 py-2">
            <Search className="h-4 w-4 text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search inspections..."
              className="outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Inspection
          </button>
        </div>
      </div>

      {/* Inspection Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {inspectionQueue.map((inspection) => (
          <div key={inspection.id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="font-semibold text-lg">{inspection.id}</h4>
                <p className="text-gray-600 text-sm">{inspection.poNumber}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs ${
                inspection.priority === 'critical' ? 'bg-red-100 text-red-800' :
                inspection.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                inspection.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800'
              }`}>
                {inspection.priority.toUpperCase()}
              </span>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span className="text-gray-600 text-sm">Supplier:</span>
                <span className="text-sm font-medium">{inspection.supplier}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 text-sm">Items:</span>
                <span className="text-sm">{inspection.items}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 text-sm">Quantity:</span>
                <span className="text-sm">{inspection.quantity.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 text-sm">Due Date:</span>
                <span className="text-sm">{inspection.dueDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 text-sm">Risk Level:</span>
                <span className={`text-sm font-medium ${
                  inspection.riskLevel === 'high' ? 'text-red-600' :
                  inspection.riskLevel === 'medium' ? 'text-yellow-600' :
                  'text-green-600'
                }`}>
                  {inspection.riskLevel.toUpperCase()}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t">
              <span className={`px-2 py-1 rounded-full text-xs ${
                inspection.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                inspection.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                inspection.status === 'completed' ? 'bg-green-100 text-green-800' :
                'bg-red-100 text-red-800'
              }`}>
                {inspection.status.replace('_', ' ').toUpperCase()}
              </span>

              <div className="flex gap-2">
                <button className="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                  <Eye className="h-4 w-4 text-gray-600" />
                  <span className="text-gray-700">View</span>
                </button>
                <button className="inline-flex items-center gap-1.5 px-3 py-2 border border-green-300 rounded-lg hover:bg-green-50 text-sm">
                  <ClipboardCheck className="h-4 w-4 text-green-600" />
                  <span className="text-green-600">Check</span>
                </button>
              </div>
            </div>

            {inspection.inspector && (
              <div className="mt-2 pt-2 border-t">
                <p className="text-xs text-gray-600">
                  Inspector: <span className="font-medium">{inspection.inspector}</span>
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Inspection Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h4 className="font-semibold mb-4">Inspection Volume</h4>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={qualityTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="inspections" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h4 className="font-semibold mb-4">Priority Distribution</h4>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={[
              { priority: 'Critical', count: 5 },
              { priority: 'High', count: 12 },
              { priority: 'Medium', count: 18 },
              { priority: 'Low', count: 10 }
            ]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="priority" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#8B5CF6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h4 className="font-semibold mb-4">Inspector Performance</h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">John Smith</span>
              <div className="flex items-center gap-2">
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }} />
                </div>
                <span className="text-sm text-gray-600">85%</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Jane Doe</span>
              <div className="flex items-center gap-2">
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '92%' }} />
                </div>
                <span className="text-sm text-gray-600">92%</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Mike Johnson</span>
              <div className="flex items-center gap-2">
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '78%' }} />
                </div>
                <span className="text-sm text-gray-600">78%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTemplates = () => (
    <div className="space-y-6">
      {/* Templates Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Inspection Templates</h3>
        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create Template
        </button>
      </div>

      {/* Template Categories */}
      <div className="flex gap-2">
        <button className="px-4 py-2 bg-blue-500 text-white rounded-lg">All Templates</button>
        <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">Electronics</button>
        <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">Materials</button>
        <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">Packaging</button>
        <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">Chemicals</button>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {inspectionTemplates.map((template) => (
          <div key={template.id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <FileText className="h-10 w-10 text-blue-500" />
              <span className="text-xs text-gray-500">{template.id}</span>
            </div>

            <h4 className="font-semibold text-lg mb-2">{template.name}</h4>
            <p className="text-gray-600 text-sm mb-4">Category: {template.category}</p>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Checkpoints:</span>
                <span className="font-medium">{template.checkpoints}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Last Used:</span>
                <span>{template.lastUsed}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total Usage:</span>
                <span className="font-medium">{template.usage} times</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button className="flex-1 bg-blue-500 text-white py-2 rounded hover:bg-blue-600 text-sm">
                Use Template
              </button>
              <button className="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded hover:bg-gray-50">
                <Edit3 className="h-4 w-4 text-gray-600" />
                <span className="text-gray-700">Edit</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Template Checklist Preview */}
      <div className="bg-white rounded-lg shadow p-6">
        <h4 className="font-semibold text-lg mb-4">Electronics Inspection Checklist</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h5 className="font-medium mb-3">Visual Inspection</h5>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded" />
                <span className="text-sm">Check for physical damage</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded" />
                <span className="text-sm">Verify component placement</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded" />
                <span className="text-sm">Inspect solder joints</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded" />
                <span className="text-sm">Check for contamination</span>
              </label>
            </div>
          </div>

          <div>
            <h5 className="font-medium mb-3">Functional Testing</h5>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded" />
                <span className="text-sm">Power-on test</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded" />
                <span className="text-sm">Voltage measurements</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded" />
                <span className="text-sm">Signal integrity check</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded" />
                <span className="text-sm">Temperature testing</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCompliance = () => (
    <div className="space-y-6">
      {/* Compliance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {complianceStandards.map((standard, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <Shield className={`h-8 w-8 ${
                standard.status === 'compliant' ? 'text-green-500' :
                standard.status === 'pending' ? 'text-yellow-500' :
                'text-red-500'
              }`} />
              <span className={`px-2 py-1 rounded-full text-xs ${
                standard.status === 'compliant' ? 'bg-green-100 text-green-800' :
                standard.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {standard.status.toUpperCase()}
              </span>
            </div>

            <h4 className="font-semibold mb-2">{standard.standard}</h4>
            <div className="mb-3">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Score</span>
                <span className="font-medium">{standard.score}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    standard.score >= 95 ? 'bg-green-500' :
                    standard.score >= 90 ? 'bg-yellow-500' :
                    'bg-red-500'
                  }`}
                  style={{ width: `${standard.score}%` }}
                />
              </div>
            </div>

            <p className="text-xs text-gray-600">
              Last Audit: {standard.lastAudit}
            </p>
          </div>
        ))}
      </div>

      {/* Compliance Requirements */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Compliance Requirements Tracking</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Requirement</th>
                <th className="text-left py-2">Standard</th>
                <th className="text-left py-2">Status</th>
                <th className="text-left py-2">Due Date</th>
                <th className="text-left py-2">Evidence</th>
                <th className="text-left py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b hover:bg-gray-50">
                <td className="py-2">Quality Manual Update</td>
                <td className="py-2">ISO 9001</td>
                <td className="py-2">
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                    Completed
                  </span>
                </td>
                <td className="py-2">2024-12-01</td>
                <td className="py-2">
                  <button className="text-blue-600 hover:text-blue-800 flex items-center gap-1">
                    <FileText className="h-4 w-4" />
                    View
                  </button>
                </td>
                <td className="py-2">
                  <button className="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                    <Eye className="h-4 w-4 text-gray-600" />
                    <span className="text-gray-700">View</span>
                  </button>
                </td>
              </tr>
              <tr className="border-b hover:bg-gray-50">
                <td className="py-2">Internal Audit</td>
                <td className="py-2">ISO 14001</td>
                <td className="py-2">
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                    In Progress
                  </span>
                </td>
                <td className="py-2">2024-12-15</td>
                <td className="py-2">
                  <button className="text-gray-400">
                    <Upload className="h-4 w-4" />
                  </button>
                </td>
                <td className="py-2">
                  <button className="text-blue-600 hover:text-blue-800">
                    Update
                  </button>
                </td>
              </tr>
              <tr className="border-b hover:bg-gray-50">
                <td className="py-2">Safety Training Records</td>
                <td className="py-2">OHSAS 18001</td>
                <td className="py-2">
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                    Pending
                  </span>
                </td>
                <td className="py-2">2024-12-20</td>
                <td className="py-2">
                  <button className="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                    <Upload className="h-4 w-4 text-gray-600" />
                    <span className="text-gray-700">Upload</span>
                  </button>
                </td>
                <td className="py-2">
                  <button className="text-blue-600 hover:text-blue-800">
                    Upload
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Audit Calendar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h4 className="font-semibold mb-4">Upcoming Audits</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <Calendar className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="font-medium">ISO 9001 Surveillance Audit</p>
                  <p className="text-sm text-gray-600">External Auditor: SGS</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium">Jan 15, 2025</p>
                <p className="text-xs text-gray-500">In 30 days</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <Calendar className="h-8 w-8 text-green-500" />
                <div>
                  <p className="font-medium">Internal Quality Audit</p>
                  <p className="text-sm text-gray-600">Lead: Quality Team</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium">Dec 28, 2024</p>
                <p className="text-xs text-gray-500">In 12 days</p>
              </div>
            </div>
          </div>
        </div>

        {/* Non-Conformance Tracking */}
        <div className="bg-white rounded-lg shadow p-6">
          <h4 className="font-semibold mb-4">Non-Conformance Report</h4>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={[
              { month: 'Jul', major: 2, minor: 5 },
              { month: 'Aug', major: 1, minor: 4 },
              { month: 'Sep', major: 1, minor: 3 },
              { month: 'Oct', major: 0, minor: 2 },
              { month: 'Nov', major: 1, minor: 2 },
              { month: 'Dec', major: 0, minor: 1 }
            ]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="major" stroke="#EF4444" name="Major NCR" strokeWidth={2} />
              <Line type="monotone" dataKey="minor" stroke="#F59E0B" name="Minor NCR" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  const renderReports = () => (
    <div className="space-y-6">
      {/* Report Generation */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Generate Quality Reports</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Report Type</label>
            <select className="w-full px-3 py-2 border rounded-lg">
              <option>Inspection Summary</option>
              <option>Supplier Quality Report</option>
              <option>Defect Analysis</option>
              <option>Compliance Status</option>
              <option>Quality Metrics Dashboard</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Date Range</label>
            <select className="w-full px-3 py-2 border rounded-lg">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>Last Quarter</option>
              <option>Year to Date</option>
              <option>Custom Range</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Format</label>
            <select className="w-full px-3 py-2 border rounded-lg">
              <option>PDF</option>
              <option>Excel</option>
              <option>CSV</option>
              <option>Word</option>
            </select>
          </div>
        </div>
        <button className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 flex items-center gap-2">
          <Download className="h-4 w-4" />
          Generate Report
        </button>
      </div>

      {/* Recent Reports */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Reports</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Report Name</th>
                <th className="text-left py-2">Type</th>
                <th className="text-left py-2">Generated By</th>
                <th className="text-left py-2">Date</th>
                <th className="text-left py-2">Size</th>
                <th className="text-left py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b hover:bg-gray-50">
                <td className="py-2">Monthly Quality Summary Dec 2024</td>
                <td className="py-2">Quality Metrics</td>
                <td className="py-2">John Smith</td>
                <td className="py-2">2024-12-15</td>
                <td className="py-2">2.3 MB</td>
                <td className="py-2">
                  <div className="flex gap-2">
                    <button className="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                      <Download className="h-4 w-4 text-gray-600" />
                      <span className="text-gray-700">Download</span>
                    </button>
                    <button className="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                      <Eye className="h-4 w-4 text-gray-600" />
                      <span className="text-gray-700">View</span>
                    </button>
                  </div>
                </td>
              </tr>
              <tr className="border-b hover:bg-gray-50">
                <td className="py-2">Supplier Quality Report Q4 2024</td>
                <td className="py-2">Supplier Analysis</td>
                <td className="py-2">Jane Doe</td>
                <td className="py-2">2024-12-10</td>
                <td className="py-2">3.1 MB</td>
                <td className="py-2">
                  <div className="flex gap-2">
                    <button className="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                      <Download className="h-4 w-4 text-gray-600" />
                      <span className="text-gray-700">Download</span>
                    </button>
                    <button className="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                      <Eye className="h-4 w-4 text-gray-600" />
                      <span className="text-gray-700">View</span>
                    </button>
                  </div>
                </td>
              </tr>
              <tr className="border-b hover:bg-gray-50">
                <td className="py-2">ISO 9001 Compliance Report</td>
                <td className="py-2">Compliance</td>
                <td className="py-2">Mike Johnson</td>
                <td className="py-2">2024-12-05</td>
                <td className="py-2">1.8 MB</td>
                <td className="py-2">
                  <div className="flex gap-2">
                    <button className="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                      <Download className="h-4 w-4 text-gray-600" />
                      <span className="text-gray-700">Download</span>
                    </button>
                    <button className="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                      <Eye className="h-4 w-4 text-gray-600" />
                      <span className="text-gray-700">View</span>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Quality Metrics Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h4 className="font-semibold mb-4">Quality KPI Summary</h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Target className="h-5 w-5 text-blue-500" />
                <span>First Pass Yield</span>
              </div>
              <div className="text-right">
                <p className="font-semibold">96.5%</p>
                <p className="text-xs text-green-600">↑ 2.3%</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Gauge className="h-5 w-5 text-purple-500" />
                <span>Customer Satisfaction</span>
              </div>
              <div className="text-right">
                <p className="font-semibold">4.8/5.0</p>
                <p className="text-xs text-green-600">↑ 0.2</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-yellow-500" />
                <span>Cost of Quality</span>
              </div>
              <div className="text-right">
                <p className="font-semibold">$45,230</p>
                <p className="text-xs text-red-600">↑ 5.1%</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Award className="h-5 w-5 text-green-500" />
                <span>Supplier Quality Rating</span>
              </div>
              <div className="text-right">
                <p className="font-semibold">97.2%</p>
                <p className="text-xs text-green-600">↑ 1.8%</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h4 className="font-semibold mb-4">Scheduled Reports</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Weekly Quality Summary</p>
                <p className="text-sm text-gray-600">Every Monday, 9:00 AM</p>
              </div>
              <button className="text-blue-600 hover:text-blue-800">Edit</button>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Monthly Supplier Scorecard</p>
                <p className="text-sm text-gray-600">1st of each month</p>
              </div>
              <button className="text-blue-600 hover:text-blue-800">Edit</button>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Quarterly Compliance Report</p>
                <p className="text-sm text-gray-600">End of each quarter</p>
              </div>
              <button className="text-blue-600 hover:text-blue-800">Edit</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const Plus = ({ className = "" }: { className?: string }) => (
    <svg className={`w-4 h-4 ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  );

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Quality Assurance & Inspection</h2>
        <p className="text-gray-600">Ensure product quality and compliance standards</p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-1 mb-6 border-b">
        {['overview', 'inspections', 'templates', 'compliance', 'reports'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-medium capitalize transition-colors ${
              activeTab === tab
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && renderOverview()}
      {activeTab === 'inspections' && renderInspections()}
      {activeTab === 'templates' && renderTemplates()}
      {activeTab === 'compliance' && renderCompliance()}
      {activeTab === 'reports' && renderReports()}
    </div>
  );
};

export default QualityAssurance;
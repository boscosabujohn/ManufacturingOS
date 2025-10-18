'use client';

import React, { useState, useEffect } from 'react';
import {
  AlertTriangle, Shield, TrendingUp, TrendingDown, Activity,
  BarChart3, PieChart, Target, AlertCircle, CheckCircle,
  XCircle, Clock, Users, Package, DollarSign, Globe,
  Zap, FileText, Settings, Filter, Search, Download,
  ChevronRight, Eye, Edit3, Plus, Gauge, Award,
  ShieldAlert, ShieldCheck, ShieldOff, TrendingFlat
} from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, PieChart as RePieChart, Pie,
  Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  AreaChart, Area, ScatterChart, Scatter, Treemap, ComposedChart
} from 'recharts';

interface ProcurementRiskManagementProps {}

const ProcurementRiskManagement: React.FC<ProcurementRiskManagementProps> = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedRisk, setSelectedRisk] = useState<any>(null);
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data for risk metrics
  const riskMetrics = {
    totalRisks: 42,
    criticalRisks: 5,
    highRisks: 12,
    mediumRisks: 18,
    lowRisks: 7,
    averageScore: 6.8,
    mitigatedThisMonth: 8,
    newRisksIdentified: 3
  };

  // Mock data for risk register
  const riskRegister = [
    {
      id: 'RSK001',
      title: 'Single Supplier Dependency',
      category: 'Supply Chain',
      supplier: 'Tech Components Ltd',
      probability: 4,
      impact: 5,
      riskScore: 20,
      status: 'active',
      owner: 'John Smith',
      mitigation: 'Identify alternative suppliers',
      residualRisk: 12,
      lastReview: '2024-12-10'
    },
    {
      id: 'RSK002',
      title: 'Currency Fluctuation',
      category: 'Financial',
      supplier: 'Global Electronics',
      probability: 3,
      impact: 4,
      riskScore: 12,
      status: 'monitoring',
      owner: 'Jane Doe',
      mitigation: 'Implement hedging strategies',
      residualRisk: 8,
      lastReview: '2024-12-05'
    },
    {
      id: 'RSK003',
      title: 'Quality Control Failure',
      category: 'Operational',
      supplier: 'Chemical Supply Co',
      probability: 2,
      impact: 5,
      riskScore: 10,
      status: 'mitigated',
      owner: 'Mike Johnson',
      mitigation: 'Enhanced inspection protocols',
      residualRisk: 4,
      lastReview: '2024-12-12'
    },
    {
      id: 'RSK004',
      title: 'Geopolitical Instability',
      category: 'Geopolitical',
      supplier: 'International Metals',
      probability: 3,
      impact: 5,
      riskScore: 15,
      status: 'active',
      owner: 'Sarah Brown',
      mitigation: 'Diversify supply base',
      residualRisk: 10,
      lastReview: '2024-12-08'
    }
  ];

  // Mock data for risk trends
  const riskTrends = [
    { month: 'Jul', total: 38, critical: 3, high: 10, medium: 18, low: 7 },
    { month: 'Aug', total: 40, critical: 4, high: 11, medium: 17, low: 8 },
    { month: 'Sep', total: 39, critical: 4, high: 10, medium: 18, low: 7 },
    { month: 'Oct', total: 41, critical: 5, high: 11, medium: 17, low: 8 },
    { month: 'Nov', total: 43, critical: 5, high: 12, medium: 19, low: 7 },
    { month: 'Dec', total: 42, critical: 5, high: 12, medium: 18, low: 7 }
  ];

  // Mock data for risk categories
  const riskCategories = [
    { name: 'Supply Chain', value: 35, color: '#3B82F6' },
    { name: 'Financial', value: 25, color: '#10B981' },
    { name: 'Operational', value: 20, color: '#F59E0B' },
    { name: 'Compliance', value: 10, color: '#EF4444' },
    { name: 'Geopolitical', value: 10, color: '#8B5CF6' }
  ];

  // Mock data for supplier risk scores
  const supplierRiskScores = [
    { supplier: 'Tech Components Ltd', riskScore: 72, trend: 'increasing', category: 'High' },
    { supplier: 'Metal Works Inc', riskScore: 35, trend: 'stable', category: 'Low' },
    { supplier: 'Chemical Supply Co', riskScore: 58, trend: 'decreasing', category: 'Medium' },
    { supplier: 'Global Electronics', riskScore: 45, trend: 'stable', category: 'Medium' },
    { supplier: 'Plastic Solutions', riskScore: 28, trend: 'decreasing', category: 'Low' }
  ];

  // Mock data for risk matrix
  const riskMatrix = [
    { probability: 5, impact: 5, count: 2, risks: ['RSK001', 'RSK004'] },
    { probability: 5, impact: 4, count: 1, risks: ['RSK007'] },
    { probability: 5, impact: 3, count: 0, risks: [] },
    { probability: 5, impact: 2, count: 0, risks: [] },
    { probability: 5, impact: 1, count: 0, risks: [] },
    { probability: 4, impact: 5, count: 3, risks: ['RSK001', 'RSK008', 'RSK009'] },
    { probability: 4, impact: 4, count: 2, risks: ['RSK010', 'RSK011'] },
    { probability: 4, impact: 3, count: 1, risks: ['RSK012'] },
    { probability: 4, impact: 2, count: 0, risks: [] },
    { probability: 4, impact: 1, count: 0, risks: [] },
    { probability: 3, impact: 5, count: 2, risks: ['RSK004', 'RSK013'] },
    { probability: 3, impact: 4, count: 3, risks: ['RSK002', 'RSK014', 'RSK015'] },
    { probability: 3, impact: 3, count: 2, risks: ['RSK016', 'RSK017'] },
    { probability: 3, impact: 2, count: 1, risks: ['RSK018'] },
    { probability: 3, impact: 1, count: 0, risks: [] },
    { probability: 2, impact: 5, count: 1, risks: ['RSK003'] },
    { probability: 2, impact: 4, count: 2, risks: ['RSK019', 'RSK020'] },
    { probability: 2, impact: 3, count: 1, risks: ['RSK021'] },
    { probability: 2, impact: 2, count: 1, risks: ['RSK022'] },
    { probability: 2, impact: 1, count: 0, risks: [] },
    { probability: 1, impact: 5, count: 0, risks: [] },
    { probability: 1, impact: 4, count: 0, risks: [] },
    { probability: 1, impact: 3, count: 1, risks: ['RSK023'] },
    { probability: 1, impact: 2, count: 1, risks: ['RSK024'] },
    { probability: 1, impact: 1, count: 2, risks: ['RSK025', 'RSK026'] }
  ];

  // Mock data for mitigation strategies
  const mitigationStrategies = [
    {
      id: 'MIT001',
      strategy: 'Supplier Diversification',
      risksCovered: 8,
      status: 'in_progress',
      effectiveness: 85,
      cost: 50000,
      timeline: 'Q1 2025'
    },
    {
      id: 'MIT002',
      strategy: 'Inventory Buffer Stock',
      risksCovered: 5,
      status: 'completed',
      effectiveness: 72,
      cost: 75000,
      timeline: 'Q4 2024'
    },
    {
      id: 'MIT003',
      strategy: 'Contract Renegotiation',
      risksCovered: 6,
      status: 'planned',
      effectiveness: 68,
      cost: 15000,
      timeline: 'Q2 2025'
    }
  ];

  const getRiskColor = (score: number) => {
    if (score >= 15) return 'bg-red-500';
    if (score >= 10) return 'bg-orange-500';
    if (score >= 5) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getRiskLevel = (score: number) => {
    if (score >= 15) return 'Critical';
    if (score >= 10) return 'High';
    if (score >= 5) return 'Medium';
    return 'Low';
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Risk Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm">Critical Risks</p>
              <p className="text-3xl font-bold">{riskMetrics.criticalRisks}</p>
              <p className="text-red-100 text-xs mt-1">Immediate action required</p>
            </div>
            <ShieldAlert className="h-10 w-10 text-red-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">High Risks</p>
              <p className="text-3xl font-bold">{riskMetrics.highRisks}</p>
              <p className="text-orange-100 text-xs mt-1">Close monitoring needed</p>
            </div>
            <AlertTriangle className="h-10 w-10 text-orange-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm">Medium Risks</p>
              <p className="text-3xl font-bold">{riskMetrics.mediumRisks}</p>
              <p className="text-yellow-100 text-xs mt-1">Regular review</p>
            </div>
            <AlertCircle className="h-10 w-10 text-yellow-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Low Risks</p>
              <p className="text-3xl font-bold">{riskMetrics.lowRisks}</p>
              <p className="text-green-100 text-xs mt-1">Acceptable level</p>
            </div>
            <ShieldCheck className="h-10 w-10 text-green-200" />
          </div>
        </div>
      </div>

      {/* Risk Score and Mitigation Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Average Risk Score</h3>
            <Gauge className="h-5 w-5 text-gray-400" />
          </div>
          <div className="flex items-center justify-center">
            <div className="relative">
              <svg className="w-32 h-32">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="#E5E7EB"
                  strokeWidth="12"
                  fill="none"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="#F59E0B"
                  strokeWidth="12"
                  fill="none"
                  strokeDasharray={`${(riskMetrics.averageScore / 10) * 351.86} 351.86`}
                  strokeLinecap="round"
                  transform="rotate(-90 64 64)"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-3xl font-bold">{riskMetrics.averageScore}</p>
                  <p className="text-sm text-gray-600">out of 10</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Risk Mitigation Progress</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Mitigated This Month</span>
                <span className="font-medium">{riskMetrics.mitigatedThisMonth}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '67%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>New Risks Identified</span>
                <span className="font-medium">{riskMetrics.newRisksIdentified}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '25%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Active Mitigation Plans</span>
                <span className="font-medium">15</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '83%' }} />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Risk Category Distribution</h3>
          <ResponsiveContainer width="100%" height={150}>
            <RePieChart>
              <Pie
                data={riskCategories}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={60}
                fill="#8884d8"
                dataKey="value"
              >
                {riskCategories.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </RePieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {riskCategories.map((cat, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded`} style={{ backgroundColor: cat.color }} />
                <span className="text-xs">{cat.name}: {cat.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Risk Trends Chart */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Risk Trends Over Time</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={riskTrends}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area type="monotone" dataKey="critical" stackId="1" stroke="#EF4444" fill="#EF4444" name="Critical" />
            <Area type="monotone" dataKey="high" stackId="1" stroke="#F97316" fill="#F97316" name="High" />
            <Area type="monotone" dataKey="medium" stackId="1" stroke="#F59E0B" fill="#F59E0B" name="Medium" />
            <Area type="monotone" dataKey="low" stackId="1" stroke="#10B981" fill="#10B981" name="Low" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Top Supplier Risks */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Supplier Risk Assessment</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Supplier</th>
                <th className="text-left py-2">Risk Score</th>
                <th className="text-left py-2">Category</th>
                <th className="text-left py-2">Trend</th>
                <th className="text-left py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {supplierRiskScores.map((supplier, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="py-2">{supplier.supplier}</td>
                  <td className="py-2">
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            supplier.riskScore >= 70 ? 'bg-red-500' :
                            supplier.riskScore >= 50 ? 'bg-yellow-500' :
                            'bg-green-500'
                          }`}
                          style={{ width: `${supplier.riskScore}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">{supplier.riskScore}</span>
                    </div>
                  </td>
                  <td className="py-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      supplier.category === 'High' ? 'bg-red-100 text-red-800' :
                      supplier.category === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {supplier.category}
                    </span>
                  </td>
                  <td className="py-2">
                    <span className="flex items-center gap-1">
                      {supplier.trend === 'increasing' ? (
                        <TrendingUp className="h-4 w-4 text-red-500" />
                      ) : supplier.trend === 'decreasing' ? (
                        <TrendingDown className="h-4 w-4 text-green-500" />
                      ) : (
                        <TrendingFlat className="h-4 w-4 text-gray-500" />
                      )}
                      <span className="text-sm">{supplier.trend}</span>
                    </span>
                  </td>
                  <td className="py-2">
                    <button className="text-blue-600 hover:text-blue-800">Assess</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderRiskRegister = () => (
    <div className="space-y-6">
      {/* Risk Register Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Risk Register</h3>
        <div className="flex gap-2">
          <select
            className="px-3 py-2 border rounded-lg"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            <option value="supply_chain">Supply Chain</option>
            <option value="financial">Financial</option>
            <option value="operational">Operational</option>
            <option value="compliance">Compliance</option>
            <option value="geopolitical">Geopolitical</option>
          </select>
          <div className="flex items-center border rounded-lg px-3 py-2">
            <Search className="h-4 w-4 text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search risks..."
              className="outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Risk
          </button>
        </div>
      </div>

      {/* Risk Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {riskRegister.map((risk) => (
          <div key={risk.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-lg">{risk.title}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    risk.status === 'active' ? 'bg-red-100 text-red-800' :
                    risk.status === 'monitoring' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {risk.status.toUpperCase()}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mt-1">{risk.id} - {risk.category}</p>
              </div>
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold ${getRiskColor(risk.riskScore)}`}>
                {risk.riskScore}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-600">Probability</p>
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <div
                        key={level}
                        className={`w-6 h-6 rounded ${
                          level <= risk.probability ? 'bg-orange-500' : 'bg-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium">{risk.probability}/5</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600">Impact</p>
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <div
                        key={level}
                        className={`w-6 h-6 rounded ${
                          level <= risk.impact ? 'bg-red-500' : 'bg-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium">{risk.impact}/5</span>
                </div>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Supplier:</span>
                <span className="font-medium">{risk.supplier}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Risk Owner:</span>
                <span className="font-medium">{risk.owner}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Residual Risk:</span>
                <span className={`font-medium ${
                  risk.residualRisk >= 15 ? 'text-red-600' :
                  risk.residualRisk >= 10 ? 'text-yellow-600' :
                  'text-green-600'
                }`}>
                  {risk.residualRisk} ({getRiskLevel(risk.residualRisk)})
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Last Review:</span>
                <span>{risk.lastReview}</span>
              </div>
            </div>

            <div className="border-t pt-4">
              <p className="text-sm font-medium mb-2">Mitigation Strategy:</p>
              <p className="text-sm text-gray-600">{risk.mitigation}</p>
            </div>

            <div className="flex gap-2 mt-4">
              <button className="flex-1 bg-blue-500 text-white py-2 rounded hover:bg-blue-600 text-sm">
                Review
              </button>
              <button className="flex-1 border border-gray-300 py-2 rounded hover:bg-gray-50 text-sm">
                Update
              </button>
              <button className="px-3 py-2 border border-gray-300 rounded hover:bg-gray-50">
                <Eye className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderRiskMatrix = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Risk Heat Map</h3>

        {/* Matrix Grid */}
        <div className="flex">
          {/* Y-axis label */}
          <div className="flex items-center justify-center mr-4">
            <div className="transform -rotate-90 whitespace-nowrap">
              <span className="text-sm font-medium text-gray-600">Probability →</span>
            </div>
          </div>

          {/* Matrix */}
          <div className="flex-1">
            <div className="grid grid-cols-5 gap-1">
              {[5, 4, 3, 2, 1].map((probability) => (
                [1, 2, 3, 4, 5].map((impact) => {
                  const cell = riskMatrix.find(r => r.probability === probability && r.impact === impact);
                  const riskScore = probability * impact;
                  const bgColor = riskScore >= 15 ? 'bg-red-500' :
                                 riskScore >= 10 ? 'bg-orange-500' :
                                 riskScore >= 5 ? 'bg-yellow-500' :
                                 'bg-green-500';

                  return (
                    <div
                      key={`${probability}-${impact}`}
                      className={`${bgColor} bg-opacity-70 rounded p-4 min-h-[80px] flex flex-col items-center justify-center hover:bg-opacity-100 transition-all cursor-pointer`}
                    >
                      <span className="text-white font-bold text-lg">{riskScore}</span>
                      {cell && cell.count > 0 && (
                        <span className="text-white text-xs mt-1">{cell.count} risks</span>
                      )}
                    </div>
                  );
                })
              ))}
            </div>

            {/* X-axis label */}
            <div className="mt-4 text-center">
              <span className="text-sm font-medium text-gray-600">Impact →</span>
            </div>

            {/* Axis values */}
            <div className="flex justify-around mt-2">
              {[1, 2, 3, 4, 5].map((val) => (
                <span key={val} className="text-xs text-gray-500">{val}</span>
              ))}
            </div>
          </div>

          {/* Y-axis values */}
          <div className="ml-2 flex flex-col justify-around">
            {[5, 4, 3, 2, 1].map((val) => (
              <span key={val} className="text-xs text-gray-500">{val}</span>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex justify-center gap-4 mt-6">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded" />
            <span className="text-sm">Critical (15-25)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-orange-500 rounded" />
            <span className="text-sm">High (10-14)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-500 rounded" />
            <span className="text-sm">Medium (5-9)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded" />
            <span className="text-sm">Low (1-4)</span>
          </div>
        </div>
      </div>

      {/* Risk Assessment Criteria */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h4 className="font-semibold mb-4">Probability Criteria</h4>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <span className="font-bold text-red-500">5</span>
              <div>
                <p className="font-medium">Almost Certain (>90%)</p>
                <p className="text-sm text-gray-600">Expected to occur in most circumstances</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="font-bold text-orange-500">4</span>
              <div>
                <p className="font-medium">Likely (70-90%)</p>
                <p className="text-sm text-gray-600">Will probably occur in most circumstances</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="font-bold text-yellow-500">3</span>
              <div>
                <p className="font-medium">Possible (30-70%)</p>
                <p className="text-sm text-gray-600">Might occur at some time</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="font-bold text-green-500">2</span>
              <div>
                <p className="font-medium">Unlikely (10-30%)</p>
                <p className="text-sm text-gray-600">Could occur at some time</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="font-bold text-blue-500">1</span>
              <div>
                <p className="font-medium">Rare (<10%)</p>
                <p className="text-sm text-gray-600">May occur only in exceptional circumstances</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h4 className="font-semibold mb-4">Impact Criteria</h4>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <span className="font-bold text-red-500">5</span>
              <div>
                <p className="font-medium">Catastrophic</p>
                <p className="text-sm text-gray-600">Major disruption, >$1M loss, regulatory breach</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="font-bold text-orange-500">4</span>
              <div>
                <p className="font-medium">Major</p>
                <p className="text-sm text-gray-600">Significant disruption, $500K-$1M loss</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="font-bold text-yellow-500">3</span>
              <div>
                <p className="font-medium">Moderate</p>
                <p className="text-sm text-gray-600">Some disruption, $100K-$500K loss</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="font-bold text-green-500">2</span>
              <div>
                <p className="font-medium">Minor</p>
                <p className="text-sm text-gray-600">Minor disruption, $10K-$100K loss</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="font-bold text-blue-500">1</span>
              <div>
                <p className="font-medium">Insignificant</p>
                <p className="text-sm text-gray-600">Minimal impact, <$10K loss</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMitigation = () => (
    <div className="space-y-6">
      {/* Mitigation Strategies */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Active Mitigation Strategies</h3>
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Strategy
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {mitigationStrategies.map((strategy) => (
            <div key={strategy.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <Shield className="h-8 w-8 text-blue-500" />
                <span className={`px-2 py-1 rounded-full text-xs ${
                  strategy.status === 'completed' ? 'bg-green-100 text-green-800' :
                  strategy.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {strategy.status.replace('_', ' ').toUpperCase()}
                </span>
              </div>

              <h4 className="font-semibold mb-2">{strategy.strategy}</h4>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Risks Covered:</span>
                  <span className="font-medium">{strategy.risksCovered}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Effectiveness:</span>
                  <div className="flex items-center gap-2">
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${strategy.effectiveness}%` }}
                      />
                    </div>
                    <span className="font-medium">{strategy.effectiveness}%</span>
                  </div>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Cost:</span>
                  <span className="font-medium">${strategy.cost.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Timeline:</span>
                  <span>{strategy.timeline}</span>
                </div>
              </div>

              <button className="w-full bg-gray-100 text-gray-700 py-2 rounded hover:bg-gray-200 text-sm">
                View Details
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Mitigation Timeline */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Mitigation Timeline</h3>
        <div className="relative">
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-300" />

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold">Inventory Buffer Stock Implementation</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Successfully implemented safety stock levels for critical components
                    </p>
                  </div>
                  <span className="text-sm text-gray-500">Completed - Dec 1, 2024</span>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <Clock className="h-8 w-8 text-blue-600" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold">Supplier Diversification Program</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Identifying and qualifying alternative suppliers for single-source items
                    </p>
                  </div>
                  <span className="text-sm text-gray-500">In Progress - 60% Complete</span>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                <Calendar className="h-8 w-8 text-gray-600" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold">Contract Renegotiation Initiative</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Updating contract terms to include risk-sharing provisions
                    </p>
                  </div>
                  <span className="text-sm text-gray-500">Planned - Q2 2025</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cost-Benefit Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h4 className="font-semibold mb-4">Mitigation Cost Analysis</h4>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={[
              { strategy: 'Diversification', cost: 50000, benefit: 180000 },
              { strategy: 'Buffer Stock', cost: 75000, benefit: 120000 },
              { strategy: 'Contracts', cost: 15000, benefit: 85000 },
              { strategy: 'Insurance', cost: 30000, benefit: 150000 },
              { strategy: 'Training', cost: 20000, benefit: 65000 }
            ]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="strategy" angle={-45} textAnchor="end" height={70} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="cost" fill="#EF4444" name="Cost ($)" />
              <Bar dataKey="benefit" fill="#10B981" name="Benefit ($)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h4 className="font-semibold mb-4">Risk Reduction Impact</h4>
          <ResponsiveContainer width="100%" height={250}>
            <RadarChart data={[
              { category: 'Supply Chain', before: 85, after: 45 },
              { category: 'Financial', before: 70, after: 40 },
              { category: 'Operational', before: 60, after: 35 },
              { category: 'Compliance', before: 45, after: 25 },
              { category: 'Geopolitical', before: 75, after: 50 }
            ]}>
              <PolarGrid />
              <PolarAngleAxis dataKey="category" />
              <PolarRadiusAxis angle={90} domain={[0, 100]} />
              <Radar name="Before Mitigation" dataKey="before" stroke="#EF4444" fill="#EF4444" fillOpacity={0.3} />
              <Radar name="After Mitigation" dataKey="after" stroke="#10B981" fill="#10B981" fillOpacity={0.3} />
              <Legend />
            </Radar>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  const renderMonitoring = () => (
    <div className="space-y-6">
      {/* Real-time Risk Alerts */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Real-time Risk Alerts</h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
            <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-red-900">Critical: Port Strike Imminent</p>
                  <p className="text-sm text-red-700 mt-1">
                    West Coast ports may face labor strikes starting next week. 3 suppliers affected.
                  </p>
                </div>
                <span className="text-xs text-red-600">2 hours ago</span>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-yellow-900">Warning: Currency Fluctuation</p>
                  <p className="text-sm text-yellow-700 mt-1">
                    USD/EUR exchange rate changed by 3.2% in last 24 hours.
                  </p>
                </div>
                <span className="text-xs text-yellow-600">5 hours ago</span>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <Activity className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-blue-900">Info: Supplier Credit Rating Change</p>
                  <p className="text-sm text-blue-700 mt-1">
                    Metal Works Inc credit rating upgraded from BB to BBB.
                  </p>
                </div>
                <span className="text-xs text-blue-600">1 day ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Risk Monitoring Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h4 className="font-semibold mb-4">Supply Chain Monitoring</h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">Lead Time Variance</span>
              <span className="text-sm font-medium text-yellow-600">+2.3 days</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">On-Time Delivery</span>
              <span className="text-sm font-medium text-green-600">94.2%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Stock-Out Risk</span>
              <span className="text-sm font-medium text-red-600">High (3 items)</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Supplier Reliability</span>
              <span className="text-sm font-medium text-green-600">96.8%</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h4 className="font-semibold mb-4">Financial Monitoring</h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">Price Volatility</span>
              <span className="text-sm font-medium text-yellow-600">Medium</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Budget Variance</span>
              <span className="text-sm font-medium text-green-600">-2.1%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Payment Risk</span>
              <span className="text-sm font-medium text-green-600">Low</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Currency Exposure</span>
              <span className="text-sm font-medium text-yellow-600">$1.2M</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h4 className="font-semibold mb-4">Compliance Monitoring</h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">Regulatory Changes</span>
              <span className="text-sm font-medium text-yellow-600">2 pending</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Audit Findings</span>
              <span className="text-sm font-medium text-green-600">0 critical</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Certificate Expiry</span>
              <span className="text-sm font-medium text-yellow-600">3 in 30 days</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Policy Compliance</span>
              <span className="text-sm font-medium text-green-600">98.5%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Key Risk Indicators */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Key Risk Indicators (KRIs)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Supplier Concentration</span>
              <Gauge className="h-4 w-4 text-gray-400" />
            </div>
            <div className="text-2xl font-bold mb-1">32%</div>
            <div className="flex items-center gap-1">
              <TrendingUp className="h-4 w-4 text-red-500" />
              <span className="text-xs text-red-600">Above threshold</span>
            </div>
          </div>

          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Quality Defect Rate</span>
              <Activity className="h-4 w-4 text-gray-400" />
            </div>
            <div className="text-2xl font-bold mb-1">2.1%</div>
            <div className="flex items-center gap-1">
              <TrendingDown className="h-4 w-4 text-green-500" />
              <span className="text-xs text-green-600">Within limits</span>
            </div>
          </div>

          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Contract Compliance</span>
              <FileText className="h-4 w-4 text-gray-400" />
            </div>
            <div className="text-2xl font-bold mb-1">94.8%</div>
            <div className="flex items-center gap-1">
              <TrendingFlat className="h-4 w-4 text-gray-500" />
              <span className="text-xs text-gray-600">Stable</span>
            </div>
          </div>

          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Spend Under Mgmt</span>
              <DollarSign className="h-4 w-4 text-gray-400" />
            </div>
            <div className="text-2xl font-bold mb-1">87.3%</div>
            <div className="flex items-center gap-1">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-xs text-green-600">Improving</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const Plus = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  );

  const Calendar = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );

  const TrendingFlat = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
    </svg>
  );

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Procurement Risk Management</h2>
        <p className="text-gray-600">Identify, assess, and mitigate procurement risks</p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-1 mb-6 border-b">
        {['overview', 'risk-register', 'risk-matrix', 'mitigation', 'monitoring'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-medium capitalize transition-colors ${
              activeTab === tab
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            {tab.replace('-', ' ')}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && renderOverview()}
      {activeTab === 'risk-register' && renderRiskRegister()}
      {activeTab === 'risk-matrix' && renderRiskMatrix()}
      {activeTab === 'mitigation' && renderMitigation()}
      {activeTab === 'monitoring' && renderMonitoring()}
    </div>
  );
};

export default ProcurementRiskManagement;
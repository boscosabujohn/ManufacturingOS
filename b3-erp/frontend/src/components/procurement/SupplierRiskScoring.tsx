'use client';

import React from 'react';
import { Shield, AlertTriangle, TrendingUp, Award, AlertCircle, RefreshCw, Download, Settings, Eye, FileText, CheckCircle, Activity } from 'lucide-react';

export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

export interface SupplierRisk {
  id: string;
  supplierName: string;
  code: string;
  overallRiskScore: number;
  riskLevel: RiskLevel;
  financialRisk: number;
  operationalRisk: number;
  complianceRisk: number;
  geopoliticalRisk: number;
  cyberSecurityRisk: number;
  totalSpend: number;
  spendAtRisk: number;
  lastAssessment: string;
  nextReview: string;
  mitigationActions: number;
}

export interface RiskFactor {
  category: string;
  weight: number;
  score: number;
  status: 'good' | 'acceptable' | 'concerning' | 'critical';
  factors: string[];
}

const SupplierRiskScoring: React.FC = () => {
  // Mock data - Supplier risk profiles
  const suppliers: SupplierRisk[] = [
    {
      id: 'RISK001',
      supplierName: 'Acme Manufacturing Co.',
      code: 'ACM-001',
      overallRiskScore: 25,
      riskLevel: 'low',
      financialRisk: 20,
      operationalRisk: 25,
      complianceRisk: 15,
      geopoliticalRisk: 35,
      cyberSecurityRisk: 30,
      totalSpend: 2450000,
      spendAtRisk: 612500,
      lastAssessment: '2025-09-15',
      nextReview: '2025-12-15',
      mitigationActions: 2,
    },
    {
      id: 'RISK002',
      supplierName: 'Global Components Ltd.',
      code: 'GCL-002',
      overallRiskScore: 55,
      riskLevel: 'medium',
      financialRisk: 60,
      operationalRisk: 50,
      complianceRisk: 45,
      geopoliticalRisk: 70,
      cyberSecurityRisk: 50,
      totalSpend: 1850000,
      spendAtRisk: 1017500,
      lastAssessment: '2025-08-20',
      nextReview: '2025-11-20',
      mitigationActions: 5,
    },
    {
      id: 'RISK003',
      supplierName: 'Quality Steel Industries',
      code: 'QSI-003',
      overallRiskScore: 18,
      riskLevel: 'low',
      financialRisk: 15,
      operationalRisk: 20,
      complianceRisk: 10,
      geopoliticalRisk: 25,
      cyberSecurityRisk: 20,
      totalSpend: 3200000,
      spendAtRisk: 576000,
      lastAssessment: '2025-10-01',
      nextReview: '2026-01-01',
      mitigationActions: 1,
    },
    {
      id: 'RISK004',
      supplierName: 'Tech Solutions Inc.',
      code: 'TSI-004',
      overallRiskScore: 72,
      riskLevel: 'high',
      financialRisk: 85,
      operationalRisk: 65,
      complianceRisk: 60,
      geopoliticalRisk: 70,
      cyberSecurityRisk: 80,
      totalSpend: 980000,
      spendAtRisk: 705600,
      lastAssessment: '2025-10-10',
      nextReview: '2025-10-30',
      mitigationActions: 8,
    },
    {
      id: 'RISK005',
      supplierName: 'Precision Parts Manufacturing',
      code: 'PPM-005',
      overallRiskScore: 38,
      riskLevel: 'medium',
      financialRisk: 40,
      operationalRisk: 35,
      complianceRisk: 30,
      geopoliticalRisk: 45,
      cyberSecurityRisk: 40,
      totalSpend: 1650000,
      spendAtRisk: 627000,
      lastAssessment: '2025-09-01',
      nextReview: '2025-12-01',
      mitigationActions: 3,
    },
    {
      id: 'RISK006',
      supplierName: 'Eco Packaging Solutions',
      code: 'EPS-006',
      overallRiskScore: 88,
      riskLevel: 'critical',
      financialRisk: 95,
      operationalRisk: 85,
      complianceRisk: 80,
      geopoliticalRisk: 90,
      cyberSecurityRisk: 90,
      totalSpend: 450000,
      spendAtRisk: 396000,
      lastAssessment: '2025-10-15',
      nextReview: '2025-10-25',
      mitigationActions: 12,
    },
  ];

  // Mock data - Risk factors breakdown
  const riskFactors: RiskFactor[] = [
    {
      category: 'Financial Risk',
      weight: 25,
      score: 60,
      status: 'concerning',
      factors: [
        'Credit rating downgrade to B+',
        'Debt-to-equity ratio at 2.5:1',
        'Late payment history (3 instances YTD)',
        'Revenue decline of 12% YoY',
      ],
    },
    {
      category: 'Operational Risk',
      weight: 25,
      score: 50,
      status: 'acceptable',
      factors: [
        'Single source for critical components',
        'Manufacturing capacity at 95% utilization',
        'Quality issues in last 6 months (2 batches)',
        'Average lead time increased by 15%',
      ],
    },
    {
      category: 'Compliance Risk',
      weight: 20,
      score: 45,
      status: 'acceptable',
      factors: [
        'ISO 9001 certification expiring in 45 days',
        'Pending environmental audit',
        'One minor regulatory violation (resolved)',
        'Worker safety record acceptable',
      ],
    },
    {
      category: 'Geopolitical Risk',
      weight: 15,
      score: 70,
      status: 'concerning',
      factors: [
        'Operations in politically unstable region',
        'Exposure to trade tariffs (15%)',
        'Currency volatility (±10% in Q3)',
        'Supply chain disruptions from regional conflicts',
      ],
    },
    {
      category: 'Cybersecurity Risk',
      weight: 15,
      score: 50,
      status: 'acceptable',
      factors: [
        'SOC 2 Type II certified',
        'One data breach incident (2 years ago)',
        'Regular security audits conducted',
        'Limited EDI/API integration security',
      ],
    },
  ];

  const getRiskLevelColor = (level: RiskLevel): string => {
    switch (level) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskStatusColor = (status: string): string => {
    switch (status) {
      case 'good': return 'bg-green-100 text-green-800';
      case 'acceptable': return 'bg-yellow-100 text-yellow-800';
      case 'concerning': return 'bg-orange-100 text-orange-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskScoreColor = (score: number): string => {
    if (score <= 30) return 'text-green-600';
    if (score <= 60) return 'text-yellow-600';
    if (score <= 80) return 'text-orange-600';
    return 'text-red-600';
  };

  // Handler functions

  // Handler functions (simplified)
  const handleAssessRisk = (supplier: SupplierRisk) => {
    console.log('Assessing risk for supplier:', supplier.id);
    alert(`Risk Assessment: ${supplier.supplierName} - Overall Score: ${supplier.overallRiskScore}, Level: ${supplier.riskLevel.toUpperCase()}`);
  };

  const handleUpdateRiskScore = (supplier: SupplierRisk) => {
    console.log('Updating risk score for:', supplier.id);
    alert(`Update Risk Score: ${supplier.supplierName} - This would open a form to update risk scores and categories.`);
  };

  const handleViewRiskFactors = (supplier: SupplierRisk) => {
    console.log('Viewing risk factors for:', supplier.id);
    alert(`View Risk Factors: ${supplier.supplierName} - This would display detailed risk breakdown by category.`);
  };

  const handleExportRiskReport = () => {
    console.log('Exporting risk report...');
    alert('Export Risk Report - This would generate a comprehensive risk assessment report in PDF/Excel format.');
  };

  const handleRefresh = () => {
    console.log('Refreshing risk data...');
    alert('Refreshing Risk Data - Syncing with external risk databases and updating scores.');
  };

  const handleSettings = () => {
    console.log('Opening risk settings...');
    alert('Risk Scoring Settings - Configure risk weights, thresholds, scoring methodology, and alert settings.');
  };

  const handleViewSupplierProfile = (supplier: SupplierRisk) => {
    console.log('Viewing supplier profile:', supplier.id);
    alert(`Supplier Profile: ${supplier.supplierName} - This would display comprehensive supplier information and history.`);
  };

  const handleGenerateRiskMatrix = () => {
    console.log('Generating risk matrix...');
    alert('Generate Risk Matrix - This would create a visual risk matrix showing all suppliers by impact and likelihood.');
  };

  const handleScheduleReview = (supplier: SupplierRisk) => {
    console.log('Scheduling review for:', supplier.id);
    alert(`Schedule Review: ${supplier.supplierName} - Next review: ${supplier.nextReview}. This would open a scheduling dialog.`);
  };

  const handleCompareSuppliers = () => {
    console.log('Comparing suppliers...');
    alert('Compare Suppliers - This would open a side-by-side comparison of selected suppliers risk profiles.');
  };

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-3 rounded-lg shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Shield className="h-8 w-8" />
            <div>
              <h2 className="text-2xl font-bold">Supplier Risk Scoring</h2>
              <p className="text-blue-100">Risk assessment, monitoring, and mitigation tracking</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handleGenerateRiskMatrix}
              className="flex items-center space-x-2 px-4 py-2 bg-white text-purple-600 rounded-lg hover:bg-gray-100 transition-colors"
              title="Generate Risk Matrix"
            >
              <Activity className="h-4 w-4" />
              <span>Risk Matrix</span>
            </button>
            <button
              onClick={handleCompareSuppliers}
              className="flex items-center space-x-2 px-4 py-2 bg-white text-purple-600 rounded-lg hover:bg-gray-100 transition-colors"
              title="Compare Suppliers"
            >
              <FileText className="h-4 w-4" />
              <span>Compare</span>
            </button>
            <button
              onClick={handleExportRiskReport}
              className="flex items-center space-x-2 px-4 py-2 bg-white text-purple-600 rounded-lg hover:bg-gray-100 transition-colors"
              title="Export Report"
            >
              <Download className="h-4 w-4" />
              <span>Export</span>
            </button>
            <button
              onClick={handleRefresh}
              className="flex items-center space-x-2 px-4 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-800 transition-colors"
              title="Refresh Data"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Refresh</span>
            </button>
            <button
              onClick={handleSettings}
              className="flex items-center space-x-2 px-4 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-800 transition-colors"
              title="Risk Scoring Settings"
            >
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
        <div className="bg-white p-3 rounded-lg shadow border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Low Risk</p>
              <p className="text-2xl font-bold text-gray-900">
                {suppliers.filter(s => s.riskLevel === 'low').length}
              </p>
            </div>
            <Shield className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white p-3 rounded-lg shadow border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Medium Risk</p>
              <p className="text-2xl font-bold text-gray-900">
                {suppliers.filter(s => s.riskLevel === 'medium').length}
              </p>
            </div>
            <AlertCircle className="h-8 w-8 text-yellow-500" />
          </div>
        </div>

        <div className="bg-white p-3 rounded-lg shadow border-l-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">High Risk</p>
              <p className="text-2xl font-bold text-gray-900">
                {suppliers.filter(s => s.riskLevel === 'high').length}
              </p>
            </div>
            <AlertTriangle className="h-8 w-8 text-orange-500" />
          </div>
        </div>

        <div className="bg-white p-3 rounded-lg shadow border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Critical Risk</p>
              <p className="text-2xl font-bold text-gray-900">
                {suppliers.filter(s => s.riskLevel === 'critical').length}
              </p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-500" />
          </div>
        </div>

        <div className="bg-white p-3 rounded-lg shadow border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Spend at Risk</p>
              <p className="text-2xl font-bold text-gray-900">
                ${(suppliers.reduce((sum, s) => sum + s.spendAtRisk, 0) / 1000000).toFixed(1)}M
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Supplier Risk Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-3 py-2 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Supplier Risk Profiles</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider">Supplier</th>
                <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider">Overall Score</th>
                <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider">Risk Level</th>
                <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider">Financial</th>
                <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider">Operational</th>
                <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider">Compliance</th>
                <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider">Geopolitical</th>
                <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider">Cyber</th>
                <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider">Total Spend</th>
                <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider">Spend at Risk</th>
                <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider">Mitigations</th>
                <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {suppliers.map((supplier) => (
                <tr key={supplier.id} className="hover:bg-gray-50">
                  <td className="px-3 py-2 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{supplier.supplierName}</div>
                      <div className="text-xs text-gray-500">{supplier.code}</div>
                    </div>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                        <div
                          className={`h-2 rounded-full ${
                            supplier.overallRiskScore <= 30 ? 'bg-green-500' :
                            supplier.overallRiskScore <= 60 ? 'bg-yellow-500' :
                            supplier.overallRiskScore <= 80 ? 'bg-orange-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${supplier.overallRiskScore}%` }}
                        ></div>
                      </div>
                      <span className={`text-sm font-bold ${getRiskScoreColor(supplier.overallRiskScore)}`}>
                        {supplier.overallRiskScore}
                      </span>
                    </div>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getRiskLevelColor(supplier.riskLevel)}`}>
                      {supplier.riskLevel}
                    </span>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <span className={`text-sm ${getRiskScoreColor(supplier.financialRisk)}`}>{supplier.financialRisk}</span>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <span className={`text-sm ${getRiskScoreColor(supplier.operationalRisk)}`}>{supplier.operationalRisk}</span>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <span className={`text-sm ${getRiskScoreColor(supplier.complianceRisk)}`}>{supplier.complianceRisk}</span>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <span className={`text-sm ${getRiskScoreColor(supplier.geopoliticalRisk)}`}>{supplier.geopoliticalRisk}</span>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <span className={`text-sm ${getRiskScoreColor(supplier.cyberSecurityRisk)}`}>{supplier.cyberSecurityRisk}</span>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                    ${(supplier.totalSpend / 1000000).toFixed(2)}M
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-red-600">
                    ${(supplier.spendAtRisk / 1000000).toFixed(2)}M
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-semibold rounded bg-blue-100 text-blue-800">
                      {supplier.mitigationActions} actions
                    </span>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => handleAssessRisk(supplier)}
                        className="inline-flex items-center gap-1.5 px-3 py-2 border border-blue-300 bg-blue-50 rounded-lg hover:bg-blue-100 text-sm transition-colors"
                        title="Assess Risk"
                      >
                        <CheckCircle className="w-4 h-4 text-blue-600" />
                        <span className="text-blue-700">Assess</span>
                      </button>
                      <button
                        onClick={() => handleUpdateRiskScore(supplier)}
                        className="inline-flex items-center gap-1.5 px-3 py-2 border border-purple-300 bg-purple-50 rounded-lg hover:bg-purple-100 text-sm transition-colors"
                        title="Update Risk Score"
                      >
                        <RefreshCw className="w-4 h-4 text-purple-600" />
                        <span className="text-purple-700">Update</span>
                      </button>
                      <button
                        onClick={() => handleViewRiskFactors(supplier)}
                        className="inline-flex items-center gap-1.5 px-3 py-2 border border-green-300 bg-green-50 rounded-lg hover:bg-green-100 text-sm transition-colors"
                        title="View Risk Factors"
                      >
                        <Eye className="w-4 h-4 text-green-600" />
                        <span className="text-green-700">Factors</span>
                      </button>
                      <button
                        onClick={() => handleExportRiskReport()}
                        className="inline-flex items-center gap-1.5 px-3 py-2 border border-indigo-300 bg-indigo-50 rounded-lg hover:bg-indigo-100 text-sm transition-colors"
                        title="Export Risk Report"
                      >
                        <Download className="w-4 h-4 text-indigo-600" />
                        <span className="text-indigo-700">Export</span>
                      </button>
                      <button
                        onClick={() => handleScheduleReview(supplier)}
                        className="inline-flex items-center gap-1.5 px-3 py-2 border border-orange-300 bg-orange-50 rounded-lg hover:bg-orange-100 text-sm transition-colors"
                        title="Schedule Review"
                      >
                        <Activity className="w-4 h-4 text-orange-600" />
                        <span className="text-orange-700">Review</span>
                      </button>
                      <button
                        onClick={() => handleViewSupplierProfile(supplier)}
                        className="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-300 bg-gray-50 rounded-lg hover:bg-gray-100 text-sm transition-colors"
                        title="View Profile"
                      >
                        <FileText className="w-4 h-4 text-gray-600" />
                        <span className="text-gray-700">Profile</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Risk Factors Breakdown */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-3 py-2 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Risk Factors Analysis</h3>
          <p className="text-sm text-gray-600 mt-1">Example: Global Components Ltd. (GCL-002)</p>
        </div>
        <div className="p-6 space-y-3">
          {riskFactors.map((factor, idx) => (
            <div key={idx} className="border-b pb-6 last:border-b-0 last:pb-0">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <Award className="h-5 w-5 text-purple-600" />
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900">{factor.category}</h4>
                    <p className="text-xs text-gray-500">Weight: {factor.weight}%</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getRiskStatusColor(factor.status)}`}>
                    {factor.status}
                  </span>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">Score</div>
                    <div className={`text-2xl font-bold ${getRiskScoreColor(factor.score)}`}>{factor.score}</div>
                  </div>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div
                  className={`h-2 rounded-full ${
                    factor.score <= 30 ? 'bg-green-500' :
                    factor.score <= 60 ? 'bg-yellow-500' :
                    factor.score <= 80 ? 'bg-orange-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${factor.score}%` }}
                ></div>
              </div>
              <div className="space-y-2">
                {factor.factors.map((item, itemIdx) => (
                  <div key={itemIdx} className="flex items-start space-x-2 text-sm text-gray-700">
                    <AlertCircle className="h-4 w-4 mt-0.5 text-gray-400 flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Risk Distribution Chart (Text-based) */}
      <div className="bg-white rounded-lg shadow p-3">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Risk Distribution by Category</h3>
        <div className="space-y-3">
          {[
            { name: 'Low Risk (0-30)', count: suppliers.filter(s => s.overallRiskScore <= 30).length, color: 'bg-green-500' },
            { name: 'Medium Risk (31-60)', count: suppliers.filter(s => s.overallRiskScore > 30 && s.overallRiskScore <= 60).length, color: 'bg-yellow-500' },
            { name: 'High Risk (61-80)', count: suppliers.filter(s => s.overallRiskScore > 60 && s.overallRiskScore <= 80).length, color: 'bg-orange-500' },
            { name: 'Critical Risk (81-100)', count: suppliers.filter(s => s.overallRiskScore > 80).length, color: 'bg-red-500' },
          ].map((category, idx) => (
            <div key={idx}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-700">{category.name}</span>
                <span className="text-sm font-semibold text-gray-900">{category.count} suppliers</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`${category.color} h-3 rounded-full`}
                  style={{ width: `${(category.count / suppliers.length) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SupplierRiskScoring;

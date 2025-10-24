'use client';

import React, { useState } from 'react';
import { FileText, AlertTriangle, CheckCircle, TrendingUp, DollarSign, Calendar, Shield } from 'lucide-react';

export type ContractStatus = 'active' | 'expiring' | 'expired' | 'renewed' | 'terminated';
export type ComplianceStatus = 'compliant' | 'at-risk' | 'non-compliant';
export type ContractType = 'master-agreement' | 'purchase-agreement' | 'blanket-po' | 'service-contract' | 'nda';

export interface Contract {
  id: string;
  contractNumber: string;
  supplier: string;
  contractType: ContractType;
  status: ContractStatus;
  complianceStatus: ComplianceStatus;
  startDate: string;
  endDate: string;
  value: number;
  spendToDate: number;
  utilizationPercent: number;
  autoRenewal: boolean;
  notificationDays: number;
  owner: string;
  lastAudit: string;
  nextReview: string;
}

export interface ComplianceMetric {
  metric: string;
  target: number;
  actual: number;
  status: 'pass' | 'warning' | 'fail';
  impact: string;
}

export interface ContractObligation {
  id: string;
  contractId: string;
  obligation: string;
  dueDate: string;
  status: 'completed' | 'pending' | 'overdue';
  assignedTo: string;
  priority: 'low' | 'medium' | 'high';
}

const ContractCompliance: React.FC = () => {
  // Mock data - Contracts
  const contracts: Contract[] = [
    {
      id: 'CNT001',
      contractNumber: 'MA-2024-001',
      supplier: 'Acme Manufacturing Co.',
      contractType: 'master-agreement',
      status: 'active',
      complianceStatus: 'compliant',
      startDate: '2024-01-01',
      endDate: '2026-12-31',
      value: 5000000,
      spendToDate: 2450000,
      utilizationPercent: 49,
      autoRenewal: true,
      notificationDays: 90,
      owner: 'Sarah Johnson',
      lastAudit: '2025-07-15',
      nextReview: '2025-11-15',
    },
    {
      id: 'CNT002',
      contractNumber: 'PA-2023-045',
      supplier: 'Global Components Ltd.',
      contractType: 'purchase-agreement',
      status: 'expiring',
      complianceStatus: 'at-risk',
      startDate: '2023-06-01',
      endDate: '2025-11-30',
      value: 2500000,
      spendToDate: 2380000,
      utilizationPercent: 95.2,
      autoRenewal: false,
      notificationDays: 60,
      owner: 'Michael Chen',
      lastAudit: '2025-05-20',
      nextReview: '2025-10-30',
    },
    {
      id: 'CNT003',
      contractNumber: 'BPO-2024-012',
      supplier: 'Quality Steel Industries',
      contractType: 'blanket-po',
      status: 'active',
      complianceStatus: 'compliant',
      startDate: '2024-03-01',
      endDate: '2025-12-31',
      value: 3000000,
      spendToDate: 1850000,
      utilizationPercent: 61.7,
      autoRenewal: true,
      notificationDays: 90,
      owner: 'Emily Davis',
      lastAudit: '2025-08-10',
      nextReview: '2025-11-30',
    },
    {
      id: 'CNT004',
      contractNumber: 'SC-2022-089',
      supplier: 'Tech Solutions Inc.',
      contractType: 'service-contract',
      status: 'expired',
      complianceStatus: 'non-compliant',
      startDate: '2022-01-01',
      endDate: '2025-10-15',
      value: 1200000,
      spendToDate: 1180000,
      utilizationPercent: 98.3,
      autoRenewal: false,
      notificationDays: 60,
      owner: 'Robert Wilson',
      lastAudit: '2025-04-15',
      nextReview: '2025-10-01',
    },
    {
      id: 'CNT005',
      contractNumber: 'MA-2025-003',
      supplier: 'Precision Parts Manufacturing',
      contractType: 'master-agreement',
      status: 'active',
      complianceStatus: 'compliant',
      startDate: '2025-01-01',
      endDate: '2027-12-31',
      value: 4500000,
      spendToDate: 1320000,
      utilizationPercent: 29.3,
      autoRenewal: true,
      notificationDays: 120,
      owner: 'Lisa Anderson',
      lastAudit: '2025-09-01',
      nextReview: '2026-01-15',
    },
  ];

  // Mock data - Compliance metrics
  const complianceMetrics: ComplianceMetric[] = [
    { metric: 'On-time Delivery', target: 95, actual: 96.5, status: 'pass', impact: 'Low' },
    { metric: 'Quality Acceptance Rate', target: 98, actual: 97.2, status: 'warning', impact: 'Medium' },
    { metric: 'Price Variance', target: 2, actual: 1.5, status: 'pass', impact: 'Low' },
    { metric: 'Invoice Accuracy', target: 99, actual: 98.8, status: 'warning', impact: 'Low' },
    { metric: 'SLA Response Time (hrs)', target: 24, actual: 28, status: 'fail', impact: 'High' },
    { metric: 'Contract Spend vs Budget', target: 100, actual: 103.5, status: 'fail', impact: 'High' },
  ];

  // Mock data - Contract obligations
  const obligations: ContractObligation[] = [
    {
      id: 'OBL001',
      contractId: 'CNT001',
      obligation: 'Quarterly Business Review Meeting',
      dueDate: '2025-10-31',
      status: 'pending',
      assignedTo: 'Sarah Johnson',
      priority: 'medium',
    },
    {
      id: 'OBL002',
      contractId: 'CNT002',
      obligation: 'Annual Performance Audit',
      dueDate: '2025-10-15',
      status: 'overdue',
      assignedTo: 'Michael Chen',
      priority: 'high',
    },
    {
      id: 'OBL003',
      contractId: 'CNT003',
      obligation: 'Price Review and Adjustment',
      dueDate: '2025-11-15',
      status: 'pending',
      assignedTo: 'Emily Davis',
      priority: 'high',
    },
    {
      id: 'OBL004',
      contractId: 'CNT001',
      obligation: 'Insurance Certificate Renewal',
      dueDate: '2025-09-30',
      status: 'completed',
      assignedTo: 'Sarah Johnson',
      priority: 'medium',
    },
    {
      id: 'OBL005',
      contractId: 'CNT005',
      obligation: 'Compliance Documentation Update',
      dueDate: '2025-12-01',
      status: 'pending',
      assignedTo: 'Lisa Anderson',
      priority: 'low',
    },
  ];

  const getContractStatusColor = (status: ContractStatus): string => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'expiring': return 'bg-yellow-100 text-yellow-800';
      case 'expired': return 'bg-red-100 text-red-800';
      case 'renewed': return 'bg-blue-100 text-blue-800';
      case 'terminated': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getComplianceStatusColor = (status: ComplianceStatus): string => {
    switch (status) {
      case 'compliant': return 'bg-green-100 text-green-800';
      case 'at-risk': return 'bg-yellow-100 text-yellow-800';
      case 'non-compliant': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getMetricStatusColor = (status: string): string => {
    switch (status) {
      case 'pass': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'fail': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getObligationStatusColor = (status: string): string => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-blue-100 text-blue-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string): string => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-lg shadow-lg">
        <div className="flex items-center space-x-3">
          <Shield className="h-8 w-8" />
          <div>
            <h2 className="text-2xl font-bold">Contract Compliance Management</h2>
            <p className="text-blue-100">Monitor contract performance, compliance, and obligations</p>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Contracts</p>
              <p className="text-2xl font-bold text-gray-900">
                {contracts.filter(c => c.status === 'active').length}
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Expiring Soon</p>
              <p className="text-2xl font-bold text-gray-900">
                {contracts.filter(c => c.status === 'expiring').length}
              </p>
            </div>
            <AlertTriangle className="h-8 w-8 text-yellow-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Contract Value</p>
              <p className="text-2xl font-bold text-gray-900">
                ${(contracts.reduce((sum, c) => sum + c.value, 0) / 1000000).toFixed(1)}M
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg. Utilization</p>
              <p className="text-2xl font-bold text-gray-900">
                {(contracts.reduce((sum, c) => sum + c.utilizationPercent, 0) / contracts.length).toFixed(1)}%
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Contracts Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Contract Portfolio</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contract</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supplier</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Compliance</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Period</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Spend to Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Utilization</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Owner</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {contracts.map((contract) => (
                <tr key={contract.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 text-gray-400 mr-2" />
                      <div className="text-sm font-medium text-gray-900">{contract.contractNumber}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{contract.supplier}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{contract.contractType}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getContractStatusColor(contract.status)}`}>
                      {contract.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getComplianceStatusColor(contract.complianceStatus)}`}>
                      {contract.complianceStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>{contract.startDate}</div>
                    <div className="text-xs">to {contract.endDate}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${(contract.value / 1000000).toFixed(2)}M
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${(contract.spendToDate / 1000000).toFixed(2)}M
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div
                          className={`h-2 rounded-full ${
                            contract.utilizationPercent >= 90 ? 'bg-red-500' :
                            contract.utilizationPercent >= 70 ? 'bg-yellow-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${Math.min(contract.utilizationPercent, 100)}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-700">{contract.utilizationPercent}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{contract.owner}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Compliance Metrics */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Compliance Metrics</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Metric</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Target</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actual</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performance</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Impact</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {complianceMetrics.map((metric, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{metric.metric}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{metric.target}%</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{metric.actual}%</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                        <div
                          className={`h-2 rounded-full ${
                            metric.status === 'pass' ? 'bg-green-500' :
                            metric.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${Math.min((metric.actual / metric.target) * 100, 100)}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-700">
                        {((metric.actual / metric.target) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getMetricStatusColor(metric.status)}`}>
                      {metric.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{metric.impact}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Contract Obligations */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Contract Obligations</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Obligation</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contract</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned To</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {obligations.map((obl) => (
                <tr key={obl.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{obl.obligation}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {contracts.find(c => c.id === obl.contractId)?.contractNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                      {obl.dueDate}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getObligationStatusColor(obl.status)}`}>
                      {obl.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm font-medium ${getPriorityColor(obl.priority)}`}>
                      {obl.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{obl.assignedTo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ContractCompliance;

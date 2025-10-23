'use client';

import React, { useState, useMemo } from 'react';
import {
  FileText, Plus, Search, Edit3, Trash2, CheckCircle,
  Users, Calendar, AlertCircle, Eye
} from 'lucide-react';

interface Policy {
  id: string;
  policyCode: string;
  policyName: string;
  policyType: 'HR' | 'IT' | 'Finance' | 'Quality' | 'Safety' | 'Environment' | 'Security' | 'Compliance' | 'Operational' | 'General';
  category: 'Mandatory' | 'Recommended' | 'Guideline' | 'Best Practice';
  version: {
    versionNumber: string;
    effectiveDate: Date;
    reviewFrequency: 'Monthly' | 'Quarterly' | 'Half-Yearly' | 'Yearly' | 'Bi-Yearly' | 'As-Needed';
    nextReviewDate?: Date;
  };
  approval: {
    approvedBy: string;
    approvedDate?: Date;
  };
  compliance: {
    acknowledgementRequired: boolean;
    trainingRequired: boolean;
  };
  metrics: {
    totalEmployeesApplicable: number;
    totalAcknowledgements: number;
    acknowledgementPercentage: number;
    violations: number;
  };
  status: 'Draft' | 'Under Review' | 'Approved' | 'Active' | 'Inactive' | 'Superseded' | 'Archived';
}

const mockPolicies: Policy[] = [
  {
    id: '1',
    policyCode: 'POL-HR-001',
    policyName: 'Leave Policy',
    policyType: 'HR',
    category: 'Mandatory',
    version: {
      versionNumber: '2.1',
      effectiveDate: new Date('2024-01-01'),
      reviewFrequency: 'Yearly',
      nextReviewDate: new Date('2025-01-01')
    },
    approval: {
      approvedBy: 'CEO',
      approvedDate: new Date('2023-12-01')
    },
    compliance: {
      acknowledgementRequired: true,
      trainingRequired: false
    },
    metrics: {
      totalEmployeesApplicable: 250,
      totalAcknowledgements: 247,
      acknowledgementPercentage: 98.8,
      violations: 2
    },
    status: 'Active'
  },
  {
    id: '2',
    policyCode: 'POL-IT-001',
    policyName: 'Information Security Policy',
    policyType: 'IT',
    category: 'Mandatory',
    version: {
      versionNumber: '1.5',
      effectiveDate: new Date('2023-07-01'),
      reviewFrequency: 'Half-Yearly',
      nextReviewDate: new Date('2024-07-01')
    },
    approval: {
      approvedBy: 'CTO',
      approvedDate: new Date('2023-06-15')
    },
    compliance: {
      acknowledgementRequired: true,
      trainingRequired: true
    },
    metrics: {
      totalEmployeesApplicable: 250,
      totalAcknowledgements: 245,
      acknowledgementPercentage: 98.0,
      violations: 5
    },
    status: 'Active'
  },
  {
    id: '3',
    policyCode: 'POL-SAF-001',
    policyName: 'Workplace Safety Policy',
    policyType: 'Safety',
    category: 'Mandatory',
    version: {
      versionNumber: '3.0',
      effectiveDate: new Date('2023-04-01'),
      reviewFrequency: 'Yearly',
      nextReviewDate: new Date('2024-04-01')
    },
    approval: {
      approvedBy: 'Director',
      approvedDate: new Date('2023-03-15')
    },
    compliance: {
      acknowledgementRequired: true,
      trainingRequired: true
    },
    metrics: {
      totalEmployeesApplicable: 200,
      totalAcknowledgements: 200,
      acknowledgementPercentage: 100.0,
      violations: 0
    },
    status: 'Active'
  }
];

export default function PolicyMaster() {
  const [policies, setPolicies] = useState<Policy[]>(mockPolicies);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');

  const filteredPolicies = useMemo(() => {
    return policies.filter(policy => {
      const matchesSearch =
        policy.policyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        policy.policyCode.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType = filterType === 'All' || policy.policyType === filterType;
      const matchesStatus = filterStatus === 'All' || policy.status === filterStatus;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [policies, searchTerm, filterType, filterStatus]);

  const statistics = [
    {
      label: 'Total Policies',
      value: policies.length,
      icon: FileText,
      color: 'blue'
    },
    {
      label: 'Active Policies',
      value: policies.filter(p => p.status === 'Active').length,
      icon: CheckCircle,
      color: 'green'
    },
    {
      label: 'Avg Acknowledgement',
      value: `${Math.round(policies.reduce((sum, p) => sum + p.metrics.acknowledgementPercentage, 0) / policies.length)}%`,
      icon: Users,
      color: 'purple'
    },
    {
      label: 'Due for Review',
      value: policies.filter(p => {
        if (!p.version.nextReviewDate) return false;
        const days = Math.ceil((p.version.nextReviewDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
        return days <= 30 && days > 0;
      }).length,
      icon: Calendar,
      color: 'orange'
    }
  ];

  const statusColors = {
    Draft: 'bg-gray-100 text-gray-800',
    'Under Review': 'bg-yellow-100 text-yellow-800',
    Approved: 'bg-blue-100 text-blue-800',
    Active: 'bg-green-100 text-green-800',
    Inactive: 'bg-gray-100 text-gray-800',
    Superseded: 'bg-purple-100 text-purple-800',
    Archived: 'bg-red-100 text-red-800'
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Policy Master</h1>
          <p className="text-sm text-gray-600 mt-1">Manage company policies and guidelines</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <Plus className="w-4 h-4" />
          Add Policy
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statistics.map((stat, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg bg-${stat.color}-100`}>
                <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search policies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="All">All Types</option>
              <option value="HR">HR</option>
              <option value="IT">IT</option>
              <option value="Finance">Finance</option>
              <option value="Safety">Safety</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Draft">Draft</option>
              <option value="Under Review">Under Review</option>
            </select>
          </div>
        </div>
      </div>

      {/* Policies Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Policy</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Version</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Compliance</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acknowledgement</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPolicies.map((policy) => (
                <tr key={policy.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{policy.policyName}</div>
                    <div className="text-sm text-gray-500">{policy.policyCode}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{policy.policyType}</div>
                    <div className="text-xs text-gray-500">{policy.category}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">v{policy.version.versionNumber}</div>
                    <div className="text-xs text-gray-500">{policy.version.effectiveDate.toLocaleDateString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col gap-1">
                      {policy.compliance.acknowledgementRequired && (
                        <span className="text-xs text-blue-600">Ack Required</span>
                      )}
                      {policy.compliance.trainingRequired && (
                        <span className="text-xs text-orange-600">Training Required</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {policy.metrics.acknowledgementPercentage.toFixed(1)}%
                    </div>
                    <div className="text-xs text-gray-500">
                      {policy.metrics.totalAcknowledgements}/{policy.metrics.totalEmployeesApplicable}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColors[policy.status]}`}>
                      {policy.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button className="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                        <Eye className="w-4 h-4 text-gray-600" />
                        <span className="text-gray-700">View</span>
                      </button>
                      <button className="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                        <Edit3 className="w-4 h-4 text-gray-600" />
                        <span className="text-gray-700">Edit</span>
                      </button>
                      <button className="inline-flex items-center gap-1.5 px-3 py-2 border border-red-300 rounded-lg hover:bg-red-50 text-sm">
                        <Trash2 className="w-4 h-4 text-red-600" />
                        <span className="text-red-600">Delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="text-sm text-gray-600">
        Showing {filteredPolicies.length} of {policies.length} policies
      </div>
    </div>
  );
}

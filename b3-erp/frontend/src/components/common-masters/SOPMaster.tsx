'use client';

import React, { useState, useMemo } from 'react';
import {
  Bookmark, Plus, Search, Edit3, Trash2, FileText,
  CheckCircle, Users, Calendar, TrendingUp
} from 'lucide-react';

interface SOP {
  id: string;
  sopCode: string;
  sopTitle: string;
  sopType: 'Process' | 'Technical' | 'Safety' | 'Quality' | 'Administrative' | 'Operational' | 'Maintenance';
  category: 'Critical' | 'Important' | 'Standard' | 'Reference';
  department: string;
  version: {
    versionNumber: string;
    effectiveDate: Date;
    reviewFrequency: 'Monthly' | 'Quarterly' | 'Half-Yearly' | 'Yearly' | 'Bi-Yearly' | 'As-Needed';
    nextReviewDate?: Date;
  };
  approval: {
    preparedBy: string;
    approvedBy: string;
    approvedDate?: Date;
  };
  training: {
    trainingRequired: boolean;
    trainedPersonnel: number;
    totalPersonnel: number;
    certificationRequired: boolean;
  };
  metrics: {
    totalExecutions?: number;
    successRate?: number;
    averageCompletionTime?: number;
    deviationRate?: number;
  };
  status: 'Draft' | 'Under Review' | 'Approved' | 'Active' | 'Inactive' | 'Obsolete' | 'Superseded';
}

const mockSOPs: SOP[] = [
  {
    id: '1',
    sopCode: 'SOP-PROD-001',
    sopTitle: 'PCB Assembly Process',
    sopType: 'Process',
    category: 'Critical',
    department: 'Production',
    version: {
      versionNumber: '3.2',
      effectiveDate: new Date('2024-01-15'),
      reviewFrequency: 'Yearly',
      nextReviewDate: new Date('2025-01-15')
    },
    approval: {
      preparedBy: 'Mr. Suresh Patel',
      approvedBy: 'Mr. Rajesh Kumar',
      approvedDate: new Date('2024-01-10')
    },
    training: {
      trainingRequired: true,
      trainedPersonnel: 15,
      totalPersonnel: 15,
      certificationRequired: true
    },
    metrics: {
      totalExecutions: 1254,
      successRate: 99.2,
      averageCompletionTime: 65,
      deviationRate: 0.8
    },
    status: 'Active'
  },
  {
    id: '2',
    sopCode: 'SOP-QC-001',
    sopTitle: 'Final Product Inspection',
    sopType: 'Quality',
    category: 'Critical',
    department: 'Quality Control',
    version: {
      versionNumber: '2.5',
      effectiveDate: new Date('2023-09-01'),
      reviewFrequency: 'Half-Yearly',
      nextReviewDate: new Date('2024-09-01')
    },
    approval: {
      preparedBy: 'Ms. Kavita Rao',
      approvedBy: 'Ms. Anjali Verma',
      approvedDate: new Date('2023-08-25')
    },
    training: {
      trainingRequired: true,
      trainedPersonnel: 12,
      totalPersonnel: 12,
      certificationRequired: true
    },
    metrics: {
      totalExecutions: 3250,
      successRate: 98.5,
      averageCompletionTime: 30,
      deviationRate: 1.5
    },
    status: 'Active'
  },
  {
    id: '3',
    sopCode: 'SOP-SAFE-001',
    sopTitle: 'Emergency Evacuation Procedure',
    sopType: 'Safety',
    category: 'Critical',
    department: 'Safety',
    version: {
      versionNumber: '4.0',
      effectiveDate: new Date('2023-06-01'),
      reviewFrequency: 'Yearly',
      nextReviewDate: new Date('2024-06-01')
    },
    approval: {
      preparedBy: 'Mr. Arun Sharma',
      approvedBy: 'Director',
      approvedDate: new Date('2023-05-20')
    },
    training: {
      trainingRequired: true,
      trainedPersonnel: 250,
      totalPersonnel: 250,
      certificationRequired: false
    },
    metrics: {
      totalExecutions: 4,
      successRate: 100.0,
      averageCompletionTime: 15
    },
    status: 'Active'
  }
];

export default function SOPMaster() {
  const [sops, setSOPs] = useState<SOP[]>(mockSOPs);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');

  const filteredSOPs = useMemo(() => {
    return sops.filter(sop => {
      const matchesSearch =
        sop.sopTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sop.sopCode.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType = filterType === 'All' || sop.sopType === filterType;
      const matchesStatus = filterStatus === 'All' || sop.status === filterStatus;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [sops, searchTerm, filterType, filterStatus]);

  const statistics = [
    {
      label: 'Total SOPs',
      value: sops.length,
      icon: Bookmark,
      color: 'blue'
    },
    {
      label: 'Active SOPs',
      value: sops.filter(s => s.status === 'Active').length,
      icon: CheckCircle,
      color: 'green'
    },
    {
      label: 'Due for Review',
      value: sops.filter(s => {
        if (!s.version.nextReviewDate) return false;
        const days = Math.ceil((s.version.nextReviewDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
        return days <= 30 && days > 0;
      }).length,
      icon: Calendar,
      color: 'orange'
    },
    {
      label: 'Trained Personnel',
      value: `${Math.round(sops.reduce((sum, s) => sum + (s.training.trainedPersonnel / s.training.totalPersonnel) * 100, 0) / sops.length)}%`,
      icon: Users,
      color: 'purple'
    }
  ];

  const statusColors = {
    Draft: 'bg-gray-100 text-gray-800',
    'Under Review': 'bg-yellow-100 text-yellow-800',
    Approved: 'bg-blue-100 text-blue-800',
    Active: 'bg-green-100 text-green-800',
    Inactive: 'bg-gray-100 text-gray-800',
    Obsolete: 'bg-red-100 text-red-800',
    Superseded: 'bg-purple-100 text-purple-800'
  };

  const categoryColors = {
    Critical: 'bg-red-100 text-red-800',
    Important: 'bg-orange-100 text-orange-800',
    Standard: 'bg-blue-100 text-blue-800',
    Reference: 'bg-gray-100 text-gray-800'
  };

  return (
    <div className="p-6 space-y-3">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">SOP Master</h1>
          <p className="text-sm text-gray-600 mt-1">Manage Standard Operating Procedures</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <Plus className="w-4 h-4" />
          Add SOP
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
        {statistics.map((stat, index) => (
          <div key={index} className="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
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
      <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search SOPs..."
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
              <option value="Process">Process</option>
              <option value="Technical">Technical</option>
              <option value="Safety">Safety</option>
              <option value="Quality">Quality</option>
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

      {/* SOPs Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SOP</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Version</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Training</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performance</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSOPs.map((sop) => (
                <tr key={sop.id} className="hover:bg-gray-50">
                  <td className="px-3 py-2">
                    <div className="text-sm font-medium text-gray-900">{sop.sopTitle}</div>
                    <div className="text-sm text-gray-500">{sop.sopCode}</div>
                    <div className="text-xs text-gray-400">{sop.department}</div>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{sop.sopType}</div>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${categoryColors[sop.category]}`}>
                      {sop.category}
                    </span>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <div className="text-sm text-gray-900">v{sop.version.versionNumber}</div>
                    <div className="text-xs text-gray-500">{sop.version.effectiveDate.toLocaleDateString()}</div>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <div className="text-sm space-y-1">
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3 text-gray-400" />
                        <span className="text-gray-900">
                          {sop.training.trainedPersonnel}/{sop.training.totalPersonnel}
                        </span>
                      </div>
                      <div className={`text-xs ${sop.training.trainedPersonnel === sop.training.totalPersonnel ? 'text-green-600' : 'text-orange-600'}`}>
                        {Math.round((sop.training.trainedPersonnel / sop.training.totalPersonnel) * 100)}% Trained
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    {sop.metrics.successRate !== undefined && (
                      <div className="text-sm space-y-1">
                        <div className="flex items-center gap-1">
                          <TrendingUp className="w-3 h-3 text-green-400" />
                          <span className="font-medium text-green-600">{sop.metrics.successRate}%</span>
                        </div>
                        <div className="text-xs text-gray-500">
                          {sop.metrics.totalExecutions} executions
                        </div>
                      </div>
                    )}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColors[sop.status]}`}>
                      {sop.status}
                    </span>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button className="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                        <FileText className="w-4 h-4 text-gray-600" />
                        <span className="text-gray-700">Document</span>
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
        Showing {filteredSOPs.length} of {sops.length} SOPs
      </div>
    </div>
  );
}

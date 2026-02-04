'use client';

import React, { useState } from 'react';
import { FileText, BookOpen, CheckCircle, Clock, AlertTriangle, Download, Eye, Edit, Users, Calendar } from 'lucide-react';
import { AddComplianceRuleModal, CreateAnalyticsReportModal, CreateOnboardingWorkflowModal, InitiateReviewCycleModal, CreatePolicyModal } from './HRAdvancedModals';

export type PolicyStatus = 'draft' | 'active' | 'under-review' | 'archived';
export type PolicyCategory = 'hr' | 'it' | 'compliance' | 'security' | 'general';
export type AcknowledgmentStatus = 'pending' | 'acknowledged' | 'overdue';

export interface Policy {
  id: string;
  title: string;
  category: PolicyCategory;
  version: string;
  status: PolicyStatus;
  effectiveDate: string;
  reviewDate: string;
  owner: string;
  description: string;
  requiresAcknowledgment: boolean;
  acknowledgmentDeadline?: string;
  acknowledgedCount?: number;
  totalEmployees?: number;
}

export interface PolicyAcknowledgment {
  employeeId: string;
  employeeName: string;
  department: string;
  status: AcknowledgmentStatus;
  acknowledgedAt?: string;
  dueDate: string;
}

export default function PolicyManagement() {
  const [policies] = useState<Policy[]>([
    {
      id: 'pol-001',
      title: 'Code of Conduct',
      category: 'hr',
      version: '2.1',
      status: 'active',
      effectiveDate: '2024-01-01',
      reviewDate: '2025-12-31',
      owner: 'HR Department',
      description: 'Guidelines for professional behavior and ethical conduct',
      requiresAcknowledgment: true,
      acknowledgmentDeadline: '2025-02-28',
      acknowledgedCount: 198,
      totalEmployees: 245,
    },
    {
      id: 'pol-002',
      title: 'Remote Work Policy',
      category: 'hr',
      version: '1.3',
      status: 'active',
      effectiveDate: '2024-06-01',
      reviewDate: '2025-06-01',
      owner: 'HR Department',
      description: 'Guidelines for remote and hybrid work arrangements',
      requiresAcknowledgment: true,
      acknowledgmentDeadline: '2025-03-15',
      acknowledgedCount: 215,
      totalEmployees: 245,
    },
    {
      id: 'pol-003',
      title: 'Data Security Policy',
      category: 'security',
      version: '3.0',
      status: 'active',
      effectiveDate: '2024-09-01',
      reviewDate: '2025-09-01',
      owner: 'IT Security',
      description: 'Security protocols for handling sensitive information',
      requiresAcknowledgment: true,
      acknowledgmentDeadline: '2025-01-31',
      acknowledgedCount: 240,
      totalEmployees: 245,
    },
    {
      id: 'pol-004',
      title: 'Leave Policy',
      category: 'hr',
      version: '2.0',
      status: 'under-review',
      effectiveDate: '2024-04-01',
      reviewDate: '2025-04-01',
      owner: 'HR Department',
      description: 'Leave types, entitlements, and application process',
      requiresAcknowledgment: false,
    },
  ]);

  const getStatusColor = (status: PolicyStatus) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'under-review': return 'bg-yellow-100 text-yellow-800';
      case 'archived': return 'bg-red-100 text-red-800';
    }
  };

  const getCategoryColor = (category: PolicyCategory) => {
    switch (category) {
      case 'hr': return 'bg-blue-100 text-blue-700';
      case 'it': return 'bg-purple-100 text-purple-700';
      case 'compliance': return 'bg-green-100 text-green-700';
      case 'security': return 'bg-red-100 text-red-700';
      case 'general': return 'bg-gray-100 text-gray-700';
    }
  };

  const getAcknowledgmentProgress = (policy: Policy) => {
    if (!policy.requiresAcknowledgment || !policy.acknowledgedCount || !policy.totalEmployees) return null;
    const percentage = (policy.acknowledgedCount / policy.totalEmployees) * 100;
    return (
      <div className="mt-3">
        <div className="flex items-center justify-between mb-1 text-sm">
          <span className="text-gray-600">Acknowledgments</span>
          <span className="font-medium text-gray-900">
            {policy.acknowledgedCount}/{policy.totalEmployees} ({percentage.toFixed(1)}%)
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className={`h-2 rounded-full ${percentage >= 80 ? 'bg-green-500' : percentage >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${percentage}%` }}></div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full h-full bg-gradient-to-br from-gray-50 via-pink-50 to-rose-50 p-3">
      <div>
        <div className="mb-3">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Policy Management System</h1>
          <p className="text-gray-600">Centralized policy documentation and employee acknowledgments</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-3">
          <div className="bg-white rounded-xl shadow-lg p-3 border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <FileText className="w-5 h-5 text-blue-600" />
              <p className="text-sm font-medium text-gray-700">Total Policies</p>
            </div>
            <p className="text-2xl font-bold text-blue-600">{policies.length}</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-3 border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <p className="text-sm font-medium text-gray-700">Active</p>
            </div>
            <p className="text-2xl font-bold text-green-600">{policies.filter(p => p.status === 'active').length}</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-3 border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="w-5 h-5 text-yellow-600" />
              <p className="text-sm font-medium text-gray-700">Under Review</p>
            </div>
            <p className="text-2xl font-bold text-yellow-600">{policies.filter(p => p.status === 'under-review').length}</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-3 border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-5 h-5 text-purple-600" />
              <p className="text-sm font-medium text-gray-700">Requires Action</p>
            </div>
            <p className="text-2xl font-bold text-purple-600">
              {policies.filter(p => p.requiresAcknowledgment && p.acknowledgedCount !== p.totalEmployees).length}
            </p>
          </div>
        </div>

        {/* Policies List */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-3">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Company Policies</h2>

          <div className="space-y-2">
            {policies.map((policy) => (
              <div key={policy.id} className="bg-gray-50 rounded-lg p-3 border border-gray-200 hover:border-blue-300 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <BookOpen className="w-5 h-5 text-gray-600" />
                      <h3 className="font-semibold text-gray-900">{policy.title}</h3>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getCategoryColor(policy.category)}`}>
                        {policy.category.toUpperCase()}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(policy.status)}`}>
                        {policy.status.replace('-', ' ').toUpperCase()}
                      </span>
                      <span className="px-2 py-1 rounded bg-gray-200 text-gray-700 text-xs font-medium">
                        v{policy.version}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{policy.description}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Effective: {policy.effectiveDate}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Review: {policy.reviewDate}
                      </span>
                      <span>Owner: {policy.owner}</span>
                    </div>
                    {getAcknowledgmentProgress(policy)}
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors">
                      <Download className="w-4 h-4" />
                    </button>
                    {policy.status !== 'archived' && (
                      <button className="p-2 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {policy.requiresAcknowledgment && policy.acknowledgmentDeadline && (
                  <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm">
                      <AlertTriangle className="w-4 h-4 text-yellow-600" />
                      <span className="text-yellow-800">
                        Requires employee acknowledgment by {policy.acknowledgmentDeadline}
                      </span>
                    </div>
                    <button className="text-sm font-medium text-blue-600 hover:text-blue-700">
                      View Status →
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

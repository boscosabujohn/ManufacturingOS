'use client';

import React, { useState, useEffect } from 'react';
import {
  Shield, CheckCircle, AlertTriangle, XCircle, Clock,
  FileText, Award, Users, Target, Activity, BarChart3,
  Settings, Download, Upload, Eye, Edit3, Plus, Search,
  Filter, Bell, Calendar, Globe, Lock, Key, Database
} from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, PieChart as RePieChart, Pie,
  Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';

interface ProcurementComplianceProps {}

const ProcurementCompliance: React.FC<ProcurementComplianceProps> = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedCompliance, setSelectedCompliance] = useState<any>(null);

  // Mock compliance data
  const complianceMetrics = {
    overallScore: 94.2,
    totalRequirements: 156,
    compliant: 147,
    nonCompliant: 6,
    pending: 3,
    auditScore: 96.8,
    policiesUpdated: 12,
    incidentsThisMonth: 2
  };

  // Mock compliance requirements
  const complianceRequirements = [
    {
      id: 'REQ001',
      category: 'Data Protection',
      requirement: 'GDPR Compliance',
      status: 'compliant',
      score: 98,
      lastAudit: '2024-11-15',
      nextReview: '2025-05-15',
      owner: 'Legal Team'
    },
    {
      id: 'REQ002',
      category: 'Financial',
      requirement: 'SOX Controls',
      status: 'compliant',
      score: 95,
      lastAudit: '2024-10-20',
      nextReview: '2025-04-20',
      owner: 'Finance Team'
    },
    {
      id: 'REQ003',
      category: 'Environmental',
      requirement: 'ISO 14001',
      status: 'pending',
      score: 88,
      lastAudit: '2024-09-10',
      nextReview: '2025-03-10',
      owner: 'Operations'
    }
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Procurement Compliance Management</h2>
        <p className="text-gray-600">Ensure regulatory compliance and policy adherence</p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-1 mb-6 border-b">
        {['overview', 'requirements', 'audits', 'policies'].map((tab) => (
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

      {/* Overview Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Compliance Score Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <Shield className="h-8 w-8 text-green-500" />
                <span className="text-sm text-green-600">+2.3%</span>
              </div>
              <p className="text-2xl font-bold">{complianceMetrics.overallScore}%</p>
              <p className="text-sm text-gray-600">Overall Compliance</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <CheckCircle className="h-8 w-8 text-blue-500" />
                <span className="text-sm text-blue-600">{complianceMetrics.compliant}/{complianceMetrics.totalRequirements}</span>
              </div>
              <p className="text-2xl font-bold">{complianceMetrics.compliant}</p>
              <p className="text-sm text-gray-600">Compliant Items</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <AlertTriangle className="h-8 w-8 text-yellow-500" />
                <span className="text-sm text-yellow-600">Action needed</span>
              </div>
              <p className="text-2xl font-bold">{complianceMetrics.nonCompliant}</p>
              <p className="text-sm text-gray-600">Non-Compliant</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <Award className="h-8 w-8 text-purple-500" />
                <span className="text-sm text-purple-600">Recent audit</span>
              </div>
              <p className="text-2xl font-bold">{complianceMetrics.auditScore}%</p>
              <p className="text-sm text-gray-600">Audit Score</p>
            </div>
          </div>

          {/* Compliance Requirements Table */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Compliance Requirements Status</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Requirement</th>
                    <th className="text-left py-2">Category</th>
                    <th className="text-left py-2">Status</th>
                    <th className="text-left py-2">Score</th>
                    <th className="text-left py-2">Next Review</th>
                    <th className="text-left py-2">Owner</th>
                    <th className="text-left py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {complianceRequirements.map((req) => (
                    <tr key={req.id} className="border-b hover:bg-gray-50">
                      <td className="py-2">{req.requirement}</td>
                      <td className="py-2">{req.category}</td>
                      <td className="py-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          req.status === 'compliant' ? 'bg-green-100 text-green-800' :
                          req.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {req.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-2">{req.score}%</td>
                      <td className="py-2">{req.nextReview}</td>
                      <td className="py-2">{req.owner}</td>
                      <td className="py-2">
                        <button className="text-blue-600 hover:text-blue-800">
                          <Eye className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProcurementCompliance;
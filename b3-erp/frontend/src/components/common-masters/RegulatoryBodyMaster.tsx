'use client';

import React, { useState, useMemo } from 'react';
import {
  Shield, Plus, Search, Edit3, Trash2, CheckCircle,
  XCircle, AlertTriangle, Calendar, FileText, Building2
} from 'lucide-react';

interface RegulatoryBody {
  id: string;
  bodyCode: string;
  bodyName: string;
  shortName: string;
  bodyType: 'Government' | 'Industry' | 'International' | 'Self-Regulatory' | 'Professional';
  jurisdiction: 'National' | 'State' | 'Regional' | 'International' | 'Local';
  category: 'Tax' | 'Labor' | 'Environment' | 'Safety' | 'Quality' | 'Financial' | 'Trade' | 'General';
  contact: {
    phone: string;
    email: string;
    website?: string;
    helplineNumber?: string;
  };
  compliance: {
    applicableToCompany: boolean;
    mandatoryCompliance: boolean;
    complianceFrequency?: 'Monthly' | 'Quarterly' | 'Half-Yearly' | 'Yearly' | 'On-Demand' | 'Event-Based';
    nextComplianceDate?: Date;
    returnFilingRequired: boolean;
  };
  statistics: {
    totalCompliances: number;
    overdueCompliances: number;
    upcomingCompliances: number;
    complianceScore: number;
  };
  status: 'Active' | 'Inactive' | 'Under Review' | 'Discontinued';
}

const mockRegulatoryBodies: RegulatoryBody[] = [
  {
    id: '1',
    bodyCode: 'GST-IND',
    bodyName: 'Goods and Services Tax Network',
    shortName: 'GSTN',
    bodyType: 'Government',
    jurisdiction: 'National',
    category: 'Tax',
    contact: {
      phone: '+91-124-4688999',
      email: 'helpdesk@gst.gov.in',
      website: 'https://www.gst.gov.in',
      helplineNumber: '1800-103-4786'
    },
    compliance: {
      applicableToCompany: true,
      mandatoryCompliance: true,
      complianceFrequency: 'Monthly',
      nextComplianceDate: new Date('2024-03-10'),
      returnFilingRequired: true
    },
    statistics: {
      totalCompliances: 36,
      overdueCompliances: 0,
      upcomingCompliances: 2,
      complianceScore: 100
    },
    status: 'Active'
  },
  {
    id: '2',
    bodyCode: 'EPFO-IND',
    bodyName: 'Employees Provident Fund Organisation',
    shortName: 'EPFO',
    bodyType: 'Government',
    jurisdiction: 'National',
    category: 'Labor',
    contact: {
      phone: '+91-11-26172255',
      email: 'contactus@epfindia.gov.in',
      website: 'https://www.epfindia.gov.in',
      helplineNumber: '1800-118-005'
    },
    compliance: {
      applicableToCompany: true,
      mandatoryCompliance: true,
      complianceFrequency: 'Monthly',
      nextComplianceDate: new Date('2024-03-15'),
      returnFilingRequired: true
    },
    statistics: {
      totalCompliances: 36,
      overdueCompliances: 0,
      upcomingCompliances: 1,
      complianceScore: 100
    },
    status: 'Active'
  },
  {
    id: '3',
    bodyCode: 'ISO-INT',
    bodyName: 'International Organization for Standardization',
    shortName: 'ISO',
    bodyType: 'International',
    jurisdiction: 'International',
    category: 'Quality',
    contact: {
      phone: '+41-22-749-0111',
      email: 'central@iso.org',
      website: 'https://www.iso.org'
    },
    compliance: {
      applicableToCompany: true,
      mandatoryCompliance: false,
      complianceFrequency: 'Yearly',
      returnFilingRequired: false
    },
    statistics: {
      totalCompliances: 2,
      overdueCompliances: 0,
      upcomingCompliances: 0,
      complianceScore: 100
    },
    status: 'Active'
  },
  {
    id: '4',
    bodyCode: 'OSHA-US',
    bodyName: 'Occupational Safety and Health Administration',
    shortName: 'OSHA',
    bodyType: 'Government',
    jurisdiction: 'National',
    category: 'Safety',
    contact: {
      phone: '+1-800-321-6742',
      email: 'info@osha.gov',
      website: 'https://www.osha.gov',
      helplineNumber: '1-800-321-OSHA'
    },
    compliance: {
      applicableToCompany: true,
      mandatoryCompliance: true,
      complianceFrequency: 'Yearly',
      nextComplianceDate: new Date('2024-06-15'),
      returnFilingRequired: true
    },
    statistics: {
      totalCompliances: 12,
      overdueCompliances: 0,
      upcomingCompliances: 1,
      complianceScore: 95
    },
    status: 'Active'
  }
];

export default function RegulatoryBodyMaster() {
  const [bodies, setBodies] = useState<RegulatoryBody[]>(mockRegulatoryBodies);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');

  const filteredBodies = useMemo(() => {
    return bodies.filter(body => {
      const matchesSearch =
        body.bodyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        body.bodyCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        body.shortName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory = filterCategory === 'All' || body.category === filterCategory;
      const matchesStatus = filterStatus === 'All' || body.status === filterStatus;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [bodies, searchTerm, filterCategory, filterStatus]);

  const statistics = [
    {
      label: 'Total Regulatory Bodies',
      value: bodies.length,
      icon: Shield,
      color: 'blue'
    },
    {
      label: 'Active Compliances',
      value: bodies.reduce((sum, b) => sum + b.statistics.totalCompliances, 0),
      icon: CheckCircle,
      color: 'green'
    },
    {
      label: 'Overdue Compliances',
      value: bodies.reduce((sum, b) => sum + b.statistics.overdueCompliances, 0),
      icon: AlertTriangle,
      color: 'red'
    },
    {
      label: 'Avg Compliance Score',
      value: Math.round(bodies.reduce((sum, b) => sum + b.statistics.complianceScore, 0) / bodies.length),
      icon: CheckCircle,
      color: 'purple'
    }
  ];

  const statusColors = {
    Active: 'bg-green-100 text-green-800',
    Inactive: 'bg-gray-100 text-gray-800',
    'Under Review': 'bg-yellow-100 text-yellow-800',
    Discontinued: 'bg-red-100 text-red-800'
  };

  const categoryColors = {
    Tax: 'bg-blue-100 text-blue-800',
    Labor: 'bg-purple-100 text-purple-800',
    Environment: 'bg-green-100 text-green-800',
    Safety: 'bg-orange-100 text-orange-800',
    Quality: 'bg-indigo-100 text-indigo-800',
    Financial: 'bg-emerald-100 text-emerald-800',
    Trade: 'bg-cyan-100 text-cyan-800',
    General: 'bg-gray-100 text-gray-800'
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Regulatory Body Master</h1>
          <p className="text-sm text-gray-600 mt-1">Manage compliance authorities and regulatory organizations</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <Plus className="w-4 h-4" />
          Add Regulatory Body
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
              placeholder="Search by name, code, or short name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="All">All Categories</option>
              <option value="Tax">Tax</option>
              <option value="Labor">Labor</option>
              <option value="Environment">Environment</option>
              <option value="Safety">Safety</option>
              <option value="Quality">Quality</option>
              <option value="Financial">Financial</option>
              <option value="Trade">Trade</option>
              <option value="General">General</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Under Review">Under Review</option>
              <option value="Discontinued">Discontinued</option>
            </select>
          </div>
        </div>
      </div>

      {/* Regulatory Bodies Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Regulatory Body
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type & Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Compliance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statistics
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBodies.map((body) => (
                <tr key={body.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-blue-100 rounded-lg">
                        <Shield className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{body.bodyName}</div>
                        <div className="text-sm text-gray-500">{body.bodyCode} • {body.shortName}</div>
                        <div className="text-xs text-gray-400">{body.jurisdiction}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{body.bodyType}</div>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${categoryColors[body.category]}`}>
                      {body.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{body.contact.phone}</div>
                    <div className="text-sm text-gray-500">{body.contact.email}</div>
                    {body.contact.helplineNumber && (
                      <div className="text-xs text-blue-600">{body.contact.helplineNumber}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm">
                      <div className="flex items-center gap-1">
                        {body.compliance.mandatoryCompliance ? (
                          <CheckCircle className="w-4 h-4 text-red-600" />
                        ) : (
                          <XCircle className="w-4 h-4 text-gray-400" />
                        )}
                        <span className="text-gray-900">
                          {body.compliance.mandatoryCompliance ? 'Mandatory' : 'Optional'}
                        </span>
                      </div>
                      {body.compliance.complianceFrequency && (
                        <div className="text-xs text-gray-500 mt-1">{body.compliance.complianceFrequency}</div>
                      )}
                      {body.compliance.nextComplianceDate && (
                        <div className="text-xs text-blue-600 flex items-center gap-1 mt-1">
                          <Calendar className="w-3 h-3" />
                          {body.compliance.nextComplianceDate.toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm space-y-1">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total:</span>
                        <span className="font-semibold">{body.statistics.totalCompliances}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Overdue:</span>
                        <span className={`font-semibold ${body.statistics.overdueCompliances > 0 ? 'text-red-600' : 'text-green-600'}`}>
                          {body.statistics.overdueCompliances}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Score:</span>
                        <span className="font-semibold text-blue-600">{body.statistics.complianceScore}%</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColors[body.status]}`}>
                      {body.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button className="text-blue-600 hover:text-blue-900">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button className="text-gray-600 hover:text-gray-900">
                        <FileText className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Showing results */}
      <div className="text-sm text-gray-600">
        Showing {filteredBodies.length} of {bodies.length} regulatory bodies
      </div>
    </div>
  );
}

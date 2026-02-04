'use client';

import React, { useState, useMemo } from 'react';
import {
  Award, Plus, Search, Edit3, Trash2, Calendar,
  CheckCircle, Clock, Star, FileCheck, TrendingUp
} from 'lucide-react';

interface Certificate {
  id: string;
  certificateCode: string;
  certificateName: string;
  certificateType: 'Quality' | 'Safety' | 'Environment' | 'Security' | 'Product' | 'System' | 'Professional' | 'Other';
  standard: string;
  issuingBody: string;
  certificateDetails: {
    certificateNumber: string;
    issueDate: Date;
    expiryDate?: Date;
    isPerpetual: boolean;
  };
  surveillance: {
    surveillanceRequired: boolean;
    lastAuditDate?: Date;
    nextAuditDate?: Date;
    nextAuditType?: 'Surveillance' | 'Re-certification';
  };
  costs: {
    initialCost: number;
    surveillanceCost?: number;
    recertificationCost?: number;
    currency: string;
  };
  status: 'Active' | 'Expired' | 'Suspended' | 'Withdrawn' | 'Under Renewal';
}

const mockCertificates: Certificate[] = [
  {
    id: '1',
    certificateCode: 'CERT-ISO9001',
    certificateName: 'ISO 9001:2015 Quality Management System',
    certificateType: 'Quality',
    standard: 'ISO 9001:2015',
    issuingBody: 'Bureau Veritas Certification',
    certificateDetails: {
      certificateNumber: 'ISO9001-IN-2023-1234',
      issueDate: new Date('2023-06-15'),
      expiryDate: new Date('2026-06-14'),
      isPerpetual: false
    },
    surveillance: {
      surveillanceRequired: true,
      lastAuditDate: new Date('2023-06-10'),
      nextAuditDate: new Date('2024-06-10'),
      nextAuditType: 'Surveillance'
    },
    costs: {
      initialCost: 250000,
      surveillanceCost: 75000,
      recertificationCost: 200000,
      currency: 'INR'
    },
    status: 'Active'
  },
  {
    id: '2',
    certificateCode: 'CERT-CE',
    certificateName: 'CE Marking Certification',
    certificateType: 'Product',
    standard: 'CE Marking (EU Directive 2014/35/EU)',
    issuingBody: 'TUV Rheinland',
    certificateDetails: {
      certificateNumber: 'CE-TUV-2023-5678',
      issueDate: new Date('2023-08-20'),
      isPerpetual: true
    },
    surveillance: {
      surveillanceRequired: false
    },
    costs: {
      initialCost: 350000,
      currency: 'INR'
    },
    status: 'Active'
  },
  {
    id: '3',
    certificateCode: 'CERT-ISO14001',
    certificateName: 'ISO 14001:2015 Environmental Management',
    certificateType: 'Environment',
    standard: 'ISO 14001:2015',
    issuingBody: 'DNV GL',
    certificateDetails: {
      certificateNumber: 'ISO14001-2022-9876',
      issueDate: new Date('2022-09-01'),
      expiryDate: new Date('2025-08-31'),
      isPerpetual: false
    },
    surveillance: {
      surveillanceRequired: true,
      lastAuditDate: new Date('2023-09-15'),
      nextAuditDate: new Date('2024-09-15'),
      nextAuditType: 'Surveillance'
    },
    costs: {
      initialCost: 300000,
      surveillanceCost: 80000,
      recertificationCost: 250000,
      currency: 'INR'
    },
    status: 'Active'
  },
  {
    id: '4',
    certificateCode: 'CERT-ISO45001',
    certificateName: 'ISO 45001:2018 Occupational Health & Safety',
    certificateType: 'Safety',
    standard: 'ISO 45001:2018',
    issuingBody: 'SGS India',
    certificateDetails: {
      certificateNumber: 'ISO45001-2023-4567',
      issueDate: new Date('2023-03-15'),
      expiryDate: new Date('2026-03-14'),
      isPerpetual: false
    },
    surveillance: {
      surveillanceRequired: true,
      lastAuditDate: new Date('2023-03-10'),
      nextAuditDate: new Date('2024-03-10'),
      nextAuditType: 'Surveillance'
    },
    costs: {
      initialCost: 280000,
      surveillanceCost: 70000,
      recertificationCost: 220000,
      currency: 'INR'
    },
    status: 'Active'
  }
];

export default function CertificateMaster() {
  const [certificates, setCertificates] = useState<Certificate[]>(mockCertificates);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');

  const filteredCertificates = useMemo(() => {
    return certificates.filter(cert => {
      const matchesSearch =
        cert.certificateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cert.certificateCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cert.standard.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cert.certificateDetails.certificateNumber.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType = filterType === 'All' || cert.certificateType === filterType;
      const matchesStatus = filterStatus === 'All' || cert.status === filterStatus;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [certificates, searchTerm, filterType, filterStatus]);

  const getDaysUntilAudit = (nextAuditDate?: Date) => {
    if (!nextAuditDate) return null;
    const today = new Date();
    const diffTime = nextAuditDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const statistics = [
    {
      label: 'Total Certificates',
      value: certificates.length,
      icon: Award,
      color: 'blue'
    },
    {
      label: 'Active Certificates',
      value: certificates.filter(c => c.status === 'Active').length,
      icon: CheckCircle,
      color: 'green'
    },
    {
      label: 'Audits This Year',
      value: certificates.filter(c => {
        if (!c.surveillance.lastAuditDate) return false;
        const auditYear = c.surveillance.lastAuditDate.getFullYear();
        return auditYear === new Date().getFullYear();
      }).length,
      icon: FileCheck,
      color: 'purple'
    },
    {
      label: 'Expiring (90 days)',
      value: certificates.filter(c => {
        if (!c.certificateDetails.expiryDate) return false;
        const days = getDaysUntilAudit(c.certificateDetails.expiryDate);
        return days !== null && days <= 90 && days > 0;
      }).length,
      icon: Clock,
      color: 'orange'
    }
  ];

  const statusColors = {
    Active: 'bg-green-100 text-green-800',
    Expired: 'bg-red-100 text-red-800',
    Suspended: 'bg-orange-100 text-orange-800',
    Withdrawn: 'bg-gray-100 text-gray-800',
    'Under Renewal': 'bg-yellow-100 text-yellow-800'
  };

  const typeColors = {
    Quality: 'bg-blue-100 text-blue-800',
    Safety: 'bg-orange-100 text-orange-800',
    Environment: 'bg-green-100 text-green-800',
    Security: 'bg-red-100 text-red-800',
    Product: 'bg-purple-100 text-purple-800',
    System: 'bg-indigo-100 text-indigo-800',
    Professional: 'bg-cyan-100 text-cyan-800',
    Other: 'bg-gray-100 text-gray-800'
  };

  return (
    <div className="p-6 space-y-3">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Certificate Master</h1>
          <p className="text-sm text-gray-600 mt-1">Manage quality, safety, and compliance certifications</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <Plus className="w-4 h-4" />
          Add Certificate
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
              placeholder="Search by certificate name, code, standard, or number..."
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
              <option value="Quality">Quality</option>
              <option value="Safety">Safety</option>
              <option value="Environment">Environment</option>
              <option value="Product">Product</option>
              <option value="System">System</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Expired">Expired</option>
              <option value="Under Renewal">Under Renewal</option>
            </select>
          </div>
        </div>
      </div>

      {/* Certificates Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Certificate Details
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type & Standard
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Validity
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Surveillance
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Costs
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCertificates.map((cert) => {
                const daysUntilAudit = getDaysUntilAudit(cert.surveillance.nextAuditDate);
                const daysUntilExpiry = getDaysUntilAudit(cert.certificateDetails.expiryDate);
                return (
                  <tr key={cert.id} className="hover:bg-gray-50">
                    <td className="px-3 py-2">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-indigo-100 rounded-lg">
                          <Star className="h-6 w-6 text-indigo-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{cert.certificateName}</div>
                          <div className="text-sm text-gray-500">{cert.certificateCode}</div>
                          <div className="text-xs text-gray-400">{cert.certificateDetails.certificateNumber}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${typeColors[cert.certificateType]}`}>
                        {cert.certificateType}
                      </span>
                      <div className="text-sm text-gray-900 mt-1">{cert.standard}</div>
                      <div className="text-xs text-gray-500">{cert.issuingBody}</div>
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      <div className="text-sm space-y-1">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-gray-400" />
                          <span className="text-gray-600">Issued:</span>
                          <span className="text-gray-900">
                            {cert.certificateDetails.issueDate.toLocaleDateString()}
                          </span>
                        </div>
                        {cert.certificateDetails.expiryDate ? (
                          <>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-gray-400" />
                              <span className="text-gray-600">Expires:</span>
                              <span className={`font-medium ${
                                daysUntilExpiry && daysUntilExpiry <= 30 ? 'text-red-600' :
                                daysUntilExpiry && daysUntilExpiry <= 90 ? 'text-orange-600' :
                                'text-gray-900'
                              }`}>
                                {cert.certificateDetails.expiryDate.toLocaleDateString()}
                              </span>
                            </div>
                            {daysUntilExpiry !== null && daysUntilExpiry > 0 && (
                              <div className={`text-xs ${
                                daysUntilExpiry <= 30 ? 'text-red-600 font-medium' :
                                daysUntilExpiry <= 90 ? 'text-orange-600 font-medium' :
                                'text-gray-500'
                              }`}>
                                {daysUntilExpiry} days remaining
                              </div>
                            )}
                          </>
                        ) : (
                          <div className="text-xs text-green-600 font-medium">Valid as long as design unchanged</div>
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      {cert.surveillance.surveillanceRequired ? (
                        <div className="space-y-1">
                          {cert.surveillance.nextAuditDate && (
                            <>
                              <div className="text-sm text-gray-900">
                                {cert.surveillance.nextAuditType}
                              </div>
                              <div className="text-xs text-gray-500 flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {cert.surveillance.nextAuditDate.toLocaleDateString()}
                              </div>
                              {daysUntilAudit !== null && daysUntilAudit > 0 && (
                                <div className={`text-xs ${
                                  daysUntilAudit <= 30 ? 'text-orange-600 font-medium' :
                                  'text-gray-500'
                                }`}>
                                  In {daysUntilAudit} days
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      ) : (
                        <div className="text-sm text-gray-500">Not Required</div>
                      )}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      <div className="text-sm space-y-1">
                        <div className="text-gray-900 font-medium">
                          {cert.costs.currency} {cert.costs.initialCost.toLocaleString()}
                        </div>
                        {cert.costs.surveillanceCost && (
                          <div className="text-xs text-gray-500">
                            Surveillance: {cert.costs.currency} {cert.costs.surveillanceCost.toLocaleString()}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColors[cert.status]}`}>
                        {cert.status}
                      </span>
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button className="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                          <Edit3 className="w-4 h-4 text-gray-600" />
                          <span className="text-gray-700">Edit</span>
                        </button>
                        <button className="inline-flex items-center gap-1.5 px-3 py-2 border border-red-300 rounded-lg hover:bg-red-50 text-sm">
                          <Trash2 className="w-4 h-4 text-red-600" />
                          <span className="text-red-600">Delete</span>
                        </button>
                        <button className="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                          <FileCheck className="w-4 h-4 text-gray-600" />
                          <span className="text-gray-700">Verify</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Showing results */}
      <div className="text-sm text-gray-600">
        Showing {filteredCertificates.length} of {certificates.length} certificates
      </div>
    </div>
  );
}

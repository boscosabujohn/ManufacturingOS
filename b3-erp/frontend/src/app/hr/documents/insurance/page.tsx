'use client';

import { useState, useMemo } from 'react';
import { Shield, Upload, Download, Eye, CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface InsuranceDocument {
  id: string;
  insuranceType: string;
  policyNumber: string;
  insuranceProvider: string;
  coverageAmount: number;
  policyStartDate: string;
  policyEndDate: string;
  premiumAmount?: number;
  uploadedOn: string;
  status: 'active' | 'pending' | 'expired';
  fileSize: string;
  fileName: string;
  nominees?: string[];
}

export default function InsuranceDocumentsPage() {
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const mockDocuments: InsuranceDocument[] = [
    {
      id: 'INS001',
      insuranceType: 'Group Health Insurance',
      policyNumber: 'GHI/2025/12345',
      insuranceProvider: 'ICICI Lombard',
      coverageAmount: 500000,
      policyStartDate: '2025-04-01',
      policyEndDate: '2026-03-31',
      premiumAmount: 8500,
      uploadedOn: '2025-04-01',
      status: 'active',
      fileSize: '345 KB',
      fileName: 'group_health_policy.pdf',
      nominees: ['Priya Sharma (Spouse)']
    },
    {
      id: 'INS002',
      insuranceType: 'Group Term Life Insurance',
      policyNumber: 'GTLI/2025/67890',
      insuranceProvider: 'HDFC Life',
      coverageAmount: 1000000,
      policyStartDate: '2025-04-01',
      policyEndDate: '2026-03-31',
      uploadedOn: '2025-04-01',
      status: 'active',
      fileSize: '289 KB',
      fileName: 'group_life_policy.pdf',
      nominees: ['Priya Sharma (Spouse)', 'Rajesh Sharma (Father)']
    },
    {
      id: 'INS003',
      insuranceType: 'Personal Accident Insurance',
      policyNumber: 'PAI/2025/11223',
      insuranceProvider: 'Bajaj Allianz',
      coverageAmount: 1500000,
      policyStartDate: '2025-04-01',
      policyEndDate: '2026-03-31',
      uploadedOn: '2025-04-01',
      status: 'active',
      fileSize: '267 KB',
      fileName: 'personal_accident_policy.pdf',
      nominees: ['Priya Sharma (Spouse)']
    },
    {
      id: 'INS004',
      insuranceType: 'Group Health Insurance (Dependent)',
      policyNumber: 'GHI-DEP/2025/44556',
      insuranceProvider: 'ICICI Lombard',
      coverageAmount: 300000,
      policyStartDate: '2025-04-01',
      policyEndDate: '2026-03-31',
      premiumAmount: 5200,
      uploadedOn: '2025-04-01',
      status: 'active',
      fileSize: '312 KB',
      fileName: 'dependent_health_policy.pdf',
      nominees: ['Priya Sharma (Spouse)', 'Aarav Sharma (Son)']
    }
  ];

  const filteredDocuments = useMemo(() => {
    return mockDocuments.filter(doc => {
      const matchesType = selectedType === 'all' || doc.insuranceType === selectedType;
      const matchesStatus = selectedStatus === 'all' || doc.status === selectedStatus;
      return matchesType && matchesStatus;
    });
  }, [selectedType, selectedStatus]);

  const insuranceTypes = ['all', ...Array.from(new Set(mockDocuments.map(d => d.insuranceType)))];

  const stats = {
    total: mockDocuments.length,
    active: mockDocuments.filter(d => d.status === 'active').length,
    pending: mockDocuments.filter(d => d.status === 'pending').length,
    totalCoverage: mockDocuments.filter(d => d.status === 'active').reduce((sum, d) => sum + d.coverageAmount, 0)
  };

  const statusColors = {
    active: 'bg-green-100 text-green-700',
    pending: 'bg-yellow-100 text-yellow-700',
    expired: 'bg-red-100 text-red-700'
  };

  const isExpiringSoon = (endDate: string) => {
    const expiry = new Date(endDate);
    const today = new Date();
    const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry > 0 && daysUntilExpiry <= 30;
  };

  return (
    <div className="w-full h-full px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Insurance Documents</h1>
        <p className="text-sm text-gray-600 mt-1">Manage your company-provided insurance policies and documents</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Active Policies</p>
              <p className="text-2xl font-bold text-green-900 mt-1">{stats.active}</p>
            </div>
            <Shield className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Total Coverage</p>
              <p className="text-2xl font-bold text-blue-900 mt-1">₹{(stats.totalCoverage / 100000).toFixed(1)}L</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4 border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-900 mt-1">{stats.pending}</p>
            </div>
            <Clock className="h-8 w-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">Total Documents</p>
              <p className="text-2xl font-bold text-purple-900 mt-1">{stats.total}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Insurance Type</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {insuranceTypes.map(type => (
                <option key={type} value={type}>
                  {type === 'all' ? 'All Insurance Types' : type}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="expired">Expired</option>
            </select>
          </div>
          <div className="flex items-end">
            <button className="w-full md:w-auto px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Upload New
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredDocuments.map(doc => {
          const expiringSoon = isExpiringSoon(doc.policyEndDate);

          return (
            <div key={doc.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-gray-900">{doc.insuranceType}</h3>
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full flex items-center gap-1 ${statusColors[doc.status]}`}>
                      {doc.status === 'active' && <CheckCircle className="h-3 w-3" />}
                      {doc.status === 'pending' && <Clock className="h-3 w-3" />}
                      {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                    </span>
                    {expiringSoon && (
                      <span className="px-3 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-700 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        Renewing Soon
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{doc.fileName} • {doc.fileSize}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase font-medium mb-1">Policy Number</p>
                  <p className="text-sm font-semibold text-gray-900">{doc.policyNumber}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-medium mb-1">Insurance Provider</p>
                  <p className="text-sm font-semibold text-gray-900">{doc.insuranceProvider}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-medium mb-1">Coverage Amount</p>
                  <p className="text-lg font-bold text-green-600">₹{doc.coverageAmount.toLocaleString('en-IN')}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-medium mb-1">Policy Period</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {new Date(doc.policyStartDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })} to{' '}
                    {new Date(doc.policyEndDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </p>
                </div>
                {doc.premiumAmount && (
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-medium mb-1">Premium Amount</p>
                    <p className="text-sm font-semibold text-gray-900">₹{doc.premiumAmount.toLocaleString('en-IN')} per year</p>
                  </div>
                )}
                <div>
                  <p className="text-xs text-gray-500 uppercase font-medium mb-1">Uploaded On</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {new Date(doc.uploadedOn).toLocaleDateString('en-IN')}
                  </p>
                </div>
              </div>

              {doc.nominees && doc.nominees.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-4">
                  <p className="text-xs text-gray-500 uppercase font-medium mb-2">Nominees</p>
                  <div className="flex flex-wrap gap-2">
                    {doc.nominees.map((nominee, idx) => (
                      <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                        {nominee}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-2 pt-4 border-t border-gray-200">
                <button className="flex items-center gap-2 px-4 py-2 text-green-600 hover:bg-green-50 rounded-lg font-medium text-sm">
                  <Eye className="h-4 w-4" />
                  View Policy
                </button>
                <button className="flex items-center gap-2 px-4 py-2 text-green-600 hover:bg-green-50 rounded-lg font-medium text-sm">
                  <Download className="h-4 w-4" />
                  Download
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredDocuments.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
          <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No insurance documents found</h3>
          <p className="text-gray-600">No documents match the selected filters</p>
        </div>
      )}

      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-6">
        <h3 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          Insurance Coverage Information
        </h3>
        <ul className="text-sm text-green-800 space-y-1 ml-7">
          <li>• <strong>Group Health Insurance</strong>: ₹5,00,000 coverage for employee + dependents optional</li>
          <li>• <strong>Group Term Life Insurance</strong>: ₹10,00,000 coverage (10x annual CTC)</li>
          <li>• <strong>Personal Accident Insurance</strong>: ₹15,00,000 coverage for accidental death/disability</li>
          <li>• <strong>Maternity Coverage</strong>: Up to ₹1,00,000 (included in health insurance)</li>
          <li>• All premiums are paid by the company (employee contribution may apply for dependents)</li>
          <li>• Cashless hospitalization available at 5000+ network hospitals across India</li>
          <li>• Claim intimation must be done within 24 hours of hospitalization</li>
          <li>• Policy renewal happens annually on April 1st</li>
        </ul>
      </div>
    </div>
  );
}

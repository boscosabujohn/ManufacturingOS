'use client';

import { useState, useMemo } from 'react';
import { FileText, Upload, Download, Eye, CheckCircle, XCircle, Clock, AlertCircle, Calendar } from 'lucide-react';

interface PersonalDocument {
  id: string;
  documentType: string;
  documentNumber: string;
  issueDate: string;
  expiryDate?: string;
  issuingAuthority: string;
  uploadedOn: string;
  uploadedBy: string;
  status: 'verified' | 'pending' | 'rejected' | 'expired';
  fileSize: string;
  fileName: string;
  verifiedBy?: string;
  verifiedOn?: string;
  remarks?: string;
}

export default function PersonalDocumentsPage() {
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const mockDocuments: PersonalDocument[] = [
    {
      id: 'PD001',
      documentType: 'Aadhaar Card',
      documentNumber: 'XXXX-XXXX-4521',
      issueDate: '2018-03-15',
      issuingAuthority: 'UIDAI',
      uploadedOn: '2024-01-10',
      uploadedBy: 'Self',
      status: 'verified',
      fileSize: '245 KB',
      fileName: 'aadhaar_card.pdf',
      verifiedBy: 'Kavita Sharma',
      verifiedOn: '2024-01-11'
    },
    {
      id: 'PD002',
      documentType: 'PAN Card',
      documentNumber: 'ABCDE1234F',
      issueDate: '2017-06-20',
      issuingAuthority: 'Income Tax Department',
      uploadedOn: '2024-01-10',
      uploadedBy: 'Self',
      status: 'verified',
      fileSize: '189 KB',
      fileName: 'pan_card.pdf',
      verifiedBy: 'Kavita Sharma',
      verifiedOn: '2024-01-11'
    },
    {
      id: 'PD003',
      documentType: 'Passport',
      documentNumber: 'M1234567',
      issueDate: '2020-01-15',
      expiryDate: '2030-01-14',
      issuingAuthority: 'Passport Office, Mumbai',
      uploadedOn: '2024-01-10',
      uploadedBy: 'Self',
      status: 'verified',
      fileSize: '512 KB',
      fileName: 'passport.pdf',
      verifiedBy: 'Kavita Sharma',
      verifiedOn: '2024-01-12'
    },
    {
      id: 'PD004',
      documentType: 'Driving License',
      documentNumber: 'MH01-20180012345',
      issueDate: '2018-05-10',
      expiryDate: '2038-05-09',
      issuingAuthority: 'RTO Mumbai',
      uploadedOn: '2024-01-15',
      uploadedBy: 'Self',
      status: 'pending',
      fileSize: '320 KB',
      fileName: 'driving_license.pdf'
    },
    {
      id: 'PD005',
      documentType: 'Voter ID',
      documentNumber: 'ABC1234567',
      issueDate: '2016-08-25',
      issuingAuthority: 'Election Commission of India',
      uploadedOn: '2023-12-20',
      uploadedBy: 'Self',
      status: 'verified',
      fileSize: '278 KB',
      fileName: 'voter_id.pdf',
      verifiedBy: 'Kavita Sharma',
      verifiedOn: '2023-12-22'
    },
    {
      id: 'PD006',
      documentType: 'Passport Size Photo',
      documentNumber: 'N/A',
      issueDate: '2024-01-05',
      issuingAuthority: 'N/A',
      uploadedOn: '2024-01-10',
      uploadedBy: 'Self',
      status: 'verified',
      fileSize: '145 KB',
      fileName: 'passport_photo.jpg',
      verifiedBy: 'Kavita Sharma',
      verifiedOn: '2024-01-11'
    }
  ];

  const filteredDocuments = useMemo(() => {
    return mockDocuments.filter(doc => {
      const matchesType = selectedType === 'all' || doc.documentType === selectedType;
      const matchesStatus = selectedStatus === 'all' || doc.status === selectedStatus;
      return matchesType && matchesStatus;
    });
  }, [selectedType, selectedStatus]);

  const documentTypes = ['all', ...Array.from(new Set(mockDocuments.map(d => d.documentType)))];

  const stats = {
    total: mockDocuments.length,
    verified: mockDocuments.filter(d => d.status === 'verified').length,
    pending: mockDocuments.filter(d => d.status === 'pending').length,
    expired: mockDocuments.filter(d => d.status === 'expired').length
  };

  const statusColors = {
    verified: 'bg-green-100 text-green-700',
    pending: 'bg-yellow-100 text-yellow-700',
    rejected: 'bg-red-100 text-red-700',
    expired: 'bg-gray-100 text-gray-700'
  };

  const statusIcons = {
    verified: CheckCircle,
    pending: Clock,
    rejected: XCircle,
    expired: AlertCircle
  };

  const isExpiringSoon = (expiryDate?: string) => {
    if (!expiryDate) return false;
    const expiry = new Date(expiryDate);
    const today = new Date();
    const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry > 0 && daysUntilExpiry <= 90;
  };

  return (
    <div className="w-full h-full px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Personal Documents</h1>
        <p className="text-sm text-gray-600 mt-1">Manage your identity and address proof documents</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Total Documents</p>
              <p className="text-2xl font-bold text-blue-900 mt-1">{stats.total}</p>
            </div>
            <FileText className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Verified</p>
              <p className="text-2xl font-bold text-green-900 mt-1">{stats.verified}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
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

        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Expired</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.expired}</p>
            </div>
            <AlertCircle className="h-8 w-8 text-gray-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Document Type</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {documentTypes.map(type => (
                <option key={type} value={type}>
                  {type === 'all' ? 'All Document Types' : type}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="verified">Verified</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
              <option value="expired">Expired</option>
            </select>
          </div>
          <div className="flex items-end">
            <button className="w-full md:w-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Upload New
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredDocuments.map(doc => {
          const StatusIcon = statusIcons[doc.status];
          const expiringSoon = isExpiringSoon(doc.expiryDate);

          return (
            <div key={doc.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-gray-900">{doc.documentType}</h3>
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full flex items-center gap-1 ${statusColors[doc.status]}`}>
                      <StatusIcon className="h-3 w-3" />
                      {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                    </span>
                    {expiringSoon && (
                      <span className="px-3 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-700 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        Expiring Soon
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{doc.fileName} • {doc.fileSize}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase font-medium mb-1">Document Number</p>
                  <p className="text-sm font-semibold text-gray-900">{doc.documentNumber}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-medium mb-1">Issue Date</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {new Date(doc.issueDate).toLocaleDateString('en-IN')}
                  </p>
                </div>
                {doc.expiryDate && (
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-medium mb-1">Expiry Date</p>
                    <p className={`text-sm font-semibold ${expiringSoon ? 'text-orange-600' : 'text-gray-900'}`}>
                      {new Date(doc.expiryDate).toLocaleDateString('en-IN')}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-xs text-gray-500 uppercase font-medium mb-1">Issuing Authority</p>
                  <p className="text-sm font-semibold text-gray-900">{doc.issuingAuthority}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-medium mb-1">Uploaded On</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {new Date(doc.uploadedOn).toLocaleDateString('en-IN')}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-medium mb-1">Uploaded By</p>
                  <p className="text-sm font-semibold text-gray-900">{doc.uploadedBy}</p>
                </div>
              </div>

              {doc.status === 'verified' && doc.verifiedBy && (
                <div className="bg-green-50 border border-green-200 rounded p-3 mb-4">
                  <div className="flex items-center gap-2 text-green-800 text-sm">
                    <CheckCircle className="h-4 w-4" />
                    <span>Verified by <strong>{doc.verifiedBy}</strong> on {new Date(doc.verifiedOn!).toLocaleDateString('en-IN')}</span>
                  </div>
                </div>
              )}

              {doc.remarks && (
                <div className="bg-gray-50 border border-gray-200 rounded p-3 mb-4">
                  <p className="text-xs text-gray-500 uppercase font-medium mb-1">Remarks</p>
                  <p className="text-sm text-gray-700">{doc.remarks}</p>
                </div>
              )}

              <div className="flex gap-2 pt-4 border-t border-gray-200">
                <button className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg font-medium text-sm">
                  <Eye className="h-4 w-4" />
                  View
                </button>
                <button className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg font-medium text-sm">
                  <Download className="h-4 w-4" />
                  Download
                </button>
                {doc.status === 'pending' && (
                  <button className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg font-medium text-sm ml-auto">
                    Delete
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredDocuments.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No documents found</h3>
          <p className="text-gray-600">No documents match the selected filters</p>
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
        <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          Document Requirements
        </h3>
        <ul className="text-sm text-blue-800 space-y-1 ml-7">
          <li>• <strong>Aadhaar Card</strong>: Mandatory for all employees (as per Indian regulations)</li>
          <li>• <strong>PAN Card</strong>: Required for tax deductions and salary processing</li>
          <li>• <strong>Passport</strong>: Required for international travel and client visits</li>
          <li>• <strong>Driving License</strong>: Required if employee needs company vehicle</li>
          <li>• <strong>Address Proof</strong>: Any government-issued ID with current address</li>
          <li>• <strong>Passport Photo</strong>: Recent passport-size photograph (white background)</li>
          <li>• Upload documents in PDF or JPG format (Max size: 2MB per file)</li>
          <li>• Ensure all documents are clear, legible, and not expired</li>
        </ul>
      </div>
    </div>
  );
}

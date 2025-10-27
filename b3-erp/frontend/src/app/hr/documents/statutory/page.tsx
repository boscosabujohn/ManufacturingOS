'use client';

import { useState, useMemo } from 'react';
import { FileCheck, Upload, Download, Eye, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';

interface StatutoryDocument {
  id: string;
  documentType: string;
  formNumber: string;
  documentName: string;
  uanNumber?: string;
  esicNumber?: string;
  uploadedOn: string;
  status: 'verified' | 'pending' | 'rejected';
  fileSize: string;
  fileName: string;
  verifiedBy?: string;
  verifiedOn?: string;
  remarks?: string;
}

export default function StatutoryDocumentsPage() {
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const mockDocuments: StatutoryDocument[] = [
    {
      id: 'STAT001',
      documentType: 'PF Documents',
      formNumber: 'Form 11',
      documentName: 'EPF Member Declaration Form',
      uanNumber: 'UAN123456789012',
      uploadedOn: '2024-01-10',
      status: 'verified',
      fileSize: '234 KB',
      fileName: 'epf_form11.pdf',
      verifiedBy: 'Kavita Sharma',
      verifiedOn: '2024-01-11'
    },
    {
      id: 'STAT002',
      documentType: 'PF Documents',
      formNumber: 'Form 2',
      documentName: 'EPF Nomination Form',
      uanNumber: 'UAN123456789012',
      uploadedOn: '2024-01-10',
      status: 'verified',
      fileSize: '189 KB',
      fileName: 'epf_form2_nomination.pdf',
      verifiedBy: 'Kavita Sharma',
      verifiedOn: '2024-01-11'
    },
    {
      id: 'STAT003',
      documentType: 'ESI Documents',
      formNumber: 'ESIC Form',
      documentName: 'ESI Registration & Nomination',
      esicNumber: '1234567890123456',
      uploadedOn: '2024-01-10',
      status: 'verified',
      fileSize: '212 KB',
      fileName: 'esic_registration.pdf',
      verifiedBy: 'Kavita Sharma',
      verifiedOn: '2024-01-11'
    },
    {
      id: 'STAT004',
      documentType: 'Bank Documents',
      formNumber: 'Salary Account',
      documentName: 'Bank Account Details & Cancelled Cheque',
      uploadedOn: '2024-01-10',
      status: 'verified',
      fileSize: '156 KB',
      fileName: 'bank_cancelled_cheque.pdf',
      verifiedBy: 'Kavita Sharma',
      verifiedOn: '2024-01-11'
    },
    {
      id: 'STAT005',
      documentType: 'Professional Tax',
      formNumber: 'PT Enrollment',
      documentName: 'Professional Tax Registration',
      uploadedOn: '2024-01-15',
      status: 'pending',
      fileSize: '178 KB',
      fileName: 'pt_registration.pdf'
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
    rejected: mockDocuments.filter(d => d.status === 'rejected').length
  };

  const statusColors = {
    verified: 'bg-green-100 text-green-700',
    pending: 'bg-yellow-100 text-yellow-700',
    rejected: 'bg-red-100 text-red-700'
  };

  const statusIcons = {
    verified: CheckCircle,
    pending: Clock,
    rejected: XCircle
  };

  return (
    <div className="w-full h-full px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Statutory Documents</h1>
        <p className="text-sm text-gray-600 mt-1">Manage PF, ESI, and other statutory compliance documents</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-lg p-4 border border-teal-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-teal-600">Total Documents</p>
              <p className="text-2xl font-bold text-teal-900 mt-1">{stats.total}</p>
            </div>
            <FileCheck className="h-8 w-8 text-teal-600" />
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

        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4 border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-600">Rejected</p>
              <p className="text-2xl font-bold text-red-900 mt-1">{stats.rejected}</p>
            </div>
            <XCircle className="h-8 w-8 text-red-600" />
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="all">All Status</option>
              <option value="verified">Verified</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <div className="flex items-end">
            <button className="w-full md:w-auto px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-medium flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Upload New
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredDocuments.map(doc => {
          const StatusIcon = statusIcons[doc.status];

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
                  </div>
                  <p className="text-md font-semibold text-gray-800">{doc.documentName}</p>
                  <p className="text-sm text-gray-600 mt-1">{doc.fileName} • {doc.fileSize}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase font-medium mb-1">Form Number</p>
                  <p className="text-sm font-semibold text-gray-900">{doc.formNumber}</p>
                </div>
                {doc.uanNumber && (
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-medium mb-1">UAN Number</p>
                    <p className="text-sm font-semibold text-teal-600">{doc.uanNumber}</p>
                  </div>
                )}
                {doc.esicNumber && (
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-medium mb-1">ESIC Number</p>
                    <p className="text-sm font-semibold text-teal-600">{doc.esicNumber}</p>
                  </div>
                )}
                <div>
                  <p className="text-xs text-gray-500 uppercase font-medium mb-1">Uploaded On</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {new Date(doc.uploadedOn).toLocaleDateString('en-IN')}
                  </p>
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
                <button className="flex items-center gap-2 px-4 py-2 text-teal-600 hover:bg-teal-50 rounded-lg font-medium text-sm">
                  <Eye className="h-4 w-4" />
                  View
                </button>
                <button className="flex items-center gap-2 px-4 py-2 text-teal-600 hover:bg-teal-50 rounded-lg font-medium text-sm">
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
          <FileCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No documents found</h3>
          <p className="text-gray-600">No documents match the selected filters</p>
        </div>
      )}

      <div className="bg-teal-50 border border-teal-200 rounded-lg p-4 mt-6">
        <h3 className="font-semibold text-teal-900 mb-2 flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          Statutory Document Requirements
        </h3>
        <ul className="text-sm text-teal-800 space-y-1 ml-7">
          <li>• <strong>PF Form 11</strong>: EPF member declaration form (mandatory for all employees)</li>
          <li>• <strong>PF Form 2</strong>: EPF & EPS nomination form</li>
          <li>• <strong>ESIC Form</strong>: ESI registration and nomination (for employees earning below ₹21,000/month)</li>
          <li>• <strong>Bank Details</strong>: Cancelled cheque or bank passbook first page</li>
          <li>• <strong>Professional Tax</strong>: PT enrollment certificate (state-specific)</li>
          <li>• All forms must be signed by employee with date</li>
          <li>• UAN and ESIC numbers must be accurate and verified</li>
          <li>• Upload documents in PDF format (Max size: 2MB per file)</li>
        </ul>
      </div>
    </div>
  );
}

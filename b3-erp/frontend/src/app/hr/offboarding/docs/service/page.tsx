'use client';

import { useState, useMemo } from 'react';
import { File, CheckCircle, Clock, Download, Send, FileText } from 'lucide-react';

interface ServiceCertificate {
  id: string;
  employeeId: string;
  employeeName: string;
  designation: string;
  department: string;
  joiningDate: string;
  lastWorkingDay: string;
  serviceRecord: {
    conduct: 'excellent' | 'good' | 'satisfactory';
    performance: 'excellent' | 'good' | 'satisfactory';
    attendance: 'excellent' | 'good' | 'satisfactory';
  };
  status: 'pending' | 'generated' | 'approved' | 'issued';
  generatedBy?: string;
  generatedOn?: string;
  approvedBy?: string;
  issuedOn?: string;
  certificateNumber?: string;
}

export default function ServiceCertificatePage() {
  const [selectedTab, setSelectedTab] = useState<'pending' | 'generated' | 'approved' | 'issued'>('pending');

  const mockCertificates: ServiceCertificate[] = [
    {
      id: 'SVC-001',
      employeeId: 'EMP001',
      employeeName: 'Rahul Sharma',
      designation: 'Senior Software Engineer',
      department: 'Engineering',
      joiningDate: '2020-01-15',
      lastWorkingDay: '2025-12-14',
      serviceRecord: {
        conduct: 'excellent',
        performance: 'excellent',
        attendance: 'good'
      },
      status: 'generated',
      generatedBy: 'Priya Singh - HR Manager',
      generatedOn: '2025-12-14',
      certificateNumber: 'SVC/2025/001'
    },
    {
      id: 'SVC-002',
      employeeId: 'EMP002',
      employeeName: 'Priya Singh',
      designation: 'Marketing Manager',
      department: 'Marketing',
      joiningDate: '2016-06-10',
      lastWorkingDay: '2025-11-30',
      serviceRecord: {
        conduct: 'excellent',
        performance: 'excellent',
        attendance: 'excellent'
      },
      status: 'issued',
      generatedBy: 'Amit Kumar - HR Head',
      generatedOn: '2025-11-30',
      approvedBy: 'Rajesh Patel - CEO',
      issuedOn: '2025-12-01',
      certificateNumber: 'SVC/2025/002'
    },
    {
      id: 'SVC-003',
      employeeId: 'EMP003',
      employeeName: 'Amit Kumar',
      designation: 'Product Manager',
      department: 'Product',
      joiningDate: '2010-03-20',
      lastWorkingDay: '2025-10-31',
      serviceRecord: {
        conduct: 'excellent',
        performance: 'excellent',
        attendance: 'excellent'
      },
      status: 'issued',
      generatedBy: 'Priya Singh - HR Manager',
      generatedOn: '2025-10-31',
      approvedBy: 'Rajesh Patel - CEO',
      issuedOn: '2025-11-05',
      certificateNumber: 'SVC/2025/003'
    }
  ];

  const filteredCertificates = useMemo(() => {
    return mockCertificates.filter(cert => cert.status === selectedTab);
  }, [selectedTab]);

  const stats = {
    pending: mockCertificates.filter(c => c.status === 'pending').length,
    generated: mockCertificates.filter(c => c.status === 'generated').length,
    approved: mockCertificates.filter(c => c.status === 'approved').length,
    issued: mockCertificates.filter(c => c.status === 'issued').length
  };

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-700',
    generated: 'bg-blue-100 text-blue-700',
    approved: 'bg-green-100 text-green-700',
    issued: 'bg-gray-100 text-gray-700'
  };

  const statusIcons = {
    pending: <Clock className="h-4 w-4" />,
    generated: <FileText className="h-4 w-4" />,
    approved: <CheckCircle className="h-4 w-4" />,
    issued: <CheckCircle className="h-4 w-4" />
  };

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case 'excellent': return 'text-green-600';
      case 'good': return 'text-blue-600';
      case 'satisfactory': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="w-full h-full px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Exit Documents - Service Certificate</h1>
        <p className="text-sm text-gray-600 mt-1">Generate and issue service certificates for exiting employees</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4 border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-900 mt-1">{stats.pending}</p>
            </div>
            <Clock className="h-8 w-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Generated</p>
              <p className="text-2xl font-bold text-blue-900 mt-1">{stats.generated}</p>
            </div>
            <FileText className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Approved</p>
              <p className="text-2xl font-bold text-green-900 mt-1">{stats.approved}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Issued</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.issued}</p>
            </div>
            <File className="h-8 w-8 text-gray-600" />
          </div>
        </div>
      </div>

      <div className="mb-4 flex gap-2">
        {(['pending', 'generated', 'approved', 'issued'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setSelectedTab(tab)}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
              selectedTab === tab
                ? tab === 'pending' ? 'bg-yellow-600 text-white' :
                  tab === 'generated' ? 'bg-blue-600 text-white' :
                  tab === 'approved' ? 'bg-green-600 text-white' :
                  'bg-gray-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)} ({stats[tab]})
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filteredCertificates.map(certificate => (
          <div key={certificate.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-bold text-gray-900">{certificate.employeeName}</h3>
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusColors[certificate.status]}`}>
                    <span className="inline-flex items-center gap-1">
                      {statusIcons[certificate.status]}
                      {certificate.status.toUpperCase()}
                    </span>
                  </span>
                </div>
                <p className="text-sm text-gray-600">{certificate.designation} • {certificate.department}</p>
                {certificate.certificateNumber && (
                  <p className="text-xs text-gray-500 mt-1">Certificate No: {certificate.certificateNumber}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Service Period</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Joining Date</span>
                    <span className="font-medium text-gray-900">
                      {new Date(certificate.joiningDate).toLocaleDateString('en-IN')}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Last Working Day</span>
                    <span className="font-medium text-gray-900">
                      {new Date(certificate.lastWorkingDay).toLocaleDateString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Service Record</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Conduct</span>
                    <span className={`font-semibold capitalize ${getRatingColor(certificate.serviceRecord.conduct)}`}>
                      {certificate.serviceRecord.conduct}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Performance</span>
                    <span className={`font-semibold capitalize ${getRatingColor(certificate.serviceRecord.performance)}`}>
                      {certificate.serviceRecord.performance}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Attendance</span>
                    <span className={`font-semibold capitalize ${getRatingColor(certificate.serviceRecord.attendance)}`}>
                      {certificate.serviceRecord.attendance}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {certificate.generatedBy && (
              <div className="mt-4 pt-4 border-t border-gray-200 text-xs text-gray-500">
                <p>Generated by: {certificate.generatedBy} on {certificate.generatedOn && new Date(certificate.generatedOn).toLocaleDateString('en-IN')}</p>
                {certificate.approvedBy && (
                  <p>Approved by: {certificate.approvedBy}</p>
                )}
                {certificate.issuedOn && (
                  <p>Issued on: {new Date(certificate.issuedOn).toLocaleDateString('en-IN')}</p>
                )}
              </div>
            )}

            <div className="flex gap-2 mt-4">
              {certificate.status === 'pending' && (
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm">
                  <FileText className="inline h-4 w-4 mr-2" />
                  Generate Certificate
                </button>
              )}
              {certificate.status === 'generated' && (
                <>
                  <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium text-sm">
                    <CheckCircle className="inline h-4 w-4 mr-2" />
                    Approve & Issue
                  </button>
                  <button className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg font-medium text-sm border border-gray-300">
                    <Download className="inline h-4 w-4 mr-2" />
                    Preview
                  </button>
                </>
              )}
              {certificate.status === 'approved' && (
                <>
                  <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium text-sm">
                    <Send className="inline h-4 w-4 mr-2" />
                    Issue to Employee
                  </button>
                  <button className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg font-medium text-sm border border-gray-300">
                    <Download className="inline h-4 w-4 mr-2" />
                    Download
                  </button>
                </>
              )}
              {certificate.status === 'issued' && (
                <>
                  <button className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg font-medium text-sm border border-gray-300">
                    <Download className="inline h-4 w-4 mr-2" />
                    Download
                  </button>
                  <button className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg font-medium text-sm border border-gray-300">
                    <Send className="inline h-4 w-4 mr-2" />
                    Resend to Employee
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

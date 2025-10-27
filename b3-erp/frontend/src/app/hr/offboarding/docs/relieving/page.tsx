'use client';

import { useState, useMemo } from 'react';
import { FileText, CheckCircle, Clock, Download, Send } from 'lucide-react';

interface RelievingLetter {
  id: string;
  employeeId: string;
  employeeName: string;
  designation: string;
  department: string;
  joiningDate: string;
  lastWorkingDay: string;
  resignationAcceptedOn: string;
  noticePeriod: number;
  noticePeriodServed: number;
  clearanceCompleted: boolean;
  status: 'pending' | 'generated' | 'approved' | 'issued';
  generatedBy?: string;
  generatedOn?: string;
  approvedBy?: string;
  issuedOn?: string;
  letterNumber?: string;
}

export default function RelievingLetterPage() {
  const [selectedTab, setSelectedTab] = useState<'pending' | 'generated' | 'approved' | 'issued'>('pending');

  const mockLetters: RelievingLetter[] = [
    {
      id: 'REL-001',
      employeeId: 'EMP001',
      employeeName: 'Rahul Sharma',
      designation: 'Senior Software Engineer',
      department: 'Engineering',
      joiningDate: '2020-01-15',
      lastWorkingDay: '2025-12-14',
      resignationAcceptedOn: '2025-10-14',
      noticePeriod: 60,
      noticePeriodServed: 60,
      clearanceCompleted: true,
      status: 'generated',
      generatedBy: 'Priya Singh - HR Manager',
      generatedOn: '2025-12-14',
      letterNumber: 'REL/2025/001'
    },
    {
      id: 'REL-002',
      employeeId: 'EMP002',
      employeeName: 'Priya Singh',
      designation: 'Marketing Manager',
      department: 'Marketing',
      joiningDate: '2016-06-10',
      lastWorkingDay: '2025-11-30',
      resignationAcceptedOn: '2025-09-30',
      noticePeriod: 60,
      noticePeriodServed: 60,
      clearanceCompleted: true,
      status: 'issued',
      generatedBy: 'Amit Kumar - HR Head',
      generatedOn: '2025-11-30',
      approvedBy: 'Rajesh Patel - CEO',
      issuedOn: '2025-12-01',
      letterNumber: 'REL/2025/002'
    },
    {
      id: 'REL-003',
      employeeId: 'EMP003',
      employeeName: 'Amit Kumar',
      designation: 'Product Manager',
      department: 'Product',
      joiningDate: '2010-03-20',
      lastWorkingDay: '2025-10-31',
      resignationAcceptedOn: '2025-08-31',
      noticePeriod: 90,
      noticePeriodServed: 90,
      clearanceCompleted: true,
      status: 'issued',
      generatedBy: 'Priya Singh - HR Manager',
      generatedOn: '2025-10-31',
      approvedBy: 'Rajesh Patel - CEO',
      issuedOn: '2025-11-05',
      letterNumber: 'REL/2025/003'
    }
  ];

  const filteredLetters = useMemo(() => {
    return mockLetters.filter(letter => letter.status === selectedTab);
  }, [selectedTab]);

  const stats = {
    pending: mockLetters.filter(l => l.status === 'pending').length,
    generated: mockLetters.filter(l => l.status === 'generated').length,
    approved: mockLetters.filter(l => l.status === 'approved').length,
    issued: mockLetters.filter(l => l.status === 'issued').length
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

  return (
    <div className="w-full h-full px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Exit Documents - Relieving Letter</h1>
        <p className="text-sm text-gray-600 mt-1">Generate and issue relieving letters for exiting employees</p>
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
            <CheckCircle className="h-8 w-8 text-gray-600" />
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
        {filteredLetters.map(letter => (
          <div key={letter.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-bold text-gray-900">{letter.employeeName}</h3>
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusColors[letter.status]}`}>
                    <span className="inline-flex items-center gap-1">
                      {statusIcons[letter.status]}
                      {letter.status.toUpperCase()}
                    </span>
                  </span>
                  {letter.clearanceCompleted && (
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700">
                      CLEARANCE COMPLETED
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600">{letter.designation} • {letter.department}</p>
                {letter.letterNumber && (
                  <p className="text-xs text-gray-500 mt-1">Letter No: {letter.letterNumber}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Employment Period</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Joining Date</span>
                    <span className="font-medium text-gray-900">
                      {new Date(letter.joiningDate).toLocaleDateString('en-IN')}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Last Working Day</span>
                    <span className="font-medium text-gray-900">
                      {new Date(letter.lastWorkingDay).toLocaleDateString('en-IN')}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Resignation Accepted On</span>
                    <span className="font-medium text-gray-900">
                      {new Date(letter.resignationAcceptedOn).toLocaleDateString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Notice Period</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Notice Period</span>
                    <span className="font-medium text-gray-900">{letter.noticePeriod} days</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Notice Period Served</span>
                    <span className="font-medium text-gray-900">{letter.noticePeriodServed} days</span>
                  </div>
                  <div className="flex justify-between text-sm pt-2 border-t border-gray-200">
                    <span className="font-semibold text-gray-900">Status</span>
                    <span className={`font-bold ${
                      letter.noticePeriodServed >= letter.noticePeriod ? 'text-green-600' : 'text-yellow-600'
                    }`}>
                      {letter.noticePeriodServed >= letter.noticePeriod ? 'Completed' : 'Partial'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {letter.generatedBy && (
              <div className="mt-4 pt-4 border-t border-gray-200 text-xs text-gray-500">
                <p>Generated by: {letter.generatedBy} on {letter.generatedOn && new Date(letter.generatedOn).toLocaleDateString('en-IN')}</p>
                {letter.approvedBy && (
                  <p>Approved by: {letter.approvedBy}</p>
                )}
                {letter.issuedOn && (
                  <p>Issued on: {new Date(letter.issuedOn).toLocaleDateString('en-IN')}</p>
                )}
              </div>
            )}

            <div className="flex gap-2 mt-4">
              {letter.status === 'pending' && (
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm">
                  <FileText className="inline h-4 w-4 mr-2" />
                  Generate Letter
                </button>
              )}
              {letter.status === 'generated' && (
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
              {letter.status === 'approved' && (
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
              {letter.status === 'issued' && (
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

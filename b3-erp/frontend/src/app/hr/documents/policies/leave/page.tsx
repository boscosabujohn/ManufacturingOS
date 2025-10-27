'use client';

import { Calendar, Download, Eye, FileText } from 'lucide-react';

export default function LeavePolicyPage() {
  const policyTopics = [
    { id: 1, title: 'Types of Leave', description: 'Privilege Leave, Sick Leave, Casual Leave, Maternity/Paternity Leave' },
    { id: 2, title: 'Leave Accrual & Eligibility', description: 'Monthly accrual rates and eligibility criteria' },
    { id: 3, title: 'Leave Application Process', description: 'How to apply for leave and approval workflow' },
    { id: 4, title: 'Leave Encashment', description: 'Rules for encashing unused leave' },
    { id: 5, title: 'Public Holidays', description: 'List of company-recognized public holidays' },
    { id: 6, title: 'Compensatory Off', description: 'Comp-off policy for working on holidays/weekends' }
  ];

  return (
    <div className="w-full h-full px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Leave Policy</h1>
        <p className="text-sm text-gray-600 mt-1">Company leave guidelines and entitlements</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Policy Version</p>
              <p className="text-2xl font-bold text-green-900 mt-1">v3.1</p>
            </div>
            <Calendar className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Last Updated</p>
              <p className="text-2xl font-bold text-blue-900 mt-1">Dec 2024</p>
            </div>
            <FileText className="h-8 w-8 text-blue-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Download Policy Document</h2>
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium flex items-center gap-2">
            <Download className="h-4 w-4" />
            Download PDF
          </button>
        </div>
        <p className="text-sm text-gray-600">Leave Policy v3.1 - Complete guidelines (PDF, 850 KB)</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Policy Topics</h2>
        <div className="space-y-3">
          {policyTopics.map((topic) => (
            <div key={topic.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-colors">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{topic.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{topic.description}</p>
              </div>
              <button className="ml-4 px-4 py-2 text-green-600 hover:bg-green-100 rounded-lg font-medium text-sm flex items-center gap-2">
                <Eye className="h-4 w-4" />
                View
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

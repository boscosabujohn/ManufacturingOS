'use client';

import { Clock, Download, Eye, FileText } from 'lucide-react';

export default function AttendancePolicyPage() {
  const policyTopics = [
    { id: 1, title: 'Working Hours', description: 'Standard working hours and flexible timing policy' },
    { id: 2, title: 'Attendance Marking', description: 'Biometric/online attendance system guidelines' },
    { id: 3, title: 'Late Coming & Early Leaving', description: 'Grace period and deduction rules' },
    { id: 4, title: 'Work From Home Policy', description: 'Remote work guidelines and eligibility' },
    { id: 5, title: 'Overtime Policy', description: 'Overtime calculation and compensation' },
    { id: 6, title: 'Shift Schedules', description: 'Shift timings and rotation policy' }
  ];

  return (
    <div className="w-full h-full px-3 py-2">
      <div className="mb-3">
        <h1 className="text-2xl font-bold text-gray-900">Attendance Policy</h1>
        <p className="text-sm text-gray-600 mt-1">Working hours and attendance guidelines</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
        <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg p-3 border border-indigo-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-indigo-600">Policy Version</p>
              <p className="text-2xl font-bold text-indigo-900 mt-1">v2.5</p>
            </div>
            <Clock className="h-8 w-8 text-indigo-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-3 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Last Updated</p>
              <p className="text-2xl font-bold text-blue-900 mt-1">Nov 2024</p>
            </div>
            <FileText className="h-8 w-8 text-blue-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 mb-3">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold text-gray-900">Download Policy Document</h2>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium flex items-center gap-2">
            <Download className="h-4 w-4" />
            Download PDF
          </button>
        </div>
        <p className="text-sm text-gray-600">Attendance Policy v2.5 - Complete guidelines (PDF, 650 KB)</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Policy Topics</h2>
        <div className="space-y-3">
          {policyTopics.map((topic) => (
            <div key={topic.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-colors">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{topic.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{topic.description}</p>
              </div>
              <button className="ml-4 px-4 py-2 text-indigo-600 hover:bg-indigo-100 rounded-lg font-medium text-sm flex items-center gap-2">
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

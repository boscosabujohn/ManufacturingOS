'use client';

import { Book, Download, Eye, FileText, CheckCircle } from 'lucide-react';

export default function EmployeeHandbookPage() {
  const handbookSections = [
    { id: 1, title: 'Welcome & Introduction', pages: '1-5', lastUpdated: '2025-01-15' },
    { id: 2, title: 'Company Overview & Values', pages: '6-12', lastUpdated: '2025-01-15' },
    { id: 3, title: 'Employment Basics', pages: '13-20', lastUpdated: '2025-01-15' },
    { id: 4, title: 'Working Hours & Attendance', pages: '21-28', lastUpdated: '2025-01-15' },
    { id: 5, title: 'Leave & Holidays', pages: '29-38', lastUpdated: '2025-01-15' },
    { id: 6, title: 'Compensation & Benefits', pages: '39-50', lastUpdated: '2025-01-15' },
    { id: 7, title: 'Code of Conduct', pages: '51-62', lastUpdated: '2025-01-15' },
    { id: 8, title: 'Health & Safety', pages: '63-70', lastUpdated: '2025-01-15' },
    { id: 9, title: 'IT & Data Security', pages: '71-78', lastUpdated: '2025-01-15' },
    { id: 10, title: 'Grievance Redressal', pages: '79-85', lastUpdated: '2025-01-15' },
    { id: 11, title: 'Disciplinary Procedures', pages: '86-92', lastUpdated: '2025-01-15' },
    { id: 12, title: 'Termination & Resignation', pages: '93-100', lastUpdated: '2025-01-15' }
  ];

  return (
    <div className="w-full h-full px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Employee Handbook</h1>
        <p className="text-sm text-gray-600 mt-1">Complete guide to company policies and procedures</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Current Version</p>
              <p className="text-2xl font-bold text-blue-900 mt-1">v5.2</p>
            </div>
            <Book className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Total Pages</p>
              <p className="text-2xl font-bold text-green-900 mt-1">100</p>
            </div>
            <FileText className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">Last Updated</p>
              <p className="text-2xl font-bold text-purple-900 mt-1">Jan 2025</p>
            </div>
            <CheckCircle className="h-8 w-8 text-purple-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Download Full Handbook</h2>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2">
            <Download className="h-4 w-4" />
            Download PDF
          </button>
        </div>
        <p className="text-sm text-gray-600">
          Employee Handbook v5.2 - Complete 100-page guide (PDF, 4.5 MB)
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Handbook Sections</h2>
        <div className="space-y-3">
          {handbookSections.map((section) => (
            <div key={section.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{section.title}</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Pages {section.pages} • Last updated: {new Date(section.lastUpdated).toLocaleDateString('en-IN')}
                </p>
              </div>
              <button className="ml-4 px-4 py-2 text-blue-600 hover:bg-blue-100 rounded-lg font-medium text-sm flex items-center gap-2">
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

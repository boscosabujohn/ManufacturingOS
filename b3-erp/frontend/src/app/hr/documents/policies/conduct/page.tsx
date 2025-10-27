'use client';

import { Scale, Download, Eye, FileText } from 'lucide-react';

export default function ConductPolicyPage() {
  const policyTopics = [
    { id: 1, title: 'Professional Behavior', description: 'Expected standards of workplace conduct' },
    { id: 2, title: 'Dress Code', description: 'Professional attire guidelines' },
    { id: 3, title: 'Anti-Harassment Policy', description: 'Zero tolerance for harassment of any kind' },
    { id: 4, title: 'Conflict of Interest', description: 'Guidelines for avoiding conflicts' },
    { id: 5, title: 'Confidentiality & Data Protection', description: 'Handling company and client information' },
    { id: 6, title: 'Social Media Policy', description: 'Guidelines for online presence' },
    { id: 7, title: 'Substance Abuse Policy', description: 'Workplace substance-free policy' },
    { id: 8, title: 'Disciplinary Actions', description: 'Consequences for policy violations' }
  ];

  return (
    <div className="w-full h-full px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Code of Conduct</h1>
        <p className="text-sm text-gray-600 mt-1">Workplace behavior and ethical guidelines</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">Policy Version</p>
              <p className="text-2xl font-bold text-purple-900 mt-1">v6.0</p>
            </div>
            <Scale className="h-8 w-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Last Updated</p>
              <p className="text-2xl font-bold text-blue-900 mt-1">Jan 2025</p>
            </div>
            <FileText className="h-8 w-8 text-blue-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Download Policy Document</h2>
          <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium flex items-center gap-2">
            <Download className="h-4 w-4" />
            Download PDF
          </button>
        </div>
        <p className="text-sm text-gray-600">Code of Conduct v6.0 - Complete guidelines (PDF, 2.1 MB)</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Policy Topics</h2>
        <div className="space-y-3">
          {policyTopics.map((topic) => (
            <div key={topic.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-colors">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{topic.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{topic.description}</p>
              </div>
              <button className="ml-4 px-4 py-2 text-purple-600 hover:bg-purple-100 rounded-lg font-medium text-sm flex items-center gap-2">
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

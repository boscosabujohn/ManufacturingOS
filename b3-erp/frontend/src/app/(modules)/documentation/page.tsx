'use client';

import { useState } from 'react';
import Link from 'next/link';
import { BookOpen, FileText, Search, ChevronRight, Download } from 'lucide-react';

const documentSections = [
  {
    category: 'Getting Started',
    docs: [
      { title: 'System Overview', pages: 12, href: '/documentation/system-overview' },
      { title: 'Quick Start Guide', pages: 8, href: '/documentation/quick-start' },
      { title: 'User Interface Navigation', pages: 15, href: '/documentation/ui-navigation' },
    ],
  },
  {
    category: 'Modules',
    docs: [
      { title: 'CRM Module Documentation', pages: 45, href: '/documentation/crm' },
      { title: 'Sales & Estimation', pages: 38, href: '/documentation/sales' },
      { title: 'Production Management', pages: 52, href: '/documentation/production' },
      { title: 'Inventory & Warehouse', pages: 40, href: '/documentation/inventory' },
      { title: 'Finance & Accounting', pages: 48, href: '/documentation/finance' },
      { title: 'HR Management', pages: 35, href: '/documentation/hr' },
    ],
  },
  {
    category: 'Administration',
    docs: [
      { title: 'User Management', pages: 20, href: '/documentation/user-management' },
      { title: 'System Configuration', pages: 25, href: '/documentation/system-config' },
      { title: 'Security & Permissions', pages: 18, href: '/documentation/security' },
      { title: 'Data Backup & Recovery', pages: 15, href: '/documentation/backup' },
    ],
  },
  {
    category: 'Integration',
    docs: [
      { title: 'API Documentation', pages: 60, href: '/documentation/api' },
      { title: 'Third-Party Integrations', pages: 30, href: '/documentation/integrations' },
      { title: 'Import/Export Guide', pages: 22, href: '/documentation/import-export' },
    ],
  },
];

export default function DocumentationPage() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BookOpen className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Documentation</h1>
              <p className="text-gray-600">Complete guides and references for OptiForge ERP</p>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search documentation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Quick Access Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-2">Latest Version</h3>
            <p className="text-2xl font-bold text-blue-600 mb-2">v2.5.0</p>
            <p className="text-sm text-gray-600">Released: October 2025</p>
          </div>

          <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-2">Total Pages</h3>
            <p className="text-2xl font-bold text-green-600 mb-2">483</p>
            <p className="text-sm text-gray-600">Comprehensive coverage</p>
          </div>

          <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-2">Download PDF</h3>
            <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700">
              <Download className="w-4 h-4" />
              Full Documentation
            </button>
          </div>
        </div>

        {/* Documentation Sections */}
        <div className="space-y-8">
          {documentSections.map((section, index) => (
            <div key={index}>
              <h2 className="text-xl font-bold text-gray-900 mb-4">{section.category}</h2>
              <div className="bg-white rounded-lg shadow border border-gray-200 divide-y divide-gray-200">
                {section.docs.map((doc, docIndex) => (
                  <Link
                    key={docIndex}
                    href={doc.href}
                    className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-blue-600" />
                      <div>
                        <h4 className="font-medium text-gray-900">{doc.title}</h4>
                        <p className="text-sm text-gray-500">{doc.pages} pages</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Help Section */}
        <div className="mt-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-lg p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-2">Need Additional Help?</h3>
          <p className="mb-6">Visit our help center or contact support for personalized assistance</p>
          <Link
            href="/help"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
          >
            Visit Help Center
          </Link>
        </div>
      </div>
    </div>
  );
}

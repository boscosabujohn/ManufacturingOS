'use client';

import { useState } from 'react';
import { Search, File, Download, Eye, Filter } from 'lucide-react';

export default function SearchRepositoryPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const searchResults = [
    { id: 1, name: 'Leave_Policy_v3.1.pdf', path: 'HR Policies', size: '850 KB', type: 'PDF', lastModified: '2024-12-20', relevance: 95 },
    { id: 2, name: 'Leave_Application_Form.docx', path: 'Templates/Forms', size: '120 KB', type: 'DOCX', lastModified: '2024-11-15', relevance: 88 },
    { id: 3, name: 'Leave_Encashment_Rules.pdf', path: 'HR Policies/Leave', size: '420 KB', type: 'PDF', lastModified: '2024-10-30', relevance: 82 }
  ];

  return (
    <div className="w-full h-full px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Search Repository</h1>
        <p className="text-sm text-gray-600 mt-1">Search for documents across the repository</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search documents by name, content, or tags..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
            Search
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filters
          </button>
        </div>

        <div className="mt-4 flex gap-2">
          <button className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200">All Types</button>
          <button className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200">PDF</button>
          <button className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200">Word</button>
          <button className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200">Excel</button>
          <button className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200">Last 30 days</button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Search Results</h2>
          <span className="text-sm text-gray-600">{searchResults.length} results found</span>
        </div>

        <div className="space-y-3">
          {searchResults.map((result) => (
            <div key={result.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors">
              <div className="flex items-center gap-3 flex-1">
                <File className="h-6 w-6 text-blue-600" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">{result.name}</h3>
                  <p className="text-sm text-gray-600">{result.path} • {result.size} • {result.type}</p>
                  <p className="text-xs text-gray-500 mt-1">Modified: {new Date(result.lastModified).toLocaleDateString('en-IN')} • Relevance: {result.relevance}%</p>
                </div>
              </div>
              <div className="flex gap-2 ml-4">
                <button className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg">
                  <Eye className="h-4 w-4" />
                </button>
                <button className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg">
                  <Download className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

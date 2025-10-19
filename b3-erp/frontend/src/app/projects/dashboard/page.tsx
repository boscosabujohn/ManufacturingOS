'use client';

import { useState } from 'react';
import { LayoutDashboard, Search, Filter, FolderKanban, TrendingUp, AlertCircle, Clock, CheckCircle2 } from 'lucide-react';

export default function ProjectsDashboardPage() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          <LayoutDashboard className="h-8 w-8 text-teal-600" />
          Projects Dashboard
        </h1>
        <p className="text-gray-600 mt-2">Overview of all projects and key metrics</p>
      </div>

      {/* Action Bar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
              <Filter className="h-4 w-4" />
              Filter
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-lg p-6 border border-teal-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-teal-600 text-sm font-medium">Total Projects</p>
              <p className="text-3xl font-bold text-teal-900 mt-1">48</p>
            </div>
            <FolderKanban className="h-12 w-12 text-teal-600 opacity-50" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">Active</p>
              <p className="text-3xl font-bold text-green-900 mt-1">32</p>
            </div>
            <TrendingUp className="h-12 w-12 text-green-600 opacity-50" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-6 border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-600 text-sm font-medium">At Risk</p>
              <p className="text-3xl font-bold text-yellow-900 mt-1">8</p>
            </div>
            <AlertCircle className="h-12 w-12 text-yellow-600 opacity-50" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">Completed</p>
              <p className="text-3xl font-bold text-blue-900 mt-1">8</p>
            </div>
            <CheckCircle2 className="h-12 w-12 text-blue-600 opacity-50" />
          </div>
        </div>
      </div>

      {/* Content placeholder */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="text-center text-gray-500">
          <FolderKanban className="h-16 w-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Projects Overview</h3>
          <p className="text-gray-600">Project portfolio dashboard with charts, timelines, and key metrics</p>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { PlusCircle, FolderPlus, Save, X } from 'lucide-react';

export default function CreateProjectPage() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          <PlusCircle className="h-8 w-8 text-teal-600" />
          Create Project
        </h1>
        <p className="text-gray-600 mt-2">Initialize a new project</p>
      </div>

      {/* Action Bar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex gap-2 justify-end">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
            <X className="h-4 w-4" />
            Cancel
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700">
            <Save className="h-4 w-4" />
            Create Project
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-lg p-6 border border-teal-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-teal-600 text-sm font-medium">Active Templates</p>
              <p className="text-3xl font-bold text-teal-900 mt-1">12</p>
            </div>
            <FolderPlus className="h-12 w-12 text-teal-600 opacity-50" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">Project Types</p>
              <p className="text-3xl font-bold text-blue-900 mt-1">8</p>
            </div>
            <FolderPlus className="h-12 w-12 text-blue-600 opacity-50" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 text-sm font-medium">Recent Projects</p>
              <p className="text-3xl font-bold text-purple-900 mt-1">32</p>
            </div>
            <FolderPlus className="h-12 w-12 text-purple-600 opacity-50" />
          </div>
        </div>
      </div>

      {/* Content placeholder */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="text-center text-gray-500">
          <PlusCircle className="h-16 w-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Project Creation Form</h3>
          <p className="text-gray-600">Project details, objectives, scope, and team setup will be configured here</p>
        </div>
      </div>
    </div>
  );
}

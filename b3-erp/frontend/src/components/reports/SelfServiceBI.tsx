'use client'
import { useState } from 'react'
import { BarChart3, TrendingUp, Filter, Download, Share2 } from 'lucide-react'

export default function SelfServiceBI() {
  return (
    <div className="space-y-6">
      <div className="bg-white shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
          <BarChart3 className="h-8 w-8 text-blue-600" />
          Self-Service BI
        </h2>
        <p className="text-gray-600 mt-1">Drag-and-drop report builder with no-code analytics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white shadow-lg border border-gray-200 rounded-lg p-6">
          <BarChart3 className="h-8 w-8 text-blue-600 mb-3" />
          <div className="text-3xl font-bold text-gray-900 mb-1">156</div>
          <div className="text-sm text-gray-600">Custom Reports</div>
        </div>
        <div className="bg-white shadow-lg border border-gray-200 rounded-lg p-6">
          <TrendingUp className="h-8 w-8 text-green-600 mb-3" />
          <div className="text-3xl font-bold text-green-600 mb-1">2,345</div>
          <div className="text-sm text-gray-600">Report Views</div>
        </div>
        <div className="bg-white shadow-lg border border-gray-200 rounded-lg p-6">
          <Filter className="h-8 w-8 text-purple-600 mb-3" />
          <div className="text-3xl font-bold text-purple-600 mb-1">89</div>
          <div className="text-sm text-gray-600">Saved Filters</div>
        </div>
        <div className="bg-white shadow-lg border border-gray-200 rounded-lg p-6">
          <Share2 className="h-8 w-8 text-orange-600 mb-3" />
          <div className="text-3xl font-bold text-orange-600 mb-1">234</div>
          <div className="text-sm text-gray-600">Shared Reports</div>
        </div>
      </div>

      <div className="bg-white shadow-lg border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Report Builder</h3>
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-lg border-2 border-dashed border-blue-300">
          <div className="text-center">
            <BarChart3 className="h-16 w-16 text-blue-600 mx-auto mb-4" />
            <h4 className="text-xl font-bold text-gray-900 mb-2">Drag & Drop Report Builder</h4>
            <p className="text-gray-600 mb-4">Create custom reports with no SQL required - just drag dimensions and measures</p>
            <div className="flex justify-center gap-4">
              <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Start Building</button>
              <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">Use Template</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import { Network, ZoomIn, ZoomOut, Download, Maximize2 } from 'lucide-react';

export default function OrgChartPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          <Network className="h-8 w-8 text-blue-600" />
          Organization Chart
        </h1>
        <p className="text-gray-600 mt-2">Visual hierarchy of company structure</p>
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200">
              <ZoomIn className="h-4 w-4" />
              Zoom In
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200">
              <ZoomOut className="h-4 w-4" />
              Zoom Out
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200">
              <Maximize2 className="h-4 w-4" />
              Full Screen
            </button>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Download className="h-4 w-4" />
            Export Chart
          </button>
        </div>
      </div>

      {/* Org Chart Container */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="text-center">
          <Network className="h-32 w-32 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Organization Chart</h3>
          <p className="text-gray-600">Interactive organization hierarchy will be displayed here</p>
          <p className="text-sm text-gray-500 mt-2">Use zoom controls to navigate the chart</p>
        </div>
      </div>
    </div>
  );
}

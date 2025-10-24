'use client'
import { MousePointer, Layers, ZoomIn } from 'lucide-react'
export default function DrillThroughAnalysis() {
  return (
    <div className="space-y-6">
      <div className="bg-white shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
          <Layers className="h-8 w-8 text-purple-600" />
          Drill-Through Analysis
        </h2>
        <p className="text-gray-600 mt-1">Interactive data exploration with hierarchical drill-down</p>
      </div>
      <div className="bg-white shadow-lg border border-gray-200 rounded-lg p-6">
        <div className="text-center py-12">
          <ZoomIn className="h-16 w-16 text-purple-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">Click any data point to drill deeper</h3>
          <p className="text-gray-600">Navigate through data hierarchies: Year → Quarter → Month → Day</p>
        </div>
      </div>
    </div>
  );
}

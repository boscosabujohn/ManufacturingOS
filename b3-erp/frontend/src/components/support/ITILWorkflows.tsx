'use client'
import { GitBranch } from 'lucide-react'
export default function ITILWorkflows() {
  return (
    <div className="space-y-3">
      <div className="bg-white shadow-lg p-3">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
          <GitBranch className="h-8 w-8 text-purple-600" />
          ITIL Workflows
        </h2>
        <p className="text-gray-600 mt-1">ITIL-aligned incident, problem, and change management workflows</p>
      </div>
      <div className="bg-white shadow-lg border border-gray-200 rounded-lg p-3">
        <div className="text-center py-12">
          <p className="text-gray-600">ITIL v4 compliant workflows for enterprise service management</p>
        </div>
      </div>
    </div>
  );
}

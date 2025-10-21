'use client'
import { FileText, Download } from 'lucide-react'
export default function SupportReports() {
  const reports = [
    { id: '1', name: 'Ticket Summary Report', description: 'Overall ticket statistics and trends', lastGenerated: '2024-10-21' },
    { id: '2', name: 'SLA Compliance Report', description: 'SLA performance and breaches', lastGenerated: '2024-10-21' },
    { id: '3', name: 'Team Performance Report', description: 'Agent productivity and metrics', lastGenerated: '2024-10-20' }
  ]
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Support Reports</h1>
      <div className="grid gap-4">
        {reports.map((report) => (
          <div key={report.id} className="bg-white rounded-lg shadow-sm border p-6 flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                {report.name}
              </h3>
              <p className="text-sm text-gray-600 mt-1">{report.description}</p>
              <p className="text-xs text-gray-500 mt-2">Last generated: {report.lastGenerated}</p>
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <Download className="h-4 w-4 inline mr-2" />
              Generate
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

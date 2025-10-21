'use client'
import { Plus } from 'lucide-react'
export default function Changes() {
  const changes = [
    { id: '1', changeId: 'CHG-2024-042', title: 'Database server upgrade to v15.2', status: 'Pending Approval', priority: 'high', scheduledFor: '2024-10-25 02:00', requestedBy: 'Rajesh Kumar' },
    { id: '2', changeId: 'CHG-2024-041', title: 'Deploy new CRM features', status: 'Scheduled', priority: 'medium', scheduledFor: '2024-10-23 20:00', requestedBy: 'Priya Sharma' }
  ]
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold">Change Management</h1>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg"><Plus className="h-4 w-4 inline mr-2" />Request Change</button>
      </div>
      <div className="bg-white rounded-lg shadow-sm border">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Change ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Scheduled For</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {changes.map((chg) => (
              <tr key={chg.id} className="hover:bg-gray-50">
                <td className="px-6 py-4"><code className="text-sm">{chg.changeId}</code></td>
                <td className="px-6 py-4 text-sm">{chg.title}</td>
                <td className="px-6 py-4"><span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs">{chg.status}</span></td>
                <td className="px-6 py-4 text-sm">{chg.scheduledFor}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

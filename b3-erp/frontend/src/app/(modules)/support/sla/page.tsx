'use client'
export default function SLAManagement() {
  const slas = [
    { id: '1', name: 'Critical Issues', firstResponse: '1 hour', resolution: '4 hours', compliance: 96 },
    { id: '2', name: 'High Priority', firstResponse: '4 hours', resolution: '24 hours', compliance: 94 },
    { id: '3', name: 'Medium Priority', firstResponse: '8 hours', resolution: '48 hours', compliance: 98 }
  ]
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">SLA Management</h1>
      <div className="bg-white rounded-lg shadow-sm border">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">SLA Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">First Response</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Resolution</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Compliance</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {slas.map((sla) => (
              <tr key={sla.id}>
                <td className="px-6 py-4 font-medium">{sla.name}</td>
                <td className="px-6 py-4">{sla.firstResponse}</td>
                <td className="px-6 py-4">{sla.resolution}</td>
                <td className="px-6 py-4"><span className="text-green-600 font-semibold">{sla.compliance}%</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

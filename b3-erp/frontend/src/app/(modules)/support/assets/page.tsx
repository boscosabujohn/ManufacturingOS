'use client'
export default function Assets() {
  const assets = [
    { id: '1', assetTag: 'AST-2024-1234', name: 'Dell Laptop XPS 15', type: 'Hardware', assignedTo: 'John Smith', status: 'In Use', purchaseDate: '2024-01-15', value: '$1,500' },
    { id: '2', assetTag: 'AST-2024-1235', name: 'Microsoft Office 365', type: 'Software', assignedTo: 'Sarah Johnson', status: 'Active', purchaseDate: '2024-02-01', value: '$150/year' }
  ]
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Asset Management</h1>
      <div className="bg-white rounded-lg shadow-sm border">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Asset Tag</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assigned To</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {assets.map((asset) => (
              <tr key={asset.id}>
                <td className="px-6 py-4"><code className="text-sm">{asset.assetTag}</code></td>
                <td className="px-6 py-4 font-medium">{asset.name}</td>
                <td className="px-6 py-4">{asset.type}</td>
                <td className="px-6 py-4">{asset.assignedTo}</td>
                <td className="px-6 py-4"><span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">{asset.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

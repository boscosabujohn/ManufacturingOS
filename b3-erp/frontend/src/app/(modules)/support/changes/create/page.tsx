'use client'
export default function CreateChange() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Request Change</h1>
      <div className="bg-white rounded-lg shadow-sm border p-6 space-y-4">
        <div><label className="block text-sm font-medium mb-2">Change Title *</label><input type="text" className="w-full px-4 py-2 border rounded-lg" /></div>
        <div><label className="block text-sm font-medium mb-2">Change Type *</label><select className="w-full px-4 py-2 border rounded-lg"><option>Standard</option><option>Normal</option><option>Emergency</option></select></div>
        <div><label className="block text-sm font-medium mb-2">Description *</label><textarea rows={6} className="w-full px-4 py-2 border rounded-lg"></textarea></div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">Submit Change Request</button>
      </div>
    </div>
  )
}

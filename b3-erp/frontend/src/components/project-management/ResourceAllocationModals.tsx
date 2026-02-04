import { useState } from 'react';
import { X } from 'lucide-react';

export function AllocateResourceModal({ isOpen, onClose, onAllocate }: any) {
  const [data, setData] = useState({ resource: '', task: '', hours: '' });
  if (!isOpen) return null;
  return (<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3"><div className="bg-white rounded-lg shadow-xl w-full max-w-2xl"><div className="bg-gradient-to-r from-blue-600 to-blue-700 px-3 py-2 flex justify-between items-center"><h2 className="text-xl font-bold text-white">Allocate Resource</h2><button onClick={onClose} className="text-white"><X className="h-5 w-5" /></button></div><div className="p-6 space-y-2"><div><label className="block text-sm font-medium mb-1">Resource</label><input type="text" value={data.resource} onChange={(e) => setData({...data, resource: e.target.value})} className="w-full px-3 py-2 border rounded-lg" /></div><div><label className="block text-sm font-medium mb-1">Task</label><input type="text" value={data.task} onChange={(e) => setData({...data, task: e.target.value})} className="w-full px-3 py-2 border rounded-lg" /></div><div><label className="block text-sm font-medium mb-1">Hours</label><input type="number" value={data.hours} onChange={(e) => setData({...data, hours: e.target.value})} className="w-full px-3 py-2 border rounded-lg" /></div></div><div className="bg-gray-50 px-3 py-2 flex justify-end space-x-3 border-t"><button onClick={onClose} className="px-4 py-2 border rounded-lg">Cancel</button><button onClick={() => onAllocate(data)} className="px-4 py-2 bg-blue-600 text-white rounded-lg">Allocate</button></div></div></div>);
}

export function EditAllocationModal({ isOpen, onClose, onEdit, allocation }: any) {
  const [data, setData] = useState({ hours: allocation?.hours || 0 });
  if (!isOpen || !allocation) return null;
  return (<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3"><div className="bg-white rounded-lg shadow-xl w-full max-w-md"><div className="bg-gradient-to-r from-green-600 to-green-700 px-3 py-2 flex justify-between items-center"><h2 className="text-xl font-bold text-white">Edit Allocation</h2><button onClick={onClose} className="text-white"><X className="h-5 w-5" /></button></div><div className="p-6"><label className="block text-sm font-medium mb-2">Hours</label><input type="number" value={data.hours} onChange={(e) => setData({...data, hours: e.target.value})} className="w-full px-3 py-2 border rounded-lg" /></div><div className="bg-gray-50 px-3 py-2 flex justify-end space-x-3 border-t"><button onClick={onClose} className="px-4 py-2 border rounded-lg">Cancel</button><button onClick={() => onEdit(data)} className="px-4 py-2 bg-green-600 text-white rounded-lg">Save</button></div></div></div>);
}

export function ReassignResourceModal({ isOpen, onClose, onReassign }: any) {
  const [newResource, setNewResource] = useState('');
  if (!isOpen) return null;
  return (<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3"><div className="bg-white rounded-lg shadow-xl w-full max-w-md"><div className="bg-gradient-to-r from-purple-600 to-purple-700 px-3 py-2 flex justify-between items-center"><h2 className="text-xl font-bold text-white">Reassign Resource</h2><button onClick={onClose} className="text-white"><X className="h-5 w-5" /></button></div><div className="p-6"><label className="block text-sm font-medium mb-2">New Resource</label><input type="text" value={newResource} onChange={(e) => setNewResource(e.target.value)} className="w-full px-3 py-2 border rounded-lg" /></div><div className="bg-gray-50 px-3 py-2 flex justify-end space-x-3 border-t"><button onClick={onClose} className="px-4 py-2 border rounded-lg">Cancel</button><button onClick={() => onReassign({ newResource })} className="px-4 py-2 bg-purple-600 text-white rounded-lg">Reassign</button></div></div></div>);
}

export function BulkAllocateModal({ isOpen, onClose, onAllocate }: any) {
  const [data, setData] = useState({ resources: '', tasks: '' });
  if (!isOpen) return null;
  return (<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3"><div className="bg-white rounded-lg shadow-xl w-full max-w-2xl"><div className="bg-gradient-to-r from-orange-600 to-orange-700 px-3 py-2 flex justify-between items-center"><h2 className="text-xl font-bold text-white">Bulk Allocate</h2><button onClick={onClose} className="text-white"><X className="h-5 w-5" /></button></div><div className="p-6 space-y-2"><div><label className="block text-sm font-medium mb-1">Resources (comma-separated)</label><textarea value={data.resources} onChange={(e) => setData({...data, resources: e.target.value})} rows={3} className="w-full px-3 py-2 border rounded-lg" /></div><div><label className="block text-sm font-medium mb-1">Tasks (comma-separated)</label><textarea value={data.tasks} onChange={(e) => setData({...data, tasks: e.target.value})} rows={3} className="w-full px-3 py-2 border rounded-lg" /></div></div><div className="bg-gray-50 px-3 py-2 flex justify-end space-x-3 border-t"><button onClick={onClose} className="px-4 py-2 border rounded-lg">Cancel</button><button onClick={() => onAllocate(data)} className="px-4 py-2 bg-orange-600 text-white rounded-lg">Allocate</button></div></div></div>);
}

export function ViewWorkloadModal({ isOpen, onClose, resource }: any) {
  if (!isOpen || !resource) return null;
  return (<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3"><div className="bg-white rounded-lg shadow-xl w-full max-w-3xl"><div className="bg-gradient-to-r from-teal-600 to-teal-700 px-3 py-2 flex justify-between items-center"><h2 className="text-xl font-bold text-white">Workload - {resource.name}</h2><button onClick={onClose} className="text-white"><X className="h-5 w-5" /></button></div><div className="p-6"><p className="text-gray-600">Workload details for {resource.name}</p></div><div className="bg-gray-50 px-3 py-2 flex justify-end border-t"><button onClick={onClose} className="px-4 py-2 bg-teal-600 text-white rounded-lg">Close</button></div></div></div>);
}

export function SetCapacityModal({ isOpen, onClose, onSet }: any) {
  const [capacity, setCapacity] = useState(40);
  if (!isOpen) return null;
  return (<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3"><div className="bg-white rounded-lg shadow-xl w-full max-w-md"><div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-3 py-2 flex justify-between items-center"><h2 className="text-xl font-bold text-white">Set Capacity</h2><button onClick={onClose} className="text-white"><X className="h-5 w-5" /></button></div><div className="p-6"><label className="block text-sm font-medium mb-2">Hours per Week</label><input type="number" value={capacity} onChange={(e) => setCapacity(Number(e.target.value))} className="w-full px-3 py-2 border rounded-lg" /></div><div className="bg-gray-50 px-3 py-2 flex justify-end space-x-3 border-t"><button onClick={onClose} className="px-4 py-2 border rounded-lg">Cancel</button><button onClick={() => onSet({ capacity })} className="px-4 py-2 bg-indigo-600 text-white rounded-lg">Set</button></div></div></div>);
}

export function FilterAllocationModal({ isOpen, onClose, onApply }: any) {
  const [filters, setFilters] = useState({ resource: 'all', project: 'all' });
  if (!isOpen) return null;
  return (<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3"><div className="bg-white rounded-lg shadow-xl w-full max-w-2xl"><div className="bg-gradient-to-r from-yellow-600 to-yellow-700 px-3 py-2 flex justify-between items-center"><h2 className="text-xl font-bold text-white">Filter Allocations</h2><button onClick={onClose} className="text-white"><X className="h-5 w-5" /></button></div><div className="p-6"><div className="grid grid-cols-2 gap-2"><div><label className="block text-sm font-medium mb-1">Resource</label><select value={filters.resource} onChange={(e) => setFilters({...filters, resource: e.target.value})} className="w-full px-3 py-2 border rounded-lg"><option value="all">All</option></select></div><div><label className="block text-sm font-medium mb-1">Project</label><select value={filters.project} onChange={(e) => setFilters({...filters, project: e.target.value})} className="w-full px-3 py-2 border rounded-lg"><option value="all">All</option></select></div></div></div><div className="bg-gray-50 px-3 py-2 flex justify-end space-x-3 border-t"><button onClick={onClose} className="px-4 py-2 border rounded-lg">Cancel</button><button onClick={() => onApply(filters)} className="px-4 py-2 bg-yellow-600 text-white rounded-lg">Apply</button></div></div></div>);
}

export function ExportAllocationModal({ isOpen, onClose, onExport }: any) {
  const [format, setFormat] = useState('Excel');
  if (!isOpen) return null;
  return (<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3"><div className="bg-white rounded-lg shadow-xl w-full max-w-md"><div className="bg-gradient-to-r from-emerald-600 to-emerald-700 px-3 py-2 flex justify-between items-center"><h2 className="text-xl font-bold text-white">Export Allocation</h2><button onClick={onClose} className="text-white"><X className="h-5 w-5" /></button></div><div className="p-6"><label className="block text-sm font-medium mb-2">Format</label><select value={format} onChange={(e) => setFormat(e.target.value)} className="w-full px-3 py-2 border rounded-lg"><option>Excel</option><option>PDF</option><option>CSV</option></select></div><div className="bg-gray-50 px-3 py-2 flex justify-end space-x-3 border-t"><button onClick={onClose} className="px-4 py-2 border rounded-lg">Cancel</button><button onClick={() => onExport({ format })} className="px-4 py-2 bg-emerald-600 text-white rounded-lg">Export</button></div></div></div>);
}

export function DeleteAllocationModal({ isOpen, onClose, onDelete }: any) {
  if (!isOpen) return null;
  return (<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3"><div className="bg-white rounded-lg shadow-xl w-full max-w-md"><div className="bg-gradient-to-r from-red-600 to-red-700 px-3 py-2 flex justify-between items-center"><h2 className="text-xl font-bold text-white">Delete Allocation</h2><button onClick={onClose} className="text-white"><X className="h-5 w-5" /></button></div><div className="p-6"><p className="text-gray-700">Are you sure you want to delete this allocation?</p></div><div className="bg-gray-50 px-3 py-2 flex justify-end space-x-3 border-t"><button onClick={onClose} className="px-4 py-2 border rounded-lg">Cancel</button><button onClick={() => onDelete()} className="px-4 py-2 bg-red-600 text-white rounded-lg">Delete</button></div></div></div>);
}

export function ViewDetailsModal({ isOpen, onClose, allocation }: any) {
  if (!isOpen || !allocation) return null;
  return (<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3"><div className="bg-white rounded-lg shadow-xl w-full max-w-3xl"><div className="bg-gradient-to-r from-slate-600 to-slate-700 px-3 py-2 flex justify-between items-center"><h2 className="text-xl font-bold text-white">Allocation Details</h2><button onClick={onClose} className="text-white"><X className="h-5 w-5" /></button></div><div className="p-6"><p className="text-gray-600">Details for allocation</p></div><div className="bg-gray-50 px-3 py-2 flex justify-end border-t"><button onClick={onClose} className="px-4 py-2 bg-slate-600 text-white rounded-lg">Close</button></div></div></div>);
}

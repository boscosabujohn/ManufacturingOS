import { useState } from 'react';
import { X } from 'lucide-react';

export function ViewUtilizationModal({ isOpen, onClose, resource }: any) {
  if (!isOpen || !resource) return null;
  return (<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"><div className="bg-white rounded-lg shadow-xl w-full max-w-4xl"><div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex justify-between items-center"><h2 className="text-xl font-bold text-white">Resource Utilization - {resource.name}</h2><button onClick={onClose} className="text-white"><X className="h-5 w-5" /></button></div><div className="p-6"><p className="text-gray-600">Utilization data for {resource.name}</p></div><div className="bg-gray-50 px-6 py-4 flex justify-end border-t"><button onClick={onClose} className="px-4 py-2 bg-blue-600 text-white rounded-lg">Close</button></div></div></div>);
}

export function FilterUtilizationModal({ isOpen, onClose, onApply }: any) {
  const [filters, setFilters] = useState({ dateRange: 'month', department: 'all' });
  if (!isOpen) return null;
  return (<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"><div className="bg-white rounded-lg shadow-xl w-full max-w-2xl"><div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4 flex justify-between items-center"><h2 className="text-xl font-bold text-white">Filter Utilization</h2><button onClick={onClose} className="text-white"><X className="h-5 w-5" /></button></div><div className="p-6"><div className="grid grid-cols-2 gap-4"><div><label className="block text-sm font-medium mb-1">Date Range</label><select value={filters.dateRange} onChange={(e) => setFilters({...filters, dateRange: e.target.value})} className="w-full px-3 py-2 border rounded-lg"><option value="week">Week</option><option value="month">Month</option><option value="quarter">Quarter</option></select></div><div><label className="block text-sm font-medium mb-1">Department</label><select value={filters.department} onChange={(e) => setFilters({...filters, department: e.target.value})} className="w-full px-3 py-2 border rounded-lg"><option value="all">All</option></select></div></div></div><div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 border-t"><button onClick={onClose} className="px-4 py-2 border rounded-lg">Cancel</button><button onClick={() => onApply(filters)} className="px-4 py-2 bg-green-600 text-white rounded-lg">Apply</button></div></div></div>);
}

export function ExportReportModal({ isOpen, onClose, onExport }: any) {
  const [format, setFormat] = useState('PDF');
  if (!isOpen) return null;
  return (<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"><div className="bg-white rounded-lg shadow-xl w-full max-w-md"><div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4 flex justify-between items-center"><h2 className="text-xl font-bold text-white">Export Report</h2><button onClick={onClose} className="text-white"><X className="h-5 w-5" /></button></div><div className="p-6"><label className="block text-sm font-medium mb-2">Format</label><select value={format} onChange={(e) => setFormat(e.target.value)} className="w-full px-3 py-2 border rounded-lg"><option>PDF</option><option>Excel</option><option>CSV</option></select></div><div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 border-t"><button onClick={onClose} className="px-4 py-2 border rounded-lg">Cancel</button><button onClick={() => onExport({ format })} className="px-4 py-2 bg-purple-600 text-white rounded-lg">Export</button></div></div></div>);
}

export function ComparePeriodsModal({ isOpen, onClose }: any) {
  if (!isOpen) return null;
  return (<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"><div className="bg-white rounded-lg shadow-xl w-full max-w-3xl"><div className="bg-gradient-to-r from-orange-600 to-orange-700 px-6 py-4 flex justify-between items-center"><h2 className="text-xl font-bold text-white">Compare Periods</h2><button onClick={onClose} className="text-white"><X className="h-5 w-5" /></button></div><div className="p-6"><p className="text-gray-600">Period comparison view</p></div><div className="bg-gray-50 px-6 py-4 flex justify-end border-t"><button onClick={onClose} className="px-4 py-2 bg-orange-600 text-white rounded-lg">Close</button></div></div></div>);
}

export function SetTargetsModal({ isOpen, onClose, onSet }: any) {
  const [target, setTarget] = useState(80);
  if (!isOpen) return null;
  return (<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"><div className="bg-white rounded-lg shadow-xl w-full max-w-md"><div className="bg-gradient-to-r from-teal-600 to-teal-700 px-6 py-4 flex justify-between items-center"><h2 className="text-xl font-bold text-white">Set Target Utilization</h2><button onClick={onClose} className="text-white"><X className="h-5 w-5" /></button></div><div className="p-6"><label className="block text-sm font-medium mb-2">Target (%)</label><input type="number" value={target} onChange={(e) => setTarget(Number(e.target.value))} className="w-full px-3 py-2 border rounded-lg" /></div><div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 border-t"><button onClick={onClose} className="px-4 py-2 border rounded-lg">Cancel</button><button onClick={() => onSet({ target })} className="px-4 py-2 bg-teal-600 text-white rounded-lg">Set</button></div></div></div>);
}

export function ViewTrendsModal({ isOpen, onClose }: any) {
  if (!isOpen) return null;
  return (<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"><div className="bg-white rounded-lg shadow-xl w-full max-w-4xl"><div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-4 flex justify-between items-center"><h2 className="text-xl font-bold text-white">Utilization Trends</h2><button onClick={onClose} className="text-white"><X className="h-5 w-5" /></button></div><div className="p-6"><p className="text-gray-600">Trend analysis view</p></div><div className="bg-gray-50 px-6 py-4 flex justify-end border-t"><button onClick={onClose} className="px-4 py-2 bg-indigo-600 text-white rounded-lg">Close</button></div></div></div>);
}

export function OptimizeSuggestionsModal({ isOpen, onClose }: any) {
  if (!isOpen) return null;
  return (<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"><div className="bg-white rounded-lg shadow-xl w-full max-w-3xl"><div className="bg-gradient-to-r from-yellow-600 to-yellow-700 px-6 py-4 flex justify-between items-center"><h2 className="text-xl font-bold text-white">Optimization Suggestions</h2><button onClick={onClose} className="text-white"><X className="h-5 w-5" /></button></div><div className="p-6"><p className="text-gray-600">AI-powered optimization suggestions</p></div><div className="bg-gray-50 px-6 py-4 flex justify-end border-t"><button onClick={onClose} className="px-4 py-2 bg-yellow-600 text-white rounded-lg">Close</button></div></div></div>);
}

export function ViewDetailsModal({ isOpen, onClose, data }: any) {
  if (!isOpen || !data) return null;
  return (<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"><div className="bg-white rounded-lg shadow-xl w-full max-w-4xl"><div className="bg-gradient-to-r from-slate-600 to-slate-700 px-6 py-4 flex justify-between items-center"><h2 className="text-xl font-bold text-white">Utilization Details</h2><button onClick={onClose} className="text-white"><X className="h-5 w-5" /></button></div><div className="p-6"><p className="text-gray-600">Detailed utilization information</p></div><div className="bg-gray-50 px-6 py-4 flex justify-end border-t"><button onClick={onClose} className="px-4 py-2 bg-slate-600 text-white rounded-lg">Close</button></div></div></div>);
}

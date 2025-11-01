import { useState } from 'react';
import { X, Plus } from 'lucide-react';

// 1. Create Project Modal (Blue)
export function CreateProjectModal({ isOpen, onClose, onCreate }: any) {
  const [formData, setFormData] = useState({ projectName: '', projectCode: '', customer: '', startDate: '', endDate: '', budget: '', type: 'Commercial Kitchen' });
  const isValid = formData.projectName && formData.projectCode && formData.customer && formData.startDate;
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Create New Project</h2>
          <button onClick={onClose} className="text-white hover:text-gray-200"><X className="h-5 w-5" /></button>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Project Name *</label><input type="text" value={formData.projectName} onChange={(e) => setFormData({...formData, projectName: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Project Code *</label><input type="text" value={formData.projectCode} onChange={(e) => setFormData({...formData, projectCode: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Customer *</label><input type="text" value={formData.customer} onChange={(e) => setFormData({...formData, customer: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Project Type</label><select value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"><option>Commercial Kitchen</option><option>Cold Room</option><option>Modular Kitchen</option><option>Industrial Kitchen</option></select></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Start Date *</label><input type="date" value={formData.startDate} onChange={(e) => setFormData({...formData, startDate: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">End Date</label><input type="date" value={formData.endDate} onChange={(e) => setFormData({...formData, endDate: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" /></div>
            <div className="col-span-2"><label className="block text-sm font-medium text-gray-700 mb-1">Budget</label><input type="text" value={formData.budget} onChange={(e) => setFormData({...formData, budget: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="₹" /></div>
          </div>
        </div>
        <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 border-t">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100">Cancel</button>
          <button onClick={() => onCreate(formData)} disabled={!isValid} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">Create Project</button>
        </div>
      </div>
    </div>
  );
}

// 2. Quick Actions Modal (Green)
export function QuickActionsModal({ isOpen, onClose, onAction }: any) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Quick Actions</h2>
          <button onClick={onClose} className="text-white hover:text-gray-200"><X className="h-5 w-5" /></button>
        </div>
        <div className="p-6 space-y-2">
          <button onClick={() => onAction('create-task')} className="w-full px-4 py-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 text-left font-medium">Create Task</button>
          <button onClick={() => onAction('add-milestone')} className="w-full px-4 py-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 text-left font-medium">Add Milestone</button>
          <button onClick={() => onAction('log-issue')} className="w-full px-4 py-3 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 text-left font-medium">Log Issue</button>
          <button onClick={() => onAction('upload-document')} className="w-full px-4 py-3 bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100 text-left font-medium">Upload Document</button>
          <button onClick={() => onAction('add-resource')} className="w-full px-4 py-3 bg-teal-50 text-teal-700 rounded-lg hover:bg-teal-100 text-left font-medium">Add Resource</button>
        </div>
        <div className="bg-gray-50 px-6 py-4 flex justify-end border-t">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100">Close</button>
        </div>
      </div>
    </div>
  );
}

// 3. Filter Dashboard Modal (Purple)
export function FilterDashboardModal({ isOpen, onClose, onApply }: any) {
  const [filters, setFilters] = useState({ status: 'all', priority: 'all', dateRange: 'all', type: 'all' });
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Filter Dashboard</h2>
          <button onClick={onClose} className="text-white hover:text-gray-200"><X className="h-5 w-5" /></button>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Status</label><select value={filters.status} onChange={(e) => setFilters({...filters, status: e.target.value})} className="w-full px-3 py-2 border rounded-lg"><option value="all">All Status</option><option value="Active">Active</option><option value="On Hold">On Hold</option><option value="Completed">Completed</option></select></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Priority</label><select value={filters.priority} onChange={(e) => setFilters({...filters, priority: e.target.value})} className="w-full px-3 py-2 border rounded-lg"><option value="all">All Priority</option><option value="High">High</option><option value="Medium">Medium</option><option value="Low">Low</option></select></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label><select value={filters.dateRange} onChange={(e) => setFilters({...filters, dateRange: e.target.value})} className="w-full px-3 py-2 border rounded-lg"><option value="all">All Time</option><option value="today">Today</option><option value="week">This Week</option><option value="month">This Month</option></select></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Project Type</label><select value={filters.type} onChange={(e) => setFilters({...filters, type: e.target.value})} className="w-full px-3 py-2 border rounded-lg"><option value="all">All Types</option><option>Commercial Kitchen</option><option>Cold Room</option><option>Modular Kitchen</option></select></div>
          </div>
        </div>
        <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 border-t">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100">Cancel</button>
          <button onClick={() => onApply(filters)} className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">Apply Filters</button>
        </div>
      </div>
    </div>
  );
}

// 4. Customize Widgets Modal (Orange)
export function CustomizeWidgetsModal({ isOpen, onClose, onSave }: any) {
  const [widgets, setWidgets] = useState({ projectOverview: true, recentActivity: true, taskSummary: true, budgetChart: true, timeline: true, resources: false, issues: true, alerts: false });
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        <div className="bg-gradient-to-r from-orange-600 to-orange-700 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Customize Dashboard Widgets</h2>
          <button onClick={onClose} className="text-white hover:text-gray-200"><X className="h-5 w-5" /></button>
        </div>
        <div className="p-6">
          <p className="text-sm text-gray-600 mb-4">Select which widgets to display on your dashboard</p>
          <div className="space-y-2">
            <label className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"><input type="checkbox" checked={widgets.projectOverview} onChange={(e) => setWidgets({...widgets, projectOverview: e.target.checked})} className="mr-3" /><span className="font-medium">Project Overview</span></label>
            <label className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"><input type="checkbox" checked={widgets.recentActivity} onChange={(e) => setWidgets({...widgets, recentActivity: e.target.checked})} className="mr-3" /><span className="font-medium">Recent Activity</span></label>
            <label className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"><input type="checkbox" checked={widgets.taskSummary} onChange={(e) => setWidgets({...widgets, taskSummary: e.target.checked})} className="mr-3" /><span className="font-medium">Task Summary</span></label>
            <label className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"><input type="checkbox" checked={widgets.budgetChart} onChange={(e) => setWidgets({...widgets, budgetChart: e.target.checked})} className="mr-3" /><span className="font-medium">Budget Chart</span></label>
            <label className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"><input type="checkbox" checked={widgets.timeline} onChange={(e) => setWidgets({...widgets, timeline: e.target.checked})} className="mr-3" /><span className="font-medium">Timeline View</span></label>
            <label className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"><input type="checkbox" checked={widgets.resources} onChange={(e) => setWidgets({...widgets, resources: e.target.checked})} className="mr-3" /><span className="font-medium">Resource Allocation</span></label>
            <label className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"><input type="checkbox" checked={widgets.issues} onChange={(e) => setWidgets({...widgets, issues: e.target.checked})} className="mr-3" /><span className="font-medium">Issues Tracker</span></label>
            <label className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"><input type="checkbox" checked={widgets.alerts} onChange={(e) => setWidgets({...widgets, alerts: e.target.checked})} className="mr-3" /><span className="font-medium">Alerts & Notifications</span></label>
          </div>
        </div>
        <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 border-t">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100">Cancel</button>
          <button onClick={() => onSave(widgets)} className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700">Save Layout</button>
        </div>
      </div>
    </div>
  );
}

// 5. Export Dashboard Modal (Teal)
export function ExportDashboardModal({ isOpen, onClose, onExport }: any) {
  const [settings, setSettings] = useState({ format: 'PDF', includeCharts: true, includeData: true, dateRange: 'current' });
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="bg-gradient-to-r from-teal-600 to-teal-700 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Export Dashboard</h2>
          <button onClick={onClose} className="text-white hover:text-gray-200"><X className="h-5 w-5" /></button>
        </div>
        <div className="p-6 space-y-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Export Format</label><select value={settings.format} onChange={(e) => setSettings({...settings, format: e.target.value})} className="w-full px-3 py-2 border rounded-lg"><option>PDF</option><option>Excel</option><option>PowerPoint</option></select></div>
          <div><label className="flex items-center"><input type="checkbox" checked={settings.includeCharts} onChange={(e) => setSettings({...settings, includeCharts: e.target.checked})} className="mr-2" /><span className="text-sm">Include Charts</span></label></div>
          <div><label className="flex items-center"><input type="checkbox" checked={settings.includeData} onChange={(e) => setSettings({...settings, includeData: e.target.checked})} className="mr-2" /><span className="text-sm">Include Raw Data</span></label></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label><select value={settings.dateRange} onChange={(e) => setSettings({...settings, dateRange: e.target.value})} className="w-full px-3 py-2 border rounded-lg"><option value="current">Current View</option><option value="week">Last 7 Days</option><option value="month">Last 30 Days</option><option value="quarter">Last Quarter</option></select></div>
        </div>
        <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 border-t">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100">Cancel</button>
          <button onClick={() => onExport(settings)} className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700">Export</button>
        </div>
      </div>
    </div>
  );
}

// 6. View Alerts Modal (Red)
export function ViewAlertsModal({ isOpen, onClose }: any) {
  const alerts = [
    { id: 1, type: 'warning', message: 'Project PRJ-001 is 15% over budget', time: '2 hours ago' },
    { id: 2, type: 'danger', message: 'Task T-045 is overdue by 3 days', time: '5 hours ago' },
    { id: 3, type: 'info', message: 'New milestone reached: Phase 1 Complete', time: '1 day ago' },
  ];
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        <div className="bg-gradient-to-r from-red-600 to-red-700 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Alerts & Notifications</h2>
          <button onClick={onClose} className="text-white hover:text-gray-200"><X className="h-5 w-5" /></button>
        </div>
        <div className="p-6 max-h-96 overflow-y-auto">
          <div className="space-y-3">
            {alerts.map(alert => (
              <div key={alert.id} className={`p-4 rounded-lg border ${alert.type === 'warning' ? 'bg-yellow-50 border-yellow-200' : alert.type === 'danger' ? 'bg-red-50 border-red-200' : 'bg-blue-50 border-blue-200'}`}>
                <p className="font-medium text-gray-900">{alert.message}</p>
                <p className="text-xs text-gray-500 mt-1">{alert.time}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-gray-50 px-6 py-4 flex justify-end border-t">
          <button onClick={onClose} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Close</button>
        </div>
      </div>
    </div>
  );
}

// 7. Refresh Dashboard Modal (Indigo)
export function RefreshDashboardModal({ isOpen, onClose, onRefresh }: any) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Refresh Dashboard</h2>
          <button onClick={onClose} className="text-white hover:text-gray-200"><X className="h-5 w-5" /></button>
        </div>
        <div className="p-6">
          <p className="text-sm text-gray-600">Do you want to refresh all dashboard data? This will fetch the latest information from all data sources.</p>
        </div>
        <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 border-t">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100">Cancel</button>
          <button onClick={() => onRefresh()} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Refresh Now</button>
        </div>
      </div>
    </div>
  );
}

// 8. View Details Modal (Slate)
export function ViewDetailsModal({ isOpen, onClose, project }: any) {
  if (!isOpen || !project) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="bg-gradient-to-r from-slate-600 to-slate-700 px-6 py-4 flex justify-between items-center">
          <div><h2 className="text-xl font-bold text-white">{project.name || 'Project Details'}</h2><p className="text-sm text-slate-200">{project.code}</p></div>
          <button onClick={onClose} className="text-white hover:text-gray-200"><X className="h-5 w-5" /></button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg"><p className="text-sm text-blue-600 font-medium">Customer</p><p className="text-lg font-bold text-gray-900">{project.customer || 'N/A'}</p></div>
            <div className="bg-green-50 p-4 rounded-lg"><p className="text-sm text-green-600 font-medium">Status</p><p className="text-lg font-bold text-gray-900">{project.status || 'Active'}</p></div>
            <div className="bg-purple-50 p-4 rounded-lg"><p className="text-sm text-purple-600 font-medium">Budget</p><p className="text-lg font-bold text-gray-900">{project.budget || '₹0'}</p></div>
            <div className="bg-orange-50 p-4 rounded-lg"><p className="text-sm text-orange-600 font-medium">Progress</p><p className="text-lg font-bold text-gray-900">{project.progress || '0'}%</p></div>
          </div>
        </div>
        <div className="bg-gray-50 px-6 py-4 flex justify-end border-t">
          <button onClick={onClose} className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700">Close</button>
        </div>
      </div>
    </div>
  );
}

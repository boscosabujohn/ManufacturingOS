'use client';

import { useState, useMemo } from 'react';
import { Calendar, Clock, CheckCircle, AlertTriangle, RefreshCw } from 'lucide-react';

interface PreventiveMaintenance {
  id: string;
  scheduleId: string;
  assetTag: string;
  assetName: string;
  assetCategory: 'laptop' | 'desktop' | 'mobile' | 'printer' | 'server' | 'network' | 'hvac' | 'other';
  maintenanceType: 'cleaning' | 'inspection' | 'calibration' | 'lubrication' | 'software_update' | 'comprehensive';
  frequency: 'weekly' | 'monthly' | 'quarterly' | 'half_yearly' | 'annual';
  lastMaintenanceDate: string;
  nextMaintenanceDate: string;
  assignedTo: string;
  estimatedDuration: number;
  status: 'upcoming' | 'due' | 'overdue' | 'completed' | 'skipped';
  location: string;
  checklist: {
    item: string;
    completed: boolean;
  }[];
  priority: 'low' | 'medium' | 'high';
  remarks?: string;
}

export default function Page() {
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedFrequency, setSelectedFrequency] = useState('all');

  const mockSchedules: PreventiveMaintenance[] = [
    {
      id: '1',
      scheduleId: 'PM-2024-001',
      assetTag: 'LAP-2024-001',
      assetName: 'Dell Latitude 5420',
      assetCategory: 'laptop',
      maintenanceType: 'comprehensive',
      frequency: 'quarterly',
      lastMaintenanceDate: '2024-07-15',
      nextMaintenanceDate: '2024-10-28',
      assignedTo: 'IT Team - Vikram Singh',
      estimatedDuration: 2,
      status: 'due',
      location: 'Mumbai Office',
      priority: 'medium',
      checklist: [
        { item: 'Clean keyboard and screen', completed: false },
        { item: 'Check battery health', completed: false },
        { item: 'Update BIOS and drivers', completed: false },
        { item: 'Run disk cleanup', completed: false },
        { item: 'Check thermal performance', completed: false }
      ]
    },
    {
      id: '2',
      scheduleId: 'PM-2024-002',
      assetTag: 'SRV-2023-012',
      assetName: 'Lenovo ThinkSystem SR650',
      assetCategory: 'server',
      maintenanceType: 'inspection',
      frequency: 'monthly',
      lastMaintenanceDate: '2024-09-25',
      nextMaintenanceDate: '2024-10-25',
      assignedTo: 'Lenovo Data Center Services',
      estimatedDuration: 4,
      status: 'completed',
      location: 'Mumbai Data Center',
      priority: 'high',
      checklist: [
        { item: 'Check RAID status', completed: true },
        { item: 'Verify backup systems', completed: true },
        { item: 'Monitor temperature and fan speeds', completed: true },
        { item: 'Update firmware', completed: true },
        { item: 'Review system logs', completed: true },
        { item: 'Test redundant power supplies', completed: true }
      ],
      remarks: 'All systems operating within normal parameters'
    },
    {
      id: '3',
      scheduleId: 'PM-2024-003',
      assetTag: 'PRN-2023-045',
      assetName: 'Canon imageRUNNER 2525i',
      assetCategory: 'printer',
      maintenanceType: 'cleaning',
      frequency: 'monthly',
      lastMaintenanceDate: '2024-08-30',
      nextMaintenanceDate: '2024-10-20',
      assignedTo: 'Canon Service Engineer',
      estimatedDuration: 1,
      status: 'overdue',
      location: 'Bangalore Office',
      priority: 'high',
      checklist: [
        { item: 'Clean pickup rollers', completed: false },
        { item: 'Clean fuser unit', completed: false },
        { item: 'Check toner levels', completed: false },
        { item: 'Clean scanner glass', completed: false }
      ],
      remarks: 'Overdue by 6 days - priority scheduling required'
    },
    {
      id: '4',
      scheduleId: 'PM-2024-004',
      assetTag: 'NET-2024-015',
      assetName: 'Cisco Catalyst 9300 Switch',
      assetCategory: 'network',
      maintenanceType: 'software_update',
      frequency: 'quarterly',
      lastMaintenanceDate: '2024-07-01',
      nextMaintenanceDate: '2024-11-05',
      assignedTo: 'Network Team - Priya Sharma',
      estimatedDuration: 3,
      status: 'upcoming',
      location: 'All Offices',
      priority: 'medium',
      checklist: [
        { item: 'Backup current configuration', completed: false },
        { item: 'Download latest IOS update', completed: false },
        { item: 'Schedule maintenance window', completed: false },
        { item: 'Update firmware', completed: false },
        { item: 'Verify network connectivity', completed: false },
        { item: 'Test redundancy failover', completed: false }
      ]
    },
    {
      id: '5',
      scheduleId: 'PM-2024-005',
      assetTag: 'DESK-2024-002',
      assetName: 'HP Elite 800 G8',
      assetCategory: 'desktop',
      maintenanceType: 'cleaning',
      frequency: 'quarterly',
      lastMaintenanceDate: '2024-10-01',
      nextMaintenanceDate: '2025-01-01',
      assignedTo: 'IT Team - Sneha Reddy',
      estimatedDuration: 1,
      status: 'upcoming',
      location: 'Hyderabad Office',
      priority: 'low',
      checklist: [
        { item: 'Clean system internals', completed: false },
        { item: 'Check cable connections', completed: false },
        { item: 'Update Windows and drivers', completed: false },
        { item: 'Run antivirus scan', completed: false }
      ]
    },
    {
      id: '6',
      scheduleId: 'PM-2024-006',
      assetTag: 'HVAC-2022-001',
      assetName: 'Daikin VRV Server Room AC',
      assetCategory: 'hvac',
      maintenanceType: 'comprehensive',
      frequency: 'quarterly',
      lastMaintenanceDate: '2024-07-20',
      nextMaintenanceDate: '2024-10-27',
      assignedTo: 'Daikin Service Team',
      estimatedDuration: 4,
      status: 'due',
      location: 'Mumbai Data Center',
      priority: 'high',
      checklist: [
        { item: 'Clean air filters', completed: false },
        { item: 'Check refrigerant levels', completed: false },
        { item: 'Inspect electrical connections', completed: false },
        { item: 'Check condensate drain', completed: false },
        { item: 'Verify temperature controls', completed: false },
        { item: 'Test emergency backup system', completed: false }
      ],
      remarks: 'Critical for server room operations'
    }
  ];

  const filteredSchedules = mockSchedules.filter(s => {
    if (selectedStatus !== 'all' && s.status !== selectedStatus) return false;
    if (selectedCategory !== 'all' && s.assetCategory !== selectedCategory) return false;
    if (selectedFrequency !== 'all' && s.frequency !== selectedFrequency) return false;
    return true;
  });

  const stats = useMemo(() => ({
    total: mockSchedules.length,
    due: mockSchedules.filter(s => s.status === 'due').length,
    overdue: mockSchedules.filter(s => s.status === 'overdue').length,
    upcoming: mockSchedules.filter(s => s.status === 'upcoming').length,
    completed: mockSchedules.filter(s => s.status === 'completed').length
  }), [mockSchedules]);

  const statusColors = {
    upcoming: 'bg-blue-100 text-blue-700',
    due: 'bg-yellow-100 text-yellow-700',
    overdue: 'bg-red-100 text-red-700',
    completed: 'bg-green-100 text-green-700',
    skipped: 'bg-gray-100 text-gray-700'
  };

  const priorityColors = {
    low: 'bg-gray-100 text-gray-700',
    medium: 'bg-blue-100 text-blue-700',
    high: 'bg-orange-100 text-orange-700'
  };

  const frequencyLabel = {
    weekly: 'Weekly',
    monthly: 'Monthly',
    quarterly: 'Quarterly',
    half_yearly: 'Half-Yearly',
    annual: 'Annual'
  };

  const getDaysUntilMaintenance = (nextDate: string) => {
    const today = new Date();
    const next = new Date(nextDate);
    const diffTime = next.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="w-full h-full px-3 py-2">
      <div className="mb-3">
        <h1 className="text-2xl font-bold text-gray-900">Preventive Maintenance</h1>
        <p className="text-sm text-gray-600 mt-1">Scheduled maintenance activities for assets</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-2 mb-3">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-3 border border-blue-200">
          <p className="text-sm font-medium text-blue-600">Total Schedules</p>
          <p className="text-2xl font-bold text-blue-900 mt-1">{stats.total}</p>
        </div>
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-3 border border-yellow-200">
          <p className="text-sm font-medium text-yellow-600">Due</p>
          <p className="text-2xl font-bold text-yellow-900 mt-1">{stats.due}</p>
        </div>
        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-3 border border-red-200">
          <p className="text-sm font-medium text-red-600">Overdue</p>
          <p className="text-2xl font-bold text-red-900 mt-1">{stats.overdue}</p>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-3 border border-blue-200">
          <p className="text-sm font-medium text-blue-600">Upcoming</p>
          <p className="text-2xl font-bold text-blue-900 mt-1">{stats.upcoming}</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-3 border border-green-200">
          <p className="text-sm font-medium text-green-600">Completed</p>
          <p className="text-2xl font-bold text-green-900 mt-1">{stats.completed}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 mb-3">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="all">All Status</option>
              <option value="upcoming">Upcoming</option>
              <option value="due">Due</option>
              <option value="overdue">Overdue</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Asset Category</label>
            <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="all">All Categories</option>
              <option value="laptop">Laptop</option>
              <option value="desktop">Desktop</option>
              <option value="server">Server</option>
              <option value="printer">Printer</option>
              <option value="network">Network</option>
              <option value="hvac">HVAC</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Frequency</label>
            <select value={selectedFrequency} onChange={(e) => setSelectedFrequency(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="all">All Frequencies</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="half_yearly">Half-Yearly</option>
              <option value="annual">Annual</option>
            </select>
          </div>
          <div className="flex items-end">
            <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm">
              Add Schedule
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {filteredSchedules.map(schedule => {
          const daysUntil = getDaysUntilMaintenance(schedule.nextMaintenanceDate);
          const completedItems = schedule.checklist.filter(item => item.completed).length;
          const totalItems = schedule.checklist.length;
          const completionPercent = (completedItems / totalItems) * 100;

          return (
            <div key={schedule.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-3">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-12 w-12 bg-green-50 rounded-lg flex items-center justify-center">
                      <RefreshCw className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{schedule.assetName}</h3>
                      <p className="text-sm text-gray-600">Schedule: {schedule.scheduleId} • Asset: {schedule.assetTag}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded ${priorityColors[schedule.priority]}`}>
                      {schedule.priority.charAt(0).toUpperCase() + schedule.priority.slice(1)} Priority
                    </span>
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusColors[schedule.status]}`}>
                      {schedule.status === 'upcoming' ? 'Upcoming' : schedule.status.charAt(0).toUpperCase() + schedule.status.slice(1)}
                    </span>
                    <span className="px-2 py-1 text-xs font-semibold rounded bg-purple-100 text-purple-700">
                      {frequencyLabel[schedule.frequency]}
                    </span>
                    {schedule.status === 'overdue' && (
                      <span className="px-2 py-1 text-xs font-semibold rounded bg-red-50 text-red-700 flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" />
                        {Math.abs(daysUntil)} days overdue
                      </span>
                    )}
                    {schedule.status === 'due' && (
                      <span className="px-2 py-1 text-xs font-semibold rounded bg-yellow-50 text-yellow-700">
                        Due in {daysUntil} days
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500 uppercase font-medium mb-1">Next Maintenance</p>
                  <p className="text-lg font-bold text-blue-600">{new Date(schedule.nextMaintenanceDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                  <p className="text-xs text-gray-600 mt-1 flex items-center justify-end gap-1">
                    <Clock className="h-3 w-3" />
                    ~{schedule.estimatedDuration}h
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-2 py-4 border-y border-gray-200">
                <div>
                  <p className="text-xs text-gray-500 uppercase font-medium mb-1">Maintenance Type</p>
                  <p className="text-sm font-semibold text-gray-900">{schedule.maintenanceType.replace(/_/g, ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-medium mb-1">Assigned To</p>
                  <p className="text-sm font-semibold text-gray-900">{schedule.assignedTo}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-medium mb-1">Last Maintenance</p>
                  <p className="text-sm font-semibold text-gray-900">{new Date(schedule.lastMaintenanceDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-medium mb-1">Location</p>
                  <p className="text-sm font-semibold text-gray-900">{schedule.location}</p>
                </div>
              </div>

              <div className="mb-2">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-gray-500 uppercase font-medium">Maintenance Checklist</p>
                  <p className="text-xs font-semibold text-gray-900">{completedItems}/{totalItems} completed</p>
                </div>
                <div className="bg-gray-200 rounded-full h-2 mb-3">
                  <div className={`h-2 rounded-full ${completionPercent === 100 ? 'bg-green-500' : 'bg-blue-500'}`} style={{ width: `${completionPercent}%` }}></div>
                </div>
                <div className="space-y-2">
                  {schedule.checklist.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      {item.completed ? (
                        <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                      ) : (
                        <div className="h-4 w-4 rounded-full border-2 border-gray-300 flex-shrink-0"></div>
                      )}
                      <span className={`text-sm ${item.completed ? 'text-gray-500 line-through' : 'text-gray-700'}`}>
                        {item.item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {schedule.remarks && (
                <div className="bg-yellow-50 rounded-lg p-3 mb-2 border border-yellow-200">
                  <p className="text-xs text-yellow-700 uppercase font-medium mb-1 flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    Remarks
                  </p>
                  <p className="text-sm text-yellow-800">{schedule.remarks}</p>
                </div>
              )}

              <div className="flex gap-2">
                {schedule.status === 'upcoming' && (
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium text-sm">
                    Reschedule
                  </button>
                )}
                {(schedule.status === 'due' || schedule.status === 'overdue') && (
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm">
                    Start Maintenance
                  </button>
                )}
                {schedule.status === 'completed' && (
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium text-sm">
                    View Report
                  </button>
                )}
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium text-sm">
                  View Details
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

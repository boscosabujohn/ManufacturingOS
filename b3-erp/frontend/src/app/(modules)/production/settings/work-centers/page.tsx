'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Search, Edit2, Trash2, Settings, MapPin, Users, Clock, Activity, Loader2, AlertCircle, X, BarChart3, Wrench } from 'lucide-react';
import { workCenterService, WorkCenter as ServiceWorkCenter } from '@/services/work-center.service';
import { ShiftManager } from '@/components/production/ShiftManager';
import { MaintenanceLogList } from '@/components/production/MaintenanceLogList';

interface WorkCenter {
  id: string;
  code: string;
  name: string;
  department: string;
  location: string;
  type: string;
  capacity: number;
  operators: number;
  efficiency: number;
  status: 'active' | 'inactive' | 'maintenance';
  costPerHour: number;
  workingHours: string;
}

// Map service work center to local display format
function mapServiceWorkCenterToLocal(wc: ServiceWorkCenter): WorkCenter {
  const statusMap: Record<string, WorkCenter['status']> = {
    'Active': 'active',
    'Inactive': 'inactive',
    'Maintenance': 'maintenance',
    'Decommissioned': 'inactive',
  };

  // Derive operating hours from schedule if available
  const workingDay = wc.schedule?.find(s => s.isWorkingDay);
  const operatingHours = workingDay
    ? `${workingDay.startTime} - ${workingDay.endTime}`
    : '08:00 - 17:00';

  return {
    id: wc.id,
    code: wc.workCenterCode,
    name: wc.workCenterName,
    department: wc.departmentName || 'Production',
    location: wc.locationName || 'Main Facility',
    type: wc.type,
    capacity: wc.capacity.capacityPerDay,
    operators: wc.operators?.length > 0 ? wc.operators.length : 4, // Use actual operators count or default
    efficiency: wc.capacity.efficiency,
    status: statusMap[wc.status] || 'active',
    costPerHour: wc.costs.laborRate + wc.costs.overheadRate,
    workingHours: operatingHours,
  };
}

export default function WorkCentersSettingsPage() {
  const router = useRouter();
  const [workCenters, setWorkCenters] = useState<WorkCenter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedWC, setSelectedWC] = useState<ServiceWorkCenter | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  // Fetch work centers from service
  const fetchWorkCenters = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await workCenterService.getAllWorkCenters();
      setWorkCenters(data.map(mapServiceWorkCenterToLocal));
    } catch (err) {
      console.error('Error fetching work centers:', err);
      setError('Failed to load work centers. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkCenters();
  }, []);

  const handleSaveShifts = async (shifts: any[]) => {
    if (!selectedWC) return;
    await workCenterService.updateWorkCenterShifts(selectedWC.id, shifts);
    await fetchWorkCenters();
  };


  const filteredWorkCenters = workCenters.filter(wc => {
    const matchesSearch = wc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      wc.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      wc.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || wc.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700';
      case 'inactive': return 'bg-gray-100 text-gray-700';
      case 'maintenance': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 90) return 'text-green-600';
    if (efficiency >= 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-2" />
          <p className="text-gray-600">Loading work centers...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-600 mb-2" />
          <p className="text-gray-900 font-semibold mb-2">Error Loading Work Centers</p>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-3 py-2">
      {/* Inline Header */}
      <div className="mb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Work Centers</h1>
            <p className="text-sm text-gray-500 mt-1">Manage production work centers and stations</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
            <Plus className="w-4 h-4" />
            <span>Add Work Center</span>
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-3">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-3 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Total Work Centers</p>
              <p className="text-3xl font-bold text-blue-900 mt-1">{workCenters.length}</p>
            </div>
            <div className="p-3 bg-blue-200 rounded-lg">
              <Settings className="w-6 h-6 text-blue-700" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-3 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Active Centers</p>
              <p className="text-3xl font-bold text-green-900 mt-1">
                {workCenters.filter(wc => wc.status === 'active').length}
              </p>
            </div>
            <div className="p-3 bg-green-200 rounded-lg">
              <Activity className="w-6 h-6 text-green-700" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-3 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">Total Operators</p>
              <p className="text-3xl font-bold text-purple-900 mt-1">
                {workCenters.reduce((sum, wc) => sum + wc.operators, 0)}
              </p>
            </div>
            <div className="p-3 bg-purple-200 rounded-lg">
              <Users className="w-6 h-6 text-purple-700" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-3 border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-600">Avg Efficiency</p>
              <p className="text-3xl font-bold text-orange-900 mt-1">
                {workCenters.length > 0 ? (workCenters.reduce((sum, wc) => sum + wc.efficiency, 0) / workCenters.length).toFixed(1) : 0}%
              </p>
            </div>
            <div className="p-3 bg-orange-200 rounded-lg">
              <Activity className="w-6 h-6 text-orange-700" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-3 mb-3">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, code, or department..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="maintenance">Maintenance</option>
          </select>
        </div>
      </div>

      {/* Work Centers List */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Capacity</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Operators</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Efficiency</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Cost/Hour</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredWorkCenters.map((wc) => (
                <tr key={wc.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-mono font-bold text-gray-900">{wc.code}</td>
                  <td className="px-4 py-3">
                    <div className="text-sm font-semibold text-gray-900">{wc.name}</div>
                    <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                      <Clock className="w-3 h-3" />
                      {wc.workingHours}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">{wc.department}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                      {wc.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-gray-400" />
                      {wc.location}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold text-gray-900 text-center">{wc.capacity}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Users className="w-3 h-3 text-gray-400" />
                      {wc.operators}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-center">
                    <span className={`font-bold ${getEfficiencyColor(wc.efficiency)}`}>{wc.efficiency}%</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-right font-semibold">
                    ${wc.costPerHour}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(wc.status)}`}>
                      {wc.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={async () => {
                          const data = await workCenterService.getWorkCenterById(wc.id);
                          setSelectedWC(data);
                          setIsPanelOpen(true);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-2 border border-blue-300 rounded-lg hover:bg-blue-50 text-sm font-semibold text-blue-600 transition-colors"
                      >
                        <Wrench className="w-4 h-4" />
                        Manage
                      </button>
                      <button
                        onClick={() => router.push(`/production/analytics/work-centers/${wc.id}`)}
                        className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-600 transition-colors"
                        title="Analytics"
                      >
                        <BarChart3 className="w-4 h-4" />
                      </button>
                      <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-600 transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredWorkCenters.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No work centers found matching your criteria</p>
          </div>
        )}
      </div>

      {/* Side Management Panel */}
      {isPanelOpen && selectedWC && (
        <>
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity" onClick={() => setIsPanelOpen(false)} />
          <div className="fixed right-0 top-0 h-full w-full max-w-2xl bg-white shadow-2xl z-50 overflow-y-auto animate-in slide-in-from-right duration-300">
            <div className="p-6">
              <div className="flex items-center justify-between mb-8 border-b pb-4">
                <div>
                  <h2 className="text-2xl font-black text-gray-900">{selectedWC.workCenterCode}</h2>
                  <p className="text-gray-500 font-medium">{selectedWC.workCenterName}</p>
                </div>
                <button
                  onClick={() => setIsPanelOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-gray-400" />
                </button>
              </div>

              <div className="space-y-8">
                <section>
                  <ShiftManager
                    initialShifts={(selectedWC as any).shifts}
                    onSave={handleSaveShifts}
                  />
                </section>

                <section>
                  <MaintenanceLogList workCenterId={selectedWC.id} />
                </section>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

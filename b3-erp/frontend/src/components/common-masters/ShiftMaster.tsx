'use client';

import React, { useState, useMemo } from 'react';
import {
  Clock, Plus, Search, Filter, Edit2, Trash2, MoreVertical,
  Calendar, Users, Sun, Moon, Sunrise, Coffee, AlertTriangle,
  TrendingUp, Activity, BarChart2, DollarSign, UserCheck,
  CheckCircle2, XCircle, AlertCircle, Zap, Shield
} from 'lucide-react';

interface Shift {
  id: string;
  code: string;
  name: string;
  type: 'Regular' | 'Rotating' | 'Flexible' | 'Split' | 'On-Call';
  category: 'Day' | 'Evening' | 'Night' | 'General';
  timing: {
    startTime: string;
    endTime: string;
    breakStart?: string;
    breakEnd?: string;
    totalHours: number;
    workHours: number;
    breakHours: number;
  };
  days: {
    monday: boolean;
    tuesday: boolean;
    wednesday: boolean;
    thursday: boolean;
    friday: boolean;
    saturday: boolean;
    sunday: boolean;
  };
  rotation?: {
    pattern: string;
    cycleDays: number;
    teams: number;
  };
  allowances: {
    shiftAllowance: number;
    nightAllowance: number;
    overtimeRate: number;
    weekendRate: number;
    holidayRate: number;
  };
  rules: {
    minStaff: number;
    maxStaff: number;
    minRestHours: number;
    maxConsecutiveDays: number;
    requiresApproval: boolean;
    autoAssign: boolean;
  };
  departments: string[];
  locations: string[];
  effectiveFrom: Date;
  effectiveTo?: Date;
  status: 'Active' | 'Inactive' | 'Seasonal';
  metadata: {
    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
    updatedBy: string;
  };
}

const mockShifts: Shift[] = [
  {
    id: '1',
    code: 'SFT-DAY-001',
    name: 'Day Shift',
    type: 'Regular',
    category: 'Day',
    timing: {
      startTime: '08:00',
      endTime: '17:00',
      breakStart: '12:00',
      breakEnd: '13:00',
      totalHours: 9,
      workHours: 8,
      breakHours: 1
    },
    days: {
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: false,
      sunday: false
    },
    allowances: {
      shiftAllowance: 0,
      nightAllowance: 0,
      overtimeRate: 1.5,
      weekendRate: 2.0,
      holidayRate: 2.5
    },
    rules: {
      minStaff: 10,
      maxStaff: 50,
      minRestHours: 11,
      maxConsecutiveDays: 5,
      requiresApproval: false,
      autoAssign: true
    },
    departments: ['Production', 'Quality', 'Warehouse'],
    locations: ['Main Factory', 'Branch Office'],
    effectiveFrom: new Date('2024-01-01'),
    status: 'Active',
    metadata: {
      createdAt: new Date('2023-12-15'),
      updatedAt: new Date('2024-01-10'),
      createdBy: 'Admin',
      updatedBy: 'HR Manager'
    }
  },
  {
    id: '2',
    code: 'SFT-NGT-001',
    name: 'Night Shift',
    type: 'Regular',
    category: 'Night',
    timing: {
      startTime: '22:00',
      endTime: '06:00',
      breakStart: '02:00',
      breakEnd: '02:30',
      totalHours: 8,
      workHours: 7.5,
      breakHours: 0.5
    },
    days: {
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: true,
      sunday: false
    },
    allowances: {
      shiftAllowance: 500,
      nightAllowance: 300,
      overtimeRate: 2.0,
      weekendRate: 2.5,
      holidayRate: 3.0
    },
    rules: {
      minStaff: 5,
      maxStaff: 25,
      minRestHours: 12,
      maxConsecutiveDays: 4,
      requiresApproval: true,
      autoAssign: false
    },
    departments: ['Production', 'Security'],
    locations: ['Main Factory'],
    effectiveFrom: new Date('2024-01-01'),
    status: 'Active',
    metadata: {
      createdAt: new Date('2023-12-15'),
      updatedAt: new Date('2024-01-10'),
      createdBy: 'Admin',
      updatedBy: 'HR Manager'
    }
  },
  {
    id: '3',
    code: 'SFT-ROT-001',
    name: 'Rotating Shift',
    type: 'Rotating',
    category: 'General',
    timing: {
      startTime: '06:00',
      endTime: '14:00',
      totalHours: 8,
      workHours: 8,
      breakHours: 0
    },
    days: {
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: true,
      sunday: true
    },
    rotation: {
      pattern: '2-2-3',
      cycleDays: 14,
      teams: 4
    },
    allowances: {
      shiftAllowance: 200,
      nightAllowance: 0,
      overtimeRate: 1.5,
      weekendRate: 2.0,
      holidayRate: 2.5
    },
    rules: {
      minStaff: 8,
      maxStaff: 30,
      minRestHours: 8,
      maxConsecutiveDays: 3,
      requiresApproval: false,
      autoAssign: true
    },
    departments: ['Production'],
    locations: ['Main Factory', 'Plant 2'],
    effectiveFrom: new Date('2024-01-01'),
    status: 'Active',
    metadata: {
      createdAt: new Date('2023-12-20'),
      updatedAt: new Date('2024-01-05'),
      createdBy: 'Admin',
      updatedBy: 'Operations Manager'
    }
  }
];

export default function ShiftMaster() {
  const [shifts, setShifts] = useState<Shift[]>(mockShifts);
  const [selectedShift, setSelectedShift] = useState<Shift | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('All');
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [currentTab, setCurrentTab] = useState('basic');

  const handleEdit = (shift: Shift) => {
    setSelectedShift(shift);
    setIsModalOpen(true);
    setCurrentTab('basic');
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this shift?')) {
      setShifts(shifts.filter(s => s.id !== id));
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'Active': { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle2 },
      'Inactive': { bg: 'bg-gray-100', text: 'text-gray-800', icon: XCircle },
      'Seasonal': { bg: 'bg-blue-100', text: 'text-blue-800', icon: Calendar }
    };
    const config = statusConfig[status as keyof typeof statusConfig];
    const Icon = config.icon;
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        <Icon className="h-3 w-3" />
        {status}
      </span>
    );
  };

  const getCategoryIcon = (category: string) => {
    const icons = {
      'Day': Sun,
      'Evening': Sunrise,
      'Night': Moon,
      'General': Clock
    };
    const Icon = icons[category as keyof typeof icons] || Clock;
    return <Icon className="h-4 w-4" />;
  };

  const getCategoryBadge = (category: string) => {
    const categoryConfig = {
      'Day': { bg: 'bg-yellow-100', text: 'text-yellow-800' },
      'Evening': { bg: 'bg-orange-100', text: 'text-orange-800' },
      'Night': { bg: 'bg-indigo-100', text: 'text-indigo-800' },
      'General': { bg: 'bg-gray-100', text: 'text-gray-800' }
    };
    const config = categoryConfig[category as keyof typeof categoryConfig];
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {getCategoryIcon(category)}
        {category}
      </span>
    );
  };

  const getTypeBadge = (type: string) => {
    const typeConfig = {
      'Regular': { bg: 'bg-blue-100', text: 'text-blue-800' },
      'Rotating': { bg: 'bg-purple-100', text: 'text-purple-800' },
      'Flexible': { bg: 'bg-green-100', text: 'text-green-800' },
      'Split': { bg: 'bg-orange-100', text: 'text-orange-800' },
      'On-Call': { bg: 'bg-red-100', text: 'text-red-800' }
    };
    const config = typeConfig[type as keyof typeof typeConfig];
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {type}
      </span>
    );
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getWorkingDays = (days: any) => {
    const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const workDays = [];
    if (days.monday) workDays.push('Mon');
    if (days.tuesday) workDays.push('Tue');
    if (days.wednesday) workDays.push('Wed');
    if (days.thursday) workDays.push('Thu');
    if (days.friday) workDays.push('Fri');
    if (days.saturday) workDays.push('Sat');
    if (days.sunday) workDays.push('Sun');

    if (workDays.length === 7) return 'All Days';
    if (workDays.length === 5 && !days.saturday && !days.sunday) return 'Weekdays';
    if (workDays.length === 2 && days.saturday && days.sunday) return 'Weekends';
    return workDays.join(', ');
  };

  const filteredShifts = useMemo(() => {
    return shifts.filter(shift => {
      const matchesSearch = shift.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           shift.code.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'All' || shift.type === filterType;
      const matchesCategory = filterCategory === 'All' || shift.category === filterCategory;
      return matchesSearch && matchesType && matchesCategory;
    });
  }, [shifts, searchTerm, filterType, filterCategory]);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Shift Master</h2>
        <p className="text-gray-600">Manage work shifts and schedules</p>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-1 gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search shifts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="All">All Types</option>
                <option value="Regular">Regular</option>
                <option value="Rotating">Rotating</option>
                <option value="Flexible">Flexible</option>
                <option value="Split">Split</option>
                <option value="On-Call">On-Call</option>
              </select>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="All">All Categories</option>
                <option value="Day">Day</option>
                <option value="Evening">Evening</option>
                <option value="Night">Night</option>
                <option value="General">General</option>
              </select>
            </div>
            <button
              onClick={() => {
                setSelectedShift(null);
                setIsModalOpen(true);
                setCurrentTab('basic');
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Shift
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Shift
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type/Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Timing
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Working Days
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Allowances
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredShifts.map((shift) => (
                <tr key={shift.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{shift.name}</div>
                      <div className="text-sm text-gray-500">{shift.code}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      {getTypeBadge(shift.type)}
                      {getCategoryBadge(shift.category)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-gray-400" />
                        <span>{formatTime(shift.timing.startTime)} - {formatTime(shift.timing.endTime)}</span>
                      </div>
                      <div className="text-gray-500">
                        {shift.timing.workHours} work hrs
                        {shift.timing.breakHours > 0 && ` (${shift.timing.breakHours}h break)`}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">{getWorkingDays(shift.days)}</div>
                    {shift.rotation && (
                      <div className="text-xs text-gray-500">
                        Rotation: {shift.rotation.pattern}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      {shift.allowances.shiftAllowance > 0 && (
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3 text-gray-400" />
                          <span>₹{shift.allowances.shiftAllowance}</span>
                        </div>
                      )}
                      {shift.allowances.nightAllowance > 0 && (
                        <div className="text-xs text-gray-500">
                          Night: +₹{shift.allowances.nightAllowance}
                        </div>
                      )}
                      <div className="text-xs text-gray-500">
                        OT: {shift.allowances.overtimeRate}x
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(shift.status)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(shift)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(shift.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold">
                {selectedShift ? 'Edit Shift' : 'Add New Shift'}
              </h3>
            </div>

            <div className="flex border-b border-gray-200">
              {['basic', 'timing', 'allowances', 'rules', 'assignment'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setCurrentTab(tab)}
                  className={`px-4 py-2 font-medium capitalize ${
                    currentTab === tab
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab === 'basic' ? 'Basic Info' : tab}
                </button>
              ))}
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
              {currentTab === 'basic' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Shift Code *
                      </label>
                      <input
                        type="text"
                        defaultValue={selectedShift?.code}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="SFT-XXX-000"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Shift Name *
                      </label>
                      <input
                        type="text"
                        defaultValue={selectedShift?.name}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter shift name"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Shift Type *
                      </label>
                      <select defaultValue={selectedShift?.type || 'Regular'}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                        <option value="Regular">Regular</option>
                        <option value="Rotating">Rotating</option>
                        <option value="Flexible">Flexible</option>
                        <option value="Split">Split</option>
                        <option value="On-Call">On-Call</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Category *
                      </label>
                      <select defaultValue={selectedShift?.category || 'Day'}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                        <option value="Day">Day</option>
                        <option value="Evening">Evening</option>
                        <option value="Night">Night</option>
                        <option value="General">General</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Effective From *
                      </label>
                      <input
                        type="date"
                        defaultValue={selectedShift?.effectiveFrom ? new Date(selectedShift.effectiveFrom).toISOString().split('T')[0] : ''}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Effective To
                      </label>
                      <input
                        type="date"
                        defaultValue={selectedShift?.effectiveTo ? new Date(selectedShift.effectiveTo).toISOString().split('T')[0] : ''}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select defaultValue={selectedShift?.status || 'Active'}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                      <option value="Seasonal">Seasonal</option>
                    </select>
                  </div>
                </div>
              )}

              {currentTab === 'timing' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Start Time *
                      </label>
                      <input
                        type="time"
                        defaultValue={selectedShift?.timing.startTime}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        End Time *
                      </label>
                      <input
                        type="time"
                        defaultValue={selectedShift?.timing.endTime}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Break Start
                      </label>
                      <input
                        type="time"
                        defaultValue={selectedShift?.timing.breakStart}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Break End
                      </label>
                      <input
                        type="time"
                        defaultValue={selectedShift?.timing.breakEnd}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Working Days
                    </label>
                    <div className="flex gap-3">
                      {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map(day => (
                        <label key={day} className="flex items-center">
                          <input
                            type="checkbox"
                            defaultChecked={selectedShift?.days[day as keyof typeof selectedShift.days]}
                            className="mr-2"
                          />
                          <span className="text-sm capitalize">{day.slice(0, 3)}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {(selectedShift?.type === 'Rotating' || !selectedShift) && (
                    <div className="border-t pt-4">
                      <h4 className="font-medium mb-3">Rotation Settings</h4>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Pattern
                          </label>
                          <input
                            type="text"
                            defaultValue={selectedShift?.rotation?.pattern}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g., 2-2-3"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Cycle Days
                          </label>
                          <input
                            type="number"
                            defaultValue={selectedShift?.rotation?.cycleDays}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Teams
                          </label>
                          <input
                            type="number"
                            defaultValue={selectedShift?.rotation?.teams}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {currentTab === 'allowances' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Shift Allowance (₹)
                      </label>
                      <input
                        type="number"
                        defaultValue={selectedShift?.allowances.shiftAllowance}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="0.00"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Night Allowance (₹)
                      </label>
                      <input
                        type="number"
                        defaultValue={selectedShift?.allowances.nightAllowance}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Overtime Rate (x)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        defaultValue={selectedShift?.allowances.overtimeRate}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="1.5"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Weekend Rate (x)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        defaultValue={selectedShift?.allowances.weekendRate}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="2.0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Holiday Rate (x)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        defaultValue={selectedShift?.allowances.holidayRate}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="2.5"
                      />
                    </div>
                  </div>
                </div>
              )}

              {currentTab === 'rules' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Minimum Staff
                      </label>
                      <input
                        type="number"
                        defaultValue={selectedShift?.rules.minStaff}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Maximum Staff
                      </label>
                      <input
                        type="number"
                        defaultValue={selectedShift?.rules.maxStaff}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Min Rest Hours Between Shifts
                      </label>
                      <input
                        type="number"
                        defaultValue={selectedShift?.rules.minRestHours}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Max Consecutive Days
                      </label>
                      <input
                        type="number"
                        defaultValue={selectedShift?.rules.maxConsecutiveDays}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        defaultChecked={selectedShift?.rules.requiresApproval}
                        className="rounded"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        Requires Manager Approval
                      </span>
                    </label>

                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        defaultChecked={selectedShift?.rules.autoAssign}
                        className="rounded"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        Auto-assign Employees
                      </span>
                    </label>
                  </div>
                </div>
              )}

              {currentTab === 'assignment' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Departments
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {['Production', 'Quality', 'Warehouse', 'Maintenance', 'Security', 'HR', 'Finance'].map(dept => (
                        <label key={dept} className="flex items-center">
                          <input
                            type="checkbox"
                            defaultChecked={selectedShift?.departments?.includes(dept)}
                            className="mr-2"
                          />
                          <span className="text-sm">{dept}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Locations
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {['Main Factory', 'Plant 2', 'Branch Office', 'Warehouse A', 'Warehouse B'].map(location => (
                        <label key={location} className="flex items-center">
                          <input
                            type="checkbox"
                            defaultChecked={selectedShift?.locations?.includes(location)}
                            className="mr-2"
                          />
                          <span className="text-sm">{location}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-gray-200 flex justify-end gap-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  alert('Shift saved successfully!');
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {selectedShift ? 'Update' : 'Create'} Shift
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
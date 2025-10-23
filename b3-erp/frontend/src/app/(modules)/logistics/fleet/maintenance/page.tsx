'use client';

import React, { useState } from 'react';
import {
  Settings,
  Plus,
  Edit2,
  Eye,
  Search,
  Wrench,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Truck,
  DollarSign,
  FileText
} from 'lucide-react';

interface MaintenanceRecord {
  id: number;
  maintenanceId: string;
  vehicleId: string;
  vehicleNumber: string;
  vehicleType: string;
  maintenanceType: 'preventive' | 'corrective' | 'breakdown' | 'inspection' | 'oil-change' | 'tire-replacement';
  serviceType: 'scheduled' | 'unscheduled' | 'emergency';
  description: string;
  scheduledDate: string;
  actualStartDate: string | null;
  completionDate: string | null;
  estimatedDuration: number; // hours
  actualDuration: number | null; // hours
  odometer: number;
  nextServiceOdometer: number;
  nextServiceDate: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'pending-parts' | 'cancelled' | 'overdue';
  priority: 'urgent' | 'high' | 'medium' | 'low';
  serviceProvider: string;
  mechanicName: string | null;
  location: string;
  partsUsed: Array<{
    partName: string;
    partNumber: string;
    quantity: number;
    cost: number;
  }>;
  laborCost: number;
  totalCost: number;
  notes: string;
  createdBy: string;
  approvedBy: string | null;
  warrantyStatus: 'in-warranty' | 'out-of-warranty' | 'extended-warranty' | 'n/a';
}

export default function FleetMaintenancePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');

  const [maintenanceRecords, setMaintenanceRecords] = useState<MaintenanceRecord[]>([
    {
      id: 1,
      maintenanceId: 'MNT-2024-001',
      vehicleId: 'VEH-001',
      vehicleNumber: 'MH-01-AB-1234',
      vehicleType: '32-Ft Truck',
      maintenanceType: 'preventive',
      serviceType: 'scheduled',
      description: 'Regular 5000 km service - Oil change, filter replacement, brake inspection',
      scheduledDate: '2024-11-15',
      actualStartDate: null,
      completionDate: null,
      estimatedDuration: 4,
      actualDuration: null,
      odometer: 125680,
      nextServiceOdometer: 130000,
      nextServiceDate: '2024-11-15',
      status: 'scheduled',
      priority: 'medium',
      serviceProvider: 'Tata Authorized Service Center',
      mechanicName: null,
      location: 'Mumbai Workshop',
      partsUsed: [],
      laborCost: 2500,
      totalCost: 8500,
      notes: 'Scheduled maintenance as per manufacturer guidelines',
      createdBy: 'Ramesh Sharma',
      approvedBy: null,
      warrantyStatus: 'in-warranty'
    },
    {
      id: 2,
      maintenanceId: 'MNT-2024-002',
      vehicleId: 'VEH-004',
      vehicleNumber: 'TS-09-GH-3456',
      vehicleType: '24-Ft Truck',
      maintenanceType: 'corrective',
      serviceType: 'unscheduled',
      description: 'Brake pad replacement and brake fluid change - detected during routine inspection',
      scheduledDate: '2024-10-21',
      actualStartDate: '2024-10-21 09:00',
      completionDate: null,
      estimatedDuration: 6,
      actualDuration: null,
      odometer: 145280,
      nextServiceOdometer: 150000,
      nextServiceDate: '2024-12-01',
      status: 'in-progress',
      priority: 'high',
      serviceProvider: 'BharatBenz Service Center',
      mechanicName: 'Suresh Mechanic',
      location: 'Hyderabad Workshop',
      partsUsed: [
        { partName: 'Brake Pad Set', partNumber: 'BP-2826-001', quantity: 2, cost: 4500 },
        { partName: 'Brake Fluid', partNumber: 'BF-DOT4-001', quantity: 2, cost: 800 }
      ],
      laborCost: 3500,
      totalCost: 8800,
      notes: 'High priority - brake pads worn below safety threshold',
      createdBy: 'Prakash Reddy',
      approvedBy: 'Fleet Manager',
      warrantyStatus: 'in-warranty'
    },
    {
      id: 3,
      maintenanceId: 'MNT-2024-003',
      vehicleId: 'VEH-002',
      vehicleNumber: 'KA-05-CD-5678',
      vehicleType: '20-Ft Container',
      maintenanceType: 'oil-change',
      serviceType: 'scheduled',
      description: 'Engine oil and filter change - 10,000 km service',
      scheduledDate: '2024-10-28',
      actualStartDate: null,
      completionDate: null,
      estimatedDuration: 2,
      actualDuration: null,
      odometer: 89450,
      nextServiceOdometer: 90000,
      nextServiceDate: '2024-10-28',
      status: 'scheduled',
      priority: 'medium',
      serviceProvider: 'Ashok Leyland Service Center',
      mechanicName: null,
      location: 'Bangalore Plant',
      partsUsed: [],
      laborCost: 1500,
      totalCost: 4500,
      notes: 'Scheduled oil change service',
      createdBy: 'Suresh Kumar',
      approvedBy: null,
      warrantyStatus: 'in-warranty'
    },
    {
      id: 4,
      maintenanceId: 'MNT-2024-004',
      vehicleId: 'VEH-003',
      vehicleNumber: 'WB-02-EF-9012',
      vehicleType: '40-Ft Truck',
      maintenanceType: 'tire-replacement',
      serviceType: 'scheduled',
      description: 'Front tire replacement - tire wear exceeds limit',
      scheduledDate: '2024-11-05',
      actualStartDate: null,
      completionDate: null,
      estimatedDuration: 3,
      actualDuration: null,
      odometer: 215680,
      nextServiceOdometer: 220000,
      nextServiceDate: '2024-11-05',
      status: 'pending-parts',
      priority: 'high',
      serviceProvider: 'Mahindra Service Center',
      mechanicName: null,
      location: 'Kolkata Workshop',
      partsUsed: [],
      laborCost: 2000,
      totalCost: 18000,
      notes: 'Waiting for tire shipment - 4 tires ordered',
      createdBy: 'Mohan Das',
      approvedBy: 'Fleet Manager',
      warrantyStatus: 'out-of-warranty'
    },
    {
      id: 5,
      maintenanceId: 'MNT-2024-005',
      vehicleId: 'VEH-008',
      vehicleNumber: 'GJ-01-OP-2580',
      vehicleType: '20-Ft Truck',
      maintenanceType: 'breakdown',
      serviceType: 'emergency',
      description: 'Engine overheating issue - coolant leak detected',
      scheduledDate: '2024-10-20',
      actualStartDate: '2024-10-20 14:00',
      completionDate: '2024-10-21 11:30',
      estimatedDuration: 12,
      actualDuration: 21.5,
      odometer: 134560,
      nextServiceOdometer: 135000,
      nextServiceDate: '2024-10-25',
      status: 'completed',
      priority: 'urgent',
      serviceProvider: 'Ashok Leyland Service Center',
      mechanicName: 'Ravi Mechanic',
      location: 'Ahmedabad Workshop',
      partsUsed: [
        { partName: 'Radiator', partNumber: 'RAD-AL-001', quantity: 1, cost: 8500 },
        { partName: 'Water Pump', partNumber: 'WP-AL-002', quantity: 1, cost: 3500 },
        { partName: 'Coolant', partNumber: 'CL-5L-001', quantity: 3, cost: 1200 },
        { partName: 'Hose Clamps', partNumber: 'HC-SET-001', quantity: 1, cost: 300 }
      ],
      laborCost: 5000,
      totalCost: 18500,
      notes: 'Emergency repair - vehicle broke down on highway. Radiator and water pump replaced.',
      createdBy: 'Bharat Patel',
      approvedBy: 'Operations Manager',
      warrantyStatus: 'extended-warranty'
    },
    {
      id: 6,
      maintenanceId: 'MNT-2024-006',
      vehicleId: 'VEH-007',
      vehicleNumber: 'TN-01-MN-1357',
      vehicleType: '32-Ft Truck',
      maintenanceType: 'inspection',
      serviceType: 'scheduled',
      description: 'Annual vehicle inspection and fitness certification',
      scheduledDate: '2024-11-30',
      actualStartDate: null,
      completionDate: null,
      estimatedDuration: 5,
      actualDuration: null,
      odometer: 156890,
      nextServiceOdometer: 165000,
      nextServiceDate: '2024-11-30',
      status: 'scheduled',
      priority: 'medium',
      serviceProvider: 'Volvo Service Center',
      mechanicName: null,
      location: 'Chennai Workshop',
      partsUsed: [],
      laborCost: 3000,
      totalCost: 3000,
      notes: 'Mandatory annual inspection for fitness certificate renewal',
      createdBy: 'Murugan Subramanian',
      approvedBy: null,
      warrantyStatus: 'in-warranty'
    },
    {
      id: 7,
      maintenanceId: 'MNT-2024-007',
      vehicleId: 'VEH-005',
      vehicleNumber: 'MH-12-IJ-7890',
      vehicleType: '18-Ft Truck',
      maintenanceType: 'preventive',
      serviceType: 'scheduled',
      description: 'Battery check and replacement if needed, electrical system inspection',
      scheduledDate: '2024-10-18',
      actualStartDate: '2024-10-18 10:00',
      completionDate: '2024-10-18 13:30',
      estimatedDuration: 3,
      actualDuration: 3.5,
      odometer: 98750,
      nextServiceOdometer: 105000,
      nextServiceDate: '2024-11-20',
      status: 'completed',
      priority: 'low',
      serviceProvider: 'Eicher Service Center',
      mechanicName: 'Prakash Electrician',
      location: 'Pune Workshop',
      partsUsed: [
        { partName: 'Battery 12V 100Ah', partNumber: 'BAT-12V-100', quantity: 1, cost: 6500 }
      ],
      laborCost: 1500,
      totalCost: 8000,
      notes: 'Battery replaced preventively - old battery showing low voltage',
      createdBy: 'Ganesh Patil',
      approvedBy: 'Workshop Manager',
      warrantyStatus: 'in-warranty'
    },
    {
      id: 8,
      maintenanceId: 'MNT-2024-008',
      vehicleId: 'VEH-006',
      vehicleNumber: 'DL-03-KL-2468',
      vehicleType: '28-Ft Truck',
      maintenanceType: 'preventive',
      serviceType: 'scheduled',
      description: 'Suspension system check and greasing, wheel alignment',
      scheduledDate: '2024-10-15',
      actualStartDate: null,
      completionDate: null,
      estimatedDuration: 4,
      actualDuration: null,
      odometer: 178920,
      nextServiceOdometer: 185000,
      nextServiceDate: '2024-12-10',
      status: 'overdue',
      priority: 'high',
      serviceProvider: 'Tata Service Center',
      mechanicName: null,
      location: 'Delhi Workshop',
      partsUsed: [],
      laborCost: 2500,
      totalCost: 5500,
      notes: 'OVERDUE - Vehicle currently on trip, schedule upon return',
      createdBy: 'Vijay Singh',
      approvedBy: null,
      warrantyStatus: 'in-warranty'
    }
  ]);

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      'scheduled': 'text-blue-600 bg-blue-50 border-blue-200',
      'in-progress': 'text-purple-600 bg-purple-50 border-purple-200',
      'completed': 'text-green-600 bg-green-50 border-green-200',
      'pending-parts': 'text-yellow-600 bg-yellow-50 border-yellow-200',
      'cancelled': 'text-gray-600 bg-gray-50 border-gray-200',
      'overdue': 'text-red-600 bg-red-50 border-red-200'
    };
    return colors[status] || 'text-gray-600 bg-gray-50 border-gray-200';
  };

  const getPriorityColor = (priority: string) => {
    const colors: { [key: string]: string } = {
      'urgent': 'text-red-600 bg-red-50 border-red-200',
      'high': 'text-orange-600 bg-orange-50 border-orange-200',
      'medium': 'text-blue-600 bg-blue-50 border-blue-200',
      'low': 'text-gray-600 bg-gray-50 border-gray-200'
    };
    return colors[priority] || 'text-gray-600 bg-gray-50 border-gray-200';
  };

  const getMaintenanceTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      'preventive': 'text-green-600 bg-green-50',
      'corrective': 'text-orange-600 bg-orange-50',
      'breakdown': 'text-red-600 bg-red-50',
      'inspection': 'text-blue-600 bg-blue-50',
      'oil-change': 'text-purple-600 bg-purple-50',
      'tire-replacement': 'text-yellow-600 bg-yellow-50'
    };
    return colors[type] || 'text-gray-600 bg-gray-50';
  };

  const totalMaintenance = maintenanceRecords.length;
  const scheduledMaintenance = maintenanceRecords.filter(m => m.status === 'scheduled').length;
  const inProgressMaintenance = maintenanceRecords.filter(m => m.status === 'in-progress').length;
  const overdueMaintenance = maintenanceRecords.filter(m => m.status === 'overdue').length;
  const totalCost = maintenanceRecords.reduce((sum, m) => sum + m.totalCost, 0);

  const filteredRecords = maintenanceRecords.filter(record => {
    const matchesSearch = record.maintenanceId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         record.vehicleNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         record.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || record.status === selectedStatus;
    const matchesType = selectedType === 'all' || record.maintenanceType === selectedType;
    const matchesPriority = selectedPriority === 'all' || record.priority === selectedPriority;
    return matchesSearch && matchesStatus && matchesType && matchesPriority;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
            <Settings className="w-8 h-8 text-orange-600" />
            <span>Fleet Maintenance</span>
          </h1>
          <p className="text-gray-600 mt-1">Scheduled and unscheduled maintenance management</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Schedule Maintenance</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-6 border border-orange-200">
          <div className="flex items-center justify-between mb-2">
            <Wrench className="w-8 h-8 text-orange-600" />
            <span className="text-2xl font-bold text-orange-900">{totalMaintenance}</span>
          </div>
          <div className="text-sm font-medium text-orange-700">Total Maintenance</div>
          <div className="text-xs text-orange-600 mt-1">All Records</div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <Calendar className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-bold text-blue-900">{scheduledMaintenance}</span>
          </div>
          <div className="text-sm font-medium text-blue-700">Scheduled</div>
          <div className="text-xs text-blue-600 mt-1">Upcoming</div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 border border-purple-200">
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-8 h-8 text-purple-600" />
            <span className="text-2xl font-bold text-purple-900">{inProgressMaintenance}</span>
          </div>
          <div className="text-sm font-medium text-purple-700">In Progress</div>
          <div className="text-xs text-purple-600 mt-1">Currently Under Service</div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-6 border border-red-200">
          <div className="flex items-center justify-between mb-2">
            <AlertTriangle className="w-8 h-8 text-red-600" />
            <span className="text-2xl font-bold text-red-900">{overdueMaintenance}</span>
          </div>
          <div className="text-sm font-medium text-red-700">Overdue</div>
          <div className="text-xs text-red-600 mt-1">Requires Attention</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search maintenance..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="scheduled">Scheduled</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="pending-parts">Pending Parts</option>
            <option value="overdue">Overdue</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="all">All Types</option>
            <option value="preventive">Preventive</option>
            <option value="corrective">Corrective</option>
            <option value="breakdown">Breakdown</option>
            <option value="inspection">Inspection</option>
            <option value="oil-change">Oil Change</option>
            <option value="tire-replacement">Tire Replacement</option>
          </select>

          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {/* Maintenance Records Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Maintenance ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Schedule</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service Provider</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cost</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRecords.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{record.maintenanceId}</div>
                    <div className="text-xs text-gray-500">ODO: {record.odometer.toLocaleString()} km</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{record.vehicleNumber}</div>
                    <div className="text-sm text-gray-600">{record.vehicleType}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getMaintenanceTypeColor(record.maintenanceType)}`}>
                      {record.maintenanceType.replace('-', ' ').toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs">{record.description}</div>
                    {record.partsUsed.length > 0 && (
                      <div className="text-xs text-gray-500 mt-1">
                        {record.partsUsed.length} part(s) used
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      <Calendar className="w-4 h-4 inline mr-1" />
                      {new Date(record.scheduledDate).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {record.estimatedDuration}h estimated
                    </div>
                    {record.actualDuration && (
                      <div className="text-xs text-blue-600">
                        {record.actualDuration}h actual
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{record.serviceProvider}</div>
                    {record.mechanicName && (
                      <div className="text-xs text-gray-600 mt-1">{record.mechanicName}</div>
                    )}
                    <div className="text-xs text-gray-500">{record.location}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      ₹{record.totalCost.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500">
                      Labor: ₹{record.laborCost.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500">
                      Parts: ₹{(record.totalCost - record.laborCost).toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(record.priority)}`}>
                      {record.priority.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(record.status)}`}>
                      {record.status.replace('-', ' ').toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center space-x-2">
                      <button className="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                        <Eye className="w-4 h-4 text-gray-600" />
                        <span className="text-gray-700">View</span>
                      </button>
                      <button className="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                        <Edit2 className="w-4 h-4 text-gray-600" />
                        <span className="text-gray-700">Edit</span>
                      </button>
                      <button className="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                        <FileText className="w-4 h-4 text-gray-600" />
                        <span className="text-gray-700">Document</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Maintenance Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Preventive Maintenance</h3>
          </div>
          <p className="text-sm text-gray-600 mb-3">
            Scheduled maintenance based on time intervals or odometer readings to prevent breakdowns.
          </p>
          <div className="text-xs text-gray-500 space-y-1">
            <div>• Oil changes and filter replacements</div>
            <div>• Brake and tire inspections</div>
            <div>• Battery and electrical checks</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Wrench className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Corrective Maintenance</h3>
          </div>
          <p className="text-sm text-gray-600 mb-3">
            Unscheduled repairs to fix issues identified during inspections or reported by drivers.
          </p>
          <div className="text-xs text-gray-500 space-y-1">
            <div>• Brake pad replacements</div>
            <div>• Suspension repairs</div>
            <div>• Engine component fixes</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Emergency Repairs</h3>
          </div>
          <p className="text-sm text-gray-600 mb-3">
            Urgent breakdown repairs to get vehicles back on the road quickly and minimize downtime.
          </p>
          <div className="text-xs text-gray-500 space-y-1">
            <div>• Engine overheating repairs</div>
            <div>• Transmission failures</div>
            <div>• Roadside assistance</div>
          </div>
        </div>
      </div>

      {/* Cost Summary */}
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Total Maintenance Cost</h3>
            <p className="text-sm text-blue-700">Cumulative cost of all maintenance activities</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-blue-900">₹{totalCost.toLocaleString()}</div>
            <div className="text-sm text-blue-600 mt-1">Across {totalMaintenance} maintenance records</div>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Search, Truck, Package, Clock, CheckCircle, AlertTriangle, TrendingUp, Filter, Edit } from 'lucide-react';

interface DockDoor {
  id: string;
  dockNo: string;
  type: 'inbound' | 'outbound' | 'both';
  status: 'available' | 'occupied' | 'loading' | 'unloading' | 'maintenance' | 'reserved';
  vehicleNo: string;
  carrierName: string;
  appointmentNo: string;
  scheduledTime: string;
  actualArrival: string;
  expectedDeparture: string;
  orderNo: string;
  itemsCount: number;
  palletCount: number;
  currentProgress: number;
  workerAssigned: string;
  priority: 'high' | 'medium' | 'low';
  waitTime: number;
  notes: string;
}

export default function DockManagementPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const handleEditDock = (dock: DockDoor) => {
    const priorityText = dock.priority ? dock.priority.toUpperCase() : 'N/A';

    alert(`Edit Dock Assignment - ${dock.dockNo}

CURRENT CONFIGURATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

DOCK INFORMATION
Dock Number: ${dock.dockNo} [Read-only]
Dock Type: [${dock.type}] ▼
  Options: Inbound / Outbound / Both
Current Status: [${dock.status}] ▼
  Options: Available / Occupied / Loading / Unloading / Reserved / Maintenance

VEHICLE & CARRIER DETAILS
Vehicle Number: [${dock.vehicleNo || 'Not assigned'}]
Carrier Name: [${dock.carrierName || 'Not assigned'}] ▼
  Suggested: Blue Dart, DHL, VRL, Gati, DTDC, FedEx, Indian Post

APPOINTMENT DETAILS
Appointment No: [${dock.appointmentNo || 'Auto-generated'}]
Order/Reference No: [${dock.orderNo || 'N/A'}]
Priority Level: [${priorityText}] ▼
  Options: High / Medium / Low

TIMING & SCHEDULE
Scheduled Time: [${dock.scheduledTime || 'Not set'}] 📅
Actual Arrival: [${dock.actualArrival || 'Pending'}] 📅
Expected Departure: [${dock.expectedDeparture || 'Not set'}] 📅
Current Wait Time: ${dock.waitTime} minutes ${dock.waitTime > 15 ? '⚠ High' : '✓'}

CARGO INFORMATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total Items: [${dock.itemsCount}] items
Pallet Count: [${dock.palletCount}] pallets
Weight: [ ] kg (total)
Volume: [ ] m³ (total)
Cargo Type: [ ] ▼
  Options: General / Fragile / Perishable / Hazardous / Temperature Controlled

OPERATION PROGRESS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Current Progress: ${dock.currentProgress}%
${'█'.repeat(Math.floor(dock.currentProgress / 5))}${'░'.repeat(20 - Math.floor(dock.currentProgress / 5))} ${dock.currentProgress}%

${dock.status === 'loading' || dock.status === 'unloading' ?
`Update Progress:
[ ] 0-25%: Just started
[ ] 25-50%: In progress
[ ] 50-75%: More than half done
[ ] 75-100%: Almost complete` :
'Progress tracking available when status is Loading/Unloading'}

TEAM ASSIGNMENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Assigned Team/Worker: [${dock.workerAssigned || 'Not assigned'}] ▼
  Available Teams:
  • Team A - Rajesh (Currently: ${dock.dockNo === 'DOCK-A01' || dock.dockNo === 'DOCK-C01' ? 'This dock' : 'Available'})
  • Team B - Priya (Currently: ${dock.dockNo === 'DOCK-A03' || dock.dockNo === 'DOCK-C03' ? 'This dock' : 'Available'})
  • Team C - Amit (Currently: ${dock.dockNo === 'DOCK-B01' || dock.dockNo === 'DOCK-D01' ? 'This dock' : 'Available'})
  • Team D - Suresh (Currently: ${dock.dockNo === 'DOCK-B02' ? 'This dock' : 'Available'})
  • Maintenance Team (For maintenance tasks)

Additional Resources: [ ] ▼
  Options: Forklift / Hand Pallet / Inspection Team / Quality Check / Custom Clearance

SPECIAL INSTRUCTIONS & NOTES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Notes: [${dock.notes || 'No special instructions'}]
        ┌────────────────────────────────────────┐
        │                                        │
        │  Add special instructions here...      │
        │                                        │
        └────────────────────────────────────────┘

Special Handling Requirements:
☐ Fragile - Handle with care
☐ Temperature control required
☐ Quality inspection needed
☐ Custom clearance pending
☐ Photo documentation required
☐ Signature on delivery
☐ Verify seal integrity
☐ Cross-dock transfer

VALIDATION CHECKS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${dock.status !== 'available' && !dock.vehicleNo ? '⚠ Warning: Active dock without vehicle assignment' : '✓ Vehicle assigned'}
${dock.waitTime > 15 ? '⚠ Warning: Wait time exceeds 15 minutes - consider expediting' : '✓ Wait time within acceptable range'}
${dock.currentProgress > 0 && !dock.workerAssigned ? '⚠ Warning: Operation in progress without team assignment' : '✓ Team assignment confirmed'}
${dock.priority === 'high' && dock.currentProgress < 50 ? '⚠ High priority shipment - ensure timely completion' : '○ Priority level noted'}

DOCK OPERATIONS LOG
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Last Status Change: ${dock.actualArrival || 'N/A'}
Modified By: Current User
Previous Status: [View history]
Total Operations Today: 3 completed

QUICK ACTIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[Mark as Complete] - Finish current operation
[Change Status] - Update dock status immediately
[Assign Team] - Allocate workforce
[Add Note] - Include special instructions
[Upload Documents] - Attach BOL, invoice, etc.
[Print Label] - Generate dock assignment slip
[Send Alert] - Notify team/carrier

COMPLETE OPERATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
If operation is complete, this will:
• Mark dock as Available
• Clear vehicle and carrier info
• Log completion time
• Generate operation summary
• Notify next scheduled appointment
• Update dock utilization metrics

Actions:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[Save Changes] [Complete Operation] [Reassign Dock] [Cancel] [View Full History]

Note: Changes will be logged in audit trail and may trigger notifications to assigned teams and carriers.`);
  };

  const dockDoors: DockDoor[] = [
    {
      id: '1',
      dockNo: 'DOCK-A01',
      type: 'inbound',
      status: 'unloading',
      vehicleNo: 'TN-01-AB-1234',
      carrierName: 'Blue Dart Express',
      appointmentNo: 'APT-2025-1001',
      scheduledTime: '2025-10-21 08:00',
      actualArrival: '2025-10-21 08:15',
      expectedDeparture: '2025-10-21 10:00',
      orderNo: 'PO-2025-5678',
      itemsCount: 245,
      palletCount: 12,
      currentProgress: 65,
      workerAssigned: 'Team A - Rajesh',
      priority: 'high',
      waitTime: 15,
      notes: 'Fragile items - Handle with care'
    },
    {
      id: '2',
      dockNo: 'DOCK-A02',
      type: 'inbound',
      status: 'available',
      vehicleNo: '',
      carrierName: '',
      appointmentNo: '',
      scheduledTime: '',
      actualArrival: '',
      expectedDeparture: '',
      orderNo: '',
      itemsCount: 0,
      palletCount: 0,
      currentProgress: 0,
      workerAssigned: '',
      priority: 'low',
      waitTime: 0,
      notes: 'Ready for next shipment'
    },
    {
      id: '3',
      dockNo: 'DOCK-A03',
      type: 'inbound',
      status: 'reserved',
      vehicleNo: 'TN-04-GH-5678',
      carrierName: 'DHL Express',
      appointmentNo: 'APT-2025-1002',
      scheduledTime: '2025-10-21 11:00',
      actualArrival: '',
      expectedDeparture: '2025-10-21 13:00',
      orderNo: 'PO-2025-5679',
      itemsCount: 180,
      palletCount: 9,
      currentProgress: 0,
      workerAssigned: 'Team B - Priya',
      priority: 'medium',
      waitTime: 0,
      notes: 'Temperature controlled items'
    },
    {
      id: '4',
      dockNo: 'DOCK-B01',
      type: 'outbound',
      status: 'loading',
      vehicleNo: 'KA-01-CD-3456',
      carrierName: 'VRL Logistics',
      appointmentNo: 'APT-2025-1003',
      scheduledTime: '2025-10-21 09:00',
      actualArrival: '2025-10-21 08:50',
      expectedDeparture: '2025-10-21 11:00',
      orderNo: 'SO-2025-8901',
      itemsCount: 320,
      palletCount: 16,
      currentProgress: 45,
      workerAssigned: 'Team C - Amit',
      priority: 'high',
      waitTime: 10,
      notes: 'Express delivery - Priority loading'
    },
    {
      id: '5',
      dockNo: 'DOCK-B02',
      type: 'outbound',
      status: 'occupied',
      vehicleNo: 'MH-12-EF-7890',
      carrierName: 'Gati Ltd',
      appointmentNo: 'APT-2025-1004',
      scheduledTime: '2025-10-21 10:00',
      actualArrival: '2025-10-21 09:45',
      expectedDeparture: '2025-10-21 12:00',
      orderNo: 'SO-2025-8902',
      itemsCount: 150,
      palletCount: 8,
      currentProgress: 0,
      workerAssigned: 'Team D - Suresh',
      priority: 'medium',
      waitTime: 15,
      notes: 'Waiting for paperwork completion'
    },
    {
      id: '6',
      dockNo: 'DOCK-B03',
      type: 'outbound',
      status: 'available',
      vehicleNo: '',
      carrierName: '',
      appointmentNo: '',
      scheduledTime: '',
      actualArrival: '',
      expectedDeparture: '',
      orderNo: '',
      itemsCount: 0,
      palletCount: 0,
      currentProgress: 0,
      workerAssigned: '',
      priority: 'low',
      waitTime: 0,
      notes: ''
    },
    {
      id: '7',
      dockNo: 'DOCK-C01',
      type: 'both',
      status: 'loading',
      vehicleNo: 'TN-07-IJ-2345',
      carrierName: 'DTDC Courier',
      appointmentNo: 'APT-2025-1005',
      scheduledTime: '2025-10-21 07:30',
      actualArrival: '2025-10-21 07:25',
      expectedDeparture: '2025-10-21 09:30',
      orderNo: 'SO-2025-8903',
      itemsCount: 280,
      palletCount: 14,
      currentProgress: 85,
      workerAssigned: 'Team A - Rajesh',
      priority: 'high',
      waitTime: 5,
      notes: 'Multi-drop route - Verify all items'
    },
    {
      id: '8',
      dockNo: 'DOCK-C02',
      type: 'both',
      status: 'maintenance',
      vehicleNo: '',
      carrierName: '',
      appointmentNo: '',
      scheduledTime: '',
      actualArrival: '',
      expectedDeparture: '',
      orderNo: '',
      itemsCount: 0,
      palletCount: 0,
      currentProgress: 0,
      workerAssigned: 'Maintenance Team',
      priority: 'low',
      waitTime: 0,
      notes: 'Dock door repair - Expected completion by 14:00'
    },
    {
      id: '9',
      dockNo: 'DOCK-C03',
      type: 'both',
      status: 'unloading',
      vehicleNo: 'HR-26-KL-6789',
      carrierName: 'FedEx',
      appointmentNo: 'APT-2025-1006',
      scheduledTime: '2025-10-21 08:30',
      actualArrival: '2025-10-21 08:35',
      expectedDeparture: '2025-10-21 10:30',
      orderNo: 'PO-2025-5680',
      itemsCount: 195,
      palletCount: 10,
      currentProgress: 30,
      workerAssigned: 'Team B - Priya',
      priority: 'medium',
      waitTime: 5,
      notes: 'Verify quality inspection requirements'
    },
    {
      id: '10',
      dockNo: 'DOCK-D01',
      type: 'inbound',
      status: 'reserved',
      vehicleNo: 'WB-01-MN-4567',
      carrierName: 'Indian Post',
      appointmentNo: 'APT-2025-1007',
      scheduledTime: '2025-10-21 13:00',
      actualArrival: '',
      expectedDeparture: '2025-10-21 15:00',
      orderNo: 'PO-2025-5681',
      itemsCount: 420,
      palletCount: 21,
      currentProgress: 0,
      workerAssigned: 'Team C - Amit',
      priority: 'medium',
      waitTime: 0,
      notes: 'Large shipment - 2 hour unloading window'
    }
  ];

  const dockStats = {
    total: dockDoors.length,
    available: dockDoors.filter(d => d.status === 'available').length,
    occupied: dockDoors.filter(d => d.status === 'occupied').length,
    loading: dockDoors.filter(d => d.status === 'loading').length,
    unloading: dockDoors.filter(d => d.status === 'unloading').length,
    reserved: dockDoors.filter(d => d.status === 'reserved').length,
    maintenance: dockDoors.filter(d => d.status === 'maintenance').length,
    avgWaitTime: Math.round(dockDoors.reduce((sum, d) => sum + d.waitTime, 0) / dockDoors.length),
    utilization: Math.round(((dockDoors.filter(d => d.status !== 'available' && d.status !== 'maintenance').length) / dockDoors.length) * 100)
  };

  const filteredDocks = dockDoors.filter(dock => {
    const matchesSearch =
      dock.dockNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dock.vehicleNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dock.carrierName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dock.appointmentNo.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || dock.status === statusFilter;
    const matchesType = typeFilter === 'all' || dock.type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-700 border-green-200';
      case 'occupied': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'loading': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'unloading': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'reserved': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'maintenance': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 75) return 'bg-green-600';
    if (progress >= 50) return 'bg-blue-600';
    if (progress >= 25) return 'bg-yellow-600';
    return 'bg-red-600';
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6 flex items-center gap-4">
        <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dock Door Management</h1>
          <p className="text-sm text-gray-500 mt-1">Real-time dock door operations and scheduling</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 mb-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <Truck className="w-7 h-7 opacity-80" />
            <span className="text-2xl font-bold">{dockStats.total}</span>
          </div>
          <p className="text-xs font-medium opacity-90">Total Docks</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="w-7 h-7 opacity-80" />
            <span className="text-2xl font-bold">{dockStats.available}</span>
          </div>
          <p className="text-xs font-medium opacity-90">Available</p>
        </div>

        <div className="bg-gradient-to-br from-blue-400 to-blue-500 text-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-7 h-7 opacity-80" />
            <span className="text-2xl font-bold">{dockStats.loading}</span>
          </div>
          <p className="text-xs font-medium opacity-90">Loading</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <Package className="w-7 h-7 opacity-80" />
            <span className="text-2xl font-bold">{dockStats.unloading}</span>
          </div>
          <p className="text-xs font-medium opacity-90">Unloading</p>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <AlertTriangle className="w-7 h-7 opacity-80" />
            <span className="text-2xl font-bold">{dockStats.occupied}</span>
          </div>
          <p className="text-xs font-medium opacity-90">Occupied</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-7 h-7 opacity-80" />
            <span className="text-2xl font-bold">{dockStats.reserved}</span>
          </div>
          <p className="text-xs font-medium opacity-90">Reserved</p>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-red-600 text-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <AlertTriangle className="w-7 h-7 opacity-80" />
            <span className="text-2xl font-bold">{dockStats.maintenance}</span>
          </div>
          <p className="text-xs font-medium opacity-90">Maintenance</p>
        </div>

        <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-7 h-7 opacity-80" />
            <span className="text-2xl font-bold">{dockStats.utilization}%</span>
          </div>
          <p className="text-xs font-medium opacity-90">Utilization</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex flex-col gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by dock no, vehicle no, carrier, or appointment..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="available">Available</option>
              <option value="occupied">Occupied</option>
              <option value="loading">Loading</option>
              <option value="unloading">Unloading</option>
              <option value="reserved">Reserved</option>
              <option value="maintenance">Maintenance</option>
            </select>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="inbound">Inbound</option>
              <option value="outbound">Outbound</option>
              <option value="both">Both</option>
            </select>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Filter className="w-4 h-4" />
            <span>Showing {filteredDocks.length} of {dockStats.total} dock doors " Avg wait time: {dockStats.avgWaitTime} mins</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredDocks.map((dock) => (
          <div key={dock.id} className="bg-white rounded-xl border-2 border-gray-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-bold text-gray-900">{dock.dockNo}</h3>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(dock.status)}`}>
                    {dock.status}
                  </span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700">
                    {dock.type}
                  </span>
                </div>
                {dock.priority && dock.status !== 'available' && (
                  <p className={`text-sm font-medium ${getPriorityColor(dock.priority)}`}>
                    {dock.priority.toUpperCase()} PRIORITY
                  </p>
                )}
              </div>

              {dock.status !== 'available' && dock.status !== 'maintenance' && (
                <button
                  onClick={() => handleEditDock(dock)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
                >
                  <Edit className="w-4 h-4 text-gray-600" />
                  <span className="text-gray-700">Edit</span>
                </button>
              )}
            </div>

            {dock.status === 'available' ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
                <CheckCircle className="w-12 h-12 text-green-600 mb-3" />
                <p className="text-lg font-semibold text-green-900">Dock Available</p>
                <p className="text-sm text-green-700 mt-1">{dock.notes || 'Ready for next shipment'}</p>
              </div>
            ) : dock.status === 'maintenance' ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
                <AlertTriangle className="w-12 h-12 text-red-600 mb-3" />
                <p className="text-lg font-semibold text-red-900">Under Maintenance</p>
                <p className="text-sm text-red-700 mt-1">{dock.notes}</p>
                <p className="text-xs text-red-600 mt-2">Assigned to: {dock.workerAssigned}</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-blue-50 rounded-lg p-3">
                    <p className="text-xs text-blue-600 font-medium mb-1">Vehicle & Carrier</p>
                    <p className="text-sm font-bold text-blue-900">{dock.vehicleNo}</p>
                    <p className="text-xs text-blue-700 mt-0.5">{dock.carrierName}</p>
                  </div>

                  <div className="bg-purple-50 rounded-lg p-3">
                    <p className="text-xs text-purple-600 font-medium mb-1">Appointment</p>
                    <p className="text-sm font-bold text-purple-900">{dock.appointmentNo}</p>
                    <p className="text-xs text-purple-700 mt-0.5">{dock.orderNo}</p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <p className="text-gray-500">Scheduled</p>
                      <p className="font-medium text-gray-900">{dock.scheduledTime || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Actual Arrival</p>
                      <p className="font-medium text-gray-900">{dock.actualArrival || 'Pending'}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Expected Departure</p>
                      <p className="font-medium text-gray-900">{dock.expectedDeparture || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Wait Time</p>
                      <p className={`font-medium ${dock.waitTime > 10 ? 'text-red-600' : 'text-green-600'}`}>
                        {dock.waitTime} mins
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="bg-green-50 rounded-lg p-2 text-center">
                    <p className="text-xs text-green-600 font-medium">Items</p>
                    <p className="text-lg font-bold text-green-900">{dock.itemsCount}</p>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-2 text-center">
                    <p className="text-xs text-orange-600 font-medium">Pallets</p>
                    <p className="text-lg font-bold text-orange-900">{dock.palletCount}</p>
                  </div>
                  <div className="bg-indigo-50 rounded-lg p-2 text-center">
                    <p className="text-xs text-indigo-600 font-medium">Progress</p>
                    <p className="text-lg font-bold text-indigo-900">{dock.currentProgress}%</p>
                  </div>
                </div>

                {(dock.status === 'loading' || dock.status === 'unloading') && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                      <span>{dock.status === 'loading' ? 'Loading' : 'Unloading'} Progress</span>
                      <span>{dock.currentProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${getProgressColor(dock.currentProgress)}`}
                        style={{ width: `${dock.currentProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                  <p className="text-xs text-yellow-600 font-medium mb-1">Team Assignment</p>
                  <p className="text-sm text-yellow-900 font-semibold">{dock.workerAssigned}</p>
                </div>

                {dock.notes && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-xs text-blue-600 font-medium mb-1">Notes</p>
                    <p className="text-sm text-blue-900">{dock.notes}</p>
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>

      {filteredDocks.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <Truck className="w-16 h-16 text-gray-400 mb-4" />
          <p className="text-gray-500 text-lg mb-2">No dock doors found</p>
          <p className="text-sm text-gray-400">Try adjusting your search or filter criteria</p>
        </div>
      )}

      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
        <h3 className="text-sm font-semibold text-blue-900 mb-2">Dock Status Guide:</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-blue-700">
          <div><span className="font-medium">Available:</span> Dock ready for next shipment</div>
          <div><span className="font-medium">Reserved:</span> Appointment scheduled, vehicle not arrived</div>
          <div><span className="font-medium">Occupied:</span> Vehicle docked, operation not started</div>
          <div><span className="font-medium">Loading:</span> Actively loading goods onto vehicle</div>
          <div><span className="font-medium">Unloading:</span> Actively unloading goods from vehicle</div>
          <div><span className="font-medium">Maintenance:</span> Dock under repair or maintenance</div>
        </div>
      </div>
    </div>
  );
}

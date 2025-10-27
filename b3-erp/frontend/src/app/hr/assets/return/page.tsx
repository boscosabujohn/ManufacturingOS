'use client';

import { useState, useMemo } from 'react';
import { CornerUpLeft, User, Calendar, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

interface AssetReturn {
  id: string;
  returnId: string;
  assetTag: string;
  assetType: string;
  assetCategory: 'laptop' | 'desktop' | 'mobile' | 'tablet' | 'monitor' | 'printer' | 'furniture' | 'other';
  returnedBy: string;
  employeeCode: string;
  department: string;
  assignedDate: string;
  returnDate: string;
  returnReason: 'resignation' | 'transfer' | 'upgrade' | 'damaged' | 'end_of_project' | 'other';
  condition: 'excellent' | 'good' | 'fair' | 'poor' | 'damaged';
  status: 'pending_inspection' | 'inspected' | 'accepted' | 'rejected' | 'repair_needed';
  inspectedBy?: string;
  inspectionDate?: string;
  inspectionNotes?: string;
  damageCharges?: number;
  accessories: {
    item: string;
    returned: boolean;
    condition?: string;
  }[];
}

export default function Page() {
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedCondition, setSelectedCondition] = useState('all');

  const mockReturns: AssetReturn[] = [
    {
      id: '1',
      returnId: 'RET-2024-001',
      assetTag: 'LAP-2022-145',
      assetType: 'Dell Latitude 5420',
      assetCategory: 'laptop',
      returnedBy: 'Rahul Verma',
      employeeCode: 'EMP456',
      department: 'Sales',
      assignedDate: '2022-03-15',
      returnDate: '2024-10-20',
      returnReason: 'resignation',
      condition: 'good',
      status: 'pending_inspection',
      accessories: [
        { item: 'Charger', returned: true },
        { item: 'Laptop Bag', returned: true },
        { item: 'Mouse', returned: false }
      ]
    },
    {
      id: '2',
      returnId: 'RET-2024-002',
      assetTag: 'MOB-2023-089',
      assetType: 'iPhone 13 Pro',
      assetCategory: 'mobile',
      returnedBy: 'Priya Nair',
      employeeCode: 'EMP234',
      department: 'Marketing',
      assignedDate: '2023-06-10',
      returnDate: '2024-10-18',
      returnReason: 'upgrade',
      condition: 'excellent',
      status: 'accepted',
      inspectedBy: 'IT Admin - Suresh Kumar',
      inspectionDate: '2024-10-19',
      inspectionNotes: 'Device in excellent condition. All accessories returned. No damage.',
      accessories: [
        { item: 'Charger', returned: true, condition: 'good' },
        { item: 'USB Cable', returned: true, condition: 'excellent' },
        { item: 'EarPods', returned: true, condition: 'good' }
      ]
    },
    {
      id: '3',
      returnId: 'RET-2024-003',
      assetTag: 'DESK-2021-067',
      assetType: 'HP ProDesk 600 G5',
      assetCategory: 'desktop',
      returnedBy: 'Amit Sharma',
      employeeCode: 'EMP789',
      department: 'Finance',
      assignedDate: '2021-08-20',
      returnDate: '2024-10-15',
      returnReason: 'upgrade',
      condition: 'fair',
      status: 'repair_needed',
      inspectedBy: 'IT Admin - Suresh Kumar',
      inspectionDate: '2024-10-16',
      inspectionNotes: 'Hard disk showing signs of failure. RAM modules working fine. Needs HDD replacement before re-assignment.',
      accessories: [
        { item: 'Keyboard', returned: true, condition: 'fair' },
        { item: 'Mouse', returned: true, condition: 'good' },
        { item: 'Power Cable', returned: true, condition: 'excellent' }
      ]
    },
    {
      id: '4',
      returnId: 'RET-2024-004',
      assetTag: 'LAP-2023-234',
      assetType: 'MacBook Pro 14"',
      assetCategory: 'laptop',
      returnedBy: 'Neha Gupta',
      employeeCode: 'EMP567',
      department: 'Design',
      assignedDate: '2023-11-05',
      returnDate: '2024-10-22',
      returnReason: 'damaged',
      condition: 'damaged',
      status: 'inspected',
      inspectedBy: 'IT Manager - Rajesh Kumar',
      inspectionDate: '2024-10-23',
      inspectionNotes: 'Screen cracked. Water damage detected. Keyboard not functioning. Device beyond economical repair.',
      damageCharges: 45000,
      accessories: [
        { item: 'Charger', returned: true, condition: 'good' },
        { item: 'USB-C Cable', returned: false },
        { item: 'Laptop Sleeve', returned: true, condition: 'damaged' }
      ]
    },
    {
      id: '5',
      returnId: 'RET-2024-005',
      assetTag: 'TAB-2022-045',
      assetType: 'iPad Pro 12.9"',
      assetCategory: 'tablet',
      returnedBy: 'Vikram Singh',
      employeeCode: 'EMP890',
      department: 'Sales',
      assignedDate: '2022-07-15',
      returnDate: '2024-10-10',
      returnReason: 'end_of_project',
      condition: 'good',
      status: 'accepted',
      inspectedBy: 'IT Admin - Suresh Kumar',
      inspectionDate: '2024-10-11',
      inspectionNotes: 'Device in good working condition. Minor scratches on screen. Battery health at 85%.',
      accessories: [
        { item: 'Apple Pencil', returned: true, condition: 'excellent' },
        { item: 'Smart Keyboard', returned: true, condition: 'good' },
        { item: 'Charger', returned: true, condition: 'good' }
      ]
    },
    {
      id: '6',
      returnId: 'RET-2024-006',
      assetTag: 'MON-2023-156',
      assetType: 'Dell UltraSharp 27"',
      assetCategory: 'monitor',
      returnedBy: 'Sanjay Desai',
      employeeCode: 'EMP123',
      department: 'IT',
      assignedDate: '2023-04-10',
      returnDate: '2024-10-24',
      returnReason: 'transfer',
      condition: 'excellent',
      status: 'pending_inspection',
      accessories: [
        { item: 'Power Cable', returned: true },
        { item: 'HDMI Cable', returned: true },
        { item: 'Display Port Cable', returned: false }
      ]
    }
  ];

  const filteredReturns = mockReturns.filter(r => {
    if (selectedStatus !== 'all' && r.status !== selectedStatus) return false;
    if (selectedCondition !== 'all' && r.condition !== selectedCondition) return false;
    return true;
  });

  const stats = useMemo(() => ({
    total: mockReturns.length,
    pending: mockReturns.filter(r => r.status === 'pending_inspection').length,
    accepted: mockReturns.filter(r => r.status === 'accepted').length,
    repair: mockReturns.filter(r => r.status === 'repair_needed').length,
    rejected: mockReturns.filter(r => r.status === 'rejected').length
  }), [mockReturns]);

  const statusColors = {
    pending_inspection: 'bg-yellow-100 text-yellow-700',
    inspected: 'bg-blue-100 text-blue-700',
    accepted: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700',
    repair_needed: 'bg-orange-100 text-orange-700'
  };

  const conditionColors = {
    excellent: 'bg-green-100 text-green-700',
    good: 'bg-blue-100 text-blue-700',
    fair: 'bg-yellow-100 text-yellow-700',
    poor: 'bg-orange-100 text-orange-700',
    damaged: 'bg-red-100 text-red-700'
  };

  const reasonLabels = {
    resignation: 'Resignation',
    transfer: 'Department Transfer',
    upgrade: 'Equipment Upgrade',
    damaged: 'Damaged Equipment',
    end_of_project: 'Project Completion',
    other: 'Other'
  };

  return (
    <div className="w-full h-full px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Asset Returns</h1>
        <p className="text-sm text-gray-600 mt-1">Manage asset returns and inspections</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
          <p className="text-sm font-medium text-blue-600">Total Returns</p>
          <p className="text-2xl font-bold text-blue-900 mt-1">{stats.total}</p>
        </div>
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4 border border-yellow-200">
          <p className="text-sm font-medium text-yellow-600">Pending Inspection</p>
          <p className="text-2xl font-bold text-yellow-900 mt-1">{stats.pending}</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
          <p className="text-sm font-medium text-green-600">Accepted</p>
          <p className="text-2xl font-bold text-green-900 mt-1">{stats.accepted}</p>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
          <p className="text-sm font-medium text-orange-600">Repair Needed</p>
          <p className="text-2xl font-bold text-orange-900 mt-1">{stats.repair}</p>
        </div>
        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4 border border-red-200">
          <p className="text-sm font-medium text-red-600">Rejected</p>
          <p className="text-2xl font-bold text-red-900 mt-1">{stats.rejected}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="all">All Status</option>
              <option value="pending_inspection">Pending Inspection</option>
              <option value="inspected">Inspected</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
              <option value="repair_needed">Repair Needed</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Condition</label>
            <select value={selectedCondition} onChange={(e) => setSelectedCondition(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="all">All Conditions</option>
              <option value="excellent">Excellent</option>
              <option value="good">Good</option>
              <option value="fair">Fair</option>
              <option value="poor">Poor</option>
              <option value="damaged">Damaged</option>
            </select>
          </div>
          <div className="flex items-end">
            <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm">
              Process Return
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {filteredReturns.map(returnItem => {
          const allAccessoriesReturned = returnItem.accessories.every(acc => acc.returned);
          const daysAssigned = Math.floor((new Date(returnItem.returnDate).getTime() - new Date(returnItem.assignedDate).getTime()) / (1000 * 60 * 60 * 24));

          return (
            <div key={returnItem.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-12 w-12 bg-orange-50 rounded-lg flex items-center justify-center">
                      <CornerUpLeft className="h-6 w-6 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{returnItem.assetType}</h3>
                      <p className="text-sm text-gray-600">{returnItem.assetTag} • {returnItem.returnId}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusColors[returnItem.status]}`}>
                      {returnItem.status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </span>
                    <span className={`px-2 py-1 text-xs font-semibold rounded ${conditionColors[returnItem.condition]}`}>
                      {returnItem.condition.charAt(0).toUpperCase() + returnItem.condition.slice(1)} Condition
                    </span>
                    <span className="px-2 py-1 text-xs font-semibold rounded bg-gray-100 text-gray-700">
                      {reasonLabels[returnItem.returnReason]}
                    </span>
                  </div>
                </div>
                {returnItem.damageCharges && (
                  <div className="text-right">
                    <p className="text-xs text-red-500 uppercase font-medium mb-1">Damage Charges</p>
                    <p className="text-2xl font-bold text-red-600">₹{returnItem.damageCharges.toLocaleString('en-IN')}</p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 py-4 border-y border-gray-200">
                <div>
                  <p className="text-xs text-gray-500 uppercase font-medium mb-1">Returned By</p>
                  <p className="text-sm font-semibold text-gray-900 flex items-center gap-1">
                    <User className="h-4 w-4 text-gray-500" />
                    {returnItem.returnedBy}
                  </p>
                  <p className="text-xs text-gray-600">{returnItem.employeeCode} • {returnItem.department}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-medium mb-1">Assigned Date</p>
                  <p className="text-sm font-semibold text-gray-900 flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    {new Date(returnItem.assignedDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-medium mb-1">Return Date</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {new Date(returnItem.returnDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-medium mb-1">Usage Period</p>
                  <p className="text-sm font-semibold text-gray-900">{daysAssigned} days</p>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-gray-500 uppercase font-medium">Accessories</p>
                  {allAccessoriesReturned ? (
                    <span className="text-xs font-semibold text-green-600 flex items-center gap-1">
                      <CheckCircle className="h-3 w-3" />
                      All Returned
                    </span>
                  ) : (
                    <span className="text-xs font-semibold text-red-600 flex items-center gap-1">
                      <XCircle className="h-3 w-3" />
                      Missing Items
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {returnItem.accessories.map((acc, idx) => (
                    <div key={idx} className={`rounded-lg p-2 border ${acc.returned ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                      <p className={`text-xs font-medium ${acc.returned ? 'text-green-700' : 'text-red-700'}`}>
                        {acc.returned ? '✓' : '✗'} {acc.item}
                      </p>
                      {acc.returned && acc.condition && (
                        <p className="text-xs text-gray-600">{acc.condition}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {returnItem.inspectionNotes && (
                <div className={`rounded-lg p-4 mb-4 border ${
                  returnItem.status === 'accepted' ? 'bg-green-50 border-green-200' :
                  returnItem.status === 'repair_needed' ? 'bg-orange-50 border-orange-200' :
                  returnItem.status === 'rejected' ? 'bg-red-50 border-red-200' :
                  'bg-blue-50 border-blue-200'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    {returnItem.status === 'accepted' && <CheckCircle className="h-4 w-4 text-green-600" />}
                    {returnItem.status === 'repair_needed' && <AlertTriangle className="h-4 w-4 text-orange-600" />}
                    {returnItem.status === 'rejected' && <XCircle className="h-4 w-4 text-red-600" />}
                    <p className={`text-xs uppercase font-medium ${
                      returnItem.status === 'accepted' ? 'text-green-700' :
                      returnItem.status === 'repair_needed' ? 'text-orange-700' :
                      returnItem.status === 'rejected' ? 'text-red-700' :
                      'text-blue-700'
                    }`}>
                      Inspection Notes
                    </p>
                  </div>
                  <p className={`text-sm mb-2 ${
                    returnItem.status === 'accepted' ? 'text-green-900' :
                    returnItem.status === 'repair_needed' ? 'text-orange-900' :
                    returnItem.status === 'rejected' ? 'text-red-900' :
                    'text-blue-900'
                  }`}>
                    {returnItem.inspectionNotes}
                  </p>
                  {returnItem.inspectedBy && returnItem.inspectionDate && (
                    <p className="text-xs text-gray-600">
                      Inspected by {returnItem.inspectedBy} on {new Date(returnItem.inspectionDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  )}
                </div>
              )}

              {!allAccessoriesReturned && (
                <div className="bg-red-50 rounded-lg p-3 mb-4 border border-red-200">
                  <div className="flex items-center gap-2 mb-1">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <p className="text-xs text-red-700 uppercase font-medium">Missing Accessories</p>
                  </div>
                  <p className="text-sm text-red-900">
                    {returnItem.accessories.filter(acc => !acc.returned).map(acc => acc.item).join(', ')} not returned.
                    Charges will be deducted from final settlement.
                  </p>
                </div>
              )}

              <div className="flex gap-2">
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium text-sm">
                  View Details
                </button>
                {returnItem.status === 'pending_inspection' && (
                  <>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm">
                      Start Inspection
                    </button>
                  </>
                )}
                {returnItem.status === 'inspected' && (
                  <>
                    <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium text-sm">
                      Accept Return
                    </button>
                    <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-medium text-sm">
                      Mark for Repair
                    </button>
                    <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium text-sm">
                      Reject
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

'use client';

import { useState, useMemo } from 'react';
import { Key, User, Calendar, AlertCircle, CheckCircle } from 'lucide-react';

interface AccessCard {
  id: string;
  cardNumber: string;
  cardType: 'employee' | 'contractor' | 'visitor' | 'temp';
  issuedTo: string;
  employeeCode: string;
  department: string;
  designation: string;
  issueDate: string;
  expiryDate?: string;
  status: 'active' | 'inactive' | 'lost' | 'expired' | 'blocked';
  accessLevel: 'basic' | 'standard' | 'elevated' | 'admin';
  accessZones: string[];
  location: string;
  issuedBy: string;
  lastUsed?: string;
  remarks?: string;
}

export default function Page() {
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedAccessLevel, setSelectedAccessLevel] = useState('all');

  const mockAccessCards: AccessCard[] = [
    {
      id: '1',
      cardNumber: 'AC-2024-0345',
      cardType: 'employee',
      issuedTo: 'Rajesh Kumar',
      employeeCode: 'EMP345',
      department: 'Sales',
      designation: 'Senior Sales Manager',
      issueDate: '2024-01-15',
      expiryDate: '2026-01-15',
      status: 'active',
      accessLevel: 'standard',
      accessZones: ['Main Building', 'Parking', 'Cafeteria', 'Sales Office'],
      location: 'Mumbai Office',
      issuedBy: 'Security Team',
      lastUsed: '2024-10-26 09:15'
    },
    {
      id: '2',
      cardNumber: 'AC-2024-0198',
      cardType: 'employee',
      issuedTo: 'Vikram Singh',
      employeeCode: 'EMP198',
      department: 'IT',
      designation: 'IT Manager',
      issueDate: '2023-08-10',
      expiryDate: '2025-08-10',
      status: 'active',
      accessLevel: 'elevated',
      accessZones: ['Main Building', 'Parking', 'Cafeteria', 'IT Office', 'Server Room', 'Network Closet'],
      location: 'Pune Office',
      issuedBy: 'Security Team',
      lastUsed: '2024-10-26 08:45'
    },
    {
      id: '3',
      cardNumber: 'AC-2024-1245',
      cardType: 'contractor',
      issuedTo: 'Amit Patel',
      employeeCode: 'CNT-1245',
      department: 'Facilities',
      designation: 'HVAC Technician',
      issueDate: '2024-09-01',
      expiryDate: '2024-12-31',
      status: 'active',
      accessLevel: 'basic',
      accessZones: ['Main Building', 'Mechanical Room'],
      location: 'Mumbai Office',
      issuedBy: 'Facilities Manager',
      lastUsed: '2024-10-25 14:30',
      remarks: 'Contractor for HVAC maintenance project'
    },
    {
      id: '4',
      cardNumber: 'AC-2023-0567',
      cardType: 'employee',
      issuedTo: 'Priya Sharma',
      employeeCode: 'EMP412',
      department: 'Marketing',
      designation: 'Marketing Executive',
      issueDate: '2023-05-20',
      expiryDate: '2025-05-20',
      status: 'lost',
      accessLevel: 'standard',
      accessZones: ['Main Building', 'Parking', 'Cafeteria', 'Marketing Office'],
      location: 'Delhi Office',
      issuedBy: 'Security Team',
      remarks: 'Card reported lost on 2024-10-20. Replacement issued.'
    },
    {
      id: '5',
      cardNumber: 'AC-2024-0001',
      cardType: 'employee',
      issuedTo: 'Ramesh Iyer',
      employeeCode: 'EMP001',
      department: 'Management',
      designation: 'CTO',
      issueDate: '2024-01-01',
      expiryDate: '2027-01-01',
      status: 'active',
      accessLevel: 'admin',
      accessZones: ['All Areas', 'Executive Suite', 'Server Room', 'Data Center', 'Conference Rooms'],
      location: 'All Offices',
      issuedBy: 'Security Team',
      lastUsed: '2024-10-26 10:30'
    },
    {
      id: '6',
      cardNumber: 'AC-2024-VIS-089',
      cardType: 'visitor',
      issuedTo: 'Suresh Reddy',
      employeeCode: 'VIS-089',
      department: 'External',
      designation: 'Client Representative',
      issueDate: '2024-10-26',
      expiryDate: '2024-10-26',
      status: 'expired',
      accessLevel: 'basic',
      accessZones: ['Reception', 'Conference Room A'],
      location: 'Bangalore Office',
      issuedBy: 'Reception Desk',
      lastUsed: '2024-10-26 16:30',
      remarks: 'Visitor pass for client meeting'
    }
  ];

  const filteredCards = mockAccessCards.filter(c => {
    if (selectedStatus !== 'all' && c.status !== selectedStatus) return false;
    if (selectedType !== 'all' && c.cardType !== selectedType) return false;
    if (selectedAccessLevel !== 'all' && c.accessLevel !== selectedAccessLevel) return false;
    return true;
  });

  const stats = useMemo(() => ({
    total: mockAccessCards.length,
    active: mockAccessCards.filter(c => c.status === 'active').length,
    inactive: mockAccessCards.filter(c => c.status === 'inactive').length,
    lost: mockAccessCards.filter(c => c.status === 'lost').length,
    expired: mockAccessCards.filter(c => c.status === 'expired').length
  }), [mockAccessCards]);

  const statusColors = {
    active: 'bg-green-100 text-green-700',
    inactive: 'bg-gray-100 text-gray-700',
    lost: 'bg-red-100 text-red-700',
    expired: 'bg-orange-100 text-orange-700',
    blocked: 'bg-red-100 text-red-700'
  };

  const accessLevelColors = {
    basic: 'bg-gray-100 text-gray-700',
    standard: 'bg-blue-100 text-blue-700',
    elevated: 'bg-purple-100 text-purple-700',
    admin: 'bg-red-100 text-red-700'
  };

  const cardTypeColors = {
    employee: 'bg-blue-100 text-blue-700',
    contractor: 'bg-orange-100 text-orange-700',
    visitor: 'bg-green-100 text-green-700',
    temp: 'bg-yellow-100 text-yellow-700'
  };

  const getDaysUntilExpiry = (expiryDate: string) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="w-full h-full px-3 py-2">
      <div className="mb-3">
        <h1 className="text-2xl font-bold text-gray-900">Access Cards Management</h1>
        <p className="text-sm text-gray-600 mt-1">Manage and track access control cards</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-2 mb-3">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-3 border border-blue-200">
          <p className="text-sm font-medium text-blue-600">Total Cards</p>
          <p className="text-2xl font-bold text-blue-900 mt-1">{stats.total}</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-3 border border-green-200">
          <p className="text-sm font-medium text-green-600">Active</p>
          <p className="text-2xl font-bold text-green-900 mt-1">{stats.active}</p>
        </div>
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-3 border border-gray-200">
          <p className="text-sm font-medium text-gray-600">Inactive</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{stats.inactive}</p>
        </div>
        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-3 border border-red-200">
          <p className="text-sm font-medium text-red-600">Lost</p>
          <p className="text-2xl font-bold text-red-900 mt-1">{stats.lost}</p>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-3 border border-orange-200">
          <p className="text-sm font-medium text-orange-600">Expired</p>
          <p className="text-2xl font-bold text-orange-900 mt-1">{stats.expired}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 mb-3">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="lost">Lost</option>
              <option value="expired">Expired</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Card Type</label>
            <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="all">All Types</option>
              <option value="employee">Employee</option>
              <option value="contractor">Contractor</option>
              <option value="visitor">Visitor</option>
              <option value="temp">Temporary</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Access Level</label>
            <select value={selectedAccessLevel} onChange={(e) => setSelectedAccessLevel(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="all">All Levels</option>
              <option value="basic">Basic</option>
              <option value="standard">Standard</option>
              <option value="elevated">Elevated</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="flex items-end">
            <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm">
              Issue New Card
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {filteredCards.map(card => {
          const daysUntilExpiry = card.expiryDate ? getDaysUntilExpiry(card.expiryDate) : null;
          const expiringSoon = daysUntilExpiry !== null && daysUntilExpiry <= 30 && daysUntilExpiry > 0;

          return (
            <div key={card.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-3">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-12 w-12 bg-blue-50 rounded-lg flex items-center justify-center">
                      <Key className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{card.issuedTo}</h3>
                      <p className="text-sm text-gray-600">Card: {card.cardNumber} • {card.employeeCode}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded ${cardTypeColors[card.cardType]}`}>
                      {card.cardType.charAt(0).toUpperCase() + card.cardType.slice(1)}
                    </span>
                    <span className={`px-2 py-1 text-xs font-semibold rounded ${accessLevelColors[card.accessLevel]}`}>
                      {card.accessLevel.charAt(0).toUpperCase() + card.accessLevel.slice(1)} Access
                    </span>
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusColors[card.status]}`}>
                      {card.status.charAt(0).toUpperCase() + card.status.slice(1)}
                    </span>
                    {expiringSoon && (
                      <span className="px-2 py-1 text-xs font-semibold rounded bg-yellow-50 text-yellow-700 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        Expires in {daysUntilExpiry} days
                      </span>
                    )}
                  </div>
                </div>
                {card.expiryDate && (
                  <div className="text-right">
                    <p className="text-xs text-gray-500 uppercase font-medium mb-1">Expires On</p>
                    <p className="text-lg font-bold text-blue-600">{new Date(card.expiryDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-2 py-4 border-y border-gray-200">
                <div>
                  <p className="text-xs text-gray-500 uppercase font-medium mb-1">Department</p>
                  <p className="text-sm font-semibold text-gray-900">{card.department}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-medium mb-1">Designation</p>
                  <p className="text-sm font-semibold text-gray-900">{card.designation}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-medium mb-1">Issue Date</p>
                  <p className="text-sm font-semibold text-gray-900 flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    {new Date(card.issueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-medium mb-1">Location</p>
                  <p className="text-sm font-semibold text-gray-900">{card.location}</p>
                </div>
              </div>

              <div className="mb-2">
                <p className="text-xs text-gray-500 uppercase font-medium mb-2">Access Zones</p>
                <div className="flex flex-wrap gap-2">
                  {card.accessZones.map((zone, idx) => (
                    <span key={idx} className="flex items-center gap-1 px-3 py-1 bg-green-50 text-green-700 text-xs rounded-full border border-green-200">
                      <CheckCircle className="h-3 w-3" />
                      {zone}
                    </span>
                  ))}
                </div>
              </div>

              {card.lastUsed && (
                <div className="bg-gray-50 rounded-lg p-3 mb-2">
                  <p className="text-xs text-gray-500 uppercase font-medium mb-1">Last Used</p>
                  <p className="text-sm font-semibold text-gray-900">{card.lastUsed}</p>
                </div>
              )}

              {card.remarks && (
                <div className="bg-yellow-50 rounded-lg p-3 mb-2 border border-yellow-200">
                  <p className="text-xs text-yellow-700 uppercase font-medium mb-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    Remarks
                  </p>
                  <p className="text-sm text-yellow-800">{card.remarks}</p>
                </div>
              )}

              <div className="flex gap-2">
                {card.status === 'active' && (
                  <>
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium text-sm">
                      View Access Log
                    </button>
                    <button className="px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 font-medium text-sm">
                      Deactivate
                    </button>
                  </>
                )}
                {card.status === 'lost' && (
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm">
                    Issue Replacement
                  </button>
                )}
                {card.status === 'expired' && (
                  <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium text-sm">
                    Renew Card
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

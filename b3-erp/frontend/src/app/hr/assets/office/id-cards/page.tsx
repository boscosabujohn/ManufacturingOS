'use client';

import { useState, useMemo } from 'react';
import { CreditCard, User, Calendar, AlertCircle } from 'lucide-react';

interface IDCard {
  id: string;
  cardNumber: string;
  cardType: 'employee' | 'contractor' | 'temp';
  issuedTo: string;
  employeeCode: string;
  department: string;
  designation: string;
  issueDate: string;
  expiryDate?: string;
  status: 'active' | 'inactive' | 'lost' | 'expired' | 'damaged';
  bloodGroup?: string;
  emergencyContact: string;
  photo: boolean;
  location: string;
  issuedBy: string;
  remarks?: string;
}

export default function Page() {
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedType, setSelectedType] = useState('all');

  const mockIDCards: IDCard[] = [
    {
      id: '1',
      cardNumber: 'ID-EMP-345',
      cardType: 'employee',
      issuedTo: 'Rajesh Kumar',
      employeeCode: 'EMP345',
      department: 'Sales',
      designation: 'Senior Sales Manager',
      issueDate: '2024-01-15',
      expiryDate: '2026-01-15',
      status: 'active',
      bloodGroup: 'O+',
      emergencyContact: '+91-98765-43210',
      photo: true,
      location: 'Mumbai Office',
      issuedBy: 'HR Department'
    },
    {
      id: '2',
      cardNumber: 'ID-EMP-198',
      cardType: 'employee',
      issuedTo: 'Vikram Singh',
      employeeCode: 'EMP198',
      department: 'IT',
      designation: 'IT Manager',
      issueDate: '2023-08-10',
      expiryDate: '2025-08-10',
      status: 'active',
      bloodGroup: 'A+',
      emergencyContact: '+91-99887-65432',
      photo: true,
      location: 'Pune Office',
      issuedBy: 'HR Department'
    },
    {
      id: '3',
      cardNumber: 'ID-CNT-1245',
      cardType: 'contractor',
      issuedTo: 'Amit Patel',
      employeeCode: 'CNT-1245',
      department: 'Facilities',
      designation: 'HVAC Technician',
      issueDate: '2024-09-01',
      expiryDate: '2024-12-31',
      status: 'active',
      bloodGroup: 'B+',
      emergencyContact: '+91-97654-32109',
      photo: true,
      location: 'Mumbai Office',
      issuedBy: 'Facilities Manager',
      remarks: 'Contractor ID for HVAC maintenance project'
    },
    {
      id: '4',
      cardNumber: 'ID-EMP-412',
      cardType: 'employee',
      issuedTo: 'Priya Sharma',
      employeeCode: 'EMP412',
      department: 'Marketing',
      designation: 'Marketing Executive',
      issueDate: '2023-05-20',
      expiryDate: '2025-05-20',
      status: 'lost',
      bloodGroup: 'AB+',
      emergencyContact: '+91-96543-21098',
      photo: true,
      location: 'Delhi Office',
      issuedBy: 'HR Department',
      remarks: 'Card reported lost on 2024-10-20. Replacement being processed.'
    },
    {
      id: '5',
      cardNumber: 'ID-EMP-523',
      cardType: 'employee',
      issuedTo: 'Sneha Reddy',
      employeeCode: 'EMP523',
      department: 'HR',
      designation: 'HR Executive',
      issueDate: '2023-11-15',
      expiryDate: '2025-11-15',
      status: 'damaged',
      bloodGroup: 'O-',
      emergencyContact: '+91-95432-10987',
      photo: true,
      location: 'Hyderabad Office',
      issuedBy: 'HR Department',
      remarks: 'Card damaged - lamination peeling off. Replacement requested.'
    },
    {
      id: '6',
      cardNumber: 'ID-TMP-089',
      cardType: 'temp',
      issuedTo: 'Karthik Menon',
      employeeCode: 'TMP-089',
      department: 'Operations',
      designation: 'Temporary Staff',
      issueDate: '2024-08-01',
      expiryDate: '2024-10-20',
      status: 'expired',
      emergencyContact: '+91-94321-09876',
      photo: true,
      location: 'Bangalore Office',
      issuedBy: 'Operations Manager',
      remarks: 'Temporary ID for 3-month project. Expired.'
    }
  ];

  const filteredCards = mockIDCards.filter(c => {
    if (selectedStatus !== 'all' && c.status !== selectedStatus) return false;
    if (selectedType !== 'all' && c.cardType !== selectedType) return false;
    return true;
  });

  const stats = useMemo(() => ({
    total: mockIDCards.length,
    active: mockIDCards.filter(c => c.status === 'active').length,
    lost: mockIDCards.filter(c => c.status === 'lost').length,
    damaged: mockIDCards.filter(c => c.status === 'damaged').length,
    expired: mockIDCards.filter(c => c.status === 'expired').length
  }), [mockIDCards]);

  const statusColors = {
    active: 'bg-green-100 text-green-700',
    inactive: 'bg-gray-100 text-gray-700',
    lost: 'bg-red-100 text-red-700',
    damaged: 'bg-orange-100 text-orange-700',
    expired: 'bg-gray-100 text-gray-700'
  };

  const cardTypeColors = {
    employee: 'bg-blue-100 text-blue-700',
    contractor: 'bg-orange-100 text-orange-700',
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
        <h1 className="text-2xl font-bold text-gray-900">ID Cards Management</h1>
        <p className="text-sm text-gray-600 mt-1">Manage employee identification cards</p>
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
        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-3 border border-red-200">
          <p className="text-sm font-medium text-red-600">Lost</p>
          <p className="text-2xl font-bold text-red-900 mt-1">{stats.lost}</p>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-3 border border-orange-200">
          <p className="text-sm font-medium text-orange-600">Damaged</p>
          <p className="text-2xl font-bold text-orange-900 mt-1">{stats.damaged}</p>
        </div>
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-3 border border-gray-200">
          <p className="text-sm font-medium text-gray-600">Expired</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{stats.expired}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 mb-3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="lost">Lost</option>
              <option value="damaged">Damaged</option>
              <option value="expired">Expired</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Card Type</label>
            <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="all">All Types</option>
              <option value="employee">Employee</option>
              <option value="contractor">Contractor</option>
              <option value="temp">Temporary</option>
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
                      <CreditCard className="h-6 w-6 text-blue-600" />
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
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusColors[card.status]}`}>
                      {card.status.charAt(0).toUpperCase() + card.status.slice(1)}
                    </span>
                    {expiringSoon && (
                      <span className="px-2 py-1 text-xs font-semibold rounded bg-yellow-50 text-yellow-700 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        Expires in {daysUntilExpiry} days
                      </span>
                    )}
                    {card.photo && (
                      <span className="px-2 py-1 text-xs font-semibold rounded bg-green-50 text-green-700">
                        Photo ID
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

              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-2">
                {card.bloodGroup && (
                  <div className="bg-red-50 rounded-lg p-3">
                    <p className="text-xs text-red-600 uppercase font-medium mb-1">Blood Group</p>
                    <p className="text-lg font-bold text-red-700">{card.bloodGroup}</p>
                  </div>
                )}
                <div className="bg-blue-50 rounded-lg p-3">
                  <p className="text-xs text-blue-600 uppercase font-medium mb-1">Emergency Contact</p>
                  <p className="text-sm font-semibold text-blue-900">{card.emergencyContact}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-600 uppercase font-medium mb-1">Issued By</p>
                  <p className="text-sm font-semibold text-gray-900">{card.issuedBy}</p>
                </div>
              </div>

              {card.remarks && (
                <div className={`rounded-lg p-3 mb-2 ${card.status === 'lost' || card.status === 'damaged' ? 'bg-yellow-50 border border-yellow-200' : 'bg-gray-50'}`}>
                  <p className={`text-xs uppercase font-medium mb-1 flex items-center gap-1 ${card.status === 'lost' || card.status === 'damaged' ? 'text-yellow-700' : 'text-gray-600'}`}>
                    {(card.status === 'lost' || card.status === 'damaged') && <AlertCircle className="h-3 w-3" />}
                    Remarks
                  </p>
                  <p className={`text-sm ${card.status === 'lost' || card.status === 'damaged' ? 'text-yellow-800' : 'text-gray-700'}`}>{card.remarks}</p>
                </div>
              )}

              <div className="flex gap-2">
                {card.status === 'active' && (
                  <>
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium text-sm">
                      View Details
                    </button>
                    <button className="px-4 py-2 border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-50 font-medium text-sm">
                      Print Card
                    </button>
                  </>
                )}
                {(card.status === 'lost' || card.status === 'damaged') && (
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
                  Edit
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

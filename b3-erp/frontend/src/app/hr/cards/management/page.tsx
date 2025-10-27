'use client';

import { useState } from 'react';
import { CreditCard, Users, CheckCircle, AlertTriangle, XCircle, Calendar, IndianRupee } from 'lucide-react';

interface Card {
  id: string;
  cardNumber: string;
  cardType: 'credit' | 'debit' | 'fuel';
  assignedTo: string;
  employeeCode: string;
  department: string;
  designation: string;
  issueDate: string;
  expiryDate: string;
  limit: number;
  spent: number;
  available: number;
  status: 'active' | 'blocked' | 'expired' | 'lost';
  cardProvider: string;
  lastUsedDate?: string;
}

export default function Page() {
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const mockCards: Card[] = [
    {
      id: '1',
      cardNumber: '**** **** **** 5678',
      cardType: 'credit',
      assignedTo: 'Rajesh Kumar',
      employeeCode: 'EMP234',
      department: 'Sales',
      designation: 'Regional Manager',
      issueDate: '2024-01-15',
      expiryDate: '2027-01-31',
      limit: 150000,
      spent: 85000,
      available: 65000,
      status: 'active',
      cardProvider: 'HDFC Bank',
      lastUsedDate: '2025-10-20'
    },
    {
      id: '2',
      cardNumber: '**** **** **** 1234',
      cardType: 'fuel',
      assignedTo: 'Priya Sharma',
      employeeCode: 'EMP456',
      department: 'Engineering',
      designation: 'Technical Lead',
      issueDate: '2024-03-10',
      expiryDate: '2026-03-31',
      limit: 50000,
      spent: 28000,
      available: 22000,
      status: 'active',
      cardProvider: 'Indian Oil',
      lastUsedDate: '2025-10-18'
    },
    {
      id: '3',
      cardNumber: '**** **** **** 9012',
      cardType: 'credit',
      assignedTo: 'Amit Patel',
      employeeCode: 'EMP789',
      department: 'Quality',
      designation: 'Quality Manager',
      issueDate: '2023-06-20',
      expiryDate: '2026-06-30',
      limit: 200000,
      spent: 145000,
      available: 55000,
      status: 'active',
      cardProvider: 'ICICI Bank',
      lastUsedDate: '2025-10-22'
    },
    {
      id: '4',
      cardNumber: '**** **** **** 3456',
      cardType: 'credit',
      assignedTo: 'Vikram Singh',
      employeeCode: 'EMP567',
      department: 'IT',
      designation: 'IT Manager',
      issueDate: '2023-09-01',
      expiryDate: '2025-09-30',
      limit: 100000,
      spent: 100000,
      available: 0,
      status: 'expired',
      cardProvider: 'SBI',
      lastUsedDate: '2025-09-15'
    }
  ];

  const filteredCards = mockCards.filter(c => {
    const matchesType = selectedType === 'all' || c.cardType === selectedType;
    const matchesStatus = selectedStatus === 'all' || c.status === selectedStatus;
    return matchesType && matchesStatus;
  });

  const stats = {
    total: mockCards.length,
    active: mockCards.filter(c => c.status === 'active').length,
    blocked: mockCards.filter(c => c.status === 'blocked').length,
    totalLimit: mockCards.reduce((sum, c) => sum + c.limit, 0),
    totalSpent: mockCards.reduce((sum, c) => sum + c.spent, 0)
  };

  const statusColors = {
    active: 'bg-green-100 text-green-700',
    blocked: 'bg-red-100 text-red-700',
    expired: 'bg-orange-100 text-orange-700',
    lost: 'bg-gray-100 text-gray-700'
  };

  const cardTypeColors = {
    credit: 'bg-blue-100 text-blue-700',
    debit: 'bg-purple-100 text-purple-700',
    fuel: 'bg-green-100 text-green-700'
  };

  const getUtilization = (spent: number, limit: number) => {
    return Math.round((spent / limit) * 100);
  };

  return (
    <div className="w-full h-full px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Corporate Card Management</h1>
        <p className="text-sm text-gray-600 mt-1">Manage and monitor corporate cards</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Total Cards</p>
              <p className="text-2xl font-bold text-blue-900 mt-1">{stats.total}</p>
            </div>
            <CreditCard className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Active</p>
              <p className="text-2xl font-bold text-green-900 mt-1">{stats.active}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4 border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-600">Blocked</p>
              <p className="text-2xl font-bold text-red-900 mt-1">{stats.blocked}</p>
            </div>
            <XCircle className="h-8 w-8 text-red-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">Total Limit</p>
              <p className="text-2xl font-bold text-purple-900 mt-1">₹{(stats.totalLimit / 100000).toFixed(1)}L</p>
            </div>
            <IndianRupee className="h-8 w-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-600">Total Spent</p>
              <p className="text-2xl font-bold text-orange-900 mt-1">₹{(stats.totalSpent / 100000).toFixed(1)}L</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-orange-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex gap-4">
          <div className="flex gap-2">
            <span className="text-sm font-medium text-gray-700">Type:</span>
            {['all', 'credit', 'debit', 'fuel'].map(type => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-3 py-1 rounded-lg text-sm font-medium ${
                  selectedType === type
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <span className="text-sm font-medium text-gray-700">Status:</span>
            {['all', 'active', 'blocked', 'expired'].map(status => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`px-3 py-1 rounded-lg text-sm font-medium ${
                  selectedStatus === status
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredCards.map(card => (
          <div key={card.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <CreditCard className="h-6 w-6 text-gray-400" />
                  <h3 className="text-lg font-bold text-gray-900">{card.cardNumber}</h3>
                </div>
                <div className="flex gap-2 mb-3">
                  <span className={`px-2 py-1 text-xs font-semibold rounded ${statusColors[card.status]}`}>
                    {card.status.charAt(0).toUpperCase() + card.status.slice(1)}
                  </span>
                  <span className={`px-2 py-1 text-xs font-semibold rounded ${cardTypeColors[card.cardType]}`}>
                    {card.cardType.charAt(0).toUpperCase() + card.cardType.slice(1)}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <p className="text-xs text-gray-500 uppercase font-medium mb-2">Card Holder</p>
              <p className="text-sm font-semibold text-gray-900">{card.assignedTo}</p>
              <p className="text-xs text-gray-600">{card.designation} • {card.department}</p>
              <p className="text-xs text-gray-500">{card.employeeCode}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-xs text-gray-500 uppercase font-medium mb-1">Card Limit</p>
                <p className="text-lg font-bold text-gray-900">₹{card.limit.toLocaleString('en-IN')}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-medium mb-1">Available</p>
                <p className="text-lg font-bold text-green-600">₹{card.available.toLocaleString('en-IN')}</p>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex justify-between text-xs text-gray-600 mb-1">
                <span>Utilization: {getUtilization(card.spent, card.limit)}%</span>
                <span>₹{card.spent.toLocaleString('en-IN')} spent</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    getUtilization(card.spent, card.limit) >= 90 ? 'bg-red-600' :
                    getUtilization(card.spent, card.limit) >= 70 ? 'bg-orange-600' :
                    'bg-green-600'
                  }`}
                  style={{ width: `${getUtilization(card.spent, card.limit)}%` }}
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-200 text-xs text-gray-600">
              <div>
                <p>Provider: {card.cardProvider}</p>
                <p>Expires: {card.expiryDate}</p>
              </div>
              {card.lastUsedDate && <p>Last used: {card.lastUsedDate}</p>}
            </div>

            <div className="flex gap-2 mt-4">
              <button className="flex-1 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium text-gray-700">
                View Transactions
              </button>
              {card.status === 'active' && (
                <button className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium">
                  Block Card
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

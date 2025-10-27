'use client';

import { useState } from 'react';
import { CreditCard, Calendar, MapPin, TrendingUp, TrendingDown, Filter, Download, Receipt } from 'lucide-react';

interface Transaction {
  id: string;
  transactionId: string;
  cardNumber: string;
  cardType: 'credit' | 'debit' | 'fuel';
  cardHolder: string;
  employeeCode: string;
  department: string;
  merchantName: string;
  category: 'fuel' | 'food' | 'travel' | 'supplies' | 'accommodation' | 'other';
  amount: number;
  currency: string;
  transactionDate: string;
  transactionTime: string;
  location: string;
  status: 'approved' | 'pending' | 'rejected' | 'flagged';
  receiptUploaded: boolean;
  notes?: string;
}

export default function Page() {
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedCardType, setSelectedCardType] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const mockTransactions: Transaction[] = [
    {
      id: '1',
      transactionId: 'TXN001234',
      cardNumber: '**** **** **** 4521',
      cardType: 'credit',
      cardHolder: 'Rajesh Kumar',
      employeeCode: 'EMP345',
      department: 'Sales',
      merchantName: 'HP Petrol Pump',
      category: 'fuel',
      amount: 3500,
      currency: 'INR',
      transactionDate: '2025-10-24',
      transactionTime: '14:35',
      location: 'Mumbai, Maharashtra',
      status: 'approved',
      receiptUploaded: true,
      notes: 'Client visit - Mumbai to Pune'
    },
    {
      id: '2',
      transactionId: 'TXN001235',
      cardNumber: '**** **** **** 7823',
      cardType: 'credit',
      cardHolder: 'Priya Sharma',
      employeeCode: 'EMP412',
      department: 'Marketing',
      merchantName: 'Taj Hotel Restaurant',
      category: 'food',
      amount: 2850,
      currency: 'INR',
      transactionDate: '2025-10-24',
      transactionTime: '13:15',
      location: 'Delhi',
      status: 'approved',
      receiptUploaded: true,
      notes: 'Business lunch with client'
    },
    {
      id: '3',
      transactionId: 'TXN001236',
      cardNumber: '**** **** **** 9234',
      cardType: 'fuel',
      cardHolder: 'Amit Patel',
      employeeCode: 'EMP287',
      department: 'Logistics',
      merchantName: 'Indian Oil Station',
      category: 'fuel',
      amount: 4200,
      currency: 'INR',
      transactionDate: '2025-10-23',
      transactionTime: '09:45',
      location: 'Bangalore, Karnataka',
      status: 'approved',
      receiptUploaded: true
    },
    {
      id: '4',
      transactionId: 'TXN001237',
      cardNumber: '**** **** **** 4521',
      cardType: 'credit',
      cardHolder: 'Rajesh Kumar',
      employeeCode: 'EMP345',
      department: 'Sales',
      merchantName: 'Office Depot',
      category: 'supplies',
      amount: 8750,
      currency: 'INR',
      transactionDate: '2025-10-23',
      transactionTime: '11:20',
      location: 'Pune, Maharashtra',
      status: 'pending',
      receiptUploaded: false,
      notes: 'Office supplies for branch'
    },
    {
      id: '5',
      transactionId: 'TXN001238',
      cardNumber: '**** **** **** 6712',
      cardType: 'credit',
      cardHolder: 'Sneha Reddy',
      employeeCode: 'EMP523',
      department: 'HR',
      merchantName: 'IndiGo Airlines',
      category: 'travel',
      amount: 6450,
      currency: 'INR',
      transactionDate: '2025-10-22',
      transactionTime: '16:30',
      location: 'Hyderabad, Telangana',
      status: 'approved',
      receiptUploaded: true,
      notes: 'Recruitment drive - Hyderabad'
    },
    {
      id: '6',
      transactionId: 'TXN001239',
      cardNumber: '**** **** **** 7823',
      cardType: 'credit',
      cardHolder: 'Priya Sharma',
      employeeCode: 'EMP412',
      department: 'Marketing',
      merchantName: 'ITC Grand',
      category: 'accommodation',
      amount: 12000,
      currency: 'INR',
      transactionDate: '2025-10-22',
      transactionTime: '18:00',
      location: 'Chennai, Tamil Nadu',
      status: 'flagged',
      receiptUploaded: false,
      notes: 'Amount exceeds policy limit'
    },
    {
      id: '7',
      transactionId: 'TXN001240',
      cardNumber: '**** **** **** 9234',
      cardType: 'fuel',
      cardHolder: 'Amit Patel',
      employeeCode: 'EMP287',
      department: 'Logistics',
      merchantName: 'Bharat Petroleum',
      category: 'fuel',
      amount: 3800,
      currency: 'INR',
      transactionDate: '2025-10-21',
      transactionTime: '08:15',
      location: 'Bangalore, Karnataka',
      status: 'approved',
      receiptUploaded: true
    },
    {
      id: '8',
      transactionId: 'TXN001241',
      cardNumber: '**** **** **** 5634',
      cardType: 'debit',
      cardHolder: 'Vikram Singh',
      employeeCode: 'EMP198',
      department: 'IT',
      merchantName: 'Amazon Business',
      category: 'supplies',
      amount: 15600,
      currency: 'INR',
      transactionDate: '2025-10-21',
      transactionTime: '10:45',
      location: 'Gurgaon, Haryana',
      status: 'approved',
      receiptUploaded: true,
      notes: 'IT equipment purchase'
    }
  ];

  const filteredTransactions = mockTransactions.filter(t => {
    const statusMatch = selectedStatus === 'all' || t.status === selectedStatus;
    const cardTypeMatch = selectedCardType === 'all' || t.cardType === selectedCardType;
    const categoryMatch = selectedCategory === 'all' || t.category === selectedCategory;
    return statusMatch && cardTypeMatch && categoryMatch;
  });

  const stats = {
    total: filteredTransactions.reduce((sum, t) => sum + t.amount, 0),
    count: filteredTransactions.length,
    pending: mockTransactions.filter(t => t.status === 'pending').length,
    flagged: mockTransactions.filter(t => t.status === 'flagged').length
  };

  const statusColors = {
    approved: 'bg-green-100 text-green-700',
    pending: 'bg-yellow-100 text-yellow-700',
    rejected: 'bg-red-100 text-red-700',
    flagged: 'bg-orange-100 text-orange-700'
  };

  const categoryColors = {
    fuel: 'bg-blue-100 text-blue-700',
    food: 'bg-orange-100 text-orange-700',
    travel: 'bg-purple-100 text-purple-700',
    supplies: 'bg-green-100 text-green-700',
    accommodation: 'bg-pink-100 text-pink-700',
    other: 'bg-gray-100 text-gray-700'
  };

  const cardTypeColors = {
    credit: 'bg-blue-100 text-blue-700',
    debit: 'bg-green-100 text-green-700',
    fuel: 'bg-orange-100 text-orange-700'
  };

  return (
    <div className="w-full h-full px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Card Transactions</h1>
        <p className="text-sm text-gray-600 mt-1">View and manage corporate card transactions</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Total Spent</p>
              <p className="text-2xl font-bold text-blue-900 mt-1">₹{stats.total.toLocaleString('en-IN')}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">Transactions</p>
              <p className="text-2xl font-bold text-purple-900 mt-1">{stats.count}</p>
            </div>
            <Receipt className="h-8 w-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4 border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-900 mt-1">{stats.pending}</p>
            </div>
            <Filter className="h-8 w-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-600">Flagged</p>
              <p className="text-2xl font-bold text-orange-900 mt-1">{stats.flagged}</p>
            </div>
            <TrendingDown className="h-8 w-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
              <option value="flagged">Flagged</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Card Type</label>
            <select
              value={selectedCardType}
              onChange={(e) => setSelectedCardType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Types</option>
              <option value="credit">Credit</option>
              <option value="debit">Debit</option>
              <option value="fuel">Fuel</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              <option value="fuel">Fuel</option>
              <option value="food">Food</option>
              <option value="travel">Travel</option>
              <option value="supplies">Supplies</option>
              <option value="accommodation">Accommodation</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="flex items-end">
            <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm flex items-center justify-center gap-2">
              <Download className="h-4 w-4" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Transactions List */}
      <div className="space-y-4">
        {filteredTransactions.map(transaction => (
          <div key={transaction.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-12 w-12 bg-blue-50 rounded-lg flex items-center justify-center">
                    <CreditCard className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{transaction.merchantName}</h3>
                    <p className="text-sm text-gray-600">Transaction ID: {transaction.transactionId}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <span>{transaction.cardHolder} • {transaction.employeeCode}</span>
                  <span className="text-gray-400">•</span>
                  <span>{transaction.department}</span>
                  <span className="text-gray-400">•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {transaction.location}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900">₹{transaction.amount.toLocaleString('en-IN')}</p>
                <p className="text-xs text-gray-500 mt-1">{transaction.currency}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 py-4 border-y border-gray-200">
              <div>
                <p className="text-xs text-gray-500 uppercase font-medium mb-1">Card</p>
                <p className="text-sm font-semibold text-gray-900">{transaction.cardNumber}</p>
                <span className={`inline-block mt-1 px-2 py-1 text-xs font-semibold rounded ${cardTypeColors[transaction.cardType]}`}>
                  {transaction.cardType.charAt(0).toUpperCase() + transaction.cardType.slice(1)}
                </span>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-medium mb-1">Category</p>
                <span className={`inline-block px-2 py-1 text-xs font-semibold rounded ${categoryColors[transaction.category]}`}>
                  {transaction.category.charAt(0).toUpperCase() + transaction.category.slice(1)}
                </span>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-medium mb-1">Date & Time</p>
                <p className="text-sm font-semibold text-gray-900 flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {new Date(transaction.transactionDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
                <p className="text-xs text-gray-600">{transaction.transactionTime}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-medium mb-1">Status</p>
                <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${statusColors[transaction.status]}`}>
                  {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                </span>
                <div className="mt-1">
                  {transaction.receiptUploaded ? (
                    <span className="text-xs text-green-600 font-medium">✓ Receipt uploaded</span>
                  ) : (
                    <span className="text-xs text-red-600 font-medium">! Receipt missing</span>
                  )}
                </div>
              </div>
            </div>

            {transaction.notes && (
              <div className="bg-gray-50 rounded-lg p-3 mb-4">
                <p className="text-xs text-gray-500 uppercase font-medium mb-1">Notes</p>
                <p className="text-sm text-gray-700">{transaction.notes}</p>
              </div>
            )}

            <div className="flex gap-2">
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium text-sm">
                View Details
              </button>
              {transaction.status === 'pending' && (
                <>
                  <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium text-sm">
                    Approve
                  </button>
                  <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium text-sm">
                    Reject
                  </button>
                </>
              )}
              {transaction.status === 'flagged' && (
                <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-medium text-sm">
                  Review
                </button>
              )}
              {!transaction.receiptUploaded && (
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm">
                  Upload Receipt
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

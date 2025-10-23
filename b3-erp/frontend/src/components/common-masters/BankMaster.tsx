'use client';

import React, { useState } from 'react';
import { Building2, Plus, Search, Eye, Edit3, Download, Upload, CheckCircle, AlertCircle, CreditCard } from 'lucide-react';

interface BankAccount {
  id: string;
  bankName: string;
  branchName: string;
  accountNumber: string;
  accountType: 'savings' | 'current' | 'cc' | 'od';
  ifscCode: string;
  swiftCode?: string;
  micrCode?: string;
  
  accountHolderName: string;
  currency: string;
  
  contactDetails: {
    branchAddress: string;
    city: string;
    state: string;
    pincode: string;
    phone?: string;
    email?: string;
  };
  
  bankingDetails: {
    openingBalance: number;
    currentBalance: number;
    overdraftLimit?: number;
    chequebookPages?: number;
  };
  
  onlineAccess: {
    internetBanking: boolean;
    netbankingId?: string;
    upiId?: string;
  };
  
  isPrimary: boolean;
  status: 'active' | 'inactive' | 'closed';
  
  createdBy: string;
  createdAt: string;
}

const BankMaster: React.FC = () => {
  const [banks, setBanks] = useState<BankAccount[]>([
    {
      id: '1',
      bankName: 'HDFC Bank',
      branchName: 'MG Road Branch',
      accountNumber: '50200012345678',
      accountType: 'current',
      ifscCode: 'HDFC0001234',
      swiftCode: 'HDFCINBB',
      micrCode: '560240002',
      accountHolderName: 'B3 MACBIS Private Limited',
      currency: 'INR',
      contactDetails: {
        branchAddress: '123 MG Road, Richmond Town',
        city: 'Bangalore',
        state: 'Karnataka',
        pincode: '560025',
        phone: '+91-80-12345678',
        email: 'mgroad@hdfcbank.com'
      },
      bankingDetails: {
        openingBalance: 5000000,
        currentBalance: 12500000,
        overdraftLimit: 2000000,
        chequebookPages: 50
      },
      onlineAccess: {
        internetBanking: true,
        netbankingId: 'B3MACBIS001',
        upiId: 'b3macbis@hdfc'
      },
      isPrimary: true,
      status: 'active',
      createdBy: 'admin',
      createdAt: '2024-01-01T10:00:00Z'
    },
    {
      id: '2',
      bankName: 'ICICI Bank',
      branchName: 'Koramangala Branch',
      accountNumber: '001705123456',
      accountType: 'current',
      ifscCode: 'ICIC0001705',
      swiftCode: 'ICICINBB',
      accountHolderName: 'B3 MACBIS Private Limited',
      currency: 'INR',
      contactDetails: {
        branchAddress: 'Sony World Junction, Koramangala',
        city: 'Bangalore',
        state: 'Karnataka',
        pincode: '560034',
        phone: '+91-80-87654321',
        email: 'koramangala@icicibank.com'
      },
      bankingDetails: {
        openingBalance: 3000000,
        currentBalance: 8750000,
        overdraftLimit: 1500000,
        chequebookPages: 50
      },
      onlineAccess: {
        internetBanking: true,
        netbankingId: 'B3MACBIS002'
      },
      isPrimary: false,
      status: 'active',
      createdBy: 'admin',
      createdAt: '2024-01-15T10:00:00Z'
    },
    {
      id: '3',
      bankName: 'State Bank of India',
      branchName: 'Indiranagar Branch',
      accountNumber: '34567890123',
      accountType: 'savings',
      ifscCode: 'SBIN0012345',
      micrCode: '560002045',
      accountHolderName: 'B3 MACBIS Private Limited',
      currency: 'INR',
      contactDetails: {
        branchAddress: '100 Feet Road, Indiranagar',
        city: 'Bangalore',
        state: 'Karnataka',
        pincode: '560038',
        phone: '+91-80-23456789'
      },
      bankingDetails: {
        openingBalance: 500000,
        currentBalance: 2250000
      },
      onlineAccess: {
        internetBanking: true,
        upiId: 'b3macbis@sbi'
      },
      isPrimary: false,
      status: 'active',
      createdBy: 'admin',
      createdAt: '2024-02-01T10:00:00Z'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredBanks = banks.filter(b => {
    const matchesSearch = b.bankName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         b.accountNumber.includes(searchTerm) ||
                         b.ifscCode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || b.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const totalBalance = banks.reduce((sum, b) => sum + b.bankingDetails.currentBalance, 0);
  const totalOverdraft = banks.reduce((sum, b) => sum + (b.bankingDetails.overdraftLimit || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Building2 className="w-8 h-8 text-blue-600" />
                Bank Master
              </h1>
              <p className="text-gray-600 mt-2">Manage banking information and accounts</p>
            </div>
            <div className="flex gap-3">
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
                <Upload className="w-4 h-4" />
                Import
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add Bank Account
              </button>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search banks, account number, IFSC..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Accounts</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{banks.length}</p>
              </div>
              <Building2 className="w-12 h-12 text-blue-600 opacity-20" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Balance</p>
                <p className="text-2xl font-bold text-green-600 mt-1">₹{(totalBalance / 10000000).toFixed(2)}Cr</p>
              </div>
              <CreditCard className="w-12 h-12 text-green-600 opacity-20" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">OD Limit</p>
                <p className="text-2xl font-bold text-orange-600 mt-1">₹{(totalOverdraft / 100000).toFixed(1)}L</p>
              </div>
              <AlertCircle className="w-12 h-12 text-orange-600 opacity-20" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Accounts</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {banks.filter(b => b.status === 'active').length}
                </p>
              </div>
              <CheckCircle className="w-12 h-12 text-blue-600 opacity-20" />
            </div>
          </div>
        </div>

        {/* Bank Accounts List */}
        <div className="space-y-4">
          {filteredBanks.map(bank => (
            <div key={bank.id} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{bank.bankName}</h3>
                    {bank.isPrimary && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
                        Primary
                      </span>
                    )}
                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                      bank.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : bank.status === 'inactive'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {bank.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{bank.branchName} • {bank.accountHolderName}</p>
                </div>
                <div className="flex gap-2">
                  <button className="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                    <Eye className="w-4 h-4 text-gray-600" />
                    <span className="text-gray-700">View</span>
                  </button>
                  <button className="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                    <Edit3 className="w-4 h-4 text-gray-600" />
                    <span className="text-gray-700">Edit</span>
                  </button>
                  <button className="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                    <Download className="w-4 h-4 text-gray-600" />
                    <span className="text-gray-700">Download</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                {/* Account Details */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Account Details</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Account No:</span>
                      <span className="font-medium font-mono">{bank.accountNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Type:</span>
                      <span className="font-medium uppercase">{bank.accountType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">IFSC:</span>
                      <span className="font-medium font-mono">{bank.ifscCode}</span>
                    </div>
                    {bank.swiftCode && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">SWIFT:</span>
                        <span className="font-medium font-mono">{bank.swiftCode}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Balance Information */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Balance Information</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Current:</span>
                      <span className="font-medium text-green-600">
                        ₹{(bank.bankingDetails.currentBalance / 100000).toFixed(2)}L
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Opening:</span>
                      <span className="font-medium">
                        ₹{(bank.bankingDetails.openingBalance / 100000).toFixed(2)}L
                      </span>
                    </div>
                    {bank.bankingDetails.overdraftLimit && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">OD Limit:</span>
                        <span className="font-medium text-orange-600">
                          ₹{(bank.bankingDetails.overdraftLimit / 100000).toFixed(2)}L
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Contact Details */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Branch Contact</h4>
                  <div className="space-y-1 text-sm">
                    <div className="text-gray-600">
                      {bank.contactDetails.branchAddress}
                    </div>
                    <div className="text-gray-600">
                      {bank.contactDetails.city}, {bank.contactDetails.state} - {bank.contactDetails.pincode}
                    </div>
                    {bank.contactDetails.phone && (
                      <div className="text-gray-600">{bank.contactDetails.phone}</div>
                    )}
                    {bank.contactDetails.email && (
                      <div className="text-blue-600 text-xs">{bank.contactDetails.email}</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Online Access */}
              {bank.onlineAccess.internetBanking && (
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex items-center gap-4 text-sm">
                    <span className="flex items-center gap-2 text-green-600">
                      <CheckCircle className="w-4 h-4" />
                      Internet Banking Enabled
                    </span>
                    {bank.onlineAccess.netbankingId && (
                      <span className="text-gray-600">
                        ID: <span className="font-medium font-mono">{bank.onlineAccess.netbankingId}</span>
                      </span>
                    )}
                    {bank.onlineAccess.upiId && (
                      <span className="text-gray-600">
                        UPI: <span className="font-medium font-mono">{bank.onlineAccess.upiId}</span>
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BankMaster;

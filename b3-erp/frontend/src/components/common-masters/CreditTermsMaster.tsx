'use client';

import React, { useState } from 'react';
import { CreditCard, Plus, Search, Eye, Edit3, TrendingUp, AlertCircle, DollarSign } from 'lucide-react';

interface CreditTerm {
  id: string;
  termCode: string;
  termName: string;
  description: string;
  
  creditLimit: number;
  creditPeriod: number; // in days
  
  interestRate?: number; // percentage
  minimumPayment?: number; // percentage of outstanding
  
  overduePenalty?: {
    penaltyType: 'percentage' | 'fixed';
    penaltyValue: number;
    gracePeriodDays: number;
  };
  
  creditCheckRequired: boolean;
  approvalRequired: boolean;
  securityDeposit?: number;
  
  customerCategory: 'A' | 'B' | 'C' | 'all';
  applicableTo: 'customer' | 'supplier' | 'both';
  
  status: 'active' | 'inactive';
  createdBy: string;
  createdAt: string;
}

const CreditTermsMaster: React.FC = () => {
  const [terms, setTerms] = useState<CreditTerm[]>([
    {
      id: '1',
      termCode: 'PREM-30',
      termName: 'Premium Customer - 30 Days',
      description: 'Premium customers with excellent credit history',
      creditLimit: 5000000,
      creditPeriod: 30,
      interestRate: 0,
      minimumPayment: 100,
      creditCheckRequired: false,
      approvalRequired: false,
      customerCategory: 'A',
      applicableTo: 'customer',
      status: 'active',
      createdBy: 'admin',
      createdAt: '2024-01-01T10:00:00Z'
    },
    {
      id: '2',
      termCode: 'STD-45',
      termName: 'Standard Credit - 45 Days',
      description: 'Standard credit terms for regular customers',
      creditLimit: 2000000,
      creditPeriod: 45,
      interestRate: 1.5,
      minimumPayment: 25,
      overduePenalty: {
        penaltyType: 'percentage',
        penaltyValue: 2,
        gracePeriodDays: 7
      },
      creditCheckRequired: true,
      approvalRequired: true,
      securityDeposit: 100000,
      customerCategory: 'B',
      applicableTo: 'customer',
      status: 'active',
      createdBy: 'admin',
      createdAt: '2024-01-01T10:00:00Z'
    },
    {
      id: '3',
      termCode: 'NEW-15',
      termName: 'New Customer - 15 Days',
      description: 'Limited credit for new customers',
      creditLimit: 500000,
      creditPeriod: 15,
      interestRate: 2,
      minimumPayment: 50,
      overduePenalty: {
        penaltyType: 'percentage',
        penaltyValue: 3,
        gracePeriodDays: 3
      },
      creditCheckRequired: true,
      approvalRequired: true,
      securityDeposit: 200000,
      customerCategory: 'C',
      applicableTo: 'customer',
      status: 'active',
      createdBy: 'admin',
      createdAt: '2024-01-01T10:00:00Z'
    },
    {
      id: '4',
      termCode: 'SUP-60',
      termName: 'Supplier Credit - 60 Days',
      description: 'Credit terms for approved suppliers',
      creditLimit: 10000000,
      creditPeriod: 60,
      interestRate: 0,
      creditCheckRequired: false,
      approvalRequired: true,
      customerCategory: 'all',
      applicableTo: 'supplier',
      status: 'active',
      createdBy: 'admin',
      createdAt: '2024-01-05T10:00:00Z'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const filteredTerms = terms.filter(t => {
    const matchesSearch = t.termName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         t.termCode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || t.customerCategory === filterCategory || t.customerCategory === 'all';
    return matchesSearch && matchesCategory;
  });

  const totalCreditLimit = terms.reduce((sum, t) => sum + t.creditLimit, 0);
  const avgCreditPeriod = terms.reduce((sum, t) => sum + t.creditPeriod, 0) / terms.length;

  return (
    <div className="min-h-screen bg-gray-50 p-3">
      <div className="">
        <div className="bg-white rounded-lg shadow-sm p-3 mb-3">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <CreditCard className="w-8 h-8 text-indigo-600" />
                Credit Terms Master
              </h1>
              <p className="text-gray-600 mt-2">Manage credit policies and limits</p>
            </div>
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Credit Term
            </button>
          </div>

          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search credit terms..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Categories</option>
              <option value="A">Category A</option>
              <option value="B">Category B</option>
              <option value="C">Category C</option>
            </select>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
          <div className="bg-white p-3 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Terms</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{terms.length}</p>
              </div>
              <CreditCard className="w-12 h-12 text-indigo-600 opacity-20" />
            </div>
          </div>
          <div className="bg-white p-3 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Credit Limit</p>
                <p className="text-2xl font-bold text-green-600 mt-1">
                  ₹{(totalCreditLimit / 10000000).toFixed(1)}Cr
                </p>
              </div>
              <DollarSign className="w-12 h-12 text-green-600 opacity-20" />
            </div>
          </div>
          <div className="bg-white p-3 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Credit Period</p>
                <p className="text-2xl font-bold text-blue-600 mt-1">{avgCreditPeriod.toFixed(0)} days</p>
              </div>
              <TrendingUp className="w-12 h-12 text-blue-600 opacity-20" />
            </div>
          </div>
          <div className="bg-white p-3 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Approval Required</p>
                <p className="text-2xl font-bold text-orange-600 mt-1">
                  {terms.filter(t => t.approvalRequired).length}
                </p>
              </div>
              <AlertCircle className="w-12 h-12 text-orange-600 opacity-20" />
            </div>
          </div>
        </div>

        {/* Credit Terms List */}
        <div className="space-y-2">
          {filteredTerms.map(term => (
            <div key={term.id} className="bg-white rounded-lg shadow-sm p-3">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{term.termName}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      term.customerCategory === 'A' 
                        ? 'bg-green-100 text-green-800'
                        : term.customerCategory === 'B'
                        ? 'bg-blue-100 text-blue-800'
                        : term.customerCategory === 'C'
                        ? 'bg-orange-100 text-orange-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      Category {term.customerCategory}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      term.applicableTo === 'customer'
                        ? 'bg-purple-100 text-purple-800'
                        : term.applicableTo === 'supplier'
                        ? 'bg-indigo-100 text-indigo-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {term.applicableTo}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{term.termCode}</p>
                  <p className="text-sm text-gray-500">{term.description}</p>
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
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                {/* Credit Limits */}
                <div className="border border-gray-200 rounded-lg p-3">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Credit Limits</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Credit Limit:</span>
                      <span className="font-medium text-green-600">
                        ₹{(term.creditLimit / 100000).toFixed(2)}L
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Credit Period:</span>
                      <span className="font-medium">{term.creditPeriod} days</span>
                    </div>
                    {term.securityDeposit && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Security Deposit:</span>
                        <span className="font-medium">
                          ₹{(term.securityDeposit / 100000).toFixed(2)}L
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Interest & Payment */}
                <div className="border border-gray-200 rounded-lg p-3">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Interest & Payment</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Interest Rate:</span>
                      <span className={`font-medium ${term.interestRate === 0 ? 'text-green-600' : 'text-orange-600'}`}>
                        {term.interestRate}% p.m.
                      </span>
                    </div>
                    {term.minimumPayment && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Min Payment:</span>
                        <span className="font-medium">{term.minimumPayment}%</span>
                      </div>
                    )}
                    {term.overduePenalty && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Overdue Penalty:</span>
                        <span className="font-medium text-red-600">
                          {term.overduePenalty.penaltyValue}%
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Requirements */}
                <div className="border border-gray-200 rounded-lg p-3">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Requirements</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${term.creditCheckRequired ? 'bg-orange-500' : 'bg-green-500'}`}></span>
                      <span className="text-gray-600">
                        Credit Check: {term.creditCheckRequired ? 'Required' : 'Not Required'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${term.approvalRequired ? 'bg-orange-500' : 'bg-green-500'}`}></span>
                      <span className="text-gray-600">
                        Approval: {term.approvalRequired ? 'Required' : 'Not Required'}
                      </span>
                    </div>
                    {term.overduePenalty && (
                      <div className="text-gray-600">
                        Grace Period: {term.overduePenalty.gracePeriodDays} days
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CreditTermsMaster;

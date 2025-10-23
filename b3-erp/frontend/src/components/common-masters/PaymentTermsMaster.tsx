'use client';

import React, { useState } from 'react';
import { Calendar, Plus, Search, Eye, Edit3, Clock, CreditCard, AlertTriangle } from 'lucide-react';

interface PaymentTerm {
  id: string;
  termCode: string;
  termName: string;
  description: string;
  
  paymentType: 'immediate' | 'days' | 'date' | 'installment';
  dueDays?: number;
  dueDate?: number; // Day of month
  
  installments?: {
    installmentNumber: number;
    percentage: number;
    daysAfter: number;
  }[];
  
  discountTerms?: {
    discountPercentage: number;
    discountDays: number;
  };
  
  penaltyTerms?: {
    penaltyPercentage: number;
    gracePeriodDays: number;
  };
  
  applicableTo: 'purchase' | 'sales' | 'both';
  isDefault: boolean;
  status: 'active' | 'inactive';
  
  createdBy: string;
  createdAt: string;
}

const PaymentTermsMaster: React.FC = () => {
  const [terms, setTerms] = useState<PaymentTerm[]>([
    {
      id: '1',
      termCode: 'NET30',
      termName: 'Net 30 Days',
      description: 'Payment due within 30 days of invoice date',
      paymentType: 'days',
      dueDays: 30,
      discountTerms: {
        discountPercentage: 2,
        discountDays: 10
      },
      applicableTo: 'both',
      isDefault: true,
      status: 'active',
      createdBy: 'admin',
      createdAt: '2024-01-01T10:00:00Z'
    },
    {
      id: '2',
      termCode: 'NET45',
      termName: 'Net 45 Days',
      description: 'Payment due within 45 days of invoice date',
      paymentType: 'days',
      dueDays: 45,
      penaltyTerms: {
        penaltyPercentage: 1.5,
        gracePeriodDays: 5
      },
      applicableTo: 'purchase',
      isDefault: false,
      status: 'active',
      createdBy: 'admin',
      createdAt: '2024-01-01T10:00:00Z'
    },
    {
      id: '3',
      termCode: 'IMMEDIATE',
      termName: 'Immediate Payment',
      description: 'Payment due immediately upon delivery',
      paymentType: 'immediate',
      dueDays: 0,
      applicableTo: 'sales',
      isDefault: false,
      status: 'active',
      createdBy: 'admin',
      createdAt: '2024-01-01T10:00:00Z'
    },
    {
      id: '4',
      termCode: 'EOM',
      termName: 'End of Month',
      description: 'Payment due by end of current month',
      paymentType: 'date',
      dueDate: 31,
      applicableTo: 'both',
      isDefault: false,
      status: 'active',
      createdBy: 'admin',
      createdAt: '2024-01-01T10:00:00Z'
    },
    {
      id: '5',
      termCode: '3INST',
      termName: '3 Installments',
      description: 'Payment in 3 equal installments',
      paymentType: 'installment',
      installments: [
        { installmentNumber: 1, percentage: 40, daysAfter: 0 },
        { installmentNumber: 2, percentage: 30, daysAfter: 30 },
        { installmentNumber: 3, percentage: 30, daysAfter: 60 }
      ],
      applicableTo: 'sales',
      isDefault: false,
      status: 'active',
      createdBy: 'admin',
      createdAt: '2024-01-15T10:00:00Z'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  const filteredTerms = terms.filter(t => {
    const matchesSearch = t.termName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         t.termCode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || t.applicableTo === filterType || t.applicableTo === 'both';
    return matchesSearch && matchesType;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Calendar className="w-8 h-8 text-green-600" />
                Payment Terms Master
              </h1>
              <p className="text-gray-600 mt-2">Manage payment conditions and terms</p>
            </div>
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Payment Term
            </button>
          </div>

          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search payment terms..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            >
              <option value="all">All Types</option>
              <option value="purchase">Purchase Only</option>
              <option value="sales">Sales Only</option>
              <option value="both">Both</option>
            </select>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Terms</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{terms.length}</p>
              </div>
              <Calendar className="w-12 h-12 text-green-600 opacity-20" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Purchase Terms</p>
                <p className="text-2xl font-bold text-blue-600 mt-1">
                  {terms.filter(t => t.applicableTo === 'purchase' || t.applicableTo === 'both').length}
                </p>
              </div>
              <CreditCard className="w-12 h-12 text-blue-600 opacity-20" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Sales Terms</p>
                <p className="text-2xl font-bold text-purple-600 mt-1">
                  {terms.filter(t => t.applicableTo === 'sales' || t.applicableTo === 'both').length}
                </p>
              </div>
              <CreditCard className="w-12 h-12 text-purple-600 opacity-20" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">With Discounts</p>
                <p className="text-2xl font-bold text-orange-600 mt-1">
                  {terms.filter(t => t.discountTerms).length}
                </p>
              </div>
              <AlertTriangle className="w-12 h-12 text-orange-600 opacity-20" />
            </div>
          </div>
        </div>

        {/* Payment Terms List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTerms.map(term => (
            <div key={term.id} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{term.termName}</h3>
                    {term.isDefault && (
                      <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">
                        Default
                      </span>
                    )}
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

              {/* Payment Details */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">Type:</span>
                  <span className="font-medium capitalize">{term.paymentType}</span>
                  {term.dueDays !== undefined && (
                    <span className="text-green-600 font-medium">• {term.dueDays} days</span>
                  )}
                </div>

                {term.installments && (
                  <div className="border border-gray-200 rounded p-3">
                    <h4 className="text-xs font-semibold text-gray-700 mb-2">Installment Schedule</h4>
                    <div className="space-y-1">
                      {term.installments.map((inst, index) => (
                        <div key={index} className="flex justify-between text-xs">
                          <span className="text-gray-600">Installment {inst.installmentNumber}:</span>
                          <span className="font-medium">{inst.percentage}% after {inst.daysAfter} days</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {term.discountTerms && (
                  <div className="flex items-center justify-between bg-green-50 rounded p-2 text-sm">
                    <span className="text-green-700">Early Payment Discount:</span>
                    <span className="font-medium text-green-800">
                      {term.discountTerms.discountPercentage}% within {term.discountTerms.discountDays} days
                    </span>
                  </div>
                )}

                {term.penaltyTerms && (
                  <div className="flex items-center justify-between bg-orange-50 rounded p-2 text-sm">
                    <span className="text-orange-700">Late Payment Penalty:</span>
                    <span className="font-medium text-orange-800">
                      {term.penaltyTerms.penaltyPercentage}% after {term.penaltyTerms.gracePeriodDays} days grace
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    term.applicableTo === 'both' 
                      ? 'bg-purple-100 text-purple-800'
                      : term.applicableTo === 'purchase'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-indigo-100 text-indigo-800'
                  }`}>
                    {term.applicableTo === 'both' ? 'Purchase & Sales' : term.applicableTo}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    term.status === 'active' 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {term.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PaymentTermsMaster;

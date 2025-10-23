'use client';

import React, { useState, useEffect } from 'react';
import {
  FileText, Plus, Search, Filter, Edit3, Eye, Trash2, Upload,
  Download, Save, X, CheckCircle, Tag, Grid, List, AlertCircle,
  TrendingUp, DollarSign, Percent, Calculator
} from 'lucide-react';

interface HSNSACCode {
  id: string;
  code: string;
  type: 'HSN' | 'SAC';
  description: string;
  chapterCode: string;
  chapterDescription: string;
  status: 'active' | 'inactive';
  
  // Tax Information
  taxDetails: {
    defaultGSTRate: number;
    cess?: number;
    cgst?: number;
    sgst?: number;
    igst?: number;
    applicableFrom: string;
    applicableTo?: string;
  };
  
  // Classification
  classification: {
    section?: string;
    heading?: string;
    subHeading?: string;
  };
  
  // Usage
  usage: {
    domestic: boolean;
    import: boolean;
    export: boolean;
  };
  
  // Statistics
  statistics: {
    itemsLinked: number;
    transactionsCount: number;
    totalValue?: number;
  };
  
  // Compliance
  compliance: {
    eWayBillRequired: boolean;
    reverseChargeApplicable: boolean;
    exempted: boolean;
    exemptionReason?: string;
  };
  
  notes?: string;
  createdBy: string;
  createdAt: string;
  updatedBy?: string;
  updatedAt?: string;
}

const HSNSACCodeMaster: React.FC = () => {
  const [codes, setCodes] = useState<HSNSACCode[]>([]);
  const [filteredCodes, setFilteredCodes] = useState<HSNSACCode[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

  const mockCodes: HSNSACCode[] = [
    {
      id: '1',
      code: '9403.40',
      type: 'HSN',
      description: 'Wooden furniture of a kind used in the kitchen',
      chapterCode: '94',
      chapterDescription: 'Furniture; bedding, mattresses',
      status: 'active',
      taxDetails: {
        defaultGSTRate: 18,
        cgst: 9,
        sgst: 9,
        igst: 18,
        applicableFrom: '2017-07-01'
      },
      classification: {
        section: 'XX',
        heading: '9403',
        subHeading: '9403.40'
      },
      usage: {
        domestic: true,
        import: true,
        export: true
      },
      statistics: {
        itemsLinked: 125,
        transactionsCount: 3450,
        totalValue: 12500000
      },
      compliance: {
        eWayBillRequired: true,
        reverseChargeApplicable: false,
        exempted: false
      },
      createdBy: 'admin',
      createdAt: '2024-01-01T10:00:00Z'
    },
    {
      id: '2',
      code: '4407.11',
      type: 'HSN',
      description: 'Wood sawn lengthwise - Oak',
      chapterCode: '44',
      chapterDescription: 'Wood and articles of wood',
      status: 'active',
      taxDetails: {
        defaultGSTRate: 12,
        cgst: 6,
        sgst: 6,
        igst: 12,
        applicableFrom: '2017-07-01'
      },
      classification: {
        section: 'IX',
        heading: '4407',
        subHeading: '4407.11'
      },
      usage: {
        domestic: true,
        import: true,
        export: false
      },
      statistics: {
        itemsLinked: 45,
        transactionsCount: 890,
        totalValue: 5600000
      },
      compliance: {
        eWayBillRequired: true,
        reverseChargeApplicable: false,
        exempted: false
      },
      createdBy: 'admin',
      createdAt: '2024-01-01T10:00:00Z'
    },
    {
      id: '3',
      code: '998599',
      type: 'SAC',
      description: 'Installation services (other than installation in respect of goods)',
      chapterCode: '9985',
      chapterDescription: 'Installation services',
      status: 'active',
      taxDetails: {
        defaultGSTRate: 18,
        cgst: 9,
        sgst: 9,
        igst: 18,
        applicableFrom: '2017-07-01'
      },
      classification: {
        section: 'Installation',
        heading: '9985',
        subHeading: '998599'
      },
      usage: {
        domestic: true,
        import: false,
        export: false
      },
      statistics: {
        itemsLinked: 15,
        transactionsCount: 245,
        totalValue: 1200000
      },
      compliance: {
        eWayBillRequired: false,
        reverseChargeApplicable: false,
        exempted: false
      },
      createdBy: 'admin',
      createdAt: '2024-01-01T10:00:00Z'
    }
  ];

  useEffect(() => {
    setCodes(mockCodes);
    setFilteredCodes(mockCodes);
  }, []);

  useEffect(() => {
    let filtered = codes;
    if (searchTerm) {
      filtered = filtered.filter(c =>
        c.code.includes(searchTerm) ||
        c.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (filterType !== 'all') {
      filtered = filtered.filter(c => c.type === filterType);
    }
    if (filterStatus !== 'all') {
      filtered = filtered.filter(c => c.status === filterStatus);
    }
    setFilteredCodes(filtered);
  }, [codes, searchTerm, filterType, filterStatus]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <FileText className="w-8 h-8 text-blue-600" />
                HSN/SAC Code Master
              </h1>
              <p className="text-gray-600 mt-2">Manage tax classification codes for goods and services</p>
            </div>
            <div className="flex gap-3">
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
                <Upload className="w-4 h-4" />
                Import
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add Code
              </button>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search HSN/SAC code or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option value="all">All Types</option>
              <option value="HSN">HSN</option>
              <option value="SAC">SAC</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Codes</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{codes.length}</p>
              </div>
              <FileText className="w-12 h-12 text-blue-600 opacity-20" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">HSN Codes</p>
                <p className="text-2xl font-bold text-green-600 mt-1">
                  {codes.filter(c => c.type === 'HSN').length}
                </p>
              </div>
              <Tag className="w-12 h-12 text-green-600 opacity-20" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">SAC Codes</p>
                <p className="text-2xl font-bold text-purple-600 mt-1">
                  {codes.filter(c => c.type === 'SAC').length}
                </p>
              </div>
              <FileText className="w-12 h-12 text-purple-600 opacity-20" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Items Linked</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {codes.reduce((sum, c) => sum + c.statistics.itemsLinked, 0)}
                </p>
              </div>
              <TrendingUp className="w-12 h-12 text-blue-600 opacity-20" />
            </div>
          </div>
        </div>

        {/* Codes List */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">GST Rate</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Items</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCodes.map(code => (
                <tr key={code.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{code.code}</div>
                    <div className="text-xs text-gray-500">Chapter: {code.chapterCode}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      code.type === 'HSN' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                    }`}>
                      {code.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-md">{code.description}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{code.taxDetails.defaultGSTRate}%</div>
                    <div className="text-xs text-gray-500">
                      CGST: {code.taxDetails.cgst}% | SGST: {code.taxDetails.sgst}%
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{code.statistics.itemsLinked}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      code.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {code.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
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
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default HSNSACCodeMaster;

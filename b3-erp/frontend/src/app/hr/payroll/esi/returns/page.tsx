'use client';

import { useState } from 'react';
import { FileText, Download, Upload, CheckCircle, Clock, AlertCircle, Calendar, Heart } from 'lucide-react';

interface ESIReturn {
  id: string;
  returnPeriod: string;
  periodType: 'half-yearly';
  fromMonth: string;
  toMonth: string;
  establishmentCode: string;
  employeeCount: number;
  totalWages: number;
  employeeContribution: number;
  employerContribution: number;
  totalDue: number;
  filedOn?: string;
  filedBy?: string;
  acknowledgeNumber?: string;
  status: 'draft' | 'pending' | 'filed' | 'accepted';
  dueDate: string;
}

export default function ESIReturnsPage() {
  const [selectedYear, setSelectedYear] = useState('2025');

  const mockReturns: ESIReturn[] = [
    {
      id: 'ESI-RET-2025-H2',
      returnPeriod: 'Oct 2025 - Mar 2026',
      periodType: 'half-yearly',
      fromMonth: 'October 2025',
      toMonth: 'March 2026',
      establishmentCode: 'ESINBNG12345',
      employeeCount: 5,
      totalWages: 945900,
      employeeContribution: 7094,
      employerContribution: 28377,
      totalDue: 35471,
      status: 'pending',
      dueDate: '2026-04-30'
    },
    {
      id: 'ESI-RET-2025-H1',
      returnPeriod: 'Apr 2025 - Sep 2025',
      periodType: 'half-yearly',
      fromMonth: 'April 2025',
      toMonth: 'September 2025',
      establishmentCode: 'ESINBNG12345',
      employeeCount: 5,
      totalWages: 945900,
      employeeContribution: 7094,
      employerContribution: 28377,
      totalDue: 35471,
      filedOn: '2025-10-15',
      filedBy: 'HR Admin',
      acknowledgeNumber: 'ESI-ACK-202510150001',
      status: 'accepted',
      dueDate: '2025-10-31'
    },
    {
      id: 'ESI-RET-2024-H2',
      returnPeriod: 'Oct 2024 - Mar 2025',
      periodType: 'half-yearly',
      fromMonth: 'October 2024',
      toMonth: 'March 2025',
      establishmentCode: 'ESINBNG12345',
      employeeCount: 4,
      totalWages: 756720,
      employeeContribution: 5675,
      employerContribution: 22702,
      totalDue: 28377,
      filedOn: '2025-04-20',
      filedBy: 'HR Admin',
      acknowledgeNumber: 'ESI-ACK-202504200001',
      status: 'accepted',
      dueDate: '2025-04-30'
    },
    {
      id: 'ESI-RET-2024-H1',
      returnPeriod: 'Apr 2024 - Sep 2024',
      periodType: 'half-yearly',
      fromMonth: 'April 2024',
      toMonth: 'September 2024',
      establishmentCode: 'ESINBNG12345',
      employeeCount: 4,
      totalWages: 756720,
      employeeContribution: 5675,
      employerContribution: 22702,
      totalDue: 28377,
      filedOn: '2024-10-18',
      filedBy: 'HR Admin',
      status: 'filed',
      dueDate: '2024-10-31'
    }
  ];

  const filteredReturns = mockReturns.filter(ret =>
    ret.returnPeriod.includes(selectedYear)
  );

  const stats = {
    total: filteredReturns.length,
    accepted: filteredReturns.filter(r => r.status === 'accepted').length,
    filed: filteredReturns.filter(r => r.status === 'filed').length,
    pending: filteredReturns.filter(r => r.status === 'pending').length
  };

  const statusColors = {
    draft: 'bg-gray-100 text-gray-700 border-gray-200',
    pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    filed: 'bg-blue-100 text-blue-700 border-blue-200',
    accepted: 'bg-green-100 text-green-700 border-green-200'
  };

  const statusIcons = {
    draft: <AlertCircle className="h-4 w-4" />,
    pending: <Clock className="h-4 w-4" />,
    filed: <FileText className="h-4 w-4" />,
    accepted: <CheckCircle className="h-4 w-4" />
  };

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  return (
    <div className="w-full h-full px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">ESI Returns</h1>
        <p className="text-sm text-gray-600 mt-1">Half-yearly ESI return filing and tracking</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg p-4 border border-pink-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-pink-600">Total Returns</p>
              <p className="text-2xl font-bold text-pink-900 mt-1">{stats.total}</p>
            </div>
            <FileText className="h-8 w-8 text-pink-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Accepted</p>
              <p className="text-2xl font-bold text-green-900 mt-1">{stats.accepted}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Filed</p>
              <p className="text-2xl font-bold text-blue-900 mt-1">{stats.filed}</p>
            </div>
            <Upload className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4 border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-900 mt-1">{stats.pending}</p>
            </div>
            <Clock className="h-8 w-8 text-yellow-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Financial Year</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="2025">2025-2026</option>
              <option value="2024">2024-2025</option>
              <option value="2023">2023-2024</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <Download className="h-4 w-4" />
              Download Template
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
              <Upload className="h-4 w-4" />
              Upload Return
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {filteredReturns.map(returnData => (
          <div key={returnData.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-bold text-gray-900">{returnData.returnPeriod}</h3>
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusColors[returnData.status]}`}>
                    <span className="inline-flex items-center gap-1">
                      {statusIcons[returnData.status]}
                      {returnData.status.toUpperCase()}
                    </span>
                  </span>
                  <span className="px-3 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-700">
                    HALF-YEARLY
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  Return ID: {returnData.id} • Establishment: {returnData.establishmentCode}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Period: {returnData.fromMonth} to {returnData.toMonth}
                </p>
                {returnData.acknowledgeNumber && (
                  <p className="text-xs text-gray-500 mt-1">
                    Acknowledgement: {returnData.acknowledgeNumber}
                  </p>
                )}
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500 mb-1">Total Due</p>
                <p className="text-2xl font-bold text-pink-600">{formatCurrency(returnData.totalDue)}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <h4 className="text-xs font-semibold text-blue-900 mb-3">Coverage</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-blue-700">Employees</span>
                    <span className="font-medium text-blue-900">{returnData.employeeCount}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-blue-700">Total Wages</span>
                    <span className="font-medium text-blue-900">{formatCurrency(returnData.totalWages)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <h4 className="text-xs font-semibold text-green-900 mb-3">Employee Share</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-green-700">Rate</span>
                    <span className="font-medium text-green-900">0.75%</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-green-700">Contribution</span>
                    <span className="font-medium text-green-900">{formatCurrency(returnData.employeeContribution)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                <h4 className="text-xs font-semibold text-purple-900 mb-3">Employer Share</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-purple-700">Rate</span>
                    <span className="font-medium text-purple-900">3.0%</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-purple-700">Contribution</span>
                    <span className="font-medium text-purple-900">{formatCurrency(returnData.employerContribution)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-pink-50 rounded-lg p-4 border border-pink-200">
                <h4 className="text-xs font-semibold text-pink-900 mb-3">Total Payable</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-pink-700">Employee</span>
                    <span className="font-medium text-pink-900">{formatCurrency(returnData.employeeContribution)}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-pink-700">Employer</span>
                    <span className="font-medium text-pink-900">{formatCurrency(returnData.employerContribution)}</span>
                  </div>
                  <div className="pt-2 border-t border-pink-300">
                    <div className="flex justify-between text-xs">
                      <span className="font-bold text-pink-900">Total</span>
                      <span className="font-bold text-pink-900">{formatCurrency(returnData.totalDue)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-gray-50 to-pink-50 rounded-lg p-4 border border-gray-200 mb-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-gray-600 mb-1">Due Date</p>
                  <p className="text-sm font-bold text-gray-900 flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-pink-600" />
                    {new Date(returnData.dueDate).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </p>
                </div>
                {returnData.filedOn && (
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Filed On</p>
                    <p className="text-sm font-bold text-green-900">
                      {new Date(returnData.filedOn).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                )}
                {returnData.filedBy && (
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Filed By</p>
                    <p className="text-sm font-bold text-gray-900">{returnData.filedBy}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              {returnData.status === 'pending' && (
                <>
                  <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium text-sm">
                    <Upload className="inline h-4 w-4 mr-2" />
                    File Return
                  </button>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm">
                    <Download className="inline h-4 w-4 mr-2" />
                    Download Draft
                  </button>
                </>
              )}
              {returnData.status === 'filed' && (
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm">
                  Check Status
                </button>
              )}
              {returnData.status === 'accepted' && (
                <>
                  <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium text-sm">
                    <Download className="inline h-4 w-4 mr-2" />
                    Download Challan
                  </button>
                  <button className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 font-medium text-sm">
                    <FileText className="inline h-4 w-4 mr-2" />
                    View Receipt
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 bg-pink-50 border border-pink-200 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-pink-900 mb-2">ESI Return Filing Guidelines</h3>
        <ul className="text-sm text-pink-800 space-y-1">
          <li>• <strong>Filing Frequency:</strong> Half-yearly returns (April-September & October-March)</li>
          <li>• <strong>Due Date:</strong> Within 30 days from the end of return period (31st Oct & 30th Apr)</li>
          <li>• <strong>Return Format:</strong> File online via ESIC portal using establishment credentials</li>
          <li>• <strong>Period 1:</strong> April to September - Due by 31st October</li>
          <li>• <strong>Period 2:</strong> October to March - Due by 30th April</li>
          <li>• <strong>Monthly Challans:</strong> Pay ESI contribution monthly by 21st, file return half-yearly</li>
          <li>• <strong>Coverage Details:</strong> Include all ESI-eligible employees (earning up to ₹21,000/month)</li>
          <li>• <strong>Acknowledgement:</strong> Return acknowledgement generated after successful filing</li>
        </ul>
      </div>
    </div>
  );
}

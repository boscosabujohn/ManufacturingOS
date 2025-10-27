'use client';

import { useState } from 'react';
import { FileText, Download, Upload, CheckCircle, Clock, AlertCircle, Calendar } from 'lucide-react';

interface PFReturn {
  id: string;
  monthYear: string;
  returnMonth: string;
  returnYear: string;
  establishmentCode: string;
  employeeCount: number;
  totalWages: number;
  epfWages: number;
  epsWages: number;
  edliWages: number;
  epfContribution: number;
  epsContribution: number;
  epfDiff: number;
  ncp: number;
  refund: number;
  totalDue: number;
  filedOn?: string;
  filedBy?: string;
  acknowledgeNumber?: string;
  status: 'draft' | 'pending' | 'filed' | 'accepted';
  dueDate: string;
}

export default function PFReturnsPage() {
  const [selectedYear, setSelectedYear] = useState('2025');

  const mockReturns: PFReturn[] = [
    {
      id: 'ECR-2025-11',
      monthYear: 'November 2025',
      returnMonth: '11',
      returnYear: '2025',
      establishmentCode: 'KARBNG12345',
      employeeCount: 6,
      totalWages: 131250,
      epfWages: 131250,
      epsWages: 90000,
      edliWages: 131250,
      epfContribution: 13550,
      epsContribution: 11083,
      epfDiff: 2467,
      ncp: 0,
      refund: 0,
      totalDue: 22597,
      filedOn: '2025-12-10',
      filedBy: 'HR Admin',
      acknowledgeNumber: 'ACK202512100001',
      status: 'accepted',
      dueDate: '2025-12-15'
    },
    {
      id: 'ECR-2025-10',
      monthYear: 'October 2025',
      returnMonth: '10',
      returnYear: '2025',
      establishmentCode: 'KARBNG12345',
      employeeCount: 6,
      totalWages: 131250,
      epfWages: 131250,
      epsWages: 90000,
      edliWages: 131250,
      epfContribution: 13550,
      epsContribution: 11083,
      epfDiff: 2467,
      ncp: 0,
      refund: 0,
      totalDue: 22597,
      filedOn: '2025-11-12',
      filedBy: 'HR Admin',
      acknowledgeNumber: 'ACK202511120001',
      status: 'accepted',
      dueDate: '2025-11-15'
    },
    {
      id: 'ECR-2025-09',
      monthYear: 'September 2025',
      returnMonth: '09',
      returnYear: '2025',
      establishmentCode: 'KARBNG12345',
      employeeCount: 6,
      totalWages: 131250,
      epfWages: 131250,
      epsWages: 90000,
      edliWages: 131250,
      epfContribution: 13550,
      epsContribution: 11083,
      epfDiff: 2467,
      ncp: 0,
      refund: 0,
      totalDue: 22597,
      filedOn: '2025-10-13',
      filedBy: 'HR Admin',
      status: 'filed',
      dueDate: '2025-10-15'
    },
    {
      id: 'ECR-2025-08',
      monthYear: 'August 2025',
      returnMonth: '08',
      returnYear: '2025',
      establishmentCode: 'KARBNG12345',
      employeeCount: 5,
      totalWages: 110417,
      epfWages: 110417,
      epsWages: 75000,
      edliWages: 110417,
      epfContribution: 11300,
      epsContribution: 9236,
      epfDiff: 2064,
      ncp: 0,
      refund: 0,
      totalDue: 18831,
      status: 'pending',
      dueDate: '2025-09-15'
    }
  ];

  const filteredReturns = mockReturns.filter(ret => ret.returnYear === selectedYear);

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
        <h1 className="text-2xl font-bold text-gray-900">PF Returns (ECR)</h1>
        <p className="text-sm text-gray-600 mt-1">Electronic Challan cum Return filing and tracking</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Total Returns</p>
              <p className="text-2xl font-bold text-blue-900 mt-1">{stats.total}</p>
            </div>
            <FileText className="h-8 w-8 text-blue-600" />
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

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">Filed</p>
              <p className="text-2xl font-bold text-purple-900 mt-1">{stats.filed}</p>
            </div>
            <Upload className="h-8 w-8 text-purple-600" />
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
              Download ECR Template
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
              <Upload className="h-4 w-4" />
              Upload ECR
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
                  <h3 className="text-lg font-bold text-gray-900">{returnData.monthYear}</h3>
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusColors[returnData.status]}`}>
                    <span className="inline-flex items-center gap-1">
                      {statusIcons[returnData.status]}
                      {returnData.status.toUpperCase()}
                    </span>
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  ECR ID: {returnData.id} • Establishment: {returnData.establishmentCode}
                </p>
                {returnData.acknowledgeNumber && (
                  <p className="text-xs text-gray-500 mt-1">
                    Acknowledgement: {returnData.acknowledgeNumber}
                  </p>
                )}
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500 mb-1">Total Due</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(returnData.totalDue)}</p>
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
                <h4 className="text-xs font-semibold text-green-900 mb-3">EPF Wages</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-green-700">EPF Wages</span>
                    <span className="font-medium text-green-900">{formatCurrency(returnData.epfWages)}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-green-700">Contribution</span>
                    <span className="font-medium text-green-900">{formatCurrency(returnData.epfContribution)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                <h4 className="text-xs font-semibold text-purple-900 mb-3">EPS Details</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-purple-700">EPS Wages</span>
                    <span className="font-medium text-purple-900">{formatCurrency(returnData.epsWages)}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-purple-700">Contribution</span>
                    <span className="font-medium text-purple-900">{formatCurrency(returnData.epsContribution)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                <h4 className="text-xs font-semibold text-orange-900 mb-3">Other Details</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-orange-700">EPF Difference</span>
                    <span className="font-medium text-orange-900">{formatCurrency(returnData.epfDiff)}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-orange-700">EDLI Wages</span>
                    <span className="font-medium text-orange-900">{formatCurrency(returnData.edliWages)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg p-4 border border-gray-200 mb-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-gray-600 mb-1">Due Date</p>
                  <p className="text-sm font-bold text-gray-900 flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-blue-600" />
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
                    File ECR
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
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm">
                    <FileText className="inline h-4 w-4 mr-2" />
                    View Receipt
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-blue-900 mb-2">ECR Filing Guidelines</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• <strong>ECR (Electronic Challan cum Return):</strong> Combined challan and return filed online via EPFO portal</li>
          <li>• <strong>Due Date:</strong> 15th of the following month (if delayed, additional charges apply)</li>
          <li>• <strong>ECR Format:</strong> Download template from EPFO portal, fill employee-wise details, upload</li>
          <li>• <strong>Payment:</strong> Pay PF dues online after ECR filing via EPFO portal</li>
          <li>• <strong>Acknowledgement:</strong> ECR acknowledgement number generated upon successful filing</li>
          <li>• <strong>Employee Share:</strong> 12% of Basic + DA deducted from salary</li>
          <li>• <strong>Employer Share:</strong> 8.33% EPS + 3.67% EPF + 0.5% EDLI + 0.5% Admin charges</li>
          <li>• <strong>NCP Days:</strong> Non-contribution period days to be mentioned for employees with LOP</li>
        </ul>
      </div>
    </div>
  );
}

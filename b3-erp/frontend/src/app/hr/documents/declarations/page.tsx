'use client';

import { useState, useMemo } from 'react';
import { FileSignature, Plus, Eye, Edit, CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface Declaration {
  id: string;
  declarationType: string;
  financialYear: string;
  submittedOn: string;
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  amount?: number;
  proofStatus?: 'pending' | 'submitted' | 'verified';
  approvedBy?: string;
  approvedOn?: string;
  remarks?: string;
}

export default function DeclarationsPage() {
  const [selectedFY, setSelectedFY] = useState('2025-26');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const mockDeclarations: Declaration[] = [
    {
      id: 'DEC001',
      declarationType: 'HRA Declaration',
      financialYear: '2025-26',
      submittedOn: '2025-04-15',
      status: 'approved',
      amount: 180000,
      proofStatus: 'verified',
      approvedBy: 'Rajesh Kumar',
      approvedOn: '2025-04-18'
    },
    {
      id: 'DEC002',
      declarationType: '80C Investment Declaration',
      financialYear: '2025-26',
      submittedOn: '2025-04-15',
      status: 'approved',
      amount: 150000,
      proofStatus: 'verified',
      approvedBy: 'Rajesh Kumar',
      approvedOn: '2025-04-18'
    },
    {
      id: 'DEC003',
      declarationType: 'Home Loan Interest (24b)',
      financialYear: '2025-26',
      submittedOn: '2025-04-20',
      status: 'submitted',
      amount: 200000,
      proofStatus: 'submitted'
    },
    {
      id: 'DEC004',
      declarationType: 'Medical Insurance Premium (80D)',
      financialYear: '2025-26',
      submittedOn: '2025-04-20',
      status: 'submitted',
      amount: 25000,
      proofStatus: 'submitted'
    },
    {
      id: 'DEC005',
      declarationType: 'NPS Contribution (80CCD)',
      financialYear: '2025-26',
      submittedOn: '2025-10-15',
      status: 'draft',
      amount: 50000,
      proofStatus: 'pending'
    }
  ];

  const filteredDeclarations = useMemo(() => {
    return mockDeclarations.filter(dec => {
      const matchesFY = selectedFY === 'all' || dec.financialYear === selectedFY;
      const matchesStatus = selectedStatus === 'all' || dec.status === selectedStatus;
      return matchesFY && matchesStatus;
    });
  }, [selectedFY, selectedStatus]);

  const stats = {
    total: mockDeclarations.filter(d => d.financialYear === selectedFY).length,
    approved: mockDeclarations.filter(d => d.financialYear === selectedFY && d.status === 'approved').length,
    submitted: mockDeclarations.filter(d => d.financialYear === selectedFY && d.status === 'submitted').length,
    draft: mockDeclarations.filter(d => d.financialYear === selectedFY && d.status === 'draft').length,
    totalAmount: mockDeclarations
      .filter(d => d.financialYear === selectedFY && d.status === 'approved')
      .reduce((sum, d) => sum + (d.amount || 0), 0)
  };

  const statusColors = {
    draft: 'bg-gray-100 text-gray-700',
    submitted: 'bg-yellow-100 text-yellow-700',
    approved: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700'
  };

  const proofStatusColors = {
    pending: 'bg-gray-100 text-gray-700',
    submitted: 'bg-blue-100 text-blue-700',
    verified: 'bg-green-100 text-green-700'
  };

  return (
    <div className="w-full h-full px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tax Declarations</h1>
          <p className="text-sm text-gray-600 mt-1">Manage your tax saving investment declarations</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Declaration
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Total Declarations</p>
              <p className="text-2xl font-bold text-blue-900 mt-1">{stats.total}</p>
            </div>
            <FileSignature className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Approved</p>
              <p className="text-2xl font-bold text-green-900 mt-1">{stats.approved}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4 border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-900 mt-1">{stats.submitted}</p>
            </div>
            <Clock className="h-8 w-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Draft</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.draft}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">Tax Saved</p>
              <p className="text-2xl font-bold text-purple-900 mt-1">₹{(stats.totalAmount * 0.3 / 1000).toFixed(0)}K</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Financial Year</label>
            <select
              value={selectedFY}
              onChange={(e) => setSelectedFY(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="2025-26">FY 2025-26</option>
              <option value="2024-25">FY 2024-25</option>
              <option value="2023-24">FY 2023-24</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="submitted">Submitted</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredDeclarations.map(dec => (
          <div key={dec.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-bold text-gray-900">{dec.declarationType}</h3>
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusColors[dec.status]}`}>
                    {dec.status.charAt(0).toUpperCase() + dec.status.slice(1).replace('_', ' ')}
                  </span>
                  {dec.proofStatus && (
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${proofStatusColors[dec.proofStatus]}`}>
                      Proof: {dec.proofStatus.charAt(0).toUpperCase() + dec.proofStatus.slice(1)}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600">FY {dec.financialYear}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <p className="text-xs text-gray-500 uppercase font-medium mb-1">Declared Amount</p>
                <p className="text-lg font-bold text-blue-600">₹{dec.amount?.toLocaleString('en-IN')}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-medium mb-1">Submitted On</p>
                <p className="text-sm font-semibold text-gray-900">
                  {new Date(dec.submittedOn).toLocaleDateString('en-IN')}
                </p>
              </div>
              {dec.approvedBy && (
                <div>
                  <p className="text-xs text-gray-500 uppercase font-medium mb-1">Approved By</p>
                  <p className="text-sm font-semibold text-gray-900">{dec.approvedBy}</p>
                  <p className="text-xs text-gray-500">{new Date(dec.approvedOn!).toLocaleDateString('en-IN')}</p>
                </div>
              )}
            </div>

            {dec.remarks && (
              <div className="bg-gray-50 border border-gray-200 rounded p-3 mb-4">
                <p className="text-xs text-gray-500 uppercase font-medium mb-1">Remarks</p>
                <p className="text-sm text-gray-700">{dec.remarks}</p>
              </div>
            )}

            <div className="flex gap-2 pt-4 border-t border-gray-200">
              <button className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg font-medium text-sm">
                <Eye className="h-4 w-4" />
                View Details
              </button>
              {dec.status === 'draft' && (
                <button className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg font-medium text-sm">
                  <Edit className="h-4 w-4" />
                  Edit & Submit
                </button>
              )}
              {dec.status === 'submitted' && dec.proofStatus === 'submitted' && (
                <button className="flex items-center gap-2 px-4 py-2 text-green-600 hover:bg-green-50 rounded-lg font-medium text-sm">
                  Upload Proof
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredDeclarations.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
          <FileSignature className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No declarations found</h3>
          <p className="text-gray-600">No declarations match the selected filters</p>
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
        <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          Tax Declaration Guidelines
        </h3>
        <ul className="text-sm text-blue-800 space-y-1 ml-7">
          <li>• <strong>Section 80C</strong>: PPF, ELSS, Life Insurance, NSC - Max ₹1,50,000</li>
          <li>• <strong>Section 80D</strong>: Health Insurance Premium - Max ₹25,000 (₹50,000 for senior citizens)</li>
          <li>• <strong>Section 24(b)</strong>: Home Loan Interest - Max ₹2,00,000</li>
          <li>• <strong>Section 80CCD(1B)</strong>: NPS Additional - Max ₹50,000</li>
          <li>• <strong>HRA</strong>: House Rent Allowance as per actual rent paid</li>
          <li>• Declarations must be submitted by April 30th for the financial year</li>
          <li>• Investment proofs must be submitted before January 31st</li>
          <li>• Failure to submit proofs will result in TDS recovery in salary</li>
        </ul>
      </div>
    </div>
  );
}

'use client';

import { useState, useMemo } from 'react';
import { Users, Plus, Edit, CheckCircle, Clock, AlertCircle, Eye } from 'lucide-react';

interface Nomination {
  id: string;
  nominationType: string;
  nomineeName: string;
  relationship: string;
  dateOfBirth: string;
  sharePercentage: number;
  address: string;
  contactNumber: string;
  aadharNumber?: string;
  submittedOn: string;
  status: 'draft' | 'submitted' | 'approved';
  approvedBy?: string;
  approvedOn?: string;
}

export default function NominationsPage() {
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const mockNominations: Nomination[] = [
    {
      id: 'NOM001',
      nominationType: 'EPF Nomination',
      nomineeName: 'Priya Sharma',
      relationship: 'Spouse',
      dateOfBirth: '1992-05-15',
      sharePercentage: 50,
      address: 'Flat 302, Sunrise Apartments, Andheri West, Mumbai - 400053',
      contactNumber: '+91 98765 43210',
      aadharNumber: 'XXXX-XXXX-9876',
      submittedOn: '2024-01-10',
      status: 'approved',
      approvedBy: 'Kavita Sharma',
      approvedOn: '2024-01-11'
    },
    {
      id: 'NOM002',
      nominationType: 'EPF Nomination',
      nomineeName: 'Rajesh Sharma',
      relationship: 'Father',
      dateOfBirth: '1965-08-20',
      sharePercentage: 50,
      address: 'House No. 45, Sector 12, Vashi, Navi Mumbai - 400703',
      contactNumber: '+91 98765 43211',
      aadharNumber: 'XXXX-XXXX-1234',
      submittedOn: '2024-01-10',
      status: 'approved',
      approvedBy: 'Kavita Sharma',
      approvedOn: '2024-01-11'
    },
    {
      id: 'NOM003',
      nominationType: 'EPS Nomination',
      nomineeName: 'Priya Sharma',
      relationship: 'Spouse',
      dateOfBirth: '1992-05-15',
      sharePercentage: 100,
      address: 'Flat 302, Sunrise Apartments, Andheri West, Mumbai - 400053',
      contactNumber: '+91 98765 43210',
      aadharNumber: 'XXXX-XXXX-9876',
      submittedOn: '2024-01-10',
      status: 'approved',
      approvedBy: 'Kavita Sharma',
      approvedOn: '2024-01-11'
    },
    {
      id: 'NOM004',
      nominationType: 'Gratuity Nomination',
      nomineeName: 'Priya Sharma',
      relationship: 'Spouse',
      dateOfBirth: '1992-05-15',
      sharePercentage: 100,
      address: 'Flat 302, Sunrise Apartments, Andheri West, Mumbai - 400053',
      contactNumber: '+91 98765 43210',
      aadharNumber: 'XXXX-XXXX-9876',
      submittedOn: '2024-01-10',
      status: 'approved',
      approvedBy: 'Kavita Sharma',
      approvedOn: '2024-01-11'
    },
    {
      id: 'NOM005',
      nominationType: 'Group Life Insurance',
      nomineeName: 'Priya Sharma',
      relationship: 'Spouse',
      dateOfBirth: '1992-05-15',
      sharePercentage: 100,
      address: 'Flat 302, Sunrise Apartments, Andheri West, Mumbai - 400053',
      contactNumber: '+91 98765 43210',
      submittedOn: '2024-10-20',
      status: 'submitted'
    }
  ];

  const filteredNominations = useMemo(() => {
    return mockNominations.filter(nom => {
      const matchesType = selectedType === 'all' || nom.nominationType === selectedType;
      const matchesStatus = selectedStatus === 'all' || nom.status === selectedStatus;
      return matchesType && matchesStatus;
    });
  }, [selectedType, selectedStatus]);

  const nominationTypes = ['all', ...Array.from(new Set(mockNominations.map(n => n.nominationType)))];

  const stats = {
    total: mockNominations.length,
    approved: mockNominations.filter(n => n.status === 'approved').length,
    submitted: mockNominations.filter(n => n.status === 'submitted').length,
    draft: mockNominations.filter(n => n.status === 'draft').length
  };

  const statusColors = {
    draft: 'bg-gray-100 text-gray-700',
    submitted: 'bg-yellow-100 text-yellow-700',
    approved: 'bg-green-100 text-green-700'
  };

  const statusIcons = {
    draft: Clock,
    submitted: Clock,
    approved: CheckCircle
  };

  const calculateAge = (dob: string) => {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <div className="w-full h-full px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Nominations</h1>
          <p className="text-sm text-gray-600 mt-1">Manage your EPF, Gratuity, and Insurance nominations</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Nomination
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Total Nominations</p>
              <p className="text-2xl font-bold text-blue-900 mt-1">{stats.total}</p>
            </div>
            <Users className="h-8 w-8 text-blue-600" />
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
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Nomination Type</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {nominationTypes.map(type => (
                <option key={type} value={type}>
                  {type === 'all' ? 'All Types' : type}
                </option>
              ))}
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
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredNominations.map(nom => {
          const StatusIcon = statusIcons[nom.status];
          const age = calculateAge(nom.dateOfBirth);

          return (
            <div key={nom.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-gray-900">{nom.nominationType}</h3>
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full flex items-center gap-1 ${statusColors[nom.status]}`}>
                      <StatusIcon className="h-3 w-3" />
                      {nom.status.charAt(0).toUpperCase() + nom.status.slice(1)}
                    </span>
                  </div>
                  <p className="text-md font-semibold text-gray-800">{nom.nomineeName}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase font-medium mb-1">Relationship</p>
                  <p className="text-sm font-semibold text-gray-900">{nom.relationship}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-medium mb-1">Age</p>
                  <p className="text-sm font-semibold text-gray-900">{age} years</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-medium mb-1">Share Percentage</p>
                  <p className="text-lg font-bold text-blue-600">{nom.sharePercentage}%</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-xs text-gray-500 uppercase font-medium mb-1">Address</p>
                  <p className="text-sm font-semibold text-gray-900">{nom.address}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-medium mb-1">Contact Number</p>
                  <p className="text-sm font-semibold text-gray-900">{nom.contactNumber}</p>
                </div>
                {nom.aadharNumber && (
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-medium mb-1">Aadhar Number</p>
                    <p className="text-sm font-semibold text-gray-900">{nom.aadharNumber}</p>
                  </div>
                )}
                <div>
                  <p className="text-xs text-gray-500 uppercase font-medium mb-1">Submitted On</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {new Date(nom.submittedOn).toLocaleDateString('en-IN')}
                  </p>
                </div>
                {nom.approvedBy && (
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-medium mb-1">Approved By</p>
                    <p className="text-sm font-semibold text-gray-900">{nom.approvedBy}</p>
                    <p className="text-xs text-gray-500">{new Date(nom.approvedOn!).toLocaleDateString('en-IN')}</p>
                  </div>
                )}
              </div>

              {nom.status === 'approved' && nom.approvedBy && (
                <div className="bg-green-50 border border-green-200 rounded p-3 mb-4">
                  <div className="flex items-center gap-2 text-green-800 text-sm">
                    <CheckCircle className="h-4 w-4" />
                    <span>Approved by <strong>{nom.approvedBy}</strong> on {new Date(nom.approvedOn!).toLocaleDateString('en-IN')}</span>
                  </div>
                </div>
              )}

              <div className="flex gap-2 pt-4 border-t border-gray-200">
                <button className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg font-medium text-sm">
                  <Eye className="h-4 w-4" />
                  View Details
                </button>
                {nom.status !== 'approved' && (
                  <button className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg font-medium text-sm">
                    <Edit className="h-4 w-4" />
                    Edit
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredNominations.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No nominations found</h3>
          <p className="text-gray-600">No nominations match the selected filters</p>
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
        <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          Nomination Guidelines
        </h3>
        <ul className="text-sm text-blue-800 space-y-1 ml-7">
          <li>• <strong>EPF Nomination (Form 2)</strong>: Mandatory for all EPF members as per EPF Act 1952</li>
          <li>• <strong>EPS Nomination (Form 10-D)</strong>: For pension scheme nomination</li>
          <li>• <strong>Gratuity Nomination (Form F)</strong>: As per Payment of Gratuity Act 1972</li>
          <li>• <strong>Group Insurance</strong>: Nomination for company-provided group life insurance</li>
          <li>• Total share percentage across all nominees must equal 100%</li>
          <li>• Multiple nominees allowed, but minor nominees require guardian details</li>
          <li>• Update nominations within 30 days of any life event (marriage, birth, etc.)</li>
          <li>• Nominee's Aadhar and address proof documents are mandatory</li>
        </ul>
      </div>
    </div>
  );
}

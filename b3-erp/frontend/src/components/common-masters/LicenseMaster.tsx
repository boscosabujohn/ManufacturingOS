'use client';

import React, { useState, useMemo } from 'react';
import {
  FileText, Plus, Search, Edit3, Trash2, Calendar,
  AlertTriangle, CheckCircle, Clock, Bell, Award
} from 'lucide-react';

interface License {
  id: string;
  licenseCode: string;
  licenseName: string;
  licenseType: 'Business' | 'Professional' | 'Trade' | 'Manufacturing' | 'Import-Export' | 'Environment' | 'Safety' | 'Other';
  category: 'Government' | 'Municipal' | 'Industry' | 'Professional Body' | 'Other';
  licenseDetails: {
    licenseNumber: string;
    issuedDate: Date;
    expiryDate?: Date;
    isPerpetual: boolean;
    renewalRequired: boolean;
  };
  issuingAuthority: {
    authorityName: string;
    contactPhone: string;
    contactEmail: string;
  };
  renewal: {
    nextRenewalDate?: Date;
    renewalStatus?: 'Not Due' | 'Due Soon' | 'Applied' | 'Approved' | 'Rejected' | 'Overdue';
  };
  fees: {
    licenseFee: number;
    renewalFee: number;
    currency: string;
  };
  status: 'Active' | 'Expired' | 'Suspended' | 'Cancelled' | 'Under Renewal' | 'Applied';
}

const mockLicenses: License[] = [
  {
    id: '1',
    licenseCode: 'LIC-FACTORY-001',
    licenseName: 'Factory License',
    licenseType: 'Manufacturing',
    category: 'Government',
    licenseDetails: {
      licenseNumber: 'FL/HR/GGN/2020/1234',
      issuedDate: new Date('2020-01-15'),
      expiryDate: new Date('2025-01-14'),
      isPerpetual: false,
      renewalRequired: true
    },
    issuingAuthority: {
      authorityName: 'Office of Chief Inspector of Factories',
      contactPhone: '+91-124-2345678',
      contactEmail: 'factories.ggn@labor.gov.in'
    },
    renewal: {
      nextRenewalDate: new Date('2024-10-15'),
      renewalStatus: 'Due Soon'
    },
    fees: {
      licenseFee: 25000,
      renewalFee: 20000,
      currency: 'INR'
    },
    status: 'Active'
  },
  {
    id: '2',
    licenseCode: 'LIC-TRADE-001',
    licenseName: 'Trade License',
    licenseType: 'Trade',
    category: 'Municipal',
    licenseDetails: {
      licenseNumber: 'TL/MCG/2023/5678',
      issuedDate: new Date('2023-04-01'),
      expiryDate: new Date('2024-03-31'),
      isPerpetual: false,
      renewalRequired: true
    },
    issuingAuthority: {
      authorityName: 'Municipal Corporation of Gurgaon',
      contactPhone: '+91-124-2234567',
      contactEmail: 'licensing@mcg.gov.in'
    },
    renewal: {
      nextRenewalDate: new Date('2024-02-28'),
      renewalStatus: 'Applied'
    },
    fees: {
      licenseFee: 10000,
      renewalFee: 10000,
      currency: 'INR'
    },
    status: 'Under Renewal'
  },
  {
    id: '3',
    licenseCode: 'LIC-ENV-001',
    licenseName: 'Environmental Clearance',
    licenseType: 'Environment',
    category: 'Government',
    licenseDetails: {
      licenseNumber: 'EC/2022/1234',
      issuedDate: new Date('2022-06-01'),
      expiryDate: new Date('2027-05-31'),
      isPerpetual: false,
      renewalRequired: true
    },
    issuingAuthority: {
      authorityName: 'State Environment Impact Assessment Authority',
      contactPhone: '+91-124-1234567',
      contactEmail: 'seiaa@environment.gov.in'
    },
    renewal: {
      nextRenewalDate: new Date('2027-03-01'),
      renewalStatus: 'Not Due'
    },
    fees: {
      licenseFee: 50000,
      renewalFee: 40000,
      currency: 'INR'
    },
    status: 'Active'
  },
  {
    id: '4',
    licenseCode: 'LIC-IMP-001',
    licenseName: 'Import Export Code',
    licenseType: 'Import-Export',
    category: 'Government',
    licenseDetails: {
      licenseNumber: 'IEC/2021/9876',
      issuedDate: new Date('2021-03-15'),
      isPerpetual: true,
      renewalRequired: false
    },
    issuingAuthority: {
      authorityName: 'Directorate General of Foreign Trade',
      contactPhone: '+91-11-2303-3505',
      contactEmail: 'dgft@nic.in'
    },
    renewal: {
      renewalStatus: 'Not Due'
    },
    fees: {
      licenseFee: 5000,
      renewalFee: 0,
      currency: 'INR'
    },
    status: 'Active'
  }
];

export default function LicenseMaster() {
  const [licenses, setLicenses] = useState<License[]>(mockLicenses);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');

  const filteredLicenses = useMemo(() => {
    return licenses.filter(license => {
      const matchesSearch =
        license.licenseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        license.licenseCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        license.licenseDetails.licenseNumber.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType = filterType === 'All' || license.licenseType === filterType;
      const matchesStatus = filterStatus === 'All' || license.status === filterStatus;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [licenses, searchTerm, filterType, filterStatus]);

  const getDaysUntilExpiry = (expiryDate?: Date) => {
    if (!expiryDate) return null;
    const today = new Date();
    const diffTime = expiryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const statistics = [
    {
      label: 'Total Licenses',
      value: licenses.length,
      icon: FileText,
      color: 'blue'
    },
    {
      label: 'Active Licenses',
      value: licenses.filter(l => l.status === 'Active').length,
      icon: CheckCircle,
      color: 'green'
    },
    {
      label: 'Due for Renewal (30 days)',
      value: licenses.filter(l => {
        const days = getDaysUntilExpiry(l.renewal.nextRenewalDate);
        return days !== null && days <= 30 && days > 0;
      }).length,
      icon: Clock,
      color: 'orange'
    },
    {
      label: 'Expired Licenses',
      value: licenses.filter(l => l.status === 'Expired').length,
      icon: AlertTriangle,
      color: 'red'
    }
  ];

  const statusColors = {
    Active: 'bg-green-100 text-green-800',
    Expired: 'bg-red-100 text-red-800',
    Suspended: 'bg-orange-100 text-orange-800',
    Cancelled: 'bg-gray-100 text-gray-800',
    'Under Renewal': 'bg-yellow-100 text-yellow-800',
    Applied: 'bg-blue-100 text-blue-800'
  };

  const renewalStatusColors = {
    'Not Due': 'bg-gray-100 text-gray-800',
    'Due Soon': 'bg-yellow-100 text-yellow-800',
    Applied: 'bg-blue-100 text-blue-800',
    Approved: 'bg-green-100 text-green-800',
    Rejected: 'bg-red-100 text-red-800',
    Overdue: 'bg-red-100 text-red-800'
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">License Master</h1>
          <p className="text-sm text-gray-600 mt-1">Manage business licenses and permits</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <Plus className="w-4 h-4" />
          Add License
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statistics.map((stat, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg bg-${stat.color}-100`}>
                <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by license name, code, or number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="All">All Types</option>
              <option value="Business">Business</option>
              <option value="Manufacturing">Manufacturing</option>
              <option value="Trade">Trade</option>
              <option value="Import-Export">Import-Export</option>
              <option value="Environment">Environment</option>
              <option value="Safety">Safety</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Expired">Expired</option>
              <option value="Under Renewal">Under Renewal</option>
              <option value="Applied">Applied</option>
            </select>
          </div>
        </div>
      </div>

      {/* Licenses Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  License Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type & Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Validity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Renewal
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fees
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLicenses.map((license) => {
                const daysUntilExpiry = getDaysUntilExpiry(license.licenseDetails.expiryDate);
                return (
                  <tr key={license.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-purple-100 rounded-lg">
                          <Award className="h-6 w-6 text-purple-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{license.licenseName}</div>
                          <div className="text-sm text-gray-500">{license.licenseCode}</div>
                          <div className="text-xs text-gray-400">{license.licenseDetails.licenseNumber}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{license.licenseType}</div>
                      <div className="text-xs text-gray-500">{license.category}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm space-y-1">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-gray-400" />
                          <span className="text-gray-600">Issued:</span>
                          <span className="text-gray-900">
                            {license.licenseDetails.issuedDate.toLocaleDateString()}
                          </span>
                        </div>
                        {license.licenseDetails.expiryDate ? (
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-gray-400" />
                            <span className="text-gray-600">Expires:</span>
                            <span className={`font-medium ${
                              daysUntilExpiry && daysUntilExpiry <= 30 ? 'text-red-600' :
                              daysUntilExpiry && daysUntilExpiry <= 90 ? 'text-orange-600' :
                              'text-gray-900'
                            }`}>
                              {license.licenseDetails.expiryDate.toLocaleDateString()}
                            </span>
                          </div>
                        ) : (
                          <div className="text-xs text-green-600 font-medium">Perpetual License</div>
                        )}
                        {daysUntilExpiry !== null && (
                          <div className={`text-xs ${
                            daysUntilExpiry <= 0 ? 'text-red-600 font-medium' :
                            daysUntilExpiry <= 30 ? 'text-orange-600 font-medium' :
                            'text-gray-500'
                          }`}>
                            {daysUntilExpiry <= 0 ? 'Expired' : `${daysUntilExpiry} days remaining`}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {license.renewal.renewalStatus && (
                        <div className="space-y-1">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${renewalStatusColors[license.renewal.renewalStatus]}`}>
                            {license.renewal.renewalStatus}
                          </span>
                          {license.renewal.nextRenewalDate && (
                            <div className="text-xs text-gray-500 flex items-center gap-1">
                              <Bell className="w-3 h-3" />
                              {license.renewal.nextRenewalDate.toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm space-y-1">
                        <div className="text-gray-900 font-medium">
                          {license.fees.currency} {license.fees.licenseFee.toLocaleString()}
                        </div>
                        {license.licenseDetails.renewalRequired && (
                          <div className="text-xs text-gray-500">
                            Renewal: {license.fees.currency} {license.fees.renewalFee.toLocaleString()}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColors[license.status]}`}>
                        {license.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button className="text-blue-600 hover:text-blue-900">
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-900">
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-900">
                          <FileText className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Showing results */}
      <div className="text-sm text-gray-600">
        Showing {filteredLicenses.length} of {licenses.length} licenses
      </div>
    </div>
  );
}

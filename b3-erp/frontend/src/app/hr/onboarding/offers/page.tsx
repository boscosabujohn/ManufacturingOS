'use client';

import { useState, useMemo } from 'react';
import { FileText, CheckCircle, Clock, XCircle, Send, Eye, Download, Plus } from 'lucide-react';
import DataTable from '@/components/DataTable';

interface OfferLetter {
  id: string;
  offerNumber: string;
  candidateName: string;
  designation: string;
  department: string;
  employmentType: 'permanent' | 'contract' | 'temporary';
  ctc: number;
  joiningDate: string;
  offerDate: string;
  validTill: string;
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';
  sentBy: string;
  sentDate?: string;
  respondedDate?: string;
  location: string;
  reportingTo: string;
}

export default function Page() {
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);

  const mockOffers: OfferLetter[] = [
    {
      id: '1', offerNumber: 'OL-2024-001', candidateName: 'Arun Verma', designation: 'CNC Operator',
      department: 'Manufacturing', employmentType: 'permanent', ctc: 420000, joiningDate: '2024-12-01',
      offerDate: '2024-10-15', validTill: '2024-11-15', status: 'sent', sentBy: 'Priya Sharma',
      sentDate: '2024-10-15', location: 'Pune Factory', reportingTo: 'Rajesh Kumar'
    },
    {
      id: '2', offerNumber: 'OL-2024-002', candidateName: 'Sneha Patil', designation: 'Quality Inspector',
      department: 'Quality Assurance', employmentType: 'permanent', ctc: 380000, joiningDate: '2024-12-05',
      offerDate: '2024-10-18', validTill: '2024-11-18', status: 'accepted', sentBy: 'Priya Sharma',
      sentDate: '2024-10-18', respondedDate: '2024-10-20', location: 'Pune Factory', reportingTo: 'Meena Rao'
    },
    {
      id: '3', offerNumber: 'OL-2024-003', candidateName: 'Karthik Reddy', designation: 'Production Supervisor',
      department: 'Manufacturing', employmentType: 'permanent', ctc: 550000, joiningDate: '2024-11-25',
      offerDate: '2024-10-12', validTill: '2024-11-12', status: 'accepted', sentBy: 'Priya Sharma',
      sentDate: '2024-10-12', respondedDate: '2024-10-14', location: 'Pune Factory', reportingTo: 'Rajesh Kumar'
    },
    {
      id: '4', offerNumber: 'OL-2024-004', candidateName: 'Neha Singh', designation: 'Maintenance Technician',
      department: 'Maintenance', employmentType: 'permanent', ctc: 400000, joiningDate: '2024-12-10',
      offerDate: '2024-10-20', validTill: '2024-11-20', status: 'sent', sentBy: 'Priya Sharma',
      sentDate: '2024-10-20', location: 'Pune Factory', reportingTo: 'Suresh Patel'
    },
    {
      id: '5', offerNumber: 'OL-2024-005', candidateName: 'Ravi Joshi', designation: 'Warehouse Executive',
      department: 'Warehouse & Logistics', employmentType: 'contract', ctc: 320000, joiningDate: '2024-12-01',
      offerDate: '2024-10-08', validTill: '2024-11-08', status: 'expired', sentBy: 'Priya Sharma',
      sentDate: '2024-10-08', location: 'Pune Factory', reportingTo: 'Amit Singh'
    },
    {
      id: '6', offerNumber: 'OL-2024-006', candidateName: 'Divya Nair', designation: 'Safety Officer',
      department: 'Safety & Compliance', employmentType: 'permanent', ctc: 480000, joiningDate: '2024-12-15',
      offerDate: '2024-10-22', validTill: '2024-11-22', status: 'sent', sentBy: 'Priya Sharma',
      sentDate: '2024-10-22', location: 'Pune Factory', reportingTo: 'Suresh Patel'
    },
    {
      id: '7', offerNumber: 'OL-2024-007', candidateName: 'Manoj Kumar', designation: 'Machine Operator',
      department: 'Manufacturing', employmentType: 'permanent', ctc: 360000, joiningDate: '2024-11-28',
      offerDate: '2024-10-10', validTill: '2024-11-10', status: 'rejected', sentBy: 'Priya Sharma',
      sentDate: '2024-10-10', respondedDate: '2024-10-16', location: 'Pune Factory', reportingTo: 'Rajesh Kumar'
    },
    {
      id: '8', offerNumber: 'OL-2024-008', candidateName: 'Priyanka Desai', designation: 'HR Executive',
      department: 'Human Resources', employmentType: 'permanent', ctc: 450000, joiningDate: '2024-12-01',
      offerDate: '2024-10-25', validTill: '2024-11-25', status: 'draft', sentBy: 'Priya Sharma',
      location: 'Pune Factory', reportingTo: 'Priya Sharma'
    }
  ];

  const filteredOffers = useMemo(() => {
    return mockOffers.filter(offer =>
      selectedStatus === 'all' || offer.status === selectedStatus
    );
  }, [selectedStatus]);

  const stats = {
    total: mockOffers.length,
    draft: mockOffers.filter(o => o.status === 'draft').length,
    sent: mockOffers.filter(o => o.status === 'sent').length,
    accepted: mockOffers.filter(o => o.status === 'accepted').length,
    rejected: mockOffers.filter(o => o.status === 'rejected').length,
    expired: mockOffers.filter(o => o.status === 'expired').length,
    acceptanceRate: Math.round((mockOffers.filter(o => o.status === 'accepted').length / mockOffers.filter(o => ['accepted', 'rejected'].includes(o.status)).length) * 100)
  };

  const getStatusColor = (status: string) => {
    const colors = {
      draft: 'bg-gray-100 text-gray-800',
      sent: 'bg-blue-100 text-blue-800',
      accepted: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      expired: 'bg-orange-100 text-orange-800'
    };
    return colors[status as keyof typeof colors];
  };

  const getStatusIcon = (status: string) => {
    const icons = {
      draft: Clock,
      sent: Send,
      accepted: CheckCircle,
      rejected: XCircle,
      expired: XCircle
    };
    const Icon = icons[status as keyof typeof icons];
    return <Icon className="h-4 w-4" />;
  };

  const columns = [
    { key: 'offerNumber', label: 'Offer No.', sortable: true,
      render: (v: string) => <div className="font-semibold text-gray-900">{v}</div>
    },
    { key: 'candidateName', label: 'Candidate', sortable: true,
      render: (v: string, row: OfferLetter) => (
        <div>
          <div className="font-medium text-gray-900">{v}</div>
          <div className="text-xs text-gray-500">{row.designation}</div>
        </div>
      )
    },
    { key: 'department', label: 'Department', sortable: true,
      render: (v: string, row: OfferLetter) => (
        <div>
          <div className="text-sm text-gray-900">{v}</div>
          <div className="text-xs text-gray-500">Reports to: {row.reportingTo}</div>
        </div>
      )
    },
    { key: 'employmentType', label: 'Type', sortable: true,
      render: (v: string) => (
        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
          {v.toUpperCase()}
        </span>
      )
    },
    { key: 'ctc', label: 'CTC (Annual)', sortable: true,
      render: (v: number) => <div className="text-sm font-semibold text-gray-900">₹{(v / 100000).toFixed(1)}L</div>
    },
    { key: 'joiningDate', label: 'Joining Date', sortable: true,
      render: (v: string) => (
        <div className="text-sm text-gray-700">
          {new Date(v).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
        </div>
      )
    },
    { key: 'validTill', label: 'Valid Till', sortable: true,
      render: (v: string) => (
        <div className="text-sm text-gray-700">
          {new Date(v).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
        </div>
      )
    },
    { key: 'status', label: 'Status', sortable: true,
      render: (v: string) => (
        <span className={`px-2 py-1 inline-flex items-center gap-1 text-xs leading-5 font-semibold rounded-full ${getStatusColor(v)}`}>
          {getStatusIcon(v)}
          {v.toUpperCase()}
        </span>
      )
    },
    { key: 'actions', label: 'Actions', sortable: false,
      render: (_: any, row: OfferLetter) => (
        <div className="flex gap-2">
          <button className="p-1 hover:bg-gray-100 rounded" title="View">
            <Eye className="h-4 w-4 text-gray-600" />
          </button>
          <button className="p-1 hover:bg-gray-100 rounded" title="Download">
            <Download className="h-4 w-4 text-gray-600" />
          </button>
          {row.status === 'draft' && (
            <button className="p-1 hover:bg-gray-100 rounded" title="Send">
              <Send className="h-4 w-4 text-blue-600" />
            </button>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <FileText className="h-8 w-8 text-blue-600" />
            Offer Letters
          </h1>
          <p className="text-gray-600 mt-2">Manage job offers for selected candidates</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          Create Offer Letter
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-7 gap-4 mb-6">
        <div className="bg-white border-2 border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Offers</p>
              <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
            </div>
            <FileText className="h-10 w-10 text-blue-400" />
          </div>
        </div>
        <div className="bg-white border-2 border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Draft</p>
              <p className="text-2xl font-bold text-gray-600">{stats.draft}</p>
            </div>
            <Clock className="h-10 w-10 text-gray-400" />
          </div>
        </div>
        <div className="bg-white border-2 border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Sent</p>
              <p className="text-2xl font-bold text-blue-600">{stats.sent}</p>
            </div>
            <Send className="h-10 w-10 text-blue-400" />
          </div>
        </div>
        <div className="bg-white border-2 border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Accepted</p>
              <p className="text-2xl font-bold text-green-600">{stats.accepted}</p>
            </div>
            <CheckCircle className="h-10 w-10 text-green-400" />
          </div>
        </div>
        <div className="bg-white border-2 border-red-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Rejected</p>
              <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
            </div>
            <XCircle className="h-10 w-10 text-red-400" />
          </div>
        </div>
        <div className="bg-white border-2 border-orange-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Expired</p>
              <p className="text-2xl font-bold text-orange-600">{stats.expired}</p>
            </div>
            <XCircle className="h-10 w-10 text-orange-400" />
          </div>
        </div>
        <div className="bg-white border-2 border-emerald-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Accept Rate</p>
              <p className="text-2xl font-bold text-emerald-600">{stats.acceptanceRate}%</p>
            </div>
            <CheckCircle className="h-10 w-10 text-emerald-400" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Status:</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="draft">Draft</option>
              <option value="sent">Sent</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
              <option value="expired">Expired</option>
            </select>
          </div>
        </div>
      </div>

      {/* Offers Table */}
      <DataTable data={filteredOffers} columns={columns} />

      {/* Info Box */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-blue-900 mb-2">Offer Letter Guidelines</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Ensure all offer details are accurate before sending to candidate</li>
          <li>• Offer letters are valid for 30 days from the date of issue</li>
          <li>• Accepted offers automatically trigger onboarding checklist creation</li>
          <li>• CTC includes basic salary, allowances, and employer contributions</li>
          <li>• All offers must be approved by Department Head and HR Manager</li>
          <li>• Candidates can accept/reject offers through the candidate portal</li>
        </ul>
      </div>
    </div>
  );
}

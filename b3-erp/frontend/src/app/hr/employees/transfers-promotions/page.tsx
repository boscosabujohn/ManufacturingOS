'use client';

import { useState, useMemo } from 'react';
import { TrendingUp, Search, Filter, Plus, ArrowRight, Award, Building2, Calendar, CheckCircle, Clock, XCircle } from 'lucide-react';
import DataTable, { Column } from '@/components/DataTable';
import StatusBadge, { BadgeStatus } from '@/components/StatusBadge';

interface TransferPromotion {
  id: string;
  employeeCode: string;
  name: string;
  type: 'promotion' | 'transfer' | 'both';
  fromDesignation: string;
  toDesignation: string;
  fromDepartment: string;
  toDepartment: string;
  fromLocation: string;
  toLocation: string;
  effectiveDate: string;
  requestDate: string;
  requestedBy: string;
  approvedBy?: string;
  reason: string;
  salaryIncrement?: number;
  status: 'pending' | 'approved' | 'rejected' | 'implemented';
}

export default function TransfersPromotionsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  const mockTransfersPromotions: TransferPromotion[] = [
    { id: 'TP001', employeeCode: 'KMF2018001', name: 'Rajesh Kumar', type: 'promotion',
      fromDesignation: 'Senior Engineer', toDesignation: 'Team Lead', fromDepartment: 'Production', toDepartment: 'Production',
      fromLocation: 'Plant A', toLocation: 'Plant A', effectiveDate: '2024-12-01', requestDate: '2024-10-15',
      requestedBy: 'Production Manager', approvedBy: 'VP Operations', reason: 'Excellent performance, leadership skills',
      salaryIncrement: 15, status: 'approved' },
    { id: 'TP002', employeeCode: 'KMF2020005', name: 'Meera Nair', type: 'both',
      fromDesignation: 'QC Inspector', toDesignation: 'QC Team Lead', fromDepartment: 'Quality', toDepartment: 'Quality',
      fromLocation: 'Quality Lab - Building B', toLocation: 'Quality Lab - Building A', effectiveDate: '2024-11-15',
      requestDate: '2024-10-01', requestedBy: 'QC Manager', approvedBy: 'VP Quality', reason: 'Promotion with facility transfer',
      salaryIncrement: 20, status: 'implemented' },
    { id: 'TP003', employeeCode: 'KMF2019008', name: 'Arun Patel', type: 'transfer',
      fromDesignation: 'Software Engineer', toDesignation: 'Software Engineer', fromDepartment: 'IT - Development',
      toDepartment: 'IT - Infrastructure', fromLocation: 'HQ - 3rd Floor', toLocation: 'HQ - 2nd Floor',
      effectiveDate: '2024-12-01', requestDate: '2024-10-20', requestedBy: 'IT Manager', reason: 'Resource balancing',
      status: 'pending' },
    { id: 'TP004', employeeCode: 'KMF2021012', name: 'Priya Menon', type: 'promotion',
      fromDesignation: 'Accounts Assistant', toDesignation: 'Senior Accounts Executive', fromDepartment: 'Finance',
      toDepartment: 'Finance', fromLocation: 'Finance Dept', toLocation: 'Finance Dept', effectiveDate: '2025-01-01',
      requestDate: '2024-11-01', requestedBy: 'Finance Manager', reason: 'Completed CA Inter, excellent work',
      salaryIncrement: 25, status: 'approved' },
    { id: 'TP005', employeeCode: 'KMF2017003', name: 'Vikram Singh', type: 'transfer',
      fromDesignation: 'Production Supervisor', toDesignation: 'Production Supervisor', fromDepartment: 'Production - Plant A',
      toDepartment: 'Production - Plant B', fromLocation: 'Plant A', toLocation: 'Plant B - Pune',
      effectiveDate: '2024-11-01', requestDate: '2024-09-15', requestedBy: 'Production Manager', approvedBy: 'VP Operations',
      reason: 'New plant setup requirement', status: 'implemented' },
    { id: 'TP006', employeeCode: 'KMF2022018', name: 'Sunita Rao', type: 'promotion',
      fromDesignation: 'HR Executive', toDesignation: 'Assistant HR Manager', fromDepartment: 'Human Resources',
      toDepartment: 'Human Resources', fromLocation: 'HR Department', toLocation: 'HR Department',
      effectiveDate: '2024-12-15', requestDate: '2024-11-05', requestedBy: 'HR Manager', reason: 'Performance & capability',
      salaryIncrement: 18, status: 'pending' },
    { id: 'TP007', employeeCode: 'KMF2020015', name: 'Ramesh Iyer', type: 'promotion',
      fromDesignation: 'Junior Engineer', toDesignation: 'Engineer', fromDepartment: 'Maintenance', toDepartment: 'Maintenance',
      fromLocation: 'Maintenance Workshop', toLocation: 'Maintenance Workshop', effectiveDate: '2024-10-01',
      requestDate: '2024-08-20', requestedBy: 'Maintenance Manager', approvedBy: 'Director Operations', reason: 'Probation completion, good performance',
      salaryIncrement: 10, status: 'implemented' }
  ];

  const types = ['all', 'promotion', 'transfer', 'both'];
  const statuses = ['all', 'pending', 'approved', 'rejected', 'implemented'];

  const filteredData = useMemo(() => {
    return mockTransfersPromotions.filter(tp => {
      const matchesSearch = tp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          tp.employeeCode.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = selectedType === 'all' || tp.type === selectedType;
      const matchesStatus = selectedStatus === 'all' || tp.status === selectedStatus;
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [searchTerm, selectedType, selectedStatus]);

  const stats = useMemo(() => {
    const promotions = mockTransfersPromotions.filter(tp => tp.type === 'promotion' || tp.type === 'both').length;
    const transfers = mockTransfersPromotions.filter(tp => tp.type === 'transfer' || tp.type === 'both').length;
    const pending = mockTransfersPromotions.filter(tp => tp.status === 'pending').length;
    const avgIncrement = Math.round(mockTransfersPromotions.filter(tp => tp.salaryIncrement).reduce((sum, tp) => sum + (tp.salaryIncrement || 0), 0) /
                          mockTransfersPromotions.filter(tp => tp.salaryIncrement).length);
    return { total: mockTransfersPromotions.length, promotions, transfers, pending, avgIncrement };
  }, []);

  const columns: Column<TransferPromotion>[] = [
    { id: 'employeeCode', accessor: 'employeeCode', label: 'Employee', sortable: true,
      render: (v: string, row: TransferPromotion) => (
        <div><div className="font-semibold text-gray-900">{v}</div><div className="text-xs text-gray-500">{row.name}</div></div>
      )
    },
    { id: 'type', accessor: 'type', label: 'Type', sortable: true,
      render: (v: string) => {
        const colors = { promotion: 'bg-green-100 text-green-700', transfer: 'bg-blue-100 text-blue-700', both: 'bg-purple-100 text-purple-700' };
        return <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[v as keyof typeof colors]}`}>{v.toUpperCase()}</span>;
      }
    },
    { id: 'fromDesignation', accessor: 'fromDesignation', label: 'From → To', sortable: true,
      render: (v: string, row: TransferPromotion) => (
        <div className="text-sm">
          {row.type !== 'transfer' ? (
            <div className="flex items-center gap-2">
              <span className="text-gray-700">{v}</span>
              <ArrowRight className="w-3 h-3 text-gray-400" />
              <span className="font-semibold text-green-700">{row.toDesignation}</span>
            </div>
          ) : (
            <div className="text-gray-700">{v}</div>
          )}
          {row.type !== 'promotion' && row.fromDepartment !== row.toDepartment && (
            <div className="flex items-center gap-2 mt-1 text-xs">
              <span className="text-gray-500">{row.fromDepartment}</span>
              <ArrowRight className="w-3 h-3 text-gray-400" />
              <span className="text-blue-600">{row.toDepartment}</span>
            </div>
          )}
        </div>
      )
    },
    { id: 'effectiveDate', accessor: 'effectiveDate', label: 'Effective Date', sortable: true,
      render: (v: string) => (
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <Calendar className="w-4 h-4 text-gray-400" />
          {new Date(v).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
        </div>
      )
    },
    { id: 'salaryIncrement', accessor: 'salaryIncrement', label: 'Increment', sortable: true,
      render: (v?: number) => v ? (
        <div className="font-semibold text-green-600">+{v}%</div>
      ) : (
        <div className="text-gray-400">-</div>
      )
    },
    { id: 'status', accessor: 'status', label: 'Status', sortable: true,
      render: (v: string) => <StatusBadge status={v as BadgeStatus} />
    }
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2"><TrendingUp className="h-8 w-8 text-green-600" />Transfers & Promotions</h1>
        <p className="text-gray-600 mt-2">Manage employee career movements and progressions</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
        <div className="bg-white border-2 border-indigo-200 rounded-lg p-4">
          <div className="flex items-center justify-between"><div><p className="text-sm text-gray-600">Total Activities</p><p className="text-2xl font-bold text-indigo-600">{stats.total}</p></div>
          <TrendingUp className="w-8 h-8 text-indigo-400" /></div>
        </div>
        <div className="bg-white border-2 border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between"><div><p className="text-sm text-gray-600">Promotions</p><p className="text-2xl font-bold text-green-600">{stats.promotions}</p></div>
          <Award className="w-8 h-8 text-green-400" /></div>
        </div>
        <div className="bg-white border-2 border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between"><div><p className="text-sm text-gray-600">Transfers</p><p className="text-2xl font-bold text-blue-600">{stats.transfers}</p></div>
          <Building2 className="w-8 h-8 text-blue-400" /></div>
        </div>
        <div className="bg-white border-2 border-yellow-200 rounded-lg p-4">
          <div className="flex items-center justify-between"><div><p className="text-sm text-gray-600">Pending</p><p className="text-2xl font-bold text-yellow-600">{stats.pending}</p></div>
          <Clock className="w-8 h-8 text-yellow-400" /></div>
        </div>
        <div className="bg-white border-2 border-purple-200 rounded-lg p-4">
          <div className="flex items-center justify-between"><div><p className="text-sm text-gray-600">Avg Increment</p><p className="text-xl font-bold text-purple-600">{stats.avgIncrement}%</p></div>
          <TrendingUp className="w-8 h-8 text-purple-400" /></div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-gray-700">All Transfers & Promotions</h2>
            <span className="text-sm text-gray-500">({filteredData.length} records)</span>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
            <Plus className="h-4 w-4" />New Request
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative"><Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input type="text" placeholder="Search by name or code..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" />
          </div>
          <button onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${showFilters ? 'bg-green-50 border-green-300 text-green-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}>
            <Filter className="w-5 h-5" />Filters
          </button>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t">
            <div><label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
              <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500">
                {types.map(type => <option key={type} value={type}>{type === 'all' ? 'All Types' : type.toUpperCase()}</option>)}
              </select>
            </div>
            <div><label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500">
                {statuses.map(status => <option key={status} value={status}>{status === 'all' ? 'All Statuses' : status.toUpperCase()}</option>)}
              </select>
            </div>
          </div>
        )}
      </div>

      <DataTable data={filteredData} columns={columns} />
    </div>
  );
}

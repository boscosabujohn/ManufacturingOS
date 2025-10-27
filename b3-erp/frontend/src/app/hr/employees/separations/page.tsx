'use client';

import { useState, useMemo } from 'react';
import { UserX, Search, Filter, Calendar, CheckCircle, XCircle, AlertCircle, TrendingDown, Users } from 'lucide-react';
import DataTable, { Column } from '@/components/DataTable';
import StatusBadge, { BadgeStatus } from '@/components/StatusBadge';

interface Separation {
  id: string;
  employeeCode: string;
  name: string;
  designation: string;
  department: string;
  separationType: 'resignation' | 'termination' | 'retirement' | 'absconding' | 'contract_end';
  reason: string;
  resignationDate: string;
  lastWorkingDay: string;
  noticePeriod: number;
  exitInterviewDone: boolean;
  fnfSettled: boolean;
  assetsReturned: boolean;
  documentsCollected: boolean;
  rehireEligible: boolean;
  yearsOfService: number;
  clearanceStatus: 'pending' | 'in_progress' | 'completed';
}

export default function SeparationsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedClearance, setSelectedClearance] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  const mockSeparations: Separation[] = [
    { id: 'SEP001', employeeCode: 'KMF2018005', name: 'Ramesh Gupta', designation: 'Senior Engineer', department: 'Production',
      separationType: 'resignation', reason: 'Better opportunity', resignationDate: '2024-10-01', lastWorkingDay: '2024-11-30',
      noticePeriod: 60, exitInterviewDone: true, fnfSettled: true, assetsReturned: true, documentsCollected: true,
      rehireEligible: true, yearsOfService: 6, clearanceStatus: 'completed' },
    { id: 'SEP002', employeeCode: 'KMF2020010', name: 'Anita Sharma', designation: 'HR Executive', department: 'Human Resources',
      separationType: 'resignation', reason: 'Personal reasons', resignationDate: '2024-10-15', lastWorkingDay: '2024-12-14',
      noticePeriod: 60, exitInterviewDone: true, fnfSettled: false, assetsReturned: true, documentsCollected: false,
      rehireEligible: true, yearsOfService: 4, clearanceStatus: 'in_progress' },
    { id: 'SEP003', employeeCode: 'KMF2015003', name: 'Vijay Kumar', designation: 'Quality Manager', department: 'Quality',
      separationType: 'retirement', reason: 'Retirement at 60', resignationDate: '2024-09-01', lastWorkingDay: '2024-11-30',
      noticePeriod: 90, exitInterviewDone: true, fnfSettled: true, assetsReturned: true, documentsCollected: true,
      rehireEligible: false, yearsOfService: 35, clearanceStatus: 'completed' },
    { id: 'SEP004', employeeCode: 'CTR2023008', name: 'Suresh Babu', designation: 'Warehouse Helper', department: 'Logistics',
      separationType: 'contract_end', reason: 'Contract completion', resignationDate: '2024-11-01', lastWorkingDay: '2024-11-30',
      noticePeriod: 0, exitInterviewDone: false, fnfSettled: true, assetsReturned: true, documentsCollected: true,
      rehireEligible: true, yearsOfService: 1, clearanceStatus: 'completed' },
    { id: 'SEP005', employeeCode: 'KMF2019012', name: 'Deepak Mishra', designation: 'IT Support', department: 'IT',
      separationType: 'termination', reason: 'Performance issues', resignationDate: '2024-10-25', lastWorkingDay: '2024-10-25',
      noticePeriod: 0, exitInterviewDone: true, fnfSettled: false, assetsReturned: false, documentsCollected: false,
      rehireEligible: false, yearsOfService: 2, clearanceStatus: 'pending' },
    { id: 'SEP006', employeeCode: 'KMF2021015', name: 'Kavita Singh', designation: 'Marketing Executive', department: 'Marketing',
      separationType: 'resignation', reason: 'Higher education', resignationDate: '2024-11-01', lastWorkingDay: '2024-12-31',
      noticePeriod: 60, exitInterviewDone: false, fnfSettled: false, assetsReturned: false, documentsCollected: false,
      rehireEligible: true, yearsOfService: 3, clearanceStatus: 'pending' }
  ];

  const departments = ['all', 'Production', 'Human Resources', 'Quality', 'Logistics', 'IT', 'Marketing'];
  const separationTypes = ['all', 'resignation', 'termination', 'retirement', 'absconding', 'contract_end'];
  const clearanceStatuses = ['all', 'pending', 'in_progress', 'completed'];

  const filteredData = useMemo(() => {
    return mockSeparations.filter(sep => {
      const matchesSearch = sep.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          sep.employeeCode.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDepartment = selectedDepartment === 'all' || sep.department === selectedDepartment;
      const matchesType = selectedType === 'all' || sep.separationType === selectedType;
      const matchesClearance = selectedClearance === 'all' || sep.clearanceStatus === selectedClearance;
      return matchesSearch && matchesDepartment && matchesType && matchesClearance;
    });
  }, [searchTerm, selectedDepartment, selectedType, selectedClearance]);

  const stats = useMemo(() => {
    const thisMonth = mockSeparations.filter(s => new Date(s.lastWorkingDay).getMonth() === 10).length;
    const pending = mockSeparations.filter(s => s.clearanceStatus === 'pending').length;
    const avgYOS = Math.round(mockSeparations.reduce((sum, s) => sum + s.yearsOfService, 0) / mockSeparations.length);
    return { total: mockSeparations.length, thisMonth, pending, avgYOS };
  }, []);

  const columns: Column<Separation>[] = [
    { id: 'employeeCode', accessor: 'employeeCode', label: 'Employee', sortable: true,
      render: (v: string, row: Separation) => (
        <div><div className="font-semibold text-gray-900">{v}</div><div className="text-xs text-gray-500">{row.name}</div></div>
      )
    },
    { id: 'designation', accessor: 'designation', label: 'Designation', sortable: true,
      render: (v: string, row: Separation) => (
        <div><div className="font-medium text-gray-900">{v}</div><div className="text-xs text-gray-500">{row.department}</div></div>
      )
    },
    { id: 'separationType', accessor: 'separationType', label: 'Type', sortable: true,
      render: (v: string) => {
        const colors = {
          resignation: 'bg-blue-100 text-blue-700',
          termination: 'bg-red-100 text-red-700',
          retirement: 'bg-green-100 text-green-700',
          absconding: 'bg-orange-100 text-orange-700',
          contract_end: 'bg-purple-100 text-purple-700'
        };
        return <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[v as keyof typeof colors]}`}>{v.replace('_', ' ').toUpperCase()}</span>;
      }
    },
    { id: 'lastWorkingDay', accessor: 'lastWorkingDay', label: 'Last Working Day', sortable: true,
      render: (v: string, row: Separation) => (
        <div className="text-sm"><div className="font-medium text-gray-900">{new Date(v).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
        <div className="text-xs text-gray-500">{row.noticePeriod} days notice</div></div>
      )
    },
    { id: 'clearanceStatus', accessor: 'clearanceStatus', label: 'Clearance', sortable: true,
      render: (v: string, row: Separation) => (
        <div className="text-sm">
          <StatusBadge status={v as BadgeStatus} />
          <div className="text-xs space-y-0.5 mt-1">
            <div className={row.exitInterviewDone ? 'text-green-600' : 'text-red-600'}>
              {row.exitInterviewDone ? '✓' : '✗'} Exit Interview
            </div>
            <div className={row.fnfSettled ? 'text-green-600' : 'text-red-600'}>
              {row.fnfSettled ? '✓' : '✗'} F&F Settled
            </div>
          </div>
        </div>
      )
    },
    { id: 'yearsOfService', accessor: 'yearsOfService', label: 'Service', sortable: true,
      render: (v: number) => <div className="font-medium text-gray-900">{v} years</div>
    },
    { id: 'rehireEligible', accessor: 'rehireEligible', label: 'Rehire', sortable: true,
      render: (v: boolean) => v ? (
        <div className="flex items-center gap-1 text-green-600"><CheckCircle className="w-4 h-4" />Eligible</div>
      ) : (
        <div className="flex items-center gap-1 text-red-600"><XCircle className="w-4 h-4" />Not Eligible</div>
      )
    }
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2"><UserX className="h-8 w-8 text-red-600" />Employee Separations</h1>
        <p className="text-gray-600 mt-2">Track employee exits and clearance process</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white border-2 border-red-200 rounded-lg p-4">
          <div className="flex items-center justify-between"><div><p className="text-sm text-gray-600">Total Separations</p><p className="text-2xl font-bold text-red-600">{stats.total}</p></div>
          <UserX className="w-8 h-8 text-red-400" /></div>
        </div>
        <div className="bg-white border-2 border-orange-200 rounded-lg p-4">
          <div className="flex items-center justify-between"><div><p className="text-sm text-gray-600">This Month</p><p className="text-2xl font-bold text-orange-600">{stats.thisMonth}</p></div>
          <TrendingDown className="w-8 h-8 text-orange-400" /></div>
        </div>
        <div className="bg-white border-2 border-yellow-200 rounded-lg p-4">
          <div className="flex items-center justify-between"><div><p className="text-sm text-gray-600">Clearance Pending</p><p className="text-2xl font-bold text-yellow-600">{stats.pending}</p></div>
          <AlertCircle className="w-8 h-8 text-yellow-400" /></div>
        </div>
        <div className="bg-white border-2 border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between"><div><p className="text-sm text-gray-600">Avg Service</p><p className="text-2xl font-bold text-blue-600">{stats.avgYOS}y</p></div>
          <Users className="w-8 h-8 text-blue-400" /></div>
        </div>
      </div>

      {stats.pending > 0 && (
        <div className="bg-yellow-50 border-l-4 border-yellow-500 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-3"><AlertCircle className="w-6 h-6 text-yellow-600" />
            <div><h3 className="font-semibold text-yellow-900">Pending Clearances</h3>
            <p className="text-sm text-yellow-700">{stats.pending} employee{stats.pending > 1 ? 's have' : ' has'} pending clearance. Complete exit formalities immediately.</p></div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative"><Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input type="text" placeholder="Search by name or code..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent" />
          </div>
          <button onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${showFilters ? 'bg-red-50 border-red-300 text-red-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}>
            <Filter className="w-5 h-5" />Filters
          </button>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t">
            <div><label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
              <select value={selectedDepartment} onChange={(e) => setSelectedDepartment(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500">
                {departments.map(dept => <option key={dept} value={dept}>{dept === 'all' ? 'All Departments' : dept}</option>)}
              </select>
            </div>
            <div><label className="block text-sm font-medium text-gray-700 mb-2">Separation Type</label>
              <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500">
                {separationTypes.map(type => <option key={type} value={type}>{type === 'all' ? 'All Types' : type.replace('_', ' ').toUpperCase()}</option>)}
              </select>
            </div>
            <div><label className="block text-sm font-medium text-gray-700 mb-2">Clearance Status</label>
              <select value={selectedClearance} onChange={(e) => setSelectedClearance(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500">
                {clearanceStatuses.map(status => <option key={status} value={status}>{status === 'all' ? 'All Statuses' : status.toUpperCase()}</option>)}
              </select>
            </div>
          </div>
        )}
      </div>

      <DataTable data={filteredData} columns={columns} />
    </div>
  );
}

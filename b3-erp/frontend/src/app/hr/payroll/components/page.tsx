'use client';

import { useState, useMemo } from 'react';
import { DollarSign, Plus, Search, Filter, Edit, Trash2 } from 'lucide-react';
import DataTable from '@/components/DataTable';
import StatusBadge from '@/components/StatusBadge';

interface SalaryComponent {
  id: string;
  code: string;
  name: string;
  type: 'earning' | 'deduction';
  category: 'fixed' | 'variable' | 'statutory';
  calculationType: 'flat' | 'percentage' | 'formula';
  taxable: boolean;
  pfApplicable: boolean;
  esiApplicable: boolean;
  displayOrder: number;
  status: 'active' | 'inactive';
}

export default function ComponentsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  const mockComponents: SalaryComponent[] = [
    {
      id: '1', code: 'BASIC', name: 'Basic Salary', type: 'earning', category: 'fixed',
      calculationType: 'flat', taxable: true, pfApplicable: true, esiApplicable: true,
      displayOrder: 1, status: 'active'
    },
    {
      id: '2', code: 'HRA', name: 'House Rent Allowance', type: 'earning', category: 'fixed',
      calculationType: 'percentage', taxable: true, pfApplicable: false, esiApplicable: false,
      displayOrder: 2, status: 'active'
    },
    {
      id: '3', code: 'DA', name: 'Dearness Allowance', type: 'earning', category: 'fixed',
      calculationType: 'percentage', taxable: true, pfApplicable: true, esiApplicable: true,
      displayOrder: 3, status: 'active'
    },
    {
      id: '4', code: 'CONV', name: 'Conveyance Allowance', type: 'earning', category: 'fixed',
      calculationType: 'flat', taxable: true, pfApplicable: false, esiApplicable: false,
      displayOrder: 4, status: 'active'
    },
    {
      id: '5', code: 'MED', name: 'Medical Allowance', type: 'earning', category: 'fixed',
      calculationType: 'flat', taxable: true, pfApplicable: false, esiApplicable: false,
      displayOrder: 5, status: 'active'
    },
    {
      id: '6', code: 'SPEC', name: 'Special Allowance', type: 'earning', category: 'variable',
      calculationType: 'flat', taxable: true, pfApplicable: false, esiApplicable: false,
      displayOrder: 6, status: 'active'
    },
    {
      id: '7', code: 'BONUS', name: 'Performance Bonus', type: 'earning', category: 'variable',
      calculationType: 'flat', taxable: true, pfApplicable: false, esiApplicable: false,
      displayOrder: 7, status: 'active'
    },
    {
      id: '8', code: 'OT', name: 'Overtime Pay', type: 'earning', category: 'variable',
      calculationType: 'formula', taxable: true, pfApplicable: false, esiApplicable: false,
      displayOrder: 8, status: 'active'
    },
    {
      id: '9', code: 'PF_EMP', name: 'PF Employee Contribution', type: 'deduction', category: 'statutory',
      calculationType: 'percentage', taxable: false, pfApplicable: true, esiApplicable: false,
      displayOrder: 20, status: 'active'
    },
    {
      id: '10', code: 'ESI_EMP', name: 'ESI Employee Contribution', type: 'deduction', category: 'statutory',
      calculationType: 'percentage', taxable: false, pfApplicable: false, esiApplicable: true,
      displayOrder: 21, status: 'active'
    },
    {
      id: '11', code: 'PT', name: 'Professional Tax', type: 'deduction', category: 'statutory',
      calculationType: 'flat', taxable: false, pfApplicable: false, esiApplicable: false,
      displayOrder: 22, status: 'active'
    },
    {
      id: '12', code: 'TDS', name: 'Tax Deducted at Source', type: 'deduction', category: 'statutory',
      calculationType: 'formula', taxable: false, pfApplicable: false, esiApplicable: false,
      displayOrder: 23, status: 'active'
    },
    {
      id: '13', code: 'LOAN', name: 'Loan Recovery', type: 'deduction', category: 'variable',
      calculationType: 'flat', taxable: false, pfApplicable: false, esiApplicable: false,
      displayOrder: 24, status: 'active'
    },
    {
      id: '14', code: 'ADV', name: 'Advance Recovery', type: 'deduction', category: 'variable',
      calculationType: 'flat', taxable: false, pfApplicable: false, esiApplicable: false,
      displayOrder: 25, status: 'active'
    }
  ];

  const filteredData = useMemo(() => {
    return mockComponents.filter(component => {
      const matchesSearch = component.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           component.code.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = selectedType === 'all' || component.type === selectedType;
      const matchesCategory = selectedCategory === 'all' || component.category === selectedCategory;
      return matchesSearch && matchesType && matchesCategory;
    });
  }, [searchTerm, selectedType, selectedCategory]);

  const stats = {
    total: mockComponents.length,
    earnings: mockComponents.filter(c => c.type === 'earning').length,
    deductions: mockComponents.filter(c => c.type === 'deduction').length,
    statutory: mockComponents.filter(c => c.category === 'statutory').length
  };

  const getTypeColor = (type: string) => {
    return type === 'earning' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      fixed: 'bg-blue-100 text-blue-800',
      variable: 'bg-purple-100 text-purple-800',
      statutory: 'bg-orange-100 text-orange-800'
    };
    return colors[category as keyof typeof colors];
  };

  const columns = [
    { key: 'code', label: 'Code', sortable: true,
      render: (v: string) => <div className="font-semibold text-gray-900">{v}</div>
    },
    { key: 'name', label: 'Component Name', sortable: true,
      render: (v: string) => <div className="font-medium text-gray-900">{v}</div>
    },
    { key: 'type', label: 'Type', sortable: true,
      render: (v: string) => (
        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getTypeColor(v)}`}>
          {v.charAt(0).toUpperCase() + v.slice(1)}
        </span>
      )
    },
    { key: 'category', label: 'Category', sortable: true,
      render: (v: string) => (
        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getCategoryColor(v)}`}>
          {v.charAt(0).toUpperCase() + v.slice(1)}
        </span>
      )
    },
    { key: 'calculationType', label: 'Calculation', sortable: true,
      render: (v: string) => (
        <div className="text-sm text-gray-700 capitalize">{v}</div>
      )
    },
    { key: 'taxable', label: 'Taxable', sortable: true,
      render: (v: boolean) => (
        <div className="text-sm text-gray-700">{v ? 'Yes' : 'No'}</div>
      )
    },
    { key: 'pfApplicable', label: 'PF', sortable: true,
      render: (v: boolean) => (
        <div className={`text-sm ${v ? 'text-green-700' : 'text-gray-400'}`}>
          {v ? '✓' : '—'}
        </div>
      )
    },
    { key: 'esiApplicable', label: 'ESI', sortable: true,
      render: (v: boolean) => (
        <div className={`text-sm ${v ? 'text-green-700' : 'text-gray-400'}`}>
          {v ? '✓' : '—'}
        </div>
      )
    },
    { key: 'status', label: 'Status', sortable: true,
      render: (v: string) => <StatusBadge status={v} />
    },
    { key: 'id', label: 'Actions', sortable: false,
      render: () => (
        <div className="flex gap-2">
          <button className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors">
            <Edit className="h-4 w-4" />
          </button>
          <button className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          <DollarSign className="h-8 w-8 text-yellow-600" />
          Salary Components Master
        </h1>
        <p className="text-gray-600 mt-2">Configure salary components for payroll processing</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border-2 border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Components</p>
              <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
            </div>
            <DollarSign className="h-10 w-10 text-blue-400" />
          </div>
        </div>
        <div className="bg-white border-2 border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Earnings</p>
              <p className="text-2xl font-bold text-green-600">{stats.earnings}</p>
            </div>
            <DollarSign className="h-10 w-10 text-green-400" />
          </div>
        </div>
        <div className="bg-white border-2 border-red-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Deductions</p>
              <p className="text-2xl font-bold text-red-600">{stats.deductions}</p>
            </div>
            <DollarSign className="h-10 w-10 text-red-400" />
          </div>
        </div>
        <div className="bg-white border-2 border-orange-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Statutory</p>
              <p className="text-2xl font-bold text-orange-600">{stats.statutory}</p>
            </div>
            <DollarSign className="h-10 w-10 text-orange-400" />
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search components..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${
              showFilters ? 'bg-blue-50 border-blue-300 text-blue-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Filter className="h-4 w-4" />
            Filters
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Plus className="h-4 w-4" />
            Add Component
          </button>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Types</option>
                <option value="earning">Earnings</option>
                <option value="deduction">Deductions</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Categories</option>
                <option value="fixed">Fixed</option>
                <option value="variable">Variable</option>
                <option value="statutory">Statutory</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Components Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-900">Salary Components</h3>
        </div>
        <DataTable data={filteredData} columns={columns} />
      </div>

      {/* Info Box */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-blue-900 mb-2">Component Types</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• <strong>Fixed:</strong> Standard components with consistent values (Basic, HRA, DA)</li>
          <li>• <strong>Variable:</strong> Components that vary each month (Bonus, OT, Incentives)</li>
          <li>• <strong>Statutory:</strong> Mandatory deductions as per law (PF, ESI, PT, TDS)</li>
          <li>• <strong>Calculation Types:</strong> Flat (fixed amount), Percentage (% of base), Formula (custom calculation)</li>
        </ul>
      </div>
    </div>
  );
}

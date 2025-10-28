'use client';

import React, { useState, useMemo } from 'react';
import { Plus, Search, Download, Filter, X, Receipt, TrendingUp, FileText, Package, Percent } from 'lucide-react';
import { DataTable, Column } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { mockHSNSAC, HSNSAC, getHSNSACStats } from '@/data/common-masters/hsn-sac';

export default function HSNSACMasterPage() {
  const [hsnSacRecords, setHsnSacRecords] = useState<HSNSAC[]>(mockHSNSAC);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCodeType, setFilterCodeType] = useState<string>('all');
  const [filterApplicableFor, setFilterApplicableFor] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  const filteredData = useMemo(() => {
    return hsnSacRecords.filter(record => {
      const matchesSearch =
        record.code.includes(searchTerm) ||
        record.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.category.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCodeType = filterCodeType === 'all' || record.codeType === filterCodeType;
      const matchesApplicableFor = filterApplicableFor === 'all' || record.applicableFor === filterApplicableFor;

      return matchesSearch && matchesCodeType && matchesApplicableFor;
    });
  }, [hsnSacRecords, searchTerm, filterCodeType, filterApplicableFor]);

  const getCodeTypeColor = (type: string) => {
    return type === 'HSN' ? 'bg-green-100 text-green-800' : 'bg-purple-100 text-purple-800';
  };

  const getGSTRateColor = (rate: number) => {
    if (rate === 0) return 'text-gray-600';
    if (rate <= 5) return 'text-green-600';
    if (rate <= 12) return 'text-blue-600';
    if (rate <= 18) return 'text-orange-600';
    return 'text-red-600';
  };

  const columns: Column<HSNSAC>[] = [
    {
      id: 'code',
      header: 'HSN/SAC Code',
      accessor: 'code',
      sortable: true,
      render: (value, row) => (
        <div>
          <div className="font-mono font-semibold text-lg text-blue-600">{value}</div>
          <div className="mt-1">
            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getCodeTypeColor(row.codeType)}`}>
              {row.codeType} Code
            </span>
          </div>
        </div>
      )
    },
    {
      id: 'description',
      header: 'Description',
      accessor: 'description',
      sortable: true,
      render: (value, row) => (
        <div>
          <div className="font-medium text-gray-900">{value}</div>
          <div className="text-xs text-gray-500 mt-0.5">
            <span className="font-medium">Category:</span> {row.category}
          </div>
          {row.category && (
            <div className="text-xs text-gray-400">
              <span className="font-medium">Sub:</span> {row.category}
            </div>
          )}
        </div>
      )
    },
    {
      id: 'gst',
      header: 'GST Structure',
      accessor: 'totalGST',
      sortable: true,
      render: (value, row) => (
        <div className="text-sm">
          <div className={`font-bold ${getGSTRateColor(value)}`}>
            {value}% Total GST
          </div>
          <div className="text-xs text-gray-600 mt-1 space-y-0.5">
            <div>CGST: {row.cgstRate}%</div>
            <div>SGST: {row.sgstRate}%</div>
            {row.igstRate && <div>IGST: {row.igstRate}%</div>}
            {row.cessRate && (
              <div className="text-red-600 font-medium">Cess: {row.cessRate}%</div>
            )}
          </div>
        </div>
      )
    },
    {
      id: 'applicability',
      header: 'Applicable For',
      accessor: 'applicableFor',
      sortable: true,
      render: (value) => (
        <div className="text-sm">
          <div className="font-medium text-gray-900 capitalize flex items-center gap-1">
            {value === 'goods' && <Package className="w-4 h-4 text-blue-600" />}
            {value === 'services' && <FileText className="w-4 h-4 text-purple-600" />}
            {value === 'both' && <span className="text-gray-600">📦 + 📄</span>}
            {value}
          </div>
        </div>
      )
    },
    {
      id: 'usage',
      header: 'Usage Analytics',
      accessor: 'transactionsCount',
      sortable: true,
      render: (value, row) => (
        <div className="text-xs">
          <div className="font-medium text-gray-900">{row.itemsCount} items</div>
          <div className="text-blue-600">{value.toLocaleString('en-IN')} transactions</div>
          <div className="text-gray-500 mt-1">
            Taxable: ₹{(row.totalTaxableAmount / 1000000).toFixed(2)}M
          </div>
          <div className="text-green-600 font-medium">
            Tax: ₹{(row.totalTaxCollected / 1000000).toFixed(2)}M
          </div>
        </div>
      )
    },
    {
      id: 'exemptions',
      header: 'Special Conditions',
      accessor: 'isExempted',
      sortable: false,
      render: (value, row) => (
        <div className="text-xs space-y-1">
          {row.isExempted && (
            <div className="text-green-600 font-medium">✓ Exempted</div>
          )}
          {row.isNilRated && (
            <div className="text-blue-600 font-medium">✓ Nil Rated</div>
          )}
          {row.isReverseCharge && (
            <div className="text-orange-600 font-medium">⚠ Reverse Charge</div>
          )}
          {!row.isExempted && !row.isNilRated && !row.isReverseCharge && (
            <div className="text-gray-400">Standard</div>
          )}
        </div>
      )
    },
    {
      id: 'status',
      header: 'Status',
      accessor: 'isActive',
      sortable: true,
      render: (value) => (
        <StatusBadge
          status={value ? 'active' : 'inactive'}
          text={value ? 'Active' : 'Inactive'}
        />
      )
    },
    {
      id: 'actions',
      header: 'Actions',
      accessor: 'id',
      sortable: false,
      align: 'right',
      render: (_, row) => (
        <div className="flex items-center justify-end gap-2">
          <button
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            onClick={(e) => {
              e.stopPropagation();
              console.log('Edit HSN/SAC:', row);
            }}
          >
            Edit
          </button>
          <button
            className="text-green-600 hover:text-green-800 text-sm font-medium"
            onClick={(e) => {
              e.stopPropagation();
              console.log('View items:', row);
            }}
          >
            Items
          </button>
          <button
            className="text-red-600 hover:text-red-800 text-sm font-medium"
            onClick={(e) => {
              e.stopPropagation();
              if (confirm(`Delete HSN/SAC code ${row.code}?`)) {
                setHsnSacRecords(prev => prev.filter(h => h.id !== row.id));
              }
            }}
          >
            Delete
          </button>
        </div>
      )
    }
  ];

  const clearFilters = () => {
    setSearchTerm('');
    setFilterCodeType('all');
    setFilterApplicableFor('all');
  };

  const activeFilterCount = [
    filterCodeType !== 'all',
    filterApplicableFor !== 'all',
    searchTerm !== ''
  ].filter(Boolean).length;

  const stats = useMemo(() => getHSNSACStats(), [hsnSacRecords]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Receipt className="w-7 h-7 text-blue-600" />
            HSN/SAC Code Master
          </h1>
          <p className="text-gray-600 mt-1">Manage HSN and SAC codes for GST compliance and taxation</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => console.log('Export HSN/SAC')}
            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
          <button
            onClick={() => console.log('Add HSN/SAC')}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Code</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-600 mb-1">Total Codes</div>
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-600 mb-1">HSN Codes</div>
          <div className="text-2xl font-bold text-green-600">{stats.hsnCount}</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-600 mb-1">SAC Codes</div>
          <div className="text-2xl font-bold text-purple-600">{stats.sacCount}</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-600 mb-1">Total Items</div>
          <div className="text-2xl font-bold text-blue-600">{stats.totalItems}</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-600 mb-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> Taxable
          </div>
          <div className="text-2xl font-bold text-orange-600">₹{(stats.totalTaxableAmount / 10000000).toFixed(1)}Cr</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-600 mb-1 flex items-center gap-1">
            <Percent className="w-3 h-3" /> Tax Collected
          </div>
          <div className="text-2xl font-bold text-red-600">₹{(stats.totalTaxCollected / 10000000).toFixed(1)}Cr</div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by HSN/SAC code, description, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`inline-flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${
              showFilters ? 'bg-blue-50 border-blue-300 text-blue-700' : 'border-gray-300 hover:bg-gray-50'
            }`}
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-blue-600 rounded-full">
                {activeFilterCount}
              </span>
            )}
          </button>
          {activeFilterCount > 0 && (
            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <X className="w-4 h-4" />
              <span>Clear</span>
            </button>
          )}
        </div>

        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Code Type
              </label>
              <select
                value={filterCodeType}
                onChange={(e) => setFilterCodeType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="HSN">HSN - Goods</option>
                <option value="SAC">SAC - Services</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Applicable For
              </label>
              <select
                value={filterApplicableFor}
                onChange={(e) => setFilterApplicableFor(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                <option value="goods">Goods Only</option>
                <option value="services">Services Only</option>
                <option value="both">Both</option>
              </select>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <DataTable
          data={filteredData}
          columns={columns}
          pagination={{
            enabled: true,
            pageSize: 10
          }}
          sorting={{
            enabled: true,
            defaultSort: { column: 'code', direction: 'asc' }
          }}
          emptyMessage="No HSN/SAC codes found"
          emptyDescription="Try adjusting your search or filters to find what you're looking for."
        />
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
          <Receipt className="w-5 h-5" />
          HSN/SAC Code Management Guidelines
        </h3>
        <ul className="text-sm text-blue-800 space-y-1 ml-7">
          <li>✓ <strong>HSN Codes:</strong> Harmonized System of Nomenclature for goods classification (6-8 digit codes)</li>
          <li>✓ <strong>SAC Codes:</strong> Services Accounting Code for service classification (6 digit codes)</li>
          <li>✓ <strong>GST Structure:</strong> CGST + SGST for intra-state, IGST for inter-state transactions</li>
          <li>✓ <strong>Tax Slabs:</strong> 0%, 5%, 12%, 18%, 28% with additional cess on certain items</li>
          <li>✓ <strong>Special Cases:</strong> Exempted goods/services, nil-rated items, reverse charge mechanism</li>
          <li>✓ <strong>Compliance:</strong> Accurate HSN/SAC codes essential for GST filing and tax calculation</li>
          <li>✓ <strong>Analytics:</strong> Track taxable turnover and tax collected for each HSN/SAC code</li>
        </ul>
      </div>
    </div>
  );
}

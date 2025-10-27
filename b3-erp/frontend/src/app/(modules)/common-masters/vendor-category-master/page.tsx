'use client';

import React, { useState, useMemo } from 'react';
import { Plus, Search, Download, Package, TrendingUp } from 'lucide-react';
import { DataTable, Column } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { mockVendorCategories, VendorCategory, getVendorCategoryStats } from '@/data/common-masters/vendor-categories';

export default function VendorCategoryMasterPage() {
  const [categories] = useState<VendorCategory[]>(mockVendorCategories);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = useMemo(() => categories.filter(c => c.categoryName.toLowerCase().includes(searchTerm.toLowerCase()) || c.categoryCode.toLowerCase().includes(searchTerm.toLowerCase())), [categories, searchTerm]);

  const columns: Column<VendorCategory>[] = [
    { id: 'category', header: 'Category', accessor: 'categoryName', sortable: true, render: (v, row) => (<div><div className="font-medium text-gray-900">{v}</div><div className="text-xs"><span className="font-mono text-blue-600">{row.categoryCode}</span></div></div>) },
    { id: 'material', header: 'Material Type', accessor: 'materialType', sortable: true, render: (v) => (<div className="text-xs capitalize">{v.replace('_', ' ')}</div>) },
    { id: 'quality', header: 'Quality', accessor: 'qualityRating', sortable: true, render: (v, row) => (<div className="text-xs"><div className="font-semibold text-blue-600">Grade {v}</div><div className="text-gray-500">Lead: {row.leadTimeDays}d</div></div>) },
    { id: 'payment', header: 'Payment', accessor: 'defaultPaymentTerms', sortable: true, render: (v, row) => (<div className="text-xs"><div className="text-gray-900">{v}</div>{row.advancePaymentPercentage && <div className="text-green-600">{row.advancePaymentPercentage}% advance</div>}</div>) },
    { id: 'usage', header: 'Usage', accessor: 'vendorsCount', sortable: true, render: (v, row) => (<div className="text-xs"><div className="font-medium text-gray-900">{v} vendors</div><div className="text-green-600">Purchases: ₹{(row.totalPurchases / 1000000).toFixed(1)}M</div><div className="text-orange-600">Outstanding: ₹{(row.outstandingAmount / 1000000).toFixed(1)}M</div></div>) },
    { id: 'status', header: 'Status', accessor: 'isActive', sortable: true, render: (v) => <StatusBadge status={v ? 'active' : 'inactive'} text={v ? 'Active' : 'Inactive'} /> }
  ];

  const stats = useMemo(() => getVendorCategoryStats(), [categories]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2"><Package className="w-7 h-7 text-blue-600" />Vendor Category Master</h1><p className="text-gray-600 mt-1">Manage vendor categories and material types</p></div>
        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"><Download className="w-4 h-4" />Export</button>
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"><Plus className="w-4 h-4" />Add Category</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg border p-4"><div className="text-sm text-gray-600 mb-1">Total Categories</div><div className="text-2xl font-bold text-gray-900">{stats.total}</div></div>
        <div className="bg-white rounded-lg border p-4"><div className="text-sm text-gray-600 mb-1">Total Vendors</div><div className="text-2xl font-bold text-blue-600">{stats.totalVendors}</div></div>
        <div className="bg-white rounded-lg border p-4"><div className="text-sm text-gray-600 mb-1 flex items-center gap-1"><TrendingUp className="w-3 h-3" /> Total Purchases</div><div className="text-2xl font-bold text-green-600">₹{(stats.totalPurchases / 10000000).toFixed(1)}Cr</div></div>
        <div className="bg-white rounded-lg border p-4"><div className="text-sm text-gray-600 mb-1">Outstanding</div><div className="text-2xl font-bold text-orange-600">₹{(stats.totalOutstanding / 1000000).toFixed(1)}M</div></div>
        <div className="bg-white rounded-lg border p-4"><div className="text-sm text-gray-600 mb-1">Grade A</div><div className="text-2xl font-bold text-purple-600">{stats.gradeA}</div></div>
      </div>

      <div className="bg-white rounded-lg border p-4">
        <div className="flex-1 relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" /><input type="text" placeholder="Search vendor categories..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" /></div>
      </div>

      <div className="bg-white rounded-lg border overflow-hidden">
        <DataTable data={filteredData} columns={columns} pagination={{ enabled: true, pageSize: 10 }} sorting={{ enabled: true }} emptyMessage="No vendor categories found" />
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2"><Package className="w-5 h-5 inline mr-2" />Vendor Category Management</h3>
        <ul className="text-sm text-blue-800 space-y-1 ml-7">
          <li>✓ Vendor classification by material type (raw materials, components, services, etc.)</li>
          <li>✓ Quality rating system with inspection and certification requirements</li>
          <li>✓ Payment terms and advance payment percentage configuration</li>
        </ul>
      </div>
    </div>
  );
}

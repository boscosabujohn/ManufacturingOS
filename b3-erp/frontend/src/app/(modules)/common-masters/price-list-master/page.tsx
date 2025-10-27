'use client';

import React, { useState, useMemo } from 'react';
import { Plus, Search, Download, DollarSign, TrendingUp } from 'lucide-react';
import { DataTable, Column } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { mockPriceLists, PriceList, getPriceListStats } from '@/data/common-masters/price-lists';

export default function PriceListMasterPage() {
  const [priceLists] = useState<PriceList[]>(mockPriceLists);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = useMemo(() => priceLists.filter(p => p.priceListName.toLowerCase().includes(searchTerm.toLowerCase()) || p.priceListCode.toLowerCase().includes(searchTerm.toLowerCase())), [priceLists, searchTerm]);

  const columns: Column<PriceList>[] = [
    { id: 'priceList', header: 'Price List', accessor: 'priceListName', sortable: true, render: (v, row) => (<div><div className="font-medium text-gray-900 flex items-center gap-2">{row.isDefault && <DollarSign className="w-4 h-4 text-green-600" />}{v}</div><div className="text-xs"><span className="font-mono text-blue-600">{row.priceListCode}</span></div></div>) },
    { id: 'pricing', header: 'Pricing', accessor: 'pricingMethod', sortable: true, render: (v, row) => (<div className="text-xs"><div className="capitalize text-gray-900">{v.replace('_', ' ')}</div>{row.discountPercentage && <div className="text-green-600">{row.discountPercentage}% off MRP</div>}{row.markupPercentage && <div className="text-blue-600">{row.markupPercentage}% markup</div>}</div>) },
    { id: 'category', header: 'Category', accessor: 'customerCategory', sortable: true, render: (v) => (<div className="text-xs">{v || 'All'}</div>) },
    { id: 'items', header: 'Items', accessor: 'itemsCount', sortable: true, render: (v, row) => (<div className="text-xs"><div className="font-medium text-gray-900">{v} items</div><div className="text-gray-500">Avg: ₹{row.avgPrice.toLocaleString()}</div></div>) },
    { id: 'usage', header: 'Usage', accessor: 'customersUsing', sortable: true, render: (v, row) => (<div className="text-xs"><div className="font-medium text-gray-900">{v} customers</div><div className="text-green-600">{row.transactionsCount} txns</div><div className="text-blue-600">₹{(row.totalAmount / 1000000).toFixed(1)}M</div></div>) },
    { id: 'status', header: 'Status', accessor: 'isActive', sortable: true, render: (v) => <StatusBadge status={v ? 'active' : 'inactive'} text={v ? 'Active' : 'Inactive'} /> }
  ];

  const stats = useMemo(() => getPriceListStats(), [priceLists]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2"><DollarSign className="w-7 h-7 text-blue-600" />Price List Master</h1><p className="text-gray-600 mt-1">Manage pricing structures and customer-specific rates</p></div>
        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"><Download className="w-4 h-4" />Export</button>
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"><Plus className="w-4 h-4" />Add Price List</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg border p-4"><div className="text-sm text-gray-600 mb-1">Total Price Lists</div><div className="text-2xl font-bold text-gray-900">{stats.total}</div></div>
        <div className="bg-white rounded-lg border p-4"><div className="text-sm text-gray-600 mb-1">For Sales</div><div className="text-2xl font-bold text-blue-600">{stats.forSales}</div></div>
        <div className="bg-white rounded-lg border p-4"><div className="text-sm text-gray-600 mb-1">Total Customers</div><div className="text-2xl font-bold text-green-600">{stats.totalCustomers}</div></div>
        <div className="bg-white rounded-lg border p-4"><div className="text-sm text-gray-600 mb-1 flex items-center gap-1"><TrendingUp className="w-3 h-3" /> Total Amount</div><div className="text-2xl font-bold text-purple-600">₹{(stats.totalAmount / 10000000).toFixed(1)}Cr</div></div>
        <div className="bg-white rounded-lg border p-4"><div className="text-sm text-gray-600 mb-1">Transactions</div><div className="text-2xl font-bold text-orange-600">{stats.totalTransactions}</div></div>
      </div>

      <div className="bg-white rounded-lg border p-4">
        <div className="flex-1 relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" /><input type="text" placeholder="Search price lists..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" /></div>
      </div>

      <div className="bg-white rounded-lg border overflow-hidden">
        <DataTable data={filteredData} columns={columns} pagination={{ enabled: true, pageSize: 10 }} sorting={{ enabled: true }} emptyMessage="No price lists found" />
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2"><DollarSign className="w-5 h-5 inline mr-2" />Price List Management</h3>
        <ul className="text-sm text-blue-800 space-y-1 ml-7">
          <li>✓ Customer category-specific pricing with tiered discount structures</li>
          <li>✓ Multiple pricing methods: fixed, markup-based, or discount from MRP</li>
          <li>✓ Effective date management with auto-update capabilities</li>
        </ul>
      </div>
    </div>
  );
}

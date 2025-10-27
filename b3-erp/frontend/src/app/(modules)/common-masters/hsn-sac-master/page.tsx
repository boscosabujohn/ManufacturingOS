'use client';

import React, { useState, useMemo } from 'react';
import { Plus, Search, Download, Receipt, TrendingUp } from 'lucide-react';
import { DataTable, Column } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { mockHSNSAC, HSNSAC, getHSNSACStats } from '@/data/common-masters/hsn-sac';

export default function HSNSACMasterPage() {
  const [hsnSacRecords] = useState<HSNSAC[]>(mockHSNSAC);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = useMemo(() => hsnSacRecords.filter(h => h.code.includes(searchTerm) || h.description.toLowerCase().includes(searchTerm.toLowerCase())), [hsnSacRecords, searchTerm]);

  const getCodeTypeColor = (type: string) => type === 'HSN' ? 'bg-green-100 text-green-800' : 'bg-purple-100 text-purple-800';

  const columns: Column<HSNSAC>[] = [
    { id: 'code', header: 'HSN/SAC Code', accessor: 'code', sortable: true, render: (v, row) => (<div><div className="font-mono font-semibold text-blue-600">{v}</div><div className="text-xs"><span className={`px-2 py-0.5 rounded text-xs font-medium ${getCodeTypeColor(row.codeType)}`}>{row.codeType}</span></div></div>) },
    { id: 'description', header: 'Description', accessor: 'description', sortable: true, render: (v, row) => (<div><div className="font-medium text-gray-900">{v}</div><div className="text-xs text-gray-500">{row.category}</div></div>) },
    { id: 'gst', header: 'GST Rates', accessor: 'totalGST', sortable: true, render: (v, row) => (<div className="text-xs"><div className="font-semibold text-orange-600">{v}% Total</div><div className="text-gray-600">CGST: {row.cgstRate}%</div><div className="text-gray-600">SGST: {row.sgstRate}%</div>{row.cessRate && <div className="text-red-600">Cess: {row.cessRate}%</div>}</div>) },
    { id: 'applicability', header: 'For', accessor: 'applicableFor', sortable: true, render: (v) => (<div className="text-xs capitalize">{v}</div>) },
    { id: 'usage', header: 'Usage', accessor: 'transactionsCount', sortable: true, render: (v, row) => (<div className="text-xs"><div className="font-medium text-gray-900">{row.itemsCount} items</div><div className="text-blue-600">{v} txns</div><div className="text-gray-500">Taxable: ₹{(row.totalTaxableAmount / 1000000).toFixed(1)}M</div><div className="text-green-600">Tax: ₹{(row.totalTaxCollected / 1000000).toFixed(1)}M</div></div>) },
    { id: 'status', header: 'Status', accessor: 'isActive', sortable: true, render: (v) => <StatusBadge status={v ? 'active' : 'inactive'} text={v ? 'Active' : 'Inactive'} /> }
  ];

  const stats = useMemo(() => getHSNSACStats(), [hsnSacRecords]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2"><Receipt className="w-7 h-7 text-blue-600" />HSN/SAC Code Master</h1><p className="text-gray-600 mt-1">Manage HSN and SAC codes for GST compliance</p></div>
        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"><Download className="w-4 h-4" />Export</button>
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"><Plus className="w-4 h-4" />Add Code</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <div className="bg-white rounded-lg border p-4"><div className="text-sm text-gray-600 mb-1">Total Codes</div><div className="text-2xl font-bold text-gray-900">{stats.total}</div></div>
        <div className="bg-white rounded-lg border p-4"><div className="text-sm text-gray-600 mb-1">HSN Codes</div><div className="text-2xl font-bold text-green-600">{stats.hsnCount}</div></div>
        <div className="bg-white rounded-lg border p-4"><div className="text-sm text-gray-600 mb-1">SAC Codes</div><div className="text-2xl font-bold text-purple-600">{stats.sacCount}</div></div>
        <div className="bg-white rounded-lg border p-4"><div className="text-sm text-gray-600 mb-1">Total Items</div><div className="text-2xl font-bold text-blue-600">{stats.totalItems}</div></div>
        <div className="bg-white rounded-lg border p-4"><div className="text-sm text-gray-600 mb-1 flex items-center gap-1"><TrendingUp className="w-3 h-3" /> Taxable</div><div className="text-2xl font-bold text-orange-600">₹{(stats.totalTaxableAmount / 10000000).toFixed(1)}Cr</div></div>
        <div className="bg-white rounded-lg border p-4"><div className="text-sm text-gray-600 mb-1">Tax Collected</div><div className="text-2xl font-bold text-red-600">₹{(stats.totalTaxCollected / 10000000).toFixed(1)}Cr</div></div>
      </div>

      <div className="bg-white rounded-lg border p-4">
        <div className="flex-1 relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" /><input type="text" placeholder="Search by HSN/SAC code or description..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" /></div>
      </div>

      <div className="bg-white rounded-lg border overflow-hidden">
        <DataTable data={filteredData} columns={columns} pagination={{ enabled: true, pageSize: 10 }} sorting={{ enabled: true }} emptyMessage="No HSN/SAC codes found" />
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2"><Receipt className="w-5 h-5 inline mr-2" />HSN/SAC Code Management</h3>
        <ul className="text-sm text-blue-800 space-y-1 ml-7">
          <li>✓ HSN codes for goods and SAC codes for services with GST classification</li>
          <li>✓ CGST, SGST, IGST, and Cess rate configuration for accurate tax calculation</li>
          <li>✓ Usage analytics: taxable amount and total tax collected per code</li>
          <li>✓ GST compliance reporting for Indian taxation requirements</li>
        </ul>
      </div>
    </div>
  );
}

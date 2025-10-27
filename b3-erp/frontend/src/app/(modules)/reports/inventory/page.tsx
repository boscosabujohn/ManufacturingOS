'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Package, FileText, ArrowLeft, Download, Eye, Calendar } from 'lucide-react';

const inventoryReports = [
  { id: '1', name: 'Stock Valuation Report', description: 'Current inventory value across all warehouses', category: 'Valuation', frequency: 'Daily', lastGenerated: '2025-10-27' },
  { id: '2', name: 'Inventory Aging Analysis', description: 'Stock age distribution and slow-moving items', category: 'Aging', frequency: 'Weekly', lastGenerated: '2025-10-26' },
  { id: '3', name: 'Stock Movement Report', description: 'Detailed inward/outward stock movements', category: 'Movement', frequency: 'Daily', lastGenerated: '2025-10-27' },
  { id: '4', name: 'Reorder Level Analysis', description: 'Items below reorder point requiring purchase', category: 'Reordering', frequency: 'Daily', lastGenerated: '2025-10-27' },
  { id: '5', name: 'ABC Analysis Report', description: 'Classification of items by value contribution', category: 'Analysis', frequency: 'Monthly', lastGenerated: '2025-10-20' },
  { id: '6', name: 'Stock Reconciliation Report', description: 'Physical vs system stock comparison', category: 'Reconciliation', frequency: 'Weekly', lastGenerated: '2025-10-25' },
  { id: '7', name: 'Warehouse Utilization Report', description: 'Space utilization and capacity analysis', category: 'Warehouse', frequency: 'Monthly', lastGenerated: '2025-10-20' },
  { id: '8', name: 'Inventory Turnover Report', description: 'Stock turnover ratio by category/item', category: 'Analysis', frequency: 'Monthly', lastGenerated: '2025-10-20' },
];

export default function InventoryReportsPage() {
  const [filterCategory, setFilterCategory] = useState('all');
  const categories = ['all', ...Array.from(new Set(inventoryReports.map(r => r.category)))];
  const filteredReports = filterCategory === 'all' ? inventoryReports : inventoryReports.filter(r => r.category === filterCategory);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <Link href="/reports" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Reports
          </Link>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Package className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Inventory Reports</h1>
              <p className="text-gray-600">Stock management and warehouse analytics</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow border border-gray-200 p-4 mb-6">
          <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-lg">
            {categories.map(cat => (<option key={cat} value={cat}>{cat === 'all' ? 'All Categories' : cat}</option>))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReports.map((report) => (
            <div key={report.id} className="bg-white rounded-lg shadow border border-gray-200 hover:shadow-lg transition-all p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-orange-600" />
                </div>
                <span className="text-xs px-2 py-1 bg-blue-100 text-blue-600 rounded">{report.frequency}</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{report.name}</h3>
              <p className="text-sm text-gray-600 mb-3">{report.description}</p>
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <span className="flex items-center gap-1 text-xs text-gray-500"><Calendar className="w-3 h-3" />{report.lastGenerated}</span>
                <div className="flex gap-2">
                  <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"><Eye className="w-4 h-4" /></button>
                  <button className="p-1.5 text-green-600 hover:bg-green-50 rounded"><Download className="w-4 h-4" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

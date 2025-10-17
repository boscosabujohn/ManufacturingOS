'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Search, Eye, Edit, Package, AlertTriangle, TrendingUp, TrendingDown, Download, Filter, ChevronLeft, ChevronRight, BarChart3, Warehouse } from 'lucide-react';

interface StockItem {
  id: string;
  itemCode: string;
  itemName: string;
  category: string;
  currentStock: number;
  unit: string;
  reorderLevel: number;
  maxLevel: number;
  location: string;
  lastUpdated: string;
  status: 'in_stock' | 'low_stock' | 'out_of_stock' | 'overstock';
  unitCost: number;
  totalValue: number;
}

const mockStockItems: StockItem[] = [
  {
    id: 'STK-001',
    itemCode: 'SS304-001',
    itemName: 'Stainless Steel Sheet 304 - 2mm',
    category: 'Raw Material',
    currentStock: 450,
    unit: 'kg',
    reorderLevel: 200,
    maxLevel: 800,
    location: 'RM-A-01-AA-001',
    lastUpdated: '2025-10-15',
    status: 'in_stock',
    unitCost: 8.5,
    totalValue: 3825,
  },
  {
    id: 'STK-002',
    itemCode: 'MTR-ELC-001',
    itemName: 'Electric Motor 3HP 1440 RPM',
    category: 'Components',
    currentStock: 15,
    unit: 'pcs',
    reorderLevel: 20,
    maxLevel: 50,
    location: 'RM-B-02-BB-005',
    lastUpdated: '2025-10-14',
    status: 'low_stock',
    unitCost: 245.00,
    totalValue: 3675,
  },
  {
    id: 'STK-003',
    itemCode: 'VLV-SS-001',
    itemName: 'SS Ball Valve 1 inch',
    category: 'Components',
    currentStock: 0,
    unit: 'pcs',
    reorderLevel: 10,
    maxLevel: 50,
    location: 'RM-C-03-CC-010',
    lastUpdated: '2025-10-12',
    status: 'out_of_stock',
    unitCost: 35.00,
    totalValue: 0,
  },
  {
    id: 'STK-004',
    itemCode: 'PKG-BOX-001',
    itemName: 'Corrugated Box Large',
    category: 'Packaging',
    currentStock: 1200,
    unit: 'pcs',
    reorderLevel: 500,
    maxLevel: 1000,
    location: 'RM-D-04-DD-015',
    lastUpdated: '2025-10-15',
    status: 'overstock',
    unitCost: 2.5,
    totalValue: 3000,
  },
  {
    id: 'STK-005',
    itemCode: 'FG-KIT-001',
    itemName: 'Commercial Kitchen Equipment Set',
    category: 'Finished Goods',
    currentStock: 8,
    unit: 'set',
    reorderLevel: 5,
    maxLevel: 20,
    location: 'FG-A-01-AA-001',
    lastUpdated: '2025-10-13',
    status: 'in_stock',
    unitCost: 12500.00,
    totalValue: 100000,
  },
  {
    id: 'STK-006',
    itemCode: 'WLD-ROD-001',
    itemName: 'Welding Rod SS 316',
    category: 'Consumables',
    currentStock: 25,
    unit: 'kg',
    reorderLevel: 30,
    maxLevel: 100,
    location: 'RM-E-05-EE-020',
    lastUpdated: '2025-10-14',
    status: 'low_stock',
    unitCost: 15.00,
    totalValue: 375,
  },
];

const statusColors = {
  in_stock: 'bg-green-100 text-green-700',
  low_stock: 'bg-yellow-100 text-yellow-700',
  out_of_stock: 'bg-red-100 text-red-700',
  overstock: 'bg-blue-100 text-blue-700',
};

const statusLabels = {
  in_stock: 'In Stock',
  low_stock: 'Low Stock',
  out_of_stock: 'Out of Stock',
  overstock: 'Overstock',
};

export default function StockPage() {
  const router = useRouter();
  const [stockItems, setStockItems] = useState<StockItem[]>(mockStockItems);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredItems = stockItems.filter((item) => {
    const matchesSearch =
      item.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.itemCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedItems = filteredItems.slice(startIndex, startIndex + itemsPerPage);

  const stats = {
    totalItems: stockItems.length,
    totalValue: stockItems.reduce((sum, item) => sum + item.totalValue, 0),
    lowStock: stockItems.filter((item) => item.status === 'low_stock').length,
    outOfStock: stockItems.filter((item) => item.status === 'out_of_stock').length,
  };

  const categories = Array.from(new Set(stockItems.map((item) => item.category)));

  return (
    <div className="w-full h-full px-4 sm:px-6 lg:px-8 py-6">
      {/* Stats */}
      <div className="mb-6 flex items-start gap-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 flex-1">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total Items</p>
                <p className="text-2xl font-bold text-blue-900 mt-1">{stats.totalItems}</p>
              </div>
              <Package className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Total Value</p>
                <p className="text-2xl font-bold text-green-900 mt-1">
                  ${(stats.totalValue / 1000).toFixed(0)}K
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4 border border-yellow-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-600">Low Stock</p>
                <p className="text-2xl font-bold text-yellow-900 mt-1">{stats.lowStock}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-600" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4 border border-red-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600">Out of Stock</p>
                <p className="text-2xl font-bold text-red-900 mt-1">{stats.outOfStock}</p>
              </div>
              <TrendingDown className="h-8 w-8 text-red-600" />
            </div>
          </div>
        </div>

        <button
          onClick={() => router.push('/inventory/stock/add')}
          className="flex items-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors h-fit flex-shrink-0"
        >
          <Plus className="h-5 w-5" />
          <span>Add Stock</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by item name, code, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Status</option>
          <option value="in_stock">In Stock</option>
          <option value="low_stock">Low Stock</option>
          <option value="out_of_stock">Out of Stock</option>
          <option value="overstock">Overstock</option>
        </select>
        <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
          <Download className="h-4 w-4" />
          <span>Export</span>
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item Code</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Levels</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Value</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paginatedItems.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">{item.itemCode}</td>
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">{item.itemName}</div>
                  <div className="text-sm text-gray-500">Updated: {item.lastUpdated}</div>
                </td>
                <td className="px-6 py-4 text-sm">{item.category}</td>
                <td className="px-6 py-4">
                  <div className="font-bold text-blue-900">
                    {item.currentStock} {item.unit}
                  </div>
                  <div className="text-xs text-gray-500">${item.unitCost}/{item.unit}</div>
                </td>
                <td className="px-6 py-4 text-sm">
                  <div className="text-gray-700">Min: {item.reorderLevel}</div>
                  <div className="text-gray-700">Max: {item.maxLevel}</div>
                </td>
                <td className="px-6 py-4 text-sm font-mono text-gray-600">{item.location}</td>
                <td className="px-6 py-4 font-semibold text-green-700">${item.totalValue.toLocaleString()}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusColors[item.status]}`}>
                    {statusLabels[item.status]}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => router.push(`/inventory/stock/view/${item.id}`)}
                      className="flex items-center space-x-1 px-3 py-1.5 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-sm font-medium"
                      title="View Details"
                    >
                      <Eye className="h-4 w-4" />
                      <span>View</span>
                    </button>
                    <button
                      onClick={() => router.push(`/inventory/stock/edit/${item.id}`)}
                      className="flex items-center space-x-1 px-3 py-1.5 text-green-600 bg-green-50 hover:bg-green-100 rounded-lg transition-colors text-sm font-medium"
                      title="Edit"
                    >
                      <Edit className="h-4 w-4" />
                      <span>Adjust</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredItems.length)} of{' '}
            {filteredItems.length} items
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="flex items-center space-x-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((page) => {
                  return page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1);
                })
                .map((page, index, array) => (
                  <div key={page} className="flex items-center">
                    {index > 0 && array[index - 1] !== page - 1 && <span className="px-2 text-gray-400">...</span>}
                    <button
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1 rounded-lg ${
                        currentPage === page ? 'bg-blue-600 text-white' : 'border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  </div>
                ))}
            </div>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

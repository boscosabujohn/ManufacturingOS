'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Search, Filter, QrCode, Download, Plus, Edit2, Eye, AlertCircle } from 'lucide-react';

interface SerialProduct {
  serialNumber: string;
  productId: string;
  productName: string;
  category: string;
  batchNumber: string;
  manufacturingDate: string;
  warrantyExpiry: string;
  warrantyStatus: 'Active' | 'Expired' | 'Expiring Soon';
  location: string;
  status: 'In Stock' | 'Deployed' | 'In Repair' | 'Retired';
  customerName?: string;
  lastServiceDate?: string;
}

export default function SerialTrackingPage() {
  const router = useRouter();
  const [products, setProducts] = useState<SerialProduct[]>([
    {
      serialNumber: 'SN-MK-2024-001',
      productId: 'KIT-OVEN-5000',
      productName: 'Commercial Kitchen Oven 5000W',
      category: 'Kitchen Equipment',
      batchNumber: 'BATCH-2024-JAN-001',
      manufacturingDate: '2024-01-05',
      warrantyExpiry: '2026-01-05',
      warrantyStatus: 'Active',
      location: 'Warehouse A - Section 2',
      status: 'Deployed',
      customerName: 'ABC Restaurant Pvt Ltd',
      lastServiceDate: '2024-01-20'
    },
    {
      serialNumber: 'SN-MK-2024-002',
      productId: 'KIT-OVEN-5000',
      productName: 'Commercial Kitchen Oven 5000W',
      category: 'Kitchen Equipment',
      batchNumber: 'BATCH-2024-JAN-001',
      manufacturingDate: '2024-01-05',
      warrantyExpiry: '2025-01-05',
      warrantyStatus: 'Expiring Soon',
      location: 'Warehouse A - Section 2',
      status: 'In Stock',
      lastServiceDate: '2023-12-15'
    },
    {
      serialNumber: 'SN-MK-2024-003',
      productId: 'KIT-GRILL-3000',
      productName: 'Industrial Grill System 3000W',
      category: 'Kitchen Equipment',
      batchNumber: 'BATCH-2024-JAN-002',
      manufacturingDate: '2024-01-08',
      warrantyExpiry: '2024-12-08',
      warrantyStatus: 'Expired',
      location: 'Warehouse B - Section 1',
      status: 'In Repair',
      customerName: 'XYZ Catering Services',
      lastServiceDate: '2024-01-10'
    },
    {
      serialNumber: 'SN-MK-2024-004',
      productId: 'KIT-FRYER-2000',
      productName: 'Deep Fryer Unit 2000W',
      category: 'Kitchen Equipment',
      batchNumber: 'BATCH-2024-JAN-003',
      manufacturingDate: '2024-01-12',
      warrantyExpiry: '2026-01-12',
      warrantyStatus: 'Active',
      location: 'Warehouse A - Section 3',
      status: 'Deployed',
      customerName: 'Fast Food Chain India',
      lastServiceDate: '2024-01-18'
    },
    {
      serialNumber: 'SN-MK-2024-005',
      productId: 'KIT-MIXER-1500',
      productName: 'Industrial Mixer 1500W',
      category: 'Mixing Equipment',
      batchNumber: 'BATCH-2024-JAN-004',
      manufacturingDate: '2024-01-15',
      warrantyExpiry: '2026-01-15',
      warrantyStatus: 'Active',
      location: 'Warehouse C - Section 1',
      status: 'In Stock',
      lastServiceDate: '2024-01-15'
    },
    {
      serialNumber: 'SN-MK-2024-006',
      productId: 'KIT-WARMER-800',
      productName: 'Food Warmer Cabinet 800W',
      category: 'Food Service',
      batchNumber: 'BATCH-2024-FEB-001',
      manufacturingDate: '2024-02-01',
      warrantyExpiry: '2027-02-01',
      warrantyStatus: 'Active',
      location: 'Warehouse A - Section 1',
      status: 'Deployed',
      customerName: 'Hotel Grand India',
      lastServiceDate: '2024-01-25'
    },
    {
      serialNumber: 'SN-MK-2024-007',
      productId: 'KIT-COOLER-1200',
      productName: 'Display Cooler 1200L',
      category: 'Cooling Equipment',
      batchNumber: 'BATCH-2024-FEB-002',
      manufacturingDate: '2024-02-03',
      warrantyExpiry: '2025-02-03',
      warrantyStatus: 'Expiring Soon',
      location: 'Warehouse B - Section 2',
      status: 'Deployed',
      customerName: 'Fresh Mart Supermarket',
      lastServiceDate: '2024-01-22'
    },
    {
      serialNumber: 'SN-MK-2024-008',
      productId: 'KIT-SLICER-500',
      productName: 'Automatic Slicer 500W',
      category: 'Cutting Equipment',
      batchNumber: 'BATCH-2024-FEB-003',
      manufacturingDate: '2024-02-05',
      warrantyExpiry: '2026-02-05',
      warrantyStatus: 'Active',
      location: 'Warehouse C - Section 2',
      status: 'In Stock',
      lastServiceDate: '2024-02-05'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [warrantyFilter, setWarrantyFilter] = useState('');

  const filteredProducts = products.filter(product =>
    (product.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.productName.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (statusFilter === '' || product.status === statusFilter) &&
    (warrantyFilter === '' || product.warrantyStatus === warrantyFilter)
  );

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'In Stock': 'bg-blue-100 text-blue-800',
      'Deployed': 'bg-green-100 text-green-800',
      'In Repair': 'bg-yellow-100 text-yellow-800',
      'Retired': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-slate-100 text-slate-800';
  };

  const getWarrantyColor = (warranty: string) => {
    const colors: Record<string, string> = {
      'Active': 'bg-green-100 text-green-800',
      'Expiring Soon': 'bg-orange-100 text-orange-800',
      'Expired': 'bg-red-100 text-red-800'
    };
    return colors[warranty] || 'bg-slate-100 text-slate-800';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-3">
      <div className="w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-slate-200 rounded-lg text-slate-600"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Serial Number Tracking</h1>
              <p className="text-slate-600 mt-1">Track products by serial number and warranty status</p>
            </div>
          </div>
          <button className="flex items-center gap-2 px-3 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium">
            <QrCode className="w-5 h-5" />
            Scan QR
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-3">
          <div className="bg-white rounded-lg border border-slate-200 p-3">
            <p className="text-sm text-slate-600 mb-1">Total Products</p>
            <p className="text-2xl font-bold text-slate-900">{products.length}</p>
          </div>
          <div className="bg-white rounded-lg border border-slate-200 p-3">
            <p className="text-sm text-slate-600 mb-1">Active Warranty</p>
            <p className="text-2xl font-bold text-green-600">{products.filter(p => p.warrantyStatus === 'Active').length}</p>
          </div>
          <div className="bg-white rounded-lg border border-slate-200 p-3">
            <p className="text-sm text-slate-600 mb-1">Expiring Soon</p>
            <p className="text-2xl font-bold text-orange-600">{products.filter(p => p.warrantyStatus === 'Expiring Soon').length}</p>
          </div>
          <div className="bg-white rounded-lg border border-slate-200 p-3">
            <p className="text-sm text-slate-600 mb-1">Deployed</p>
            <p className="text-2xl font-bold text-blue-600">{products.filter(p => p.status === 'Deployed').length}</p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg border border-slate-200 p-3 mb-3">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
            {/* Search */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">Search by Serial / Product</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="SN-MK-2024-001 or product name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              >
                <option value="">All Status</option>
                <option value="In Stock">In Stock</option>
                <option value="Deployed">Deployed</option>
                <option value="In Repair">In Repair</option>
                <option value="Retired">Retired</option>
              </select>
            </div>

            {/* Warranty Filter */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Warranty</label>
              <select
                value={warrantyFilter}
                onChange={(e) => setWarrantyFilter(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              >
                <option value="">All Warranty</option>
                <option value="Active">Active</option>
                <option value="Expiring Soon">Expiring Soon</option>
                <option value="Expired">Expired</option>
              </select>
            </div>
          </div>
        </div>

        {/* Warning Banner */}
        <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg flex gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-red-900">1 product has expired warranty</p>
            <p className="text-sm text-red-800">Consider renewing warranty or scheduling maintenance</p>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-3 py-2 text-left font-semibold text-slate-700">Serial Number</th>
                  <th className="px-3 py-2 text-left font-semibold text-slate-700">Product</th>
                  <th className="px-3 py-2 text-left font-semibold text-slate-700">Batch</th>
                  <th className="px-3 py-2 text-left font-semibold text-slate-700">Status</th>
                  <th className="px-3 py-2 text-left font-semibold text-slate-700">Warranty</th>
                  <th className="px-3 py-2 text-left font-semibold text-slate-700">Expiry Date</th>
                  <th className="px-3 py-2 text-left font-semibold text-slate-700">Location</th>
                  <th className="px-3 py-2 text-left font-semibold text-slate-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product, index) => (
                  <tr key={index} className="border-b border-slate-200 hover:bg-slate-50">
                    <td className="px-3 py-2 font-mono font-medium text-emerald-600">{product.serialNumber}</td>
                    <td className="px-3 py-2">
                      <div>
                        <p className="font-medium text-slate-900">{product.productName}</p>
                        <p className="text-xs text-slate-600">{product.productId}</p>
                      </div>
                    </td>
                    <td className="px-3 py-2 text-slate-600">{product.batchNumber}</td>
                    <td className="px-3 py-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(product.status)}`}>
                        {product.status}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getWarrantyColor(product.warrantyStatus)}`}>
                        {product.warrantyStatus}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-slate-600">
                      {new Date(product.warrantyExpiry).toLocaleDateString()}
                    </td>
                    <td className="px-3 py-2 text-slate-600 text-sm">{product.location}</td>
                    <td className="px-3 py-2">
                      <div className="flex gap-2">
                        <button className="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                          <Eye className="w-4 h-4 text-gray-600" />
                          <span className="text-gray-700">View</span>
                        </button>
                        <button className="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                          <Edit2 className="w-4 h-4 text-gray-600" />
                          <span className="text-gray-700">Edit</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* No Results */}
          {filteredProducts.length === 0 && (
            <div className="p-8 text-center text-slate-600">
              <QrCode className="w-12 h-12 mb-3 text-slate-400" />
              <p className="font-medium">No products found</p>
              <p className="text-sm">Try adjusting your search or filters</p>
            </div>
          )}
        </div>

        {/* Export Button */}
        <div className="mt-6 flex justify-end">
          <button className="flex items-center gap-2 px-3 py-2 bg-slate-200 text-slate-900 rounded-lg hover:bg-slate-300 font-medium">
            <Download className="w-5 h-5" />
            Export Data
          </button>
        </div>
      </div>
    </div>
  );
}

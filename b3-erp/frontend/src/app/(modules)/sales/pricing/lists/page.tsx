'use client';

import React, { useState } from 'react';
import {
  ArrowLeft,
  Search,
  IndianRupee,
  TrendingUp,
  TrendingDown,
  Edit,
  Eye,
  Package,
  Calendar,
  Tag,
  Plus
} from 'lucide-react';

interface PriceListItem {
  id: string;
  productCode: string;
  productName: string;
  category: string;
  basePrice: number;
  currentPrice: number;
  unit: string;
  effectiveFrom: string;
  lastUpdated: string;
  priceChange: number;
  priceChangePercent: number;
  moq: number; // Minimum Order Quantity
  stock: number;
}

export default function PriceListsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const priceList: PriceListItem[] = [
    {
      id: '1',
      productCode: 'KIT-SS-001',
      productName: 'Stainless Steel Kitchen Sink (Single Bowl)',
      category: 'Kitchen Sinks',
      basePrice: 12500,
      currentPrice: 11250,
      unit: 'piece',
      effectiveFrom: '2025-10-01',
      lastUpdated: '2025-10-15',
      priceChange: -1250,
      priceChangePercent: -10,
      moq: 10,
      stock: 450
    },
    {
      id: '2',
      productCode: 'KIT-SS-002',
      productName: 'Stainless Steel Kitchen Sink (Double Bowl)',
      category: 'Kitchen Sinks',
      basePrice: 18500,
      currentPrice: 17575,
      unit: 'piece',
      effectiveFrom: '2025-10-01',
      lastUpdated: '2025-10-15',
      priceChange: -925,
      priceChangePercent: -5,
      moq: 5,
      stock: 280
    },
    {
      id: '3',
      productCode: 'KIT-TAP-001',
      productName: 'Chrome Plated Kitchen Faucet',
      category: 'Kitchen Faucets',
      basePrice: 4500,
      currentPrice: 4500,
      unit: 'piece',
      effectiveFrom: '2025-09-15',
      lastUpdated: '2025-09-15',
      priceChange: 0,
      priceChangePercent: 0,
      moq: 20,
      stock: 850
    },
    {
      id: '4',
      productCode: 'KIT-TAP-002',
      productName: 'Brass Kitchen Mixer Tap with Pull-Out Spray',
      category: 'Kitchen Faucets',
      basePrice: 8900,
      currentPrice: 9345,
      unit: 'piece',
      effectiveFrom: '2025-10-10',
      lastUpdated: '2025-10-10',
      priceChange: 445,
      priceChangePercent: 5,
      moq: 15,
      stock: 320
    },
    {
      id: '5',
      productCode: 'KIT-COOK-001',
      productName: 'Granite Coated Non-Stick Cookware Set (7 Pieces)',
      category: 'Cookware',
      basePrice: 15000,
      currentPrice: 13500,
      unit: 'set',
      effectiveFrom: '2025-10-05',
      lastUpdated: '2025-10-05',
      priceChange: -1500,
      priceChangePercent: -10,
      moq: 8,
      stock: 180
    },
    {
      id: '6',
      productCode: 'KIT-COOK-002',
      productName: 'Stainless Steel Pressure Cooker (5 Liters)',
      category: 'Cookware',
      basePrice: 3500,
      currentPrice: 3500,
      unit: 'piece',
      effectiveFrom: '2025-09-20',
      lastUpdated: '2025-09-20',
      priceChange: 0,
      priceChangePercent: 0,
      moq: 25,
      stock: 620
    },
    {
      id: '7',
      productCode: 'KIT-APPL-001',
      productName: 'Commercial Mixer Grinder (750W)',
      category: 'Kitchen Appliances',
      basePrice: 8500,
      currentPrice: 9350,
      unit: 'piece',
      effectiveFrom: '2025-10-12',
      lastUpdated: '2025-10-12',
      priceChange: 850,
      priceChangePercent: 10,
      moq: 12,
      stock: 245
    },
    {
      id: '8',
      productCode: 'KIT-APPL-002',
      productName: 'Electric Induction Cooktop (2000W)',
      category: 'Kitchen Appliances',
      basePrice: 12000,
      currentPrice: 11400,
      unit: 'piece',
      effectiveFrom: '2025-10-08',
      lastUpdated: '2025-10-08',
      priceChange: -600,
      priceChangePercent: -5,
      moq: 10,
      stock: 390
    },
    {
      id: '9',
      productCode: 'KIT-STOR-001',
      productName: 'Modular Kitchen Cabinet (Base Unit)',
      category: 'Kitchen Storage',
      basePrice: 25000,
      currentPrice: 23750,
      unit: 'unit',
      effectiveFrom: '2025-10-01',
      lastUpdated: '2025-10-15',
      priceChange: -1250,
      priceChangePercent: -5,
      moq: 5,
      stock: 120
    },
    {
      id: '10',
      productCode: 'KIT-STOR-002',
      productName: 'Modular Kitchen Cabinet (Wall Unit)',
      category: 'Kitchen Storage',
      basePrice: 18000,
      currentPrice: 17100,
      unit: 'unit',
      effectiveFrom: '2025-10-01',
      lastUpdated: '2025-10-15',
      priceChange: -900,
      priceChangePercent: -5,
      moq: 5,
      stock: 150
    },
    {
      id: '11',
      productCode: 'KIT-HOOD-001',
      productName: 'Chimney Hood (Auto-Clean, 1200 m³/hr)',
      category: 'Kitchen Ventilation',
      basePrice: 22000,
      currentPrice: 20900,
      unit: 'piece',
      effectiveFrom: '2025-10-05',
      lastUpdated: '2025-10-05',
      priceChange: -1100,
      priceChangePercent: -5,
      moq: 6,
      stock: 95
    },
    {
      id: '12',
      productCode: 'KIT-COUNT-001',
      productName: 'Granite Kitchen Countertop (Per Square Foot)',
      category: 'Countertops',
      basePrice: 450,
      currentPrice: 472,
      unit: 'sq.ft',
      effectiveFrom: '2025-10-10',
      lastUpdated: '2025-10-10',
      priceChange: 22,
      priceChangePercent: 5,
      moq: 100,
      stock: 5000
    },
    {
      id: '13',
      productCode: 'KIT-COUNT-002',
      productName: 'Quartz Kitchen Countertop (Per Square Foot)',
      category: 'Countertops',
      basePrice: 650,
      currentPrice: 682,
      unit: 'sq.ft',
      effectiveFrom: '2025-10-10',
      lastUpdated: '2025-10-10',
      priceChange: 32,
      priceChangePercent: 5,
      moq: 100,
      stock: 3500
    },
    {
      id: '14',
      productCode: 'KIT-ACC-001',
      productName: 'Kitchen Basket Organizer (Pull-Out)',
      category: 'Kitchen Accessories',
      basePrice: 3200,
      currentPrice: 3200,
      unit: 'piece',
      effectiveFrom: '2025-09-25',
      lastUpdated: '2025-09-25',
      priceChange: 0,
      priceChangePercent: 0,
      moq: 20,
      stock: 480
    },
    {
      id: '15',
      productCode: 'KIT-ACC-002',
      productName: 'Dish Drainer Rack (Stainless Steel)',
      category: 'Kitchen Accessories',
      basePrice: 1800,
      currentPrice: 1710,
      unit: 'piece',
      effectiveFrom: '2025-10-08',
      lastUpdated: '2025-10-08',
      priceChange: -90,
      priceChangePercent: -5,
      moq: 30,
      stock: 720
    }
  ];

  const filteredProducts = priceList.filter(product => {
    const matchesSearch =
      product.productCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.productName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(new Set(priceList.map(p => p.category)));
  const totalProducts = priceList.length;
  const priceIncreases = priceList.filter(p => p.priceChange > 0).length;
  const priceDecreases = priceList.filter(p => p.priceChange < 0).length;
  const avgPrice = priceList.reduce((sum, p) => sum + p.currentPrice, 0) / priceList.length;

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 px-3 py-2">
      <div className="space-y-3">
        {/* Inline Header */}
        <div className="flex items-center gap-3 ml-auto justify-end">
          <button className="px-4 py-2 text-gray-700 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg transition-colors">
            Export Price List
          </button>
          <button className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-colors flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Update Prices
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-3 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-indigo-100 text-sm font-medium">Total Products</p>
                <p className="text-3xl font-bold mt-2">{totalProducts}</p>
                <p className="text-indigo-100 text-xs mt-1">In price list</p>
              </div>
              <div className="bg-white/20 p-3 rounded-lg">
                <Package className="w-8 h-8" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl p-3 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Average Price</p>
                <p className="text-3xl font-bold mt-2">₹{(avgPrice / 1000).toFixed(1)}K</p>
                <p className="text-blue-100 text-xs mt-1">Across all products</p>
              </div>
              <div className="bg-white/20 p-3 rounded-lg">
                <IndianRupee className="w-8 h-8" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-3 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Price Increases</p>
                <p className="text-3xl font-bold mt-2">{priceIncreases}</p>
                <p className="text-green-100 text-xs mt-1">Products</p>
              </div>
              <div className="bg-white/20 p-3 rounded-lg">
                <TrendingUp className="w-8 h-8" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-500 to-pink-600 rounded-xl p-3 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-sm font-medium">Price Decreases</p>
                <p className="text-3xl font-bold mt-2">{priceDecreases}</p>
                <p className="text-red-100 text-xs mt-1">Products</p>
              </div>
              <div className="bg-white/20 p-3 rounded-lg">
                <TrendingDown className="w-8 h-8" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by product code or name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Price List Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                <tr>
                  <th className="px-3 py-2 text-left text-sm font-semibold">Product Code</th>
                  <th className="px-3 py-2 text-left text-sm font-semibold">Product Name</th>
                  <th className="px-3 py-2 text-left text-sm font-semibold">Category</th>
                  <th className="px-3 py-2 text-right text-sm font-semibold">Base Price</th>
                  <th className="px-3 py-2 text-right text-sm font-semibold">Current Price</th>
                  <th className="px-3 py-2 text-center text-sm font-semibold">Change</th>
                  <th className="px-3 py-2 text-center text-sm font-semibold">MOQ</th>
                  <th className="px-3 py-2 text-center text-sm font-semibold">Stock</th>
                  <th className="px-3 py-2 text-center text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredProducts.map((product, index) => (
                  <tr key={product.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-3 py-2">
                      <span className="font-mono text-sm font-medium text-gray-900">{product.productCode}</span>
                    </td>
                    <td className="px-3 py-2">
                      <div>
                        <p className="font-medium text-gray-900">{product.productName}</p>
                        <p className="text-xs text-gray-500">Unit: {product.unit}</p>
                      </div>
                    </td>
                    <td className="px-3 py-2">
                      <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-xs font-medium">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-right">
                      <span className="text-gray-600">₹{product.basePrice.toLocaleString('en-IN')}</span>
                    </td>
                    <td className="px-3 py-2 text-right">
                      <span className="font-semibold text-gray-900">₹{product.currentPrice.toLocaleString('en-IN')}</span>
                    </td>
                    <td className="px-3 py-2 text-center">
                      {product.priceChange !== 0 ? (
                        <div className="flex items-center justify-center gap-1">
                          {product.priceChange > 0 ? (
                            <>
                              <TrendingUp className="w-4 h-4 text-green-500" />
                              <span className="text-green-600 font-medium text-sm">
                                +{product.priceChangePercent}%
                              </span>
                            </>
                          ) : (
                            <>
                              <TrendingDown className="w-4 h-4 text-red-500" />
                              <span className="text-red-600 font-medium text-sm">
                                {product.priceChangePercent}%
                              </span>
                            </>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm">—</span>
                      )}
                    </td>
                    <td className="px-3 py-2 text-center">
                      <span className="text-gray-700">{product.moq}</span>
                    </td>
                    <td className="px-3 py-2 text-center">
                      <span className={`font-medium ${product.stock < 100 ? 'text-red-600' : 'text-gray-700'}`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex items-center justify-center gap-2">
                        <button className="inline-flex items-center gap-1.5 px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors text-sm">
                          <Eye className="w-4 h-4 text-gray-600" />
                          <span className="text-gray-700">View</span>
                        </button>
                        <button className="inline-flex items-center gap-1.5 px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors text-sm">
                          <Edit className="w-4 h-4 text-indigo-600" />
                          <span className="text-indigo-700">Edit</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredProducts.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <Package className="w-16 h-16 text-gray-400 mb-2" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Products Found</h3>
            <p className="text-gray-600">No products match your search criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}

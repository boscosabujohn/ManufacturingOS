'use client';

import React, { useState } from 'react';
import {
  Building2,
  Plus,
  Search,
  Filter,
  Star,
  Phone,
  Mail,
  MapPin,
  MoreVertical,
  FileText,
  DollarSign
} from 'lucide-react';

interface Vendor {
  id: string;
  code: string;
  name: string;
  category: string;
  contactPerson: string;
  email: string;
  phone: string;
  rating: number;
  status: 'Active' | 'Inactive' | 'Blacklisted';
  balance: number;
}

export default function VendorManagementPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Mock Data
  const vendors: Vendor[] = [
    {
      id: '1',
      code: 'VEN-001',
      name: 'Global Steel Supplies Ltd',
      category: 'Raw Materials',
      contactPerson: 'John Smith',
      email: 'sales@globalsteel.com',
      phone: '+1 (555) 123-4567',
      rating: 4.8,
      status: 'Active',
      balance: 15000
    },
    {
      id: '2',
      code: 'VEN-002',
      name: 'TechComponents Inc',
      category: 'Electronics',
      contactPerson: 'Sarah Connor',
      email: 's.connor@techcomp.com',
      phone: '+1 (555) 987-6543',
      rating: 4.5,
      status: 'Active',
      balance: 5000
    },
    {
      id: '3',
      code: 'VEN-003',
      name: 'Office Depot',
      category: 'Office Supplies',
      contactPerson: 'Mike Ross',
      email: 'orders@officedepot.com',
      phone: '+1 (555) 456-7890',
      rating: 4.0,
      status: 'Active',
      balance: 0
    },
    {
      id: '4',
      code: 'VEN-004',
      name: 'Fast Logistics Co',
      category: 'Logistics',
      contactPerson: 'David Kim',
      email: 'dispatch@fastlogistics.com',
      phone: '+1 (555) 789-0123',
      rating: 3.5,
      status: 'Inactive',
      balance: 0
    }
  ];

  const filteredVendors = vendors.filter(vendor => {
    const matchesSearch = vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || vendor.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-500/20 text-green-400';
      case 'Inactive': return 'bg-gray-500/20 text-gray-400';
      case 'Blacklisted': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      <div className="w-full space-y-6">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <Building2 className="w-8 h-8 text-orange-500" />
              Vendor Management
            </h1>
            <p className="text-gray-400 mt-1">Manage suppliers, track performance, and handle procurements.</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors shadow-lg shadow-orange-900/20">
            <Plus className="w-4 h-4" />
            Add Vendor
          </button>
        </div>

        {/* Filters */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700 flex flex-wrap gap-4 items-center">
          <div className="flex-1 min-w-[300px] relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search vendor name or code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="all">All Categories</option>
              <option value="Raw Materials">Raw Materials</option>
              <option value="Electronics">Electronics</option>
              <option value="Office Supplies">Office Supplies</option>
              <option value="Logistics">Logistics</option>
            </select>
          </div>
        </div>

        {/* Vendors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVendors.map((vendor) => (
            <div key={vendor.id} className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden hover:border-orange-500/50 transition-all duration-300 group">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-gray-700 flex items-center justify-center text-white font-bold text-lg">
                      <Building2 className="w-6 h-6 text-orange-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white group-hover:text-orange-400 transition-colors">{vendor.name}</h3>
                      <p className="text-sm text-gray-400">{vendor.code}</p>
                    </div>
                  </div>
                  <button className="text-gray-400 hover:text-white">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 text-sm text-gray-300">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    {vendor.rating} / 5.0 Rating
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-300">
                    <Mail className="w-4 h-4 text-gray-500" />
                    {vendor.email}
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-300">
                    <Phone className="w-4 h-4 text-gray-500" />
                    {vendor.phone}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(vendor.status)}`}>
                    {vendor.status}
                  </span>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Outstanding</p>
                    <p className="text-sm font-bold text-white">${vendor.balance.toLocaleString()}</p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-900/50 px-6 py-3 border-t border-gray-700 flex justify-between items-center">
                <button className="text-sm text-gray-400 hover:text-white flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Orders
                </button>
                <button className="text-sm text-gray-400 hover:text-white flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Pay
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

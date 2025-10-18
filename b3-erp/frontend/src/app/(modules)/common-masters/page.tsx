'use client';

import React from 'react';
import { Database, Building2, Package, Users, DollarSign, Globe, UserCog, Factory } from 'lucide-react';

export default function CommonMastersPage() {
  const masterCategories = [
    {
      title: 'Organization & Company',
      icon: Building2,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      count: 8,
      description: 'Company, branches, departments, cost centers'
    },
    {
      title: 'Product & Items',
      icon: Package,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      count: 8,
      description: 'Items, categories, brands, UOM, barcodes'
    },
    {
      title: 'Customer & Vendor',
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      count: 4,
      description: 'Customers, vendors, categories'
    },
    {
      title: 'Financial',
      icon: DollarSign,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      count: 5,
      description: 'Accounts, banks, taxes, payment terms'
    },
    {
      title: 'Geographic',
      icon: Globe,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      count: 4,
      description: 'Countries, states, cities, territories'
    },
    {
      title: 'Human Resources',
      icon: UserCog,
      color: 'text-pink-600',
      bgColor: 'bg-pink-50',
      count: 4,
      description: 'Employees, designations, shifts'
    },
    {
      title: 'Manufacturing',
      icon: Factory,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      count: 4,
      description: 'Machines, work centers, operations'
    },
    {
      title: 'Kitchen Specific',
      icon: Package,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      count: 4,
      description: 'Cabinets, hardware, finishes, materials'
    }
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Database className="w-8 h-8 text-slate-600" />
          <h1 className="text-3xl font-bold text-gray-900">Common Master Files</h1>
        </div>
        <p className="text-gray-600 text-lg">
          Centralized management of all master data used across the ERP system
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {masterCategories.map((category, index) => {
          const Icon = category.icon;
          return (
            <div key={index} className={`${category.bgColor} rounded-lg p-6 border`}>
              <div className="flex items-center gap-3 mb-4">
                <Icon className={`w-8 h-8 ${category.color}`} />
                <div>
                  <h3 className="font-semibold text-gray-900">{category.title}</h3>
                  <p className="text-sm text-gray-600">{category.count} masters</p>
                </div>
              </div>
              <p className="text-sm text-gray-600">{category.description}</p>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Master Data Management</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Database className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="font-medium mb-2">Centralized Data</h3>
            <p className="text-sm text-gray-600">All master data in one unified system</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Users className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="font-medium mb-2">Role-Based Access</h3>
            <p className="text-sm text-gray-600">Controlled access to master data</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Factory className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="font-medium mb-2">Integration Ready</h3>
            <p className="text-sm text-gray-600">Seamless integration with all modules</p>
          </div>
        </div>
      </div>
    </div>
  );
}
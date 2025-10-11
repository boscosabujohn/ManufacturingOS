'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Users,
  ShoppingCart,
  Package,
  Factory,
  DollarSign,
  UserCog,
  ShoppingBag,
  Calculator,
  Workflow,
  BarChart3,
  Truck,
  Headphones,
  Settings,
  Search,
  Bell,
  User,
  Menu,
} from 'lucide-react';

// Module definitions
const modules = [
  {
    id: 'crm',
    name: 'CRM',
    description: 'Customer Relationship Management',
    icon: Users,
    href: '/crm',
    color: 'bg-blue-500',
    stats: { total: 1234, new: 45 },
  },
  {
    id: 'sales',
    name: 'Sales',
    description: 'Sales Order Management',
    icon: ShoppingCart,
    href: '/sales',
    color: 'bg-green-500',
    stats: { total: 856, new: 23 },
  },
  {
    id: 'estimation',
    name: 'Estimation',
    description: 'Cost Estimation & Quotations',
    icon: Calculator,
    href: '/estimation',
    color: 'bg-purple-500',
    stats: { total: 432, new: 12 },
  },
  {
    id: 'inventory',
    name: 'Inventory',
    description: 'Warehouse & Stock Management',
    icon: Package,
    href: '/inventory',
    color: 'bg-orange-500',
    stats: { total: 3421, new: 87 },
  },
  {
    id: 'production',
    name: 'Production',
    description: 'Production Planning & Control',
    icon: Factory,
    href: '/production',
    color: 'bg-red-500',
    stats: { total: 234, new: 15 },
  },
  {
    id: 'procurement',
    name: 'Procurement',
    description: 'Purchase Order Management',
    icon: ShoppingBag,
    href: '/procurement',
    color: 'bg-indigo-500',
    stats: { total: 567, new: 28 },
  },
  {
    id: 'finance',
    name: 'Finance',
    description: 'Financial Accounting',
    icon: DollarSign,
    href: '/finance',
    color: 'bg-yellow-500',
    stats: { total: 2341, new: 156 },
  },
  {
    id: 'hr',
    name: 'HR',
    description: 'Human Resource Management',
    icon: UserCog,
    href: '/hr',
    color: 'bg-pink-500',
    stats: { total: 145, new: 3 },
  },
  {
    id: 'workflow',
    name: 'Workflow',
    description: 'Workflow Automation',
    icon: Workflow,
    href: '/workflow',
    color: 'bg-cyan-500',
    stats: { total: 89, new: 7 },
  },
  {
    id: 'reports',
    name: 'Reports',
    description: 'Report Generation & Analytics',
    icon: BarChart3,
    href: '/reports',
    color: 'bg-teal-500',
    stats: { total: 432, new: 21 },
  },
  {
    id: 'logistics',
    name: 'Logistics',
    description: 'Logistics & Transportation',
    icon: Truck,
    href: '/logistics',
    color: 'bg-lime-500',
    stats: { total: 312, new: 18 },
  },
  {
    id: 'support',
    name: 'Support',
    description: 'Customer Support & Incidents',
    icon: Headphones,
    href: '/support',
    color: 'bg-rose-500',
    stats: { total: 156, new: 9 },
  },
  {
    id: 'it-admin',
    name: 'IT Admin',
    description: 'System Administration',
    icon: Settings,
    href: '/it-admin',
    color: 'bg-gray-500',
    stats: { total: 45, new: 2 },
  },
];

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredModules = modules.filter((module) => {
    const matchesSearch = module.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         module.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const categories = [
    { id: 'all', name: 'All Modules' },
    { id: 'operations', name: 'Operations' },
    { id: 'finance', name: 'Finance & Accounting' },
    { id: 'admin', name: 'Administration' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Title */}
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-gray-900">B3 MACBIS</h1>
                <p className="text-xs text-gray-500">Manufacturing ERP</p>
              </div>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-2xl mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search modules..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* User Actions */}
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-400 hover:text-gray-500">
                <Bell className="h-6 w-6" />
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
              </button>
              <button className="flex items-center space-x-2 p-2 text-gray-700 hover:text-gray-900">
                <User className="h-6 w-6" />
                <span className="hidden md:block">Admin</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to B3 MACBIS ERP
          </h2>
          <p className="text-gray-600">
            Select a module below to get started. Manage your entire manufacturing operations from one place.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">1,234</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <ShoppingCart className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <p className="text-xs text-green-600 mt-2">↑ 12% from last month</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Revenue</p>
                <p className="text-2xl font-bold text-gray-900">₹45.2L</p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <p className="text-xs text-green-600 mt-2">↑ 8% from last month</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Production</p>
                <p className="text-2xl font-bold text-gray-900">234</p>
              </div>
              <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Factory className="h-6 w-6 text-orange-600" />
              </div>
            </div>
            <p className="text-xs text-green-600 mt-2">↑ 15% from last month</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Inventory Items</p>
                <p className="text-2xl font-bold text-gray-900">3,421</p>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Package className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <p className="text-xs text-red-600 mt-2">↓ 3% from last month</p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`${
                    selectedCategory === category.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  {category.name}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Module Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredModules.map((module) => {
            const Icon = module.icon;
            return (
              <Link
                key={module.id}
                href={module.href}
                className="group bg-white rounded-lg shadow hover:shadow-xl transition-all duration-200 overflow-hidden border border-gray-200 hover:border-blue-300"
              >
                <div className="p-6">
                  {/* Icon */}
                  <div className={`${module.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>

                  {/* Module Name */}
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600">
                    {module.name}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-gray-600 mb-4">
                    {module.description}
                  </p>

                  {/* Stats */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center space-x-4">
                      <div>
                        <p className="text-xs text-gray-500">Total</p>
                        <p className="text-sm font-semibold text-gray-900">{module.stats.total}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">New</p>
                        <p className="text-sm font-semibold text-blue-600">+{module.stats.new}</p>
                      </div>
                    </div>
                    <div className="text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Hover Effect Bar */}
                <div className={`h-1 ${module.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200`}></div>
              </Link>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredModules.length === 0 && (
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No modules found</h3>
            <p className="text-gray-600">Try adjusting your search query</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-semibold text-gray-700">
                B3 MACBIS - Kitchen Manufacturing ERP
              </p>
              <p className="text-xs text-gray-500">
                Powered by KreupAI Technologies LLC
              </p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-sm text-gray-500 hover:text-gray-900">Help</a>
              <a href="#" className="text-sm text-gray-500 hover:text-gray-900">Documentation</a>
              <a href="#" className="text-sm text-gray-500 hover:text-gray-900">Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

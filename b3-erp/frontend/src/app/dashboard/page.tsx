'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
  ChevronDown,
  Wrench,
  FolderKanban,
} from 'lucide-react';
import MegaMenu from '@/components/MegaMenu';
import Sidebar from '@/components/Sidebar';

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
    id: 'project-management',
    name: 'Project Management',
    description: 'Manufacturing Project Execution',
    icon: FolderKanban,
    href: '/project-management/dashboard',
    color: 'bg-cyan-500',
    stats: { total: 10, new: 2 },
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
    id: 'after-sales-service',
    name: 'After Sales Service',
    description: 'Service Contracts & Field Support',
    icon: Wrench,
    href: '/after-sales-service/dashboard',
    color: 'bg-emerald-500',
    stats: { total: 287, new: 24 },
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
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);

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

  const megaMenuItems = [
    { id: 'sales', name: 'Sales & Marketing' },
    { id: 'operations', name: 'Operations' },
    { id: 'projects', name: 'Projects' },
    { id: 'admin', name: 'Admin & Support' },
  ];

  return (
    <div className="h-screen flex flex-col bg-white overflow-hidden">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${sidebarOpen ? 'lg:ml-72' : 'lg:ml-20'}`}>
        {/* Header */}
        <header className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40 shadow-sm flex-shrink-0">
          <div className="w-full px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Logo and Mobile Menu Toggle */}
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  <Menu className="h-6 w-6" />
                </button>
                <div className="flex items-center space-x-3">
                  <div className="relative w-10 h-10 flex-shrink-0">
                    <Image
                      src="/optiforge-logo.png"
                      alt="OptiForge Logo"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div className="flex flex-col">
                    <h1 className="text-2xl font-black text-brand-blue tracking-tighter uppercase italic leading-none">OptiForge</h1>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Manufacturing ERP</p>
                  </div>
                </div>
              </div>

              {/* Mega Menu Navigation */}
              <nav className="hidden md:flex items-center space-x-1">
                {megaMenuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveMegaMenu(activeMegaMenu === item.id ? null : item.id)}
                    className={`flex items-center space-x-1 px-4 py-2 rounded-lg transition-colors ${activeMegaMenu === item.id
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-100'
                      }`}
                  >
                    <span className="font-medium text-sm">{item.name}</span>
                    <ChevronDown className={`h-4 w-4 transition-transform ${activeMegaMenu === item.id ? 'rotate-180' : ''}`} />
                  </button>
                ))}
              </nav>

              {/* User Actions */}
              <div className="flex items-center space-x-3">
                <button className="relative p-2 text-gray-400 hover:text-blue-600 transition-colors rounded-lg hover:bg-blue-50">
                  <Bell className="h-6 w-6" />
                  <span className="absolute top-1 right-1 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white animate-pulse"></span>
                </button>
                <button className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                  <div className="h-8 w-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <span className="hidden md:block font-medium">Admin</span>
                </button>
              </div>
            </div>
          </div>

          {/* Mega Menu */}
          {activeMegaMenu && (
            <MegaMenu activeMenu={activeMegaMenu} onClose={() => setActiveMegaMenu(null)} />
          )}
        </header>

        {/* Search Bar Section */}
        <div className="bg-white border-b border-gray-200 py-4 flex-shrink-0">
          <div className="w-full px-4 sm:px-6 lg:px-8">
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search modules, features, or functions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>
        </div>

        {/* Main Content - Scrollable */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          <div className="w-full px-4 sm:px-6 lg:px-8 py-6 max-w-[1920px] mx-auto">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600 mb-1">Total Orders</p>
                    <p className="text-2xl font-bold text-blue-700">1,234</p>
                    <span className="text-xs font-semibold text-green-600">↑ 12%</span>
                  </div>
                  <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <ShoppingCart className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600 mb-1">Revenue</p>
                    <p className="text-2xl font-bold text-green-700">₹45.2L</p>
                    <span className="text-xs font-semibold text-green-600">↑ 8%</span>
                  </div>
                  <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-orange-600 mb-1">Production</p>
                    <p className="text-2xl font-bold text-orange-700">234</p>
                    <span className="text-xs font-semibold text-green-600">↑ 15%</span>
                  </div>
                  <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Factory className="h-6 w-6 text-orange-600" />
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-600 mb-1">Inventory Items</p>
                    <p className="text-2xl font-bold text-purple-700">3,421</p>
                    <span className="text-xs font-semibold text-red-600">↓ 3%</span>
                  </div>
                  <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Package className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
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
                      className={`${selectedCategory === category.id
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
              {filteredModules.map((module) => {
                const Icon = module.icon;
                return (
                  <Link
                    key={module.id}
                    href={module.href}
                    className="group bg-white rounded-xl shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-200 hover:border-blue-400 hover:-translate-y-1"
                  >
                    <div className="p-6">
                      {/* Icon */}
                      <div className={`${module.color} w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-md`}>
                        <Icon className="h-7 w-7 text-white" />
                      </div>

                      {/* Module Name */}
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-200">
                        {module.name}
                      </h3>

                      {/* Description */}
                      <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                        {module.description}
                      </p>

                      {/* Stats */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="flex items-center space-x-4">
                          <div>
                            <p className="text-xs font-medium text-gray-500">Total</p>
                            <p className="text-base font-bold text-gray-900">{module.stats.total.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-xs font-medium text-gray-500">New</p>
                            <p className="text-base font-bold text-green-600">+{module.stats.new}</p>
                          </div>
                        </div>
                        <div className="text-blue-600 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    {/* Hover Effect Bar */}
                    <div className={`h-1.5 ${module.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`}></div>
                  </Link>
                );
              })}
            </div>

            {/* Empty State */}
            {filteredModules.length === 0 && (
              <div className="text-center py-16 bg-white rounded-xl border-2 border-dashed border-gray-300">
                <div className="bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No modules found</h3>
                <p className="text-gray-600 max-w-md mx-auto">We couldn't find any modules matching your search. Try adjusting your search query or explore all available modules.</p>
              </div>
            )}
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 flex-shrink-0">
          <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="text-center md:text-left">
                <p className="text-sm font-semibold text-gray-700 mb-1">
                  OptiForge - Solution to manufacturers
                </p>
                <p className="text-xs text-gray-500">
                  Powered by KreupAI Technologies LLC
                </p>
              </div>
              <div className="flex space-x-8">
                <Link href="/help" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">Help Center</Link>
                <Link href="/documentation" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">Documentation</Link>
                <Link href="/support/incidents" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">Contact Support</Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, User, Menu, ChevronDown } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import MegaMenu from '@/components/MegaMenu';
import Breadcrumbs from '@/components/Breadcrumbs';
import NotificationCenter from '@/components/notifications/NotificationCenter';

interface DashboardLayoutProps {
  children: React.ReactNode;
  pageTitle?: string;
}

export default function DashboardLayout({ children, pageTitle }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const megaMenuItems = [
    { id: 'sales', name: 'Sales & Marketing' },
    { id: 'operations', name: 'Operations' },
    { id: 'projects', name: 'Projects' },
    { id: 'admin', name: 'Admin & Support' },
  ];

  return (
    <div className="h-screen flex bg-white overflow-hidden">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? 'lg:ml-[315px]' : 'lg:ml-20'} overflow-hidden`}>
        {/* Header */}
        <header className="bg-gradient-to-r from-white via-white to-brand-blue/5 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-40 shadow-sm flex-shrink-0">
          <div className="w-full px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16 gap-4">
              {/* Logo and Menu Toggle */}
              <div className="flex items-center space-x-4 flex-shrink-0">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Menu className="h-6 w-6 text-gray-600" />
                </button>
                <div className="flex items-center overflow-hidden h-16 w-20">
                  <div className="relative w-12 h-12 transform scale-[2] origin-left">
                    <Image
                      src="/optiforge-logo.png"
                      alt="OptiForge Icon"
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
              </div>

              {/* Mega Menu Navigation */}
              <nav className="hidden lg:flex items-center space-x-1 flex-shrink-0">
                {megaMenuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveMegaMenu(activeMegaMenu === item.id ? null : item.id)}
                    className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg transition-all duration-200 ${activeMegaMenu === item.id
                      ? 'bg-brand-red text-white shadow-lg shadow-brand-red/20'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-brand-blue'
                      }`}
                  >
                    <span className="font-bold text-[13px] uppercase tracking-wide">{item.name}</span>
                    <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${activeMegaMenu === item.id ? 'rotate-180' : ''}`} />
                  </button>
                ))}
              </nav>

              {/* Page Title */}
              {pageTitle && (
                <div className="hidden lg:block px-4 border-l border-gray-300 flex-shrink-0">
                  <h2 className="text-lg font-bold text-gray-900">{pageTitle}</h2>
                </div>
              )}

              {/* Search Bar */}
              <div className="hidden md:flex flex-1 max-w-md ml-auto">
                <div className="relative w-full">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* User Actions */}
              <div className="flex items-center space-x-2">
                {/* Notification Center */}
                <NotificationCenter />

                {/* User Profile */}
                <button className="flex items-center space-x-2 p-1.5 text-gray-700 hover:bg-gray-50 rounded-xl transition-all group">
                  <div className="h-9 w-9 bg-brand-darkBlue rounded-lg flex items-center justify-center shadow-lg shadow-brand-darkBlue/10 group-hover:scale-105 transition-transform">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <div className="hidden xl:flex flex-col items-start pr-2">
                    <span className="font-bold text-[13px] leading-tight">Administrator</span>
                    <span className="text-[10px] text-gray-400 font-medium leading-tight">Super User</span>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Mega Menu */}
          {activeMegaMenu && (
            <MegaMenu activeMenu={activeMegaMenu} onClose={() => setActiveMegaMenu(null)} />
          )}
        </header>

        {/* Main Content - Scrollable */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden bg-gray-50 relative z-0">
          <div className="px-4 pt-4">
            <Breadcrumbs />
          </div>
          {children}
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

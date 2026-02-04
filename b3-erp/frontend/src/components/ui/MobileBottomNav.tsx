'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  LayoutDashboard,
  Package,
  Factory,
  ShoppingCart,
  ClipboardList,
  Users,
  Settings,
  MoreHorizontal,
  X,
  ChevronRight,
  Briefcase,
  Truck,
  Wrench,
  FileText,
  BarChart3,
  HelpCircle,
  type LucideIcon
} from 'lucide-react';

export interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: number | string;
  isActive?: boolean;
}

export interface MobileBottomNavProps {
  items?: NavItem[];
  moreItems?: NavItem[];
  className?: string;
  showLabels?: boolean;
  maxVisibleItems?: number;
}

// Default navigation items
const defaultNavItems: NavItem[] = [
  { id: 'home', label: 'Home', href: '/dashboard', icon: Home },
  { id: 'projects', label: 'Projects', href: '/project-management', icon: Briefcase },
  { id: 'production', label: 'Production', href: '/production', icon: Factory },
  { id: 'inventory', label: 'Inventory', href: '/inventory', icon: Package },
];

const defaultMoreItems: NavItem[] = [
  { id: 'crm', label: 'CRM', href: '/crm', icon: Users },
  { id: 'procurement', label: 'Procurement', href: '/procurement', icon: ShoppingCart },
  { id: 'sales', label: 'Sales', href: '/sales', icon: BarChart3 },
  { id: 'logistics', label: 'Logistics', href: '/logistics', icon: Truck },
  { id: 'service', label: 'Service', href: '/after-sales-service', icon: Wrench },
  { id: 'hr', label: 'HR', href: '/hr', icon: Users },
  { id: 'reports', label: 'Reports', href: '/reports', icon: FileText },
  { id: 'settings', label: 'Settings', href: '/settings', icon: Settings },
  { id: 'help', label: 'Help', href: '/help', icon: HelpCircle },
];

export function MobileBottomNav({
  items = defaultNavItems,
  moreItems = defaultMoreItems,
  className = '',
  showLabels = true,
  maxVisibleItems = 4
}: MobileBottomNavProps) {
  const pathname = usePathname();
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close more menu when route changes
  useEffect(() => {
    setIsMoreOpen(false);
  }, [pathname]);

  // Close more menu when clicking outside
  useEffect(() => {
    if (isMoreOpen) {
      const handleClickOutside = () => setIsMoreOpen(false);
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isMoreOpen]);

  const isItemActive = (item: NavItem) => {
    if (item.isActive !== undefined) return item.isActive;
    if (item.href === '/dashboard' && pathname === '/dashboard') return true;
    return pathname?.startsWith(item.href) && item.href !== '/dashboard';
  };

  const visibleItems = items.slice(0, maxVisibleItems);
  const hasMoreItems = moreItems.length > 0;

  if (!mounted) return null;

  return (
    <>
      {/* More Menu Overlay */}
      {isMoreOpen && (
        <div className="fixed inset-0 z-40 sm:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={(e) => { e.stopPropagation(); setIsMoreOpen(false); }}
          />

          {/* Menu Panel */}
          <div
            className="absolute bottom-[72px] left-0 right-0 bg-white rounded-t-2xl shadow-2xl max-h-[70vh] overflow-y-auto safe-area-inset-bottom"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between">
              <h2 className="font-semibold text-gray-900">More</h2>
              <button
                onClick={() => setIsMoreOpen(false)}
                className="p-2 -mr-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors touch-target"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Menu Items */}
            <div className="py-2">
              {moreItems.map((item) => {
                const Icon = item.icon;
                const isActive = isItemActive(item);

                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    className={`flex items-center gap-2 px-4 py-4 transition-colors touch-target ${
                      isActive
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-700 hover:bg-gray-50 active:bg-gray-100'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      isActive ? 'bg-blue-100' : 'bg-gray-100'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="flex-1 font-medium">{item.label}</span>
                    {item.badge && (
                      <span className="px-2 py-0.5 text-xs font-medium bg-red-100 text-red-600 rounded-full">
                        {item.badge}
                      </span>
                    )}
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation Bar */}
      <nav
        className={`fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-gray-200 safe-area-inset-bottom sm:hidden ${className}`}
      >
        <div className="flex items-center justify-around h-[72px] px-2">
          {visibleItems.map((item) => {
            const Icon = item.icon;
            const isActive = isItemActive(item);

            return (
              <Link
                key={item.id}
                href={item.href}
                className={`flex flex-col items-center justify-center flex-1 h-full py-2 px-1 transition-colors touch-target ${
                  isActive
                    ? 'text-blue-600'
                    : 'text-gray-500 hover:text-gray-700 active:text-gray-900'
                }`}
              >
                <div className={`relative p-1.5 rounded-xl transition-colors ${
                  isActive ? 'bg-blue-100' : ''
                }`}>
                  <Icon className={`w-6 h-6 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                  {item.badge && (
                    <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center text-[10px] font-bold bg-red-500 text-white rounded-full px-1">
                      {typeof item.badge === 'number' && item.badge > 99 ? '99+' : item.badge}
                    </span>
                  )}
                </div>
                {showLabels && (
                  <span className={`mt-1 text-[11px] font-medium ${isActive ? 'text-blue-600' : ''}`}>
                    {item.label}
                  </span>
                )}
              </Link>
            );
          })}

          {/* More Button */}
          {hasMoreItems && (
            <button
              onClick={(e) => { e.stopPropagation(); setIsMoreOpen(!isMoreOpen); }}
              className={`flex flex-col items-center justify-center flex-1 h-full py-2 px-1 transition-colors touch-target ${
                isMoreOpen
                  ? 'text-blue-600'
                  : 'text-gray-500 hover:text-gray-700 active:text-gray-900'
              }`}
            >
              <div className={`p-1.5 rounded-xl transition-colors ${
                isMoreOpen ? 'bg-blue-100' : ''
              }`}>
                <MoreHorizontal className="w-6 h-6" />
              </div>
              {showLabels && (
                <span className={`mt-1 text-[11px] font-medium ${isMoreOpen ? 'text-blue-600' : ''}`}>
                  More
                </span>
              )}
            </button>
          )}
        </div>
      </nav>

      {/* Spacer to prevent content from being hidden behind bottom nav */}
      <div className="h-[72px] sm:hidden" aria-hidden="true" />
    </>
  );
}

export default MobileBottomNav;

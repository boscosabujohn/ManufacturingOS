'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  Home,
  Search,
  Bell,
  User,
  Settings,
  LogOut,
} from 'lucide-react';

// Types
export interface MobileMenuItem {
  id: string;
  name: string;
  href?: string;
  icon?: React.ReactNode;
  subItems?: MobileMenuItem[];
}

interface MobileNavigationProps {
  className?: string;
  menuItems: MobileMenuItem[];
  logo?: React.ReactNode;
  userName?: string;
  userEmail?: string;
  userAvatar?: string;
  onSearch?: () => void;
  onLogout?: () => void;
}

export function MobileNavigation({
  className = '',
  menuItems,
  logo,
  userName = 'User',
  userEmail,
  userAvatar,
  onSearch,
  onLogout,
}: MobileNavigationProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const isActive = (href: string) => {
    if (href === '/') return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile Header */}
      <header className={`lg:hidden fixed top-0 left-0 right-0 z-40 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 ${className}`}>
        <div className="flex items-center justify-between px-4 h-14">
          {/* Hamburger Menu */}
          <button
            onClick={() => setIsOpen(true)}
            className="p-2 -ml-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Logo */}
          <div className="flex-1 flex justify-center">
            {logo || (
              <Link href="/dashboard" className="font-semibold text-gray-900 dark:text-white">
                ManufacturingOS
              </Link>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1">
            {onSearch && (
              <button
                onClick={onSearch}
                className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
              >
                <Search className="w-5 h-5" />
              </button>
            )}
            <button className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          {/* Slide-out Menu */}
          <nav className="absolute top-0 left-0 bottom-0 w-[85%] max-w-sm bg-white dark:bg-gray-900 shadow-xl flex flex-col">
            {/* Menu Header */}
            <div className="flex items-center justify-between px-4 h-14 border-b border-gray-200 dark:border-gray-700">
              {logo || (
                <span className="font-semibold text-gray-900 dark:text-white">
                  ManufacturingOS
                </span>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* User Profile */}
            <div className="px-4 py-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                {userAvatar ? (
                  <img
                    src={userAvatar}
                    alt={userName}
                    className="w-10 h-10 rounded-full"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                    <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 dark:text-white truncate">
                    {userName}
                  </div>
                  {userEmail && (
                    <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                      {userEmail}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="flex-1 overflow-y-auto py-2">
              {/* Quick Links */}
              <div className="px-4 py-2">
                <Link
                  href="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                    isActive('/dashboard')
                      ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <Home className="w-5 h-5" />
                  <span>Dashboard</span>
                </Link>
              </div>

              {/* Main Menu */}
              <div className="px-2">
                {menuItems.map(item => (
                  <MobileMenuItem
                    key={item.id}
                    item={item}
                    isExpanded={expandedItems.has(item.id)}
                    onToggle={() => toggleExpanded(item.id)}
                    onSelect={() => setIsOpen(false)}
                    isActive={isActive}
                    level={0}
                  />
                ))}
              </div>
            </div>

            {/* Footer Actions */}
            <div className="border-t border-gray-200 dark:border-gray-700 p-4 space-y-2">
              <Link
                href="/settings"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <Settings className="w-5 h-5" />
                <span>Settings</span>
              </Link>
              {onLogout && (
                <button
                  onClick={() => {
                    setIsOpen(false);
                    onLogout();
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Log out</span>
                </button>
              )}
            </div>
          </nav>
        </div>
      )}
    </>
  );
}

// Mobile Menu Item component
function MobileMenuItem({
  item,
  isExpanded,
  onToggle,
  onSelect,
  isActive,
  level,
}: {
  item: MobileMenuItem;
  isExpanded: boolean;
  onToggle: () => void;
  onSelect: () => void;
  isActive: (href: string) => boolean;
  level: number;
}) {
  const hasSubItems = item.subItems && item.subItems.length > 0;
  const [childExpanded, setChildExpanded] = useState<Set<string>>(new Set());

  const toggleChildExpanded = (childId: string) => {
    setChildExpanded(prev => {
      const newSet = new Set(prev);
      if (newSet.has(childId)) {
        newSet.delete(childId);
      } else {
        newSet.add(childId);
      }
      return newSet;
    });
  };

  const itemActive = item.href && isActive(item.href);
  const paddingLeft = level === 0 ? 'pl-3' : level === 1 ? 'pl-8' : 'pl-12';

  if (hasSubItems) {
    return (
      <div>
        <button
          onClick={onToggle}
          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors ${paddingLeft} ${
            isExpanded
              ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
        >
          <span className="flex items-center gap-3">
            {item.icon}
            <span className="font-medium">{item.name}</span>
          </span>
          {isExpanded ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </button>

        {isExpanded && (
          <div className="mt-1 space-y-1">
            {item.subItems!.map(subItem => (
              <MobileMenuItem
                key={subItem.id}
                item={subItem}
                isExpanded={childExpanded.has(subItem.id)}
                onToggle={() => toggleChildExpanded(subItem.id)}
                onSelect={onSelect}
                isActive={isActive}
                level={level + 1}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      href={item.href || '#'}
      onClick={onSelect}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${paddingLeft} ${
        itemActive
          ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
      }`}
    >
      {item.icon}
      <span>{item.name}</span>
    </Link>
  );
}

// Hamburger button component for use in other headers
export function HamburgerButton({
  onClick,
  isOpen,
  className = '',
}: {
  onClick: () => void;
  isOpen?: boolean;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`lg:hidden p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg ${className}`}
      aria-label={isOpen ? 'Close menu' : 'Open menu'}
    >
      {isOpen ? (
        <X className="w-6 h-6" />
      ) : (
        <Menu className="w-6 h-6" />
      )}
    </button>
  );
}

export type { MobileNavigationProps, MobileMenuItem };

'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  Home,
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  MoreHorizontal,
  X,
  ChevronRight,
  Settings,
  Bell,
  Search,
  Plus,
} from 'lucide-react';

// Types
export interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href?: string;
  onClick?: () => void;
  badge?: number;
  badgeColor?: 'red' | 'blue' | 'green';
}

export interface MoreMenuItem extends NavItem {
  description?: string;
  category?: string;
}

export interface MobileBottomNavProps {
  items?: NavItem[];
  moreItems?: MoreMenuItem[];
  maxVisibleItems?: number;
  showLabels?: boolean;
  onQuickAction?: () => void;
  quickActionIcon?: React.ReactNode;
  quickActionLabel?: string;
  className?: string;
}

// Default navigation items
const defaultItems: NavItem[] = [
  { id: 'home', label: 'Home', icon: <Home className="w-6 h-6" />, href: '/' },
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-6 h-6" />, href: '/dashboard' },
  { id: 'inventory', label: 'Inventory', icon: <Package className="w-6 h-6" />, href: '/inventory' },
  { id: 'orders', label: 'Orders', icon: <ShoppingCart className="w-6 h-6" />, href: '/orders', badge: 3 },
  { id: 'customers', label: 'Customers', icon: <Users className="w-6 h-6" />, href: '/customers' },
];

// Badge component
function NavBadge({ count, color = 'red' }: { count: number; color?: 'red' | 'blue' | 'green' }) {
  const colors = {
    red: 'bg-red-500',
    blue: 'bg-blue-500',
    green: 'bg-green-500',
  };

  if (count <= 0) return null;

  return (
    <span className={`absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 flex items-center justify-center text-xs font-bold text-white rounded-full ${colors[color]}`}>
      {count > 99 ? '99+' : count}
    </span>
  );
}

export function MobileBottomNav({
  items = defaultItems,
  moreItems = [],
  maxVisibleItems = 5,
  showLabels = true,
  onQuickAction,
  quickActionIcon = <Plus className="w-6 h-6" />,
  quickActionLabel = 'Quick Action',
  className = '',
}: MobileBottomNavProps) {
  const pathname = usePathname();
  const [showMore, setShowMore] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Visible items (leave space for "more" if needed)
  const hasMoreButton = items.length > maxVisibleItems || moreItems.length > 0;
  const visibleItems = hasMoreButton ? items.slice(0, maxVisibleItems - 1) : items.slice(0, maxVisibleItems);

  // Hide on scroll down, show on scroll up
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Check if item is active
  const isActive = useCallback((item: NavItem) => {
    if (!item.href) return false;
    if (item.href === '/') return pathname === '/';
    return pathname.startsWith(item.href);
  }, [pathname]);

  // Close more menu
  const closeMore = useCallback(() => {
    setShowMore(false);
  }, []);

  // Remaining items for "more" menu
  const remainingItems = hasMoreButton ? items.slice(maxVisibleItems - 1) : [];
  const allMoreItems = [...remainingItems, ...moreItems];

  // Group more items by category
  const groupedMoreItems = allMoreItems.reduce((acc, item) => {
    const moreItem = item as MoreMenuItem;
    const category = moreItem.category || 'Other';
    if (!acc[category]) acc[category] = [];
    acc[category].push(moreItem);
    return acc;
  }, {} as Record<string, MoreMenuItem[]>);

  return (
    <>
      {/* Bottom Navigation Bar */}
      <nav
        className={`fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 transition-transform duration-300 safe-area-bottom ${
          isVisible ? 'translate-y-0' : 'translate-y-full'
        } ${className}`}
      >
        <div className="flex items-center justify-around h-16 px-2">
          {/* Quick Action Button (optional, centered) */}
          {onQuickAction && (
            <button
              onClick={onQuickAction}
              className="absolute -top-6 left-1/2 -translate-x-1/2 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center active:scale-95 transition-transform"
              aria-label={quickActionLabel}
            >
              {quickActionIcon}
            </button>
          )}

          {/* Navigation Items */}
          {visibleItems.map(item => {
            const active = isActive(item);

            const content = (
              <>
                <span className="relative">
                  {item.icon}
                  {item.badge && <NavBadge count={item.badge} color={item.badgeColor} />}
                </span>
                {showLabels && (
                  <span className={`text-xs mt-1 ${active ? 'font-medium' : ''}`}>
                    {item.label}
                  </span>
                )}
              </>
            );

            if (item.href) {
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`flex flex-col items-center justify-center flex-1 h-full min-w-[64px] transition-colors ${
                    active
                      ? 'text-blue-600'
                      : 'text-gray-500 dark:text-gray-400 active:text-gray-900 dark:active:text-white'
                  }`}
                >
                  {content}
                </Link>
              );
            }

            return (
              <button
                key={item.id}
                onClick={item.onClick}
                className={`flex flex-col items-center justify-center flex-1 h-full min-w-[64px] transition-colors ${
                  active
                    ? 'text-blue-600'
                    : 'text-gray-500 dark:text-gray-400 active:text-gray-900 dark:active:text-white'
                }`}
              >
                {content}
              </button>
            );
          })}

          {/* More Button */}
          {hasMoreButton && (
            <button
              onClick={() => setShowMore(true)}
              className={`flex flex-col items-center justify-center flex-1 h-full min-w-[64px] transition-colors ${
                showMore
                  ? 'text-blue-600'
                  : 'text-gray-500 dark:text-gray-400 active:text-gray-900 dark:active:text-white'
              }`}
            >
              <MoreHorizontal className="w-6 h-6" />
              {showLabels && <span className="text-xs mt-1">More</span>}
            </button>
          )}
        </div>
      </nav>

      {/* More Menu Sheet */}
      {showMore && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-50"
            onClick={closeMore}
          />

          {/* Sheet */}
          <div className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 rounded-t-2xl max-h-[80vh] overflow-hidden animate-slide-up">
            {/* Handle */}
            <div className="flex justify-center py-3">
              <div className="w-10 h-1 bg-gray-300 dark:bg-gray-600 rounded-full" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-4 pb-3 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">More</h2>
              <button
                onClick={closeMore}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="overflow-y-auto max-h-[60vh] pb-safe">
              {Object.entries(groupedMoreItems).map(([category, categoryItems]) => (
                <div key={category}>
                  {Object.keys(groupedMoreItems).length > 1 && (
                    <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800">
                      <span className="text-xs font-medium text-gray-500 uppercase">
                        {category}
                      </span>
                    </div>
                  )}
                  {categoryItems.map(item => {
                    const active = isActive(item);

                    const content = (
                      <div className="flex items-center gap-4 px-4 py-4 active:bg-gray-100 dark:active:bg-gray-800">
                        <span className={`w-10 h-10 flex items-center justify-center rounded-xl ${
                          active
                            ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                        }`}>
                          {item.icon}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className={`font-medium ${active ? 'text-blue-600' : 'text-gray-900 dark:text-white'}`}>
                            {item.label}
                          </p>
                          {item.description && (
                            <p className="text-sm text-gray-500 truncate">{item.description}</p>
                          )}
                        </div>
                        {item.badge && <NavBadge count={item.badge} color={item.badgeColor} />}
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      </div>
                    );

                    if (item.href) {
                      return (
                        <Link key={item.id} href={item.href} onClick={closeMore}>
                          {content}
                        </Link>
                      );
                    }

                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          item.onClick?.();
                          closeMore();
                        }}
                        className="w-full text-left"
                      >
                        {content}
                      </button>
                    );
                  })}
                </div>
              ))}

              {/* Quick Settings */}
              <div className="px-4 py-4 border-t border-gray-200 dark:border-gray-700 mt-2">
                <div className="flex items-center gap-4">
                  <Link
                    href="/settings"
                    onClick={closeMore}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-gray-100 dark:bg-gray-800 rounded-xl text-gray-700 dark:text-gray-300 active:bg-gray-200 dark:active:bg-gray-700"
                  >
                    <Settings className="w-5 h-5" />
                    Settings
                  </Link>
                  <Link
                    href="/notifications"
                    onClick={closeMore}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-gray-100 dark:bg-gray-800 rounded-xl text-gray-700 dark:text-gray-300 active:bg-gray-200 dark:active:bg-gray-700"
                  >
                    <Bell className="w-5 h-5" />
                    Notifications
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Safe area spacer */}
      <div className="h-16 safe-area-bottom" />

      <style jsx global>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
        .safe-area-bottom {
          padding-bottom: env(safe-area-inset-bottom, 0);
        }
        .pb-safe {
          padding-bottom: env(safe-area-inset-bottom, 16px);
        }
      `}</style>
    </>
  );
}

// Mobile Header with search
export interface MobileHeaderProps {
  title: string;
  showSearch?: boolean;
  onSearch?: (query: string) => void;
  searchPlaceholder?: string;
  actions?: React.ReactNode;
  backButton?: boolean;
  onBack?: () => void;
}

export function MobileHeader({
  title,
  showSearch = false,
  onSearch,
  searchPlaceholder = 'Search...',
  actions,
  backButton = false,
  onBack,
}: MobileHeaderProps) {
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(searchQuery);
  }, [searchQuery, onSearch]);

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 safe-area-top">
      <div className="flex items-center h-14 px-4 gap-3">
        {backButton && (
          <button
            onClick={onBack}
            className="p-2 -ml-2 text-gray-600 dark:text-gray-400"
          >
            <ChevronRight className="w-6 h-6 rotate-180" />
          </button>
        )}

        {isSearching ? (
          <form onSubmit={handleSearch} className="flex-1 flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={searchPlaceholder}
                autoFocus
                className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="button"
              onClick={() => setIsSearching(false)}
              className="p-2 text-gray-600 dark:text-gray-400"
            >
              Cancel
            </button>
          </form>
        ) : (
          <>
            <h1 className="flex-1 text-lg font-semibold text-gray-900 dark:text-white truncate">
              {title}
            </h1>

            {showSearch && (
              <button
                onClick={() => setIsSearching(true)}
                className="p-2 text-gray-600 dark:text-gray-400"
              >
                <Search className="w-5 h-5" />
              </button>
            )}

            {actions}
          </>
        )}
      </div>

      <style jsx global>{`
        .safe-area-top {
          padding-top: env(safe-area-inset-top, 0);
        }
      `}</style>
    </header>
  );
}


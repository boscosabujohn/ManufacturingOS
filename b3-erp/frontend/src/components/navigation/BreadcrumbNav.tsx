'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  ChevronRight,
  ChevronDown,
  Copy,
  ExternalLink,
  Star,
  MoreHorizontal,
} from 'lucide-react';

// Types
export interface BreadcrumbItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
}

interface BreadcrumbNavProps {
  className?: string;
  items?: BreadcrumbItem[];
  homeHref?: string;
  showHome?: boolean;
  maxItems?: number;
  separator?: React.ReactNode;
  onFavorite?: (path: string, title: string) => void;
}

// Path to label mapping
const pathLabels: Record<string, string> = {
  dashboard: 'Dashboard',
  production: 'Production',
  orders: 'Orders',
  scheduling: 'Scheduling',
  planning: 'Planning',
  inventory: 'Inventory',
  items: 'Items',
  movements: 'Movements',
  warehouses: 'Warehouses',
  sales: 'Sales',
  quotations: 'Quotations',
  customers: 'Customers',
  procurement: 'Procurement',
  vendors: 'Vendors',
  rfq: 'RFQ',
  crm: 'CRM',
  contacts: 'Contacts',
  leads: 'Leads',
  opportunities: 'Opportunities',
  accounts: 'Accounts',
  ledger: 'Ledger',
  billing: 'Billing',
  payments: 'Payments',
  hr: 'HR',
  employees: 'Employees',
  attendance: 'Attendance',
  payroll: 'Payroll',
  settings: 'Settings',
  'design-system': 'Design System',
  'after-sales-service': 'After Sales',
  'project-management': 'Projects',
  collaboration: 'Collaboration',
  resilience: 'Resilience',
  logistics: 'Logistics',
  quality: 'Quality',
  estimation: 'Estimation',
  cpq: 'CPQ',
  'common-masters': 'Masters',
  'it-admin': 'IT Admin',
};

// Generate breadcrumbs from path
function generateBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const segments = pathname.split('/').filter(Boolean);
  const breadcrumbs: BreadcrumbItem[] = [];
  let currentPath = '';

  segments.forEach((segment) => {
    // Skip dynamic segments like [id]
    if (segment.startsWith('[') && segment.endsWith(']')) {
      const cleanSegment = segment.slice(1, -1);
      currentPath += `/${segment}`;
      breadcrumbs.push({
        label: `#${cleanSegment}`,
        href: currentPath,
      });
      return;
    }

    currentPath += `/${segment}`;
    const label = pathLabels[segment] || segment.split('-').map(
      word => word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');

    breadcrumbs.push({
      label,
      href: currentPath,
    });
  });

  return breadcrumbs;
}

export function BreadcrumbNav({
  className = '',
  items,
  homeHref = '/dashboard',
  showHome = true,
  maxItems = 4,
  separator,
  onFavorite,
}: BreadcrumbNavProps) {
  const pathname = usePathname();
  const [showDropdown, setShowDropdown] = useState(false);
  const [copiedPath, setCopiedPath] = useState(false);

  // Generate breadcrumbs from path or use provided items
  const breadcrumbs = useMemo(() => {
    return items || generateBreadcrumbs(pathname);
  }, [items, pathname]);

  // Handle truncation for long breadcrumb trails
  const displayBreadcrumbs = useMemo(() => {
    if (breadcrumbs.length <= maxItems) {
      return { visible: breadcrumbs, collapsed: [] };
    }

    // Show first item, collapsed middle, and last items
    const first = breadcrumbs.slice(0, 1);
    const collapsed = breadcrumbs.slice(1, breadcrumbs.length - (maxItems - 2));
    const last = breadcrumbs.slice(breadcrumbs.length - (maxItems - 2));

    return { visible: [...first, ...last], collapsed };
  }, [breadcrumbs, maxItems]);

  const handleCopyPath = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedPath(true);
    setTimeout(() => setCopiedPath(false), 2000);
  };

  const handleFavorite = () => {
    const lastItem = breadcrumbs[breadcrumbs.length - 1];
    if (onFavorite && lastItem) {
      onFavorite(lastItem.href, lastItem.label);
    }
  };

  const defaultSeparator = (
    <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
  );

  const SeparatorComponent = separator || defaultSeparator;

  return (
    <nav className={`flex items-center ${className}`} aria-label="Breadcrumb">
      <ol className="flex items-center gap-1 flex-wrap">
        {/* Home */}
        {showHome && (
          <>
            <li>
              <Link
                href={homeHref}
                className="flex items-center gap-1 p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
                title="Home"
              >
                <Home className="w-4 h-4" />
              </Link>
            </li>
            {breadcrumbs.length > 0 && (
              <li className="flex items-center">
                {SeparatorComponent}
              </li>
            )}
          </>
        )}

        {/* Collapsed items dropdown */}
        {displayBreadcrumbs.collapsed.length > 0 && (
          <>
            <li className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-1 px-2 py-1 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>

              {showDropdown && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowDropdown(false)}
                  />
                  <div className="absolute left-0 top-full mt-1 w-48 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 py-1">
                    {displayBreadcrumbs.collapsed.map((item, i) => (
                      <Link
                        key={i}
                        href={item.href}
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                      >
                        {item.icon}
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </li>
            <li className="flex items-center">
              {SeparatorComponent}
            </li>
          </>
        )}

        {/* Visible breadcrumb items */}
        {displayBreadcrumbs.visible.map((item, index) => {
          const isLast = index === displayBreadcrumbs.visible.length - 1;
          const isCollapsedStart = displayBreadcrumbs.collapsed.length > 0 && index === 0;

          return (
            <React.Fragment key={item.href}>
              <li>
                {isLast ? (
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1 px-2 py-1 text-sm font-medium text-gray-900 dark:text-white">
                      {item.icon}
                      {item.label}
                    </span>

                    {/* Action buttons for current page */}
                    <div className="flex items-center gap-0.5 ml-1">
                      <button
                        onClick={handleCopyPath}
                        className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
                        title={copiedPath ? 'Copied!' : 'Copy link'}
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      {onFavorite && (
                        <button
                          onClick={handleFavorite}
                          className="p-1 text-gray-400 hover:text-yellow-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
                          title="Add to favorites"
                        >
                          <Star className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <BreadcrumbLink item={item} />
                )}
              </li>
              {!isLast && (
                <li className="flex items-center">
                  {SeparatorComponent}
                </li>
              )}
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
}

// Breadcrumb link with dropdown for sibling navigation
function BreadcrumbLink({ item }: { item: BreadcrumbItem }) {
  const [showSiblings, setShowSiblings] = useState(false);

  // You could fetch or compute sibling pages here
  const siblingPages: BreadcrumbItem[] = [];

  return (
    <div className="relative">
      <Link
        href={item.href}
        className="flex items-center gap-1 px-2 py-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
      >
        {item.icon}
        <span>{item.label}</span>
        {siblingPages.length > 0 && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowSiblings(!showSiblings);
            }}
            className="ml-0.5 p-0.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
          >
            <ChevronDown className="w-3 h-3" />
          </button>
        )}
      </Link>

      {showSiblings && siblingPages.length > 0 && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowSiblings(false)}
          />
          <div className="absolute left-0 top-full mt-1 w-48 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 py-1">
            {siblingPages.map((sibling, i) => (
              <Link
                key={i}
                href={sibling.href}
                onClick={() => setShowSiblings(false)}
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                {sibling.icon}
                {sibling.label}
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// Simplified breadcrumb for compact spaces
export function CompactBreadcrumb({ className = '' }: { className?: string }) {
  const pathname = usePathname();
  const breadcrumbs = generateBreadcrumbs(pathname);

  if (breadcrumbs.length === 0) return null;

  const current = breadcrumbs[breadcrumbs.length - 1];
  const parent = breadcrumbs.length > 1 ? breadcrumbs[breadcrumbs.length - 2] : null;

  return (
    <div className={`flex items-center gap-1 text-sm ${className}`}>
      {parent && (
        <>
          <Link
            href={parent.href}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          >
            {parent.label}
          </Link>
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </>
      )}
      <span className="font-medium text-gray-900 dark:text-white">{current.label}</span>
    </div>
  );
}

export type { BreadcrumbNavProps, BreadcrumbItem };

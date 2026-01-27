'use client';

import React from 'react';
import Link from 'next/link';
import {
  Plus,
  FileText,
  ShoppingCart,
  Package,
  Users,
  Factory,
  Truck,
  Calculator,
  DollarSign,
  BarChart3,
  Settings,
  Zap,
} from 'lucide-react';

// Types
export interface QuickAction {
  id: string;
  label: string;
  href: string;
  icon: React.ReactNode;
  color?: string;
  description?: string;
  shortcut?: string;
}

interface QuickAccessButtonsProps {
  className?: string;
  variant?: 'horizontal' | 'vertical' | 'grid';
  showLabels?: boolean;
  maxVisible?: number;
  actions?: QuickAction[];
}

// Default quick actions
const defaultQuickActions: QuickAction[] = [
  {
    id: 'new-sales-order',
    label: 'New Sales Order',
    href: '/sales/orders/new',
    icon: <ShoppingCart className="w-4 h-4" />,
    color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30',
    description: 'Create a new sales order',
    shortcut: 'O',
  },
  {
    id: 'new-quotation',
    label: 'New Quotation',
    href: '/sales/quotations/new',
    icon: <FileText className="w-4 h-4" />,
    color: 'text-green-600 bg-green-100 dark:bg-green-900/30',
    description: 'Create a new quotation',
    shortcut: 'Q',
  },
  {
    id: 'new-purchase-order',
    label: 'New PO',
    href: '/procurement/orders/new',
    icon: <Truck className="w-4 h-4" />,
    color: 'text-orange-600 bg-orange-100 dark:bg-orange-900/30',
    description: 'Create a purchase order',
    shortcut: 'P',
  },
  {
    id: 'new-production-order',
    label: 'New Production',
    href: '/production/orders/new',
    icon: <Factory className="w-4 h-4" />,
    color: 'text-purple-600 bg-purple-100 dark:bg-purple-900/30',
    description: 'Create a production order',
    shortcut: 'M',
  },
  {
    id: 'new-contact',
    label: 'New Contact',
    href: '/crm/contacts/new',
    icon: <Users className="w-4 h-4" />,
    color: 'text-pink-600 bg-pink-100 dark:bg-pink-900/30',
    description: 'Add a new contact',
    shortcut: 'C',
  },
  {
    id: 'new-item',
    label: 'New Item',
    href: '/inventory/items/new',
    icon: <Package className="w-4 h-4" />,
    color: 'text-amber-600 bg-amber-100 dark:bg-amber-900/30',
    description: 'Add a new inventory item',
    shortcut: 'I',
  },
];

export function QuickAccessButtons({
  className = '',
  variant = 'horizontal',
  showLabels = true,
  maxVisible = 6,
  actions = defaultQuickActions,
}: QuickAccessButtonsProps) {
  const visibleActions = actions.slice(0, maxVisible);

  if (variant === 'vertical') {
    return (
      <div className={`flex flex-col gap-1 ${className}`}>
        {visibleActions.map(action => (
          <Link
            key={action.id}
            href={action.href}
            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
            title={action.description}
          >
            <span className={`p-1.5 rounded-md ${action.color || 'text-gray-600 bg-gray-100'}`}>
              {action.icon}
            </span>
            {showLabels && (
              <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white">
                {action.label}
              </span>
            )}
            {action.shortcut && (
              <kbd className="ml-auto text-xs text-gray-400 bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                {action.shortcut}
              </kbd>
            )}
          </Link>
        ))}
      </div>
    );
  }

  if (variant === 'grid') {
    return (
      <div className={`grid grid-cols-3 gap-2 ${className}`}>
        {visibleActions.map(action => (
          <Link
            key={action.id}
            href={action.href}
            className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
            title={action.description}
          >
            <span className={`p-2 rounded-lg ${action.color || 'text-gray-600 bg-gray-100'}`}>
              {action.icon}
            </span>
            {showLabels && (
              <span className="text-xs text-gray-600 dark:text-gray-400 text-center group-hover:text-gray-900 dark:group-hover:text-white">
                {action.label}
              </span>
            )}
          </Link>
        ))}
      </div>
    );
  }

  // Horizontal variant (default)
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {visibleActions.map(action => (
        <Link
          key={action.id}
          href={action.href}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group ${
            showLabels ? '' : 'px-2'
          }`}
          title={action.description || action.label}
        >
          <span className={`${showLabels ? '' : 'p-1 rounded-md'} ${action.color || 'text-gray-600'}`}>
            {action.icon}
          </span>
          {showLabels && (
            <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white whitespace-nowrap">
              {action.label}
            </span>
          )}
        </Link>
      ))}
    </div>
  );
}

// Compact quick action bar for sidebar
export function SidebarQuickActions({
  className = '',
  actions = defaultQuickActions.slice(0, 4),
}: {
  className?: string;
  actions?: QuickAction[];
}) {
  return (
    <div className={`px-3 py-2 ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          Quick Actions
        </span>
      </div>
      <div className="flex items-center gap-1">
        {actions.map(action => (
          <Link
            key={action.id}
            href={action.href}
            className={`flex-1 flex items-center justify-center p-2 rounded-lg transition-colors hover:opacity-80 ${action.color || 'text-gray-600 bg-gray-100 dark:bg-gray-800'}`}
            title={action.label}
          >
            {action.icon}
          </Link>
        ))}
      </div>
    </div>
  );
}

// Floating action button for mobile
export function FloatingQuickAction({
  action = defaultQuickActions[0],
  className = '',
}: {
  action?: QuickAction;
  className?: string;
}) {
  return (
    <Link
      href={action.href}
      className={`fixed bottom-6 right-6 z-30 lg:hidden flex items-center justify-center w-14 h-14 rounded-full shadow-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors ${className}`}
      title={action.label}
    >
      <Plus className="w-6 h-6" />
    </Link>
  );
}

export type { QuickAccessButtonsProps };

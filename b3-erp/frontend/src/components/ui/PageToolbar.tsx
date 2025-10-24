import React, { ReactNode } from 'react';
import { ArrowLeft, Plus, Download, Upload, Filter, RefreshCw, Settings, MoreVertical } from 'lucide-react';
import Link from 'next/link';

export interface ToolbarAction {
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  onClick?: () => void;
  href?: string;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  disabled?: boolean;
}

export interface PageToolbarProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: Array<{ label: string; href?: string }>;
  backButton?: {
    label?: string;
    href: string;
  };
  actions?: ToolbarAction[];
  tabs?: Array<{
    id: string;
    label: string;
    count?: number;
  }>;
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
  searchPlaceholder?: string;
  onSearch?: (query: string) => void;
  filterCount?: number;
  onFilterToggle?: () => void;
  className?: string;
  children?: ReactNode;
}

const variantStyles = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700',
  secondary: 'border border-gray-300 text-gray-700 hover:bg-gray-50',
  ghost: 'text-gray-700 hover:bg-gray-100',
  danger: 'bg-red-600 text-white hover:bg-red-700'
};

export const PageToolbar: React.FC<PageToolbarProps> = ({
  title,
  subtitle,
  breadcrumbs,
  backButton,
  actions = [],
  tabs,
  activeTab,
  onTabChange,
  searchPlaceholder,
  onSearch,
  filterCount,
  onFilterToggle,
  className = '',
  children
}) => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [showMoreMenu, setShowMoreMenu] = React.useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(searchQuery);
  };

  const renderAction = (action: ToolbarAction, index: number) => {
    const Icon = action.icon;
    const baseClasses = 'inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed';
    const variantClass = variantStyles[action.variant || 'secondary'];
    const className = `${baseClasses} ${variantClass}`;

    const content = (
      <>
        {Icon && <Icon className="w-4 h-4" />}
        {action.label}
      </>
    );

    if (action.href) {
      return (
        <Link
          key={index}
          href={action.href}
          className={className}
        >
          {content}
        </Link>
      );
    }

    return (
      <button
        key={index}
        onClick={action.onClick}
        disabled={action.disabled}
        className={className}
      >
        {content}
      </button>
    );
  };

  // Separate primary actions from overflow
  const primaryActions = actions.slice(0, 3);
  const overflowActions = actions.slice(3);

  return (
    <div className={`bg-white border-b border-gray-200 ${className}`}>
      <div className="px-6 py-4">
        {/* Breadcrumbs */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="flex items-center gap-2 text-sm text-gray-600 mb-3">
            {breadcrumbs.map((crumb, index) => (
              <React.Fragment key={index}>
                {crumb.href ? (
                  <Link href={crumb.href} className="hover:text-gray-900 transition-colors">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-gray-900 font-medium">{crumb.label}</span>
                )}
                {index < breadcrumbs.length - 1 && (
                  <span className="text-gray-400">/</span>
                )}
              </React.Fragment>
            ))}
          </nav>
        )}

        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-4">
            {/* Back Button */}
            {backButton && (
              <Link
                href={backButton.href}
                className="inline-flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                {backButton.label && <span className="text-sm font-medium">{backButton.label}</span>}
              </Link>
            )}

            {/* Title & Subtitle */}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
              {subtitle && (
                <p className="mt-1 text-sm text-gray-600">{subtitle}</p>
              )}
            </div>
          </div>

          {/* Actions */}
          {actions.length > 0 && (
            <div className="flex items-center gap-2">
              {primaryActions.map((action, index) => renderAction(action, index))}

              {overflowActions.length > 0 && (
                <div className="relative">
                  <button
                    onClick={() => setShowMoreMenu(!showMoreMenu)}
                    className="inline-flex items-center gap-2 px-3 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>

                  {showMoreMenu && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setShowMoreMenu(false)}
                      />
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                        {overflowActions.map((action, index) => {
                          const Icon = action.icon;
                          return (
                            <button
                              key={index}
                              onClick={() => {
                                action.onClick?.();
                                setShowMoreMenu(false);
                              }}
                              disabled={action.disabled}
                              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                              {Icon && <Icon className="w-4 h-4" />}
                              {action.label}
                            </button>
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Search & Filters */}
        {(onSearch || onFilterToggle) && (
          <div className="flex items-center gap-3 mb-4">
            {onSearch && (
              <form onSubmit={handleSearch} className="flex-1 max-w-md">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={searchPlaceholder || 'Search...'}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </form>
            )}

            {onFilterToggle && (
              <button
                onClick={onFilterToggle}
                className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors text-sm font-medium"
              >
                <Filter className="w-4 h-4" />
                <span>Filters</span>
                {filterCount !== undefined && filterCount > 0 && (
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                    {filterCount}
                  </span>
                )}
              </button>
            )}
          </div>
        )}

        {/* Tabs */}
        {tabs && tabs.length > 0 && (
          <div className="flex items-center gap-1 border-b border-gray-200 -mb-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange?.(tab.id)}
                className={`
                  px-4 py-2 text-sm font-medium transition-colors relative
                  ${activeTab === tab.id
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                  }
                `}
              >
                {tab.label}
                {tab.count !== undefined && (
                  <span className={`
                    ml-2 px-2 py-0.5 rounded-full text-xs
                    ${activeTab === tab.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-600'
                    }
                  `}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}

        {/* Custom children */}
        {children}
      </div>
    </div>
  );
};

export default PageToolbar;

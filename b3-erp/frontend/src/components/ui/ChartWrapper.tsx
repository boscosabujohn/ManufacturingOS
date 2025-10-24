import React, { ReactNode } from 'react';
import { Download, Maximize2, RefreshCw, MoreVertical } from 'lucide-react';
import { ChartSkeleton } from './LoadingState';
import { EmptyState } from './EmptyState';

export interface ChartWrapperProps {
  title: string;
  description?: string;
  loading?: boolean;
  error?: string;
  isEmpty?: boolean;
  emptyMessage?: string;
  children: ReactNode;
  actions?: Array<{
    label: string;
    icon?: React.ComponentType<{ className?: string }>;
    onClick: () => void;
  }>;
  showDownload?: boolean;
  showRefresh?: boolean;
  showFullscreen?: boolean;
  onDownload?: () => void;
  onRefresh?: () => void;
  onFullscreen?: () => void;
  className?: string;
  height?: string;
}

export const ChartWrapper: React.FC<ChartWrapperProps> = ({
  title,
  description,
  loading = false,
  error,
  isEmpty = false,
  emptyMessage = 'No data available for this chart',
  children,
  actions = [],
  showDownload = false,
  showRefresh = false,
  showFullscreen = false,
  onDownload,
  onRefresh,
  onFullscreen,
  className = '',
  height = 'h-80'
}) => {
  const [showMenu, setShowMenu] = React.useState(false);

  const hasActions = actions.length > 0 || showDownload || showRefresh || showFullscreen;

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
      {/* Header */}
      <div className="flex items-start justify-between p-6 border-b border-gray-200">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          {description && (
            <p className="mt-1 text-sm text-gray-600">{description}</p>
          )}
        </div>

        {hasActions && (
          <div className="flex items-center gap-2 ml-4">
            {/* Quick Actions */}
            {showRefresh && onRefresh && (
              <button
                onClick={onRefresh}
                disabled={loading}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Refresh"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
            )}

            {showDownload && onDownload && (
              <button
                onClick={onDownload}
                disabled={loading}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Download"
              >
                <Download className="w-4 h-4" />
              </button>
            )}

            {showFullscreen && onFullscreen && (
              <button
                onClick={onFullscreen}
                disabled={loading}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Fullscreen"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            )}

            {/* More Actions Menu */}
            {actions.length > 0 && (
              <div className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  title="More actions"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>

                {showMenu && (
                  <>
                    {/* Backdrop */}
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowMenu(false)}
                    />

                    {/* Menu */}
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                      {actions.map((action, index) => {
                        const Icon = action.icon;
                        return (
                          <button
                            key={index}
                            onClick={() => {
                              action.onClick();
                              setShowMenu(false);
                            }}
                            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
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

      {/* Content */}
      <div className={`p-6 ${height}`}>
        {loading ? (
          <ChartSkeleton height="h-full" />
        ) : error ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">⚠️</span>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-1">Error loading chart</h4>
              <p className="text-sm text-gray-600">{error}</p>
              {showRefresh && onRefresh && (
                <button
                  onClick={onRefresh}
                  className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  <RefreshCw className="w-4 h-4" />
                  Try Again
                </button>
              )}
            </div>
          </div>
        ) : isEmpty ? (
          <div className="flex items-center justify-center h-full">
            <EmptyState
              title="No Data"
              description={emptyMessage}
              size="sm"
            />
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
};

export default ChartWrapper;

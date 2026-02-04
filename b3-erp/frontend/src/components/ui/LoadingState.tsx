import React from 'react';
import { Loader2 } from 'lucide-react';

export interface LoadingStateProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'spinner' | 'skeleton' | 'dots';
  className?: string;
  fullScreen?: boolean;
}

const sizeVariants = {
  sm: {
    spinner: 'w-4 h-4',
    text: 'text-sm',
    dots: 'w-2 h-2'
  },
  md: {
    spinner: 'w-8 h-8',
    text: 'text-base',
    dots: 'w-3 h-3'
  },
  lg: {
    spinner: 'w-12 h-12',
    text: 'text-lg',
    dots: 'w-4 h-4'
  }
};

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Loading...',
  size = 'md',
  variant = 'spinner',
  className = '',
  fullScreen = false
}) => {
  const sizes = sizeVariants[size];

  const renderLoader = () => {
    switch (variant) {
      case 'spinner':
        return (
          <div className="flex flex-col items-center justify-center gap-3">
            <Loader2 className={`${sizes.spinner} animate-spin text-blue-600`} />
            {message && (
              <p className={`${sizes.text} text-gray-600 font-medium`}>{message}</p>
            )}
          </div>
        );

      case 'dots':
        return (
          <div className="flex flex-col items-center justify-center gap-3">
            <div className="flex items-center gap-2">
              <div className={`${sizes.dots} bg-blue-600 rounded-full animate-bounce`} style={{ animationDelay: '0ms' }}></div>
              <div className={`${sizes.dots} bg-blue-600 rounded-full animate-bounce`} style={{ animationDelay: '150ms' }}></div>
              <div className={`${sizes.dots} bg-blue-600 rounded-full animate-bounce`} style={{ animationDelay: '300ms' }}></div>
            </div>
            {message && (
              <p className={`${sizes.text} text-gray-600 font-medium`}>{message}</p>
            )}
          </div>
        );

      case 'skeleton':
        return (
          <div className="w-full space-y-2 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/5"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        );

      default:
        return null;
    }
  };

  if (fullScreen) {
    return (
      <div className={`fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50 ${className}`}>
        {renderLoader()}
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-center py-12 ${className}`}>
      {renderLoader()}
    </div>
  );
};

// Skeleton components for specific use cases
export const TableSkeleton: React.FC<{ rows?: number }> = ({ rows = 5 }) => (
  <div className="w-full space-y-3 animate-pulse">
    {/* Header */}
    <div className="flex gap-2 border-b border-gray-200 pb-3">
      <div className="h-4 bg-gray-300 rounded w-1/6"></div>
      <div className="h-4 bg-gray-300 rounded w-1/4"></div>
      <div className="h-4 bg-gray-300 rounded w-1/5"></div>
      <div className="h-4 bg-gray-300 rounded w-1/6"></div>
      <div className="h-4 bg-gray-300 rounded w-1/12"></div>
    </div>
    {/* Rows */}
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="flex gap-2 py-2">
        <div className="h-3 bg-gray-200 rounded w-1/6"></div>
        <div className="h-3 bg-gray-200 rounded w-1/4"></div>
        <div className="h-3 bg-gray-200 rounded w-1/5"></div>
        <div className="h-3 bg-gray-200 rounded w-1/6"></div>
        <div className="h-3 bg-gray-200 rounded w-1/12"></div>
      </div>
    ))}
  </div>
);

export const CardSkeleton: React.FC = () => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 animate-pulse">
    <div className="flex items-start justify-between mb-2">
      <div className="space-y-2 flex-1">
        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        <div className="h-8 bg-gray-300 rounded w-1/2"></div>
      </div>
      <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
    </div>
    <div className="h-3 bg-gray-200 rounded w-3/4"></div>
  </div>
);

export const ChartSkeleton: React.FC<{ height?: string }> = ({ height = 'h-64' }) => (
  <div className={`w-full ${height} bg-gray-100 rounded-lg animate-pulse flex items-end justify-around p-3`}>
    <div className="w-12 bg-gray-300 rounded-t" style={{ height: '60%' }}></div>
    <div className="w-12 bg-gray-300 rounded-t" style={{ height: '80%' }}></div>
    <div className="w-12 bg-gray-300 rounded-t" style={{ height: '40%' }}></div>
    <div className="w-12 bg-gray-300 rounded-t" style={{ height: '90%' }}></div>
    <div className="w-12 bg-gray-300 rounded-t" style={{ height: '70%' }}></div>
    <div className="w-12 bg-gray-300 rounded-t" style={{ height: '50%' }}></div>
  </div>
);

export default LoadingState;

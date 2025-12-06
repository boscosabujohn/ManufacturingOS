'use client';

import React, { ReactNode, useMemo } from 'react';

// ============================================================================
// Base Skeleton Component
// ============================================================================

export interface SkeletonProps {
  /** Width of the skeleton */
  width?: string | number;
  /** Height of the skeleton */
  height?: string | number;
  /** Border radius */
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  /** Animation type */
  animation?: 'pulse' | 'shimmer' | 'none';
  /** Custom className */
  className?: string;
}

const roundedClasses = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  full: 'rounded-full',
};

export function Skeleton({
  width,
  height,
  rounded = 'md',
  animation = 'shimmer',
  className = '',
}: SkeletonProps) {
  const style = useMemo(() => ({
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  }), [width, height]);

  const animationClass = animation === 'pulse'
    ? 'animate-pulse'
    : animation === 'shimmer'
      ? 'skeleton-shimmer'
      : '';

  return (
    <>
      <div
        className={`
          bg-gray-200 dark:bg-gray-700
          ${roundedClasses[rounded]}
          ${animationClass}
          ${className}
        `}
        style={style}
        aria-hidden="true"
      />
      {animation === 'shimmer' && (
        <style jsx global>{`
          @keyframes skeleton-shimmer {
            0% {
              background-position: -200% 0;
            }
            100% {
              background-position: 200% 0;
            }
          }

          .skeleton-shimmer {
            background: linear-gradient(
              90deg,
              rgb(229 231 235) 0%,
              rgb(243 244 246) 50%,
              rgb(229 231 235) 100%
            );
            background-size: 200% 100%;
            animation: skeleton-shimmer 1.5s ease-in-out infinite;
          }

          .dark .skeleton-shimmer {
            background: linear-gradient(
              90deg,
              rgb(55 65 81) 0%,
              rgb(75 85 99) 50%,
              rgb(55 65 81) 100%
            );
            background-size: 200% 100%;
          }
        `}</style>
      )}
    </>
  );
}

// ============================================================================
// Text Skeleton
// ============================================================================

export interface SkeletonTextProps {
  /** Number of lines */
  lines?: number;
  /** Width of last line (percentage or value) */
  lastLineWidth?: string;
  /** Line height */
  lineHeight?: string;
  /** Gap between lines */
  gap?: string;
  /** Animation type */
  animation?: 'pulse' | 'shimmer' | 'none';
  className?: string;
}

export function SkeletonText({
  lines = 3,
  lastLineWidth = '60%',
  lineHeight = '1rem',
  gap = '0.5rem',
  animation = 'shimmer',
  className = '',
}: SkeletonTextProps) {
  return (
    <div className={`space-y-2 ${className}`} style={{ gap }}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          width={i === lines - 1 ? lastLineWidth : '100%'}
          height={lineHeight}
          rounded="sm"
          animation={animation}
        />
      ))}
    </div>
  );
}

// ============================================================================
// Avatar Skeleton
// ============================================================================

export interface SkeletonAvatarProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  animation?: 'pulse' | 'shimmer' | 'none';
  className?: string;
}

const avatarSizes = {
  xs: 'w-6 h-6',
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-12 h-12',
  xl: 'w-16 h-16',
  '2xl': 'w-24 h-24',
};

export function SkeletonAvatar({
  size = 'md',
  animation = 'shimmer',
  className = '',
}: SkeletonAvatarProps) {
  return (
    <Skeleton
      className={`${avatarSizes[size]} ${className}`}
      rounded="full"
      animation={animation}
    />
  );
}

// ============================================================================
// Button Skeleton
// ============================================================================

export interface SkeletonButtonProps {
  size?: 'sm' | 'md' | 'lg';
  width?: string | number;
  animation?: 'pulse' | 'shimmer' | 'none';
  className?: string;
}

const buttonSizes = {
  sm: 'h-8',
  md: 'h-10',
  lg: 'h-12',
};

export function SkeletonButton({
  size = 'md',
  width = '100px',
  animation = 'shimmer',
  className = '',
}: SkeletonButtonProps) {
  return (
    <Skeleton
      width={width}
      className={`${buttonSizes[size]} ${className}`}
      rounded="lg"
      animation={animation}
    />
  );
}

// ============================================================================
// Card Skeleton
// ============================================================================

export interface SkeletonCardProps {
  showImage?: boolean;
  imageHeight?: string;
  showTitle?: boolean;
  showDescription?: boolean;
  descriptionLines?: number;
  showFooter?: boolean;
  animation?: 'pulse' | 'shimmer' | 'none';
  className?: string;
}

export function SkeletonCard({
  showImage = true,
  imageHeight = '200px',
  showTitle = true,
  showDescription = true,
  descriptionLines = 2,
  showFooter = false,
  animation = 'shimmer',
  className = '',
}: SkeletonCardProps) {
  return (
    <div
      className={`bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden ${className}`}
    >
      {/* Image */}
      {showImage && (
        <Skeleton
          width="100%"
          height={imageHeight}
          rounded="none"
          animation={animation}
        />
      )}

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Title */}
        {showTitle && (
          <Skeleton
            width="70%"
            height="1.5rem"
            rounded="md"
            animation={animation}
          />
        )}

        {/* Description */}
        {showDescription && (
          <SkeletonText lines={descriptionLines} animation={animation} />
        )}

        {/* Footer */}
        {showFooter && (
          <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
            <Skeleton width="80px" height="1rem" animation={animation} />
            <SkeletonButton size="sm" width="60px" animation={animation} />
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// Table Skeleton
// ============================================================================

export interface SkeletonTableProps {
  rows?: number;
  columns?: number;
  showHeader?: boolean;
  animation?: 'pulse' | 'shimmer' | 'none';
  className?: string;
}

export function SkeletonTable({
  rows = 5,
  columns = 4,
  showHeader = true,
  animation = 'shimmer',
  className = '',
}: SkeletonTableProps) {
  return (
    <div className={`overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 ${className}`}>
      <table className="w-full">
        {showHeader && (
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              {Array.from({ length: columns }).map((_, i) => (
                <th key={i} className="px-4 py-3">
                  <Skeleton
                    width={`${60 + Math.random() * 40}%`}
                    height="1rem"
                    animation={animation}
                  />
                </th>
              ))}
            </tr>
          </thead>
        )}
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <tr key={rowIndex}>
              {Array.from({ length: columns }).map((_, colIndex) => (
                <td key={colIndex} className="px-4 py-3">
                  <Skeleton
                    width={`${50 + Math.random() * 50}%`}
                    height="1rem"
                    animation={animation}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ============================================================================
// List Skeleton
// ============================================================================

export interface SkeletonListItemProps {
  showAvatar?: boolean;
  showSecondaryText?: boolean;
  showAction?: boolean;
  animation?: 'pulse' | 'shimmer' | 'none';
}

export function SkeletonListItem({
  showAvatar = true,
  showSecondaryText = true,
  showAction = false,
  animation = 'shimmer',
}: SkeletonListItemProps) {
  return (
    <div className="flex items-center gap-4 p-4">
      {showAvatar && <SkeletonAvatar size="md" animation={animation} />}
      <div className="flex-1 space-y-2">
        <Skeleton width="60%" height="1rem" animation={animation} />
        {showSecondaryText && (
          <Skeleton width="40%" height="0.875rem" animation={animation} />
        )}
      </div>
      {showAction && (
        <Skeleton width="32px" height="32px" rounded="md" animation={animation} />
      )}
    </div>
  );
}

export interface SkeletonListProps {
  items?: number;
  showAvatar?: boolean;
  showSecondaryText?: boolean;
  showAction?: boolean;
  showDividers?: boolean;
  animation?: 'pulse' | 'shimmer' | 'none';
  className?: string;
}

export function SkeletonList({
  items = 5,
  showAvatar = true,
  showSecondaryText = true,
  showAction = false,
  showDividers = true,
  animation = 'shimmer',
  className = '',
}: SkeletonListProps) {
  return (
    <div
      className={`bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden ${className}`}
    >
      {Array.from({ length: items }).map((_, i) => (
        <div
          key={i}
          className={showDividers && i > 0 ? 'border-t border-gray-200 dark:border-gray-700' : ''}
        >
          <SkeletonListItem
            showAvatar={showAvatar}
            showSecondaryText={showSecondaryText}
            showAction={showAction}
            animation={animation}
          />
        </div>
      ))}
    </div>
  );
}

// ============================================================================
// Form Skeleton
// ============================================================================

export interface SkeletonFormFieldProps {
  showLabel?: boolean;
  inputHeight?: string;
  animation?: 'pulse' | 'shimmer' | 'none';
  className?: string;
}

export function SkeletonFormField({
  showLabel = true,
  inputHeight = '40px',
  animation = 'shimmer',
  className = '',
}: SkeletonFormFieldProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      {showLabel && (
        <Skeleton width="30%" height="1rem" animation={animation} />
      )}
      <Skeleton width="100%" height={inputHeight} rounded="lg" animation={animation} />
    </div>
  );
}

export interface SkeletonFormProps {
  fields?: number;
  showSubmitButton?: boolean;
  animation?: 'pulse' | 'shimmer' | 'none';
  className?: string;
}

export function SkeletonForm({
  fields = 4,
  showSubmitButton = true,
  animation = 'shimmer',
  className = '',
}: SkeletonFormProps) {
  return (
    <div className={`space-y-4 ${className}`}>
      {Array.from({ length: fields }).map((_, i) => (
        <SkeletonFormField key={i} animation={animation} />
      ))}
      {showSubmitButton && (
        <div className="pt-4">
          <SkeletonButton size="lg" width="120px" animation={animation} />
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Dashboard Skeleton
// ============================================================================

export interface SkeletonDashboardProps {
  showStats?: boolean;
  statsCount?: number;
  showChart?: boolean;
  showTable?: boolean;
  animation?: 'pulse' | 'shimmer' | 'none';
  className?: string;
}

export function SkeletonDashboard({
  showStats = true,
  statsCount = 4,
  showChart = true,
  showTable = true,
  animation = 'shimmer',
  className = '',
}: SkeletonDashboardProps) {
  return (
    <div className={`space-y-6 ${className}`}>
      {/* Stats row */}
      {showStats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: statsCount }).map((_, i) => (
            <div
              key={i}
              className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-4"
            >
              <Skeleton width="40%" height="0.875rem" animation={animation} className="mb-2" />
              <Skeleton width="60%" height="2rem" animation={animation} />
            </div>
          ))}
        </div>
      )}

      {/* Chart */}
      {showChart && (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
          <Skeleton width="30%" height="1.5rem" animation={animation} className="mb-4" />
          <Skeleton width="100%" height="300px" rounded="lg" animation={animation} />
        </div>
      )}

      {/* Table */}
      {showTable && <SkeletonTable animation={animation} />}
    </div>
  );
}

// ============================================================================
// Page Skeleton
// ============================================================================

export interface SkeletonPageProps {
  showHeader?: boolean;
  showSidebar?: boolean;
  sidebarWidth?: string;
  animation?: 'pulse' | 'shimmer' | 'none';
  children?: ReactNode;
  className?: string;
}

export function SkeletonPage({
  showHeader = true,
  showSidebar = true,
  sidebarWidth = '250px',
  animation = 'shimmer',
  children,
  className = '',
}: SkeletonPageProps) {
  return (
    <div className={`min-h-screen bg-gray-100 dark:bg-gray-950 ${className}`}>
      {/* Header */}
      {showHeader && (
        <header className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 flex items-center justify-between">
          <Skeleton width="150px" height="2rem" animation={animation} />
          <div className="flex items-center gap-4">
            <Skeleton width="200px" height="2.5rem" rounded="lg" animation={animation} />
            <SkeletonAvatar size="md" animation={animation} />
          </div>
        </header>
      )}

      <div className="flex">
        {/* Sidebar */}
        {showSidebar && (
          <aside
            className="bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 p-4 space-y-4"
            style={{ width: sidebarWidth }}
          >
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton width="24px" height="24px" rounded="md" animation={animation} />
                <Skeleton width="70%" height="1rem" animation={animation} />
              </div>
            ))}
          </aside>
        )}

        {/* Main content */}
        <main className="flex-1 p-6">
          {children || <SkeletonDashboard animation={animation} />}
        </main>
      </div>
    </div>
  );
}

// ============================================================================
// Conditional Skeleton Wrapper
// ============================================================================

export interface SkeletonWrapperProps {
  loading: boolean;
  skeleton: ReactNode;
  children: ReactNode;
  minDisplayTime?: number;
}

export function SkeletonWrapper({
  loading,
  skeleton,
  children,
  minDisplayTime = 0,
}: SkeletonWrapperProps) {
  const [showSkeleton, setShowSkeleton] = React.useState(loading);

  React.useEffect(() => {
    if (loading) {
      setShowSkeleton(true);
    } else if (minDisplayTime > 0) {
      const timer = setTimeout(() => setShowSkeleton(false), minDisplayTime);
      return () => clearTimeout(timer);
    } else {
      setShowSkeleton(false);
    }
  }, [loading, minDisplayTime]);

  return <>{showSkeleton ? skeleton : children}</>;
}

export type {
  SkeletonProps,
  SkeletonTextProps,
  SkeletonAvatarProps,
  SkeletonButtonProps,
  SkeletonCardProps,
  SkeletonTableProps,
  SkeletonListItemProps,
  SkeletonListProps,
  SkeletonFormFieldProps,
  SkeletonFormProps,
  SkeletonDashboardProps,
  SkeletonPageProps,
  SkeletonWrapperProps,
};

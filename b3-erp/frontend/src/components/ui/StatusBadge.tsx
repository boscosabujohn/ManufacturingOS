import React from 'react';
import { CheckCircle, Clock, AlertCircle, XCircle, Hammer } from 'lucide-react';

export type BadgeStatus = 'implemented' | 'in-progress' | 'in_progress' | 'planned' | 'deprecated' | 'coming-soon' | 'active' | 'inactive' | 'pending' | 'approved' | 'rejected' | 'draft' | 'error' | 'success' | 'warning' | 'cancelled' | 'withdrawn' | 'on_hold' | 'on_leave' | 'upcoming' | 'completed' | 'excellent' | 'good' | 'average' | 'needs_improvement' | 'ongoing' | 'review_due' | 'confirmed' | 'extended' | 'terminated' | 'expiring_soon' | 'expired' | 'renewed' | 'present' | 'absent' | 'late' | 'half_day' | 'week_off';

export interface StatusBadgeProps {
  status: BadgeStatus;
  label?: string;
  text?: string; // Alternative to label for backward compatibility
  size?: 'sm' | 'md';
  showIcon?: boolean;
  className?: string;
}

const statusConfig = {
  implemented: {
    label: 'Live',
    icon: CheckCircle,
    className: 'bg-green-100 text-green-700 border-green-200',
    iconClassName: 'text-green-600'
  },
  'in-progress': {
    label: 'In Progress',
    icon: Hammer,
    className: 'bg-blue-100 text-blue-700 border-blue-200',
    iconClassName: 'text-blue-600'
  },
  in_progress: {
    label: 'In Progress',
    icon: Hammer,
    className: 'bg-blue-100 text-blue-700 border-blue-200',
    iconClassName: 'text-blue-600'
  },
  planned: {
    label: 'Planned',
    icon: Clock,
    className: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    iconClassName: 'text-yellow-600'
  },
  deprecated: {
    label: 'Deprecated',
    icon: AlertCircle,
    className: 'bg-gray-100 text-gray-700 border-gray-200',
    iconClassName: 'text-gray-600'
  },
  'coming-soon': {
    label: 'Coming Soon',
    icon: Clock,
    className: 'bg-purple-100 text-purple-700 border-purple-200',
    iconClassName: 'text-purple-600'
  },
  active: {
    label: 'Active',
    icon: CheckCircle,
    className: 'bg-green-100 text-green-700 border-green-200',
    iconClassName: 'text-green-600'
  },
  inactive: {
    label: 'Inactive',
    icon: XCircle,
    className: 'bg-gray-100 text-gray-700 border-gray-200',
    iconClassName: 'text-gray-600'
  },
  pending: {
    label: 'Pending',
    icon: Clock,
    className: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    iconClassName: 'text-yellow-600'
  },
  approved: {
    label: 'Approved',
    icon: CheckCircle,
    className: 'bg-green-100 text-green-700 border-green-200',
    iconClassName: 'text-green-600'
  },
  completed: {
    label: 'Completed',
    icon: CheckCircle,
    className: 'bg-green-100 text-green-700 border-green-200',
    iconClassName: 'text-green-600'
  },
  rejected: {
    label: 'Rejected',
    icon: XCircle,
    className: 'bg-red-100 text-red-700 border-red-200',
    iconClassName: 'text-red-600'
  },
  draft: {
    label: 'Draft',
    icon: Clock,
    className: 'bg-gray-100 text-gray-700 border-gray-200',
    iconClassName: 'text-gray-600'
  },
  error: {
    label: 'Error',
    icon: XCircle,
    className: 'bg-red-100 text-red-700 border-red-200',
    iconClassName: 'text-red-600'
  },
  success: {
    label: 'Success',
    icon: CheckCircle,
    className: 'bg-green-100 text-green-700 border-green-200',
    iconClassName: 'text-green-600'
  },
  warning: {
    label: 'Warning',
    icon: AlertCircle,
    className: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    iconClassName: 'text-yellow-600'
  },
  cancelled: {
    label: 'Cancelled',
    icon: XCircle,
    className: 'bg-gray-100 text-gray-700 border-gray-200',
    iconClassName: 'text-gray-600'
  },
  withdrawn: {
    label: 'Withdrawn',
    icon: XCircle,
    className: 'bg-gray-100 text-gray-700 border-gray-200',
    iconClassName: 'text-gray-600'
  },
  on_hold: {
    label: 'On Hold',
    icon: Clock,
    className: 'bg-orange-100 text-orange-700 border-orange-200',
    iconClassName: 'text-orange-600'
  },
  on_leave: {
    label: 'On Leave',
    icon: AlertCircle,
    className: 'bg-purple-100 text-purple-700 border-purple-200',
    iconClassName: 'text-purple-600'
  },
  upcoming: {
    label: 'Upcoming',
    icon: Clock,
    className: 'bg-blue-100 text-blue-700 border-blue-200',
    iconClassName: 'text-blue-600'
  },
  excellent: {
    label: 'Excellent',
    icon: CheckCircle,
    className: 'bg-green-100 text-green-700 border-green-200',
    iconClassName: 'text-green-600'
  },
  good: {
    label: 'Good',
    icon: CheckCircle,
    className: 'bg-blue-100 text-blue-700 border-blue-200',
    iconClassName: 'text-blue-600'
  },
  average: {
    label: 'Average',
    icon: AlertCircle,
    className: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    iconClassName: 'text-yellow-600'
  },
  needs_improvement: {
    label: 'Needs Improvement',
    icon: AlertCircle,
    className: 'bg-orange-100 text-orange-700 border-orange-200',
    iconClassName: 'text-orange-600'
  },
  ongoing: {
    label: 'Ongoing',
    icon: Clock,
    className: 'bg-blue-100 text-blue-700 border-blue-200',
    iconClassName: 'text-blue-600'
  },
  review_due: {
    label: 'Review Due',
    icon: AlertCircle,
    className: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    iconClassName: 'text-yellow-600'
  },
  confirmed: {
    label: 'Confirmed',
    icon: CheckCircle,
    className: 'bg-green-100 text-green-700 border-green-200',
    iconClassName: 'text-green-600'
  },
  extended: {
    label: 'Extended',
    icon: Clock,
    className: 'bg-orange-100 text-orange-700 border-orange-200',
    iconClassName: 'text-orange-600'
  },
  terminated: {
    label: 'Terminated',
    icon: XCircle,
    className: 'bg-red-100 text-red-700 border-red-200',
    iconClassName: 'text-red-600'
  },
  expiring_soon: {
    label: 'Expiring Soon',
    icon: AlertCircle,
    className: 'bg-orange-100 text-orange-700 border-orange-200',
    iconClassName: 'text-orange-600'
  },
  expired: {
    label: 'Expired',
    icon: XCircle,
    className: 'bg-red-100 text-red-700 border-red-200',
    iconClassName: 'text-red-600'
  },
  renewed: {
    label: 'Renewed',
    icon: CheckCircle,
    className: 'bg-blue-100 text-blue-700 border-blue-200',
    iconClassName: 'text-blue-600'
  },
  present: {
    label: 'Present',
    icon: CheckCircle,
    className: 'bg-green-100 text-green-700 border-green-200',
    iconClassName: 'text-green-600'
  },
  absent: {
    label: 'Absent',
    icon: XCircle,
    className: 'bg-red-100 text-red-700 border-red-200',
    iconClassName: 'text-red-600'
  },
  late: {
    label: 'Late',
    icon: Clock,
    className: 'bg-orange-100 text-orange-700 border-orange-200',
    iconClassName: 'text-orange-600'
  },
  half_day: {
    label: 'Half Day',
    icon: Clock,
    className: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    iconClassName: 'text-yellow-600'
  },
  week_off: {
    label: 'Week Off',
    icon: AlertCircle,
    className: 'bg-gray-100 text-gray-700 border-gray-200',
    iconClassName: 'text-gray-600'
  }
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  label,
  text,
  size = 'sm',
  showIcon = true,
  className = ''
}) => {
  const config = statusConfig[status];
  const Icon = config.icon;

  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm';

  return (
    <span
      className={`
        inline-flex items-center gap-1 rounded-full font-medium border
        ${sizeClasses}
        ${config.className}
        ${className}
      `}
    >
      {showIcon && <Icon className={`w-3 h-3 ${config.iconClassName}`} />}
      {text || label || config.label}
    </span>
  );
};

// Helper function to detect if a link is placeholder
export const isPlaceholderLink = (href: string): boolean => {
  return !href || href === '#' || href === '' || href.startsWith('#');
};

// Helper component for navigation items with status
export interface NavItemWithStatusProps {
  children: React.ReactNode;
  href: string;
  showStatusBadges?: boolean;
  className?: string;
  onClick?: () => void;
}

export const NavItemWithStatus: React.FC<NavItemWithStatusProps> = ({
  children,
  href,
  showStatusBadges = true,
  className = '',
  onClick
}) => {
  const isPlaceholder = isPlaceholderLink(href);

  if (isPlaceholder) {
    return (
      <div className={`relative group ${className}`}>
        <span className="cursor-not-allowed opacity-60">
          {children}
        </span>
        {showStatusBadges && (
          <StatusBadge
            status="coming-soon"
            size="sm"
            className="ml-2"
          />
        )}
        {/* Tooltip on hover */}
        <div className="invisible group-hover:visible absolute left-full ml-2 top-1/2 -translate-y-1/2 z-50 whitespace-nowrap">
          <div className="bg-gray-900 text-white text-xs rounded px-2 py-1">
            Feature coming soon
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={className} onClick={onClick}>
      {children}
    </div>
  );
};

export default StatusBadge;

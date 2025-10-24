import React, { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

export interface KPICardProps {
  title: string;
  value: string | number;
  icon?: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
    label?: string;
  };
  description?: string;
  color?: 'blue' | 'green' | 'red' | 'yellow' | 'purple' | 'indigo' | 'cyan' | 'gray';
  loading?: boolean;
  onClick?: () => void;
  className?: string;
  children?: ReactNode;
}

const colorVariants = {
  blue: {
    bg: 'bg-blue-50',
    icon: 'text-blue-600',
    border: 'border-blue-200',
    hover: 'hover:bg-blue-100'
  },
  green: {
    bg: 'bg-green-50',
    icon: 'text-green-600',
    border: 'border-green-200',
    hover: 'hover:bg-green-100'
  },
  red: {
    bg: 'bg-red-50',
    icon: 'text-red-600',
    border: 'border-red-200',
    hover: 'hover:bg-red-100'
  },
  yellow: {
    bg: 'bg-yellow-50',
    icon: 'text-yellow-600',
    border: 'border-yellow-200',
    hover: 'hover:bg-yellow-100'
  },
  purple: {
    bg: 'bg-purple-50',
    icon: 'text-purple-600',
    border: 'border-purple-200',
    hover: 'hover:bg-purple-100'
  },
  indigo: {
    bg: 'bg-indigo-50',
    icon: 'text-indigo-600',
    border: 'border-indigo-200',
    hover: 'hover:bg-indigo-100'
  },
  cyan: {
    bg: 'bg-cyan-50',
    icon: 'text-cyan-600',
    border: 'border-cyan-200',
    hover: 'hover:bg-cyan-100'
  },
  gray: {
    bg: 'bg-gray-50',
    icon: 'text-gray-600',
    border: 'border-gray-200',
    hover: 'hover:bg-gray-100'
  }
};

export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  icon: Icon,
  trend,
  description,
  color = 'blue',
  loading = false,
  onClick,
  className = '',
  children
}) => {
  const colors = colorVariants[color];
  const isClickable = !!onClick;

  return (
    <div
      className={`
        bg-white rounded-lg shadow-sm border border-gray-200 p-6
        transition-all duration-200
        ${isClickable ? `cursor-pointer ${colors.hover}` : ''}
        ${className}
      `}
      onClick={onClick}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onKeyDown={isClickable ? (e) => e.key === 'Enter' && onClick() : undefined}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>

          {loading ? (
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-24 mb-2"></div>
              {description && <div className="h-4 bg-gray-200 rounded w-32"></div>}
            </div>
          ) : (
            <>
              <p className="text-3xl font-bold text-gray-900 mb-1">
                {typeof value === 'number' ? value.toLocaleString() : value}
              </p>

              {trend && (
                <div className="flex items-center gap-1 mb-2">
                  <span className={`text-sm font-medium ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                    {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
                  </span>
                  {trend.label && (
                    <span className="text-xs text-gray-500">{trend.label}</span>
                  )}
                </div>
              )}

              {description && (
                <p className="text-sm text-gray-600">{description}</p>
              )}
            </>
          )}
        </div>

        {Icon && (
          <div className={`p-3 rounded-lg ${colors.bg}`}>
            <Icon className={`w-6 h-6 ${colors.icon}`} />
          </div>
        )}
      </div>

      {children && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          {children}
        </div>
      )}
    </div>
  );
};

export default KPICard;

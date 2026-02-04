import React, { ReactNode } from 'react';
import { LucideIcon, Inbox } from 'lucide-react';

export interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    icon?: LucideIcon;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
  children?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

const sizeVariants = {
  sm: {
    container: 'py-8',
    icon: 'w-12 h-12',
    title: 'text-lg',
    description: 'text-sm'
  },
  md: {
    container: 'py-12',
    icon: 'w-16 h-16',
    title: 'text-xl',
    description: 'text-base'
  },
  lg: {
    container: 'py-16',
    icon: 'w-20 h-20',
    title: 'text-2xl',
    description: 'text-lg'
  }
};

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = Inbox,
  title,
  description,
  action,
  secondaryAction,
  className = '',
  children,
  size = 'md'
}) => {
  const sizes = sizeVariants[size];
  const ActionIcon = action?.icon;

  return (
    <div className={`flex flex-col items-center justify-center text-center ${sizes.container} ${className}`}>
      {/* Icon */}
      <div className="mb-2 p-3 rounded-full bg-gray-100">
        <Icon className={`${sizes.icon} text-gray-400`} />
      </div>

      {/* Title */}
      <h3 className={`${sizes.title} font-semibold text-gray-900 mb-2`}>
        {title}
      </h3>

      {/* Description */}
      {description && (
        <p className={`${sizes.description} text-gray-600 mb-3 max-w-md`}>
          {description}
        </p>
      )}

      {/* Actions */}
      {(action || secondaryAction) && (
        <div className="flex items-center gap-3">
          {action && (
            <button
              onClick={action.onClick}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              {ActionIcon && <ActionIcon className="w-4 h-4" />}
              {action.label}
            </button>
          )}

          {secondaryAction && (
            <button
              onClick={secondaryAction.onClick}
              className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
            >
              {secondaryAction.label}
            </button>
          )}
        </div>
      )}

      {/* Custom content */}
      {children && (
        <div className="mt-6 w-full max-w-2xl">
          {children}
        </div>
      )}
    </div>
  );
};

export default EmptyState;

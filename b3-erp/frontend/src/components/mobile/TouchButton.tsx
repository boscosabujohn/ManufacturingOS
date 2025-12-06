'use client';

import React, { forwardRef, useState, useCallback } from 'react';
import { Loader2 } from 'lucide-react';

// Types
export type TouchButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type TouchButtonSize = 'sm' | 'md' | 'lg' | 'xl';

export interface TouchButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: TouchButtonVariant;
  size?: TouchButtonSize;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  fullWidth?: boolean;
  rounded?: boolean;
  hapticFeedback?: boolean;
  touchScale?: boolean;
}

// Minimum touch target size (44x44px as per WCAG guidelines)
const MIN_TOUCH_SIZE = 44;

// Size configurations
const sizeConfig: Record<TouchButtonSize, { height: number; padding: string; fontSize: string; iconSize: string }> = {
  sm: { height: 44, padding: 'px-4', fontSize: 'text-sm', iconSize: 'w-4 h-4' },
  md: { height: 48, padding: 'px-5', fontSize: 'text-base', iconSize: 'w-5 h-5' },
  lg: { height: 52, padding: 'px-6', fontSize: 'text-lg', iconSize: 'w-5 h-5' },
  xl: { height: 56, padding: 'px-8', fontSize: 'text-lg', iconSize: 'w-6 h-6' },
};

// Variant configurations
const variantConfig: Record<TouchButtonVariant, string> = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 disabled:bg-blue-400',
  secondary: 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 active:bg-gray-300 dark:active:bg-gray-600',
  outline: 'bg-transparent border-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 active:bg-gray-200 dark:active:bg-gray-700',
  ghost: 'bg-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 active:bg-gray-200 dark:active:bg-gray-700',
  danger: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 disabled:bg-red-400',
};

export const TouchButton = forwardRef<HTMLButtonElement, TouchButtonProps>(({
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  loading = false,
  fullWidth = false,
  rounded = false,
  hapticFeedback = true,
  touchScale = true,
  children,
  className = '',
  disabled,
  onClick,
  ...props
}, ref) => {
  const [isPressed, setIsPressed] = useState(false);

  const config = sizeConfig[size];
  const variantClasses = variantConfig[variant];

  // Handle touch/click with optional haptic feedback
  const handleClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || loading) return;

    // Trigger haptic feedback if available and enabled
    if (hapticFeedback && 'vibrate' in navigator) {
      navigator.vibrate(10);
    }

    onClick?.(e);
  }, [disabled, loading, hapticFeedback, onClick]);

  // Touch handlers for press animation
  const handleTouchStart = useCallback(() => {
    if (touchScale && !disabled && !loading) {
      setIsPressed(true);
    }
  }, [touchScale, disabled, loading]);

  const handleTouchEnd = useCallback(() => {
    setIsPressed(false);
  }, []);

  return (
    <button
      ref={ref}
      onClick={handleClick}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleTouchStart}
      onMouseUp={handleTouchEnd}
      onMouseLeave={handleTouchEnd}
      disabled={disabled || loading}
      className={`
        relative inline-flex items-center justify-center gap-2 font-medium
        transition-all duration-150 select-none
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        disabled:cursor-not-allowed disabled:opacity-60
        ${variantClasses}
        ${config.padding} ${config.fontSize}
        ${fullWidth ? 'w-full' : ''}
        ${rounded ? 'rounded-full' : 'rounded-xl'}
        ${touchScale && isPressed ? 'scale-95' : 'scale-100'}
        ${className}
      `}
      style={{ minHeight: config.height, minWidth: MIN_TOUCH_SIZE }}
      {...props}
    >
      {loading ? (
        <Loader2 className={`${config.iconSize} animate-spin`} />
      ) : icon && iconPosition === 'left' ? (
        <span className={config.iconSize}>{icon}</span>
      ) : null}

      {children && <span>{children}</span>}

      {!loading && icon && iconPosition === 'right' && (
        <span className={config.iconSize}>{icon}</span>
      )}
    </button>
  );
});

TouchButton.displayName = 'TouchButton';

// Icon-only button with proper touch target
export interface TouchIconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  variant?: TouchButtonVariant;
  size?: TouchButtonSize;
  label: string; // Required for accessibility
  loading?: boolean;
  badge?: number | string;
  badgeColor?: 'red' | 'blue' | 'green' | 'yellow';
}

export const TouchIconButton = forwardRef<HTMLButtonElement, TouchIconButtonProps>(({
  icon,
  variant = 'ghost',
  size = 'md',
  label,
  loading = false,
  badge,
  badgeColor = 'red',
  className = '',
  disabled,
  onClick,
  ...props
}, ref) => {
  const config = sizeConfig[size];

  const badgeColors = {
    red: 'bg-red-500',
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
  };

  const handleClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || loading) return;

    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }

    onClick?.(e);
  }, [disabled, loading, onClick]);

  return (
    <button
      ref={ref}
      onClick={handleClick}
      disabled={disabled || loading}
      aria-label={label}
      title={label}
      className={`
        relative inline-flex items-center justify-center
        transition-all duration-150 rounded-xl
        focus:outline-none focus:ring-2 focus:ring-blue-500
        active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed
        ${variantConfig[variant]}
        ${className}
      `}
      style={{ minHeight: config.height, minWidth: config.height }}
      {...props}
    >
      {loading ? (
        <Loader2 className={`${config.iconSize} animate-spin`} />
      ) : (
        <span className={config.iconSize}>{icon}</span>
      )}

      {badge !== undefined && (
        <span className={`absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 flex items-center justify-center text-xs font-bold text-white rounded-full ${badgeColors[badgeColor]}`}>
          {badge}
        </span>
      )}
    </button>
  );
});

TouchIconButton.displayName = 'TouchIconButton';

// Floating Action Button (FAB)
export interface FABProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  label: string;
  position?: 'bottom-right' | 'bottom-left' | 'bottom-center';
  extended?: boolean;
  size?: 'md' | 'lg';
}

export const FAB = forwardRef<HTMLButtonElement, FABProps>(({
  icon,
  label,
  position = 'bottom-right',
  extended = false,
  size = 'lg',
  className = '',
  onClick,
  ...props
}, ref) => {
  const positionClasses = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'bottom-center': 'bottom-6 left-1/2 -translate-x-1/2',
  };

  const sizeClasses = {
    md: 'w-14 h-14',
    lg: 'w-16 h-16',
  };

  const handleClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    if ('vibrate' in navigator) {
      navigator.vibrate(15);
    }
    onClick?.(e);
  }, [onClick]);

  return (
    <button
      ref={ref}
      onClick={handleClick}
      aria-label={label}
      className={`
        fixed z-40 ${positionClasses[position]}
        ${extended ? 'px-6 h-14 rounded-full' : `${sizeClasses[size]} rounded-full`}
        bg-blue-600 text-white shadow-lg
        hover:bg-blue-700 active:bg-blue-800 active:scale-95
        transition-all duration-150
        flex items-center justify-center gap-2
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        ${className}
      `}
      {...props}
    >
      <span className="w-6 h-6">{icon}</span>
      {extended && <span className="font-medium">{label}</span>}
    </button>
  );
});

FAB.displayName = 'FAB';

// Touch-friendly link
export interface TouchLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  icon?: React.ReactNode;
  active?: boolean;
}

export const TouchLink = forwardRef<HTMLAnchorElement, TouchLinkProps>(({
  icon,
  active = false,
  children,
  className = '',
  ...props
}, ref) => {
  return (
    <a
      ref={ref}
      className={`
        flex items-center gap-3 px-4 py-3 rounded-xl
        transition-colors duration-150
        active:bg-gray-100 dark:active:bg-gray-800
        ${active
          ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 font-medium'
          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
        }
        ${className}
      `}
      style={{ minHeight: MIN_TOUCH_SIZE }}
      {...props}
    >
      {icon && <span className="w-5 h-5">{icon}</span>}
      <span className="flex-1">{children}</span>
    </a>
  );
});

TouchLink.displayName = 'TouchLink';

// Touch-friendly list item
export interface TouchListItemProps {
  icon?: React.ReactNode;
  title: string;
  subtitle?: string;
  trailing?: React.ReactNode;
  onClick?: () => void;
  active?: boolean;
  disabled?: boolean;
  className?: string;
}

export function TouchListItem({
  icon,
  title,
  subtitle,
  trailing,
  onClick,
  active = false,
  disabled = false,
  className = '',
}: TouchListItemProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        w-full flex items-center gap-4 px-4 py-3
        transition-colors duration-150
        disabled:opacity-50 disabled:cursor-not-allowed
        ${active
          ? 'bg-blue-50 dark:bg-blue-900/20'
          : 'hover:bg-gray-50 dark:hover:bg-gray-800 active:bg-gray-100 dark:active:bg-gray-700'
        }
        ${className}
      `}
      style={{ minHeight: MIN_TOUCH_SIZE }}
    >
      {icon && (
        <span className={`w-10 h-10 flex items-center justify-center rounded-full ${
          active ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
        }`}>
          {icon}
        </span>
      )}
      <div className="flex-1 text-left min-w-0">
        <p className={`font-medium truncate ${active ? 'text-blue-600' : 'text-gray-900 dark:text-white'}`}>
          {title}
        </p>
        {subtitle && (
          <p className="text-sm text-gray-500 truncate">{subtitle}</p>
        )}
      </div>
      {trailing}
    </button>
  );
}

export type { TouchButtonProps as TouchButtonPropsType };

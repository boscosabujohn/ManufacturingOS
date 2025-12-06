'use client';

import * as React from 'react';
import { Loader2 } from 'lucide-react';

export interface TouchButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'icon' | 'icon-lg';
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

/**
 * TouchButton - A touch-friendly button component with minimum 44x44px touch targets
 * Designed for mobile and tablet interfaces, including shop floor use
 */
const TouchButton = React.forwardRef<HTMLButtonElement, TouchButtonProps>(
  (
    {
      className,
      variant = 'default',
      size = 'md',
      loading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles = `
      inline-flex items-center justify-center gap-2
      font-medium rounded-xl
      transition-all duration-200 ease-out
      focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
      disabled:opacity-50 disabled:cursor-not-allowed
      active:scale-[0.98] active:brightness-95
      select-none touch-manipulation
    `.replace(/\s+/g, ' ').trim();

    const variants: Record<string, string> = {
      default: 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus-visible:ring-gray-500',
      primary: 'bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500 shadow-sm',
      secondary: 'bg-indigo-600 text-white hover:bg-indigo-700 focus-visible:ring-indigo-500 shadow-sm',
      outline: 'border-2 border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-400 focus-visible:ring-gray-500',
      ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 focus-visible:ring-gray-500',
      danger: 'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500 shadow-sm',
      success: 'bg-green-600 text-white hover:bg-green-700 focus-visible:ring-green-500 shadow-sm',
    };

    // All sizes ensure minimum 44px touch target
    const sizes: Record<string, string> = {
      sm: 'min-h-[44px] min-w-[44px] px-4 py-2 text-sm',
      md: 'min-h-[48px] min-w-[48px] px-5 py-2.5 text-base',
      lg: 'min-h-[52px] min-w-[52px] px-6 py-3 text-lg',
      xl: 'min-h-[60px] min-w-[60px] px-8 py-4 text-xl', // Extra large for shop floor
      icon: 'min-h-[44px] min-w-[44px] w-11 h-11 p-2',
      'icon-lg': 'min-h-[56px] min-w-[56px] w-14 h-14 p-3', // Large icon for shop floor
    };

    const widthClass = fullWidth ? 'w-full' : '';

    return (
      <button
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass} ${className || ''}`}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Loading...</span>
          </>
        ) : (
          <>
            {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

TouchButton.displayName = 'TouchButton';

/**
 * IconButton - A touch-friendly icon-only button
 */
export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'primary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  label: string; // Required for accessibility
}

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, variant = 'ghost', size = 'md', label, children, ...props }, ref) => {
    const baseStyles = `
      inline-flex items-center justify-center
      rounded-full
      transition-all duration-200 ease-out
      focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
      disabled:opacity-50 disabled:cursor-not-allowed
      active:scale-95
      select-none touch-manipulation
    `.replace(/\s+/g, ' ').trim();

    const variants: Record<string, string> = {
      default: 'bg-gray-100 text-gray-700 hover:bg-gray-200 focus-visible:ring-gray-500',
      primary: 'bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500',
      outline: 'border-2 border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus-visible:ring-gray-500',
      ghost: 'bg-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus-visible:ring-gray-500',
      danger: 'bg-red-100 text-red-600 hover:bg-red-200 focus-visible:ring-red-500',
    };

    // All sizes ensure minimum 44px touch target
    const sizes: Record<string, string> = {
      sm: 'min-h-[44px] min-w-[44px] w-11 h-11',
      md: 'min-h-[48px] min-w-[48px] w-12 h-12',
      lg: 'min-h-[56px] min-w-[56px] w-14 h-14', // For shop floor
    };

    return (
      <button
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className || ''}`}
        ref={ref}
        aria-label={label}
        title={label}
        {...props}
      >
        {children}
      </button>
    );
  }
);

IconButton.displayName = 'IconButton';

/**
 * FloatingActionButton - A prominent floating action button for primary actions
 */
export interface FABProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'md' | 'lg';
  position?: 'bottom-right' | 'bottom-center' | 'bottom-left';
  label: string;
  extended?: boolean;
}

const FloatingActionButton = React.forwardRef<HTMLButtonElement, FABProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'lg',
      position = 'bottom-right',
      label,
      extended = false,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles = `
      fixed z-50
      inline-flex items-center justify-center gap-2
      font-semibold
      shadow-lg hover:shadow-xl
      transition-all duration-200 ease-out
      focus:outline-none focus-visible:ring-4 focus-visible:ring-offset-2
      disabled:opacity-50 disabled:cursor-not-allowed
      active:scale-95
      select-none touch-manipulation
    `.replace(/\s+/g, ' ').trim();

    const variants: Record<string, string> = {
      primary: 'bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-300',
      secondary: 'bg-indigo-600 text-white hover:bg-indigo-700 focus-visible:ring-indigo-300',
      danger: 'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-300',
    };

    const positions: Record<string, string> = {
      'bottom-right': 'bottom-20 right-4 sm:bottom-6 sm:right-6',
      'bottom-center': 'bottom-20 left-1/2 -translate-x-1/2 sm:bottom-6',
      'bottom-left': 'bottom-20 left-4 sm:bottom-6 sm:left-6',
    };

    const sizes: Record<string, string> = {
      md: extended ? 'h-12 px-5 rounded-full' : 'w-14 h-14 rounded-full',
      lg: extended ? 'h-16 px-6 rounded-full text-lg' : 'w-16 h-16 rounded-full',
    };

    return (
      <button
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${positions[position]} ${className || ''}`}
        ref={ref}
        aria-label={label}
        {...props}
      >
        {children}
        {extended && <span>{label}</span>}
      </button>
    );
  }
);

FloatingActionButton.displayName = 'FloatingActionButton';

export { TouchButton, IconButton, FloatingActionButton };
export default TouchButton;

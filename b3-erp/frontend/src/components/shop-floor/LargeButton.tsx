'use client';

import React, { forwardRef, ReactNode, ButtonHTMLAttributes } from 'react';
import {
  Check,
  X,
  Play,
  Pause,
  Square,
  AlertTriangle,
  RefreshCw,
  Package,
  Clipboard,
  Wrench,
  ArrowLeft,
  ArrowRight,
  Plus,
  Minus,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';

// Large button sizes optimized for gloved hands
// Minimum 64px for industrial use (larger than standard 44px)
export type LargeButtonSize = 'lg' | 'xl' | '2xl';
export type LargeButtonVariant =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'danger'
  | 'warning'
  | 'info'
  | 'ghost';

export interface LargeButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: LargeButtonVariant;
  size?: LargeButtonSize;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right' | 'top';
  loading?: boolean;
  fullWidth?: boolean;
  hapticFeedback?: boolean;
  children?: ReactNode;
}

const sizeClasses: Record<LargeButtonSize, string> = {
  lg: 'min-h-[64px] min-w-[64px] px-6 py-4 text-lg',
  xl: 'min-h-[80px] min-w-[80px] px-8 py-5 text-xl',
  '2xl': 'min-h-[96px] min-w-[96px] px-10 py-6 text-2xl',
};

const iconSizeClasses: Record<LargeButtonSize, string> = {
  lg: 'w-6 h-6',
  xl: 'w-8 h-8',
  '2xl': 'w-10 h-10',
};

const variantClasses: Record<LargeButtonVariant, string> = {
  primary: 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white border-blue-700 shadow-lg shadow-blue-600/25',
  secondary: 'bg-gray-600 hover:bg-gray-700 active:bg-gray-800 text-white border-gray-700 shadow-lg shadow-gray-600/25',
  success: 'bg-green-600 hover:bg-green-700 active:bg-green-800 text-white border-green-700 shadow-lg shadow-green-600/25',
  danger: 'bg-red-600 hover:bg-red-700 active:bg-red-800 text-white border-red-700 shadow-lg shadow-red-600/25',
  warning: 'bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-black border-amber-600 shadow-lg shadow-amber-500/25',
  info: 'bg-cyan-600 hover:bg-cyan-700 active:bg-cyan-800 text-white border-cyan-700 shadow-lg shadow-cyan-600/25',
  ghost: 'bg-transparent hover:bg-gray-100 active:bg-gray-200 text-gray-900 dark:text-white dark:hover:bg-gray-800 dark:active:bg-gray-700 border-gray-300 dark:border-gray-600',
};

export const LargeButton = forwardRef<HTMLButtonElement, LargeButtonProps>(
  (
    {
      variant = 'primary',
      size = 'xl',
      icon,
      iconPosition = 'left',
      loading = false,
      fullWidth = false,
      hapticFeedback = true,
      disabled = false,
      className = '',
      children,
      onClick,
      ...props
    },
    ref
  ) => {
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (hapticFeedback && 'vibrate' in navigator) {
        navigator.vibrate(10);
      }
      onClick?.(e);
    };

    const iconElement = loading ? (
      <RefreshCw className={`${iconSizeClasses[size]} animate-spin`} />
    ) : icon ? (
      <span className={iconSizeClasses[size]}>{icon}</span>
    ) : null;

    const isVertical = iconPosition === 'top';

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        onClick={handleClick}
        className={`
          ${sizeClasses[size]}
          ${variantClasses[variant]}
          ${fullWidth ? 'w-full' : ''}
          ${isVertical ? 'flex-col' : 'flex-row'}
          inline-flex items-center justify-center gap-3
          font-bold rounded-xl border-2
          transition-all duration-150
          focus:outline-none focus:ring-4 focus:ring-offset-2
          ${variant === 'primary' ? 'focus:ring-blue-500' : ''}
          ${variant === 'secondary' ? 'focus:ring-gray-500' : ''}
          ${variant === 'success' ? 'focus:ring-green-500' : ''}
          ${variant === 'danger' ? 'focus:ring-red-500' : ''}
          ${variant === 'warning' ? 'focus:ring-amber-500' : ''}
          ${variant === 'info' ? 'focus:ring-cyan-500' : ''}
          disabled:opacity-50 disabled:cursor-not-allowed
          active:scale-95 active:shadow-none
          select-none
          ${className}
        `}
        {...props}
      >
        {iconPosition === 'left' && iconElement}
        {iconPosition === 'top' && iconElement}
        {children && <span>{children}</span>}
        {iconPosition === 'right' && iconElement}
      </button>
    );
  }
);

LargeButton.displayName = 'LargeButton';

// Pre-configured action buttons for common shop floor operations
export interface ActionButtonProps extends Omit<LargeButtonProps, 'variant' | 'icon'> {
  label?: string;
}

export function StartButton({ label = 'START', ...props }: ActionButtonProps) {
  return (
    <LargeButton variant="success" icon={<Play className="w-full h-full" />} {...props}>
      {label}
    </LargeButton>
  );
}

export function StopButton({ label = 'STOP', ...props }: ActionButtonProps) {
  return (
    <LargeButton variant="danger" icon={<Square className="w-full h-full" />} {...props}>
      {label}
    </LargeButton>
  );
}

export function PauseButton({ label = 'PAUSE', ...props }: ActionButtonProps) {
  return (
    <LargeButton variant="warning" icon={<Pause className="w-full h-full" />} {...props}>
      {label}
    </LargeButton>
  );
}

export function ConfirmButton({ label = 'CONFIRM', ...props }: ActionButtonProps) {
  return (
    <LargeButton variant="success" icon={<Check className="w-full h-full" />} {...props}>
      {label}
    </LargeButton>
  );
}

export function CancelButton({ label = 'CANCEL', ...props }: ActionButtonProps) {
  return (
    <LargeButton variant="danger" icon={<X className="w-full h-full" />} {...props}>
      {label}
    </LargeButton>
  );
}

export function AlertButton({ label = 'ALERT', ...props }: ActionButtonProps) {
  return (
    <LargeButton variant="warning" icon={<AlertTriangle className="w-full h-full" />} {...props}>
      {label}
    </LargeButton>
  );
}

// Number pad for quantity entry
export interface NumberPadProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  size?: LargeButtonSize;
  className?: string;
}

export function NumberPad({
  value,
  onChange,
  min = 0,
  max = 9999,
  step = 1,
  size = 'xl',
  className = '',
}: NumberPadProps) {
  const handleIncrement = () => {
    const newValue = Math.min(value + step, max);
    onChange(newValue);
  };

  const handleDecrement = () => {
    const newValue = Math.max(value - step, min);
    onChange(newValue);
  };

  const handleDigit = (digit: number) => {
    const newValue = value * 10 + digit;
    if (newValue <= max) {
      onChange(newValue);
    }
  };

  const handleClear = () => {
    onChange(0);
  };

  const handleBackspace = () => {
    onChange(Math.floor(value / 10));
  };

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      {/* Display */}
      <div className="bg-gray-900 text-white text-4xl font-mono font-bold text-right px-6 py-4 rounded-xl border-2 border-gray-700">
        {value.toLocaleString()}
      </div>

      {/* Quick increment/decrement */}
      <div className="grid grid-cols-2 gap-3">
        <LargeButton
          variant="secondary"
          size={size}
          icon={<Minus className="w-full h-full" />}
          onClick={handleDecrement}
          disabled={value <= min}
        >
          -{step}
        </LargeButton>
        <LargeButton
          variant="secondary"
          size={size}
          icon={<Plus className="w-full h-full" />}
          onClick={handleIncrement}
          disabled={value >= max}
        >
          +{step}
        </LargeButton>
      </div>

      {/* Number grid */}
      <div className="grid grid-cols-3 gap-3">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(digit => (
          <LargeButton
            key={digit}
            variant="ghost"
            size={size}
            onClick={() => handleDigit(digit)}
          >
            {digit}
          </LargeButton>
        ))}
        <LargeButton
          variant="danger"
          size={size}
          onClick={handleClear}
        >
          C
        </LargeButton>
        <LargeButton
          variant="ghost"
          size={size}
          onClick={() => handleDigit(0)}
        >
          0
        </LargeButton>
        <LargeButton
          variant="warning"
          size={size}
          onClick={handleBackspace}
        >
          ←
        </LargeButton>
      </div>
    </div>
  );
}

// Large toggle switch for on/off states
export interface LargeToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  onLabel?: string;
  offLabel?: string;
  size?: LargeButtonSize;
  disabled?: boolean;
  className?: string;
}

export function LargeToggle({
  checked,
  onChange,
  onLabel = 'ON',
  offLabel = 'OFF',
  size = 'xl',
  disabled = false,
  className = '',
}: LargeToggleProps) {
  return (
    <button
      onClick={() => !disabled && onChange(!checked)}
      disabled={disabled}
      className={`
        ${sizeClasses[size]}
        ${checked
          ? 'bg-green-600 border-green-700 shadow-green-600/25'
          : 'bg-gray-600 border-gray-700 shadow-gray-600/25'
        }
        inline-flex items-center justify-center
        font-bold text-white rounded-xl border-2 shadow-lg
        transition-all duration-200
        focus:outline-none focus:ring-4 focus:ring-offset-2
        ${checked ? 'focus:ring-green-500' : 'focus:ring-gray-500'}
        disabled:opacity-50 disabled:cursor-not-allowed
        active:scale-95
        select-none
        ${className}
      `}
    >
      <span className={`${iconSizeClasses[size]} mr-3`}>
        {checked ? <Check className="w-full h-full" /> : <X className="w-full h-full" />}
      </span>
      {checked ? onLabel : offLabel}
    </button>
  );
}

// Button grid for quick actions
export interface QuickActionItem {
  id: string;
  label: string;
  icon: ReactNode;
  variant?: LargeButtonVariant;
  disabled?: boolean;
}

export interface QuickActionGridProps {
  actions: QuickActionItem[];
  onAction: (actionId: string) => void;
  columns?: 2 | 3 | 4;
  size?: LargeButtonSize;
  className?: string;
}

export function QuickActionGrid({
  actions,
  onAction,
  columns = 3,
  size = 'xl',
  className = '',
}: QuickActionGridProps) {
  const gridCols = {
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
  };

  return (
    <div className={`grid ${gridCols[columns]} gap-4 ${className}`}>
      {actions.map(action => (
        <LargeButton
          key={action.id}
          variant={action.variant || 'secondary'}
          size={size}
          icon={action.icon}
          iconPosition="top"
          disabled={action.disabled}
          onClick={() => onAction(action.id)}
        >
          {action.label}
        </LargeButton>
      ))}
    </div>
  );
}

// Navigation arrows for paging through items
export interface LargeNavArrowsProps {
  onPrevious: () => void;
  onNext: () => void;
  hasPrevious?: boolean;
  hasNext?: boolean;
  size?: LargeButtonSize;
  vertical?: boolean;
  className?: string;
}

export function LargeNavArrows({
  onPrevious,
  onNext,
  hasPrevious = true,
  hasNext = true,
  size = 'xl',
  vertical = false,
  className = '',
}: LargeNavArrowsProps) {
  const PrevIcon = vertical ? ChevronUp : ArrowLeft;
  const NextIcon = vertical ? ChevronDown : ArrowRight;

  return (
    <div className={`flex ${vertical ? 'flex-col' : 'flex-row'} gap-4 ${className}`}>
      <LargeButton
        variant="secondary"
        size={size}
        icon={<PrevIcon className="w-full h-full" />}
        onClick={onPrevious}
        disabled={!hasPrevious}
        aria-label="Previous"
      />
      <LargeButton
        variant="secondary"
        size={size}
        icon={<NextIcon className="w-full h-full" />}
        onClick={onNext}
        disabled={!hasNext}
        aria-label="Next"
      />
    </div>
  );
}

// Common shop floor icons as button shortcuts
export const ShopFloorIcons = {
  Package: <Package className="w-full h-full" />,
  Clipboard: <Clipboard className="w-full h-full" />,
  Wrench: <Wrench className="w-full h-full" />,
  Play: <Play className="w-full h-full" />,
  Pause: <Pause className="w-full h-full" />,
  Stop: <Square className="w-full h-full" />,
  Check: <Check className="w-full h-full" />,
  Cancel: <X className="w-full h-full" />,
  Alert: <AlertTriangle className="w-full h-full" />,
  Refresh: <RefreshCw className="w-full h-full" />,
  Plus: <Plus className="w-full h-full" />,
  Minus: <Minus className="w-full h-full" />,
};


'use client';

import React from 'react';
import { AlertCircle, CheckCircle, Info, AlertTriangle, X } from 'lucide-react';

export interface AlertProps {
  children: React.ReactNode;
  variant?: 'default' | 'destructive' | 'success' | 'warning' | 'info';
  className?: string;
  onClose?: () => void;
  showIcon?: boolean;
}

export interface AlertDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

const variantConfig = {
  default: {
    container: 'bg-gray-50 border-gray-200 text-gray-900',
    icon: Info,
    iconColor: 'text-gray-500',
  },
  destructive: {
    container: 'bg-red-50 border-red-200 text-red-900',
    icon: AlertCircle,
    iconColor: 'text-red-500',
  },
  success: {
    container: 'bg-green-50 border-green-200 text-green-900',
    icon: CheckCircle,
    iconColor: 'text-green-500',
  },
  warning: {
    container: 'bg-yellow-50 border-yellow-200 text-yellow-900',
    icon: AlertTriangle,
    iconColor: 'text-yellow-500',
  },
  info: {
    container: 'bg-blue-50 border-blue-200 text-blue-900',
    icon: Info,
    iconColor: 'text-blue-500',
  },
};

export function Alert({
  children,
  variant = 'default',
  className = '',
  onClose,
  showIcon = true,
}: AlertProps) {
  const config = variantConfig[variant];
  const Icon = config.icon;

  return (
    <div
      role="alert"
      className={`relative flex gap-3 p-4 rounded-lg border ${config.container} ${className}`}
    >
      {showIcon && (
        <Icon className={`w-5 h-5 flex-shrink-0 ${config.iconColor}`} />
      )}
      <div className="flex-1">{children}</div>
      {onClose && (
        <button
          onClick={onClose}
          className="flex-shrink-0 p-1 hover:bg-black/5 rounded"
          aria-label="Close alert"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

export function AlertDescription({ children, className = '' }: AlertDescriptionProps) {
  return <p className={`text-sm ${className}`}>{children}</p>;
}

export function AlertTitle({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <h5 className={`font-medium mb-1 ${className}`}>{children}</h5>;
}

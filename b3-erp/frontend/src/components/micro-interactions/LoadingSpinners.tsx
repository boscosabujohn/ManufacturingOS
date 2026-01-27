'use client';

import React, { CSSProperties } from 'react';
import { TRANSITION_DURATIONS } from './TransitionSystem';

// ============================================================================
// Loading Spinner Types
// ============================================================================

export type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type SpinnerVariant = 'spin' | 'dots' | 'pulse' | 'bars' | 'ring' | 'dual-ring';

const sizeConfig: Record<SpinnerSize, { size: number; strokeWidth: number }> = {
  xs: { size: 16, strokeWidth: 2 },
  sm: { size: 20, strokeWidth: 2 },
  md: { size: 24, strokeWidth: 3 },
  lg: { size: 32, strokeWidth: 3 },
  xl: { size: 48, strokeWidth: 4 },
};

// ============================================================================
// Base Spinner Component
// ============================================================================

export interface SpinnerProps {
  /** Spinner size */
  size?: SpinnerSize;
  /** Spinner variant */
  variant?: SpinnerVariant;
  /** Spinner color */
  color?: string;
  /** Speed multiplier (1 = normal, 0.5 = slow, 2 = fast) */
  speed?: number;
  /** Additional className */
  className?: string;
  /** Label for accessibility */
  label?: string;
}

export function Spinner({
  size = 'md',
  variant = 'spin',
  color = 'currentColor',
  speed = 1,
  className = '',
  label = 'Loading',
}: SpinnerProps) {
  const config = sizeConfig[size];
  const duration = 1000 / speed;

  const renderSpinner = () => {
    switch (variant) {
      case 'spin':
        return <SpinnerSpin size={config.size} strokeWidth={config.strokeWidth} color={color} duration={duration} />;
      case 'dots':
        return <SpinnerDots size={config.size} color={color} duration={duration} />;
      case 'pulse':
        return <SpinnerPulse size={config.size} color={color} duration={duration} />;
      case 'bars':
        return <SpinnerBars size={config.size} color={color} duration={duration} />;
      case 'ring':
        return <SpinnerRing size={config.size} strokeWidth={config.strokeWidth} color={color} duration={duration} />;
      case 'dual-ring':
        return <SpinnerDualRing size={config.size} strokeWidth={config.strokeWidth} color={color} duration={duration} />;
      default:
        return <SpinnerSpin size={config.size} strokeWidth={config.strokeWidth} color={color} duration={duration} />;
    }
  };

  return (
    <div
      className={`inline-flex items-center justify-center ${className}`}
      role="status"
      aria-label={label}
    >
      {renderSpinner()}
      <span className="sr-only">{label}</span>
    </div>
  );
}

// ============================================================================
// Spin Variant (Classic circular spinner)
// ============================================================================

interface SpinnerVariantProps {
  size: number;
  strokeWidth?: number;
  color: string;
  duration: number;
}

function SpinnerSpin({ size, strokeWidth = 3, color, duration }: SpinnerVariantProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  return (
    <>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        fill="none"
        className="spinner-spin"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          opacity={0.25}
        />
        {/* Animated arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * 0.75}
        />
      </svg>
      <style jsx>{`
        .spinner-spin {
          animation: spin ${duration}ms linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}

// ============================================================================
// Dots Variant (Three bouncing dots)
// ============================================================================

function SpinnerDots({ size, color, duration }: SpinnerVariantProps) {
  const dotSize = size / 4;
  const gap = dotSize / 2;

  return (
    <>
      <div
        className="spinner-dots"
        style={{ width: size, height: dotSize, gap }}
      >
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="spinner-dot"
            style={{
              width: dotSize,
              height: dotSize,
              backgroundColor: color,
              animationDelay: `${i * (duration / 6)}ms`,
              animationDuration: `${duration}ms`,
            }}
          />
        ))}
      </div>
      <style jsx>{`
        .spinner-dots {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .spinner-dot {
          border-radius: 50%;
          animation: bounce ${duration}ms ease-in-out infinite;
        }
        @keyframes bounce {
          0%, 80%, 100% {
            transform: scale(0.6);
            opacity: 0.5;
          }
          40% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
}

// ============================================================================
// Pulse Variant (Pulsing circle)
// ============================================================================

function SpinnerPulse({ size, color, duration }: SpinnerVariantProps) {
  return (
    <>
      <div
        className="spinner-pulse"
        style={{
          width: size,
          height: size,
          animationDuration: `${duration * 1.5}ms`,
        }}
      >
        <div
          className="pulse-inner"
          style={{ backgroundColor: color }}
        />
        <div
          className="pulse-outer"
          style={{ borderColor: color }}
        />
      </div>
      <style jsx>{`
        .spinner-pulse {
          position: relative;
        }
        .pulse-inner {
          position: absolute;
          inset: 25%;
          border-radius: 50%;
          animation: pulse-inner ${duration * 1.5}ms ease-in-out infinite;
        }
        .pulse-outer {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          border: 2px solid;
          animation: pulse-outer ${duration * 1.5}ms ease-in-out infinite;
        }
        @keyframes pulse-inner {
          0%, 100% {
            transform: scale(0.8);
            opacity: 1;
          }
          50% {
            transform: scale(1);
            opacity: 0.7;
          }
        }
        @keyframes pulse-outer {
          0%, 100% {
            transform: scale(1);
            opacity: 0.3;
          }
          50% {
            transform: scale(1.2);
            opacity: 0;
          }
        }
      `}</style>
    </>
  );
}

// ============================================================================
// Bars Variant (Vertical bars)
// ============================================================================

function SpinnerBars({ size, color, duration }: SpinnerVariantProps) {
  const barWidth = size / 6;
  const barCount = 4;
  const gap = (size - barWidth * barCount) / (barCount - 1);

  return (
    <>
      <div
        className="spinner-bars"
        style={{ width: size, height: size }}
      >
        {Array.from({ length: barCount }).map((_, i) => (
          <div
            key={i}
            className="spinner-bar"
            style={{
              width: barWidth,
              backgroundColor: color,
              animationDelay: `${i * (duration / 8)}ms`,
              animationDuration: `${duration}ms`,
            }}
          />
        ))}
      </div>
      <style jsx>{`
        .spinner-bars {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .spinner-bar {
          height: 40%;
          border-radius: 2px;
          animation: bars ${duration}ms ease-in-out infinite;
        }
        @keyframes bars {
          0%, 40%, 100% {
            height: 40%;
            opacity: 0.5;
          }
          20% {
            height: 100%;
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
}

// ============================================================================
// Ring Variant (Rotating ring)
// ============================================================================

function SpinnerRing({ size, strokeWidth = 3, color, duration }: SpinnerVariantProps) {
  return (
    <>
      <div
        className="spinner-ring"
        style={{
          width: size,
          height: size,
          borderWidth: strokeWidth,
          borderColor: `${color}33`,
          borderTopColor: color,
          animationDuration: `${duration}ms`,
        }}
      />
      <style jsx>{`
        .spinner-ring {
          border-radius: 50%;
          border-style: solid;
          animation: ring ${duration}ms linear infinite;
        }
        @keyframes ring {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}

// ============================================================================
// Dual Ring Variant (Two rotating rings)
// ============================================================================

function SpinnerDualRing({ size, strokeWidth = 3, color, duration }: SpinnerVariantProps) {
  return (
    <>
      <div className="spinner-dual-ring" style={{ width: size, height: size }}>
        <div
          className="ring-outer"
          style={{
            borderWidth: strokeWidth,
            borderColor: `${color}33`,
            borderTopColor: color,
            animationDuration: `${duration}ms`,
          }}
        />
        <div
          className="ring-inner"
          style={{
            borderWidth: strokeWidth,
            borderColor: `${color}33`,
            borderBottomColor: color,
            animationDuration: `${duration * 0.75}ms`,
          }}
        />
      </div>
      <style jsx>{`
        .spinner-dual-ring {
          position: relative;
        }
        .ring-outer {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          border-style: solid;
          animation: ring-cw ${duration}ms linear infinite;
        }
        .ring-inner {
          position: absolute;
          inset: 25%;
          border-radius: 50%;
          border-style: solid;
          animation: ring-ccw ${duration * 0.75}ms linear infinite;
        }
        @keyframes ring-cw {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes ring-ccw {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
      `}</style>
    </>
  );
}

// ============================================================================
// Loading Overlay Component
// ============================================================================

export interface LoadingOverlayProps {
  /** Show/hide the overlay */
  visible: boolean;
  /** Overlay background color */
  background?: string;
  /** Spinner props */
  spinnerProps?: SpinnerProps;
  /** Loading text */
  text?: string;
  /** Full screen overlay */
  fullScreen?: boolean;
  /** Blur backdrop */
  blur?: boolean;
  /** Z-index */
  zIndex?: number;
  className?: string;
}

export function LoadingOverlay({
  visible,
  background = 'rgba(255, 255, 255, 0.9)',
  spinnerProps = {},
  text,
  fullScreen = false,
  blur = true,
  zIndex = 50,
  className = '',
}: LoadingOverlayProps) {
  if (!visible) return null;

  return (
    <div
      className={`
        ${fullScreen ? 'fixed' : 'absolute'}
        inset-0 flex flex-col items-center justify-center
        transition-opacity duration-${TRANSITION_DURATIONS.normal}
        ${blur ? 'backdrop-blur-sm' : ''}
        ${className}
      `}
      style={{ backgroundColor: background, zIndex }}
    >
      <Spinner size="lg" {...spinnerProps} />
      {text && (
        <p className="mt-4 text-sm font-medium text-gray-600 dark:text-gray-400">
          {text}
        </p>
      )}
    </div>
  );
}

// ============================================================================
// Inline Loading Component
// ============================================================================

export interface InlineLoadingProps {
  /** Show/hide loading */
  loading: boolean;
  /** Size of spinner */
  size?: SpinnerSize;
  /** Text to show while loading */
  text?: string;
  /** Text position */
  textPosition?: 'left' | 'right';
  className?: string;
}

export function InlineLoading({
  loading,
  size = 'sm',
  text,
  textPosition = 'right',
  className = '',
}: InlineLoadingProps) {
  if (!loading) return null;

  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      {textPosition === 'left' && text && (
        <span className="text-sm text-gray-600 dark:text-gray-400">{text}</span>
      )}
      <Spinner size={size} />
      {textPosition === 'right' && text && (
        <span className="text-sm text-gray-600 dark:text-gray-400">{text}</span>
      )}
    </span>
  );
}

// ============================================================================
// Button Loading State
// ============================================================================

export interface ButtonLoadingProps {
  /** Loading state */
  loading: boolean;
  /** Original button content */
  children: React.ReactNode;
  /** Loading text (optional, shows spinner only if not provided) */
  loadingText?: string;
  /** Spinner size */
  spinnerSize?: SpinnerSize;
  /** Spinner color */
  spinnerColor?: string;
}

export function ButtonLoading({
  loading,
  children,
  loadingText,
  spinnerSize = 'sm',
  spinnerColor = 'currentColor',
}: ButtonLoadingProps) {
  if (!loading) {
    return <>{children}</>;
  }

  return (
    <span className="inline-flex items-center gap-2">
      <Spinner size={spinnerSize} color={spinnerColor} />
      {loadingText && <span>{loadingText}</span>}
    </span>
  );
}

// ============================================================================
// Progress Spinner Component
// ============================================================================

export interface ProgressSpinnerProps {
  /** Progress value (0-100) */
  progress: number;
  /** Size */
  size?: SpinnerSize;
  /** Track color */
  trackColor?: string;
  /** Progress color */
  progressColor?: string;
  /** Show percentage text */
  showPercentage?: boolean;
  className?: string;
}

export function ProgressSpinner({
  progress,
  size = 'lg',
  trackColor = '#E5E7EB',
  progressColor = '#3B82F6',
  showPercentage = true,
  className = '',
}: ProgressSpinnerProps) {
  const config = sizeConfig[size];
  const strokeWidth = config.strokeWidth;
  const radius = (config.size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg
        width={config.size}
        height={config.size}
        viewBox={`0 0 ${config.size} ${config.size}`}
        className="-rotate-90"
      >
        {/* Track */}
        <circle
          cx={config.size / 2}
          cy={config.size / 2}
          r={radius}
          fill="none"
          stroke={trackColor}
          strokeWidth={strokeWidth}
        />
        {/* Progress */}
        <circle
          cx={config.size / 2}
          cy={config.size / 2}
          r={radius}
          fill="none"
          stroke={progressColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: `stroke-dashoffset ${TRANSITION_DURATIONS.slow}ms ease` }}
        />
      </svg>
      {showPercentage && size !== 'xs' && size !== 'sm' && (
        <span
          className="absolute text-xs font-medium"
          style={{ color: progressColor }}
        >
          {Math.round(progress)}%
        </span>
      )}
    </div>
  );
}

// ============================================================================
// Skeleton Loading Placeholder
// ============================================================================

export interface LoadingPlaceholderProps {
  /** Width */
  width?: string | number;
  /** Height */
  height?: string | number;
  /** Border radius */
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
  /** Animation variant */
  animation?: 'pulse' | 'shimmer' | 'wave';
  className?: string;
}

const roundedClasses = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  full: 'rounded-full',
};

export function LoadingPlaceholder({
  width,
  height,
  rounded = 'md',
  animation = 'shimmer',
  className = '',
}: LoadingPlaceholderProps) {
  const style: CSSProperties = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  };

  const animationClass = animation === 'pulse'
    ? 'animate-pulse'
    : animation === 'shimmer'
      ? 'loading-shimmer'
      : 'loading-wave';

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
      <style jsx global>{`
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }

        @keyframes wave {
          0% {
            opacity: 0.6;
          }
          50% {
            opacity: 0.8;
          }
          100% {
            opacity: 0.6;
          }
        }

        .loading-shimmer {
          background: linear-gradient(
            90deg,
            rgb(229 231 235) 0%,
            rgb(243 244 246) 50%,
            rgb(229 231 235) 100%
          );
          background-size: 200% 100%;
          animation: shimmer 1.5s ease-in-out infinite;
        }

        .dark .loading-shimmer {
          background: linear-gradient(
            90deg,
            rgb(55 65 81) 0%,
            rgb(75 85 99) 50%,
            rgb(55 65 81) 100%
          );
          background-size: 200% 100%;
        }

        .loading-wave {
          animation: wave 1.5s ease-in-out infinite;
        }
      `}</style>
    </>
  );
}


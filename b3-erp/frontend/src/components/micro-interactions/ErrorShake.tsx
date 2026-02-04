'use client';

import React, {
  useState,
  useEffect,
  useCallback,
  forwardRef,
  ReactNode,
  HTMLAttributes,
} from 'react';
import { TRANSITION_DURATIONS } from './TransitionSystem';

// ============================================================================
// Error Animation Types
// ============================================================================

export type ErrorVariant = 'shake' | 'pulse' | 'bounce' | 'flash' | 'jiggle';

// ============================================================================
// Error Shake Component
// ============================================================================

export interface ErrorShakeProps extends HTMLAttributes<HTMLDivElement> {
  /** Trigger shake animation */
  shake: boolean;
  /** Animation variant */
  variant?: ErrorVariant;
  /** Shake intensity (1-10) */
  intensity?: number;
  /** Animation duration in ms */
  duration?: number;
  /** Number of shake cycles */
  cycles?: number;
  /** Callback when animation completes */
  onAnimationComplete?: () => void;
  /** Children */
  children: ReactNode;
}

export const ErrorShake = forwardRef<HTMLDivElement, ErrorShakeProps>(
  (
    {
      shake,
      variant = 'shake',
      intensity = 5,
      duration = 500,
      cycles = 4,
      onAnimationComplete,
      children,
      className = '',
      ...props
    },
    ref
  ) => {
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
      if (shake) {
        setIsAnimating(true);
        const timer = setTimeout(() => {
          setIsAnimating(false);
          onAnimationComplete?.();
        }, duration);
        return () => clearTimeout(timer);
      }
    }, [shake, duration, onAnimationComplete]);

    const getAnimationClass = () => {
      if (!isAnimating) return '';

      switch (variant) {
        case 'shake':
          return 'error-shake';
        case 'pulse':
          return 'error-pulse';
        case 'bounce':
          return 'error-bounce';
        case 'flash':
          return 'error-flash';
        case 'jiggle':
          return 'error-jiggle';
        default:
          return 'error-shake';
      }
    };

    const shakeDistance = intensity;
    const cycleTime = duration / cycles;

    return (
      <>
        <div
          ref={ref}
          className={`${getAnimationClass()} ${className}`}
          style={{
            '--shake-distance': `${shakeDistance}px`,
            '--cycle-time': `${cycleTime}ms`,
            '--duration': `${duration}ms`,
          } as React.CSSProperties}
          {...props}
        >
          {children}
        </div>
        <style jsx global>{`
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(calc(-1 * var(--shake-distance))); }
            20%, 40%, 60%, 80% { transform: translateX(var(--shake-distance)); }
          }

          @keyframes pulse-error {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.02); }
          }

          @keyframes bounce-error {
            0%, 100% { transform: translateY(0); }
            25% { transform: translateY(calc(-1 * var(--shake-distance))); }
            50% { transform: translateY(0); }
            75% { transform: translateY(calc(var(--shake-distance) / 2)); }
          }

          @keyframes flash-error {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }

          @keyframes jiggle {
            0%, 100% { transform: rotate(0deg); }
            25% { transform: rotate(calc(-1deg * var(--shake-distance) / 2)); }
            75% { transform: rotate(calc(1deg * var(--shake-distance) / 2)); }
          }

          .error-shake {
            animation: shake var(--duration) ease-in-out;
          }

          .error-pulse {
            animation: pulse-error var(--duration) ease-in-out;
          }

          .error-bounce {
            animation: bounce-error var(--duration) ease-in-out;
          }

          .error-flash {
            animation: flash-error var(--cycle-time) ease-in-out 4;
          }

          .error-jiggle {
            animation: jiggle var(--cycle-time) ease-in-out 4;
          }
        `}</style>
      </>
    );
  }
);

ErrorShake.displayName = 'ErrorShake';

// ============================================================================
// Error Input Wrapper
// ============================================================================

export interface ErrorInputProps extends ErrorShakeProps {
  /** Show error styling */
  hasError?: boolean;
  /** Error border color */
  errorColor?: string;
  /** Error background color */
  errorBgColor?: string;
}

export const ErrorInput = forwardRef<HTMLDivElement, ErrorInputProps>(
  (
    {
      hasError = false,
      errorColor = '#EF4444',
      errorBgColor = 'rgba(239, 68, 68, 0.05)',
      shake,
      children,
      className = '',
      style,
      ...props
    },
    ref
  ) => {
    return (
      <ErrorShake
        ref={ref}
        shake={shake}
        className={`
          transition-all duration-${TRANSITION_DURATIONS.normal}
          ${hasError ? 'ring-2 rounded-lg' : ''}
          ${className}
        `}
        style={{
          ...(hasError && {
            '--tw-ring-color': errorColor,
            backgroundColor: errorBgColor,
          }),
          ...style,
        } as React.CSSProperties}
        {...props}
      >
        {children}
      </ErrorShake>
    );
  }
);

ErrorInput.displayName = 'ErrorInput';

// ============================================================================
// Error Message Component
// ============================================================================

export interface ErrorMessageProps {
  /** Error message to display */
  message?: string;
  /** Show/hide the message */
  show: boolean;
  /** Icon to show before message */
  icon?: ReactNode;
  /** Animation variant */
  variant?: 'slide' | 'fade' | 'scale';
  /** Text color */
  color?: string;
  className?: string;
}

export function ErrorMessage({
  message,
  show,
  icon,
  variant = 'slide',
  color = '#EF4444',
  className = '',
}: ErrorMessageProps) {
  const [visible, setVisible] = useState(show);
  const [shouldRender, setShouldRender] = useState(show);

  useEffect(() => {
    if (show) {
      setShouldRender(true);
      requestAnimationFrame(() => setVisible(true));
    } else {
      setVisible(false);
      const timer = setTimeout(() => setShouldRender(false), TRANSITION_DURATIONS.normal);
      return () => clearTimeout(timer);
    }
  }, [show]);

  if (!shouldRender || !message) return null;

  const animationClass = {
    slide: visible ? 'error-msg-slide-in' : 'error-msg-slide-out',
    fade: visible ? 'error-msg-fade-in' : 'error-msg-fade-out',
    scale: visible ? 'error-msg-scale-in' : 'error-msg-scale-out',
  }[variant];

  return (
    <>
      <div
        className={`flex items-center gap-1.5 text-sm ${animationClass} ${className}`}
        style={{ color }}
        role="alert"
        aria-live="polite"
      >
        {icon || (
          <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        )}
        <span>{message}</span>
      </div>
      <style jsx global>{`
        @keyframes slide-in-error {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-out-error {
          from {
            opacity: 1;
            transform: translateY(0);
          }
          to {
            opacity: 0;
            transform: translateY(-8px);
          }
        }

        @keyframes fade-in-error {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes fade-out-error {
          from { opacity: 1; }
          to { opacity: 0; }
        }

        @keyframes scale-in-error {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes scale-out-error {
          from {
            opacity: 1;
            transform: scale(1);
          }
          to {
            opacity: 0;
            transform: scale(0.95);
          }
        }

        .error-msg-slide-in {
          animation: slide-in-error ${TRANSITION_DURATIONS.normal}ms ease-out forwards;
        }

        .error-msg-slide-out {
          animation: slide-out-error ${TRANSITION_DURATIONS.normal}ms ease-in forwards;
        }

        .error-msg-fade-in {
          animation: fade-in-error ${TRANSITION_DURATIONS.normal}ms ease-out forwards;
        }

        .error-msg-fade-out {
          animation: fade-out-error ${TRANSITION_DURATIONS.normal}ms ease-in forwards;
        }

        .error-msg-scale-in {
          animation: scale-in-error ${TRANSITION_DURATIONS.normal}ms ease-out forwards;
        }

        .error-msg-scale-out {
          animation: scale-out-error ${TRANSITION_DURATIONS.normal}ms ease-in forwards;
        }
      `}</style>
    </>
  );
}

// ============================================================================
// Form Field with Error
// ============================================================================

export interface FormFieldErrorProps {
  /** Field label */
  label?: string;
  /** Error message */
  error?: string;
  /** Whether field is required */
  required?: boolean;
  /** Children (form input) */
  children: ReactNode;
  /** Shake on error */
  shakeOnError?: boolean;
  /** Additional className */
  className?: string;
}

export function FormFieldError({
  label,
  error,
  required = false,
  children,
  shakeOnError = true,
  className = '',
}: FormFieldErrorProps) {
  const [shouldShake, setShouldShake] = useState(false);
  const [prevError, setPrevError] = useState<string | undefined>(undefined);

  useEffect(() => {
    // Trigger shake when error appears or changes
    if (error && error !== prevError && shakeOnError) {
      setShouldShake(true);
    }
    setPrevError(error);
  }, [error, prevError, shakeOnError]);

  const handleAnimationComplete = useCallback(() => {
    setShouldShake(false);
  }, []);

  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <ErrorInput
        shake={shouldShake}
        hasError={!!error}
        onAnimationComplete={handleAnimationComplete}
      >
        {children}
      </ErrorInput>
      <ErrorMessage message={error} show={!!error} />
    </div>
  );
}

// ============================================================================
// Error Boundary Shake
// ============================================================================

export interface ErrorBoundaryShakeProps {
  /** Error to display */
  error?: Error | string;
  /** Reset error handler */
  onReset?: () => void;
  /** Custom error content */
  children?: ReactNode;
  className?: string;
}

export function ErrorBoundaryShake({
  error,
  onReset,
  children,
  className = '',
}: ErrorBoundaryShakeProps) {
  const [shake, setShake] = useState(true);

  useEffect(() => {
    if (error) {
      setShake(true);
      const timer = setTimeout(() => setShake(false), 500);
      return () => clearTimeout(timer);
    }
  }, [error]);

  if (!error) return null;

  const errorMessage = error instanceof Error ? error.message : error;

  return (
    <ErrorShake
      shake={shake}
      variant="shake"
      intensity={4}
      className={`
        p-3 rounded-lg border border-red-200 bg-red-50
        dark:border-red-800 dark:bg-red-950
        ${className}
      `}
    >
      {children || (
        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mb-3">
            <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-1">
            Something went wrong
          </h3>
          <p className="text-sm text-red-600 dark:text-red-400 mb-2">
            {errorMessage}
          </p>
          {onReset && (
            <button
              onClick={onReset}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          )}
        </div>
      )}
    </ErrorShake>
  );
}

// ============================================================================
// useErrorShake Hook
// ============================================================================

export interface UseErrorShakeOptions {
  /** Duration of shake animation */
  duration?: number;
  /** Reset delay after shake */
  resetDelay?: number;
}

export function useErrorShake(options: UseErrorShakeOptions = {}) {
  const { duration = 500, resetDelay = 100 } = options;
  const [shake, setShake] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const triggerError = useCallback((errorMessage: string) => {
    setError(errorMessage);
    setShake(true);

    setTimeout(() => {
      setShake(false);
    }, duration);
  }, [duration]);

  const clearError = useCallback(() => {
    setError(null);
    setShake(false);
  }, []);

  return {
    shake,
    error,
    triggerError,
    clearError,
  };
}

// ============================================================================
// Validation Error List
// ============================================================================

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationErrorListProps {
  /** List of validation errors */
  errors: ValidationError[];
  /** Show/hide the list */
  show: boolean;
  /** Title for the error list */
  title?: string;
  /** On dismiss callback */
  onDismiss?: () => void;
  className?: string;
}

export function ValidationErrorList({
  errors,
  show,
  title = 'Please fix the following errors:',
  onDismiss,
  className = '',
}: ValidationErrorListProps) {
  const [shouldShake, setShouldShake] = useState(false);

  useEffect(() => {
    if (show && errors.length > 0) {
      setShouldShake(true);
      const timer = setTimeout(() => setShouldShake(false), 500);
      return () => clearTimeout(timer);
    }
  }, [show, errors]);

  if (!show || errors.length === 0) return null;

  return (
    <ErrorShake
      shake={shouldShake}
      variant="shake"
      intensity={3}
      className={`
        p-3 rounded-lg border border-red-200 bg-red-50
        dark:border-red-800 dark:bg-red-950
        ${className}
      `}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h4 className="text-sm font-medium text-red-800 dark:text-red-200 mb-2">
            {title}
          </h4>
          <ul className="list-disc list-inside space-y-1">
            {errors.map((error, index) => (
              <li key={index} className="text-sm text-red-600 dark:text-red-400">
                <span className="font-medium">{error.field}:</span> {error.message}
              </li>
            ))}
          </ul>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="p-1 text-red-400 hover:text-red-600 transition-colors"
            aria-label="Dismiss"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </ErrorShake>
  );
}

// ============================================================================
// Toast Error
// ============================================================================

export interface ToastErrorProps {
  /** Error message */
  message: string;
  /** Show/hide toast */
  show: boolean;
  /** Position */
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
  /** Auto dismiss duration (0 to disable) */
  autoDismiss?: number;
  /** On dismiss callback */
  onDismiss?: () => void;
  className?: string;
}

export function ToastError({
  message,
  show,
  position = 'top-right',
  autoDismiss = 5000,
  onDismiss,
  className = '',
}: ToastErrorProps) {
  const [visible, setVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (show) {
      setShouldRender(true);
      requestAnimationFrame(() => setVisible(true));

      if (autoDismiss > 0) {
        const timer = setTimeout(() => {
          setVisible(false);
          setTimeout(() => {
            setShouldRender(false);
            onDismiss?.();
          }, TRANSITION_DURATIONS.normal);
        }, autoDismiss);
        return () => clearTimeout(timer);
      }
    } else {
      setVisible(false);
      const timer = setTimeout(() => setShouldRender(false), TRANSITION_DURATIONS.normal);
      return () => clearTimeout(timer);
    }
  }, [show, autoDismiss, onDismiss]);

  if (!shouldRender) return null;

  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-center': 'top-4 left-1/2 -translate-x-1/2',
    'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
  };

  return (
    <div
      className={`
        fixed ${positionClasses[position]} z-50
        transition-all duration-${TRANSITION_DURATIONS.normal}
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}
        ${className}
      `}
    >
      <ErrorShake shake={show} variant="shake" intensity={3} duration={300}>
        <div className="flex items-center gap-3 px-4 py-3 bg-red-600 text-white rounded-lg shadow-lg">
          <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm font-medium">{message}</span>
          {onDismiss && (
            <button
              onClick={() => {
                setVisible(false);
                setTimeout(onDismiss, TRANSITION_DURATIONS.normal);
              }}
              className="p-1 hover:bg-red-700 rounded transition-colors"
              aria-label="Dismiss"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </ErrorShake>
    </div>
  );
}


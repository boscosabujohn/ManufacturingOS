'use client';

import React, {
  forwardRef,
  useState,
  useCallback,
  ButtonHTMLAttributes,
  ReactNode,
  useRef,
} from 'react';

// ============================================================================
// Button Feedback Component
// ============================================================================

export type ButtonFeedbackVariant = 'scale' | 'press' | 'lift' | 'glow' | 'ripple' | 'bounce';

export interface ButtonFeedbackProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Animation variant */
  variant?: ButtonFeedbackVariant;
  /** Animation duration in ms */
  duration?: number;
  /** Scale factor for scale/press variants */
  scaleFactor?: number;
  /** Enable haptic feedback */
  haptic?: boolean;
  /** Ripple color */
  rippleColor?: string;
  /** Disable animation */
  noAnimation?: boolean;
  children: ReactNode;
}

export const ButtonFeedback = forwardRef<HTMLButtonElement, ButtonFeedbackProps>(
  (
    {
      variant = 'scale',
      duration = 150,
      scaleFactor = 0.97,
      haptic = true,
      rippleColor = 'rgba(255, 255, 255, 0.4)',
      noAnimation = false,
      disabled = false,
      className = '',
      onClick,
      children,
      style,
      ...props
    },
    ref
  ) => {
    const [isPressed, setIsPressed] = useState(false);
    const [ripples, setRipples] = useState<Array<{ x: number; y: number; id: number }>>([]);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const rippleIdRef = useRef(0);

    // Combined ref handling
    const setRefs = useCallback(
      (node: HTMLButtonElement | null) => {
        (buttonRef as React.MutableRefObject<HTMLButtonElement | null>).current = node;
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      },
      [ref]
    );

    // Handle press start
    const handlePressStart = useCallback(() => {
      if (disabled || noAnimation) return;
      setIsPressed(true);
      if (haptic && 'vibrate' in navigator) {
        navigator.vibrate(5);
      }
    }, [disabled, noAnimation, haptic]);

    // Handle press end
    const handlePressEnd = useCallback(() => {
      setIsPressed(false);
    }, []);

    // Handle ripple effect
    const handleRipple = useCallback(
      (e: React.MouseEvent<HTMLButtonElement>) => {
        if (variant !== 'ripple' || disabled || noAnimation) return;

        const button = buttonRef.current;
        if (!button) return;

        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const id = rippleIdRef.current++;

        setRipples(prev => [...prev, { x, y, id }]);

        // Remove ripple after animation
        setTimeout(() => {
          setRipples(prev => prev.filter(r => r.id !== id));
        }, 600);
      },
      [variant, disabled, noAnimation]
    );

    // Handle click with animation
    const handleClick = useCallback(
      (e: React.MouseEvent<HTMLButtonElement>) => {
        handleRipple(e);
        onClick?.(e);
      },
      [handleRipple, onClick]
    );

    // Get animation styles based on variant
    const getAnimationStyle = (): React.CSSProperties => {
      if (noAnimation || disabled) return {};

      const baseTransition = `transform ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`;

      switch (variant) {
        case 'scale':
          return {
            transform: isPressed ? `scale(${scaleFactor})` : 'scale(1)',
            transition: baseTransition,
          };
        case 'press':
          return {
            transform: isPressed ? `scale(${scaleFactor}) translateY(2px)` : 'scale(1) translateY(0)',
            transition: baseTransition,
          };
        case 'lift':
          return {
            transform: isPressed ? 'translateY(0) scale(0.99)' : 'translateY(-2px) scale(1)',
            boxShadow: isPressed
              ? '0 1px 2px rgba(0,0,0,0.1)'
              : '0 4px 12px rgba(0,0,0,0.15)',
            transition: `${baseTransition}, box-shadow ${duration}ms ease`,
          };
        case 'glow':
          return {
            transform: isPressed ? `scale(${scaleFactor})` : 'scale(1)',
            boxShadow: isPressed
              ? '0 0 0 4px rgba(59, 130, 246, 0.3)'
              : '0 0 0 0 rgba(59, 130, 246, 0)',
            transition: `${baseTransition}, box-shadow ${duration}ms ease`,
          };
        case 'bounce':
          return {
            transform: isPressed ? 'scale(0.9)' : 'scale(1)',
            transition: isPressed
              ? `transform ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`
              : `transform ${duration * 2}ms cubic-bezier(0.34, 1.56, 0.64, 1)`,
          };
        case 'ripple':
          return {
            transform: isPressed ? `scale(${scaleFactor})` : 'scale(1)',
            transition: baseTransition,
          };
        default:
          return {};
      }
    };

    return (
      <button
        ref={setRefs}
        disabled={disabled}
        onClick={handleClick}
        onMouseDown={handlePressStart}
        onMouseUp={handlePressEnd}
        onMouseLeave={handlePressEnd}
        onTouchStart={handlePressStart}
        onTouchEnd={handlePressEnd}
        className={`relative overflow-hidden select-none ${className}`}
        style={{ ...style, ...getAnimationStyle() }}
        {...props}
      >
        {children}

        {/* Ripple effects */}
        {variant === 'ripple' &&
          ripples.map(ripple => (
            <span
              key={ripple.id}
              className="absolute rounded-full pointer-events-none animate-ripple"
              style={{
                left: ripple.x,
                top: ripple.y,
                backgroundColor: rippleColor,
                transform: 'translate(-50%, -50%)',
              }}
            />
          ))}

        <style jsx>{`
          @keyframes ripple {
            0% {
              width: 0;
              height: 0;
              opacity: 0.5;
            }
            100% {
              width: 500px;
              height: 500px;
              opacity: 0;
            }
          }

          .animate-ripple {
            animation: ripple 0.6s ease-out forwards;
          }
        `}</style>
      </button>
    );
  }
);

ButtonFeedback.displayName = 'ButtonFeedback';

// ============================================================================
// Interactive Button with Built-in States
// ============================================================================

export type InteractiveButtonState = 'idle' | 'loading' | 'success' | 'error';

export interface InteractiveButtonProps extends Omit<ButtonFeedbackProps, 'children'> {
  state?: InteractiveButtonState;
  loadingText?: string;
  successText?: string;
  errorText?: string;
  children: ReactNode;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
}

export const InteractiveButton = forwardRef<HTMLButtonElement, InteractiveButtonProps>(
  (
    {
      state = 'idle',
      loadingText,
      successText,
      errorText,
      children,
      iconLeft,
      iconRight,
      disabled,
      className = '',
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || state === 'loading';

    const renderContent = () => {
      switch (state) {
        case 'loading':
          return (
            <span className="flex items-center gap-2">
              <svg
                className="w-4 h-4 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              {loadingText || 'Loading...'}
            </span>
          );
        case 'success':
          return (
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              {successText || 'Success!'}
            </span>
          );
        case 'error':
          return (
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              {errorText || 'Error'}
            </span>
          );
        default:
          return (
            <span className="flex items-center gap-2">
              {iconLeft}
              {children}
              {iconRight}
            </span>
          );
      }
    };

    const stateClasses = {
      idle: '',
      loading: 'cursor-wait',
      success: 'bg-green-500 hover:bg-green-500',
      error: 'bg-red-500 hover:bg-red-500 animate-shake',
    };

    return (
      <ButtonFeedback
        ref={ref}
        disabled={isDisabled}
        noAnimation={state !== 'idle'}
        className={`${stateClasses[state]} ${className}`}
        {...props}
      >
        {renderContent()}

        <style jsx global>{`
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
            20%, 40%, 60%, 80% { transform: translateX(4px); }
          }

          .animate-shake {
            animation: shake 0.5s ease-in-out;
          }
        `}</style>
      </ButtonFeedback>
    );
  }
);

InteractiveButton.displayName = 'InteractiveButton';

// ============================================================================
// Icon Button with Feedback
// ============================================================================

export interface IconButtonFeedbackProps extends Omit<ButtonFeedbackProps, 'children'> {
  icon: ReactNode;
  label: string;
  size?: 'sm' | 'md' | 'lg';
  rounded?: boolean;
}

const iconButtonSizes = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-12 h-12',
};

const iconSizes = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
};

export const IconButtonFeedback = forwardRef<HTMLButtonElement, IconButtonFeedbackProps>(
  ({ icon, label, size = 'md', rounded = true, className = '', ...props }, ref) => {
    return (
      <ButtonFeedback
        ref={ref}
        aria-label={label}
        className={`
          ${iconButtonSizes[size]}
          ${rounded ? 'rounded-full' : 'rounded-lg'}
          inline-flex items-center justify-center
          ${className}
        `}
        {...props}
      >
        <span className={iconSizes[size]}>{icon}</span>
      </ButtonFeedback>
    );
  }
);

IconButtonFeedback.displayName = 'IconButtonFeedback';

// ============================================================================
// Pressable Component (Generic)
// ============================================================================

export interface PressableProps {
  children: ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  feedback?: ButtonFeedbackVariant;
  className?: string;
  as?: 'div' | 'span' | 'li' | 'a';
}

export function Pressable({
  children,
  onPress,
  disabled = false,
  feedback = 'scale',
  className = '',
  as: Component = 'div',
}: PressableProps) {
  const [isPressed, setIsPressed] = useState(false);

  const getTransform = () => {
    if (disabled || !isPressed) return 'scale(1)';

    switch (feedback) {
      case 'scale':
        return 'scale(0.98)';
      case 'press':
        return 'scale(0.98) translateY(1px)';
      case 'bounce':
        return 'scale(0.95)';
      default:
        return 'scale(0.98)';
    }
  };

  return (
    <Component
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled}
      onClick={() => !disabled && onPress?.()}
      onKeyDown={(e: React.KeyboardEvent) => {
        if ((e.key === 'Enter' || e.key === ' ') && !disabled) {
          e.preventDefault();
          onPress?.();
        }
      }}
      onMouseDown={() => !disabled && setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      onTouchStart={() => !disabled && setIsPressed(true)}
      onTouchEnd={() => setIsPressed(false)}
      className={`
        cursor-pointer select-none
        transition-transform duration-150 ease-out
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
      style={{ transform: getTransform() }}
    >
      {children}
    </Component>
  );
}

export type {
  ButtonFeedbackVariant,
  ButtonFeedbackProps,
  InteractiveButtonState,
  InteractiveButtonProps,
  IconButtonFeedbackProps,
  PressableProps,
};

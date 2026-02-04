'use client';

import React, { useState, useEffect, useCallback, ReactNode } from 'react';
import { TRANSITION_DURATIONS, TRANSITION_EASINGS } from './TransitionSystem';

// ============================================================================
// Success Animation Types
// ============================================================================

export type SuccessVariant = 'checkmark' | 'checkmark-circle' | 'confetti' | 'burst' | 'scale';

// ============================================================================
// Animated Checkmark Component
// ============================================================================

export interface AnimatedCheckmarkProps {
  /** Show/animate the checkmark */
  show: boolean;
  /** Size in pixels */
  size?: number;
  /** Stroke color */
  color?: string;
  /** Stroke width */
  strokeWidth?: number;
  /** Animation duration in ms */
  duration?: number;
  /** Callback when animation completes */
  onComplete?: () => void;
  className?: string;
}

export function AnimatedCheckmark({
  show,
  size = 48,
  color = '#22C55E',
  strokeWidth = 3,
  duration = 600,
  onComplete,
  className = '',
}: AnimatedCheckmarkProps) {
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    if (show) {
      setAnimating(true);
      const timer = setTimeout(() => {
        onComplete?.();
      }, duration);
      return () => clearTimeout(timer);
    } else {
      setAnimating(false);
    }
  }, [show, duration, onComplete]);

  if (!show && !animating) return null;

  // Checkmark path calculation
  const padding = strokeWidth * 2;
  const viewBox = `0 0 ${size} ${size}`;
  const checkStart = { x: size * 0.2, y: size * 0.5 };
  const checkMid = { x: size * 0.4, y: size * 0.7 };
  const checkEnd = { x: size * 0.8, y: size * 0.3 };
  const pathLength = 100;

  return (
    <>
      <svg
        width={size}
        height={size}
        viewBox={viewBox}
        fill="none"
        className={`checkmark-svg ${className}`}
      >
        <path
          className="checkmark-path"
          d={`M ${checkStart.x} ${checkStart.y} L ${checkMid.x} ${checkMid.y} L ${checkEnd.x} ${checkEnd.y}`}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength={pathLength}
          style={{ animationDuration: `${duration}ms` }}
        />
      </svg>
      <style jsx>{`
        .checkmark-path {
          stroke-dasharray: ${pathLength};
          stroke-dashoffset: ${pathLength};
          animation: draw-checkmark ${duration}ms ${TRANSITION_EASINGS.easeOut} forwards;
        }

        @keyframes draw-checkmark {
          0% {
            stroke-dashoffset: ${pathLength};
          }
          100% {
            stroke-dashoffset: 0;
          }
        }
      `}</style>
    </>
  );
}

// ============================================================================
// Checkmark with Circle Component
// ============================================================================

export interface CheckmarkCircleProps extends AnimatedCheckmarkProps {
  /** Circle background color */
  circleColor?: string;
  /** Show filled circle or outline */
  filled?: boolean;
}

export function CheckmarkCircle({
  show,
  size = 64,
  color = '#FFFFFF',
  circleColor = '#22C55E',
  strokeWidth = 3,
  duration = 800,
  filled = true,
  onComplete,
  className = '',
}: CheckmarkCircleProps) {
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    if (show) {
      setAnimating(true);
      const timer = setTimeout(() => {
        onComplete?.();
      }, duration);
      return () => clearTimeout(timer);
    } else {
      setAnimating(false);
    }
  }, [show, duration, onComplete]);

  if (!show && !animating) return null;

  const center = size / 2;
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const checkSize = size * 0.5;
  const checkOffset = (size - checkSize) / 2;

  return (
    <>
      <div className={`checkmark-circle-container ${className}`} style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {/* Circle */}
          {filled ? (
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill={circleColor}
              className="circle-scale"
              style={{ animationDuration: `${duration * 0.5}ms` }}
            />
          ) : (
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke={circleColor}
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={circumference}
              className="circle-draw"
              style={{ animationDuration: `${duration * 0.5}ms` }}
            />
          )}

          {/* Checkmark */}
          <g transform={`translate(${checkOffset}, ${checkOffset})`}>
            <path
              d={`M ${checkSize * 0.2} ${checkSize * 0.5} L ${checkSize * 0.4} ${checkSize * 0.7} L ${checkSize * 0.8} ${checkSize * 0.3}`}
              stroke={color}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              pathLength="100"
              className="checkmark-draw"
              style={{ animationDuration: `${duration * 0.5}ms`, animationDelay: `${duration * 0.3}ms` }}
            />
          </g>
        </svg>
      </div>
      <style jsx>{`
        .checkmark-circle-container {
          display: inline-block;
        }

        .circle-scale {
          transform-origin: center;
          animation: circle-scale-in ${duration * 0.5}ms ${TRANSITION_EASINGS.spring} forwards;
        }

        .circle-draw {
          animation: circle-draw-in ${duration * 0.5}ms ${TRANSITION_EASINGS.easeOut} forwards;
        }

        .checkmark-draw {
          stroke-dasharray: 100;
          stroke-dashoffset: 100;
          animation: check-draw ${duration * 0.5}ms ${TRANSITION_EASINGS.easeOut} ${duration * 0.3}ms forwards;
        }

        @keyframes circle-scale-in {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes circle-draw-in {
          0% {
            stroke-dashoffset: ${circumference};
          }
          100% {
            stroke-dashoffset: 0;
          }
        }

        @keyframes check-draw {
          0% {
            stroke-dashoffset: 100;
          }
          100% {
            stroke-dashoffset: 0;
          }
        }
      `}</style>
    </>
  );
}

// ============================================================================
// Success Burst Animation
// ============================================================================

export interface SuccessBurstProps {
  /** Show/animate the burst */
  show: boolean;
  /** Size in pixels */
  size?: number;
  /** Number of particles */
  particleCount?: number;
  /** Particle colors */
  colors?: string[];
  /** Animation duration in ms */
  duration?: number;
  /** Callback when animation completes */
  onComplete?: () => void;
  className?: string;
}

export function SuccessBurst({
  show,
  size = 100,
  particleCount = 12,
  colors = ['#22C55E', '#10B981', '#059669', '#34D399'],
  duration = 800,
  onComplete,
  className = '',
}: SuccessBurstProps) {
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    if (show) {
      setAnimating(true);
      const timer = setTimeout(() => {
        onComplete?.();
        setAnimating(false);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [show, duration, onComplete]);

  if (!animating) return null;

  const particles = Array.from({ length: particleCount }).map((_, i) => {
    const angle = (i / particleCount) * 360;
    const color = colors[i % colors.length];
    const delay = Math.random() * 100;
    const distance = size * 0.4 + Math.random() * size * 0.2;

    return { angle, color, delay, distance };
  });

  return (
    <>
      <div
        className={`success-burst ${className}`}
        style={{ width: size, height: size }}
      >
        {particles.map((particle, i) => (
          <div
            key={i}
            className="burst-particle"
            style={{
              backgroundColor: particle.color,
              '--angle': `${particle.angle}deg`,
              '--distance': `${particle.distance}px`,
              '--delay': `${particle.delay}ms`,
              animationDuration: `${duration}ms`,
            } as React.CSSProperties}
          />
        ))}
      </div>
      <style jsx>{`
        .success-burst {
          position: relative;
        }

        .burst-particle {
          position: absolute;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          animation: burst ${duration}ms ${TRANSITION_EASINGS.easeOut} var(--delay) forwards;
        }

        @keyframes burst {
          0% {
            transform: translate(-50%, -50%) rotate(var(--angle)) translateY(0) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) rotate(var(--angle)) translateY(calc(-1 * var(--distance))) scale(0);
            opacity: 0;
          }
        }
      `}</style>
    </>
  );
}

// ============================================================================
// Confetti Animation
// ============================================================================

export interface ConfettiProps {
  /** Show confetti animation */
  show: boolean;
  /** Number of confetti pieces */
  count?: number;
  /** Confetti colors */
  colors?: string[];
  /** Animation duration in ms */
  duration?: number;
  /** Container width */
  width?: number;
  /** Container height */
  height?: number;
  /** Callback when animation completes */
  onComplete?: () => void;
  className?: string;
}

export function Confetti({
  show,
  count = 50,
  colors = ['#22C55E', '#3B82F6', '#EAB308', '#EF4444', '#8B5CF6'],
  duration = 2000,
  width = 300,
  height = 200,
  onComplete,
  className = '',
}: ConfettiProps) {
  const [animating, setAnimating] = useState(false);
  const [pieces, setPieces] = useState<Array<{
    x: number;
    y: number;
    color: string;
    rotation: number;
    delay: number;
    size: number;
  }>>([]);

  useEffect(() => {
    if (show) {
      // Generate confetti pieces
      const newPieces = Array.from({ length: count }).map(() => ({
        x: Math.random() * width,
        y: -20,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        delay: Math.random() * 500,
        size: 6 + Math.random() * 6,
      }));
      setPieces(newPieces);
      setAnimating(true);

      const timer = setTimeout(() => {
        onComplete?.();
        setAnimating(false);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [show, count, colors, width, duration, onComplete]);

  if (!animating) return null;

  return (
    <>
      <div
        className={`confetti-container ${className}`}
        style={{ width, height }}
      >
        {pieces.map((piece, i) => (
          <div
            key={i}
            className="confetti-piece"
            style={{
              left: piece.x,
              backgroundColor: piece.color,
              width: piece.size,
              height: piece.size * 0.6,
              '--rotation': `${piece.rotation}deg`,
              '--delay': `${piece.delay}ms`,
              '--fall-distance': `${height + 50}px`,
              animationDuration: `${duration}ms`,
            } as React.CSSProperties}
          />
        ))}
      </div>
      <style jsx>{`
        .confetti-container {
          position: absolute;
          overflow: hidden;
          pointer-events: none;
        }

        .confetti-piece {
          position: absolute;
          top: -20px;
          border-radius: 2px;
          animation: confetti-fall ${duration}ms ease-out var(--delay) forwards;
        }

        @keyframes confetti-fall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(var(--fall-distance)) rotate(calc(var(--rotation) + 720deg));
            opacity: 0;
          }
        }
      `}</style>
    </>
  );
}

// ============================================================================
// Success Scale Animation
// ============================================================================

export interface SuccessScaleProps {
  /** Show animation */
  show: boolean;
  /** Content to animate */
  children: ReactNode;
  /** Animation duration in ms */
  duration?: number;
  /** Callback when animation completes */
  onComplete?: () => void;
  className?: string;
}

export function SuccessScale({
  show,
  children,
  duration = 500,
  onComplete,
  className = '',
}: SuccessScaleProps) {
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    if (show) {
      setAnimating(true);
      const timer = setTimeout(() => {
        onComplete?.();
      }, duration);
      return () => clearTimeout(timer);
    } else {
      setAnimating(false);
    }
  }, [show, duration, onComplete]);

  if (!show && !animating) return null;

  return (
    <>
      <div
        className={`success-scale ${className}`}
        style={{ animationDuration: `${duration}ms` }}
      >
        {children}
      </div>
      <style jsx>{`
        .success-scale {
          animation: success-scale-in ${duration}ms ${TRANSITION_EASINGS.spring} forwards;
        }

        @keyframes success-scale-in {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          50% {
            transform: scale(1.2);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
}

// ============================================================================
// Success Feedback Component (Combines multiple animations)
// ============================================================================

export interface SuccessFeedbackProps {
  /** Show success feedback */
  show: boolean;
  /** Variant of success animation */
  variant?: SuccessVariant;
  /** Size */
  size?: number;
  /** Primary color */
  color?: string;
  /** Show confetti burst */
  showConfetti?: boolean;
  /** Success message */
  message?: string;
  /** Animation duration */
  duration?: number;
  /** Auto hide after duration */
  autoHide?: boolean;
  /** Callback when animation completes */
  onComplete?: () => void;
  className?: string;
}

export function SuccessFeedback({
  show,
  variant = 'checkmark-circle',
  size = 64,
  color = '#22C55E',
  showConfetti = false,
  message,
  duration = 1500,
  autoHide = false,
  onComplete,
  className = '',
}: SuccessFeedbackProps) {
  const [visible, setVisible] = useState(show);

  useEffect(() => {
    if (show) {
      setVisible(true);
      if (autoHide) {
        const timer = setTimeout(() => {
          setVisible(false);
          onComplete?.();
        }, duration);
        return () => clearTimeout(timer);
      }
    } else {
      setVisible(false);
    }
  }, [show, autoHide, duration, onComplete]);

  if (!visible) return null;

  const renderAnimation = () => {
    switch (variant) {
      case 'checkmark':
        return (
          <AnimatedCheckmark
            show={visible}
            size={size}
            color={color}
            duration={duration * 0.4}
          />
        );
      case 'checkmark-circle':
        return (
          <CheckmarkCircle
            show={visible}
            size={size}
            circleColor={color}
            duration={duration * 0.5}
          />
        );
      case 'burst':
        return (
          <>
            <CheckmarkCircle
              show={visible}
              size={size}
              circleColor={color}
              duration={duration * 0.5}
            />
            <SuccessBurst
              show={visible}
              size={size * 2}
              colors={[color]}
              duration={duration * 0.6}
            />
          </>
        );
      case 'scale':
        return (
          <SuccessScale show={visible} duration={duration * 0.4}>
            <CheckmarkCircle
              show={true}
              size={size}
              circleColor={color}
              duration={0}
            />
          </SuccessScale>
        );
      default:
        return (
          <CheckmarkCircle
            show={visible}
            size={size}
            circleColor={color}
            duration={duration * 0.5}
          />
        );
    }
  };

  return (
    <div className={`success-feedback flex flex-col items-center gap-2 ${className}`}>
      <div className="relative">
        {renderAnimation()}
        {showConfetti && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Confetti
              show={visible}
              count={30}
              duration={duration}
              width={200}
              height={150}
            />
          </div>
        )}
      </div>
      {message && (
        <p
          className="text-lg font-medium animate-fadeIn"
          style={{ color, animationDelay: `${duration * 0.4}ms` }}
        >
          {message}
        </p>
      )}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          opacity: 0;
          animation: fadeIn 300ms ease-out forwards;
        }
      `}</style>
    </div>
  );
}

// ============================================================================
// useSuccess Hook
// ============================================================================

export interface UseSuccessOptions {
  /** Duration before auto-clearing */
  duration?: number;
  /** Callback on success */
  onSuccess?: () => void;
}

export function useSuccess(options: UseSuccessOptions = {}) {
  const { duration = 2000, onSuccess } = options;
  const [isSuccess, setIsSuccess] = useState(false);

  const triggerSuccess = useCallback(() => {
    setIsSuccess(true);
    onSuccess?.();

    const timer = setTimeout(() => {
      setIsSuccess(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onSuccess]);

  const clearSuccess = useCallback(() => {
    setIsSuccess(false);
  }, []);

  return { isSuccess, triggerSuccess, clearSuccess };
}


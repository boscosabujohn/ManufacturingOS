'use client';

import React, {
  ReactNode,
  useEffect,
  useState,
  useCallback,
  createContext,
  useContext,
  useMemo,
  CSSProperties,
} from 'react';

// ============================================================================
// Transition Constants (Design System Standard)
// ============================================================================

export const TRANSITION_DURATIONS = {
  instant: 0,
  fast: 100,
  normal: 150, // Standard for micro-interactions
  slow: 300,
  slower: 500,
} as const;

export const TRANSITION_EASINGS = {
  linear: 'linear',
  ease: 'ease',
  easeIn: 'ease-in',
  easeOut: 'ease-out',
  easeInOut: 'ease-in-out',
  // Custom easings
  snappy: 'cubic-bezier(0.4, 0, 0.2, 1)', // Standard Material
  bounce: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  smooth: 'cubic-bezier(0.4, 0, 0.6, 1)',
  sharp: 'cubic-bezier(0.4, 0, 1, 1)',
  spring: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
} as const;

export type TransitionDuration = keyof typeof TRANSITION_DURATIONS;
export type TransitionEasing = keyof typeof TRANSITION_EASINGS;

// ============================================================================
// Transition Presets
// ============================================================================

export const TRANSITION_PRESETS = {
  // Standard micro-interaction
  default: {
    duration: TRANSITION_DURATIONS.normal,
    easing: TRANSITION_EASINGS.snappy,
  },
  // Fast response
  quick: {
    duration: TRANSITION_DURATIONS.fast,
    easing: TRANSITION_EASINGS.snappy,
  },
  // Smooth entrance
  enter: {
    duration: TRANSITION_DURATIONS.slow,
    easing: TRANSITION_EASINGS.easeOut,
  },
  // Smooth exit
  exit: {
    duration: TRANSITION_DURATIONS.normal,
    easing: TRANSITION_EASINGS.easeIn,
  },
  // Bouncy feedback
  bounce: {
    duration: TRANSITION_DURATIONS.slow,
    easing: TRANSITION_EASINGS.bounce,
  },
  // Spring animation
  spring: {
    duration: TRANSITION_DURATIONS.slower,
    easing: TRANSITION_EASINGS.spring,
  },
} as const;

export type TransitionPreset = keyof typeof TRANSITION_PRESETS;

// ============================================================================
// CSS Transition Helper
// ============================================================================

export interface TransitionConfig {
  property?: string | string[];
  duration?: number | TransitionDuration;
  easing?: string | TransitionEasing;
  delay?: number;
}

export function createTransition(config: TransitionConfig | TransitionConfig[]): string {
  const configs = Array.isArray(config) ? config : [config];

  return configs
    .map(c => {
      const property = Array.isArray(c.property) ? c.property.join(', ') : c.property || 'all';
      const duration = typeof c.duration === 'string'
        ? TRANSITION_DURATIONS[c.duration]
        : c.duration ?? TRANSITION_DURATIONS.normal;
      const easing = c.easing && c.easing in TRANSITION_EASINGS
        ? TRANSITION_EASINGS[c.easing as TransitionEasing]
        : c.easing ?? TRANSITION_EASINGS.snappy;
      const delay = c.delay ?? 0;

      return `${property} ${duration}ms ${easing} ${delay}ms`;
    })
    .join(', ');
}

// Shorthand for common transitions
export const transitions = {
  all: (preset: TransitionPreset = 'default') =>
    createTransition({ property: 'all', ...TRANSITION_PRESETS[preset] }),
  opacity: (preset: TransitionPreset = 'default') =>
    createTransition({ property: 'opacity', ...TRANSITION_PRESETS[preset] }),
  transform: (preset: TransitionPreset = 'default') =>
    createTransition({ property: 'transform', ...TRANSITION_PRESETS[preset] }),
  colors: (preset: TransitionPreset = 'default') =>
    createTransition({ property: ['color', 'background-color', 'border-color'], ...TRANSITION_PRESETS[preset] }),
  shadow: (preset: TransitionPreset = 'default') =>
    createTransition({ property: 'box-shadow', ...TRANSITION_PRESETS[preset] }),
};

// ============================================================================
// Transition Component
// ============================================================================

export type TransitionState = 'entering' | 'entered' | 'exiting' | 'exited';

export interface TransitionProps {
  show: boolean;
  children: ReactNode | ((state: TransitionState) => ReactNode);
  duration?: number | TransitionDuration;
  easing?: string | TransitionEasing;
  enterDelay?: number;
  exitDelay?: number;
  unmountOnExit?: boolean;
  onEnter?: () => void;
  onEntered?: () => void;
  onExit?: () => void;
  onExited?: () => void;
  className?: string;
}

export function Transition({
  show,
  children,
  duration = 'normal',
  easing = 'snappy',
  enterDelay = 0,
  exitDelay = 0,
  unmountOnExit = false,
  onEnter,
  onEntered,
  onExit,
  onExited,
  className = '',
}: TransitionProps) {
  const [state, setState] = useState<TransitionState>(show ? 'entered' : 'exited');
  const [shouldRender, setShouldRender] = useState(show);

  const durationMs = typeof duration === 'string' ? TRANSITION_DURATIONS[duration] : duration;

  useEffect(() => {
    if (show) {
      setShouldRender(true);
      const enterTimer = setTimeout(() => {
        setState('entering');
        onEnter?.();

        const enteredTimer = setTimeout(() => {
          setState('entered');
          onEntered?.();
        }, durationMs);

        return () => clearTimeout(enteredTimer);
      }, enterDelay);

      return () => clearTimeout(enterTimer);
    } else {
      const exitTimer = setTimeout(() => {
        setState('exiting');
        onExit?.();

        const exitedTimer = setTimeout(() => {
          setState('exited');
          onExited?.();
          if (unmountOnExit) {
            setShouldRender(false);
          }
        }, durationMs);

        return () => clearTimeout(exitedTimer);
      }, exitDelay);

      return () => clearTimeout(exitTimer);
    }
  }, [show, durationMs, enterDelay, exitDelay, unmountOnExit, onEnter, onEntered, onExit, onExited]);

  if (!shouldRender) return null;

  return (
    <div className={className} data-state={state}>
      {typeof children === 'function' ? children(state) : children}
    </div>
  );
}

// ============================================================================
// Fade Transition
// ============================================================================

export interface FadeProps extends Omit<TransitionProps, 'children'> {
  children: ReactNode;
}

export function Fade({ children, duration = 'normal', easing = 'snappy', ...props }: FadeProps) {
  const durationMs = typeof duration === 'string' ? TRANSITION_DURATIONS[duration] : duration;
  const easingValue = easing in TRANSITION_EASINGS ? TRANSITION_EASINGS[easing as TransitionEasing] : easing;

  return (
    <Transition duration={duration} easing={easing} {...props}>
      {(state) => (
        <div
          style={{
            opacity: state === 'entering' || state === 'entered' ? 1 : 0,
            transition: `opacity ${durationMs}ms ${easingValue}`,
          }}
        >
          {children}
        </div>
      )}
    </Transition>
  );
}

// ============================================================================
// Slide Transition
// ============================================================================

export type SlideDirection = 'up' | 'down' | 'left' | 'right';

export interface SlideProps extends Omit<TransitionProps, 'children'> {
  children: ReactNode;
  direction?: SlideDirection;
  distance?: number;
}

export function Slide({
  children,
  direction = 'up',
  distance = 20,
  duration = 'normal',
  easing = 'snappy',
  ...props
}: SlideProps) {
  const durationMs = typeof duration === 'string' ? TRANSITION_DURATIONS[duration] : duration;
  const easingValue = easing in TRANSITION_EASINGS ? TRANSITION_EASINGS[easing as TransitionEasing] : easing;

  const getTransform = (state: TransitionState) => {
    const isVisible = state === 'entering' || state === 'entered';
    if (isVisible) return 'translate(0, 0)';

    switch (direction) {
      case 'up':
        return `translateY(${distance}px)`;
      case 'down':
        return `translateY(-${distance}px)`;
      case 'left':
        return `translateX(${distance}px)`;
      case 'right':
        return `translateX(-${distance}px)`;
    }
  };

  return (
    <Transition duration={duration} easing={easing} {...props}>
      {(state) => (
        <div
          style={{
            opacity: state === 'entering' || state === 'entered' ? 1 : 0,
            transform: getTransform(state),
            transition: `opacity ${durationMs}ms ${easingValue}, transform ${durationMs}ms ${easingValue}`,
          }}
        >
          {children}
        </div>
      )}
    </Transition>
  );
}

// ============================================================================
// Scale Transition
// ============================================================================

export interface ScaleProps extends Omit<TransitionProps, 'children'> {
  children: ReactNode;
  initialScale?: number;
  origin?: string;
}

export function Scale({
  children,
  initialScale = 0.95,
  origin = 'center',
  duration = 'normal',
  easing = 'snappy',
  ...props
}: ScaleProps) {
  const durationMs = typeof duration === 'string' ? TRANSITION_DURATIONS[duration] : duration;
  const easingValue = easing in TRANSITION_EASINGS ? TRANSITION_EASINGS[easing as TransitionEasing] : easing;

  return (
    <Transition duration={duration} easing={easing} {...props}>
      {(state) => (
        <div
          style={{
            opacity: state === 'entering' || state === 'entered' ? 1 : 0,
            transform: state === 'entering' || state === 'entered' ? 'scale(1)' : `scale(${initialScale})`,
            transformOrigin: origin,
            transition: `opacity ${durationMs}ms ${easingValue}, transform ${durationMs}ms ${easingValue}`,
          }}
        >
          {children}
        </div>
      )}
    </Transition>
  );
}

// ============================================================================
// Collapse Transition
// ============================================================================

export interface CollapseProps extends Omit<TransitionProps, 'children'> {
  children: ReactNode;
  horizontal?: boolean;
}

export function Collapse({
  children,
  horizontal = false,
  duration = 'normal',
  easing = 'snappy',
  ...props
}: CollapseProps) {
  const durationMs = typeof duration === 'string' ? TRANSITION_DURATIONS[duration] : duration;
  const easingValue = easing in TRANSITION_EASINGS ? TRANSITION_EASINGS[easing as TransitionEasing] : easing;
  const [size, setSize] = useState<number | null>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      setSize(horizontal ? contentRef.current.scrollWidth : contentRef.current.scrollHeight);
    }
  }, [children, horizontal]);

  return (
    <Transition duration={duration} easing={easing} {...props}>
      {(state) => {
        const isVisible = state === 'entering' || state === 'entered';
        const sizeValue = isVisible ? size : 0;

        return (
          <div
            style={{
              overflow: 'hidden',
              [horizontal ? 'width' : 'height']: sizeValue !== null ? `${sizeValue}px` : 'auto',
              transition: `${horizontal ? 'width' : 'height'} ${durationMs}ms ${easingValue}`,
            }}
          >
            <div ref={contentRef}>{children}</div>
          </div>
        );
      }}
    </Transition>
  );
}

// ============================================================================
// Transition Group Context
// ============================================================================

interface TransitionGroupContextValue {
  stagger: number;
  registerChild: (id: string) => number;
  unregisterChild: (id: string) => void;
}

const TransitionGroupContext = createContext<TransitionGroupContextValue | null>(null);

export interface TransitionGroupProps {
  children: ReactNode;
  stagger?: number;
  className?: string;
}

export function TransitionGroup({ children, stagger = 50, className = '' }: TransitionGroupProps) {
  const childrenRef = React.useRef<Map<string, number>>(new Map());
  const indexRef = React.useRef(0);

  const registerChild = useCallback((id: string) => {
    if (!childrenRef.current.has(id)) {
      childrenRef.current.set(id, indexRef.current++);
    }
    return childrenRef.current.get(id)! * stagger;
  }, [stagger]);

  const unregisterChild = useCallback((id: string) => {
    childrenRef.current.delete(id);
  }, []);

  const value = useMemo(
    () => ({ stagger, registerChild, unregisterChild }),
    [stagger, registerChild, unregisterChild]
  );

  return (
    <TransitionGroupContext.Provider value={value}>
      <div className={className}>{children}</div>
    </TransitionGroupContext.Provider>
  );
}

export function useTransitionGroup(id: string) {
  const context = useContext(TransitionGroupContext);
  const [delay, setDelay] = useState(0);

  useEffect(() => {
    if (context) {
      const d = context.registerChild(id);
      setDelay(d);
      return () => context.unregisterChild(id);
    }
  }, [context, id]);

  return delay;
}

// ============================================================================
// CSS Variables for Transitions
// ============================================================================

export function TransitionStyles() {
  return (
    <style jsx global>{`
      :root {
        /* Duration tokens */
        --transition-instant: ${TRANSITION_DURATIONS.instant}ms;
        --transition-fast: ${TRANSITION_DURATIONS.fast}ms;
        --transition-normal: ${TRANSITION_DURATIONS.normal}ms;
        --transition-slow: ${TRANSITION_DURATIONS.slow}ms;
        --transition-slower: ${TRANSITION_DURATIONS.slower}ms;

        /* Easing tokens */
        --ease-linear: ${TRANSITION_EASINGS.linear};
        --ease-default: ${TRANSITION_EASINGS.ease};
        --ease-in: ${TRANSITION_EASINGS.easeIn};
        --ease-out: ${TRANSITION_EASINGS.easeOut};
        --ease-in-out: ${TRANSITION_EASINGS.easeInOut};
        --ease-snappy: ${TRANSITION_EASINGS.snappy};
        --ease-bounce: ${TRANSITION_EASINGS.bounce};
        --ease-smooth: ${TRANSITION_EASINGS.smooth};
        --ease-sharp: ${TRANSITION_EASINGS.sharp};
        --ease-spring: ${TRANSITION_EASINGS.spring};

        /* Default transition */
        --transition-default: all var(--transition-normal) var(--ease-snappy);
      }

      /* Utility classes */
      .transition-default {
        transition: var(--transition-default);
      }

      .transition-fast {
        transition-duration: var(--transition-fast);
      }

      .transition-slow {
        transition-duration: var(--transition-slow);
      }

      .ease-snappy {
        transition-timing-function: var(--ease-snappy);
      }

      .ease-bounce {
        transition-timing-function: var(--ease-bounce);
      }

      .ease-spring {
        transition-timing-function: var(--ease-spring);
      }
    `}</style>
  );
}


'use client';

import React, {
  createContext,
  useContext,
  ReactNode,
  useMemo,
  CSSProperties,
} from 'react';

// ============================================================================
// RTL Context
// ============================================================================

interface RTLContextValue {
  isRTL: boolean;
  direction: 'ltr' | 'rtl';
  // Logical property mappings
  start: 'left' | 'right';
  end: 'left' | 'right';
  // Utility functions
  flip: <T>(ltrValue: T, rtlValue: T) => T;
  transform: (translateX: number) => string;
}

const RTLContext = createContext<RTLContextValue>({
  isRTL: false,
  direction: 'ltr',
  start: 'left',
  end: 'right',
  flip: (ltr) => ltr,
  transform: (x) => `translateX(${x}px)`,
});

// ============================================================================
// RTL Provider
// ============================================================================

export interface RTLProviderProps {
  children: ReactNode;
  isRTL?: boolean;
}

export function RTLProvider({ children, isRTL = false }: RTLProviderProps) {
  const value = useMemo<RTLContextValue>(() => ({
    isRTL,
    direction: isRTL ? 'rtl' : 'ltr',
    start: isRTL ? 'right' : 'left',
    end: isRTL ? 'left' : 'right',
    flip: (ltr, rtl) => (isRTL ? rtl : ltr),
    transform: (x) => `translateX(${isRTL ? -x : x}px)`,
  }), [isRTL]);

  return (
    <RTLContext.Provider value={value}>
      <div dir={value.direction}>
        {children}
      </div>
    </RTLContext.Provider>
  );
}

// ============================================================================
// useRTL Hook
// ============================================================================

export function useRTL() {
  return useContext(RTLContext);
}

// ============================================================================
// RTL-Aware Style Utilities
// ============================================================================

export type LogicalPosition = 'start' | 'end';
export type PhysicalPosition = 'left' | 'right';

/**
 * Convert logical position to physical based on direction
 */
export function logicalToPhysical(
  logical: LogicalPosition,
  isRTL: boolean
): PhysicalPosition {
  if (logical === 'start') {
    return isRTL ? 'right' : 'left';
  }
  return isRTL ? 'left' : 'right';
}

/**
 * Create RTL-aware margin/padding styles
 */
export function createLogicalSpacing(
  property: 'margin' | 'padding',
  values: {
    top?: string | number;
    end?: string | number;
    bottom?: string | number;
    start?: string | number;
  },
  isRTL: boolean
): CSSProperties {
  const style: CSSProperties = {};
  const toValue = (v: string | number) => (typeof v === 'number' ? `${v}px` : v);

  if (values.top !== undefined) {
    (style as Record<string, string>)[`${property}Top`] = toValue(values.top);
  }
  if (values.bottom !== undefined) {
    (style as Record<string, string>)[`${property}Bottom`] = toValue(values.bottom);
  }
  if (values.start !== undefined) {
    const physicalProp = `${property}${isRTL ? 'Right' : 'Left'}`;
    (style as Record<string, string>)[physicalProp] = toValue(values.start);
  }
  if (values.end !== undefined) {
    const physicalProp = `${property}${isRTL ? 'Left' : 'Right'}`;
    (style as Record<string, string>)[physicalProp] = toValue(values.end);
  }

  return style;
}

/**
 * Create RTL-aware positioning styles
 */
export function createLogicalPosition(
  values: {
    insetInlineStart?: string | number;
    insetInlineEnd?: string | number;
    top?: string | number;
    bottom?: string | number;
  },
  isRTL: boolean
): CSSProperties {
  const style: CSSProperties = {};
  const toValue = (v: string | number) => (typeof v === 'number' ? `${v}px` : v);

  if (values.top !== undefined) {
    style.top = toValue(values.top);
  }
  if (values.bottom !== undefined) {
    style.bottom = toValue(values.bottom);
  }
  if (values.insetInlineStart !== undefined) {
    if (isRTL) {
      style.right = toValue(values.insetInlineStart);
    } else {
      style.left = toValue(values.insetInlineStart);
    }
  }
  if (values.insetInlineEnd !== undefined) {
    if (isRTL) {
      style.left = toValue(values.insetInlineEnd);
    } else {
      style.right = toValue(values.insetInlineEnd);
    }
  }

  return style;
}

/**
 * Flip transform for RTL
 */
export function flipTransform(transform: string, isRTL: boolean): string {
  if (!isRTL) return transform;

  return transform
    .replace(/translateX\(([^)]+)\)/g, (_match, value) => {
      const numValue = parseFloat(value);
      if (isNaN(numValue)) return _match;
      return `translateX(${-numValue}${value.replace(String(numValue), '')})`;
    })
    .replace(/rotate\(([^)]+)\)/g, (_match, value) => {
      const numValue = parseFloat(value);
      if (isNaN(numValue)) return _match;
      return `rotate(${-numValue}${value.replace(String(numValue), '')})`;
    });
}

// ============================================================================
// RTL-Aware Components
// ============================================================================

/**
 * RTL-Aware Flex Container
 */
export interface RTLFlexProps {
  children: ReactNode;
  className?: string;
  reverse?: boolean;
  style?: CSSProperties;
}

export function RTLFlex({
  children,
  className = '',
  reverse = false,
  style,
}: RTLFlexProps) {
  const { isRTL } = useRTL();
  const shouldReverse = isRTL !== reverse; // XOR logic

  return (
    <div
      className={`flex ${className}`}
      style={{
        ...style,
        flexDirection: shouldReverse ? 'row-reverse' : 'row',
      }}
    >
      {children}
    </div>
  );
}

/**
 * RTL-Aware Icon (flips horizontally in RTL)
 */
export interface RTLIconProps {
  children: ReactNode;
  flip?: boolean;
  className?: string;
}

export function RTLIcon({ children, flip = true, className = '' }: RTLIconProps) {
  const { isRTL } = useRTL();

  return (
    <span
      className={`inline-flex ${className}`}
      style={{
        transform: flip && isRTL ? 'scaleX(-1)' : undefined,
      }}
    >
      {children}
    </span>
  );
}

/**
 * RTL-Aware Text Alignment
 */
export interface RTLTextProps {
  children: ReactNode;
  align?: 'start' | 'end' | 'center';
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}

export function RTLText({
  children,
  align = 'start',
  className = '',
  as: Component = 'p',
}: RTLTextProps) {
  const { isRTL } = useRTL();

  const textAlign = align === 'center'
    ? 'center'
    : align === 'start'
      ? (isRTL ? 'right' : 'left')
      : (isRTL ? 'left' : 'right');

  return (
    <Component className={className} style={{ textAlign }}>
      {children}
    </Component>
  );
}

/**
 * RTL-Aware Margin/Padding Box
 */
export interface RTLBoxProps {
  children: ReactNode;
  marginStart?: string | number;
  marginEnd?: string | number;
  paddingStart?: string | number;
  paddingEnd?: string | number;
  className?: string;
  style?: CSSProperties;
}

export function RTLBox({
  children,
  marginStart,
  marginEnd,
  paddingStart,
  paddingEnd,
  className = '',
  style,
}: RTLBoxProps) {
  const { isRTL } = useRTL();

  const computedStyle: CSSProperties = {
    ...style,
    ...createLogicalSpacing('margin', { start: marginStart, end: marginEnd }, isRTL),
    ...createLogicalSpacing('padding', { start: paddingStart, end: paddingEnd }, isRTL),
  };

  return (
    <div className={className} style={computedStyle}>
      {children}
    </div>
  );
}

/**
 * RTL-Aware Absolute Positioned Element
 */
export interface RTLPositionProps {
  children: ReactNode;
  insetStart?: string | number;
  insetEnd?: string | number;
  top?: string | number;
  bottom?: string | number;
  className?: string;
  style?: CSSProperties;
}

export function RTLPosition({
  children,
  insetStart,
  insetEnd,
  top,
  bottom,
  className = '',
  style,
}: RTLPositionProps) {
  const { isRTL } = useRTL();

  const computedStyle: CSSProperties = {
    position: 'absolute',
    ...style,
    ...createLogicalPosition(
      {
        insetInlineStart: insetStart,
        insetInlineEnd: insetEnd,
        top,
        bottom,
      },
      isRTL
    ),
  };

  return (
    <div className={className} style={computedStyle}>
      {children}
    </div>
  );
}

// ============================================================================
// RTL-Aware CSS Classes Generator
// ============================================================================

type RTLClassMap = Record<string, string>;

/**
 * Generate RTL-aware Tailwind classes
 */
export function rtlClasses(
  baseClasses: string,
  rtlOverrides: RTLClassMap,
  isRTL: boolean
): string {
  if (!isRTL) return baseClasses;

  let classes = baseClasses;
  Object.entries(rtlOverrides).forEach(([ltrClass, rtlClass]) => {
    classes = classes.replace(new RegExp(`\\b${ltrClass}\\b`, 'g'), rtlClass);
  });

  return classes;
}

/**
 * Common RTL class mappings for Tailwind
 */
export const RTL_CLASS_MAPPINGS: RTLClassMap = {
  // Margins
  'ml-': 'mr-',
  'mr-': 'ml-',
  // Paddings
  'pl-': 'pr-',
  'pr-': 'pl-',
  // Borders
  'border-l': 'border-r',
  'border-r': 'border-l',
  'rounded-l': 'rounded-r',
  'rounded-r': 'rounded-l',
  // Positioning
  'left-': 'right-',
  'right-': 'left-',
  // Text alignment
  'text-left': 'text-right',
  'text-right': 'text-left',
  // Flex
  'justify-start': 'justify-end',
  'justify-end': 'justify-start',
  // Transforms
  'translate-x-': '-translate-x-',
  '-translate-x-': 'translate-x-',
  'rotate-': '-rotate-',
  '-rotate-': 'rotate-',
};

/**
 * Hook to get RTL-aware classes
 */
export function useRTLClasses(baseClasses: string): string {
  const { isRTL } = useRTL();
  return rtlClasses(baseClasses, RTL_CLASS_MAPPINGS, isRTL);
}

// ============================================================================
// Bidirectional Text Support
// ============================================================================

export interface BidiTextProps {
  children: ReactNode;
  /** Force text direction */
  dir?: 'ltr' | 'rtl' | 'auto';
  /** Isolate from surrounding text */
  isolate?: boolean;
  className?: string;
}

export function BidiText({
  children,
  dir = 'auto',
  isolate = true,
  className = '',
}: BidiTextProps) {
  if (isolate) {
    return (
      <bdi dir={dir} className={className}>
        {children}
      </bdi>
    );
  }

  return (
    <span dir={dir} className={className}>
      {children}
    </span>
  );
}

/**
 * Format text with bidirectional markers
 */
export function formatBidiText(
  text: string,
  options: { isolate?: boolean; direction?: 'ltr' | 'rtl' } = {}
): string {
  const { isolate = true, direction } = options;

  if (isolate) {
    // Use Unicode isolate characters
    const startChar = direction === 'ltr' ? '\u2066' : direction === 'rtl' ? '\u2067' : '\u2068';
    const endChar = '\u2069';
    return `${startChar}${text}${endChar}`;
  }

  if (direction) {
    // Use embedding characters
    const startChar = direction === 'ltr' ? '\u202A' : '\u202B';
    const endChar = '\u202C';
    return `${startChar}${text}${endChar}`;
  }

  return text;
}

// ============================================================================
// RTL Style Sheet
// ============================================================================

export function RTLStyleSheet() {
  return (
    <style jsx global>{`
      /* RTL Base Styles */
      [dir="rtl"] {
        text-align: right;
      }

      /* Flip icons that have directional meaning */
      [dir="rtl"] .rtl-flip {
        transform: scaleX(-1);
      }

      /* Don't flip icons that should stay the same */
      [dir="rtl"] .rtl-no-flip {
        transform: none;
      }

      /* RTL-aware margins using CSS logical properties */
      .ms-auto { margin-inline-start: auto; }
      .me-auto { margin-inline-end: auto; }
      .ms-0 { margin-inline-start: 0; }
      .me-0 { margin-inline-end: 0; }
      .ms-1 { margin-inline-start: 0.25rem; }
      .me-1 { margin-inline-end: 0.25rem; }
      .ms-2 { margin-inline-start: 0.5rem; }
      .me-2 { margin-inline-end: 0.5rem; }
      .ms-3 { margin-inline-start: 0.75rem; }
      .me-3 { margin-inline-end: 0.75rem; }
      .ms-4 { margin-inline-start: 1rem; }
      .me-4 { margin-inline-end: 1rem; }
      .ms-5 { margin-inline-start: 1.25rem; }
      .me-5 { margin-inline-end: 1.25rem; }
      .ms-6 { margin-inline-start: 1.5rem; }
      .me-6 { margin-inline-end: 1.5rem; }
      .ms-8 { margin-inline-start: 2rem; }
      .me-8 { margin-inline-end: 2rem; }

      /* RTL-aware padding using CSS logical properties */
      .ps-0 { padding-inline-start: 0; }
      .pe-0 { padding-inline-end: 0; }
      .ps-1 { padding-inline-start: 0.25rem; }
      .pe-1 { padding-inline-end: 0.25rem; }
      .ps-2 { padding-inline-start: 0.5rem; }
      .pe-2 { padding-inline-end: 0.5rem; }
      .ps-3 { padding-inline-start: 0.75rem; }
      .pe-3 { padding-inline-end: 0.75rem; }
      .ps-4 { padding-inline-start: 1rem; }
      .pe-4 { padding-inline-end: 1rem; }
      .ps-5 { padding-inline-start: 1.25rem; }
      .pe-5 { padding-inline-end: 1.25rem; }
      .ps-6 { padding-inline-start: 1.5rem; }
      .pe-6 { padding-inline-end: 1.5rem; }
      .ps-8 { padding-inline-start: 2rem; }
      .pe-8 { padding-inline-end: 2rem; }

      /* RTL-aware positioning */
      .start-0 { inset-inline-start: 0; }
      .end-0 { inset-inline-end: 0; }
      .start-auto { inset-inline-start: auto; }
      .end-auto { inset-inline-end: auto; }

      /* RTL-aware text alignment */
      .text-start { text-align: start; }
      .text-end { text-align: end; }

      /* RTL-aware borders */
      .border-s { border-inline-start-width: 1px; }
      .border-e { border-inline-end-width: 1px; }
      .border-s-0 { border-inline-start-width: 0; }
      .border-e-0 { border-inline-end-width: 0; }
      .border-s-2 { border-inline-start-width: 2px; }
      .border-e-2 { border-inline-end-width: 2px; }

      /* RTL-aware border radius */
      .rounded-s { border-start-start-radius: 0.25rem; border-end-start-radius: 0.25rem; }
      .rounded-e { border-start-end-radius: 0.25rem; border-end-end-radius: 0.25rem; }
      .rounded-s-lg { border-start-start-radius: 0.5rem; border-end-start-radius: 0.5rem; }
      .rounded-e-lg { border-start-end-radius: 0.5rem; border-end-end-radius: 0.5rem; }
    `}</style>
  );
}

export type {
  RTLProviderProps,
  RTLFlexProps,
  RTLIconProps,
  RTLTextProps,
  RTLBoxProps,
  RTLPositionProps,
  BidiTextProps,
  LogicalPosition,
  PhysicalPosition,
};

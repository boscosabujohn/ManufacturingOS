'use client';

import React, {
  useRef,
  useEffect,
  useCallback,
  ReactNode,
  createContext,
  useContext,
  useState,
} from 'react';

// ============================================================================
// Focus Trap Component
// ============================================================================

// Focusable element selectors
const FOCUSABLE_SELECTORS = [
  'a[href]',
  'area[href]',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'button:not([disabled])',
  'iframe',
  'object',
  'embed',
  '[contenteditable]',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

export interface FocusTrapProps {
  children: ReactNode;
  active?: boolean;
  returnFocusOnDeactivate?: boolean;
  initialFocus?: 'first' | 'container' | string;
  allowOutsideClick?: boolean;
  onEscape?: () => void;
  className?: string;
}

export function FocusTrap({
  children,
  active = true,
  returnFocusOnDeactivate = true,
  initialFocus = 'first',
  allowOutsideClick = false,
  onEscape,
  className = '',
}: FocusTrapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<Element | null>(null);
  const startSentinelRef = useRef<HTMLDivElement>(null);
  const endSentinelRef = useRef<HTMLDivElement>(null);

  // Get all focusable elements within the container
  const getFocusableElements = useCallback(() => {
    if (!containerRef.current) return [];
    const elements = containerRef.current.querySelectorAll(FOCUSABLE_SELECTORS);
    return Array.from(elements).filter(el => {
      // Filter out elements that are not visible
      const style = window.getComputedStyle(el);
      return style.display !== 'none' && style.visibility !== 'hidden';
    }) as HTMLElement[];
  }, []);

  // Focus first focusable element or specified element
  const focusInitialElement = useCallback(() => {
    if (!containerRef.current) return;

    const focusableElements = getFocusableElements();

    if (initialFocus === 'container') {
      containerRef.current.focus();
    } else if (initialFocus === 'first') {
      focusableElements[0]?.focus();
    } else {
      // Try to find element by selector
      const target = containerRef.current.querySelector(initialFocus) as HTMLElement;
      if (target) {
        target.focus();
      } else {
        focusableElements[0]?.focus();
      }
    }
  }, [initialFocus, getFocusableElements]);

  // Handle tab key to trap focus
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!active) return;

    // Handle escape key
    if (e.key === 'Escape' && onEscape) {
      e.preventDefault();
      onEscape();
      return;
    }

    // Handle tab key
    if (e.key === 'Tab') {
      const focusableElements = getFocusableElements();
      if (focusableElements.length === 0) {
        e.preventDefault();
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey) {
        // Shift + Tab: If on first element, go to last
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab: If on last element, go to first
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    }
  }, [active, getFocusableElements, onEscape]);

  // Handle sentinel focus (for edge cases)
  const handleSentinelFocus = useCallback((position: 'start' | 'end') => {
    const focusableElements = getFocusableElements();
    if (focusableElements.length === 0) return;

    if (position === 'start') {
      focusableElements[focusableElements.length - 1].focus();
    } else {
      focusableElements[0].focus();
    }
  }, [getFocusableElements]);

  // Handle click outside
  const handleClickOutside = useCallback((e: MouseEvent) => {
    if (!active || allowOutsideClick) return;

    if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
      e.preventDefault();
      e.stopPropagation();
      focusInitialElement();
    }
  }, [active, allowOutsideClick, focusInitialElement]);

  // Store previous active element and set initial focus
  useEffect(() => {
    if (!active) return;

    previousActiveElement.current = document.activeElement;
    focusInitialElement();

    return () => {
      if (returnFocusOnDeactivate && previousActiveElement.current) {
        (previousActiveElement.current as HTMLElement).focus?.();
      }
    };
  }, [active, focusInitialElement, returnFocusOnDeactivate]);

  // Add event listeners
  useEffect(() => {
    if (!active) return;

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside, true);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside, true);
    };
  }, [active, handleKeyDown, handleClickOutside]);

  if (!active) {
    return <>{children}</>;
  }

  return (
    <>
      {/* Start sentinel for focus wrapping */}
      <div
        ref={startSentinelRef}
        tabIndex={0}
        onFocus={() => handleSentinelFocus('start')}
        aria-hidden="true"
        style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden' }}
      />

      <div ref={containerRef} tabIndex={-1} className={`outline-none ${className}`}>
        {children}
      </div>

      {/* End sentinel for focus wrapping */}
      <div
        ref={endSentinelRef}
        tabIndex={0}
        onFocus={() => handleSentinelFocus('end')}
        aria-hidden="true"
        style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden' }}
      />
    </>
  );
}

// ============================================================================
// Accessible Modal/Dialog
// ============================================================================

export interface AccessibleModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
  initialFocus?: string;
  className?: string;
}

export function AccessibleModal({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = 'md',
  closeOnOverlayClick = true,
  closeOnEscape = true,
  showCloseButton = true,
  initialFocus,
  className = '',
}: AccessibleModalProps) {
  const titleId = `modal-title-${React.useId()}`;
  const descriptionId = description ? `modal-desc-${React.useId()}` : undefined;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-full mx-4',
  };

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      role="presentation"
      className="fixed inset-0 z-50 overflow-y-auto"
    >
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 transition-opacity"
        aria-hidden="true"
        onClick={closeOnOverlayClick ? onClose : undefined}
      />

      {/* Modal container */}
      <div className="flex min-h-full items-center justify-center p-4">
        <FocusTrap
          active={isOpen}
          onEscape={closeOnEscape ? onClose : undefined}
          initialFocus={initialFocus || 'first'}
          returnFocusOnDeactivate
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={descriptionId}
            className={`
              relative w-full ${sizeClasses[size]}
              bg-white dark:bg-gray-900
              rounded-xl shadow-2xl
              transform transition-all
              ${className}
            `}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h2
                id={titleId}
                className="text-xl font-semibold text-gray-900 dark:text-white"
              >
                {title}
              </h2>
              {showCloseButton && (
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close modal"
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            {/* Description */}
            {description && (
              <p
                id={descriptionId}
                className="px-4 pt-4 text-sm text-gray-500 dark:text-gray-400"
              >
                {description}
              </p>
            )}

            {/* Content */}
            <div className="p-4">
              {children}
            </div>
          </div>
        </FocusTrap>
      </div>
    </div>
  );
}

// ============================================================================
// Focus Management Context
// ============================================================================

interface FocusContextValue {
  pushFocusTrap: (id: string) => void;
  popFocusTrap: (id: string) => void;
  isTopFocusTrap: (id: string) => boolean;
}

const FocusContext = createContext<FocusContextValue | null>(null);

export function FocusProvider({ children }: { children: ReactNode }) {
  const [focusStack, setFocusStack] = useState<string[]>([]);

  const pushFocusTrap = useCallback((id: string) => {
    setFocusStack(prev => [...prev, id]);
  }, []);

  const popFocusTrap = useCallback((id: string) => {
    setFocusStack(prev => prev.filter(i => i !== id));
  }, []);

  const isTopFocusTrap = useCallback((id: string) => {
    return focusStack[focusStack.length - 1] === id;
  }, [focusStack]);

  return (
    <FocusContext.Provider value={{ pushFocusTrap, popFocusTrap, isTopFocusTrap }}>
      {children}
    </FocusContext.Provider>
  );
}

export function useFocusManager() {
  const context = useContext(FocusContext);
  if (!context) {
    throw new Error('useFocusManager must be used within a FocusProvider');
  }
  return context;
}

// ============================================================================
// Focus Return Hook
// ============================================================================

export function useFocusReturn() {
  const previousElement = useRef<HTMLElement | null>(null);

  const saveFocus = useCallback(() => {
    previousElement.current = document.activeElement as HTMLElement;
  }, []);

  const restoreFocus = useCallback(() => {
    if (previousElement.current && typeof previousElement.current.focus === 'function') {
      previousElement.current.focus();
    }
  }, []);

  return { saveFocus, restoreFocus };
}

// ============================================================================
// Roving Tab Index Hook
// ============================================================================

export interface UseRovingTabIndexOptions {
  orientation?: 'horizontal' | 'vertical' | 'both';
  loop?: boolean;
  onSelect?: (index: number) => void;
}

export function useRovingTabIndex(
  itemCount: number,
  options: UseRovingTabIndexOptions = {}
) {
  const { orientation = 'horizontal', loop = true, onSelect } = options;
  const [activeIndex, setActiveIndex] = useState(0);

  const handleKeyDown = useCallback((e: React.KeyboardEvent, currentIndex: number) => {
    let nextIndex: number | null = null;

    const prev = () => {
      if (currentIndex > 0) {
        return currentIndex - 1;
      }
      return loop ? itemCount - 1 : currentIndex;
    };

    const next = () => {
      if (currentIndex < itemCount - 1) {
        return currentIndex + 1;
      }
      return loop ? 0 : currentIndex;
    };

    switch (e.key) {
      case 'ArrowLeft':
        if (orientation === 'horizontal' || orientation === 'both') {
          nextIndex = prev();
        }
        break;
      case 'ArrowRight':
        if (orientation === 'horizontal' || orientation === 'both') {
          nextIndex = next();
        }
        break;
      case 'ArrowUp':
        if (orientation === 'vertical' || orientation === 'both') {
          nextIndex = prev();
        }
        break;
      case 'ArrowDown':
        if (orientation === 'vertical' || orientation === 'both') {
          nextIndex = next();
        }
        break;
      case 'Home':
        nextIndex = 0;
        break;
      case 'End':
        nextIndex = itemCount - 1;
        break;
    }

    if (nextIndex !== null && nextIndex !== currentIndex) {
      e.preventDefault();
      setActiveIndex(nextIndex);
      onSelect?.(nextIndex);
    }
  }, [itemCount, orientation, loop, onSelect]);

  const getItemProps = useCallback((index: number) => ({
    tabIndex: index === activeIndex ? 0 : -1,
    onKeyDown: (e: React.KeyboardEvent) => handleKeyDown(e, index),
    onFocus: () => setActiveIndex(index),
  }), [activeIndex, handleKeyDown]);

  return {
    activeIndex,
    setActiveIndex,
    getItemProps,
  };
}

export type {
  FocusTrapProps,
  AccessibleModalProps,
  FocusContextValue,
  UseRovingTabIndexOptions,
};

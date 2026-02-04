'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  ReactNode,
  CSSProperties,
} from 'react';

// ============================================================================
// Reduced Motion Support
// ============================================================================

export interface ReducedMotionContextValue {
  prefersReducedMotion: boolean;
  userPreference: 'system' | 'reduce' | 'no-preference';
  setUserPreference: (pref: 'system' | 'reduce' | 'no-preference') => void;
  shouldReduceMotion: boolean;
}

const ReducedMotionContext = createContext<ReducedMotionContextValue | null>(null);

const REDUCED_MOTION_STORAGE_KEY = 'user-reduced-motion-preference';

export interface ReducedMotionProviderProps {
  children: ReactNode;
}

export function ReducedMotionProvider({ children }: ReducedMotionProviderProps) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [userPreference, setUserPreferenceState] = useState<'system' | 'reduce' | 'no-preference'>('system');

  // Check system preference
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Load user preference from storage
    const stored = localStorage.getItem(REDUCED_MOTION_STORAGE_KEY);
    if (stored === 'reduce' || stored === 'no-preference') {
      setUserPreferenceState(stored);
    }

    // Check system media query
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const setUserPreference = useCallback((pref: 'system' | 'reduce' | 'no-preference') => {
    setUserPreferenceState(pref);
    if (pref === 'system') {
      localStorage.removeItem(REDUCED_MOTION_STORAGE_KEY);
    } else {
      localStorage.setItem(REDUCED_MOTION_STORAGE_KEY, pref);
    }
  }, []);

  const shouldReduceMotion = useMemo(() => {
    if (userPreference === 'reduce') return true;
    if (userPreference === 'no-preference') return false;
    return prefersReducedMotion;
  }, [userPreference, prefersReducedMotion]);

  const value = useMemo<ReducedMotionContextValue>(() => ({
    prefersReducedMotion,
    userPreference,
    setUserPreference,
    shouldReduceMotion,
  }), [prefersReducedMotion, userPreference, setUserPreference, shouldReduceMotion]);

  return (
    <ReducedMotionContext.Provider value={value}>
      {children}
      {/* CSS for reduced motion */}
      <style jsx global>{`
        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
            scroll-behavior: auto !important;
          }
        }

        .reduce-motion *,
        .reduce-motion *::before,
        .reduce-motion *::after {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
          scroll-behavior: auto !important;
        }
      `}</style>
    </ReducedMotionContext.Provider>
  );
}

export function useReducedMotion() {
  const context = useContext(ReducedMotionContext);
  if (!context) {
    throw new Error('useReducedMotion must be used within a ReducedMotionProvider');
  }
  return context;
}

// Hook for motion-safe styles
export function useMotionSafe<T extends CSSProperties>(
  motionStyles: T,
  reducedStyles?: Partial<T>
): T {
  const { shouldReduceMotion } = useReducedMotion();

  return useMemo(() => {
    if (shouldReduceMotion) {
      return {
        ...motionStyles,
        animation: 'none',
        transition: 'none',
        ...reducedStyles,
      } as T;
    }
    return motionStyles;
  }, [shouldReduceMotion, motionStyles, reducedStyles]);
}

// Component that respects reduced motion
export interface MotionSafeProps {
  children: ReactNode;
  animation?: string;
  transition?: string;
  reducedAnimation?: string;
  reducedTransition?: string;
  className?: string;
  style?: CSSProperties;
}

export function MotionSafe({
  children,
  animation,
  transition,
  reducedAnimation = 'none',
  reducedTransition = 'none',
  className = '',
  style = {},
}: MotionSafeProps) {
  const { shouldReduceMotion } = useReducedMotion();

  const computedStyle: CSSProperties = {
    ...style,
    animation: shouldReduceMotion ? reducedAnimation : animation,
    transition: shouldReduceMotion ? reducedTransition : transition,
  };

  return (
    <div className={className} style={computedStyle}>
      {children}
    </div>
  );
}

// ============================================================================
// Color Contrast Utilities
// ============================================================================

// WCAG 2.1 contrast ratio calculations
export interface RGB {
  r: number;
  g: number;
  b: number;
}

// Convert hex to RGB
export function hexToRgb(hex: string): RGB | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

// Calculate relative luminance
export function getRelativeLuminance(rgb: RGB): number {
  const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

// Calculate contrast ratio
export function getContrastRatio(color1: RGB, color2: RGB): number {
  const l1 = getRelativeLuminance(color1);
  const l2 = getRelativeLuminance(color2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

// Check if contrast meets WCAG requirements
export type WCAGLevel = 'AA' | 'AAA';
export type TextSize = 'normal' | 'large';

export function meetsWCAGContrast(
  ratio: number,
  level: WCAGLevel = 'AA',
  textSize: TextSize = 'normal'
): boolean {
  if (level === 'AAA') {
    return textSize === 'large' ? ratio >= 4.5 : ratio >= 7;
  }
  // AA level
  return textSize === 'large' ? ratio >= 3 : ratio >= 4.5;
}

// Get accessible text color for background
export function getAccessibleTextColor(
  backgroundColor: string,
  lightColor: string = '#ffffff',
  darkColor: string = '#000000'
): string {
  const bgRgb = hexToRgb(backgroundColor);
  if (!bgRgb) return darkColor;

  const lightRgb = hexToRgb(lightColor)!;
  const darkRgb = hexToRgb(darkColor)!;

  const lightContrast = getContrastRatio(bgRgb, lightRgb);
  const darkContrast = getContrastRatio(bgRgb, darkRgb);

  return lightContrast > darkContrast ? lightColor : darkColor;
}

// ============================================================================
// Contrast Checker Component
// ============================================================================

export interface ContrastCheckerProps {
  foreground: string;
  background: string;
  showDetails?: boolean;
  className?: string;
}

export function ContrastChecker({
  foreground,
  background,
  showDetails = true,
  className = '',
}: ContrastCheckerProps) {
  const fgRgb = hexToRgb(foreground);
  const bgRgb = hexToRgb(background);

  if (!fgRgb || !bgRgb) {
    return (
      <div className={`p-4 bg-red-50 dark:bg-red-900/20 rounded-lg ${className}`}>
        <p className="text-red-600">Invalid color format. Use hex colors (e.g., #ffffff)</p>
      </div>
    );
  }

  const ratio = getContrastRatio(fgRgb, bgRgb);
  const passesAANormal = meetsWCAGContrast(ratio, 'AA', 'normal');
  const passesAALarge = meetsWCAGContrast(ratio, 'AA', 'large');
  const passesAAANormal = meetsWCAGContrast(ratio, 'AAA', 'normal');
  const passesAAALarge = meetsWCAGContrast(ratio, 'AAA', 'large');

  return (
    <div className={`p-4 border border-gray-200 dark:border-gray-700 rounded-lg ${className}`}>
      {/* Preview */}
      <div
        className="p-4 rounded-lg mb-2 text-center"
        style={{ backgroundColor: background, color: foreground }}
      >
        <p className="text-lg font-medium">Sample Text</p>
        <p className="text-sm">The quick brown fox jumps over the lazy dog</p>
      </div>

      {/* Contrast ratio */}
      <div className="text-center mb-2">
        <span className="text-3xl font-bold text-gray-900 dark:text-white">
          {ratio.toFixed(2)}
        </span>
        <span className="text-gray-500 ml-1">: 1</span>
      </div>

      {showDetails && (
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className={`p-2 rounded ${passesAANormal ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
            <div className="flex items-center gap-2">
              <span className={passesAANormal ? 'text-green-600' : 'text-red-600'}>
                {passesAANormal ? '✓' : '✗'}
              </span>
              <span className="text-gray-700 dark:text-gray-300">AA Normal</span>
            </div>
            <span className="text-xs text-gray-500">4.5:1</span>
          </div>

          <div className={`p-2 rounded ${passesAALarge ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
            <div className="flex items-center gap-2">
              <span className={passesAALarge ? 'text-green-600' : 'text-red-600'}>
                {passesAALarge ? '✓' : '✗'}
              </span>
              <span className="text-gray-700 dark:text-gray-300">AA Large</span>
            </div>
            <span className="text-xs text-gray-500">3:1</span>
          </div>

          <div className={`p-2 rounded ${passesAAANormal ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
            <div className="flex items-center gap-2">
              <span className={passesAAANormal ? 'text-green-600' : 'text-red-600'}>
                {passesAAANormal ? '✓' : '✗'}
              </span>
              <span className="text-gray-700 dark:text-gray-300">AAA Normal</span>
            </div>
            <span className="text-xs text-gray-500">7:1</span>
          </div>

          <div className={`p-2 rounded ${passesAAALarge ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
            <div className="flex items-center gap-2">
              <span className={passesAAALarge ? 'text-green-600' : 'text-red-600'}>
                {passesAAALarge ? '✓' : '✗'}
              </span>
              <span className="text-gray-700 dark:text-gray-300">AAA Large</span>
            </div>
            <span className="text-xs text-gray-500">4.5:1</span>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// High Contrast Mode
// ============================================================================

export interface HighContrastContextValue {
  isHighContrast: boolean;
  setHighContrast: (enabled: boolean) => void;
  contrastLevel: 'normal' | 'more' | 'less';
  setContrastLevel: (level: 'normal' | 'more' | 'less') => void;
}

const HighContrastContext = createContext<HighContrastContextValue | null>(null);

const HIGH_CONTRAST_STORAGE_KEY = 'user-high-contrast-preference';

export interface HighContrastProviderProps {
  children: ReactNode;
}

export function HighContrastProvider({ children }: HighContrastProviderProps) {
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [contrastLevel, setContrastLevelState] = useState<'normal' | 'more' | 'less'>('normal');

  // Check system preference and load user preference
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Load user preference
    const stored = localStorage.getItem(HIGH_CONTRAST_STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setIsHighContrast(parsed.enabled || false);
        setContrastLevelState(parsed.level || 'normal');
      } catch {
        // Invalid stored value
      }
    }

    // Check for Windows high contrast mode
    const mediaQuery = window.matchMedia('(forced-colors: active)');
    if (mediaQuery.matches) {
      setIsHighContrast(true);
    }

    const handleChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        setIsHighContrast(true);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const setHighContrast = useCallback((enabled: boolean) => {
    setIsHighContrast(enabled);
    localStorage.setItem(HIGH_CONTRAST_STORAGE_KEY, JSON.stringify({
      enabled,
      level: contrastLevel,
    }));
  }, [contrastLevel]);

  const setContrastLevel = useCallback((level: 'normal' | 'more' | 'less') => {
    setContrastLevelState(level);
    localStorage.setItem(HIGH_CONTRAST_STORAGE_KEY, JSON.stringify({
      enabled: isHighContrast,
      level,
    }));
  }, [isHighContrast]);

  // Apply high contrast class to document
  useEffect(() => {
    if (typeof document === 'undefined') return;

    if (isHighContrast) {
      document.documentElement.classList.add('high-contrast');
      document.documentElement.setAttribute('data-contrast', contrastLevel);
    } else {
      document.documentElement.classList.remove('high-contrast');
      document.documentElement.removeAttribute('data-contrast');
    }
  }, [isHighContrast, contrastLevel]);

  const value = useMemo<HighContrastContextValue>(() => ({
    isHighContrast,
    setHighContrast,
    contrastLevel,
    setContrastLevel,
  }), [isHighContrast, setHighContrast, contrastLevel, setContrastLevel]);

  return (
    <HighContrastContext.Provider value={value}>
      {children}
      {/* High contrast CSS overrides */}
      <style jsx global>{`
        .high-contrast {
          --text-primary: #000000;
          --text-secondary: #333333;
          --bg-primary: #ffffff;
          --border-color: #000000;
        }

        .high-contrast[data-contrast="more"] {
          --text-primary: #000000;
          --text-secondary: #000000;
          --bg-primary: #ffffff;
          --border-color: #000000;
        }

        @media (prefers-color-scheme: dark) {
          .high-contrast {
            --text-primary: #ffffff;
            --text-secondary: #cccccc;
            --bg-primary: #000000;
            --border-color: #ffffff;
          }

          .high-contrast[data-contrast="more"] {
            --text-primary: #ffffff;
            --text-secondary: #ffffff;
            --bg-primary: #000000;
            --border-color: #ffffff;
          }
        }

        /* Force borders in high contrast mode */
        .high-contrast button,
        .high-contrast input,
        .high-contrast select,
        .high-contrast textarea,
        .high-contrast [role="button"] {
          border: 2px solid var(--border-color) !important;
        }

        /* Ensure focus indicators are visible */
        .high-contrast *:focus {
          outline: 3px solid var(--border-color) !important;
          outline-offset: 2px !important;
        }
      `}</style>
    </HighContrastContext.Provider>
  );
}

export function useHighContrast() {
  const context = useContext(HighContrastContext);
  if (!context) {
    throw new Error('useHighContrast must be used within a HighContrastProvider');
  }
  return context;
}

// ============================================================================
// Accessibility Settings Panel
// ============================================================================

export interface AccessibilitySettingsProps {
  className?: string;
}

export function AccessibilitySettings({ className = '' }: AccessibilitySettingsProps) {
  const { shouldReduceMotion, userPreference, setUserPreference } = useReducedMotion();
  const { isHighContrast, setHighContrast, contrastLevel, setContrastLevel } = useHighContrast();

  return (
    <div className={`space-y-3 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Accessibility Settings
      </h3>

      {/* Reduced Motion */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Motion Preference
        </label>
        <div className="flex flex-wrap gap-2">
          {(['system', 'reduce', 'no-preference'] as const).map(pref => (
            <button
              key={pref}
              onClick={() => setUserPreference(pref)}
              className={`
                px-4 py-2 rounded-lg text-sm font-medium
                ${userPreference === pref
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                }
              `}
            >
              {pref === 'system' ? 'System Default' : pref === 'reduce' ? 'Reduce Motion' : 'Allow Motion'}
            </button>
          ))}
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Current: {shouldReduceMotion ? 'Motion is reduced' : 'Motion is allowed'}
        </p>
      </div>

      {/* High Contrast */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          High Contrast Mode
        </label>
        <button
          onClick={() => setHighContrast(!isHighContrast)}
          className={`
            px-4 py-2 rounded-lg text-sm font-medium
            ${isHighContrast
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
            }
          `}
        >
          {isHighContrast ? 'Enabled' : 'Disabled'}
        </button>

        {isHighContrast && (
          <div className="flex flex-wrap gap-2 mt-2">
            {(['normal', 'more', 'less'] as const).map(level => (
              <button
                key={level}
                onClick={() => setContrastLevel(level)}
                className={`
                  px-3 py-1.5 rounded text-sm
                  ${contrastLevel === level
                    ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }
                `}
              >
                {level.charAt(0).toUpperCase() + level.slice(1)} Contrast
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


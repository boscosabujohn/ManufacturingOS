'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';

// Types
export type ThemeMode = 'light' | 'dark' | 'system';
export type ColorTheme = 'blue' | 'green' | 'purple' | 'orange' | 'red';

export interface BrandingConfig {
  logoUrl?: string;
  logoAlt?: string;
  companyName?: string;
  primaryColor?: string;
  accentColor?: string;
  faviconUrl?: string;
}

export interface ThemeConfig {
  mode: ThemeMode;
  colorTheme: ColorTheme;
  highContrast: boolean;
  branding: BrandingConfig;
}

interface ThemeContextValue {
  config: ThemeConfig;
  effectiveMode: 'light' | 'dark';
  setMode: (mode: ThemeMode) => void;
  setColorTheme: (theme: ColorTheme) => void;
  setHighContrast: (enabled: boolean) => void;
  setBranding: (branding: Partial<BrandingConfig>) => void;
  resetToDefaults: () => void;
  toggleMode: () => void;
}

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultConfig?: Partial<ThemeConfig>;
  storageKey?: string;
}

// Color theme CSS variables
const colorThemeVariables: Record<ColorTheme, Record<string, string>> = {
  blue: {
    '--color-primary-50': '#eff6ff',
    '--color-primary-100': '#dbeafe',
    '--color-primary-200': '#bfdbfe',
    '--color-primary-300': '#93c5fd',
    '--color-primary-400': '#60a5fa',
    '--color-primary-500': '#3b82f6',
    '--color-primary-600': '#2563eb',
    '--color-primary-700': '#1d4ed8',
    '--color-primary-800': '#1e40af',
    '--color-primary-900': '#1e3a8a',
  },
  green: {
    '--color-primary-50': '#f0fdf4',
    '--color-primary-100': '#dcfce7',
    '--color-primary-200': '#bbf7d0',
    '--color-primary-300': '#86efac',
    '--color-primary-400': '#4ade80',
    '--color-primary-500': '#22c55e',
    '--color-primary-600': '#16a34a',
    '--color-primary-700': '#15803d',
    '--color-primary-800': '#166534',
    '--color-primary-900': '#14532d',
  },
  purple: {
    '--color-primary-50': '#faf5ff',
    '--color-primary-100': '#f3e8ff',
    '--color-primary-200': '#e9d5ff',
    '--color-primary-300': '#d8b4fe',
    '--color-primary-400': '#c084fc',
    '--color-primary-500': '#a855f7',
    '--color-primary-600': '#9333ea',
    '--color-primary-700': '#7e22ce',
    '--color-primary-800': '#6b21a8',
    '--color-primary-900': '#581c87',
  },
  orange: {
    '--color-primary-50': '#fff7ed',
    '--color-primary-100': '#ffedd5',
    '--color-primary-200': '#fed7aa',
    '--color-primary-300': '#fdba74',
    '--color-primary-400': '#fb923c',
    '--color-primary-500': '#f97316',
    '--color-primary-600': '#ea580c',
    '--color-primary-700': '#c2410c',
    '--color-primary-800': '#9a3412',
    '--color-primary-900': '#7c2d12',
  },
  red: {
    '--color-primary-50': '#fef2f2',
    '--color-primary-100': '#fee2e2',
    '--color-primary-200': '#fecaca',
    '--color-primary-300': '#fca5a5',
    '--color-primary-400': '#f87171',
    '--color-primary-500': '#ef4444',
    '--color-primary-600': '#dc2626',
    '--color-primary-700': '#b91c1c',
    '--color-primary-800': '#991b1b',
    '--color-primary-900': '#7f1d1d',
  },
};

// High contrast overrides
const highContrastOverrides = {
  light: {
    '--text-primary': '#000000',
    '--text-secondary': '#1f2937',
    '--bg-primary': '#ffffff',
    '--border-color': '#000000',
  },
  dark: {
    '--text-primary': '#ffffff',
    '--text-secondary': '#e5e7eb',
    '--bg-primary': '#000000',
    '--border-color': '#ffffff',
  },
};

// Default configuration
const defaultThemeConfig: ThemeConfig = {
  mode: 'system',
  colorTheme: 'blue',
  highContrast: false,
  branding: {},
};

// Create context
const ThemeContext = createContext<ThemeContextValue | null>(null);

// Storage helper functions
function getStoredConfig(key: string): Partial<ThemeConfig> | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

function setStoredConfig(key: string, config: ThemeConfig): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(config));
  } catch (e) {
    console.error('Failed to save theme config:', e);
  }
}

// Provider component
export function ThemeProvider({
  children,
  defaultConfig = {},
  storageKey = 'manufacturingos-theme',
}: ThemeProviderProps) {
  const [config, setConfig] = useState<ThemeConfig>(() => ({
    ...defaultThemeConfig,
    ...defaultConfig,
  }));
  const [systemPreference, setSystemPreference] = useState<'light' | 'dark'>('light');
  const [isHydrated, setIsHydrated] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = getStoredConfig(storageKey);
    if (stored) {
      setConfig((prev) => ({ ...prev, ...stored }));
    }

    // Detect system preference
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setSystemPreference(mediaQuery.matches ? 'dark' : 'light');

    const handler = (e: MediaQueryListEvent) => {
      setSystemPreference(e.matches ? 'dark' : 'light');
    };
    mediaQuery.addEventListener('change', handler);
    setIsHydrated(true);

    return () => mediaQuery.removeEventListener('change', handler);
  }, [storageKey]);

  // Calculate effective mode
  const effectiveMode = config.mode === 'system' ? systemPreference : config.mode;

  // Apply theme changes to DOM
  useEffect(() => {
    if (!isHydrated) return;

    const root = document.documentElement;

    // Apply dark mode
    root.classList.toggle('dark', effectiveMode === 'dark');

    // Apply color theme variables
    const themeVars = colorThemeVariables[config.colorTheme];
    Object.entries(themeVars).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });

    // Apply high contrast overrides
    if (config.highContrast) {
      const contrastVars = highContrastOverrides[effectiveMode];
      Object.entries(contrastVars).forEach(([key, value]) => {
        root.style.setProperty(key, value);
      });
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
      // Remove high contrast variables
      Object.keys(highContrastOverrides.light).forEach((key) => {
        root.style.removeProperty(key);
      });
    }

    // Apply custom branding color if set
    if (config.branding.primaryColor) {
      root.style.setProperty('--color-brand-primary', config.branding.primaryColor);
    }
    if (config.branding.accentColor) {
      root.style.setProperty('--color-brand-accent', config.branding.accentColor);
    }

    // Save to localStorage
    setStoredConfig(storageKey, config);
  }, [config, effectiveMode, isHydrated, storageKey]);

  // Context actions
  const setMode = useCallback((mode: ThemeMode) => {
    setConfig((prev) => ({ ...prev, mode }));
  }, []);

  const setColorTheme = useCallback((colorTheme: ColorTheme) => {
    setConfig((prev) => ({ ...prev, colorTheme }));
  }, []);

  const setHighContrast = useCallback((highContrast: boolean) => {
    setConfig((prev) => ({ ...prev, highContrast }));
  }, []);

  const setBranding = useCallback((branding: Partial<BrandingConfig>) => {
    setConfig((prev) => ({
      ...prev,
      branding: { ...prev.branding, ...branding },
    }));
  }, []);

  const resetToDefaults = useCallback(() => {
    setConfig(defaultThemeConfig);
  }, []);

  const toggleMode = useCallback(() => {
    setConfig((prev) => ({
      ...prev,
      mode: prev.mode === 'light' ? 'dark' : prev.mode === 'dark' ? 'system' : 'light',
    }));
  }, []);

  // Memoize context value
  const contextValue = useMemo<ThemeContextValue>(
    () => ({
      config,
      effectiveMode,
      setMode,
      setColorTheme,
      setHighContrast,
      setBranding,
      resetToDefaults,
      toggleMode,
    }),
    [config, effectiveMode, setMode, setColorTheme, setHighContrast, setBranding, resetToDefaults, toggleMode]
  );

  // Prevent flash of wrong theme
  if (!isHydrated) {
    return (
      <div style={{ visibility: 'hidden' }}>
        {children}
      </div>
    );
  }

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

// Hook to use theme context
export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// Hook for simple theme mode toggle
export function useThemeMode(): {
  mode: ThemeMode;
  effectiveMode: 'light' | 'dark';
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
  isDark: boolean;
} {
  const { config, effectiveMode, setMode, toggleMode } = useTheme();
  return {
    mode: config.mode,
    effectiveMode,
    setMode,
    toggleMode,
    isDark: effectiveMode === 'dark',
  };
}

// Hook for color theme
export function useColorTheme(): {
  colorTheme: ColorTheme;
  setColorTheme: (theme: ColorTheme) => void;
  availableThemes: ColorTheme[];
} {
  const { config, setColorTheme } = useTheme();
  return {
    colorTheme: config.colorTheme,
    setColorTheme,
    availableThemes: ['blue', 'green', 'purple', 'orange', 'red'],
  };
}

// Hook for branding
export function useBranding(): {
  branding: BrandingConfig;
  setBranding: (branding: Partial<BrandingConfig>) => void;
} {
  const { config, setBranding } = useTheme();
  return {
    branding: config.branding,
    setBranding,
  };
}

// Hook for accessibility settings
export function useAccessibility(): {
  highContrast: boolean;
  setHighContrast: (enabled: boolean) => void;
  toggleHighContrast: () => void;
} {
  const { config, setHighContrast } = useTheme();
  return {
    highContrast: config.highContrast,
    setHighContrast,
    toggleHighContrast: () => setHighContrast(!config.highContrast),
  };
}

export type { ThemeContextValue, ThemeProviderProps };

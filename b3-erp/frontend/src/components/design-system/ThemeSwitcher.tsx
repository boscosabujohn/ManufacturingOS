'use client';

import React, { useState, useEffect } from 'react';
import {
  Sun,
  Moon,
  Monitor,
  Check,
  Palette,
  Eye,
  Settings,
  ChevronDown,
} from 'lucide-react';

// Types
export type ThemeMode = 'light' | 'dark' | 'system';
export type ColorTheme = 'blue' | 'green' | 'purple' | 'orange' | 'red';

interface ThemeConfig {
  mode: ThemeMode;
  colorTheme: ColorTheme;
  highContrast: boolean;
}

interface ThemeSwitcherProps {
  className?: string;
  variant?: 'dropdown' | 'inline' | 'compact';
  showColorThemes?: boolean;
  showHighContrast?: boolean;
  onThemeChange?: (config: ThemeConfig) => void;
  initialConfig?: Partial<ThemeConfig>;
}

// Theme configurations
const themeModes: { mode: ThemeMode; label: string; icon: React.ReactNode; description: string }[] = [
  { mode: 'light', label: 'Light', icon: <Sun className="w-4 h-4" />, description: 'Always use light mode' },
  { mode: 'dark', label: 'Dark', icon: <Moon className="w-4 h-4" />, description: 'Always use dark mode' },
  { mode: 'system', label: 'System', icon: <Monitor className="w-4 h-4" />, description: 'Match system preference' },
];

const colorThemes: { theme: ColorTheme; label: string; primary: string; secondary: string }[] = [
  { theme: 'blue', label: 'Blue', primary: '#3b82f6', secondary: '#60a5fa' },
  { theme: 'green', label: 'Green', primary: '#22c55e', secondary: '#4ade80' },
  { theme: 'purple', label: 'Purple', primary: '#8b5cf6', secondary: '#a78bfa' },
  { theme: 'orange', label: 'Orange', primary: '#f97316', secondary: '#fb923c' },
  { theme: 'red', label: 'Red', primary: '#ef4444', secondary: '#f87171' },
];

const STORAGE_KEY = 'manufacturingos-theme';

export function ThemeSwitcher({
  className = '',
  variant = 'dropdown',
  showColorThemes = true,
  showHighContrast = true,
  onThemeChange,
  initialConfig,
}: ThemeSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState<ThemeConfig>({
    mode: initialConfig?.mode || 'system',
    colorTheme: initialConfig?.colorTheme || 'blue',
    highContrast: initialConfig?.highContrast || false,
  });
  const [systemPreference, setSystemPreference] = useState<'light' | 'dark'>('light');

  // Load saved preferences
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setConfig((prev) => ({ ...prev, ...parsed }));
      } catch (e) {
        console.error('Failed to parse theme config:', e);
      }
    }

    // Detect system preference
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setSystemPreference(mediaQuery.matches ? 'dark' : 'light');

    const handler = (e: MediaQueryListEvent) => {
      setSystemPreference(e.matches ? 'dark' : 'light');
    };
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Apply theme changes
  useEffect(() => {
    const effectiveMode = config.mode === 'system' ? systemPreference : config.mode;

    // Apply dark mode class
    document.documentElement.classList.toggle('dark', effectiveMode === 'dark');

    // Apply high contrast mode
    document.documentElement.classList.toggle('high-contrast', config.highContrast);

    // Apply color theme CSS variables
    const theme = colorThemes.find((t) => t.theme === config.colorTheme);
    if (theme) {
      document.documentElement.style.setProperty('--color-primary', theme.primary);
      document.documentElement.style.setProperty('--color-primary-light', theme.secondary);
    }

    // Save to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));

    // Notify parent
    onThemeChange?.(config);
  }, [config, systemPreference, onThemeChange]);

  const updateConfig = (updates: Partial<ThemeConfig>) => {
    setConfig((prev) => ({ ...prev, ...updates }));
  };

  const effectiveMode = config.mode === 'system' ? systemPreference : config.mode;
  const currentModeConfig = themeModes.find((m) => m.mode === config.mode);
  const currentTheme = colorThemes.find((t) => t.theme === config.colorTheme);

  // Compact variant - just icons
  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-1 ${className}`}>
        {/* Mode toggle */}
        <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
          {themeModes.map(({ mode, icon }) => (
            <button
              key={mode}
              onClick={() => updateConfig({ mode })}
              className={`p-2 rounded-md transition-colors ${
                config.mode === mode
                  ? 'bg-white dark:bg-gray-700 shadow text-gray-900 dark:text-white'
                  : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
              title={mode.charAt(0).toUpperCase() + mode.slice(1)}
            >
              {icon}
            </button>
          ))}
        </div>

        {/* Color theme dots */}
        {showColorThemes && (
          <div className="flex items-center gap-1 ml-2">
            {colorThemes.map(({ theme, primary }) => (
              <button
                key={theme}
                onClick={() => updateConfig({ colorTheme: theme })}
                className={`w-5 h-5 rounded-full transition-transform ${
                  config.colorTheme === theme ? 'ring-2 ring-offset-2 ring-gray-400 scale-110' : ''
                }`}
                style={{ backgroundColor: primary }}
                title={theme.charAt(0).toUpperCase() + theme.slice(1)}
              />
            ))}
          </div>
        )}

        {/* High contrast toggle */}
        {showHighContrast && (
          <button
            onClick={() => updateConfig({ highContrast: !config.highContrast })}
            className={`ml-2 p-2 rounded-md transition-colors ${
              config.highContrast
                ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-500'
            }`}
            title="High Contrast Mode"
          >
            <Eye className="w-4 h-4" />
          </button>
        )}
      </div>
    );
  }

  // Inline variant - expanded view
  if (variant === 'inline') {
    return (
      <div className={`bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-4 ${className}`}>
        {/* Mode Selection */}
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Appearance</h4>
          <div className="grid grid-cols-3 gap-2">
            {themeModes.map(({ mode, label, icon }) => (
              <button
                key={mode}
                onClick={() => updateConfig({ mode })}
                className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all ${
                  config.mode === mode
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                }`}
              >
                <span className={config.mode === mode ? 'text-blue-600' : 'text-gray-500'}>
                  {icon}
                </span>
                <span className={`text-sm ${config.mode === mode ? 'text-blue-600 font-medium' : 'text-gray-600 dark:text-gray-400'}`}>
                  {label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Color Theme Selection */}
        {showColorThemes && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Color Theme</h4>
            <div className="flex items-center gap-3">
              {colorThemes.map(({ theme, label, primary }) => (
                <button
                  key={theme}
                  onClick={() => updateConfig({ colorTheme: theme })}
                  className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all ${
                    config.colorTheme === theme
                      ? 'bg-gray-100 dark:bg-gray-800'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      config.colorTheme === theme ? 'ring-2 ring-offset-2' : ''
                    }`}
                    style={{ backgroundColor: primary, ringColor: primary }}
                  >
                    {config.colorTheme === theme && <Check className="w-4 h-4 text-white" />}
                  </div>
                  <span className="text-xs text-gray-600 dark:text-gray-400">{label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* High Contrast Toggle */}
        {showHighContrast && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-gray-500" />
              <div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  High Contrast Mode
                </span>
                <p className="text-xs text-gray-500">Increases contrast for accessibility</p>
              </div>
            </div>
            <button
              onClick={() => updateConfig({ highContrast: !config.highContrast })}
              className={`relative w-11 h-6 rounded-full transition-colors ${
                config.highContrast ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                  config.highContrast ? 'translate-x-5' : ''
                }`}
              />
            </button>
          </div>
        )}
      </div>
    );
  }

  // Dropdown variant (default)
  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
      >
        <span className="text-gray-700 dark:text-gray-300">{currentModeConfig?.icon}</span>
        <span className="text-sm text-gray-700 dark:text-gray-300">{currentModeConfig?.label}</span>
        {showColorThemes && currentTheme && (
          <div
            className="w-4 h-4 rounded-full border border-gray-300"
            style={{ backgroundColor: currentTheme.primary }}
          />
        )}
        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-full mt-2 w-72 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
            {/* Mode Selection */}
            <div className="p-3 border-b border-gray-200 dark:border-gray-700">
              <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                Appearance
              </h4>
              <div className="space-y-1">
                {themeModes.map(({ mode, label, icon, description }) => (
                  <button
                    key={mode}
                    onClick={() => updateConfig({ mode })}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                      config.mode === mode
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {icon}
                    <div className="flex-1 text-left">
                      <div className="text-sm font-medium">{label}</div>
                      <div className="text-xs text-gray-500">{description}</div>
                    </div>
                    {config.mode === mode && <Check className="w-4 h-4" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Themes */}
            {showColorThemes && (
              <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                  <Palette className="w-3 h-3" />
                  Color Theme
                </h4>
                <div className="flex items-center justify-between">
                  {colorThemes.map(({ theme, label, primary }) => (
                    <button
                      key={theme}
                      onClick={() => updateConfig({ colorTheme: theme })}
                      className="flex flex-col items-center gap-1 p-1"
                      title={label}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform ${
                          config.colorTheme === theme ? 'ring-2 ring-offset-2 scale-110' : 'hover:scale-105'
                        }`}
                        style={{ backgroundColor: primary, ringColor: primary }}
                      >
                        {config.colorTheme === theme && <Check className="w-4 h-4 text-white" />}
                      </div>
                      <span className="text-xs text-gray-500">{label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* High Contrast */}
            {showHighContrast && (
              <div className="p-3">
                <button
                  onClick={() => updateConfig({ highContrast: !config.highContrast })}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Eye className="w-4 h-4 text-gray-500" />
                    <div className="text-left">
                      <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        High Contrast
                      </div>
                      <div className="text-xs text-gray-500">For accessibility needs</div>
                    </div>
                  </div>
                  <div
                    className={`w-9 h-5 rounded-full transition-colors ${
                      config.highContrast ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  >
                    <span
                      className={`block w-4 h-4 mt-0.5 ml-0.5 bg-white rounded-full transition-transform ${
                        config.highContrast ? 'translate-x-4' : ''
                      }`}
                    />
                  </div>
                </button>
              </div>
            )}

            {/* Current state indicator */}
            <div className="px-3 py-2 bg-gray-50 dark:bg-gray-900 rounded-b-lg border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Settings className="w-3 h-3" />
                <span>
                  Current: {effectiveMode.charAt(0).toUpperCase() + effectiveMode.slice(1)} mode
                  {config.mode === 'system' && ` (${systemPreference})`}
                </span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export type { ThemeConfig, ThemeSwitcherProps };

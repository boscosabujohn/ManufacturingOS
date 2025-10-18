'use client'

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { Moon, Sun, Monitor, Palette, Settings, Check } from 'lucide-react'

// ============= Theme Types =============
export type ThemeMode = 'light' | 'dark' | 'system'
export type ColorScheme = 'blue' | 'green' | 'purple' | 'orange' | 'red'

interface ThemeConfig {
  mode: ThemeMode
  colorScheme: ColorScheme
  highContrast: boolean
  reducedMotion: boolean
}

interface ThemeContextType {
  theme: ThemeConfig
  isDark: boolean
  setMode: (mode: ThemeMode) => void
  setColorScheme: (scheme: ColorScheme) => void
  setHighContrast: (enabled: boolean) => void
  setReducedMotion: (enabled: boolean) => void
  toggleMode: () => void
}

// ============= Theme Context =============
const ThemeContext = createContext<ThemeContextType | null>(null)

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}

// ============= Theme Provider =============
export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeConfig>({
    mode: 'system',
    colorScheme: 'blue',
    highContrast: false,
    reducedMotion: false
  })

  const [isDark, setIsDark] = useState(false)

  // Detect system preference
  const getSystemPreference = (): boolean => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    return false
  }

  // Apply theme to document
  const applyTheme = (themeConfig: ThemeConfig, systemDark: boolean) => {
    const root = document.documentElement
    const actualDark = themeConfig.mode === 'dark' || (themeConfig.mode === 'system' && systemDark)

    setIsDark(actualDark)

    // Apply dark mode class
    if (actualDark) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }

    // Apply color scheme
    root.classList.remove('theme-blue', 'theme-green', 'theme-purple', 'theme-orange', 'theme-red')
    root.classList.add(`theme-${themeConfig.colorScheme}`)

    // Apply accessibility preferences
    if (themeConfig.highContrast) {
      root.classList.add('high-contrast')
    } else {
      root.classList.remove('high-contrast')
    }

    if (themeConfig.reducedMotion) {
      root.classList.add('reduced-motion')
    } else {
      root.classList.remove('reduced-motion')
    }

    // Store in localStorage
    localStorage.setItem('procurement-theme', JSON.stringify(themeConfig))
  }

  // Load theme from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('procurement-theme')
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        setTheme(parsed)
        applyTheme(parsed, getSystemPreference())
      } catch (error) {
        console.warn('Failed to parse stored theme:', error)
      }
    } else {
      applyTheme(theme, getSystemPreference())
    }

    // Listen for system preference changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (e: MediaQueryListEvent) => {
      setTheme(current => {
        applyTheme(current, e.matches)
        return current
      })
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  // Update theme when it changes
  useEffect(() => {
    applyTheme(theme, getSystemPreference())
  }, [theme])

  const setMode = (mode: ThemeMode) => {
    setTheme(prev => ({ ...prev, mode }))
  }

  const setColorScheme = (colorScheme: ColorScheme) => {
    setTheme(prev => ({ ...prev, colorScheme }))
  }

  const setHighContrast = (highContrast: boolean) => {
    setTheme(prev => ({ ...prev, highContrast }))
  }

  const setReducedMotion = (reducedMotion: boolean) => {
    setTheme(prev => ({ ...prev, reducedMotion }))
  }

  const toggleMode = () => {
    const modes: ThemeMode[] = ['light', 'dark', 'system']
    const currentIndex = modes.indexOf(theme.mode)
    const nextIndex = (currentIndex + 1) % modes.length
    setMode(modes[nextIndex])
  }

  return (
    <ThemeContext.Provider
      value={{
        theme,
        isDark,
        setMode,
        setColorScheme,
        setHighContrast,
        setReducedMotion,
        toggleMode
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

// ============= Theme Toggle Button =============
export const ThemeToggle: React.FC<{ size?: 'sm' | 'md' | 'lg'; className?: string }> = ({
  size = 'md',
  className = ''
}) => {
  const { theme, toggleMode } = useTheme()

  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-10 w-10'
  }

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  }

  const getIcon = () => {
    switch (theme.mode) {
      case 'light':
        return <Sun className={iconSizes[size]} />
      case 'dark':
        return <Moon className={iconSizes[size]} />
      case 'system':
        return <Monitor className={iconSizes[size]} />
      default:
        return <Sun className={iconSizes[size]} />
    }
  }

  const getLabel = () => {
    switch (theme.mode) {
      case 'light':
        return 'Switch to dark mode'
      case 'dark':
        return 'Switch to system mode'
      case 'system':
        return 'Switch to light mode'
      default:
        return 'Toggle theme'
    }
  }

  return (
    <button
      onClick={toggleMode}
      className={`${sizeClasses[size]} rounded-lg flex items-center justify-center transition-colors
        bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700
        text-gray-700 dark:text-gray-300 ${className}`}
      title={getLabel()}
      aria-label={getLabel()}
    >
      {getIcon()}
    </button>
  )
}

// ============= Theme Settings Panel =============
export const ThemeSettingsPanel: React.FC<{
  isOpen: boolean
  onClose: () => void
}> = ({ isOpen, onClose }) => {
  const {
    theme,
    setMode,
    setColorScheme,
    setHighContrast,
    setReducedMotion
  } = useTheme()

  const colorSchemes: Array<{ key: ColorScheme; name: string; color: string }> = [
    { key: 'blue', name: 'Blue', color: 'bg-blue-500' },
    { key: 'green', name: 'Green', color: 'bg-green-500' },
    { key: 'purple', name: 'Purple', color: 'bg-purple-500' },
    { key: 'orange', name: 'Orange', color: 'bg-orange-500' },
    { key: 'red', name: 'Red', color: 'bg-red-500' }
  ]

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div
          className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70"
          onClick={onClose}
        />
        <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Palette className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Theme Settings
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                <Settings className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>
          </div>

          <div className="px-6 py-4 space-y-6">
            {/* Theme Mode */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                Appearance
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { mode: 'light' as ThemeMode, icon: Sun, label: 'Light' },
                  { mode: 'dark' as ThemeMode, icon: Moon, label: 'Dark' },
                  { mode: 'system' as ThemeMode, icon: Monitor, label: 'System' }
                ].map(({ mode, icon: Icon, label }) => (
                  <button
                    key={mode}
                    onClick={() => setMode(mode)}
                    className={`relative p-3 rounded-lg border-2 transition-colors ${
                      theme.mode === mode
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                    }`}
                  >
                    <Icon className="h-5 w-5 mx-auto mb-2 text-gray-700 dark:text-gray-300" />
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {label}
                    </div>
                    {theme.mode === mode && (
                      <div className="absolute top-2 right-2">
                        <Check className="h-4 w-4 text-blue-500" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Scheme */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                Color Scheme
              </h3>
              <div className="grid grid-cols-5 gap-3">
                {colorSchemes.map(({ key, name, color }) => (
                  <button
                    key={key}
                    onClick={() => setColorScheme(key)}
                    className={`relative p-3 rounded-lg border-2 transition-colors ${
                      theme.colorScheme === key
                        ? 'border-gray-400 dark:border-gray-500'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                    }`}
                    title={name}
                  >
                    <div className={`h-6 w-6 rounded-full ${color} mx-auto`} />
                    {theme.colorScheme === key && (
                      <div className="absolute top-1 right-1">
                        <Check className="h-3 w-3 text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Accessibility Options */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                Accessibility
              </h3>
              <div className="space-y-3">
                <label className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      High Contrast
                    </span>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Increase contrast for better visibility
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={theme.highContrast}
                    onChange={(e) => setHighContrast(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </label>

                <label className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      Reduced Motion
                    </span>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Minimize animations and transitions
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={theme.reducedMotion}
                    onChange={(e) => setReducedMotion(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 rounded-b-lg">
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Theme preferences are saved automatically and will persist across sessions.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============= Theme-aware Component Wrapper =============
export const ThemeAware: React.FC<{
  children: ReactNode
  lightClass?: string
  darkClass?: string
  className?: string
}> = ({ children, lightClass = '', darkClass = '', className = '' }) => {
  const { isDark } = useTheme()

  const appliedClass = isDark ? darkClass : lightClass

  return (
    <div className={`${appliedClass} ${className}`}>
      {children}
    </div>
  )
}

// ============= Color Scheme CSS Variables =============
export const ColorSchemeStyles: React.FC = () => {
  return (
    <style jsx global>{`
      /* Light Theme Color Schemes */
      .theme-blue {
        --primary-50: #eff6ff;
        --primary-100: #dbeafe;
        --primary-500: #3b82f6;
        --primary-600: #2563eb;
        --primary-700: #1d4ed8;
        --primary-900: #1e3a8a;
      }

      .theme-green {
        --primary-50: #f0fdf4;
        --primary-100: #dcfce7;
        --primary-500: #22c55e;
        --primary-600: #16a34a;
        --primary-700: #15803d;
        --primary-900: #14532d;
      }

      .theme-purple {
        --primary-50: #faf5ff;
        --primary-100: #f3e8ff;
        --primary-500: #a855f7;
        --primary-600: #9333ea;
        --primary-700: #7c3aed;
        --primary-900: #581c87;
      }

      .theme-orange {
        --primary-50: #fff7ed;
        --primary-100: #ffedd5;
        --primary-500: #f97316;
        --primary-600: #ea580c;
        --primary-700: #c2410c;
        --primary-900: #9a3412;
      }

      .theme-red {
        --primary-50: #fef2f2;
        --primary-100: #fee2e2;
        --primary-500: #ef4444;
        --primary-600: #dc2626;
        --primary-700: #b91c1c;
        --primary-900: #7f1d1d;
      }

      /* High Contrast Mode */
      .high-contrast {
        --gray-50: #ffffff;
        --gray-100: #f5f5f5;
        --gray-900: #000000;
        filter: contrast(1.5);
      }

      /* Reduced Motion */
      .reduced-motion * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
        scroll-behavior: auto !important;
      }

      /* Dark Mode Specific Styles */
      .dark {
        color-scheme: dark;
      }

      .dark .theme-blue {
        --primary-50: #1e3a8a;
        --primary-100: #1d4ed8;
        --primary-500: #3b82f6;
        --primary-600: #60a5fa;
        --primary-700: #93c5fd;
        --primary-900: #dbeafe;
      }

      .dark .theme-green {
        --primary-50: #14532d;
        --primary-100: #15803d;
        --primary-500: #22c55e;
        --primary-600: #4ade80;
        --primary-700: #86efac;
        --primary-900: #dcfce7;
      }

      .dark .theme-purple {
        --primary-50: #581c87;
        --primary-100: #7c3aed;
        --primary-500: #a855f7;
        --primary-600: #c084fc;
        --primary-700: #d8b4fe;
        --primary-900: #f3e8ff;
      }

      .dark .theme-orange {
        --primary-50: #9a3412;
        --primary-100: #c2410c;
        --primary-500: #f97316;
        --primary-600: #fb923c;
        --primary-700: #fdba74;
        --primary-900: #ffedd5;
      }

      .dark .theme-red {
        --primary-50: #7f1d1d;
        --primary-100: #b91c1c;
        --primary-500: #ef4444;
        --primary-600: #f87171;
        --primary-700: #fca5a5;
        --primary-900: #fee2e2;
      }
    `}</style>
  )
}

// ============= Theme Status Indicator =============
export const ThemeStatusIndicator: React.FC = () => {
  const { theme, isDark } = useTheme()

  return (
    <div className="fixed bottom-4 left-4 z-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-2 shadow-lg">
      <div className="flex items-center space-x-2 text-xs">
        <div className={`w-2 h-2 rounded-full ${isDark ? 'bg-blue-400' : 'bg-yellow-400'}`} />
        <span className="text-gray-600 dark:text-gray-400">
          {theme.mode} • {theme.colorScheme}
          {theme.highContrast && ' • high contrast'}
          {theme.reducedMotion && ' • reduced motion'}
        </span>
      </div>
    </div>
  )
}
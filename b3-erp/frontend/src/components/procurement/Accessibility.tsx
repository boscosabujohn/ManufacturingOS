'use client'

import React, { useEffect, useRef, useState, ReactNode } from 'react'
import { AlertTriangle, Info, CheckCircle, XCircle, Eye, EyeOff, Volume2, VolumeX } from 'lucide-react'

// ============= Accessibility Context =============
interface AccessibilitySettings {
  highContrast: boolean
  largeText: boolean
  reduceMotion: boolean
  screenReader: boolean
  keyboardNavigation: boolean
  announcements: boolean
}

const AccessibilityContext = React.createContext<{
  settings: AccessibilitySettings
  updateSettings: (settings: Partial<AccessibilitySettings>) => void
} | null>(null)

export const AccessibilityProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AccessibilitySettings>({
    highContrast: false,
    largeText: false,
    reduceMotion: false,
    screenReader: false,
    keyboardNavigation: true,
    announcements: true
  })

  const updateSettings = (newSettings: Partial<AccessibilitySettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }))
  }

  useEffect(() => {
    // Apply accessibility settings to document
    const root = document.documentElement

    if (settings.highContrast) {
      root.classList.add('accessibility-high-contrast')
    } else {
      root.classList.remove('accessibility-high-contrast')
    }

    if (settings.largeText) {
      root.classList.add('accessibility-large-text')
    } else {
      root.classList.remove('accessibility-large-text')
    }

    if (settings.reduceMotion) {
      root.classList.add('accessibility-reduce-motion')
    } else {
      root.classList.remove('accessibility-reduce-motion')
    }
  }, [settings])

  return (
    <AccessibilityContext.Provider value={{ settings, updateSettings }}>
      {children}
    </AccessibilityContext.Provider>
  )
}

export const useAccessibility = () => {
  const context = React.useContext(AccessibilityContext)
  if (!context) {
    throw new Error('useAccessibility must be used within AccessibilityProvider')
  }
  return context
}

// ============= Keyboard Navigation Hook =============
export const useKeyboardNavigation = (
  containerRef: React.RefObject<HTMLElement>,
  options: {
    enabled?: boolean
    circular?: boolean
    direction?: 'horizontal' | 'vertical' | 'both'
    onEscape?: () => void
    onEnter?: (element: HTMLElement) => void
  } = {}
) => {
  const {
    enabled = true,
    circular = true,
    direction = 'both',
    onEscape,
    onEnter
  } = options

  useEffect(() => {
    if (!enabled || !containerRef.current) return

    const container = containerRef.current
    const focusableSelector = [
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      'a[href]',
      '[tabindex]:not([tabindex="-1"])',
      '[role="button"]:not([disabled])',
      '[role="link"]'
    ].join(', ')

    const handleKeyDown = (event: KeyboardEvent) => {
      const focusableElements = container.querySelectorAll(focusableSelector) as NodeListOf<HTMLElement>
      const currentIndex = Array.from(focusableElements).indexOf(document.activeElement as HTMLElement)

      let nextIndex = currentIndex

      switch (event.key) {
        case 'ArrowDown':
          if (direction === 'vertical' || direction === 'both') {
            event.preventDefault()
            nextIndex = circular && currentIndex === focusableElements.length - 1 ? 0 : currentIndex + 1
          }
          break
        case 'ArrowUp':
          if (direction === 'vertical' || direction === 'both') {
            event.preventDefault()
            nextIndex = circular && currentIndex === 0 ? focusableElements.length - 1 : currentIndex - 1
          }
          break
        case 'ArrowRight':
          if (direction === 'horizontal' || direction === 'both') {
            event.preventDefault()
            nextIndex = circular && currentIndex === focusableElements.length - 1 ? 0 : currentIndex + 1
          }
          break
        case 'ArrowLeft':
          if (direction === 'horizontal' || direction === 'both') {
            event.preventDefault()
            nextIndex = circular && currentIndex === 0 ? focusableElements.length - 1 : currentIndex - 1
          }
          break
        case 'Home':
          event.preventDefault()
          nextIndex = 0
          break
        case 'End':
          event.preventDefault()
          nextIndex = focusableElements.length - 1
          break
        case 'Escape':
          event.preventDefault()
          onEscape?.()
          break
        case 'Enter':
        case ' ':
          if (document.activeElement && onEnter) {
            event.preventDefault()
            onEnter(document.activeElement as HTMLElement)
          }
          break
      }

      if (nextIndex !== currentIndex && focusableElements[nextIndex]) {
        focusableElements[nextIndex].focus()
      }
    }

    container.addEventListener('keydown', handleKeyDown)
    return () => container.removeEventListener('keydown', handleKeyDown)
  }, [enabled, circular, direction, onEscape, onEnter])
}

// ============= Focus Management Hook =============
export const useFocusManagement = () => {
  const focusedElementRef = useRef<HTMLElement | null>(null)

  const trapFocus = (container: HTMLElement) => {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as NodeListOf<HTMLElement>

    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    const handleTabKey = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return

      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault()
          lastElement.focus()
        }
      } else {
        if (document.activeElement === lastElement) {
          event.preventDefault()
          firstElement.focus()
        }
      }
    }

    container.addEventListener('keydown', handleTabKey)
    firstElement?.focus()

    return () => {
      container.removeEventListener('keydown', handleTabKey)
    }
  }

  const saveFocus = () => {
    focusedElementRef.current = document.activeElement as HTMLElement
  }

  const restoreFocus = () => {
    if (focusedElementRef.current) {
      focusedElementRef.current.focus()
      focusedElementRef.current = null
    }
  }

  return { trapFocus, saveFocus, restoreFocus }
}

// ============= Screen Reader Announcements =============
export const useScreenReader = () => {
  const announcementRef = useRef<HTMLDivElement>(null)

  const announce = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    if (!announcementRef.current) return

    const announcement = document.createElement('div')
    announcement.setAttribute('aria-live', priority)
    announcement.setAttribute('aria-atomic', 'true')
    announcement.className = 'sr-only'
    announcement.textContent = message

    announcementRef.current.appendChild(announcement)

    setTimeout(() => {
      if (announcementRef.current?.contains(announcement)) {
        announcementRef.current.removeChild(announcement)
      }
    }, 1000)
  }

  const AnnouncementRegion = () => (
    <div ref={announcementRef} className="sr-only" role="status" aria-live="polite" />
  )

  return { announce, AnnouncementRegion }
}

// ============= Skip Navigation Component =============
export const SkipNavigation: React.FC = () => {
  return (
    <div className="skip-nav">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-lg focus:shadow-lg"
      >
        Skip to main content
      </a>
      <a
        href="#primary-navigation"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-32 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-lg focus:shadow-lg"
      >
        Skip to navigation
      </a>
    </div>
  )
}

// ============= Accessible Button Component =============
interface AccessibleButtonProps {
  children: ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  ariaLabel?: string
  ariaDescribedBy?: string
  className?: string
}

export const AccessibleButton: React.FC<AccessibleButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  ariaLabel,
  ariaDescribedBy,
  className = ''
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2'

  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500'
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-3 py-2 text-lg'
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      aria-busy={loading}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      {children}
    </button>
  )
}

// ============= Accessible Input Component =============
interface AccessibleInputProps {
  label: string
  type?: string
  value: string
  onChange: (value: string) => void
  error?: string
  required?: boolean
  placeholder?: string
  description?: string
  className?: string
}

export const AccessibleInput: React.FC<AccessibleInputProps> = ({
  label,
  type = 'text',
  value,
  onChange,
  error,
  required = false,
  placeholder,
  description,
  className = ''
}) => {
  const inputId = React.useId()
  const errorId = React.useId()
  const descriptionId = React.useId()

  return (
    <div className={`space-y-1 ${className}`}>
      <label htmlFor={inputId} className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1" aria-label="required">*</span>}
      </label>

      {description && (
        <p id={descriptionId} className="text-sm text-gray-600">
          {description}
        </p>
      )}

      <input
        id={inputId}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        aria-invalid={!!error}
        aria-describedby={`${description ? descriptionId : ''} ${error ? errorId : ''}`.trim()}
        className={`block w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-1 ${
          error
            ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
            : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
        }`}
      />

      {error && (
        <p id={errorId} className="text-sm text-red-600" role="alert">
          <XCircle className="inline h-4 w-4 mr-1" />
          {error}
        </p>
      )}
    </div>
  )
}

// ============= Accessible Modal Component =============
interface AccessibleModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

export const AccessibleModal: React.FC<AccessibleModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md'
}) => {
  const modalRef = useRef<HTMLDivElement>(null)
  const { trapFocus, saveFocus, restoreFocus } = useFocusManagement()
  const { announce } = useScreenReader()

  useEffect(() => {
    if (isOpen) {
      saveFocus()
      announce(`${title} dialog opened`, 'assertive')

      if (modalRef.current) {
        const cleanup = trapFocus(modalRef.current)
        return cleanup
      }
    } else {
      restoreFocus()
      announce('Dialog closed', 'polite')
    }
  }, [isOpen, title])

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: '',
    xl: ''
  }

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="flex min-h-screen items-center justify-center p-3">
        <div
          className="fixed inset-0 bg-black bg-opacity-50"
          onClick={onClose}
          aria-hidden="true"
        />
        <div
          ref={modalRef}
          className={`relative bg-white rounded-lg shadow-xl ${sizes[size]} w-full`}
        >
          <div className="px-3 py-2 border-b">
            <h2 id="modal-title" className="text-xl font-semibold text-gray-900">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Close dialog"
            >
              <XCircle className="h-5 w-5 text-gray-500" />
            </button>
          </div>
          <div className="px-3 py-2">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

// ============= Accessibility Panel Component =============
export const AccessibilityPanel: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose
}) => {
  const { settings, updateSettings } = useAccessibility()

  return (
    <AccessibleModal isOpen={isOpen} onClose={onClose} title="Accessibility Settings" size="md">
      <div className="space-y-3">
        <div className="grid grid-cols-1 gap-2">
          <label className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">High Contrast Mode</span>
            <input
              type="checkbox"
              checked={settings.highContrast}
              onChange={(e) => updateSettings({ highContrast: e.target.checked })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
          </label>

          <label className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Large Text</span>
            <input
              type="checkbox"
              checked={settings.largeText}
              onChange={(e) => updateSettings({ largeText: e.target.checked })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
          </label>

          <label className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Reduce Motion</span>
            <input
              type="checkbox"
              checked={settings.reduceMotion}
              onChange={(e) => updateSettings({ reduceMotion: e.target.checked })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
          </label>

          <label className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Keyboard Navigation</span>
            <input
              type="checkbox"
              checked={settings.keyboardNavigation}
              onChange={(e) => updateSettings({ keyboardNavigation: e.target.checked })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
          </label>

          <label className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Screen Reader Announcements</span>
            <input
              type="checkbox"
              checked={settings.announcements}
              onChange={(e) => updateSettings({ announcements: e.target.checked })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
          </label>
        </div>

        <div className="border-t pt-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Keyboard Shortcuts</h3>
          <div className="text-sm text-gray-600 space-y-1">
            <div><kbd className="px-1 py-0.5 bg-gray-100 rounded text-xs">Tab</kbd> - Navigate forward</div>
            <div><kbd className="px-1 py-0.5 bg-gray-100 rounded text-xs">Shift + Tab</kbd> - Navigate backward</div>
            <div><kbd className="px-1 py-0.5 bg-gray-100 rounded text-xs">Enter</kbd> - Activate element</div>
            <div><kbd className="px-1 py-0.5 bg-gray-100 rounded text-xs">Escape</kbd> - Close dialog/menu</div>
            <div><kbd className="px-1 py-0.5 bg-gray-100 rounded text-xs">Arrow Keys</kbd> - Navigate within components</div>
          </div>
        </div>
      </div>
    </AccessibleModal>
  )
}
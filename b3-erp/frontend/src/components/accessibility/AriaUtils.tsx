'use client';

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useId,
  ReactNode,
} from 'react';

// ============================================================================
// ARIA Live Region for Screen Reader Announcements
// ============================================================================

type AriaLivePoliteness = 'polite' | 'assertive' | 'off';

interface LiveRegionContextValue {
  announce: (message: string, politeness?: AriaLivePoliteness) => void;
  announcePolite: (message: string) => void;
  announceAssertive: (message: string) => void;
}

const LiveRegionContext = createContext<LiveRegionContextValue | null>(null);

export interface LiveRegionProviderProps {
  children: ReactNode;
}

export function LiveRegionProvider({ children }: LiveRegionProviderProps) {
  const [politeMessage, setPoliteMessage] = useState('');
  const [assertiveMessage, setAssertiveMessage] = useState('');

  const announce = useCallback((message: string, politeness: AriaLivePoliteness = 'polite') => {
    if (politeness === 'assertive') {
      setAssertiveMessage('');
      setTimeout(() => setAssertiveMessage(message), 50);
    } else {
      setPoliteMessage('');
      setTimeout(() => setPoliteMessage(message), 50);
    }
  }, []);

  const announcePolite = useCallback((message: string) => announce(message, 'polite'), [announce]);
  const announceAssertive = useCallback((message: string) => announce(message, 'assertive'), [announce]);

  return (
    <LiveRegionContext.Provider value={{ announce, announcePolite, announceAssertive }}>
      {children}
      {/* Polite announcements */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {politeMessage}
      </div>
      {/* Assertive announcements */}
      <div
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        className="sr-only"
      >
        {assertiveMessage}
      </div>
      {/* Screen reader only styles */}
      <style jsx global>{`
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }
        .not-sr-only {
          position: static;
          width: auto;
          height: auto;
          padding: 0;
          margin: 0;
          overflow: visible;
          clip: auto;
          white-space: normal;
        }
      `}</style>
    </LiveRegionContext.Provider>
  );
}

export function useLiveRegion() {
  const context = useContext(LiveRegionContext);
  if (!context) {
    throw new Error('useLiveRegion must be used within a LiveRegionProvider');
  }
  return context;
}

// ============================================================================
// Screen Reader Only Text
// ============================================================================

export interface VisuallyHiddenProps {
  children: ReactNode;
  as?: keyof JSX.IntrinsicElements;
  focusable?: boolean;
}

export function VisuallyHidden({
  children,
  as: Component = 'span',
  focusable = false,
}: VisuallyHiddenProps) {
  return (
    <Component
      className={focusable ? 'sr-only focus:not-sr-only' : 'sr-only'}
      tabIndex={focusable ? 0 : undefined}
    >
      {children}
    </Component>
  );
}

// ============================================================================
// ARIA Description Helpers
// ============================================================================

export interface AriaDescribedByProps {
  id?: string;
  description: string;
  children: (props: { 'aria-describedby': string }) => ReactNode;
}

export function AriaDescribedBy({ id, description, children }: AriaDescribedByProps) {
  const generatedId = useId();
  const descriptionId = id || `aria-desc-${generatedId}`;

  return (
    <>
      {children({ 'aria-describedby': descriptionId })}
      <VisuallyHidden>
        <span id={descriptionId}>{description}</span>
      </VisuallyHidden>
    </>
  );
}

// ============================================================================
// Accessible Loading State
// ============================================================================

export interface LoadingAnnouncerProps {
  loading: boolean;
  loadingMessage?: string;
  loadedMessage?: string;
  errorMessage?: string;
  error?: boolean;
}

export function LoadingAnnouncer({
  loading,
  loadingMessage = 'Loading content, please wait.',
  loadedMessage = 'Content loaded.',
  errorMessage = 'Error loading content.',
  error = false,
}: LoadingAnnouncerProps) {
  const { announce } = useLiveRegion();

  useEffect(() => {
    if (loading) {
      announce(loadingMessage, 'polite');
    } else if (error) {
      announce(errorMessage, 'assertive');
    } else {
      announce(loadedMessage, 'polite');
    }
  }, [loading, error, loadingMessage, loadedMessage, errorMessage, announce]);

  return null;
}

// ============================================================================
// Accessible Error Boundary
// ============================================================================

export interface AccessibleErrorProps {
  id?: string;
  error: string;
  role?: 'alert' | 'status';
  className?: string;
}

export function AccessibleError({
  id,
  error,
  role = 'alert',
  className = '',
}: AccessibleErrorProps) {
  const generatedId = useId();
  const errorId = id || `error-${generatedId}`;

  return (
    <div
      id={errorId}
      role={role}
      aria-live={role === 'alert' ? 'assertive' : 'polite'}
      className={`text-red-600 dark:text-red-400 ${className}`}
    >
      {error}
    </div>
  );
}

// ============================================================================
// Form Field Wrapper with ARIA
// ============================================================================

export interface AccessibleFieldProps {
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  disabled?: boolean;
  children: (props: {
    id: string;
    'aria-describedby'?: string;
    'aria-invalid'?: boolean;
    'aria-required'?: boolean;
    'aria-disabled'?: boolean;
  }) => ReactNode;
  className?: string;
}

export function AccessibleField({
  label,
  error,
  hint,
  required = false,
  disabled = false,
  children,
  className = '',
}: AccessibleFieldProps) {
  const id = useId();
  const inputId = `field-${id}`;
  const hintId = hint ? `hint-${id}` : undefined;
  const errorId = error ? `error-${id}` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;

  return (
    <div className={className}>
      <label
        htmlFor={inputId}
        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
      >
        {label}
        {required && (
          <span aria-hidden="true" className="text-red-500 ml-1">*</span>
        )}
        {required && <VisuallyHidden> (required)</VisuallyHidden>}
      </label>

      {children({
        id: inputId,
        'aria-describedby': describedBy,
        'aria-invalid': error ? true : undefined,
        'aria-required': required || undefined,
        'aria-disabled': disabled || undefined,
      })}

      {hint && !error && (
        <p id={hintId} className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {hint}
        </p>
      )}

      {error && (
        <p id={errorId} role="alert" className="mt-1 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}

// ============================================================================
// Progress Indicator with ARIA
// ============================================================================

export interface AccessibleProgressProps {
  value: number;
  max?: number;
  label: string;
  showValue?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function AccessibleProgress({
  value,
  max = 100,
  label,
  showValue = true,
  size = 'md',
  className = '',
}: AccessibleProgressProps) {
  const percentage = Math.round((value / max) * 100);

  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-4',
  };

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </span>
        {showValue && (
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {percentage}%
          </span>
        )}
      </div>
      <div
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={`${label}: ${percentage}%`}
        className={`w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden ${sizeClasses[size]}`}
      >
        <div
          className="h-full bg-blue-600 transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

// ============================================================================
// Accessible Tab Panel
// ============================================================================

export interface TabItem {
  id: string;
  label: string;
  content: ReactNode;
  disabled?: boolean;
}

export interface AccessibleTabsProps {
  tabs: TabItem[];
  defaultTab?: string;
  onChange?: (tabId: string) => void;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

export function AccessibleTabs({
  tabs,
  defaultTab,
  onChange,
  orientation = 'horizontal',
  className = '',
}: AccessibleTabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);
  const baseId = useId();

  const handleTabChange = useCallback((tabId: string) => {
    setActiveTab(tabId);
    onChange?.(tabId);
  }, [onChange]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent, currentIndex: number) => {
    const enabledTabs = tabs.filter(t => !t.disabled);
    const currentEnabledIndex = enabledTabs.findIndex(t => t.id === tabs[currentIndex].id);

    let nextIndex: number | null = null;

    if (orientation === 'horizontal') {
      if (e.key === 'ArrowRight') {
        nextIndex = (currentEnabledIndex + 1) % enabledTabs.length;
      } else if (e.key === 'ArrowLeft') {
        nextIndex = (currentEnabledIndex - 1 + enabledTabs.length) % enabledTabs.length;
      }
    } else {
      if (e.key === 'ArrowDown') {
        nextIndex = (currentEnabledIndex + 1) % enabledTabs.length;
      } else if (e.key === 'ArrowUp') {
        nextIndex = (currentEnabledIndex - 1 + enabledTabs.length) % enabledTabs.length;
      }
    }

    if (e.key === 'Home') {
      nextIndex = 0;
    } else if (e.key === 'End') {
      nextIndex = enabledTabs.length - 1;
    }

    if (nextIndex !== null) {
      e.preventDefault();
      const nextTab = enabledTabs[nextIndex];
      handleTabChange(nextTab.id);
      document.getElementById(`tab-${baseId}-${nextTab.id}`)?.focus();
    }
  }, [tabs, orientation, baseId, handleTabChange]);

  const activeTabContent = tabs.find(t => t.id === activeTab)?.content;

  return (
    <div className={className}>
      {/* Tab list */}
      <div
        role="tablist"
        aria-orientation={orientation}
        className={`flex ${orientation === 'vertical' ? 'flex-col' : 'flex-row'} gap-1 border-b border-gray-200 dark:border-gray-700`}
      >
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            id={`tab-${baseId}-${tab.id}`}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`panel-${baseId}-${tab.id}`}
            aria-disabled={tab.disabled}
            tabIndex={activeTab === tab.id ? 0 : -1}
            disabled={tab.disabled}
            onClick={() => !tab.disabled && handleTabChange(tab.id)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className={`
              px-4 py-2 text-sm font-medium rounded-t-lg
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset
              ${activeTab === tab.id
                ? 'text-blue-600 bg-white dark:bg-gray-800 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
              }
              ${tab.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab panels */}
      {tabs.map(tab => (
        <div
          key={tab.id}
          id={`panel-${baseId}-${tab.id}`}
          role="tabpanel"
          aria-labelledby={`tab-${baseId}-${tab.id}`}
          hidden={activeTab !== tab.id}
          tabIndex={0}
          className="p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset rounded-b-lg"
        >
          {activeTab === tab.id && activeTabContent}
        </div>
      ))}
    </div>
  );
}

// ============================================================================
// Accessible Toggle/Switch
// ============================================================================

export interface AccessibleToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  description?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function AccessibleToggle({
  checked,
  onChange,
  label,
  description,
  disabled = false,
  size = 'md',
  className = '',
}: AccessibleToggleProps) {
  const id = useId();
  const descriptionId = description ? `toggle-desc-${id}` : undefined;

  const sizeClasses = {
    sm: { track: 'w-8 h-4', thumb: 'w-3 h-3', translate: 'translate-x-4' },
    md: { track: 'w-11 h-6', thumb: 'w-5 h-5', translate: 'translate-x-5' },
    lg: { track: 'w-14 h-8', thumb: 'w-7 h-7', translate: 'translate-x-6' },
  };

  const sizes = sizeClasses[size];

  return (
    <div className={`flex items-start gap-3 ${className}`}>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-describedby={descriptionId}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={`
          relative inline-flex flex-shrink-0 ${sizes.track}
          rounded-full cursor-pointer transition-colors duration-200
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
          ${checked ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <span className="sr-only">{label}</span>
        <span
          aria-hidden="true"
          className={`
            ${sizes.thumb}
            pointer-events-none inline-block rounded-full bg-white shadow-lg
            transform transition-transform duration-200
            ${checked ? sizes.translate : 'translate-x-0.5'}
          `}
        />
      </button>
      <div>
        <span className="text-sm font-medium text-gray-900 dark:text-white">
          {label}
        </span>
        {description && (
          <p id={descriptionId} className="text-sm text-gray-500 dark:text-gray-400">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}

export type {
  AriaLivePoliteness,
  LiveRegionContextValue,
  LiveRegionProviderProps,
  VisuallyHiddenProps,
  AriaDescribedByProps,
  LoadingAnnouncerProps,
  AccessibleErrorProps,
  AccessibleFieldProps,
  AccessibleProgressProps,
  TabItem,
  AccessibleTabsProps,
  AccessibleToggleProps,
};

'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  ReactNode,
} from 'react';

// ============================================================================
// Types
// ============================================================================

export interface KeyboardShortcut {
  id: string;
  keys: string[]; // e.g., ['ctrl', 'k'] or ['meta', 'shift', 's']
  description: string;
  category?: string;
  action: () => void;
  enabled?: boolean;
  global?: boolean; // Works even in inputs
  preventDefault?: boolean;
}

export interface KeyboardShortcutsContextValue {
  shortcuts: Map<string, KeyboardShortcut>;
  registerShortcut: (shortcut: KeyboardShortcut) => void;
  unregisterShortcut: (id: string) => void;
  enableShortcut: (id: string) => void;
  disableShortcut: (id: string) => void;
  isShortcutsEnabled: boolean;
  setShortcutsEnabled: (enabled: boolean) => void;
  showHelp: boolean;
  setShowHelp: (show: boolean) => void;
}

// ============================================================================
// Key Mappings
// ============================================================================

const KEY_ALIASES: Record<string, string[]> = {
  ctrl: ['Control', 'ctrl'],
  control: ['Control', 'ctrl'],
  meta: ['Meta', 'cmd', 'command', '⌘'],
  cmd: ['Meta', 'cmd', 'command', '⌘'],
  command: ['Meta', 'cmd', 'command', '⌘'],
  alt: ['Alt', 'alt', 'option', '⌥'],
  option: ['Alt', 'alt', 'option', '⌥'],
  shift: ['Shift', 'shift', '⇧'],
  enter: ['Enter', 'return', '↵'],
  return: ['Enter', 'return', '↵'],
  escape: ['Escape', 'esc'],
  esc: ['Escape', 'esc'],
  space: [' ', 'Space', 'spacebar'],
  tab: ['Tab'],
  backspace: ['Backspace'],
  delete: ['Delete'],
  up: ['ArrowUp', 'up', '↑'],
  down: ['ArrowDown', 'down', '↓'],
  left: ['ArrowLeft', 'left', '←'],
  right: ['ArrowRight', 'right', '→'],
};

// Normalize key name
function normalizeKey(key: string): string {
  const lower = key.toLowerCase();
  if (KEY_ALIASES[lower]) {
    return KEY_ALIASES[lower][0];
  }
  // Single character keys
  if (key.length === 1) {
    return key.toLowerCase();
  }
  return key;
}

// Check if a key event matches a shortcut
function matchesShortcut(event: KeyboardEvent, keys: string[]): boolean {
  const normalizedKeys = keys.map(normalizeKey);

  const modifiers = {
    ctrl: normalizedKeys.includes('Control'),
    meta: normalizedKeys.includes('Meta'),
    alt: normalizedKeys.includes('Alt'),
    shift: normalizedKeys.includes('Shift'),
  };

  // Check modifiers match
  if (event.ctrlKey !== modifiers.ctrl) return false;
  if (event.metaKey !== modifiers.meta) return false;
  if (event.altKey !== modifiers.alt) return false;
  if (event.shiftKey !== modifiers.shift) return false;

  // Get the non-modifier key
  const nonModifierKeys = normalizedKeys.filter(
    k => !['Control', 'Meta', 'Alt', 'Shift'].includes(k)
  );

  if (nonModifierKeys.length === 0) return false;

  const pressedKey = normalizeKey(event.key);
  return nonModifierKeys.some(k => k === pressedKey);
}

// ============================================================================
// Context
// ============================================================================

const KeyboardShortcutsContext = createContext<KeyboardShortcutsContextValue | null>(null);

export interface KeyboardShortcutsProviderProps {
  children: ReactNode;
  defaultShortcuts?: KeyboardShortcut[];
}

export function KeyboardShortcutsProvider({
  children,
  defaultShortcuts = [],
}: KeyboardShortcutsProviderProps) {
  const [shortcuts, setShortcuts] = useState<Map<string, KeyboardShortcut>>(() => {
    const map = new Map();
    defaultShortcuts.forEach(s => map.set(s.id, { ...s, enabled: s.enabled ?? true }));
    return map;
  });
  const [isShortcutsEnabled, setShortcutsEnabled] = useState(true);
  const [showHelp, setShowHelp] = useState(false);

  const registerShortcut = useCallback((shortcut: KeyboardShortcut) => {
    setShortcuts(prev => {
      const next = new Map(prev);
      next.set(shortcut.id, { ...shortcut, enabled: shortcut.enabled ?? true });
      return next;
    });
  }, []);

  const unregisterShortcut = useCallback((id: string) => {
    setShortcuts(prev => {
      const next = new Map(prev);
      next.delete(id);
      return next;
    });
  }, []);

  const enableShortcut = useCallback((id: string) => {
    setShortcuts(prev => {
      const next = new Map(prev);
      const shortcut = next.get(id);
      if (shortcut) {
        next.set(id, { ...shortcut, enabled: true });
      }
      return next;
    });
  }, []);

  const disableShortcut = useCallback((id: string) => {
    setShortcuts(prev => {
      const next = new Map(prev);
      const shortcut = next.get(id);
      if (shortcut) {
        next.set(id, { ...shortcut, enabled: false });
      }
      return next;
    });
  }, []);

  // Handle keyboard events
  useEffect(() => {
    if (!isShortcutsEnabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // Check if we're in an input field
      const target = event.target as HTMLElement;
      const isInput = target.tagName === 'INPUT' ||
                      target.tagName === 'TEXTAREA' ||
                      target.tagName === 'SELECT' ||
                      target.isContentEditable;

      // Built-in: ? to show help
      if (event.key === '?' && !isInput) {
        event.preventDefault();
        setShowHelp(prev => !prev);
        return;
      }

      // Check shortcuts
      shortcuts.forEach(shortcut => {
        if (!shortcut.enabled) return;
        if (isInput && !shortcut.global) return;

        if (matchesShortcut(event, shortcut.keys)) {
          if (shortcut.preventDefault !== false) {
            event.preventDefault();
          }
          shortcut.action();
        }
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts, isShortcutsEnabled]);

  const value = useMemo<KeyboardShortcutsContextValue>(() => ({
    shortcuts,
    registerShortcut,
    unregisterShortcut,
    enableShortcut,
    disableShortcut,
    isShortcutsEnabled,
    setShortcutsEnabled,
    showHelp,
    setShowHelp,
  }), [
    shortcuts,
    registerShortcut,
    unregisterShortcut,
    enableShortcut,
    disableShortcut,
    isShortcutsEnabled,
    setShortcutsEnabled,
    showHelp,
    setShowHelp,
  ]);

  return (
    <KeyboardShortcutsContext.Provider value={value}>
      {children}
    </KeyboardShortcutsContext.Provider>
  );
}

export function useKeyboardShortcuts() {
  const context = useContext(KeyboardShortcutsContext);
  if (!context) {
    throw new Error('useKeyboardShortcuts must be used within a KeyboardShortcutsProvider');
  }
  return context;
}

// ============================================================================
// Hook for registering shortcuts
// ============================================================================

export function useShortcut(
  shortcut: Omit<KeyboardShortcut, 'id'> & { id?: string }
) {
  const { registerShortcut, unregisterShortcut } = useKeyboardShortcuts();
  const id = useMemo(() => shortcut.id || `shortcut-${Math.random().toString(36).slice(2)}`, [shortcut.id]);

  useEffect(() => {
    registerShortcut({ ...shortcut, id });
    return () => unregisterShortcut(id);
  }, [id, shortcut, registerShortcut, unregisterShortcut]);

  return id;
}

// ============================================================================
// Keyboard Shortcuts Help Dialog
// ============================================================================

export interface ShortcutsHelpDialogProps {
  className?: string;
}

export function ShortcutsHelpDialog({ className = '' }: ShortcutsHelpDialogProps) {
  const { shortcuts, showHelp, setShowHelp } = useKeyboardShortcuts();

  // Group shortcuts by category
  const groupedShortcuts = useMemo(() => {
    const groups = new Map<string, KeyboardShortcut[]>();

    shortcuts.forEach(shortcut => {
      const category = shortcut.category || 'General';
      if (!groups.has(category)) {
        groups.set(category, []);
      }
      groups.get(category)!.push(shortcut);
    });

    return groups;
  }, [shortcuts]);

  if (!showHelp) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="shortcuts-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={() => setShowHelp(false)}
    >
      <div
        className={`bg-white dark:bg-gray-900 rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden ${className}`}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 id="shortcuts-title" className="text-xl font-semibold text-gray-900 dark:text-white">
            Keyboard Shortcuts
          </h2>
          <button
            onClick={() => setShowHelp(false)}
            aria-label="Close"
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto max-h-[calc(80vh-120px)]">
          {/* Help shortcut hint */}
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Press <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs font-mono">?</kbd> to toggle this help dialog
          </p>

          {/* Shortcut groups */}
          <div className="space-y-6">
            {Array.from(groupedShortcuts.entries()).map(([category, categoryShortcuts]) => (
              <div key={category}>
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
                  {category}
                </h3>
                <div className="space-y-2">
                  {categoryShortcuts.map(shortcut => (
                    <div
                      key={shortcut.id}
                      className="flex items-center justify-between py-2"
                    >
                      <span className="text-gray-700 dark:text-gray-300">
                        {shortcut.description}
                      </span>
                      <KeyCombo keys={shortcut.keys} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {groupedShortcuts.size === 0 && (
            <p className="text-center text-gray-500 dark:text-gray-400 py-8">
              No keyboard shortcuts registered
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
            Shortcuts are disabled when typing in input fields
          </p>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Key Combo Display
// ============================================================================

export interface KeyComboProps {
  keys: string[];
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function KeyCombo({ keys, size = 'md', className = '' }: KeyComboProps) {
  const sizeClasses = {
    sm: 'px-1.5 py-0.5 text-xs',
    md: 'px-2 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base',
  };

  // Format key for display
  const formatKey = (key: string): string => {
    const lower = key.toLowerCase();

    // Platform-specific symbols
    const isMac = typeof navigator !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.platform);

    const symbols: Record<string, string> = {
      ctrl: isMac ? '⌃' : 'Ctrl',
      control: isMac ? '⌃' : 'Ctrl',
      meta: isMac ? '⌘' : 'Win',
      cmd: '⌘',
      command: '⌘',
      alt: isMac ? '⌥' : 'Alt',
      option: '⌥',
      shift: '⇧',
      enter: '↵',
      return: '↵',
      escape: 'Esc',
      esc: 'Esc',
      space: '␣',
      tab: '⇥',
      backspace: '⌫',
      delete: '⌦',
      up: '↑',
      down: '↓',
      left: '←',
      right: '→',
    };

    return symbols[lower] || key.toUpperCase();
  };

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {keys.map((key, index) => (
        <React.Fragment key={index}>
          <kbd
            className={`
              ${sizeClasses[size]}
              font-mono font-medium
              bg-gray-100 dark:bg-gray-800
              text-gray-700 dark:text-gray-300
              border border-gray-300 dark:border-gray-600
              rounded shadow-sm
            `}
          >
            {formatKey(key)}
          </kbd>
          {index < keys.length - 1 && (
            <span className="text-gray-400 text-xs">+</span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

// ============================================================================
// Common Shortcuts Hook
// ============================================================================

export interface CommonShortcutsOptions {
  onSave?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  onSearch?: () => void;
  onNew?: () => void;
  onDelete?: () => void;
  onEscape?: () => void;
  onHelp?: () => void;
}

export function useCommonShortcuts(options: CommonShortcutsOptions) {
  const { registerShortcut, unregisterShortcut } = useKeyboardShortcuts();

  useEffect(() => {
    const shortcuts: KeyboardShortcut[] = [];

    if (options.onSave) {
      shortcuts.push({
        id: 'common-save',
        keys: ['ctrl', 's'],
        description: 'Save',
        category: 'Common',
        action: options.onSave,
        global: true,
      });
    }

    if (options.onUndo) {
      shortcuts.push({
        id: 'common-undo',
        keys: ['ctrl', 'z'],
        description: 'Undo',
        category: 'Common',
        action: options.onUndo,
      });
    }

    if (options.onRedo) {
      shortcuts.push({
        id: 'common-redo',
        keys: ['ctrl', 'shift', 'z'],
        description: 'Redo',
        category: 'Common',
        action: options.onRedo,
      });
    }

    if (options.onSearch) {
      shortcuts.push({
        id: 'common-search',
        keys: ['ctrl', 'k'],
        description: 'Search',
        category: 'Common',
        action: options.onSearch,
      });
    }

    if (options.onNew) {
      shortcuts.push({
        id: 'common-new',
        keys: ['ctrl', 'n'],
        description: 'Create new',
        category: 'Common',
        action: options.onNew,
      });
    }

    if (options.onDelete) {
      shortcuts.push({
        id: 'common-delete',
        keys: ['delete'],
        description: 'Delete selected',
        category: 'Common',
        action: options.onDelete,
      });
    }

    if (options.onEscape) {
      shortcuts.push({
        id: 'common-escape',
        keys: ['escape'],
        description: 'Cancel / Close',
        category: 'Common',
        action: options.onEscape,
        global: true,
      });
    }

    if (options.onHelp) {
      shortcuts.push({
        id: 'common-help',
        keys: ['f1'],
        description: 'Help',
        category: 'Common',
        action: options.onHelp,
      });
    }

    shortcuts.forEach(registerShortcut);

    return () => {
      shortcuts.forEach(s => unregisterShortcut(s.id));
    };
  }, [options, registerShortcut, unregisterShortcut]);
}


'use client';

import React, { createContext, useContext, useState, useCallback, useEffect, useRef, ReactNode } from 'react';
import Link from 'next/link';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
  X,
  Undo2,
  Eye,
  RefreshCw,
  Volume2,
  VolumeX,
  AlertOctagon,
} from 'lucide-react';

// ============================================================================
// Types
// ============================================================================

export type ToastVariant = 'success' | 'error' | 'warning' | 'info' | 'critical';

export interface ToastAction {
  id: string;
  label: string;
  variant?: 'default' | 'primary' | 'destructive';
  onClick?: () => void;
  href?: string;
}

export interface EnhancedToast {
  id: string;
  title: string;
  message?: string;
  variant: ToastVariant;
  duration?: number; // 0 for persistent
  persistent?: boolean;
  actions?: ToastAction[];
  soundEnabled?: boolean;
  escalate?: boolean;
  escalationInterval?: number; // ms
  createdAt: Date;
  acknowledged?: boolean;
}

interface EnhancedToastContextType {
  toasts: EnhancedToast[];
  addToast: (toast: Omit<EnhancedToast, 'id' | 'createdAt'>) => string;
  removeToast: (id: string) => void;
  acknowledgeToast: (id: string) => void;
  clearAllToasts: () => void;
  soundEnabled: boolean;
  toggleSound: () => void;
}

// ============================================================================
// Sound URLs (using base64 encoded simple beeps for demo)
// ============================================================================

const SOUND_DATA = {
  success: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2teleT8Xd6O14teleT8Xd6O14...',
  error: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2...',
  warning: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2Ec...',
  critical: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2...',
};

function playSound(variant: ToastVariant) {
  if (typeof window === 'undefined') return;

  // Create oscillator for simple beep sounds
  try {
    const audioContext = new (window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Different frequencies for different variants
    const frequencies: Record<ToastVariant, number> = {
      success: 880,   // A5 - pleasant
      error: 220,     // A3 - low, attention-grabbing
      warning: 440,   // A4 - middle
      info: 660,      // E5 - neutral
      critical: 330,  // E4 - urgent
    };

    oscillator.frequency.value = frequencies[variant];
    oscillator.type = variant === 'critical' ? 'square' : 'sine';

    gainNode.gain.value = 0.1;

    oscillator.start();

    if (variant === 'critical') {
      // Double beep for critical
      setTimeout(() => {
        gainNode.gain.value = 0;
      }, 150);
      setTimeout(() => {
        gainNode.gain.value = 0.1;
      }, 200);
      setTimeout(() => {
        oscillator.stop();
      }, 350);
    } else {
      setTimeout(() => {
        oscillator.stop();
      }, 150);
    }
  } catch {
    // Silently fail if audio can't play
  }
}

// ============================================================================
// Context
// ============================================================================

const EnhancedToastContext = createContext<EnhancedToastContextType | undefined>(undefined);

export function useEnhancedToast() {
  const context = useContext(EnhancedToastContext);
  if (!context) {
    throw new Error('useEnhancedToast must be used within EnhancedToastProvider');
  }
  return context;
}

// ============================================================================
// Provider
// ============================================================================

interface EnhancedToastProviderProps {
  children: ReactNode;
}

export function EnhancedToastProvider({ children }: EnhancedToastProviderProps) {
  const [toasts, setToasts] = useState<EnhancedToast[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const escalationTimersRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

  // Load sound preference from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('toast_sound_enabled');
      if (stored !== null) {
        setSoundEnabled(stored === 'true');
      }
    }
  }, []);

  const addToast = useCallback((toast: Omit<EnhancedToast, 'id' | 'createdAt'>): string => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const newToast: EnhancedToast = {
      ...toast,
      id,
      createdAt: new Date(),
      acknowledged: false,
    };

    setToasts(prev => [...prev, newToast]);

    // Play sound if enabled
    if (soundEnabled && toast.soundEnabled !== false) {
      playSound(toast.variant);
    }

    // Auto remove if not persistent
    if (!toast.persistent && toast.duration !== 0) {
      const duration = toast.duration ?? (toast.variant === 'critical' ? 0 : 5000);
      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    }

    // Set up escalation for critical toasts
    if (toast.escalate && toast.variant === 'critical') {
      setupEscalation(id, toast.escalationInterval ?? 30000);
    }

    return id;
  }, [soundEnabled]);

  const setupEscalation = useCallback((id: string, interval: number) => {
    const escalate = () => {
      setToasts(prev => prev.map(t => {
        if (t.id === id && !t.acknowledged) {
          // Play escalation sound
          playSound('critical');
          return t;
        }
        return t;
      }));

      // Re-schedule if still not acknowledged
      const timer = setTimeout(escalate, interval);
      escalationTimersRef.current.set(id, timer);
    };

    const timer = setTimeout(escalate, interval);
    escalationTimersRef.current.set(id, timer);
  }, []);

  const removeToast = useCallback((id: string) => {
    // Clear escalation timer
    const timer = escalationTimersRef.current.get(id);
    if (timer) {
      clearTimeout(timer);
      escalationTimersRef.current.delete(id);
    }
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const acknowledgeToast = useCallback((id: string) => {
    // Clear escalation timer
    const timer = escalationTimersRef.current.get(id);
    if (timer) {
      clearTimeout(timer);
      escalationTimersRef.current.delete(id);
    }
    setToasts(prev => prev.map(t =>
      t.id === id ? { ...t, acknowledged: true } : t
    ));
  }, []);

  const clearAllToasts = useCallback(() => {
    // Clear all escalation timers
    escalationTimersRef.current.forEach(timer => clearTimeout(timer));
    escalationTimersRef.current.clear();
    setToasts([]);
  }, []);

  const toggleSound = useCallback(() => {
    setSoundEnabled(prev => {
      const newValue = !prev;
      if (typeof window !== 'undefined') {
        localStorage.setItem('toast_sound_enabled', String(newValue));
      }
      return newValue;
    });
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      escalationTimersRef.current.forEach(timer => clearTimeout(timer));
    };
  }, []);

  const value: EnhancedToastContextType = {
    toasts,
    addToast,
    removeToast,
    acknowledgeToast,
    clearAllToasts,
    soundEnabled,
    toggleSound,
  };

  return (
    <EnhancedToastContext.Provider value={value}>
      {children}
      <EnhancedToastContainer />
    </EnhancedToastContext.Provider>
  );
}

// ============================================================================
// Toast Container
// ============================================================================

function EnhancedToastContainer() {
  const { toasts, removeToast, acknowledgeToast, soundEnabled, toggleSound } = useEnhancedToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-3 max-w-md w-full pointer-events-none">
      {/* Sound toggle */}
      {toasts.length > 0 && (
        <div className="flex justify-end pointer-events-auto">
          <button
            onClick={toggleSound}
            className="p-2 bg-white rounded-full shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            title={soundEnabled ? 'Mute alert sounds' : 'Enable alert sounds'}
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-gray-600" />
            ) : (
              <VolumeX className="w-4 h-4 text-gray-400" />
            )}
          </button>
        </div>
      )}

      {/* Toasts */}
      {toasts.map(toast => (
        <EnhancedToastItem
          key={toast.id}
          toast={toast}
          onRemove={removeToast}
          onAcknowledge={acknowledgeToast}
        />
      ))}
    </div>
  );
}

// ============================================================================
// Toast Item
// ============================================================================

interface EnhancedToastItemProps {
  toast: EnhancedToast;
  onRemove: (id: string) => void;
  onAcknowledge: (id: string) => void;
}

function EnhancedToastItem({ toast, onRemove, onAcknowledge }: EnhancedToastItemProps) {
  const [isExiting, setIsExiting] = useState(false);

  const variantConfig: Record<ToastVariant, {
    icon: React.ElementType;
    bgColor: string;
    borderColor: string;
    iconColor: string;
    titleColor: string;
    messageColor: string;
  }> = {
    success: {
      icon: CheckCircle2,
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      iconColor: 'text-green-600',
      titleColor: 'text-green-900',
      messageColor: 'text-green-700',
    },
    error: {
      icon: XCircle,
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      iconColor: 'text-red-600',
      titleColor: 'text-red-900',
      messageColor: 'text-red-700',
    },
    warning: {
      icon: AlertTriangle,
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      iconColor: 'text-orange-600',
      titleColor: 'text-orange-900',
      messageColor: 'text-orange-700',
    },
    info: {
      icon: Info,
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      iconColor: 'text-blue-600',
      titleColor: 'text-blue-900',
      messageColor: 'text-blue-700',
    },
    critical: {
      icon: AlertOctagon,
      bgColor: 'bg-red-100',
      borderColor: 'border-red-300',
      iconColor: 'text-red-700',
      titleColor: 'text-red-900',
      messageColor: 'text-red-800',
    },
  };

  const config = variantConfig[toast.variant];
  const Icon = config.icon;

  const handleRemove = () => {
    setIsExiting(true);
    setTimeout(() => onRemove(toast.id), 200);
  };

  const handleActionClick = (action: ToastAction) => {
    if (action.onClick) {
      action.onClick();
    }
    if (toast.variant === 'critical' && !toast.acknowledged) {
      onAcknowledge(toast.id);
    }
    if (!action.href) {
      handleRemove();
    }
  };

  return (
    <div
      className={`
        pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-lg
        ${config.bgColor} ${config.borderColor}
        ${toast.variant === 'critical' && !toast.acknowledged ? 'animate-pulse ring-2 ring-red-400' : ''}
        ${isExiting ? 'animate-out slide-out-to-right-full duration-200' : 'animate-in slide-in-from-right-full duration-300'}
      `}
    >
      {/* Icon */}
      <div className={`flex-shrink-0 mt-0.5 ${toast.variant === 'critical' ? 'animate-bounce' : ''}`}>
        <Icon className={`h-5 w-5 ${config.iconColor}`} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-semibold ${config.titleColor}`}>
          {toast.title}
        </p>
        {toast.message && (
          <p className={`text-sm mt-1 ${config.messageColor}`}>
            {toast.message}
          </p>
        )}

        {/* Actions */}
        {toast.actions && toast.actions.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {toast.actions.map(action => (
              action.href ? (
                <Link
                  key={action.id}
                  href={action.href}
                  onClick={() => handleActionClick(action)}
                  className={`
                    inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors
                    ${action.variant === 'primary'
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : action.variant === 'destructive'
                      ? 'bg-red-600 text-white hover:bg-red-700'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                    }
                  `}
                >
                  {action.id === 'view' && <Eye className="w-3 h-3" />}
                  {action.id === 'undo' && <Undo2 className="w-3 h-3" />}
                  {action.id === 'retry' && <RefreshCw className="w-3 h-3" />}
                  {action.label}
                </Link>
              ) : (
                <button
                  key={action.id}
                  onClick={() => handleActionClick(action)}
                  className={`
                    inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors
                    ${action.variant === 'primary'
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : action.variant === 'destructive'
                      ? 'bg-red-600 text-white hover:bg-red-700'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                    }
                  `}
                >
                  {action.id === 'view' && <Eye className="w-3 h-3" />}
                  {action.id === 'undo' && <Undo2 className="w-3 h-3" />}
                  {action.id === 'retry' && <RefreshCw className="w-3 h-3" />}
                  {action.label}
                </button>
              )
            ))}
          </div>
        )}

        {/* Persistent indicator */}
        {toast.persistent && (
          <p className="text-xs text-gray-400 mt-2">
            This notification requires your attention
          </p>
        )}
      </div>

      {/* Close button */}
      <button
        onClick={handleRemove}
        className="flex-shrink-0 p-1 text-gray-400 hover:text-gray-600 transition-colors rounded hover:bg-white/50"
        aria-label="Dismiss"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

// ============================================================================
// Convenience function for creating common toast types
// ============================================================================

export function createToastHelpers(addToast: EnhancedToastContextType['addToast']) {
  return {
    success: (title: string, message?: string, actions?: ToastAction[]) =>
      addToast({ title, message, variant: 'success', actions }),

    error: (title: string, message?: string, actions?: ToastAction[]) =>
      addToast({ title, message, variant: 'error', actions }),

    warning: (title: string, message?: string, actions?: ToastAction[]) =>
      addToast({ title, message, variant: 'warning', actions }),

    info: (title: string, message?: string, actions?: ToastAction[]) =>
      addToast({ title, message, variant: 'info', actions }),

    critical: (title: string, message?: string, actions?: ToastAction[]) =>
      addToast({
        title,
        message,
        variant: 'critical',
        persistent: true,
        escalate: true,
        escalationInterval: 30000,
        actions,
      }),

    withUndo: (title: string, message: string, onUndo: () => void) =>
      addToast({
        title,
        message,
        variant: 'success',
        duration: 8000,
        actions: [
          { id: 'undo', label: 'Undo', onClick: onUndo },
        ],
      }),

    withRetry: (title: string, message: string, onRetry: () => void) =>
      addToast({
        title,
        message,
        variant: 'error',
        persistent: true,
        actions: [
          { id: 'retry', label: 'Retry', variant: 'primary', onClick: onRetry },
        ],
      }),

    withView: (title: string, message: string, href: string) =>
      addToast({
        title,
        message,
        variant: 'info',
        actions: [
          { id: 'view', label: 'View', variant: 'primary', href },
        ],
      }),
  };
}

export default EnhancedToastProvider;

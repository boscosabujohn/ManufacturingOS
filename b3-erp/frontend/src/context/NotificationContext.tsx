'use client';

import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode, useRef } from 'react';

// ============================================================================
// Types
// ============================================================================

export type NotificationCategory =
  | 'alert'        // System alerts, errors
  | 'approval'     // Approval requests
  | 'mention'      // User mentions
  | 'update'       // Status updates
  | 'reminder'     // Scheduled reminders
  | 'system';      // System notifications

export type NotificationPriority = 'low' | 'medium' | 'high' | 'critical';

export type NotificationStatus = 'unread' | 'read' | 'archived';

export interface NotificationAction {
  id: string;
  label: string;
  variant?: 'default' | 'primary' | 'destructive';
  onClick?: () => void;
  href?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  category: NotificationCategory;
  priority: NotificationPriority;
  status: NotificationStatus;
  timestamp: Date;
  module?: string;
  entityType?: string;
  entityId?: string;
  actions?: NotificationAction[];
  icon?: string;
  imageUrl?: string;
  sender?: {
    name: string;
    avatarUrl?: string;
  };
  metadata?: Record<string, unknown>;
}

export interface NotificationPreferences {
  enabled: boolean;
  pushEnabled: boolean;
  soundEnabled: boolean;
  categories: {
    [key in NotificationCategory]: {
      enabled: boolean;
      push: boolean;
      sound: boolean;
    };
  };
  modules: {
    [key: string]: boolean;
  };
  quietHours: {
    enabled: boolean;
    start: string; // HH:MM format
    end: string;   // HH:MM format
  };
}

export interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  preferences: NotificationPreferences;
  isOpen: boolean;

  // Actions
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'status'>) => string;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  archiveNotification: (id: string) => void;
  deleteNotification: (id: string) => void;
  clearAll: () => void;

  // Preferences
  updatePreferences: (prefs: Partial<NotificationPreferences>) => void;

  // Push notifications
  requestPushPermission: () => Promise<boolean>;
  isPushSupported: boolean;
  isPushEnabled: boolean;

  // Panel control
  setIsOpen: (open: boolean) => void;
  togglePanel: () => void;
}

// ============================================================================
// Default Preferences
// ============================================================================

const defaultPreferences: NotificationPreferences = {
  enabled: true,
  pushEnabled: false,
  soundEnabled: true,
  categories: {
    alert: { enabled: true, push: true, sound: true },
    approval: { enabled: true, push: true, sound: true },
    mention: { enabled: true, push: true, sound: false },
    update: { enabled: true, push: false, sound: false },
    reminder: { enabled: true, push: true, sound: true },
    system: { enabled: true, push: false, sound: false },
  },
  modules: {},
  quietHours: {
    enabled: false,
    start: '22:00',
    end: '08:00',
  },
};

// ============================================================================
// Context
// ============================================================================

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
}

// ============================================================================
// Sound Effects
// ============================================================================

const NOTIFICATION_SOUNDS = {
  default: '/sounds/notification.mp3',
  alert: '/sounds/alert.mp3',
  critical: '/sounds/critical.mp3',
  mention: '/sounds/mention.mp3',
};

function playNotificationSound(priority: NotificationPriority, category: NotificationCategory) {
  if (typeof window === 'undefined') return;

  let soundUrl = NOTIFICATION_SOUNDS.default;

  if (priority === 'critical') {
    soundUrl = NOTIFICATION_SOUNDS.critical;
  } else if (category === 'alert') {
    soundUrl = NOTIFICATION_SOUNDS.alert;
  } else if (category === 'mention') {
    soundUrl = NOTIFICATION_SOUNDS.mention;
  }

  // Create audio element and play
  const audio = new Audio(soundUrl);
  audio.volume = 0.5;
  audio.play().catch(() => {
    // Silently fail if audio can't play (e.g., user hasn't interacted yet)
  });
}

// ============================================================================
// Provider
// ============================================================================

interface NotificationProviderProps {
  children: ReactNode;
}

export function NotificationProvider({ children }: NotificationProviderProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [preferences, setPreferences] = useState<NotificationPreferences>(defaultPreferences);
  const [isOpen, setIsOpen] = useState(false);
  const [isPushEnabled, setIsPushEnabled] = useState(false);
  const escalationTimersRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

  // Check if push notifications are supported
  const isPushSupported = typeof window !== 'undefined' && 'Notification' in window;

  // Load preferences from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('notification_preferences');
      if (stored) {
        try {
          setPreferences({ ...defaultPreferences, ...JSON.parse(stored) });
        } catch {
          // Use defaults
        }
      }

      // Load saved notifications
      const savedNotifications = localStorage.getItem('notifications');
      if (savedNotifications) {
        try {
          const parsed = JSON.parse(savedNotifications);
          setNotifications(parsed.map((n: Notification) => ({
            ...n,
            timestamp: new Date(n.timestamp),
          })));
        } catch {
          // Use empty array
        }
      }

      // Check push permission status
      if (isPushSupported && Notification.permission === 'granted') {
        setIsPushEnabled(true);
      }
    }
  }, [isPushSupported]);

  // Save notifications to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('notifications', JSON.stringify(notifications));
    }
  }, [notifications]);

  // Calculate unread count
  const unreadCount = notifications.filter(n => n.status === 'unread').length;

  // Check if in quiet hours
  const isQuietHours = useCallback(() => {
    if (!preferences.quietHours.enabled) return false;

    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    const { start, end } = preferences.quietHours;

    if (start <= end) {
      return currentTime >= start && currentTime <= end;
    } else {
      // Quiet hours span midnight
      return currentTime >= start || currentTime <= end;
    }
  }, [preferences.quietHours]);

  // Add notification
  const addNotification = useCallback((
    notification: Omit<Notification, 'id' | 'timestamp' | 'status'>
  ): string => {
    const id = `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const newNotification: Notification = {
      ...notification,
      id,
      timestamp: new Date(),
      status: 'unread',
    };

    setNotifications(prev => [newNotification, ...prev]);

    // Handle sound
    const categoryPrefs = preferences.categories[notification.category];
    if (
      preferences.enabled &&
      preferences.soundEnabled &&
      categoryPrefs?.enabled &&
      categoryPrefs?.sound &&
      !isQuietHours()
    ) {
      playNotificationSound(notification.priority, notification.category);
    }

    // Handle push notification
    if (
      isPushEnabled &&
      preferences.pushEnabled &&
      categoryPrefs?.push &&
      !isQuietHours()
    ) {
      showPushNotification(newNotification);
    }

    // Set up escalation for critical notifications
    if (notification.priority === 'critical') {
      setupEscalation(id);
    }

    return id;
  }, [preferences, isPushEnabled, isQuietHours]);

  // Show browser push notification
  const showPushNotification = useCallback((notification: Notification) => {
    if (!isPushSupported || Notification.permission !== 'granted') return;

    new Notification(notification.title, {
      body: notification.message,
      icon: '/icon-192.png',
      tag: notification.id,
      requireInteraction: notification.priority === 'critical',
    });
  }, [isPushSupported]);

  // Setup escalation for unacknowledged critical alerts
  const setupEscalation = useCallback((id: string) => {
    // Clear existing timer if any
    const existingTimer = escalationTimersRef.current.get(id);
    if (existingTimer) {
      clearTimeout(existingTimer);
    }

    // Set escalation timer (30 seconds)
    const timer = setTimeout(() => {
      setNotifications(prev => prev.map(n => {
        if (n.id === id && n.status === 'unread') {
          // Play escalation sound
          playNotificationSound('critical', 'alert');
          // Could also trigger visual escalation here
          return { ...n, metadata: { ...n.metadata, escalated: true } };
        }
        return n;
      }));
    }, 30000);

    escalationTimersRef.current.set(id, timer);
  }, []);

  // Mark as read
  const markAsRead = useCallback((id: string) => {
    // Clear escalation timer
    const timer = escalationTimersRef.current.get(id);
    if (timer) {
      clearTimeout(timer);
      escalationTimersRef.current.delete(id);
    }

    setNotifications(prev => prev.map(n =>
      n.id === id ? { ...n, status: 'read' as NotificationStatus } : n
    ));
  }, []);

  // Mark all as read
  const markAllAsRead = useCallback(() => {
    // Clear all escalation timers
    escalationTimersRef.current.forEach(timer => clearTimeout(timer));
    escalationTimersRef.current.clear();

    setNotifications(prev => prev.map(n => ({
      ...n,
      status: 'read' as NotificationStatus,
    })));
  }, []);

  // Archive notification
  const archiveNotification = useCallback((id: string) => {
    setNotifications(prev => prev.map(n =>
      n.id === id ? { ...n, status: 'archived' as NotificationStatus } : n
    ));
  }, []);

  // Delete notification
  const deleteNotification = useCallback((id: string) => {
    const timer = escalationTimersRef.current.get(id);
    if (timer) {
      clearTimeout(timer);
      escalationTimersRef.current.delete(id);
    }
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  // Clear all
  const clearAll = useCallback(() => {
    escalationTimersRef.current.forEach(timer => clearTimeout(timer));
    escalationTimersRef.current.clear();
    setNotifications([]);
  }, []);

  // Update preferences
  const updatePreferences = useCallback((prefs: Partial<NotificationPreferences>) => {
    setPreferences(prev => {
      const updated = { ...prev, ...prefs };
      if (typeof window !== 'undefined') {
        localStorage.setItem('notification_preferences', JSON.stringify(updated));
      }
      return updated;
    });
  }, []);

  // Request push permission
  const requestPushPermission = useCallback(async (): Promise<boolean> => {
    if (!isPushSupported) return false;

    try {
      const permission = await Notification.requestPermission();
      const granted = permission === 'granted';
      setIsPushEnabled(granted);
      if (granted) {
        updatePreferences({ pushEnabled: true });
      }
      return granted;
    } catch {
      return false;
    }
  }, [isPushSupported, updatePreferences]);

  // Toggle panel
  const togglePanel = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      escalationTimersRef.current.forEach(timer => clearTimeout(timer));
    };
  }, []);

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    preferences,
    isOpen,
    addNotification,
    markAsRead,
    markAllAsRead,
    archiveNotification,
    deleteNotification,
    clearAll,
    updatePreferences,
    requestPushPermission,
    isPushSupported,
    isPushEnabled,
    setIsOpen,
    togglePanel,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export default NotificationContext;

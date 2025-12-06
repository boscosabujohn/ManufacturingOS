'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  Bell,
  Check,
  CheckCheck,
  Settings,
  Clock,
  AlertCircle,
  MessageSquare,
  UserCheck,
  RefreshCw,
  BellOff,
  Archive,
  Trash2,
  ChevronRight,
  Volume2,
  VolumeX,
  X,
  ExternalLink,
  Filter,
} from 'lucide-react';
import { useNotifications, Notification, NotificationCategory } from '@/context/NotificationContext';

// ============================================================================
// Category Config
// ============================================================================

const categoryConfig: Record<NotificationCategory, {
  icon: React.ElementType;
  label: string;
  color: string;
  bgColor: string;
}> = {
  alert: {
    icon: AlertCircle,
    label: 'Alerts',
    color: 'text-red-600',
    bgColor: 'bg-red-100',
  },
  approval: {
    icon: UserCheck,
    label: 'Approvals',
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
  },
  mention: {
    icon: MessageSquare,
    label: 'Mentions',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
  },
  update: {
    icon: RefreshCw,
    label: 'Updates',
    color: 'text-green-600',
    bgColor: 'bg-green-100',
  },
  reminder: {
    icon: Clock,
    label: 'Reminders',
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
  },
  system: {
    icon: Bell,
    label: 'System',
    color: 'text-gray-600',
    bgColor: 'bg-gray-100',
  },
};

// ============================================================================
// Format Time Helper
// ============================================================================

function formatTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString();
}

// ============================================================================
// Notification Item Component
// ============================================================================

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onArchive: (id: string) => void;
  onDelete: (id: string) => void;
  onClose?: () => void;
}

function NotificationItem({ notification, onMarkAsRead, onArchive, onDelete, onClose }: NotificationItemProps) {
  const config = categoryConfig[notification.category];
  const Icon = config.icon;
  const isEscalated = notification.metadata?.escalated;

  const handleActionClick = (action: Notification['actions'][0]) => {
    if (action.onClick) {
      action.onClick();
    }
    if (notification.status === 'unread') {
      onMarkAsRead(notification.id);
    }
    if (onClose && action.href) {
      onClose();
    }
  };

  return (
    <div
      className={`
        group relative p-4 border-b border-gray-100 hover:bg-gray-50 transition-all
        ${notification.status === 'unread' ? 'bg-blue-50/50' : ''}
        ${isEscalated ? 'animate-pulse bg-red-50 border-l-4 border-l-red-500' : ''}
      `}
    >
      {/* Priority indicator */}
      {notification.priority === 'critical' && !isEscalated && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500" />
      )}
      {notification.priority === 'high' && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-500" />
      )}

      <div className="flex gap-3">
        {/* Icon */}
        <div className={`flex-shrink-0 w-10 h-10 rounded-full ${config.bgColor} flex items-center justify-center`}>
          {notification.sender?.avatarUrl ? (
            <img
              src={notification.sender.avatarUrl}
              alt={notification.sender.name}
              className="w-10 h-10 rounded-full"
            />
          ) : (
            <Icon className={`w-5 h-5 ${config.color}`} />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className={`text-sm font-medium ${notification.status === 'unread' ? 'text-gray-900' : 'text-gray-700'}`}>
                {notification.title}
              </p>
              {notification.sender && (
                <p className="text-xs text-gray-500">{notification.sender.name}</p>
              )}
            </div>
            <span className="text-xs text-gray-400 flex-shrink-0">
              {formatTime(notification.timestamp)}
            </span>
          </div>

          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
            {notification.message}
          </p>

          {/* Module tag */}
          {notification.module && (
            <span className={`inline-flex items-center mt-2 px-2 py-0.5 rounded text-xs ${config.bgColor} ${config.color}`}>
              {notification.module}
            </span>
          )}

          {/* Actions */}
          {notification.actions && notification.actions.length > 0 && (
            <div className="flex gap-2 mt-3">
              {notification.actions.map(action => (
                action.href ? (
                  <Link
                    key={action.id}
                    href={action.href}
                    onClick={() => handleActionClick(action)}
                    className={`
                      px-3 py-1.5 text-xs font-medium rounded-lg transition-colors
                      ${action.variant === 'primary'
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : action.variant === 'destructive'
                        ? 'bg-red-600 text-white hover:bg-red-700'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }
                    `}
                  >
                    {action.label}
                  </Link>
                ) : (
                  <button
                    key={action.id}
                    onClick={() => handleActionClick(action)}
                    className={`
                      px-3 py-1.5 text-xs font-medium rounded-lg transition-colors
                      ${action.variant === 'primary'
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : action.variant === 'destructive'
                        ? 'bg-red-600 text-white hover:bg-red-700'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }
                    `}
                  >
                    {action.label}
                  </button>
                )
              ))}
            </div>
          )}
        </div>

        {/* Quick actions */}
        <div className="flex-shrink-0 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {notification.status === 'unread' && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onMarkAsRead(notification.id);
              }}
              className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
              title="Mark as read"
            >
              <Check className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onArchive(notification.id);
            }}
            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
            title="Archive"
          >
            <Archive className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(notification.id);
            }}
            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Unread indicator */}
      {notification.status === 'unread' && !isEscalated && (
        <div className="absolute top-4 right-4 w-2 h-2 bg-blue-600 rounded-full" />
      )}
    </div>
  );
}

// ============================================================================
// NotificationCenter Component
// ============================================================================

export default function NotificationCenter() {
  const {
    notifications,
    unreadCount,
    preferences,
    isOpen,
    setIsOpen,
    togglePanel,
    markAsRead,
    markAllAsRead,
    archiveNotification,
    deleteNotification,
    updatePreferences,
    requestPushPermission,
    isPushSupported,
    isPushEnabled,
  } = useNotifications();

  const [activeFilter, setActiveFilter] = useState<NotificationCategory | 'all'>('all');
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Close panel on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setIsOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, setIsOpen]);

  // Filter notifications
  const filteredNotifications = notifications.filter(n => {
    if (n.status === 'archived') return false;
    if (activeFilter === 'all') return true;
    return n.category === activeFilter;
  });

  // Count by category
  const categoryCounts = notifications.reduce((acc, n) => {
    if (n.status !== 'archived') {
      acc[n.category] = (acc[n.category] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const toggleSound = () => {
    updatePreferences({ soundEnabled: !preferences.soundEnabled });
  };

  const handleEnablePush = async () => {
    const granted = await requestPushPermission();
    if (!granted) {
      // Show message that permission was denied
      console.log('Push notification permission denied');
    }
  };

  return (
    <div className="relative">
      {/* Bell Button */}
      <button
        ref={buttonRef}
        onClick={togglePanel}
        className={`
          relative p-2 rounded-lg transition-colors
          ${isOpen
            ? 'text-blue-600 bg-blue-50'
            : 'text-gray-400 hover:text-blue-600 hover:bg-blue-50'
          }
        `}
        aria-label="Notifications"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-xs font-bold text-white bg-red-500 rounded-full ring-2 ring-white animate-pulse">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <>
          {/* Backdrop for mobile */}
          <div
            className="fixed inset-0 bg-black/20 z-40 lg:hidden"
            onClick={() => setIsOpen(false)}
          />

          <div
            ref={panelRef}
            className="absolute right-0 top-full mt-2 w-[420px] max-w-[calc(100vw-2rem)] bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50"
            role="dialog"
            aria-label="Notifications"
          >
            {/* Header */}
            <div className="px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  <h3 className="font-semibold">Notifications</h3>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={toggleSound}
                    className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                    title={preferences.soundEnabled ? 'Mute sounds' : 'Enable sounds'}
                  >
                    {preferences.soundEnabled ? (
                      <Volume2 className="w-4 h-4" />
                    ) : (
                      <VolumeX className="w-4 h-4" />
                    )}
                  </button>
                  <Link
                    href="/notifications/preferences"
                    className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                    onClick={() => setIsOpen(false)}
                    title="Notification settings"
                  >
                    <Settings className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1.5 hover:bg-white/20 rounded-lg transition-colors lg:hidden"
                    title="Close"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Push notification prompt */}
            {isPushSupported && !isPushEnabled && (
              <div className="px-4 py-3 bg-amber-50 border-b border-amber-100 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-amber-800">
                  <Bell className="w-4 h-4" />
                  <span>Enable push notifications for critical alerts</span>
                </div>
                <button
                  onClick={handleEnablePush}
                  className="px-3 py-1 text-xs font-medium bg-amber-600 text-white rounded-lg hover:bg-amber-700"
                >
                  Enable
                </button>
              </div>
            )}

            {/* Category Filters */}
            <div className="px-4 py-2 border-b border-gray-100 overflow-x-auto">
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveFilter('all')}
                  className={`
                    px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors
                    ${activeFilter === 'all'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100'
                    }
                  `}
                >
                  All ({notifications.filter(n => n.status !== 'archived').length})
                </button>
                {(Object.keys(categoryConfig) as NotificationCategory[]).map(category => {
                  const config = categoryConfig[category];
                  const count = categoryCounts[category] || 0;
                  if (count === 0) return null;

                  return (
                    <button
                      key={category}
                      onClick={() => setActiveFilter(category)}
                      className={`
                        flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors
                        ${activeFilter === category
                          ? `${config.bgColor} ${config.color}`
                          : 'text-gray-600 hover:bg-gray-100'
                        }
                      `}
                    >
                      <config.icon className="w-3 h-3" />
                      {config.label} ({count})
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Notifications List */}
            <div className="max-h-[400px] overflow-y-auto">
              {filteredNotifications.length === 0 ? (
                <div className="py-12 text-center">
                  <BellOff className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                  <p className="text-gray-500 font-medium">No notifications</p>
                  <p className="text-sm text-gray-400">You're all caught up!</p>
                </div>
              ) : (
                filteredNotifications.slice(0, 10).map(notification => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onMarkAsRead={markAsRead}
                    onArchive={archiveNotification}
                    onDelete={deleteNotification}
                    onClose={() => setIsOpen(false)}
                  />
                ))
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
              <button
                onClick={markAllAsRead}
                disabled={unreadCount === 0}
                className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <CheckCheck className="w-4 h-4" />
                Mark all as read
              </button>
              <Link
                href="/notifications"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
              >
                View all
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export { NotificationCenter };

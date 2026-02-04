'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Bell,
  Search,
  Filter,
  Check,
  CheckCheck,
  Archive,
  Trash2,
  Clock,
  AlertCircle,
  MessageSquare,
  UserCheck,
  RefreshCw,
  ChevronDown,
  Settings,
  Calendar,
  X,
  MoreVertical,
} from 'lucide-react';
import { useNotifications, Notification, NotificationCategory } from '@/context/NotificationContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/Input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select';
import { Checkbox } from '@/components/ui/Checkbox';

// ============================================================================
// Category Config
// ============================================================================

const categoryConfig: Record<NotificationCategory, {
  icon: React.ElementType;
  label: string;
  color: string;
  bgColor: string;
}> = {
  alert: { icon: AlertCircle, label: 'Alerts', color: 'text-red-600', bgColor: 'bg-red-100' },
  approval: { icon: UserCheck, label: 'Approvals', color: 'text-purple-600', bgColor: 'bg-purple-100' },
  mention: { icon: MessageSquare, label: 'Mentions', color: 'text-blue-600', bgColor: 'bg-blue-100' },
  update: { icon: RefreshCw, label: 'Updates', color: 'text-green-600', bgColor: 'bg-green-100' },
  reminder: { icon: Clock, label: 'Reminders', color: 'text-orange-600', bgColor: 'bg-orange-100' },
  system: { icon: Bell, label: 'System', color: 'text-gray-600', bgColor: 'bg-gray-100' },
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
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatFullDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

// ============================================================================
// Notification History Page
// ============================================================================

export default function NotificationHistoryPage() {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    archiveNotification,
    deleteNotification,
    clearAll,
  } = useNotifications();

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<NotificationCategory | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'unread' | 'read' | 'archived'>('all');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Filter notifications
  const filteredNotifications = useMemo(() => {
    return notifications.filter(n => {
      // Search filter
      if (searchTerm) {
        const search = searchTerm.toLowerCase();
        if (
          !n.title.toLowerCase().includes(search) &&
          !n.message.toLowerCase().includes(search) &&
          !(n.module?.toLowerCase().includes(search))
        ) {
          return false;
        }
      }

      // Category filter
      if (categoryFilter !== 'all' && n.category !== categoryFilter) {
        return false;
      }

      // Status filter
      if (statusFilter !== 'all' && n.status !== statusFilter) {
        return false;
      }

      // Date filter
      if (dateFilter !== 'all') {
        const now = new Date();
        const notifDate = new Date(n.timestamp);
        const daysDiff = Math.floor((now.getTime() - notifDate.getTime()) / 86400000);

        if (dateFilter === 'today' && daysDiff > 0) return false;
        if (dateFilter === 'week' && daysDiff > 7) return false;
        if (dateFilter === 'month' && daysDiff > 30) return false;
      }

      return true;
    });
  }, [notifications, searchTerm, categoryFilter, statusFilter, dateFilter]);

  // Group notifications by date
  const groupedNotifications = useMemo(() => {
    const groups: { [key: string]: Notification[] } = {};

    filteredNotifications.forEach(n => {
      const date = new Date(n.timestamp);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      let key: string;
      if (date.toDateString() === today.toDateString()) {
        key = 'Today';
      } else if (date.toDateString() === yesterday.toDateString()) {
        key = 'Yesterday';
      } else {
        key = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
      }

      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(n);
    });

    return groups;
  }, [filteredNotifications]);

  // Selection handlers
  const toggleSelection = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const selectAll = () => {
    if (selectedIds.size === filteredNotifications.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredNotifications.map(n => n.id)));
    }
  };

  const handleBulkMarkAsRead = () => {
    selectedIds.forEach(id => markAsRead(id));
    setSelectedIds(new Set());
  };

  const handleBulkArchive = () => {
    selectedIds.forEach(id => archiveNotification(id));
    setSelectedIds(new Set());
  };

  const handleBulkDelete = () => {
    selectedIds.forEach(id => deleteNotification(id));
    setSelectedIds(new Set());
  };

  // Stats
  const stats = {
    total: notifications.length,
    unread: unreadCount,
    archived: notifications.filter(n => n.status === 'archived').length,
  };

  return (
    <div className="w-full py-2 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Bell className="w-6 h-6 text-blue-600" />
            Notification History
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            View and manage all your notifications
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={markAllAsRead} disabled={unreadCount === 0}>
            <CheckCheck className="w-4 h-4 mr-2" />
            Mark all read
          </Button>
          <Link href="/notifications/preferences">
            <Button variant="outline">
              <Settings className="w-4 h-4 mr-2" />
              Preferences
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Bell className="w-8 h-8 text-gray-300" />
            </div>
          </CardContent>
        </Card>
        <Card className={stats.unread > 0 ? 'bg-blue-50 border-blue-200' : ''}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Unread</p>
                <p className="text-2xl font-bold text-blue-600">{stats.unread}</p>
              </div>
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Bell className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Read</p>
                <p className="text-2xl font-bold">{stats.total - stats.unread - stats.archived}</p>
              </div>
              <Check className="w-8 h-8 text-green-300" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Archived</p>
                <p className="text-2xl font-bold">{stats.archived}</p>
              </div>
              <Archive className="w-8 h-8 text-gray-300" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-2 items-center">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search notifications..."
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Category Filter */}
            <Select value={categoryFilter} onValueChange={(v: string) => setCategoryFilter(v as NotificationCategory | 'all')}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {(Object.keys(categoryConfig) as NotificationCategory[]).map(cat => (
                  <SelectItem key={cat} value={cat}>
                    <span className="flex items-center gap-2">
                      {React.createElement(categoryConfig[cat].icon, { className: 'w-4 h-4' })}
                      {categoryConfig[cat].label}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={(v: string) => setStatusFilter(v as 'all' | 'unread' | 'read' | 'archived')}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="unread">Unread</SelectItem>
                <SelectItem value="read">Read</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>

            {/* Date Filter */}
            <Select value={dateFilter} onValueChange={(v: string) => setDateFilter(v as 'all' | 'today' | 'week' | 'month')}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
              </SelectContent>
            </Select>

            {/* Clear filters */}
            {(searchTerm || categoryFilter !== 'all' || statusFilter !== 'all' || dateFilter !== 'all') && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchTerm('');
                  setCategoryFilter('all');
                  setStatusFilter('all');
                  setDateFilter('all');
                }}
              >
                <X className="w-4 h-4 mr-1" />
                Clear filters
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedIds.size > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center justify-between">
          <span className="text-sm text-blue-800">
            {selectedIds.size} notification(s) selected
          </span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleBulkMarkAsRead}>
              <Check className="w-4 h-4 mr-1" />
              Mark as Read
            </Button>
            <Button variant="outline" size="sm" onClick={handleBulkArchive}>
              <Archive className="w-4 h-4 mr-1" />
              Archive
            </Button>
            <Button variant="outline" size="sm" onClick={handleBulkDelete} className="text-red-600 hover:text-red-700">
              <Trash2 className="w-4 h-4 mr-1" />
              Delete
            </Button>
          </div>
        </div>
      )}

      {/* Notifications List */}
      <Card>
        <CardContent className="p-0">
          {filteredNotifications.length === 0 ? (
            <div className="py-16 text-center">
              <Bell className="w-16 h-16 text-gray-200 mb-2" />
              <p className="text-gray-500 font-medium">No notifications found</p>
              <p className="text-sm text-gray-400 mt-1">
                {searchTerm || categoryFilter !== 'all' || statusFilter !== 'all' || dateFilter !== 'all'
                  ? 'Try adjusting your filters'
                  : "You're all caught up!"}
              </p>
            </div>
          ) : (
            <>
              {/* Select All Header */}
              <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-3 bg-gray-50">
                <Checkbox
                  checked={selectedIds.size === filteredNotifications.length && filteredNotifications.length > 0}
                  onChange={selectAll}
                />
                <span className="text-sm text-gray-600">
                  {filteredNotifications.length} notification(s)
                </span>
              </div>

              {/* Grouped Notifications */}
              {Object.entries(groupedNotifications).map(([dateGroup, notifs]) => (
                <div key={dateGroup}>
                  <div className="px-4 py-2 bg-gray-50 border-b border-gray-100">
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {dateGroup}
                    </span>
                  </div>
                  {notifs.map(notification => {
                    const config = categoryConfig[notification.category];
                    const Icon = config.icon;
                    const isSelected = selectedIds.has(notification.id);
                    const isEscalated = notification.metadata?.escalated;

                    return (
                      <div
                        key={notification.id}
                        className={`
                          group px-4 py-4 border-b border-gray-100 hover:bg-gray-50 transition-all
                          ${notification.status === 'unread' ? 'bg-blue-50/50' : ''}
                          ${notification.status === 'archived' ? 'opacity-60' : ''}
                          ${isSelected ? 'bg-blue-50' : ''}
                          ${isEscalated ? 'bg-red-50 border-l-4 border-l-red-500' : ''}
                        `}
                      >
                        <div className="flex items-start gap-2">
                          {/* Checkbox */}
                          <Checkbox
                            checked={isSelected}
                            onChange={() => toggleSelection(notification.id)}
                            className="mt-1"
                          />

                          {/* Icon */}
                          <div className={`flex-shrink-0 w-10 h-10 rounded-full ${config.bgColor} flex items-center justify-center`}>
                            <Icon className={`w-5 h-5 ${config.color}`} />
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
                              <div className="flex items-center gap-2">
                                {notification.status === 'unread' && (
                                  <span className="w-2 h-2 bg-blue-600 rounded-full" />
                                )}
                                <span className="text-xs text-gray-400" title={formatFullDate(notification.timestamp)}>
                                  {formatTime(notification.timestamp)}
                                </span>
                              </div>
                            </div>

                            <p className="text-sm text-gray-600 mt-1">
                              {notification.message}
                            </p>

                            <div className="flex items-center gap-2 mt-2">
                              {notification.module && (
                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs ${config.bgColor} ${config.color}`}>
                                  {notification.module}
                                </span>
                              )}
                              {notification.priority === 'critical' && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-red-100 text-red-700">
                                  Critical
                                </span>
                              )}
                              {notification.priority === 'high' && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-orange-100 text-orange-700">
                                  High Priority
                                </span>
                              )}
                            </div>

                            {/* Actions */}
                            {notification.actions && notification.actions.length > 0 && (
                              <div className="flex gap-2 mt-3">
                                {notification.actions.map(action => (
                                  action.href ? (
                                    <Link
                                      key={action.id}
                                      href={action.href}
                                      className={`
                                        px-3 py-1.5 text-xs font-medium rounded-lg transition-colors
                                        ${action.variant === 'primary'
                                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }
                                      `}
                                    >
                                      {action.label}
                                    </Link>
                                  ) : (
                                    <button
                                      key={action.id}
                                      onClick={action.onClick}
                                      className={`
                                        px-3 py-1.5 text-xs font-medium rounded-lg transition-colors
                                        ${action.variant === 'primary'
                                          ? 'bg-blue-600 text-white hover:bg-blue-700'
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

                          {/* Quick Actions */}
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            {notification.status === 'unread' && (
                              <button
                                onClick={() => markAsRead(notification.id)}
                                className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
                                title="Mark as read"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                            )}
                            <button
                              onClick={() => archiveNotification(notification.id)}
                              className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                              title="Archive"
                            >
                              <Archive className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => deleteNotification(notification.id)}
                              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

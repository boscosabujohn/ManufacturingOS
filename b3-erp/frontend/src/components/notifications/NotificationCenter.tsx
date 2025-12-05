'use client'

import { useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import { Bell, X, Check, CheckCheck, Settings, Trash2, Clock, AlertCircle } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface Notification {
    id: string
    type: string
    title: string
    message: string
    priority: 'info' | 'warning' | 'urgent'
    isRead: boolean
    actionUrl?: string
    createdAt: string
}

export default function NotificationCenter() {
    const [isOpen, setIsOpen] = useState(false)
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [unreadCount, setUnreadCount] = useState(0)
    const [socket, setSocket] = useState<Socket | null>(null)
    const [filter, setFilter] = useState<'all' | 'unread'>('all')

    // Mock user ID - replace with actual user from auth context
    const currentUserId = 'user_123'

    // Initialize Socket.IO connection
    useEffect(() => {
        const newSocket = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001', {
            query: { userId: currentUserId },
        })

        newSocket.on('connect', () => {
            console.log('✅ Connected to notifications')
            newSocket.emit('subscribe:approvals', currentUserId)
        })

        // Listen for new notifications
        newSocket.on('notification:new', (notification: Notification) => {
            setNotifications((prev) => [notification, ...prev])
            setUnreadCount((prev) => prev + 1)
            showToast(notification)
        })

        // Listen for notification read events
        newSocket.on('notification:read', ({ notificationId }) => {
            setNotifications((prev) =>
                prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n))
            )
            setUnreadCount((prev) => Math.max(0, prev - 1))
        })

        // Listen for all read events
        newSocket.on('notifications:all_read', () => {
            setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
            setUnreadCount(0)
        })

        setSocket(newSocket)

        return () => {
            newSocket.disconnect()
        }
    }, [currentUserId])

    // Fetch initial notifications
    useEffect(() => {
        fetchNotifications()
    }, [])

    const fetchNotifications = async () => {
        try {
            // TODO: Replace with actual API call
            const mockNotifications: Notification[] = [
                {
                    id: '1',
                    type: 'approval_assigned',
                    title: 'New Approval Request',
                    message: 'You have a new Purchase Order approval request for PO-2025-001',
                    priority: 'warning',
                    isRead: false,
                    actionUrl: '/workflow/approvals?id=1',
                    createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
                },
                {
                    id: '2',
                    type: 'sla_approaching',
                    title: 'SLA Deadline Approaching',
                    message: 'Design Approval due in 3 hours',
                    priority: 'warning',
                    isRead: false,
                    actionUrl: '/workflow/approvals?id=2',
                    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
                },
                {
                    id: '3',
                    type: 'approval_approved',
                    title: 'Approval Granted',
                    message: 'John Doe approved your Quotation request',
                    priority: 'info',
                    isRead: true,
                    actionUrl: '/workflow/approvals?id=3',
                    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
                },
            ]
            setNotifications(mockNotifications)
            setUnreadCount(mockNotifications.filter((n) => !n.isRead).length)
        } catch (error) {
            console.error('Failed to fetch notifications:', error)
        }
    }

    const showToast = (notification: Notification) => {
        // Simple toast implementation - can be replaced with a toast library
        const toast = document.createElement('div')
        toast.className = `fixed top-4 right-4 z-50 max-w-sm p-4 rounded-lg shadow-lg ${notification.priority === 'urgent'
                ? 'bg-red-600'
                : notification.priority === 'warning'
                    ? 'bg-yellow-600'
                    : 'bg-blue-600'
            } text-white animate-slide-in`
        toast.innerHTML = `
      <div class="font-semibold mb-1">${notification.title}</div>
      <div class="text-sm opacity-90">${notification.message}</div>
    `
        document.body.appendChild(toast)
        setTimeout(() => toast.remove(), 5000)
    }

    const markAsRead = async (notificationId: string) => {
        try {
            // TODO: Call API to mark as read
            setNotifications((prev) =>
                prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n))
            )
            setUnreadCount((prev) => Math.max(0, prev - 1))
        } catch (error) {
            console.error('Failed to mark as read:', error)
        }
    }

    const markAllAsRead = async () => {
        try {
            // TODO: Call API to mark all as read
            setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
            setUnreadCount(0)
        } catch (error) {
            console.error('Failed to mark all as read:', error)
        }
    }

    const deleteNotification = async (notificationId: string) => {
        try {
            // TODO: Call API to delete notification
            setNotifications((prev) => prev.filter((n) => n.id !== notificationId))
            const notification = notifications.find((n) => n.id === notificationId)
            if (notification && !notification.isRead) {
                setUnreadCount((prev) => Math.max(0, prev - 1))
            }
        } catch (error) {
            console.error('Failed to delete notification:', error)
        }
    }

    const handleNotificationClick = (notification: Notification) => {
        if (!notification.isRead) {
            markAsRead(notification.id)
        }
        if (notification.actionUrl) {
            window.location.href = notification.actionUrl
        }
        setIsOpen(false)
    }

    const filteredNotifications =
        filter === 'unread' ? notifications.filter((n) => !n.isRead) : notifications

    const getPriorityIcon = (priority: string) => {
        switch (priority) {
            case 'urgent':
                return <AlertCircle className="h-5 w-5 text-red-500" />
            case 'warning':
                return <Clock className="h-5 w-5 text-yellow-500" />
            default:
                return <Bell className="h-5 w-5 text-blue-500" />
        }
    }

    return (
        <div className="relative">
            {/* Notification Bell Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
                <Bell className="h-6 w-6" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[20px] h-5 px-1 text-xs font-bold text-white bg-red-500 rounded-full animate-pulse">
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Notification Dropdown */}
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />

                    {/* Dropdown Panel */}
                    <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-[600px] flex flex-col">
                        {/* Header */}
                        <div className="p-4 border-b border-gray-200">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-1 hover:bg-gray-100 rounded"
                                >
                                    <X className="h-5 w-5 text-gray-400" />
                                </button>
                            </div>

                            {/* Filter Tabs */}
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setFilter('all')}
                                    className={`flex-1 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${filter === 'all'
                                            ? 'bg-blue-100 text-blue-700'
                                            : 'text-gray-600 hover:bg-gray-100'
                                        }`}
                                >
                                    All ({notifications.length})
                                </button>
                                <button
                                    onClick={() => setFilter('unread')}
                                    className={`flex-1 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${filter === 'unread'
                                            ? 'bg-blue-100 text-blue-700'
                                            : 'text-gray-600 hover:bg-gray-100'
                                        }`}
                                >
                                    Unread ({unreadCount})
                                </button>
                            </div>
                        </div>

                        {/* Notifications List */}
                        <div className="flex-1 overflow-y-auto">
                            {filteredNotifications.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12 text-center">
                                    <Bell className="h-12 w-12 text-gray-300 mb-3" />
                                    <p className="text-gray-500 font-medium">No notifications</p>
                                    <p className="text-sm text-gray-400 mt-1">You're all caught up!</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-gray-100">
                                    {filteredNotifications.map((notification) => (
                                        <div
                                            key={notification.id}
                                            className={`p-4 cursor-pointer transition-colors ${notification.isRead ? 'bg-white hover:bg-gray-50' : 'bg-blue-50 hover:bg-blue-100'
                                                }`}
                                            onClick={() => handleNotificationClick(notification)}
                                        >
                                            <div className="flex items-start gap-3">
                                                {/* Icon */}
                                                <div className="flex-shrink-0 mt-0.5">
                                                    {getPriorityIcon(notification.priority)}
                                                </div>

                                                {/* Content */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between gap-2">
                                                        <h4 className={`text-sm font-medium ${notification.isRead ? 'text-gray-900' : 'text-gray-900 font-semibold'
                                                            }`}>
                                                            {notification.title}
                                                        </h4>
                                                        {!notification.isRead && (
                                                            <span className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-1" />
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                                        {notification.message}
                                                    </p>
                                                    <p className="text-xs text-gray-400 mt-2">
                                                        {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                                                    </p>
                                                </div>

                                                {/* Actions */}
                                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    {!notification.isRead && (
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation()
                                                                markAsRead(notification.id)
                                                            }}
                                                            className="p-1 hover:bg-white rounded"
                                                            title="Mark as read"
                                                        >
                                                            <Check className="h-4 w-4 text-gray-400" />
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            deleteNotification(notification.id)
                                                        }}
                                                        className="p-1 hover:bg-white rounded"
                                                        title="Delete"
                                                    >
                                                        <Trash2 className="h-4 w-4 text-gray-400" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        {notifications.length > 0 && (
                            <div className="p-3 border-t border-gray-200 bg-gray-50">
                                <div className="flex items-center justify-between">
                                    <button
                                        onClick={markAllAsRead}
                                        disabled={unreadCount === 0}
                                        className="text-sm text-blue-600 hover:text-blue-700 font-medium disabled:text-gray-400 disabled:cursor-not-allowed flex items-center gap-1"
                                    >
                                        <CheckCheck className="h-4 w-4" />
                                        Mark all as read
                                    </button>
                                    <button className="text-sm text-gray-600 hover:text-gray-900 font-medium flex items-center gap-1">
                                        <Settings className="h-4 w-4" />
                                        Settings
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    )
}

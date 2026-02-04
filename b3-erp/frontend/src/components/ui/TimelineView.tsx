'use client'

import React from 'react'
import { Clock, User, Mail, Phone, MessageCircle, CheckCircle2, AlertCircle, Info } from 'lucide-react'

export interface TimelineEvent {
  id: string
  type: 'message' | 'status_change' | 'assignment' | 'note' | 'system' | 'call' | 'email'
  title: string
  description?: string
  timestamp: string
  user?: {
    name: string
    avatar?: string
  }
  metadata?: Record<string, any>
  icon?: React.ComponentType<{ className?: string }>
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info'
}

export interface TimelineViewProps {
  events: TimelineEvent[]
  showAvatars?: boolean
  compact?: boolean
  className?: string
}

/**
 * TimelineView - Activity timeline component
 *
 * @example
 * <TimelineView
 *   events={[
 *     {
 *       id: '1',
 *       type: 'status_change',
 *       title: 'Ticket status changed',
 *       description: 'From "Open" to "In Progress"',
 *       timestamp: '2 hours ago',
 *       user: { name: 'John Doe' },
 *       variant: 'info'
 *     }
 *   ]}
 *   showAvatars
 * />
 */
export const TimelineView: React.FC<TimelineViewProps> = ({
  events,
  showAvatars = true,
  compact = false,
  className = ''
}) => {
  const getDefaultIcon = (type: TimelineEvent['type']) => {
    const icons = {
      message: MessageCircle,
      status_change: Info,
      assignment: User,
      note: MessageCircle,
      system: Info,
      call: Phone,
      email: Mail
    }
    return icons[type] || Info
  }

  const getVariantColors = (variant: TimelineEvent['variant']) => {
    const colors = {
      default: {
        icon: 'text-gray-600',
        bg: 'bg-gray-100',
        line: 'bg-gray-300'
      },
      success: {
        icon: 'text-green-600',
        bg: 'bg-green-100',
        line: 'bg-green-300'
      },
      warning: {
        icon: 'text-orange-600',
        bg: 'bg-orange-100',
        line: 'bg-orange-300'
      },
      error: {
        icon: 'text-red-600',
        bg: 'bg-red-100',
        line: 'bg-red-300'
      },
      info: {
        icon: 'text-blue-600',
        bg: 'bg-blue-100',
        line: 'bg-blue-300'
      }
    }
    return colors[variant || 'default']
  }

  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <Clock className="h-12 w-12 text-gray-400 mb-3" />
        <p className="text-gray-600 font-medium">No activity yet</p>
        <p className="text-sm text-gray-500 mt-1">Timeline events will appear here</p>
      </div>
    )
  }

  return (
    <div className={`relative ${className}`}>
      {events.map((event, index) => {
        const Icon = event.icon || getDefaultIcon(event.type)
        const colors = getVariantColors(event.variant)
        const isLast = index === events.length - 1

        return (
          <div key={event.id} className="relative pb-8">
            {/* Timeline Line */}
            {!isLast && (
              <div
                className={`absolute left-[19px] top-8 w-0.5 h-full ${colors.line}`}
              />
            )}

            <div className="flex items-start gap-2">
              {/* Icon/Avatar */}
              <div className={`relative flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full ${colors.bg}`}>
                <Icon className={`h-5 w-5 ${colors.icon}`} />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 pt-1">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h4 className={`font-semibold text-gray-900 ${compact ? 'text-sm' : 'text-base'}`}>
                    {event.title}
                  </h4>
                  <span className={`text-gray-500 flex-shrink-0 ${compact ? 'text-xs' : 'text-sm'}`}>
                    {event.timestamp}
                  </span>
                </div>

                {event.description && (
                  <p className={`text-gray-600 ${compact ? 'text-xs' : 'text-sm'} mb-2`}>
                    {event.description}
                  </p>
                )}

                {event.user && showAvatars && (
                  <div className="flex items-center gap-2 mt-2">
                    {event.user.avatar ? (
                      <img
                        src={event.user.avatar}
                        alt={event.user.name}
                        className="w-6 h-6 rounded-full"
                      />
                    ) : (
                      <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                        {event.user.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span className="text-sm text-gray-600">{event.user.name}</span>
                  </div>
                )}

                {event.metadata && Object.keys(event.metadata).length > 0 && (
                  <div className="mt-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    {Object.entries(event.metadata).map(([key, value]) => (
                      <div key={key} className="flex items-center gap-2 text-xs">
                        <span className="text-gray-600 font-medium capitalize">
                          {key.replace(/_/g, ' ')}:
                        </span>
                        <span className="text-gray-900">{String(value)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

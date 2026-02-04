'use client'

import React from 'react'
import { Clock, User, AlertCircle, TrendingUp, TrendingDown } from 'lucide-react'
import type { Channel } from './ChannelSelector'

export interface QueueItem {
  id: string
  title: string
  customer: string
  channel: Channel
  priority: 'critical' | 'high' | 'medium' | 'low'
  status: 'waiting' | 'assigned' | 'in_progress'
  assignedTo?: string
  waitTime: number // in minutes
  preview: string
  createdAt: string
}

export interface QueueStats {
  total: number
  waiting: number
  assigned: number
  avgWaitTime: number
  longestWait: number
}

export interface QueueManagerProps {
  items: QueueItem[]
  stats?: QueueStats
  onItemClick?: (item: QueueItem) => void
  onAssign?: (itemId: string, agentId: string) => void
  showStats?: boolean
  showFilters?: boolean
  className?: string
}

/**
 * QueueManager - Display and manage support ticket queue
 *
 * @example
 * <QueueManager
 *   items={queueItems}
 *   stats={queueStats}
 *   onItemClick={handleItemClick}
 *   onAssign={handleAssign}
 *   showStats
 * />
 */
export const QueueManager: React.FC<QueueManagerProps> = ({
  items,
  stats,
  onItemClick,
  onAssign,
  showStats = true,
  showFilters = false,
  className = ''
}) => {
  const getPriorityColor = (priority: QueueItem['priority']) => {
    const colors = {
      critical: 'bg-red-100 text-red-700 border-red-200',
      high: 'bg-orange-100 text-orange-700 border-orange-200',
      medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      low: 'bg-green-100 text-green-700 border-green-200'
    }
    return colors[priority]
  }

  const getStatusColor = (status: QueueItem['status']) => {
    const colors = {
      waiting: 'bg-gray-100 text-gray-700',
      assigned: 'bg-blue-100 text-blue-700',
      in_progress: 'bg-purple-100 text-purple-700'
    }
    return colors[status]
  }

  const formatWaitTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Stats */}
      {showStats && stats && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <div className="bg-white rounded-lg border border-gray-200 p-3">
            <p className="text-sm text-gray-600">Total in Queue</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-3">
            <p className="text-sm text-gray-600">Waiting</p>
            <p className="text-2xl font-bold text-orange-600 mt-1">{stats.waiting}</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-3">
            <p className="text-sm text-gray-600">Assigned</p>
            <p className="text-2xl font-bold text-blue-600 mt-1">{stats.assigned}</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-3">
            <p className="text-sm text-gray-600">Avg Wait Time</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{formatWaitTime(stats.avgWaitTime)}</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-3">
            <p className="text-sm text-gray-600">Longest Wait</p>
            <p className="text-2xl font-bold text-red-600 mt-1">{formatWaitTime(stats.longestWait)}</p>
          </div>
        </div>
      )}

      {/* Queue List */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Active Queue</h3>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="h-4 w-4" />
              <span>Real-time</span>
            </div>
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {items.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500">No items in queue</p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                onClick={() => onItemClick?.(item)}
                className="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <div className="flex items-start gap-2">
                  {/* Wait Time Indicator */}
                  <div className="flex flex-col items-center justify-center min-w-[60px]">
                    <Clock className={`h-5 w-5 mb-1 ${item.waitTime > 30 ? 'text-red-600' : item.waitTime > 15 ? 'text-orange-600' : 'text-gray-400'}`} />
                    <span className={`text-xs font-semibold ${item.waitTime > 30 ? 'text-red-600' : item.waitTime > 15 ? 'text-orange-600' : 'text-gray-600'}`}>
                      {formatWaitTime(item.waitTime)}
                    </span>
                  </div>

                  {/* Main Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-gray-900 truncate">{item.title}</h4>
                          <span className={`px-2 py-0.5 text-xs font-semibold rounded-full border ${getPriorityColor(item.priority)}`}>
                            {item.priority.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{item.customer}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.status)}`}>
                        {item.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>

                    <p className="text-sm text-gray-700 mb-3 line-clamp-2">{item.preview}</p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span className="capitalize">{item.channel}</span>
                        <span>{item.createdAt}</span>
                      </div>
                      {item.assignedTo && (
                        <div className="flex items-center gap-1.5 text-xs text-gray-600">
                          <User className="h-3 w-3" />
                          <span>{item.assignedTo}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  {item.status === 'waiting' && onAssign && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onAssign(item.id, 'current-agent')
                      }}
                      className="px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Assign to Me
                    </button>
                  )}
                </div>

                {/* SLA Warning */}
                {item.waitTime > 30 && (
                  <div className="flex items-center gap-2 mt-3 p-2 bg-red-50 border border-red-200 rounded-lg">
                    <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0" />
                    <p className="text-xs text-red-700 font-medium">
                      SLA breach risk - Immediate attention required
                    </p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

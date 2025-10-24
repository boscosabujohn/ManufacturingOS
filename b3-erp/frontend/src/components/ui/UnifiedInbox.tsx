'use client'

import React, { useState } from 'react'
import { Search, Filter, RefreshCw, MoreVertical, Star, Archive, Tag, Clock, User, Mail, MessageCircle, Phone, Paperclip } from 'lucide-react'
import type { Channel } from './ChannelSelector'

export interface ConversationMessage {
  id: string
  ticketId: string
  subject: string
  customer: {
    name: string
    avatar?: string
    email: string
  }
  channel: Channel
  lastMessage: string
  lastMessageTime: string
  unreadCount: number
  priority: 'critical' | 'high' | 'medium' | 'low'
  status: 'open' | 'pending' | 'resolved' | 'closed'
  assignedTo?: {
    name: string
    avatar?: string
  }
  tags?: string[]
  starred?: boolean
  hasAttachments?: boolean
  slaDeadline?: string
}

export interface UnifiedInboxProps {
  conversations: ConversationMessage[]
  selectedConversation?: string
  onConversationSelect?: (conversationId: string) => void
  onRefresh?: () => void
  onSearch?: (query: string) => void
  onFilterChange?: (filters: any) => void
  loading?: boolean
  className?: string
}

/**
 * UnifiedInbox - Omnichannel unified inbox view
 *
 * @example
 * <UnifiedInbox
 *   conversations={conversations}
 *   selectedConversation={selectedId}
 *   onConversationSelect={setSelectedId}
 *   onRefresh={handleRefresh}
 * />
 */
export const UnifiedInbox: React.FC<UnifiedInboxProps> = ({
  conversations,
  selectedConversation,
  onConversationSelect,
  onRefresh,
  onSearch,
  onFilterChange,
  loading = false,
  className = ''
}) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  const getChannelIcon = (channel: Channel) => {
    const icons = {
      email: Mail,
      chat: MessageCircle,
      phone: Phone,
      sms: MessageCircle,
      whatsapp: MessageCircle,
      facebook: MessageCircle,
      twitter: MessageCircle,
      webchat: MessageCircle,
      video: Phone,
      all: MessageCircle
    }
    return icons[channel] || MessageCircle
  }

  const getChannelColor = (channel: Channel) => {
    const colors = {
      email: 'text-blue-600 bg-blue-100',
      chat: 'text-green-600 bg-green-100',
      phone: 'text-purple-600 bg-purple-100',
      sms: 'text-cyan-600 bg-cyan-100',
      whatsapp: 'text-emerald-600 bg-emerald-100',
      facebook: 'text-indigo-600 bg-indigo-100',
      twitter: 'text-sky-600 bg-sky-100',
      webchat: 'text-orange-600 bg-orange-100',
      video: 'text-pink-600 bg-pink-100',
      all: 'text-gray-600 bg-gray-100'
    }
    return colors[channel] || 'text-gray-600 bg-gray-100'
  }

  const getPriorityIndicator = (priority: ConversationMessage['priority']) => {
    const colors = {
      critical: 'bg-red-500',
      high: 'bg-orange-500',
      medium: 'bg-yellow-500',
      low: 'bg-green-500'
    }
    return colors[priority]
  }

  const formatTime = (time: string) => {
    // Simple time formatting - in production, use date-fns or similar
    return time
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    onSearch?.(query)
  }

  return (
    <div className={`flex flex-col h-full bg-white rounded-lg border border-gray-200 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Unified Inbox</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={onRefresh}
            disabled={loading}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
            title="Refresh"
          >
            <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            title="Filters"
          >
            <Filter className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto">
        {conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <MessageCircle className="h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-600 font-medium">No conversations</p>
            <p className="text-sm text-gray-500 mt-1">
              {searchQuery ? 'Try adjusting your search' : 'All caught up!'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {conversations.map((conversation) => {
              const ChannelIcon = getChannelIcon(conversation.channel)
              const isSelected = selectedConversation === conversation.id

              return (
                <div
                  key={conversation.id}
                  onClick={() => onConversationSelect?.(conversation.id)}
                  className={`
                    p-4 cursor-pointer transition-colors relative
                    ${isSelected ? 'bg-blue-50 border-l-4 border-l-blue-600' : 'hover:bg-gray-50 border-l-4 border-l-transparent'}
                  `}
                >
                  {/* Priority Indicator */}
                  <div className={`absolute top-4 right-4 w-2 h-2 rounded-full ${getPriorityIndicator(conversation.priority)}`} />

                  <div className="flex items-start gap-3">
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                      {conversation.customer.avatar ? (
                        <img
                          src={conversation.customer.avatar}
                          alt={conversation.customer.name}
                          className="w-10 h-10 rounded-full"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                          {conversation.customer.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <h4 className="font-semibold text-gray-900 truncate">
                            {conversation.customer.name}
                          </h4>
                          {conversation.starred && (
                            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 flex-shrink-0" />
                          )}
                        </div>
                        <span className="text-xs text-gray-500 whitespace-nowrap">
                          {formatTime(conversation.lastMessageTime)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs text-gray-600 font-medium truncate">
                          {conversation.subject}
                        </span>
                      </div>

                      <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                        {conversation.lastMessage}
                      </p>

                      {/* Meta Info */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full ${getChannelColor(conversation.channel)}`}>
                            <ChannelIcon className="h-3 w-3" />
                            <span className="text-xs font-medium capitalize">{conversation.channel}</span>
                          </div>

                          {conversation.hasAttachments && (
                            <Paperclip className="h-3 w-3 text-gray-400" />
                          )}

                          {conversation.tags && conversation.tags.length > 0 && (
                            <div className="flex items-center gap-1">
                              <Tag className="h-3 w-3 text-gray-400" />
                              <span className="text-xs text-gray-500">{conversation.tags.length}</span>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          {conversation.assignedTo && (
                            <div className="flex items-center gap-1 text-xs text-gray-600">
                              <User className="h-3 w-3" />
                              <span className="truncate max-w-[80px]">{conversation.assignedTo.name}</span>
                            </div>
                          )}

                          {conversation.unreadCount > 0 && (
                            <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 bg-blue-600 text-white text-xs font-semibold rounded-full">
                              {conversation.unreadCount}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* SLA Warning */}
                      {conversation.slaDeadline && (
                        <div className="flex items-center gap-1 mt-2 text-xs text-orange-600">
                          <Clock className="h-3 w-3" />
                          <span>SLA: {conversation.slaDeadline}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Footer Stats */}
      <div className="p-3 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between text-xs text-gray-600">
          <span>{conversations.length} conversations</span>
          <span>{conversations.filter(c => c.unreadCount > 0).length} unread</span>
        </div>
      </div>
    </div>
  )
}

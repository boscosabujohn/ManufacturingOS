'use client'

import React from 'react'
import { Mail, MessageCircle, Phone, Facebook, Twitter, MessageSquare, Video, Smartphone } from 'lucide-react'

export type Channel = 'email' | 'chat' | 'phone' | 'sms' | 'whatsapp' | 'facebook' | 'twitter' | 'webchat' | 'video' | 'all'

export interface ChannelConfig {
  id: Channel
  label: string
  icon: React.ComponentType<{ className?: string }>
  color: string
  bgColor: string
  count?: number
}

export interface ChannelSelectorProps {
  selectedChannel: Channel
  onChannelChange: (channel: Channel) => void
  channels?: ChannelConfig[]
  showCounts?: boolean
  variant?: 'horizontal' | 'vertical' | 'grid'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const defaultChannels: ChannelConfig[] = [
  { id: 'all', label: 'All Channels', icon: MessageCircle, color: 'text-gray-700', bgColor: 'bg-gray-100' },
  { id: 'email', label: 'Email', icon: Mail, color: 'text-blue-700', bgColor: 'bg-blue-100' },
  { id: 'chat', label: 'Live Chat', icon: MessageSquare, color: 'text-green-700', bgColor: 'bg-green-100' },
  { id: 'phone', label: 'Phone', icon: Phone, color: 'text-purple-700', bgColor: 'bg-purple-100' },
  { id: 'sms', label: 'SMS', icon: Smartphone, color: 'text-cyan-700', bgColor: 'bg-cyan-100' },
  { id: 'whatsapp', label: 'WhatsApp', icon: MessageCircle, color: 'text-emerald-700', bgColor: 'bg-emerald-100' },
  { id: 'facebook', label: 'Facebook', icon: Facebook, color: 'text-indigo-700', bgColor: 'bg-indigo-100' },
  { id: 'twitter', label: 'Twitter', icon: Twitter, color: 'text-sky-700', bgColor: 'bg-sky-100' },
  { id: 'webchat', label: 'Web Chat', icon: MessageSquare, color: 'text-orange-700', bgColor: 'bg-orange-100' },
  { id: 'video', label: 'Video Call', icon: Video, color: 'text-pink-700', bgColor: 'bg-pink-100' }
]

/**
 * ChannelSelector - Multi-channel selector for omnichannel support
 *
 * @example
 * <ChannelSelector
 *   selectedChannel={selectedChannel}
 *   onChannelChange={setSelectedChannel}
 *   showCounts
 *   variant="horizontal"
 * />
 */
export const ChannelSelector: React.FC<ChannelSelectorProps> = ({
  selectedChannel,
  onChannelChange,
  channels = defaultChannels,
  showCounts = true,
  variant = 'horizontal',
  size = 'md',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-2',
    lg: 'text-base px-4 py-2.5'
  }

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  }

  const variantClasses = {
    horizontal: 'flex items-center gap-2 overflow-x-auto',
    vertical: 'flex flex-col gap-1',
    grid: 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2'
  }

  return (
    <div className={`${variantClasses[variant]} ${className}`}>
      {channels.map((channel) => {
        const Icon = channel.icon
        const isActive = selectedChannel === channel.id

        return (
          <button
            key={channel.id}
            onClick={() => onChannelChange(channel.id)}
            className={`
              ${sizeClasses[size]}
              flex items-center gap-2 rounded-lg font-medium transition-all
              ${isActive
                ? `${channel.bgColor} ${channel.color} ring-2 ring-offset-1 ring-${channel.color.split('-')[1]}-500`
                : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
              }
              ${variant === 'horizontal' ? 'whitespace-nowrap' : 'w-full'}
            `}
          >
            <Icon className={`${iconSizes[size]} flex-shrink-0`} />
            <span className="flex-1 text-left">{channel.label}</span>
            {showCounts && channel.count !== undefined && (
              <span className={`
                ml-auto px-2 py-0.5 text-xs font-semibold rounded-full
                ${isActive
                  ? 'bg-white/50'
                  : 'bg-gray-100 text-gray-700'
                }
              `}>
                {channel.count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}

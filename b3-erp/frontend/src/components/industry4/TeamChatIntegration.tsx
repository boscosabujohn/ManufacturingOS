'use client';

import React, { useState, useEffect, useRef } from 'react';

// Types
export type ChannelType = 'project' | 'work_order' | 'team' | 'direct' | 'announcement';
export type MessageType = 'text' | 'file' | 'image' | 'system' | 'mention';
export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read';

export interface ChatChannel {
  id: string;
  name: string;
  type: ChannelType;
  description?: string;
  resourceId?: string;
  participants: ChatParticipant[];
  unreadCount: number;
  lastMessage?: ChatMessage;
  isPinned: boolean;
  isMuted: boolean;
}

export interface ChatParticipant {
  id: string;
  name: string;
  avatar: string;
  role: string;
  isOnline: boolean;
}

export interface ChatMessage {
  id: string;
  channelId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  content: string;
  type: MessageType;
  status: MessageStatus;
  timestamp: Date;
  attachments?: MessageAttachment[];
  mentions?: string[];
  reactions?: MessageReaction[];
  isEdited: boolean;
  replyTo?: {
    messageId: string;
    senderName: string;
    preview: string;
  };
}

export interface MessageAttachment {
  id: string;
  name: string;
  type: 'document' | 'image' | 'drawing' | 'spreadsheet';
  size: number;
  url: string;
}

export interface MessageReaction {
  emoji: string;
  count: number;
  users: string[];
}

interface TeamChatIntegrationProps {
  className?: string;
  defaultChannelId?: string;
}

// Mock data generators
const generateChannels = (): ChatChannel[] => [
  {
    id: 'ch1',
    name: 'Project Alpha',
    type: 'project',
    description: 'Customer Project Alpha discussions',
    resourceId: 'PRJ-2024-022',
    participants: [
      { id: 'u1', name: 'Sarah Chen', avatar: 'SC', role: 'Production Manager', isOnline: true },
      { id: 'u2', name: 'Mike Rodriguez', avatar: 'MR', role: 'Quality Engineer', isOnline: true },
      { id: 'u3', name: 'Emily Watson', avatar: 'EW', role: 'Supply Chain Lead', isOnline: false },
      { id: 'u4', name: 'James Park', avatar: 'JP', role: 'Shop Floor Supervisor', isOnline: true },
    ],
    unreadCount: 3,
    lastMessage: {
      id: 'm1',
      channelId: 'ch1',
      senderId: 'u2',
      senderName: 'Mike Rodriguez',
      senderAvatar: 'MR',
      content: 'Quality inspection passed! Moving to assembly.',
      type: 'text',
      status: 'delivered',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      isEdited: false
    },
    isPinned: true,
    isMuted: false
  },
  {
    id: 'ch2',
    name: 'WO-2024-1547',
    type: 'work_order',
    description: 'Assembly Order #1547',
    resourceId: 'WO-2024-1547',
    participants: [
      { id: 'u1', name: 'Sarah Chen', avatar: 'SC', role: 'Production Manager', isOnline: true },
      { id: 'u4', name: 'James Park', avatar: 'JP', role: 'Shop Floor Supervisor', isOnline: true },
      { id: 'u6', name: 'David Kim', avatar: 'DK', role: 'Maintenance Tech', isOnline: true },
    ],
    unreadCount: 0,
    lastMessage: {
      id: 'm2',
      channelId: 'ch2',
      senderId: 'u4',
      senderName: 'James Park',
      senderAvatar: 'JP',
      content: 'Started batch production. ETA 3 hours.',
      type: 'text',
      status: 'read',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      isEdited: false
    },
    isPinned: false,
    isMuted: false
  },
  {
    id: 'ch3',
    name: 'Production Team',
    type: 'team',
    description: 'Production department channel',
    participants: [
      { id: 'u1', name: 'Sarah Chen', avatar: 'SC', role: 'Production Manager', isOnline: true },
      { id: 'u4', name: 'James Park', avatar: 'JP', role: 'Shop Floor Supervisor', isOnline: true },
      { id: 'u7', name: 'Anna Martinez', avatar: 'AM', role: 'Planner', isOnline: false },
    ],
    unreadCount: 12,
    lastMessage: {
      id: 'm3',
      channelId: 'ch3',
      senderId: 'u1',
      senderName: 'Sarah Chen',
      senderAvatar: 'SC',
      content: '@everyone Shift meeting in 15 minutes',
      type: 'mention',
      status: 'delivered',
      timestamp: new Date(Date.now() - 2 * 60 * 1000),
      mentions: ['everyone'],
      isEdited: false
    },
    isPinned: true,
    isMuted: false
  },
  {
    id: 'ch4',
    name: 'Announcements',
    type: 'announcement',
    description: 'Company-wide announcements',
    participants: [],
    unreadCount: 1,
    lastMessage: {
      id: 'm4',
      channelId: 'ch4',
      senderId: 'u0',
      senderName: 'System',
      senderAvatar: '📢',
      content: 'New safety protocol updates have been posted. Please review.',
      type: 'system',
      status: 'delivered',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      isEdited: false
    },
    isPinned: false,
    isMuted: false
  }
];

const generateMessages = (channelId: string): ChatMessage[] => {
  const baseMessages: ChatMessage[] = [
    {
      id: `${channelId}-m1`,
      channelId,
      senderId: 'u1',
      senderName: 'Sarah Chen',
      senderAvatar: 'SC',
      content: 'Good morning team! Here\'s the status update for today.',
      type: 'text',
      status: 'read',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      isEdited: false,
      reactions: [{ emoji: '👍', count: 3, users: ['u2', 'u4', 'u6'] }]
    },
    {
      id: `${channelId}-m2`,
      channelId,
      senderId: 'u4',
      senderName: 'James Park',
      senderAvatar: 'JP',
      content: 'Line A is running at full capacity. We\'ve completed 450 units so far.',
      type: 'text',
      status: 'read',
      timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000),
      isEdited: false
    },
    {
      id: `${channelId}-m3`,
      channelId,
      senderId: 'u2',
      senderName: 'Mike Rodriguez',
      senderAvatar: 'MR',
      content: 'Quality check on batch #547 is complete. All units passed inspection.',
      type: 'text',
      status: 'read',
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
      attachments: [
        { id: 'att1', name: 'QC_Report_547.pdf', type: 'document', size: 245000, url: '#' }
      ],
      isEdited: false,
      reactions: [{ emoji: '✅', count: 2, users: ['u1', 'u4'] }]
    },
    {
      id: `${channelId}-m4`,
      channelId,
      senderId: 'u6',
      senderName: 'David Kim',
      senderAvatar: 'DK',
      content: '@Sarah Chen We have a minor issue with machine #3. Scheduled maintenance for 2pm.',
      type: 'mention',
      status: 'read',
      timestamp: new Date(Date.now() - 45 * 60 * 1000),
      mentions: ['u1'],
      isEdited: false
    },
    {
      id: `${channelId}-m5`,
      channelId,
      senderId: 'u1',
      senderName: 'Sarah Chen',
      senderAvatar: 'SC',
      content: 'Thanks David. Please keep us posted on the repair status.',
      type: 'text',
      status: 'read',
      timestamp: new Date(Date.now() - 40 * 60 * 1000),
      replyTo: {
        messageId: `${channelId}-m4`,
        senderName: 'David Kim',
        preview: '@Sarah Chen We have a minor issue with machine #3...'
      },
      isEdited: false
    },
    {
      id: `${channelId}-m6`,
      channelId,
      senderId: 'u2',
      senderName: 'Mike Rodriguez',
      senderAvatar: 'MR',
      content: 'Quality inspection passed! Moving to assembly.',
      type: 'text',
      status: 'delivered',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      isEdited: false
    }
  ];

  return baseMessages;
};

const TeamChatIntegration: React.FC<TeamChatIntegrationProps> = ({ className = '', defaultChannelId }) => {
  const [channels, setChannels] = useState<ChatChannel[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<ChatChannel | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showChannelList, setShowChannelList] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const generatedChannels = generateChannels();
    setChannels(generatedChannels);
    if (defaultChannelId) {
      const channel = generatedChannels.find(c => c.id === defaultChannelId);
      if (channel) setSelectedChannel(channel);
    } else {
      setSelectedChannel(generatedChannels[0]);
    }
  }, [defaultChannelId]);

  useEffect(() => {
    if (selectedChannel) {
      setMessages(generateMessages(selectedChannel.id));
    }
  }, [selectedChannel]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getChannelIcon = (type: ChannelType): string => {
    switch (type) {
      case 'project': return '📁';
      case 'work_order': return '📋';
      case 'team': return '👥';
      case 'direct': return '💬';
      case 'announcement': return '📢';
    }
  };

  const formatTime = (date: Date): string => {
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    if (isToday) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedChannel) return;

    const message: ChatMessage = {
      id: `msg-${Date.now()}`,
      channelId: selectedChannel.id,
      senderId: 'current-user',
      senderName: 'You',
      senderAvatar: 'YO',
      content: newMessage,
      type: newMessage.includes('@') ? 'mention' : 'text',
      status: 'sending',
      timestamp: new Date(),
      isEdited: false
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    // Simulate message being sent
    setTimeout(() => {
      setMessages(prev =>
        prev.map(m => m.id === message.id ? { ...m, status: 'sent' as MessageStatus } : m)
      );
    }, 500);
  };

  const filteredChannels = channels.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pinnedChannels = filteredChannels.filter(c => c.isPinned);
  const otherChannels = filteredChannels.filter(c => !c.isPinned);

  return (
    <div className={`bg-gray-50 rounded-lg overflow-hidden flex h-[600px] ${className}`}>
      {/* Channel List */}
      {showChannelList && (
        <div className="w-72 bg-white border-r border-gray-200 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-800 mb-3">Messages</h2>
            <div className="relative">
              <input
                type="text"
                placeholder="Search channels..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 pl-9 bg-gray-100 border-0 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
              />
              <svg className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Channel List */}
          <div className="flex-1 overflow-y-auto">
            {pinnedChannels.length > 0 && (
              <div className="px-3 py-2">
                <div className="text-xs font-semibold text-gray-500 uppercase mb-2">📌 Pinned</div>
                {pinnedChannels.map(channel => (
                  <button
                    key={channel.id}
                    onClick={() => setSelectedChannel(channel)}
                    className={`w-full p-2 rounded-lg text-left mb-1 transition-colors ${
                      selectedChannel?.id === channel.id
                        ? 'bg-blue-50 border-l-2 border-blue-600'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{getChannelIcon(channel.type)}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-sm text-gray-800 truncate">{channel.name}</span>
                          {channel.unreadCount > 0 && (
                            <span className="bg-blue-600 text-white text-xs px-1.5 py-0.5 rounded-full">
                              {channel.unreadCount}
                            </span>
                          )}
                        </div>
                        {channel.lastMessage && (
                          <p className="text-xs text-gray-500 truncate">
                            {channel.lastMessage.senderName}: {channel.lastMessage.content}
                          </p>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            <div className="px-3 py-2">
              <div className="text-xs font-semibold text-gray-500 uppercase mb-2">Channels</div>
              {otherChannels.map(channel => (
                <button
                  key={channel.id}
                  onClick={() => setSelectedChannel(channel)}
                  className={`w-full p-2 rounded-lg text-left mb-1 transition-colors ${
                    selectedChannel?.id === channel.id
                      ? 'bg-blue-50 border-l-2 border-blue-600'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{getChannelIcon(channel.type)}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm text-gray-800 truncate">{channel.name}</span>
                        {channel.unreadCount > 0 && (
                          <span className="bg-blue-600 text-white text-xs px-1.5 py-0.5 rounded-full">
                            {channel.unreadCount}
                          </span>
                        )}
                      </div>
                      {channel.lastMessage && (
                        <p className="text-xs text-gray-500 truncate">
                          {channel.lastMessage.senderName}: {channel.lastMessage.content}
                        </p>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedChannel ? (
          <>
            {/* Chat Header */}
            <div className="p-4 bg-white border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowChannelList(!showChannelList)}
                  className="p-1 hover:bg-gray-100 rounded lg:hidden"
                >
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                <span className="text-xl">{getChannelIcon(selectedChannel.type)}</span>
                <div>
                  <h3 className="font-semibold text-gray-800">{selectedChannel.name}</h3>
                  <p className="text-xs text-gray-500">
                    {selectedChannel.participants.length} participants •{' '}
                    {selectedChannel.participants.filter(p => p.isOnline).length} online
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.map((message, idx) => {
                const isCurrentUser = message.senderId === 'current-user';
                const showAvatar = idx === 0 || messages[idx - 1].senderId !== message.senderId;

                return (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${isCurrentUser ? 'flex-row-reverse' : ''}`}
                  >
                    {showAvatar ? (
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-medium flex-shrink-0 ${
                        isCurrentUser ? 'bg-blue-500' : 'bg-gradient-to-br from-gray-400 to-gray-600'
                      }`}>
                        {message.senderAvatar}
                      </div>
                    ) : (
                      <div className="w-8 flex-shrink-0"></div>
                    )}

                    <div className={`max-w-[70%] ${isCurrentUser ? 'items-end' : 'items-start'}`}>
                      {showAvatar && (
                        <div className={`flex items-center gap-2 mb-1 ${isCurrentUser ? 'flex-row-reverse' : ''}`}>
                          <span className="font-medium text-sm text-gray-800">{message.senderName}</span>
                          <span className="text-xs text-gray-400">{formatTime(message.timestamp)}</span>
                        </div>
                      )}

                      {/* Reply Preview */}
                      {message.replyTo && (
                        <div className="mb-1 p-2 bg-gray-100 border-l-2 border-gray-300 rounded text-xs text-gray-600">
                          <span className="font-medium">{message.replyTo.senderName}</span>
                          <p className="truncate">{message.replyTo.preview}</p>
                        </div>
                      )}

                      {/* Message Content */}
                      <div className={`p-3 rounded-lg ${
                        isCurrentUser
                          ? 'bg-blue-600 text-white'
                          : 'bg-white border border-gray-200 text-gray-800'
                      }`}>
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>

                        {/* Attachments */}
                        {message.attachments && message.attachments.length > 0 && (
                          <div className="mt-2 space-y-1">
                            {message.attachments.map(att => (
                              <a
                                key={att.id}
                                href={att.url}
                                className={`flex items-center gap-2 p-2 rounded ${
                                  isCurrentUser ? 'bg-blue-500 hover:bg-blue-400' : 'bg-gray-50 hover:bg-gray-100'
                                }`}
                              >
                                <span>📎</span>
                                <div className="flex-1 min-w-0">
                                  <div className="text-xs font-medium truncate">{att.name}</div>
                                  <div className={`text-xs ${isCurrentUser ? 'text-blue-200' : 'text-gray-400'}`}>
                                    {formatFileSize(att.size)}
                                  </div>
                                </div>
                              </a>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Reactions */}
                      {message.reactions && message.reactions.length > 0 && (
                        <div className="flex gap-1 mt-1">
                          {message.reactions.map((reaction, rIdx) => (
                            <button
                              key={rIdx}
                              className="flex items-center gap-1 px-2 py-0.5 bg-white border border-gray-200 rounded-full hover:bg-gray-50"
                            >
                              <span>{reaction.emoji}</span>
                              <span className="text-xs text-gray-600">{reaction.count}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 bg-white border-t border-gray-200">
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                </button>
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder={`Message ${selectedChannel.name}...`}
                  className="flex-1 px-4 py-2 bg-gray-100 border-0 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                />
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>
                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <div className="text-4xl mb-4">💬</div>
              <h3 className="text-lg font-medium text-gray-800">Select a channel</h3>
              <p className="text-sm text-gray-500">Choose a channel to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamChatIntegration;

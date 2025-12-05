'use client';

import React, { useState } from 'react';
import { Search, Plus, MoreVertical, Phone, Video, Info, Paperclip, Smile, Send, Check, CheckCheck } from 'lucide-react';

export default function MessagingPage() {
    const [selectedChat, setSelectedChat] = useState('1');
    const [messageInput, setMessageInput] = useState('');

    const chats = [
        { id: '1', name: 'General', type: 'channel', lastMessage: 'Has everyone seen the new update?', time: '10:30 AM', unread: 0 },
        { id: '2', name: 'Project Alpha', type: 'channel', lastMessage: 'Meeting at 2 PM', time: '09:15 AM', unread: 3 },
        { id: '3', name: 'Sarah Wilson', type: 'direct', lastMessage: 'Can you review this doc?', time: 'Yesterday', unread: 0, status: 'online' },
        { id: '4', name: 'Mike Johnson', type: 'direct', lastMessage: 'Thanks for the help!', time: 'Yesterday', unread: 0, status: 'offline' },
    ];

    const messages = [
        { id: 1, sender: 'Sarah Wilson', text: 'Hey team, just a reminder about the deadline tomorrow.', time: '10:00 AM', isMe: false },
        { id: 2, sender: 'You', text: 'Thanks Sarah, I am almost done with my part.', time: '10:05 AM', isMe: true, status: 'read' },
        { id: 3, sender: 'Mike Johnson', text: 'I might need some help with the reporting module.', time: '10:10 AM', isMe: false },
        { id: 4, sender: 'You', text: 'Sure Mike, let\'s sync after lunch.', time: '10:12 AM', isMe: true, status: 'delivered' },
        { id: 5, sender: 'Sarah Wilson', text: 'Great teamwork everyone!', time: '10:30 AM', isMe: false },
    ];

    return (
        <div className="flex h-screen bg-white overflow-hidden">
            {/* Sidebar */}
            <div className="w-80 border-r border-gray-200 flex flex-col">
                <div className="p-4 border-b border-gray-200">
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-xl font-bold text-gray-900">Messages</h1>
                        <button className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100">
                            <Plus className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search messages..."
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {chats.map((chat) => (
                        <button
                            key={chat.id}
                            onClick={() => setSelectedChat(chat.id)}
                            className={`w-full p-4 flex items-start gap-3 hover:bg-gray-50 transition-colors ${selectedChat === chat.id ? 'bg-blue-50 border-r-4 border-blue-600' : ''
                                }`}
                        >
                            <div className="relative">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-semibold ${chat.type === 'channel' ? 'bg-gray-200 text-gray-600' : 'bg-blue-100 text-blue-600'
                                    }`}>
                                    {chat.type === 'channel' ? '#' : chat.name.split(' ').map(n => n[0]).join('')}
                                </div>
                                {chat.status === 'online' && (
                                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                                )}
                            </div>
                            <div className="flex-1 text-left">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="font-semibold text-gray-900">{chat.name}</span>
                                    <span className="text-xs text-gray-500">{chat.time}</span>
                                </div>
                                <p className="text-sm text-gray-600 truncate">{chat.lastMessage}</p>
                            </div>
                            {chat.unread > 0 && (
                                <div className="w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                                    {chat.unread}
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col">
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-white">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-lg font-semibold text-gray-600">
                            #
                        </div>
                        <div>
                            <h2 className="font-bold text-gray-900">General</h2>
                            <p className="text-xs text-gray-500">24 members • 3 online</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                            <Phone className="w-5 h-5" />
                        </button>
                        <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                            <Video className="w-5 h-5" />
                        </button>
                        <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                            <Info className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Messages List */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[70%] ${msg.isMe ? 'order-2' : 'order-1'}`}>
                                <div className={`flex items-end gap-2 ${msg.isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                                    {!msg.isMe && (
                                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold text-blue-600 mb-1">
                                            {msg.sender.split(' ').map(n => n[0]).join('')}
                                        </div>
                                    )}
                                    <div className={`p-4 rounded-2xl shadow-sm ${msg.isMe
                                            ? 'bg-blue-600 text-white rounded-tr-none'
                                            : 'bg-white text-gray-900 rounded-tl-none'
                                        }`}>
                                        <p className="text-sm">{msg.text}</p>
                                    </div>
                                </div>
                                <div className={`flex items-center gap-1 mt-1 ${msg.isMe ? 'justify-end' : 'justify-start ml-10'}`}>
                                    <span className="text-xs text-gray-500">{msg.time}</span>
                                    {msg.isMe && (
                                        <span className="text-blue-600">
                                            {msg.status === 'read' ? <CheckCheck className="w-3 h-3" /> : <Check className="w-3 h-3" />}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Message Input */}
                <div className="p-4 bg-white border-t border-gray-200">
                    <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-xl border border-gray-200">
                        <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-lg transition-colors">
                            <Plus className="w-5 h-5" />
                        </button>
                        <input
                            type="text"
                            value={messageInput}
                            onChange={(e) => setMessageInput(e.target.value)}
                            placeholder="Type a message..."
                            className="flex-1 bg-transparent border-none focus:ring-0 text-gray-900 placeholder-gray-500"
                        />
                        <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-lg transition-colors">
                            <Smile className="w-5 h-5" />
                        </button>
                        <button
                            className={`p-2 rounded-lg transition-colors ${messageInput.trim()
                                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                }`}
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

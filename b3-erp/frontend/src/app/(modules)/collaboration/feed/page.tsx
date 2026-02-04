'use client';

import React, { useState } from 'react';
import { MessageSquare, Heart, Share2, MoreHorizontal, Image, FileText, Send, ThumbsUp, MessageCircle } from 'lucide-react';

export default function ActivityFeedPage() {
    const [posts, setPosts] = useState([
        {
            id: 1,
            author: 'Sarah Wilson',
            role: 'Project Manager',
            time: '2 hours ago',
            content: 'Just deployed the new Q4 roadmap. Great work everyone on hitting the milestones early! 🚀',
            likes: 12,
            comments: 3,
            hasImage: true,
            image: '/api/placeholder/600/300',
        },
        {
            id: 2,
            author: 'Mike Johnson',
            role: 'Lead Developer',
            time: '4 hours ago',
            content: 'The new API documentation is now live. Check it out in the developer portal.',
            likes: 8,
            comments: 1,
            hasImage: false,
        },
        {
            id: 3,
            author: 'System',
            role: 'Automated',
            time: '5 hours ago',
            content: 'Weekly maintenance completed successfully. All systems are operational.',
            likes: 2,
            comments: 0,
            hasImage: false,
            isSystem: true,
        },
    ]);

    const [newPost, setNewPost] = useState('');

    const handlePost = () => {
        if (!newPost.trim()) return;
        const post = {
            id: Date.now(),
            author: 'You',
            role: 'Current User',
            time: 'Just now',
            content: newPost,
            likes: 0,
            comments: 0,
            hasImage: false,
        };
        setPosts([post, ...posts]);
        setNewPost('');
    };

    return (
        <div className="w-full min-h-screen bg-gray-50 px-3 py-2">
            <div className="w-full space-y-3">
                <h1 className="text-2xl font-bold text-gray-900">Activity Feed</h1>

                {/* Create Post */}
                <div className="bg-white rounded-xl border border-gray-200 p-3 shadow-sm">
                    <div className="flex gap-2">
                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                            Y
                        </div>
                        <div className="flex-1">
                            <textarea
                                value={newPost}
                                onChange={(e) => setNewPost(e.target.value)}
                                placeholder="What's on your mind?"
                                className="w-full border-none focus:ring-0 resize-none text-gray-900 placeholder-gray-500 text-lg"
                                rows={2}
                            />
                            <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                                <div className="flex gap-2">
                                    <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg flex items-center gap-2 text-sm font-medium">
                                        <Image className="w-5 h-5 text-green-500" />
                                        Photo
                                    </button>
                                    <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg flex items-center gap-2 text-sm font-medium">
                                        <FileText className="w-5 h-5 text-blue-500" />
                                        File
                                    </button>
                                </div>
                                <button
                                    onClick={handlePost}
                                    disabled={!newPost.trim()}
                                    className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 ${newPost.trim()
                                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        }`}
                                >
                                    <Send className="w-4 h-4" />
                                    Post
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Feed */}
                <div className="space-y-3">
                    {posts.map((post) => (
                        <div key={post.id} className="bg-white rounded-xl border border-gray-200 p-3 shadow-sm">
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex gap-3">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${post.isSystem ? 'bg-gray-500' : 'bg-blue-600'
                                        }`}>
                                        {post.author[0]}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900">{post.author}</h3>
                                        <p className="text-xs text-gray-500">{post.role} • {post.time}</p>
                                    </div>
                                </div>
                                <button className="text-gray-400 hover:text-gray-600">
                                    <MoreHorizontal className="w-5 h-5" />
                                </button>
                            </div>

                            <p className="text-gray-800 mb-2 whitespace-pre-wrap">{post.content}</p>

                            {post.hasImage && (
                                <div className="mb-2 rounded-lg overflow-hidden bg-gray-100 h-64 flex items-center justify-center border border-gray-200">
                                    <Image className="w-12 h-12 text-gray-400" />
                                </div>
                            )}

                            <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                                <button className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors">
                                    <ThumbsUp className="w-5 h-5" />
                                    <span className="text-sm font-medium">{post.likes} Likes</span>
                                </button>
                                <button className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors">
                                    <MessageCircle className="w-5 h-5" />
                                    <span className="text-sm font-medium">{post.comments} Comments</span>
                                </button>
                                <button className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors ml-auto">
                                    <Share2 className="w-5 h-5" />
                                    <span className="text-sm font-medium">Share</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
